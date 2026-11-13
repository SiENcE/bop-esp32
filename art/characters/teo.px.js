// Teo Reyes, Juno's younger brother (story §4: a Tideboy in the pump hall, double shifts, now on Lull), painted on the lines of
// the approved block, variant A of art/test/teo_blocks.px.js (docs/characters/teo_blocks_x4.png): 52 px, the orange work vest with
// its reflective stripe over the navy shirt, the ear defenders round his neck (the cups on the collarbones, the band behind the
// neck), the tide mod's gills glowing on the neck, the Lull patch behind his left ear, dark work trousers, rubber boots. Face and
// hair after his portrait (docs/portraits/teo_x4.png) at this scale: messy black hair with a blue sheen, dark brows, eyes two rows.
//
// Street mode (iso 2:1), three drawn views:
//   teo_idle_se / teo_walk_se / teo_talk_se              front three-quarter, facing down-right
//   teo_idle_ne / teo_walk_ne / teo_talk_ne              back three-quarter, facing up-right, the patch at the head's right edge
//   teo_idle_nw / teo_walk_nw / teo_talk_nw              NE mirrored and drawn without the patch: from there his left ear is
//                                                        behind his head (the engine's own mirror would put it behind the right)
//   teo_bowl_idle_se / teo_bowl_walk_se / teo_bowl_talk_se   SE with Bao's broth in both hands (the white to-go bowl, its lid)
// Every frame is 25x52: pivot bottom-centre (column 12), the soles' outline on the bottom row; the outline is the anim's own (ink k).
// The walk is Juno's (art/characters/juno.px.js): 8 px across and 4 up a step at 100 ms a frame, the planted foot rising a row for
// every 2 px it slides back along the floor's 2:1 line. Light from the upper left (NW, a mirror, takes it from the upper right,
// as Juno's mirrored views do).
//
// The Lull patch follows the beat every Lull point keeps (style guide §6, Nagiwa.lullBeat: long, short, short, long, a pause in
// 3.6 s): bright in the beat, dimmer between, always the oval disc. So the anims that show it are cut on the beat's edges too:
// idle and talk loop in one beat (3.6 s); the walk keeps it lit (a walk lasts a few steps). NW shows no patch and keeps short loops.
;(() => {

pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a",
  // hair (dark, its light, the blue sheen); skin (lit, mid, shade); the eyes
  h: "#151a28", H: "#273048", J: "#3a4a6c", I: "#c99a8c", i: "#93665c", A: "#583841",
  // the vest (its top light, lit, mid, shade, a seam), the reflective stripe and its shine; the navy shirt (lit, shade)
  Q: "#ffc890", o: "#ffb070", O: "#ffa040", P: "#c07838", p: "#a86428", r: "#b8cce0", n: "#e4f0fa", E: "#4f6584", e: "#2f3e5a",
  // trousers (light, lit, shade), boots (rim, lit, shade); the ear defenders (dark, lit, edge)
  U: "#4a5876", T: "#3a465e", t: "#2a3346", G: "#3e4a62", B: "#2a3240", b: "#161c26", g: "#20283a", F: "#4e5c78", m: "#8e96a8",
  // the gills' glow (and its core); the Lull patch: rim, stripe, disc in the beat (lullPatch's own), stripe and disc between
  v: "#62def0", V: "#b4f6ff", l: "#3d6690", L: "#dafcff", R: "#c8e8ff", Z: "#a6c8e2", Y: "#86a8c8",
  // the bowl: white, its shade, the lid, the lid's light, its knob's shade
  W: "#f0f0e0", w: "#b8b8a8", q: "#9aa0b0", K: "#c4c8d4", s: "#6a7488",
})

// ---------------------------------------------------------------- frame
const IW = 23, IH = 50           // inside the outline: 25x52 with it, the middle column 11 (12 with the outline)
const GROUND = IH - 1            // the soles' last row
const HIP = 30                   // where the legs start, under the belt

