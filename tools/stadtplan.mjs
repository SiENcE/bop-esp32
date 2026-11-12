// The city's plan as a picture: docs/plan/index.html (the data docs/plan/stadtplan.js, drawn by docs/plan/plan.js) in a
// headless Chrome, its canvas saved as docs/plan/stadtplan.png.
//   node tools/stadtplan.mjs [--scale 1] [--out docs/plan/stadtplan.png]
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { launch, sleep } from "../lib/cutaway/tools/lib/chrome.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const scale = Number(arg("--scale", "1")), out = arg("--out", "docs/plan/stadtplan.png");
const chrome = await launch({ width: 1200, height: 800 });
try {
  await chrome.send("Page.navigate", { url: pathToFileURL(resolve("docs/plan/index.html")).href + "?scale=" + scale });
  const until = Date.now() + 10000;
  while (!(await chrome.ev("document.readyState === 'complete' && !!window.PlanDraw"))) {
    if (Date.now() > until) throw new Error("the plan's page didn't load: " + chrome.errors.join(" | "));
    await sleep(50);
  }
  if (chrome.errors.length) throw new Error(chrome.errors.join(" | "));
  const url = await chrome.ev("document.getElementById('plan').toDataURL('image/png')");
  writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
  console.log("wrote " + out);
} finally {
  await chrome.close?.();
}
