// Style B: "Cutaway side stage, neon noir". The Loonies setup (straight-on stage, one vanishing
// point, flat colours, hard edges, 1 px dark outlines on characters and props, a lighting pass
// on top) taken to a rainy night: a DARK blue ambient and strong coloured neon pools.
// The moment (docs/mockups/BRIEF.md): outside the noodle bar LUCKY STATIC, Juno looks up at the
// broken ad screen that just said her name. Modern verb-less UI: portrait, bag, hand + label, subtitle.
// 320x180, a 12-frame loop at 100 ms (rain, neon flicker, screen static, steam, the drone's bob).

const W = 320, H = 180, FR = 12
const FOOT = 120                  // the back wall's foot
const VP = [160, 70]              // the vanishing point
const SIDE_X = 34                 // the corner where the left side wall meets the back wall
const CURB = 131                  // the kerb: sidewalk above, road below
const SCREEN = { x: 162, y: 6, w: 116, h: 58 }
const JUNO = [152, 110]           // Juno's top-left; her feet at y 154
const DRONE = [250, 76]
const CART = [42, 110]

pal({
  k: "#0d0a16",                                                              // ink (outlines), never pure black
  q: "#111a2e", Q: "#1b2640",                                                // sky between the towers, far towers
  a: "#2c3652", A: "#1e253c", b: "#3e4a6c",                                  // back wall: face, joints, lit lip
  e: "#121626", E: "#0b0e1a",                                                // the alley's dark
  f: "#323b55", F: "#222a40", h: "#46516e",                                  // road: asphalt, cracks, worn sheen
  g: "#3e4864", G: "#2c3550",                                                // sidewalk slabs, joints
  p: "#1a2238",                                                              // puddle
  m: "#4c5672", M: "#333a52", n: "#7482a2",                                  // metal: face, dark, lit edge
  r: "#4a2238", R: "#2e1426",                                                // LUCKY STATIC's plum facade
  K: "#181e2c", H: "#3a4460",                                                // trash bags, their sheen
  // lights: all of these are emitters
  N: "#ff3cb4", O: "#ffc0ec", o: "#5a1c44",                                  // magenta neon, its hot core, a dead tube
  W: "#ffe0a0", Y: "#ffb458", y: "#b8642c",                                  // warm bar light, window, warm shapes inside
  c: "#3cd8f0", C: "#1b7896", v: "#c8f8ff", x: "#0a2234", 0: "#ffffff",      // screen: cyan, dark cyan, pale, dead, glint
  s: "#f4c4a6", S: "#c98a7c", l: "#8cc0f4", L: "#4a78c8", 6: "#2c3478", 9: "#f09090", // the ad: skin, sky, hair, blush
  X: "#ff3040", 7: "#fff6e0", 8: "#2affc0", V: "#b8fff0",                    // drone red, searchlight lens, exit teal, vending glow
  // Juno
  J: "#ffd23c", j: "#c48a1e", t: "#1d1d27", T: "#34343f", B: "#3e2e28",
  i: "#8c8e9a", I: "#5c5e6a", z: "#d9a07e", Z: "#a46a50",
  // the cook and his cart
  w: "#c4c4cc", d: "#6a4632", D: "#452c22", U: "#a8343c", u: "#6c2030",
})
const EMIT = "NOWYycCvx0sSlL69X78V"
include("../../.claude/skills/claude-pxl/lib/ui/font5x7.px.js")   // the 5x7 font for the neon sign

