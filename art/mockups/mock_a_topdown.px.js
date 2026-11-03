// Style mockup A: "Dreamweb-like top-down". The moment from docs/mockups/BRIEF.md: night, heavy rain,
// the street outside the noodle bar LUCKY STATIC, Juno staring at the broken ad screen that said her name.
// A small play window seen straight down (roofs and heads from above, what stands against the north
// wall shows a strip of its front), framed in a chunky riveted HUD: Juno's portrait in profile, the
// location bar, the inventory and look icons, a wrist-watch clock, a zoom window magnifying what is
// under the cursor and the hover label under it.
// 320x180, an 8-frame loop at 10 fps: the rain, the screen's static, the steam, the drone's eye.
pal({
  k: "#0b0d12",                                                              // ink
  1: "#171a21", 2: "#22262e", 3: "#30353f", 4: "#454b57", 5: "#646b78", 6: "#8f96a3",   // HUD steel
  a: "#0c141b", b: "#121e27", c: "#1a2a34", d: "#243a45", e: "#335060",      // wet street, night blue
  f: "#10151d", g: "#192029", h: "#252f3b", i: "#364454",                    // walls and roofs
  t: "#0f4652", u: "#1f8e9c", v: "#5fe6ee", w: "#dcffff",                    // the screen's cold cyan
  m: "#5e1648", n: "#c22c86", N: "#ff5cc0", M: "#ffc4ec",                    // magenta neon
  A: "#4a2810", B: "#9a5418", D: "#e8962c", E: "#ffd488",                    // warm amber (the bar)
  x: "#6e5208", y: "#c09010", Y: "#f5d020", Z: "#fff59a",                    // Juno's slicker
  U: "#5a3030", T: "#a0644e", S: "#d89a7c", j: "#1c1620",                    // skin, hair
  q: "#6a0c14", Q: "#ff3434",                                                // the drone's red
  l: "#6f8ea0", L: "#b4d0dc",                                                // rain
  r: "#4e2420", R: "#86402c", X: "#b0603e",                                  // rust, the umbrella, the strap
  o: "#c8601a", O: "#ffa030",                                                // HUD lettering
  7: "#26142c", 8: "#43204c",                                                // street under magenta
  9: "#0f3440", 0: "#185262",                                                // street under cyan
  F: "#2e2016", G: "#56381c",                                                // street under amber
  K: "#2e3a2c", P: "#8c9a7c", V: "#a8b694",                                  // the watch's LCD
  H: "#4cd86a",                                                              // exit green
})
ramps("k123456", "abcde", "fghi", "tuvw", "mnNM", "ABDE", "xyYZ", "UTS", "qQ", "lL", "rRX", "oO", "78", "90", "FG", "KPV")

include("../../.claude/skills/claude-pxl/lib/ui/font5x7.px.js")

const W = 320, H = 180, FR = 8
const PX = 110, PY = 38, PW = 156, PH = 136         // the play window, inside its pipe frame
const SCR = [67, 11, 60, 22]                         // the ad screen, in the play window
const ZOOM = [10, 119, 18, 12, 3]                    // zoom window: where, world px across and down, magnification
const EYE0 = [36, 5]                                 // the corner of the screen the zoom shows (the eye)

anim("_clock", { w: 1, h: 1, frames: FR, fps: 10 }, () => {})

// ordered dither between ramp steps; v runs over the ramp's indices
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const bayer4 = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16
const tone = (ramp, v, x, y, sharp = 2) => {
  const i = Math.floor(v), fr = Math.min(1, Math.max(0, (v - i - 0.5) * sharp + 0.5))
  return ramp[Math.min(ramp.length - 1, Math.max(0, i + (fr > bayer4(x, y) ? 1 : 0)))]
}
const ih = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
const vn = (x, y, s = 8, seed = 0) => {
  const X = Math.floor(x / s), Y = Math.floor(y / s), fx = x / s - X, fy = y / s - Y
  const p = ih(X + seed * 101, Y), q = ih(X + 1 + seed * 101, Y), r = ih(X + seed * 101, Y + 1), z = ih(X + 1 + seed * 101, Y + 1)
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  return p + (q - p) * sx + (r - p) * sy + (p - q - r + z) * sx * sy
}
// recolor the pixels of some keys by a value along a ramp, dithered
const shadeKeys = (c, keys, ramp, f, box = [0, 0, c.w, c.h], sharp = 2) => {
  const [x0, y0, w, h] = box
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (c.is(x, y, keys)) c.px(x, y, tone(ramp, f(x, y), x, y, sharp))
}

