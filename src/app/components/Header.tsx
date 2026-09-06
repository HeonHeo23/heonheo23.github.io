"use client";

import { useLocation } from "react-router-dom";
import Link from "./Link";
import ThemeToggle from "./ThemeToggle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Compling", href: "/compling" },
  { name: "Research", href: "/research" },
  { name: "SWE", href: "/swe" },
  { name: "Books", href: "/books" },
];

function isActiveRoute(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-base-content bg-base-100/95 backdrop-blur">
      <div className="site-shell">
        <div className="navbar min-h-16 px-0">
          <div className="navbar-start gap-2">
            <details className="dropdown lg:hidden">
              <summary
                className="btn btn-ghost btn-square list-none"
                aria-label="Open navigation menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </summary>
              <ul className="menu dropdown-content z-10 mt-3 w-56 border-2 border-base-content bg-base-100 p-2 shadow-[5px_5px_0_0_var(--color-base-content)]">
                {navigation.map((item) => {
                  const active = isActiveRoute(pathname, item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={active ? "menu-active bg-primary text-primary-content" : ""}
                        aria-current={active ? "page" : undefined}
                        onClick={(event) =>
                          event.currentTarget.closest("details")?.removeAttribute("open")
                        }
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>

            <Link
              href="/"
              className="group flex items-center gap-3 font-bold tracking-tight"
              aria-label="Heon Heo, home"
            >
              <span className="grid h-10 w-10 place-items-center border-2 border-base-content bg-accent font-mono text-sm font-black text-accent-content transition-transform group-hover:-rotate-3">
                HH
              </span>
              <span className="hidden sm:inline">heonheo.com</span>
            </Link>
          </div>

          <nav className="navbar-center hidden lg:flex" aria-label="Primary navigation">
            <ul className="menu menu-horizontal gap-1 px-1 font-mono text-sm font-bold uppercase tracking-wider">
              {navigation.map((item) => {
                const active = isActiveRoute(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        active
                          ? "menu-active rounded-none bg-primary text-primary-content"
                          : "rounded-none hover:bg-base-200"
                      }
                      aria-current={active ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="navbar-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
