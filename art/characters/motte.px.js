// Motte, 12, a courier kid in the Kessel Block (story §4; kapitel0-design §8; blocks approved 2026-11-04:
// art/test/motte_blocks.px.js, docs/characters/motte_blocks_x4.png). 1.45 m, so 43 px standing (style
// guide §6); his accent the oversized white beanie (two teal stripes in its cuff, a pink pompom), a loud
// pink hand-me-down jacket too big for him with a reflective courier band, his teal courier bag, an old
// game console he plays on, wide, dark, a coloured grip at either end, held in both hands in front of his chest.
//
// Street mode (iso 2:1), drawn facing SE (front three-quarter); the engine mirrors it for SW, the way he
// sits on the bench in kessel_14 facing the landing:
//   motte_sit_se    on the bench, head bent, the console in both hands, its back toward us: his thumbs going, its light on his face
//   motte_talk_se   on the bench, looking up at Juno, talking; the handheld lowered to his lap
//   motte_sit_sw, motte_talk_sw   the same flipped (the game's: he faces the landing whichever way he turns)
// Every frame is 37x48 inside the outline: pivot bottom-centre, at his feet on the floor in front of the
// bench; the seat is 19 rows above the soles and 11 columns back (his thighs run forward
// along the 2:1 floor line to the knees, the shins straight down). Light from the upper left, as Juno's.
;(() => {

pal({
  k: "#0c0e1a",                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47",                            // trousers, trainers
  p: "#ff6fae", o: "#b8407a", r: "#ffb0d4", n: "#7e2a5a",              // the pink jacket: lit, shade, light, deep
  x: "#6c809a", X: "#b9c6d8",                                          // the reflective band
  W: "#f0f0e0", e: "#d8d8c8", w: "#a8a898",                            // the beanie's whites
  C: "#1f88a4", c: "#123c4e",                                          // teal: the cuff's stripes, the bag
  s: "#93583f", S: "#d79676", m: "#6e3430",                            // skin, the mouth
  h: "#2a1c18",                                                        // his hair, dark, under the cap
  v: "#62def0", V: "#dafcff", g: "#565e70", G: "#8e96a8",              // the console: its screen, its case
  a: "#eea040", A: "#b0602a",                                          // its far grip (the near one is the teal)
})

const IW = 37, IH = 48

// ---------------------------------------------------------------- the beanie (14x13; its bottom row on
// his brows), slouching back up-left, the pompom there
sprite("_m_cap", `
  ...kkk........
  ..kprpk.......
  ..kopok.......
  ...kkkkkkk....
  ..kWWWWWWWkk..
  .kWWWWWWWWWWk.
  kWWWWWWWWWWWek
  kWWWWWWWWWWeek
  kwwwwwwwwwwwwk
  kCcCcCcCcCcCck
  kWeWeWeWeWeWek
  kCcCcCcCcCcCck
  .kkkkkkkkkkkk.`)

// ---------------------------------------------------------------- faces under the cuff (9x6)
// down: bent to the screen, the lids lowered; up: looking up at Juno (talk opens the mouth)
sprite("_m_face_down", `
  hhSSSSSSs
  hSSsSSsSs
  hsSSSSSSs
  hsSSSSSSs
  .sSSSmSs.
  ..sssss..`)
sprite("_m_face_up", `
  hhSSSSSSs
  hSkSSkSSs
  hSkSSkSSs
  hsSSSSSSs
  .sSSSSSs.
  ..sSmSs..`)

// ---------------------------------------------------------------- the body
// the torso: the jacket too big, bunched where he sits; the band across it; lit on the left
sprite("_m_torso", `
  ...nooppon...
  .noppppppppn.
  nopprppppppon
  noprpppppppon
  noprpppppppon
  noprppppppoon
  nXXXXXXXXXXxn
  nxxxxxxxxxxxn
  noppppppppoon
  noppppppppoon
  nooppppppoon.
  .noooooooon..
  ..nnnnnnnn...`)
// the near arm (lit), elbow out, the forearm coming in to the console; or resting, the hand in his lap
sprite("_m_arm_down", `
  .rp..
  rpp..
  rppn.
  rppn.
  rppn.
  rppn.
  rpppn
  .rppp
  ..nnn`)
// the far arm, in shade, the same from the other side
sprite("_m_arm_far", `
  on...
  opn..
  opn..
  oopn.
  oopn.
  nopn.
  nnon.
  .nnn.`)
sprite("_m_arm_up", `
  rp..........
  rpn.........
  rpn.........
  rpn.........
  rpn.........
  rpn.........
  rppn........
  .rppnn......
  ..rpppnnrr..
  ....nnnnn...`)
// the console: held up in front of him, its back toward us, dark, a grip at either end; or flat in his lap,
// its screen up
sprite("_m_hh_up", `
  .CCC22222222aaa.
  CCCC33333333aaaa
  CCCC22222222aaaa
  CCCC22222222aaaa
  cCCC22222222aaaA
  .ccc11111111AAA.`)
sprite("_m_hh_lap", `
  .CCGGGGGGCC.
  CVCGvvvvGCVC
  cCCGGGGGGCCc`)
// the bag beside him on the bench (teal, its band, the flap)
sprite("_m_bag", `
  cccccccc
  cCCCCCCc
  cCCCCCCc
  XXXXXXXX
  cCCCCCCc
  cccccccc`)

// ---------------------------------------------------------------- the figure
const motte = (c, o = {}) => {
  const at = (name, x, y) => c.stamp(name, x, y), nod = o.nod ?? 0
  // the legs: the thighs forward along the floor's line from the seat to the knees, the shins straight
  // down, the trainers (the far leg first, darker, a step further back)
  for (let t = 0; t < 3; t++) c.line(8, 28 + t, 21, 32 + t, "2")
  for (let t = 0; t < 3; t++) c.line(6, 29 + t, 18, 34 + t, "3")
  c.rect(20, 33, 3, 10, "2"); c.rect(19, 43, 5, 2, "1"); c.rect(19, 45, 5, 1, "W")
  c.rect(16, 35, 3, 9, "3"); c.rect(18, 35, 1, 9, "2"); c.rect(15, 44, 6, 2, "1"); c.rect(15, 46, 6, 1, "1"); c.rect(15, 47, 6, 1, "W")
  at("_m_bag", 0, 25)
  at("_m_torso", 3, 18)
  at("_m_face_" + (o.up ? "up" : "down"), 6, 12 + nod)
  at("_m_cap", 4, 0 + nod)
  if (o.up) { at("_m_arm_up", 4, 19); at("_m_hh_lap", 10, 27) }
  else {
    at("_m_arm_down", 1, 20)
    at("_m_arm_far", 16, 20)
    at("_m_hh_up", 4, 23)
    // his hands round the grips, the fingers on its back; the thumbs over its top edge, one or the other going
    c.rect(4, 25, 2, 3, "S"); c.px(5, 28, "s"); c.rect(18, 25, 2, 3, "s"); c.px(18, 28, "s")
    c.px(o.tap ? 6 : 7, 22, "S"); c.px(o.tap ? 17 : 16, 22, "s")
    // its light on his chin, from below
    if (o.glow) { c.px(9, 17 + nod, "v"); c.px(10, 18 + nod, "v") }
  } if (o.up && o.talk) { c.px(10, 16 + nod, "k"); c.px(10, 17 + nod, "m") }
}

const opts = (more) => ({ w: IW, h: IH, outline: "k", pivot: "bottom", ...more })
// drawn facing SE; the game uses them flipped (facing SW, the landing), for every facing: he stays on his
// bench when the engine turns him toward whoever talks to him
for (const [dir, flip] of [["se", null], ["sw", "x"]]) {
  const o = flip ? { flip } : {}
  anim(`motte_sit_${dir}`, opts({ frames: 4, ms: [380, 380, 380, 1100], ...o }),
    (c) => motte(c, { tap: c.frame % 2 === 1, glow: c.frame === 2, nod: 1 }))
  anim(`motte_talk_${dir}`, opts({ frames: 2, ms: [200, 200], ...o }),
    (c) => motte(c, { up: true, talk: c.frame === 1, nod: -1 }))
}

})()
