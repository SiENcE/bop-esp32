// The swamps (docs/kapitel2-design.md §3.5 L4, L5, decided 2026-11-16), ON BLOCKS: the sketch art/test/sumpf_fahrt_blocks.px.js
// as the game's placeholder until it is painted. Two stages seen from the side, where Juno sits on Pike's raft:
//   sumpf_fahrt_bg      the ride's still part: the sky, the city and the Crown behind, the water (320x180)
//   sumpf_fahrt_far     the farther rows (384 wide), sumpf_fahrt_mid the drowned house fronts and trunks (768), sumpf_fahrt_weed the
//                       duckweed (768), sumpf_fahrt_near the big trunks passing in front (768): each a prop that scrolls (game/rooms/sumpf.js)
//   sumpf_fahrt_floss   the raft DATA 1C/GB with Pike poling and Juno sitting, riding the water (48 frames at 12 fps)
//   sumpf_bg            the arrival: the old trees, the mist, Lantern's lanterns, the walk of planks, the caravan on pontoons (320x180)
//   sumpf_floss         the raft tied up at the walk, Pike resting on his pole, Juno sitting (24 frames)
"use strict"
pal({
  k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",   // night
  e: "#0b1019", f: "#111824", z: "#1a2434",                                                                          // the water
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff", x: "#2c4656", X: "#5d8396",                              // cyan, the Crown's glow
  q: "#16251f", g: "#24402e", G: "#3f6340", l: "#6f8e50",                                                            // moss, leaves, duckweed
  u: "#2a1f1c", U: "#4a3528", O: "#552b1c",                                                                          // wood, rust
  j: "#9a7406", y: "#eec414", Y: "#fff070",                                                                          // Juno
  h: "#56606f", H: "#9aa3b2", w: "#e6eaf0", b: "#e0a030",                                                            // Pike the heron: grey, light grey, white, the beak
  L: "#b0f0a0", d: "#3c6a3a",                                                                                        // Lantern's green
  R: "#ffd58a", M: "#5a1f52",                                                                                        // a window, a dead sign
})
include("../lib/text.js")

const W = 320, H = 180, FPS = 12, FRAMES = 192
const WATER = 112                                   // the far water line; the raft's at RAFT
const RAFT = 150
const R = Math.round
// a deterministic hash for picking where things stand along a strip
const hsh = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }

// ---------------------------------------------------------------- sky, the city behind, the Crown (still)
sprite("_sky", { w: W, h: WATER }, (c) => {
  c.rect(0, 0, W, WATER, "n")
  for (const [k, y0] of [["1", 24], ["2", 56], ["3", 86]]) c.rect(0, y0, W, WATER - y0, k)
  c.dither(0, 21, W, 3, "n", "1", 0.5); c.dither(0, 53, W, 3, "1", "2", 0.5); c.dither(0, 83, W, 3, "2", "3", 0.5)
  // the Crown's glow, left, on the undersides of the clouds and low on the horizon
  c.grad(0, 30, 200, 82, "Xx3.", "r", 0.5)
  for (const [y, x0, x1] of [[38, 0, 150], [46, 10, 190], [52, 0, 120], [61, 30, 230], [70, 0, 170]]) c.hline(x0, y, x1 - x0, y < 50 ? "x" : "X")
  // the city behind: the Ninth's edge, a black mass, and the rings rising to the Crown (top left), lights in rows
  c.poly([0, 18, 26, 18, 26, 40, 46, 40, 46, 70, 70, 70, 70, WATER, 0, WATER], "k")
  c.poly([6, 0, 18, 0, 18, 18, 6, 18], "1")
  for (let y = 22; y < WATER; y += 5) for (let x = 2; x < (y < 40 ? 24 : y < 70 ? 44 : 68); x += 4) if (hsh(x * 7 + y) > 0.55) c.px(x, y, hsh(x + y * 3) > 0.8 ? "R" : "c")
  c.rect(4, 2, 16, 3, "C"); c.rect(6, 1, 12, 1, "V")                                                // the Crown's lit rim
})

