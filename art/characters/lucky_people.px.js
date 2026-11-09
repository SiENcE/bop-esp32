// The people of LUCKY STATIC (game/lucky_static.js, kapitel1-design §7): Mei behind her counter (#ff9a7a, 47 px). The regulars follow.
// Street mode (iso 2:1), drawn facing SE and flipped for SW (style guide §6); light from straight above, since the game mirrors them.
// Mei stands behind the counter, which hides her from the hips down in the room (its front line): she is drawn whole all the same.
//   mei_idle_*, mei_talk_*   Mei: her hair up with a pencil through it for the slate, a salmon cardigan over a dark top, a dark apron
//                            with a rag tucked in its band; idle she blinks now and then, talking her mouth opens
// Every frame has one canvas, odd in width, pivot bottom-centre under the feet: nothing jumps.
pal({
  k: "#0c0e1a",                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a",             // night: trousers, shoes, the top under the cardigan
  // Mei (#ff9a7a): the cardigan lit, its middle, its shade; skin and its shade; the hair, its sheen; the apron and its band;
  // the pencil's wood and its dark end; the rag; her mouth
  Q: "#ff9a7a", q: "#d0705a", Z: "#8e4640", f: "#d9a47e", F: "#a06c4c", h: "#2a1c26", H: "#4e3448",
  a: "#2a2e3c", A: "#3c4356", p: "#c48a4a", P: "#6e4428", W: "#e6e2d4", w: "#a8a498", r: "#7e3e3c",
  // the stools: magenta vinyl, its highlight and rim; the chrome post, its shine, the ring
  m: "#a8238a", M: "#ff4fd3", n: "#3e1240", 5: "#41547a", 6: "#617aa0", 7: "#b9c6d8",
  // he (#a8b8d0): the jacket lit, middle, shade; his hair; the marmot's pelt and its light tips; his skin; the Lull patch, its rim,
  // its stripe, and its glow on the beat
  J: "#7c8aa2", j: "#56637a", K: "#3a4458", d: "#2e2422", T: "#8a6640", t: "#c09a62", s: "#c48c6c", S: "#8a5a44",
  L: "#c8d8e8", l: "#7890a8", "~": "#eef6ff", "^": "#6ab4ff",
  // she (#c0b0d0): the shawl lit, middle, shade; her dark dress; the grey hair and its shade; her skin
  B: "#c0b0d0", b: "#8c7ca0", D: "#5e5070", E: "#352c40", G: "#bcbcc4", g: "#86868f", o: "#d8ae8c",
})

