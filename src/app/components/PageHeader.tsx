import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className = "mb-16",
}: PageHeaderProps) {
  return (
    <header className={`neu-page-header ${className}`}>
      <nav
        className="breadcrumbs eyebrow mb-4 text-primary"
        aria-label="Breadcrumb"
      >
        <ul>
          <li aria-current="page">{eyebrow}</li>
        </ul>
      </nav>
      <div className="grid gap-8 lg:gap-12">
        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
          {title}
        </h1>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <p className="max-w-2xl text-xl leading-relaxed text-base-content/70">
            {description}
          </p>
          {children}
        </div>
      </div>
    </header>
  );
}
