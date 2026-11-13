// Blocks for CAM 15, the capsule hotel Morpheus (kapitel1-design A6: the hotel's corridor, rows of numbered capsules; at 22:30
// Kessler comes in and crawls into capsule 23; Juno can write on 23's little screen to warn him, K1a). Feed mode, 320x180, the
// phosphor ramp only. A blockout in meters (art/lib/feed.js) with flat materials, so only the layout is judged: where Kessler comes
// in, where he stands at 23, how big he is, whether 23 (its hatch, number and screen) reads, and what the display covers ("mit OSD").
// Variant A, central perspective (the doc's view): the camera high in the left corner over the corridor's near end, looking down
// its length (turned a little toward the right wall, one vanishing point). Capsules stand two high along both walls, each a light
// moulded panel with dark seams round it: a rounded opening, its little screen beside it on the near side (right of it on screen,
// high, so Kessler standing before 23 doesn't hide it), its number over it. The right wall holds 17 to 32 (upper row 17-24, lower
// 25-32, counted from the far end, so 24 and 32 are nearest); the left wall's capsules, from the end wall on, are seen at a slant
// and mostly lie under the display. The camera sits in the left corner because a hatch on the right wall only shows its width
// when looked at from across the corridor: with Kessler at 24 to 30 px, 23's front can't be much wider than his height allows
// (about 18 px for hatch and screen here); from the corridor's middle it would be a sliver. So the corridor's far end stays small.
// A strip light runs down the ceiling; some capsules are lit from inside, their blinds glowing; the empty ones show their
// mattress. Kessler comes in through the fire door in the right wall near the camera (lower right, a green lamp over it), walks
// away from us along the right wall and stops at 23, upper row, the second capsule in. At the far end the way to the lobby with
// an EXIT sign and a vending machine. Not built into the game.
//   PXL build art/mockups/cam15_blocks_a.px.js --out build/art/cam15_blocks_a --no-preview
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [-1.45, 2.65, 0], yaw: 9, pitch: 22, F: 80, w: W, h: H, k: 0.08 })

// ================================================================ the place, in meters (x across the corridor, y up, z down it)
const HALF = 1.75, CEIL = 2.9                   // the corridor's half width (to the capsules' faces), its ceiling
const Z0 = 2.5, PITCH = 1.5, N = 8                 // where the right wall's first capsule starts, the capsules' pitch, per row
const ZEND = Z0 + N * PITCH                         // where the rows end; the far wall a little beyond
const FAR = ZEND + 0.4
const LZ0 = -0.3, NL = Math.ceil((ZEND - LZ0) / PITCH)   // the left wall: capsules from the end wall behind the camera on
const ROWS = { up: [1.2, 2.4], lo: [0.06, 1.14] }   // the panels' heights (y), upper and lower row
const DOOR = [0.8, 1.8]                         // the fire door in the right wall (z)
// a capsule's panel: u runs 0..1 from its near to its far edge (z), v 0..1 from the bottom of its panel
const OPEN = { u: [0.3, 0.95], v: [0.06, 0.8] }       // the rounded opening
const SCREEN = { u: [0.05, 0.25], v: [0.5, 0.8] }     // the little screen, on the near side of its opening (right of it on screen)
                                                      // and high, over Kessler's head when he stands before 23
// the right wall: capsule i (0 = nearest the camera) of a row; the number counts from the far end
const num = (row, i) => (row === "up" ? 24 : 32) - i
const lnum = (row, i) => (row === "up" ? 100 : 200) + i            // the left wall: keys of its own for which are lit (its numbers not drawn)
const LIT = new Set([22, 21, 19, 17, 30, 28, 27, 25, 103, 105, 106, 108, 204, 207, 209])   // occupied, lit from inside (23 is empty)
// which capsule a point on a wall's face is in: { row, i, n, u, v } or null
const capsuleAt = (Q, side) => {
  const z0 = side > 0 ? Z0 : LZ0, i = Math.floor((Q[2] - z0) / PITCH)
  const row = Q[1] >= ROWS.up[0] - 0.03 ? "up" : "lo"
  if (i < 0 || i >= (side > 0 ? N : NL)) return null
  const [y0, y1] = ROWS[row]
  return { row, i, n: side > 0 ? num(row, i) : lnum(row, i), u: (Q[2] - z0 - i * PITCH) / PITCH, v: (Q[1] - y0) / (y1 - y0) }
}
// world points of a part of capsule (row, i) on the right wall: u, v as above
const onPanel = (row, i, u, v) => [HALF, ROWS[row][0] + v * (ROWS[row][1] - ROWS[row][0]), Z0 + (i + u) * PITCH]

