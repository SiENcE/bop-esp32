// Chapter 1's four street figures with their tide mods out of the animal shop (story §10c, "Die Figuren der Stadt tragen Tier-Mods";
// blocks approved 2026-11-06: docs/characters/stadt_mods_blocks_x4.png). Worn, tired people in a poor district whose bodies were altered
// cheaply: one large part carries the animal, the rest stays an ordinary person. Light from straight above, since the game mirrors them.
//
// Street mode (iso 2:1), drawn facing SE. They stay where they are when the engine turns them, so game/stadt.js gives every facing the
// same view (as Bao and Motte); the _sw sets are the flipped ones, painted so that what is written on them still reads.
//   regen_idle_*, regen_talk_*                       the Rain Reader, a catfish: 38 px on her bucket; a drop falls on the counter, a barbel twitches
//   imai_idle_*, imai_talk_*                         Frau Imai, a sloth: 41 px at her table; the Lull point keeps Nagiwa.lullBeat
//   prediger_idle_<day>_*, prediger_talk_<day>_*     the Preacher, a gecko: 54 px on a 12 px crate, 67 with the thermos; 9, 10, 11 on his counter; he licks his eye
//   monteur_idle_ne, monteur_talk_*                  the Fitter, a mole: 52 px, 58 with the arm raised; from behind at work, his arm going; turned round to talk
// Every frame of a figure has one canvas, odd in width, pivot bottom-centre under the feet: nothing jumps.
pal({
  k: "#0c0e1a",                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",   // night steel: trousers, boots, chair, crate
  c: "#1f88a4", v: "#62def0", V: "#dafcff",                            // technology
  W: "#f0f0e0", w: "#b8b8a8",                                          // cup, milky eyes
  // the Rain Reader (#a8c8e8): the cape's light, lit, shade, deep; her bucket; catfish skin, its blotches, its belly; orange barbels
  a: "#d4e6f6", B: "#a8c8e8", b: "#7492b8", n: "#4c6488", G: "#8e96a8", g: "#565e70",
  y: "#64808c", Y: "#3e5564", u: "#8ea4aa", J: "#ec9a58", j: "#a85c30",
  // Frau Imai (#c8d8b0): the cardigan, its shade and deep; her hair, its grey; her skin; moss in the hair, dark, lit, bright; Lull bright and dim; cold tea
  C: "#c8d8b0", e: "#92a47e", d: "#667858", h: "#2c2e38", A: "#6a6e7a", o: "#d8c2aa", O: "#a68c78",
  "%": "#34482a", "&": "#55703a", "+": "#8aa852", "~": "#cfe6ff", "^": "#6ab4ff", t: "#552b1c",
  // the Preacher (#d8c8a0): the coat, its shade, its seam; the thermoses; amber caps and eyes, their light and dark; gecko skin, its scales; a rust crest; the tongue
  D: "#d8c8a0", i: "#a69670", x: "#6e6244", T: "#a8b4c4", X: "#6c7888", Q: "#eea040", P: "#b0602a", R: "#ffd58a",
  s: "#a89a5e", S: "#5c5430", q: "#b8682c", Z: "#7c4220", p: "#e888a8", r: "#a84e6c",
  // the Fitter (#b0c0b0): the coat, its shade, where it is wet; the hard hat; his belt, its pouch; the pelt, its light; pink hands and snout; claws
  M: "#b0c0b0", m: "#7c8c84", N: "#4e5e5a", z: "#dce0d4", "|": "#a0a89c", ",": "#552b1c", ";": "#8a5a34",
  "@": "#2a2630", "!": "#4a4452", "?": "#e0a49c", ":": "#a46c70", "=": "#e4d8b4",
})
include("../lib/text.js")

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
/** a sleeve: t rows of a line, the top row lit and the bottom one in shade, since the light is straight above */
const sleeve = (c, x0, y0, x1, y1, t, lit, mid, shade) => { for (let i = 0; i < t; i++) c.line(x0, y0 + i, x1, y1 + i, i === 0 ? lit : i === t - 1 ? shade : mid) }
/** the HUD font's letters; mirrored for a set the build flips, so that they come out right */
const write = (c, x, y, s, key, mirrored) => {
  const w = TXT.measure(s, "hud"); let at = 0
  for (const ch of s) {
    const rows = NAGIWA_GLYPHS.hud[ch]
    rows.forEach((row, j) => [...row].forEach((b, i) => { if (b === "#") c.px(mirrored ? x + w - 1 - at - i : x + at + i, y + j, key) }))
    at += rows[0].length + 1
  }
}
const SETS = [["se", {}], ["sw", { flip: "x" }]]

