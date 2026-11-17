// Chapter 2, what comes after Chapter 1 (kapitel2-design §5, §10): the new figures as blocks for the user's choice before anything is painted.
//   Varga's man (after K1a lied): "the heavy one" (dialog-style-guide §6), at the Kessel Block's door on Saturday and Sunday evening, standing
//   still against the wall; 1.90 m, broad as the door (57 px with the outline, Juno 50). He carries nothing on one side: NW = NE mirrored.
//     A  plain: shaved head, a short dark beard, a heavy dark leather coat to the thighs, open over a grey roll-neck, hands in the coat's
//        pockets; Varga's mark: a gold ring on his little finger (Varga's watch is gold too, cam04)
//     B  with a mod (style guide §6, the animal mods; the user wanted a water animal, an octopus, 2026-11-17): the head an octopus's mantle,
//        its eyes with slit pupils, tentacles hanging over his chest like a beard, tentacles for hands, the same coat
//   Bao with his bandage (after K1b sold, Monday): his painted figure (art/characters/bao.px.js) with a white bandage round his head and a
//   pad of gauze over his right temple; he is drawn facing SE and flipped for SW, the bandage goes all round, so the flip is right
//   Kessler on the Drain Market (after K1a sold, or no answer), from above as everyone there (art/characters/markt_people.px.js, 21x21,
//   the ground point in the middle): sitting on a flattened box, his legs forward, his left arm in white plaster in a sling across his
//   chest, his knitted scarf (his tell in the feeds), a cap upside down a little before his feet for coins
//   k2fb                         the sheet: Juno, A and B (SE, NE, NW), Bao before and after, Kessler from above beside Juno from above
//   k2fb_<name>                  each alone (for the shots in the game)
"use strict"
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // the leather coat: lit, mid, shade; the roll-neck; trousers; boots
  L: "#4a3a34", M: "#33282a", m: "#221a1e", R: "#6e7078", r: "#4a4c54", t: "#22242e", b: "#121420",
  // skin and beard; the octopus mod: lit, mid, shade, its suckers, the eyes' white
  S: "#c08a68", s: "#8a5a42", a: "#2a201c", P: "#9a5a78", p: "#6a3a58", d: "#3e2236", Z: "#d8a8b8", W: "#f4f0e8",
  // gold; the bandage and gauze; the plaster
  Y: "#e8c060", W: "#f4f0e8", w: "#c8c4bc",
  // Kessler: coat, its shade, the scarf, the box, the cap, coins
  C: "#5a6070", c: "#3e4250", F: "#d0a050", f: "#9a7030", B: "#7a6040", O: "#4a3a2a", o: "#2a2018", Q: "#c0b070",
})
include("../lib/text.js")

const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

// ================================================================ Varga's man, 27x55 inside, the middle column 13
const VW = 27, VH = 55, X0 = 13
function man(c, view, way) {
  const se = view === "se", B = way === "B"
  // legs and boots, the near a step forward
  c.rect(X0 - 5, 40, 4, 11, "t"); c.rect(X0 + 1, 40, 4, 11, "t"); c.vline(X0 - 1, 40, 11, "b")
  c.rect(X0 - 6, 51, 6, 3, "b"); c.rect(X0 + 1, 51, 6, 3, "b"); c.hline(X0 + 2, 51, 4, "3")
  // the coat: broad shoulders, straight down to the thighs, the far side (left, toward the light) lit
  for (let r = 13; r <= 41; r++) {
    const half = r === 13 ? 9 : r <= 15 ? 11 : 11 - Math.round((r - 16) / 14)
    c.rect(X0 - half, r, half * 2 + 1, 1, "M"); c.px(X0 - half, r, "L"); c.px(X0 - half + 1, r, "L"); c.px(X0 + half, r, "m")
  }
  c.hline(X0 - 10, 41, 21, "m")
  if (se) {
    // open over the roll-neck; the lapels; the hands in the pockets (the pocket flaps bulging), the ring on the little finger
    c.rect(X0 - 1, 13, 5, 12, "R"); c.vline(X0 + 3, 13, 12, "r"); c.line(X0 - 2, 14, X0 - 1, 24, "L"); c.line(X0 + 5, 14, X0 + 4, 24, "m")
    if (!B) { c.rect(X0 - 9, 28, 5, 4, "m"); c.rect(X0 + 5, 28, 5, 4, "m"); c.hline(X0 - 9, 28, 5, "L"); c.px(X0 + 7, 31, "Y") }
  } else {
    c.vline(X0, 16, 25, "m"); c.hline(X0 - 9, 28, 4, "m"); c.hline(X0 + 6, 28, 4, "m")      // the back's seam, the pockets from behind
  }
  const hx = X0 + (se ? 1 : 0)
  if (B) { kraken(c, se, hx); return }
  // the neck and head: shaved, a short beard, the face turned a little to the lower right
  c.rect(hx - 3, 9, 7, 5, se ? "s" : "S")
  if (se) {
    g(c, hx - 5, 0, [
      "..SSSSSS..",
      ".SSSSSSSS.",
      "SSSSSSSSSs",
      "SSSkSSSkSs",
      "SSSSSSSSSs",
      "SSSSSsSSSs",
      "sSaaaaaaSs",
      ".saassaas.",
      "..aaaaaa..",
    ])
  } else {
    g(c, hx - 5, 0, [
      "..SSSSSS..",
      ".SSSSSSSS.",
      "SSSSSSSSSs",
      "SSSSSSSSSs",
      "SSSSSSSSSs",
      "sSSSSSSSss",
      "sSSSSSSSss",
      ".sssssss..",
      "..aaaaaa..",
    ])
  }
}
/** B: the octopus mod (the user's wish, 2026-11-17): the head a mantle, its eyes with slit pupils, tentacles hanging from where the
 *  mouth would be over his chest like a beard; tentacles for hands, out of the sleeves, curling */
