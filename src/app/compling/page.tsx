import Proposal from "@/markdown/proposal.mdx";
import Proposal1 from "@/markdown/proposal1.mdx";
type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex min-h-screen justify-center font-sans">
      <main className="flex w-full max-w-6xl flex-col py-4 px-8 md:px-2">
        <h1>Compling Projects</h1>
        <ul>
          <li>Koine Greek</li>
          <li>Semantics</li>
          <li>Vector context</li>
          <li>Translation issue</li>
        </ul>
        <Proposal />
        <Proposal1 />
      </main>
    </div>
  );
};

export default page;
