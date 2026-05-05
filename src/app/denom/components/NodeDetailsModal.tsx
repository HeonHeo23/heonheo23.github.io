// src/components/NodeDetailsModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Effect, Node } from "../game/types";
import { computeStanceChangeCost } from "../game/engine";
import clsx from "clsx";

type Props = {
  isOpen: boolean;
  node: Node | null;

  values: Record<string, number>;
  nodesById: Record<string, Node>;
  effects: Effect[];

  active?: Record<string, boolean>;

  onAttemptClose: (opts?: { hasUnsavedStance?: boolean }) => boolean;
  onCommitStance?: (id: string, value: number) => void;
  onSelectNodeId?: (id: string) => void;
};

const UNCATEGORIZED = "(uncategorized)";
const DEFAULT_CAUSE_LABEL = "(default)";

function fmt(n: number, digits = 4) {
  if (!Number.isFinite(n)) return "NaN";
  return n.toFixed(digits);
}

type DiscreteLevel = { value: number; label: string };

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function getRangeLabel(node: Node | null, v: number): string | null {
  if (!node?.valueLabels || node.valueLabels.length === 0) return null;
  const hit = node.valueLabels.find((r) => v >= r.min && v <= r.max);
  return hit?.label ?? null;
}

function normalizeLevels(levels: DiscreteLevel[]) {
  return [...levels].sort((a, b) => a.value - b.value);
}

function nearestLevel(levels: DiscreteLevel[], v: number) {
  if (levels.length === 0) return null;
  let best = levels[0];
  let bestD = Math.abs(levels[0].value - v);
  for (let i = 1; i < levels.length; i += 1) {
    const d = Math.abs(levels[i].value - v);
    if (d < bestD) {
      bestD = d;
      best = levels[i];
    }
  }
  return best;
}