function kraken(c, se, hx) {
  c.rect(hx - 3, 7, 7, 7, "p"); c.vline(hx + 3, 7, 7, "d"); c.vline(hx - 3, 8, 6, "P")        // the neck, thick and soft, into the collar
  // the hands: from the sleeves' ends at the sides, three tentacles each, curling at the tips
  for (const [x, dir] of [[X0 - 11, -1], [X0 + 11, 1]]) {
    c.rect(x - (dir < 0 ? 0 : 1), 26, 2, 3, "M")
    for (const [dx, len] of [[-1, 6], [0, 8], [1, 5]]) {
      const tx = x + dx
      c.vline(tx, 29, len, "p"); c.px(tx + dir, 29 + len, "p")
      if (se && dx === 0) for (let y = 30; y < 29 + len; y += 2) c.px(tx, y, "Z")
    }
  }
  if (se) {
    // tentacles hanging over the coat's front, the middle ones longest, their suckers to us
    for (const [dx, len, curl] of [[-3, 7, -1], [-1, 11, 1], [1, 13, -1], [3, 10, 1], [4, 6, 1]]) {
      const tx = hx + dx
      c.vline(tx, 8, len, "p"); c.px(tx + curl, 8 + len, "p"); for (let y = 10; y < 8 + len; y += 2) c.px(tx, y, "Z")
    }
    g(c, hx - 6, 0, [
      "...pPPPp....",
      ".pPPPPPPPp..",
      "pPPPZPPPPPp.",
      "pPPPPPPZPPPd",
      "dpPPPPPPPPpd",
      ".dpPPPPPPpd.",
      "..pWkPPWkpd.",
      "..dpPPPPpd..",
      "...pPpPpP...",
    ])
  } else {
    for (const tx of [hx - 4, hx + 4]) { c.vline(tx, 8, 5, "p"); c.px(tx, 13, "d") }   // the beard's outer tentacles past his neck
    g(c, hx - 6, 0, [
      "...pPPPp....",
      ".pPPPPPPPp..",
      "pPPPZPPPPPp.",
      "pPPPPPPZPPPp",
      "pPPPPPPPPPPp",
      ".pPPPPPPPPp.",
      "..pPPPPPPp..",
      "...dpppd....",
    ])
  }
}
const POSES = [["se", "se"], ["ne", "ne"]]
for (const way of ["a", "b"]) for (const [n, view] of POSES)
  sprite(`k2fb_mann_${way}_${n}`, { w: VW, h: VH, outline: "k", pivot: "bottom" }, (c) => man(c, view, way.toUpperCase()))

