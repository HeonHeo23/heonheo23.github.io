import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { Link as RouterLink } from "react-router-dom";

type LinkProps = PropsWithChildren<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string }
>;

export default function Link({ href, children, ...props }: LinkProps) {
  const external = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);

  if (external) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}
