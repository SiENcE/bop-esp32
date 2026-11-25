// Nagiwa: the dream, the third mode beside street and feed (docs/kapitel3-design.md §3.5, style guide §9a, the mockups
// docs/mockups/mock_g_traum_*_x3.gif from art/mockups/mock_g_traum.px.js, whose ways of drawing this follows). Step H6.2 of
// docs/PLAN.md, a spike: one picture reached through all three states.
//   the data room (`traum`): the city's camera pictures hang in a void over a grid running to a horizon, where the Witness's eye
//     rises like a sun; a thread from every picture to it, pulses running along; Lull's beat falls in columns like code. A click on
//     a picture flies into it.
//   the tunnel (`traum_tunnel`): walls of camera pictures, flown through toward the eye ({ float: [0, 1], ms }, game/intro.js).
//   the picture made of code (`traum_<cam>`): the place built only from the falling beat, and in it what Juno looks for.
// Each is a room the game draws itself (`dream: "<shot>"`, the shot's progress the intro's `float`) with no actor drawn (`observe`): Juno is the one cyan thing, an outline from
// behind. The pictures are the cameras' own (one place, one picture), read once into the dream's ramp. Only the dream's ramp and
// Juno's cyan, no phosphor, no OSD. The Witness speaks in lowercase, white, with voices offset behind him in magenta (drawn here
// behind the line the engine draws). The clock stands while `dreaming` holds (game/kapitel3.js).
//   dreaming   Juno is in the dream (set going in, unset waking): the clock stands, the hint is the dream's
"use strict";

