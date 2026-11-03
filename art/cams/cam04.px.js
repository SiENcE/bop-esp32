// CAM 04, Imbiss Yuen: a tiny late-night diner, seen from its ceiling. Feed mode, 320x180, the
// phosphor ramp only (style guide §9).
// The camera sits in the ceiling over the front wall (3.3 m up, 52 degrees down, a wide 2.8 mm
// lens with a strong barrel). At the back the counter with the cook's station (stove, pots, the
// hood) and stools; on the back wall the menu boards and, on a shelf in the right corner, a TV
// running a Halcyon ad (the brightest thing in the room). On the left the window to the street,
// rain on the glass and neon behind it, and the door at its far end. Four small tables with
// stools; the near one, right under the camera, is where Kessler and Varga will sit (left empty).
// Prologue (docs/kapitel0-design.md §6.2 steps 7-8): 22:30 Kessler sits down with Varga; 22:35 the
// ring; 22:45 Varga leaves.
// Built from a blockout in meters (art/lib/feed.js); the geometry the game needs is measured from
// the same camera at the end of this file (docs/cams/cam04_layout.md).
include("../lib/feed.js")
pal({ ...PHOSPHOR, C: "#3ff2ff", c: "#1a8fa0", Y: "#ffd83a", R: "#ff2a3c" })   // C c Y R: review images only
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [1.2, 3.3, -0.3], yaw: -8, pitch: 52, F: 105, w: W, h: H, k: 0.22 })
const AT = (P) => at(CAM, P)

// ================================================================ the place, in meters
// x across the room (right), y up, z into it. The front wall (under the camera) is z = 0.
const XL = -3.0, XRW = 3.0, ZB = 5.6, CEIL = 3.4
const COUNTER = { x0: -0.4, x1: XRW, z0: 3.75, z1: 4.3, y: 1.05 }   // the counter, along the back
const STOVE = { x0: 0.4, x1: 2.6, z0: 5.0, z1: ZB, y: 0.9 }         // the cook's station against the back wall
const HOOD = { x0: 0.3, x1: 2.7, z0: 4.95, z1: ZB, y0: 2.05, y1: 2.5 }
const TV = { x: XRW - 0.07, z0: 2.3, z1: 3.3, y0: 1.75, y1: 2.3 }   // on the right wall, high, facing the room
const FRIDGE = { x: XRW - 0.6, z0: 1.15, z1: 2.05, y: 1.8 }        // a drinks fridge with a lit glass door, under it
const WIN = { z0: 0.5, z1: 4.0, y0: 0.9, y1: 2.5 }                  // the window to the street, in the left wall
const DOOR = { z0: 4.3, z1: 5.2, y1: 2.2 }                          // the door, at the window's far end
const MENU = { x0: -0.2, x1: 2.0, y0: 2.6, y1: 3.2 }                 // menu boards over the hood
// four small tables (0.7 m square), each with two stools (near and far side)
const TABLES = [
  { id: "near", x: 0.75, z: 1.45 },                                 // under the camera: Kessler and Varga
  { id: "win1", x: -2.2, z: 1.3 },
  { id: "win2", x: -2.2, z: 2.75 },
  { id: "mid", x: -0.75, z: 2.6 },
]
const TS = 0.35, TY = 0.74                                          // half size, height
const STOOLS = TABLES.flatMap((t) => [{ t: t.id, side: "near", x: t.x, z: t.z - 0.62 }, { t: t.id, side: "far", x: t.x, z: t.z + 0.62 }])
const BAR_STOOLS = [0.2, 0.95, 1.7, 2.45].map((x) => ({ x, z: COUNTER.z0 - 0.4 }))

