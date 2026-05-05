"use client";

import React, { useMemo } from "react";
import { GameStateV2, NodeType, PilotPackV2 } from "../lib/graphTypes";

type Selected = { type: NodeType; id: string } | null;

type Props = {
  pack: PilotPackV2;
  state: GameStateV2;
  selected: Selected;
};

export function Inspector(props: Props) {
  const { pack, state, selected } = props;

  const view = useMemo(() => {
    if (!selected) {
      return { title: "Nothing selected", value: 0, history: [] as number[], breakdown: [] as string[] };
    }

    const node = pack.nodes.find((n) => n.id === selected.id);
    if (!node) {
      return { title: "Unknown", value: 0, history: [] as number[], breakdown: [] as string[] };
    }

    const value = state.values[node.id] ?? node.startValue;
    const history = state.history[node.id] ?? [];

    const contribs = state.lastReport?.topContribs?.[node.id] ?? [];
    const breakdown = contribs.map((c) => `${c.sourceId} via ${c.edgeId}: ${c.value.toFixed(4)}`);

    let extra: string[] = [];
    if (node.id === pack.authorityId && state.lastReport) {
      extra = [`Last income: ${state.lastReport.authorityIncome.toFixed(2)}`];
    }

    return { title: node.name, value, history, breakdown: [...extra, ...breakdown] };
  }, [pack, state, selected]);

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-base font-semibold">Inspector</div>
      <div className="mt-2 text-sm font-semibold">{view.title}</div>
      <div className="mt-1 text-sm opacity-80">Value {view.value.toFixed(2)}</div>

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
  );
}