// ---------------------------------------------------------------- the farther rows (384 a loop)
const FAR_W = 384, FAR_Y = 52
sprite("_far", { w: FAR_W, h: WATER - FAR_Y + 4, wrap: "x" }, (c) => {
  const B = WATER - FAR_Y
  for (let i = 0; i < 9; i++) {                                      // roofs: low blocks standing in the water
    const x = i * 43 + R(hsh(i) * 14), w = 22 + R(hsh(i + 9) * 16), h = 16 + R(hsh(i + 3) * 18)
    c.rect(x, B - h, w, h, "3"); if (hsh(i + 5) > 0.5) c.rect(x + 3, B - h - 4, 5, 4, "3")
    if (hsh(i + 7) > 0.7) c.px(x + 6, B - h + 5, "R")
  }
  for (let i = 0; i < 12; i++) {                                     // crowns of the trees over them
    const x = i * 32 + R(hsh(i + 20) * 16), r = 7 + R(hsh(i + 30) * 6), top = B - 26 - R(hsh(i + 40) * 22)
    c.rect(x, top, 2, B - top, "2"); c.ellipse(x + 1, top, r, R(r * 0.7), "q")
  }
  c.rect(0, B, FAR_W, 4, "f")                                        // their reflection, a dark band
  for (let x = 0; x < FAR_W; x += 2) c.px(x, B + 1, "z")
})

// ---------------------------------------------------------------- house fronts and trunks (768 a loop)
const MID_W = 768, MID_BASE = 128                                    // the mid water line on the picture
function trunk(c, x, base, wd, moss, k = "1", rim = "x") {
  c.rect(x, 0, wd, base, k); c.vline(x, 0, base, rim)               // lit on its left, toward the Crown
  c.poly([x - 4, base, x, base - 10, x + wd, base - 10, x + wd + 4, base], k)    // the buttress at the water
  for (let i = 0; i < 3; i++) {                                      // branches reaching out, left and right
    const by = 4 + i * 16 + R(hsh(x + i * 13) * 8), dir = (i + x) % 2 ? 1 : -1, len = 8 + R(hsh(x * 5 + i) * 10)
    c.line(dir > 0 ? x + wd : x, by + 6, dir > 0 ? x + wd + len : x - len, by, k)
  }
  for (let i = 0; i < moss; i++) {                                   // Spanish moss hanging from its branches
    const mx = x - 6 + R(hsh(x + i) * (wd + 12)), my = 6 + R(hsh(x * 3 + i) * 40), len = 8 + R(hsh(x + i * 5) * 16)
    c.vline(mx, my, len, i % 2 ? "G" : "g"); c.vline(mx + 1, my + 2, len - 4, "g")
  }
  for (let y = base + 1; y < base + 14; y += 2) c.hline(x - 1, y, wd + 2, "z")                  // its reflection
}
sprite("_mid", { w: MID_W, h: MID_BASE + 16, wrap: "x" }, (c) => {
  const B = MID_BASE
  // drowned house fronts, two storeys above the water, windows dark, one old sign
  for (const [x, w, h, sign] of [[40, 84, 66, ""], [330, 70, 50, "PHARMACY"], [560, 96, 74, "NOODLE"]]) {
    c.rect(x, B - h, w, h, "4"); c.hline(x, B - h, w, "5")
    for (let wy = B - h + 8; wy < B - 10; wy += 18) for (let wx = x + 8; wx < x + w - 10; wx += 20) {
      c.rect(wx, wy, 10, 12, "2"); c.hline(wx, wy, 10, "1")
      if (hsh(wx + wy) > 0.85) c.rect(wx + 2, wy + 3, 6, 8, "U")                                 // a board nailed over
    }
    if (sign) { c.rect(x + 6, B - 18, w - 12, 9, "1"); TXT.draw(c, x + w / 2, B - 16, sign, "M", { font: "hud", align: "center" }) }
    c.rect(x, B, w, 14, "f"); for (let y = B + 1; y < B + 14; y += 2) c.hline(x + 2, y, w - 4, "z")   // the water to the first floor
  }
  // trunks among them, rising out of the picture, moss in the branches
  for (const [x, wd, moss] of [[14, 8, 5], [140, 12, 8], [170, 6, 4], [214, 14, 9], [262, 7, 5], [300, 10, 6], [420, 13, 9], [452, 6, 4],
    [500, 11, 8], [535, 7, 4], [680, 14, 10], [712, 8, 5], [745, 6, 3]]) trunk(c, x, B, wd, moss, "2", "x")
})

