// The city's new name, Nagiwa (凪輪: nagi, the dead calm at sea, and wa, the ring), in the ways it could be written: a sheet to
// choose from, in the game's own fonts (art/lib/text.js), the two characters from art/lib/kanji.js. Not built into the game.
pal({ k: "#06080f", a: "#131a2a", b: "#1a2337", g: "#617aa0", h: "#a8b8d0", c: "#62def0", C: "#dafcff", m: "#a8238a", M: "#ff4fd3" })
include("../lib/text.js")

include("../lib/kanji.js")
const KANJI_AT = (c, x, y, key, s = 1) => KANJI.draw(c, x, y, key, s)

scene("nagiwa_logo", { w: 240, h: 200, bg: "k" }, (c) => {
  const rows = ["NAGIWA", "Nagiwa", "NAGI·WA", "NAGI-WA", "NAGI'WA", "NAGI\\WA", "nagiwa"]
  rows.forEach((s, i) => {
    const y = 6 + i * 14
    TXT.draw(c, 6, y, String(i + 1), "g", { font: "hud" })
    TXT.draw(c, 16, y, s, "C")
  })
  // 8: the characters, small and twice as large
  TXT.draw(c, 6, 108, "8", "g", { font: "hud" })
  KANJI_AT(c, 16, 104, "C")
  KANJI_AT(c, 60, 98, "C", 2)
  // the sign: as an ad on the big screen would carry it, in each of the two leading ways
  c.rect(124, 6, 110, 40, "a"); c.rect(126, 8, 106, 36, "b")
  TXT.draw(c, 179, 14, "NAGI·WA", "c", { align: "center" }); TXT.draw(c, 179, 30, "SLEEP BETTER", "h", { font: "hud", align: "center" })
  c.rect(124, 52, 110, 40, "a"); c.rect(126, 54, 106, 36, "b")
  KANJI_AT(c, 165, 58, "c"); TXT.draw(c, 179, 76, "SLEEP BETTER", "h", { font: "hud", align: "center" })
  c.rect(124, 98, 110, 40, "m"); c.rect(126, 100, 106, 36, "a")
  KANJI_AT(c, 132, 106, "M"); TXT.draw(c, 165, 109, "NAGIWA", "M"); TXT.draw(c, 165, 121, "SLEEP BETTER", "h", { font: "hud" })
  // as Halcyon's words stood in the game: the corner of a camera's display, the deck's NETZ header
  TXT.draw(c, 6, 150, "NAGIWA CIVIC MONITOR // CAM 03", "g", { font: "hud" })
  TXT.draw(c, 6, 160, "NAGIWA.NET", "c", { font: "hud" })
  TXT.draw(c, 6, 172, "Nagiwa dankt Ihnen für Ihren Dienst.", "c")
  TXT.draw(c, 6, 186, "Die von Nagiwa sind immer freundlich.", "h")
})
