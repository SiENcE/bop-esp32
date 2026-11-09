// CAM 18, Alter Fischmarkt: the stairs from the square down to the old fish market, seen from above. Feed mode, 320x180, the
// phosphor ramp only (style guide §9). The user chose this view from three (art/mockups/cam18_study.px.js, variant C, 2026-11-09).
// The camera hangs high on a lamp post at the head of the stairs, 12 m over the square, looking almost straight down and a little
// crooked (the rain comes from the left). On top the square's wet slabs, the stairs going down toward us between two walls with
// railings, the landing at their foot and the market's tarps on both sides below. Over the steps a big fish painted long ago,
// worn, broken by every step's edge: whole only from up here (from below it is strokes on steps), so whoever saw it as a fish
// saw it from this camera (Frau Imai, kapitel1-design, "Die Frau, die sich erinnert"). FISH painted under its tail on the landing.
// The lamp's arm out of focus in the top left corner. Built from a blockout in meters (art/lib/feed.js); the hotspots are measured
// from the same camera at the end of this file (printed when built: CAM18_LAYOUT).
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [0.5, 12.0, 2.2], yaw: -7, pitch: 84, F: 225, w: W, h: H, k: 0.16 })

// ================================================================ the place, in meters
// x right, y up (the square is y = 0), z away. The stairs run down toward us, from the square's edge at z = Z0 to the landing.
const SW = 1.7                                  // half the stairs' width
const Z0 = 6.0, STEPS = 12, TREAD = 0.42, RISE = 0.25
const ZL = Z0 - STEPS * TREAD                   // the landing begins (the foot of the stairs)
const YL = -STEPS * RISE                        // the landing's and the market's floor
const WALL = 0.32                               // the walls beside the stairs, their coping
const FISH = { x: 0, z: (Z0 + ZL) / 2 + 0.25, len: 5.2, w: 1.0 }   // the painted fish: head toward the square, tail toward the market

const PRIMS = [
  // the square, cut by the stair well; its edge over the market on both sides at z = 2.4
  block([-14, -4, 2.4], [-SW - WALL, 0, 22], "square"),
  block([SW + WALL, -4, 2.4], [14, 0, 22], "square"),
  block([-SW - WALL, -4, Z0], [SW + WALL, 0, 22], "square"),
  // the walls beside the stairs, their tops the coping, down to the landing
  block([-SW - WALL, -4, ZL - 0.6], [-SW, 0, Z0], "wall"),
  block([SW, -4, ZL - 0.6], [SW + WALL, 0, Z0], "wall"),
  // the landing, the market's floor beyond
  block([-SW, -4, -8], [SW, YL, ZL], "landing"),
  block([-14, -5, -8], [-SW - WALL, YL, 2.4], "market"),
  block([SW + WALL, -5, -8], [14, YL, 2.4], "market"),
  // the market's stalls under their tarps, on both sides below the square's edge
  block([-6.2, YL, -2.6], [-3.9, YL + 2.2, 2.0], "tarp", { stall: 0 }),
  block([-3.7, YL, -2.0], [-2.3, YL + 2.0, 1.6], "tarp", { stall: 1 }),
  block([2.3, YL, -2.2], [3.9, YL + 2.1, 1.8], "tarp", { stall: 2 }),
  block([4.1, YL, -2.8], [6.4, YL + 2.3, 2.0], "tarp", { stall: 3 }),
]
for (let i = 0; i < STEPS; i++) PRIMS.push(block([-SW, -4, Z0 - (i + 1) * TREAD], [SW, -(i + 1) * RISE, Z0 - i * TREAD], "step", { i }))
// the railings on the walls: posts and a rail, and along the square's edge over the market
for (const x of [-SW - WALL / 2, SW + WALL / 2]) {
  for (let z = ZL - 0.4; z <= Z0 + 0.01; z += 0.9) PRIMS.push(cyl(x, z, 0.035, 0, 1.0, "rail"))
  PRIMS.push(block([x - 0.03, 0.96, ZL - 0.4], [x + 0.03, 1.02, Z0], "rail"))
}
for (const [x0, x1] of [[-9, -SW - WALL], [SW + WALL, 9]]) {
  for (let x = x0; x <= x1 + 0.01; x += 1.1) PRIMS.push(cyl(x, 2.45, 0.035, 0, 1.0, "rail"))
  PRIMS.push(block([x0, 0.96, 2.42], [x1, 1.02, 2.48], "rail"))
}
// on the square: a bin and a bollard, an old crate somebody left
PRIMS.push(cyl(-3.4, 7.4, 0.3, 0, 0.9, "bin"), cyl(2.6, 6.6, 0.12, 0, 0.8, "rail"), block([3.4, 0, 8.2], [4.1, 0.4, 8.7], "crate"))

