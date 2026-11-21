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
// a sleeper under a blanket, the head at the far end on the pillow: the legs low, the hips and shoulders a hump. The head is painted
// on the pillow (heads(), at headAt), the dot behind the ear glows over it (dots(): the patch, on Lull)
const dotAt = (side, i, y) => { const x0 = side < 0 ? -HALL + 0.12 : HALL - BD + 0.12, xm = x0 + (BD - 0.24) / 2; return [xm + (side < 0 ? 0.1 : -0.1), y + 0.36, bunkZ(i) + BL - 0.26] }
const sleeper = (side, i, y) => {
  const z0 = bunkZ(i), x0 = side < 0 ? -HALL + 0.12 : HALL - BD + 0.12, x1 = x0 + BD - 0.24, xm = (x0 + x1) / 2, hz = z0 + BL - 0.3, turn = rnd(i, side + y, 8) > 0.5 ? 0.06 : -0.06
  return [block([x0 + 0.05, y + 0.08, z0 + 0.15], [x1 - 0.05, y + 0.2, z0 + 0.95], "blanket"), block([x0, y + 0.08, z0 + 0.9], [x1, y + 0.3, hz - 0.12], "blanket"),
    block([x0 + 0.02, y + 0.28, hz - 0.3], [x1 - 0.02, y + 0.32, hz - 0.12], "fold")]
}
const headAt = (side, i, y) => { const x0 = side < 0 ? -HALL + 0.12 : HALL - BD + 0.12, xm = x0 + (BD - 0.24) / 2, turn = rnd(i, side + y, 8) > 0.5 ? 0.06 : -0.06
  return [xm + turn, y + 0.3, bunkZ(i) + BL - 0.3] }
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
// the dot behind his ear still lit (the people painted: MORGEN_PEOPLE)
const STILL = [[1, NAJO, UP], ...FULL.filter((_, k) => k % 5 === 0)]
const MORGEN = STILL.flatMap(([s, i, y]) => sleeper(s, i, y))
// half past six: two in white, a stretcher between them in the aisle by his bunk, just past it toward the door under the camera, he lies on it under its blanket; the hall empty.
// The stretcher: its canvas, its two poles running out to handles at both ends, its legs folded under
const TX = 0.3, TZ0 = NZ + 0.8, TZ1 = TZ0 + BL + 0.4
const TRAEGER = [
  block([TX - 0.28, 0.76, TZ0 - 0.25], [TX - 0.22, 0.81, TZ1 + 0.25], "stretcher"), block([TX + 0.22, 0.76, TZ0 - 0.25], [TX + 0.28, 0.81, TZ1 + 0.25], "stretcher"),
  block([TX - 0.24, 0.74, TZ0], [TX + 0.24, 0.79, TZ1], "canvas"),
  block([TX - 0.2, 0.79, TZ0 + 0.3], [TX + 0.2, 0.97, TZ1 - 0.45], "blanket"), block([TX - 0.2, 0.95, TZ1 - 0.75], [TX + 0.2, 0.99, TZ1 - 0.45], "fold")]

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
  fold: { a: 0.75, e: 0 },
  shirt: (P) => ({ a: fr(P[1] * 8) < 0.5 ? 0.3 : 0.5, e: 0 }), towel: { a: 0.68, e: 0 }, boot: { a: 0.12, e: 0 },
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

