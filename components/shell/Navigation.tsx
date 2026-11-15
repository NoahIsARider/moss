"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { asset } from "@/lib/assets";
const links = [
  ["Home", "/", "home"],
  ["Timeline", "/timeline", "timeline"],
  ["Explore", "/explore", "search"],
  ["Notifications", "/notifications", "bell"],
  ["Bookmarks", "/bookmarks", "bookmark"],
  ["Code", "/code", "code"],
  ["Chat", "/chat", "chat"],
  ["Commons", "/community", "commons"],
  ["Profile", "/home", "account"],
  ["Docs", "/docs", "docs"],
];
export function Brand({
  title = "moss",
  code = false,
}: {
  title?: string;
  code?: boolean;
}) {
  return (
    <Link href="/" className="brand">
      <img src={asset("/assets/img/mark.webp")} alt="" width="44" height="44" />
      <span>
        {title}
        {code && <small> / code</small>}
      </span>
    </Link>
  );
}
export function Navigation({
  title = "moss",
  mode = "side",
  viewer,
  enabled = ["timeline", "forge", "chat", "commons"],
}: {
  title?: string;
  mode?: "side" | "top";
  viewer?: { handle: string; avatar?: number; avatarUrl?: string };
  enabled?: string[];
}) {
  const raw = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const path = raw.startsWith(base) ? raw.slice(base.length) || "/" : raw;
  const allowed: Record<string, string> = {
    "/timeline": "timeline",
    "/code": "forge",
    "/chat": "chat",
    "/community": "commons",
  };
  return (
    <nav
      aria-label={mode === "side" ? "Community navigation" : "Main navigation"}
      className={mode === "side" ? "side-nav" : "top-nav"}
    >
      {mode === "side" && <Brand title={title} />}
      {links
        .filter(([, url]) => !allowed[url] || enabled.includes(allowed[url]))
        .filter(
          ([label]) =>
            mode === "side" ||
            ![
              "Profile",
              "Docs",
              "Explore",
              "Notifications",
              "Bookmarks",
            ].includes(label),
        )
        .map(([label, href, icon]) => (
          <Link
            key={href}
            href={href}
            aria-current={
              (href === "/" ? path === "/" : path.startsWith(href))
                ? "page"
                : undefined
            }
          >
            {mode === "side" && <Icon name={icon} />}
            <span>{label}</span>
          </Link>
        ))}
      {mode === "side" && (
        <>
          <Link href="/community/new" className="button compose-link">
            <Icon name="plus" />
            Start a conversation
          </Link>
          <Link className="side-account" href="/home">
            <Avatar
              handle={viewer?.handle || "visitor"}
              index={viewer?.avatar}
              url={viewer?.avatarUrl}
              size={36}
            />
            <span>
              {viewer ? "@" + viewer.handle : "Your corner"}
              <small>Account & preferences</small>
            </span>
          </Link>
        </>
      )}
    </nav>
  );
}
