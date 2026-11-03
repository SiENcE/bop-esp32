// CAM 03, Ostbrücke: the pedestrian bridge in front of the Pumpenverwaltung Ost (the pump
// authority's office block). Feed mode, 320x180, the phosphor ramp only (style guide §9).
// The camera hangs on a street lamp at the office side's kerb, 6.2 m up, looking 45 degrees down
// along the bridge. Left: the office's lit lobby front and its entrance under a deep GLASS canopy
// (the camera sees through it: people stand there, out of the rain, right under the camera). On the
// right the bridge deck, wet, puddled; across it the far pavement at the railing, with a camera on a
// mast (its maintenance sticker is a zoom target) and beyond the railing the drop to the lower city.
// A noodle vending machine stands by the door (its keypad is a zoom target).
// Prologue (docs/kapitel0-design.md §6.2 steps 2-5): 22:00, people leave the office; Kessler waits
// under the canopy, phones, then walks off right toward Yuen's.
// Built from a blockout in meters (art/lib/feed.js); the geometry the game needs is measured from
// the same camera at the end of this file (docs/cams/cam03_layout.md).
include("../lib/feed.js")
pal({ ...PHOSPHOR, C: "#3ff2ff", c: "#1a8fa0", Y: "#ffd83a", R: "#ff2a3c" })   // C c Y R: review images only
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [0.8, 6.4, -3], yaw: -4, pitch: 41, F: 150, w: W, h: H, k: 0.16 })
const AT = (P) => at(CAM, P)

// ================================================================ the place, in meters
// x across the bridge (right), y up, z along it (away). The office front stands at x = XF.
const XF = -5.0                     // the office front
const KERB = 0.6                    // the office pavement's kerb (the lamp stands on it)
const XP = 6.4                      // the far pavement starts
const XR = 8.6                      // the railing, the deck's edge
const CAN = { x0: XF, x1: 0.2, z0: -2.0, z1: 11.6, y: 3.55 }    // the glass canopy, out to the kerb
const DOOR = [6.4, 8.4]             // the entrance (double glass door), along z
const LOBBY = [2.2, 12.8]           // the lobby's glass front, along z
const VEND = { x0: XF + 0.15, x1: XF + 1.15, z0: 4.9, d: 0.8, h: 1.9 }   // the noodle vending machine, side-on to the front, facing down the pavement
const MAST = { x: 7.7, z: 6.6, h: 3.3 }                     // the camera mast across the bridge
const HOUSING = { a: [6.85, 2.86, MAST.z - 0.22], b: [7.6, 3.22, MAST.z + 0.22] }   // its camera, looking back down the bridge
const LAMP2 = [8.1, 4.9, 14.5]      // a lamp on the far railing
const BOLLARDS = [0.5, 4.5, 12.5, 16.5, 20.5].map((z) => [XR - 0.35, z])   // low lights along the far railing
const PUD = (x, z) => clamp((fbm(x * 0.55 + 3, z * 0.8 + 7, 3) - 0.44) * 7, 0, 1)

