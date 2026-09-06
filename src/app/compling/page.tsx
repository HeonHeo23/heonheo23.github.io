import Proposal from "@/markdown/proposal.mdx";
import Proposal1 from "@/markdown/proposal1.mdx";

const Page = () => {
  return (
    <main className="page-shell">
      <header className="mb-16 grid gap-8 border-b-2 border-base-content pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <nav className="breadcrumbs eyebrow mb-4 text-primary" aria-label="Breadcrumb">
            <ul>
              <li aria-current="page">Compling</li>
            </ul>
          </nav>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">Compling projects.</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-base-content/70">
            Working notes on computational linguistics, semantics, and historical narrative.
          </p>
        </div>
        <ul className="flex max-w-md flex-wrap gap-2 font-mono text-xs font-bold uppercase tracking-wider">
          {["Koine Greek", "Semantics", "Vector context", "Translation issues"].map((topic) => (
            <li key={topic} className="badge badge-outline rounded-none px-3 py-3">
              {topic}
            </li>
          ))}
        </ul>
      </header>

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
