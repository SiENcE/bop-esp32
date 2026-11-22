// Where hotspots take clicks from the floor (the user, 2026-11-09: a rect is only right for a thing that is a rect; anything else is a
// poly, so it never covers floor one can see, nor another hotspot). For every room: each hotspot's shape (rect, poly, or the prop's
// box), how much of the floor one can SEE it covers (floor not hidden behind a drawn prop: a click there should walk), and how much of
// it lies under another hotspot. A picture per room with the overlay: hotspots outlined orange, floor taken from clicks red, two
// hotspots over each other yellow.
//   node tools/hotspot-audit.mjs [room ...]      -> build/hotspots/report.txt, build/hotspots/<room>.png (3x; a room bigger than the
//                                                   screen whole, as big as fits 960 px)
// The game is at Chapter 1's second evening, 22:00; a hotspot with an `if` shows as that state has it.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";
import { launch, sleep } from "../lib/cutaway/tools/lib/chrome.mjs";

const OUT = "build/hotspots";
mkdirSync(OUT, { recursive: true });
const chrome = await launch({ width: 960, height: 540 });

/** Runs in the page: the numbers for the room that is loaded, and its picture with the overlay as a data URL. */
const MEASURE = () => {
  // the whole room, not only the screen: a room with a size scrolls (the gasse, the Drain Market from above)
  const r = Cutaway.scene.room, [W, H] = r.size ?? [320, 180], map = Cutaway.scene.walkMap, cam = Cutaway.scene.camera;
  const skip = /^(thumb_|rec$|wait$|back$|rewind$|win_|app_|close$)/;
  const hs = Cutaway.scene.hotspots().filter((h) => !h.actor && !skip.test(h.id));
  // what the props hide: their drawn pixels, frame 0, in a mask the size of the room
  const mask = document.createElement("canvas"); mask.width = W; mask.height = H;
  const m = mask.getContext("2d");
  for (const p of r.props ?? []) {
    if (Cutaway.state.isHidden(p.id ?? "", !!p.hidden) || !Cutaway.state.test(p.if) || (p.alpha ?? 1) < 0.5) continue;
    if ((p.baseline ?? 1) <= 0) continue;                // a part of the picture behind everyone (a painted room's moving bits): it hides nothing
    const box = Cutaway.scene.propBox(p); if (!box) continue;
    Cutaway.assets.draw(m, p.image, box[0] + (p.flip ? box[2] - 1 : 0), box[1], { anchor: [p.flip ? box[2] - 1 : 0, 0], frame: 0, flip: p.flip });
  }
  // what hangs over the people hides the floor under it too (a room from above: the noodle bar's awning, the 24-hour shop's canopy)
  const fore = (r.foreground ?? []).filter((f) => f.image && f.at && Cutaway.state.test(f.if));
  for (const f of fore) Cutaway.assets.draw(m, f.image, f.at[0], f.at[1], { anchor: [0, 0], frame: 0 });
  const hidden = m.getImageData(0, 0, W, H).data;
  const stat = Object.fromEntries(hs.map((h) => [h.id, { shape: h.def.poly ? "poly" : h.def.rect ? "rect" : "box", area: 0, floor: 0, under: 0 }]));
  const order = (h, i) => (h.def.z ?? 0) * 1e4 + i;
  let seen = 0, taken = 0;
  const marks = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = { x: x + 0.5, y: y + 0.5 }, inside = [];
    hs.forEach((h, i) => { if (Cutaway.walk.inPoly(p, h.poly)) inside.push([h, order(h, i)]); });
    const floor = !!map && map.inside(p) && hidden[(y * W + x) * 4 + 3] < 128;
    if (floor) seen++;
    if (floor && inside.length) { taken++; marks.push([x, y, 0]); }
    else if (inside.length > 1) marks.push([x, y, 1]);
    const top = inside.reduce((a, b) => (b[1] > a[1] ? b : a), [null, -Infinity])[0];
    for (const [h] of inside) { const s = stat[h.id]; s.area++; if (floor) s.floor++; if (h !== top) s.under++; }
  }
  // the picture: the screen as drawn (a bigger room: its background whole), the marks over it, the hotspots' outlines; as big as fits 960 px
  const big = W > 320 || H > 180, o = big ? { x: 0, y: 0 } : cam;
  const c = document.createElement("canvas"); c.width = big ? W : 320; c.height = big ? H : 180;
  const g = c.getContext("2d");
  if (big) { Cutaway.assets.draw(g, r.background, 0, 0, { anchor: [0, 0], frame: 0 }); for (const f of fore) Cutaway.assets.draw(g, f.image, f.at[0], f.at[1], { anchor: [0, 0], frame: 0 }); }
  else g.drawImage(Cutaway.display.buffer, 0, 0);
  for (const [x, y, k] of marks) { g.fillStyle = k ? "rgba(255,230,60,0.45)" : "rgba(255,40,40,0.55)"; g.fillRect(x - o.x, y - o.y, 1, 1); }
  g.strokeStyle = "#ffa03a"; g.lineWidth = 1;
  for (const h of hs) { g.beginPath(); h.poly.forEach((q, i) => g[i ? "lineTo" : "moveTo"](q.x - o.x + 0.5, q.y - o.y + 0.5)); g.closePath(); g.stroke(); }
  const k = Math.max(1, Math.floor(960 / c.width)), c3 = document.createElement("canvas"); c3.width = c.width * k; c3.height = c.height * k;
  const g3 = c3.getContext("2d"); g3.imageSmoothingEnabled = false; g3.drawImage(c, 0, 0, c3.width, c3.height);
  return { id: r.id, seen, taken, hs: stat, png: c3.toDataURL("image/png") };
};

