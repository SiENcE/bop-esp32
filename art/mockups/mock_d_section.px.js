// Mockup D: the cross-section megablock. A residential-commercial block of the Lower Ninth Ring,
// sliced open from the side like an ant farm: the street and LUCKY STATIC at the bottom, three
// floors of shallow rooms above (an apartment with a sleeper at his TV, a boiler room, a
// laundromat, the server/junk room the broken ad screen is wired into, a back-room clinic, capsule
// bunks), the stairwell zig-zagging up the left, the next floor cut off by the top of the frame
// (the camera scrolls). The cut concrete is drawn as hatched section. Outside, at the right: rain,
// the far towers, the broken screen hung off the wall across two floors, a patrol drone.
// Every room is lit by its own lamps through lighting(), so the floors read as separate cells;
// Juno, the rain, the drone's cone and the UI go on top, unlit.
// 320x180, 12 frames at 100 ms: rain, TV flicker, steam, the static, a failing bulb.
pal({
  k: "#0b0c16",
  0: "#15161f", 1: "#23252f", 2: "#333644", 3: "#474b5a", 4: "#5f6474", 5: "#7c8292", 6: "#9ea3b0", 7: "#c4c8d0", 8: "#eef0f2",
  X: "#4a4e5c", x: "#2a2d38", Z: "#70768a",                       // cut concrete: fill, hatch, edge
  a: "#7a5a50", A: "#9c7666",                                      // wallpaper
  l: "#8aa898", L: "#b4ccbe",                                      // laundromat tile
  c: "#a8bcc8", C: "#d4e2ea",                                      // clinic tile
  w: "#4a2a22", W: "#6e3e2c", r: "#6a1a26", R: "#9a2a38",          // the bar: wood, red lacquer
  g: "#4a5a54", G: "#627a70",                                      // stairwell paint
  u: "#2a3a4a", U: "#3c5068", p: "#5a3a6a", P: "#845a96",          // cloth, odds
  f: "#e0a888", F: "#a8705a", h: "#1c1820",                        // skin, hair
  m: "#ff3cac", M: "#ffb0e4", n: "#9a1c6c",                        // magenta neon
  s: "#2ee0f0", S: "#c8feff", q: "#138aa8", Q: "#0b4a66",          // the screen's cyan
  o: "#ffb04a", O: "#ffe6a8",                                      // warm lamps, lanterns
  e: "#ff2a2a", E: "#ffa8a0", v: "#5cff8c", V: "#1f7a44",          // red eye / LEDs, green
  t: "#5a9cff", T: "#cfe6ff", K: "#e8fff4",                        // TV, fluorescent tube
  b: "#080d1a", B: "#0f182c", d: "#18263e", D: "#223452", H: "#2c4466", // night sky, far towers
  i: "#8eb4d8", I: "#d0e6fa",                                      // rain, splash
  Y: "#fff07a", y: "#f5c832", j: "#c08a1e", J: "#7a5418",          // Juno's slicker
  z: "#1a2230", N: "#2a3448",                                      // wet asphalt
})
ramps("k012345678", "xXZ", "aA", "lL", "cC", "wW", "rR", "gG", "uU", "pP", "Ff", "nmM", "QqsS", "oO", "eE", "VvK", "tT", "bBdDH", "iI", "JjyY", "zN")

include("../../.claude/skills/claude-pxl/lib/ui/font5x7.px.js")

