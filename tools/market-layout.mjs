// The Drain Market's numbers, measured from its layout (kapitel1-design §9): the room seen from above is painted, not baked from a
// map, so its walk area, places and hotspot shapes come from the layout the user approved as blocks (draft F, worked out at twice
// its size: art/test/drain_market_f_oben.px.js, DMF, sampled at x / 2, y / 2 as art/test/drain_market_oben_blocks.px.js does) and
// its painting copies exactly (art/rooms/drain_market.px.js); its moving parts and runtime lamps from art/rooms/drain_market.parts.json.
//   node tools/market-layout.mjs [--out game/rooms/drain_market.layout.js]
// Without --out: a summary (corners, holes, every place on walkable floor). tools/build_art.sh room drain_market writes the file.
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const S = 2, W = 1280, H = 720;
const stub = () => {};
const ctx = vm.createContext({ include: stub, pal: stub, scene: stub, sprite: stub, anim: stub, glow: stub, console: { log: stub }, Math });
vm.runInContext(readFileSync("art/test/drain_market_f_oben.px.js", "utf8") + "\n;globalThis.DMF = DMF;", ctx, { filename: "drain_market_f_oben.px.js" });
const F = ctx.DMF;
const parts = JSON.parse(readFileSync("art/rooms/drain_market.parts.json", "utf8"));
const R = Math.round;

// ---- where Juno can walk: the blocks' rule (the floor's levels and the stairs, the bridges, the niche short of the curtain; no stall,
// table, raft or crate), a pixel at a time
const OCC = F.OCC.map(([x0, y0, x1, y1]) => [x0 * S, y0 * S, x1 * S, y1 * S]);
const onBridge = (x, y) => F.BRIDGES.some((bx) => Math.abs(x / S - bx) <= 6 && Math.abs(y / S - F.yw(x / S)) <= F.CW + 3);
// the stairs up to the alley: their upper part is the way out (the hotspot "up"), not floor to walk on, so the hotspot covers none
const arrX = (F.ARR[0] + F.ARR[1]) / 2, stairsFoot = Math.min(...[F.ARR[0], arrX, F.ARR[1]].map((x) => F.yc(x) - 122));
const upTop = R(stairsFoot * S) - 40;
const mask = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = onBridge(x, y) ? "bridge" : F.ground((x + 0.5) / S, (y + 0.5) / S).k;
  let ok = ["bed", "terr", "deck", "stair", "bridge", "niche"].includes(k);
  if (ok && k === "niche" && y / S > F.yc(x / S) + 108 + 4) ok = false;                 // the curtain itself: Sable's booth is behind it
  if (ok && k === "stair" && y < upTop) ok = false;
  if (ok && OCC.some(([x0, y0, x1, y1]) => x >= x0 && x < x1 && y >= y0 && y < y1)) ok = false;
  mask[y * W + x] = ok ? 1 : 0;
}
const walkable = (x, y) => x >= 0 && y >= 0 && x < W && y < H && mask[y * W + x] === 1;
// Ratz and the preacher stand on their crates, and an actor stands on walkable floor: a slit 2 px wide from the floor in front of each
// up to their feet (as the Rain Reader's on the roof); a click there is a click on them
const slit = (x, y) => { for (let yy = y - 1; !walkable(x, yy) || !walkable(x - 1, yy); yy++) { mask[yy * W + x] = 1; mask[yy * W + x - 1] = 1; } };

// ---- its outlines on the pixels' corners (walkable on the right hand), simplified: the outer ones the walk area, the inner ones holes
function outlines() {
  const key = (x, y) => y * (W + 1) + x, out = new Map();
  const edge = (x0, y0, x1, y1) => { const k = key(x0, y0); if (!out.has(k)) out.set(k, []); out.get(k).push([x1, y1]); };
  for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) {
    if (x < W) { const a = walkable(x, y - 1), b = walkable(x, y); if (b && !a) edge(x + 1, y, x, y); if (a && !b) edge(x, y, x + 1, y); }
    if (y < H) { const l = walkable(x - 1, y), r = walkable(x, y); if (r && !l) edge(x, y, x, y + 1); if (l && !r) edge(x, y + 1, x, y); }
  }
  const loops = [];
  for (const [k0, list] of out) while (list.length) {
    let x = k0 % (W + 1), y = (k0 - x) / (W + 1);
    const pts = [[x, y]];
    let [nx, ny] = list.shift(), dx = nx - x, dy = ny - y;
    x = nx; y = ny;
    for (;;) {
      const c = out.get(key(x, y));
      if (!c || !c.length) break;
      // where two outlines touch at a corner, turn right: the pieces stay apart
      let i = c.length > 1 ? c.findIndex(([px, py]) => px - x === -dy && py - y === dx) : 0;
      if (i < 0) i = 0;
      const [px, py] = c.splice(i, 1)[0];
      if (px - x !== dx || py - y !== dy) pts.push([x, y]);
      dx = px - x; dy = py - y; x = px; y = py;
    }
    loops.push(pts);
  }
  const area = (p) => p.reduce((s, [x, y], i) => { const [X, Y] = p[(i + 1) % p.length]; return s + x * Y - X * y; }, 0) / 2;
  const dp = (a, tol) => {
    if (a.length < 3) return a;
    const [p, q] = [a[0], a[a.length - 1]], L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    let far = 0, at = 0;
    for (let i = 1; i < a.length - 1; i++) { const d = Math.abs((q[0] - p[0]) * (p[1] - a[i][1]) - (p[0] - a[i][0]) * (q[1] - p[1])) / L; if (d > far) { far = d; at = i; } }
    return far <= tol ? [p, q] : [...dp(a.slice(0, at + 1), tol).slice(0, -1), ...dp(a.slice(at), tol)];
  };
  // a closed ring in two open halves (from its first corner to the one farthest from it and back), each simplified to a pixel and a half
  const simplify = (pts) => {
    const d = (p) => Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]), far = pts.reduce((b, p, i) => (d(p) > d(pts[b]) ? i : b), 0);
    return [...dp(pts.slice(0, far + 1), 1.5).slice(0, -1), ...dp([...pts.slice(far), pts[0]], 1.5).slice(0, -1)];
  };
  const walk = [], holes = [];
  for (const l of loops) {
    const a = area(l);
    if (Math.abs(a) < 40) continue;                                                       // a few pixels' crumbs
    (a < 0 ? walk : holes).push(simplify(l).flat());
  }
  return { walk, holes };
}

