import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ideaGraph } from "@/app/swe/ideagraph/lib/models/graph";
import IdeaRadioList from "../../components/IdeaRadioList";

const Page = () => {
  const navigate = useNavigate();
  const ideas = ideaGraph.getAllIdeas();

  const addInfluence = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    ideaGraph.createInfluence({
      fromId: String(formData.get("from") ?? ""),
      toId: String(formData.get("to") ?? ""),
      strength: Number(formData.get("strength") ?? 0.3),
      type: "",
    });
    navigate("/projects/ideagraph");
  };

  return (
    <form onSubmit={addInfluence} className="form-shell">
      <fieldset className="fieldset w-full p-5">
        <legend className="fieldset-legend">New Influence</legend>
        <div className="grid grid-cols-2 gap-4">
          <IdeaRadioList ideas={ideas} name="from" />
          <IdeaRadioList ideas={ideas} name="to" />
        </div>
        <div className="mt-4 w-full">
          <label>
            Strength
            <input
              type="range"
              name="strength"
              min={0}
              max="1"
              defaultValue="1"
              className="range w-full range-accent"
              step="0.1"
            />
            <div className="mt-2 flex justify-between px-2.5 text-xs">
              {[...Array(11)].map((_, i) => (
                <span key={i}>|</span>
              ))}
            </div>
            <div className="mt-2 flex justify-between px-1 text-xs">
              {[...Array(11)].map((_, i) => (
                <span key={i}>{(i / 10).toFixed(1)}</span>
              ))}
            </div>
          </label>
        </div>
        <button type="submit" className="btn mt-4 btn-primary">
          Create Influence
        </button>
      </fieldset>
    </form>
  );
};

export default Page;
