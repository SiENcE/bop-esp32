// Blocks for CAM 15, the capsule hotel Morpheus (kapitel1-design, job A: Kessler comes in at 22:30 and climbs into capsule 23;
// Juno can write on 23's little screen to warn him). Feed mode, 320x180, the phosphor ramp only. A blockout in meters
// (art/lib/feed.js) with flat materials, so only the layout is judged: where the door is, where Kessler stands at 23, how big
// he is, whether 23 reads, and what the display covers ("mit OSD").
// Variant C: high over a corner, near iso. The Morpheus fills an old depot hall: two stacks of capsules, two high, face each
// other across a wide aisle (the hall's old loading lane), four columns each. The camera hangs from a beam under the roof in
// the corner at the aisle's near end, over the aisle beside the right stack, and looks down diagonally along it, so both
// walls of capsule fronts are seen at an angle: the left wall at about 45 degrees, the right one closer and steeper. The aisle
// runs from the bottom of the picture up to the door in the far end wall (shoe lockers left of it, a vending machine right).
// The numbers go round the aisle: the right wall 17-20 over 25-28 from the near end to the door, the left wall 21-24 over
// 29-32 from the door back to the near end, so 23 is the left wall's second column from the camera. Kessler comes in through
// the door, walks down the left wall past 21 and 22, stops at 23's ladder and climbs in.
// Not built into the game.
//   PXL build art/mockups/cam15_blocks_c.px.js --out build/art/cam15_blocks_c --no-preview
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [2.76, 4.4, -1.5], yaw: -26, pitch: 40, F: 90, w: W, h: H, k: 0.12 })

// ================================================================ the place, in meters (x across the aisle, y up, z along it toward the door)
const AISLE = 4.6                    // the left wall's capsule fronts at x = 0, the right wall's at x = AISLE
const DEEP = 2.1                     // a capsule's depth
const COL = 1.15, COLS = 4           // a column's width along the wall, columns per wall
const ROW = [[0.12, 1.17], [1.22, 2.27]]   // lower and upper capsule (y)
const TOP = 2.42, CEIL = 5.2
const Z0 = 0, ZC = COLS * COL        // where the capsules run along the walls
const ZL = ZC + 1.0                  // the far end wall with the door
const NEAR = -3.0                    // the near end wall, behind the camera
const HALL = [-DEEP - 0.5, AISLE + DEEP + 0.5]   // the hall's side walls (x)
const DOOR = [1.8, 2.8]              // the door in the far wall (x), 2.1 m high
// the numbers go round the aisle: the right wall from the near end to the door, the left wall from the door back
const NUM = (side, col, row) => side === 1 ? (row === 1 ? 17 : 25) + col : (row === 1 ? 24 : 32) - col
const C23 = { col: 1, row: 1 }
const colZ = (col) => [Z0 + col * COL, Z0 + (col + 1) * COL]
const frontX = (side) => side === 0 ? 0 : AISLE
// lit from inside: someone is in there, the curtain glows (23 is dark: it waits for Kessler)
const LIT = new Set([18, 20, 25, 27, 21, 30, 31])