// ---------------------------------------------------------------- The Rain Reader, 82, on her upturned bucket
const RW = 47, RH = 38, rn = (h) => RH - 1 - h
const regen = (c, o = {}) => {
  // the bucket she sits on, its rim on the floor, in the shadow of her cape at the top
  taper(c, rn(11), 12, 23, rn(2), 13, 22, (x, y, x0, x1, t) => (t < 0.25 || x === x1 ? "g" : x === x0 + 2 ? "g" : "G"))
  c.hline(11, rn(1), 14, "G"); c.hline(11, rn(0), 14, "g"); c.hline(13, rn(6), 10, "g")
  // her boots and shins out from under the hem, far first
  c.rect(23, rn(12), 4, 9, "2"); c.rect(23, rn(3), 6, 2, "2"); c.hline(23, rn(1), 6, "3"); c.hline(23, rn(0), 6, "1")
  c.rect(28, rn(12), 4, 10, "3"); c.vline(31, rn(12), 10, "2"); c.rect(28, rn(2), 7, 2, "4"); c.hline(28, rn(0), 7, "2"); c.px(34, rn(1), "5")
  // the cape: the round of her back on the left, plastic, stiff in long folds, and the hem cut straight and darker
  const cape = (x, y, x0, x1, t) => (t > 0.95 ? "n" : x === 19 || x === 27 ? (t > 0.1 ? "b" : "B") : x === 24 && t > 0.45 ? "b" : x === x0 && t > 0.35 ? "b" : x === x1 ? "b" : "B")
  taper(c, rn(29), 17, 23, rn(27), 15, 25, () => "B")
  taper(c, rn(26), 15, 26, rn(11), 10, 31, cape)
  g(c, 12, rn(23), ["a..", "aa.", ".a."]); c.hline(17, rn(27), 4, "a"); c.px(30, rn(13), "n"); c.px(29, rn(14), "n")
  // the far arm out to the held bucket, the cape's sleeve, her hand round the handle
  sleeve(c, 25, rn(24), 32, rn(19), 3, "B", "b", "n"); c.rect(32, rn(21), 2, 2, "y"); c.px(33, rn(20), "Y")
  // the held bucket, under the drip; its handle; the water; the drop counter clipped under the rim
  c.line(32, rn(21), 36, rn(25), "g"); c.line(36, rn(25), 40, rn(21), "g")
  taper(c, rn(20), 32, 40, rn(12), 33, 39, (x, y, x0, x1, t) => (t > 0.85 || x === x1 ? "g" : x === x0 ? "g" : "G"))
  c.hline(33, rn(20), 7, "n"); c.hline(34, rn(20), 5, o.drop ? "V" : "6")
  c.rect(35, rn(18), 5, 3, "1"); c.px(38, rn(17), o.drop ? "V" : "c"); c.px(37, rn(17), o.drop ? "v" : "1"); c.hline(35, rn(16), 5, "3")
  // the near arm under the cape, on her knee: only its fold shows
  c.line(15, rn(20), 23, rn(16), "b"); c.line(16, rn(21), 22, rn(18), "a")
  // the wide flat head, far forward under the sou'wester, wider than the hat; milky eyes at its very edges; a mouth from side to side
  g(c, 12, 0, [
    "...........baaBBb.......",
    "..........aaBBBBBb......",
    ".........bBBBBBBBBb.....",
    "......bbBBBbbbbbBBBbb...",
    "....bBBBbnnnnnnnnnbbbb..",
    "..bbbbbnyyyyyYYyyyyyyyy.",
    ".bb.uyyyyyyyyYyyyyyyyyyy",
    "....WWyyyYYyyyyyyYYyyyWW",
    "...uwWyyyyYyyyyyyyyyyywW",
    "...yyyyyyyyyyyyyYYyyyyyy",
    "...jkkkkkkkkkkkkkkkkkkkj",
    "...jjuuuuuuuuuuuuuuuuujj",
    ".....YuuuuYuuuuuuYuuY...",
  ])
  if (o.talk) { c.hline(16, 11, 17, "k"); c.hline(18, 12, 13, "Y") }
  // the barbels, thick and orange: the long ones from the mouth's corners, one down over her chest, one into the bucket
  const tw = o.twitch ? 1 : 0
  c.line(35, 11, 36, 13, "J"); c.line(36, 11, 37, 13, "j"); c.rect(36, 14, 2, 3, "J"); c.vline(37, 14, 3, "j"); c.vline(37, 17, 1, "J")
  c.line(15, 11, 14, 15, "J"); c.line(16, 11, 15, 15, "j"); c.rect(14, 16, 2, 3, "J"); c.vline(15, 16, 3, "j"); c.line(14, 19, 13 - tw, 22, "J"); c.px(13 - tw, 23, "j")
  // and two short ones from the chin
  c.vline(21, 13, 3, "J"); c.px(21 + tw, 16, "j"); c.vline(29, 13, 3, "J"); c.px(29, 16, "j")
}
const REGEN_IDLE = [{}, { drop: true }, {}, { twitch: true }, { drop: true }, {}]
for (const [dir, flip] of SETS) {
  anim(`regen_idle_${dir}`, { w: RW, h: RH, outline: "k", pivot: "bottom", frames: 6, ms: [1100, 110, 640, 150, 110, 1600], ...flip }, (c) => regen(c, REGEN_IDLE[c.frame]))
  anim(`regen_talk_${dir}`, { w: RW, h: RH, outline: "k", pivot: "bottom", frames: 2, ms: [200, 200], ...flip }, (c) => regen(c, { talk: c.frame === 1, twitch: c.frame === 1 }))
}

