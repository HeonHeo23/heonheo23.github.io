// src/game/data/groups.ts
import type { FactionState } from "../state/Faction"

export const factions: FactionState[] = [
  {
    id: "confessionalists",
    name: "Confessionalists",
    description: "Prefer clarity and strict boundaries.",
    category: "Internal",
    approval: 50,
    influence: 1.0,
    responsiveness: 0.35,
    sensitivities: [
      { sourceType: "indicator", sourceId: "doctrinalClarity", weight: 1.0, ideal: 0.85 },
      { sourceType: "stance", sourceId: "confessionalStrictness", weight: 0.8, ideal: 0.8 },
      { sourceType: "stance", sourceId: "ecumenismOpenness", weight: 0.6, ideal: 0.2 },
    ],
  },
  {
    id: "revivalists",
    name: "Revivalists",
    description: "Prefer vitality over control.",
    category: "Internal",
    approval: 50,
    influence: 0.9,
    responsiveness: 0.4,
    sensitivities: [
      { sourceType: "indicator", sourceId: "spiritualVitality", weight: 1.0, ideal: 0.85 },
      { sourceType: "stance", sourceId: "disciplineEnforcement", weight: 0.6, ideal: 0.25 },
    ],
  },
  {
    id: "institutionalists",
    name: "Institutionalists",
    description: "Prefer integrity, legitimacy, and stability.",
    category: "Internal",
    approval: 50,
    influence: 1.1,
    responsiveness: 0.3,
    sensitivities: [
      { sourceType: "indicator", sourceId: "institutionalIntegrity", weight: 1.0, ideal: 0.8 },
      { sourceType: "indicator", sourceId: "publicLegitimacy", weight: 0.8, ideal: 0.75 },
      { sourceType: "indicator", sourceId: "unityCohesion", weight: 0.8, ideal: 0.75 },
    ],
  },
]
