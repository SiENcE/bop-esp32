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
  curtainRect: [curtainPart.at[0], R(curtainTop * S) + 2, curtainPart.size[0], curtainPart.at[1] + curtainPart.size[1] - R(curtainTop * S) - 2],
  downRect: [F.SHAFT[0] * S + 2, Math.ceil(shaftTop * S) + 1, (F.SHAFT[1] - F.SHAFT[0]) * S - 4, R((shaftEnd - shaftTop) * S) - 3],
};

// ---- the crowd (kapitel1-design §9): the extras of the room, seeded so they come out the same every build. The vendors at their
// stools behind the counters (where the painting leaves the seller's place), people walking up and down lanes that follow the
// channel and across the bridges, and people standing about on the free floor, kept off Juno's ways, the lanes, the bridges and
// stairs, the places she walks to and the preacher's ring (1.5 m); a few groups that stand together are obstacles (block)
globalThis.Cutaway = {};
vm.runInThisContext(readFileSync("lib/cutaway/walk.js", "utf8"), { filename: "walk.js" });
const map = globalThis.Cutaway.walk.create({ walk, holes });
const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const at = (x, d) => [R(x), R((F.yc(x / S) + d) * S)];                                  // a point d (draft units) off the channel's axis
const clear = (x, y, rx, ry) => { for (let dy = -ry; dy <= ry; dy++) for (let dx = -rx; dx <= rx; dx++) if (!walkable(x + dx, y + dy)) return false; return true; };
const segDist = (p, a, b) => { const q = globalThis.Cutaway.walk.project({ x: p[0], y: p[1] }, { x: a[0], y: a[1] }, { x: b[0], y: b[1] }); return Math.hypot(q.x - p[0], q.y - p[1]); };
const lineDist = (p, pts) => pts.slice(1).reduce((m, q, i) => Math.min(m, segDist(p, pts[i], q)), Infinity);
// statist_01 .. statist_16; the two with umbrellas (06, 12) rare, as in the probes: the market is under the city, out of most of the rain
const PLAIN = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16];
const look = (n) => String(hash(n, 8) < 0.05 ? (hash(n, 9) < 0.5 ? 6 : 12) : PLAIN[Math.floor(hash(n, 7) * PLAIN.length)]).padStart(2, "0");
const DIRS = ["down", "up", "right", "left"];

// the vendors: each open stall's seller's place (the painting's stool), facing the counter; the cook in HOT WOK's aisle, at the stove
const vendors = F.STALLS.filter((s) => s.open).map((s, i) => {
  const X = s.x * S, Y = s.y * S, Wd = s.w * S, Hd = s.h * S, south = s.face === "s";
  const th = Hd >= 50 ? 20 : Hd >= 44 ? 16 : 11, cy = south ? Y + Hd - 10 : Y;
  const ay0 = south ? Y + th + 3 : Y + 11, ay1 = south ? cy - 1 : Y + Hd - th - 3;
  return [X + R(Wd * (s.goods === "clinic" ? 0.78 : 0.62)), R((ay0 + ay1) / 2), 1 + (i % 3), south ? "down" : "up"];
});
vendors.push([WK.x * S + 30, WK.y * S + 34, 1, "up"]);

