// Chapter 1, the white carriers (game/stadt.js, moment "traeger"; kapitel1-design "Die weißen Träger"): the people of the actors
// traeger_weiss and traeger_kind (today the costume mock_imai) and their van, as blocks for the user's choice before anything is painted.
// Thursday 23:30, Kowalski Street: a white van without a sign, two very friendly people in white carry a sleeping man out (a Sinker on
// Lull), his daughter in the door, the blinds go down. "Weiß hält hier unten keinen Tag: wer so herumläuft, kommt nicht von hier": their
// white is spotless, the only clean thing in the Ninth. Today the moment shows only the close-up (look_traeger); these blocks are made so
// the scene could also be staged in the street (iso, 30 px/m, Juno 50 px; SE and NE drawn, the engine mirrors for SW and NW).
//   the carriers, a man (52 px) and a woman (49 px), friendly open faces, smiling:
//     A  white coveralls, the hoods up close round the face, soft masks pulled down under the chin, white overshoes;
//        white gloves; their tech a small cyan light clipped to the chest
//     B  clinic whites: a tunic with a stand-up collar, buttoned at the side, white trousers and clogs, soft white caps; a small
//        Nagi·wa ring on the chest in pale blue, a plain grey earpiece (nothing but Lull glows behind an ear: style guide)
//   the sleeping man on the carry stretcher, feet first, under a pale blanket with two straps, his face turned up, the Lull patch behind
//     his ear as Teo's in the title (art/ui/splash.px.js): an oval pale disc with a darker rim and a brighter stripe, never a point
//   the girl, about ten (40 px), in the lit door:
//     A  in pyjamas with her father's big work jacket over them, barefoot, hair loose; a slate lit in her hand (she tried to call)
//     B  dressed for outside in a hurry: a hoodie with the hood half up, leggings, rubber boots, arms wrapped round herself; the
//        hoodie's drawstrings end in two small cyan lights
//   the van: a high-roofed panel van, white, no sign, no light bar (it doesn't honk), dark windows; the back doors open, the inside lit cold
//   traeger_blocks          the sheet: Juno (her sprite), the carriers A and B each alone (man, woman; SE, NE), the girl A and B (SE), the carriers
//                           together with the stretcher (A, B); their silhouettes below
//   traeger_wagen_blocks    the van, its back open, with carriers A and the stretcher beside it for size
//   traeger_blocks_im_raum  the blocks in the game's picture of Kowalski Street (build/blocks/traeger/shot/room_1x.png, scrolled to the
//                           right end, Juno placed by the engine)
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // the clinic white: lit, shade, the side away from the light
  L: "#eef3f8", X: "#d3dce8", H: "#b9c6d8", h: "#7d8ca4",
  // skin: light (lit, shade), dark (lit, shade); a mouth; hair dark, hair brown
  S: "#d79676", s: "#93583f", P: "#8a5a3c", p: "#5e3a28", u: "#4a2a22", a: "#1e1a22", A: "#4a3428",
  // the Lull patch (splash.px.js): its pale disc, its rim, its stripe, its dark edge; B's ring mark shares the pale blue (asked)
  b: "#c8e8ff", B: "#7aa8d8", V: "#dafcff", C: "#3d6690", v: "#62def0", c: "#1f88a4",
  // the girl: pyjamas lilac, her father's jacket olive, the hoodie teal, boots
  l: "#9a8ab8", m: "#6e6290", o: "#5a6248", O: "#3c4232", t: "#3e7480", T: "#2a4e58", g: "#2a2e3a",
  // the door's warm light behind her
  W: "#ffd58a", Q: "#eea040", R: "#b0602a",
  y: "#eec414", Y: "#9a7406",
})
include("../lib/text.js")

