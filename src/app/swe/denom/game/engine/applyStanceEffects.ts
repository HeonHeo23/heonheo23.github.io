// src/game/engine/applyStanceEffects.ts
import type { Scenario } from "../data/pilotScenario"
import type { GameState } from "../state/GameState"
import type { TurnContribution } from "../state/TurnReport"
import { applyCurve } from "../utils/curves"
import { clamp, clamp01 } from "../utils/clamp"
import { lerp, alphaFromInertiaTurns } from "../utils/math"
import { effectKey } from "../utils/ids"

export interface IndicatorStepResult {
  nextIndicators: GameState["indicators"]
  deltas: Record<string, number>
  topSources: Record<string, TurnContribution[]>
  nextEffectMemory: Record<string, number>
}

export function applyStanceEffects(scenario: Scenario, state: GameState): IndicatorStepResult {
  const rawSums: Record<string, number> = {}
  const contributions: Record<string, TurnContribution[]> = {}
  const nextMem: Record<string, number> = { ...state.effectMemory }

  for (const id of Object.keys(state.indicators)) {
    rawSums[id] = 0
    contributions[id] = []
  }

  for (const stance of Object.values(state.stances)) {
    for (const eff of stance.effects) {
      if (eff.targetType !== "indicator") continue

      const centered = stance.value - 0.5
      const curved = applyCurve(eff.curve, centered)
      const raw = curved * eff.magnitude

      const alpha = alphaFromInertiaTurns(eff.inertiaTurns)
      const key = effectKey(stance.id, eff.targetId)

      const prevApplied = nextMem[key] ?? 0
      const applied = lerp(prevApplied, raw, alpha)
      nextMem[key] = applied

      rawSums[eff.targetId] = (rawSums[eff.targetId] ?? 0) + applied
      contributions[eff.targetId].push({ sourceId: stance.id, value: applied })
    }
  }

  const nextIndicators: GameState["indicators"] = { ...state.indicators }
  const deltas: Record<string, number> = {}
  const topSources: Record<string, TurnContribution[]> = {}

  for (const ind of Object.values(state.indicators)) {
    const sum = rawSums[ind.id] ?? 0
    const capped = clamp(sum, -ind.maxDeltaPerTurn, ind.maxDeltaPerTurn)

    const oldV = ind.value
    const newV = clamp01(oldV + capped)

    nextIndicators[ind.id] = { ...ind, value: newV }
    deltas[ind.id] = newV - oldV

    const sorted = [...(contributions[ind.id] ?? [])].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    topSources[ind.id] = sorted.slice(0, 6)
  }

  return { nextIndicators, deltas, topSources, nextEffectMemory: nextMem }
}
