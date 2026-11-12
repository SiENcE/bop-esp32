// CAM 22, Pho Pump: the bar's camera on the back wall over the stove, 2.5 m up, looking across the counter. Feed mode, 320x180, the
// phosphor ramp only (style guide §9). The user chose the blocks A of two (art/mockups/cam22_blocks.px.js,
// docs/cams/cam22_blocks_vergleich_x3.png, 2026-11-12); this paints on their lines: the same place in meters, the same camera.
// Pho Pump is a standing noodle bar. In front, big and near, the cook from behind (his cap, his shoulders, the apron's strings, the
// ladle in his hand) and the steam of the big stock pot rising on the right; then the counter across the room with its bowls,
// chopsticks and bottles; across it Ines, standing to eat, facing us (her sprite at this scale, game/kapitel1.js); behind her the
// room's tiles, a calendar, the lamps over the counter, and the front window onto the cross street, the menu board and the sign
// seen from behind, the door; across the street the clinic's white front with its ring.
// The cook stands at the counter, 1 m out from the wall: of two distances tried the user chose this one (docs/cams/cam22_koch_test_x3.png,
// 2026-11-12), a little to the left so he never covers Ines. Ines is the game's actor, at this camera's scale her own sprite (her upper
// body over the counter, art/mock/ch1_blocks.px.js mock_ines_bar, on blocks until approved). Where: CAM22_LAYOUT at the end of this
// file (printed when built), copied into game/places.js (cam22).
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [-0.5, 2.5, -0.5], yaw: 6, pitch: 27, F: 64, w: W, h: H, k: 0.14 })

// ================================================================ the place, in meters (x right, y up, z away from the cook's wall)
const ROOM = { x0: -3.2, x1: 3.6, back: -0.6, front: 5.8, h: 2.9 }
const COUNTER = { z0: 1.1, z1: 1.65, top: 1.08 }
const INES = [0.2, 2.1]
const GUESTS = [[-1.6, 2.3], [2.0, 2.2]]
const WIN = { x0: -2.6, x1: 1.9, y0: 0.7, y1: 2.4 }, DOOR = { x0: 2.3, x1: 3.2 }
const POT = [0.35, -0.25, 0.27]                                            // the big stock pot (x, z, r), its steam in front

// the cook from behind: a body, shoulders, his head and cap; at (x, z), facing the counter
const cook = ([x, z]) => [
  cyl(x, z, 0.23, 0, 1.38, "cook"), block([x - 0.27, 1.22, z - 0.12], [x + 0.27, 1.42, z + 0.12], "cook"),
  cyl(x, z + 0.02, 0.11, 1.42, 1.5, "neck"), cyl(x, z + 0.02, 0.13, 1.5, 1.72, "hair"), cyl(x, z + 0.02, 0.14, 1.66, 1.78, "cap"),
  block([x + 0.2, 1.05, z], [x + 0.3, 1.32, z + 0.45], "cook"),            // his right arm, reaching to the counter
]

