// Block sketches for transit_neun, the checkpoint at the foot of the Transitachse (kapitel3-design §3.3, §9.2): where the glass lifts
// the intro rides down (game/intro_ride.js, docs/rooms/intro_d_lift_ninth_x3.png) come out in the Ninth, and where Juno is turned away.
// Three ways to see it, for the user to choose from:
//   transit_neun_iso    street mode, 2:1 iso like every walkable room: the hall at the tower's foot cut open on two sides
//   transit_neun_buehne a stage seen from the side, tall: the lift tubes climbing out of the frame past the decks to the Crown's light
//   transit_neun_oben   from straight above, as the Drain Market: the shaft's floor, the tubes as glass rings, the queue as heads
// Blocks only: flat shapes in the world palette (style guide §5), people as figures of a few blocks, signs in the city's English set
// with the game's font. What is in all three: two glass lift tubes, one lift standing at the bottom (the intro's box: a pale steel
// frame, a lamp bar under its roof), the barrier with its turnstiles, the scanner arch under RING 5 - WORK PERMIT ONLY, the guard
// behind glass with a red light, commuters with permits queueing, an ad selling sleep, red light for the authority.
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  r: "#7e1420", q: "#ff3a3a",
  j: "#9a7406", y: "#eec414", Y: "#fff070",
  s: "#93583f", S: "#d79676",
  g: "#5a6478", G: "#8a94a8", H: "#b9c6d8", K: "#2a1a14",                                    // the lift's steel and the guards' grey-white
})
include("../lib/text.js")

const W = 320, H = 180

// ================================================================ people as blocks
// side or iso: a figure standing, h px tall, its colours (coat, head, accent)
function person(c, x, by, h, coat, head = "s", o = {}) {
  const w = Math.max(4, Math.round(h / 4)), hh = Math.max(3, Math.round(h / 6))
  c.rect(x - Math.floor(w / 2), by - h + hh, w, h - hh, coat)                         // body and legs
  c.rect(x - Math.floor(w / 2), by - Math.round(h * 0.38), w, 1, "k")                  // the coat's hem
  c.rect(x - Math.floor(hh / 2), by - h, hh, hh, head)                                 // head
  if (o.hood) c.rect(x - Math.floor(hh / 2) - 1, by - h - 1, hh + 2, hh, o.hood)       // Juno's hood
  if (o.cap) { c.rect(x - Math.floor(hh / 2) - 1, by - h - 1, hh + 2, 2, o.cap); c.px(x, by - h - 2, "q") }   // the guard's cap, its red light
  if (o.bag) c.rect(x - Math.floor(w / 2) - 2, by - Math.round(h * 0.55), 3, 4, o.bag)
  if (o.permit) c.px(x + Math.floor(w / 2), by - Math.round(h * 0.6), "v")              // a permit lit in the hand
}
// from above: a head and shoulders
function personTop(c, x, y, coat, head = "K", o = {}) {
  c.ellipse(x, y, 7, 4, coat); c.circ(x, y, 3, o.hood ?? head)                        // shoulders, the head (Juno: her hood)
  if (o.permit) { c.px(x + 7, y + 1, "v"); c.px(x + 8, y + 1, "v") }
}

// ================================================================ the lift (the intro's box) and its tube
function liftSide(c, x, y, w, h, lit = true) {
  c.rect(x, y, w, h, lit ? "3" : "2")                                                 // inside
  c.rect(x, y, w, 2, "H"); c.rect(x, y + h - 3, w, 3, "G")                             // roof and floor
  c.rect(x, y, 2, h, "G"); c.rect(x + w - 2, y, 2, h, "G")                             // the frame
  c.rect(x + 6, y + 3, w - 12, 1, "V")                                                // the lamp bar under the roof
  for (let i = 0; i < h - 6; i += 3) c.px(x + 4 + (i % 7), y + 4 + i, "6")              // glass glints
}

