// CAM 30, the Sumpf-Abgang: the camera high on a building's corner across the street, looking down and from the side at the stair
// well that goes down to the old station of LINE 31 (near iso). Feed mode, 320x180, the phosphor ramp only (style guide §9). The user
// chose the blocks C of three (art/mockups/cam30_blocks.px.js, docs/cams/cam30_blocks_vergleich_x2.png, 2026-11-12); this paints on
// their lines: the same place in meters, the camera a little higher so the steps and the water show.
// What is in it: the wet street round the well, its railings; over the stair's head the old entrance frame with LINE 31 - CLOSED and a
// chain across; the tide board on its post beside it, lit (LOW TIDE, FRI 23:00); the steps going down between the well's walls, worn,
// dark with slime where the water reaches, and the black water over the lower ones, the sign and the lamp in it; at the far end the
// old station's arch half under water; a street lamp. Ines (the game's actor): on Thursday she comes along the street from below and
// stands at the board; on Friday she comes from the right, past the sign, down the steps and into the dark under the arch, once
// (the routines' once). Where: CAM30_LAYOUT at the end of this file (printed when built), copied into game/places.js (cam30).
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [4.8, 8.4, -3.2], yaw: -36, pitch: 54, F: 230, w: W, h: H, k: 0.08 })

// ================================================================ the place, in meters (x across the stair, y up from the street, z down the stair)
const HALF = 1.8, STEPS = 18, RISE = 0.2, TREAD = 0.33, WATER = -2.3
const FOOT = STEPS * TREAD                                   // where the flight ends (z), at y = -STEPS * RISE
const BOARD = [HALF + 1.1, 1.4]                                     // the tide board's post (x, z), by the head of the stair
const PRIMS = [
  // the street round the well, the well's walls
  block([-12, -0.4, -10], [12, 0, 0], "street"),
  block([-12, -0.4, 0], [-HALF - 0.3, 0, 12], "street"), block([HALF + 0.3, -0.4, 0], [12, 0, 12], "street"),
  block([-HALF - 0.3, -6, 0], [-HALF, 0, FOOT + 3], "wall"), block([HALF, -6, 0], [HALF + 0.3, 0, FOOT + 3], "wall"),
  block([-HALF - 0.3, -6, FOOT + 3], [HALF + 0.3, 0, FOOT + 3.4], "arch", { arch: true }),
  // the water over the lower steps
  block([-HALF, -6, 0], [HALF, WATER, FOOT + 3], "water"),
  // the frame over the stair's head, the sign on it, the chain across
  block([-HALF - 0.3, 0, -0.15], [-HALF - 0.1, 2.6, 0.05], "frame"), block([HALF + 0.1, 0, -0.15], [HALF + 0.3, 2.6, 0.05], "frame"),
  block([-HALF - 0.3, 2.3, -0.15], [HALF + 0.3, 2.75, 0.05], "sign"),
  block([-HALF, 0.75, -0.06], [HALF, 0.8, -0.02], "chain"),
  // the tide board on its post
  cyl(BOARD[0], BOARD[1], 0.06, 0, 1.4, "post"), block([BOARD[0] - 0.45, 1.4, BOARD[1] - 0.05], [BOARD[0] + 0.45, 2.1, BOARD[1] + 0.05], "board"),
  // a street lamp behind it
  cyl(-3.0, -1.2, 0.08, 0, 4.2, "post"),
]
for (let i = 0; i < STEPS; i++) PRIMS.push(block([-HALF, -6, i * TREAD], [HALF, -(i + 1) * RISE, (i + 1) * TREAD], "step", { i }))
// the railings round the well
for (const x of [-HALF - 0.15, HALF + 0.15]) { for (let z = 0.4; z < FOOT + 3; z += 1.2) PRIMS.push(cyl(x, z, 0.03, 0, 1.0, "rail")); PRIMS.push(block([x - 0.03, 0.96, 0.1], [x + 0.03, 1.02, FOOT + 3], "rail")) }