const PRIMS = [
  block([-40, -1, -20], [XR, 0, 80], "deck"),
  block([-40, 0, -20], [KERB, 0.15, 80], "pave"),              // the office pavement
  block([XP, 0, -20], [XR, 0.15, 80], "pave"),                 // the far pavement
  block([-40, 0, -20], [XF, 30, 80], "office"),
  block([XR, -60, -80], [200, -59, 200], "below"),             // the lower city, far down
  block([VEND.x0, 0.15, VEND.z0], [VEND.x1, VEND.h, VEND.z0 + VEND.d], "vend"),
  block([CAN.x0, CAN.y, CAN.z0], [CAN.x1, CAN.y + 0.12, CAN.z1], "glass", { shadow: false }),
  block([CAN.x1 - 0.12, CAN.y - 0.25, CAN.z0], [CAN.x1, CAN.y + 0.14, CAN.z1], "steel"),           // the canopy's front beam
  cyl(CAN.x1 - 0.06, CAN.z0 + 0.2, 0.09, 0.15, CAN.y, "steel"),
  cyl(CAN.x1 - 0.06, CAN.z1 - 0.2, 0.09, 0.15, CAN.y, "steel"),
  block([XR - 0.06, 1.0, -20], [XR + 0.04, 1.08, 80], "rail"),   // the railing's handrail
  block([XR - 0.04, 0.5, -20], [XR + 0.02, 0.54, 80], "rail"),   // its middle rail
  cyl(MAST.x, MAST.z, 0.08, 0.15, MAST.h, "steel"),
  block([HOUSING.b[0], 3.0, MAST.z - 0.05], [MAST.x, 3.08, MAST.z + 0.05], "steel"),
  block([HOUSING.a[0] - 0.12, HOUSING.b[1], HOUSING.a[2] - 0.03], [HOUSING.b[0] + 0.02, HOUSING.b[1] + 0.04, HOUSING.b[2] + 0.03], "hood"),   // its sun hood
  block(HOUSING.a, HOUSING.b, "housing"),
  cyl(LAMP2[0], LAMP2[2], 0.08, 0.15, LAMP2[1], "steel"),
  block([LAMP2[0] - 0.9, LAMP2[1] - 0.15, LAMP2[2] - 0.2], [LAMP2[0], LAMP2[1], LAMP2[2] + 0.2], "lamphead"),
  block([1.4, 0, 13.5], [2.4, 0.9, 14.4], "planter"),          // a concrete planter in the deck's middle
  block([XF + 0.1, 0.15, 13.4], [XF + 0.7, 1.0, 14.0], "bin"),   // a bin by the office
]
for (let z = -20; z < 80; z += 2) PRIMS.push(cyl(XR - 0.02, z, 0.04, 0.15, 1.05, "rail"))   // the railing's posts
for (const [x, z] of BOLLARDS) PRIMS.push(cyl(x, z, 0.11, 0.15, 0.85, "bollard"))

const LIGHTS = [
  { p: [0.6, 6.0, -2.4], I: 1.1, R: 6.0, shadow: true },                       // the camera's own lamp
  { p: [-2.6, 3.35, 4.0], I: 1.1, R: 2.6, shadow: true },                     // downlights under the canopy
  { p: [-2.6, 3.35, 7.4], I: 1.1, R: 2.6, shadow: true },
  { p: [-2.6, 3.35, 10.6], I: 1.1, R: 2.6, shadow: true },
  { p: [XF + 0.5, 1.6, 7.4], I: 1.1, R: 3.0 },                                // the lobby's light, through the doors
  { p: [XF + 0.6, 1.4, 10.5], I: 0.45, R: 2.4 },
  { p: [(VEND.x0 + VEND.x1) / 2, 1.2, VEND.z0 - 0.5], I: 0.55, R: 1.6 },     // the vending machine
  { p: [LAMP2[0] - 0.7, LAMP2[1] - 0.3, LAMP2[2]], I: 1.1, R: 4.5, shadow: true },   // the far lamp
  ...BOLLARDS.map(([x, z]) => ({ p: [x - 0.25, 0.8, z], I: 0.55, R: 1.7 })),
]