const PRIMS = [
  block([XL - 1, -1, -1], [XRW + 1, 0, ZB + 1], "floor"),
  block([XL - 1, 0, -1], [XL, CEIL, ZB + 1], "lwall"),
  block([XRW, 0, -1], [XRW + 1, CEIL, ZB + 1], "rwall"),
  block([XL - 1, 0, ZB], [XRW + 1, CEIL, ZB + 1], "bwall"),
  block([COUNTER.x0, 0, COUNTER.z0], [COUNTER.x1, COUNTER.y, COUNTER.z1], "counter"),
  block([COUNTER.x0 - 0.02, COUNTER.y, COUNTER.z0 - 0.05], [COUNTER.x1, COUNTER.y + 0.04, COUNTER.z1 + 0.02], "countertop"),
  block([COUNTER.x0, 0, COUNTER.z1], [COUNTER.x0 + 0.5, COUNTER.y, ZB], "counter"),           // the counter's return to the back wall
  block([STOVE.x0, 0, STOVE.z0], [STOVE.x1, STOVE.y, STOVE.z1], "stove"),
  block([STOVE.x1 + 0.05, 0, STOVE.z0 + 0.1], [XRW, 0.95, ZB], "fridge"),                     // a low fridge, the rice cooker on it
  cyl(STOVE.x1 + 0.4, ZB - 0.25, 0.16, 0.95, 1.25, "pot"),
  block([HOOD.x0, HOOD.y0, HOOD.z0], [HOOD.x1, HOOD.y1, HOOD.z1], "hood"),
  cyl(0.85, STOVE.z0 + 0.3, 0.24, STOVE.y, STOVE.y + 0.32, "pot"),                            // the stock pot
  cyl(1.6, STOVE.z0 + 0.3, 0.2, STOVE.y, STOVE.y + 0.12, "wok"),
  cyl(2.25, STOVE.z0 + 0.3, 0.17, STOVE.y, STOVE.y + 0.22, "pot"),
  block([TV.x, TV.y0, TV.z0], [XRW, TV.y1, TV.z1], "tv"),
  block([FRIDGE.x, 0, FRIDGE.z0], [XRW, FRIDGE.y, FRIDGE.z1], "drinks"),
  block([XL, 0, 0], [XL + 0.12, 0.9, WIN.z1], "sill"),                                           // under the window, a narrow ledge
  block([XL, 0.86, WIN.z0], [XL + 0.3, 0.9, WIN.z1], "ledge"),
  // the counter's top: bowls, a napkin box, the register
  cyl(0.1, COUNTER.z0 + 0.25, 0.09, COUNTER.y + 0.04, COUNTER.y + 0.1, "bowl"),
  cyl(1.35, COUNTER.z0 + 0.22, 0.09, COUNTER.y + 0.04, COUNTER.y + 0.1, "bowl"),
  block([2.5, COUNTER.y + 0.04, COUNTER.z0 + 0.1], [2.85, COUNTER.y + 0.3, COUNTER.z0 + 0.4], "register"),
]
for (const t of TABLES) {
  PRIMS.push(block([t.x - TS, TY - 0.04, t.z - TS], [t.x + TS, TY, t.z + TS], "table", { table: t.id }))
  PRIMS.push(cyl(t.x, t.z, 0.05, 0, TY - 0.04, "leg"))
  PRIMS.push(cyl(t.x, t.z, 0.22, 0, 0.03, "leg"))
}
for (const s of [...STOOLS, ...BAR_STOOLS]) {
  const bar = s.t === undefined, h = bar ? 0.72 : 0.46
  PRIMS.push(cyl(s.x, s.z, 0.17, h - 0.05, h, "seat"))
  PRIMS.push(cyl(s.x, s.z, 0.035, 0, h - 0.05, "leg"))
}

const LIGHTS = [
  ...TABLES.map((t) => ({ p: [t.x, CEIL - 0.25, t.z], I: 0.95, R: 2.0, shadow: true })),        // a flush lamp over each table
  { p: [1.3, 2.0, 4.5], I: 1.0, R: 2.2, shadow: true },                                           // the strip under the hood, over the stove and counter
  { p: [0.1, 2.6, 4.0], I: 0.6, R: 2.0 },
  { p: [TV.x - 1.0, 1.7, (TV.z0 + TV.z1) / 2], I: 0.45, R: 1.6 },                                  // the TV's glow
  { p: [FRIDGE.x - 0.3, 1.0, (FRIDGE.z0 + FRIDGE.z1) / 2], I: 0.45, R: 1.4 },                      // the fridge's
  { p: [XL + 0.4, 1.7, 1.5], I: 0.55, R: 2.2 },                                                    // neon from the street through the window
  { p: [XL + 0.4, 1.7, 3.4], I: 0.45, R: 2.2 },
]