// ---------------------------------------------------------------------------------------------------------------------------- helpers
/** fill a polygon of screen points [x0, y0, x1, y1, ...] */
function fillPoly(c, pts, k) {
  const ys = pts.filter((_, i) => i % 2)
  for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
    const xs = [], yc = y + 0.5
    for (let i = 0; i < pts.length; i += 2) {
      const x0 = pts[i], y0 = pts[i + 1], x1 = pts[(i + 2) % pts.length], y1 = pts[(i + 3) % pts.length]
      if ((y0 <= yc && y1 > yc) || (y1 <= yc && y0 > yc)) xs.push(x0 + (yc - y0) * (x1 - x0) / (y1 - y0))
    }
    xs.sort((p, q) => p - q)
    for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) c.px(x, y, k)
  }
}
/** the street's projection (kowalski.map.js): 32 px along x and y per meter, 16 down, 30 px per meter of height */
const iso = (ox, oy) => (x, y, z = 0) => [ox + 32 * (x - y), oy + 16 * (x + y) - 30 * z]
/** a drawing context that mirrors x round `ax` (the engine's SW and NW are SE and NE mirrored) */
function mirror(c, ax) {
  const f = (x) => 2 * ax - x
  return { px: (x, y, k) => c.px(f(x), y, k), rect: (x, y, w, h, k) => c.rect(f(x + w - 1), y, w, h, k), hline: (x, y, w, k) => c.hline(f(x + w - 1), y, w, k),
    vline: (x, y, n, k) => c.vline(f(x), y, n, k), line: (x0, y0, x1, y1, k) => c.line(f(x0), y0, f(x1), y1, k), ellipse: (x, y, rx, ry, k) => c.ellipse(f(x), y, rx, ry, k) }
}
/** the same calls in one colour, for the silhouettes */
const ink = (c, k = "k") => ({ px: (a, b) => c.px(a, b, k), rect: (a, b, w, h) => c.rect(a, b, w, h, k), hline: (a, b, w) => c.hline(a, b, w, k),
  vline: (a, b, n) => c.vline(a, b, n, k), line: (a, b, d, e) => c.line(a, b, d, e, k), ellipse: (a, b, rx, ry) => c.ellipse(a, b, rx, ry, k) })

// ---------------------------------------------------------------------------------------------------------------------------- the carriers
/** a carrier standing, feet's centre at (x, fy). view "se" | "ne"; way "A" | "B"; who "m" (52 px) | "w" (49 px);
 *  hands: "side" (hanging), "front" (holding the stretcher's handles before the hips), "back" (holding them behind) */