// ================================================================ A: iso
// 1 m: 13 px along a ground axis (x right-down, y left-down), 18 px up
const OX = 166, OY = 42
const iso = (x, y, z = 0) => [Math.round(OX + (x - y) * 13), Math.round(OY + (x + y) * 6.5 - z * 18)]
function isoQuad(c, pts, k) { c.poly(pts.flat(), k) }
function isoBox(c, x, y, z, dx, dy, dz, top, left, right) {
  const P = (a, b, h) => iso(x + a, y + b, z + h)
  isoQuad(c, [P(0, dy, 0), P(dx, dy, 0), P(dx, dy, dz), P(0, dy, dz)], left)         // the face toward the viewer's left
  isoQuad(c, [P(dx, 0, 0), P(dx, dy, 0), P(dx, dy, dz), P(dx, 0, dz)], right)        // toward the right
  isoQuad(c, [P(0, 0, dz), P(dx, 0, dz), P(dx, dy, dz), P(0, dy, dz)], top)
}
scene("transit_neun_iso", { w: W, h: H, bg: "k" },
  (c) => {
    // the floor, 11 x 8 m, wet tiles
    isoQuad(c, [iso(0, 0), iso(11, 0), iso(11, 8), iso(0, 8)], "z")
    for (let i = 1; i < 11; i++) c.line(...iso(i, 0), ...iso(i, 8), "Z")
    for (let j = 1; j < 8; j++) c.line(...iso(0, j), ...iso(11, j), "Z")
    // the back walls: left (along x) the tower's foot, right (along y) the guards' side
    isoQuad(c, [iso(0, 0), iso(11, 0), iso(11, 0, 8), iso(0, 0, 8)], "2")
    isoQuad(c, [iso(0, 0), iso(0, 8), iso(0, 8, 8), iso(0, 0, 8)], "1")
    // two glass tubes in the left wall, climbing out of the picture; one lift standing at the bottom
    for (const tx of [2, 6.2]) {
      isoQuad(c, [iso(tx, 0), iso(tx + 2.6, 0), iso(tx + 2.6, 0, 9), iso(tx, 0, 9)], "c")
      c.line(...iso(tx, 0), ...iso(tx, 0, 9), "6"); c.line(...iso(tx + 2.6, 0), ...iso(tx + 2.6, 0, 9), "6")
      for (let z = 1; z < 9; z += 1.5) c.line(...iso(tx, 0, z), ...iso(tx + 2.6, 0, z), "C")
    }
    isoQuad(c, [iso(2.2, 0.1), iso(4.6, 0.1), iso(4.6, 0.1, 2.6), iso(2.2, 0.1, 2.6)], "5")
    c.line(...iso(2.2, 0.1, 2.6), ...iso(4.6, 0.1, 2.6), "H"); c.line(...iso(2.4, 0.1, 2.45), ...iso(4.4, 0.1, 2.45), "V")
    c.line(...iso(2.2, 0.1), ...iso(2.2, 0.1, 2.6), "G"); c.line(...iso(4.6, 0.1), ...iso(4.6, 0.1, 2.6), "G")
    // light from the lift and the tubes on the floor
    isoQuad(c, [iso(2.2, 0.2), iso(4.6, 0.2), iso(4.8, 2.2), iso(2.0, 2.2)], "X")
    // an ad on the tower's foot, selling sleep
    isoQuad(c, [iso(9.2, 0, 3), iso(10.8, 0, 3), iso(10.8, 0, 5.4), iso(9.2, 0, 5.4)], "n")
    isoQuad(c, [iso(9.35, 0, 3.15), iso(10.65, 0, 3.15), iso(10.65, 0, 5.25), iso(9.35, 0, 5.25)], "M")
    const [ax, ay] = iso(10, 0, 4.6); TXT.draw(c, ax - 6, ay - 2, "LULL", "N", { font: "hud" })
    const [bx, by] = iso(10, 0, 3.9); TXT.draw(c, bx - 8, by - 2, "FREE", "m", { font: "hud" })
    // the guards' booth in the right wall: glass, a desk, the guard, red light
    isoBox(c, 0, 4.4, 0, 2.2, 2.6, 1.1, "4", "3", "5")
    isoQuad(c, [iso(0.05, 4.4, 1.1), iso(0.05, 7, 1.1), iso(0.05, 7, 3.0), iso(0.05, 4.4, 3.0)], "c")
    person(c, ...iso(1, 5.7), 26, "H", "S", { cap: "G" })
    c.rect(...iso(0, 6.8, 3.4), 4, 3, "q")                                         // the red lamp over it
    // the barrier across the room, turnstiles, the scanner arch (the way through, toward the tubes)
    for (let x = 0.2; x < 11; x += 0.25) { const [px, py] = iso(x, 3.6, 0.9); c.px(px, py, x > 4.6 && x < 6.4 ? "k" : "G") }
    for (const x of [5, 6]) isoBox(c, x - 0.15, 3.45, 0, 0.3, 0.3, 1.0, "H", "5", "6")
    const A0 = iso(4.6, 3.6), A1 = iso(6.4, 3.6)
    isoBox(c, 4.4, 3.4, 0, 0.3, 0.4, 2.6, "G", "4", "5"); isoBox(c, 6.3, 3.4, 0, 0.3, 0.4, 2.6, "G", "4", "5")
    isoBox(c, 4.4, 3.4, 2.6, 2.2, 0.4, 0.6, "r", "1", "2")                          // the lintel, red on top
    const [sx, sy] = iso(5.5, 3.8, 2.95); TXT.draw(c, sx, sy - 6, "RING 5 - WORK PERMIT ONLY", "q", { font: "hud", align: "center", outline: "k" })
    // the queue of commuters with permits, from the arch toward the front
    for (const [x, y] of [[5.4, 4.4], [5.6, 5.2], [5.3, 6.0], [5.7, 6.8]]) person(c, ...iso(x, y), 28, ["4", "5", "3", "4"][Math.round(x * 3) % 4], "S", { permit: true })
    // Juno, in front, off to the side of the queue
    person(c, ...iso(8.6, 6.6), 30, "y", "S", { hood: "y", bag: "G" })
    // labels: what this sketch is
    TXT.draw(c, 4, 4, "A: ISO", "6", { font: "hud" })
  },
)