// ================================================================ the broken ad screen
// One function of (x, y, frame) so the zoom window can show the same pixels three times as big.
// Left: what is left of the advert, a sleeping smiling face ("HALCYON: SLEEP BETTER"). A crack down
// the middle. Right: static, and in it a single huge eye.
const EYE = `
.......wwwwwww.......
....wwwvvvvvvvwww....
..wwvvvvtttttvvvvww..
.wvvvvvtuuuuutvvvvvw.
wvvvvvtuukkkuutvvvvvw
wvvvvvtukkkkwutvvvvvw
wvvvvvtuukkkuutvvvvvw
.wvvvvvtuuuuutvvvvvw.
..wwvvvvtttttvvvvww..
....wwwvvvvvvvwww....
.......wwwwwww.......`.trim().split("\n").map((r) => r.trim())
const FACE = `
...uuuuuu...
.uuwwwwwwuu.
.uwwwwwwwwvu
uwwwwwwwwwwv
uwttwwwwttwv
uwwwwwwwwwvv
uwwwwvvwwwvv
.wtwwwwwwtv.
.wwtttttttv.
..vwwwwwvv..
...vvvvvv...`.trim().split("\n").map((r) => r.trim())
const CRACK = [30, 30, 29, 30, 31, 31, 30, 30, 31, 32, 31, 31, 30, 31, 32, 32, 31, 30, 30, 31, 31, 32]
function screenKey(x, y, f) {
  const cx = CRACK[y] ?? 31
  if (Math.abs(x - cx) === 0) return "w"
  if (Math.abs(x - cx) === 1) return "k"
  // a branch of the crack into the advert
  if ((y === 6 && x >= 24 && x < cx) || (y === 7 && x === 23) || (y === 14 && x > cx && x < cx + 4)) return "w"
  const glitchRow = ih(y, f + 40) < 0.09, sh = glitchRow ? (ih(y, f) < 0.5 ? -3 : 3) : 0
  const xx = x + sh
  if (xx < cx) {
    // the advert: a gradient, the face, the brand under it
    const fy = y - 2, fx = xx - 7
    if (fy >= 0 && fy < FACE.length && fx >= 0 && fx < 12) { const k = FACE[fy][fx]; if (k !== ".") return k }
    if (glitchRow && ih(xx, f) < 0.12) return "N"
    return y < 8 ? (bayer4(xx, y) < (8 - y) / 10 ? "u" : "t") : "t"
  }
  // the static half
  const ex = xx - 35, ey = y - 6
  if (ey >= 0 && ey < EYE.length && ex >= 0 && ex < 21) {
    const k = EYE[ey][ex]
    if (k !== "." && !(glitchRow && ih(xx, f + 9) < 0.35)) return k
  }
  const band = ih(Math.floor(y / 2), f + 3) * 0.4, n = ih(xx * 31 + y, f * 7 + 1) + band
  if (glitchRow && ih(xx, f + 5) < 0.15) return "N"
  return n < 0.55 ? "g" : n < 0.85 ? "t" : n < 1.05 ? "u" : "v"
}

// ================================================================ the play window (straight down)
// The north block: its roof at the top, then a strip of its wall's face: the bar, the drainpipe, the
// screen, a bare stretch the vending machine stands against. The street below, its sidewalk along the
// wall. The east block's roof down the right edge, broken by the alley where stairs go down: the exit.
const SIDEWALK = 42
function ground(c) {
  for (let y = 34; y < PH; y++) for (let x = 0; x < PW; x++) {
    let k
    if (y < SIDEWALK) {                                   // sidewalk: small slabs, a kerb
      const lx = x % 9, side = y === SIDEWALK - 1
      k = side ? "d" : lx === 0 || y === 34 ? "a" : tone("abcde", 1.6 + ih(Math.floor(x / 9), 3) * 0.6 + (vn(x, y, 6) - 0.5), x, y)
    } else if (y === SIDEWALK) k = "a"                    // the gutter
    else {                                                // the street: big worn plates, wet
      const sx = Math.floor((x + 4) / 14), sy = Math.floor((y - SIDEWALK) / 12), lx = (x + 4) % 14, ly = (y - SIDEWALK) % 12
      const wet = vn(x, y, 9, 2), base = 1.0 + ih(sx, sy + 50) * 0.7 + (wet - 0.5) * 1.6 + (vn(x, y, 3, 5) - 0.5) * 0.5
      k = tone("abcde", base, x, y, 1.5)
      if (lx === 0 || ly === 0) k = "a"
      else if ((lx === 1 || ly === 1) && wet > 0.6) k = "d"   // a wet lip catching the light
    }
    c.px(x, y, k)
  }
  // cracks in the plates
  for (const [x, y, n, s] of [[20, 70, 9, 1], [88, 110, 7, 2], [128, 64, 6, 3], [52, 126, 8, 4]]) {
    let px = x, py = y
    for (let i = 0; i < n; i++) { c.px(px, py, "a"); px += ih(i, s) < 0.5 ? 1 : 0; py += 1; if (ih(i, s + 9) < 0.3) px -= 1 }
  }
  // a manhole and the steam vent's grate
  c.circ(100, 126, 5, "3"); c.circ(100, 126, 4, "2")
  for (let i = -3; i <= 3; i += 2) c.hline(97, 126 + i, 7, "3")
  c.circ(100, 126, 5, "4", false)
  c.rect(58, 112, 11, 7, "4"); c.rect(59, 113, 9, 5, "k"); for (let x = 60; x < 67; x += 2) c.vline(x, 113, 5, "3")
}

