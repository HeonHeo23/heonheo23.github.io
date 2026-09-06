import Link from "../components/Link";

const bookModules = import.meta.glob("../../markdown/books/*.mdx", { eager: true });

function formatBookTitle(slug: string) {
  return slug
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

const BooksPage = () => {
  const books = Object.keys(bookModules)
    .map((file) => file.split("/").at(-1)?.replace(/\.mdx$/, "") ?? "")
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return (
    <main className="page-shell">
      <header className="mb-14 max-w-3xl">
        <nav className="breadcrumbs eyebrow mb-4 text-primary" aria-label="Breadcrumb">
          <ul>
            <li aria-current="page">Books</li>
          </ul>
        </nav>
        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">Veritas, Forma, Bonitas.</h1>
        <p className="mt-6 text-xl leading-relaxed text-base-content/70">
          A growing collection of ideas, questions, and observations from books I have read.
        </p>
      </header>

      <section aria-labelledby="book-list-heading">
        <h2 id="book-list-heading" className="sr-only">Book notes</h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {books.map((slug, index) => (
            <li key={slug}>
              <Link href={`/books/${slug}`} className="card offset-card group min-h-56 transition-transform hover:-translate-y-1">
                <div className="card-body p-6">
                  <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-widest text-base-content/50">
                    <span className="badge badge-outline rounded-none px-3 py-3">Reading note</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="card-title mt-auto pt-10 text-2xl tracking-tight group-hover:text-primary sm:text-3xl">
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
