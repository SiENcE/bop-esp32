// CAM 31, the old metro station, Line 31 (docs/kapitel1-design.md §8; style guide §9, §12): where Chapter 1 ends.
// Painted from the approved blockout: the same camera, the same place in meters.
//
// The camera is what Nagi·wa bolted on and forgot: a box on the old overhead gantry above the flooded tracks,
// 6.5 m over the water, 40 degrees down, yaw 24 toward the tunnel. It looks across the water at the platform, so
// everyone on it faces us, and the player sees what stands beyond the stairs' long cheek, which Ines and Lantern cannot. Why this height: the feeds draw no
// depth scale (game/places.js), so a person must be about the same size at the stairs and at the edge.
//
// Baked at half resolution (story §10c): this camera is older than the others, so its picture is coarser than
// theirs by construction, each phosphor step 2x2 px on the even grid, the dither at that grid too. The figures are
// drawn at 1x over it and stand out as sharper. Only the sign's letters leave the grid: they must be read.
//
// World: x along the platform toward the tunnel, y up (the water is y = 0), z from the platform's edge (0) to the
// back wall.
include("../lib/feed.js")
include("../characters/feed_people.px.js")
pal({ ...PHOSPHOR, C: "#3ff2ff", c: "#1a8fa0", Y: "#ffd83a", R: "#ff2a3c" })   // C c Y R: the layout review only
ramps(PH)
include("../lib/text.js")

const W = 320, H = 180
const CAM = makeCam({ pos: [0, 6.5, -4.4], yaw: 24, pitch: 40, F: 135, w: W, h: H, k: 0.12 })
const AT = (P) => at(CAM, P)

// ================================================================ the place, in meters (as in the blockout)
const P0 = 0.25                                  // the platform over the water: flooded right up to it
const ZW = 6.0                                   // the back wall
const XE = 9.6                                   // the end wall with the tunnel
const TUN = { z0: -3.9, z1: -0.5, h: 2.9 }       // the near track's tunnel, flooded a meter up its walls
const STAIR = { x0: -1.9, x1: 0.5, foot: 5.0, n: 12, tread: 0.34, rise: 0.22 }   // the stairs come down through the back wall
const CHEEK = 3.7                                // the left cheek stands far out onto the platform: what it hides from the lamp is Ashe's shadow
const LID = 3.1                                  // the box's height, the lintel
const XP = 2.9, ZP = 1.6                         // the one pillar left in the picture
const LAMP = [XP - 0.62, 3.0, ZP - 0.25]         // the one emergency light, on the pillar's side toward the stairs (it lights the way out)
const SIGN = { x0: 1.3, x1: 3.7, y0: 2.2, y1: 2.8 }   // the old line's sign on the back wall
const VAULT = 7.0                                // the roof: above the camera, so never seen, only mirrored in the water

const PRIMS = [
  block([-40, 0, 0], [XE, P0, ZW], "platform"),
  block([-40, 0, ZW], [STAIR.x0 - 0.2, 12, ZW + 1], "wall"),
  block([STAIR.x1 + 0.2, 0, ZW], [XE + 1, 12, ZW + 1], "wall"),
  block([STAIR.x0 - 0.2, LID, ZW], [STAIR.x1 + 0.2, 12, ZW + 5], "wall"),
  block([XE, 0, -12], [XE + 1, 12, ZW], "end"),
  // the stairs' box: its two cheeks out from the wall, the roof between them
  block([STAIR.x0 - 0.2, P0, CHEEK], [STAIR.x0, LID, ZW + 5], "cheek"),
  block([STAIR.x1, P0, STAIR.foot], [STAIR.x1 + 0.2, LID, ZW + 5], "cheek"),
  block([STAIR.x0 - 0.2, LID, STAIR.foot], [STAIR.x1 + 0.2, LID + 0.2, ZW], "cheek"),
  block([XP - 0.35, P0, ZP - 0.35], [XP + 0.35, 12, ZP + 0.35], "pillar"),
  block([LAMP[0] - 0.25, LAMP[1] - 0.14, LAMP[2] - 0.22], [XP - 0.35, LAMP[1] + 0.14, LAMP[2] + 0.22], "lamp", { shadow: false }),
  block([XP - 0.47, LAMP[1] + 0.14, ZP - 0.33], [XP - 0.35, 12, ZP - 0.21], "conduit", { shadow: false }),   // the lamp's feed, run up the pillar
  block([SIGN.x0, SIGN.y0, ZW - 0.05], [SIGN.x1, SIGN.y1, ZW], "sign", { shadow: false }),
  block([-40, VAULT, -12], [XE + 1, VAULT + 0.5, ZW + 5], "vault", { shadow: false }),
]
for (let i = 0; i < STAIR.n; i++) {
  const z = STAIR.foot + 0.4 + i * STAIR.tread, y = P0 + (i + 1) * STAIR.rise
  PRIMS.push(block([STAIR.x0, P0, z], [STAIR.x1, y, ZW + 5], i % 2 ? "tread" : "tread2"))
}

