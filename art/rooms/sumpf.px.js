// The swamps (docs/kapitel2-design.md §3.5 L4, L5, decided 2026-11-16), painted on the lines of the approved sketch
// art/test/sumpf_fahrt_blocks.px.js and the user's references. Two stages seen from the side, where Juno sits on Pike's raft:
//   sumpf_fahrt_bg      the ride's still part: the sky, the city and the Crown behind, the water (320x180)
//   sumpf_fahrt_far     the farther rows (384 wide), sumpf_fahrt_mid the drowned house fronts and trunks (768), sumpf_fahrt_weed the
//                       duckweed (768), sumpf_fahrt_near the big trunks passing in front (768): each a prop that scrolls (game/rooms/sumpf.js)
//   sumpf_fahrt_tunnel  the ride's start: the tunnel under the Ring's last pillar and its portal, slid off to the left as the ride begins
//   sumpf_fahrt_floss   the raft DATA 1C/GB with Pike poling (48 frames at 12 fps); Juno stands on it as her own figure (game/rooms/sumpf.js)
//   sumpf_bg            the arrival: the old trees, the mist, Lantern's lanterns, the walk of planks, the caravan on pontoons, and behind
//                       it to the right the roots, the dead tree with his mast and the half-sunk boat (640x180, it scrolls)
//   sumpf_funk_bg       the radio from the boat close, over the swamp dimmed: the small game at it (its parts' places: FUNK_AT)
//   sumpf_tuer_zu       the caravan's door shut; sumpf_reuse Pike's trap in the roots; sumpf_funk the radio in the boat (parts that change)
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
// ---------------------------------------------------------------- behind the caravan ("Auf Sendung", kapitel2-design §3.5)
// The arrival is 640 wide and scrolls (the user approved the block, 2026-11-16: art/test/sumpf_rechts_blocks.px.js): to the right of the
// caravan the forest goes on, darker away from his glow; the walk of planks goes on from the van's pontoon on its posts. Along it the
// roots of a giant reaching into the water (Pike's trap caught in them: its own part, sumpf_reuse), his antenna mast lashed to a dead
// tree, bleached, his cable sagging over to it from the van's roof, on the trunk at eye height a small screen showing his wave (a saw: the
// one Juno has to match), and an old boat half sunk by the walk, its bow up, a tarp in it (the radio under it: its own part, sumpf_funk).
const RX = 320, WALK = 144                          // where the right half begins; the walk's top, as the pontoon's deck
function rightBack(c) {
  c.rect(RX, 0, 320, H, "!")
  c.grad(RX + 92, 50, 120, 100, "*&%$~.", "r", 0.3)                                                   // a little of his glow, round the mast's screen
  for (const [x, w, s] of [[RX + 44, 14, 51], [RX + 118, 18, 52], [RX + 214, 12, 53], [RX + 290, 16, 54]]) giant(c, x, 0, 134, w, 4, x < RX + 160 ? 1 : -1, ["%", "$", "&", "&"], s)
  for (const [x, w, s] of [[RX + 170, 22, 61], [RX + 262, 20, 62]]) giant(c, x, 0, 140, w, 5, -1, ["$", "~", "%", "%"], s)
  for (let y = 112; y < 146; y += 2) c.dither(RX, y, 320, 2, ".", y < 128 ? "&" : "%", 0.1 + (y - 112) / 160)
  c.rect(RX, 146, 320, H - 146, "~")
  for (let i = 0; i < 30; i++) { const x = RX + R(hsh(i + 900) * 316), y = 148 + R(hsh(i + 950) * 30); c.hline(x, y, 2 + R(hsh(i + 7) * 6), y < 160 ? "%" : "$") }
}
function rightFront(c) {
  // the branch going on over the right half, its vines
  limb(c, [RX - 4, 14], [640, 26], [RX + 160, -14], 6, 4, "(", "]", 1)
  for (let i = 0; i < 20; i++) {
    const x = RX + 8 + i * 16 + R(hsh(i + 800) * 6), y0 = R(bez([RX - 4, 14], [640, 26], [RX + 160, -14], (x - RX + 4) / 324)[1]) + 3, len = 10 + R(hsh(i + 850) * 60)
    c.vline(x, y0, len, i % 3 ? "(" : ")"); if (i % 4 === 0) for (let k = 0; k < len; k += 6) c.px(x + 1, y0 + k, "&")
  }
  // the giant's roots reaching into the water in front of the walk, where the trap is caught
  for (const [a, b, ctl, r0] of [[[RX + 26, 112], [RX + 44, 178], [RX + 18, 150], 4], [[RX + 40, 116], [RX + 78, 176], [RX + 46, 150], 4], [[RX + 60, 120], [RX + 96, 172], [RX + 84, 136], 3]])
    limb(c, a, b, ctl, r0 + 1, 1, ")", "{", 1)
  for (const [x, y] of [[RX + 30, 132], [RX + 52, 140], [RX + 76, 146], [RX + 40, 124]]) c.hline(x, y, 3, "{")
  // his tower (the user's reference, 2026-11-17: a slim radio tower): a lattice mast on a concrete foot in the water, tapering upward,
  // its two legs lit on the left, the braces zigzagging between them, a ladder up its middle; at its top two rings of panel antennas round
  // it, a small dish, a whip with his green light; his cable coming over from the van's roof to it; at its foot a box with the small
  // screen at eye height showing his wave (a saw: the one Juno has to match)
  const TX = RX + 142, TB = 146, TT = 12                                // the tower's middle, its foot and its top
  const half = (y) => 6 - ((TB - y) / (TB - TT)) * 4                     // half its width: 6 at the foot, 2 at the top
  c.rect(TX - 10, TB - 2, 21, 14, "a"); c.hline(TX - 10, TB - 2, 21, "s"); c.vline(TX - 10, TB - 2, 14, "A")      // the foot
  for (let x = TX - 9; x < TX + 10; x += 4) c.px(x, TB + 6, "{")
  for (let y = TT; y < TB - 2; y++) {
    const h = half(y), xl = Math.round(TX - h), xr = Math.round(TX + h)
    c.px(xl, y, "s"); c.px(xr, y, "A")                                                                     // the legs
    if (y % 3 === 0) c.px(TX, y, "a")                                                                      // the ladder's rungs
  }
  for (let y = TT + 4; y < TB - 6; y += 8) {                                                               // the braces, a zigzag
    const h0 = half(y), h1 = half(y + 8)
    c.line(Math.round(TX - h0), y, Math.round(TX + h1), y + 8, "A"); c.line(Math.round(TX + h0), y, Math.round(TX - h1), y + 8, "a")
    c.hline(Math.round(TX - h0), y, Math.round(2 * h0) + 1, "A")
  }
  for (const ry of [TT + 6, TT + 16]) {                                                                    // the rings of panels
    c.hline(TX - 9, ry + 4, 19, "A"); c.hline(TX - 9, ry + 5, 19, "a")
    for (const dx of [-9, -5, 3, 7]) { c.rect(TX + dx, ry - 2, 3, 8, "s"); c.vline(TX + dx, ry - 2, 8, "S"); c.px(TX + dx + 2, ry + 5, "a") }
  }
  c.ellipse(TX + 6, TT + 28, 3, 3, "A"); c.ellipse(TX + 6, TT + 28, 2, 2, "s"); c.px(TX + 5, TT + 27, "S")   // a small dish
  c.vline(TX, 0, TT, "A"); c.px(TX, 0, "="); c.px(TX, 1, "+")                                              // the whip, his light
  for (let x = 286; x <= TX - 4; x++) { const t = (x - 286) / (TX - 4 - 286); c.px(x, Math.round(70 + t * -36 + Math.sin(t * Math.PI) * 16), "(") }
  c.line(TX + 2, 34, TX + 3, 92, "(")                                                                      // the cable down to the box
  // the box at its foot with the small screen at eye height
  c.rect(TX - 12, 90, 24, 18, "k"); c.rect(TX - 11, 91, 22, 16, "a"); c.hline(TX - 11, 91, 22, "A")
  c.rect(TX - 9, 93, 18, 11, "("); c.rect(TX - 8, 94, 16, 9, "d")
  for (let x = 0; x < 16; x++) c.px(TX - 8 + x, 101 - (x % 6), "L")
  c.px(TX + 8, 105, "y")
  c.dither(TX - 16, 86, 32, 24, ".", "*", 0.1)
  // the walk of planks going on from the pontoon on its posts
  for (let x = 316; x < 612; x += 14) c.vline(x + 4, WALK + 2, 18, ")")
  c.rect(316, WALK, 296, 4, "U"); for (let x = 316; x < 612; x += 5) c.vline(x, WALK, 4, "u"); c.hline(316, WALK, 296, "W")
  for (let x = 320; x < 612; x += 23) c.px(x, WALK, "{")                                                  // moss on its boards
  c.line(316, WALK - 2, 612, WALK - 1, "(")                                                            // the cable along it, on to nowhere
  // the old rowing boat by the walk (the user's reference, 2026-11-17): weathered grey planks, seen a little from above, its bow raised to
  // the left and pointed, its stern sunk to the right and full of dark water; the far gunwale above the near one, the inside between them,
  // two thwarts across, the ribs; the near side's strakes down to the water. The radio sits on the front thwart (a part, sumpf_funk)
  const BX = RX + 192, BL = 84, WL = 170                                 // its bow's tip, its length, the waterline outside
  const shape = (x) => {
    const t = (x - BX) / BL, w = Math.min(1, (x - BX) / 18), up = (1 - w) * 6, mid = 157 + 8 * t - up
    return { t, w, far: Math.round(mid - 4 * w), near: Math.round(mid + 4 * w), keel: Math.round(mid + 4 * w + 7 * w + 1) }
  }
  for (let x = BX; x < BX + BL; x++) {
    const { w, far, near, keel } = shape(x)
    for (let y = far + 1; y < near; y++) c.px(x, y, (y - far) % 3 === 0 ? "(" : "a")                       // the inside, its planks
    c.px(x, far, "s"); c.px(x, far - 1, x % 9 ? "A" : "F")                                                // the far gunwale, worn pale
    for (let y = near; y <= Math.min(keel, WL); y++) c.px(x, y, y === near ? "s" : (y - near) % 3 === 2 ? "a" : "A")   // the strakes
    if (w < 1) c.px(x, far - 1, "s")
  }
  c.vline(BX, shape(BX).far - 2, 6, "s"); c.px(BX - 1, shape(BX).far - 2, "F")                           // the stem
  { const { far, keel } = shape(BX + BL - 1); c.vline(BX + BL, far - 1, Math.min(keel, WL) - far + 2, "A"); c.vline(BX + BL + 1, far, Math.min(keel, WL) - far, "a") }   // the transom
  for (let x = BX + 18; x < BX + BL - 4; x += 8) { const { far, near } = shape(x); c.line(x, far + 1, x + 1, near - 1, "a") }   // the ribs
  for (const tt of [0.3, 0.56]) {                                                                         // the thwarts
    const x0 = Math.round(BX + tt * BL), { far, near } = shape(x0)
    for (let k = 0; k < 5; k++) c.line(x0 + k, far + 1, x0 + k + 2, near - 1, k < 2 ? "F" : k < 4 ? "s" : "(")
  }
  // the stern sunk: dark water inside it, level, a pale line where it lies; outside, the water along the near side
  for (let x = BX + 52; x < BX + BL; x++) { const { far, near } = shape(x); for (let y = Math.max(far + 1, 162); y < near; y++) c.px(x, y, (x * 3 + y) % 7 ? "~" : "%") }
  c.hline(BX + 56, 162, 26, "&")
  for (let x = BX + 4; x < BX + BL + 4; x += 2) c.px(x, WL + 3 + (x % 3), x % 4 ? "%" : "&")
  // cypress knees, his lanterns over this side, fewer and farther; spores
  for (const [x, h] of [[RX + 110, 7], [RX + 196, 10], [RX + 300, 6]]) knee(c, x, 172, h, "(", "]")
  for (const [lx, ly, s] of [[RX + 30, 50, 30], [RX + 104, 76, 44], [RX + 236, 46, 26], [RX + 292, 88, 54]]) lantern(c, lx, ly, ly > 100 ? 146 : 0, s)
  for (let i = 0; i < 8; i++) c.px(RX + 20 + R(hsh(i + 1700) * 280), 60 + R(hsh(i + 1750) * 70), i % 3 ? "+" : "=")
  mirror(c, RX, 639, 152, 28)
  for (let y = WALK; y < 158; y += 2) c.dither(RX, y, 320, 2, ".", "&", 0.05)
}
// the parts that change: the caravan's door shut when he has thrown her out (over the open door: x0 + 38 .. + 64, top + 6 .. b - 1 of the
// van at 174, 138), Pike's trap in the roots until it is freed, the radio in the boat until she takes it
sprite("sumpf_tuer_zu", { w: 28, h: 46 }, (c) => {
  c.rect(0, 0, 28, 46, "A"); c.rect(1, 1, 26, 44, "s"); c.rect(2, 2, 24, 42, "a")
  c.vline(13, 2, 42, "A"); c.hline(2, 22, 24, "A"); c.rect(21, 20, 2, 5, "S"); c.dither(2, 34, 24, 10, "a", "U", 0.3)
  for (const x of [5, 9, 17]) c.vline(x, 26, 6 + (x % 4), "i")
})
sprite("sumpf_reuse", { w: 22, h: 18 }, (c) => {
  c.ellipse(9, 11, 8, 6, "A"); c.ellipse(9, 11, 7, 5, "a")
  for (let x = 3; x < 16; x += 3) c.vline(x, 6, 10, "A"); for (let y = 8; y < 16; y += 3) c.hline(2, y, 15, "(")
  c.ellipse(4, 11, 2, 5, "s"); c.rect(17, 2, 4, 4, "o"); c.px(17, 2, "<"); c.line(18, 6, 14, 9, "U")
  c.line(0, 4, 6, 8, ")"); c.line(14, 17, 21, 12, ")")                                                   // the roots it is caught between
})
sprite("sumpf_funk", { w: 14, h: 9 }, (c) => {
  c.rect(0, 2, 12, 7, "a"); c.rect(1, 3, 10, 5, "A"); c.rect(2, 4, 5, 3, "d"); c.px(9, 4, "C"); c.vline(11, 0, 3, "s")
})

