import { config, absolute } from "./config";
import { demoFeed } from "../examples/demo-data";
import { escapeHtml } from "./markdown";
import { readStore } from "./store";
import type { FeedItem } from "./types";

interface CacheEntry {
  at: number;
  items: FeedItem[];
}

let remoteCache: CacheEntry | null = null;
const CACHE_MS = 15 * 60 * 1000;

function unwrapCdata(value: string): string {
  const open = "<![CDATA[";
  const close = "]]>";
  let rest = value;
  let output = "";
  let start = rest.indexOf(open);
  while (start !== -1) {
    const end = rest.indexOf(close, start + open.length);
    if (end === -1) break;
    output += rest.slice(0, start) + rest.slice(start + open.length, end);
    rest = rest.slice(end + close.length);
    start = rest.indexOf(open);
  }
  return output + rest;
}

function decodeEntities(value: string): string {
  return unwrapCdata(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function pick(block: string, names: string[]): string {
  for (const name of names) {
    const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
    if (match) return decodeEntities(match[1]).trim();
  }
  return "";
}

function pickLink(block: string): string {
  const atom = block.match(/<link[^>]*\bhref=["']([^"']+)["'][^>]*>/i);
  if (atom) return atom[1];
  return pick(block, ["link", "guid", "id"]);
}

function parseFeed(xml: string, sourceUrl: string): FeedItem[] {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) ?? [];
  const host = (() => {
    try {
      return new URL(sourceUrl).host;
    } catch {
      return sourceUrl;
    }
  })();

  return blocks.slice(0, 20).map((block, index) => {
    const title = stripTags(pick(block, ["title"])) || "untitled";
    const summary = stripTags(pick(block, ["description", "summary", "content"]));
    const updated = pick(block, ["pubDate", "published", "updated", "dc:date"]);
    const parsedDate = updated ? new Date(updated) : new Date();
    const iso = Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
    return {
      id: `${host}-${index}-${title.slice(0, 24)}`,
      title,
      link: pickLink(block) || sourceUrl,
      source: host,
      author: stripTags(pick(block, ["dc:creator", "author", "name"])) || host,
      summary,
      publishedAt: iso,
      tags: []
    };
  });
}

export async function getRemoteFeedItems(): Promise<FeedItem[]> {
  if (config.feeds.length === 0) return [];
  if (remoteCache && Date.now() - remoteCache.at < CACHE_MS) return remoteCache.items;

  const results = await Promise.allSettled(
    config.feeds.map(async (url) => {
      const response = await fetch(url, {
        headers: { "user-agent": "moss-timeline/1.0", accept: "application/rss+xml, application/atom+xml" },
        signal: AbortSignal.timeout(4000),
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`${url} returned ${response.status}`);
      return parseFeed(await response.text(), url);
    })
  );

  const items = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  remoteCache = { at: Date.now(), items };
  return items;
}

export async function getFeedItems(): Promise<FeedItem[]> {
  const store = await readStore();
  const threadItems: FeedItem[] = store.threads.map((thread) => ({
    id: `thread-${thread.id}`,
    title: thread.title,
    link: `/community/${thread.slug}`,
    source: "commons",
    author: `@${thread.authorHandle}`,
    summary: thread.body.replace(/\s+/g, " ").slice(0, 180),
    publishedAt: thread.createdAt,
    tags: [thread.channel]
  }));

  const local = [...threadItems, ...(config.demo ? demoFeed : []), ...(await getRemoteFeedItems())];
  const seen = new Set<string>();
  return local
    .filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function buildRss(items: FeedItem[]): string {
  const updated = items[0]?.publishedAt ?? new Date().toISOString();
  const entries = items
    .map((item) => {
      const link = item.link.startsWith("http") ? item.link : absolute(item.link);
      return [
        "  <item>",
        `    <title>${escapeHtml(item.title)}</title>`,
        `    <link>${escapeHtml(link)}</link>`,
        `    <guid isPermaLink="false">${escapeHtml(item.id)}</guid>`,
        `    <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>`,
        `    <description>${escapeHtml(item.summary)}</description>`,
        `    <author>${escapeHtml(item.author)}</author>`,
        `    <category>${escapeHtml(item.source)}</category>`,
        "  </item>"
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeHtml(config.title)} timeline</title>`,
    `    <link>${absolute("/timeline")}</link>`,
    `    <description>Everything published on ${escapeHtml(config.domain)}, in one feed.</description>`,
    `    <language>en</language>`,
    `    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${absolute("/feed.xml")}" rel="self" type="application/rss+xml" />`,
    entries,
    "  </channel>",
    "</rss>"
  ].join("\n");
}
