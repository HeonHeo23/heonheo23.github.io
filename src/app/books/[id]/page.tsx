import type { ComponentType } from "react";
import { useParams } from "react-router-dom";
import Link from "../../components/Link";

const bookModules = import.meta.glob<{ default: ComponentType }>(
  "../../../markdown/books/*.mdx",
  { eager: true },
);

const Page = () => {
  const { id } = useParams();
  const BookMdx = id ? bookModules[`../../../markdown/books/${id}.mdx`]?.default : undefined;

  if (!BookMdx) {
    return (
      <main className="page-shell">
        <h1 className="text-5xl font-black">Reading note not found</h1>
        <Link href="/books" className="link mt-6 inline-block text-primary">Back to books</Link>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="article-content">
        <nav
          className="breadcrumbs mb-10 border-b-2 border-base-content pb-5 font-mono text-xs font-bold uppercase tracking-widest"
          aria-label="Breadcrumb"
        >
          <ul>
            <li>
              <Link href="/books" className="link-hover text-primary">
                Books
              </Link>
            </li>
            <li className="text-base-content/60">Reading note</li>
          </ul>
        </nav>
        <article>
          <BookMdx />
        </article>
      </div>
    </main>
  );
};

export default Page;
