"use client";

import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/auth-context";
import type { Bookmark } from "../types";

export const BookmarkList = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "bookmarks"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const next: Bookmark[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as Omit<Bookmark, "id">;
          return {
            id: docSnap.id,
            ...data
          };
        }).sort((a, b) => {
          const aTime = a.createdAt ? a.createdAt.toMillis() : 0;
          const bTime = b.createdAt ? b.createdAt.toMillis() : 0;
          return bTime - aTime;
        });
        setBookmarks(next);
        setLoading(false);
      },
      err => {
        // eslint-disable-next-line no-console
        console.error("Error listening to bookmarks", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "bookmarks", id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete bookmark", err);
    } finally {
      setDeletingId(current => (current === id ? null : current));
    }
  };

  return (
    <section className="card p-4 sm:p-5 border-slate-800/60">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-100">
          Your bookmarks
        </h2>
        <span className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          {bookmarks.length} saved
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-xs text-slate-400">
          Loading bookmarks...
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-8 text-center text-xs text-slate-400">
          No bookmarks yet. Add your first link above.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {bookmarks.map(bookmark => (
            <li
              key={bookmark.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-3 transition-colors hover:border-primary/60 hover:bg-slate-900"
            >
              <div className="min-w-0 flex-1">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-sm font-medium text-slate-50 hover:text-primary-light"
                >
                  {bookmark.title}
                </a>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {bookmark.url}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(bookmark.id)}
                disabled={deletingId === bookmark.id}
                className="ml-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-transparent text-slate-400 transition-colors hover:border-red-500/60 hover:bg-red-950/40 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Delete bookmark"
              >
                {deletingId === bookmark.id ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
                ) : (
                  <span className="text-xs">×</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-[10px] text-slate-500">
        Bookmarks are private to your Google account. Changes sync in real time
        across all open tabs.
      </p>
    </section>
  );
};

