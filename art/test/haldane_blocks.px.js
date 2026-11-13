// Chapter 1, the newspaper war: Frau Haldane (story §4: the neighbour from 14C, always on Lull, always tired, friendly; a pink
// dressing gown, #ffa8d8) asleep on her feet, and the morning's papers she takes, as blocks for approval before they are painted.
// They replace mock_haldane and mock_papers (art/mock/ch1_blocks.px.js). Her one walk is in cam14 (game/stadt.js: the actor haldane_feed,
// 02:30 on days 2 and 3, AC.door -> AC.mat -> AC.door at speed [8, 4]): the door (186, 105) and the mat (187, 135) lie straight above each
// other, a pixel apart, so she goes down the picture facing SE and back up facing NW (the engine's mirror of NE), and stands at her door
// facing SE before and NW after. So she gets SE and NE, each standing and in a shuffling step (the slippers barely leave the floor, the
// arms hang and don't swing). In kessel_14 she is never standing: she sleeps in her armchair, painted into the kit (art/kit/kessel_14.kit.px.js,
// `armchair`), seen from the side through her door.
// Her height: an old woman a little bowed by sleep, 1.57 m at the floor's 30 px a metre, 47 px with the curlers and the outline (Juno's 50
// are hers with it); her head sunk on to her shoulders and a pixel forward. Her look from her
// portrait (art/portraits/portraits.px.js, docs/portraits/haldane_x4.png): grey hair, a soft long face, the gown pink (its four tones), the
// skin pale and rosy; the eyes shut, the mouth a little open. The Lull patch behind her ear: the small lullPatch of the portraits, the oval
// pale disc with a darker rim and a brighter stripe (3x4), as Teo's (art/test/teo_blocks.px.js), never a point; on the ear each view turns
// to us. Fluffy slippers, cream.
//   A  the portrait's: curlers (blue, pink, cream) under a grey hairnet; a long quilted gown to the ankles, a shawl collar, the belt tied
//   B  her grey hair loose and untidy, to the shoulders; a shorter robe of a kimono cut to the knees, wide sleeves, a broad sash, her pale
//      nightdress below it to the shins
// The papers at the head of the stairs (cam14's prop `papers`, bottom-centre at AC.mat + [8, -1]): the NINTH HERALD, hers and 14A's.
//   A  a tied bundle, the twine crossed over it, the masthead's dark band along its edge
//   B  a loose stack: two papers, the top one askew, a corner lifted
//   haldane_blocks                the sheet: Juno (her real street sprites), A and B (SE, step, NE, NW = NE mirrored), the papers; silhouettes
//   haldane_blocks_<a|b>_<se|sestep|ne|nestep>, papers_blocks_<a|b>   each alone, pivot bottom-centre (for the room composite)
//   haldane_blocks_im_raum        the 14th floor (a game shot, Juno at Frau Haldane's door) with her at the mat and the papers, A and B;
//                                 below it CAM 14 (a game shot of the feed at 01:15, before she comes) with her and the papers in the feed's
//                                 phosphor (the camera's exposure 2.2, then the ramp by brightness, as Nagiwa.FEED_POST does, without its dither);
//                                 build/blocks/haldane/front.py then puts the rail and the bench back in front of her (the game draws them
//                                 in front: their baselines lie lower), from the shots themselves
"use strict"
const PAL = {
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // the gown (the portrait's R: lit, base, dim, deep); skin (S), the cheeks; grey hair (G), the net
  P: "#ffc8e4", p: "#e888bc", q: "#b0588a", Q: "#6e3060",
  s: "#fbe2d2", S: "#ecc0ac", t: "#c08878", T: "#7c4a48", c: "#f4a8a0",
  g: "#e6e8ec", G: "#b4bac4", h: "#7c8494", H: "#4e5668",
  // the curlers (blue, pink, cream); the Lull patch (rim, stripe, disc: lullPatch's own); the slippers (fluff, shade)
  b: "#a8d4e8", r: "#f0b8d0", e: "#e4dcc0", l: "#3d6690", L: "#dafcff", m: "#c8e8ff", u: "#ece4d0", U: "#b0a490",
  // B's nightdress; the papers (paper, its shade, the print, the masthead), the twine
  n: "#d8d0f0", N: "#a098c0", w: "#eae6d4", W: "#b8b4a4", x: "#565e70", X: "#8e96a8", y: "#b08a50", Y: "#7a5c34",
}
pal(PAL)
include("../lib/text.js")

const IW = 23, IH = 47, X0 = 11           // inside the outline: 25x49 with it, the middle column 11 (12 with the outline)
const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

