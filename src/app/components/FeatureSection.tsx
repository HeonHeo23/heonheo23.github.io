import Link from "./Link";
import { neuToneClass, type NeuTone } from "./design";

type Highlight = {
  category: "Research" | "Experience" | "Education";
  title: string;
  company: string;
  href?: string;
  meta: string;
  year: string;
  short: string;
  details?: string[];
  skills?: string[];
  tone: NeuTone;
};

const highlights: Highlight[] = [
  {
    category: "Research",
    title: "Journal Article",
    company:
      "Deep learning-assisted cytological image analysis for canine lymphoma",
    href: "/research/deep-learning-assisted-cytological-image-analysis-for-canine-lymphoma",
    meta: "Veterinary Oncology · Springer Nature · DOI 10.1186/s44356-026-00056-5",
    year: "2026",
    short: "Computer vision for canine lymphoma classification.",
    tone: "blue",
  },
  {
    category: "Experience",
    title: "System Engineer",
    company: "Republic of Korea Air Force",
    meta: "Communication System Engineering",
    year: "2025 — PRESENT",
    short: "Communication systems engineering and mission support.",
    details: [
      "Support communication-system engineering work where dependable infrastructure and clear technical judgment are essential to mission operations.",
      "Use systems thinking to analyze operational needs, coordinate technical decisions, and help maintain reliable communication capabilities.",
    ],
    skills: [
      "Systems engineering",
      "Communication systems",
      "Technical analysis",
    ],
    tone: "pink",
  },
  {
    category: "Research",
    title: "Conference Proceeding",
    company:
      "Structured inverse design: a tile-based approach for practical photonic integration",
    href: "/research/structured-inverse-design-a-tile-based-approach-for-practical-photonic-integration",
    meta: "Optical Design Automation · SPIE · DOI 10.1117/12.3066478",
    year: "2025",
    short: "Automated photonic design with optimization and FDTD simulation.",
    tone: "green",
  },
  {
    category: "Experience",
    title: "Software Engineering Intern",
    company: "Tern Computer Inc.",
    meta: "Advanced semiconductor design program",
    year: "2025",
    short: "Semiconductor design platform built with Next.js and Firebase.",
    details: [
      "Developed a production-oriented web application for an advanced semiconductor design program, connecting an interactive interface to application logic and cloud data.",
      "Worked across the stack with Next.js, React, Node.js, and Firebase to turn design workflows into usable software.",
    ],
    skills: ["Next.js", "React", "Node.js", "Firebase"],
    tone: "orange",
  },
  {
    category: "Experience",
    title: "Software Engineer · IPPD",
    company: "Arthrex",
    meta: "Integrated Product & Process Design Project at UF",
    year: "2024 — 2025",
    short: "Embedded coolant-control prototype with Python and WebSocket.",
    details: [
      "Built a $2,000 proof-of-concept coolant delivery system that combined real-time control, hardware integration, and a Python, Flask, and WebSocket software stack.",
      "Designed embedded software, circuitry, signal processing, data logging, and an interactive GUI around an object-oriented system architecture.",
      "Improved dynamic responsiveness through adaptive control and parameter tuning, then created a verification dashboard for unit, feature, and integration testing.",
      "Worked with mechanical and biomedical engineers to define requirements, assess risks, support regulatory alignment, and maintain design traceability.",
    ],
    skills: ["Python", "Flask", "WebSocket", "Embedded systems"],
    tone: "purple",
  },
  {
    category: "Experience",
    title: "Monitoring Engineer",
    company: "Florida Department of Transportation",
    meta: "Accelerated Pavement Testing",
    year: "2024",
    short: "Pavement testing, simulator monitoring, and laser scanning.",
    details: [
      "Operated and monitored the Heavy Vehicle Simulator at FDOT’s Accelerated Pavement Testing facility to protect test reliability and data quality.",
      "Used laser scanning to collect precise measurements for evaluating pavement performance.",
      "Diagnosed operational issues by managing machine functions and troubleshooting the simulator during testing.",
    ],
    skills: ["Data collection", "Test monitoring", "Laser scanning"],
    tone: "blue",
  },
  {
    category: "Education",
    title: "B.S. in Computer Engineering",
    company: "University of Florida",
    meta: "Minor in Linguistics · 3.81 GPA",
    year: "AUG 2022 — MAY 2028",
    short: "",
    details: [
      "Build a foundation in computer engineering through coursework spanning software, hardware, and systems design.",
      "Combine engineering study with a linguistics minor to explore the relationship between computation, systems, and language.",
    ],
    tone: "yellow",
  },
];

