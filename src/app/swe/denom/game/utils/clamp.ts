// src/game/utils/clamp.ts
export function clamp(x: number, lo: number, hi: number): number {
  if (x < lo) return lo
  if (x > hi) return hi
  return x
}

export function clamp01(x: number): number {
  return clamp(x, 0, 1)
}

export function clamp0100(x: number): number {
  return clamp(x, 0, 100)
}
