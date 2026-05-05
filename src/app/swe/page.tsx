import IdeaGraph from "@/markdown/ideaGraph.mdx";
import Link from "next/link";

const page = () => {
  return (
    <main className="flex w-full px-8 md:px-2 flex-col py-4">
      <h1>Project Lists</h1>
      <ul className="list rounded-box shadow-md">
        <li className="list-row">
          <Link className="link-primary link-hover" href={"swe/ideagraph"}>
            Idea Graph
          </Link>
        </li>
        <li className="list-row">
          <Link className="link-primary link-hover" href={"swe/denom"}>
            Denomination Game
          </Link>
        </li>
        <div></div>
      </ul>
      <IdeaGraph />
    </main>
  );
};

export default page;
