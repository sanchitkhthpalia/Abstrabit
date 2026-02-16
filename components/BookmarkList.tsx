"use client";

import { useState } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Bookmark } from "../types";

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc" | "recent";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  loading: boolean;
  onDeleteBookmark: (id: string) => Promise<void> | void;
  onBookmarkClick?: (id: string) => void;
}

export const BookmarkList = ({
  bookmarks,
  loading,
  onDeleteBookmark,
  onBookmarkClick
}: BookmarkListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(id);
  }, [searchValue]);

  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteBookmark(id);
    } finally {
      setDeletingId(current => (current === id ? null : current));
    }
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(current => (current === tag ? null : tag));
  };

  const clearTagFilter = () => {
    setActiveTag(null);
  };

  const handleBookmarkClick = (id: string) => {
    onBookmarkClick?.(id);
  };

  const visibleBookmarks = useMemo(() => {
    let next = [...bookmarks];

    if (activeTag) {
      next = next.filter(bookmark =>
        bookmark.tags.some(
          tag => tag.toLowerCase() === activeTag.toLowerCase()
        )
      );
    }

    if (debouncedSearch) {
      next = next.filter(bookmark => {
        const query = debouncedSearch;
        return (
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query)
        );
      });
    }

    next.sort((a, b) => {
      const aCreated = a.createdAt ? a.createdAt.toMillis() : 0;
      const bCreated = b.createdAt ? b.createdAt.toMillis() : 0;
      const aVisited = a.lastVisitedAt ? a.lastVisitedAt.toMillis() : 0;
      const bVisited = b.lastVisitedAt ? b.lastVisitedAt.toMillis() : 0;

      switch (sort) {
        case "oldest":
          return aCreated - bCreated;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "recent":
          return bVisited - aVisited || bCreated - aCreated;
        case "newest":
        default:
          return bCreated - aCreated;
      }
    });

    return next;
  }, [activeTag, bookmarks, debouncedSearch, sort]);

  const hasSearch = debouncedSearch.length > 0;
  const noResultsWithSearch =
    !loading && bookmarks.length > 0 && visibleBookmarks.length === 0 && hasSearch;

  const renderSkeleton = () => (
    <ul className="space-y-2.5">
      {Array.from({ length: 3 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li
          key={index}
          className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3 dark:border-slate-800/80 dark:bg-slate-900/80"
        >
          <div className="flex-1 animate-pulse space-y-2">
            <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-700/70" />
            <div className="h-3 w-44 rounded-full bg-slate-100 dark:bg-slate-800/80" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800/80" />
        </li>
      ))}
    </ul>
  );

  const renderEmptyState = () => (
    <div className="flex items-center justify-center py-10">
      <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
          No bookmarks yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Add your first bookmark to get started 🚀
        </p>
      </div>
    </div>
  );

  return (
    <section className="card border-slate-200/80 p-4 sm:p-5 dark:border-slate-800/60">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Your bookmarks
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Search, sort, and filter your saved links.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-56">
            <input
              type="search"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search bookmarks..."
              className="input pr-8 text-xs"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              ⌘K
            </span>
          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="input w-full text-xs sm:w-40"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
            <option value="recent">Recently visited</option>
          </select>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {bookmarks.length} saved
        </span>

        {activeTag && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
              Tag: {activeTag}
            </span>
            <button
              type="button"
              onClick={clearTagFilter}
              className="text-[11px] text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {loading ? (
        renderSkeleton()
      ) : bookmarks.length === 0 ? (
        renderEmptyState()
      ) : noResultsWithSearch ? (
        <div className="flex items-center justify-center py-8 text-xs text-slate-500 dark:text-slate-400">
          No bookmarks match your search.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {visibleBookmarks.map(bookmark => (
            <li
              key={bookmark.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            >
              <div className="min-w-0 flex-1">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleBookmarkClick(bookmark.id)}
                  className="block truncate text-sm font-medium text-slate-900 transition-colors hover:text-blue-500 dark:text-slate-50 dark:hover:text-blue-400"
                >
                  {bookmark.title}
                </a>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {bookmark.url}
                </p>

                {bookmark.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {bookmark.tags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDeleteClick(bookmark.id)}
                disabled={deletingId === bookmark.id}
                className="ml-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-transparent text-slate-400 transition-colors hover:border-red-500/60 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
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

      <p className="mt-4 text-[10px] text-slate-500 dark:text-slate-500">
        Bookmarks are private to your Google account. Changes sync in real time
        across all open tabs.
      </p>
    </section>
  );
};

