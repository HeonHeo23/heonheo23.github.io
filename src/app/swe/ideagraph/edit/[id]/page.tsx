import { redirect } from "next/navigation";
import { ideaGraph } from "../../lib/models/graph";

interface PageProps {
  params: { id: string };
}

export const updateIdeaAction = (id: string) => async (formData: FormData) => {
  "use server";

  const name = formData.get("name") as string;
  const timestamp = new Date();
  const description = formData.get("description") as string;
  const originDateRaw = formData.get("originDate");
  const originDate =
    typeof originDateRaw === "string" && originDateRaw.trim() !== ""
      ? Number(originDateRaw)
      : 0;

  ideaGraph.updateIdea(id, {
    name: name,
    description: description,
    originDate: originDate,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  redirect(`/swe/ideagraph/${id}`);
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const idea = await ideaGraph.getIdea(id);

  if (!idea) {
    return (
      <div className="flex min-h-screen justify-center font-sans">
        <main className="flex w-full max-w-3xl flex-col py-4 px-8 md:px-4">
          <h1 className="text-4xl font-bold text-red-600">Idea Not Found</h1>
          <p>No idea exists with ID: {id}</p>
        </main>
      </div>
    );
  }

  return (
    <form
      action={updateIdeaAction(idea.id ?? "")}
      className="flex flex-col mx-auto gap-4 w-full max-w-3xl"
    >
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
        <legend className="fieldset-legend">Update Idea</legend>
        <label className="input w-full">
          <span className="label w-30">Name</span>
          <input
            type="text"
            name="name"
            defaultValue={idea.name ?? ""}
            required
          />
        </label>
        <label className="input w-full">
          <span className="label w-30">Description</span>
          <input
            type="text"
            name="description"
            defaultValue={idea.description ?? ""}
          />
        </label>
        <label className="input w-full">
          <span className="label w-30">Origin Year</span>
          <input
            type="text"
            name="originDate"
            defaultValue={idea.originDate?.toString() ?? ""}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary mt-4">
          Update the Idea
        </button>
      </fieldset>
    </form>
  );
};

export default Page;