// The blockout's one light, reaching a little further. Its point sits a little forward of the box, so the pillar's
// face toward us catches it at a graze and reads as a pillar, not as a black gap in the picture.
const LIGHT = { p: [LAMP[0] - 0.3, LAMP[1] - 0.2, LAMP[2] - 0.3], I: 1.0, R: 5.0, shadow: true, shadowKeep: 0.2 }
const LIGHTS = [LIGHT]

// ================================================================ what water and neglect did
const frac = (v) => v - Math.floor(v)

// Two tide lines, dead level on every wall, the pillar and the cheek, since water doesn't care what it stands
// against: the last great flood's (salt left a pale rim on top of it) and the usual winter's, where it's darkest.
const TIDE_HI = 1.35, TIDE_LO = 0.75
function tide(y, u) {
  if (y > TIDE_HI + 0.1) return 1
  if (y > TIDE_HI) return 1.2
  const mottle = 0.9 + 0.2 * vnoise(u * 1.3, y * 2.2)
  return (y > TIDE_LO ? 0.6 : 0.4) * mottle
}

// Enamel panels in courses, the old network's cladding: big enough to survive 2x2 px (small tile only makes noise
// at this grid). Frost and flood pop them, so more are gone low down, where the water stood.
function panels(u, y, seed, base = 0.5) {
  const hC = 0.45, wC = 0.9, course = Math.floor(y / hC), off = course & 1 ? 0.5 : 0, col = Math.floor(u / wC + off)
  let a = base * (0.92 + 0.16 * ih(col, course, seed))
  if (ih(col, course, seed + 1) < (y < TIDE_HI + 0.5 ? 0.16 : 0.05)) return base * 0.45                // gone: bare wall behind
  if (frac(y / hC) < 0.14) a *= 0.7                                                                    // the course joints
  return a
}

// A run of rust or damp down a wall: from a point, as wide as what feeds it, thinning out with its length.
const run = (u, y, u0, top, wide, len) => (y > top || y < top - len ? 0 : Math.max(0, 1 - Math.abs(u - u0) / wide) * (1 - (top - y) / len))

// Where the roof leaks along the back wall: at its joints, so not everywhere, and from the sign's two bolts.
const LEAKS = [[-6.6, 12, 0.3, 6], [-3.4, 12, 0.22, 7.5], [1.0, 12, 0.2, 7], [4.9, 12, 0.3, 8], [7.7, 12, 0.24, 6.5],
  [SIGN.x0 + 0.1, SIGN.y0, 0.1, 1.1], [SIGN.x1 - 0.1, SIGN.y0, 0.12, 1.4]]
const leaked = (x, y) => { let s = 0; for (const [u0, top, w, l] of LEAKS) s = Math.max(s, run(x, y, u0, top, w, l)); return s }

// The lit platform throws a little light back up: what lets the side of a thing facing the water be seen.
const POOL = [0.6, P0, 1.6]
const bounce = (P, k = 0.06) => k / (1 + (Math.hypot(P[0] - POOL[0], P[1] - POOL[1], P[2] - POOL[2]) / 3.2) ** 2)

const LENS = 1.6                                  // over the bake's shoulder by enough that the lamp reaches 9 and its mirror image 8
const FLOOR_TOP = 0.47                            // the brightest the platform's slabs get: see platform below
const WORN = (P) => clamp(1 - Math.abs(P[0] + 0.7) / 0.8, 0, 1)
const CLIMB = (P) => clamp(1 - (P[2] - STAIR.foot - 0.4) / (STAIR.n * STAIR.tread), 0, 1)        // 1 at the flight's foot, 0 at its top: it climbs out of the light