// ---------------------------------------------------------------- materials
const MATS = {
  deck: (P) => {
    const [x, , z] = P
    let a = 0.2 + 0.07 * fbm(x * 1.7, z * 1.7, 3)
    if ((Math.abs(((z + 40) % 3) - 0.02) < 0.04) && x > KERB && x < XP) a *= 0.6                // expansion joints across the deck
    if (Math.abs(x - 3.5) < 0.07 && (Math.floor(z * 0.8) & 1)) a = 0.34                          // a worn centre line
    if (Math.abs(x - 2.0) < 0.38 && Math.abs(z - 9.5) < 0.38) a = (Math.floor((x + 9) * 9) & 1) ? 0.05 : 0.38   // a drain grate
    return { a, e: 0, wet: PUD(x, z) }
  },
  pave: (P, n) => {
    const [x, , z] = P
    if (n[1] < 0.5) return { a: 0.42, e: 0 }                                                     // the kerb's face
    // slabs 0.6 x 0.6 m, each a touch different, dark joints
    const sx = Math.floor(x / 0.6), sz = Math.floor(z / 0.6), jx = (x / 0.6) % 1, jz = (z / 0.6) % 1
    let a = 0.28 + 0.05 * (ih(sx, sz, 4) - 0.5)
    if (jx < 0.06 || jz < 0.06) a *= 0.7
    // under the canopy: dry; a drip line along its front edge
    const under = x > CAN.x0 && x < CAN.x1 && z > CAN.z0 && z < CAN.z1
    if (under) return { a: a + 0.04, e: 0, wet: 0, gloss: 0.05 }
    const drip = Math.abs(x - CAN.x1 - 0.1) < 0.12 && z > CAN.z0 && z < CAN.z1
    return { a, e: 0, wet: drip ? 0.8 : PUD(x, z) * 0.7 }
  },
  office: (P, n) => {
    const [, y, z] = P
    if (n[0] < 0.5) return { a: 0.25, e: 0 }
    // the lobby front: glass between mullions, the lobby lit inside, the doors brighter
    if (y < 3.3 && z > LOBBY[0] && z < LOBBY[1]) {
      if (z > DOOR[0] && z < DOOR[1]) {
        const mid = Math.abs(z - (DOOR[0] + DOOR[1]) / 2) < 0.05, rim = z - DOOR[0] < 0.08 || DOOR[1] - z < 0.08
        if (y > 2.5) return { a: 0.4, e: 0.15 }                                                  // the transom
        if (mid || rim) return { a: 0.45, e: 0 }
        if (Math.abs(y - 1.05) < 0.04) return { a: 0, e: 0.3 }                                   // push bars
        return { a: 0, e: 1.25 }
      }
      if (((z - LOBBY[0]) % 1.5) < 0.09) return { a: 0.45, e: 0 }                                // mullions
      if (y < 0.35) return { a: 0.35, e: 0 }                                                     // the base
      let e = 0.85 + 0.12 * Math.sin(z * 2.1)
      if (z > 9.2 && z < 10.6 && y > 0.4 && y < 1.15) e = 0.12                                   // the reception desk, dark against the light
      if (z > 3.0 && z < 3.7 && y > 0.3 && y < 1.6 - Math.abs(z - 3.35) * 1.5) e = 0.3          // a potted plant
      return { a: 0, e }
    }
    if (y < 3.3) return { a: 0.32 * (0.8 + 0.3 * vnoise(z * 3, y * 3)), e: 0 }                  // stone cladding
    if (y < 4.3) return { a: 0.3, e: 0 }                                                         // the fascia over the canopy
    // the floors above: a row of windows each 3.4 m, a few still lit (the cleaners)
    const fl = Math.floor((y - 4.3) / 3.4), fy = (y - 4.3) % 3.4, wz = (z + 40) % 1.8, wi = Math.floor((z + 40) / 1.8)
    if (fy > 0.9 && fy < 2.7 && wz > 0.2 && wz < 1.6) return { a: 0.05, e: ih(wi, fl, 5) < 0.18 ? 0.6 : 0 }
    return { a: 0.3, e: 0 }
  },
  vend: (P, n) => {
    const [x, y] = P
    if (n[2] > -0.5) return { a: n[1] > 0 ? 0.4 : 0.22, e: 0 }
    const u = (x - VEND.x0) / (VEND.x1 - VEND.x0), v = (y - 0.15) / (VEND.h - 0.15)
    // the front: a lit picture panel (three noodle cups), the keypad (its buttons drawn by hand), the slot
    if (v > 0.5 && v < 0.93 && u > 0.07 && u < 0.64) {
      const cu = ((u - 0.07) / 0.19) % 1
      return { a: 0, e: (cu > 0.2 && cu < 0.8 && v > 0.58 && v < 0.85) ? 0.95 : 0.55 }
    }
    if (v > 0.42 && v < 0.78 && u > 0.7 && u < 0.93) return { a: 0.06, e: 0 }
    if (v > 0.12 && v < 0.24 && u > 0.12 && u < 0.6) return { a: 0.03, e: 0 }
    return { a: 0.3, e: 0 }
  },
  glass: (P) => {
    const [x, , z] = P
    // steel frame every 1.7 m along, two bars across; rain beads on the panes
    const fz = ((z - CAN.z0) % 1.7 + 1.7) % 1.7, fx = x - CAN.x0
    if (fz < 0.09 || Math.abs(fx - 2.15) < 0.05) return { a: 0.42, e: 0, see: 0 }
    if (CAN.x1 - x < 0.06 || fx < 0.08) return { a: 0.42, e: 0, see: 0 }
    const bead = ih(Math.floor(x * 9), Math.floor(z * 9), 3) < 0.06
    return { a: 0.05, e: bead ? 0.3 : 0.02, see: bead ? 0.5 : 0.88 }
  },
  steel: (P, n) => ({ a: n[1] > 0 ? 0.5 : 0.36, e: 0 }),
  rail: { a: 0.55, e: 0 },
  housing: (P, n) => ({ a: n[1] > 0 ? 0.55 : 0.4, e: 0 }),
  hood: (P, n) => ({ a: n[1] > 0 ? 0.7 : 0.3, e: 0 }),
  lamphead: (P, n) => ({ a: 0.3, e: n[1] < 0 ? 1.2 : 0 }),
  planter: (P, n) => ({ a: n[1] > 0 ? 0.16 : 0.36, e: 0 }),                                       // soil on top
  bin: (P, n) => ({ a: n[1] > 0 ? 0.12 : 0.34, e: 0 }),
  bollard: (P, n) => ({ a: 0.3, e: n[1] > 0 ? 0.9 : (P[1] > 0.7 ? 0.5 : 0) }),
  below: (P) => {
    // the lower city, far down: towers' window rows in clusters, the rest black
    const [x, , z] = P, gx = Math.floor(x * 0.5), gz = Math.floor(z * 1.2)
    const cluster = fbm(x * 0.03, z * 0.05, 2)
    return { a: 0.02, e: cluster > 0.45 && ih(gx, gz, 9) < 0.35 ? 0.25 + 0.35 * ih(gx, gz, 10) : 0 }
  },
}

