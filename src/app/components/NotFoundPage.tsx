import Link from "./Link";

type NotFoundPageProps = {
  title: string;
  href: string;
  destination: string;
};

export default function NotFoundPage({
  title,
  href,
  destination,
}: NotFoundPageProps) {
  return (
    <main className="page-shell">
      <h1 className="text-5xl font-black">{title}</h1>
      <Link href={href} className="mt-6 inline-block link text-primary">
        Back to {destination}
      </Link>
    </main>
  );
}
