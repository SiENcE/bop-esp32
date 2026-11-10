// Sable's booth on the Drain Market as a stage seen from the front (the user's decision, 2026-11-10: as the old block, not iso, so Sable
// sits facing whoever comes in and the price list reads; style guide §4 allows a stage where it tells it better). BLOCKS, 320x180, for
// the user's approval before painting. A niche in the drained flood channel behind a curtain (kapitel1-design §9: violet and amber,
// smoke; story §10: the booth stays violet and amber so Sable's magenta stands out of it).
//
// One weak vanishing point (VP): the back wall at about 26 px a meter, the strip where Juno walks at about 30, her own scale (style
// guide §4), so she needs no scaling. The back wall hung with violet cloth; in front of it Sable's steel desk (a sprite of its own,
// sable_booth_desk, drawn over Sable, who sits behind it), the old screens stacked at its left end, a laptop at its right; over Sable
// the amber lamp on its cord; the price list on the cloth to the right; a steel shelf of goods to the left; crates in the right corner
// and the cage with the wire bird hanging on its chain in front of the right side wall. The left side wall is the channel's bare
// concrete with the old tide mark and the curtain to the market in it, the market's neon leaking past its edge. Over all of it the
// channel's low ceiling. A worn rug where customers stand.
//
// Places and hotspot shapes: game/places.js (sable_booth), from the numbers here.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")

