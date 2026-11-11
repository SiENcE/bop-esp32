// Drain Market, draft F (one of several drafts for the user to compare): straight down from above, as in Dreamweb, but big.
// BLOCKS only (flat shapes, no texture), rough in the light, because the mood is what is judged.
//
//   drain_market_f   640x360, scrolls both ways (2x2 screens). About 20 px a meter: a person from above is 13x7 shoulders and a
//                    5x5 head, Juno's hood 7x7. The drained flood channel runs left to right in a slow S (yc). Its levels, high
//                    to low (higher is lighter, every drop throws a hard shadow to the lower right and catches a lip of light):
//                      rim 4.4 m     the Ninth's street level along the top and bottom: shack roofs, AC units, tanks, pipes, rooftop neon
//                      walls         the sloped channel walls as stepped concrete (4 steps), cut by stairs
//                      terraces 2.2  a ledge along each wall with stalls and shacks: north (the clinic, the jars, the preacher), south
//                                    (Sable's curtain at its east end, in the wall)
//                      bed 0         the market floor, wet; a deck at 0.8 m in the south-west with the wok stall and tables
//                      canal -0.8    the channel's last water, through the whole picture, with three footbridges and two rafts
//                      shaft -3      the stairs down (Chapter 2), from the bed under the south terrace, chained
//                    Over it all: the city's pillar, power cables, string lights.
//
// Light: lamps as a list (warm, magenta, cyan, one red) summed per pixel; the floor takes the strongest hue's ramp, dithered only
// at the edge of a light step (style guide §4: dither for light falloff only). Puddles are flat lighter patches; the canal is dark
// with the lights as broken streaks.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  b: "#6e4630", B: "#9a6a40",                                   // floor in strong warm light
  d: "#64265e", D: "#8e3486",                                   // floor in strong magenta light
  l: "#1f5e74", L: "#2c86a0",                                   // floor in strong cyan light
  0: "#05090f", 7: "#0a131f", 8: "#122034", 9: "#1c3150",       // the canal's water
  o: "#2e2019", p: "#4e3526", E: "#74513a", F: "#9c7048",       // wood: the deck's planks, crates, counters
  J: "#2e1220", K: "#4e1e2e", "%": "#73304a",                   // Sable's plum curtain
  "=": "#203c36", "+": "#30594b", "&": "#4a7c66",               // a faded green tarp
  "<": "#7a3e22",                                               // rust tarp's middle
  "(": "#5e1a52",                                               // the magenta stall tarp's middle
  "@": "#6a5c9c",                                               // violet tarp in light
  "?": "#d8c8a0", "!": "#8c7c60",                               // the preacher (his speech colour, style guide §8)
  "^": "#c4ccd0",                                               // the clinic's pale tiles
})

