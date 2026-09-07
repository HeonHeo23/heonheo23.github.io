import Proposal from "@/markdown/proposal.mdx";
import Proposal1 from "@/markdown/proposal1.mdx";
import PageHeader from "../components/PageHeader";

const Page = () => {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Compling"
        title="Compling projects."
        description="Working notes on computational linguistics, semantics, and historical narrative."
      >
        <ul className="flex max-w-md flex-wrap gap-2 font-mono text-xs font-bold uppercase tracking-wider">
          {[
            "Koine Greek",
            "Semantics",
            "Vector context",
            "Translation issues",
          ].map((topic) => (
            <li
              key={topic}
              className="badge badge-outline rounded-none px-3 py-3"
            >
              {topic}
            </li>
          ))}
        </ul>
      </PageHeader>

      <div>
        <article className="article-content">
          <Proposal />
        </article>
        <div className="divider divider-primary my-16 font-mono text-xs font-bold uppercase tracking-widest">
          Next proposal
        </div>
        <article className="article-content">
          <Proposal1 />
        </article>
      </div>
    </main>
  );
};

export default Page;
