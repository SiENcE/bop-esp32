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
