// Blocks for the ledge outside Juno's window (`sims`, kapitel1-design "Der Weg aufs Dach"): flat colour blocks in the world
// palette, so only the framing is judged: where Juno walks, how the window, the ladder hanging two metres too high and the drop
// read, and how much of Kowalski Street far below shows (the 14th floor is to face it, the decision of 2026-11-12 in the plan).
// Three framings to choose from:
//   A  the stage: the facade seen straight on (style guide §4 names a ledge as a side view), the ledge across the picture,
//      the building's corner at the right with the city beyond it; Juno walks left and right (she would need side views)
//   B  along the wall and down: a camera hanging in the rain beyond the window's end, looking along the ledge to the ladder
//      and down past it into Kowalski Street, 42 m below; Juno smaller the further she goes (depth scaling)
//   C  iso, as the flat and the corridor: the ledge a narrow strip along the right-hand wall, the air in front of it, Juno's
//      own iso views; the drop only as haze and the glow from below (the street itself could be a close-up, as look_shaft)
// The real measures in all three: Juno 1.68 m, the window 1.3 m wide from 0.9 to 2.4 m over the ledge, the ledge 0.6 m deep,
// the ladder's lowest rung 4.1 m up (her hands reach 2.1 m), 30 px a metre of height where the scale is street mode's.
// Decided 2026-11-12: A with the middle A2 (the neon letters), painted in art/rooms/sims.px.js. Not built into the game; Juno is her built idle frame (build/art/characters/anims, `sh tools/build_art.sh characters`).
//   PXL build art/mockups/sims_blocks.px.js --out build/art/sims_blocks --no-preview --share 3
include("../lib/feed.js")
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  r: "#7e1420", q: "#ff3a3a", j: "#9a7406", y: "#eec414", Y: "#fff070",
  a: "#2c2026", A: "#4a3026", i: "#2a1636", I: "#46204e", t: "#11303d", T: "#1b495a",
})
include("../lib/text.js")
const W = 320, H = 180
sprite("_juno", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50], pivot: "bottom" })
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], bay = (x, y) => (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16
const label = (s) => (c) => { const w = TXT.measure(s, "hud"); c.rect(W - 8 - w, H - 11, w + 6, 9, "k"); TXT.draw(c, W - 5, H - 9, s, "V", { font: "hud", align: "right" }) }
const note = (c, x, y, s) => TXT.draw(c, x, y, s, "6", { font: "hud", outline: "k" })
// a dithered spill of light (style guide: dithering only for light falloff)
const halo = (c, cx, cy, rx, ry, key, pass = () => true) => {
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry)
    if (d < 1 && bay(x, y) > d && pass(x, y)) c.px(x, y, key)
  }
}
const rain = (c, n, seed, y1 = H) => { for (let i = 0; i < n; i++) { const x = Math.floor(ih(i, seed) * W), y = Math.floor(ih(i, seed + 1) * y1); for (let s = 0; s < 4; s++) if (y + s < y1) c.px(x + (s >> 1), y + s, "5") } }

