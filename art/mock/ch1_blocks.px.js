// Chapter 1's mock (docs/kapitel1-design.md): flat blocks for the cameras and streets not yet painted, enough to
// play the chapter through and to judge the layout before anything is painted. The feeds use the phosphor ramp
// (the look comes from the post-effects as on the painted ones), the street rooms a grey-blue. The text is signs of
// the city, English like all of them. Where people stand and what is clickable: game/places.js (at.cam21 and on).
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
  k: "#0c0e1a", a: "#131a2a", b: "#1a2337", d: "#232f47", e: "#2f3e5a", f: "#41547a", g: "#617aa0", h: "#a8b8d0",
  m: "#a8238a", M: "#ff4fd3", y: "#eea040", n: "#3e1240", p: "#26102c", v: "#62def0",
})
ramps("0123456789")
include("../lib/text.js")
include("../lib/kanji.js")

const W = 320, H = 180
/** a sign: its board and its text, centred on the board */
const SIGN = (c, x, y, w, s, board = "2", ink = "9") => {
  c.rect(x, y, w, 11, board)
  TXT.draw(c, x + Math.floor(w / 2), y + 2, s, ink, { font: "hud", align: "center" })
}
/** the back wall and the floor of a view from above */
const ROOM = (c, wall, floor, y = 70) => { c.rect(0, 0, W, y, wall); c.rect(0, y, W, H - y, floor); c.hline(0, y, W, "1") }

