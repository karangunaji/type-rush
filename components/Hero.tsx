import React from "react";

type Level = "low" | "medium" | "hard" | "bhc";

export default function Hero({ onStart, selected }: { onStart: (level: Level) => void; selected?: Level }) {
  const levels: { key: Level; title: string; desc: string }[] = [
    { key: "low", title: "Low", desc: "Shorter prompts, easier pace." },
    { key: "medium", title: "Medium", desc: "Balanced challenge for practice." },
    { key: "hard", title: "Hard", desc: "Longer prompts, faster pace." },
    { key: "bhc", title: "BHC-Clerk Typing Test", desc: "Practice or custom challenge for the full BHC flow." },
  ];

  return (
    <section>
      <header className="rounded-4xl border border-surface-strong bg-surface-strong p-8 shadow-2xl shadow-slate-950/30">
        <div className="grid gap-8 lg:grid-cols-1 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Typing trainer</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">TypeRush</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Train typing speed and accuracy with a modern, responsive challenge. Choose a difficulty and start a timed session.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {levels.map((lvl) => (
          <div
            key={lvl.key}
            className="group min-h-[15rem] rounded-2xl border border-surface bg-surface p-5 text-center transition duration-200 ease-out hover:border-accent hover:bg-surface-strong"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-muted mt-7">{lvl.title}</p>
            <p className="mt-2 text-sm text-muted whitespace-normal break-words">{lvl.desc}</p>
            <button
              onClick={() => onStart(lvl.key)}
              className="mt-4 inline-flex items-center justify-center rounded-3xl bg-accent px-4 py-2 text-sm font-semibold text-foreground hover:brightness-110 cursor-pointer"
            >
              Start test
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
