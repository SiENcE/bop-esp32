// Fischermann Street (the user's name for it; Weg_1 in the city plan, drawn by the user on 2026-11-18): from the gate at the end of Jade Row north, then west past the Wohnblock
// Lerche (the whole north side, its door where the arm turns) to the stairs down to the Old Fish Market. Seen straight down as the Drain
// Market is, at its size (about 40 px a metre, Juno 13 px across, art/characters/juno_top.px.js): a narrow old street, 4.25 m from
// facade to facade, its lane 2.25 m. Painted (2026-11-19, the user: full, neon, dirty, many different signs) on the lines of its
// approved BLOCKS (2026-11-18; the review sheets with their numbered labels: art/test/weg1_blocks.px.js): every place, every obstacle
// and the walk area are the blocks' (W1.OCC, game/places.js), nothing new stands where they had open floor.
//   weg1_bg   960x540, 3x3 screens: the roofs (Lerche's tar roof with its lift house, the stair hatch, NINTH LIVE lying flat for the
//             drones, the residents' garden; across the street KARAOKE and MAHJONG on theirs, TIDE MODS over the corner), the wet
//             street (sidewalk slabs, the kerbs and their gutters, the lane's old asphalt with the water running west to the fish
//             market's stairs, puddles mirroring the neon), Lull's ad projected on the road, the shops' light pools (REPAIR's cyan,
//             the noodle bar's amber, KARAOKE's violet, the shut shop dark, the 24-hour shop's cold white), the litter of each
//             (cups at the noodle bar, flyers round the sheep, cans by the machine), the cardboard and the flyers stay in the
//             picture; the arm's setts, the machine, the fish crates at the back door, the gate's roof at its foot
//   weg1_over 960x540, transparent but for what hangs over the people (game/rooms/weg1.js lays it as the room's foreground): the
//             cables across the street with their paper lanterns, the strings of bulbs, the awnings and the canopy, the blade signs,
//             the AC units on the facades
//   The people and the robot are sprites of their own, so they can come and go (the side thread "Wer passt auf den Laden auf?",
//   design §6.5, and the street's life, §7; still on their BLOCKS of 2026-11-18):
//   weg1_homeless  45x24, 6 frames: the homeless man asleep on his cardboard (the cardboard is the picture's), his cart of old screens:
//                  one shows static, and for a beat CAM 25's landing (its phosphor green, the door a bright dot)
//   weg1_sheep     30x30, 4 frames: Lull's sheep asleep on his feet, breathing, his head nodding
//   weg1_sheep2    30x30, 2 frames: another man in the costume, awake, the sheep's head under his arm, his own head bare, a flyer held out
//   weg1_robot     15x15, 4 frames: the cleaning robot, steel, its cyan light going round (not yellow: that is Juno's)
//   weg1_drone     21x21, 4 frames: a delivery drone from above, its four rotors a blur, an amber parcel under it, its light blinking
// Light (style guide §5, §7): the lamps summed per pixel per hue, the street's and the roofs' apart (a sign on a roof doesn't light the
// street 15 m below); a pixel takes the strongest hue's ramp in a few hard steps, dithered only at a pool's outer edge. The street's key
// is magenta with the noodle bar's amber; cyan only for tech (screens, the machine, Lull's projection, the shop's white light), violet
// for KARAOKE and MAHJONG's alley sign; red only for the keypad's locked LED; Juno's yellow nowhere.
// W1.walk(x, y) says where Juno can stand (game/places.js takes its shapes from W1's numbers, printed as WEG1_LAYOUT).
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  o: "#2e2019", p: "#4e3526", E: "#74513a",                      // wood, wet cardboard
  J: "#22382a", F: "#3e6a4a", K: "#b8f0a0",                      // the feed's phosphor green (CAM 25 on a screen in the cart)
  8: "#2c1450", 9: "#6a34c0", 0: "#a87cff", 7: "#e2d2ff",        // violet neon
  b: "#1e1834", B: "#30245a", "{": "#47307a", "}": "#6448a8",   // the floor in violet light
  d: "#64265e", D: "#8e3486",                                    // the floor in strong magenta light
  l: "#1f5e74", L: "#2c86a0",                                    // the floor in strong cyan light
  "<": "#6e4630", ">": "#9a6a40",                                // the floor in strong warm light
  "+": "#26453c", "&": "#3f6a58", "`": "#6a9a80",                // greens: the dumpster, plants
  "!": "#b89a6a", "%": "#7a6444",                                // cardboard, pale and wet
  ":": "#56646e",                                                // grime
})

