// CAM 15, the capsule hotel Morpheus (kapitel1-design §A6): the camera high on the corridor's near wall, looking straight across a
// narrow corridor at one capsule wall, a little from above, through a wide lens. Feed mode, 320x180, the phosphor ramp only (style
// guide §9). The user chose the blocks B of three (art/mockups/cam15_blocks_b.px.js, docs/cams/cam15_blocks_vergleich_x2.png,
// 2026-11-13); this paints on their lines: the same place in meters, the same camera, the same capsules (24 to 17 over 32 to 25, the
// numbers counting from the door).
// What is in it: the capsule wall, each capsule a moulded panel with a raised rim round its rounded opening, a blind or a curtain in
// it (most down and dark, some glowing from a sleeper's light behind, two up on a lit mattress, two up on an empty dark one, a bag
// left in 19, a sneaker on 26's sill), its number on a plate and its small screen beside it, little ladders to the upper row; the
// plinth under them with its shoe cubbies; MORPHEUS lit on the soffit over the capsules, NO FOOD on a plate beside it; the low
// ceiling with its light panels, one failing (dim, a lit end); the lino with its seams and the worn path along the capsules, a wet
// patch round the mop bucket; on the right the door from the stairs with its push bar, its small wired window lit, the EXIT sign
// hanging before it; on the left, under the display, the vending machine's glow and the shoe rack; the laundry cart near us.
// Kessler (the game's actor): he comes in through the door, walks along the wall to 23, stands at its ladder and climbs in.
// Capsule 23 stands empty, its blind up, its screen the brightest: Juno can write on it (K1a). Where: CAM15_LAYOUT at the end of
// this file (printed when built), for game/places.js (cam15).
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [4.6, 2.9, 0.1], yaw: 0, pitch: 14, F: 48, w: W, h: H, k: 0.22 })

// ================================================================ the place, in meters (x along the corridor, y up, z across it, away from the camera)
const WZ = 3.8                                            // the capsule wall's front (the corridor is that wide)
const CW = 1.3, CH = 1.2, BASE = 0.4                      // a capsule's face: width, height; the plinth under the lower row
const X0 = 0                                              // the capsule wall's left edge (24 and 32); eight columns to the right
const XE = X0 + 8 * CW                                    // where the capsules end
const XR = XE + 0.4, XL = X0 - 1.6                        // the corridor's two end walls
const DOOR = [2.2, 3.2]                                   // the door from the stairs, in the right end wall (z)
const TOP = BASE + 2 * CH, CEIL = TOP + 0.65              // the top of the upper row; the low ceiling (the soffit between)
const HATCH = { l: 0.1, r: 0.1, b: 0.1, t: 0.66 }         // the opening in a face (from its left, right, bottom; its top's height)
const FACE = WZ - 0.2                                     // the faces' front; the blinds sit 0.2 m behind it
const col = (n) => 7 - (n - 17) % 8, row = (n) => (n < 25 ? 1 : 0)
const cx0 = (n) => X0 + col(n) * CW, cy0 = (n) => BASE + row(n) * CH
const NUMX = 0.3                                          // a number's middle on its band, from the face's left
const SCR = [CW - 0.5, CW - 0.16]                         // a screen's left and right on its band, from the face's left
const SIGN = [X0 + 2.6, TOP + 0.1, X0 + 7.8, TOP + 0.5]   // MORPHEUS on the soffit over the capsules (x0, y0, x1, y1)
const NOFOOD = [X0 + 0.35, TOP + 0.17, X0 + 2.15, TOP + 0.45]   // a small plate on the soffit left of it
const EXIT = [XR - 0.95, XR - 0.15, 2.5, 2.82, 2.3]        // the hanging EXIT sign: x0, x1, y0, y1, its face's z
const PANELS = [[0.6, 1.2], [3.6, 1.2], [6.6, 1.2], [9.6, 1.2], [-0.9, 2.4], [2.1, 2.4], [5.1, 2.4], [8.1, 2.4]]  // the ceiling's light panels (x, z of their middle)
const FAILING = 6                                         // the panel whose tube is going: dim, one end still lit
// what is in each capsule's opening: the blind down and dark, down and glowing (a sleeper's light behind), up on a lit mattress,
// up on an empty dark one (23 is Kessler's, waiting)
const STATE = { 17: "down", 18: "glow", 19: "empty", 20: "down", 21: "glow", 22: "down", 23: "empty", 24: "down",
  25: "down", 26: "open", 27: "open", 28: "down", 29: "down", 30: "glow", 31: "down", 32: "glow" }
