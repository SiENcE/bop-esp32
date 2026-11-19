// CAM 51, the workers' hostel 5-Süd in the Fifth: dormitory C, a long hall of bunks, the camera high over the door looking down the
// aisle (kapitel2-design §6.2, H3: Frau Haldane's son Najo). Feed mode, 320x180, the phosphor ramp only (style guide §9).
// The user approved the blocks (2026-11-19, docs/cams/cam51_blocks_x3.png); this paints on their lines: the same place in meters, the
// same camera, the same bunks and the same people where they were.
// What is in it: the hall's concrete panels, a dado line, high windows onto a light well (a window without sky), pipes along the
// ceiling's corners, the tubes in their housings; the bunks along both walls, their long side to the aisle, two levels, a ladder at the
// foot end, ticking on the mattresses, pillows; washing over the rails, boots under the lower bunks; a locker after each bunk with its
// number plate; at the far end the door, the lit EXIT over it, a plate beside it and Nagi·wa's ring; 12 on Najo's bunk. The floor's linoleum, worn pale down the aisle.
// Four pictures of the same place, all from the archive Sable sells a look into (the camera is never seen live): its newest recording,
// last night at three (the bunks full of sleepers, each with the pale dot behind the ear, Najo's bunk, number 12, stripped to the
// mattress), and three from a month ago:
//   cam51_brief    Sunday 14.10., 21:00: Najo sits on his bunk and reads a letter, the night light only
//   cam51_morgen   Monday 15.10., 06:00: the light on, the others up and in the aisle, he lies there
//   cam51_traeger  06:30: two in white carry him out on a stretcher, the aisle empty
// Where: CAM51_LAYOUT at the end of this file (printed when built), copied into game/places.js (cam51).
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [-0.5, 3.2, 0.1], yaw: 6, pitch: 30, F: 150, w: W, h: H, k: 0.2 })

