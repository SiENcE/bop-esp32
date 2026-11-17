// Chapter 2, what comes after Chapter 1 (kapitel2-design §5, §10): the new figures, painted on the lines of the blocks the user chose
// (2026-11-17, art/test/k2_folgen_blocks.px.js, docs/characters/k2_folgen_blocks_x4.png). Light from the upper left, as everyone in street
// mode; the rooms' lamps light them at runtime.
//   vargas_mann_idle_se, _ne, _talk_se   Varga's man (after K1a lied), "the heavy one", with an octopus mod: the head an octopus's mantle,
//                       mottled, its eyes with slit pupils, tentacles hanging over his chest like a beard, tentacles for hands out of
//                       the sleeves; a heavy dark leather coat over a grey roll-neck; 1.90 m, broad as the door. 27x55 inside (29x57),
//                       pivot bottom. Idle: the beard's tentacles curl and uncurl slowly, a hand's tips twitch; talking: the beard parts
//                       (where the mouth is), the mantle swells a pixel. He carries nothing on one side: NW is NE mirrored
//   kessler_top_idle_down, _talk_down    Kessler on the Drain Market (after K1a sold, or no answer), from above as everyone there
//                       (art/characters/markt_people.px.js), sitting on a flattened box with his legs forward, his left arm in plaster
//                       in a sling across his chest, his knitted scarf, his cap upside down a little before his feet with a coin in it.
//                       21x30, the ground point in the middle of the upper 21x21 (where he sits). Idle: his head nods off and up again;
//                       talking: it lifts toward whoever stands there
;(() => {

pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // the leather coat: its sheen, lit, mid, shade, the deep fold; the roll-neck (light, shade); trousers; boots and their shine
  N: "#6a5448", L: "#4a3a34", M: "#33282a", m: "#221a1e", n: "#160f12", R: "#7a7c84", r: "#4a4c54", t: "#22242e", b: "#121420",
  // the octopus mod: highlight, lit, mid, shade, deep; the mottling; the suckers; the eyes' white and slit
  A: "#c88aa8", P: "#9a5a78", p: "#6a3a58", d: "#3e2236", D: "#2a1626", Z: "#d8a8b8", W: "#f4f0e8", e: "#1a0e14",
  // Kessler: coat (lit, mid, shade), skin (lit, shade), thin hair, the scarf (lit, mid, shade), plaster (white, shade), the sling,
  // the box (lit, mid, shade), the cap, the coin, shoes
  C: "#6e7484", c: "#4e5262", s: "#3a3e4c", S: "#d79676", T: "#93583f", h: "#8a7a6a",
  F: "#e8b860", f: "#d0a050", q: "#9a7030", X: "#f4f0e8", x: "#c8c4bc", y: "#7a7e8c",
  B: "#9a7a52", G: "#7a6040", g: "#4a3a2a", O: "#2a2018", Q: "#e0c070", o: "#1c1612",
})

const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