// ---------------------------------------------------------------- Frau Imai, at her table, with the tea that has gone cold
const IW = 51, IH = 41, im = (h) => IH - 1 - h
// Nagiwa.lullBeat (game/nagiwa.js) as lengths, from the start of its 3600 ms: on, off, on, off, on, off, on, off. Long, short, short, long, then the pause.
const LULL = [800, 300, 250, 300, 250, 300, 800, 600]
const imai = (c, o = {}) => {
  // the chair close behind her, as the user drew it: its back a tall frame (two posts, a rail sloping with the floor's lines), the
  // seat under her running forward, the legs straight down; her legs under the table
  c.rect(11, 9, 2, 32, "4"); c.vline(11, 9, 32, "5"); c.rect(14, 7, 2, 18, "4")
  c.line(11, 9, 15, 7, "6"); c.line(11, 10, 15, 8, "5")
  for (let k = 0; k < 9; k++) { c.px(11 + k, 26 + Math.floor(k / 2), "6"); c.px(11 + k, 27 + Math.floor(k / 2), "3") }   // the seat's near edge
  c.rect(19, 31, 2, 10, "3")                                                            // its front leg
  c.rect(15, im(19), 14, 5, "2"); c.hline(15, im(19), 14, "3"); c.rect(26, im(14), 4, 12, "3"); c.vline(29, im(14), 12, "2"); c.rect(26, im(2), 6, 3, "1"); c.hline(26, im(2), 6, "3"); c.rect(22, im(11), 3, 10, "2"); c.rect(22, im(1), 5, 2, "1")
  // the cardigan: round shoulders, and sagging
  taper(c, im(29), 16, 24, im(15), 13, 27, (x, y, x0, x1, t) => (t > 0.85 ? "d" : x === x1 || x === x0 ? "e" : (x === 21 && t > 0.15) ? "e" : t < 0.1 ? "C" : "C"))
  c.hline(18, im(30), 5, "e")
  // the table; its foot; the saucer and a cup of cold tea, no steam
  c.rect(36, im(19), 3, 18, "3"); c.vline(38, im(19), 18, "2"); c.ellipse(37, im(1), 6, 1, "3"); c.hline(32, im(0), 11, "2")
  c.ellipse(37, im(23), 11, 3, "5"); c.hline(30, im(25), 14, "6"); c.hline(27, im(22), 21, "4"); c.hline(30, im(21), 15, "3")
  c.hline(36, im(25), 10, "w"); c.rect(38, im(29), 6, 4, "W"); c.vline(43, im(29), 4, "w"); c.hline(39, im(29), 4, "t")
  c.px(44, im(28), "W"); c.px(45, im(27), "W"); c.px(44, im(26), "w")                    // the cup's handle
  // the far arm lying on the table behind the near one; the near arm to the cup: she hasn't drunk
  c.rect(27, im(25), 8, 2, "d")
  sleeve(c, 24, im(23), 33, im(25), 3, "C", "C", "e")
  // her hand round the cup: two long sloth's fingers over its front, a claw at the end of each
  g(c, 33, im(27), [
    "oooooo=",
    "oOO....",
    "oooooo=",
  ])
  // the neck; the head as in her portrait: round, black hair with moss in it and in the bun, the sloth's dark stripe down from each eye,
  // a small smile (she looks past whoever talks to her)
  c.rect(22, im(31), 4, 3, "O")
  g(c, 20, im(39), [
    "..hhhh%h..",
    ".hh%hhhhhh",
    "hhhhhh&hhh",
    "hOoooooooh",
    "hOookookoo",
    "hOotoooto.",
    ".Otooooooo",
    ".OooOOOoo.",
    "..OoooooO.",
    "...OOOO...",
  ])
  g(c, 16, im(40), [".hh%h", "h%hhh", "hhh&h", ".hhh."])
  if (o.talk) { c.px(25, im(31), "t"); c.px(26, im(31), "t") }
  // Lull, behind the ear as on everyone: bright on the beat, a dim coal in its pauses
  if (o.lull) g(c, 17, im(35), [".^.", "^~^", "~~~", "^~^", ".^."])
  else g(c, 17, im(35), ["...", ".^.", "^^^", ".^.", "..."])
}
// talk: the mouth at 2 x 200 ms, but cut at the beat's edges too, so the point goes on keeping time while she speaks
const beatAt = (t) => { let at = 0; for (let i = 0; i < LULL.length; i++) { at += LULL[i]; if (t < at) return i % 2 === 0 } return false }
const cuts = [...new Set([...LULL.map((_, i) => LULL.slice(0, i).reduce((a, b) => a + b, 0)), ...Array.from({ length: 18 }, (_, i) => i * 200)])].sort((a, b) => a - b)
const TALK_MS = cuts.map((t, i) => (cuts[i + 1] ?? 3600) - t)
for (const [dir, flip] of SETS) {
  anim(`imai_idle_${dir}`, { w: IW, h: IH, outline: "k", pivot: "bottom", frames: LULL.length, ms: LULL, ...flip }, (c) => imai(c, { lull: c.frame % 2 === 0 }))
  anim(`imai_talk_${dir}`, { w: IW, h: IH, outline: "k", pivot: "bottom", frames: cuts.length, ms: TALK_MS, ...flip }, (c) => imai(c, { lull: beatAt(cuts[c.frame]), talk: Math.floor(cuts[c.frame] / 200) % 2 === 1 }))
}

