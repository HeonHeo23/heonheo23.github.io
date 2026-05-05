// src/hooks/useGameState.ts
"use client"

import { useMemo, useReducer } from "react"
import type { GameState, NodeType } from "../game/state/GameState"
import type { Scenario } from "../game/data/pilotScenario"
import { applyStanceChange, endTurn, initGame } from "../game/engine"

export type SelectedNode = { type: NodeType; id: string } | null

type Action =
  | { type: "STANCE_SET"; stanceId: string; value: number }
  | { type: "END_TURN" }
  | { type: "RESET" }
  | { type: "SELECT"; selected: SelectedNode }

type Store = {
  state: GameState
  selected: SelectedNode
}

function makeReducer(scenario: Scenario) {
  return function reducer(store: Store, action: Action): Store {
    if (action.type === "STANCE_SET") {
      return { ...store, state: applyStanceChange(scenario, store.state, action.stanceId, action.value) }
    }
    if (action.type === "END_TURN") {
      return { ...store, state: endTurn(scenario, store.state) }
    }
    if (action.type === "RESET") {
      return { state: initGame(scenario), selected: { type: "resource", id: "authority" } }
    }
    if (action.type === "SELECT") {
      return { ...store, selected: action.selected }
    }
    return store
  }
}

export function useGameState(scenario: Scenario) {
  const initialStore = useMemo<Store>(() => {
    return { state: initGame(scenario), selected: { type: "resource", id: "authority" } }
  }, [scenario])

  const [store, dispatch] = useReducer(makeReducer(scenario), initialStore)

  return {
    state: store.state,
    selected: store.selected,
    actions: {
      setSelected: (selected: SelectedNode) => dispatch({ type: "SELECT", selected }),
      setStance: (stanceId: string, value: number) => dispatch({ type: "STANCE_SET", stanceId, value }),
      endTurn: () => dispatch({ type: "END_TURN" }),
      reset: () => dispatch({ type: "RESET" }),
    },
  }
}
