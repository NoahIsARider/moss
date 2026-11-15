import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const root = (process.env.SHOWCASE_URL || "http://127.0.0.1:3300/moss").replace(
  /\/$/,
  "",
);
const browser = await chromium.launch({
  channel: process.env.CI ? undefined : "msedge",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await fs.mkdir("docs/screenshots", { recursive: true });
for (const [name, route, fullPage] of [
  ["home", "/", true],
  ["timeline", "/timeline/", true],
  ["code", "/code/", true],
  ["commons", "/community/", true],
  ["chat", "/chat/", true],
  ["avatars", "/avatars/", false],
  ["appearance", "/appearance/", false],
]) {
  const response = await page.goto(root + route);
  if (response.status() !== 200) throw new Error("Cannot capture " + route);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.images].every((img) => img.complete && img.naturalWidth),
  );
  await page.screenshot({
    path: "docs/screenshots/" + name + "-neighborhood.png",
    fullPage,
  });
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(root + "/timeline/");
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: "docs/screenshots/mobile-neighborhood.png",
  fullPage: true,
});
await browser.close();
console.log("Captured 8 current showcase screenshots.");
