// Study: CAM 18 at the old fish market from Frau Imai's lamp post, looking down (kapitel1-design, "Die Frau, die sich erinnert").
// Three ways her "sign with a fish over the stairs" could read from above, as blocks in the phosphor ramp with a little of the feed:
//   cam18_a  the camera hangs almost straight down, a little crooked: the sign across the stairs is still readable, squashed
//   cam18_b  straight down: a big neon fish lies flat on the canopy over the market's entrance, made to be seen from the air
//   cam18_c  straight down: the fish painted across the steps, broken by their edges, whole only from above
// Not built into the game; only to choose from.
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})
include("../lib/text.js")

const W = 320, H = 180
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const ih = (a, b = 0, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

/** a buffer of ramp levels, painted at the end with the feed's scanlines, noise and vignette */
function buffer() {
  const L = Array.from({ length: H }, () => new Float32Array(W))
  const b = {
    L,
    set: (x, y, v) => { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H) L[y][x] = v },
    add: (x, y, v) => { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H) L[y][x] += v },
    rect: (x, y, w, h, v) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) b.set(i, j, v) },
    each: (f) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) L[y][x] = f(x, y, L[y][x]) },
    line: (x0, y0, x1, y1, v) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) b.set(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), v) },
    glow: (cx, cy, r, v) => b.each((x, y, l) => l + v * Math.max(0, 1 - Math.hypot(x - cx, (y - cy) * 1.2) / r) ** 1.6),
    paint(c, seed) {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const vig = 1 - 0.45 * (Math.hypot((x - W / 2) / W, (y - H / 2) / H) * 1.6) ** 2
        let v = L[y][x] * vig - (y % 2 ? 0.35 : 0) + (ih(x, y, seed) - 0.5) * 0.9
        c.px(x, y, String(clamp(Math.round(v), 0, 9)))
      }
    },
  }
  return b
}
/** a fish: its body an ellipse, its tail a forked fan behind it; looking left, turned by ang (radians), squashed by sx, sy */
const inFish = (x, y, cx, cy, len, ang = 0, sx = 1, sy = 1) => {
  const dx = x - cx, dy = y - cy, ca = Math.cos(-ang), sa = Math.sin(-ang)
  const u = (dx * ca - dy * sa) / sx, v = (dx * sa + dy * ca) / sy, a = len * 0.36, h = len * 0.16
  if ((u / a) ** 2 + (v / h) ** 2 < 1) return true
  const t = u - a * 0.82, T = len * 0.24
  return t > 0 && t < T && Math.abs(v) < 2 + t * 0.9 && !(t > T * 0.55 && Math.abs(v) < (t - T * 0.55) * 1.3)
}
const fishLine = (x, y, ...f) => inFish(x, y, ...f) && !(inFish(x - 2, y, ...f) && inFish(x + 2, y, ...f) && inFish(x, y - 2, ...f) && inFish(x, y + 2, ...f))

/** what all three share, seen straight down: the street on top, the stair well cut into it, the market's tarps below, the lamp's arm */
function streetFromAbove(b, { steps = true } = {}) {
  b.each((x, y) => 2.6 + ((x % 22 === 0 || y % 16 === 0) ? -0.8 : 0))                // wet slabs
  for (let x = 0; x < W; x++) for (let y = 120; y < H; y++) if (x < 104 || x > 216) b.set(x, y, 3.2 + (x % 6 < 2 ? 0.9 : 0)) // the market's tarps
  for (const x of [104, 216]) b.rect(x - 2, 120, 4, 60, 1)
  b.rect(118, 30, 84, 118, 2)                                                           // the stair well
  b.rect(112, 30, 6, 118, 5.2); b.rect(202, 30, 6, 118, 5.2)                            // its walls' coping
  for (let y = 32; y < 148; y += 4) { b.set(115, y, 7); b.set(205, y, 7) }               // the railings
  if (steps) for (let i = 0; i < 12; i++) {
    const y = 32 + i * 10, lit = 5.4 - i * 0.28
    b.rect(118, y, 84, 10, lit - 1.2); b.rect(118, y, 84, 2, lit); b.rect(118, y + 9, 84, 1, 1)
  }
  b.rect(118, 148, 84, 10, 2.4)                                                         // the landing
  b.glow(150, 70, 150, 2.2)                                                             // the lamp's pool
}
/** the lamp the camera hangs on: its arm out of the top left corner, out of focus, the lamp's housing */
function lampArm(b) {
  for (let i = 0; i < 9; i++) b.line(-4, 6 + i, 62, 24 + i, 0.6)
  b.rect(54, 20, 22, 16, 1.2); b.rect(56, 34, 18, 3, 9)
}
/** rain: the camera hangs crooked, so it runs from left to right */
function rain(b, seed) {
  for (let i = 0; i < 160; i++) {
    const x = ih(i, 1, seed) * W, y = ih(i, 2, seed) * H, n = 3 + ih(i, 3, seed) * 4
    for (let k = 0; k < n; k++) b.add(x + k * 1.6, y + k * 0.5, 1.6)
  }
}
const osd = (c, tag) => {
  c.rect(0, 0, W, 11, "0")
  TXT.draw(c, 4, 2, "CAM 18 // ALTER FISCHMARKT", "8", { font: "hud" })
  TXT.draw(c, W - 4, 2, tag, "6", { font: "hud", align: "right" })
}

