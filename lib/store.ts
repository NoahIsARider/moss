import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { StoreShape } from "./types";
const dataDir = path.resolve(
  process.env.MOSS_DATA_DIR || path.join(process.cwd(), ".data"),
);
const dataFile = path.join(dataDir, "moss.json");
const runtime = globalThis as typeof globalThis & {
  __mossStoreQueues?: Map<string, Promise<unknown>>;
};
const queues = (runtime.__mossStoreQueues ??= new Map());
function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const work = (queues.get(dataFile) || Promise.resolve()).then(operation);
  queues.set(
    dataFile,
    work.catch(() => undefined),
  );
  return work;
}
function freshStore(): StoreShape {
  return {
    users: [],
    threads: [],
    chat: [],
    posts: [],
    meta: { createdAt: new Date().toISOString(), seeded: false },
  };
}
async function readRaw(): Promise<StoreShape> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const store = JSON.parse(raw) as StoreShape;
    if (
      !Array.isArray(store.users) ||
      !Array.isArray(store.threads) ||
      !Array.isArray(store.chat)
    )
      throw new Error("Invalid moss store shape");
    return store;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const store = freshStore();
    await writeRaw(store);
    return store;
  }
}
async function writeRaw(store: StoreShape): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  const tmp = dataFile + "." + process.pid + "." + crypto.randomUUID() + ".tmp";
  try {
    await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
    await fs.rename(tmp, dataFile);
  } finally {
    await fs.rm(tmp, { force: true });
  }
}
export function readStore(): Promise<StoreShape> {
  return enqueue(readRaw);
}
export function updateStore<T>(
  mutator: (store: StoreShape) => T | Promise<T>,
): Promise<T> {
  return enqueue(async () => {
    const store = await readRaw();
    const result = await mutator(store);
    await writeRaw(store);
    return result;
  });
}
export function resetStoreForTests(): Promise<void> {
  return enqueue(() => writeRaw(freshStore()));
}
