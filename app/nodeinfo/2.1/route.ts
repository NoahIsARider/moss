import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { enabledPlugins } from "@/lib/plugins";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readStore();

  return NextResponse.json(
    {
      version: "2.1",
      software: {
        name: "moss",
        version: "2.0.0",
        repository: config.repositoryUrl
      },
      protocols: ["rss2.0"],
      services: {
        inbound: [],
        outbound: ["rss2.0"]
      },
      openRegistrations: true,
      usage: {
        users: {
          total: store.users.length
        },
        localPosts: store.threads.length,
        localComments: store.threads.reduce((total, thread) => total + thread.replies.length, 0)
      },
      metadata: {
        domain: config.domain,
        plugins: [...enabledPlugins],
        matrix: Boolean(config.matrix.homeserver),
        forgejo: Boolean(config.forge.baseUrl)
      }
    },
    { headers: { "access-control-allow-origin": "*" } }
  );
}