// ================================================================ the place, in meters (x across, y up, z down the hall from the camera)
// the bunks stand along both walls, their long side to the aisle, a locker between each and the next
const HALL = 2.1, LEN = 19, LOW = 0.45, UP = 1.45, TOP = 2.0, BD = 0.9, BL = 2.0, PITCH = 2.45, Z0 = 2.2, N = 7, CEIL = 3.4
const bunkZ = (i) => Z0 + i * PITCH
// Najo's bunk: the right row, the first from the door, the upper one ("Koje 12"; the steep lens sees the upper bunks best, and the
// cameras' strip covers the left edge of every feed)
const NAJO = 0, NZ = bunkZ(NAJO), NX0 = HALL - BD, NX1 = HALL
const rnd = (a, b, s) => ih(a * 7 + 11, b * 13 + 5, s)
const bunk = (side, i) => {
  const z0 = bunkZ(i), z1 = z0 + BL, x0 = side < 0 ? -HALL : HALL - BD, x1 = side < 0 ? -HALL + BD : HALL, out = side < 0 ? x1 : x0, wall = side < 0 ? x0 : x1
  const najo = side > 0 && i === NAJO, P = []
  // the four posts, the boards of both levels, the upper one's guard toward the aisle, the ladder at the foot end
  for (const z of [z0, z1 - 0.06]) P.push(block([x0, 0, z], [x0 + 0.06, TOP, z + 0.06], "frame"), block([x1 - 0.06, 0, z], [x1, TOP, z + 0.06], "frame"))
  P.push(block([x0, LOW - 0.12, z0], [x1, LOW - 0.04, z1], "frame"), block([x0, UP - 0.12, z0], [x1, UP - 0.04, z1], "frame"))
  P.push(block([out - 0.03, UP + 0.25, z0 + 0.06], [out + 0.03, UP + 0.3, z0 + 0.9], "frame"), block([out - 0.03, UP + 0.06, z0 + 0.88], [out + 0.03, UP + 0.3, z0 + 0.92], "frame"))
  P.push(block([out - 0.025, LOW, z1 - 0.45], [out + 0.025, UP + 0.3, z1 - 0.41], "frame"))
  for (const y of [0.78, 1.1]) P.push(block([out - 0.025, y, z1 - 0.43], [out + 0.025, y + 0.035, z1 - 0.04], "frame"))
  // the mattresses, ticked; a pillow at the head end (the far one), but on Najo's: stripped
  for (const y of [LOW, UP]) {
    P.push(block([x0 + 0.04, y - 0.04, z0 + 0.06], [x1 - 0.04, y + 0.08, z1 - 0.06], najo && y === UP ? "bare" : "mattress"))
    if (!(najo && y === UP)) P.push(block([x0 + 0.12, y + 0.08, z1 - 0.45], [x1 - 0.12, y + 0.2, z1 - 0.1], "pillow"))
  }
  // washing over the guard or the board's edge: a shirt, a towel (by chance, never on Najo's)
  if (!najo && rnd(i, side, 1) > 0.35) { const zc = z0 + 0.25 + rnd(i, side, 2) * 0.4; P.push(block([out - 0.02, UP - 0.25, zc], [out + 0.02, UP + 0.3, zc + 0.32], rnd(i, side, 3) > 0.5 ? "towel" : "shirt")) }
  if (rnd(i, side, 4) > 0.55) { const zc = z0 + 0.9 + rnd(i, side, 5) * 0.5; P.push(block([out - 0.02, LOW - 0.3, zc], [out + 0.02, LOW + 0.1, zc + 0.26], "towel")) }
  // boots under the lower bunk, at the aisle's edge
  if (rnd(i, side, 6) > 0.3) { const zc = z0 + 0.4 + rnd(i, side, 7) * 0.8, xb = out + (side < 0 ? -0.18 : 0.18)
    P.push(block([xb - 0.07, 0, zc], [xb + 0.07, 0.14, zc + 0.28], "boot"), block([xb - 0.07, 0, zc + 0.34], [xb + 0.07, 0.14, zc + 0.62], "boot")) }
  // the locker after it, against the wall, its door toward the aisle
  P.push(block([side < 0 ? -HALL : HALL - 0.45, 0, z1 + 0.02], [side < 0 ? -HALL + 0.45 : HALL, 1.9, z1 + 0.43], "locker", { n: i, side }))
  void wall
  return P
}
// a sleeper under a blanket, the head at the far end on the pillow: the legs low, the hips and shoulders a hump; the dot behind the
// ear glows (the patch, on Lull)
const dotAt = (side, i, y) => { const x0 = side < 0 ? -HALL + 0.12 : HALL - BD + 0.12, xm = x0 + (BD - 0.24) / 2; return [xm + (side < 0 ? 0.1 : -0.1), y + 0.36, bunkZ(i) + BL - 0.26] }
const sleeper = (side, i, y) => {
  const z0 = bunkZ(i), x0 = side < 0 ? -HALL + 0.12 : HALL - BD + 0.12, x1 = x0 + BD - 0.24, xm = (x0 + x1) / 2, hz = z0 + BL - 0.3, turn = rnd(i, side + y, 8) > 0.5 ? 0.06 : -0.06
  return [block([x0 + 0.05, y + 0.08, z0 + 0.15], [x1 - 0.05, y + 0.2, z0 + 0.95], "blanket"), block([x0, y + 0.08, z0 + 0.9], [x1, y + 0.3, hz - 0.12], "blanket"),
    block([x0 + 0.02, y + 0.28, hz - 0.3], [x1 - 0.02, y + 0.32, hz - 0.12], "fold"),
    cyl(xm + turn, hz, 0.11, y + 0.2, y + 0.4, "head"), block([xm + (side < 0 ? 0.08 : -0.12), y + 0.33, hz + 0.02], [xm + (side < 0 ? 0.12 : -0.08), y + 0.38, hz + 0.06], "dot")]
}
// a person standing, feet at x, z, round as the camera sees people from above: legs, a body, arms, the head; m their clothes (white: the
// carriers in their overalls and hoods); reach: the arms held out along the hall (toward a stretcher's handles)
const person = (x, z, m = "person", { towel = false, reach = 0 } = {}) => {
  const white = m === "white", leg = white ? "white" : "legs", arm = white ? "white" : "arm", r = white ? 0.2 : 0.18
  const P = [cyl(x - 0.08, z, 0.07, 0, 0.88, leg), cyl(x + 0.08, z, 0.07, 0, 0.88, leg), cyl(x, z, r, 0.82, 1.4, m), cyl(x, z, r - 0.05, 1.38, 1.47, m),
    // the head, or the hood that sits down on the shoulders
    ...(white ? [cyl(x, z, 0.14, 1.4, 1.6, "hood"), cyl(x, z, 0.1, 1.6, 1.72, "hood")] : [cyl(x, z, 0.1, 1.47, 1.72, "head")])]
  if (!reach) P.push(cyl(x - r - 0.04, z, 0.05, 0.8, 1.42, arm), cyl(x + r + 0.04, z, 0.05, 0.8, 1.42, arm))
  else for (const dx of [-r + 0.02, r - 0.02]) P.push(block([x + dx - 0.05, 0.9, Math.min(z, z + reach)], [x + dx + 0.05, 1.0, Math.max(z, z + reach)], arm))
  if (towel) P.push(block([x - r, 1.38, z - 0.14], [x - r + 0.16, 1.5, z + 0.14], "towel"))
  return P
}