// ================================================================ B: the stage from the side, tall
scene("transit_neun_buehne", { w: W, h: H, bg: "k" },
  (c) => {
    // up the shaft: the decks of the rings, smaller and colder the higher, the Crown's white light at the top
    c.rect(0, 0, W, 120, "1")
    for (let y = 0; y < 120; y++) for (let x = 0; x < W; x++) if (((x * 3 + y * 7) % 23) === 0 && y < 60) c.px(x, y, "2")
    const DECKS = [[96, 18, "3", "R"], [66, 12, "4", "v"], [44, 8, "5", "V"], [28, 5, "6", "V"], [16, 3, "H", "W"]]
    for (const [y, h, k, win] of DECKS) {
      const half = 30 + (y - 10) * 1.4
      c.rect(0, y, W / 2 - half, h, k); c.rect(W / 2 + half, y, W / 2 - half, h, k)                 // the rings' edges round the shaft
      for (let x = 4; x < W; x += 9) if (Math.abs(x - W / 2) > half + 3 && ((x * 7 + y) % 3)) c.rect(x, y + Math.floor(h / 2), 2, 1, win)
    }
    c.rect(W / 2 - 14, 0, 28, 6, "W"); c.rect(W / 2 - 22, 6, 44, 2, "V")                          // the Crown's cold light, far up
    // the tower's foot, the two tubes climbing out of the picture
    c.rect(0, 112, W, 50, "2")
    for (const tx of [112, 176]) {
      c.rect(tx, 0, 32, 150, "c"); c.rect(tx, 0, 1, 150, "6"); c.rect(tx + 31, 0, 1, 150, "6")
      for (let y = 4; y < 150; y += 14) c.rect(tx, y, 32, 1, "C")
    }
    liftSide(c, 113, 112, 30, 38)                                                                 // a lift at the bottom, lit
    person(c, 126, 146, 26, "4", "S", { permit: true })                                           // someone riding up
    liftSide(c, 177, 40, 30, 38, false)                                                           // the other one, far up, going
    // the ground: the barrier, the arch, the booth
    c.rect(0, 150, W, 30, "z"); c.rect(0, 150, W, 1, "X")
    for (let x = 0; x < W; x += 2) c.px(x, 152 + ((x * 5) % 3), "Z")                               // wet
    c.rect(96, 120, 4, 30, "G"); c.rect(156, 120, 4, 30, "G"); c.rect(96, 116, 64, 5, "r")          // the scanner arch
    c.rect(76, 98, 104, 11, "k"); c.rect(76, 98, 104, 1, "r"); TXT.draw(c, 128, 101, "RING 5 - WORK PERMIT ONLY", "q", { font: "hud", align: "center" })
    c.rect(60, 138, 36, 2, "G"); c.rect(160, 138, 48, 2, "G")                                      // the barrier either side
    for (const x of [66, 80, 166, 180, 194]) c.rect(x, 138, 2, 12, "5")
    c.rect(232, 118, 70, 32, "3"); c.rect(236, 122, 62, 16, "c"); c.rect(232, 116, 70, 2, "5")      // the guards' booth, its window
    person(c, 262, 138, 22, "H", "S", { cap: "G" }); c.rect(296, 112, 4, 4, "q")
    // the ad at the foot, as in the ride
    c.rect(16, 114, 40, 22, "n"); c.rect(18, 116, 36, 18, "M"); TXT.draw(c, 36, 119, "LULL", "N", { font: "hud", align: "center" }); TXT.draw(c, 36, 127, "FREE", "m", { font: "hud", align: "center" })
    // the queue under the arch, Juno at the barrier
    for (const [x, k] of [[110, "4"], [122, "5"], [136, "3"], [148, "4"]]) person(c, x, 166, 30, k, "S", { permit: true })
    person(c, 74, 170, 34, "y", "S", { hood: "y", bag: "G" })
    TXT.draw(c, 4, 4, "B: BUEHNE", "6", { font: "hud" })
  },
)

