import { Idea } from "../lib/types/idea";
import IdeaCard from "./IdeaCard";

const IdeaList = ({
  ideas,
  deleteIdea,
}: {
  ideas: Idea[];
  deleteIdea: (id: string) => void;
}) => {
  return (
    <ul className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {ideas.map((i) => (
        <li key={i.id}>
          <IdeaCard idea={i} deleteIdea={deleteIdea} />
        </li>
      ))}
    </ul>
  );
};

export default IdeaList;
