// CAM 33, Pumpenhalle 3: the Flutwerk's pump shaft by the sea, where Teo works (kapitel2-design §6.6, a proposal of 2026-11-22).
// Feed mode, 320x180, the phosphor ramp only (style guide §9). BLOCKS for the user's approval: the place in meters, the camera, where
// things stand and where the people are; nothing is painted yet.
// The user's wish after the first sketch (2026-11-22): bigger, epic, deep, wide, like the photo of a construction shaft he gave: the
// camera hangs at the rim and looks steeply down into a round shaft. Its wall is sheet piles, ringed every few meters by pale walers;
// a stair tower climbs the right-hand wall; 8 m down a platform juts out where the shift sleeps in the break; at the bottom the
// water, steel struts across it, the pumps as big as houses, and the filter basin with Tinte, the old pump octopus. People are tiny.
// Two pictures of the same place:
//   blocks_cam33_schicht   20:00 on: Teo at the basin's edge at the bottom, a colleague on the stairs
//   blocks_cam33_pause     the break (from 23:00): three on the platform's bench asleep (their patches blink together), Teo sitting at the basin
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180
const CAM = makeCam({ pos: [-2.5, 33, -10], yaw: 8, pitch: 61, F: 135, w: W, h: H, k: 0.2 })

// ================================================================ the shaft, in meters (x across, y up from the rim, z away)
const R = 12, DEEP = -30, PILES = 64, RING = 4                         // radius, the water's depth, piles around, walers every 4 m
const round = (n, f) => [...Array(n).keys()].map(f)
const atAngle = (a, r = R) => [Math.sin(a) * r, Math.cos(a) * r]      // a = 0 is the far side
// the wall: sheet piles standing round the circle, the soil behind them a box all round
const WALL = [
  ...round(PILES, (i) => { const [x, z] = atAngle((i / PILES) * Math.PI * 2); return cyl(x, z, 0.62, DEEP - 2, 0.5, "pile") }),
  block([-R - 3, DEEP - 2, -R - 3], [-R - 0.3, 0.5, R + 3], "soil"), block([R + 0.3, DEEP - 2, -R - 3], [R + 3, 0.5, R + 3], "soil"),
  block([-R - 3, DEEP - 2, R + 0.3], [R + 3, 0.5, R + 3], "soil"), block([-R - 3, DEEP - 2, -R - 3], [R + 3, 0.5, -R - 0.3], "soil"),
]
// the walers: pale beams round the inside, every RING meters (short blocks along the circle, one per pile)
const WALERS = round(Math.floor(-DEEP / RING), (k) => -2 - k * RING).flatMap((y) => round(PILES, (i) => {
  const [x, z] = atAngle((i / PILES) * Math.PI * 2, R - 0.7)
  return block([x - 0.62, y - 0.3, z - 0.62], [x + 0.62, y + 0.3, z + 0.62], "waler")
}))
// the stair tower on the right-hand wall: four posts all the way down, a landing every 3 m, a flight of steps between
const SX = 6.4, SZ = 4.0, SW = 2.2, SL = 4.0
const STAIRS = [
  ...[[SX, SZ], [SX + SW, SZ], [SX, SZ + SL], [SX + SW, SZ + SL]].map(([x, z]) => cyl(x, z, 0.12, DEEP, 0.8, "scaffold")),
  ...round(10, (k) => block([SX - 0.04, -k * 3, SZ], [SX + 0.04, -k * 3 + 1.0, SZ + SL], "rail")),     // the rail on the open side
  ...round(10, (k) => { const y = -k * 3; return block([SX, y - 0.1, SZ], [SX + SW, y, SZ + SL], "landing") }),
  ...round(10, (k) => round(8, (s) => { const y = -k * 3 - (s + 1) * 0.375, z = k % 2 ? SZ + SL - (s + 1) * 0.4 : SZ + s * 0.4
    return block([SX + 0.1, y - 0.08, z], [SX + SW - 0.1, y, z + 0.4], "step") })).flat(),
]
// 8 m down on the near left, a platform out from the wall on two beams, a rail, and the bench where the shift sleeps in the break
const PY = -8, PX0 = -11.4, PX1 = -6.4, PZ0 = -6.5, PZ1 = -0.5
const PLATFORM = [
  block([PX0, PY - 0.15, PZ0], [PX1, PY, PZ1], "deck"),
  block([PX0, PY - 0.8, PZ0 + 0.3], [PX1, PY - 0.15, PZ0 + 0.6], "beam"), block([PX0, PY - 0.8, PZ1 - 0.6], [PX1, PY - 0.15, PZ1 - 0.3], "beam"),
  block([PX1 - 0.05, PY + 0.95, PZ0], [PX1, PY + 1.0, PZ1], "rail"), block([PX1 - 0.05, PY + 0.45, PZ0], [PX1, PY + 0.48, PZ1], "rail"),   // the rail: a handrail, a knee rail
  ...round(5, (i) => block([PX1 - 0.05, PY, PZ0 + i * (PZ1 - PZ0) / 4 - 0.03], [PX1, PY + 1.0, PZ0 + i * (PZ1 - PZ0) / 4 + 0.03], "rail")),
  block([PX1 - 1.3, PY, PZ0 + 0.6], [PX1 - 0.7, PY + 0.45, PZ1 - 0.6], "bench"),
  block([-8.2, PY + 2.2, PZ1 - 0.2], [-7.8, PY + 2.35, PZ1 + 0.2], "lamp"),
]
// the bottom: the water, struts across it, the pumps, the filter basin with Tinte and the deck round it
const BX0 = -4.5, BX1 = 4.5, BZ0 = 1, BZ1 = 9                          // the filter basin
const TX = 0, TZ = 5.4                                                 // Tinte's body
// an arm from the body out to (x, z): a chain of small blocks along the line, thinner toward the tip
const arm = (x, z) => round(10, (i) => { const t = (i + 1) / 10, cx = TX + (x - TX) * t, cz = TZ + (z - TZ) * t, r = 0.28 - 0.16 * t
  return block([cx - r, DEEP + 0.45, cz - r], [cx + r, DEEP + 0.45 + 2 * r, cz + r], "tinte") })
