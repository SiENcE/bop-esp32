// Chapter 1, job B: the other three of the job as blocks for approval before they are painted (kapitel1-design §10, story §4).
// Each in front three-quarter (SE: the game flips them for SW), two ways each, beside Juno for her height.
//   Lt. Agnes Morrow, 50 px, #a8b8d0: Revier 9, takes money from Nagi·wa and hates herself for it; a grey trench coat, the badge on a
//     lanyard. Seen only in CAM 07 in Chapter 1, but she comes back (an ally, story §6).
//       A  her hair tied back, the coat open, the badge on its lanyard lit (her glowing thing)
//       B  short grey hair, the coat belted, its collar up, a cigarette's glow at her mouth, the badge clipped to the belt
//   the Tidewater boy, 44 px, #7ab0c0: a tide child of the gang, gills and glowing marks, a hood. Only in CAM 07, at 00:30.
//       A  the hood up, his face in it, the mark at his neck lit under its edge, his hands in the hoodie's pocket
//       B  the hood down, his head shaved, the gills open on his neck, glowing marks along them, the envelope in his hand
//   Ratz, 26 px upright, #90d0a0: a cable rat from the old flood programme, the size of a small dog, who sells scrap on the Drain
//     Market; headphones, a parka far too big, the tail sticking out, the speech collar glowing.
//       A  the headphones on his ears, the parka's hood down, the tail a pink rat's tail
//       B  the parka's hood up, his ears through two holes in it, the headphones round his neck over the collar; the tail ends in an
//          old plug (a cable rat)
//   tide_people_blocks   the sheet: Juno (pasted in later), Morrow A B, the boy A B, Ratz A B; their silhouettes below
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // Morrow: the trench coat, its shade, the belt; skin; her hair brown and grey; the cigarette's glow
  c: "#9a9ea6", C: "#6a6e76", B: "#44484e", S: "#d0a080", s: "#a07050", a: "#3a2a24", w: "#a8a8a8", O: "#ff9a40",
  // the boy: the hoodie, its shade, his trousers; skin; the gills' dark; the envelope
  h: "#4a6e7a", H: "#304a54", j: "#2a3040", T: "#b07a58", t: "#7a5038", G: "#3a2420", W: "#e8e4d4",
  // Ratz: fur, its shade, the pink of ears, nose and tail; the parka, its shade; the headphones; the plug
  f: "#8a8a92", F: "#5e5e66", p: "#d898a0", P: "#a06a72", o: "#6a7440", q: "#485028", m: "#2a2a30", M: "#9aa0a8",
  v: "#62def0", V: "#dafcff", g: "#90d0a0",
})
include("../lib/text.js")
const R = (c, a, b, w, h, k) => c.rect(a, b, w, h, k)