const LIGHTS = [
  { p: [-3.0, 4.1, -1.2], I: 2.2, R: 10, shadow: true },                   // the street lamp
  { p: [0, 2.2, 0.4], I: 0.9, R: 4.5 },                                    // the lamp under the sign, down the stair
  { p: [BOARD[0], 1.75, BOARD[1] + 0.4], I: 0.6, R: 2.2 },                 // the board's glow
  { p: [0, -2.0, FOOT + 2.6], I: 0.6, R: 4 },                              // a faint light in the old station
  { p: [-HALF + 0.1, -0.7, 1.6], I: 0.7, R: 3.2 }, { p: [-HALF + 0.1, -2.0, 4.4], I: 0.55, R: 3 },   // the well's emergency lamps, still on
]
const MATS = {
  // the street: slabs, puddles where it sags, a drain by the well
  street: (P, n) => {
    if (n[1] <= 0.5) return { a: 0.26, e: 0 }
    const [x, , z] = P, slab = ((x / 0.8) % 1 + 1) % 1 < 0.05 || ((z / 0.8) % 1 + 1) % 1 < 0.05
    const pud = Math.max(0, fbm(x * 0.5 + 9, z * 0.5, 3) - 0.55) * 3
    return { a: slab ? 0.24 : 0.32, e: 0, wet: Math.min(0.85, 0.12 + pud), gloss: 0.15 }
  },
  wall: (P, n) => ({ a: n[1] > 0.5 ? 0.4 : 0.24 + (P[1] < WATER + 0.6 && P[1] > WATER ? -0.1 : 0), e: 0 }),
  arch: (P) => { const r = Math.hypot(P[0], P[1] + 3.2); return { a: r < 1.3 ? 0.04 : 0.24, e: r < 1.3 && r > 1.15 ? 0.12 : 0 } },
  water: { a: 0.03, e: 0, wet: 0.95, gloss: 0.5 },
  // a step: its worn nose light, the tread darker toward its back, slime where the water reaches
  step: (P, n, f, hit) => {
    const i = hit.prim.i, along = P[2] - i * TREAD, slime = -(i + 1) * RISE < WATER + 0.7
    if (n[1] <= 0.5) return { a: 0.18, e: 0 }
    return { a: (along > TREAD - 0.06 ? 0.56 : 0.36 - along * 0.25) - (slime ? 0.14 : 0), e: 0, wet: slime ? 0.5 : 0.15 }
  },
  frame: { a: 0.4, e: 0 }, sign: { a: 0.3, e: 0.7 }, chain: { a: 0.5, e: 0 },
  post: { a: 0.35, e: 0 }, board: { a: 0.3, e: 0.85 }, rail: { a: 0.45, e: 0 },
  person: { a: 0.7, e: 0 }, head: { a: 0.3, e: 0 },
}
// Ines as a stand-in, where she stands on Thursday (at the board) and Friday (at the water's edge), one world each
const STAND = { board: [BOARD[0] - 0.7, 0, BOARD[1] + 0.3], water: [0.2, -2.2, (2.2 / RISE) * TREAD - 0.2] }
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ground: null, ambient: 0.22, sky: 0.02, rain: 1 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.4, key: "cam30" })