(function () {
const W = 320, H = 180, FRAMES = 24, A = Nagiwa.at.traum, F = A.focal, HZ = A.horizon;
// the dream's ramp, black-violet to magenta to white (0..9), and Juno's cyan (10..13: shadow, line, bright, lit)
const RAMP = ["#030006", "#0b0213", "#170520", "#260830", "#3e0c45", "#62125c", "#92207f", "#d23fb4", "#ff8fe0", "#fff1fb"];
const CYAN = ["#0b3340", "#1a8fa0", "#3ff2ff", "#dafcff"];
const RGB = [...RAMP, ...CYAN].map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
const [cw, cu, cU, cV] = [10, 11, 12, 13];

/** a hash of three integers, 0..1 (the mockup's, so the same columns fall in the same places) */
const ih = (/** @type {number} */ a, b = 0, s = 0) => {
  let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
// Lull's beat over the loop: long, short, short, long, pause (style guide §6)
const BEAT = "111111001100110011111100";
const beat = (/** @type {number} */ f) => BEAT[((f % FRAMES) + FRAMES) % FRAMES] === "1";
const dk = (/** @type {number} */ k) => Math.max(0, Math.min(9, Math.round(k)));

// ---- the surface: one index a pixel, drawn into an ImageData and onto the screen; made at the first frame (never in the Node tools)
/** @type {{cv: HTMLCanvasElement, cx: CanvasRenderingContext2D, img: ImageData, buf: Uint8Array} | null} */
let S = null;
function surface() {
  if (!S) {
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const cx = /** @type {CanvasRenderingContext2D} */ (cv.getContext("2d"));
    S = { cv, cx, img: cx.createImageData(W, H), buf: new Uint8Array(W * H) };
  }
  return S;
}
const B = () => /** @type {Uint8Array} */ (S?.buf);
const put = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ i) => { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H) B()[y * W + x] = i; };
const key = (/** @type {number} */ x, /** @type {number} */ y) => B()[(y | 0) * W + (x | 0)];
const brighter = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ n) => {
  x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = key(x, y); if (i < 10) put(x, y, dk(i + n));
};
// the dream's passes over the picture, drawn as it goes onto the screen (k: how much of the pass is left, or done, for "out"):
//   in     coming in from the bed's black: dark by whole steps of the ramp, bent in waves, rows slipping, clearing slowly
//   flash  the tunnel's end: white, falling back by steps into the picture that comes
//   out    waking: the picture made of code falls out of the screen column by column, Juno's outline stays a moment, then goes
const pass = { kind: "", k: 0 };
const dim = (/** @type {number} */ i, /** @type {number} */ n) => (i < 10 ? dk(i - n) : i - 10 - Math.round(n / 2.5) >= 0 ? i - Math.round(n / 2.5) : 0);
const lift = (/** @type {number} */ i, /** @type {number} */ n) => (i < 10 ? dk(i + n) : n > 4 ? 9 : n > 1 ? cV : i);
const PASS = /** @type {Record<string, (b: Uint8Array, x: number, y: number, t: number, k: number) => number>} */ ({
  in(b, x, y, t, k) {
    let sx = x + Math.round((Math.sin(y * 0.09 + t * 0.004) * 14 + Math.sin(y * 0.37 - t * 0.013) * 4) * k);
    const sy = y + Math.round(Math.sin(x * 0.045 + t * 0.003) * 7 * k);
    if (ih(y >> 1, Math.floor(t / 90), 41) < 0.1 * k) sx += Math.round((ih(y >> 1, Math.floor(t / 90), 42) - 0.5) * 50 * k);
    if (sx < 0 || sy < 0 || sx >= W || sy >= H) return 0;
    return dim(b[sy * W + sx], k * 10);
  },
  flash(b, x, y, t, k) {
    const sy = Math.max(0, Math.min(H - 1, y + Math.round(Math.sin(x * 0.07 + t * 0.01) * 3 * k)));
    return lift(b[sy * W + x], k * 11);
  },
  out(b, x, y, t, k) {
    const i = b[y * W + x];
    if (i >= 10) return k < 0.8 ? i : k < 0.92 && ih(Math.floor(t / 60), 1, 43) < 0.5 ? cu : 0;   // she stays, then flickers out
    const c = Math.floor(x / 3), dl = ih(c, 31) * 0.45, fall = Math.max(0, Math.min(1, (k - dl) / 0.5));
    const off = fall * fall * (H + 40), sy = Math.floor(y - off);
    if (sy >= 0) { const j = b[sy * W + x]; return j < 10 ? dk(j - fall * 3) : 0; }
    const tail = off - y;                                                // above the falling column: its trail, brightest at its top edge
    return fall > 0 && tail < 8 ? dk(7 - tail) : 0;
  },
});
function blit(/** @type {CanvasRenderingContext2D} */ ctx) {
  const s = surface(), d = s.img.data, b = s.buf, t = Cutaway.clock.time, run = pass.k > 0 && PASS[pass.kind];
  for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) {
    const c = RGB[run ? run(b, x, y, t, pass.k) : b[i]];
    d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255;
  }
  s.cx.putImageData(s.img, 0, 0);
  ctx.drawImage(s.cv, 0, 0);
}
// { dream: "in" | "flash" | "out", ms, ease, wait } runs a pass; "in" takes over the bed's black (the engine's fade) at once
Cutaway.script.action("dream", (s) => {
  const kind = String(s.dream), from = kind === "out" ? 0 : 1, to = 1 - from;
  pass.kind = kind; pass.k = from;
  if (kind === "in") Cutaway.fx.fade(0, 0);
  const done = Cutaway.tween.to({ key: "dream", ms: Cutaway.script.fast ? 0 : Number(s.ms) || 0, ease: s.ease ?? "linear", step: (k) => { pass.k = from + (to - from) * k; } });
  return Cutaway.script.goOn(s, done);
});
// waking leaves the picture fallen away: a dream room entered again (a save) begins clear
Cutaway.events.on("room.enter", () => { if (pass.kind === "out") pass.k = 0; });
// in the dream nobody's voice sounds: the lines stand without blips (a provider that speaks them silently)
Cutaway.voice.use(() => (/** @type {any} */ (Cutaway.scene.room)?.dream ? { stop() {} } : null));

