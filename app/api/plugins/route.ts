import { NextResponse } from "next/server";
import { enabledPlugins, serviceGroups } from "@/lib/plugins";
import { pluginEnabled } from "@/lib/plugins";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    name: "moss",
    version: "2.0.0",
    shell: {
      frame: "600px table, mint style",
      license: "ISC"
    },
    plugins: [
      {
        id: "timeline",
        name: "RSS/Atom timeline",
        enabled: pluginEnabled("timeline"),
        routes: ["/timeline", "/feed.xml"]
      },
      {
        id: "forge",
        name: "Forgejo/Gitea hub",
        enabled: pluginEnabled("forge"),
        routes: ["/code"]
      },
      {
        id: "chat",
        name: "Matrix/WebSocket chat",
        enabled: pluginEnabled("chat"),
        routes: ["/chat", "/api/chat/messages", "/api/chat/stream"]
      },
      {
        id: "commons",
        name: "Lemmy/Discourse style community",
        enabled: pluginEnabled("commons"),
        routes: ["/community", "/community/[slug]", "/community/new"]
      }
    ],
    services: serviceGroups,
    active: [...enabledPlugins]
  });
}
