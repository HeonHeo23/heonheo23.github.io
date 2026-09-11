import Link from "../components/Link";
import PageHeader from "../components/PageHeader";
import { papers } from "./data";

const scholarProfile =
  "https://scholar.google.com/citations?user=73uyDIEAAAAJ&hl=en";

export default function ResearchPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Research"
        title="Research in practice."
        description="I use machine learning, computer vision, and computational optimization to solve problems across software, engineering, and scientific research."
      >
        <Link
          href={scholarProfile}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline"
        >
          Google Scholar ↗
        </Link>
      </PageHeader>

      <section aria-labelledby="papers-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="papers-heading"
            className="text-3xl font-black tracking-tight sm:text-4xl"
          >
            Selected papers
          </h2>
          <span className="tag badge-outline">{papers.length} works</span>
        </div>

        <div className="space-y-8">
          {papers.map((paper) => (
            <article key={paper.slug} className="card neu-card">
              <div className="card-body p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="tag-list">
                    <span className="tag uppercase badge-primary">
                      {paper.type}
                    </span>
                    {paper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag badge-outline tracking-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="date text-sm text-base-content/45">
                    {paper.published}
                  </span>
                </div>

                <h3 className="mt-8 card-title max-w-4xl text-2xl leading-tight sm:text-4xl">
                  <Link
                    href={`/research/${paper.slug}`}
                    className="hover:text-accent hover:underline"
                  >
                    {paper.title}
                  </Link>
                </h3>
                <p className="mt-4 max-w-4xl font-mono text-sm leading-relaxed text-base-content/65">
                  {paper.authors.split(/(Heon Heo)/g).map((author, index) =>
                    author === "Heon Heo" ? (
                      <strong
                        key={`${author}-${index}`}
                        className="font-black text-base-content"
                      >
                        {author}
                      </strong>
                    ) : (
                      <span key={`${author}-${index}`}>{author}</span>
                    ),
                  )}
                  <br />
                  {paper.venue} · {paper.publisher}
                  <br />
                  DOI:{" "}
                  <Link
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-accent link-hover"
                  >
                    {paper.doi}
                  </Link>
                </p>

                <div className="divider my-4" />

                <div className="max-w-4xl">
                  <p className="mb-3 eyebrow text-secondary">Summary</p>
                  <p className="leading-relaxed text-base-content/80">
                    {paper.abstract}
                  </p>
                </div>

                <div className="mt-6 card-actions">
                  <Link
                    href={`/research/${paper.slug}`}
                    className="btn border-2 btn-outline"
                  >
                    More ↗
                  </Link>
                  <Link
                    href={paper.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn border-2 btn-primary"
                  >
                    Read paper ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
