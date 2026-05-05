// src/game/engine/computeAuthority.ts
import type { Scenario } from "../data/pilotScenario"

export function computeAuthorityIncome(
  scenario: Scenario,
  indicators: Record<string, { value: number }>,
): { income: number; breakdown: Record<string, number> } {
  const r = scenario.authorityRules

  const legitimacy = indicators[r.legitimacyIndicatorId]?.value ?? 0.5
  const unity = indicators[r.unityIndicatorId]?.value ?? 0.5
  const schism = indicators[r.schismIndicatorId]?.value ?? 0.5
  const integrity = indicators[r.integrityIndicatorId]?.value ?? 0.5

  const breakdown: Record<string, number> = {}
  breakdown.base = r.baseIncome
  breakdown.legitimacy = r.wLegitimacy * legitimacy
  breakdown.unity = r.wUnity * unity
  breakdown.schismPenalty = -r.wSchism * schism
  breakdown.integrityPenalty = -r.wIntegrity * (1 - integrity)

  const raw =
    breakdown.base +
    breakdown.legitimacy +
    breakdown.unity +
    breakdown.schismPenalty +
    breakdown.integrityPenalty

  const income = Math.max(0, raw)
  return { income, breakdown }
}
