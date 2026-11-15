import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
async function isolatedStore() {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "moss-store-"));
  const source = await fs.readFile("lib/store.ts", "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  await fs.writeFile(path.join(temp, "store.mjs"), compiled);
  const prev = process.env.MOSS_DATA_DIR;
  process.env.MOSS_DATA_DIR = path.join(temp, "data");
  let store;
  try {
    store = await import(pathToFileURL(path.join(temp, "store.mjs")).href);
  } finally {
    if (prev === undefined) delete process.env.MOSS_DATA_DIR;
    else process.env.MOSS_DATA_DIR = prev;
  }
  return {
    store,
    temp,
    data: path.join(temp, "data/moss.json"),
    cleanup: () => fs.rm(temp, { recursive: true, force: true }),
  };
}
test("production starts empty even with the former demo flag enabled", async () => {
  process.env.MOSS_DEMO = "1";
  const { store, cleanup } = await isolatedStore();
  try {
    const data = await store.readStore();
    assert.deepEqual(data.users, []);
    assert.deepEqual(data.threads, []);
    assert.deepEqual(data.chat, []);
    assert.deepEqual(data.posts, []);
    assert.equal(data.meta.seeded, false);
  } finally {
    delete process.env.MOSS_DEMO;
    await cleanup();
  }
});
test("concurrent mutations preserve every write and legacy records", async () => {
  const { store, cleanup } = await isolatedStore();
  try {
    await store.updateStore((s) => {
      s.threads.push({ id: "existing", title: "Actual community data" });
    });
    await Promise.all(
      Array.from({ length: 30 }, (_, i) =>
        store.updateStore((s) => {
          s.posts.push({ id: String(i) });
        }),
      ),
    );
    const data = await store.readStore();
    assert.equal(data.posts.length, 30);
    assert.equal(data.threads[0].id, "existing");
  } finally {
    await cleanup();
  }
});
test("corrupt data is reported without overwriting the original", async () => {
  const { store, data, cleanup } = await isolatedStore();
  try {
    await fs.mkdir(path.dirname(data), { recursive: true });
    await fs.writeFile(data, "{broken actual data");
    await assert.rejects(() => store.readStore(), SyntaxError);
    assert.equal(await fs.readFile(data, "utf8"), "{broken actual data");
  } finally {
    await cleanup();
  }
});
test("production sources cannot import showcase fixtures or seed flags", async () => {
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (/\.[tj]sx?$/.test(file)) {
        const text = await fs.readFile(file, "utf8");
        assert.doesNotMatch(
          text,
          /from\s+["'][^"']*(?:demo\/|demo-data|examples\/)/,
          file,
        );
        assert.doesNotMatch(text, /config\.demo|process\.env\.MOSS_DEMO/, file);
      }
    }
  }
  for (const dir of ["app", "lib", "components"]) await walk(dir);
});

test("parallel initial reads share one empty store without racing", async () => {
  const { store, cleanup } = await isolatedStore();
  try {
    const values = await Promise.all(
      Array.from({ length: 30 }, () => store.readStore()),
    );
    assert.equal(new Set(values.map((s) => s.meta.createdAt)).size, 1);
    assert.ok(values.every((s) => !s.users.length && !s.threads.length));
  } finally {
    await cleanup();
  }
});
