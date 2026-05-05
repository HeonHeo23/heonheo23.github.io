import { ideaGraph } from "./lib/models/graph";
import AddIdea from "./components/AddIdea";
import { revalidatePath } from "next/cache";
import IdeaTimeline from "./components/IdeaTimeline";
import Link from "next/link";

export const deleteIdeaAction = async (id: string) => {
  "use server";
  ideaGraph.deleteIdea(id);
  revalidatePath("/"); // refresh the page
};

export const addIdeaAction = async (formData: FormData) => {
  "use server";
  const name = formData.get("name") as string;
  const timestamp = new Date();
  const description = formData.get("description") as string;
  const originDateRaw = formData.get("originDate");
  const originDate =
    typeof originDateRaw === "string" && originDateRaw.trim() !== ""
      ? Number(originDateRaw)
      : 0;

  ideaGraph.createIdea({
    name: name,
    description: description,
    originDate: originDate,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  revalidatePath("/"); // refresh the page
};

const page = () => {
  const ideas = ideaGraph.getAllIdeas();
  const influences = ideaGraph.getAllInfluences();

  return (
    <>
      {/* <IdeaList ideas={ideas} deleteIdea={deleteIdeaAction} /> */}
      <IdeaTimeline
        ideas={ideas}
        influences={influences}
        deleteIdea={deleteIdeaAction}
      />
      <AddIdea createIdea={addIdeaAction} />
      <button className="mt-2 btn btn-accent">
        <Link href={"ideagraph/influence"}>Influences</Link>
      </button>
    </>
  );
};

export default page;
