// Chapter 1's mock (docs/kapitel1-design.md): flat blocks for the cameras and streets not yet painted, enough to
// play the chapter through and to judge the layout before anything is painted. The feeds use the phosphor ramp
// (the look comes from the post-effects as on the painted ones), the street rooms a grey-blue. The text is signs of
// the city, English like all of them. Where people stand and what is clickable: game/places.js (at.cam21 and on).
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
  k: "#0c0e1a", a: "#131a2a", b: "#1a2337", d: "#232f47", e: "#2f3e5a", f: "#41547a", g: "#617aa0", h: "#a8b8d0",
  m: "#a8238a", M: "#ff4fd3", y: "#eea040",
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
// the roof: the parapet, the tank, the hatch with the ladder; over it the underside of the next Ring
scene("dach_bg", { w: W, h: H, bg: "k" }, (c) => {
  c.rect(0, 0, W, 66, "a"); for (const y of [12, 30, 48]) c.hline(0, y, W, "b")
  for (const x of [40, 110, 196, 268]) c.rect(x, 0, 14, 40, "b")
  for (const [x, y] of [[60, 20], [150, 8], [240, 28], [300, 14]]) c.rect(x, y, 3, 2, "y")
  c.rect(0, 66, W, 44, "d"); c.rect(0, 110, W, 70, "e"); c.hline(0, 110, W, "g")
  c.rect(34, 56, 62, 56, "f"); c.rect(34, 56, 62, 4, "g")
  c.rect(268, 120, 40, 56, "b"); c.rect(276, 124, 3, 52, "h"); c.rect(296, 124, 3, 52, "h"); for (let y = 128; y < 176; y += 9) c.hline(276, y, 23, "h")
  c.rect(110, 78, 60, 32, "f")
})
// the big look upwards: standing under the Rings, each one a ceiling with a hole, the next one further up through it;
// the nearest fills the picture, far up in the middle the Crown's light (for the big painting later)
scene("dach_blick_bg", { w: W, h: H, bg: "k" }, (c) => {
  const CX = 160, CY = 62, RINGS = [[330, "d"], [214, "b"], [150, "a"], [104, "b"], [70, "a"], [46, "b"], [28, "a"], [15, "b"]]
  const disc = (rx, k) => { const ry = rx * 0.62; for (let y = Math.max(0, Math.ceil(CY - ry)); y <= Math.min(H - 1, Math.floor(CY + ry)); y++) { const w = rx * Math.sqrt(Math.max(0, 1 - ((y - CY) / ry) ** 2)), x0 = Math.max(0, Math.round(CX - w)), x1 = Math.min(W, Math.round(CX + w)); if (x1 > x0) c.hline(x0, y, x1 - x0, k) } }
  for (const [rx, k] of RINGS) { disc(rx, "e"); disc(rx - 2, k) }
  disc(7, "g"); disc(3, "h")
  // lights along the rim of each Ring: fewer and warmer down here, whiter up there
  RINGS.forEach(([rx], n) => { for (let i = 0; i < 9; i++) { const a = i * 0.7 + n, x = Math.round(CX + (rx - 7) * Math.cos(a)), y = Math.round(CY + (rx - 7) * 0.62 * Math.sin(a)); if (x > 0 && x < W && y > 0 && y < H) c.rect(x, y, n < 3 ? 3 : 2, n < 3 ? 2 : 1, n < 2 ? "y" : n < 4 ? "M" : "h") } })
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
