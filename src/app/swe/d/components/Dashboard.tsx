// components/Dashboard.tsx
"use client";

import React, { useMemo, useState } from "react";
import { PilotPack, GameState, NodeType } from "../game/simTypes";
import { NodeExplorer } from "./NodeExplorer";
import { Inspector } from "./Inspector";
import { StanceCard } from "./StanceCard";

type Props = {
  pack: PilotPack;
  state: GameState;
  onSetStance: (stanceId: string, value: number) => void;
  onEndTurn: () => void;
  onReset: () => void;
};

type Selected = { type: NodeType; id: string } | null;

export function Dashboard(props: Props) {
  const { pack, state, onSetStance, onEndTurn, onReset } = props;
  const [selected, setSelected] = useState<Selected>({ type: "resource", id: "authority" });

  const stanceDefs = useMemo(() => pack.stances, [pack.stances]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-3 space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="text-lg font-semibold">{state.title}</div>
          <div className="mt-2 text-sm">
            Turn {state.turn} of {pack.turnTarget}
          </div>
          <div className="mt-3 text-sm">
            Authority <span className="font-semibold">{state.authority.toFixed(2)}</span> / {pack.authorityCap}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="rounded-xl border px-3 py-2" onClick={onEndTurn}>
              End Turn
            </button>
            <button className="rounded-xl border px-3 py-2" onClick={onReset}>
              Reset
            </button>
          </div>
          {state.lastReport ? (
            <div className="mt-4 text-xs">
              Last income {state.lastReport.authorityIncome.toFixed(2)}
            </div>
          ) : null}
        </div>

        <NodeExplorer pack={pack} state={state} selected={selected} onSelect={setSelected} />
      </section>

      <section className="col-span-6 space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="text-base font-semibold">Stances</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {stanceDefs.map((s) => (
              <StanceCard
                key={s.id}
                def={s}
                value={state.stances[s.id] ?? 0.5}
                authority={state.authority}
                pack={pack}
                state={state}
                onSet={(v) => onSetStance(s.id, v)}
                onInspect={() => setSelected({ type: "stance", id: s.id })}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="col-span-3 space-y-4">
        <Inspector pack={pack} state={state} selected={selected} />
      </section>
    </div>
  );
}
