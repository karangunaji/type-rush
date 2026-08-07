import TypingTest from "@/components/TypingTest";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="rounded-[2rem] border border-slate-700/80 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">
                Typing trainer
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                TypeRush
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Train typing speed and accuracy with a modern, responsive challenge. Play anywhere on desktop, tablet, or mobile for fast improvement.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-800/90 p-6 text-center ring-1 ring-slate-700/70">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">60 sec session</p>
              <p className="mt-4 text-3xl font-bold text-sky-400">Practice daily</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Get instant feedback on WPM, accuracy, mistakes, and typing flow.
              </p>
            </div>
          </div>
        </header>

        <TypingTest />
      </div>
    </main>
  );
}