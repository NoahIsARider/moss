import { NextResponse } from "next/server";
import { absolute, config } from "@/lib/config";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource") ?? "";
  const store = await readStore();

  if (!resource.startsWith("acct:")) {
    return NextResponse.json({ error: "resource must be an acct: uri" }, { status: 400 });
  }

  const handle = resource.slice(5).split("@")[0]?.toLowerCase() ?? "";
  const known = store.users.some((user) => user.handle.toLowerCase() === handle);
  if (!known) {
    return NextResponse.json({ error: "no such handle here" }, { status: 404 });
  }

  return NextResponse.json(
    {
      subject: `acct:${handle}@${config.domain}`,
      aliases: [absolute(`/home`), absolute(`/community`)],
      links: [
        { rel: "http://webfinger.net/rel/profile-page", type: "text/html", href: absolute("/home") },
        { rel: "http://schemas.google.com/g/2010#updates-from", type: "application/rss+xml", href: absolute("/feed.xml") }
      ]
    },
    {
      headers: { "content-type": "application/jrd+json; charset=utf-8", "access-control-allow-origin": "*" }
    }
  );
}
