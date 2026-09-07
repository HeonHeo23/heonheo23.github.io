import Link from "../../components/Link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-10 sm:px-8">
      <main className="neu-surface flex w-full flex-col p-5 sm:p-8">
        <Link href={`/swe/ideagraph`}>
          <h1 className="font-display mb-6 border-b-[4px] border-base-content pb-5 text-5xl font-extrabold sm:text-6xl">
            IdeaGraph<span className="text-secondary">.</span>
          </h1>
        </Link>
        {children}
      </main>
    </div>
  );
}