const LIT = new Set(Object.keys(STATE).filter((n) => STATE[n] === "glow" || STATE[n] === "open").map(Number))
const MOP = [6.6, 1.6]                                    // the wet patch round the mop bucket (x, z)

const PRIMS = [
  block([XL, -0.2, WZ], [XR, CEIL, WZ + 2.4], "wall"),                    // the wall the capsules sit in (and behind them)
  block([X0 - 0.02, TOP, WZ - 0.25], [XE + 0.02, CEIL, WZ], "soffit"),    // the soffit over the upper row
  block([XL - 0.3, -0.2, -0.5], [XL, CEIL, WZ + 0.1], "endwall"),         // the far end
  block([XR, -0.2, -0.5], [XR + 0.3, CEIL, WZ + 0.1], "endwall"),         // the near end, the door in it
  block([XL - 0.3, CEIL, -0.5], [XR + 0.3, CEIL + 0.2, WZ + 0.1], "ceil"),
  block([XL, -0.2, -0.8], [XR, CEIL, -0.4], "wall"),                      // the camera's wall
  block([X0, 0, WZ - 0.08], [XE, BASE, WZ], "plinth"),                    // the shoe cubbies under the lower row
  ...PANELS.map(([x, z], i) => block([x - 0.6, CEIL - 0.04, z - 0.3], [x + 0.6, CEIL - 0.01, z + 0.3], "panel", { i })),
  block([XL, CEIL - 0.2, 0.75], [XR, CEIL - 0.12, 0.83], "pipe"),         // a sprinkler pipe near the camera
  block([XL, TOP - 0.05, WZ - 0.4], [XR, TOP + 0.01, WZ - 0.25], "tray"), // the cable tray along the soffit's foot
  block([SIGN[0], SIGN[1], WZ - 0.27], [SIGN[2], SIGN[3], WZ - 0.25], "signpanel"),
  block([NOFOOD[0], NOFOOD[1], WZ - 0.27], [NOFOOD[2], NOFOOD[3], WZ - 0.25], "plate"),
  // the door in the right end wall: its frame, the leaf with a kick plate and a push bar; the EXIT box hanging before it on two rods
  block([XR - 0.08, 0, DOOR[0] - 0.08], [XR, 2.15, DOOR[0]], "frame"), block([XR - 0.08, 0, DOOR[1]], [XR, 2.15, DOOR[1] + 0.08], "frame"),
  block([XR - 0.08, 2.07, DOOR[0] - 0.08], [XR, 2.15, DOOR[1] + 0.08], "frame"),
  block([XR - 0.03, 0, DOOR[0]], [XR - 0.01, 2.07, DOOR[1]], "door"),
  block([XR - 0.12, 0.95, DOOR[0] + 0.15], [XR - 0.03, 1.0, DOOR[1] - 0.15], "bar"),
  block([EXIT[0], EXIT[2], EXIT[4]], [EXIT[1], EXIT[3], EXIT[4] + 0.08], "sign"),
  ...[EXIT[0] + 0.1, EXIT[1] - 0.1].map((x) => block([x - 0.01, EXIT[3], EXIT[4] + 0.03], [x + 0.01, CEIL, EXIT[4] + 0.05], "pipe")),
  // the far end: the vending machine against the end wall, a shoe rack along the back wall beside it
  block([XL, 0, WZ - 1.6], [XL + 0.75, 1.85, WZ - 0.65], "vend"),
  block([XL + 0.1, 0, WZ - 0.4], [X0 - 0.15, 0.9, WZ], "rack"),
  // a laundry cart left in the corridor, near the camera on the left, its castors; a bin at the right
  block([1.6, 0.15, 1.0], [2.6, 0.95, 1.6], "cart"),
  ...[[1.7, 1.1], [2.5, 1.1], [1.7, 1.5], [2.5, 1.5]].map(([x, z]) => cyl(x, z, 0.04, 0, 0.15, "ladder")),
  cyl(XR - 0.35, 0.75, 0.2, 0, 0.6, "bin"),
  // the mop bucket and its handle, the folding sign, left near the camera, off his way
  cyl(6.2, 1.35, 0.2, 0, 0.32, "bucket"), cyl(6.25, 1.3, 0.02, 0.3, 1.15, "pipe"),
  block([7.0, 0, 1.15], [7.45, 0.62, 1.2], "wetsign"),
  // a bag left in 19's opening, a sneaker on 26's sill
  block([cx0(19) + 0.55, cy0(19) + HATCH.b, WZ - 0.17], [cx0(19) + 0.95, cy0(19) + 0.36, WZ - 0.03], "bag"),
  block([cx0(26) + 0.25, cy0(26) + HATCH.b, WZ - 0.2], [cx0(26) + 0.38, cy0(26) + 0.17, WZ - 0.02], "shoe"),
]
// slippers before the lit lower capsules (their sleepers are in)
for (const n of [26, 27, 30]) { const x = cx0(n) + 0.5; PRIMS.push(block([x, 0, WZ - 0.5], [x + 0.11, 0.05, WZ - 0.24], "slipper"), block([x + 0.16, 0, WZ - 0.52], [x + 0.27, 0.05, WZ - 0.26], "slipper")) }
// each capsule's face: posts left and right, the sill, the band over the opening (the number left, the screen right), set 0.2 m
// before the blind, so the opening is a real recess; the screen a little proud of the band
for (let n = 17; n <= 32; n++) {
  const x = cx0(n), y = cy0(n), o = { n }
  PRIMS.push(
    block([x, y, FACE], [x + HATCH.l, y + CH, WZ], "face", o), block([x + CW - HATCH.r, y, FACE], [x + CW, y + CH, WZ], "face", o),
    block([x + HATCH.l, y, FACE], [x + CW - HATCH.r, y + HATCH.b, WZ], "face", o),
    block([x + HATCH.l, y + HATCH.t, FACE], [x + CW - HATCH.r, y + CH, WZ], "band", o),
    block([x + SCR[0], y + HATCH.t + 0.09, FACE - 0.03], [x + SCR[1], y + CH - 0.07, FACE], "screen", o),
    block([x + HATCH.l, y + HATCH.b, WZ - 0.03], [x + CW - HATCH.r, y + HATCH.t, WZ - 0.01], "blind", o),
  )
}
// the ladder to each upper capsule, at its right post: two rails and rungs, the gaps between see-through
for (let i = 0; i < 8; i++) PRIMS.push(block([X0 + (i + 1) * CW - 0.08, BASE, WZ - 0.3], [X0 + (i + 1) * CW + 0.02, TOP - 0.05, WZ - 0.24], "ladder", { shadow: false, i }))