// ---- the cameras' pictures, read once into the dream's ramp (0..9 by their step on the phosphor ramp): the background and what lies over it
/** @type {Record<string, Float32Array>} */
const PIC = {};
// a pixel's step on the phosphor ramp the pictures are painted in (0..9, between two steps in between), as the mockup reads them
const LUM = Nagiwa.PHOSPHOR.map((h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.299 * r + 0.587 * g + 0.114 * b; });
const step = (/** @type {number} */ l) => {
  if (l <= LUM[0]) return 0;
  for (let i = 1; i < LUM.length; i++) if (l <= LUM[i]) return i - 1 + (l - LUM[i - 1]) / (LUM[i] - LUM[i - 1]);
  return 9;
};
/** @param {string[]} names */
function pic(names) {
  const id = names.join("+");
  if (PIC[id]) return PIC[id];
  if (!names.every((n) => Cutaway.assets.has(n))) return null;
  const a = Cutaway.assets.get(names[0]), im = Cutaway.assets.img(a?.frames?.[0]?.image ?? a?.image);
  if (im && !im.complete) return null;                                      // not decoded yet: next frame
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const cx = /** @type {CanvasRenderingContext2D} */ (cv.getContext("2d", { willReadFrequently: true }));
  for (const n of names) Cutaway.assets.draw(cx, n, 0, 0, { anchor: [0, 0], frame: 0 });
  const d = cx.getImageData(0, 0, W, H).data, v = new Float32Array(W * H);
  let lit = 0;
  for (let i = 0; i < W * H; i++) { v[i] = step(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]); lit += v[i]; }
  return lit > 0 ? (PIC[id] = v) : null;                                    // all dark: the atlas wasn't ready, try again
}
const sample = (/** @type {Float32Array} */ p, /** @type {number} */ u, /** @type {number} */ v) =>
  p[Math.max(0, Math.min(H - 1, Math.floor(v * H))) * W + Math.max(0, Math.min(W - 1, Math.floor(u * W)))];

// ---- the dream camera
const proj = (/** @type {number[]} */ P, /** @type {number} */ cy) => [W / 2 + (F * P[0]) / P[2], cy - (F * P[1]) / P[2]];
/** a picture's four corners on the screen (bob: its drift, in the dream's units) @param {any} p @param {number} bob */
function corners(p, bob) {
  const r = [Math.cos(p.yaw), 0, Math.sin(p.yaw)], y = p.y + bob;
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => proj([p.x + (r[0] * sx * p.w) / 2, y + (sy * p.h) / 2, p.z + (r[2] * sx * p.w) / 2], HZ));
}
// a picture hanging in space, drawn by casting every pixel of its box onto its plane
function panel(/** @type {any} */ p, /** @type {number} */ f) {
  const th = p.yaw, r = [Math.cos(th), 0, Math.sin(th)], n = [-Math.sin(th), 0, Math.cos(th)];
  const P0 = [p.x, p.y + Math.sin((f / FRAMES) * Math.PI * 2 + p.ph) * 0.04, p.z];
  const cs = corners(p, P0[1] - p.y), xs = cs.map((q) => q[0]), ys = cs.map((q) => q[1]);
  const x0 = Math.floor(Math.min(...xs)), x1 = Math.ceil(Math.max(...xs)), y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys));
  const nd = P0[0] * n[0] + P0[1] * n[1] + P0[2] * n[2], fade = Math.max(0, Math.min(2.5, (p.z - 3) * 0.3)), img = pic(p.img);
  for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(W - 1, x1); x++) {
    const d = [(x + 0.5 - W / 2) / F, -(y + 0.5 - HZ) / F, 1], dn = d[0] * n[0] + d[1] * n[1] + d[2] * n[2];
    const t = nd / dn, L = [d[0] * t - P0[0], d[1] * t - P0[1], d[2] * t - P0[2]];
    const u = (L[0] * r[0] + L[2] * r[2]) / p.w + 0.5, v = 0.5 - L[1] / p.h;
    if (u < 0 || u >= 1 || v < 0 || v >= 1) continue;
    const edge = u < 0.012 || u > 0.988 || v < 0.02 || v > 0.98;
    let k = edge ? 8 : img ? sample(img, u, v) * 0.95 + 0.9 : 2;
    if (!edge && (y + f) % 4 === 0) k -= 0.7;                           // the dream's own scanlines, drifting
    put(x, y, dk(k - fade));
  }
  p.box = [x0, y0, x1, y1];
}
// four small corners round a box: the sleepers' marks (white), Juno's brackets (cyan)
function marks(/** @type {number} */ x0, /** @type {number} */ y0, /** @type {number} */ x1, /** @type {number} */ y1, /** @type {number} */ k, n = 2) {
  for (let i = 0; i < n; i++) {
    put(x0 + i, y0, k); put(x0, y0 + i, k); put(x1 - i, y0, k); put(x1, y0 + i, k);
    put(x0 + i, y1, k); put(x0, y1 - i, k); put(x1 - i, y1, k); put(x1, y1 - i, k);
  }
}

