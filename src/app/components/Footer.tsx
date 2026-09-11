import Link from "./Link";
import { siteNavigation } from "./navigation";

const socialLinks = [
  {
    label: "GitHub / HeonHeo23",
    account: "HeonHeo23",
    href: "https://github.com/HeonHeo23",
    icon: "github",
  },
  {
    label: "LinkedIn / HeonHeo",
    account: "HeonHeo",
    href: "https://www.linkedin.com/in/heonheo/",
    icon: "linkedin",
  },
  {
    label: "Email / heonheo23@gmail.com",
    account: "heonheo23@gmail.com",
    href: "mailto:heonheo23@gmail.com",
    icon: "email",
  },
] as const;

type SocialIconName = (typeof socialLinks)[number]["icon"];

function SocialIcon({ name }: { name: SocialIconName }) {
  const iconClassName =
    name === "linkedin" ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0";

  if (name === "github") {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.54 20.45H7.1V8.99H3.54v11.46ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5a2.25 2.25 0 0 1 2.25 2.25v.82L12 13.88 1.5 7.57v-.82Z" />
      <path d="M1.5 9.88v8.37a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25V9.88l-9.73 5.84a1.5 1.5 0 0 1-1.54 0L1.5 9.88Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer min-w-0 footer-vertical overflow-x-clip border-t-4 border-base-content bg-neutral font-heading text-neutral-content sm:footer-horizontal">
      <div className="site-shell grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-10 py-12 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:gap-8 sm:py-16">
        <div className="col-span-full max-w-md sm:col-span-1">
          <h2 className="max-w-sm font-display text-3xl font-extrabold tracking-[-0.085em] sm:text-4xl">
            Heon <span className="text-secondary">Heo.</span>
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-content/70">
            A personal archive of research, experiments, and notes in progress.
          </p>
        </div>

        <nav aria-label="Sitemap" className="flex min-w-0 flex-col gap-3">
          <h3 className="footer-title eyebrow text-sm">Sitemap</h3>
          {siteNavigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="w-fit text-sm font-bold underline-offset-4 hover:bg-primary hover:text-primary-content"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Social links" className="flex min-w-0 flex-col gap-3">
          <h3 className="footer-title eyebrow text-sm">Find me</h3>
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
              aria-label={link.label}
              className="inline-flex w-fit max-w-full items-center gap-2 text-sm font-bold whitespace-nowrap underline-offset-4 hover:bg-primary hover:text-primary-content"
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center">
                <SocialIcon name={link.icon} />
              </span>
              <span className="sm:hidden">{link.account}</span>
              <span className="hidden sm:inline">{link.label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>

        <div className="col-span-full flex min-w-0 flex-col gap-2 border-t-2 border-neutral-content/30 pt-5 text-xs text-neutral-content/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Heon Heo. All rights reserved.</p>
          <p>Built with React and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
