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

})()
