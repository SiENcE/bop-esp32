// H3: the intro "Die letzte Schicht" (kapitel0-design §5) as a storyboard in blocks, for approval before it is
// painted: six shots at 320x180, each a sketch of what the camera sees, and Juno three years ago from the side
// (the first side view, style guide §4: the scale of the street, 30 px per meter of height).
//   intro_blocks_1 .. intro_blocks_6   the shots (1 the hall, 2 Juno at her desk, 3 the announcement, 4 the
//                                      screens going out and her face in the dark one, 5 the Transitachse, 6 today)
//   intro_blocks_juno                  Juno in 2088 from the side: Halcyon grey, the badge on its lanyard, the box
//   intro_blocks                       all of them on one sheet, numbered
// The words on the screen are the game's (German, through i18n); painted text only the city's (English).
pal({
  k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  0: "#030a0a", 7: "#12332d", 8: "#266252", 9: "#55a585", P: "#8acfae", Q: "#d4f7e2",       // the phosphor screens
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",                                     // Halcyon's cyan
  y: "#eec414", Y: "#fff070", j: "#9a7406",                                                   // Juno's yellow
  g: "#565e70", G: "#8e96a8", h: "#7d8ca4", H: "#b9c6d8",                                     // Halcyon grey, the uniform
  s: "#93583f", S: "#d79676", u: "#1b1f2e", O: "#552b1c", R: "#ffd58a", q: "#ff3a3a",
  m: "#ff4fd3", M: "#a8238a", N: "#ffc0f2", w: "#3a4c64",
})
include("../lib/text.js")

const W = 320, H = 180
const label = (c, n, s) => { c.rect(0, 0, W, 9, "n"); TXT.draw(c, 3, 2, `${n}  ${s}`, "6", { font: "hud" }) }
// an iso box (2:1), its top lit, its two faces
const P = (cx, cy, u, v, h) => [cx + 2 * (u - v), cy + (u + v) - h]
function isoBox(c, cx, cy, u0, v0, du, dv, dh, top, fu, fv) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    for (const [lvl, k] of [[dh, top]]) {
      const a = (x - cx) / 2, b = y - cy + lvl, u = (a + b) / 2, v = (b - a) / 2
      if (u >= u0 && u < u0 + du && v >= v0 && v < v0 + dv) { c.px(x, y, k); }
    }
  }
  // the faces: +v (lower left) and +u (lower right)
  for (let e = 0; e < dh; e++) {
    for (let t = 0; t < du; t++) { const [x, y] = P(cx, cy, u0 + t, v0 + dv, e); c.px(x, y, fv); c.px(x + 1, y, fv) }
    for (let t = 0; t < dv; t++) { const [x, y] = P(cx, cy, u0 + du, v0 + t, e); c.px(x, y, fu); c.px(x - 1, y, fu) }
  }
}
// a person at a desk from behind (iso, small), a cable from the desk up into the neck
function deskPerson(c, x, y, lit) {
  c.rect(x - 3, y - 13, 7, 9, "g"); c.ellipse(x, y - 16, 2, 3, "u"); c.line(x + 6, y - 2, x + 2, y - 15, "1")
  if (lit) c.px(x + 2, y - 15, "9")
}

// ---------------------------------------------------------------- 1 the hall
// out: how far the screens have gone out, back to front (0 none; 1 the walls; 2.. the walls and that many rows of desks)
function hall(c, out = 0) {
  c.rect(0, 0, W, H, "1")
  // the back walls: phosphor screens floor to ceiling, rows of them
  const CX = 160, CY = 40
  for (let y = 0; y < CY + 60; y++) for (let x = 0; x < W; x++) {
    const back = y < CY + Math.abs(x - CX) / 2 - 2 && y > 6
    if (!back) continue
    const cellx = Math.floor(x / 10), celly = Math.floor((y - Math.abs(x - CX) / 2) / 8)
    const gap = x % 10 === 0 || (y - Math.floor(Math.abs(x - CX) / 2)) % 8 === 0
    const row = Math.abs(cellx - 16)
    c.px(x, y, gap || out >= 1 ? "0" : (cellx + celly) % 5 === 0 ? "P" : (cellx * 3 + celly) % 4 === 0 ? "9" : "8")
  }
  // the floor and the rows of desks, each with a watcher; from the back to the front
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (y >= CY + Math.abs(x - CX) / 2 - 2 && !c.key(x, y)) c.px(x, y, "2")
  for (let r = 0; r < 5; r++) for (let i = 0; i < 6; i++) {
    const u = 14 + r * 14, v = 6 + i * 13
    const [x, y] = P(CX, CY + 40, u, v, 0)
    if (y > H + 10) continue
    isoBox(c, CX, CY + 40, u, v, 8, 4, 6, "4", "3", "2")
    const dark = out >= 2 + r
    c.rect(x - 4, y - 18, 9, 6, dark ? "0" : "8"); c.rect(x - 3, y - 17, 7, 4, dark ? "0" : "9")   // the desk's own screen
    deskPerson(c, x + 2, y + 2, !dark)
  }
}
sprite("intro_blocks_1", { w: W, h: H }, (c) => {
  hall(c)
  c.rect(0, H - 12, W, 12, "n"); TXT.draw(c, 6, H - 9, "2088-04-30  05:45", "9", { font: "hud" })
  label(c, 1, "DIE BEOBACHTUNGSHALLE, HALCYON TOWER. BRUMMEN, TIPPEN")
})

