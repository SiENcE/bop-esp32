// CAM 24, Wohnblock Lerche: the doorbell beside Ines's front door, its camera an extreme fisheye at eye height, turned along the
// facade toward the door. Feed mode, 320x180, the phosphor ramp only (style guide §9). The user chose the blocks B of two
// (art/mockups/cam24_blocks.px.js, docs/cams/cam24_blocks_vergleich_x3.png, 2026-11-13); this paints on their lines: the same place in
// meters, the same lens.
// What is in it: on the left, bending round the lens, the door's frame and the door with its number; three steps down to a small
// forecourt, wet, with two bins and a scooter under a cover; a low fence with its gate; the street with a lamp; across it the block
// with its lit windows and one blind half down, a long neon sign over them (KARAOKE 24H); past the yard, far off, the
// city's towers in the dark with a few lit windows (both the user's wish of 2026-11-13). Ines (the game's actor, her feed sprite): on Friday at 22:15 she comes out of the door
// past the lens (from the picture's lower left), crosses the yard and goes out through the gate to the right; on Wednesday and
// Thursday the other way. Where: CAM24_LAYOUT at the end of this file (printed when built), copied into game/places.js (cam24).
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [0.75, 1.45, 0.08], yaw: -40, pitch: 6, F: 62, w: W, h: H, k: 0.55 })