const MATS = {
  // Still water, looked into steeply: on it the mirror image of what stands above, and under it the near track's
  // rails, running on into the tunnel. It must carry Lantern, in mid values, from here to the tunnel's mouth.
  water: (P) => {
    const rail = Math.abs(P[2] + 2.2 - 0.72) < 0.07 || Math.abs(P[2] + 2.2 + 0.72) < 0.07
    return { a: rail ? 0.3 : 0.1, e: 0.05, wet: 0.7, gloss: 0.12 }
  },
  // The roof the water mirrors, lit from below by the platform: that is the water's broad dull sheen. Glow, not lit by
  // the lamp, since from the lamp the pillar would throw its shadow right where Lantern floats, and bounce has no such edge.
  vault: (P) => ({ a: 0, e: 0.13 + 0.36 / (1 + (Math.hypot(P[0] - 3.0, P[2] - 1.5) / 5.5) ** 2) }),
  // The platform with its pale edge strip, the one line that tells platform from water in any light, chipped by
  // what has hit it; its slabs, and the silt the tide left against the walls.
  platform: (P, n) => {
    const [x, , z] = P
    const chip = ih(Math.floor(x * 2.5), 3, 21) < 0.2
    if (n[1] < 0.5) return { a: chip ? 0.22 : 0.6, e: 0 }
    if (z < 0.35) return { a: chip && z < 0.2 ? 0.14 : 0.9, e: 0 }
    const sx = Math.floor(x / 1.2), sz = Math.floor(z / 1.2)
    let a = 0.48 + 0.02 * (ih(sx, sz, 6) - 0.5)
    if (frac(x / 1.2) < 0.07 || frac(z / 1.2) < 0.07) a *= 0.72
    const silt = clamp((z - 2.8) / 2.2, 0, 1) * (0.7 + 0.5 * fbm(x * 0.7, z * 0.9, 2))
    a *= 1 - 0.55 * clamp(silt, 0, 1)
    // Where people stand it stays under Ashe's raincoat (8, which the game's palette pass makes 5 or 6, against 4 for a
    // ground of 7): the pool tops out there, while the edge strip and the pillar go on brightening.
    const L = lightAt(WORLD, P, n), v = a * L * 1.6
    return { a: (v < FLOOR_TOP ? v : FLOOR_TOP + (v - FLOOR_TOP) * 0.2) / (L * 1.6), e: 0 }
  },
  wall: (P, n) => {
    const [x, y] = P
    if (n[2] > -0.5) return { a: 0.3, e: 0 }
    const a = y > 3.6 ? 0.26 + 0.06 * fbm(x * 0.8, y * 0.8, 2) : (y > 1.95 && y < 2.12 ? 0.18 : panels(x, y, 43, 0.42))
    return { a: a * tide(y, x) * (1 - 0.55 * leaked(x, y)), e: 0 }
  },
  // The end wall, with the stone ring of the tunnel's mouth; black inside, the waterline across it, or the mouth
  // and its mirror image are one round hole.
  end: (P, n) => {
    if (n[0] > -0.5) return { a: 0.3, e: 0 }
    const [, y, z] = P
    const m = (TUN.z0 + TUN.z1) / 2, r = (TUN.z1 - TUN.z0) / 2, sp = TUN.h - r * 0.5
    const top = (rr) => sp + rr * 0.5 * Math.sqrt(Math.max(0, 1 - ((z - m) / rr) ** 2))
    if (y < 0.1) return { a: 0.7, e: 0.16 }
    if (Math.abs(z - m) < r && y < top(r)) return { a: 0, e: 0 }
    if (Math.abs(z - m) < r + 0.3 && y < top(r + 0.3) + 0.15) {
      const stone = Math.floor((Math.atan2(y - sp, z - m) + 4) * 7)
      return { a: (ih(stone, 2, 8) < 0.2 ? 0.6 : 0.85) * tide(y, z), e: 0 }
    }
    return { a: panels(z, y, 50, 0.46) * tide(y, z), e: 0 }
  },
  cheek: (P, n) => {
    const [x, y, z] = P
    if (n[1] > 0.5) return { a: 0.26, e: 0 }                                                          // the box's roof, dust
    // the lintel and the right cheek's end stay dark: lit, they frame the flight and make a crate of it
    if (n[2] < -0.5 && (y > LID || x > STAIR.x1 - 0.01)) return { a: 0.14, e: 0 }
    const u = Math.abs(n[0]) > 0.5 ? z : x
    return { a: panels(u, y, 60, 0.55) * tide(y, u), e: 0 }
  },
  pillar: (P, n) => {
    const [x, y, z] = P
    const u = Math.abs(n[0]) > 0.5 ? z : x
    let a = panels(u, y, 70, 0.68) * tide(y, u)
    if (y > 1.95 && y < 2.12) a = 0.24
    // rust from the box's bracket, on both faces we see, and the soot of an old fitting, or the box drowns in its own glare
    a *= 1 - 0.6 * Math.max(run(z, y, ZP - 0.25, LAMP[1] - 0.14, 0.3, 1.8) * (n[0] < -0.5 ? 1 : 0), run(x, y, XP - 0.25, LAMP[1] - 0.1, 0.28, 1.5) * (n[2] < -0.5 ? 1 : 0))
    a *= clamp(0.5 + 0.5 * (Math.hypot(x - LAMP[0], y - LAMP[1], z - LAMP[2]) - 0.3) / 1.1, 0.5, 1)
    return { a, e: bounce(P) }
  },
  conduit: () => ({ a: 0.16, e: 0 }),
  // The treads alternate as in the blocks, or the flight goes to mush at this grid: whole lines, a touch paler along
  // the middle where everyone walked; the light that gets in under the lintel is what the pool throws up (e), since
  // the lamp itself only reaches half of each.
  tread: (P, n) => (n[1] > 0.5 ? { a: 0.3 + 0.05 * WORN(P), e: 0.03 * (0.5 + 0.5 * CLIMB(P)) } : { a: 0.1, e: 0 }),
  tread2: (P, n) => (n[1] > 0.5 ? { a: (0.7 + 0.1 * WORN(P)) * (0.75 + 0.25 * CLIMB(P)), e: 0.1 * (0.6 + 0.4 * CLIMB(P)) } : { a: 0.12, e: 0 }),
  // The box: a dark housing, its lens on the side facing the stairs and round the corner toward us.
  lamp: (P, n) => {
    if (n[1] > 0.5) return { a: 0.3, e: 0 }
    if (n[0] < -0.5 || n[1] < -0.5 || (n[2] < -0.5 && P[0] < (LAMP[0] - 0.25 + XP - 0.35) / 2)) return { a: 0.4, e: LENS }
    return { a: 0.1, e: 0 }
  },
  sign: { a: 0.95, e: 0.02 },
}
// no rain down here: no ripples, the water a still mirror
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ground: "water", ambient: 0.2, sky: 0.0, rain: 0 })
// What the water mirrors leaves out the conduit: true to the light, its image was a dark stem under the lamp's, a sign on a post in the water.
const MIRROR_WORLD = { ...WORLD, prims: PRIMS.filter((p) => p.m !== "conduit") }
const BELOW_EDGE = 125                            // the rows under the pillar's foot, where the conduit can only be a mirror image

