import crypto from "node:crypto";
import { cookies } from "next/headers";
import { config } from "./config";
import { readStore } from "./store";
import type { User } from "./types";

const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expected] = parts;
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const expectedBuffer = Buffer.from(expected, "hex");
  if (expectedBuffer.length !== derived.length) return false;
  return crypto.timingSafeEqual(derived, expectedBuffer);
}

interface SessionPayload {
  id: string;
  handle: string;
  exp: number;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", config.secret).update(value).digest("base64url");
}

export function createSession(user: User): { name: string; value: string; options: Record<string, unknown> } {
  const payload: SessionPayload = {
    id: user.id,
    handle: user.handle,
    exp: Date.now() + config.sessionDays * 24 * 60 * 60 * 1000
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const value = `${body}.${sign(body)}`;
  return {
    name: config.sessionCookie,
    value,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: config.baseUrl.startsWith("https://"),
      path: "/",
      maxAge: config.sessionDays * 24 * 60 * 60
    }
  };
}

function parseSession(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.id || !payload.handle || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export interface SessionUser {
  id: string;
  handle: string;
}

export async function currentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const payload = parseSession(jar.get(config.sessionCookie)?.value);
  if (!payload) return null;
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === payload.id);
  if (!user) return null;
  return { id: user.id, handle: user.handle };
}

export async function findUserByHandleOrEmail(login: string): Promise<User | undefined> {
  const store = await readStore();
  const needle = login.trim().toLowerCase();
  return store.users.find(
    (user) => user.handle.toLowerCase() === needle || user.email.toLowerCase() === needle
  );
}
