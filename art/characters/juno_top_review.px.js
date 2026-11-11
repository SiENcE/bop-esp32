// Review sheet for art/characters/juno_top.px.js (never built into the game): every pose of every direction, at 1x on the
// market's floor tones, the approved blocks' walk beside it (art/test/juno_oben_blocks.px.js).
include("juno_top.px.js")
include("../lib/text.js")
pal({ k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 4: "#2f3e5a", 6: "#617aa0", v: "#62def0", a: "#2c2026", A: "#4a3026" })
const COLS = [["idle", 0], ["idle", 1], ["idle", 2], ["idle", 3], ["walk", 0], ["walk", 1], ["walk", 2], ["walk", 3], ["walk", 4], ["walk", 5], ["walk", 6], ["walk", 7], ["talk", 0], ["talk", 1]]
const MS = { idle: [0, 1600, 2500, 3900], walk: [0, 100, 200, 300, 400, 500, 600, 700], talk: [0, 200] }
sprite("juno_top_blatt", { w: 320, h: 118 }, (c) => {
  c.rect(0, 0, 320, 118, "1")
  TXT.draw(c, 4, 2, "JUNO VON OBEN, GEMALT AUF DEN BLÖCKEN VON A", "v", { font: "hud" })
  TXT.draw(c, 36, 12, "STEHEN, SCHAUEN", "6", { font: "hud" }); TXT.draw(c, 116, 12, "GANG 1-8", "6", { font: "hud" }); TXT.draw(c, 276, 12, "REDEN", "6", { font: "hud" })
  ;["UNTEN", "OBEN", "RECHTS", "LINKS"].forEach((lab, r) => {
    const y = 19 + r * 22
    c.rect(0, y, 320, 21, r & 1 ? "a" : "A")
    TXT.draw(c, 4, y + 8, lab, "6", { font: "hud" })
    const dir = ["down", "up", "right", "left"][r]
    COLS.forEach(([kind, i], j) => c.stamp(`juno_top_${kind}_${dir}`, 34 + j * 20, y, { t: MS[kind][i] }))
  })
  TXT.draw(c, 4, 19 + 4 * 22 + 2, "LINKS IST ECHT: DIE TASCHE BLEIBT AN IHRER LINKEN HÜFTE", "4", { font: "hud" })
})
