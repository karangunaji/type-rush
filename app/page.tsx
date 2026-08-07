'use client';
import { useState } from "react";
import TypingTest from "@/components/TypingTest";
import Hero from "@/components/Hero";

type Level = "low" | "medium" | "hard";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState<Level>("medium");

  const handleStart = (lvl: Level) => {
    setLevel(lvl);
    setStarted(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        {!started && <Hero onStart={handleStart} selected={level} />}

        {started && (
          <div className="relative">
            <div className="mb-4">
              <button
                onClick={() => setStarted(false)}
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-100" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H16a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
            </div>

            <TypingTest level={level} />
          </div>
        )}
      </div>
    </main>
  );
}