function carrier(c, x, fy, view = "se", way = "A", who = "m", hands = "side") {
  const H = who === "m" ? 52 : 49, T = fy - H, se = view === "se", R = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  const wide = who === "m" ? 7 : 6                     // half the shoulders
  const hip = T + Math.round(H * 0.6), sk = who === "m" ? ["S", "s"] : ["P", "p"]
  // the legs and the feet: A the coverall's legs and white overshoes, B white trousers and clogs
  R(x - 4, hip, 3, fy - 3 - hip, "H"); R(x + 1, hip, 3, fy - 3 - hip, "L"); c.vline(x - 4, hip, fy - 3 - hip, "h")
  if (way === "A") { R(x - 5, fy - 3, 4, 3, "H"); R(x + 1, fy - 3, 5, 3, "L"); c.hline(x - 5, fy - 1, 4, "h"); c.hline(x + 1, fy - 1, 5, "H") }
  else { R(x - 5, fy - 3, 4, 3, "L"); R(x + 1, fy - 3, 5, 3, "L"); c.hline(x - 5, fy - 1, 4, "h"); c.hline(x + 1, fy - 1, 5, "h") }
  // the body from the shoulders to the hips (B's tunic a little longer, flaring)
  const bot = way === "B" ? hip + 3 : hip + 1
  for (let r = T + 11; r <= bot; r++) {
    const half = wide - (r < T + 13 ? 1 : 0) + (way === "B" && r > hip - 2 ? 1 : 0)
    R(x - half, r, half * 2 + 1, 1, "L"); c.px(x - half, r, "h"); c.px(x - half + 1, r, "H")
  }
  R(x - wide + 2, T + 10, wide * 2 - 3, 1, "L")
  if (se) {
    if (way === "A") {
      c.vline(x + 1, T + 11, bot - T - 10, "H")                                     // the zip
      R(x + 3, T + 15, 2, 2, "6"); c.px(x + 3, T + 15, "v")                          // the light clipped to the chest
      c.hline(x - wide + 1, hip - 1, wide * 2 - 1, "H")                             // the belt line of the coverall
    } else {
      R(x - 2, T + 10, 6, 2, "L"); c.hline(x - 2, T + 11, 6, "H")                   // the stand-up collar
      c.vline(x + 3, T + 12, bot - T - 12, "H"); for (let i = 0; i < 4; i++) c.px(x + 3, T + 14 + i * 5, "h")   // buttoned at the side
      c.px(x - 3, T + 15, "B"); c.px(x - 2, T + 14, "B"); c.px(x - 1, T + 15, "B"); c.px(x - 2, T + 16, "B")    // the ring mark
      R(x - 5, hip - 4, 4, 3, "H")                                                    // a pocket
    }
  } else {
    c.vline(x, T + 12, bot - T - 12, "H")                                           // the back seam
    if (way === "A") c.hline(x - wide + 1, hip - 1, wide * 2 - 1, "H")
  }
  // the arms; white gloves in A (so nothing on them is mistaken for the patch), bare hands in B
  const hand = way === "A" ? ["H", "X"] : sk.slice().reverse()
  const ax0 = x - wide - 2, ax1 = x + wide
  if (hands === "front") {
    // forearms forward and down, the hands before the hips, a little apart (the handles are 0.55 m apart: about 9 px in SE)
    R(ax0, T + 13, 3, 9, "H"); R(ax1, T + 13, 3, 9, "L")
    R(ax0 + 1, T + 22, 3, 5, "H"); R(ax1 - 1, T + 22, 3, 5, "L")
    R(ax0 + 2, hip - 1, 3, 3, hand[0]); R(ax1 - 1, hip - 1, 3, 3, hand[1])
  } else if (hands === "back") {
    // the arms hang a little back: the hands behind the hips, hidden
    R(ax0, T + 13, 3, 14, "H"); R(ax1, T + 13, 3, 14, "L")
    R(ax0 - 1, T + 27, 2, 2, hand[0]); R(ax1 + 2, T + 27, 2, 2, hand[1])
  } else {
    R(ax0, T + 13, 3, 15, "H"); R(ax1, T + 13, 3, 15, "L")
    R(ax0, T + 28, 3, 3, hand[0]); R(ax1, T + 28, 3, 3, hand[1])
  }
  // the head
  const hx = x + (se ? 1 : 0), hy = T + 5
  R(hx - 2, hy + 4, 4, 2, sk[1])                                                    // the neck
  if (way === "A") {
    // the hood up, close round the face; the soft mask pulled down under the chin
    c.ellipse(hx, hy, 5, 6, "L"); c.px(hx - 5, hy, "H"); c.px(hx - 5, hy + 1, "h"); c.vline(hx - 4, hy - 3, 7, "H")
    if (se) {
      c.ellipse(hx + 1, hy + 1, 3, 4, sk[0]); c.vline(hx - 2, hy, 3, sk[1])
      if (who === "w") { c.px(hx, hy - 3, "A"); c.px(hx + 1, hy - 3, "A") }                            // a strand of hair under the hood
      R(hx - 2, hy + 5, 7, 2, "X"); c.hline(hx - 2, hy + 6, 7, "H"); c.px(hx - 3, hy + 4, "H"); c.px(hx + 5, hy + 4, "H")   // the mask under the chin
    } else {
      c.hline(hx - 3, hy + 5, 7, "H"); c.px(hx + 4, hy + 2, "H")                                      // the mask's loop past the ear
    }
  } else {
    // a soft white cap over the hair
    c.ellipse(hx, hy, 4, 5, sk[0])
    if (se) {
      c.ellipse(hx + 1, hy + 1, 3, 4, sk[0]); c.vline(hx - 3, hy - 1, 4, sk[1])
      R(hx - 4, hy - 5, 9, 3, "L"); R(hx - 4, hy - 3, 2, 2, "L"); c.hline(hx - 3, hy - 3, 8, "H"); c.px(hx - 4, hy - 4, "h")
      R(hx - 4, hy - 1, 2, 2, who === "w" ? "a" : "A")                                                  // hair at the temple
      c.px(hx - 3, hy + 1, "7")                                                                          // the earpiece, plain grey
      if (who === "w") R(hx - 6, hy - 2, 2, 3, "a")                                                     // her bun under the cap's edge
    } else {
      c.ellipse(hx, hy, 4, 5, who === "w" ? "a" : "A"); R(hx - 1, hy + 4, 3, 2, sk[1])          // the back of the head is hair, the nape below
      R(hx - 4, hy - 5, 9, 4, "L"); c.hline(hx - 4, hy - 2, 9, "H"); c.px(hx + 4, hy - 4, "h")
      if (who === "w") { c.ellipse(hx, hy + 4, 2, 1, "a"); c.px(hx + 1, hy + 3, "A"); c.vline(hx + 3, hy - 1, 3, "A") }   // her bun low at the nape, the hair's sheen
      c.px(hx + 4, hy, sk[1]); c.px(hx + 4, hy + 1, "7")                                               // the ear, the earpiece (unlit)
    }
  }
  if (se) {
    // the face: eyes, and the smile (corners up)
    c.px(hx + 1, hy, "k"); c.px(hx + 3, hy, "k")
    c.px(hx + 1, hy + 2, "u"); c.px(hx + 4, hy + 2, "u"); c.hline(hx + 2, hy + 2, 2, "V"); c.hline(hx + 2, hy + 3, 2, "u")
  }
}

