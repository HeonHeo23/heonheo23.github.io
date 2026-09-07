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
    <section className="hero relative my-8 min-h-[calc(100svh-6rem)] border-[4px] border-base-content bg-primary shadow-[12px_12px_0_0_var(--color-base-content)]">
      <div className="hero-content grid w-full max-w-none gap-12 p-6 py-12 sm:p-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:p-16 lg:py-20">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-3 border-[3px] border-base-content bg-base-100 px-3 py-2 text-base-content shadow-[3px_3px_0_0_var(--color-base-content)]">
            <span className="h-2 w-2 animate-pulse bg-secondary" />
            <span className="eyebrow">Computer Engineering · UF &apos;28</span>
          </div>

          <h1 className="font-display max-w-4xl text-[clamp(4.75rem,16vw,10rem)] font-extrabold leading-[0.72] tracking-[-0.085em] text-base-content">
            Heon
            <span className="block text-secondary">Heo.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-xl font-medium leading-relaxed text-base-content/75 sm:text-2xl">
            I build software and explore the connections between language,
            ideas, and complex systems.
          </p>

          <div
            className="mt-8 flex flex-wrap gap-4"
            role="group"
            aria-label="Explore portfolio"
          >
            <Link
              href="/swe"
              className="btn bg-base-content px-6 text-base-100"
            >
              Explore software
              <ArrowIcon />
            </Link>
            <Link href="/books" className="btn btn-outline px-6">
              Read notes
            </Link>
          </div>
        </div>

        <div
          className="relative mx-auto hidden h-[28rem] w-full max-w-xs lg:block"
          aria-hidden="true"
        >
          <div className="absolute right-0 top-3 w-56 rotate-6 border-[3px] border-base-content bg-base-content text-base-100 shadow-[8px_8px_0_0_var(--color-base-content)]">
            <div className="flex items-center justify-between border-b-[3px] border-base-100 px-3 py-2 font-mono text-[0.6rem] font-black uppercase tracking-widest">
              <span>terminal</span>
              <span aria-hidden="true">● ● ●</span>
            </div>
            <div className="p-4 font-mono text-xs font-bold leading-relaxed">
              <p>
                <span className="text-base-100/60">$</span> npm run build
              </p>
              <p className="mt-2">compiled successfully</p>
              <p className="mt-2 text-base-100/60">→ 0 errors</p>
            </div>
          </div>

          <div className="absolute left-1 top-36 grid h-48 w-48 -rotate-6 place-items-center border-[3px] border-base-content bg-accent text-accent-content shadow-[8px_8px_0_0_var(--color-base-content)]">
            <div className="text-center">
              <div className="font-mono text-5xl font-black leading-none">
                &lt;AI/&gt;
              </div>
              <div className="mt-3 border-t-[3px] border-accent-content/50 pt-2 font-mono text-[0.6rem] font-black uppercase tracking-[0.25em]">
                LLM / NLP / Optimization
              </div>
            </div>
          </div>

          <div className="absolute bottom-1 right-4 grid h-32 w-44 rotate-3 place-items-center border-[3px] border-base-content bg-secondary text-secondary-content shadow-[6px_6px_0_0_var(--color-base-content)]">
            <div className="text-center font-mono font-black">
              <div className="text-3xl leading-none tracking-[0.3em]">
                ✦0101
              </div>
              <div className="mt-2 text-[0.6rem] uppercase tracking-[0.25em]">
                embedded systems
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
