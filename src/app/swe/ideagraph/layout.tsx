import Link from "../../components/Link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen justify-center font-sans">
      <main className="flex w-full max-w-6xl flex-col py-4 px-8 md:px-4">
        <Link href={`/swe/ideagraph`}>
          <h1 className="content-center text-6xl font-extrabold link-hover mb-4">IdeaGraph</h1>
        </Link>
        {children}
      </main>
    </div>
  );
}
