// The title screen's logo (style guide §8a "Title screen"): HALCYON in the letters of our font
// (game/font.js), each pixel of the 5x7 glyph a 4x4 block, the corners the font cuts at 45° (and the
// diagonals of Y and N) cut cleanly inside their block. Pale cyan at the top to dark cyan at the foot,
// a dark scan row every fourth row, a magenta shadow down and right, an ink outline. Under it a cyan
// rule, a magenta tick and LOWER NINTH // 2091.
//
//   title_logo   an animation: it stands still most of the time and glitches now and then (a split
//                into magenta and cyan, a band slipping sideways, a magenta scratch), about 5 s a loop
//
// Built procedurally: the letters into a buffer of keys, the frame's glitch over it, then the outline.

pal({
  k: "#0c0e1a",
  V: "#dafcff", v: "#62def0", C: "#1f88a4", c: "#123c4e",
  M: "#a8238a", m: "#ff4fd3",
  6: "#617aa0",
})

{
  const GLYPHS = {
    H: "#...# #...# #...# ##### #...# #...# #...#",
    A: ".#### #...# #...# ##### #...# #...# #...#",
    L: "#.... #.... #.... #.... #.... #.... #####",
    C: ".#### #.... #.... #.... #.... #.... #####",
    Y: "#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..",
    O: ".#### #...# #...# #...# #...# #...# ####.",
    N: "#...# ##..# #.#.# #..## #...# #...# #...#",
  }
  const WORD = "HALCYON", S = 4, GAP = 4, LW = 5 * S, LH = 7 * S
  const MW = WORD.length * LW + (WORD.length - 1) * GAP
  const PAD = 5, W = MW + 2 * PAD + 2, H = LH + 2 * PAD + 12
  const OX = PAD, OY = PAD

  // the word as a mask of pixels, MW x LH
  const mask = new Uint8Array(MW * LH)
  ;[...WORD].forEach((ch, i) => {
    const rows = GLYPHS[ch].split(" "), at = (x, y) => (x >= 0 && y >= 0 && x < 5 && y < 7 && rows[y][x] === "#")
    const ox = i * (LW + GAP)
    for (let cy = 0; cy < 7; cy++) for (let cx = 0; cx < 5; cx++) {
      for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
        let on = at(cx, cy)
        if (!on) for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
          // a cell between two set neighbours round an empty corner: fill the half toward them (a 45° cut)
          if (at(cx + dx, cy) && at(cx, cy + dy) && !at(cx + dx, cy + dy)) {
            const u = dx > 0 ? px : S - 1 - px, w = dy > 0 ? py : S - 1 - py
            if (u + w >= S - 1) on = true
          }
        }
        if (on) mask[(cy * S + py) * MW + ox + cx * S + px] = 1
      }
    }
  })
  const on = (x, y) => x >= 0 && y >= 0 && x < MW && y < LH && mask[y * MW + x] === 1

  /** the letters' key at a row: pale at the top, dark at the foot, a scan row every fourth */
  const shade = (y) => {
    const k = y < 7 ? "V" : y < 20 ? "v" : "C"
    return y % 4 === 3 ? { V: "v", v: "C", C: "c" }[k] : k
  }

  /** one frame: o.split (px of the magenta/cyan split), o.slips ([row, rows, dx]), o.scratch (a row) */
  function paint(c, o = {}) {
    const B = new Array(W * H).fill(null)
    const put = (x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    for (let y = 0; y < LH; y++) for (let x = 0; x < MW; x++) if (on(x, y)) put(OX + x + 2, OY + y + 2, "M")      // the shadow
    if (o.split) for (let y = 0; y < LH; y++) for (let x = 0; x < MW; x++) if (on(x, y)) {
      put(OX + x - o.split, OY + y, "m"); put(OX + x + o.split, OY + y, "v")
    }
    for (let y = 0; y < LH; y++) for (let x = 0; x < MW; x++) if (on(x, y)) put(OX + x, OY + y, shade(y))
    if (o.scratch !== undefined) for (let x = 0; x < MW; x++) if (on(x, o.scratch)) put(OX + x, OY + o.scratch, "m")
    for (const [row, rows, dx] of o.slips ?? []) for (let y = OY + row; y < OY + row + rows; y++) {
      const line = B.slice(y * W, y * W + W)
      for (let x = 0; x < W; x++) B[y * W + x] = line[x - dx] ?? null
    }
    // the ink outline round everything
    const ink = B.slice()
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (B[y * W + x]) continue
      let near = false
      for (let j = -1; j <= 1 && !near; j++) for (let i = -1; i <= 1; i++) {
        const xx = x + i, yy = y + j
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && B[yy * W + xx]) { near = true; break }
      }
      if (near) ink[y * W + x] = "k"
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ink[y * W + x]) c.px(x, y, ink[y * W + x])
    // the rule, the tick and the place under the word
    const ry = OY + LH + 6
    c.rect(OX - 1, ry - 1, 46, 3, "k"); c.rect(OX + 45, ry - 4, 82, 9, "k"); c.rect(OX + MW - 31, ry - 1, 32, 3, "k")   // an ink plate: the street behind is busy
    c.rect(OX, ry, 44, 1, "C"); c.rect(OX, ry, 14, 1, "v")
    c.rect(OX + 47, ry - 2, 2, 5, "m")
    c.text(OX + 53, ry - 2, "LOWER NINTH // 2091", "6")
    c.rect(OX + MW - 30, ry, 30, 1, "C")
  }

  // still most of the time; a glitch, a pause, a smaller one
  const FRAMES = [
    [2600, {}],
    [70, { split: 2, slips: [[9, 4, 5]] }],
    [60, { slips: [[18, 4, -4]], scratch: 15 }],
    [1500, {}],
    [50, { split: 1, slips: [[3, 2, 3]] }],
    [900, {}],
  ]
  anim("title_logo", { w: W, h: H, frames: FRAMES.length, ms: FRAMES.map(([ms]) => ms) }, (c) => paint(c, FRAMES[c.frame][1]))
}