// ---------------------------------------------------------------- the water and the duckweed by the raft (768 a loop)
const WEED_W = 768
sprite("_weed", { w: WEED_W, h: H - MID_BASE, wrap: "x" }, (c) => {
  for (let i = 0; i < 40; i++) {
    const x = R(hsh(i + 100) * WEED_W), y = 4 + R(hsh(i + 200) * (H - MID_BASE - 8)), w = 10 + R(hsh(i + 300) * 40), near = y > 26
    c.ellipse(x, y, w / 2, near ? 2 : 1, near ? "G" : "g")
    for (let k = 0; k < w / 4; k++) c.px(x - w / 2 + R(hsh(i * 9 + k) * w), y - 1, "l")
  }
  for (let i = 0; i < 30; i++) c.hline(R(hsh(i + 500) * WEED_W), 2 + R(hsh(i + 600) * 46), 6, "z")   // ripples
})

// ---------------------------------------------------------------- the big trunks in front (768 wide, 1536 a loop)
const NEAR_W = 768
sprite("_near", { w: NEAR_W, h: H, wrap: "x" }, (c) => {
  for (const [x, wd] of [[60, 26], [470, 34]]) {
    c.rect(x, 0, wd, H, "k"); c.vline(x, 0, H, "2"); c.vline(x + 1, 0, H, "1")
    for (let i = 0; i < 5; i++) { const mx = x - 8 + i * 9, len = 20 + R(hsh(x + i) * 30); c.vline(mx, 0, len, "q"); c.vline(mx + 1, 0, len - 6, "q") }
  }
})

// ---------------------------------------------------------------- the raft, Pike, Juno
// The raft DATA 1C/GB as on the market: planks lashed over drums, a battery bank, an aerial with its sign.
function raft(c, x, y, f) {
  for (const dx of [6, 40, 76]) { c.ellipse(x + dx + 6, y + 3, 7, 3, "O"); c.hline(x + dx, y + 3, 12, "u") }
  c.rect(x, y - 3, 96, 4, "U"); for (let px = x; px < x + 96; px += 8) c.vline(px, y - 3, 4, "u")
  c.rect(x + 66, y - 13, 14, 10, "3"); c.hline(x + 66, y - 13, 14, "4"); c.px(x + 77, y - 10, (f >> 3) % 2 ? "v" : "C")   // the batteries
  c.vline(x + 86, y - 46, 43, "4"); c.px(x + 86, y - 47, "V")                                                            // the aerial
  c.rect(x + 74, y - 40, 26, 9, "k"); TXT.draw(c, x + 87, y - 38, "DATA 1C/GB", "v", { font: "hud", align: "center" })
  c.hline(x, y + 6, 96, "e"); for (let px = x + 2; px < x + 94; px += 3) c.px(px, y + 8, "z")                           // its shadow on the water
}
// Juno sitting cross-legged in the middle, looking ahead (right): the hood up, the slicker, the bag
function junoSits(c, x, y) {
  c.rect(x - 7, y - 4, 16, 4, "2")                                   // her legs, crossed
  c.poly([x - 7, y - 4, x - 5, y - 20, x + 5, y - 20, x + 7, y - 4], "y")
  c.vline(x - 6, y - 18, 14, "j")                                    // the slicker's back in shade
  c.ellipse(x, y - 25, 5, 6, "y"); c.rect(x + 3, y - 27, 3, 5, "1")  // the hood, the dark slot of her face
  c.line(x - 4, y - 19, x + 4, y - 8, "1"); c.rect(x + 3, y - 10, 5, 5, "3")   // the bag on its strap
}
// Pike standing at the back, poling, a grey heron as a man: long thin legs, a coat folded like grey wings with the black at the shoulder,
// the long white neck in an S with its black stripe down the front, a small white head, the black streak from the eye into the crest that
// hangs back, the long orange-yellow beak. t (0..1): the pole's stroke, planted and pushed, lifted out, raised high, plunged again
const STROKE = [[0, -10, 22, 4, -62], [0.4, -26, 22, -2, -40], [0.55, -24, -16, -2, -60], [0.8, -8, -32, 4, -82], [1, -10, 22, 4, -62]]
function pike(c, x, y, t) {
  const k = STROKE.findIndex((s) => s[0] > t), a = STROKE[k - 1], b = STROKE[k], u = (t - a[0]) / (b[0] - a[0])
  const [bx, by, hx, hy] = [1, 2, 3, 4].map((i) => R(a[i] + (b[i] - a[i]) * u))
  // the pole: from its foot through his hands and on beyond them
  const px0 = x + bx, py0 = y + by, px1 = x + hx, py1 = y + hy, len = Math.hypot(px1 - px0, py1 - py0)
  c.line(px0, py0, R(px1 + (px1 - px0) / len * 22), R(py1 + (py1 - py0) / len * 22), "U")
  c.vline(x - 3, y - 30, 30, "h"); c.vline(x + 2, y - 30, 30, "h"); c.px(x - 3, y - 15, "H"); c.px(x + 2, y - 15, "H")   // the legs, the knees
  c.hline(x - 4, y - 1, 3, "h"); c.hline(x + 2, y - 1, 3, "h")                                                          // the feet
  c.poly([x - 4, y - 58, x + 5, y - 58, x + 7, y - 42, x + 4, y - 28, x - 9, y - 25, x - 6, y - 44], "H")                // the coat, folded
  for (let i = 0; i < 4; i++) c.line(x - 5 + i * 3, y - 52 + i * 2, x - 8 + i * 3, y - 28, "h")                         // its feathers
  c.rect(x + 4, y - 57, 2, 8, "k")                                                                                      // the black at the shoulder
  for (const [ny0, ny1, nx] of [[-66, -58, 3], [-73, -66, 1], [-80, -73, 3]]) c.rect(x + nx - 1, y + ny0, 3, ny1 - ny0, "w")   // the neck, an S
  for (let ny = -76; ny < -58; ny += 3) c.px(x + (ny < -66 && ny >= -73 ? 2 : 4), y + ny, "k")                          // its stripe
  c.ellipse(x + 4, y - 82, 3, 2, "w")                                                                                   // the head
  c.line(x + 5, y - 83, x + 1, y - 83, "k"); c.line(x + 1, y - 83, x - 8, y - 79, "k"); c.line(x + 1, y - 82, x - 6, y - 79, "k")   // eye streak, crest
  c.line(x + 7, y - 82, x + 17, y - 81, "b"); c.line(x + 7, y - 81, x + 15, y - 81, "b")                                // the beak
  c.line(x + 2, y - 55, px1, py1, "h"); c.line(x + 4, y - 54, px1 + 1, py1 + 1, "H")                                     // his arms on the pole
}
const RAFT_X = 112
function crew(c, f) {
  const bob = (f % 24) < 12 ? 0 : 1                                  // the raft rides the water
  raft(c, RAFT_X, RAFT + bob, f)
  pike(c, RAFT_X + 20, RAFT - 3 + bob, (f % 48) / 48)
  junoSits(c, RAFT_X + 54, RAFT - 3 + bob)
}

