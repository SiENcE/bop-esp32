// Blocks for CAM 22, Pho Pump (kapitel1-design §9: the bar's camera behind the counter, over the cook's shoulder, steam in front,
// Ines across the counter from us; the user's choice of 2026-11-12: the doc's framing, not the plan's window). Feed mode, 320x180,
// the phosphor ramp only. A blockout in meters (art/lib/feed.js) with flat materials, so only the layout is judged: where Ines
// stands, how big she is, what of the bar, the window and the street shows, and what the display covers ("mit OSD").
// Pho Pump is a standing noodle bar: one long counter, people eat standing at it (so the counter hides Ines's legs and she needs
// no seated sprite). Behind it the cook, the stove with its stock pots, their steam; across the room the front window onto the
// cross street (its sign and menu board seen from behind), the door, and across the street the clinic's white light.
// Two framings to choose from:
//   A  on the back wall over the stove, looking across the counter: the cook's head and shoulders big in the bottom left, the
//      steam of the big pot rising in front on the right, Ines straight across the counter facing us, the window behind her
//   B  high on the side wall at the counter's end, looking along it: a pot's steam in front, the cook in profile, Ines halfway
//      along the counter, the window and the door on the right
// Not built into the game.
//   PXL build art/mockups/cam22_blocks.px.js --out build/art/cam22_blocks --no-preview
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const VARIANTS = {
  a: makeCam({ pos: [-0.5, 2.5, -0.5], yaw: 6, pitch: 27, F: 64, w: W, h: H, k: 0.14 }),
  b: makeCam({ pos: [3.3, 2.45, 0.05], yaw: -50, pitch: 24, F: 64, w: W, h: H, k: 0.14 }),
}

// ================================================================ the place, in meters (x right, y up, z away from the cook's wall)
const ROOM = { x0: -3.2, x1: 3.6, back: -0.6, front: 5.8, h: 2.9 }      // the room's walls (the cook's wall at back, the window's at front)
const COUNTER = { z0: 1.1, z1: 1.65, top: 1.08 }                           // the counter across the room, its top
const INES = [0.2, 2.1]                                                   // where Ines stands to eat (x, z)
const GUESTS = [[-1.6, 2.3], [2.0, 2.2]]                                   // two others at the counter (stand-ins)
const COOK = [-1.0, 0.45]
const WIN = { x0: -2.6, x1: 1.9, y0: 0.7, y1: 2.4 }, DOOR = { x0: 2.3, x1: 3.2 }