const W1 = (() => {
  const W = 960, H = 540, R = Math.round, fl = Math.floor, bay = ISO.bay, ih = ISO.ihash
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const hs = (a, b, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  // the street: the north facade at y 120, the south one at y 290 (sidewalks 40 px, the road between); the arm south to the gate between
  // x 790 and 930; the stairs down to the fish market at the west end
  const NF = 120, SF = 290, AX0 = 790, AX1 = 930
  const inStreet = (x, y) => (x >= 60 && x < AX1 && y >= NF && y < SF) || (x >= AX0 && x < AX1 && y >= SF && y < 505)
  const inStairs = (x, y) => x < 60 && y >= NF + 20 && y < SF - 20
  const walk = (x, y) => (inStreet(x, y) || inStairs(x, y)) && !OCC.some(([x0, y0, x1, y1]) => x >= x0 && x < x1 && y >= y0 && y < y1)
  // what stands in the way (blocks from above)
  const OCC = [[300, 128, 340, 150], [600, 258, 650, 288], [505, 258, 548, 286], [800, 300, 822, 330], [884, 410, 926, 440]]
  const KN = NF + 36, KS = SF - 40                                     // the kerbs: north y 156..159, south 250..253

  // ---- zones: 1 north sidewalk, 2 road, 3 south sidewalk, 4 the arm's setts, 5 the stairs, 6 the gate; 10 + i the roofs
  const ROOFS = [
    { id: "lerche", x0: 60, y0: 0, x1: AX0, y1: NF, kind: "tar" },
    { id: "ne", x0: AX0, y0: 0, x1: W, y1: NF, kind: "slab" },
    { id: "nw", x0: 0, y0: 0, x1: 60, y1: NF + 20, kind: "sheet" },
    { id: "sw", x0: 0, y0: SF - 20, x1: 60, y1: H, kind: "slab" },
    { id: "s1", x0: 60, y0: SF, x1: 400, y1: H, kind: "tar" },
    { id: "s2", x0: 400, y0: SF, x1: AX0, y1: H, kind: "slab" },
    { id: "e", x0: AX1, y0: NF, x1: W, y1: H, kind: "sheet" },
  ]
  const ZN = new Uint8Array(W * H)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let z = 0
    if (inStairs(x, y)) z = 5
    else if (inStreet(x, y)) z = x >= AX0 && y >= KS + 4 ? 4 : y < KN + 4 ? 1 : y >= KS + 4 ? 3 : 2
    else if (x >= AX0 - 6 && x < AX1 + 6 && y >= 505) z = 6
    else { const i = ROOFS.findIndex((r) => x >= r.x0 && x < r.x1 && y >= r.y0 && y < r.y1); z = i < 0 ? 10 : 10 + i }
    ZN[y * W + x] = z
  }
  const zAt = (x, y) => (x >= 0 && y >= 0 && x < W && y < H ? ZN[y * W + x] : 0)

  // ======== the lamps: [x, y, hue, r, strength, level, half width, half height] (level s the street, r the roofs; a lamp with a size
  // is a lit front or a sign: the light falls off from its edge, so a shop throws a band along its front, not a disc) ========
  const LAMPS = []
  const lamp = (x, y, hue, r, s, level = "s", hw = 0, hh = 0) => LAMPS.push([R(x), R(y), hue, r, s, level, hw, hh])
  // the south side's shops, west to east, each its front
  lamp(106, 289, "c", 50, 0.6, "s", 38, 1)                                    // REPAIR: screens stacked in its window
  lamp(210, 289, "w", 54, 0.9, "s", 58, 1)                                    // the noodle bar
  lamp(162, 274, "m", 40, 0.85, "s", 2, 16)                                   // its blade sign
  lamp(346, 289, "p", 52, 0.9, "s", 54, 1)                                   // KARAOKE
  lamp(402, 279, "c", 40, 0.65, "s", 2, 11)                                   // its blade sign, KTV
  lamp(466, 282, "p", 14, 0.25, "s", 2, 6)                                    // the shut shop's one tube left
  lamp(720, 289, "c", 84, 1.3, "s", 56, 1)                                   // the 24-hour shop's cold white
  // the north side: Lerche's door, two light boxes on its facade, the projection, windows on the ground floor
  lamp(760, 132, "w", 50, 0.85, "s", 24, 2); lamp(729, 124, "c", 8, 0.4)
  lamp(446, 128, "c", 48, 0.75, "s", 2, 8); lamp(606, 128, "m", 50, 0.85, "s", 2, 8)
  lamp(492, 206, "c", 26, 0.35, "s", 46, 10)
  lamp(150, 121, "w", 20, 0.35, "s", 10, 1); lamp(380, 121, "w", 18, 0.3, "s", 8, 1); lamp(684, 121, "w", 18, 0.3, "s", 8, 1)
  // the arm: the machine, MAHJONG's blade sign, the back door's bulb, the bar sign on the east wall, the gate screen's spill
  lamp(823, 315, "c", 30, 0.85, "s", 1, 14); lamp(802, 422, "p", 36, 0.9, "s", 12, 2); lamp(924, 401, "w", 34, 0.7)
  lamp(921, 300, "m", 30, 0.75, "s", 9, 2); lamp(860, 505, "c", 22, 0.35, "s", 64, 1)
  // EEL & RICE, hung over the street on its own wire, pointing the way down to the fish market
  const EEL = { x: 128, y: 198, t: "EEL & RICE" }
  lamp(EEL.x + 30, EEL.y + 4, "w", 26, 0.5, "s", 34, 4)
  // the cables' paper lanterns and the strings of bulbs (over the street: their places are the over layer's)
  const CABLES = [[210, NF - 2, 240, SF + 2], [590, NF - 2, 620, SF + 2], [760, NF - 2, 786, SF + 2]]
  const LANTERNS = []
  for (const [x0, y0, x1, y1] of CABLES) for (const t of [0.22, 0.5, 0.78]) { const lx = R(x0 + (x1 - x0) * t), ly = R(y0 + (y1 - y0) * t); LANTERNS.push([lx, ly]); lamp(lx, ly, "w", 20, 0.32) }
  const STRINGS = [[300, NF - 1, 252, SF + 1, 11], [640, NF - 1, 700, SF + 1, 11], [AX0 - 1, 336, AX1 + 1, 318, 10], [AX0 - 1, 468, AX1 + 1, 486, 10]]
  const BULB = ["m", "v", "Q", "0"]
  const BULBS = []
  for (const [x0, y0, x1, y1, sp] of STRINGS) {
    const n = fl(Math.hypot(x1 - x0, y1 - y0) / sp)
    for (let i = 1; i < n; i++) { const hue = BULB[(i + x0) % 4], bx = R(x0 + (x1 - x0) * i / n), by = R(y0 + (y1 - y0) * i / n); BULBS.push([bx, by, hue]); lamp(bx, by, { m: "m", v: "c", Q: "w", 0: "p" }[hue], 9, 0.2) }
  }
  // the roofs' own: the neon lying flat for the drones (each lights the roof round its board), the LED strips on the parapets over the
  // street, the hatch's bulb, the skylights, the residents' garden
  const ROOFSIGNS = [[600, 34, "NINTH LIVE", "m"], [860, 86, "TIDE MODS", "c"], [322, 340, "KARAOKE", "p"], [512, 346, "MAHJONG", "m"], [150, 372, "HOT POT", "w"], [704, 446, "PAWN", "c"]]
  for (const [cx, y, t, hue] of ROOFSIGNS) { const w = TXT.measure(t, "nagiwa") * 2; lamp(cx, y + 7, hue, 24, 0.55, "r", w / 2 + 6, 13) }
  lamp(512, 353, "w", 18, 0.3, "r", 52, 20); lamp(29, 330, "m", 22, 0.7, "r", 13, 27)
  const STRIPS = [[62, SF + 1, 398, "m"], [402, SF + 1, 788, "c"], [AX0 + 2, NF - 2, W, "c"], [AX1 + 1, NF + 4, H - 4, "m", true]]
  for (const [a, b, c, hue, vert] of STRIPS) vert ? lamp(a, (b + c) / 2, hue, 12, 0.35, "r", 1, (c - b) / 2) : lamp((a + c) / 2, b, hue, 12, 0.35, "r", (c - a) / 2, 1)
  lamp(420, 48, "w", 22, 0.5, "r"); lamp(712, 94, "w", 30, 0.45, "r", 56, 12)
  lamp(486, 73, "w", 18, 0.45, "r", 12, 9); lamp(302, 470, "w", 18, 0.45, "r", 10, 8); lamp(650, 336, "w", 18, 0.45, "r", 10, 8); lamp(233, 309, "w", 20, 0.3, "r")

  const HUES = "wmcp"
  const LI = { s: HUES.split("").map(() => new Float32Array(W * H)), r: HUES.split("").map(() => new Float32Array(W * H)) }
  const LS = { s: new Float32Array(W * H), r: new Float32Array(W * H) }
  for (const [lx, ly, hue, r, s, lv, hw, hh] of LAMPS) {
    const A = LI[lv][HUES.indexOf(hue)], S = LS[lv]
    for (let y = Math.max(0, R(ly - hh - r)); y < Math.min(H, ly + hh + r); y++) for (let x = Math.max(0, R(lx - hw - r)); x < Math.min(W, lx + hw + r); x++) {
      const z = ZN[y * W + x], onRoof = z >= 10
      if ((lv === "r") !== onRoof) continue
      const q = 1 - Math.hypot(Math.max(0, Math.abs(x - lx) - hw), Math.max(0, Math.abs(y - ly) - hh)) / r
      if (q > 0) { const e = s * Math.pow(q, 1.6); A[y * W + x] += e; S[y * W + x] += e }
    }
  }
  const lightAt = (x, y) => {
    x = clamp(R(x), 0, W - 1); y = clamp(R(y), 0, H - 1)
    const i = y * W + x, lv = ZN[i] >= 10 ? "r" : "s"
    let best = 0, hue = 0
    for (let j = 0; j < 4; j++) { const v = LI[lv][j][i]; if (v > best) { best = v; hue = j } }
    return { sum: LS[lv][i], hue: best > 0.05 && best > LS[lv][i] * 0.45 ? HUES[hue] : "n", best }
  }
  const hard = (ramp, v) => ramp[clamp(fl(clamp(v, 0, 0.999) * ramp.length), 0, ramp.length - 1)]
  const RAMPS = {
    road: { n: "efzZX", w: "eaA<>", m: "eiIdD", c: "etTlL", p: "ebB{}" },
    walk: { n: "1zZX4", w: "1aA<>", m: "1iIdD", c: "1tTlL", p: "1bB{}" },
    roof: { n: "k1234", w: "k1aA<", m: "k1iId", c: "k1tTl", p: "k1bB{" },
  }
  const BR = { w: ["O", "P", "Q", "R"], m: ["n", "M", "m", "N"], c: ["c", "C", "v", "V"], p: ["8", "9", "0", "7"] }
  /** a lit key: the material's ramp at base, the light added, the pool's edge dithered */
  /** a ramp's key for a level 0..1: flat steps, dithered only in a narrow band where one meets the next */
  const tone = (ramp, v, x, y) => {
    const t = clamp(v, 0, 0.999) * ramp.length, i = fl(t), f = t - i
    return ramp[Math.min(ramp.length - 1, f > 0.72 && bay(x, y) < (f - 0.72) * 3.6 ? i + 1 : i)]
  }
  const litKey = (mat, base, x, y, L = lightAt(x, y)) => {
    const a = 0.46 * (1 - Math.exp(-L.sum * 1.5))
    const lk = tone(RAMPS[mat][L.hue], base + a, x, y), uk = hard(RAMPS[mat].n, base)
    return a < 0.03 ? uk : a < 0.08 ? (bay(x, y) < (a - 0.03) / 0.05 ? lk : uk) : lk
  }
  const lsAt = (x, y) => { x = clamp(R(x), 0, W - 1); y = clamp(R(y), 0, H - 1); const i = y * W + x; return LS[ZN[i] >= 10 ? "r" : "s"][i] }
  /** a thing's own ramp (value only: it keeps its colour), lifted by the light round it */
  const lit = (ramp, base, x, y, k = 0.5) => hard(ramp, base + lsAt(x, y) * k)

  // ---- buffers and pens
  const BASE = new Array(W * H), OVER = new Array(W * H)
  const inB = (x, y) => x >= 0 && y >= 0 && x < W && y < H
  const mkPen = (buf) => {
    const put = (x, y, k) => { if (k && inB(x, y)) buf[y * W + x] = k }
    const get = (x, y) => (inB(R(x), R(y)) ? buf[R(y) * W + R(x)] : undefined)
    const p = {
      px: (x, y, k) => put(R(x), R(y), k),
      rect: (x, y, w, h, k) => { x = R(x); y = R(y); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, k) },
      hline: (x, y, w, k) => p.rect(x, y, w, 1, k),
      vline: (x, y, h, k) => p.rect(x, y, 1, h, k),
      line: (x0, y0, x1, y1, k) => { for (const [x, y] of ISO.lineCells(R(x0), R(y0), R(x1), R(y1))) put(x, y, k) },
      disc: (cx, cy, r, k) => { cx = R(cx); cy = R(cy); for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (i * i + j * j <= r * r + r * 0.6) put(cx + i, cy + j, k) },
      ell: (cx, cy, rx, ry, k) => { cx = R(cx); cy = R(cy); for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) if ((i * i) / (rx * rx + 0.6 * rx) + (j * j) / (ry * ry + 0.6 * ry) <= 1) put(cx + i, cy + j, k) },
      ring: (cx, cy, r, k) => { cx = R(cx); cy = R(cy); for (let j = -r - 1; j <= r + 1; j++) for (let i = -r - 1; i <= r + 1; i++) { const d = i * i + j * j; if (d <= r * r + r * 0.6 && d > (r - 1) * (r - 1) + (r - 1) * 0.6) put(cx + i, cy + j, k) } },
      grid: (x, y, rows, map = {}) => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") put(R(x) + i, R(y) + j, map[ch] ?? ch) })),
      text: (x, y, s, k, o = {}) => TXT.draw(p, x, y, s, k, { font: "nagiwa", ...o }),
      key: get,
    }
    return p
  }
  const p = mkPen(BASE), q = mkPen(OVER)
  const DARK = { X: "Z", Z: "z", z: "f", f: "e", 1: "k", 2: "1", 3: "2", 4: "3", 5: "4", 6: "5", A: "a", a: "e", "<": "A", ">": "<", I: "i", i: "e", d: "I", D: "d", T: "t", t: "e", l: "T", L: "l", B: "b", b: "e", "{": "B", "}": "{" }
  const darken = (x, y) => { const k = p.key(x, y); if (k && DARK[k]) p.px(x, y, DARK[k]) }

  // ======== the ground: street, stairs, gate and the roofs' surfaces ========
  const PUDS = [[180, 200, 16, 8], [432, 232, 20, 7], [566, 176, 22, 7], [728, 238, 15, 5], [866, 380, 14, 22], [884, 182, 18, 8], [108, 232, 13, 6], [300, 178, 10, 4], [842, 270, 12, 5]]
  const inPuddle = (x, y) => PUDS.some(([cx, cy, rx, ry]) => { const dx = (x - cx) / rx, dy = (y - cy) / ry; return dx * dx + dy * dy < 0.82 + 0.35 * Math.sin(x * 0.35 + y * 0.6) * Math.cos(y * 0.23) })
  // asphalt patched over the years: the patches a step lighter with a dark seam
  const PATCHES = [[96, 170, 60, 26], [262, 214, 74, 22], [470, 160, 48, 30], [640, 236, 66, 14], [812, 196, 46, 34], [372, 162, 40, 16]]
  const slabOf = (x, y, z) => {
    // the sidewalks' slabs: 20 px along, two rows across, the rows offset; returns [i, j, at an edge]
    const y0 = z === 1 ? NF : KS + 4, rh = 18, j = fl((y - y0) / rh), off = j % 2 ? 10 : 0, i = fl((x - 60 + off) / 20)
    return [i, j, (x - 60 + off) % 20 === 0 || (y - y0) % rh === 0]
  }
  const ground = () => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, z = ZN[i]
      let key
      if (z === 1 || z === 3) {                                           // the sidewalks
        const [si, sj, edge] = slabOf(x, y, z), seed = si * 7 + sj * 13 + z
        let v = 0.45 + (hs(si, sj, z) < 0.18 ? 0.08 : hs(si, sj, z) > 0.9 ? -0.06 : 0)       // a few slabs laid new, a few sunk
        if (edge) v -= 0.12
        const kerb = z === 1 ? y >= KN && y < KN + 3 : y >= KS + 1 && y < KS + 4
        const gutter = z === 1 ? y === KN + 3 : y === KS
        if (kerb) v = 0.62 - ((x + (z === 1 ? 0 : 5)) % 30 === 0 ? 0.14 : 0)                     // kerbstones, 75 cm each
        if (gutter) { key = litKey("road", 0.12, x, y); BASE[i] = key; continue }
        // against the facade: the dirt and the dark where the rain doesn't reach
        const wallD = z === 1 ? y - NF : SF - 1 - y
        if (wallD < 3 && x < AX0) v -= 0.12
        if (z === 1 && wallD < 9) v -= 0.1 * (1 - wallD / 9)                                     // Lerche's height over it
        if (hs(seed, 3) < 0.12 && !edge && !kerb && ((x * 3 + y * 5 + seed) % 23 === 0 || (x - y + seed) % 17 === 0 && hs(seed, 9) < 0.5)) v -= 0.1   // a crack in a broken slab
        key = litKey("walk", v, x, y)
      } else if (z === 2 || z === 4) {                                    // the road and the arm
        let mat = "road", v = 0.32
        if (z === 4) {                                                    // the arm: old setts in rows, a channel down its middle
          const row = fl((y - KS) / 7), sx = (x - AX0 + (row % 2) * 5) % 10
          v = 0.36 + (hs(fl((x - AX0 + (row % 2) * 5) / 10), row, 4) - 0.5) * 0.08
          if (sx === 0 || (y - KS) % 7 === 0) v -= 0.12
          if (Math.abs(x - 860) <= 2) v = 0.2
        } else {
          for (const [px, py, pw, ph] of PATCHES) if (x >= px && x < px + pw && y >= py && y < py + ph) { v += x === px || y === py || x === px + pw - 1 || y === py + ph - 1 ? -0.1 : 0.05; break }
          if (Math.abs(y - 205) <= 2) v -= 0.06                            // the road dips to its middle: the water runs there, west
          if (x < AX0 && Math.abs(y - 205) <= 2 && (x + y * 3) % 19 === 0) v += 0.18
          // the old tram's rails, still in the road from when the fish came up this way, gone under the patches
          const inPatch = PATCHES.some(([px, py, pw, ph]) => x >= px && x < px + pw && y >= py && y < py + ph)
          if (!inPatch && x > 64 && (y === 186 || y === 187 || y === 223 || y === 224)) v = (y === 186 || y === 223) ? 0.62 : 0.5
          if (!inPatch && x > 64 && (y === 188 || y === 225)) v -= 0.08
        }
        const pud = inPuddle(x, y)
        if (pud) v += 0.04
        const L = lightAt(x, y)
        // the wet asphalt catches the light in streaks along the street
        if (!pud && L.hue !== "n" && L.best > 0.12 && y % 3 === 0 && ((x + fl(hs(y, 23) * 50)) % 23) < 2 + L.best * 4) v += 0.12
        key = litKey(mat, v, x, y, L)
        // a puddle mirrors the light over it as broken strokes
        if (pud && !inPuddle(x - 1, y - 1)) key = "X"                                              // the rim catches the sky's glow
        else if (pud && L.hue !== "n" && L.best > 0.04 && (y & 1) === 0 && ((x + fl(hs(y, 17) * 60)) % 9) < 1 + L.best * 8) key = BR[L.hue][clamp(fl(L.best * 2.6), 0, 2)]
        else if (pud && (y % 3) === 0 && ((x + fl(hs(y, 19) * 40)) % 15) === 0) key = "X"
      } else if (z === 5) {                                               // the stairs down to the fish market: each step lower, darker
        const step = fl(x / 6), v = 0.2 + step * 0.035 + (x % 6 === 0 ? -0.1 : 0) + (x % 6 === 5 ? 0.06 : 0)
        const side = y < NF + 24 || y >= SF - 24
        key = side ? litKey("walk", 0.5, x, y) : litKey("walk", v, x, y)
        if (!side && (x % 6 === 2) && (y * 7 + step) % 11 === 0) key = "4"                       // the water running down, a glint on each step
      } else if (z === 6) key = "k"
      else key = roofGround(x, y, z - 10)
      BASE[i] = key
    }
  }
  /** a roof's surface: its material, its parapet and coping at the edges, lit by the roofs' own lamps */
  const roofGround = (x, y, ri) => {
    const r = ROOFS[ri]
    if (!r) return "k"
    const dx = Math.min(x - r.x0, r.x1 - 1 - x), dy = Math.min(y - r.y0, r.y1 - 1 - y), d = Math.min(dx, dy)
    // only the sides open to the street (or a lower roof) have a parapet; where the house goes on past the picture, none
    const open = (side) => ({ n: r.y0 > 0, s: r.y1 < H, w: r.x0 > 0, e: r.x1 < W })[side]
    const dd = Math.min(open("w") ? x - r.x0 : 99, open("e") ? r.x1 - 1 - x : 99, open("n") ? y - r.y0 : 99, open("s") ? r.y1 - 1 - y : 99)
    let v
    if (dd <= 0) v = 0.78                                                  // the coping's outer edge
    else if (dd <= 1) v = 0.66
    else if (dd <= 4) v = 0.52                                             // the parapet's top
    else if (dd === 5) v = 0.18                                            // its foot inside, in its own shadow
    else if (r.kind === "tar") v = 0.3 + ((y - r.y0) % 15 === 0 ? -0.1 : 0) + ((x * 7 + y) % 61 === 0 ? 0.08 : 0)
    else if (r.kind === "slab") v = 0.4 + ((x - r.x0) % 24 === 0 || (y - r.y0) % 24 === 0 ? -0.1 : 0)
    else v = 0.32 + [0, 0.06, 0.12, 0.06][x % 4] * 1.4
    void d
    return litKey("roof", v, x, y)
  }
  ground()

  // ---- small helpers
  const NEON = BR
  const shadowBox = (x, y, w, h, o = 2) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (i >= w - o || j >= h - o) darken(x + o + i, y + o + j) }
  /** text at twice its size */
  const big = (pen, x, y, s, k, sc = 2) => TXT.draw({ px: (X, Y, kk) => pen.rect(x + (X - x) * sc, y + (Y - y) * sc, sc, sc, kk) }, x, y, s, k, { font: "nagiwa" })
  /** a neon sign lying flat on a roof, for the drones: its frame on legs, a dark board, the tubes' glow, the letters */
  const roofNeon = (cx, y, s, hue, sc = 2, o = {}) => {
    const w = TXT.measure(s, "nagiwa") * sc, h = 7 * sc, x = R(cx - w / 2), N = NEON[hue]
    shadowBox(x - 6, y - 6, w + 12, h + 12, 3)
    p.rect(x - 6, y - 6, w + 12, h + 12, "k"); p.rect(x - 5, y - 5, w + 10, h + 10, "2"); p.hline(x - 5, y - 5, w + 10, "3")
    for (const fx of [x - 6, x + w + 5]) for (const fy of [y - 6, y + h + 5]) p.px(fx, fy, "4")
    for (let fx = x; fx < x + w; fx += 16) p.vline(fx, y - 5, h + 10, "1")                    // the frame's struts behind the tubes
    // the glow round the tubes, then the tubes, a hot line in each
    TXT.draw({ px: (X, Y) => { for (let j = -1; j <= sc; j++) for (let i = -1; i <= sc; i++) if (p.key(x + (X - x) * sc + i, y + (Y - y) * sc + j) !== N[2]) p.px(x + (X - x) * sc + i, y + (Y - y) * sc + j, N[0]) } }, x, y, s, "", { font: "nagiwa" })
    if (o.off !== undefined) big(p, x, y, s, N[1], sc)
    big(p, x, y, s, N[2], sc)
    if (o.off !== undefined) for (const ch of o.off) TXT.draw({ px: (X, Y) => p.rect(x + (X - x) * sc, y + (Y - y) * sc, sc, sc, N[0]) }, x + TXT.measure(s.slice(0, ch), "nagiwa") + 1, y, s[ch], "", { font: "nagiwa" })
    TXT.draw({ px: (X, Y) => p.px(x + (X - x) * sc, y + (Y - y) * sc, N[3]) }, x, y, s, "", { font: "nagiwa" })
    return [x - 6, y - 6, w + 12, h + 12]
  }

  // ======== the roofs ========
  const ac = (x, y, pen = p) => {
    // an AC unit: its fan, the grille, the drip's stain running off it
    if (pen === p) shadowBox(x, y, 18, 14)
    pen.rect(x, y, 18, 14, "k"); pen.rect(x + 1, y + 1, 16, 12, lit("2345", 0.45, x, y)); pen.hline(x + 1, y + 1, 16, lit("3456", 0.5, x, y))
    pen.disc(x + 9, y + 7, 4, "1"); for (let a = 0; a < 4; a++) pen.line(x + 9, y + 7, x + 9 + R(Math.cos(a * 1.57 + 0.4) * 4), y + 7 + R(Math.sin(a * 1.57 + 0.4) * 4), "3")
    pen.px(x + 9, y + 7, "5"); pen.vline(x + 2, y + 2, 10, "2")
  }
  const tank = (x, y, r) => {
    for (let j = 0; j < 3; j++) p.ring(x + 2, y + 2 + j * 0, r, "k")
    p.disc(x + 2, y + 2, r, "k"); p.disc(x, y, r, lit("123", 0.4, x, y)); p.ring(x, y, r - 3, "O"); p.ring(x, y, r - 1, "3")
    p.disc(x, y, 4, "3"); p.disc(x - 1, y - 1, 2, "4"); p.line(x - r + 3, y - 2, x - 3, y - r + 3, "4")
    p.line(x + 2, y + r, x + 2, y + r + 6, "O")                                                 // the rust running off its leg
  }
  const dish = (x, y) => { p.ell(x + 8, y + 7, 8, 6, "k"); p.ell(x + 7, y + 6, 8, 6, "5"); p.ell(x + 6, y + 5, 5, 3, "6"); p.line(x + 7, y + 6, x + 13, y + 1, "3"); p.px(x + 13, y + 1, "2") }
  const tubs = (x, y, n) => { for (let i = 0; i < n; i++) { const tx = x + i * 10; p.rect(tx + 2, y + 2, 9, 8, "k"); p.rect(tx, y, 9, 8, "p"); p.rect(tx + 1, y + 1, 7, 6, i % 2 ? "+" : "&"); p.px(tx + 3, y + 2, "`"); p.px(tx + 5, y + 4, "`"); p.px(tx + 2, y + 5, "+") } }
  const laundry = (x0, y0, x1, y1) => {
    p.line(x0, y0, x1, y1, "5"); p.rect(x0 - 1, y0 - 1, 3, 3, "k"); p.rect(x1 - 1, y1 - 1, 3, 3, "k")
    const n = fl((x1 - x0) / 7)
    for (let i = 1; i < n; i++) { const lx = x0 + i * 7, ly = R(y0 + (y1 - y0) * i / n); p.rect(lx - 2, ly + 1, 5, 6, ["u", "O", "h", "n", "&", "3", "U"][fl(hs(lx, ly, 5) * 7)]); p.hline(lx - 2, ly + 1, 5, "k") }
  }
  const skylight = (x, y, w, h) => { p.rect(x, y, w, h, "k"); p.rect(x + 1, y + 1, w - 2, h - 2, "P"); p.rect(x + 1, y + 1, R(w / 2) - 1, h - 2, "Q"); p.vline(x + R(w / 2), y + 1, h - 2, "k"); p.hline(x + 1, y + R(h / 2), w - 2, "k") }
  const vent = (x, y) => { p.disc(x + 1, y + 1, 3, "k"); p.disc(x, y, 3, "3"); p.disc(x, y, 1, "k"); p.px(x - 1, y - 2, "5") }
  const antenna = (x, y, len) => { p.line(x, y, x + len, y - len, "5"); for (let i = 3; i < len; i += 4) p.line(x + i - 2, y - i - 2, x + i + 2, y - i + 2, "4"); p.px(x, y, "k") }
  const box = (pen, x, y, w, h, k, edge = "k") => { pen.rect(x - 1, y - 1, w + 2, h + 2, edge); pen.rect(x, y, w, h, k) }
  const duct = (x, y, w, h) => { shadowBox(x, y, w, h); p.rect(x, y, w, h, "k"); p.rect(x + 1, y + 1, w - 2, h - 2, "3"); if (w > h) { p.hline(x + 1, y + 1, w - 2, "4"); for (let i = x + 10; i < x + w; i += 18) p.vline(i, y + 1, h - 2, "2") } else { p.vline(x + 1, y + 1, h - 2, "4"); for (let j = y + 10; j < y + h; j += 18) p.hline(x + 1, j, w - 2, "2") } }
  const stain = (x, y, len) => { for (let j = 0; j < len; j++) for (let i = -1; i <= 1; i++) if (hs(x + i, y + j, 2) < 0.7 - j / len * 0.6) darken(x + i + R(Math.sin(j * 0.5)), y + j) }
  /** a tarp laid over a leaking roof, tyres holding it down, its folds */
  const tarp = (x, y, w, h, T) => {
    shadowBox(x, y, w, h, 2); p.rect(x, y, w, h, T[1]); for (let i = 9; i < w - 2; i += 17) p.vline(x + i, y, h, T[0]); p.hline(x, y, w, T[2])
    for (let n = 0; n < Math.max(2, fl(w * h / 900)); n++) { const tx = x + 6 + fl(hs(n, x, 7) * (w - 12)), ty = y + 6 + fl(hs(n, y, 8) * (h - 12)); p.disc(tx + 1, ty + 1, 4, "k"); p.disc(tx, ty, 4, "2"); p.disc(tx, ty, 2, "k"); p.px(tx - 2, ty - 3, "4") }
  }
  /** rain standing on a flat roof, the sign's light in it */
  const roofPuddle = (cx, cy, rx, ry) => { for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) { const d = (i * i) / (rx * rx) + (j * j) / (ry * ry); if (d > 1) continue; const L = lightAt(cx + i, cy + j); p.px(cx + i, cy + j, d > 0.75 ? "2" : L.hue !== "n" && (j & 1) === 0 && (i + j * 5) % 7 < 3 ? BR[L.hue][1] : "1") } }
  /** a sofa carried up for the smokers: its back, two seat cushions, the arms (from above) */
  const sofa = (x, y) => { shadowBox(x, y, 34, 16, 2); p.rect(x, y, 34, 16, "k"); p.rect(x + 1, y + 1, 32, 5, "u"); p.hline(x + 1, y + 1, 32, "U"); p.rect(x + 1, y + 6, 4, 9, "u"); p.rect(x + 29, y + 6, 4, 9, "u"); p.rect(x + 5, y + 6, 12, 9, "U"); p.rect(x + 17, y + 6, 12, 9, "U"); p.vline(x + 17, y + 6, 9, "u"); p.px(x + 9, y + 9, "u"); p.px(x + 22, y + 11, "u"); p.rect(x + 23, y + 7, 3, 2, "O") }
  const shackRust = (x, y, w, h) => { shadowBox(x, y, w, h, 3); p.rect(x, y, w, h, "k"); for (let i = 1; i < w - 1; i++) for (let j = 1; j < h - 1; j++) p.px(x + i, y + j, (i % 4 === 3) ? "o" : hs(fl(i / 4), fl(j / 6), 4) < 0.4 ? "O" : "p"); p.rect(x, y, w, 2, "E") }
  const roofs = () => {
    // what covers the roofs: tarps where they leak, a wooden deck under the residents' garden, rain standing in the hollows
    for (let y = 72; y < 112; y++) for (let x = 640; x < 770; x++) p.px(x, y, (x - 640) % 7 === 0 ? "o" : lit("pE", 0.35, x, y))
    tarp(180, 430, 70, 44, ["+", "&", "`"]); tarp(66, 480, 40, 54, ["2", "4", "5"]); tarp(808, 50, 30, 30, ["2", "4", "5"])
    roofPuddle(560, 84, 16, 5); roofPuddle(360, 380, 14, 5); roofPuddle(520, 392, 18, 6); roofPuddle(860, 108, 12, 3); roofPuddle(250, 104, 10, 3)
    shackRust(720, 300, 58, 54); sofa(600, 96)
    // ---- Lerche: an old tar roof. The lift's engine house over the lift in the north-west, the stair hatch, a duct from the
    // kitchens, NINTH LIVE lying flat for the drones (the house rents its roof), the residents' garden in the east with its string
    // of lamps, a water tank, laundry, dishes on the ones who still pay
    shadowBox(110, 20, 50, 40, 3); box(p, 110, 20, 50, 40, "3"); p.rect(112, 22, 46, 36, lit("234", 0.5, 130, 40)); p.hline(112, 22, 46, "4"); p.vline(112, 22, 36, "4")
    for (let j = 28; j < 52; j += 3) p.hline(142, j, 12, "1")                                      // its louvres
    p.rect(118, 30, 16, 12, "k"); p.rect(119, 31, 14, 10, "2"); p.px(126, 36, "5")                   // the winch's housing
    shadowBox(400, 14, 40, 30, 3); box(p, 400, 14, 40, 30, "3"); p.rect(402, 16, 36, 26, lit("234", 0.5, 420, 30)); p.hline(402, 16, 36, "4")
    p.rect(414, 42, 12, 4, "4"); p.px(420, 47, "R"); p.px(419, 47, "Q"); p.px(421, 47, "Q")          // its door's step, the bulb over it
    duct(160, 34, 236, 8); duct(240, 42, 8, 50)
    tank(268, 74, 14); ac(196, 64); ac(318, 18); ac(336, 70); ac(368, 70); vent(300, 100); vent(452, 100); vent(220, 102)
    laundry(130, 84, 228, 92); laundry(130, 100, 200, 104)
    skylight(474, 64, 24, 18); skylight(378, 50, 16, 12)
    antenna(470, 40, 18); antenna(690, 30, 22); dish(740, 20); dish(712, 14)
    // the garden: tubs, a bench, a string of warm bulbs on poles
    tubs(650, 82, 6); tubs(650, 98, 3); p.rect(712, 102, 30, 6, "k"); p.rect(713, 103, 28, 4, "E"); p.hline(713, 103, 28, "!")
    for (let i = 0; i < 9; i++) { const bx = 650 + i * 12, by = 76 + R(Math.sin(i * 0.9) * 2); p.px(bx, by, i % 3 === 1 ? "R" : "Q"); p.px(bx + 6, by + 1, "5") }
    p.px(648, 76, "k"); p.px(758, 76, "k")
    for (const x of [96, 236, 356, 476, 596, 716]) { p.rect(x - 1, NF - 4, 3, 4, "4"); p.px(x, NF - 1, "k") }      // the drainpipes' heads at the gutter
    stain(560, 8, 14); stain(90, 6, 10)
    // ---- the corner house over the arm (north-east): its water tank, TIDE MODS lying flat
    tank(860, 48, 20); ac(808, 20); ac(930, 30); vent(820, 60)
    // ---- north-west, the house by the stairs: corrugated sheet, a dish
    dish(18, 40); vent(40, 110); ac(8, 84)
    // ---- the south-west: a bar's sign, vertical, lying flat
    { const N = NEON.m; p.rect(16, 304, 26, 54, "k"); p.rect(17, 305, 24, 52, "2"); for (const [ch, j] of [["B", 0], ["A", 1], ["R", 2]]) { TXT.draw({ px: (X, Y) => p.rect(X * 2 - 23, Y * 2 - 300 + j * 16, 2, 2, N[0]) }, 23, 308 + 0, ch, "", { font: "nagiwa" }); big(p, 23, 308 + j * 16, ch, N[2]) } }
    ac(14, 380); ac(20, 460); tank(36, 510, 12)
    // ---- s1, the noodle bar's house: the kitchen's exhaust with its grease, KARAOKE, a shack on the roof with laundry, tanks
    shadowBox(222, 300, 22, 18, 2); box(p, 222, 300, 22, 18, "3"); p.disc(233, 309, 6, "k"); p.disc(233, 309, 5, "2"); for (let a = 0; a < 6; a++) p.line(233, 309, 233 + R(Math.cos(a) * 5), 309 + R(Math.sin(a) * 5), "4")
    for (let j = 0; j < 20; j++) for (let i = -3; i < 6; i++) if (hs(i, j, 8) < 0.6 - j / 34) p.px(236 + i + R(j * 0.3), 319 + j, j < 4 ? "o" : "1")   // the grease run off it
    // the shack: corrugated sheet in rust and grey, a door, a chair before it, a line of washing
    shadowBox(92, 404, 80, 56, 3); p.rect(92, 404, 80, 56, "k"); for (let i = 0; i < 78; i++) p.rect(93 + i, 405, 1, 54, "2324"[i % 4]); for (let n = 0; n < 40; n++) { const rx = 100 + fl(hs(n, 1, 3) * 60), ry = 410 + fl(hs(n, 2, 3) * 40); if (rx % 4 !== 3) p.px(rx, ry, rx % 4 === 1 ? "O" : "o") }
    p.rect(92, 404, 80, 2, "4"); p.rect(176, 440, 8, 8, "k"); p.rect(177, 441, 6, 6, "u")
    laundry(100, 470, 190, 478)
    tank(220, 420, 16); tank(256, 470, 12); ac(300, 410); ac(330, 504); ac(80, 330); ac(150, 340); vent(196, 362); vent(372, 470); dish(350, 400)
    skylight(292, 462, 20, 16); antenna(240, 520, 20)
    for (const x of [100, 172, 280, 370]) { p.rect(x - 1, SF, 3, 4, "4"); p.px(x, SF, "k") }
    // ---- s2, the shut shop's house and the 24-hour shop's: MAHJONG with its chase bulbs, a pigeon coop, a cluster of ACs
    // the coop: a wire box, the pigeons in it
    shadowBox(600, 410, 60, 34, 3); p.rect(600, 410, 60, 34, "k"); p.rect(601, 411, 58, 32, "1"); for (let i = 601; i < 659; i += 3) p.vline(i, 411, 32, "3"); for (let j = 411; j < 443; j += 3) p.hline(601, j, 58, "3")
    for (const [x, y] of [[608, 418], [622, 426], [640, 416], [648, 434], [614, 436], [632, 432]]) p.grid(x, y, [".gg.", "gGGg", "gGGg", ".g.."])
    p.rect(630, 444, 10, 4, "E")
    for (const [x, y] of [[440, 420], [462, 420], [440, 438], [462, 438], [700, 380], [724, 380], [740, 470]]) ac(x, y)
    tank(560, 470, 18); tank(700, 506, 12); dish(470, 500); dish(500, 506); vent(420, 380); vent(580, 400); vent(760, 420); antenna(660, 500, 22)
    skylight(640, 328, 20, 16); duct(680, 300, 8, 70); duct(410, 470, 120, 8)
    for (const x of [440, 590, 660, 776]) { p.rect(x - 1, SF, 3, 4, "4"); p.px(x, SF, "k") }
    // ---- the east house beside the arm: ACs hung over its parapet, a pipe down
    ac(936, 160); ac(938, 250); ac(936, 360); ac(938, 470); for (let y = 130; y < 530; y += 6) p.px(942, y, "4")
    // ---- the LED strips along the parapets over the street: a tube on the coping, its clips, a dead stretch here and there
    for (const [a, b, c, hue, vert] of STRIPS) { const N = NEON[hue]; for (let t = a; t < c; t++) { const dead = (t * 7) % 97 < 6; const k = dead ? N[0] : t % 9 === 0 ? N[1] : N[2]; vert ? p.px(b, t, k) : p.px(t, b, k) } }
  }
  const SIGNRECT = {}
  roofs()
  // the signs over what stands on the roofs, MAHJONG's chase bulbs round its board
  for (const [cx, y, t, hue] of ROOFSIGNS) SIGNRECT[t.split(" ")[0]] = roofNeon(cx, y, t, hue, 2)
  { const [bx, by, bw, bh] = SIGNRECT.MAHJONG; for (let i = 0; i < bw; i += 4) { p.px(bx + i, by - 2, i % 8 ? "P" : "R"); p.px(bx + i, by + bh + 1, i % 8 ? "R" : "P") } for (let j = 0; j < bh; j += 4) { p.px(bx - 2, by + j, j % 8 ? "P" : "R"); p.px(bx + bw + 1, by + j, j % 8 ? "R" : "P") } }

  // ======== on the street: what lies, stands and leaks there ========
  const street = () => {
    // the drainpipes' feet on Lerche, the rain from them running over the sidewalk to the gutter
    for (const x of [96, 236, 356, 476, 596, 716]) { p.rect(x - 2, NF, 5, 3, "k"); p.rect(x - 1, NF, 3, 2, "5"); for (let y = NF + 3; y < KN + 3; y++) { darken(x + R(Math.sin(y * 0.4) * 1.5), y); if (y % 5 === 0) p.px(x + R(Math.sin(y * 0.4) * 1.5), y, "X") } }
    for (const x of [100, 172, 280, 370, 440, 590, 660, 776]) { p.rect(x - 2, SF - 3, 5, 3, "k"); p.rect(x - 1, SF - 2, 3, 2, "5"); for (let y = KS + 4; y < SF - 3; y++) darken(x + R(Math.sin(y * 0.4) * 1.5), y) }
    // kerb drains and manholes
    for (const [x, y] of [[132, KN + 1], [420, KN + 1], [690, KN + 1], [116, KS + 1], [350, KS + 1], [596, KS + 1]]) { p.rect(x, y, 14, 4, "k"); for (let i = 1; i < 14; i += 2) p.vline(x + i, y, 4, "2") }
    for (const [x, y] of [[292, 232], [624, 232], [860, 466]]) { p.disc(x, y, 8, "k"); p.disc(x, y, 7, lit("234", 0.35, x, y)); p.ring(x, y, 5, "2"); p.hline(x - 4, y, 9, "2"); p.vline(x, y - 4, 9, "2"); p.px(x - 3, y - 3, "4") }
    // the steam vent in the road: a round grate, its slots, the wet ring round it
    { const x = 370, y = 215; p.ring(x, y, 11, "f"); p.disc(x, y, 9, "k"); p.disc(x, y, 8, "3"); for (let j = -6; j <= 6; j += 3) p.hline(x - 6, y + j, 13, "k"); p.px(x - 4, y - 4, "5"); p.px(x + 3, y - 7, "4") }
    // the robot's ring round its puddle: the water pushed aside, a cleaner track
    for (let a = 0; a < 6.28; a += 0.08) { const rx = R(180 + Math.cos(a) * 15), ry = R(200 + Math.sin(a) * 7); const k = p.key(rx, ry); if (k && !"mMNnvVCc90".includes(k)) p.px(rx, ry, k === "f" ? "z" : k === "e" ? "f" : k) }
    // Lull's projection on the road from a box on Lerche's facade: the patch's oval, SLEEP IS FREE, the lines of its scan
    p.rect(522, NF, 10, 4, "k"); p.rect(523, NF, 8, 3, "3"); p.px(527, NF + 3, "V")
    { const cx = 486, cy = 206
      for (let j = -11; j <= 11; j++) for (let i = -17; i <= 17; i++) { const d = (i * i) / 289 + (j * j) / 121; if (d <= 1 && d > 0.62 && (j + 40) % 3) p.px(cx + i, cy + j, d > 0.82 ? "v" : "C") }
      for (let j = -5; j <= 5; j++) for (let i = -9; i <= 9; i++) { const d = (i * i) / 81 + (j * j) / 25; if (d <= 1 && (j + 40) % 3) p.px(cx + i, cy + j, d > 0.6 ? "V" : "v") }
      TXT.draw({ px: (X, Y) => { if ((Y + 40) % 3) p.px(X, Y, "v") } }, 508, 202, "SLEEP IS FREE", "", { font: "nagiwa" }) }
    // oil and grease on the road, a sheen on the wet over it (violet, cyan: the film, not a light)
    for (const [cx, cy, r] of [[262, 240, 5], [452, 172, 4], [702, 184, 5], [838, 236, 4], [880, 470, 4]]) {
      for (let j = -r; j <= r; j++) for (let i = -r - 2; i <= r + 2; i++) { const d = Math.hypot(i / 1.4, j) / r + 0.25 * Math.sin(i * 1.3 + j * 0.7); if (d < 0.7) darken(cx + i, cy + j); else if (d < 1 && (i + j) % 3 === 0) p.px(cx + i, cy + j, (i + j * 3) % 4 === 0 ? "b" : "t") }
    }
    // cracks in the asphalt, where the trams' bed shifted
    for (const [x0, y0, pts] of [[150, 166, [[8, 3], [14, 1], [22, 6]]], [420, 240, [[6, -4], [12, -3], [20, -8]]], [660, 166, [[5, 4], [11, 5], [15, 10]]], [880, 230, [[-6, 5], [-9, 12]]], [340, 196, [[7, -2], [12, 1]]]]) { let [x, y] = [x0, y0]; for (const [dx, dy] of pts) { p.line(x, y, x0 + dx, y0 + dy, "e"); [x, y] = [x0 + dx, y0 + dy] } }
    // a tag sprayed on the road (K9, who is on the arcade's board in Lerche's hall), the paint run thin in the rain
    TXT.draw({ px: (X, Y) => { for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) if (bay(X * 2 + i, Y * 2 + j) < 0.7) p.px(X * 2 + i + 120, Y * 2 + j - 188, (X + Y) % 5 ? "d" : "M") } }, 140, 182, "K9", "", { font: "nagiwa" })
    // chewing gum, pressed flat on the sidewalks where people wait: at the noodle bar's queue, at Lerche's door, by the machine
    for (const [cx, cy, rx, ry, n, sd] of [[200, 262, 50, 8, 26, 1], [752, 146, 30, 6, 12, 2], [840, 318, 14, 20, 8, 3], [346, 266, 40, 8, 14, 4]]) for (let k = 0; k < n; k++) { const x = R(cx + (hs(k, sd, 5) * 2 - 1) * rx), y = R(cy + (hs(k, sd, 6) * 2 - 1) * ry); if (inStreet(x, y)) p.px(x, y, ":") }
    // the north strip by Lerche: gas meters, the residents' bikes, plants, an electric box (outside the walk area, against the wall)
    for (const x of [176, 520 + 40]) { p.rect(x, NF + 1, 16, 7, "k"); p.rect(x + 1, NF + 1, 14, 6, "4"); p.hline(x + 1, NF + 1, 14, "5"); p.px(x + 4, NF + 4, "C"); p.px(x + 10, NF + 4, "C") }
    for (const x of [252, 268]) { p.line(x, NF + 4, x + 28, NF + 6, "k"); p.disc(x + 2, NF + 5, 3, "k"); p.ring(x + 2, NF + 5, 3, "5"); p.ring(x + 26, NF + 6, 3, "5"); p.line(x + 6, NF + 4, x + 22, NF + 6, "6") }
    tubs(640, NF + 1, 2); tubs(110, NF + 1, 1)
    // Lerche's door: the step, the doormat, the keypad with its locked LED (red: a locked door) beside it (CAM 24 is its lens)
    p.rect(738, NF, 44, 4, "5"); p.hline(738, NF + 3, 44, "4"); p.rect(748, NF + 4, 24, 6, "o"); for (let i = 749; i < 771; i += 2) p.vline(i, NF + 5, 4, "p")
    p.rect(726, NF, 6, 8, "k"); p.rect(727, NF + 1, 4, 6, "C"); p.px(728, NF + 2, "v"); p.px(729, NF + 6, "q"); p.px(730, NF + 3, "V")
    // trash: the bags against Lerche (the blocks' place), one torn open, what spilled from it
    for (const [x, y, r] of [[304, 132, 7], [316, 140, 7], [328, 131, 7], [334, 143, 6], [310, 148, 5]]) { p.disc(x + 1, y + 1, r, "k"); p.disc(x, y, r, "1"); p.disc(x - 2, y - 2, 2, "2"); p.px(x - 3, y - 3, "4"); p.px(x + 2, y - r + 1, "k") }
    for (const [x, y, k] of [[342, 150, "H"], [345, 152, "!"], [340, 154, "h"], [348, 148, "M"], [338, 156, "%"]]) p.rect(x, y, 2, 2, k)
    // the dumpster on the south side: green steel, its two lids, rust on the edge, a bag on top
    { const x = 600, y = 260; shadowBox(x, y, 48, 26, 2); p.rect(x, y, 48, 26, "k"); p.rect(x + 1, y + 1, 46, 24, "+"); p.rect(x + 1, y + 1, 22, 24, "&"); p.vline(x + 24, y + 1, 24, "k")
      p.hline(x + 1, y + 1, 46, "`"); for (let i = 2; i < 46; i += 7) p.px(x + i, y + 24, "O"); p.disc(x + 34, y + 10, 5, "k"); p.disc(x + 33, y + 9, 4, "1"); p.px(x + 31, y + 7, "3")
      for (const [i, j] of [[-4, 6], [-3, 14], [50, 20], [-5, 20]]) p.rect(x + i, y + j, 3, 2, "!") }
    // the homeless man's cardboard under the shut shop's edge (his sprite lies on it): flattened boxes, a fold, wet at the edge
    { const x = 505, y = 262; p.rect(x - 1, y - 1, 28, 24, "k"); p.rect(x, y, 26, 22, "!"); p.rect(x, y + 10, 26, 12, "%"); p.hline(x, y + 10, 26, "E"); p.line(x + 3, y + 4, x + 20, y + 3, "E"); for (let i = 0; i < 26; i += 3) p.px(x + i, y + 21, "E") }
    // the shut shop's shutter housing along the facade
    p.rect(420, SF - 8, 160, 6, "k"); p.rect(421, SF - 7, 158, 4, "3"); for (let i = 424; i < 578; i += 6) p.px(i, SF - 6, "2"); p.hline(421, SF - 7, 158, "4")
    // the vending machine in the arm: its top, the screen's light along the front (it faces east)
    { const x = 800, y = 300; shadowBox(x, y, 22, 30, 2); p.rect(x - 1, y - 1, 24, 32, "k"); p.rect(x, y, 22, 30, "4"); p.rect(x + 2, y + 2, 16, 26, "3"); p.vline(x + 21, y, 30, "v"); p.vline(x + 20, y + 2, 26, "C"); p.rect(x + 4, y + 4, 6, 4, "5"); p.px(x + 14, y + 22, "q") }
    // the fish crates by the east house's back door: white boxes stacked, one open with its melted ice, a crate of empties; the door's step
    { const x = 884, y = 410
      for (const [i, j, w, h, open] of [[0, 0, 20, 14, 0], [21, 0, 20, 14, 1], [0, 15, 20, 14, 0], [21, 15, 20, 14, 0]]) { p.rect(x + i, y + j, w, h, "k"); p.rect(x + i + 1, y + j + 1, w - 2, h - 2, open ? "h" : "H"); if (open) { p.rect(x + i + 3, y + j + 3, w - 6, h - 6, "6"); p.px(x + i + 6, y + j + 6, "V"); p.px(x + i + 11, y + j + 8, "V") } else p.hline(x + i + 1, y + j + 6, w - 2, "h") }
      p.rect(924, 392, 6, 18, "4"); p.vline(929, 392, 18, "5") }
    // litter where people leave it: cups and chopsticks at the noodle bar, cans by the machine, Lull's flyers round the sheep,
    // butts at Lerche's door, a newspaper, rags by the homeless man
    const bit = (x, y, kind) => {
      if (kind === "cup") { p.disc(x, y, 1, "H"); p.px(x, y, "h") }
      else if (kind === "sticks") p.line(x, y, x + 4, y + 1, "!")
      else if (kind === "can") { p.rect(x, y, 3, 2, "5"); p.px(x + 2, y, kind === "can" && (x + y) % 2 ? "M" : "C") }
      else if (kind === "flyer") { p.rect(x, y, 5, 4, (x + y) % 3 ? "h" : "6"); p.hline(x, y + 3, 5, "5"); p.px(x + 2, y + 1, "v"); p.px(x + 1, y + 1, "C") }
      else if (kind === "butt") p.px(x, y, "h")
      else if (kind === "paper") { p.rect(x, y, 6, 4, "h"); p.hline(x + 1, y + 1, 4, "6"); p.hline(x + 1, y + 2, 3, "6") }
      else if (kind === "rag") { p.rect(x, y, 4, 3, "U"); p.px(x + 1, y + 1, "u") }
    }
    const scatter = (cx, cy, rx, ry, n, kinds, seed) => { for (let k = 0; k < n; k++) { const x = R(cx + (hs(k, seed, 1) * 2 - 1) * rx), y = R(cy + (hs(k, seed, 2) * 2 - 1) * ry); if (!inStreet(x, y) || OCC.some(([a, b, c, d]) => x >= a - 2 && x < c + 2 && y >= b - 2 && y < d + 2)) continue; bit(x, y, kinds[fl(hs(k, seed, 3) * kinds.length)]) } }
    scatter(210, 260, 66, 16, 16, ["cup", "sticks", "cup", "butt"], 1)
    scatter(838, 320, 20, 22, 6, ["can", "can", "paper"], 2)
    for (const [x, y] of [[660, 222], [697, 214], [671, 228], [704, 199], [652, 202], [712, 224], [640, 214], [686, 236], [720, 206], [630, 228]]) bit(x, y, "flyer")
    scatter(752, 150, 26, 6, 9, ["butt"], 3)
    scatter(490, 270, 12, 10, 3, ["rag", "paper"], 4)
    bit(150, 236, "paper"); bit(410, 180, "paper"); bit(880, 260, "paper"); bit(560, 150, "can"); bit(240, 166, "cup"); bit(612, 194, "butt"); bit(330, 246, "can"); bit(850, 432, "paper"); bit(900, 300, "can")
    // the grating over the stairs down to the fish market, shut (the user: maybe later): its bars from above, a post every metre, the padlock
    p.rect(56, NF + 18, 4, SF - NF - 36, "k"); p.rect(57, NF + 19, 2, SF - NF - 38, "5")
    for (let y = NF + 20; y < SF - 20; y += 40) { p.rect(55, y, 6, 4, "k"); p.rect(56, y + 1, 4, 2, "6") }
    p.rect(52, 202, 5, 6, "k"); p.rect(53, 203, 3, 4, "G"); p.px(54, 204, "6")
    // the stairs' rails along both walls
    for (const y of [NF + 26, SF - 27]) { p.hline(0, y, 56, "k"); p.hline(0, y - 1, 56, "5"); for (let x = 4; x < 56; x += 12) p.rect(x, y - 2, 2, 3, "4") }
    // the gate to Jade Row at the arm's foot: its tiled roof from above, the ridge, the Lull screen's back over it
    { const x0 = AX0 - 6, w = AX1 - AX0 + 12
      for (let y = 505; y < H; y++) for (let x = x0; x < x0 + w; x++) p.px(x, y, (y - 505) % 4 === 0 ? "k" : ((x + ((y - 505) >> 2) * 3) % 6 === 0 ? "o" : lit("op", 0.35, x, y)))
      p.rect(x0, 505, w, 2, "E"); p.rect(x0 - 2, 520, w + 4, 3, "k"); p.hline(x0 - 2, 521, w + 4, "E")
      p.rect(AX0 + 30, 524, 80, 12, "k"); p.rect(AX0 + 31, 525, 78, 10, "2"); for (let i = AX0 + 34; i < AX0 + 108; i += 4) p.vline(i, 527, 6, "1"); p.hline(AX0 + 31, 534, 78, "c") }
  }
  street()

  // ======== over the people: cables, lanterns, strings of bulbs, awnings, blade signs, the facades' AC units ========
  const over = () => {
    // power and data cables from facade to facade, slack; a junction box on one
    for (const [x0, y0, x1, y1] of [[96, NF - 2, 128, SF + 2], [330, NF - 2, 300, SF + 2], [450, NF - 2, 410, SF + 2], [690, NF - 2, 640, SF + 2], [AX0 - 1, 380, AX1 + 1, 400], [AX0 - 1, 300, AX1 + 1, 280], [560, NF - 2, 586, SF + 2]]) q.line(x0, y0, x1, y1, "k")
    q.rect(312, 196, 6, 5, "k"); q.rect(313, 197, 4, 3, "3"); q.px(314, 197, "v")
    // the three cables with their paper lanterns: from above a round paper top, its wire cap, the light inside
    for (const [x0, y0, x1, y1] of CABLES) q.line(x0, y0, x1, y1, "1")
    for (const [x, y] of LANTERNS) { q.disc(x, y, 5, "k"); q.disc(x, y, 4, "P"); q.disc(x, y, 3, "Q"); q.disc(x - 1, y - 1, 1, "R"); q.px(x, y, "O"); q.px(x + 2, y + 2, "P") }
    // the strings of bulbs
    for (const [x0, y0, x1, y1] of STRINGS) q.line(x0, y0, x1, y1, "1")
    for (const [x, y, k] of BULBS) { q.px(x, y, k); q.px(x + 1, y, { m: "M", v: "C", Q: "P", 0: "9" }[k]) }
    // REPAIR's awning: a blue tarp on poles, its light box on the front edge
    q.rect(66, 280, 80, 10, "k"); q.rect(67, 281, 78, 9, "U"); for (let x = 70; x < 145; x += 10) q.vline(x, 281, 9, "u"); q.hline(67, 281, 78, "u")
    { const w = TXT.measure("REPAIR", "hud"); q.rect(106 - (w >> 1) - 2, 281, w + 4, 7, "k"); q.rect(106 - (w >> 1) - 1, 282, w + 2, 5, "c"); TXT.draw(q, 106, 282, "REPAIR", "v", { font: "hud", align: "center" }) }
    // the noodle bar's awning: canvas in two browns, the rain gutter on its edge, NOODLES painted on it, the kitchen's flue through it
    q.rect(150, 267, 120, 23, "k"); for (let x = 151; x < 269; x++) q.vline(x, 268, 22, fl((x - 151) / 8) % 2 ? lit("OP", 0.5, x, 278) : lit("PQ", 0.45, x, 278))
    q.hline(151, 268, 118, "Q"); q.hline(151, 269, 118, "k")
    { const w = TXT.measure("NOODLES", "nagiwa"); q.rect(210 - (w >> 1) - 3, 273, w + 6, 11, "O"); TXT.draw(q, 210, 275, "NOODLES", "R", { font: "nagiwa", align: "center", outline: "o" }) }
    q.disc(258, 280, 3, "k"); q.disc(258, 280, 2, "4"); q.px(258, 280, "k")
    // KARAOKE's canopy: violet, a neon tube round its edge, its name in small letters
    q.rect(290, 280, 112, 10, "k"); q.rect(291, 281, 110, 9, "8"); q.hline(291, 281, 110, "0"); q.vline(291, 281, 9, "0"); q.vline(400, 281, 9, "0")
    TXT.draw(q, 346, 283, "KARAOKE * KTV", "7", { font: "hud", align: "center" })
    // the 24-hour shop's awning: white, 24H on it, its light strip on the edge
    q.rect(661, 273, 118, 17, "k"); q.rect(662, 274, 116, 15, "H"); q.hline(662, 274, 116, "V"); for (let x = 664; x < 778; x += 12) q.vline(x, 275, 13, "h")
    { const w = TXT.measure("24H", "nagiwa"); q.rect(720 - (w >> 1) - 3, 276, w + 6, 11, "V"); TXT.draw(q, 720, 278, "24H", "C", { font: "nagiwa", align: "center" }) }
    q.hline(662, 289, 116, "v")
    // Lerche's canopy over its door: a concrete slab, its drip edge, a lamp under it seen as a glow at the edge
    q.rect(734, NF, 52, 15, "k"); q.rect(735, NF, 50, 14, lit("456", 0.4, 760, 128)); q.hline(735, NF + 13, 50, "6"); q.px(760, NF + 13, "R"); q.px(759, NF + 13, "Q"); q.px(761, NF + 13, "Q")
    // blade signs sticking out from the facades: from above their top edge, the tube on it, a cap of light
    const blade = (x, y, dx, dy, len, hue) => {
      const N = NEON[hue], x1 = x + dx * len, y1 = y + dy * len, wx = dx ? 0 : 1, wy = dy ? 0 : 1
      for (let t = 0; t <= len; t++) { const X = x + dx * t, Y = y + dy * t; q.rect(X - wx * 2, Y - wy * 2, 1 + wx * 4, 1 + wy * 4, "k"); q.rect(X - wx, Y - wy, 1 + wx * 2, 1 + wy * 2, "2"); q.px(X, Y, t % 2 ? N[2] : N[3]) }
      q.rect(x1 - 2, y1 - 2, 5, 5, "k"); q.rect(x1 - 1, y1 - 1, 3, 3, N[1]); q.px(x1, y1, N[3])
    }
    blade(162, SF, 0, -1, 30, "m"); blade(402, SF, 0, -1, 22, "c"); blade(252, SF, 0, -1, 12, "w")
    blade(446, NF, 0, 1, 16, "c"); blade(606, NF, 0, 1, 16, "m"); blade(AX0, 422, 1, 0, 24, "p"); blade(AX1, 300, -1, 0, 18, "m")
    // EEL & RICE on its wire across the street: a board hung flat, the tubes, an arrow to the west (down to the fish market)
    { const { x, y, t } = EEL, w = TXT.measure(t, "nagiwa"), N = NEON.w
      q.line(x + 4, NF - 2, x - 6, SF + 2, "k"); q.line(x + w + 10, NF - 2, x + w + 2, SF + 2, "k")
      q.rect(x - 3, y - 3, w + 22, 13, "k"); q.rect(x - 2, y - 2, w + 20, 11, "1")
      TXT.draw(q, x + 12, y, t, N[2], { font: "nagiwa", outline: N[0] }); TXT.draw({ px: (X, Y) => { if ((X + Y) % 3 === 0) q.px(X, Y, N[3]) } }, x + 12, y, t, "", { font: "nagiwa" })
      q.grid(x, y, ["...Q", "..QQ", ".QQQQQQQ", "QQQQQQQQ", ".QQQQQQQ", "..QQ", "...Q"], { Q: N[2] }) }
    // the shut shop's sign, its tube broken: dark but one stroke
    q.rect(464, SF - 18, 5, 18, "k"); q.rect(465, SF - 17, 3, 16, "2"); q.vline(466, SF - 9, 6, "9")
    // AC units hung on the facades over the sidewalks, their drips (the stains are the picture's)
    for (const x of [140, 290, 664, 380]) { ac(x, NF - 2, q); for (let y = NF + 14; y < NF + 20; y++) darken(x + 3, y + 2) }
    for (const x of [124, 560]) { ac(x, SF - 12, q); darken(x + 3, SF - 14) }
  }
  over()

  // the street's lamps as the runtime light, so Juno takes on the neon she walks under (the roofs' own stay in the picture)
  const HEX = { w: "#eea040", m: "#ff4fd3", c: "#62def0", p: "#a87cff" }
  const RUNTIME = LAMPS.filter(([, , , r, st, lv]) => lv === "s" && st >= 0.3).map(([x, y, hue, r, st, lv, hw, hh]) => [x, y, HEX[hue], R(r + Math.max(hw, hh) * 0.6)])
  return { W, H, NF, SF, AX0, AX1, OCC, walk, BASE, OVER, inB, RUNTIME }
})()

