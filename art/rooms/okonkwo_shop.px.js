// Okonkwo's corner shop in Jade Row from inside, painted (kapitel1-design §9; the user approved its blocks on 2026-11-09 and chose a side
// view over iso). A stage seen from the window, as CAM 07V sees it across the lane (one place, one picture): the back wall straight on,
// the side walls narrow at the edges, the floorboards running back to the wall. The block's measures are kept (game/places.js holds the
// walk area, the spots and the hotspots on them).
//
//   okonkwo_shop_bg       320x180: the room. Left to right on the back wall: the drinks fridge in its cold light, sacks of rice, the
//                         shelves (rice, batteries, cigarettes, noodle cups, each with a price on paper), the family's photograph (the beach
//                         before the flood, the old city dry behind them), the store room's door with its worn mat. The flood's line runs
//                         across the wall at knee height, painted over and showing through. The door to the lane in the left side wall,
//                         open, the lane's magenta and the rain in it; the window behind us throws the lane's neon in panes on the floor's
//                         front. A bare bulb over the counter is the room's light: warm, falling off into the corners.
//   okonkwo_shop_counter  the counter, a prop (pivot bottom, its foot the front's: Okonkwo, further back, is drawn behind it): worn wood
//                         in panels, on its top the old register (its keys toward him, its customer display on a stalk toward the window
//                         and us, the safe under the counter wired to it), his ledger and pencil, a jar of sweets.
// Light: the bulb at BULB, its pool on the wall and the floor dithered off (the style guide allows dither only for light's falloff);
// the fridge's cyan and the lane's magenta only near their sources.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  b: "#1d1820", B: "#30252a", d: "#4a3631", D: "#6b4e3c", E: "#93704c", F: "#c09a66",     // old plaster in the bulb's light
  l: "#1e1316", L: "#33201d", o: "#4d2f22", p: "#6e4429", J: "#94603a",                   // worn wood
  K: "#c8b48c",                                                                           // paper: price tags, the ledger
})