// ================================================================ C: from straight above
scene("transit_neun_oben", { w: W, h: H, bg: "k" },
  (c) => {
    c.rect(0, 0, W, H, "z")
    for (let x = 0; x < W; x += 16) c.rect(x, 0, 1, H, "Z"); for (let y = 0; y < H; y += 16) c.rect(0, y, W, 1, "Z")
    // the tower's foot along the top, the tubes as glass rings in it, one with the lift's roof lit
    c.rect(0, 0, W, 40, "2"); c.rect(0, 40, W, 2, "4")
    for (const [tx, lit] of [[110, true], [180, false]]) {
      c.circ(tx, 36, 20, "c"); c.circ(tx, 36, 17, lit ? "3" : "1")
      if (lit) { c.rect(tx - 12, 26, 24, 20, "H"); c.rect(tx - 10, 35, 20, 1, "V") }               // the lift's roof
      c.ring(tx, 36, 20, "6")
    }
    c.rect(88, 56, 120, 30, "X")                                                                   // light spilling from the tubes
    // the barrier across, the arch, the turnstiles
    c.rect(0, 100, 130, 3, "G"); c.rect(170, 100, 150, 3, "G")
    c.rect(130, 96, 6, 11, "r"); c.rect(164, 96, 6, 11, "r"); c.rect(130, 96, 40, 2, "r")          // the arch seen from above
    TXT.draw(c, 150, 86, "RING 5 - WORK PERMIT ONLY", "q", { font: "hud", align: "center" })
    // the guards' booth on the right, its roof and the red lamp
    c.rect(250, 70, 56, 40, "4"); c.rect(252, 72, 52, 36, "5"); c.rect(300, 66, 6, 6, "q")
    personTop(c, 276, 88, "H", "G")
    // the queue in a line from the arch down, Juno beside it
    for (const y of [118, 134, 150, 166]) personTop(c, 150 + ((y / 2) % 5) - 2, y, ["4", "5", "3", "4"][(y / 14) % 4 | 0], "K", { permit: true })
    personTop(c, 92, 150, "y", "K", { hood: "y" })
    // the ad, a light box on the floor's edge
    c.rect(14, 60, 30, 20, "M"); TXT.draw(c, 29, 63, "LULL", "N", { font: "hud", align: "center" }); TXT.draw(c, 29, 71, "FREE", "m", { font: "hud", align: "center" })
    TXT.draw(c, 4, 4, "C: VON OBEN", "6", { font: "hud" })
  },
)