// ---------------------------------------------------------------------------------------------------------------------------- the stretcher
/** the carry stretcher with the sleeping man, feet first along +x (SE); P the projection with the rear carrier's feet at (0, 0).
 *  part "back" draws the stretcher and the man; the carriers are drawn round it. */
function stretcher(c, P) {
  const z = 0.75, w = 0.27, poly = (pts, k) => fillPoly(c, pts.flatMap((p) => P(...p)), k), ln = (a, b, k) => { const [x0, y0] = P(...a), [x1, y1] = P(...b); c.line(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), k) }
  // the canvas between the rails, its far edge and its near edge (the near one shows its side)
  poly([[0.3, -w, z], [2.05, -w, z], [2.05, w, z], [0.3, w, z]], "5")
  poly([[0.3, w, z], [2.05, w, z], [2.05, w, z - 0.06], [0.3, w, z - 0.06]], "4")
  // his shoulders in a grey vest, then the blanket over him in the shape of a body: chest, hips, legs, the feet standing it up at the end
  // (the head lies at 0.5 m, clear of the rear carrier's hands on the handles at 0.08 to 0.2 m)
  poly([[0.66, -0.2, z + 0.1], [0.84, -0.2, z + 0.13], [0.84, 0.21, z + 0.12], [0.66, 0.21, z + 0.08]], "6")
  for (const [u0, u1, half, top] of [[0.82, 1.28, 0.24, 0.2], [1.28, 1.55, 0.22, 0.16], [1.55, 1.9, 0.16, 0.12], [1.9, 2.0, 0.17, 0.22]]) {
    poly([[u0, -half, z + top], [u1, -half, z + top], [u1, half, z + top], [u0, half, z + top]], "X")         // its lit top
    poly([[u0, half, z + top], [u1, half, z + top], [u1, half + 0.02, z], [u0, half + 0.02, z]], "H")        // its near side, falling to the canvas
  }
  poly([[0.82, 0.22, z + 0.05], [2.0, 0.22, z + 0.03], [2.0, 0.27, z], [0.82, 0.27, z]], "h")                // where it lies on the canvas
  // two straps across
  for (const [sx, top, half] of [[1.1, 0.2, 0.24], [1.72, 0.12, 0.16]]) { ln([sx, -half, z + top], [sx, half, z + top], "4"); ln([sx, half, z + top], [sx, w, z], "4") }
  // a pale pillow, and his head on it: the crown toward the rear (up-left), the face turned up, the near ear toward the camera (down-left)
  poly([[0.32, -0.2, z + 0.04], [0.66, -0.2, z + 0.04], [0.66, 0.2, z + 0.04], [0.32, 0.2, z + 0.04]], "H")
  const [hx, hy] = P(0.5, 0, z + 0.12), x = Math.round(hx), y = Math.round(hy)
  c.ellipse(x, y, 5, 4, "P")
  c.hline(x - 1, y - 3, 5, "S"); c.hline(x, y - 4, 3, "S")                                      // the face's lit top: brow and nose
  c.hline(x - 4, y - 3, 3, "a"); c.hline(x - 5, y - 2, 3, "a"); c.vline(x - 5, y - 1, 2, "a")      // short dark hair at the crown
  c.px(x + 1, y - 1, "p"); c.px(x + 2, y - 1, "p"); c.px(x + 4, y - 2, "s")                      // the closed eye, the nose's tip
  c.hline(x + 3, y + 1, 2, "u")                                                                     // the mouth, slack
  c.px(x + 1, y + 3, "p"); c.px(x + 2, y + 3, "p"); c.px(x + 1, y + 2, "s")                      // the near ear
  // behind it the Lull patch as Teo's (splash.px.js): an oval pale disc, a darker rim, a brighter stripe, a dark edge round it
  const patch = [".CC.", "CBbC", "CbVC", "CbVC", ".CC."]
  patch.forEach((row, j) => [...row].forEach((k, i) => { if (k !== ".") c.px(x - 3 + i, y - 1 + j, k) }))
  // the rails and the handles at both ends
  ln([0.08, w, z], [2.27, w, z], "7"); ln([0.08, -w, z], [0.3, -w, z], "7"); ln([2.05, -w, z], [2.27, -w, z], "7")
  for (const [a, b] of [[0.08, 0.2], [2.15, 2.27]]) { ln([a, w, z], [b, w, z], "3"); ln([a, -w, z], [b, -w, z], "3") }
}

