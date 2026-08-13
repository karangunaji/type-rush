'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import PracticeTest from "@/components/PracticeTest";
import TypingTest from "@/components/TypingTest";

type PracticeSettings = {
  passage: string;
  duration: number;
  allowBackspace: boolean;
};

export default function AhcRoAroPracticeTestPage() {
  const router = useRouter();
  const [practiceSettings, setPracticeSettings] = useState<PracticeSettings | null>(null);

  const handleBeginPractice = (passage: string, duration: number, allowBackspace: boolean) => {
    setPracticeSettings({ passage, duration, allowBackspace });
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {practiceSettings ? (
          <TypingTest level="ahcRoAro" durationMinutes={practiceSettings.duration} allowBackspace={practiceSettings.allowBackspace} onBack={() => setPracticeSettings(null)} />
        ) : (
          <PracticeTest onBeginPractice={handleBeginPractice} onBack={handleBack} defaultExam="ahcRoAro" />
        )}
      </div>
    </main>
  );
}
