// The game's numbers for a street-mode room, measured from its map (art/rooms/<id>.map.js, art/lib/isomap.js):
// walk area and holes, each prop's front line, baseline and shape, the openings' rects, the spots and lamps. With the bake (--stdin)
// each prop with a sprite gets its outline too (`shape`): the line round its drawn pixels, a hotspot's shape that covers no floor
// one can see (the user's wish, 2026-11-09: a rect or a box only for a thing that is one).
//   node tools/iso-layout.mjs <id> [--json]
//       the geometry alone (no sprite places: those need the bake), as a summary (and the JSON)
//   node tools/iso-layout.mjs <id> --stdin --out game/rooms/<id>.layout.js
//       read the bake's "ISO_LAYOUT {...}" line from stdin (pxl build of art/rooms/<id>.px.js prints it,
//       with each prop's sprite, place and box) and write the game's layout file; tools/build_art.sh does this
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
import { decode } from "../lib/cutaway/tools/lib/png.mjs";

/** Is (x, y) inside a polygon given flat? */
const inPoly = (x, y, f) => { let c = false; for (let i = 0, j = f.length - 2; i < f.length; j = i, i += 2) if ((f[i + 1] > y) !== (f[j + 1] > y) && x < ((f[j] - f[i]) * (y - f[i + 1])) / (f[j + 1] - f[i + 1]) + f[i]) c = !c; return c; };
/** The convex hull of a flat polygon, flat. */
function hull(flat) {
  const pts = []; for (let i = 0; i < flat.length; i += 2) pts.push([flat[i], flat[i + 1]]);
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const q of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of pts.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)].flat();
}
/** A hotspot's shape that stays easy to click (the user's wish, 2026-11-09): no smaller than MIN px either way (grown round its
 *  middle), and with no more corners than it needs: the outline's convex hull wherever that covers almost no walkable floor and
 *  nothing else one could click (another prop's outline, an opening, a zone). */
const MIN = 12;
function fit(shape, walk, holes, others) {
  const h = hull(shape), xs = h.filter((_, i) => i % 2 === 0), ys = h.filter((_, i) => i % 2);
  let extra = 0;
  for (let y = Math.floor(Math.min(...ys)); y < Math.max(...ys); y++) for (let x = Math.floor(Math.min(...xs)); x < Math.max(...xs); x++) {
    const cx = x + 0.5, cy = y + 0.5;
    if (!inPoly(cx, cy, h) || inPoly(cx, cy, shape)) continue;
    if ((walk.some((w) => inPoly(cx, cy, w)) && !holes.some((o) => inPoly(cx, cy, o))) || others.some((o) => inPoly(cx, cy, o))) extra++;
  }
  return grow(extra <= 24 ? h : shape);
}
/** Grown round its middle to at least MIN px wide and high. */
function grow(f) {
  const xs = f.filter((_, i) => i % 2 === 0), ys = f.filter((_, i) => i % 2), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const sx = Math.max(1, MIN / Math.max(1, x1 - x0)), sy = Math.max(1, MIN / Math.max(1, y1 - y0)), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  return sx === 1 && sy === 1 ? f : f.map((v, i) => Math.round(i % 2 ? my + (v - my) * sy : mx + (v - mx) * sx));
}

/**
 * The outline of a sprite's drawn pixels as a polygon in the room (flat [x0, y0, ...]): the pixels grown by one (so a click on its
 * edge counts and near parts join), the largest piece, its edge walked round on the pixels' corners, then simplified.
 * @param {string} room @param {string} sprite @param {number[]} box  where the sprite is drawn: x, y, w, h
 */
