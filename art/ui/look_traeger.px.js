// The close-up "look_traeger" (game/stadt.js, moment "traeger"; kapitel1-design "Die weißen Träger"): Thursday 23:30, Kowalski
// Street, the house opposite. Painted on the lines of the block the user chose, the close framing B of
// art/mockups/look_traeger_blocks.px.js (2026-11-13), with the carriers of variant A and the girl of variant A of
// art/test/traeger_blocks.px.js and the short van of the user's sketch: the van's white back on the left, its rear door swung open and
// the cold light inside; the stretcher across the middle, the sleeping man on it, his face up, the oval Lull patch behind his ear; the
// two carriers in white coveralls with close hoods, the soft masks pulled down under their chins, white gloves, a small cyan clip on the
// chest, friendly, the one behind turned to Juno with a quiet smile; his daughter in the lit door behind him, in her pyjamas under her
// father's work jacket, barefoot, her slate lit in her hand; the blinds above going down; rain slanting through the light. "Weiß hält
// hier unten keinen Tag": the white is the only clean thing, it glows against the wet dark.
// 170x112, drawn by game/screens.js at its own size in the interface's frame.
include("../lib/iso.js", { palette: true })
pal({
  L: "#eef3f8",                 // the clinic white, lit (H its shade, h its dark side)
  E: "#a8c4ec", D: "#5a78a8",   // the Lull patch: pale blue, its rim
  p: "#6b4430",                 // a second skin, darker
  b: "#3a4433", B: "#566447",   // the father's work jacket: olive, its lit side
  d: "#8a9ab8",                 // the pyjamas' pale stripe
})

