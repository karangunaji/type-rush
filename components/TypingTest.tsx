"use client";

import { useEffect, useMemo, useState } from "react";
import { generateText } from "@/data/words";
import { calculateAccuracy, calculateWPM } from "@/utils/calculations";
import Stats from "./Stats";

const TEST_DURATION = 60;

function countMistakes(original: string, typed: string) {
  let mistakes = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== original[i]) mistakes += 1;
  }
  return mistakes;
}

type Level = "low" | "medium" | "hard";

export default function TypingTest({ level = "medium" }: { level?: Level }) {
  const wordCountMap: Record<Level, number> = { low: 20, medium: 40, hard: 60 };
  const initialText = useMemo(() => generateText(wordCountMap[level]), [level]);
  const [text, setText] = useState(initialText);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    // If user types the full text before the timer ends, stop the test
    if (started && input.length >= text.length) {
      setStarted(false);
    }
  }, [input, text, started]);

  useEffect(() => {
    if (timeLeft <= 0 || input.length >= text.length) {
      setShowResults(true);
    }
  }, [timeLeft, input.length, text.length]);

  const handleChange = (value: string) => {
    if (!started) setStarted(true);
    if (timeLeft <= 0) return;
    setInput(value);
  };

  const resetTest = () => {
    const nextText = generateText(wordCountMap[level]);
    setText(nextText);
    setInput("");
    setTimeLeft(TEST_DURATION);
    setStarted(false);
  };

  const secondsElapsed = TEST_DURATION - timeLeft;
  const wpm = calculateWPM(input.length, secondsElapsed);
  const accuracy = calculateAccuracy(text, input);
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const mistakes = countMistakes(text, input);
  const progress = Math.min(100, Math.max(0, Math.floor((input.length / text.length) * 100)));

  return (
    <section className="rounded-[2rem] border border-slate-800/80 bg-slate-900/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] sm:p-8">
      <Stats
        wpm={wpm}
        accuracy={accuracy}
        timeLeft={timeLeft}
        words={words}
        mistakes={mistakes}
      />

      <div className="grid gap-6">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6 shadow-inner shadow-slate-950/20">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Typing prompt</p>
              <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                Follow the text below and type as accurately as possible.
              </p>
            </div>
            <div className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-200 ring-1 ring-slate-700/90">
              {progress}% complete
            </div>
          </div>

          <div className="min-h-[180px] overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5 text-left text-lg leading-8 text-slate-100 shadow-inner shadow-slate-950/30 sm:min-h-[220px]">
            {text.split("").map((char, index) => {
              const isTyped = index < input.length;
              const isCorrect = isTyped && input[index] === char;
              const classes = [
                "inline-flex rounded-sm px-0.5",
                isTyped
                  ? isCorrect
                    ? "text-emerald-300 bg-emerald-500/10"
                    : "text-rose-300 bg-rose-500/10"
                  : "text-slate-500",
              ].join(" ");

              return (
                <span key={index} className={classes}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <textarea
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            disabled={timeLeft <= 0 || input.length >= text.length}
            placeholder="Start typing here..."
            className="h-44 w-full resize-none rounded-3xl border border-slate-700/90 bg-slate-950/90 p-5 text-lg text-slate-100 outline-none transition focus:border-sky-500/90 focus:ring-2 focus:ring-sky-500/20 sm:h-64"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              {started ? "Keep going until the timer ends." : "Type any key to start the test."}
            </p>
            <button
              type="button"
              onClick={resetTest}
              className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 cursor-pointer"
            >
              {timeLeft <= 0 ? "Restart test" : "Reset test"}
            </button>
          </div>
        </div>
      </div>

      {showResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-xl rounded-[2rem] border border-slate-700/80 bg-slate-900/96 p-8 shadow-2xl shadow-slate-950/30">
            <div className="mb-6 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">
                {input.length >= text.length && timeLeft > 0 ? "Finished Early" : "Test Complete"}
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-50">{input.length >= text.length && timeLeft > 0 ? "Congratulations!" : "Session Results"}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Review your final typing performance and restart when you’re ready.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/90 p-5 text-center border border-slate-700/80">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Time</p>
                <p className="mt-3 text-3xl font-semibold text-rose-400">{TEST_DURATION}s</p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-5 text-center border border-slate-700/80">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">WPM</p>
                <p className="mt-3 text-3xl font-semibold text-sky-400">{wpm}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-5 text-center border border-slate-700/80">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Accuracy</p>
                <p className="mt-3 text-3xl font-semibold text-emerald-400">{accuracy}%</p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-5 text-center border border-slate-700/80">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Words</p>
                <p className="mt-3 text-3xl font-semibold text-violet-400">{words}</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-700/80 bg-slate-950/90 p-5 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Mistakes</p>
              <p className="mt-3 text-3xl font-semibold text-rose-300">{mistakes}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={resetTest}
                className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                Restart test
              </button>
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="rounded-3xl border border-slate-700/80 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
