"use client";

import { useEffect, useMemo, useState } from "react";
import { generateText } from "@/data/words";
import { calculateAccuracy, calculateWPM } from "@/utils/calculations";
import Stats from "./Stats";

const TEST_DURATION = 60;
const VISIBLE_WORD_COUNT = 60;

const wordCountMap: Record<Level, number> = { low: 20, medium: 40, hard: 60, bhc: 80 };

function countMistakes(original: string, typed: string) {
  let mistakes = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== original[i]) mistakes += 1;
  }
  return mistakes;
}

type Level = "low" | "medium" | "hard" | "bhc";

export default function TypingTest({ level = "medium", wordCount, durationMinutes }: { level?: Level; wordCount?: number; durationMinutes?: number }) {
  const count = wordCount ?? wordCountMap[level];
  const durationSeconds = durationMinutes ? durationMinutes * 60 : TEST_DURATION;
  const initialText = useMemo(() => generateText(count), [count]);
  const [text, setText] = useState(initialText);
  const [input, setInput] = useState("");
  const [segmentStartWord, setSegmentStartWord] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const words = text.split(" ");
  const segmentWords = words.slice(segmentStartWord, segmentStartWord + VISIBLE_WORD_COUNT);
  const segmentText = segmentWords.join(" ");
  const segmentLength = segmentText.length;
  const completedChars = words.slice(0, segmentStartWord).join(" ").length;
  const totalCharsTyped = completedChars + input.length;
  const progress = Math.min(100, Math.max(0, Math.floor((totalCharsTyped / text.length) * 100)));

  const advanceSegment = () => {
    const nextStart = segmentStartWord + VISIBLE_WORD_COUNT;
    if (nextStart >= words.length) {
      setStarted(false);
      setShowResults(true);
      return;
    }

    setSegmentStartWord(nextStart);
    setInput("");
  };

  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setShowResults(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      const timeout = window.setTimeout(() => setShowResults(true), 0);
      return () => window.clearTimeout(timeout);
    }
  }, [timeLeft]);

  const handleChange = (value: string) => {
    if (timeLeft <= 0) return;
    if (value.length < input.length) return;

    const nextValue = value.slice(0, segmentLength);
    if (!started) setStarted(true);
    if (nextValue.length >= segmentLength) {
      setInput(nextValue);
      advanceSegment();
      return;
    }

    setInput(nextValue);
  };

  const resetTest = () => {
    const nextText = generateText(count);
    setText(nextText);
    setInput("");
    setSegmentStartWord(0);
    setTimeLeft(durationSeconds);
    setStarted(false);
  };

  const secondsElapsed = durationSeconds - timeLeft;
  const wpm = calculateWPM(totalCharsTyped, secondsElapsed);
  const accuracy = calculateAccuracy(segmentText, input);
  const typedWordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const mistakes = countMistakes(segmentText, input);

  return (
    <section className="rounded-4xl border border-surface-strong bg-surface-strong p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] sm:p-8">
      <Stats
        wpm={wpm}
        accuracy={accuracy}
        timeLeft={timeLeft}
        words={typedWordCount}
        mistakes={mistakes}
      />

      <div className="grid gap-6">
        <div className="rounded-3xl border border-surface-strong bg-surface p-6 shadow-inner shadow-slate-950/20">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Typing prompt</p>
              <p className="mt-2 text-xs text-muted sm:text-sm">
                Follow the text below and type as accurately as possible.
              </p>
            </div>
            <div className="rounded-full bg-surface-alt px-4 py-2 text-sm text-foreground ring-1 ring-surface-strong">
              {progress}% complete
            </div>
          </div>

          <div className="min-h-45 overflow-hidden rounded-3xl border border-surface bg-surface-alt p-5 text-left text-lg leading-8 text-foreground shadow-inner shadow-slate-950/30 sm:min-h-55">
            {segmentText.split("").map((char, index) => {
              const isTyped = index < input.length;
              const isCorrect = isTyped && input[index] === char;
              const classes = [
                "inline-flex rounded-sm px-0.5",
                isTyped
                  ? isCorrect
                    ? "text-emerald-300 bg-emerald-500/10"
                    : "text-rose-300 bg-rose-500/10"
                  : "text-muted",
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
            onKeyDown={(e) => {
              if (e.key === "Backspace" || e.key === "Enter") {
                e.preventDefault();
              }
            }}
            disabled={timeLeft <= 0 || input.length >= text.length}
            placeholder="Start typing here..."
            className="h-44 w-full resize-none rounded-3xl border border-surface-strong bg-surface p-5 text-lg text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-[rgba(56,189,248,0.2)] sm:h-64"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {started ? "Keep going until the timer ends." : "Type any key to start the test."}
            </p>
            <button
              type="button"
              onClick={resetTest}
              className="inline-flex items-center justify-center rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(56,189,248,0.35)] cursor-pointer"
            >
              {timeLeft <= 0 ? "Restart test" : "Reset test"}
            </button>
          </div>
        </div>
      </div>

      {showResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-overlay backdrop-blur-sm" />
            <div className="relative w-full max-w-xl rounded-4xl border border-surface-strong bg-surface-strong p-8 shadow-2xl shadow-slate-950/30">
            <div className="mb-6 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">
                {input.length >= text.length && timeLeft > 0 ? "Finished Early" : "Test Complete"}
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-foreground">{input.length >= text.length && timeLeft > 0 ? "Congratulations!" : "Session Results"}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Review your final typing performance and restart when you’re ready.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-surface p-5 text-center border border-surface-strong">
                <p className="text-sm uppercase tracking-[0.2em] text-muted">Time</p>
                <p className="mt-3 text-3xl font-semibold text-danger">{durationSeconds}s</p>
              </div>
              <div className="rounded-3xl bg-surface p-5 text-center border border-surface-strong">
                <p className="text-sm uppercase tracking-[0.2em] text-muted">WPM</p>
                <p className="mt-3 text-3xl font-semibold text-accent">{wpm}</p>
              </div>
              <div className="rounded-3xl bg-surface p-5 text-center border border-surface-strong">
                <p className="text-sm uppercase tracking-[0.2em] text-muted">Accuracy</p>
                <p className="mt-3 text-3xl font-semibold text-success">{accuracy}%</p>
              </div>
              <div className="rounded-3xl bg-surface p-5 text-center border border-surface-strong">
                <p className="text-sm uppercase tracking-[0.2em] text-muted">Words</p>
                <p className="mt-3 text-3xl font-semibold text-warning">{words}</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-surface-strong bg-surface p-5 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-muted">Mistakes</p>
              <p className="mt-3 text-3xl font-semibold text-danger">{mistakes}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={resetTest}
                className="rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(56,189,248,0.35)] cursor-pointer"
              >
                Restart test
              </button>
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="rounded-3xl border border-surface-strong bg-surface-alt px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface cursor-pointer"
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
