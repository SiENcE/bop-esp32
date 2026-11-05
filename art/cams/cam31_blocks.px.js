// CAM 31 AS BLOCKS, for approval, not game art (kapitel1-design §8; style guide §9, §12): the old metro
// station from a blockout in meters, baked with feed.js's camera and light but quantized flat (no
// dither, no material detail), the figures from feed_ch1_blocks.px.js at their spots. Only review_*
// scenes here: tools/build_art.sh's atlas takes cam* only, so nothing of this reaches the game.
//
// The camera is what Halcyon bolted on and forgot: a box on the old overhead gantry above the flooded
// tracks, 6.5 m over the water, 40 degrees down, yaw 24 toward the tunnel. It looks across the water at
// the platform, so everyone on it faces us and the player sees behind Ines what she cannot. Why this
// height: the feeds draw no depth scale (game/places.js), so a person must be about the same size at
// the stairs and at the edge; from up here the foreshortening offsets the distance (measured below).
//
// World: x along the platform toward the tunnel, y up (the water is y = 0), z from the platform's edge
// (0) to the back wall. Two tracks' width of water, so the frame's bottom is water.
//
// Build: PXL build art/cams/cam31_blocks.px.js --only review_cam31_blocks,review_cam31_blocks_ende,review_cam31_blocks_layout,review_cam31_blocks_halb --out build/art/blocks_cam31 --share 3
include("../lib/feed.js")
include("../characters/feed_ch1_blocks.px.js")
pal({ ...PHOSPHOR, C: "#3ff2ff", c: "#1a8fa0", Y: "#ffd83a", R: "#ff2a3c" })   // C c Y R: the layout review only
ramps(PH)
include("../lib/text.js")

const W = 320, H = 180
const CAM = makeCam({ pos: [0, 6.5, -4.4], yaw: 24, pitch: 40, F: 135, w: W, h: H, k: 0.12 })
const AT = (P) => at(CAM, P)

// ================================================================ the place, in meters
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
  block([SIGN.x0, SIGN.y0, ZW - 0.05], [SIGN.x1, SIGN.y1, ZW], "sign", { shadow: false }),
]
for (let i = 0; i < STAIR.n; i++) {
  const z = STAIR.foot + 0.4 + i * STAIR.tread, y = P0 + (i + 1) * STAIR.rise
  PRIMS.push(block([STAIR.x0, P0, z], [STAIR.x1, y, ZW + 5], i % 2 ? "tread" : "tread2"))
}

const LIGHTS = [{ p: [LAMP[0] - 0.3, LAMP[1] - 0.2, LAMP[2]], I: 0.92, R: 4.8, shadow: true }]

const MATS = {
  water: () => ({ a: 0.1, e: 0.03, wet: 0.6, gloss: 0.1 }),
  // the platform with its pale edge strip, the one line that tells platform from water in any light
  platform: (P, n) => {
    if (n[1] < 0.5) return { a: 0.5, e: 0 }
    return { a: P[2] < 0.35 ? 0.5 : 0.4, e: 0 }
  },
  wall: { a: 0.36, e: 0 },
  end: (P, n) => {
    if (n[0] > -0.5) return { a: 0.3, e: 0 }
    const m = (TUN.z0 + TUN.z1) / 2, r = (TUN.z1 - TUN.z0) / 2, sp = TUN.h - r * 0.5
    const top = (rr) => sp + rr * 0.5 * Math.sqrt(Math.max(0, 1 - ((P[2] - m) / rr) ** 2))
    if (P[1] < 0.1) return { a: 0.5, e: 0.03 }                                                   // the waterline: without it the mouth and its mirror image are one round hole
    if (Math.abs(P[2] - m) < r && P[1] < top(r)) return { a: 0, e: 0 }                           // the mouth, plain black
    if (Math.abs(P[2] - m) < r + 0.3 && P[1] < top(r + 0.3) + 0.15) return { a: 0.9, e: 0 }      // the ring of stone round it
    return { a: 0.42, e: 0 }
  },
  cheek: { a: 0.34, e: 0 },
  pillar: { a: 0.36, e: 0 },
  tread: { a: 0.34, e: 0 },
  tread2: { a: 0.7, e: 0 },
  lamp: () => ({ a: 0.4, e: 1.3 }),
  sign: { a: 0.7, e: 0 },
}
// no rain down here: no ripples, the water a still mirror (the drops are live, for later)
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ground: "water", ambient: 0.2, sky: 0.0, rain: 0 })

// ================================================================ the flat bake
// feed.js's light, but each pixel the nearest step, with no ordered dither: flat shapes, for blocks.
const _FLAT = {}
function flatBake(cam, world, { exposure = 1.35, gamma = 0.85, edge = 0.12 } = {}) {
  if (_FLAT.img) return _FLAT
  _FLAT.img = []
  for (let y = 0; y < cam.h; y++) {
    const row = new Int8Array(cam.w)
    for (let x = 0; x < cam.w; x++) {
      const d = rayDir(cam, x + 0.5, y + 0.5), nx = (x + 0.5 - cam.cx) / cam.cx, ny = (y + 0.5 - cam.cy) / cam.cx
      const fall = 1 - edge * clamp((nx * nx + ny * ny * 2.4) / 2, 0, 1)
      row[x] = clamp(Math.round(Math.pow(clamp(radiance(cam, world, d, 0) * fall * exposure, 0, 1.4), gamma) * 8.2), 0, 9)
    }
    _FLAT.img.push(row)
  }
  return _FLAT
}

