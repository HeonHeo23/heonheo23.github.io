// src/components/InspectorPanel.tsx
"use client"

import { useMemo } from "react"
import type { Scenario } from "../game/data/pilotScenario"
import type { GameState, NodeType } from "../game/state/GameState"
import type { SelectedNode } from "../hooks/useGameState"

type Props = {
  scenario: Scenario
  state: GameState
  selected: SelectedNode
}

export function InspectorPanel(props: Props) {
  const { scenario, state, selected } = props

  const view = useMemo(() => {
    if (!selected) return { title: "Nothing selected", valueLabel: "", breakdown: [] as string[], history: [] as number[] }

    if (selected.type === "indicator") {
      const def = state.indicators[selected.id]
      const history = state.history.indicators[selected.id] ?? []
      const sources = state.lastReport?.indicatorTopSources?.[selected.id] ?? []
      const breakdown = sources.map((s) => `${s.sourceId}: ${s.value.toFixed(4)}`)
      return { title: def?.name ?? selected.id, valueLabel: (def?.value ?? 0).toFixed(2), breakdown, history }
    }

    if (selected.type === "faction") {
      const def = state.factions[selected.id]
      const history = state.history.factions[selected.id] ?? []
      const drivers = state.lastReport?.factionTopDrivers?.[selected.id] ?? []
      const breakdown = drivers.map((d) => `${d.sourceId}: ${d.value.toFixed(4)}`)
      return { title: def?.name ?? selected.id, valueLabel: (def?.approval ?? 0).toFixed(1), breakdown, history }
    }

    if (selected.type === "stance") {
      const def = state.stances[selected.id]
      return { title: def?.name ?? selected.id, valueLabel: (def?.value ?? 0).toFixed(2), breakdown: ["Select an indicator or faction for drivers."], history: [] }
    }

    if (selected.type === "resource") {
      const b = state.lastReport?.authorityBreakdown ?? {}
      const breakdown = Object.keys(b).map((k) => `${k}: ${b[k].toFixed(3)}`)
      return { title: "Authority", valueLabel: state.authority.current.toFixed(2), breakdown, history: state.history.authority ?? [] }
    }

    return { title: "Unknown", valueLabel: "", breakdown: [] as string[], history: [] as number[] }
  }, [scenario, state, selected])

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-base font-semibold">Inspector</div>

      <div className="mt-2 text-sm font-semibold">{view.title}</div>
      {view.valueLabel ? <div className="mt-1 text-sm opacity-80">Value {view.valueLabel}</div> : null}

      <div className="mt-4">
        <div className="text-sm font-semibold">Breakdown</div>
        <div className="mt-2 space-y-1 text-xs opacity-90">
          {view.breakdown.length ? view.breakdown.map((x, i) => <div key={i}>{x}</div>) : <div>No data yet</div>}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-semibold">History</div>
        <div className="mt-2 text-xs opacity-80">
          {view.history.length ? view.history.slice(-10).map((x) => x.toFixed(2)).join(" , ") : "No history yet"}
        </div>
      </div>
    </div>
  )
}
