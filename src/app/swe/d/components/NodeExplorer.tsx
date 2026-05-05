// components/NodeExplorer.tsx
"use client";

import React, { useMemo, useState } from "react";
import { GameState, NodeType, PilotPack } from "../game/simTypes";

type Selected = { type: NodeType; id: string } | null;

type Props = {
  pack: PilotPack;
  state: GameState;
  selected: Selected;
  onSelect: (s: Selected) => void;
};

export function NodeExplorer(props: Props) {
  const { pack, state, selected, onSelect } = props;
  const [tab, setTab] = useState<NodeType>("indicator");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();

    if (tab === "stance") {
      return pack.stances
        .filter((x) => x.name.toLowerCase().includes(query))
        .map((x) => ({ id: x.id, label: x.name, value: state.stances[x.id] ?? 0.5 }));
    }

    if (tab === "faction") {
      return pack.factions
        .filter((x) => x.name.toLowerCase().includes(query))
        .map((x) => ({ id: x.id, label: x.name, value: state.factions[x.id] ?? 0.5 }));
    }

    if (tab === "resource") {
      return [{ id: "authority", label: "Authority", value: state.authority / pack.authorityCap }];
    }

    return pack.indicators
      .filter((x) => x.name.toLowerCase().includes(query))
      .map((x) => ({ id: x.id, label: x.name, value: state.indicators[x.id] ?? x.startValue }));
  }, [tab, q, pack, state]);

  const tabs: NodeType[] = ["indicator", "stance", "faction", "resource"];

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
