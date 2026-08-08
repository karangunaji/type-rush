'use client';

import { useRouter } from "next/navigation";

export default function CustomTestPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl rounded-4xl border border-surface-strong bg-surface-strong p-10 shadow-2xl shadow-slate-950/20 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Custom Test</p>
        <h1 className="mt-6 text-4xl font-semibold text-foreground">We’re working on it</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Custom tests are not available yet. Please use Practice Test for now, and check back soon for the new exam experience.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-8 inline-flex items-center justify-center rounded-3xl bg-accent px-6 py-3 text-sm font-semibold text-foreground transition hover:brightness-110 cursor-pointer"
        >
          Return home
        </button>
      </div>
    </main>
  );
}
