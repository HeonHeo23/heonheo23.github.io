import type { ComponentType } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NotFoundPage from "../../components/NotFoundPage";
import { formatSweTitle } from "../utils";

const sweModules = import.meta.glob<{ default: ComponentType }>(
  "../../../markdown/swe/*.mdx",
  { eager: true },
);

export default function SweNotePage() {
  const { id } = useParams();
  const SweNote = id
    ? sweModules[`../../../markdown/swe/${id}.mdx`]?.default
    : undefined;

  if (!SweNote) {
    return (
      <NotFoundPage
        title="Software note not found"
        href="/swe"
        destination="software notes"
      />
    );
  }

  return (
    <main className="page-shell">
      <div className="article-content">
        <Breadcrumbs
          items={[
            { label: "SWE", href: "/swe" },
            { label: formatSweTitle(id ?? "") },
          ]}
        />
        <article>
          <SweNote />
        </article>
      </div>
    </main>
  );
}
