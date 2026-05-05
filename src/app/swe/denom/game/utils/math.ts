// src/game/utils/math.ts
import { clamp01 } from "./clamp"

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function alphaFromInertiaTurns(inertiaTurns?: number): number {
  const t = inertiaTurns && inertiaTurns > 0 ? inertiaTurns : 1
  return 1 / t
}

export function scoreByIdeal01(value01: number, ideal01: number): number {
  const dist = Math.abs(value01 - ideal01)
  return clamp01(1 - dist)
}
