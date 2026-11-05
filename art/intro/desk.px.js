// The intro's shot 2 (docs/kapitel0-design.md §5): Juno at her desk in 2088, close, from behind her shoulder. She sits
// on the right of the picture looking left, as on the title, because the implant's line is on her LEFT cheek: her
// back and the back of her head, her ear, the point behind it, the cheek in the monitor's light. Before her the
// monitor with a camera's street in the phosphor; behind it the hall's wall of screens, out of focus. In 2.39:1
// bars, so what matters lies between y 23 and y 157.
//   intro_desk_bg   320x180, a still: all of that. What moves is the game's (game/intro_desk.js): the people in
//                   the feed, the man who stops, her brackets, the implant's point lighting, her hand.
//   intro_desk_last the same when the hall has gone dark round her: the wall behind out, her monitor the last one on
//   intro_desk_dark her monitor out too, the room almost black, her face from the title in the dead glass, turned
//                   to her (art/intro/juno_face.data.js)
// The feed's text is the city's tech, in English.
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e", 5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",   // the phosphor
  k: "#0c0e1a", n: "#06080f", A: "#131a2a", B: "#1a2337", C: "#232f47", D: "#2f3e5a", E: "#41547a",                                          // ink, night steel
  g: "#565e70", G: "#8e96a8", h: "#3d4656",                                                                                                 // Halcyon's grey, its shade
  S: "#d79676", s: "#93583f", O: "#552b1c", l: "#a9c29c", m: "#6f8f76",                                                                       // skin; skin in the monitor's light
  c: "#123c4e", v: "#62def0",                                                                                                                // the lanyard, the implant
})
include("../lib/text.js")
include("./juno_face.data.js")

