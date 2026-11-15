import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("demo/out");
const base = process.env.PAGES_BASE_PATH ?? "/moss";
const port = Number(process.env.DEMO_PORT || 3300);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const route = decodeURIComponent(url.pathname);
      if (base && route !== base && !route.startsWith(base + "/")) {
        res.writeHead(404).end();
        return;
      }
      let name = route.slice(base.length) || "/";
      if (name.endsWith("/")) name += "index.html";
      let file = path.resolve(root, "." + name);
      if (!file.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      let data;
      try {
        data = await fs.readFile(file);
      } catch {
        if (!path.extname(file)) {
          data = await fs.readFile(path.join(file, "index.html"));
          file = path.join(file, "index.html");
        } else throw new Error("not found");
      }
      res.setHeader(
        "content-type",
        mime[path.extname(file)] || "application/octet-stream",
      );
      res.end(data);
    } catch {
      res.writeHead(404).end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log("Showcase: http://127.0.0.1:" + port + base + "/"),
  );
