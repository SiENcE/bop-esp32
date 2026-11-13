// Frau Haldane (story §4: the neighbour from 14C, always on Lull, always tired, friendly), painted on the lines of the approved block,
// variant A (art/test/haldane_blocks.px.js, docs/characters/haldane_blocks_x4.png; the user's choice, 2026-11-13): curlers under a
// grey net, the long quilted pink dressing gown (her colour) with a shawl collar, the belt tied and its ends hanging, turned-back cuffs,
// cream slippers; asleep on her feet: the eyes shut, the arms hanging, the head sunk on to her shoulders and a pixel forward. The Lull
// patch behind her left ear (the small lullPatch of art/portraits/portraits.px.js: the oval pale disc, its darker rim, a brighter stripe;
// on the ear SE and NE turn to us, as Teo's).
//
// She is only ever seen walking in CAM 14 (game/stadt.js, haldane_feed: 02:30 to 02:45 on days 2 and 3, AC.door -> AC.mat -> AC.door at
// speed [8, 4]): the 14th floor's own picture under the feed's filter, at exposure 2.2. So her tones are those of the landing at night
// in the tube's light, deep for their hue: the gown's five pinks fall on the phosphor's steps 8, 7, 6, 5 and 3, the belt and the folds
// stay dark against it, the curlers and the face are the brightest, the net and the grey hair between them darker (checked in
// art/characters/haldane_review.px.js, the feed composite at the real exposure).
//
//   haldane_idle_se / haldane_walk_se     front three-quarter, facing down-right
//   haldane_idle_ne / haldane_walk_ne     back three-quarter, facing up-right
//   haldane_idle_nw / haldane_walk_nw     drawn (the user's decision): the NE mirrored, but lit from the upper left as the others, and
//                                         without the patch (her left ear is behind her head from there; the engine's mirror would put
//                                         the patch behind her right one)
//   haldane_papers                        the tied bundle of NINTH HERALD (block A) at the head of the stairs, an iso prop, 16x10
// Every figure frame is 25x49 with the outline: pivot bottom-centre (column 12), the slippers' outline on the bottom row. Idle: 4 frames,
// a slow sway (the head lolls a pixel and nods), the patch's stripe on the beat. Walk: 4 frames x 250 ms, a sleepwalker's shuffle: the
// slippers slide (one forward a pixel across and a row, the other back), never lifted, the body never bobs, the arms hang; two steps
// cover 8 px across and 4 down or up the picture, her [8, 4] a second. The geometry is the block's own (the same rects, rows and the
// same warp that sinks her head), the painting only adds to it.
"use strict"

const HALDANE_PAL = {
  k: "#0c0e1a",
  // the gown: the collar and cuffs' trim, lit, base, dim, deep (pink, deep for the feed: steps 8 7 6 5 3 at exposure 2.2)
  A: "#c46098", P: "#a84c80", p: "#883c68", q: "#642c50", Q: "#401a36",
  // skin (lit, base, shade), the lids and mouth, the cheeks
  s: "#e8b8a8", S: "#c89080", t: "#9a6460", T: "#5a3434", c: "#d88078",
  // grey hair (light, base) and the net
  g: "#5e6476", G: "#464a5c", h: "#2e3242",
  // the curlers (blue, pink, cream); the Lull patch (rim, stripe, disc: lullPatch's own); the slippers (fluff, cream, shade)
  b: "#7aa8c8", r: "#b8688c", e: "#d8cca8", l: "#3d6690", L: "#dafcff", m: "#c8e8ff", v: "#f0e6d2", u: "#d0c4ac", U: "#5c5448",
  // the papers: newsprint (top, the lit side, the shaded side), the masthead, the twine and its knot
  w: "#6e6a60", W: "#4e4c46", X: "#3a3a36", x: "#2a2c38", y: "#6a4420", Y: "#3e2810",
}
pal(HALDANE_PAL)

const HIW = 23, HIH = 47, HX = 11
const hg = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

/** pose: view "se" | "ne"; mir draws the light from the right (the NW is this, flipped); step 0 standing, 1 her screen-right foot
 *  forward, 2 the screen-left one; lean the hem's trail; hdx, hdy the head's sway; beat the patch's stripe bright; patch drawn or not */

/** the slippers: fluff on top, a cream body, the sole's shade; the toe toward the light a little brighter */
function slipper(c, x, y, w, litLeft) {
  for (let i = 0; i < w; i++) c.px(x + i, y, i % 2 ? "u" : "v")
  c.rect(x, y + 1, w, 1, "u"); c.px(litLeft ? x : x + w - 1, y + 1, "v")
  c.rect(x, y + 2, w, 1, "U")
}

