import { DemoPage } from "../../DemoPage";
const routes = [
  "",
  "timeline",
  "people/ira",
  "people/juniper",
  "people/mari",
  "people/you",
  "explore",
  "notifications",
  "bookmarks",
  "code",
  "chat",
  "community",
  "docs",
  "home",
  "login",
  "join",
  "community/new",
  "community/photo-walk",
  "community/reading-circle",
  "community/small-projects",
  "avatars",
  "appearance",
  "repo/shell",
  "repo/birdbook",
  "repo/commons",
  "repo/chat-bridge",
  "repo/garden-log",
  "repo/field-notes",
];
export function generateStaticParams() {
  return routes.map((route) => ({ slug: route ? route.split("/") : [] }));
}
export const dynamicParams = false;
export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <DemoPage route={slug?.join("/") || ""} />;
}