// the north block
function northBlock(c) {
  // roof: tar, a parapet, an AC unit seen from above, a duct
  c.rect(0, 0, PW, 10, "f")
  for (let x = 0; x < PW; x++) if (ih(x, 77) < 0.2) c.px(x, Math.floor(ih(x, 78) * 8), "g")
  c.hline(0, 8, PW, "h"); c.hline(0, 9, PW, "i")
  c.rect(6, 1, 13, 7, "4"); c.circ(12, 4, 2, "2"); c.px(12, 4, "5"); c.hline(6, 1, 13, "5")
  c.rect(84, 2, 30, 3, "3"); c.hline(84, 2, 30, "4"); for (let x = 86; x < 114; x += 7) c.vline(x, 2, 3, "2")
  c.rect(132, 1, 9, 6, "3"); c.rect(133, 2, 7, 4, "2")
  // the wall's face
  c.rect(0, 10, PW, 24, "g")
  for (let y = 13; y < 34; y += 5) c.hline(0, y, PW, "f")
  for (let x = 0; x < PW; x++) for (let y = 10; y < 34; y++) if (ih(x * 3, y) < 0.04) c.px(x, y, "h")
  c.hline(0, 33, PW, "f")
  // LUCKY STATIC: a sign board, the door, the steamy window
  c.rect(2, 11, 56, 9, "k"); c.box(2, 11, 56, 9, "3")
  c.text(6, 13, "LUCKY STATIC", "N")
  shadeKeys(c, "N", "nN", (x, y) => (y === 13 || y === 17 ? 0.6 : 1.4), [6, 13, 48, 5])
  c.rect(21, 21, 13, 13, "D"); c.rect(22, 22, 11, 11, "E")
  for (let x = 22; x < 33; x += 2) c.vline(x, 22, 9 + (x % 4 ? 0 : 2), "B")   // a bead curtain
  c.box(20, 20, 15, 14, "4"); c.hline(20, 20, 15, "5")
  c.rect(38, 22, 18, 10, "B"); c.rect(39, 23, 16, 8, "D")
  for (let y = 23; y < 31; y++) for (let x = 39; x < 55; x++) if (bayer4(x, y) < 0.35 + (y - 23) * 0.06) c.px(x, y, "E")
  c.rect(43, 25, 4, 6, "A"); c.rect(44, 24, 2, 2, "A")   // a customer's back through the steam
  c.box(37, 21, 20, 12, "4")
  c.rect(8, 22, 8, 5, "m"); c.text(9, 22, "24", "N")     // a small neon "24" in the corner
  // the drainpipe, leaking
  c.rect(60, 10, 3, 24, "3"); c.vline(60, 10, 24, "4"); c.hline(59, 18, 5, "4"); c.hline(59, 28, 5, "4")
  // the screen's bezel
  const [sx, sy, sw, sh] = SCR
  c.rect(sx - 2, sy - 1, sw + 4, sh + 2, "2"); c.box(sx - 2, sy - 1, sw + 4, sh + 2, "4"); c.hline(sx - 2, sy - 1, sw + 4, "5")
  c.px(sx - 2, sy - 1, "6"); c.px(sx + sw + 1, sy - 1, "6")
  // graffiti tag on the bare wall, an EXIT arrow sign over the alley
  c.line(132, 16, 136, 22, "8"); c.line(136, 22, 140, 15, "8"); c.line(140, 15, 143, 21, "8")
}
function screen(c) {
  const [sx, sy, sw, sh] = SCR
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) c.px(sx + x, sy + y, screenKey(x, y, c.frame))
  c.text(sx + 1, sy + 16, "HALCYON", "w")
  c.hline(sx + 1, sy + 21, 14, "u")                       // the slogan, too small to read: SLEEP BETTER
  c.hline(sx + 17, sy + 21, 10, "u")
}

// the vending machine against the wall: its roof from above, a strip of its lit front
function vending(c) {
  const x = 128, y = 34
  c.rect(x, y, 16, 8, "3"); c.hline(x, y, 16, "4"); for (let i = 2; i < 14; i += 3) c.vline(x + i, y + 2, 4, "2")
  c.rect(x, y + 8, 16, 11, "2"); c.box(x, y + 8, 16, 11, "4")
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
    const dead = i === 2 && j === 1
    c.rect(x + 2 + i * 4, y + 10 + j * 3, 3, 2, dead ? "1" : (i + j) % 2 ? "v" : "L")
    if (!dead) c.px(x + 2 + i * 4, y + 10 + j * 3, (i + j) % 2 ? "w" : "w")
  }
  c.rect(x + 13, y + 10, 2, 5, "4"); c.px(x + 13, y + 11, "H")
  c.rect(x + 9, y + 15, 6, 3, "O"); c.hline(x + 10, y + 16, 4, "r")   // OUT OF ORDER sticker
}

// the east block's roof, broken by the alley and its stairs down: the exit
function eastBlock(c) {
  const x0 = 146
  for (const [y0, y1] of [[34, 74], [100, PH]]) {
    c.rect(x0, y0, PW - x0, y1 - y0, "f"); c.vline(x0, y0, y1 - y0, "i"); c.vline(x0 + 1, y0, y1 - y0, "h")
    for (let y = y0 + 4; y < y1; y += 9) c.hline(x0 + 3, y, PW - x0 - 3, "g")
  }
  c.hline(x0, 73, PW - x0, "i"); c.hline(x0, 100, PW - x0, "i")
  for (let i = 0; i < 5; i++) c.rect(x0 + 1 + i * 2, 75, 2, 25, "edcba"[i])   // the stairs, down into the dark
  for (let i = 0; i < 5; i++) c.hline(x0 + 1 + i * 2, 75, 2, "e")
  // a green arrow painted where the stairs start
  c.px(139, 84, "H"); c.px(140, 85, "H"); c.px(141, 86, "H"); c.px(140, 87, "H"); c.px(139, 88, "H")
  c.px(136, 84, "H"); c.px(137, 85, "H"); c.px(138, 86, "H"); c.px(137, 87, "H"); c.px(136, 88, "H")
}

