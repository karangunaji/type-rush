"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // If the user provided a real email (contains @), use it directly.
      // Otherwise map username to a synthetic email so Supabase can manage auth, store username in user_metadata
      const email = username.includes("@") ? username : `${username}@typerush.local`;

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
        if (error) throw error;
        setMessage("Signup successful — you are signed in or will receive a confirmation (if enabled).");
        onClose();
        return;
      }

      // login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage("Signed in successfully");
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

        <div className="mt-4 space-y-3">
          <label className="block text-sm text-muted">Email or username</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl border border-surface-strong bg-surface px-3 py-2 text-foreground outline-none"
            placeholder="you@example.com or choose a username"
          />

          <label className="block text-sm text-muted">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-surface-strong bg-surface px-3 py-2 text-foreground outline-none"
            placeholder="password"
          />
        </div>

        {message && <p className="mt-4 text-sm text-muted">{message}</p>}

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" className="rounded-3xl bg-accent px-4 py-2 text-sm font-semibold text-foreground cursor-pointer">
            {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
          </button>
          <button type="button" onClick={onClose} className="rounded-3xl border border-surface-strong bg-surface-alt px-4 py-2 text-sm text-foreground cursor-pointer">
            Cancel
          </button>
        </div>

        <div className="mt-4 text-sm text-muted">
          <button
            type="button"
            onClick={() => setMode((m) => (m === "signup" ? "login" : "signup"))}
            className="underline cursor-pointer"
          >
            {mode === "signup" ? "Have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