// the clinic's entrance: white, the door in the middle, the queue along the wall; across the way Pho Pump's window with its menu
scene("cam21_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "6", "5", 76)
  c.rect(130, 26, 44, 50, "9"); c.rect(150, 26, 4, 50, "7")
  SIGN(c, 96, 8, 112, "LULL CLINIC 9-EAST", "8", "2")
  c.rect(0, 150, W, 30, "3")
  c.rect(232, 128, 72, 40, "3"); c.rect(238, 134, 28, 28, "7"); c.rect(242, 139, 20, 2, "2"); c.rect(242, 144, 20, 2, "2"); c.rect(242, 149, 14, 2, "2")
  SIGN(c, 232, 116, 72, "PHO PUMP")
})
// (cam14 is the 14th floor's own picture under the feed's filter: game/stadt.js)
// what cam14 adds to it: the morning's papers at the head of the stairs, and Frau Haldane at the floor's scale, asleep on her feet in
// her dressing gown, her arms hanging (the feed's filter turns both green)
anim("mock_papers", { w: 12, h: 6, frames: 1, fps: 1, pivot: "bottom" }, (c) => { c.rect(0, 1, 12, 5, "h"); c.rect(1, 0, 10, 4, "g"); c.hline(2, 2, 7, "e") })
anim("mock_haldane", { w: 15, h: 46, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(4, 0, 7, 4, "h"); c.rect(4, 4, 7, 7, "g"); c.hline(5, 7, 2, "e"); c.hline(8, 7, 2, "e")
  c.rect(2, 11, 11, 31, "f"); c.rect(6, 11, 3, 31, "e"); c.rect(1, 13, 2, 16, "f"); c.rect(12, 13, 2, 16, "f"); c.rect(3, 42, 4, 4, "h"); c.rect(8, 42, 4, 4, "h")
})
// Ines at the laundromat's scale (CAM 23 is the laundromat's own picture), seen from behind as she faces the machines: dark hair
// tied back, the white coat to her knees, a bag on her shoulder
anim("mock_ines", { w: 15, h: 50, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(4, 0, 7, 9, "a"); c.rect(6, 9, 3, 3, "a")                                         // her hair, its knot
  c.rect(2, 11, 11, 25, "h"); c.vline(7, 20, 16, "g"); c.rect(1, 13, 2, 17, "h"); c.rect(12, 13, 2, 17, "h")   // the coat, its back seam, the arms
  c.rect(11, 12, 2, 12, "e"); c.rect(10, 22, 4, 6, "e")                                     // the bag's strap and the bag
  c.rect(4, 36, 3, 11, "d"); c.rect(8, 36, 3, 11, "d"); c.rect(3, 47, 4, 3, "a"); c.rect(8, 47, 4, 3, "a")       // the legs, the shoes
})
// a close-up: one page of the stack, every face in it marked with four corners
scene("look_zeitung", { w: 170, h: 112, bg: "h" }, (c) => {
  c.rect(0, 0, 170, 112, "h"); c.rect(0, 0, 170, 16, "g")
  TXT.draw(c, 85, 5, "NINTH HERALD", "k", { font: "hud", align: "center" })
  for (const [x, y] of [[10, 24], [62, 24], [114, 24], [10, 68], [62, 68], [114, 68]]) {
    c.rect(x, y, 40, 34, "f"); c.rect(x + 13, y + 6, 14, 14, "d"); c.rect(x + 8, y + 20, 24, 14, "e")
    for (const [cx, cy, dx, dy] of [[x + 9, y + 3, 1, 1], [x + 30, y + 3, -1, 1], [x + 9, y + 23, 1, -1], [x + 30, y + 23, -1, -1]]) { c.hline(dx > 0 ? cx : cx - 3, cy, 4, "k"); for (let n = 0; n < 4; n++) c.px(cx, cy + n * dy, "k") }
  }
})
// the bar: the counter across the room, seen from over it
scene("cam22_bg", { w: W, h: H, bg: "0" }, (c) => {
  // (the left column is the cameras' strip: nothing that matters lies under x 76)
  ROOM(c, "2", "5", 62)
  c.rect(90, 18, 60, 34, "3"); c.rect(160, 18, 60, 34, "3"); c.rect(230, 18, 60, 34, "3")
  c.rect(80, 118, 216, 20, "6"); c.hline(80, 118, 216, "8")
  for (const x of [114, 154, 194, 234]) c.rect(x, 100, 12, 14, "2")
  SIGN(c, 110, 4, 100, "PHO PUMP")
})
// the door of the Lerche block, through a fisheye (only its corners dark)
scene("cam24_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "3", "5", 90)
  c.rect(124, 24, 72, 66, "5"); c.rect(158, 24, 4, 66, "3")
  SIGN(c, 112, 8, 96, "LERCHE BLOCK")
  c.rect(0, 0, 40, 26, "1"); c.rect(280, 0, 40, 26, "1"); c.rect(0, 154, 40, 26, "1"); c.rect(280, 154, 40, 26, "1")
})
// the stairs into the water, the sign, the tide board
scene("cam30_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "2", "4", 48)
  for (let i = 0; i < 6; i++) c.rect(110 + i * 2, 80 + i * 12, 100 - i * 4, 12, String(6 - i))
  c.rect(0, 150, W, 30, "1")
  c.rect(104, 148, 112, 32, "2")
  SIGN(c, 88, 30, 144, "LINE 31 - CLOSED", "7", "1")
  // a gauge on its own post beside the stairs (the top of the wall belongs to the display)
  c.rect(258, 88, 4, 22, "3")
  SIGN(c, 232, 52, 56, "LOW TIDE", "7", "1")
  c.rect(232, 63, 56, 25, "3")
  for (const y of [66, 70, 81, 85]) c.hline(238, y, 44, "5")
  TXT.draw(c, 260, 73, "FRI 23:00", "9", { font: "hud", align: "center" })
})
// the ledge outside the flat: the wall of the block, the window, the ladder hanging too high, the street far below
scene("sims_bg", { w: W, h: H, bg: "k" }, (c) => {
  c.rect(0, 0, W, 128, "d"); c.rect(0, 128, W, 26, "f"); c.hline(0, 128, W, "h")
  for (const x of [120, 180]) c.rect(x, 40, 34, 40, "e")
  c.rect(28, 62, 44, 62, "g"); c.rect(32, 66, 36, 54, "m")
  // the ladder ends two metres above where Juno could reach (her head is at y 88 on the ledge, her hands up at about 74)
  c.rect(254, 0, 3, 36, "h"); c.rect(270, 0, 3, 36, "h"); for (let y = 6; y < 36; y += 10) c.hline(254, y, 19, "h")
  c.rect(0, 154, W, 26, "a"); for (const [x, k] of [[30, "M"], [90, "y"], [150, "g"], [214, "M"], [280, "y"]]) c.rect(x, 170, 8, 3, k)
})
// The look upwards: along the transit axis, the spine the old photo shows going into the ring above. Each Ring is a ceiling with a
// hole round the spine: panels and ribs running to the middle, its inner rim lit from below, the smog between one Ring and the next, the
// Crown's white far up. A mock to judge whether the idea looks good, not the painting.
scene("dach_blick_bg", { w: W, h: H, bg: "k" }, (c) => {
  const CX = 160, CY = 58, Q = 0.62, RINGS = [380, 250, 168, 112, 74, 47, 28, 14]
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], bay = (x, y) => (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16
  const STEEL = ["k", "a", "b", "d", "e"], tone = (t, x, y) => { t = Math.max(0, Math.min(STEEL.length - 1, t)); const b = Math.floor(t); return STEEL[Math.min(STEEL.length - 1, b + (bay(x, y) < t - b ? 1 : 0))] }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = x - CX, dy = (y - CY) / Q, r = Math.hypot(dx, dy), a = Math.atan2(dy, dx)
    let i = RINGS.findIndex((R, n) => r <= R && r > (RINGS[n + 1] ?? 0))
    if (i < 0) { c.px(x, y, "a"); continue }
    const R0 = RINGS[i], R1 = RINGS[i + 1] ?? 0, u = (r - R1) / (R0 - R1)                       // u: 0 at the Ring's inner rim, 1 at its outer edge
    if (i === RINGS.length - 1) { c.px(x, y, r < 4 ? "h" : r < 8 ? "g" : "f"); continue }        // the Crown
    const gap = u > 0.86                                                                       // past this Ring's outer edge: the smog before the next one down
    if (gap) { const t = (u - 0.86) / 0.14; c.px(x, y, bay(x, y) < 0.25 + t * 0.5 ? "n" : "p"); continue }
    // the underside: dark, a step lighter toward the rim where the streets' light catches it, further Rings hazier
    let t = 1 + i * 0.35 + (u < 0.3 ? (0.3 - u) * 5 : 0)
    const ribs = 26 + i * 2, onRib = Math.abs(((a + Math.PI) * ribs / (2 * Math.PI)) % 1 - 0.5) < 0.05 * (1 + i * 0.4), panel = Math.floor(u * 5) !== Math.floor((r + 2 - R1) / (R0 - R1) * 5)
    if (onRib || panel) t -= 1
    c.px(x, y, tone(t, x, y))
    if (u < 0.03) c.px(x, y, i < 2 ? "M" : i < 4 ? "m" : "g")                                    // the inner rim, lit
  }
  // rim lamps: fewer and warmer near, whiter further up
  RINGS.slice(0, -1).forEach((R, n) => { const rim = RINGS[n + 1], N = 18 + n * 2; for (let k = 0; k < N; k++) { const a = (k + (n % 2) * 0.5) * 2 * Math.PI / N, x = Math.round(CX + (rim + 4) * Math.cos(a)), y = Math.round(CY + (rim + 4) * Q * Math.sin(a)); if (x >= 0 && x < W && y >= 0 && y < H) c.px(x, y, n < 3 ? "y" : "h") } })
  // the spine: from the near towers up through every hole, narrowing, its lifts of light
  for (let y = CY + 2; y < H; y++) { const w = 1 + (y - CY) * 0.2, x0 = Math.round(CX - w), x1 = Math.round(CX + w); for (let x = x0; x <= x1; x++) c.px(x, y, x < x0 + w * 0.5 ? "d" : "b"); c.px(x0, y, "e") }
  for (let y = CY + 6, s = 2; y < H; y += s, s += 2) { c.px(CX, y, "v"); c.px(CX, y + 1, "v") }
  c.rect(0, 166, W, 14, "k"); c.hline(0, 166, W, "b")                                          // the parapet's edge, where she stands
})
// The same look from where Juno really stands: far off the spine (the old photo has it away in the city), so she looks up and across,
// the next Ring's underside overhead, its hole and the ones through it off towards the spine, the city and the parapet at the bottom.
scene("dach_blick_b_bg", { w: W, h: H, bg: "k" }, (c) => {
  const VX = 226, VY = 26, Q = 0.5, HZ = 132, RINGS = [620, 300, 190, 122, 78, 50, 30, 16]
  const AT = RINGS.map((R) => [VX - R * 0.42, VY + R * 0.34])                                     // each hole's middle: the nearer, the further off the spine
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], bay = (x, y) => (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16
  const STEEL = ["k", "a", "b", "d", "e"], tone = (t, x, y) => { t = Math.max(0, Math.min(STEEL.length - 1, t)); const b = Math.floor(t); return STEEL[Math.min(STEEL.length - 1, b + (bay(x, y) < t - b ? 1 : 0))] }
  const dist = (n, x, y) => Math.hypot(x - AT[n][0], (y - AT[n][1]) / Q)
  for (let y = 0; y < HZ; y++) for (let x = 0; x < W; x++) {
    let i = 0; for (let n = RINGS.length - 1; n > 0; n--) if (dist(n, x, y) < RINGS[n]) { i = n; break }
    if (i === RINGS.length - 1) { const r = dist(i, x, y); c.px(x, y, r < 4 ? "h" : r < 9 ? "g" : "f"); continue }                 // the Crown
    const rIn = dist(i + 1, x, y), u = (rIn - RINGS[i + 1]) / Math.max(1, RINGS[i] - RINGS[i + 1])                                  // 0 at the Ring's hole
    const a = Math.atan2((y - AT[i + 1][1]) / Q, x - AT[i + 1][0]), ribs = 30 + i * 2, onRib = Math.abs(((a + Math.PI) * ribs / (2 * Math.PI)) % 1 - 0.5) < 0.05
    const panel = Math.floor(rIn / 22) !== Math.floor((rIn + 1.6) / 22)
    let t = 0.9 + i * 0.4 + Math.max(0, 0.25 - u) * 5; if (onRib || panel) t -= 0.9
    c.px(x, y, tone(t, x, y))
    if (u < 0.018 + i * 0.006) c.px(x, y, i < 2 ? "m" : "g")                                                                       // the hole's rim, lit from below
  }
  // lamps round the holes
  RINGS.slice(1, -1).forEach((R, n) => { const N = 16 + n * 2; for (let k = 0; k < N; k++) { const a = k * 2 * Math.PI / N, x = Math.round(AT[n + 1][0] + (R + 3) * Math.cos(a)), y = Math.round(AT[n + 1][1] + (R + 3) * Q * Math.sin(a)); if (x >= 0 && x < W && y >= 0 && y < HZ) c.px(x, y, n < 2 ? "y" : "h") } })
  // the spine, far off, going up through them all, its lift of light
  for (let y = VY + 3; y < HZ + 6; y++) { c.hline(VX - 3, y, 7, "b"); c.px(VX - 3, y, "e") } for (let y = VY + 8; y < HZ; y += 7) c.px(VX, y, "v")
  // the smog over the city, the far towers, the near parapet
  for (let y = HZ - 16; y < HZ + 12; y++) for (let x = 0; x < W; x++) if (bay(x, y) < (y - HZ + 16) / 22) c.px(x, y, y < HZ ? "p" : "n")
  for (const [x, w, top] of [[6, 22, 112], [40, 16, 118], [70, 30, 104], [116, 14, 116], [150, 26, 110], [190, 14, 120], [250, 24, 108], [290, 26, 116]]) { c.rect(x, top, w, 150 - top, "a"); for (let n = 0; n < 5; n++) c.px(x + 3 + n * 5 % w, top + 4 + n * 7, "y") }
  c.rect(0, 150, W, 30, "k"); c.hline(0, 150, W, "d")
})
// CAM 18 at the old fish market, Frau Imai's view: straight down from the lamp post over the stairs (kapitel1-design, "Die Einstellungen
// der Kameras"; the user chose variant C of art/mockups/cam18_study.px.js). The wet square on top, the stairs going down to the market's
// tarps, and over the steps a big fish painted long ago, worn, broken by every step's edge: whole only from up here (from below it is
// strokes on steps), so whoever saw it saw it from this camera. The lamp's arm out of focus in the corner; rain from the left, the
// camera hangs crooked. Levels of the phosphor ramp in a buffer, ordered-dithered; the feed's own post adds the rest.
const CAM18 = { stairs: [118, 32, 84, 116], fish: [160, 96, 150] }
scene("cam18_bg", { w: W, h: H, bg: "0" }, (c) => {
  const L = Array.from({ length: H }, () => new Float32Array(W))
  const set = (x, y, v) => { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H) L[y][x] = v }
  const rect = (x, y, w, h, v) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, v) }
  const each = (f) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) L[y][x] = f(x, y, L[y][x]) }
  const hash = (a, b, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  // a fish looking left, turned by ang: an ellipse and a forked tail
  const inFish = (x, y, cx, cy, len, ang) => {
    const dx = x - cx, dy = y - cy, ca = Math.cos(-ang), sa = Math.sin(-ang), u = dx * ca - dy * sa, v = dx * sa + dy * ca, a = len * 0.36, h = len * 0.16
    if ((u / a) ** 2 + (v / h) ** 2 < 1) return true
    const t = u - a * 0.82, T = len * 0.24
    return t > 0 && t < T && Math.abs(v) < 2 + t * 0.9 && !(t > T * 0.55 && Math.abs(v) < (t - T * 0.55) * 1.3)
  }
  const [sx, sy, sw, sh] = CAM18.stairs
  each((x, y) => 2.6 + ((x % 22 === 0 || y % 16 === 0) ? -0.8 : 0))                                  // the square's wet slabs
  for (let y = 120; y < H; y++) for (let x = 0; x < W; x++) if (x < 104 || x > 216) set(x, y, 3.2 + (x % 6 < 2 ? 0.9 : 0))   // the tarps
  for (const x of [104, 216]) rect(x - 2, 120, 4, 60, 1)
  rect(sx, sy, sw, sh, 2); rect(sx - 6, sy, 6, sh, 5.2); rect(sx + sw, sy, 6, sh, 5.2)                // the well, its walls' coping
  for (let y = sy + 2; y < sy + sh; y += 4) { set(sx - 3, y, 7); set(sx + sw + 3, y, 7) }            // the railings
  for (let i = 0; i < 12; i++) { const y = sy + i * 10, lit = 5.4 - i * 0.28; rect(sx, y, sw, 10, lit - 1.2); rect(sx, y, sw, 2, lit); rect(sx, y + 9, sw, 1, 1) }
  rect(sx, sy + sh, sw, 10, 2.4)                                                                       // the landing
  const [fx, fy, fl] = CAM18.fish
  each((x, y, l) => {                                                                                  // the fish, its paint worn, gone on every edge
    if (x < sx || x >= sx + sw || y < sy || y > sy + sh + 9) return l
    const edge = (y - sy) % 10 >= 9 || (y - sy) % 10 < 2
    return inFish(x, y, fx, fy, fl, Math.PI / 2) && !edge && hash(x, y, 7) > 0.15 ? l + 2.6 : l
  })
  each((x, y, l) => l + 2.2 * Math.max(0, 1 - Math.hypot(x - 150, (y - 70) * 1.2) / 150) ** 1.6)     // the lamp's pool
  for (let i = 0; i < 160; i++) {                                                                      // rain from the left
    const x = hash(i, 1, 3) * W, y = hash(i, 2, 3) * H, n = 3 + hash(i, 3, 3) * 4
    for (let k = 0; k < n; k++) { const X = (x + k * 1.6) | 0, Y = (y + k * 0.5) | 0; if (X < W && Y < H) L[Y][X] += 1.6 }
  }
  for (let i = 0; i < 9; i++) for (let x = -4; x <= 62; x++) set(x, 6 + i + Math.round((x + 4) * 18 / 66), 0.6)   // the lamp's arm, out of focus
  rect(54, 20, 22, 16, 1.2); rect(56, 34, 18, 3, 9)
  const B = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, String(Math.max(0, Math.min(9, Math.floor(L[y][x] + (B[y % 4][x % 4] + 0.5) / 16)))))
  TXT.draw(c, fx, sy + sh + 2, "FISH", "8", { font: "hud", align: "center" })                         // under its tail, worn too
})
// (LUCKY STATIC is a room baked from its map now: art/rooms/lucky_static.map.js)
// the Drain Market: a drained flood canal, the stalls along its wall
scene("drain_market_bg", { w: W, h: H, bg: "k" }, (c) => {
  c.rect(0, 0, W, 112, "b"); c.rect(0, 112, W, 68, "a"); c.hline(0, 112, W, "y")
  c.rect(30, 66, 66, 42, "d"); SIGN(c, 30, 54, 66, "KIDNEYS ONLY", "m", "M")
  c.rect(106, 66, 58, 42, "d"); for (let i = 0; i < 5; i++) c.rect(112 + i * 10, 78, 6, 12, "g")
  // the stairs up to the alley at the left (it comes down out of the alley's back wall)
  c.rect(170, 66, 30, 42, "e"); c.rect(0, 50, 18, 120, "e"); for (let y = 56; y < 170; y += 9) c.hline(2, y, Math.min(14, 4 + (170 - y) / 9), "g")
  c.rect(262, 50, 44, 66, "n"); for (let x = 266; x < 306; x += 8) c.rect(x, 50, 2, 66, "m")
})
// Sable's booth behind the curtain: violet and amber, a table full of screens, the price list, a wire bird in its cage
scene("sable_booth_bg", { w: W, h: H, bg: "k" }, (c) => {
  c.rect(0, 0, W, 112, "p"); c.rect(0, 112, W, 68, "a"); c.hline(0, 112, W, "y")
  c.rect(0, 50, 16, 126, "n"); for (let y = 54; y < 170; y += 8) c.hline(2, y, 12, "m")
  c.rect(100, 84, 124, 30, "n"); c.hline(100, 84, 124, "y")
  for (const x of [114, 148, 182]) { c.rect(x, 46, 28, 32, "d"); c.rect(x + 2, 48, 24, 28, "a"); c.rect(x + 8, 58, 12, 3, "v") }
  c.rect(224, 14, 86, 36, "b")
  TXT.draw(c, 267, 17, "NAMES 50.", "y", { font: "hud", align: "center" }); TXT.draw(c, 267, 27, "ADDRESSES 80.", "y", { font: "hud", align: "center" }); TXT.draw(c, 267, 37, "SECRETS: ASK.", "y", { font: "hud", align: "center" })
  c.rect(36, 40, 30, 44, "b"); for (let x = 38; x < 66; x += 5) c.rect(x, 40, 1, 44, "g"); c.rect(46, 60, 10, 6, "h"); c.rect(44, 58, 3, 3, "h")
})
// the Morpheus from its corridor's ceiling: two rows of capsules with their numbers, each with a small screen
scene("cam15_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "4", "7", 84)
  // (the left column is the cameras' strip: the capsules begin after it, the door Kessler comes through is under the camera)
  for (let row = 0; row < 2; row++) for (let i = 0; i < 8; i++) {
    const x = 84 + i * 29, y = 28 + row * 27, n = 17 + row * 8 + i
    c.rect(x, y, 26, 25, "2"); c.rect(x + 2, y + 2, 22, 21, "3"); c.rect(x + 17, y + 4, 6, 4, "8")
    TXT.draw(c, x + 10, y + 12, String(n), "9", { font: "hud", align: "center" })
  }
  SIGN(c, 110, 0, 100, "MORPHEUS"); c.rect(146, 120, 28, 60, "6")
})
// who walks through cam03 and cam15 now: a hood where the scarf was
anim("mock_kessler_hood", { w: 13, h: 24, frames: 1, fps: 1, outline: "1", pivot: "bottom" }, (c) => {
  c.rect(4, 0, 5, 7, "5"); c.rect(5, 3, 3, 3, "2"); c.rect(2, 7, 9, 10, "6"); c.rect(3, 17, 3, 7, "4"); c.rect(7, 17, 3, 7, "4")
})
// Sable, sitting behind the table: magenta to the floor, a bald head, the pipe's ember
anim("mock_sable", { w: 21, h: 42, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(7, 0, 7, 8, "h"); c.rect(4, 8, 13, 34, "M"); c.rect(9, 10, 3, 30, "m"); c.rect(14, 5, 5, 1, "d"); c.rect(18, 3, 2, 2, "y")
})
// a close-up: the white van, two in white carrying a stretcher, a girl in a door
scene("look_traeger", { w: 170, h: 112, bg: "a" }, (c) => {
  c.rect(0, 0, 170, 112, "a"); c.rect(0, 86, 170, 26, "b")
  c.rect(8, 34, 74, 52, "h"); c.rect(8, 34, 22, 20, "d"); c.rect(14, 84, 12, 8, "k"); c.rect(62, 84, 12, 8, "k")
  for (const x of [92, 124]) { c.rect(x, 44, 8, 8, "h"); c.rect(x - 2, 52, 12, 26, "h"); c.rect(x, 78, 8, 12, "g") }
  c.rect(92, 62, 40, 5, "g"); c.rect(100, 56, 14, 6, "f")
  c.rect(146, 20, 22, 70, "m"); c.rect(152, 54, 8, 8, "f"); c.rect(150, 62, 12, 22, "g")
})
// people not painted yet: the white carriers
anim("mock_imai", { w: 19, h: 44, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(6, 0, 7, 8, "h"); c.rect(14, 4, 1, 1, "g"); c.rect(3, 8, 13, 22, "f"); c.rect(5, 30, 9, 14, "d")
})
// what is in the bag, not painted yet
anim("inv_ausweis", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(0, 0, 18, 13, "h"); c.rect(2, 2, 6, 7, "f"); c.rect(10, 3, 6, 1, "f"); c.rect(10, 6, 6, 1, "f"); c.rect(0, 11, 18, 2, "M") })
anim("inv_haken", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(0, 10, 15, 2, "g"); c.rect(14, 3, 2, 8, "g"); c.rect(10, 2, 5, 2, "h"); c.rect(10, 4, 2, 2, "h") })
anim("inv_stick", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(2, 3, 12, 7, "f"); c.rect(14, 5, 3, 3, "h"); c.rect(4, 5, 4, 3, "v") })
// the laundromat's man asleep behind his counter, on a chair tipped back against the wall, his head on his shoulder, facing the
// room (the laundromat itself is a baked map now: art/rooms/laundromat.map.js); his chair is in his figure
anim("mock_sleeper", { w: 22, h: 40, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(3, 4, 2, 36, "e"); c.rect(3, 26, 15, 3, "e"); c.rect(15, 29, 2, 11, "e")     // the chair: its back, the seat, a front leg
  c.rect(5, 12, 9, 15, "f"); c.rect(6, 13, 7, 3, "g")                                // his body, a grey jacket
  c.rect(10, 26, 9, 4, "d"); c.rect(17, 30, 3, 9, "d"); c.rect(16, 38, 5, 2, "a")    // the legs out to the front, a shoe
  c.rect(4, 4, 7, 8, "h"); c.rect(4, 4, 7, 3, "a"); c.hline(7, 9, 3, "e")            // the head on its side, hair, mouth open
  c.rect(12, 20, 2, 8, "g")                                                           // an arm hanging
})