const W = 320, H = 180, N = 12
// floors: [ceiling y, floor y]; slabs are the 4 px between them
const F4 = [0, 12], F3 = [16, 48], F2 = [52, 84], F1 = [88, 120], FG = [124, 164]
const SLABS = [12, 48, 84, 120]
const BX = 232                    // the building's right face; the street beyond
const ih = (a, b = 0, c2 = 0) => { let h = (a * 374761393 + b * 668265263 + c2 * 1442695041) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

// ================================================================ people
// ~21 px figures drawn in code. x: middle column, gy: the floor row, s: facing (1 right, -1 left).
const LOOK = {
  sleeper: { skin: "F", hair: "h", top: "U", topD: "u", legs: "2", shoes: "1" },
  washer: { skin: "f", hair: "p", top: "P", topD: "p", legs: "2", shoes: "1" },
  medic: { skin: "F", hair: "h", top: "7", topD: "6", legs: "3", shoes: "1" },
  patient: { skin: "f", hair: "5", top: "4", topD: "3", legs: "3", shoes: "2" },
  climber: { skin: "F", hair: "h", top: "R", topD: "r", legs: "2", shoes: "1" },
  barman: { skin: "f", hair: "h", top: "7", topD: "6", legs: "2", shoes: "1" },
  cust1: { skin: "F", hair: "h", top: "U", topD: "u", legs: "2", shoes: "1" },
  cust2: { skin: "f", hair: "P", top: "G", topD: "g", legs: "1", shoes: "0" },
  lobby: { skin: "F", hair: "4", top: "W", topD: "w", legs: "2", shoes: "1" },
  cook: { skin: "f", hair: "6", top: "7", topD: "5", legs: "2", shoes: "1" },
}
function person(c, x, gy, L, pose = "stand", s = 1, opt = {}) {
  const X = (u) => (s > 0 ? x + u : x - u)
  const fr = (u0, y, w, h, k) => c.rect(s > 0 ? x + u0 : x - u0 - w + 1, y, w, h, k)
  if (pose === "stand") {
    const top = gy - 21 + (opt.stoop ? 1 : 0)
    fr(-2, gy - 1, 2, 1, L.shoes); fr(1, gy - 1, 3, 1, L.shoes)
    fr(-2, gy - 9, 2, 8, L.legs); fr(1, gy - 9, 2, 8, L.legs); fr(-1, gy - 10, 4, 1, L.legs)
    fr(-2, gy - 17, 5, 8, L.top); fr(-2, gy - 17, 1, 8, L.topD)
    if (opt.apron) fr(1, gy - 14, 2, 8, "8")
    // head: hair at the back and on top, the face forward
    const hu = opt.stoop ? 0 : -1
    fr(hu, top, 4, 4, L.skin); fr(hu, top, 4, 1, L.hair); fr(hu, top, 1, 3, L.hair)
    c.px(X(hu + 3), top + 1, "k")
    // the near arm
    if (opt.reach) { fr(1, gy - 16, 3, 1, L.topD); c.px(X(4), gy - 17, L.skin) }
    else { fr(0, gy - 16, 1, 6, L.topD); c.px(X(0), gy - 10, L.skin) }
  } else if (pose === "sit" || pose === "sleep") {
    // a seat whose top is at gy-7: thighs forward, shins down
    fr(-2, gy - 15, 5, 7, L.top); fr(-2, gy - 15, 1, 7, L.topD)
    fr(-1, gy - 8, 7, 2, L.legs); fr(4, gy - 6, 2, 5, L.legs); fr(4, gy - 1, 3, 1, L.shoes)
    const hy = pose === "sleep" ? gy - 18 : gy - 19, hu = pose === "sleep" ? -2 : -1
    fr(hu, hy, 4, 4, L.skin); fr(hu, hy, 4, 1, L.hair); fr(hu, hy, 1, 3, L.hair)
    if (pose === "sit") c.px(X(hu + 3), hy + 1, "k")
    fr(0, gy - 14, 1, 5, L.topD); fr(1, gy - 10, 3, 1, L.topD); c.px(X(4), gy - 10, L.skin)
  } else if (pose === "back") {
    // seen from behind on a stool: hair, shoulders, legs hanging
    c.rect(x - 2, gy - 19, 4, 4, L.hair); c.px(x - 2, gy - 19, "."); c.px(x + 1, gy - 19, ".")
    c.rect(x - 3, gy - 15, 6, 8, L.top); c.vline(x - 3, gy - 15, 8, L.topD); c.vline(x + 2, gy - 15, 8, L.topD)
    c.rect(x - 2, gy - 7, 2, 6, L.legs); c.rect(x + 1, gy - 7, 2, 6, L.legs)
    c.rect(x - 2, gy - 1, 2, 1, L.shoes); c.rect(x + 1, gy - 1, 2, 1, L.shoes)
  } else if (pose === "front") {
    // facing us, cut at the waist by the counter
    c.rect(x - 2, gy - 21, 4, 4, L.skin); c.hline(x - 2, gy - 21, 4, L.hair); c.px(x - 2, gy - 20, L.hair); c.px(x + 1, gy - 20, L.hair)
    c.px(x - 1, gy - 19, "k"); c.px(x, gy - 19, "k")
    c.rect(x - 3, gy - 17, 6, 9, L.top); c.vline(x - 3, gy - 16, 7, L.topD); c.vline(x + 2, gy - 16, 7, L.topD)
    c.px(x - 3, gy - 9, L.skin); c.px(x + 2, gy - 9, L.skin)
  } else if (pose === "lie") {
    // lying on a reclined chair, head at x, feet toward s
    fr(0, gy - 4, 4, 3, L.skin); fr(0, gy - 4, 1, 3, L.hair)
    fr(4, gy - 3, 8, 3, L.top); fr(12, gy - 2, 7, 2, L.legs); fr(19, gy - 3, 1, 3, L.shoes)
  }
}

// ================================================================ outside: sky and far towers
function sky(c) {
  c.grad(BX, 0, W - BX, 170, "bBBdd", "v", 0.6)
  // far towers, in the haze: flat silhouettes, a few lit windows, red aviation lights
  const T = [[232, 30, 22, "d"], [252, 14, 18, "d"], [266, 44, 26, "d"], [290, 22, 14, "d"], [302, 8, 20, "d"],
    [240, 70, 20, "D"], [262, 86, 16, "D"], [280, 62, 22, "D"], [300, 78, 24, "D"]]
  for (const [tx, ty, tw, k] of T) {
    c.rect(tx, ty, tw, 170 - ty, k)
    for (let y = ty + 3; y < 165; y += 4) for (let xx = tx + 2; xx < tx + tw - 1; xx += 3)
      if (ih(xx, y, tx) < (k === "D" ? 0.1 : 0.06)) c.px(xx, y, ih(y, xx) < 0.5 ? "H" : ih(xx, y) < 0.8 ? "Q" : "J")
    if (k === "d" && tx % 3 === 0) c.px(tx + (tw >> 1), ty - 1, "e")
  }
  c.rect(266, 40, 1, 4, "d"); c.px(266, 39, "e")
}

// ================================================================ rooms (back walls and things in them)
function rooms(c) {
  const f = c.frame
  // ---- stairwell core, x 6..50
  c.rect(6, 0, 44, 164, "g")
  for (const [top, fl] of [F4, F3, F2, F1, FG]) { c.rect(6, fl - 8, 44, 8, "G"); c.hline(6, fl - 9, 44, "5") }   // dado band
  // ---- F4, cut off by the top of the frame: someone's corridor, a dripping pipe
  c.rect(54, 0, 172, 12, "3"); c.rect(54, 8, 172, 4, "2")
  for (let xx = 60; xx < 226; xx += 22) c.rect(xx, 0, 12, 12, "1")       // doors along a corridor
  for (let xx = 60; xx < 226; xx += 22) c.px(xx + 9, 6, "5")
  // ---- F3 left: the apartment, x 54..150
  for (let xx = 54; xx < 150; xx++) c.vline(xx, 16, 24, xx % 4 === 0 ? "A" : "a")
  c.rect(54, 40, 96, 8, "w"); c.hline(54, 40, 96, "W")
  c.rect(84, 20, 10, 13, "R"); c.rect(85, 21, 8, 6, "8"); c.rect(86, 22, 6, 4, "m"); c.text(85, 28, "OK", "8")   // poster
  c.rect(104, 22, 18, 2, "W"); c.rect(106, 18, 3, 4, "o"); c.rect(110, 19, 2, 3, "5"); c.rect(114, 17, 5, 5, "3")   // shelf, junk
  // floor lamp
  c.vline(60, 30, 18, "2"); c.rect(57, 26, 7, 4, "O"); c.hline(58, 25, 5, "o"); c.hline(58, 47, 5, "2")
  // mattress on the floor, a rumpled blanket
  c.rect(64, 42, 28, 6, "7"); c.rect(70, 41, 22, 6, "U"); c.hline(70, 41, 22, "u"); c.rect(64, 41, 6, 3, "8")
  // armchair, the sleeper in it facing the TV
  c.rect(102, 37, 14, 11, "r"); c.rect(100, 30, 4, 18, "R"); c.rect(102, 37, 14, 2, "R"); c.vline(103, 47, 1, "1"); c.vline(114, 47, 1, "1")
  person(c, 106, 45, LOOK.sleeper, "sleep", 1)
  c.rect(116, 46, 3, 2, "o")                                            // a noodle cup on the floor
  // the TV on a crate, flickering
  c.rect(128, 40, 16, 8, "W"); c.hline(128, 40, 16, "w")
  c.rect(129, 29, 14, 11, "1"); c.rect(130, 30, 12, 9, f % 3 === 2 ? "T" : f % 4 === 1 ? "s" : "t")
  for (let y = 30; y < 39; y += 2) c.hline(130, y, 12, f % 3 === 2 ? "t" : "Q")
  c.line(133, 28, 130, 24, "4"); c.line(138, 28, 142, 23, "4")
  // ---- F3 right: the boiler room, x 152..226
  c.rect(152, 16, 74, 32, "3"); for (let y = 18; y < 48; y += 6) c.hline(152, y, 74, "2")
  c.rect(172, 20, 26, 28, "4"); c.rect(172, 20, 26, 3, "5"); c.vline(172, 20, 28, "3"); c.vline(197, 20, 28, "2")  // tank
  c.hline(172, 30, 26, "3"); c.hline(172, 40, 26, "3")
  c.rect(178, 42, 6, 4, "0"); c.rect(179, 43, 4, 2, f % 4 < 2 ? "o" : "O")                 // the burner's window
  c.circ(190, 34, 2, "6"); c.px(190, 34, "e")                                           // gauge
  c.rect(206, 16, 3, 32, "5"); c.rect(214, 16, 3, 32, "4"); c.hline(198, 26, 8, "5"); c.ring(211, 36, 3, "e")  // pipes, valve
  c.rect(160, 40, 8, 8, "W"); c.hline(160, 40, 8, "w")
  c.rect(175, 17, 4, 3, "1"); c.px(176, 17, "."); c.px(178, 17, "1"); c.px(175, 19, "1")   // a cat on the tank
  // ---- F2 left: the laundromat, x 54..150
  for (let xx = 54; xx < 150; xx++) for (let y = 52; y < 84; y++) c.px(xx, y, (xx % 6 === 0 || y % 6 === 0) ? "l" : "L")
  c.rect(54, 76, 96, 8, "3"); c.hline(54, 76, 96, "4")
  for (let i = 0; i < 3; i++) {                                         // front-loaders
    const wx = 57 + i * 15
    c.rect(wx, 67, 14, 17, "7"); c.rect(wx, 67, 14, 3, "6"); c.px(wx + 11, 68, "v"); c.vline(wx + 13, 67, 17, "5")
    c.circ(wx + 6, 76, 4, "4"); c.circ(wx + 6, 76, 3, i === 1 ? "U" : "2")
    if (i === 1) { const a = (f / N) * Math.PI * 4; c.px(wx + 6 + Math.round(Math.cos(a) * 2), 76 + Math.round(Math.sin(a) * 2), "8"); c.px(wx + 6 - Math.round(Math.cos(a) * 2), 76 - Math.round(Math.sin(a) * 2), "P") }
  }
  c.rect(108, 76, 26, 2, "W"); c.vline(109, 78, 6, "2"); c.vline(132, 78, 6, "2")      // bench
  person(c, 118, 84, LOOK.washer, "sit", -1)
  c.rect(122, 72, 6, 4, "6"); c.hline(122, 72, 6, "7")                                  // laundry basket
  c.rect(136, 60, 10, 7, "V"); c.text(137, 61, "24", "v")                                 // a 24h sign
  // ---- F2 right: the server and junk room, x 152..226; the screen's cables leave through the wall at y 66
  c.rect(152, 52, 74, 32, "2"); for (let i = 0; i < 9; i++) c.vline(156 + i * 8, 53 + (i % 3), 4 + (i % 4), "1")  // damp stains
  for (let r = 0; r < 2; r++) {                                         // racks
    const rx = 156 + r * 13
    c.rect(rx, 58, 11, 26, "1"); c.rect(rx + 1, 59, 9, 24, "0")
    for (let y = 60; y < 82; y += 3) { c.hline(rx + 1, y, 9, "2"); c.px(rx + 2 + ((y + r) % 4), y + 1, ih(y, r, f >> 1) < 0.5 ? "v" : "1"); c.px(rx + 7, y + 1, ih(y, r + 5, f) < 0.35 ? "e" : "1") }
  }
  c.rect(186, 74, 20, 2, "W"); c.vline(187, 76, 8, "w"); c.vline(204, 76, 8, "w")      // a desk, a CRT, junk
  c.rect(190, 66, 10, 8, "5"); c.rect(191, 67, 7, 5, ih(f, 3) < 0.7 ? "q" : "s"); c.rect(200, 70, 4, 4, "4")
  c.rect(208, 76, 14, 8, "4"); c.rect(210, 72, 9, 4, "3"); c.hline(208, 76, 14, "5"); c.rect(213, 68, 5, 4, "1")
  // the bulb on its cord
  c.vline(196, 52, 6, "1"); c.rect(195, 58, 3, 2, [2, 7].includes(f) ? "4" : "O")
  // cable bundle under the ceiling, sagging, out to the screen
  for (const [dy, k] of [[0, "0"], [1, "1"], [2, "Q"], [3, "0"]]) {
    for (let xx = 160; xx < 226; xx++) { const sag = Math.round(3 * Math.sin(((xx - 160) / 66) * Math.PI)); c.px(xx, 60 + dy + sag - (xx > 214 ? Math.round((xx - 214) * 0.5) : 0), k) }
  }
  // ---- F1 left: the back-room clinic, x 54..128
  for (let xx = 54; xx < 128; xx++) for (let y = 88; y < 120; y++) c.px(xx, y, (xx % 5 === 0 || y % 5 === 0) ? "c" : "C")
  c.rect(54, 112, 74, 8, "6"); c.hline(54, 112, 74, "7")
  c.rect(58, 96, 12, 18, "6"); c.rect(59, 97, 10, 7, "7"); c.rect(59, 105, 10, 8, "7"); c.rect(62, 92, 6, 3, "V"); c.rect(64, 92, 2, 3, "v"); c.rect(63, 93, 4, 1, "v")  // cabinet, green cross
  c.rect(78, 113, 26, 2, "4"); c.vline(90, 115, 5, "3"); c.hline(86, 119, 9, "3"); c.line(78, 113, 74, 108, "4")   // reclined chair
  person(c, 76, 113, LOOK.patient, "lie", 1)
  person(c, 112, 120, LOOK.medic, "stand", -1, { reach: true })
  c.vline(88, 88, 6, "4"); c.rect(84, 94, 9, 2, "5"); c.hline(85, 96, 7, "K")             // surgical lamp
  c.vline(98, 98, 22, "5"); c.rect(96, 98, 5, 6, "T"); c.hline(96, 98, 5, "6")            // IV bag
  c.rect(118, 98, 8, 6, "1"); c.rect(119, 99, 6, 4, "Q"); c.line(119, 101, 124, 101, "s"); c.px(121, 100, "s")   // monitor
  // ---- F1 right: capsule bunks, x 130..226
  c.rect(130, 88, 96, 32, "1")
  const PODS = [[134, 92], [157, 92], [180, 92], [203, 92], [134, 106], [157, 106], [180, 106], [203, 106]]
  PODS.forEach(([px, py], i) => {
    c.rect(px, py, 21, 13, "4"); c.rect(px + 2, py + 2, 17, 10, "6"); c.hline(px, py, 21, "5")
    if (i === 2 || i === 7) { c.rect(px + 2, py + 2, 17, 10, "2"); c.hline(px + 2, py + 10, 17, "3") }   // shutters down
    else { c.rect(px + 3, py + 9, 15, 3, ["U", "P", "W", "u", "R", "p", "U", "P"][i]) }
    if (i === 5) { c.rect(px + 8, py + 7, 4, 2, "f"); c.hline(px + 12, py + 8, 6, "U") }
  })
  c.vline(180, 104, 16, "5"); for (let y = 106; y < 120; y += 3) c.hline(178, y, 3, "5")   // ladder
  c.rect(226 - 6, 113, 4, 7, "1"); c.rect(203 + 16, 118, 3, 2, "2")
  // ---- ground floor left: the lobby, x 54..98
  c.rect(54, 124, 44, 40, "g"); c.rect(54, 154, 44, 10, "2"); c.hline(54, 154, 44, "3")
  for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) { c.rect(58 + k * 7, 132 + r * 6, 6, 5, "4"); c.hline(59 + k * 7, 134 + r * 6, 4, "1") }  // mailboxes
  c.rect(60, 152, 26, 2, "W"); c.vline(61, 154, 9, "2"); c.vline(84, 154, 9, "2")
  person(c, 70, 162, LOOK.lobby, "sit", 1)
  c.rect(88, 140, 6, 6, "7"); c.hline(89, 142, 4, "4"); c.hline(89, 144, 3, "4")           // a notice
  // ---- ground floor right: LUCKY STATIC, x 100..226, open to the street
  c.rect(100, 124, 126, 40, "r"); for (let xx = 100; xx < 226; xx += 7) c.vline(xx, 124, 20, "R")
  c.rect(100, 144, 126, 20, "w"); for (let xx = 100; xx < 226; xx += 5) c.vline(xx, 144, 20, "W")
  // shelves of bottles behind the counter
  for (const sy of [134, 140]) { c.hline(104, sy, 30, "W"); for (let xx = 105; xx < 133; xx += 2) c.vline(xx, sy - 3, 3, ["o", "V", "R", "8", "U"][(xx + sy) % 5]) }
  // the kitchen: a hood, a pot
  c.rect(106, 125, 22, 4, "5"); c.rect(110, 129, 14, 2, "4")
  c.rect(110, 143, 10, 5, "4"); c.hline(110, 143, 10, "6")
  // the counter, the barman behind it, two regulars on stools
  person(c, 146, 158, LOOK.barman, "front")
  c.rect(102, 148, 100, 3, "W"); c.hline(102, 148, 100, "O"); c.rect(104, 151, 96, 13, "w"); for (let xx = 104; xx < 200; xx += 6) c.vline(xx, 151, 13, "W")
  for (const [bx, b] of [[128, 0], [138, 1]]) { c.rect(bx, 146, 4, 2, "8"); c.px(bx + 1, 145, "W") }  // bowls, chopsticks
  for (const sx of [130, 162, 182]) { c.rect(sx - 3, 156, 7, 2, "R"); c.vline(sx, 158, 6, "4"); c.hline(sx - 2, 163, 5, "4") }
  person(c, 130, 156, LOOK.cust1, "back"); person(c, 162, 156, LOOK.cust2, "back")
  // paper lanterns
  for (const lx of [140]) { c.vline(lx, 124, 4, "1"); c.rect(lx - 2, 128, 5, 6, "o"); c.hline(lx - 2, 128, 5, "R"); c.hline(lx - 2, 133, 5, "R") }
  // LUCKY STATIC, the neon hung under the ceiling; the K buzzes
  c.rect(150, 125, 70, 11, "0"); c.rect(150, 125, 70, 1, "n"); c.rect(150, 135, 70, 1, "n")
  c.text(153, 127, "LUCKY STATIC", (j) => (j === 4 && c.frame % 6 === 2 ? "n" : "m"), { font: "5x7" })
  // the open front: a rolled-up shutter, a step
  c.rect(206, 150, 18, 14, "0"); c.rect(207, 151, 16, 2, "o")    // a doorway glow at the side: the menu board
  c.rect(207, 151, 16, 12, "1"); c.text(208, 152, "RAMEN", "O"); c.text(208, 158, "SOBA", "o")
}

