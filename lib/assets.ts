import { AVATAR_COUNT } from "./avatars";
export const asset = (path: string) =>
  (process.env.NEXT_PUBLIC_BASE_PATH || "") + path;
export function avatarIndex(handle: string): number {
  let hash = 0;
  for (const char of handle.replace(/^@/, "").toLowerCase())
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % AVATAR_COUNT;
}