const PRIMS = [
  // the hall: its roof, the end walls, the side walls
  block([HALL[0], CEIL, NEAR], [HALL[1], CEIL + 0.2, ZL + 0.3], "ceiling"),
  block([HALL[0], 0, ZL], [HALL[1], CEIL, ZL + 0.3], "endwall"),
  block([HALL[0], 0, NEAR - 0.3], [HALL[1], CEIL, NEAR], "endwall"),
  block([HALL[0] - 0.2, 0, NEAR], [HALL[0], CEIL, ZL], "hallwall"),
  block([HALL[1], 0, NEAR], [HALL[1] + 0.2, CEIL, ZL], "hallwall"),
  // the two stacks; on their roofs cable trays, the air units and what guests leave up there
  block([-DEEP, 0, Z0], [0, TOP, ZC], "stack", { side: 0 }),
  block([AISLE, 0, Z0], [AISLE + DEEP, TOP, ZC], "stack", { side: 1 }),
  block([-DEEP + 0.2, TOP, Z0 + 0.2], [-DEEP + 0.5, TOP + 0.1, ZC - 0.2], "tray"),
  block([AISLE + DEEP - 0.5, TOP, Z0 + 0.2], [AISLE + DEEP - 0.2, TOP + 0.1, ZC - 0.2], "tray"),
  block([-1.5, TOP, 0.5], [-0.6, TOP + 0.55, 1.3], "unit"),
  block([-1.5, TOP, 2.9], [-0.6, TOP + 0.55, 3.7], "unit"),
  block([AISLE + 0.5, TOP, 1.6], [AISLE + 1.4, TOP + 0.55, 2.4], "unit"),
  block([-0.9, TOP, 1.8], [-0.3, TOP + 0.35, 2.3], "box"),
  block([AISLE + 0.4, TOP, 3.4], [AISLE + 1.1, TOP + 0.3, 3.9], "box"),
  // the near end: a bench under the camera's wall
  block([0.3, 0, NEAR], [1.6, 0.45, NEAR + 0.45], "bench"),
  // the far end: the door and its frame, the EXIT sign over it, shoe lockers left of it, a vending machine right of it
  block([DOOR[0] - 0.08, 0, ZL - 0.06], [DOOR[1] + 0.08, 2.18, ZL], "doorframe"),
  block([DOOR[0], 0, ZL - 0.08], [DOOR[1], 2.1, ZL - 0.02], "door"),
  block([(DOOR[0] + DOOR[1]) / 2 - 0.35, 2.26, ZL - 0.1], [(DOOR[0] + DOOR[1]) / 2 + 0.35, 2.52, ZL - 0.02], "exit"),
  block([0.05, 0, ZL - 0.4], [1.25, 1.3, ZL], "locker"),
  block([AISLE - 0.85, 0, ZL - 0.75], [AISLE - 0.1, 1.85, ZL - 0.05], "vend"),
  block([-DEEP, 0, ZC], [0, TOP, ZL], "wall"),
  block([AISLE, 0, ZC], [AISLE + DEEP, TOP, ZL], "wall"),
  // three lamps hung over the aisle on their wires
  ...[0.6, 2.3, 4.0].map((z) => block([AISLE / 2 - 0.22, 3.64, z - 0.05], [AISLE / 2 + 0.22, 3.7, z + 0.05], "strip", { shadow: false })),
  // the hotel's sign high on the far wall, over the door
  block([DOOR[0] - 0.9, 3.0, ZL - 0.08], [DOOR[1] + 0.9, 3.6, ZL - 0.02], "sign"),
  // the beam the camera hangs from
  block([HALL[0], CEIL - 0.4, NEAR + 0.4], [HALL[1], CEIL, NEAR + 0.7], "beam"),
]
// ladders to the upper row: one at every column's near seam, on both walls
for (const side of [0, 1]) for (let col = 0; col < COLS; col++) {
  const z = Z0 + col * COL + 0.07, x = frontX(side), dx = side === 0 ? 0.1 : -0.1
  PRIMS.push(block([Math.min(x, x + dx), 0, z - 0.04], [Math.max(x, x + dx), ROW[1][0] + 0.12, z + 0.04], "ladder"))
}