// ------------------------------------------------------------------ helpers
const ihash = (a, b = 0, c = 0) => { let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
const hexI = (s) => (parseInt(s.slice(1), 16) << 8 | 255) >>> 0
const hexS = (v) => "#" + (v >>> 0).toString(16).padStart(8, "0")
const mix = (a, b, t) => {
  const ch = (v, s) => (v >>> s) & 255, m = (s) => Math.round(ch(a, s) * (1 - t) + ch(b, s) * t)
  return ((m(24) << 24) | (m(16) << 16) | (m(8) << 8) | 255) >>> 0
}
const addI = (a, b, t) => {          // add light: a + b*t, clamped
  const ch = (v, s) => (v >>> s) & 255, m = (s) => Math.min(255, Math.round(ch(a, s) + ch(b, s) * t))
  return ((m(24) << 24) | (m(16) << 16) | (m(8) << 8) | 255) >>> 0
}
const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H
const tint = (c, x, y, col, t) => { if (inside(x, y) && t > 0) c.px(x, y, hexS(mix(c.get(x, y), col, Math.min(1, t)))) }
const addLight = (c, x, y, col, t) => { if (inside(x, y) && t > 0) c.px(x, y, hexS(addI(c.get(x, y), col, t))) }
const fr = (c) => ((c.frame % FR) + FR) % FR
// a line through the vanishing point: y on it at x, given its y at the corner x = SIDE_X
const sideY = (yc, x) => yc + (SIDE_X - x) * (yc - VP[1]) / (VP[0] - SIDE_X)
const floorTop = (x) => x >= SIDE_X ? FOOT : sideY(FOOT, x)

// ------------------------------------------------------------------ UI font (from the Loonies: the_goonies/art/mockups/common.px.js)
// ------------------------------------------------------------------ font
// Variable-width font: caps 7 rows, lowercase descenders go 2 rows below the baseline.
const GLYPHS = {
  A: [".##.", "#..#", "#..#", "####", "#..#", "#..#", "#..#"],
  B: ["###.", "#..#", "#..#", "###.", "#..#", "#..#", "###."],
  C: [".##.", "#..#", "#...", "#...", "#...", "#..#", ".##."],
  D: ["###.", "#..#", "#..#", "#..#", "#..#", "#..#", "###."],
  E: ["####", "#...", "#...", "###.", "#...", "#...", "####"],
  F: ["####", "#...", "#...", "###.", "#...", "#...", "#..."],
  G: [".##.", "#..#", "#...", "#.##", "#..#", "#..#", ".###"],
  H: ["#..#", "#..#", "#..#", "####", "#..#", "#..#", "#..#"],
  I: ["###", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
  J: ["..##", "...#", "...#", "...#", "#..#", "#..#", ".##."],
  K: ["#..#", "#..#", "#.#.", "##..", "#.#.", "#..#", "#..#"],
  L: ["#...", "#...", "#...", "#...", "#...", "#...", "####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#..#", "##.#", "##.#", "#.##", "#.##", "#..#", "#..#"],
  O: [".##.", "#..#", "#..#", "#..#", "#..#", "#..#", ".##."],
  P: ["###.", "#..#", "#..#", "###.", "#...", "#...", "#..."],
  Q: [".##.", "#..#", "#..#", "#..#", "#..#", "#.#.", ".#.#"],
  R: ["###.", "#..#", "#..#", "###.", "#.#.", "#..#", "#..#"],
  S: [".###", "#...", "#...", ".##.", "...#", "...#", "###."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#..#", "#..#", "#..#", "#..#", "#..#", "#..#", ".##."],
  V: ["#...#", "#...#", "#...#", ".#.#.", ".#.#.", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["####", "...#", "..#.", ".#..", "#...", "#...", "####"],
  a: ["....", "....", ".##.", "...#", ".###", "#..#", ".###"],
  b: ["#...", "#...", "###.", "#..#", "#..#", "#..#", "###."],
  c: ["...", "...", ".##", "#..", "#..", "#..", ".##"],
  d: ["...#", "...#", ".###", "#..#", "#..#", "#..#", ".###"],
  e: ["....", "....", ".##.", "#..#", "####", "#...", ".##."],
  f: [".##", "#..", "###", "#..", "#..", "#..", "#.."],
  g: ["....", "....", ".###", "#..#", "#..#", "#..#", ".###", "...#", ".##."],
  h: ["#...", "#...", "###.", "#..#", "#..#", "#..#", "#..#"],
  i: ["#", ".", "#", "#", "#", "#", "#"],
  j: ["..#", "...", "..#", "..#", "..#", "..#", "..#", "#.#", ".#."],
  k: ["#...", "#...", "#..#", "#.#.", "##..", "#.#.", "#..#"],
  l: ["#.", "#.", "#.", "#.", "#.", "#.", ".#"],
  m: [".....", ".....", "##.#.", "#.#.#", "#.#.#", "#.#.#", "#.#.#"],
  n: ["....", "....", "###.", "#..#", "#..#", "#..#", "#..#"],
  o: ["....", "....", ".##.", "#..#", "#..#", "#..#", ".##."],
  p: ["....", "....", "###.", "#..#", "#..#", "#..#", "###.", "#...", "#..."],
  q: ["....", "....", ".###", "#..#", "#..#", "#..#", ".###", "...#", "...#"],
  r: ["...", "...", "#.#", "##.", "#..", "#..", "#.."],
  s: ["...", "...", ".##", "#..", ".#.", "..#", "##."],
  t: [".#.", ".#.", "###", ".#.", ".#.", ".#.", "..#"],
  u: ["....", "....", "#..#", "#..#", "#..#", "#..#", ".###"],
  v: ["...", "...", "#.#", "#.#", "#.#", "#.#", ".#."],
  w: [".....", ".....", "#...#", "#...#", "#.#.#", "#.#.#", ".#.#."],
  x: ["...", "...", "#.#", "#.#", ".#.", "#.#", "#.#"],
  y: ["....", "....", "#..#", "#..#", "#..#", "#..#", ".###", "...#", ".##."],
  z: ["....", "....", "####", "..#.", ".#..", "#...", "####"],
  0: [".##.", "#..#", "#.##", "##.#", "#..#", "#..#", ".##."],
  1: [".#.", "##.", ".#.", ".#.", ".#.", ".#.", "###"],
  2: [".##.", "#..#", "...#", "..#.", ".#..", "#...", "####"],
  3: ["###.", "...#", "...#", ".##.", "...#", "...#", "###."],
  4: ["#..#", "#..#", "#..#", "####", "...#", "...#", "...#"],
  5: ["####", "#...", "#...", "###.", "...#", "...#", "###."],
  6: [".##.", "#...", "#...", "###.", "#..#", "#..#", ".##."],
  7: ["####", "...#", "...#", "..#.", ".#..", ".#..", ".#.."],
  8: [".##.", "#..#", "#..#", ".##.", "#..#", "#..#", ".##."],
  9: [".##.", "#..#", "#..#", ".###", "...#", "...#", ".##."],
  ".": [".", ".", ".", ".", ".", ".", "#"],
  ",": [".", ".", ".", ".", ".", ".", "#", "#"],
  "!": ["#", "#", "#", "#", "#", ".", "#"],
  "?": [".##.", "#..#", "...#", "..#.", ".#..", "....", ".#.."],
  ":": [".", ".", "#", ".", ".", ".", "#"],
  "'": ["#", "#"],
  '"': ["#.#", "#.#"],
  "-": ["...", "...", "...", "###"],
  "/": ["...#", "...#", "..#.", ".#..", ".#..", "#...", "#..."],
  "(": [".#", "#.", "#.", "#.", "#.", "#.", ".#"],
  ")": ["#.", ".#", ".#", ".#", ".#", ".#", "#."],
  "<": ["...", "..#", ".#.", "#..", ".#.", "..#"],
  ">": ["...", "#..", ".#.", "..#", ".#.", "#.."],
  " ": ["..."],
}
const FONT_H = 10                                                      // line height

/** Width in px of a string in the UI font. */
const textW = (s) => [...s].reduce((w, ch) => w + (GLYPHS[ch] || GLYPHS["?"])[0].length + 1, 0) - 1

/** Draw a string with the UI font. opts: { align: "l"|"c"|"r", shadow: key, outline: key } */
const say = (c, x, y, s, col, opts = {}) => {
  const lines = s.split("\n")
  lines.forEach((line, li) => {
    let cx = x, cy = y + li * FONT_H
    if (opts.align === "c") cx = x - Math.floor(textW(line) / 2)
    if (opts.align === "r") cx = x - textW(line)
    const draw = (dx, dy, k) => {
      let px = cx
      for (const ch of line) {
        const g = GLYPHS[ch] || GLYPHS["?"]
        g.forEach((row, ry) => { for (let rx = 0; rx < row.length; rx++) if (row[rx] === "#") c.px(px + rx + dx, cy + ry + dy, k) })
        px += g[0].length + 1
      }
    }
    if (opts.outline) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) draw(dx, dy, opts.outline)
    if (opts.shadow) draw(1, 1, opts.shadow)
    draw(0, 0, col)
  })
}

// ------------------------------------------------------------------ interface sprites
sprite("cur_hand", { outline: "k" }, `
  ..0....
  ..0....
  ..0.0..
  ..00000
  0.00000
  0000000
  .000000
  ..0000.`)
sprite("ui_bag", { w: 20, h: 16, outline: "k" },
  rect(0, 5, 20, 11, "i"), rect(0, 5, 20, 3, "I"), poly([2, 5, 18, 5, 16, 0, 4, 0], "I"),
  hline(4, 1, 12, "i"), rect(8, 7, 4, 3, "J"), px(9, 8, "j"), hline(0, 15, 20, "I"), vline(3, 9, 5, "I"), vline(16, 9, 5, "I"))
// Juno's head, front view, for the portrait: hood up, black fringe, the cyan line on her left cheek
sprite("_juno_face", { mx: true }, `
  .....JJJJ
  ...JJJJJJ
  ..JJJJJJJ
  .JJJJJttt
  .JJJjtttt
  JJJjttttz
  JJJjttzzz
  JJJjtzzzz
  JJJjzkkzz
  JJJjzzzzz
  JJJjzzzzz
  jJJjZzzzz
  jJJjjzzSS
  jjJJjZzzz
  .jjJJjZZZ
  ..jjJJjjj
  .jjJJJJJJ
  jjJJJJJJJ`)
sprite("ui_juno", { base: "_juno_face" }, grid(4, 9, "c\nc\n.c"), grid(5, 3, "t"), grid(12, 4, "z"))

// ------------------------------------------------------------------ Juno, seen from the side, looking up
// yellow hooded slicker, black cargo trousers, heavy boots, grey satchel on her back hip
sprite("juno", { outline: "k" }, `
  ......JJJJJ.......
  ....JJJJJJJJJ.....
  ...JJJJJJJJJJJ....
  ..JJJJJJJJJJJJJ...
  ..JJJJJJJJJtttJ...
  ..JJJJJJJJjttzzJ..
  ..JJJJJJJJjtzzzz..
  ..jJJJJJJJjzzkzz..
  ..jJJJJJJJjzzzzzz.
  ..jJJJJJJJjczzzz..
  ...jJJJJJJjczZz...
  ...jjJJJJJjZzz....
  ....jjJJJJJjZ.....
  ....jJJJJJJJJJ....
  ...jJJJJJJJJiJJ...
  ..jJJJJJJJJiJJJ...
  ..jJJJJJJJiJjJJ...
  ..jJJJJJJiJJjJJ...
  ..jJJJJJiJJJjJJ...
  .IIJJJJiJJJJjJJ...
  IiiIJJiJJJJJjJJ...
  IiiiIiJJJJJJjJJ...
  IiiiIJJJJJJJjJJ...
  IiiiIJJJJJJJjJj...
  IIiiIJJJJJJJjzj...
  .IIIIJJJJJJJjzz...
  ..jJJJJJJJJJJz....
  ..jjjjjjjjjjj.....
  ...tttttttttt.....
  ...tttttttTtt.....
  ...tTttttTTtt.....
  ...tTTtttTTtt.....
  ...tttt.ttttt.....
  ...tttt..tttt.....
  ...tttt..tttt.....
  ...tttt..tttt.....
  ...Tttt..Tttt.....
  ...tttt..ttttt....
  ...BBBB..BBBBB....
  ...BBBBB.BBBBBB...
  ..BBBBBB.BBBBBBB..`)

// ------------------------------------------------------------------ the cook, behind his cart
// an old man, white stubble and hair, a grey vest, a ladle; his umbrella is a battered red one
sprite("cook", { outline: "k" }, `
  ...wwww....
  ..wwwwww...
  ..wwwzzzz..
  ..wwzzkzz..
  ..wzzzzzzz.
  ..wzwwwzz..
  ...zwwww...
  ...wzzzZ...
  ..mmmmmmm..
  .mmmmmmmmz.
  .mmMmmmmzz.
  .mmMmmmmz..
  .mmMmmmmz..
  .mmmmmmmm..`)
sprite("cart", { w: 34, h: 22, outline: "k" },
  rect(0, 4, 34, 14, "d"), rect(0, 4, 34, 2, "D"), hline(0, 17, 34, "D"),       // the box, its lip
  rect(3, 7, 28, 8, "U"), rect(3, 13, 28, 2, "u"),                             // the red front panel
  text(6, 8, "NOODLE", "W"),
  rect(20, 0, 10, 4, "m"), hline(20, 0, 10, "n"), hline(19, 1, 12, "M"),       // the pot
  rect(3, 18, 6, 4, "M"), rect(25, 18, 6, 4, "M"), px(5, 19, "n"), px(27, 19, "n"))   // wheels
sprite("umbrella", { w: 40, h: 12, outline: "k" },
  poly([0, 11, 4, 5, 12, 1, 20, 0, 28, 1, 36, 5, 39, 11], "U"),
  (c) => { for (const x of [7, 20, 33]) c.line(20, 0, x, 11, "u") },
  hline(0, 11, 40, "u"), poly([28, 11, 33, 6, 36, 11], "u"),                    // a torn panel
  px(20, 0, "n"))

// ------------------------------------------------------------------ props
sprite("vending", { w: 30, h: 44, outline: "k" },
  rect(0, 0, 30, 44, "M"), rect(1, 1, 28, 42, "m"), hline(1, 1, 28, "n"),
  rect(3, 4, 19, 24, "V"),                                                      // the lit front
  (c) => { for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) c.rect(4 + i * 5, 5 + r * 6, 3, 4, ["X", "c", "J", "N", "8"][Math.floor(ihash(r, i) * 5)]); for (let r = 0; r < 4; r++) c.hline(3, 9 + r * 6, 19, "C") },
  rect(3, 4, 10, 12, "x"), line(4, 5, 11, 14, "C"), line(5, 12, 9, 8, "C"),    // the dead panel, cracked
  rect(2, 17, 24, 13, "w"), text(3, 18, "OUT OF", "X"), text(5, 24, "ORDER", "X"),   // the sticker
  rect(24, 5, 3, 7, "x"), rect(24, 14, 3, 2, "W"),                              // coin slot, display
  rect(3, 33, 19, 6, "x"), hline(3, 33, 19, "M"),                               // the tray
  rect(24, 20, 3, 8, "M"))
sprite("bags", { w: 30, h: 14, outline: "k" },
  ellipse(6, 8, 6, 5, "K"), ellipse(17, 9, 7, 5, "K"), ellipse(25, 10, 5, 4, "K"),
  rect(9, 0, 9, 7, "d"), hline(9, 0, 9, "W"), vline(13, 0, 7, "D"),            // a noodle-box carton
  px(4, 5, "H"), px(5, 4, "H"), px(15, 6, "H"), px(16, 5, "H"), px(24, 8, "H"),
  px(6, 3, "K"), px(6, 2, "H"))
sprite("drone", { w: 17, h: 8, outline: "k" },
  hline(0, 0, 6, "n"), hline(11, 0, 6, "n"), vline(3, 1, 2, "M"), vline(13, 1, 2, "M"),
  rect(3, 2, 11, 4, "m"), hline(3, 2, 11, "n"), rect(4, 5, 9, 2, "M"),
  rect(7, 4, 3, 2, "X"), px(8, 4, "0"), px(8, 7, "7"))

// ------------------------------------------------------------------ the set: sky, walls, street
function sky(c) {
  c.rect(0, 0, 152, 40, "q")
  // the far towers of the ring, a few windows lit
  for (const [x, w, top] of [[0, 14, 6], [12, 10, 12], [24, 18, 3], [44, 12, 10], [58, 22, 5], [82, 10, 14], [94, 20, 7], [116, 14, 11], [130, 22, 4]]) {
    c.rect(x, top, w, 40 - top, "Q")
    for (let y = top + 2; y < 40; y += 3) for (let xx = x + 1; xx < x + w - 1; xx += 3) if (ihash(xx, y) < 0.14) c.px(xx, y, ihash(y, xx) < 0.6 ? "Y" : "c")
  }
  // the underside of the deck above, its row of lamps
  c.rect(0, 0, 152, 3, "A"); c.hline(0, 3, 152, "k"); for (let x = 7; x < 152; x += 18) c.px(x, 2, "W")
}
// the left side wall, receding to the vanishing point, with the alley's mouth in it
function sideWall(c) {
  for (let x = 0; x < SIDE_X; x++) for (let y = Math.max(0, Math.round(sideY(22, x))); y < Math.round(floorTop(x)); y++) c.px(x, y, "A")
  for (const yc of [36, 52, 68, 84, 100]) for (let x = 0; x < SIDE_X; x++) c.px(x, Math.round(sideY(yc, x)), "E")
  for (let x = 0; x < SIDE_X; x++) { c.px(x, Math.round(sideY(22, x)), "n"); c.px(x, Math.round(sideY(22, x)) + 1, "M") }
  // the alley: dark, a far wall catching a stray light, a fire stair, a lit window deep in
  for (let x = 6; x <= 28; x++) for (let y = Math.round(sideY(62, x)); y < Math.round(floorTop(x)); y++) c.px(x, y, "E")
  for (let x = 17; x <= 27; x++) for (let y = Math.round(sideY(70, x)); y < Math.round(floorTop(x)) - 3; y++) c.px(x, y, "e")
  c.rect(20, 76, 3, 3, "Y"); c.line(17, 92, 27, 82, "k"); c.line(17, 104, 27, 94, "k"); c.hline(17, 92, 4, "k")
  for (let x = 6; x <= 28; x++) { c.px(x, Math.round(floorTop(x)) - 1, "p"); c.px(x, Math.round(floorTop(x)) - 2, x % 3 ? "p" : "E") }
  for (let x = 6; x <= 28; x++) c.px(x, Math.round(sideY(62, x)) - 1, "n")                                     // the lintel
  c.vline(5, Math.round(sideY(62, 5)), Math.round(floorTop(5) - sideY(62, 5)), "M")
  c.vline(29, Math.round(sideY(62, 29)), Math.round(floorTop(29) - sideY(62, 29)), "M")
  // the way out: a blade sign off the wall, facing the street
  const SY = 46
  c.hline(0, SY + 4, 8, "M"); c.rect(7, SY, 25, 10, "k"); c.box(7, SY, 25, 10, "M")
  c.text(16, SY + 2, "EXIT", "8"); c.hline(10, SY + 4, 4, "8"); c.px(11, SY + 3, "8"); c.px(11, SY + 5, "8"); c.px(12, SY + 2, "8"); c.px(12, SY + 6, "8")
  c.vline(SIDE_X, 22, FOOT - 22, "b")                                                                          // the corner
}
// LUCKY STATIC: two floors of flats over the noodle bar
function barFront(c) {
  c.rect(SIDE_X + 1, 22, 117, FOOT - 22, "a")
  for (const y of [38, 54]) c.hline(SIDE_X + 1, y, 117, "A")
  c.rect(SIDE_X + 1, 22, 117, 3, "M"); c.hline(SIDE_X + 1, 22, 117, "n")
  // windows of the flats: one lit behind a curtain, one blue with a TV, one dark
  for (const [x, kind] of [[42, "dark"], [76, "lit"], [112, "tv"]]) {
    c.rect(x, 29, 22, 15, kind === "lit" ? "Y" : kind === "tv" ? "x" : "e"); c.box(x - 1, 28, 24, 17, "k"); c.hline(x - 1, 45, 24, "b")
    if (kind === "lit") { c.rect(x, 29, 6, 15, "y"); c.rect(x + 16, 29, 6, 15, "y"); c.rect(x + 9, 37, 4, 7, "y"); c.circ(x + 11, 35, 2, "y") }
    if (kind === "tv") { c.rect(x + 12, 36, 7, 5, "C"); c.rect(x + 13, 37, 5, 3, "c"); c.hline(x, 29, 22, "e"); c.hline(x, 31, 22, "e") }
    c.vline(x + 4, 46, 3, "A"); c.vline(x + 17, 46, 5, "A")                                                   // grime under the sills
  }
  c.rect(98, 47, 10, 7, "m"); c.hline(98, 47, 10, "n"); for (let x = 99; x < 107; x += 2) c.vline(x, 49, 4, "M"); c.vline(102, 54, 4, "A")   // an AC unit, its drip
  // the sign band, its neon drawn live (it flickers)
  c.rect(38, 58, 110, 21, "R"); c.box(38, 58, 110, 21, "k"); c.hline(39, 59, 108, "r")
  c.rect(SIDE_X + 1, 79, 117, FOOT - 79, "r"); c.hline(SIDE_X + 1, 79, 117, "R"); c.rect(SIDE_X + 1, 115, 117, 5, "R")
  // the window: fogged by the soup, two diners at the counter
  c.rect(40, 86, 47, 26, "Y"); c.rect(40, 86, 47, 6, "W")
  for (const [x, y] of [[54, 99], [70, 100]]) { c.circ(x, y, 3, "y"); c.rect(x - 5, y + 3, 11, 7, "y") }
  c.rect(40, 106, 47, 6, "y"); c.hline(40, 106, 47, "W")
  c.vline(63, 86, 26, "R"); c.box(39, 85, 49, 28, "k")
  // the door, open: warm light, a noren curtain over it
  c.rect(95, 84, 20, FOOT - 84, "W"); c.rect(99, 102, 12, 10, "Y"); c.hline(99, 102, 12, "y"); c.box(94, 83, 22, FOOT - 82, "k")
  for (let i = 0; i < 4; i++) { c.rect(95 + i * 5, 84, 4, 9, "U"); c.vline(95 + i * 5, 84, 9, "u") }
  // a little lit menu box
  c.rect(120, 88, 12, 15, "W"); c.box(119, 87, 14, 17, "k"); for (let y = 90; y < 102; y += 3) c.hline(122, y, 8, "y")
  // the drainpipe between the buildings
  c.rect(148, 22, 4, FOOT - 22, "m"); c.vline(148, 22, FOOT - 22, "n"); c.vline(151, 22, FOOT - 22, "M")
  for (const y of [40, 70, 100]) c.hline(147, y, 6, "k")
}
// the tower that carries the ad screen
function screenBlock(c) {
  c.rect(152, 0, W - 152, FOOT, "a")
  for (let x = 180; x < W; x += 28) c.vline(x, 0, FOOT, "A")
  for (const y of [70, 96]) c.hline(152, y, W - 152, "A")
  // the screen's housing and its brackets; cables hang off its belly
  const { x, y, w, h } = SCREEN
  c.rect(x - 4, y - 4, w + 8, h + 8, "M"); c.box(x - 4, y - 4, w + 8, h + 8, "k"); c.hline(x - 3, y - 3, w + 6, "m")
  c.hline(x - 3, y + h + 2, w + 6, "n")
  for (const bx of [182, 256]) { c.rect(bx, y + h + 4, 4, 6, "M"); c.vline(bx, y + h + 4, 6, "k") }
  c.wire(196, y + h + 4, 214, y + h + 4, 7, "k"); c.wire(206, y + h + 4, 236, y + h + 4, 10, "k"); c.wire(232, y + h + 4, 246, 84, 4, "k")
  // a pipe run along the wall
  c.rect(152, 73, W - 152, 3, "m"); c.hline(152, 72, W - 152, "n"); c.hline(152, 76, W - 152, "M")
  for (let px = 160; px < W; px += 30) c.rect(px, 71, 2, 6, "k")
  c.hline(152, 80, W - 152, "M")
  // the shutter of a shop closed for good, a tag on it
  c.rect(166, 86, 62, FOOT - 86, "m")
  for (let yy = 87; yy < FOOT; yy += 2) c.hline(166, yy, 62, "M")
  c.box(165, 85, 64, FOOT - 84, "k"); c.rect(165, 84, 64, 2, "M"); c.hline(167, FOOT - 2, 60, "n")
  c.text(180, 106, "NO SLEEP", "#8a4aa8", { font: "5x7" })
  // posters, rained on
  c.rect(234, 88, 14, 18, "w"); c.rect(236, 90, 10, 7, "U"); c.hline(236, 99, 10, "M"); c.hline(236, 102, 7, "M")
  c.rect(250, 92, 13, 16, "#7a8aa8"); c.rect(252, 94, 9, 5, "#3a4890"); c.hline(252, 101, 9, "M"); c.poly([250, 108, 256, 108, 250, 102], "a")
  // pipes down the right edge
  c.rect(306, 0, 4, FOOT, "m"); c.vline(306, 0, FOOT, "n"); c.rect(313, 0, 3, FOOT, "M"); c.vline(313, 0, FOOT, "m")
  for (const yy of [20, 50, 90]) c.hline(305, yy, 12, "k")
}
const PUDDLES = [[100, 139, 24, 3], [163, 159, 22, 3], [212, 146, 26, 4], [58, 166, 32, 5], [266, 170, 30, 5], [300, 141, 16, 2], [20, 152, 12, 3], [190, 174, 20, 3]]
function street(c) {
  for (let x = 0; x < W; x++) for (let y = Math.round(floorTop(x)); y < H; y++) c.px(x, y, y < CURB ? "g" : "f")
  // the sidewalk's slabs: joints along it, and across it toward the vanishing point
  c.hline(SIDE_X, 125, W - SIDE_X, "G")
  for (let bx = SIDE_X + 10; bx < W + 40; bx += 18) {
    const x1 = VP[0] + (bx - VP[0]) * (CURB - VP[1]) / (FOOT - VP[1])
    c.line(bx, FOOT, Math.round(x1), CURB - 1, "G")
  }
  c.hline(0, CURB, W, "h"); c.hline(0, CURB + 1, W, "F")                     // the kerb
  for (let x = 12; x < W; x += 34) c.hline(x, 157, 12, "h")                  // the lane line, worn
  c.line(80, 150, 96, 148, "F"); c.line(96, 148, 104, 152, "F"); c.line(230, 162, 246, 166, "F")   // cracks
  c.ellipse(206, 168, 9, 2, "F"); c.hline(200, 168, 13, "h")                 // a manhole
  c.rect(276, CURB + 1, 14, 2, "k"); for (let x = 277; x < 290; x += 2) c.px(x, CURB + 1, "M")   // a storm drain
  c.rect(228, 122, 16, 6, "k"); for (let x = 229; x < 244; x += 2) c.vline(x, 123, 4, "M")      // the steam vent's grate
  for (const [x, y, rx, ry] of PUDDLES) c.ellipse(x, y, rx, ry, "p")
}
sprite("_set", { w: W, h: H }, (c) => { sky(c); barFront(c); screenBlock(c); sideWall(c); street(c) })

// ------------------------------------------------------------------ what moves
anim("_clock", { w: 1, h: 1, frames: FR, fps: 10 }, () => {})

// the broken ad screen: half the ad (a sleeping face, NAGI·WA: SLEEP BETTER), half static with an eye
function screen(c) {
  const f = fr(c), { x: X0, y: Y0, w, h } = SCREEN
  c.rect(X0, Y0, w, h, "L"); c.rect(X0, Y0, w, 18, "l")
  c.circ(172, 16, 5, "v"); c.circ(174, 14, 5, "l")                                                   // a moon
  for (const [sx, sy] of [[184, 9], [168, 28], [190, 34], [178, 22]]) c.px(sx, sy, "v")
  // the face, eyes shut, smiling
  c.ellipse(204, 28, 11, 13, "s"); c.rect(200, 40, 8, 4, "s"); c.vline(193, 24, 9, "S")
  c.ellipse(204, 19, 12, 7, "6"); c.rect(192, 19, 3, 12, "6"); c.rect(214, 19, 3, 10, "6")
  for (const ex of [198, 208]) { c.hline(ex, 27, 3, "6"); c.px(ex - 1, 28, "6"); c.px(ex + 3, 28, "6"); c.hline(ex, 30, 3, "9") }
  c.px(203, 32, "S"); c.hline(200, 35, 7, "S"); c.px(199, 34, "S"); c.px(207, 34, "S")
  c.ellipse(204, 49, 20, 5, "v"); c.ellipse(204, 48, 18, 3, "l")                                      // the pillow
  c.text(166, 44, "NAGI WA:", "v"); c.px(183, 46, "v"); c.text(166, 51, "SLEEP", "v"); c.text(166, 57, "BETTER", "0")
  // the other half has gone to static: its edge tears row by row, and moves
  for (let y = Y0; y < Y0 + h; y++) {
    const edge = 208 + Math.floor(ihash(y >> 1, f) * 9) - (y > 40 ? 8 : 0)
    const tear = ihash(y, f, 3) < 0.07
    for (let x = edge; x < X0 + w; x++) {
      const r = ihash(x, y, f + 17)
      c.px(x, y, tear ? (r < 0.5 ? "c" : "v") : r < 0.5 ? "x" : r < 0.78 ? "C" : r < 0.94 ? "c" : "v")
    }
  }
  // the eye, huge, looking down to the street; it narrows once a loop
  const cx = 250, cy = 33, rx = 22, ry = f === 6 || f === 7 ? 4 : 10
  for (let x = cx - rx; x <= cx + rx; x++) {
    const t = 1 - ((x - cx) / rx) ** 2, top = Math.round(cy - ry * t), bot = Math.round(cy + ry * 0.8 * t)
    for (let y = top; y <= bot; y++) c.px(x, y, "v")
    c.px(x, top - 1, "x"); c.px(x, bot + 1, "x")
    if (x % 4 === 0 && Math.abs(x - cx) < rx - 3) c.px(x - 1, top - 2, "x")
  }
  c.clip((x, y) => { const t = 1 - ((x - cx) / rx) ** 2; return t > 0 && y >= cy - ry * t && y <= cy + ry * 0.8 * t }, () => {
    c.circ(cx - 4, cy + 3, 8, "C"); c.circ(cx - 4, cy + 3, 6, "c"); c.circ(cx - 4, cy + 3, 3, "x"); c.rect(cx - 8, cy - 1, 2, 2, "0")
  })
  // the crack where something hit it, dead pixels round the impact
  const IX = 212, IY = 16
  for (const [tx, ty] of [[194, 6], [230, 6], [236, 46], [208, 63], [178, 40], [276, 22]]) c.line(IX, IY, tx, ty, "x")
  for (const [tx, ty] of [[196, 6], [237, 46], [209, 63]]) c.line(IX + 1, IY, tx, ty, "v")
  c.rect(IX - 2, IY - 1, 5, 3, "x"); c.px(IX, IY, "v")
  // a glitch band rolls up the picture, sliding a strip sideways
  const by = Y0 + h - 1 - ((f * 5) % h)
  for (let y = by; y < Math.min(Y0 + h, by + 3); y++) {
    const row = []; for (let x = X0; x < X0 + w; x++) row.push(c.key(x, y))
    for (let x = X0; x < X0 + w; x++) c.px(x, y, row[(x - X0 + w - 4) % w] || "x")
  }
}

// the neon over the door; the last C has a bad transformer
function neon(c) {
  const f = fr(c), bad = f === 3 || f === 4 || f === 9
  c.text(58, 64, "LUCKY STATIC", (j) => j === 11 && bad ? "o" : "N", { font: "5x7" })
  // a neon bowl with chopsticks at the left, a tube border along the bottom of the box
  c.hline(42, 68, 11, "N"); c.line(42, 68, 44, 72, "N"); c.line(52, 68, 50, 72, "N"); c.hline(45, 73, 5, "N")
  c.line(47, 61, 50, 67, "O"); c.line(50, 61, 52, 66, "O")
  c.hline(41, 76, 104, "o"); c.hline(41, 76, f === 9 ? 40 : 104, "N")
}

// the drone: it bobs, its eye pulses
const BOB = [0, 0, 1, 1, 1, 0, 0, -1, -1, -1, 0, 0]
function drone(c) {
  const f = fr(c)
  c.stamp("drone", DRONE[0], DRONE[1] + BOB[f])
  if (f % 4 < 2) c.px(DRONE[0] + 9, DRONE[1] + BOB[f] + 5, "0")
}

function steam(c) {
  for (const [vx, vy, d, i] of [[236, 122, 0, 1], [68, 105, 5, 2]])
    c.plume(vx, vy, "wnm", { every: 3, life: 24, rise: i === 1 ? 26 : 14, wind: 0.25, size: i === 1 ? [2, 6] : [1, 3], seed: i, frame: c.frame + d })
}

// ------------------------------------------------------------------ after the light: wet ground, rain
// The wet street mirrors what stands on it, squashed: the wall in every patch of tarmac a little,
// clearly in the puddles, rippling there; Juno's own reflection in the puddle at her feet.
const FLOOR_KEYS = "fFhgGp", JUNO_KEYS = "JjtTBiIzZck"
let MASK = null                   // 1 street, 2 puddle, 3 Juno: taken before the light, when the keys still say what is what
function markFloor(c) {
  MASK = new Uint8Array(W * H)
  for (let y = FOOT; y < H; y++) for (let x = 0; x < W; x++) {
    const k = c.key(x, y)
    if (!k) continue
    if (FLOOR_KEYS.includes(k) && y >= floorTop(x)) MASK[y * W + x] = k === "p" ? 2 : 1
    else if (JUNO_KEYS.includes(k) && x >= JUNO[0] && x < JUNO[0] + 20 && y >= JUNO[1]) MASK[y * W + x] = 3
  }
}
function reflections(c) {
  const f = fr(c)
  for (let y = FOOT + 1; y < H; y++) for (let x = 0; x < W; x++) {
    const m = MASK[y * W + x]
    if (m !== 1 && m !== 2) continue
    // the tarmac smears it into vertical streaks of the bright things only; a puddle holds a picture
    const wet = m === 2, rip = wet ? Math.round(Math.sin(y * 1.3 + f * Math.PI / 3) * 1.2) : 0
    const sy = Math.round(FOOT - (y - FOOT) * 1.8), sx = x + rip
    if (sy < 0 || !inside(sx, sy)) continue
    let src = c.get(sx, sy)
    if (!wet) for (let d = -4; d <= 4; d++) {                     // each light stretched down into a streak
      const v = inside(sx, sy + d) ? c.get(sx, sy + d) : 0, k = 1 - Math.abs(d) / 6
      src = ((Math.max(src >>> 24, Math.round((v >>> 24) * k)) << 24) | (Math.max((src >>> 16) & 255, Math.round(((v >>> 16) & 255) * k)) << 16) | (Math.max((src >>> 8) & 255, Math.round(((v >>> 8) & 255) * k)) << 8) | 255) >>> 0
    }
    const hi = Math.max(src >>> 24, (src >>> 16) & 255, (src >>> 8) & 255) / 255
    addLight(c, x, y, src, wet ? 0.5 : (y < CURB ? 0.16 : 0.24) * hi * hi * hi)
    if (wet) {
      const jy = 2 * 154 - y
      if (jy > 110 && MASK[jy * W + sx] === 3) tint(c, x, y, c.get(sx, jy), 0.55)
    }
  }
}
const RAIN = Array.from({ length: 170 }, (_, i) => [ihash(i, 1) * (W + 60), ihash(i, 2) * 195, ihash(i, 3) < 0.25])
function rain(c) {
  const f = fr(c), pale = hexI("#b4c4ec")
  for (const [x0, y0, near] of RAIN) {
    const y = ((y0 + f * 16.25) % 195) - 10, x = Math.round(x0 - y / 4), len = near ? 7 : 4
    for (let i = 0; i < len; i++) {
      const yy = Math.round(y) + i, xx = x + Math.floor(i / 4)
      if (inside(xx, yy)) tint(c, xx, yy, pale, near ? 0.42 : 0.24)
    }
  }
  // splashes on the street and in the puddles
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(ihash(i, f, 5) * W), y = Math.round(FOOT + 2 + ihash(i, f, 6) * (H - FOOT - 3))
    if (y < floorTop(x)) continue
    tint(c, x, y, pale, 0.55); tint(c, x - 1, y - 1, pale, 0.35); tint(c, x + 1, y - 1, pale, 0.35)
  }
}
// the drone's searchlight: a cone of lit rain-haze, a hard pool on the street
const POOL = [246, 160, 24, 5]
function searchlight(c) {
  const f = fr(c), col = hexI("#d8ecff")
  const sx = DRONE[0] + 9, sy = DRONE[1] + BOB[f] + 8, [px0, py0, rx, ry] = POOL
  for (let y = sy; y <= py0; y++) {
    const t = (y - sy) / (py0 - sy), half = 1 + t * rx, cx = sx + (px0 - sx) * t
    for (let x = Math.floor(cx - half); x <= Math.ceil(cx + half); x++) {
      const e = Math.max(0, Math.min(1, (half - Math.abs(x - cx)) / 3))
      addLight(c, x, y, col, 0.07 * e + 0.05 * (1 - t) * e)
    }
  }
  for (let y = py0 - ry; y <= py0 + ry; y++) for (let x = px0 - rx; x <= px0 + rx; x++) {
    const d = ((x - px0) / rx) ** 2 + ((y - py0) / ry) ** 2
    if (d <= 1) addLight(c, x, y, col, d < 0.45 ? 0.32 : 0.18)
  }
}

// ------------------------------------------------------------------ the scene
scene("mock_b_side", { w: W, h: H, bg: "k" },
  stamp("_clock", -4, -4),
  layer("set", stamp("_set", 0, 0)),
  layer("screen", screen),
  layer("neon", neon),
  layer("props",
    vline(48, 86, 24, "M"),                                                      // the umbrella's pole
    stamp("cook", 54, 92), stamp("cart", CART[0], CART[1] - 4), stamp("umbrella", 32, 78), px(54, 91, "W"),
    stamp("bags", 117, 106), stamp("vending", 272, 76)),
  layer("juno", stamp("juno", JUNO[0], JUNO[1])),
  layer("drone", drone),
  markFloor,
  (c) => {
    const f = fr(c), fl = f === 3 || f === 4 || f === 9 ? 0.85 : 1
    c.lamp(96, 68, { r: 80, color: "#ff48b8", power: 1.1 * fl })                 // LUCKY STATIC
    c.lamp(105, 112, { r: 70, color: "#ffb868", power: 1.1 })                    // the open door
    c.lamp(146, 112, { r: 46, color: "#ffe6c0", power: 1.2 })                  // the menu box and the door's spill: Juno's warm key
    c.lamp(64, 104, { r: 46, color: "#ffa850", power: 0.9 })                     // the window
    c.lamp(54, 93, { r: 26, color: "#ffd890", power: 0.9 })                      // the cook's bulb
    c.lamp(196, 40, { r: 130, color: "#a8f0ff", power: 1.15 })                   // the screen
    c.lamp(252, 40, { r: 120, color: "#70d8ff", power: 1.1 })
    c.lamp(286, 100, { r: 40, color: "#a0fff0", power: 0.9 })                    // the vending machine
    c.lamp(259, 84, { r: 22, color: "#ff2030", power: 1 })                       // the drone's eye
    c.lamp(POOL[0], POOL[1], { r: 34, color: "#e0f0ff", power: 1.05 })           // its searchlight on the street
    c.lamp(19, 51, { r: 30, color: "#30ffc0", power: 0.9 })                      // EXIT
    c.lamp(22, 78, { r: 18, color: "#ffc070", power: 0.7 })                      // deep in the alley
  },
  lighting({ cell: 2, smooth: true, ambient: 0.3, ambientColor: "#5868a8", emit: EMIT }),
  reflections,
  layer("steam", { opacity: 0.4 }, steam),
  searchlight,
  glow("NO", { r: 6, strength: 0.45 }),
  glow("cv0", { where: [SCREEN.x - 6, SCREEN.y - 6, SCREEN.w + 12, SCREEN.h + 12], r: 8, strength: 0.3 }),
  glow("WY", { r: 5, strength: 0.3 }),
  glow("X", { r: 4, strength: 0.6 }),
  glow("8V", { r: 4, strength: 0.35 }),
  rain,
  // ---------------------------------------------------------------- modern interface (never lit)
  layer("ui",
    (c) => {
      const x = 4, y = 4, ink = "#0a0812"
      c.rect(x + 1, y, 22, 24, ink); c.rect(x, y + 1, 24, 22, ink)
      c.rect(x + 1, y + 1, 22, 22, "#ffd23c"); c.rect(x + 2, y + 2, 20, 20, "#1a2440")
      c.clip([x + 2, y + 2, 20, 20], () => c.stamp("ui_juno", x + 3, y + 4))
      say(c, x + 1, y + 27, "Juno", "#ffd23c", { outline: ink })
      c.stamp("ui_bag", 295, 5)
      say(c, JUNO[0] + 10, 94, "It... said my name.", "#ffd23c", { align: "c", outline: ink })
      say(c, 258, 50, "Broken ad screen", "#f4f0ff", { align: "c", outline: ink })
    },
    stamp("cur_hand", 214, 46)))
