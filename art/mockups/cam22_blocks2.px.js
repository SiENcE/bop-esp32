// CAM 22, Pho Pump, again (the user, 2026-11-12, after the painting in perspective: "irgendwie sieht das so in 3d komisch aus.
// können wir das als frontalansicht haben oder iso?"). Two blocks of the same place and the same people, flat, phosphor only:
//   F  frontal: from the back wall at head height straight across the counter: the cook's back big on the left, the steam on the
//      right, Ines facing us over the counter, the window and the door behind her, the clinic's white light outside
//   I  iso (2:1, as street mode and CAM 14 and CAM 23): the room from above the open front corner, the window wall on the right, the
//      tiled wall on the left with the stove and its steam; the counter along the window wall, Ines behind it facing us, the cook
//      in front of it with his back to us
// Not built into the game.
//   PXL build art/mockups/cam22_blocks2.px.js --out build/art/cam22_blocks2 --no-preview
include("../lib/feed.js")
include("../lib/iso.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const label = (s) => (c) => { c.rect(W - 6 - s.length * 4 - 4, H - 12, s.length * 4 + 6, 9, "0"); TXT.draw(c, W - 6, H - 10, s, "9", { font: "hud", align: "right" }) }
// a stand-in person: body, head; from the front (face light) or the back (hair dark)
const person = (c, x, foot, h, body, head, w = 9) => { c.rect(x - (w >> 1), foot - h + 6, w, h - 6, body); c.rect(x - 3, foot - h, 6, 6, head) }
const steam = (c, x0, y0, rise, spread) => {
  for (let i = 0; i < 5; i++) for (let t = 0; t < 1; t += 0.03) {
    const x = x0 + Math.sin(t * 6 + i * 1.7) * 4 + t * spread + (ih(i, 1) - 0.5) * 10, y = y0 - t * rise, r = 2 + t * 7, d = (1 - t) * 0.8
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const q = Math.hypot(dx, dy) / r; if (q <= 1 && bayer(Math.round(x + dx), Math.round(y + dy)) < d * (1 - q)) c.px(Math.round(x + dx), Math.round(y + dy), q < 0.45 ? "9" : "8") }
  }
}

// ================================================================ F: frontal
scene("cam22_blocks_f", { w: W, h: H, bg: "1" }, (c) => {
  c.rect(0, 0, W, 34, "1"); c.hline(0, 34, W, "2")                                                    // the ceiling
  c.rect(0, 35, W, 80, "3")                                                                             // the front wall across the room
  for (let y = 84; y < 115; y += 5) c.hline(0, y, W, "2"); for (let x = 0; x < W; x += 6) c.vline(x, 84, 31, "2")   // tiles to shoulder height
  c.rect(78, 44, 150, 44, "2"); c.rect(80, 46, 146, 40, "5"); c.rect(80, 70, 146, 16, "4")             // the window, the street through it
  c.rect(130, 48, 70, 20, "8"); c.rect(160, 52, 10, 10, "9"); c.rect(162, 54, 6, 6, "8")               // the clinic's white front, its ring
  c.rect(100, 50, 26, 32, "3"); for (let y = 54; y < 80; y += 4) c.hline(103, y, 20, "2")             // the menu board from behind
  c.rect(244, 46, 30, 66, "2"); c.rect(246, 48, 26, 62, "4")                                           // the door
  for (const x of [120, 206]) { c.vline(x, 0, 36, "4"); c.rect(x - 7, 36, 15, 5, "5"); c.hline(x - 6, 41, 13, "9") }   // the lamps
  person(c, 170, 112, 46, "8", "4", 13); c.rect(166, 66, 8, 5, "1")                                    // Ines facing us (her hair, the white coat)
  person(c, 112, 112, 44, "2", "3", 12); person(c, 236, 112, 44, "2", "3", 12)                         // two others
  c.rect(0, 112, W, 4, "7"); c.rect(0, 116, W, 18, "4"); for (let x = 4; x < W; x += 9) c.vline(x, 116, 18, "3")   // the counter: its top, its back
  c.rect(158, 109, 12, 4, "8"); c.rect(174, 110, 8, 3, "9")                                            // Ines's bowl, her napkin
  c.rect(0, 134, W, 46, "2"); for (let x = 0; x < W; x += 16) c.vline(x, 134, 46, "1")                // the cook's side, the floor
  c.rect(250, 150, 50, 30, "5"); c.rect(254, 146, 42, 6, "6"); c.rect(258, 148, 34, 3, "1")            // the big pot
  steam(c, 272, 146, 110, 18)
  c.rect(40, 92, 64, 88, "6"); c.rect(46, 84, 52, 12, "6"); c.rect(56, 64, 32, 22, "1"); c.rect(56, 58, 32, 10, "9")   // the cook's back, his head, his cap
  c.line(48, 98, 96, 140, "2"); c.line(96, 98, 48, 140, "2"); c.rect(40, 140, 64, 40, "3")            // the apron's strings, the apron
  c.line(104, 104, 140, 116, "6"); c.line(140, 116, 150, 100, "8")                                      // his arm, the ladle
}, label("F  FRONTAL"))

