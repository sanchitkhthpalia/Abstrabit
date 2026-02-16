"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { BookmarkForm } from "../components/BookmarkForm";
import { BookmarkList } from "../components/BookmarkList";

const HomePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || (!user && typeof window !== "undefined")) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="card flex w-full max-w-sm flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" />
          <p className="text-xs text-slate-400">
            Checking your session. Please wait...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="card border-slate-800/60 p-5 sm:p-6">
        <h1 className="mb-2 text-xl font-semibold text-slate-100">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400">
          Save and manage your favorite links. Everything is synced
          instantly across open tabs and kept private to your Google
          account.
        </p>
      </section>

      <BookmarkForm />
      <BookmarkList />
    </div>
  );
};

export default HomePage;

