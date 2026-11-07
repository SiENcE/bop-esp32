// Mockup C: isometric (2:1 dimetric), the corner outside LUCKY STATIC seen from above at the iso
// angle of the 90s cyber/tactical RPGs. Two building walls meet at the back: the noodle bar on the
// left, the broken ad screen on the right; the street floor in front; a slim UI over it.
// How it is built: the walls are drawn flat (as elevations, x along the wall, e = height) and
// sheared onto the 2:1 slope by warp(); the floor, its light pools, puddles and the boxes standing
// on it are painted per pixel from their iso coordinates (u along the right wall, v along the left
// wall, h up), so every edge steps 2 across and 1 down. Puddles mirror the walls drawn above them
// (the key of the mirrored pixel), so the neon lands in them where it should.
// 320x180, a 12-frame loop at 10 fps: rain, the screen's static, the eye, a neon letter, steam.
include("../../.claude/skills/claude-pxl/lib/ui/font5x7.px.js")

pal({
  k: "#0c0e1a",                                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",  // night concrete, steel
  e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",                // wet paving, asphalt
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",                              // magenta neon
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",                // the bar's warm light
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",                              // the screen's cyan
  r: "#7e1420", q: "#ff3a3a",                                                          // drone red
  j: "#9a7406", y: "#eec414", Y: "#fff070",                                            // Juno's slicker
  s: "#93583f", S: "#d79676",                                                          // skin
  g: "#565e70", G: "#8e96a8",                                                          // satchel grey
  u: "#30264c", U: "#4d3f78",                                                          // the cook's umbrella
  h: "#7d8ca4", H: "#b9c6d8",                                                          // steam, white cloth
  a: "#2c2026", A: "#4a3026",                                                          // floor in warm light
  i: "#2a1636", I: "#46204e",                                                          // floor in magenta light
  t: "#11303d", T: "#1b495a",                                                          // floor in cyan light
  w: "#3a4c64", x: "#6c809a",                                                          // the searchlight
})
ramps("k123456", "efzZX", "nMmN", "OPQRW", "cCvV", "rq", "jyY", "sS", "gG", "uU", "hH", "aA", "iI", "tT", "wx")

