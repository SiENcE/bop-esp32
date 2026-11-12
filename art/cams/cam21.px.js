// CAM 21, Lull-Klinik 9-Ost, Eingang: the clinic's camera on a bracket over the front edge of its canopy, 5 m up, looking out and
// 30° down, turned to the right, so the queue runs across the picture toward its door under us. Feed mode, 320x180, the phosphor
// ramp only (style guide §9). The user chose the blocks B of two (art/mockups/cam21_blocks.px.js, docs/cams/cam21_blocks_vergleich_x3.png,
// 2026-11-12); this paints on their lines: the same place in meters, the same camera.
// What is in it: the clinic's white porch (its walls tiled, the right one's inner face with Nagi·wa's ring lit), the white pylon
// with the ring by the queue, the belt posts and their belts from the door out to the kerb, the painted wait lines on the slabs;
// the clinic's floodlight a cold white pool on the pavement; the kerb, the gutter and a drain; the wet lane with Pho Pump's light
// in its puddles; across it Pho Pump: its sign, its lit window with the big menu board in it (rows of dishes, GUEST WIFI PHO-2291
// at its foot: CAM 22's code, clicked here), its door; the shops beside it shuttered and tagged; lamp posts on both kerbs, a bin.
// The queue (four commuters, 22 to 26 px) and Ines stand in it as the game's actors; where: CAM21_LAYOUT at the end of this file
// (printed when built), copied into game/places.js (cam21).
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [-1.2, 5.0, 1.0], yaw: 22, pitch: 30, F: 90, w: W, h: H, k: 0.18 })

// ================================================================ the place, in meters (x right, y up, z away from the door)
const KERB = 7.2, ACROSS = 12.0, FRONT = 13.4          // the near kerb, the far kerb, the shops' fronts across the lane
const PORCH = 1.1                                       // how far the porch's walls reach out
const LANE = [0.5, 1.7]                                 // the queue's lane between the belt posts (x)
const QUEUE = [3.2, 4.3, 5.4, 6.5]                      // where the four stand (z), the first nearest the door
const PHO = { win: [-1.2, 0.8, 2.6, 2.5], menu: [-0.1, 0.9, 1.6, 2.4], door: [2.8, 3.7], sign: [-1.3, 2.7, 3.7, 3.3] }
const LOGO = { z: 0.55, y: 2.2, r: 0.42 }               // Nagi·wa's ring on the porch's right wall, inside

