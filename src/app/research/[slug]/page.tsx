import { useParams } from "react-router-dom";
import Link from "../../components/Link";
import { papers } from "../data";

export default function ResearchDetailPage() {
  const { slug } = useParams();
  const paper = papers.find((item) => item.slug === slug);

  if (!paper) {
    return (
      <main className="page-shell">
        <h1 className="text-5xl font-black">Research paper not found</h1>
        <Link href="/research" className="link mt-6 inline-block text-primary">
          Back to research
        </Link>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <nav
        className="breadcrumbs eyebrow mb-10 w-full text-primary"
        aria-label="Breadcrumb"
      >
        <ul className="flex w-full min-w-0">
          <li className="shrink-0">
            <Link href="/research">Research</Link>
          </li>
          <li
            className="min-w-0 flex-1"
            aria-current="page"
            title={paper.title}
          >
            <span className="block! w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {paper.title}
            </span>
          </li>
        </ul>
      </nav>

      <article className="article-content">
        <div className="mb-10 border-b-[4px] border-base-content pb-10">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-primary rounded-none font-mono font-bold uppercase tracking-wider">
              {paper.type}
            </span>
            {paper.tags.map((tag) => (
              <span key={tag} className="badge badge-outline rounded-none">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-6 font-mono text-sm font-bold uppercase tracking-wider text-primary">
            {paper.published}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
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

        <dl className="mb-10 grid gap-[3px] border-[3px] border-base-content bg-base-content sm:grid-cols-2">
          <div className="bg-base-100 p-4">
            <dt className="eyebrow text-primary">Published</dt>
            <dd className="mt-2 font-mono text-sm font-bold">
              {paper.publishedDate}
            </dd>
          </div>
          <div className="bg-base-100 p-4">
            <dt className="eyebrow text-primary">Venue</dt>
            <dd className="mt-2 font-mono text-sm font-bold">{paper.venue}</dd>
          </div>
          <div className="bg-base-100 p-4">
            <dt className="eyebrow text-primary">Volume</dt>
            <dd className="mt-2 font-mono text-sm font-bold">
              Vol. {paper.volume}
            </dd>
          </div>
          <div className="bg-base-100 p-4">
            <dt className="eyebrow text-primary">Article / paper number</dt>
            <dd className="mt-2 font-mono text-sm font-bold">
              {paper.identifier}
            </dd>
          </div>
          <div className="bg-base-100 p-4">
            <dt className="eyebrow text-primary">Pages</dt>
            <dd className="mt-2 font-mono text-sm font-bold">
              {paper.pages ? `pp. ${paper.pages}` : "Not applicable"}
            </dd>
          </div>
          <div className="bg-base-100 p-4">
            <dt className="eyebrow text-primary">Publisher</dt>
            <dd className="mt-2 font-mono text-sm font-bold">
              {paper.publisher}
            </dd>
          </div>
          <div className="bg-base-100 p-4 sm:col-span-2">
            <dt className="eyebrow text-primary">DOI</dt>
            <dd className="mt-2 font-mono text-sm font-bold">
              <Link
                href={paper.href}
                target="_blank"
                rel="noreferrer"
                className="link link-hover text-primary"
              >
                {paper.doi}
              </Link>
            </dd>
          </div>
        </dl>

        <section aria-labelledby="abstract-heading">
          <p id="abstract-heading" className="eyebrow mb-6 text-primary">
            Abstract
          </p>
          <div className="space-y-8">
            {Object.entries(paper.abstractSections).map(([label, text]) => (
              <div key={label}>
                <h2 className="font-mono text-sm font-black uppercase tracking-widest">
                  {label}
                </h2>
                <p className="mt-2 text-lg leading-relaxed text-base-content/80">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="card-actions mt-10">
          <Link
            href={paper.href}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary rounded-none border-2 border-base-content"
          >
            Read paper ↗
          </Link>
          <Link
            href={paper.href}
            target="_blank"
            rel="noreferrer"
            className="link link-hover self-center font-mono text-sm text-primary"
          >
            DOI: {paper.doi}
          </Link>
        </div>
      </article>
    </main>
  );
}
