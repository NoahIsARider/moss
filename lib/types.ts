export type PluginFlag = "E" | "J" | "S";

export interface User {
  id: string;
  handle: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Reply {
  id: string;
  authorHandle: string;
  body: string;
  createdAt: string;
}

export interface Thread {
  id: string;
  slug: string;
  title: string;
  body: string;
  channel: string;
  authorHandle: string;
  createdAt: string;
  replies: Reply[];
}

export interface ChatMessage {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  transport: "moss" | "matrix";
}

export interface Repo {
  owner: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
}

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  source: string;
  author: string;
  summary: string;
  publishedAt: string;
  tags: string[];
}

export interface StoreShape {
  users: User[];
  threads: Thread[];
  chat: ChatMessage[];
  meta: {
    createdAt: string;
    seeded: boolean;
  };
}
