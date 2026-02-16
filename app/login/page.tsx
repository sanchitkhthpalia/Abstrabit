"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";

const LoginPage = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="card flex w-full max-w-sm flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" />
          <p className="text-xs text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
      <div className="flex w-full items-center justify-center">
        <div className="card w-full max-w-sm px-6 py-8 text-center border-slate-800/60">
          <div className="mb-5 flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="text-sm font-semibold">SB</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-100">
                Sign in to Smart Bookmark
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Use your Google account to keep your bookmarks private and
                synced in real time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-xs font-bold text-slate-900">
              G
            </span>
            <span>Continue with Google</span>
          </button>

          <p className="mt-4 text-[10px] text-slate-500">
            We only support Google sign-in. Your bookmarks are stored securely
            in Firestore, scoped to your user account.
          </p>
        </div>
      </div>
  );
};

export default LoginPage;

