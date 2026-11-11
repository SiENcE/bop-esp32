// Review sheet for art/characters/markt_people.px.js (never built into the game): every figure of the Drain Market from above in
// every pose and direction, at 1x on the market's floor tones, Juno from above beside them for their size.
include("markt_people.px.js")
include("juno_top.px.js")
include("../lib/text.js")
pal({ k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 4: "#2f3e5a", 6: "#617aa0", v: "#62def0", a: "#2c2026", A: "#4a3026" })
const DIRS = ["down", "up", "right", "left"], DIRL = ["UNTEN", "OBEN", "RECHTS", "LINKS"]
sprite("markt_people_blatt", { w: 500, h: 760 }, (c) => {
  c.rect(0, 0, 500, 760, "1")
  TXT.draw(c, 4, 2, "DIE LEUTE AUF DEM DRAIN-MARKT VON OBEN, GEMALT AUF DEN BLÖCKEN", "v", { font: "hud" })
  /** a figure's frame, its centre at (x, y) */
  const put = (name, x, y, frame, size) => c.stamp(name, x - (size - 1) / 2, y - (size - 1) / 2, { frame })
  let y = 12
  const band = (h, r, label) => { c.rect(0, y, 500, h, r & 1 ? "a" : "A"); TXT.draw(c, 4, y + (h >> 1) - 2, label, "6", { font: "hud" }) }
  const head = (label, cols) => { TXT.draw(c, 4, y + 1, label, "v", { font: "hud" }); cols.forEach(([x, l]) => TXT.draw(c, x, y + 1, l, "6", { font: "hud" })); y += 9 }
  // Ratz: idle 6, talk 4, each direction
  head("RATZ", [[44, "STEHT: NASE, STECKER, OHR"], [214, "REDET: KRAGEN, SCHNAUZE"]])
  DIRS.forEach((d, r) => {
    band(32, r, DIRL[r])
    for (let i = 0; i < 6; i++) put(`ratz_top_idle_${d}`, 56 + i * 27, y + 16, i, 31)
    for (let i = 0; i < 4; i++) put(`ratz_top_talk_${d}`, 226 + i * 27, y + 16, i, 31)
    y += 32
  })
  y += 3
  // the preacher: idle 8, talk 2
  head("PREDIGER", [[44, "STARRT, LECKT SEIN AUGE"], [300, "PREDIGT"]])
  DIRS.forEach((d, r) => {
    band(28, r, DIRL[r])
    for (let i = 0; i < 8; i++) put(`prediger_top_idle_${d}`, 56 + i * 29, y + 14, i, 27)
    for (let i = 0; i < 2; i++) put(`prediger_top_talk_${d}`, 300 + i * 29, y + 14, i, 27)
    y += 28
  })
  y += 3
  // the vendors: per vendor a row, the four directions side by side (idle 4, talk 2)
  head("HÄNDLER", [[44, "ARBEITET 1-3, SCHAUT AUF; REDET 1-2 (UNTEN, OBEN, RECHTS, LINKS)"]])
  ;["SCHÜRZE", "MÜTZE", "KAPUZE"].forEach((lab, n) => {
    band(20, n, lab)
    DIRS.forEach((d, j) => {
      for (let i = 0; i < 4; i++) put(`haendler_top_${n + 1}_idle_${d}`, 52 + j * 116 + i * 19, y + 10, i, 21)
      for (let i = 0; i < 2; i++) put(`haendler_top_${n + 1}_talk_${d}`, 52 + j * 116 + 76 + i * 19, y + 10, i, 21)
    })
    y += 20
  })
  y += 3
  // the crowd: each look, its idle (down), its walk (right), standing in the four directions, walking down
  head("LEUTE", [[40, "STEHEN 1-4"], [118, "GEHEN 1-8 (RECHTS)"], [276, "UNTEN OBEN RE. LI."], [370, "GEHEN UNTEN"]])
  for (let n = 1; n <= 16; n++) {
    const nn = String(n).padStart(2, "0")
    const size = [6, 12].includes(n) ? 23 : 21
    band(24, n, nn)
    for (let i = 0; i < 4; i++) put(`statist_${nn}_idle_down`, 44 + i * 18, y + 12, i, size)
    for (let i = 0; i < 8; i++) put(`statist_${nn}_walk_right`, 124 + i * 18, y + 12, i, size)
    DIRS.forEach((d, j) => put(`statist_${nn}_idle_${d}`, 282 + j * 22, y + 12, 0, size))
    for (let i = 0; i < 2; i++) put(`statist_${nn}_walk_down`, 380 + i * 22, y + 12, i * 2, size)
    y += 24
  }
  TXT.draw(c, 4, y + 6, "JUNO ZUM VERGLEICH:", "6", { font: "hud" }); c.stamp("juno_top_idle_down", 90, y)
  c.stamp("juno_top_walk_right", 112, y, { frame: 0 })
})
