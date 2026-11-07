import type { PluginFlag } from "./types";
import { config } from "./config";

export type PluginId = "timeline" | "forge" | "chat" | "commons";

export interface ServiceLink {
  label: string;
  href: string;
  flag?: PluginFlag;
  icon: string;
  title: string;
  plugin?: PluginId;
}

export interface ServiceGroup {
  title: string;
  items: ServiceLink[];
}

const envPlugins = process.env.MOSS_PLUGINS ?? "timeline,forge,chat,commons";

export const enabledPlugins = new Set(
  envPlugins
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);

export function pluginEnabled(id: PluginId): boolean {
  return enabledPlugins.has(id);
}

export const serviceGroups: ServiceGroup[] = [
  {
    title: "Local services",
    items: [
      { label: "Home", href: "/", icon: "home", title: "The shell" },
      { label: "Timeline", href: "/timeline", icon: "timeline", flag: "E", title: "RSS and Atom in one column", plugin: "timeline" },
      { label: "Code", href: "/code", icon: "code", flag: "E", title: "Forgejo and Gitea hub", plugin: "forge" },
      { label: "Chat", href: "/chat", icon: "chat", flag: "J", title: "Live rooms over WebSocket", plugin: "chat" },
      { label: "Commons", href: "/community", icon: "commons", flag: "E", title: "Slow threads, no ranking", plugin: "commons" },
      { label: "Account", href: "/home", icon: "account", flag: "J", title: "One handle for every plugin" },
      { label: "Docs", href: "/docs", icon: "docs", flag: "S", title: "Deploy your own instance" }
    ]
  },
  {
    title: "Federation",
    items: [
      { label: "Feed", href: "/feed.xml", icon: "feed", flag: "S", title: "RSS 2.0 of every plugin" },
      { label: "WebFinger", href: `/.well-known/webfinger?resource=acct:relay@${config.domain}`, icon: "finger", flag: "S", title: "Handle discovery" },
      { label: "NodeInfo", href: "/nodeinfo/2.1", icon: "node", flag: "S", title: "What this instance runs" }
    ]
  }
];

export function flagDescription(flag: PluginFlag): string {
  if (flag === "J") return "The page requires JavaScript to work";
  if (flag === "E") return "The page is improved with optional JavaScript";
  return "Server rendered only, no scripts at all";
}
