// src/game/data/pilotScenario.ts
import type { AuthorityRules } from "../state/Authority"
import type { FactionState } from "../state/Faction"
import type { IndicatorState } from "../state/Indicator"
import type { StanceState } from "../state/Stance"
import { factions } from "./factions"
import { indicators } from "./indicators"
import { stances } from "./stances"

export interface Scenario {
  id: string
  version: string
  title: string
  turnTarget: number

  authorityRules: AuthorityRules

  stances: StanceState[]
  indicators: IndicatorState[]
  factions: FactionState[]
}

export const pilotScenario: Scenario = {
  id: "pilot",
  version: "pilot_v1",
  title: "Pilot Scenario",
  turnTarget: 30,

  authorityRules: {
    baseIncome: 6,
    legitimacyIndicatorId: "publicLegitimacy",
    unityIndicatorId: "unityCohesion",
    schismIndicatorId: "schismPressure",
    integrityIndicatorId: "institutionalIntegrity",
    wLegitimacy: 4,
    wUnity: 3,
    wSchism: 5,
    wIntegrity: 2,
  },

  stances,
  indicators,
  factions,
}