// ---------------------------------------------------------------- iso helpers
const W = 320, H = 180, CX = 150, CY = 50, NF = 12   // (CX, CY): the back corner at the foot of the walls
const fl = Math.floor
const P = (u, v, h = 0) => [CX + 2 * u - 2 * v, CY + u + v - h]
const ybase = (x) => CY + (x >= CX ? fl((x - CX) / 2) : fl((CX - x) / 2))      // foot of the walls per column
const uvAt = (x, y, h = 0) => { const d = (x - CX) / 2, s = y - CY + h; return [(s + d) / 2, (s - d) / 2] }
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const bay = (x, y) => (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16
const ihash = (a, b = 0) => { let q = (a * 374761393 + b * 668265263) | 0; q = (q ^ (q >>> 13)) * 1274126177; return ((q ^ (q >>> 16)) >>> 0) / 4294967296 }
// a flat point of a wall onto the screen: right wall ux = px from the corner, left wall lx = screen x
const atR = (ux, e) => [CX + ux, CY + fl(ux / 2) - e]
const atL = (lx, e) => [lx, CY + fl((CX - lx) / 2) - e]

// Drawing an elevation: e counts up from the foot (row hf - 1).
const flat = (c, hf) => ({
  rect: (x, e, w, h, k) => c.rect(x, hf - e - h, w, h, k),
  hl: (x, e, w, k) => c.hline(x, hf - 1 - e, w, k),
  vl: (x, e, h, k) => h > 0 && c.vline(x, hf - e - h, h, k),
  px: (x, e, k) => c.px(x, hf - 1 - e, k),
  text: (x, eTop, s, k, o) => c.text(x, hf - 1 - eTop, s, k, o),
  ell: (x, e, rx, ry, k) => c.ellipse(x, hf - 1 - e, rx, ry, k),
  line: (x0, e0, x1, e1, k) => c.line(x0, hf - 1 - e0, x1, hf - 1 - e1, k),
  is: (x, e, k) => c.is(x, hf - 1 - e, k),
})
// light from a lit rectangle tinting the wall round it, dithered off over `r` px
const halo = (F, [x0, e0, w, h], r, map, p = 0.85) => {
  for (let x = x0 - r; x < x0 + w + r; x++) for (let e = Math.max(0, e0 - r); e < e0 + h + r; e++) {
    const dx = Math.max(x0 - x, 0, x - (x0 + w - 1)), de = Math.max(e0 - e, 0, e - (e0 + h - 1)), d = Math.hypot(dx, de)
    if (d === 0 || d > r || bay(x, e) > p * (1 - d / r)) continue
    for (const [from, to] of Object.entries(map)) if (F.is(x, e, from)) { F.px(x, e, to); break }
  }
}

// A box standing on the floor: its top, its +v face (toward the lower left, parallel to the right
// wall) and its +u face (toward the lower right), each painted by a function of its own flat
// coordinates: top(u, v), front(a, e), side(b, e), a and b in px from the face's left edge.
function isoBox(c, u0, v0, h0, du, dv, dh, top, front, side) {
  const x0 = P(u0, v0 + dv)[0], x1 = P(u0 + du, v0)[0], y0 = P(u0, v0, h0 + dh)[1], y1 = P(u0 + du, v0 + dv, h0)[1]
  const V = v0 + dv, U = u0 + du
  for (let y = y0; y <= y1; y++) for (let x = x0; x < x1; x++) {
    const d = (x - CX) / 2, s = y - CY + h0 + dh, tu = (s + d) / 2, tv = (s - d) / 2
    if (tu >= u0 && tu < U && tv >= v0 && tv < V) { const k = top(tu - u0, tv - v0); if (k) c.px(x, y, k); continue }
    const fa = x - (CX + 2 * u0 - 2 * V), fe = CY + fl(d) + 2 * V - y - h0
    if (fa >= 0 && fa < 2 * du && fe >= 0 && fe < dh) { const k = front(fa, fe); if (k) c.px(x, y, k); continue }
    const sb = x - (CX + 2 * U - 2 * V), se = CY + 2 * U + fl(-d) - y - h0
    if (sb >= 0 && sb < 2 * dv && se >= 0 && se < dh) { const k = side(sb, se); if (k) c.px(x, y, k) }
  }
}

// ---------------------------------------------------------------- the left wall: LUCKY STATIC
const HL = 130
const SIGN_X = 23                       // "LUCKY STATIC" written from here, 5x7, its top at e 54
sprite("_wallL", { w: 150, h: HL + 76 }, (c) => {
  const F = flat(c, HL)
  // ground storey: concrete panels, a joint halfway up, grime run down from the cornice and the joint
  F.rect(0, 0, 150, 60, "3")
  for (let x = 24; x < 150; x += 25) F.vl(x, 0, 60, "2")
  F.hl(0, 30, 150, "2")
  for (let x = 0; x < 150; x++) {
    const g = ihash(x, 3); if (g < 0.4) F.vl(x, 60 - 1 - fl(g * 25), 1 + fl(g * 25), "2")
    const g2 = ihash(x, 9); if (g2 < 0.25) F.vl(x, 29 - fl(g2 * 30), 1 + fl(g2 * 30), "2")
  }
  F.rect(0, 0, 150, 4, "2"); F.hl(0, 4, 150, "4")
  for (let x = 0; x < 150; x++) if (bay(x, 1) < 0.5) F.px(x, 5, "2")
  // the storey above and the cornice between
  F.rect(0, 66, 150, 64, "2")
  for (let x = 30; x < 150; x += 30) F.vl(x, 66, 64, "1")
  F.rect(0, 60, 150, 6, "4"); F.hl(0, 65, 150, "5"); F.hl(0, 60, 150, "1")
  const WIN = [[8, 76, "amber"], [40, 76, "tv"], [72, 76, null], [104, 76, null], [8, 106, null], [40, 106, "amber"], [72, 106, null]]
  for (const [x, e, lit] of WIN) {
    F.rect(x - 1, e - 1, 20, 20, "1")
    if (lit === "amber") { F.rect(x, e, 18, 18, "P"); for (let k = 2; k < 18; k += 3) F.hl(x, e + k, 18, "O") }
    else if (lit === "tv") { F.rect(x, e, 18, 18, "c"); F.rect(x + 3, e + 3, 9, 7, "C"); F.hl(x + 3, e + 9, 9, "v") }
    else { F.rect(x, e, 18, 18, "k"); for (let k = 0; k < 6; k++) F.px(x + 12 + k, e + 17 - k, "2") }
    F.vl(x + 9, e, 18, "1"); F.hl(x - 2, e - 2, 22, "4")
  }
  F.rect(84, 66, 14, 8, "4"); F.hl(84, 73, 14, "5"); for (let k = 0; k < 3; k++) F.hl(86, 67 + 2 * k, 10, "2")   // an AC unit
  F.vl(2, 0, 130, "4"); F.vl(3, 0, 130, "5"); F.vl(4, 0, 130, "2"); for (let e = 12; e < 130; e += 22) F.hl(1, e, 5, "1")   // drainpipe

  // the window: lamps, a counter, two customers' backs, steam on the glass
  F.rect(13, 7, 49, 33, "1"); F.rect(15, 9, 45, 29, "P"); F.rect(15, 29, 45, 9, "Q")
  for (let x = 15; x < 60; x++) if (bay(x, 2) < 0.5) F.px(x, 28, "Q")
  for (const lx of [22, 36, 50]) { F.vl(lx, 34, 4, "O"); F.rect(lx - 1, 32, 3, 2, "R"); F.px(lx, 31, "W") }
  F.rect(15, 9, 45, 5, "O"); F.hl(15, 14, 45, "Q")
  for (const [x, w] of [[24, 9], [33, 8]]) { F.rect(x - (w >> 1), 14, w, 7, "O"); F.ell(x, 23, 3, 3, "O") }
  for (let x = 15; x < 60; x++) for (let e = 15; e < 38; e++) if (ihash(x * 5, e * 3) < 0.07 && F.is(x, e, "PQ")) F.px(x, e, "R")
  F.vl(41, 9, 29, "1")
  F.text(45, 26, "OPEN", "m")
  F.hl(12, 6, 51, "4"); F.hl(12, 7, 51, "5")
  // the door: open, the bar's light pouring out under a noren of four strips
  F.rect(63, 0, 26, 43, "1"); F.rect(65, 0, 22, 41, "R"); F.rect(68, 0, 16, 36, "W")
  for (let x = 65; x < 87; x++) { const p = (x - 65) % 5; if (p === 4) continue; F.vl(x, 28 - (p === 1 ? 1 : 0), 13 + (p === 1 ? 1 : 0), p === 3 ? "n" : "M") }
  for (let i = 0; i < 4; i++) F.px(66 + i * 5, 34, "N")
  F.rect(60, 0, 32, 2, "4"); F.hl(60, 1, 32, "5")
  // the sign: a dark box, a tube border, LUCKY STATIC; its light tints the wall round it
  halo(F, [8, 44, 96, 14], 7, { 3: "n", 2: "n", 4: "M" })
  halo(F, [63, 0, 26, 43], 6, { 3: "O", 2: "O", 4: "P" }, 0.7)
  halo(F, [13, 7, 49, 33], 4, { 3: "O", 2: "O" }, 0.5)
  F.rect(8, 44, 96, 14, "k"); F.rect(9, 45, 94, 12, "n")
  F.hl(10, 46, 92, "M"); F.hl(10, 55, 92, "M"); F.vl(10, 46, 10, "M"); F.vl(101, 46, 10, "M")
  F.text(SIGN_X, 54, "LUCKY STATIC", "m", { font: "5x7" })
  F.vl(20, 58, 2, "4"); F.vl(92, 58, 2, "4")
  // right of the door: an electrical box with a red LED, a conduit, torn posters, a pipe run, the corner downpipe
  F.rect(98, 14, 14, 20, "1"); F.rect(99, 15, 12, 18, "4"); F.hl(99, 32, 12, "5"); F.vl(105, 15, 18, "2"); F.px(108, 29, "q")
  F.rect(103, 34, 3, 26, "2"); F.vl(103, 34, 26, "4")
  F.rect(116, 9, 13, 18, "c"); F.rect(117, 10, 11, 16, "C"); for (let k = 0; k < 4; k++) F.hl(119, 13 + k * 3, 6 + (k % 2) * 2, "v")
  F.rect(126, 13, 11, 15, "n"); F.rect(127, 14, 9, 13, "M"); F.ell(131, 22, 2, 2, "N"); F.hl(128, 16, 7, "N")
  for (const [x, e] of [[135, 14], [136, 14], [136, 15], [127, 27], [116, 9], [117, 9]]) F.px(x, e, "3")
  F.hl(106, 41, 44, "5"); F.hl(106, 40, 44, "4"); F.hl(106, 39, 44, "1")
  F.vl(144, 0, 130, "4"); F.vl(145, 0, 130, "5"); F.vl(146, 0, 130, "2")
  F.vl(149, 0, 130, "2")
  c.warp((x) => [0, fl((CX - x) / 2)])
})

// ---------------------------------------------------------------- the right wall: the ad screen
const HR = 140
const SCR = { x0: 45, x1: 143, e0: 15, e1: 58 }         // the display, inclusive, in flat px
sprite("_wallR", { w: 170, h: HR + 86 }, (c) => {
  const F = flat(c, HR)
  F.rect(0, 0, 170, 64, "2")
  for (let x = 28; x < 150; x += 28) F.vl(x, 0, 64, "1")
  for (let x = 0; x < 170; x++) { const g = ihash(x, 21); if (g < 0.35) F.vl(x, 63 - fl(g * 30), 1 + fl(g * 30), "1") }
  F.rect(0, 0, 170, 4, "1"); F.hl(0, 4, 170, "3")
  F.rect(0, 70, 170, 70, "1")
  for (let x = 20; x < 170; x += 34) F.vl(x, 70, 70, "k")
  F.rect(0, 64, 170, 6, "3"); F.hl(0, 69, 170, "4"); F.hl(0, 64, 170, "k")
  const WIN = [[56, 80, null], [84, 80, "tv"], [112, 80, null], [140, 80, "amber"], [84, 112, null], [112, 112, "amber"], [140, 112, null]]
  for (const [x, e, lit] of WIN) {
    F.rect(x - 1, e - 1, 20, 20, "k")
    if (lit === "amber") { F.rect(x, e, 18, 18, "O"); for (let k = 1; k < 18; k += 3) F.hl(x, e + k, 18, "P") }
    else if (lit === "tv") { F.rect(x, e, 18, 18, "c"); F.rect(x + 6, e + 4, 9, 7, "C") }
    else { F.rect(x, e, 18, 18, "1"); for (let k = 0; k < 5; k++) F.px(x + 2 + k, e + 16 - k, "3") }
    F.vl(x + 9, e, 18, "k"); F.hl(x - 2, e - 2, 22, "3")
  }
  // the screen's housing, its cold light on the wall round it
  halo(F, [40, 10, 108, 54], 10, { 2: "c", 1: "c", 3: "C" }, 0.9)
  F.rect(40, 10, 108, 54, "k"); F.rect(41, 11, 106, 52, "4"); F.hl(41, 62, 106, "6"); F.vl(41, 11, 52, "5")
  F.rect(44, 14, 100, 46, "k")
  // the advert, left half: NAGI·WA, SLEEP BETTER, a serene face with closed eyes and a smile
  F.rect(SCR.x0, SCR.e0, 50, 44, "C")
  for (let x = SCR.x0; x < SCR.x0 + 50; x++) for (let e = SCR.e0; e < SCR.e0 + 14; e++) if (bay(x, e) < 1 - (e - SCR.e0) / 14) F.px(x, e, "c")
  F.text(49, 58, "NAGI·WA", "V", { font: "5x7" })
  F.rect(46, 15, 48, 6, "c"); F.text(47, 20, "SLEEP BETTER", "V")                       // the strapline
  F.ell(75, 37, 14, 13, "k"); F.ell(75, 37, 13, 12, "c")                                   // hair
  F.ell(75, 33, 11, 12, "k"); F.ell(75, 33, 10, 11, "V")                                   // face
  for (let x = 79; x < 87; x++) for (let e = 22; e < 45; e++) if (F.is(x, e, "V") && bay(x, e) < (x - 78) / 7) F.px(x, e, "v")
  F.ell(75, 42, 11, 3, "c")                                                                // fringe
  for (const ex of [70, 80]) { F.px(ex - 2, 35, "k"); F.hl(ex - 1, 36, 3, "k"); F.px(ex + 2, 35, "k") }   // eyes closed, content
  F.px(66, 31, "C"); F.px(84, 31, "C")                                                     // blush
  F.px(67, 29, "k"); F.px(83, 29, "k"); F.px(68, 28, "k"); F.px(82, 28, "k")              // the smile
  F.hl(69, 28, 13, "V"); F.hl(69, 27, 13, "k"); F.hl(70, 26, 11, "k")
  F.rect(95, SCR.e0, 49, 44, "1")                   // the static half is painted per frame
  // the alley mouth at the far end: a stair climbing away, a lamp at its top, an EXIT plate
  F.rect(149, 0, 21, 58, "k"); F.rect(150, 0, 20, 56, "e")
  for (let i = 0; i < 10; i++) { const e = 2 + i * 5; F.hl(151 + i, e, 19 - i, "3"); F.hl(151 + i, e - 1, 19 - i, "1") }
  F.line(151, 9, 166, 50, "4")
  F.rect(160, 51, 4, 2, "Q"); halo(F, [160, 51, 4, 2], 5, { e: "O", 1: "O", 3: "P" }, 0.6)
  F.rect(151, 58, 18, 7, "k"); F.text(153, 63, "EXIT", "v")
  // cables: the screen's feed down to a junction box over the vending machine
  F.rect(20, 40, 10, 8, "3"); F.hl(20, 47, 10, "4")
  F.line(30, 44, 41, 50, "k"); F.line(30, 42, 41, 46, "k"); F.vl(24, 0, 40, "k")
  F.vl(0, 0, 140, "1"); F.vl(1, 0, 140, "1")
  c.warp((x) => [0, fl(x / 2)])
})

// ---------------------------------------------------------------- the floor
// sidewalk slabs along both walls, a curb, asphalt beyond; pools of light; puddles
const PUDDLES = [[28, 72, 8, 10], [58, 14, 8, 5], [52, 22, 5, 4], [40, 30, 3, 4]]
const inPuddle = (u, v) => PUDDLES.some(([pu, pv, ru, rv]) =>
  ((u - pu) / ru) ** 2 + ((v - pv) / rv) ** 2 < 1 + (ihash(fl(u * 1.5) + 99, fl(v * 1.5)) - 0.5) * 0.4)
const GRATE = [43, 37, 6, 6]
const LIGHT = { c: [70, 42, 8] }                     // the drone's searchlight on the floor: u, v, r
function floorKey(x, y) {
  const [u, v] = uvAt(x, y), near = Math.min(u, v)
  let k
  if (near < 12) {
    const hsh = ihash(fl(u / 6) * 7 + 3, fl(v / 6) * 13 + 1)
    k = hsh < 0.3 ? "Z" : hsh < 0.85 ? "z" : "f"
    const ju = ((fl(u * 4) % 24) + 24) % 24, jv = ((fl(v * 4) % 24) + 24) % 24
    if (ju < 2 || jv < 2) k = "f"
    if (near >= 11) k = "X"                          // the curb's lit lip
  } else {
    k = ihash(fl(u / 5), fl(v / 5)) < 0.22 ? "e" : "f"
    if (near < 13.5) k = "e"                         // the gutter
    if (v >= 43 && v < 44 && near > 15 && fl(u / 5) % 2 === 0 && ihash(fl(u), 7) < 0.8) k = "Z"   // a worn lane dash
    const dm = Math.hypot(u - 50, v - 65)                                                      // a manhole cover
    if (dm < 4) k = dm > 3.4 ? "e" : (fl(u * 2 + v * 2) % 3 === 0 ? "2" : "4")
  }
  // the grate: steel bars across a dark pit
  const [gu, gv, gw, gh] = GRATE
  if (u >= gu && u < gu + gw && v >= gv && v < gv + gh) {
    const edge = u < gu + 0.75 || v < gv + 0.75 || u >= gu + gw - 0.75 || v >= gv + gh - 0.75
    k = edge ? "4" : (fl(u * 2) % 2 ? "k" : "3")
  }
  // pools: the door's warm light, the window's, the sign's magenta, the screen's cyan, the searchlight
  const lit = (base, lo, hi) => (base === "Z" || base === "z" || base === "X" || base === "3" || base === "4" ? hi : lo)
  const door = u >= 0 && u < 34 && v > 32 - u * 0.3 && v < 42 + u * 0.3 ? 1 - u / 34 : 0
  const win = u >= 0 && u < 10 && v > 45 && v < 67 ? 0.6 * (1 - u / 10) : 0
  const sign = u >= 0 && u < 14 && v > 22 && v < 72 ? 0.55 * (1 - u / 14) : 0
  const scr = v >= 0 && v < 30 && u > 21 - v * 0.4 && u < 73 + v * 0.4 ? 1 - v / 30 : 0
  const b = bay(x, y)
  if (scr > 0 && b < scr * 1.1) k = scr > 0.6 && lit(k) === "T" ? "T" : lit(k, "t", "T")
  if (sign > 0 && b < sign) k = lit(k, "i", "I")
  if (Math.max(door, win) > 0 && b < Math.max(door, win) * 1.15) k = door > 0.5 ? lit(k, "A", "A") : lit(k, "a", "A")
  if (door > 0.7 && b < (door - 0.7) * 2.6) k = "P"
  const [lu, lv, lr] = LIGHT.c, dl = Math.hypot(u - lu, v - lv)
  if (dl < lr) k = dl < lr * 0.45 ? (b < 0.5 + (1 - dl / (lr * 0.45)) ? "H" : "x") : dl < lr * 0.8 ? (b < 0.6 ? "x" : "w") : b < 4 * (1 - dl / lr) ? "w" : k
  return k
}
// what a wet floor mirrors: bright keys only on the open floor, everything in a puddle
const SHEEN = { m: "I", N: "I", M: "i", v: "T", V: "T", C: "t", Q: "A", R: "A", W: "A", P: "a" }
const MIRROR = { m: "M", N: "m", M: "n", n: "i", v: "C", V: "v", C: "c", c: "t", Q: "O", R: "P", W: "Q", P: "O", O: "a",
  q: "r", 6: "4", 5: "3", 4: "2", 3: "2", 2: "1" }

function floorPass(c) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, floorKey(x, y))
}
function reflections(c, f) {
  for (let x = 0; x < W; x++) {
    const yb = ybase(x)
    for (let y = yb + 1; y < H; y++) {
      const [u, v] = uvAt(x, y), e = y - yb, ys = yb - e
      if (inPuddle(u, v)) {
        const [u2, v2] = uvAt(x, y - 1)
        if (!inPuddle(u2, v2)) { c.px(x, y, "X"); continue }
        const [u3, v3] = uvAt(x, y + 1)
        if (!inPuddle(u3, v3)) { c.px(x, y, "e"); continue }
        const xs = x + ((y + f) % 3 === 0 ? (fl((y + f) / 3) % 2 ? 1 : -1) : 0)
        const src = ys >= 0 ? c.key(xs, ys) : "k"
        c.px(x, y, MIRROR[src] ?? "e")
      } else if (ys >= 0) {
        const t = SHEEN[c.key(x, ys)]
        if (t && bay(x, y) < 0.5 - e / 140) c.px(x, y, t)
      }
    }
  }
  // rain rings on the puddles
  PUDDLES.forEach(([pu, pv], i) => {
    for (let j = 0; j < 2; j++) {
      const t = (f + i * 5 + j * 6) % NF, r = 1 + (t % 4), [px, py] = P(pu + (j ? 2 : -2), pv + (i % 2 ? -2 : 2))
      if (t > 3) continue
      for (let a = 0; a < 16; a++) { const an = (a / 16) * Math.PI * 2; c.px(px + Math.round(2 * r * Math.cos(an)), py + Math.round(r * Math.sin(an)), t < 2 ? "6" : "X") }
    }
  })
}