const ROOM = [
  block([-HALL - 1, 0, LEN], [HALL + 1, CEIL, LEN + 1], "farwall"),                    // the far wall, its door and the green sign, the ring
  block([-0.5, 0, LEN - 0.05], [0.5, 2.1, LEN], "door"), block([-0.35, 2.25, LEN - 0.06], [0.35, 2.45, LEN], "exit"),
  block([-HALL - 1, 0, -1], [-HALL, CEIL, LEN], "wall"), block([HALL, 0, -1], [HALL + 1, CEIL, LEN], "wall", { right: true }),
  block([-HALL, CEIL, -1], [HALL, CEIL + 0.2, LEN], "ceiling"),
  // pipes along the ceiling's corners
  block([-HALL, CEIL - 0.16, -1], [-HALL + 0.12, CEIL - 0.04, LEN], "pipe"), block([HALL - 0.2, CEIL - 0.12, -1], [HALL, CEIL - 0.02, LEN], "pipe"),
  block([HALL - 0.1, CEIL - 0.3, -1], [HALL, CEIL - 0.2, LEN], "pipe"),
  // the aisle's night light: a strip along the floor on both sides
  block([-HALL + BD + 0.02, 0, 0], [-HALL + BD + 0.06, 0.03, LEN], "strip"), block([HALL - BD - 0.06, 0, 0], [HALL - BD - 0.02, 0.03, LEN], "strip"),
  // the ceiling's tubes, in their housings, over the aisle
  ...[3, 8, 13, 17].flatMap((z) => [block([-0.66, CEIL - 0.06, z - 0.05], [0.66, CEIL, z + 0.17], "housing"), block([-0.6, CEIL - 0.1, z], [0.6, CEIL - 0.06, z + 0.12], "tube")]),
  ...[...Array(N).keys()].flatMap((i) => [...bunk(-1, i), ...bunk(1, i)]),
]
// who sleeps where now (the upper and lower of each, but for a few empty ones; Najo's stays empty)
const FULL = [...Array(N).keys()].flatMap((i) => [[-1, i, LOW], [-1, i, UP], [1, i, LOW], [1, i, UP]])
  .filter(([s, i, y]) => !(s > 0 && i === NAJO && y === UP) && (i < 2 || ih(s + 3, i, y * 10) > 0.15))   // the nearest all full: a sleeper to read the others by