const W = 320, H = 180
const SHOP = { back: [40, 280], top: 24, foot: 108 }
const BULB = [166, 42]
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
const dz = (x, y) => (BAYER[y & 3][x & 3] + 0.5) / 16
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const hash = (a, b, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
/** a tone of a ramp (keys dark to light) for a light level 0..1, dithered between its steps */
const tone = (ramp, v, x, y) => ramp[clamp(Math.floor(clamp(v, 0, 1) * (ramp.length - 1) + dz(x, y)), 0, ramp.length - 1)]
/** the bulb's light at a point: bright under it, falling off into the corners */
let BULB_ON = 1                                                 // (0.1 in Chapter 2's dark shop: only what the lane throws in)
const bulb = (x, y, r = 130) => BULB_ON / (1 + (Math.hypot(x - BULB[0], (y - BULB[1]) * 1.15) / r) ** 2 * 2.4)
const fridgeLight = (x, y) => Math.max(0, 1 - Math.hypot(x - 61, (y - 82) * 0.9) / 46)

const WALL = ["k", "b", "B", "d", "D", "E", "F"]
const WOOD = ["k", "l", "L", "o", "p", "J"]
const FLOOR = ["k", "e", "a", "A", "o", "p"]
const CYAN_WALL = ["k", "c", "c", "C"]
const CYAN_FLOOR = ["k", "e", "t", "T"]
const MAG_FLOOR = ["e", "i", "i", "I", "M"]

/** the room; dark: after the raid (Chapter 2, K1b sold), the bulb out, half the goods gone, a sack left */
const paintShop = (c, dark) => {
  BULB_ON = dark ? 0.1 : 1
  const [L, R] = SHOP.back, T = SHOP.top, F = SHOP.foot
  const sideCeil = (x) => { const d = x < L ? (L - x) / L : (x - R) / (W - R); return T - 16 * d }
  const sideFloor = (x) => { const d = x < L ? (L - x) / L : (x - R) / (W - R); return F + 16 * d }

  // ---- the ceiling: dark boards, the bulb's light reaching it a little
  for (let x = 0; x < W; x++) for (let y = 0; y < (x >= L && x < R ? T : Math.round(sideCeil(x))); y++)
    c.px(x, y, tone(["k", "1", "b", "B"], 0.15 + bulb(x, y, 70) * 0.9 - (x % 24 === 0 ? 0.2 : 0), x, y))
  // ---- the back wall: plaster in the bulb's light, a damp patch, the flood's line painted over, the skirting
  for (let y = T; y < F; y++) for (let x = L; x < R; x++) {
    let v = 0.1 + bulb(x, y) * 1.0
    if (Math.abs(y - 88) < 1) v -= 0.22                                                     // the flood's line, showing through
    if (y > 88 && y < 105) v -= 0.06                                                         // below it the plaster was redone, darker
    if (Math.hypot((x - 92) / 1.4, y - 40) < 12 + hash(x >> 2, y >> 2) * 3) v -= 0.08         // a damp patch in the corner over the sacks
    c.px(x, y, fridgeLight(x, y) > 0.55 + dz(x, y) * 0.45 ? tone(CYAN_WALL, v + fridgeLight(x, y) * 0.5, x, y) : tone(WALL, v, x, y))
  }
  for (let x = L; x < R; x++) { c.px(x, F - 3, tone(WOOD, 0.2 + bulb(x, F) * 0.6, x, F)); c.px(x, F - 2, tone(WOOD, 0.1 + bulb(x, F) * 0.4, x, F)); c.px(x, F - 1, "l") }
  // the corners where the side walls meet the back wall
  c.vline(L - 1, T, F - T, "k"); c.vline(R, T, F - T, "k")
  // ---- the side walls: the same plaster turned away from the bulb, darker
  for (let x = 0; x < W; x++) {
    if (x >= L && x < R) continue
    for (let y = Math.round(sideCeil(x)); y < Math.round(sideFloor(x)); y++) {
      const v = 0.08 + bulb(x, y) * 0.55
      c.px(x, y, tone(WALL, v, x, y))
    }
    c.px(x, Math.round(sideFloor(x)) - 1, "l")
  }
  // ---- the floor: old boards running back to the wall, worn pale where people stand at the counter, the bulb's pool on them
  for (let y = F; y < H; y++) for (let x = 0; x < W; x++) {
    if (y < sideFloor(x)) continue
    const depth = (y - 60) / (H - 60), u = 160 + (x - 160) / depth             // where along the front this board runs
    const seam = Math.abs(((u % 22) + 22) % 22) < 1.4 / depth * 0.6
    const joint = Math.abs(((y * 1.0 + (Math.floor(u / 22) * 37) % 50) % 50)) < 1 && y > 118
    let v = 0.08 + bulb(x, y, 120) * 0.9 + (Math.hypot((x - 170) / 2.4, y - 138) < 20 ? 0.07 : 0)
    if (seam) v -= 0.16
    let k = tone(FLOOR, v, x, y)
    const fl = fridgeLight(x, y - 12) * 1.2
    if (fl > 0.45 + dz(x, y) * 0.5) k = tone(CYAN_FLOOR, v + fl * 0.4, x, y)
    c.px(x, y, k)
  }
  // the window behind us: the lane's neon in panes on the floor's front, the frame's shadow between them
  for (const [x0, w] of [[24, 74], [104, 74], [184, 74], [264, 60]]) for (let y = 158; y < H; y++) {
    const s = (y - 158) * 0.35
    for (let x = Math.round(x0 - s); x < x0 + w - s; x++) {
      if (x < 0 || x >= W) continue
      const edge = Math.min(x - (x0 - s), x0 + w - s - x, y - 158)
      const v = 0.15 + Math.min(edge, 10) / 10 * 0.3 + (y - 158) / 50
      const depth = (y - 60) / (H - 60), u = 160 + (x - 160) / depth, seam = Math.abs(((u % 22) + 22) % 22) < 0.9
      if (edge > dz(x, y) * 4 - 1 && (y - 158) / 22 + 0.15 > dz(x, y)) c.px(x, y, tone(MAG_FLOOR, seam ? v - 0.25 : v, x, y))
    }
  }

  // ---- the door to the lane in the left side wall, open: the lane's magenta and the rain in it
  for (let x = 6; x < 30; x++) {
    const d = (L - x) / L, fl = Math.round(F + 16 * d), ce = Math.round(T - 16 * d), top = Math.round(fl - 0.78 * (fl - ce))
    for (let y = top; y < fl; y++) {
      let k
      if (x < 8 || x > 27 || y < top + 2) k = x < 8 ? "L" : "o"                                // the frame
      else {
        const sky = (y - top) / (fl - top)
        k = tone(["n", "n", "i", "M"], 0.25 + sky * 0.4 + (Math.abs(y - (70 + (x - 9) / 3)) < 1.5 ? 0.6 : 0), x, y)
        if ((x * 3 + y * 7) % 23 === 0 && y < fl - 4) k = "I"                                  // rain in the lane's light
        if (y > fl - 6) k = tone(["n", "i", "I", "M"], 0.5 + (x % 3) * 0.15, x, y)             // the lane's wet floor
      }
      c.px(x, y, k)
    }
  }
  for (let x = 10; x < 26; x++) c.px(x, 70 + Math.round((x - 9) / 3), "m")                    // the neon sign across the lane, seen through it
  // the door's light falling in on the floor
  for (let y = 120; y < 150; y++) for (let x = 2; x < 60; x++) {
    const v = 1 - Math.hypot((x - 20) / 2.2, y - 122) / 16
    if (v > dz(x, y) && y >= sideFloor(x)) c.px(x, y, v > 0.7 ? "I" : "i")
  }

  // ---- the drinks fridge: its glass door, cans and bottles in rows, the cold light, a sticker
  const [fx, fy, fw, fh] = [46, 50, 30, 58]
  c.rect(fx, fy, fw, fh, "k"); c.rect(fx + 1, fy + 1, fw - 2, fh - 2, "4"); c.rect(fx + 1, fy + 1, fw - 2, 3, "5")
  c.rect(fx + 3, fy + 5, fw - 6, fh - 10, "c")
  for (const y of [fy + 17, fy + 29, fy + 41]) c.hline(fx + 3, y, fw - 6, "C")
  const CANS = ["v", "q", "V", "Q", "m", "v", "C"]
  for (let r = 0; r < 4; r++) for (let i = 0; i < 5; i++) {
    const x = fx + 4 + i * 5, y = fy + 8 + r * 12, k = CANS[(i * 3 + r * 5) % CANS.length]
    if (r === 3 && i > 2) continue                                                              // the last row sold out
    if (dark && hash(i, r, 3) < 0.55) continue                                                  // (taken)
    c.rect(x, y, 3, 8, k); c.px(x, y, "V"); c.vline(x + 2, y + 1, 7, k === "V" ? "v" : "k")
  }
  c.vline(fx + fw - 4, fy + 22, 10, "6")                                                        // the handle
  c.rect(fx + 2, fy + fh - 4, fw - 4, 2, "3")                                                   // the grille at its foot
  c.rect(fx + 6, fy - 4, 18, 4, "C"); c.hline(fx + 7, fy - 3, 16, "v")                          // its lit sign on top

  // ---- sacks of rice, stacked, slumped: cloth, a printed band, tied at the top
  for (const [x, y, w, h] of dark ? [[93, 95, 13, 13]] : [[79, 94, 14, 14], [93, 95, 13, 13], [85, 83, 14, 13]]) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const e = Math.hypot((i - (w - 1) / 2) / (w / 2), (j - h * 0.55) / (h * 0.62))
      if (e > 1.05 && j < h - 2) continue
      c.px(x + i, y + j, e > 0.92 ? "k" : tone(["k", "h", "K", "H"], 0.45 + bulb(x + i, y + j) * 0.7 - (i / w) * 0.25 - j / h * 0.2, x + i, y + j))
    }
    c.hline(x + 2, y + 8, w - 4, "4"); c.px(x + (w >> 1), y + 9, "5"); c.rect(x + (w >> 1) - 1, y, 3, 2, "o")   // the printed band, the tie
  }

  // ---- the shelves behind the counter: four boards of goods, each with its price on paper
  const [sx, sy, sw, sh] = [102, 32, 112, 66]
  for (let y = sy; y < sy + sh; y++) for (let x = sx; x < sx + sw; x++) c.px(x, y, tone(WOOD, 0.05 + bulb(x, y) * 0.35, x, y))
  c.vline(sx, sy, sh, "l"); c.vline(sx + sw - 1, sy, sh, "l")
  const GOODS = [
    (x, y, i) => { c.rect(x, y + 2, 5, 9, "H"); c.rect(x, y + 2, 5, 2, "h"); c.rect(x + 1, y + 6, 3, 2, "r") },                       // rice in bags
    (x, y, i) => { c.rect(x, y + 4, 5, 7, i % 2 ? "C" : "c"); c.rect(x + 1, y + 5, 3, 2, "v"); c.px(x + 2, y + 9, "q") },             // batteries on cards
    (x, y, i) => { c.rect(x, y + 5, 5, 6, "H"); c.hline(x, y + 7, 5, "r"); c.px(x + 4, y + 5, "h") },                               // cigarettes, cartons
    (x, y, i) => { c.rect(x, y + 3, 5, 8, "Q"); c.rect(x, y + 3, 5, 2, "W"); c.rect(x + 1, y + 6, 3, 3, "P") },                        // noodle cups
  ]
  for (let b = 0; b < 4; b++) {
    const y = sy + 2 + b * 16
    for (let x = sx + 3; x < sx + sw - 6; x += 6) {
      if (hash(x, b, 5) < (dark ? 0.55 : 0.12)) continue                                         // a gap where something sold (or was taken)
      GOODS[(b + (x > 158 ? 1 : 0) + (hash(x, b) < 0.15 ? 2 : 0)) % 4](x, y, x)
    }
    for (let x = sx + 1; x < sx + sw - 1; x++) { c.px(x, y + 11, tone(WOOD, 0.35 + bulb(x, y) * 0.5, x, y)); c.px(x, y + 12, "J"); c.px(x, y + 13, "l") }
    for (let x = sx + 8; x < sx + sw - 8; x += 18 + (b * 5) % 7) c.rect(x, y + 12, 3, 2, "K")     // the prices on paper
  }

  // ---- the family's photograph: the beach before the flood, the old city dry behind them
  const [px, py] = [222, 50]
  c.rect(px, py, 18, 16, "o"); c.rect(px + 1, py + 1, 16, 14, "J")
  c.rect(px + 2, py + 2, 14, 5, "6"); c.rect(px + 2, py + 5, 14, 1, "5")                        // the sky, the old city's skyline
  for (const [x, h] of [[3, 2], [5, 3], [8, 1], [10, 2], [13, 3]]) c.vline(px + x, py + 5 - h, h, "4")
  c.rect(px + 2, py + 7, 14, 2, "C"); c.rect(px + 2, py + 9, 14, 5, "R")                        // the sea, the sand
  for (const [x, h, k] of [[5, 5, "s"], [8, 6, "s"], [11, 3, "S"]]) { c.vline(px + x, py + 13 - h, h, k); c.px(px + x, py + 13 - h, "k") }
  c.hline(px, py + 16, 18, "k")

  // ---- the store room's door: worn paint, a PRIVATE plate, the mat worn through before it
  const [dx, dy, dw, dh] = [248, 48, 28, 60]
  for (let y = dy; y < dy + dh; y++) for (let x = dx; x < dx + dw; x++) {
    const frame = x < dx + 2 || x >= dx + dw - 2 || y < dy + 2
    const panel = !frame && ((y > dy + 6 && y < dy + 26) || (y > dy + 32 && y < dy + dh - 6)) && x > dx + 5 && x < dx + dw - 6
    let v = 0.1 + bulb(x, y) * 0.75 + (frame ? -0.1 : 0) + (panel ? 0.06 : 0)
    if (hash(x >> 1, y >> 2, 9) < 0.06 && !frame) v += 0.12                                     // paint gone, the wood under it
    c.px(x, y, tone(frame ? WOOD : ["k", "3", "4", "5", "6"], v, x, y))
  }
  c.rect(dx + 21, dy + 30, 2, 3, "G")                                                           // the handle
  c.rect(dx + 9, dy + 11, 10, 5, "K"); c.hline(dx + 11, dy + 13, 6, "r")
  for (let y = F; y < F + 4; y++) for (let x = dx - 2; x < dx + dw + 2; x++) c.px(x, y, (x + y) % 3 && hash(x, y, 2) > 0.2 ? "Z" : "z")

  // ---- the bare bulb over the counter, warm, its cord from the ceiling
  c.vline(BULB[0], 0, BULB[1] - 4, "k"); c.vline(BULB[0] + 1, 0, BULB[1] - 4, "1")
  c.rect(BULB[0] - 1, BULB[1] - 4, 4, 2, "2")
  if (dark) { c.rect(BULB[0] - 2, BULB[1] - 2, 6, 4, "3"); c.rect(BULB[0] - 1, BULB[1] - 2, 2, 2, "5") }                   // out
  else { c.rect(BULB[0] - 2, BULB[1] - 2, 6, 4, "R"); c.rect(BULB[0] - 1, BULB[1] - 2, 4, 3, "W"); c.hline(BULB[0] - 1, BULB[1] + 2, 4, "Q") }
  BULB_ON = 1
}
scene("okonkwo_shop_bg", { w: W, h: H, bg: "k" }, (c) => paintShop(c, false))
// Chapter 2 after the raid (kapitel2-design §5, K1b sold; its block in art/test/k2_orte_blocks.px.js): what CAM 07V sees across the lane
scene("okonkwo_shop_dunkel", { w: W, h: H, bg: "k" }, (c) => paintShop(c, true))