/** Drawing on the frame, mirrored for NW (the middle column stays the middle). */
const pen = (c, flip) => {
  const px = (x, y, k) => { if (x >= 0 && x < IW && y >= 0 && y < IH) c.px(flip ? IW - 1 - x : x, y, k) }
  const rect = (x, y, w, h, k) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, k) }
  return {
    px, rect, hl: (x, y, n, k) => rect(x, y, n, 1, k), vl: (x, y, n, k) => rect(x, y, 1, n, k),
    g: (x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") px(x + i, y + j, ch) })),
  }
}

// ---------------------------------------------------------------- legs
// A leg is a band 4 px wide from the hip to the boot, lit on its left, a knee light on the near one; the far leg a step darker.
// Rubber boots to mid-shin, 8 rows: a rim, the shaft, SE the toe a pixel forward on the last two rows (NE seen from behind: none).
const BOOT = {
  se: ["GGGB.", "GBBb.", "BBBb.", "BBBb.", "BBBb.", "BBbb.", "BBBBb", "11111"],
  ne: ["GGGB", "GBBb", "BBBb", "BBBb", "BBBb", "BBbb", "BBBb", "1111"],
}
const LEG_NEAR = "UTTt", LEG_FAR = "Tt22"
const DARKER = { G: "B", B: "b", b: "1", 1: "1" }
const LEG_X = { se: { near: 7, far: 12 }, ne: { near: 12, far: 7 } }

/** feet: { near: { x, dx, gy, lift }, far: {...} }, x = the leg's left column at the hip. */
const legs = (p, view, feet, bob) => {
  const own = new Map()
  const put = (x, y, k, who) => { if (x < 0 || x >= IW || y < 0 || y >= IH) return; p.px(x, y, k); own.set(x + "," + y, who) }
  for (const who of ["far", "near"]) {
    const f = feet[who], cols = who === "near" ? LEG_NEAR : LEG_FAR
    const hipY = HIP + bob, sole = GROUND + f.gy - f.lift, ankleY = sole - 8
    const span = Math.max(1, ankleY - hipY), bend = f.lift >= 2 ? 2 : f.lift ? 1 : 0
    for (let y = hipY; y <= ankleY; y++) {
      const t = (y - hipY) / span, knee = Math.round(Math.sin(Math.PI * t) * bend)   // a swinging leg bends forward
      const x0 = f.x + Math.round(f.dx * t) + knee, r = y - hipY
      for (let i = 0; i < 4; i++) {
        let k = cols[i]
        if (who === "near" && (r === 6 || r === 7) && i === 1) k = "U"               // the knee
        if (r === span && i === 3) k = "2"                                            // the trouser's fold over the boot
        put(x0 + i, y, k, who)
      }
    }
    const bx = f.x + f.dx
    BOOT[view].forEach((row, j) => [...row].forEach((k, i) => {
      if (k !== ".") put(bx + i, sole - 7 + j, who === "far" ? (DARKER[k] ?? k) : k, who)
    }))
  }
  // the near leg in front of the far one: a line of ink on the far leg where they touch
  for (const [pt, who] of own) {
    if (who !== "near") continue
    const [x, y] = pt.split(",").map(Number)
    for (const [ax, ay] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) if (own.get(ax + "," + ay) === "far") p.px(ax, ay, "k")
  }
  // the seat: both legs joined under the belt
  p.hl(7, HIP + bob, 9, "t"); p.hl(7, HIP + bob + 1, 9, "t"); p.hl(7, HIP + bob, 3, "T"); p.px(7, HIP + bob + 1, "T")
}

// ---------------------------------------------------------------- the vest, the belt
const vest = (p, view, b) => {
  const se = view === "se"
  for (let y = 13; y <= 28; y++) {
    const a = y === 13 ? 7 : 6, z = y === 13 ? 15 : 16
    p.hl(a, y + b, z - a + 1, "O"); p.hl(a, y + b, 2, "o"); p.hl(z - 1, y + b, 2, "P")
  }
  p.hl(7, 13 + b, 3, "Q"); p.hl(6, 14 + b, 2, "Q")                                 // the light on the near shoulder
  if (se) {
    p.g(10, 13 + b, ["eEe", ".e."])                                                // the shirt in the V
    p.vl(11, 15 + b, 14, "p"); p.px(11, 16 + b, "m")                                // the zip, its pull
    for (const x of [7, 13]) p.hl(x, 24 + b, 3, "P")                                // the pockets' flaps
  } else {
    p.vl(11, 15 + b, 14, "P")                                                       // the back seam
  }
  p.hl(6, 20 + b, 11, "r"); p.hl(6, 20 + b, 3, "n")                                 // the reflective stripe, its shine on the lit side
  p.px(8, 27 + b, "P"); p.px(14, 26 + b, "p")                                       // creases at the waist
  p.hl(6, 28 + b, 11, "P"); p.px(6, 28 + b, "o")                                    // the hem
  p.hl(6, 29 + b, 11, "b"); p.hl(6, 29 + b, 2, "B")                                 // the belt
  if (se) { p.px(10, 29 + b, "m"); p.px(11, 29 + b, "F") }                          // its buckle
}