const BOTTOM = [
  block([-R, DEEP - 1, -R], [R, DEEP, R], "water"),
  block([-R, DEEP + 3.5, 10.4], [R, DEEP + 4.3, 11.2], "strut"),
  block([-6.2, DEEP + 3.5, -R], [-5.4, DEEP + 4.3, R], "strut"),
  // the pumps, as big as houses, on the left and right at the bottom
  ...[[-8, -5], [8, -4], [-8.5, 7]].flatMap(([x, z]) => [cyl(x, z, 2.4, DEEP, DEEP + 6, "pump"), cyl(x, z, 1.4, DEEP + 6, DEEP + 8.5, "motor")]),
  // the deck round the basin, its walls, the water inside lit from below, and Tinte
  block([BX0 - 1.5, DEEP + 1.2, BZ0 - 2], [BX1 + 1.5, DEEP + 1.4, BZ0], "deck"),
  block([BX0, DEEP, BZ0], [BX1, DEEP + 1.6, BZ0 + 0.4], "concrete"), block([BX0, DEEP, BZ1 - 0.4], [BX1, DEEP + 1.6, BZ1], "concrete"),
  block([BX0, DEEP, BZ0], [BX0 + 0.4, DEEP + 1.6, BZ1], "concrete"), block([BX1 - 0.4, DEEP, BZ0], [BX1, DEEP + 1.6, BZ1], "concrete"),
  block([BX0 + 0.4, DEEP, BZ0 + 0.4], [BX1 - 0.4, DEEP + 0.4, BZ1 - 0.4], "basin"),
  cyl(TX, TZ, 1.4, DEEP + 0.4, DEEP + 1.3, "tinte"),
  ...[[-3.8, 1.6], [-1.5, 1.5], [1.8, 1.6], [3.8, 2.4], [-3.6, 7.8], [3.4, 8.2], [0.5, 8.4], [-3.9, 4.5]].flatMap(([x, z]) => arm(x, z)),
  ...[[-3, -1.5], [3, -1.5], [0, 10]].map(([x, z]) => block([x - 0.4, DEEP + 7, z - 0.25], [x + 0.4, DEEP + 7.15, z + 0.25], "lamp")),
]
const LIGHTS = [
  ...[[-3, -1.5], [3, -1.5], [0, 10]].map(([x, z]) => ({ p: [x, DEEP + 6.8, z], I: 0.55, R: 14 })),        // floods over the bottom
  { p: [-8, PY + 2.0, PZ1 - 0.5], I: 0.45, R: 7 },                                                             // the platform's lamp
  { p: [SX + 0.7, -6, SZ + 1.5], I: 0.3, R: 8 }, { p: [SX + 0.7, -18, SZ + 1.5], I: 0.3, R: 8 },         // the stair tower's lamps
  { p: [TX, DEEP + 0.2, TZ], I: 0.5, R: 6 },                                                             // the basin, lit from below
]
// blocks: one value per material, so the shapes read and nothing is painted
const MATS = {
  pile: { a: 0.3, e: 0 }, soil: { a: 0.1, e: 0 }, waler: { a: 0.6, e: 0 }, scaffold: { a: 0.55, e: 0 }, landing: { a: 0.7, e: 0 },
  step: { a: 0.6, e: 0 }, beam: { a: 0.35, e: 0 }, rail: { a: 0.6, e: 0 }, bench: { a: 0.3, e: 0 }, deck: { a: 0.38, e: 0 }, lamp: { a: 0.3, e: 1.0 },
  water: { a: 0.06, e: 0 }, strut: { a: 0.4, e: 0 }, pump: { a: 0.42, e: 0 }, motor: { a: 0.32, e: 0 }, concrete: { a: 0.45, e: 0 },
  basin: { a: 0.3, e: 0.75 }, tinte: { a: 0.04, e: 0 }, body: { a: 0.85, e: 0 }, teo: { a: 0.9, e: 0.15 },
}
// built from the rim down (y 0 the rim); the library's ground is the plane y = 0, so all of it is lifted by the depth: the water is that ground
const LIFT = -DEEP
const lift = (p) => p.kind === "cyl" ? { ...p, y0: p.y0 + LIFT, y1: p.y1 + LIFT } : { ...p, a: [p.a[0], p.a[1] + LIFT, p.a[2]], b: [p.b[0], p.b[1] + LIFT, p.b[2]] }
const ROOM = [...WALL, ...WALERS, ...STAIRS, ...PLATFORM, ...BOTTOM.slice(1)].map(lift)
const world = (extra, mats = { ...MATS, floor: { a: 0.06, e: 0, wet: 0.6, gloss: 0.6 } }) => feedWorld({ prims: [...ROOM, ...extra.map(lift)],
  lights: LIGHTS.map((Lt) => ({ ...Lt, p: [Lt.p[0], Lt.p[1] + LIFT, Lt.p[2]] })), materials: mats, ground: "floor", ambient: 0.22, sky: 0.02, rain: 0 })
