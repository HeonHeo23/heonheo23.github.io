export type NodeType = "stance" | "indicator" | "faction" | "resource" | "situation" | "event";

export interface ValueDomain {
  min: number;
  max: number;
  clamp: boolean;
}

export type StanceCost = {
  base: number; // fixed cost per save
  perPoint: number; // cost per 1.0 delta
  maxDelta?: number; // optional cap
};

export type SituationTriggers = {
  start: number; // active becomes true when value >= start
  stop: number;  // active becomes false when value <= stop
};

export type ValueLabel = {
  min: number;
  max: number;
  label: string;
};

export type DiscreteLevel = {
  value: number;
  label: string;
};

export type StanceSpec =
  | {
      kind: "continuous";
      step?: number; // UI step, default 0.01
    }
  | {
      kind: "discrete";
      levels: DiscreteLevel[]; // values inside domain
    };

// Extend Node (add these optional fields)
export interface Node {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  category?: string;
  domain: ValueDomain;
  stanceCost?: StanceCost;

  // NEW
  stance?: StanceSpec; // only used when type === "stance"
  valueLabels?: ValueLabel[]; // optional range -> label mapping
  situation?: SituationTriggers; // New: only used when type === "situation"
  positive?: boolean;

  // Activation
  startActive?: boolean; // mainly for stance and situation
  forcedActive?: boolean; // mainly for stance

  // Enactment (for inactive stances)
  enactCost?: number; // authority cost to enact
  enactValue?: number; // stance value set on enact (defaults to node default)
}

// export type SpendResult =
//   | { ok: true; spent: number }
//   | { ok: false; reason: string; needed: number; have: number };

export interface Effect {
  sourceId: string;
  targetId: string;

  // Democracy style linear building block
  // contribution = magnitude * sourceValue
  // Use sourceId "_default_" to represent a constant term where sourceValue is 1
  magnitude: number;

  inertiaTurns?: number;
}

export type GameState = {
  turn: number;
  values: Record<string, number>;
  inertia: Record<string, number[]>;
  active: Record<string, boolean>;
};

export type SimData = {
  nodes: Node[];
  effects: Effect[];
};

export type PilotPack = {
  id: string;
  title: string;
  description: string;
  data: SimData;
  initialValues: Record<string, number>;
  authority: {
    nodeId: "authority";
  };
  startTurn: number;
};

// export interface Effect {
//   targetType: NodeType;
//   targetId: string;
//   magnitude: number;
//   inertiaTurns?: number;
// };

// export type Stance = {
//   id: string;
//   name: string;
//   description: string;
//   category?: string;
//   baseCost?: number;
//   costPerPoint?: number;
//   maxDeltaPerTurn: number;
//   effects: Effect[];
// };