{
  const ih = ISO.ihash, bay = ISO.bay
  const blob = (c, x, y, rx, ry, k) => { c.ellipse(x, y, rx + 1, ry + 1, "k"); c.ellipse(x, y, rx, ry, k) }
  anim("weg1_homeless", { w: 45, h: 24, ms: [500, 500, 500, 500, 500, 260] }, (c) => {
    const f = c.frame ?? 0
    // he lies on his side under a blanket, his head to the west, his knees drawn up
    c.rect(5, 4, 17, 17, "k"); c.rect(6, 5, 15, 15, "u"); c.rect(7, 6, 13, 3, f === 2 ? "U" : "u")
    for (let y = 7; y < 19; y += 3) c.hline(8, y, 11, "o")
    blob(c, 13, 5, 3, 3, "s"); c.px(12, 4, "1"); c.px(14, 4, "1")
    // the cart, its handle to him, the old screens in it
    c.rect(28, 2, 17, 22, "k"); c.rect(29, 3, 15, 20, "4"); c.hline(27, 1, 19, "5")
    for (const [x, y] of [[31, 5], [37, 5], [31, 13], [37, 13]]) { c.rect(x, y, 5, 6, "k"); c.rect(x, y, 4, 5, "1") }
    if (f === 5) { c.rect(37, 13, 4, 5, "J"); c.hline(37, 16, 4, "F"); c.px(39, 14, "K") }       // CAM 25's landing, for a beat
    else for (let y = 13; y < 18; y++) for (let x = 37; x < 41; x++) c.px(x, y, ih(x + f * 7, y) < 0.45 ? "6" : "3")   // static
  })
  const sheep = (c, f, awake) => {
    blob(c, 15, 16, awake ? 12 : 12 + (f % 2), 11, "H")                                         // the woolly body
    for (let y = 6; y < 27; y++) for (let x = 4; x < 27; x++) if (c.key(x, y) === "H" && bay(x, y) < 0.18) c.px(x, y, "G")
    if (!awake) {
      const ny = f === 3 ? 8 : 7
      blob(c, 15, ny, 6, 5, "1"); c.px(9, ny - 4, "H"); c.px(21, ny - 4, "H"); c.px(10, ny - 3, "H"); c.px(20, ny - 3, "H")   // the sheep's head, its ears
      c.px(13, ny + 2, "3"); c.px(17, ny + 2, "3")                                                 // its button eyes, shut
    } else {
      blob(c, 15, 8, 4, 4, "o"); c.px(14, 6, "p")                                                 // his own head, bare: dark hair
      blob(c, 26, 18, 4, 4, "H"); c.ellipse(27, 18, 2, 2, "1")                                    // the sheep's head under his arm
      const fx = f ? 0 : 2; c.rect(fx, 21, 6, 5, "k"); c.rect(fx + 1, 22, 4, 3, "C")              // a flyer held out
    }
  }
  anim("weg1_sheep", { w: 30, h: 30, ms: [900, 900, 900, 500] }, (c) => sheep(c, c.frame ?? 0, false))
  anim("weg1_sheep2", { w: 30, h: 30, ms: [700, 700] }, (c) => sheep(c, c.frame ?? 0, true))
  anim("weg1_robot", { w: 15, h: 15, frames: 4, fps: 6 }, (c) => {
    const f = c.frame ?? 0
    blob(c, 7, 7, 6, 6, "5"); c.ellipse(7, 7, 4, 4, "6"); c.ellipse(6, 6, 1, 1, "H")
    const [lx, ly] = [[7, 2], [12, 7], [7, 12], [2, 7]][f]; c.px(lx, ly, "V"); c.px(7, 7, "v")   // its light going round
  })
  anim("weg1_drone", { w: 21, h: 21, frames: 4, fps: 12 }, (c) => {
    const f = c.frame ?? 0
    for (const [x, y] of [[4, 4], [16, 4], [4, 16], [16, 16]]) {                               // the rotors, a pale blur with an ink edge
      c.ellipse(x, y, 4, 4, "k"); c.ellipse(x, y, 3, 3, f % 2 ? "6" : "5"); c.px(x + (f % 2 ? 2 : -2), y + (f < 2 ? -2 : 2), "H")
    }
    c.line(5, 5, 15, 15, "k"); c.line(15, 5, 5, 15, "k"); c.line(6, 5, 15, 14, "G"); c.line(14, 5, 5, 14, "G")   // the arms
    for (const [x, y] of [[4, 4], [16, 4], [4, 16], [16, 16]]) c.px(x, y, "G")                // the hubs
    c.rect(7, 7, 7, 7, "k"); c.rect(8, 8, 5, 5, "P"); c.hline(8, 10, 5, "O"); c.vline(10, 8, 5, "O")   // the parcel, tied
    if (f === 0) c.px(10, 6, "v")                                                               // its light
  })
}

