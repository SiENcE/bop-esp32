// Lantern in his caravan (kapitel2-design §10), painted on the lines of the approved block (art/test/lantern_blocks.px.js,
// docs/characters/lantern_blocks_*; the user, 2026-11-16): the same boxes, wheels and hulls, the painting only adds to them. His look is
// the portrait's (docs/portraits/lantern_x4.png, story §10 "Lanterns Aussehen"): the bright green crest in his colour #b0f0a0 on a
// shaved head, the cracked ocular over his right eye with its text running, the other eye narrowed with a stud in the brow, a crooked
// grin with a steel tooth, the headset with three antennas and their own lights on his left ear, a circuit line at the temple, the
// poncho of coloured patches with its hood thrown back, a small lit lantern on a cable round his neck; dark brown skin. His
// wheelchair: a steel frame, two big wheels with their push rims, small casters, a footrest.
// He sits turned south-west, toward Juno where she stands to talk, his back to his desk; one direction only, drawn, never mirrored
// (the ocular on his right eye, the antennas on his left ear). From there the near side is his left. Lit from the upper left, as
// the others: the tops lightest, what faces the lower left (his front) in the base tone, what faces the lower right (his left) in shade.
//   lantern_sit_sw    idle: 8 frames, his breath (the head and shoulders a pixel down), the antennas' lights blinking one after
//                     another, the ocular's text running, the lantern at his neck flickering
//   lantern_talk_sw   talking: 2 frames, the mouth open and shut, the rest as idle
// Every frame 38x62 with the outline, pivot bottom-centre (the chair's middle on the floor; the near wheel reaches 2 px below it).
"use strict"
const LANTERN_PAL = {
  k: "#0c0e1a",
  // skin (lit, base, shade, deep: the lines), the shaved scalp's stubble
  S: "#9a6448", s: "#7a4a32", t: "#5a3424", T: "#38201a", z: "#4a3a3a",
  // the crest (tip, lit, base, shade)
  w: "#e0ffd8", g: "#b0f0a0", G: "#78c070", H: "#4a8a50",
  // the poncho (lit, base, shade, deep) and its patches (each lit and shade), the stitches
  P: "#7666aa", u: "#5a4a8a", U: "#433468", V: "#2e2448",
  m: "#e060b8", n: "#9a2e78", c: "#4ab0cc", C: "#2a6e88", o: "#e08840", O: "#a0561e", e: "#68b86e", E: "#3e7a44", x: "#c8bce8",
  // the trousers (lit, base, shade), the boots (base, lit)
  D: "#566078", d: "#454c60", b: "#2e3444", B: "#1c1f28", K: "#3a3f50",
  // the chair: steel (bright, lit, base, dark), the tyres (base, lit), the seat's vinyl
  9: "#a8b4c8", 6: "#617aa0", 5: "#41547a", 4: "#2f3e5a", 1: "#131a2a", 3: "#2a3348", 2: "#1a2337",
  // the ocular's lens and text, the lights (cyan, magenta), the lantern's glow
  L: "#3ac070", l: "#d8ffd0", v: "#62def0", M: "#ff4fd3", y: "#7cff9a",
  // the white of his eye
  W: "#e8e2d4",
}
pal(LANTERN_PAL)