const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ground: null, ambient: 0.17, sky: 0.02 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.35, key: "cam03" })

// ================================================================ hand-drawn details (zoom targets)
// the vending machine's keypad: two columns of four buttons, lit (a zoom target in Chapter 1)
function keypad(c) {
  for (let r = 0; r < 4; r++) for (let q = 0; q < 2; q++) {
    const u = 0.76 + q * 0.11, v = 0.72 - r * 0.085
    const [x, y] = AT([VEND.x0 + u * (VEND.x1 - VEND.x0), 0.15 + v * (VEND.h - 0.15), VEND.z0 - 0.01])
    c.px(x, y, (r + q) % 3 === 0 ? "9" : "8")
  }
}
// the mast camera: its lens glinting, the maintenance sticker on the side facing us (HCS-04)
function mastCam(c) {
  const z = HOUSING.a[2] - 0.01
  const [lx, ly] = AT([HOUSING.a[0], (HOUSING.a[1] + HOUSING.b[1]) / 2, MAST.z])
  c.px(lx, ly, "1"); c.px(lx - 1, ly, "7")                                                   // the lens, a glint
  const [sx, sy] = AT([7.12, 3.1, z]), [ex] = AT([7.4, 3.1, z])
  for (let x = sx; x <= Math.max(ex, sx + 2); x++) { c.px(x, sy, "9"); c.px(x, sy + 1, x === sx + 1 ? "7" : "9") }
  c.px(sx - 1, sy, "3"); c.px(sx - 1, sy + 1, "3")                                            // its dark edge, so it stands out
}

