// src/game/utils/ids.ts
export function effectKey(sourceId: string, targetId: string): string {
  return `${sourceId}::${targetId}`
}
