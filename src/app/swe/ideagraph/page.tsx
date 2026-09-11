import { useState } from "react";
import { ideaGraph } from "./lib/models/graph";
import AddIdea from "./components/AddIdea";
import IdeaTimeline from "./components/IdeaTimeline";
import Link from "../../components/Link";

const Page = () => {
  const [, setRevision] = useState(0);
  const ideas = ideaGraph.getAllIdeas();
  const influences = ideaGraph.getAllInfluences();

  const deleteIdea = (id: string) => {
    ideaGraph.deleteIdea(id);
    setRevision((value) => value + 1);
  };

  const addIdea = (formData: FormData) => {
    const now = new Date();
    ideaGraph.createIdea({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      originDate: Number(formData.get("originDate") ?? 0),
      createdAt: now,
      updatedAt: now,
    });
    setRevision((value) => value + 1);
  };

  return (
    <>
      {/* <IdeaList ideas={ideas} deleteIdea={deleteIdeaAction} /> */}
      <IdeaTimeline
        ideas={ideas}
        influences={influences}
        deleteIdea={deleteIdea}
      />
      <AddIdea createIdea={addIdea} />
      <Link
        href="/projects/ideagraph/influence"
        className="btn mt-4 self-start btn-accent"
      >
        Influences
      </Link>
    </>
  );
};

export default Page;
