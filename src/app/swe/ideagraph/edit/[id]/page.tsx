import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ideaGraph } from "../../lib/models/graph";

const Page = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const idea = ideaGraph.getIdea(id);

  const updateIdea = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    ideaGraph.updateIdea(id, {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      originDate: Number(formData.get("originDate") ?? 0),
      updatedAt: new Date(),
    });
    navigate(`/swe/ideagraph/${id}`);
  };

  if (!idea) {
    return (
      <div className="flex min-h-screen justify-center font-sans">
        <main className="flex w-full max-w-3xl flex-col py-4 px-8 md:px-4">
          <h1 className="text-4xl font-bold text-error">Idea Not Found</h1>
          <p>No idea exists with ID: {id}</p>
        </main>
      </div>
    );
  }

  return (
    <form
      onSubmit={updateIdea}
      className="flex flex-col mx-auto gap-4 w-full max-w-3xl"
    >
      <fieldset className="fieldset w-full p-5">
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