sprite("sumpf_bg", { w: 640, h: H }, (c) => {
  rightBack(c)
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

  rightFront(c)
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
// ---------------------------------------------------------------- out of the tunnel (the user approved the block, 2026-11-16:
// art/test/tunnel_blocks.px.js): the ride begins in the dark under the Ring's last pillar and comes out into the open. The front plane,
// 480 wide, that the game slides off to the left (game/kapitel2_lantern.js): the tunnel's ceiling of slabs, its dark, the water with a
// cyan glint from the raft's screens and a few ripples; the portal, its concrete face wet and lit along the edge toward the open, rust
// running down from its bolts; the Ring's slab reaching out over it, its underside lit by the sky, pale warning stripes at its edge (not
// Juno's yellow), drips falling from it.
sprite("sumpf_fahrt_tunnel", { w: 480, h: H }, (c) => {
  const PX = 392
  c.rect(0, 0, PX, H, "n")
  // the ceiling: slabs with their seams, a pipe along them, water standing in the joints
  c.rect(0, 0, PX, 22, "2"); c.hline(0, 21, PX, "1"); c.hline(0, 22, PX, "k")
  for (let x = 0; x < PX; x += 40) { c.vline(x, 0, 22, "1"); c.px(x + 1, 20, "3") }
  c.hline(0, 14, PX, "1"); c.hline(0, 15, PX, "3"); for (let x = 12; x < PX; x += 56) c.rect(x, 13, 2, 4, "4")
  // the dark water: the screens' cyan glint, ripples catching it, a drip's ring
  for (let i = 0; i < 9; i++) { const x = 20 + i * 41, y = 146 + (i % 3) * 5; c.hline(x, y, 8 + (i % 2) * 6, "c"); c.hline(x + 3, y, 3, "C") }
  for (let i = 0; i < 14; i++) c.hline(8 + i * 27, 160 + (i * 7) % 14, 4, "1")
  // the portal's face: wet concrete, darker toward the tunnel, its edge lit by the open, rust from its bolts
  for (let y = 0; y < H; y++) for (let x = PX; x < PX + 22; x++) c.px(x, y, x < PX + 3 ? "2" : (x * 3 + y * 5) % 23 === 0 ? "3" : "4")
  c.rect(PX + 19, 0, 3, H, "6"); c.vline(PX + 19, 0, H, "5")
  for (let y = 34; y < 150; y += 28) { c.rect(PX + 8, y, 3, 3, "3"); c.px(PX + 9, y + 1, "O"); c.vline(PX + 9, y + 3, 6, "O") }
  // the Ring's slab out over the portal: its underside lit by the sky, its edge striped, thinning toward its end
  c.rect(PX, 0, 480 - PX, 26, "3"); c.hline(PX, 26, 480 - PX, "5"); c.hline(PX, 27, 480 - PX, "k")
  for (let x = PX; x < 480; x++) if ((x * 7) % 11 === 0) c.px(x, 25, "6")
  for (let x = PX + 8; x < 480; x += 12) c.rect(x, 22, 5, 2, "S")
  // drips falling from its edge
  for (const [x, y] of [[420, 34], [448, 52], [466, 41], [436, 70], [458, 96]]) { c.vline(x, y, 3, "H"); c.px(x, y + 4, "V") }
})
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

// ---------------------------------------------------------------- the radio from the boat, close (the user approved the block,
// 2026-11-16: art/test/funk_blocks.px.js): over the swamp dimmed, the old radio for the small game at it. Its printing is the city's
// tech, English. The game draws what changes on its display (the channel, the wave as set: game/kapitel2_funk.js); here the screen is
// empty and dark. Its places (FUNK below) are printed for the game: FUNK_AT.
const FUNK = { x: 60, y: 30, w: 200, h: 120 }
const FX = FUNK.x, FY = FUNK.y
const FUNK_PARTS = { screen: [FX + 72, FY + 14, 116, 40], tx: [FX + 12, FY + 14, 44, 26], chL: [FX + 70, FY + 72, 16, 20], chR: [FX + 108, FY + 72, 16, 20],
  waveL: [FX + 134, FY + 72, 16, 20], waveR: [FX + 172, FY + 72, 16, 20], pwr: [FX + 166, FY + 100, 22, 14] }
sprite("sumpf_funk_bg", { w: W, h: H }, (c) => {
  c.stamp("sumpf_bg", -260, 0)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((x + y) % 2 === 0 || y % 3 === 0) c.px(x, y, "!")
  // the body: dark plastic, rubber at its corners, scuffed, an aerial up from its top right
  c.rect(FX + FUNK.w - 26, FY - 30, 5, 32, "a"); c.vline(FX + FUNK.w - 26, FY - 30, 32, "A"); c.rect(FX + FUNK.w - 27, FY - 33, 7, 4, "A")
  c.rect(FX, FY, FUNK.w, FUNK.h, "k"); c.rect(FX + 1, FY + 1, FUNK.w - 2, FUNK.h - 2, "2"); c.rect(FX + 3, FY + 3, FUNK.w - 6, FUNK.h - 6, "3")
  c.hline(FX + 3, FY + 3, FUNK.w - 6, "4"); c.vline(FX + 3, FY + 3, FUNK.h - 6, "4")
  for (const [x, y] of [[FX, FY], [FX + FUNK.w - 8, FY], [FX, FY + FUNK.h - 8], [FX + FUNK.w - 8, FY + FUNK.h - 8]]) { c.rect(x, y, 8, 8, "1"); c.rect(x + 1, y + 1, 6, 6, "2") }
  for (let i = 0; i < 9; i++) { const x = FX + 20 + R(hsh(i + 2100) * 160), y = FY + 8 + R(hsh(i + 2150) * 100); c.hline(x, y, 2 + R(hsh(i) * 4), "4") }
  // the display's frame, its glass dark (the game lights it)
  const [sx, sy, sw, sh] = FUNK_PARTS.screen
  c.rect(sx - 3, sy - 3, sw + 6, sh + 6, "k"); c.rect(sx - 2, sy - 2, sw + 4, sh + 4, "a"); c.rect(sx, sy, sw, sh, "!")
  // TX: an amber key, worn at its middle
  const [tx, ty, tw, th] = FUNK_PARTS.tx
  c.rect(tx - 1, ty - 1, tw + 2, th + 2, "k"); c.rect(tx, ty, tw, th, "i"); c.rect(tx + 1, ty + 1, tw - 2, th - 3, "o"); c.hline(tx + 1, ty + 1, tw - 2, ">")
  TXT.draw(c, tx + R(tw / 2) - 4, ty + 9, "TX", "k", { font: "hud" })
  // the grille over the speaker and the mic
  for (let i = 0; i < 7; i++) c.rect(FX + 12, FY + 50 + i * 6, 44, 2, "1")
  // the knobs, CH and WAVE, an arrow key either side of each; their labels
  for (const [l, r, label] of [[FUNK_PARTS.chL, FUNK_PARTS.chR, "CH"], [FUNK_PARTS.waveL, FUNK_PARTS.waveR, "WAVE"]]) {
    for (const [k, dir] of [[l, -1], [r, 1]]) {
      const [x, y, w, h] = k
      c.rect(x, y, w, h, "k"); c.rect(x + 1, y + 1, w - 2, h - 2, "4"); c.hline(x + 1, y + 1, w - 2, "5")
      const mx = x + R(w / 2), my = y + R(h / 2)
      for (let i = 0; i < 4; i++) c.vline(mx + dir * (i - 2), my - (3 - i), (3 - i) * 2 + 1, "S")
    }
    const kx = l[0] + l[2] + 3, ky = l[1] + 1, kw = r[0] - kx - 3
    c.ellipse(kx + R(kw / 2), ky + 9, R(kw / 2), 9, "k"); c.ellipse(kx + R(kw / 2), ky + 9, R(kw / 2) - 1, 8, "5"); c.ellipse(kx + R(kw / 2) - 1, ky + 8, R(kw / 2) - 3, 5, "6")
    c.vline(kx + R(kw / 2), ky + 2, 6, "S")
    TXT.draw(c, l[0], l[1] + l[3] + 3, label, "6", { font: "hud" })
  }
  // the power switch (it puts the radio away) and a sticker from where it came: the pump hall
  const [px, py, pw, ph] = FUNK_PARTS.pwr
  c.rect(px, py, pw, ph, "k"); c.rect(px + 1, py + 1, pw - 2, ph - 2, "2"); c.rect(px + 3, py + 3, 7, ph - 6, "6"); TXT.draw(c, px - 18, py + 4, "PWR", "5", { font: "hud" })
  c.rect(FX + 12, FY + 98, 54, 12, "F"); c.rect(FX + 13, FY + 99, 52, 10, "S"); TXT.draw(c, FX + 15, FY + 101, "PUMP HALL 3", "a", { font: "hud" })
})
console.log("FUNK_AT " + JSON.stringify(FUNK_PARTS))