;(() => {

/** a small hand-placed grid, "." leaves what is under it @param {any} c @param {number} x @param {number} y @param {string[]} rows */
const g = (c, x, y, rows) => rows.forEach((row, j) => [...row].forEach((k, i) => { if (k !== ".") c.px(x + i, y + j, k) }))
/** a body's rows from (x0a..x1a at ya) to (x0b..x1b at yb); tone(x, y, x0, x1, t) says each pixel's key, t from 0 at the top to 1 at the bottom */
const taper = (c, ya, x0a, x1a, yb, x0b, x1b, tone) => {
  for (let y = ya; y <= yb; y++) {
    const t = yb === ya ? 0 : (y - ya) / (yb - ya), x0 = Math.round(x0a + (x0b - x0a) * t), x1 = Math.round(x1a + (x1b - x1a) * t)
    for (let x = x0; x <= x1; x++) c.px(x, y, tone(x, y, x0, x1, t))
  }
}
/** a sleeve: a band t pixels thick from (x0, y0) to (x1, y1), lit on top, shaded at the bottom */
const sleeve = (c, x0, y0, x1, y1, t, lit, mid, shade) => { for (let i = 0; i < t; i++) c.line(x0, y0 + i, x1, y1 + i, i === 0 ? lit : i === t - 1 ? shade : mid) }
const SETS = [["se", {}], ["sw", { flip: "x" }]]

// ---------------------------------------------------------------- Mei
const MW = 23, MH = 47
const mei = (c, o = {}) => {
  // her legs and shoes (behind the counter in the room, but there)
  c.rect(7, 36, 4, 8, "2"); c.rect(12, 36, 4, 8, "2"); c.vline(11, 36, 8, "1")
  c.rect(6, 44, 5, 3, "1"); c.rect(12, 44, 5, 3, "1"); c.hline(6, 44, 5, "3"); c.hline(12, 44, 5, "3")
  // the cardigan, a little long, open over the dark top
  taper(c, 15, 6, 16, 33, 5, 17, (x, y, x0, x1, t) => (x === x0 ? "Z" : x === x1 ? "q" : x <= x0 + 1 ? "q" : "Q"))
  c.rect(10, 15, 3, 7, "3"); c.px(11, 22, "3")                                   // the top in the cardigan's opening
  // the apron over it, from under the chest to the knees; its band, the rag tucked in at her hip
  taper(c, 22, 7, 15, 38, 6, 16, (x, y, x0, x1, t) => (x === x0 ? "a" : y === 22 ? "A" : "a"))
  c.hline(6, 23, 11, "A"); c.hline(7, 22, 9, "a")
  g(c, 14, 23, ["WW", "Ww", "Ww", ".w"])
  // her arms in the cardigan's sleeves, hanging; the near one a little forward
  c.rect(4, 16, 2, 12, "q"); c.vline(4, 17, 10, "Z")
  c.rect(17, 16, 2, 11, "Q"); c.vline(18, 17, 9, "q")
  // the hands: four fingers' width, the thumb forward
  g(c, 3, 28, ["ff.", "fFf", ".F."])
  g(c, 17, 27, [".ff", "fff", "fF."])
  // the neck, the collar of the cardigan round it
  c.rect(10, 13, 3, 2, "F"); c.hline(8, 15, 2, "Q"); c.hline(13, 15, 2, "q")
  // the head, turned a little to the right (SE): the hair up, the fringe swept to the side, the ear on her left, eyes two pixels tall
  g(c, 6, 3, [
    "..hhhhhhh..",
    ".hhHhhhhhh.",
    "hhHfffhhhhh",
    "hhffffffhfh",
    "hfffffffff.",
    "hFfkffkfff.",
    "hFfkffkfff.",
    ".Fffffffff.",
    ".FFffrrff..",
    "..FFfffF...",
  ])
  if (o.blink) { c.px(9, 8, "f"); c.px(12, 8, "f") }                                // the lids down: only the lower line
  if (o.talk) { c.rect(12, 11, 2, 2, "r"); c.px(12, 11, "k") }
  // the bun on top, the pencil stuck through it for the slate
  g(c, 8, 0, ["..hhhh.", ".hhHhhh", "hhhhHhh", "hhhhhhh"])
  c.line(7, 4, 13, 0, "p"); c.px(13, 0, "P"); c.px(14, 0, "P")                   // the pencil, its sharpened end up
}
for (const [dir, flip] of SETS) {
  anim(`mei_idle_${dir}`, { w: MW, h: MH, outline: "k", pivot: "bottom", frames: 2, ms: [2800, 140], ...flip }, (c) => mei(c, { blink: c.frame === 1 }))
  anim(`mei_talk_${dir}`, { w: MW, h: MH, outline: "k", pivot: "bottom", frames: 2, ms: [200, 200], ...flip }, (c) => mei(c, { talk: c.frame === 1 }))
}

// ---------------------------------------------------------------- the regulars
// a bar stool exactly like the room's: its sprite as the bake draws it (art/kit/lucky_static.kit.px.js, lucky_static_stool3), copied
// pixel for pixel: the seat's rhombus in magenta vinyl with its highlight and dark rim, the post, the foot ring at 0.22 m
const STOOL = [
  "........kkkk........",
  "......kkmmmmkk......",
  "....kkmmmmmmmmkk....",
  "..kkmmmmMMMMmmmmkk..",
  ".kmmmmmmmMMmmmmmmmk.",
  ".kmmmmmmmmmmmmmmmmk.",
  "knmmmmmmmmmmmmmmmmnk",
  "knnnmmmmmmmmmmmmnnnk",
  ".knnnnmmmmmmmmnnnnk.",
  "..kknnnn6mm4nnnnkk..",
  "....kknnn64nnnkk....",
  "......kkn64nkk......",
  ".......k6644k.......",
  ".......k6644k.......",
  ".......k6644k.......",
  ".......k6644k.......",
  ".......k6554k.......",
  ".....kk555555kk.....",
  "...kk5555555555kk...",
  "..k55555555555555k..",
  ".k5555555555555544k.",
  "..kk5555555555544kk..",
  "....kk55555544kk....",
  "......kk5544kk......",
  ".......k6644k.......",
  ".......k6644k.......",
  ".......k6644k.......",
  "........k64k........",
  ".........kk.........",
]
/** the stool, its post under cx, standing on the canvas's bottom row @param {any} c @param {number} cx @param {number} H */
const stool = (c, cx, H) => g(c, cx - 10, H - STOOL.length, STOOL)
// he sleeps on his arms on the counter; the pelt of a marmot grown into his nape; the patch behind his ear keeps the beat
const AW = 29, AH = 44, an = (n) => AH - 1 - n
const stammA = (c, o = {}) => {
  const up = o.breath ? 1 : 0
  stool(c, 14, AH)
  // the jacket, bent forward over the seat, its folds at the waist; his back rises as he breathes
  taper(c, an(37 + up), 8, 19, an(23), 5, 21, (x, y, x0, x1, t) => (x === x0 ? "K" : x <= x0 + 2 ? "j" : t > 0.8 && x % 3 === 0 ? "j" : "J"))
  c.hline(9, an(38 + up), 9, "J")
  // his arms forward onto the counter, the sleeves pushed up
  sleeve(c, 17, an(35 + up), 27, an(32), 4, "J", "j", "K")
  // the pelt in his nape: a marmot's, coarse, its light tips, over the collar
  g(c, 11, an(41 + up), [
    "..tTt..",
    ".tTTTt.",
    "tTTtTTt",
    "TTtTTTT",
    ".TTTTT.",
  ])
  // his head down on his arms, from behind: dark hair, the ear; behind it the patch, an oval pale disc with its rim and stripe
  g(c, 17, an(41 + up), [
    "..dddd..",
    ".dddddd.",
    "dddddddd",
    "dsdddddd",
    "dSdddddd",
    ".dddddd.",
    "..dddd..",
  ])
  g(c, 19, an(37 + up), o.lull ? [".l.", "lL~", "l~L", ".l."] : [".l.", "lLL", "lLL", ".l."])
  if (o.lull) { c.px(18, an(37 + up), "^"); c.px(22, an(36 + up), "^") }
  // his hands under his head, on the counter's edge
  g(c, 24, an(34), ["sss", "sSs"])
}
// she sits up straight in her shawl, as if somebody were about to take a photograph; talking she turns her head to him, a hand up
const BW = 23, BH = 53, bn = (n) => BH - 1 - n
const stammB = (c, o = {}) => {
  stool(c, 11, BH)
  // the dress straight down to the seat; the shawl over her shoulders, its fringe, its fold down her back
  taper(c, bn(42), 5, 16, bn(23), 3, 18, () => "E")
  taper(c, bn(42), 4, 17, bn(32), 2, 19, (x, y, x0, x1) => (x === x0 ? "D" : x <= x0 + 2 || x >= x1 - 1 ? "b" : "B"))
  for (let x = 2; x <= 19; x += 2) c.px(x, bn(31), "b")
  c.vline(10, bn(41), 8, "b")
  // her neck; the grey hair from behind, its bun
  c.rect(9, bn(44), 4, 2, "o")
  g(c, 6, bn(52), [
    "...GGGG...",
    "..GGggGG..",
    "...GGGG...",
    ".GGgGGgGG.",
    "GGgGGGGgGG",
    "GgGGGGGGgG",
    "GgGGGGGGgG",
    ".GgGGGGgG.",
    "..gggggg..",
  ])
  if (o.talk) { g(c, 5, bn(48), ["oo", "oo", ".o"]); g(c, 1, bn(39), [".o.", "ooo", "BBb"]) }
  else c.px(6, bn(47), "o")                                                                     // the edge of her ear
}
// Nagiwa.lullBeat (game/nagiwa.js) as lengths: long, short, short, long, then the pause; his breath goes over the same cycle
const LULL = [800, 300, 250, 300, 250, 300, 800, 600], BREATH = [0, 0, 0, 0, 1, 1, 1, 1]
for (const [dir, flip] of [["ne", {}], ["nw", { flip: "x" }]]) {
  anim(`stamm_a_idle_${dir}`, { w: AW, h: AH, outline: "k", pivot: "bottom", frames: LULL.length, ms: LULL, ...flip }, (c) => stammA(c, { lull: c.frame % 2 === 0, breath: BREATH[c.frame] }))
  anim(`stamm_b_idle_${dir}`, { w: BW, h: BH, outline: "k", pivot: "bottom", frames: 1, ...flip }, (c) => stammB(c))
  anim(`stamm_b_talk_${dir}`, { w: BW, h: BH, outline: "k", pivot: "bottom", frames: 2, ms: [300, 300], ...flip }, (c) => stammB(c, { talk: c.frame === 1 }))
}

})()
