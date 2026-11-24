// Style mockup G: the dream, a third mode beside street and feed (story §10k, kapitel3-design §3.5). 320x180, 24 frames at 10 fps.
// Juno on Lull with her implant awake: inside the sleepers' net, which looks like nothing else in the game. Magenta and white
// (Lull, the sleepers, the Witness), Juno the one cyan thing, because she is the only one awake in it. Three variants:
//   A  mock_g_traum_raum    the data room: feeds hang in a void over a grid that runs to a horizon, where the Witness's eye rises
//                           like a sun; threads run from every picture to it; the Lull beat falls in columns like code
//   B  mock_g_traum_tunnel  the stream: a tunnel whose walls are the city's cameras, flown through toward the eye at its end
//   C  mock_g_traum_glyphen the picture made of code: CAM 33 built from the falling beat, the sleepers marked, Juno in it
// The feeds are the game's own (art/mockups/traum_src: copies of build/art/cams/scenes, the phosphor pictures), read pixel by
// pixel and put into the dream's ramp. The Witness speaks in lowercase, many voices over each other (dialog-style-guide).
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",        // phosphor, as the pictures come in
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
  a: "#030006", b: "#0b0213", c: "#170520", d: "#260830", e: "#3e0c45",        // the dream: black-violet to magenta to white
  f: "#62125c", g: "#92207f", h: "#d23fb4", i: "#ff8fe0", j: "#fff1fb",
  w: "#0b3340", u: "#1a8fa0", U: "#3ff2ff", V: "#dafcff",                                    // Juno: the implant's cyan
})
ramps("abcdefghij", "wuUV")
include("../lib/text.js")

const W = 320, H = 180, FRAMES = 24
const DR = "abcdefghij"
const di = (k) => DR.indexOf(k)
const dk = (i) => DR[Math.max(0, Math.min(9, Math.round(i)))]
const ih = (a, b = 0, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
const put = (c, x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) c.px(x, y, k) }
const brighter = (c, x, y, n) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const k = c.key(x, y), i = di(k); c.px(x, y, dk(Math.max(i, 0) + n)) }

// Lull's beat over the loop: long, short, short, long, pause (style guide §6, Nagiwa.lullBeat)
const BEAT = "111111001100110011111100"
const beat = (f) => BEAT[f % FRAMES] === "1"

// ================================================================ the cameras' pictures
const SRC = ["cam33_pause", "cam31_bg", "cam04_bg", "cam18_bg", "cam51_bg", "cam22_bg", "cam03_bg", "cam24_bg", "cam21_bg", "cam30_bg"]
SRC.forEach((n) => sprite("_" + n, { png: "traum_src/" + n + ".png", palettize: true }))
const IMG = {}
function capture(c) {                    // stamp each picture, read it into rows of phosphor values, then clear
  if (IMG.done) return
  for (const n of SRC) {
    c.stamp("_" + n, 0, 0)
    const rows = []
    for (let y = 0; y < H; y++) { const r = new Uint8Array(W); for (let x = 0; x < W; x++) { const k = c.key(x, y); r[x] = k >= "0" && k <= "9" ? +k : 0 } rows.push(r) }
    IMG[n] = rows
  }
  IMG.done = true
}
const sample = (n, u, v) => IMG[n][Math.max(0, Math.min(H - 1, Math.floor(v * H)))][Math.max(0, Math.min(W - 1, Math.floor(u * W)))]

// ================================================================ the camera of the dream
const F = 170
function proj(P, cy) { return [W / 2 + F * P[0] / P[2], cy - F * P[1] / P[2]] }

