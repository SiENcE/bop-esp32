// Chapter 2, the Quiet comes closer (kapitel2-design §4, §3.5 "Der Schatten", §10): a man of the Quiet at street size, as blocks for the
// user's choice before anything is painted. One figure for both places he stands in street mode:
//   the shadow on Kowalski Street, 19:00 to 23:00, across from Juno's house door, once the Quiet knows who she is (§3.5);
//   the man in white at dryer 6 in the laundromat itself (quiet_dryer, §3.6), today only told of there and in CAM 23 Ashe's feed figure.
// Story §3 (Ashe) and kapitel2-design §10: white raincoats like Ashe's, in street mode a smooth white mask. "Weiß hält hier unten keinen
// Tag": the white is spotless, the only clean thing in the Ninth, and it glows against the wet dark. He stands still; he never walks in
// front of Juno, so he gets SE and NE standing (NW = NE mirrored; a one-sided thing on him shows only from the front, so SW would need
// its own view, and he never faces SW). Tall: 1.83 m at 30 px a metre, 55 px with the outline (Juno 50 with hers).
//   A  Ashe's coat (his portrait, docs/portraits/ashe_x4.png): a long belted raincoat to the calves, the big collar turned up to the
//      ears in two points, the mask an oval with two dark eye slits (his look into the camera in cam31), short dark hair behind it;
//      his tech: the red light on the left lapel, as in the portrait (the system's eye: red)
//   B  the hood: a white raincoat to the knees with a close hood up, the mask filling its opening, smooth, featureless but for one thin
//      red line across the eyes (a sensor, the only colour on him); white gloves; the coat's hem split at the back
//   quiet_blocks                      the sheet: Juno (her real street sprites), A and B (SE, NE, NW = NE mirrored); silhouettes
//   quiet_blocks_<a|b>_<se|ne>        each alone, pivot bottom-centre (for the shots in the game)
"use strict"
const PAL = {
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // the white (the carriers' clinic white): lit, light, shade, the side away from the light, the deep fold
  L: "#eef3f8", X: "#d3dce8", H: "#b9c6d8", h: "#7d8ca4", d: "#56627a",
  // the mask: brighter than the coat, a cold white, its rim; the eye slits
  M: "#ffffff", m: "#dfe8f2", e: "#1a1e2a",
  // hair, trousers and boots; threat red (the light and its glow)
  a: "#1e1a22", t: "#1c2232", T: "#2a3246", b: "#101420", r: "#7e1420", q: "#ff3a3a",
}
pal(PAL)
include("../lib/text.js")

const IW = 23, IH = 53, X0 = 11           // inside the outline: 25x55 with it, the middle column 11 (12 with the outline)
const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

/** the legs and boots: A dark trousers from under the long coat (row 45), B from the knee (row 40) */
function legs(c, way) {
  const x = X0, top = way === "A" ? 44 : 39
  c.rect(x - 4, top, 3, 49 - top, "t"); c.rect(x + 1, top, 3, 49 - top, "T")
  c.vline(x - 4, top, 49 - top, "b")
  // the boots: heavy, polished; the near one a step forward of the far
  c.rect(x - 5, 49, 5, 3, "b"); c.rect(x + 1, 49, 5, 3, "b"); c.hline(x + 2, 49, 3, "3"); c.hline(x - 4, 49, 2, "2")
  c.hline(x - 5, 52, 5, "b"); c.hline(x + 1, 52, 6, "b")
}