// ================================================================ the place, in meters (x along the facade, y up, z out from it)
const STEP = 0.17, LANDING = 1.1, FENCE = 4.2, KERB = 5.6
const PRIMS = [
  block([-8, -1, -1], [8, 8, 0], "facade"),                                         // the block's front
  block([-0.6, 3 * STEP, -0.15], [0.6, 2.3 + 3 * STEP, 0.02], "door"),              // Ines's front door
  block([-0.75, 3 * STEP, -0.1], [-0.6, 2.4 + 3 * STEP, 0.12], "frame"), block([0.6, 3 * STEP, -0.1], [0.75, 2.4 + 3 * STEP, 0.12], "frame"),
  block([-0.75, 2.3 + 3 * STEP, -0.1], [0.75, 2.45 + 3 * STEP, 0.12], "frame"),
  block([0.85, 1.2, 0], [1.6, 1.9, 0.12], "mail"),                                   // the mailboxes beside the door
  block([-1.6, 0, 0], [1.6, 3 * STEP, LANDING], "landing"),                         // the landing and the steps down
  block([-1.6, 0, LANDING], [1.6, 2 * STEP, LANDING + 0.3], "landing"), block([-1.6, 0, LANDING + 0.3], [1.6, STEP, LANDING + 0.6], "landing"),
  block([-8, -0.1, 0], [8, 0, KERB], "yard"),                                       // the forecourt
  block([-8, 0, FENCE], [-0.7, 0.9, FENCE + 0.08], "fence"), block([0.7, 0, FENCE], [8, 0.9, FENCE + 0.08], "fence"),   // the fence, its gap
  block([-0.75, 0, FENCE - 0.05], [-0.65, 1.1, FENCE + 0.12], "fence"), block([0.65, 0, FENCE - 0.05], [0.75, 1.1, FENCE + 0.12], "fence"),
  block([-3.4, 0, 2.2], [-2.2, 1.1, 2.9], "bin"), block([-2.1, 0, 2.2], [-0.9, 1.1, 2.9], "bin"),   // the bins
  block([2.2, 0.3, 2.6], [3.9, 0.9, 3.0], "scooter"), cyl(2.4, 2.8, 0.25, 0, 0.5, "scooter"), cyl(3.7, 2.8, 0.25, 0, 0.5, "scooter"),
  block([-12, -0.2, KERB], [12, 0, 14], "street"),
  cyl(3.2, KERB + 0.4, 0.07, 0, 4.2, "post"),                                        // a street lamp
  block([-14, 0, 14], [14, 12, 15], "across"),                                       // the block across the street
  // the user's wish (2026-11-13): neon on the block across
  block([-1.6, 5.0, 13.85], [6.2, 6.3, 14], "neon"),                                 // the long sign across, KARAOKE 24H
  // and far off, past the yard, the city in the dark: towers with a few lit windows (the user's wish, instead of a building at the side)
  ...Array.from({ length: 40 }, (_, i) => {
    const a = (-128 + i * 2.4 + (ih(i, 1) - 0.5) * 2) * Math.PI / 180, d = 45 + ih(i, 2) * 60
    const x = 0.75 + d * Math.sin(a), z = d * Math.cos(a), w = 5 + ih(i, 3) * 8, h = 18 + ih(i, 4) * 55
    return block([x - w / 2, 0, z - w / 2], [x + w / 2, h, z + w / 2], "far")
  }),
]
const LIGHTS = [
  { p: [0, 2.9, 0.4], I: 0.45, R: 3.0 },                                             // the lamp over the door
  { p: [3.2, 4.1, KERB + 0.4], I: 1.6, R: 8, shadow: true },                        // the street lamp
  { p: [2.3, 5.6, 13.0], I: 1.0, R: 7 },                                            // the neon's light on the street
]
const MATS = {
  facade: (P) => ({ a: ((P[1] / 0.3) % 1 + 1) % 1 < 0.06 ? 0.2 : 0.3, e: 0 }), frame: { a: 0.45, e: 0 },
  // the door: its panels, the handle, the peephole, the number's plate
  door: (P) => {
    const [x, y] = P, y0 = 3 * STEP
    if (Math.abs(x - 0.42) < 0.05 && Math.abs(y - y0 - 1.05) < 0.04) return { a: 0.7, e: 0 }
    if (Math.abs(x) < 0.03 && Math.abs(y - y0 - 1.6) < 0.03) return { a: 0.1, e: 0.15 }
    if (Math.abs(x) < 0.14 && Math.abs(y - y0 - 1.95) < 0.07) return { a: 0.6, e: 0.05 }
    const panel = (Math.abs(x) > 0.08 && Math.abs(x) < 0.5) && ((y - y0 > 0.2 && y - y0 < 1.0) || (y - y0 > 1.2 && y - y0 < 2.1))
    return { a: panel ? 0.24 : 0.18, e: 0 }
  },
  mail: (P) => ({ a: ((P[0] * 5) % 1 + 1) % 1 < 0.15 ? 0.25 : 0.45, e: 0 }),
  landing: (P, n) => ({ a: n[1] > 0.5 ? (((P[2] - LANDING) % 0.3 + 0.3) % 0.3 > 0.25 ? 0.55 : 0.42) : 0.3, e: 0, wet: 0.1 }),
  yard: (P) => { const [x, , z] = P; const slab = ((x / 0.5) % 1 + 1) % 1 < 0.05 || ((z / 0.5) % 1 + 1) % 1 < 0.05; return { a: slab ? 0.24 : 0.32, e: 0, wet: Math.min(0.85, 0.2 + Math.max(0, fbm(x * 0.6, z * 0.6 + 4, 3) - 0.5) * 3), gloss: 0.2 } },
  fence: (P) => ({ a: ((P[0] * 8) % 1 + 1) % 1 < 0.3 ? 0.46 : 0.32, e: 0 }), bin: (P, n) => ({ a: n[1] > 0.5 ? 0.4 : 0.22, e: 0, wet: 0.2 }), scooter: (P, n) => ({ a: n[1] > 0.5 ? 0.45 : 0.3, e: 0 }),
  street: { a: 0.22, e: 0, wet: 0.5, gloss: 0.25 }, post: { a: 0.35, e: 0 },
  // a far tower: dark, its windows a grid of which a few are lit (one pixel each at that distance)
  far: (P) => {
    const [x, y, z] = P, u = (x + z) / 0.9, v = y / 1.5, cx = Math.floor(u), cy = Math.floor(v)
    const pane = (u - cx) < 0.55 && (v - cy) < 0.5                       // a window is only part of its cell: the wall between
    return { a: 0.05, e: pane && ih(cx, cy, 11) > 0.88 ? 0.5 : pane && ih(cx, cy, 12) > 0.975 ? 0.85 : 0.02 }
  },
  neon: (P, n) => ({ a: 0.3, e: n[2] < -0.5 ? 1.0 : 0.6 }),
  across: (P) => {
    const wx = ((P[0] + 30) % 2.2), fy = P[1] % 2.9, win = wx > 0.6 && wx < 1.6 && fy > 0.9 && fy < 2.2
    if (!win) return { a: P[1] % 2.9 < 0.15 ? 0.24 : 0.18, e: 0 }
    const n = ih(Math.floor((P[0] + 30) / 2.2), Math.floor(P[1] / 2.9)), blind = n > 0.8 && fy > 1.5
    return { a: 0.18, e: n > 0.6 && !blind ? 0.5 : blind ? 0.18 : 0.04 }
  },
  person: { a: 0.75, e: 0 }, head: { a: 0.3, e: 0 },
}
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ground: null, ambient: 0.24, sky: 0.02, rain: 1 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.55, key: "cam24" })

