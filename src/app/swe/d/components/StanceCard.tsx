// components/StanceCard.tsx
"use client";

import React, { useMemo, useState } from "react";
import { PilotPack, GameState, Stance } from "../game/simTypes";
import { canChangeStance } from "../game/engine";

type Props = {
  def: Stance;
  value: number;
  authority: number;
  pack: PilotPack;
  state: GameState;
  onSet: (v: number) => void;
  onInspect: () => void;
};

export function StanceCard(props: Props) {
  const { def, value, pack, state, onSet, onInspect } = props;
  const [draft, setDraft] = useState<number>(value);

  const check = useMemo(() => canChangeStance(pack, state, def.id, draft), [pack, state, def.id, draft]);

  const changed = Math.abs(draft - value) > 1e-9;

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{def.name}</div>
          <div className="mt-1 text-xs opacity-80">{def.description}</div>
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
          <span>{value.toFixed(2)} current</span>
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