// ================================================================ I: iso
scene("cam22_blocks_i", { w: W, h: H, bg: "0" }, (c) => {
  const R = ISO.room({ CX: 150, CY: 34 }), M = 16, P = (u, v, h = 0) => R.P(u * M, v * M, h * 18)
  const U = 6.4, V = 5.2, HW = 2.9
  const quad = (pts, k) => c.poly(pts.flat(), k)
  quad([P(0, 0), P(U, 0), P(U, V), P(0, V)], "3")                                                       // the floor, its tiles
  for (let u = 0; u <= U; u += 0.4) c.line(...P(u, 0), ...P(u, V), "2"); for (let v = 0; v <= V; v += 0.4) c.line(...P(0, v), ...P(U, v), "2")
  quad([P(0, 0), P(U, 0), P(U, 0, HW), P(0, 0, HW)], "2")                                               // the window wall (right)
  quad([P(0.6, 0, 0.7), P(4.4, 0, 0.7), P(4.4, 0, 2.4), P(0.6, 0, 2.4)], "5")                           // the window, the street
  quad([P(1.8, 0, 1.2), P(3.6, 0, 1.2), P(3.6, 0, 2.2), P(1.8, 0, 2.2)], "8")                           // the clinic's white light across it
  quad([P(0.9, 0, 0.8), P(1.6, 0, 0.8), P(1.6, 0, 2.2), P(0.9, 0, 2.2)], "3")                           // the menu board from behind
  quad([P(4.9, 0, 0), P(5.8, 0, 0), P(5.8, 0, 2.2), P(4.9, 0, 2.2)], "4")                               // the door
  quad([P(0, 0), P(0, V), P(0, V, HW), P(0, 0, HW)], "3")                                               // the tiled wall (left)
  for (let h = 0; h < 1.5; h += 0.3) c.line(...P(0, 0, h), ...P(0, V, h), "2")
  quad([P(0, 2.6, 1.3), P(0, 3.1, 1.3), P(0, 3.1, 1.9), P(0, 2.6, 1.9)], "7")                           // the calendar
  // the stove against the left wall, its pots, the steam
  quad([P(0, 3.4, 0.9), P(0.7, 3.4, 0.9), P(0.7, V, 0.9), P(0, V, 0.9)], "5"); quad([P(0.7, 3.4, 0), P(0.7, V, 0), P(0.7, V, 0.9), P(0.7, 3.4, 0.9)], "4")
  for (const v of [3.8, 4.6]) { const [x, y] = P(0.35, v, 1.25); c.rect(x - 6, y, 12, 9, "6"); c.rect(x - 5, y - 2, 10, 4, "1") }
  { const [x, y] = P(0.35, 4.6, 1.3); steam(c, x, y, 70, 10) }
  // the counter along the window wall
  const box = (u0, v0, du, dv, h, top, front, side) => {
    quad([P(u0, v0 + dv), P(u0 + du, v0 + dv), P(u0 + du, v0 + dv, h), P(u0, v0 + dv, h)], front)
    quad([P(u0 + du, v0), P(u0 + du, v0 + dv), P(u0 + du, v0 + dv, h), P(u0 + du, v0, h)], side)
    quad([P(u0, v0, h), P(u0 + du, v0, h), P(u0 + du, v0 + dv, h), P(u0, v0 + dv, h)], top)
  }
  // the people behind the counter first: Ines facing us, two others
  const stand = (u, v, body, head, h = 1.72) => { const [x, y] = P(u, v); person(c, x, y, Math.round(h * 18), body, head) }
  stand(1.6, 1.7, "2", "3"); stand(2.9, 1.8, "8", "4"); stand(4.4, 1.7, "2", "3")
  box(0.9, 2.2, 4.4, 0.6, 1.08, "7", "4", "5")
  { const [x, y] = P(2.9, 2.35, 1.1); c.rect(x - 3, y - 2, 6, 3, "8"); c.rect(x + 4, y - 1, 4, 2, "9") }   // her bowl, her napkin
  for (const u of [2.0, 4.0]) { const [x, y] = P(u, 2.5, 2.25); c.vline(x, y - 30, 30, "4"); c.rect(x - 4, y, 9, 3, "9") }   // the lamps
  // the cook in front of the counter, his back to us
  { const [x, y] = P(2.5, 3.5); person(c, x, y, 31, "6", "1", 11); c.rect(x - 3, y - 33, 6, 3, "9") }
}, label("I  ISO"))
