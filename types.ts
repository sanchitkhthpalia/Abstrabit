import type { Timestamp } from "firebase/firestore";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  userId: string;
  tags: string[];
  createdAt: Timestamp | null;
  lastVisitedAt: Timestamp | null;
}

