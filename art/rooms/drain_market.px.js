// The Drain Market seen straight down, as in Dreamweb (kapitel1-design §9, style guide §4): the drained flood channel under the
// Ninth, a black market on its bed. The user approved its layout as blocks (art/test/drain_market_oben_blocks.px.js, 2026-11-11):
// draft F's ground (art/test/drain_market_f_oben.px.js) worked out at twice its size. This file copies that layout exactly (DM.F
// below, in draft units: every number times S = 2) and paints on its lines; nothing stands where the blocks have open floor.
//
//   1280x720, 4x4 screens of 320x180, about 40 px a metre (a person 13 px across the shoulders from above, painted elsewhere).
//   The channel runs left to right in a slow S. Its levels, high to low (higher reads lighter; each drop catches a lit lip on its
//   edge and throws a hard shadow to the lower right, as if lit from the upper left):
//     rim 4.4 m     the Ninth's street along the top and bottom: a wet walkway with a railing at the drop and a pipe along it;
//                   behind it shack roofs (corrugated, tar, tarp held down by tyres, concrete), AC units, water tanks, dishes,
//                   skylights, laundry, plant tubs, a cat on a warm AC; rooftop neon lying flat (English, for the drones)
//     walls         the channel's sloped walls as four concrete treads each, algae on the lowest, the flood's tide lines (pale)
//                   at 1.1 m and 3.3 m, rust and water streaks under the drainpipes that stick out over the rim
//     terraces 2.2  north: the clinic (KIDNEYS ONLY), the jars (USED CHROME), the preacher's crate with WAKE; south: Sable's
//                   curtain in the wall (plum, magenta leaking, the eye sprayed beside it), the shaft's gate under it
//     bed 0         worn concrete in formwork slabs, a few repairs, drain grates; shallow puddles only where water lies (the canal's lip, the grates, the tarps' drip lines, the foot of the stairs), the light over them broken in a few strokes, a kerb along the canal, the market's rubbish
//     deck 0.8      planks: HOT WOK with its fire and the radio, six tables with stools
//     canal -0.8    dark water, the lights on it as broken streaks; three plank footbridges, a noodle raft and a data raft
//     shaft         the stairs down (Chapter 2) under the south terrace, a gate with a chain and a padlock (the only red)
//   Over everything: power cables from rim to rim with junction boxes, the pillar's taps to the stalls, string lights (warm
//   bulbs, a few magenta and cyan), paper lanterns.
//
//   drain_market_bg     1280x720, one frame: the floor and everything on it that does not move, with every animated part's
//                       frame 0 painted in (so the picture is whole without them)
//   drain_market_over   1280x720, one frame, transparent but for what hangs over the people: cables, strings, lanterns
//   drain_market_floss  the data raft DATA 1C/GB with its screens rolling, 12 frames: a part of its own (layer "raft"), not in the
//                       background, so it can leave the market with Pike and Juno on it (game/kapitel2_lantern.js); its sign and the
//                       bollard its rope is tied to stay on the kerb
//   at the right edge   the Ring's last pillar over the canal and both banks (the user approved the block, 2026-11-16:
//                       art/test/tunnel_blocks.px.js): the canal runs in under it, into the dark, on the way out to the swamps; the
//                       slab hangs over everyone (the over layer), its shadow falls out over the water
//   drain_market_<part> small anims, 12 frames at 10 fps, each drawn at its top left over the background (DM.PARTS; the list with
//                       their places and layer, and the runtime lamps, is in drain_market.parts.json, printed by the build as the
//                       line PARTS, which tools/build_art.sh writes there). An "under" part is opaque
//                       over its rect (the background's pixels with the moving thing on them), except the canal strips, which
//                       hold only water; an "over" part is transparent but for its steam. Parts never overlap.
//                       The ad is 36 frames: the Lull patch on the sleeping face keeps Lull's beat (3.6 s, Nagiwa.lullBeat).
// Light (style guide §5, §7): lamps summed per pixel per hue (amber the key: lanterns, food; magenta commerce and Sable's lure;
// cyan only tech: screens, jars, the radio, LED trims, the ad; red only the padlock); a floor pixel takes the strongest hue's
// ramp in a few hard steps (the light compressed), dithered only in one band at each pool's outer falloff. Juno's yellow is nowhere in this room.
// Moving: the wok's fire and steam, the radio's display, the noodle raft's coals and steam, the data raft's and two stalls'
// screens, Ratz's screen, the jars, the clinic's cold lamp, the ad's scanlines and the patch, Sable's leaking light, the
// padlock's LED, the pillar's ring, signs stuttering (DRAIN MARKET's K, TIDE MODS, KIDNEYS ONLY, SLEEP 2C, PACHINKO's bulbs,
// KARAOKE), the tea lights, six strips of the canal's glints and ripples.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  b: "#6e4630", B: "#9a6a40",                                   // floor in strong warm light
  d: "#64265e", D: "#8e3486",                                   // floor in strong magenta light
  l: "#1f5e74", L: "#2c86a0",                                   // floor in strong cyan light
  0: "#05090f", 7: "#0a131f", 8: "#122034", 9: "#1c3150",       // the canal's water
  o: "#2e2019", p: "#4e3526", E: "#74513a", F: "#9c7048",       // wood: planks, crates, counters, cardboard
  J: "#2e1220", K: "#4e1e2e", "%": "#73304a",                   // Sable's plum curtain
  "*": "#16211e", "]": "#152a26", "=": "#203c36", "+": "#30594b", "&": "#4a7c66", "`": "#6a9a80",   // algae, green tarps, greens
  "<": "#7a3e22",                                               // rust tarp
  "(": "#5e1a52",                                               // plum tarp
  "@": "#6a5c9c", "{": "#8a80bc",                               // violet tarp
  "~": "#8a969e", "^": "#c4ccd0", "|": "#e2e8ea",               // the clinic's pale tiles
  ";": "#22332c",                                               // algae lit
  ":": "#56646e",                                               // the tide line (lime)
  "!": "#b89a6a",                                               // pale cardboard
})

