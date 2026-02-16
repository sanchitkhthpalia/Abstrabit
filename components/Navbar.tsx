"use client";

import { useAuth } from "../lib/auth-context";
import { useTheme } from "../lib/theme-context";

export const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <header className="border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            <span className="text-xs font-semibold">SB</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Smart Bookmark
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Minimal realtime bookmark manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost hidden text-xs sm:inline-flex"
          >
            {isDark ? "Light mode" : "Dark mode"}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/60 text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 sm:hidden"
            aria-label="Toggle theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {user && (
            <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? "User avatar"}
                  className="h-8 w-8 rounded-full border border-slate-700"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="hidden flex-col text-right text-xs sm:flex">
                <span className="font-medium text-slate-100 truncate max-w-[140px]">
                  {user.displayName ?? "Google User"}
                </span>
                <span className="text-slate-400 truncate max-w-[140px]">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-ghost text-xs sm:text-sm"
              onClick={signOutUser}
            >
              Log out
            </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

