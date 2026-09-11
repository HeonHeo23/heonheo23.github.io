import Link from "../components/Link";
import PageHeader from "../components/PageHeader";
import { formatSweTitle } from "./utils";

const sweModules = import.meta.glob("../../markdown/swe/*.mdx", {
  eager: true,
});

export default function SwePage() {
  const notes = Object.keys(sweModules)
    .map(
      (file) =>
        file
          .split("/")
          .at(-1)
          ?.replace(/\.mdx$/, "") ?? "",
    )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="SWE"
        title="Software notes."
        description="Short implementation notes and design records from ongoing software work."
      />

      <section aria-labelledby="swe-note-list-heading">
        <h2 id="swe-note-list-heading" className="sr-only">
          Software notes
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {notes.map((slug, index) => (
            <li key={slug}>
              <Link
                href={`/swe/${slug}`}
                className="group card flex min-h-56 neu-card flex-col p-6"
              >
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                  <span className="tag badge-outline">Software note</span>
                  <span className="eyebrow text-sm text-base-content/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-auto pt-12">
                  <h3 className="text-2xl tracking-tight group-hover:text-secondary sm:text-3xl">
                    {formatSweTitle(slug)} <span aria-hidden="true">↗</span>
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