// ---- Lull's beat falling like code: a long dash, two short, a long, a pause; the head white, the tail fading; never letters
const GLYPH = [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0];
function rain(/** @type {number} */ f, /** @type {any} */ o = {}) {
  const step = o.step ?? 4, len = o.len ?? 34, where = o.where ?? (() => true);
  for (let x = 1; x < W; x += step) {
    const r = ih(x, 7), s = r < 0.45 ? 5 : r < 0.8 ? 10 : 15, P = s === 15 ? 360 : 240;
    if (ih(x, 11) < (o.sparse ?? 0.35)) continue;
    const head0 = (Math.floor(ih(x, 3) * P) + f * s) % P;
    for (const head of [head0 - P, head0, head0 + P]) for (let i = 0; i < len; i++) {
      const y = head - i;
      if (y < 0 || y >= H || !where(x, y) || !GLYPH[(i + Math.floor(ih(x, 5) * 14)) % 14]) continue;
      const k = i === 0 ? 9 : i < 3 ? 8 : 7 - Math.floor((i / len) * 5);
      if (k >= 2 && k > key(x, y)) put(x, y, k);
    }
  }
}

// ---- the Witness's eye: an almond lit from inside, the iris in rings, the pupil wider on the beat
function eye(/** @type {number} */ ex, /** @type {number} */ ey, /** @type {number} */ rx, /** @type {number} */ ry, /** @type {number} */ f, /** @type {any} */ o = {}) {
  const pr = (beat(f) ? 0.34 : 0.26) * ry * 2;
  for (let y = Math.floor(ey - ry - 3); y <= ey + ry + 3; y++) for (let x = Math.floor(ex - rx - 3); x <= ex + rx + 3; x++) {
    if (o.clip && y >= o.clip) continue;                                // a sun on the horizon: under it is the grid
    const nx = (x - ex) / rx, ny = (y - ey) / ry, lid = 1 - nx * nx;
    if (Math.abs(ny) >= lid) { if (Math.abs(ny) < lid + 0.18 && Math.abs(nx) < 1) put(x, y, 6); continue; }
    if (o.cut && y > ey && (y - ey) % 3 === 0) { put(x, y, 3); continue; }  // the cuts of a horizon's sun
    const dr = Math.hypot(x - ex, (y - ey) * 1.05);
    let k = 8 - Math.abs(ny) * 2;
    if (dr < ry * 0.95) k = 6 + Math.sin(dr * 1.7 + f * 0.5) * 0.8;
    if (dr < ry * 0.95 && dr > ry * 0.85) k = 4;
    if (dr < pr) k = dr > pr - 1 ? 8 : 0;
    if (dr < pr && Math.hypot(x - ex + pr * 0.35, y - ey + pr * 0.35) < 1.3) k = 9;
    put(x, y, dk(k));
  }
}