// ---------------------------------------------------------------- The Preacher of the Waking Church, on his crate
const PW = 47, PH = 69, pn = (h) => PH - 1 - h
const prediger = (c, o = {}) => {
  const up = o.jerk ?? 0
  // the crate: a plastic milk crate, its top catching the light
  c.rect(14, pn(11), 19, 12, "5"); c.hline(14, pn(11), 19, "6"); c.hline(14, pn(0), 19, "4"); for (const x of [17, 22, 27]) c.rect(x, pn(8), 3, 6, "2")
  // his thin legs and his shoes
  c.rect(19, pn(30), 3, 17, "3"); c.rect(25, pn(30), 3, 17, "4"); c.vline(21, pn(30), 17, "2"); c.vline(27, pn(30), 17, "3"); c.rect(18, pn(13), 5, 2, "2"); c.rect(25, pn(13), 6, 2, "2"); c.hline(25, pn(13), 6, "4"); c.hline(18, pn(13), 5, "3")
  // the long coat, hanging straight off his shoulders; the seam of its opening towards the side he faces
  taper(c, pn(53), 17, 29, pn(25), 16, 31, (x, y, x0, x1, t) => (t > 0.93 ? "x" : x === 27 ? "x" : x === x1 || x === x0 ? "i" : (x === 20 && t > 0.3) ? "i" : "D"))
  c.hline(19, pn(54), 9, "D")
  // the arm with the hanging thermos
  sleeve(c, 17, pn(53), 11, pn(42), 3, "D", "i", "x"); g(c, 9, pn(42), ["sss", "sSs"])
  c.rect(8, pn(40), 5, 11, "T"); c.vline(12, pn(40), 11, "X"); c.hline(8, pn(30), 5, "X"); c.rect(8, pn(40), 5, 2, "Q"); c.hline(8, pn(39), 5, "P")
  // the other, up with the thermos he offers
  sleeve(c, 29, pn(53), 40, pn(49), 3, "D", "i", "x"); sleeve(c, 40, pn(49), 42, pn(55 + up), 3, "D", "i", "x"); g(c, 43, pn(58 + up), ["ss", "sS", "ss"])
  c.rect(42, pn(66 + up), 5, 9, "T"); c.vline(46, pn(66 + up), 9, "X"); c.hline(42, pn(58 + up), 5, "X"); c.rect(42, pn(66 + up), 5, 2, "Q"); c.hline(42, pn(65 + up), 5, "P")
  // the counter on its cord: the days he has been awake, in the only colour technology has
  c.line(20, pn(54), 21, pn(51), "x"); c.line(26, pn(54), 25, pn(51), "x")
  c.rect(19, pn(50), 9, 7, "3"); c.rect(20, pn(49), 7, 5, "1")
  write(c, o.days < 10 ? 22 : 20, pn(49), String(o.days), "v", o.mirrored)
  // the neck, thin; the skull, flat and wide
  c.rect(21, pn(55), 5, 2, "S")
  g(c, 13, pn(64), [
    "...ssssssssssss....",
    "..ssssssssssssss...",
    ".sssssssssssssssss.",
    ".sSssssssssssssssss",
    ".sssssssssssssssss.",
    ".sssssssssssssssss.",
    ".sSssssssssssssssss",
    ".sssssssssssssssss.",
    "..ssssssssssssssss.",
    "..ssSkkkkkkkkkkkkk.",
    "...ssssssssssSsss..",
    ".....ssSssssssss...",
  ])
  // the crest instead of hair: flaps of skin along the skull, soft, falling back
  g(c, 8, pn(66), [
    ".......q.q.q.",
    ".....qZqZqZq.",
    "...qqZZZZZZq.",
    ".qqZZZZqqqq..",
    "qZZZqqq......",
    ".qZq.........",
    "..q..........",
  ])
  // the eyes: enormous, lidless, standing out of the skull, raw along their lower rims; slit pupils that have stopped moving
  g(c, 17, pn(67), [
    "..qqqqq..",
    ".qQRRRQq.",
    "qQRRkRQQq",
    "qQQQkQQQq",
    "qQQQkQQQq",
    "qQQQkQQQq",
    "qPQQkQQPq",
    ".rPPkPPr.",
    "..rrrrr..",
  ])
  g(c, 27, pn(66), [
    ".qqqq.",
    "qQRRQq",
    "qQkQQq",
    "qQkQQq",
    "qQkQQq",
    "qPkQPq",
    ".rPPr.",
    "..rr..",
  ])
  if (o.talk) { c.hline(18, pn(54), 12, "k"); c.hline(19, pn(53), 9, "r") }
  // the tongue: out of the mouth's corner, up round the far eye
  const tn = o.tongue ?? 0
  if (tn >= 1) { c.rect(31, pn(56), 2, 2, "p"); c.px(32, pn(55), "r") }
  if (tn >= 2) { c.rect(32, pn(60), 2, 5, "p"); c.vline(33, pn(60), 5, "r") }
  if (tn >= 3) { c.rect(32, pn(64), 2, 4, "p"); c.vline(33, pn(64), 4, "r"); c.px(31, pn(64), "p") }
  if (tn === 4) { c.rect(28, pn(64), 4, 2, "p"); c.hline(28, pn(63), 4, "r") }
  if (o.wet) { c.px(28, pn(64), "W"); c.px(29, pn(64), "W") }
}
// he stares; now and then, once in the loop, he wets an eye
const LICK = [0, 1, 2, 3, 4, 2, 0], LICK_MS = [3400, 90, 90, 120, 160, 90, 1500]
const DAYS = [9, 10, 11]
for (const days of DAYS) for (const [dir, flip] of SETS) {
  const mirrored = dir === "sw"
  anim(`prediger_idle_${days}_${dir}`, { w: PW, h: PH, outline: "k", pivot: "bottom", frames: LICK.length, ms: LICK_MS, ...flip }, (c) => prediger(c, { days, mirrored, tongue: LICK[c.frame], wet: c.frame === 6 }))
  anim(`prediger_talk_${days}_${dir}`, { w: PW, h: PH, outline: "k", pivot: "bottom", frames: 2, ms: [200, 200], ...flip }, (c) => prediger(c, { days, mirrored, talk: c.frame === 1, jerk: c.frame === 1 ? 1 : 0 }))
}