const LNW = 36, LNH = 60, LCX = 17, LGY = 56
// a quarter wider across than the block (the user, 2026-11-16: in the room he looked narrow); his depth and height are the block's
const LNWIDE = 1.25
/** a point of him (meters): f forward (toward the lower left), s to his right (the upper left), h up -> the sprite's px */
const LNP = (f, s, h) => [LCX - 16 * (f + s * LNWIDE), LGY + 8 * (f - s * LNWIDE) - 30 * h]
const R = Math.round
/** a filled convex shape round the points (their hull); where(x, y) may pick the key per pixel */
function lnHull(c, pts, k) {
  const P = pts.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo = [], up = []
  for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p) }
  for (const p of P.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p) }
  const H = lo.slice(0, -1).concat(up.slice(0, -1))
  if (H.length < 3) return
  const x0 = Math.floor(Math.min(...H.map((p) => p[0]))), x1 = Math.ceil(Math.max(...H.map((p) => p[0])))
  const y0 = Math.floor(Math.min(...H.map((p) => p[1]))), y1 = Math.ceil(Math.max(...H.map((p) => p[1])))
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    let inside = true
    for (let i = 0; i < H.length; i++) if (cr(H[i], H[(i + 1) % H.length], [x + 0.5, y + 0.5]) < -0.01) { inside = false; break }
    if (inside) { const kk = typeof k === "function" ? k(x, y) : k; if (kk) c.px(x, y, kk) }
  }
}
/** a box of him: the block's hull in the side's tone, then its front (toward the lower left) and its top over it */
function lnBox(c, f0, s0, h0, df, ds, dh, top, front, side) {
  const f1 = f0 + df, s1 = s0 + ds, h1 = h0 + dh, pts = []
  for (const f of [f0, f1]) for (const s of [s0, s1]) for (const h of [h0, h1]) pts.push(LNP(f, s, h))
  lnHull(c, pts, side ?? front ?? top)
  if (front) lnHull(c, [LNP(f1, s0, h0), LNP(f1, s1, h0), LNP(f1, s0, h1), LNP(f1, s1, h1)], front)
  if (top) lnHull(c, [LNP(f0, s0, h1), LNP(f1, s0, h1), LNP(f0, s1, h1), LNP(f1, s1, h1)], top)
}
/** a wheel standing in the plane of his facing: the tyre (lit along its upper left), the rim, spokes, the push rim, the hub */
function lnWheel(c, f, s, h, r, near) {
  const ring = (rr) => { const pts = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(LNP(f + rr * Math.cos(t), s, h + rr * Math.sin(t))) } return pts }
  const [cx, cy] = LNP(f, s, h)
  lnHull(c, ring(r), (x, y) => (x + 0.5 - cx) * -0.5 + (y + 0.5 - cy) * -1 > r * 26 ? "3" : "1")   // the tyre, its tread lit up there
  lnHull(c, ring(r - 0.05), near ? "6" : "5")
  lnHull(c, ring(r - 0.07), "2")
  for (let i = 0; i < 6; i++) {                                                                       // the spokes
    const t = (i / 6) * Math.PI * 2 + 0.3, [x1, y1] = LNP(f + (r - 0.07) * Math.cos(t), s, h + (r - 0.07) * Math.sin(t))
    c.line(R(cx), R(cy), R(x1), R(y1), near ? "5" : "4")
  }
  if (near) for (let i = 0; i < 24; i++) {                                                            // the push rim, outside the spokes
    const t = (i / 24) * Math.PI * 2, [x, y] = LNP(f + (r - 0.09) * Math.cos(t), s - 0.03, h + (r - 0.09) * Math.sin(t))
    c.px(R(x), R(y), t > Math.PI * 0.4 && t < Math.PI * 1.3 ? "9" : "6")
  }
  c.rect(R(cx) - 1, R(cy) - 1, 2, 2, near ? "9" : "6"); c.px(R(cx), R(cy), "4")
}

/** Lantern in his chair, facing SW; b his breath (the head and shoulders a pixel down), lit the antenna lit bright, talk the mouth
 *  open, f the frame (the ocular's text, the lantern's flame) */