// a) almost straight down, crooked: the sign hangs across the stairs and is read squashed, its face tipped toward the camera
scene("cam18_a", { w: W, h: H, bg: "0" }, (c) => {
  const b = buffer()
  streetFromAbove(b)
  b.rect(108, 86, 104, 5, 1.2)                                                          // its shadow on the steps
  b.rect(112, 62, 96, 24, 2); b.rect(112, 62, 96, 1, 6); b.rect(112, 85, 96, 1, 0.5)    // the board, tipped
  b.each((x, y, l) => (y >= 62 && y < 86 && fishLine(x, y, 142, 74, 46, 0, 1, 0.62) ? 9 : l))
  b.glow(150, 73, 50, 1.6)
  for (const x of [112, 207]) b.rect(x, 56, 1, 8, 6)                                    // what it hangs from
  rain(b, 1); lampArm(b); b.paint(c, 11)
  TXT.draw(c, 186, 71, "FISH", "9", { font: "hud", align: "center" })
  osd(c, "A  FAST SENKRECHT, SCHIEF")
})

// b) straight down: the neon fish lies flat on the canopy over the market's entrance, made for the drones and the air
scene("cam18_b", { w: W, h: H, bg: "0" }, (c) => {
  const b = buffer()
  streetFromAbove(b)
  for (let y = 132; y < 172; y++) for (let x = 88; x < 232; x++) b.set(x, y, 3 + (x % 5 === 0 ? -0.8 : 0))  // the canopy, corrugated
  b.rect(88, 172, 144, 2, 0.6)
  b.each((x, y, l) => (y > 131 && y < 172 && fishLine(x, y, 148, 151, 112) ? 9 : l))
  b.each((x, y, l) => (y > 131 && y < 172 && x > 88 && x < 232 ? l + 2.4 * Math.max(0, 1 - Math.hypot(x - 152, (y - 150) * 2) / 70) : l))
  b.set(122, 146, 9); b.set(123, 146, 9)                                                // its eye
  rain(b, 2); lampArm(b); b.paint(c, 22)
  TXT.draw(c, 146, 148, "FISH", "9", { font: "hud", align: "center" })
  osd(c, "B  NEON AUF DEM VORDACH")
})

// c) straight down: the fish painted over the steps, the paint worn, broken by every step's edge
scene("cam18_c", { w: W, h: H, bg: "0" }, (c) => {
  const b = buffer()
  streetFromAbove(b)
  b.each((x, y, l) => {
    if (x < 118 || x > 201 || y < 32 || y > 157) return l
    const edge = (y - 32) % 10 >= 9 || (y - 32) % 10 < 2
    return inFish(x, y, 160, 96, 150, Math.PI / 2) && !edge && ih(x, y, 7) > 0.15 ? l + 2.6 : l
  })
  rain(b, 3); lampArm(b); b.paint(c, 33)
  TXT.draw(c, 160, 150, "FISH", "8", { font: "hud", align: "center" })
  osd(c, "C  AUF DIE STUFEN GEMALT")
})
