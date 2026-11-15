import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";
export async function saveImage(file: File, avatar = false): Promise<string> {
  if (
    file.size > 5 * 1024 * 1024 ||
    !["image/png", "image/jpeg", "image/webp"].includes(file.type)
  )
    throw new Error("Use a PNG, JPEG or WebP up to 5 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  let image = sharp(bytes, { limitInputPixels: 20_000_000 }).rotate();
  const meta = await image.metadata();
  if (!["png", "jpeg", "webp"].includes(meta.format || ""))
    throw new Error("Unsupported image");
  image = avatar
    ? image.resize(256, 256, { fit: "cover" })
    : image.resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      });
  const buffer = await image.webp({ quality: 86 }).toBuffer();
  const folder = path.resolve(process.env.MOSS_DATA_DIR || ".data", "uploads");
  await fs.mkdir(folder, { recursive: true });
  const name = crypto.randomUUID() + ".webp";
  await fs.writeFile(path.join(folder, name), buffer);
  return "/media/" + name;
}