const PRIMS = [
  block([-12, 0, -1], [12, 0.15, KERB - 0.25], "walk"),                 // the near pavement
  block([-12, 0, KERB - 0.25], [12, 0.15, KERB], "kerb"),               // its kerb stones
  block([-12, 0, ACROSS], [12, 0.15, FRONT], "walk"),                   // the far pavement
  block([-12, 0, ACROSS], [12, 0.15, ACROSS + 0.2], "kerb"),
  block([-12, -1, -2], [12, 9, 0], "facade"),                           // the clinic's front (behind the camera)
  block([-2.5, 0.15, 0], [-2.1, 3.3, PORCH], "porch"),                  // the porch's walls
  block([2.1, 0.15, 0], [2.5, 3.3, PORCH], "porch", { logo: true }),
  block([-2.5, 3.3, -0.2], [2.5, 3.55, PORCH + 0.1], "canopy"),         // its canopy (under the camera)
  block([2.05, 0.15, 2.7], [2.35, 2.3, 3.3], "totem"),                  // a white pylon by the queue, Nagi·wa's ring on its side
  block([-12, 0, FRONT], [12, 9, FRONT + 1], "across"),                 // the shops' fronts across the lane
  cyl(-3.2, 1.6, 0.28, 0.15, 1.05, "bin"),                              // a bin by the porch
]
// the belt posts and their belts, along both sides of the lane
for (const x of LANE) {
  for (let z = 0.9; z <= KERB - 0.4; z += 1.15) PRIMS.push(cyl(x, z, 0.04, 0.15, 1.05, "post"), cyl(x, z, 0.17, 0.15, 0.2, "post"))
  PRIMS.push(block([x - 0.02, 0.86, 0.9], [x + 0.02, 0.94, KERB - 0.4], "belt"))
}
// across: Pho Pump's window, its menu board, its door, its sign; the shutters beside it; the lamp posts, their heads
PRIMS.push(
  block([PHO.win[0], PHO.win[1], FRONT - 0.05], [PHO.win[2], PHO.win[3], FRONT], "window"),
  block([PHO.menu[0], PHO.menu[1], FRONT - 0.1], [PHO.menu[2], PHO.menu[3], FRONT - 0.06], "menu"),
  block([PHO.door[0], 0.15, FRONT - 0.05], [PHO.door[1], 2.2, FRONT], "phodoor"),
  block([PHO.sign[0], PHO.sign[1], FRONT - 0.3], [PHO.sign[2], PHO.sign[3], FRONT - 0.1], "sign"),
  block([PHO.win[0] - 0.1, PHO.win[3], FRONT - 0.45], [PHO.door[1] + 0.1, PHO.win[3] + 0.08, FRONT], "awning"),
  block([-7.5, 0.15, FRONT - 0.05], [-1.6, 2.6, FRONT], "shutter", { tag: 0 }),
  block([4.0, 0.15, FRONT - 0.05], [8.5, 2.6, FRONT], "shutter", { tag: 1 }),
  cyl(-3.6, KERB - 0.3, 0.07, 0.15, 4.2, "lamppost"), cyl(4.6, KERB - 0.3, 0.07, 0.15, 4.2, "lamppost"),
  block([-3.6, 4.1, KERB - 0.9], [-3.45, 4.22, KERB - 0.25], "lamppost"), block([4.6, 4.1, KERB - 0.9], [4.75, 4.22, KERB - 0.25], "lamppost"),
  cyl(-4.5, ACROSS + 0.5, 0.06, 0.15, 3.8, "lamppost"),
)

const LIGHTS = [
  { p: [0, 3.1, 0.6], I: 1.5, R: 4.6, shadow: true },                  // the porch's cold panel under the canopy
  { p: [0.8, 4.6, 1.3], dir: [0, -0.75, 0.66], cone: 34, soft: 10, I: 1.5, R: 7, haze: 0.05, shadow: true },   // the clinic's floodlight over the queue
  { p: [0.8, 1.8, FRONT - 1.2], I: 0.8, R: 3.6 },                       // Pho Pump's window on the far pavement
  { p: [-3.6, 4.0, KERB - 0.6], I: 0.45, R: 6 },                        // the lamp posts
  { p: [4.6, 4.0, KERB - 0.6], I: 0.4, R: 6 },
  { p: [-4.5, 3.7, ACROSS + 0.4], I: 0.55, R: 6 },                      // a lamp across the lane, on the shutters
]