// a capsule's face: the rounded hatch (u along the wall from the column's near edge, v up from the row's foot), the screen
// beside it on the door's side
const HATCH = { u0: 0.14, u1: 0.84, v0: 0.1, v1: 0.95, r: 0.17 }
const SCREEN = { u0: 0.9, u1: 1.08, v0: 0.46, v1: 0.74 }
const inHatch = (u, v) => {
  if (u < HATCH.u0 || u > HATCH.u1 || v < HATCH.v0 || v > HATCH.v1) return false
  const cu = clamp(u, HATCH.u0 + HATCH.r, HATCH.u1 - HATCH.r), cv = clamp(v, HATCH.v0 + HATCH.r, HATCH.v1 - HATCH.r)
  return Math.hypot(u - cu, v - cv) <= HATCH.r
}
const capsuleFace = (side, z, y) => {
  const col = Math.floor((z - Z0) / COL), row = y >= ROW[1][0] ? 1 : y >= ROW[0][0] ? 0 : -1
  if (y > ROW[1][1] + 0.05) return { a: 0.3, e: 0 }                                // the bulkhead over the upper row
  if (col < 0 || col >= COLS || row < 0 || y > ROW[1][1]) return { a: 0.18, e: 0 }   // the plinth and the rails between rows
  const u = z - colZ(col)[0], v = y - ROW[row][0]
  if (u < 0.03 || u > COL - 0.03) return { a: 0.14, e: 0 }                          // the seam between columns
  const lit = LIT.has(NUM(side, col, row))
  if (u >= SCREEN.u0 && u <= SCREEN.u1 && v >= SCREEN.v0 && v <= SCREEN.v1) return { a: 0.2, e: 0.55 }
  if (inHatch(u, v)) {
    const rim = !inHatch(u - 0.04, v) || !inHatch(u + 0.04, v) || !inHatch(u, v - 0.04) || !inHatch(u, v + 0.04)
    if (rim) return { a: 0.5, e: 0.02 }
    return lit ? { a: 0.2, e: 0.75 + 0.06 * Math.sin(v * 9) } : { a: 0.04, e: 0 }
  }
  return { a: 0.22, e: 0 }
}

// the lamps over the aisle, pointed down; the lit capsules spill a little light into the aisle
const LIGHTS = [
  { p: [AISLE / 2, 3.6, 0.6], dir: [0, -1, 0], cone: 65, soft: 35, I: 0.42, R: 4.0, shadow: true },
  { p: [AISLE / 2, 3.6, 2.3], dir: [0, -1, 0], cone: 65, soft: 35, I: 0.42, R: 4.0, shadow: true },
  { p: [AISLE / 2, 3.6, 4.0], dir: [0, -1, 0], cone: 65, soft: 35, I: 0.4, R: 4.0, shadow: true },
  { p: [AISLE / 2, 3.5, 2.3], I: 0.35, R: 4.5 },                                // their spill sideways, onto both walls of fronts
  { p: [(DOOR[0] + DOOR[1]) / 2, 2.4, ZL - 0.4], I: 0.3, R: 1.6 },              // the EXIT sign over the door
  { p: [AISLE - 0.5, 1.2, ZL - 1.2], I: 0.4, R: 1.6 },                          // the vending machine's face
  { p: [(DOOR[0] + DOOR[1]) / 2, 3.3, ZL - 0.6], I: 0.35, R: 2.6 },             // the sign's glow
  { p: [-1.1, 4.8, 2.3], I: 0.3, R: 4.5 },                                      // the hall's dim lamps under the roof, over the stacks
  { p: [AISLE + 1.1, 4.8, 2.3], I: 0.3, R: 4.5 },
]
for (const side of [0, 1]) for (let col = 0; col < COLS; col++) for (const row of [0, 1]) {
  if (!LIT.has(NUM(side, col, row))) continue
  const [za, zb] = colZ(col)
  LIGHTS.push({ p: [side === 0 ? 0.3 : AISLE - 0.3, (ROW[row][0] + ROW[row][1]) / 2, (za + zb) / 2], I: 0.18, R: 1.2 })
}

