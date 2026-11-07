import { promises as fs } from "node:fs";
import path from "node:path";
import { demoChat, demoThreads } from "../examples/demo-data";
import { config } from "./config";
import type { StoreShape } from "./types";

const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "moss.json");

let queue: Promise<unknown> = Promise.resolve();

function freshStore(): StoreShape {
  return {
    users: [],
    threads: config.demo ? demoThreads : [],
    chat: config.demo ? demoChat : [],
    meta: { createdAt: new Date().toISOString(), seeded: config.demo }
  };
}

async function readRaw(): Promise<StoreShape> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as StoreShape;
  } catch {
    const seeded = freshStore();
    await writeRaw(seeded);
    return seeded;
  }
}

async function writeRaw(store: StoreShape): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  const tmp = `${dataFile}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, dataFile);
}

export async function readStore(): Promise<StoreShape> {
  await queue;
  return readRaw();
}

export function updateStore<T>(mutator: (store: StoreShape) => T | Promise<T>): Promise<T> {
  const work = queue.then(async () => {
    const store = await readRaw();
    const result = await mutator(store);
    await writeRaw(store);
    return result;
  });
  queue = work.catch(() => undefined);
  return work;
}

export async function resetStoreForTests(): Promise<void> {
  await writeRaw(freshStore());
}