// ================================================================ the bake, at half resolution
// Each 2x2 cell one step: four rays averaged (the sensor is coarse, it doesn't sample), the dither on the coarse
// grid. The lens veils round the lamp a little, as an old tube does; that's the only bloom.
const EXPOSURE = 1.55
// Nothing lit but the lamp reaches the top of the ramp, which is Ines's coat.
const SHOULDER = 0.56
const shoulder = (v) => (v < SHOULDER ? v : SHOULDER + (v - SHOULDER) * 0.15)
// As tone() in feed.js, with a narrower dither: the game's palette pass and grain dither on top of this already,
// so here it's kept to the falloff's steps, or the coarse cells read as dirt.
function quant(v, gx, gy) {
  const q = Math.pow(clamp(v * EXPOSURE, 0, 1.4), 0.85) * 8.2, i = Math.floor(q), fr = clamp((q - i - 0.5) * 4 + 0.5, 0, 1)
  return clamp(i + (fr > bayer(gx, gy) ? 1 : 0), 0, 9)
}
let _HALF = null
function halfBake() {
  if (_HALF) return _HALF
  const img = []
  const [lx, ly] = project(CAM, [LAMP[0] - 0.25, LAMP[1], LAMP[2]]), [mx, my] = project(CAM, [LAMP[0] - 0.25, -LAMP[1], LAMP[2]])
  for (let gy = 0; gy < H / 2; gy++) {
    const row = new Int8Array(W)
    for (let gx = 0; gx < W / 2; gx++) {
      let v = 0
      for (const [ox, oy] of [[0.5, 0.5], [1.5, 0.5], [0.5, 1.5], [1.5, 1.5]]) v += radiance(CAM, gy * 2 >= BELOW_EDGE ? MIRROR_WORLD : WORLD, rayDir(CAM, gx * 2 + ox, gy * 2 + oy), 0) / 4
      const x = gx * 2 + 1, y = gy * 2 + 1, nx = (x - CAM.cx) / CAM.cx, ny = (y - CAM.cy) / CAM.cx
      const fall = 1 - 0.12 * clamp((nx * nx + ny * ny * 2.4) / 2, 0, 1)
      const veil = 0.5 / (1 + (Math.hypot(x - lx, y - ly) / 7) ** 2) + 0.04 / (1 + (Math.hypot(x - mx, y - my) / 6) ** 2)
      const k = quant(shoulder(v * fall) + veil, gx, gy)
      row[gx * 2] = k; row[gx * 2 + 1] = k
    }
    img.push(row, row)
  }
  _HALF = img
  return img
}
const paintBg = (c) => { const img = halfBake(); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PH[img[y][x]]) }