// ================================================================ Bao with his bandage, over his painted figure (31x50)
sprite("_k2fb_bao", { png: "../../build/art/characters/anims/bao_idle_se.png", area: [0, 0, 31, 50] })
sprite("_k2fb_bao_b", { base: "_k2fb_bao", pivot: "bottom" })
sprite("k2fb_bao_bandage", { w: 31, h: 50, pivot: "bottom" }, (c) => {
  c.stamp("_k2fb_bao", 0, 0)
  // the bandage as it is wrapped: across the brow, his bald crown free above it (the user, 2026-11-17), round the far side over the ear
  // and the temple (the screen's left), its turns showing as grey lines; his eyes and the near cheek free. Only over the head, never its outline
  const head = (x, y) => { const k = c.key(x, y); return k && k !== "k" && k !== "." }
  for (let y = 4; y <= 5; y++) for (let x = 10; x <= 20; x++) if (head(x, y)) c.px(x, y, (x + 2 * y) % 5 === 0 ? "w" : "W")
  for (let y = 6; y <= 9; y++) for (let x = 10; x <= 12; x++) if (head(x, y)) c.px(x, y, x === 12 ? "w" : "W")
  for (let x = 11; x <= 20; x++) if (head(x, 5)) c.px(x, 5, "w")              // the band's lower edge over the brows
})

// ================================================================ Kessler from above, sitting (21x27, the ground point in the middle of 21x21)
sprite("k2fb_kessler_top", { w: 21, h: 30, outline: "k" }, (c) => {
  c.rect(4, 5, 13, 6, "B"); c.hline(4, 5, 13, "O")                                  // the flattened box he sits on (behind him)
  c.rect(5, 15, 4, 8, "c"); c.rect(12, 15, 4, 8, "c"); c.rect(5, 22, 4, 2, "o"); c.rect(12, 22, 4, 2, "o")   // the legs forward, the shoes
  c.ellipse(10, 11, 6, 4, "C"); c.hline(5, 9, 10, "c")                               // the shoulders and back, hunched
  c.rect(11, 10, 6, 3, "W"); c.hline(11, 12, 6, "w"); c.line(7, 8, 16, 12, "w")      // the plaster arm across his chest in its sling
  c.hline(6, 8, 9, "F"); c.px(15, 9, "f"); c.px(15, 10, "F")                          // the scarf round his neck, one end hanging
  c.ellipse(10, 7, 3, 3, "s"); c.px(9, 6, "S"); c.px(10, 6, "S")                      // the head bowed, thin hair
  c.ellipse(10, 28, 2, 1, "o"); c.px(10, 28, "Q")                                     // the cap upside down a little before his feet, a coin in it
})

// ================================================================ the sheet
sprite("_k2fb_juno", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50], pivot: "bottom" })
sprite("_k2fb_juno_top", { png: "../../build/art/characters/anims/juno_top_idle_down.png", area: [0, 0, 21, 21] })
const SW = 300, SH = 150, FY = 74
scene("k2fb", { w: SW, h: SH, bg: "3" }, (c) => {
  c.rect(0, FY, SW, 38, "4")
  c.stamp("_k2fb_juno", 16, FY); TXT.draw(c, 16, 3, "JUNO", "7", { font: "hud", align: "center" })
  const shots = [["se", false, "SE"], ["ne", false, "NE"], ["ne", true, "NW"]]
  for (const way of ["a", "b"]) {
    const x0 = way === "a" ? 46 : 140
    TXT.draw(c, x0 + 30, 3, way === "a" ? "A" : "B KRAKE", "7", { font: "hud", align: "center" })
    shots.forEach(([n, flip, lab], i) => {
      TXT.draw(c, x0 + i * 30, 11, lab, "6", { font: "hud", align: "center" })
      c.stamp(`k2fb_mann_${way}_${n}`, x0 + i * 30, FY, { flip: flip ? "x" : undefined })
    })
  }
  TXT.draw(c, 236, 3, "BAO", "7", { font: "hud", align: "center" })
  c.stamp("_k2fb_bao_b", 226, FY); c.stamp("k2fb_bao_bandage", 252, FY)
  // from above, on the market's brown
  c.rect(0, 112, SW, 38, "O")
  TXT.draw(c, 30, 116, "KESSLER VON OBEN", "7", { font: "hud", align: "left" })
  c.stamp("_k2fb_juno_top", 110, 120); c.stamp("k2fb_kessler_top", 140, 118)
})
