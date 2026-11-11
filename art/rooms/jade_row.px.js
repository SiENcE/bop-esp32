// Jade Row painted, on the lines of its approved blocks (art/old/jade_row_blocks.px.js, formerly art/mock; the user approved them as
// the base on 2026-11-11: "ja, darauf malen"), but for one change the user asked for once it was painted: Okonkwo's shop needs more
// space, so it takes the whole near left-hand wall (SHOP0 to SHOP1), a window of one pane, the door, a window of three panes, and
// its sign over the whole front. The lane seen down its length, one vanishing point at (160, 80), 30 px to the metre where Juno walks (z = 1).
// The projection bP, the constants and the place and size of everything are the mock's; game/places.js (jade_row) measured its
// hotspots and the walk area from there, so nothing here moves. The painting adds material, light and detail:
//
//   jade_row_bg      320x180, the still picture with every part's frame 0 painted in. Left: Okonkwo's shop over the whole near wall
//                    (the window onto his shelves, sacks of rice and the counter in three panes, the open door, the sign along it), the balcony over it (a man smoking behind his washing), the arcade's two
//                    SUMP RUNNER cabinets, the MAHJONG parlour. Right: the arch back to Kowalski Street (the street's cyan down it), the
//                    machine SMILE FOR A COUPON across from the shop's window (its little camera turned to it), HOT SOUP, the
//                    pharmacy, the tall signs, NIGHT MARKET high on the wall. At the end the JADE ROW gate, the passage through the
//                    last block behind it, and the big screen over it (LULL, FREE). Lanterns (amber), neon and cables over the lane;
//                    the lane wet, puddles in the gutters and the wheel ruts mirroring what stands over them.
//   jade_row_<part>  small anims, each opaque over its own rect (the background's pixels with the moving thing on them), drawn at
//                    their top left over the background, under everyone (the PARTS line below; tools/build_art.sh writes it to
//                    art/rooms/jade_row.parts.json): the screen (36 frames: the Lull patch keeps its beat, Nagiwa.lullBeat), NIGHT
//                    MARKET (24: a stroke stutters), the near lantern, the machine's LED, the arcade screens, the smoker's smoke,
//                    the soup's steam, the gate's neon.
//   jade_row_steam   48x64, 12 frames at 10 fps, top left at [108, 40]: the steam off the far cart's pot, lit by the gate's magenta.
//   jade_row_crowd   320x32, top left at [0, 148]: an umbrella and a head passing along the near edge, over everyone.
//   jade_row_car     34x26, top left at [156, 86] (its bottom's middle at (17, 21)): the car parked facing us, its lamps on.
//
// How: the picture is painted into a buffer of palette keys with a depth for every pixel (what stands where), lit by the lamps in
// metres (the walls and the floor take the colour of the light that reaches them most, dithered only where it falls off), then
// the wet floor mirrors what the depth says stands over it, and the glows are added as pxl's glow() adds them (same formula), in
// colour. Each frame is the whole picture again; a part is its rect cut out of it, so a part always matches its background.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  b: "#6e4630",                       // concrete and paving in strong warm light (as the Drain Market's)
  d: "#64265e",                       // in strong magenta light
  l: "#1f5e74",                       // in strong cyan light
  o: "#2e2019", p: "#4e3526",         // old wood, lacquer in shadow: frames, the shop's sign, the counter, the gate's roof
  K: "#c8b48c",                       // paper: posters, the coupon
  "¦": "#8c7a62", "¬": "#5f4c3b",     // the sign's paint where it only half covers the board (its letters' soft edge)
})

