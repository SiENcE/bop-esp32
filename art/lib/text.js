// Write with the game's own fonts in pxl art (game/glyphs.js: the very glyphs game/font.js gives the engine),
// laid out as the engine's Cutaway.font draws them: y is the top of the capitals, 1 px between glyphs, a
// space as wide as its glyph, "\n" for lines (halcyon 10 px apart, hud 7), an outline in the 8 neighbours.
// For mockups and any art that shows the game's own interface, so its text reads as it will in the game.
// Include it after a palette (it has none):
//
//   include("../lib/text.js")
//   TXT.draw(c, 4, 4, "Teo schläft", "V", { font: "halcyon", outline: "k", align: "left" })
//   TXT.measure("CHAT", "hud")                           // the width in px
//
// The hud font is capitals only: TXT upper-cases text for it, as the game does.
include("../../game/glyphs.js")

const TXT = {
  LINE: { halcyon: 10, hud: 7 },
  /** @param {string} s @param {string} [font] */
  measure(s, font = "halcyon") {
    const G = HALCYON_GLYPHS[font], t = font === "hud" ? s.toUpperCase() : s
    return Math.max(...t.split("\n").map((line) => {
      let w = 0
      for (const ch of line) { const g = G[ch] ?? G["?"]; w += (Array.isArray(g) ? g : g.rows)[0].length + 1 }
      return w ? w - 1 : 0
    }))
  },
  /** @param {any} c a pxl canvas @param {number} x @param {number} y @param {string} s @param {string} key
   *  @param {{font?: string, align?: "left" | "center" | "right", outline?: string}} [o] */
  draw(c, x, y, s, key, o = {}) {
    const font = o.font ?? "halcyon", G = HALCYON_GLYPHS[font], t = font === "hud" ? s.toUpperCase() : s
    const pass = (k, ox, oy) => t.split("\n").forEach((line, i) => {
      const w = TXT.measure(line, font)
      let cx = Math.round(x) + ox - (o.align === "center" ? Math.floor(w / 2) : o.align === "right" ? w : 0)
      const cy = Math.round(y) + oy + i * TXT.LINE[font]
      for (const ch of line) {
        const g = G[ch] ?? G["?"], rows = Array.isArray(g) ? g : g.rows, dy = Array.isArray(g) ? 0 : g.dy
        if (ch !== " ") rows.forEach((r, ry) => { for (let rx = 0; rx < r.length; rx++) if (r[rx] === "#") c.px(cx + rx, cy + dy + ry, k) })
        cx += rows[0].length + 1
      }
    })
    if (o.outline) for (const [dx, dy] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) pass(o.outline, dx, dy)
    pass(key, 0, 0)
  },
}