// ---------------------------------------------------------------- the screen, per frame
const lineCells = (x0, y0, x1, y1) => {
  const out = [], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))
  for (let i = 0; i <= n; i++) out.push([Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n)])
  return out
}
const IMPACT = [112, 54]
const CRACKS = new Map()
for (const [x1, e1, x2, e2] of [[96, 58], [128, 58], [140, 36], [104, 15], [92, 44], [143, 50], [118, 24]].map(([x, e]) => [IMPACT[0], IMPACT[1], x, e])
  .concat([[128, 58, 134, 52], [96, 58, 90, 52], [104, 15, 98, 20], [140, 36, 143, 30], [92, 44, 66, 50], [118, 24, 126, 17]]))
  for (const [x, e] of lineCells(x1, e1, x2, e2)) { CRACKS.set(x * 100 + e, "V"); if (!CRACKS.has(x * 100 + e - 1)) CRACKS.set(x * 100 + e - 1, "k") }
const tearX = (e) => 93 + fl(2.5 * Math.sin(e * 0.55 + 1)) + (e % 9 === 4 ? 3 : 0) - (e % 13 === 2 ? 4 : 0)
function staticPx(ux, e, f) {
  const n = ihash(ux * 7 + f * 131, e * 13 + f * 17)
  let k = n < 0.3 ? "k" : n < 0.55 ? "2" : n < 0.75 ? "4" : n < 0.88 ? "c" : n < 0.96 ? "6" : "v"
  if ((e + f * 4) % 44 < 2) k = n < 0.4 ? "6" : "V"
  // the eye: an almond 45 px wide, its iris turned down-left, toward Juno; it blinks once a loop
  const ex = ux - 119, ey = e - 37
  const open = f === 8 ? 0.25 : f === 7 || f === 9 ? 0.6 : 1
  const lid = 11 * open * (1 - (ex / 22) ** 2)
  if (Math.abs(ex) <= 22 && Math.abs(ey) <= lid + 1) {
    if (Math.abs(ey) > lid - 1) return "k"
    const r = Math.hypot(ex + 3, ey + 1.5)
    if (r < 2 && ex + 3 < 0 && ey + 1.5 > 0) return "V"     // the glint
    if (r < 3.6) return "k"
    if (r < 6) return n < 0.2 ? "C" : "v"
    if (r < 8) return n < 0.3 ? "c" : "C"
    return n < 0.15 ? "6" : n < 0.2 ? "x" : "V"
  }
  if (Math.abs(ex) <= 24 && Math.abs(ey) <= lid + 3 && n < 0.5) return "k"     // lashes and a shadow
  return k
}
function screenPass(c, f) {
  const px = (ux, e, k) => { const [x, y] = atR(ux, e); c.px(x, y, k) }
  // a glitch: a slice of the advert slid sideways, a different one each frame
  const g0 = [20, 41, 28, 50, 33, 24][f % 6], sh = 2 + (f % 3)
  for (let e = g0; e < g0 + 2; e++) for (let ux = 92; ux >= SCR.x0 + sh; ux--) { const [sx, sy] = atR(ux - sh, e); const k = c.key(sx, sy); if (k) px(ux, e, k) }
  for (let e = SCR.e0; e <= SCR.e1; e++) for (let ux = SCR.x0; ux <= SCR.x1; ux++) {
    const tx = tearX(e)
    let k = null
    if (ux >= tx) k = staticPx(ux, e, f)
    else if (ux >= tx - 3 && ihash(ux + f * 7, e) < 0.45) k = ihash(ux, e + f) < 0.5 ? "6" : "k"
    const cr = CRACKS.get(ux * 100 + e); if (cr) k = cr
    if (k) px(ux, e, k)
  }
  for (const [dx, de] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) px(IMPACT[0] + dx, IMPACT[1] + de, "V")
  // LUCKY STATIC: the Y's tube stutters
  if (f === 3 || f === 4 || f === 10) for (let lx = SIGN_X + 24; lx < SIGN_X + 30; lx++) for (let e = 47; e <= 55; e++) {
    const [x, y] = atL(lx, e); if (c.is(x, y, "m")) c.px(x, y, "M")
  }
}