// ================================================================ by hand
// The old line's sign, English like all of them: enamel letters, dark on the plate, following the wall's slope so
// they sit on it, at 1x because they must survive the post-effects.
function signText(c) {
  const a = project(CAM, [SIGN.x0, (SIGN.y0 + SIGN.y1) / 2, ZW - 0.06]), b = project(CAM, [SIGN.x1, (SIGN.y0 + SIGN.y1) / 2, ZW - 0.06])
  const s = "LINE 31", G = NAGIWA_GLYPHS.hud
  let x = Math.round((a[0] + b[0]) / 2 - TXT.measure(s, "hud") / 2)
  for (const ch of s) {
    const g = G[ch] ?? G["?"], rows = Array.isArray(g) ? g : g.rows, dy = Array.isArray(g) ? 0 : g.dy
    const y = Math.round(a[1] + (x + rows[0].length / 2 - a[0]) * (b[1] - a[1]) / (b[0] - a[0]) - 3)
    if (ch !== " ") rows.forEach((r, ry) => { for (let rx = 0; rx < r.length; rx++) if (r[rx] === "#") c.px(x + rx, y + dy + ry, "1") })
    x += rows[0].length + 1
  }
}

// The emergency light, on the coarse grid: traced, its 9 was a torn flag; a solid lit bar, rising with the pillar's face,
// reads as a lamp at 1x, and the veil round it is its glow. Each key a 2x2 cell.
const LAMP_CELLS = [
  "....8888",
  "..899999",
  "8999998.",
  "99999...",
  "888.....",
]
function lampBox(c) {
  LAMP_CELLS.forEach((r, gy) => { for (let gx = 0; gx < r.length; gx++) if (r[gx] !== ".") c.rect(146 + gx * 2, 60 + gy * 2, 2, 2, r[gx]) })
}