// ================================================================ Varga's man, 27x55 inside, the middle column 13
const VW = 27, VH = 55, X0 = 13
/** f: { i (frame), talk } */
function man(c, view, f) {
  const se = view === "se"
  // the legs, the near a step forward; heavy boots, their toes catching the light
  c.rect(X0 - 5, 40, 4, 11, "t"); c.rect(X0 + 1, 40, 4, 11, "t"); c.vline(X0 - 1, 40, 11, "b"); c.vline(X0 + 2, 41, 10, "r")
  c.rect(X0 - 6, 51, 6, 3, "b"); c.rect(X0 + 1, 51, 6, 3, "b"); c.hline(X0 + 2, 51, 4, "3"); c.hline(X0 - 5, 51, 3, "2"); c.px(X0 + 5, 52, "4")
  // the coat: broad shoulders, straight down to the thighs; the far side (left, toward the light) lit, the near side in shade,
  // the leather's sheen on the shoulders and down the far front
  for (let r = 13; r <= 41; r++) {
    const half = r === 13 ? 9 : r <= 15 ? 11 : 11 - Math.round((r - 16) / 14)
    c.rect(X0 - half, r, half * 2 + 1, 1, "M"); c.px(X0 - half, r, "L"); c.px(X0 - half + 1, r, "L"); c.px(X0 + half, r, "m"); c.px(X0 + half - 1, r, "m")
  }
  c.hline(X0 - 8, 13, 17, "L"); c.hline(X0 - 9, 14, 4, "N"); c.hline(X0 + 5, 14, 3, "L")
  for (const r of [20, 27, 34]) { c.px(X0 - 10, r, "N"); c.px(X0 - 9, r + 1, "N") }                // the sheen where the leather creases
  c.hline(X0 - 10, 41, 21, "m"); c.hline(X0 - 9, 40, 19, "n")
  if (se) {
    // open over the roll-neck, the lapels lying back; the belt's buckle under the coat's edge; the pockets
    c.rect(X0 - 1, 13, 5, 12, "R"); c.vline(X0 + 3, 13, 12, "r"); c.vline(X0 - 1, 13, 12, "r")
    c.line(X0 - 2, 14, X0 - 1, 24, "N"); c.line(X0 + 5, 14, X0 + 4, 24, "n")
    c.vline(X0 + 4, 25, 15, "n"); c.vline(X0 + 3, 25, 15, "L")                                       // the coat's front edge
    c.hline(X0 - 9, 30, 4, "n"); c.hline(X0 + 6, 30, 4, "n")
  } else {
    c.vline(X0, 16, 25, "m"); c.vline(X0 + 1, 17, 23, "L"); c.hline(X0 - 9, 28, 4, "m"); c.hline(X0 + 6, 28, 4, "m")
    c.px(X0 - 4, 17, "N"); c.px(X0 + 4, 17, "L")                                                       // the shoulder blades
  }
  kraken(c, se, X0 + (se ? 1 : 0), f)
}
/** the octopus mod: the mantle for a head, slit-pupilled eyes, a beard of tentacles, tentacles for hands */
function kraken(c, se, hx, f) {
  const sway = [0, 1, 1, 0][f.i % 4], swell = f.talk && f.i % 2 ? 1 : 0
  c.rect(hx - 3, 7, 7, 7, "p"); c.vline(hx + 3, 7, 7, "d"); c.vline(hx - 3, 8, 6, "P"); c.px(hx - 2, 9, "A")   // the neck into the collar
  // the hands: three tentacles from each sleeve's end, curling at the tips, their suckers to us; the near hand's tips twitch
  for (const [x, dir] of [[X0 - 11, -1], [X0 + 11, 1]]) {
    c.rect(x - (dir < 0 ? 0 : 1), 26, 2, 3, "M")
    for (const [dx, len] of [[-1, 6], [0, 8], [1, 5]]) {
      const tx = x + dx, l = len + (dir > 0 && dx === 0 ? sway : 0)
      c.vline(tx, 29, l, dx === -1 ? "P" : "p"); c.px(tx + dir, 29 + l, "d"); c.px(tx + dir * 2, 28 + l, "p")
      if (se && dx === 0) for (let y = 30; y < 29 + l; y += 2) c.px(tx, y, "Z")
    }
  }
  if (se) {
    // the beard: five tentacles hanging over the coat's front, the middle ones longest, curling at the ends; talking, they part
    for (const [dx, len, curl] of [[-3, 7, -1], [-1, 11, 1], [1, 13, -1], [3, 10, 1], [4, 6, 1]]) {
      const tx = hx + dx + (f.talk && Math.abs(dx) <= 1 ? Math.sign(dx) : 0), l = len - (f.i % 2 && dx === 1 ? 1 : 0)
      c.vline(tx, 8, l, dx < 0 ? "P" : "p"); c.px(tx + curl * (1 + sway), 8 + l, "p"); c.px(tx + curl * (1 + sway), 7 + l, "d")
      for (let y = 10; y < 8 + l; y += 2) c.px(tx, y, "Z")
    }
    g(c, hx - 6, -swell, [
      "...pPAPp....",
      ".pPAAPPPPp..",
      "pPPPZPPPPPp.",
      "pPPPPPPZPPPd",
      "dpPPPPPPPpPd",
      ".dpPPPPPPpd.",
      "..pWePPWepd.",
      "..dpPPPPpd..",
      "...pPpPpP...",
    ])
    c.px(hx - 4, 1 - swell, "d"); c.px(hx + 2, 2 - swell, "d"); c.px(hx - 1, 3 - swell, "d")       // the mottling
  } else {
    for (const tx of [hx - 4, hx + 4]) { c.vline(tx, 8, 5, "p"); c.px(tx, 13, "d") }
    g(c, hx - 6, 0, [
      "...pPAPp....",
      ".pPAAPPPPp..",
      "pPPPZPPPPPp.",
      "pPPPPPPZPPPp",
      "pPdPPPPPPPdp",
      ".pPPPPPPPPp.",
      "..pPPPPPPp..",
      "...dpppd....",
    ])
  }
}
const IDLE_MS = [900, 700, 900, 700]
for (const view of ["se", "ne"])
  anim(`vargas_mann_idle_${view}`, { w: VW, h: VH, frames: 4, ms: IDLE_MS, outline: "k", pivot: "bottom" }, (c) => man(c, view, { i: c.frame }))