// ================================================================ the people, painted (the user, 2026-11-21: no blocks for people)
// Each figure is drawn flat into a buffer of its own, its parts as shapes sized from its height in the picture (personPx at its feet),
// shaded by the light from the ceiling (the top of each part lighter, its edges darker, a seam where a part lies before another), then
// put into the picture pixel by pixel where nothing nearer stands (a post, a guard, the stretcher's end): the depth of the baked picture
// against the figure's own, row by row.
function figBuf(w, h) {
  const g = Array.from({ length: h }, () => Array(w).fill(null)), ord = {}
  const b = {
    w, h, g, ord,
    px(x, y, k) { x = Math.floor(x); y = Math.floor(y); if (x >= 0 && y >= 0 && x < w && y < h) { g[y][x] = k; if (!(k in ord)) ord[k] = Object.keys(ord).length } },
    // an oval round (cx, cy), pixel centres inside it
    ell(cx, cy, rx, ry, k) {
      for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
        if (((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1) b.px(x, y, k)
    },
    // a band from y0 down to y1, its middle and width running from (cx0, w0) to (cx1, w1): a body, a leg
    band(y0, y1, cx0, w0, cx1, w1, k) {
      for (let y = Math.floor(y0); y < Math.ceil(y1); y++) {
        const t = y1 > y0 ? clamp((y + 0.5 - y0) / (y1 - y0), 0, 1) : 0, cx = cx0 + (cx1 - cx0) * t, ww = Math.max(1, Math.round(w0 + (w1 - w0) * t))
        const x0 = Math.round(cx - ww / 2)
        for (let x = x0; x < x0 + ww; x++) b.px(x, y, k)
      }
    },
    // a limb: every pixel whose centre lies within wd/2 of the segment
    limb(x0, y0, x1, y1, wd, k) {
      const r = wd / 2, dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1
      for (let y = Math.floor(Math.min(y0, y1) - r); y <= Math.ceil(Math.max(y0, y1) + r); y++)
        for (let x = Math.floor(Math.min(x0, x1) - r); x <= Math.ceil(Math.max(x0, x1) + r); x++) {
          const t = clamp(((x + 0.5 - x0) * dx + (y + 0.5 - y0) * dy) / L2, 0, 1)
          if (Math.hypot(x + 0.5 - x0 - t * dx, y + 0.5 - y0 - t * dy) <= r) b.px(x, y, k)
        }
    },
  }
  return b
}
// what each part is in phosphor steps: lit (its top), mid, its shade, its outline
const PART = {
  H: [3, 2, 1, 0], h: [6, 5, 4, 2],             // hair dark, hair grey
  S: [7, 6, 5, 3],                              // skin
  L: [8, 7, 6, 4], D: [5, 4, 3, 1], M: [6, 5, 4, 2],   // shirts: light, dark, mid
  T: [4, 3, 2, 1], F: [2, 1, 1, 0],             // trousers, shoes and feet
  W: [9, 9, 8, 5], G: [9, 9, 8, 5], m: [8, 7, 6, 4],   // the carriers' coverall, their hoods and gloves, the soft mask under the chin
  O: [9, 9, 8, 5], o: [7, 7, 7, 5],             // the towel, its fold
  e: [2, 2, 2, 2], c: [9, 9, 9, 9],             // eyes, the clip on the chest (cyan in the street; in the feed the brightest)
}
const partOf = (p) => PART[p] || PART[p[0]]   // "Wa": an arm of the coverall, shaded as it, but a part of its own (a seam to the body)
// shade a figure's buffer into keys: each part lit at its top, darker at its edges, a seam where a part drawn later lies on it, the outline
function shadeFig(b, lift = 0) {
  const k = (v) => String(clamp(v + lift, 0, 9)), out = b.g.map((r) => r.slice())
  const part = (x, y) => (x < 0 || y < 0 || x >= b.w || y >= b.h ? null : b.g[y][x])
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) {
    const p = b.g[y][x]
    if (!p) continue
    const [lit, mid, dark, line] = partOf(p), around = [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy]) => part(x + dx, y + dy))
    let v = mid
    if (part(x, y - 1) !== p) v = lit                                                   // the light from above on the top of each part
    else if (part(x - 1, y) !== p || part(x + 1, y) !== p) v = dark                       // its sides turn away
    if (around.some((q) => q && q !== p && b.ord[q] > b.ord[p] && partOf(q) === partOf(p))) v = line   // a seam: the same cloth before it
    else if (around.some((q) => q && q !== p && b.ord[q] > b.ord[p])) v = Math.min(v, dark)
    if (around.some((q) => !q)) v = line                                                // the outline
    out[y][x] = k(v)
  }
  return out
}
const H_ = H
// put a figure into the picture: its feet (the buffer's bottom row, column ax) at the world point P; a row of the buffer stands at the
// height it has in the world, and its pixels go only where the picture shows nothing nearer
function putFig(c, baked, keys, P, ax, hm = 1.72, tol = 0.08) {
  const [fx, fy] = at(CAM, P), N = keys.length
  for (let j = 0; j < N; j++) {
    const Pw = [P[0], hm * (N - 1 - j) / (N - 1), P[2]], dist = Math.hypot(...sub(Pw, CAM.pos))
    for (let i = 0; i < keys[j].length; i++) {
      const v = keys[j][i], X = fx - ax + i, Y = fy - (N - 1) + j
      if (v == null || X < 0 || Y < 0 || X >= W || Y >= H_) continue
      if (baked.depth[Y][X] + tol < dist) continue
      c.px(X, Y, v)
    }
  }
}
// a shadow on the floor under the feet: the picture one step darker in a flat oval (the tubes are straight above)
function shadowAt(c, baked, P, rx) {
  const [x, y] = at(CAM, P), ry = Math.max(1, rx * 0.35)
  for (let j = -Math.ceil(ry); j <= Math.ceil(ry); j++) for (let i = -Math.ceil(rx); i <= Math.ceil(rx); i++) {
    if ((i / rx) ** 2 + (j / ry) ** 2 > 1) continue
    const X = x + i, Y = y + j
    if (X >= 0 && Y >= 0 && X < W && Y < H_) c.px(X, Y, PH[Math.max(0, baked.img[Y][X] - 1)])
  }
}

