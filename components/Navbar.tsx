"use client";

import React, { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b border-slate-800/60 bg-slate-900/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold tracking-tight text-slate-50">Typerush</span>
          <span className="hidden sm:inline text-sm text-slate-400">/ branch</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-3xl bg-sky-600/90 px-3 py-2 text-sm font-medium text-slate-50 hover:bg-sky-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current text-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.3 8.2l-1.9 9.3c-.1.4-.5.7-.9.6-.2 0-.4-.1-.5-.2l-3-2.3-1.5 1.5c-.2.2-.4.3-.7.3-.2 0-.4-.1-.6-.2-.3-.2-.5-.5-.4-.9l.9-4.1L6.2 12c-.4-.3-.1-.8.4-.9l11-4.2c.4-.1.8.1.9.5.1.4.1.9-.5 1.1z" />
            </svg>
            Join Telegram
          </a>

          <button className="rounded-3xl border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800">
            Login
          </button>

          <button className="rounded-3xl bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-400">
            Sign up
          </button>
        </div>

        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-100 hover:bg-slate-800"
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
        <div className="md:hidden border-t border-slate-800/60 bg-slate-900/95">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-10">
            <a
              href="#"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current text-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.3 8.2l-1.9 9.3c-.1.4-.5.7-.9.6-.2 0-.4-.1-.5-.2l-3-2.3-1.5 1.5c-.2.2-.4.3-.7.3-.2 0-.4-.1-.6-.2-.3-.2-.5-.5-.4-.9l.9-4.1L6.2 12c-.4-.3-.1-.8.4-.9l11-4.2c.4-.1.8.1.9.5.1.4.1.9-.5 1.1z" />
              </svg>
              Join Telegram
            </a>

            <button className="mt-2 w-full rounded-lg border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-left text-sm text-slate-100 hover:bg-slate-800">
              Login
            </button>

            <button className="mt-2 w-full rounded-lg bg-emerald-500 px-3 py-2 text-left text-sm font-medium text-slate-900 hover:bg-emerald-400">
              Sign up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
