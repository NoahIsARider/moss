const domain = process.env.MOSS_DOMAIN ?? "localhost";
const baseUrl = process.env.MOSS_BASE_URL ?? "http://localhost:3000";
const codeUrl = process.env.MOSS_CODE_URL ?? "";

export const config = {
  domain,
  baseUrl,
  title: process.env.MOSS_TITLE ?? "moss",
  tagline: process.env.MOSS_TAGLINE ?? "one shell · any plugins · your own patch",
  description:
    process.env.MOSS_DESCRIPTION ??
    "A small, self-hostable community suite. One shell, pluggable services, one account, and a feed that works without an account.",
  established: process.env.MOSS_ESTABLISHED ?? "2026",
  demo: process.env.MOSS_DEMO === "1",
  news:
    process.env.MOSS_NEWS ??
    "This instance is live. Plugins can come and go; the shell stays the same.",
  codeUrl,
  repositoryUrl:
    process.env.MOSS_REPOSITORY_URL ??
    (codeUrl ? `${codeUrl}/moss/shell` : "https://example.com/moss/shell"),
  securityEmail: process.env.MOSS_SECURITY_EMAIL ?? `security@${domain}`,
  secret: process.env.MOSS_SECRET ?? "moss-development-secret-do-not-ship",
  sessionCookie: "moss_session",
  sessionDays: 30,
  forge: {
    baseUrl: process.env.FORGEJO_BASE_URL ?? "",
    token: process.env.FORGEJO_TOKEN ?? "",
    owner: process.env.FORGEJO_OWNER ?? ""
  },
  matrix: {
    homeserver: process.env.MATRIX_HOMESERVER_URL ?? "",
    token: process.env.MATRIX_ACCESS_TOKEN ?? "",
    room: process.env.MATRIX_ROOM_ID ?? ""
  },
  feeds: (process.env.MOSS_FEEDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
};

export function absolute(path: string): string {
  return `${config.baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