// trash bags by the bar's door, a crate
function trash(c) {
  for (const [x, y, r] of [[6, 47, 4], [12, 50, 3], [4, 53, 3]]) {
    c.circ(x, y, r, "g"); c.circ(x - 1, y - 1, r - 1, "h"); c.px(x - 1, y - 2, "i"); c.px(x, y - r + 1, "l"); c.px(x + 1, y, "f")
  }
  c.rect(15, 54, 7, 6, "R"); c.box(15, 54, 7, 6, "r"); c.line(15, 54, 21, 59, "r")
}

// the old cook under his umbrella, his cart, the pot
const UMB = [30, 86, 12]
function umbrella(c) {
  const [cx, cy, r] = UMB
  for (let y = -r - 1; y <= r + 1; y++) for (let x = -r - 1; x <= r + 1; x++) {
    const a = Math.atan2(y, x), d = Math.hypot(x, y), rr = r - 0.8 + Math.cos(a * 8) * 0.8
    if (d > rr) continue
    const seg = Math.floor(((a + Math.PI) / (Math.PI / 4)) + 0.5) % 8, off = Math.abs(((a + Math.PI) / (Math.PI / 4)) % 1 - 0.5)
    if (seg === 5 && d > 5) continue                     // a torn panel
    let v = (seg % 2 ? 2.0 : 1.1) + (-y / r) * 0.5 + (d < 3 ? 0.3 : 0)
    let k = tone("rRX", v, cx + x, cy + y)
    if (off > 0.45 && d > 2) k = "r"                      // the ribs
    if (d > rr - 1) k = seg % 2 ? "R" : "r"
    c.px(cx + x, cy + y, k)
  }
  c.px(cx, cy, "6"); c.px(cx + 1, cy, "5")
  for (let i = 0; i < 9; i++) c.px(cx - r + 3 + Math.floor(ih(i, 31) * (2 * r - 6)), cy - r + 3 + Math.floor(ih(i, 32) * (2 * r - 6)), "l")   // beads of rain
}
function cook(c) {
  const [cx, cy] = UMB
  // the cart, half under the umbrella, the pot steaming on it
  c.rect(38, 79, 18, 15, "3"); c.box(38, 79, 18, 15, "4"); c.hline(38, 79, 18, "5")
  c.rect(40, 92, 3, 3, "2"); c.rect(51, 92, 3, 3, "2")
  c.circ(49, 85, 4, "5"); c.circ(49, 85, 3, "B"); c.circ(48, 84, 1, "D"); c.px(51, 86, "A")
  c.rect(40, 81, 4, 3, "6"); c.rect(41, 88, 3, 3, "S")   // bowls, a stack of them
  // what shows of the cook through the torn panel: a grey head, a shoulder
  c.circ(cx - 4, cy + 6, 2, "4"); c.px(cx - 5, cy + 5, "5"); c.px(cx - 2, cy + 8, "T")
  // his arm out to the pot with a ladle, his boots out the south edge
  c.line(cx + 10, cy - 1, 46, cy - 2, "T"); c.px(47, cy - 2, "6")
  c.rect(cx - 4, cy + 12, 2, 2, "j"); c.rect(cx, cy + 12, 2, 2, "j")
}

// Juno from above: the hood the readable dot, the slicker's shoulders, the satchel on her right
sprite("_juno_top", `
.....jjj.....
...xyYYYyx...
..xyYZZZYyx..
..xYZZZZYyx..
..xyYZZYyyx..
.xxxyYYyyxxx.
xyyYxxxxxyyyx
xyYYyyyyyyy4x
xyYyyyyyyy434
xyyyyyyyyy434
.xyyyyyyyyx4.
..xxxxxxxx...`)
const JUNO = [88, 59]

// the patrol drone: four rotors, a dark body, a red eye; its searchlight on the street
const DRONE = [126, 96], POOL = [104, 117]
function drone(c) {
  const [x, y] = DRONE, f = c.frame
  for (const [dx, dy] of [[-5, -4], [5, -4], [-5, 4], [5, 4]]) {
    c.line(x, y, x + dx, y + dy, "5")
    for (let a = 0; a < 12; a++) { const t = a / 12 * Math.PI * 2 + f * 0.7; c.px(x + dx + Math.round(Math.cos(t) * 3), y + dy + Math.round(Math.sin(t) * 3), a % 3 ? "4" : "6") }
    c.px(x + dx, y + dy, "5")
  }
  c.rect(x - 3, y - 2, 7, 6, "4"); c.box(x - 3, y - 2, 7, 6, "k"); c.hline(x - 2, y - 1, 5, "6"); c.px(x - 1, y, "5")
  c.rect(x - 3, y + 3, 3, 2, "q"); c.px(x - 3, y + 4, "Q"); c.px(x - 2, y + 3, f % 4 < 2 ? "Q" : "M")   // the eye, toward the light it throws
}

// puddles: dark mirrors of the sky, tinted by the neon above them; rings where drops land
const PUDDLES = [[26, 51, 11, 3, "7mnN"], [104, 47, 13, 3, "9tuv"], [70, 101, 9, 3, "9tu"], [122, 126, 12, 3, "8mn"], [14, 120, 8, 3, "FAB"], [86, 82, 6, 2, "9tu"]]
function puddles(c) {
  const f = c.frame
  PUDDLES.forEach(([cx, cy, rx, ry, ramp], i) => {
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
      const d = (x * x) / (rx * rx) + (y * y) / (ry * ry) + (vn(cx + x, cy + y, 3, i) - 0.5) * 0.6
      if (d > 1) continue
      const v = (1 - d) * (ramp.length - 0.5) - 0.2 + (y < 0 ? 0.4 : 0)
      c.px(cx + x, cy + y, d > 0.8 ? "a" : tone(ramp, v, cx + x, cy + y, 1.5))
    }
    // a ripple ring
    const rx0 = cx + Math.round((ih(i, f) - 0.5) * rx), r = (f + i) % 3
    if (r > 0) { c.px(rx0 - r, cy, "l"); c.px(rx0 + r, cy, "l"); c.px(rx0, cy - 1, "l") } else c.px(rx0, cy, "L")
  })
}

