import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (props) => (
    <h1 {...props} className="text-4xl font-bold text-primary my-4" />
  ),
  h2: (props) => (
    <h2 {...props} className="text-3xl font-semibold text-secondary my-3" />
  ),
  h3: (props) => (
    <h3 {...props} className="text-2xl font-medium text-accent my-2" />
  ),
  h4: (props) => (
    <h4 {...props} className="text-xl font-medium text-neutral my-2" />
  ),
  p: (props) => (
    <p {...props} className="text-base text-base-content leading-7 my-2" />
  ),
  a: (props) => (
    <a {...props} className="text-primary hover:text-primary-focus underline" />
  ),
  ul: (props) => <ul {...props} className="list-disc list-inside my-2" />,
  ol: (props) => <ol {...props} className="list-decimal list-inside my-2" />,
  li: (props) => <li {...props} className="my-1" />,
  blockquote: (props) => (
    <blockquote
      {...props}
      className="border-l-4 border-secondary pl-4 italic text-base-content/80 my-4"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="bg-base-200 p-4 rounded-lg overflow-x-auto my-4"
    />
  ),
  code: (props) => (
    <code
      {...props}
      className="bg-base-300 px-1 py-0.5 rounded text-sm font-mono"
    />
  ),
  hr: (props) => <hr {...props} className="my-6 border-base-300" />,
  img: (props) => <img {...props} className="rounded-lg my-4" />,
  table: (props) => (
    <table
      {...props}
      className="table-auto border-collapse border border-base-300 w-full my-4"
    />
  ),
  th: (props) => (
    <th
      {...props}
      className="border border-base-300 px-4 py-2 text-left bg-base-200"
    />
  ),
  td: (props) => <td {...props} className="border border-base-300 px-4 py-2" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