// A standing person from behind or the front, h pixels tall: the legs and shoes, the hips, the body, the arms with the hands, the neck,
// the head (the hair and the ears from behind, the face under the hair from the front). o: { front, shirt, hair, towel, step (the legs
// apart), reach: [x, y] where a hand holds something, relative to the feet's column and the top (one arm, on its side; both: the two),
// white: a carrier (the coverall, the close hood, the soft mask under the chin, white gloves, the clip on the chest) }
function standing(h, o = {}) {
  const sw = h * 0.27, w = Math.ceil(sw + h * 0.5) | 1, b = figBuf(w, h), X = w / 2
  const cloth = o.white ? "W" : o.shirt || "L", legs = o.white ? "Wl" : "T", sleeve = o.white ? "Wa" : o.sleeve || "S", hand = o.white ? "G" : "S"
  const hr = Math.max(1.4, h * 0.068), hy = hr + 0.2, sh = h * 0.175, waist = h * 0.52, armW = Math.max(1.5, h * 0.062), st = (o.step || 0) * h * 0.025
  for (const s of [-1, 1]) b.band(waist + h * 0.04, h * 0.955, X + s * h * 0.052, h * 0.095, X + s * (h * 0.058 + st), h * 0.07, legs)
  for (const s of [-1, 1]) b.ell(X + s * (h * 0.062 + st), h * 0.97, Math.max(1, h * 0.045), Math.max(0.8, h * 0.028), "F")
  b.band(waist - h * 0.02, waist + h * 0.09, X, sw * 0.86, X, sw * 0.84, legs + "h")                     // the hips
  b.band(sh + h * 0.02, waist, X, sw, X, sw * 0.86, cloth)                                              // the body
  b.ell(X, sh + h * 0.03, sw / 2, h * 0.035, cloth)                                                     // the shoulders, round
  for (const s of [-1, 1]) {
    const r = o.reach && (o.both || o.reach[0] * s > 0) ? o.reach : null
    const x1 = r ? X + s * Math.abs(r[0]) : X + s * (sw / 2 + armW * 0.15), y1 = r ? r[1] : h * 0.49
    b.limb(X + s * (sw / 2 - armW * 0.45), sh + h * 0.05, x1, y1, armW, sleeve)
    b.ell(x1, y1 + armW * 0.3, armW * 0.55, armW * 0.6, hand)
  }
  b.band(hy, sh + h * 0.04, X, hr * 1.0, X, hr * 1.1, o.white ? "G" : "S")                               // the neck
  if (o.white) {
    b.ell(X, hy, hr * 1.15, hr * 1.12, "G")                                                             // the close hood
    b.band(hy + hr * 0.6, sh + h * 0.045, X, hr * 1.9, X, sw * 0.7, "G")                                // falling onto the shoulders
    if (o.front) {
      b.ell(X, hy + hr * 0.2, hr * 0.68, hr * 0.72, "S")
      b.band(hy + hr * 0.75, hy + hr * 1.25, X, hr * 1.3, X, hr * 1.2, "m")
      if (h > 30) { b.px(X - hr * 0.35, hy + hr * 0.05, "e"); b.px(X + hr * 0.35, hy + hr * 0.05, "e"); b.px(X + sw * 0.22, sh + h * 0.09, "c") }
    }
  } else {
    for (const s of [-1, 1]) b.ell(X + s * hr * 0.95, hy + hr * 0.25, Math.max(0.6, hr * 0.28), Math.max(0.8, hr * 0.38), "S")  // the ears
    b.ell(X, hy, hr, hr * 1.05, o.hair || "H")
    if (o.front) {
      b.ell(X, hy + hr * 0.4, hr * 0.78, hr * 0.75, "S")
      if (h > 30) { b.px(X - hr * 0.38, hy + hr * 0.25, "e"); b.px(X + hr * 0.38, hy + hr * 0.25, "e") }
    }
  }
  // a towel over the left shoulder (from behind: the screen's left), hanging down the back, a fold along it
  if (o.towel) {
    const tx = X - sw * 0.24
    b.band(sh + h * 0.005, sh + h * 0.24, tx, sw * 0.34, tx + sw * 0.04, sw * 0.3, "O")
    b.band(sh + h * 0.04, sh + h * 0.24, tx + sw * 0.08, 1, tx + sw * 0.11, 1, "o")
  }
  return { keys: shadeFig(b, o.lift || 0), ax: Math.floor(X) }
}
// a figure where it stands, as tall as the lens sees it there, its shadow under it
const person51 = (c, baked, P, o, tol) => {
  const h = Math.round(personPx(CAM, P, 1.72)), f = standing(h, typeof o === "function" ? o(h) : o)
  shadowAt(c, baked, P, h * 0.13)
  putFig(c, baked, f.keys, P, f.ax, 1.72, tol)
}
// a hand at a world point (a carrier's at the stretcher's handle), relative to the figure's feet column and its buffer's top
const handAt = (Pfeet, Phand, h) => { const [fx, fy] = at(CAM, Pfeet), [x, y] = at(CAM, Phand); return [x - fx, y - fy + h - 1] }
const MORGEN_PEOPLE = (c) => {
  const b = bake("cam51_morgen", MORGEN, true)
  person51(c, b, [-HALL + 0.7, 0, 14.9], (h) => ({ shirt: "D", reach: [-h * 0.3, h * 0.24] }))   // at his locker, opening it
  person51(c, b, [-0.2, 0, 11.5], { shirt: "L", hair: "h" })
  person51(c, b, [0.3, 0, 7.5], { front: true, shirt: "D", step: 1 })
  person51(c, b, [-0.4, 0, 4.4], { shirt: "M", towel: true })
}
const TRAEGER_PEOPLE = (c) => {
  const b = bake("cam51_traeger", TRAEGER, true)
  // the one at the far end faces the lens, his hands on the handles before him; the near one has his back to it, his hands on the
  // handles beyond him
  const far = [TX, 0, TZ1 + 0.35], near = [TX, 0, TZ0 - 0.35]
  person51(c, b, far, (h) => ({ white: true, front: true, both: true, reach: handAt(far, [TX + 0.25, 0.8, TZ1 + 0.22], h) }), 0.02)
  person51(c, b, near, (h) => ({ white: true, both: true, reach: handAt(near, [TX + 0.25, 0.8, TZ0 - 0.22], h) }), 0.02)
}
// the heads on the pillows: the hair, and toward the aisle (where the dot glows) the ear and a bit of the cheek; sized by the lens
const HEAD_HAIR = (s, i, y) => (rnd(i, s + y * 3, 9) > 0.75 ? "h" : "H")
function heads(baked, list, lift) {
  return (c) => { for (const [s, i, y] of list) {
    const P = headAt(s, i, y), a = project(CAM, add(P, [-0.11, 0, 0])), z = project(CAM, add(P, [0.11, 0, 0])), wd = Math.hypot(z[0] - a[0], z[1] - a[1])
    const rx = Math.max(1, wd / 2), ry = Math.max(0.9, rx * 0.82), n = Math.ceil(rx) * 2 + 2, b = figBuf(n, n), m = n / 2
    const aisle = s < 0 ? 1 : -1
    if (rx > 2.2) b.ell(m + aisle * rx * 0.62, m + ry * 0.3, Math.max(0.7, rx * 0.32), Math.max(0.8, ry * 0.42), "S")
    b.ell(m, m, rx, ry, HEAD_HAIR(s, i, y))
    if (rx > 2.2) b.ell(m + aisle * rx * 0.7, m + ry * 0.45, Math.max(0.6, rx * 0.25), Math.max(0.7, ry * 0.35), "S")
    const keys = shadeFig(b, lift), [x, yy] = at(CAM, P), dist = Math.hypot(...sub(P, CAM.pos))
    for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
      const v = keys[j][k], X = x - Math.floor(m) + k, Y = yy - Math.floor(m) + j
      if (v == null || X < 0 || Y < 0 || X >= W || Y >= H_ || baked.depth[Y][X] + 0.25 < dist) continue
      c.px(X, Y, v)
    }
  } }
}
// Najo on the stretcher: his face up, the hair toward the far end, the dot behind his ear
const NAJO_LYING = (c) => {
  const b = bake("cam51_traeger", TRAEGER, true), [x, y] = at(CAM, [TX, 0.9, TZ1 - 0.25])
  const rows = ["..222..", ".22222.", "2655562", "5545455", "5556555", ".55555.", "..555.."]
  rows.forEach((r, j) => [...r].forEach((v, i) => { if (v !== ".") c.px(x - 3 + i, y - 3 + j, v) }))
  pxBehind(c, b, CAM, [TX + 0.1, 0.95, TZ1 - 0.21], "9")
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
// the night: the picture, the heads on the pillows, the dots behind the ears over them
const night = (key, extra) => [(c) => paintFeed(c, bake(key, extra, false)), words, (c) => heads(bake(key, extra, false), FULL, -1)(c), dots(key, extra, FULL)]
scene("cam51_bg", { w: W, h: H, bg: "0" }, ...night("cam51", NOW))
scene("cam51_brief", { w: W, h: H, bg: "0" }, ...night("cam51_brief", BRIEF), najo)
scene("cam51_morgen", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam51_morgen", MORGEN, true)), words, (c) => heads(bake("cam51_morgen", MORGEN, true), STILL, 0)(c),
  (c) => { const b = bake("cam51_morgen", MORGEN, true); for (const [s, i, y] of STILL) pxBehind(c, b, CAM, dotAt(s, i, y), "9") }, MORGEN_PEOPLE)
scene("cam51_traeger", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam51_traeger", TRAEGER, true)), words, NAJO_LYING, TRAEGER_PEOPLE)
scene("review_cam51", { w: W, h: H, bg: "0" }, ...night("cam51", NOW), (c) => reviewFx(c, W, H))
