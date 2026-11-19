// Chapter 2: Lantern in CAM 23 at the laundromat's size (kapitel2-design §10: "Lantern im Feed ... im Maßstab des Waschsalons"), as blocks for
// approval before he is painted. CAM 23 is the laundromat's own picture under the feed's filter (one place, one picture), so he comes at the
// street's size, from his approved block (art/test/lantern_blocks.px.js, lantern_blocks_sw: the same boxes in meters, the same wheels),
// turned: the projection takes his heading, so the three new views are the one figure. He comes only when nobody is inside (the user's
// choice, 2026-11-19): Juno sees him only through the camera. In at the door, across to dryer 6, a hand into it, back out.
//   SE  driving in, toward the lower right: his front, his RIGHT side near (the ocular on the near eye, the antennas behind his head)
//   NE  at dryer 6, his back to us, his right arm reaching forward into the drum
//   NW  driving out, toward the upper left: his back, his LEFT side near (the headset and its antennas on the near ear)
// Drawn, never mirrored (the ocular on his right eye, the antennas on his left ear). The wheels turn when he drives (painted later).
//   lsb_<view>        the block of each, pivot bottom-centre
//   lantern_salon_blocks   the sheet: the approved SW block beside the three, and their silhouettes
"use strict"
const PAL = {
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  S: "#b07050", s: "#7a4a32", g: "#b0f0a0", u: "#5a4a8a", U: "#433468", m: "#d84aa8", c: "#3a9ab8", o: "#d87a34", G: "#5aa860",
  D: "#454c60", d: "#363c4e", B: "#1c1f28", L: "#3ac070", l: "#d8ffd0", v: "#62def0", M: "#ff4fd3",
}
pal(PAL)
include("../lib/text.js")

const LW = 40, LH = 62, CX = 19, GY = 58
// his heading: forward and to his right, each a screen vector per meter (2:1); 30 px a meter up
const HEAD = {
  sw: { F: [-16, 8], S: [-16, -8] }, se: { F: [16, 8], S: [-16, 8] }, ne: { F: [16, -8], S: [16, 8] }, nw: { F: [-16, -8], S: [16, -8] },
}
let H0 = HEAD.sw
const LP = (f, s, h) => [CX + H0.F[0] * f + H0.S[0] * s, GY + H0.F[1] * f + H0.S[1] * s - 30 * h]

function hull(c, pts, k) {
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
    if (inside) c.px(x, y, k)
  }
}
const lbox = (c, f0, s0, h0, df, ds, dh, k) => {
  const pts = []
  for (const f of [f0, f0 + df]) for (const s of [s0, s0 + ds]) for (const h of [h0, h0 + dh]) pts.push(LP(f, s, h))
  hull(c, pts, k)
}
function wheel(c, f, s, h, r, tyre, rim, hub) {
  const ring = (rr) => { const pts = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(LP(f + rr * Math.cos(t), s, h + rr * Math.sin(t))) } return pts }
  hull(c, ring(r), tyre); hull(c, ring(r - 0.05), rim); hull(c, ring(r - 0.08), "2")
  const [hx, hy] = LP(f, s, h); c.rect(Math.round(hx) - 1, Math.round(hy) - 1, 2, 2, hub)
}

