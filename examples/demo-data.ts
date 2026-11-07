// Example content for a local preview. Nothing here is loaded unless MOSS_DEMO=1.
// Deployments start with an empty store; copy what you need into your own instance instead.

import { config } from "../lib/config";
import type { ChatMessage, FeedItem, Repo, Thread } from "../lib/types";

const codeBase = config.codeUrl.replace(/\/$/, "");
const repoUrl = (path: string) => (codeBase ? `${codeBase}/${path}` : "/code");

export const demoThreads: Thread[] = [
  {
    id: "th-1",
    slug: "welcome-to-the-commons",
    title: "welcome to the commons",
    body: "This is the slow part of moss. Threads stay up for weeks. Nobody is optimising for engagement.\n\nA few ground rules. Use content warnings where they belong. Do not repost someone else's art without a link and permission. If a thread gets heated, ask a moderator to sit with it instead of winning.\n\nIntroduce yourself if you like. A handle, what you make, and one thing you are looking for is enough.",
    channel: "hello",
    authorHandle: "relay",
    createdAt: "2026-10-20T10:00:00.000Z",
    replies: [
      {
        id: "rp-1",
        authorHandle: "juniper",
        body: "juniper, she/her. i make small tools for writers and a very slow zine. looking for people who want to co-maintain a miniflux instance.",
        createdAt: "2026-10-21T19:12:00.000Z"
      },
      {
        id: "rp-2",
        authorHandle: "sedge",
        body: "sedge, they/them. sound things, mostly field recordings. i can help with backups and packaging.",
        createdAt: "2026-10-23T08:40:00.000Z"
      }
    ]
  },
  {
    id: "th-2",
    slug: "hosting-costs-november",
    title: "hosting costs, november",
    body: "Posting the real numbers again so nobody has to guess. Two VPS instances, object storage, and a domain. I will update this monthly.\n\nIf you want to chip in, the link is on the home page and it is not a subscription. If you cannot, that is fine. The point of the number is transparency, not an invoice.",
    channel: "workshop",
    authorHandle: "relay",
    createdAt: "2026-11-01T09:30:00.000Z",
    replies: [
      {
        id: "rp-3",
        authorHandle: "fen",
        body: "thanks for this. the bandwidth line is lower than i expected. are you caching feeds at the edge?",
        createdAt: "2026-11-01T12:02:00.000Z"
      },
      {
        id: "rp-4",
        authorHandle: "relay",
        body: "yes, fifteen minutes on the timeline, an hour on the forge page. the chat is the only thing that is actually live.",
        createdAt: "2026-11-01T12:20:00.000Z"
      }
    ]
  },
  {
    id: "th-3",
    slug: "infrastructure-reading-list",
    title: "small infrastructure reading list",
    body: "Nine texts on mutual aid, server hosting and the politics of uptime. Additions welcome. Please include a line on why it belongs.\n\n1. Mutual Aid: Building Solidarity During This Crisis (and the Next) — Dean Spade\n2. The Carrier Bag Theory of Fiction — Ursula K. Le Guin\n3. A Prehistory of the Cloud — Tung-Hui Hu\n4. Stay Solid! A Radical Handbook for Youth — various\n5. Conflict Is Not Abuse — Sarah Schulman\n6. The Maintenance Race — Stewart Brand\n7. Digital Disconnect — Robert W. McChesney\n8. The Server Room Is a Garden — (zine, out of print)\n9. The Art of Doing Science and Engineering — Richard Hamming",
    channel: "library",
    authorHandle: "moth",
    createdAt: "2026-10-26T15:30:00.000Z",
    replies: [
      {
        id: "rp-5",
        authorHandle: "juniper",
        body: "adding 'The Future Is Degrowth' — not about servers, but it is about the arithmetic we keep avoiding.",
        createdAt: "2026-10-27T10:05:00.000Z"
      }
    ]
  },
  {
    id: "th-4",
    slug: "content-warning-patterns",
    title: "content warning patterns that actually work",
    body: "Collecting patterns for CWs that do not feel punitive. What I have so far.\n\n- label plus blur, reveal on click\n- label plus a one-sentence scope, no blur (better for screen readers)\n- per-thread CW that inherits into replies\n- a global setting to always reveal\n\nWhat breaks? What have you seen work in small communities?",
    channel: "workshop",
    authorHandle: "sedge",
    createdAt: "2026-10-29T18:00:00.000Z",
    replies: [
      {
        id: "rp-6",
        authorHandle: "fen",
        body: "inheritance is the one that keeps biting us. a reply can undo a warning without meaning to. we now require replies to opt in to inheriting.",
        createdAt: "2026-10-30T07:22:00.000Z"
      }
    ]
  }
];