const LIGHTS = [
  // the panels, a point each; the failing one barely
  ...PANELS.map(([x, z], i) => ({ p: [x, CEIL - 0.15, z], I: i === FAILING ? 0.1 : 0.42, R: 2.6, shadow: true })),
  { p: [(SIGN[0] + SIGN[2]) / 2, TOP + 0.2, WZ - 0.8], I: 0.25, R: 2.0 },  // MORPHEUS's glow on the soffit's foot
  { p: [(EXIT[0] + EXIT[1]) / 2, 2.3, EXIT[4] - 0.2], I: 0.4, R: 1.8 },    // the EXIT sign
  { p: [XR - 0.3, 1.5, (DOOR[0] + DOOR[1]) / 2], I: 0.15, R: 1.2 },         // the stairs' light through the door's window
  { p: [XL + 1.2, 1.1, WZ - 1.1], I: 0.5, R: 1.8 },                       // the vending machine's front
  // the lit capsules spill a little light onto their sills and the lino
  ...[...LIT].map((n) => ({ p: [cx0(n) + CW / 2, cy0(n) + 0.15, WZ - 0.3], I: STATE[n] === "open" ? 0.22 : 0.15, R: 0.9 })),
]

// ---------------------------------------------------------------- materials
const fr = (v) => ((v % 1) + 1) % 1
// a point's place on its capsule's face (u from the face's left, v from its bottom)
const uv = (P, n) => [P[0] - cx0(n), P[1] - cy0(n)]
// how far outside the opening's rounded rect (0 inside): the moulding's rim follows it
const RAD = 0.16
const outside = (u, v) => {
  const qx = Math.max(0, HATCH.l + RAD - u, u - (CW - HATCH.r - RAD)), qy = Math.max(0, HATCH.b + RAD - v, v - (HATCH.t - RAD))
  return Math.max(0, Math.hypot(qx, qy) - RAD)
}
// the moulded panel: a seam where two capsules meet, a raised rim round the opening (lit on its top and left, shaded under),
// the panel's face between; the recess's sides inside the rim darker
const moulding = (P, nrm, k) => {
  const [u, v] = uv(P, k)
  if (nrm[2] > -0.5) return { a: nrm[1] > 0.5 ? 0.2 : 0.14, e: 0 }                  // the recess's sides and the sill's top
  if (u < 0.025 || u > CW - 0.025 || v < 0.02) return { a: 0.1, e: 0 }               // the seam between capsules
  const d = Math.max(0, HATCH.l - u, u - (CW - HATCH.r), HATCH.b - v, v - HATCH.t)
  if (v < HATCH.t + 0.02 && d < 0.06) return { a: v < HATCH.b ? 0.22 : 0.42, e: 0 }  // the rim: under the opening in shade
  return { a: 0.32 + 0.03 * (ih(k, Math.floor(v * 6)) - 0.5), e: 0 }
}
// what fills an opening: the blind (ribbed), glowing behind when a sleeper's light is on; or the open capsule's inside faked on the
// blind's plane: its dim ceiling, the back wall, a lamp, the mattress with its pillow (lit or dark)
const opening = (P, k) => {
  const [u, v] = uv(P, k), s = STATE[k]
  if (outside(u, v) > 0) return { a: 0.42, e: 0 }                                   // the rim's rounded corners
  const iu = (u - HATCH.l) / (CW - HATCH.l - HATCH.r), iv = (v - HATCH.b) / (HATCH.t - HATCH.b)
  if (s === "down" || s === "glow") {
    const rib = fr(v / 0.12) < 0.3, pull = Math.abs(iu - 0.5) < 0.04 && iv < 0.15     // slats, and the pull at its foot
    if (s === "down") return { a: pull ? 0.3 : rib ? 0.04 : 0.1, e: 0 }
    return { a: 0.2, e: (rib ? 0.36 : 0.55) - 0.12 * iv + (pull ? -0.2 : 0) }
  }
  const lit = s === "open" ? 1 : 0
  if (iv > 0.84) return { a: 0.02, e: 0 }                                             // the blind rolled up under the top
  if (iv < 0.4) {                                                                     // the mattress, a pillow at the far end, a blanket
    const pillow = iu < 0.3 && iv > 0.14, edge = iv > 0.3
    return { a: 0.02, e: lit ? (pillow ? 0.85 : edge ? 0.7 : 0.5) : (pillow || edge ? 0.12 : 0.06) }
  }
  if (lit && Math.hypot((iu - 0.82) * 2.4, iv - 0.64) < 0.16) return { a: 0, e: 1.1 }  // the reading lamp
  return { a: 0.02, e: lit ? 0.16 + 0.12 * Math.max(0, 1 - Math.abs(iu - 0.8) * 2) : 0.01 }   // the back wall, lit round the lamp
}
const MATS = {
  wall: { a: 0.22, e: 0 },
  endwall: (P, n) => ({ a: (Math.abs(P[1] - 1.0) < 0.04 && P[0] > XR - 0.1) ? 0.12 : 0.24, e: 0 }),    // a dado rail by the door
  // the ceiling: its grid of tiles, a stain or two
  ceil: (P) => { const s = fr(P[0] / 0.6) < 0.06 || fr(P[2] / 0.6) < 0.06; return { a: s ? 0.14 : 0.28 + 0.06 * (fbm(P[0] * 1.3, P[2] * 1.3, 2) - 0.5), e: 0 } },
  panel: (P, n, f, hit) => {
    const div = fr(P[0] / 0.6) < 0.08
    if (hit.prim.i !== FAILING) return { a: 0.3, e: div ? 0.5 : 1.0 }
    const x = P[0] - PANELS[FAILING][0]
    return { a: 0.3, e: x > 0.38 ? 0.75 : 0.12 + (div ? 0 : 0.05) }                     // the failing tube: only its end
  },
  // the plinth: a row of shoe cubbies, a pair of shoes in some
  plinth: (P, n) => {
    if (n[2] > -0.5) return { a: 0.3, e: 0 }
    const c = (P[0] - X0) / (CW / 4), i = Math.floor(c), u = fr(c), y = P[1]
    if (u < 0.14 || y < 0.05 || y > BASE - 0.07) return { a: 0.55, e: 0 }
    const shoe = ih(i, 15) > 0.45 && y < 0.17 + 0.06 * Math.sin(u * 3.1) && u > 0.22 && u < 0.92
    return { a: shoe ? 0.75 : 0.03, e: 0 }
  },
  soffit: (P, n) => ({ a: n[2] < -0.5 && fr(P[0] / 2.6) < 0.01 ? 0.1 : 0.2, e: 0 }),
  pipe: { a: 0.45, e: 0 }, bucket: (P, n) => ({ a: n[1] > 0.5 && Math.hypot(P[0] - 6.2, P[2] - 1.35) < 0.16 ? 0.1 : 0.5, e: 0 }),
  wetsign: (P) => ({ a: Math.abs(P[1] - 0.38) < 0.1 && Math.abs(P[0] - 7.225) < 0.12 ? 0.15 : 0.85, e: 0 }),   // its warning mark tray: (P) => ({ a: fr(P[0] / 0.3) < 0.15 ? 0.25 : 0.42, e: 0 }),
  signpanel: { a: 0.06, e: 0.04 }, plate: { a: 0.08, e: 0.18 }, bin: (P, n) => ({ a: n[1] > 0.5 ? 0.12 : 0.3, e: 0 }),
  // the cart: used linen heaped on it in folds; its canvas sides, a rail round them
  cart: (P, n) => {
    if (n[1] > 0) { const f = fbm(P[0] * 5 + 2, P[2] * 5, 3); return { a: Math.abs(f - 0.5) < 0.035 ? 0.28 : 0.5 + 0.3 * (f - 0.5), e: 0 } }
    return { a: P[1] > 0.88 ? 0.45 : fr(P[0] / 0.25) < 0.08 ? 0.18 : 0.28, e: 0 }
  },
  slipper: { a: 0.55, e: 0 }, bag: (P, n) => ({ a: n[1] > 0.5 ? 0.4 : fr(P[0] / 0.2) < 0.1 ? 0.2 : 0.3, e: 0 }), shoe: { a: 0.6, e: 0 },
  // the lino: sheets with their welded seams along the corridor and a few across, scuffs; the worn path along the capsules
  // from the door, buffed lighter; damp round the mop bucket (no mirror: it would ghost the capsules)
  floor: (P) => {
    const [x, , z] = P
    const seam = Math.abs(fr((z - 0.3) / 1.8) - 0.5) > 0.49 || Math.abs(fr((x + 0.4) / 3.0) - 0.5) > 0.493
    const path = Math.max(0, 1 - Math.abs(z - 2.95) / 0.6) * (x > X0 - 0.3 ? 1 : 0.3)
    const scuff = fbm(x * 2.5, z * 2.5, 2) > 0.66 ? -0.02 : 0
    const damp = Math.hypot(x - MOP[0], (z - MOP[1]) * 1.4) < 0.9 ? -0.04 : 0       // the lino still damp round the bucket
    if (seam) return { a: 0.14 + path * 0.04, e: 0 }
    return { a: 0.21 + path * 0.07 + scuff + damp, e: 0 }
  },
  face: (P, n, f, hit) => moulding(P, n, hit.prim.n),
  band: (P, n, f, hit) => (n[2] < -0.5 ? { a: 0.09, e: 0 } : moulding(P, n, hit.prim.n)),
  screen: (P, n, f, hit) => ({ a: 0.1, e: n[2] < -0.5 ? 0 : 0.05 }),                // the screens themselves are drawn by hand
  blind: (P, n, f, hit) => opening(P, hit.prim.n),
  // a ladder's two rails and its rungs; between them the face shows
  ladder: (P, n, f, hit) => {
    if (!hit || hit.prim.i === undefined) return { a: 0.45, e: 0 }                    // the cart's castors
    const u = P[0] - (X0 + (hit.prim.i + 1) * CW - 0.08), rung = fr((P[1] - BASE) / 0.3) < 0.14
    if (u < 0.022 || u > 0.078 || rung) return { a: 0.45, e: 0 }
    return { a: 0, e: 0, see: 1 }
  },
  frame: { a: 0.45, e: 0 },
  // the door: its wired window lit from the stairs, the kick plate, the leaf
  door: (P) => {
    const [, y, z] = P
    if (y > 1.2 && y < 1.85 && z > DOOR[0] + 0.3 && z < DOOR[1] - 0.3) {
      const wire = fr((y + z) / 0.1) < 0.18 || fr((y - z) / 0.1) < 0.18
      return { a: 0.2, e: wire ? 0.25 : 0.6 }
    }
    if (y > 1.15 && y < 1.9 && z > DOOR[0] + 0.25 && z < DOOR[1] - 0.25) return { a: 0.5, e: 0 }   // the window's frame
    if (y < 0.3) return { a: 0.45 + 0.05 * (ih(Math.floor(z * 40), 3) - 0.5), e: 0 }
    return { a: 0.24, e: 0 }
  },
  bar: { a: 0.62, e: 0 },
  sign: (P, n) => ({ a: 0.08, e: n[2] < 0 ? 0.14 : 0 }),
  // the vending machine: its lit front with rows of cans, the dark coin panel at the side, the slot at its foot
  vend: (P, n) => {
    if (n[0] <= 0.5) return { a: 0.3, e: 0 }
    const [, y, z] = P
    if (y > 0.7 && y < 1.7 && z < WZ - 0.92) return { a: 0.2, e: fr((y - 0.7) / 0.25) < 0.3 ? 0.3 : fr(z / 0.12) < 0.5 ? 0.7 : 0.5 }
    if (y > 0.2 && y < 0.4 && z < WZ - 0.95) return { a: 0.02, e: 0 }
    return { a: 0.3, e: 0 }
  },
  rack: (P, n) => ({ a: n[1] > 0 || fr(P[1] / 0.3) < 0.25 ? 0.4 : 0.15, e: 0 }),
}
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ambient: 0.22, sky: 0.02, rain: 0 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.55, key: "cam15" })

