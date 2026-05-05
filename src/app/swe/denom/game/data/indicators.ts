// src/game/data/indicators.ts
import type { IndicatorState } from "../state/Indicator"

export const indicators: IndicatorState[] = [
  { id: "doctrinalClarity", name: "Doctrinal Clarity", value: 0.5, maxDeltaPerTurn: 0.05 },
  { id: "spiritualVitality", name: "Spiritual Vitality", value: 0.5, maxDeltaPerTurn: 0.05 },
  { id: "institutionalIntegrity", name: "Institutional Integrity", value: 0.6, maxDeltaPerTurn: 0.05 },
  { id: "unityCohesion", name: "Unity Cohesion", value: 0.55, maxDeltaPerTurn: 0.05 },
  { id: "schismPressure", name: "Schism Pressure", value: 0.35, maxDeltaPerTurn: 0.05 },
  { id: "publicLegitimacy", name: "Public Legitimacy", value: 0.5, maxDeltaPerTurn: 0.05 },
  { id: "clergyQuality", name: "Clergy Quality", value: 0.45, maxDeltaPerTurn: 0.05 },
]
