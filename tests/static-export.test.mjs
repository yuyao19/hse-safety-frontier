import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const prefix =
  process.env.GITHUB_ACTIONS === "true" &&
  repositoryName &&
  !repositoryName.endsWith(".github.io")
    ? `/${repositoryName}`
    : "";

test("static export contains the playable shell and PWA files", async () => {
  for (const file of [
    "out/index.html",
    "out/manifest.webmanifest",
    "out/sw.js",
    "out/assets/heroes.webp",
    "out/assets/hazards.webp",
    "out/assets/floor.webp",
    "out/icons/icon-192.png",
    "out/icons/icon-512.png"
  ]) await access(file);

  const html = await readFile("out/index.html", "utf8");
  for (const text of ["安全边界", "安禾", "永勋", "凌曜", "观微"])
    assert.ok(html.includes(text));
  assert.ok(html.includes(`href="${prefix}/manifest.webmanifest"`));
  assert.ok(html.includes(`url(${prefix}/assets/heroes.webp)`));
});

test("HTML script and stylesheet references resolve inside exported output", async () => {
  const html = await readFile("out/index.html", "utf8");
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((url) => url.startsWith(`${prefix}/`) && !url.startsWith("http"));
  assert.ok(references.length > 5);
  for (const reference of references) {
    const relative = reference.slice(prefix.length + 1);
    await access(`out/${relative}`);
  }
});
