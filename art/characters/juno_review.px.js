// Review sheet for art/characters/juno50.px.js (Juno at 30 px per meter): every view and anim side by side
// on a dark floor, at 1x as the game shows them, beside the old 32 px Juno (juno.px.js, under "old.") and a
// 2.0 m door (60 px) for scale. Top row: the poses (idle, the blink, talk) hood up and hood down; then the
// walk's 8 frames, SE and NE, outside and indoors, each frame on its own pivot.
//   PXL build art/characters/juno50_review.px.js --out build/art/juno50 --share 4 --no-preview
pal({
  k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  v: "#62def0",
})
include("juno.px.js")
include("../old/juno_h1.px.js", { as: "old" })
include("../lib/text.js")

const STEP = 28                                     // one figure's slot (the frames are 27 wide)
const ROWS = [78, 146, 214]                         // the floor lines

// the poses: [x of the pivot, asset, frame, label]
const POSES = [
  ["juno_idle_se", 0, "SE"], ["juno_idle_se", 2, "BLINK"], ["juno_talk_se", 1, "TALK"],
  ["juno_idle_ne", 0, "NE"], ["juno_talk_ne", 1, "TALK"],
  ["juno_in_idle_se", 0, "IN SE"], ["juno_in_idle_se", 2, "BLINK"], ["juno_in_talk_se", 1, "TALK"],
  ["juno_in_idle_ne", 0, "IN NE"], ["juno_in_talk_ne", 1, "TALK"],
]
const WALKS = [
  [ROWS[1], "juno_walk_se", "juno_walk_ne", "WALK SE 0-7", "WALK NE 0-7"],
  [ROWS[2], "juno_in_walk_se", "juno_in_walk_ne", "IN SE 0-7", "IN NE 0-7"],
]

const stamps = []
POSES.forEach(([name, frame], i) => stamps.push(stamp(name, 108 + i * STEP, ROWS[0], { frame })))
for (const [y, se, ne] of WALKS) for (let f = 0; f < 8; f++) {
  stamps.push(stamp(se, 20 + f * STEP, y, { frame: f }))
  stamps.push(stamp(ne, 248 + f * STEP, y, { frame: f }))
}
stamps.push(stamp("old.juno_idle_se", 58, ROWS[0], {}), stamp("old.juno_idle_ne", 80, ROWS[0], {}))

sprite("juno50_lineup", { w: 480, h: 232 }, (c) => {
  c.rect(0, 0, 480, 232, "n")
  for (const y of ROWS) { c.rect(0, y, 480, 10, "1"); c.rect(0, y, 480, 1, "3") }
  // the door, 2.0 m = 60 px
  c.rect(8, ROWS[0] - 60, 28, 60, "2"); c.rect(8, ROWS[0] - 60, 28, 1, "5"); c.rect(8, ROWS[0] - 60, 1, 60, "5"); c.rect(30, ROWS[0] - 30, 2, 3, "6")
  TXT.draw(c, 22, ROWS[0] + 3, "TÜR 2 M", "6", { font: "hud", align: "center" })
  TXT.draw(c, 69, ROWS[0] + 3, "ALT 32", "6", { font: "hud", align: "center" })
  POSES.forEach(([, , label], i) => TXT.draw(c, 108 + i * STEP, ROWS[0] + 3, label, "6", { font: "hud", align: "center" }))
  for (const [y, , , a, b] of WALKS) { TXT.draw(c, 118, y + 3, a, "6", { font: "hud", align: "center" }); TXT.draw(c, 346, y + 3, b, "6", { font: "hud", align: "center" }) }
  TXT.draw(c, 4, 4, "JUNO BEI 30 PX/M: 27X50, PIVOT UNTEN MITTE", "v", { font: "hud" })
}, ...stamps)