// ---- Juno from behind: an outline in cyan, scanned (hood, shoulders, the slicker to its hem, the strap, the bag on her left hip)
const JUNO_HALF = [2, 4, 5, 6, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21];
function juno(/** @type {number[]} */ at, /** @type {number} */ f) {
  const [cx, by] = at, h = JUNO_HALF.length, top = by - h + 1 + Math.round(Math.sin((f / FRAMES) * Math.PI * 2));
  const bag = (/** @type {number} */ x, /** @type {number} */ y) => x >= cx - 23 && x <= cx - 15 && y >= top + 34 && y <= top + 42;
  const body = (/** @type {number} */ x, /** @type {number} */ y) => { const j = y - top; if (j < 0 || j >= h) return false; const w = JUNO_HALF[j]; return x >= cx - w && x <= cx + w - 1; };
  const inside = (/** @type {number} */ x, /** @type {number} */ y) => body(x, y) || bag(x, y);
  for (let y = top - 1; y <= by + 1; y++) for (let x = cx - 25; x <= cx + 25; x++) {
    if (!inside(x, y)) continue;
    const edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
    put(x, y, edge && !inside(x, y - 1) ? cV : edge ? cU : (y + f) % 4 === 0 ? cw : 1);
  }
  for (let j = 1; j < 15; j++) put(cx, top + j, cu);                                                   // the hood's seam
  for (let j = 18; j < h; j++) { put(cx - 11 - (j > 30 ? 1 : 0), top + j, cu); put(cx + 10 + (j > 30 ? 1 : 0), top + j, cu); }   // the arms
  for (let j = 0; j < 22; j++) put(cx + 13 - j, top + 16 + Math.floor(j * 0.85), cU);                  // the strap
  for (let x = cx - 23; x <= cx - 15; x++) put(x, top + 37, cU);                                       // the bag's flap
}

// a glitch: rows slip sideways now and then
function glitch(/** @type {number} */ f, n = 2) {
  const b = B(), row = new Uint8Array(W);
  for (let i = 0; i < n; i++) {
    if (ih(f, i, 21) > 0.4) continue;
    const y0 = Math.floor(ih(f, i, 22) * H), h = 1 + Math.floor(ih(f, i, 23) * 4), dx = Math.round((ih(f, i, 24) - 0.5) * 10);
    for (let y = y0; y < Math.min(H, y0 + h); y++) {
      row.set(b.subarray(y * W, y * W + W));
      for (let x = 0; x < W; x++) b[y * W + x] = row[Math.max(0, Math.min(W - 1, x - dx))];
    }
  }
}

