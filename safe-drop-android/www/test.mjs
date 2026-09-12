import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const root=new URL("./",import.meta.url);
const html=fs.readFileSync(new URL("index.html",root),"utf8");
const css=fs.readFileSync(new URL("style.css",root),"utf8");
const js=fs.readFileSync(new URL("game.js",root),"utf8");
for(const asset of ["style.css","game.js","forus-logo.jpg","manifest.webmanifest"]){
  assert.ok(fs.existsSync(new URL(asset,root)),`missing ${asset}`);
  assert.ok(html.includes(asset),`HTML does not reference ${asset}`);
}
assert.match(html,/FORUS/);
assert.match(html,/GB 2894—2025/);
assert.match(css,/grid-template-columns:repeat\(8/);
assert.match(js,/const COLS=8, ROWS=16/);
assert.match(js,/const SCENES=\[/);
assert.match(js,/prohibit:/);
assert.match(js,/warning:/);
assert.match(js,/mandatory:/);
assert.match(js,/safe:/);
new vm.Script(js);

const sceneBlock=js.slice(js.indexOf("const SCENES=["),js.indexOf("const MENTORS=["));
assert.equal((sceneBlock.match(/name:/g)||[]).length,6,"expected six scenes");
assert.match(js,/for\(let i=0;i<18;i\+\+\)/);
console.log("安全落点静态检查通过：6场景、18关、四类标志、8×16棋盘、FORUS品牌资源完整。")
