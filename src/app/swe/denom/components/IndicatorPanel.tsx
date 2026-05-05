// src/components/IndicatorPanel.tsx
"use client"

import type { Scenario } from "../game/data/pilotScenario"
import type { GameState } from "../game/state/GameState"

type Props = {
  scenario: Scenario
  state: GameState
  onInspect: (indicatorId: string) => void
}

export function IndicatorPanel(props: Props) {
  const { state, onInspect } = props
  const deltas = state.lastReport?.indicatorDeltas ?? {}

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-base font-semibold">Indicators</div>
      <div className="mt-3 space-y-2">
        {Object.values(state.indicators).map((i) => {
          const d = deltas[i.id] ?? 0
          return (
            <button key={i.id} className="w-full rounded-xl border px-3 py-2 text-left text-sm" onClick={() => onInspect(i.id)}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{i.name}</span>
                <span className="opacity-80">
                  {i.value.toFixed(2)} ({d >= 0 ? "+" : ""}
                  {d.toFixed(3)})
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