// ---------------------------------------------------------------- arms
// The navy shirt's sleeves to the wrist, 2 px; the upper arm 7 rows, the forearm 6 (it swings), the hand 3 (a pixel further).
const arm = (p, x, b, lit, fore, hand) => {
  const [a, z] = lit ? ["E", "E"] : ["e", "3"]
  p.vl(x, 14 + b, 7, a); p.vl(x + 1, 14 + b, 7, z)
  if (lit) { p.px(x, 14 + b, "e"); p.px(x + 1, 20 + b, "e") }                       // the shoulder's round, the fold at the elbow
  p.vl(x + fore, 21 + b, 6, a); p.vl(x + fore + 1, 21 + b, 6, z); p.hl(x + fore, 26 + b, 2, lit ? "e" : "3")  // the cuff
  p.g(x + hand, 27 + b, lit ? ["Ii", "ii", "iA"] : ["ii", "iA", "AA"])
}

/** Bao's bowl in both hands before his belly (the block's pose): the upper arms at his sides, the forearms forward. */
const bowlArms = (p, b) => {
  p.vl(4, 14 + b, 8, "E"); p.vl(5, 14 + b, 8, "E"); p.px(4, 14 + b, "e"); p.px(5, 20 + b, "e")
  p.vl(17, 14 + b, 8, "e"); p.vl(18, 14 + b, 8, "3")
  p.g(4, 22 + b, ["Ee..........e", ".EEe.......3.", "..EEe........"])
  p.g(9, 23 + b, ["Ii", "ii", "iA"]); p.g(16, 21 + b, ["ii", "iA", "AA"])
  // the bowl: white, lit on the left, its shade on the right and below; the lid a little wider, its light, the knob
  p.rect(11, 22 + b, 6, 4, "W"); p.vl(16, 22 + b, 4, "w"); p.vl(15, 23 + b, 2, "w"); p.hl(11, 25 + b, 6, "w"); p.px(16, 25 + b, "q")
  p.rect(10, 20 + b, 8, 2, "q"); p.hl(11, 20 + b, 3, "W"); p.hl(14, 20 + b, 2, "K"); p.hl(10, 21 + b, 8, "s"); p.hl(11, 21 + b, 5, "q")
  p.rect(12, 19 + b, 3, 1, "q"); p.px(12, 19 + b, "K")
}

// ---------------------------------------------------------------- heads (11 wide, at x 6)
// SE: the face to the right, the ear at its left (col 5), the patch behind it; the fringe over the brow, the brows, two-row eyes
// (the near one at col 7, the far one at the cheek's edge, col 10), the mouth at col 9 row 9.
const HEAD_SE = [
  "..h.hJ.h...",
  ".hhJhhHhhh.",
  "hhJHhHhJhhh",
  "hJHhhJhhHHh",
  "hHhhhhhIhhI",
  "hhhhhiIAIIA",
  "hhhhhAIhIIh",
  "hhhhhiIkIIk",
  ".hhhhiIIIiI",
  "..hhhiIIiAI",
  "...hhiiIIi.",
  "....iiiii..",
]
// NE: the back of the head, the left ear at its right edge (cols 9 and 10), the patch at cols 6 to 8 behind it
const HEAD_NE = [
  "...h.hJ.h..",
  ".hhJhhHhhh.",
  "hhJHhhJhHhh",
  "hJHhhhHhhHh",
  "hHhhhJhhhhh",
  "hhhhHhhhhhi",
  "hhhhhhhhhiI",
  "hhhhhhhhhAI",
  ".hhhhhhhhhi",
  "..hhhhhhhh.",
  "...hhhhhh..",
  "....iiiii..",
]

