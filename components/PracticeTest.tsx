import React, { useState } from "react";

type PassageOption = "Clerk Passage 1 - Legal Administration" | "Clerk Passage 2 - Public Service";
type DurationOption = 10 | 15;

export default function PracticeTest({
  onBeginPractice,
  onBack,
}: {
  onBeginPractice: (passage: PassageOption, duration: DurationOption) => void;
  onBack: () => void;
}) {
  const [passage, setPassage] = useState<PassageOption>("Clerk Passage 1 - Legal Administration");
  const [duration, setDuration] = useState<DurationOption>(10);

  return (
    <section className="rounded-4xl border border-surface-strong bg-surface-strong p-8 shadow-2xl shadow-slate-950/30">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">BHC Clerk Typing Test</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Practice Test
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Choose your passage and timer before starting the warm-up. These settings help you prepare for the BHC Clerk test with a realistic practice experience.
          </p>
        </div>

        <div className="rounded-3xl border border-surface-strong bg-surface p-6 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Practice settings</p>

          <div className="mt-6 space-y-5 text-left">
            <label className="block text-sm font-semibold text-muted">
              Select passage
              <select
                value={passage}
                onChange={(event) => setPassage(event.target.value as PassageOption)}
                className="mt-3 w-full rounded-3xl border border-surface-strong bg-surface-strong px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-[rgba(56,189,248,0.2)]"
              >
                <option value="Clerk Passage 1 - Legal Administration">Clerk Passage 1 - Legal Administration</option>
                <option value="Clerk Passage 2 - Public Service">Clerk Passage 2 - Public Service</option>
              </select>
            </label>

            <label className="block text-sm font-semibold text-muted">
              Select timer
              <select
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value) as DurationOption)}
                className="mt-3 w-full rounded-3xl border border-surface-strong bg-surface-strong px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-[rgba(56,189,248,0.2)]"
              >
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </label>
          </div>

          <div className="mt-8 rounded-3xl bg-surface p-5 text-left text-sm text-muted ring-1 ring-surface">
            <p className="font-semibold text-foreground">Current selection</p>
            <p className="mt-3">{passage}</p>
            <p className="mt-1">Timer: {duration} minutes</p>
          </div>

          <button
            type="button"
            onClick={() => onBeginPractice(passage, duration)}
            className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-accent px-6 py-3 text-sm font-semibold text-foreground transition hover:brightness-110 cursor-pointer"
          >
            Start practice now
          </button>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 inline-flex w-full items-center justify-center rounded-3xl border border-surface-strong bg-surface-alt px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface cursor-pointer"
          >
            Back to level select
          </button>
        </div>
      </div>
    </section>
  );
}
