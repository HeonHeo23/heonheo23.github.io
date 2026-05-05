import fs from "fs";
import path from "path";
import Link from "next/link";

const BooksPage = () => {
  const booksDir = path.join(process.cwd(), "src/markdown/books");

  const books = fs
    .readdirSync(booksDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  return (
    <div className="flex min-h-screen justify-center font-sans">
      <main className="w-full max-w-4xl py-6 px-8">
        <h1 className="text-2xl font-bold mb-4">Books I have read</h1>

        <ul className="space-y-2">
          {books.map((slug) => (
            <li key={slug}>
              <Link
                href={`/books/${slug}`}
                className="text-blue-600 hover:underline"
              >
                {slug}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default BooksPage;