export const demoChat: ChatMessage[] = [
  {
    id: "chat-1",
    author: "@fen",
    body: "morning. the forge upgrade finished at 03:40, nothing lost. i left the old backup on cold storage anyway.",
    createdAt: "2026-11-06T08:05:00.000Z",
    transport: "matrix"
  },
  {
    id: "chat-2",
    author: "@juniper",
    body: "does anyone have a good pattern for content warnings that does not feel like a locked door? i want people to be able to peek.",
    createdAt: "2026-11-06T08:11:00.000Z",
    transport: "matrix"
  },
  {
    id: "chat-3",
    author: "@sedge",
    body: "i use a blurred container with a one-line label and a reveal button. no modal. works well in the timeline plugin too.",
    createdAt: "2026-11-06T08:14:00.000Z",
    transport: "matrix"
  },
  {
    id: "chat-4",
    author: "@fen",
    body: "reminder that the commons thread on hosting costs is still open. bring numbers, not vibes.",
    createdAt: "2026-11-06T08:22:00.000Z",
    transport: "matrix"
  },
  {
    id: "chat-5",
    author: "@moth",
    body: "small thing: the rss feed now includes the commons threads. reading it in miniflux feels like reading a street.",
    createdAt: "2026-11-06T09:02:00.000Z",
    transport: "matrix"
  }
];

export const demoRepos: Repo[] = [
  {
    owner: "moss",
    name: "shell",
    description: "The site shell. One 600px page, plugin slots, no build step required to read it.",
    language: "TypeScript",
    stars: 148,
    forks: 21,
    updatedAt: "2026-11-05T16:20:00.000Z",
    url: repoUrl("moss/shell")
  },
  {
    owner: "moss",
    name: "timeline",
    description: "RSS and Atom aggregator with a fifteen minute cache and an OPML export nobody asked for.",
    language: "TypeScript",
    stars: 96,
    forks: 14,
    updatedAt: "2026-11-04T11:05:00.000Z",
    url: repoUrl("moss/timeline")
  },
  {
    owner: "moss",
    name: "commons",
    description: "Long form threads in the shape of a small forum. Channels, replies, nothing else.",
    language: "TypeScript",
    stars: 74,
    forks: 9,
    updatedAt: "2026-11-02T08:45:00.000Z",
    url: repoUrl("moss/commons")
  },
  {
    owner: "moss",
    name: "bridge",
    description: "A tiny WebSocket bridge that keeps the chat plugin and a Matrix room in the same conversation.",
    language: "JavaScript",
    stars: 61,
    forks: 7,
    updatedAt: "2026-10-31T19:30:00.000Z",
    url: repoUrl("moss/bridge")
  },
  {
    owner: "juniper",
    name: "miniflux-ansible",
    description: "Ansible roles for a two machine miniflux setup on a budget. Commented within an inch of its life.",
    language: "YAML",
    stars: 33,
    forks: 12,
    updatedAt: "2026-10-28T10:10:00.000Z",
    url: repoUrl("juniper/miniflux-ansible")
  },
  {
    owner: "sedge",
    name: "fieldnotes",
    description: "A static site for field recordings. WAV files, no analytics, an index that fits on one screen.",
    language: "CSS",
    stars: 28,
    forks: 4,
    updatedAt: "2026-10-25T13:40:00.000Z",
    url: repoUrl("sedge/fieldnotes")
  }
];

export const demoFeed: FeedItem[] = [
  {
    id: "feed-1",
    title: "hosting costs, november",
    link: "/community/hosting-costs-november",
    source: "commons",
    author: "@relay",
    summary: "Two VPS instances, object storage, and a domain. The numbers are posted because guessing is worse.",
    publishedAt: "2026-11-01T09:30:00.000Z",
    tags: ["meta", "money"]
  },
  {
    id: "feed-2",
    title: "content warning patterns that actually work",
    link: "/community/content-warning-patterns",
    source: "commons",
    author: "@sedge",
    summary: "Patterns for content warnings, one of which keeps failing in replies. Notes from the workshop channel.",
    publishedAt: "2026-10-29T18:00:00.000Z",
    tags: ["moderation", "accessibility"]
  },
  {
    id: "feed-3",
    title: "a static site for field recordings",
    link: "/code",
    source: "code",
    author: "@sedge",
    summary: "fieldnotes is now public. WAV files, no analytics, an index that fits on one screen.",
    publishedAt: "2026-10-28T13:12:00.000Z",
    tags: ["release"]
  },
  {
    id: "feed-4",
    title: "small infrastructure reading list",
    link: "/community/infrastructure-reading-list",
    source: "commons",
    author: "@moth",
    summary: "Nine texts on mutual aid, server hosting and the politics of uptime.",
    publishedAt: "2026-10-26T15:30:00.000Z",
    tags: ["reading"]
  },
  {
    id: "feed-5",
    title: "bridge 0.4, now with a matrix sidecar",
    link: "/code",
    source: "code",
    author: "@fen",
    summary: "The chat plugin can mirror a room without a Synapse appservice. One token, one room id.",
    publishedAt: "2026-10-24T07:00:00.000Z",
    tags: ["release", "matrix"]
  },
  {
    id: "feed-6",
    title: "welcome to the commons",
    link: "/community/welcome-to-the-commons",
    source: "commons",
    author: "@relay",
    summary: "Threads stay up for weeks. Nobody is optimising for engagement. Introduce yourself.",
    publishedAt: "2026-10-20T10:00:00.000Z",
    tags: ["hello"]
  },
  {
    id: "feed-7",
    title: "the shell is one file",
    link: "/code",
    source: "code",
    author: "@relay",
    summary: "Why the whole frame is a single HTML table and why that is a feature, not a cleanup task.",
    publishedAt: "2026-10-18T09:20:00.000Z",
    tags: ["design"]
  }
];
