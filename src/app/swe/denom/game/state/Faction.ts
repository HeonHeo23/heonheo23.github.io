// src/game/state/Faction.ts
export interface FactionState {
  id: string
  name: string
  description: string
  category?: string

  approval: number       // 0 to 100 like your original
  influence: number      // weighting

  sensitivities: FactionSensitivity[]
  responsiveness: number // 0 to 1, how fast approval moves per turn
}

export interface FactionSensitivity {
  sourceType: "stance" | "indicator"
  sourceId: string
  weight: number
  ideal?: number
}