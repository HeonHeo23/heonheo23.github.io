// src/game/state/Indicator.ts
export type IndicatorState = {
  id: string
  name: string
  description: string
  category?: string

  startValue: number
  maxDeltaPerTurn?: number
}
