import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { updateStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "sign in to post" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "expected json" }, { status: 400 });
  }

  const body = typeof (payload as { body?: unknown })?.body === "string" ? (payload as { body: string }).body.trim() : "";
  if (body.length === 0 || body.length > 2000) {
    return NextResponse.json({ error: "body must be 1 to 2000 characters" }, { status: 400 });
  }

  const message = await updateStore((store) => {
    const created = {
      id: crypto.randomUUID(),
      author: `@${user.handle}`,
      body,
      createdAt: new Date().toISOString(),
      transport: "moss" as const
    };
    store.chat.push(created);
    if (store.chat.length > 500) store.chat = store.chat.slice(-500);
    return created;
  });

  return NextResponse.json(message, { status: 201 });
}
