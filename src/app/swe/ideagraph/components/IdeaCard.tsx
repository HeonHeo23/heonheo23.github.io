"use client";

import Link from "../../../components/Link";
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
        className="btn absolute top-3 right-3 z-10 btn-square border-2 bg-secondary text-secondary-content btn-xs"
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
        href={`/projects/ideagraph/${idea.id}`}
        className="card h-full min-h-24 neu-card cursor-pointer p-3 pr-10"
      >
        <div className="card-title flex text-base font-semibold">
          <h3>{idea.name}</h3>
          <span className="text-xs text-secondary">{idea.originDate}</span>
        </div>
        <p className="mt-2 text-xs text-base-content/75">{compactText}</p>
      </Link>
    </div>
  );
};

export default IdeaCard;
