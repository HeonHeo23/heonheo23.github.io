"use client";

import { useMemo, useState } from "react";
import type { GameState } from "./game/types";
import { enactStance, initFromPack, setStanceValue, tick } from "./game/engine";
import { pilotPack } from "./content/pilotPack";
import NodeList from "./components/NodeList";
import { loadGame, saveGame } from "./game/save";

export default function Page() {
  const initial = useMemo(() => initFromPack(pilotPack), []);
  const [state, setState] = useState<GameState>(initial);

  const onSave = () => saveGame(state);

  const onLoad = () => {
    const data = loadGame();
    if (!data) return;

    setState(data.state);
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{pilotPack.title}</div>
            <div className="text-sm opacity-80">{pilotPack.description}</div>
            <div className="opacity-80">Year {state.turn}</div>
          </div>

          <div className="flex gap-2">
            <button className="btn" onClick={onSave}>
              Save
            </button>
            <button className="btn" onClick={onLoad}>
              Load
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                setState((s) => {
                  const r = tick(s, pilotPack.data);
                  console.log(
                    "ui sees active",
                    r.active ?? ["YOUR_SITUATION_ID"]
                  );
                  return r;
                })
              }
            >
              Tick
            </button>
            <button className="btn" onClick={() => setState(initial)}>
              Reset
            </button>
          </div>
        </div>

        <div className="w-full">
          <NodeList
            nodes={pilotPack.data.nodes}
            effects={pilotPack.data.effects}
            values={state.values}
            active={state.active}
            onStanceChange={(id, v) =>
              setState((s) =>
                setStanceValue(
                  s,
                  pilotPack.data.nodes,
                  pilotPack.authority.nodeId,
                  id,
                  v
                )
              )
            }
            onEnactStance={(id) =>
              setState((s) =>
                enactStance(
                  s,
                  pilotPack.data.nodes,
                  pilotPack.authority.nodeId,
                  id
                )
              )
            }
          />
        </div>
      </div>
    </main>
  );
}