const SB = (() => {
  const W = 320, H = 180
  // the back wall's rect, the vanishing point, the side walls' edges at the screen's sides
  const BX0 = 34, BX1 = 286, BTOP = 58, BFOOT = 126, VP = [160, 79]
  const atEdge = (x, y, ex) => { const t = (ex - VP[0]) / (x - VP[0]); return VP[1] + (y - VP[1]) * t }
  const LTOP = atEdge(BX0, BTOP, 0), LFOOT = atEdge(BX0, BFOOT, 0)        // the left wall at x 0
  const RTOP = atEdge(BX1, BTOP, W), RFOOT = atEdge(BX1, BFOOT, W)        // the right wall at x 320

  /** fill a polygon (flat [x, y, ...]) with a key, or with a function of (x, y) */
  const fill = (c, pts, k) => {
    const n = pts.length / 2
    let y0 = Infinity, y1 = -Infinity
    for (let i = 0; i < n; i++) { y0 = Math.min(y0, pts[i * 2 + 1]); y1 = Math.max(y1, pts[i * 2 + 1]) }
    for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(H - 1, Math.ceil(y1)); y++) {
      const xs = []
      for (let i = 0; i < n; i++) {
        const ax = pts[i * 2], ay = pts[i * 2 + 1], bx = pts[((i + 1) % n) * 2], by = pts[((i + 1) % n) * 2 + 1]
        if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax))
      }
      xs.sort((a, b) => a - b)
      for (let j = 0; j + 1 < xs.length; j += 2) for (let x = Math.ceil(xs[j] - 0.5); x <= Math.floor(xs[j + 1] - 0.5); x++) {
        if (x < 0 || x >= W) continue
        const key = typeof k === "function" ? k(x, y) : k
        if (key) c.px(x, y, key)
      }
    }
  }
  // the left side wall at x (0..BX0): its floor and ceiling lines
  const leftFloor = (x) => LFOOT + (BFOOT - LFOOT) * (x / BX0), leftCeil = (x) => LTOP + (BTOP - LTOP) * (x / BX0)
  // the curtain on the left wall: from x 6 to 28, 2.1 m of the wall's 2.6
  const CUR = [6, 28], curTop = (x) => leftFloor(x) - (leftFloor(x) - leftCeil(x)) * (2.1 / 2.6)
  const CURTAIN = [CUR[0], Math.round(curTop(CUR[0])), CUR[1], Math.round(curTop(CUR[1])), CUR[1], Math.round(leftFloor(CUR[1])), CUR[0], Math.round(leftFloor(CUR[0]))]

  function room(c) {
    // the channel's low ceiling, toward us: concrete, a pipe running back along it
    fill(c, [0, 0, W, 0, W, RTOP, BX1, BTOP, BX0, BTOP, 0, LTOP], (x, y) => (y < 6 ? "e" : "1"))
    c.line(118, 0, 132, BTOP - 1, "3"); c.line(119, 0, 133, BTOP - 1, "2")
    // the side walls: the channel's bare concrete, the old tide mark across them at 1.6 m
    const tide = (x, y, foot, ceil) => { const h = (foot - y) / (foot - ceil) * 2.6; return Math.abs(h - 1.6) < 0.05 ? "2" : h < 0.08 ? "1" : "3" }
    fill(c, [0, LTOP, BX0, BTOP, BX0, BFOOT, 0, LFOOT], (x, y) => tide(x, y, leftFloor(x), leftCeil(x)))
    fill(c, [BX1, BTOP, W, RTOP, W, RFOOT, BX1, BFOOT], (x, y) => tide(x, y, BFOOT + (RFOOT - BFOOT) * ((x - BX1) / (W - BX1)), BTOP + (RTOP - BTOP) * ((x - BX1) / (W - BX1))))
    // the back wall hung with violet cloth in folds, from a rail under the ceiling
    fill(c, [BX0, BTOP, BX1, BTOP, BX1, BFOOT, BX0, BFOOT], (x, y) => (y === BFOOT - 1 ? "1" : (x % 9) < 4 ? "U" : "u"))
    c.hline(BX0, BTOP, BX1 - BX0, "4")
    // the floor: concrete, its slab joints running to the VP; the rug where customers stand
    fill(c, [BX0, BFOOT, BX1, BFOOT, W, RFOOT, W, H, 0, H, 0, LFOOT], "2")
    for (const fx of [-100, 100]) c.line(160 + fx * 0.6, BFOOT, 160 + fx * 2.4, H - 1, "1")
    fill(c, [104, 146, 216, 146, 230, 172, 90, 172], (x, y) => (y === 146 || y === 171 || x < 96 + (y - 146) * -0.25 + 2 ? "O" : "a"))
    // the curtain to the market: heavy and dark, its folds; the market's magenta leaking past its front edge
    fill(c, CURTAIN, (x, y) => (x === CUR[1] - 1 ? "m" : (x % 4) < 2 ? "O" : "a"))
    // the shelf of goods against the back wall, left: steel, three boards, boxes, phones, a radio
    c.rect(42, 70, 64, 56, "1"); for (const y of [70, 88, 106, 124]) c.rect(42, y, 64, 2, "4")
    c.rect(46, 78, 14, 10, "P"); c.rect(62, 80, 10, 8, "5"); c.rect(76, 76, 18, 12, "O"); c.rect(96, 82, 8, 6, "6")
    c.rect(46, 96, 8, 10, "g"); c.rect(56, 98, 8, 8, "g"); c.rect(68, 94, 22, 12, "4"); c.px(86, 97, "q"); c.rect(92, 97, 10, 9, "P")
    c.rect(46, 114, 20, 10, "O"); c.rect(70, 116, 30, 8, "5")
    // the price list on the cloth to the right, amber letters on a black board
    c.rect(196, 62, 74, 25, "k"); c.rect(197, 63, 72, 23, "1")
    TXT.draw(c, 233, 65, "NAMES 50.", "Q", { font: "hud", align: "center" })
    TXT.draw(c, 233, 72, "ADDRESSES 80.", "Q", { font: "hud", align: "center" })
    TXT.draw(c, 233, 79, "SECRETS: ASK.", "Q", { font: "hud", align: "center" })
    // the crates in the right corner, what Sable bought
    c.rect(238, 104, 44, 22, "O"); c.rect(240, 106, 40, 2, "P"); c.rect(244, 90, 32, 14, "P"); c.rect(246, 92, 28, 2, "Q")
    // the lamp over the desk on its cord from the ceiling, its shade, its warm pool on the cloth behind Sable
    c.vline(160, 0, 64, "1"); fill(c, [152, 64, 168, 64, 172, 71, 148, 71], "P"); c.hline(150, 71, 20, "R")
    // the cage on its chain in front of the right wall, the wire bird on its perch
    c.vline(286, 0, 70, "4")
    c.rect(272, 70, 28, 36, "k"); c.rect(273, 71, 26, 34, "1")
    for (let x = 274; x < 299; x += 3) c.vline(x, 71, 34, "G")
    c.hline(272, 70, 28, "G"); c.hline(272, 105, 28, "G"); c.hline(276, 92, 20, "4")
    c.rect(280, 84, 10, 7, "g"); c.rect(288, 82, 4, 4, "g"); c.px(290, 83, "v")
  }

  /** Sable's desk with its screens: drawn over Sable, who sits behind it (sprite sable_booth_desk at DESK_AT, baseline DESK_BASE) */
  const DESK_AT = [112, 76], DESK_BASE = 141
  function desk(c) {
    const X = (x) => x - DESK_AT[0], Y = (y) => y - DESK_AT[1]
    c.rect(X(116), Y(112), 88, 5, "5")                                // the top, seen from a little above
    c.rect(X(118), Y(117), 84, 23, "3"); c.hline(X(118), Y(117), 84, "4"); c.hline(X(118), Y(139), 84, "1")
    c.rect(X(124), Y(124), 30, 2, "2"); c.rect(X(166), Y(124), 30, 2, "2")
    // the old screens stacked at its left end, facing the room
    const crt = (x, y, w, h) => { c.rect(X(x), Y(y), w, h, "k"); c.rect(X(x) + 1, Y(y) + 1, w - 2, h - 2, "2"); c.rect(X(x) + 3, Y(y) + 3, w - 6, h - 6, "C"); for (let j = 4; j < h - 3; j += 2) c.hline(X(x) + 3, Y(y) + j, w - 6, "v") }
    crt(120, 95, 28, 18); crt(124, 79, 22, 17)
    // the laptop at its right end, its lid toward us (Sable reads it), a pale sticker on the lid
    c.rect(X(176), Y(99), 22, 13, "k"); c.rect(X(177), Y(100), 20, 11, "2"); c.rect(X(185), Y(104), 4, 3, "h")
  }
  return { W, H, room, desk, DESK_AT, DESK_BASE, CURTAIN }
})()

scene("sable_booth_bg", { w: SB.W, h: SB.H, bg: "k" }, SB.room)
sprite("sable_booth_desk", { w: 96, h: 66 }, SB.desk)
console.log("SABLE_BOOTH " + JSON.stringify({ curtain: SB.CURTAIN, deskAt: SB.DESK_AT, deskBase: SB.DESK_BASE }))
