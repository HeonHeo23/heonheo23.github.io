import { useParams } from "react-router-dom";
import Link from "../../../components/Link";
import { ideaGraph } from "../lib/models/graph";

const Page = () => {
  const { id = "" } = useParams();
  const idea = ideaGraph.getIdea(id);
  const children = ideaGraph.getChildren(id);
  const parents = ideaGraph.getParents(id);

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
    <div>
      <div className="neu-panel w-full p-5">
        <div className="flex justify-between">
          <h2 className="text-4xl font-extrabold">{idea.name}</h2>
          <div className="flex gap-2">
            <Link
              href="/swe/ideagraph/influence/add"
              className="btn btn-secondary"
            >
              Influence
            </Link>
            <Link
              href={`/swe/ideagraph/edit/${idea.id}`}
              className="btn btn-primary"
            >
              Edit
            </Link>
          </div>
        </div>
        <p className="mt-4 text-lg">Desc: {idea.description}</p>
        <p className="mt-4 text-lg">Year: {idea.originDate}</p>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="neu-surface w-full p-5">
          <h4 className="border-b-[3px] border-base-content pb-3">Parents</h4>
          <ul className="list">
            {parents.map((i, idx) => (
              <li key={idx} className="list-row link-hover">
                <Link href={`/swe/ideagraph/${i.idea.id}`}>
                  {i.idea.name} ({i.strength})
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="neu-surface w-full p-5">
          <h4 className="border-b-[3px] border-base-content pb-3">Children</h4>
          <ul className="list">
            {children.map((i, idx) => (
              <li key={idx} className="list-row link-hover">
                <Link href={`/swe/ideagraph/${i.idea.id}`}>
                  {i.idea.name} ({i.strength})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
