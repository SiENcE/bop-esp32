// The title screen's logo (style guide §8a "Title screen"): GLASS SISTER in the letters of our font
// (game/font.js), each pixel of the 5x7 glyph a 3x3 block, the corners the font cuts at 45° cut cleanly
// inside their block. Pale cyan at the top to dark cyan at the foot, a dark scan row every third row, a
// magenta shadow down and right, an ink outline. Under it a cyan rule, a magenta tick and the city:
// HALCYON // LOWER NINTH // 2091.
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
    G: ".#### #.... #.... #.### #...# #...# ####.",
    L: "#.... #.... #.... #.... #.... #.... #####",
    A: ".#### #...# #...# ##### #...# #...# #...#",
    S: ".#### #.... #.... .###. ....# ....# ####.",
    I: "### .#. .#. .#. .#. .#. ###",
    T: "##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..",
    E: "##### #.... #.... ####. #.... #.... #####",
    R: "####. #...# #...# ####. #..#. #...# #...#",
    " ": "... ... ... ... ... ... ...",
  }
  const WORD = "GLASS SISTER", S = 3, GAP = 3, LH = 7 * S
  const widths = [...WORD].map((ch) => GLYPHS[ch].split(" ")[0].length * S)
  const MW = widths.reduce((a, w) => a + w, 0) + (WORD.length - 1) * GAP
  const PAD = 5, W = MW + 2 * PAD + 2, H = LH + 2 * PAD + 12
  const OX = PAD, OY = PAD

  // the words as a mask of pixels, MW x LH
  const mask = new Uint8Array(MW * LH)
  let ox = 0
  ;[...WORD].forEach((ch, i) => {
    const rows = GLYPHS[ch].split(" "), gw = rows[0].length
    const at = (x, y) => (x >= 0 && y >= 0 && x < gw && y < 7 && rows[y][x] === "#")
    for (let cy = 0; cy < 7; cy++) for (let cx = 0; cx < gw; cx++) {
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
    ox += widths[i] + GAP
  })
  const on = (x, y) => x >= 0 && y >= 0 && x < MW && y < LH && mask[y * MW + x] === 1

  /** the letters' key at a row: pale at the top, dark at the foot, a scan row every third */
  const shade = (y) => {
    const k = y < 5 ? "V" : y < 15 ? "v" : "C"
    return y % 3 === 2 ? { V: "v", v: "C", C: "c" }[k] : k
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
    // the rule, the tick and the city under the words
    const ry = OY + LH + 6, place = "HALCYON // LOWER NINTH // 2091", tw = place.length * 4 - 1
    const tx = Math.round(OX + (MW - tw) / 2), left = tx - 9 - OX, right = OX + MW - (tx + tw + 4)
    c.rect(OX - 1, ry - 1, left + 2, 3, "k"); c.rect(tx - 7, ry - 4, tw + 10, 9, "k"); c.rect(tx + tw + 3, ry - 1, right + 2, 3, "k")   // an ink plate: the street behind is busy
    c.rect(OX, ry, left, 1, "C"); c.rect(OX, ry, Math.min(14, left), 1, "v")
    c.rect(tx - 5, ry - 2, 2, 5, "m")
    c.text(tx, ry - 2, place, "6")
    c.rect(tx + tw + 4, ry, right, 1, "C")
  }

  // still most of the time; a glitch, a pause, a smaller one
  const FRAMES = [
    [2600, {}],
    [70, { split: 2, slips: [[7, 3, 5]] }],
    [60, { slips: [[14, 3, -4]], scratch: 11 }],
    [1500, {}],
    [50, { split: 1, slips: [[3, 2, 3]] }],
    [900, {}],
  ]
  anim("title_logo", { w: W, h: H, frames: FRAMES.length, ms: FRAMES.map(([ms]) => ms) }, (c) => paint(c, FRAMES[c.frame][1]))
}