// ---------------------------------------------------------------- materials
const slabs = (x, z, s = 0.6) => ((x / s) % 1 + 1) % 1 < 0.05 || ((z / s) % 1 + 1) % 1 < 0.05
const puddle = (x, z, k = 0.6) => clamp((fbm(x * k + 3, z * k, 3) - 0.52) * 4, 0, 0.9)
// the painted wait lines across the queue's lane, one before each who waits, worn
const waitLine = (x, z) => x > LANE[0] + 0.08 && x < LANE[1] - 0.08 && QUEUE.some((q) => Math.abs(z - (q - 0.35)) < 0.05) && ih(Math.floor(x * 20), Math.floor(z * 20), 3) > 0.25
// a tag sprayed on a shutter: a few thick strokes, darker
const tagAt = (x, y, t) => {
  const cx = t ? 6.1 : -4.6, u = x - cx, v = y - 1.4
  return Math.abs(v - 0.25 * Math.sin(u * 3.1 + t)) < 0.09 && Math.abs(u) < 1.2 || Math.abs(u + 0.9) < 0.07 && Math.abs(v) < 0.4
}
const MATS = {
  walk: (P, n) => {
    if (n[1] <= 0.5) return { a: 0.3, e: 0 }
    const [x, , z] = P
    if (waitLine(x, z)) return { a: 0.75, e: 0, wet: 0.1 }
    return { a: slabs(x, z) ? 0.28 : 0.4 + 0.05 * (fbm(x, z, 2) - 0.5), e: 0, wet: 0.15 + puddle(x, z) * 0.6, gloss: 0.2 }
  },
  kerb: (P, n) => ({ a: n[1] > 0.5 ? 0.5 : 0.3, e: 0, wet: 0.1 }),
  // the lane: wet asphalt, a gutter along each kerb, a drain, a manhole, the puddles where it sags
  floor: (P) => {
    const [x, , z] = P
    if (Math.abs(x - 1.9) < 0.3 && z > KERB && z < KERB + 0.35) return { a: ((x * 10) % 1 + 1) % 1 < 0.4 ? 0.06 : 0.3, e: 0 }   // the drain
    if (Math.hypot(x + 1.8, z - 9.6) < 0.35) return { a: Math.hypot(x + 1.8, z - 9.6) > 0.3 ? 0.35 : 0.24, e: 0, wet: 0.2 }    // the manhole
    const gutter = z < KERB + 0.3 || z > ACROSS - 0.3
    return { a: gutter ? 0.16 : 0.22 + 0.04 * (fbm(x * 1.5, z * 1.5, 2) - 0.5), e: 0, wet: gutter ? 0.75 : 0.35 + puddle(x, z, 0.45) * 0.6, gloss: 0.25 }
  },
  facade: { a: 0.5, e: 0 },
  porch: (P, n, f, hit) => {
    const [, y, z] = P
    // the right wall's inner face: Nagi·wa's ring logo, lit
    if (hit.prim.logo && n[0] < 0) { const r = Math.hypot(z - LOGO.z, y - LOGO.y); if (r < LOGO.r && r > LOGO.r - 0.15) return { a: 0.3, e: 0.9 } }
    const tile = ((y / 0.3) % 1 + 1) % 1 < 0.06 || ((z / 0.3) % 1 + 1) % 1 < 0.06
    return { a: tile ? 0.5 : 0.68, e: 0 }
  },
  canopy: { a: 0.55, e: 0.05 },
  totem: (P, n) => {
    if (n[0] < 0) { const r = Math.hypot(P[2] - 3.0, P[1] - 1.75); if (r < 0.24 && r > 0.15) return { a: 0.3, e: 1.0 } }
    if (n[0] < 0 && P[1] > 0.6 && P[1] < 1.2 && Math.abs(P[2] - 3.0) < 0.2) return { a: 0.3, e: ((P[1] * 12) % 1) < 0.4 ? 0.45 : 0.1 }   // its small screen
    return { a: 0.72, e: 0.12 }
  },
  // the storeys over the shops: a slab line each floor, windows, a few lit; a vertical sign hanging out on the left
  across: (P) => {
    const [x, y] = P
    if (y > 3.0 && Math.abs(x + 6.3) < 0.35 && y < 7.5) return { a: 0.2, e: ((y * 2.2) % 1) < 0.7 ? 0.75 : 0.2 }
    if (y > 3.2 && ((y - 3.2) % 2.8) < 0.15) return { a: 0.26, e: 0 }
    const wx = ((x + 30) % 1.9), fy = (y - 3.2) % 2.8
    if (y > 3.2 && wx > 0.5 && wx < 1.4 && fy > 0.7 && fy < 2.1) { const n = ih(Math.floor((x + 30) / 1.9), Math.floor((y - 3.2) / 2.8), 9); return { a: 0.1, e: n > 0.78 ? 0.42 : n > 0.62 ? 0.16 : 0.02 } }
    return { a: 0.16, e: 0 }
  },
  post: { a: 0.5, e: 0 }, belt: { a: 0.3, e: 0.05 }, bin: (P, n) => ({ a: n[1] > 0.5 ? 0.1 : 0.32, e: 0 }),
  lamppost: { a: 0.35, e: 0 },
  // Pho Pump: its window glowing, the menu board in it bright with rows of dishes, the sign, the awning, the door's glass
  window: (P) => {
    const [x, y] = P
    if (y > 1.9 && y < 2.0) return { a: 0.2, e: 0.25 }                                 // the window's transom bar
    if (y < 1.05 && Math.abs(((x + 2) % 0.7) - 0.35) < 0.12) return { a: 0.2, e: 0.18 }  // the stools inside, dark against the light
    return { a: 0.2, e: 0.32 }
  },
  menu: (P) => {
    const [x, y] = P, row = ((y - PHO.menu[1]) / 0.26)
    if (y < PHO.menu[1] + 0.2) return { a: 0.3, e: x < PHO.menu[0] + 1.1 ? 0.12 : 0.7 }    // GUEST WIFI along its foot
    if (row % 1 < 0.4 && x > PHO.menu[0] + 0.15 && x < PHO.menu[2] - 0.15 && !(x > PHO.menu[2] - 0.5 && x < PHO.menu[2] - 0.38)) return { a: 0.3, e: 0.12 }
    return { a: 0.3, e: 0.72 }
  },
  phodoor: (P) => ({ a: 0.15, e: P[1] > 0.4 && P[1] < 1.9 && Math.abs(P[0] - 3.25) < 0.35 ? 0.3 : 0.06 }),
  sign: { a: 0.3, e: 0.85 },
  awning: (P, n) => ({ a: n[1] > 0.5 ? 0.3 : 0.2, e: 0, wet: 0.1 }),
  shutter: (P, n, f, hit) => {
    const [x, y] = P
    if (tagAt(x, y, hit.prim.tag)) return { a: 0.08, e: 0 }
    return { a: ((y * 6) % 1) < 0.25 ? 0.12 : 0.21, e: 0 }
  },
}
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ambient: 0.16, sky: 0.02, rain: 1 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.12, key: "cam21" })

