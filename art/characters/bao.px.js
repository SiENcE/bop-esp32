// Bao, over 70, runs the noodle cart outside LUCKY STATIC (story §4; kapitel0-design §8; blocks approved
// 2026-11-04 with head A: art/test/bao_blocks.px.js, docs/characters/bao_blocks_x4.png). 1.62 m and a little
// stooped, so 47 px; a cream cardigan in his colour (#e8c890) with the sleeves pushed up, a white apron to
// the knees, its strings round his waist, dark trousers, worn shoes; short white hair round a bald crown, a
// white moustache, round glasses; the hearing aid at his ear, plain and grey (a light behind the ear means Lull). He has
// one arm, the one with the ladle (decided 2026-11-05): the other sleeve of the cardigan is folded up at the shoulder and pinned.
//
// Street mode (iso 2:1), drawn facing SE (front three-quarter); the game uses it flipped (SW), for every
// facing: behind his cart he faces Juno across it, whichever way the engine turns him.
//   bao_idle_se   stirring the pot with his ladle (8 frames), blinking behind his glasses once a loop
//   bao_talk_se   talking: the mouth under the moustache, a small nod, the ladle held still
//   bao_idle_sw, bao_talk_sw   the same flipped (the game's)
// Every frame is 29x48 inside the outline, pivot bottom-centre (column 14, under his shoes). Light from the
// upper left, as Juno's: the lit side of him on the screen's left.
;(() => {

pal({
  k: "#0c0e1a",                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a",              // trousers, shoes, the glasses' rims
  e: "#e8c890", E: "#b0905e", D: "#7a6040",                            // the cardigan: lit, shade, its seams
  W: "#f0f0e0", w: "#b8b8a8", a: "#8a8a80",                            // the apron: white, its shade, its folds
  L: "#e8b494", S: "#c9906c", s: "#93583f", m: "#6e3430",              // skin: the crown's light, lit, shade, the mouth
  H: "#e8e8e0", h: "#a8a8a0",                                          // white hair, the moustache, their shade
  V: "#dafcff", v: "#8e96a8",                                          // the lenses' glint, the hearing aid
  g: "#565e70", G: "#8e96a8",                                          // the ladle
})

const IW = 29, IH = 48

// ---------------------------------------------------------------- the head (10x11), facing SE: the bald
// crown catching the light, white hair round the side and the back, the ear with the hearing aid,
// round glasses (the near lens bigger), the white moustache over the mouth
sprite("_b_head", `
  ...LLLSS...
  ..LLSSSSSs.
  .HLSSSSSSSs
  HHSSSSSSSSs
  HHSgggSSggs
  vHgVkgSgks.
  HHSgggSSgSs
  HhSSSSSsSSs
  .hsSHHHHHs.
  ..ssSSmSs..
  ...sssss...`)
// the eyes shut (a blink): the lids behind the lenses
sprite("_b_blink", `
  ...........
  ...........
  ...........
  ...........
  ...........
  ....S...S..`)
// the mouth open (talking), under the moustache
sprite("_b_mouth", `
  ......mk...`)

// ---------------------------------------------------------------- the arms
// where the far arm would be (the screen's left, in the cardigan's light): the sleeve folded up at the shoulder, a pin through it
sprite("_b_sleeve", `
  .eE
  eeE
  eeE
  eGE
  DDD`)
// the near arm (the screen's right): the upper arm down his side, the forearm forward to the ladle
sprite("_b_arm_near", `
  EE..
  EED.
  EED.
  EED.
  EED.
  EED.
  EEDD
  DDDD`)
sprite("_b_forearm", `
  SSSss
  sssss`)

// ---------------------------------------------------------------- the figure
const bao = (c, o = {}) => {
  const nod = o.nod ?? 0, [hx, hy] = o.hand ?? [0, 0]
  // the legs under the apron's hem, the shoes (the far one first, darker)
  c.rect(9, 40, 4, 5, "3"); c.rect(15, 40, 4, 5, "2"); c.rect(16, 40, 1, 5, "3")
  c.rect(8, 45, 5, 3, "1"); c.hline(8, 45, 5, "2")
  c.rect(15, 45, 6, 3, "1"); c.hline(15, 45, 6, "3"); c.px(20, 46, "4")
  // the cardigan: round shoulders (he stoops), wider at the hips; lit on the left, its shade on the right
  c.rect(12, 11, 5, 2, "s"); c.hline(12, 11, 2, "S")                            // the neck
  for (let y = 12; y <= 36; y++) {
    const x0 = y === 12 ? 9 : y === 13 ? 8 : y < 28 ? 7 : 6, x1 = y === 12 ? 19 : y === 13 ? 20 : y < 28 ? 21 : 22
    for (let x = x0; x <= x1; x++) c.px(x, y, x <= x0 + 2 ? "e" : x >= x1 - 2 ? (x === x1 ? "D" : "E") : "e")
  }
  c.hline(9, 12, 3, "e"); c.vline(14, 13, 2, "D")                               // the collar's V
  // the apron: its bib on the chest, the strap round the neck, the strings round the waist; the skirt to
  // below the knees, its shade on the right, a fold, the pocket
  c.rect(11, 16, 7, 5, "W"); c.vline(17, 16, 5, "w"); c.line(11, 16, 12, 13, "w"); c.line(17, 16, 16, 13, "w")
  c.hline(6, 21, 17, "w"); c.hline(8, 21, 13, "W")
  for (let y = 22; y <= 40; y++) { const x0 = y < 30 ? 9 : 8, x1 = y < 30 ? 19 : 20; for (let x = x0; x <= x1; x++) c.px(x, y, x >= x1 - 1 ? "w" : "W") }
  for (let y = 26; y <= 40; y++) c.px(12 + (y > 34 ? 1 : 0), y, "a")
  c.rect(14, 27, 4, 1, "a"); c.vline(14, 27, 3, "a"); c.vline(17, 27, 3, "a")
  // the arms; the ladle in his near hand, over the pot in front of him
  c.stamp("_b_sleeve", 5, 13)
  c.stamp("_b_arm_near", 19, 13)
  c.stamp("_b_forearm", 21 + hx, 20 + hy)
  c.rect(25 + hx, 19 + hy, 2, 3, "S"); c.px(26 + hx, 21 + hy, "s")             // his fist round the handle
  c.line(26 + hx, 18 + hy, 26 + hx, 26 + hy, "G"); c.px(27 + hx, 18 + hy, "G")      // the handle, its hook
  c.rect(25 + hx, 26 + hy, 3, 2, "g"); c.px(25 + hx, 26 + hy, "G"); c.px(26 + hx, 28 + hy, "g")   // its bowl
  // the head, bent forward a little (stooped), nodding
  c.stamp("_b_head", 9, 1 + nod)
  if (o.blink) c.stamp("_b_blink", 9, 1 + nod)
  if (o.talk) c.stamp("_b_mouth", 9, 10 + nod)
}

const opts = (more) => ({ w: IW, h: IH, outline: "k", pivot: "bottom", ...more })
// the ladle going up and down in the pot: the hand's offset per frame. Only up and down: the ladle's handle
// over the broth is the cart's (art/kit/kowalski.kit.px.js), in the column right under his fist
const STIR = [[0, 0], [0, 0], [0, 1], [0, 1], [0, 0], [0, 0], [0, 1], [0, 1]]
for (const [dir, flip] of [["se", null], ["sw", "x"]]) {
  const o = flip ? { flip } : {}
  anim(`bao_idle_${dir}`, opts({ frames: 8, fps: 6, ...o }), (c) => bao(c, { hand: STIR[c.frame], blink: c.frame === 6 }))
  anim(`bao_talk_${dir}`, opts({ frames: 4, ms: [160, 160, 160, 260], ...o }), (c) => bao(c, { talk: c.frame % 2 === 0, nod: c.frame === 1 || c.frame === 2 ? 1 : 0 }))
}
})()