function street(c) {
  const f = c.frame ?? 0
  c.stamp("_clock", -4, -4)
  floorPass(c)
  c.stamp("_wallL", 0, CY - (HL - 1))
  c.stamp("_wallR", CX, CY - (HR - 1))
  reflections(c, f)
  screenPass(c, f)
}

// ---------------------------------------------------------------- people
// Juno from behind, three-quarter: she faces up-right, at the screen; a sliver of cheek and the
// cyan implant show at the hood's edge, the satchel hangs on her left hip, the screen rims her right.
sprite("juno", { pivot: "bottom" }, `
  ......kkkk......
  .....kyYYYk.....
  ....kyYYYYYk....
  ...kyYYYYYYyk...
  ...kyYYYYYyjSk..
  ...kyyYYYyyjSk..
  ...kyyyyyyjjvk..
  ...kjyyyyyjjSk..
  ...kkjjjjjjjkk..
  ..kyyyjjjjjjgGk.
  .kyYYyyyyyyyGyvk
  .kyYYyyyyyyGyyvk
  .kyYyjyyyyGyyjvk
  .kyYyjyyyGyyyjvk
  .kyyyjyyGyyyyjvk
  .kyyyjyGyyyyyjvk
  .kyyyjGyyyyyyjvk
  kgGGgGyyyyyyyjjk
  kgGGGgyyyyyyjjjk
  kgGGGgyyyyyyjjSk
  kggggkjyyyyjjkSk
  .kkkkjjjjjjjjkk.
  ...k3321k3221k..
  ...k3341k3221k..
  ...k3441k3221k..
  ...k3321k3221k..
  ...k3321k3221k..
  ...k3321k3221k..
  ...k2211k2211k..
  ..k24111k2411k..
  ..k21111kk2111k.
  ..kkkkkkk.kkkkk.`)

