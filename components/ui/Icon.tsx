import type { CSSProperties } from "react";
const paths: Record<string, string> = {
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  bookmark: "M6 3h12v18l-6-4-6 4Z",
  repost: "m16 3 4 4-4 4M4 11V7h16M8 21l-4-4 4-4m12 0v4H4",
  share: "M12 16V3m-5 5 5-5 5 5M4 14v7h16v-7",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  timeline: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16",
  chat: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z",
  commons: "M12 7s-4-4-9-2v15c5-2 9 2 9 2m0-15s4-4 9-2v15c-5-2-9 2-9 2Zm0 0v15",
  account: "M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  docs: "M14 2H5v20h14V7Zm0 0v5h5M8 12h8M8 16h6",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  repo: "M5 3h14v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v14h14M5 17a2 2 0 0 0 0 4",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z",
  fork: "M6 3v5a6 6 0 0 0 6 6m6-11v5a6 6 0 0 1-6 6v7",
  feed: "M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M4 20h.01",
  plus: "M12 5v14M5 12h14",
  logout: "M9 4H4v16h5m6-13 5 5-5 5m-6-5h11",
};
export function Icon({
  name,
  size = 22,
  style,
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name] || paths.docs} />
    </svg>
  );
}
