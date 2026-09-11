import type { ComponentType } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NotFoundPage from "../../components/NotFoundPage";
import { formatBookTitle } from "../utils";

const bookModules = import.meta.glob<{ default: ComponentType }>(
  "../../../markdown/books/*.mdx",
  { eager: true },
);

const Page = () => {
  const { id } = useParams();
  const BookMdx = id
    ? bookModules[`../../../markdown/books/${id}.mdx`]?.default
    : undefined;

  if (!BookMdx) {
    return (
      <NotFoundPage
        title="Reading note not found"
        href="/books"
        destination="books"
      />
    );
  }

  return (
    <main className="page-shell">
      <div className="article-content">
        <Breadcrumbs
          items={[
            {
              label: "Books",
              href: "/books",
            },
            {
              label: formatBookTitle(id ?? ""),
            },
          ]}
        />
        <article>
          <BookMdx />
        </article>
      </div>
    </main>
  );
};

export default Page;
