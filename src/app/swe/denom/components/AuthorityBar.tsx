// src/components/AuthorityBar.tsx
"use client"

import type { GameState } from "../game/state/GameState"

type Props = {
  state: GameState
  onEndTurn: () => void
  onReset: () => void
}

export function AuthorityBar(props: Props) {
  const { state, onEndTurn, onReset } = props

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-lg font-semibold">{state.title}</div>
      <div className="mt-2 text-sm">Turn {state.turn}</div>

      <div className="mt-3 text-sm">
        Authority <span className="font-semibold">{state.authority.current.toFixed(2)}</span> / {state.authority.cap}
      </div>

      <div className="mt-2 text-xs opacity-80">Last income {state.authority.incomeLastTurn.toFixed(2)}</div>

      <div className="mt-4 flex gap-2">
        <button className="rounded-xl border px-3 py-2 text-sm" onClick={onEndTurn}>
          End Turn
        </button>
        <button className="rounded-xl border px-3 py-2 text-sm" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  )
}