function world(cookAt) {
  const PRIMS = [
    block([ROOM.x0 - 0.2, 0, ROOM.back - 0.2], [ROOM.x1 + 0.2, ROOM.h + 0.2, ROOM.back], "wall"),
    block([ROOM.x0 - 0.2, 0, ROOM.back], [ROOM.x0, ROOM.h, ROOM.front], "wall", { side: -1 }),
    block([ROOM.x1, 0, ROOM.back], [ROOM.x1 + 0.2, ROOM.h, ROOM.front], "wall", { side: 1 }),
    block([ROOM.x0, ROOM.h, ROOM.back], [ROOM.x1, ROOM.h + 0.2, ROOM.front], "ceiling"),
    block([ROOM.x0, 0, ROOM.front], [WIN.x0, ROOM.h, ROOM.front + 0.2], "wall"),
    block([WIN.x0, 0, ROOM.front], [WIN.x1, WIN.y0, ROOM.front + 0.2], "wall"),
    block([WIN.x0, WIN.y1, ROOM.front], [DOOR.x1, ROOM.h, ROOM.front + 0.2], "wall"),
    block([WIN.x1, 0, ROOM.front], [DOOR.x0, WIN.y1, ROOM.front + 0.2], "wall"),
    block([DOOR.x1, 0, ROOM.front], [ROOM.x1, ROOM.h, ROOM.front + 0.2], "wall"),
    block([WIN.x0, WIN.y0, ROOM.front + 0.05], [WIN.x1, WIN.y1, ROOM.front + 0.08], "glass"),
    block([DOOR.x0, 0, ROOM.front + 0.05], [DOOR.x1, 2.2, ROOM.front + 0.08], "glass"),
    block([-1.3, 0.8, ROOM.front - 0.06], [0.4, 2.3, ROOM.front - 0.02], "menuback"),
    block([-2.4, 2.45, ROOM.front - 0.35], [1.7, 2.75, ROOM.front - 0.25], "signback"),
    // the counter, its front, the things on it
    block([ROOM.x0, 0, COUNTER.z0], [ROOM.x1 - 1.2, COUNTER.top, COUNTER.z1], "counter"),
    cyl(INES[0], COUNTER.z1 - 0.2, 0.11, COUNTER.top, COUNTER.top + 0.09, "bowl"),
    block([INES[0] + 0.15, COUNTER.top, COUNTER.z1 - 0.32], [INES[0] + 0.33, COUNTER.top + 0.005, COUNTER.z1 - 0.12], "napkin"),
    ...[-2.4, -0.9, 1.0].flatMap((x) => [cyl(x, COUNTER.z0 + 0.25, 0.035, COUNTER.top, COUNTER.top + 0.2, "bottle"), cyl(x + 0.1, COUNTER.z0 + 0.25, 0.04, COUNTER.top, COUNTER.top + 0.14, "sticks")]),
    ...GUESTS.map(([x]) => cyl(x, COUNTER.z1 - 0.2, 0.11, COUNTER.top, COUNTER.top + 0.09, "bowl")),
    // the stove along the back wall, the pots, a shelf of bowls on the left
    block([ROOM.x0, 0, ROOM.back], [ROOM.x1, 0.9, 0.05], "stove"),
    cyl(-0.9, -0.28, 0.24, 0.9, 1.3, "pot"), cyl(POT[0], POT[1], POT[2], 0.9, 1.38, "pot"), cyl(2.3, -0.25, 0.25, 0.9, 1.34, "pot"),
    block([ROOM.x0, 1.85, ROOM.back], [-1.0, 1.9, ROOM.back + 0.3], "shelf"),
    // the lamps over the counter: their shades on their cords
    ...[-1.0, 1.2].flatMap((x) => [cyl(x, 1.35, 0.17, 2.18, 2.32, "shade"), cyl(x, 1.35, 0.01, 2.32, ROOM.h, "cord")]),
    // the cook, the two others at the counter (stand-ins: the game draws no one else here)
    ...GUESTS.flatMap(([x, z]) => [cyl(x, z, 0.24, 0, 1.45, "person"), cyl(x, z, 0.13, 1.45, 1.75, "head")]),
    // outside: the cross street, the clinic's white front across it
    block([-12, -0.2, ROOM.front + 0.2], [12, 0.01, 20], "street"),
    block([-12, 0, 16], [12, 9, 17], "clinic"),
  ]
  const LIGHTS = [
    { p: [-1.0, 2.15, 1.35], I: 0.9, R: 2.8, shadow: true }, { p: [1.2, 2.15, 1.35], I: 0.9, R: 2.8, shadow: true },
    { p: [0.4, 1.6, 0.2], I: 0.45, R: 1.6 },
    { p: [-1.1, 2.3, -0.1], I: 0.7, R: 1.8 },                                         // the hood's lamp over the stove, on the cook's back
    { p: [-0.4, 1.5, ROOM.front - 0.3], I: 0.45, R: 2.2 },
    { p: [0, 4, 15], I: 2.0, R: 9 },
  ]
  return feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ambient: 0.16, sky: 0.02, rain: 1 })
}

