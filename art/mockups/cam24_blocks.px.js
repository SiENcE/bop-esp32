// Blocks for CAM 24, Wohnblock Lerche, the door (kapitel1-design §9: a doorbell camera, an extreme fisheye at eye height; the user
// kept the doc's view over the plan's on 2026-11-13). Feed mode, 320x180, the phosphor ramp only. A blockout in meters
// (art/lib/feed.js), flat materials, so only the layout is judged: where Ines comes home (Wednesday, Thursday 20:30) and where she
// leaves with her bag (Friday 22:15), how big she is, what of the forecourt and the street shows, what the display covers.
// The place: the doorbell beside Ines's front door, the door's frame right beside the lens; three steps down to a small forecourt
// with a low fence and a gate, the bins, a scooter; the street beyond, a lamp, the block across with its lit windows.
// Two framings:
//   A  straight out from the door: the frame and the bell's plate at the very left, the steps, the gate in the middle, the street
//   B  turned along the facade toward the door: the door and its frame and the wall bending round the lens on the left, the
//      forecourt and the gate on the right, the street at the far right
// Not built into the game.
//   PXL build art/mockups/cam24_blocks.px.js --out build/art/cam24_blocks --no-preview
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const VARIANTS = {
  a: makeCam({ pos: [0.75, 1.45, 0.08], yaw: -8, pitch: 6, F: 62, w: W, h: H, k: 0.55 }),
  b: makeCam({ pos: [0.75, 1.45, 0.08], yaw: -40, pitch: 6, F: 62, w: W, h: H, k: 0.55 }),
}

// ================================================================ the place, in meters (x along the facade, y up, z out from it)
const STEP = 0.17, LANDING = 1.1, FENCE = 4.2, KERB = 5.6
const PRIMS = [
  block([-8, -1, -1], [8, 8, 0], "facade"),                                         // the block's front
  block([-0.6, 3 * STEP, -0.15], [0.6, 2.3 + 3 * STEP, 0.02], "door"),              // Ines's front door
  block([-0.75, 3 * STEP, -0.1], [-0.6, 2.4 + 3 * STEP, 0.12], "frame"), block([0.6, 3 * STEP, -0.1], [0.75, 2.4 + 3 * STEP, 0.12], "frame"),
  block([-0.75, 2.3 + 3 * STEP, -0.1], [0.75, 2.45 + 3 * STEP, 0.12], "frame"),
  block([0.85, 1.2, 0], [1.6, 1.9, 0.12], "mail"),                                   // the mailboxes beside the door
  block([-1.6, 0, 0], [1.6, 3 * STEP, LANDING], "landing"),                         // the landing and the steps down
  block([-1.6, 0, LANDING], [1.6, 2 * STEP, LANDING + 0.3], "landing"), block([-1.6, 0, LANDING + 0.3], [1.6, STEP, LANDING + 0.6], "landing"),
  block([-8, -0.1, 0], [8, 0, KERB], "yard"),                                       // the forecourt
  block([-8, 0, FENCE], [-0.7, 0.9, FENCE + 0.08], "fence"), block([0.7, 0, FENCE], [8, 0.9, FENCE + 0.08], "fence"),   // the fence, its gap
  block([-0.75, 0, FENCE - 0.05], [-0.65, 1.1, FENCE + 0.12], "fence"), block([0.65, 0, FENCE - 0.05], [0.75, 1.1, FENCE + 0.12], "fence"),
  block([-3.4, 0, 2.2], [-2.2, 1.1, 2.9], "bin"), block([-2.1, 0, 2.2], [-0.9, 1.1, 2.9], "bin"),   // the bins
  block([2.2, 0.3, 2.6], [3.9, 0.9, 3.0], "scooter"), cyl(2.4, 2.8, 0.25, 0, 0.5, "scooter"), cyl(3.7, 2.8, 0.25, 0, 0.5, "scooter"),
  block([-12, -0.2, KERB], [12, 0, 14], "street"),
  cyl(3.2, KERB + 0.4, 0.07, 0, 4.2, "post"),                                        // a street lamp
  block([-14, 0, 14], [14, 12, 15], "across"),                                       // the block across the street
]
const LIGHTS = [
  { p: [0, 2.9, 0.4], I: 0.9, R: 3.2 },                                             // the lamp over the door
  { p: [3.2, 4.1, KERB + 0.4], I: 1.6, R: 8, shadow: true },                        // the street lamp
]
const MATS = {
  facade: (P) => ({ a: ((P[1] / 0.3) % 1 + 1) % 1 < 0.06 ? 0.2 : 0.3, e: 0 }), door: { a: 0.2, e: 0 }, frame: { a: 0.45, e: 0 },
  mail: (P) => ({ a: ((P[0] * 5) % 1 + 1) % 1 < 0.15 ? 0.25 : 0.45, e: 0 }),
  landing: (P, n) => ({ a: n[1] > 0.5 ? 0.42 : 0.3, e: 0, wet: 0.1 }), yard: { a: 0.3, e: 0, wet: 0.3, gloss: 0.2 },
  fence: { a: 0.4, e: 0 }, bin: { a: 0.22, e: 0 }, scooter: { a: 0.35, e: 0 },
  street: { a: 0.22, e: 0, wet: 0.5, gloss: 0.25 }, post: { a: 0.35, e: 0 },
  across: (P) => { const wx = ((P[0] + 30) % 2.2), fy = P[1] % 2.9; const win = wx > 0.6 && wx < 1.6 && fy > 0.9 && fy < 2.2; return { a: 0.18, e: win ? (ih(Math.floor((P[0] + 30) / 2.2), Math.floor(P[1] / 2.9)) > 0.6 ? 0.5 : 0.04) : 0 } },
  person: { a: 0.75, e: 0 }, head: { a: 0.3, e: 0 },
}
// Ines as a stand-in: at the gate (coming home) and on the forecourt halfway to the door
const STAND = { gate: [0, 0, FENCE + 0.4], yard: [0.2, 0, 2.4] }
const world = (at) => feedWorld({ prims: [...PRIMS, cyl(at[0], at[2], 0.22, at[1], at[1] + 1.45, "person"), cyl(at[0], at[2], 0.12, at[1] + 1.45, at[1] + 1.72, "head")],
  lights: LIGHTS, materials: MATS, ground: null, ambient: 0.2, sky: 0.02, rain: 1 })
