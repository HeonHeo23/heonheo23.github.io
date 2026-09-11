import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ideaGraph } from "../../lib/models/graph";
import IdeaFields from "../../components/IdeaFields";

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
    navigate(`/projects/ideagraph/${id}`);
  };

  if (!idea) {
    return (
      <div className="flex min-h-screen justify-center font-sans">
        <main className="flex w-full max-w-3xl flex-col px-8 py-4 md:px-4">
          <h1 className="text-4xl font-bold text-error">Idea Not Found</h1>
          <p>No idea exists with ID: {id}</p>
        </main>
      </div>
    );
  }

  return (
    <form onSubmit={updateIdea} className="form-shell">
      <fieldset className="fieldset w-full p-5">
        <legend className="fieldset-legend">Update Idea</legend>
        <IdeaFields
          values={{
            name: idea.name ?? "",
            description: idea.description ?? "",
            originDate: idea.originDate ?? "",
          }}
        />
        <button type="submit" className="btn mt-4 btn-primary">
          Update the Idea
        </button>
      </fieldset>
    </form>
  );
};

export default Page;
