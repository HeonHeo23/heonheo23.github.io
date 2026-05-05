// src/game/utils/curves.ts
import type { CurveType } from "../state/Effect"

export function applyCurve(curve: CurveType, x: number): number {
  if (curve === "linear") return x
  if (curve === "exponential") return Math.sign(x) * (x * x)
  if (curve === "threshold") return Math.abs(x) < 0.25 ? 0 : x
  return x
}