const DM = (() => {
  const W = 1280, H = 720, S = 2
  const R = Math.round, fl = Math.floor, TAU = Math.PI * 2
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const bay = ISO.bay
  const hs = (a, b, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  const vn = (x, y, s) => {
    const xi = fl(x), yi = fl(y), fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
    const a = hs(xi, yi, s), b = hs(xi + 1, yi, s), c = hs(xi, yi + 1, s), e = hs(xi + 1, yi + 1, s)
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + e) * sx * sy
  }

  // ======== draft F's layout, copied exactly (draft units; the blocks sample it at x / 2, y / 2) ========
  const yc = (x) => 182 + 16 * Math.sin((x - 40) / 150) + (x - 320) * 0.03
  const yw = (x) => yc(x) + 14 * Math.sin(x / 85 + 0.6) - 10
  const CW = 11
  const NR = -134, NW = -122, NT = -82, NB = -70, SB = 62, ST = 74, SW = 108, SR = 120
  const nTer = (x) => yc(x) + (NW + NT) / 2
  const ARR = [64, 92]
  const STAIRS = [[212, 228, "n"], [404, 418, "n"], [586, 600, "n"], [246, 262, "s"], [516, 532, "s"]]
  const DECK = [28, 198, 203, 234]
  const SHAFT = [452, 478]
  const NICHE = [562, 594]
  const BRIDGES = [140, 330, 538]
  const PIL = { x: 300, r: 13 }
  PIL.y = Math.round(yc(PIL.x) - 50)
  const ground = (x, y) => {
    const d = y - yc(x)
    const inX = (r) => x >= r[0] && x <= r[1]
    if (inX(ARR) && d < NW) { const t = y / (yc(x) + NW); return { h: 6 - 3.8 * Math.floor(t * 18) / 18, k: "stair" } }
    if (inX(SHAFT) && d > SB - 30 && d < ST + 4) return d > SB ? { h: -3, k: "tunnel" } : { h: -Math.floor((d - SB + 30) / 3) * 0.3, k: "shaft" }
    for (const [a, b, side] of STAIRS) if (x >= a && x <= b && (side === "n" ? d >= NT && d < NB : d > SB && d <= ST)) {
      const t = side === "n" ? (d - NT) / (NB - NT) : (ST - d) / (ST - SB); return { h: 2.2 - 2.2 * Math.floor(t * 7) / 7, k: "stair" }
    }
    if (inX(NICHE) && d > SW - 1 && d < SR + 10) return { h: 2.2, k: "niche" }
    if (d < NR) return { h: 4.4, k: "rim" }
    if (d < NW) return { h: 4.4 - 2.2 * (Math.floor((d - NR) / 3) + 1) / 4, k: "wall" }
    if (d < NT) return { h: 2.2, k: "terr" }
    if (d < NB) return { h: 2.2 - 2.2 * (Math.floor((d - NT) / 3) + 1) / 4, k: "wall" }
    if (d > SR) return { h: 4.4, k: "rim" }
    if (d > SW) return { h: 2.2 + 2.2 * (Math.floor((d - SW) / 3) + 1) / 4, k: "wall" }
    if (d > ST) return { h: 2.2, k: "terr" }
    if (d > SB) return { h: 2.2 * (Math.floor((d - SB) / 3) + 1) / 4, k: "wall" }
    if (x >= DECK[0] && x <= DECK[1] && y >= DECK[2] && y <= DECK[3]) return { h: 0.8, k: "deck" }
    const w = Math.abs(y - yw(x))
    if (w < CW) return { h: -0.8, k: "canal" }
    return { h: 0, k: "bed" }
  }
  const STALLS = []
  const stall = (o) => STALLS.push(o)
  const nst = (x, w, o) => { const y = Math.round(yc(x + w / 2) + NW + 2); stall({ x, y, w, h: 26, face: "s", ...o }) }
  nst(2, 54, { tarp: "g", open: true, goods: "junk", sign: ["RAM SIM", "c"], trim: "c", lamp: "c" })
  nst(156, 50, { tarp: "v", open: false, goods: "drives", sign: ["BUY SELL", "m"], trim: "m", lamp: "m" })
  nst(236, 60, { tarp: "m", open: true, goods: "mods", sign: ["TIDE MODS", "c"], trim: "c", lamp: "c" })
  nst(306, 90, { tarp: "s", open: false, goods: "", sign: ["PAWN", "w"], trim: "w", lamp: "w" })
  nst(424, 76, { tarp: "clinic", open: true, goods: "clinic", sign: ["KIDNEYS ONLY", "m"], trim: "m", lamp: "c" })
  nst(506, 74, { tarp: "r", open: true, goods: "jars", sign: ["USED CHROME", "c"], trim: "c", lamp: "c" })
  nst(606, 40, { tarp: "v", open: false, goods: "", sign: ["SOY", "w"], trim: "w", lamp: "w" })
  const bn = (x, w, o) => { const y = Math.round(yc(x + w / 2) + NB + 3); stall({ x, y, w, h: 18, face: "s", ...o }) }
  const bs = (x, w, o) => { const y = Math.round(yc(x + w / 2) + SB - 21); stall({ x, y, w, h: 18, face: "n", ...o }) }
  bn(4, 44, { tarp: "r", open: false, goods: "", sign: ["EEL", "w"], trim: "w", lamp: "w" })
  bn(58, 40, { tarp: "g2", open: true, goods: "fruit", sign: null, trim: null, lamp: "w" })
  bn(346, 52, { tarp: "m", open: false, goods: "", sign: ["SLEEP 2C", "m"], trim: "m", lamp: "m" })
  bn(408, 46, { tarp: "g", open: true, goods: "fish", sign: ["FRESH", "w"], trim: null, lamp: "w" })
  bn(464, 50, { tarp: "v", open: true, goods: "clothes", sign: null, trim: "m", lamp: "w" })
  bn(560, 70, { tarp: "r", open: false, goods: "", sign: ["NOODLE", "w"], trim: "w", lamp: "w" })
  bs(276, 54, { tarp: "v", open: true, goods: "cables", sign: ["CABLE", "c"], trim: "c", lamp: "c" })
  bs(340, 46, { tarp: "g2", open: false, goods: "", sign: ["TEA", "w"], trim: "w", lamp: "w" })
  bs(394, 48, { tarp: "r", open: true, goods: "fruit", sign: null, trim: null, lamp: "w" })
  bs(546, 60, { tarp: "g", open: true, goods: "drives", sign: ["BOOTLEG", "c"], trim: "c", lamp: "c" })
  bs(612, 30, { tarp: "g", open: false, goods: "", sign: null, trim: null, lamp: "w" })
  const sst = (x, w, o) => { const y = Math.round(yc(x + w / 2) + SW - 24); stall({ x, y, w, h: 22, face: "n", ...o }) }
  sst(4, 60, { tarp: "s", open: false, goods: "", sign: ["SOUP", "w"], trim: "w", lamp: "w" })
  sst(70, 52, { tarp: "m", open: true, goods: "drives", sign: ["FAKE ID", "m"], trim: "m", lamp: "m" })
  sst(128, 44, { tarp: "g2", open: false, goods: "", sign: null, trim: null, lamp: "w" })
  sst(176, 62, { tarp: "v", open: true, goods: "clothes", sign: ["SLICKERS", "w"], trim: "w", lamp: "w" })
  sst(274, 70, { tarp: "r", open: false, goods: "", sign: ["DUMPLING", "w"], trim: "w", lamp: "w" })
  sst(352, 56, { tarp: "g", open: true, goods: "junk", sign: ["REPAIR", "c"], trim: "c", lamp: "c" })
  sst(412, 34, { tarp: "s", open: false, goods: "", sign: null, trim: null, lamp: null })
  sst(486, 26, { tarp: "r", open: false, goods: "", sign: null, trim: null, lamp: "w" })
  const RATZ = { x: 168, w: 70, h: 20 }; RATZ.y = Math.round(yc(RATZ.x + 35) + NB + 6)
  const PREACH = { x: 124 }; PREACH.y = Math.round(nTer(124) - 3)
  const WOK = { x: 34, y: DECK[2] + 3, w: 42, h: 26 }
  const TABLES = [[96, 213], [122, 222], [148, 211], [176, 224], [92, 228], [172, 209]]
  const RAFTS = [{ x: 244, w: 34, kind: "noodle" }, { x: 586, w: 30, kind: "screens" }]
  for (const r of RAFTS) r.y = Math.round(yw(r.x + r.w / 2) - 6)
  const AD = { x: 360, y: 0, w: 76, h: 26 }; AD.y = Math.round(yw(398) + CW + 6)
  // ======== end of the copied layout ========

  // ---- the ground at full size, as the blocks sample it
  const Yc = (x) => S * yc(x / S), Yw = (x) => S * yw(x / S)
  const KD = new Array(W * H), HG = new Float32Array(W * H), HO = new Float32Array(W * H)
  const onBridge = (x, y) => BRIDGES.some((bx) => Math.abs(x / S - bx) <= 6 && Math.abs(y / S - yw(x / S)) <= CW + 3)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const g = onBridge(x, y) ? { h: 0, k: "bridge" } : ground((x + 0.5) / S, (y + 0.5) / S), i = y * W + x
    KD[i] = g.k; HG[i] = g.h; HO[i] = g.h
  }
  const kAt = (x, y) => KD[clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)]
  const hAt = (x, y) => HO[clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)]
  const hGr = (x, y) => HG[clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)]
  // what stands raises the shadow map (a stall's tarp 2.4 m, a table 0.75 m, the pillar a great deal)
  const raise = (x0, y0, w, h, dh) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (x >= 0 && y >= 0 && x < W && y < H) HO[y * W + x] = HG[y * W + x] + dh }
  for (const s of STALLS) { s.X = s.x * S; s.Y = s.y * S; s.W = s.w * S; s.H = s.h * S; raise(s.X, s.Y, s.W, s.H, 2.4) }
  const RZ = { X: RATZ.x * S, Y: RATZ.y * S, W: RATZ.w * S, H: RATZ.h * S }
  const WK = { X: WOK.x * S, Y: WOK.y * S, W: WOK.w * S, H: WOK.h * S }
  raise(WK.X, WK.Y, WK.W, WK.H, 0.9)
  for (const [tx, ty] of TABLES) raise(tx * S - 12, ty * S - 10, 24, 20, 0.75)
  const PX = PIL.x * S, PY = PIL.y * S, PR = PIL.r * S
  for (let y = PY - PR; y <= PY + PR; y++) for (let x = PX - PR; x <= PX + PR; x++) if ((x - PX) ** 2 + (y - PY) ** 2 <= PR * PR) HO[y * W + x] = 30
  const PC = { x: PREACH.x * S, y: PREACH.y * S }
  raise(PC.x - 8, PC.y - 6, 16, 12, 0.45)
  raise(RZ.X + 84, RZ.Y + 20, 22, 16, 0.5)

  // ---- lamps: [x, y, hue, radius, strength]; hues w(arm) m(agenta) c(yan) r(ed)
  const LIGHTS = []
  const lamp = (x, y, hue, r, s, rt = true) => LIGHTS.push([R(x), R(y), hue, r, s, rt])
  for (const s of STALLS) {
    const fx = s.X + s.W / 2, fy = s.face === "s" ? s.Y + s.H + 6 : s.Y - 6
    if (s.lamp) lamp(fx, fy, s.lamp, s.lamp === "w" ? 60 : 54, s.lamp === "w" ? 0.55 : 0.5)
    if (s.trim) lamp(fx, fy, s.trim, Math.max(40, s.W * 0.6), 0.3, false)
  }
  const FIRE = { x: WK.X + 24, y: WK.Y + 21 }
  lamp(FIRE.x, FIRE.y, "w", 110, 0.95)
  for (const [x, y] of TABLES) lamp(x * S, y * S, "w", 34, 0.42)
  const RZL = { x: RZ.X + 112, y: RZ.Y + 18 }, RZS = { x: RZ.X + 66, y: RZ.Y + 24 }
  lamp(RZL.x, RZL.y, "w", 64, 0.6); lamp(RZS.x, RZS.y, "c", 40, 0.5)
  lamp(PC.x - 13, PC.y - 7, "w", 40, 0.45)
  lamp(PX, PY, "c", 70, 0.42)
  const ADR = { X: AD.x * S, Y: AD.y * S, W: AD.w * S, H: AD.h * S }
  lamp(ADR.X + ADR.W / 2, ADR.Y + ADR.H / 2, "c", 96, 0.55)
  const RF = RAFTS.map((r) => ({ ...r, X: r.x * S, Y: r.y * S, W: r.w * S, H: 24 }))
  lamp(RF[0].X + 18, RF[0].Y + 12, "w", 70, 0.6); lamp(RF[1].X + 30, RF[1].Y + 12, "c", 64, 0.55)
  const NX0 = NICHE[0] * S, NX1 = NICHE[1] * S, NXM = (NX0 + NX1) / 2
  const NY0 = S * Math.round(yc(578) + SW - 1), NY1 = S * Math.round(yc(578) + SR + 7)
  lamp(NXM, NY0 - 10, "m", 96, 1.0)
  const SX0 = SHAFT[0] * S, SX1 = SHAFT[1] * S, GY = S * Math.round(yc(465) + SB - 31)
  const LOCK = { x: SX0 + 26, y: GY + 6 }
  lamp(LOCK.x, LOCK.y + 2, "r", 10, 0.5)
  lamp(212, 30, "m", 84, 0.55)                                          // DRAIN MARKET by the stairs from the alley
  // neon tubes along the canal's banks: [x0, x1, bank (-1 north, 1 south), hue], full size
  const TUBES = [[0, 184, -1, "c"], [300, 472, 1, "m"], [564, 644, 1, "c"], [692, 888, -1, "m"], [940, 1060, 1, "c"], [1096, 1280, -1, "m"]]
  const tubeY = (x, side) => R(Yw(x) + side * S * (CW + 1))
  for (const [x0, x1, side, hue] of TUBES) for (let x = x0 + 8; x < x1; x += 20) lamp(x, tubeY(x, side), hue, 32, 0.34, (x - x0) % 60 === 8)
  // string lights overhead: [x0, y0, x1, y1, spacing], full size
  const STRINGS = [[0, 240, 400, 190, 18], [300, 208, 660, 300, 18], [520, 184, 840, 256, 20], [760, 224, 1280, 192, 18], [860, 280, 1280, 300, 22],
    [40, 392, 420, 392, 16], [40, 476, 400, 404, 16], [420, 500, 840, 460, 20], [840, 524, 1280, 472, 18], [600, 392, 940, 580, 24]]
  for (const [x0, y0, x1, y1, sp] of STRINGS) {
    const n = fl(Math.hypot(x1 - x0, y1 - y0) / sp)
    for (let i = 1; i < n; i += 3) lamp(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, "w", 32, 0.22, false)
  }
  // paper lanterns, hanging (x, y, r), full size; the bridges' and the curtain's among them
  const LANTERNS = [[220, 400, 7], [280, 476, 7], [368, 400, 6], [120, 488, 6], [500, 272, 6], [792, 320, 6], [1040, 256, 6], [900, 480, 6],
    [1208, 540, 6], [1080, 568, 7], [660, 524, 6], [400, 560, 6], [200, 240, 6], [40, 184, 6], [1272, 256, 6],
    [NX0 - 22, NY0 - 12, 5], [NX1 + 24, NY0 - 12, 5]]
  for (const bx of BRIDGES) LANTERNS.push([bx * S + 16, R(Yw(bx * S) - S * CW - 8), 4])
  for (const [x, y, r] of LANTERNS) lamp(x, y, "w", 52 + r * 3, 0.55)
  // rooftop neon, lying flat on the rims (x, y, text, hue)
  const ROOFSIGNS = [[20, 26, "HOTEL 9", "m"], [262, 50, "CHITS 4 GLASS", "c"], [520, 80, "NOODLE BAR", "w"], [740, 56, "GILLS -40%", "c"], [956, 40, "PACHINKO", "m"],
    [1132, 62, "KARAOKE", "m"], [40, 670, "FLOOD DEBT? WE BUY IT", "c"], [476, 650, "LOVE HOTEL", "m"], [740, 690, "SUMP RUNNER", "w"], [960, 676, "SAKE", "w"]]
  for (const [x, y, t, hue] of ROOFSIGNS) lamp(x + TXT.measure(t, "nagiwa") / 2, y + 3, hue, 52 + t.length * 2, 0.42, false)

  // ---- the roofs as data first (their windows light the street along the drop)
  const rimEdge = (x, north) => S * (yc(clamp(x, 0, W - 1) / S) + (north ? NR : SR))
  const SHACKS = []
  for (const north of [true, false]) {
    let x = north ? -12 : -20
    while (x < W) {
      const w = 56 + fl(hs(x, north ? 1 : 2) * 72), gap = 4 + fl(hs(x, 3) * 10)
      if (north && x + w > ARR[0] * S - 18 && x < ARR[1] * S + 18) { x = ARR[1] * S + 18; continue }
      let e = north ? 1e9 : -1e9
      for (let i = x; i <= x + w; i += 2) { const r = rimEdge(i, north); e = north ? Math.min(e, r) : Math.max(e, r) }
      const y0 = north ? -2 : R(e) + 18, y1 = north ? R(e) - 18 : H + 2
      SHACKS.push({ x, w, y0, y1, north, kind: fl(hs(x, north ? 4 : 5) * 4), seed: x * 3 + (north ? 0 : 7) })
      if (hs(x, 40) < 0.55) { const wx = x + 6 + fl(hs(x, 41) * (w - 18)); SHACKS[SHACKS.length - 1].win = wx; lamp(wx + 4, north ? y1 + 8 : y0 - 8, "w", 30, 0.35, false) }
      x += w + gap
    }
  }

  // ---- light per pixel, per hue
  const HUES = "wmcr"
  const LI = HUES.split("").map(() => new Float32Array(W * H)), LS = new Float32Array(W * H)
  for (const [lx, ly, hue, r, s] of LIGHTS) {
    const A = LI[HUES.indexOf(hue)]
    for (let y = Math.max(0, ly - r); y < Math.min(H, ly + r); y++) for (let x = Math.max(0, lx - r); x < Math.min(W, lx + r); x++) {
      const q = 1 - Math.hypot(x - lx, y - ly) / r
      if (q > 0) { A[y * W + x] += s * q * q; LS[y * W + x] += s * q * q }
    }
  }
  const lightAt = (x, y) => {
    const i = clamp(R(y), 0, H - 1) * W + clamp(R(x), 0, W - 1)
    let best = 0, hue = 0
    for (let j = 0; j < 4; j++) { const v = LI[j][i]; if (v > best) { best = v; hue = j } }
    return { sum: LS[i], hue: best > 0.06 && best > LS[i] * 0.45 ? HUES[hue] : "n", best }
  }
  const lsAt = (x, y) => LS[clamp(R(y), 0, H - 1) * W + clamp(R(x), 0, W - 1)]
  /** a ramp's key for a light level 0..1: flat steps, dithered only in a narrow band where one meets the next */
  const tone = (ramp, v, x, y) => {
    const s = clamp(v, 0, 0.999) * ramp.length, i = fl(s), f = s - i
    return ramp[Math.min(ramp.length - 1, f > 0.8 && bay(x, y) < (f - 0.8) * 5 ? i + 1 : i)]
  }
  /** an object's key: its material's ramp, lit by the lamps (value only: the thing keeps its own colour) */
  const hard = (ramp, v) => ramp[clamp(fl(clamp(v, 0, 0.999) * ramp.length), 0, ramp.length - 1)]
  const lit = (ramp, base, x, y, k = 0.5) => hard(ramp, base + lsAt(x, y) * k)
  const RAMPS = {
    wet: { n: "efzZX", w: "eaAbB", m: "eiIdD", c: "etTlL", r: "errqq" },
    dry: { n: "k12345", w: "k1aAbB", m: "k1iIdD", c: "k1tTlL", r: "k1rrqq" },
    wood: { n: "kooppE", w: "kopEFF", m: "kopIdd", c: "kopTll", r: "kopprr" },
    alg: { n: "k*;", w: "k*;a", m: "k*;i", c: "k*;t", r: "k*;r" },
  }
  const BR = { w: ["O", "P", "Q", "R"], m: ["n", "M", "m", "N"], c: ["c", "C", "v", "V"], r: ["r", "r", "q", "q"] }

  // ---- buffers: the background without its moving parts (BASE), the water mask, the shadow mask
  const BASE = new Array(W * H), WM = new Uint8Array(W * H), SH = new Uint8Array(W * H)
  const mkPen = (put, get) => {
    const p = {
      px: (x, y, k) => { if (k) put(R(x), R(y), k) },
      rect: (x, y, w, h, k) => { x = R(x); y = R(y); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, k) },
      hline: (x, y, w, k) => p.rect(x, y, w, 1, k),
      vline: (x, y, h, k) => p.rect(x, y, 1, h, k),
      line: (x0, y0, x1, y1, k) => { for (const [x, y] of ISO.lineCells(R(x0), R(y0), R(x1), R(y1))) put(x, y, k) },
      disc: (cx, cy, r, k) => { cx = R(cx); cy = R(cy); for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (i * i + j * j <= r * r + r * 0.6) put(cx + i, cy + j, k) },
      ell: (cx, cy, rx, ry, k) => { cx = R(cx); cy = R(cy); for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) if ((i * i) / (rx * rx + 0.6 * rx) + (j * j) / (ry * ry + 0.6 * ry) <= 1) put(cx + i, cy + j, k) },
      ring: (cx, cy, r, k) => { cx = R(cx); cy = R(cy); for (let j = -r - 1; j <= r + 1; j++) for (let i = -r - 1; i <= r + 1; i++) { const d = i * i + j * j; if (d <= r * r + r * 0.6 && d > (r - 1) * (r - 1) + (r - 1) * 0.6) put(cx + i, cy + j, k) } },
      grid: (x, y, rows, map = {}) => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") put(R(x) + i, R(y) + j, map[ch] ?? ch) })),
      text: (x, y, s, k, o = {}) => TXT.draw(p, x, y, s, k, { font: "hud", ...o }),
      key: (x, y) => get(R(x), R(y)),
      is: (x, y, keys) => { const k = get(R(x), R(y)); return !!k && keys.includes(k) },
    }
    return p
  }
  const inB = (x, y) => x >= 0 && y >= 0 && x < W && y < H
  const bufPen = (buf, mask) => mkPen((x, y, k) => { if (inB(x, y)) { buf[y * W + x] = k; if (mask) mask[y * W + x] = 0 } }, (x, y) => (inB(x, y) ? buf[y * W + x] : undefined))
  const p = bufPen(BASE, WM)
  // the data raft is painted into a buffer of its own: it is a part that moves (drain_market_floss), the water stays under it
  const FLOSS = new Array(W * H), fp = bufPen(FLOSS)

  // ---- the water: dark, rippling along the flow, the lights on it in broken streaks. f, amp: a canal part's frame and how
  // much it moves there (0 at a strip's ends, so it meets the still water round it); frame 0 is the still water
  const water = (x, y, f = 0, amp = 0) => {
    const i = y * W + x, L = lightAt(x, y), dy = y - Yw(x), edge = Math.abs(dy) > S * CW - 3, ph = f / 12 * TAU
    if (SH[i]) return edge ? "7" : "0"
    const rip = Math.sin(x * 0.105 + Math.sin(y * 0.4) * 2.2 + y * 0.65 - amp * Math.sin(ph) * 1.6)
    let key = rip > 0.93 ? "8" : rip > 0.6 ? "7" : "0"
    if (edge) key = "7"
    const o = hs(y, 9) * TAU, shimmer = amp * 7 * (Math.sin(ph + o) - Math.sin(o))
    const dash = (y & 1) === 0 && ((x + fl(hs(y, 7) * 80) + 1000) % 28) < 6 + L.best * 24 + shimmer
    if (L.hue !== "n" && dash && L.best > 0.1) key = BR[L.hue][clamp(fl(L.best * 4), 0, 3)]
    else if (L.sum > 0.12 && rip > 0.75 + amp * 0.08 * (Math.cos(ph * 2 + x * 0.05) - Math.cos(x * 0.05))) key = "9"
    return key
  }

  // ---- the floor: material by kind, light by the lamps, a hard shadow below each drop (lit from the upper left), a lit lip
  const PUD = new Uint8Array(W * H)
  const freeAt = (x, y, w, h) => { for (let j = -2; j < h + 2; j++) for (let i = -2; i < w + 2; i++) { const X = x + i, Y = y + j; if (!inB(X, Y)) return false; const kk = KD[Y * W + X]; if (!(kk === "bed" || kk === "terr")) return false; if (HO[Y * W + X] !== HG[Y * W + X]) return false } return x + w < ADR.X || x > ADR.X + ADR.W || y + h < ADR.Y || y > ADR.Y + ADR.H }
  // the drain grates: by the kerb, the water runs to them
  const GRATES = []
  for (let x = 40; x < W - 20; x += 150) for (const side of [-1, 1]) {
    const gx = x + (side > 0 ? 70 : 0), gy = R(Yw(gx) + side * (S * CW + 10)) - 3
    if (freeAt(gx, gy, 12, 6)) GRATES.push([gx, gy])
  }
  // puddles where water would lie, each an ellipse [cx, cy, rx, ry]: along the canal's lip (the floor falls to it), round the
  // grates, in the drip lines under the tarps' front edges, at the foot of the stairs; nowhere else
  const PUDS = []
  for (let x = 30; x < W; x += 64) for (const side of [-1, 1]) {
    if (hs(x, side + 3, 41) < 0.45) continue
    const cx = x + fl(hs(x, side, 42) * 30), cy = Yw(cx) + side * (S * CW + 10)
    PUDS.push([cx, cy, 7 + fl(hs(x, side, 43) * 9), 2 + fl(hs(x, side, 44) * 2)])
  }
  for (const [gx, gy] of GRATES) PUDS.push([gx + 6, gy + 3, 11, 4])
  for (const s0 of STALLS) {
    const fy = s0.face === "s" ? s0.Y + s0.H + 5 : s0.Y - 6
    for (let k = 0; k < (s0.W > 90 ? 2 : 1); k++) { if (hs(s0.x, k, 45) < 0.35) continue; PUDS.push([s0.X + s0.W * (0.25 + 0.5 * k) + fl(hs(s0.x, k, 46) * 10) - 5, fy, 6 + fl(hs(s0.x, k, 47) * 6), 2]) }
  }
  for (const [a, b, side] of STAIRS) { const cx = (a + b) * S / 2; PUDS.push([cx, Yc(cx) + (side === "n" ? S * NB + 6 : S * SB - 6), (b - a) * S / 2 + 2, 3]) }
  { const cx = (ARR[0] + ARR[1]) * S / 2; PUDS.push([cx + 4, Yc(cx) + S * NW + 7, 22, 3]) }
  const inPuddle = (x, y) => PUDS.some(([cx, cy, rx, ry]) => { if (Math.abs(x - cx) > rx * 1.2 || Math.abs(y - cy) > ry * 1.2) return false; const dx = (x - cx) / rx, dy = (y - cy) / ry; return dx * dx + dy * dy < 0.85 + 0.4 * vn(x / 4, y / 3, 9) })
  const PATCHES = [[40, 300, 70, 20], [470, 286, 52, 26], [860, 312, 90, 18], [1180, 300, 60, 22], [520, 468, 60, 22], [880, 380, 44, 30], [150, 560, 40, 18], [640, 600, 70, 16], [1000, 196, 50, 14], [300, 196, 60, 14]]
  const PIPES = { n: [62, 250, 360, 612, 760, 980, 1110, 1250], s: [40, 200, 380, 600, 760, 870, 1000, 1236] }
  const floor = () => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, k = KD[i], h = HG[i], L = lightAt(x, y)
      let shadow = 0
      for (let s = 1; s <= 20; s++) if (hAt(x - s, y - s) - h > s * 0.24) { shadow = 1; break }
      SH[i] = shadow
      if (k === "canal") { BASE[i] = water(x, y); WM[i] = 1; continue }
      if (k === "tunnel") { BASE[i] = (y & 1) && x % 6 === 0 ? "1" : "k"; continue }
      const dn = Math.min(hGr(x, y + 1), hGr(x + 1, y), hGr(x, y - 1), hGr(x - 1, y))
      const lip = h - dn > 0.3
      let mat = "wet", base = 0.27, ramp
      const north = y < Yc(x)
      if (k === "rim") { mat = "wet"; base = 0.3 }
      else if (k === "wall") { mat = h < 0.6 ? "alg" : "dry"; base = h < 0.6 ? 0.45 : 0.2 + h * 0.065 }
      else if (k === "terr" || k === "niche") base = k === "niche" ? 0.24 : 0.33
      else if (k === "deck" || k === "bridge") { mat = "wood"; base = 0.36 + ((y - DECK[2] * S) % 8 === 0 ? -0.14 : 0) }
      else if (k === "stair") { mat = "dry"; base = 0.34 + h * 0.02 }
      else if (k === "shaft") { mat = "dry"; base = clamp(0.42 + h * 0.13, 0, 1) }
      const flat = k === "bed" || k === "terr"
      const puddle = flat && !(k === "bed" && Math.abs(y - Yw(x)) < S * CW + 4) && inPuddle(x, y)
      PUD[i] = puddle ? 1 : 0
      // the light lying on the floor, compressed so a pool has few steps; a shallow puddle a little darker than the concrete
      const a = 0.34 * (1 - Math.exp(-L.sum * 1.8))
      let v = base + a - (puddle ? 0.2 : 0)                // a puddle: one step of the wet ramp darker
      // concrete poured again after the floods: smoother slabs with a dark joint round them
      if (flat && !puddle) for (const [px, py, pw, ph] of PATCHES) if (x >= px && x < px + pw && y >= py && y < py + ph) { v += (x === px || y === py || x === px + pw - 1 || y === py + ph - 1) ? -0.1 : 0.03; break }
      if (flat && !puddle && (x % 96 === 48 || (k === "terr" && x % 64 === 0) || R(y - Yc(x)) % 44 === 0)) v -= 0.1          // the formwork's joints, cast along the channel
      // the canal's kerb: dressed stone a step lighter along the water
      if (k === "bed" && Math.abs(y - Yw(x)) < S * CW + 4) { mat = "dry"; v = 0.32 + a * 1.1 }
      // water streaks down the walls under the drainpipes, rust in their middle
      let rust = false
      if (k === "wall") for (const px of PIPES[north ? "n" : "s"]) { const dx = Math.abs(x - px - R(Math.sin(y * 0.3) * 0.6)); if (dx <= 1) { v -= 0.12; if (dx === 0 && h > 2.2) rust = true } }
      if (shadow) v -= 0.28
      if (lip && !shadow) v += 0.24
      if ((k === "stair" || k === "shaft") && hGr(x, y + (north || k === "shaft" ? 1 : -1)) < h - 0.05) v -= 0.3        // a riser's dark line
      if (k === "stair" && hGr(x, y + (north ? -1 : 1)) > h + 0.05) v += 0.2                                                // the next tread's nosing
      ramp = RAMPS[mat][L.hue]
      const lk = hard(ramp, v), uk = hard(RAMPS[mat].n, v - a)
      let key = a < 0.02 ? uk : a < 0.065 ? (bay(x, y) < (a - 0.02) / 0.045 ? lk : uk) : lk
      // a puddle mirrors the light over it as a few broken strokes
      if (puddle && !shadow && L.hue !== "n" && L.best > 0.08 && (y & 1) === 0 && ((x + fl(hs(y, 17) * 60)) % 14) < 1 + L.best * 7) key = BR[L.hue][clamp(fl(L.best * 3), 0, 2)]
      if (rust) key = shadow ? "o" : "O"
      // the flood's tide lines: pale along the lip of the tread at 1.1 m and at 3.3 m
      if (k === "wall" && lip && !shadow && (Math.abs(h - 1.1) < 0.01 || Math.abs(h - 3.3) < 0.01)) key = ":"
      BASE[i] = key
    }
  }
  floor()
  // the puddles mirror what hangs over them: a lantern as a broken amber blot, a bulb as a point (a little below and to the
  // right of the thing itself, which the over layer covers: the camera is not quite straight over every puddle)
  {
    const mir = (x, y, k) => { x = R(x); y = R(y); if (inB(x, y) && PUD[y * W + x] && !SH[y * W + x]) BASE[y * W + x] = k }
    for (const [x, y, r] of LANTERNS) for (let j = -r + 1; j < r; j++) for (let i = -r + 1; i < r; i++) {
      const d = Math.hypot(i, j * 1.3); if (d >= r - 0.5 || (j & 1 && d > r * 0.5)) continue
      mir(x + 3 + i + (j & 1), y + 7 + j, d < r * 0.35 ? "R" : d < r * 0.7 ? "Q" : "P")
    }
    for (const [x0, y0, x1, y1, sp] of STRINGS) {
      const n = fl(Math.hypot(x1 - x0, y1 - y0) / sp)
      for (let i = 1; i < n; i++) { const hue = i % 5 === 2 ? "m" : i % 7 === 3 ? "c" : "w", bx = x0 + (x1 - x0) * i / n + 2, by = y0 + (y1 - y0) * i / n + 5; mir(bx, by, BR[hue][2]); mir(bx + 1, by, BR[hue][1]) }
    }
  }

  // ---- small helpers
  const NEON = { m: ["n", "M", "m", "N"], c: ["c", "C", "v", "V"], w: ["O", "P", "Q", "R"], r: ["r", "r", "q", "q"] }
  /** a neon sign lying flat: a dark board, the tubes' glow round the letters, the letters lit; state 1 on, 0.5 dim, 0 off */
  const neon = (q, x, y, s, hue, o = {}) => {
    const font = o.font ?? "nagiwa", st = o.state ?? 1, w = TXT.measure(s, font), hh = font === "hud" ? 5 : 7
    const x0 = o.align === "left" ? R(x) : R(x - w / 2), N = NEON[hue]
    if (o.board !== false) { q.rect(x0 - 3, y - 3, w + 6, hh + 6, "k"); q.rect(x0 - 2, y - 2, w + 4, hh + 4, o.boardKey ?? "1") }
    if (st === 1) TXT.draw(q, x0, y, s, N[2], { font, outline: N[0] })
    else if (st > 0) TXT.draw(q, x0, y, s, N[1], { font, outline: o.boardKey ?? "1" })
    else TXT.draw(q, x0, y, s, N[0], { font, outline: o.boardKey ?? "1" })
    return [x0 - 3, y - 3, w + 6, hh + 6]
  }
  /** a painted board: cream letters on wood */
  const board = (q, x, y, s, font = "nagiwa") => {
    const w = TXT.measure(s, font), hh = font === "hud" ? 5 : 7, x0 = R(x - w / 2)
    q.rect(x0 - 3, y - 3, w + 6, hh + 6, "k"); q.rect(x0 - 2, y - 2, w + 4, hh + 4, lit("opE", 0.4, x, y, 0.4)); q.hline(x0 - 2, y + hh + 1, w + 4, "o")
    TXT.draw(q, x0, y, s, lit("FRW", 0.45, x, y, 0.4), { font })
  }
  const bigText = (q, x, y, s, k, sc = 2, font = "nagiwa") => TXT.draw({ px: (X, Y, kk) => q.rect(x + (X - x) * sc, y + (Y - y) * sc, sc, sc, kk) }, x, y, s, k, { font })
  const shadowRect = (q, x, y, w, h) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const k = q.key(x + i, y + j); if (k && !WM[(y + j) * W + x + i]) q.px(x + i, y + j, DARK[k] ?? k) } }
  const DARK = { X: "Z", Z: "z", z: "f", f: "e", 2: "1", 3: "2", 4: "3", 5: "4", 6: "5", A: "a", a: "e", b: "A", B: "b", I: "i", i: "e", d: "I", D: "d", T: "t", t: "e", l: "T", L: "l", E: "p", F: "E", p: "o", ";": "*" }

  // ======== the rims: the street along the drop, shack roofs behind it ========
  const signRects = ROOFSIGNS.map(([x, y, t]) => [x - 6, y - 6, TXT.measure(t, "nagiwa") + 12, 19])
  const hitsSign = (x, y, w, h) => signRects.some(([a, b, c, d]) => x < a + c && x + w > a && y < b + d && y + h > b)
  const roofShack = (q, s) => {
    const { x, w, y0, y1, north, kind, seed } = s, h = y1 - y0
    q.rect(x + 3, y0 + 3, w, h, "k")
    const T3 = (a, b) => hs(seed + a, b)
    if (kind === 0) {                                   // corrugated sheet: ribs toward the channel, screws along the purlins, rust
      for (let i = 0; i < w; i++) q.rect(x + i, y0, 1, h, "2324"[i % 4])
      for (let yy = y0 + 10; yy < y1; yy += 22) for (let i = 2; i < w; i += 8) q.px(x + i, yy, "5")
      for (let n = 0; n < 2; n++) if (T3(n, 1) < 0.6) { const rx = x + 4 + fl(T3(n, 2) * (w - 20)), ry = y0 + 4 + fl(T3(n, 3) * Math.max(1, h - 24)); for (let j = 0; j < 14; j++) for (let i = 0; i < 10; i++) if (vn((rx + i) / 4, (ry + j) / 4, seed) > 0.55 && i % 4 !== 3) q.px(rx + i, ry + j, i % 4 === 1 ? "<" : "O") }
    } else if (kind === 1) {                            // tar: rolls laid in strips, a patch, a blister
      q.rect(x, y0, w, h, "1")
      for (let yy = y0 + 14; yy < y1; yy += 16) q.hline(x, yy, w, "k")
      for (let n = 0; n < 2; n++) { const px = x + 4 + fl(T3(n, 5) * (w - 22)), py = y0 + 6 + fl(T3(n, 6) * Math.max(1, h - 20)); q.rect(px, py, 16, 10, "k"); q.rect(px + 1, py + 1, 14, 8, "2"); q.hline(px + 1, py + 1, 14, "3") }
    } else if (kind === 2) {                            // a tarp over the roof, tyres holding it down
      const T = T3(9, 1) < 0.5 ? ["u", "U", "@"] : ["]", "=", "+"]
      q.rect(x, y0, w, h, T[1])
      for (let i = 10; i < w - 2; i += 22) q.rect(x + i, y0, 1, h, T[0])
      for (let yy = y0 + 4; yy < y1 - 4; yy += 6) for (let i = 0; i < w; i += 22) q.px(x + i + 11, yy, T[2])
      for (let n = 0; n < 3; n++) { const tx = x + 8 + fl(T3(n, 7) * (w - 18)), ty = y0 + 8 + fl(T3(n, 8) * Math.max(1, h - 18)); q.disc(tx + 1, ty + 1, 4, "k"); q.disc(tx, ty, 4, "2"); q.disc(tx, ty, 2, "k"); q.px(tx - 2, ty - 3, "4") }
    } else {                                            // a concrete slab
      q.rect(x, y0, w, h, "3"); q.rect(x, y0, w, 1, "4")
      for (let yy = y0 + 20; yy < y1; yy += 20) q.hline(x, yy, w, "2")
    }
    // the eave over the street, the lit side
    q.rect(x, north ? y1 - 2 : y0, w, 2, "4"); q.hline(x, north ? y1 - 1 : y0, w, "5")
    // the window toward the street, warm: someone lives there
    if (s.win !== undefined) { q.rect(s.win, north ? y1 - 1 : y0, 9, 1, "Q"); q.rect(s.win, north ? y1 : y0 - 1, 9, 1, "P") }
    // what stands on it
    const n = 2 + fl(T3(20, 1) * 3)
    for (let j = 0; j < n; j++) {
      const t = T3(30 + j, 2), ax = x + 4 + fl(T3(30 + j, 3) * Math.max(1, w - 30)), ay = y0 + 6 + fl(T3(30 + j, 4) * Math.max(1, h - 34))
      if (ay < 2 || ay > H - 20 || hitsSign(ax - 2, ay - 2, 30, 28)) continue
      if (t < 0.38) {                                   // an AC unit: its fan, the drip's stain running off it
        q.rect(ax + 2, ay + 2, 18, 14, "k"); q.rect(ax, ay, 18, 14, "3"); q.hline(ax, ay, 18, "4"); q.disc(ax + 9, ay + 7, 5, "1")
        for (let a = 0; a < 4; a++) q.line(ax + 9, ay + 7, ax + 9 + R(Math.cos(a * 1.57 + 0.4) * 4), ay + 7 + R(Math.sin(a * 1.57 + 0.4) * 4), "2")
        q.px(ax + 9, ay + 7, "4"); q.vline(ax + 3, ay + 14, north ? 8 : 6, "*")
        if (!s.cat && T3(60, 1) < 0.18) { s.cat = 1; cat(q, ax + 4, ay + 2) }
      } else if (t < 0.62) {                            // a water tank: its lid, the rust rings
        const r = 9 + fl(T3(40 + j, 1) * 4)
        q.disc(ax + r + 2, ay + r + 2, r, "k"); q.disc(ax + r, ay + r, r, "2"); q.ring(ax + r, ay + r, r - 3, "O"); q.disc(ax + r, ay + r, 4, "3"); q.disc(ax + r - 1, ay + r - 1, 2, "4")
        q.line(ax + r - r + 2, ay + r - 4, ax + r - 4, ay + 3, "4")
      } else if (t < 0.76) {                            // a dish turned to the sky, its feed arm
        q.ell(ax + 8, ay + 7, 8, 6, "k"); q.ell(ax + 7, ay + 6, 8, 6, "5"); q.ell(ax + 6, ay + 5, 5, 3, "6"); q.line(ax + 7, ay + 6, ax + 13, ay + 1, "3"); q.px(ax + 13, ay + 1, "2")
      } else if (t < 0.88) {                            // tubs of greens
        for (let i = 0; i < 3; i++) { const tx = ax + i * 9; q.rect(tx, ay, 8, 7, "p"); q.rect(tx + 1, ay + 1, 6, 5, i === 1 ? "+" : "&"); q.px(tx + 3, ay + 2, "`"); q.px(tx + 2, ay + 4, "=") }
      } else {                                          // a laundry line: shirts, towels, nothing yellow
        const lw = Math.min(40, w - 10); q.line(ax, ay + 6, ax + lw, ay + 8, "5")
        for (let i = 3; i < lw - 3; i += 6) q.rect(ax + i, ay + 7 + fl(i * 2 / lw), 4, 5, ["u", "O", "h", "n", "=", "P", "3"][fl(hs(ax + i, 51) * 7)])
      }
    }
    // a skylight lit from the room below
    if (T3(70, 1) < 0.35 && h > 40) { const sx = x + w - 22, sy = north ? y1 - 34 : y0 + 14; if (!hitsSign(sx, sy, 16, 12)) { q.rect(sx, sy, 16, 12, "k"); q.rect(sx + 1, sy + 1, 14, 10, "P"); q.rect(sx + 1, sy + 1, 7, 10, "Q"); q.vline(sx + 8, sy + 1, 10, "k"); q.hline(sx + 1, sy + 5, 14, "k") } }
  }
  const cat = (q, x, y) => {
    // curled asleep on the warm AC: grey, its tail round its nose, the ears up
    q.grid(x, y, ["..k...k...", ".kGk.kGk..", "kGGGGGGGk.", "kGgGGGgGGk", "kGGGGGGgGk", ".kgGGGGGgk", "..kkgggGk.", "....kkkk.."], {})
  }
  const roofs = () => {
    for (const s of SHACKS) roofShack(p, s)
    // the gaps between the shacks: narrow ways, dark
    // the street's edge: a pipe along it, the railing at the drop, the drainpipes' stubs over the edge
    for (const north of [true, false]) for (let x = 0; x < W; x++) {
      if (north && x >= ARR[0] * S - 2 && x <= ARR[1] * S + 2) continue
      if (!north && x >= NX0 - 6 && x <= NX1 + 6) continue
      const e = R(rimEdge(x, north)), sg = north ? -1 : 1
      p.px(x, e + sg * 14, "2"); p.px(x, e + sg * 13, x % 40 === 0 ? "5" : "4"); p.px(x, e + sg * 12, "1")
      p.px(x, e + sg * 2, "k"); p.px(x, e + sg * 1, x % 14 === 0 ? "6" : "5")
      if (x % 14 === 0) p.px(x, e + sg * 2, "6")
    }
    for (const north of [true, false]) for (const px of PIPES[north ? "n" : "s"]) {
      const e = R(rimEdge(px, north)), sg = north ? -1 : 1
      p.rect(px - 1, north ? e - 4 : e + 1, 3, 4, "4"); p.vline(px - 1, north ? e - 4 : e + 1, 4, "5"); p.px(px, north ? e - 1 : e + 1, "k")
    }
    for (const [x, y, t, hue] of ROOFSIGNS) {
      const w = TXT.measure(t, "nagiwa")
      p.rect(x - 6, y - 6, w + 12, 19, "k"); p.rect(x - 5, y - 5, w + 10, 17, "2"); p.hline(x - 5, y - 5, w + 10, "3")
      for (const fx of [x - 6, x + w + 5]) for (const fy of [y - 6, y + 12]) p.px(fx, fy, "4")
      neon(p, x, y, t, hue, { align: "left" })
    }
  }

  // ======== stairs' rails, the arrival's sign ========
  const rails = (x0, x1, top, bot) => {
    for (let x of [x0, x1]) for (let y = R(top(x)); y < R(bot(x)); y++) { p.px(x, y, y % 8 === 0 ? "6" : "5"); p.px(x + (x === x0 ? -1 : 1), y, "k") }
  }
  const stairs = () => {
    for (const [a, b, side] of STAIRS) {
      const x0 = a * S, x1 = b * S + 1
      if (side === "n") rails(x0, x1, (x) => Yc(x) + S * NT, (x) => Yc(x) + S * NB)
      else rails(x0, x1, (x) => Yc(x) + S * SB + 2, (x) => Yc(x) + S * ST + 2)
    }
    rails(ARR[0] * S, ARR[1] * S + 1, () => 0, (x) => Yc(x) + S * NW)
    // a chalked arrow on a step: up is the way out
    const ax = (ARR[0] + ARR[1]) * S / 2, ay = 44
    for (let i = 0; i < 5; i++) { p.px(ax - i, ay + i, "6"); p.px(ax + i, ay + i, "6") }
    p.vline(ax, ay + 1, 9, "6")
    // DRAIN MARKET on the roof beside the stairs' head: magenta tubes in a cyan frame, as from the stairs (drain_arrival)
    p.rect(196, 4, 74, 42, "k"); p.rect(197, 5, 72, 40, "c"); p.rect(198, 6, 70, 38, "1")
    neon(p, 233, 10, "DRAIN", "m", { board: false }); neon(p, 233, 22, "MARKET", "m", { board: false })
    TXT.draw(p, 233 - TXT.measure("NO QUESTIONS", "hud") / 2, 35, "NO QUESTIONS", "C", { font: "hud" })
  }

  // ======== the stalls ========
  const TARP = { v: "uU@{", g: "*]=+", g2: "]=+&", m: "Jn(M", s: "2345", r: "oO<P", clinic: "6~^|" }
  const tarp = (s, x0, y0, w, h, whole) => {
    const T = TARP[s.tarp], south = s.face === "s", spans = Math.max(1, R(w / 52)), span = w / spans
    const ridge = whole ? y0 + (h >> 1) : -1
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
      const fr = whole ? (south ? y >= ridge : y < ridge) : false
      let v = fr ? 0.55 : 0.32
      const u = ((x - x0) % span) / span
      if (Math.abs(u - 0.5) < 0.18 && !fr && whole) v -= 0.08                       // the back sags lowest between the poles
      if (y === ridge) v += 0.2
      p.px(x, y, hard(T, v + lsAt(x, y) * 0.3))
    }
    // creases from the poles into each span
    for (let k = 0; k <= spans; k++) {
      const px = x0 + R(k * span), ey = south ? y0 + h - 1 : y0
      for (const dir of [-1, 1]) {
        if ((k === 0 && dir < 0) || (k === spans && dir > 0)) continue
        const ty = whole ? ridge : (south ? y0 : y0 + h - 1)
        p.line(px + dir * 2, ey, px + dir * R(span * 0.22), R((ey + ty) / 2), T[0])
      }
      p.rect(px - 1, ey - (south ? 1 : 0), 2, 2, "5")                            // the pole's cap
    }
    // grommets along the front hem
    for (let x = x0 + 6; x < x0 + w - 4; x += 12) p.px(x, south ? y0 + h - 2 : y0 + 1, T[3])
    if (whole && w > 70 && hs(s.x, 31) < 0.6) {                                   // rain held in a sag
      const px = x0 + R(span / 2), py = south ? ridge + R(h / 4) : ridge - R(h / 4)
      p.ell(px, py, 6, 3, "8"); p.ell(px - 1, py, 4, 2, "9"); p.px(px - 3, py - 1, "6")
    }
    if (hs(s.x, 32) < 0.5 && w > 60) {                                           // a patch sewn on
      const px = x0 + 10 + fl(hs(s.x, 33) * (w - 30)), py = whole ? (south ? y0 + 3 : ridge + 3) : y0 + 3
      const P2 = TARP[s.tarp === "r" ? "s" : "r"]
      p.rect(px, py, 11, 7, P2[1]); for (let i = 0; i < 11; i += 2) { p.px(px + i, py, P2[3]); p.px(px + i, py + 6, P2[3]) }
    }
  }
  // goods from above, laid out by hand-picked kinds (a pick per item: it is a heap, not a texture)
  const goods = (kind, x, y, w, h) => {
    if (kind === "junk") {
      for (let gx = x; gx < x + w - 5;) {
        const t = hs(gx, y, 9), gy = y + fl(hs(gx, y, 10) * Math.max(1, h - 6))
        if (t < 0.25) { p.rect(gx, gy, 5, 6, "+"); p.px(gx + 1, gy + 1, "Q"); p.px(gx + 3, gy + 4, "Q"); p.hline(gx, gy + 2, 5, "="); gx += 6 }
        else if (t < 0.45) { p.rect(gx, gy, 4, 6, "2"); p.rect(gx, gy, 4, 1, "4"); p.px(gx + 1, gy + 2, "c"); gx += 5 }
        else if (t < 0.6) { p.ring(gx + 3, gy + 3, 3, "k"); p.px(gx + 1, gy + 1, "2"); gx += 7 }
        else if (t < 0.75) { p.rect(gx, gy, 8, 4, "3"); for (let i = 1; i < 7; i += 2) { p.px(gx + i, gy + 1, "5"); p.px(gx + i, gy + 2, "4") } gx += 9 }
        else if (t < 0.88) { p.disc(gx + 2, gy + 2, 2, "5"); p.px(gx + 1, gy + 1, "6"); gx += 5 }
        else { p.rect(gx, gy, 6, 5, "4"); p.rect(gx + 1, gy + 1, 4, 3, "1"); if (t > 0.95) p.px(gx + 2, gy + 2, "v"); gx += 7 }
      }
    } else if (kind === "drives") {
      for (let gy = y; gy < y + h - 4; gy += 6) for (let gx = x; gx < x + w - 3; gx += 4) {
        const t = hs(gx, gy, 3); p.rect(gx, gy, 3, 5, t < 0.5 ? "4" : "5"); p.px(gx + 1, gy, ["M", "C", "h", "3", "6"][fl(t * 5)]); if (t > 0.93) p.px(gx + 1, gy + 3, "v")
      }
    } else if (kind === "mods") {
      for (let gy = y; gy < y + h - 4; gy += 5) { p.rect(x, gy, w, 4, "1"); for (let gx = x + 1; gx < x + w - 3; gx += 5) { const t = hs(gx, gy, 4); p.rect(gx, gy + 1, 3, 2, t > 0.4 ? "C" : "3"); if (t > 0.6) p.px(gx + 1, gy + 1, "v") } }
    } else if (kind === "fruit") {
      const FR = ["P", "&", "S", "M", "Q", "`"]
      for (let gx = x; gx < x + w - 13; gx += 15) {
        const k = FR[fl(hs(gx, y, 5) * FR.length)]
        p.rect(gx, y, 14, h, "o"); p.rect(gx + 1, y + 1, 12, h - 2, "p")
        for (let fy = y + 2; fy < y + h - 2; fy += 3) for (let fx = gx + 2 + ((fy >> 1) & 1); fx < gx + 12; fx += 3) { p.px(fx, fy, k); p.px(fx + 1, fy, k); p.px(fx, fy + 1, k); p.px(fx, fy, DARK[k] ? k : k) }
        p.vline(gx + 7, y + 1, h - 2, "o")
      }
    } else if (kind === "fish") {
      p.rect(x, y, w, h, "h"); for (let i = 0; i < w; i += 5) p.px(x + i, y + (i % 3), "H")
      for (let fx = x + 2; fx < x + w - 10; fx += 8) for (let fy = y + 1; fy < y + h - 3; fy += 4) {
        p.hline(fx, fy, 6, "G"); p.hline(fx + 1, fy + 1, 5, "g"); p.px(fx + 6, fy, "g"); p.px(fx + 7, fy + 1, "g"); p.px(fx + 1, fy, "k")
      }
    } else if (kind === "clothes") {
      const CL = ["u", "n", "3", "O", "U", "=", "%", "h"]
      for (let gx = x; gx < x + w - 8; gx += 10) { const k = CL[fl(hs(gx, y, 6) * CL.length)]; p.rect(gx, y, 9, h, k); p.hline(gx, y + (h >> 1), 9, DARK[k] ?? "k"); p.vline(gx + 8, y, h, "k") }
    } else if (kind === "cables") {
      const CB = ["k", "2", "C", "O", "+", "n"]
      for (let gx = x + 4; gx < x + w - 4; gx += 9) { const k = CB[fl(hs(gx, y, 7) * CB.length)], gy = y + (h >> 1); p.disc(gx, gy, 4, k); p.disc(gx, gy, 2, k === "k" ? "2" : "k"); p.ring(gx, gy, 3, DARK[k] ?? "1") }
    }
  }
  const counter = (x, y, w, h, steel, south) => {
    const ramp = steel ? "23456" : "opEF"
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p.px(x + i, y + j, lit(ramp, 0.4, x + i, y + j, 0.4))
    p.hline(x, south ? y + h - 1 : y, w, steel ? "6" : "F")
  }
  const SIGNS = {}                                                              // where each stall's sign went (the parts take them)
  const drawStall = (s) => {
    const { X, Y, W: Wd, H: Hd } = s, south = s.face === "s"
    p.rect(X - 1, Y - 1, Wd + 2, Hd + 2, "k")
    if (s.open) {
      const th = Hd >= 50 ? 20 : Hd >= 44 ? 16 : 11, ty = south ? Y : Y + Hd - th
      const cy = south ? Y + Hd - 10 : Y
      for (let y = Y; y < Y + Hd; y++) for (let x = X; x < X + Wd; x++) p.px(x, y, s.goods === "clinic" ? (((x - X) % 7 === 0 || (y - Y) % 7 === 0) ? lit("~^", 0.3, x, y, 0.3) : lit("~^|", 0.35, x, y, 0.3)) : lit("efz", 0.25, x, y, 0.5))
      counter(X, cy, Wd, 10, s.goods === "clinic" || s.goods === "jars", south)
      const ay0 = south ? Y + th + 3 : Y + 11, ay1 = south ? cy - 1 : Y + Hd - th - 3        // behind the counter: the seller's place
      if (s.goods === "clinic") {
        const chx = X + R(Wd * 0.42), chy = R((ay0 + ay1) / 2)
        p.rect(chx - 22, chy - 6, 44, 13, "k"); p.rect(chx - 21, chy - 5, 42, 11, "4"); p.rect(chx - 21, chy - 5, 12, 11, "5"); p.rect(chx + 12, chy - 3, 9, 7, "6"); p.hline(chx - 21, chy - 5, 42, "5")
        p.rect(X + 6, cy + 2, 16, 6, "6"); for (let i = 0; i < 4; i++) p.px(X + 8 + i * 3, cy + 4, "H")            // a tray of tools
        p.rect(X + Wd - 24, cy + 1, 18, 8, "h"); p.rect(X + Wd - 24, cy + 1, 18, 2, "H"); p.hline(X + Wd - 22, cy + 5, 14, "W"); p.vline(X + Wd - 15, cy + 2, 7, "W")   // the cooler, a cross of tape
        p.line(X + Wd - 14, ay0, X + Wd - 14, ay0 + 6, "5"); p.rect(X + Wd - 17, ay0 - 1, 6, 3, "h")                     // a drip stand
      } else if (s.goods === "jars") {
        // implants in jars of cyan fluid: the glass's rim, the fluid, the thing in it dark, a glint
        const jar = (gx, gy, r, t) => { p.disc(gx + 1, gy + 1, r, "k"); p.disc(gx, gy, r, "C"); p.disc(gx, gy, r - 1, "c"); p.px(gx, gy, t > 0.5 ? "5" : "2"); if (r > 2) p.px(gx + 1, gy, "3"); p.px(gx - 1, gy - 1, "V"); p.ring(gx, gy, r, "C") }
        for (let gx = X + 5; gx < X + Wd - 4; gx += 7) { jar(gx, cy + 5, 2, hs(gx, 1)) }
        for (let gx = X + 6; gx < X + 34; gx += 8) for (const gy of [ay0 + 4, ay0 + 12]) jar(gx, gy, 3, hs(gx, gy))
      } else goods(s.goods, X + 3, cy + 1, Wd - 6, 8)
      // a stool for the seller, a crate at the far end
      const sx = X + R(Wd * 0.62), sy = R((ay0 + ay1) / 2)
      if (s.goods !== "clinic") { p.disc(sx, sy, 3, "k"); p.disc(sx, sy, 2, "3"); p.px(sx - 1, sy - 1, "4") }
      if (ay1 - ay0 > 8 && s.goods !== "clinic") { const cx = X + Wd - 18; p.rect(cx, ay0, 14, ay1 - ay0, "o"); p.rect(cx + 1, ay0 + 1, 12, ay1 - ay0 - 2, "p"); p.vline(cx + 7, ay0 + 1, ay1 - ay0 - 2, "o") }
      if (s.goods === "clothes" && s.sign) {                                   // SLICKERS: a rail of them, clear, grey, blue, plum
        for (let i = 0; i < Wd - 34; i += 5) p.rect(X + 4 + i, ay0, 4, ay1 - ay0, ["h", "3", "U", "%", "+"][fl(hs(X + i, 2) * 5)])
        p.hline(X + 3, ay0, Wd - 30, "5")
      }
      // the tarp left over the back, its front rolled up
      tarp(s, X, ty, Wd, th, false)
      const T = TARP[s.tarp], ry = south ? ty + th : ty - 3
      for (let x = X; x < X + Wd; x++) { p.px(x, ry, T[2]); p.px(x, ry + 1, T[3]); p.px(x, ry + 2, T[1]) }
      for (const px of [X + 1, X + Wd - 3]) p.rect(px, south ? Y + Hd - 3 : Y + 1, 2, 2, "5")
    } else {
      tarp(s, X, Y, Wd, Hd, true)
      p.rect(X + 2, south ? Y + Hd - 5 : Y + 1, Wd - 4, 4, lit("opEF", 0.4, X + Wd / 2, south ? Y + Hd : Y, 0.4))
      p.hline(X + 2, south ? Y + Hd - 2 : Y + 1, Wd - 4, "F")
    }
    // ropes from the back corners to rings in the wall or blocks on the floor
    const by = south ? Y - 1 : Y + Hd
    for (const [cx, dx] of [[X, -1], [X + Wd - 1, 1]]) { const ex = cx + dx * 6, ey = by + (south ? -7 : 7); p.line(cx, by, ex, ey, "4"); p.rect(ex - 1, ey - 1, 3, 3, "3"); p.px(ex, ey, "2") }
    if (s.trim) { const ty = south ? Y + Hd - 1 : Y; for (let x = X; x < X + Wd; x++) if (hs(x, 2) > 0.1 && (x & 1)) p.px(x, ty, NEON[s.trim][2]) }
    if (s.sign) {
      const [t, hue] = s.sign, font = (!s.open || Hd >= 44) && TXT.measure(t, "nagiwa") < Wd - 10 ? "nagiwa" : "hud", hh = font === "hud" ? 5 : 7
      const th = Hd >= 50 ? 20 : Hd >= 44 ? 16 : 11
      const sy = s.open ? (south ? Y + R((th - hh) / 2) : Y + Hd - th + R((th - hh) / 2)) : (south ? Y + Hd - hh - 12 : Y + 9)
      const painted = ["EEL", "SOUP", "TEA", "FRESH", "SOY"].includes(t)
      if (painted) board(p, X + Wd / 2, sy, t, font)
      else SIGNS[t] = { rect: neon(p, X + Wd / 2, sy, t, hue, { font }), x: X + Wd / 2, y: sy, hue, font }
    }
    if (s.lamp) { const lx = X + R(Wd / 2), ly = south ? Y + Hd : Y - 1; p.disc(lx, ly, 1, NEON[s.lamp][3]); p.px(lx, ly, "W") }
  }

  // ======== the story's things ========
  const drawRatz = () => {
    const { X, Y, W: Wd, H: Hd } = RZ
    // an old woven blanket, rust with plum stripes, frayed at its ends, heaped with junk; the crate he sits on at its front; his
    // work lamp on a pole; a small screen on a box turned to the customers; a cardboard sign
    p.rect(X - 1, Y - 1, Wd + 2, Hd + 2, "k")
    for (let y = Y; y < Y + Hd; y++) for (let x = X; x < X + Wd; x++) { const r = (y - Y) % 12; p.px(x, y, lit(r < 2 ? "J(" : r === 6 ? "OP" : "oO<", 0.3, x, y, 0.5)) }
    for (let y = Y; y < Y + Hd; y += 2) { p.px(X - 2, y, "O"); p.px(X + Wd + 1, y, "O"); p.px(X - 3, y + 1, "o") }
    goods("junk", X + 4, Y + 4, 74, 14); goods("junk", X + 4, Y + 22, 60, 14); goods("cables", X + 110, Y + 2, 28, 12)
    p.rect(X + 30, Y + 20, 18, 10, "5"); p.rect(X + 31, Y + 21, 16, 8, "3"); p.hline(X + 32, Y + 23, 14, "2")      // a gutted deck
    p.ring(X + 54, Y + 8, 5, "2"); p.ring(X + 54, Y + 8, 3, "k")                                                     // headphones, spare
    // the crate (where Ratz sits, painted later)
    const cx = RZ.X + 84, cy = RZ.Y + 20
    p.rect(cx + 2, cy + 2, 22, 16, "k"); p.rect(cx, cy, 22, 16, "p"); for (let j = 0; j < 16; j += 4) p.hline(cx, cy + j, 22, "o"); p.rect(cx, cy, 22, 1, "E"); p.vline(cx, cy, 16, "E")
    // the screen on its box
    p.rect(RZS.x - 8, RZS.y - 6, 16, 12, "k"); p.rect(RZS.x - 7, RZS.y - 5, 14, 10, "3"); p.rect(RZS.x - 6, RZS.y - 4, 12, 7, "c")
    // the work lamp: its shade from above, the bulb in it
    p.line(RZL.x, RZL.y, RZL.x - 6, RZL.y + 10, "4"); p.disc(RZL.x, RZL.y, 4, "2"); p.disc(RZL.x, RZL.y, 2, "Q"); p.px(RZL.x, RZL.y, "W")
    // JUNK on a card
    p.rect(X + 10, Y + Hd - 4, 22, 9, "k"); p.rect(X + 11, Y + Hd - 3, 20, 7, "!"); TXT.draw(p, X + 13, Y + Hd - 2, "JUNK", "o", { font: "hud" })
  }
  const drawWok = () => {
    const { X, Y, W: Wd, H: Hd } = WK
    // HOT WOK: a back shelf with its sign, the stove (the wok on its fire, a pot), the cook's aisle, the front counter (bowls, the
    // radio), a pass counter toward the tables
    p.rect(X - 1, Y - 1, Wd + 2, Hd + 2, "k")
    for (let y = Y; y < Y + 12; y++) for (let x = X; x < X + Wd; x++) p.px(x, y, lit("23456", 0.35, x, y, 0.4))
    for (let y = Y + 12; y < Y + 28; y++) for (let x = X; x < X + Wd; x++) p.px(x, y, lit("123456", 0.3, x, y, 0.45))
    p.hline(X, Y + 27, Wd, "5")
    for (let y = Y + 40; y < Y + Hd; y++) for (let x = X; x < X + Wd; x++) p.px(x, y, lit("opEF", 0.4, x, y, 0.4))
    p.hline(X, Y + 40, Wd, "F")
    for (let y = Y + 28; y < Y + 40; y++) for (let x = X + Wd - 12; x < X + Wd; x++) p.px(x, y, lit("opEF", 0.4, x, y, 0.4))
    p.vline(X + Wd - 12, Y + 28, 12, "F")
    for (let y = Y + 28; y < Y + 40; y++) for (let x = X; x < X + Wd - 12; x++) p.px(x, y, (y - Y) % 8 === 4 ? "o" : lit("opEF", 0.3, x, y, 0.35))   // the cook's aisle, planks
    // on the shelf: jars of spice, a stack of bowls
    for (let i = 0; i < 4; i++) { p.disc(X + 6 + i * 6, Y + 6, 2, "k"); p.px(X + 6 + i * 6, Y + 6, ["P", "O", "&", "S"][i]) }
    // the wok (its fire is a part), a pot with its lid, a gas bottle, a board with spring onions and a cleaver
    const { x: fx, y: fy } = FIRE
    p.disc(fx, fy, 9, "k"); p.disc(fx, fy, 8, "4"); p.disc(fx, fy, 7, "1"); p.disc(fx - 1, fy - 1, 4, "2"); p.px(fx - 3, fy - 3, "5")
    for (const [dx, dy, k] of [[2, 1, "Q"], [-1, 2, "&"], [3, -2, "P"], [0, -1, "Q"], [-3, 0, "S"]]) p.px(fx + dx, fy + dy, k)
    p.line(fx + 9, fy, fx + 18, fy - 1, "3")
    p.disc(X + 56, fy, 6, "k"); p.disc(X + 56, fy, 5, "4"); p.disc(X + 56, fy, 3, "5"); p.px(X + 56, fy, "6")
    p.disc(X + 75, Y + 18, 4, "k"); p.disc(X + 75, Y + 18, 3, "g"); p.px(X + 74, Y + 17, "G")
    p.rect(X + 34, Y + 14, 12, 7, "E"); for (let i = 0; i < 6; i++) p.px(X + 36 + i, Y + 16 + (i & 1), "&"); p.rect(X + 40, Y + 18, 5, 2, "5")
    // the front counter: bowls stacked, chopsticks in a cup, sauce bottles; the radio (its display a part)
    for (let i = 0; i < 4; i++) { p.disc(X + 8 + i * 8, Y + 46, 3, "h"); p.disc(X + 8 + i * 8, Y + 46, 1, "H") }
    p.disc(X + 44, Y + 45, 2, "o"); p.px(X + 44, Y + 44, "F"); p.px(X + 45, Y + 45, "F")
    p.disc(X + 50, Y + 47, 1, "O"); p.disc(X + 54, Y + 47, 1, "P")
    p.rect(RADIO.x - 1, RADIO.y - 1, 14, 9, "k"); p.rect(RADIO.x, RADIO.y, 12, 7, "2"); for (let i = 0; i < 5; i++) p.vline(RADIO.x + 1 + i, RADIO.y + 1, 5, i & 1 ? "1" : "3"); p.rect(RADIO.x + 7, RADIO.y + 1, 4, 3, "c"); p.px(RADIO.x + 9, RADIO.y + 5, "4"); p.line(RADIO.x + 11, RADIO.y, RADIO.x + 16, RADIO.y - 5, "5")
    // on the pass: bowls of noodles ready for the tables
    for (let j = 0; j < 2; j++) { p.disc(X + Wd - 6, Y + 31 + j * 6, 2, "H"); p.px(X + Wd - 6, Y + 31 + j * 6, "Q") }
    // HOT WOK, amber, on the shelf's edge
    SIGNS["HOT WOK"] = { rect: neon(p, X + 50, Y + 2, "HOT WOK", "w", { font: "hud" }), x: X + 50, y: Y + 2, hue: "w", font: "hud" }
  }
  const RADIO = { x: WK.X + 62, y: WK.Y + 43 }
  const drawTables = () => {
    for (const [tx, ty] of TABLES) {
      const x = tx * S, y = ty * S
      // two plastic stools, a steel folding table, two bowls, chopsticks, a tea light, a bottle of chili oil
      for (const [sx, sy, k] of [[x - 16, y - 2, "u"], [x + 16, y + 3, hs(x, 1) > 0.5 ? "=" : "%"]]) { p.disc(sx + 1, sy + 1, 4, "k"); p.disc(sx, sy, 4, k); p.disc(sx, sy, 2, DARK[k] ?? "J"); p.px(sx - 2, sy - 2, "6") }
      p.rect(x - 11, y - 9, 24, 20, "k"); p.rect(x - 12, y - 10, 24, 20, "k")
      for (let j = 0; j < 18; j++) for (let i = 0; i < 22; i++) p.px(x - 11 + i, y - 9 + j, lit("23456", 0.38, x - 11 + i, y - 9 + j, 0.4))
      p.hline(x - 11, y - 9, 22, "6")
      for (const [bx, by] of [[x - 6, y - 3], [x + 5, y + 4]]) { p.disc(bx, by, 3, "h"); p.disc(bx, by, 2, "P"); p.px(bx, by, "Q"); p.px(bx - 1, by - 1, "R") }
      p.line(x - 3, y + 2, x + 2, y - 4, "E"); p.line(x - 2, y + 2, x + 3, y - 4, "F")
      p.disc(x + 6, y - 5, 1, "O"); p.px(x + 6, y - 5, "P")
      TEAL.push([x - 7, y + 5])
    }
  }
  const TEAL = []
  const drawPreacher = () => {
    const { x, y } = PC
    // his crate (he is painted later), WAKE on a card propped against it, two thermos flasks, a hurricane lamp
    p.rect(x - 8, y - 6, 16, 12, "k"); p.rect(x - 7, y - 5, 14, 10, "p"); p.hline(x - 7, y - 5, 14, "E"); p.hline(x - 7, y - 1, 14, "o"); p.hline(x - 7, y + 3, 14, "o"); p.vline(x - 7, y - 5, 10, "E")
    p.rect(x + 10, y - 5, 21, 11, "k"); p.rect(x + 11, y - 4, 19, 9, "!"); p.hline(x + 11, y + 4, 19, "F"); TXT.draw(p, x + 13, y - 2, "WAKE", "k", { font: "hud" })
    for (const [fx, fy] of [[x - 13, y + 3], [x - 12, y + 9]]) { p.disc(fx, fy, 2, "k"); p.disc(fx, fy, 1, "5"); p.px(fx, fy, "3") }
    p.disc(x - 13, y - 7, 3, "k"); p.disc(x - 13, y - 7, 2, "P"); p.px(x - 13, y - 7, "R")
  }
  const drawPillar = () => {
    // the city's pillar rising through the market: its footing, its round shaft, the maintenance ring (its lights a part), a
    // junction box with the stolen power taped in, its number stencilled
    p.disc(PX + 4, PY + 4, PR + 5, "k"); p.disc(PX, PY, PR + 5, "2"); p.ring(PX, PY, PR + 5, "3")
    for (let a = 0; a < 16; a++) p.px(PX + R(Math.cos(a * TAU / 16) * (PR + 3)), PY + R(Math.sin(a * TAU / 16) * (PR + 3)), "4")
    for (let y = PY - PR; y <= PY + PR; y++) for (let x = PX - PR; x <= PX + PR; x++) {
      const dx = x - PX, dy = y - PY, d = Math.hypot(dx, dy)
      if (d > PR) continue
      const lv = 0.42 + (-dx - dy) / PR * 0.14 + lsAt(x, y) * 0.3
      p.px(x, y, hard("123456", lv))
    }
    p.ring(PX, PY, PR - 4, "2"); p.ring(PX, PY, PR - 5, "4")
    p.ring(PX, PY, 8, "3")
    p.rect(PX + PR - 2, PY + 6, 10, 8, "k"); p.rect(PX + PR - 2, PY + 6, 9, 7, "4"); p.hline(PX + PR - 2, PY + 6, 9, "5"); p.px(PX + PR + 1, PY + 9, "v")
    TXT.draw(p, PX - 7, PY - 3, "P-17", "1", { font: "hud" })
  }
  const PILLAR_LEDS = 12, ledAt = (a) => [PX + R(Math.cos(a * TAU / PILLAR_LEDS) * (PR - 4)), PY + R(Math.sin(a * TAU / PILLAR_LEDS) * (PR - 4))]
  const drawAd = (q, f = 0) => {
    // the projection: cyan light on the wet concrete, its edge dithered (it is light), a face asleep with Lull's patch behind
    // its ear, LULL, SLEEP BETTER, NAGI·WA; scan rows, one band of them rolling
    const { X, Y, W: Wd, H: Hd } = ADR, band = (f * 2) % (Hd + 12) - 6
    for (let j = -3; j < Hd + 3; j++) for (let i = -3; i < Wd + 3; i++) {
      const x = X + i, y = Y + j, k = KD[y * W + x]
      if (k !== "bed" || Math.abs(y - Yw(x)) < S * CW + 4) continue
      const edge = Math.max(-i, -j, i - Wd + 1, j - Hd + 1)
      if (edge > 0) { if (bay(x, y) < 0.45 - edge * 0.12) q.px(x, y, "t"); continue }
      q.px(x, y, j % 3 === 2 ? "t" : Math.abs(j - band) < 2 ? "l" : "T")
    }
    const fx = X + 30, fy = Y + 26
    q.ell(fx, fy, 15, 20, "C"); q.ell(fx, fy, 13, 18, "l")
    q.ell(fx - 3, fy - 13, 12, 8, "C")                                             // the hair
    q.line(fx - 9, fy - 3, fx - 4, fy - 2, "v"); q.line(fx + 3, fy - 2, fx + 8, fy - 3, "v")       // eyes shut
    q.hline(fx - 2, fy + 9, 5, "C"); q.px(fx, fy + 3, "C")
    q.ell(fx + 15, fy + 1, 2, 4, "C")                                              // the ear
    const on = (() => { const t = (f * 100) % 3600; return t < 800 || (t >= 1100 && t < 1350) || (t >= 1650 && t < 1900) || (t >= 2200 && t < 3000) })()
    q.ell(fx + 19, fy + 2, 2, 3, on ? "h" : "C"); q.px(fx + 19, fy + 1, on ? "V" : "l"); q.px(fx + 19, fy + 2, on ? "V" : "l")
    bigText(q, X + 62, Y + 6, "LULL", "V")
    TXT.draw(q, X + 62, Y + 26, "SLEEP BETTER", "v", { font: "nagiwa" })
    TXT.draw(q, X + 62, Y + 40, "NAGI WA", "C", { font: "hud" }); q.px(X + 62 + TXT.measure("NAGI", "hud") + 1, Y + 42, "C")
  }
  const drawBridges = () => {
    for (const bx of BRIDGES) {
      const x0 = bx * S - 12, x1 = bx * S + 13
      for (let x = x0; x <= x1; x++) {
        const top = R(Yw(x) - S * (CW + 3)), bot = R(Yw(x) + S * (CW + 3))
        for (let y = top; y <= bot; y++) {
          if (KD[y * W + x] !== "bridge") continue
          const r = (y - top) % 6, worn = Math.abs(x - bx * S) < 5
          p.px(x, y, r === 5 ? "o" : lit(worn ? "opEF" : "oppE", r === 0 ? 0.48 : 0.36, x, y, 0.45))
          if (r === 2 && (x === x0 + 2 || x === x1 - 2)) p.px(x, y, "k")                  // nails
        }
        if (x === x0 || x === x1) for (let y = top; y <= bot; y++) p.px(x, y, (y - top) % 10 === 0 ? "6" : "4")
      }
    }
  }
  const drawRafts = () => {
    for (const r of RF) {
      const { X, Y, W: Wd, H: Hd } = r, q = r.kind === "screens" ? fp : p
      // planks lashed over drums: the drums show at the ends, a rope to a bollard on the kerb
      for (const dx of [2, Wd - 8]) { q.ell(X + dx + 3, Y + 2, 3, 2, "3"); q.ell(X + dx + 3, Y + Hd - 2, 3, 2, "3") }
      q.rect(X + 1, Y + 1, Wd, Hd - 2, "k")
      for (let y = Y; y < Y + Hd - 2; y++) for (let x = X; x < X + Wd; x++) { const c = (x - X) % 6; q.px(x, y, c === 5 ? "o" : lit("opE", 0.38 + (c === 0 ? 0.1 : 0), x, y, 0.45)) }
      for (const lx of [X + 3, X + Wd - 4]) for (let y = Y; y < Y + Hd - 2; y += 4) q.px(lx, y, "!")
      const kx = X - 6, ky = R(Yw(X - 6) - S * CW - 4)
      p.line(X, Y + 6, kx, ky, "5"); p.disc(kx, ky, 2, "4"); p.px(kx, ky, "6")
      if (r.kind === "noodle") {
        p.disc(NOODLE.x, NOODLE.y, 5, "k"); p.disc(NOODLE.x, NOODLE.y, 4, "2"); p.disc(NOODLE.x, NOODLE.y, 2, "4")     // the pot over the coals
        for (const [sx, sy] of [[X + 34, Y + 6], [X + 34, Y + 16]]) { p.disc(sx, sy, 3, "k"); p.disc(sx, sy, 2, "u") }
        p.rect(X + 44, Y + 3, 12, 8, "o"); p.rect(X + 45, Y + 4, 10, 6, "p"); for (let i = 0; i < 3; i++) p.disc(X + 47 + i * 3, Y + 15, 1, "h")
        SIGNS["BOAT NOODLE"] = { rect: neon(p, X + Wd / 2, Y + Hd + 4, "BOAT NOODLE", "w", { font: "hud" }), x: X + Wd / 2, y: Y + Hd + 4, hue: "w", font: "hud" }
      } else {
        q.rect(X + 40, Y + 4, 10, 14, "k"); q.rect(X + 41, Y + 5, 8, 12, "3"); q.hline(X + 41, Y + 6, 8, "4"); q.px(X + 47, Y + 15, "v")   // a battery bank
        q.line(X + 45, Y + 5, X + 54, Y - 2, "4"); q.px(X + 54, Y - 2, "6")                                               // its aerial
        neon(p, X + Wd / 2, Y + Hd + 4, "DATA 1C/GB", "c", { font: "hud" })
      }
    }
  }
  const NOODLE = { x: RF[0].X + 16, y: RF[0].Y + 11 }
  const SCREENS = [[RF[1].X + 6, RF[1].Y + 4], [RF[1].X + 22, RF[1].Y + 4]]
  const drawShaft = () => {
    // the gate across the stairs' head (striped pale and dark, never yellow), the chain, the padlock (its LED a part), the
    // terrace's edge over the tunnel's mouth, SUMP 9 / NO ENTRY stencilled on the wall beside
    p.rect(SX0 - 2, R(Yc(SX0 + 26) + S * SB) - 2, SX1 - SX0 + 5, 3, "4")
    p.rect(SX0 - 4, GY - 2, SX1 - SX0 + 9, 5, "k")
    for (let x = SX0 - 3; x <= SX1 + 3; x++) { p.px(x, GY - 1, "k"); p.px(x, GY, fl(x / 4) % 2 ? "h" : "1"); p.px(x, GY + 1, fl(x / 4) % 2 ? "g" : "k") }
    for (const px of [SX0 - 4, SX1 + 3]) { p.rect(px - 1, GY - 3, 4, 7, "k"); p.rect(px, GY - 2, 2, 5, "5") }
    for (let x = SX0 + 4; x < SX1 - 4; x++) p.px(x, GY + 4 + R(Math.sin((x - SX0 - 4) / (SX1 - SX0 - 8) * Math.PI) * 3) + (x & 1), "4")
    p.rect(LOCK.x - 3, LOCK.y - 1, 7, 7, "k"); p.rect(LOCK.x - 2, LOCK.y, 5, 5, "5"); p.hline(LOCK.x - 2, LOCK.y, 5, "6"); p.ring(LOCK.x, LOCK.y - 2, 2, "4")
    TXT.draw(p, SX1 + 10, GY + 10, "SUMP 9", "5", { font: "hud" }); TXT.draw(p, SX1 + 10, GY + 18, "NO ENTRY", "5", { font: "hud" })
  }
  const drawNiche = (q, f = 0) => {
    // Sable's curtain: an opening in the south wall going in under the street (its edge a concrete lintel over it), the heavy plum
    // cloth hung across it in deep folds, the magenta leaking past its edges and under its hem (the part stutters it)
    const x0 = NX0, x1 = NX1, y0 = NY0, y1 = NY1
    const st = f === 0 ? 1 : [1, 1, 1, 0.6, 1, 1, 1, 1, 0.3, 1, 0.7, 1][f]
    const hemK = (x) => st > 0.8 ? ((x & 1) ? "m" : "M") : st > 0.5 ? ((x & 1) ? "M" : "n") : "n"
    const edgeK = (y) => st > 0.8 ? ((y & 1) ? "m" : "N") : st > 0.5 ? "M" : "n"
    if (f === 0 && q === p) {
      p.rect(x0 - 8, y0 - 2, x1 - x0 + 17, y1 - y0 + 4, "k")
      p.rect(x0 - 8, y0 - 2, 6, y1 - y0 + 2, "3"); p.rect(x1 + 3, y0 - 2, 6, y1 - y0 + 2, "3"); p.vline(x0 - 3, y0 - 2, y1 - y0 + 2, "4"); p.vline(x1 + 8, y0 - 2, y1 - y0 + 2, "2")
      p.rect(x0 - 10, y1 - 6, x1 - x0 + 21, 8, "4"); p.hline(x0 - 10, y1 - 6, x1 - x0 + 21, "5"); p.hline(x0 - 10, y1 + 1, x1 - x0 + 21, "2")
      for (let x = x0; x <= x1 + 1; x++) {
        const fo = fl((x - x0) / 2) % 5, sag = R(Math.sin((x - x0) / (x1 - x0) * Math.PI) * 3), bot = y0 + 30 + sag
        for (let y = y0; y < bot; y++) p.px(x, y, fo === 0 ? "J" : fo === 1 ? "%" : fo === 4 ? "J" : "K")
        p.px(x, y0, fo === 1 || fo === 2 ? "%" : "K")
      }
      p.rect(x0 - 3, y0 - 3, x1 - x0 + 7, 2, "5"); for (let x = x0; x < x1; x += 8) p.px(x, y0 - 2, "6")          // the rail it hangs from
      // a mark only those who know read: a small magenta eye sprayed on the wall beside it, its overspray
      const ex = x1 + 24, ey = y0 + 14
      p.grid(ex - 6, ey - 3, [".MMMMMMM...", "M..mmm..M..", "M.mNNNm.M.M", "M..mmm..M..", ".MMMMMMM..."].map((r) => r.replace(/\./g, ".")))
      for (const [dx, dy] of [[-8, -4], [5, -5], [-7, 4], [6, 4], [9, -1]]) p.px(ex + dx, ey + dy, "n")
      p.vline(ex - 2, ey + 3, 4, "n")
    }
    for (let x = x0; x <= x1 + 1; x++) { const sag = R(Math.sin((x - x0) / (x1 - x0) * Math.PI) * 3), bot = y0 + 30 + sag; q.px(x, bot, hemK(x)); if ((x & 3) === 1) q.px(x, bot + 1, st > 0.5 ? "M" : "n"); if ((x & 7) === 3 && st > 0.8) q.px(x, bot + 2, "M") }
    for (let y = y0; y < y0 + 32; y++) { q.px(x1 + 2, y, edgeK(y)); q.px(x0 - 1, y, (y % 3) && st > 0.5 ? "M" : edgeK(y)) }
  }
  const drawCanalTubes = () => {
    for (const [x0, x1, side, hue] of TUBES) for (let x = x0; x < x1; x++) {
      if (hs(x, 78) < 0.05 || BRIDGES.some((b) => Math.abs(x - b * S) < 16) || RF.some((r) => x > r.X - 8 && x < r.X + r.W + 8 && side < 0)) continue
      const y = tubeY(x, side)
      if (KD[y * W + x] === "canal") continue
      p.px(x, y, NEON[hue][2]); p.px(x, y + side, NEON[hue][1])
    }
  }
  const drawBedMarks = () => {
    // drain grates by the kerb and on the terraces, oil under the wok's gas, the market's rubbish (skewers, cups, paper)
    const free = (x, y, w, h) => { for (let j = -2; j < h + 2; j++) for (let i = -2; i < w + 2; i++) { const k = p.key(x + i, y + j), kk = KD[(y + j) * W + x + i]; if (!(kk === "bed" || kk === "terr")) return false; if (HO[(y + j) * W + x + i] !== HG[(y + j) * W + x + i]) return false } return x + w < ADR.X || x > ADR.X + ADR.W || y + h < ADR.Y || y > ADR.Y + ADR.H }
    for (const [gx, gy] of GRATES) {
      p.rect(gx, gy, 12, 6, "1"); for (let i = 1; i < 11; i += 2) p.vline(gx + i, gy + 1, 4, "k"); p.hline(gx, gy, 12, "3")
    }
    for (let n = 0; n < 140; n++) {
      const x = 10 + fl(hs(n, 81) * (W - 20)), y = 10 + fl(hs(n, 82) * (H - 20)), t = hs(n, 83)
      if (!free(x, y, 6, 6)) continue
      // rubbish gathers near what sells food
      const food = STALLS.some((s) => ["NOODLE", "DUMPLING", "SOUP", "EEL", "TEA"].includes(s.sign?.[0]) && Math.abs(x - s.X - s.W / 2) < s.W && Math.abs(y - s.Y - s.H / 2) < s.H + 30) || (x < 420 && y > 380 && y < 520)
      if (!food && t < 0.6) continue
      if (t < 0.35) p.line(x, y, x + 4, y + 2, "E")
      else if (t < 0.6) { p.disc(x, y, 1, "h"); p.px(x, y, "g") }
      else if (t < 0.8) { p.rect(x, y, 3, 2, "G"); p.px(x + 1, y + 2, "h") }
      else p.px(x, y, "O")
    }
  }

  // ======== paint the background ========
  roofs()
  stairs()
  drawCanalTubes()
  drawBridges()
  drawRafts()
  p.rect(DECK[0] * S, DECK[3] * S + 1, (DECK[1] - DECK[0]) * S + 2, 1, "F")
  drawBedMarks()
  for (const s of STALLS) drawStall(s)
  drawRatz(); drawWok(); drawTables(); drawPreacher(); drawPillar(); drawShaft()
  drawAd(p, 0); drawNiche(p, 0)

  // ======== the moving parts ========
  const PARTS = []
  const part = (name, x, y, w, h, layer, draw, o = {}) => PARTS.push({ name: "drain_market_" + name, x: R(x), y: R(y), w, h, layer, draw, frames: o.frames ?? 12, water: o.water })
  // the wok's fire licking out under the wok, its glow on the stove
  part("wok", FIRE.x - 11, FIRE.y - 11, 23, 23, "under", (q, f) => {
    for (let a = 0; a < 40; a++) {
      const an = a / 40 * TAU, fl2 = hs(a, f, 3), r = 10 + (fl2 > 0.45 ? 1 : 0)
      for (let rr = 10; rr <= r; rr++) q.px(FIRE.x + R(Math.cos(an) * rr), FIRE.y + R(Math.sin(an) * rr), rr === 10 ? (fl2 > 0.3 ? "Q" : "P") : rr === 11 ? "P" : "O")
    }
    q.ring(FIRE.x, FIRE.y, 9, (f % 3) ? "4" : "5")
  })
  // its steam, rising and drifting to the east over the cook and the pass
  const puff = (q, x, y, rx, ry, k) => { for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) { const d = (i * i) / (rx * rx) + (j * j) / (ry * ry); if (d > 1 || (i + j) & 1 || (d > 0.55 && (j & 1))) continue; q.px(x + i, y + j, d < 0.12 ? "H" : k) } }
  const steam = (q, f, x0, y0, len, n) => {
    for (let k = 0; k < n; k++) {
      const t = ((f / 12) + k / n) % 1, x = x0 + t * len, y = y0 - t * len * 0.18 + Math.sin(t * 5 + k) * 2, r = 3 + R(t * 6)
      if (t < 0.85) puff(q, R(x), R(y), r, R(r * 0.7), t > 0.55 ? "g" : "h")
    }
  }
  part("steam", FIRE.x - 8, FIRE.y - 40, 76, 48, "over", (q, f) => steam(q, f, FIRE.x, FIRE.y - 2, 56, 4))
  part("radio", RADIO.x + 7, RADIO.y + 1, 4, 3, "under", (q, f) => { for (let i = 0; i < 4; i++) { const hgt = 1 + fl(hs(i, f, 5) * 3); for (let j = 0; j < 3; j++) q.px(RADIO.x + 7 + i, RADIO.y + 3 - j, j < hgt ? (j === 2 ? "V" : "v") : "c") } })
  part("ad", ADR.X - 3, ADR.Y - 3, ADR.W + 6, ADR.H + 6, "under", (q, f) => drawAd(q, f), { frames: 36 })
  part("curtain", NX0 - 1, NY0, NX1 - NX0 + 4, 38, "under", (q, f) => drawNiche(q, f))
  part("lock", LOCK.x - 1, LOCK.y + 1, 3, 3, "under", (q, f) => { const on = f < 6; q.rect(LOCK.x - 1, LOCK.y + 1, 3, 3, "5"); q.px(LOCK.x, LOCK.y + 2, on ? "q" : "r"); if (on && f < 2) { q.px(LOCK.x - 1, LOCK.y + 2, "r"); q.px(LOCK.x + 1, LOCK.y + 2, "r") } })
  part("pillar", PX - PR + 3, PY - PR + 3, 2 * PR - 5, 2 * PR - 5, "under", (q, f) => { for (let a = 0; a < PILLAR_LEDS; a++) { const [x, y] = ledAt(a), d = (a - f + PILLAR_LEDS) % PILLAR_LEDS; q.px(x, y, d === 0 ? "V" : d === 1 ? "v" : d < 4 ? "C" : "c") } })
  part("ratz", RZS.x - 6, RZS.y - 4, 12, 7, "under", (q, f) => {
    // a scope's trace running over the little screen, the picture rolling
    for (let i = 0; i < 12; i++) for (let j = 0; j < 7; j++) q.px(RZS.x - 6 + i, RZS.y - 4 + j, (j + f) % 4 === 0 ? "C" : "c")
    for (let i = 0; i < 12; i++) q.px(RZS.x - 6 + i, RZS.y - 1 + R(Math.sin((i + f) * TAU / 12 * 2) * 2), "v")
  })
  // stuttering signs: a mask of which frames dim or go dark
  const stutter = (key, name, pattern, only) => {
    const s = SIGNS[key]; if (!s) return
    const [x, y, w, h] = s.rect
    part("sign_" + name, x, y, w, h, "under", (q, f) => {
      const st = pattern[f]
      if (st === 1) return
      if (!only) neon(q, s.x, s.y, key, s.hue, { font: s.font, state: st })
      else {                                                                // only some letters drop out (DRAIN MARKET's K)
        const w2 = TXT.measure(key, s.font), x0 = R(s.x - w2 / 2)
        const pre = TXT.measure(key.slice(0, only[0]), s.font) + (only[0] ? 1 : 0)
        TXT.draw(q, x0 + pre, s.y, key.slice(only[0], only[1]), NEON[s.hue][st > 0 ? 1 : 0], { font: s.font, outline: "1" })
      }
    })
  }
  SIGNS["MARKET"] = { rect: [233 - 22, 19, 45, 13], x: 233, y: 22, hue: "m", font: "nagiwa" }
  stutter("MARKET", "drain", [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1], [3, 4])
  stutter("TIDE MODS", "tide", [1, 1, 1, 0.5, 0, 1, 1, 1, 1, 1, 1, 1])
  stutter("KIDNEYS ONLY", "kidneys", [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0.5, 1], [8, 12])
  stutter("SLEEP 2C", "sleep", [1, 1, 0.5, 1, 1, 1, 1, 1, 1, 0.5, 0, 1])
  stutter("HOT WOK", "hotwok", [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1])
  // PACHINKO's frame of chasing bulbs; KARAOKE lights letter by letter
  {
    const [x, y, t] = ROOFSIGNS[4], w = TXT.measure(t, "nagiwa"), bx = x - 6, by = y - 6, bw = w + 12, bh = 19
    const perim = []; for (let i = 0; i < bw; i += 3) perim.push([bx + i, by]); for (let j = 3; j < bh; j += 3) perim.push([bx + bw - 1, by + j]); for (let i = bw - 1; i >= 0; i -= 3) perim.push([bx + i, by + bh - 1]); for (let j = bh - 3; j > 0; j -= 3) perim.push([bx, by + j])
    for (const [px, py] of perim) p.px(px, py, "M")
    part("sign_pachinko", bx, by, bw, bh, "under", (q, f) => perim.forEach(([px, py], i) => q.px(px, py, (i + f) % 3 === 0 ? "N" : "M")))
  }
  {
    const [x, y, t, hue] = ROOFSIGNS[5], w = TXT.measure(t, "nagiwa")
    part("sign_karaoke", x - 2, y - 2, w + 4, 11, "under", (q, f) => {
      const n = f < 4 ? 8 : f - 4
      if (n >= t.length) return
      q.rect(x - 2, y - 2, w + 4, 11, "1")
      TXT.draw(q, x, y, t.slice(0, n), NEON[hue][2], { font: "nagiwa", outline: NEON[hue][0] })
      TXT.draw(q, x + (n ? TXT.measure(t.slice(0, n), "nagiwa") + 1 : 0), y, t.slice(n), NEON[hue][0], { font: "nagiwa" })
    })
  }
  // the jars: the cyan in them breathing, a bubble rising
  const JAR = STALLS.find((s) => s.goods === "jars")
  const jarList = []; for (let gx = JAR.X + 5; gx < JAR.X + JAR.W - 4; gx += 7) jarList.push(gx)
  part("jars", JAR.X + 3, JAR.Y + JAR.H - 7, JAR.W - 6, 4, "under", (q, f) => jarList.forEach((gx, i) => {
    const t = (f + i * 5) % 12, y = JAR.Y + JAR.H - 5
    q.disc(gx, y, 1, t < 2 ? "v" : t < 5 ? "C" : "c"); q.px(gx, y, hs(gx, 1) > 0.5 ? "5" : "2"); q.px(gx - 1, y - 1, "V"); if (t === 7) q.px(gx + 1, y - 1, "v")
  }))
  const JAR_K = (x, y) => BASE[y * W + x]
  // the clinic's cold lamp over the chair, flickering
  const CLIN = STALLS.find((s) => s.goods === "clinic"), CL = { x: CLIN.X + R(CLIN.W * 0.42) - 2, y: CLIN.Y + 34 }
  p.disc(CL.x, CL.y, 3, "k"); p.disc(CL.x, CL.y, 2, "V"); p.px(CL.x, CL.y, "W")
  part("clinic", CL.x - 3, CL.y - 3, 7, 7, "under", (q, f) => { if (f === 4 || f === 6) { q.disc(CL.x, CL.y, 2, "C"); q.px(CL.x, CL.y, "v") } })
  // the noodle raft's coals glowing under the pot; its steam
  part("raft_noodle", NOODLE.x - 6, NOODLE.y - 6, 13, 13, "under", (q, f) => { for (let a = 0; a < 16; a++) { const an = a / 16 * TAU; q.px(NOODLE.x + R(Math.cos(an) * 5), NOODLE.y + R(Math.sin(an) * 5), hs(a, f, 7) > 0.5 ? "Q" : hs(a, f, 8) > 0.3 ? "P" : "O") } })
  part("raft_steam", NOODLE.x - 6, NOODLE.y - 30, 44, 34, "over", (q, f) => steam(q, (f + 6) % 12, NOODLE.x, NOODLE.y - 2, 32, 3))
  // the data raft's screens and the stalls' screens: rolling pictures
  const screen = (q, f, x, y, w, h, seed) => {
    q.rect(x - 1, y - 1, w + 2, h + 2, "k")
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const row = (j + f + seed) % 6; q.px(x + i, y + j, row === 0 ? "v" : (i + seed) % 5 === 0 && row < 3 ? "C" : "c") }
    q.px(x + (f + seed) % w, y + fl(h / 2), "V")
  }
  // the data raft whole, its screens rolling: a part of its own ("raft": the game lays it over the floor and can move it)
  {
    const r = RF[1], fx = r.X - 1, fy = r.Y - 3, fw = r.W + 4, fh = r.H + 4
    part("floss", fx, fy, fw, fh, "raft", (q, f) => {
      for (let y = fy; y < fy + fh; y++) for (let x = fx; x < fx + fw; x++) { const k = inB(x, y) ? FLOSS[y * W + x] : undefined; if (k) q.px(x, y, k) }
      SCREENS.forEach(([sx, sy]) => screen(q, f, sx, sy + 1, 12, 9, sx))
    })
  }
  const BOOT = STALLS.find((s) => s.sign?.[0] === "BOOTLEG"), RAM = STALLS.find((s) => s.sign?.[0] === "RAM SIM")
  const bootS = [BOOT.X + 6, BOOT.Y + 14], ramS = [RAM.X + 8, RAM.Y + 26]
  screen(p, 0, bootS[0], bootS[1], 14, 8, 3); screen(p, 0, ramS[0], ramS[1], 12, 8, 7); screen(p, 0, ramS[0] + 16, ramS[1], 12, 8, 2)
  part("bootleg", bootS[0] - 1, bootS[1] - 1, 16, 10, "under", (q, f) => screen(q, f, bootS[0], bootS[1], 14, 8, 3))
  part("ramsim", ramS[0] - 1, ramS[1] - 1, 30, 10, "under", (q, f) => { screen(q, f, ramS[0], ramS[1], 12, 8, 7); screen(q, f, ramS[0] + 16, ramS[1], 12, 8, 2) })
  // the tea lights on the tables
  for (const [x, y] of TEAL) { p.rect(x, y, 2, 2, "P"); p.px(x, y, "R") }
  {
    const xs = TEAL.map((t) => t[0]), ys = TEAL.map((t) => t[1]), x0 = Math.min(...xs) - 1, y0 = Math.min(...ys) - 1
    // one part each: they are far apart
    TEAL.forEach(([x, y], i) => part("tealight_" + (i + 1), x - 1, y - 1, 3, 3, "under", (q, f) => { const t = f === 0 ? 0.5 : hs(i, f, 11); q.rect(x, y, 2, 2, t > 0.7 ? "Q" : "P"); q.px(x, y, t > 0.25 ? "R" : "Q") }))
  }
  // the canal: strips where its lights are brightest, moving most in their middle
  for (const [cx, w] of [[96, 128], [380, 112], [604, 96], [780, 128], [1000, 112], [1196, 112]]) {
    let y0 = 1e9, y1 = -1e9
    for (let x = cx - w / 2; x < cx + w / 2; x++) { y0 = Math.min(y0, Yw(x) - S * CW - 1); y1 = Math.max(y1, Yw(x) + S * CW + 1) }
    part("canal_" + (PARTS.filter((q) => q.water).length + 1), cx - w / 2, fl(y0), w, Math.ceil(y1) - fl(y0), "under", null, { water: (x) => Math.max(0, Math.sin((x - (cx - w / 2)) / w * Math.PI)) })
  }
  // no two parts may overlap: each covers the background's own pixels
  for (let a = 0; a < PARTS.length; a++) for (let b = a + 1; b < PARTS.length; b++) {
    const A = PARTS[a], B = PARTS[b]
    if (A.layer === "under" && B.layer === "under" && !A.water && !B.water && A.x < B.x + B.w && A.x + A.w > B.x && A.y < B.y + B.h && A.y + A.h > B.y) console.log(`DM_WARN parts overlap: ${A.name} ${B.name}`)
  }

  // ---- the background with every under part's frame 0 painted in; the over layer
  const BG = BASE.slice()
  const bgPen = bufPen(BG)
  for (const P of PARTS) if (P.layer === "under" && P.draw) P.draw(bgPen, 0)
  const OVER = new Array(W * H), o = bufPen(OVER)
  // the stalls' roofs hang over the people (the user's wish, 2026-11-12: a figure seen from above is drawn from her middle, so at a
  // stall's edge half of her lay over its tarp): a closed stall whole, with its trim and lamp; an open one its tarp over the back and
  // the rolled-up hem, not the counter, which is lower than a head. Their pixels go into the over layer; a moving part on a roof gets
  // a twin in the over layer that draws only its roof pixels (the part itself stays under, for what of it lies on the floor)
  const ROOF = new Uint8Array(W * H)
  const roof = (x0, y0, x1, y1) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inB(x, y)) ROOF[y * W + x] = 1 }
  for (const s of STALLS) {
    const { X, Y, W: Wd, H: Hd } = s, south = s.face === "s", th = Hd >= 50 ? 20 : Hd >= 44 ? 16 : 11
    if (!s.open) roof(X - 1, Y - (south ? 1 : 2), X + Wd, Y + Hd + (south ? 1 : 0))
    else if (south) roof(X - 1, Y - 1, X + Wd, Y + th + 2)
    else roof(X - 1, Y + Hd - th - 3, X + Wd, Y + Hd)
  }
  for (const P of PARTS.slice()) {
    if (P.layer !== "under" || P.water) continue
    let on = false
    for (let j = 0; j < P.h && !on; j++) for (let i = 0; i < P.w; i++) if (inB(P.x + i, P.y + j) && ROOF[(P.y + j) * W + P.x + i]) { on = true; break }
    if (on) PARTS.push({ ...P, name: P.name + "_roof", layer: "over", roofOf: P })
  }
  const twin = (x, y) => PARTS.some((P) => P.roofOf && x >= P.x && y >= P.y && x < P.x + P.w && y < P.y + P.h)
  for (let i = 0; i < W * H; i++) if (ROOF[i] && BG[i] && !twin(i % W, fl(i / W))) OVER[i] = BG[i]
  // the Ring's last pillar at the right edge, over the canal and both banks (art/test/tunnel_blocks.px.js): its shadow falls out over the
  // water and the floor, dithered toward the market; the slab itself hangs over everyone, a lit concrete lip along its left edge with
  // pale warning stripes (not Juno's yellow), seams; where the canal goes in under it the dark of the tunnel, a cyan glint on the water
  {
    const TX = 1240, TY0 = 300, TY1 = 450, CY0 = 340, CY1 = 395
    for (let y = TY0; y < TY1; y++) for (let x = TX - 16; x < TX; x++) if ((x + y) % 2 === 0 && x > TX - 12 + ((y * 7) % 5) && inB(x, y)) { BG[y * W + x] = "e"; WM[y * W + x] = 0 }
    o.rect(TX, TY0, W - TX, TY1 - TY0, "2")
    o.rect(TX, TY0, 2, TY1 - TY0, "6"); o.rect(TX + 2, TY0, 1, TY1 - TY0, "4")
    for (let y = TY0 + 4; y < TY1; y += 10) o.rect(TX + 3, y, 2, 5, "!")
    for (let y = TY0; y < TY1; y += 37) o.hline(TX + 6, y, W - TX - 6, "1")
    o.rect(TX, CY0, W - TX, CY1 - CY0, "0"); o.rect(TX, CY0, 2, CY1 - CY0, "5"); o.hline(TX + 14, CY0 + 26, 6, "C"); o.hline(TX + 24, CY0 + 32, 4, "C")
    o.hline(TX, TY0 - 1, W - TX, "k"); o.hline(TX, TY1, W - TX, "k"); o.vline(TX - 1, TY0, TY1 - TY0, "k")
  }
  // the heavy cables from rim to rim, junction boxes on them; the taps from the pillar to the stalls
  for (const [x0, y0, x1, y1] of [[98, 0, 300, 720], [1244, 0, 1040, 720], [560, 0, 700, 140]]) {
    o.line(x0, y0, x1, y1, "k"); o.line(x0 + 1, y0, x1 + 1, y1, "1")
    for (const t of [0.22, 0.61]) { const bx = R(x0 + (x1 - x0) * t), by = R(y0 + (y1 - y0) * t); o.rect(bx - 4, by - 3, 9, 7, "k"); o.rect(bx - 3, by - 2, 7, 5, "3"); o.hline(bx - 3, by - 2, 7, "4"); o.px(bx + 2, by + 1, "v") }
  }
  for (const [tx, ty] of [[RZ.X + 120, RZ.Y + 8], [744, 220], [712, 284], [492, 204], [564, 372], [680, 372]]) {
    const an = Math.atan2(ty - PY, tx - PX), sx = PX + Math.cos(an) * (PR + 1), sy = PY + Math.sin(an) * (PR + 1)
    o.line(sx, sy, tx, ty, "k"); o.px(tx, ty, "2")
  }
  for (const [x0, y0, x1, y1, sp] of STRINGS) {
    o.line(x0, y0, x1, y1, "k")
    const n = fl(Math.hypot(x1 - x0, y1 - y0) / sp)
    for (let i = 1; i < n; i++) {
      const bx = R(x0 + (x1 - x0) * i / n), by = R(y0 + (y1 - y0) * i / n), hue = i % 5 === 2 ? "m" : i % 7 === 3 ? "c" : "w"
      o.rect(bx, by - 1, 2, 2, NEON[hue][1]); o.px(bx, by - 1, NEON[hue][3])
    }
  }
  for (const [x, y, r] of LANTERNS) {
    // a paper lantern from above: its ribs as rings, the cap on top, the light through the paper brightest in the middle
    o.disc(x, y, r, "O"); o.disc(x, y, r - 1, "P"); o.disc(x, y, r - 2, "Q"); o.disc(x - 1, y - 1, r - 4, "R")
    for (let a = 0; a < 8; a++) o.px(x + R(Math.cos(a * TAU / 8) * (r - 1)), y + R(Math.sin(a * TAU / 8) * (r - 1)), "O")   // the ribs
    o.px(x, y, "O"); o.px(x - 2, y - 2, "W")
  }

  // ---- what the game's code needs: the parts and the runtime lamps (the painted lamps, the dense small ones left out)
  const HEX = { w: "#eea040", m: "#ff4fd3", c: "#62def0", r: "#ff3a3a" }
  console.log("PARTS " + JSON.stringify({
    room: "drain_market", size: [W, H],
    parts: PARTS.map((P) => ({ name: P.name, at: [P.x, P.y], size: [P.w, P.h], frames: P.frames, fps: 10, layer: P.layer })),
    lamps: LIGHTS.filter((L) => L[5]).map(([x, y, hue, r]) => [x, y, HEX[hue], r]),
  }))
  // the colours that mean something stay where they mean it: red only at the padlock, Juno's yellow nowhere
  const bad = []
  for (const [buf, nm] of [[BG, "bg"], [OVER, "over"]]) for (let i = 0; i < W * H; i++) {
    const k = buf[i]; if (!k) continue
    if ("jyY".includes(k)) bad.push(`${nm} yellow at ${i % W},${fl(i / W)}`)
    if ((k === "r" || k === "q") && Math.hypot(i % W - LOCK.x, fl(i / W) - LOCK.y) > 18) bad.push(`${nm} red at ${i % W},${fl(i / W)}`)
  }
  if (bad.length) console.log("DM_WARN " + bad.length + " " + bad.slice(0, 5).join("; "))

  // ---- blitting buffers into pxl canvases
  const blit = (c, buf, x0, y0, w, h, maskFn) => {
    for (let j = 0; j < h; j++) {
      let run = 0, rk = null
      const flush = (i) => { if (rk) c.rect(i - run, j, run, 1, rk); run = 0; rk = null }
      for (let i = 0; i < w; i++) {
        const X = x0 + i, Y = y0 + j, k = inB(X, Y) && (!maskFn || maskFn(X, Y)) ? buf[Y * W + X] : undefined
        if (k !== rk) { flush(i); rk = k ?? null }
        if (rk) run++
      }
      flush(w)
    }
  }
  const offPen = (c, ox, oy, w, h) => mkPen((x, y, k) => { const X = x - ox, Y = y - oy; if (X >= 0 && Y >= 0 && X < w && Y < h) c.px(X, Y, k) }, (x, y) => (inB(x, y) ? BASE[y * W + x] : undefined))
  const renderPart = (c, P) => {
    if (P.water) {
      for (let j = 0; j < P.h; j++) for (let i = 0; i < P.w; i++) { const X = P.x + i, Y = P.y + j; if (inB(X, Y) && WM[Y * W + X]) c.px(i, j, water(X, Y, c.frame, P.water(X))) }
      return
    }
    if (P.roofOf) {
      // the frame drawn whole into a buffer of its own, then only its roof pixels
      const T = BASE.slice(0), tp = bufPen(T)
      P.draw(tp, c.frame)
      for (let j = 0; j < P.h; j++) for (let i = 0; i < P.w; i++) { const X = P.x + i, Y = P.y + j; if (inB(X, Y) && ROOF[Y * W + X] && T[Y * W + X]) c.px(i, j, T[Y * W + X]) }
      return
    }
    if (P.layer === "under") blit(c, BASE, P.x, P.y, P.w, P.h)
    P.draw(offPen(c, P.x, P.y, P.w, P.h), c.frame)
  }
  return { W, H, BG, OVER, PARTS, renderPart, blit }
})()

sprite("drain_market_bg", { w: DM.W, h: DM.H }, (c) => DM.blit(c, DM.BG, 0, 0, DM.W, DM.H))
sprite("drain_market_over", { w: DM.W, h: DM.H }, (c) => DM.blit(c, DM.OVER, 0, 0, DM.W, DM.H))
for (const P of DM.PARTS) anim(P.name, { w: P.w, h: P.h, frames: P.frames, fps: 10 }, (c) => DM.renderPart(c, P))