// ---------------------------------------------------------------- hand drawing on top
// a screen's rect on the picture, from its band's corners
const screenRect = (n) => {
  const x = cx0(n), y = cy0(n), a = at(CAM, [x + SCR[0], y + CH - 0.07, FACE - 0.03]), b = at(CAM, [x + SCR[1], y + HATCH.t + 0.09, FACE - 0.03])
  return [a[0], a[1], b[0] - a[0], b[1] - a[1]]
}
// each capsule's number on its plate, its screen beside it (a dark bezel, lines of text); 23's lit up as Juno's way in
const faces = (c) => {
  for (let n = 17; n <= 32; n++) {
    const [x, y] = at(CAM, [cx0(n) + NUMX, cy0(n) + (HATCH.t + CH) / 2, FACE])
    c.rect(x - 4, y - 3, 9, 7, n === 23 ? "3" : "2")
    TXT.draw(c, x, y - 2, String(n), n === 23 ? "9" : "8", { font: "hud", align: "center" })
    const [sx, sy, sw, sh] = screenRect(n), on = n === 23 ? 3 : LIT.has(n) ? 2 : 1
    c.rect(sx - 1, sy - 1, sw + 2, sh + 2, "0")
    c.rect(sx, sy, sw, sh, on === 3 ? "6" : on === 2 ? "3" : "2")
    for (let j = 1; j < sh - 1; j += 2) for (let i = 1; i < sw - 1; i++) if (on === 3 ? (i + j) % 4 !== 2 : ih(n, i, j) < 0.6 + 0.2 * on) c.px(sx + i, sy + j, on === 3 ? "9" : on === 2 ? "6" : "4")
  }
}
// MORPHEUS, each letter where its place on the panel lands; NO FOOD on its plate; EXIT on its box
const words = (c) => {
  const T = "MORPHEUS"
  ;[...T].forEach((ch, i) => { const [x, y] = at(CAM, [SIGN[0] + (SIGN[2] - SIGN[0]) * (i + 0.5) / T.length, (SIGN[1] + SIGN[3]) / 2, WZ - 0.27]); TXT.draw(c, x, y - 2, ch, "9", { font: "hud", align: "center" }) })
  const [px, py] = at(CAM, [(NOFOOD[0] + NOFOOD[2]) / 2, (NOFOOD[1] + NOFOOD[3]) / 2, WZ - 0.27])
  TXT.draw(c, px, py - 2, "NO FOOD", "7", { font: "hud", align: "center" })
  const [sx, sy] = at(CAM, [(EXIT[0] + EXIT[1]) / 2, (EXIT[2] + EXIT[3]) / 2, EXIT[4]])
  TXT.draw(c, sx, sy - 2, "EXIT", "9", { font: "hud", align: "center" })
}

