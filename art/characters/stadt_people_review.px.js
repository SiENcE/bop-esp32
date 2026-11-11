// Review sheet of Chapter 1's street figures beside Juno (the preacher is seen from above now: art/characters/markt_people_review.px.js), every view and frame, with a silhouette row. Never built into the game.
// Juno comes out of the built atlas's raw sprites: sh tools/build_art.sh characters, first.
// Build: PXL build art/characters/stadt_people_review.px.js --out build/art/stadt_people_review --only review_stadt_people --share 4
include("stadt_people.px.js", { palette: true })

sprite("review_juno", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50], pivot: "bottom" })

// [label, anim name, ms into it (which picks the frame), canvas width with the outline]
const ROWS = [
  [["JUNO", "review_juno", 0, 27],
   ["REGEN", "regen_idle_se", 0, 49], ["DROP", "regen_idle_se", 1100, 49], ["TWITCH", "regen_idle_se", 1850, 49], ["TALK", "regen_talk_se", 200, 49], ["SW", "regen_idle_sw", 0, 49],
   ["IMAI ON", "imai_idle_se", 0, 53], ["OFF", "imai_idle_se", 800, 53], ["TALK ON", "imai_talk_se", 200, 53], ["TALK OFF", "imai_talk_se", 1000, 53], ["SW", "imai_idle_sw", 0, 53]],
  [["FIT NE", "monteur_idle_ne", 0, 47], ["ARM 2", "monteur_idle_ne", 320, 47], ["ARM 3", "monteur_idle_ne", 560, 47], ["ARM 6", "monteur_idle_ne", 1360, 47], ["TALK SE", "monteur_talk_se", 0, 47], ["TALK 2", "monteur_talk_se", 200, 47], ["SW", "monteur_talk_sw", 0, 47]],
]
const SILS = [["review_juno", 27], ["regen_idle_se", 49], ["imai_idle_se", 53], ["monteur_idle_ne", 47], ["monteur_talk_se", 47]]
for (const [name] of SILS) sprite(`_sil_${name}`, { base: name }, recolor({ "*": "k" }))

const W = 584, TALLS = [62, 70], H = TALLS.reduce((a, b) => a + b, 0) + 72
scene("review_stadt_people", { w: W, h: H, bg: "3" }, (c) => {
  let y = 0
  ROWS.forEach((row, i) => {
    const tall = TALLS[i]
    c.rect(0, y + tall - 5, W, 5, "1")
    let x = 4
    for (const [label, name, t, w] of row) {
      const mid = x + (w >> 1)
      TXT.draw(c, mid, y + 1, label, "7", { font: "hud", align: "center" })
      c.stamp(name, mid, y + tall - 3, { t })
      x += w + 3
    }
    y += tall
  })
  // the silhouettes: can you tell them apart?
  c.rect(0, y, W, H - y, "6")
  let x = 4
  for (const [name, w] of SILS) { c.stamp(`_sil_${name}`, x + (w >> 1), H - 2); x += w + 3 }
})
