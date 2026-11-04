// H3: Bao (story §4: over 70, runs the noodle cart outside LUCKY STATIC, lets Juno run a tab, knows everyone,
// talks about his husband Lou; kapitel0-design §8: umbrella, white apron, #e8c890) at the new scale (style
// guide §4, §6: 1.62 m and a little stooped, so 47 px), as blocks for approval before he is painted. Front
// three-quarter (SE, mirrored for SW: behind his cart he faces Juno across it) and back three-quarter (NE),
// beside a 50 px bar for Juno; two ways for his head.
//   bao_blocks         the sheet: Juno's height, A (SE, NE), B (SE, NE)
//   bao_blocks_A, bao_blocks_B   SE alone, pivot bottom (for the composite behind the cart)
// Both: a cream cardigan (his colour, #e8c890) with the sleeves pushed up, a white apron over it to the
// knees, its strings round his waist, dark trousers, worn shoes; a ladle in his right hand; his tech the
// hearing aid behind his ear with a small cyan light (style guide §8a: everyone carries one glowing thing).
//   A  short white hair round a bald crown, a white moustache, round glasses
//   B  a flat cap, the same moustache and glasses, a towel over his shoulder
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  s: "#93583f", S: "#c9906c", W: "#f0f0e0", w: "#b8b8a8", e: "#e8c890", E: "#b0905e", O: "#552b1c", P: "#8a5a34",
  v: "#62def0", y: "#eec414", G: "#8e96a8", g: "#565e70",
})
include("../lib/text.js")

/** Bao standing, his feet's centre at (fx, fy): view "se" or "ne", head "A" or "B" */
function baoStand(c, fx, fy, view = "se", head = "A") {
  const T = fy - 47, x = fx, se = view === "se", rect = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  // legs and shoes
  rect(x - 4, T + 36, 3, 9, "2"); rect(x + 1, T + 36, 3, 9, "3")
  rect(x - 5, T + 44, 4, 3, "1"); rect(x + 1, T + 44, 5, 3, "1")
  // the cardigan, a little stooped (the shoulders forward), wider at the hips
  for (let r = 11; r <= 34; r++) { const half = 6 + Math.round((r - 11) * 1.5 / 23); rect(x - half, T + r, half * 2 + 1, 1, "e"); c.px(x - half, T + r, "E"); c.px(x - half + 1, T + r, "E") }
  rect(x - 5, T + 10, 11, 1, "e")
  if (se) {
    // the apron: white from the chest to the knees, its strings round the waist, a pocket
    rect(x - 4, T + 15, 9, 23, "W"); rect(x - 4, T + 15, 1, 23, "w"); rect(x - 2, T + 13, 5, 2, "W")
    rect(x - 6, T + 22, 13, 1, "w"); rect(x - 2, T + 28, 5, 3, "w")
  } else {
    rect(x - 6, T + 22, 13, 1, "W"); rect(x - 1, T + 22, 2, 4, "W")                  // the bow behind
    rect(x - 5, T + 23, 1, 14, "W"); rect(x + 5, T + 23, 1, 14, "w")                 // the apron's edges
  }
  // the arms: sleeves pushed up, the forearms; the ladle in his right hand (screen right in SE)
  rect(x - 9, T + 13, 3, 9, "E"); rect(x - 9, T + 22, 3, 6, "S")
  rect(x + 7, T + 13, 3, 9, "e"); rect(x + 7, T + 22, 3, 6, "S")
  if (se) { c.line(x + 9, T + 27, x + 12, T + 14, "G"); rect(x + 11, T + 11, 4, 3, "g"); c.px(x + 12, T + 11, "G") }
  // the head, bent forward a little
  const hx = x + (se ? 1 : 0), hy = T + 5
  c.ellipse(hx, hy, 4, 5, se ? "S" : "s")
  if (se) {
    c.rect(hx - 1, hy - 1, 6, 1, "k"); c.px(hx, hy, "W"); c.px(hx + 3, hy, "W")    // the round glasses' rims, the lenses' glint
    rect(hx - 1, hy + 2, 6, 1, "W")                                                // the moustache
    c.px(hx - 4, hy, "S"); c.px(hx - 5, hy + 1, "v")                               // the ear, the hearing aid's light
  } else {
    c.px(hx - 4, hy, "S"); c.px(hx + 4, hy, "S"); c.px(hx + 5, hy + 1, "v")
  }
  if (head === "A") {
    // white hair round the sides and the back, the crown bald and catching the light
    rect(hx - 4, hy - 1, 2, 4, "W"); if (!se) { rect(hx - 4, hy + 1, 9, 4, "W"); rect(hx - 3, hy + 5, 7, 1, "W"); rect(hx - 2, hy - 4, 4, 2, "S") }
    else { rect(hx + 4, hy - 1, 1, 3, "W"); c.px(hx - 1, hy - 4, "W"); c.px(hx, hy - 4, "W") }
  } else {
    // a flat cap, its peak to the front; a towel over his left shoulder
    rect(hx - 5, hy - 5, 10, 3, "P"); rect(hx - 5, hy - 5, 10, 1, "O"); rect(hx - 4, hy - 6, 8, 1, "P")
    if (se) rect(hx + 1, hy - 2, 6, 1, "O"); else rect(hx - 6, hy - 2, 5, 1, "O")
    rect(x - 7, T + 10, 4, 9, "W"); rect(x - 7, T + 18, 4, 1, "w")
    if (!se) { rect(hx - 4, hy + 2, 9, 3, "W"); rect(hx - 3, hy + 5, 7, 1, "W") }
  }
}

sprite("bao_blocks", { w: 200, h: 80 }, (c) => {
  c.rect(0, 0, 200, 80, "3")
  c.rect(0, 64, 200, 16, "1")
  c.rect(10, 14, 3, 50, "y"); TXT.draw(c, 4, 4, "JUNO 50", "6", { font: "hud" })
  baoStand(c, 45, 64, "se", "A"); baoStand(c, 75, 64, "ne", "A")
  TXT.draw(c, 40, 4, "A: SE NE", "6", { font: "hud" })
  baoStand(c, 125, 64, "se", "B"); baoStand(c, 155, 64, "ne", "B")
  TXT.draw(c, 120, 4, "B: SE NE", "6", { font: "hud" })
})

for (const head of ["A", "B"]) sprite(`bao_blocks_${head}`, { w: 31, h: 50, pivot: "bottom" }, (c) => baoStand(c, 15, 49, "se", head))