// ---------------------------------------------------------------- hand drawing on top
// Pho Pump's name in its sign, the menu's last line (the code is read in the game, this only shows there is something), OPEN on its door
const words = (c) => {
  const [sx, sy] = at(CAM, [(PHO.sign[0] + PHO.sign[2]) / 2, (PHO.sign[1] + PHO.sign[3]) / 2 + 0.12, FRONT - 0.3])
  TXT.draw(c, sx, sy - 3, "PHO PUMP", "1", { font: "hud", align: "center" })
  const [dx, dy] = at(CAM, [3.25, 1.6, FRONT - 0.06])
  c.rect(dx - 3, dy - 1, 7, 3, "8"); c.hline(dx - 2, dy, 5, "4")
}

// ================================================================ what the game needs (game/places.js cam21)
const CAM21_LAYOUT = {
  // Ines comes out from under the canopy and goes off to the left along the pavement, kept above the bottom's bar (the satchel's)
  door: spotAt(CAM, [-0.4, 0.15, 3.9]), walkOff: spotAt(CAM, [-6.5, 0.15, 6.4]),
  ines: [Math.round(personPx(CAM, [-0.4, 0.15, 3.9])), Math.round(personPx(CAM, [-6.5, 0.15, 6.4]))],
  queue: QUEUE.map((z) => spotAt(CAM, [(LANE[0] + LANE[1]) / 2, 0.15, z])),
  queuePx: QUEUE.map((z) => Math.round(personPx(CAM, [(LANE[0] + LANE[1]) / 2, 0.15, z]))),
  mic: spotAt(CAM, [(LANE[0] + LANE[1]) / 2, 1.2, 4.8]),
  menu: rectOf(CAM, [[PHO.menu[0], PHO.menu[1], FRONT], [PHO.menu[2], PHO.menu[1], FRONT], [PHO.menu[0], PHO.menu[3], FRONT], [PHO.menu[2], PHO.menu[3], FRONT]]),
  // the clinic's hotspot: the porch's right wall with its ring and the pylon, each its own outline
  polys: {
    porch: hullOf(CAM, boxCorners([2.1, 0.15, 0], [2.5, 3.3, PORCH]), 0),
    totem: hullOf(CAM, boxCorners([2.05, 0.15, 2.7], [2.35, 2.3, 3.3]), 0),
  },
}
console.log("CAM21_LAYOUT " + JSON.stringify(CAM21_LAYOUT))

// ================================================================ the scenes
scene("cam21_bg", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), words)
// review: the engine's artefacts imitated (not shipped: the atlas takes cam* only)
scene("review_cam21", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), words, (c) => reviewFx(c, W, H))
