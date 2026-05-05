// src/game/engine/updateFactions.ts
import type { Scenario } from "../data/pilotScenario"
import type { GameState } from "../state/GameState"
import type { TurnContribution } from "../state/TurnReport"
import { clamp0100 } from "../utils/clamp"
import { lerp, scoreByIdeal01 } from "../utils/math"

export interface FactionStepResult {
  nextFactions: GameState["factions"]
  deltas: Record<string, number>
  topDrivers: Record<string, TurnContribution[]>
}

export function updateFactions(scenario: Scenario, state: GameState): FactionStepResult {
  const maxApprovalDeltaPerTurn = 8

  const nextFactions: GameState["factions"] = { ...state.factions }
  const deltas: Record<string, number> = {}
  const topDrivers: Record<string, TurnContribution[]> = {}

  for (const faction of Object.values(state.factions)) {
    const oldA = faction.approval

    let sum = 0
    let sumAbs = 0
    const drivers: TurnContribution[] = []

    for (const s of faction.sensitivities) {
      const src =
        s.sourceType === "stance"
          ? state.stances[s.sourceId]?.value ?? 0.5
          : state.indicators[s.sourceId]?.value ?? 0.5

      const w = s.weight
      sumAbs += Math.abs(w)

      let contrib = 0
      if (typeof s.ideal === "number") {
        const score = scoreByIdeal01(src, s.ideal)
        contrib = score * w
      } else {
        contrib = (src - 0.5) * w
      }

      sum += contrib
      drivers.push({ sourceId: `${s.sourceType}:${s.sourceId}`, value: contrib })
    }

    const normalized = sumAbs > 0 ? sum / sumAbs : 0
    const target = clamp0100(50 + 50 * normalized)

    const moved = lerp(oldA, target, faction.responsiveness)
    const capped = clamp0100(Math.min(oldA + maxApprovalDeltaPerTurn, Math.max(oldA - maxApprovalDeltaPerTurn, moved)))

    nextFactions[faction.id] = { ...faction, approval: capped }
    deltas[faction.id] = capped - oldA

    const sorted = drivers.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    topDrivers[faction.id] = sorted.slice(0, 6)
  }

  return { nextFactions, deltas, topDrivers }
}
