import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (props) => (
    <h1
      {...props}
      className="mt-4 mb-8 text-4xl leading-tight font-black tracking-tight text-base-content sm:text-6xl"
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className="mt-14 mb-4 border-t-4 border-base-content pt-7 text-3xl leading-tight font-black tracking-tight text-base-content sm:text-4xl"
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="mt-10 mb-3 text-2xl leading-snug font-bold text-primary sm:text-3xl"
    />
  ),
  h4: (props) => (
    <h4
      {...props}
      className="mt-8 mb-2 font-mono text-lg font-bold tracking-wide text-base-content uppercase"
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
    <ul
      {...props}
      className="my-6 ml-6 list-disc space-y-2 marker:text-primary"
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="my-6 ml-6 list-decimal space-y-2 marker:font-mono marker:font-bold marker:text-primary"
    />
  ),
  li: (props) => (
    <li {...props} className="pl-2 leading-7 text-base-content/80" />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-8 border-l-8 border-secondary bg-base-200 px-6 py-4 text-lg font-medium text-base-content italic"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="my-8 overflow-x-auto neu-frame-md bg-neutral p-5 text-sm leading-7 text-neutral-content"
    />
  ),
  code: (props) => (
    <code
      {...props}
      className="border-2 border-base-content bg-base-200 px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-base-content"
    />
  ),
  hr: (props) => (
    <hr {...props} className="my-12 border-t-2 border-base-content" />
  ),
  img: (props) => (
    // MDX images may be remote or authored directly in notes.
    <img {...props} className="my-8 h-auto max-w-full neu-frame-md" />
  ),
  table: (props) => (
    <table
      {...props}
      className="my-8 block w-full border-collapse overflow-x-auto font-mono text-sm"
    />
  ),
  th: (props) => (
    <th
      {...props}
      className="border-3 border-base-content bg-primary px-4 py-3 text-left text-primary-content"
    />
  ),
  td: (props) => (
    <td
      {...props}
      className="border-3 border-base-content px-4 py-3 text-base-content/80"
    />
  ),
  strong: (props) => (
    <strong {...props} className="font-black text-base-content" />
  ),
};

export const mdxComponents = components;