// ================================================================ the stairs
// one flight per floor, zig-zagging: [x at the bottom, floor y, x at the top, floor y above]
const FLIGHTS = [[18, 164, 44, 120], [44, 120, 14, 84], [14, 84, 44, 48], [44, 48, 14, 12]]
function stairs(c) {
  for (const [x0, y0, x1, y1] of FLIGHTS) {
    const n = Math.round(Math.abs(x1 - x0) / 3), rise = (y0 - y1) / n, s = Math.sign(x1 - x0)
    for (let i = 0; i < n; i++) {
      const yy = Math.round(y0 - rise * (i + 1)), xs = x0 + s * i * 3
      const xl = s > 0 ? xs : xs - 3
      c.rect(xl, yy, 3, Math.round(rise) + 3, "5"); c.hline(xl, yy, 3, "7")
    }
    // stringer underneath and a rail
    c.line(x0, y0 - 1, x1 - s * 3, y1 + 3, "3")
    c.line(x0, y0 - 9, x1, y1 - 8, "6")
    for (let k = 1; k < 4; k++) { const xx = Math.round(x0 + (x1 - x0) * k / 4), yy = Math.round(y0 + (y1 - y0) * k / 4); c.vline(xx, yy - 8, 6, "4") }
  }
  // someone coming down the F2 flight, a man in a red jacket
  person(c, 30, 66, LOOK.climber, "stand", -1)
  // the exit, down at the left: a green sign, an arrow
  c.rect(7, 132, 15, 7, "V"); c.text(8, 133, "EXIT", "v")
  c.line(10, 145, 8, 147, "v"); c.line(8, 147, 10, 149, "v"); c.hline(8, 147, 6, "v")
}