// ---------------------------------------------------------------- materials
const wetFloor = (x, z) => {
  // wet footprints from the door to the counter and the tables: a few dark-bright smears
  const d = Math.abs((z - 4.6) * 0.6 + (x + 2.5) * 0.3) < 0.35 && x < -0.5 && z > 2.6
  return d ? clamp((fbm(x * 4, z * 4, 2) - 0.45) * 5, 0, 0.8) : 0
}
const MATS = {
  floor: (P) => {
    const [x, , z] = P
    // a worn linoleum check, 0.3 m, lighter where the feet go
    const chk = (Math.floor(x / 0.3) + Math.floor(z / 0.3)) & 1
    let a = 0.26 + (chk ? 0.05 : 0) + 0.05 * (fbm(x * 2, z * 2, 2) - 0.5)
    if (z > COUNTER.z1 && x > COUNTER.x0) a = 0.2 + 0.05 * ((Math.floor(x / 0.2) + Math.floor(z / 0.2)) & 1)   // the kitchen's floor, a grid of tiles
    return { a, e: 0, wet: wetFloor(x, z), gloss: 0.1 }
  },
  lwall: (P, n) => {
    const [, y, z] = P
    if (z > WIN.z0 && z < WIN.z1 && y > WIN.y0 && y < WIN.y1) {
      // the window: the street's neon blurred behind the glass, rain running down it, two mullions
      if (Math.abs(z - (WIN.z0 + WIN.z1) / 2) < 0.04 || WIN.z1 - z < 0.05 || z - WIN.z0 < 0.05 || y - WIN.y0 < 0.05 || WIN.y1 - y < 0.05) return { a: 0.4, e: 0 }
      let e = 0.18 + 0.12 * vnoise(z * 1.5, y * 1.5)
      const sign = Math.hypot((z - 1.4) / 0.9, (y - 1.9) / 0.35)                                   // a sign across the street (magenta in colour)
      if (sign < 1) e = 0.85 - 0.3 * sign
      const sign2 = Math.hypot((z - 3.2) / 0.35, (y - 1.6) / 0.6)                                  // a vertical one, cyan
      if (sign2 < 1) e = Math.max(e, 0.7 - 0.3 * sign2)
      const col = Math.floor(z * 22), streak = ih(col, 0, 7) < 0.22 && ((y * 3 + ih(col, 1, 8) * 3) % 1) < 0.6
      if (streak) e *= 0.55                                                                         // rain running down the glass
      if (ih(Math.floor(z * 30), Math.floor(y * 30), 9) < 0.04) e += 0.3                             // drops
      return { a: 0, e }
    }
    if (z > DOOR.z0 && z < DOOR.z1 && y < DOOR.y1) {
      if (DOOR.z1 - z < 0.06 || z - DOOR.z0 < 0.06 || DOOR.y1 - y < 0.06) return { a: 0.45, e: 0 }
      if (y > 1.0 && y < 2.0 && z > DOOR.z0 + 0.15 && z < DOOR.z1 - 0.15) return { a: 0, e: 0.4 }   // its glass, the street beyond
      return { a: 0.3, e: 0 }
    }
    return wallTiles(y, z)
  },
  rwall: (P) => wallTiles(P[1], P[2]),
  bwall: (P) => {
    const [x, y] = P
    if (y > MENU.y0 && y < MENU.y1 && x > MENU.x0 && x < MENU.x1) {
      // three lit menu boards: rows of dishes as dashes
      const bx = (x - MENU.x0) / ((MENU.x1 - MENU.x0) / 3), bi = Math.floor(bx), fx = bx % 1
      if (fx < 0.06 || fx > 0.94) return { a: 0.1, e: 0 }
      const row = (y - MENU.y0) / 0.1
      return { a: 0, e: (row % 1) < 0.45 && fx > 0.12 && fx < 0.12 + 0.6 * ih(bi, Math.floor(row), 3) + 0.2 ? 0.85 : 0.5 }
    }
    return wallTiles(y, x)
  },
  counter: (P, n) => {
    if (n[1] > 0) return { a: 0.5, e: 0 }
    return { a: 0.3 + ((Math.floor(P[0] * 3.3) & 1) ? 0.05 : 0) * (n[2] < 0 ? 1 : 0), e: 0 }   // panelled front
  },
  countertop: (P, n) => ({ a: n[1] > 0 ? 0.5 : 0.45, e: 0, wet: n[1] > 0 ? 0 : undefined, gloss: 0.15 }),
  stove: (P, n) => {
    if (n[1] <= 0) return { a: 0.3, e: 0 }
    const [x, , z] = P
    return { a: 0.42 - ((Math.floor(x * 6) + Math.floor(z * 6)) & 1) * 0.1, e: 0 }                // steel, a grate
  },
  fridge: (P, n) => ({ a: n[1] > 0 ? 0.5 : 0.42, e: 0 }),
  hood: (P, n) => ({ a: n[1] > 0 ? 0.3 : 0.45, e: n[1] < 0 ? 0.3 : 0 }),
  pot: (P, n) => ({ a: n[1] > 0 ? 0.25 : 0.55, e: n[1] > 0 ? 0.15 : 0 }),                       // dark broth inside, steel outside
  wok: (P, n) => ({ a: n[1] > 0 ? 0.15 : 0.3, e: 0 }),
  drinks: (P, n) => {
    if (n[0] > -0.5) return { a: n[1] > 0 ? 0.45 : 0.35, e: 0 }
    const [, y, z] = P, u = (z - FRIDGE.z0) / (FRIDGE.z1 - FRIDGE.z0), v = y / FRIDGE.y
    if (u < 0.08 || u > 0.92 || v < 0.12 || v > 0.94) return { a: 0.4, e: 0 }
    if ((v * 5) % 1 < 0.12) return { a: 0, e: 0.3 }                                                 // shelves
    return { a: 0, e: (Math.floor(u * 9) & 1) ? 0.75 : 0.5 }                                        // bottles in a row, lit from inside
  },
  tv: (P, n) => {
    if (n[0] > -0.5) return { a: 0.15, e: 0 }
    const [, y, z] = P, u = (z - TV.z0) / (TV.z1 - TV.z0), v = (TV.y1 - y) / (TV.y1 - TV.y0)
    if (u < 0.06 || u > 0.94 || v < 0.08 || v > 0.92) return { a: 0.08, e: 0 }                   // the bezel
    // the Halcyon ad: a pale wash, a sleeping face (an oval, closed eyes), the logo ring in a corner
    let e = 0.95 + 0.1 * v
    const fx = (u - 0.38) / 0.2, fy = (v - 0.5) / 0.34
    if (fx * fx + fy * fy < 1) e = 1.4
    if (Math.abs(fy + 0.05) < 0.12 && Math.abs(Math.abs(fx) - 0.4) < 0.2) e = 0.25                // closed eyes
    if (Math.abs(fy - 0.5) < 0.1 && Math.abs(fx) < 0.3) e = 0.4                                     // a smile
    const rx = (u - 0.8) / 0.09, ry = (v - 0.3) / 0.15, rr = Math.hypot(rx, ry)
    if (rr > 0.5 && rr < 1) e = 1.4                                                                   // the Halcyon ring
    if (v > 0.8) e = 1.2                                                                              // the caption band
    return { a: 0, e }
  },
  sill: { a: 0.3, e: 0 },
  ledge: { a: 0.45, e: 0 },
  bowl: (P, n) => ({ a: n[1] > 0 ? 0.7 : 0.55, e: 0 }),
  register: (P, n) => ({ a: 0.25, e: n[2] < 0 && P[1] > COUNTER.y + 0.18 ? 0.5 : 0 }),
  table: (P, n) => ({ a: n[1] > 0 ? 0.44 : 0.3, e: 0, wet: n[1] > 0 ? 0 : undefined, gloss: 0.12 }),   // formica
  leg: { a: 0.35, e: 0 },
  seat: (P, n) => ({ a: n[1] > 0 ? 0.48 : 0.28, e: 0 }),
}
// white tiles to 1.2 m, a dark rail, greasy paint above
function wallTiles(y, s) {
  if (y < 1.2) { const j = ((s / 0.15) % 1 < 0.08) || ((y / 0.15) % 1 < 0.08); return { a: j ? 0.32 : 0.46, e: 0 } }
  if (y < 1.27) return { a: 0.2, e: 0 }
  return { a: 0.3 * (0.85 + 0.25 * vnoise(s * 2, y * 3)), e: 0 }
}