/** the two carriers with the stretcher, walking SE (feet first); the rear carrier's feet at (x, fy) */
function pair(c, x, fy, way) {
  const P = iso(x, fy)
  carrier(c, x, fy, "se", way, "w", "front")                                    // the rear carrier, behind the stretcher, looking ahead
  stretcher(c, P)
  const [hx, hy] = P(0.12, 0, 0.75)                                             // her hands on the rear handles, over the rails
  c.rect(Math.round(hx) - 4, Math.round(hy) - 1, 3, 3, way === "A" ? "H" : "p"); c.rect(Math.round(hx) + 4, Math.round(hy) - 2, 3, 3, way === "A" ? "X" : "P")
  const [fx, ffy] = P(2.42, 0, 0)
  carrier(c, Math.round(fx), Math.round(ffy), "se", way, "m", "back")         // the front carrier, in front of the stretcher's feet
}

// ---------------------------------------------------------------------------------------------------------------------------- the girl
/** the girl standing, about ten, 40 px, feet's centre at (x, fy) (SE) */
function girl(c, x, fy, way) {
  const T = fy - 40, R = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  const hx = x + 1, hy = T + 5
  if (way === "A") {
    // barefoot, the pyjama legs, her father's work jacket far too big, to her knees, its sleeves over her hands
    R(x - 3, T + 30, 3, 8, "m"); R(x + 1, T + 30, 3, 8, "l"); R(x - 3, T + 38, 3, 2, "S"); R(x + 1, T + 38, 4, 2, "S")
    for (let r = T + 9; r <= T + 31; r++) { const half = 6 + (r > T + 20 ? 1 : 0); R(x - half, r, half * 2 + 1, 1, "o"); c.px(x - half, r, "O") }
    R(x, T + 10, 3, 21, "l"); c.vline(x, T + 10, 21, "O"); c.vline(x + 3, T + 10, 21, "O")       // the jacket open over the pyjamas
    R(x - 9, T + 11, 3, 15, "O"); R(x + 7, T + 11, 3, 13, "o")                                    // the sleeves; her right arm bent, the slate
    R(x + 5, T + 22, 4, 5, "k"); R(x + 6, T + 23, 2, 3, "v"); c.px(x + 6, T + 23, "V")
    // hair loose to the shoulders
    c.ellipse(hx, hy, 4, 5, "S"); R(hx - 4, hy - 5, 8, 3, "a"); R(hx - 5, hy - 3, 3, 9, "a"); R(hx + 3, hy - 3, 2, 3, "a")
  } else {
    // rubber boots, leggings, the hoodie with the hood half up, arms wrapped round herself
    R(x - 3, T + 26, 3, 9, "g"); R(x + 1, T + 26, 3, 9, "g"); c.vline(x + 3, T + 26, 9, "4")
    R(x - 4, T + 34, 4, 6, "T"); R(x + 1, T + 34, 4, 6, "t"); c.hline(x - 4, fy - 1, 9, "k")
    for (let r = T + 9; r <= T + 27; r++) { const half = 6; R(x - half, r, half * 2 + 1, 1, "t"); c.px(x - half, r, "T") }
    R(x - 7, T + 15, 15, 4, "T"); c.hline(x - 6, T + 15, 13, "t"); R(x + 4, T + 15, 3, 3, "S"); R(x - 6, T + 16, 2, 2, "s")   // the arms across
    c.vline(x, T + 10, 4, "V"); c.vline(x + 2, T + 10, 4, "V"); c.px(x, T + 14, "v"); c.px(x + 2, T + 14, "v")              // the drawstrings' lights
    c.ellipse(hx, hy, 4, 5, "S")
    c.ellipse(hx - 1, hy - 1, 5, 5, "t"); c.ellipse(hx + 1, hy + 1, 3, 4, "S")                  // the hood, half up
    R(hx - 1, hy - 3, 5, 2, "a")                                                                 // the fringe
    c.px(hx - 4, hy + 4, "a"); c.px(hx - 5, hy + 5, "a")                                        // a strand out of the hood
  }
  // the face: eyes wide, the mouth small and shut
  c.px(hx + 1, hy, "k"); c.px(hx + 3, hy, "k"); c.px(hx + 1, hy - 1, "k"); c.px(hx + 3, hy - 1, "k"); c.hline(hx + 2, hy + 3, 2, "s")
}

