import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("Capacitor packages the game locally with the intended Android identity", async () => {
  const config = await read("capacitor.config.ts");
  assert.match(config, /appId:\s*"com\.yuyao\.hsefrontier"/);
  assert.match(config, /appName:\s*"安全边界"/);
  assert.match(config, /webDir:\s*"out"/);

  const manifest = await read("android/app/src/main/AndroidManifest.xml");
  assert.match(manifest, /android:allowBackup="false"/);
  assert.match(manifest, /android\.permission\.INTERNET/);
});

test("native web bundle is complete and does not contain the GitHub Pages prefix", async () => {
  const root = "android/app/src/main/assets/public";
  for (const path of [
    `${root}/index.html`,
    `${root}/assets/heroes.webp`,
  ]) {
    assert.ok((await stat(path)).size > 0, `${path} should exist and be non-empty`);
  }
  assert.doesNotMatch(await read(`${root}/index.html`), /\/hse-safety-frontier\//);
});

test("APK workflow builds and verifies an installable artifact", async () => {
  const workflow = await read(".github/workflows/android-apk.yml");
  assert.match(workflow, /CAPACITOR_BUILD:\s*"true"/);
  assert.match(workflow, /\.\/gradlew assembleDebug/);
  assert.match(workflow, /apksigner/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /HSE-Risk-Link-v3\.0\.0-android-test\.apk/);
});