// the cook, an old man in a vest and a dark apron, three-quarter toward the street; only his top
// half shows over the cart
sprite("cook", { pivot: "bottom" }, `
  ....kkkk....
  ...kHHHHk...
  ..kHHhhhhk..
  ..khSSSSsk..
  ..kSkSSkSsk.
  ..kSSSSSSsk.
  ..khSSsSSsk.
  ..kHHhHHhHk.
  ...kHHHHhk..
  ...kkHhHkk..
  ..kHHkHkHHk.
  .kSHH444HHSk
  .kSH44444HSk
  .kSS44444SSk
  ..kSS444kSSk
  ..kk44444kSk
  ...k44444kk.
  ...k44444k..
  ...k44444k..
  ...k44444k..
  ...k33333k..
  ...k3k.k3k..
  ...k3k.k3k..
  ...k2k.k2k..
  ..kk2k.k2kk.
  ..kkkk.kkkk.`)

// ---------------------------------------------------------------- props
function trash(c) {
  const bag = (x, y, rx, ry, rim) => {
    c.ellipse(x, y, rx + 1, ry + 1, "k"); c.ellipse(x, y, rx, ry, "2"); c.ellipse(x - 1, y - 1, rx - 2, ry - 2, "3")
    c.px(x - 2, y - ry + 1, "5"); c.px(x - 1, y - ry + 1, "6"); c.px(x + rx - 2, y, rim)
    c.px(x, y - ry - 1, "k"); c.px(x, y - ry - 2, "2")
  }
  isoBox(c, 2, 12, 0, 6, 5, 7, (u, v) => (u > 5 || v > 4 ? "P" : "O"), (a) => (a % 5 === 0 ? "a" : "A"), (b) => (b === 0 ? "a" : "O"))
  bag(140, 61, 6, 4, "M"); bag(151, 64, 7, 5, "C"); bag(131, 66, 5, 4, "M"); bag(145, 69, 6, 4, "C")
  c.line(132, 72, 140, 74, "1")
}
function vending(c) {
  const PROD = "mQCqRv"
  isoBox(c, 14, 0, 0, 7, 6, 36,
    (u, v) => (u > 6.25 || v > 5.25 ? "5" : "4"),
    (a, e) => {
      if (a === 0 || a === 13) return "1"
      if (e >= 31) return e === 35 ? "v" : (a > 2 && a < 11 && e === 33 ? "V" : "C")
      if (e >= 11 && e <= 28 && a >= 2 && a <= 10) {
        if (e <= 18) {                                // the dead lower panel and its sticker
          if (e >= 14 && e <= 16 && a >= 3 && a <= 9) return e === 15 && a % 2 ? "q" : "H"
          return (a + e) % 7 === 0 ? "3" : "1"
        }
        if ((e - 19) % 4 === 3) return "6"
        return a % 3 === 0 ? "V" : PROD[(fl(a / 3) + fl((e - 19) / 4) * 2) % PROD.length]
      }
      if (a >= 11 && e >= 20 && e <= 27) return e === 25 ? "k" : "3"
      if (e >= 3 && e <= 6 && a >= 2 && a <= 10) return e === 6 ? "4" : "k"
      return e < 2 ? "1" : "2"
    },
    (b, e) => (b === 11 ? "2" : e >= 31 ? "c" : e === 20 && b > 1 && b < 10 ? "M" : "3"))
}
function cart(c) {
  isoBox(c, 34, 46, 0, 12, 6, 16,
    (u, v) => (u > 11.25 || v > 5.25 ? "6" : "5"),
    (a, e) => {
      if (e === 15) return "P"
      if (e >= 6 && e <= 12 && a >= 3 && a <= 20) return (a === 8 || a === 15) && e > 7 && e < 11 ? "N" : e === 6 || e === 12 ? "n" : "M"
      const w = [[5, 3], [18, 3]].find(([wx, we]) => Math.hypot(a - wx, e - we) < 3.3)
      if (w) return Math.hypot(a - w[0], e - w[1]) < 1.2 ? "4" : "k"
      return e % 4 === 0 ? "a" : "O"
    },
    (b, e) => {
      if (e === 15) return "R"
      if (b >= 2 && b <= 9 && e >= 4 && e <= 12) return b === 2 || b === 9 || e === 4 || e === 12 ? "O" : e % 3 === 0 && b > 3 && b < 8 ? "Q" : "k"
      return e % 4 === 0 ? "O" : "P"
    })
  // on the counter: the stockpot, two bowls
  const [px, py] = P(37, 49, 16)
  c.ellipse(px, py, 6, 3, "3"); c.rect(px - 6, py - 6, 13, 6, "4"); c.vline(px - 6, py - 6, 6, "5"); c.vline(px + 6, py - 6, 6, "3")
  c.ellipse(px, py - 6, 6, 3, "5"); c.ellipse(px, py - 6, 5, 2, "R"); c.hline(px - 3, py - 7, 5, "W")
  for (const [bu, bv] of [[42, 48], [44, 50]]) { const [bx, by] = P(bu, bv, 16); c.ellipse(bx, by, 3, 1, "H"); c.hline(bx - 2, by, 5, "h"); c.px(bx - 1, by - 1, "Q") }
}
function umbrella(c, f) {
  const [ax, ay] = P(35, 50, 16), [tx, ty] = P(35, 50, 45)
  c.vline(ax, ty, ay - ty, "4")
  const [cx, cy] = P(36, 49, 45), RX = 23, RY = 11, AP = 7
  // canopy: eight panels round the apex, those facing the upper left a tone lighter; a torn one
  for (let y = cy - RY - AP; y <= cy + RY + 1; y++) for (let x = cx - RX - 1; x <= cx + RX + 1; x++) {
    const dx = (x - cx) / RX, dy = (y - cy) / RY, rr = dx * dx + dy * dy
    if (rr > 1) continue
    const lift = AP * (1 - Math.sqrt(rr))                 // the dome rises toward the apex
    const yy = (y + lift - cy) / RY
    if (dx * dx + yy * yy > 1.02) continue
    const an = Math.atan2(yy, dx), seg = ((fl((an + Math.PI) / (Math.PI / 4)) % 8) + 8) % 8
    const edgeA = Math.abs(((an + Math.PI) % (Math.PI / 4)) - Math.PI / 8) > Math.PI / 8 - 0.09
    let k = seg >= 1 && seg <= 3 ? "U" : "u"
    if (edgeA) k = "k"
    if (rr > 0.86) k = dy > 0 ? "k" : "U"
    if (seg === 6 && rr > 0.35 && rr < 0.7 && ihash(x, y) < 0.7) k = "k"
    c.px(x, y - fl(lift), k)
  }
  c.px(cx, cy - AP - 1, "6")
  // a paper lantern hung from the rim over the cook's head; drips off the rim
  const lx = cx - 16, ly = cy + 5
  c.vline(lx, ly, 3, "1"); c.rect(lx - 2, ly + 3, 5, 6, "Q"); c.vline(lx, ly + 4, 4, "R"); c.hline(lx - 2, ly + 3, 5, "O"); c.hline(lx - 2, ly + 8, 5, "O")
  for (let i = 0; i < 5; i++) { const t = (f + i * 5) % NF; const dx = [-20, -9, 4, 15, 21][i]; c.px(cx + dx, cy + 9 + fl(Math.sqrt(1 - (dx / RX) ** 2) * 2) + t * 2, "6") }
}
function dropShadows(c) {
  for (const [u, v, rx, ry] of [[60, 30, 6, 2], [31, 49, 5, 2]]) { const [x, y] = P(u, v); c.ellipse(x, y, rx, ry, "e") }
  isoBox(c, 33, 45, 0, 14, 8, 1, () => "e", () => null, () => null)
  isoBox(c, 13, 0, 0, 9, 8, 1, () => "e", () => null, () => null)
}
function objects(c) {
  const f = c.frame ?? 0
  dropShadows(c)
  trash(c)
  vending(c)
  // the cart's power: a cable stolen from the bar's electrical box, across the sidewalk
  const cab = [P(0, 22, 14), P(0, 22, 0), P(8, 26), P(18, 34), P(26, 38), P(34, 44), P(36, 46, 3)]
  c.curve(cab.flat(), "k"); c.curve(cab.slice(1, 6).map(([x, y]) => [x, y - 1]).flat(), "4")
  const [kx, ky] = P(31, 49)
  c.stamp("cook", kx, ky)
  cart(c)
  umbrella(c, f)
  const [jx, jy] = P(60, 30)
  c.stamp("juno", jx, jy)
}

