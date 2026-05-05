"use client";

import Link from "next/link";
import { Idea } from "../lib/types/idea";
const IdeaCard = ({
  idea,
  deleteIdea,
  onHover,
}: {
  idea: Idea;
  deleteIdea?: (id: string) => void;
  onHover?: (id: string | null) => void;
}) => {
  const desc = idea.description ?? "";
  const compactText = desc.length > 80 ? desc.slice(0, 80) + "..." : desc;

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => onHover?.(idea.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <button
        type="button"
        aria-label="Delete idea"
        className="btn btn-square btn-xs absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation(); // stop Link click
          if (deleteIdea) deleteIdea(idea.id);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <Link
        href={`/swe/ideagraph/${idea.id}`}
        className="card bg-base-100 shadow-sm h-full p-3 flex flex-col hover:shadow-md transition cursor-pointer"
      >
        <div className="flex card-title text-base font-semibold">
          <h3>{idea.name}</h3>
          <span className="text-accent text-xs">{idea.originDate}</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">{compactText}</p>
      </Link>
    </div>
  );
};

export default IdeaCard;
