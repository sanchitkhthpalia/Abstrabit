"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface BookmarkFormProps {
  onAddBookmark: (title: string, url: string) => Promise<void> | void;
}

export const BookmarkForm = ({ onAddBookmark }: BookmarkFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const normalizeUrl = (value: string): string => {
    let trimmed = value.trim();
    if (!trimmed) return trimmed;
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    return trimmed;
  };

  const isValidUrl = (value: string): boolean => {
    try {
      const normalized = normalizeUrl(value);
      // eslint-disable-next-line no-new
      new URL(normalized);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const normalizedUrl = normalizeUrl(url);

    if (!trimmedTitle) {
      toast.error("Title is required.");
      return;
    }

    if (!normalizedUrl || !isValidUrl(url)) {
      toast.error("Please enter a valid URL.");
      return;
    }

    try {
      setSubmitting(true);
      await onAddBookmark(trimmedTitle, normalizedUrl);
      setTitle("");
      setUrl("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card mb-6 space-y-4 border-slate-800/60 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Add new bookmark
          </h2>
          <p className="text-xs text-slate-400">
            Save links privately to your account. Updates sync in real time
            across tabs.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label
            htmlFor="bookmark-title"
            className="text-xs font-medium text-slate-300"
          >
            Title
          </label>
          <input
            id="bookmark-title"
            className="input"
            placeholder="E.g. Firebase docs"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={120}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="bookmark-url"
            className="text-xs font-medium text-slate-300"
          >
            URL
          </label>
          <input
            id="bookmark-url"
            className="input"
            placeholder="https://firebase.google.com/"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save bookmark"}
        </button>
      </div>
    </form>
  );
};