// the lanes along the channel (draft units off its axis): the north terrace, the north bank, the south bank, the south terrace;
// each cut into the runs one can walk straight along (a stall, the ad on the floor, the deck's tables break them)
const lanes = [];
for (const d of [-88, -40, 28, 79]) {
  let run = [];
  for (let x = 8; x <= W - 8; x += 16) {
    const p = at(x, d), ok = clear(p[0], p[1], 8, 6) && (!run.length || map.visible({ x: run.at(-1)[0], y: run.at(-1)[1] }, { x: p[0], y: p[1] }));
    if (ok) run.push(p);
    if (!ok || x + 16 > W - 8) { if (run.length >= 8) lanes.push(run); run = ok ? [] : []; }
  }
}
const walkers = [];
lanes.forEach((run, li) => {
  const n = Math.max(1, Math.floor(run.length / 14));
  for (let k = 0; k < n; k++) {
    const len = 8 + Math.floor(hash(li, k * 3 + 1) * 10), i0 = Math.floor(hash(li, k * 3 + 2) * Math.max(1, run.length - len));
    const pts = run.slice(i0, i0 + len).filter((_, j, a) => j % 2 === 0 || j === a.length - 1);
    const sp = 20 + Math.floor(hash(li, k * 3 + 3) * 10);
    walkers.push({ at: pts[0], path: pts.slice(1), look: look(li * 31 + k), pause: 400 + Math.floor(hash(li, k + 50) * 1600), speed: [sp, sp] });
  }
});
// across the bridges, from bank to bank and back
for (const [i, bx] of F.BRIDGES.entries()) {
  const a = at(bx * S, -40), b = at(bx * S, 28);
  if (walkable(...a) && walkable(...b) && map.visible({ x: a[0], y: a[1] }, { x: b[0], y: b[1] })) walkers.push({ at: a, path: [b], look: look(90 + i), pause: 1200, speed: [22, 22] });
}

// Juno's ways: from the foot of the stairs to every place she is sent, and on round them, as she walks them
const order = ["arrive", "preacherTalk", "ratzTalk", "wok", "down", "curtain", "jars", "kidneys"];
const ways = [];
for (const k of order) ways.push(map.path({ x: spots.arrive[0], y: spots.arrive[1] }, { x: spots[k][0], y: spots[k][1] }).reduce((a, q) => [...a, [q.x, q.y]], [spots.arrive]));
for (let i = 1; i < order.length - 1; i++) ways.push(map.path({ x: spots[order[i]][0], y: spots[order[i]][1] }, { x: spots[order[i + 1]][0], y: spots[order[i + 1]][1] }).reduce((a, q) => [...a, [q.x, q.y]], [spots[order[i]]]));
const keepOff = (p, r) => ways.some((w) => lineDist(p, w) < r) || walkers.some((w) => lineDist(p, [w.at, ...w.path]) < r * 0.6) ||
  Object.values(spots).some((s) => Math.hypot(p[0] - s[0], p[1] - s[1]) < 28) || Math.hypot(p[0] - spots.preacher[0], p[1] - spots.preacher[1]) < 64 ||
  F.BRIDGES.some((bx) => Math.abs(p[0] - bx * S) < 26 && Math.abs(p[1] - F.yw(bx) * S) < 60) ||
  [[0, 0], [-16, 0], [16, 0], [0, -24], [0, 24]].some(([dx, dy]) => F.ground((p[0] + dx) / S, (p[1] + dy) / S).k === "stair");      // the stairs' feet
// the busker by the middle bridge's south end, beside it (the walkers keep the bridge), playing up towards the market
const busker = [F.BRIDGES[1] * S + 26, R((F.yw(F.BRIDGES[1]) + F.CW + 8) * S)];
const taken = [...walkers.map((w) => w.at), busker];
const roomFor = (p, dx = 20, dy = 15) => !taken.some((q) => Math.abs(q[0] - p[0]) < dx && Math.abs(q[1] - p[1]) < dy);