// a picture hanging in space: centre P, size w x h (world), turned by yaw; drawn by casting every pixel of its box onto its plane
function feedPanel(c, p, cy, f) {
  const th = p.yaw, r = [Math.cos(th), 0, Math.sin(th)], n = [-Math.sin(th), 0, Math.cos(th)]
  const P0 = [p.x, p.y + Math.sin((f / FRAMES) * Math.PI * 2 + p.ph) * 0.04, p.z]
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => proj([P0[0] + r[0] * sx * p.w / 2, P0[1] + sy * p.h / 2, P0[2] + r[2] * sx * p.w / 2], cy))
  const xs = corners.map((q) => q[0]), ys = corners.map((q) => q[1])
  const x0 = Math.floor(Math.min(...xs)), x1 = Math.ceil(Math.max(...xs)), y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys))
  const nd = P0[0] * n[0] + P0[1] * n[1] + P0[2] * n[2]
  const fade = Math.max(0, Math.min(2.5, (p.z - 3) * 0.3))           // the farther, the darker
  for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(W - 1, x1); x++) {
    const d = [(x + 0.5 - W / 2) / F, -(y + 0.5 - cy) / F, 1], dn = d[0] * n[0] + d[1] * n[1] + d[2] * n[2]
    const t = nd / dn, L = [d[0] * t - P0[0], d[1] * t - P0[1], d[2] * t - P0[2]]
    const u = (L[0] * r[0] + L[2] * r[2]) / p.w + 0.5, v = 0.5 - L[1] / p.h
    if (u < 0 || u >= 1 || v < 0 || v >= 1) continue
    const edge = u < 0.012 || u > 0.988 || v < 0.02 || v > 0.98
    let k = edge ? 8 : sample(p.img, u, v) * 0.8 + 1.3
    if (!edge && ((y + f) % 3 === 0)) k -= 1                          // the dream's own scanlines, drifting
    c.px(x, y, dk(k - fade))
  }
  p.box = [x0, y0, x1, y1]; p.corners = corners
}
// the sleepers' corner marks around a box (Frau Haldane's four corners)
function marks(c, x0, y0, x1, y1, k, n = 2) {
  for (let i = 0; i < n; i++) { put(c, x0 + i, y0, k); put(c, x0, y0 + i, k); put(c, x1 - i, y0, k); put(c, x1, y0 + i, k)
    put(c, x0 + i, y1, k); put(c, x0, y1 - i, k); put(c, x1 - i, y1, k); put(c, x1, y1 - i, k) }
}
// Juno's brackets, cyan as everywhere: the one awake
function brackets(c, x0, y0, x1, y1, k, n = 4) { marks(c, x0, y0, x1, y1, k, n) }

// ================================================================ the beat falling like code
// columns of Lull's beat, read downward: a long dash, two short, a long, a pause; the head white, the tail fading
const GLYPH = [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0]
function rain(c, f, o = {}) {
  const step = o.step ?? 4, len = o.len ?? 34, where = o.where ?? (() => true)
  for (let x = 1; x < W; x += step) {
    const r = ih(x, 7), s = r < 0.45 ? 5 : r < 0.8 ? 10 : 15, P = s === 15 ? 360 : 240
    if (ih(x, 11) < (o.sparse ?? 0.35)) continue
    const head0 = (Math.floor(ih(x, 3) * P) + f * s) % P
    for (const head of [head0 - P, head0, head0 + P]) for (let i = 0; i < len; i++) {
      const y = head - i
      if (y < 0 || y >= H || !where(x, y)) continue
      if (!GLYPH[(i + Math.floor(ih(x, 5) * 14)) % 14]) continue
      const k = i === 0 ? 9 : i < 3 ? 8 : 7 - Math.floor((i / len) * 5)
      if (k < 2) continue
      const cur = di(c.key(x, y))
      if (k > cur) c.px(x, y, dk(k))
    }
  }
}