anim("vargas_mann_talk_se", { w: VW, h: VH, frames: 2, ms: [220, 200], outline: "k", pivot: "bottom" }, (c) => man(c, "se", { i: c.frame, talk: true }))

// ================================================================ Kessler from above, sitting (21x30; he sits at the middle of the upper 21x21)
function kessler(c, f) {
  const nod = f.talk ? -1 : f.i === 2 ? 1 : 0
  // the flattened box he sits on, its folds
  c.rect(4, 5, 13, 6, "B"); c.hline(4, 5, 13, "G"); c.hline(4, 10, 13, "g"); c.vline(10, 6, 4, "G")
  // the legs forward, the shoes; the shins' tops lit
  c.rect(5, 15, 4, 8, "c"); c.rect(12, 15, 4, 8, "c"); c.vline(5, 15, 8, "C"); c.vline(12, 15, 8, "C"); c.vline(8, 15, 8, "s"); c.vline(15, 15, 8, "s")
  c.rect(5, 22, 4, 2, "o"); c.rect(12, 22, 4, 2, "o"); c.px(5, 22, "O"); c.px(12, 22, "O")
  // the shoulders and back, hunched, lit on the far side
  c.ellipse(10, 11, 6, 4, "C"); c.hline(5, 9, 10, "c"); c.hline(6, 8, 4, "y"); c.px(15, 12, "s"); c.px(16, 11, "s")
  // the plaster arm across his chest in its sling, its white shaded underneath
  c.rect(11, 10, 6, 3, "X"); c.hline(11, 12, 6, "x"); c.px(16, 11, "x"); c.line(7, 8, 16, 12, "y")
  // the scarf round his neck, one end hanging down his front
  c.hline(6, 8, 9, "F"); c.hline(7, 8, 3, "f"); c.px(15, 9, "q"); c.px(15, 10, "f")
  // the head, bowed, thin hair over the crown; it nods off and lifts again
  c.ellipse(10, 7 + nod, 3, 3, "T"); c.px(9, 6 + nod, "S"); c.px(10, 6 + nod, "S"); c.px(8, 7 + nod, "S")
  c.px(11, 5 + nod, "h"); c.px(12, 6 + nod, "h")
  // the cap upside down a little before his feet, a coin in it
  c.ellipse(10, 28, 2, 1, "O"); c.hline(9, 28, 3, "o"); c.px(10, 28, "Q")
}
anim("kessler_top_idle_down", { w: 21, h: 30, frames: 4, ms: [1400, 900, 1600, 700], outline: "k" }, (c) => kessler(c, { i: c.frame }))
anim("kessler_top_talk_down", { w: 21, h: 30, frames: 2, ms: [220, 200], outline: "k" }, (c) => kessler(c, { i: c.frame, talk: true }))

})()
