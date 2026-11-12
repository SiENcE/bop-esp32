// CAM 22, Pho Pump: the bar's camera on the back wall at head height, looking straight across the counter. Feed mode, 320x180, the
// phosphor ramp only (style guide §9). Frontal: the user's choice of 2026-11-12 after a painting in perspective looked odd to them
// (docs/cams/cam22_ansichten_x2.png: the perspective painting, F frontal, I iso; art/mockups/cam22_blocks2.px.js), and with it the
// rule that each camera gets the view that fits it best (kapitel1-design). This paints on the lines of F, built in meters with a
// long lens so the room stays flat and square.
// Pho Pump is a standing noodle bar. In front, big, the cook's back (his cap, his shoulders, the apron's strings, his arm out with
// the ladle) on the left, the big pot on its stove on the right with its steam; then the counter across the picture with its
// bowls, chopsticks and bottles; across it Ines, standing to eat, facing us (her own sprite at this scale, game/kapitel1.js);
// behind her the tiles, a calendar, the lamps over the counter, and the front window onto the cross street with the menu board
// and the sign seen from behind, the door; across the street the clinic's white front with its ring. Where: CAM22_LAYOUT at the
// end of this file (printed when built), copied into game/places.js (cam22).
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [0.2, 1.6, -0.5], yaw: 0, pitch: 6, F: 128, w: W, h: H, k: 0.05 })

// ================================================================ the place, in meters (x right, y up, z away from the cook's wall)
const ROOM = { x0: -3.2, x1: 3.6, back: -0.6, front: 5.8, h: 2.9 }
const COUNTER = { z0: 1.1, z1: 1.65, top: 1.08 }
const INES = [0.2, 2.1]
const WIN = { x0: -2.6, x1: 1.9, y0: 0.7, y1: 2.4 }, DOOR = { x0: 2.3, x1: 3.2 }
const POT = [1.3, 0.6, 0.24]                                              // the big stock pot (x, z, r) on its stove in front, its steam

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
    // the stove in front on the right with the big pot; a shelf of bowls on the left wall
    block([0.55, 0, 0.05], [2.4, 0.9, 0.75], "stove"),
    cyl(POT[0], POT[1], POT[2], 0.9, 1.3, "pot"), cyl(1.95, 0.55, 0.18, 0.9, 1.15, "pot"),
    block([ROOM.x0, 1.6, 1.8], [ROOM.x0 + 0.3, 1.64, 4.2], "shelf"),
    // the lamps over the counter: their shades on their cords
    ...[-1.1, 1.5].flatMap((x) => [cyl(x, 1.7, 0.17, 2.18, 2.32, "shade"), cyl(x, 1.7, 0.01, 2.32, ROOM.h, "cord")]),
    // outside: the cross street, the clinic's white front across it
    block([-12, -0.2, ROOM.front + 0.2], [12, 0.01, 20], "street"),
    block([-12, 0, 16], [12, 9, 17], "clinic"),
  ]
  const LIGHTS = [
    { p: [-1.1, 2.15, 1.4], I: 0.9, R: 2.8, shadow: true }, { p: [1.5, 2.15, 1.4], I: 0.9, R: 2.8, shadow: true },
    { p: [1.3, 1.5, 0.6], I: 0.4, R: 1.4 },                                           // the stove's glow on the pots
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
    if (n[2] < 0 && z > ROOM.front - 0.01 && x > -3.05 && x < -2.75 && y > 1.2 && y < 1.75) return { a: y > 1.62 ? 0.3 : 0.62, e: 0 }   // the calendar
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

const COOK = [-0.45, 0.85]
const WORLD = world(COOK)
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.2, key: "cam22" })