const head = (p, view, hy, o) => {
  if (view === "se") {
    p.g(6, hy, HEAD_SE)
    if (o.blink) for (const ex of [13, 16]) { p.px(ex, 6 + hy, "I"); p.px(ex, 7 + hy, "A") }
    if (o.talk) { p.px(15, 9 + hy, "k"); p.px(15, 10 + hy, "A") }
  } else {
    p.g(6, hy, HEAD_NE)
    if (o.talk) { p.px(16, 9 + hy, "i"); p.px(16, 8 + hy, "I") }                 // the jaw moves: a pixel more cheek
  }
}

/** The neck's gills (the slit, its glow under it) and the ear defenders: the cups on the collarbones, the band behind the neck. */
const neck = (p, view, b) => {
  const L = [".mm.", "mGFg", "mGgg", "GGg1", ".g1."], R = [".mG.", "mGFg", "GGgg", "Gg11", ".11."]
  if (view === "se") {
    p.hl(9, 12 + b, 5, "i"); p.hl(10, 11 + b, 2, "A"); p.g(9, 12 + b, ["vVv"]); p.px(12, 12 + b, "A")
    p.g(5, 10 + b, L); p.g(14, 10 + b, R)
  } else {
    p.hl(9, 12 + b, 5, "i"); p.hl(14, 10 + b, 2, "A"); p.g(13, 11 + b, ["vV"])
    p.hl(8, 12 + b, 7, "g"); p.hl(9, 12 + b, 5, "1")                               // the band across the nape
    p.g(4, 10 + b, L); p.g(15, 10 + b, R)
  }
}

/** The Lull patch behind the left ear: lullPatch's small disc (rim, a bright stripe, the pale disc); dimmer between the beats. */
const lull = (p, view, b, on) => p.g(view === "se" ? 8 : 12, 5 + b, on ? [".l.", "lLl", "lRl", ".l."] : [".l.", "lZl", "lYl", ".l."])

// ---------------------------------------------------------------- the figure
// view "se" | "ne" | "nw"; o: { bob, nod, feet, near, nearHand (the near arm's swing), bowl, blink, talk, lull (true, false;
// undefined: no patch) }
const STAND = { near: { dx: 0, gy: 0, lift: 0 }, far: { dx: 0, gy: 0, lift: 0 } }
const teo = (c, view, o = {}) => {
  const p = pen(c, view === "nw"), v = view === "se" ? "se" : "ne", b = o.bob ?? 0, fe = o.feet ?? STAND
  legs(p, v, { near: { ...fe.near, x: LEG_X[v].near }, far: { ...fe.far, x: LEG_X[v].far } }, b)
  // the far arm behind the vest, the near one in front (SE: the near arm is the left, NE: the right)
  const nearX = v === "se" ? 4 : 17, farX = v === "se" ? 17 : 4, nearLit = v === "se"
  if (!o.bowl) arm(p, farX, b, !nearLit, -(o.near ?? 0), -(o.nearHand ?? 0))
  vest(p, v, b)
  head(p, v, b + (o.nod ?? 0), o)
  if (o.bowl) bowlArms(p, b)
  else arm(p, nearX, b, nearLit, o.near ?? 0, o.nearHand ?? 0)
  neck(p, v, b)
  if (view !== "nw" && o.lull !== undefined) lull(p, v, b, o.lull)
}