const NOW = FULL.flatMap(([s, i, y]) => sleeper(s, i, y))
// the night of the letter: everyone in, Najo sitting up on his bunk, his back to the wall, the knees up, the letter in both hands
// (bright: paper), the envelope beside him; his blanket kicked down to the foot, his pillow at the head (the far end)
const SX = HALL - 0.4, SZ = NZ + 0.8, U = UP + 0.08
const NAJO_BED = [block([NX0 + 0.12, U, NZ + 0.1], [NX1 - 0.12, U + 0.1, NZ + 0.5], "blanket"), block([NX0 + 0.12, U, NZ + BL - 0.45], [NX1 - 0.12, U + 0.12, NZ + BL - 0.1], "pillow")]
const BRIEF = [...NOW, ...NAJO_BED, block([SX - 0.3, U + 0.01, SZ + 0.3], [SX - 0.1, U + 0.03, SZ + 0.46], "letter")]   // (and the envelope; he is drawn)
// Najo himself, drawn on top (a figure of prims read as blocks this near): from above and to his right, his back to the wall, the
// knees up, his head bowed over the letter in both hands; the paper is the brightest thing in the dark and lights his face
const NAJO_SIT = [
  "..............222",
  ".............23332",
  "............2333332",
  "............3333333",
  "...........53333332",
  "...........66533332",
  "...........6653332",
  "............553322",
  "...........44333333",
  "..........4433333333",
  ".........44433333333",
  "........4443333333333",
  "..99999.443333333333",
  ".9777799.43333333333",
  ".9999999.43333333333",
  ".97777996633333333333",
  ".99999996633333333333",
  ".97779999.3333333333",
  ".99999999.3333333333",
  "..322223..3333333333",
  ".32222223.3333333333",
  ".322222223333333333",
  ".3222222222223333332",
  ".32222..222222222222",
  ".3222....22222222222",
  ".3222.....2222222222",
  ".3222......222222222",
  "43332",
  "44442",
].map((r) => r.padEnd(22, ".")).join("\n")
sprite("_najo_sit", NAJO_SIT)
const najo = (c) => { const [x, y] = at(CAM, [SX - 0.15, U, SZ]); c.stamp("_najo_sit", x - 12, y - 29) }
// Monday six: the light on, the others up, three in the aisle (one with a towel), one at his locker; Najo lies under his blanket,
// the dot behind his ear still lit
const MORGEN = [...sleeper(1, NAJO, UP), ...person(-0.4, 4.4, "shirt2", { towel: true }), ...person(0.3, 7.5, "person"), ...person(-0.2, 11.5, "shirt2"),
  ...person(-HALL + 0.7, 14.9, "person", { reach: -0.3 }), ...FULL.filter((_, k) => k % 5 === 0).flatMap(([s, i, y]) => sleeper(s, i, y))]
// half past six: two in white, a stretcher between them in the aisle by his bunk, just past it toward the door under the camera, he lies on it under its blanket; the hall empty.
// The stretcher: its canvas, its two poles running out to handles at both ends, its legs folded under
const TX = 0.3, TZ0 = NZ + 0.8, TZ1 = TZ0 + BL + 0.4
const TRAEGER = [...person(TX, TZ0 - 0.35, "white", { reach: 0.3 }), ...person(TX, TZ1 + 0.35, "white", { reach: -0.3 }),
  block([TX - 0.28, 0.76, TZ0 - 0.25], [TX - 0.22, 0.81, TZ1 + 0.25], "stretcher"), block([TX + 0.22, 0.76, TZ0 - 0.25], [TX + 0.28, 0.81, TZ1 + 0.25], "stretcher"),
  block([TX - 0.24, 0.74, TZ0], [TX + 0.24, 0.79, TZ1], "canvas"),
  block([TX - 0.2, 0.79, TZ0 + 0.3], [TX + 0.2, 0.97, TZ1 - 0.45], "blanket"), block([TX - 0.2, 0.95, TZ1 - 0.75], [TX + 0.2, 0.99, TZ1 - 0.45], "fold"),
  cyl(TX, TZ1 - 0.25, 0.1, 0.79, 0.99, "head"), block([TX + 0.08, 0.92, TZ1 - 0.23], [TX + 0.12, 0.97, TZ1 - 0.19], "dot")]

const NIGHT = [
  { p: [0, 0.4, 4], I: 0.5, R: 5 }, { p: [0, 0.4, 9], I: 0.5, R: 5 }, { p: [0, 0.4, 14], I: 0.45, R: 5 },  // the strips' glow
  ...[4, 10, 16].map((z) => ({ p: [0, 3.1, z], I: 0.22, R: 5 })),                                          // the tubes' blue night setting
  { p: [0, 2.6, LEN - 0.5], I: 0.35, R: 3 },                                                                // the exit sign
]
const DAY = [3, 8, 13, 17].map((z) => ({ p: [0, 3.2, z + 0.06], I: 0.75, R: 6, shadow: true }))