function ExperienceDialog({ item }: { item: Highlight }) {
  const dialogId = `experience-${item.company.replaceAll(" ", "-").toLowerCase()}`;
  return (
    <dialog id={dialogId} className="modal">
      <div className="modal-box max-w-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6 border-b-[3px] border-base-content pb-5">
          <div>
            <p className="eyebrow text-secondary">{item.title}</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">
              {item.company}
            </h3>
          </div>
          <span className="font-mono text-right text-xs font-black uppercase text-base-content/60">
            {item.year}
          </span>
        </div>
        <p className="mt-6 font-mono text-sm text-base-content/70">
          {item.meta}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-base-content/85">
          {item.short}
        </p>
        <div className="mt-6">
          <p className="eyebrow mb-3 text-secondary">Details</p>
          <ul className="space-y-3 leading-relaxed text-base-content/80">
            {(item.details ?? [item.short]).map((detail) => (
              <li key={detail}>— {detail}</li>
            ))}
          </ul>
        </div>
        {item.skills ? (
          <div className="mt-6">
            <p className="eyebrow mb-3 text-secondary">Skills</p>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <span key={skill} className="badge badge-outline">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <form method="dialog" className="modal-action">
          <button className="btn btn-primary" type="submit">
            Close
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">Close</button>
      </form>
    </dialog>
  );
}

function HighlightGrid({ items }: { items: Highlight[] }) {
  return (
    <>
      <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const dialogId = `experience-${item.company.replaceAll(" ", "-").toLowerCase()}`;
          const content = (
            <>
              <div className="card-body p-6">
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`badge px-3 py-3 text-[0.65rem] uppercase tracking-widest ${neuToneClass[item.tone]}`}
                  >
                    {item.category}
                  </span>
                  <span className="font-mono text-right text-xs font-black uppercase text-base-content/55">
                    {item.year}
                  </span>
                </div>
                <div className="mt-auto pt-8">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-base-content/65">
                    {item.title}
                  </div>
                  <h3 className="card-title mt-2 text-2xl leading-tight transition-colors group-hover:text-secondary">
                    {item.company}
                  </h3>
                  <div className="mt-3 border-t-2 border-base-content/25 pt-3">
                    <div className="font-mono text-xs text-base-content/60">
                      {item.meta}
                    </div>
                    {item.short ? (
                      <p className="mt-3 font-mono text-sm text-base-content/75">
                        {item.short}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          );
          return (
            <li key={`${item.company}-${item.title}`}>
              {item.category === "Research" && item.href ? (
                <Link
                  href={item.href}
                  className="card offset-card group min-h-64"
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  className="card offset-card group min-h-64 w-full text-left"
                  onClick={() =>
                    (
                      document.getElementById(dialogId) as HTMLDialogElement
                    )?.showModal()
                  }
                  aria-haspopup="dialog"
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {items
        .filter((item) => item.category !== "Research")
        .map((item) => (
          <ExperienceDialog key={item.company} item={item} />
        ))}
    </>
  );
}

export default function FeatureSection() {
  const projects = highlights.filter((item) => item.category === "Research");
  const experience = highlights.filter((item) => item.category !== "Research");
  return (
    <>
      <section
        className="border-t-[4px] border-base-content py-16 sm:py-24"
        aria-labelledby="experience-heading"
      >
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-3 text-secondary">Experience</p>
            <h2
              id="experience-heading"
              className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl"
            >
              Learning by building.
            </h2>
          </div>
          <p className="max-w-sm text-base-content/75 sm:text-right">
            Education, engineering, and interdisciplinary project work.
          </p>
        </div>
        <HighlightGrid items={experience} />
      </section>
      <section
        className="-mx-5 border-y-[4px] border-base-content bg-accent px-5 py-16 sm:-mx-8 sm:px-8 sm:py-24"
        aria-labelledby="projects-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-3">Research</p>
              <h2
                id="projects-heading"
                className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl"
              >
                Selected projects
              </h2>
            </div>
            <p className="max-w-sm sm:text-right">
              Computer science research applying machine learning, computer
              vision, and computational optimization.
            </p>
          </div>
          <HighlightGrid items={projects} />
        </div>
      </section>
    </>
  );
}