// ================================================================ A: the stage, the facade straight on
// the ledge's top at y 150; 30 px a metre both ways. The user chose A (2026-11-12) and took out the second window (the flat has
// only the one): what stands between the window and the ladder instead is drawn three ways (MIDDLE below)
const sceneA = (name, mid, tag) => scene(name, { w: W, h: H, bg: "1" }, (c) => {
  const L = 150, CORNER = 292
  // beyond the corner: the city, the next towers, the Ring's underside closing the top
  c.rect(CORNER, 0, W - CORNER, H, "1"); c.rect(CORNER, 0, W - CORNER, 14, "k")
  c.rect(300, 40, 12, 140, "2"); for (let y = 50; y < 170; y += 9) c.px(304, y, "Q")
  c.rect(312, 70, 8, 110, "3"); c.rect(296, 150, 24, 30, "i"); halo(c, 306, 176, 24, 18, "M")
  // the facade, its slab lines (a storey is 3 m, 90 px), the magenta of the sign across the street (behind us) on it
  c.rect(0, 0, CORNER, L, "3"); c.hline(0, L - 92, CORNER, "4"); c.hline(0, L - 91, CORNER, "2")
  halo(c, 130, 70, 120, 80, "I", (x) => x < CORNER)
  c.rect(CORNER - 2, 0, 2, L, "4")
  // Juno's window, open: the flat inside (the deck's cyan, the amber lamp)
  c.rect(38, 76, 43, 49, "5"); c.rect(40, 78, 39, 45, "c"); c.rect(40, 78, 39, 20, "2"); c.rect(66, 100, 8, 14, "Q"); c.rect(44, 104, 14, 10, "C")
  c.rect(38, 123, 43, 3, "6")
  // cables along the wall, sagging between their clips
  for (let x = 0; x < CORNER; x++) c.px(x, 64 + Math.round(4 * Math.sin((x % 70) / 70 * Math.PI)), "1")
  mid.back?.(c, L)
  // the ladder: its fixed part off the top, its drop section folded up; lowest rung 4.1 m over the ledge
  const LAD = 258, LOW = L - 123
  c.rect(LAD, 0, 2, LOW + 1, "6"); c.rect(LAD + 16, 0, 2, LOW + 1, "6"); for (let y = LOW; y > 0; y -= 9) c.hline(LAD, y, 18, "6")
  c.rect(LAD - 2, LOW - 2, 22, 3, "5")
  // where her hands reach (2.1 m), so the gap reads: two metres of nothing
  for (let y = LOW + 4; y < L - 63; y += 3) c.px(LAD + 9, y, "4")
  // the ledge: its wet top (seen a little from above), its face, the drip line under it
  c.rect(0, L - 4, CORNER, 4, "X"); c.hline(0, L - 4, CORNER, "6"); c.rect(0, L, CORNER, 7, "4"); c.hline(0, L + 7, CORNER, "k")
  for (const [x, w] of [[96, 14], [228, 10]]) c.rect(x, L - 3, w, 2, "I")
  // the drop: the 13th floor's window heads, then air and the street's glow coming up
  c.rect(0, L + 8, CORNER, H - L - 8, "2"); c.rect(38, L + 24, 43, 6, "1")
  halo(c, 150, H + 6, 200, 22, "i")
  mid.front?.(c, L)
  rain(c, 70, 3)
  c.stamp("_juno", 62, L)
  note(c, 30, 130, "FENSTER"); note(c, 240, 30, "LEITER 4,1 M"); note(c, 240, 160, "TIEFE")
}, label(tag))
// the AC box, dripping on the ledge (it stays in all three)
const AC = (c, L) => { c.rect(204, 112, 26, 18, "5"); c.rect(204, 112, 26, 2, "6"); for (const y of [134, 140, 146]) c.px(216, y, "6") }
const MIDDLE = {
  // 1: a big ad board on standoffs, its lower edge 2 m up so Juno passes under it; lamps on arms light it from below and
  //    throw a pool on the ledge; it sells sleep (Lull), as the city's ads do
  tafel: { back: (c, L) => {
    const x0 = 100, x1 = 236, y0 = 14, y1 = L - 62
    c.rect(x0 - 3, y0 - 3, x1 - x0 + 6, y1 - y0 + 6, "k"); c.rect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4, "4")
    c.rect(x0, y0, x1 - x0, y1 - y0, "T"); c.rect(x0, y0, x1 - x0, 20, "t")
    c.rect(x0 + 10, y0 + 30, 40, 30, "V"); c.rect(x0 + 60, y0 + 34, 64, 8, "v"); c.rect(x0 + 60, y0 + 48, 50, 5, "C")
    for (const sx of [x0 + 20, x1 - 20]) c.rect(sx, y1 + 2, 2, L - 4 - y1 - 2, "2")        // the standoffs down to the ledge
    for (const lx of [x0 + 30, x0 + 68, x0 + 106]) { c.rect(lx, y1 + 2, 1, 6, "6"); c.rect(lx - 3, y1 + 8, 7, 2, "W") }
    halo(c, 168, L - 3, 70, 26, "t", (x, y) => y > y1 + 8 && y < L - 4)
    AC(c, L)
  }, front: (c, L) => { c.rect(112, L - 3, 112, 2, "T"); note(c, 112, 6, "REKLAMETAFEL 4,5 X 2,3 M") } },
  // 2: the block's name in big neon letters on a steel frame, over Juno's head; two letters dead, the transformer humming
  schrift: { back: (c, L) => {
    const y0 = 30, y1 = L - 66
    c.rect(98, y1, 142, 2, "2"); for (const fx of [104, 170, 234]) c.rect(fx, y0 - 6, 2, L - 4 - y0 + 6, "2")
    const LET = "KESSEL"
    for (let i = 0; i < LET.length; i++) {
      const x = 104 + i * 23, dead = i === 1 || i === 4
      c.rect(x, y0, 19, y1 - y0, "k"); c.rect(x + 1, y0 + 1, 17, y1 - y0 - 2, dead ? "n" : "m")
      if (!dead) c.rect(x + 4, y0 + 4, 11, y1 - y0 - 8, "N")
    }
    halo(c, 170, 50, 90, 50, "M", (x, y) => y < y0 || y > y1)
    c.rect(184, 100, 14, 16, "5"); c.rect(186, 102, 3, 2, "q")                                // the transformer, its lamp
    AC(c, L)
  }, front: (c, L) => { c.rect(120, L - 3, 100, 2, "i"); note(c, 112, 6, "NEON KESSEL, 2 BUCHSTABEN TOT") } },
  // 3: the city's eye and what fell: a Nagi·wa camera on its arm, looking down at the street (its red lamp), and a dead
  //    delivery drone caught in the sagging cables, its light still blinking; the parcel never came
  auge: { back: (c, L) => {
    c.rect(118, 52, 30, 3, "5"); c.rect(146, 46, 22, 14, "6"); c.rect(166, 50, 6, 6, "k"); c.px(150, 48, "q")
    c.rect(118, 48, 4, 12, "4")
    c.rect(196, 60, 30, 8, "4"); c.rect(190, 58, 10, 3, "5"); c.rect(222, 58, 10, 3, "5"); c.rect(204, 68, 14, 10, "O"); c.px(210, 63, "v")
    AC(c, L)
  }, front: (c, L) => note(c, 112, 6, "KAMERA + TOTE LIEFERDROHNE") },
}
sceneA("sims_blocks_a", MIDDLE.tafel, "A1  TAFEL")
sceneA("sims_blocks_a2", MIDDLE.schrift, "A2  LEUCHTSCHRIFT")
sceneA("sims_blocks_a3", MIDDLE.auge, "A3  KAMERA, DROHNE")

