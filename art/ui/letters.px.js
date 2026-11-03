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