// ================================================================ the spots, measured (feet, px): game/places.js has them
const WORLD_SPOTS = {
  top: [-0.7, STAIR.foot + 0.4 + 2 * STAIR.tread, P0 + 3 * STAIR.rise],   // where Ines comes into sight on the stairs, her head under the lintel
  stairs: [-0.7, STAIR.foot - 0.1, P0],         // the foot of the stairs
  shadow: [-3.2, 5.0, P0],                      // beside the stairs' box, away from the lamp: Ashe's way in
  edge: [1.7, 0.55, P0],                        // Ines, at the platform's edge
  midway: [-1.1, 3.0, P0],                      // only for the picture: Ashe on his way
  lantern: [2.9, -0.75, 0],                     // Lantern, in the water, an arm's reach from her (she hands him the wallet)
  tunnel: [XE - 0.3, -2.2, 0],                  // Lantern, at the tunnel's mouth
}
// where he stops her on her way to the stairs: placed in the picture, a face-off with her back to us, his coat against the darker floor
const SPOTS = { ...Object.fromEntries(Object.entries(WORLD_SPOTS).map(([k, [x, z, y]]) => [k, spotAt(CAM, [x, y, z])])), meet: [112, 99], asheMeet: [97, 90] }
console.log("cam31 spots", JSON.stringify(SPOTS))
const groundSteps = () => { const img = halfBake(); return Object.fromEntries(Object.entries(SPOTS).map(([k, [x, y]]) => [k, img[y + 2][x]])) }

// the covers of the display, as game/screens.js and places.js have them in cam31
const COVERS = [[2, 2, 118, 38], [4, 40, 34, 106], [172, 13, 144, 10], [244, 26, 72, 48]]
const put = (c, name, k, t = 0, o = {}) => { const [x, y] = SPOTS[k]; c.stamp(name, x, y, { t, ...o }) }

// ================================================================ the scene
scene("cam31_bg", { w: W, h: H, bg: "0" }, paintBg, signText, lampBox)

// ---------------------------------------------------------------- review images (not shipped: the atlas takes cam* only)
// 23:02: she at the edge, he in the water in front of her, Ashe on his way out of the shadow
scene("review_cam31", { w: W, h: H, bg: "0" }, paintBg, signText, lampBox, (c) => {
  put(c, "ashe_feed_walk", "midway", 300)
  put(c, "ines_feed_front", "edge")
  put(c, "lantern_feed_l", "lantern")
})
// 23:04: she lies where she stood, he stands over her and looks up into the camera; Lantern is gone
scene("review_cam31_ende", { w: W, h: H, bg: "0" }, paintBg, signText, lampBox, (c) => {
  put(c, "ines_feed_down", "meet")
  put(c, "ashe_feed_look", "asheMeet", 0)
})
// the two hard cases for the values: Ashe in his shadow, only the mask there; Lantern on his way out, on the water and
// at the tunnel's mouth
scene("review_cam31_wege", { w: W, h: H, bg: "0" }, paintBg, signText, lampBox, (c) => {
  put(c, "ashe_feed_dim", "shadow")
  c.stamp("lantern_feed_drive_r", 234, 121, { t: 0 })
  put(c, "lantern_feed_drive_r", "tunnel")
})
// everything over a dimmed picture: the display's covers (red), the spots (yellow), the ways (cyan), everyone at each spot
scene("review_cam31_layout", { w: W, h: H, bg: "0" }, (c) => {
  console.log("the ground's step under each spot", JSON.stringify(groundSteps()))
  const img = halfBake(); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PH[Math.max(0, img[y][x] - 2)])
}, signText, (c) => {
  for (const [a, b] of [["top", "stairs"], ["stairs", "edge"], ["shadow", "asheMeet"], ["edge", "meet"], ["tunnel", "lantern"]]) c.line(SPOTS[a][0], SPOTS[a][1], SPOTS[b][0], SPOTS[b][1], "C")
  put(c, "ashe_feed_dim", "shadow")
  put(c, "ines_feed_front", "stairs")
  put(c, "ashe_feed", "asheMeet")
  put(c, "ines_feed_front", "edge")
  put(c, "lantern_feed_l", "lantern")
  put(c, "lantern_feed_drive_r", "tunnel")
  for (const [x, y, w, h] of COVERS) { c.hline(x, y, w, "R"); c.hline(x, y + h - 1, w, "R"); c.vline(x, y, h, "R"); c.vline(x + w - 1, y, h, "R") }
  for (const [name, [x, y]] of Object.entries(SPOTS)) { c.px(x, y, "Y"); c.px(x - 1, y, "Y"); c.px(x + 1, y, "Y"); c.px(x, y - 1, "Y"); c.px(x, y + 1, "Y"); c.text(x + 3, y + 1, name.toUpperCase(), "Y") }
})
