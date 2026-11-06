// Jade Row, the lane left of Kowalski Street (the user chose this stage of three, 2026-11-06; the others: docs/rooms/jade_row_a_wand_x3.png, jade_row_c_ebenen_x3.png, and the
// iso blocks jade_row_blocks_x3.png). BLOCKS, 320x180: looking down the lane, one vanishing point, both facades running away, signs sticking out towards us one behind the
// other, the gate and the big screen at its far end; the machine stands opposite the shop, so it really sees into the window.
// The tall signs carry glyphs, the shops' names stay English (the user's decision, 2026-11-06).
include("../lib/iso.js", { palette: true })
include("../lib/text.js")

const JS = (() => {
  const G9 = {
    mi: ["....#....", ".#..#..#.", "..#.#.#..", "....#....", "#########", "....#....", "..#.#.#..", ".#..#..#.", "#...#...#"],
    dian: ["....#....", ".#######.", ".#..#..#.", ".#######.", ".#..#..#.", ".#######.", "....#...#", "....#...#", "....#####"],
    an: ["....#....", "#########", "#.......#", "...#.....", "#########", "..#...#..", ".#.#.#...", "...##....", ".##..##.."],
    shui: ["....#....", "....#...#", "#.#.#..#.", ".#..#.#..", ".#..##...", ".#..#.#..", "#...#..#.", "....#...#", "...##...."],
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
  const lantern = (c, x, y) => { c.vline(x + 2, y - 3, 3, "k"); c.rect(x, y, 5, 7, "Q"); c.rect(x + 1, y + 1, 3, 5, "R"); c.hline(x + 1, y - 1, 3, "k"); c.hline(x + 1, y + 7, 3, "k") }
  /** a line of cable or lanterns with its sag */
  const line = (c, x0, y0, x1, y1, sag, lamps) => {
    let n = 0
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / (x1 - x0), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag)
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
    const cx = x + Math.round(w * 0.25), cy = y + Math.round(h * 0.52), rx = Math.round(h * 0.34), ry = Math.round(h * 0.45)
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
  // a face on a wall by depth and height: what it shows; null leaves it plain
  const wallKey = (side, z, h, f) => {
    const box = (z0, z1, h0, h1) => z >= z0 && z < z1 && h >= h0 && h < h1
    const lit = ISO.ihash(Math.floor(z * 3) + side * 9, Math.floor(h * 0.9))
    if (side < 0) {
      if (box(0.98, 1.52, 2.3, 2.85)) return "O"
      if (box(1.0, 1.42, 0.45, 2.1)) { const s = Math.floor(h * 4); return h < 0.95 ? "P" : (s % 2 === 0 && Math.floor(z * 30) % 2 === 0) ? "P" : "Q" }
      if (box(1.46, 1.68, 0, 2.15)) return "Q"
      if (box(1.95, 2.9, 0, 2.3)) return h > 1.95 ? "n" : Math.floor(z * 8) % 2 ? "M" : "n"
    } else {
      if (box(1.28, 2.05, 0.3, 2.2)) return h > 1.75 ? "M" : h < 0.95 ? "O" : "Q"
      if (box(2.2, 3.0, 0.4, 2.1)) return h > 1.8 ? "c" : Math.floor(h * 4) % 2 ? "C" : "v"
    }
    if (h < 0.08) return "1"
    if (h > 2.95) { const i = Math.floor(z * 3.4), j = Math.floor((h - 2.95) / 1.05), x = z * 3.4 - i, y = (h - 2.95) / 1.05 - j; if (x > 0.2 && x < 0.8 && y > 0.25 && y < 0.8) { const q = ISO.ihash(i * 7 + side * 3, j * 13); return q < 0.2 ? "Q" : q < 0.32 ? "C" : q < 0.4 ? "M" : "1" } return y < 0.08 ? "4" : "2" }
    return lit < 0.5 ? "3" : "3"
  }
  // a thing at depth z: lateral metres from the middle and height to the screen
  const bP = (m, z, h = 0) => [Math.round(B.VX + m * 30 / z), Math.round(B.VY + B.EYE / z - h * 30 / z)]
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
        c.px(x, y, Math.abs(Math.abs(m) - 2.6) < 0.04 * z ? "X" : walk ? (joint ? "e" : "z") : "f")
      }
    }
    // the walls, column by column
    for (const side of [-1, 1]) for (let x = side < 0 ? 0 : VX + 1; side < 0 ? x < VX : x < W; x++) {
      const z = HALF / Math.abs(x - VX)
      if (z > END) continue
      const foot = Math.round(VY + EYE / z)
      for (let y = Math.max(0, foot - Math.round(9 * 30 / z)); y < Math.min(H, foot); y++) { const h = (foot - y) * z / 30, k = wallKey(side, z, h, 0); if (k) c.px(x, y, k) }
    }
    // the shop's name, foreshortened: drawn on the wall's slope
    const [x0, y0] = bP(-3.5, 1.0, 2.75), [x1] = bP(-3.5, 1.5, 2.75); text(c, Math.round((x0 + x1) / 2), y0 + 10, "OKONKWO", "W")
  }
  // signs sticking out of the walls towards us, far to near, so the near ones overlap the far; lines of lanterns across the lane
  const bFront = (c) => {
    const SIGNS = [[3.8, -1, "an", "M", "N", 2.9], [3.8, 1, "zh", "Q", "W", 2.9], [3.0, -1, "tang,zh", "C", "V", 2.9], [2.9, 1, "mi,an", "M", "N", 2.8], [2.15, -1, "dian,an", "Q", "W", 2.7], [2.1, 1, "shui,dian,an", "C", "V", 2.6], [1.72, -1, "mi", "M", "N", 2.9], [1.25, 1, "tang,mi", "Q", "W", 2.5]]
    for (const [z, side, word, board, ink, h] of SIGNS) {
      const [xw, yt] = bP(side * 3.5, z, h + word.split(",").length * 0.45), x = side < 0 ? xw : xw - 15
      if (z > 2.5) { const n = word.split(",").length, s = Math.round(16 / z * 1.2), hh = n * Math.round(13 / z * 1.3); c.rect(x + (side < 0 ? 0 : 15 - s), yt, s, hh, "k"); c.rect(x + (side < 0 ? 1 : 16 - s), yt + 1, s - 2, hh - 2, board); for (let i = 0; i < n; i++) c.rect(x + (side < 0 ? 3 : 18 - s), yt + 3 + i * Math.round(13 / z * 1.3), Math.max(2, s - 6), Math.max(2, Math.round(9 / z)), ink) }
      else sign(c, x, yt, word, board, ink)
    }
    for (const [z, sag] of [[3.2, 3], [2.4, 5], [1.7, 7], [1.15, 9]]) {
      const [xa, ya] = bP(-3.5, z, 3.3), [xb, yb] = bP(3.5, z, 3.4), n = Math.max(6, Math.round(26 / z)); line(c, xa, ya, xb, yb, sag, n * 2)
    }
    // the machine on the right-hand kerb, seen from the side: it looks across the lane into the shop's window, its little camera towards it
    const [mx, my] = bP(2.85, 1.15)
    c.rect(mx, my - 56, 24, 56, "k"); c.rect(mx + 1, my - 55, 22, 54, "3"); c.rect(mx + 1, my - 55, 3, 54, "C"); c.rect(mx - 2, my - 44, 3, 3, "k"); c.px(mx - 1, my - 43, "q"); c.rect(mx + 5, my - 46, 16, 16, "2")
    // the steam off the soup, people at their depths
    const [sx, sy] = bP(3.1, 1.65, 1.4); for (let i = 0; i < 5; i++) c.rect(sx - 2 - i, sy - i * 5, 3, 3, i < 2 ? "h" : "H")
    const pp = (m, z, coat, skin, br) => { const [x, y] = bP(m, z); person(c, x, y, coat, skin, br, 0.62 / z * 1.6) }
    pp(-2.9, 2.7, "3", "s", true); pp(2.9, 3.1, "4", "O", true); pp(-1.0, 2.4, "3", "s", false); pp(1.6, 2.0, "4", "O", true); pp(-2.9, 1.8, "3", "s", true)
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
  return { B, bPaint, bMirror, bFront }
})()

scene("jade_row_bg", { w: JS.B.W, h: JS.B.H, bg: "k" }, JS.bPaint, JS.bMirror, JS.bFront,
  glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 }))
