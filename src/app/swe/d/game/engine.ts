// lib/engine.ts
import {
  CanChangeResult,
  GameState,
  PilotPack,
  TurnContribution,
  TurnReport,
} from "./simTypes";

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function clamp(x: number, lo: number, hi: number): number {
  if (x < lo) return lo;
  if (x > hi) return hi;
  return x;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function memoryKey(stanceId: string, targetId: string): string {
  return `${stanceId}::${targetId}`;
}

export function initGame(pack: PilotPack): GameState {
  const indicators: Record<string, number> = {};
  const factions: Record<string, number> = {};
  const stances: Record<string, number> = {};
  const historyIndicators: Record<string, number[]> = {};
  const historyFactions: Record<string, number[]> = {};

  for (const ind of pack.indicators) {
    const start = pack.initial.indicatorValues?.[ind.id] ?? ind.startValue;
    indicators[ind.id] = clamp01(start);
    historyIndicators[ind.id] = [indicators[ind.id]];
  }

  for (const st of pack.stances) {
    const start = pack.initial.stanceValues?.[st.id] ?? 0.5;
    stances[st.id] = clamp01(start);
  }

  for (const f of pack.factions) {
    const start = pack.initial.factionApprovals?.[f.id] ?? 0.5;
    factions[f.id] = clamp01(start);
    historyFactions[f.id] = [factions[f.id]];
  }

  return {
    packVersion: pack.version,
    title: pack.title,
    turn: 1,
    authority: pack.authorityStart,
    stances,
    indicators,
    factions,
    effectMemory: {},
    history: {
      indicators: historyIndicators,
      factions: historyFactions,
      authority: [pack.authorityStart],
    },
    lastReport: null,
  };
}

export function canChangeStance(
  pack: PilotPack,
  state: GameState,
  stanceId: string,
  newValue: number,
): CanChangeResult {
  const reasons: string[] = [];
  const def = pack.stances.find((s) => s.id === stanceId);
  if (!def) return { ok: false, cost: 0, reasons: ["Unknown stance."] };

  const oldValue = state.stances[stanceId] ?? 0.5;
  const nv = clamp01(newValue);
  const delta = Math.abs(nv - oldValue);

  if (delta === 0) return { ok: false, cost: 0, reasons: ["No change."] };
  if (delta > def.maxDeltaPerTurn + 1e-9) reasons.push("Change exceeds max delta per turn.");

  const cost = def.baseCost + delta * def.costPerPoint;
  if (cost > state.authority + 1e-9) reasons.push("Not enough authority.");

  return { ok: reasons.length === 0, cost, reasons };
}

export function applyChangeStance(
  pack: PilotPack,
  state: GameState,
  stanceId: string,
  newValue: number,
): GameState {
  const check = canChangeStance(pack, state, stanceId, newValue);
  if (!check.ok) return state;

  const next: GameState = {
    ...state,
    authority: state.authority - check.cost,
    stances: { ...state.stances, [stanceId]: clamp01(newValue) },
  };
  return next;
}

function computeIndicatorStep(
  pack: PilotPack,
  state: GameState,
): {
  nextIndicators: Record<string, number>;
  deltas: Record<string, number>;
  topSources: Record<string, TurnContribution[]>;
  nextEffectMemory: Record<string, number>;
} {
  const defaultMaxDelta = 0.05;

  const contributions: Record<string, TurnContribution[]> = {};
  const rawSums: Record<string, number> = {};
  const nextMem: Record<string, number> = { ...state.effectMemory };

  for (const ind of pack.indicators) {
    rawSums[ind.id] = 0;
    contributions[ind.id] = [];
  }

  for (const stanceDef of pack.stances) {
    const sVal = state.stances[stanceDef.id] ?? 0.5;
    const centered = sVal - 0.5;

    for (const eff of stanceDef.effects) {
      const raw = centered * eff.strength;
      const inertiaTurns = eff.inertiaTurns && eff.inertiaTurns > 0 ? eff.inertiaTurns : 1;
      const alpha = 1 / inertiaTurns;

      const key = memoryKey(stanceDef.id, eff.targetIndicatorId);
      const prevApplied = nextMem[key] ?? 0;
      const applied = lerp(prevApplied, raw, alpha);
      nextMem[key] = applied;

      rawSums[eff.targetIndicatorId] = (rawSums[eff.targetIndicatorId] ?? 0) + applied;
      contributions[eff.targetIndicatorId].push({ sourceId: stanceDef.id, value: applied });
    }
  }

  const nextIndicators: Record<string, number> = { ...state.indicators };
  const deltas: Record<string, number> = {};
  const topSources: Record<string, TurnContribution[]> = {};

  for (const ind of pack.indicators) {
    const maxDelta = ind.maxDeltaPerTurn ?? defaultMaxDelta;
    const sum = rawSums[ind.id] ?? 0;
    const cappedDelta = clamp(sum, -maxDelta, maxDelta);

    const oldV = state.indicators[ind.id] ?? ind.startValue;
    const newV = clamp01(oldV + cappedDelta);

    nextIndicators[ind.id] = newV;
    deltas[ind.id] = newV - oldV;

    const sorted = [...(contributions[ind.id] ?? [])].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    topSources[ind.id] = sorted.slice(0, 6);
  }

  return { nextIndicators, deltas, topSources, nextEffectMemory: nextMem };
}

function preferenceSatisfaction(
  state: GameState,
  rule: { sourceType: "indicator" | "stance"; sourceId: string; ideal: number; sensitivity: number },
): number {
  const src =
    rule.sourceType === "indicator"
      ? state.indicators[rule.sourceId] ?? 0.5
      : state.stances[rule.sourceId] ?? 0.5;

  const dist = Math.abs(src - rule.ideal);
  const score = 1 - dist;
  return clamp01(score) * rule.sensitivity;
}

function computeFactionStep(
  pack: PilotPack,
  state: GameState,
): {
  nextFactions: Record<string, number>;
  deltas: Record<string, number>;
  topDrivers: Record<string, TurnContribution[]>;
} {
  const maxApprovalDelta = 0.08;
  const nextFactions: Record<string, number> = { ...state.factions };
  const deltas: Record<string, number> = {};
  const topDrivers: Record<string, TurnContribution[]> = {};

  for (const fDef of pack.factions) {
    const oldA = state.factions[fDef.id] ?? 0.5;

    let sum = 0;
    let sumSens = 0;
    const drivers: TurnContribution[] = [];

    for (const pref of fDef.preferences) {
      const contrib = preferenceSatisfaction(state, pref);
      sum += contrib;
      sumSens += pref.sensitivity;

      const srcVal =
        pref.sourceType === "indicator"
          ? state.indicators[pref.sourceId] ?? 0.5
          : state.stances[pref.sourceId] ?? 0.5;

      const dist = Math.abs(srcVal - pref.ideal);
      const signed = (0.5 - dist) * pref.sensitivity;
      drivers.push({ sourceId: `${pref.sourceType}:${pref.sourceId}`, value: signed });
    }

    const satisfaction = sumSens > 0 ? clamp01(sum / sumSens) : 0.5;
    const target = satisfaction;

    const moved = lerp(oldA, target, clamp01(fDef.responsiveness));
    const capped = clamp(moved, oldA - maxApprovalDelta, oldA + maxApprovalDelta);
    const newA = clamp01(capped);

    nextFactions[fDef.id] = newA;
    deltas[fDef.id] = newA - oldA;

    const sorted = drivers.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    topDrivers[fDef.id] = sorted.slice(0, 6);
  }

  return { nextFactions, deltas, topDrivers };
}

function computeAuthorityIncome(pack: PilotPack, indicators: Record<string, number>): { income: number; breakdown: Record<string, number> } {
  const w = pack.authorityWeights;

  const legitimacy = indicators[w.legitimacyIndicatorId] ?? 0.5;
  const unity = indicators[w.unityIndicatorId] ?? 0.5;
  const schism = indicators[w.schismIndicatorId] ?? 0.5;
  const integrity = indicators[w.integrityIndicatorId] ?? 0.5;

  const b: Record<string, number> = {};
  b.base = pack.authorityBaseIncome;
  b.legitimacy = w.wLegitimacy * legitimacy;
  b.unity = w.wUnity * unity;
  b.schismPenalty = -w.wSchism * schism;
  b.integrityPenalty = -w.wIntegrity * (1 - integrity);

  const raw = b.base + b.legitimacy + b.unity + b.schismPenalty + b.integrityPenalty;
  const income = Math.max(0, raw);

  return { income, breakdown: b };
}

export function endTurn(pack: PilotPack, state: GameState): GameState {
  const indicatorStep = computeIndicatorStep(pack, state);

  const midState: GameState = {
    ...state,
    indicators: indicatorStep.nextIndicators,
    effectMemory: indicatorStep.nextEffectMemory,
  };

  const factionStep = computeFactionStep(pack, midState);

  const { income, breakdown } = computeAuthorityIncome(pack, midState.indicators);
  const nextAuthority = clamp(state.authority + income, 0, pack.authorityCap);

  const nextTurn = state.turn + 1;

  const report: TurnReport = {
    turn: state.turn,
    indicatorDeltas: indicatorStep.deltas,
    factionDeltas: factionStep.deltas,
    indicatorTopSources: indicatorStep.topSources,
    factionTopDrivers: factionStep.topDrivers,
    authorityIncome: income,
    authorityBreakdown: breakdown,
  };

  const nextIndicatorsHistory: GameState["history"]["indicators"] = { ...state.history.indicators };
  for (const id of Object.keys(midState.indicators)) {
    nextIndicatorsHistory[id] = [...(nextIndicatorsHistory[id] ?? []), midState.indicators[id]];
  }

  const nextFactionsHistory: GameState["history"]["factions"] = { ...state.history.factions };
  for (const id of Object.keys(factionStep.nextFactions)) {
    nextFactionsHistory[id] = [...(nextFactionsHistory[id] ?? []), factionStep.nextFactions[id]];
  }

  const nextAuthorityHistory = [...state.history.authority, nextAuthority];

  return {
    ...state,
    turn: nextTurn,
    authority: nextAuthority,
    indicators: midState.indicators,
    factions: factionStep.nextFactions,
    history: {
      indicators: nextIndicatorsHistory,
      factions: nextFactionsHistory,
      authority: nextAuthorityHistory,
    },
    lastReport: report,
  };
}
