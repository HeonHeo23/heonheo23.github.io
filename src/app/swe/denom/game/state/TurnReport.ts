// src/game/state/TurnReport.ts
export interface TurnContribution {
  sourceId: string
  value: number
}

export interface TurnReport {
  turnResolved: number

  indicatorDeltas: Record<string, number>
  factionDeltas: Record<string, number>

  indicatorTopSources: Record<string, TurnContribution[]>
  factionTopDrivers: Record<string, TurnContribution[]>

  authorityIncome: number
  authorityBreakdown: Record<string, number>
}