const JR = (() => {
  const W = 320, H = 180, R = Math.round, fl = Math.floor, clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const bay = ISO.bay, ih = ISO.ihash
  // ---------------------------------------------------------------- the mock's projection (art/mock/jade_row.px.js, B and bP)
  const VX = 160, VY = 80, EYE = 70, HALF = 105, END = 4.4
  const bP = (m, z, h = 0) => [R(VX + m * 30 / z), R(VY + EYE / z - h * 30 / z)]
  const footY = (z) => VY + EYE / z
  // the palette as colours (art/lib/iso.js and the keys above), for the glow and the parts
  const HEX = {
    k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
    e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",
    n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2", O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
    c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff", r: "#7e1420", q: "#ff3a3a", j: "#9a7406", y: "#eec414", Y: "#fff070",
    s: "#93583f", S: "#d79676", g: "#565e70", G: "#8e96a8", u: "#30264c", U: "#4d3f78", h: "#7d8ca4", H: "#b9c6d8",
    a: "#2c2026", A: "#4a3026", i: "#2a1636", I: "#46204e", t: "#11303d", T: "#1b495a", w: "#3a4c64", x: "#6c809a",
    b: "#6e4630", d: "#64265e", l: "#1f5e74", o: "#2e2019", p: "#4e3526", K: "#c8b48c", "¦": "#8c7a62", "¬": "#5f4c3b",
  }
  const RGB = Object.fromEntries(Object.entries(HEX).map(([k, h]) => [k, [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]]))

  // ---------------------------------------------------------------- the buffer: a key and a depth for every pixel
  const KB = new Array(W * H), ZB = new Float32Array(W * H), WET = new Uint8Array(W * H)
  let CZ = 99                                                   // the depth of what is being drawn (99: nothing, -1: the floor)
  const put = (x, y, k) => { x = Math.round(x); y = Math.round(y); if (k && x >= 0 && y >= 0 && x < W && y < H) { const i = y * W + x; KB[i] = k; ZB[i] = CZ } }
  const get = (x, y) => (x >= 0 && y >= 0 && x < W && y < H ? KB[y * W + x] : null)
  const c = ISO.pen({ px: put, key: get, is: (x, y, ks) => { const k = get(x, y); return !!k && ks.includes(k) } })
  const at = (z) => { CZ = z }
  let F = 0                                                     // the frame being painted

  // ---------------------------------------------------------------- light, in metres: m across, z deep (3.2 m a step), h up
  const LAMPS = []
  const lamp = (m, z, h, fam, p, r) => LAMPS.push({ m, z, h, fam, p, r })
  const fromScreen = (x, y, z) => [(x - VX) * z / 30, (VY + EYE / z - y) * z / 30]
  const lampAt = (x, y, z, fam, p, r) => { const [m, h] = fromScreen(x, y, z); lamp(m, z, h, fam, p, r) }
  /** the light reaching a surface point by colour; (nm, nh) its normal across and up */
  const lightAt = (m, z, h, nm, nh) => {
    const o = { w: 0, m: 0, c: 0 }
    for (const L of LAMPS) {
      const dm = L.m - m, dz = (L.z - z) * 3.2, dh = L.h - h, d = Math.hypot(dm, dz, dh)
      if (d >= L.r) continue
      const cos = d > 0.01 ? (dm * nm + dh * nh) / d : 1
      if (cos < -0.15) continue
      o[L.fam] += L.p * (1 - d / L.r) ** 2 * (nh ? 0.3 + 0.7 * Math.max(0, cos) : 0.06 + 0.94 * Math.max(0, cos))   // a wall barely takes light from a lamp in its own plane
    }
    return o
  }
  const tone = (ramp, v, x, y) => { const s = fl(v), f = v - s; return ramp[clamp(f < 0.38 ? s : f > 0.62 ? s + 1 : s + (bay(x, y) < (f - 0.38) / 0.24 ? 1 : 0), 0, ramp.length - 1)] }
  const WALL = { n: ["k", "1", "2", "3", "4", "5"], w: ["k", "1", "a", "A", "b", "P"], m: ["k", "1", "i", "I", "d", "M"], c: ["k", "1", "t", "T", "l", "C"] }
  const FLOOR = { n: ["k", "e", "f", "z", "Z", "X"], w: ["k", "e", "a", "A", "b", "P"], m: ["k", "e", "i", "I", "d", "M"], c: ["k", "e", "t", "T", "l", "C"] }
  /** a surface of darkness v0 (a step of its ramp) in the light o: the colour of the strongest light, the level of all of it */
  const surf = (v0, o, x, y, set = WALL, gain = 2.3) => {
    let fam = "n", best = 0.05
    const b = bay(x + 2, y + 1)
    for (const f of ["w", "m", "c"]) { const s = o[f] * (0.9 + 0.2 * b); if (s > best) { best = s; fam = f } }
    return tone(set[fam], v0 + Math.min(o.w + o.m + o.c, 1.5) * gain, x, y)
  }
  const add = (o, fam, p) => { o[fam] += p; return o }

  // ---------------------------------------------------------------- the glyphs of the tall signs (the mock's)
  const G9 = {
    mi: ["....#....", ".#..#..#.", "..#.#.#..", "....#....", "#########", "....#....", "..#.#.#..", ".#..#..#.", "#...#...#"],
    dian: ["....#....", ".#######.", ".#..#..#.", ".#######.", ".#..#..#.", ".#######.", "....#...#", "....#...#", "....#####"],
    an: ["....#....", "#########", "#.......#", "...#.....", "#########", "..#...#..", ".#.#.#...", "...##....", ".##..##.."],
    shui: ["....#....", "....#...#", "#.#.#..#.", ".#..#.#..", ".#..##...", ".#..#.#..", "#...#..#.", "....#...#", "...##...."],
    ye: ["....#....", "#########", "..#..#...", ".#.####..", "#...#.#..", ".#.#.#...", ".#..##...", ".#.#.#...", ".##...##."],
    shi: ["....#....", "#########", "....#....", ".#######.", ".#..#..#.", ".#..#..#.", ".#..#.##.", "....#....", "....#...."],
    zh: ["....#....", "....#....", "#########", "#...#...#", "#...#...#", "#########", "....#....", "....#....", "....#...."],
    tang: ["#.#######", ".#....#..", "...#####.", "#...#.#.#", ".#.#..#.#", ".#...#..#", "#...#...#", "...#...#.", "..#..##.."],
  }
  const glyph = (x, y, id, k, n = 1) => G9[id].forEach((row, j) => [...row].forEach((ch, i) => { if (ch === "#") c.rect(x + i * n, y + j * n, n, n, k) }))
  /** text in the game's hud font, its pixels handed to put(x, y) (so it can be bent onto a slope) */
  const textPx = (s, font = "hud") => { const out = []; TXT.draw({ px: (x, y) => out.push([x, y]) }, 0, 0, s, "k", { font }); return out }

  // ---------------------------------------------------------------- the parts: what moves, each its own rect (never overlapping)
  const PARTS = [
    { name: "screen", x: 136, y: 2, w: 49, h: 49, frames: 36 },
    { name: "gate", x: 130, y: 51, w: 60, h: 16, frames: 12 },
    { name: "night", x: 206, y: 0, w: 56, h: 74, frames: 24 },
    { name: "lantern", x: 0, y: 0, w: 46, h: 50, frames: 12 },
    { name: "smoke", x: 76, y: 4, w: 20, h: 30, frames: 12 },
    { name: "arcade", x: 106, y: 82, w: 25, h: 30, frames: 12 },
    { name: "machine", x: 226, y: 82, w: 16, h: 60, frames: 12 },
    { name: "soup", x: 204, y: 74, w: 22, h: 30, frames: 12 },
    // the lane's wet floor, its mirrored light trembling (the user's wish, 2026-11-11): the open road and the right-hand kerb below
    // the machine, 20 frames (two seconds)
    { name: "wet", x: 40, y: 113, w: 186, h: 67, frames: 20 },
    { name: "wet_kerb", x: 226, y: 143, w: 78, h: 37, frames: 20 },
  ]
  const ph = (name) => F % PARTS.find((p) => p.name === name).frames

  // ---------------------------------------------------------------- the lamps (the painted sources; the runtime lamps are the big ones)
  lamp(-3.2, 0.74, 1.4, "w", 0.85, 1.8); lamp(-3.2, 1.38, 1.4, "w", 0.85, 1.8)   // Okonkwo's windows, either side of his door
  lamp(-3.1, 0.95, 1.0, "w", 1.15, 2.3)                          // his open door
  lamp(-3.3, 1.08, 3.9, "w", 0.7, 1.7)                           // the balcony door over it
  lamp(-3.3, 0.86, 2.95, "w", 0.5, 1.2); lamp(-3.3, 1.3, 2.95, "w", 0.5, 1.2)   // the two small lamps over his sign
  lamp(3.15, 1.66, 1.35, "w", 1.1, 2.8)                          // HOT SOUP
  lamp(3.3, 2.6, 1.2, "c", 0.6, 1.6)                             // the pharmacy
  lamp(2.65, 1.15, 1.4, "c", 0.75, 1.5)                          // the machine's screen, toward the lane
  lamp(3.6, 0.75, 1.2, "c", 0.9, 1.8)                            // the street's light through the arch
  lamp(3.2, 1.5, 4.1, "m", 1.0, 3.0)                             // NIGHT MARKET
  for (const m of [-2.2, 0, 2.2]) lamp(m, 1.8, 5.5, "m", 0.45, 3.6)   // the magenta strip across
  for (const m of [-2.4, 0, 2.4]) lamp(m, 1.16, 4.9, "c", 0.2, 1.8)  // the cyan duct across
  lamp(0, 4.4, 1.6, "m", 0.9, 2.6)                               // the gate's neon, the passage's glow
  lamp(0, 4.6, 5.0, "c", 0.9, 4.0)                               // the big screen
  lamp(-3.2, 2.8, 1.0, "m", 0.5, 1.3)                            // the parlour's curtain
  lamp(-2.9, 2.25, 1.2, "c", 0.4, 1.1); lamp(-2.9, 1.85, 1.2, "c", 0.45, 1.2)   // the arcade screens
  lampAt(18, 14, 0.72, "w", 0.75, 1.7); lampAt(302, 10, 0.8, "w", 0.6, 1.5)     // the two big lanterns near us

  // ---------------------------------------------------------------- the far end: sky between the roofs, the last block, the screen, the gate
  const sky = () => {
    at(40)
    for (let y = 0; y < 40; y++) for (let x = 112; x < 210; x++) {
      if (x >= 136 && x < 184) continue
      // the city's towers beyond, darker than the low cloud the city lights from below
      const tower = (x < 136 ? [[112, 121, 14], [121, 128, 6], [128, 136, 19]] : [[184, 190, 11], [190, 199, 3], [199, 210, 16]]).find(([a, b]) => x >= a && x < b)
      if (tower && y >= tower[2]) { const win = (x % 3 === 1) && ((y - tower[2]) % 4 === 2) && ih(x, y) < 0.22; put(x, y, win ? (ih(y, x) < 0.5 ? "P" : "C") : x === tower[0] ? "2" : "1"); continue }
      put(x, y, tone(["k", "k", "1", "i"], 0.6 + y / 40 * 1.6, x, y))
    }
  }
  const SCR = { x: 138, y: 4, w: 44, h: 44 }
  const screen = () => {
    at(4.5)
    const { x, y, w, h } = SCR
    c.rect(x - 2, y - 2, w + 4, h + 4, "k"); c.rect(x - 1, y - 1, w + 2, h + 2, "2")              // the bezel
    const band = (ph("screen") * 47 / 36) % 47 - 2                                               // the refresh rolling down
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const roll = Math.abs(j - band) < 1.5 && j > 1 && j < h - 2 && i > 1 && i < w - 2
      put(x + i, y + j, roll ? "C" : j % 2 ? "t" : "c")
    }
    // the face asleep, lit from the side: cheek, closed eyes, a small smile; hair over the forehead
    const cx = x + R(w * 0.27), cy = y + R(h * 0.5), rx = R(h * 0.22), ry = R(h * 0.3)
    for (let b = -ry; b <= ry; b++) for (let a = -rx; a <= rx; a++) {
      const d = (a / (rx + 0.5)) ** 2 + (b / (ry + 0.5)) ** 2
      if (d > 1) continue
      const lit = -a / rx * 0.5 - b / ry * 0.35 + (1 - d) * 0.6
      put(cx + a, cy + b, b < -ry * 0.55 ? (d > 0.8 ? "C" : "c") : lit > 0.55 ? "V" : lit > 0.05 ? "v" : "C")
    }
    for (const [ex] of [[cx - R(rx * 0.55)], [cx + R(rx * 0.15)]]) { c.hline(ex, cy - 3, R(rx * 0.4), "c"); put(ex - 1, cy - 4, "c"); put(ex + R(rx * 0.4), cy - 4, "c") }   // lids shut, a lash at each end
    c.hline(cx - 2, cy + R(ry * 0.45), 4, "C"); put(cx - 3, cy + R(ry * 0.45) - 1, "C"); put(cx + 2, cy + R(ry * 0.45) - 1, "C")
    put(cx - 1, cy + 1, "C"); put(cx - 1, cy + 2, "v")                                           // the nose's shadow
    // the patch behind the ear: Teo's oval disc, darker rim, a brighter stripe; it keeps Lull's beat (long, short, short, long, rest)
    const t = (ph("screen") * 100) % 3600, on = t < 800 || (t >= 1100 && t < 1350) || (t >= 1650 && t < 1900) || (t >= 2200 && t < 3000)
    const px = cx + rx + 2
    for (let b = -4; b <= 4; b++) for (let a = -2; a <= 2; a++) {
      const d = (a / 2.5) ** 2 + (b / 4.5) ** 2
      if (d > 1) continue
      put(px + a, cy + b, d > 0.6 ? (on ? "v" : "C") : a === 0 && Math.abs(b) < 3 ? (on ? "V" : "v") : on ? "V" : "C")
    }
    // the week's offer
    TXT.draw(c, x + R(w * 0.72), y + 5, "LULL", "V", { font: "hud", align: "center" })
    TXT.draw(c, x + R(w * 0.72), y + 13, "FREE", "V", { font: "hud", align: "center" })
    c.hline(x + R(w * 0.72) - 7, y + 20, 15, "C")
    // its brackets on the wall
    for (const bx of [x + 6, x + w - 8]) { put(bx, y + h + 2, "4"); put(bx + 1, y + h + 2, "4") }
  }
  const endBlock = () => {
    at(END)
    const [lx, fy] = bP(-3.5, END), [rx] = bP(3.5, END)
    // the facade facing us: concrete, its storeys' slabs, windows where the screen leaves any
    for (let y = 0; y < fy; y++) for (let x = lx; x < rx; x++) {
      const o = lightAt((x - VX) * END / 30, END + 0.05, (fy - y) * END / 30, 0, 0)
      put(x, y, surf((y % 12 === 0 ? 2.9 : 2.0), o, x, y))
    }
    for (const [wx, wy] of [[142, 0], [160, 0]]) { c.rect(wx, wy, 16, 2, "k"); c.rect(wx + 1, wy, 14, 1, ih(wx, 3) < 0.5 ? "Q" : "1") }
    screen()
    // the passage through the block behind the gate: its walls closing in to the light at the far end, the market beyond
    const PZ = 9.5
    for (let y = 50; y < fy; y++) for (let x = lx + 6; x < rx - 6; x++) {
      const dx = Math.abs(x - VX), zw = dx > 0 ? 1.47 * 30 / dx : 99                         // the passage's side walls, 1.47 m out
      const zf = y > VY ? EYE / (y - VY) : 99                                                 // its floor
      const zc = y < VY ? (4.8 - EYE / 30) * 30 / (VY - y) : 99                                // its ceiling, 4.8 m up
      const zh = Math.min(zw, zf, zc)
      at(Math.min(zh, PZ))
      if (zh >= PZ) {
        // the far opening: the market's haze, a lit sign, people as shapes against it
        const q = (y - 70) / 20
        put(x, y, Math.abs(x - 157) < 1 && y > 81 && y < 87 ? "i" : Math.abs(x - 163) < 1 && y > 82 && y < 87 ? "i" : y < 76 && (x === 158 || x === 159) ? "N" : tone(["I", "d", "M", "M"], 2.4 - q * 1.6, x, y))
        continue
      }
      const glowT = (zh - END) / (PZ - END)                                                    // the light grows toward the far end
      if (zh === zf) { put(x, y, (x + y) % 2 === 0 && glowT > 0.5 ? "I" : tone(["e", "i", "I"], glowT * 2.2, x, y)); WET[y * W + x] = 0; continue }
      if (zh === zc) { put(x, y, tone(["k", "1", "i"], glowT * 2, x, y)); continue }
      // the walls: lanterns in a row along each, tiny with distance
      const hh = EYE / 30 + (VY - y) * zh / 30, alongs = zh * 2.2
      if (Math.abs(hh - 3.0) < 0.12 && Math.abs(alongs % 1 - 0.5) < 0.12) { put(x, y, "Q"); continue }
      put(x, y, tone(["1", "i", "I", "d"], glowT * 2.6 + (hh < 2.2 && fl(alongs * 2) % 2 ? 0.5 : 0), x, y))
    }
    at(END)
    gate(lx + 8, 50, rx - lx - 16, fy - 60)
  }
  /** the gate facing us: lacquered posts on stone, the beam, its little tiled roof, the name in neon */
  const gate = (x, y, w, h) => {
    for (const px of [x, x + w - 6]) {
      for (let j = 0; j < h; j++) for (let i = 0; i < 6; i++) {
        const e = y + 10 + h - 1 - j
        const k = j < 5 ? (i === 0 || j === 4 ? "4" : i === 5 ? "2" : "3") : i < 2 ? "n" : i === 2 ? "d" : i === 5 ? "n" : "M"   // a stone plinth, the post's shaded and lit faces
        put(px + i, e, k)
      }
    }
    // the roof: tiles in ribs, the ridge, the eaves turning up at the ends
    for (let i = -6; i < w + 6; i++) {
      const X = x + i, end = i < -3 || i >= w + 3
      put(X, y, end ? "k" : "o"); put(X, y + 1, i % 2 ? "o" : "p"); put(X, y + 2, i % 2 ? "o" : "p"); put(X, y + 3, i % 2 ? "p" : "o"); put(X, y + 4, "d")   // the eave lit from the neon under it
    }
    for (const [ex, dir] of [[x - 6, -1], [x + w + 5, 1]]) { put(ex, y, "o"); put(ex, y + 1, "p"); put(ex + dir, y, "k") }
    // the beam, lacquered, its lower edge in shadow
    c.rect(x - 2, y + 5, w + 4, 7, "M"); c.hline(x - 2, y + 5, w + 4, "d"); c.hline(x - 2, y + 11, w + 4, "n")
    // the plate with the name: dark, the letters neon; one letter stutters (the part "gate")
    c.rect(x + R(w / 2) - 25, y + 6, 50, 6, "n")
    const g = ph("gate"), off = g === 7 || g === 9
    const pts = textPx("JADE ROW"), tw = Math.max(...pts.map((p) => p[0])) + 1
    for (const [px, py] of pts) { const X = x + R(w / 2) - fl(tw / 2) + px; put(X, y + 6 + py, off && px >= 20 && px < 23 ? "d" : "m") }
  }

  // ---------------------------------------------------------------- the floor: paving on the walks, asphalt between, the kerbs' strips, water
  const puddleAt = (m, z) => {
    // where water lies: the gutters along both kerbs, the wheel ruts of the car's lane, a dip in the middle near us, a sunk slab
    const edge = Math.sin(z * 23 + m * 3) * 0.05 + Math.sin(z * 51) * 0.03
    if (Math.abs(Math.abs(m) - 2.47) < 0.1 + edge && z > 0.8 && z < 3.8 && Math.sin(z * 7 + (m > 0 ? 1 : 0)) > -0.75) return true
    for (const rm of [0.75, 1.55]) if (Math.abs(m - rm) < 0.17 + edge && z > 1.55 && z < 3.9 && Math.sin(z * 7.5 + rm) > -0.2) return true
    if (((m + 0.5) / 0.95) ** 2 + ((z - 1.02) / 0.075) ** 2 < 1 + edge * 4) return true
    if (((m - 3.0) / 0.32) ** 2 + ((z - 0.84) / 0.045) ** 2 < 1 + edge * 4) return true
    if (((m + 1.5) / 0.55) ** 2 + ((z - 1.75) / 0.13) ** 2 < 1 + edge * 4) return true
    return false
  }
  const floor = () => {
    at(-1)
    for (let y = VY + 1; y < H; y++) {
      const z = EYE / (y - VY)
      if (z > END) continue
      for (let x = 0; x < W; x++) {
        const m = (x - VX) * z / 30
        if (Math.abs(m) >= 3.5) continue
        const i = y * W + x, walk = Math.abs(m) > 2.6, kerb = Math.abs(Math.abs(m) - 2.6)
        const o = lightAt(m, z, 0, 0, 1)
        WET[i] = 1
        if (kerb < 0.05 * z) {                                                                 // the kerb's strip: a stretch of it dead here and there
          put(x, y, ih(fl(z * 6), m < 0 ? 1 : 2) < 0.2 ? "X" : "v"); WET[i] = 0; continue
        }
        if (!walk && kerb < 0.42) add(o, "c", 0.42 * (1 - kerb / 0.42) ** 2)                  // its light on the wet road
        if (walk) {
          // slabs half a metre across, a quarter step deep; one sunk and one cracked where the carts turn in to the soup
          const sm = Math.abs(m) * 2, sz = z * 4, jm = sm % 1, jz = sz % 1
          const joint = jm < 0.07 * z || jz < 0.06 * z * 1.4
          const slab = ih(fl(sm), fl(sz) + (m < 0 ? 0 : 50))
          let v0 = joint ? 1.2 : 2.3 + (slab < 0.3 ? -0.25 : slab > 0.85 ? 0.2 : 0)
          if (m < -3.05 && z > 0.88 && z < 1.02) v0 = Math.abs(m + 3.05) < 0.03 * z || fl(z * 40) % 3 === 0 ? 0.7 : 1.2   // his doormat
          if (m > 0 && fl(sm) === 6 && fl(sz) === 6 && Math.abs(jm - (0.3 + jz * 0.4)) < 0.03 * z * 2) v0 = 0.8   // the crack
          put(x, y, surf(v0, o, x, y, FLOOR, 2.1))
          if (puddleAt(m, z)) WET[i] = 2
          continue
        }
        // the road: asphalt, a patch where the pipes were dug up, a manhole cover, the drain at the left kerb
        let v0 = 2.0
        const inPatch = m > -1.25 && m < 0.05 && z > 2.0 && z < 2.6
        if (inPatch) v0 = Math.abs(m + 1.25) < 0.04 * z || Math.abs(m - 0.05) < 0.04 * z || Math.abs(z - 2.0) < 0.012 * z * z || Math.abs(z - 2.6) < 0.012 * z * z ? 0.6 : 1.55
        const mh = Math.hypot((m - 0.25) / 0.36, (z - 1.33) * 3.2 / 0.36)
        if (mh < 1) v0 = mh > 0.82 ? 2.4 : (fl((m - 0.25) * 18) + fl(z * 3.2 * 18)) % 2 ? 1.0 : 1.8
        if (m > -2.58 && m < -2.2 && z > 1.6 && z < 1.68) v0 = (fl(m * 30) % 2) ? 0.4 : 1.6
        put(x, y, surf(v0, o, x, y, FLOOR, 2.0))
        if (mh >= 1 && puddleAt(m, z)) WET[i] = 2
      }
    }
  }

  // ---------------------------------------------------------------- the walls, column by column (the mock's way): what a point at depth z, height h shows
  const T = { z0: 0.62, z1: 0.88, side: 2.3, rise: 0.62, ceil: 2.75, eye: 70 / 30 }
  /** the arch to Kowalski Street and what the eye sees through it (the mock's, unchanged in its lines) */
  const tunnel = (z, h) => {
    const zc = (T.z0 + T.z1) / 2, hw = (T.z1 - T.z0) / 2, q = (z - zc) / hw
    if (Math.abs(q) > 1.12) return null
    const top = T.side + T.rise * Math.sqrt(Math.max(0, 1 - q * q))
    if (h >= top + 0.12) return null
    if (Math.abs(q) > 1 || h >= top) return Math.abs(q) > 1.06 || h >= top + 0.07 ? "4" : "5"
    const kWall = T.z1 / z, kFloor = h < T.eye ? T.eye / (T.eye - h) : Infinity, kCeil = h > T.eye ? (T.ceil - T.eye) / (h - T.eye) : Infinity
    // (kept dark, the user's wish 2026-11-11: the street's light only a glow at the passage's far end, not a bright wall of it)
    const k = Math.min(kWall, kFloor, kCeil), d = 3.5 * k - 3.5, lit = Math.min(1, d / 1.1) * 0.55
    const b = ISO.bay(R(z * 400), R(h * 40))
    if (k === kCeil) return lit > 0.6 && b < 0.3 ? "c" : Math.floor(d * 6) % 3 === 0 ? "2" : "1"
    if (k === kFloor) return d < 0.08 ? "1" : (b < lit * 0.9 ? (lit > 0.7 ? "C" : "c") : Math.floor(d * 14) % 3 === 0 ? "f" : "t")
    const hh = T.eye + k * (h - T.eye)
    if (Math.abs(hh - 2.0) < 0.05) return lit > 0.5 ? "C" : "4"                                   // a pipe along the passage
    if (Math.abs(hh - 1.95) < 0.05) return "2"
    if (hh < 0.08) return "1"
    // the street's ad screen at the end throws its cyan in: brightest where the passage opens
    return b < lit * lit ? "c" : b < lit ? "t" : Math.floor(hh / 0.45) % 2 ? "1" : "2"
  }
  const box = (z, h, z0, z1, h0, h1) => z >= z0 && z < z1 && h >= h0 && h < h1
  // Okonkwo's shop takes the whole near left-hand wall, from the picture's edge to its door (the user's wish, 2026-11-11: it needs
  // more space): the window in three panes, the sign board over the whole front; the door stays where it was
  // The door is between the two windows (the user's wish, 2026-11-11): a window of one pane from the near edge, the door, then a
  // window of three panes where the door was before, up to the arcade
  const SHOP0 = 0.64, SHOP1 = 1.7, DOOR = [0.85, 1.05]
  const PANES = [[SHOP0, DOOR[0]], [DOOR[1], 1.27], [1.27, 1.49], [1.49, SHOP1]]
  // OKONKWO painted on the board, big where the board is near and small where it runs away, between two lines parallel to its edges
  // (the user's wish, 2026-11-11). Their height follows the board exactly; across, a wall foreshortens twice as fast as it does up,
  // which would squeeze the far letters past reading, so the letters are laid two thirds by the screen and a third by the metre
  // (in the game's own letters, 5 by 7: the hud's 3 by 5 has no diagonal in its N, and the near letters are big enough to show one)
  const signGlyphs = (bold) => { const g = new Set(), px = textPx("OKONKWO", "nagiwa"); for (const [a, b] of px) { g.add(a + "," + b); if (bold) g.add(a + 1 + "," + b) } return { g, w: Math.max(...px.map(([a]) => a)) + 1 + (bold ? 1 : 0), h: Math.max(...px.map(([, b]) => b)) + 1 } }
  // how the letters lie on the board: metre 0 lays them by the screen, 1 by the metre (true perspective: across, a wall foreshortens
  // twice as fast as up); aa their edge softened in two steps; shadow a painter's dark shadow down and right; z0..z1, h0..h1 their box
  // (the user chose the sign painter's style from seven tried, 2026-11-11: docs/rooms/jade_row_schrift_vergleich.png, number 5)
  const SIGN_STYLE = { metre: 0.6, aa: true, shadow: true, bold: false, z0: 0.68, z1: 1.58, h0: 2.36, h1: 2.88 }
  // (bold: every stroke a glyph column wider, so the far letters keep strokes of more than a pixel)
  const SIGN = signGlyphs(SIGN_STYLE.bold)
  const signInk = (z, h) => {
    const { z0, z1, h0, h1, metre } = SIGN_STYLE
    if (z < z0 || z >= z1 || h < h0 || h >= h1) return false
    const byScreen = (1 / z0 - 1 / z) / (1 / z0 - 1 / z1), byMetre = (z - z0) / (z1 - z0), t = byScreen * (1 - metre) + byMetre * metre
    return SIGN.g.has(fl(t * SIGN.w) + "," + fl((h1 - h) / (h1 - h0) * SIGN.h))
  }
  // a pixel of the board is paint where the letters cover enough of it: nine samples across it, back on the wall (so the far, thin
  // letters keep their diagonals)
  const cover = (x, y) => {
    let n = 0
    for (const dy of [0.17, 0.5, 0.83]) for (const dx of [0.17, 0.5, 0.83]) {
      const z = (3.5 * 30) / (VX - (x + dx)), h = (VY + EYE / z - (y + dy)) * z / 30
      if (signInk(z, h)) n++
    }
    return n
  }
  const signAt = (x, y) => {
    const n = cover(x, y)
    if (!SIGN_STYLE.aa) return n >= 4 ? "K" : SIGN_STYLE.shadow && cover(x - 1, y - 1) >= 4 ? "o" : null
    if (n >= 7) return "K"
    if (n >= 4) return "¦"
    if (n >= 2) return "¬"
    return SIGN_STYLE.shadow && cover(x - 1, y - 1) >= 4 ? "o" : null
  }
  const WARM_IN = ["a", "A", "b", "P", "Q", "R"]
  /** the storeys over the shops: slabs, windows (lit, a television, magenta, dark), air conditioners and what drips from them */
  const storeys = (side, z, h, x, y, o) => {
    const gz = z * 3.4, gh = (h - 2.95) / 1.05, i = fl(gz), j = fl(gh), fx = gz - i, fy = gh - j
    const q = ih(i * 7 + side * 3, j * 13), ac = (a, b) => ih(a * 5 + side, b * 11 + 3) < 0.3
    const win = fx > 0.2 && fx < 0.8 && fy > 0.25 && fy < 0.8
    if (win) {
      const wx = (fx - 0.2) / 0.6, wy = (fy - 0.25) / 0.55
      if (wx < 0.07 || wx > 0.93 || wy < 0.07 || wy > 0.93) return z > 2.4 ? "k" : "1"
      if (q < 0.2) {                                                                          // lit: a curtain drawn to one side, a plant on the sill
        const curt = ih(i, j + 40) < 0.5 ? wx < 0.3 : wx > 0.7
        if (curt) return fl(wx * 22) % 2 ? "P" : "b"
        if (ih(i + 9, j) < 0.35 && wy < 0.4 && Math.abs(wx - 0.55) < 0.1 + (0.4 - wy) * 0.3) return "O"
        return tone(["P", "Q", "R"], 1.2 + wy * 1.2, x, y)
      }
      if (q < 0.32) return wx > 0.55 && wy < 0.55 ? "C" : wy > 0.85 ? "C" : "c"              // a television's light on the ceiling
      if (q < 0.4) return wy > 0.5 ? "I" : "i"
      if (ih(i + 3, j + 7) < 0.4) return fl(wy * 9) % 2 ? "2" : "1"                           // blinds down
      return ((wx * 0.7 + wy) % 0.6) < 0.09 ? "2" : "1"                                       // dark glass, the neon's streak in it
    }
    let v0 = 2.25
    if (fy < 0.07) v0 = 3.2                                                                    // the slab's edge catches the light
    else if (fy > 0.94) v0 = 1.5                                                               // under it, its shadow
    else if (fx > 0.17 && fx < 0.83 && fy > 0.2 && fy <= 0.25) v0 = 3.4                        // the sill
    else if (ac(i, j) && fx > 0.6 && fx < 0.9 && fy > 0.03 && fy < 0.19) {                    // an air conditioner under the window
      v0 = fy > 0.16 ? 3.6 : fx > 0.86 ? 2.0 : fl(fy * 80) % 2 ? 2.4 : 3.1
    } else if ((ac(i, j) && fx > 0.71 && fx < 0.75 && fy <= 0.03) || (ac(i, j + 1) && fx > 0.71 && fx < 0.75 && fy > 0.35)) v0 = 1.55   // its drip down the wall
    // lit windows warm the wall round them
    if (q < 0.4) {
      const dx = Math.max(0.2 - fx, 0, fx - 0.8) * 0.94, dy = Math.max(0.25 - fy, 0, fy - 0.8) * 1.05, d = Math.hypot(dx, dy)
      if (d < 0.32) add(o, q < 0.2 ? "w" : q < 0.32 ? "c" : "m", 0.45 * (1 - d / 0.32) ** 2)
    }
    return surf(v0, o, x, y)
  }
  // a tag sprayed on the shutter by the balcony (the Lower Ninth's own name), in the paint the kids have: violet with a pale rim
  const TAG = (() => { const g = new Set(); for (const [px, py] of textPx("NINTH")) g.add(px + "," + py); return { g, w: 19, h: 5 } })()
  const tagAt = (u, w) => {
    if (u < 0 || u >= 1 || w < 0 || w >= 1) return null
    const gx = fl(u * TAG.w), gy = fl((1 - w) * TAG.h)
    if (TAG.g.has(gx + "," + gy)) return "u"
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (TAG.g.has(fl(u * TAG.w + a * 0.45) + "," + fl((1 - w) * TAG.h + b * 0.3))) return "U"
    return null
  }
  const wallPix = (side, z, h, x, y) => {
    const o = lightAt(side * 3.5, z, h, -side, 0)
    if (side < 0) {
      // ---- the left-hand wall
      if (box(z, h, 0.97, 1.2, 2.97, 4.85)) {                                                 // the balcony door, open, a curtain blowing in it
        if (box(z, h, 0.97, 0.99, 2.97, 4.85) || box(z, h, 1.18, 1.2, 2.97, 4.85) || h > 4.79) return "o"
        const u = (z - 0.99) / 0.19
        if (u > 0.55 + Math.sin(h * 5) * 0.08) return fl(z * 60) % 3 === 0 ? "P" : "b"
        return tone(WARM_IN, 2.8 + (h - 3) * 0.6 - u * 0.8, x, y)
      }
      if (box(z, h, 0.9, 1.25, 4.85, 99)) {                                                   // the plain storeys over it, an AC with its drip
        const f = ((h - 2.95) % 1.05) / 1.05
        if (box(z, h, 1.02, 1.12, 5.05, 5.35)) return h > 5.3 ? surf(3.6, o, x, y) : fl(h * 60) % 2 ? surf(2.3, o, x, y) : surf(3.0, o, x, y)
        if (z > 1.085 && z < 1.095 && h < 5.05 && h > 4.86) return surf(1.4, o, x, y)
        return surf(f < 0.08 ? 3.2 : f > 0.94 ? 1.5 : 2.25, o, x, y)
      }
      if (box(z, h, SHOP0, SHOP1, 2.3, 2.93)) {                                               // the sign board along the whole front, up under the balcony: old wood, its top edge lit
        if (h > 2.9) return "p"
        if (h < 2.34) return "k"
        const g = signAt(x, y)
        if (g) return g
        return tone(["o", "o", "p", "O"], 1.2 + (h - 2.3) * 2 + lightAt(-3.4, z, h, 1, 0).w * 0.8, x, y)
      }
      if (box(z, h, DOOR[0], DOOR[1], 0, 2.2)) {                                              // the open door: a bead curtain, the shop deep inside, the leaf folded back
        const a = DOOR[0], b = DOOR[1], d = (b - a) / 0.44                                   // (its parts in the old door's proportions)
        if (z < a + 0.03 * d || z >= b - 0.03 * d || h > 2.14) return "o"
        if (z < a + 0.05 * d || h > 2.1) return "p"
        const u = (z - a - 0.05 * d) / (b - a - 0.08 * d)
        if (u > 0.8) return h > 1.0 && h < 1.08 && u < 0.85 ? "5" : fl(h * 6) % 3 === 0 ? "o" : "p"
        if (h < 0.05) return "P"                                                              // the step, worn pale
        if (fl(u * 13) % 2 === 0 && fl(h * 28) % 2 === 0 && h > 0.35) return h > 1.6 ? "P" : "O"   // the beads
        if (h < 0.32) return fl((u + h * 0.6) * 10) % 2 ? "A" : "b"                           // his floorboards running in
        if (u > 0.08 && u < 0.62 && h > 0.32 && h < 0.95) return h > 0.9 ? "P" : fl(u * 20) % 4 === 0 ? "a" : "A"   // the counter's end
        const shelf = (h - 0.95) % 0.3
        if (u > 0.2 && u < 0.78 && shelf < 0.035) return "O"
        if (u > 0.2 && u < 0.78 && shelf < 0.14) return ["H", "P", "K", "c", "P"][fl(u * 14 + h * 3) % 5]
        return tone(WARM_IN, 3.0 + (h - 0.95) * 0.9 - Math.abs(u - 0.45) * 1.4, x, y)       // the bulb's light, brightest high in the middle
      }
      if (box(z, h, SHOP0, SHOP1, 0.45, 2.1)) {                                               // the shop windows onto his shelves, either side of the door
        // kept calm (the user's wish, 2026-11-11): the bulb's light in two flat steps, the goods in blocks, one row of sacks
        const pane = PANES.findIndex(([a, b]) => z >= a && z < b), u = (z - PANES[pane][0]) / (PANES[pane][1] - PANES[pane][0]), w = (h - 0.45) / 1.65
        if (u < 0.05 || u > 0.95 || w > 0.97 || Math.abs(h - 1.0) < 0.022) return "o"
        if (u < 0.09 || w > 0.94 || (h > 1.0 && h < 1.04)) return "p"
        if (pane === 0 && u > 0.18 && u < 0.62 && w > 0.62 && w < 0.78) return w > 0.75 ? "h" : "K"   // OPEN, a card in the corner
        if (pane === 3 && u > 0.6 && u < 0.86 && w > 0.74 && w < 0.86) return w > 0.83 ? "h" : "K"    // the price list taped on inside
        if (h < 1.0) {
          if (pane === 1) return h > 0.94 ? "P" : "A"                                           // the counter's front behind the glass
          const sv = (z * 17) % 1, sack = Math.hypot((sv - 0.5) * 2.3, (h - 0.6) / 0.11) < 1   // a row of rice sacks, jute
          return sack ? (h > 0.65 ? "K" : "b") : "a"
        }
        const shelf = (h - 1.04) % 0.3, row = fl((h - 1.04) / 0.3)
        if (shelf < 0.035) return "O"
        if (shelf > 0.05 && shelf < 0.15) return fl(z * 26 + row * 3) % 4 === 0 ? "A" : ["H", "c", "K", "P"][row % 4]   // rice, batteries, cigarettes, noodle cups
        return h > 1.62 ? "P" : "b"
      }
      if (box(z, h, SHOP0, SHOP1, 0, 0.45)) {                                                 // the base under them, plain
        if (h > 0.42) return surf(3.5, o, x, y)
        return surf(h < 0.04 ? 1.6 : 2.1, o, x, y)
      }
      if (box(z, h, 2.45, 3.2, 0, 2.3)) {                                                     // MAHJONG: a strip curtain, the tiles on the board over it
        const u = (z - 2.45) / 0.75
        if (u < 0.08 || u > 0.92 || h > 2.24) return "o"
        if (h > 1.95) return u > 0.15 && u < 0.85 && h > 2.03 && h < 2.15 && fl(u * 9) % 2 === 0 ? "H" : "n"
        return h < 0.15 ? "A" : fl(u * 11) % 2 ? "I" : "d"
      }
      // (the shop's front runs from the near edge to its door now: the shutter with its tag and the balcony's drainpipe are gone)
      if (z > 0.955 && z < 0.972 && h > 2.85 && h < 2.95) return surf(3.4, o, x, y)                // the drainpipe's stub over the sign
      if (box(z, h, 1.7, 2.45, 0.1, 2.4)) {                                                   // behind the arcade: posters for the game, worn
        if (box(z, h, 1.78, 1.98, 1.25, 2.05)) return h > 1.9 ? "M" : fl((z - h * 0.4) * 30) % 3 ? "n" : "d"
        if (box(z, h, 2.08, 2.3, 1.4, 2.1)) return box(z, h, 2.08, 2.17, 1.85, 2.1) ? "2" : "K"   // an old notice, a corner torn off
      }
      if (box(z, h, 3.2, END, 0.3, 2.0)) {                                                    // the far shops, small
        const s = fl(z * 5), lit = ih(s, 4) < 0.6, u = z * 5 - s
        if (u < 0.12) return surf(2.6, o, x, y)
        return lit ? tone(WARM_IN, 2.5 + (h - 0.3), x, y) : fl(h / 0.1) % 2 ? "2" : "3"
      }
    } else {
      // ---- the right-hand wall
      if (z >= 0.6 && z < 0.9) { const k = tunnel(z, h); if (k) return k }
      if (box(z, h, 1.28, 2.05, 0.3, 2.2)) {                                                  // HOT SOUP
        const u = (z - 1.28) / 0.77
        if (h > 1.75) return h > 2.15 || h < 1.79 ? "k" : "n"                                  // the band; its letters come after
        if (h < 0.95) {                                                                       // the counter, boards of old wood, its lip, bowls on it
          if (h > 0.89) return "P"
          return fl(u * 16) % 4 === 0 ? "o" : tone(["o", "p", "O"], 1.2 + (h - 0.3) * 1.5, x, y)
        }
        if (h < 1.0 && (fl(u * 12) % 3 === 0)) return "H"
        if (h > 1.56) { const p = (u * 6) % 1; return p < 0.09 ? tone(WARM_IN, 4.2, x, y) : h < 1.6 && p > 0.5 ? "H" : p > 0.5 ? "n" : "d" }   // the noren, split
        // inside: a cook in white at the pots, the ladles on the tiles, two pots on the fire
        if (u > 0.6 && u < 0.74 && h < 1.42) return h > 1.33 ? (u < 0.67 ? "s" : "1") : u < 0.64 ? "H" : "h"
        if (u > 0.62 && u < 0.71 && h >= 1.42 && h < 1.5) return "1"
        for (const [p0, p1] of [[0.08, 0.28], [0.34, 0.52]]) if (u > p0 && u < p1 && h < 1.22) return h > 1.19 ? "5" : h > 1.15 ? "3" : u < p0 + 0.03 ? "3" : "2"
        if (u > 0.85 && u < 0.88 && h > 1.25) return "5"
        const tile = fl(u * 26) % 2 === 0 || fl((h - 1) * 30) % 3 === 0
        return tone(WARM_IN, 3.4 + (h - 1) * 1.2 - (tile ? 0.6 : 0), x, y)
      }
      if (box(z, h, 2.2, 3.0, 0.4, 2.1)) {                                                    // the pharmacy: its cross, shelves in cold light
        const u = (z - 2.2) / 0.8
        if (h > 1.8) return h > 1.86 && h < 2.04 && u > 0.12 && u < 0.36 && (Math.abs(u - 0.24) < 0.04 || Math.abs(h - 1.95) < 0.03) ? "v" : "c"
        if (u < 0.06 || u > 0.94) return "4"
        return fl(h * 4) % 2 ? "C" : h % 0.25 < 0.04 ? "c" : "T"
      }
      if (box(z, h, 0.915, 1.0, 0.85, 1.95)) {                                                // posters on posters: LULL over an old one, torn
        const u = (z - 0.915) / 0.085, w = (h - 0.85) / 1.1
        const torn = u + w * 0.5 < 0.35
        if (torn) return w > 0.8 ? surf(2.2, o, x, y) : fl(w * 12) % 2 ? "U" : "u"
        if (w > 0.78) return fl(u * 6) % 2 ? "h" : "H"                                          // its title in a band, too small to read from here
        return Math.hypot((u - 0.5) / 0.32, (w - 0.45) / 0.22) < 1 ? (u > 0.55 ? "c" : "C") : "h"   // the sleeping face
      }
      if (box(z, h, 1.0, 1.065, 1.15, 1.6)) return h > 1.55 || z < 1.008 ? surf(3.6, o, x, y) : surf(2.9, o, x, y)    // the box that feeds the machine
      if (z > 1.265 && z < 1.28 && h < 9) return surf(h % 1.2 < 0.05 ? 3.8 : z < 1.27 ? 3.3 : 2.4, o, x, y)          // a pipe down from the roofs
      if (box(z, h, 3.0, END, 0.3, 2.0)) {
        const s = fl(z * 5), lit = ih(s, 9) < 0.55, u = z * 5 - s
        if (u < 0.12) return surf(2.6, o, x, y)
        return lit ? tone(WARM_IN, 2.4 + (h - 0.3), x, y) : fl(h / 0.1) % 2 ? "2" : "3"
      }
    }
    if (h < 0.1) return surf(1.4, o, x, y)                                                     // the foot, dark with the street's splash
    if (h >= 2.95) return storeys(side, z, h, x, y, o)
    return surf(h < 0.5 ? 2.0 : 2.4, o, x, y)
  }
  const walls = () => {
    for (const side of [-1, 1]) for (let x = side < 0 ? 0 : VX + 1; side < 0 ? x < VX : x < W; x++) {
      const z = HALF / Math.abs(x - VX)
      if (z > END) continue
      at(z)
      const foot = R(VY + EYE / z)
      for (let y = Math.max(0, foot - R(9 * 30 / z)); y < Math.min(H, foot); y++) put(x, y, wallPix(side, z, (foot - y) * z / 30, x, y))
    }
  }
  // NIGHT MARKET on the right-hand facade (the mock's glyphs on the wall's slope), now tubes on a dark plate; a stroke of the second stutters
  const nightSign = () => {
    const z0 = 1.1, z1 = 2.0, x0 = VX + R(HALF / z1), x1 = VX + R(HALF / z0), h0 = 3.2, h1 = 5.0
    const n = ph("night"), dead = n === 13 || n === 14 || n === 17
    for (let x = x0; x <= x1; x++) {
      const z = HALF / (x - VX), foot = VY + EYE / z, t = (x - x0) / (x1 - x0) * 20
      at(z)
      const yTop = Math.max(0, R(foot - h1 * 30 / z)), yBot = foot - h0 * 30 / z
      for (let y = yTop; y < yBot; y++) {
        const h = (foot - y) * z / 30, fr = (h1 - h) / (h1 - h0) * 9, row = fl(fr), id = t < 10 ? "ye" : "shi", colF = (t < 10 ? t : t - 10.5) * 0.95, col = fl(colF)
        const stroke = G9[id][row]?.[col] === "#"
        if (x === x0 || x === x1 || y === yTop || y >= yBot - 1) { put(x, y, "k"); continue }
        if (!stroke) { put(x, y, (fr % 1 < 0.12 && (x % 7 === 0)) ? "1" : "n"); continue }
        if (dead && id === "shi" && row >= 4) { put(x, y, "d"); continue }
        const core = Math.abs((fr % 1) - 0.5) < 0.3 && Math.abs((colF % 1) - 0.5) < 0.35
        put(x, y, core ? "N" : "m")
      }
    }
  }
  // OKONKWO, flat on the board (as the mock), cream paint under the little lamp; HOT SOUP in neon along its band
  const shopLetters = () => {
    at(1.2)
    // the lamps over the sign: shades on bent arms, their bulbs
    for (const zl of [0.86, 1.3]) {
      const [lx, ly] = bP(-3.5, zl, 3.0)
      c.line(lx - 1, ly - 3, lx + 3, ly - 1, "k"); c.rect(lx + 2, ly - 1, 4, 2, "4"); put(lx + 3, ly + 1, "W"); put(lx + 4, ly + 1, "R")
    }
    at(1.6)
      }

  // ---------------------------------------------------------------- what stands in the lane, far to near (the mock's list, painted)
  const L = { frame: "3", strip: "M" }
  const paper = (x, y, base) => {
    const behind = get(x, y), bright = !!behind && "QRWvVCmMNc".includes(behind)
    return base === "rib" ? (bright ? "Q" : "P") : base === "skin" ? (bright ? "R" : "P") : bright ? "W" : ((x + y) & 3) ? "R" : "Q"
  }
  const lantern = (x, y) => {
    c.vline(x + 2, y - 3, 3, "k")
    for (let b = 0; b < 7; b++) for (let a = 0; a < 5; a++) put(x + a, y + b, paper(x + a, y + b, a && a < 4 && b && b < 6 ? "core" : "skin"))
    c.hline(x + 1, y - 1, 3, "k"); c.hline(x + 1, y + 7, 3, "k"); put(x + 2, y + 8, "O")              // the caps, the tassel
    put(x, y, "P"); put(x + 4, y, "P"); put(x, y + 6, "O"); put(x + 4, y + 6, "O")                    // round shoulders, the lower edge in shade
  }
  /** a big paper lantern: its ribs, the light strongest at the middle, a glyph on it; flick (0..1) dims the flame */
  const bigLantern = (x, y, r, word, n = 1, flick = 0) => {
    const ry = R(r * 1.25), ribs = Math.max(3, R(r / 3))
    c.vline(x, Math.max(0, y - ry - 6), 6, "k"); c.rect(x - R(r / 2), y - ry - 1, r + 1, 2, "k"); c.rect(x - R(r / 2), y + ry, r + 1, 2, "k")
    c.hline(x - R(r / 2) + 1, y - ry - 1, r - 1, "o"); c.hline(x - R(r / 2) + 1, y + ry + 1, r - 1, "o")
    for (let b = -ry; b <= ry; b++) for (let a = -r; a <= r; a++) {
      const d = (a * a) / (r * r) + (b * b) / (ry * ry)
      if (d > 1) continue
      if (d > 0.88) { put(x + a, y + b, "k"); continue }
      const rib = (b + ry) % ribs === 0
      // the paper: the flame behind it brightest in the middle, darker toward the rim and the bottom
      const v = 4.6 - d * 3.2 - (b > 0 ? b / ry * 0.6 : 0) + (a < 0 ? 0.25 : 0) - flick
      put(x + a, y + b, tone(["O", "P", "Q", "R", "W"], rib ? v - 1.3 : v, x + a, y + b))
    }
    if (word && r >= 7) glyph(x - fl(9 * n / 2), y - fl(9 * n / 2), word, "O", n)
    // the tassel under it
    for (let i = 0; i < Math.max(2, R(r / 5)); i++) put(x, y + ry + 2 + i, i ? "O" : "P")
  }
  const line = (x0, y0, x1, y1, sag, lamps, z) => {
    let n = 0
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / (x1 - x0), y = R(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag)
      if (Math.abs(x - 160) < 31) continue
      put(x, y, "k")
      if (lamps && ++n % lamps === fl(lamps / 2)) lantern(x - 2, y + 2)
    }
  }
  /** a figure at a scale (the mock's blocks): legs, coat with its lit side, head, an umbrella lit from above */
  const person = (x, foot, coat, skin, brolly, s = 1, led = false) => {
    const Rr = (a, b, w, h, k) => c.rect(R(x + a * s), R(foot + b * s), Math.max(1, R(w * s)), Math.max(1, R(h * s)), k)
    Rr(-3, -21, 3, 21, "1"); Rr(1, -21, 3, 21, "k"); Rr(-5, -42, 11, 22, coat); Rr(3, -41, 2, 20, "2"); Rr(-5, -42, 2, 18, coat === "3" ? "4" : "5")
    Rr(-3, -50, 7, 8, skin); Rr(-3, -50, 7, 3, "1")
    if (brolly) {
      const ux = R(x + 7 * s), uy = R(foot - 62 * s), rw = R(17 * s), rh = Math.max(2, R(4 * s))
      Rr(7, -62, 1, 30, "5")
      c.ellipse(ux, uy, rw, rh, led ? "c" : "u"); c.ellipse(ux, uy - 1, rw - 2, Math.max(1, rh - 2), led ? "T" : "U")
      c.hline(ux - rw, uy + rh, 2 * rw + 1, led ? "v" : "k")                                      // the rim (one of them an LED rim)
    }
  }
  /** the smoker on the balcony, leaning on his rail, the ember at his lips; seen against the lit door */
  const SMOKER = [
    "...1111...",
    "..111111..",
    "..b1sss1..",
    "..1sSSs1..",
    "..1ssss...",
    "...1ssWR..",
    "..b4441...",
    ".b444441..",
    "b44444441.",
    "b444444441",
    "b444444441",
    "b444444441",
    "4444444441",
    ".4ss..ss4.",
  ]
  const machine = () => {
    // the machine on the right-hand kerb, seen from the side: its screen toward the lane, the camera on its front turned to the shop's window
    const [mx, my] = bP(2.85, 1.15)
    at(1.15)
    c.rect(mx, my - 56, 24, 56, "k")
    for (let y = my - 55; y < my - 1; y++) for (let x = mx + 1; x < mx + 23; x++) {
      const o = lightAt(2.95 + (x - mx) * 0.02, 1.15, (my - y) / 26, 0, 0)
      put(x, y, surf(x === mx + 22 ? 1.4 : x > mx + 19 ? 1.9 : 2.5, o, x, y))
    }
    // the front edge: the screen seen at a slant, its light
    const a = ph("machine")
    for (let y = my - 54; y < my - 6; y++) { put(mx + 1, y, "C"); put(mx + 2, y, (y + a * 2) % 9 < 2 ? "V" : "v"); put(mx + 3, y, "C") }
    c.rect(mx + 1, my - 6, 3, 5, "3")
    // the marquee on top: SMILE in neon on a dark plate
    c.rect(mx + 4, my - 54, 18, 8, "n"); c.hline(mx + 4, my - 47, 18, "k")
    TXT.draw(c, mx + 13, my - 53, "SMILE", "m", { font: "hud", align: "center" })
    // the face that sells it, pale on the side panel, and the slot the coupon comes out of
    const fx = mx + 13, fy = my - 34
    for (let b = -6; b <= 6; b++) for (let i = -6; i <= 6; i++) { const d = Math.hypot(i, b); if (d < 6.4) put(fx + i, fy + b, d > 5.4 ? "h" : "H") }
    put(fx - 2, fy - 2, "k"); put(fx + 2, fy - 2, "k"); put(fx - 2, fy - 1, "k"); put(fx + 2, fy - 1, "k")
    c.hline(fx - 2, fy + 3, 5, "k"); put(fx - 3, fy + 2, "k"); put(fx + 3, fy + 2, "k")
    c.rect(mx + 6, my - 19, 14, 3, "k"); c.rect(mx + 8, my - 17, 8, 5, "K"); c.hline(mx + 8, my - 13, 8, "h"); put(mx + 11, my - 15, "o"); put(mx + 13, my - 15, "o")
    c.rect(mx + 5, my - 25, 16, 1, "2")
    // the camera on the front: a small housing on an arm, its lens turned left across the lane, a status light that blinks
    c.rect(mx - 4, my - 45, 6, 5, "k"); c.rect(mx - 3, my - 44, 5, 3, "4"); c.hline(mx - 3, my - 44, 5, "5")
    put(mx - 4, my - 43, "C"); put(mx - 5, my - 43, "v"); put(mx - 5, my - 44, "C"); put(mx - 5, my - 42, "c")
    put(mx, my - 46, a < 2 ? "V" : a < 6 ? "C" : "c")
    // its feet, a cable to the box on the wall
    c.hline(mx, my - 1, 24, "k")
  }
  const bFront = () => {
    const items = []
    const SIGNS = [[3.8, -1, "an", "M", "N", 2.9], [3.8, 1, "zh", "Q", "W", 2.9], [3.0, -1, "tang,zh", "M", "N", 2.9], [2.9, 1, "mi,an", "M", "N", 2.8], [2.15, -1, "dian,an", "Q", "W", 2.7], [2.1, 1, "shui,dian,an", "C", "V", 2.6], [1.72, -1, "mi", "M", "N", 2.9], [1.25, 1, "tang,mi", "Q", "W", 2.5]]
    for (const [z, side, word, board, ink, h] of SIGNS) items.push([z, () => {
      const [xw, yt] = bP(side * 3.5, z, h + word.split(",").length * 0.45), x = side < 0 ? xw : xw - 15
      if (z > 2.5) {
        const n = word.split(","), sz = R(16 / z * 1.2), hh = n.length * R(13 / z * 1.3), bx = x + (side < 0 ? 0 : 15 - sz)
        c.rect(bx, yt, sz, hh, "k"); c.rect(bx + 1, yt + 1, sz - 2, hh - 2, board)
        for (let i = 0; i < n.length; i++) c.rect(x + (side < 0 ? 3 : 18 - sz), yt + 3 + i * R(13 / z * 1.3), Math.max(2, sz - 6), Math.max(2, R(9 / z)), ink)
        c.hline(side < 0 ? bx - 2 : bx + sz, yt, 2, "k")
        return
      }
      // a lightbox: its frame, the face lit from inside (a shade darker at the rim), the glyphs; an iron arm to the wall over it
      const list = word.split(","), hgt = list.length * 13 + 3
      c.rect(x - 1, yt - 1, 15, hgt + 2, "k")
      const dim = { M: "d", Q: "P", C: "l" }[board]
      for (let j = 0; j < hgt; j++) for (let i = 0; i < 13; i++) put(x + i, yt + j, i === 0 || i === 12 || j === 0 || j === hgt - 1 ? dim : board)
      list.forEach((id, i) => glyph(x + 2, yt + 3 + i * 13, id, ink))
      c.hline(side < 0 ? x - 3 : x + 13, yt - 2, 4, "k"); put(side < 0 ? x + 6 : x + 6, yt - 2, "k"); put(side < 0 ? x + 6 : x + 6, yt - 3, "k")
      c.line(side < 0 ? x - 3 : x + 16, yt - 2, side < 0 ? x + 6 : x + 6, yt - 3, "k")
    }])
    // the gantries: posts on the kerbs, an arm in from each wall, the gap in the middle for the gate; the nearest with a lantern on each arm
    for (const [z, word, lampOn] of [[2.6, null, false], [1.78, null, false], [1.35, "ye", true]]) items.push([z, () => {
      const [xl, yf] = bP(-2.8, z), [xr] = bP(2.8, z), [, yt] = bP(0, z, 3.4), t = Math.max(2, R(0.2 * 30 / z)), b = Math.max(2, R(0.22 * 30 / z)), gap = 31
      for (const [post, inner, side] of [[xl - t, VX - gap, -1], [xr, VX + gap, 1]]) {
        c.rect(post - 1, yt, t + 2, yf - yt, "k")
        for (let y = yt; y < yf; y++) for (let i = 0; i < t; i++) put(post + i, y, i === (side < 0 ? t - 1 : 0) ? L.strip : i === (side < 0 ? 0 : t - 1) ? "2" : (y - yt) % 18 === 9 && i === 1 ? "5" : L.frame)
        for (let i = 0; i < t; i++) put(post + i, yf - 1, "4")
        const x0 = Math.min(post, inner), x1 = Math.max(post + t, inner)
        if (x1 - x0 > 2) {
          c.rect(x0, yt - 1, x1 - x0, b + 2, "k"); c.rect(x0, yt, x1 - x0, b, L.frame); c.hline(x0, yt, x1 - x0, "4"); c.hline(x0, yt + b - 1, x1 - x0, L.strip)
          const br = Math.min(R(0.8 * 30 / z), x1 - x0 - 2); if (side < 0) c.line(post + t, yt + br + b, post + t + br, yt + b, L.frame); else c.line(post, yt + br + b, post - br, yt + b, L.frame)
          if (lampOn) bigLantern(R((x0 + x1) / 2) + side * 2, yt + b + R(0.6 * 30 / z), Math.max(3, R(0.4 * 30 / z)), word)
        }
      }
    }])
    for (const [z, sag] of [[3.2, 3], [2.25, 5], [1.45, 8], [1.15, 9]]) items.push([z, () => {
      const [xa, ya] = bP(-3.5, z, 3.3), [xb, yb] = bP(3.5, z, 3.4), n = Math.max(6, R(26 / z)); line(xa, ya, xb, yb, sag, n * 2, z)
    }])
    const across = (z, h, sag, keys) => { const [xa, ya] = bP(-3.5, z, h), [xb, yb] = bP(3.5, z, h); for (let x = Math.max(0, xa); x <= Math.min(319, xb); x++) { const t = (x - xa) / (xb - xa), y = R(ya + (yb - ya) * t + Math.sin(t * Math.PI) * sag); [...keys].forEach((k, n) => put(x, y + n, k)) } }
    for (const [z, h, sag] of [[2.3, 5.5, 3], [1.5, 5.1, 6], [1.05, 4.9, 7], [1.28, 4.75, 8]]) items.push([z, () => across(z, h, sag, "k")])
    items.push([1.8, () => across(1.8, 5.6, 2, "Nmk")])                                         // the magenta strip
    items.push([1.16, () => across(1.16, 5.0, 3, "Vvk")])                                       // the network's duct, its cyan line
    // the balcony over the shop: its slab from below, warm from the shop's light; the rail; the smoker; his washing on the rail
    items.push([1.1, () => {
      const P = (m, z, h) => bP(m, z, h), z0 = 0.92, z1 = 1.32, h0 = 2.95, h1 = 3.75, m0 = -3.5, m1 = -2.62, T = 0.06
      // its floor (the user's wish, 2026-11-11): a concrete slab T thick, seen from below, its two edges toward us, a warm wash from
      // the shop's light on its underside; filled as the quads they are
      const quad = (q, key) => {
        const ys = q.map(([, y]) => y), xs = q.map(([x]) => x)
        for (let y = Math.min(...ys); y <= Math.max(...ys); y++) for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
          let inside = false
          for (let i = 0, j = q.length - 1; i < q.length; j = i++) if ((q[i][1] > y + 0.5) !== (q[j][1] > y + 0.5) && x + 0.5 < (q[j][0] - q[i][0]) * (y + 0.5 - q[i][1]) / (q[j][1] - q[i][1]) + q[i][0]) inside = !inside
          if (inside) put(x, y, key(x, y))
        }
      }
      const under = lightAt(-3.0, 1.1, 2.8, 0, -1)
      quad([P(m0, z0, h0 - T), P(m1, z0, h0 - T), P(m1, z1, h0 - T), P(m0, z1, h0 - T)], (x, y) => surf(1.0, under, x, y))       // the underside
      quad([P(m0, z0, h0), P(m1, z0, h0), P(m1, z0, h0 - T), P(m0, z0, h0 - T)], (x, y) => surf(1.6, under, x, y))             // the near edge
      quad([P(m1, z0, h0), P(m1, z1, h0), P(m1, z1, h0 - T), P(m1, z0, h0 - T)], (x, y) => surf(1.3, under, x, y))             // the edge toward the lane
      for (const [a, b] of [[P(m0, z0, h0), P(m1, z0, h0)], [P(m1, z0, h0), P(m1, z1, h0)]]) c.line(a[0], a[1], b[0], b[1], "4") // its top edges catch the lane's light
      for (let x = P(m1, z0, 0)[0]; x <= P(m1, z1, 0)[0]; x++) {
        const zf = (30 * m1) / (x - 160)
        if (zf >= z0 && zf <= z1) { const yt = P(m1, zf, h1)[1], yf = P(m1, zf, h0)[1]; put(x, yt, "5"); put(x, yt + 1, "k"); if (x % 4 === 0) c.vline(x, yt + 1, yf - yt - 1, "k") }
      }
      // the smoker behind the front rail (drawn under the near rail's bars, over the slab)
      const [px, pf] = P(-3.05, 1.14, h0)
      SMOKER.forEach((row, j) => [...row].forEach((k, i) => { if (k !== ".") put(px - 5 + i, pf - 41 + j, k) }))
      c.rect(px - 4, pf - 27, 8, 26, "2"); c.rect(px - 4, pf - 27, 1, 26, "b"); c.rect(px + 2, pf - 14, 2, 13, "1")   // his body down behind the bars
      // the rail's front again over him, its bars
      for (let x = P(m1, z0, 0)[0]; x <= P(m1, z1, 0)[0]; x++) { const zf = (30 * m1) / (x - 160); if (zf < z0 || zf > z1) continue; const yt = P(m1, zf, h1)[1], yf = P(m1, zf, h0)[1]; put(x, yt, "5"); put(x, yt + 1, "k"); if (x % 4 === 0) c.vline(x, yt + 1, yf - yt - 1, "k") }
      const [xa, yt] = P(m0, z0, h1), [xb] = P(m1, z0, h1), [, yf] = P(m0, z0, h0)
      c.hline(xa, yt, xb - xa, "5"); c.hline(xa, yt + 1, xb - xa, "k"); for (let x = xa; x < xb; x += 4) c.vline(x, yt + 1, yf - yt - 1, "k")
      // a pot with a plant in the corner, a bucket under the drip
      c.rect(xa + 3, yf - 6, 5, 4, "O"); c.hline(xa + 3, yf - 6, 5, "P"); c.rect(xa + 4, yf - 10, 1, 4, "1"); c.rect(xa + 5, yf - 12, 2, 6, "2"); put(xa + 6, yf - 12, "4")
      // the washing on its line along the rail: a shirt, a towel, a pair of trousers; pegs; drops falling off them
      const [wx, wy] = P(-3.4, 1.26, h1 + 0.45)
      c.line(wx - 3, wy + 1, wx + 21, wy + 2, "k")
      const shirt = ["hhhhh", "hHhHh", ".hhh.", ".hhh.", ".hHh.", ".hhh.", ".hhh.", ".h.h."], towel = ["UUUUU", "UUUUU", "uUUUU", "UuUUU", "UUuUU", "UUUuU", "UUUUU", "u.u.u"], trou = ["HHHHH", "HHHHH", "HH.HH", "Hh.hH", "Hh.hH", "Hh.hH", "Hh.Hh", "H...H"]
      for (const [dx, g] of [[0, shirt], [7, towel], [14, trou]]) { g.forEach((row, j) => [...row].forEach((k, i) => { if (k !== ".") put(wx + dx + i, wy + 2 + j, k) })); put(wx + dx + 1, wy + 1, "4"); put(wx + dx + 3, wy + 1, "4") }
      put(wx + 9, wy + 12, "h"); put(wx + 16, wy + 14, "h")
      smoke()
    }])
    // the two SUMP RUNNER cabinets, backs to the left wall, screens toward the lane; we see their sides
    for (const [z, bright, idx] of [[2.25, "V", 0], [1.85, "v", 1]]) items.push([z, () => {
      const [x, y] = bP(-3.45, z), w = R(0.72 * 30 / z), h = R(1.8 * 30 / z), a = ph("arcade")
      c.rect(x - 1, y - h - 1, w + 3, h + 1, "k")
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const diag = ((i + j * 0.7) % 7) < 1.6 && j > h * 0.2 && j < h * 0.8                   // its side art: a runner's stripes, worn
        put(x + i, y - h + j, diag ? (i < w / 2 ? "n" : "d") : i < 1 ? "4" : "3")
      }
      c.rect(x, y - h, w, 2, "M"); put(x + 1, y - h, "m")                                        // the marquee, lit
      const sy = y - h + 2, sh = R(h * 0.45)
      for (let j = 0; j < sh; j++) { const lit = (j + a * (idx ? 2 : 3)) % 6 < 2; put(x + w - 2, sy + j, lit ? bright : "C"); put(x + w - 1, sy + j, j % 2 ? "v" : bright) }
      c.rect(x + 1, y - R(h * 0.42), w - 2, 2, "2"); put(x + w - 1, y - R(h * 0.42), "5")           // the control panel
      put(x + w - 3, y - R(h * 0.25), "P")                                                        // the coin slot's light
    }])
    items.push([1.98, () => {                                                                    // someone playing, the screen's light on his face
      const [x, y] = bP(-2.6, 1.98)
      person(x, y, "4", "s", false, 0.5); put(x - 2, y - 24, "T"); put(x - 2, y - 23, "T"); put(x - 3, y - 18, "T")
    }])
    // people at their depths; at the far left, a cart with a pot (the steam rising off it is jade_row_steam)
    items.push([3.25, () => { at(3.25); c.rect(129, 99, 8, 4, "k"); c.rect(130, 99, 6, 3, "O"); c.hline(130, 99, 6, "P"); c.rect(131, 97, 4, 2, "2"); c.hline(131, 97, 4, "5"); put(130, 103, "k"); put(135, 103, "k") }])
    for (const [m, z, coat, skin, br, led] of [[-2.9, 3.2, "3", "s", true, false], [2.9, 3.1, "4", "S", true, true], [-1.4, 3.0, "3", "s", false, false], [-0.5, 3.3, "4", "S", true, false], [2.95, 1.95, "3", "s", true, false]]) items.push([z, () => { const [x, y] = bP(m, z); person(x, y, coat, skin, br, 0.62 / z * 1.6, led) }])
    // the cable from the box on the wall to the machine, along the wall's foot
    items.push([1.12, () => { const [ax, ay] = bP(3.5, 1.03, 1.15), [, fy] = bP(3.5, 1.03); c.vline(ax, ay, fy - ay, "k"); const [bx, by] = bP(3.2, 1.08); c.line(ax, fy, bx, by, "k") }])
    items.push([1.15, machine])
    items.push([1.65, soupSteam])
    items.sort((p, q) => q[0] - p[0]).forEach(([z, draw]) => { at(z); draw() })
    // the large lanterns at the picture's top corners, close to us; their cords run out of the picture; the left one's flame flickers
    const fl0 = [0, 0, 0.15, 0, 0.35, 0.1, 0, 0, 0.2, 0.5, 0.15, 0][ph("lantern")]
    at(0.72); bigLantern(18, 14, 22, "ye", 2, fl0)
    at(0.8); bigLantern(302, 10, 16, "shi", 1)
  }
  // the smoke off his cigarette, curling up past the washing (the part "smoke"); the soup's steam out of its opening (the part "soup")
  const smoke = () => {
    at(1.14)
    const s = ph("smoke"), [px, pf] = bP(-3.05, 1.14, 2.95), ex = px + 2, ey = pf - 37
    for (let i = 0; i < 22; i++) {
      const life = (i + s * 1.5) % 22, y = ey - 1 - life, x = ex + R(Math.sin((life + s * 0.5) * 0.45) * (1 + life * 0.12)) + R(life * 0.12)
      if (life < 2 || y < 5) continue
      if (life > 14 && (i + s) % 3 === 0) continue
      put(x, y, life < 9 ? "h" : "w")
    }
  }
  const soupSteam = () => {
    at(1.65)
    const s = ph("soup"), [sx, sy] = bP(3.1, 1.65, 1.3)
    for (let p = 0; p < 4; p++) {
      const life = (p * 3 + s) % 12, r = 1 + fl(life / 4), cx = sx - 1 - R(life * 0.6), cy = sy - 2 - R(life * 1.8)
      for (let b = -r; b <= r; b++) for (let a = -r; a <= r; a++) {
        const d = Math.hypot(a, b) / (r + 0.4)
        if (d > 1 || (life > 7 && bay(cx + a, cy + b) < (life - 7) / 6)) continue                // it thins out as it rises
        if (d < 0.75 || bay(cx + a, cy + b) < 0.5) put(cx + a, cy + b, d < 0.4 && life < 4 ? "H" : "h")
      }
    }
  }

  // ---------------------------------------------------------------- the wet floor: what the depth says stands over each point, mirrored
  // a puddle mirrors a step darker along each ramp; the open road only what is bright, two steps darker, in rows
  const MIRROR = { W: "R", R: "Q", Q: "P", P: "O", O: "a", m: "M", N: "m", M: "d", d: "I", I: "i", v: "C", V: "v", C: "l", l: "T", T: "t", c: "t",
    6: "5", 5: "4", 4: "2", 3: "1", 2: "e", 1: "e", k: "e", H: "h", h: "4", K: "P", b: "A", A: "a", a: "e", U: "u", u: "e", s: "a", S: "s",
    o: "e", p: "o", n: "i", i: "e", t: "e", X: "Z", Z: "z", z: "f", f: "e", e: "e", g: "2", G: "g", x: "w", w: "2" }
  const SHEEN = { m: "d", N: "M", M: "I", v: "l", V: "C", C: "T", Q: "A", R: "b", W: "P", P: "A", d: "i" }
  let SNAP = null
  // inside the wet parts the mirrored light trembles with the frame (outside them it keeps frame 0's, so the picture stays whole)
  const WETPARTS = PARTS.filter((q) => q.name.startsWith("wet"))
  const moving = (x, y) => WETPARTS.some((q) => x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h)
  const mirror = () => {
    const [SK, SZ] = SNAP
    for (let y = VY + 1; y < H; y++) {
      const zf = EYE / (y - VY)
      for (let x = 0; x < W; x++) {
        const i = y * W + x, wet = WET[i]
        if (!wet) continue
        const t = moving(x, y) ? F / 20 * Math.PI * 2 : 0, wob = R(Math.sin(y * 0.9 + t) * 1.2 + Math.sin(y * 0.37 - t) * 0.6)
        const sx = clamp(x + (wet === 2 ? wob : R(Math.sin(y * 0.6 + t) * 0.8)), 0, W - 1)
        let best = -1, bestD = 1e9
        for (let yy = y - 1; yy >= 0; yy--) {
          const d = SZ[yy * W + sx]
          if (!(d > zf) || d >= 90) continue
          const t = 2 * (VY + EYE / d) - yy
          if (Math.abs(t - y) <= 0.75 && d < bestD) { best = yy; bestD = d }
        }
        if (best < 0) continue
        const src = SK[best * W + sx]
        // a step weaker than before (the user's wish): a puddle mirrors two steps darker along each ramp
        if (wet === 2) { put(x, y, WET[i - W] !== 2 ? "Z" : WET[i + W] !== 2 ? "e" : MIRROR[MIRROR[src]] || "e"); continue }   // its far edge catches the light, the near one is dark
        // the open road: only what is bright, in rows (rain breaks it up), dying off with the distance it travels
        if (y % 2 === 0 && (x + y + (moving(x, y) ? fl(F / 5) : 0)) % 3 !== 0 && SHEEN[src]) put(x, y, SHEEN[src])
      }
    }
  }

  // ---------------------------------------------------------------- one frame: paint, mirror, glow
  const paint = (f) => {
    F = f
    KB.fill("k"); ZB.fill(99); WET.fill(0); CZ = 99
    sky(); endBlock(); floor(); walls(); nightSign(); shopLetters(); bFront()
  }
  // the lights' halos (in fog they grow: the wet air takes their light)
  const HALO = 1
  const GLOWS = [["m", 5 * HALO, 0.45 * Math.sqrt(HALO)], ["vV", 4 * HALO, 0.3 * Math.sqrt(HALO)], ["RW", 4 * HALO, 0.35 * Math.sqrt(HALO)]]
  // the scene a fifth darker than its palette, all but the lights themselves (neon, lanterns, screens, the bulbs), so they stand out
  // (the user's wish, 2026-11-11)
  const LIT = "mNvVRWQ", DIM = 0.8
  // depth fog: everything drowns a little in the wet air the further off it is (by the depth of each pixel), the lights less; k 0 is
  // none, the colour the night's mist
  const FOG = { k: 0, color: [27, 34, 53] }
  const fogAt = (i, lit) => {
    if (!FOG.k) return 0
    const z = ZB[i] >= 90 ? END : ZB[i], f = 1 - Math.exp(-Math.max(0, z - 0.85) * FOG.k)
    return lit ? f * 0.35 : f
  }
  const glow = (keys) => {
    const out = new Float32Array(W * H * 3)
    for (let i = 0; i < W * H; i++) {
      const c3 = RGB[keys[i]] ?? RGB.k, lit = LIT.includes(keys[i]), d = lit ? 1 : DIM, f = fogAt(i, lit)
      for (let ch = 0; ch < 3; ch++) out[i * 3 + ch] = c3[ch] * d * (1 - f) + FOG.color[ch] * f
    }
    for (const [src, r, strength] of GLOWS) {
      const wt = new Float32Array(W * H), acc = new Float32Array(W * H * 3), Rr = Math.ceil(r)
      for (let sy = 0; sy < H; sy++) for (let sx = 0; sx < W; sx++) {
        const k = keys[sy * W + sx]
        if (!src.includes(k)) continue
        const [cr, cg, cb] = RGB[k]
        for (let y = Math.max(0, sy - Rr); y <= Math.min(H - 1, sy + Rr); y++) for (let x = Math.max(0, sx - Rr); x <= Math.min(W - 1, sx + Rr); x++) {
          const d = Math.hypot(x - sx, y - sy)
          if (d > r) continue
          const f = (1 - d / (r + 1)) ** 2, i = y * W + x
          if (f > wt[i]) wt[i] = f
          acc[i * 3] = Math.max(acc[i * 3], f * cr); acc[i * 3 + 1] = Math.max(acc[i * 3 + 1], f * cg); acc[i * 3 + 2] = Math.max(acc[i * 3 + 2], f * cb)
        }
      }
      for (let i = 0; i < W * H; i++) {
        if (src.includes(keys[i]) || wt[i] === 0) continue
        for (let ch = 0; ch < 3; ch++) out[i * 3 + ch] = 255 - ((255 - out[i * 3 + ch]) * (255 - Math.min(255, acc[i * 3 + ch] * strength))) / 255
      }
    }
    const hex = new Array(W * H)
    for (let i = 0; i < W * H; i++) hex[i] = "#" + [0, 1, 2].map((ch) => clamp(R(out[i * 3 + ch]), 0, 255).toString(16).padStart(2, "0")).join("")
    return hex
  }
  const CACHE = new Map()
  const frame = (f) => {
    if (CACHE.has(f)) return CACHE.get(f)
    if (!SNAP) { paint(0); SNAP = [KB.slice(), ZB.slice()] }
    paint(f); mirror()
    const keys = KB.slice(), out = { keys, hex: glow(keys) }
    CACHE.set(f, out)
    return out
  }
  const blit = (cv, hex, x0, y0, w, h) => {
    for (let j = 0; j < h; j++) {
      let run = 0, rk = null
      const flush = (i) => { if (rk) cv.rect(i - run, j, run, 1, rk); run = 0; rk = null }
      for (let i = 0; i < w; i++) { const k = hex[(y0 + j) * W + x0 + i]; if (k !== rk) { flush(i); rk = k } run++ }
      flush(w)
    }
  }

  // ---------------------------------------------------------------- checks and what the game needs
  {
    const base = frame(0).hex, longest = Math.max(...PARTS.map((p) => p.frames))
    let leaks = 0; const lb = {}
    for (let f = 1; f < longest; f++) {
      const h = frame(f).hex
      for (let i = 0; i < W * H; i++) if (h[i] !== base[i]) { const x = i % W, y = fl(i / W); if (!PARTS.some((p) => x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h)) { leaks++; const key = (x >> 4) + "," + (y >> 4); lb[key] = (lb[key] || 0) + 1 } }
    }
    for (let a = 0; a < PARTS.length; a++) for (let b = a + 1; b < PARTS.length; b++) {
      const A = PARTS[a], B2 = PARTS[b]
      if (A.x < B2.x + B2.w && A.x + A.w > B2.x && A.y < B2.y + B2.h && A.y + A.h > B2.y) console.log(`JR_WARN parts overlap: ${A.name} ${B2.name}`)
    }
    if (leaks) console.log(`JR_WARN ${leaks} moving pixels outside the parts: ${Object.entries(lb).map(([k, n]) => k + ":" + n).join(" ")}`)
    const bad = []; for (let i = 0; i < W * H; i++) if ("rqjyY".includes(frame(0).keys[i])) bad.push(`${i % W},${fl(i / W)}`)
    if (bad.length) console.log(`JR_WARN red or yellow at ${bad.slice(0, 6).join(" ")}`)
  }
  console.log("PARTS " + JSON.stringify({
    room: "jade_row", size: [W, H],
    parts: PARTS.map((p) => ({ name: "jade_row_" + p.name, at: [p.x, p.y], size: [p.w, p.h], frames: p.frames, fps: 10, layer: "under" })),
    lamps: [[89, 105, "#eea040", 60], [65, 108, "#eea040", 44], [63, 37, "#eea040", 34], [18, 14, "#ffd58a", 70], [302, 10, "#ffd58a", 54],
      [225, 100, "#eea040", 54], [234, 110, "#62def0", 40], [300, 125, "#62def0", 70], [234, 40, "#ff4fd3", 60], [160, 26, "#62def0", 70],
      [160, 62, "#ff4fd3", 44], [200, 93, "#62def0", 26], [122, 96, "#ff4fd3", 26], [160, 26, "#ff4fd3", 50], [86, 82, "#ffd58a", 34], [234, 82, "#ffd58a", 34]],
  }))

  // ---------------------------------------------------------------- the sprites drawn over the room by the game
  const steam = (cv) => { cv.plume(24, 62, "NMI", { every: 3, life: 22, rise: 46, wind: -0.15, size: [1, 3], seed: 5, frame: cv.frame ?? 0 }) }
  const crowd = (cv) => {
    // an umbrella going by at the near left: its canopy in panels, the ribs, the rim lit by the lantern over it, drops on the rim
    const ux = 20, uy = 24
    for (let b = -8; b <= 8; b++) for (let a = -24; a <= 24; a++) {
      const d = (a / 24.5) ** 2 + (b / 8.5) ** 2
      if (d > 1) continue
      const ang = Math.atan2(b * 3, a), panel = fl((ang + Math.PI) / (Math.PI / 4)) % 2
      const rim = d > 0.82, top = b < -4
      cv.px(ux + a, uy + b, rim ? (b < 0 && a < 4 ? "A" : "k") : top ? (a < -6 ? "A" : panel ? "2" : "3") : panel ? "1" : "2")
    }
    for (const a of [-24, -12, 0, 12, 24]) cv.px(ux + a, uy + (a === -24 || a === 24 ? 0 : 7), "5")
    for (const [a, b] of [[-17, 6], [-5, 8], [9, 8], [21, 4]]) cv.px(ux + a, uy + b + 1, "h")
    cv.rect(ux - 1, uy - 10, 2, 3, "k"); cv.px(ux, uy - 10, "4")
    // a head in a hood going the other way, the shoulders under it, the lantern's light on the hood's edge
    const hx = 62, hy = 24
    for (let b = -8; b <= 8; b++) for (let a = -9; a <= 9; a++) {
      const d = (a / 9.5) ** 2 + (b / 8.5) ** 2
      if (d > 1) continue
      cv.px(hx + a, hy + b, d > 0.78 ? (a < -2 && b < 2 ? "b" : "k") : a < -4 ? "4" : a > 4 ? "2" : "3")
    }
    cv.rect(hx - 14, 30, 29, 2, "k"); cv.rect(hx - 13, 30, 6, 2, "3"); cv.rect(hx + 6, 30, 8, 2, "2")
  }
  const car = (cv, x, y) => {
    const w = 24, h = 17
    // body: dark paint wet on top, the lanterns in it; windscreen with the lane reflected; two lamps on; the plate; the wheels; its shadow
    cv.rect(x - w / 2, y - h + 7, w, h - 7, "k"); cv.rect(x - w / 2 + 1, y - h + 8, w - 2, h - 10, "3"); cv.hline(x - w / 2 + 1, y - h + 8, w - 2, "5")
    cv.rect(x - w / 2 + 4, y - h, w - 8, 7, "k"); cv.rect(x - w / 2 + 5, y - h + 1, w - 10, 6, "1"); cv.hline(x - w / 2 + 5, y - h + 1, w - 10, "4")
    cv.line(x - w / 2 + 6, y - h + 5, x - w / 2 + 9, y - h + 2, "2"); cv.px(x + 3, y - h + 3, "P"); cv.px(x - 4, y - h + 4, "i")   // the lane in the glass
    cv.px(x - w / 2 - 1, y - h + 8, "k"); cv.px(x + w / 2, y - h + 8, "k")                                          // the mirrors
    cv.hline(x - w / 2 + 1, y - 7, w - 2, "2")
    cv.rect(x - w / 2 + 1, y - 6, 4, 2, "W"); cv.rect(x + w / 2 - 5, y - 6, 4, 2, "W"); cv.px(x - w / 2 + 1, y - 5, "R"); cv.px(x + w / 2 - 2, y - 5, "R")
    cv.rect(x - 4, y - 6, 8, 2, "1"); for (let i = -3; i < 4; i += 2) cv.px(x + i, y - 6, "4")                     // the grille
    cv.rect(x - 2, y - 3, 4, 1, "h")                                                                                // the plate
    cv.rect(x - w / 2, y - 2, 3, 2, "k"); cv.rect(x + w / 2 - 3, y - 2, 3, 2, "k")
    cv.rect(x - w / 2, y - 1, w, 1, "e")
    // the lamps on the wet road under it, broken into rows
    for (const lx of [x - w / 2 + 2, x + w / 2 - 3]) for (let j = 1; j < 5; j++) if (j % 2) { cv.px(lx, y + j, j < 3 ? "Q" : "P"); cv.px(lx + 1, y + j, j < 2 ? "Q" : "A") }
  }
  return { W, H, PARTS, frame, blit, steam, crowd, car }
})()

sprite("jade_row_bg", { w: JR.W, h: JR.H }, (c) => JR.blit(c, JR.frame(0).hex, 0, 0, JR.W, JR.H))
for (const P of JR.PARTS) anim("jade_row_" + P.name, { w: P.w, h: P.h, frames: P.frames, fps: 10 }, (c) => JR.blit(c, JR.frame(c.frame ?? 0).hex, P.x, P.y, P.w, P.h))
anim("jade_row_steam", { w: 48, h: 64, frames: 12, fps: 10 }, JR.steam)
anim("jade_row_crowd", { w: 320, h: 32, frames: 1, fps: 1 }, JR.crowd)
// the parked car (game/rooms/jade_row.js puts its top left at [156, 86]), its lamps' glow inside the margin
sprite("jade_row_car", { w: 34, h: 26 }, (c) => JR.car(c, 17, 21), glow("RW", { r: 4, strength: 0.35 }))
