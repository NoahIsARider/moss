import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { WebSocketServer } from "ws";

const port = Number(process.env.CHAT_BRIDGE_PORT ?? 8787);
const file = path.join(process.cwd(), ".data", "moss.json");

let lastTimestamp = new Date().toISOString();
const seen = new Set();
let writing = Promise.resolve();

async function readStore() {
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

async function writeStore(store) {
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, file);
}

function cleanHandle(value) {
  return String(value ?? "")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 20);
}

const server = new WebSocketServer({ port });
const clients = new Set();

console.log(`moss chat bridge listening on ws://localhost:${port}`);
console.log(`store: ${file}`);

server.on("connection", async (socket, request) => {
  const url = new URL(request.url ?? "/", `http://localhost:${port}`);
  const handle = cleanHandle(url.searchParams.get("as")) || "guest";
  clients.add(socket);
  console.log(`+ ${handle} (${clients.size} connected)`);

  try {
    const store = await readStore();
    const recent = store.chat.slice(-20);
    socket.send(JSON.stringify({ type: "history", messages: recent }));
  } catch {
    socket.send(JSON.stringify({ type: "history", messages: [] }));
  }

  socket.on("message", async (buffer) => {
    let body = "";
    try {
      const parsed = JSON.parse(buffer.toString());
      body = typeof parsed.body === "string" ? parsed.body : "";
    } catch {
      body = buffer.toString();
    }
    body = body.trim();
    if (!body || body.length > 2000) {
      socket.send(JSON.stringify({ type: "error", error: "body must be 1 to 2000 characters" }));
      return;
    }

    writing = writing.then(async () => {
      const store = await readStore();
      const created = {
        id: crypto.randomUUID(),
        author: `@${handle}`,
        body,
        createdAt: new Date().toISOString(),
        transport: "moss"
      };
      store.chat.push(created);
      if (store.chat.length > 500) store.chat = store.chat.slice(-500);
      await writeStore(store);
      seen.add(created.id);
      broadcast(created);
    }).catch(() => undefined);
  });

  socket.on("close", () => {
    clients.delete(socket);
    console.log(`- ${handle} (${clients.size} connected)`);
  });
});

function broadcast(message) {
  const payload = JSON.stringify({ type: "message", message });
  for (const client of clients) {
    if (client.readyState === 1) client.send(payload);
  }
}

setInterval(async () => {
  try {
    const store = await readStore();
    for (const message of store.chat) {
      if (message.createdAt <= lastTimestamp) continue;
      if (seen.has(message.id)) continue;
      seen.add(message.id);
      broadcast(message);
    }
    if (store.chat.length > 0) {
      lastTimestamp = store.chat[store.chat.length - 1].createdAt;
    }
  } catch {
    /* store missing, wait for the app to seed it */
  }
}, 1500);
