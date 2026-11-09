// The other people of job B (kapitel1-design §4, §10; story §4), painted on the lines of the blocks the user chose on 2026-11-09
// (art/test/tide_people_blocks.px.js, docs/characters/tide_people_blocks_x4.png): Morrow A, the Tidewater boy B, Ratz B.
//   Lt. Agnes Morrow, 50 px, #a8b8d0: a grey trench coat open over a dark jumper, the belt hanging loose; her hair tied back; the badge on
//     its lanyard, lit (her glowing thing); tired eyes. In CAM 07 at 00:30.
//   the Tidewater boy, 44 px, #7ab0c0: the hoodie too big, its hood down round his shoulders, his head shaved; the gills open on the
//     side of his neck, three dark slits, a glowing mark along each and up to his temple (made clearer than in the blocks, as the user
//     asked: they are what he is); the envelope in his hand. In CAM 07 at 00:30.
//   Ratz, 26 px upright, #90d0a0: a cable rat in a parka far too big, its hood up and his ears through two holes in it, the headphones
//     round his neck over the speech collar, which glows when he talks; the tail ends in an old plug. On the Drain Market.
// Drawn facing SE (front three-quarter); the game flips them for SW. Light from the upper left, as Juno's. Every frame of a figure has
// one canvas, its feet's centre in the middle of the bottom row (pivot bottom).
//   morrow_idle_se, morrow_talk_se       a blink; talking: her mouth, a small tilt of the head
//   tideboy_idle_se, tideboy_talk_se     tapping the envelope against his leg, the marks pulsing; talking: the mouth
//   ratz_idle_se/sw, ratz_talk_se/sw     the nose twitching, the plug swinging; talking: the collar glowing bright, the snout open
//   streife_idle                         Revier 9's patrol car from the front (way C of art/test/streife_blocks.px.js, 2026-11-09): the
//                                        flood car, high on big wheels, a snorkel beside the windscreen, a wading gauge painted on both
//                                        posts of the push bar, the mud of the last flood across its body; its two red lights glowing in turn
;(() => {

pal({
  k: "#0c0e1a",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // Morrow: the coat lit, mid, shade, seam; the jumper; skin lit, shade, the mouth; her hair and its light
  F: "#b8bcc4", c: "#9a9ea6", C: "#6a6e76", B: "#44484e", J: "#262a36", S: "#d0a080", s: "#a07050", m: "#5a3028", a: "#3a2a24", A: "#5e4436",
  // the boy: the hoodie lit, mid, shade; his trousers; skin lit, shade; the gills' dark; the envelope and its shade; the sneakers
  H: "#5e8492", h: "#4a6e7a", e: "#304a54", j: "#2a3040", T: "#b07a58", t: "#7a5038", G: "#3a1a1c", W: "#e8e4d4", w: "#b0aca0",
  // Ratz: fur lit, mid, shade; pink and its shade; the parka lit, mid, shade; the headphones; the plug's metal
  f: "#a8a8b0", g: "#8a8a92", n: "#5e5e66", p: "#e8a8b0", P: "#a06a72", O: "#7e8a4e", o: "#6a7440", q: "#485028", M: "#2a2a30", z: "#9aa0a8", Z: "#d0d4da",
  // technology: cyan, bright; Ratz's collar dim and bright
  v: "#62def0", V: "#dafcff", r: "#90d0a0", R: "#d8ffe0",
  // the patrol car: light grey for the headlights' rims and the plate, its red lights bright and dim, the gauge's yellow, the mud
  8: "#c0c8d8", x: "#e83a3a", X: "#ffb0a0", d: "#7a2228", y: "#eec414", u: "#3a3428",
})

// ================================================================ Lt. Morrow (the blocks' morrow(), way A, at x = 10)
const MW = 21, MH = 50
const morrow = (c, o = {}) => {
  const x = 10, nod = o.nod ?? 0
  // the legs and the shoes
  c.rect(x - 4, 39, 3, 8, "3"); c.vline(x - 4, 39, 8, "4"); c.rect(x + 1, 39, 3, 8, "4"); c.vline(x + 1, 39, 8, "5")
  c.rect(x - 5, 47, 4, 3, "1"); c.hline(x - 5, 47, 4, "2"); c.rect(x + 1, 47, 5, 3, "1"); c.hline(x + 1, 47, 5, "3"); c.px(x + 5, 48, "2")
  // the trench coat to below the knee, flaring; lit on the left, its shade on the right; the hem
  for (let r = 11; r <= 40; r++) {
    const half = 6 + Math.round((r - 11) * 2 / 29)
    for (let i = -half; i <= half; i++) c.px(x + i, r, i === -half || i === half ? "C" : i < -half + 2 ? "F" : i > half - 3 ? "C" : "c")
  }
  c.hline(x - 8, 40, 17, "B")
  // open over the dark jumper: its edges, the lapels turned back at the top, the belt hanging loose from its loops, a pocket flap
  c.rect(x - 1, 12, 4, 26, "J"); c.hline(x - 1, 12, 4, "2")
  c.vline(x - 2, 12, 28, "C"); c.vline(x + 3, 12, 28, "B")
  c.line(x - 2, 11, x - 4, 16, "F"); c.line(x + 3, 11, x + 5, 16, "C"); c.px(x - 3, 13, "F"); c.px(x + 4, 13, "C")
  c.vline(x - 6, 23, 9, "B"); c.vline(x + 6, 23, 7, "B"); c.px(x - 6, 22, "C"); c.px(x + 6, 22, "C")
  c.hline(x - 6, 30, 3, "C"); c.hline(x + 4, 30, 3, "B")
  // the lanyard round her neck, the badge on it, lit
  c.line(x - 1, 11, x + 1, 21, "6"); c.rect(x, 21, 3, 3, "v"); c.px(x + 1, 22, "V"); c.px(x + 2, 21, "V")
  // the arms in the coat's sleeves, the cuffs, the hands
  c.rect(x - 9, 13, 3, 16, "C"); c.vline(x - 9, 13, 16, "c"); c.hline(x - 9, 28, 3, "B")
  c.rect(x + 7, 13, 3, 16, "c"); c.vline(x + 9, 13, 16, "C"); c.vline(x + 6, 14, 14, "B"); c.hline(x + 7, 28, 3, "B")
  c.rect(x - 9, 29, 3, 3, "s"); c.px(x - 9, 29, "S"); c.rect(x + 7, 29, 3, 3, "S"); c.px(x + 9, 31, "s")
  // the head, on the blocks' lines: the neck, the face, tired eyes with the shadow under them, the hair tied back into a knot
  const hx = x + 1, hy = 5 + nod
  c.rect(hx - 1, 9, 3, 3, "s")
  c.ellipse(hx, hy, 4, 5, "S"); c.vline(hx - 4, hy - 1, 4, "s"); c.px(hx + 4, hy + 2, "s"); c.hline(hx - 1, hy + 5, 3, "s")
  c.px(hx + 1, hy, o.blink ? "s" : "k"); c.px(hx + 3, hy, o.blink ? "s" : "k"); c.hline(hx + 1, hy + 1, 3, "s")
  c.px(hx + 2, hy + 3, o.talk ? "m" : "s"); if (o.talk) c.px(hx + 3, hy + 3, "m")
  c.rect(hx - 4, hy - 5, 8, 3, "a"); c.hline(hx - 2, hy - 5, 4, "A"); c.rect(hx - 4, hy - 3, 2, 4, "a")
  c.rect(hx - 6, hy - 2, 3, 3, "a"); c.px(hx - 5, hy - 2, "A")
}

// ================================================================ the Tidewater boy (the blocks' boy(), way B, at x = 11)
const BW = 25, BH = 44
const boy = (c, o = {}) => {
  const x = 11, tap = o.tap ?? 0, glow = o.glow ? "V" : "v"
  // the legs, the sneakers with their white soles
  c.rect(x - 3, 29, 3, 12, "j"); c.vline(x - 3, 29, 12, "3"); c.rect(x + 1, 29, 3, 12, "5"); c.vline(x + 1, 29, 12, "6")
  c.rect(x - 4, 41, 4, 3, "W"); c.hline(x - 4, 41, 4, "w"); c.rect(x + 1, 41, 5, 3, "W"); c.hline(x + 1, 41, 5, "w"); c.hline(x - 4, 43, 10, "7")
  // the hoodie, too big: lit on the left, the pocket across the front, the ribbed hem
  c.rect(x - 6, 11, 13, 19, "h"); c.vline(x - 6, 11, 19, "e"); c.vline(x + 6, 11, 19, "e"); c.vline(x - 5, 12, 16, "H")
  c.rect(x - 3, 21, 7, 4, "e"); c.hline(x - 3, 21, 7, "h"); c.hline(x - 6, 29, 13, "e")
  c.px(x + 1, 14, "e"); c.vline(x + 1, 13, 3, "e")                                          // the neck's seam
  // the hood down round his shoulders, its inside dark
  c.rect(x - 5, 10, 11, 3, "e"); c.hline(x - 4, 10, 9, "H"); c.hline(x - 3, 12, 7, "j")
  // the arms; the far hand hanging, the near one holding the envelope (tapped against his leg by tap)
  c.rect(x - 8, 12, 3, 13, "e"); c.vline(x - 8, 12, 13, "h")
  c.rect(x + 6, 12, 3, 13, "h"); c.vline(x + 8, 12, 13, "e")
  c.rect(x - 8, 25, 3, 2, "t"); c.px(x - 8, 25, "T")
  c.rect(x + 6, 25 + tap, 3, 2, "T"); c.px(x + 8, 26 + tap, "t")
  c.rect(x + 8, 22 + tap, 6, 4, "W"); c.hline(x + 8, 22 + tap, 6, "7"); c.hline(x + 8, 25 + tap, 6, "w"); c.line(x + 9, 23 + tap, x + 11, 24 + tap, "w")
  // the head: shaved, the stubble's shade over the crown; the eyes; the mouth
  const hx = x + 1, hy = 5
  c.rect(hx - 2, hy + 4, 4, 3, "t")
  c.ellipse(hx, hy, 4, 5, "T"); c.hline(hx - 3, hy - 5, 7, "t"); c.hline(hx - 2, hy - 4, 4, "t"); c.vline(hx - 4, hy - 1, 3, "t")
  c.px(hx + 1, hy, "k"); c.px(hx + 3, hy, "k"); c.px(hx + 2, hy + 3, o.talk ? "G" : "t")
  // the gills on the side of the neck: three dark slits, a glowing mark along each, the marks running up to his temple
  // (each slit dark with its mark lit right under it, so that they read in the feed's duotone as stripes)
  for (let i = 0; i < 3; i++) { const sx = hx - (i < 2 ? 4 : 3), sy = hy + 1 + i * 2; c.hline(sx, sy, 3, "G"); c.hline(sx, sy + 1, 3, glow) }
  c.px(hx - 4, hy - 1, glow); c.px(hx - 3, hy - 2, glow); c.px(hx - 2, hy - 3, glow)
}

// ================================================================ Ratz (the blocks' ratz(), way B, at x = 17, his feet on row 26)
const RW = 35, RH = 27
const ratz = (c, o = {}) => {
  const x = 17, T = 1, sw = o.sway ?? 0, collar = o.talk ? "R" : "r"
  // the tail out from under the parka, its rings; the old plug at its end, swinging
  c.line(x - 6, T + 21, x - 12, T + 23, "p"); c.line(x - 12, T + 23, x - 15, T + 20 + sw, "p")
  for (const [a, b] of [[x - 8, T + 22], [x - 11, T + 23], [x - 14, T + 21 + sw]]) c.px(a, b, "P")
  c.rect(x - 17, T + 17 + sw, 3, 3, "z"); c.hline(x - 17, T + 17 + sw, 3, "Z"); c.px(x - 17, T + 16 + sw, "z"); c.px(x - 15, T + 16 + sw, "z")
  // the feet, pink, out from under the parka
  c.rect(x - 4, T + 23, 3, 3, "p"); c.hline(x - 4, T + 25, 3, "P"); c.rect(x + 2, T + 23, 4, 3, "p"); c.hline(x + 2, T + 25, 4, "P")
  // the parka to his knees: lit on the left, the zip, a pocket, the hem
  c.rect(x - 6, T + 11, 12, 13, "o"); c.vline(x - 6, T + 11, 13, "q"); c.vline(x - 5, T + 12, 11, "O"); c.hline(x - 6, T + 23, 12, "q")
  c.vline(x, T + 13, 10, "q"); c.px(x, T + 13, "z"); c.rect(x + 1, T + 18, 3, 3, "q"); c.hline(x + 1, T + 18, 3, "O")
  // the sleeves far too long: the near one rolled once, the far one hanging over his paw
  c.rect(x + 4, T + 13, 4, 8, "o"); c.vline(x + 7, T + 13, 8, "q"); c.hline(x + 4, T + 19, 4, "O"); c.px(x + 7, T + 21, "p")
  c.rect(x - 8, T + 13, 3, 8, "q"); c.vline(x - 8, T + 13, 8, "o")
  // the speech collar, glowing (bright when he talks)
  c.rect(x - 3, T + 10, 8, 2, collar); c.px(x + 2, T + 10, "V")
  // the hood up round his head, his ears through two holes in it; the face out of it, the snout to the right, the whiskers
  c.ellipse(x, T + 5, 5, 5, "o"); c.vline(x - 5, T + 4, 4, "q"); c.hline(x - 3, T, 6, "O"); c.px(x - 4, T + 1, "O")
  c.ellipse(x + 2, T + 6, 3, 3, "g"); c.px(x + 1, T + 4, "f"); c.px(x + 2, T + 4, "f")
  c.rect(x + 4, T + 6, 4, 3, "g"); c.hline(x + 4, T + 6, 4, "f"); c.hline(x + 4, T + 8, 3, "n")
  c.px(x + 8, T + 7 + (o.twitch ?? 0), "p"); c.px(x + 4, T + 5, "k")
  if (o.talk) { c.hline(x + 5, T + 9, 3, "M"); c.px(x + 6, T + 9, "W") }
  c.px(x + 9, T + 6, "7"); c.px(x + 9, T + 8, "7")
  c.rect(x - 3, T - 1, 2, 3, "p"); c.px(x - 3, T - 1, "P"); c.rect(x + 2, T - 1, 2, 3, "p"); c.px(x + 3, T - 1, "P")
  // the headphones round his neck, over the collar, a light on the cup
  c.rect(x - 4, T + 11, 9, 2, "M"); c.rect(x - 5, T + 10, 2, 3, "M"); c.px(x - 4, T + 11, "v")
}

// ================================================================ the patrol car (the blocks' carC on tall(), at x = 15, its wheels on row 23)
const CW = 30, CH = 24
const car = (c, o = {}) => {
  const x = 15, lit = o.lit ?? 0
  // the tyres, big, their tread; the dark under the raised body
  for (const tx of [x - 12, x + 8]) { c.rect(tx, 17, 5, 7, "k"); for (let y = 18; y < 24; y += 2) c.hline(tx + 1, y, 3, "1"); c.vline(tx, 17, 7, "1") }
  c.rect(x - 8, 17, 17, 2, "1")
  // the body: the bonnet's lit edge, the shade at the bottom, lit on the left; the mud of the last flood across it, dribbling
  c.rect(x - 12, 10, 25, 8, "5"); c.hline(x - 12, 10, 25, "7"); c.hline(x - 12, 10, 12, "8"); c.rect(x - 12, 15, 25, 2, "4")
  c.vline(x - 12, 11, 4, "6"); c.vline(x + 12, 11, 5, "4")
  c.hline(x - 12, 14, 25, "u"); for (const dx of [-10, -6, 2, 7, 11]) c.px(x + dx, 15, "u")
  // the cabin, the dark windscreen with a streak of light across it, two heads behind it
  c.rect(x - 9, 4, 19, 7, "4"); c.rect(x - 8, 5, 17, 5, "1"); c.hline(x - 9, 4, 19, "6"); c.hline(x - 9, 4, 8, "7")
  c.rect(x - 6, 6, 3, 4, "2"); c.rect(x + 3, 6, 3, 4, "2"); c.px(x - 5, 6, "3"); c.px(x + 4, 6, "3")
  c.line(x + 5, 9, x + 7, 5, "4"); c.line(x - 8, 9, x - 7, 7, "3")
  // the grille, the headlights, the plate with the 9 under the grille
  c.rect(x - 3, 11, 7, 3, "2"); for (let i = -2; i < 4; i += 2) c.vline(x + i, 11, 3, "3")
  c.rect(x - 11, 11, 4, 2, "8"); c.hline(x - 10, 11, 2, "W"); c.rect(x + 8, 11, 4, 2, "8"); c.hline(x + 9, 11, 2, "W")
  c.rect(x - 2, 14, 5, 2, "7"); c.px(x, 14, "2"); c.px(x + 1, 14, "2"); c.px(x + 1, 15, "2")
  // the roof's rail, the two red lights at its ends, glowing in turn
  c.hline(x - 9, 3, 19, "6")
  for (const [lx, on] of [[x - 7, lit === 0], [x + 5, lit === 1]]) { c.rect(lx, 2, 3, 2, on ? "x" : "d"); c.px(lx + 1, 2, on ? "X" : "x") }
  // the snorkel up beside the windscreen, its clamps, its cap
  c.vline(x + 11, 1, 12, "7"); c.vline(x + 12, 1, 12, "6"); c.rect(x + 10, 0, 4, 2, "7"); c.hline(x + 10, 0, 4, "8")
  c.px(x + 11, 5, "7"); c.px(x + 11, 9, "7")
  // the push bar and its posts, the wading gauge painted on both posts
  c.hline(x - 13, 16, 27, "7"); c.hline(x - 13, 16, 10, "8")
  for (const [px, gx] of [[x - 13, x - 14], [x + 13, x + 14]]) { c.vline(px, 12, 5, "6"); for (let i = 0; i < 5; i++) c.px(gx, 12 + i, i % 2 ? "6" : "y") }
}

const opts = (w, h, more) => ({ w, h, outline: "k", pivot: "bottom", ...more })
anim("morrow_idle_se", opts(MW, MH, { frames: 4, ms: [1600, 120, 1400, 900] }), (c) => morrow(c, { blink: c.frame === 1 }))
anim("morrow_talk_se", opts(MW, MH, { frames: 4, ms: [180, 180, 180, 280] }), (c) => morrow(c, { talk: c.frame % 2 === 0, nod: c.frame === 1 ? 1 : 0 }))
anim("tideboy_idle_se", opts(BW, BH, { frames: 4, ms: [400, 300, 400, 900] }), (c) => boy(c, { tap: c.frame === 1 ? 1 : 0, glow: c.frame === 3 }))
anim("tideboy_talk_se", opts(BW, BH, { frames: 4, ms: [180, 180, 180, 280] }), (c) => boy(c, { talk: c.frame % 2 === 0, glow: c.frame === 0 }))
anim("streife_idle", opts(CW, CH, { frames: 2, ms: [700, 700] }), (c) => car(c, { lit: c.frame }))
const SWAY = [0, 0, 1, 1, 0, 0], TWITCH = [0, 1, 0, 0, 1, 0]
for (const [dir, flip] of [["se", null], ["sw", "x"]]) {
  const f = flip ? { flip } : {}
  anim(`ratz_idle_${dir}`, opts(RW, RH, { frames: 6, fps: 5, ...f }), (c) => ratz(c, { sway: SWAY[c.frame], twitch: TWITCH[c.frame] }))
  anim(`ratz_talk_${dir}`, opts(RW, RH, { frames: 4, ms: [140, 140, 140, 220], ...f }), (c) => ratz(c, { talk: c.frame % 2 === 0, twitch: c.frame === 1 ? 1 : 0 }))
}
})()
