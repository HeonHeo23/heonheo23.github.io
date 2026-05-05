// src/components/Dashboard.tsx
"use client"

import type { Scenario } from "../game/data/pilotScenario"
import type { GameState, NodeType } from "../game/state/GameState"
import type { SelectedNode } from "../hooks/useGameState"
import { AuthorityBar } from "./AuthorityBar"
import { StancePanel } from "./StancePanel"
import { IndicatorPanel } from "./IndicatorPanel"
import { FactionPanel } from "./FactionPanel"
import { NodeExplorer } from "./NodeExplorer"
import { InspectorPanel } from "./InspectorPanel"

type Props = {
  scenario: Scenario
  state: GameState
  selected: SelectedNode
  onSelect: (s: SelectedNode) => void
  onSetStance: (stanceId: string, value: number) => void
  onEndTurn: () => void
  onReset: () => void
}

export function Dashboard(props: Props) {
  const { scenario, state, selected, onSelect, onSetStance, onEndTurn, onReset } = props

  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-3 space-y-4">
        <AuthorityBar state={state} onEndTurn={onEndTurn} onReset={onReset} />
        <NodeExplorer scenario={scenario} state={state} selected={selected} onSelect={onSelect} />
      </section>

      <section className="col-span-6 space-y-4">
        <StancePanel scenario={scenario} state={state} onSetStance={onSetStance} onInspect={(id) => onSelect({ type: "stance", id })} />
        <IndicatorPanel scenario={scenario} state={state} onInspect={(id) => onSelect({ type: "indicator", id })} />
        <FactionPanel scenario={scenario} state={state} onInspect={(id) => onSelect({ type: "faction", id })} />
      </section>

      <section className="col-span-3 space-y-4">
        <InspectorPanel scenario={scenario} state={state} selected={selected} />
      </section>
    </div>
  )
}