// ---------------------------------------------------------------- hand drawing on top
// Letters along a face of the world, readable: each glyph pixel stays one screen pixel, but the line runs the way the face's edge runs on
// the screen (the projected direction of U at the text's middle M, scaled to one pixel across), and its columns stay upright, as the signs
// in the iso rooms are drawn (from this high the face's own uprights lie nearly flat, and letters leaning with them can't be read)
const glyphOf = (ch) => { const g = NAGIWA_GLYPHS.hud[ch] ?? NAGIWA_GLYPHS.hud["?"]; return Array.isArray(g) ? g : g.rows }
const widthOf = (text) => [...text].reduce((w, ch) => w + glyphOf(ch)[0].length + 1, -1)
function centred(c, M, U, V, text, key) {
  const m = project(CAM, M), pu = project(CAM, add(M, mul(U, 0.1)))
  let du = [pu[0] - m[0], pu[1] - m[1]], dv
  du = [du[0] / Math.abs(du[0]), du[1] / Math.abs(du[0])]                       // one pixel across per glyph pixel
  dv = [0, 1]                                                                    // the columns stay upright (from above the face's uprights lie nearly flat)
  const w = widthOf(text), x0 = m[0] - (w / 2) * du[0] - 2.5 * dv[0], y0 = m[1] - (w / 2) * du[1] - 2.5 * dv[1]
  let gx = 0
  for (const ch of text) {
    const rows = glyphOf(ch)
    rows.forEach((row, gy) => [...row].forEach((on, i) => {
      if (on === "#") c.px(Math.round(x0 + (gx + i) * du[0] + gy * dv[0]), Math.round(y0 + (gx + i) * du[1] + gy * dv[1]), key)
    }))
    gx += rows[0].length + 1
  }
}
// the sign's words in its face (the face toward the camera, z = -0.15); the board's two lines in its own
const words = (c) => {
  centred(c, [0, 2.525, -0.16], [1, 0, 0], [0, -1, 0], "LINE 31 - CLOSED", "1")
  centred(c, [BOARD[0], 1.92, BOARD[1] - 0.06], [1, 0, 0], [0, -1, 0], "TIDE", "2")
  centred(c, [BOARD[0], 1.62, BOARD[1] - 0.06], [1, 0, 0], [0, -1, 0], "23:00", "2")
}
// Chapter 2 (kapitel2-design §9.1): police tape across the stair's head, from the railing's first post on one side to the other's, two
// strands sagging a little, striped light and dark; a picture of its own laid over the feed while it is there
const tape = (c) => {
  for (const [h, sag] of [[0.92, 0.08], [0.6, 0.06]]) {
    const A = [-HALF - 0.15, h, 0.4], B = [HALF + 0.15, h, 0.4], n = 90
    for (let i = 0; i <= n; i++) {
      const t = i / n, P = add(add(mul(A, 1 - t), mul(B, t)), [0, -sag * 4 * t * (1 - t), 0])
      const stripe = Math.floor(t * (2 * HALF + 0.3) / 0.22) % 2 ? "9" : "4"
      const [x, y] = at(CAM, P)
      c.px(x, y, stripe); c.px(x, y + 1, stripe)                                // two pixels wide, so it reads from up here
    }
  }
}

// ================================================================ what the game needs (game/places.js cam30)
const CAM30_LAYOUT = {
  // Thursday: from the street under the camera (off the picture's bottom) to the board; Friday: from the right (off the picture),
  // round the frame's right post to the stair's head, down the steps to the water and on under the arch, off the picture's top
  thuIn: spotAt(CAM, [5.5, 0, -1.5]), board: spotAt(CAM, STAND.board),
  friIn: spotAt(CAM, [9, 0, 2.5]), turn: spotAt(CAM, [2.6, 0, -0.7]), top: spotAt(CAM, [0.3, 0, -0.6]),
  water: spotAt(CAM, STAND.water), gone: spotAt(CAM, [0.3, -2.3, 16]),
  inesPx: [Math.round(personPx(CAM, STAND.board, 1.72)), Math.round(personPx(CAM, STAND.water, 1.72))],
  mic: spotAt(CAM, [0.5, 0, 0.5]),
  // the hotspots: the sign's face and the board, each its own outline
  polys: {
    sign: hullOf(CAM, boxCorners([-HALF - 0.3, 2.3, -0.15], [HALF + 0.3, 2.75, -0.15]), 0),
    tide: hullOf(CAM, boxCorners([BOARD[0] - 0.45, 1.4, BOARD[1] - 0.05], [BOARD[0] + 0.45, 2.1, BOARD[1] - 0.05]), 0),
  },
}
console.log("CAM30_LAYOUT " + JSON.stringify(CAM30_LAYOUT))

// ================================================================ the scenes
scene("cam30_bg", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), words)
scene("review_cam30", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), words, (c) => reviewFx(c, W, H))
scene("cam30_tape", { w: W, h: H }, tape)
scene("review_cam30_tape", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), words, tape)
