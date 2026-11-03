// Shared by the title art (art/ui/splash.px.js, art/ui/logo.px.js): GLASS SISTER in our font's letters
// (game/font.js), each pixel of a 5x7 glyph a block of `sc` x `sc`, the corners the font cuts at 45° (and
// its diagonals) cut cleanly inside their block. No palette: the includer paints the mask.

const TITLE_GLYPHS = {
  G: ".#### #.... #.... #.### #...# #...# ####.", L: "#.... #.... #.... #.... #.... #.... #####",
  A: ".#### #...# #...# ##### #...# #...# #...#", S: ".#### #.... #.... .###. ....# ....# ####.",
  I: "### .#. .#. .#. .#. .#. ###", T: "##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..",
  E: "##### #.... #.... ####. #.... #.... #####", R: "####. #...# #...# ####. #..#. #...# #...#",
  " ": "... ... ... ... ... ... ...",
}

/** The word as a mask: { w, h, filled(x, y), stroke(x, y) (the outline only) }. */
function titleLetters(word, sc, gap) {
  const widths = [...word].map((ch) => TITLE_GLYPHS[ch].split(" ")[0].length * sc)
  const w = widths.reduce((a, b) => a + b, 0) + (word.length - 1) * gap, h = 7 * sc
  const fill = new Uint8Array(w * h)
  let gx = 0
  ;[...word].forEach((ch, i) => {
    const rows = TITLE_GLYPHS[ch].split(" "), gw = rows[0].length
    const at = (x, y) => x >= 0 && y >= 0 && x < gw && y < 7 && rows[y][x] === "#"
    for (let cy = 0; cy < 7; cy++) for (let cx = 0; cx < gw; cx++) for (let py = 0; py < sc; py++) for (let px = 0; px < sc; px++) {
      let on = at(cx, cy)
      if (!on) for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        if (at(cx + dx, cy) && at(cx, cy + dy) && !at(cx + dx, cy + dy)) {
          const u = dx > 0 ? px : sc - 1 - px, v = dy > 0 ? py : sc - 1 - py
          if (u + v >= sc - 1) on = true
        }
      }
      if (on) fill[(cy * sc + py) * w + gx + cx * sc + px] = 1
    }
    gx += widths[i] + gap
  })
  const filled = (x, y) => x >= 0 && y >= 0 && x < w && y < h && fill[y * w + x] === 1
  const stroke = (x, y) => filled(x, y) && (!filled(x - 1, y) || !filled(x + 1, y) || !filled(x, y - 1) || !filled(x, y + 1))
  return { w, h, filled, stroke }
}

/**
 * The title block, the same on the title screen and the menu screen: a magenta rule, GLASS SISTER as
 * outline letters at 3x in one pale colour, a magenta rule, HALCYON · LOWER NINTH · 2091 spaced out.
 * `row` is the width of the rules; the block is `h` high from its top (the upper rule). Keys: "V" the
 * letters, "m" the rules, "v" the place (and the glitch's cyan), as the includer's palette has them.
 */
function titleBlock(row) {
  const T = titleLetters("GLASS SISTER", 3, 3)
  const h = T.h + 21
  return {
    h,
    /** the rules and the letters into a buffer: put(x, y, key); o.split: the glitch's split in px */
    draw(put, x0, y0, o = {}) {
      const tx = x0 + Math.round((row - T.w) / 2), ty = y0 + 6
      for (let x = x0; x < x0 + row; x++) { put(x, y0, "m"); put(x, ty + T.h + 5, "m") }
      if (o.split) for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) if (T.stroke(x, y)) { put(tx + x - o.split, ty + y, "m"); put(tx + x + o.split, ty + y, "v") }
      for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) if (T.stroke(x, y)) put(tx + x, ty + y, "V")
    },
    /** the place, written straight onto the canvas (after the buffer) */
    place(c, x0, y0) {
      const place = "HALCYON · LOWER NINTH · 2091", step = 6, pw = place.length * step - 2
      ;[...place].forEach((ch, i) => { if (ch !== " ") c.text(x0 + Math.round((row - pw) / 2) + i * step, y0 + 6 + T.h + 10, ch === "·" ? "." : ch, "v") })
    },
  }
}
