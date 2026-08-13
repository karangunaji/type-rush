"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TypingTest from "@/components/TypingTest";
import PracticeTest from "@/components/PracticeTest";
import Hero from "@/components/Hero";

type Level = "low" | "medium" | "hard" | "bhc" | "bhcPa" | "ahcRoAro" | "ahcEnglish";

type Flow = "hero" | "typing" | "practice";

type PracticeSettings = {
  passage: string;
  duration: number;
};

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"exams" | "demo">("exams");
  const [flow, setFlow] = useState<Flow>("hero");
  const [level, setLevel] = useState<Level>("medium");
  const [showBhcOptions, setShowBhcOptions] = useState(false);
  const [practiceSettings, setPracticeSettings] =
    useState<PracticeSettings | null>(null);

  const handleStart = (lvl: Level) => {
    setLevel(lvl);
    if (lvl === "bhc" || lvl === "bhcPa" || lvl === "ahcRoAro" || lvl === "ahcEnglish") {
      setShowBhcOptions(true);
      return;
    }

    setFlow("typing");
  };

  const handleStartPractice = (passage: string, duration: number) => {
    setPracticeSettings({ passage, duration });
    setShowBhcOptions(false);
    setFlow("typing");
  };


  const handleStartCustom = () => {
    router.push("/custom-test");
  };

  const handleBackToSelect = () => {
    setFlow("hero");
    setLevel("medium");
    setShowBhcOptions(false);
    setPracticeSettings(null);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        {flow === "hero" && (
          <Hero onStart={handleStart} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {showBhcOptions && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-overlay px-4 py-8">
            <div className="w-full max-w-xl rounded-4xl border border-surface-strong bg-surface-strong p-8 shadow-2xl shadow-slate-950/30">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">
                  BHC Typing Tests
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-foreground">
                  Choose your path
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Select Practice Test to warm up or Custom Test to jump into
                  the full challenge.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    if (level === "bhcPa") router.push("/BHC-pa-practice-test");
                    else if (level === "ahcRoAro") router.push("/AHC-ro-aro-practice-test");
                    else if (level === "ahcEnglish") router.push("/AHC-english-practice-test");
                    else router.push("/BHC-clerk-practice-test");
                  }}
                  className="rounded-3xl bg-accent px-6 py-4 text-sm font-semibold text-foreground transition hover:brightness-110 cursor-pointer"
                >
                  Practice Test
                </button>
                <button
                  type="button"
                  onClick={handleStartCustom}
                  className="rounded-3xl border border-surface bg-surface-alt px-6 py-4 text-sm font-semibold text-foreground transition hover:bg-surface-strong cursor-pointer"
                >
                  Custom Test
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleBackToSelect}
                  className="rounded-3xl px-6 py-3 text-sm font-semibold text-muted transition hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {flow !== "hero" && !showBhcOptions && (
          <div className="relative">
            <div className="mb-4">
              <button
                onClick={handleBackToSelect}
                className="inline-flex items-center gap-2 rounded-3xl border border-surface bg-surface-alt px-3 py-2 text-sm text-foreground hover:bg-surface cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-foreground"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H16a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>
            </div>

            {flow === "practice" ? (
              <PracticeTest
                onBeginPractice={handleStartPractice}
                onBack={handleBackToSelect}
              />
            ) : (
              <TypingTest
                level={level}
                wordCount={practiceSettings ? 400 : undefined}
                durationMinutes={practiceSettings?.duration}
                onBack={handleBackToSelect}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
