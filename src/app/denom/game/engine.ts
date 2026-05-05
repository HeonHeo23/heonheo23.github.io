import { GameState, Node, PilotPack, SimData, StanceCost } from "./types";

function findNode(nodes: Node[], id: string): Node | undefined {
  return nodes.find((n) => n.id === id);
}

const defaultValueForNode = (node: Node): number => {
  return (node.domain.min + node.domain.max) / 2;
};

const buildNodeMap = (nodes: Node[]): Record<string, Node> => {
  const map: Record<string, Node> = {};
  for (const n of nodes) map[n.id] = n;
  return map;
};

const clampToDomain = (value: number, node: Node): number => {
  const min = node.domain.min;
  const max = node.domain.max;

  if (value < min) return min;
  if (value > max) return max;
  return value;
};

function effectKey(e: { sourceId: string; targetId: string }, index: number) {
  // index makes it stable without relying on float serialization
  return `${index}:${e.sourceId}->${e.targetId}`;
}

function pushAndAverage(
  history: number[] | undefined,
  x: number,
  turns: number
) {
  const n = Math.max(1, Math.floor(turns));
  const next = history ? [...history, x] : [x];
  while (next.length > n) next.shift();

  let sum = 0;
  for (const v of next) sum += v;

  return { history: next, avg: sum / next.length };
}

function isAlwaysActiveType(n: Node) {
  return n.type === "indicator" || n.type === "resource";
}

function initActive(nodes: Node[]) {
  const active: Record<string, boolean> = {};

  for (const n of nodes) {
    if (isAlwaysActiveType(n)) {
      active[n.id] = true;
      continue;
    }

    if (n.forcedActive) {
      active[n.id] = true;
      continue;
    }

    if (typeof n.startActive === "boolean") {
      active[n.id] = n.startActive;
      continue;
    }

    // Default for stance, faction, situation if not specified
    active[n.id] = true;
  }

  return active;
}

function isActiveNode(state: GameState, node: Node) {
  if (isAlwaysActiveType(node)) return true;
  if (node.forcedActive) return true;
  console.log(node.id)
  return (state.active?.[node.id] ?? node.startActive ?? true) === true;
}

function updateSituationActiveByTriggers(
  nodes: Node[],
  nextValues: Record<string, number>,
  prevActive: Record<string, boolean> | undefined
) {
  const next: Record<string, boolean> = { ...(prevActive ?? {}) };

  for (const n of nodes) {
    if (n.type !== "situation") continue;
    if (!n.situation) continue;

    const start = n.situation.start;
    const stop = n.situation.stop;

    const v =
      typeof nextValues[n.id] === "number"
        ? nextValues[n.id]
        : defaultValueForNode(n);

    const was = next[n.id] ?? n.startActive ?? false;

    if (!was) {
      if (v >= start) next[n.id] = true;
    } else {
      if (v <= stop) next[n.id] = false;
    }
  }

  return next;
}

export const initFromPack = (pack: PilotPack): GameState => {
  return initGame(pack.data.nodes, pack.initialValues, pack.startTurn);
};

export const initGame = (
  nodes: Node[],
  initialValues: Record<string, number> = {},
  startTurn = 1
): GameState => {
  const values: Record<string, number> = {};

  for (const n of nodes) {
    const v =
      typeof initialValues[n.id] === "number"
        ? initialValues[n.id]
        : defaultValueForNode(n);

    values[n.id] = n.domain.clamp ? clampToDomain(v, n) : v;
  }

  for (const k of Object.keys(initialValues)) {
    if (typeof values[k] !== "number") values[k] = initialValues[k];
  }

  const active = initActive(nodes);

  for (const n of nodes) {
    if (n.forcedActive) active[n.id] = true;
    if (isAlwaysActiveType(n)) active[n.id] = true;
  }

  return { turn: startTurn, values, inertia: {}, active };
};

