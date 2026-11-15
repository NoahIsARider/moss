import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
const demo = path.join(root, "demo");
const base = process.env.PAGES_BASE_PATH ?? "/moss";
if (base !== "" && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(base))
  throw new Error("Invalid PAGES_BASE_PATH");
await fs.mkdir(path.join(demo, "public/assets"), { recursive: true });
await fs.cp(
  path.join(root, "public/assets/fonts"),
  path.join(demo, "public/assets/fonts"),
  { recursive: true },
);
await fs.mkdir(path.join(demo, "public/assets/img"), { recursive: true });
for (const file of [
  "mark.webp",
  "default-avatars.webp",
  "default-avatars-2.webp",
  "default-avatars-3.webp",
  "default-avatars-4.webp",
  "background-rooftop.webp",
  "background-plaza.webp",
  "background-riverside.webp",
  "background-nightmarket.webp",
  "neighborhood.webp",
])
  await fs.copyFile(
    path.join(root, "public/assets/img", file),
    path.join(demo, "public/assets/img", file),
  );
const css = await fs.readFile(path.join(root, "app/globals.css"), "utf8");
await fs.writeFile(
  path.join(demo, "app/theme.css"),
  css.replaceAll('"/assets/', '"' + base + "/assets/"),
);
if (!process.argv.includes("--prepare")) {
  const env = {
    ...process.env,
    PAGES_BASE_PATH: base,
    NEXT_TELEMETRY_DISABLED: "1",
  };
  for (const key of Object.keys(env))
    if (/^(MOSS_|FORGEJO_|MATRIX_)/.test(key)) delete env[key];
  const result = spawnSync(
    process.execPath,
    [path.join(root, "node_modules/next/dist/bin/next"), "build", demo],
    { cwd: root, env, stdio: "inherit" },
  );
  if (result.status !== 0) process.exit(result.status || 1);
  await fs.writeFile(path.join(demo, "out/.nojekyll"), "");
  console.log("Static showcase ready: demo/out");
}