// ---------------------------------------------------------------- 2 Juno at her desk
function desk(c, screen) {
  c.rect(0, 0, W, H, "1")
  // the wall of screens behind her own, out of focus
  for (let y = 10; y < 110; y++) for (let x = 0; x < W; x++) c.px(x, y, (Math.floor(x / 22) + Math.floor(y / 16)) % 3 === 0 ? "8" : "7")
  // her screen: big, the feed of a street, a man stopping (screen "street"), or dark with her face in it ("dark")
  c.rect(78, 22, 164, 96, "k"); c.rect(82, 26, 156, 88, screen === "dark" ? "0" : "8")
  if (screen === "street") {
    c.rect(82, 80, 156, 34, "7"); for (let x = 90; x < 238; x += 24) c.rect(x, 40, 14, 40, "9")       // the street, its fronts
    for (const [x, k] of [[110, "P"], [138, "9"], [196, "P"], [214, "9"]]) { c.rect(x, 74, 5, 14, k); c.rect(x + 1, 70, 3, 4, k) }
    c.rect(160, 70, 6, 18, "Q"); c.rect(161, 65, 4, 5, "Q")                                           // the man who stopped
    for (const [x, y] of [[156, 62], [168, 62], [156, 89], [168, 89]]) c.rect(x, y, 3, 1, "y")        // her tag: yellow brackets
    c.rect(156, 62, 1, 3, "y"); c.rect(170, 62, 1, 3, "y"); c.rect(156, 87, 1, 3, "y"); c.rect(170, 87, 1, 3, "y")
  } else {
    c.ellipse(160, 66, 16, 20, "2"); c.ellipse(160, 60, 15, 12, "1"); c.rect(153, 66, 4, 1, "3"); c.rect(164, 66, 4, 1, "3")   // her face, mirrored, faint
  }
  // the desk, the keyboard, the cable into her neck; Juno from behind and to the side: short black hair, the
  // grey uniform, the badge's lanyard
  c.rect(0, 130, W, 50, "3"); c.rect(0, 130, W, 2, "4"); c.rect(120, 136, 80, 8, "4")
  c.ellipse(70, 118, 22, 26, "u"); c.rect(44, 136, 54, 44, "g"); c.rect(44, 136, 6, 44, "h")
  c.line(84, 120, 120, 132, "1"); c.line(84, 121, 120, 133, "2"); c.px(84, 120, "9")
  c.line(92, 140, 98, 160, "C"); c.rect(96, 160, 6, 8, "H")
  c.ellipse(96, 124, 5, 8, "s"); c.rect(140, 150, 26, 12, "s")                                       // her cheek, her hand on the keys
}
sprite("intro_blocks_2", { w: W, h: H }, (c) => {
  desk(c, "street")
  c.rect(60, 156, 200, 14, "n"); TXT.draw(c, 160, 160, "„Hab dich.“", "Y", { align: "center" })
  label(c, 2, "JUNO AN IHREM PULT. SIE MARKIERT IHN, GELB")
})

// ---------------------------------------------------------------- 3 the announcement
sprite("intro_blocks_3", { w: W, h: H }, (c) => {
  hall(c)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((x + y) % 2) c.px(x, y, "n")
  c.rect(0, 70, W, 40, "k"); c.hline(0, 70, W, "C"); c.hline(0, 109, W, "C")
  TXT.draw(c, 160, 78, "Ab morgen übernimmt die automatische Auswertung.", "V", { align: "center" })
  TXT.draw(c, 160, 92, "Halcyon dankt Ihnen für Ihren Dienst.", "V", { align: "center" })
  label(c, 3, "DIE DURCHSAGE, ÜBER DIE GANZE BREITE")
})

// ---------------------------------------------------------------- 4 the screens go out, back to front; hers last
sprite("intro_blocks_4", { w: W, h: H }, (c) => {
  hall(c, 4)
  // an inset: her screen dark, her face in it
  c.rect(206, 96, 110, 66, "k"); c.rect(208, 98, 106, 62, "0")
  c.ellipse(261, 128, 12, 15, "2"); c.ellipse(261, 123, 11, 9, "1"); c.rect(255, 128, 3, 1, "3"); c.rect(264, 128, 3, 1, "3")
  TXT.draw(c, 212, 150, "IHR SCHIRM ZULETZT", "6", { font: "hud" })
  label(c, 4, "DIE SCHIRME GEHEN AUS, VON HINTEN NACH VORN. STILLE")
})