/** the door's warm light, a lit rectangle behind her */
function doorway(c, x, fy, w = 22, h = 52) {
  c.rect(x - w / 2 - 3, fy - h - 3, w + 6, h + 3, "2"); c.rect(x - w / 2, fy - h, w, h, "R"); c.rect(x - w / 2 + 2, fy - h + 2, w - 4, h - 2, "Q")
  c.rect(x - w / 2 + 5, fy - h + 6, w - 10, h - 6, "W")
}

// ---------------------------------------------------------------------------------------------------------------------------- the van
/** the van: a high-roofed panel van, 4.8 x 1.9 x 2.3 m. Its own axes: u from the nose (0) to the back (4.8), w across (0..1.9).
 *  `to(u, w, z)` gives screen points; `show` says which ends and sides face the camera ("back", "nose", "side": the w = 1.9 side). */
function van(c, to, show) {
  const poly = (pts, k) => fillPoly(c, pts.flatMap((p) => to(...p)), k)
  const ln = (a, b, k) => { const [x0, y0] = to(...a), [x1, y1] = to(...b); c.line(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), k) }
  const W = 1.9, L = 4.8, z0 = 0.32, Z = 2.3
  const wheel = (u, w, k) => { const [x, y] = to(u, w, 0.34); c.ellipse(Math.round(x), Math.round(y), 6, 8, k); c.ellipse(Math.round(x), Math.round(y), 2, 3, "6") }
  // the far wheels and the dark under the body
  for (const u of [0.75, 3.95]) wheel(u, 0.1, "k")
  poly([[0.1, 0.1, 0.12], [L - 0.1, 0.1, 0.12], [L - 0.1, W - 0.1, 0.12], [0.1, W - 0.1, 0.12]], "k")
  // the roof (lit), the windscreen's slope (dark glass in a white frame), the bonnet
  poly([[1.2, 0, Z], [L, 0, Z], [L, W, Z], [1.2, W, Z]], "L")
  poly([[1.6, 0.35, Z], [2.2, 0.35, Z], [2.2, 0.85, Z], [1.6, 0.85, Z]], "H")                                 // a roof vent
  poly([[0.3, 0, 1.18], [0.95, 0, 2.08], [1.2, 0, 2.3], [1.2, W, 2.3], [0.95, W, 2.08], [0.3, W, 1.18]], "X")
  poly([[0.36, 0.1, 1.27], [0.94, 0.1, 2.04], [0.94, W - 0.1, 2.04], [0.36, W - 0.1, 1.27]], "2")
  poly([[0, 0, 1.0], [0.3, 0, 1.18], [0.3, W, 1.18], [0, W, 1.0]], "L")
  if (show.includes("nose")) {
    poly([[0, 0, z0], [0, W, z0], [0, W, 1.0], [0, 0, 1.0]], "H")
    poly([[0, 0.15, 0.66], [0, 0.48, 0.66], [0, 0.48, 0.8], [0, 0.15, 0.8]], "V"); poly([[0, W - 0.48, 0.66], [0, W - 0.15, 0.66], [0, W - 0.15, 0.8], [0, W - 0.48, 0.8]], "V")
    poly([[0, 0.6, 0.45], [0, W - 0.6, 0.45], [0, W - 0.6, 0.72], [0, 0.6, 0.72]], "h")
  }
  if (show.includes("side")) {
    // the long side in the half light: white, a darker sill, the cab's window dark, the door seams; no sign
    const side = [[0, z0], [0, 1.0], [0.3, 1.18], [0.95, 2.08], [1.2, Z], [L, Z], [L, z0]]
    poly(side.map(([u, z]) => [u, W, z]), "X")
    poly([[0, W, z0], [L, W, z0], [L, W, 0.6], [0, W, 0.6]], "H")
    poly([[0.42, W, 1.25], [0.95, W, 1.98], [1.42, W, 1.98], [1.42, W, 1.25]], "2")
    for (const u of [1.5, 2.6, 3.7]) ln([u, W, 0.42], [u, W, 2.12], "H")
    ln([1.2, W, Z], [L, W, Z], "H")                                                                            // the roof's edge
    for (const u of [0.75, 3.95]) { poly([[u - 0.42, W, 0.32], [u - 0.36, W, 0.68], [u + 0.36, W, 0.68], [u + 0.42, W, 0.32]], "h"); wheel(u, W, "1") }
  }
  if (show.includes("door")) poly([[L, W, z0 + 0.05], [L + 0.85, W, z0 + 0.05], [L + 0.85, W, Z - 0.1], [L, W, Z - 0.1]], "L")   // only the near door, swung out
  if (show.includes("back")) {
    // the back open: a white frame, the inside lit cold, its floor with the stretcher's rail; the doors swung out
    poly([[L, 0, z0], [L, W, z0], [L, W, Z], [L, 0, Z]], "H")
    poly([[L, 0.1, z0 + 0.14], [L, W - 0.1, z0 + 0.14], [L, W - 0.1, Z - 0.12], [L, 0.1, Z - 0.12]], "b")
    poly([[L, 0.1, z0 + 0.14], [L, W - 0.1, z0 + 0.14], [L, W - 0.1, z0 + 0.4], [L, 0.1, z0 + 0.4]], "7")
    poly([[L, 0.55, z0 + 0.4], [L, W - 0.55, z0 + 0.4], [L, W - 0.55, z0 + 0.48], [L, 0.55, z0 + 0.48]], "6")
    poly([[L, 0, z0 + 0.05], [L + 0.85, 0, z0 + 0.05], [L + 0.85, 0, Z - 0.1], [L, 0, Z - 0.1]], "h")     // the far door, its inside
    poly([[L, W, z0 + 0.05], [L + 0.85, W, z0 + 0.05], [L + 0.85, W, Z - 0.1], [L, W, Z - 0.1]], "L")     // the near door, its outside
    poly([[L + 0.1, W, 1.3], [L + 0.75, W, 1.3], [L + 0.75, W, 1.95], [L + 0.1, W, 1.95]], "2")
  }
}

