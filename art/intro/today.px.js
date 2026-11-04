// The intro's shot 6 (docs/kapitel0-design.md §5): today, 2091-11-03, 21:30. Close on the home-built deck in Juno's flat:
// the CRT with a camera's street in the phosphor, the open boards and their cables beside it, her hand on the mouse in
// the yellow sleeve. What she carried out in the box is all here, uncommented: the cactus, the chipped cup with Halcyon's
// ring, and the data stick, plugged into her boards.
//   intro_today_bg   320x180, a still, between the bars (y 23..157). What moves is the game's (game/intro_today.js): the
//                    people and the rain in the feed, a roll of the picture, the cursor, her hand, the board's lights.
// The feed's and the stick's words are the city's tech, in English. No German in the art.
include("../lib/text.js")
;(() => {
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e", 5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",   // the phosphor
  k: "#0c0e1a", n: "#06080f", A: "#131a2a", B: "#1a2337", C: "#232f47", D: "#2f3e5a", E: "#41547a", F: "#617aa0",   // ink, night steel
  g: "#565e70", G: "#8e96a8", h: "#3d4656", H: "#b9c6d8", W: "#e8ecf2",                                             // the CRT's casing, the cup
  c: "#123c4e", v: "#1f88a4", V: "#62def0",                                                                         // screen cyan
  y: "#eec414", Y: "#fff070", j: "#9a7406",                                                                         // her coat
  S: "#d79676", s: "#93583f", T: "#b5785c", l: "#a9c29c",                                                           // skin; in the phosphor's light
  q: "#123a2c", Q: "#1f5a45", R: "#35806a", p: "#5c3322", P: "#7d4930", t: "#a1623c",                               // the cactus, its pot
  m: "#3e1240", M: "#a8238a", O: "#552b1c", a: "#eea040", u: "#2a1a12",                                             // the sign's magenta outside; heat and coffee
})
const W = 320, H = 180
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const bay = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16
const rnd = (i, s) => { let h = (i * 374761393 + s * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
const SX = 70, SY = 44, SW = 120, SH = 66     // the monitor's picture (the game draws the people into it)
const DESK = 120

// a wet street from a camera on a pole: shop fronts, the lit one with its awning, the pavement, the road with the lights in it
function street(x, y) {
  if (y < 32) {
    const shop = Math.floor(x / 44), lx = x - shop * 44
    if (y < 6) return lx % 10 < 6 && y > 1 && rnd(Math.floor(lx / 10) + shop * 7, 5) < 0.35 ? "5" : "2"
    if (lx < 2) return "1"
    if (y < 11) return shop === 1 ? "7" : "3"
    if (shop === 0) return y % 3 === 0 ? "2" : "3"
    return y > 27 ? "3" : lx > 5 && lx < 39 ? (lx % 11 < 2 ? "3" : shop === 1 ? "6" : "4") : "3"
  }
  if (y < 46) return y === 32 ? "5" : "4"
  if (y === 46) return "2"
  const mirror = street(x, 46 - (y - 46) - 16)                                    // the road mirrors the fronts, broken
  return (y + (x >> 3)) % 4 === 0 ? "2" : mirror === "7" || mirror === "6" ? "4" : "3"
}

sprite("intro_today_bg", { w: W, h: H }, (c) => {
  // the wall in the dark, the sign's magenta from the window off to the right falling on it (dithered: light falling off)
  c.rect(0, 0, W, H, "A")
  for (let y = 0; y < DESK; y++) for (let x = 0; x < W; x++) {
    if (bay(x, y) < ((x - 230) / 90) * 0.5) c.px(x, y, "m")
    else if (bay(x, y) < (1 - Math.hypot(x - 130, y - 76) / 130) * 0.6) c.px(x, y, "c")          // the screens' own glow
  }
  // the desk's back edge, lit by the screens; its top, darker towards us, the phosphor's pool on it
  c.rect(0, DESK, W, H - DESK, "C"); c.hline(0, DESK, W, "E")
  for (let y = DESK + 1; y < H; y++) for (let x = 0; x < W; x++) {
    const d = Math.hypot((x - 130) / 2, y - DESK)
    if (bay(x, y) < (1 - d / 46) * 0.7) c.px(x, y, "4")
    else if (bay(x, y) < (y - DESK) / 70) c.px(x, y, "B")
  }

  // the boards on the right, stacked on stand-offs and open: the deck's own, built from what she could get
  c.line(214, 70, 204, 92, "k"); c.line(214, 96, 204, 104, "k"); c.line(222, 118, 150, 124, "k")      // their cables to the CRT
  for (const [x, y, w] of [[224, 58, 84], [218, 88, 92]]) {
    c.rect(x, y, w, 22, "B"); c.hline(x, y, w, "D"); c.rect(x, y + 22, w, 2, "k")
    for (let i = 0; i < 6; i++) c.rect(x + 4 + i * 13, y + 5, 9, 5, i % 3 === 2 ? "k" : "C")          // the chips
    for (let i = 0; i < 16; i++) c.px(x + 5 + i * 5, y + 15, "D")                                     // the traces' ends
    c.rect(x + 2, y + 24, 3, DESK - y - 24 > 8 ? 6 : 4, "h"); c.rect(x + w - 5, y + 24, 3, DESK - y - 24 > 8 ? 6 : 4, "h")   // the stand-offs
  }
  c.rect(286, 60, 18, 18, "k"); c.ellipse(295, 69, 7, 7, "C")                                         // the fan's housing
  c.rect(218, 112, 92, 8, "h"); c.hline(218, 112, 92, "g")                                           // the board they stand on
  // the stick in its socket: the one from the box; its label, as much of it as fits at this size
  c.rect(232, 98, 4, 8, "G"); c.rect(236, 95, 44, 14, "D"); c.hline(236, 95, 44, "E"); c.rect(236, 107, 44, 2, "B")
  c.rect(241, 97, 34, 9, "H")
  TXT.draw(c, 258, 99, "EVAL-7", "k", { font: "hud", align: "center" })

  // the CRT, grey and heavy, its corners rounded, the tube's glass set back in the bezel; a knob, the power light
  c.rect(58, 34, 146, 88, "g"); c.rect(56, 36, 150, 84, "g")
  c.hline(58, 34, 146, "G"); c.vline(56, 36, 84, "G"); c.vline(205, 36, 84, "h"); c.rect(58, 118, 146, 4, "h")
  c.rect(66, 40, 128, 74, "h"); c.rect(68, 42, 124, 70, "k")
  for (const [x, y] of [[62, 110], [70, 118], [190, 118]]) c.px(x, y, "h")
  c.rect(172, 115, 3, 2, "7"); c.rect(180, 115, 4, 3, "h"); c.rect(188, 115, 4, 3, "h")
  for (let i = 0; i < 7; i++) c.hline(72 + i * 4, 116, 2, "h")                                       // the vents, a nod to something repaired twice
  c.rect(84, 122, 94, 3, "h")                                                                        // its foot

  // the picture: a street in the phosphor, scanlines on it, the tube's corners rounding it off
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
    const k = street(x, y)
    c.px(SX + x, SY + y, k)
  }
  for (const [x, y] of [[0, 0], [SW - 1, 0], [0, SH - 1], [SW - 1, SH - 1]]) c.px(SX + x, SY + y, "k")
  TXT.draw(c, SX + 4, SY + 3, "CAM 09", "8", { font: "hud" })

  // the cactus on the left, three years older, a new arm; its pot
  for (let x = 18; x < 38; x++) {
    const u = (x - 18 + 0.5) / 20, crown = 58 + Math.round(7 * (1 - Math.sqrt(Math.max(0, 1 - (2 * u - 1) ** 2))))
    c.rect(x, crown, 1, 104 - crown, u < 0.25 ? "R" : u < 0.7 ? "Q" : "q")
  }
  c.rect(38, 74, 5, 10, "Q"); c.rect(40, 66, 5, 10, "Q"); c.rect(40, 66, 1, 10, "R"); c.rect(13, 84, 5, 6, "Q"); c.rect(11, 78, 5, 8, "Q"); c.rect(11, 78, 1, 8, "R")
  for (let y = 66; y < 102; y += 7) { c.px(22, y, "8"); c.px(29, y + 3, "8"); c.px(35, y, "8") }
  c.rect(14, 102, 28, 3, "t"); for (let y = 105; y < DESK + 2; y++) { const i = Math.round((y - 105) / 7); c.rect(16 + i, y, 24 - 2 * i, 1, "P"); c.rect(16 + i, y, 3, 1, "t"); c.rect(36 - i, y, 4, 1, "p") }

  // the keyboard
  c.rect(82, 128, 100, 14, "k"); c.rect(83, 128, 98, 13, "h")
  for (let r = 0; r < 3; r++) for (let i = 0; i < 20; i++) c.rect(85 + i * 4.8 + (r % 2), 130 + r * 4, 4, 3, r === 1 && i === 9 ? "F" : "g")

  // the cup, on the desk beside the pot, chipped, cold coffee in it, the ring on its side (the date's line stays free under it)
  c.rect(42, 106, 3, 2, "G"); c.rect(41, 108, 2, 12, "G"); c.rect(42, 120, 3, 2, "h")
  c.rect(45, 104, 34, 33, "H"); c.rect(45, 104, 5, 33, "W"); c.rect(71, 104, 8, 33, "G")
  c.ellipse(62, 104, 17, 3, "W"); c.ellipse(62, 104, 14, 2, "u"); c.rect(69, 101, 3, 2, "u")
  c.ellipse(62, 120, 7, 7, "v"); c.ellipse(62, 120, 4, 4, "H")
})
})()
