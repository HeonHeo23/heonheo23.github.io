"use client";
import {
  JSX,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Effect, Node } from "../game/types";
import NodeCard from "./NodeCard";
import { computeStanceChangeCost } from "../game/engine";
import clsx from "clsx";

type Props = {
  nodes: Node[];
  effects: Effect[];
  values: Record<string, number>;
  cardWidth?: number;
  gap?: number;
  onStanceChange?: (id: string, value: number) => void;
};

type Position = {
  x: number;
  y: number;
};

const UNCATEGORIZED = "(uncategorized)";

const buildEdgePathStraight = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => `M ${startX} ${startY} L ${endX} ${endY}`;

const ArrowDefs = () => (
  <defs>
    <marker
      id="arrow"
      markerWidth="8"
      markerHeight="8"
      refX="5"
      refY="3"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
    </marker>
  </defs>
);

function renderEdge(
  e: Effect,
  from: Position,
  to: Position,
  hoveredId: string | null
) {
  const isActive =
    hoveredId !== null &&
    (e.sourceId === hoveredId || e.targetId === hoveredId);

  const connectedIds =
    hoveredId === null
      ? []
      : e.sourceId === hoveredId
      ? [e.targetId]
      : e.targetId === hoveredId
      ? [e.sourceId]
      : [];

  const magAbs = Math.abs(e.magnitude) * 10;
  const baseWidth = Math.min(6, 1.5 + magAbs * 0.75);

  return {
    active: isActive,
    connectedIds,
    path: (
      <path
        key={`${e.sourceId}->${e.targetId}:${e.magnitude}`}
        d={buildEdgePathStraight(from.x, from.y, to.x, to.y)}
        fill="none"
        stroke="currentColor"
        strokeWidth={isActive ? Math.max(3, baseWidth + 1.25) : baseWidth}
        opacity={isActive ? 0.9 : 0.0}
        strokeDasharray={e.magnitude < 0 ? "6 5" : undefined}
        markerEnd="url(#arrow)"
        className={isActive ? "text-primary" : "text-base-content"}
      />
    ),
  };
}