/** the ankles under the hem and the slippers: the block's places, the second step its counterpart */
function hFeet(c, o) {
  const x = HX, se = o.view === "se", R = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  const lit = (left) => left !== o.mir, ank = (left) => (lit(left) ? "S" : "t")
  const pair = (L, Rt, backFirst) => {
    // [ankleX, ankleY, ankleH, slipX, slipY, slipW]; the foot further back drawn first, the nearer one over it
    const draw = (f, left) => { R(f[0], f[1], 2, f[2], ank(left)); slipper(c, f[3], f[4], f[5], !o.mir) }
    if (backFirst === "L") { draw(L, true); draw(Rt, false) } else { draw(Rt, false); draw(L, true) }
  }
  if (!o.step) pair([x - 3, 43, 1, x - 5, 44, 5], [x + 1, 43, 1, x + 1, 44, 5], "L")
  else if (se && o.step === 1) pair([x - 4, 42, 1, x - 6, 43, 5], [x + 2, 43, 2, x + 1, 44, 6], "L")
  else if (se) pair([x - 3, 43, 1, x - 4, 44, 6], [x + 1, 42, 1, x, 43, 5], "R")
  else if (o.step === 1) pair([x - 4, 43, 2, x - 6, 44, 5], [x + 2, 42, 1, x + 1, 43, 5], "R")
  else pair([x - 3, 42, 1, x - 4, 43, 5], [x + 1, 43, 1, x, 44, 5], "L")
}

/** the gown to the ankles: the block's rows and widths, lit from the upper left, quilted, a fold or two in the skirt */
function hGown(c, o) {
  const x = HX, se = o.view === "se", hem = 42, lean = o.lean || 0
  const litL = !o.mir
  for (let r = 11; r <= hem; r++) {
    const half = r === 11 ? 3 : r === 12 ? 5 : 5 + Math.round((r - 13) * 2 / (hem - 13)), sh = r > hem - 6 ? lean : 0
    const a = x - half + sh, w = half * 2 + 1
    c.rect(a, r, w, 1, "p")
    // the quilting: stitched dots in a diamond lattice, a shade darker than the cloth they sit in
    for (let i = 1; i < w - 1; i++) {
      const xx = a + i
      if (r > 13 && r < hem - 1 && r !== 24 && ((xx % 6 === 1 && r % 6 === 1) || (xx % 6 === 4 && r % 6 === 4))) c.px(xx, r, "q")
    }
    // the lit side two pixels, the far side one in shade and a second below the waist
    const lx = litL ? a : a + w - 1, dx = litL ? a + w - 1 : a, step = litL ? 1 : -1
    c.px(lx, r, "P"); if (r > 12) c.px(lx + step, r, "P")
    c.px(dx, r, "q"); if (r > 24) c.px(dx - step, r, "q")
    if (r === hem) { c.rect(a, r, w, 1, "Q"); c.px(lx, r, "q"); c.px(lx + step, r, "q") }
  }
  // two soft folds down the skirt, deepening toward the hem
  for (const [fx, from] of [[x - 3, 32], [x + 5, 30]]) for (let r = from; r < hem - 1; r++) c.px(fx + (r > hem - 6 ? lean : 0), r, r > 37 ? "Q" : "q")
  if (se) {
    // the shawl collar, its trim lit, its inner edge in shade; the throat in the V
    hg(c, x - 3, 11, ["AA...AA", "AAA.AAA", ".AA.AA.", "..AAA..", "...A..."])
    c.px(x - 1, 12, "q"); c.px(x + 1, 12, "q"); c.px(x - 1, 13, "q"); c.px(x + 1, 13, "q"); c.px(x, 15, "q")
    c.px(x - 1, 11, "S"); c.px(x, 11, "S"); c.px(x + 1, 11, "S"); c.px(x, 12, "s")
    // the wrap crossing to the right hip and down to the hem as the front's edge
    c.line(x, 16, x + 3, 23, "Q")
    for (let r = 25; r < hem; r++) c.px(x + 3 + (r > hem - 6 ? lean : 0), r, "q")
    // a patch pocket on the right hip, its top hemmed
    c.hline(x + 4, 27, 2, "Q"); c.vline(x + 4, 28, 3, "q")
    // the belt, the knot at the front and its two ends hanging, swinging a pixel behind a step
    const sw = o.swing || 0
    c.hline(x - 5, 24, 11, "Q"); c.px(x - 2, 23, "Q"); c.px(x - 1, 24, "q")
    c.vline(x - 2 + sw, 25, 6, "Q"); c.vline(x - 1 + sw, 25, 4, "q"); c.px(x - 2 + sw, 30, "q")
  } else {
    // the back: the collar round the neck, the belt through its loops, the seam down the back
    c.hline(x - 2, 11, 5, "A"); c.px(litL ? x + 2 : x - 2, 11, "P")
    c.hline(x - 5, 24, 11, "Q"); c.px(x - 3, 23, "q"); c.px(x + 3, 23, "q")
    c.vline(x, 12, 11, "q")
    for (let r = 25; r < hem; r++) c.px(x + (r > hem - 6 ? lean : 0), r, r > 30 ? "Q" : "q")
  }
}