const LIGHTS = [
  { p: [0.9, 10.8, 3.0], I: 1.7, R: 15, shadow: true },          // the lamp the camera hangs on
  { p: [0, YL + 1.8, 0.2], I: 0.55, R: 3.2 },                    // the market's light at the stairs' foot
  { p: [-4.6, YL + 2.6, 0], I: 0.4, R: 3.0 },                    // a bulb over a stall, its light on the tarps
  { p: [4.8, 2.0, 10.5], I: 0.5, R: 4.5 },                       // a shop's window on the square, beyond the picture
]

// ---------------------------------------------------------------- materials
const fishAt = (x, z) => {
  // a fish lying along z, its head toward the square: an ellipse and a forked tail toward the market
  const u = (FISH.z - z), v = x - FISH.x, a = FISH.len * 0.36, h = FISH.w
  if ((u / a) ** 2 + (v / h) ** 2 < 1) return true
  const t = u - a * 0.82, T = FISH.len * 0.24
  return t > 0 && t < T && Math.abs(v) < 0.1 + t * 0.9 && !(t > T * 0.55 && Math.abs(v) < (t - T * 0.55) * 1.3)
}
// its eye and the gill's arc behind the head, left unpainted
const fishEye = (x, z) => Math.hypot(x - FISH.x + 0.32, z - (FISH.z + FISH.len * 0.25)) < 0.16 ||
  Math.abs(Math.hypot((x - FISH.x) / FISH.w, (z - FISH.z - FISH.len * 0.05) / 1.0) - 1.05) < 0.06 && z > FISH.z + FISH.len * 0.1