// ---------------------------------------------------------------- the drone and its searchlight
const DRONE = P(84, 34, 58)
const BOB = [0, 0, -1, -1, -1, 0, 0, 1, 1, 1, 0, 0]
function beam(c) {
  const f = c.frame ?? 0, [dx, dy0] = DRONE, dy = dy0 + BOB[f]
  const [lx, ly] = P(LIGHT.c[0], LIGHT.c[1])
  c.poly([dx - 1, dy + 3, dx + 2, dy + 3, lx + 24, ly + 1, lx - 22, ly - 1], "V")
}
function drone(c) {
  const f = c.frame ?? 0, [x, y0] = DRONE, y = y0 + BOB[f]
  for (const sd of [-1, 1]) {                       // arms out to two rotor rings, the blades a blur
    c.line(x + sd * 6, y - 1, x + sd * 11, y - 4, "2")
    c.ellipse(x + sd * 12, y - 5, 5, 2, "1", true)
    c.hline(x + sd * 12 - (f % 2 ? 4 : 2), y - 5, f % 2 ? 9 : 5, "6"); c.px(x + sd * 12, y - 5, "H")
  }
  c.ellipse(x, y, 8, 4, "k"); c.ellipse(x, y, 7, 3, "3"); c.ellipse(x - 1, y - 1, 5, 2, "4")
  c.hline(x - 3, y - 3, 5, "5"); c.px(x - 2, y - 3, "6")
  const eye = f % 6 < 4 ? "q" : "r"                 // the sensor band, its red eye turned down-left
  c.hline(x - 6, y + 1, 12, "1"); c.px(x - 5, y + 1, "r"); c.px(x - 4, y + 1, eye); c.px(x - 3, y + 1, eye); c.px(x - 2, y + 1, "r")
  c.hline(x - 1, y + 4, 3, "x"); c.px(x, y + 4, "V"); c.hline(x - 2, y + 3, 5, "k")
}