// the sign's letters (English, the city's; the old line's), drawn by hand on the blocks
function sign(c) {
  const [x, y] = AT([(SIGN.x0 + SIGN.x1) / 2, (SIGN.y0 + SIGN.y1) / 2, ZW - 0.06])
  TXT.draw(c, x, y - 3, "LINE 31", "2", { font: "hud", align: "center" })
}

// ================================================================ the spots, measured (feet, px)
const SPOT = (x, z, y = P0) => spotAt(CAM, [x, y, z])
const WORLD_SPOTS = {
  top: [-0.7, STAIR.foot + 0.4 + 2 * STAIR.tread, P0 + 3 * STAIR.rise],   // where Ines comes into sight on the stairs, her head under the lintel
  stairs: [-0.7, STAIR.foot - 0.1, P0],         // the foot of the stairs
  shadow: [-3.2, 5.0, P0],                      // beside the stairs' box, away from the lamp: Ashe's way in
  edge: [1.7, 0.55, P0],                        // Ines, at the platform's edge
  behind: [0.9, 1.3, P0],                       // Ashe's last spot, right behind her
  midway: [-1.1, 3.0, P0],                      // only for the picture: Ashe on his way
  lantern: [2.9, -0.75, 0],                     // Lantern, in the water, an arm's reach from her (she hands him the wallet)
  tunnel: [XE - 0.3, -2.2, 0],                  // Lantern, at the tunnel's mouth
}
const SPOTS = Object.fromEntries(Object.entries(WORLD_SPOTS).map(([k, [x, z, y]]) => [k, spotAt(CAM, [x, y, z])]))
const PERSON = Object.fromEntries(Object.entries(WORLD_SPOTS).map(([k, [x, z, y]]) => [k, Math.round(personPx(CAM, [x, y, z]) * 10) / 10]))
console.log("cam31 spots", JSON.stringify(SPOTS), "1.75 m in px there", JSON.stringify(PERSON))
const groundSteps = () => { const { img } = flatBake(CAM, WORLD); return Object.fromEntries(Object.entries(SPOTS).map(([k, [x, y]]) => [k, img[y + 2][x]])) }

// the covers of the display, as game/screens.js and places.js have them in cam31 (the 4 buttons from game/places.js: tries)
const COVERS = [[2, 2, 118, 38], [4, 40, 34, 106], [172, 13, 144, 10], [244, 26, 72, 48]]

const BG = (c) => { const { img } = flatBake(CAM, WORLD); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PH[img[y][x]]) }
const put = (c, name, k, t = 0, o = {}) => { const [x, y] = SPOTS[k]; c.stamp(name, x, y, { t, ...o }) }

// ================================================================ the review pictures
// 23:02: she at the edge, he in the water in front of her, Ashe on his way out of the shadow
scene("review_cam31_blocks", { w: W, h: H, bg: "0" }, BG, sign, (c) => {
  put(c, "bk_ashe_walk", "midway", 300)
  put(c, "bk_ines_front", "edge")
  put(c, "bk_lantern_back", "lantern")
})
// 23:04: she lies where she stood, he has come to her and waves up at the camera; Lantern is gone
scene("review_cam31_blocks_ende", { w: W, h: H, bg: "0" }, BG, sign, (c) => {
  put(c, "bk_ines_down", "edge")
  put(c, "bk_ashe_wave", "behind", 400)
})
// everything over a dimmed picture: the display's covers (red), the spots (yellow), the ways (cyan),
// and everyone at each of their spots
scene("review_cam31_blocks_layout", { w: W, h: H, bg: "0" }, (c) => {
  console.log("the ground's step under each spot", JSON.stringify(groundSteps()))
  const { img } = flatBake(CAM, WORLD); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PH[Math.max(0, img[y][x] - 2)])
  sign(c)
}, (c) => {
  for (const [a, b] of [["top", "stairs"], ["stairs", "edge"], ["shadow", "behind"], ["tunnel", "lantern"]]) c.line(SPOTS[a][0], SPOTS[a][1], SPOTS[b][0], SPOTS[b][1], "C")
  put(c, "bk_ashe_dim", "shadow")
  put(c, "bk_ines_front", "stairs")
  put(c, "bk_ashe", "behind")
  put(c, "bk_ines_front", "edge")
  put(c, "bk_lantern_back", "lantern")
  put(c, "bk_lantern_front", "tunnel")
  for (const [x, y, w, h] of COVERS) { c.hline(x, y, w, "R"); c.hline(x, y + h - 1, w, "R"); c.vline(x, y, h, "R"); c.vline(x + w - 1, y, h, "R") }
  for (const [name, [x, y]] of Object.entries(SPOTS)) { c.px(x, y, "Y"); c.px(x - 1, y, "Y"); c.px(x + 1, y, "Y"); c.px(x, y - 1, "Y"); c.px(x, y + 1, "Y"); c.text(x + 3, y + 1, name.toUpperCase(), "Y") }
})
// for the decision about coarseness: the picture baked at half resolution (each step 2x2), the figures at
// 1x, without artefacts; judged through the game's own cam31 post, like the others
scene("review_cam31_blocks_halb", { w: W, h: H, bg: "0" }, (c) => {
  const { img } = flatBake(CAM, WORLD)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PH[img[y & ~1][x & ~1]])
}, sign, (c) => {
  put(c, "bk_ashe_walk", "midway", 300)
  put(c, "bk_ines_front", "edge")
  put(c, "bk_lantern_back", "lantern")
})