// a few groups standing together, facing each other: obstacles, so only where there is room all round them
const groups = [];
for (let t = 0; t < 4000 && groups.length < 6; t++) {
  const c = [16 + Math.floor(hash(t, 21) * (W - 32)), 16 + Math.floor(hash(t, 22) * (H - 32))];
  if (!["bed", "terr"].includes(F.ground(c[0] / S, c[1] / S).k) || !clear(c[0], c[1], 34, 24) || keepOff(c, 46) || !roomFor(c, 60, 44)) continue;
  const three = hash(t, 23) < 0.5, n = groups.length;
  const members = [[c[0] - 8, c[1] - (three ? 3 : 0), "right"], [c[0] + 8, c[1] - (three ? 3 : 0), "left"], ...(three ? [[c[0], c[1] + 8, "up"]] : [])];
  members.forEach(([x, y, dir], j) => groups.push([x, y, look(200 + n * 3 + j), dir]));
  taken.push(c);
}
// people standing about: the banks lively, not full
const stand = [];
for (let t = 0; t < 20000 && stand.length < 64; t++) {
  const p = [12 + Math.floor(hash(t, 11) * (W - 24)), 12 + Math.floor(hash(t, 12) * (H - 24))];
  if (!["bed", "terr", "deck"].includes(F.ground(p[0] / S, p[1] / S).k) || !clear(p[0], p[1], 8, 6) || keepOff(p, 22) || !roomFor(p)) continue;
  stand.push([p[0], p[1], look(400 + t), DIRS[Math.floor(hash(t, 13) * 4)]]);
  taken.push(p);
}
const crowd = { vendors, walkers, groups, stand, busker: [...busker, "08", "up"] };

// ---- where the market sounds (kapitel1-design §9, game/sounds.js): the crowd's murmur in three places, the wok's fire, the radio, the
// canal, the roofs' ACs along the top and the bottom, the pillar; the one-shots from the open stalls' fronts (haggling) and from the
// stalls that chop (NOODLE, DUMPLING, EEL)
const middle = (name) => { const q = parts.parts.find((p) => p.name === `drain_market_${name}`); return [q.at[0] + (q.size[0] >> 1), q.at[1] + (q.size[1] >> 1)]; };
const front = (s) => [R((s.x + s.w / 2) * S), s.face === "s" ? (s.y + s.h) * S + 6 : s.y * S - 6];
const sounds = {
  murmur: [at(360, -45), at(660, 40), at(1000, -30)],
  wok: middle("wok"), radio: middle("radio"), pillar: middle("pillar"),
  canal: [420, 900].map((x) => [x, R(F.yw(x / S) * S)]),
  roofs: [200, 640, 1080].flatMap((x) => [[x, 30], [x, 700]]),
  haggle: F.STALLS.filter((s) => s.open).map(front),
  cleaver: ["NOODLE", "DUMPLING", "EEL"].map((n) => front(stall(n))),
  // the other tunes: PACHINKO's jingle from its sign on the roof, the busker, the rafts' radios
  pachinko: middle("sign_pachinko"), busker, noodleRaft: middle("raft_noodle"), dataRaft: middle("raft_screens"),
};

// ---- every place someone stands or walks to must be walkable
const bad = Object.entries(spots).filter(([, [x, y]]) => !walkable(x, y)).map(([k, p]) => `${k} ${p}`);
const corners = [...walk, ...holes].reduce((n, p) => n + p.length / 2, 0);
const json = { size: [W, H], walk, holes, spots, rects, parts: parts.parts, lamps: parts.lamps, crowd, sounds };

const outFile = process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : null;
if (outFile) {
  writeFileSync(outFile, "// generated by tools/market-layout.mjs from the Drain Market's approved layout (art/test/drain_market_f_oben.px.js, at twice its\n" +
    "// size) and art/rooms/drain_market.parts.json: never edit by hand; change the layout or the painting and build again\n\"use strict\";\n\n" +
    `Nagiwa.layouts = Nagiwa.layouts || {};\nNagiwa.layouts.drain_market = ${JSON.stringify(json)};\n`);
}
console.log(`drain_market: ${walk.length} walk area(s), ${holes.length} holes, ${corners} corners; ${Object.keys(spots).length} places, ${parts.parts.length} parts, ${parts.lamps.length} lamps; ` +
  `the crowd: ${vendors.length} vendors, ${walkers.length} walking, ${groups.length} in groups, ${stand.length} standing`);
if (bad.length) { console.log("not on walkable floor: " + bad.join("; ")); process.exitCode = 1; }
