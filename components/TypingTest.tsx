"use client";

import { useEffect, useMemo, useState } from "react";
import { generateText } from "@/data/words";
import { createClient } from "@/utils/supabase/client";
import Stats from "./Stats";

const TEST_DURATION = 60;
const VISIBLE_WORD_COUNT = 60;

type Level = "low" | "medium" | "hard" | "bhc" | "bhcPa" | "ahcRoAro" | "ahcEnglish";

const wordCountMap: Record<Level, number> = {
  low: 20,
  medium: 40,
  hard: 60,
  bhc: 80,
  bhcPa: 510,
  ahcRoAro: 500,
  ahcEnglish: 300,
};

function countMistakes(original: string, typed: string) {
  let mistakes = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== original[i]) mistakes += 1;
  }
  return mistakes;
}

function calculateBhcMarks(mistakes: number) {
  const deducted = Number((mistakes * 0.25).toFixed(2));
  return {
    marksDeducted: Math.min(20, deducted),
    finalMarks: Math.max(0, Number((20 - deducted).toFixed(2))),
  };
}

export default function TypingTest({ level = "medium", wordCount, durationMinutes, passage }: { level?: Level; wordCount?: number; durationMinutes?: number; passage?: string }) {
  const count = wordCount ?? wordCountMap[level];
  const durationSeconds = durationMinutes ? durationMinutes * 60 : TEST_DURATION;
  const text = useMemo(() => (passage?.trim() ? passage : generateText(count)), [passage, count]);
  const [input, setInput] = useState("");
  // Use a single input buffer for editor-like behavior
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const passageWords = text.trim().split(/\s+/).filter(Boolean);
  const totalPassageWords = passageWords.length;
  const requiredWords = totalPassageWords;
  const originalWords = passageWords.slice(0, requiredWords);
  // Use the full textarea input as the typed text (editor-like)
  const fullTypedText = input;
  const totalCharsTyped = fullTypedText.length;
  const progress = Math.min(100, Math.max(0, Math.floor((totalCharsTyped / text.length) * 100)));
  const typedWords = fullTypedText.trim().split(/\s+/).filter(Boolean);
  const wordsTyped = typedWords.length;
  const attemptedWords = Math.min(wordsTyped, requiredWords);
  const correctWords = attemptedWords === 0
    ? 0
    : typedWords.slice(0, requiredWords).reduce((count, word, index) => (word === originalWords[index] ? count + 1 : count), 0);
  const misspelling = Math.max(0, attemptedWords - correctWords);
  const notAttempted = Math.max(0, requiredWords - wordsTyped);
  const wrongWords = Math.max(0, wordsTyped - correctWords);
  const mistakes = countMistakes(text, fullTypedText);
  const totalKeystrokes = fullTypedText.length;
  const secondsElapsed = durationSeconds - timeLeft;
  const timeInMinutes = Math.max(1 / 60, secondsElapsed / 60);
  const grossSpeed = Math.round((wordsTyped / timeInMinutes) * 100) / 100;
  const wpm = grossSpeed;
  const netSpeed = Math.max(0, Math.round((grossSpeed - wrongWords / timeInMinutes) * 100) / 100);
  const accuracy = wordsTyped > 0 ? Math.round((correctWords / wordsTyped) * 100) : 0;
  const { marksDeducted, finalMarks } = calculateBhcMarks(mistakes);
  const qualifyingMarks = 10;
  const finalStatus = finalMarks >= qualifyingMarks ? "PASS" : "FAIL";
  const typingTime = secondsElapsed;
  const passageWordCount = totalPassageWords;
  const difficulty = level;
  const examName = level === "bhc" ? "BHC Clerk Typing Exam" : level === "bhcPa" ? "BHC PA Typing Exam" : level === "ahcRoAro" ? "AHC RO/ARO English Typing Exam" : level === "ahcEnglish" ? "AHC English Typing Exam" : "Typing Exam";

  const handleShare = async () => {
    const shareText = `Exam: ${examName}\nWords Typed: ${wordsTyped}\nCorrect Words: ${correctWords}\nGross Speed: ${wpm} WPM\nNet Speed: ${netSpeed} WPM\nAccuracy: ${accuracy}%\nMarks Deducted: ${marksDeducted.toFixed(2)}\nFinal Marks: ${finalMarks.toFixed(2)}/20\nStatus: ${finalStatus}`;

    if (navigator.share) {
      await navigator.share({ title: "Typing Exam Results", text: shareText });
      return;
    }

    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  // No segmentation: editor holds entire typed content in `input`.

  const isTestComplete = timeLeft <= 0 || input.length >= text.length;

  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (!isTestComplete) return;

    const timeout = window.setTimeout(() => setShowResults(true), 0);
    return () => window.clearTimeout(timeout);
  }, [isTestComplete]);

  useEffect(() => {
    if (!showResults || historySaved) return;

    const saveHistory = async () => {
      try {
        const supabase = createClient();
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        if (!session?.user) {
          setSaveError("Please sign in to save your exam history.");
          return;
        }

        const profileMeta = session.user.user_metadata as Record<string, unknown> | undefined;
        const historyUsername = profileMeta && typeof profileMeta.username === "string" ? profileMeta.username : "User";

        const { error } = await supabase.from("exam_history").insert([{
          user_id: session.user.id,
          username: historyUsername,
          exam_name: examName,
          difficulty,
          words_typed: wordsTyped,
          correct_words: correctWords,
          accuracy,
          gross_speed: grossSpeed,
          net_speed: netSpeed,
          final_marks: finalMarks,
          status: finalStatus,
        }]);

        if (error) {
          setSaveError(error.message);
          return;
        }

        setHistorySaved(true);
      } catch (error: unknown) {
        if (error instanceof Error) setSaveError(error.message);
        else setSaveError(String(error));
      }
    };

    saveHistory();
  }, [showResults, historySaved, examName, wordsTyped, correctWords, accuracy, grossSpeed, netSpeed, finalMarks, finalStatus, difficulty]);

  const handleChange = (value: string) => {
    if (timeLeft <= 0) return;
    if (!started) setStarted(true);
    // allow normal editing, but limit input to source length
    setInput(value.slice(0, text.length));
  };

  const resetTest = () => {
    setInput("");
    // segmentation removed; simply clear input
    setTimeLeft(durationSeconds);
    setStarted(false);
    setShowResults(false);
    setHistorySaved(false);
    setSaveError(null);
  };

  const typedWordCount = typedWords.length;

  return (
    <section className="rounded-4xl border border-surface-strong bg-surface-strong p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] sm:p-8">
      <Stats
        wpm={wpm}
        accuracy={accuracy}
        timeLeft={timeLeft}
        words={passageWordCount}
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

          <div className="h-90 max-h-90 min-h-80 overflow-y-auto rounded-3xl border border-surface bg-surface-alt p-5 text-left text-lg leading-8 text-foreground shadow-inner shadow-slate-950/30 scrollbar-custom sm:h-95">
            <p className="whitespace-pre-wrap wrap-break-word text-foreground">{text}</p>
          </div>
        </div>

        <div className="space-y-6">
          <textarea
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            // Allow normal editing behaviour: cursor movement, selection, backspace/delete, clipboard
            disabled={timeLeft <= 0}
            placeholder="Start typing here..."
            autoFocus
            onFocus={(e) => e.currentTarget.focus()}
            onWheel={(e) => {
              // prevent page scroll when scrolling inside the textarea
              const el = e.currentTarget;
              const atTop = el.scrollTop === 0;
              const atBottom = el.scrollHeight - el.clientHeight === el.scrollTop;
              if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="h-60 w-full overflow-y-auto rounded-3xl border border-surface-strong bg-surface p-5 text-lg text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-[rgba(56,189,248,0.2)] scrollbar-custom"
            spellCheck={false}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-overlay backdrop-blur-sm" />
          <div className="relative w-full max-w-[min(1200px,calc(100vw-2rem))] rounded-4xl border border-surface-strong/80 bg-surface-strong/95 p-5 shadow-[0_30px_100px_-50px_rgba(0,0,0,0.85)] backdrop-blur-xl exam-summary-modal">
            <div className="mb-4 border-b border-surface-strong/70 pb-4">
              <div className="flex flex-col items-center justify-center gap-2 text-center sm:items-start sm:text-left">
                <p className="text-[11px] uppercase tracking-[0.35em] text-sky-300/75">{examName}</p>
                <h2 className="text-3xl font-semibold text-foreground">Exam Summary</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted max-w-2xl mx-auto sm:mx-0">
                Review your performance in a compact, modern exam result dialog.
              </p>
            </div>

            <div className="exam-summary-content grid gap-4 sm:grid-cols-2">
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Passage length required</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">400</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Source words available</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{passageWordCount}</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Words typed</p>
                <p className="mt-3 text-3xl font-semibold text-warning">{wordsTyped}</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Correct words</p>
                <p className="mt-3 text-3xl font-semibold text-success">{correctWords}</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Time taken</p>
                <p className="mt-3 text-3xl font-semibold text-danger">{Math.floor(typingTime / 60)}:{String(typingTime % 60).padStart(2, "0")}</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Total mistakes</p>
                <p className="mt-3 text-3xl font-semibold text-danger">{mistakes}</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Gross speed</p>
                <p className="mt-3 text-3xl font-semibold text-accent">{wpm} WPM</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Net speed</p>
                <p className="mt-3 text-3xl font-semibold text-accent">{netSpeed} WPM</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Total keystrokes</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{totalKeystrokes}</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Accuracy</p>
                <p className="mt-3 text-3xl font-semibold text-success">{accuracy}%</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Marks deducted</p>
                <p className="mt-3 text-3xl font-semibold text-danger">-{marksDeducted.toFixed(2)}</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Final marks</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{finalMarks.toFixed(2)}/20</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Qualifying marks</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{qualifyingMarks}</p>
              </div>
              <div className="flex min-h-30 flex-col justify-between rounded-3xl border border-surface-strong/70 bg-surface p-4 text-center shadow-sm shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Final status</p>
                <p className={`mt-3 text-3xl font-semibold ${finalStatus === "PASS" ? "text-emerald-400" : "text-rose-400"}`}>{finalStatus}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={resetTest}
                className="rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(56,189,248,0.35)] cursor-pointer"
              >
                Restart test
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-3xl border border-surface-strong bg-surface-alt px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface cursor-pointer"
              >
                Share result
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

