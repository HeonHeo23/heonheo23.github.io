// components/Inspector.tsx
"use client";

import React, { useMemo } from "react";
import { GameState, NodeType, PilotPack } from "../game/simTypes";

type Selected = { type: NodeType; id: string } | null;

type Props = {
  pack: PilotPack;
  state: GameState;
  selected: Selected;
};

export function Inspector(props: Props) {
  const { pack, state, selected } = props;

  const view = useMemo(() => {
    if (!selected) return { title: "Nothing selected", value: 0, history: [] as number[], breakdown: [] as string[] };

    if (selected.type === "stance") {
      const def = pack.stances.find((s) => s.id === selected.id);
      const v = state.stances[selected.id] ?? 0.5;
      return {
        title: def?.name ?? selected.id,
        value: v,
        history: [],
        breakdown: state.lastReport
          ? (state.lastReport.indicatorTopSources
              ? ["Select an indicator to see contributors."]
              : [])
          : ["No report yet."],
      };
    }

    if (selected.type === "indicator") {
      const def = pack.indicators.find((i) => i.id === selected.id);
      const v = state.indicators[selected.id] ?? def?.startValue ?? 0.5;
      const hist = state.history.indicators[selected.id] ?? [];
      const sources = state.lastReport?.indicatorTopSources?.[selected.id] ?? [];
      const breakdown = sources.map((s) => `${s.sourceId}: ${s.value.toFixed(4)}`);
      return { title: def?.name ?? selected.id, value: v, history: hist, breakdown };
    }

    if (selected.type === "faction") {
      const def = pack.factions.find((f) => f.id === selected.id);
      const v = state.factions[selected.id] ?? 0.5;
      const hist = state.history.factions[selected.id] ?? [];
      const drivers = state.lastReport?.factionTopDrivers?.[selected.id] ?? [];
      const breakdown = drivers.map((d) => `${d.sourceId}: ${d.value.toFixed(4)}`);
      return { title: def?.name ?? selected.id, value: v, history: hist, breakdown };
    }

    if (selected.type === "resource") {
      const v = state.authority;
      const hist = state.history.authority ?? [];
      const b = state.lastReport?.authorityBreakdown ?? {};
      const breakdown = Object.keys(b).map((k) => `${k}: ${b[k].toFixed(3)}`);
      return { title: "Authority", value: v, history: hist, breakdown };
    }

    return { title: "Unknown", value: 0, history: [] as number[], breakdown: [] as string[] };
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