// ---------------------------------------------------------------- materials
const MATS = {
  // the walls: white tiles to shoulder height, a calendar on the left wall, a poster by the window
  wall: (P, n, f, hit) => {
    const [x, y, z] = P, low = y < 1.5
    if (hit.prim.side === -1 && y > 1.3 && y < 1.9 && Math.abs(z - 3.2) < 0.3) return { a: y > 1.75 ? 0.3 : 0.62, e: 0 }   // the calendar
    if (n[2] < 0 && z > ROOM.front - 0.01 && x > DOOR.x1 + 0.05 && x < DOOR.x1 + 0.35 && y > 1.2 && y < 1.9) return { a: 0.55, e: 0.05 }   // a notice by the door
    if (low) { const t = ((y / 0.15) % 1 + 1) % 1 < 0.1 || (((x + z) / 0.15) % 1 + 1) % 1 < 0.1; return { a: t ? 0.26 : 0.36, e: 0 } }
    return { a: 0.3, e: 0 }
  },
  ceiling: { a: 0.18, e: 0 },
  floor: (P) => { const [x, , z] = P; return { a: (Math.floor(x / 0.3) + Math.floor(z / 0.3)) % 2 ? 0.25 : 0.29, e: 0, wet: 0.08 } },
  glass: { a: 0.05, e: 0.02, see: 0.85 },
  menuback: { a: 0.22, e: 0.3 }, signback: { a: 0.2, e: 0.2 },
  counter: (P, n) => {
    if (n[1] > 0.5) return { a: ((P[0] * 3) % 1 + 1) % 1 < 0.04 ? 0.3 : 0.42, e: 0 }                 // its top, the boards' joints
    return { a: ((P[0] * 6) % 1 + 1) % 1 < 0.2 ? 0.2 : 0.28, e: 0 }                                  // its front, slatted
  },
  bowl: (P, n) => ({ a: n[1] > 0.5 ? 0.3 : 0.72, e: 0 }), napkin: { a: 0.85, e: 0 },
  bottle: { a: 0.35, e: 0 }, sticks: { a: 0.55, e: 0 },
  stove: (P, n) => ({ a: n[1] > 0.5 ? 0.22 : 0.3, e: 0.03 }), shelf: { a: 0.5, e: 0 },
  // a pot: its steel side, and on top the rim round the dark broth
  pot: (P, n, f, hit) => {
    if (n[1] <= 0.5) return { a: 0.5 + 0.1 * Math.sin(Math.atan2(P[2] - hit.prim.c[1], P[0] - hit.prim.c[0]) * 2), e: 0 }
    const r = Math.hypot(P[0] - hit.prim.c[0], P[2] - hit.prim.c[1]) / hit.prim.r
    return { a: r > 0.84 ? 0.7 : 0.1, e: r > 0.84 ? 0 : 0.04, wet: r > 0.84 ? 0 : 0.4, gloss: 0.3 }
  },
  steam: { a: 0.6, e: 0.12, see: 0.6 },
  shade: (P, n) => ({ a: 0.3, e: n[1] < -0.5 ? 0.9 : 0.05 }), cord: { a: 0.2, e: 0 },
  cook: (P, n) => ({ a: 0.6, e: 0.04 }), neck: { a: 0.4, e: 0 }, hair: { a: 0.12, e: 0 }, cap: { a: 0.85, e: 0.05 },
  person: { a: 0.16, e: 0 }, head: { a: 0.28, e: 0 },
  street: { a: 0.2, e: 0, wet: 0.5, gloss: 0.25 },
  clinic: (P, n) => { const r = Math.hypot(P[0] + 0.6, P[1] - 3.2); return { a: 0.75, e: r < 0.9 && r > 0.6 ? 0.9 : 0.15 } },
}

const COOK = [-1.25, 0.5]
const WORLD = world(COOK)
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.2, key: "cam22" })

