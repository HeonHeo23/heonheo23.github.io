import { useEffect, type ComponentType, type ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import RootLayout from "./app/layout";
import Home from "./app/page";
import ComplingPage from "./app/compling/page";
import BooksPage from "./app/books/page";
import BookPage from "./app/books/[id]/page";
import ResearchPage from "./app/research/page";
import ResearchDetailPage from "./app/research/[slug]/page";
import ProjectPage from "./app/project/page";
import SwePage from "./app/swe/page";
import SweNotePage from "./app/swe/[id]/page";
import IdeaGraphPage from "./app/swe/ideagraph/page";
import IdeaPage from "./app/swe/ideagraph/[id]/page";
import EditIdeaPage from "./app/swe/ideagraph/edit/[id]/page";
import InfluencePage from "./app/swe/ideagraph/influence/page";
import AddInfluencePage from "./app/swe/ideagraph/influence/add/page";
import IdeaGraphLayout from "./app/swe/ideagraph/layout";
import NotFoundPage from "./app/components/NotFoundPage";

const titles: Record<string, string> = {
  "/": "Heon Heo",
  "/compling": "Compling | Heon Heo",
  "/books": "Books | Heon Heo",
  "/research": "Research | Heon Heo",
  "/projects": "Projects | Heon Heo",
  "/swe": "Software Notes | Heon Heo",
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
          : pathname.startsWith("/projects/")
            ? "Projects | Heon Heo"
            : pathname.startsWith("/swe/")
              ? "Software Note | Heon Heo"
              : "Heon Heo");
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function InLayout({
  layout: Layout,
  children,
}: {
  layout: ComponentType<{ children: ReactNode }>;
  children: ReactNode;
}) {
  return <Layout>{children}</Layout>;
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
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/swe" element={<SwePage />} />
        <Route path="/swe/:id" element={<SweNotePage />} />
        <Route
          path="/projects/ideagraph"
          element={
            <InLayout layout={IdeaGraphLayout}>
              <IdeaGraphPage />
            </InLayout>
          }
        />
        <Route
          path="/projects/ideagraph/influence"
          element={
            <InLayout layout={IdeaGraphLayout}>
              <InfluencePage />
            </InLayout>
          }
        />
        <Route
          path="/projects/ideagraph/influence/add"
          element={
            <InLayout layout={IdeaGraphLayout}>
              <AddInfluencePage />
            </InLayout>
          }
        />
        <Route
          path="/projects/ideagraph/edit/:id"
          element={
            <InLayout layout={IdeaGraphLayout}>
              <EditIdeaPage />
            </InLayout>
          }
        />
        <Route
          path="/projects/ideagraph/:id"
          element={
            <InLayout layout={IdeaGraphLayout}>
              <IdeaPage />
            </InLayout>
          }
        />
        <Route
          path="*"
          element={
            <NotFoundPage title="Page not found" href="/" destination="home" />
          }
        />
      </Routes>
    </RootLayout>
  );
}
