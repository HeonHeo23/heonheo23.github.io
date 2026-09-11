import IdeaGraph from "@/markdown/ideaGraph.mdx";
import Link from "../components/Link";
import PageHeader from "../components/PageHeader";
import { cn } from "../components/cn";
import { badgeToneClass, type NeuTone } from "../components/design";

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
    href: "/projects/ideagraph",
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

export default function ProjectPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Projects"
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
                className="group card flex min-h-72 neu-card flex-col p-6"
              >
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                  <span className={cn("tag", badgeToneClass[project.tone])}>
                    {project.label}
                  </span>
                  <span className="eyebrow text-sm text-base-content/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-auto pt-12">
                  <h3 className="text-3xl tracking-tight group-hover:text-secondary">
                    {project.title} <span aria-hidden="true">↗</span>
                  </h3>
                  <p className="mt-3 text-base-content/65">
                    {project.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <article className="article-content mt-24 border-t-4 border-base-content pt-16">
        <IdeaGraph />
      </article>
    </main>
  );
}