const bake = (key, extra) => bakeFeed(CAM, world(extra), { exposure: 1.15, key })

// the people as block figures: body and head, standing or sitting; asleep lying along the bench
const person = (x, y0, z, o = {}) => {
  const h = o.sit ? 1.25 : 1.75, m = o.m ?? "body"
  return [cyl(x, z, 0.22, y0, y0 + h - 0.27, m), cyl(x, z, 0.14, y0 + h - 0.27, y0 + h, m)]
}
const BXS = PX1 - 1.0                                                   // the bench, along the platform's open side
const sleeper = (z) => [block([BXS - 0.25, PY + 0.45, z - 0.85], [BXS + 0.25, PY + 0.7, z + 0.85], "body"), block([BXS - 0.2, PY + 0.47, z + 0.85], [BXS + 0.2, PY + 0.75, z + 1.1], "body")]
const SCHICHT = [...person(-1.2, DEEP + 1.4, BZ0 - 0.6, { m: "teo" }), ...person(SX + 0.7, -9 - 0.75, SZ + 2.0)]
const PAUSE = [...sleeper(-5.2), ...sleeper(-3.0), ...person(BXS, PY + 0.45, PZ1 - 0.9, { sit: true }), ...person(-1.2, DEEP + 1.6, BZ0 + 0.2, { sit: true, m: "teo" })]