/** the coat: A long to the calves (hem 44), belted at 24; B to the knees (hem 39), no belt; the side away from the light in shade */
function coat(c, view, way) {
  const x = X0, A = way === "A", se = view === "se", hem = A ? 44 : 39
  for (let r = 11; r <= hem; r++) {
    // square shoulders, then the coat falling straight and widening a little to the hem
    const half = r === 11 ? 5 : r <= 13 ? 6 : 6 + Math.round((r - 14) * (A ? 2 : 1) / (hem - 14))
    c.rect(x - half, r, half * 2 + 1, 1, "X")
    c.rect(x - half, r, 2, 1, "h")                                        // the far side (left) away from the light
    c.px(x + half, r, "H")
    if (r === hem) c.rect(x - half, r, half * 2 + 1, 1, "h")
  }
  if (se) {
    // the front: the overlap down the right of the middle (he turns to the lower right), its edge lit; A's belt and buckle
    c.vline(x + 2, 14, hem - 14, "H"); c.vline(x + 3, 14, hem - 14, "L")
    for (const r of A ? [17, 21, 29, 33] : [17, 21, 25, 29]) c.px(x + 1, r, "h")      // the buttons under the flap
    if (A) { c.hline(x - 6, 24, 13, "H"); c.hline(x - 6, 25, 13, "h"); c.rect(x + 1, 24, 2, 2, "7") }
    // the pockets' flaps
    c.hline(x - 5, A ? 28 : 27, 3, "H"); c.hline(x + 4, A ? 28 : 27, 3, "H")
  } else {
    // the back: a seam down the middle; A the belt, the vent at the back from the belt down; B the split hem
    c.vline(x, 14, hem - 14, "H")
    if (A) { c.hline(x - 6, 24, 13, "H"); c.hline(x - 6, 25, 13, "h"); c.vline(x, 34, hem - 34, "h") }
    else { c.vline(x, 33, hem - 33, "d"); c.px(x - 1, hem, "d"); c.px(x + 1, hem, "d") }
  }
}

/** the arms hanging still at his sides; A bare hands in the cold light, B white gloves */
function arms(c, way) {
  const x = X0, A = way === "A"
  // the sleeves, a seam of shade between them and the coat so they read apart from it; the far one in shade, the near one lit
  c.rect(x - 8, 13, 2, 17, "H"); c.vline(x - 8, 13, 17, "h"); c.vline(x - 6, 14, 16, "d")
  c.rect(x + 7, 13, 2, 17, "X"); c.vline(x + 8, 13, 17, "H"); c.vline(x + 6, 14, 16, "h")
  c.hline(x - 8, 29, 2, "d"); c.hline(x + 7, 29, 2, "H")                  // the cuffs
  if (A) { c.rect(x - 8, 30, 2, 3, "6"); c.rect(x + 7, 30, 2, 3, "7") }     // the hands: pale, bloodless in the light
  else { c.rect(x - 8, 30, 2, 3, "H"); c.rect(x + 7, 30, 2, 3, "L") }       // the gloves
}

/** A's collar: turned up to the ears, two points standing out past the shoulders (the portrait's), the dark inside of it at the throat */
function collarA(c, view) {
  const x = X0, se = view === "se"
  if (se) {
    g(c, x - 8, 6, [
      "LL.............LL",
      "XLL...........LLX",
      "XXLL.........LLXX",
      "hXXL.........LXXH",
      "hhXXL.......LXXH.",
      ".hXXXL.....LXXXH.",
      "..hXXXaaaaaXXXH..",
      "...hXXXaaaXXXH...",
    ])
    c.px(x - 4, 12, "q"); c.px(x - 5, 12, "r")                             // the red light on his left lapel, as in the portrait
  } else {
    g(c, x - 8, 6, [
      "HL.............LH",
      "HXL...........LXH",
      "hXXL.........LXXH",
      "hXXXLLLLLLLLLXXXH",
      ".hXXXXXXXXXXXXXH.",
      "..hXXXXXXXXXXXH..",
    ])
  }
}