/** Lt. Morrow standing, feet's centre at (x, fy) */
function morrow(c, x, fy, way) {
  const T = fy - 50
  R(c, x - 4, T + 39, 3, 8, "3"); R(c, x + 1, T + 39, 3, 8, "4"); R(c, x - 5, T + 47, 4, 3, "1"); R(c, x + 1, T + 47, 5, 3, "1")
  // the trench coat to below the knee, flaring; A open over a dark jumper, B belted with the collar up
  for (let r = 11; r <= 40; r++) { const half = 6 + Math.round((r - 11) * 2 / 29); R(c, x - half, T + r, half * 2 + 1, 1, "c"); c.px(x - half, T + r, "C"); c.px(x + half, T + r, "C") }
  if (way === "A") { R(c, x - 1, T + 12, 4, 26, "2"); c.vline(x - 2, T + 12, 28, "C"); c.vline(x + 3, T + 12, 28, "C"); c.line(x - 1, T + 11, x + 1, T + 21, "6"); R(c, x, T + 21, 3, 3, "v"); c.px(x + 1, T + 22, "V") }
  else { R(c, x - 7, T + 23, 15, 2, "B"); R(c, x + 2, T + 23, 2, 2, "v"); c.vline(x + 1, T + 12, 26, "C"); R(c, x - 5, T + 8, 3, 5, "c"); R(c, x + 3, T + 8, 3, 5, "C") }
  // the arms, the hands
  R(c, x - 9, T + 13, 3, 16, "C"); R(c, x + 7, T + 13, 3, 16, "c"); R(c, x - 9, T + 29, 3, 3, "s"); R(c, x + 7, T + 29, 3, 3, "S")
  // the head: tired eyes; A the hair tied back, B short and grey with the cigarette
  const hx = x + 1, hy = T + 5
  R(c, hx - 1, hy + 4, 3, 3, "s"); c.ellipse(hx, hy, 4, 5, "S"); c.px(hx + 1, hy, "k"); c.px(hx + 3, hy, "k"); c.hline(hx + 1, hy + 1, 3, "s")
  if (way === "A") { R(c, hx - 4, hy - 5, 8, 3, "a"); R(c, hx - 4, hy - 3, 2, 4, "a"); R(c, hx - 6, hy - 2, 3, 3, "a") }
  else { R(c, hx - 4, hy - 5, 9, 3, "w"); R(c, hx - 4, hy - 3, 3, 6, "w"); c.px(hx + 4, hy + 3, "W"); c.px(hx + 5, hy + 3, "O") }
}

/** the Tidewater boy standing, feet's centre at (x, fy) */
function boy(c, x, fy, way) {
  const T = fy - 44
  R(c, x - 3, T + 29, 3, 12, "j"); R(c, x + 1, T + 29, 3, 12, "5"); R(c, x - 4, T + 41, 4, 3, "W"); R(c, x + 1, T + 41, 5, 3, "W"); c.hline(x - 4, T + 43, 10, "7")
  // the hoodie, too big, the pocket in front
  R(c, x - 6, T + 11, 13, 19, "h"); c.vline(x - 6, T + 11, 19, "H"); c.vline(x + 6, T + 11, 19, "H"); R(c, x - 3, T + 21, 7, 4, "H")
  R(c, x - 8, T + 12, 3, 13, "H"); R(c, x + 6, T + 12, 3, 13, "h")
  const hx = x + 1, hy = T + 5
  if (way === "A") {
    // hands in the pocket; the hood up round the face, the mark at his neck lit under its edge
    R(c, x - 3, T + 22, 2, 2, "t"); R(c, x + 2, T + 22, 2, 2, "T")
    c.ellipse(hx, hy, 5, 6, "h"); c.ellipse(hx + 1, hy + 1, 3, 4, "T"); c.px(hx + 1, hy + 1, "k"); c.px(hx + 3, hy + 1, "k")
    c.hline(hx - 4, hy - 6, 9, "H"); R(c, hx - 2, hy + 6, 5, 1, "v"); c.px(hx, hy + 6, "V")
  } else {
    // the hood down round his shoulders; shaved head, gills open on the neck with glowing marks along them; the envelope in his hand
    R(c, x - 5, T + 10, 11, 3, "H")
    R(c, x + 6, T + 25, 3, 2, "T"); R(c, x + 8, T + 22, 6, 4, "W"); c.hline(x + 8, T + 22, 6, "7"); R(c, x - 8, T + 25, 3, 2, "t")
    R(c, hx - 2, hy + 4, 4, 3, "t"); c.ellipse(hx, hy, 4, 5, "T"); c.hline(hx - 3, hy - 5, 7, "t"); c.px(hx + 1, hy, "k"); c.px(hx + 3, hy, "k")
    for (let i = 0; i < 3; i++) { c.hline(hx - 3, hy + 3 + i * 2 - 2, 2, "G"); c.px(hx - 4, hy + 2 + i * 2 - 2, "v") }
    c.px(hx - 3, hy - 3, "v"); c.px(hx - 2, hy - 4, "v")
  }
}