export default function GraphVisualizer({
  nodes,
  effects,
  values,
  cardWidth = 220,
  gap = 18,
  onStanceChange,
}: Props) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [draftStanceValue, setDraftStanceValue] = useState<number>(0);
  const [stanceBaselineValue, setStanceBaselineValue] = useState<number>(0);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardElsRef = useRef<Record<string, HTMLElement | null>>({});

  const measureLayoutRef = useRef<() => void>(() => {});

  const [overlaySize, setOverlaySize] = useState({ w: 0, h: 0 });
  const [positionById, setPositionById] = useState<Record<string, Position>>(
    {}
  );

  // --- Category list (derived) ---
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const n of nodes) {
      set.add(n.category?.trim() ? n.category.trim() : UNCATEGORIZED);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [nodes]);

  // --- Selected categories state (default all) ---
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set<string>()
  );

  // Initialize / refresh category selection to "all" when categories change.
  // Keeps existing selections if possible, but also auto selects new categories.
  useEffect(() => {
    setSelectedCategories((prev) => {
      if (categories.length === 0) return new Set<string>();

      // First mount: select all
      if (prev.size === 0) return new Set(categories);

      const next = new Set<string>();
      for (const c of categories) {
        if (prev.has(c)) next.add(c);
      }

      // If user had some selection but now none remain, default back to all
      if (next.size === 0) return new Set(categories);

      // Auto include new categories only if previously "all" was selected
      const prevWasAll =
        prev.size === categories.length - 1 || prev.size === categories.length;
      // if (prevWasAll) return new Set(categories);

      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.join("|")]);

  const isCategoryEnabled = (n: Node) => {
    const c = n.category?.trim() ? n.category.trim() : UNCATEGORIZED;
    return selectedCategories.has(c);
  };

  const sortedNodes = useMemo(() => {
    const filtered = nodes.filter(isCategoryEnabled);

    return [...filtered].sort((a, b) => {
      const t = a.type.localeCompare(b.type);
      return t !== 0 ? t : a.name.localeCompare(b.name);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, selectedCategories]);

  const visibleNodeIdSet = useMemo(() => {
    return new Set(sortedNodes.map((n) => n.id));
  }, [sortedNodes]);

  const isModalOpen = selectedNode !== null;

  const stanceSliderEnabled =
    selectedNode?.type === "stance" && typeof onStanceChange === "function";

  const selectedValue = values[selectedNode?.id ?? ""] ?? 0;

  const currentCost = selectedNode?.stanceCost;
  const currentStanceChangeCost =
    selectedNode && selectedValue
      ? computeStanceChangeCost(selectedNode, selectedValue, draftStanceValue)
      : null;

  const eps = 1e-9;
  const stanceDirty =
    stanceSliderEnabled &&
    Math.abs(draftStanceValue - stanceBaselineValue) > eps;

  const canSave = stanceSliderEnabled && stanceDirty;

  const registerCardEl = (id: string) => (el: HTMLElement | null) => {
    cardElsRef.current[id] = el;
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
      toastTimerRef.current = null;
    }, 2200);
  };

  const attemptCloseModal = () => {
    if (stanceSliderEnabled && stanceDirty) {
      showToast("Save or discard changes to close.");
      return;
    }
    setSelectedNode(null);
  };

  const onDiscard = () => {
    setDraftStanceValue(stanceBaselineValue);
    setSelectedNode(null);
  };

  const onSave = () => {
    if (selectedNode && stanceSliderEnabled) {
      onStanceChange?.(selectedNode.id, draftStanceValue);
    }
    setSelectedNode(null);
  };

  useEffect(() => {
    measureLayoutRef.current = measureLayout;
  });

  const measureLayout = () => {
    const container = containerRef.current;
    if (!container) return;

    const c = container.getBoundingClientRect();
    setOverlaySize({ w: c.width, h: c.height });

    const next: Record<string, Position> = {};
    // Measure only nodes currently rendered
    for (const n of sortedNodes) {
      const el = cardElsRef.current[n.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next[n.id] = {
        x: r.left - c.left + r.width / 2,
        y: r.top - c.top + r.height / 2,
      };
    }
    setPositionById(next);
  };

  useLayoutEffect(() => {
    measureLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedNodes, cardWidth, gap]);

  useEffect(() => {
    const onResize = () => {
      window.requestAnimationFrame(() => {
        measureLayoutRef.current();
      });
    };

    window.addEventListener("resize", onResize);

    const el = containerRef.current;
    if (!el) {
      return () => window.removeEventListener("resize", onResize);
    }

    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedNode) return;

    const v = values[selectedNode.id] ?? 0;
    setStanceBaselineValue(v);
    setDraftStanceValue(v);
  }, [selectedNode, values]);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      attemptCloseModal();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, stanceDirty, stanceSliderEnabled, selectedNode]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);

      // Prevent selecting none: if empty, revert to all
      // if (next.size === 0) return new Set(categories);

      return next;
    });
  };

  const selectAllCategories = () => setSelectedCategories(new Set(categories));
  const deselectAllCategories = () => setSelectedCategories(new Set());
  const clearToAllIfEmpty = () => {
    setSelectedCategories((prev) =>
      prev.size === 0 ? new Set(categories) : prev
    );
  };

  const { inactiveEdges, activeEdges, connectedIds } = useMemo(() => {
    const inactive: JSX.Element[] = [];
    const active: JSX.Element[] = [];
    const connected = new Set<string>();

    for (const e of effects) {
      if (e.sourceId === "_default_") continue;

      // Filter edges to visible nodes only
      if (
        !visibleNodeIdSet.has(e.sourceId) ||
        !visibleNodeIdSet.has(e.targetId)
      ) {
        continue;
      }

      const from = positionById[e.sourceId];
      const to = positionById[e.targetId];
      if (!from || !to) continue;

      const rendered = renderEdge(e, from, to, hoveredId);
      rendered.connectedIds.forEach((id) => connected.add(id));
      (rendered.active ? active : inactive).push(rendered.path);
    }

    return {
      inactiveEdges: inactive,
      activeEdges: active,
      connectedIds: connected,
    };
  }, [effects, positionById, hoveredId, visibleNodeIdSet]);

  const selectedCategoryLabel = useMemo(() => {
    if (categories.length === 0) return "No categories";
    if (selectedCategories.size === categories.length) return "All categories";
    return `${selectedCategories.size} selected`;
  }, [categories.length, selectedCategories.size]);

  return (
    <div className="w-full overflow-x-auto min-h-48">
      {toastMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-warning">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-44 text-sm opacity-70">
          Showing {sortedNodes.length} of {nodes.length} nodes
        </div>

        <div className="w-full dropdown dropdown-end">
          <div className="flex">
            <label tabIndex={0} className="ml-auto btn btn-sm">
              Category: {selectedCategoryLabel}
            </label>
          </div>
          <div
            tabIndex={0}
            className=" dropdown-content z-30 rounded-box bg-base-100 p-3 shadow"
            // onBlur={clearToAllIfEmpty}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Categories</div>
              <div>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={selectAllCategories}
                >
                  Select all
                </button>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={deselectAllCategories}
                >
                  Deselect all
                </button>
              </div>
            </div>

            <div className="mt-2 w-full max-h-64 overflow-y-auto pr-1">
              {categories.map((cat, idx) => (
                <label key={cat} className="label cursor-pointer justify-start">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedCategories.has(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span
                    className={clsx("label-text", {
                      "mr-2": idx !== categories.length - 1,
                    })}
                  >
                    {cat}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-2 text-xs opacity-70">
              Unchecking all will revert to all categories.
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative mx-auto">
        {/* Inactive edges */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={overlaySize.w}
          height={overlaySize.h}
          viewBox={`0 0 ${overlaySize.w} ${overlaySize.h}`}
        >
          <ArrowDefs />
          {inactiveEdges}
        </svg>

        {/* Cards */}
        <div
          className="relative z-10 grid"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, 1fr))`,
            gap,
          }}
        >
          {sortedNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              value={values[node.id] ?? 0}
              setEl={registerCardEl(node.id)}
              isHovered={node.id === hoveredId}
              isConnected={connectedIds.has(node.id)}
              onHover={setHoveredId}
              onClick={setSelectedNode}
            />
          ))}
        </div>

        {/* Active edges */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={overlaySize.w}
          height={overlaySize.h}
          viewBox={`0 0 ${overlaySize.w} ${overlaySize.h}`}
          style={{ zIndex: 20 }}
        >
          <ArrowDefs />
          {activeEdges}
        </svg>
      </div>

      {/* Modal */}
      <input
        type="checkbox"
        className="modal-toggle"
        checked={isModalOpen}
        readOnly
      />

      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-box">
          <div className="text-lg font-semibold">{selectedNode?.name}</div>
          <div className="mt-2 text-sm opacity-80">
            {selectedNode?.description}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div>
              <b>Id</b> {selectedNode?.id}
            </div>
            <div>
              <b>Type</b> {selectedNode?.type}
            </div>
            <div>
              <b>Category</b>{" "}
              {selectedNode
                ? selectedNode.category?.trim()
                  ? selectedNode.category.trim()
                  : UNCATEGORIZED
                : ""}
            </div>
            <div>
              <b>Value</b>{" "}
              {Number.isFinite(
                stanceSliderEnabled ? draftStanceValue : selectedValue
              )
                ? (stanceSliderEnabled
                    ? draftStanceValue
                    : selectedValue
                  ).toFixed(4)
                : "NaN"}
            </div>
            {selectedNode && (
              <div>
                <b>Domain</b> min {selectedNode.domain.min}, max{" "}
                {selectedNode.domain.max}, clamp{" "}
                {String(selectedNode.domain.clamp)}
              </div>
            )}
          </div>

          {stanceSliderEnabled && selectedNode && (
            <div className="mt-5">
              <div className="text-sm font-semibold">Adjust stance</div>
              <input
                className={clsx("range range-primary mt-2", {"": currentStanceChangeCost} )}
                type="range"
                min={selectedNode.domain.min}
                max={selectedNode.domain.max}
                step={0.01}
                value={draftStanceValue}
                onChange={(e) => setDraftStanceValue(Number(e.target.value))}
              />
              <div className="mt-2 text-xs opacity-70">
                <p>
                  {draftStanceValue.toFixed(2)}
                  {stanceDirty ? " (unsaved)" : ""}
                </p>
                <p>
                  {"Authority Cost - " +
                    (currentCost
                      ? currentStanceChangeCost
                        ? currentStanceChangeCost?.toFixed(2)
                        : "Out of Bound"
                      : 0)}
                </p>
              </div>
            </div>
          )}

          <div className="modal-action">
            {stanceSliderEnabled ? (
              <>
                <button className="btn" onClick={onDiscard}>
                  Discard
                </button>
                <button
                  className="btn btn-primary"
                  onClick={onSave}
                  disabled={!canSave}
                >
                  Save
                </button>
              </>
            ) : (
              <button className="btn" onClick={attemptCloseModal}>
                Close
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          className="modal-backdrop"
          aria-label="Close"
          onClick={attemptCloseModal}
        />
      </div>
    </div>
  );
}