const W = 320, H = 180
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const bay = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16
const hash = (i, s) => { let h = (i * 374761393 + s * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
const lerp = (table, x) => { for (let i = 1; i < table.length; i++) if (x <= table[i][0]) { const [a, va] = table[i - 1], [b, vb] = table[i]; return va + ((vb - va) * (x - a)) / (b - a) } return table[table.length - 1][1] }
const inE = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1
const DIM = { 9: "8", 8: "7", 7: "6", 6: "5", 5: "4", 4: "3", 3: "2", 2: "1", 1: "0", 0: "0" }

const SX = 35, SY = 35, SW = 174, SH = 86      // the monitor's picture (the game draws the people into it)

// a street from a camera on a pole: shop fronts, the pavement, the kerb, the wet road with the shops' lights in it
function street(x, y) {
  if (y < 36) {
    const shop = Math.floor(x / 58), lx = x - shop * 58
    if (y < 8) return lx % 12 < 7 && y > 2 && y < 7 && hash(Math.floor(lx / 12) + shop * 9, 3) < 0.4 ? "4" : "2"   // the floor above, a few lit
    if (lx < 3) return "1"
    if (y < 14) return shop === 1 ? (lx > 10 && lx < 48 ? "7" : "3") : "3"                                       // the sign's band
    if (shop === 2) return y % 3 === 0 ? "2" : "3"                                                               // a shutter, down at this hour
    return y > 30 ? "3" : lx > 8 && lx < 50 ? (lx % 14 < 2 ? "3" : shop === 0 ? "5" : "6") : "3"                 // a lit window
  }
  if (y < 58) return (x + (y - 36) * 2) % 24 < 1 || (y - 36) % 11 === 0 ? "4" : "5"                              // the pavement's slabs
  if (y < 60) return "7"                                                                                         // the kerb
  if (y >= 71 && y <= 72 && x % 22 < 11) return "6"                                                              // the road's dashes
  const lit = (x % 58 > 12 && x % 58 < 44 && Math.floor(x / 58) !== 2) ? 0.35 - (y - 60) / 90 : 0                 // the windows' light on the wet road
  return bay(x, y) < lit ? "4" : "3"
}

// mode: "lit" everything on; "last" the wall out, her monitor on; "dark" all out
function paint(c, mode) {
  // the hall behind: its wall of screens, out of focus: soft blocks, nothing to read
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = Math.floor(x / 26), j = Math.floor(y / 17), edge = x % 26 < 2 || y % 17 < 2, q = hash(i * 13 + j, 1)
    c.px(x, y, mode !== "lit" ? (edge ? "1" : "0") : edge ? "1" : q < 0.2 ? "4" : q < 0.65 ? "3" : "2")
  }
  // the desk, lit by the monitor: brightest under the picture, falling off to the right
  for (let y = 130; y < H; y++) for (let x = 0; x < W; x++) {
    const d = Math.abs(x - 122) / 150 + (y - 130) / 70
    c.px(x, y, y < 132 ? "D" : bay(x, y) < 0.75 - d ? "5" : bay(x, y) < 1.15 - d ? "3" : "A")
  }
  // the monitor: its stand, its case, the picture with its scanlines and the camera's display
  c.rect(108, 124, 28, 10, "A"); c.rect(96, 130, 52, 4, "C"); c.hline(96, 130, 52, "D")
  c.rect(SX - 5, SY - 5, SW + 10, SH + 10, "A"); c.hline(SX - 5, SY - 5, SW + 10, "D"); c.vline(SX + SW + 4, SY - 4, SH + 8, "k")
  c.rect(SX - 1, SY - 1, SW + 2, SH + 2, "k")
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) { const k = street(x, y); c.px(SX + x, SY + y, y % 2 ? DIM[k] : k) }
  TXT.draw(c, SX + 4, SY + 3, "CAM 2217", "9", { font: "hud", outline: "1" })
  TXT.draw(c, SX + 4, SY + 10, "LOWER NINTH / KOWALSKI ST", "8", { font: "hud", outline: "1" })
  TXT.draw(c, SX + SW - 4, SY + SH - 8, "2088-04-30 05:44", "8", { font: "hud", align: "right", outline: "1" })
  // the keyboard, its keys in the monitor's light
  c.rect(72, 138, 92, 13, "B"); c.hline(72, 138, 92, "E")
  for (let y = 140; y < 150; y += 3) for (let x = 74 + (y % 2); x < 161; x += 4) c.rect(x, y, 3, 2, x < 130 ? "4" : "3")

  // Juno, from behind, in her chair: its high back is nearest to us and hides her body up to the collar. Only a
  // strip of her near arm shows beside it, in flat bands of the grey, the edge toward the monitor catching its light.
  // The forearm first, going away from us to the keys, narrower toward the wrist; the upper arm comes over its elbow
  for (let t = 0; t <= 1; t += 0.01) {
    const x = Math.round(202 + (171 - 202) * t), y = Math.round(164 + (146 - 164) * t), r = Math.round(7 - 3 * t)
    for (let dy = -r; dy <= r; dy++) c.rect(x, y + dy, 2, 1, dy === -r ? "G" : dy <= 1 ? "g" : "h")
  }
  c.rect(170, 142, 3, 9, "h"); c.vline(170, 142, 9, "g")                                                       // the cuff
  // the jacket: neck, the near shoulder down into the arm; the far shoulder out of the picture
  const JACKET = [[247, 112], [233, 117], [221, 124], [212, 134], [207, 150], [204, 180], [320, 180], [320, 131], [304, 123], [288, 112]]
  const inJacket = (x, y) => { let on = false; for (let i = 0, j = JACKET.length - 1; i < JACKET.length; j = i++) {
    const [xi, yi] = JACKET[i], [xj, yj] = JACKET[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) on = !on } return on }
  for (let y = 112; y < H; y++) for (let x = 190; x < W; x++) {
    if (!inJacket(x, y)) continue
    if (!inJacket(x - 1, y) || !inJacket(x - 1, y - 1) || !inJacket(x, y - 1) && x < 248) { c.px(x, y, "8"); continue }   // the monitor's light on its edge
    c.px(x, y, x < 214 ? "G" : "g")
  }
  // the neck, into the collar
  for (let y = 100; y < 128; y++) { const l = lerp([[100, 248], [128, 244]], y), r = lerp([[100, 278], [114, 278], [128, 286]], y)
    for (let x = Math.round(l); x < r; x++) c.px(x, y, (x - l) < 4 ? "l" : (x - l) < 12 ? "S" : (x - l) < 24 ? "s" : "O") }
  // the collar closes round the neck: the neckline curves up from both shoulders, a lit lip along it, rolled and
  // darker at its ends; nothing of the neck shows below it
  for (let y = 104; y < 122; y++) for (let x = 230; x < 298; x++) {
    if (!inE(x, y, 262, 124, 33, 15)) continue
    const lip = !inE(x, y, 262, 126, 32, 15), end = x < 238 || x > 287
    c.px(x, y, lip ? (end ? "g" : "G") : end ? "h" : x < 272 ? "g" : "h")
  }
  // the chair's back, nearest of all: a padded shell, its rounded top under her collar, the monitor's light on its
  // edge, a lit rim, stitched channels running up it, darker away from the monitor
  const chair = (x) => lerp([[213, 180], [215, 150], [222, 132], [234, 122], [250, 118], [290, 118], [320, 120]], x)
  for (let x = 213; x < W; x++) { const top = Math.round(chair(x))
    for (let y = top; y < H; y++) {
      const edge = y < chair(x - 1) || x === 213
      c.px(x, y, edge ? "7" : y === top ? "E" : (x === 240 || x === 268 || x === 296) && y > top + 2 ? "A" : x < 228 ? "D" : x < 262 ? "C" : "B")
    } }
  // the head: skull and jaw; hair over the skull and behind the ear, skin before it (a lost profile: we see the
  // cheek, not the eye); the monitor's light along the cheek's edge and the hair's
  const head = (x, y) => inE(x, y, 254, 80, 28, 32) || inE(x, y, 241, 91, 14, 17)
  const line = [[64, 226], [70, 234], [78, 244], [84, 248], [92, 252], [100, 258], [108, 268], [114, 278]]    // where the hair ends, by row
  for (let y = 44; y < 114; y++) for (let x = 216; x < 290; x++) {
    if (!head(x, y)) continue
    const edge = !head(x - 2, y), edge2 = !head(x - 5, y)
    if (y < 64 || x >= lerp(line, y)) {
      // hair: nearly black, its strands, a sheen on the crown; the green rim toward the monitor
      if (edge) { c.px(x, y, "7"); continue }
      if (edge2) { c.px(x, y, "4"); continue }
      const sheen = inE(x, y, 244, 58, 16, 9)
      const strand = (Math.floor((x + y * 0.6) / 4) + Math.floor(y / 9)) % 4 === 0
      c.px(x, y, sheen ? (strand ? "C" : "B") : strand ? "A" : "k")
      continue
    }
    // skin: the cheek in the monitor's light, warm further back, the shadow under the jaw
    const back = x - lerp([[64, 228], [80, 227], [96, 228], [108, 238]], y)
    // the cheek's plane, turning away toward the ear; the jaw's shadow
    c.px(x, y, back < 2 ? "l" : back < 4 ? "m" : y > 102 || back > 15 - Math.max(0, y - 88) * 0.4 ? "s" : "S")
  }
  // the fringe over the temple, a few strands past the hairline
  for (const [x, y, n] of [[232, 66, 7], [236, 68, 8], [240, 70, 8]]) c.vline(x, y, n, "k")
  // the ear, in front of the hair; the implant's point behind it and the line over the cheek, dim until she tags
  // (the game lights them)
  for (let y = 80; y < 100; y++) for (let x = 248; x < 262; x++) if (inE(x, y, 255, 90, 6, 10)) c.px(x, y, inE(x, y, 256, 90, 3, 6) ? "s" : x < 252 ? "S" : "s")
  c.rect(255, 86, 2, 7, "O")
  c.rect(264, 88, 3, 3, "c"); c.px(265, 89, "v")
  if (mode !== "dark") return
  // all out: only what little light is left, then the dead glass with her face in it, turned to her
  const DARK = { 9: "C", 8: "C", 7: "B", 6: "B", 5: "2", 4: "2", 3: "1", 2: "1", G: "g", g: "h", h: "C", S: "s", s: "O", l: "s", m: "s", O: "A", E: "C", D: "C", C: "B", B: "A", A: "k", c: "A", v: "c" }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = c.key(x, y), d = DARK[k]; if (d) c.px(x, y, d) }
  c.rect(SX, SY, SW, SH, "0")
  const fx = SX + 112, fy = SY + 20
  // a reflection in a monitor is never sharp: only a raster of her, fading out toward the back of her head
  for (let y = SY; y < SY + SH; y++) for (let x = SX; x < SX + SW; x++) {
    if (y % 2) continue
    if ((inE(x, y, fx + 8, fy + 18, 15, 20) || inE(x, y, fx + 8, SY + SH + 8, 32, 24)) && bay(x, y) < 0.32) c.px(x, y, "1")   // her hair, her shoulders
    if (y > fy + 34 && inE(x, y, fx + 10, fy + 46, 7, 12) && bay(x, y) < 0.5) c.px(x, y, "2")                                 // her neck
  }
  // the face, on the raster's rows; toward the back (where the title's hood cut it off) it thins out and darkens
  JUNO_FACE.forEach((row, j) => { for (let i = 0; i < row.length; i++) {
    const x = fx + i, y = fy + j, front = (i - 1) / 12
    if (row[i] === "." || bay(x, y) > front * 1.25) continue
    const k = front < 0.45 ? DIM[row[i]] : row[i]
    c.px(x, y, y % 2 ? DIM[k] : k)
  } })
}
sprite("intro_desk_bg", { w: W, h: H }, (c) => paint(c, "lit"))
sprite("intro_desk_last", { w: W, h: H }, (c) => paint(c, "last"))
sprite("intro_desk_dark", { w: W, h: H }, (c) => paint(c, "dark"))
