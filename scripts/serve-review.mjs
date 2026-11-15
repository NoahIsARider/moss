import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("docs");
const types = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
};
http
  .createServer(async (req, res) => {
    try {
      let name = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (name === "/") name = "/preview/";
      if (name.endsWith("/")) name += "index.html";
      const file = path.resolve(root, "." + name);
      if (!file.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      const body = await fs.readFile(file);
      res.setHeader(
        "content-type",
        types[path.extname(file)] || "application/octet-stream",
      );
      res.end(body);
    } catch {
      res.writeHead(404).end("Not found");
    }
  })
  .listen(3400, "127.0.0.1", () =>
    console.log("All-page review: http://127.0.0.1:3400/preview/"),
  );