// ================================================================ the Witness's eye
function eye(c, ex, ey, rx, ry, f, o = {}) {
  const open = o.open ?? 1, pr = (beat(f) ? 0.34 : 0.26) * ry * 2
  for (let y = Math.floor(ey - ry - 3); y <= ey + ry + 3; y++) for (let x = Math.floor(ex - rx - 3); x <= ex + rx + 3; x++) {
    const nx = (x - ex) / rx, ny = (y - ey) / (ry * open)
    const lid = 1 - nx * nx                                            // the almond: two arcs
    const inside = Math.abs(ny) < lid
    if (o.clip && y >= o.clip) continue                                // a sun on the horizon: what lies under it is the grid's
    if (!inside) { if (Math.abs(ny) < lid + 0.18 && Math.abs(nx) < 1) put(c, x, y, "g"); continue }
    if (o.cut && y > ey && (y - ey) % 3 === 0) { put(c, x, y, "d"); continue }   // the cuts of a horizon's sun
    const dr = Math.hypot(x - ex, (y - ey) * 1.05)
    let k = 8 - Math.abs(ny) * 2                                       // the white, lit from inside
    if (dr < ry * 0.95) k = 6 + Math.sin(dr * 1.7 + f * 0.5) * 0.8      // the iris: rings
    if (dr < ry * 0.95 && dr > ry * 0.85) k = 4
    if (dr < pr) k = dr > pr - 1 ? 8 : 0                                // the pupil, wider on the beat
    if (dr < pr && Math.hypot(x - ex + pr * 0.35, y - ey + pr * 0.35) < 1.3) k = 9
    put(c, x, y, dk(k))
  }
}

// ================================================================ Juno, from behind: an outline in cyan, scanned
// half widths row by row: the hood (rounded, a little peaked), the shoulders falling away, the slicker widening to the hem
const JUNO_HALF = [2, 4, 5, 6, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21]
function juno(c, cx, by, f) {
  const h = JUNO_HALF.length, bob = Math.round(Math.sin(f / FRAMES * Math.PI * 2) * 1), top = by - h + 1 + bob
  const bag = (x, y) => x >= cx - 23 && x <= cx - 15 && y >= top + 34 && y <= top + 42      // the bag on her left hip
  const body = (x, y) => { const j = y - top; if (j < 0 || j >= h) return false; const w = JUNO_HALF[j]; return x >= cx - w && x <= cx + w - 1 }
  const inside = (x, y) => body(x, y) || bag(x, y)
  for (let y = top - 1; y <= by + 1; y++) for (let x = cx - 25; x <= cx + 25; x++) {
    if (!inside(x, y)) continue
    const edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)
    const lit = edge && !inside(x, y - 1)
    put(c, x, y, lit ? "V" : edge ? "U" : (y + f) % 4 === 0 ? "w" : "b")
  }
  for (let j = 1; j < 15; j++) put(c, cx, top + j, "u")                                   // the hood's seam
  for (let j = 18; j < h; j++) { put(c, cx - 11 - (j > 30 ? 1 : 0), top + j, "u"); put(c, cx + 10 + (j > 30 ? 1 : 0), top + j, "u") }   // the arms
  for (let j = 0; j < 22; j++) put(c, cx + 13 - j, top + 16 + Math.floor(j * 0.85), "U")  // the strap, right shoulder to left hip
  for (let x = cx - 23; x <= cx - 15; x++) put(c, x, top + 37, "U")                        // the bag's flap
}

// ================================================================ the Witness's line: many voices, lowercase
function voices(c, x, y, s, f) {
  const jit = (i) => (ih(f >> 1, i, 9) < 0.3 ? 1 : 0), w = TXT.measure(s)
  for (let yy = y - 3; yy < y + 11; yy++) for (let xx = x - w / 2 - 8; xx < x + w / 2 + 8; xx++) {     // the dream dims behind the voices
    if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue
    const i = di(c.key(Math.round(xx), yy)); if (i >= 0) c.px(Math.round(xx), yy, dk(Math.min(i, 2) - (Math.abs(xx - x) > w / 2 + 3 ? 0 : 1)))
  }
  TXT.draw(c, x - 3 - jit(1), y + 1, s, "e", { align: "center" })
  TXT.draw(c, x + 3 + jit(2), y - 1, s, "f", { align: "center" })
  TXT.draw(c, x + jit(3), y + 2, s, "g", { align: "center" })
  TXT.draw(c, x, y, s, "j", { align: "center" })
}