// the approved blocks, kept to compare
scene("blocks_cam33_schicht", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam33_schicht", SCHICHT)))
scene("blocks_cam33_pause", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam33_pause", PAUSE)))
scene("review_blocks_cam33", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, bake("cam33_schicht", SCHICHT)), (c) => reviewFx(c, W, H))

// ================================================================ the painting, on the blocks' lines (the user approved them, 2026-11-22)
// The same place, camera, lights and things where they were; what changes is the surfaces and the people, drawn small over the picture.
// (the materials see the lifted world: y 0 the water, y 30 the rim)
const fr = (v) => ((v % 1) + 1) % 1
const mid = (hit) => [(hit.prim.a[0] + hit.prim.b[0]) / 2, (hit.prim.a[1] + hit.prim.b[1]) / 2, (hit.prim.a[2] + hit.prim.b[2]) / 2]
const PAINT = {
  // the sheet piles: rust running down in streaks, a seam down each, black and slick above the water
  pile: (P) => {
    const [x, y, z] = P, ang = Math.atan2(x, z) * PILES / (Math.PI * 2)
    if (fr(ang + 0.5) < 0.07) return { a: 0.17, e: 0 }
    const rust = fbm(ang * 3.1, y * 0.3, 2), wet = y < 1.6 ? 0.13 : y < 2.4 ? 0.06 : 0
    return { a: clamp(0.33 + 0.07 * (rust - 0.5) - (rust > 0.64 ? 0.08 : 0) - wet, 0.06, 0.6), e: 0 }
  },
  soil: { a: 0.06, e: 0 },
  // the walers: pale steel, a bolt in the middle of each piece and the joint between them
  waler: (P, n, f, hit) => {
    const [cx, cy, cz] = mid(hit), [x, y, z] = P
    if (n[1] > 0.5) return { a: 0.72, e: 0 }
    if (Math.abs(x - cx) > 0.55 || Math.abs(z - cz) > 0.55) return { a: 0.42, e: 0 }
    if (Math.hypot(x - cx, z - cz) < 0.12 && Math.abs(y - cy) < 0.1) return { a: 0.32, e: 0 }
    return { a: 0.58 + 0.05 * (fbm(x * 2, y * 4 + z, 2) - 0.5), e: 0 }
  },
  scaffold: { a: 0.5, e: 0 }, rail: { a: 0.64, e: 0 },
  // the grating of the stair tower's landings, the steps' nosing
  landing: (P, n) => ({ a: n[1] > 0.5 ? (fr(P[2] * 5) < 0.28 || fr(P[0] * 5) < 0.28 ? 0.38 : 0.6) : 0.42, e: 0 }),
  step: (P, n) => ({ a: n[1] > 0.5 ? (fr(P[2] * 2.5) > 0.85 ? 0.72 : 0.56) : 0.38, e: 0 }),
  // the platform: a darker grating, the beams under it, the bench's slats
  deck: (P, n) => ({ a: n[1] > 0.5 ? (fr(P[0] * 4) < 0.25 || fr(P[2] * 4) < 0.25 ? 0.24 : 0.38) : 0.28, e: 0 }),
  beam: { a: 0.3, e: 0 }, bench: (P, n) => ({ a: n[1] > 0.5 ? (fr(P[2] * 7) < 0.3 ? 0.2 : 0.36) : 0.24, e: 0 }),
  lamp: { a: 0.3, e: 1.0 },
  // the struts: an I-beam, its flange lit, rivets along the web
  strut: (P, n, f, hit) => {
    if (n[1] > 0.5) return { a: 0.56, e: 0 }
    const cy = mid(hit)[1]
    return { a: Math.abs(P[1] - cy) < 0.12 ? (fr(P[0] * 1.3) < 0.06 ? 0.62 : 0.26) : 0.42, e: 0 }
  },
  // the pumps: bands round them, seams down, the top a little lighter; the motors finned
  pump: (P, n, f, hit) => {
    if (n[1] > 0.5) return { a: 0.5, e: 0 }
    const [x, y, z] = P, ang = Math.atan2(x - hit.prim.c[0], z - hit.prim.c[1]) * 6 / Math.PI
    if (fr(y / 1.2) < 0.08) return { a: 0.24, e: 0 }
    if (fr(ang) < 0.05) return { a: 0.3, e: 0 }
    return { a: 0.42 + 0.06 * (fbm(ang, y * 0.8, 2) - 0.5) - (y < 0.8 ? 0.1 : 0), e: 0 }
  },
  motor: (P, n) => ({ a: n[1] > 0.5 ? 0.42 : fr(P[1] * 5) < 0.4 ? 0.22 : 0.34, e: 0 }),
  // the basin: concrete with stains, its rim lighter; the floor lit from below, light moving through the water in patches
  concrete: (P, n) => ({ a: n[1] > 0.5 ? 0.58 : 0.44 - (fbm(P[0] * 2, P[1] * 3 + P[2], 2) > 0.62 ? 0.1 : 0), e: 0 }),
  basin: (P) => ({ a: 0.3, e: 0.42 + 0.42 * fbm(P[0] * 1.6, P[2] * 1.6, 2) }),
  tinte: (P, n) => ({ a: n[1] > 0.5 ? 0.06 : 0.03, e: 0 }),
  // the water at the bottom: black and still, a mirror for the floods
  floor: (P) => ({ a: 0.04 + 0.02 * fbm(P[0] * 0.4, P[2] * 0.4, 2), e: 0, wet: 0.7, gloss: 0.5 }),
}
const painted = (key) => bakeFeed(CAM, world([], PAINT), { exposure: 1.45, key })
const L = (P) => [P[0], P[1] + LIFT, P[2]]                              // a point in the shaft's own numbers, lifted

// the people, small over the picture: a figure of rows from the head down, each row [x offset, keys]; the feet stand at P
// (a dark rim round it first, so the figure reads against the floods' bright grating)
function person33(c, b, P, rows) {
  const W0 = L(P), on = new Map()
  rows.forEach(([dx, keys], i) => [...keys].forEach((k, j) => { if (k !== ".") on.set((dx + j) + "," + (i - rows.length + 1), k) }))
  for (const xy of on.keys()) { const [x, y] = xy.split(",").map(Number)
    for (const [ox, oy] of [[1, 0], [-1, 0], [0, -1]]) if (!on.has((x + ox) + "," + (y + oy))) pxBehind(c, b, CAM, W0, "2", x + ox, y + oy) }
  for (const [xy, k] of on) { const [x, y] = xy.split(",").map(Number); pxBehind(c, b, CAM, W0, k, x, y) }
}
// standing, about 7 px at the bottom: the head, the body (Teo's vest is the brightest, his accent), the legs
const STAND = (vest) => [[0, "6"], [0, "76"], [-1, vest ? "999" : "666"], [-1, vest ? "989" : "656"], [-1, vest ? "898" : "565"], [-1, "3.3"], [-1, "3.3"]]
const SIT = (vest) => [[0, "6"], [0, "76"], [-1, vest ? "999" : "666"], [-1, vest ? "989" : "656"], [-1, "433"]]
// on the stairs, a little nearer: a helmet
const CLIMB = [[0, "77"], [0, "66"], [-1, "6665"], [-1, "6555"], [-1, "555"], [-1, "3.3"], [-1, "3.3"], [-1, "3.3"]]
// asleep on the bench, from the feet (z0) to the head (z1): a body under a jacket, the head, the patch behind the ear
function lying(c, b, z0, z1, o = {}) {
  const A = L([BXS, PY + 0.62, z0]), B = L([BXS, PY + 0.62, z1]), n = 24
  const pts = round(n + 1, (i) => [add(mul(A, 1 - i / n), mul(B, i / n)), i / n > 0.82])
  // the rim first, all of it, then the body over it (one point's rim would cover the last one's body)
  // half a meter wide from above: five pixels across, lit along the middle, a dark rim on both sides
  const BODY = ["4", "6", "7", "6", "5"], HEAD = ["5", "7", "8", "7", "5"]
  for (const [P, head] of pts) { const w = head ? 1 : 2; pxBehind(c, b, CAM, P, "1", -w - 1, 0); pxBehind(c, b, CAM, P, "1", w + 1, 0) }
  for (const [P, head] of pts) (head ? HEAD.slice(1, 4) : BODY).forEach((k, j, row) => pxBehind(c, b, CAM, P, k, j - (row.length >> 1), 0))
  if (o.dot !== false) pxBehind(c, b, CAM, add(B, [0.1, 0.1, -0.05]), "9", -1, 0)
}
// one sits at the bench's end, his head on his chest, the patch glowing
const SITTER = [[0, "7"], [0, "76"], [-1, "766"], [-1, "665"], [-1, "544"]]
const TEO_SITTER = [[0, "6"], [0, "69"], [-1, "999"], [-1, "989"], [-1, "433"]]
const sitter = (c, b, o = {}) => {
  const P = [BXS, PY + 0.45, PZ1 - 0.9]
  person33(c, b, P, o.teo ? TEO_SITTER : SITTER)
  if (o.dot !== false) pxBehind(c, b, CAM, L(P), "9", 1, -4)
}
// Tinte's speech collar: a ring of light round her body
const collar = (c, b) => round(40, (i) => { const a = (i / 40) * Math.PI * 2; pxBehind(c, b, CAM, L([TX + Math.sin(a) * 1.45, DEEP + 1.32, TZ + Math.cos(a) * 1.45]), i % 5 ? "7" : "9") })
// the depths stenciled on the far side and the hall's name under the rim (the city's tech is English, style guide; set in the game's font)
const signs = (c) => {
  for (const [d, t] of [[14, "-14 M"], [22, "-22 M"]]) { const [x, y] = at(CAM, L([-7.9, -d + 0.55, 8.4])); TXT.draw(c, x, y, t, "7", { font: "hud", align: "left" }) }
  const [x, y] = at(CAM, L([-3.2, -9.45, R - 1.6])); TXT.draw(c, x, y, "PUMP HALL 3", "8", { font: "hud", align: "left" })
}
const base = (key) => [(c) => paintFeed(c, painted(key)), signs, (c) => collar(c, painted(key))]
const TEO_DECK = [-1.6, DEEP + 1.4, BZ0 - 1.6], TEO_RIM = [-1.2, DEEP + 1.6, BZ0 + 0.2], CLIMBER = [SX + 0.7, -9 - 0.75, SZ + 2.0]
const sleepers = (c, b, dots) => { lying(c, b, -6.05, -4.1, { dot: dots }); lying(c, b, -3.85, -1.9, { dot: dots }) }

// before the night shift: the hall empty but for one on the stairs
scene("cam33_bg", { w: W, h: H, bg: "0" }, ...base("cam33"), (c) => person33(c, painted("cam33"), CLIMBER, CLIMB))
// from 20:00: Teo on the deck before the basin
scene("cam33_schicht", { w: W, h: H, bg: "0" }, ...base("cam33"), (c) => person33(c, painted("cam33"), TEO_DECK, STAND(true)))
// the break from 23:00 (Saturday, Monday): three asleep on the platform, Teo sitting on the basin's rim by Tinte
scene("cam33_pause", { w: W, h: H, bg: "0" }, ...base("cam33"), (c) => { const b = painted("cam33"); sleepers(c, b, false); sitter(c, b, { dot: false }); person33(c, b, TEO_RIM, SIT(true)) })
// Sunday's break: Teo asleep with them, at the bench's end
scene("cam33_pause_so", { w: W, h: H, bg: "0" }, ...base("cam33"), (c) => { const b = painted("cam33"); sleepers(c, b, false); sitter(c, b, { teo: true, dot: false }) })
// (the patches are dark in both: cam33_takt lights them, below)
scene("review_cam33", { w: W, h: H, bg: "0" }, ...base("cam33"), (c) => person33(c, painted("cam33"), TEO_DECK, STAND(true)), (c) => reviewFx(c, W, H))

// ================================================================ the patches' beat
// In the break the sleepers' patches are dark in the pictures; over them the engine plays cam33_takt, the dots alone, all at once, in
// Lull's beat: long, short, short, long, then a pause (story §10b; the beat Motte counts at his mother's). Small, only where the dots are.
const dotsOf = () => [
  ...[-4.1, -1.9].map((z1) => { const [x, y] = at(CAM, add(L([BXS, PY + 0.62, z1]), [0.1, 0.1, -0.05])); return [x - 1, y] }),
  ...(() => { const [x, y] = at(CAM, L([BXS, PY + 0.45, PZ1 - 0.9])); return [[x + 1, y - 4]] })(),
]
const DOTS = dotsOf()
const TX0 = Math.min(...DOTS.map((d) => d[0])) - 1, TY0 = Math.min(...DOTS.map((d) => d[1])) - 1
const TW = Math.max(...DOTS.map((d) => d[0])) - TX0 + 2, TH = Math.max(...DOTS.map((d) => d[1])) - TY0 + 2
const BEAT = [[1, 600], [0, 200], [1, 200], [0, 200], [1, 200], [0, 200], [1, 600], [0, 900]]
anim("cam33_takt", { w: TW, h: TH, frames: BEAT.length },
  ...BEAT.map(([on, ms]) => frame({ ms }, (c) => { if (on) for (const [x, y] of DOTS) { c.px(x - TX0, y - TY0, "9"); c.px(x - TX0 - 1, y - TY0, "7") } })))

// ================================================================ what the game needs (game/places.js cam33)
// a person's box (half a meter round, h high), in the lifted world
const around = (P, h) => boxCorners(L(add(P, [-0.3, 0, -0.3])), L(add(P, [0.3, h, 0.3])))
const CAM33_LAYOUT = {
  // the basin's node hears what is said at the basin (Tinte's speech collar is in the hall's net): the feed's sound comes from there
  mic: at(CAM, L([TX, DEEP + 1.5, BZ0])).slice(0, 2),
  takt: [TX0, TY0],
  polys: {
    // Teo where he is: on the deck before the basin, on its rim, or at the bench's end (each at least 12 px, the hotspot rule)
    teoDeck: hullOf(CAM, around(TEO_DECK, 1.8), 1),
    teoRim: hullOf(CAM, around(TEO_RIM, 1.3), 1),
    teoBench: hullOf(CAM, around([BXS, PY + 0.45, PZ1 - 0.9], 1.3), 1),
    // Tinte: the basin's lit floor with her in it
    tinte: hullOf(CAM, [L([BX0 + 0.4, DEEP + 0.4, BZ0 + 0.4]), L([BX1 - 0.4, DEEP + 0.4, BZ0 + 0.4]), L([BX0 + 0.4, DEEP + 0.4, BZ1 - 0.4]), L([BX1 - 0.4, DEEP + 0.4, BZ1 - 0.4])], 0),
    // the sleepers on the bench
    bench: hullOf(CAM, [L([BXS - 0.4, PY + 0.45, -6.1]), L([BXS + 0.4, PY + 0.45, -6.1]), L([BXS - 0.4, PY + 0.7, -1.8]), L([BXS + 0.4, PY + 0.7, -1.8])], 1),
    // the stair tower down the right-hand wall, and the pumps at the bottom
    stairs: hullOf(CAM, [L([SX, -27, SZ]), L([SX + SW, -27, SZ + SL]), L([SX, -15, SZ]), L([SX + SW, -15, SZ + SL])], 0),
    pump: hullOf(CAM, boxCorners(L([-10.4, DEEP, -7.4]), L([-5.6, DEEP + 8.5, -2.6])), 0),
  },
}
console.log("CAM33_LAYOUT " + JSON.stringify(CAM33_LAYOUT))
