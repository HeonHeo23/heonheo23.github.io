import type { ReactNode } from "react";
import Breadcrumbs, { type BreadcrumbItem } from "./Breadcrumbs";
import { cn } from "./cn";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <header
      className={cn("mb-16 border-b-4 border-base-content pb-12", className)}
    >
      <Breadcrumbs items={breadcrumbs ?? [{ label: eyebrow }]} />
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