// ================================================================ A2: the hall, the user's choice (iso), big and tall
// After the user's photo of an airport's check-in hall (2026-11-24): a long row of counters with a screen over each, lanes of posts and
// belts the queue winds through, behind the counters the scanner arches and the glass tubes. At the game's own scale (isomap: 32 px a
// meter along u to the right, 16 down; 30 px a meter up), 12 x 8 m, its walls 7 m, twice a room's, so the tubes rise out of the top: the
// hall is bigger than the screen both ways and the camera moves over it, as in the intro's observation hall.
const HW = 672, HH = 560, HCX = 272, HCY = 214
const P = (u, v, h = 0) => [Math.round(HCX + 32 * (u - v)), Math.round(HCY + 16 * (u + v) - h * 30)]
const quad = (c, pts, k) => c.poly(pts.flat(), k)
function hbox(c, u, v, h, du, dv, dh, top, left, right) {
  quad(c, [P(u, v + dv, h), P(u + du, v + dv, h), P(u + du, v + dv, h + dh), P(u, v + dv, h + dh)], left)
  quad(c, [P(u + du, v, h), P(u + du, v + dv, h), P(u + du, v + dv, h + dh), P(u + du, v, h + dh)], right)
  quad(c, [P(u, v, h + dh), P(u + du, v, h + dh), P(u + du, v + dv, h + dh), P(u, v + dv, h + dh)], top)
}
// a standing figure at the game's scale: 1.75 m, about 52 px
function man(c, u, v, coat, o = {}) {
  const [x, y] = P(u, v), h = o.h ?? 52, w = 14
  c.ellipse(x, y, 9, 4, "f")                                                          // its shadow on the floor
  c.rect(x - 7, y - h + 10, w, h - 10, coat); c.rect(x - 7, y - 20, w, 20, o.legs ?? "2")
  c.rect(x - 4, y - h, 8, 10, o.head ?? "S"); c.rect(x - 4, y - h, 8, 3, o.hair ?? "k")
  if (o.hood) { c.rect(x - 6, y - h - 2, 12, 9, o.hood); c.rect(x - 3, y - h + 3, 6, 6, "S") }
  if (o.cap) { c.rect(x - 5, y - h - 2, 10, 4, o.cap); c.rect(x - 1, y - h - 4, 2, 2, "q") }
  if (o.bag) { c.rect(x - 11, y - 30, 5, 8, o.bag); c.line(x - 7, y - 30, x + 6, y - h + 11, o.bag) }
  if (o.permit) { c.rect(x + 7, y - 30, 3, 4, "v") }
  if (o.case) c.rect(x + 8, y - 16, 7, 14, "3")
}
scene("transit_neun_halle", { w: HW, h: HH, bg: "k" },
  (c) => {
    const U = 12, V = 8, WH = 7
    // the floor: pale tiles, two bands of light under the ceiling's strips
    quad(c, [P(0, 0), P(U, 0), P(U, V), P(0, V)], "Z")
    for (let u = 0; u <= U; u += 1) c.line(...P(u, 0), ...P(u, V), "z")
    for (let v = 0; v <= V; v += 1) c.line(...P(0, v), ...P(U, v), "z")
    for (const v0 of [1.6, 5.2]) quad(c, [P(0, v0), P(U, v0), P(U, v0 + 0.9), P(0, v0 + 0.9)], "X")
    // the back walls, twice a room's height
    quad(c, [P(0, 0), P(U, 0), P(U, 0, WH), P(0, 0, WH)], "2")
    quad(c, [P(0, 0), P(0, V), P(0, V, WH), P(0, 0, WH)], "1")
    for (const h of [3.6, 6.6]) { c.line(...P(0, 0, h), ...P(U, 0, h), "V"); c.line(...P(0, 0, h), ...P(0, V, h), "V") }   // light strips
    // the tubes in the tower's wall: glass, rising out of the picture; a lift lit at the bottom of the first, one halfway up the third
    const TUBES = [[2.0, 4.4], [5.6, 8.0], [9.2, 11.6]]
    for (const [a, b] of TUBES) {
      quad(c, [P(a, 0), P(b, 0), P(b, 0, 20), P(a, 0, 20)], "c")
      c.line(...P(a, 0), ...P(a, 0, 20), "6"); c.line(...P(b, 0), ...P(b, 0, 20), "6")
      for (let h = 0.8; h < 20; h += 1.4) c.line(...P(a, 0, h), ...P(b, 0, h), "C")
    }
    const lift = (a, b, h0, lit) => {
      quad(c, [P(a + 0.15, 0.05, h0), P(b - 0.15, 0.05, h0), P(b - 0.15, 0.05, h0 + 2.6), P(a + 0.15, 0.05, h0 + 2.6)], lit ? "5" : "4")
      c.line(...P(a + 0.15, 0.05, h0 + 2.6), ...P(b - 0.15, 0.05, h0 + 2.6), "H"); c.line(...P(a + 0.15, 0.05, h0), ...P(b - 0.15, 0.05, h0), "H")
      c.line(...P(a + 0.15, 0.05, h0), ...P(a + 0.15, 0.05, h0 + 2.6), "G"); c.line(...P(b - 0.15, 0.05, h0), ...P(b - 0.15, 0.05, h0 + 2.6), "G")
      c.line(...P(a + 0.5, 0.05, h0 + 2.4), ...P(b - 0.5, 0.05, h0 + 2.4), "V")
    }
    lift(2.0, 4.4, 0, true); lift(9.2, 11.6, 4.6, false)
    // the sign over the arches, along the wall
    quad(c, [P(1.2, 0.02, 3.0), P(11.8, 0.02, 3.0), P(11.8, 0.02, 3.5), P(1.2, 0.02, 3.5)], "k")
    for (const [a, b] of TUBES) { const [sx, sy] = P((a + b) / 2, 0, 3.4); TXT.draw(c, sx, sy, "RING 5", "q", { font: "nagiwa", align: "center" }) }
    // the left wall: the ad selling sleep, the board of the lifts, a camera
    quad(c, [P(0.02, 0.8, 2.4), P(0.02, 3.6, 2.4), P(0.02, 3.6, 5.6), P(0.02, 0.8, 5.6)], "M")
    { const [x, y] = P(0, 2.2, 4.6); TXT.draw(c, x, y, "LULL", "N", { align: "center" }); const [x2, y2] = P(0, 2.2, 3.7); TXT.draw(c, x2, y2, "TWO WEEKS FREE", "m", { font: "hud", align: "center" }) }
    quad(c, [P(0.02, 4.6, 3.0), P(0.02, 7.4, 3.0), P(0.02, 7.4, 4.6), P(0.02, 4.6, 4.6)], "c")
    { const [x, y] = P(0, 6.0, 4.3); TXT.draw(c, x, y, "NEXT LIFT 20:00", "v", { font: "hud", align: "center" }); const [x2, y2] = P(0, 6.0, 3.7); TXT.draw(c, x2, y2, "RING 5  WORK PERMIT", "C", { font: "hud", align: "center" }) }
    // the scanner arches before the tubes
    for (const [a, b] of TUBES) {
      hbox(c, a + 0.4, 0.9, 0, 0.25, 0.3, 2.5, "G", "4", "5"); hbox(c, b - 0.65, 0.9, 0, 0.25, 0.3, 2.5, "G", "4", "5")
      hbox(c, a + 0.4, 0.9, 2.5, b - a - 0.8, 0.3, 0.3, "r", "1", "2")
    }
    man(c, 6.8, 1.4, "4", { permit: true })                                                      // one going through
    // the counters: four desks, a guard behind each, a screen over each on its pole; the gaps lead to the arches
    const DESKS = [[0.4, 2.6], [3.8, 6.2], [7.4, 9.8], [11.0, 11.9]]
    for (const [a, b] of DESKS) {
      for (let u = a + 0.6; u < b - 0.3; u += 1.4) man(c, u, 2.4, "H", { cap: "G", h: 50 })
      hbox(c, a, 2.7, 0, b - a, 0.7, 1.05, "5", "3", "4")
      for (let u = a + 0.6; u < b - 0.3; u += 1.4) { hbox(c, u - 0.05, 2.95, 1.05, 0.1, 0.1, 1.2, "G", "5", "6"); hbox(c, u - 0.45, 2.9, 2.25, 0.9, 0.2, 0.55, "6", "c", "C")
        const [x, y] = P(u, 3.1, 2.62); TXT.draw(c, x - 6, y - 3, "R5", "v", { font: "hud" }) }
    }
    // the lanes: posts and belts, the queue winding through them from the front to the counters
    const LANES = [4.4, 5.4, 6.4]
    LANES.forEach((v, i) => {
      const u0 = i % 2 ? 1.2 : 2.4, u1 = i % 2 ? 9.6 : 10.8
      for (let u = u0; u <= u1 + 0.01; u += 1.2) { hbox(c, u - 0.05, v - 0.05, 0, 0.1, 0.1, 1.0, "H", "5", "6") }
      for (let u = u0; u < u1; u += 1.2) c.line(...P(u, v, 0.95), ...P(u + 1.2, v, 0.95), "r")
    })
    const COATS = ["4", "3", "5", "4", "3", "5", "4", "g"]
    // between the counters and the first lane, then lane by lane, back to front, people standing in line
    const Q = [[1.4, 3.8], [5.0, 3.9], [8.6, 3.8], [3.0, 4.9], [4.4, 4.9], [5.8, 4.95], [7.3, 4.9], [8.9, 4.9],
               [9.9, 5.9], [8.4, 5.9], [6.9, 5.95], [5.3, 5.9], [3.6, 5.9], [2.2, 6.9], [3.8, 6.9], [5.2, 6.95]]
    Q.forEach(([u, v], i) => man(c, u, v, COATS[i % COATS.length], { permit: i % 3 !== 1, case: i % 4 === 2 }))
    // Juno, in front, outside the lanes: no permit
    man(c, 9.6, 7.3, "y", { hood: "y", bag: "G", legs: "2" })
    TXT.draw(c, 6, 6, "A: ISO, DIE HALLE (12 X 8 M, WAENDE 7 M)", "6", { font: "hud" })
  },
)