// the counter across the shop (its foot the front's), the register on it with its display toward us, the ledger, a jar of sweets.
// Drawn where it stands: x from 108, y from 70 in the room (BULB in the room's coordinates)
const paintCounter = (c, dark) => {
  BULB_ON = dark ? 0.1 : 1
  const OX = 108, OY = 70, lit = (x, y) => bulb(x + OX, y + OY, 100)
  // the top, lit by the bulb, worn pale where the goods are pushed across
  for (let y = 20; y < 24; y++) for (let x = 0; x < 126; x++) c.px(x, y, tone(WOOD, 0.35 + lit(x, y) * 0.7 + (Math.abs(x - 58) < 18 && y < 23 ? 0.1 : 0), x + OX, y))
  c.hline(0, 24, 126, "l")
  // the front in panels, darker, turned away from the bulb
  for (let y = 25; y < 55; y++) for (let x = 0; x < 126; x++) {
    const xi = x % 31, inPanel = xi > 3 && xi < 28 && y > 28 && y < 51
    let v = 0.12 + lit(x, y) * 0.4 + (inPanel ? 0.05 : 0) - (y > 51 ? 0.1 : 0)
    if (inPanel && (xi === 4 || y === 29)) v -= 0.12
    if (inPanel && (xi === 27 || y === 50)) v += 0.1
    if (hash(x, y >> 1, 4) < 0.04) v -= 0.1                                                     // scuffs from shoes and bags
    c.px(x, y, tone(WOOD, v, x + OX, y + OY))
  }
  for (const x of [31, 62, 93]) c.vline(x, 25, 30, "l")
  // the ledger, open, the pencil on it
  c.rect(30, 17, 16, 4, "K"); c.vline(38, 17, 4, "h"); for (let i = 0; i < 3; i++) c.hline(31, 18 + i, 5, "G")
  c.line(40, 18, 46, 16, "Q")
  // a jar of sweets
  c.rect(12, 13, 6, 8, "h"); c.rect(13, 14, 4, 6, "H"); for (const [x, y, k] of [[13, 17, "q"], [15, 18, "Q"], [14, 15, "m"], [16, 16, "v"]]) c.px(x, y, k)
  c.rect(12, 12, 6, 2, "6")
  BULB_ON = 1
  if (dark) { c.rect(92, 19, 28, 2, "l"); c.rect(100, 18, 6, 1, "L"); return }                   // the register gone, its cable cut, a pale square where it stood
  // the register: its body, the keys toward him, the drawer
  c.rect(92, 12, 28, 8, "5"); c.rect(92, 12, 28, 2, "6"); c.hline(92, 19, 28, "3"); c.rect(94, 15, 24, 3, "4")
  for (let x = 95; x < 117; x += 3) c.px(x, 13, "G")
  // its customer display on a stalk, toward the window and us: the code shows on it at one
  c.rect(104, 8, 2, 4, "3")
  c.rect(96, 0, 18, 9, "k"); c.rect(97, 1, 16, 7, "2"); c.rect(98, 2, 14, 5, "c")
  for (let x = 99; x < 111; x += 3) { c.rect(x, 3, 2, 3, "v") }
  c.px(97, 1, "V")
}
sprite("okonkwo_shop_counter", { w: 126, h: 55, pivot: "bottom", outline: "k" }, (c) => paintCounter(c, false))
sprite("okonkwo_shop_counter_dunkel", { w: 126, h: 55, pivot: "bottom", outline: "k" }, (c) => paintCounter(c, true))

// the planks nailed across the window, as CAM 07V sees them from across the lane (on the approved block's lines, run on to the picture's
// left edge): raw pine lit by the machine's own lamp, the top edge brightest, the lower in shadow, a nail where each crosses a mullion
sprite("okonkwo_shop_bretter", { w: W, h: H }, (c) => {
  for (const [y0, y1] of [[30, 44], [70, 62], [104, 112]]) {
    const at = (x) => y0 + (y1 - y0) * (x - 78) / (W - 78)
    for (let x = 0; x < W; x++) {
      const t = Math.round(at(x))
      c.px(x, t - 1, "k"); c.px(x, t, "K"); c.px(x, t + 1, "F"); c.px(x, t + 2, hash(x >> 3, y0) < 0.2 ? "E" : "F"); c.px(x, t + 3, "E"); c.px(x, t + 4, "D"); c.px(x, t + 5, "o"); c.px(x, t + 6, "k")
      if (hash(x, y0, 7) < 0.04) c.px(x, t + 2, "D")                                            // a knot in the grain
    }
    for (const x of [10, 104, 184, 264, 312]) { const t = Math.round(at(x)); c.px(x, t + 2, "G"); c.px(x, t + 3, "6") }   // the nails
  }
})
