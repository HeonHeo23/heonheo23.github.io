"use client";

import type { Node } from "../game/types";

type Props = {
  node: Node;
  value: number;

  setEl?: (el: HTMLElement | null) => void;

  isHovered?: boolean;
  isConnected?: boolean;

  onHover?: (id: string | null) => void;
  onClick?: (node: Node) => void;
};

function cardClassByType(type: Node["type"]) {
  if (type === "stance") return "bg-primary text-primary-content";
  if (type === "indicator") return "bg-info text-info-content";
  if (type === "faction") return "bg-secondary text-secondary-content";
  if (type === "situation") return "bg-warning text-warning-content";
  return "bg-accent text-accent-content";
}

export default function NodeCard(props: Props) {
  const { node, value, setEl, isHovered, isConnected, onHover, onClick } =
    props;

  const ring =
    isHovered || isConnected
      ? "ring ring-current ring-offset-2 ring-offset-base-100"
      : "";

  const dim =
    // isHovered || isConnected || !onHover ? "opacity-100" : "opacity-85";
    "opacity-100";

  return (
    <button
      ref={setEl}
      type="button"
      className={`card hover:shadow-md transition cursor-pointer w-full h-full ${cardClassByType(
        node.type
      )} ${ring} ${dim}`}
      onMouseEnter={() => onHover?.(node.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(node)}
    >
      <div className="card-body p-4 items-start text-left">
        <div className="h-[2lh] line-clamp-2 w-full font-semibold leading-tight">{node.name}</div>
        <div className="text-3xl font-bold">
          {Number.isFinite(value) ? value.toFixed(2) : "NaN"}
        </div>
      </div>
    </button>
  );
}