const DMF = (() => {
  const W = 640, H = 360
  const BAY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
  const dz = (x, y) => (BAY[y & 3][x & 3] + 0.5) / 16
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const hs = (a, b, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  const vn = (x, y, s) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
    const a = hs(xi, yi, s), b = hs(xi + 1, yi, s), c = hs(xi, yi + 1, s), e = hs(xi + 1, yi + 1, s)
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + e) * sx * sy
  }

  // ---- the channel: its axis, its canal, its bands (d = y - yc(x))
  const yc = (x) => 182 + 16 * Math.sin((x - 40) / 150) + (x - 320) * 0.03
  const yw = (x) => yc(x) + 14 * Math.sin(x / 85 + 0.6) - 10
  const CW = 11
  const NR = -134, NW = -122, NT = -82, NB = -70, SB = 62, ST = 74, SW = 108, SR = 120
  const nTer = (x) => yc(x) + (NW + NT) / 2, sTer = (x) => yc(x) + (ST + SW) / 2

  // ---- places (x ranges; y follows the channel)
  const ARR = [64, 92]                                              // the stairs up to the alley, cut through the north rim
  const STAIRS = [[212, 228, "n"], [404, 418, "n"], [586, 600, "n"], [246, 262, "s"], [516, 532, "s"]]
  const DECK = [28, 198, 203, 234]                                  // x0, x1, y0, y1: the food deck, 0.8 m over the bed
  const SHAFT = [452, 478]                                          // the stairs down, from the bed under the south terrace
  const NICHE = [562, 594]                                          // Sable's curtain in the south wall
  const BRIDGES = [140, 330, 538]
  const PIL = { x: 300, r: 13 }
  PIL.y = Math.round(yc(PIL.x) - 50)

  /** height (m) and kind of the ground at a pixel */
  const ground = (x, y) => {
    const d = y - yc(x)
    const inX = (r) => x >= r[0] && x <= r[1]
    // the stairs up to the alley: from the top edge (the alley's level, 6 m) down to the north terrace
    if (inX(ARR) && d < NW) { const t = y / (yc(x) + NW); return { h: 6 - 3.8 * Math.floor(t * 18) / 18, k: "stair" } }
    // the stairs down: from the bed south, under the south terrace (covered there)
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

  // ---- lights: [x, y, hue, radius, strength]; hues w(arm) m(agenta) c(yan) r(ed)
  const LIGHTS = []
  const lamp = (x, y, hue, r, s) => LIGHTS.push([Math.round(x), Math.round(y), hue, r, s])

  // ---- things, as data (positions in px), so the lights and the crowd's free floor come from them
  const OCC = []                                                    // rects nobody stands on
  const occ = (x, y, w, h) => OCC.push([x, y, x + w, y + h])

  // stalls: x, y (top left), w, h, tarp, open, face (where the counter is), goods, sign [text, hue], trim hue, lamp hue
  const STALLS = []
  const stall = (o) => { STALLS.push(o); occ(o.x - 1, o.y - 1, o.w + 2, o.h + 2) }
  // north terrace, fronts to the south
  const nst = (x, w, o) => { const y = Math.round(yc(x + w / 2) + NW + 2); stall({ x, y, w, h: 26, face: "s", ...o }) }
  nst(2, 54, { tarp: "g", open: true, goods: "junk", sign: ["RAM SIM", "c"], trim: "c", lamp: "c" })
  nst(156, 50, { tarp: "v", open: false, goods: "drives", sign: ["BUY SELL", "m"], trim: "m", lamp: "m" })
  nst(236, 60, { tarp: "m", open: true, goods: "mods", sign: ["TIDE MODS", "c"], trim: "c", lamp: "c" })
  nst(306, 90, { tarp: "s", open: false, goods: "", sign: ["PAWN", "w"], trim: "w", lamp: "w" })
  nst(424, 76, { tarp: "clinic", open: true, goods: "clinic", sign: ["KIDNEYS ONLY", "m"], trim: "m", lamp: "c" })
  nst(506, 74, { tarp: "r", open: true, goods: "jars", sign: ["USED CHROME", "c"], trim: "c", lamp: "c" })
  nst(606, 40, { tarp: "v", open: false, goods: "", sign: ["SOY", "w"], trim: "w", lamp: "w" })
  // the bed, north of the canal (fronts to the south) and south of it (fronts to the north)
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
  // south terrace, fronts to the north
  const sst = (x, w, o) => { const y = Math.round(yc(x + w / 2) + SW - 24); stall({ x, y, w, h: 22, face: "n", ...o }) }
  sst(4, 60, { tarp: "s", open: false, goods: "", sign: ["SOUP", "w"], trim: "w", lamp: "w" })
  sst(70, 52, { tarp: "m", open: true, goods: "drives", sign: ["FAKE ID", "m"], trim: "m", lamp: "m" })
  sst(128, 44, { tarp: "g2", open: false, goods: "", sign: null, trim: null, lamp: "w" })
  sst(176, 62, { tarp: "v", open: true, goods: "clothes", sign: ["SLICKERS", "w"], trim: "w", lamp: "w" })
  sst(274, 70, { tarp: "r", open: false, goods: "", sign: ["DUMPLING", "w"], trim: "w", lamp: "w" })
  sst(352, 56, { tarp: "g", open: true, goods: "junk", sign: ["REPAIR", "c"], trim: "c", lamp: "c" })
  sst(412, 34, { tarp: "s", open: false, goods: "", sign: null, trim: null, lamp: null })
  sst(486, 26, { tarp: "r", open: false, goods: "", sign: null, trim: null, lamp: "w" })

  // the story's things
  const RATZ = { x: 168, w: 70, h: 20 }; RATZ.y = Math.round(yc(RATZ.x + 35) + NB + 6)
  occ(RATZ.x - 1, RATZ.y - 1, RATZ.w + 2, RATZ.h + 2)
  const PREACH = { x: 124 }; PREACH.y = Math.round(nTer(124) - 3)
  occ(PREACH.x - 5, PREACH.y - 5, 11, 11)
  const WOK = { x: 34, y: DECK[2] + 3, w: 42, h: 26 }
  occ(WOK.x - 1, WOK.y - 1, WOK.w + 2, WOK.h + 2)
  const TABLES = []
  for (const [x, y] of [[96, 213], [122, 222], [148, 211], [176, 224], [92, 228], [172, 209]]) { TABLES.push([x, y]); occ(x - 7, y - 6, 15, 13) }
  const RAFTS = [{ x: 244, w: 34, kind: "noodle" }, { x: 586, w: 30, kind: "screens" }]
  for (const r of RAFTS) { r.y = Math.round(yw(r.x + r.w / 2) - 6); occ(r.x, r.y, r.w, 12) }
  occ(SHAFT[1] + 3, Math.round(yc(SHAFT[1]) + SB - 27), 36, 16)
  // the city's ad, projected on the bed's floor from the pillar: LULL, the sleeping face (the preacher's enemy, in plain sight)
  const AD = { x: 360, y: 0, w: 76, h: 26 }; AD.y = Math.round(yw(398) + CW + 6)
  occ(AD.x + 2, AD.y, AD.w - 4, AD.h - 2)
  occ(PIL.x - PIL.r - 1, PIL.y - PIL.r - 1, PIL.r * 2 + 3, PIL.r * 2 + 3)

  // lamps of the things
  for (const s of STALLS) {
    const fx = s.x + s.w / 2, fy = s.face === "s" ? s.y + s.h + 3 : s.y - 3
    if (s.lamp) lamp(fx, fy, s.lamp, s.lamp === "w" ? 30 : 26, s.lamp === "w" ? 0.55 : 0.5)
    if (s.trim) lamp(fx, fy, s.trim, Math.max(20, s.w * 0.6), 0.32)
    if (s.sign) lamp(fx, s.face === "s" ? s.y + s.h - 2 : s.y + 2, s.sign[1], 22, 0.3)
  }
  lamp(WOK.x + 14, WOK.y + 12, "w", 52, 0.95)                     // the wok's fire
  for (const [x, y] of TABLES) lamp(x, y, "w", 18, 0.45)
  lamp(RATZ.x + 35, RATZ.y + 26, "w", 30, 0.55); lamp(RATZ.x + 54, RATZ.y + 10, "c", 26, 0.55)
  lamp(PREACH.x, PREACH.y, "w", 22, 0.42)
  lamp(PIL.x, PIL.y, "c", 34, 0.42)
  lamp(AD.x + AD.w / 2, AD.y + AD.h / 2, "c", 44, 0.5)
  for (const r of RAFTS) lamp(r.x + r.w / 2, r.y + 6, r.kind === "noodle" ? "w" : "c", 34, 0.6)
  const NX = (NICHE[0] + NICHE[1]) / 2, NY = Math.round(yc(NX) + SW - 1)
  lamp(NX, NY - 6, "m", 46, 1.0)                                  // the magenta leaking from Sable's booth
  lamp(NICHE[0] - 10, NY - 12, "w", 20, 0.45)
  lamp(SHAFT[0] + 13, yc(SHAFT[0]) + SB - 28, "r", 9, 0.7)          // the chain's lock LED
  lamp((ARR[0] + ARR[1]) / 2, yc(78) + NW - 18, "m", 40, 0.55)       // DRAIN MARKET over the stairs from the alley
  for (const x of BRIDGES) lamp(x, yw(x) - 12, "w", 20, 0.4)
  // neon tubes along the canal's banks, so the water has something to mirror: [x0, x1, bank (-1 north, 1 south), hue]
  const CANAL_TUBES = [[0, 92, -1, "c"], [150, 236, 1, "m"], [282, 322, 1, "c"], [346, 444, -1, "m"], [470, 530, 1, "c"], [548, 640, -1, "m"]]
  for (const [x0, x1, side, hue] of CANAL_TUBES) for (let x = x0 + 4; x < x1; x += 10) lamp(x, yw(x) + side * (CW + 2), hue, 16, 0.34)

  // string lights overhead: [x0, y0, x1, y1, spacing]
  const STRINGS = [
    [0, 120, 200, 95, 9], [150, 104, 330, 150, 9], [260, 92, 420, 128, 10], [380, 112, 640, 96, 9], [430, 140, 640, 150, 11],
    [20, 196, 210, 196, 8], [20, 238, 200, 202, 8], [210, 250, 420, 230, 10], [420, 262, 640, 236, 9], [300, 196, 470, 290, 12],
  ]
  for (const [x0, y0, x1, y1, sp] of STRINGS) {
    const n = Math.floor(Math.hypot(x1 - x0, y1 - y0) / sp)
    for (let i = 1; i < n; i += 3) lamp(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, "w", 16, 0.22)
  }
  // paper lanterns, hanging (x, y, r)
  const LANTERNS = [[110, 200, 4], [140, 238, 4], [184, 200, 3], [60, 244, 3], [250, 136, 3], [396, 160, 3], [520, 128, 3], [450, 240, 3],
    [604, 270, 3], [540, 284, 4], [330, 262, 3], [200, 280, 3], [100, 120, 3], [20, 92, 3], [636, 128, 3]]
  for (const [x, y, r] of LANTERNS) lamp(x, y, "w", 26 + r * 3, 0.55)
  // rooftop neon on the rims, lying flat (x, y, text, hue)
  const ROOFSIGNS = [[12, 20, "HOTEL 9", "m"], [134, 30, "CHITS 4 GLASS", "c"], [262, 46, "NOODLE BAR", "w"], [372, 30, "GILLS -40%", "c"], [480, 22, "PACHINKO", "m"],
    [570, 34, "KARAOKE", "m"], [30, 336, "FLOOD DEBT? WE BUY IT", "c"], [240, 326, "LOVE HOTEL", "m"], [372, 344, "SUMP RUNNER", "w"], [470, 336, "SAKE", "w"]]
  for (const [x, y, t, hue] of ROOFSIGNS) lamp(x + t.length * 2, y + 3, hue, 26 + t.length, 0.42)

  // ---- light per pixel, per hue
  const HUES = "wmcr"
  const LI = HUES.split("").map(() => new Float32Array(W * H))
  for (const [lx, ly, hue, r, s] of LIGHTS) {
    const A = LI[HUES.indexOf(hue)]
    for (let y = Math.max(0, ly - r); y < Math.min(H, ly + r); y++) for (let x = Math.max(0, lx - r); x < Math.min(W, lx + r); x++) {
      const q = 1 - Math.hypot(x - lx, y - ly) / r
      if (q > 0) A[y * W + x] += s * q * q
    }
  }
  const lightAt = (x, y) => {
    x = clamp(Math.round(x), 0, W - 1); y = clamp(Math.round(y), 0, H - 1)
    let best = 0, hue = 0, sum = 0
    for (let i = 0; i < 4; i++) { const v = LI[i][y * W + x]; sum += v; if (v > best) { best = v; hue = i } }
    return { sum, hue: best > 0.06 && best > sum * 0.45 ? HUES[hue] : "n", best }
  }
  /** a ramp's key for a light level 0..1: flat steps, dithered only in a narrow band where one meets the next */
  const tone = (ramp, v, x, y) => {
    const s = clamp(v, 0, 0.999) * ramp.length, i = Math.floor(s), f = s - i
    return ramp[Math.min(ramp.length - 1, f > 0.8 && dz(x, y) < (f - 0.8) * 5 ? i + 1 : i)]
  }
  const RAMPS = {
    wet: { n: "efzZX", w: "eaAbB", m: "eiIdD", c: "etTlL", r: "errqq" },
    dry: { n: "k1234", w: "k1aAb", m: "k1iId", c: "k1tTl", r: "k1rrq" },
    wood: { n: "kooppE", w: "kopEFF", m: "kopIdd", c: "kopTll", r: "koprq" },
  }

  // ---- the height map, once
  const HG = new Float32Array(W * H), KD = new Array(W * H)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = ground(x, y); HG[y * W + x] = g.h; KD[y * W + x] = g.k }
  const hAt = (x, y) => HG[clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)]

  // ---- the floor: material by kind, light by the lamps, shadows under every drop, a lip of light on every edge
  const floor = (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, k = KD[i], h = HG[i], L = lightAt(x, y)
      let shadow = 0
      for (let s = 1; s <= 8; s++) if (hAt(x - s, y - s) - h > s * 0.26) { shadow = 1; break }
      const lip = h - hAt(x, y + 1) > 0.4 || h - hAt(x + 1, y + 1) > 0.4
      if (k === "canal") {
        const edge = Math.abs(y - yw(x)) > CW - 1.5
        const dash = (y & 1) === 0 && ((x + Math.floor(hs(y, 7) * 40)) % 14) < 3 + L.best * 12
        const rip = Math.sin(x * 0.21 + Math.sin(y * 0.8) * 2.2 + y * 1.3)
        let key = shadow ? "0" : rip > 0.93 ? "8" : rip > 0.6 ? "7" : "0"
        if (edge && !shadow) key = "7"
        if (L.hue !== "n" && dash && L.best > 0.1) {
          const br = { w: ["O", "P", "Q", "R"], m: ["n", "M", "m", "N"], c: ["c", "C", "v", "V"], r: ["r", "r", "q", "q"] }[L.hue]
          key = br[clamp(Math.floor(L.best * 4), 0, 3)]
        } else if (L.sum > 0.12 && rip > 0.75) key = "9"
        c.px(x, y, key); continue
      }
      if (k === "tunnel") { c.px(x, y, (y & 1) && x % 5 === 0 ? "1" : "k"); continue }
      let mat = "wet", base = 0.27
      if (k === "rim") { mat = "dry"; base = 0.42 }
      else if (k === "wall") { mat = "dry"; base = 0.2 + h * 0.06 }
      else if (k === "terr" || k === "niche") base = 0.36
      else if (k === "deck") { mat = "wood"; base = 0.36 + ((y - DECK[2]) % 4 === 0 ? -0.12 : 0) }
      else if (k === "stair") { mat = "dry"; base = 0.24 + h * 0.07 }
      else if (k === "shaft") { mat = "dry"; base = clamp(0.44 + h * 0.13, 0, 1) }
      const puddle = (k === "bed" || k === "terr") && vn(x / 22, y / 13, 5) > 0.66
      let v = base + L.sum * (puddle ? 1.15 : 0.75) + (puddle ? 0.08 : 0)
      if (shadow) v -= 0.3
      if (lip && !shadow) v += 0.26
      if ((k === "stair" || k === "shaft") && hAt(x, y + 1) < h - 0.05) v -= 0.14     // a riser's dark line
      const ramp = RAMPS[mat][L.hue]
      c.px(x, y, tone(ramp, v, x, y))
    }
  }

  // ---- small drawing helpers
  const disc = (c, x, y, r, k) => c.ellipse(Math.round(x), Math.round(y), r, r, k)
  const line = (c, x0, y0, x1, y1, k, every = 1) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))
    for (let i = 0; i <= n; i++) if (i % every === 0) c.px(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), k)
  }
  const text = (c, x, y, s, k, align = "left") => TXT.draw(c, x, y, s, k, { font: "hud", align })
  const NEON = { m: ["n", "M", "m", "N"], c: ["c", "C", "v", "V"], w: ["O", "P", "Q", "R"], r: ["r", "r", "q", "q"] }
  /** a neon sign lying flat: a dark board, the tube letters, a bright core row */
  const sign = (c, x, y, s, hue, align = "left") => {
    const w = TXT.measure(s, "hud"), x0 = align === "center" ? Math.round(x - w / 2) : x
    c.rect(x0 - 2, y - 2, w + 4, 9, "k"); c.rect(x0 - 1, y - 1, w + 2, 7, NEON[hue][0])
    text(c, x0, y, s, NEON[hue][2])
  }
  const lantern = (c, x, y, r) => {
    disc(c, x + 1, y + 1, r, "k"); disc(c, x, y, r, "P"); disc(c, x, y, r - 1, "Q"); if (r > 3) disc(c, x, y, r - 2, "R")
    c.px(x - 1, y - 1, "W"); c.px(x, y - r, "k")
  }
  /** a person from above: the shoulders a rounded block across the way they face, the head over them, a lit pixel on the hair */
  const COATS = ["2", "3", "u", "n", "O", "=", "<", "1", "p", "4", "K", "2", "u", "<"]
  const HAIR = ["k", "1", "o", "p", "s", "h", "E", "k", "1", "o"]
  const HILITE = { k: "3", 1: "4", o: "E", p: "F", s: "S", h: "H", E: "F" }
  const SHADE = { 2: "1", 3: "2", u: "1", n: "k", O: "o", "=": "1", "<": "O", 1: "k", p: "o", 4: "3", K: "J" }
  const LIT = { 2: "3", 3: "4", u: "U", n: "M", O: "P", "=": "+", "<": "P", 1: "2", p: "E", 4: "5", K: "%" }
  const person = (c, x, y, seed) => {
    const coat = COATS[Math.floor(hs(seed, 1) * COATS.length)], hair = HAIR[Math.floor(hs(seed, 2) * HAIR.length)]
    const across = hs(seed, 3) < 0.6, w = across ? 11 : 5, h = across ? 5 : 11, x0 = x - (w >> 1), y0 = y - (h >> 1)
    const block = (bx, by, k) => { c.rect(bx + 1, by, w - 2, h, k); c.rect(bx, by + 1, w, h - 2, k) }      // corners cut
    block(x0 + 1, y0 + 1, "k"); block(x0, y0, coat)
    if (across) { c.hline(x0 + 1, y0, w - 2, LIT[coat]); c.hline(x0 + 1, y0 + h - 1, w - 2, SHADE[coat]) }
    else { c.vline(x0, y0 + 1, h - 2, LIT[coat]); c.vline(x0 + w - 1, y0 + 1, h - 2, SHADE[coat]) }
    if (hs(seed, 4) < 0.07) { disc(c, x, y, 3, "h"); c.px(x - 1, y - 2, "H"); c.px(x - 2, y - 1, "H") }             // a pale cap
    else { disc(c, x, y, 2, hair); c.px(x - 1, y - 1, HILITE[hair]) }
  }
  /** an umbrella from above, an LED rim (cyan: tech) */
  const umbrella = (c, x, y) => {
    c.ellipse(x + 1, y + 1, 9, 9, "k"); c.ellipse(x, y, 9, 9, "c"); c.ellipse(x, y, 8, 8, "1")
    for (let a = 0; a < 8; a++) line(c, x, y, x + Math.round(Math.cos(a * Math.PI / 4) * 8), y + Math.round(Math.sin(a * Math.PI / 4) * 8), "2")
    for (let a = 0; a < 16; a++) if (a % 2 === 0) c.px(x + Math.round(Math.cos(a * Math.PI / 8) * 9), y + Math.round(Math.sin(a * Math.PI / 8) * 9), "v")
    c.px(x, y, "4")
  }

  // ---- the rims: shack roofs, AC units, tanks, pipes, the railing along the edge
  const roofs = (c, north) => {
    let x = north ? -6 : -10
    while (x < W) {
      const w = 26 + Math.floor(hs(x, north ? 1 : 2) * 34), gap = 3 + Math.floor(hs(x, 3) * 7)
      const mid = x + w / 2, edge = Math.round(yc(mid) + (north ? NR : SR))
      if (north && x + w > ARR[0] - 6 && x < ARR[1] + 6) { x = ARR[1] + 7; continue }
      const y0 = north ? -2 : edge + 7, y1 = north ? edge - 7 : H + 2
      const kind = Math.floor(hs(x, 4) * 4)
      c.rect(x + 2, y0 + 2, w, y1 - y0, "k")
      if (kind === 0) for (let i = 0; i < w; i++) c.rect(x + i, y0, 1, y1 - y0, "223"[i % 3])            // corrugated
      else if (kind === 1) { c.rect(x, y0, w, y1 - y0, "1"); c.rect(x + 1, y0 + 1, w - 2, y1 - y0 - 2, "k") } // tar
      else if (kind === 2) { c.rect(x, y0, w, y1 - y0, hs(x, 5) < 0.5 ? "u" : "="); for (let i = 3; i < w; i += 9) c.rect(x + i, y0, 1, y1 - y0, hs(x, 5) < 0.5 ? "U" : "+") }
      else { c.rect(x, y0, w, y1 - y0, "2"); c.rect(x, north ? y1 - 2 : y0, w, 2, "3") }
      // the eave over the market, the lit side
      c.rect(x, north ? y1 - 1 : y0, w, 1, "4")
      // AC units, tanks, a dish
      const n = 1 + Math.floor(hs(x, 6) * 3)
      for (let j = 0; j < n; j++) {
        const ax = x + 3 + Math.floor(hs(x, 10 + j) * (w - 12)), ay = y0 + 4 + Math.floor(hs(x, 20 + j) * Math.max(1, y1 - y0 - 14))
        if (ay < 0 || ay > H) continue
        const t = hs(x, 30 + j)
        if (t < 0.55) { c.rect(ax + 1, ay + 1, 8, 7, "k"); c.rect(ax, ay, 8, 7, "3"); c.ellipse(ax + 4, ay + 3, 2, 2, "1"); c.px(ax + 4, ay + 3, "4") }
        else if (t < 0.85) { disc(c, ax + 6, ay + 6, 6, "k"); disc(c, ax + 5, ay + 5, 6, "2"); disc(c, ax + 5, ay + 5, 4, "3"); c.px(ax + 3, ay + 3, "4") }
        else { disc(c, ax + 3, ay + 3, 3, "G"); c.px(ax + 3, ay + 3, "k") }
      }
      // a skylight lit from the room under it, a laundry line, tubs of greens
      const life = hs(x, 50)
      if (life < 0.3 && y1 - y0 > 24) { const sx = x + 6, sy = (north ? y1 - 22 : y0 + 10); c.rect(sx, sy, 10, 7, "k"); c.rect(sx + 1, sy + 1, 8, 5, "P"); c.rect(sx + 1, sy + 1, 4, 5, "Q"); c.vline(sx + 5, sy + 1, 5, "k") }
      else if (life < 0.55) { const ly = north ? y1 - 14 : y0 + 9; line(c, x + 2, ly, x + w - 3, ly + 2, "5"); for (let i = 4; i < w - 5; i += 4) c.rect(x + i, ly + 1 + Math.floor(i * 2 / w), 3, 3, ["u", "O", "h", "n", "=", "P"][Math.floor(hs(x + i, 51) * 6)]) }
      else if (life < 0.7) for (let i = 0; i < 3; i++) { const tx = x + 4 + i * 7, ty = north ? y1 - 12 : y0 + 5; c.rect(tx, ty, 6, 5, "p"); c.rect(tx + 1, ty + 1, 4, 3, i === 1 ? "+" : "&"); c.px(tx + 2, ty + 1, "+") }
      // a stain under the AC's drip, a lit window into the market (warm, a home)
      if (hs(x, 40) < 0.5) { const wx = x + 4 + Math.floor(hs(x, 41) * (w - 12)); c.rect(wx, north ? y1 - 1 : y0, 6, 1, "Q"); lamp(wx + 3, north ? y1 + 4 : y0 - 4, "w", 14, 0.35) }
      x += w + gap
    }
    // the pipe and the railing along the rim's edge
    for (let px = 0; px < W; px++) {
      if (north && px >= ARR[0] && px <= ARR[1]) continue
      if (!north && px >= NICHE[0] - 2 && px <= NICHE[1] + 2) continue
      const e = Math.round(yc(px) + (north ? NR : SR))
      c.px(px, north ? e - 4 : e + 4, "4"); c.px(px, north ? e - 3 : e + 3, "2")
      c.px(px, north ? e - 1 : e + 1, px % 6 === 0 ? "6" : "5")
    }
  }

  /** a stall from above: the tarp (whole, or cut open to show the counter and goods), its neon trim, its sign, its lamp */
  const TARPS = { v: ["u", "U", "@"], g: ["2", "3", "4"], g2: ["=", "+", "&"], r: ["O", "<", "P"], m: ["n", "(", "M"], s: ["2", "3", "5"], clinic: ["4", "^", "V"] }
  const goods = (c, kind, x, y, w, h) => {
    for (let gx = x; gx < x + w - 2; gx += 3) {
      const t = hs(gx, y, 9)
      if (kind === "junk" || kind === "drives" || kind === "cables") {
        const k = kind === "cables" ? ["k", "2", "C", "q"][Math.floor(t * 4)] : kind === "drives" ? ["2", "4", "5", "M", "k"][Math.floor(t * 5)] : ["3", "4", "5", "c", "2", "6"][Math.floor(t * 6)]
        c.rect(gx, y + Math.floor(t * 2), 2, h - 1, k); if (t > 0.7) c.px(gx, y, kind === "cables" ? "v" : "v")
      } else if (kind === "fruit") { disc(c, gx + 1, y + 2, 1, ["P", "Q", "s", "O"][Math.floor(t * 4)]) }
      else if (kind === "fish") { c.rect(gx, y, 2, h, t > 0.5 ? "h" : "H"); c.px(gx, y, "k") }
      else if (kind === "clothes") { c.rect(gx, y, 2, h, ["u", "n", "3", "O", "U"][Math.floor(t * 5)]) }
      else if (kind === "mods") { c.rect(gx, y, 2, h, t > 0.6 ? "C" : "3"); if (t > 0.6) c.px(gx, y + 1, "v") }
    }
  }
  const drawStall = (c, s) => {
    const [dk, md, lt] = TARPS[s.tarp], south = s.face === "s"
    const front = south ? s.y + s.h - 6 : s.y, back = south ? s.y : s.y + 6
    c.rect(s.x + 2, s.y + 2, s.w, s.h, "k")
    if (s.open) {
      // under the tarp: the stall's dark floor, the counter along the front, the goods on it, a stool, a seller
      c.rect(s.x, s.y, s.w, s.h, "e")
      const cy = south ? s.y + s.h - 6 : s.y + 1
      c.rect(s.x, cy, s.w, 5, s.goods === "clinic" ? "^" : "p"); c.rect(s.x, south ? cy + 4 : cy, s.w, 1, s.goods === "clinic" ? "h" : "E")
      if (s.goods === "jars") {
        for (let gx = s.x + 3; gx < s.x + s.w - 3; gx += 5) for (let r = 0; r < 2; r++) {
          const jy = (south ? s.y + 12 : s.y + 8) + r * 5
          disc(c, gx + 1, jy + 1, 2, "k"); disc(c, gx, jy, 2, "c"); c.px(gx, jy, hs(gx, r) > 0.4 ? "v" : "V"); c.px(gx - 1, jy - 1, "C")
        }
        goods(c, "mods", s.x + 2, cy + 1, s.w - 4, 3)
      } else if (s.goods === "clinic") {
        // a reclining chair under a cold lamp, a tray, a cooler box stencilled with a cross of tape
        const chx = s.x + Math.round(s.w * 0.45), chy = south ? s.y + 12 : s.y + 8
        c.rect(chx - 13, chy, 26, 7, "k"); c.rect(chx - 12, chy + 1, 24, 5, "4"); c.rect(chx - 12, chy + 1, 7, 5, "5"); c.rect(chx + 6, chy + 2, 6, 3, "6")
        disc(c, chx - 2, chy - 2, 2, "V"); c.rect(s.x + 3, chy, 8, 6, "^"); c.rect(s.x + 6, chy + 1, 2, 4, "h"); c.rect(s.x + 5, chy + 2, 4, 1, "h")
        c.rect(s.x + s.w - 12, chy + 1, 9, 4, "6"); c.px(s.x + s.w - 10, chy + 2, "q")
      } else goods(c, s.goods, s.x + 2, cy + 1, s.w - 4, 3)
      // the seller behind the counter
      if (s.goods !== "clinic" && s.goods !== "jars") person(c, s.x + Math.round(s.w * 0.7), south ? s.y + s.h - 11 : s.y + 10, s.x * 7 + 3)
      else person(c, s.x + s.w - 8, south ? s.y + 14 : s.y + 10, s.x * 7 + 3)
      // the tarp's remaining back half, its cut edge ragged
      const th = Math.round(s.h * 0.38)
      for (let i = 0; i < s.w; i++) {
        const rag = Math.floor(hs(s.x + i, 1, 4) * 3)
        if (south) { c.rect(s.x + i, s.y, 1, th - rag, md); c.px(s.x + i, s.y + th - rag - 1, lt) }
        else { c.rect(s.x + i, s.y + s.h - th + rag, 1, th - rag, md); c.px(s.x + i, s.y + s.h - th + rag, lt) }
      }
      // the poles at the front corners
      for (const px of [s.x, s.x + s.w - 2]) c.rect(px, south ? s.y + s.h - 2 : s.y, 2, 2, "5")
    } else {
      // the whole tarp: a ridge along its length, the back half darker, the front half catching the market's light, seams
      const mid = s.y + Math.floor(s.h / 2)
      c.rect(s.x, s.y, s.w, s.h, md)
      c.rect(s.x, south ? s.y : mid, s.w, Math.ceil(s.h / 2), dk)
      c.rect(s.x, mid, s.w, 1, lt)
      for (let i = 8; i < s.w - 2; i += 11) c.rect(s.x + i, s.y, 1, s.h, dk)
      // a sag holding rainwater
      if (s.w > 40) { c.ellipse(s.x + Math.round(s.w * 0.3), south ? mid + 4 : mid - 4, 4, 2, "9"); c.px(s.x + Math.round(s.w * 0.3) - 1, south ? mid + 3 : mid - 5, "X") }
    }
    if (s.trim) { const ty = south ? s.y + s.h - 1 : s.y; for (let i = 0; i < s.w; i++) if (hs(s.x + i, 2) > 0.08) c.px(s.x + i, ty, NEON[s.trim][2]) }
    if (s.sign) sign(c, s.x + Math.round(s.w / 2), s.open ? (south ? s.y + 2 : s.y + s.h - 7) : (south ? s.y + s.h - 13 : s.y + 6), s.sign[0], s.sign[1], "center")
    if (s.lamp) { const lx = s.x + Math.round(s.w / 2), ly = south ? s.y + s.h + 1 : s.y - 2; disc(c, lx, ly, 1, NEON[s.lamp][3]); c.px(lx, ly, "W") }
  }

  // ---- the story's things
  const drawArrival = (c) => {
    // the alley's sign over the stairs' head: DRAIN MARKET in magenta, lying along the rim; an arrow chalked on a step, up: the way out
    sign(c, ARR[1] + 6, 6, "DRAIN", "m"); sign(c, ARR[1] + 6, 15, "MARKET", "m")
    const ax = 78, ay = 4
    for (let i = 0; i < 4; i++) { c.px(ax - i, ay + i, "W"); c.px(ax + i, ay + i, "W") }
    c.vline(ax, ay + 1, 7, "W")
  }
  const drawPreacher = (c) => {
    const { x, y } = PREACH
    // the ring of chalk round his crate that nobody steps into, the words chalked into it
    for (let a = 0; a < 56; a++) if (a % 3) c.px(x + Math.round(Math.cos(a * Math.PI / 28) * 21), y + Math.round(Math.sin(a * Math.PI / 28) * 13), "6")
    text(c, x - 19, y + 6, "STAY AWAKE", "5")
    // the crate
    c.rect(x - 6, y - 6, 14, 12, "k"); c.rect(x - 7, y - 7, 14, 12, "p"); c.rect(x - 7, y - 7, 14, 1, "E"); c.vline(x - 1, y - 7, 12, "o"); c.rect(x - 7, y + 4, 14, 1, "o")
    // the preacher: the long coat (coffee with too much milk), one arm out with a placard held up to nobody, the bald head
    c.rect(x - 5, y - 3, 11, 5, "k"); c.rect(x - 6, y - 4, 11, 5, "?"); c.hline(x - 5, y, 9, "!")
    c.rect(x + 4, y - 4, 7, 2, "?"); c.hline(x + 4, y - 3, 7, "!"); c.px(x + 10, y - 4, "S")
    c.rect(x + 9, y - 13, 20, 9, "k"); c.rect(x + 8, y - 14, 20, 9, "h"); c.rect(x + 9, y - 13, 18, 7, "H")
    text(c, x + 11, y - 12, "WAKE", "k"); c.vline(x + 10, y - 5, 2, "p")
    disc(c, x - 1, y - 2, 2, "s"); c.px(x - 2, y - 3, "S"); c.px(x - 3, y - 2, "Y"); c.px(x + 1, y - 2, "Y")          // the gecko eyes either side
  }
  const drawRatz = (c) => {
    const { x, y, w, h } = RATZ
    // an L of counters heaped with junk under a torn tarp; the screens lit; Ratz on the counter with his collar
    c.rect(x + 2, y + 2, w, h, "k"); c.rect(x, y, w, h, "e")
    c.rect(x, y + h - 7, w, 7, "4"); c.rect(x, y + h - 7, w, 1, "5")
    c.rect(x + w - 8, y, 8, h, "4")
    goods(c, "junk", x + 2, y + h - 6, w - 12, 5)
    for (const [sx, sy] of [[x + w - 7, y + 2], [x + w - 7, y + 8]]) { c.rect(sx, sy, 6, 5, "k"); c.rect(sx + 1, sy + 1, 4, 3, "C"); c.px(sx + 2, sy + 2, "V") }
    c.ellipse(x + 14, y + 6, 5, 3, "2"); c.ellipse(x + 14, y + 6, 3, 1, "k")                           // a coil of cable
    c.rect(x + 26, y + 3, 9, 5, "5"); c.rect(x + 27, y + 4, 7, 3, "3")                                  // a gutted deck
    for (let i = 0; i < w; i++) { const rag = Math.floor(hs(x + i, 9) * 3); c.rect(x + i, y, 1, 3 - rag, i % 11 < 6 ? "=" : "+") }
    // Ratz: a rat as big as a small dog, from above, on the counter's front: the grey back, the head to the left with its pink
    // nose, the ears, the headphones' band, the patched speech collar's cyan, the tail hanging over the edge
    const rx = x + 42, ry = y + h - 4
    c.ellipse(rx + 1, ry + 1, 7, 3, "k"); c.ellipse(rx, ry, 7, 3, "G"); c.ellipse(rx + 1, ry, 5, 2, "g"); c.hline(rx - 3, ry - 3, 7, "H")
    c.rect(rx - 12, ry - 2, 5, 5, "k"); c.rect(rx - 11, ry - 2, 4, 4, "G"); c.px(rx - 12, ry, "S"); c.px(rx - 13, ry, "S")
    c.px(rx - 8, ry - 3, "S"); c.px(rx - 8, ry + 2, "S"); c.px(rx - 9, ry - 3, "k"); c.px(rx - 9, ry + 2, "k")
    c.vline(rx - 9, ry - 2, 4, "4"); c.px(rx - 9, ry - 3, "C"); c.px(rx - 9, ry + 2, "C")
    c.vline(rx - 7, ry - 2, 4, "v"); c.px(rx - 7, ry, "V")
    line(c, rx + 7, ry, rx + 11, ry + 3, "S"); line(c, rx + 11, ry + 3, rx + 10, ry + 8, "S")
    sign(c, x + 20, y + 3, "RATZ", "w", "center")
  }
  const drawWok = (c) => {
    const { x, y, w, h } = WOK
    // the counter round the fire, the wok on its flame, the cook, bowls, a gas bottle
    c.rect(x + 2, y + 2, w, h, "k"); c.rect(x, y, w, h, "4"); c.rect(x + 2, y + 2, w - 4, h - 4, "3")
    disc(c, x + 14, y + 12, 7, "k"); disc(c, x + 14, y + 12, 6, "P"); disc(c, x + 14, y + 12, 4, "Q"); disc(c, x + 14, y + 12, 2, "R"); c.px(x + 14, y + 12, "W")
    disc(c, x + 14, y + 12, 3, "1"); c.ellipse(x + 14, y + 12, 3, 3, "R", true); c.px(x + 13, y + 11, "4")    // the wok over the flame, its rim lit
    line(c, x + 17, y + 12, x + 24, y + 12, "2")
    disc(c, x + 32, y + 9, 3, "2"); disc(c, x + 32, y + 9, 2, "P"); c.px(x + 32, y + 9, "Q")                  // a second burner, low
    for (let i = 0; i < 5; i++) { disc(c, x + 6 + i * 7, y + h - 4, 1, "H"); c.px(x + 6 + i * 7, y + h - 4, "Q") }
    c.rect(x + w - 6, y + 14, 4, 6, "C"); c.rect(x + w - 5, y + 15, 2, 4, "c")
    person(c, x + 16, y - 4, 777)
    sign(c, x + w / 2, y + h + 3, "WOK 24H", "w", "center")
  }
  const drawSteam = (c) => {
    // soft shapes over the wok and the raft, every other pixel at the edge so what is under them shows
    const puff = (x, y, rx, ry) => {
      for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) {
        const q = (i * i) / (rx * rx) + (j * j) / (ry * ry)
        if (q > 1) continue
        if (q > 0.45 && (i + j) & 1) continue
        c.px(x + i, y + j, q < 0.2 ? "H" : "h")
      }
    }
    const w = WOK
    puff(w.x + 18, w.y + 2, 8, 5); puff(w.x + 28, w.y - 6, 10, 6); puff(w.x + 40, w.y - 13, 9, 5); puff(w.x + 50, w.y - 18, 6, 3)
    const r = RAFTS[0]; puff(r.x + 10, r.y - 2, 5, 3); puff(r.x + 16, r.y - 8, 6, 3)
  }
  const drawTables = (c) => {
    for (const [x, y] of TABLES) {
      for (let a = 0; a < 4; a++) { const sx = x + Math.round(Math.cos(a * Math.PI / 2 + 0.6) * 7), sy = y + Math.round(Math.sin(a * Math.PI / 2 + 0.6) * 5); disc(c, sx, sy, 1, "+") }
      disc(c, x + 1, y + 1, 4, "k"); disc(c, x, y, 4, "H"); disc(c, x, y, 3, "h")
      c.px(x - 1, y, "Q"); c.px(x + 1, y + 1, "P"); disc(c, x + 1, y - 1, 1, "R")              // bowls and a tea light
    }
  }
  const drawBridges = (c) => {
    for (const bx of BRIDGES) {
      const top = Math.round(yw(bx) - CW - 3), bot = Math.round(yw(bx) + CW + 3)
      c.rect(bx - 6 + 2, top + 1, 12, bot - top, "k")
      for (let y = top; y < bot; y++) c.rect(bx - 6, y, 12, 1, (y - top) % 3 === 2 ? "o" : (y * 7 + bx) % 11 === 0 ? "E" : "p")
      for (let y = top; y < bot; y++) { c.px(bx - 7, y, y % 4 ? "1" : "6"); c.px(bx + 6, y, y % 4 ? "1" : "6") }
      lantern(c, bx + 8, top + 1, 2)
    }
  }
  const drawRafts = (c) => {
    for (const r of RAFTS) {
      const { x, y, w } = r
      c.ellipse(x + w / 2 + 1, y + 7, w / 2, 6, "k"); c.ellipse(x + w / 2, y + 6, w / 2, 6, "o"); c.ellipse(x + w / 2, y + 6, w / 2 - 2, 4, "p")
      for (let i = 4; i < w - 4; i += 3) c.vline(x + i, y + 2, 9, "o")
      line(c, x, y + 6, x - 8, y - 6, "6", 2)                                                      // the rope to the bank
      if (r.kind === "noodle") {
        disc(c, x + 10, y + 6, 3, "2"); disc(c, x + 10, y + 6, 2, "P"); c.px(x + 10, y + 6, "R")      // a pot on coals
        person(c, x + 22, y + 6, 919); lantern(c, x + 4, y + 2, 2)
        sign(c, x + w / 2, y + 14, "BOAT NOODLE", "w", "center")
      } else {
        for (const sx of [x + 6, x + 14]) { c.rect(sx, y + 2, 7, 6, "k"); c.rect(sx + 1, y + 3, 5, 4, "C"); c.px(sx + 2, y + 4, "V") }
        person(c, x + 24, y + 6, 313)
        sign(c, x + w / 2, y + 14, "DATA 1C/GB", "c", "center")
      }
    }
  }
  const drawPillar = (c) => {
    const { x, y, r } = PIL
    // the city's pillar going up past us: its foot flange, its round face, the maintenance ring, the stolen power taped to it
    const cables = [[RATZ.x + 60, RATZ.y + 4], [372, 110], [356, 142], [246, 102], [282, 186], [340, 186]]
    for (const [tx, ty] of cables) { line(c, x, y, tx, ty, "k"); line(c, x + 1, y, tx + 1, ty, "1") }
    disc(c, x + 3, y + 3, r + 2, "k"); disc(c, x, y, r + 2, "3"); disc(c, x, y, r, "2"); disc(c, x - 2, y - 2, r - 4, "3"); disc(c, x - 4, y - 4, r - 9, "4")
    for (let a = 0; a < 12; a++) c.px(x + Math.round(Math.cos(a * Math.PI / 6) * (r - 2)), y + Math.round(Math.sin(a * Math.PI / 6) * (r - 2)), a % 3 ? "C" : "v")
    sign(c, x, y - 3, "P-17", "c", "center")
    c.rect(x + 6, y + 6, 5, 4, "k"); c.rect(x + 6, y + 6, 4, 3, "4"); c.px(x + 7, y + 7, "v")       // a junction box, its LED
  }
  /** a flight of steps over columns x0..x1 between rows top(x)..bot(x): treads in a ramp (lighter where it is higher), a dark
   *  riser on each tread's low side, rails on both sides; down: "s" falls toward the bottom of the picture, "n" toward the top */
  const flight = (c, x0, x1, top, bot, down, ramp, step = 3, tint) => {
    for (let x = x0; x <= x1; x++) {
      const t0 = Math.round(top(x)), t1 = Math.round(bot(x)), n = Math.max(1, Math.ceil((t1 - t0) / step))
      for (let y = t0; y < t1; y++) {
        const i = Math.floor((y - t0) / step), r = (y - t0) % step, lvl = down === "s" ? i / n : 1 - i / n
        let k = ramp[clamp(Math.floor((1 - lvl) * ramp.length), 0, ramp.length - 1)]
        if (down === "s" ? r === step - 1 : r === 0) k = "k"
        else if (tint && (x + y) % 2 === 0 && Math.abs(x - (x0 + x1) / 2) < (x1 - x0) * tint) k = "I"
        c.px(x, y, k)
      }
      if (x === x0 || x === x1) for (let y = t0; y < t1; y++) { c.px(x, y, y % 6 === 0 ? "6" : "5"); c.px(x + (x === x0 ? -1 : 1), y, "k") }
    }
  }
  const drawStairs = (c) => {
    for (const [a, b, side] of STAIRS) {
      if (side === "n") flight(c, a, b, (x) => yc(x) + NT, (x) => yc(x) + NB + 1, "s", "65432")
      else flight(c, a, b, (x) => yc(x) + SB + 1, (x) => yc(x) + ST + 1, "n", "65432")
    }
    flight(c, ARR[0], ARR[1], () => 0, (x) => yc(x) + NW, "s", "654321", 3, 0.25)
  }
  const drawShaft = (c) => {
    // the stairs down: from the bed into the dark under the south terrace; the gate across their head, chained, the lock's red LED
    const x0 = SHAFT[0], x1 = SHAFT[1], gy = Math.round(yc((x0 + x1) / 2) + SB - 31)
    flight(c, x0, x1, (x) => yc(x) + SB - 30, (x) => yc(x) + SB + 1, "s", "43210kk", 3)
    c.rect(x0 - 1, Math.round(yc(x0) + SB) - 1, x1 - x0 + 3, 2, "4")                                  // the terrace's edge over the tunnel's mouth
    c.rect(x0 - 2, gy - 1, x1 - x0 + 5, 3, "k")
    for (let x = x0 - 1; x <= x1 + 1; x++) c.px(x, gy, Math.floor(x / 2) % 2 ? "h" : "1")              // the gate's bar, striped
    for (let x = x0 + 2; x < x1 - 2; x++) c.px(x, gy + 2 + ((x & 1) ? 1 : 0), "4")                    // the chain
    c.rect(x0 + 11, gy + 2, 4, 3, "4"); c.px(x0 + 13, gy + 3, "q")
    text(c, x1 + 5, gy + 6, "SUMP 9", "5"); text(c, x1 + 5, gy + 12, "NO ENTRY", "5")
  }
  const drawNiche = (c) => {
    // Sable's curtain: an opening in the south wall going in under the street (the street's edge a concrete lintel over it); the
    // heavy plum cloth hung across it in deep folds, the magenta leaking past its edges and under its hem
    const x0 = NICHE[0], x1 = NICHE[1], y0 = Math.round(yc((x0 + x1) / 2) + SW - 1), y1 = Math.round(yc((x0 + x1) / 2) + SR + 7)
    c.rect(x0 - 4, y0 - 1, x1 - x0 + 9, y1 - y0 + 3, "k")
    c.rect(x0 - 4, y0 - 1, 3, y1 - y0 + 1, "3"); c.rect(x1 + 2, y0 - 1, 3, y1 - y0 + 1, "3"); c.vline(x0 - 2, y0 - 1, y1 - y0 + 1, "4"); c.vline(x1 + 4, y0 - 1, y1 - y0 + 1, "2")
    c.rect(x0 - 5, y1 - 3, x1 - x0 + 11, 4, "4"); c.hline(x0 - 5, y1 - 3, x1 - x0 + 11, "5")             // the lintel: the street's edge
    for (let x = x0; x <= x1 + 1; x++) {
      const f = (x - x0) % 5, sag = Math.round(Math.sin((x - x0) / (x1 - x0) * Math.PI) * 2), bot = y0 + 11 + sag
      for (let y = y0; y < bot; y++) c.px(x, y, f === 0 ? "J" : f === 1 ? "%" : f === 4 ? "J" : "K")
      c.px(x, y0, f === 1 || f === 2 ? "%" : "K")
      c.px(x, bot, (x & 1) ? "m" : "M"); if ((x & 3) === 1) c.px(x, bot + 1, "M")                      // under its hem
    }
    for (let y = y0; y < y0 + 13; y++) { c.px(x1 + 1, y, (y & 1) ? "m" : "N"); c.px(x0 - 1, y, (y % 3) ? "M" : "m") }   // the gaps at its edges
    c.rect(x0 - 2, y0 - 2, x1 - x0 + 5, 1, "5")                                                        // the rail it hangs from
    lantern(c, x0 - 11, y0 - 6, 2); lantern(c, x1 + 12, y0 - 6, 2)
    // a mark only those who know read: a small magenta eye sprayed on the wall beside it
    const ex = x1 + 12, ey = y0 + 6
    c.hline(ex - 2, ey, 5, "M"); c.px(ex - 3, ey + 1, "M"); c.px(ex + 3, ey + 1, "M"); c.hline(ex - 2, ey + 2, 5, "M"); c.px(ex, ey + 1, "m")
  }
  const drawAd = (c) => {
    // the projection: cyan light on the wet concrete, its edge dithered (it is light), the letters and a face asleep, scan rows
    const { x, y, w, h } = AD
    for (let j = -2; j < h + 2; j++) for (let i = -2; i < w + 2; i++) {
      const px = x + i, py = y + j, k = KD[py * W + px]
      if (k !== "bed") continue
      const edge = i < 0 || j < 0 || i >= w || j >= h
      if (edge) { if (dz(px, py) < 0.35) c.px(px, py, "t"); continue }
      c.px(px, py, j % 3 === 2 ? "t" : "T")
    }
    const fx = x + 14, fy = y + 13
    c.ellipse(fx, fy, 8, 10, "C"); c.ellipse(fx, fy, 7, 9, "l"); c.hline(fx - 5, fy - 2, 3, "v"); c.hline(fx + 2, fy - 2, 3, "v"); c.hline(fx - 1, fy + 5, 3, "C")
    c.ellipse(fx + 8, fy, 1, 2, "V")                                                                   // the patch behind the ear
    TXT.draw(c, x + 28, y + 4, "LULL", "V", { font: "nagiwa" })
    text(c, x + 28, y + 14, "SLEEP BETTER", "v")
  }
  const drawStrings = (c) => {
    for (const [x0, y0, x1, y1, sp] of STRINGS) {
      line(c, x0, y0, x1, y1, "k", 1)
      const n = Math.floor(Math.hypot(x1 - x0, y1 - y0) / sp)
      for (let i = 1; i < n; i++) { const bx = Math.round(x0 + (x1 - x0) * i / n), by = Math.round(y0 + (y1 - y0) * i / n); c.px(bx, by, i % 5 === 2 ? "m" : i % 7 === 3 ? "v" : "R"); c.px(bx, by + 1, "k") }
    }
    // the heavy cables from rim to rim, over everything
    for (const [x0, y0, x1, y1] of [[22, 0, 150, 360], [622, 0, 520, 360]]) { line(c, x0, y0, x1, y1, "k"); line(c, x0 + 1, y0, x1 + 1, y1, "1") }
  }
  const drawTubes = (c) => {
    // neon tubes along the terraces' edges, broken here and there; hues by stretch
    const run = (x0, x1, d, hue) => { for (let x = x0; x < x1; x++) if (hs(x, 77) > 0.06) c.px(x, Math.round(yc(x) + d), NEON[hue][2]) }
    run(98, 150, NT - 1, "m"); run(300, 400, NT - 1, "c"); run(470, 580, NT - 1, "m")
    run(120, 240, ST + 1, "m"); run(400, 510, ST + 1, "c"); run(536, 556, ST + 1, "m")
    for (const [x0, x1] of [[0, 60], [270, 330], [380, 452]]) run(x0, x1, SB - 2, "w")
    for (const [x0, x1, side, hue] of CANAL_TUBES) for (let x = x0; x < x1; x++) if (hs(x, 78) > 0.07 && Math.abs(x - BRIDGES.reduce((a, b) => Math.abs(b - x) < Math.abs(a - x) ? b : a)) > 8) c.px(x, Math.round(yw(x) + side * (CW + 1)), NEON[hue][2])
  }
  const drawJuno = (c, x, y) => {
    // Juno from above, at the crowd's scale: the yellow slicker's shoulders, the hood up, the grey satchel at her hip
    c.ellipse(x + 1, y + 1, 6, 3, "k")
    c.ellipse(x, y, 6, 3, "y"); c.hline(x - 5, y + 2, 11, "j"); c.px(x - 5, y - 1, "Y")
    c.rect(x + 5, y + 1, 4, 4, "k"); c.rect(x + 5, y + 1, 3, 3, "g"); c.px(x + 6, y + 2, "v")
    line(c, x - 3, y - 2, x + 5, y + 1, "g")
    disc(c, x - 1, y - 1, 3, "k"); disc(c, x, y - 1, 3, "y"); disc(c, x, y - 1, 2, "Y"); c.px(x, y - 3, "y"); c.px(x + 2, y + 1, "j"); c.px(x - 1, y - 2, "W")
  }

  // ---- the crowd: dozens and dozens on the free floor, thinner on the way through, a ring left round the preacher
  const JUNO = { x: 206, y: Math.round(RATZ.y + RATZ.h + 8) }
  const ROUTE = [[78, 40], [78, Math.round(nTer(78))], [220, Math.round(nTer(220))], [220, Math.round(yc(220) + NB + 2)], [206, JUNO.y], [330, Math.round(yw(330))],
    [330, Math.round(yc(330) + SB - 6)], [524, Math.round(yc(524) + SB - 2)], [524, Math.round(sTer(524))], [578, Math.round(sTer(578))]]
  const nearRoute = (x, y) => {
    let best = 1e9
    for (let i = 0; i < ROUTE.length - 1; i++) {
      const [ax, ay] = ROUTE[i], [bx, by] = ROUTE[i + 1], dx = bx - ax, dy = by - ay, t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1)
      best = Math.min(best, Math.hypot(x - ax - dx * t, y - ay - dy * t))
    }
    return best
  }
  // o.keep: a rect [x0, y0, x1, y1] left free (a probe walks there); o.crowd(c, list): draws the people instead (list of [x, y, seed])
  const crowd = (c, o = {}) => {
    const placed = [[JUNO.x, JUNO.y]], list = []
    let n = 0
    for (let t = 0; t < 6000 && n < 230; t++) {
      const x = 4 + Math.floor(hs(t, 11) * (W - 8)), y = 4 + Math.floor(hs(t, 12) * (H - 8))
      const k = KD[y * W + x]
      if (!(k === "bed" || k === "terr" || k === "deck")) continue
      let ok = true
      for (let dy = -4; dy <= 4 && ok; dy += 4) for (let dx = -7; dx <= 7 && ok; dx += 7) { const kk = KD[clamp(y + dy, 0, H - 1) * W + clamp(x + dx, 0, W - 1)]; if (kk === "canal" || kk === "wall" || kk === "stair" || kk === "shaft") ok = false }
      for (const [x0, y0, x1, y1] of OCC) if (x > x0 - 7 && x < x1 + 7 && y > y0 - 4 && y < y1 + 4) { ok = false; break }
      if (!ok) continue
      if (Math.hypot(x - PREACH.x, y - PREACH.y) < 22) continue
      if (Math.hypot(x - (NICHE[0] + NICHE[1]) / 2, y - (yc(578) + SW)) < 18) continue
      if (nearRoute(x, y) < 9 && hs(t, 14) > 0.25) continue
      if (placed.some(([px, py]) => Math.abs(px - x) < 12 && Math.abs(py - y) < 8)) continue
      if (o.keep && x > o.keep[0] - 6 && x < o.keep[2] + 6 && y > o.keep[1] - 6 && y < o.keep[3] + 6) continue
      placed.push([x, y]); n++
      if (o.crowd) { list.push([x, y, t]); continue }
      if (hs(t, 15) < 0.022) umbrella(c, x, y)
      else person(c, x, y, t)
    }
    if (o.crowd) o.crowd(c, list)
    return n
  }

  // o.juno(c, x, y) draws Juno instead (false: none), o.crowd and o.keep as in crowd(): the probes of Juno from above use them
  const paint = (c, o = {}) => {
    floor(c)
    roofs(c, true); roofs(c, false)
    drawStairs(c); drawArrival(c)
    for (const s of STALLS) drawStall(c, s)
    drawTubes(c)
    drawShaft(c); drawNiche(c); drawAd(c)
    drawBridges(c); drawRafts(c)
    c.rect(DECK[0], DECK[3], DECK[1] - DECK[0] + 1, 1, "F")                                       // the deck's lit edge
    drawWok(c); drawTables(c)
    drawRatz(c); drawPreacher(c)
    crowd(c, o)
    if (o.juno !== false) (o.juno || drawJuno)(c, JUNO.x, JUNO.y)
    drawPillar(c)
    drawSteam(c)
    drawStrings(c)
    for (const [x, y, r] of LANTERNS) lantern(c, x, y, r)
    for (const [x, y, t, hue] of ROOFSIGNS) sign(c, x, y, t, hue)
  }
  // the clickable spots, for the report
  console.log("DMF_SPOTS " + JSON.stringify({
    alley: [78, 8], juno: [JUNO.x, JUNO.y], ratz: [RATZ.x + 40, RATZ.y + RATZ.h - 4], wok: [WOK.x + 14, WOK.y + 12], preacher: [PREACH.x, PREACH.y],
    kidneys: [462, Math.round(yc(462) + NW + 12)], jars: [543, Math.round(yc(543) + NW + 8)], curtain: [(NICHE[0] + NICHE[1]) / 2, Math.round(yc(578) + SW + 2)],
    down: [(SHAFT[0] + SHAFT[1]) / 2, Math.round(yc(465) + SB - 15)], bridges: BRIDGES,
  }))
  return { W, H, paint, JUNO, yc, nTer }
})()

scene("drain_market_f", { w: DMF.W, h: DMF.H, bg: "k" }, (c) => DMF.paint(c),
  glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 }))
