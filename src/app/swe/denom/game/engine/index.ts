// src/game/engine/index.ts
import type { Scenario } from "../data/pilotScenario"
import type { GameState } from "../state/GameState"
import type { StanceState } from "../state/Stance"
import type { IndicatorState } from "../state/Indicator"
import type { FactionState } from "../state/Faction"
import { clamp01, clamp } from "../utils/clamp"
import { resolveTurn } from "./resolveTurn"

export interface CanChangeResult {
  ok: boolean
  cost: number
  reasons: string[]
}

function cloneById<T extends { id: string }>(items: T[]): Record<string, T> {
  const out: Record<string, T> = {}
  for (const it of items) out[it.id] = { ...it }
  return out
}

export function initGame(scenario: Scenario): GameState {
  const stanceMap = cloneById<StanceState>(scenario.stances)
  const indicatorMap = cloneById<IndicatorState>(scenario.indicators)
  const factionMap = cloneById<FactionState>(scenario.factions)

  const historyIndicators: Record<string, number[]> = {}
  for (const id of Object.keys(indicatorMap)) historyIndicators[id] = [indicatorMap[id].value]

  const historyFactions: Record<string, number[]> = {}
  for (const id of Object.keys(factionMap)) historyFactions[id] = [factionMap[id].approval]

  const authorityStart = 10
  const authorityCap = 20

  return {
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    title: scenario.title,

    turn: 1,

    authority: {
      current: authorityStart,
      cap: authorityCap,
      incomeLastTurn: 0,
    },

    stances: stanceMap,
    indicators: indicatorMap,
    factions: factionMap,

    effectMemory: {},

    history: {
      indicators: historyIndicators,
      factions: historyFactions,
      authority: [authorityStart],
    },

    lastReport: null,
  }
}

export function canChangeStance(
  scenario: Scenario,
  state: GameState,
  stanceId: string,
  newValue: number,
): CanChangeResult {
  const reasons: string[] = []
  const stance = state.stances[stanceId]
  if (!stance) return { ok: false, cost: 0, reasons: ["Unknown stance."] }

  const nv = clamp01(newValue)
  const delta = Math.abs(nv - stance.value)

  if (delta === 0) return { ok: false, cost: 0, reasons: ["No change."] }
  if (delta > stance.maxDeltaPerTurn + 1e-9) reasons.push("Change exceeds max delta per turn.")

  const cost = stance.baseCost + delta * stance.costPerPoint
  if (cost > state.authority.current + 1e-9) reasons.push("Not enough authority.")

  return { ok: reasons.length === 0, cost, reasons }
}

export function applyStanceChange(
  scenario: Scenario,
  state: GameState,
  stanceId: string,
  newValue: number,
): GameState {
  const check = canChangeStance(scenario, state, stanceId, newValue)
  if (!check.ok) return state

  const stance = state.stances[stanceId]
  if (!stance) return state

  const nv = clamp01(newValue)

  return {
    ...state,
    authority: {
      ...state.authority,
      current: clamp(state.authority.current - check.cost, 0, state.authority.cap),
    },
    stances: {
      ...state.stances,
      [stanceId]: { ...stance, value: nv },
    },
  }
}

export function endTurn(scenario: Scenario, state: GameState): GameState {
  return resolveTurn(scenario, state)
}