/** the slippers: standing side by side; a step: SE the front one forward (right, a row lower), NE forward (right, a row higher) */
function feet(c, view, step, way) {
  const x = X0, se = view === "se", R = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  // the ankles (A) or the shins (B) under the hem
  const top = way === "A" ? 43 : 41
  if (!step) { R(x - 3, top, 2, 44 - top, "t"); R(x + 1, top, 2, 44 - top, "S"); R(x - 5, 44, 5, 3, "u"); R(x + 1, 44, 5, 3, "u"); R(x - 5, 46, 5, 1, "U"); R(x + 1, 46, 5, 1, "U") }
  else if (se) { R(x - 4, top - 1, 2, 44 - top, "t"); R(x + 2, top, 2, 45 - top, "S"); R(x - 6, 43, 5, 3, "u"); R(x - 6, 45, 5, 1, "U"); R(x + 1, 44, 6, 3, "u"); R(x + 1, 46, 6, 1, "U") }
  else { R(x - 4, top, 2, 45 - top, "t"); R(x + 2, top - 1, 2, 44 - top, "S"); R(x - 6, 44, 5, 3, "u"); R(x - 6, 46, 5, 1, "U"); R(x + 1, 43, 5, 3, "u"); R(x + 1, 45, 5, 1, "U") }
}

/** the gown: A to the ankles, B (kimono) to the knees over the nightdress; the hem leans back a pixel in a step */
function gown(c, view, step, way) {
  const x = X0, se = view === "se", A = way === "A", hem = A ? 42 : 33, lean = step ? (se ? -1 : 1) : 0
  if (!A) for (let r = 34; r <= 40; r++) { const half = 5; c.rect(x - half + lean, r, half * 2 + 1, 1, "n"); c.px(x - half + lean, r, "N"); if (r === 40) c.hline(x - half + lean, r, half * 2 + 1, "N") }
  for (let r = 11; r <= hem; r++) {
    // round, sloping shoulders, then the skirt widening to the hem (A more: a long gown flares)
    const half = r === 11 ? 3 : r === 12 ? 5 : 5 + Math.round((r - 13) * (A ? 2 : 1) / (hem - 13)), sh = r > hem - 6 ? lean : 0
    c.rect(x - half + sh, r, half * 2 + 1, 1, "p")
    c.px(x - half + sh, r, "q")                                                     // the side away from the light
    if (r === hem) c.rect(x - half + sh, r, half * 2 + 1, 1, "Q")
  }
  if (se) {
    // the front: the collar's V (A a wide shawl collar, lit; B the kimono's band), the wrap crossing to the right hip
    if (A) { g(c, x - 3, 11, ["PP...PP", "PPP.PPP", ".PP.PP.", "..PPP..", "...P..."]); c.line(x, 16, x + 3, 23, "q") }
    else { g(c, x - 3, 11, ["qq...qq", ".qq.qq.", "..qqq.."]); c.line(x, 14, x + 3, 21, "Q") }
    c.px(x - 1, 11, "S"); c.px(x, 11, "S"); c.px(x + 1, 11, "S"); c.px(x, 12, "S")           // the throat in the V
    // the belt (A) and its ends hanging; the sash (B), its bow at the side
    if (A) { c.hline(x - 5, 24, 11, "q"); c.vline(x - 2, 25, 6, "q"); c.vline(x - 1, 25, 4, "Q"); c.vline(x + 3, 25, 17, "q") }
    else { c.rect(x - 5, 22, 11, 2, "Q"); c.rect(x + 3, 24, 2, 3, "Q") }
  } else {
    // the back: the collar round the neck, the belt, a fold down the back
    c.hline(x - 2, 11, 5, A ? "P" : "q")
    if (A) { c.hline(x - 5, 24, 11, "q"); c.vline(x, 25, 17, "q") } else { c.rect(x - 5, 22, 11, 2, "Q"); c.vline(x, 24, 9, "q") }
  }
}

/** the arms hanging straight at her sides, the hands limp; B's sleeves wide and open */
function arms(c, view, way) {
  const x = X0, A = way === "A"
  if (A) {
    c.rect(x - 7, 14, 2, 12, "q"); c.rect(x + 6, 14, 2, 12, "p")                  // from row 14: the shoulders slope (row 12 goes)
    c.rect(x - 7, 25, 2, 2, "P"); c.rect(x + 6, 25, 2, 2, "P")                    // the turned-back cuffs
    c.rect(x - 7, 27, 2, 3, "t"); c.rect(x + 6, 27, 2, 3, "S")                    // the hands, the fingers down
  } else {
    // the kimono sleeves: close at the shoulder, opening wide below the elbow, hanging over the hands' tops
    c.rect(x - 7, 14, 2, 7, "q"); c.rect(x + 6, 14, 2, 7, "p")
    c.rect(x - 8, 20, 3, 7, "q"); c.rect(x + 6, 20, 3, 7, "p"); c.hline(x - 8, 26, 3, "Q"); c.hline(x + 6, 26, 3, "q")
    c.rect(x - 7, 27, 2, 3, "t"); c.rect(x + 6, 27, 2, 3, "S")
  }
}