function lanternSW(c, { b = 0, talk = 0, f = 0 } = {}) {
  // the far wheel (his right), the backrest and the push handles behind him
  lnWheel(c, -0.05, 0.3, 0.3, 0.3, false)
  lnBox(c, -0.27, -0.22, 0.5, 0.04, 0.44, 0.45, "5", "3", "2")
  for (const s of [-0.22, 0.2]) lnBox(c, -0.3, s, 0.88, 0.06, 0.03, 0.1, "6", "1", "1")
  // the seat, the front casters on their forks, the footrest
  lnBox(c, -0.22, -0.22, 0.46, 0.46, 0.44, 0.05, "4", "3", "2")
  for (const s of [-0.2, 0.18]) { lnBox(c, 0.3, s, 0, 0.05, 0.03, 0.08, "6", "5", "4"); const [x, y] = LNP(0.32, s + 0.015, 0.02); c.px(R(x), R(y), "1") }
  lnBox(c, 0.38, -0.22, 0.06, 0.2, 0.44, 0.03, "9", "6", "5")
  // his legs, apart (the user, 2026-11-16: they ran together): the far one in shade, the near one lit, a dark seam between them;
  // the thighs on the seat, the shins down to the boots on the footrest
  lnBox(c, -0.05, 0.05, 0.5, 0.45, 0.15, 0.13, "d", "b", "B"); lnBox(c, 0.36, 0.05, 0.12, 0.1, 0.13, 0.4, "d", "b", "B")
  lnBox(c, 0.38, 0.04, 0.08, 0.17, 0.16, 0.06, "3", "B", "B")
  lnBox(c, -0.05, -0.21, 0.5, 0.45, 0.15, 0.13, "D", "D", "d"); lnBox(c, 0.36, -0.2, 0.12, 0.1, 0.13, 0.4, "D", "D", "d")
  lnBox(c, 0.38, -0.21, 0.08, 0.17, 0.16, 0.06, "K", "K", "B")
  { const [x0, y0] = LNP(0.46, -0.07, 0.14), [x1, y1] = LNP(0.46, -0.07, 0.62); c.line(R(x0), R(y0), R(x1), R(y1), "B") }   // the seam
  { const [x, y] = LNP(0.46, -0.16, 0.5); c.px(R(x), R(y), "9"); c.px(R(x) - 1, R(y), "D") }                  // the knee's light
  { const [x, y] = LNP(0.55, -0.14, 0.11); c.px(R(x), R(y), "6") }                                              // a boot's toe cap, worn to steel
  // the poncho: from the shoulders out over the arms and down over the lap; lit on its top and toward the upper left, in shade
  // toward his near side, folds falling from the shoulders, its hem a shade darker; the hood thrown back behind the neck
  const sh = 1.05 - b / 30
  const PON = [LNP(-0.15, 0.24, sh), LNP(0.08, 0.24, sh), LNP(-0.15, -0.24, sh), LNP(0.08, -0.24, sh),
    LNP(-0.2, 0.32, 0.58), LNP(0.24, 0.3, 0.55), LNP(-0.2, -0.32, 0.58), LNP(0.24, -0.3, 0.55)]
  const [nx, ny] = LNP(-0.03, 0, sh), [hx0, hy0] = LNP(0.24, -0.3, 0.55)
  const ponY1 = Math.max(...PON.map((p) => p[1]))
  lnHull(c, PON, (x, y) => {
    const side = (x - nx) * 0.9 - (y - ny) * 0.25                                                 // toward his near side, the lower right
    if (y >= ponY1 - 1.5 - (x - hx0) * -0.15) return "U"                                          // the hem
    if ((x - nx) + (y - ny) * 0.55 > 9.5 && (x + y) % 5 === 0) return "V"                         // a fold
    if ((x - nx) * 0.7 - (y - ny) > 4 && (x * 2 + y) % 7 === 0) return "U"
    if (side > 4.5) return "U"
    if (y - ny < 3 && side < 1) return "P"                                                        // the shoulders, lit
    return "u"
  })
  lnHull(c, [LNP(-0.2, 0.1, sh + 0.02), LNP(-0.2, -0.1, sh + 0.02), LNP(-0.26, 0.08, sh - 0.12), LNP(-0.26, -0.08, sh - 0.12)],
    (x, y) => ((x + y) % 4 === 0 ? "V" : "U"))
  // the patches, sewn on: each lit at its top left, a stitch along one edge
  for (const [pf, ps, ph, df, ds, dh, lit, dark] of [[0.1, -0.3, 0.62, 0.12, 0.12, 0.16, "m", "n"], [0.1, 0.12, 0.7, 0.12, 0.14, 0.16, "c", "C"],
    [0.15, -0.08, 0.58, 0.1, 0.12, 0.1, "o", "O"], [0.08, -0.18, 0.85, 0.08, 0.1, 0.1, "e", "E"]]) {
    const pts = []; for (const ff of [pf, pf + df]) for (const ss of [ps, ps + ds]) for (const hh of [ph, ph + dh]) pts.push(LNP(ff, ss, hh))
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), mx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (Math.min(...ys) + Math.max(...ys)) / 2
    lnHull(c, pts, (x, y) => (x + 0.5 < mx - 0.5 && y + 0.5 < my + 1 ? lit : y + 0.5 > my + 1.5 || x + 0.5 > mx + 1 ? dark : lit))
    const top = Math.round(Math.min(...ys)), left = Math.round(Math.min(...xs))
    for (let x = left + 1; x < Math.round(Math.max(...xs)); x += 2) if (c.is(x, top + 1, lit + dark)) c.px(x, top + 1, "x")
  }
  // his hands: the left on the near wheel's rim, the right on his knee (the knuckles lit)
  lnBox(c, 0.0, -0.3, 0.55, 0.07, 0.05, 0.06, "S", "s", "t"); lnBox(c, 0.3, 0.08, 0.6, 0.07, 0.07, 0.05, "S", "s", "t")
  // the neck, the head: the face toward the lower left in the base tone, his near side in shade, the scalp shaved (stubble)
  const hb = b / 30
  lnBox(c, -0.05, -0.05, 1.0 - hb, 0.08, 0.1, 0.1, "t", "s", "t")
  // (the block's two boxes as one outline; painted as a three-quarter face, as Juno's: the face over most of it, toward the lower left)
  const HEAD = []
  for (const [f0, f1, h0, h1] of [[-0.13, 0.11, 1.07, 1.35], [0.0, 0.11, 1.09, 1.33]])
    for (const ff of [f0, f1]) for (const ss of [-0.11, 0.11]) for (const hh of [h0, h1]) HEAD.push(LNP(ff, ss, hh - hb))
  const hT = Math.min(...HEAD.map((p) => p[1])), hy1 = Math.max(...HEAD.map((p) => p[1])), [hxE] = LNP(-0.02, -0.12, 1.2 - hb)
  lnHull(c, HEAD, (x, y) => {
    if (y < hT + 2.5) return "z"                                                                   // the shaved scalp
    if (x >= R(hxE)) return "t"                                                                    // behind the ear, in shade
    if (y > hy1 - 2.5) return x < R(hxE) - 3 ? "t" : "T"                                           // under the jaw
    if (x < R(hxE) - 4 && y < hT + 5.5) return "S"                                                // the brow, lit
    return "s"
  })
  // the crest from his brow back to the nape: spikes along its top, lit toward the upper left, its near flank in shade
  const CR = [LNP(-0.15, -0.03, 1.33 - hb), LNP(0.11, -0.03, 1.33 - hb), LNP(-0.15, 0.03, 1.33 - hb), LNP(0.11, 0.03, 1.33 - hb),
    LNP(-0.15, -0.03, 1.49 - hb), LNP(0.11, -0.03, 1.49 - hb), LNP(-0.15, 0.03, 1.49 - hb), LNP(0.11, 0.03, 1.49 - hb)]
  const [qx, qy] = LNP(-0.02, 0, 1.41 - hb)
  lnHull(c, CR, (x, y) => (x + 0.5 > qx + 1.5 ? "H" : y + 0.5 < qy - 1 ? "g" : "G"))
  for (const [sf, sh2, k] of [[0.1, 1.53, "w"], [0.02, 1.56, "g"], [-0.06, 1.55, "g"], [-0.13, 1.51, "G"]]) {
    const [x, y] = LNP(sf, 0, sh2 - hb), [x2, y2] = LNP(sf, 0, 1.47 - hb)
    c.line(R(x), R(y), R(x2), R(y2), k); c.px(R(x) + 1, R(y) + 1, k === "w" ? "g" : "G")
  }
  // the face: the ocular over his right eye (the far one, to the screen's left): a steel ring, the green lens, its text running, a
  // crack; the left eye narrowed, the stud in its brow; the grin with the steel tooth (open when he talks)
  // (the user, 2026-11-16: the face didn't read. The face is some six pixels across, so its parts are set by hand round one point, the
  // bridge of his nose, and not projected: the ocular sticking out on the far side, a pixel of bridge, the eye with its white, the
  // nose, the mouth dark with the steel tooth, the lip under it lit)
  const [ax0, ay0] = LNP(0.11, 0, 1.22 - hb), ax = R(ax0), ay = R(ay0)
  const OX = ax - 4, OY = ay - 2
  c.rect(OX, OY, 4, 4, "4"); c.px(OX, OY, "k"); c.px(OX + 3, OY + 3, "k"); c.px(OX + 1, OY, "6"); c.px(OX, OY + 1, "6")
  c.rect(OX + 1, OY + 1, 2, 2, "L"); c.px(OX + 1 + (f % 2), OY + 1 + (fl2(f / 2) % 2), "l")
  c.px(OX + 2, OY + 2, f % 4 === 3 ? "y" : "L")
  c.line(OX + 3, OY, OX + 2, OY + 1, "k")                                                                    // the crack across it
  c.px(ax + 1, ay, "W"); c.px(ax + 2, ay, "k"); c.hline(ax + 1, ay - 1, 2, "T"); c.px(ax + 2, ay - 2, "9")   // the narrowed eye, its brow, the stud
  c.px(ax, ay, "S"); c.px(ax, ay + 1, "S"); c.px(ax + 1, ay + 1, "t")                                        // the nose, lit, its shadow
  if (talk) { c.rect(ax - 1, ay + 3, 3, 2, "k"); c.px(ax, ay + 3, "9"); c.hline(ax - 1, ay + 5, 3, "S") }
  else { c.hline(ax - 1, ay + 3, 3, "k"); c.px(ax + 2, ay + 2, "k"); c.px(ax, ay + 3, "9"); c.hline(ax - 1, ay + 4, 3, "S") }   // the crooked grin
  // the headset on his left ear (the near one): the cup, its light, the band over his crest; the circuit line at the temple
  const [hx, hy] = LNP(-0.02, -0.12, 1.2 - hb)
  c.rect(R(hx) - 1, R(hy) - 2, 3, 4, "2"); c.px(R(hx) - 1, R(hy) - 2, "5"); c.px(R(hx), R(hy), f % 4 === 0 ? "m" : "M")
  c.px(R(hx) - 1, R(hy) - 3, "C"); c.px(R(hx) - 1, R(hy) - 4, "C")                                            // the circuit line (dark: lit, it read as a second eye)
  // the lantern on its cable at his chest, its flame flickering
  const [lx, ly] = LNP(0.12, 0, 0.92 - hb)
  c.vline(R(lx), R(ly) - 4, 3, "k"); c.rect(R(lx) - 1, R(ly) - 1, 3, 3, "E"); c.px(R(lx), R(ly) - 1, "4")
  c.px(R(lx), R(ly), f % 3 === 1 ? "g" : "y"); c.px(R(lx), R(ly) + 1, "e")
  // the near wheel (his left), over his side, and his hand on its push rim
  lnWheel(c, -0.05, -0.3, 0.3, 0.3, true)
  lnBox(c, 0.0, -0.31, 0.5, 0.07, 0.04, 0.07, "S", "s", "t")
}
const fl2 = Math.floor
/** the antennas from the headset, behind his head, leaning back over his near shoulder: thin steel, their lights at the tips (no
 *  outline: 1 px stays 1 px; drawn first, so his head and crest stand in front of their feet) */