/** Lantern in his chair in a view: what is far is drawn first. front: we see his face (SW, SE); rightNear: his right side is near */
function lantern(c, view, o = {}) {
  H0 = HEAD[view]
  const front = view === "sw" || view === "se", rightNear = view === "se" || view === "ne"
  const farS = rightNear ? -0.3 : 0.3, nearS = -farS
  const chairBack = () => { lbox(c, -0.27, -0.22, 0.5, 0.04, 0.44, 0.45, "3"); for (const s of [-0.22, 0.2]) lbox(c, -0.3, s, 0.88, 0.06, 0.03, 0.1, "4") }
  const chairFront = () => { for (const s of [-0.2, 0.18]) lbox(c, 0.3, s, 0, 0.05, 0.03, 0.08, "5"); lbox(c, 0.38, -0.16, 0.06, 0.2, 0.32, 0.03, "5") }
  const legs = () => {
    const [a, b] = rightNear ? [[-0.17, "d"], [0.03, "D"]] : [[0.03, "d"], [-0.17, "D"]]
    for (const [s, k] of [a, b]) { lbox(c, -0.05, s, 0.5, 0.45, 0.14, 0.13, k); lbox(c, 0.36, s, 0.12, 0.1, 0.12, 0.4, k); lbox(c, 0.38, s - 0.01, 0.08, 0.17, 0.15, 0.06, "B") }
  }
  const body = () => {
    const sh = 1.05
    hull(c, [LP(-0.15, 0.24, sh), LP(0.08, 0.24, sh), LP(-0.15, -0.24, sh), LP(0.08, -0.24, sh),
      LP(-0.2, 0.32, 0.58), LP(0.24, 0.3, 0.55), LP(-0.2, -0.32, 0.58), LP(0.24, -0.3, 0.55)], "u")
    if (front) {
      for (const [f, s, h, df, ds, dh, k] of [[0.1, -0.3, 0.62, 0.12, 0.12, 0.16, "m"], [0.1, 0.12, 0.7, 0.12, 0.14, 0.16, "c"], [0.15, -0.08, 0.58, 0.1, 0.12, 0.1, "o"], [0.08, -0.18, 0.85, 0.08, 0.1, 0.1, "G"]])
        lbox(c, f, s, h, df, ds, dh, k)
    } else {
      // from behind: the hood thrown back over his shoulders, a patch on the back
      hull(c, [LP(-0.2, 0.12, 1.07), LP(-0.2, -0.12, 1.07), LP(-0.26, 0.1, 0.9), LP(-0.26, -0.1, 0.9)], "U")
      lbox(c, -0.24, 0.02, 0.62, 0.04, 0.14, 0.16, "c")
    }
  }
  const head = () => {
    lbox(c, -0.05, -0.05, 1.0, 0.08, 0.1, 0.1, "s")
    lbox(c, -0.13, -0.11, 1.07, 0.24, 0.22, 0.28, front ? "s" : "s")
    if (front) lbox(c, 0.0, -0.11, 1.09, 0.11, 0.22, 0.24, "S")
    lbox(c, -0.15, -0.03, 1.33, 0.26, 0.06, 0.16, "g")
    if (front) {
      // the ocular over his RIGHT eye, the left eye, the grin
      const [ox, oy] = LP(0.11, 0.06, 1.24), [ex, ey] = LP(0.11, -0.05, 1.24), [mx, my] = LP(0.11, -0.01, 1.14)
      c.rect(Math.round(ox) - 2, Math.round(oy) - 2, 4, 4, "k"); c.rect(Math.round(ox) - 1, Math.round(oy) - 1, 2, 2, "L"); c.px(Math.round(ox) - 1, Math.round(oy) - 1, "l")
      c.px(Math.round(ex), Math.round(ey), "k"); c.hline(Math.round(mx) - 1, Math.round(my), 3, "k")
      const [lx, ly] = LP(0.12, 0, 0.92)
      c.vline(Math.round(lx), Math.round(ly) - 3, 2, "k"); c.rect(Math.round(lx) - 1, Math.round(ly) - 1, 3, 3, "G"); c.px(Math.round(lx), Math.round(ly), "g")
    }
    // the headset on his LEFT ear
    const [hx, hy] = LP(-0.02, -0.12, 1.2)
    if (!rightNear) { c.rect(Math.round(hx) - 1, Math.round(hy) - 2, 3, 4, "2"); c.px(Math.round(hx), Math.round(hy), "M") }
  }
  const hands = () => {
    // the near hand on its wheel's push rim; the other on his knee, or (reach) the right arm out forward into the drum
    lbox(c, 0.0, nearS - (nearS < 0 ? 0.01 : -0.01), 0.5, 0.07, 0.04, 0.07, "S")
    if (o.reach) { lbox(c, 0.0, 0.16, 0.85, 0.5, 0.1, 0.1, "u"); lbox(c, 0.5, 0.16, 0.86, 0.1, 0.08, 0.07, "S") }
    else if (front) lbox(c, 0.3, 0.08, 0.6, 0.07, 0.07, 0.05, "s")
  }
  wheel(c, -0.05, farS, 0.3, 0.3, "1", "4", "5")
  if (front) { chairBack(); lbox(c, -0.22, -0.22, 0.46, 0.46, 0.44, 0.05, "4"); chairFront(); legs(); body(); hands(); head() }
  else { chairFront(); legs(); lbox(c, -0.22, -0.22, 0.46, 0.46, 0.44, 0.05, "4"); body(); head(); if (o.reach) hands(); chairBack(); if (!o.reach) hands() }
  wheel(c, -0.05, nearS, 0.3, 0.3, "1", "5", "6")
}
/** the antennas over the headset on his left ear */
function antennas(c, view) {
  H0 = HEAD[view]
  const [hx, hy] = LP(-0.02, -0.12, 1.2), lean = view === "sw" || view === "nw" ? 1 : -1
  for (const [i, dx, len, tip] of [[0, -2, 12, "v"], [1, 0, 16, "M"], [2, 2, 11, "g"]]) {
    const x0 = Math.round(hx) + (i - 1), y0 = Math.round(hy) - 3
    c.line(x0, y0, x0 + dx * lean, y0 - len, "5"); c.px(x0 + dx * lean, y0 - len, tip)
  }
}
for (const [name, view, o] of [["lsb_sw", "sw", {}], ["lsb_se", "se", {}], ["lsb_ne", "ne", { reach: true }], ["lsb_nw", "nw", {}]])
  sprite(name, { w: LW, h: LH, outline: "k", pivot: "bottom" }, ...(view === "ne" || view === "nw"
    ? [(c) => lantern(c, view, o), layer("antennas", { outline: false }, (c) => antennas(c, view))]
    : [layer("antennas", { outline: false }, (c) => antennas(c, view)), (c) => lantern(c, view, o)]))

const W = 220, Hh = 100
scene("lantern_salon_blocks", { w: W, h: Hh, bg: "3" }, (c) => {
  const FY = 78
  c.rect(0, FY, W, Hh - FY, "2")
  for (const [x, t] of [[30, "SW (FREIGEGEBEN)"], [80, "SE: HIN"], [130, "NE: AM TROCKNER"], [180, "NW: ZURÜCK"]]) TXT.draw(c, x, 4, t, "6", { font: "hud", align: "center" })
})
scene("lantern_salon_sheet", { w: W, h: Hh, bg: "3" }, stamp("lantern_salon_blocks", 0, 0), stamp("lsb_sw", 30, 80), stamp("lsb_se", 80, 80), stamp("lsb_ne", 130, 80), stamp("lsb_nw", 180, 80))

// in the laundromat (its baked picture, art/rooms/laundromat.px.js) where the scene puts him: driving in from the door, at dryer 6, out
include("../rooms/laundromat.px.js")
scene("lantern_salon_im_raum", { w: 320, h: 180, bg: "k" }, stamp("laundromat_bg", 0, 0), stamp("lsb_se", 110, 151), stamp("lsb_ne", 211, 153), stamp("lsb_nw", 70, 149))
