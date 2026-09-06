import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (props) => (
    <h1
      {...props}
      className="mb-8 mt-4 text-4xl font-black leading-tight tracking-tight text-base-content sm:text-6xl"
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className="mb-4 mt-14 border-t-2 border-base-300 pt-7 text-3xl font-black leading-tight tracking-tight text-base-content sm:text-4xl"
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="mb-3 mt-10 text-2xl font-bold leading-snug text-primary sm:text-3xl"
    />
  ),
  h4: (props) => (
    <h4
      {...props}
      className="mb-2 mt-8 font-mono text-lg font-bold uppercase tracking-wide text-base-content"
    />
  ),
  p: (props) => (
    <p
      {...props}
      className="my-5 text-[1.05rem] leading-8 text-base-content/80"
    />
  ),
  a: (props) => (
    <a
      {...props}
      className="font-semibold text-primary underline decoration-2 underline-offset-4 transition-colors hover:text-secondary"
    />
  ),
  ul: (props) => (
    <ul {...props} className="my-6 ml-6 list-disc space-y-2 marker:text-primary" />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="my-6 ml-6 list-decimal space-y-2 marker:font-mono marker:font-bold marker:text-primary"
    />
  ),
  li: (props) => <li {...props} className="pl-2 leading-7 text-base-content/80" />,
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-8 border-l-8 border-secondary bg-base-200 px-6 py-2 text-lg font-medium italic text-base-content"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="my-8 overflow-x-auto border-2 border-base-content bg-neutral p-5 text-sm leading-7 text-neutral-content shadow-[5px_5px_0_0_var(--color-primary)]"
    />
  ),
  code: (props) => (
    <code
      {...props}
      className="border border-base-300 bg-base-200 px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-base-content"
    />
  ),
  hr: (props) => <hr {...props} className="my-12 border-t-2 border-base-content" />,
  img: (props) => (
    // MDX images may be remote or authored directly in notes.
    <img {...props} className="my-8 h-auto max-w-full border-2 border-base-content" />
  ),
  table: (props) => (
    <table
      {...props}
      className="my-8 block w-full overflow-x-auto border-collapse font-mono text-sm"
    />
  ),
  th: (props) => (
    <th
      {...props}
      className="border-2 border-base-content bg-primary px-4 py-3 text-left text-primary-content"
    />
  ),
  td: (props) => (
    <td {...props} className="border-2 border-base-content px-4 py-3 text-base-content/80" />
  ),
  strong: (props) => <strong {...props} className="font-black text-base-content" />,
};

export const mdxComponents = components;