function lanternAntennas(c, { b = 0, lit = 0 } = {}) {
  const [hx, hy] = LNP(-0.02, -0.12, 1.2 - b / 30)
  for (const [i, dx, len, tip] of [[0, 1, 15, "v"], [1, 3, 18, "M"], [2, 5, 13, "g"]]) {
    const x0 = R(hx) + i - 1, y0 = R(hy) - 2
    c.line(x0, y0, x0 + dx, y0 - len, "5"); c.px(x0 + dx, y0 - len + 1, "4"); c.px(x0 + dx, y0 - len, lit === i ? "w" : tip)
  }
}

// his breath: up for four frames, down a pixel for four; the antennas' lights one after another
const BREATH = [0, 0, 0, 0, 1, 1, 1, 1]
anim("lantern_sit_sw", { w: LNW, h: LNH, frames: 8, ms: Array(8).fill(250), outline: "k", pivot: "bottom" },
  layer("antennas", { outline: false }, (c) => lanternAntennas(c, { b: BREATH[c.frame], lit: c.frame % 3 })),
  (c) => lanternSW(c, { b: BREATH[c.frame], f: c.frame }))
anim("lantern_talk_sw", { w: LNW, h: LNH, frames: 2, ms: [200, 200], outline: "k", pivot: "bottom" },
  layer("antennas", { outline: false }, (c) => lanternAntennas(c, { lit: c.frame })),
  (c) => lanternSW(c, { talk: c.frame, f: c.frame * 2 }))