// ================================================================ the structure: the cut concrete
const SOLID = [[0, 0, 6, 140], [0, 140, 2, 24], ...SLABS.map((sy) => [0, sy, BX, 4]), [BX - 6, 0, 6, 130],
  [50, 0, 4, 12], [50, 16, 4, 10], [50, 52, 4, 10], [50, 88, 4, 10], [50, 124, 4, 12],          // core wall over its doors
  [150, 16, 2, 32], [150, 52, 2, 32], [128, 88, 2, 32], [98, 124, 2, 12], [0, 164, BX, 16]]
const HOLES = [[22, 120, 22, 4], [14, 84, 22, 4], [22, 48, 22, 4], [14, 12, 22, 4], [BX - 6, 66, 6, 4]]   // stair wells, the cable hole
const inHole = (x, y) => HOLES.some(([hx, hy, hw, hh]) => x >= hx && x < hx + hw && y >= hy && y < hy + hh)
function structure(c) {
  for (const [x, y, w, h] of SOLID) c.rect(x, y, w, h, "X")
  for (const [x, y, w, h] of HOLES) c.rect(x, y, w, h, "_")
}
// drawn again on top of the light: the section as a flat graphic, hatched, its edges picked out
function section(c) {
  const solid = (x, y) => !inHole(x, y) && SOLID.some(([sx, sy, w, h]) => x >= sx && x < sx + w && y >= sy && y < sy + h)
  for (const [sx, sy, w, h] of SOLID) for (let y = sy; y < sy + h; y++) for (let x = sx; x < sx + w; x++) {
    if (!solid(x, y)) continue
    const edge = !solid(x, y - 1) || !solid(x - 1, y) || !solid(x + 1, y) || !solid(x, y + 1)
    c.px(x, y, edge ? (y < H - 1 && !solid(x, y - 1) ? "Z" : "x") : (x + y) % 4 === 0 ? "x" : "X")
  }
}

