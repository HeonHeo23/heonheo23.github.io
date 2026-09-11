"use client";

import { useLocation } from "react-router-dom";
import Link from "./Link";
import ThemeToggle from "./ThemeToggle";
import { cn } from "./cn";
import { siteNavigation } from "./navigation";

function isActiveRoute(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-base-content bg-base-100">
      <div className="site-shell">
        <div className="navbar h-16 min-h-16 px-0">
          <div className="navbar-start gap-2">
            <details className="dropdown lg:hidden">
              <summary
                className="btn btn-square list-none bg-base-100"
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
              <ul className="dropdown-content menu z-10 mt-3 w-56 neu-frame-md bg-base-100 p-2">
                {siteNavigation.map((item) => {
                  const active = isActiveRoute(pathname, item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(active && "menu-active")}
                        aria-current={active ? "page" : undefined}
                        onClick={(event) =>
                          event.currentTarget
                            .closest("details")
                            ?.removeAttribute("open")
                        }
                      >
                        {item.label}
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
              <span className="grid h-10 w-10 place-items-center neu-frame-sm bg-secondary font-mono text-sm font-black text-secondary-content transition-transform group-hover:-rotate-3">
                HH
              </span>
              <span className="hidden sm:inline">heonheo.com</span>
            </Link>
          </div>

          <nav
            className="navbar-center hidden lg:flex"
            aria-label="Primary navigation"
          >
            <ul className="menu menu-horizontal gap-1 px-1 font-heading text-sm font-black tracking-wider uppercase">
              {siteNavigation.map((item) => {
                const active = isActiveRoute(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        active ? "menu-active" : "hover:bg-base-200",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
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
