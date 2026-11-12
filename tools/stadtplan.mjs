// The city's plan as pictures, one a level: docs/plan/index.html (the data docs/plan/stadtplan.js, the ways from the game
// docs/plan/uebergaenge.js, drawn by docs/plan/plan.js) in a headless Chrome, its canvas saved as docs/plan/stadtplan_<level>.png.
// Run tools/stadtplan-links.mjs first when the game's ways have changed.
//   node tools/stadtplan.mjs [--scale 1]
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { launch, sleep } from "../lib/cutaway/tools/lib/chrome.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const scale = Number(arg("--scale", "1"));
const chrome = await launch({ width: 1200, height: 800 });
try {
  await chrome.send("Page.navigate", { url: pathToFileURL(resolve("docs/plan/index.html")).href + "?scale=" + scale });
  const until = Date.now() + 10000;
  while (!(await chrome.ev("document.readyState === 'complete' && !!window.PlanDraw"))) {
    if (Date.now() > until) throw new Error("the plan's page didn't load: " + chrome.errors.join(" | "));
    await sleep(50);
  }
  if (chrome.errors.length) throw new Error(chrome.errors.join(" | "));
  const levels = await chrome.ev("STADTPLAN.levels.map((l) => l.id)");
  for (const level of levels) {
    const url = await chrome.ev(`(PlanDraw.draw(document.getElementById('plan'), STADTPLAN, { level: ${JSON.stringify(level)}, scale: ${scale} }), document.getElementById('plan').toDataURL('image/png'))`);
    const out = `docs/plan/stadtplan_${level}.png`;
    writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
    console.log("wrote " + out);
  }
  const probs = await chrome.ev("PlanDraw.problems(STADTPLAN).map((p) => p.n + '. ' + p.text)");
  console.log(probs.length ? "does not fit:\n  " + probs.join("\n  ") : "everything fits");
} finally {
  await chrome.close?.();
}