// ================================================================ outside
function street(c) {
  // the pavement: wet, puddles
  c.rect(BX, 164, W - BX, 4, "N"); c.hline(BX, 164, W - BX, "4")
  c.rect(BX, 168, W - BX, 12, "z"); for (let xx = BX; xx < W; xx += 4) c.px(xx + (xx >> 2) % 3, 171 + (xx % 7) % 6, "1")
  for (const [px0, pw] of [[236, 14], [258, 22], [296, 18]]) c.rect(px0, 165, pw, 2, "z")
  // a steam grate at the kerb
  c.rect(252, 163, 8, 2, "1"); for (let xx = 252; xx < 260; xx += 2) c.px(xx, 163, "4")
  // the vending machine against the wall
  c.rect(233, 134, 15, 30, "U"); c.rect(233, 134, 15, 2, "6"); c.vline(247, 134, 30, "u")
  c.rect(235, 137, 11, 15, "0")
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) {
    const dead = r >= 2 && k >= 1
    c.rect(236 + k * 3 + (k > 0 ? 0 : 0), 138 + r * 4, 2, 3, dead ? "1" : ["m", "o", "s", "v"][(r + k) % 4])
  }
  c.rect(240, 147, 6, 4, "O"); c.hline(241, 148, 4, "e"); c.hline(241, 150, 3, "e")           // OUT OF ORDER sticker
  c.rect(236, 154, 9, 3, "0"); c.rect(236, 158, 9, 4, "1"); c.px(244, 154, "v")
  // the noodle cart, the cook behind it under a battered umbrella
  c.vline(306, 120, 30, "4")
  c.poly([290, 128, 299, 121, 306, 119, 313, 121, 322, 128], "R"); c.hline(290, 128, 32, "r"); c.line(293, 127, 300, 122, "M")
  c.px(296, 129, "r"); c.px(318, 129, "r"); c.px(304, 129, "r")
  c.vline(296, 129, 6, "1"); c.rect(294, 135, 5, 6, "o"); c.hline(294, 135, 5, "R")        // its lantern
  person(c, 312, 158, LOOK.cook, "stand", -1, { stoop: true, apron: true })
  c.rect(288, 148, 26, 12, "W"); c.hline(288, 148, 26, "O"); c.rect(290, 151, 22, 6, "w"); c.text(292, 152, "UDON", "o")
  c.circ(292, 161, 3, "1"); c.circ(310, 161, 3, "1"); c.px(292, 161, "5"); c.px(310, 161, "5")
  c.rect(296, 142, 10, 6, "4"); c.hline(295, 142, 12, "6")                                 // the pot
}