// ================================================================ A3: the hall, long, the way through it (the user, 2026-11-24)
// Bigger to the right and scrolling: Juno comes in at the left and has to cross a hall to the counters. A first check right behind
// the doors sorts everyone by light: a cyan gate for a permit, a red one for none. With a permit: a narrow lane behind a glass wall
// along the tower's side, nearly empty, straight to the arches and the tubes. Without: the waiting hall, wide and full, benches,
// people asleep on Lull, a board counting today's approved against today's denied, the application counters at its far end.
// 24 x 7 m, walls 7 m. In iso a long room runs right and down, so the camera follows Juno diagonally.
const LW = 1040, LH = 760
const L = (u, v, h = 0) => [Math.round(250 + 32 * (u - v)), Math.round(250 + 16 * (u + v) - h * 30)]
const lq = (c, pts, k) => c.poly(pts.flat(), k)
function lbox(c, u, v, h, du, dv, dh, top, left, right) {
  lq(c, [L(u, v + dv, h), L(u + du, v + dv, h), L(u + du, v + dv, h + dh), L(u, v + dv, h + dh)], left)
  lq(c, [L(u + du, v, h), L(u + du, v + dv, h), L(u + du, v + dv, h + dh), L(u + du, v, h + dh)], right)
  lq(c, [L(u, v, h + dh), L(u + du, v, h + dh), L(u + du, v + dv, h + dh), L(u, v + dv, h + dh)], top)
}
function lman(c, u, v, coat, o = {}) {
  const [x, y] = L(u, v), h = o.sit ? 38 : (o.h ?? 52)
  c.ellipse(x, y, 9, 4, "f")
  if (o.sit) { c.rect(x - 7, y - 24, 14, 14, coat); c.rect(x - 7, y - 10, 14, 6, o.legs ?? "2") }
  else { c.rect(x - 7, y - h + 10, 14, h - 30, coat); c.rect(x - 7, y - 20, 14, 20, o.legs ?? "2") }
  const top = o.sit ? y - 34 : y - h
  if (o.sleep) { c.rect(x - 2, top + 2, 8, 9, "S"); c.rect(x - 2, top + 2, 8, 3, "k"); c.px(x - 3, top + 6, "N") }   // head to one side, the patch
  else { c.rect(x - 4, top, 8, 10, o.head ?? "S"); c.rect(x - 4, top, 8, 3, "k") }
  if (o.hood) { c.rect(x - 6, top - 2, 12, 9, o.hood); c.rect(x - 3, top + 3, 6, 6, "S") }
  if (o.cap) { c.rect(x - 5, top - 2, 10, 4, o.cap); c.rect(x - 1, top - 4, 2, 2, "q") }
  if (o.bag) { c.rect(x - 11, y - 30, 5, 8, o.bag); c.line(x - 7, y - 30, x + 6, top + 11, o.bag) }
  if (o.permit) c.rect(x + 7, y - 30, 3, 4, "v")
  if (o.case) c.rect(x + 8, y - 16, 7, 14, "3")
}
scene("transit_neun_lang", { w: LW, h: LH, bg: "k" },
  (c) => {
    const U = 24, V = 7, WH = 7, GL = 2.2                                  // GL: the glass wall between the lane and the waiting hall
    // the floor; the permit lane's cyan stripe
    lq(c, [L(0, 0), L(U, 0), L(U, V), L(0, V)], "Z")
    for (let u = 0; u <= U; u++) c.line(...L(u, 0), ...L(u, V), "z")
    for (let v = 0; v <= V; v++) c.line(...L(0, v), ...L(U, v), "z")
    lq(c, [L(3.6, 0.9), L(U, 0.9), L(U, 1.3), L(3.6, 1.3)], "C")
    // the walls: the tower's (right, along u) and the street's (left, along v) with the doors
    lq(c, [L(0, 0), L(U, 0), L(U, 0, WH), L(0, 0, WH)], "2")
    lq(c, [L(0, 0), L(0, V), L(0, V, WH), L(0, 0, WH)], "1")
    for (const h of [3.6, 6.6]) { c.line(...L(0, 0, h), ...L(U, 0, h), "V"); c.line(...L(0, 0, h), ...L(0, V, h), "V") }
    lq(c, [L(0.02, 3.4), L(0.02, 6.2), L(0.02, 6.2, 2.8), L(0.02, 3.4, 2.8)], "c")                 // the glass doors, the street's light
    for (let v = 3.6; v < 6.2; v += 0.5) c.line(...L(0.02, v, 0.1), ...L(0.02, v - 0.3, 2.6), "v")   // rain behind them
    { const [x, y] = L(0, 4.8, 3.3); TXT.draw(c, x, y, "TRANSIT 9", "V", { align: "center" }) }
    // the tubes in the tower's wall at the far end, a lift lit in the first
    const TUBES = [[17.0, 19.2], [20.2, 22.4]]
    for (const [a, b] of TUBES) {
      lq(c, [L(a, 0), L(b, 0), L(b, 0, 24), L(a, 0, 24)], "c")
      c.line(...L(a, 0), ...L(a, 0, 24), "6"); c.line(...L(b, 0), ...L(b, 0, 24), "6")
      for (let h = 0.8; h < 24; h += 1.4) c.line(...L(a, 0, h), ...L(b, 0, h), "C")
    }
    lq(c, [L(17.15, 0.05), L(19.05, 0.05), L(19.05, 0.05, 2.6), L(17.15, 0.05, 2.6)], "5")
    c.line(...L(17.15, 0.05, 2.6), ...L(19.05, 0.05, 2.6), "H"); c.line(...L(17.4, 0.05, 2.4), ...L(18.8, 0.05, 2.4), "V")
    lq(c, [L(10, 0.02, 3.0), L(23.6, 0.02, 3.0), L(23.6, 0.02, 3.6), L(10, 0.02, 3.6)], "k")
    { const [x, y] = L(13.4, 0, 3.55); TXT.draw(c, x, y, "RING 5 - WORK PERMIT ONLY", "q", { align: "center" }) }
    // the ad and the board on the tower's wall over the waiting hall: what they sell, and how few go up
    lq(c, [L(4.5, 0.02, 3.8), L(8.5, 0.02, 3.8), L(8.5, 0.02, 6.4), L(4.5, 0.02, 6.4)], "M")
    { const [x, y] = L(6.5, 0, 5.6); TXT.draw(c, x, y, "LULL", "N", { align: "center" }); const [x2, y2] = L(6.5, 0, 4.7); TXT.draw(c, x2, y2, "WHILE YOU WAIT", "m", { font: "hud", align: "center" }) }
    lq(c, [L(10, 0.02, 4.0), L(15, 0.02, 4.0), L(15, 0.02, 6.4), L(10, 0.02, 6.4)], "k")
    { const T = (u, h, s, k) => { const [x, y] = L(u, 0, h); TXT.draw(c, x, y, s, k, { font: "hud", align: "center" }) }
      T(12.5, 6.1, "TODAY", "6"); T(12.5, 5.6, "APPROVED      4", "v"); T(12.5, 5.1, "DENIED    2.318", "q"); T(12.5, 4.5, "NOW SERVING 0412", "R") }
    // the first check: four gates across the hall behind the doors, a light on each; the guard's booth
    lbox(c, 0.4, 0.3, 0, 1.6, 1.4, 1.1, "4", "3", "5"); lman(c, 1.2, 0.7, "H", { cap: "G" })
    for (const [v, k] of [[1.0, "v"], [2.6, "q"], [4.0, "q"], [5.4, "q"]]) {
      lbox(c, 3.2, v, 0, 0.3, 0.25, 1.9, "G", "4", "5"); lbox(c, 3.2, v + 1.05, 0, 0.3, 0.25, 1.9, "G", "4", "5")
      lbox(c, 3.2, v, 1.9, 0.3, 1.3, 0.2, k, "1", "2")
    }
    { const [x, y] = L(3.3, 3.5, 2.6); c.rect(x - 34, y - 4, 68, 9, "k"); TXT.draw(c, x, y - 2, "PERMIT CHECK", "q", { font: "hud", align: "center" }) }
    // the glass wall from the gates to the counters: the lane behind it, the hall in front
    for (let u = 3.6; u <= 16.4; u += 1.6) lbox(c, u, GL - 0.05, 0, 0.1, 0.1, 2.6, "H", "5", "6")
    for (let u = 3.6; u < 16.4; u += 0.05) for (let h = 0.1; h < 2.6; h += 0.12) {                // the glass: a sparse sheen, the lane seen through it
      const [x, y] = L(u, GL, h); if ((x + y) % 5 === 0) c.px(x, y, "C")
    }
    c.line(...L(3.6, GL, 2.6), ...L(16.4, GL, 2.6), "V"); c.line(...L(3.6, GL, 0.05), ...L(16.4, GL, 0.05), "6")
    // in the lane: two with permits, walking to the arches; the arches before the tubes
    lman(c, 9.5, 1.1, "4", { permit: true, case: true }); lman(c, 14.2, 1.1, "5", { permit: true })
    for (const [a, b] of TUBES) {
      lbox(c, a + 0.3, 0.8, 0, 0.25, 0.3, 2.5, "G", "4", "5"); lbox(c, b - 0.55, 0.8, 0, 0.25, 0.3, 2.5, "G", "4", "5")
      lbox(c, a + 0.3, 0.8, 2.5, b - a - 0.6, 0.3, 0.3, "r", "1", "2")
    }
    // the application counters at the far end of the waiting hall: guards, screens, a short line in posts and belts
    for (const u of [17.6, 19.6, 21.6]) {
      lman(c, u + 0.8, 2.9, "H", { cap: "G", h: 50 })
      lbox(c, u, 3.3, 0, 1.6, 0.7, 1.05, "5", "3", "4")
      lbox(c, u + 0.35, 3.45, 1.05, 0.9, 0.2, 0.55, "6", "c", "C")
    }
    for (let u = 17.4; u <= 23.4; u += 1.2) lbox(c, u - 0.05, 5.0, 0, 0.1, 0.1, 1.0, "H", "5", "6")
    for (let u = 17.4; u < 23.4; u += 1.2) c.line(...L(u, 5.0, 0.95), ...L(u + 1.2, 5.0, 0.95), "r")
    // the waiting hall: rows of benches, full; some asleep on Lull; people standing between
    const COATS = ["4", "3", "5", "g", "4", "3"]
    let n = 0
    for (const v of [3.4, 4.9, 6.3]) for (let u = 5; u < 16; u += 2.6) {
      lbox(c, u, v, 0, 2.2, 0.5, 0.45, "5", "3", "4")
      for (let s = 0; s < 3; s++) { n++; if (n % 5 === 3) continue; lman(c, u + 0.4 + s * 0.7, v + 0.25, COATS[n % 6], { sit: true, sleep: n % 4 === 1 }) }
    }
    for (const [u, v] of [[16.6, 3.6], [17.2, 4.4], [18.4, 4.5], [19.6, 4.4], [16.0, 5.6], [4.6, 4.2], [4.5, 5.7]]) { n++; lman(c, u, v, COATS[n % 6], { case: n % 3 === 0 }) }
    // Juno at the first check: a red gate for her
    lman(c, 2.4, 3.3, "y", { hood: "y", bag: "G" })
    TXT.draw(c, 6, 6, "A: ISO, DIE LANGE HALLE (24 X 7 M, WAENDE 7 M)", "6", { font: "hud" })
  },
)
