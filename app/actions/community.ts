"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { updateStore } from "@/lib/store";

const CHANNELS = ["hello", "workshop", "library", "meta"];

export async function createThread(formData: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const channel = String(formData.get("channel") ?? "workshop");

  if (title.length < 4 || title.length > 120) redirect("/community/new?error=title");
  if (body.length < 10 || body.length > 8000) redirect("/community/new?error=body");
  if (!CHANNELS.includes(channel)) redirect("/community/new?error=channel");

  const slug = await updateStore((store) => {
    const base = slugify(title);
    let candidate = base;
    let suffix = 2;
    while (store.threads.some((thread) => thread.slug === candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    store.threads.push({
      id: crypto.randomUUID(),
      slug: candidate,
      title,
      body,
      channel,
      authorHandle: user.handle,
      createdAt: new Date().toISOString(),
      replies: []
    });
    return candidate;
  });

  revalidatePath("/community");
  revalidatePath("/timeline");
  redirect(`/community/${slug}`);
}

export async function addReply(formData: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!threadId || body.length < 1 || body.length > 4000) redirect("/community");

  const slug = await updateStore((store) => {
    const thread = store.threads.find((entry) => entry.id === threadId);
    if (!thread) return null;
    thread.replies.push({
      id: crypto.randomUUID(),
      authorHandle: user.handle,
      body,
      createdAt: new Date().toISOString()
    });
    return thread.slug;
  });

  if (!slug) redirect("/community");
  revalidatePath(`/community/${slug}`);
  revalidatePath("/timeline");
  redirect(`/community/${slug}#replies`);
}
