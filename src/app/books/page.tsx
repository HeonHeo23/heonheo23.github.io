import Link from "../components/Link";
import PageHeader from "../components/PageHeader";
import { formatBookTitle } from "./utils";

const bookModules = import.meta.glob("../../markdown/books/*.mdx", {
  eager: true,
});

const BooksPage = () => {
  const books = Object.keys(bookModules)
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
        eyebrow="Books"
        title="Veritas, Forma, Bonitas."
        description="A growing collection of ideas, questions, and observations from books I have read."
      />

      <section aria-labelledby="book-list-heading">
        <h2 id="book-list-heading" className="sr-only">
          Book notes
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {books.map((slug, index) => (
            <li key={slug}>
              <Link
                href={`/books/${slug}`}
                className="group card flex min-h-56 neu-card flex-col p-6"
              >
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                  <span className="tag badge-outline">Reading note</span>
                  <span className="eyebrow text-sm text-base-content/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-auto pt-12">
                  <h3 className="text-2xl tracking-tight group-hover:text-secondary sm:text-3xl">
                    {formatBookTitle(slug)} <span aria-hidden="true">↗</span>
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default BooksPage;
