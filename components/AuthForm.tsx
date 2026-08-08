"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
}

export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        if (!username.trim()) throw new Error("Username is required for signup.");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username.trim() },
          },
        });
        if (error) throw error;
        setMessage("Signup successful. You may be redirected shortly.");
        onSuccess?.();
        router.push("/");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMessage("Signed in successfully.");
      onSuccess?.();
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-3xl border border-surface-strong bg-surface-strong p-8 shadow-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{mode === "signup" ? "Create an account" : "Sign in to your account"}</h1>
        <p className="mt-2 text-sm text-muted">
          {mode === "signup"
            ? "Create a new account with your username, email and password."
            : "Use your email and password to sign in."
          }
        </p>
      </div>

      {mode === "signup" && (
        <label className="block text-sm text-foreground">
          Username
          <input
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Choose a username"
            className="mt-2 w-full rounded-3xl border border-surface-strong bg-surface px-4 py-3 text-sm text-foreground outline-none"
          />
        </label>
      )}

      <label className="block text-sm text-foreground">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-3xl border border-surface-strong bg-surface px-4 py-3 text-sm text-foreground outline-none"
        />
      </label>

      <label className="block text-sm text-foreground">
        Password
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="mt-2 w-full rounded-3xl border border-surface-strong bg-surface px-4 py-3 text-sm text-foreground outline-none"
        />
      </label>

      {message && <p className="text-sm text-danger">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (mode === "signup" ? "Signing up..." : "Signing in...") : (mode === "signup" ? "Sign up" : "Sign in")}
      </button>
    </form>
  );
}