const MATS = {
  floor: (P) => {
    // lino in sheets along the aisle, a worn path down the left wall where everyone walks, a mat at the door
    if (P[2] > ZL - 0.9 && P[0] > DOOR[0] - 0.15 && P[0] < DOOR[1] + 0.15) return { a: 0.14, e: 0 }
    const seam = (((P[0] + 0.6) % 1.2) + 1.2) % 1.2 < 0.03
    const worn = Math.abs(P[0] - 0.9) < 0.45 && P[2] > -0.5
    return { a: seam ? 0.16 : worn ? 0.27 : 0.22, e: 0 }
  },
  ceiling: { a: 0.12, e: 0 }, endwall: (P) => ({ a: (P[0] * 1.2 + 10) % 1 < 0.05 ? 0.18 : 0.26, e: 0 }),
  wall: { a: 0.28, e: 0 }, hallwall: (P) => ({ a: (P[2] * 1.2 + 10) % 1 < 0.05 ? 0.14 : 0.22, e: 0 }),
  tray: { a: 0.4, e: 0 }, beam: { a: 0.2, e: 0 }, unit: (P, n) => ({ a: n[1] > 0.5 ? 0.45 : (P[1] * 8) % 1 < 0.3 ? 0.2 : 0.36, e: 0 }),
  box: { a: 0.42, e: 0 }, bench: { a: 0.32, e: 0 },
  stack: (P, n, f, hit) => {
    if (n[1] > 0.5) return { a: (P[2] * 2.2 + 10) % 1 < 0.06 ? 0.22 : 0.3, e: 0 }   // the roof, its panels
    const side = hit.prim.side, front = side === 0 ? n[0] > 0.5 : n[0] < -0.5
    if (!front) return { a: (P[1] * 2.5) % 1 < 0.05 ? 0.16 : 0.26, e: 0 }            // the stack's end: its panels
    return capsuleFace(side, P[2], P[1])
  },
  ladder: { a: 0.6, e: 0 }, locker: (P, n) => ({ a: n[1] > 0.5 ? 0.18 : (P[0] * 2.5 + 10) % 1 < 0.08 || (P[1] * 3) % 1 < 0.06 ? 0.14 : 0.38, e: 0 }),
  doorframe: { a: 0.6, e: 0 }, door: (P) => P[1] > 1.35 && P[1] < 1.8 && Math.abs(P[0] - (DOOR[0] + DOOR[1]) / 2) < 0.18 ? { a: 0.1, e: 0.3 } : { a: Math.abs(P[1] - 1.0) < 0.04 ? 0.5 : 0.16, e: 0 },
  exit: { a: 0.3, e: 0.8 }, sign: { a: 0.3, e: 0.7 },
  vend: (P, n) => n[2] < -0.5 && P[1] > 0.7 && P[1] < 1.7 && P[0] < AISLE - 0.35 ? { a: 0.3, e: 0.75 } : { a: 0.36, e: 0 },
  strip: { a: 0.4, e: 0.9 },
}
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ambient: 0.21, sky: 0.02, rain: 0 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.55, key: "cam15c" })

// ================================================================ what the game would need, measured (printed when built)
const [z23a, z23b] = colZ(C23.col)
const STAND = [0.55, 0, z23a - 0.42]                                          // at the foot of 23's ladder, on its near side
const face23 = [[0, ROW[1][0], z23a], [0, ROW[1][0], z23b], [0, ROW[1][1], z23a], [0, ROW[1][1], z23b]]
const DOOR_IN = [(DOOR[0] + DOOR[1]) / 2, 0, ZL - 0.3]
const layout = {
  door: spotAt(CAM, DOOR_IN),
  spot: spotAt(CAM, STAND),
  kesslerPx: Math.round(personPx(CAM, STAND)),
  doorPx: Math.round(personPx(CAM, DOOR_IN)),
  scale: depthScale(CAM, DOOR_IN, STAND),
  c23: hullOf(CAM, face23, 0),
  c23rect: rectOf(CAM, face23),
  doorRect: rectOf(CAM, [[DOOR[0], 0, ZL], [DOOR[1], 0, ZL], [DOOR[0], 2.1, ZL], [DOOR[1], 2.1, ZL]]),
  // the wall he passes from the door to 23 (the left one), and the right wall across the aisle
  capsules: hullOf(CAM, [[0, 0, Z0], [0, ROW[1][1], Z0], [0, 0, ZC], [0, ROW[1][1], ZC]], 0),
  capsulesRight: hullOf(CAM, [[AISLE, 0, Z0], [AISLE, ROW[1][1], Z0], [AISLE, 0, ZC], [AISLE, ROW[1][1], ZC]], 0),
  mic: spotAt(CAM, [STAND[0] + 0.3, 1.2, STAND[2]]),
}
console.log("CAM15_C " + JSON.stringify(layout))
// the check: nothing that matters under the display's zones (Kessler's figure 13 px wide over his spot), and his figure against
// 23's face (its hull's rect)
{
  const OSDZ = [[0, 0, 108, 36], [168, 10, 152, 16], [2, 40, 76, 106], [268, 156, 52, 24]]
  const over = ([x, y, w, h], [a, b, c, d]) => x < a + c && x + w > a && y < b + d && y + h > b
  const hit = (r) => OSDZ.some((z) => over(r, z))
  const fig = (p, h) => [p[0] - 6, p[1] - h, 13, h]
  // does any pixel of his figure fall inside 23's face (its hull, not its rect: the face is a slanted parallelogram)?
  const inside = (px, py, h) => { let a = false; for (let i = 0, j = h.length - 2; i < h.length; j = i, i += 2) if ((h[i + 1] > py) !== (h[j + 1] > py) && px < (h[j] - h[i]) * (py - h[i + 1]) / (h[j + 1] - h[i + 1]) + h[i]) a = !a; return a }
  const [fx, fy, fw, fh] = fig(layout.spot, layout.kesslerPx)
  let figOn23 = 0
  for (let x = fx; x < fx + fw; x++) for (let y = fy; y < fy + fh; y++) if (inside(x + 0.5, y + 0.5, layout.c23)) figOn23++
  console.log("CAM15_C_CHECK " + JSON.stringify({ c23: hit(layout.c23rect), door: hit(layout.doorRect), spot: hit(fig(layout.spot, layout.kesslerPx)), doorSpot: hit(fig(layout.door, layout.doorPx)), figPxOn23: figOn23, fig: fig(layout.spot, layout.kesslerPx) }))
}

