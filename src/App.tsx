import { useEffect, type ComponentType, type ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import RootLayout from "./app/layout";
import Home from "./app/page";
import ComplingPage from "./app/compling/page";
import BooksPage from "./app/books/page";
import BookPage from "./app/books/[id]/page";
import ResearchPage from "./app/research/page";
import ResearchDetailPage from "./app/research/[slug]/page";
import SwePage from "./app/swe/page";
import IdeaGraphPage from "./app/swe/ideagraph/page";
import IdeaPage from "./app/swe/ideagraph/[id]/page";
import EditIdeaPage from "./app/swe/ideagraph/edit/[id]/page";
import InfluencePage from "./app/swe/ideagraph/influence/page";
import AddInfluencePage from "./app/swe/ideagraph/influence/add/page";
import IdeaGraphLayout from "./app/swe/ideagraph/layout";

const titles: Record<string, string> = {
  "/": "Heon Heo",
  "/compling": "Compling | Heon Heo",
  "/books": "Books | Heon Heo",
  "/research": "Research | Heon Heo",
  "/swe": "Software | Heon Heo",
};

function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title =
      titles[pathname] ??
      (pathname.startsWith("/books/")
        ? "Reading Note | Heon Heo"
        : pathname.startsWith("/research/")
          ? "Research | Heon Heo"
          : pathname.startsWith("/swe/")
            ? "Software | Heon Heo"
            : "Heon Heo");
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function InLayout({ layout: Layout, children }: { layout: ComponentType<{ children: ReactNode }>; children: ReactNode }) {
  return <Layout>{children}</Layout>;
}

function NotFound() {
  return (
    <main className="page-shell">
      <h1 className="text-5xl font-black">Page not found</h1>
      <p className="mt-4 text-base-content/70">The requested page does not exist.</p>
    </main>
  );
}

export default function App() {
  return (
    <RootLayout>
      <PageMeta />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compling" element={<ComplingPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/:slug" element={<ResearchDetailPage />} />
        <Route path="/swe" element={<SwePage />} />
        <Route path="/swe/ideagraph" element={<InLayout layout={IdeaGraphLayout}><IdeaGraphPage /></InLayout>} />
        <Route path="/swe/ideagraph/influence" element={<InLayout layout={IdeaGraphLayout}><InfluencePage /></InLayout>} />
        <Route path="/swe/ideagraph/influence/add" element={<InLayout layout={IdeaGraphLayout}><AddInfluencePage /></InLayout>} />
        <Route path="/swe/ideagraph/edit/:id" element={<InLayout layout={IdeaGraphLayout}><EditIdeaPage /></InLayout>} />
        <Route path="/swe/ideagraph/:id" element={<InLayout layout={IdeaGraphLayout}><IdeaPage /></InLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RootLayout>
  );
}