/** the arms hanging straight at her sides, the cuffs turned back, the hands limp */
function hArms(c, o) {
  const x = HX, litL = !o.mir
  const arm = (ax, lit) => {
    const outer = ax === x - 7 ? ax : ax + 1, inner = ax === x - 7 ? ax + 1 : ax
    c.rect(ax, 14, 2, 11, lit ? "p" : "q"); c.vline(outer, 14, 11, lit ? "P" : "Q")
    c.vline(inner, 22, 3, lit ? "q" : "Q")                                          // the elbow's crease
    c.rect(ax, 25, 2, 2, lit ? "A" : "P"); c.px(inner, 26, lit ? "P" : "q")         // the cuff
    c.rect(ax, 27, 2, 3, lit ? "S" : "t"); c.px(outer, 27, lit ? "s" : "S"); c.px(inner, 29, lit ? "t" : "T")   // the hand, fingers down
  }
  arm(x - 7, litL); arm(x + 6, !litL)
}

/** the Lull patch: lullPatch's small disc (3x4): rim, the bright stripe (on the beat), the pale disc */
function hLull(c, x, y, beat) { hg(c, x, y, [".l.", beat ? "lLl" : "lml", "lml", ".l."]) }

/** the head, bowed: curlers under the net, grey hair at the temples and nape; the eyes shut */
function hHead(c, o) {
  const x = HX, se = o.view === "se", litL = !o.mir, hx = x + (se ? 1 : 0) + (o.hdx || 0), hy = 6 + (o.hdy || 0)
  if (se) {
    // her face toward the lower right: soft and long, lit on the brow, the lids shut and heavy, the mouth fallen a little open
    c.ellipse(hx, hy, 4, 5, "S")
    c.ellipse(hx, hy - 1, 3, 3, "s")
    c.px(hx + 4, hy + 1, "s"); c.px(hx + 4, hy + 2, "S"); c.px(hx + 3, hy + 3, "t")  // the nose leaning forward, its shadow
    c.hline(hx, hy + 1, 2, "T"); c.px(hx + 3, hy + 1, "T")                         // the shut lids
    c.px(hx, hy + 2, "t"); c.px(hx + 3, hy + 2, "S")                                // the tired bag under them
    c.px(hx + 1, hy + 3, "c"); c.px(hx - 1, hy + 3, "c")                           // the cheeks
    c.px(hx + 2, hy + 4, "T"); c.px(hx + 1, hy + 5, "t"); c.px(hx + 2, hy + 5, "t") // the open mouth, the chin's shade
    // grey hair at the back and the temple under the net, lit on its crown; the curlers in a row over the top, the net over them
    c.rect(hx - 4, hy - 2, 3, 7, "G"); c.rect(hx - 5, hy - 1, 1, 5, "G"); c.vline(hx - 2, hy - 2, 2, "G")
    c.vline(hx - 4, hy - 2, 3, "g"); c.px(hx - 5, hy - 1, "g")
    for (const [i, j] of [[-3, 0], [-5, 1], [-4, 2], [-3, 4], [-5, 3]]) c.px(hx + i, hy + j, "h")   // the net's mesh
    hg(c, hx - 4, hy - 6, [".bb.rr.ee", "bbbrrreeeb", "hbhhrhheh.", "..hhhhhh.."])
    c.px(hx - 3, hy - 6, "e"); c.px(hx + 1, hy - 6, "e")                           // their light on top
    c.px(hx - 2, hy + 1, "S"); c.px(hx - 2, hy + 2, "t")                           // the ear
    if (o.patch) hLull(c, hx - 5, hy + 1, o.beat)                                  // the patch behind it, the ear left free
  } else {
    // from behind: the back of her head under the net, lit on the side toward the light, the ears at the sides
    c.ellipse(hx, hy, 4, 5, "G"); c.rect(litL ? hx + 2 : hx - 4, hy - 1, 2, 5, "h")
    c.rect(litL ? hx - 3 : hx + 2, hy - 1, 2, 3, "g")
    c.hline(hx - 2, hy + 5, 5, "h")                                                 // the nape's short hair
    c.px(hx - 5, hy + 1, litL ? "S" : "t"); c.px(hx + 4, hy + 1, litL ? "t" : "S"); c.px(hx + 4, hy + 2, litL ? "t" : "S")   // the ears
    hg(c, hx - 4, hy - 6, [".ee.rr.bb", "beeerrrbbb", "hhehhrhbh.", "..hhhhhh.."])
    for (const r of [hy, hy + 2]) for (let i = r % 4 ? 0 : 1; i < 7; i += 2) c.px(hx - 3 + i, r, "h")   // the net's mesh
    if (o.patch) hLull(c, hx + 1, hy + 1, o.beat)                                  // behind the near ear (hx + 4), the ear left free
  }
}