// ---------------------------------------------------------------------------------------------------------------------------- the sheet
sprite("_juno", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50] })
const SW = 498, SH = 196
sprite("traeger_blocks", { w: SW, h: SH }, (c) => {
  c.rect(0, 0, SW, 96, "3"); c.rect(0, 86, SW, 10, "2"); c.rect(0, 96, SW, 100, "5"); c.rect(0, 186, SW, 10, "4")
  const labels = [[16, "JUNO", ""], [50, "A", "SE"], [74, "A", "NE"], [98, "A", "SE"], [122, "A", "NE"], [150, "B", "SE"], [174, "B", "NE"],
    [198, "B", "SE"], [222, "B", "NE"], [254, "GIRL", "A"], [282, "GIRL", "B"], [348, "A", "CARRY"], [438, "B", "CARRY"]]
  for (const [x, a, b] of labels) { TXT.draw(c, x, 3, a, "7", { font: "hud", align: "center" }); if (b) TXT.draw(c, x, 10, b, "6", { font: "hud", align: "center" }) }
  doorway(c, 254, 88, 20, 50); doorway(c, 282, 88, 20, 50)
  const draw = (cc, fy, sil) => {
    carrier(cc, 50, fy, "se", "A", "m"); carrier(cc, 74, fy, "ne", "A", "m"); carrier(cc, 98, fy, "se", "A", "w"); carrier(cc, 122, fy, "ne", "A", "w")
    carrier(cc, 150, fy, "se", "B", "m"); carrier(cc, 174, fy, "ne", "B", "m"); carrier(cc, 198, fy, "se", "B", "w"); carrier(cc, 222, fy, "ne", "B", "w")
    girl(cc, 254, fy, "A"); girl(cc, 282, fy, "B")
    pair(cc, 310, fy - 34, "A"); pair(cc, 400, fy - 34, "B")
  }
  draw(c, 86)
  // the silhouettes: the same in ink
  const k = ink(c); k.px = (a, b) => c.px(a, b, "k")
  const sc = { ...k, rect: (a, b, w, h) => c.rect(a, b, w, h, "k") }
  draw(sc, 186)
}, (c) => c.stamp("_juno", 3, 36))