// a glitch: rows slip sideways now and then
function glitch(c, f, n = 2) {
  for (let i = 0; i < n; i++) {
    if (ih(f, i, 21) > 0.4) continue
    const y = Math.floor(ih(f, i, 22) * H), h = 1 + Math.floor(ih(f, i, 23) * 4), dx = Math.round((ih(f, i, 24) - 0.5) * 10)
    c.warp(() => [dx, 0], [0, y, W, h])
  }
}

// ================================================================ A: the data room
const HZ = 74
const PANELS_A = [
  { img: "cam24_bg", x: -0.3, y: 3.5, z: 12, w: 1.6, h: 0.9, yaw: 0.0, ph: 0.7 },
  { img: "cam18_bg", x: -1.7, y: 2.6, z: 8.5, w: 1.6, h: 0.9, yaw: 0.2, ph: 1.3 },
  { img: "cam51_bg", x: 1.7, y: 2.6, z: 8.5, w: 1.6, h: 0.9, yaw: -0.2, ph: 2.1 },
  { img: "cam31_bg", x: 4.3, y: 2.3, z: 7.5, w: 1.6, h: 0.9, yaw: -0.45, ph: 3.0 },
  { img: "cam22_bg", x: -4.3, y: 1.7, z: 7, w: 1.6, h: 0.9, yaw: 0.5, ph: 4.0 },
  { img: "cam03_bg", x: 5.3, y: -0.2, z: 7.2, w: 1.6, h: 0.9, yaw: -0.6, ph: 5.0 },
  { img: "cam21_bg", x: -5.2, y: -0.1, z: 6.8, w: 1.6, h: 0.9, yaw: 0.6, ph: 1.9 },
  { img: "cam04_bg", x: -2.2, y: 0.45, z: 3.9, w: 1.6, h: 0.9, yaw: 0.35, ph: 0.0 },
  { img: "cam33_pause", x: 1.95, y: 0.5, z: 3.6, w: 1.6, h: 0.9, yaw: -0.3, ph: 2.6 },   // the one she looks at
]
function roomA(c, f) {
  const scroll = f / FRAMES
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y < HZ) {                                                       // the void, a haze of magenta down at the horizon
      const t = (HZ - y) / HZ
      let k = 3.2 - t * 3.4
      if (((x * 7 + y * 13) % 17 === 0) && ih(x, y, 2) < 0.06) k = 5     // far sleepers' points of light
      c.px(x, y, dk(k + (ih(x, y, 3) < 0.5 ? 0.25 : -0.25)))
      continue
    }
    const dy = (y + 0.5 - HZ) / F, Z = 1.6 / dy, X = ((x + 0.5 - W / 2) / F) * Z, fw = Z / F * 0.9
    const gz = Z * 0.9 + scroll, gx = X * 0.9
    const lz = Math.abs(gz - Math.round(gz)) < fw, lx = Math.abs(gx - Math.round(gx)) < fw * 1.2
    const haze = Math.max(0, 3 - (y - HZ) * 0.12)
    let k = 1 + haze * 0.8
    if (lz || lx) k = Math.max(k, 7.4 - Z * 0.12)
    c.px(x, y, dk(k))
  }
}
function threadsA(c, f) {           // from every picture a thread to the eye, a pulse running along it
  const [ex, ey] = [W / 2, HZ - 20]
  PANELS_A.forEach((p, i) => {
    if (!p.box) return
    const sx = (p.box[0] + p.box[2]) / 2, sy = p.box[3]
    const n = Math.ceil(Math.hypot(ex - sx, ey - sy))
    for (let s = 0; s <= n; s++) {
      const x = Math.round(sx + (ex - sx) * s / n), y = Math.round(sy + (ey - sy) * s / n)
      const pulse = ((s / n) + f / FRAMES + i * 0.13) % 1
      if (pulse < 0.06) put(c, x, y, "j"); else if (s % 2 === 0) brighter(c, x, y, 2)
    }
  })
}
anim("_clock", { w: 1, h: 1, frames: FRAMES, fps: 10 }, () => {})
scene("mock_g_traum_raum", { w: W, h: H, bg: "a" },
  layer("clock", stamp("_clock", -4, -4)),
  (c) => { capture(c); roomA(c, c.frame) },
  (c) => eye(c, W / 2, HZ - 20, 44, 19, c.frame, { cut: true, clip: HZ }),
  (c) => rain(c, c.frame, { where: (x, y) => y < HZ + 30 }),
  (c) => { for (const p of [...PANELS_A].sort((a, b) => b.z - a.z)) feedPanel(c, p, HZ, c.frame) },
  (c) => threadsA(c, c.frame),
  (c) => {                           // the sleepers' marks on what the pictures show, and Juno's on the one she looks at
    for (const p of PANELS_A) if (p.box && p.img !== "cam33_pause") { const [x0, y0, x1, y1] = p.box, w = x1 - x0
      if (ih(PANELS_A.indexOf(p), 1) < 0.8) marks(c, Math.round(x0 + w * 0.42), Math.round(y0 + (y1 - y0) * 0.4), Math.round(x0 + w * 0.42) + 4, Math.round(y0 + (y1 - y0) * 0.4) + 6, "j", 1) }
    const p = PANELS_A[8], [x0, y0, x1, y1] = p.box
    brackets(c, x0 - 2, y0 - 2, x1 + 2, y1 + 2, "U", 5)
    TXT.draw(c, x1 + 2, y0 - 9, "CAM 33", "U", { font: "hud", align: "right", outline: "a" })
  },
  glow("j", { r: 4, strength: 0.4, ramp: 0 }),
  (c) => juno(c, 112, H + 6, c.frame),
  (c) => voices(c, W / 2, 10, "wir haben dich gesehen. jede nacht.", c.frame),
  (c) => glitch(c, c.frame),
)