/** Ratz upright, feet's centre at (x, fy) */
function ratz(c, x, fy, way) {
  const T = fy - 26
  // the tail out behind him, from under the parka; B ends in a plug
  c.line(x - 6, T + 21, x - 12, T + 23, "p"); c.line(x - 12, T + 23, x - 15, T + 20, "p")
  if (way === "B") { R(c, x - 17, T + 17, 3, 3, "M"); c.px(x - 17, T + 16, "M"); c.px(x - 15, T + 16, "M") }
  // the feet, the parka to his knees, the sleeves far too long
  R(c, x - 4, T + 23, 3, 3, "p"); R(c, x + 2, T + 23, 4, 3, "p")
  R(c, x - 6, T + 11, 12, 13, "o"); c.vline(x - 6, T + 11, 13, "q"); c.hline(x - 6, T + 23, 12, "q"); c.vline(x, T + 13, 10, "q")
  R(c, x + 4, T + 13, 4, 8, "o"); c.vline(x + 7, T + 13, 8, "q"); R(c, x - 8, T + 13, 3, 8, "q")
  // the collar, glowing
  R(c, x - 3, T + 10, 8, 2, "g"); c.px(x + 2, T + 10, "V")
  // the head, its snout to the right, the whiskers; the ears
  c.ellipse(x + 1, T + 6, 4, 4, "f"); R(c, x + 4, T + 6, 4, 3, "f"); c.px(x + 8, T + 7, "p"); c.px(x + 3, T + 5, "k"); c.vline(x - 2, T + 4, 4, "F")
  c.px(x + 9, T + 6, "7"); c.px(x + 9, T + 8, "7")
  if (way === "A") {
    R(c, x - 3, T + 0, 3, 3, "p"); R(c, x + 2, T + 0, 3, 3, "p")
    R(c, x - 4, T + 2, 9, 1, "m"); R(c, x - 5, T + 3, 2, 4, "m"); R(c, x + 4, T + 3, 2, 3, "m"); c.px(x - 5, T + 4, "v")   // the headphones
  } else {
    c.ellipse(x, T + 5, 5, 5, "o"); c.ellipse(x + 2, T + 6, 3, 3, "f"); R(c, x + 4, T + 6, 4, 3, "f"); c.px(x + 8, T + 7, "p"); c.px(x + 4, T + 5, "k")
    R(c, x - 3, T - 1, 2, 3, "p"); R(c, x + 2, T - 1, 2, 3, "p")                 // the ears through the hood
    R(c, x - 4, T + 11, 9, 2, "m"); c.px(x - 4, T + 11, "v")                    // the headphones round his neck
  }
}

const SW = 260, SH = 150
sprite("tide_people_blocks", { w: SW, h: SH }, (c) => {
  c.rect(0, 0, SW, 76, "3"); c.rect(0, 66, SW, 10, "2"); c.rect(0, 76, SW, 74, "5"); c.rect(0, 140, SW, 10, "4")
  const labels = [[20, "JUNO", ""], [58, "MORROW", "A"], [90, "MORROW", "B"], [130, "TIDE", "A"], [160, "TIDE", "B"], [200, "RATZ", "A"], [238, "RATZ", "B"]]
  for (const [x, a, b] of labels) { TXT.draw(c, x, 3, a, "7", { font: "hud", align: "center" }); if (b) TXT.draw(c, x, 10, b, "6", { font: "hud", align: "center" }) }
  const draw = (cc, fy) => { morrow(cc, 58, fy, "A"); morrow(cc, 90, fy, "B"); boy(cc, 130, fy, "A"); boy(cc, 160, fy, "B"); ratz(cc, 200, fy, "A"); ratz(cc, 240, fy, "B") }
  draw(c, 68)
  const sil = { px: (a, b) => c.px(a, b, "k"), rect: (a, b, w, h) => c.rect(a, b, w, h, "k"), hline: (a, b, w) => c.hline(a, b, w, "k"),
    vline: (a, b, n) => c.vline(a, b, n, "k"), line: (a, b, d, e) => c.line(a, b, d, e, "k"), ellipse: (a, b, rx, ry) => c.ellipse(a, b, rx, ry, "k") }
  draw(sil, 142)
})
