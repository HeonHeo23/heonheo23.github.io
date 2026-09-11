import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

// Keep this list in sync with the families and weights used in globals.css.
// Loading every face up front prevents a flash when a page uses a less common weight.
const siteFonts = [
  "400 1em Inter",
  "500 1em Inter",
  "700 1em Inter",
  "400 1em Space Grotesk",
  "500 1em Space Grotesk",
  "700 1em Space Grotesk",
  "400 1em Space Mono",
  "700 1em Space Mono",
  "700 1em Syne",
  "800 1em Syne",
];

function areFontsReady() {
  return typeof document === "undefined" || !document.fonts;
}

function waitForFontStylesheet() {
  // document.fonts.load() can resolve too early if the Google Fonts stylesheet
  // has not registered its @font-face rules yet, so wait for that stylesheet first.
  const stylesheets = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  ).filter((link) => link.href.includes("fonts.googleapis.com"));

  return Promise.all(
    stylesheets.map(
      (link) =>
        new Promise<void>((resolve) => {
          if (link.sheet) {
            resolve();
            return;
          }

          link.addEventListener("load", () => resolve(), { once: true });
          link.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

function PageSkeleton({ pathname }: { pathname: string }) {
  const detailPage =
    pathname.includes("/") &&
    (pathname.startsWith("/books/") ||
      pathname.startsWith("/research/") ||
      pathname.startsWith("/swe/") ||
      pathname.startsWith("/projects/ideagraph"));

  return (
    <main className="page-shell">
      <header className="mb-16 border-b-4 border-base-content pb-12">
        <div className="mb-4 h-4 w-32 skeleton bg-base-300" />
        <div className="h-14 w-full max-w-3xl skeleton bg-base-300 sm:h-20" />
        <div className="mt-8 space-y-3">
          <div className="h-5 w-full max-w-2xl skeleton bg-base-300" />
          <div className="h-5 w-4/5 max-w-xl skeleton bg-base-300" />
        </div>
      </header>

      {detailPage ? (
        <article className="article-content space-y-5">
          <div className="h-8 w-3/4 skeleton bg-base-300" />
          <div className="h-5 w-full skeleton bg-base-300" />
          <div className="h-5 w-full skeleton bg-base-300" />
          <div className="h-5 w-5/6 skeleton bg-base-300" />
          <div className="mt-10 h-64 w-full skeleton bg-base-300" />
        </article>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-56 skeleton bg-base-300" />
          ))}
        </section>
      )}
    </main>
  );
}

export default function FontLoadingScreen({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { pathname } = useLocation();
  const [fontsReady, setFontsReady] = useState(areFontsReady);

  useEffect(() => {
    // The loader is shared by every route, ensuring deep links get the same
    // font protection before their page-specific skeleton is replaced.
    if (fontsReady || !document.fonts) return;

    let active = true;
    void waitForFontStylesheet()
      .then(() =>
        Promise.all(siteFonts.map((font) => document.fonts.load(font))),
      )
      .then(() => document.fonts.ready)
      .then(() => {
        if (active) setFontsReady(true);
      });

    return () => {
      active = false;
    };
  }, [fontsReady]);

  // Do not mount the real app until all requested font faces are ready
  if (fontsReady) return children;

  return (
    <div
      className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-base-100 font-sans"
      aria-busy="true"
      aria-label="Loading site"
    >
      <header className="sticky top-0 z-50 border-b-4 border-base-content bg-base-100">
        <div className="site-shell">
          <div className="navbar h-16 min-h-16 px-0">
            <div className="navbar-start gap-2">
              <div className="h-12 w-12 skeleton bg-base-300 lg:hidden" />
              <div className="h-10 w-10 skeleton bg-base-300" />
              <div className="hidden h-5 w-32 skeleton bg-base-300 sm:block" />
            </div>
            <div className="navbar-center hidden gap-3 lg:flex">
              <div className="h-5 w-16 skeleton bg-base-300" />
              <div className="h-5 w-16 skeleton bg-base-300" />
              <div className="h-5 w-16 skeleton bg-base-300" />
            </div>
            <div className="navbar-end">
              <div className="h-12 w-12 skeleton bg-base-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Keep the placeholder aligned with the route being loaded. */}
      {pathname === "/" ? (
        <main className="min-w-0 flex-1">
          <div className="site-shell">
            <section className="hero my-8 min-h-[calc(100svh-6rem)] neu-frame-xl bg-primary">
              <div className="hero-content grid w-full gap-12 p-6 py-12 sm:p-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:p-16 lg:py-20">
                <div>
                  <div className="h-10 w-64 max-w-full skeleton bg-primary-content/20" />
                  <div className="mt-8 space-y-3">
                    <div className="h-16 w-3/4 max-w-2xl skeleton bg-primary-content/20 sm:h-28" />
                    <div className="h-16 w-3/5 max-w-xl skeleton bg-secondary/50 sm:h-28" />
                  </div>
                  <div className="mt-10 space-y-3">
                    <div className="h-6 w-full max-w-2xl skeleton bg-primary-content/20" />
                    <div className="h-6 w-4/5 max-w-xl skeleton bg-primary-content/20" />
                  </div>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <div className="h-12 w-44 skeleton bg-primary-content/20" />
                    <div className="h-12 w-32 skeleton bg-primary-content/20" />
                  </div>
                </div>
                <div className="relative mx-auto hidden h-112 w-full max-w-xs lg:block">
                  <div className="absolute top-3 right-0 h-48 w-56 rotate-6 skeleton bg-primary-content/20" />
                  <div className="absolute top-36 left-1 h-48 w-48 -rotate-6 skeleton bg-accent/50" />
                  <div className="absolute right-4 bottom-1 h-32 w-44 rotate-3 skeleton bg-secondary/50" />
                </div>
              </div>
            </section>

            <section className="border-t-4 border-base-content py-16 sm:py-24">
              <div className="h-5 w-24 skeleton bg-base-300" />
              <div className="mt-4 h-12 w-72 max-w-full skeleton bg-base-300" />
              <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="h-64 skeleton bg-base-300" />
                ))}
              </div>
            </section>

            <section className="-mx-5 border-y-4 border-base-content bg-accent px-5 py-16 sm:-mx-8 sm:px-8 sm:py-24">
              <div className="h-5 w-24 skeleton bg-accent-content/20" />
              <div className="mt-4 h-12 w-72 max-w-full skeleton bg-accent-content/20" />
              <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="h-64 skeleton bg-accent-content/20" />
                <div className="h-64 skeleton bg-accent-content/20" />
              </div>
            </section>
          </div>
        </main>
      ) : (
        <div className="min-w-0 flex-1">
          <PageSkeleton pathname={pathname} />
        </div>
      )}

      <footer className="footer min-w-0 footer-vertical border-t-4 border-base-content bg-neutral sm:footer-horizontal">
        <div className="site-shell grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-10 py-12 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:gap-8 sm:py-16">
          <div className="col-span-full sm:col-span-1">
            <div className="h-10 w-48 skeleton bg-neutral-content/20" />
            <div className="mt-5 space-y-3">
              <div className="h-4 w-full max-w-xs skeleton bg-neutral-content/20" />
              <div className="h-4 w-4/5 max-w-xs skeleton bg-neutral-content/20" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-20 skeleton bg-neutral-content/20" />
            <div className="h-4 w-24 skeleton bg-neutral-content/20" />
            <div className="h-4 w-24 skeleton bg-neutral-content/20" />
            <div className="h-4 w-24 skeleton bg-neutral-content/20" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-20 skeleton bg-neutral-content/20" />
            <div className="h-4 w-36 skeleton bg-neutral-content/20" />
            <div className="h-4 w-36 skeleton bg-neutral-content/20" />
            <div className="h-4 w-36 skeleton bg-neutral-content/20" />
          </div>
          <div className="col-span-full border-t-2 border-neutral-content/30 pt-5">
            <div className="h-4 w-64 max-w-full skeleton bg-neutral-content/20" />
          </div>
        </div>
      </footer>
    </div>
  );
}