// ---------------------------------------------------------------------------------------------------------------------------- the van's sheet
const VW = 330, VH = 190
sprite("traeger_wagen_blocks", { w: VW, h: VH }, (c) => {
  c.rect(0, 0, VW, VH, "3"); c.rect(0, 150, VW, 40, "2")
  TXT.draw(c, 4, 3, "VAN", "7", { font: "hud" }); TXT.draw(c, 4, 10, "NO SIGN", "6", { font: "hud" })
  // nose at x = 0, the back at x = 4.8 (+x, open), the long side at y = 1.9 (+y)
  const P = iso(70, 76)
  van(c, (u, w, z) => P(u, w, z), ["side", "back"])
  pair(c, 236, 112, "A")
}, (c) => c.stamp("_juno", 6, 136))

// ---------------------------------------------------------------------------------------------------------------------------- in the room
// Kowalski Street's picture scrolled to its right end (camera x 96): map (x, y) -> room (188 + 32 (x - y), 66 + 16 (x + y)), minus 96.
// The house opposite (south of the street) lies behind the room's camera, so the girl stands here in the gateway of the alley at the
// street's east end (the passage through that house); the carriers come out of it and carry the man SW (front views, mirrored SE) to the
// van at the near kerb, whose back stands open toward them (its back faces away from the camera; one door shows).
sprite("traeger_blocks_im_raum", { png: "../../build/blocks/traeger/shot/room_1x.png" }, (c) => {
  const CX = 96, P = (x, y, z = 0) => [188 - CX + 32 * (x - y), 66 + 16 * (x + y) - 30 * z]
  // the gateway lit warm from inside the house, and the girl standing in it (a step inside, so the picture's edge leaves her whole)
  const [gx, gy] = P(6.2, -0.3)
  const X = Math.round(gx), Y = Math.round(gy)
  c.rect(X - 9, Y - 50, 18, 50, "R"); c.rect(X - 7, Y - 48, 14, 48, "Q"); c.rect(X - 4, Y - 45, 8, 45, "W")
  girl(c, X, Y, "A")
  // the carriers: the rear one at (4.2, 0.1), the front one 2.42 m on along +y; the SE pair mirrored round the rear's x (walking SW)
  const [rx, ry] = P(4.2, 0.1)
  pair(mirror(c, Math.round(rx)), Math.round(rx), Math.round(ry), "A")
  // the van at the far kerb, before the house opposite (off the picture, at x = 7), ahead of them: nose to the west, its open back at
  // y = 4.9 facing the carriers (away from the camera), its long side at x = 6.5 toward the camera. The picture's bottom edge cuts it:
  // only its roof's corner and the swung door's top show (any nearer and its 2.3 m would cover the carriers; the camera can't do more)
  const to = (u, w, z) => P(4.6 + w, 9.7 - u, z)
  van(c, to, ["side", "door"])
  // the roof's rim, so the corner reads as a vehicle's top and not as a patch of white
  for (const [a, b] of [[[1.2, 0, 2.3], [4.8, 0, 2.3]], [[4.8, 0, 2.3], [4.8, 1.9, 2.3]]]) {
    const [x0, y0] = to(...a), [x1, y1] = to(...b), X0 = Math.round(x0), Y0 = Math.round(y0), X1 = Math.round(x1), Y1 = Math.round(y1)
    c.line(X0, Y0 - 1, X1, Y1 - 1, "1"); c.line(X0, Y0 + 1, X1, Y1 + 1, "X"); c.line(X0, Y0 + 2, X1, Y1 + 2, "H")
  }
})
