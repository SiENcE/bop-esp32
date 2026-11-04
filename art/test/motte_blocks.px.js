// H3: Motte (story §5: 12, a courier kid in the Kessel Block who worships Juno and wants to learn to
// glass; his accent the oversized white cap) at the new scale (style guide §6: children 30-40 px; at 1.45 m
// he stands 43 px), as blocks for approval before he is painted. Standing front three-quarter (SE) and back
// three-quarter (NE), sitting on a step (the way he waits on the stairs in kessel_14: his back to the wall,
// knees up, an old handheld in his hands lighting his face), beside a 50 px bar for Juno.
//   motte_blocks       the sheet: Juno's height, Motte SE, NE, sitting
//   motte_blocks_sit   the sitting pose alone, its seat at the bottom centre (for the composite in the room)
// Proportions: head 1/5.5 of his height (a child's head is bigger), the cap a third wider than the head and
// down over his ears; a hand-me-down jacket too big for him, the sleeves over his hands, a reflective
// courier band across it; his courier bag on a strap, big for him; trainers.
pal({
  k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  s: "#93583f", S: "#d79676", W: "#f0f0e0", w: "#b8b8a8", x: "#6c809a", X: "#b9c6d8", O: "#552b1c", P: "#b0602a",
  v: "#62def0", Y: "#fff070", y: "#eec414",
})
include("../lib/text.js")

/** Motte standing, feet's centre at (fx, fy): view "se" or "ne" */
function motteStand(c, fx, fy, view = "se") {
  const T = fy - 43, x = fx, se = view === "se", rect = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  // legs (thin, a child's), trainers with white soles
  rect(x - 4, T + 30, 3, 10, "2"); rect(x + 1, T + 30, 3, 10, "3")
  rect(x - 5, T + 40, 4, 3, "1"); rect(x + 1, T + 40, 4, 3, "1"); rect(x - 5, T + 42, 4, 1, "W"); rect(x + 1, T + 42, 4, 1, "W")
  // the jacket: too big, to his thighs; the reflective band across it; the sleeves over his hands
  for (let r = 10; r <= 31; r++) { const half = 6 + Math.round((r - 10) * 2 / 21); rect(x - half, T + r, half * 2 + 1, 1, "4"); c.px(x - half, T + r, "3") }
  rect(x - 7, T + 20, 15, 2, "x"); rect(x - 7, T + 20, 15, 1, "X")
  rect(x - 9, T + 12, 3, 17, "4"); rect(x + 7, T + 12, 3, 17, "5")
  // the courier bag on his hip (big for him), its strap over the other shoulder
  rect(x - 12, T + 22, 8, 8, "P"); rect(x - 12, T + 22, 8, 2, "O"); rect(x - 12, T + 27, 8, 1, "X")
  c.line(x + 5, T + 10, x - 7, T + 22, "O")
  // the head and the cap: a white beanie a third wider than the head, slouching back, over his ears
  c.ellipse(x, T + 6, 4, 4, "S")
  if (se) { c.px(x + 1, T + 6, "k"); c.px(x + 3, T + 6, "k"); rect(x + 1, T + 8, 2, 1, "s") }
  c.ellipse(se ? x - 1 : x + 1, T + 2, 6, 4, "W"); rect(x - 6, T + 3, 12, 2, "W"); rect(x - 6, T + 4, 12, 1, "w")
  c.ellipse(se ? x - 5 : x + 5, T - 1, 3, 2, "W")                            // the slouch at the back
}

/** Motte sitting on a step, facing SE (mirror it for SW): the seat's centre at (sx, sy), his feet a step
 * lower (11 px down, 9 px toward the viewer's right along the flight) */
function motteSit(c, sx, sy) {
  const rect = (a, b, w, h, k) => c.rect(a, b, w, h, k), x = sx, T = sy - 28
  // the lower leg down to the next step, the trainers
  rect(x + 4, sy - 9, 3, 14, "3"); rect(x + 7, sy - 9, 3, 14, "2")
  rect(x + 4, sy + 5, 7, 3, "1"); rect(x + 4, sy + 7, 7, 1, "W")
  // the thighs up to the knees, the jacket bunched in his lap
  rect(x - 3, sy - 11, 10, 4, "3"); rect(x + 4, sy - 13, 6, 4, "2")
  // the body leaning forward over the knees, the band, the sleeves round the handheld
  for (let r = 0; r <= 15; r++) { const half = 5 + Math.round(r * 1 / 15); rect(x - half - 1 + Math.round(r / 5), T + 10 + r, half * 2 + 1, 1, "4") }
  rect(x - 5, T + 17, 12, 2, "x"); rect(x - 5, T + 17, 12, 1, "X")
  rect(x + 3, T + 15, 6, 3, "5"); rect(x + 7, T + 14, 4, 3, "1"); rect(x + 8, T + 14, 2, 2, "v")   // the handheld, its screen
  // the bag beside him on the step
  rect(x - 13, sy - 6, 8, 6, "P"); rect(x - 13, sy - 6, 8, 2, "O"); rect(x - 13, sy - 2, 8, 1, "X")
  // the head bent to the screen, its light on his face; the cap
  c.ellipse(x + 2, T + 6, 4, 4, "S"); c.px(x + 4, T + 7, "v"); c.px(x + 5, T + 7, "k"); rect(x + 3, T + 9, 2, 1, "s")
  c.ellipse(x + 1, T + 2, 6, 4, "W"); rect(x - 5, T + 3, 12, 2, "W"); rect(x - 5, T + 4, 12, 1, "w")
  c.ellipse(x - 4, T - 1, 3, 2, "W")
}

sprite("motte_blocks", { w: 160, h: 72 }, (c) => {
  c.rect(0, 0, 160, 72, "n")
  c.rect(0, 64, 160, 8, "1")
  // Juno's height
  c.rect(10, 14, 3, 50, "y"); TXT.draw(c, 4, 4, "JUNO 50", "6", { font: "hud" })
  motteStand(c, 36, 64, "se"); motteStand(c, 70, 64, "ne")
  TXT.draw(c, 30, 4, "SE", "6", { font: "hud" }); TXT.draw(c, 64, 4, "NE", "6", { font: "hud" })
  // a step: the seat 11 px over the floor's line, the next step down under his feet
  c.rect(102, 53, 30, 11, "3"); c.rect(102, 53, 30, 1, "5"); c.rect(111, 64, 30, 0, "2")
  motteSit(c, 112, 53)
  TXT.draw(c, 104, 4, "SITZEND", "6", { font: "hud" })
})

sprite("motte_blocks_sit", { w: 30, h: 40, pivot: "bottom" }, (c) => motteSit(c, 15, 30))
