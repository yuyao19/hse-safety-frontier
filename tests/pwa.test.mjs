import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("PWA manifest is installable and keeps URLs repository-relative", async () => {
  const manifest = JSON.parse(await readFile("public/manifest.webmanifest", "utf8"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.orientation, "landscape");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  for (const icon of manifest.icons) assert.match(icon.src, /^\.\//);
});

test("service worker caches the shell and all three game atlases", async () => {
  const worker = await readFile("public/sw.js", "utf8");
  for (const asset of ["heroes.webp", "hazards.webp", "floor.webp", "manifest.webmanifest"])
    assert.ok(worker.includes(asset));
  assert.match(worker, /html\.matchAll/);
  assert.match(worker, /registration\.scope/);
  assert.match(worker, /mode === "navigate"/);
  assert.match(worker, /caches\.match/);
});
