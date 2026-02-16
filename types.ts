import type { Timestamp } from "firebase/firestore";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  userId: string;
  createdAt: Timestamp | null;
}

