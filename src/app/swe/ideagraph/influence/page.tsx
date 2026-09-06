import { ideaGraph } from "@/app/swe/ideagraph/lib/models/graph";
import IdeaCard from "../components/IdeaCard";

const page = () => {
  const influences = ideaGraph.getAllInfluences();

  return (
    <ul className="space-y-4">
      {influences.map((i, idx) => {
        const f = ideaGraph.getIdea(i.fromId);
        const t = ideaGraph.getIdea(i.toId);

        if (!f || !t) return null;

        return (
          <li key={idx} className="flex">
            <IdeaCard idea={f} />
            <p>to</p>
            <IdeaCard idea={t} />
          </li>
        );
      })}
    </ul>
  );
};

export default page;
