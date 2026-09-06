"use client";

import { JSX, useMemo, useState } from "react";
import { Idea } from "../lib/types/idea";
import IdeaCard from "./IdeaCard";
import { Influence } from "../lib/types/influence";

type Props = {
  ideas: Idea[];
  influences: Influence[];
  deleteIdea: (id: string) => void;
  cardWidth?: number;
};

type PlacedIdea = {
  idea: Idea;
  x: number;
  y: number;
};

type Position = {
  x: number;
  y: number;
};

type ClusterGapMode = "auto" | 50 | 100;
type LineMode = "Cubic Bezier" | "Straight";

const ROW_HEIGHT = 120;
const CARD_HEIGHT = 96;
const EDGE_OFFSET = 24;
const COLUMN_GAP = 12;
const CANVAS_PADDING = 32;

const median = (values: number[]) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const computeThresholds = (ideas: Idea[], mode: ClusterGapMode) => {
  if (mode !== "auto") {
    return {
      clusterThreshold: mode,
      bigGapThreshold: mode * 2,
    };
  }

  const diffs = ideas
    .slice(1)
    .map((idea, i) => idea.originDate - ideas[i].originDate);

  const cluster = median(diffs);

  return {
    clusterThreshold: cluster,
    bigGapThreshold: cluster * 2,
  };
};

const computePlacedIdeas = (
  ideas: Idea[],
  cardWidth: number,
  mode: ClusterGapMode
): PlacedIdea[] => {
  if (ideas.length === 0) return [];

  const sorted = [...ideas].sort((a, b) => a.originDate - b.originDate);

  const { clusterThreshold, bigGapThreshold } = computeThresholds(sorted, mode);

  let row = 0;
  let col = 0;
  let lastYear: number | null = null;

  const placed: PlacedIdea[] = [];

  for (const idea of sorted) {
    if (lastYear !== null) {
      const diff = idea.originDate - lastYear;

      if (diff < clusterThreshold) {
        col += 1;
      } else {
        row += 1;
        col = 0;

        if (diff > bigGapThreshold) {
          row += 1;
        }
      }
    }

    placed.push({
      idea,
      x: col * (cardWidth + COLUMN_GAP),
      y: row * ROW_HEIGHT,
    });

    lastYear = idea.originDate;
  }

  return placed;
};

const buildPositionMap = (placed: PlacedIdea[]): Map<string, Position> => {
  const map = new Map<string, Position>();
  placed.forEach((p) => map.set(p.idea.id, { x: p.x, y: p.y }));
  return map;
};

const buildEdgePath = (
  mode: LineMode,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  if (mode === "Straight") {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  const controlX = (startX + endX) / 2 + EDGE_OFFSET;

  return `
    M ${startX} ${startY}
    C ${controlX} ${startY},
      ${controlX} ${endY},
      ${endX} ${endY}
  `;
};

const IdeaTimeline = ({
  ideas,
  influences,
  deleteIdea,
  cardWidth = 200,
}: Props) => {
  const [clusterGapMode, setClusterGapMode] = useState<ClusterGapMode>("auto");
  const [lineMode, setLineMode] = useState<LineMode>("Cubic Bezier");
  const [hoveredIdeaId, setHoveredIdeaId] = useState<string | null>(null);

  const placed = useMemo(
    () => computePlacedIdeas(ideas, cardWidth, clusterGapMode),
    [ideas, cardWidth, clusterGapMode]
  );

  const positionById = useMemo(() => buildPositionMap(placed), [placed]);

  const height = useMemo(() => {
    if (placed.length === 0) return 400;
    return Math.max(...placed.map((p) => p.y)) + ROW_HEIGHT;
  }, [placed]);

  const width = useMemo(() => {
    if (placed.length === 0) return 400;
    return Math.max(...placed.map((p) => p.x)) + cardWidth + CANVAS_PADDING;
  }, [placed, cardWidth]);

  const spineX = cardWidth / 2;

  const { inactiveEdges, activeEdges } = useMemo(() => {
    const inactive: JSX.Element[] = [];
    const active: JSX.Element[] = [];

    for (const inf of influences) {
      const from = positionById.get(inf.fromId);
      const to = positionById.get(inf.toId);
      if (!from || !to) continue;

      const startX = from.x + cardWidth / 2;
      const startY = from.y + CARD_HEIGHT / 2;
      const endX = to.x + cardWidth / 2;
      const endY = to.y + CARD_HEIGHT / 2;

      const isActive =
        hoveredIdeaId !== null &&
        (inf.fromId === hoveredIdeaId || inf.toId === hoveredIdeaId);

      const d = buildEdgePath(lineMode, startX, startY, endX, endY);

      const path = (
        <path
          key={inf.id}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={isActive ? 3 : 1.5 + (inf.strength ?? 1) * 0.5}
          opacity={isActive ? 0.9 : 0.12}
          markerEnd="url(#arrow)"
          className={isActive ? "text-primary" : "text-base-400"}
        />
      );

      if (isActive) active.push(path);
      else inactive.push(path);
    }

    return { inactiveEdges: inactive, activeEdges: active };
  }, [influences, positionById, cardWidth, hoveredIdeaId, lineMode]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="ml-auto max-w-3xl flex justify-between">
        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm text-base-500">Cluster gap</label>
          <select
            value={clusterGapMode}
            onChange={(e) =>
              setClusterGapMode(
                e.target.value === "auto"
                  ? "auto"
                  : (Number(e.target.value) as 50 | 100)
              )
            }
            className="rounded border border-base-300 bg-base-100 px-2 py-1 text-sm"
          >
            <option value="auto">Auto</option>
            <option value="50">50 years</option>
            <option value="100">100 years</option>
          </select>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm text-base-500">Edge style</label>
          <select
            value={lineMode}
            onChange={(e) => setLineMode(e.target.value as LineMode)}
            className="rounded border border-base-300 bg-base-100 px-2 py-1 text-sm"
          >
            <option value="Cubic Bezier">Cubic Bezier</option>
            <option value="Straight">Straight</option>
          </select>
        </div>
      </div>

      <div className="relative mx-auto" style={{ width, height }}>
        {/* Bottom SVG: inactive edges (behind cards) */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={width}
          height={height}
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
            </marker>
          </defs>

          {inactiveEdges}

          <line
            x1={spineX}
            y1={0}
            x2={spineX}
            y2={height}
            className="stroke-base-300"
            strokeWidth={2}
          />

          {placed.map(({ idea, x, y }) => {
            const centerY = y + CARD_HEIGHT / 2;
            return (
              <line
                key={idea.id}
                x1={spineX}
                y1={centerY}
                x2={x}
                y2={centerY}
                className="stroke-base-300"
                strokeWidth={2}
              />
            );
          })}
        </svg>

        {/* Cards */}
        {placed.map(({ idea, x, y }) => (
          <div
            key={idea.id}
            className="absolute"
            style={{
              left: x,
              top: y,
              width: cardWidth,
              zIndex: 10,
            }}
          >
            <IdeaCard
              idea={idea}
              deleteIdea={deleteIdea}
              onHover={(id) => setHoveredIdeaId(id)}
            />
          </div>
        ))}

        {/* Top SVG: active edges (in front of cards) */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={width}
          height={height}
          style={{ zIndex: 20 }}
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
            </marker>
          </defs>

          {activeEdges}
        </svg>
      </div>
    </div>
  );
};

export default IdeaTimeline;