// ---------------------------------------------------------------- hand drawing on top
// the cook's back, painted by hand where the blockout puts him, in units of a 52-unit-tall figure scaled to his size there: his
// white cap, dark hair, the back of his white jacket, the apron's strings crossed, the bow, his left arm hanging, his right arm out to
// the counter with the ladle; a dark edge round him so he reads in front of the counter
const cookFig = (c) => {
  const top = at(CAM, [COOK[0], 1.82, COOK[1]]), foot = at(CAM, [COOK[0], 0, COOK[1]]), S = (foot[1] - top[1]) / 52
  const hw = (v) => v < 17 ? 6 + Math.sqrt(Math.max(0, 1 - ((17 - v) / 5) ** 2)) * 8 : v < 30 ? 14 - (v - 17) * 0.18 : 11.6 - (v - 30) * 0.06
  const e = (u, v, cu, cv, ru, rv) => ((u - cu) / ru) ** 2 + ((v - cv) / rv) ** 2 <= 1
  const key = (u, v) => {
    if (e(u, v, 0, 3, 6.5, 3.4)) return v < 1.5 ? (u < 1 ? "9" : "8") : v < 4.5 ? (u < 3 ? "8" : "7") : "6"   // the cap
    if (e(u, v, 0, 8, 5.2, 3.2)) return u < -2.5 ? "2" : "1"                                          // the hair
    if (v >= 10 && v < 13 && Math.abs(u) <= 2) return "3"                                               // the neck
    if (e(u, v, 25, 25.5, 1.8, 1.8)) return "4"                                                        // his right hand
    { const t = (u - 12) / 12, along = 15 + t * 9.6; if (t >= 0 && t <= 1 && v >= along && v < along + 3.2) return v > along + 2.2 ? "5" : "7" }   // his right arm
    if (v >= 15 && v < 31 && u >= -16.5 && u < -13) return u < -15.5 ? "5" : "6"                        // his left arm
    if (v >= 12 && v < 48) {
      const h = hw(v); if (Math.abs(u) > h) return null
      if (v >= 14 && v <= 30) { const f = (v - 14) / 16; if (Math.abs(u - (-8 + 15 * f)) < 0.7 || Math.abs(u - (8 - 15 * f)) < 0.7) return "1" }   // the strings
      if (v >= 29.5 && v < 31.5 && Math.abs(u) < 2.5) return "2"                                       // the bow
      const side = u / h
      return v >= 30 ? (side > 0.6 ? "1" : "2") : side > 0.7 ? "5" : side > 0.35 ? "6" : Math.abs(u) < 0.5 && v > 18 ? "6" : "7"
    }
    if (v >= 48 && Math.abs(u) >= 3 && Math.abs(u) <= 7) return "1"                                   // his legs
    return null
  }
  const ux = (x) => (x - top[0]) / S, vy = (y) => (y - top[1]) / S
  for (let y = Math.max(0, top[1] - 1); y < H; y++) for (let x = Math.max(0, Math.floor(top[0] - 18 * S)); x < Math.min(W, top[0] + 28 * S); x++) {
    const k = key(ux(x + 0.5), vy(y + 0.5))
    if (k) { c.px(x, y, k); continue }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (key(ux(x + 0.5 + dx), vy(y + 0.5 + dy))) { c.px(x, y, "0"); break }
  }
  // the ladle: its handle up from his hand, its bowl over the counter
  const hx = Math.round(top[0] + 25 * S), hy = Math.round(top[1] + 25.5 * S)
  c.line(hx + 2, hy - 2, hx + 10, hy - 18, "8"); c.rect(hx + 8, hy - 23, 7, 4, "8"); c.hline(hx + 8, hy - 20, 7, "6")
}
// the steam off the big pot: soft wisps rising and leaning toward the window's draught, wider and thinner as they rise, dithered
const steam = (c) => {
  for (let i = 0; i < 5; i++) for (let t = 0; t < 1; t += 0.03) {
    const sway = Math.sin(t * 6 + i * 1.7) * 0.07 - t * 0.15
    const [x, y] = at(CAM, [POT[0] + (ih(i, 1) - 0.5) * 0.35 + sway, 1.32 + t * 1.3, POT[1] + (ih(i, 2) - 0.5) * 0.25])
    const r = 2 + t * 9, dens = (1 - t) * 0.7
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