const WORLDS = { gate: world(STAND.gate), yard: world(STAND.yard) }

const layout = (cam) => ({ gate: spotAt(cam, STAND.gate), yard: spotAt(cam, STAND.yard), door: spotAt(cam, [0, 3 * STEP, 0.6]),
  inesPx: [Math.round(personPx(cam, STAND.gate, 1.72)), Math.round(personPx(cam, STAND.yard, 1.72))] })
for (const [k, cam] of Object.entries(VARIANTS)) console.log(`CAM24_${k.toUpperCase()} ` + JSON.stringify(layout(cam)))

const OSD = [[0, 0, 108, 36], [168, 10, 152, 16], [2, 40, 76, 106], [268, 156, 52, 24]]
const osd = (c) => {
  for (const [x, y, w, h] of OSD) for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
    const edge = i === 0 || j === 0 || i === w - 1 || j === h - 1
    if (edge ? (i + j) % 2 === 0 : (i + j) % 4 === 0) c.px(x + i, y + j, edge ? "9" : "0")
  }
}
const label = (s) => (c) => { c.rect(W - 6 - s.length * 4 - 4, H - 12, s.length * 4 + 6, 9, "0"); TXT.draw(c, W - 6, H - 10, s, "9", { font: "hud", align: "right" }) }
for (const [k, cam] of Object.entries(VARIANTS)) {
  const bake = (w) => bakeFeed(cam, WORLDS[w], { exposure: 1.35, key: "cam24_" + k + w })
  scene(`cam24_blocks_${k}`, { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("gate")), (c) => reviewFx(c, W, H), label(k.toUpperCase() + "  AM TOR"))
  scene(`cam24_blocks_${k}_hof`, { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("yard")), (c) => reviewFx(c, W, H), osd, label(k.toUpperCase() + "  IM HOF, OSD"))
}