// ---------------------------------------------------------------- cables overhead
function cables(c) {
  const CAB = [[[20, 92], [110, 104], 22], [[60, 70], [70, 74], 14], [[118, 58], [40, 62], 10], [[0, 112], [160, 120], 30]]
  for (const [[lx, le], [rx, re], sag] of CAB) {
    const [x0, y0] = atL(lx, le), [x1, y1] = atR(rx, re)
    const pts = []
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t + sag * 4 * t * (1 - t))) }
    c.curve(pts, "k")
  }
  // a string of bulbs on the second cable, magenta and amber by turns
  const [x0, y0] = atL(60, 70), [x1, y1] = atR(70, 74)
  for (let i = 1; i < 12; i++) { const t = i / 12; c.px(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t + 14 * 4 * t * (1 - t)) + 1, i % 2 ? "m" : "R") }
}

// ---------------------------------------------------------------- steam and rain
function steam(c) {
  const f = c.frame ?? 0, [px, py] = P(37, 49, 22), [gx, gy] = P(GRATE[0] + 3, GRATE[1] + 3)
  c.plume(px, py, "HhZ", { every: 3, life: 24, rise: 22, wind: -0.2, size: [2, 4], seed: 3, frame: f })
  c.plume(gx, gy, "HhZ", { every: 2, life: 24, rise: 30, wind: -0.3, size: [2, 5], seed: 7, frame: f })
}
const rainLayer = (n, len, k, seed) => (c) => {
  const f = c.frame ?? 0, r = c.rng(seed)
  for (let i = 0; i < n; i++) {
    const x0 = r() * 380, ph = r(), p = (ph + f / NF) % 1
    const x = Math.round(x0 - p * 52), y = Math.round(-8 - len + p * (H + 16 + len))
    c.line(x, y, x + Math.round(len / 4), y - len, k)
  }
}
function splashes(c) {
  const f = c.frame ?? 0, r = c.rng(40 + f)
  for (let i = 0; i < 26; i++) {
    const x = fl(r() * W), y = fl(r() * H)
    if (y <= ybase(x) + 2) continue
    c.px(x, y, "6"); c.px(x - 1, y - 1, "x"); c.px(x + 1, y - 1, "x")
  }
}