// ================================================================ the layout for the game (docs/cams/cam03_layout.md)
const BOTTOM = groundAt(CAM, W / 2, H)                         // the ground at the frame's bottom middle
const ZN = BOTTOM[2] - 2.5, ZF = 17                           // the walkable band along the bridge
const P0 = 0.15                                               // the pavements' height
const LAYOUT = {
  walk: [groundPoly(CAM, [[XF + 0.35, ZN], [XR - 0.35, ZN], [XR - 0.35, ZF], [XF + 0.35, ZF]], { y: 0.05 })],
  holes: [
    // the vending machine and what it hides behind it (no one walks there, so no one is drawn over it)
    groundPoly(CAM, [[XF, VEND.z0 - 0.25], [VEND.x1 + 0.25, VEND.z0 - 0.25], [VEND.x1 + 0.25, DOOR[0] - 0.3], [XF, DOOR[0] - 0.3]], { y: P0 }),
    groundPoly(CAM, [[1.2, 13.3], [2.6, 13.3], [2.6, 15.6], [1.2, 15.6]], { y: 0 }),          // the planter
    groundPoly(CAM, [[XF, 13.2], [XF + 0.9, 13.2], [XF + 0.9, 15.0], [XF, 15.0]], { y: P0 }),  // the bin
    groundPoly(CAM, [[MAST.x - 0.3, MAST.z - 0.3], [MAST.x + 0.3, MAST.z - 0.3], [MAST.x + 0.3, MAST.z + 0.6], [MAST.x - 0.3, MAST.z + 0.6]], { y: P0 }),   // the mast's foot
  ],
  spots: {
    door: spotAt(CAM, [XF + 0.7, P0, (DOOR[0] + DOOR[1]) / 2]),          // just out of the office door
    awning: spotAt(CAM, [-1.6, P0, BOTTOM[2] + 1.2]),                  // under the canopy, right under the camera
    awningFar: spotAt(CAM, [-2.8, P0, 10.2]),                          // under the canopy, its far end (beyond the door)
    far: spotAt(CAM, [7.4, P0, 6.0]),                                  // the far pavement, across the bridge
    exitRight: spotAt(CAM, [7.6, P0, BOTTOM[2] + 2.2]),                 // the far pavement's near end, at the right edge: toward Yuen's
    exitFar: spotAt(CAM, [3.0, 0, ZF - 0.5]),                          // up the bridge, at the top
    vending: spotAt(CAM, [(VEND.x0 + VEND.x1) / 2 + 0.2, P0, VEND.z0 - 0.5]),   // in front of the machine
  },
  scale: depthScale(CAM, [2.0, 0, ZF - 0.5], [-1.0, P0, BOTTOM[2] + 0.6]),
  hotspots: {
    mast: rectOf(CAM, boxCorners(HOUSING.a, HOUSING.b), 2),
    vending: rectOf(CAM, boxCorners([VEND.x0, 0.15, VEND.z0], [VEND.x1, VEND.h, VEND.z0 + VEND.d]), 1),
    officeDoor: rectOf(CAM, [[XF, 0.15, DOOR[0]], [XF, 2.5, DOOR[0]], [XF, 0.15, DOOR[1]], [XF, 2.5, DOOR[1]]], 1),
  },
}
LAYOUT.mic = { at: LAYOUT.spots.awning, clear: 40, lost: 150 }
LAYOUT.check = Object.fromEntries(Object.entries(LAYOUT.spots).map(([k, [x, y]]) => [k, { dist: Math.round(Math.hypot(x - LAYOUT.mic.at[0], y - LAYOUT.mic.at[1])) }]))

// ================================================================ the scenes
scene("cam03_bg", { w: W, h: H, bg: "0" },
  (c) => paintFeed(c, BAKE()),
  keypad,
  mastCam,
)

// ---------------------------------------------------------------- review images (not shipped: the atlas takes cam* only)
// as the player sees it: the engine's artefacts imitated, stand-ins (no game sprites) at the named spots
scene("review_cam03", { w: W, h: H, bg: "0" },
  (c) => paintFeed(c, BAKE()), keypad, mastCam,
  (c) => {
    const sc = LAYOUT.scale, sAt = (y) => sc.far[1] + (sc.near[1] - sc.far[1]) * clamp((y - sc.far[0]) / (sc.near[0] - sc.far[0]), 0, 1)
    for (const k of ["door", "awning", "far", "awningFar"]) { const [x, y] = LAYOUT.spots[k]; standIn(c, x, y, Math.round(24 * sAt(y))) }
  },
  (c) => reviewFx(c, W, H),
)
// the geometry over a dimmed picture: walk area (cyan), holes (red), spots (yellow), hotspots (cyan
// corners), the mic's clear and lost rings (yellow dots)
scene("review_cam03_layout", { w: W, h: H, bg: "0" },
  (c) => { const { img } = BAKE(); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PH[Math.max(0, img[y][x] - 3)]) },
  (c) => drawLayout(c, LAYOUT),
)
