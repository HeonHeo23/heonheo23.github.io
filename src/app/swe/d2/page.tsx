"use client";

import React, { useMemo, useReducer } from "react";
import { pilotPackV2 } from "./content/pilotPackV2";
import { applyChangeStance, endTurn, initGame } from "./lib/graphEngine";
import { GameStateV2 } from "./lib/graphTypes";
import { Dashboard } from "./components/Dashboard";

type Action =
  | { type: "STANCE_SET"; stanceId: string; value: number }
  | { type: "END_TURN" }
  | { type: "RESET" };

function reducer(state: GameStateV2, action: Action): GameStateV2 {
  switch (action.type) {
    case "STANCE_SET":
      return applyChangeStance(pilotPackV2, state, action.stanceId, action.value);
    case "END_TURN":
      return endTurn(pilotPackV2, state);
    case "RESET":
      return initGame(pilotPackV2);
    default:
      return state;
  }
}

export default function Page() {
  const initial = useMemo(() => initGame(pilotPackV2), []);
  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <main className="min-h-screen p-4">
      <Dashboard
        pack={pilotPackV2}
        state={state}
        onSetStance={(stanceId, value) => dispatch({ type: "STANCE_SET", stanceId, value })}
        onEndTurn={() => dispatch({ type: "END_TURN" })}
        onReset={() => dispatch({ type: "RESET" })}
      />
    </main>
  );
}