/** the head: A short dark hair, the oval mask with two eye slits; B the hood up, the mask in its opening, a red line across the eyes */
function head(c, view, way) {
  const x = X0, se = view === "se", A = way === "A", hx = x + (se ? 1 : 0), hy = 5
  if (A) {
    if (se) {
      // dark hair over the crown and the back of the head; the mask turned to the lower right, smooth to the chin, its far rim in
      // shade; the two slits level, nothing in them
      g(c, hx - 5, hy - 5, [
        "...aaaa...",
        ".aaaaaaMM.",
        "aaaaamMMMM",
        "aaaamMMMMM",
        "aaaamMMMMM",
        "aaaameeMee",
        ".aaamMMMMM",
        ".aaamMMMMm",
        "..aamMMMMm",
        "...amMMMm.",
        "....mMMm..",
      ])
    } else {
      c.ellipse(hx, hy, 4, 5, "a")                                         // from behind only hair, the mask's rim at his right
      c.vline(hx + 4, hy - 1, 4, "m"); c.px(hx + 3, hy + 4, "m")
      c.hline(hx - 3, hy + 1, 7, "2")                                      // its strap
    }
  } else {
    // the hood: close round the head, a pixel wider, falling on to the shoulders
    c.ellipse(hx, hy, 5, 6, "X"); c.ellipse(hx - 1, hy, 4, 6, "X"); c.vline(hx - 5, hy - 2, 7, "h"); c.vline(hx - 4, hy + 4, 4, "h")
    c.rect(hx - 5, hy + 4, 10, 4, "X"); c.vline(hx - 5, hy + 4, 4, "h")
    if (se) {
      c.ellipse(hx + 2, hy + 1, 2, 4, "M"); c.vline(hx + 4, hy - 1, 4, "L"); c.vline(hx - 1, hy - 1, 5, "H")   // the mask in the opening, its rim
      c.hline(hx, hy, 4, "q")                                              // the red line across the eyes
      c.px(hx + 2, hy - 4, "L"); c.px(hx + 3, hy - 3, "L"); c.px(hx + 4, hy - 2, "L")                       // the hood's lit rim
    } else {
      c.vline(hx, hy - 4, 11, "H")                                         // the hood's seam down the back
      c.px(hx + 5, hy, "M"); c.px(hx + 5, hy + 1, "M")                     // the mask's edge past the hood at his right
    }
  }
}

/** a man of the Quiet in one view ("se" | "ne"), way "A" | "B" */
function quiet(c, view, way) {
  legs(c, way)
  coat(c, view, way)
  arms(c, way)
  if (way === "A") collarA(c, view)
  head(c, view, way)
}

const POSES = [["se", "se"], ["ne", "ne"]]
for (const way of ["a", "b"]) for (const [name, view] of POSES)
  sprite(`quiet_blocks_${way}_${name}`, { w: IW, h: IH, outline: "k", pivot: "bottom" }, (c) => quiet(c, view, way.toUpperCase()))

// ---- the sheet
sprite("_qb_juno_se", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50], pivot: "bottom" })
sprite("_qb_juno_ne", { png: "../../build/art/characters/anims/juno_idle_ne.png", area: [0, 0, 27, 50], pivot: "bottom" })
const SIL = Object.fromEntries(Object.keys(PAL).map((k) => [k, "k"]))
for (const way of ["a", "b"]) for (const [name] of POSES) sprite(`_qb_sil_${way}_${name}`, { base: `quiet_blocks_${way}_${name}`, swap: SIL })

const SW = 232, SH = 156, FY = 76, SY = 150
scene("quiet_blocks", { w: SW, h: SH, bg: "3" }, (c) => {
  c.rect(0, FY, SW, 6, "2"); c.rect(0, 82, SW, 74, "5"); c.rect(0, SY, SW, 6, "4")
  c.stamp("_qb_juno_se", 16, FY); c.stamp("_qb_juno_ne", 42, FY)
  TXT.draw(c, 29, 3, "JUNO", "7", { font: "hud", align: "center" })
  c.vline(57, FY - 50, 50, "q"); c.vline(59, FY - 55, 55, "L")                       // 50 and 55 px
  const col = (way, i) => (way === "a" ? 78 : 160) + i * 24
  const shots = [["se", false, "SE"], ["ne", false, "NE"], ["ne", true, "NW"]]
  for (const way of ["a", "b"]) {
    TXT.draw(c, col(way, 1), 3, way.toUpperCase(), "7", { font: "hud", align: "center" })
    shots.forEach(([n, flip, lab], i) => {
      TXT.draw(c, col(way, i), 11, lab, "6", { font: "hud", align: "center" })
      c.stamp(`quiet_blocks_${way}_${n}`, col(way, i), FY, { flip: flip ? "x" : undefined })
      c.stamp(`_qb_sil_${way}_${n}`, col(way, i), SY, { flip: flip ? "x" : undefined })
    })
  }
})