/** the Lull patch: lullPatch's small disc (3x4): rim, the bright stripe, the pale disc */
function lull(c, x, y) { g(c, x, y, [".l.", "lLl", "lml", ".l."]) }

/** the head, bowed a little (asleep): A curlers under a net, B loose grey hair; the eyes shut */
function head(c, view, way) {
  const x = X0, se = view === "se", A = way === "A", hx = x + (se ? 1 : 0), hy = 6
  if (se) {
    // her face toward the lower right: soft and long, the lids shut and curved down, the cheek rosy, the mouth a little open
    c.ellipse(hx, hy, 4, 5, "S")
    c.ellipse(hx + 1, hy + 1, 3, 4, "s")
    c.px(hx + 4, hy + 1, "s"); c.px(hx + 4, hy + 2, "s")                            // the nose's side, the face leaning forward
    c.hline(hx, hy + 1, 2, "T"); c.px(hx + 3, hy + 1, "T")                         // the shut lids
    c.px(hx + 1, hy + 3, "c"); c.px(hx - 1, hy + 2, "c")                           // the cheeks
    c.px(hx + 2, hy + 4, "T")                                                       // the mouth, fallen open
    if (A) {
      // grey hair at the back and the temples under the net; the curlers in a row over the top, blue, pink, cream
      c.rect(hx - 4, hy - 2, 3, 7, "G"); c.rect(hx - 5, hy - 1, 1, 5, "h"); c.vline(hx - 2, hy - 2, 2, "G")
      g(c, hx - 4, hy - 6, [".bb.rr.ee", "bbbrrreeeb", "hbhhrhheh.", "..hhhhhh.."])
    } else {
      // loose grey hair: over the crown and down the back of her head to the shoulders, one strand standing up
      c.rect(hx - 4, hy - 5, 7, 2, "G"); c.rect(hx - 3, hy - 6, 5, 1, "G"); c.rect(hx - 5, hy - 3, 4, 10, "G"); c.rect(hx - 6, hy - 1, 1, 9, "h")
      c.rect(hx - 1, hy - 3, 3, 1, "G"); c.px(hx + 2, hy - 4, "g"); c.px(hx + 3, hy - 3, "G"); c.px(hx - 1, hy - 7, "g"); c.px(hx - 5, hy - 4, "g")
    }
    c.px(hx - 2, hy + 1, "t"); c.px(hx - 2, hy + 2, "t")                           // the ear
    lull(c, hx - 5, hy + 1)                                                         // the patch behind it, the ear left free
  } else {
    // from behind: the back of her head, the ears at the sides, the patch behind the near (right) one, on the edge
    c.ellipse(hx, hy, 4, 5, "G"); c.rect(hx - 4, hy - 1, 2, 5, "h")
    c.px(hx - 5, hy + 1, "t"); c.px(hx + 4, hy + 1, "S"); c.px(hx + 4, hy + 2, "S")   // the ears
    if (A) {
      g(c, hx - 4, hy - 6, [".ee.rr.bb", "beeerrrbbb", "hhehhrhbh.", "..hhhhhh.."])
      for (const r of [hy, hy + 2]) for (let i = r % 4 ? 0 : 1; i < 7; i += 2) c.px(hx - 3 + i, r, "h")   // the net's mesh
    } else {
      c.rect(hx - 3, hy - 6, 6, 1, "G"); c.rect(hx - 5, hy - 1, 10, 9, "G"); c.rect(hx - 5, hy, 1, 8, "h"); c.hline(hx - 4, hy + 8, 9, "h")
      c.px(hx, hy - 7, "g"); c.px(hx + 4, hy - 4, "g")
    }
    lull(c, hx + 1, hy + 1)                                                         // behind the near ear (hx + 4), the ear left free
  }
}

