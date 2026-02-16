"use client";

import { type FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/auth-context";

export const BookmarkForm = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const validateUrl = (value: string): boolean => {
    try {
      let toValidate = value.trim();
      if (!/^https?:\/\//i.test(toValidate)) {
        toValidate = `https://${toValidate}`;
      }
      // eslint-disable-next-line no-new
      new URL(toValidate);
      return true;
    } catch {
      return false;
    }
  };

  const normalizeUrl = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return trimmed;
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedUrl = normalizeUrl(url);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      setSubmitting(true);
      await addDoc(collection(db, "bookmarks"), {
        title: title.trim(),
        url: normalizedUrl,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setTitle("");
      setUrl("");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to add bookmark", err);
      setError("Something went wrong while saving the bookmark.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-5 sm:p-6 mb-6 space-y-4 border-slate-800/60"
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

      {error && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary px-4 py-2 text-sm"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save bookmark"}
        </button>
      </div>
    </form>
  );
};

