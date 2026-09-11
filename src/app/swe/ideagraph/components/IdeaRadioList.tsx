import type { Idea } from "../lib/types/idea";

type IdeaRadioListProps = {
  ideas: Idea[];
  name: "from" | "to";
};

export default function IdeaRadioList({ ideas, name }: IdeaRadioListProps) {
  return (
    <div className="flex flex-col">
      {ideas.map((idea) => (
        <label
          key={idea.id}
          className="flex items-center gap-2 font-mono text-sm"
        >
          <input type="radio" name={name} className="radio" value={idea.id} />
          {idea.name}
        </label>
      ))}
    </div>
  );
}