const PRIMS = [
  block([-HALF - 0.4, CEIL, -1], [HALF + 0.4, CEIL + 0.2, FAR + 1], "ceiling"),
  block([-HALF - 0.4, 0, -0.5], [HALF + 0.4, CEIL, -0.3], "wall"),                     // the end wall behind the camera
  block([-HALF - 0.4, 0, FAR], [-0.55, CEIL, FAR + 0.2], "wall"),                    // the far wall, the way to the lobby in it
  block([0.55, 0, FAR], [HALF + 0.4, CEIL, FAR + 0.2], "wall"),
  block([-0.55, 2.15, FAR], [0.55, CEIL, FAR + 0.2], "wall"),
  block([-2, 0, FAR + 3], [2, CEIL, FAR + 3.2], "lobby"),                            // the lobby's lit wall beyond
  block([-0.35, 2.3, FAR - 0.06], [0.35, 2.5, FAR], "exit"),                         // EXIT over the way out
  block([0.75, 0, FAR - 0.75], [1.45, 1.85, FAR], "vending"),                        // the vending machine against the far wall
  // the strip light down the ceiling's middle
  block([-0.08, CEIL - 0.04, 0.4], [0.08, CEIL, ZEND - 0.3], "strip", { shadow: false }),
  // the right wall before the capsules: round the fire door, then a shoe locker
  block([HALF, 0, -0.5], [HALF + 0.4, CEIL, DOOR[0]], "wall"),
  block([HALF, 2.12, DOOR[0]], [HALF + 0.4, CEIL, DOOR[1]], "wall"),
  block([HALF + 0.08, 0, DOOR[0]], [HALF + 0.14, 2.12, DOOR[1]], "door"),
  block([HALF, 0, DOOR[1]], [HALF + 0.4, CEIL, Z0], "wall"),
  block([HALF - 0.4, 0, DOOR[1] + 0.12], [HALF, 1.1, Z0 - 0.08], "lockers"),
  block([HALF - 0.03, 2.2, DOOR[0] + 0.4], [HALF, 2.3, DOOR[1] - 0.4], "doorlamp", { shadow: false }),   // the small green lamp over it
  // the capsule walls: one flat face each, the panels, openings and screens are its material; above them a duct to the ceiling
  block([HALF, 0, Z0], [HALF + 0.4, CEIL, ZEND], "capsules", { side: 1 }),
  block([-HALF - 0.4, 0, LZ0], [-HALF, CEIL, ZEND], "capsules", { side: -1 }),
  block([-HALF - 0.4, 0, -0.5], [-HALF, CEIL, LZ0], "wall"),
]
// Kessler as a stand-in, where he stops at 23 (the game draws him; here only to judge his size): before 23's opening; standing
// out from the wall he lands on screen a little toward the vanishing point, so his feet are at the opening's near edge
const I23 = 1
const SPOT = [HALF - 0.36, 0, Z0 + (I23 + 0.3) * PITCH]
const DOORSPOT = [HALF - 0.45, 0, (DOOR[0] + DOOR[1]) / 2]
PRIMS.push(cyl(SPOT[0], SPOT[2], 0.22, 0, 1.45, "person"), cyl(SPOT[0], SPOT[2], 0.12, 1.45, 1.75, "head"))

const LIGHTS = [
  ...[0.6, 3.0, 6.0, 9.0, 12.0].map((z) => ({ p: [0, CEIL - 0.4, z], I: 0.4, R: 3.2 })),    // the strip light, as soft points
  { p: [0, 1.4, FAR + 1.2], I: 0.6, R: 3 },                                             // the lobby's light through the way out
  { p: [1.1, 1.0, FAR - 1.1], I: 0.5, R: 2 },                                           // the vending machine's glow
  { p: [HALF - 0.25, 2.2, (DOOR[0] + DOOR[1]) / 2], I: 0.25, R: 1.3 },                  // the green lamp over the fire door
]
// a glow before each lit capsule's opening, on the corridor
for (const side of [-1, 1]) for (const row of ["up", "lo"]) for (let i = 0; i < NL; i++) {
  const z0 = side > 0 ? Z0 : LZ0
  if (side > 0 && i >= N) continue
  const n = side > 0 ? num(row, i) : lnum(row, i)
  if (!LIT.has(n)) continue
  const [y0, y1] = ROWS[row]
  LIGHTS.push({ p: [side * (HALF - 0.3), (y0 + y1) / 2, z0 + (i + 0.4) * PITCH], I: 0.2, R: 1.0 })
}

