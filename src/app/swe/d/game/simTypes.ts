// lib/simTypes.ts
export type NodeType = "stance" | "indicator" | "faction" | "resource";

export type StanceEffect = {
  targetIndicatorId: string;
  strength: number; // can be positive or negative
  inertiaTurns?: number; // 1 means no smoothing
};

export type Stance = {
  id: string;
  name: string;
  description: string;
  category?: string;
  baseCost: number;
  costPerPoint: number;
  maxDeltaPerTurn: number;
  effects: StanceEffect[];
};

export type Indicator = {
  id: string;
  name: string;
  description: string;
  category?: string;
  startValue: number; // 0 to 1
  maxDeltaPerTurn?: number; // default from engine
};

export type PreferenceRule = {
  sourceType: "indicator" | "stance";
  sourceId: string;
  ideal: number; // 0 to 1
  sensitivity: number; // higher means stronger preference
};

export type Faction = {
  id: string;
  name: string;
  description: string;
  weight: number; // influence weight for scoring
  responsiveness: number; // 0 to 1, how fast approval moves
  preferences: PreferenceRule[];
};

export type PilotPack = {
  version: string;
  title: string;
  turnTarget: number;
  authorityStart: number;
  authorityCap: number;
  authorityBaseIncome: number;
  authorityWeights: {
    legitimacyIndicatorId: string;
    unityIndicatorId: string;
    schismIndicatorId: string;
    integrityIndicatorId: string;
    wLegitimacy: number;
    wUnity: number;
    wSchism: number;
    wIntegrity: number;
  };
  stances: Stance[];
  indicators: Indicator[];
  factions: Faction[];
  initial: {
    stanceValues: Record<string, number>;
    indicatorValues?: Record<string, number>;
    factionApprovals?: Record<string, number>;
  };
};

export type TurnContribution = {
  sourceId: string;
  value: number;
};

export type TurnReport = {
  turn: number;
  indicatorDeltas: Record<string, number>;
  factionDeltas: Record<string, number>;
  indicatorTopSources: Record<string, TurnContribution[]>;
  factionTopDrivers: Record<string, TurnContribution[]>;
  authorityIncome: number;
  authorityBreakdown: Record<string, number>;
};

export type GameState = {
  packVersion: string;
  title: string;
  turn: number;
  authority: number;
  stances: Record<string, number>;
  indicators: Record<string, number>;
  factions: Record<string, number>;
  effectMemory: Record<string, number>;
  history: {
    indicators: Record<string, number[]>;
    factions: Record<string, number[]>;
    authority: number[];
  };
  lastReport: TurnReport | null;
};

export type CanChangeResult = {
  ok: boolean;
  cost: number;
  reasons: string[];
};
