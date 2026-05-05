import { redirect } from "next/navigation";
import { ideaGraph } from "@/app/swe/ideagraph/lib/models/graph";

export const addInfluenceAction = async (formData: FormData) => {
  "use server";
  const fromId = formData.get("from") as string;
  const toId = formData.get("to") as string;

  ideaGraph.createInfluence({
    fromId: fromId,
    toId: toId,
    strength: 0.3,
    type: "",
  });
  redirect("/swe/ideagraph/"); // refresh the page
};

const page = () => {
  const ideas = ideaGraph.getAllIdeas();

  return (
    <form
      action={addInfluenceAction}
      className="flex flex-col mx-auto gap-4 w-full max-w-3xl"
    >
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
        <legend className="fieldset-legend">New Influence</legend>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            {ideas.map((i, idx) => (
              <label
                key={idx}
                className="cursor-pointer flex items-center gap-2"
              >
                <input
                  type="radio"
                  name="from"
                  className="radio"
                  value={i.id}
                />
                {i.name}
              </label>
            ))}
          </div>
          <div className="flex flex-col">
            {ideas.map((i, idx) => (
              <label
                key={idx}
                className="cursor-pointer flex items-center gap-2"
              >
                <input type="radio" name="to" className="radio" value={i.id} />
                {i.name}
              </label>
            ))}
          </div>
        </div>
        <div className="w-full mt-4">
          <label className="">
            Strength
            <input
              type="range"
              name="strength"
              min={0}
              max="1"
              defaultValue="1"
              className="range range-accent w-full"
              step="0.1"
            />
            <div className="flex justify-between px-2.5 mt-2 text-xs">
              {[...Array(11)].map((_, i) => (
                <span key={i}>|</span>
              ))}
            </div>
            <div className="flex justify-between px-1 mt-2 text-xs">
              {[...Array(11)].map((_, i) => (
                <span key={i}>{(i / 10).toFixed(1)}</span>
              ))}
            </div>
          </label>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Create Influence
        </button>
      </fieldset>
    </form>
  );
};

export default page;
