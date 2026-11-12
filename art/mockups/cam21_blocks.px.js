// Blocks for CAM 21, Lull-Klinik 9-Ost, Eingang (kapitel1-design §9: the camera over the clinic's door, looking out; the
// queue comes toward us). Feed mode, 320x180, the phosphor ramp only. A blockout in meters (art/lib/feed.js) with flat
// materials, so only the layout is judged: where the queue stands, how big the people are, what of the street and of
// Pho Pump across the lane shows, and what the display covers (its zones drawn dotted in the "mit OSD" sheets).
// Two framings to choose from:
//   A  straight out: the camera on a bracket over the canopy's front edge, 5 m up, the queue running away from us
//   B  turned to the right: the same bracket, the lane runs from the bottom left up across the picture, the queue diagonal
// The place: the clinic's white porch (a wall each side, the right one with Nagi·wa's ring logo lit, the canopy over it),
// the queue between belt posts from the door out to the kerb, four tired people facing the door; the lane wet, Pho Pump
// across it, its window lit, a big menu board in it (GUEST WIFI PHO-2291 at its foot: CAM 22's code), its sign over it;
// the shops beside it shuttered. Ines leaves at 19:00 from under the camera and walks off to the left.
// Not built into the game.
//   PXL build art/mockups/cam21_blocks.px.js --out build/art/cam21_blocks --no-preview
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const VARIANTS = {
  a: makeCam({ pos: [0.3, 5.0, 1.0], yaw: 4, pitch: 30, F: 90, w: W, h: H, k: 0.18 }),
  b: makeCam({ pos: [-1.2, 5.0, 1.0], yaw: 22, pitch: 30, F: 90, w: W, h: H, k: 0.18 }),
}

// ================================================================ the place, in meters (x right, y up, z away from the door)
const KERB = 7.2, ACROSS = 12.0, FRONT = 13.4          // the near kerb, the far kerb, the shops' fronts across the lane
const PORCH = 1.1                                       // how far the porch's walls reach out
const LANE = [0.5, 1.7]                                 // the queue's lane between the belt posts (x)
const QUEUE = [3.2, 4.3, 5.4, 6.5]                      // where the four stand (z), the first nearest the door
const PHO = { win: [-1.2, 0.8, 2.6, 2.5], menu: [-0.1, 0.9, 1.6, 2.4], door: [2.8, 3.7], sign: [-1.3, 2.7, 3.7, 3.3] }

const PRIMS = [
  block([-12, 0, -1], [12, 0.15, KERB], "walk"),                        // the near pavement
  block([-12, 0, ACROSS], [12, 0.15, FRONT], "walk"),                   // the far one
  block([-12, -1, -2], [12, 9, 0], "facade"),                           // the clinic's front (behind the camera)
  block([-2.5, 0.15, 0], [-2.1, 3.3, PORCH], "porch"),                  // the porch's walls
  block([2.1, 0.15, 0], [2.5, 3.3, PORCH], "porch", { logo: true }),
  block([-2.5, 3.3, -0.2], [2.5, 3.55, PORCH + 0.1], "canopy"),         // its canopy (under the camera)
  block([2.05, 0.15, 2.7], [2.35, 2.3, 3.3], "totem"),                  // a white pylon by the queue, Nagi·wa's ring on its side
  block([-12, 0, FRONT], [12, 9, FRONT + 1], "across"),                 // the shops' fronts across the lane
]
// the belt posts and their belts, along both sides of the lane
for (const x of LANE) {
  for (let z = 0.9; z <= KERB - 0.4; z += 1.15) PRIMS.push(cyl(x, z, 0.04, 0.15, 1.05, "post"))
  PRIMS.push(block([x - 0.02, 0.86, 0.9], [x + 0.02, 0.94, KERB - 0.4], "belt"))
}
// the queue: four people facing the door (stand-ins: a body and a head)
QUEUE.forEach((z, i) => {
  const x = (LANE[0] + LANE[1]) / 2 + (i % 2 ? 0.08 : -0.06)
  PRIMS.push(cyl(x, z, 0.24, 0.15, 1.45, "person"), cyl(x, z, 0.13, 1.45, 1.75, "head"))
})
// across: Pho Pump's window, its menu board, its door, its sign; the shutters beside it; a lamp post on the near kerb
PRIMS.push(
  block([PHO.win[0], PHO.win[1], FRONT - 0.05], [PHO.win[2], PHO.win[3], FRONT], "window"),
  block([PHO.menu[0], PHO.menu[1], FRONT - 0.1], [PHO.menu[2], PHO.menu[3], FRONT - 0.06], "menu"),
  block([PHO.door[0], 0.15, FRONT - 0.05], [PHO.door[1], 2.2, FRONT], "phodoor"),
  block([PHO.sign[0], PHO.sign[1], FRONT - 0.3], [PHO.sign[2], PHO.sign[3], FRONT - 0.1], "sign"),
  block([-7.5, 0.15, FRONT - 0.05], [-1.6, 2.6, FRONT], "shutter"),
  block([4.0, 0.15, FRONT - 0.05], [8.5, 2.6, FRONT], "shutter"),
  cyl(-3.6, KERB - 0.3, 0.07, 0.15, 4.2, "post"), cyl(4.6, KERB - 0.3, 0.07, 0.15, 4.2, "post"),
)

