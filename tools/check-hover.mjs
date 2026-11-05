// What is under the mouse: the pointer turns hot and names it. play.mjs clicks by hotspot, so it can't see this go wrong:
// a UI layer whose hover() answers null everywhere makes nothing hot, and every click still works.
//   node tools/check-hover.mjs
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { launch, sleep } from "../lib/cutaway/tools/lib/chrome.mjs";

const chrome = await launch({ width: 960, height: 540 });
let failed = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : "  — " + detail}`); if (!ok) failed++; };

/** Lines and boot scripts go by with clicks on an empty spot. */
async function settle() {
  for (let i = 0; i < 80 && (await chrome.ev("Cutaway.script.busy || !Cutaway.scene.room")); i++) { await chrome.mouse("click", 160, 90); await sleep(150); }
}
/** What is hot with the mouse at a point (the hover is read as the frame is drawn). @param {number} x @param {number} y */
async function hotAt(x, y) {
  await chrome.mouse("move", x, y);
  await sleep(200);
  return chrome.ev("Cutaway.ui.hover ? Cutaway.ui.hover.id : null");
}
/** @param {string} room @param {string} id */
async function hot(room, id) {
  const p = await chrome.ev(`Cutaway.debug.pointOn(${JSON.stringify(id)})`);
  if (!p) return check(`${room}: ${id}`, false, "nothing to point at");
  const got = await hotAt(p.x, p.y);
  check(`${room}: ${id} is hot`, got === id, `hot: ${got}`);
}

try {
  await chrome.open(pathToFileURL(resolve("index.html")).href + "?nointro&act=kapitel1");
  await settle();
  await hot("flat", "deck");
  await hot("flat", "fridge");
  await chrome.ev("Cutaway.scene.load('deck'), 0");
  await sleep(1200);
  await settle();
  await hot("deck", "app_glas");
  await chrome.ev("Cutaway.scene.load('cam03'), 0");
  await sleep(1200);
  await settle();
  await hot("cam03", "back");
} finally {
  await chrome.close();
}
console.log(failed ? `${failed} failed` : "all passed");
process.exitCode = failed ? 1 : 0;