const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ground: null, ambient: 0.16, sky: 0.02, rain: 0 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.2, key: "cam04" })

// ================================================================ the layout for the game (docs/cams/cam04_layout.md)
const BOTTOM = groundAt(CAM, W / 2, H)
const near = TABLES[0]
const seat = (side) => STOOLS.find((s) => s.t === "near" && s.side === side)
const LAYOUT = {
  walk: [
    groundPoly(CAM, [[XL + 0.35, BOTTOM[2] - 2], [XRW - 0.3, BOTTOM[2] - 2], [XRW - 0.3, COUNTER.z0 - 0.15], [COUNTER.x0 - 0.15, COUNTER.z0 - 0.15], [COUNTER.x0 - 0.15, ZB - 0.25], [XL + 0.35, ZB - 0.25]]),   // the dining room
    groundPoly(CAM, [[COUNTER.x0 + 0.6, COUNTER.z1 + 0.1], [STOVE.x1 + 0.1, COUNTER.z1 + 0.1], [STOVE.x1 + 0.1, STOVE.z0 - 0.1], [COUNTER.x0 + 0.6, STOVE.z0 - 0.1]]),   // behind the counter: the cook
  ],
  holes: [
    ...TABLES.map((t) => groundPoly(CAM, [[t.x - TS, t.z - TS + 0.1], [t.x + TS, t.z - TS + 0.1], [t.x + TS, t.z + TS], [t.x - TS, t.z + TS]])),
    groundPoly(CAM, [[FRIDGE.x - 0.25, FRIDGE.z0 - 0.1], [XRW, FRIDGE.z0 - 0.1], [XRW, FRIDGE.z1 + 0.1], [FRIDGE.x - 0.25, FRIDGE.z1 + 0.1]]),   // the fridge
  ],
  spots: {
    entrance: spotAt(CAM, [XL + 0.5, 0, (DOOR.z0 + DOOR.z1) / 2]),
    seatVarga: spotAt(CAM, [seat("near").x, 0, seat("near").z]),       // the near stool: nearest the camera (clear)
    seatKessler: spotAt(CAM, [seat("far").x, 0, seat("far").z]),       // across the table (muffled)
    counter: spotAt(CAM, [1.3, 0, COUNTER.z0 - 0.4]),                  // at the counter, a bar stool
    cook: spotAt(CAM, [1.5, 0, COUNTER.z1 + 0.35]),                     // behind it, at the stove
    win1: spotAt(CAM, [TABLES[1].x, 0, TABLES[1].z + 0.62]),
    win2: spotAt(CAM, [TABLES[2].x, 0, TABLES[2].z + 0.62]),
    mid: spotAt(CAM, [TABLES[3].x, 0, TABLES[3].z + 0.62]),
  },
  scale: depthScale(CAM, [0.5, 0, COUNTER.z0 - 0.3], [near.x, 0, BOTTOM[2] + 0.3]),
  hotspots: {
    tv: rectOf(CAM, boxCorners([TV.x, TV.y0, TV.z0], [XRW, TV.y1, TV.z1]), 1),
    counter: rectOf(CAM, boxCorners([COUNTER.x0, 0, COUNTER.z0], [COUNTER.x1, COUNTER.y + 0.3, COUNTER.z1]), 0),
    table: rectOf(CAM, boxCorners([near.x - TS - 0.2, 0, near.z - TS - 0.45], [near.x + TS + 0.2, TY, near.z + TS + 0.45]), 0),
  },
}
// the mic in the ceiling over the near table, toward Varga's side: Varga clear, Kessler muffled
LAYOUT.mic = { at: spotAt(CAM, [near.x, 0, near.z - 0.45]), clear: 20, lost: 80 }
LAYOUT.check = Object.fromEntries(Object.entries(LAYOUT.spots).map(([k, [x, y]]) => [k, { dist: Math.round(Math.hypot(x - LAYOUT.mic.at[0], y - LAYOUT.mic.at[1])) }]))

// ================================================================ the scenes
scene("cam04_bg", { w: W, h: H, bg: "0" },
  (c) => paintFeed(c, BAKE()),
)

// ---------------------------------------------------------------- review images (not shipped: the atlas takes cam* only)
scene("review_cam04", { w: W, h: H, bg: "0" },
  (c) => paintFeed(c, BAKE()),
  (c) => {
    const sc = LAYOUT.scale, sAt = (y) => sc.far[1] + (sc.near[1] - sc.far[1]) * clamp((y - sc.far[0]) / (sc.near[0] - sc.far[0]), 0, 1)
    for (const k of ["seatKessler", "cook", "win2"]) { const [x, y] = LAYOUT.spots[k]; standIn(c, x, y, Math.round(24 * sAt(y))) }
  },
  (c) => reviewFx(c, W, H),
)
scene("review_cam04_layout", { w: W, h: H, bg: "0" },
  (c) => { const { img } = BAKE(); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PH[Math.max(0, img[y][x] - 3)]) },
  (c) => drawLayout(c, LAYOUT),
)