// ---------------------------------------------------------------- materials
const fr = (v) => ((v % 1) + 1) % 1
const MATS = {
  // the side walls: concrete panels, a dado line at 1.2 m (the lower part darker, scuffed), high windows onto a light well between
  // the bunks on the right (frosted; behind them the well's wall, a little light from somewhere above)
  wall: (P, n, f, hit) => {
    const [, y, z] = P
    if (hit.prim.right && y > 2.25 && y < 3.0) { const k = fr((z - Z0 + 0.25) / PITCH); if (k < 0.32) {
      const bar = Math.abs(k - 0.16) < 0.012 || Math.abs(y - 2.62) < 0.02
      return bar ? { a: 0.26, e: 0 } : { a: 0.14, e: 0.05 + 0.06 * (y - 2.25) + 0.03 * fbm(z * 4, y * 4, 2) } } }
    if (Math.abs(y - 1.2) < 0.025) return { a: 0.36, e: 0 }
    const seam = fr(z / 1.25) < 0.03 || Math.abs(y - 2.4) < 0.015
    if (y < 1.2) return { a: seam ? 0.16 : 0.22 + 0.05 * (fbm(z * 3, y * 6, 2) - 0.5), e: 0 }
    return { a: seam ? 0.2 : 0.3 + 0.04 * (fbm(z * 2, y * 2, 2) - 0.5), e: 0 }
  },
  farwall: (P) => {
    const [x, y] = P
    if (Math.abs(Math.hypot(x + 1.3, y - 2.2) - 0.32) < 0.05) return { a: 0.3, e: 0.6 }                       // Nagi·wa's ring, lit
    if (x > 0.75 && x < 1.75 && y > 1.85 && y < 2.4) return { a: 0.55, e: 0.05 }                               // the DORM C plate
    return { a: Math.abs(y - 1.2) < 0.025 ? 0.36 : 0.28, e: 0 }
  },
  ceiling: { a: 0.2, e: 0 }, pipe: (P, n) => ({ a: n[1] > 0.5 ? 0.45 : 0.3, e: 0 }), housing: { a: 0.35, e: 0 },
  door: (P) => ({ a: Math.abs(P[1] - 1.0) < 0.04 ? 0.6 : Math.abs(P[0]) < 0.015 ? 0.15 : 0.32, e: 0 }), exit: { a: 0.3, e: 0.85 },
  strip: { a: 0.2, e: 0.5 }, frame: (P, n) => ({ a: n[1] > 0.5 ? 0.55 : 0.4, e: 0 }),
  // ticking: stripes along the mattress, its piping darker
  mattress: (P, n) => ({ a: n[1] > 0.5 ? (fr(P[0] * 9) < 0.35 ? 0.34 : 0.42) : 0.28, e: 0 }),
  bare: (P, n) => ({ a: n[1] > 0.5 ? (fr(P[0] * 9) < 0.35 ? 0.4 : 0.5) - (fbm(P[0] * 5, P[2] * 3, 2) > 0.62 ? 0.1 : 0) : 0.32, e: 0 }),
  pillow: { a: 0.7, e: 0 },
  // the lockers: the door's seam, vent slots at the top, the number plate, a padlock
  locker: (P, n, f, hit) => {
    const [x, y, z] = P, side = hit.prim.side, aisle = side < 0 ? n[0] > 0.5 : n[0] < -0.5
    if (!aisle) return { a: 0.26, e: 0 }
    const zz = z - hit.prim.a[2]
    if (Math.abs(zz - 0.21) < 0.01) return { a: 0.12, e: 0 }
    if (y > 1.6 && y < 1.8 && fr(y * 30) < 0.4 && zz > 0.05 && zz < 0.37) return { a: 0.14, e: 0 }
    if (y > 1.4 && y < 1.5 && zz > 0.08 && zz < 0.18) return { a: 0.75, e: 0.05 }
    if (y > 0.95 && y < 1.03 && zz > 0.24 && zz < 0.28) return { a: 0.65, e: 0 }
    return { a: 0.34, e: 0 }
  },
  blanket: (P, n) => ({ a: n[1] > 0.5 ? 0.52 + 0.08 * (fbm(P[0] * 6, P[2] * 3, 2) - 0.5) - (fr(P[2] * 2.5) < 0.12 ? 0.08 : 0) : 0.42, e: 0 }),
  fold: { a: 0.75, e: 0 }, head: { a: 0.26, e: 0 }, dot: { a: 0.2, e: 0.95 },
  person: { a: 0.28, e: 0 }, shirt2: { a: 0.46, e: 0 }, legs: { a: 0.2, e: 0 }, arm: { a: 0.32, e: 0 },
  shirt: (P) => ({ a: fr(P[1] * 8) < 0.5 ? 0.3 : 0.5, e: 0 }), towel: { a: 0.68, e: 0 }, boot: { a: 0.12, e: 0 },
  white: (P, n) => ({ a: n[1] > 0.5 ? 0.95 : 0.85, e: 0.3 }), hood: (P, n) => ({ a: 0.9, e: n[1] > 0.5 ? 0.2 : 0.3 }),
  stretcher: { a: 0.6, e: 0 }, canvas: { a: 0.5, e: 0 }, letter: { a: 0.9, e: 0.35 },
}
const world = (extra, day) => feedWorld({ prims: [...ROOM, ...extra], lights: [...NIGHT, ...(day ? DAY : [])],
  materials: { ...MATS, tube: { a: 0.4, e: day ? 1.0 : 0.05 }, floor: FLOOR }, ground: "floor", ambient: day ? 0.16 : 0.13, sky: 0.02, rain: 0 })
