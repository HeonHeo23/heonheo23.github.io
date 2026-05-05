"use client";

import React, { useMemo, useState } from "react";
import { GameStateV2, PilotPackV2 } from "../lib/graphTypes";
import { canChangeStance } from "../lib/graphEngine";

type Props = {
  pack: PilotPackV2;
  state: GameStateV2;
  stanceId: string;
  onSet: (v: number) => void;
  onInspect: () => void;
};

export function StanceCard(props: Props) {
  const { pack, state, stanceId, onSet, onInspect } = props;

  const node = pack.nodes.find((n) => n.id === stanceId)!;
  const current = state.values[stanceId] ?? node.startValue;

  const [draft, setDraft] = useState<number>(current);

  const check = useMemo(
    () => canChangeStance(pack, state, stanceId, draft),
    [pack, state, stanceId, draft],
  );

  const changed = Math.abs(draft - current) > 1e-9;

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{node.name}</div>
          <div className="mt-1 text-xs opacity-80">{node.description}</div>
        </div>
        <button className="rounded-xl border px-3 py-2 text-sm" onClick={onInspect}>
          Inspect
        </button>
      </div>

      <div className="mt-3">
        <input
          className="w-full"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={draft}
          onChange={(e) => setDraft(Number(e.target.value))}
        />
        <div className="mt-1 flex justify-between text-xs opacity-80">
          <span>{current.toFixed(2)} current</span>
          <span>{draft.toFixed(2)} draft</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs">
          {changed ? (
            <>
              <div>Cost {check.cost.toFixed(2)}</div>
              {!check.ok ? <div className="opacity-80">{check.reasons.join(" ")}</div> : null}
            </>
          ) : (
            <div className="opacity-80">Move slider, then commit</div>
          )}
        </div>

        <button
          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40"
          disabled={!changed || !check.ok}
          onClick={() => onSet(draft)}
        >
          Commit
        </button>
      </div>
    </div>
  );
}