const MATS = {
  floor: (P) => {
    // lino: big tiles, a worn path down the middle
    const seam = ((P[0] / 0.6) % 1 + 1) % 1 < 0.04 || ((P[2] / 0.6) % 1 + 1) % 1 < 0.04
    return { a: (seam ? 0.22 : 0.3) + (Math.abs(P[0]) < 0.5 ? 0.04 : 0), e: 0, wet: 0.04, gloss: 0.08 }
  },
  ceiling: (P) => ({ a: ((P[2] / 0.6) % 1 + 1) % 1 < 0.05 ? 0.18 : 0.3, e: 0 }), wall: { a: 0.34, e: 0 }, lobby: { a: 0.3, e: 0.35 },
  exit: { a: 0.2, e: 0.9 }, strip: { a: 0.3, e: 1.0 }, doorlamp: { a: 0.3, e: 0.45 },
  vending: (P, n) => {
    if (n[2] < 0) { const u = (P[0] - 0.75) / 0.7, v = P[1] / 1.85; return { a: 0.2, e: u > 0.08 && u < 0.62 && v > 0.42 && v < 0.92 ? 0.85 : u > 0.7 && u < 0.92 && v > 0.55 && v < 0.75 ? 0.5 : 0.08 } }
    return { a: 0.3, e: 0 }
  },
  // the fire door: a dark leaf, its push bar across, a small wired window
  door: (P) => {
    const fz = Math.min(P[2] - DOOR[0], DOOR[1] - P[2])
    if (fz < 0.06 || P[1] > 2.06) return { a: 0.5, e: 0 }                            // its frame, light
    if (P[1] > 0.95 && P[1] < 1.07 && fz > 0.12) return { a: 0.7, e: 0 }
    if (P[1] > 1.35 && P[1] < 1.75 && fz > 0.3) return { a: 0.1, e: 0.15 }
    return { a: 0.15, e: 0 }
  },
  lockers: (P, n) => {
    if (n[0] >= 0) return { a: 0.3, e: 0 }
    const gz = ((P[2] / 0.35) % 1 + 1) % 1, gy = ((P[1] / 0.36) % 1 + 1) % 1
    return { a: gz < 0.08 || gy < 0.08 ? 0.12 : 0.34, e: 0 }
  },
  // the capsule wall's face: light panels with dark seams; in each a rounded opening (a lit capsule's blind glows, an empty one
  // shows its dark inside, the lit far side wall of the recess and the mattress), the screen beside it in a black bezel
  capsules: (P, n, f, hit) => {
    const side = hit.prim.side
    if (Math.abs(n[0]) < 0.5) return { a: 0.3, e: 0 }
    if (P[1] > ROWS.up[1] + 0.06) return { a: 0.2, e: 0 }                               // the duct over the capsules
    const c = capsuleAt(P, side)
    if (!c) return { a: 0.2, e: 0 }
    const { u, v } = c
    if (u < 0.025 || u > 0.975 || v < 0.03 || v > 0.97) return { a: 0.06, e: 0 }     // the seams round each panel
    // the screen in its bezel
    const [su0, su1] = SCREEN.u, [sv0, sv1] = SCREEN.v
    if (u > su0 - 0.03 && u < su1 + 0.03 && v > sv0 - 0.05 && v < sv1 + 0.05) {
      if (u > su0 && u < su1 && v > sv0 && v < sv1) return { a: 0.2, e: c.n === 23 ? 1.2 : 0.3 }
      return { a: 0.03, e: 0 }
    }
    // the rounded opening: corners cut by a radius of about 0.16 m
    const [ou0, ou1] = OPEN.u, [ov0, ov1] = OPEN.v, hgt = ROWS[c.row][1] - ROWS[c.row][0]
    const du = Math.max(0, Math.max(ou0 + 0.13 - u, u - (ou1 - 0.13))) * PITCH, dv = Math.max(0, Math.max(ov0 + 0.15 - v, v - (ov1 - 0.15))) * hgt
    const inOpen = u > ou0 && u < ou1 && v > ov0 && v < ov1 && Math.hypot(du, dv) < 0.17
    if (!inOpen) {
      // the rim round the opening: a raised lip, lighter
      const rim = u > ou0 - 0.04 && u < ou1 + 0.04 && v > ov0 - 0.05 && v < ov1 + 0.05 && Math.hypot(du, dv) < 0.23
      return { a: rim ? 0.58 : 0.32, e: 0 }
    }
    if (LIT.has(c.n)) return { a: 0.2, e: 0.75 + 0.12 * Math.sin(P[2] * 40) }        // the blind down, lit from inside
    // empty: the recess's far side wall catches the corridor's light, the mattress lies at the bottom, the back is dark
    if (u > ou1 - 0.09) return { a: 0.4, e: 0 }
    if (v < ov0 + 0.22) return { a: 0.36, e: 0 }
    return { a: 0.12, e: 0 }
  },
  person: { a: 0.06, e: 0 }, head: { a: 0.08, e: 0 },    // the hood, darker than an empty capsule behind him
}
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ambient: 0.23, sky: 0.02, rain: 0 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.6, key: "cam15a" })

