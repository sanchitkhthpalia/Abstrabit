"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";

import { useAuth } from "../lib/auth-context";
import { db } from "../lib/firebase";
import { BookmarkForm } from "../components/BookmarkForm";
import { BookmarkList } from "../components/BookmarkList";
import type { Bookmark } from "../types";

const HomePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setBookmarksLoading(false);
      return;
    }

    setBookmarksLoading(true);

    const q = query(
      collection(db, "bookmarks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const next: Bookmark[] = snapshot.docs
          .map(docSnap => {
            const data = docSnap.data() as Omit<Bookmark, "id">;
            return {
              id: docSnap.id,
              ...data
            };
          })
          .sort((a, b) => {
            const aTime = a.createdAt ? a.createdAt.toMillis() : 0;
            const bTime = b.createdAt ? b.createdAt.toMillis() : 0;
            return bTime - aTime;
          });

        setBookmarks(next);
        setBookmarksLoading(false);
      },
      () => {
        setBookmarksLoading(false);
        toast.error("Failed to load bookmarks. Please try again.");
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleAddBookmark = useCallback(
    async (title: string, url: string) => {
      if (!user) {
        toast.error("You must be signed in to add bookmarks.");
        return;
      }

      const tempId = `temp-${Date.now()}`;
      const optimisticBookmark: Bookmark = {
        id: tempId,
        title,
        url,
        userId: user.uid,
        createdAt: null
      };

      setBookmarks(prev => [optimisticBookmark, ...prev]);

      try {
        await addDoc(collection(db, "bookmarks"), {
          title,
          url,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
        toast.success("Bookmark added");
      } catch {
        setBookmarks(prev => prev.filter(b => b.id !== tempId));
        toast.error("Failed to add bookmark. Please try again.");
      }
    },
    [user]
  );

  const handleDeleteBookmark = useCallback(
    async (id: string) => {
      if (!user) {
        toast.error("You must be signed in to delete bookmarks.");
        return;
      }

      let previous: Bookmark[] = [];

      setBookmarks(prev => {
        previous = prev;
        return prev.filter(b => b.id !== id);
      });

      try {
        await deleteDoc(doc(db, "bookmarks", id));
        toast.success("Bookmark deleted");
      } catch {
        setBookmarks(previous);
        toast.error("Failed to delete bookmark. Please try again.");
      }
    },
    [user]
  );

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
          Welcome back, {user.displayName ?? "there"} 👋
        </h1>
        <p className="text-sm text-slate-400">
          Save and manage your favorite links. Everything is synced instantly
          across open tabs and kept private to your Google account.
        </p>
      </section>

      <BookmarkForm onAddBookmark={handleAddBookmark} />
      <BookmarkList
        bookmarks={bookmarks}
        loading={bookmarksLoading}
        onDeleteBookmark={handleDeleteBookmark}
      />
    </div>
  );
};

export default HomePage;

