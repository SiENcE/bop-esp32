// The swamps (docs/kapitel2-design.md §3.5 L4, L5, decided 2026-11-16), painted on the lines of the approved sketch
// art/test/sumpf_fahrt_blocks.px.js and the user's references. Two stages seen from the side, where Juno sits on Pike's raft:
//   sumpf_fahrt_bg      the ride's still part: the sky, the city and the Crown behind, the water (320x180)
//   sumpf_fahrt_far     the farther rows (384 wide), sumpf_fahrt_mid the drowned house fronts and trunks (768), sumpf_fahrt_weed the
//                       duckweed (768), sumpf_fahrt_near the big trunks passing in front (768): each a prop that scrolls (game/rooms/sumpf.js)
//   sumpf_fahrt_floss   the raft DATA 1C/GB with Pike poling (48 frames at 12 fps); Juno stands on it as her own figure (game/rooms/sumpf.js)
//   sumpf_bg            the arrival: the old trees, the mist, Lantern's lanterns, the walk of planks, the caravan on pontoons (320x180)
//   sumpf_floss         the raft tied up at the walk, Pike resting on his pole (24 frames)
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
  "!": "#050c09", "~": "#0a1712", $: "#10231a", "%": "#183324", "&": "#22472f", "*": "#34683f", "+": "#5a9a62", "=": "#9ad8a4",   // the deep forest, its glow
  "(": "#0e1411", ")": "#18221b", "[": "#253225", "]": "#3a4a35", "{": "#5d7a48", "<": "#6a2e14", ">": "#a8582a",                  // bark, moss, thorns
  a: "#2a2f36", A: "#474e57", s: "#6f7882", S: "#a9b2bb", t: "#141b26", T: "#2f4766", o: "#ff9a30", i: "#7a4018", W: "#5e4632", K: "#5a2a1e", B: "#7a3e2a", Q: "#4a4038", p: "#1c3156", P: "#2c4c84", F: "#7c8590",                  // the van
})
include("../lib/text.js")

const W = 320, H = 180, FPS = 12, FRAMES = 192
const WATER = 112                                   // the far water line; the raft's at RAFT
const RAFT = 150
const R = Math.round
// a deterministic hash for picking where things stand along a strip
const hsh = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }

