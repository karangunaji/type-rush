"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthModal from "@/components/AuthModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

    useEffect(() => {
      const storedTheme = window.localStorage.getItem("typeRushTheme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
        return;
      }

      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      setTheme(prefersLight ? "light" : "dark");
    }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("typeRushTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  // Auth state
  const [authOpen, setAuthOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (data?.user) {
        // prefer metadata.username if available
        setUsername((data.user.user_metadata as any)?.username ?? (data.user.email ?? null));
      }
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (session?.user) {
        setUsername((session.user.user_metadata as any)?.username ?? session.user.email ?? null);
      } else {
        setUsername(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsername(null);
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">{username}</span>
              <button onClick={handleLogout} className="rounded-3xl border border-surface-strong bg-surface-alt px-3 py-2 text-sm text-foreground hover:bg-surface cursor-pointer">Logout</button>
            </div>
          ) : (
            <>
              <button onClick={() => setAuthOpen(true)} className="rounded-3xl border border-surface-strong bg-surface-alt px-3 py-2 text-sm text-foreground hover:bg-surface cursor-pointer" type="button">
                Login / Sign up
              </button>
            </>
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
                <div className="px-2 text-sm text-foreground">{username}</div>
                <button onClick={handleLogout} className="w-full rounded-lg border border-surface-strong bg-surface-alt px-3 py-2 text-left text-sm text-foreground hover:bg-surface cursor-pointer" type="button">Logout</button>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => setAuthOpen(true)} className="w-full rounded-lg border border-surface-strong bg-surface-alt px-3 py-2 text-left text-sm text-foreground hover:bg-surface cursor-pointer" type="button">Login / Sign up</button>
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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

