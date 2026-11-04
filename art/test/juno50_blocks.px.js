// H1c: Juno at the new scale (style guide §4: 30 px per meter of height, so 1.68 m is ~50 px), as blocks
// for approval before she is painted. Front three-quarter (SE) and back three-quarter (NE), hood up
// (outside) and down (indoors, style guide §6), a walk contact; beside her the old 32 px Juno and a door
// (2.0 m = 60 px) for scale. Proportions: head 1/6.5 of her height, the slicker to mid-thigh, the satchel
// on her right hip on a strap over her left shoulder, the implant line on her left cheekbone.
pal({
  k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  j: "#9a7406", y: "#eec414", Y: "#fff070", s: "#93583f", S: "#d79676", g: "#565e70", G: "#8e96a8", v: "#62def0", h: "#0f1118",
})
include("../old/juno_h1.px.js")
include("../lib/text.js")

/** Juno as blocks, her feet's centre at (fx, fy): view "se" or "ne", hood up or down, standing or a walk contact */
function junoBlocks(c, fx, fy, { view = "se", hood = true, walk = false } = {}) {
  const T = fy - 50, x = fx, se = view === "se"
  const px = (a, b, k) => c.px(a, b, k), rect = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  // the legs and boots (rows 32-49), apart in the walk
  const legs = walk ? [[x - 8, x - 4], [x + 3, x + 7]] : [[x - 5, x - 1], [x + 1, x + 5]]
  legs.forEach(([a, b], i) => { rect(a, T + 32, b - a + 1, 14, i === 0 ? "2" : "3"); rect(a - (i === 0 ? 1 : 0), T + 45, b - a + 2, 5, "1"); rect(a - (i === 0 ? 1 : 0), T + 49, b - a + 2, 1, "k") })
  // the slicker: shoulders to the hem, wider at the hem; the shade on the side away from the light
  for (let r = 11; r <= 32; r++) {
    const half = 6 + Math.round((r - 11) * 3 / 21), a = x - half, b = x + half
    rect(a, T + r, b - a + 1, 1, "Y"); rect(a, T + r, 3, 1, "y"); px(a, T + r, "j"); px(b, T + r, "j")
  }
  rect(x - 9, T + 32, 19, 1, "j")                                         // the hem
  // the arms down the sides, the hands
  rect(se ? x - 9 : x - 8, T + 14, 3, 15, "y"); rect(se ? x + 7 : x + 6, T + 14, 3, 15, "Y")
  rect(se ? x - 9 : x - 8, T + 29, 3, 3, "s"); rect(se ? x + 7 : x + 6, T + 29, 3, 3, "S")
  // the satchel on her right hip (the viewer's left in SE, her right shows on the left in NE too), its strap
  const bx = x - 11
  rect(bx, T + 24, 7, 8, "G"); rect(bx, T + 24, 7, 1, "g"); rect(bx, T + 31, 7, 1, "g")
  c.line(x + 4, T + 11, x - 6, T + 24, "g")
  // the head
  if (hood) {
    c.ellipse(x, T + 6, 6, 6, "Y"); rect(x - 6, T + 6, 2, 5, "y"); rect(x - 6, T + 10, 13, 2, "Y")
    if (se) { c.ellipse(x + 2, T + 7, 3, 4, "S"); rect(x - 1, T + 4, 7, 1, "y"); px(x + 1, T + 6, "k"); px(x + 4, T + 6, "k"); rect(x + 4, T + 8, 2, 1, "v") }
    else { c.line(x - 1, T + 1, x - 2, T + 10, "j") }                    // the back seam
  } else {
    rect(x - 6, T + 9, 13, 4, "y"); rect(x - 6, T + 9, 13, 1, "j")        // the hood down round her shoulders
    c.ellipse(x, T + 5, 5, 5, "h")                                        // short black hair
    if (se) { c.ellipse(x + 2, T + 6, 3, 4, "S"); rect(x - 1, T + 2, 6, 2, "h"); px(x + 1, T + 6, "k"); px(x + 4, T + 6, "k"); rect(x + 4, T + 8, 2, 1, "v"); rect(x, T + 10, 3, 1, "s") }
    else { rect(x - 4, T + 9, 7, 1, "s") }                                // the nape
  }
}

sprite("juno50_blocks", { w: 320, h: 180 }, (c) => {
  c.rect(0, 0, 320, 180, "n")
  // a floor line and a door for scale (2.0 m = 60 px)
  c.rect(0, 150, 320, 30, "1"); c.rect(0, 150, 320, 1, "4")
  c.rect(8, 90, 28, 60, "2"); c.rect(8, 90, 28, 1, "5"); c.rect(8, 90, 1, 60, "5"); c.rect(30, 120, 2, 3, "6")
  TXT.draw(c, 22, 82, "TÜR 2,0 M", "6", { font: "hud", align: "center" })
  const at = [[66, "se", true, false, "SE, KAPUZE"], [111, "se", false, false, "SE, OHNE"], [156, "ne", true, false, "NE, KAPUZE"], [201, "ne", false, false, "NE, OHNE"], [246, "se", true, true, "SE, SCHRITT"]]
  for (const [x, view, hood, walk, label] of at) { junoBlocks(c, x, 150, { view, hood, walk }); TXT.draw(c, x, 158, label, "6", { font: "hud", align: "center" }) }
  TXT.draw(c, 294, 158, "JETZT 32 PX", "6", { font: "hud", align: "center" })
  TXT.draw(c, 4, 4, "JUNO BEI 30 PX/M: 1,68 M = 50 PX (BLÖCKE ZUR FREIGABE)", "v", { font: "hud" })
}, stamp("juno_idle_se", 284, 150, {}), stamp("juno_idle_ne", 304, 150, {}))