const PRIMS = [
  block([ROOM.x0 - 0.2, 0, ROOM.back - 0.2], [ROOM.x1 + 0.2, ROOM.h + 0.2, ROOM.back], "wall"),        // the cook's wall
  block([ROOM.x0 - 0.2, 0, ROOM.back], [ROOM.x0, ROOM.h, ROOM.front], "wall"),                       // the side walls
  block([ROOM.x1, 0, ROOM.back], [ROOM.x1 + 0.2, ROOM.h, ROOM.front], "wall"),
  block([ROOM.x0, ROOM.h, ROOM.back], [ROOM.x1, ROOM.h + 0.2, ROOM.front], "ceiling"),
  // the front: wall round the window and the door
  block([ROOM.x0, 0, ROOM.front], [WIN.x0, ROOM.h, ROOM.front + 0.2], "wall"),
  block([WIN.x0, 0, ROOM.front], [WIN.x1, WIN.y0, ROOM.front + 0.2], "wall"),
  block([WIN.x0, WIN.y1, ROOM.front], [DOOR.x1, ROOM.h, ROOM.front + 0.2], "wall"),
  block([WIN.x1, 0, ROOM.front], [DOOR.x0, WIN.y1, ROOM.front + 0.2], "wall"),
  block([DOOR.x1, 0, ROOM.front], [ROOM.x1, ROOM.h, ROOM.front + 0.2], "wall"),
  block([WIN.x0, WIN.y0, ROOM.front + 0.05], [WIN.x1, WIN.y1, ROOM.front + 0.08], "glass"),
  block([DOOR.x0, 0, ROOM.front + 0.05], [DOOR.x1, 2.2, ROOM.front + 0.08], "glass"),
  // the menu board and the sign in the window, seen from behind
  block([-1.3, 0.8, ROOM.front - 0.06], [0.4, 2.3, ROOM.front - 0.02], "menuback"),
  // the counter, its front panel; the stove and its pots along the cook's wall; a shelf of bowls over it
  block([ROOM.x0, 0, COUNTER.z0], [ROOM.x1 - 1.2, COUNTER.top, COUNTER.z1], "counter"),
  block([ROOM.x0, 0, ROOM.back], [ROOM.x1, 0.9, 0.05], "stove"),
  cyl(-0.9, -0.28, 0.24, 0.9, 1.3, "pot"), cyl(0.35, -0.25, 0.27, 0.9, 1.38, "pot"), cyl(2.3, -0.25, 0.25, 0.9, 1.34, "pot"),
  block([ROOM.x0, 1.85, ROOM.back], [-1.0, 1.9, ROOM.back + 0.3], "shelf"),
  // the steam over the pots (half see-through)
  cyl(0.35, -0.2, 0.32, 1.38, 2.45, "steam", { shadow: false }), cyl(2.3, -0.2, 0.3, 1.34, 2.4, "steam", { shadow: false }),
  // the cook, his back to us (a body, his head)
  cyl(COOK[0], COOK[1], 0.27, 0, 1.5, "person"), cyl(COOK[0], COOK[1], 0.14, 1.5, 1.8, "head"),
  // Ines across the counter, the two others
  cyl(INES[0], INES[1], 0.24, 0, 1.45, "ines"), cyl(INES[0], INES[1], 0.13, 1.45, 1.72, "head"),
  ...GUESTS.flatMap(([x, z]) => [cyl(x, z, 0.24, 0, 1.45, "person"), cyl(x, z, 0.13, 1.45, 1.75, "head")]),
  // outside: the cross street, the clinic's white front across it
  block([-12, -0.2, ROOM.front + 0.2], [12, 0, 20], "street"),
  block([-12, 0, 16], [12, 9, 17], "clinic"),
]
const LIGHTS = [
  { p: [-1.0, 2.6, 1.3], I: 0.9, R: 3.0 }, { p: [1.2, 2.6, 1.3], I: 0.9, R: 3.0 },     // the pendants over the counter
  { p: [0.4, 1.6, 0.2], I: 0.5, R: 1.6 },                                             // the stove's glow on the pots and the steam
  { p: [-0.4, 1.5, ROOM.front - 0.3], I: 0.5, R: 2.2 },                                // the menu board's light, into the room
  { p: [0, 4, 15], I: 2.0, R: 9 },                                                     // the clinic's floodlight across the street
]
const MATS = {
  wall: { a: 0.32, e: 0 }, ceiling: { a: 0.2, e: 0 }, floor: { a: 0.26, e: 0, wet: 0.1 },
  glass: { a: 0.05, e: 0.02, see: 0.85 },
  menuback: { a: 0.25, e: 0.35 },
  counter: (P, n) => ({ a: n[1] > 0.5 ? 0.55 : 0.3, e: 0 }),
  stove: { a: 0.28, e: 0.04 }, pot: { a: 0.5, e: 0 }, shelf: { a: 0.45, e: 0 },
  steam: { a: 0.6, e: 0.12, see: 0.55 },
  person: { a: 0.16, e: 0 }, head: { a: 0.28, e: 0 }, ines: { a: 0.7, e: 0 },
  street: { a: 0.2, e: 0, wet: 0.5, gloss: 0.25 }, clinic: { a: 0.75, e: 0.15 },
}
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ambient: 0.18, sky: 0.02, rain: 1 })

// ================================================================ what the game would need, measured (printed when built)
const layout = (cam) => ({
  seat: spotAt(cam, [INES[0], 0, INES[1]]), seatPx: Math.round(personPx(cam, [INES[0], 0, INES[1]], 1.72)),
  mic: spotAt(cam, [INES[0], 1.2, COUNTER.z1]),
  bar: rectOf(cam, boxCorners([ROOM.x0, 0, COUNTER.z0], [ROOM.x1 - 1.2, COUNTER.top, COUNTER.z1])),
})
for (const [k, cam] of Object.entries(VARIANTS)) console.log(`CAM22_${k.toUpperCase()} ` + JSON.stringify(layout(cam)))

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
  const bake = () => bakeFeed(cam, WORLD, { exposure: 1.2, key: "cam22_" + k })
  scene(`cam22_blocks_${k}`, { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake()), (c) => reviewFx(c, W, H), label(k.toUpperCase()))
  scene(`cam22_blocks_${k}_osd`, { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake()), (c) => reviewFx(c, W, H), osd, label(k.toUpperCase() + " MIT OSD"))
}
