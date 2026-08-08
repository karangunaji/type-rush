"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const cleanedUsername = username.trim();
        if (!cleanedUsername) throw new Error("Username is required.");
        if (!email.trim()) throw new Error("Email is required.");

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { username: cleanedUsername },
          },
        });

        if (error) throw error;
        setMessage("Signup successful. You are signed in or will receive a confirmation email.");
        onClose();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setMessage("Signed in successfully.");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-overlay" />

      <form onSubmit={submit} className="relative w-full max-w-md rounded-3xl border border-surface-strong bg-surface-strong p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-foreground">{mode === "signup" ? "Sign up" : "Sign in"}</h3>

        <div className="mt-4 space-y-4">
          {mode === "signup" && (
            <label className="block text-sm text-foreground">
              Username
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-surface-strong bg-surface px-3 py-2 text-foreground outline-none"
                placeholder="Choose a username"
              />
            </label>
          )}

          <label className="block text-sm text-foreground">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-surface-strong bg-surface px-3 py-2 text-foreground outline-none"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm text-foreground">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-surface-strong bg-surface px-3 py-2 text-foreground outline-none"
              placeholder="Password"
            />
          </label>
        </div>

        {message && <p className="mt-4 text-sm text-muted">{message}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" disabled={loading} className="rounded-3xl bg-accent px-4 py-2 text-sm font-semibold text-foreground transition hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
          </button>
          <button type="button" onClick={onClose} className="rounded-3xl border border-surface-strong bg-surface-alt px-4 py-2 text-sm text-foreground hover:bg-surface cursor-pointer">
            Cancel
          </button>
        </div>

        <div className="mt-4 text-sm text-muted">
          <button
            type="button"
            onClick={() => setMode((m) => (m === "signup" ? "login" : "signup"))}
            className="underline"
          >
            {mode === "signup" ? "Have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
