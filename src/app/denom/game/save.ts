// src/game/save.ts
import type { GameState } from "./types";

const SAVE_KEY = "church-sim-save:v1";

export type SavePayload = {
  version: 1;
  savedAt: string;
  state: GameState;
};

export function saveGame(state: GameState) {
  const payload: SavePayload = {
    version: 1,
    savedAt: new Date().toISOString(),
    state,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

export function loadGame(): SavePayload | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SavePayload>;
    if (parsed.version !== 1) return null;
    if (!parsed.state || typeof parsed.state !== "object") return null;

    const s = parsed.state as Partial<GameState>;

    const turn = typeof s.turn === "number" ? s.turn : 1;

    const values =
      s.values && typeof s.values === "object"
        ? (s.values as Record<string, number>)
        : {};

    const active =
      s.active && typeof s.active === "object"
        ? (s.active as Record<string, boolean>)
        : {};

    const inertia =
      s.inertia && typeof s.inertia === "object"
        ? (s.inertia as Record<string, number[]>)
        : {};

    return {
      version: 1,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
      state: {
        turn,
        values,
        active,
        inertia,
      } as GameState,
    };
  } catch {
    return null;
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