// ================================================================ what the game needs (game/places.js cam15)
// He comes in at the door and stands before 23, in front of 31's screen, beside 23's ladder: so 31's and 32's numbers stay free
const STAND = { door: [XR - 0.3, 0, (DOOR[0] + DOOR[1]) / 2], spot: [cx0(23) + CW / 2 + 0.33, 0, WZ - 0.45] }
const faceOf = (n) => boxCorners([cx0(n), cy0(n), FACE], [cx0(n) + CW, cy0(n) + CH, FACE]).slice(0, 4)
const C23 = hullOf(CAM, faceOf(23))
// the capsule wall's outline with 23 cut out of its top as a notch: the wall's top left, down round 23, on to the top right
const WALL = hullOf(CAM, boxCorners([X0, BASE, FACE], [XE, TOP, FACE]).slice(0, 4))
const capsulesPoly = () => {
  const pts = []; for (let i = 0; i < WALL.length; i += 2) pts.push([WALL[i], WALL[i + 1]])
  const q = []; for (let i = 0; i < C23.length; i += 2) q.push([C23[i], C23[i + 1]])
  const tl = pts.reduce((a, p) => (p[0] + p[1] < a[0] + a[1] ? p : a)), tr = pts.reduce((a, p) => (p[1] - p[0] < a[1] - a[0] ? p : a))
  const br = pts.reduce((a, p) => (p[0] + p[1] > a[0] + a[1] ? p : a)), bl = pts.reduce((a, p) => (p[1] - p[0] > a[1] - a[0] ? p : a))
  const nl = q.reduce((a, p) => (p[0] + p[1] < a[0] + a[1] ? p : a)), nbl = q.reduce((a, p) => (p[1] - p[0] > a[1] - a[0] ? p : a))
  const nbr = q.reduce((a, p) => (p[0] + p[1] > a[0] + a[1] ? p : a)), nr = q.reduce((a, p) => (p[1] - p[0] < a[1] - a[0] ? p : a))
  return [tl, [nl[0], tl[1]], nbl, nbr, [nr[0], tr[1]], tr, br, bl].flat()
}
const L = {
  door: spotAt(CAM, STAND.door), spot: spotAt(CAM, STAND.spot), kesslerPx: Math.round(personPx(CAM, STAND.spot)),
  mic: spotAt(CAM, [STAND.spot[0], 1.2, STAND.spot[2]]),
  polys: {
    c23: C23,
    capsules: capsulesPoly(),
    door: hullOf(CAM, [[XR, 0, DOOR[0] - 0.08], [XR, 0, DOOR[1] + 0.08], [XR, 2.15, DOOR[0] - 0.08], [XR, 2.15, DOOR[1] + 0.08]]),
  },
}
console.log("CAM15_LAYOUT " + JSON.stringify(L))

// ================================================================ the scenes
scene("cam15_bg", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), faces, words)
scene("review_cam15", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), faces, words, (c) => reviewFx(c, W, H))
