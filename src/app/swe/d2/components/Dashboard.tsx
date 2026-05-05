"use client";

import React, { useMemo, useState } from "react";
import { GameStateV2, NodeType, PilotPackV2 } from "../lib/graphTypes";
import { NodeExplorer } from "./NodeExplorer";
import { Inspector } from "./Inspector";
import { StanceCard } from "./StanceCard";

type Props = {
  pack: PilotPackV2;
  state: GameStateV2;
  onSetStance: (stanceId: string, value: number) => void;
  onEndTurn: () => void;
  onReset: () => void;
};

type Selected = { type: NodeType; id: string } | null;

export function Dashboard(props: Props) {
  const { pack, state, onSetStance, onEndTurn, onReset } = props;
  const [selected, setSelected] = useState<Selected>({ type: "resource", id: pack.authorityId });

  const stanceNodes = useMemo(
    () => pack.nodes.filter((n) => n.type === "stance"),
    [pack.nodes],
  );

  const authority = state.values[pack.authorityId] ?? 0;

  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-3 space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="text-lg font-semibold">{state.title}</div>
          <div className="mt-2 text-sm">
            Turn {state.turn} of {pack.turnTarget}
          </div>
          <div className="mt-3 text-sm">
            Authority <span className="font-semibold">{authority.toFixed(2)}</span> / {pack.authorityMax}
          </div>
          {state.lastReport ? (
            <div className="mt-2 text-xs opacity-80">
              Last authority income {state.lastReport.authorityIncome.toFixed(2)}
            </div>
          ) : null}

          <div className="mt-4 flex gap-2">
            <button className="rounded-xl border px-3 py-2" onClick={onEndTurn}>
              End Turn
            </button>
            <button className="rounded-xl border px-3 py-2" onClick={onReset}>
              Reset
            </button>
          </div>
        </div>

        <NodeExplorer pack={pack} state={state} selected={selected} onSelect={setSelected} />
      </section>

      <section className="col-span-6 space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="text-base font-semibold">Stances</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {stanceNodes.map((n) => (
              <StanceCard
                key={n.id}
                pack={pack}
                state={state}
                stanceId={n.id}
                onSet={(v) => onSetStance(n.id, v)}
                onInspect={() => setSelected({ type: "stance", id: n.id })}
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
