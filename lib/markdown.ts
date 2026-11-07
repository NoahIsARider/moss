const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

const ALLOWED_LINK = /^(https?:\/\/|\/|mailto:)/i;

export function renderMarkdown(input: string): string {
  const escaped = escapeHtml(input.trim());
  const withLinks = escaped.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, href: string) => {
    if (!ALLOWED_LINK.test(href)) return match;
    return `<a href="${href}" rel="nofollow noopener">${label}</a>`;
  });
  const withEmphasis = withLinks
    .replace(/(^|\s)\*([^*\n]+)\*/g, "$1<strong>$2</strong>")
    .replace(/(^|\s)_([^_\n]+)_/g, "$1<em>$2</em>");

  return withEmphasis
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trimEnd());
      const isList = lines.every((line) => line.startsWith("- ") || line === "");
      if (isList) {
        const items = lines
          .filter((line) => line.startsWith("- "))
          .map((line) => `<li>${line.slice(2)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${lines.join("<br>")}</p>`;
    })
    .join("\n");
}