// ---------------------------------------------------------------- 5 the Transitachse: down, in a glass lift
function juno2088(c, x, y, flip = false) {
  // side view, facing right (or left): 50 px; short black hair, Halcyon grey, dark trousers, the badge on its
  // lanyard, the box in her arms (a cactus, a cup, the yellow coat folded, the data stick)
  const f = (dx) => (flip ? x - dx : x + dx), r = (dx, dy, w, h, k) => c.rect(flip ? x - dx - w + 1 : x + dx, y + dy, w, h, k)
  r(-3, -50, 7, 4, "u"); r(-4, -46, 8, 8, "S"); r(-4, -46, 3, 5, "u"); r(2, -43, 1, 1, "k")         // hair, face, the eye
  r(-5, -38, 10, 18, "g"); r(-5, -38, 2, 18, "h")                                                   // the uniform jacket
  r(-1, -36, 1, 10, "C"); r(-2, -27, 3, 4, "H")                                                     // the lanyard, the badge
  r(-4, -20, 4, 16, "2"); r(0, -20, 4, 16, "3"); r(-5, -4, 5, 4, "1"); r(0, -4, 6, 4, "1")          // legs, shoes
  // the box held in front of her, its contents over its rim
  r(3, -30, 14, 10, "O"); r(3, -30, 14, 1, "P")
  r(5, -35, 3, 5, "9"); r(9, -33, 3, 3, "H"); r(12, -32, 4, 2, "y"); r(15, -33, 2, 3, "v")
  r(1, -31, 3, 6, "h")                                                                              // her arm round it
}
sprite("intro_blocks_5", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "n")
  // the city's rings passing upward behind the glass: decks, their lit windows, ads (the lift goes down)
  for (const [y0, k] of [[14, "4"], [60, "3"], [104, "4"], [150, "3"]]) {
    c.rect(0, y0, W, 6, k); c.rect(0, y0 + 6, W, 2, "1")
    for (let x = 6; x < W; x += 14) if ((x * 7 + y0) % 3) c.rect(x, y0 + 10, 6, 4, (x + y0) % 5 ? "R" : "C")
  }
  c.rect(250, 70, 46, 18, "M"); c.rect(252, 72, 42, 14, "m"); TXT.draw(c, 256, 76, "LULL", "N", { font: "hud" })
  // the shaft's rails, the cabin: a glass box with a steel frame and floor; motion lines (it falls)
  c.rect(90, 0, 3, H, "5"); c.rect(228, 0, 3, H, "5")
  c.rect(96, 52, 128, 2, "6"); c.rect(96, 138, 128, 6, "5"); c.rect(96, 52, 3, 92, "6"); c.rect(221, 52, 3, 92, "6")
  for (let y = 54; y < 138; y++) for (let x = 99; x < 221; x++) if ((x + y * 3) % 23 === 0) c.px(x, y, "w")   // the glass
  for (let i = 0; i < 9; i++) c.vline(40 + i * 33, 10 + (i * 37) % 120, 14, "5")
  juno2088(c, 150, 138)
  c.rect(30, 156, 260, 14, "n"); TXT.draw(c, 160, 160, "„Das Implantat durften wir behalten.“", "Y", { align: "center" })
  label(c, 5, "DIE TRANSITACHSE, ABWÄRTS: DIE ERSTE SEITENANSICHT")
})

// ---------------------------------------------------------------- 6 today
sprite("intro_blocks_6", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "1")
  // the CRT with a phosphor feed, the deck's boards and cables, her hand on the mouse, the yellow sleeve
  c.rect(60, 20, 150, 110, "4"); c.rect(70, 28, 130, 90, "0"); c.rect(74, 32, 122, 82, "8")
  for (let x = 80; x < 190; x += 18) c.rect(x, 48, 10, 40, "9"); c.rect(74, 92, 122, 22, "7")
  c.rect(220, 60, 70, 50, "3"); c.rect(224, 66, 30, 6, "C"); c.rect(260, 66, 24, 4, "v"); c.line(220, 100, 200, 140, "k")
  c.rect(0, 140, W, 40, "2"); c.rect(150, 148, 22, 12, "4"); c.rect(150, 148, 22, 2, "5")
  c.rect(110, 146, 44, 18, "y"); c.rect(110, 146, 44, 3, "Y"); c.rect(110, 160, 44, 4, "j"); c.rect(152, 150, 14, 9, "S")
  c.rect(0, H - 12, W, 12, "n"); TXT.draw(c, 6, H - 9, "2091-11-03  21:30", "9", { font: "hud" })
  label(c, 6, "SCHNITT: HEUTE. EIN FEED, DAS SELBSTGEBAUTE DECK, GELBER ÄRMEL")
})

sprite("intro_blocks_juno", { w: 60, h: 60, pivot: "bottom" }, (c) => { c.rect(0, 0, 60, 60, "3"); juno2088(c, 26, 56) })

sprite("intro_blocks", { w: W * 2 + 6, h: H * 3 + 12 }, (c) => {
  c.rect(0, 0, W * 2 + 6, H * 3 + 12, "n")
  for (let i = 0; i < 6; i++) c.stamp(`intro_blocks_${i + 1}`, (i % 2) * (W + 6), Math.floor(i / 2) * (H + 6))
})
