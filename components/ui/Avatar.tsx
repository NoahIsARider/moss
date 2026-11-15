import { AVATAR_COUNT, avatarSheets } from "@/lib/avatars";
import type { CSSProperties } from "react";
import { asset, avatarIndex } from "@/lib/assets";
export function Avatar({
  handle,
  index,
  size = 54,
  url,
}: {
  handle: string;
  index?: number;
  size?: number;
  url?: string;
}) {
  if (url)
    return (
      <img
        className="avatar"
        src={url}
        alt={handle + " avatar"}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "cover" }}
      />
    );
  const n =
    Number.isInteger(index) && index! >= 0 && index! < AVATAR_COUNT
      ? index!
      : avatarIndex(handle);
  return (
    <span
      role="img"
      aria-label={handle + " avatar"}
      className="avatar"
      style={
        {
          width: size,
          height: size,
          backgroundImage: `url("${asset(avatarSheets[Math.floor(n / 8)])}")`,
          backgroundPosition: `${((n % 4) * 100) / 3}% ${Math.floor((n % 8) / 4) * 100}%`,
        } as CSSProperties
      }
    />
  );
}
