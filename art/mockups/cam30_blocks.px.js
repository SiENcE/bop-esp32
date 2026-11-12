// Blocks for CAM 30, the Sumpf-Abgang (kapitel1-design §9: a stair down into the water, the old entrance to LINE 31, CLOSED, a tide
// board beside it, LOW TIDE FRI 23:00). Feed mode, 320x180, the phosphor ramp only. A blockout in meters (art/lib/feed.js) with flat
// materials, so only the layout is judged: where Ines stands at the board on Thursday and where she goes down on Friday, how big she
// is, what of the stair, the water and the street shows, and what the display covers ("mit OSD").
// The place: the street's edge, a railing round a stair well going down toward the old station; the steps run into black water
// (the tide high now; on Friday at 23:00 it is low and the steps go on, kapitel1-design); over the stair's head a frame with the
// sign LINE 31 – CLOSED and a chain; beside it on a post the tide board, lit; at the far end, half under water, the station's arch.
// Three views (the user's rule of 2026-11-12: each camera gets the view that fits it best):
//   A  low at the water, looking up the stair (the doc's): the water and its reflections in front, the steps rising to the street's
//      light, the sign and the board at the top; Ines comes down toward us
//   B  frontal, from the frame at the stair's head, straight down the flight: the steps going away from us into the water, the
//      arch at the end, the board on the right; Ines walks away from us into it
//   C  high and from the side, near iso: the stair well cut across the picture, the street above, the water below, the board by
//      the head of the stair
// Not built into the game.
//   PXL build art/mockups/cam30_blocks.px.js --out build/art/cam30_blocks --no-preview
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const VARIANTS = {
  a: makeCam({ pos: [-0.4, -1.5, 8.6], yaw: 180, pitch: -12, F: 100, w: W, h: H, k: 0.16 }),
  b: makeCam({ pos: [0.2, 3.6, -2.6], yaw: 0, pitch: 30, F: 95, w: W, h: H, k: 0.12 }),
  c: makeCam({ pos: [6.2, 5.2, -2.2], yaw: -58, pitch: 33, F: 175, w: W, h: H, k: 0.08 }),
}

// ================================================================ the place, in meters (x across the stair, y up from the street, z down the stair)
const HALF = 1.3, STEPS = 18, RISE = 0.2, TREAD = 0.33, WATER = -2.3
const FOOT = STEPS * TREAD                                   // where the flight ends (z), at y = -STEPS * RISE
const BOARD = [2.2, 0.6]                                     // the tide board's post (x, z), by the head of the stair
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
  { p: [0, -2.0, FOOT + 2.6], I: 0.25, R: 3 },                             // a faint light in the old station
]
const MATS = {
  street: { a: 0.3, e: 0, wet: 0.35, gloss: 0.2 }, wall: { a: 0.26, e: 0 },
  arch: (P) => { const r = Math.hypot(P[0], P[1] + 3.2); return { a: r < 1.3 ? 0.04 : 0.24, e: r < 1.3 && r > 1.15 ? 0.12 : 0 } },
  water: { a: 0.04, e: 0, wet: 0.95, gloss: 0.4 },
  step: (P, n, f, hit) => ({ a: n[1] > 0.5 ? 0.42 - hit.prim.i * 0.008 : 0.24, e: 0, wet: 0.2 }),
  frame: { a: 0.4, e: 0 }, sign: { a: 0.3, e: 0.7 }, chain: { a: 0.5, e: 0 },
  post: { a: 0.35, e: 0 }, board: { a: 0.3, e: 0.85 }, rail: { a: 0.45, e: 0 },
  person: { a: 0.7, e: 0 }, head: { a: 0.3, e: 0 },
}
// Ines as a stand-in, where she stands on Thursday (at the board) and Friday (at the water's edge), one world each
const STAND = { board: [BOARD[0] - 0.7, 0, BOARD[1] + 0.3], water: [0.2, -2.2, (2.2 / RISE) * TREAD - 0.2] }
const world = (at) => feedWorld({ prims: [...PRIMS, cyl(at[0], at[2], 0.22, at[1], at[1] + 1.45, "person"), cyl(at[0], at[2], 0.12, at[1] + 1.45, at[1] + 1.72, "head")],
  lights: LIGHTS, materials: MATS, ground: null, ambient: 0.22, sky: 0.02, rain: 1 })
const WORLDS = { board: world(STAND.board), water: world(STAND.water) }

// ================================================================ what the game would need, measured (printed when built)
const layout = (cam) => ({
  top: spotAt(cam, [0, 0, -0.4]), board: spotAt(cam, STAND.board), water: spotAt(cam, STAND.water),
  inesPx: [Math.round(personPx(cam, STAND.board, 1.72)), Math.round(personPx(cam, STAND.water, 1.72))],
})
for (const [k, cam] of Object.entries(VARIANTS)) console.log(`CAM30_${k.toUpperCase()} ` + JSON.stringify(layout(cam)))

// ---------------------------------------------------------------- the sheets
const OSD = [[0, 0, 108, 36], [168, 10, 152, 16], [2, 40, 76, 106], [268, 156, 52, 24]]
const osd = (c) => {
  for (const [x, y, w, h] of OSD) for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
    const edge = i === 0 || j === 0 || i === w - 1 || j === h - 1
    if (edge ? (i + j) % 2 === 0 : (i + j) % 4 === 0) c.px(x + i, y + j, edge ? "9" : "0")
  }
}
const label = (s) => (c) => { c.rect(W - 6 - s.length * 4 - 4, H - 12, s.length * 4 + 6, 9, "0"); TXT.draw(c, W - 6, H - 10, s, "9", { font: "hud", align: "right" }) }
for (const [k, cam] of Object.entries(VARIANTS)) {
  const bake = (w) => bakeFeed(cam, WORLDS[w], { exposure: 1.4, key: "cam30_" + k + w })
  scene(`cam30_blocks_${k}`, { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("board")), (c) => reviewFx(c, W, H), label(k.toUpperCase() + "  DO, TAFEL"))
  scene(`cam30_blocks_${k}_fr`, { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("water")), (c) => reviewFx(c, W, H), osd, label(k.toUpperCase() + "  FR, WASSER, OSD"))
}