// ---------------------------------------------------------------- hand drawing on top
// the cook, painted by hand where the blockout puts him (measured: head top at 1.78 m, feet on the floor, leaning with the lens):
// his white cap, dark hair, the back of his white jacket lit by the hood's lamp, the apron's strings crossed, his right arm out to
// the counter with the ladle; a dark edge round him so he reads in front of the counter
const cookFig = (c) => {
  const top = at(CAM, [COOK[0], 1.8, COOK[1]]), foot = at(CAM, [COOK[0], 0, COOK[1]])
  const lean = (foot[0] - top[0]) / (foot[1] - top[1]), V = foot[1] - top[1]
  const fig = new Map(), put = (u, v, k) => fig.set(Math.round(u) + "," + Math.round(v), k)
  const ell = (cu, cv, ru, rv, f) => { for (let v = Math.floor(cv - rv); v <= cv + rv; v++) for (let u = Math.floor(cu - ru); u <= cu + ru; u++) { const q = ((u - cu) / ru) ** 2 + ((v - cv) / rv) ** 2; if (q <= 1) { const k = f(u, v, q); if (k) put(u, v, k) } } }
  // the body: shoulders rounded, the back of the jacket lit from the hood's lamp on the left, its seam; the apron below
  for (let v = 12; v < V - 4; v++) {
    const hw = v < 17 ? 6 + Math.sqrt(Math.max(0, 1 - ((17 - v) / 5) ** 2)) * 8 : v < 30 ? 14 - (v - 17) * 0.18 : 11.6 - (v - 30) * 0.06
    for (let u = -Math.round(hw); u <= Math.round(hw); u++) {
      const apron = v >= 30, side = u / hw
      put(u, v, apron ? (side > 0.6 ? "1" : "2") : side > 0.7 ? "5" : side > 0.35 ? "6" : u === 0 && v > 18 ? "6" : "7")
    }
  }
  // his left arm hanging, his right arm out to the counter with the ladle
  for (let v = 15; v < 31; v++) for (let u = -16; u <= -13; u++) put(u - (v - 15) * 0.05, v, u === -16 ? "5" : "6")
  for (let i = 0; i < 12; i++) for (let w = 0; w < 3; w++) put(13 + i * 0.95, 15 + i * 0.8 + w, w === 2 ? "5" : "7")
  ell(25, 25.5, 1.6, 1.6, () => "4")
  // the apron's strings crossed on his back, the bow at his waist
  for (let v = 14; v <= 30; v++) { const f = (v - 14) / 16; put(-8 + 15 * f, v, "1"); put(8 - 15 * f, v, "1") }
  put(-2, 30, "1"); put(-1, 31, "2"); put(1, 31, "2"); put(2, 30, "1"); put(0, 30, "1")
  // his legs under the apron
  for (let v = V - 4; v <= V; v++) for (const u of [-6, -5, -4, -3, 3, 4, 5, 6]) put(u, v, "1")
  // the neck, the back of his head (dark hair), the white cap on top
  for (let v = 10; v < 13; v++) for (let u = -2; u <= 2; u++) put(u, v, "3")
  ell(0, 8, 5.2, 3.2, (u) => (u < -2 ? "2" : "1"))
  ell(0, 3, 6.5, 3.4, (u, v) => (v < 2 ? (u < 1 ? "9" : "8") : v < 5 ? (u < 3 ? "8" : "7") : "6"))
  // drawn in place, leaning with the lens; a dark edge where he meets what is behind him
  const at2 = (u, v) => [Math.round(top[0] + u + v * lean), top[1] + v]
  for (const [key] of fig) { const [u, v] = key.split(",").map(Number); for (const [du, dv] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!fig.has((u + du) + "," + (v + dv))) { const [x, y] = at2(u + du, v + dv); c.px(x, y, "0") } }
  for (const [key, k] of fig) { const [u, v] = key.split(",").map(Number), [x, y] = at2(u, v); c.px(x, y, k) }
  // the ladle: its handle up from his hand, its bowl over the counter
  const [hx, hy] = at2(25, 25); c.line(hx + 1, hy - 1, hx + 6, hy - 11, "8"); c.rect(hx + 5, hy - 14, 4, 3, "8"); c.hline(hx + 5, hy - 12, 4, "6")
}
// the steam off the big pot: soft wisps rising and leaning toward the window's draught, wider and thinner as they rise, dithered
const steam = (c) => {
  for (let i = 0; i < 6; i++) for (let t = 0; t < 1; t += 0.035) {
    const sway = Math.sin(t * 6 + i * 1.7) * 0.07 + t * 0.2
    const [x, y] = at(CAM, [POT[0] + (ih(i, 1) - 0.5) * 0.3 + sway, 1.4 + t * 1.0, POT[1] + 0.05 + (ih(i, 2) - 0.5) * 0.25])
    const r = 3 + t * 9, dens = (1 - t) * 0.9
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const q = Math.hypot(dx, dy) / r; if (q > 1) continue
      const X = Math.round(x + dx), Y = Math.round(y + dy)
      if (X < 0 || Y < 0 || X >= W || Y >= H) continue
      if (bayer(X, Y) < dens * (1 - q)) c.px(X, Y, q < 0.45 && t < 0.5 ? "9" : "8")
    }
  }
}

// ================================================================ what the game needs (game/places.js cam22)
const CAM22_LAYOUT = {
  // Ines's sprite stands on the counter's far edge at her place (its bottom there, mock_ines_bar), her head where it would be
  seat: spotAt(CAM, [INES[0], COUNTER.top, COUNTER.z1]), head: spotAt(CAM, [INES[0], 1.72, INES[1]]),
  inesPx: (() => { const a = project(CAM, [INES[0], COUNTER.top, COUNTER.z1]), b = project(CAM, [INES[0], 1.72, INES[1]]); return Math.round(a[1] - b[1]) })(),
  mic: spotAt(CAM, [INES[0], 1.2, COUNTER.z1]),
  // the counter's own outline, and the napkin at her place
  polys: { bar: hullOf(CAM, boxCorners([-2.4, COUNTER.top, COUNTER.z0], [ROOM.x1 - 1.2, COUNTER.top, COUNTER.z1]), 0) },
  napkin: rectOf(CAM, boxCorners([INES[0] + 0.15, COUNTER.top, COUNTER.z1 - 0.32], [INES[0] + 0.33, COUNTER.top, COUNTER.z1 - 0.12]), 0),
}
console.log("CAM22_LAYOUT " + JSON.stringify(CAM22_LAYOUT))

// ================================================================ the scenes
scene("cam22_bg", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), cookFig, steam)
scene("review_cam22", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), cookFig, steam, (c) => reviewFx(c, W, H))