// ---- A: the data room
function roomA(/** @type {number} */ f) {
  const scroll = (f % FRAMES) / FRAMES;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y < HZ) {                                                       // the void, a haze of magenta down at the horizon
      let k = 3.2 - ((HZ - y) / HZ) * 3.4;
      if ((x * 7 + y * 13) % 17 === 0 && ih(x, y, 2) < 0.06) k = 5;     // far sleepers' points of light
      put(x, y, dk(k + (ih(x, y, 3) < 0.5 ? 0.25 : -0.25)));
      continue;
    }
    const dy = (y + 0.5 - HZ) / F, Z = 1.6 / dy, X = ((x + 0.5 - W / 2) / F) * Z, fw = (Z / F) * 0.9;
    const gz = Z * 0.9 + scroll, gx = X * 0.9;
    let k = 1 + Math.max(0, 3 - (y - HZ) * 0.12) * 0.8;
    if (Math.abs(gz - Math.round(gz)) < fw || Math.abs(gx - Math.round(gx)) < fw * 1.2) k = Math.max(k, 7.4 - Z * 0.12);
    put(x, y, dk(k));
  }
}
function threads(/** @type {number} */ f) {                     // from every picture a thread to the eye, a pulse running along it
  const ex = W / 2, ey = HZ - 20;
  A.panels.forEach((/** @type {any} */ p, /** @type {number} */ i) => {
    if (!p.box) return;
    const sx = (p.box[0] + p.box[2]) / 2, sy = p.box[3], n = Math.ceil(Math.hypot(ex - sx, ey - sy));
    for (let s = 0; s <= n; s++) {
      const x = Math.round(sx + ((ex - sx) * s) / n), y = Math.round(sy + ((ey - sy) * s) / n);
      if ((s / n + f / FRAMES + i * 0.13) % 1 < 0.06) put(x, y, 9); else if (s % 2 === 0) brighter(x, y, 2);
    }
  });
}
// the picture Juno can fly into has her brackets; the others the sleepers' marks on what they show
const TARGETS = Object.keys(Nagiwa.at.traum).filter((k) => /^cam\d/.test(k));
function drawA(/** @type {number} */ f) {
  roomA(f);
  eye(W / 2, HZ - 20, 44, 19, f, { cut: true, clip: HZ });
  rain(f, { where: (/** @type {number} */ x, /** @type {number} */ y) => y < HZ + 30 });
  for (const p of [...A.panels].sort((a, b) => b.z - a.z)) panel(p, f);
  threads(f);
  A.panels.forEach((/** @type {any} */ p, /** @type {number} */ i) => {
    const [x0, y0, x1, y1] = p.box;
    if (TARGETS.includes(p.cam)) marks(x0 - 2, y0 - 2, x1 + 2, y1 + 2, cU, 5);
    else if (ih(i, 1) < 0.8) { const x = Math.round(x0 + (x1 - x0) * 0.42), y = Math.round(y0 + (y1 - y0) * 0.4); marks(x, y, x + 4, y + 6, 9, 1); }
  });
  juno(A.juno.raum, f);
  glitch(f);
}

// ---- B: the tunnel of cameras, flown through as the shot's progress p goes from 0 to 1
const TW = 1.3, TH = 0.85, SEG = 1.5, TUNNEL = A.panels.map((/** @type {any} */ p) => p.img);
function drawB(/** @type {number} */ f, /** @type {number} */ p) {
  const cy = H / 2 - 4, scroll = p * SEG * 8 + ((f % FRAMES) / FRAMES) * SEG * 0.5;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = (x + 0.5 - W / 2) / F, dy = -(y + 0.5 - cy) / F;
    const tx = dx ? TW / Math.abs(dx) : 1e9, ty = dy ? TH / Math.abs(dy) : 1e9;
    const t = Math.min(tx, ty), wall = tx < ty ? (dx < 0 ? 0 : 1) : dy < 0 ? 2 : 3;
    if (t > 26) { put(x, y, 0); continue; }
    const z = t + scroll, across = wall < 2 ? (dy * t + TH) / (2 * TH) : (dx * t + TW) / (2 * TW);
    const seg = Math.floor(z / SEG), along = z / SEG - seg, fade = Math.min(8, t * 0.55);
    const gap = along < 0.06 || across < 0.04 || across > 0.96 || Math.abs(across - 0.5) < (wall < 2 ? 0.02 : 0.015);
    let k;
    if (gap) k = (along < 0.02 || across < 0.012 || across > 0.988 ? 6 : 2.2) - fade * 0.4;
    else {
      const half = across < 0.5 ? 0 : 1, ua = (across - half * 0.5) * 2, va = (along - 0.06) / 0.94;
      const img = pic(TUNNEL[Math.floor(ih(seg & 7, wall * 2 + half, 4) * TUNNEL.length)]);
      const u = wall < 2 ? va : ua, v = wall < 2 ? 1 - ua : va;
      k = (img ? sample(img, wall === 0 ? 1 - u : u, wall === 3 ? 1 - v : v) : 2) + 0.8 - fade;
      if ((y + f) % 3 === 0) k -= 0.8;
    }
    put(x, y, dk(k));
  }
  const cx = W / 2;                                                     // at the end of the tunnel: the eye, white light round it
  for (let y = cy - 16; y <= cy + 16; y++) for (let x = cx - 26; x <= cx + 26; x++) { const d = Math.hypot((x - cx) / 1.6, y - cy); if (d < 16) brighter(x, y, Math.round(4 - d / 4)); }
  eye(cx, cy, 15 + p * 30, 7 + p * 14, f);
  rain(f, { step: 6, len: 26, sparse: 0.55, where: (/** @type {number} */ x, /** @type {number} */ y) => Math.abs(x - W / 2) > 24 || Math.abs(y - H / 2) > 14 });
  juno(A.juno.tunnel, f);
  glitch(f, 3);
}

