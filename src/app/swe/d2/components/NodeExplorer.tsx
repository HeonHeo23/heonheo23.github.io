"use client";

import React, { useMemo, useState } from "react";
import { GameStateV2, NodeType, PilotPackV2 } from "../lib/graphTypes";

type Selected = { type: NodeType; id: string } | null;

type Props = {
  pack: PilotPackV2;
  state: GameStateV2;
  selected: Selected;
  onSelect: (s: Selected) => void;
};

export function NodeExplorer(props: Props) {
  const { pack, state, selected, onSelect } = props;

  const [tab, setTab] = useState<NodeType>("indicator");
  const [q, setQ] = useState("");

  const tabs: NodeType[] = ["indicator", "stance", "faction", "resource"];

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    return pack.nodes
      .filter((n) => n.type === tab)
      .filter((n) => n.name.toLowerCase().includes(query))
      .map((n) => {
        const v = state.values[n.id] ?? n.startValue;
        return { id: n.id, label: n.name, value: v };
      });
  }, [pack.nodes, state.values, tab, q]);

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-base font-semibold">Nodes</div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            className="rounded-xl border px-3 py-2 text-sm"
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-3 space-y-2">
        {items.map((it) => {
          const isSel = selected?.type === tab && selected?.id === it.id;
          return (
            <button
              key={it.id}
              className="w-full rounded-xl border px-3 py-2 text-left text-sm"
              onClick={() => onSelect({ type: tab, id: it.id })}
            >
              <div className="flex items-center justify-between">
                <span className={isSel ? "font-semibold" : ""}>{it.label}</span>
                <span className="opacity-80">{it.value.toFixed(2)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
