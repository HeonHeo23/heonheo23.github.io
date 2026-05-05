export type CurveType = "linear" | "exponential" | "threshold"

export type TargetType = "indicator" | "faction" | "authority"

export interface Effect {
  targetType: TargetType
  targetId: string
  curve: CurveType
  magnitude: number
  inertiaTurns?: number
}
