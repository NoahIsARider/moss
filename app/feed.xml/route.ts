import { buildRss, getFeedItems } from "@/lib/feed";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getFeedItems();
  return new Response(buildRss(items), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=900",
      "x-content-type-options": "nosniff"
    }
  });
}
