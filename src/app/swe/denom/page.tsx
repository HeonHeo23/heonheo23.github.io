// src/app/page.tsx
"use client";

import { pilotScenario } from "./game/data/pilotScenario";
import { useGameState } from "./hooks/useGameState";
import { Dashboard } from "./components/Dashboard";

export default function Page() {
  const { state, selected, actions } = useGameState(pilotScenario);

  return (
    <main className="min-h-screen p-4">
      <Dashboard
        scenario={pilotScenario}
        state={state}
        selected={selected}
        onSelect={actions.setSelected}
        onSetStance={actions.setStance}
        onEndTurn={actions.endTurn}
        onReset={actions.reset}
      />
    </main>
  );
}
