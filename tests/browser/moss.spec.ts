import { test, expect, type Page } from "@playwright/test";
import path from "node:path";
async function signup(page: Page, handle: string) {
  await page.goto("/join");
  await page.getByLabel("handle", { exact: true }).fill(handle);
  await page
    .getByLabel("email", { exact: true })
    .fill(handle + "@example.test");
  await page
    .getByLabel("password", { exact: true })
    .fill("moss-browser-check-42");
  await page
    .getByRole("button", { name: "create handle", exact: true })
    .click();
  await expect(page).toHaveURL(/\/home$/);
}
test("production starts empty, exposes real empty states and fits desktop/mobile", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("The neighborhood starts with you"),
  ).toBeVisible();
  await expect(page.locator(".hero-note")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(
    "hosting costs, november",
  );
  for (const route of [
    "/",
    "/code",
    "/timeline",
    "/chat",
    "/community",
    "/docs",
    "/avatars",
    "/appearance",
    "/login",
    "/join",
  ]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await page.screenshot({
      path: path.join(
        ".screenshots",
        "production-" + (route.slice(1) || "home") + ".png",
      ),
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.screenshot({
      path: path.join(
        ".screenshots",
        "mobile-" + (route.slice(1) || "home") + ".png",
      ),
      fullPage: true,
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  const unauth = await page.request.post("/api/social", {
    data: { action: "like", id: "missing" },
  });
  expect(unauth.status()).toBe(401);
});
test("accounts, avatar, image posts, likes, bookmarks, replies, follows, notifications and chat persist", async ({
  page,
  browser,
}) => {
  test.setTimeout(120000);
  const handle = "ira";
  await signup(page, handle);
  await page.goto("/avatars");
  await page.locator('input[name="avatar"][value="31"]').check();
  await page.getByRole("button", { name: "Save avatar", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.reload();
  await expect(page.locator('input[name="avatar"][value="31"]')).toBeChecked();
  await page
    .locator("#avatar-image")
    .setInputFiles("public/assets/img/mark.webp");
  await Promise.all([
    page.waitForResponse(
      (r) => r.request().method() === "POST" && r.url().includes("/avatars"),
    ),
    page.getByRole("button", { name: "Upload avatar" }).click(),
  ]);
  await expect(page.getByRole("status")).toContainText("saved");
  await page.goto("/home");
  await expect(page.locator(".account-avatar img")).toHaveAttribute(
    "src",
    /^\/media\//,
  );
  await page.goto("/avatars");
  await page.locator('input[name="avatar"][value="0"]').check();
  await Promise.all([
    page.waitForResponse(
      (r) => r.request().method() === "POST" && r.url().includes("/avatars"),
    ),
    page.getByRole("button", { name: "Save avatar", exact: true }).click(),
  ]);
  await page.goto("/timeline");
  await page
    .locator("#post-body")
    .fill("Took the long way home. The trees are doing their thing again.");
  await page.getByText("Attach an image", { exact: true }).click();
  await page
    .locator("#post-image")
    .setInputFiles("public/assets/img/background-rooftop.webp");
  await page.locator("#image-alt").fill("Neighbors in a rooftop garden");
  await page.getByRole("button", { name: "Post", exact: true }).click();
  await expect(page.locator(".feed-post").first()).toContainText(
    "Took the long way home",
  );
  await expect(page.locator(".post-image").first()).toHaveAttribute(
    "src",
    /^\/media\//,
  );
  const postHref = await page
    .locator(".feed-post .post-open")
    .first()
    .getAttribute("href");
  expect(postHref).toMatch(/^\/post\//);
  await page.getByRole("button", { name: "Like", exact: true }).first().click();
  await expect(
    page.getByRole("button", { name: "Like", exact: true }).first(),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Bookmark", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Bookmark", exact: true }).first(),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Repost", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Repost", exact: true }).first(),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Like", exact: true }).first(),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/bookmarks");
  await expect(page.locator(".feed-post")).toContainText(
    "Took the long way home",
  );
  await page.goto(postHref!);
  await page
    .locator("#reply-body")
    .fill("The light up there is lovely. See you at the market on Sunday?");
  await page.getByRole("button", { name: "Post reply", exact: true }).click();
  await expect(page.locator(".reply")).toContainText("The light up there");
  await page.reload();
  await expect(page.locator(".reply")).toContainText("The light up there");
  await page.goto("/community/new");
  await page
    .getByLabel("title", { exact: true })
    .fill("Weekend photo walk — riverside and old rail line");
  await page
    .getByLabel("body", { exact: true })
    .fill(
      "A few of us are taking the long way home this Saturday. Bring a camera, or just yourself. We will meet by the footbridge at ten.",
    );
  await page.getByRole("button", { name: "post thread", exact: true }).click();
  await expect(page.locator("main h2").first()).toContainText(
    "Weekend photo walk — riverside and old rail line",
  );
  await page
    .locator("#reply-body")
    .fill("I will bring my old film camera. Looking forward to it!");
  await page.getByRole("button", { name: "post reply", exact: true }).click();
  await expect(page.locator(".reply")).toContainText(
    "I will bring my old film camera. Looking forward to it!",
  );
  const secondContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3200",
  });
  const second = await secondContext.newPage();
  const other = "juniper";
  await signup(second, other);
  await second.goto("/people/" + handle);
  await second
    .getByRole("button", { name: "Follow", exact: true })
    .first()
    .click();
  await expect(
    second.getByRole("button", { name: "Following", exact: true }).first(),
  ).toHaveAttribute("aria-pressed", "true");
  await second.goto("/timeline?view=following");
  await expect(second.locator(".feed-post")).toContainText([
    "Took the long way home",
  ]);
  await second
    .getByRole("button", { name: "Like", exact: true })
    .first()
    .click();
  await expect(
    second.getByRole("button", { name: "Like", exact: true }).first(),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/notifications");
  await expect(page.locator(".notification-row")).toContainText([other, other]);
  await page.goto("/chat");
  await second.goto("/chat");
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill(
      "Anyone heading down to the market later? I could use some tomatoes and a good book.",
    );
  await page.getByRole("button", { name: "send", exact: true }).click();
  await expect(second.locator(".chat-log")).toContainText(
    "Anyone heading down to the market later? I could use some tomatoes and a good book.",
  );
  const reviewRoutes: [string, string][] = [
    ["timeline", "/timeline"],
    ["chat", "/chat"],
    ["commons", "/community"],
    [
      "thread",
      await page
        .locator("a[href]")
        .evaluateAll(
          () => "/community/weekend-photo-walk-riverside-and-old-rail-line",
        ),
    ],
    ["new-thread", "/community/new"],
    ["profile", "/people/" + handle],
    ["account", "/home"],
    ["explore", "/explore"],
    ["bookmarks", "/bookmarks"],
    ["notifications", "/notifications"],
    ["post", postHref!],
    ["avatars", "/avatars"],
    ["appearance", "/appearance"],
  ];
  for (const [name, route] of reviewRoutes) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await page.screenshot({
      path: path.join(".screenshots", "review-" + name + ".png"),
      fullPage: true,
    });
  }
  await secondContext.close();
  await page.goto("/home");
  await page.getByRole("button", { name: "sign out", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3200/");
  await page.goto("/login");
  await page.getByLabel("handle or email").fill(handle);
  await page
    .getByLabel("password", { exact: true })
    .fill("moss-browser-check-42");
  await page.getByRole("button", { name: "sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
});
test("static showcase search, filtering, scenery, avatar and local posting work under /moss", async ({
  page,
}) => {
  test.setTimeout(90000);
  const root = "http://127.0.0.1:3300/moss";
  await page.goto(root + "/code/");
  await page
    .getByRole("searchbox", { name: "Search repositories" })
    .fill("birdbook");
  await expect(page.locator(".repo-row")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "Search repositories" }).fill("");
  await page.getByRole("button", { name: "Python 1", exact: true }).click();
  await expect(page.locator(".repo-row")).toHaveCount(1);
  await expect(page.locator(".repo-row")).toContainText("field-notes");
  await page.goto(root + "/appearance/");
  await page.getByRole("button", { name: /One more stop/ }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.goto(root + "/");
  await expect(page.locator(".home-hero")).toHaveAttribute(
    "style",
    /nightmarket/,
  );
  await page.goto(root + "/avatars/");
  await page.locator('input[name="avatar"][value="6"]').check();
  await page.getByRole("button", { name: "Save demo avatar" }).click();
  await page.reload();
  await expect(page.locator('input[name="avatar"][value="6"]')).toBeChecked();
  await page.goto(root + "/timeline/");
  await page.locator("#demo-post").fill("A browser-only demo post.");
  await page.getByRole("button", { name: "Post", exact: true }).click();
  await expect(page.locator(".feed-post").first()).toContainText(
    "A browser-only demo post.",
  );
  await page.reload();
  await expect(page.locator(".feed-post").first()).toContainText(
    "A browser-only demo post.",
  );
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.removeItem("moss-background");
  });
  for (const route of [
    "",
    "code/",
    "timeline/",
    "chat/",
    "community/",
    "docs/",
  ]) {
    await page.goto(root + "/" + route);
    await page.screenshot({
      path: path.join(
        "docs/screenshots",
        (route.replace("/", "") || "home") + ".png",
      ),
      fullPage: true,
    });
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors
          .map((a) => (a as HTMLAnchorElement).href)
          .filter((h) => h.startsWith("http://127.0.0.1:3300")),
      );
    for (const href of new Set(links)) {
      const response = await page.request.get(href);
      expect(response.status(), href).toBeLessThan(400);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
});