{
  const blit = (c, buf) => {
    for (let j = 0; j < W1.H; j++) {
      let run = 0, rk = null
      const flush = (i) => { if (rk) c.rect(i - run, j, run, 1, rk); run = 0; rk = null }
      for (let i = 0; i < W1.W; i++) { const k = buf[j * W1.W + i]; if (k !== rk) { flush(i); rk = k ?? null } if (rk) run++ }
      flush(W1.W)
    }
  }
  sprite("weg1_bg", { w: W1.W, h: W1.H }, (c) => blit(c, W1.BASE))
  sprite("weg1_over", { w: W1.W, h: W1.H }, (c) => blit(c, W1.OVER))
  // both together, to look at (not built into the game: the atlas takes weg1_bg and weg1_over)
  scene("_weg1_view", { w: W1.W, h: W1.H, bg: "k" }, (c) => { blit(c, W1.BASE); blit(c, W1.OVER) })
}
console.log("PARTS " + JSON.stringify({ room: "weg1", size: [W1.W, W1.H], parts: [], lamps: W1.RUNTIME }))
console.log("WEG1_LAYOUT " + JSON.stringify({ size: [W1.W, W1.H], NF: W1.NF, SF: W1.SF, AX: [W1.AX0, W1.AX1], occ: W1.OCC }))