/** Frau Haldane in one pose: the block's order, then its warp (the head sunk on to the shoulders, 47 px with the outline) */
function haldane(c, o) {
  hFeet(c, o)
  hGown(c, o)
  hArms(c, o)
  hHead(c, o)
  c.warp((x, y) => (y < 14 ? [1, 2] : y < 32 ? [0, 1] : false))
}

// idle: the head lolls a pixel, comes back, nods; the patch's stripe bright on the beat
const H_IDLE = [{ beat: true }, { hdx: 1 }, { beat: true }, { hdy: 1 }]
// walk: a slipper slides forward, the feet pass (standing), the other slides; the hem trails, the belt's ends a pixel behind
const H_WALK = [{ step: 1, swing: -1, beat: true }, { beat: true }, { step: 2, swing: -1 }, {}]

for (const [dir, view, mir] of [["se", "se", false], ["ne", "ne", false], ["nw", "ne", true]]) {
  const base = { view, mir, patch: dir !== "nw" }
  const lean = view === "se" ? -1 : 1
  const opts = (more) => ({ w: HIW, h: HIH, outline: "k", pivot: "bottom", ...(mir ? { flip: "x" } : {}), ...more })
  anim(`haldane_idle_${dir}`, opts({ frames: 4, ms: [1100, 900, 1000, 1000] }), (c) => haldane(c, { ...base, ...H_IDLE[c.frame] }))
  anim(`haldane_walk_${dir}`, opts({ frames: 4, ms: [250, 250, 250, 250] }),
    (c) => { const f = H_WALK[c.frame]; haldane(c, { ...base, ...f, lean: f.step ? lean : 0 }) })
}

// ---- the papers (block A): four NINTH HERALDs folded and tied, the twine crossed over them, the masthead's dark band along the
// back-left edge; an iso box (u down-right 2:1, v down-left) drawn from its back corner, bottom-centre at (8, 9)
/** fill the footprint u in [0, a), v in [0, b) whose back corner is at (bx, by) */
function hFoot(c, bx, by, a, b, key) {
  for (let py = by - 1; py <= by + a + b + 1; py++) for (let px = bx - 2 * b - 2; px <= bx + 2 * a + 2; px++) {
    const dx = (px + 0.5 - bx) / 2, dy = py + 0.5 - by, u = (dx + dy) / 2, v = (dy - dx) / 2
    if (u >= 0 && u < a && v >= 0 && v < b) c.px(px, py, typeof key === "function" ? key(u, v, px) : key)
  }
}
sprite("haldane_papers", { w: 16, h: 10, pivot: "bottom" }, (c) => {
  const bx = 8, by = 0
  // the stack's sides: the left lit, the right in shade, the folds' edges a line between the papers
  for (let z = 0; z < 3; z++) hFoot(c, bx, by + 3 - z, 4, 3.5, (u, v, px) => (px < bx + 1 ? (z === 1 ? "X" : "W") : z === 1 ? "x" : "X"))
  for (let z = 0; z < 3; z++) c.px(bx + 1, by + 7 - z + 1, "y")                     // the twine down the front corner
  hFoot(c, bx, by, 4, 3.5, (u, v) => (Math.abs(u - 2) < 0.3 || Math.abs(v - 1.75) < 0.3 ? "y" : v < 0.6 ? "x" : u > 3.4 ? "W" : "w"))
  c.px(bx - 1, by + 4, "Y"); c.px(bx, by + 4, "Y")                                 // the knot
})