// steam: puffs rising off the pot and the vent, each loop of 8 frames a puff from birth to gone
function steam(c) {
  const f = c.frame
  for (const [vx, vy, n] of [[49, 83, 3], [63, 112, 4]]) for (let i = 0; i < n; i++) {
    const p = (f + i * (8 / n)) % 8, x = vx + Math.round(p * 0.8 + Math.sin(i * 2 + p) * 1), y = vy - Math.round(p * 2.2)
    c.circ(x, y, 1 + Math.floor(p / 3), p < 5 ? "6" : "5")
  }
}

// rain: short streaks slanting down-left, splashes on the ground, different every frame
function rain(c) {
  const f = c.frame
  for (let i = 0; i < 110; i++) {
    const x = Math.floor(ih(i, f * 3 + 1) * (PW + 8)), y = Math.floor(ih(i, f * 3 + 2) * (PH + 6)) - 6
    const len = 3 + (ih(i, f) < 0.4 ? 1 : 0)
    for (let s = 0; s < len; s++) c.px(x - (s >> 1), y + s, s === len - 1 ? "L" : "l")
  }
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(ih(i + 500, f * 5) * PW), y = 36 + Math.floor(ih(i + 600, f * 5) * (PH - 36))
    c.px(x, y, "L"); if (i % 3 === 0) { c.px(x - 1, y, "l"); c.px(x + 1, y, "l") }
  }
}

// light pools, as maps from the street's keys to the tinted ones
const MAG1 = { a: "7", b: "7", c: "8", d: "8", e: "8" }, MAG2 = { 7: "8", a: "8", b: "8", c: "8", 8: "m" }
const AMB1 = { a: "F", b: "F", c: "G", d: "G", e: "G", 7: "F", 8: "G" }, AMB2 = { F: "G", G: "B", a: "G", b: "G", c: "G", d: "B" }
const CY1 = { a: "9", b: "9", c: "0", d: "0", e: "0" }, CY2 = { 9: "0", 0: "u", a: "0", b: "0", c: "0", d: "u" }
const WH1 = { a: "d", b: "e", c: "e", d: "l", e: "l", 9: "e", 0: "l", 7: "8", 8: "l", F: "G", G: "l" }, WH2 = { d: "l", e: "L", l: "L", 0: "L", 8: "L", G: "L" }

scene("_play", { w: PW, h: PH },
  layer("clock", stamp("_clock", -4, -4)),
  layer("ground", ground),
  layer("magenta wide", { light: MAG1, density: 0.5 }, ellipse(30, 42, 34, 12, "k")),
  layer("magenta", { light: MAG1 }, ellipse(30, 40, 26, 8, "k")),
  layer("amber", { light: AMB1 }, poly([21, 34, 34, 34, 44, 58, 12, 58], "k")),
  layer("amber in", { light: AMB2 }, poly([23, 34, 32, 34, 37, 48, 18, 48], "k")),
  layer("cyan wide", { light: CY1, density: 0.5 }, ellipse(97, 46, 50, 26, "k")),
  layer("cyan", { light: CY1 }, poly([66, 34, 128, 34, 136, 56, 58, 56], "k"), ellipse(97, 50, 36, 12, "k")),
  layer("cyan in", { light: CY2, density: 0.5 }, poly([72, 34, 122, 34, 116, 44, 78, 44], "k")),
  layer("vending", { light: CY1 }, ellipse(136, 58, 11, 4, "k")),
  layer("searchlight", { light: WH1 }, ellipse(POOL[0], POOL[1], 15, 8, "k")),
  layer("searchlight in", { light: WH2, density: 0.5 }, ellipse(POOL[0], POOL[1], 9, 5, "k")),
  layer("puddles", puddles),
  layer("shadows", { shade: true },
    ellipse(UMB[0] + 2, UMB[1] + 4, 12, 11, "k"), rect(40, 82, 18, 14, "k"),
    ellipse(JUNO[0] + 7, JUNO[1] + 10, 6, 4, "k"), ellipse(DRONE[0] - 2, DRONE[1] + 14, 4, 2, "k"),
    rect(128, 53, 16, 3, "k"), ellipse(10, 54, 9, 5, "k")),
  layer("north block", northBlock, screen, vending),
  layer("east block", eastBlock),
  layer("props", trash, cook, umbrella),
  layer("juno", stamp("_juno_top", JUNO[0], JUNO[1])),
  layer("beam", { opacity: 0.22 }, poly([DRONE[0] - 2, DRONE[1] + 1, POOL[0] + 12, POOL[1] - 6, POOL[0] - 8, POOL[1] + 7], "L")),
  layer("drone", drone),
  layer("cables", (c) => { c.line(58, 7, 147, 60, "k"); c.line(0, 28, 20, 8, "k"); c.line(146, 104, 120, PH, "f") }),
  layer("steam", { opacity: 0.45 }, steam),
  layer("rain", { opacity: 0.7 }, rain),
  glow("nN", { r: 5, strength: 0.55 }),
  glow("DE", { r: 4, strength: 0.35 }),
  glow("vw", { where: [SCR[0], SCR[1], SCR[2], SCR[3]], r: 6, strength: 0.3 }),
  glow("Q", { r: 3, strength: 0.9 }),
  glow("H", { r: 3, strength: 0.4 }),
  layer("say", (c) => {
    const s = "It... said my name.", x = JUNO[0] - 12, y = JUNO[1] - 13
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]]) c.text(x + dx, y + dy, s, "k", { font: "5x7", align: "c" })
    c.text(x, y, s, "Z", { font: "5x7", align: "c" })
  }))

