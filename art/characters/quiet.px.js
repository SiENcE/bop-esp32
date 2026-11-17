// The Quiet at street size (kapitel2-design §4, §3.5 "Der Schatten", §10), painted on the lines of the blocks the user chose
// (2026-11-17, art/test/quiet_blocks.px.js, docs/characters/quiet_blocks_x4.png): two ranks.
//   A  the leader, nameless (not Ashe): a long belted raincoat to the calves, the collar turned up to the ears in two points as
//      Ashe's, the oval mask with two dark eye slits, short dark hair; the red light on his left lapel (the system's eye)
//   B  the men under him: a coat to the knee with a close white hood and white gloves, the smooth mask with a thin red line across
//      the eyes
// "Weiß hält hier unten keinen Tag": the white is spotless and glows against the wet dark; the game draws them taking little of
// the room's light (the actors' `lit`), so the white stays white. The coat is wet only where the rain runs off it: a drop gathers
// at the hem and falls (their idle, with the red light: A's blinks slowly, B's line breathes). They stand; they never walk in front
// of Juno. Drawn as the street's figures: front three-quarter (SE) and back three-quarter (NE), lit from straight above, since the
// game flips NE for NW; the lapel's light shows only from the front, and they never face SW.
//   quiet_a_idle_se, quiet_a_idle_ne   the leader
//   quiet_b_idle_se, quiet_b_idle_ne   one of his men (the shadow on Kowalski Street, the man at dryer 6, the two at 4B)
// Every frame is 23x53 inside the outline (25x55 with it: 1.83 m), pivot bottom-centre (column 12 with the outline, between the boots).
;(() => {

pal({
  k: "#0c0e1a",                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",   // night steel: buckle, boots' shine
  // the white (the carriers' clinic white): its sheen where the rain lies, lit, light, shade, the side away from the light, the deep fold
  W: "#fbfdff", L: "#eef3f8", X: "#d3dce8", H: "#b9c6d8", h: "#7d8ca4", d: "#56627a",
  // the mask: a cold white brighter than the coat, its rim; the eye slits
  M: "#ffffff", m: "#dfe8f2", e: "#141824",
  // hair; the collar's dark lining; trousers (far, near, crease); boots; bare hands, bloodless
  a: "#1e1a22", A: "#2a2430", t: "#1c2232", T: "#2a3246", u: "#36405a", b: "#101420", o: "#d8ccc8", O: "#a69894",
  // threat red: dark, bright, its hot core; the drop of rain
  r: "#7e1420", q: "#ff3a3a", Q: "#ffb0a8", w: "#9fb8d8",
})

const IW = 23, IH = 53, X0 = 11           // inside the outline; the middle column 11 (12 with the outline)
const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

/** the legs and boots: A dark trousers from under the long coat, B from the knee; the near leg lighter so both read on a dark floor */
function legs(c, way) {
  const x = X0, top = way === "A" ? 44 : 39
  c.rect(x - 4, top, 3, 49 - top, "t"); c.vline(x - 4, top, 49 - top, "b")
  c.rect(x + 1, top, 3, 49 - top, "T"); c.vline(x + 2, top + 1, 48 - top, "u")          // the near leg's crease
  // the boots: heavy, polished, the toes catching the light from above
  c.rect(x - 5, 49, 5, 3, "b"); c.rect(x + 1, 49, 5, 3, "b")
  c.hline(x - 4, 49, 2, "2"); c.hline(x + 2, 49, 3, "3"); c.px(x + 4, 50, "4"); c.px(x - 2, 50, "2")
  c.hline(x - 5, 52, 5, "b"); c.hline(x + 1, 52, 6, "b")
}

/** the coat: A long to the calves (hem 44), belted; B to the knees (hem 39); lit from above, the sides in shade, rain on the shoulders */
function coat(c, view, way) {
  const x = X0, A = way === "A", se = view === "se", hem = A ? 44 : 39
  for (let r = 11; r <= hem; r++) {
    const half = r === 11 ? 5 : r <= 13 ? 6 : 6 + Math.round((r - 14) * (A ? 2 : 1) / (hem - 14))
    c.rect(x - half, r, half * 2 + 1, 1, r <= 12 ? "L" : "X")
    // the sides away from the light: SE the far side (left) deeper; from behind both alike (the game flips it)
    c.rect(x - half, r, 2, 1, se ? "h" : "H"); c.px(x - half, r, "h")
    c.px(x + half, r, se ? "H" : "h"); if (!se) c.px(x + half - 1, r, "H")
    if (r === hem) { c.rect(x - half, r, half * 2 + 1, 1, "H"); c.rect(x - half, r, 2, 1, "h") }
  }
  // the shoulders' tops catch the light, where the rain lies on them
  c.hline(x - 4, 11, 9, "W"); c.hline(x - 5, 12, 2, "L"); c.hline(x + 4, 12, 2, "W")
  // the folds the coat falls in below the waist: shade in the hollow, light on the ridge
  const fold = A ? 26 : 27
  for (const [fx, len] of A ? [[-3, 18], [4, 17]] : [[-3, 11], [4, 10]]) {
    c.vline(x + fx, fold + 2, len - 2, "H"); c.vline(x + fx + 1, fold + 4, len - 5, "L")
  }
  if (se) {
    // the front: the overlap down the right of the middle, its edge lit; the buttons under the flap
    c.vline(x + 2, 13, hem - 13, "H"); c.vline(x + 3, 13, hem - 13, "L"); c.px(x + 3, hem, "X")
    for (const r of A ? [16, 20, 30, 34] : [16, 20, 24, 28, 32]) { c.px(x + 1, r, "h"); c.px(x + 1, r + 1, "H") }
    if (A) {
      // the belt drawn tight, its buckle steel, the coat gathering above and below it
      c.hline(x - 6, 24, 13, "H"); c.hline(x - 6, 25, 13, "h"); c.px(x - 6, 24, "h"); c.px(x - 6, 25, "d")
      g(c, x + 1, 23, ["77", "67", "66"]); c.px(x + 3, 24, "6")
      c.px(x - 3, 23, "H"); c.px(x + 5, 23, "H"); c.px(x - 2, 26, "H"); c.px(x + 5, 26, "H")
    }
    // the pockets: a flap, its shadow under it
    for (const px of [x - 5, x + 4]) { c.hline(px, A ? 28 : 26, 3, "L"); c.hline(px, A ? 29 : 27, 3, "H") }
  } else {
    // the back: the seam down the middle; A the belt across, the vent below it; B the hem split at the back
    c.vline(x, 13, hem - 13, "H")
    if (A) {
      c.hline(x - 6, 24, 13, "H"); c.hline(x - 6, 25, 13, "h"); c.rect(x - 1, 24, 3, 2, "X"); c.hline(x - 1, 25, 3, "H")   // its tab
      c.vline(x, 34, hem - 34, "h"); c.vline(x + 1, 35, hem - 35, "L")
    } else { c.vline(x, 32, hem - 32, "d"); c.vline(x + 1, 33, hem - 33, "L"); c.px(x - 1, hem, "d"); c.px(x + 1, hem, "d") }
    // the shoulder blades under the cloth
    c.px(x - 3, 15, "H"); c.px(x + 3, 15, "H"); c.hline(x - 4, 16, 2, "H"); c.hline(x + 3, 16, 2, "H")
  }
}

/** the arms hanging still at his sides, a seam of shade between them and the coat; A bare hands, B white gloves */
function arms(c, view, way) {
  const x = X0, A = way === "A", se = view === "se"
  // the far sleeve (left) and the near one; from behind both alike
  c.rect(x - 8, 13, 2, 17, se ? "H" : "X"); c.vline(x - 8, 13, 17, "h"); c.vline(x - 6, 14, 16, se ? "d" : "h")
  c.rect(x + 7, 13, 2, 17, "X"); c.vline(x + 8, 13, 17, se ? "H" : "h"); c.vline(x + 6, 14, 16, "h")
  c.px(x - 8, 13, "L"); c.px(x + 7, 13, "W"); c.px(x + 8, 13, "L")                       // the shoulders' round
  c.px(x - 7, 21, "h"); c.px(x + 7, 21, "H"); c.px(x + 8, 22, "H")                       // the elbows' crease
  c.hline(x - 8, 29, 2, "d"); c.hline(x + 7, 29, 2, "H")                                 // the cuffs
  if (A) { g(c, x - 8, 30, ["OO", "OO", ".O"]); g(c, x + 7, 30, ["oo", "oO", "O."]) }   // the hands: pale, the fingers down
  else { g(c, x - 8, 30, ["hH", "HH", ".H"]); g(c, x + 7, 30, ["XL", "LX", "X."]) }      // the gloves
}

/** A's collar: turned up to the ears, two points standing out past the shoulders, the dark lining at the throat */
function collarA(c, view, f) {
  const x = X0
  if (view === "se") {
    g(c, x - 8, 6, [
      "LW.............WL",
      "XLW...........WLX",
      "HXLL.........LLXH",
      "hXXL.........LXXH",
      "hHXXL.......LXXH.",
      ".hHXXL.....LXXXH.",
      "..hHXXAaaaAXXXH..",
      "...hHXXAaAXXXH...",
    ])
    // the red light on his left lapel: it blinks slowly
    if (f.on) { c.px(x - 5, 12, "q"); c.px(x - 4, 12, "Q"); c.px(x - 4, 13, "r") } else { c.px(x - 5, 12, "r"); c.px(x - 4, 12, "r") }
  } else {
    g(c, x - 8, 6, [
      "LL.............LL",
      "XLW...........WLX",
      "hXXL.........LXXh",
      "hXXXLLWWWWWLLXXXh",
      ".hXXXXXXXXXXXXXh.",
      "..hHXXXXXXXXXXHh.",
    ])
  }
}

/** the head: A short dark hair and the oval mask; B the hood up, the mask in its opening, the red line across the eyes */
function head(c, view, way, f) {
  const x = X0, se = view === "se", hx = x + (se ? 1 : 0), hy = 5
  if (way === "A") {
    if (se) {
      // dark hair over the crown and the back of the head, a sheen of the light on it; the mask turned to the lower right, smooth to
      // the chin, its far rim in shade, the light on the brow and the cheek; the two slits level, nothing in them
      g(c, hx - 5, hy - 5, [
        "...aaaa...",
        ".aAAaaaMM.",
        "aAaaamMMWM",
        "aaaamMMWMM",
        "aaaamMMMMM",
        "aaaameeMee",
        ".aaamMMMMW",
        ".aaamMMMMm",
        "..aamMMMMm",
        "...amMMMm.",
        "....mmMm..",
      ])
    } else {
      // from behind: the back of his head, the hair cut short to the neck, the mask's rim at his right, its strap
      g(c, hx - 4, hy - 5, [
        "..aaaaa..",
        ".aAAAAaa.",
        "aaAAaaaaa",
        "aaaaaaaam",
        "aaaaaaaam",
        "a2222222m",
        "aaaaaaaam",
        "aaaaaaaa.",
        ".aaaaaaa.",
        "..aaaaa..",
      ])
    }
  } else {
    // the hood: close round the head and falling on to the shoulders, lit on its crown, a fold where it meets the shoulders
    c.ellipse(hx, hy, 5, 6, "X"); c.ellipse(hx - 1, hy, 4, 6, "X")
    c.rect(hx - 5, hy + 4, 10, 4, "X")
    c.vline(hx - 5, hy - 2, 7, "h"); c.vline(hx - 4, hy + 4, 4, "h"); c.vline(hx - 5, hy + 4, 4, "h")
    c.hline(hx - 2, hy - 6, 4, "W"); c.hline(hx - 3, hy - 5, 6, "L"); c.hline(hx - 4, hy - 4, 2, "L")
    if (se) {
      // the opening turned to the lower right, its rim lit, the mask filling it; the red line across the eyes breathes
      c.ellipse(hx + 2, hy + 1, 2, 4, "M"); c.vline(hx - 1, hy - 1, 5, "H"); c.vline(hx + 4, hy - 1, 4, "L")
      c.px(hx, hy - 3, "m"); c.px(hx + 1, hy - 3, "M"); c.px(hx, hy + 4, "m"); c.vline(hx, hy - 2, 6, "m")
      c.px(hx + 2, hy - 4, "W"); c.px(hx + 3, hy - 3, "W"); c.px(hx + 4, hy - 2, "L")
      c.hline(hx, hy, 4, f.on ? "q" : "r"); if (f.on) c.px(hx + 2, hy, "Q")
      c.hline(hx - 3, hy + 6, 4, "H"); c.px(hx + 4, hy + 5, "H")                           // the hood's fold at the throat
    } else {
      c.vline(hx, hy - 5, 12, "H"); c.vline(hx + 1, hy - 4, 10, "L")                        // the seam down the back, its ridge
      c.px(hx + 5, hy, "M"); c.px(hx + 5, hy + 1, "m")                                     // the mask's edge past the hood at his right
      c.hline(hx - 4, hy + 7, 9, "H")                                                      // where the hood lies on the shoulders
    }
  }
}

/** a drop of rain gathering at the coat's hem and falling past the far leg (frame i of 6): inside the figure, so the outline leaves it be */
function drip(c, way, i) {
  const x = X0, hem = way === "A" ? 44 : 39, dx = x - 3
  if (i === 0) c.px(dx, hem + 1, "w")
  else if (i === 1) { c.px(dx, hem + 1, "w"); c.px(dx, hem + 2, "w") }
  else if (i <= 3) c.px(dx, hem + 1 + i * 2, "w")
}

/** a man of the Quiet in one view ("se" | "ne"), way "A" | "B", in frame f */
function quiet(c, view, way, f) {
  legs(c, way)
  coat(c, view, way)
  arms(c, view, way)
  if (way === "A") collarA(c, view, f)
  head(c, view, way, f)
  drip(c, way, f.i)
}

// six frames: the drop gathers, falls, is gone; the red light on for most of them (A blinks off once, B's line dims once)
const ON = [true, true, true, true, false, true]
const MS = [500, 300, 100, 100, 600, 400]
for (const way of ["a", "b"]) for (const view of ["se", "ne"])
  anim(`quiet_${way}_idle_${view}`, { w: IW, h: IH, frames: 6, ms: MS, outline: "k", pivot: "bottom" },
    (c) => quiet(c, view, way.toUpperCase(), { i: c.frame, on: ON[c.frame] }))

})()
