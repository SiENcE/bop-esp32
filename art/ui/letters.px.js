// Shared by the title art (art/ui/splash.px.js, art/ui/logo.px.js): GLASS SISTER in our font's letters
// (game/font.js), each pixel of a 5x7 glyph a block of `sc` x `sc`, the corners the font cuts at 45° (and
// its diagonals) cut cleanly inside their block; and the title block both screens show. No palette: the
// includer's palette has the keys named below.

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

// the camera display's 3x5 capitals (game/font.js "hud"), for readouts drawn into a buffer
const HUD3 = {
  " ": "... ... ... ... ...", "/": "..# ..# .#. #.. #..", ".": ". . . . #", ":": ". # . # .", "·": ". . # . .",
  A: ".#. #.# ### #.# #.#", C: ".## #.. #.. #.. .##", E: "### #.. ##. #.. ###", H: "#.# #.# ### #.# #.#",
  I: "### .#. .#. .#. ###", L: "#.. #.. #.. #.. ###", N: "##. #.# #.# #.# #.#", O: ".#. #.# #.# #.# .#.",
  R: "##. #.# ##. #.# #.#", S: ".## #.. .#. ..# ##.", T: "### .#. .#. .#. .#.", V: "#.# #.# #.# #.# .#.",
  W: "#.# #.# ### ### #.#", Y: "#.# #.# .#. .#. .#.", J: "..# ..# ..# #.# .#.", B: "##. #.# ##. #.# ##.",
  M: "#.# ### ### #.# #.#", G: ".## #.. #.# #.# .##", K: "#.# #.# ##. #.# #.#", P: "##. #.# ##. #.. #..",
  U: "#.# #.# #.# #.# ###", D: "##. #.# #.# #.# ##.", F: "### #.. ##. #.. #..", "?": "##. ..# .#. ... .#.",
  0: "### #.# #.# #.# ###", 1: ".#. ##. .#. .#. ###", 2: "##. ..# .#. #.. ###", 3: "##. ..# .#. ..# ##.",
  4: "#.# #.# ### ..# ..#", 5: "### #.. ##. ..# ##.", 6: ".## #.. ### #.# ###", 7: "### ..# .#. .#. .#.",
  8: "### #.# ### #.# ###", 9: "### #.# ### ..# ##.",
}
/** Write a readout into a buffer: put(x, y, key); returns its width. */
function hudText(put, x, y, text, key) {
  let cx = x
  for (const ch of text) {
    const rows = (HUD3[ch] ?? HUD3["?"]).split(" ")
    rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === "#") put(cx + i, y + j, key) })
    cx += rows[0].length + 1
  }
  return cx - x - 1
}
const hudWidth = (text) => [...text].reduce((w, ch) => w + (HUD3[ch] ?? HUD3["?"]).split(" ")[0].length + 1, 0) - 1

/**
 * The title block, the same on the title screen and the menu screen: a magenta rule, GLASS SISTER as
 * outline letters at 3x in one pale colour (no gradient, no shadow), a magenta rule, and the place spaced
 * out under it: NAGI·WA . LOWER NINTH . 2091. `w` and `h` its size from its top left. Keys: "V" the
 * letters, "m" the rules and the glitch's magenta, "v" the place and the glitch's cyan.
 */
function titleBlock() {
  const T = titleLetters("GLASS SISTER", 3, 3), SIDE = 10
  const place = "NAGI·WA . LOWER NINTH . 2091", STEP = 6, pw = place.length * STEP - 3
  const w = T.w + 2 * SIDE, h = T.h + 21
  return {
    w, h,
    /** into a buffer: put(x, y, key); o.split: the glitch's split in px */
    draw(put, x0, y0, o = {}) {
      const tx = x0 + SIDE, ty = y0 + 6
      for (let x = x0; x < x0 + w; x++) { put(x, y0, "m"); put(x, ty + T.h + 5, "m") }
      if (o.split) for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) if (T.stroke(x, y)) { put(tx + x - o.split, ty + y, "m"); put(tx + x + o.split, ty + y, "v") }
      for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) if (T.stroke(x, y)) put(tx + x, ty + y, "V")
      const px0 = x0 + Math.round((w - pw) / 2)
      ;[...place].forEach((ch, i) => { if (ch !== " ") hudText(put, px0 + i * STEP, ty + T.h + 10, ch, "v") })
    },
  }
}