// ---- job B (game/auftrag_tide.js): Jade Row's cameras, Okonkwo's shop, the people of the night, Ratz
pal({ s: "#5a3a2a", S: "#8a5a3e", o: "#6a5030", O: "#a88a58" })
// the register's customer display in close-up: it should show the price; it shows every key he types, the whole code
scene("zoom_keypad", { w: 60, h: 40, bg: "1" }, (c) => {
  c.rect(0, 0, 60, 40, "3"); c.rect(0, 0, 60, 2, "5"); c.rect(4, 8, 52, 20, "1"); c.rect(6, 10, 48, 16, "2")
  TXT.draw(c, 30, 15, "4-1-7-0-9", "9", { font: "hud", align: "center" }); c.rect(26, 30, 8, 10, "3")
})
// (Okonkwo's shop is painted now: art/rooms/okonkwo_shop.px.js)
// the people of job B, not painted yet: Okonkwo in his cardigan (in the shop and from above in the feeds), Lt. Morrow in her trench coat,
// a Tidewater boy with the glowing mark at his neck, the patrol car; Ratz with his parka, headphones and glowing collar
anim("mock_okonkwo", { w: 19, h: 48, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(6, 0, 7, 9, "S"); c.rect(6, 0, 7, 2, "k"); c.rect(6, 4, 7, 1, "h"); c.rect(3, 9, 13, 22, "O"); c.rect(5, 10, 9, 20, "o"); c.rect(5, 31, 9, 17, "d")
})
// the night in Jade Row seen by CAM 07, which is the lane's own picture (one place, one picture): at the lane's scale, as Juno is there.
// Okonkwo from behind in his shop's door at one; Lt. Morrow in her trench coat and the Tidewater boy, the mark at his neck lit
anim("mock_okonkwo_back", { w: 19, h: 48, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(6, 0, 7, 9, "a"); c.rect(6, 7, 7, 2, "S"); c.rect(3, 9, 13, 22, "O"); c.vline(9, 11, 19, "o"); c.rect(5, 31, 9, 17, "d")
})
anim("mock_morrow", { w: 18, h: 52, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(5, 0, 8, 10, "S"); c.rect(5, 0, 8, 3, "a"); c.rect(6, 5, 2, 1, "k"); c.rect(10, 5, 2, 1, "k")       // her face, the hair tied back
  c.rect(2, 10, 14, 30, "f"); c.rect(4, 10, 10, 4, "g"); c.vline(9, 14, 26, "e"); c.rect(3, 24, 12, 2, "e")  // the trench coat, its collar, its belt
  c.rect(5, 40, 3, 10, "a"); c.rect(10, 40, 3, 10, "a"); c.rect(4, 50, 4, 2, "k"); c.rect(10, 50, 4, 2, "k")
})
anim("mock_tide", { w: 16, h: 46, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(4, 0, 8, 9, "S"); c.rect(4, 0, 8, 2, "a"); c.rect(5, 4, 2, 1, "k"); c.rect(9, 4, 2, 1, "k")
  c.rect(4, 9, 8, 2, "v")                                                                                   // the mark at his neck, lit
  c.rect(2, 11, 12, 16, "d"); c.rect(3, 12, 10, 3, "e")                                                       // a hooded jacket
  c.rect(4, 27, 3, 17, "a"); c.rect(9, 27, 3, 17, "a"); c.rect(3, 44, 4, 2, "k"); c.rect(9, 44, 4, 2, "k")
})
anim("mock_car_feed", { w: 40, h: 18, frames: 1, fps: 1, outline: "1", pivot: "bottom" }, (c) => { c.rect(0, 6, 40, 10, "3"); c.rect(8, 0, 22, 7, "2"); c.rect(10, 1, 18, 5, "5"); c.rect(2, 9, 4, 2, "9"); c.rect(34, 9, 4, 2, "9"); c.rect(16, 0, 6, 1, "9") })
anim("mock_ratz", { w: 22, h: 26, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(7, 2, 9, 8, "g"); c.rect(5, 1, 3, 4, "h"); c.rect(15, 1, 3, 4, "h"); c.rect(6, 4, 12, 2, "k"); c.px(14, 6, "k"); c.rect(16, 7, 3, 2, "h")
  c.rect(6, 10, 11, 2, "v"); c.rect(4, 12, 14, 11, "e"); c.rect(5, 23, 4, 3, "d"); c.rect(13, 23, 4, 3, "d"); c.rect(0, 20, 5, 2, "h"); c.rect(0, 18, 2, 3, "h")
})
anim("inv_tap", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(1, 4, 10, 6, "e"); c.rect(11, 6, 6, 2, "h"); c.rect(3, 6, 3, 2, "v"); c.rect(0, 2, 2, 9, "g") })
anim("inv_reis", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(1, 2, 16, 9, "h"); c.rect(1, 2, 16, 2, "S"); c.rect(5, 5, 8, 3, "O") })
// Teo, not painted yet: the orange vest, ear defenders round his neck, gills, the Lull patch behind his ear (pale, an oval: always like the title's)
pal({ T: "#ffa040", t: "#a85a1a", L: "#c8e0f0" })
anim("mock_teo", { w: 21, h: 52, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(7, 0, 8, 4, "k"); c.rect(7, 4, 8, 7, "S"); c.rect(14, 5, 2, 3, "L"); c.rect(8, 9, 2, 1, "s"); c.rect(5, 11, 12, 3, "g")
  c.rect(4, 14, 14, 15, "T"); c.rect(7, 14, 8, 15, "t"); c.rect(4, 22, 14, 1, "h"); c.rect(5, 29, 12, 4, "d"); c.rect(5, 33, 5, 19, "e"); c.rect(12, 33, 5, 19, "e")
})
// Bao's broth to go: a white bowl with a lid and a twist of steam
anim("inv_suppe", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(3, 6, 12, 6, "h"); c.rect(2, 5, 14, 2, "g"); c.rect(7, 3, 4, 2, "g"); c.px(6, 1, "h"); c.px(7, 0, "h"); c.px(11, 1, "h"); c.rect(5, 8, 8, 1, "f") })