// ---------------------------------------------------------------- the trees, for the ride and the arrival
const bez = (a, b, ctl, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * ctl[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * ctl[1] + t * t * b[1]]
// a thick curve, tapering from r0 to r1: roots, branches
function limb(c, a, b, ctl, r0, r1, k, lit, side) {
  for (let t = 0; t <= 1; t += 0.02) {
    const [x, y] = bez(a, b, ctl, t), r = Math.max(1, R(r0 + (r1 - r0) * t))
    c.ellipse(R(x), R(y), r, r, k)
    if (lit) c.px(R(x) + side * r, R(y), lit)
  }
}
// a giant tree: the trunk widening down to its roots, which reach out and down into the water like legs; ridges in the bark, its edge
// lit on the side toward the glow (side +1: right), moss on the ledges, thorns. ks: [body, ridge, lit edge, moss]
function giant(c, cx, top, base, w, legs, side, ks, seed, thorns = 0) {
  // each one its own: how low its roots spread (a flat foot, never a socket), how much it flares toward them, how it leans, how it
  // narrows, whether it forks into a heavy limb, how many roots and how far they reach
  const [kb, kr, kl, km] = ks, rootH = 9 + R(hsh(seed + 1) * 9), foot = base - rootH
  const flare = 0.5 + hsh(seed + 2) * 0.22, lean = (hsh(seed + 3) - 0.5) * w * 0.9, narrow = 0.36 + hsh(seed + 5) * 0.12
  const xAt = (y, u) => { const f = (y - top) / (foot - top); return cx + lean * (1 - f) + u * w * (narrow + (flare - narrow) * f * f) }
  const pts = []
  for (let y = top; y <= foot; y += 6) pts.push(xAt(y, -1), y)
  pts.push(xAt(foot, -1), foot, xAt(foot, 1), foot)
  for (let y = foot - ((foot - top) % 6); y >= top; y -= 6) pts.push(xAt(y, 1), y)
  c.poly(pts.map(R), kb)
  for (let y = top; y < foot; y++) {                                                                 // its far side in shade
    const xa = R(xAt(y, -side)), xb = R(xAt(y, -side * 0.3))
    for (let x = Math.min(xa, xb); x <= Math.max(xa, xb); x++) if ((x + y) % 2 === 0) c.px(x, y, kr)
  }
  for (let i = 0; i < legs; i++) {                                                                    // the roots: out and down, low
    const u = legs > 1 ? i / (legs - 1) - 0.5 : 0, reach = 1.4 + hsh(seed + 7 + i) * 1.3
    const ra = [xAt(foot, u * 1.6), foot - 2], rb = [cx + u * w * reach * 1.6 + (hsh(seed + i) - 0.5) * 8, base + R(hsh(seed * 2 + i) * 4)]
    limb(c, ra, rb, [rb[0] - u * 4, ra[1]], Math.max(2, R(w / 9)), 1, kb, (u * side > 0) ? kl : 0, side)
    c.hline(R(ra[0]) - 2, R(ra[1]) - 1, 4, km)                                                           // moss where the root leaves it
  }
  if (hsh(seed + 4) > 0.45) {                                                                         // a heavy limb, forking off
    const fy = top + (foot - top) * (0.25 + hsh(seed + 6) * 0.25), dir = hsh(seed + 8) > 0.5 ? 1 : -1
    limb(c, [xAt(fy, dir * 0.6), fy], [xAt(fy, dir) + dir * w * 1.2, top - 10], [xAt(fy, dir) + dir * w * 0.9, fy - 10], Math.max(2, R(w / 4)), 2, kb, kl, side)
  }
  for (let u = -0.8; u <= 0.8; u += 0.28 + hsh(seed + u * 10) * 0.12) {                            // ridges, following its lean, a little wavy
    for (let y = top; y < foot; y++) c.px(R(xAt(y, u) + Math.sin((y + seed * 7 + u * 20) / 9) * 1.2), y, kr)
  }
  for (let y = top; y < foot; y++) { c.px(R(xAt(y, side * 0.95)), y, kl); if (y % 2) c.px(R(xAt(y, side * 0.8)), y, kl) }   // the lit edge, soft inward
  for (let i = 0; i < 14; i++) { const my = top + R(hsh(seed + i * 5) * (foot - top)); c.hline(R(xAt(my, hsh(seed + i * 3) * 1.6 - 0.8)), my, 2 + R(hsh(i) * 3), km) }
  for (let i = 0; i < thorns; i++) {                                                                  // thorns, a few orange twigs
    const ty = top + 20 + R(hsh(seed + i * 13) * (foot - top - 30)), tx = xAt(ty, hsh(seed + i * 11) - 0.5)
    for (let j = 0; j < 6; j++) c.line(R(tx), R(ty), R(tx + (hsh(seed + i + j) - 0.5) * 14), R(ty + (hsh(seed + j * 7 + i) - 0.5) * 12), j % 2 ? ">" : "<")
  }
}
function knee(c, x, base, h, k, kl) { c.poly([x - 3, base, x - 1, base - h, x + 1, base - h, x + 3, base], k); c.vline(x + 1, base - h + 1, h - 1, kl) }
// what stands over still water shows in it: mirrored about a line, darker, broken by ripples (a row in three left out, a pixel's sway);
// only on water, never over what already stands in it
const REFL = { S: "A", s: "A", A: "a", a: "(", t: "(", T: "t", L: "+", d: "*", "=": "+", "+": "*", "*": "&", o: "<", F: "A", U: "u", W: "U",
  "]": ")", "{": "&", ")": "(", "[": ")", "&": "%", "%": "$", y: "j", w: "h", H: "h" }
const WATERY = "~%&$!"
function mirror(c, x0, x1, line, depth) {
  for (let d = 1; d <= depth; d++) {
    if (d % 3 === 0) continue
    const ty = line + d, sy = line - d, off = R(Math.sin(ty * 0.9) * (d > 8 ? 1 : 0))
    for (let x = x0; x <= x1; x++) {
      const m = REFL[c.key(x + off, sy)], k = c.key(x, ty)
      if (m && k && WATERY.includes(k)) c.px(x, ty, m)
    }
  }
}
// ---------------------------------------------------------------- sky, the city behind, the Crown (still)
sprite("_sky", { w: W, h: WATER }, (c) => {
  c.rect(0, 0, W, WATER, "n")
  for (const [k, y0] of [["1", 24], ["2", 56], ["3", 86]]) c.rect(0, y0, W, WATER - y0, k)
  c.dither(0, 21, W, 3, "n", "1", 0.5); c.dither(0, 53, W, 3, "1", "2", 0.5); c.dither(0, 83, W, 3, "2", "3", 0.5)
  // the Crown's glow, left, on the undersides of the clouds and low on the horizon
  c.grad(0, 30, 170, 82, "x32.", "r", 0.5)
  for (const [y, x0, x1] of [[38, 0, 120], [46, 10, 150], [52, 0, 100], [61, 30, 170]]) c.hline(x0, y, x1 - x0, "x")
  c.grad(80, 60, 260, 70, "&%$~.", "r", 0.6)                                                          // the forest's green, low and far
  // the city behind: the Ninth's edge, a black mass, and the rings rising to the Crown (top left), lights in rows
  c.poly([0, 18, 26, 18, 26, 40, 46, 40, 46, 70, 70, 70, 70, WATER, 0, WATER], "k")
  c.poly([6, 0, 18, 0, 18, 18, 6, 18], "1")
  for (let y = 22; y < WATER; y += 5) for (let x = 2; x < (y < 40 ? 24 : y < 70 ? 44 : 68); x += 4) if (hsh(x * 7 + y) > 0.55) c.px(x, y, hsh(x + y * 3) > 0.8 ? "R" : "c")
  c.rect(4, 2, 16, 3, "C"); c.rect(6, 1, 12, 1, "V")                                                // the Crown's lit rim
})

// ---------------------------------------------------------------- the farther rows (384 a loop): misty giants on their roots, a few roofs
const FAR_W = 384, FAR_Y = 0
sprite("_far", { w: FAR_W, h: WATER + 4, wrap: "x" }, (c) => {
  const B = WATER
  for (let i = 0; i < 5; i++) { const x = 20 + i * 76 + R(hsh(i) * 20), w = 22 + R(hsh(i + 9) * 16), h = 14 + R(hsh(i + 3) * 14); c.rect(x, B - h, w, h, "$") }
  for (const [x, w, sd] of [[40, 12, 61], [120, 9, 62], [200, 14, 63], [290, 10, 64], [350, 8, 65]]) giant(c, x, 0, B, w, 4, -1, ["%", "$", "&", "&"], sd)
  for (let y = B - 20; y < B; y += 2) c.dither(0, y, FAR_W, 2, ".", "&", 0.1 + (y - B + 20) / 80)     // the mist at their feet
  c.rect(0, B, FAR_W, 4, "~"); for (let x = 0; x < FAR_W; x += 2) c.px(x, B + 1, "%")
})

// ---------------------------------------------------------------- house fronts and trunks (768 a loop)
const MID_W = 768, MID_BASE = 128                                    // the mid water line on the picture
function trunk(c, x, base, wd, moss, k = "1", rim = "x") {
  if (wd) { c.rect(x, 0, wd, base, k); c.vline(x, 0, base, rim); c.poly([x - 4, base, x, base - 10, x + wd, base - 10, x + wd + 4, base], k) }   // lit toward the Crown; the buttress
  for (let i = 0; i < 3; i++) {                                      // branches reaching out, left and right
    const by = 4 + i * 16 + R(hsh(x + i * 13) * 8), dir = (i + x) % 2 ? 1 : -1, len = 8 + R(hsh(x * 5 + i) * 10)
    c.line(dir > 0 ? x + wd : x, by + 6, dir > 0 ? x + wd + len : x - len, by, k)
  }
  for (let i = 0; i < moss; i++) {                                   // Spanish moss hanging from its branches
    const mx = x - 10 + R(hsh(x + i) * (wd + 20)), my = 6 + R(hsh(x * 3 + i) * 40), len = 8 + R(hsh(x + i * 5) * 16)
    c.vline(mx, my, len, i % 2 ? "G" : "g"); c.vline(mx + 1, my + 2, len - 4, "g")
  }
  if (wd) for (let y = base + 1; y < base + 14; y += 2) c.hline(x - 1, y, wd + 2, "z")          // its reflection
}
sprite("_mid", { w: MID_W, h: MID_BASE + 16, wrap: "x" }, (c) => {
  const B = MID_BASE
  // drowned house fronts, two storeys above the water, windows dark, one old sign
  for (const [x, w, h, sign] of [[40, 84, 66, ""], [330, 70, 50, "PHARMACY"], [560, 96, 74, "NOODLE"]]) {
    c.rect(x, B - h, w, h, "2"); c.hline(x, B - h, w, "["); for (let i = 0; i < w; i += 3) if (hsh(x + i) > 0.5) c.px(x + i, B - h - 1, "{")
    for (let wy = B - h + 8; wy < B - 10; wy += 18) for (let wx = x + 8; wx < x + w - 10; wx += 20) {
      c.rect(wx, wy, 10, 12, "!"); c.hline(wx, wy, 10, "("); c.hline(wx - 1, wy + 12, 12, "[")
      if (hsh(wx * 3 + wy) > 0.7) { c.line(wx + 2, wy + 2, wx + 6, wy + 8, "x"); c.px(wx + 7, wy + 3, "x") }               // broken glass
      if (hsh(wx + wy) > 0.85) c.rect(wx + 2, wy + 3, 6, 8, "U")                                 // a board nailed over
    }
    if (sign) { c.rect(x + 6, B - 18, w - 12, 9, "1"); TXT.draw(c, x + w / 2, B - 16, sign, "M", { font: "hud", align: "center" }) }
    c.rect(x, B - 7, w, 7, "1"); for (let i = 0; i < w; i += 2) if (hsh(x * 7 + i) > 0.45) c.px(x + i, B - 1, "{")   // the stain the water left, moss at the line
    c.rect(x, B, w, 14, "~")                                                                                 // the water before it
  }
  // trunks among them, rising out of the picture, moss in the branches
  mirror(c, 0, MID_W - 1, B, 14)
  for (const [x, wd, sd] of [[18, 10, 71], [150, 16, 72], [236, 12, 73], [290, 9, 74], [440, 18, 75], [520, 11, 76], [700, 16, 77], [748, 8, 78]]) {
    giant(c, x, 0, B + 4, wd, 4, -1, ["(", ")", "[", "{"], sd)
    trunk(c, x - 1, 0, 0, 3 + R(wd / 3), "(", "(")                                                     // moss hanging from its branches
  }
})

// ---------------------------------------------------------------- the water and the duckweed by the raft (768 a loop)
const WEED_W = 768
sprite("_weed", { w: WEED_W, h: H - MID_BASE, wrap: "x" }, (c) => {
  for (let i = 0; i < 40; i++) {
    const x = R(hsh(i + 100) * WEED_W), y = 4 + R(hsh(i + 200) * (H - MID_BASE - 8)), w = 10 + R(hsh(i + 300) * 40), near = y > 26
    c.ellipse(x, y, w / 2, near ? 2 : 1, near ? "&" : "%")
    for (let k = 0; k < w / 4; k++) c.px(x - w / 2 + R(hsh(i * 9 + k) * w), y - 1, "*")
  }
  for (let i = 0; i < 30; i++) c.hline(R(hsh(i + 500) * WEED_W), 2 + R(hsh(i + 600) * 46), 6, "z")   // ripples
})

// ---------------------------------------------------------------- the big trunks in front (768 wide, 1536 a loop): giants, dark, lit at the edge
const NEAR_W = 768
sprite("_near", { w: NEAR_W, h: H, wrap: "x" }, (c) => {
  giant(c, 80, 0, H + 8, 28, 4, -1, ["(", ")", "]", "{"], 81, 1)
  giant(c, 500, 0, H + 8, 34, 5, -1, ["(", ")", "]", "{"], 82, 2)
})

// ---------------------------------------------------------------- the raft, Pike, Juno
// The raft DATA 1C/GB as on the market: planks over rusty drums, lashed with rope, a battery bank with its cables and an aerial (its sign
// stays on the market)
function raft(c, x, y, f) {
  for (const dx of [6, 40, 76]) {
    c.ellipse(x + dx + 6, y + 3, 7, 3, "O"); c.hline(x + dx + 2, y + 1, 8, "i"); c.hline(x + dx, y + 5, 12, "u")
    c.line(x + dx + 2, y - 3, x + dx + 9, y + 2, "W"); c.line(x + dx + 9, y - 3, x + dx + 2, y + 2, "W")                // the lashings
  }
  c.rect(x, y - 3, 96, 4, "U"); c.hline(x, y - 3, 96, "W")
  for (let px = x + 5; px < x + 96; px += 7 + (px % 3)) c.vline(px, y - 3, 4, "u")                                   // the planks
  for (let i = 0; i < 12; i++) c.px(x + R(hsh(i + 30) * 94), y - 1, "u")                                               // their grain
  c.rect(x + 66, y - 13, 14, 10, "3"); c.hline(x + 66, y - 13, 14, "4"); c.vline(x + 72, y - 12, 9, "2"); c.vline(x + 66, y - 12, 9, "4")
  c.px(x + 77, y - 10, (f >> 3) % 2 ? "v" : "C")                                                                     // the batteries, a light
  c.line(x + 79, y - 9, x + 86, y - 14, "1")                                                                          // the cable to the aerial
  c.vline(x + 86, y - 46, 43, "4"); c.hline(x + 83, y - 38, 7, "4"); c.hline(x + 84, y - 30, 5, "4"); c.px(x + 86, y - 47, "V")
  c.hline(x, y + 6, 96, "e"); for (let px = x + 2; px < x + 94; px += 3) c.px(px, y + 8, "z")                           // its shadow on the water
}
// Pike standing at the back, poling, a grey heron as a man: long thin legs with their joints, a coat folded like grey wings in layers of
// feathers with the black at the shoulder, the long white neck in an S with its black stripe down the front, a small white head, the
// black streak from the eye into the crest that hangs back, the long beak, paler below. t (0..1): the pole's stroke, planted and pushed,
// lifted out, raised high, plunged again
const STROKE = [[0, -10, 18, 4, -50], [0.4, -26, 18, -2, -32], [0.55, -24, -13, -2, -48], [0.8, -8, -26, 4, -66], [1, -10, 18, 4, -50]]
// his height: 0.8 of the first drawing, so beside Juno (50 px) he is a head and a neck taller, not twice her size
const PY = (v) => R(v * 0.8)
function pike(c, x, y, t) {
  const k = STROKE.findIndex((s) => s[0] > t), a = STROKE[k - 1], b = STROKE[k], u = (t - a[0]) / (b[0] - a[0])
  const [bx, by, hx, hy] = [1, 2, 3, 4].map((i) => R(a[i] + (b[i] - a[i]) * u))
  // the pole: from its foot through his hands and on beyond them, the wood's light side
  const px0 = x + bx, py0 = y + by, px1 = x + hx, py1 = y + hy, len = Math.hypot(px1 - px0, py1 - py0)
  const tx = R(px1 + (px1 - px0) / len * 22), ty = R(py1 + (py1 - py0) / len * 22)
  c.line(px0, py0, tx, ty, "U"); c.line(px0 + 1, py0, tx + 1, ty, "u")
  for (const lx of [x - 3, x + 2]) {                                                                                   // the legs, the joints, the toes
    c.vline(lx, y - PY(30), PY(30), "h"); c.px(lx, y - PY(15), "H"); c.px(lx, y - PY(16), "H"); c.px(lx, y - PY(29), "H")
    c.hline(lx - 1, y - PY(1), 4, "h"); c.px(lx - 2, y, "h"); c.px(lx + 3, y, "h")
  }
  c.poly([x - 4, y - PY(58), x + 5, y - PY(58), x + 7, y - PY(42), x + 4, y - PY(28), x - 9, y - PY(25), x - 6, y - PY(44)], "H")                // the coat, folded
  for (let row = 0; row < 5; row++) {                                                                                  // its feathers, in layers
    const ry = y - PY(52) + PY(row * 6)
    for (let fx = x - 7 + row; fx < x + 5 - (row >> 1); fx += 4) { c.px(fx, ry, "h"); c.px(fx + 1, ry + PY(1), "h"); c.px(fx + 2, ry + PY(1), "h") }
  }
  c.line(x - 9, y - PY(25), x - 6, y - PY(44), "h"); c.line(x - 6, y - PY(44), x - 4, y - PY(57), "h")                                // its back edge in shade
  c.rect(x + 4, y - PY(57), 2, 8, "k"); c.px(x + 6, y - PY(55), "k")                                                          // the black at the shoulder
  for (const [ny0, ny1, nx] of [[-66, -58, 3], [-73, -66, 1], [-80, -73, 3]]) { c.rect(x + nx - 1, y + PY(ny0), 3, PY(ny1) - PY(ny0), "w"); c.vline(x + nx - 1, y + PY(ny0), PY(ny1) - PY(ny0), "H") }
  for (let ny = -76; ny < -58; ny += 3) c.px(x + (ny < -66 && ny >= -73 ? 2 : 4), y + PY(ny), "k")                          // the stripe down the neck
  c.ellipse(x + 4, y - PY(82), 3, 2, "w"); c.px(x + 2, y - PY(81), "H")                                                       // the head
  c.line(x + 5, y - PY(83), x + 1, y - PY(83), "k"); c.line(x + 1, y - PY(83), x - 8, y - PY(79), "k"); c.line(x + 1, y - PY(82), x - 6, y - PY(79), "k")   // eye streak, crest
  c.px(x + 5, y - PY(82), "b")                                                                                             // the eye
  c.line(x + 7, y - PY(82), x + 17, y - PY(81), "b"); c.line(x + 7, y - PY(81), x + 15, y - PY(81), "<")                              // the beak, paler above
  c.line(x + 2, y - PY(55), px1, py1, "h"); c.line(x + 4, y - PY(54), px1 + 1, py1 + 1, "H")                                     // his arms on the pole
  c.px(px1, py1, "w"); c.px(px1 + 1, py1 + 1, "w")                                                                     // his hands
}
const RAFT_X = 112
function crew(c, f) {
  const bob = (f % 24) < 12 ? 0 : 1                                  // the raft rides the water
  raft(c, RAFT_X, RAFT + bob, f)
  pike(c, RAFT_X + 20, RAFT - 3 + bob, (f % 48) / 48)
}

// ---------------------------------------------------------------- rain: thin streaks, each round the picture 4 times a loop
function rain(c, f) {
  for (let i = 0; i < 70; i++) {
    const y = (R(hsh(i) * 192) + f * 4) % 192 - 6, x = (R(hsh(i + 70) * (W + 48)) - (y >> 2)) % (W + 48)
    if (y >= -4 && y < H) c.line(x, y, x - 1, y + 4, i % 3 ? "4" : "5")
  }
}

// ---------------------------------------------------------------- the end of the ride: Lantern's caravan in the drowned forest
// Deep in the forest the canopy closes over the water and the Crown is gone: dark, and in the middle a green glow in the mist, from his
// lanterns and the water itself. Giant old trees stand on their roots like on legs, their bark in ridges, moss on every ledge, vines
// hanging from a branch that arches over everything, a few orange thorns; cypress knees in the water, spores drifting in the light. The
// caravan: a boxy old camper van from the side, silver above and dark below, big dark windows, the cab to the right with its sloped
// windscreen and square amber lamps, a roof box and a rack with cans and a panel, his aerials and dish; it stands on drums, its sliding
// door open on his green. The walk of planks comes from the left; the raft ties up below it (sumpf_floss).
function lantern(c, x, y, water, string = 10) {
  c.vline(x, y - string, string - 2, "(")
  c.dither(x - 5, y - 4, 11, 10, ".", "*", 0.35); c.dither(x - 3, y - 2, 7, 6, ".", "+", 0.5)
  c.rect(x - 1, y - 1, 3, 3, "+"); c.px(x, y, "=")
  if (water) for (let k = 0; k < 5; k++) c.hline(x - 2 + (k % 2), water + 2 + k * 3, 4 - (k >> 1), k % 2 ? "*" : "+")   // its double on the water
}
// the van, from the side, its cab to the right: x0 its back, b the bottom of its body. No wheels: it stands on bricks on its pontoon
function van(c, x0, b) {
  const x1 = x0 + 130, top = b - 50
  // the pontoon it stands on: a deck of boards on a row of blue floats, half in the water, posts and a rail along its edge
  const px0 = x0 - 12, px1 = x1 + 12
  for (let x = px0 + 1; x < px1 - 8; x += 11) { c.rect(x, b + 9, 10, 7, "p"); c.hline(x, b + 9, 10, "P"); c.vline(x, b + 9, 7, "P"); c.px(x + 2, b + 10, "F") }
  c.dither(px0, b + 13, px1 - px0, 3, ".", "~", 0.5)
  c.rect(px0, b + 6, px1 - px0, 3, "U"); c.hline(px0, b + 6, px1 - px0, "W")
  for (let x = px0; x < px1; x += 6) c.px(x, b + 7, "u"); c.hline(px0, b + 8, px1 - px0, "u")
  for (let x = px0 + 2; x < px1; x += 14) { c.vline(x, b - 2, 8, "F"); c.px(x, b - 2, "S") }
  c.hline(px0 + 2, b - 2, px1 - px0 - 4, "F")
  for (let x = px0; x < px1; x += 3) c.px(x, b + 17 + (x % 2), "&")                                                    // its line on the water
  // the body: silver, lighter at the top, darker toward the belt; dark below it, muddy at the bottom
  c.poly([x0, top + 2, x0 + 2, top, x1 - 34, top, x1 - 14, top + 20, x1 + 2, top + 26, x1 + 3, b, x0, b], "s")
  c.rect(x0 + 2, top + 1, x1 - 36 - x0, 3, "S"); c.dither(x0 + 1, top + 4, x1 - 38 - x0, 2, "s", "S", 0.4)
  c.hline(x0 + 1, top + 23, x1 - x0, "A")
  c.poly([x0, top + 26, x1 + 2, top + 26, x1 + 3, b, x0, b], "a")
  c.hline(x0, top + 27, x1 + 2 - x0, "A"); c.dither(x0, b - 5, x1 + 3 - x0, 4, "a", "U", 0.35)
  c.line(x1 - 34, top, x1 - 14, top + 20, "S"); c.hline(x0, top + 26, x1 + 2 - x0, "A")
  c.hline(x0 + 2, top + 3, x1 - 37 - x0, "A")                                                                          // the drip rail
  c.hline(x0, b - 1, x1 + 3 - x0, "(")
  // the windows: two on the box, the cab's door window, the windscreen's edge; their frames, a pale streak of the glow
  for (const [wx, ww] of [[x0 + 8, 24], [x0 + 74, 22]]) {
    c.rect(wx - 1, top + 5, ww + 2, 16, "A"); c.rect(wx, top + 6, ww, 14, "t"); c.hline(wx, top + 6, ww, "T")
    c.line(wx + 4, top + 18, wx + 12, top + 7, "T"); c.line(wx + 8, top + 18, wx + 15, top + 9, "T")
  }
  c.poly([x1 - 44, top + 5, x1 - 32, top + 5, x1 - 20, top + 20, x1 - 44, top + 20], "t"); c.line(x1 - 38, top + 18, x1 - 30, top + 8, "T")
  c.line(x1 - 30, top + 2, x1 - 13, top + 19, "t")
  // the seams: the cab's door, the box's back, a handle; the mirror; the tail light
  c.vline(x1 - 46, top + 4, b - top - 6, "A"); c.vline(x1 - 18, top + 22, b - top - 24, "A"); c.rect(x1 - 42, top + 24, 3, 1, "S")
  c.vline(x0 + 3, top + 4, b - top - 6, "A"); c.rect(x1 - 26, top + 10, 3, 5, "A"); c.px(x1 - 25, top + 11, "S")
  c.rect(x0, top + 30, 2, 5, "<"); c.px(x0, top + 31, "o")
  // the sliding door open: his green inside, its rail, the cable going in
  c.rect(x0 + 38, top + 6, 26, b - top - 7, "d"); c.rect(x0 + 41, top + 9, 20, b - top - 12, "L"); c.vline(x0 + 37, top + 5, b - top - 5, "A")
  c.hline(x0 + 38, top + 5, 30, "A"); c.dither(x0 + 41, top + 9, 20, 6, "L", "=", 0.3)
  for (let y = b + 18; y < b + 34; y += 2) c.hline(x0 + 40, y, 22, y % 4 ? "d" : "~")                                // its light on the water
  // the cab's front: the lamp, the grille's edge, the bumper; the wheels standing on the deck, their tyres and rims
  c.rect(x1, top + 30, 3, 4, "o"); c.dither(x1 + 2, top + 27, 8, 10, ".", "<", 0.4); c.px(x1 + 3, top + 31, "o")
  for (let y = top + 36; y < b - 4; y += 3) c.px(x1 + 2, y, "(")
  c.rect(x1 - 4, b - 4, 9, 4, "A"); c.hline(x1 - 4, b - 4, 9, "s")
  // no wheels: the empty arches dark, and under each axle a stack of bricks it rests on: three courses, bonded, the joints filled with
  // mortar, standing on the pontoon's deck and reaching up into the arch where the axle was
  for (const wx of [x0 + 22, x1 - 22]) {
    c.ellipse(wx, b - 1, 10, 7, "("); c.rect(wx - 10, b - 1, 21, 2, "(")
    for (let row = 0; row < 3; row++) {
      const y = b + 3 - row * 3, half = row === 2 ? 7 : 11, l = wx - half, r = wx + half
      c.rect(l, y, r - l + 1, 3, "Q")                                                                                  // the mortar
      for (let s0 = l - (row % 2 ? 4 : 0); s0 <= r; s0 += 8) {
        const bl = Math.max(s0, l), br = Math.min(s0 + 6, r)
        if (br - bl < 1) continue
        c.rect(bl, y, br - bl + 1, 2, "K"); c.hline(bl, y, br - bl + 1, "B")
      }
    }
  }
  // rust and moss: streaks under the windows, moss along the roof
  for (const rx of [x0 + 12, x0 + 30, x0 + 80, x0 + 92, x1 - 40]) { const len = 6 + R(hsh(rx) * 6); c.vline(rx, top + 20, len, "i"); c.px(rx + 1, top + 20 + len - 2, "i") }
  for (let x = x0 + 2; x < x1 - 36; x += 2) if (hsh(x * 3) > 0.5) c.px(x, top - 1, hsh(x) > 0.5 ? "{" : "&")
  // what he added to its grey sides, small and many: a conduit along the body, riveted panels, a vent, a locker on the lower body, a junction
  // box with its cables, a row of small cyan status lights (tech: the style guide's cyan)
  c.hline(x0 + 2, top + 22, 34, "A"); c.hline(x0 + 2, top + 21, 34, "S"); c.hline(x0 + 66, top + 22, 34, "A"); c.hline(x0 + 66, top + 21, 34, "S")
  for (const [gx, gy, gw, gh] of [[x0 + 4, top + 30, 12, 7], [x0 + 72, top + 30, 9, 6], [x1 - 40, top + 29, 8, 5]]) {
    c.rect(gx, gy, gw, gh, "A"); c.hline(gx, gy, gw, "s"); c.px(gx + 1, gy + 1, "S"); c.px(gx + gw - 2, gy + 1, "S"); c.px(gx + 1, gy + gh - 2, "S"); c.px(gx + gw - 2, gy + gh - 2, "S")
  }
  for (let i = 0; i < 4; i++) c.hline(x0 + 84, top + 31 + i * 2, 8, "(")                                              // the vent
  c.rect(x0 + 18, top + 34, 16, 9, "A"); c.hline(x0 + 18, top + 34, 16, "s"); c.vline(x0 + 26, top + 35, 8, "a"); c.px(x0 + 24, top + 38, "S")   // the locker
  c.rect(x1 - 52, top + 6, 5, 7, "A"); c.hline(x1 - 52, top + 6, 5, "S"); c.line(x1 - 50, top + 13, x1 - 50, top + 22, "(")                    // a junction box, its cable
  for (let i = 0; i < 4; i++) c.px(x0 + 6 + i * 3, top + 33, i % 2 ? "v" : "C")                                      // status lights
  c.px(x1 - 38, top + 31, "v")
  // on the roof: the roof box at the back, the rack with cans and a solar panel, the dish, the mast and the whips, green lights on top
  c.rect(x0 + 2, top - 16, 36, 16, "s"); c.hline(x0 + 2, top - 16, 36, "S"); c.hline(x0 + 2, top - 1, 36, "A")
  c.rect(x0 + 6, top - 12, 12, 8, "t"); c.rect(x0 + 21, top - 12, 12, 8, "t"); c.hline(x0 + 6, top - 12, 12, "T"); c.hline(x0 + 21, top - 12, 12, "T")
  c.hline(x0 + 40, top - 5, 48, "A"); for (const rx of [x0 + 40, x0 + 64, x0 + 88]) c.vline(rx, top - 5, 5, "A")
  c.rect(x0 + 43, top - 12, 6, 7, "a"); c.vline(x0 + 43, top - 12, 7, "A"); c.rect(x0 + 50, top - 11, 6, 6, "a"); c.vline(x0 + 50, top - 11, 6, "A")
  c.poly([x0 + 58, top - 6, x0 + 84, top - 14, x0 + 86, top - 10, x0 + 60, top - 5], "c"); for (let i = 1; i < 4; i++) c.line(x0 + 58 + i * 7, top - 6 - i * 2, x0 + 59 + i * 7, top - 5 - i * 2, "4")
  c.ellipse(x0 + 18, top - 24, 8, 4, "A"); c.ellipse(x0 + 18, top - 24, 6, 2, "a"); c.hline(x0 + 12, top - 26, 6, "s"); c.vline(x0 + 18, top - 20, 4, "A")
  const mast = x0 + 30, mtop = 6
  c.vline(mast, mtop, top - 16 - mtop, "A"); c.vline(mast + 1, mtop + 10, top - 26 - mtop, "a")
  for (let i = 0; i < 6; i++) { const y = mtop + 4 + i * 5, half = 7 - i; c.hline(mast - half, y, half * 2 + 1, "A") }   // its crossbars, shorter going down
  c.line(mast, mtop + 2, x0 + 2, top - 16, "("); c.line(mast, mtop + 2, x0 + 40, top - 5, "(")                        // guy lines
  c.px(mast, mtop - 1, "="); c.px(mast, mtop, "+")
  for (const [ax, ah] of [[x0 + 36, 56], [x0 + 66, 44], [x0 + 86, 62], [x1 - 40, 36]]) { c.vline(ax, top - 6 - ah, ah, "A"); c.px(ax, top - 7 - ah, "=") }
  c.vline(x0 - 3, top, b - top, "A"); c.vline(x0 - 7, top, b - top, "A"); for (let y = top + 3; y < b; y += 5) c.hline(x0 - 7, y, 5, "A")
}
sprite("sumpf_bg", { w: W, h: H }, (c) => {
  // the dark and the glow in the mist, two pale shafts falling through the canopy
  c.rect(0, 0, W, H, "!")
  c.grad(40, 20, 260, 150, "=+*&%$~.", "r", 0.6)
  for (const [x0, x1, w] of [[150, 186, 8], [196, 214, 5]]) for (let y = 0; y < 140; y++) c.dither(R(x0 + (x1 - x0) * y / 140), y, w, 1, ".", "*", 0.16 - y / 1400)
  // far trunks in the glow, paler the farther, standing on their roots
  for (const [x, w, s] of [[96, 16, 21], [196, 20, 22], [140, 10, 23], [232, 12, 24]]) giant(c, x, 0, 136, w, 4, x < 160 ? 1 : -1, ["&", "%", "*", "*"], s)
  for (const [x, w, s] of [[60, 22, 31], [262, 26, 32]]) giant(c, x, 0, 140, w, 5, x < 160 ? 1 : -1, ["%", "$", "&", "&"], s)
  // the mist lying over the water, thick in the glow
  for (let y = 112; y < 146; y += 2) c.dither(30, y, 260, 2, ".", y < 128 ? "*" : "&", 0.12 + (y - 112) / 140)
  // the water: dark, the glow on it in broken strokes
  c.rect(0, 146, W, H - 146, "~")
  for (let i = 0; i < 40; i++) { const x = 60 + R(hsh(i + 400) * 200), y = 148 + R(hsh(i + 450) * 30); c.hline(x, y, 3 + R(hsh(i) * 8), y < 160 ? "&" : "%") }
  // the giants in front, left and right, and the branch over everything with its vines
  giant(c, 8, 0, 176, 30, 4, 1, ["(", ")", "]", "{"], 41, 2); giant(c, 314, 0, 174, 34, 4, -1, ["(", ")", "]", "{"], 42, 2)
  limb(c, [0, 22], [W, 14], [150, -26], 7, 5, "(", "]", 1)
  for (let i = 0; i < 26; i++) {
    const x = 6 + i * 12 + R(hsh(i + 600) * 6), y0 = R(bez([0, 22], [W, 14], [150, -26], x / W)[1]) + 3, len = 14 + R(hsh(i + 650) * 70)
    c.vline(x, y0, len, i % 3 ? "(" : ")"); if (i % 4 === 0) for (let k = 0; k < len; k += 6) c.px(x + 1, y0 + k, "&")
  }
  // cypress knees and roots in the water
  for (const [x, h] of [[96, 9], [112, 6], [150, 11], [300, 8], [78, 5]]) knee(c, x, 172, h, "(", "]")
  // the walk of planks on its posts, from the left to the van's door
  for (let x = 0; x < 214; x += 14) c.vline(x + 4, 140, 16, ")")
  c.rect(0, 137, 214, 3, "["); for (let x = 0; x < 214; x += 5) c.px(x, 138, ")")
  c.line(0, 134, 214, 136, "("); c.line(0, 135, 214, 137, "$")                                                  // the cable along it
  van(c, 174, 138)
  mirror(c, 0, W - 1, 152, 28)
  for (let y = 138; y < 158; y += 2) c.dither(40, y, 240, 2, ".", "&", 0.07)                                     // mist low over the water
  // his lanterns on strings from the branch and the vines, doubled on the water; spores drifting in the light
  for (const [lx, ly, s] of [[46, 58, 30], [94, 44, 24], [128, 86, 50], [158, 40, 22], [204, 56, 34], [246, 40, 20], [286, 72, 52], [116, 112, 16], [232, 108, 14]]) lantern(c, lx, ly, ly > 100 ? 146 : 0, s)
  for (let i = 0; i < 18; i++) c.px(70 + R(hsh(i + 700) * 190), 70 + R(hsh(i + 750) * 70), i % 3 ? "+" : "=")
})

// ---------------------------------------------------------------- what makes the swamp uneasy (the user's wish, 2026-11-16)
// Banks of mist, seamless across their 320 px, that the game drifts over the water at a low alpha (fx mist); value noise repeating
// every 320 px, thick parts pale, a dithered fringe, fading to nothing at the band's top and bottom.
function mistBand(c, h, seed, cell, thick) {
  const P = W / cell, bay = (x, y) => ([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5][(y & 3) * 4 + (x & 3)] + 0.5) / 16
  const hv = (a, bb) => hsh((((a % P) + P) % P) * 13.1 + bb * 7.7 + seed * 101)
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
    const a0 = hv(xi, yi), b0 = hv(xi + 1, yi), c0 = hv(xi, yi + 1), d0 = hv(xi + 1, yi + 1)
    return a0 + (b0 - a0) * sx + (c0 - a0) * sy + (a0 - b0 - c0 + d0) * sx * sy
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < W; x++) {
    const v = (noise(x / cell, y / (cell * 0.35)) * 0.65 + noise(x / (cell / 2), y / (cell * 0.18) + 9) * 0.35) * Math.pow(Math.sin(Math.PI * (y + 0.5) / h), 0.8)
    if (v > thick) c.px(x, y, "+")
    else if (v > thick - 0.09 && bay(x, y) < (v - thick + 0.09) / 0.09) c.px(x, y, "*")
  }
}
sprite("sumpf_nebel_a", { w: W, h: 40 }, (c) => mistBand(c, 40, 1, 40, 0.5))
sprite("sumpf_nebel_b", { w: W, h: 30 }, (c) => mistBand(c, 30, 2, 32, 0.52))
// Something under the water (never seen): a slow wake crossing the picture, the rings it leaves, now and then bubbles that rise and burst.
// 160 frames at 10 fps; the wake crosses in the first 110, then the water lies still but for the bubbles.
anim("sumpf_wesen", { w: W, h: 26, frames: 160, fps: 10 }, (c) => {
  const f = c.frame
  if (f < 110) {
    const hx = R(-20 + f * 3.2), hy = 12
    for (let k = 1; k < 7; k++) {                                                                   // the V behind it, widening
      const bx = hx - k * 5, sp = k * 2
      c.px(bx, hy - sp, k < 4 ? "*" : "&"); c.px(bx - 1, hy - sp, "&"); c.px(bx, hy + sp, k < 4 ? "*" : "&"); c.px(bx - 1, hy + sp, "&")
    }
    c.hline(hx - 2, hy, 4, "+"); c.px(hx + 2, hy, "*")                                              // the swell over it
    for (const back of [24, 52]) {                                                                   // rings left where it rose
      const age = f % 28, rx = hx - back - age, rr = R(age / 3) + 2
      if (age < 20) c.ellipse(rx, hy, rr + 3, R(rr / 2) + 1, age < 10 ? "*" : "&", true)
    }
  }
  for (let i = 0; i < 4; i++) {                                                                       // bubbles: rise, burst, gone
    const t0 = i * 37 + 20, age = (f - t0 + 160) % 160, bx = 40 + i * 71 + (i % 2) * 13
    if (age < 6) c.px(bx, 14 - (age >> 1), "+")
    else if (age < 9) { c.ellipse(bx, 13, age - 4, 1, "*", true) }
  }
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
  raft(c, FL.x, FL.y, f); pike(c, FL.x + 20, FL.y - 3, f / 48)
})
anim("sumpf_floss", { w: FL.w, h: FL.h, frames: 24, fps: 6 }, (c) => {
  const f = c.frame, bob = (f % 12) < 6 ? 0 : 1
  raft(c, FL.x, FL.y, f); pike(c, FL.x + 20, FL.y - 3, 0.85)
})