// ---- C: the picture made of code: each column a stream, its glyphs as bright as the picture under them, flaring where a head passes
function drawC(/** @type {string} */ cam, /** @type {number} */ f) {
  const p = A.panels.find((/** @type {any} */ q) => q.cam === cam), img = p && pic(p.img);
  for (let x = 0; x < W; x += 3) {
    const s = ih(x, 7) < 0.5 ? 5 : 10, P = 240, head = (Math.floor(ih(x, 3) * P) + f * s) % P;
    for (let y = 0; y < H; y++) {
      const on = GLYPH[(y + Math.floor(ih(x, 5) * 14)) % 14];
      const v = img ? (img[y * W + x] + img[y * W + Math.min(W - 1, x + 1)]) / 2 : 1;
      const dist = (head - y + P) % P, lit = dist < 3 ? 3 : dist < 10 ? 1.5 : dist < 24 ? 0.6 : 0;
      const k = on ? v + 0.4 + lit : lit > 1 ? v * 0.4 : 0;
      put(x, y, dk(k)); put(x + 1, y, dk(on ? k - 1.5 : 0)); put(x + 2, y, 0);
    }
  }
  const b = A[cam]?.becken;
  if (b) marks(b[0], b[1], b[2], b[3], cU, 5);
  juno(A.juno.code, f);
  glitch(f);
}

// ---- the shots: drawn at the dream's 10 frames a second, each frame kept until the next
let last = "";
/** @type {Record<string, (ctx: CanvasRenderingContext2D, p: number, t: number) => void>} */
const SHOTS = {};
/** @param {string} id @param {(f: number, p: number) => void} draw @param {(ctx: CanvasRenderingContext2D) => void} [over] */
function shot(id, draw, over) {
  SHOTS[id] = (ctx, p, t) => {
    const f = Math.floor(t / 100), k = `${id}:${f}:${p.toFixed(3)}`;
    surface();
    if (k !== last) { draw(f, p); last = k; }
    blit(ctx);
    if (!(pass.k > 0.2)) over?.(ctx);
  };
}
// (loaded before the intro's files: its `float` moves Nagiwa.intro.p, read here only while drawing)
Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
  const r = /** @type {any} */ (Cutaway.scene.room), draw = r?.dream && SHOTS[r.dream];
  if (draw) draw(ctx, Nagiwa.intro?.p ?? 0, Cutaway.clock.time);
});
const hud = (/** @type {CanvasRenderingContext2D} */ ctx, /** @type {string} */ s, /** @type {number} */ x, /** @type {number} */ y, align = "left") =>
  Cutaway.font.get("hud").draw(ctx, s, x, y, { color: CYAN[2], outline: RAMP[0], align });
