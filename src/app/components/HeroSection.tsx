import Link from "./Link";

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="relative hero my-8 min-h-[calc(100svh-6rem)] neu-frame-xl bg-primary">
      <div className="hero-content grid w-full gap-12 p-6 py-12 sm:p-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:p-16 lg:py-20">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-3 neu-frame-sm bg-base-100 px-3 py-2 text-base-content">
            <span className="h-2 w-2 animate-pulse bg-accent" />
            <span className="eyebrow">Computer Engineering · UF &apos;28</span>
          </div>

          <h1 className="max-w-4xl font-display text-[clamp(3.75rem,16vw,10rem)] leading-[0.72] font-extrabold tracking-[-0.085em] whitespace-nowrap text-primary-content">
            Heon
            <span className="block text-secondary">Heo.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-xl leading-relaxed font-medium text-primary-content/75 sm:text-2xl">
            I build software and explore the connections between language,
            ideas, and complex systems.
          </p>

          <div
            className="mt-8 flex flex-wrap gap-4"
            role="group"
            aria-label="Explore portfolio"
          >
            <Link
              href="/projects"
              className="btn bg-base-content text-base-100"
            >
              Explore software
              <ArrowIcon />
            </Link>
            <Link href="/books" className="btn btn-outline">
              Read notes
            </Link>
          </div>
        </div>

        <div
          className="relative mx-auto hidden h-[28rem] w-full max-w-xs lg:block"
          aria-hidden="true"
        >
          <div className="absolute top-3 right-0 w-56 rotate-6 neu-frame-lg bg-base-100 text-base-content">
            <div className="flex items-center justify-between border-b-3 border-base-content px-3 py-2 font-mono text-[0.6rem] font-black tracking-widest uppercase">
              <span>terminal</span>
              <span className="inline-flex gap-1" aria-hidden="true">
                <span className="text-error">●</span>
                <span className="text-warning">●</span>
                <span className="text-success">●</span>
              </span>
            </div>
            <div className="p-4 font-mono text-xs leading-relaxed font-bold">
              <p>
                <span className="text-base-content/60">$</span> npm run build
              </p>
              <p className="mt-2">compiled successfully</p>
              <p className="mt-2 text-base-content/60">→ 0 errors</p>
            </div>
          </div>

          <div className="absolute top-36 left-1 grid h-48 w-48 -rotate-6 place-items-center neu-frame-lg bg-accent tracking-tighter text-accent-content">
            <div className="text-center">
              <div className="font-mono text-5xl font-black">&lt;AI/&gt;</div>
              <div className="mt-3 border-t-3 border-accent-content/50 pt-2 font-mono text-[0.6rem] font-black tracking-[0.25em] uppercase">
                LLM / NLP / Optimization
              </div>
            </div>
          </div>

          <div className="absolute right-4 bottom-1 grid h-32 w-44 rotate-3 place-items-center neu-frame-lg bg-secondary text-secondary-content">
            <div className="text-center font-mono font-black">
              <div className="text-3xl leading-none tracking-[0.3em]">
                ✦0101
              </div>
              <div className="mt-2 text-[0.6rem] tracking-[0.25em] uppercase">
                embedded systems
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
