import IdeaGraph from "@/markdown/ideaGraph.mdx";
import Link from "../components/Link";

const projects = [
  {
    title: "Idea Graph",
    description: "Explore ideas, their lineage, and the relationships between them.",
    href: "/swe/ideagraph",
    label: "Knowledge systems",
    color: "bg-primary text-primary-content",
  },
  {
    title: "Denomination Game",
    description: "An interactive simulation of factions, stances, and authority.",
    href: "https://heonheo23.github.io/the-denomination/",
    label: "Simulation",
    color: "bg-secondary text-secondary-content",
  },
];

const Page = () => {
  return (
    <main className="page-shell">
      <header className="mb-12 max-w-4xl">
        <nav className="breadcrumbs eyebrow mb-4 text-primary" aria-label="Breadcrumb">
          <ul>
            <li aria-current="page">SWE</li>
          </ul>
        </nav>
        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">Projects as experiments.</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-base-content/70">
          Working software and evolving prototypes for modeling ideas and systems.
        </p>
      </header>

      <section aria-labelledby="project-list-heading">
        <h2 id="project-list-heading" className="sr-only">Project list</h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.href}>
              <Link
                href={project.href}
                className="offset-card group flex min-h-72 flex-col p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className={`badge rounded-none border-2 border-base-content px-3 py-3 font-mono text-[0.65rem] font-bold uppercase tracking-widest ${project.color}`}>
                    {project.label}
                  </span>
                  <span className="font-mono text-sm font-black text-base-content/45">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-auto pt-12">
                  <h3 className="text-3xl font-black tracking-tight group-hover:text-primary">
                    {project.title} <span aria-hidden="true">↗</span>
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-base-content/65">
                    {project.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <article className="article-content mt-24 border-t-8 border-accent pt-16">
        <IdeaGraph />
      </article>
    </main>
  );
};

export default Page;
