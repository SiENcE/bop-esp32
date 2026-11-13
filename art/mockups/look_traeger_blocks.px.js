// The close-up "look_traeger" (game/stadt.js, moment "traeger"; kapitel1-design "Die weißen Träger"), as blocks for the user's
// choice before it is painted. Thursday 23:30, Kowalski Street: Juno looks across the street at the house opposite (south of the
// street, behind the room's camera: it isn't in the iso picture). A white van without a sign at the kerb, two very friendly people
// in white carrying a sleeping man out on a stretcher, feet first, his daughter in the lit door, the blinds above going down one
// after the other. "Weiß hält hier unten keinen Tag": the white is the only clean thing, it glows against the wet dark.
// 170x112, the interface's close-up frame in street mode (game/screens.js draws look_* at their own size at (75, 19)).
// Flat blocks in the world palette (art/lib/iso.js): proportions, the light, who stands where; no painted detail, no rain yet.
//   look_traeger_blocks_A   wide: the van's whole flank on the left, the carriers between its open back and the door, the girl
//                           small in the door on the right, the house's five upper windows with their blinds across the top
//   look_traeger_blocks_B   close: the van's white flank fills the left quarter, the stretcher across the middle with the man's
//                           face and his Lull patch, the carrier behind turned to Juno and smiling, the girl behind her father
//                           in the lit door, seen from the chest up over him
//   look_traeger_blocks     the sheet: A and B side by side, in the close-up's frame
//   look_traeger_im_raum_A, _B   each in the game's picture of Kowalski Street (a screenshot, build/blocks/look_traeger/shot)
// The carriers' own figures are blocked elsewhere (art/test/traeger_blocks.px.js); here they are kept simple: white, friendly,
// faces open (unlike Ashe's white mask in cam31).
include("../lib/iso.js", { palette: true })
pal({
  L: "#eef3f8",                 // the clinic white, lit (H #b9c6d8 its shade, h #7d8ca4 its dark side)
  E: "#a8c4ec", D: "#5a78a8",   // the Lull patch: pale blue, its rim (style guide §6: an oval disc behind the ear)
  p: "#6b4430",                 // a second skin, darker
})
include("../lib/text.js")

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

  /** one in white, his feet's centre at (fx, fy), `h` px tall; dir -1 walks left; `turn` his face to Juno; `hands` "back" or "front"
   *  (where the stretcher's handle is: behind him for the one who leads, before him for the one behind) */
  function carrier(b, fx, fy, h, o = {}) {
    const s = h / 32, d = o.dir ?? -1, skin = o.skin ?? "S", hair = o.hair ?? "k"
    const r = (x, y, w, hh, k) => { const a = d < 0 ? x : -x - w; b.rect(fx + a * s, fy + y * s, Math.max(1, w * s), Math.max(1, hh * s), k) }
    const at = (x, y, k) => b.px(fx + (d < 0 ? x : -x) * s, fy + y * s, k)
    // white shoes, the legs in a stride (the far one in the white's shade)
    r(-6, -2, 4, 2, "H"); r(2, -2, 4, 2, "h")
    r(-5, -14, 3, 12, "H"); r(2, -14, 3, 12, "h")
    // the coverall to the hips, its far side in shade, the collar; the near arm down to the handle
    r(-5, -26, 10, 13, "L"); r(3, -26, 2, 13, "H"); r(-2, -26, 4, 1, "H")
    if (o.hands === "back") { r(1, -24, 3, 9, "H"); r(2, -16, 4, 2, skin) }
    else { r(-6, -24, 3, 9, "H"); r(-9, -16, 4, 2, skin) }
    // the neck, the head, the hair neat and short: nothing hides their faces
    r(-1, -27, 2, 1, skin)
    b.ell(fx - 0.5, fy - 29.5 * s - 0.5, 3 * s, 3 * s, skin)
    if (o.turn) {
      r(-3, -33, 7, 2, hair); r(-3.4, -31.5, 1, 2.5, hair); r(2.6, -31.5, 1, 2.5, hair)
      at(-1.5, -30, "k"); at(1.5, -30, "k")                                                    // turned to Juno: the eyes,
      r(-1.5, -27.8, 3, 0.8, "L")                                                                // a wide white smile (in ink it read as a beard)
    } else {
      r(-2, -33, 6, 2, hair); r(1.5, -31.5, 3, 3.5, hair)
      at(-2, -30, "k"); r(-3, -28, 1.6, 0.7, "L")                                                // in profile: an eye, the smile
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

  /** the girl: dark against the lit door, her feet at (fx, fy), h px tall; one hand on the frame at x `hand` */
  function girl(b, fx, fy, h, hand) {
    const s = h / 26
    b.rect(fx - 2 * s, fy - 9 * s, 1.6 * s, 9 * s, "S"); b.rect(fx + 0.5 * s, fy - 9 * s, 1.6 * s, 9 * s, "s")   // bare legs in the warm light
    b.rect(fx - 3.5 * s, fy - 20 * s, 7 * s, 12 * s, "4")                                       // a long cardigan over her nightclothes
    b.rect(fx - 1 * s, fy - 20 * s, 2 * s, 12 * s, "5")                                         // the nightdress where it's open
    b.ell(fx - 0.5, fy - 23 * s, 2.6 * s, 2.8 * s, "1")                                         // her head, the hair loose to the shoulders
    b.rect(fx - 4 * s, fy - 22 * s, 1.5 * s, 6 * s, "1"); b.rect(fx + 1.6 * s, fy - 22 * s, 1.5 * s, 6 * s, "1")
    b.rect(fx - 1.6 * s, fy - 23.5 * s, 2.6 * s, 2.6 * s, "s")                                   // her face, toward the street
    if (hand) { b.rect(Math.min(hand, fx + 3 * s), fy - 17 * s, Math.abs(hand - fx - 3 * s) + 1, 1.2 * s, "4"); b.rect(hand, fy - 17.4 * s, 1.6 * s, 1.6 * s, "s") }
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

  // ---------------------------------------------------------------- A: wide
  function drawA() {
    const b = buffer()
    // the house opposite: its upper floor with five windows, the blinds going down; the ledge; the shop's shutter; the door on the right
    b.rect(0, 0, W, 84, "2")
    b.rect(0, 36, W, 3, "3")
    const blinds = [[6, 1, 1], [40, 0.7, 1], [74, 0.25, 1], [108, 1, 0], [142, 0.55, 1]]
    for (const [x, down, lit] of blinds) windowAt(b, x, 6, 20, 22, down, lit)
    b.rect(4, 46, 140, 38, "3"); for (let y = 48; y < 84; y += 3) b.rect(4, y, 140, 1, "4")         // a shop's roller shutter, down
    b.rect(148, 44, 22, 40, "4"); b.rect(151, 46, 19, 38, "Q"); b.rect(154, 47, 14, 10, "R"); b.rect(151, 76, 19, 8, "P")   // the door open, the hall's light
    b.rect(151, 46, 2, 38, "O")                                                                      // the door's leaf, open inward
    b.rect(144, 60, 2, 4, "5"); b.px(144, 61, "v")                                                  // the bell panel's light
    // the sidewalk, the door's step and its light on it, the kerb, the street
    b.rect(0, 84, W, 7, "z"); b.rect(147, 84, 23, 2, "4")
    b.poly([147, 86, 170, 86, 170, 91, 138, 91], "A")
    b.rect(0, 91, W, 1, "X"); b.rect(0, 92, W, 2, "4"); b.rect(0, 94, W, H - 94, "f")
    // the ad screen's cyan from the left (on the facade behind Juno's left shoulder), LUCKY STATIC's magenta from behind her
    for (let y = 0; y < H; y++) for (let x = 0; x < 22; x++) if (bay(x, y) < (22 - x) / 22 * 0.7) {
      const k = b.g[y][x]; b.g[y][x] = { 2: "c", 3: "c", 4: "T", z: "t", f: "t", X: "T" }[k] ?? k
    }
    for (let y = 104; y < H; y++) for (let x = 0; x < W; x++) if (b.g[y][x] === "f" && bay(x, y) < (y - 103) / 9 * 0.45) b.g[y][x] = "i"
    // the van: a plain white panel van, no sign, no windows in its flank; its back open toward the door, the cold light inside
    b.poly([2, 98, 2, 76, 9, 60, 20, 57, 84, 57, 84, 98], "L")
    b.rect(2, 88, 82, 10, "H"); b.rect(2, 98, 82, 2, "h")
    b.poly([7, 75, 12, 63, 24, 63, 24, 75], "1"); b.line(14, 64, 11, 71, "c")                   // the cab's side window, dark
    b.rect(25, 60, 1, 37, "H"); b.rect(52, 60, 1, 37, "H"); b.rect(46, 74, 4, 1, "4")              // the doors' seams, a handle
    b.rect(2, 82, 3, 2, "O")                                                                         // a parking light, low
    for (const wx of [18, 70]) { b.ell(wx, 99, 7, 6, "1"); b.ell(wx, 101, 4, 4, "k"); b.px(wx, 101, "4") }
    b.rect(2, 104, 82, 2, "e")                                                                       // the shadow under it
    b.rect(84, 58, 2, 40, "V"); b.rect(86, 58, 1, 40, "x")                                          // its open back, the light inside
    b.poly([85, 91, 100, 91, 106, 94, 85, 94], "x")                                                 // its pool on the kerb
    // the carriers on the sidewalk coming from the door, the stretcher between them, feet first toward the van; the one behind smiles at Juno
    stretcher(b, 100, 143, 74, 1)
    carrier(b, 96, 90, 32, { dir: -1, hands: "back" })
    carrier(b, 150, 89, 32, { dir: -1, hands: "front", turn: true, skin: "p" })
    // the girl in the door, a hand on its frame
    girl(b, 162, 84, 25, 167)
    b.glow()
    b.mirror(91, 94, H, 0, W, WET, "efti")
    return b
  }

  // ---------------------------------------------------------------- B: close
  function drawB() {
    const b = buffer(), s = 1.9
    // the house behind them: the upper windows cut by the top, the ledge, the door with the girl, steps up to it
    b.rect(0, 0, W, 92, "2")
    windowAt(b, 62, -6, 26, 24, 0.85, 1); windowAt(b, 112, -6, 26, 24, 0.45, 1); windowAt(b, 160, -6, 26, 24, 1, 0)
    b.rect(0, 26, W, 3, "3")
    // the door behind his head: his hair and her shape read dark on its light
    b.rect(112, 38, 34, 50, "4"); b.rect(115, 41, 28, 47, "Q"); b.rect(119, 42, 20, 12, "R"); b.rect(115, 78, 28, 10, "P")
    b.rect(115, 41, 3, 47, "O")
    b.rect(149, 58, 3, 6, "5"); b.px(150, 60, "v")
    b.rect(108, 86, 42, 3, "4"); b.rect(106, 89, 46, 3, "5")                                          // the two steps up to it
    girl(b, 121, 86, 33)                                                                             // over his chest, his head on the light
    // the sidewalk, its wet, the door's light on it
    b.rect(0, 92, W, H - 92, "z"); b.poly([110, 92, 148, 92, 168, H, 94, H], "A")
    for (let y = 92; y < H; y++) for (let x = 0; x < W; x++) {
      if (b.g[y][x] === "z" && bay(x, y) < 0.3) b.g[y][x] = "e"
      if (b.g[y][x] === "A" && bay(x, y) < (y - 92) / (H - 92) * 0.7) b.g[y][x] = "a"                // the door's light thins toward Juno
    }
    // the stretcher across the middle, the man on it, his head toward the door, his face and the patch to Juno; his daughter over him
    stretcher(b, 62, 151, 78, s)
    carrier(b, 57, 108, 62, { dir: -1, hands: "back" })
    carrier(b, 164, 107, 62, { dir: -1, hands: "front", turn: true, skin: "p" })
    // the van's flank, close: white from the top to the street, its back open, the cold light on the carriers and the ground
    b.poly([0, 4, 36, 4, 40, 6, 40, 108, 0, 108], "L")
    b.rect(0, 70, 40, 1, "H"); b.rect(0, 94, 40, 14, "H"); b.rect(0, 108, 40, 2, "h")
    b.rect(26, 30, 1, 64, "H"); b.rect(18, 60, 6, 2, "4")
    b.ell(10, 112, 14, 9, "1"); b.ell(10, 114, 10, 7, "k")
    b.rect(40, 8, 3, 100, "V"); b.rect(43, 8, 1, 100, "x"); b.poly([43, 104, 62, 104, 74, H, 43, H], "x")
    b.glow("LH", "23efzZ", ["4", "3"])
    b.mirror(108, 109, H, 44, W, WET, "zeA")
    return b
  }

  const bA = drawA(), bB = drawB()
  sprite("look_traeger_blocks_A", { w: W, h: H }, (c) => bA.to(c))
  sprite("look_traeger_blocks_B", { w: W, h: H }, (c) => bB.to(c))

  // the close-up's frame as game/screens.js draws it: ink, a cyan-dark line, the cyan brackets in the corners
  const frame = (c, x, y) => {
    c.rect(x - 3, y - 3, W + 6, H + 6, "k")
    c.rect(x - 2, y - 2, W + 4, 1, "C"); c.rect(x - 2, y + H + 1, W + 4, 1, "C"); c.rect(x - 2, y - 2, 1, H + 4, "C"); c.rect(x + W + 1, y - 2, 1, H + 4, "C")
    for (const [bx, by, sx, sy] of [[x - 2, y - 2, 1, 1], [x + W + 1, y - 2, -1, 1], [x - 2, y + H + 1, 1, -1], [x + W + 1, y + H + 1, -1, -1]]) {
      for (let i = 0; i < 6; i++) { c.px(bx + i * sx, by, "v"); c.px(bx, by + i * sy, "v") }
    }
  }

  const SW = 8 + (W + 6) * 2 + 10, SH = 16 + H + 8
  sprite("look_traeger_blocks", { w: SW, h: SH }, (c) => {
    c.rect(0, 0, SW, SH, "e")
    const xs = [11, 11 + W + 6 + 10]
    TXT.draw(c, xs[0], 4, "A  WIDE", "6", { font: "hud" }); TXT.draw(c, xs[1], 4, "B  CLOSE", "6", { font: "hud" })
    frame(c, xs[0], 15); bA.to(c, xs[0], 15)
    frame(c, xs[1], 15); bB.to(c, xs[1], 15)
  })

  // in the game's picture: Kowalski Street (Juno at the Kessel Block's door, under the close-up), the clock set to Thursday 23:30
  for (const [id, bb] of [["A", bA], ["B", bB]]) {
    sprite(`look_traeger_im_raum_${id}`, { png: "../../build/blocks/look_traeger/shot/room_1x.png" }, (c) => {
      bb.to(c, 75, 19)
      c.rect(6, 4, 34, 7, "k"); TXT.draw(c, 7, 5, "DO 23:30", "v", { font: "hud" })
    })
  }
}
