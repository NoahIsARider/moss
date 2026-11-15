"use server";
import crypto from "node:crypto";
import { AVATAR_COUNT } from "@/lib/avatars";
import { saveImage } from "@/lib/uploads";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { updateStore } from "@/lib/store";
export async function createPost(data: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");
  const body = String(data.get("body") || "").trim();
  if (!body || body.length > 2000) redirect("/timeline?error=body");
  let image: string | undefined;
  const file = data.get("image");
  if (file instanceof File && file.size) {
    try {
      image = await saveImage(file);
    } catch {
      redirect("/timeline?error=image");
    }
  }
  const imageAlt = String(data.get("imageAlt") || "")
    .trim()
    .slice(0, 500);
  await updateStore((store) => {
    (store.posts ??= []).push({
      id: crypto.randomUUID(),
      authorHandle: user.handle,
      image,
      imageAlt,
      body,
      createdAt: new Date().toISOString(),
    });
  });
  revalidatePath("/");
  revalidatePath("/timeline");
  redirect("/timeline");
}
export async function chooseAvatar(data: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");
  const index = Number(data.get("avatar"));
  if (!Number.isInteger(index) || index < 0 || index >= AVATAR_COUNT)
    redirect("/avatars");
  await updateStore((store) => {
    const record = store.users.find((u) => u.id === user.id);
    if (record) {
      record.avatar = index;
      delete record.avatarUrl;
    }
  });
  revalidatePath("/home");
  revalidatePath("/timeline");
  redirect("/avatars?saved=1");
}

export async function replyToPost(data: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");
  const id = String(data.get("postId") || "");
  const body = String(data.get("body") || "").trim();
  if (!body || body.length > 4000) redirect("/post/" + encodeURIComponent(id));
  const saved = await updateStore((store) => {
    const post = store.posts?.find((p) => p.id === id);
    if (!post) return false;
    (post.replies ??= []).push({
      id: crypto.randomUUID(),
      authorHandle: user.handle,
      body,
      createdAt: new Date().toISOString(),
    });
    return true;
  });
  if (!saved) redirect("/timeline");
  revalidatePath("/timeline");
  revalidatePath("/post/" + id);
  redirect("/post/" + id + "#replies");
}

export async function uploadAvatar(data: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");
  const file = data.get("image");
  if (!(file instanceof File) || !file.size) redirect("/avatars?error=image");
  let url;
  try {
    url = await saveImage(file, true);
  } catch {
    redirect("/avatars?error=image");
  }
  await updateStore((store) => {
    const record = store.users.find((u) => u.id === user.id);
    if (record) record.avatarUrl = url;
  });
  revalidatePath("/home");
  revalidatePath("/timeline");
  redirect("/avatars?saved=1");
}