const [BASIN] = Cutaway.i18n.declare("dream", ["BECKEN 3"]);
shot("traum_raum", (f) => drawA(f), (ctx) => {
  for (const p of A.panels) if (TARGETS.includes(p.cam) && p.box) hud(ctx, `CAM ${Nagiwa.cams[p.cam]?.id ?? p.cam.slice(3)}`, p.box[2] + 2, p.box[1] - 9, "right");
});
shot("traum_tunnel", (f, p) => drawB(f, p));
shot("traum_cam33", (f) => drawC("cam33", f), (ctx) => { const b = A.cam33.becken; hud(ctx, Nagiwa.t(BASIN, { part: "dream" }), b[0], b[3] + 2); });

// ---- the Witness: lowercase, white; behind his line the dream dims and the other voices say it too, offset, in magenta
let speaker = "";
Cutaway.events.on("say", (/** @type {{actor: string}} */ e) => { speaker = e.actor; });
Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
  const at = speaker === "zeuge" && Cutaway.ui.linePlacement?.();
  if (!at) return;
  const fo = Cutaway.ui.font(), lh = fo.lineHeight, f = Math.floor(Cutaway.clock.time / 100), jit = (/** @type {number} */ i) => (ih(f >> 1, i, 9) < 0.3 ? 1 : 0);
  at.lines.forEach((/** @type {string} */ s, /** @type {number} */ n) => {
    const y = at.y + n * lh, w = fo.measure(s);
    ctx.fillStyle = "rgba(3, 0, 6, 0.72)";
    ctx.fillRect(Math.round(at.x - w / 2 - 8), y - 3, Math.round(w + 16), lh + 4);
    fo.draw(ctx, s, at.x - 3 - jit(1), y + 1, { color: RAMP[4], align: "center" });
    fo.draw(ctx, s, at.x + 3 + jit(2), y - 1, { color: RAMP[5], align: "center" });
    fo.draw(ctx, s, at.x + jit(3), y + 2, { color: RAMP[6], align: "center" });
  });
});
Cutaway.actor("zeuge", { name: "Der Zeuge", color: RAMP[9], voice: { pitch: 50, range: 10, wave: "sine", syllable: 90, speed: 0.8 } });

// ---- the rooms. Nothing in them is a state of its own: the way in and out are plain steps
const ROOM = { color: RAMP[0], observe: true, lines: "top", ambience: ["feed_hiss"], music: { theme: "glass", intensity: 0.15 } };
const IN_33 = [{ sfx: "link" }, { goto: "traum_tunnel", transition: "dissolve" }, { sfx: "traum_flug" }, { float: [0, 1], ms: 5200, ease: "in" },
  { sfx: "traum_blitz" }, { dream: "flash", ms: 1800, ease: "out", wait: false }, { goto: "traum_cam33", transition: false }, { wait: 1500 },
  { say: "zeuge", text: "wenn ich schlaf, ist alles still." }];
/** @type {Record<string, any>} */
const hotspots = {};
for (const p of A.panels) {
  const cs = corners(p, 0).map((q) => q.map(Math.round)).flat(), id = Nagiwa.cams[p.cam]?.id ?? p.cam.slice(3);
  hotspots[`p_${p.cam}`] = { name: `CAM ${id}`, poly: cs,
    look: TARGETS.includes(p.cam) ? ["CAM 33. Die Pumpenhalle, von oben.", "Teo hat da gearbeitet."] : ["Ein Bild von vielen. Alle schlafen darin."],
    use: TARGETS.includes(p.cam) ? IN_33 : ["Da drin ist keiner, den ich suche."] };
}
Cutaway.room("traum", { ...ROOM, name: "Traum", dream: "traum_raum", hotspots });
Cutaway.room("traum_tunnel", { ...ROOM, name: "Traum", dream: "traum_tunnel" });
Cutaway.room("traum_cam33", { ...ROOM, name: "CAM 33", dream: "traum_cam33", hotspots: {
  becken: { name: "Becken 3", poly: A.cam33.beckenPoly, look: "Das Becken. Von oben ist es ein Loch aus Licht." } } });
})();
