import IdeaGraph from "@/markdown/ideaGraph.mdx";
import Link from "../components/Link";
import PageHeader from "../components/PageHeader";
import { neuToneClass, type NeuTone } from "../components/design";

const projects: {
  title: string;
  description: string;
  href: string;
  label: string;
  tone: NeuTone;
}[] = [
  {
    title: "Idea Graph",
    description:
      "Explore ideas, their lineage, and the relationships between them.",
    href: "/swe/ideagraph",
    label: "Knowledge systems",
    tone: "yellow",
  },
  {
    title: "Denomination Game",
    description:
      "An interactive simulation of factions, stances, and authority.",
    href: "https://heonheo23.github.io/the-denomination/",
    label: "Simulation",
    tone: "pink",
  },
];

const Page = () => {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="SWE"
        title="Projects as experiments."
        description="Working software and evolving prototypes for modeling ideas and systems."
      />

      <section aria-labelledby="project-list-heading">
        <h2 id="project-list-heading" className="sr-only">
          Project list
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.href}>
              <Link
                href={project.href}
                className="offset-card group flex min-h-72 flex-col p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`badge px-3 py-3 text-[0.65rem] uppercase tracking-widest ${neuToneClass[project.tone]}`}
                  >
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

      <article className="article-content mt-24 border-t-[4px] border-base-content pt-16">
        <IdeaGraph />
      </article>
    </main>
  );
};

export default Page;