// ================================================================ what the game would need, measured (printed when built)
// 23 itself: its opening, its screen and its number over the opening (drawn on the panel's top strip), nothing of the frames round it
const NUMV = 0.9      // the number's height on the panel (v)
const quad = (row, i, [u0, u1], [v0, v1]) => [onPanel(row, i, u0, v0), onPanel(row, i, u1, v0), onPanel(row, i, u0, v1), onPanel(row, i, u1, v1)]
const C23 = quad("up", I23, [SCREEN.u[0], OPEN.u[1]], [OPEN.v[0], 0.97])
const layout = {
  door: spotAt(CAM, DOORSPOT), spot: spotAt(CAM, SPOT), kesslerPx: Math.round(personPx(CAM, SPOT)),
  c23: hullOf(CAM, C23),
  c23raw: rectOf(CAM, C23),
  open23: rectOf(CAM, quad("up", I23, OPEN.u, OPEN.v)),
  screen23: rectOf(CAM, quad("up", I23, SCREEN.u, SCREEN.v)),
  capsules: hullOf(CAM, [[HALF, 0, Z0], [HALF, ROWS.up[1], Z0], [HALF, 0, ZEND], [HALF, ROWS.up[1], ZEND]]),
  doorRect: rectOf(CAM, [[HALF, 0, DOOR[0]], [HALF, 2.12, DOOR[0]], [HALF, 0, DOOR[1]], [HALF, 2.12, DOOR[1]]]),
  mic: spotAt(CAM, [SPOT[0], 1.2, SPOT[2]]),
}
console.log("CAM15_A " + JSON.stringify(layout))

// ---------------------------------------------------------------- hand drawing on top
// the capsules' numbers on the panel's top strip over each opening (right wall), where a panel is wide enough on screen to hold them
const numbers = (c) => {
  const baked = BAKE()
  for (const row of ["up", "lo"]) for (let i = 0; i < N; i++) {
    const n = num(row, i), a = at(CAM, onPanel(row, i, SCREEN.u[0], NUMV)), b = at(CAM, onPanel(row, i, OPEN.u[1], NUMV))
    if (Math.abs(b[0] - a[0]) < 10) continue
    const M = onPanel(row, i, (OPEN.u[0] + OPEN.u[1]) / 2, NUMV), m = at(CAM, M), d = Math.hypot(...sub(M, CAM.pos))
    if (baked.depth[m[1]] && baked.depth[m[1]][m[0]] + 0.2 < d) continue      // hidden (by the stand-in)
    const s = String(n), w = TXT.measure(s, "hud")
    c.rect(m[0] - Math.floor(w / 2) - 1, m[1] - 3, w + 2, 7, "1")
    TXT.draw(c, m[0], m[1] - 2, s, n === 23 ? "9" : "7", { font: "hud", align: "center" })
  }
  // 23's screen, lit: the hotel's text on it (K1a writes here), a black bezel round it so it stands off the light panel
  const q = quad("up", I23, SCREEN.u, SCREEN.v).map((Q) => project(CAM, Q))
  const x0 = Math.round(Math.min(...q.map((p) => p[0]))), x1 = Math.round(Math.max(...q.map((p) => p[0])))
  const y0 = Math.round(Math.min(...q.map((p) => p[1]))), y1 = Math.round(Math.max(...q.map((p) => p[1])))
  c.rect(x0 - 1, y0 - 1, x1 - x0 + 3, y1 - y0 + 3, "0")
  c.rect(x0, y0, x1 - x0 + 1, y1 - y0 + 1, "9")
  for (let y = y0 + 1; y < y1; y += 2) c.rect(x0 + 1, y, Math.max(1, x1 - x0 - 1), 1, "6")
  // the far end: EXIT over the way out
  const [ex, ey] = at(CAM, [0, 2.4, FAR - 0.06])
  TXT.draw(c, ex, ey - 2, "EXIT", "1", { font: "hud", align: "center" })
}

// ---------------------------------------------------------------- the sheets
const OSD = [[0, 0, 108, 36], [168, 10, 152, 16], [2, 40, 76, 106], [268, 156, 52, 24]]
const osd = (c) => {
  for (const [x, y, w, h] of OSD) for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
    const edge = i === 0 || j === 0 || i === w - 1 || j === h - 1
    if (edge ? (i + j) % 2 === 0 : (i + j) % 4 === 0) c.px(x + i, y + j, edge ? "9" : "0")
  }
}
const label = (s) => (c) => { c.rect(W - 6 - s.length * 4 - 4, H - 12, s.length * 4 + 6, 9, "0"); TXT.draw(c, W - 6, H - 10, s, "9", { font: "hud", align: "right" }) }
scene("cam15_blocks_a", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), numbers, (c) => reviewFx(c, W, H), label("A"))
scene("cam15_blocks_a_osd", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), numbers, (c) => reviewFx(c, W, H), osd, label("A MIT OSD"))