/** Frau Haldane in one view ("se" | "ne"), way "A" | "B", standing or in a step */
function haldane(c, view, way, step) {
  feet(c, view, step, way)
  gown(c, view, step, way)
  arms(c, view, way)
  head(c, view, way)
  // 47 px with the outline, as Juno's 50 are hers with it (1.57 m): two rows out, so the drawing above keeps its numbers. The shoulders' second
  // row goes (the head sinks on to them and a pixel forward: asleep on her feet, the neck gone) and one of the skirt's below the hands.
  // The two top rows are left clear; the feet stay on the bottom row.
  c.warp((x, y) => (y < 14 ? [1, 2] : y < 32 ? [0, 1] : false))
}

const POSES = [["se", "se", false], ["sestep", "se", true], ["ne", "ne", false], ["nestep", "ne", true]]
for (const way of ["a", "b"]) for (const [name, view, step] of POSES)
  sprite(`haldane_blocks_${way}_${name}`, { w: IW, h: IH, outline: "k", pivot: "bottom" }, (c) => haldane(c, view, way.toUpperCase(), step))

// ---- the papers: an iso box (u down-right 2:1, v down-left), drawn from its back corner
/** fill the footprint u in [0, a), v in [0, b) whose back corner is at (bx, by) */
function foot(c, bx, by, a, b, key) {
  for (let py = by - 1; py <= by + a + b + 1; py++) for (let px = bx - 2 * b - 2; px <= bx + 2 * a + 2; px++) {
    const dx = (px + 0.5 - bx) / 2, dy = py + 0.5 - by, u = (dx + dy) / 2, v = (dy - dx) / 2
    if (u >= 0 && u < a && v >= 0 && v < b) c.px(px, py, typeof key === "function" ? key(u, v, px) : key)
  }
}
const PW = 16, PH = 10
/** A the tied bundle, B the loose stack; the bottom-centre at (8, 9) */
function papers(c, way) {
  const bx = 8, by = 0
  if (way === "A") {
    // four papers folded, 3 px high: the sides (left darker), the top, the twine crossed, the masthead's band along the back-left edge
    for (let z = 0; z < 3; z++) foot(c, bx, by + 3 - z, 4, 3.5, (u, v, px) => (px < bx + 1 ? "W" : "X"))
    for (let z = 0; z < 3; z++) c.px(bx + 1, by + 7 - z + 1, "y")
    foot(c, bx, by, 4, 3.5, (u, v) => (Math.abs(u - 2) < 0.3 || Math.abs(v - 1.75) < 0.3 ? "y" : v < 0.6 ? "x" : u > 3.4 ? "W" : "w"))
    c.px(bx - 1, by + 4, "Y"); c.px(bx, by + 4, "Y")                               // the knot
  } else {
    // the lower paper, then the top one shifted and askew (a smaller footprint further left), its corner lifted pale
    foot(c, bx + 1, by + 2, 4, 3.5, (u, v, px) => (u > 3.4 || v > 3 ? "W" : "w"))
    foot(c, bx - 1, by, 3.6, 3.2, (u, v) => (v < 0.6 ? "x" : u > 3 ? "W" : Math.abs(u - 1.8) < 0.25 ? "X" : "w"))
    c.px(bx + 5, by + 3, "w"); c.px(bx + 6, by + 3, "w"); c.px(bx + 6, by + 2, "w")   // the lifted corner
  }
}
for (const way of ["a", "b"]) sprite(`papers_blocks_${way}`, { w: PW, h: PH, pivot: "bottom" }, (c) => papers(c, way.toUpperCase()))

// ---- the sheet
// Juno's real street sprites (hood up, as on the landing), the first frames of the built idles
sprite("_hb_juno_se", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50], pivot: "bottom" })
sprite("_hb_juno_ne", { png: "../../build/art/characters/anims/juno_idle_ne.png", area: [0, 0, 27, 50], pivot: "bottom" })
const SIL = Object.fromEntries(Object.keys(PAL).map((k) => [k, "k"]))
for (const way of ["a", "b"]) for (const [name] of POSES) sprite(`_hb_sil_${way}_${name}`, { base: `haldane_blocks_${way}_${name}`, swap: SIL })

