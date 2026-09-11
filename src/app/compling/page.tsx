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
        <ul className="tag-list max-w-md">
          {[
            "Koine Greek",
            "Semantics",
            "Vector context",
            "Translation issues",
          ].map((topic) => (
            <li key={topic}>
              <span className="tag badge badge-outline">{topic}</span>
            </li>
          ))}
        </ul>
      </PageHeader>

      <div>
        <article className="article-content">
          <Proposal />
        </article>
        <div className="divider my-16 divider-primary eyebrow">
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
