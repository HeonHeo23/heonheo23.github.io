import type { ReactNode } from "react";
import Link from "./Link";
import { cn } from "./cn";

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  className?: string;
  labelClassName?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  listClassName?: string;
};

export default function Breadcrumbs({
  items,
  className,
  listClassName,
}: BreadcrumbsProps) {
  return (
    <nav
      className={cn("breadcrumbs mb-4 eyebrow", className)}
      aria-label="Breadcrumb"
    >
      <ul className={cn("flex w-full min-w-0", listClassName)}>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          const content =
            current || !item.href ? (
              <span className={item.labelClassName}>{item.label}</span>
            ) : (
              <Link href={item.href} className={item.labelClassName}>
                {item.label}
              </Link>
            );

          return (
            <li
              key={index}
              className={cn(current && "min-w-0", item.className)}
              aria-current={current ? "page" : undefined}
            >
              {content}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