function outline(room, sprite, box) {
  const still = `build/art/rooms/${room}/sprites/${sprite}.png`, anim = `build/art/rooms/${room}/anims/${sprite}.png`;
  let img, fx = 0, fy = 0;
  if (existsSync(still)) img = decode(readFileSync(still));
  else if (existsSync(anim)) {
    img = decode(readFileSync(anim));
    const f = Object.values(JSON.parse(readFileSync(anim.replace(/\.png$/, ".json"), "utf8")).frames)[0].frame; fx = f.x; fy = f.y;
  } else return null;
  const [, , w, h] = box, W = w + 2, H = h + 2;
  const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && img.data[((fy + y) * img.width + fx + x) * 4 + 3] > 0;
  // grown by one pixel, in a grid one wider on each side
  const m = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let dy = -1; dy <= 1 && !m[y * W + x]; dy++) for (let dx = -1; dx <= 1; dx++) if (solid(x - 1 + dx, y - 1 + dy)) { m[y * W + x] = 1; break; }
  // the largest piece
  const label = new Int32Array(W * H), sizes = [0];
  for (let i = 0; i < W * H; i++) if (m[i] && !label[i]) {
    const id = sizes.length, stack = [i]; let n = 0; label[i] = id;
    while (stack.length) { const j = stack.pop(), x = j % W, y = (j - x) / W; n++; for (const k of [j - 1, j + 1, j - W, j + W]) if (k >= 0 && k < W * H && Math.abs((k % W) - x) <= 1 && m[k] && !label[k]) { label[k] = id; stack.push(k); } }
    sizes.push(n);
  }
  if (sizes.length < 2) return null;
  const best = sizes.indexOf(Math.max(...sizes.slice(1)));
  const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && label[y * W + x] === best;
  // walk its edge on the pixels' corners, the piece on the right hand
  let start = 0; while (label[start] !== best) start++;
  const sx = start % W, sy = (start - sx) / W, pts = [];
  let x = sx, y = sy, dx = 1, dy = 0;
  for (let guard = 0; guard < 4 * W * H; guard++) {
    const rx = -dy, ry = dx, lx = dy, ly = -dx;
    const aheadL = inside(x + (dx + lx - 1) / 2, y + (dy + ly - 1) / 2), aheadR = inside(x + (dx + rx - 1) / 2, y + (dy + ry - 1) / 2);
    let ndx = dx, ndy = dy;
    if (aheadL) { ndx = lx; ndy = ly; } else if (!aheadR) { ndx = rx; ndy = ry; }
    if (ndx !== dx || ndy !== dy || !pts.length) pts.push([x, y]);
    dx = ndx; dy = ndy; x += dx; y += dy;
    if (x === sx && y === sy) break;                                   // round once (it came back up the left edge)
  }
  // simplified (Douglas-Peucker, a pixel and a half's tolerance), back in the room
  const dp = (a) => {
    if (a.length < 3) return a;
    const [p, q] = [a[0], a[a.length - 1]], L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    let far = 0, at = 0;
    for (let i = 1; i < a.length - 1; i++) { const d = Math.abs((q[0] - p[0]) * (p[1] - a[i][1]) - (p[0] - a[i][0]) * (q[1] - p[1])) / L; if (d > far) { far = d; at = i; } }
    return far <= 1.5 ? [p, q] : [...dp(a.slice(0, at + 1)).slice(0, -1), ...dp(a.slice(at))];
  };
  // (in two halves, the first corner to the lowest and back, so each half is an open line)
  const mid = pts.reduce((b, p, i) => (p[1] > pts[b][1] ? i : b), 0);
  const simple = [...dp(pts.slice(0, mid + 1)).slice(0, -1), ...dp([...pts.slice(mid), pts[0]]).slice(0, -1)];
  return simple.flatMap(([px, py]) => [box[0] + px - 1, box[1] + py - 1]);
}

const [id, ...rest] = process.argv.slice(2);
if (!id) { console.error("usage: node tools/iso-layout.mjs <id> [--json] | <id> --stdin --out <file>"); process.exit(2); }
const out = rest.includes("--out") ? rest[rest.indexOf("--out") + 1] : null;

let json;
if (rest.includes("--stdin")) {
  const line = readFileSync(0, "utf8").split(/\r?\n/).find((l) => l.startsWith("ISO_LAYOUT "));
  if (!line) { console.error(`no ISO_LAYOUT line in the build's output for ${id}`); process.exit(1); }
  json = JSON.parse(line.slice("ISO_LAYOUT ".length));
  delete json.id;
  // the outlines first, then each one's hull where that covers no floor and nothing else one could click (another prop, an opening)
  const traced = {};
  for (const [pid, p] of Object.entries(json.props)) if (p.sprite && p.box) { const o = outline(id, p.sprite, p.box); if (o) traced[pid] = o; }
  for (const [pid, o] of Object.entries(traced)) {
    const others = [...Object.entries(traced).filter(([k]) => k !== pid).map(([, q]) => q), ...Object.values(json.openingPolys ?? {}), ...Object.values(json.zonePolys ?? {})];
    json.props[pid].shape = fit(o, json.walk, json.holes, others);
  }
} else {
  const ctx = vm.createContext({});
  for (const f of ["art/lib/isomap.js", `art/rooms/${id}.map.js`]) vm.runInContext(readFileSync(f, "utf8"), ctx, { filename: f });
  json = JSON.parse(JSON.stringify(vm.runInContext(`ISOMAP.layout(ISO_MAPS[${JSON.stringify(id)}])`, ctx)));
}

if (out) {
  const body = `// generated by tools/iso-layout.mjs from art/rooms/${id}.map.js and its bake (tools/build_art.sh room ${id}):\n` +
    `// never edit by hand; change the map or the kit and build again\n"use strict";\n\n` +
    `Nagiwa.layouts = Nagiwa.layouts || {};\nNagiwa.layouts[${JSON.stringify(id)}] = ${JSON.stringify(json)};\n`;
  writeFileSync(out, body);
}
const n = (a) => a.length / 2;
console.log(`${id}: walk ${json.walk.length} loop(s) (${json.walk.map(n).join(", ")} points), holes ${json.holes.length}, props ${Object.keys(json.props).length}, openings ${Object.keys(json.openings ?? {}).length}, spots ${Object.keys(json.spots).length}, lamps ${json.lamps.length}${out ? `: wrote ${out}` : ""}`);
if (rest.includes("--json")) console.log(JSON.stringify(json, null, 1));
