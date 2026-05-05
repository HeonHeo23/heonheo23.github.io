// app/page.tsx
"use client";

import React, { useMemo, useReducer } from "react";
import { pilotPack } from "./content/pilotPack";
import { applyChangeStance, endTurn, initGame } from "./game/engine";
import { GameState } from "./game/simTypes";
import { Dashboard } from "./components/Dashboard";

type Action =
  | { type: "STANCE_SET"; stanceId: string; value: number }
  | { type: "END_TURN" }
  | { type: "RESET" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "STANCE_SET":
      return applyChangeStance(pilotPack, state, action.stanceId, action.value);
    case "END_TURN":
      return endTurn(pilotPack, state);
    case "RESET":
      return initGame(pilotPack);
    default:
      return state;
  }
}

export default function Page() {
  const initial = useMemo(() => initGame(pilotPack), []);
  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <main className="min-h-screen p-4">
      <Dashboard
        pack={pilotPack}
        state={state}
        onSetStance={(stanceId, value) => dispatch({ type: "STANCE_SET", stanceId, value })}
        onEndTurn={() => dispatch({ type: "END_TURN" })}
        onReset={() => dispatch({ type: "RESET" })}
      />
    </main>
  );
}
