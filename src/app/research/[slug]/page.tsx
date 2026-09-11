import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "../../components/Link";
import NotFoundPage from "../../components/NotFoundPage";
import { papers, type ResearchPaper } from "../data";

function PaperMetadata({ paper }: { paper: ResearchPaper }) {
  const fields = [
    ["Published", paper.publishedDate],
    ["Venue", paper.venue],
    ["Volume", `Vol. ${paper.volume}`],
    ["Article / paper number", paper.identifier],
    ["Pages", paper.pages ? `pp. ${paper.pages}` : "Not applicable"],
    ["Publisher", paper.publisher],
  ];

  return (
    <dl className="mb-10 grid gap-[3px] border-3 border-base-content bg-base-content font-mono text-sm sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div key={label} className="bg-base-100 p-4">
          <dt className="eyebrow text-secondary">{label}</dt>
          <dd className="mt-2">{value}</dd>
        </div>
      ))}
      <div className="bg-base-100 p-4 sm:col-span-2">
        <dt className="eyebrow text-secondary">DOI</dt>
        <dd className="mt-2">
          <Link
            href={paper.href}
            target="_blank"
            rel="noreferrer"
            className="link text-accent link-hover"
          >
            {paper.doi}
          </Link>
        </dd>
      </div>
    </dl>
  );
}

export default function ResearchDetailPage() {
  const { slug } = useParams();
  const paper = papers.find((item) => item.slug === slug);

  if (!paper) {
    return (
      <NotFoundPage
        title="Research paper not found"
        href="/research"
        destination="research"
      />
    );
  }

  return (
    <main className="page-shell">
      <Breadcrumbs
        items={[
          { label: "Research", href: "/research", className: "shrink-0" },
          {
            label: paper.title,
            className: "min-w-0 flex-1",
            labelClassName: "block! w-full truncate",
          },
        ]}
      />
      <article className="article-content">
        <div className="mb-10 border-b-4 border-base-content pb-10">
          <div className="tag-list">
            <span className="tag badge-primary">{paper.type}</span>
            {paper.tags.map((tag) => (
              <span key={tag} className="tag badge-outline">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-6 eyebrow text-sm text-secondary">
            {paper.published}
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-black tracking-tight sm:text-6xl">
            {paper.title}
          </h1>
          <p className="mt-6 font-mono text-sm leading-relaxed text-base-content/65">
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
          </p>
        </div>

        <PaperMetadata paper={paper} />

        <section aria-labelledby="abstract-heading">
          <p
            id="abstract-heading"
            className="mb-6 eyebrow text-lg text-secondary"
          >
            Abstract
          </p>
          <div className="space-y-8">
            {Object.entries(paper.abstractSections).map(([label, text]) => (
              <div key={label}>
                <h2 className="eyebrow text-sm">{label}</h2>
                <p className="mt-2 text-lg leading-relaxed text-base-content/80">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 card-actions flex-wrap">
          <Link
            href={paper.href}
            target="_blank"
            rel="noreferrer"
            className="btn border-2 btn-primary"
          >
            Read paper ↗
          </Link>
          <Link
            href={paper.href}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 link self-center font-mono text-sm break-all link-accent link-hover"
          >
            DOI: {paper.doi}
          </Link>
        </div>
      </article>
    </main>
  );
}
