import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { updateStore } from "@/lib/store";
import { postState } from "@/lib/social";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || new URL(request.url).host;
  let sameOrigin = true;
  try {
    sameOrigin = !origin || new URL(origin).host === host;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const session = await currentUser();
  if (!session)
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  let data: { action?: string; id?: string; handle?: string };
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return NextResponse.json(
        { error: "Expected an object" },
        { status: 400 },
      );
    data = parsed as typeof data;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!["like", "repost", "bookmark", "follow"].includes(data.action || ""))
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  const result = await updateStore((store) => {
    const user = store.users.find((u) => u.id === session.id);
    if (!user) return null;
    const toggle = (list: string[], id: string) =>
      list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
    if (data.action === "follow") {
      const target = store.users.find(
        (u) => u.handle === data.handle && u.id !== user.id,
      );
      if (!target) return null;
      user.following = toggle(user.following || [], target.id);
      return { following: user.following.includes(target.id) };
    }
    const post = store.posts?.find((p) => p.id === data.id);
    if (!post) return null;
    if (data.action === "like")
      post.likedBy = toggle(post.likedBy || [], user.id);
    if (data.action === "repost")
      post.repostedBy = toggle(post.repostedBy || [], user.id);
    if (data.action === "bookmark")
      user.bookmarks = toggle(user.bookmarks || [], post.id);
    return postState(post, user);
  });
  if (result) {
    for (const route of [
      "/timeline",
      "/bookmarks",
      "/notifications",
      "/explore",
    ])
      revalidatePath(route);
    if (data.id) revalidatePath("/post/" + data.id);
    if (data.handle) revalidatePath("/people/" + data.handle);
  }
  return result
    ? NextResponse.json(result)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