// ---------------------------------------------------------------- rain: thin streaks, each round the picture 4 times a loop
function rain(c, f) {
  for (let i = 0; i < 70; i++) {
    const y = (R(hsh(i) * 192) + f * 4) % 192 - 6, x = (R(hsh(i + 70) * (W + 48)) - (y >> 2)) % (W + 48)
    if (y >= -4 && y < H) c.line(x, y, x - 1, y + 4, i % 3 ? "4" : "5")
  }
}

// ---------------------------------------------------------------- the end of the ride: Lantern's caravan on pontoons
// A mystical place: old gnarled trees standing in the water on their roots, moss hanging thick, mist over the water, lily pads, a walk
// of planks on posts; small green lanterns in the branches and along the walk (his name: Lantern), each doubled on the water. The caravan
// an old camper full to its roof: solar panels, a water barrel, a crate of plants, aerials and a dish, laundry on a line, boards strapped
// over its front, a ladder; the cable comes along the walk and goes in. The raft ties up at the walk (sumpf_floss).
function bigTree(c, x, base, w, top, seed) {
  // roots: arches into the water, the trunk widening to them, crooked branches, moss hanging thick
  for (let i = -2; i <= 2; i++) {
    const rx = R(x + w / 2 + i * (w * 0.55)), sx = R(x + w / 2 + i * 3)
    c.line(sx, base - 16, rx, base + 2, "3"); c.line(sx + 1, base - 16, rx + 1, base + 2, "3"); c.px(rx, base + 2, "X")
  }
  c.poly([x, top, x + w, top, x + w + 3, base - 18, x + w + 8, base - 6, x - 8, base - 6, x - 3, base - 18], "3")
  c.vline(x, top, base - top - 18, "X"); c.vline(x + 1, top, base - top - 18, "x")
  for (let y = top + 8; y < base - 20; y += 13) c.line(x + 4, y, x + w - 6, y + 5, "2")                                  // the bark's twists                                                                  // lit toward the Crown
  for (let i = 0; i < 5; i++) {
    const by = top + 6 + i * 11, dir = (i + seed) % 2 ? 1 : -1, len = 14 + R(hsh(seed + i) * 22)
    const sx = dir > 0 ? x + w : x, ex = sx + dir * len, ey = by - 8 - R(hsh(seed * 3 + i) * 10)
    c.line(sx, by, ex, ey, "3"); c.line(sx, by + 1, ex, ey + 1, "3")
    for (let m = 0; m < 6; m++) {
      const mx = R(sx + (ex - sx) * (m / 6)), my = R(by + (ey - by) * (m / 6)), ml = 6 + R(hsh(seed + i * 7 + m) * 14)
      c.vline(mx, my, ml, m % 2 ? "G" : "g"); if (m % 3 === 0) c.vline(mx + 1, my + 1, ml - 3, "l")
    }
  }
}
function lantern(c, x, y, water) {
  c.vline(x, y - 9, 7, "1")                                                                 // its string
  c.dither(x - 4, y - 3, 9, 8, ".", "d", 0.45); c.rect(x - 1, y - 1, 3, 3, "L"); c.px(x, y - 2, "d"); c.px(x, y, "V")
  if (water) for (let k = 0; k < 4; k++) c.hline(x - 1, water + 2 + k * 3 + (y % 3), 3 - (k >> 1), k % 2 ? "d" : "L")   // its double on the water
}
sprite("sumpf_bg", { w: W, h: H }, (c) => {
  c.stamp("_sky", 0, 0); c.rect(0, WATER, W, H - WATER, "e")
  for (const [x, w] of [[90, 18], [150, 12], [205, 22]]) { c.rect(x, 30, w, WATER - 30, "2"); c.dither(x - 4, 30, w + 8, WATER - 30, ".", "x", 0.25) }   // far trunks in the mist
  for (let y = WATER - 16; y < WATER + 14; y += 3) c.dither(0, y, W, 2, ".", "x", 0.18)                                     // mist over the water
  bigTree(c, 236, 126, 34, 0, 7)                                                                                   // the old one behind the caravan
  bigTree(c, 14, 146, 22, 0, 1); bigTree(c, 292, 140, 22, 0, 4)
  // the walk of planks on posts, from the left to the caravan's door
  for (let x = 0; x < 196; x += 14) c.vline(x + 4, 136, 16, "u")
  c.rect(0, 133, 196, 3, "U"); for (let x = 0; x < 196; x += 5) c.px(x, 134, "u")
  c.line(0, 129, 196, 131, "1"); c.line(0, 130, 196, 132, "x")                                                            // the cable along it
  // the caravan: an old camper on its pontoons, its cab to the right
  const X = 178, B = 136
  for (const dx of [8, 44, 80, 108]) { c.ellipse(X + dx + 6, B + 3, 8, 4, "O"); c.hline(X + dx, B + 3, 12, "u") }
  c.rect(X, B - 40, 104, 38, "4"); c.hline(X, B - 40, 104, "5"); c.rect(X, B - 40, 2, 38, "5")
  c.poly([X + 104, B - 40, X + 118, B - 26, X + 120, B - 2, X + 104, B - 2], "4"); c.poly([X + 106, B - 37, X + 116, B - 27, X + 106, B - 27], "c")   // the cab, its windscreen
  for (let i = 0; i < 4; i++) c.line(X + 108, B - 20 + i * 4, X + 120, B - 22 + i * 4, "U")                              // boards strapped over its front
  c.ellipse(X + 110, B - 2, 6, 6, "1"); c.ellipse(X + 110, B - 2, 3, 3, "3")                                               // a wheel, half in the water
  c.rect(X + 10, B - 32, 22, 12, "d"); c.rect(X + 12, B - 30, 18, 8, "L")                                                  // a window in his green
  c.rect(X + 42, B - 36, 14, 34, "L"); c.rect(X + 44, B - 34, 10, 32, "d")                                                 // the door open, the light inside
  c.rect(X + 64, B - 32, 30, 10, "2"); c.line(X + 64, B - 32, X + 94, B - 22, "U")                                         // a window boarded
  for (let y = B + 6; y < B + 24; y += 2) c.hline(X + 42, y, 14, y % 4 ? "d" : "e")                                       // the door's light on the water
  // on the roof: the solar panels, the barrel, the crate of plants, aerials, a dish, the laundry line; the ladder behind
  c.poly([X + 4, B - 41, X + 30, B - 52, X + 34, B - 47, X + 8, B - 40], "c")
  for (let i = 1; i < 4; i++) c.line(X + 4 + i * 7, B - 42 - i * 3, X + 8 + i * 7, B - 41 - i * 3, "4")
  c.ellipse(X + 46, B - 48, 6, 8, "C"); c.hline(X + 40, B - 50, 13, "c")
  c.rect(X + 58, B - 48, 20, 8, "U"); for (let i = 0; i < 6; i++) c.px(X + 60 + i * 3, B - 49 - (i % 2), "G"); c.px(X + 66, B - 52, "l")
  for (const [ax, ah] of [[X + 84, 36], [X + 92, 22], [X + 100, 44]]) { c.vline(ax, B - 40 - ah, ah, "5"); c.px(ax, B - 41 - ah, "L") }
  c.ellipse(X + 18, B - 60, 8, 4, "5"); c.ellipse(X + 18, B - 60, 6, 2, "3"); c.vline(X + 18, B - 56, 4, "5")
  c.line(X + 84, B - 58, X + 100, B - 66, "5"); c.rect(X + 88, B - 60, 4, 6, "w"); c.rect(X + 94, B - 63, 3, 5, "6")       // the line, a shirt, a sock
  c.vline(X - 3, B - 40, 38, "5"); c.vline(X - 7, B - 40, 38, "5"); for (let y = B - 38; y < B; y += 5) c.hline(X - 7, y, 5, "5")
  // lily pads and the lanterns
  for (let i = 0; i < 14; i++) { const lx = R(hsh(i + 900) * W), ly = 146 + R(hsh(i + 950) * 30); c.ellipse(lx, ly, 4, 1, "g"); c.px(lx + 2, ly - 1, "e") }
  for (const [lx, ly] of [[34, 50], [58, 72], [8, 98], [118, 112], [150, 122], [196, 70], [212, 96], [286, 62], [304, 96], [268, 40], [250, 112]]) lantern(c, lx, ly, ly > 100 ? 140 : 0)
})


