import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heon Heo",
  description: "Personal Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen justify-center font-sans">
      <main className="flex w-full max-w-6xl flex-col py-4 px-8 md:px-4">
        <Link href={`/swe/denom`}>
          <h1 className="content-center text-6xl font-extrabold link-hover mb-4">
            The Denomination
          </h1>
        </Link>
        {children}
      </main>
    </div>
  );
}