// ================================================================ the HUD
function chevrons(c) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = y + Math.abs(((x + 720) % 72) - 36) * 0.9, b = Math.floor(u / 20), fr = u / 20 - b
    let k = b % 2 ? "2" : "1"
    if (fr < 0.07) k = b % 2 ? "3" : "2"
    else if (fr > 0.93) k = "k"
    if (ih(x, y + 1000) < 0.04) k = k === "1" ? "k" : "1"
    c.px(x, y, k)
  }
}
const rivet = (c, x, y) => { c.px(x, y, "6"); c.px(x + 1, y, "5"); c.px(x, y + 1, "5"); c.px(x + 1, y + 1, "k") }
function panel2(c, x, y, w, h, fill = "3") {
  c.rect(x, y, w, h, fill)
  c.hline(x, y, w, "5"); c.vline(x, y, h, "5"); c.hline(x + 1, y + 1, w - 2, "4")
  c.hline(x, y + h - 1, w, "k"); c.vline(x + w - 1, y, h, "k"); c.hline(x + 1, y + h - 2, w - 2, "2")
  rivet(c, x + 2, y + 2); rivet(c, x + w - 4, y + 2); rivet(c, x + 2, y + h - 4); rivet(c, x + w - 4, y + h - 4)
}
const inset = (c, x, y, w, h, fill = "1") => { c.rect(x, y, w, h, fill); c.hline(x, y, w, "k"); c.vline(x, y, h, "k"); c.hline(x, y + h - 1, w, "4"); c.vline(x + w - 1, y, h, "4") }
const PIPE = "4655432"
function pipeH(c, x, y, len, rings = 36) {
  for (let i = 0; i < 6; i++) c.hline(x, y + i, len, PIPE[i + 1] ?? "2")
  c.hline(x, y, len, "3"); c.hline(x, y + 5, len, "1")
  for (let r = x + 10; r < x + len - 6; r += rings) {
    c.rect(r, y - 1, 4, 8, "4"); c.vline(r, y - 1, 8, "6"); c.vline(r + 3, y - 1, 8, "2"); c.hline(r, y + 6, 4, "1")
    c.px(r + 1, y + 1, "6"); c.px(r + 1, y + 4, "6")
  }
}
function pipeV(c, x, y, len, rings = 36) {
  for (let i = 0; i < 6; i++) c.vline(x + i, y, len, PIPE[i + 1] ?? "2")
  c.vline(x, y, len, "3"); c.vline(x + 5, y, len, "1")
  for (let r = y + 10; r < y + len - 6; r += rings) {
    c.rect(x - 1, r, 8, 4, "4"); c.hline(x - 1, r, 8, "6"); c.hline(x - 1, r + 3, 8, "2"); c.vline(x + 6, r, 4, "1")
    c.px(x + 1, r + 1, "6"); c.px(x + 4, r + 1, "6")
  }
}
function joint(c, x, y) {
  c.rect(x, y, 10, 10, "4"); c.box(x, y, 10, 10, "2"); c.hline(x, y, 10, "6"); c.vline(x, y, 10, "5")
  rivet(c, x + 2, y + 2); rivet(c, x + 6, y + 2); rivet(c, x + 2, y + 6); rivet(c, x + 6, y + 6)
}
// HUD lettering: orange with a light top and a dark foot, a drop shadow
function label(c, x, y, s) {
  c.text(x + 1, y + 1, s, "k", { font: "5x7" })
  c.text(x, y, s, "O", { font: "5x7" })
  for (let yy = y; yy < y + 7; yy++) for (let xx = x; xx < x + 130; xx++) if (c.is(xx, yy, "O")) {
    if (yy - y < 1 && !c.is(xx, yy - 1, "O")) c.px(xx, yy, "E")
    else if (yy - y >= 5) c.px(xx, yy, "o")
  }
}
// a seven-segment digit, 5x9
const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abfgcd" }
function seg(c, x, y, d, k) {
  const s = SEG[d]
  if (s.includes("a")) c.hline(x + 1, y, 3, k); if (s.includes("g")) c.hline(x + 1, y + 4, 3, k); if (s.includes("d")) c.hline(x + 1, y + 8, 3, k)
  if (s.includes("f")) c.vline(x, y + 1, 3, k); if (s.includes("b")) c.vline(x + 4, y + 1, 3, k)
  if (s.includes("e")) c.vline(x, y + 5, 3, k); if (s.includes("c")) c.vline(x + 4, y + 5, 3, k)
}
function watch(c) {
  // the strap, up off the top and down behind the body
  c.rect(268, 0, 32, 36, "r"); c.vline(268, 0, 36, "R"); c.vline(299, 0, 36, "k")
  for (let y = 1; y < 36; y += 3) { c.px(271, y, "X"); c.px(296, y, "X") }
  // the body
  c.rect(254, 3, 60, 29, "4"); c.hline(256, 3, 56, "6"); c.hline(255, 4, 58, "5"); c.hline(255, 31, 58, "k"); c.hline(256, 30, 56, "2")
  c.vline(254, 5, 25, "5"); c.vline(313, 5, 25, "2")
  c.px(254, 3, "1"); c.px(313, 3, "1"); c.px(254, 31, "1"); c.px(313, 31, "1")
  c.rect(251, 10, 3, 5, "5"); c.rect(251, 20, 3, 5, "3"); c.rect(314, 14, 3, 6, "3")   // buttons
  rivet(c, 257, 6); rivet(c, 309, 6); rivet(c, 257, 26); rivet(c, 309, 26)
  // the LCD
  c.rect(261, 8, 46, 19, "2"); c.rect(262, 9, 44, 17, "P"); c.hline(262, 9, 44, "V"); c.vline(262, 9, 17, "V")
  seg(c, 265, 13, 2, "K"); seg(c, 272, 13, 3, "K"); seg(c, 283, 13, 5, "K"); seg(c, 290, 13, 1, "K")
  if (c.frame % 8 < 5) { c.px(280, 15, "K"); c.px(280, 19, "K") }
  c.text(298, 17, "07", "K")
}
function icons(c) {
  panel2(c, 208, 3, 38, 27)
  // a column of status LEDs
  inset(c, 212, 6, 7, 21)
  for (let i = 0; i < 6; i++) c.rect(214, 8 + i * 3, 3, 2, i < 4 ? (i === 1 ? "q" : "Q") : "u")
  // the inventory: a satchel
  inset(c, 222, 6, 20, 10, "2")
  c.rect(226, 9, 12, 6, "5"); c.hline(226, 9, 12, "6"); c.rect(226, 9, 12, 3, "4"); c.hline(226, 12, 12, "3")
  c.px(231, 12, "O"); c.px(232, 12, "O"); c.hline(228, 7, 8, "4"); c.px(227, 8, "4"); c.px(236, 8, "4")
  // look: a magnifier
  inset(c, 222, 17, 20, 10, "2")
  c.circ(230, 21, 3, "6"); c.circ(230, 21, 2, "u"); c.px(229, 20, "w")
  c.line(233, 24, 236, 26, "5"); c.line(234, 24, 237, 26, "4")
}
function zoomWin(c) {
  panel2(c, 4, 113, 66, 48)
  inset(c, ZOOM[0] - 1, ZOOM[1] - 1, ZOOM[2] * ZOOM[4] + 2, ZOOM[3] * ZOOM[4] + 2, "k")
  const [zx, zy, zw, zh, m] = ZOOM
  for (let y = 0; y < zh; y++) for (let x = 0; x < zw; x++) c.rect(zx + x * m, zy + y * m, m, m, screenKey(EYE0[0] + x, EYE0[1] + y, c.frame))
  // rain across it, three times as big
  for (let i = 0; i < 6; i++) {
    const x = zx + Math.floor(ih(i, c.frame * 3 + 1) * zw * m), y = zy + Math.floor(ih(i, c.frame * 3 + 2) * zh * m)
    for (let s = 0; s < 8; s++) if (x - (s >> 1) >= zx && y + s < zy + zh * m) c.px(x - (s >> 1), y + s, "l")
  }
  // the reticle
  const cx = zx + zw * m / 2, cy = zy + zh * m / 2
  for (const [dx, dy] of [[-6, -5], [5, -5], [-6, 4], [5, 4]]) { c.px(cx + dx, cy + dy, "O"); c.px(cx + dx + (dx < 0 ? 1 : -1), cy + dy, "O"); c.px(cx + dx, cy + dy + (dy < 0 ? 1 : -1), "O") }
}
function hudFrame(c) {
  const L = PX - 6, R = PX + PW + 1
  pipeH(c, L, 32, R - L + 6); pipeH(c, L, 174, R - L + 6)
  pipeV(c, L, 32, 148); pipeV(c, R, 32, 148)
  joint(c, L - 3, 29); joint(c, R - 3, 29); joint(c, L - 3, 170); joint(c, R - 3, 170)
  // the right column: two pipes down from the watch, a valve, a warning lamp
  pipeV(c, 281, 36, 144, 40); pipeV(c, 297, 48, 132, 30)
  c.rect(287, 36, 18, 12, "3"); c.box(287, 36, 18, 12, "k"); c.hline(288, 37, 16, "5"); rivet(c, 289, 39); rivet(c, 301, 39)
  c.circ(306, 110, 9, "3"); c.circ(306, 110, 9, "5", false); c.circ(306, 110, 7, "2", false)
  for (let a = 0; a < 6; a++) c.line(306, 110, 306 + Math.round(Math.cos(a * 1.047) * 8), 110 + Math.round(Math.sin(a * 1.047) * 8), "4")
  c.circ(306, 110, 2, "6")
  panel2(c, 300, 140, 17, 22); c.circ(308, 148, 3, c.frame % 4 < 2 ? "Q" : "q"); c.px(307, 147, "M")
  c.text(303, 154, "PSI", "5")
}
// Juno in profile, looking right into the play window, lit by the screen's cold light
sprite("_portrait", { w: 96, h: 113 }, (c) => {
  // the slicker's shoulders, the satchel's strap across them
  c.poly([0, 112, 0, 88, 8, 78, 26, 73, 46, 75, 60, 80, 76, 86, 88, 96, 95, 112], "y")
  shadeKeys(c, "y", "xyYZ", (x, y) => 0.4 + x / 50 - (y - 78) / 40 + (vn(x, y, 7) - 0.5) * 0.8)
  for (const [x0, y0, x1, y1] of [[22, 84, 30, 112], [56, 88, 64, 112], [40, 92, 42, 112]]) c.line(x0, y0, x1, y1, "x")
  for (let i = 0; i < 4; i++) c.line(24 + i, 74, 66 + i, 112, "345k"[i])
  c.rect(42, 92, 5, 4, "5"); c.box(42, 92, 5, 4, "3")   // the strap's buckle
  // neck and face
  c.poly([50, 66, 66, 66, 68, 88, 50, 88], "T")
  c.poly([56, 22, 72, 21, 77, 28, 78, 36, 77, 40, 80, 45, 83, 50, 83, 52, 80, 53, 78, 55, 79, 57, 78, 59, 79, 61, 77, 63, 76, 67, 73, 70, 66, 72, 56, 72], "S")
  shadeKeys(c, "ST", "UTS", (x, y) => (x - 55) / 5 + 0.2 - (y > 69 ? 1.2 : 0) + (y < 30 ? -0.6 : 0))
  // the screen's light along the profile
  for (let y = 0; y < c.h; y++) for (let x = c.w - 1; x > 0; x--) if (c.is(x, y, "UTS")) { if (y > 26 && y < 70) c.px(x, y, y > 44 && y < 54 ? "v" : "u"); break }
  // hair under the hood's rim
  c.poly([66, 22, 76, 23, 78, 28, 74, 29, 71, 32, 69, 38, 66, 36], "j")
  // eye, brow, nostril, mouth
  c.hline(69, 33, 6, "U"); c.hline(68, 36, 3, "T")                                  // brow, the socket's shade
  c.hline(69, 37, 5, "U"); c.px(74, 38, "j"); c.px(71, 38, "j"); c.px(72, 38, "j"); c.px(73, 38, "L"); c.hline(70, 39, 3, "T")   // the eye, its lid and lashes
  c.px(80, 51, "U"); c.px(79, 52, "T"); c.px(78, 51, "T")                           // nostril
  c.hline(76, 58, 3, "U"); c.px(78, 57, "T"); c.px(78, 59, "R"); c.px(77, 60, "T"); c.px(76, 64, "T")   // mouth, chin
  for (let x = 60; x < 74; x++) for (let y = 66; y < 72; y++) if (c.is(x, y, "S") && y > 66 + (x - 60) * 0.3) c.px(x, y, "T")   // under the jaw
  // the implant: a thin cyan line along the cheekbone, from under the eye back into the hood, a node at each end
  c.line(71, 45, 66, 47, "v"); c.line(66, 47, 61, 47, "v"); c.px(72, 45, "w"); c.px(66, 47, "w"); c.px(69, 46, "u"); c.hline(62, 48, 3, "t")
  // the hood
  c.poly([10, 78, 5, 60, 5, 38, 11, 20, 23, 8, 40, 2, 56, 2, 68, 7, 76, 14, 80, 21, 80, 26, 72, 23, 66, 27, 62, 35, 60, 44, 59, 54, 58, 64, 57, 72, 54, 79, 44, 84, 26, 84], "y")
  shadeKeys(c, "y", "xyYZ", (x, y) => 3.1 - Math.hypot(x - 66, y - 10) / 24 + (vn(x, y, 6, 3) - 0.5) * 0.7, [0, 0, 96, 86])
  // the rim's lip catching the light, its inside in shadow, folds
  for (let y = 0; y < 86; y++) for (let x = c.w - 1; x > 0; x--) if (c.is(x, y, "xyYZ")) {
    if (y > 20 && y < 80 && c.is(x + 1, y, "UTSjvu")) { c.px(x, y, "Z"); c.px(x - 1, y, "Y"); c.px(x - 3, y, "x") }
    break
  }
  for (const [x0, y0, x1, y1] of [[20, 30, 30, 70], [36, 12, 46, 50], [14, 50, 18, 74], [52, 30, 54, 70]]) c.line(x0, y0, x1, y1, "x")
  for (const [x0, y0, x1, y1] of [[22, 30, 32, 70], [38, 12, 48, 50]]) c.line(x0, y0, x1, y1, "Y")
  // the collar under the chin
  c.poly([48, 82, 62, 76, 70, 82, 72, 90, 56, 92], "x"); c.line(62, 77, 71, 84, "Y")
})

scene("mock_a_topdown", { w: W, h: H, bg: "1" },
  layer("clock", stamp("_clock", -4, -4)),
  layer("hud bg", chevrons),
  layer("portrait", stamp("_portrait", 0, 0)),
  layer("panels", (c) => {
    panel2(c, 98, 3, 108, 27); inset(c, 101, 6, 102, 21)
    label(c, 105, 8, "LOCATION:"); label(c, 105, 17, "LUCKY STATIC")
  }, icons, watch, zoomWin, (c) => label(c, 5, 166, "Broken ad screen")),
  layer("play", stamp("_play", PX, PY)),
  layer("frame", hudFrame),
  layer("cursor", grid(PX + SCR[0] + 45, PY + SCR[1] + 11, `
    k......
    kk.....
    kwk....
    kwwk...
    kwwwk..
    kwwwwk.
    kwwwwwk
    kwwkkkk
    kwk....
    kk.....`)))