// ---------------------------------------------------------------- UI
sprite("_portrait", `
  ....kkkkkk....
  ...kyYYYYyk...
  ..kyYYYYYYyk..
  .kyYykkkkyYyk.
  .kyykkkkkkyyk.
  .kykkSSSSkkyk.
  .kykSkSSkSkyk.
  .kykSSSSSvkyk.
  .kykSSSSSvkyk.
  .kjykSssSkyjk.
  .kjjykSSkyjjk.
  kjyyykkkkyyyjk
  kjyyyyGyyyyyjk
  kkkkkkkkkkkkkk`)
sprite("_bag", `
  ....kkkkkk....
  ...kGk..kGk...
  ..kGk....kGk..
  .kkkkkkkkkkkk.
  kGGGGGGGGGGGGk
  kGgggggggggggk
  kgkkkkGGkkkkgk
  kgggggkkgggggk
  kggggggggggggk
  kggggggggggggk
  .kkkkkkkkkkkk.`)
sprite("_cursor", `
  k.......
  kk......
  kVk.....
  kVVk....
  kVVVk...
  kVVVVk..
  kVVVVVk.
  kVVVkkkk
  kVkVk...
  kk.kVk..
  k..kVk..
  ....kk..`)
const CUR = [262, 57]
function uiPanels(c) {
  c.rect(3, 159, 72, 18, "k"); c.rect(293, 157, 24, 20, "k")
  c.rect(252, 45, 67, 9, "k")
}
function ui(c) {
  c.hline(3, 159, 72, "C"); c.hline(293, 157, 24, "C")
  c.stamp("_portrait", 5, 161)
  c.text(22, 162, "JUNO", "Y", { font: "5x7" }); c.text(22, 171, "REPAIR TECH", "6")
  c.stamp("_bag", 298, 162); c.text(312, 158, "3", "v")
  c.text(210, 98, "It... said my name.", "Y", { font: "5x7", align: "c", shadow: "k" })
  c.hline(252, 53, 67, "C")
  c.text(254, 47, "BROKEN AD SCREEN", "V")
  c.stamp("_cursor", CUR[0], CUR[1])
}

// ---------------------------------------------------------------- the scene
anim("_clock", { w: 1, h: 1, frames: NF, fps: 10 }, () => {})
scene("mock_c_iso", { w: W, h: H, bg: "k" },
  layer("street", street),
  layer("objects", objects),
  layer("beam", { opacity: 0.2 }, beam),
  layer("drone", drone),
  layer("cables", cables),
  layer("steam", { opacity: 0.5 }, steam),
  layer("rain far", { opacity: 0.3 }, rainLayer(180, 3, "6", 11)),
  layer("rain near", { opacity: 0.6 }, rainLayer(100, 6, "x", 12), splashes),
  glow("m", { r: 5, strength: 0.45 }),
  glow("vV", { r: 4, strength: 0.3 }),
  glow("RW", { r: 4, strength: 0.35 }),
  glow("q", { r: 3, strength: 0.6 }),
  layer("ui panels", { opacity: 0.78 }, uiPanels),
  layer("ui", ui),
)