const worn = (x, z) => fbm(x * 3, z * 3, 3) > 0.3 && ih(Math.floor(x * 24), Math.floor(z * 24), 5) > 0.1
const slabs = (x, z, s = 0.6) => ((x / s) % 1 + 1) % 1 < 0.05 || ((z / s) % 1 + 1) % 1 < 0.05
const puddle = (x, z) => clamp((fbm(x * 0.7 + 3, z * 0.7, 3) - 0.55) * 4, 0, 0.85)
const MATS = {
  square: (P, n) => {
    if (n[1] <= 0) return { a: 0.2, e: 0 }                                              // the well's sides (hidden under the walls)
    const [x, , z] = P
    return { a: slabs(x, z) ? 0.24 : 0.3 + 0.06 * (fbm(x, z, 2) - 0.5), e: 0, wet: puddle(x, z), gloss: 0.2 }
  },
  wall: (P, n) => (n[1] > 0 ? { a: 0.46, e: 0, wet: 0.1 } : { a: 0.22 + 0.04 * vnoise(P[1] * 3, P[2] * 3), e: 0 }),
  step: (P, n, f, hit) => {
    const [x, y, z] = P
    if (n[1] <= 0) return { a: 0.18, e: 0 }                                              // the risers
    const i = hit.prim.i, front = Z0 - (i + 1) * TREAD, nose = z - front < 0.05
    if (nose) return { a: 0.5, e: 0 }                                                    // the worn edge, lighter
    if (fishAt(x, z) && worn(x, z) && z - front > 0.08) return { a: fishEye(x, z) ? 0.16 : 0.78, e: 0, wet: 0.05 }
    return { a: 0.24 + 0.05 * (fbm(x * 2, z * 2, 2) - 0.5) - i * 0.006, e: 0, wet: puddle(x * 2, z * 2) * 0.4 }
  },
  landing: (P) => {
    const [x, , z] = P
    if (fishAt(x, z) && worn(x, z)) return { a: 0.62, e: 0 }
    return { a: slabs(x, z, 0.5) ? 0.18 : 0.27, e: 0, wet: puddle(x + 7, z), gloss: 0.15 }
  },
  market: { a: 0.2, e: 0 },
  tarp: (P, n, f, hit) => {
    if (n[1] <= 0) return { a: 0.2, e: 0 }
    const [x, , z] = P, rib = ((x * 4) % 1 + 1) % 1 < 0.3, s = hit.prim.stall
    return { a: (rib ? 0.36 : 0.44) - (s % 2) * 0.06 + 0.05 * (fbm(x, z, 2) - 0.5), e: 0, wet: 0.15 }
  },
  rail: { a: 0.5, e: 0 },
  bin: (P, n) => ({ a: n[1] > 0 ? 0.15 : 0.4, e: 0 }),
  crate: (P, n) => ({ a: n[1] > 0 ? (((P[0] * 6) % 1) < 0.2 ? 0.3 : 0.48) : 0.35, e: 0 }),
}

const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ground: null, ambient: 0.14, sky: 0.02, rain: 1 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.25, key: "cam18" })

// ---------------------------------------------------------------- hand drawing on top
// FISH painted under the tail on the landing, worn like the fish
const fishWord = (c) => {
  const [x, y] = at(CAM, [FISH.x, YL, ZL - 0.3])
  console.log("CAM18_FISHWORD " + x + "," + y)
  TXT.draw(c, x, Math.min(y - 3, H - 9), "FISH", "9", { font: "hud", align: "center" })
}
// the lamp the camera hangs on: its arm out of focus across the top left corner, the housing's lit rim
const lampArm = (c) => {
  for (let i = 0; i < 10; i++) for (let x = -4; x <= 70; x++) {
    const y = 4 + i + Math.round((x + 4) * 20 / 74)
    if (y >= 0 && y < H && x >= 0) c.px(x, y, i === 0 || i === 9 ? "1" : "0")
  }
  c.rect(60, 22, 24, 17, "0"); c.rect(61, 23, 22, 15, "1"); c.rect(62, 37, 20, 2, "6"); c.hline(63, 39, 18, "8")
}

// ================================================================ what the game needs (game/places.js cam18)
const CAM18_LAYOUT = {
  mic: spotAt(CAM, [0, YL + 1.0, (Z0 + ZL) / 2]),
  fish: rectOf(CAM, [[-FISH.w, YL, FISH.z - FISH.len * 0.62], [FISH.w, YL, FISH.z - FISH.len * 0.62], [-FISH.w, -0.5, FISH.z + FISH.len * 0.36], [FISH.w, -0.5, FISH.z + FISH.len * 0.36]], 2),
  stairs: rectOf(CAM, [[-SW - WALL, 0, Z0], [SW + WALL, 0, Z0], [-SW - WALL, YL, ZL - 0.4], [SW + WALL, YL, ZL - 0.4]], 0),
}
console.log("CAM18_LAYOUT " + JSON.stringify(CAM18_LAYOUT))

// ================================================================ the scenes
scene("cam18_bg", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), fishWord, lampArm)
// review: the engine's artefacts imitated (not shipped: the atlas takes cam* only)
scene("review_cam18", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), fishWord, lampArm, (c) => reviewFx(c, W, H))