// ---------------------------------------------------------------- hand drawing on top
// every capsule's number on its hatch, toward the door's side (where Kessler at the ladder doesn't cover it), the upper row's high
// and the lower row's low so the steep right wall's numbers don't run together; light on a dark outline, 23 brightest;
// MORPHEUS on the far wall, EXIT over the door
const words = (c) => {
  for (const side of [0, 1]) for (let col = 0; col < COLS; col++) for (const row of [0, 1]) {
    const n = NUM(side, col, row), [za] = colZ(col), x0 = side === 0 ? 0.01 : AISLE - 0.01
    const [x, y] = at(CAM, [x0, ROW[row][0] + (row === 1 ? 0.8 : 0.55), za + (row === 1 ? 0.6 : 0.78)])
    TXT.draw(c, x, y - 2, String(n), n === 23 ? "9" : "8", { font: "hud", align: "center", outline: "0" })
  }
  const [mx, my] = at(CAM, [(DOOR[0] + DOOR[1]) / 2, 3.3, ZL - 0.1])
  TXT.draw(c, mx, my - 2, "MORPHEUS", "1", { font: "hud", align: "center" })
  const [ex, ey] = at(CAM, [(DOOR[0] + DOOR[1]) / 2, 2.39, ZL - 0.1])
  TXT.draw(c, ex, ey - 2, "EXIT", "1", { font: "hud", align: "center" })
}
// Kessler as a stand-in (review only), at 23's ladder
const kessler = (c) => standIn(c, layout.spot[0], layout.spot[1], layout.kesslerPx)

// ---------------------------------------------------------------- the sheets
const OSD = [[0, 0, 108, 36], [168, 10, 152, 16], [2, 40, 76, 106], [268, 156, 52, 24]]
const osd = (c) => {
  for (const [x, y, w, h] of OSD) for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
    const edge = i === 0 || j === 0 || i === w - 1 || j === h - 1
    if (edge ? (i + j) % 2 === 0 : (i + j) % 4 === 0) c.px(x + i, y + j, edge ? "9" : "0")
  }
}
const label = (s) => (c) => { c.rect(W - 6 - s.length * 4 - 4, H - 12, s.length * 4 + 6, 9, "0"); TXT.draw(c, W - 6, H - 10, s, "9", { font: "hud", align: "right" }) }
scene("cam15_blocks_c", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), words, kessler, (c) => reviewFx(c, W, H), label("C"))
scene("cam15_blocks_c_osd", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), words, kessler, (c) => reviewFx(c, W, H), osd, label("C MIT OSD"))