// ---------------------------------------------------------------- time: the walk, the beat
const FOOT = [
  { dx: 4, gy: 0, lift: 0 }, { dx: 2, gy: -1, lift: 0 }, { dx: 0, gy: -2, lift: 0 }, { dx: -2, gy: -3, lift: 0 },
  { dx: -4, gy: -4, lift: 0 }, { dx: -2, gy: -3, lift: 2 }, { dx: 0, gy: -2, lift: 3 }, { dx: 2, gy: -1, lift: 1 },
]
const BOB = [1, 2, 1, 0, 1, 2, 1, 0]
const ARM = [-1, -1, -1, 0, 1, 1, 1, 0]
const HAND = [-1, -2, -1, 0, 1, 2, 1, 0]
const FAR_REACH = { se: [1, 0, -1, -2, -3, -2, -1, 0], ne: [3, 2, 1, 0, -1, 0, 1, 2] }
const foot = (v, i, far) => {
  const j = (i + 8) % 8, f = FOOT[j], gy = (v === "se" ? f.gy : -4 - f.gy) - (far ? 1 : 0)
  return { ...f, dx: f.dx + (far ? FAR_REACH[v][j] : 0), gy }
}
const walkPose = (v, i, bowl) => ({
  bowl, bob: BOB[i], near: ARM[i], nearHand: HAND[i], feet: { near: foot(v, i), far: foot(v, i + 4, true) },
})

// Nagiwa.lullBeat: lit 0-800, 1100-1350, 1650-1900, 2200-3000 of every 3600 ms
const BEAT = 3600, LIT = [[0, 800], [1100, 1350], [1650, 1900], [2200, 3000]]
const lit = (t) => LIT.some(([a, z]) => t % BEAT >= a && t % BEAT < z)

/** One loop of `period` ms cut at `cuts` and at the beat's edges: the frames' start times and lengths. */
const timeline = (period, cuts) => {
  const edges = []
  for (let k = 0; k < period; k += BEAT) for (const [a, z] of LIT) edges.push(k + a, k + z)
  const ts = [...new Set([0, ...cuts, ...edges])].filter((t) => t < period).sort((x, y) => x - y)
  return ts.map((t, i) => ({ t, ms: (ts[i + 1] ?? period) - t }))
}
const every = (step, period) => Array.from({ length: period / step }, (_, i) => i * step)

const opts = (more) => ({ w: IW, h: IH, outline: "k", pivot: "bottom", ...more })
/** An anim over a timeline: draw(c, t) for each frame's start time t. */
const timed = (name, tl, draw) => anim(name, opts({ frames: tl.length, ms: tl.map((f) => f.ms) }), (c) => draw(c, tl[c.frame].t))

// idle: still, then the breath (the body settles a pixel) with a blink in SE as it starts; talk: the mouth every 200 ms
const IDLE = { period: BEAT, cuts: [1800, 2000, 2120] }
const idlePose = (t, view, bowl, patch) =>
  ({ bowl, bob: t >= 1800 ? 1 : 0, blink: view === "se" && t >= 2000 && t < 2120, lull: patch ? lit(t) : undefined })

for (const [prefix, view, bowl] of [["teo", "se", false], ["teo", "ne", false], ["teo", "nw", false], ["teo_bowl", "se", true]]) {
  const v = view === "se" ? "se" : "ne", patch = view !== "nw", name = (what) => `${prefix}_${what}_${view}`
  if (patch) {
    // with the patch: every loop a whole number of beats, its frames cut on the beat's edges
    timed(name("idle"), timeline(BEAT, IDLE.cuts), (c, t) => teo(c, view, idlePose(t, view, bowl, true)))
    // the walk lasts a few steps at a time: Juno's eight frames with the patch lit (a 7.2 s loop on the beat cost 72 frames a view)
    anim(name("walk"), opts({ frames: 8, fps: 10 }), (c) => teo(c, view, { ...walkPose(v, c.frame, bowl), lull: true }))
    timed(name("talk"), timeline(BEAT, every(200, BEAT)),
      (c, t) => teo(c, view, { bowl, talk: Math.floor(t / 200) % 2 === 1, lull: lit(t) }))
  } else {
    // NW: no patch, Juno's short loops
    anim(name("idle"), opts({ frames: 2, ms: [1800, 1800] }), (c) => teo(c, view, idlePose(c.frame * 1800, view, bowl, false)))
    anim(name("walk"), opts({ frames: 8, fps: 10 }), (c) => teo(c, view, walkPose(v, c.frame, bowl)))
    anim(name("talk"), opts({ frames: 2, ms: [200, 200] }), (c) => teo(c, view, { bowl, talk: c.frame === 1 }))
  }
}

})()
