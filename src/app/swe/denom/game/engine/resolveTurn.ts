// src/game/engine/resolveTurn.ts
import type { Scenario } from "../data/pilotScenario"
import type { GameState } from "../state/GameState"
import type { TurnReport } from "../state/TurnReport"
import { clamp } from "../utils/clamp"
import { applyStanceEffects } from "./applyStanceEffects"
import { updateFactions } from "./updateFactions"
import { computeAuthorityIncome } from "./computeAuthority"

export function resolveTurn(scenario: Scenario, state: GameState): GameState {
  const indicatorStep = applyStanceEffects(scenario, state)

  const midState: GameState = {
    ...state,
    indicators: indicatorStep.nextIndicators,
    effectMemory: indicatorStep.nextEffectMemory,
  }

  const factionStep = updateFactions(scenario, midState)

  const { income, breakdown } = computeAuthorityIncome(scenario, midState.indicators)
  const nextAuthority = clamp(state.authority.current + income, 0, state.authority.cap)

  const report: TurnReport = {
    turnResolved: state.turn,
    indicatorDeltas: indicatorStep.deltas,
    factionDeltas: factionStep.deltas,
    indicatorTopSources: indicatorStep.topSources,
    factionTopDrivers: factionStep.topDrivers,
    authorityIncome: income,
    authorityBreakdown: breakdown,
  }

  const nextIndicatorsHistory: GameState["history"]["indicators"] = { ...state.history.indicators }
  for (const id of Object.keys(midState.indicators)) {
    nextIndicatorsHistory[id] = [...(nextIndicatorsHistory[id] ?? []), midState.indicators[id].value]
  }

  const nextFactionsHistory: GameState["history"]["factions"] = { ...state.history.factions }
  for (const id of Object.keys(factionStep.nextFactions)) {
    nextFactionsHistory[id] = [...(nextFactionsHistory[id] ?? []), factionStep.nextFactions[id].approval]
  }

  const nextAuthorityHistory = [...state.history.authority, nextAuthority]

  return {
    ...state,
    turn: state.turn + 1,
    authority: {
      ...state.authority,
      current: nextAuthority,
      incomeLastTurn: income,
    },
    indicators: midState.indicators,
    factions: factionStep.nextFactions,
    history: {
      indicators: nextIndicatorsHistory,
      factions: nextFactionsHistory,
      authority: nextAuthorityHistory,
    },
    lastReport: report,
  }
}