// the broken screen, hung off the wall on two arms across floors 1 and 2
const SC = [240, 54, 52, 54]       // outer frame x, y, w, h
function screen(c) {
  const f = c.frame, [sx, sy, sw, shh] = SC
  c.rect(BX, 60, sx - BX, 2, "3"); c.rect(BX, 100, sx - BX, 2, "3")                       // arms
  for (const [dy, k] of [[0, "0"], [1, "Q"], [2, "1"]]) for (let xx = BX; xx < sx; xx++) c.px(xx, 67 + dy + Math.round(4 * Math.sin(((xx - BX) / (sx - BX)) * Math.PI)), k)   // its cables, from the server room
  c.rect(sx, sy, sw, shh, "1"); c.rect(sx + 1, sy + 1, sw - 2, shh - 2, "0")
  const x0 = sx + 2, y0 = sy + 2, w = sw - 4, h = shh - 4, mid = x0 + 25
  // the advert half: scanlines, a smiling sleeping face, the slogan
  for (let y = y0; y < y0 + h; y++) c.hline(x0, y, mid - x0, y % 2 ? "Q" : "q")
  c.ellipse(x0 + 12, y0 + 24, 9, 12, "s"); c.ellipse(x0 + 13, y0 + 25, 7, 10, "S")
  c.rect(x0 + 3, y0 + 10, 19, 5, "q"); c.rect(x0 + 3, y0 + 14, 3, 9, "q")              // hair
  c.line(x0 + 7, y0 + 22, x0 + 10, y0 + 22, "q"); c.line(x0 + 15, y0 + 22, x0 + 18, y0 + 22, "q")   // shut eyes
  c.px(x0 + 6, y0 + 21, "q"); c.px(x0 + 19, y0 + 21, "q")
  c.line(x0 + 9, y0 + 30, x0 + 12, y0 + 32, "Q"); c.line(x0 + 13, y0 + 32, x0 + 17, y0 + 30, "Q")  // the smile
  c.text(x0 + 2, y0 + 2, "NAGI·WA", "S")
  c.text(x0 + 2, y0 + h - 7, "SLEEP", "S"); c.text(x0 + 2 + 22, y0 + h - 7, "BET", "s")
  // the dead half: static, and in it one huge eye looking down at the street
  for (let y = y0; y < y0 + h; y++) for (let xx = mid; xx < x0 + w; xx++) {
    const v = ih(xx, y, f * 7 + 1)
    c.px(xx, y, v < 0.6 ? "Q" : v < 0.88 ? "q" : v < 0.97 ? "s" : "S")
  }
  const ex = mid + 12, ey = y0 + 25, blink = f === 9 ? 2 : 0
  c.ellipse(ex, ey, 12, 8 - blink, "0"); c.ellipse(ex, ey, 11, 7 - blink, "Q"); c.ellipse(ex, ey, 10, 6 - blink, "S")
  if (!blink) { c.circ(ex - 3, ey + 1, 5, "s"); c.ring(ex - 3, ey + 1, 5, "q"); c.circ(ex - 3, ey + 1, 2, "k"); c.px(ex - 5, ey - 1, "S"); c.px(ex - 4, ey - 1, "S") }
  else c.hline(ex - 9, ey, 18, "q")
  // the glitch tears: rows of the advert slipped sideways, a bright scan line
  const tear = (f * 5) % h
  c.hline(x0, y0 + tear, w, "S"); c.hline(x0 + 4, y0 + ((tear + 17) % h), 14, "s")
  for (let y = y0 + 34; y < y0 + 37; y++) c.hline(x0 + 26 - (f % 3), y, 6, "q")
  // cracks from the impact, top left of the eye
  const ix = mid - 3, iy = y0 + 9
  for (const [dx, dy] of [[-9, -7], [10, -7], [-12, 8], [6, 14], [-4, 16]]) c.line(ix, iy, ix + dx, iy + dy, "k")
  c.circ(ix, iy, 1, "k")
  for (let y = y0; y < y0 + h; y += 1) if (ih(y, 99) < 0.12) c.px(mid + 4, y, "0")   // a dead column
}

