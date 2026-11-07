import { absolute, config } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const body = [
    "# Security contact for this moss instance",
    "",
    `Contact: mailto:${config.securityEmail}`,
    `Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}`,
    `Canonical: ${absolute("/.well-known/security.txt")}`,
    `Policy: ${absolute("/docs#privacy")}`,
    "Preferred-Languages: en",
    "",
    `# Instance: ${config.domain}`,
    "# Scope: the shell, every plugin, and the chat bridge",
    ""
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}