export const tick = (state: GameState, data: SimData): GameState => {
  // Build fast lookup for nodes by id
  const nodeById = buildNodeMap(data.nodes);

  // Inertia stores rolling histories per effect (used for smoothing)
  const prevInertia = state.inertia ?? {};
  const nextInertia: Record<string, number[]> = { ...prevInertia };

  // Active flags from previous tick (or initialized if missing)
  const prevActive = state.active ?? initActive(data.nodes);

  // ---------------------------------------------------------------------------
  // STEP 1: Determine which nodes actually need to be recomputed this tick
  // Only nodes with at least one incoming effect are recomputed
  // ---------------------------------------------------------------------------

  // Determine which targets should be recomputed this tick
  const hasIncoming: Record<string, boolean> = {};
  for (const e of data.effects) {
    const targetNode = nodeById[e.targetId];
    if (!targetNode) continue;

    // Stances are not auto-simulated by effects
    if (targetNode.type === "stance") continue;

    // if (!isActiveNode({ ...state, active: prevActive }, targetNode)) continue;

    // Mark this target as needing recomputation
    hasIncoming[e.targetId] = true;
  }

  // ---------------------------------------------------------------------------
  // STEP 2: Initialize computed values for affected targets
  // Start from the node's default value (midpoint of its domain)
  // Effects will add contributions on top of this base
  // ---------------------------------------------------------------------------

  // Accumulate computed values by target, starting from a base value
  const computed: Record<string, number> = {};
  for (const id of Object.keys(hasIncoming)) {
    const n = nodeById[id];
    if (!n) continue;

    const base = defaultValueForNode(n);
    computed[id] = base;
  }

  // ---------------------------------------------------------------------------
  // STEP 3: Apply all effects as additive contributions
  // ---------------------------------------------------------------------------

  for (let i = 0; i < data.effects.length; i += 1) {
    const e = data.effects[i];

    const targetNode = nodeById[e.targetId];
    const srcNode = nodeById[e.sourceId];
    if (!targetNode) continue;
    if (targetNode.type === "stance") continue;

    // Only recompute nodes that actually have incoming effects
    if (!hasIncoming[e.targetId]) continue;

    if (!isActiveNode({ ...state, active: prevActive }, srcNode)) continue;

    let sourceValue = 0;

    if (e.sourceId === "_default_") {
      sourceValue = 1;
    } else {
      const srcActive = isActiveNode({ ...state, active: prevActive }, srcNode);
      // if (!srcActive) {
      //   sourceValue = 0;
      // } else {
      const raw =
        typeof state.values[e.sourceId] === "number"
          ? state.values[e.sourceId]
          : defaultValueForNode(srcNode);

      sourceValue = srcNode.domain.clamp ? clampToDomain(raw, srcNode) : raw;
      // }
    }

    // -----------------------------------------------------------------------
    // Inertia handling: smooth source values over multiple turns if requested
    // -----------------------------------------------------------------------

    const inertiaTurns = e.inertiaTurns ?? 1;
    let effectiveSource = sourceValue;

    // Stable per-effect key for inertia history
    const k = effectKey(e, i);

    if (inertiaTurns > 1) {
      // Push value into rolling history and average last N turns
      const { history, avg } = pushAndAverage(
        prevInertia[k],
        sourceValue,
        inertiaTurns
      );
      nextInertia[k] = history;
      effectiveSource = avg;
    } else {
      // No inertia: just store the current value
      nextInertia[k] = [sourceValue];
    }

    const contribution = e.magnitude * effectiveSource;

    computed[e.targetId] =
      (computed[e.targetId] ?? defaultValueForNode(targetNode)) + contribution;
  }

  // ---------------------------------------------------------------------------
  // STEP 4: Write computed values back into the next state
  // Nodes without incoming effects keep their previous values
  // ---------------------------------------------------------------------------

  const nextValues: Record<string, number> = { ...state.values };

  // Write computed nodes back, clamped if needed
  for (const targetId of Object.keys(computed)) {
    const targetNode = nodeById[targetId];
    if (!targetNode) continue;

    const raw = computed[targetId];
    nextValues[targetId] = targetNode.domain.clamp
      ? clampToDomain(raw, targetNode)
      : raw;
  }

  // ---------------------------------------------------------------------------
  // STEP 5: Ensure all nodes have valid values
  // - Fill missing values with defaults
  // - Re-clamp everything that requires clamping
  // ---------------------------------------------------------------------------

  for (const n of data.nodes) {
    if (typeof nextValues[n.id] !== "number") {
      const raw = defaultValueForNode(n);
      nextValues[n.id] = n.domain.clamp ? clampToDomain(raw, n) : raw;
    } else if (n.domain.clamp) {
      nextValues[n.id] = clampToDomain(nextValues[n.id], n);
    }
  }

  // ---------------------------------------------------------------------------
  // STEP 6: Update situation activation based on start/stop triggers
  // Uses hysteresis to avoid rapid toggling
  // ---------------------------------------------------------------------------

  const activeWithTriggers = updateSituationActiveByTriggers(
    data.nodes,
    nextValues,
    prevActive
  );

  // Ensure forced active and always active types
  for (const n of data.nodes) {
    if (n.forcedActive) activeWithTriggers[n.id] = true;
    if (isAlwaysActiveType(n)) activeWithTriggers[n.id] = true;
  }

  return {
    turn: state.turn + 1,
    values: nextValues,
    inertia: nextInertia,
    active: activeWithTriggers,
  };
};