function drone(c) {
  const f = c.frame, bob = f % 6 < 3 ? 0 : 1, dx = 302, dy = 108 + bob
  c.rect(dx - 5, dy, 11, 4, "2"); c.hline(dx - 4, dy, 9, "4"); c.rect(dx - 8, dy - 2, 4, 1, "3"); c.rect(dx + 5, dy - 2, 4, 1, "3")
  c.px(dx - 6, dy - 1, "3"); c.px(dx + 6, dy - 1, "3")
  c.rect(dx - 1, dy + 2, 3, 2, "0"); c.px(dx, dy + 2, f % 4 === 0 ? "E" : "e")
}

// ================================================================ the lamps
const BULB = [1, 1, 0.15, 1, 1, 0.9, 1, 0.2, 1, 1, 1, 1]
const TV = [0.8, 1.1, 0.6, 0.9, 1.2, 0.7, 0.95, 1.1, 0.65, 1, 0.8, 1.15]
function lamps(c) {
  const f = c.frame
  c.lamp(140, 6, { r: 40, color: "#6070a0", power: 0.6 })
  c.lamp(60, 27, { r: 46, color: "#ffb070", power: 0.9 })
  c.lamp(136, 36, { r: 36, color: "#7ab0ff", power: TV[f] })
  c.lamp(180, 44, { r: 40, color: "#ff7a3a", power: 0.75 })
  c.lamp(100, 55, { r: 70, color: "#d8ffe8", power: 1 })
  c.lamp(196, 60, { r: 46, color: "#ffd88a", power: BULB[f] })
  c.lamp(88, 96, { r: 60, color: "#d0f0ff", power: 1 })
  ;[[144, 98], [167, 98], [213, 98], [144, 112], [167, 112], [190, 112]].forEach(([x, y], i) => c.lamp(x, y, { r: 14, color: i % 2 ? "#ff9ad0" : "#ffc080", power: 0.8 }))
  c.lamp(76, 130, { r: 48, color: "#a8c890", power: 0.95 })
  c.lamp(150, 132, { r: 64, color: "#ffb060", power: 1.1 })
  c.lamp(206, 134, { r: 54, color: "#ff9a50", power: 0.9 })
  for (const [y, p] of [[22, 0.9], [58, f % 5 === 3 ? 0.2 : 0.9], [94, 0.9], [132, 1]]) c.lamp(28, y, { r: 44, color: "#8898c8", power: p })
  c.lamp(298, 140, { r: 34, color: "#ffc070", power: 1.1 })
}