// ---- the places (room pixels), and the hotspots' shapes: from above every one of these things is a box, so a rect is its shape
const stall = (sign) => F.STALLS.find((s) => s.sign?.[0] === sign);
const box = (o) => [o.x * S, o.y * S, o.w * S, o.h * S];
const kid = stall("KIDNEYS ONLY"), jar = stall("USED CHROME"), RZ = F.RATZ, WK = F.WOK;
// (the channel slopes under the shaft: its rect begins where the shaft does at its lowest, so it covers no floor)
const shaftX = (F.SHAFT[0] + F.SHAFT[1]) / 2, shaftTop = Math.max(F.yc(F.SHAFT[0]), F.yc(F.SHAFT[1])) + 62 - 30, shaftEnd = F.yc(shaftX) + 74 + 4;
const nicheX = (F.NICHE[0] + F.NICHE[1]) / 2, curtainTop = F.yc(nicheX) + 108 + 4;
const curtainPart = parts.parts.find((p) => p.name === "drain_market_curtain");
const spots = {
  arrive: [R(arrX * S), R((F.nTer(78) + 8) * S)],                                      // the foot of the stairs from the alley
  up: [R(arrX * S), upTop + 4],                                                          // on the stairs, below the way out
  preacher: [F.PREACH.x * S, F.PREACH.y * S - 1],                                        // on his crate (the probe's place)
  preacherTalk: [F.PREACH.x * S, F.PREACH.y * S + 32],                                   // before him, inside his ring
  ratz: [RZ.x * S + 95, RZ.y * S + 28],                                                  // on his crate behind the junk (the probe's)
  ratzTalk: [RZ.x * S + 95, RZ.y * S + 58],                                              // before his stall, as in the probe
  kidneys: [R((kid.x + kid.w / 2) * S), (kid.y + kid.h) * S + 12],
  jars: [R((jar.x + jar.w / 2) * S), (jar.y + jar.h) * S + 12],
  wok: [(WK.x + WK.w) * S + 10, R((WK.y + WK.h / 2) * S)],                              // on the deck beside HOT WOK (the wall is below it)
  curtain: [R(nicheX * S), R(curtainTop * S) - 22],                                      // on the terrace before the curtain
  down: [R(shaftX * S), R((F.yc(shaftX) + 62 - 30) * S) - 8],                                            // before the gate of the stairs down
};
slit(...spots.ratz); slit(...spots.preacher);
const { walk, holes } = outlines();
const rects = {
  // (the ways out kept 2 px off the floor beside them: the walk area is simplified to a pixel and a half, and its edge's half pixel walks)
  upRect: [F.ARR[0] * S, 0, (F.ARR[1] - F.ARR[0]) * S, upTop - 2],
  ratzRect: box({ ...RZ }),
  kidneysRect: box(kid),
  jarsRect: box(jar),
  wokRect: box(WK),
  curtainRect: [curtainPart.at[0], R(curtainTop * S), curtainPart.size[0], curtainPart.at[1] + curtainPart.size[1] - R(curtainTop * S)],
  downRect: [F.SHAFT[0] * S + 2, Math.ceil(shaftTop * S) + 1, (F.SHAFT[1] - F.SHAFT[0]) * S - 4, R((shaftEnd - shaftTop) * S) - 3],
};

// ---- every place someone stands or walks to must be walkable
const bad = Object.entries(spots).filter(([, [x, y]]) => !walkable(x, y)).map(([k, p]) => `${k} ${p}`);
const corners = [...walk, ...holes].reduce((n, p) => n + p.length / 2, 0);
const json = { size: [W, H], walk, holes, spots, rects, parts: parts.parts, lamps: parts.lamps };

const outFile = process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : null;
if (outFile) {
  writeFileSync(outFile, "// generated by tools/market-layout.mjs from the Drain Market's approved layout (art/test/drain_market_f_oben.px.js, at twice its\n" +
    "// size) and art/rooms/drain_market.parts.json: never edit by hand; change the layout or the painting and build again\n\"use strict\";\n\n" +
    `Nagiwa.layouts = Nagiwa.layouts || {};\nNagiwa.layouts.drain_market = ${JSON.stringify(json)};\n`);
}
console.log(`drain_market: ${walk.length} walk area(s), ${holes.length} holes, ${corners} corners; ${Object.keys(spots).length} places, ${parts.parts.length} parts, ${parts.lamps.length} lamps`);
if (bad.length) { console.log("not on walkable floor: " + bad.join("; ")); process.exitCode = 1; }