const lines = [];
try {
  await chrome.open(pathToFileURL(resolve("index.html")).href + "?manual&nointro&act=kapitel1");
  for (let i = 0; i < 100 && !(await chrome.ev("!!Cutaway.scene.room")); i++) await sleep(100);
  const settle = async () => { for (let i = 0; i < 60; i++) { const busy = await chrome.ev("(Cutaway.menu.card && (Cutaway.menu.closeCard(), true)) || (Cutaway.ui.line?.waiting && (Cutaway.ui.skip(), true)) || Cutaway.script.busy"); if (!busy) return; await chrome.ev("Cutaway.clock.advance(200), 0"); await sleep(30); } };
  await settle();
  await chrome.ev("Cutaway.script.run([{ time: '22:00', day: 2 }]), 0");
  for (let i = 0; i < 40; i++) { await chrome.ev("Cutaway.clock.advance(200), 0"); await settle(); }
  const want = process.argv.slice(2);
  const ids = want.length ? want : await chrome.ev("Cutaway.room.ids().filter((id) => !/^(intro|hall$|deck$|splash$|title$|signal_lost$|dach_sitzen$|dach_blick$|flat_danach$)/.test(id))");
  for (const id of ids) {
    await chrome.ev(`Cutaway.scene.load(${JSON.stringify(id)}), 0`);
    for (let i = 0; i < 10; i++) { await chrome.ev("Cutaway.clock.advance(150), 0"); await settle(); }
    const res = await chrome.ev(`(${MEASURE.toString()})()`);
    writeFileSync(`${OUT}/${id}.png`, Buffer.from(res.png.split(",")[1], "base64"));
    const rows = Object.entries(res.hs);
    lines.push(`${id.padEnd(16)} floor seen ${String(res.seen).padStart(6)}, taken from clicks ${String(res.taken).padStart(5)} (${(res.seen ? (100 * res.taken) / res.seen : 0).toFixed(1).padStart(4)}%)   ${rows.filter(([, s]) => s.shape === "rect").length} rect, ${rows.filter(([, s]) => s.shape === "poly").length} poly, ${rows.filter(([, s]) => s.shape === "box").length} box${rows.some(([, s]) => s.shape === "rect") ? ` (rects: ${rows.filter(([, s]) => s.shape === "rect").map(([h]) => h).join(", ")})` : ""}`);
    for (const [h, s] of rows.sort((a, b) => b[1].floor - a[1].floor)) {
      if (!s.floor && s.under < s.area * 0.25) continue;
      lines.push(`    ${h.padEnd(18)} ${s.shape.padEnd(4)} area ${String(s.area).padStart(6)}, on seen floor ${String(s.floor).padStart(5)}${s.under ? `, under another hotspot ${s.under} (${Math.round((100 * s.under) / Math.max(1, s.area))}%)` : ""}`);
    }
  }
} finally {
  await chrome.close();
}
writeFileSync(`${OUT}/report.txt`, lines.join("\n") + "\n");
console.log(lines.join("\n"));