const SW = 352, SH = 150, FY = 70, SY = 144
scene("haldane_blocks", { w: SW, h: SH, bg: "3" }, (c) => {
  c.rect(0, FY, SW, 6, "2"); c.rect(0, 76, SW, 74, "5"); c.rect(0, SY, SW, 6, "4")
  c.stamp("_hb_juno_se", 16, FY); c.stamp("_hb_juno_ne", 42, FY)
  TXT.draw(c, 29, 3, "JUNO", "7", { font: "hud", align: "center" })
  c.vline(56, FY - 50, 50, "y"); c.vline(58, FY - 47, 47, "P")                      // 50 and 47 px
  // NE is never seen as itself: the engine shows it mirrored on her way back (NW), so NW and its step stand beside it
  const col = (way, i) => (way === "a" ? 76 : 194) + i * 22
  const shots = [["se", false, "SE"], ["sestep", false, "STEP"], ["ne", false, "NE"], ["ne", true, "NW"], ["nestep", true, "STEP"]]
  for (const way of ["a", "b"]) {
    TXT.draw(c, col(way, 0) + 44, 3, way.toUpperCase(), "7", { font: "hud", align: "center" })
    shots.forEach(([n, flip, lab], i) => {
      TXT.draw(c, col(way, i), 11, lab, "6", { font: "hud", align: "center" })
      c.stamp(`haldane_blocks_${way}_${n}`, col(way, i), FY, { flip: flip ? "x" : undefined })
      c.stamp(`_hb_sil_${way}_${n}`, col(way, i), SY, { flip: flip ? "x" : undefined })
    })
  }
  // the papers: A tied, B loose, on the floor line
  TXT.draw(c, 328, 3, "PAPERS", "7", { font: "hud", align: "center" })
  TXT.draw(c, 318, 50, "A", "6", { font: "hud", align: "center" }); TXT.draw(c, 338, 50, "B", "6", { font: "hud", align: "center" })
  c.stamp("papers_blocks_a", 318, FY - 1); c.stamp("papers_blocks_b", 338, FY - 1)
})

// ---- in the room: the 14th floor as the game shows it (Juno at Frau Haldane's door, the camera scrolled by 32, as cam14's shift), and
// CAM 14 (the feed at 01:15, before she comes; its clock and buttons from 02:30). The mat AC.mat = (187, 135) on the screen in both.
sprite("_hb_k14", { png: "../../build/blocks/haldane/k14c_1x.png" })
sprite("_hb_cam14", { png: "../../build/blocks/haldane/cam14_base_1x.png" })
const hexOf = (v) => [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16))
const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")
// the landing's light on an actor (its ambient 0.78 in #e8f4ec, the tube's green from above): about this
const LIT = (v) => toHex(hexOf(v).map((ch, i) => ch * [0.84, 0.9, 0.85][i]))
// the feed: exposure 2.2 (clamped), the brightness (77 r + 150 g + 29 b) / 256, the nearest of the ten phosphor steps
const PHOS = ["#030a0a", "#071514", "#0c221f", "#12332d", "#1a483e", "#266252", "#388169", "#55a585", "#8acfae", "#d4f7e2"]
const FEED = (v) => { const [r, gg, b] = hexOf(v).map((ch) => Math.min(255, ch * 2.2)); return PHOS[Math.round(((77 * r + 150 * gg + 29 * b) / 256) / 255 * 9)] }
const SWAP = (f) => Object.fromEntries(Object.entries(PAL).map(([k, v]) => [k, f(v)]))
for (const way of ["a", "b"]) {
  sprite(`_hb_lit_${way}`, { base: `haldane_blocks_${way}_se`, swap: SWAP(LIT) })
  sprite(`_hb_feed_${way}`, { base: `haldane_blocks_${way}_sestep`, swap: SWAP(FEED) })
  sprite(`_hb_plit_${way}`, { base: `papers_blocks_${way}`, swap: SWAP(LIT) })
  sprite(`_hb_pfeed_${way}`, { base: `papers_blocks_${way}`, swap: SWAP(FEED) })
}
// The papers' place in the game (AC.mat + [8, -1]) lies behind the rail's left post, which hides all but a sliver of them: shown here left
// of her instead, on the open floor in front of the lift's mat (a proposal: AC.mat + [-12, 2])
const MAT = [187, 135], PAPERS = [MAT[0] - 12, MAT[1] + 2]
scene("haldane_blocks_im_raum", { w: 640, h: 360, bg: "k" }, (c) => {
  ;["a", "b"].forEach((way, i) => {
    const ox = i * 320
    c.stamp("_hb_k14", ox, 0); c.stamp(`_hb_plit_${way}`, ox + PAPERS[0], PAPERS[1]); c.stamp(`_hb_lit_${way}`, ox + MAT[0], MAT[1])
    c.stamp("_hb_cam14", ox, 180); c.stamp(`_hb_pfeed_${way}`, ox + PAPERS[0], 180 + PAPERS[1]); c.stamp(`_hb_feed_${way}`, ox + MAT[0], 180 + MAT[1])
    TXT.draw(c, ox + 160, 4, way.toUpperCase(), "g", { font: "hud", outline: "k" })
  })
  c.vline(320, 0, 360, "k"); c.hline(0, 180, 640, "k")
})