// ---------------------------------------------------------------- The Fitter, a mole: he works by touch, the lamp sees for him
const MW = 45, MH = 59, mn = (h) => MH - 1 - h
// half the size of the blocks' hands, still pink, still clawed
const HAND = [".????.", "??????", "?:??:?", "=.=.=.", "=.=.=."]
const coat = (c, back) => {
  // his boots and short legs under the long coat
  c.rect(15, mn(12), 5, 9, "2"); c.rect(24, mn(12), 5, 9, "3"); c.rect(14, mn(3), 7, 4, "1"); c.rect(23, mn(3), 7, 4, "1"); c.hline(14, mn(3), 7, "3"); c.hline(23, mn(3), 7, "3")
  // the coat: a pear, wet at the shoulders and from the knees down, and the wet climbs in tongues
  const tone = (x, y, x0, x1, t) => (x === x1 || x === x0 ? "m" : (x === 17 || x === 26) && t > 0.1 ? "m" : "M")
  taper(c, mn(40), 14, 28, mn(30), 10, 32, tone)
  taper(c, mn(29), 10, 32, mn(10), 8, 34, tone)
  // the wet, a hand's breadth down the shoulders
  g(c, 13, mn(39), ["NNNNNNNNNNNNNNNNN", "NNNNNNNNNNNNNNNNN", "NNNNNNNNNNNNNNNNNN", "NNNN.NNN.NNN.NNNN.", ".N.....N.....N..N."])
  // and from the knees down
  c.rect(8, mn(14), 27, 5, "N"); c.hline(8, mn(10), 27, "3")
  for (const [x, up] of [[11, 2], [14, 1], [19, 3], [23, 1], [28, 2], [32, 1]]) c.rect(x, mn(14 + up), 2, up, "N")
  // his belt, its pouch
  c.hline(10, mn(28), 23, ","); if (!back) { c.rect(26, mn(27), 4, 5, ";"); c.hline(26, mn(27), 4, ",") }
}
const collar = (c, y) => g(c, 12, y, [
  "..@@@@@@@@@@@@@@...",
  ".@@!@@@@@@@@@!@@@..",
  "@@@@@@!@@@!@@@@@@@.",
  "@.@@.@@.@@.@@.@@.@.",
  "..@...@...@...@....",
])
const hat = (c, front) => {
  g(c, 15, mn(52), [
    "...zzzzzzz...",
    ".zzzzzzzzzzz.",
    "zzzzzzzzzzzzz",
    "|||||||||||||",
    "2222222222222",
  ])
  c.hline(13, mn(47), front ? 19 : 18, "|")
}
const monteurSE = (c, o = {}) => {
  coat(c, false)
  // the short thick arms, the hands small at their ends; the screwdriver in the near one
  sleeve(c, 12, mn(38), 8, mn(27), 5, "N", "m", "N"); g(c, 5, mn(25), HAND)
  sleeve(c, 30, mn(38), 34, mn(27), 5, "N", "m", "N"); g(c, 33, mn(25), HAND)
  c.line(36, mn(20), 38, mn(11), "7"); c.px(36, mn(21), ";")
  collar(c, mn(42))
  // the head sunk into its pelt: tiny eyes, nearly nothing, and the snout out from under the brim
  c.rect(14, mn(46), 16, 6, "@"); c.hline(16, mn(44), 3, "!"); c.px(22, mn(43), "!"); c.px(25, mn(45), "7")
  g(c, 26, mn(45), ["...?????..", "..???????.", "..?????::?", "...:::::.."])
  if (o.talk) { c.hline(28, mn(41), 5, "k"); c.hline(29, mn(40), 3, ":") }
  hat(c, true)
  // the lamp on the brow, his only eyes
  c.rect(27, mn(51), 5, 4, "c"); c.rect(28, mn(50), 4, 3, "V"); c.vline(32, mn(50), 2, "v")
}
const monteurNE = (c, o = {}) => {
  const [ax, ay] = o.arm ?? [0, 0]
  coat(c, true)
  // the 9-A stencilled on his back
  c.rect(15, mn(38), 13, 7, "m"); write(c, 16, mn(37), "9-A", "1", false)
  // the far arm hanging, the small hand
  sleeve(c, 11, mn(38), 7, mn(27), 5, "M", "m", "N"); g(c, 4, mn(25), HAND)
  // the raised arm to the screen, the screwdriver like a toothpick in it
  sleeve(c, 29, mn(38), 33 + ax, mn(46 + ay), 5, "M", "m", "N"); g(c, 32 + ax, mn(51 + ay), [".????.", "??????", "?:??:?", ".????."])
  c.line(38 + ax, mn(51 + ay), 42 + ax, mn(57 + ay), "7"); c.rect(37 + ax, mn(51 + ay), 2, 2, ";")
  collar(c, mn(42))
  c.rect(14, mn(47), 16, 6, "@"); c.hline(18, mn(45), 3, "!"); c.px(24, mn(44), "!")
  hat(c, false)
  // the lamp's edge past the hat
  c.px(28, mn(49), "V"); c.px(29, mn(49), "v")
}
const WORK = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 0], [0, 1]]
anim("monteur_idle_ne", { w: MW, h: MH, outline: "k", pivot: "bottom", frames: 6, ms: [320, 240, 240, 320, 240, 900] }, (c) => monteurNE(c, { arm: WORK[c.frame] }))
for (const [dir, flip] of SETS) {
  anim(`monteur_talk_${dir}`, { w: MW, h: MH, outline: "k", pivot: "bottom", frames: 2, ms: [200, 200], ...flip }, (c) => monteurSE(c, { talk: c.frame === 1 }))
}

})()