// ================================================================ on top: rain, steam, cone, reflections
const DROPS = Array.from({ length: 110 }, (_, i) => [BX + Math.floor(ih(i, 1) * (W - BX + 30)), Math.floor(ih(i, 2) * 180), 3 + Math.floor(ih(i, 3) * 3)])
function rain(c) {
  const f = c.frame
  for (const [x0, y0, len] of DROPS) {
    const y = (y0 + f * 15) % 180, x = x0 - Math.floor(y / 5)
    for (let k = 0; k < len; k++) { const yy = y + k, xx = x0 - Math.floor(yy / 5); if (yy < 164 && xx >= BX && xx < W) c.px(xx, yy, "i") }
  }
}
function splashes(c) {
  const f = c.frame
  for (let i = 0; i < 9; i++) { const xx = BX + 2 + Math.floor(ih(i, f, 3) * (W - BX - 4)); c.px(xx, 163, "I"); c.px(xx - 1, 162, "i"); c.px(xx + 1, 162, "i") }
  for (let i = 0; i < 3; i++) { const xx = 292 + Math.floor(ih(i, f, 9) * 28); c.px(xx, 127 - Math.floor(Math.abs(xx - 306) / 2.5), "I") }   // on the umbrella
}
function reflections(c) {
  // the puddles mirror what glows above them: the screen, the bar's spill, the vending machine, Juno
  for (let xx = 238; xx < 288; xx++) if (ih(xx, 7) < 0.6) c.px(xx, 165 + (xx % 2), ih(xx, 8) < 0.5 ? "s" : "q")
  for (let xx = 236; xx < 248; xx++) if (xx % 2) c.px(xx, 166, "m")
  for (let xx = BX; xx < BX + 6; xx++) if (xx % 3) c.px(xx, 165, "o")
  for (let xx = 275; xx < 283; xx++) c.px(xx, 166, xx % 2 ? "y" : "j")
}
function steam(c) {
  for (const [vx, vy, d] of [[301, 141, 0], [115, 142, 5], [256, 162, 3]])
    c.plume(vx, vy, "876", { every: 4, life: 24, rise: 16, wind: 0.2, size: [1, 3], thin: "shrink", seed: vx, frame: c.frame + d })
}

// ================================================================ Juno, the UI
sprite("juno", { outline: "k", pivot: "bottom" }, `
  ....yyyy..
  ..yyYYYYy.
  .yYYYYYYyj
  .yhhYYYYyj
  ffhhyYYyyj
  .ffhyYYyyj
  .fsFyYyyjj
  ..FFyyyjj.
  ..jyyyyjj.
  .yYYYyyyjj
  .yYY4yyyjj
  .yYYY4yyjj
  .yYYyy4yjj
  .fyYyyy554
  ..yYyyy554
  ..yyyyj555
  ..yyyyyjj.
  ..jjjjjJ..
  ..11.111..
  ..11..11..
  .00...00..
  000..000..`)
sprite("portrait", { outline: "k" }, `
  ....yyyyyy....
  ..yyYYYYYYyy..
  .yYYYYYYYYYYy.
  .yYhhhhhhhhYy.
  yYhhhfffffhYYy
  yYhffffffffhYy
  yYhfkkffkkfhYy
  yYhffffffffhYy
  yYhfsfffFffhYj
  yYYfsffffffYYj
  .yYYfffffffYj.
  .jyYYFffFYYyj.
  ..jyyYYYYyyj..
  ...jjyyyyjj...`)
sprite("bag", { outline: "k" }, `
  ...4444.....
  ..4....4....
  .4......4...
  555555555555
  566666666665
  566655556665
  566657756665
  566666666665
  455555555554
  .4444444444.`)
sprite("cursor", { outline: "k" }, `
  8......
  88.....
  888....
  8888...
  88888..
  888888.
  8888...
  88.88..
  8...88.
  ....88.`)

function ui(c) {
  // the portrait, bottom left, and the bag, bottom right
  c.rect(2, 160, 19, 18, "1"); c.rect(2, 160, 19, 1, "3")
  c.stamp("portrait", 3, 161)
  c.rect(298, 162, 19, 16, "1"); c.rect(298, 162, 19, 1, "3"); c.stamp("bag", 301, 164)
  // the hover label over the screen, the cursor on the eye
  c.text(229, 45, "Broken ad screen", "k", { font: "5x7" }); c.text(228, 44, "Broken ad screen", "8", { font: "5x7" })
  c.stamp("cursor", 283, 86)
  // what Juno says, over her head
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]]) c.text(224 + dx, 125 + dy, "It... said my name.", "k", { font: "5x7" })
  c.text(224, 125, "It... said my name.", "Y", { font: "5x7" })
}

// ================================================================ the scene
scene("mock_d_section", { w: W, h: H, bg: "b", frames: N, fps: 10, world: { light: false } },
  layer("sky", { unlit: true }, sky),
  layer("rooms", { wall: true }, rooms),
  layer("stairs", stairs),
  layer("outside", street, screen, drone),
  layer("structure", { solid: true }, structure),
  layer("lamps", lamps),
  lighting({ cell: 2, smooth: true, ambient: 0.1, ambientColor: "#4a5a8a", block: 0.6, emit: "mMnsSqQoOeEvVtTK", emitLight: { r: 14, power: 0.5 } }),
  layer("section", section),
  layer("reflections", { opacity: 0.6 }, reflections),
  layer("cone", { opacity: 0.16 }, poly([299, 112, 305, 112, 324, 164, 282, 164], "T")),
  layer("rain", { opacity: 0.55 }, rain),
  layer("splash", { opacity: 0.8 }, splashes),
  layer("steam", { opacity: 0.45 }, steam),
  glow("mM", { r: 4, strength: 0.4 }),
  glow("sS", { where: [SC[0], SC[1], SC[2], SC[3]], r: 8, strength: 0.25 }),
  glow("oOeK", { r: 3, strength: 0.3 }),
  layer("juno", stamp("juno", 279, 164)),
  layer("ui", ui),
)
