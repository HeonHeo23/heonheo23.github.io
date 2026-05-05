// src/components/FactionPanel.tsx
"use client"

import type { Scenario } from "../game/data/pilotScenario"
import type { GameState } from "../game/state/GameState"

type Props = {
  scenario: Scenario
  state: GameState
  onInspect: (factionId: string) => void
}

export function FactionPanel(props: Props) {
  const { state, onInspect } = props
  const deltas = state.lastReport?.factionDeltas ?? {}

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-base font-semibold">Factions</div>
      <div className="mt-3 space-y-2">
        {Object.values(state.factions).map((f) => {
          const d = deltas[f.id] ?? 0
          return (
            <button key={f.id} className="w-full rounded-xl border px-3 py-2 text-left text-sm" onClick={() => onInspect(f.id)}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{f.name}</span>
                <span className="opacity-80">
                  {f.approval.toFixed(1)} ({d >= 0 ? "+" : ""}
                  {d.toFixed(2)})
                </span>
              </div>
              <div className="mt-1 text-xs opacity-70">{f.description}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
