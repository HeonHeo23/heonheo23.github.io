// src/components/StancePanel.tsx
"use client"

import { useMemo, useState } from "react"
import type { Scenario } from "../game/data/pilotScenario"
import type { GameState } from "../game/state/GameState"
import { canChangeStance } from "../game/engine"

type Props = {
  scenario: Scenario
  state: GameState
  onSetStance: (stanceId: string, value: number) => void
  onInspect: (stanceId: string) => void
}

export function StancePanel(props: Props) {
  const { scenario, state, onSetStance, onInspect } = props

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-base font-semibold">Stances</div>
      <div className="mt-3 grid grid-cols-1 gap-3">
        {Object.values(state.stances).map((s) => (
          <StanceCard
            key={s.id}
            scenario={scenario}
            state={state}
            stanceId={s.id}
            onSet={(v) => onSetStance(s.id, v)}
            onInspect={() => onInspect(s.id)}
          />
        ))}
      </div>
    </div>
  )
}

function StanceCard(props: {
  scenario: Scenario
  state: GameState
  stanceId: string
  onSet: (v: number) => void
  onInspect: () => void
}) {
  const { scenario, state, stanceId, onSet, onInspect } = props
  const stance = state.stances[stanceId]
  const current = stance?.value ?? 0.5
  const [draft, setDraft] = useState(current)

  const check = useMemo(() => canChangeStance(scenario, state, stanceId, draft), [scenario, state, stanceId, draft])
  const changed = Math.abs(draft - current) > 1e-9

  if (!stance) return null

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{stance.name}</div>
          <div className="mt-1 text-xs opacity-80">{stance.description}</div>
        </div>
        <button className="rounded-xl border px-3 py-2 text-sm" onClick={onInspect}>
          Inspect
        </button>
      </div>

      <div className="mt-3">
        <input className="w-full" type="range" min={0} max={1} step={0.01} value={draft} onChange={(e) => setDraft(Number(e.target.value))} />
        <div className="mt-1 flex justify-between text-xs opacity-80">
          <span>{current.toFixed(2)} current</span>
          <span>{draft.toFixed(2)} draft</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs">
          {changed ? (
            <>
              <div>Cost {check.cost.toFixed(2)}</div>
              {!check.ok ? <div className="opacity-80">{check.reasons.join(" ")}</div> : null}
            </>
          ) : (
            <div className="opacity-80">Move slider, then commit</div>
          )}
        </div>

        <button className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40" disabled={!changed || !check.ok} onClick={() => onSet(draft)}>
          Commit
        </button>
      </div>
    </div>
  )
}