export function computeStanceChangeCost(
  stanceNode: Node,
  oldValue: number,
  newValue: number
): number | null {
  if (stanceNode.type !== "stance") return null;

  const costDef: StanceCost | undefined = stanceNode.stanceCost;
  if (!costDef) return null;

  const delta = Math.abs(newValue - oldValue);

  if (typeof costDef.maxDelta === "number" && delta > costDef.maxDelta) {
    return null;
  }

  return costDef.base + costDef.perPoint * delta;
}

export const setStanceValue = (
  state: GameState,
  nodes: Node[],
  authorityId: string,
  stanceId: string,
  newValue: number
): GameState => {
  const stanceNode = findNode(nodes, stanceId);
  if (!stanceNode) return state;
  if (stanceNode.type !== "stance") return state;

  const oldValueRaw = state.values[stanceId] ?? defaultValueForNode(stanceNode);

  const oldValue = stanceNode.domain.clamp
    ? clampToDomain(oldValueRaw, stanceNode)
    : oldValueRaw;

  const desired = stanceNode.domain.clamp
    ? clampToDomain(newValue, stanceNode)
    : newValue;

  const cost = stanceNode.stanceCost
    ? computeStanceChangeCost(stanceNode, oldValue, desired)
    : 0;

  if (cost === null) return state;

  const have = state.values[authorityId] ?? 0;
  if (have + 1e-9 < cost) return state;

  return {
    ...state,
    values: {
      ...state.values,
      [stanceId]: desired,
      [authorityId]: have - cost,
    },
  };
};

export const enactStance = (
  state: GameState,
  nodes: Node[],
  authorityId: string,
  stanceId: string
): GameState => {
  const stanceNode = findNode(nodes, stanceId);
  if (!stanceNode) return state;
  if (stanceNode.type !== "stance") return state;

  if (stanceNode.forcedActive) {
    return {
      ...state,
      active: { ...(state.active ?? {}), [stanceId]: true },
    };
  }

  const currentlyActive =
    (state.active?.[stanceId] ?? stanceNode.startActive ?? true) === true;

  if (currentlyActive) return state;

  const cost = stanceNode.enactCost ?? 0;
  const have = state.values[authorityId] ?? 0;
  if (have + 1e-9 < cost) return state;

  const enactValue =
    typeof stanceNode.enactValue === "number"
      ? stanceNode.enactValue
      : defaultValueForNode(stanceNode);

  const desired = stanceNode.domain.clamp
    ? clampToDomain(enactValue, stanceNode)
    : enactValue;

  return {
    ...state,
    active: { ...(state.active ?? {}), [stanceId]: true },
    values: {
      ...state.values,
      [authorityId]: have - cost,
      [stanceId]: desired,
    },
  };
};
