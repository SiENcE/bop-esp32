// The other people of job B (kapitel1-design §4, §10; story §4), painted on the lines of the blocks the user chose on 2026-11-09
// (art/test/tide_people_blocks.px.js, docs/characters/tide_people_blocks_x4.png): Morrow A, the Tidewater boy B (Ratz B was here too, seen
// from the side; the Drain Market is seen from above now, and he with it: art/characters/markt_people.px.js).
//   Lt. Agnes Morrow, 50 px, #a8b8d0: a grey trench coat open over a dark jumper, the belt hanging loose; her hair tied back; the badge on
//     its lanyard, lit (her glowing thing); tired eyes. In CAM 07 at 00:30.
//   the Tidewater boy, 44 px, #7ab0c0: the hoodie too big, its hood down round his shoulders, his head shaved; the gills open on the
//     side of his neck, three dark slits, a glowing mark along each and up to his temple (made clearer than in the blocks, as the user
//     asked: they are what he is); the envelope in his hand. In CAM 07 at 00:30.
// Drawn facing SE (front three-quarter); the game flips them for SW. Light from the upper left, as Juno's. Every frame of a figure has
// one canvas, its feet's centre in the middle of the bottom row (pivot bottom).
//   morrow_idle_se, morrow_talk_se       a blink; talking: her mouth, a small tilt of the head
//   tideboy_idle_se, tideboy_talk_se     tapping the envelope against his leg, the marks pulsing; talking: the mouth
//   streife_idle                         Revier 9's patrol car from the front (way C of art/test/streife_blocks.px.js, 2026-11-09): the
//                                        flood car, high on big wheels, a snorkel beside the windscreen, a wading gauge painted on both
//                                        posts of the push bar, the mud of the last flood across its body; its two red lights glowing in turn
//   streife_nah                          the same car near, where Morrow stops in Jade Row in Chapter 2 (20.4 px a metre)
;(() => {

pal({
  k: "#0c0e1a",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // Morrow: the coat lit, mid, shade, seam; the jumper; skin lit, shade, the mouth; her hair and its light
  F: "#b8bcc4", c: "#9a9ea6", C: "#6a6e76", B: "#44484e", J: "#262a36", S: "#d0a080", s: "#a07050", m: "#5a3028", a: "#3a2a24", A: "#5e4436",
  // the boy: the hoodie lit, mid, shade; his trousers; skin lit, shade; the gills' dark; the envelope and its shade; the sneakers
  H: "#5e8492", h: "#4a6e7a", e: "#304a54", j: "#2a3040", T: "#b07a58", t: "#7a5038", G: "#3a1a1c", W: "#e8e4d4", w: "#b0aca0",
  // technology: cyan, bright
  v: "#62def0", V: "#dafcff",
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

// ================================================================ the patrol car near: in Jade Row itself (Chapter 2)
// The same car at the size it has where Morrow stops in the lane (approved as a block, 2026-11-16: art/test/streife_nah_blocks.px.js),
// 20.4 px a metre: 2.0 m wide, the body 0.55 to 1.25 m up, the cabin to 1.95, the snorkel to 2.2. Lit from the upper left like the
// small one; the mud of the last flood across its body, dribbling; its two red lights glowing in turn.
const NW = 50, NH = 48, NK = 20.4, NX = 25, NY = 47
const nX = (m) => Math.round(NX + m * NK), nY = (m) => Math.round(NY - m * NK)
const nb = (c, x0, h0, x1, h1, k) => c.rect(nX(x0), nY(h1), Math.max(1, nX(x1) - nX(x0)), Math.max(1, nY(h0) - nY(h1)), k)
const carNear = (c, o = {}) => {
  const lit = o.lit ?? 0
  // the tyres, big, their tread lit along the near edge; the dark under the raised body
  for (const x of [-1.0, 0.62]) {
    nb(c, x, 0, x + 0.38, 0.75, "k")
    for (let y = nY(0.72); y < nY(0); y += 3) c.hline(nX(x) + 1, y, nX(x + 0.38) - nX(x) - 2, "2")
    c.vline(nX(x), nY(0.75), nY(0) - nY(0.75), "2")
  }
  nb(c, -0.62, 0.4, 0.62, 0.55, "1")
  // the body: shaded at its foot, lit on the left and along the bonnet's edge; the mud across it, dribbling down
  nb(c, -1.0, 0.55, 1.0, 1.25, "5"); nb(c, -1.0, 0.55, 1.0, 0.66, "4")
  nb(c, -1.0, 1.19, 1.0, 1.25, "7"); nb(c, -1.0, 1.19, -0.1, 1.25, "8")
  c.vline(nX(-1.0), nY(1.19), nY(0.66) - nY(1.19), "6"); c.vline(nX(1.0) - 1, nY(1.19), nY(0.55) - nY(1.19), "4")
  c.hline(nX(-1.0), nY(0.78), nX(1.0) - nX(-1.0), "u")
  for (const [dx, len] of [[-0.9, 2], [-0.7, 4], [-0.45, 1], [0.3, 3], [0.55, 2], [0.85, 4]]) c.vline(nX(dx), nY(0.78) + 1, len, "u")
  // the grille between the headlights, the headlights in their rims, the plate under the grille
  nb(c, -0.28, 0.82, 0.28, 1.1, "2"); for (let x = nX(-0.22); x < nX(0.28); x += 2) c.vline(x, nY(1.06), nY(0.86) - nY(1.06), "3")
  for (const x of [-0.94, 0.6]) { nb(c, x, 0.92, x + 0.34, 1.12, "8"); nb(c, x + 0.07, 0.97, x + 0.27, 1.07, "W") }
  nb(c, -0.18, 0.6, 0.18, 0.74, "7"); c.hline(nX(-0.1), nY(0.67), 2, "2"); c.hline(nX(0.02), nY(0.67), 3, "2")
  // the cabin, the dark windscreen with a streak of light across it, two heads behind it, the mirrors
  nb(c, -0.78, 1.25, 0.78, 1.95, "4"); nb(c, -0.68, 1.31, 0.68, 1.87, "1")
  c.hline(nX(-0.78), nY(1.95), nX(0.78) - nX(-0.78), "6"); c.hline(nX(-0.78), nY(1.95), 10, "7")
  for (const x of [-0.42, 0.18]) { nb(c, x, 1.36, x + 0.24, 1.66, "2"); nb(c, x + 0.04, 1.62, x + 0.2, 1.68, "3") }
  c.line(nX(0.3), nY(1.36), nX(0.55), nY(1.82), "3"); c.line(nX(-0.62), nY(1.42), nX(-0.5), nY(1.66), "3")
  for (const x of [-0.94, 0.78]) nb(c, x, 1.48, x + 0.16, 1.62, "5")
  // the roof's rail, the two red lights at its ends, glowing in turn
  c.hline(nX(-0.7), nY(1.98), nX(0.7) - nX(-0.7), "6")
  for (const [x, on] of [[-0.62, lit === 0], [0.34, lit === 1]]) { nb(c, x, 1.98, x + 0.28, 2.1, on ? "x" : "d"); c.hline(nX(x) + 1, nY(2.1), 3, on ? "X" : "x") }
  // the snorkel up beside the windscreen, its clamps, its cap
  nb(c, 0.82, 1.05, 0.88, 2.18, "7"); nb(c, 0.88, 1.05, 0.93, 2.18, "6"); nb(c, 0.76, 2.14, 0.98, 2.24, "8")
  for (const h of [1.4, 1.75]) nb(c, 0.8, h, 0.95, h + 0.05, "8")
  // the push bar and its posts, the wading gauge painted on both posts
  nb(c, -1.1, 0.5, 1.1, 0.58, "7"); nb(c, -1.1, 0.54, -0.2, 0.58, "8")
  for (const x of [-1.1, 1.02]) { nb(c, x, 0.58, x + 0.08, 0.98, "6"); for (let i = 0; i < 4; i++) nb(c, x, 0.62 + i * 0.09, x + 0.08, 0.66 + i * 0.09, "y") }
}

const opts = (w, h, more) => ({ w, h, outline: "k", pivot: "bottom", ...more })
anim("morrow_idle_se", opts(MW, MH, { frames: 4, ms: [1600, 120, 1400, 900] }), (c) => morrow(c, { blink: c.frame === 1 }))
anim("morrow_talk_se", opts(MW, MH, { frames: 4, ms: [180, 180, 180, 280] }), (c) => morrow(c, { talk: c.frame % 2 === 0, nod: c.frame === 1 ? 1 : 0 }))
anim("tideboy_idle_se", opts(BW, BH, { frames: 4, ms: [400, 300, 400, 900] }), (c) => boy(c, { tap: c.frame === 1 ? 1 : 0, glow: c.frame === 3 }))
anim("tideboy_talk_se", opts(BW, BH, { frames: 4, ms: [180, 180, 180, 280] }), (c) => boy(c, { talk: c.frame % 2 === 0, glow: c.frame === 0 }))
anim("streife_idle", opts(CW, CH, { frames: 2, ms: [700, 700] }), (c) => car(c, { lit: c.frame }))
anim("streife_nah", opts(NW, NH, { frames: 2, ms: [700, 700] }), (c) => carNear(c, { lit: c.frame }))
})()
