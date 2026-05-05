import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const page = async ({ params }: Props) => {
  const { id } = await params;

  let BookMdx;

  try {
    BookMdx = (await import(`@/markdown/books/${id}.mdx`)).default;
  } catch (error) {
    notFound(); // 404 if mdx doesn't exist
  }

  return (
    <div className="flex min-h-screen justify-center font-sans">
      <main className="flex w-full max-w-6xl flex-col py-4 px-8 md:px-2">
        <h1>Books I have read</h1>
        <h2>{id}</h2>
        <BookMdx />
      </main>
    </div>
  );
};

export default page;