export default function NodeDetailsModal(props: Props) {
  const {
    isOpen,
    node,
    values,
    nodesById,
    effects,
    active,
    onAttemptClose,
    onCommitStance,
    onSelectNodeId,
  } = props;

  const stanceSliderEnabled =
    node?.type === "stance" && typeof onCommitStance === "function";

  const selectedValue = values[node?.id ?? ""] ?? 0;

  const [draftStanceValue, setDraftStanceValue] = useState<number>(0);
  const [stanceBaselineValue, setStanceBaselineValue] = useState<number>(0);

  useEffect(() => {
    if (!node) return;
    const v = values[node.id] ?? 0;
    setStanceBaselineValue(v);
    setDraftStanceValue(v);
  }, [node, values]);

  const eps = 1e-9;
  const stanceDirty =
    stanceSliderEnabled &&
    Math.abs(draftStanceValue - stanceBaselineValue) > eps;

  const canSave = stanceSliderEnabled && stanceDirty;

  const effectiveSelectedValue =
    stanceSliderEnabled && node ? draftStanceValue : selectedValue;

  const isNodeActive =
    node == null
      ? null
      : node.type === "indicator" || node.type === "resource"
      ? true
      : node.forcedActive
      ? true
      : node.type === "situation"
      ? active?.[node.id] ?? false
      : active?.[node.id] ?? node.startActive ?? true;

  const currentCost = node?.stanceCost;

  // NOTE: do NOT gate on `selectedValue` (it can be 0)
  const currentStanceChangeCost =
    node && currentCost
      ? computeStanceChangeCost(node, selectedValue, draftStanceValue)
      : null;

  const stanceSpec = node?.type === "stance" ? node.stance : undefined;

  const discreteLevels = useMemo(() => {
    if (!stanceSliderEnabled) return null;
    if (!stanceSpec || stanceSpec.kind !== "discrete") return null;
    return normalizeLevels(stanceSpec.levels);
  }, [stanceSliderEnabled, stanceSpec]);

  const isDiscrete = stanceSliderEnabled && !!discreteLevels;

  const displayLabel = useMemo(() => {
    if (!node) return null;

    // Prefer discrete label if discrete stance
    if (node.type === "stance" && node.stance?.kind === "discrete") {
      const lvls = normalizeLevels(node.stance.levels);
      const near = nearestLevel(lvls, effectiveSelectedValue);
      if (near) return near.label;
    }

    // Otherwise use range label mapping
    return getRangeLabel(node, effectiveSelectedValue);
  }, [node, effectiveSelectedValue]);

  const sliderStep = useMemo(() => {
    if (!stanceSliderEnabled || !node) return 0.01;

    if (stanceSpec?.kind === "continuous") return stanceSpec.step ?? 0.01;

    // Discrete: allow smooth movement but snap to nearest level
    return 0.001;
  }, [stanceSliderEnabled, node, stanceSpec]);

  const onSliderChange = (raw: number) => {
    if (!node) return;
    const bounded = clamp(raw, node.domain.min, node.domain.max);

    if (isDiscrete && discreteLevels) {
      const near = nearestLevel(discreteLevels, bounded);
      setDraftStanceValue(near ? near.value : bounded);
      return;
    }

    setDraftStanceValue(bounded);
  };

  const doClose = () => {
    const ok = onAttemptClose?.({ hasUnsavedStance: stanceDirty }) ?? true;
    if (ok && stanceSliderEnabled) {
      setDraftStanceValue(stanceBaselineValue);
    }
  };

  const onDiscard = () => {
    setDraftStanceValue(stanceBaselineValue);
    onAttemptClose?.({ hasUnsavedStance: false });
  };

  const onSave = () => {
    if (!node || !stanceSliderEnabled) return;
    onCommitStance?.(node.id, draftStanceValue);
    onAttemptClose?.({ hasUnsavedStance: false });
  };

  const { causes, effectsOut } = useMemo(() => {
    if (!node) return { causes: [], effectsOut: [] };

    const sid = node.id;
    const incoming = effects.filter((e) => e.targetId === sid);
    const outgoing = effects.filter((e) => e.sourceId === sid);

    const causesList = incoming.map((e, idx) => {
      const sourceValue =
        e.sourceId === "_default_" ? 1 : values[e.sourceId] ?? 0;
      const contribution = e.magnitude * sourceValue;

      const sourceNode = nodesById[e.sourceId];
      const name =
        e.sourceId === "_default_"
          ? DEFAULT_CAUSE_LABEL
          : sourceNode?.name ?? e.sourceId;

      return {
        key: `in:${idx}:${e.sourceId}:${e.targetId}:${e.magnitude}`,
        otherId: e.sourceId,
        otherName: name,
        magnitude: e.magnitude,
        sourceValue,
        contribution,
      };
    });

    const effectsList = outgoing.map((e, idx) => {
      const targetNode = nodesById[e.targetId];
      const name = targetNode?.name ?? e.targetId;

      const sourceValue = effectiveSelectedValue;
      const contribution = e.magnitude * sourceValue;

      return {
        key: `out:${idx}:${e.sourceId}:${e.targetId}:${e.magnitude}`,
        otherId: e.targetId,
        otherName: name,
        magnitude: e.magnitude,
        sourceValue,
        contribution,
      };
    });

    causesList.sort(
      (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
    );
    effectsList.sort(
      (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
    );

    return { causes: causesList, effectsOut: effectsList };
  }, [node, effects, values, nodesById, effectiveSelectedValue]);

  return (
    <>
      <input
        type="checkbox"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />

      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-box w-11/12 max-w-5xl h-4/5">
          <div className="text-lg font-semibold">{node?.name}</div>
          <div className="mt-2 text-sm opacity-80">{node?.description}</div>

          <div className="mt-4 space-y-2 text-sm">
            <div>
              <b>Id</b> {node?.id}
            </div>
            <div>
              <b>Type</b> {node?.type}
            </div>
            <div>
              <b>Active</b> {node ? String(isNodeActive) : ""}
            </div>
            <div>
              <b>Category</b>{" "}
              {node
                ? node.category?.trim()
                  ? node.category.trim()
                  : UNCATEGORIZED
                : ""}
            </div>

            <div>
              <b>Label</b> {displayLabel ?? "(none)"}
            </div>

            <div>
              <b>Value</b>{" "}
              {Number.isFinite(effectiveSelectedValue)
                ? fmt(effectiveSelectedValue, 4)
                : "NaN"}
              {stanceSliderEnabled && stanceDirty ? " (draft)" : ""}
            </div>
          </div>

          {stanceSliderEnabled && node && (
            <div className="mt-5">
              <div className="text-sm font-semibold">Adjust stance</div>

              <input
                className={clsx("w-full range mt-2", {
                  "range-primary":
                    currentCost == null || currentStanceChangeCost != null,
                  "range-secondary":
                    currentCost != null && currentStanceChangeCost == null,
                })}
                type="range"
                min={node.domain.min}
                max={node.domain.max}
                step={sliderStep}
                value={draftStanceValue}
                onChange={(e) => onSliderChange(Number(e.target.value))}
              />

              {isDiscrete && discreteLevels && (
                <div className="mt-2 px-1">
                  <div className="flex justify-between text-[11px] opacity-80">
                    {discreteLevels.map((lvl) => (
                      <button
                        key={lvl.value}
                        type="button"
                        className={clsx("link link-hover", {
                          "font-bold":
                            Math.abs(lvl.value - draftStanceValue) < 1e-9,
                        })}
                        onClick={() => setDraftStanceValue(lvl.value)}
                        title={String(lvl.value)}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2 text-xs opacity-70">
                <p>
                  {isDiscrete
                    ? `Selected: ${displayLabel ?? "(none)"}`
                    : draftStanceValue.toFixed(2)}
                  {stanceDirty ? " (unsaved)" : ""}
                </p>
                <p>
                  {"Authority Cost - " +
                    (currentCost
                      ? currentStanceChangeCost != null
                        ? currentStanceChangeCost.toFixed(2)
                        : "Out of Bound"
                      : 0)}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-box bg-base-200 p-3">
              <div className="text-sm font-semibold">Causes (incoming)</div>
              <div className="mt-2 overflow-x-auto">
                {causes.length === 0 ? (
                  <div className="text-xs opacity-70">No incoming effects</div>
                ) : (
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>From</th>
                        <th className="text-right">mag</th>
                        <th className="text-right">src</th>
                        <th className="text-right">contrib</th>
                      </tr>
                    </thead>
                    <tbody>
                      {causes.map((c) => (
                        <tr key={c.key}>
                          <td
                            className="max-w-[160px] truncate"
                            title={c.otherName}
                          >
                            {c.otherId === "_default_" || !onSelectNodeId ? (
                              c.otherName
                            ) : (
                              <button
                                type="button"
                                className="link link-hover"
                                onClick={() => onSelectNodeId(c.otherId)}
                              >
                                {c.otherName}
                              </button>
                            )}
                          </td>
                          <td className="text-right">{fmt(c.magnitude, 4)}</td>
                          <td className="text-right">
                            {fmt(c.sourceValue, 4)}
                          </td>
                          <td className="text-right">
                            <span
                              className={
                                c.contribution < 0
                                  ? "text-error"
                                  : "text-success"
                              }
                            >
                              {fmt(c.contribution, 4)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="mt-2 text-xs opacity-70">
                contrib = magnitude × sourceValue
              </div>
            </div>

            <div className="rounded-box bg-base-200 p-3">
              <div className="text-sm font-semibold">Effects (outgoing)</div>
              <div className="mt-2 overflow-x-auto">
                {effectsOut.length === 0 ? (
                  <div className="text-xs opacity-70">No outgoing effects</div>
                ) : (
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>To</th>
                        <th className="text-right">mag</th>
                        <th className="text-right">src</th>
                        <th className="text-right">contrib</th>
                      </tr>
                    </thead>
                    <tbody>
                      {effectsOut.map((c) => (
                        <tr key={c.key}>
                          <td
                            className="max-w-[160px] truncate"
                            title={c.otherName}
                          >
                            {!onSelectNodeId ? (
                              c.otherName
                            ) : (
                              <button
                                type="button"
                                className="link link-hover"
                                onClick={() => onSelectNodeId(c.otherId)}
                              >
                                {c.otherName}
                              </button>
                            )}
                          </td>
                          <td className="text-right">{fmt(c.magnitude, 4)}</td>
                          <td className="text-right">
                            {fmt(c.sourceValue, 4)}
                          </td>
                          <td className="text-right">
                            <span
                              className={
                                c.contribution < 0
                                  ? "text-error"
                                  : "text-success"
                              }
                            >
                              {fmt(c.contribution, 4)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="mt-2 text-xs opacity-70">
                contrib = magnitude × selectedValue
              </div>
            </div>
          </div>

          <div className="modal-action">
            {stanceSliderEnabled ? (
              <>
                <button type="button" className="btn" onClick={onDiscard}>
                  Discard
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onSave}
                  disabled={!canSave}
                >
                  Save
                </button>
              </>
            ) : (
              <button type="button" className="btn" onClick={doClose}>
                Close
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          className="modal-backdrop"
          aria-label="Close"
          onClick={doClose}
        />
      </div>
    </>
  );
}