// ================================================================ B: the look down, a close-up (as look_shaft, 128x104)
// A third framing along the wall and down was tried and dropped: the ledge shrank to a sliver and the ladder left the picture.
// What it was for, the drop, reads better as a close-up for "Die Straße", with A or C: Juno looks down past her boots.
// x along the facade (right), y up (0: the ledge's top), z out from the facade toward the street
const B = ((cam) => {
  const STREET = -42, ACROSS = 13, LEDGE = [-1.2, 9.5], DEEP = 0.6, LAD = 7.6
  // the hits: planes and boxes, each returning a palette key for the point it hit
  const facade = (P) => {
    const { 0: x, 1: y } = P
    if (x > 9.6) return null                                                          // the corner: past it, the city
    const fl = Math.floor((y + 0.0001) / 3), fy = y - fl * 3                          // storey, height in it
    if (fy < 0.12) return "2"                                                          // the slab line
    const wx = ((x + 30) % 4.5)
    if (fl === 0 && x > 0.2 && x < 1.5 && fy > 0.9 && fy < 2.4) return fy > 1.6 ? "2" : x > 0.9 ? "Q" : "C"   // Juno's window
    if (wx > 1.6 && wx < 2.9 && fy > 0.9 && fy < 2.4) return fl < 0 && ih(Math.floor((x + 30) / 4.5), fl) > 0.6 ? "P" : "1"
    if (x > LAD - 0.05 && x < LAD + 0.55 && y > 4.1 && (Math.abs(x - LAD) < 0.06 || Math.abs(x - LAD - 0.5) < 0.06 || ((y - 4.1) % 0.3) < 0.06)) return "6"
    if (y < 0) return (Math.floor(-y) % 3 === 0 && (-y % 1) < 0.15) ? "2" : "3"      // the floors below, a hint of their slabs
    return "3"
  }
  const across = (P) => {
    const { 0: x, 1: y } = P
    if (y < STREET + 3.2 && x > -2 && x < 3.5) return y > STREET + 2.5 ? "m" : "R"   // a shop's lit front far down
    if (y > STREET + 6 && y < STREET + 13 && x > 5 && x < 6.2) return "m"            // a vertical sign
    const wx = (x + 30) % 3.8, fy = (y + 60) % 3
    if (wx > 1.2 && wx < 2.6 && fy > 1 && fy < 2.3) return ih(Math.floor((x + 30) / 3.8), Math.floor((y + 60) / 3)) > 0.55 ? "Q" : "1"
    return "2"
  }
  const street = (P) => {
    const z = P[2]
    if (z < 2.5 || z > ACROSS - 2.5) return "X"                                        // the pavements
    if (Math.abs(z - ACROSS / 2) < 0.08 && (P[0] % 3) < 1.6) return "6"                // the middle line
    return ((P[0] + 40) % 9) < 3 ? "I" : "z"                                           // wet asphalt, the neon on it in pools
  }
  const plane = (o, d, axis, val) => { const t = (val - o[axis]) / d[axis]; return t > 0 ? t : Infinity }
  const box = (o, d, a, b) => {
    let t0 = 0, t1 = Infinity
    for (let i = 0; i < 3; i++) {
      if (Math.abs(d[i]) < 1e-9) { if (o[i] < a[i] || o[i] > b[i]) return Infinity; continue }
      let u = (a[i] - o[i]) / d[i], w = (b[i] - o[i]) / d[i]; if (u > w) [u, w] = [w, u]
      t0 = Math.max(t0, u); t1 = Math.min(t1, w); if (t0 > t1) return Infinity
    }
    return t0
  }
  const hit = (d) => {
    const o = cam.pos, cands = []
    const tf = plane(o, d, 2, 0); if (tf < Infinity) { const P = add(o, mul(d, tf)); if (P[0] < 9.6 && P[1] < 7) cands.push([tf, facade(P)]) }
    const ta = plane(o, d, 2, ACROSS); if (ta < Infinity) { const P = add(o, mul(d, ta)); if (P[1] > STREET && P[1] < 14) cands.push([ta, across(P)]) }
    const ts = plane(o, d, 1, STREET); if (ts < Infinity) { const P = add(o, mul(d, ts)); if (P[2] > 0 && P[2] < ACROSS) cands.push([ts, street(P)]) }
    const tl = box(o, d, [LEDGE[0], -0.22, 0], [LEDGE[1], 0, DEEP]); if (tl < Infinity) { const P = add(o, mul(d, tl)); cands.push([tl, P[1] > -0.02 ? (P[0] > 3 && P[0] < 3.8 ? "I" : "X") : "4"]) }
    const ac = box(o, d, [5.2, 0.9, 0], [6.0, 1.5, 0.45]); if (ac < Infinity) cands.push([ac, "5"])
    if (!cands.length) return null
    cands.sort((p, q) => p[0] - q[0]); return cands[0]
  }
  return { cam, hit }
})(makeCam({ pos: [2.0, 1.5, 0.95], yaw: 0, pitch: 89.5, F: 70, w: 128, h: 104, k: 0.12 }))
scene("sims_blocks_b", { w: 128, h: 104, bg: "1" }, (c) => {
  for (let y = 0; y < 104; y++) for (let x = 0; x < 128; x++) {
    const d = rayDir(B.cam, x, y), h = B.hit(d)
    if (!h) { c.px(x, y, "1"); continue }
    // haze with distance: far things sink into the night, the lit ones stay
    const [t, key] = h
    c.px(x, y, t > 20 && bay(x, y) < Math.min(0.6, (t - 20) / 40) ? (key === "m" || key === "R" || key === "Q" ? key : "2") : key)
  }
  // her boots at the ledge's edge
  for (const bx of [44, 72]) { c.rect(bx, 92, 12, 12, "k"); c.rect(bx + 1, 93, 10, 10, "2"); c.rect(bx + 1, 93, 10, 2, "4") }
  for (let i = 0; i < 40; i++) { const x = Math.floor(ih(i, 21) * 128), y = Math.floor(ih(i, 22) * 90); c.px(x, y, "5"); c.px(x, y + 1, "5") }
  TXT.draw(c, 125, 96, "B", "V", { font: "hud", align: "right", outline: "k" })
})