// ---------------------------------------------------------------- hand drawing on top
// the neon's letters, dark in the light boxes, each where its place on the sign lands
const neonWords = (c) => {
  const T = "KARAOKE 24H"
  ;[...T].forEach((ch, i) => { if (ch === " ") return; const [x, y] = at(CAM, [-1.2 + (i + 0.5) * 7.0 / T.length, 5.65, 13.84]); TXT.draw(c, x, y - 2, ch, "2", { font: "hud", align: "center" }) })
}

// ================================================================ what the game needs (game/places.js cam24)
const CAM24_LAYOUT = {
  // Friday: out of the door past the lens (off the lower left), across the yard, through the gate, off to the right along the street
  out: spotAt(CAM, [0.1, 0, 0.7]), yard: spotAt(CAM, [0.6, 0, 2.3]), gate: spotAt(CAM, [0, 0, FENCE + 0.4]),
  street: spotAt(CAM, [2.0, 0, KERB + 0.8]), away: spotAt(CAM, [7.5, 0, KERB + 0.8]),
  inesPx: [Math.round(personPx(CAM, [0, 0, FENCE + 0.4], 1.72)), Math.round(personPx(CAM, [0.6, 0, 2.3], 1.72))],
  mic: spotAt(CAM, [0.3, 1.0, 2.5]),
  // the door (its frame and leaf, as far as the lens sees it): its front's outline sampled, kept on the picture, its hull
  polys: { door: (() => {
    const pts = [], y0 = 3 * STEP, y1 = 2.45 + 3 * STEP, x0 = -0.75, x1 = 0.5
    for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([x0 + (x1 - x0) * t, y0, 0.12], [x0 + (x1 - x0) * t, y1, 0.12], [x0, y0 + (y1 - y0) * t, 0.12], [x1, y0 + (y1 - y0) * t, 0.12]) }
    const q = pts.map((P) => project(CAM, P)).filter((p) => p[2] > 0).map(([x, y]) => [Math.max(0, Math.min(W, Math.round(x))), Math.max(0, Math.min(H, Math.round(y)))])
    q.sort((a, b) => a[0] - b[0] || a[1] - b[1])
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = []
    for (const p of q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p) }
    for (const p of q.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p) }
    return [...lo.slice(0, -1), ...up.slice(0, -1)].flat()
  })() },
}
console.log("CAM24_LAYOUT " + JSON.stringify(CAM24_LAYOUT))

// ================================================================ the scenes
scene("cam24_bg", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), neonWords)
scene("review_cam24", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), neonWords, (c) => reviewFx(c, W, H))