{
  const W = 170, H = 112, R = Math.round, bay = ISO.bay

  /** a key buffer: shapes drawn flat, then the glow and the wet street's mirror worked on it, then put on a canvas */
  function buffer() {
    const g = Array.from({ length: H }, () => Array(W).fill("2"))
    const b = {
      g,
      px(x, y, k) { x = R(x); y = R(y); if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = k },
      get(x, y) { return x >= 0 && y >= 0 && x < W && y < H ? g[y][x] : null },
      rect(x, y, w, h, k) { for (let j = R(y); j < R(y + h); j++) for (let i = R(x); i < R(x + w); i++) b.px(i, j, k) },
      ell(cx, cy, rx, ry, k) {
        for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++) for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++)
          if (((i + 0.5 - cx - 0.5) / (rx + 0.35)) ** 2 + ((j + 0.5 - cy - 0.5) / (ry + 0.35)) ** 2 <= 1) b.px(i, j, k)
      },
      poly(pts, k) {
        const ys = pts.filter((_, i) => i % 2).map(Number)
        for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
          const xs = [], yc = y + 0.5
          for (let i = 0; i < pts.length; i += 2) {
            const x0 = pts[i], y0 = pts[i + 1], x1 = pts[(i + 2) % pts.length], y1 = pts[(i + 3) % pts.length]
            if ((y0 <= yc && y1 > yc) || (y1 <= yc && y0 > yc)) xs.push(x0 + (yc - y0) * (x1 - x0) / (y1 - y0))
          }
          xs.sort((p, q) => p - q)
          for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) b.px(x, y, k)
        }
      },
      line(x0, y0, x1, y1, k) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let s = 0; s <= n; s++) b.px(x0 + (x1 - x0) * s / n, y0 + (y1 - y0) * s / n, k) },
      /** the white's glow: a dithered ring round every white pixel, on the dark only */
      glow(white = "LH", dark = "23efzZ", rings = ["4", "3"]) {
        const add = []
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          if (!dark.includes(g[y][x])) continue
          let d = 9
          for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (white.includes(b.get(x + i, y + j) ?? ".")) d = Math.min(d, Math.max(Math.abs(i), Math.abs(j)))
          if (d === 1) add.push([x, y, rings[0]])
          else if (d === 2 && "12ef".includes(g[y][x])) add.push([x, y, rings[1]])
        }
        for (const [x, y, k] of add) g[y][x] = k
      },
      /** the wet street: rows above the line `at` mirrored below it, in the street's own darker keys, between x0 and x1 */
      mirror(at, y0, y1, x0, x1, map, ground) {
        for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
          const src = b.get(x, 2 * at - y), k = src && map[src]
          if (k && ground.includes(g[y][x]) && (y - y0) % 2 === 0 && bay(x, y) < 0.8 - (y - y0) / (y1 - y0)) g[y][x] = k
        }
      },
      to(c, ox = 0, oy = 0) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(ox + x, oy + y, g[y][x]) },
    }
    return b
  }
  const WET = { L: "x", H: "w", V: "x", Q: "P", R: "Q", P: "O", A: "a", S: "a", s: "a", p: "a", "5": "Z", h: "w" }


  /** one in white (variant A: a coverall, its hood close round the face, the soft mask pulled under the chin, white gloves, a cyan
   *  clip on the chest), his feet's centre at (fx, fy), `h` px tall; dir -1 walks left; `turn` his face to Juno; `hands` "back" or
   *  "front" (where the stretcher's handle is) */
  function carrier(b, fx, fy, h, o = {}) {
    const s = h / 32, d = o.dir ?? -1, skin = o.skin ?? "S", side = d < 0 ? 1 : -1
    const r = (x, y, w, hh, k) => { const a = d < 0 ? x : -x - w; b.rect(fx + a * s, fy + y * s, Math.max(1, w * s), Math.max(1, hh * s), k) }
    const at = (x, y, k) => b.px(fx + (d < 0 ? x : -x) * s, fy + y * s, k)
    // the overshoes, the legs in a stride (the far one in the white's shade), a crease at the knee
    r(-6, -2, 4, 2, "H"); r(2, -2, 4, 2, "h"); r(-6, -1, 4, 1, "h")
    r(-5, -14, 3, 12, "H"); r(2, -14, 3, 12, "h"); r(-5, -8, 3, 0.6, "h")
    // the coverall to the hips, its far side in shade, the zip down the middle, a fold at the waist; the cyan clip on the chest
    r(-5, -26, 10, 13, "L"); r(3, -26, 2, 13, "H"); r(-0.3, -25, 0.6, 12, "H"); r(-5, -15, 10, 0.7, "H")
    at(-2.5, -23, "v")
    // the near arm to the handle, the white glove
    if (o.hands === "back") { r(1, -24, 3, 9, "H"); r(2, -16, 4, 2, "L"); r(1, -21, 3, 0.6, "h") }
    else { r(-6, -24, 3, 9, "H"); r(-9, -16, 4, 2, "L"); r(-6, -21, 3, 0.6, "h") }
    // the hood round the head; the face in its opening; the mask pulled down under the chin
    b.ell(fx - 0.5, fy - 30 * s - 0.5, 3.8 * s, 3.8 * s, "L")
    if (o.turn) {
      b.ell(fx - 0.5, fy - 29.4 * s - 0.5, 2.5 * s, 2.7 * s, "H")                             // the hood's rim round the face
      b.ell(fx - 0.5, fy - 29.4 * s - 0.5, 2.0 * s, 2.3 * s, skin)                            // the face, turned to Juno
      at(-1.1, -30.2, "k"); at(1.1, -30.2, "k")                                               // the eyes
      r(-0.9, -28.3, 1.8, 0.55, "s")                                                          // a quiet smile
      r(-2.4, -27.1, 4.8, 1.2, "H"); r(-2.4, -26.5, 4.8, 0.5, "h")                            // the mask under the chin
    } else {
      b.ell(fx - 0.5 - 0.9 * s * side, fy - 29.6 * s - 0.5, 1.9 * s, 2.3 * s, skin)          // the face in profile, toward where he goes
      b.ell(fx - 0.5 + 1.2 * s * side, fy - 30 * s - 0.5, 1.6 * s, 2.8 * s, "H")             // the hood's side over the ear
      at(-2.2, -30.2, "k"); r(-2.8, -28.3, 1.2, 0.5, "s")                                     // an eye, the smile
      r(-3, -27.1, 4, 1.2, "H")                                                               // the mask under the chin
    }
  }

  /** the stretcher from handle x0 to handle x1 at height y; the man on it, his feet toward x0, his head toward x1; `s` the scale
   *  (1: 18 px a metre). His face up, the eyes shut, the Lull patch behind his ear (style guide §6: the oval pale disc, a darker rim,
   *  a brighter stripe) */
  function stretcher(b, x0, x1, y, s) {
    const hl = 5 * s, m0 = x0 + hl, m1 = x1 - hl
    b.rect(x0, y, x1 - x0, Math.max(1, 1.2 * s), "h")                                             // the rails and their handles
    b.rect(m0 + 3 * s, y + 1.2 * s, 1.5 * s, 2 * s, "5"); b.rect(m1 - 4.5 * s, y + 1.2 * s, 1.5 * s, 2 * s, "5")   // its folded legs
    b.rect(m0, y - 1.2 * s, m1 - m0, 1.2 * s, "H")                                                  // the pad
    // under the blanket: his feet (the toes up), the shins, the hips, the chest with the hands folded on it
    const top = y - 1.2 * s, L = m1 - m0
    b.poly([m0 + 1 * s, top, m0 + 1 * s, top - 3.2 * s, m0 + 3 * s, top - 3.2 * s, m0 + 4 * s, top - 2 * s,
      m0 + L * 0.42, top - 2.2 * s, m0 + L * 0.55, top - 3.2 * s, m0 + L * 0.8, top - 3.6 * s, m1 - 7.5 * s, top - 3.2 * s, m1 - 7.5 * s, top], "L")
    b.rect(m0 + 1 * s, top - 0.8 * s, m1 - 8.5 * s - m0, 0.8 * s, "H")                             // the blanket's shaded fold
    b.rect(m0 + L * 0.58, top - 4 * s, 3 * s, 1.2 * s, "S")                                        // his hands, folded, apart from his chin
    // the pillow and his head on it in profile, the face up: the chin, the nose highest, the shut eye, the brow; the hair at the back
    // of his head on the pillow; the ear, and behind it the patch
    if (s >= 1.5) {
      const ox = R(m1 - 15), oy = R(top - 10.7)
      b.rect(ox + 7, oy + 6, 9, 4, "L"); b.rect(ox + 7, oy + 9, 9, 1, "H")                         // the pillow, white
      // neck at the left, the chin, the mouth, the nose highest, the shut eye, the brow; his hair at the back of the head toward
      // the door; the ear, and behind it the patch, Teo's oval turned on its side (he lies)
      const HEAD = [
        "......SS........",
        "......SSS.SSs...",
        "..SS.SSSSkSSS11.",
        "..SSSSSSSSSSS111",
        ".sSSSSSSSSSs1111",
        "SSSSSSSSSss11111",
        "SSsSSSSSss1DDD11",
        "...ssSSSsDEEVD11",
        ".....sSSs1DDD11.",
        ".......1111111..",
      ]
      // backlit by the door: the face in the skin's shade, its underside darker, so it reads against the warm light
      const BACK = { S: "s", s: "O" }
      HEAD.forEach((row, y) => [...row].forEach((k, x) => { if (k !== ".") b.px(ox + x, oy + y, BACK[k] ?? k) }))
    } else {
      const hx = m1 - 3.5, hy = top - 3
      b.rect(m1 - 6, top - 2, 7, 2, "L")
      b.ell(hx, hy, 2.6, 2, "S"); b.rect(hx + 1, hy - 1, 2, 3, "1"); b.px(hx - 1, hy - 3, "S")   // no patch: at 18 px a metre it would be a point
    }
  }

  /** the girl (variant A) in the lit door, her feet at (fx, fy), h px tall: her father's work jacket over her pyjamas, far too big,
   *  the sleeves over her hands, barefoot; her hair loose; her slate lit in one hand (she tried to call someone) */
  function girl(b, fx, fy, h) {
    const s = h / 26
    b.rect(fx - 2 * s, fy - 1 * s, 1.6 * s, 1 * s, "S"); b.rect(fx + 0.5 * s, fy - 1 * s, 1.6 * s, 1 * s, "s")   // bare feet
    b.rect(fx - 2.2 * s, fy - 9 * s, 2 * s, 8 * s, "5"); b.rect(fx + 0.4 * s, fy - 9 * s, 2 * s, 8 * s, "4")   // the pyjama legs
    for (let y = fy - 9 * s; y < fy - 1 * s; y += 2) b.rect(fx - 2.2 * s, y, 4.6 * s, 1, "d")                   // their stripes
    b.rect(fx - 4.5 * s, fy - 20 * s, 9 * s, 12.5 * s, "b")                                      // the jacket, to her knees
    b.rect(fx - 4.5 * s, fy - 20 * s, 2.5 * s, 12.5 * s, "B")                                    // its lit side
    b.rect(fx - 1 * s, fy - 20 * s, 1.6 * s, 9 * s, "5")                                         // the pyjama top where it hangs open
    b.rect(fx - 5.5 * s, fy - 19 * s, 2 * s, 9 * s, "b"); b.rect(fx + 3.6 * s, fy - 19 * s, 2 * s, 9 * s, "b")   // the sleeves, too long
    b.rect(fx + 3.4 * s, fy - 11 * s, 2.2 * s, 2.8 * s, "c"); b.rect(fx + 3.8 * s, fy - 10.6 * s, 1.4 * s, 2 * s, "v")   // the slate, lit
    b.ell(fx - 0.5, fy - 23 * s, 2.6 * s, 2.8 * s, "1")                                         // her head, the hair loose to the shoulders
    b.rect(fx - 4 * s, fy - 22 * s, 1.5 * s, 6 * s, "1"); b.rect(fx + 1.6 * s, fy - 22 * s, 1.5 * s, 6 * s, "1")
    b.rect(fx - 1.6 * s, fy - 23.5 * s, 2.6 * s, 2.6 * s, "s")                                   // her face, toward the street
    b.px(fx - 1 * s, fy - 22.6 * s, "1"); b.px(fx + 0.4 * s, fy - 22.6 * s, "1")                  // her eyes, on the stretcher
  }

  /** a window of the house with its blind `down` (0..1) of the way; lit or dark behind it */
  function windowAt(b, x, y, w, h, down, lit) {
    b.rect(x - 1, y - 1, w + 2, h + 2, "3"); b.rect(x - 2, y + h + 1, w + 4, 2, "4")             // the frame, the sill
    b.rect(x, y, w, h, lit ? "Q" : "1"); if (lit) b.rect(x + 2, y + h * 0.35, w - 4, h * 0.45, "R")
    const bh = R(h * down)
    b.rect(x, y, w, bh, lit ? "O" : "3")
    for (let j = y + 1; j < y + bh; j += 2) b.rect(x, j, w, 1, lit ? "a" : "2")                   // the slats
    if (bh > 0 && bh < h) b.rect(x, y + bh - 1, w, 1, lit ? "P" : "4")                             // its bottom bar, still moving
  }

  // ---------------------------------------------------------------- the close framing (block B)
  function draw() {
    const b = buffer(), s = 1.9
    // the house behind them: its wall stained by the rain, the upper windows cut by the top with their blinds, the ledge
    b.rect(0, 0, W, 92, "2")
    for (let y = 0; y < 92; y++) for (let x = 0; x < W; x++) {
      const h = bay(x * 3, y), streak = ((x * 7) % 13 === 0) && y > 30
      if (h < 0.07 || (streak && bay(x, y * 2) < 0.4)) b.px(x, y, "1")                           // stains, rain run down the wall
      else if (h > 0.96) b.px(x, y, "3")
    }
    windowAt(b, 62, -6, 26, 24, 0.85, 1); windowAt(b, 112, -6, 26, 24, 0.45, 1); windowAt(b, 160, -6, 26, 24, 1, 0)
    b.rect(0, 26, W, 3, "3"); b.rect(0, 26, W, 1, "4"); b.rect(0, 29, W, 1, "1")
    // the door behind his head, open inward, the hall's warm light and its stair far in; the bell panel; the two steps, their edges lit
    b.rect(112, 38, 34, 50, "4"); b.rect(115, 41, 28, 47, "Q"); b.rect(119, 42, 20, 12, "R"); b.rect(115, 78, 28, 10, "P")
    b.rect(115, 41, 3, 47, "O"); b.rect(118, 41, 1, 47, "P")
    for (let y = 56; y < 78; y += 4) b.rect(124, y, 14, 1, "P")
    b.rect(149, 58, 3, 6, "5"); b.px(150, 60, "v"); b.px(150, 62, "c")
    b.rect(108, 86, 42, 3, "4"); b.rect(106, 89, 46, 3, "5"); b.rect(108, 86, 42, 1, "A"); b.rect(106, 89, 46, 1, "P")
    girl(b, 121, 86, 33)                                                                         // over his chest, his head on the light
    // the sidewalk, its wet, the door's light on it, the paving's joints
    b.rect(0, 92, W, H - 92, "z"); b.poly([110, 92, 148, 92, 168, H, 94, H], "A")
    for (let y = 92; y < H; y++) for (let x = 0; x < W; x++) {
      if (b.g[y][x] === "z" && bay(x, y) < 0.3) b.g[y][x] = "e"
      if (b.g[y][x] === "A" && bay(x, y) < (y - 92) / (H - 92) * 0.7) b.g[y][x] = "a"
    }
    for (let x = 4; x < W; x += 9) for (let y = 92; y < H; y++) if (b.g[y][x] === "z") b.px(x, y, "e")
    // the van's back, close (the short van of the user's sketch): its white flank on the left, a seam, grime low down, the wheel
    b.poly([0, 4, 32, 4, 36, 6, 36, 108, 0, 108], "L")
    b.rect(0, 70, 36, 1, "H"); b.rect(0, 94, 36, 14, "H"); b.rect(0, 108, 36, 2, "h")
    for (let y = 96; y < 108; y++) for (let x = 0; x < 36; x++) if (bay(x, y) < (y - 96) / 14 * 0.5) b.px(x, y, "h")
    b.rect(22, 30, 1, 64, "H"); b.rect(14, 60, 6, 2, "4"); b.rect(2, 86, 3, 2, "O")
    b.ell(10, 112, 14, 9, "1"); b.ell(10, 114, 10, 7, "k"); b.ell(10, 113, 4, 3, "4")
    // its open back: the cold light inside, the rear door swung out toward us, its inside in shade, its window dark
    b.rect(36, 8, 4, 100, "V"); b.rect(40, 8, 1, 100, "x")
    b.poly([41, 6, 52, 2, 52, 108, 41, 104], "H"); b.poly([41, 6, 52, 2, 52, 4, 41, 8], "L")
    b.poly([43, 14, 50, 11, 50, 34, 43, 36], "1"); b.line(44, 16, 48, 14, "c")
    b.rect(46, 60, 3, 2, "h")
    b.poly([41, 104, 62, 104, 74, H, 41, H], "x")
    // the stretcher across the middle, the man on it, his head toward the door, his face and the patch to Juno
    stretcher(b, 62, 151, 78, s)
    carrier(b, 57, 108, 62, { dir: -1, hands: "back" })
    carrier(b, 164, 107, 62, { dir: -1, hands: "front", turn: true, skin: "p" })
    b.glow("LH", "23efzZ", ["4", "3"])
    b.mirror(108, 109, H, 53, W, WET, "zeA")
    // the rain, falling slant through the light: a few streaks, brighter where they cross the door's light and the van's
    for (let n = 0; n < 46; n++) {
      const x0 = R(bay(n * 17, n * 5) * W), y0 = R(bay(n * 3, n * 29) * (H - 10)), len = 3 + (n % 3)
      for (let i = 0; i < len; i++) {
        const x = x0 - Math.floor(i / 3), y = y0 + i, k = b.get(x, y)
        if (k == null) continue
        if ("LHhVx".includes(k)) continue                                                 // not on the white: there it reads as scratches
        b.px(x, y, "QRPA".includes(k) ? "W" : "4")
      }
    }
    return b
  }

  const bb = draw()
  sprite("look_traeger", { w: W, h: H }, (c) => bb.to(c))
}
