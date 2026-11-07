"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser, createSession, findUserByHandleOrEmail, hashPassword, verifyPassword } from "@/lib/auth";
import { updateStore } from "@/lib/store";
import { config } from "@/lib/config";

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function signup(formData: FormData): Promise<void> {
  const handle = clean(formData.get("handle")).toLowerCase();
  const email = clean(formData.get("email")).toLowerCase();
  const password = clean(formData.get("password"));

  if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
    redirect("/join?error=handle");
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect("/join?error=email");
  }
  if (password.length < 8) {
    redirect("/join?error=password");
  }

  const exists = await findUserByHandleOrEmail(handle);
  if (exists) {
    redirect("/join?error=taken");
  }

  const user = await updateStore((store) => {
    if (store.users.some((entry) => entry.handle.toLowerCase() === handle || entry.email.toLowerCase() === email)) {
      return null;
    }
    const created = {
      id: crypto.randomUUID(),
      handle,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    store.users.push(created);
    return created;
  });

  if (!user) {
    redirect("/join?error=taken");
  }

  const session = createSession(user);
  const jar = await cookies();
  jar.set(session.name, session.value, session.options);
  redirect("/home");
}

export async function login(formData: FormData): Promise<void> {
  const loginValue = clean(formData.get("login"));
  const password = clean(formData.get("password"));
  if (!loginValue || !password) {
    redirect("/login?error=missing");
  }

  const user = await findUserByHandleOrEmail(loginValue);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    redirect("/login?error=bad");
  }

  const session = createSession(user);
  const jar = await cookies();
  jar.set(session.name, session.value, session.options);
  redirect("/home");
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(config.sessionCookie);
  redirect("/");
}

export async function whoAmI(): Promise<string | null> {
  const user = await currentUser();
  return user?.handle ?? null;
}
