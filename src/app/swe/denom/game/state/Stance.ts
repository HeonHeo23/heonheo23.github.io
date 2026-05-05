// src/game/state/Stance.ts
import { Effect } from "./Effect"

export interface StanceState {
  id: string
  name: string
  description: string
  category?: string
  value: number          // 0 to 1 in pilot, can later switch to -100..100 if you want
  baseCost: number
  costPerPoint: number   // cost per delta
  maxDeltaPerTurn: number
  effects: Effect[]
}