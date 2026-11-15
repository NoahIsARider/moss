import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
fs.mkdirSync(".tmp", { recursive: true });
const data = fs.mkdtempSync(path.resolve(".tmp/browser-store-"));
const env = {
  ...process.env,
  MOSS_DIST_DIR: ".next-verification",
  MOSS_DATA_DIR: data,
  MOSS_BASE_URL: "http://127.0.0.1:3200",
  MOSS_DOMAIN: "127.0.0.1",
  MOSS_REPOSITORY_URL: "https://github.com/NoahIsARider/moss",
  MOSS_SECRET: "isolated-browser-verification-key",
  MOSS_DEMO: "1",
  FORGEJO_BASE_URL: "",
  FORGEJO_TOKEN: "",
  FORGEJO_OWNER: "",
  MATRIX_HOMESERVER_URL: "",
  MATRIX_ACCESS_TOKEN: "",
  MATRIX_ROOM_ID: "",
  MOSS_FEEDS: "",
  NEXT_TELEMETRY_DISABLED: "1",
};
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--port",
    "3200",
    "--hostname",
    "127.0.0.1",
  ],
  { env, stdio: "inherit" },
);
child.on("exit", (code) => process.exit(code || 0));
process.on("SIGTERM", () => child.kill());
process.on("SIGINT", () => child.kill());
