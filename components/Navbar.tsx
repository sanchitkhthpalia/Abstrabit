"use client";

import { useAuth } from "../lib/auth-context";

export const Navbar = () => {
  const { user, signOutUser } = useAuth();

  return (
    <header className="border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
            <span className="text-xs font-semibold">SB</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-900">
              Smart Bookmark
            </span>
            <span className="text-xs text-slate-500">
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
                  className="h-8 w-8 rounded-full border border-slate-300"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="hidden max-w-[140px] flex-col text-right text-xs sm:flex">
                <span className="truncate font-medium text-slate-900">
                  {user.displayName ?? "Google User"}
                </span>
                <span className="truncate text-slate-500">
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

