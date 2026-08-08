"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type ExamHistoryEntry = {
  id: string;
  username?: string | null;
  exam_name: string;
  difficulty: string;
  words_typed: number;
  correct_words: number;
  accuracy: number;
  gross_speed: number;
  net_speed: number;
  final_marks: number;
  status: string;
  created_at: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ExamHistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!mounted) return;

      if (!session?.user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const meta = session.user.user_metadata as Record<string, unknown> | undefined;
      const name = meta && typeof meta.username === "string" ? meta.username : session.user.email ?? null;
      setUsername(name);

      const response = await supabase
        .from("exam_history")
        .select("id, username, exam_name, difficulty, words_typed, correct_words, accuracy, gross_speed, net_speed, final_marks, status, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      const data = response.data as ExamHistoryEntry[] | null;
      const error = response.error;

      if (!mounted) return;
      if (error) {
        console.error("Failed to fetch exam history", error.message);
        setHistory([]);
      } else {
        setHistory(data ?? []);
      }
      setLoading(false);
    }

    loadHistory();
    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => {
    if (!history || history.length === 0) {
      return { count: 0, averageAccuracy: 0, bestScore: 0, latest: null };
    }

    const count = history.length;
    const averageAccuracy = Math.round((history.reduce((sum, item) => sum + Number(item.accuracy), 0) / count) * 100) / 100;
    const bestScore = Math.max(...history.map((item) => Number(item.final_marks)));
    const latest = history[0];
    return { count, averageAccuracy, bestScore, latest };
  }, [history]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-4xl border border-surface-strong bg-surface-strong p-8 text-center text-foreground">Loading exam history...</div>
      </main>
    );
  }

  if (!history) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl rounded-4xl border border-surface-strong bg-surface-strong p-8 text-center text-foreground">
          <p className="text-lg font-semibold">Unable to load exam history.</p>
          <p className="mt-2 text-sm text-muted">Please sign in to access your exam performance and results.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-foreground hover:brightness-110">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-4xl border border-surface-strong bg-surface-strong p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Exam history</p>
              <h1 className="mt-3 text-3xl font-semibold text-foreground">{username ? `${username}'s history` : "Your exam history"}</h1>
            </div>
            <Link href="/" className="inline-flex items-center justify-center rounded-3xl border border-surface-strong bg-surface-alt px-4 py-3 text-sm font-semibold text-foreground hover:bg-surface cursor-pointer">
              Back to home
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="mt-10 rounded-4xl border border-dashed border-surface p-8 text-center">
              <p className="text-xl font-semibold text-foreground">No exam history found.</p>
              <p className="mt-3 text-sm text-muted">Complete your first typing exam to create history.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-4xl bg-surface p-6 shadow-inner shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Total exams attended</p>
                <p className="mt-4 text-4xl font-semibold text-foreground">{totals.count}</p>
              </div>
              <div className="rounded-4xl bg-surface p-6 shadow-inner shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Average accuracy</p>
                <p className="mt-4 text-4xl font-semibold text-foreground">{totals.averageAccuracy}%</p>
              </div>
              <div className="lg:col-span-2 rounded-4xl bg-surface p-6 shadow-inner shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Best score</p>
                <p className="mt-4 text-4xl font-semibold text-foreground">{totals.bestScore}/20</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted">Latest exam</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{totals.latest?.exam_name}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted">Latest result</p>
                    <p className="mt-2 rounded-3xl bg-surface-alt px-3 py-2 text-sm font-semibold text-foreground">{totals.latest?.status}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="overflow-x-auto rounded-4xl border border-surface-strong bg-surface-strong p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
            <table className="min-w-full text-left text-sm text-foreground">
              <thead>
                <tr className="border-b border-surface">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Exam</th>
                  <th className="px-4 py-3">Words</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Net</th>
                  <th className="px-4 py-3">Marks</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-b border-surface-strong/50">
                    <td className="px-4 py-4 text-muted">{entry.created_at.slice(0, 16).replace("T", " ")}</td>
                    <td className="px-4 py-4">{entry.exam_name}</td>
                    <td className="px-4 py-4">{entry.words_typed}</td>
                    <td className="px-4 py-4">{entry.accuracy}%</td>
                    <td className="px-4 py-4">{entry.gross_speed} WPM</td>
                    <td className="px-4 py-4">{entry.net_speed} WPM</td>
                    <td className="px-4 py-4">{entry.final_marks}/20</td>
                    <td className={`px-4 py-4 font-semibold ${entry.status === "PASS" ? "text-emerald-400" : "text-rose-400"}`}>{entry.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
