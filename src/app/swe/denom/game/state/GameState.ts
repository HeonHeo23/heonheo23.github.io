// src/game/state/GameState.ts
import type { AuthorityConfig } from "./Authority"
import type { FactionState } from "./Faction"
import type { IndicatorState } from "./Indicator"
import type { StanceState } from "./Stance"
import type { TurnReport } from "./TurnReport"

export type NodeType = "stance" | "indicator" | "faction" | "resource"

export interface GameState {
  scenarioId: string
  scenarioVersion: string
  title: string

  turn: number

  authority: AuthorityConfig

  stances: Record<string, StanceState>
  indicators: Record<string, IndicatorState>
  factions: Record<string, FactionState>

  effectMemory: Record<string, number>

  history: {
    indicators: Record<string, number[]>
    factions: Record<string, number[]>
    authority: number[]
  }

  lastReport: TurnReport | null
}
