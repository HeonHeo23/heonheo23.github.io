import {
  CanChangeResult,
  EdgeDef,
  GameStateV2,
  NodeDef,
  NodeType,
  PilotPackV2,
  TurnContribution,
  TurnReport,
} from "./graphTypes";

function clamp(x: number, lo: number, hi: number): number {
  if (x < lo) return lo;
  if (x > hi) return hi;
  return x;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getNode(pack: PilotPackV2, id: string): NodeDef {
  const n = pack.nodes.find((x) => x.id === id);
  if (!n) throw new Error(`Unknown node id: ${id}`);
  return n;
}

function defaultClampMin(n: NodeDef): number {
  return n.clampMin ?? 0;
}

function defaultClampMax(n: NodeDef): number {
  return n.clampMax ?? 1;
}

function defaultMaxDeltaForType(t: NodeType): number {
  if (t === "indicator") return 0.05;
  if (t === "faction") return 0.08;
  if (t === "resource") return 2.0;
  return 0;
}

function transformSource(
  srcVal: number,
  tf: EdgeDef["sourceTransform"] | undefined,
): number {
  if (!tf || tf.kind === "centered") {
    const center = tf && tf.kind === "centered" && typeof tf.center === "number" ? tf.center : 0.5;
    return srcVal - center;
  }

  if (tf.kind === "raw") return srcVal;
  if (tf.kind === "inverted") return 1 - srcVal;

  if (tf.kind === "scaled") {
    const norm = (srcVal - tf.min) / (tf.max - tf.min);
    const clamped = clamp(norm, 0, 1);
    if (typeof tf.center === "number") return clamped - tf.center;
    return clamped;
  }

  return srcVal - 0.5;
}

function evalRule(
  rule: EdgeDef["rule"],
  x: number,
  values: Record<string, number>,
): number {
  if (rule.kind === "linear") {
    const bias = rule.bias ?? 0;
    let out = bias + rule.strength * x;

    if (rule.gateSourceId) {
      const g = values[rule.gateSourceId] ?? 0;
      out *= g;
    }
    return out;
  }

  return 0;
}

function topByAbs(list: TurnContribution[], take: number): TurnContribution[] {
  const sorted = [...list].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  return sorted.slice(0, take);
}

function edgesTargetingType(pack: PilotPackV2, type: NodeType): EdgeDef[] {
  return pack.edges.filter((e) => getNode(pack, e.targetId).type === type);
}

function nodesOfType(pack: PilotPackV2, type: NodeType): NodeDef[] {
  return pack.nodes.filter((n) => n.type === type);
}

export function initGame(pack: PilotPackV2): GameStateV2 {
  const values: Record<string, number> = {};
  const history: Record<string, number[]> = {};

  for (const node of pack.nodes) {
    const start = pack.initialValues?.[node.id] ?? node.startValue;
    const v = clamp(start, defaultClampMin(node), defaultClampMax(node));
    values[node.id] = v;
    history[node.id] = [v];
  }

  // Ensure authority is within caps
  values[pack.authorityId] = clamp(values[pack.authorityId], pack.authorityMin, pack.authorityMax);
  history[pack.authorityId] = [values[pack.authorityId]];

  return {
    packVersion: pack.version,
    title: pack.title,
    turn: 1,
    values,
    edgeMemory: {},
    history,
    lastReport: null,
  };
}

export function canChangeStance(
  pack: PilotPackV2,
  state: GameStateV2,
  stanceId: string,
  newValue: number,
): CanChangeResult {
  const reasons: string[] = [];

  const stanceNode = getNode(pack, stanceId);
  if (stanceNode.type !== "stance") return { ok: false, cost: 0, reasons: ["Target is not a stance node."] };

  const costDef = pack.stanceCosts[stanceId];
  if (!costDef) return { ok: false, cost: 0, reasons: ["Missing stance cost definition."] };

  const oldValue = state.values[stanceId] ?? stanceNode.startValue;
  const nv = clamp(newValue, 0, 1);
  const delta = Math.abs(nv - oldValue);

  if (delta === 0) return { ok: false, cost: 0, reasons: ["No change."] };
  if (delta > costDef.maxDeltaPerTurn + 1e-9) reasons.push("Change exceeds max delta per turn.");

  const cost = costDef.baseCost + delta * costDef.costPerPoint;

  const authority = state.values[pack.authorityId] ?? 0;
  if (cost > authority + 1e-9) reasons.push("Not enough authority.");

  return { ok: reasons.length === 0, cost, reasons };
}

export function applyChangeStance(
  pack: PilotPackV2,
  state: GameStateV2,
  stanceId: string,
  newValue: number,
): GameStateV2 {
  const check = canChangeStance(pack, state, stanceId, newValue);
  if (!check.ok) return state;

  const nv = clamp(newValue, 0, 1);
  const nextValues = { ...state.values };

  const authorityOld = nextValues[pack.authorityId] ?? 0;
  nextValues[pack.authorityId] = clamp(authorityOld - check.cost, pack.authorityMin, pack.authorityMax);

  nextValues[stanceId] = nv;

  // Also append stance history immediately so UI shows commitment
  const nextHistory = { ...state.history };
  nextHistory[stanceId] = [...(nextHistory[stanceId] ?? []), nv];
  nextHistory[pack.authorityId] = [...(nextHistory[pack.authorityId] ?? []), nextValues[pack.authorityId]];

  return {
    ...state,
    values: nextValues,
    history: nextHistory,
  };
}

function applyTargetTypeStep(
  pack: PilotPackV2,
  state: GameStateV2,
  targetType: NodeType,
  deltasOut: Record<string, number>,
  topContribsOut: Record<string, TurnContribution[]>,
): { nextState: GameStateV2 } {
  const targets = nodesOfType(pack, targetType);

  const sums: Record<string, number> = {};
  const contribs: Record<string, TurnContribution[]> = {};
  for (const t of targets) {
    sums[t.id] = 0;
    contribs[t.id] = [];
  }

  const eligibleEdges = edgesTargetingType(pack, targetType);

  const nextEdgeMemory: Record<string, number> = { ...state.edgeMemory };

  for (const e of eligibleEdges) {
    const srcVal = state.values[e.sourceId] ?? getNode(pack, e.sourceId).startValue;
    const x = transformSource(srcVal, e.sourceTransform);
    const raw = evalRule(e.rule, x, state.values);

    const inertiaTurns = e.inertiaTurns && e.inertiaTurns > 0 ? e.inertiaTurns : 1;
    const alpha = 1 / inertiaTurns;

    const prev = nextEdgeMemory[e.id] ?? 0;
    const smoothed = lerp(prev, raw, alpha);

    const capped = typeof e.maxAbsContribution === "number" ? clamp(smoothed, -e.maxAbsContribution, e.maxAbsContribution) : smoothed;
    nextEdgeMemory[e.id] = capped;

    const targetId = e.targetId;
    if (typeof sums[targetId] !== "number") continue;

    sums[targetId] += capped;
    contribs[targetId].push({ edgeId: e.id, sourceId: e.sourceId, value: capped });
  }

  const nextValues: Record<string, number> = { ...state.values };

  for (const t of targets) {
    // Do not update authority stock here
    if (targetType === "resource" && t.id === pack.authorityId) continue;

    const oldV = state.values[t.id] ?? t.startValue;

    const maxDelta = t.maxDeltaPerTick ?? defaultMaxDeltaForType(targetType);
    const delta = clamp(sums[t.id] ?? 0, -maxDelta, maxDelta);

    const newV = clamp(oldV + delta, defaultClampMin(t), defaultClampMax(t));

    nextValues[t.id] = newV;
    deltasOut[t.id] = newV - oldV;
    topContribsOut[t.id] = topByAbs(contribs[t.id] ?? [], 6);
  }

  const nextState: GameStateV2 = {
    ...state,
    values: nextValues,
    edgeMemory: nextEdgeMemory,
  };

  return { nextState };
}

export function endTurn(pack: PilotPackV2, state: GameStateV2): GameStateV2 {
  const deltas: Record<string, number> = {};
  const topContribs: Record<string, TurnContribution[]> = {};

  // Step 1: indicators
  const s1 = applyTargetTypeStep(pack, state, "indicator", deltas, topContribs).nextState;

  // Step 2: factions
  const s2 = applyTargetTypeStep(pack, s1, "faction", deltas, topContribs).nextState;

  // Step 3: resources except authority stock
  const s3 = applyTargetTypeStep(pack, s2, "resource", deltas, topContribs).nextState;

  // Update authority stock using authorityIncome
  const authorityOld = s3.values[pack.authorityId] ?? 0;
  const authorityIncome = s3.values[pack.authorityIncomeId] ?? 0;
  const authorityNew = clamp(authorityOld + authorityIncome, pack.authorityMin, pack.authorityMax);

  const nextValues = { ...s3.values, [pack.authorityId]: authorityNew };

  const report: TurnReport = {
    turn: state.turn,
    deltas,
    topContribs,
    authorityIncome,
  };

  const nextHistory: Record<string, number[]> = { ...s3.history };
  for (const n of pack.nodes) {
    const v = nextValues[n.id] ?? n.startValue;
    nextHistory[n.id] = [...(nextHistory[n.id] ?? []), v];
  }

  const nextTurn = state.turn + 1;

  return {
    ...s3,
    turn: nextTurn,
    values: nextValues,
    history: nextHistory,
    lastReport: report,
  };
}
