import React from "react";

type Level = "low" | "medium" | "hard";

export default function Hero({ onStart, selected }: { onStart: (level: Level) => void; selected?: Level }) {
  const levels: { key: Level; title: string; desc: string }[] = [
    { key: "low", title: "Low", desc: "Shorter prompts, easier pace." },
    { key: "medium", title: "Medium", desc: "Balanced challenge for practice." },
    { key: "hard", title: "Hard", desc: "Longer prompts, faster pace." },
  ];

  return (
    <section>
      <header className="rounded-[2rem] border border-slate-700/80 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30">
        <div className="grid gap-8 lg:grid-cols-1 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Typing trainer</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">TypeRush</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Train typing speed and accuracy with a modern, responsive challenge. Choose a difficulty and start a timed session.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 flex w-full items-stretch gap-4 overflow-x-auto pb-2">
        {levels.map((lvl) => (
          <div
            key={lvl.key}
            className={`min-w-[220px] flex-shrink-0 rounded-2xl p-5 text-center border ${
              selected === lvl.key ? "border-sky-400 bg-slate-800/80" : "border-slate-700/60 bg-slate-950/90"
            }`}
          >
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{lvl.title}</p>
            <p className="mt-2 text-sm text-slate-300">{lvl.desc}</p>
            <button
              onClick={() => onStart(lvl.key)}
              className="mt-4 inline-flex items-center justify-center rounded-3xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 cursor-pointer"
            >
              Start test
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
