"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("typeRushTheme");
    if (stored === "light" || stored === "dark") return stored as "light" | "dark";
    const prefersLight = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("typeRushTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const [username, setUsername] = useState<string | null>(null);

  async function resolveUsername(user: Session | null) {
    if (!user?.user) return null;
    const meta = user.user.user_metadata as Record<string, unknown> | undefined;
    if (meta?.username && typeof meta.username === "string") return meta.username;

    try {
      const supabase = createClient();
      const profile = await supabase.from("profiles").select("username").eq("id", user.user.id).single();
      if (profile.data?.username && typeof profile.data.username === "string") return profile.data.username;
    } catch {
      // ignore database lookup failures and fallback to generic label.
    }

    return null;
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;

        const name = await resolveUsername(data as Session | null);
        setUsername(name ?? "User");
      } catch {
        return;
      }
    }
    load();

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const supabase = createClient();
      const res = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
        if (session?.user) {
          resolveUsername(session).then((name) => {
            if (mounted) setUsername(name ?? "User");
          });
        } else {
          setUsername(null);
        }
      });
      if (res && res.data && typeof (res.data as { subscription?: unknown }).subscription === "object") {
        subscription = (res.data as { subscription: { unsubscribe: () => void } }).subscription;
      }
    } catch {
      subscription = null;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore if supabase not configured
    }
    setUsername(null);
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="w-full border-b border-surface bg-surface-strong">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold tracking-tight text-foreground">Typerush</span>
          <span className="hidden sm:inline text-sm text-muted">/ branch</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-3xl bg-accent px-3 py-2 text-sm font-medium text-foreground hover:brightness-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current text-foreground">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.3 8.2l-1.9 9.3c-.1.4-.5.7-.9.6-.2 0-.4-.1-.5-.2l-3-2.3-1.5 1.5c-.2.2-.4.3-.7.3-.2 0-.4-.1-.6-.2-.3-.2-.5-.5-.4-.9l.9-4.1L6.2 12c-.4-.3-.1-.8.4-.9l11-4.2c.4-.1.8.1.9.5.1.4.1.9-.5 1.1z" />
            </svg>
            Join Telegram
          </a>

          {username ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-3xl border border-surface-strong bg-surface-alt px-3 py-2 text-sm text-foreground hover:bg-surface cursor-pointer"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                  </svg>
                </span>
                <span className="text-sm text-foreground">{username}</span>
                <span aria-hidden="true">▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 w-44 rounded-3xl border border-surface-strong bg-surface-strong shadow-xl">
                  <Link href="/history" className="block rounded-3xl px-4 py-3 text-sm text-foreground hover:bg-surface cursor-pointer">
                    History
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-b-3xl px-4 py-3 text-left text-sm text-foreground hover:bg-surface cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-3xl border border-surface-strong bg-surface-alt px-3 py-2 text-sm text-foreground hover:bg-surface cursor-pointer"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-3xl bg-accent px-3 py-2 text-sm font-semibold text-foreground hover:brightness-110"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-3xl border border-surface-strong bg-surface-alt px-3 py-2 text-sm text-foreground hover:bg-surface cursor-pointer"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
            <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
        </div>

        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-surface cursor-pointer"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-surface bg-surface-strong">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-10 space-y-2">
            <a
              href="#"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current text-foreground">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.3 8.2l-1.9 9.3c-.1.4-.5.7-.9.6-.2 0-.4-.1-.5-.2l-3-2.3-1.5 1.5c-.2.2-.4.3-.7.3-.2 0-.4-.1-.6-.2-.3-.2-.5-.5-.4-.9l.9-4.1L6.2 12c-.4-.3-.1-.8.4-.9l11-4.2c.4-.1.8.1.9.5.1.4.1.9-.5 1.1z" />
              </svg>
              Join Telegram
            </a>

            {username ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-3xl border border-surface-strong bg-surface-alt px-3 py-2 text-sm text-foreground">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </span>
                  <span>{username}</span>
                </div>
                <Link href="/history" className="block rounded-lg border border-surface-strong bg-surface-alt px-3 py-2 text-left text-sm text-foreground hover:bg-surface cursor-pointer">
                  History
                </Link>
                <button onClick={handleLogout} className="w-full rounded-lg border border-surface-strong bg-surface-alt px-3 py-2 text-left text-sm text-foreground hover:bg-surface cursor-pointer" type="button">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/login" className="block rounded-lg border border-surface-strong bg-surface-alt px-3 py-2 text-left text-sm text-foreground hover:bg-surface cursor-pointer">
                  Login
                </Link>
                <Link href="/signup" className="block rounded-lg bg-accent px-3 py-2 text-left text-sm font-semibold text-foreground hover:brightness-110">
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full rounded-lg border border-surface-strong bg-surface-alt px-3 py-2 text-left text-sm text-foreground hover:bg-surface cursor-pointer"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      )}
      </nav>
    </>
  );
}