// ---------------------------------------------------------------- the game's pictures
sprite("sumpf_fahrt_bg", { w: W, h: H }, (c) => { c.stamp("_sky", 0, 0); c.rect(0, WATER, W, H - WATER, "e") })
sprite("sumpf_fahrt_far", { w: FAR_W, h: WATER - FAR_Y + 4 }, (c) => c.stamp("_far", 0, 0))
sprite("sumpf_fahrt_mid", { w: MID_W, h: MID_BASE + 16 }, (c) => c.stamp("_mid", 0, 0))
sprite("sumpf_fahrt_weed", { w: WEED_W, h: H - MID_BASE }, (c) => c.stamp("_weed", 0, 0))
sprite("sumpf_fahrt_near", { w: NEAR_W, h: H }, (c) => c.stamp("_near", 0, 0))
// the raft on its own canvas: its deck at (34, 118), so Pike's pole has room behind and above him
const FL = { w: 160, h: 146, x: 34, y: 118 }
anim("sumpf_fahrt_floss", { w: FL.w, h: FL.h, frames: 48, fps: 12 }, (c) => {
  const f = c.frame, bob = (f % 24) < 12 ? 0 : 1
  raft(c, FL.x, FL.y + bob, f); pike(c, FL.x + 20, FL.y - 3 + bob, f / 48); junoSits(c, FL.x + 54, FL.y - 3 + bob)
})
anim("sumpf_floss", { w: FL.w, h: FL.h, frames: 24, fps: 6 }, (c) => {
  const f = c.frame, bob = (f % 12) < 6 ? 0 : 1
  raft(c, FL.x, FL.y + bob, f); pike(c, FL.x + 20, FL.y - 3 + bob, 0.85); junoSits(c, FL.x + 54, FL.y - 3 + bob)
})