const LIGHTS = [
  { p: [0, 3.1, 0.6], I: 1.5, R: 4.6, shadow: true },                  // the porch's cold panel under the canopy
  { p: [0.8, 4.6, 1.3], dir: [0, -0.75, 0.66], cone: 34, soft: 10, I: 2.2, R: 7, haze: 0.05, shadow: true },   // the clinic's floodlight over the queue
  { p: [0.8, 1.8, FRONT - 1.2], I: 0.7, R: 3.4 },                       // Pho Pump's window on the far pavement
  { p: [-3.6, 4.2, KERB - 0.5], I: 0.45, R: 6 },                        // the lamp posts
  { p: [4.6, 4.2, KERB - 0.5], I: 0.4, R: 6 },
  { p: [-4.5, 4.0, ACROSS + 0.4], I: 0.55, R: 6 },                      // a lamp across the lane, on the shutters
]
const MATS = {
  walk: { a: 0.4, e: 0, wet: 0.25, gloss: 0.2 },
  floor: { a: 0.22, e: 0, wet: 0.45, gloss: 0.25 },                     // the lane (the ground plane)
  facade: { a: 0.5, e: 0 },
  porch: (P, n, f, hit) => {
    // the right wall's inner face: Nagi·wa's ring logo, lit
    if (hit.prim.logo && n[0] < 0) { const r = Math.hypot(P[2] - 0.55, P[1] - 2.2); if (r < 0.42 && r > 0.27) return { a: 0.3, e: 0.9 } }
    return { a: 0.62, e: 0 }
  },
  canopy: { a: 0.55, e: 0.05 },
  totem: (P, n) => {
    if (n[0] < 0) { const r = Math.hypot(P[2] - 3.0, P[1] - 1.75); if (r < 0.24 && r > 0.15) return { a: 0.3, e: 1.0 } }
    return { a: 0.7, e: 0.15 }
  },
  across: { a: 0.18, e: 0 },
  post: { a: 0.45, e: 0 }, belt: { a: 0.3, e: 0.05 },
  person: { a: 0.18, e: 0 }, head: { a: 0.3, e: 0 },
  window: { a: 0.2, e: 0.55 }, menu: { a: 0.3, e: 0.95 }, phodoor: { a: 0.15, e: 0.12 },
  sign: { a: 0.3, e: 0.8 }, shutter: (P) => ({ a: ((P[1] * 6) % 1) < 0.25 ? 0.12 : 0.2, e: 0 }),
}
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ambient: 0.16, sky: 0.02, rain: 1 })

// ================================================================ what the game would need, measured (printed when built)
const layout = (cam) => ({
  door: spotAt(cam, [-0.3, 0.15, 2.6]), walkOff: spotAt(cam, [-6, 0.15, 5.2]),
  queue: QUEUE.map((z) => spotAt(cam, [(LANE[0] + LANE[1]) / 2, 0.15, z])),
  queuePx: QUEUE.map((z) => Math.round(personPx(cam, [(LANE[0] + LANE[1]) / 2, 0.15, z]))),
  ines: [Math.round(personPx(cam, [-0.3, 0.15, 2.6])), Math.round(personPx(cam, [-5, 0.15, 5.2]))],
  menu: rectOf(cam, [[PHO.menu[0], PHO.menu[1], FRONT], [PHO.menu[2], PHO.menu[1], FRONT], [PHO.menu[0], PHO.menu[3], FRONT], [PHO.menu[2], PHO.menu[3], FRONT]]),
})
for (const [k, cam] of Object.entries(VARIANTS)) console.log(`CAM21_${k.toUpperCase()} ` + JSON.stringify(layout(cam)))

// ---------------------------------------------------------------- the sheets
// the display's zones (screens.js): the place's text top left, the buttons top right, the cameras' strip, the corner icons
const OSD = [[0, 0, 108, 36], [168, 10, 152, 16], [2, 40, 76, 106], [268, 156, 52, 24]]
const osd = (c) => {
  for (const [x, y, w, h] of OSD) for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
    const edge = i === 0 || j === 0 || i === w - 1 || j === h - 1
    if (edge ? (i + j) % 2 === 0 : (i + j) % 4 === 0) c.px(x + i, y + j, edge ? "9" : "0")
  }
}
const label = (s) => (c) => { c.rect(W - 6 - s.length * 4 - 4, H - 12, s.length * 4 + 6, 9, "0"); TXT.draw(c, W - 6, H - 10, s, "9", { font: "hud", align: "right" }) }
for (const [k, cam] of Object.entries(VARIANTS)) {
  const bake = () => bakeFeed(cam, WORLD, { exposure: 1.2, key: "cam21_" + k })
  scene(`cam21_blocks_${k}`, { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake()), (c) => reviewFx(c, W, H), label(k.toUpperCase()))
  scene(`cam21_blocks_${k}_osd`, { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake()), (c) => reviewFx(c, W, H), osd, label(k.toUpperCase() + " MIT OSD"))
}
