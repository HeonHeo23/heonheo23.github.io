// src/game/data/stances.ts
import type { StanceState } from "../state/Stance"

export const stances: StanceState[] = [
  {
    id: "confessionalStrictness",
    name: "Confessional Strictness",
    description: "How strict boundaries are.",
    category: "Doctrine",
    value: 0.5,
    baseCost: 1,
    costPerPoint: 6,
    maxDeltaPerTurn: 0.2,
    effects: [
      { targetType: "indicator", targetId: "doctrinalClarity", curve: "linear", magnitude: 0.10, inertiaTurns: 3 },
      { targetType: "indicator", targetId: "unityCohesion", curve: "linear", magnitude: -0.08, inertiaTurns: 3 },
      { targetType: "indicator", targetId: "schismPressure", curve: "linear", magnitude: 0.10, inertiaTurns: 2 },
    ],
  },
  {
    id: "disciplineEnforcement",
    name: "Discipline Enforcement",
    description: "How strongly discipline is applied.",
    category: "Governance",
    value: 0.45,
    baseCost: 1,
    costPerPoint: 5,
    maxDeltaPerTurn: 0.25,
    effects: [
      { targetType: "indicator", targetId: "institutionalIntegrity", curve: "linear", magnitude: 0.08, inertiaTurns: 2 },
      { targetType: "indicator", targetId: "unityCohesion", curve: "linear", magnitude: -0.05, inertiaTurns: 2 },
    ],
  },
  {
    id: "seminaryInvestment",
    name: "Seminary Investment",
    description: "Investment in training and education.",
    category: "Institution",
    value: 0.4,
    baseCost: 1,
    costPerPoint: 7,
    maxDeltaPerTurn: 0.2,
    effects: [
      { targetType: "indicator", targetId: "clergyQuality", curve: "linear", magnitude: 0.12, inertiaTurns: 4 },
      { targetType: "indicator", targetId: "publicLegitimacy", curve: "linear", magnitude: 0.04, inertiaTurns: 3 },
    ],
  },
  {
    id: "ecumenismOpenness",
    name: "Ecumenism Openness",
    description: "Willingness to cooperate across lines.",
    category: "Society",
    value: 0.35,
    baseCost: 1,
    costPerPoint: 5,
    maxDeltaPerTurn: 0.25,
    effects: [
      { targetType: "indicator", targetId: "publicLegitimacy", curve: "linear", magnitude: 0.08, inertiaTurns: 2 },
      { targetType: "indicator", targetId: "doctrinalClarity", curve: "linear", magnitude: -0.06, inertiaTurns: 2 },
      { targetType: "indicator", targetId: "unityCohesion", curve: "linear", magnitude: 0.05, inertiaTurns: 2 },
    ],
  },
]
