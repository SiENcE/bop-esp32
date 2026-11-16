// Blocks for approval (the user's wish, 2026-11-16, "Auf Sendung", kapitel2-design §3.5): the arrival in the swamp grows to the right and
// scrolls there (640 wide instead of 320), so that what lies behind Lantern's caravan can be used. The walk of planks goes on from the
// caravan's pontoon to the right on its posts. Along it, from the left:
//   the roots    a giant's roots reaching into the water in front of the walk; Pike's fish trap (a round net with an orange float) caught
//                in them; the water there uneasy, where the thing under the surface swims
//   the mast     Lantern's antenna mast lashed to a dead tree, his cable coming over from the caravan's roof; on the trunk at eye height a
//                small screen with his wave, green
//   the boat     an old boat half sunk by the walk, its bow up; in it, under a tarp, an old radio
// and the caravan with its door shut (lantern_found=out): the door's green gone, a dark panel, the light behind the windows low.
//   sumpf_rechts_blocks   the whole 640 (the left half the game's shot as it is, build/shots/sumpf_1x.png), 1x; Juno at the boat for size
//   sumpf_tuer_zu         the caravan's door shut, over the shot's left half, 1x
"use strict"
pal({ k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  e: "#0b1019", f: "#111824", g: "#24402e", G: "#3f6340", q: "#16251f", u: "#2a1f1c", U: "#4a3528", O: "#552b1c", o: "#e08840",
  a: "#2a2f36", A: "#474e57", s: "#6f7882", L: "#b0f0a0", d: "#3c6a3a", y: "#7cff9a", c: "#123c4e", C: "#1f88a4" })

const X0 = 320
sprite("_sr_shot", { png: "../../build/shots/sumpf_1x.png" })
sprite("_sr_juno", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50] })

function right(c) {
  // the far back: dark trunks in the mist, the canopy closing over; the water
  c.rect(X0, 0, 320, 180, "n")
  for (let i = 0; i < 9; i++) { const x = X0 + 6 + i * 36 + ((i * 13) % 11); c.rect(x, 0, 10 + (i % 3) * 4, 130, i % 2 ? "q" : "1") }
  c.rect(X0, 0, 320, 14, "q")
  c.rect(X0, 126, 320, 54, "e"); for (let i = 0; i < 30; i++) c.hline(X0 + ((i * 47) % 316), 132 + ((i * 7) % 44), 6, "f")
  // the walk of planks on its posts, going on from the caravan's pontoon (its top where Juno walks)
  c.rect(X0, 146, 290, 5, "U"); for (let x = X0; x < X0 + 290; x += 7) c.vline(x, 146, 5, "u")
  for (let x = X0 + 10; x < X0 + 290; x += 46) c.rect(x, 151, 4, 22, "u")
  // the roots in front of the walk, Pike's trap caught in them, the uneasy water
  for (const [x0, x1] of [[350, 372], [366, 400], [392, 410]]) c.line(x0, 120, x1, 176, "3")
  c.rect(372, 156, 16, 12, "A"); for (let x = 373; x < 388; x += 3) c.vline(x, 157, 10, "a"); c.rect(386, 152, 5, 4, "o")
  for (const [x, y] of [[360, 170], [395, 173], [376, 176]]) c.hline(x, y, 9, "4")
  // the dead tree with the mast lashed to it, the cable from the caravan's roof, the small screen with his wave
  c.rect(462, 20, 14, 126, "a"); c.rect(462, 20, 3, 126, "A"); c.line(476, 60, 500, 40, "a"); c.line(462, 80, 444, 66, "a")
  c.vline(469, 0, 20, "s"); for (const [x, y] of [[466, 4], [472, 9], [469, 2]]) c.px(x, y, "y")
  c.line(310, 70, 462, 50, "1")
  c.rect(456, 92, 16, 11, "k"); c.rect(457, 93, 14, 9, "d"); for (let x = 0; x < 14; x++) c.px(457 + x, 97 + Math.round(Math.sin(x * 0.9) * 2), "L")
  // the boat half sunk by the walk, its bow up, a tarp, the old radio under it
  c.line(538, 168, 600, 150, "U"); c.line(538, 169, 600, 151, "u"); c.line(540, 168, 586, 176, "u")
  for (let x = 540; x < 598; x++) c.vline(x, Math.round(168 - (x - 538) * 0.29), 4, "U")
  c.rect(560, 156, 18, 7, "5"); c.rect(570, 152, 8, 5, "3"); c.px(576, 153, "C")
  c.rect(X0, 172, 320, 8, "e")
}
scene("sumpf_rechts_blocks", { w: 640, h: 180, bg: "k" }, (c) => {
  c.stamp("_sr_shot", 0, 0)
  right(c)
  c.stamp("_sr_juno", 548 - 13, 147 - 50)
})
// the caravan's door shut: its green gone, a dark panel with a handle, the windows' light low (over the shot's door at 212..236, 94..135)
scene("sumpf_tuer_zu", { w: 320, h: 180, bg: "k" }, (c) => {
  c.stamp("_sr_shot", 0, 0)
  c.rect(213, 94, 24, 42, "3"); c.rect(214, 95, 22, 40, "4"); c.vline(225, 95, 40, "3"); c.rect(231, 114, 2, 4, "s")
})
