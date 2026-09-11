import Link from "../../components/Link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-10 sm:px-8">
      <main className="flex w-full flex-col neu-frame-md bg-base-100 p-5 sm:p-8">
        <Link href={`/projects/ideagraph`}>
          <h1 className="mb-6 border-b-4 border-base-content pb-5 font-display text-5xl font-extrabold sm:text-6xl">
            IdeaGraph<span className="text-secondary">.</span>
          </h1>
        </Link>
        {children}
      </main>
    </div>
  );
}
