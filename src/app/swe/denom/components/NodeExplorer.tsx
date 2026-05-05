// src/components/NodeExplorer.tsx
"use client"

import { useMemo, useState } from "react"
import type { Scenario } from "../game/data/pilotScenario"
import type { GameState, NodeType } from "../game/state/GameState"
import type { SelectedNode } from "../hooks/useGameState"

type Props = {
  scenario: Scenario
  state: GameState
  selected: SelectedNode
  onSelect: (s: SelectedNode) => void
}

export function NodeExplorer(props: Props) {
  const { scenario, state, selected, onSelect } = props
  const [tab, setTab] = useState<NodeType>("indicator")
  const [q, setQ] = useState("")

  const items = useMemo(() => {
    const query = q.trim().toLowerCase()

    if (tab === "stance") {
      return Object.values(state.stances)
        .filter((x) => x.name.toLowerCase().includes(query))
        .map((x) => ({ id: x.id, label: x.name, value: x.value }))
    }

    if (tab === "faction") {
      return Object.values(state.factions)
        .filter((x) => x.name.toLowerCase().includes(query))
        .map((x) => ({ id: x.id, label: x.name, value: x.approval / 100 }))
    }

    if (tab === "resource") {
      return [{ id: "authority", label: "Authority", value: state.authority.current / state.authority.cap }]
    }

    return Object.values(state.indicators)
      .filter((x) => x.name.toLowerCase().includes(query))
      .map((x) => ({ id: x.id, label: x.name, value: x.value }))
  }, [tab, q, state])

  const tabs: NodeType[] = ["indicator", "stance", "faction", "resource"]

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-base font-semibold">Nodes</div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} className="rounded-xl border px-3 py-2 text-sm" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mt-3 space-y-2">
        {items.map((it) => {
          const isSel = selected?.type === tab && selected?.id === it.id
          return (
            <button key={it.id} className="w-full rounded-xl border px-3 py-2 text-left text-sm" onClick={() => onSelect({ type: tab, id: it.id })}>
              <div className="flex items-center justify-between">
                <span className={isSel ? "font-semibold" : ""}>{it.label}</span>
                <span className="opacity-80">{it.value.toFixed(2)}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