// the linoleum: big tiles, scuffed, worn pale down the middle of the aisle
function FLOOR(P) {
  const [x, , z] = P, seam = fr(z / 0.6) < 0.04 || fr(x / 0.6) < 0.04
  const worn = Math.abs(x) < 0.55 ? 0.05 * (1 - Math.abs(x) / 0.55) : 0
  return { a: (seam ? 0.13 : 0.19 + 0.03 * (fbm(x * 3, z * 1.5, 2) - 0.5)) + worn, e: 0, wet: 0.05, gloss: 0.3 }
}
const bake = (key, extra, day) => bakeFeed(CAM, world(extra, day), { exposure: day ? 0.95 : 2.5, key })

// ---------------------------------------------------------------- hand drawing on top
// the number 12 on its plate at Najo's bunk's near post, toward the aisle (the far wall's EXIT and DORM C lie on the picture's top
// edge, too small to letter: they stay light)
const words = (c) => {
  const [nx, ny] = at(CAM, [NX0 - 0.01, UP + 0.4, NZ + 0.03]); c.rect(nx - 6, ny - 3, 12, 7, "7"); TXT.draw(c, nx, ny - 2, "12", "1", { font: "hud", align: "center" })
}

// ================================================================ what the game needs (game/places.js cam51)
const NB = boxCorners([NX0, LOW, NZ], [NX1, TOP, NZ + BL])
const CAM51_LAYOUT = {
  mic: spotAt(CAM, [0, 1.0, NZ]),
  polys: {
    // Najo's bunk, both levels, as far as the lens sees it
    bunk: hullOf(CAM, NB, 1),
    // the left row, past the cameras' strip (the hall's bunks; his has its own)
    rows: hullOf(CAM, [...boxCorners([-HALL, 0, bunkZ(1)], [-HALL + BD, TOP, bunkZ(4)])], 0),
  },
}
console.log("CAM51_LAYOUT " + JSON.stringify(CAM51_LAYOUT))

// ================================================================ the scenes
// the dots behind the sleepers' ears, one bright pixel each where nothing stands before it: in the dark, rows of them
const dots = (key, extra, list) => (c) => { const b = bake(key, extra, false); for (const [s, i, y] of list) { const P = dotAt(s, i, y); pxBehind(c, b, CAM, P, "8", 1); pxBehind(c, b, CAM, P, "7", 0, -1); pxBehind(c, b, CAM, P, "9") } }
scene("cam51_bg", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam51", NOW, false)), words, dots("cam51", NOW, FULL))
scene("cam51_brief", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam51_brief", BRIEF, false)), words, dots("cam51_brief", BRIEF, FULL), najo)
scene("cam51_morgen", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam51_morgen", MORGEN, true)), words)
scene("cam51_traeger", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam51_traeger", TRAEGER, true)), words)
scene("review_cam51", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam51", NOW, false)), words, dots("cam51", NOW, FULL), (c) => reviewFx(c, W, H))
