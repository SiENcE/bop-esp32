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
// the bar: the counter across the room, seen from over it
scene("cam22_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "2", "5", 62)
  c.rect(30, 18, 60, 34, "3"); c.rect(120, 18, 60, 34, "3"); c.rect(210, 18, 60, 34, "3")
  c.rect(24, 118, 272, 20, "6"); c.hline(24, 118, 272, "8")
  for (const x of [60, 120, 180, 240]) c.rect(x, 100, 12, 14, "2")
  SIGN(c, 110, 4, 100, "PHO PUMP")
})
// the laundromat from its ceiling: the dryers in a row, the counter with its tickets
scene("cam23_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "3", "5", 74)
  for (let i = 0; i < 8; i++) {
    const x = 16 + i * 30
    c.rect(x, 28, 26, 40, "4"); c.rect(x + 5, 36, 16, 16, "2"); c.rect(x + 8, 39, 10, 10, i === 5 ? "8" : "3")
    TXT.draw(c, x + 13, 56, String(i + 1), i === 5 ? "9" : "7", { font: "hud", align: "center" })
  }
  c.rect(268, 80, 44, 60, "6"); c.hline(268, 80, 44, "8")
  SIGN(c, 96, 8, 112, "SUDS & SPIN")
})
// the door of the Lerche block, through a fisheye (only its corners dark)
scene("cam24_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "3", "5", 90)
  c.rect(124, 24, 72, 66, "5"); c.rect(158, 24, 4, 66, "3")
  SIGN(c, 112, 8, 96, "LERCHE BLOCK")
  c.rect(0, 0, 40, 26, "1"); c.rect(280, 0, 40, 26, "1"); c.rect(0, 154, 40, 26, "1"); c.rect(280, 154, 40, 26, "1")
})
// the way down to the Drain Market: the ladder and the grating
scene("cam12_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "2", "4", 60)
  c.rect(140, 60, 40, 90, "1")
  for (let y = 66; y < 148; y += 8) c.hline(144, y, 32, "7")
  c.rect(0, 150, W, 30, "4")
  SIGN(c, 104, 40, 112, "DRAIN MARKET")
})
// the stairs into the water, the sign
scene("cam30_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "2", "4", 48)
  for (let i = 0; i < 6; i++) c.rect(110 + i * 2, 80 + i * 12, 100 - i * 4, 12, String(6 - i))
  c.rect(0, 150, W, 30, "1")
  c.rect(104, 148, 112, 32, "2")
  SIGN(c, 88, 30, 144, "LINE 31 - CLOSED", "7", "1")
})
// the old station: the water up to the platform, one emergency light
scene("cam31_bg", { w: W, h: H, bg: "0" }, (c) => {
  ROOM(c, "1", "4", 44)
  c.rect(0, 130, W, 50, "2")
  for (let x = 6; x < W; x += 34) c.hline(x, 150 + (x % 3) * 8, 14, "4")
  c.rect(40, 20, 44, 54, "2"); for (let i = 0; i < 5; i++) c.hline(44 + i * 3, 64 - i * 8, 36, "4")   // the stairs
  c.rect(250, 44, 40, 86, "0")                                                                       // the tunnel
  c.rect(170, 10, 10, 4, "9")
})
// the alley behind the gate: cable bundles, doors, the way on to the laundromat and down to the market
scene("gasse_bg", { w: W, h: H, bg: "k" }, (c) => {
  c.rect(0, 0, W, 104, "b"); c.rect(0, 104, W, 76, "a")
  for (const y of [14, 22, 34]) c.hline(0, y, W, "e")
  c.rect(30, 44, 44, 60, "d"); c.rect(120, 52, 30, 52, "d"); c.rect(232, 40, 56, 64, "e")
  SIGN(c, 228, 26, 64, "SUDS & SPIN", "d", "h")
  c.rect(0, 150, 30, 30, "e"); c.rect(120, 138, 60, 14, "e")
  SIGN(c, 112, 122, 76, "DRAIN MARKET", "d", "h")
})
// the ledge outside the flat: the wall of the block, the window, the ladder hanging too high, the street far below
scene("sims_bg", { w: W, h: H, bg: "k" }, (c) => {
  c.rect(0, 0, W, 128, "d"); c.rect(0, 128, W, 26, "f"); c.hline(0, 128, W, "h")
  for (const x of [120, 180]) c.rect(x, 40, 34, 40, "e")
  c.rect(28, 62, 44, 62, "g"); c.rect(32, 66, 36, 54, "m")
  c.rect(254, 0, 3, 92, "h"); c.rect(270, 0, 3, 92, "h"); for (let y = 6; y < 92; y += 10) c.hline(254, y, 19, "h")
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
// a person not painted yet: the Rain Reader on her bucket
anim("mock_regen", { w: 19, h: 40, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(6, 0, 7, 8, "h"); c.rect(3, 8, 13, 20, "g"); c.rect(5, 28, 9, 12, "d"); c.rect(2, 12, 2, 8, "g")
})
// the laundromat from inside: eight dryers, the counter
scene("laundromat_bg", { w: W, h: H, bg: "k" }, (c) => {
  c.rect(0, 0, W, 100, "d"); c.rect(0, 100, W, 80, "b")
  for (let i = 0; i < 8; i++) {
    const x = 12 + i * 28
    c.rect(x, 50, 25, 46, "e"); c.rect(x + 4, 58, 17, 17, "a"); c.rect(x + 7, 61, 11, 11, i === 5 ? "g" : "d")
    TXT.draw(c, x + 12, 80, String(i + 1), i === 5 ? "h" : "f", { font: "hud", align: "center" })
  }
  c.rect(252, 90, 58, 34, "f"); c.hline(252, 90, 58, "h")
  c.rect(0, 40, 14, 60, "a")
  SIGN(c, 96, 22, 128, "NO SNEAKERS IN THE DRYER", "b", "g")
})
