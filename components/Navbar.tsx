"use client";

import { useAuth } from "../lib/auth-context";

export const Navbar = () => {
  const { user, signOutUser } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="text-xs font-semibold">SB</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-100">
              Smart Bookmark
            </span>
            <span className="text-xs text-slate-400">
              Minimal realtime bookmark manager
            </span>
          </div>
        </div>

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
      </nav>
    </header>
  );
};