// ================================================================ B: the tunnel of cameras
const TW = 1.3, TH = 0.85, SEG = 1.5
function tunnelB(c, f) {
  const cy = H / 2 - 4, scroll = (f / FRAMES) * SEG * 2
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = (x + 0.5 - W / 2) / F, dy = -(y + 0.5 - cy) / F
    const tx = dx ? TW / Math.abs(dx) : 1e9, ty = dy ? TH / Math.abs(dy) : 1e9
    const t = Math.min(tx, ty), wall = tx < ty ? (dx < 0 ? 0 : 1) : (dy < 0 ? 2 : 3)
    const z = t + scroll, across = wall < 2 ? (dy * t + TH) / (2 * TH) : (dx * t + TW) / (2 * TW)
    const seg = Math.floor(z / SEG), along = (z / SEG) - seg
    const fade = Math.min(8, t * 0.55)
    let k
    if (t > 26) { k = 0; c.px(x, y, "a"); continue }
    const gap = along < 0.06 || across < 0.04 || across > 0.96 || (wall < 2 && Math.abs(across - 0.5) < 0.02) || (wall >= 2 && Math.abs(across - 0.5) < 0.015)
    if (gap) k = (along < 0.02 || across < 0.012 || across > 0.988 ? 6 : 2.2) - fade * 0.4
    else {
      const half = across < 0.5 ? 0 : 1, ua = (across - half * 0.5) * 2, va = (along - 0.06) / 0.94
      const img = SRC[Math.floor(ih(((seg % 2) + 2) % 2, wall * 2 + half, 4) * SRC.length)]
      const u = wall < 2 ? va : ua, v = wall < 2 ? 1 - ua : va
      k = sample(img, wall === 0 ? 1 - u : u, wall === 3 ? 1 - v : v) + 0.8 - fade
      if ((y + f) % 3 === 0) k -= 0.8
    }
    c.px(x, y, dk(k))
  }
}
scene("mock_g_traum_tunnel", { w: W, h: H, bg: "a" },
  layer("clock", stamp("_clock", -4, -4)),
  (c) => { capture(c); tunnelB(c, c.frame) },
  (c) => {                           // at the end of the tunnel: the eye, white light round it
    const cx = W / 2, cy = H / 2 - 4
    for (let y = cy - 16; y <= cy + 16; y++) for (let x = cx - 26; x <= cx + 26; x++) { const d = Math.hypot((x - cx) / 1.6, y - cy); if (d < 16) brighter(c, x, y, Math.round(4 - d / 4)) }
    eye(c, cx, cy, 15, 7, c.frame)
  },
  (c) => rain(c, c.frame, { step: 6, len: 26, sparse: 0.55, where: (x, y) => Math.abs(x - W / 2) > 24 || Math.abs(y - H / 2) > 14 }),
  (c) => {                           // one picture lit as she passes it: Juno's brackets
    // the lower half of the left wall's picture two segments on: projected as the tunnel draws it, so the brackets track it
    const cy = H / 2 - 4, scroll = (c.frame / FRAMES) * SEG * 2, k = Math.ceil((1.3 + scroll) / SEG)
    const z0 = (k + 0.06) * SEG - scroll, z1 = (k + 1) * SEG - scroll
    const x0 = Math.round(W / 2 - F * TW / z0) + 1, x1 = Math.round(W / 2 - F * TW / z1) - 1
    const y0 = Math.round(cy + 3), y1 = Math.round(Math.min(H - 2, cy + F * TH / z0 - 2))
    brackets(c, Math.max(1, x0), y0, x1, y1, "U", 4)
    TXT.draw(c, Math.max(2, x0 + 1), y0 - 8, "CAM 22", "U", { font: "hud", outline: "a" })
  },
  glow("j", { r: 5, strength: 0.45, ramp: 0 }),
  (c) => juno(c, W / 2, H - 1, c.frame),
  (c) => voices(c, W / 2, 10, "sie geht zur treppe. sie geht zur treppe.", c.frame),
  (c) => glitch(c, c.frame, 3),
)

