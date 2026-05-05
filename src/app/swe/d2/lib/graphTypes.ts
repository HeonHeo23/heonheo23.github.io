export type NodeType = "stance" | "indicator" | "faction" | "resource";

export type NodeDef = {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  category?: string;

  startValue: number;

  clampMin?: number;
  clampMax?: number;

  // Per tick delta cap for stability
  // For stance nodes this is not used by the engine
  maxDeltaPerTick?: number;
};

export type SourceTransform =
  | { kind: "centered"; center?: number } // default center 0.5
  | { kind: "raw" }
  | { kind: "inverted" } // 1 - v
  | { kind: "scaled"; min: number; max: number; center?: number }; // normalize then optionally center

export type EdgeRule =
  | {
      kind: "linear";
      strength: number;
      bias?: number;
      gateSourceId?: string; // optional multiplier by another node raw value
    };

export type EdgeDef = {
  id: string;
  sourceId: string;
  targetId: string;

  sourceTransform?: SourceTransform;
  rule: EdgeRule;

  inertiaTurns?: number;
  maxAbsContribution?: number;
};

export type StanceCostDef = {
  baseCost: number;
  costPerPoint: number;
  maxDeltaPerTurn: number;
};

export type PilotPackV2 = {
  version: string;
  title: string;
  turnTarget: number;

  nodes: NodeDef[];
  edges: EdgeDef[];

  stanceCosts: Record<string, StanceCostDef>;

  // Authority is a stock, authorityIncome is a flow
  authorityId: string;
  authorityIncomeId: string;
  authorityMin: number;
  authorityMax: number;

  initialValues?: Record<string, number>;
};

export type TurnContribution = {
  edgeId: string;
  sourceId: string;
  value: number;
};

export type TurnReport = {
  turn: number;
  deltas: Record<string, number>;
  topContribs: Record<string, TurnContribution[]>;
  authorityIncome: number;
};

export type GameStateV2 = {
  packVersion: string;
  title: string;
  turn: number;

  values: Record<string, number>;
  edgeMemory: Record<string, number>;

  history: Record<string, number[]>;
  lastReport: TurnReport | null;
};

export type CanChangeResult = {
  ok: boolean;
  cost: number;
  reasons: string[];
};
