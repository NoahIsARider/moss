import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 60000,
  expect: { timeout: 15000 },
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:3200",
    headless: true,
    channel: process.env.CI ? undefined : "msedge",
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
  },
  outputDir: ".tmp/playwright-results",
  webServer: [
    {
      command: "node scripts/start-verification.mjs",
      url: "http://127.0.0.1:3200",
      timeout: 120000,
      reuseExistingServer: false,
    },
    {
      command: "node scripts/serve-demo.mjs",
      url: "http://127.0.0.1:3300/moss/",
      reuseExistingServer: !process.env.CI,
    },
  ],
  reporter: "list",
});