// ================================================================ C: iso, the ledge along the right-hand wall
// P(u, v, h): u along the facade, v out from it toward us, h up; 16 units a metre on the floor, 30 px a metre up
scene("sims_blocks_c", { w: W, h: H, bg: "1" }, (c) => {
  const CX = 64, CY = 58, P = (u, v, h) => [CX + 2 * u - 2 * v, CY + u + v - h]
  const quad = (pts, key) => c.poly(pts.flat(), key)
  const LEN = 112, DEEP = 10
  // the air in front: the street's glow from far below, a sign further down the facade, a drone passing
  halo(c, 60, 200, 170, 80, "i"); halo(c, 40, 190, 90, 50, "M")
  c.rect(14, 120, 8, 40, "M"); c.rect(16, 124, 4, 32, "m")
  // the facade above the ledge, and its floors below it, straight down
  quad([P(0, 0, 200), P(LEN + 40, 0, 200), P(LEN + 40, 0, -200), P(0, 0, -200)], "3")
  for (const h of [-90, -180]) quad([P(0, 0, h), P(LEN + 40, 0, h), P(LEN + 40, 0, h - 4), P(0, 0, h - 4)], "2")
  quad([P(0, 0, 90), P(LEN + 40, 0, 90), P(LEN + 40, 0, 86), P(0, 0, 86)], "2")
  // the magenta from across the street on it
  halo(c, 150, 70, 110, 70, "I", (x, y) => y < CY + (x - CX) / 2 + 2)
  // Juno's window (u 12 to 33, 0.9 to 2.4 m)
  quad([P(12, 0, 72), P(33, 0, 72), P(33, 0, 27), P(12, 0, 27)], "5"); quad([P(13, 0, 70), P(32, 0, 70), P(32, 0, 29), P(13, 0, 29)], "c")
  quad([P(22, 0, 52), P(28, 0, 52), P(28, 0, 40), P(22, 0, 40)], "Q")
  // the neighbour's window and the AC box under it
  quad([P(56, 0, 72), P(77, 0, 72), P(77, 0, 27), P(56, 0, 27)], "4"); quad([P(57, 0, 70), P(76, 0, 70), P(76, 0, 29), P(57, 0, 29)], "2")
  quad([P(80, 0, 30), P(92, 0, 30), P(92, 7, 30), P(80, 7, 30)], "6"); quad([P(80, 7, 30), P(92, 7, 30), P(92, 7, 12), P(80, 7, 12)], "5")
  // the ladder: lowest rung 4.1 m up
  for (const u of [98, 106]) quad([P(u, 1, 300), P(u + 1, 1, 300), P(u + 1, 1, 123), P(u, 1, 123)], "6")
  for (let h = 123; h < 300; h += 9) quad([P(98, 1, h), P(107, 1, h), P(107, 1, h - 1), P(98, 1, h - 1)], "6")
  // the ledge: its top, its front face, a pool where the AC drips
  quad([P(0, 0, 0), P(LEN, 0, 0), P(LEN, DEEP, 0), P(0, DEEP, 0)], "X")
  quad([P(0, DEEP, 0), P(LEN, DEEP, 0), P(LEN, DEEP, -7), P(0, DEEP, -7)], "4")
  quad([P(LEN, 0, 0), P(LEN, DEEP, 0), P(LEN, DEEP, -7), P(LEN, 0, -7)], "5")
  quad([P(82, 2, 0), P(90, 2, 0), P(90, 7, 0), P(82, 7, 0)], "I")
  rain(c, 80, 11)
  const [jx, jy] = P(22, 6, 0); c.stamp("_juno", jx, jy)
  const [lx, ly] = P(104, 1, 123); note(c, lx + 4, ly + 2, "LEITER 4,1 M")
  note(c, 8, 164, "TIEFE: DUNST, GLUT")
}, label("C  ISO"))
