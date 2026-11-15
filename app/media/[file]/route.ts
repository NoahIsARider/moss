import fs from "node:fs/promises";
import path from "node:path";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(file))
    return new Response("Not found", { status: 404 });
  try {
    const folder = path.resolve(
      process.env.MOSS_DATA_DIR || ".data",
      "uploads",
    );
    const bytes = await fs.readFile(path.join(folder, file));
    return new Response(bytes, {
      headers: {
        "content-type": "image/webp",
        "x-content-type-options": "nosniff",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
