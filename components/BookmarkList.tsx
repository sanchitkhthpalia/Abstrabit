"use client";

import { useState } from "react";
import type { Bookmark } from "../types";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  loading: boolean;
  onDeleteBookmark: (id: string) => Promise<void> | void;
}

export const BookmarkList = ({
  bookmarks,
  loading,
  onDeleteBookmark
}: BookmarkListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteBookmark(id);
    } finally {
      setDeletingId(current => (current === id ? null : current));
    }
  };

  const renderSkeleton = () => (
    <ul className="space-y-2.5">
      {Array.from({ length: 3 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li
          key={index}
          className="group flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-3"
        >
          <div className="flex-1 animate-pulse space-y-2">
            <div className="h-3 w-32 rounded-full bg-slate-700/70" />
            <div className="h-3 w-44 rounded-full bg-slate-800/80" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-800/80" />
        </li>
      ))}
    </ul>
  );

  const renderEmptyState = () => (
    <div className="flex items-center justify-center py-10">
      <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-8 text-center">
        <h3 className="mb-1 text-sm font-semibold text-slate-100">
          No bookmarks yet
        </h3>
        <p className="text-xs text-slate-400">
          Add your first bookmark to get started 🚀
        </p>
      </div>
    </div>
  );

  return (
    <section className="card border-slate-800/60 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-100">
          Your bookmarks
        </h2>
        <span className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          {bookmarks.length} saved
        </span>
      </div>

      {loading ? (
        renderSkeleton()
      ) : bookmarks.length === 0 ? (
        renderEmptyState()
      ) : (
        <ul className="space-y-2.5">
          {bookmarks.map(bookmark => (
            <li
              key={bookmark.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-3 transition-colors hover:border-slate-600 hover:bg-slate-900"
            >
              <div className="min-w-0 flex-1">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-sm font-medium text-slate-50 transition-colors hover:text-blue-400"
                >
                  {bookmark.title}
                </a>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {bookmark.url}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteClick(bookmark.id)}
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

