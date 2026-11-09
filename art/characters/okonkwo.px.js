// Herr Okonkwo, who keeps the corner shop in Jade Row (kapitel1-design §9, §10: 48 px, #d8b890). In his sixties, a little stooped,
// with a tortoise's mod (story §10c; blocks approved 2026-11-09 with way B: art/test/okonkwo_blocks.px.js,
// docs/characters/okonkwo_blocks_x5.png): the shell humps his back under the cardigan, which rides up over it so its rim shows at
// the hem; his neck long, grey-green and folded, the head pushed forward; heavy lids. He stays, he carries his house, he is slow and
// he does not forget. The cardigan in his colour buttoned over a dark shirt, a pencil in the breast pocket; short grey hair, a grey
// beard; the reading glasses low on his nose, so he looks over them; the clip-on reading light on the glasses' arm, a cyan point at
// his temple (his glowing thing, style guide §8a); dark trousers, the near leg lighter so both read on a dark floor; old shoes.
//
// Drawn as the street's figures: front three-quarter (SE, flipped for SW) and back three-quarter (NE). The game uses
//   okonkwo_idle_sw, okonkwo_talk_sw   behind his counter, in the shop and in CAM 07V: he faces the room
//   okonkwo_idle_ne                    his back in his shop's door at one, in CAM 07 (the lane)
//   okonkwo_idle_se, okonkwo_talk_se   the same unflipped
// idle: the tortoise's slow head, pushed out a pixel and drawn back, a blink; talk: the mouth in the beard, a small nod. The lines
// are the blocks' own (the user's wish: exactly as sketched, the short neck, the big shell). Every frame is 31x48 inside the outline, pivot bottom-centre (column 15, between his shoes). Light from the upper left, as Juno's.
;(() => {

pal({
  k: "#0c0e1a",                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", // trousers and shoes: the far leg darker, the near one lighter
  e: "#d8b890", F: "#ecd4a8", E: "#a8885e", D: "#76603e",              // the cardigan: lit, its highlight on the shell, shade, seams
  d: "#2c3448", n: "#404a62",                                          // the shirt
  L: "#a06a48", S: "#7a4a32", s: "#563424", m: "#2e1a14",              // skin: lit, mid, shade, the mouth
  H: "#c8c8c0", h: "#8e8e86",                                          // grey hair and beard, their shade
  V: "#dafcff", v: "#62def0",                                          // the glasses' glint, the reading light
  t: "#8a9670", T: "#5e6a48", u: "#3e4632",                            // the tortoise's neck: lit, mid, folds
  p: "#8a7444", P: "#5c4a2a",                                          // the shell's rim under the hem: a plate, its seam
  y: "#eec414", Y: "#a88a10",                                          // the pencil
})

const IW = 31, IH = 48

// ---------------------------------------------------------------- the head (11x12), facing SE: short grey hair, the lit brow, heavy lids
// over eyes that look over the reading glasses, the glasses low on the nose (the near lens' glint), the reading light at the temple,
// the grey beard round the mouth
sprite("_o_head", `
  ...hhHHh...
  ..hHHHHHHh.
  .hHHHHHHHHh
  .hHHSLLLSHh
  .hSLLssSsSs
  .SSLLkSSkSs
  vSSkVkkkVkk
  .sSSSSSLSSs
  .shHHHHHHHs
  ..hHHssHHh.
  ...hHHHHh..
  ....hhh....`)
// the eyes shut (a slow blink): the heavy lids down
sprite("_o_blink", `
  ...........
  ...........
  ...........
  ...........
  ...........
  .....s..s..`)
// the mouth open in the beard (talking)
sprite("_o_mouth", `
  .....m.....`)
// the back of the head (NE): cut short, the ears, the reading light's glow past his temple on the right
sprite("_o_head_ne", `
  ...hHHHh...
  ..hHHHHHHh.
  .hHHHHHHHHh
  .hHHHHHHHHh
  .HHHHHHHHHh
  SHHHHHHHHhS
  ShHHHHHHHhv
  .hhHHHHHhh.
  ..hhhhhhh..`)

// ---------------------------------------------------------------- the neck: short, grey-green and folded, between the beard and the collar
sprite("_o_neck", `
  ..tTt
  .ttTT
  tuuuT
  ttTTT
  tTuTT`)
// the neck from behind, its folds under the hair
sprite("_o_neck_ne", `
  .tTTTt.
  tuuuuuT
  tTTTTTT`)

// ---------------------------------------------------------------- the body, on the blocks' lines (art/test/okonkwo_blocks.px.js, way B)
/** the hump of the shell under the cardigan: how far the back bulges left of its line at row r */
const hump = (r) => (r < 31 ? Math.round(5 * Math.sin(Math.PI * (r - 9) / 22)) : 0)
/** the legs and shoes, the cardigan over the shell, the arms; front (SE) or back (NE) */
const body = (c, view) => {
  const se = view === "se"
  // the legs and the old shoes: the far one darker, the near one lighter with a lit edge, so both read on a dark floor
  c.rect(11, 33, 3, 12, "3"); c.vline(13, 33, 12, "2")
  c.rect(16, 33, 3, 12, "4"); c.vline(16, 33, 12, "5")
  c.rect(10, 45, 4, 3, "1"); c.hline(10, 45, 4, "2")
  c.rect(16, 45, se ? 5 : 4, 3, "1"); c.hline(16, 45, se ? 5 : 4, "3"); if (se) c.px(20, 46, "4")
  // the cardigan from the shoulders to the hips; the hump on the left, its top in the light, shaded underneath
  c.hline(10, 10, 11, "e")
  for (let r = 11; r <= 33; r++) {
    const half = 6 + Math.round((r - 11) * 1.4 / 22), hu = hump(r), x0 = 15 - half - hu, x1 = 15 + half
    for (let x = x0; x <= x1; x++) {
      let k = "e"
      if (x === x1) k = "D"; else if (x === x1 - 1) k = "E"
      if (hu >= 3 && x < x0 + 3 && r < 20) k = "F"                           // the shell's top in the light
      if (x < x0 + 2 && r > 23) k = "E"                                      // under its curve
      if (x === x0 && r > 26) k = "D"
      c.px(x, r, k)
    }
    if (r === 33) for (let x = x0; x <= x1; x++) c.px(x, r, x % 2 ? "D" : "E") // the ribbed hem
  }
  if (se) {
    // the front: the open collar with the shirt in it, the placket and buttons, the pockets sagging: a pencil, the glasses' case
    c.rect(15, 11, 3, 5, "d"); c.px(16, 11, "n")
    c.vline(15, 16, 17, "E"); for (let i = 0; i < 4; i++) c.px(16, 17 + i * 4, "D")
    c.rect(10, 24, 4, 4, "E"); c.hline(10, 24, 4, "D"); c.vline(11, 21, 3, "y"); c.px(11, 21, "Y")
    c.rect(18, 24, 4, 4, "E"); c.hline(18, 24, 4, "D"); c.rect(19, 23, 2, 2, "D")
  } else {
    // the back: the seam down the middle; the shell's rim where the cardigan rides up over it, its plates and seams
    c.vline(14, 12, 18, "E")
    for (let x = 10; x <= 21; x++) c.px(x, 30, x === 13 || x === 18 ? "P" : "p")
    c.hline(10, 31, 12, "p"); c.hline(10, 32, 12, "P")
  }
  // the arms hanging, each set off from the body by a seam of shade, a cuff, the hand; in SE the near hand holds a pencil
  c.rect(6, 13, 3, 13, se ? "E" : "e"); c.vline(9, 14, 12, "D"); c.hline(6, 25, 3, "D")
  c.rect(6, 26, 3, 3, "S"); c.px(6, 26, "L"); c.px(8, 28, "s")
  c.vline(21, 14, 12, "D"); c.rect(22, 13, 3, 13, se ? "e" : "E"); c.vline(24, 14, 12, se ? "E" : "D"); c.hline(22, 25, 3, "D")
  c.rect(22, 26, 3, 3, se ? "S" : "s"); c.px(22, 26, se ? "L" : "S")
  if (se) { c.line(25, 25, 26, 29, "y"); c.px(25, 25, "Y"); c.px(26, 30, "k") }
}

const okonkwo = (c, o = {}) => {
  const view = o.view ?? "se"
  body(c, view)
  if (view === "se") {
    // the head pushed forward on the short neck (out by o.out: the tortoise's slow head), nodding by o.nod
    const out = o.out ?? 0, nod = o.nod ?? 0
    c.stamp("_o_neck", 15 + out, 10)
    c.stamp("_o_head", 13 + out, 1 + nod)
    if (o.blink) c.stamp("_o_blink", 13 + out, 1 + nod)
    if (o.talk) c.stamp("_o_mouth", 13 + out, 10 + nod)
  } else {
    const nod = o.nod ?? 0
    c.stamp("_o_neck_ne", 15, 9)
    c.stamp("_o_head_ne", 13, 1 + nod)
  }
}

const opts = (more) => ({ w: IW, h: IH, outline: "k", pivot: "bottom", ...more })
// the slow head: out, held, back, held; a blink once a loop
const OUT = [0, 0, 1, 1, 1, 1, 0, 0]
for (const [dir, flip] of [["se", null], ["sw", "x"]]) {
  const f = flip ? { flip } : {}
  anim(`okonkwo_idle_${dir}`, opts({ frames: 8, fps: 3, ...f }), (c) => okonkwo(c, { out: OUT[c.frame], blink: c.frame === 5 }))
  anim(`okonkwo_talk_${dir}`, opts({ frames: 4, ms: [180, 180, 180, 280], ...f }), (c) => okonkwo(c, { talk: c.frame % 2 === 0, nod: c.frame === 1 || c.frame === 2 ? 1 : 0 }))
}
// from behind in his door: the head bowed a pixel now and then, over the lock
anim("okonkwo_idle_ne", opts({ frames: 2, ms: [1400, 900] }), (c) => okonkwo(c, { view: "ne", nod: c.frame }))
})()