// ================================================================ C: the picture made of code
// CAM 33, the pump hall's shaft from the rim, built only from the falling beat: each column a stream, its glyphs as bright
// as the picture under them; where a stream's head passes, the picture flares white. The sleepers on the bench are marked.
function glyphsC(c, f) {
  const img = IMG["cam33_pause"]
  for (let x = 0; x < W; x += 3) {
    const r = ih(x, 7), s = r < 0.5 ? 5 : 10, P = 240
    const head = (Math.floor(ih(x, 3) * P) + f * s) % P
    for (let y = 0; y < H; y++) {
      const gi = (y + Math.floor(ih(x, 5) * 14)) % 14
      const on = GLYPH[gi]
      const v = (img[y][x] + img[y][Math.min(W - 1, x + 1)]) / 2
      let dist = (head - y + P) % P                                      // how far behind the head
      const lit = dist < 3 ? 3 : dist < 10 ? 1.5 : dist < 24 ? 0.6 : 0
      const k = on ? v + 0.4 + lit : (lit > 1 ? v * 0.4 : 0)
      c.px(x, y, dk(k)); c.px(x + 1, y, dk(on ? k - 1.5 : 0)); c.px(x + 2, y, "a")
    }
  }
}
scene("mock_g_traum_glyphen", { w: W, h: H, bg: "a" },
  layer("clock", stamp("_clock", -4, -4)),
  (c) => { capture(c); glyphsC(c, c.frame) },
  (c) => {
    brackets(c, 136, 78, 194, 126, "U", 5)
    TXT.draw(c, 136, 128, "BECKEN 3", "U", { font: "hud", outline: "a" })
  },
  glow("j", { r: 3, strength: 0.35, ramp: 0 }),
  (c) => juno(c, 58, H + 6, c.frame),
  (c) => voices(c, W / 2, 8, "wenn ich schlaf, ist alles still.", c.frame),
  (c) => glitch(c, c.frame),
)
