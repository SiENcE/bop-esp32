// Jade Row, the lane left of Kowalski Street (the user chose this stage of three, 2026-11-06; the others: docs/rooms/jade_row_a_wand_x3.png, jade_row_c_ebenen_x3.png, and the
// iso blocks jade_row_blocks_x3.png). BLOCKS, 320x180: looking down the lane, one vanishing point, both facades running away, signs sticking out towards us one behind the
// other, the gate and the big screen at its far end; the machine stands opposite the shop, so it really sees into the window.
// The tall signs carry glyphs, the shops' names stay English (the user's decision, 2026-11-06).
include("../lib/iso.js", { palette: true })
include("../lib/text.js")

const JS = (() => {
  // lanterns and portals are amber (the user's decision, 2026-11-06: red keeps its meaning, style guide §5)
  const L = { skin: "Q", core: "R", rib: "P", frame: "3", strip: "M" }
  /** paper a little see-through, in the palette: lit from inside, a shade lighter where something bright is behind it and a shade darker where it is dark (baked: what is behind stands still) */
  const paper = (c, x, y, base) => {
    const behind = c.key(x, y), bright = "QRWvVCmMNc".includes(behind)
    return base === "rib" ? (bright ? L.skin : L.rib) : base === "skin" ? (bright ? L.core : L.rib) : bright ? "W" : L.skin === "Q" ? (((x + y) & 3) ? L.core : L.skin) : L.core
  }
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
  const glyph = (c, x, y, id, k, n = 1) => G9[id].forEach((row, j) => [...row].forEach((ch, i) => { if (ch === "#") c.rect(x + i * n, y + j * n, n, n, k) }))
  const text = (c, x, y, s, k, font = "hud") => TXT.draw(c, x, y, s, k, { font, align: "center" })
  /** a tall sign: its board, the glyphs down it */
  const sign = (c, x, y, word, board, ink) => {
    const list = word.split(","), h = list.length * 13 + 3
    c.rect(x - 1, y - 1, 15, h + 2, "k"); c.rect(x, y, 13, h, board)
    list.forEach((id, i) => glyph(c, x + 2, y + 3 + i * 13, id, ink))
  }
  const lantern = (c, x, y) => { c.vline(x + 2, y - 3, 3, "k"); for (let b = 0; b < 7; b++) for (let a = 0; a < 5; a++) c.px(x + a, y + b, paper(c, x + a, y + b, a && a < 4 && b && b < 6 ? "core" : "skin")); c.hline(x + 1, y - 1, 3, "k"); c.hline(x + 1, y + 7, 3, "k") }
  /** a big paper lantern with its ribs, its cords and a glyph if it is large enough */
  const bigLantern = (c, x, y, r, word, n = 1) => {
    const ry = Math.round(r * 1.25), ribs = Math.max(3, Math.round(r / 3))
    c.vline(x, Math.max(0, y - ry - 6), 6, "k"); c.rect(x - Math.round(r / 2), y - ry - 1, r + 1, 2, "k"); c.rect(x - Math.round(r / 2), y + ry, r + 1, 2, "k")
    for (let b = -ry; b <= ry; b++) for (let a = -r; a <= r; a++) {
      const d = (a * a) / (r * r) + (b * b) / (ry * ry)
      if (d > 1) continue
      c.px(x + a, y + b, d > 0.86 ? "k" : paper(c, x + a, y + b, (b + ry) % ribs === 0 ? "rib" : d > 0.55 ? "skin" : "core"))
    }
    if (word && r >= 7) glyph(c, x - Math.floor(9 * n / 2), y - Math.floor(9 * n / 2), word, "k", n)
  }
  /** a line of cable or lanterns with its sag */
  const line = (c, x0, y0, x1, y1, sag, lamps) => {
    let n = 0
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / (x1 - x0), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag)
      if (Math.abs(x - 160) < 31) continue      // the middle stays free: the gate must show (the user's decision)
      c.px(x, y, "k")
      if (lamps && ++n % lamps === Math.floor(lamps / 2)) lantern(c, x - 2, y + 2)
    }
  }
  /** a person as a block, at a scale, with or without an umbrella */
  const person = (c, x, foot, coat, skin, brolly, s = 1) => {
    const R = (a, b, w, h, k) => c.rect(Math.round(x + a * s), Math.round(foot + b * s), Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s)), k)
    R(-3, -21, 3, 21, "1"); R(1, -21, 3, 21, "1"); R(-5, -42, 11, 22, coat); R(3, -41, 2, 20, "2"); R(-3, -50, 7, 8, skin); R(-3, -50, 7, 3, "1")
    if (brolly) { R(7, -62, 1, 30, "V"); c.ellipse(Math.round(x + 7 * s), Math.round(foot - 62 * s), Math.round(17 * s), Math.max(2, Math.round(4 * s)), "u"); c.ellipse(Math.round(x + 7 * s), Math.round(foot - 63 * s), Math.round(15 * s), Math.max(1, Math.round(2 * s)), "U") }
  }
  /** the big screen: a face asleep, its patch, the week's offer */
  const screen = (c, x, y, w, h) => {
    c.rect(x - 2, y - 2, w + 4, h + 4, "k"); c.rect(x, y, w, h, "c")
    const cx = x + Math.round(w * 0.27), cy = y + Math.round(h * 0.5), rx = Math.round(h * 0.22), ry = Math.round(h * 0.3)
    c.ellipse(cx, cy, rx, ry, "v"); c.rect(cx - Math.round(rx * 0.55), cy - 4, Math.round(rx * 0.4), 2, "c"); c.rect(cx + Math.round(rx * 0.15), cy - 4, Math.round(rx * 0.4), 2, "c"); c.rect(cx - 3, cy + Math.round(ry * 0.45), 6, 1, "C")
    c.ellipse(cx + rx + 2, cy, 2, 4, "V")
    text(c, x + Math.round(w * 0.72), y + 5, "LULL", "V"); text(c, x + Math.round(w * 0.72), y + 13, "FREE", "V")
  }
  /** storeys of concrete: windows lit and dark */
  const storeys = (c, x0, x1, y0, y1, step = 28) => {
    for (let x = x0 + 6; x < x1 - 16; x += step) for (let y = y0 + 3; y < y1 - 14; y += 24) {
      const q = ISO.ihash(x, y), k = q < 0.18 ? "Q" : q < 0.3 ? "C" : q < 0.38 ? "M" : "1"
      c.rect(x, y, 16, 15, "k"); c.rect(x + 1, y + 1, 14, 13, k)
    }
  }
  /** the gate facing us: posts, beam, its little roof, the name */
  const gate = (c, x, y, w, h) => {
    c.rect(x, y + 10, 6, h, "M"); c.rect(x + w - 6, y + 10, 6, h, "M"); c.rect(x, y + 10, 2, h, "n"); c.rect(x + w - 6, y + 10, 2, h, "n")
    c.rect(x - 6, y, w + 12, 5, "O"); c.rect(x - 2, y + 5, w + 4, 7, "M"); c.rect(x + Math.round(w / 2) - 25, y + 6, 50, 6, "n"); text(c, x + Math.round(w / 2), y + 6, "JADE ROW", "m")
  }
  // ---------------------------------------------------------------- B: the lane, down its length (metres on the ground: z = 1 is where Juno walks, 30 px to the metre)
  const B = { W: 320, H: 180, VX: 160, VY: 80, EYE: 70, HALF: 105, END: 4.4 }
  // the passage in the right-hand wall, back to Kowalski Street: an arch (z 0.62 to 0.88 along the wall), and through it
  // what the eye sees, cast on: the passage's far side, its floor, its ceiling, the street's cyan coming down it
  const T = { z0: 0.62, z1: 0.88, side: 2.3, rise: 0.62, ceil: 2.75, eye: 70 / 30 }
  const tunnel = (z, h) => {
    const zc = (T.z0 + T.z1) / 2, hw = (T.z1 - T.z0) / 2, q = (z - zc) / hw
    if (Math.abs(q) > 1.12) return null
    const top = T.side + T.rise * Math.sqrt(Math.max(0, 1 - q * q))
    if (h >= top + 0.12) return null
    if (Math.abs(q) > 1 || h >= top) return Math.abs(q) > 1.06 || h >= top + 0.07 ? "4" : "5"           // the arch's concrete, its edge
    // the ray from the eye through this point of the wall plane (m = 3.5) runs on into the passage
    const kWall = T.z1 / z, kFloor = h < T.eye ? T.eye / (T.eye - h) : Infinity, kCeil = h > T.eye ? (T.ceil - T.eye) / (h - T.eye) : Infinity
    const k = Math.min(kWall, kFloor, kCeil), d = 3.5 * k - 3.5, lit = Math.min(1, d / 1.1)
    const b = ISO.bay(Math.round(z * 400), Math.round(h * 40))
    if (k === kCeil) return lit > 0.6 && b < 0.3 ? "c" : "1"
    if (k === kFloor) return d < 0.08 ? "1" : (b < lit * 0.9 ? (lit > 0.7 ? "C" : "c") : Math.floor(d * 14) % 3 === 0 ? "f" : "e")
    // its far side: concrete in rows, a pipe, the light growing towards the street
    const hh = T.eye + k * (h - T.eye)
    if (Math.abs(hh - 2.0) < 0.05) return lit > 0.5 ? "C" : "4"
    if (hh < 0.08) return "1"
    return b < lit * lit ? (lit > 0.75 ? "v" : "C") : b < lit ? "c" : Math.floor(hh / 0.45) % 2 ? "2" : "3"
  }
  // a face on a wall by depth and height: what it shows; null leaves it plain
  const wallKey = (side, z, h, f) => {
    const box = (z0, z1, h0, h1) => z >= z0 && z < z1 && h >= h0 && h < h1
    const lit = ISO.ihash(Math.floor(z * 3) + side * 9, Math.floor(h * 0.9))
    if (side < 0) {
      if (box(0.98, 1.52, 2.3, 2.85)) return "O"
      // Okonkwo's window, his door beside it (wide: the user's, 2026-11-09), the sign over both
      if (box(1.0, 1.22, 0.45, 2.1)) { const s = Math.floor(h * 4); return h < 0.95 ? "P" : (s % 2 === 0 && Math.floor(z * 30) % 2 === 0) ? "P" : "Q" }
      if (box(1.26, 1.7, 0, 2.2)) return box(1.26, 1.29, 0, 2.2) || box(1.67, 1.7, 0, 2.2) || h > 2.14 ? "O" : h < 0.06 ? "P" : "Q"
      // the door out on to the balcony over the shop, lit; no window over it (the user's, 2026-11-09)
      if (box(0.97, 1.2, 2.97, 4.85)) return box(0.97, 0.99, 2.97, 4.85) || box(1.18, 1.2, 2.97, 4.85) || h > 4.79 ? "O" : Math.floor(z * 60) % 7 === 0 ? "P" : "Q"
      if (box(0.9, 1.25, 4.85, 99)) return ((h - 2.95) % 1.05) / 1.05 < 0.08 ? "4" : "2"                  // the facade's plain storeys, as round its windows
      if (box(2.45, 3.2, 0, 2.3)) return h > 1.95 ? "n" : Math.floor(z * 8) % 2 ? "M" : "n"
    } else {
      // the passage back to Kowalski Street: an arch in the near wall, the way through it lit by the street's cyan
      if (z >= 0.6 && z < 0.9) { const k = tunnel(z, h); if (k) return k }
      if (box(1.28, 2.05, 0.3, 2.2)) return h > 1.75 ? "M" : h < 0.95 ? "O" : "Q"
      if (box(2.2, 3.0, 0.4, 2.1)) return h > 1.8 ? "c" : Math.floor(h * 4) % 2 ? "C" : "v"
    }
    if (h < 0.08) return "1"
    if (h > 2.95) { const i = Math.floor(z * 3.4), j = Math.floor((h - 2.95) / 1.05), x = z * 3.4 - i, y = (h - 2.95) / 1.05 - j; if (x > 0.2 && x < 0.8 && y > 0.25 && y < 0.8) { const q = ISO.ihash(i * 7 + side * 3, j * 13); return q < 0.2 ? "Q" : q < 0.32 ? "C" : q < 0.4 ? "M" : "1" } return y < 0.08 ? "4" : "2" }
    return lit < 0.5 ? "3" : "3"
  }
  // a thing at depth z: lateral metres from the middle and height to the screen
  const bP = (m, z, h = 0) => [Math.round(B.VX + m * 30 / z), Math.round(B.VY + B.EYE / z - h * 30 / z)]
  const VX0 = B.VX
  const bPaint = (c) => {
    const { W, H, VX, VY, EYE, HALF, END } = B
    c.rect(0, 0, W, H, "k")
    // the far end: the big screen high on the last block, the gate under it, the lane's glow through it
    const [lx, fy] = bP(-3.5, END), [rx] = bP(3.5, END)
    c.rect(lx, 0, rx - lx, fy, "2"); storeys(c, lx, rx, 0, 30, 18)
    screen(c, lx + 2, 4, rx - lx - 4, 44)
    c.rect(lx + 6, 50, rx - lx - 12, fy - 50, "n"); c.rect(lx + 18, 62, rx - lx - 36, fy - 62, "i")
    gate(c, lx + 8, 50, rx - lx - 16, fy - 60)
    // the floor, row by row
    for (let y = VY + 1; y < H; y++) {
      const z = EYE / (y - VY)
      for (let x = 0; x < W; x++) {
        const m = (x - VX) * z / 30
        if (Math.abs(m) >= 3.5 || z > END) continue
        const walk = Math.abs(m) > 2.6
        const joint = walk && (m * 2 % 1 < 0.05 || z * 2 % 1 < 0.05)
        const kerb = Math.abs(Math.abs(m) - 2.6)
        if (kerb < 0.05 * z) { c.px(x, y, ISO.ihash(Math.floor(z * 6), m < 0 ? 1 : 2) < 0.2 ? "X" : "v"); continue }    // the strip; a stretch of it dead here and there
        if (!walk && kerb < 0.34 && (x + y) % 2 === 0) { c.px(x, y, "T"); continue }                                       // its light on the wet road, dying off
        if (!walk && z > 1.5 && z < 2.5 && (Math.abs(m - 0.75) < 0.2 || Math.abs(m - 1.55) < 0.2)) {                     // the headlights' two streaks on the wet road
          if (y % 2 === 0 && (x + y) % (z < 1.9 ? 4 : 2) === 0) { c.px(x, y, z < 1.9 ? "O" : "P"); continue }
        }
        c.px(x, y, walk ? (joint ? "e" : "z") : "f")
      }
    }
    // the walls, column by column
    for (const side of [-1, 1]) for (let x = side < 0 ? 0 : VX + 1; side < 0 ? x < VX : x < W; x++) {
      const z = HALF / Math.abs(x - VX)
      if (z > END) continue
      const foot = Math.round(VY + EYE / z)
      for (let y = Math.max(0, foot - Math.round(9 * 30 / z)); y < Math.min(H, foot); y++) { const h = (foot - y) * z / 30, k = wallKey(side, z, h, 0); if (k) c.px(x, y, k) }
    }
    // NIGHT MARKET on the right-hand facade, high and in perspective (magenta on a dark plate)
    { const z0 = 1.1, z1 = 2.0, x0 = VX + Math.round(HALF / z1), x1 = VX + Math.round(HALF / z0), h0 = 3.2, h1 = 5.0
      for (let x = x0; x <= x1; x++) {
        const z = HALF / (x - VX), foot = VY + EYE / z, t = (x - x0) / (x1 - x0) * 20
        for (let y = Math.max(0, Math.round(foot - h1 * 30 / z)); y < foot - h0 * 30 / z; y++) {
          const h = (foot - y) * z / 30, row = Math.floor((h1 - h) / (h1 - h0) * 9), id = t < 10 ? "ye" : "shi", col = Math.floor((t < 10 ? t : t - 10.5) * 0.95)
          c.px(x, y, G9[id][row]?.[col] === "#" ? "m" : "n")
        }
      } }
    // the shop's name, foreshortened: drawn on the wall's slope
    const [x0, y0] = bP(-3.5, 1.0, 2.75), [x1] = bP(-3.5, 1.5, 2.75); text(c, Math.round((x0 + x1) / 2), y0 + 5, "OKONKWO", "W")
  }
  // what stands in the lane, far to near: signs sticking out of the walls towards us, portals over the lane with a big lantern each, lines of small lanterns, the arcade, the parked car, people
  const bFront = (c) => {
    const items = []
    const SIGNS = [[3.8, -1, "an", "M", "N", 2.9], [3.8, 1, "zh", "Q", "W", 2.9], [3.0, -1, "tang,zh", "C", "V", 2.9], [2.9, 1, "mi,an", "M", "N", 2.8], [2.15, -1, "dian,an", "Q", "W", 2.7], [2.1, 1, "shui,dian,an", "C", "V", 2.6], [1.72, -1, "mi", "M", "N", 2.9], [1.25, 1, "tang,mi", "Q", "W", 2.5]]
    for (const [z, side, word, board, ink, h] of SIGNS) items.push([z, () => {
      const [xw, yt] = bP(side * 3.5, z, h + word.split(",").length * 0.45), x = side < 0 ? xw : xw - 15
      if (z > 2.5) { const n = word.split(",").length, sz = Math.round(16 / z * 1.2), hh = n * Math.round(13 / z * 1.3); c.rect(x + (side < 0 ? 0 : 15 - sz), yt, sz, hh, "k"); c.rect(x + (side < 0 ? 1 : 16 - sz), yt + 1, sz - 2, hh - 2, board); for (let i = 0; i < n; i++) c.rect(x + (side < 0 ? 3 : 18 - sz), yt + 3 + i * Math.round(13 / z * 1.3), Math.max(2, sz - 6), Math.max(2, Math.round(9 / z)), ink) }
      else sign(c, x, yt, word, board, ink)
    }])
    // the gantries: two posts on the kerbs, an arm reaching in from each, a gap in the middle for the gate, the nearest with a lantern on each arm
    for (const [z, word, lamp] of [[2.6, null, false], [1.78, null, false], [1.35, "ye", true]]) items.push([z, () => {
      const [xl, yf] = bP(-2.8, z), [xr] = bP(2.8, z), [, yt] = bP(0, z, 3.4), t = Math.max(2, Math.round(0.2 * 30 / z)), b = Math.max(2, Math.round(0.22 * 30 / z)), gap = 31
      for (const [post, inner, side] of [[xl - t, VX0 - gap, -1], [xr, VX0 + gap, 1]]) {
        c.rect(post - 1, yt, t + 2, yf - yt, "k"); c.rect(post, yt, t, yf - yt, L.frame); c.rect(side < 0 ? post + t - 1 : post, yt + b, 1, yf - yt - b, L.strip)
        const x0 = Math.min(post, inner), x1 = Math.max(post + t, inner)
        if (x1 - x0 > 2) {
          c.rect(x0, yt - 1, x1 - x0, b + 2, "k"); c.rect(x0, yt, x1 - x0, b, L.frame); c.hline(x0, yt + b - 1, x1 - x0, L.strip)
          const br = Math.min(Math.round(0.8 * 30 / z), x1 - x0 - 2); if (side < 0) c.line(post + t, yt + br + b, post + t + br, yt + b, L.frame); else c.line(post, yt + br + b, post - br, yt + b, L.frame)
          if (lamp) bigLantern(c, Math.round((x0 + x1) / 2) + side * 2, yt + b + Math.round(0.6 * 30 / z), Math.max(3, Math.round(0.4 * 30 / z)), word)
        }
      }
    }])
    for (const [z, sag] of [[3.2, 3], [2.25, 5], [1.45, 8], [1.15, 9]]) items.push([z, () => {
      const [xa, ya] = bP(-3.5, z, 3.3), [xb, yb] = bP(3.5, z, 3.4), n = Math.max(6, Math.round(26 / z)); line(c, xa, ya, xb, yb, sag, n * 2)
    }])
    // cables and neon strips right across the lane, from wall to wall, above the gate
    const across = (z, h, sag, k, thick = 1) => { const [xa, ya] = bP(-3.5, z, h), [xb, yb] = bP(3.5, z, h); for (let x = Math.max(0, xa); x <= Math.min(319, xb); x++) { const t = (x - xa) / (xb - xa), y = Math.round(ya + (yb - ya) * t + Math.sin(t * Math.PI) * sag); for (let n = 0; n < thick; n++) c.px(x, y + n, k) } }
    for (const [z, h, sag] of [[2.3, 5.5, 3], [1.5, 5.1, 6], [1.05, 4.9, 7], [1.28, 4.75, 8]]) items.push([z, () => across(z, h, sag, "k")])
    items.push([1.8, () => { across(1.8, 5.6, 2, "k", 3); across(1.8, 5.6, 2, "m", 2) }])
    items.push([1.16, () => { across(1.16, 5.0, 3, "k", 3); across(1.16, 5.0, 3, "v", 2) }])
    // a balcony on the left-hand facade over the shop: its slab seen from below, a rail, someone leaning on it, washing behind
    items.push([1.1, () => {
      const P = (m, z, h) => bP(m, z, h), z0 = 0.92, z1 = 1.32, h0 = 2.95, h1 = 3.75, m0 = -3.5, m1 = -2.62
      for (let x = P(m0, z0, 0)[0]; x <= P(m1, z1, 0)[0]; x++) {
        // the slab's underside and its front edge, row by row between the near and far edges
        const zf = (30 * m1) / (x - 160)
        const front = zf >= z0 && zf <= z1
        const [, yNear] = P(m0, z0, h0), yFar = front ? P(m1, zf, h0)[1] : yNear
        const yb = Math.max(yNear, yFar) + 2
        for (let y = Math.min(yNear, yFar); y < yb; y++) c.px(x, y, y >= yb - 2 ? "4" : "2")
        if (front) { const yt = P(m1, zf, h1)[1], yf = P(m1, zf, h0)[1]; c.px(x, yt, "5"); c.px(x, yt + 1, "k"); if (x % 4 === 0) c.vline(x, yt + 1, yf - yt - 1, "k") }
      }
      // the rail's near side
      const [xa, yt] = P(m0, z0, h1), [xb] = P(m1, z0, h1), [, yf] = P(m0, z0, h0)
      c.hline(xa, yt, xb - xa, "5"); c.hline(xa, yt + 1, xb - xa, "k"); for (let x = xa; x < xb; x += 4) c.vline(x, yt + 1, yf - yt - 1, "k")
      const [px, pf] = P(-3.05, 1.14, h0); person(c, px, pf, "4", "s", false, 0.82)
      const [wx, wy] = P(-3.4, 1.26, h1 + 0.45); for (const [dx, k] of [[0, "h"], [7, "U"], [14, "H"]]) c.rect(wx + dx, wy + 2, 5, 8, k)
    }])
    // two arcade cabinets with their backs to the left wall, screens towards the lane, someone playing; we see their sides
    for (const [z, bright] of [[2.25, "V"], [1.85, "v"]]) items.push([z, () => {
      const [x, y] = bP(-3.45, z), w = Math.round(0.72 * 30 / z), h = Math.round(1.8 * 30 / z)
      c.rect(x - 1, y - h - 1, w + 3, h + 1, "k"); c.rect(x, y - h, w, h, "3"); c.rect(x + w - 2, y - h + 2, 2, Math.round(h * 0.45), bright); c.rect(x, y - h, w, 2, "M"); c.rect(x + 1, y - Math.round(h * 0.42), w - 4, 2, "2")
    }])
    items.push([1.98, () => { const [x, y] = bP(-2.6, 1.98); person(c, x, y, "4", "s", false, 0.5) }])
    // (the car parked facing us is a prop of its own now, jade_car: at 00:30 it is gone, while the patrol car waits in CAM 07)
    // steam off the soup, people at their depths
    items.push([1.65, () => { const [sx, sy] = bP(3.1, 1.65, 1.4); for (let i = 0; i < 5; i++) c.rect(sx - 2 - i, sy - i * 5, 3, 3, i < 2 ? "h" : "H") }])
    for (const [m, z, coat, skin, br] of [[-2.9, 3.2, "3", "s", true], [2.9, 3.1, "4", "O", true], [-1.4, 3.0, "3", "s", false], [-0.5, 3.3, "4", "O", true], [2.95, 1.95, "3", "s", true]]) items.push([z, () => { const [x, y] = bP(m, z); person(c, x, y, coat, skin, br, 0.62 / z * 1.6) }])
    // the machine on the right-hand kerb, seen from the side: it looks across the lane into the shop's window, its little camera towards it
    items.push([1.15, () => {
      const [mx, my] = bP(2.85, 1.15)
      c.rect(mx, my - 56, 24, 56, "k"); c.rect(mx + 1, my - 55, 22, 54, "3"); c.rect(mx + 1, my - 55, 3, 54, "C"); c.rect(mx - 2, my - 44, 3, 3, "k"); c.px(mx - 1, my - 43, "q"); c.rect(mx + 5, my - 46, 16, 16, "2")
    }])
    items.sort((p, q) => q[0] - p[0]).forEach(([, draw]) => draw())
    // the large lanterns at the picture's top corners, close to us; their cords run out of the picture
    bigLantern(c, 18, 14, 22, "ye", 2); bigLantern(c, 302, 10, 16, "shi", 1)
  }
  // the holo koi: a fish of light swimming across the picture high up and near us, there and back (rows of a projection; the room shows it at alpha 0.35)
  const KOI = { W: 320, H: 76, FRAMES: 80, S: 1.5 }
  const koi = (c) => {
    const S = KOI.S, R = Math.round, f = c.frame ?? 0, back = f >= 40, t = (back ? 79 - f : f) / 39, x = 66 + R(t * (KOI.W - 132)), y = 38 + R(Math.sin(f / 80 * Math.PI * 4) * 4), d = back ? -1 : 1
    const beat = Math.sin(f / 6 * Math.PI * 2), L = R(24 * S)
    // the body from the snout to where the tail begins: round at the head, thin at the end, bending as it swims
    for (let a = -L; a <= L; a++) {
      const s = d * a, u = (L - s) / (2 * L)
      const half = 9.5 * S * Math.pow(Math.sin(Math.PI * Math.min(1, 0.1 + u * 0.82)), 0.7) * (u > 0.75 ? 1 - (u - 0.75) * 1.9 : 1), bend = R(beat * 4 * S * u * u)
      for (let b = -R(half); b <= R(half); b++) {
        const edge = Math.abs(b) >= R(half) - 1, patch = ISO.ihash(Math.floor((s + 60) / 10), Math.floor((b + 18) / 7)) < 0.42, row = (y + b) % 3 === 0
        c.px(x + a, y + b + bend, edge ? "C" : patch ? (row ? "v" : "V") : row ? "C" : "v")
      }
    }
    c.rect(x + d * R(15 * S) - 2, y - R(4 * S), 4, 4, "c"); c.px(x + d * R(15 * S), y - R(4 * S) + 1, "V")   // the eye
    for (let i = 0; i < 5; i++) c.px(x + d * (L + i), y + 3 + i, i < 3 ? "V" : "C")                           // a barbel
    // the dorsal fin, the fins at the chest and belly, moving
    for (let i = 0; i < 24; i++) { const top = y - R(10 * S) - R(Math.sin(i / 23 * Math.PI) * 6); for (let n = 0; n < 3; n++) if ((i + n) % 3) c.px(x + d * (12 - i), top + n, "v") }
    for (let i = 0; i < 13; i++) for (let n = 0; n < 3; n++) if ((i + n) % 3) c.px(x + d * (15 - i - n), y + R(8 * S) + i + R(beat * 2), n ? "C" : "v")
    for (let i = 0; i < 9; i++) c.px(x + d * (-12 - i), y + R(6 * S) + R(i * 0.6), "C")
    // the tail: a fan off the body's end, swinging
    const tx = x - d * L, ty = y + R(beat * 4 * S)
    for (let i = 0; i < 28; i++) for (const o of [-1, -0.7, -0.4, -0.1, 0.2, 0.5, 0.8, 1]) { const q = ty + R(o * i * 0.75) + R(beat * i * 0.3); if ((i + R(o * 5)) % 4) c.px(tx - d * i, q, Math.abs(o) > 0.6 ? "C" : "v") }
  }
  // the steam at the lane's end, lit pink
  const steam = (c) => { c.plume(24, 62, "mMn", { every: 3, life: 22, rise: 46, wind: -0.15, size: [1, 3], seed: 5, frame: c.frame ?? 0 }) }
  // heads and umbrellas of people between us and the lane, along the picture's lower corners
  const crowd = (c) => {
    for (const [x, rx] of [[20, 24], [62, 9]]) { c.ellipse(x, 24, rx, 8, "k"); c.ellipse(x, 22, rx - 2, 3, "1") }
  }
  const bMirror = (c) => {
    const { W, H, VX, VY, EYE } = B
    const src = {}; for (let y = 10; y < VY + 30; y++) { const r = []; for (let x = 0; x < W; x++) r.push(c.key(x, y)); src[y] = r }
    for (let y = VY + 34; y < H; y += 2) {
      const my = VY + 30 - Math.round((y - VY - 34) * 0.9), wob = Math.round(Math.sin(y * 0.9) * 1.4), z = EYE / (y - VY)
      if (!src[my]) continue
      for (let x = 0; x < W; x++) { const m = (x - VX) * z / 30; if (Math.abs(m) > 2.5) continue; const k = ISO.MIRROR[src[my][(x + wob + W) % W]]; if (k && k !== "2" && k !== "1") c.px(x, y, k) }
    }
  }
  // the car parked facing us, its bottom's middle at (x, y): body, windscreen, roof, two lamps, a thin line under it
  const car = (c, x, y) => {
    const w = 24, h = 17
    c.rect(x - w / 2, y - h + 7, w, h - 7, "k"); c.rect(x - w / 2 + 1, y - h + 8, w - 2, h - 10, "3"); c.rect(x - w / 2 + 4, y - h, w - 8, 7, "k"); c.rect(x - w / 2 + 5, y - h + 1, w - 10, 6, "1")
    c.hline(x - w / 2 + 1, y - 7, w - 2, "2"); c.rect(x - w / 2 + 1, y - 6, 4, 2, "W"); c.rect(x + w / 2 - 5, y - 6, 4, 2, "W"); c.rect(x - w / 2, y - 1, w, 1, "e")
  }
  console.log("JADE_CAR " + JSON.stringify(bP(1.15, 2.6)))
  return { B, KOI, bPaint, bMirror, bFront, koi, steam, crowd, car }
})()

scene("jade_row_bg", { w: JS.B.W, h: JS.B.H, bg: "k" }, JS.bPaint, JS.bMirror, JS.bFront,
  glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 }))
// (the koi is out for now, the user's decision 2026-11-07; its drawing stays here for later: JS.koi, shown at alpha 0.5 as prop "jade_koi")
anim("jade_steam", { w: 48, h: 64, frames: 12, fps: 10 }, JS.steam)
anim("jade_crowd", { w: 320, h: 32, frames: 1, fps: 1 }, JS.crowd)
// the parked car as its own prop (game/rooms/jade_row.js puts its top-left at JADE_CAR minus [17, 21]), its lamps' glow inside the margin
sprite("jade_car", { w: 34, h: 26 }, (c) => JS.car(c, 17, 21), glow("RW", { r: 4, strength: 0.35 }))
