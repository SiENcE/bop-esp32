// Juno Reyes, the protagonist, at the new scale (style guide §4: 30 px per meter of height, so her
// 1.68 m are 50 px; §5, §6). It exports the names the game uses, so it can replace juno.px.js.
//
// Street mode (iso 2:1): two drawn views, the engine mirrors them for SW and NW.
//   juno_idle_se / juno_walk_se / juno_talk_se            front three-quarter, facing down-right, hood up
//   juno_idle_ne / juno_walk_ne / juno_talk_ne            back three-quarter, facing up-right, hood up
//   juno_in_idle_se ... juno_in_talk_ne                   the same indoors, the hood down
// The face is the approved one, "B AUGEN" of art/test/juno50_faces.px.js (eyes two rows tall, a small
// mouth, the fringe under the hood; no implant: mirrored for SW/NW it would jump cheeks); the proportions are those of
// art/test/juno50_blocks.px.js (the head about 1/6 of her, the slicker to mid-thigh). Shaded as the
// 32 px sprite: light from the upper left, Y the lit side, y the slicker, j the shade, the seams and the
// far edge; the strap from her right shoulder to the satchel on her left hip.
//
// Every street frame is 27x50: pivot bottom-centre (column 13, under the bottom row), the soles'
// outline on the bottom row in the idle and talk; in the walk the lower foot's at each contact (SE the
// leading foot, NE the trailing one), the planted foot rising 1 row for every 2 px it slides back along
// the 2:1 floor line (8 px across and 4 up a step, so the actor travels 20 px/s across and 10 px/s down
// or up the screen at 100 ms a frame). Odd width, so the engine's mirror keeps the anchor on its column.
// Feed mode (the hijacked cameras): juno_feed, juno_feed_walk, 15x24, unchanged from juno.px.js (feed
// mode keeps its own scale).
//
// How it is built: hand-drawn parts (head, torso, arm pieces, satchel, the hood lying down) stamped over
// legs drawn from a foot table. The outline is the anim's own (ink k), so parts carry only inner lines.
// Everything sits in a function scope, so this file and juno.px.js can be included side by side.
;(() => {

pal({
  k: "#0c0e1a",                                                       // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a",             // trousers, boots (night steel)
  j: "#9a7406", y: "#eec414", Y: "#fff070",                           // the slicker
  s: "#93583f", S: "#d79676", m: "#7a3a34",                           // skin, the mouth
  h: "#1b1f2e", u: "#2e3550",                                         // short black hair, its light
  g: "#565e70", G: "#8e96a8",                                         // satchel grey
  x: "#6c809a", H: "#b9c6d8",                                         // a raindrop
})

// ---------------------------------------------------------------- frame
const IW = 25, IH = 48           // inside the outline: the sprites come out 27x50
const GROUND = IH - 1            // the soles' last row, inside the outline
const HIP = 31                   // where the legs start, under the slicker (body not bobbed)
const MS = (...a) => a           // frame durations

// ---------------------------------------------------------------- heads (13 wide, at x 6)
// SE, hood up: face B. The fringe under the hood's rim, the near eye and the far eye (2 rows each, 2 px
// of skin between), the mouth in the skin's shade.
sprite("_se_hood", `
  ....YYYYY....
  ..YYYYYYYYy..
  .YYYYYYYYYyy.
  .YYYYYjjjjjy.
  YYYYYjhuhuhj.
  YYYYjhhSShSS.
  yYYYjhSkSSkS.
  yYYYjSSkSSkS.
  yyYYjsSSSSSS.
  jyyyjjsSSmS..
  .jyyyjjsss...
  .jjjjjjj.....`)
// SE, hood down: the same face under short black hair, the fringe where the hood's rim was, the ear
// behind the near eye, the nape dark; the hood lies round her neck (_se_roll)
sprite("_se_hair", `
  .............
  ....uuhhh....
  ..huuuuuhhh..
  .hhuuhuuuhhh.
  .hhuhhhhhuhuh
  hhhhhhhSShSS.
  .hhhhhhSkSSkS
  .hhhhSSSkSSkS
  ..hhhssSSSSSS
  ...hhsssSSmS.
  ......sssss..`)
// NE, hood up: the hood from behind, its seam, a sliver of cheek at its edge
sprite("_ne_hood", `
  ....yYYYY....
  ..yYYjYYYYYy.
  .yYYYjYYYYYyy
  .yYYYjYYYYyyj
  yYYYjYYYyyyj.
  yYYYjYYyyyjS.
  yyYYjyyyyyjS.
  yyYyjyyyyjjS.
  yyyyjyyyyjjS.
  jyyyjyyyyjs..
  .jyyjyyyjj...
  .jjjjjjj.....`)
// NE, hood down: the back of her head, lit at the crown, darkest at the nape, ending in points
sprite("_ne_hair", `
  .............
  ....uuuhh....
  ..huuuuuuhh..
  .hhuhhhhuuhh.
  .hhhhhhhhhuh.
  hhhhhhhhhhhS.
  hhhhhhhhhhhS.
  hhhhhhhhhhsS.
  .hhhhhhhhhsS.
  ..hhhhhhhs...
  ...shhhs.....`)
// the hood lying down: a roll round the back of her neck and over her shoulders
sprite("_se_roll", `
  ..jyYy.......
  .jyYYYy......
  yYYYyyyj.....
  jyyyyyjj.....
  .jjjjj.......`)              // at x 5, y 9: behind the nape, over the near shoulder
sprite("_ne_roll", `
  ...yYYYYYy....
  .yYYYYYyyyyj..
  yYYyyyyyyyyjj.
  jyyyyyyyyyjj..
  .jjjjjjjjjj...`)             // at x 5, y 9: across her upper back under the head

// ---------------------------------------------------------------- torsos (at x 4, y 12)
// SE: the collar in the hood's shadow, the slicker's opening a third in from the leading (right) edge,
// the strap from her right shoulder (near, screen left) across the chest to her left hip
sprite("_se_torso", `
  ..YGgjjjjjyyyyj...
  ...YGgyyyyyjyyj...
  ...yYGgyyyyjyyj...
  ...yYyGgyyyjyyj...
  ..yyyyyGgyyjyyyj..
  ..yyyyyyGgyjyyyj..
  ..yyyyyyyGgjyyyj..
  ..yyyyyyyyGgyyyj..
  ..yyyyyyyyyGgyyj..
  ..yyyyyyyyyjGgyj..
  .yyyyyyyyyyjyGgjj.
  .yyyyyyyyyyjyyyjj.
  .yyyyyyyyyyjyyyjj.
  .yyyyyyyyyyjyyyjj.
  .yyyyyyyyyyjyyyjj.
  .yyyyyyyyyyjyyyjj.
  .jYyyyyjyyyjyyyjj.
  jYYyyyjyyyyjyyyyjj
  jYyyyyjyyyyjyyjyjj
  jjyyyjjyyyyjjyyjjj
  .jjjjjjjjjjjjjjjj.`)
// NE: the back, lit on the left; the strap from her right shoulder (screen right) to her left hip
sprite("_ne_torso", `
  ..YYjjjjjjyyyGg...
  ...YYyyyyyyyGgj...
  ...yYyyyyyyGgyj...
  ...yyyyyyyGgyyj...
  ..yyyyyyyGgyyyyj..
  ..yyyyyyGgyyyyyj..
  ..yyyyyGgyyyyyyj..
  ..yyyyGgyyyyyyyj..
  ..yyyGgyyyyyyyyj..
  ..yyGgyyyyyyyyyj..
  .yyGgyyyyyyyyyyjj.
  .yyyyyyyyyyyyyyjj.
  .yyyyyyyyyyyyyyjj.
  .yyyyyyyyyyyyyyjj.
  .yyyyyyyyyyyyyyjj.
  .yyyyyyyyyyyyyyjj.
  .yyyyyyjyyyyyyyjj.
  jyyyyyyyjyyyyyyyjj
  jYyyyyyyyjyyyyyyjj
  jjyyyyyyyjjyyyyjjj
  .jjjjjjjjjjjjjjjj.`)

// ---------------------------------------------------------------- arms
// each arm in three pieces: the upper arm (still), the forearm and the hand (swinging by whole pixels).
// The hands hang to just above the hip, the slicker's hem (the user's decision, 2026-11-12: first drawn they ended
// high on the slicker; docs/characters/juno_arme_vergleich.png): the pieces below are drawn as first, and ARM_EXTRA
// rows lengthen them: the upper arm takes the first half (its last row repeated), the forearm the rest (its first row
// repeated), the hand moves down by all of them. The test sheet art/test/juno_arme.px.js sets it to compare lengths.
const ARM_EXTRA = globalThis.JUNO_ARM_EXTRA ?? 3, ARM_UP = Math.ceil(ARM_EXTRA / 2), ARM_LO = ARM_EXTRA - ARM_UP
const armPiece = (art, row, n) => {
  const rows = art.split("\n").filter((l) => l.trim())
  const at = row < 0 ? rows.length + row : row
  return "\n" + [...rows.slice(0, at + 1), ...Array(n).fill(rows[at]), ...rows.slice(at + 1)].join("\n")
}
const armSprite = (name, art) => sprite(name, /_up$/.test(name) ? armPiece(art, -1, ARM_UP) : /_lo$/.test(name) ? armPiece(art, 0, ARM_LO) : art)
armSprite("_lit_up", `
  yYYy
  yYYj
  yYYj
  yYYj
  yYyj
  yYyj
  yYyj`)                       // a lit arm, rows 13-19: SE's near arm (screen left)
armSprite("_lit_lo", `
  yYyj
  jYyj
  jyyj
  jjyj
  jjjj`)                       // rows 20-24, the cuff at the bottom
armSprite("_lit_hand", `
  .SS.
  .SSs
  ..s.`)                       // rows 25-27
armSprite("_se_far_up", `
  yj.
  yyj
  jyj
  jyj
  jyj
  jyj
  jyj`)                        // SE's far arm (her left, screen right), rows 13-19, partly behind her
armSprite("_se_far_lo", `
  jyj
  jyj
  jjj
  jjj
  jjj`)                        // rows 20-24, mostly behind the satchel
armSprite("_se_far_hand", `
  ss
  s.`)
armSprite("_ne_far_up", `
  yYj
  yYj
  yYj
  yyj
  yyj
  yyj
  jyj`)                        // NE's far arm (her left, screen left, lit), rows 13-19
armSprite("_ne_far_lo", `
  jyj
  jyj
  jyj
  jjj
  jjj`)
armSprite("_shade_up", `
  yyy.
  jyyj
  jyyj
  jyyj
  jyyj
  jyyj
  jyyj`)                       // NE's near arm (her right, screen right, the shade side), rows 13-19
armSprite("_shade_lo", `
  jyyj
  jyyj
  jjyj
  jjjj
  jjjj`)
armSprite("_shade_hand", `
  .sS.
  .ss.
  .s..`)

// ---------------------------------------------------------------- the satchel
sprite("_se_bag", `
  GGGGGGg
  GGGGGGg
  GGGGGGg
  GGGGGGg
  gGGGGgg
  ggggggg
  GGGGGgg
  gggggg.`)                    // at x 16, y 23: her left hip (far, screen right)
sprite("_ne_bag", `
  GGGGGGg
  GGGGGGg
  GGGGGgg
  GGGGGgg
  GGGGGgg
  GGGGGgg
  gGGGGgg
  .gggggg`)                    // at x 2, y 23: her left hip (screen left)

// ---------------------------------------------------------------- legs
// A leg is a band 5 px wide from the hip to the ankle, its columns lit to dark, a cargo pocket on the near
// thigh, a knee light; the far leg a step darker. Boots, 4 rows, heavy soles:
const BOOT = {
  se: ["22221..", "222221.", "2222141", "1111111"],     // toe toward the screen's right
  ne: [".22221.", "222221.", "2421111", "1111111"],     // heel toward the screen's left
}
const BOOT_X = { se: 0, ne: -1 }       // where the boot grid starts against the leg's left column
const LEG_NEAR = "34321", LEG_FAR = "22111"
const DARKER = { 4: "3", 3: "2", 2: "1", 1: "1" }

/** feet: { near: { x, dx, gy, lift }, far: {...} }, x = the leg's left column at the hip. */
const legs = (c, view, feet, bob) => {
  const own = new Map()                // "x,y" -> "near" | "far"
  const put = (x, y, k, who) => { if (x < 0 || x >= IW || y < 0 || y >= IH) return; c.px(x, y, k); own.set(x + "," + y, who) }
  for (const who of ["far", "near"]) {
    const f = feet[who], cols = who === "near" ? LEG_NEAR : LEG_FAR
    const hipY = HIP + bob, sole = GROUND + f.gy - f.lift, ankleY = sole - 4
    const span = Math.max(1, ankleY - hipY), bend = f.lift >= 2 ? 2 : f.lift ? 1 : 0
    for (let y = hipY; y <= ankleY; y++) {
      const t = (y - hipY) / span, knee = Math.round(Math.sin(Math.PI * t) * bend)   // a swinging leg bends forward
      const x0 = f.x + Math.round(f.dx * t) + knee, r = y - hipY
      for (let i = 0; i < 5; i++) {
        let k = cols[i]
        if (who === "near") {
          if (r === 4 && i < 3) k = "4"                                   // the pocket's flap
          else if (r >= 5 && r <= 7 && i === 3) k = "1"                    // its side, in shadow
          else if (r === 9 && i === 1 && span >= 9) k = "4"                // the knee
        }
        put(x0 + i, y, k, who)
      }
    }
    const bx = f.x + f.dx + BOOT_X[view]
    BOOT[view].forEach((row, j) => [...row].forEach((k, i) => {
      if (k === ".") return
      put(bx + i, sole - 3 + j, who === "far" ? (DARKER[k] ?? k) : k, who)
    }))
  }
  // the near leg in front of the far one: a line of ink on the far leg where they touch
  for (const [p, who] of own) {
    if (who !== "near") continue
    const [x, y] = p.split(",").map(Number)
    for (const [ax, ay] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]])
      if (own.get(ax + "," + ay) === "far") c.px(ax, ay, "k")
  }
}

// ---------------------------------------------------------------- the figure
// o: { bob, bagBob, hood (false: indoors), near, nearHand, far, farHand, bag (x offsets), talk, blink, nod }
const LEG_X = { se: { near: 7, far: 13 }, ne: { near: 13, far: 7 } }
const STAND = { near: { dx: 0, gy: 0, lift: 0 }, far: { dx: 0, gy: -1, lift: 0 } }

const juno = (c, view, o = {}) => {
  const b = o.bob ?? 0, at = (name, x, y, dy = b) => c.stamp(name, x, y + dy)
  const fe = o.feet ?? STAND, hood = o.hood ?? true
  legs(c, view, { near: { ...fe.near, x: LEG_X[view].near }, far: { ...fe.far, x: LEG_X[view].far } }, b)
  const bagY = 23 + (o.bagBob ?? b)
  if (view === "se") {
    at("_se_far_up", 19, 13); at("_se_far_lo", 19 + (o.far ?? 0), 20 + ARM_UP); at("_se_far_hand", 20 + (o.farHand ?? 0), 25 + ARM_EXTRA)
    at("_se_torso", 4, 12)
    at("_se_bag", 16 + (o.bag ?? 0), bagY, 0)
    at("_lit_up", 4, 13); at("_lit_lo", 4 + (o.near ?? 0), 20 + ARM_UP); at("_lit_hand", 4 + (o.nearHand ?? 0), 25 + ARM_EXTRA)
  } else {
    at("_ne_torso", 4, 12)
    at("_ne_far_up", 4, 13); at("_ne_far_lo", 4 + (o.far ?? 0), 20 + ARM_UP)
    at("_ne_bag", 2 + (o.bag ?? 0), bagY, 0)
    at("_shade_up", 18, 13); at("_shade_lo", 18 + (o.near ?? 0), 20 + ARM_UP); at("_shade_hand", 18 + (o.nearHand ?? 0), 25 + ARM_EXTRA)
  }
  if (!hood) at(`_${view}_roll`, 5, 9)
  const hy = b + (o.nod ?? 0)
  at(`_${view}_${hood ? "hood" : "hair"}`, 6, 0, hy)
  // the face's moving pixels (SE: eyes at x 13 and 16, rows 6-7; the mouth at 15, 9)
  if (view === "se") {
    if (o.blink) for (const ex of [13, 16]) { c.px(ex, 6 + hy, "S"); c.px(ex, 7 + hy, "s") }
    if (o.talk) { c.px(15, 9 + hy, "k"); c.px(15, 10 + hy, "m") }
  } else if (o.talk) {
    c.px(17, 9 + hy, "S"); c.px(16, 10 + hy, "s")                       // the jaw moves, a pixel more cheek
  }
}

// ---------------------------------------------------------------- walk
// 8 frames x 100 ms: contact, down, passing, up, for each foot. The near foot: contact in front (0),
// planted and sliding back along the floor's 2:1 line (1-4), swinging forward lifted (5-7); the far foot
// the same, 4 frames later, a row higher (a step further back across the floor). gy is the sole's row
// against the bottom (0) for SE, where forward is down-right; NE (forward up-right) takes -4 - gy.
const FOOT = [
  { dx: 4, gy: 0, lift: 0 }, { dx: 2, gy: -1, lift: 0 }, { dx: 0, gy: -2, lift: 0 }, { dx: -2, gy: -3, lift: 0 },
  { dx: -4, gy: -4, lift: 0 }, { dx: -2, gy: -3, lift: 2 }, { dx: 0, gy: -2, lift: 3 }, { dx: 2, gy: -1, lift: 1 },
]
const BOB = [1, 2, 1, 0, 1, 2, 1, 0]             // lowest just after each contact, highest passing
const ARM = [-1, -1, -1, 0, 1, 1, 1, 0]          // the near forearm: back while the near foot leads
const HAND = [-1, -2, -1, 0, 1, 2, 1, 0]         // the near hand, a pixel further at the extremes
const BAG = [0, 0, 1, 1, 0, 0, -1, -1]           // the satchel swings a pixel, late
// Where the legs cross (SE: the far foot behind, NE: the far foot ahead) the far foot reaches further, so
// its boot still shows past the near leg; it grows by a pixel a frame, so the foot slides evenly
const FAR_REACH = { se: [1, 0, -1, -2, -3, -2, -1, 0], ne: [3, 2, 1, 0, -1, 0, 1, 2] }
const foot = (view, i, far) => {
  const j = (i + 8) % 8, f = FOOT[j], gy = (view === "se" ? f.gy : -4 - f.gy) - (far ? 1 : 0)
  return { ...f, dx: f.dx + (far ? FAR_REACH[view][j] : 0), gy }
}
const walkPose = (view, i, hood) => ({
  hood, bob: BOB[i], bagBob: BOB[(i + 7) % 8], near: ARM[i], nearHand: HAND[i], far: -ARM[i], farHand: -HAND[i],
  bag: BAG[i], feet: { near: foot(view, i), far: foot(view, i + 4, true) },
})

// idle: a slow breath (the body settles a pixel), a blink in SE; outside, rain gathering on the hood's
// brim and falling
const DRIP = {
  se: [null, [[17, 3, "H"]], [[18, 6, "x"], [18, 7, "H"]], null],
  ne: [null, [[16, 2, "H"]], [[18, 5, "x"], [18, 6, "H"]], null],
}

for (const view of ["se", "ne"]) for (const hood of [true, false]) {
  const name = (what) => `juno_${hood ? "" : "in_"}${what}_${view}`
  const opts = (more) => ({ w: IW, h: IH, outline: "k", pivot: "bottom", ...more })

  anim(name("walk"), opts({ frames: 8, fps: 10 }), (c) => juno(c, view, walkPose(view, c.frame, hood)))

  const idle = [
    (c) => juno(c, view, { hood }),
    (c) => juno(c, view, { hood }),
    (c) => juno(c, view, { hood, bob: 1, blink: true }),
    (c) => juno(c, view, { hood, bob: 1 }),
  ]
  const items = [(c) => idle[c.frame](c)]
  if (hood) items.push(layer("drip", { outline: false }, (c) => { for (const [x, y, k] of DRIP[view][c.frame] ?? []) c.px(x, y, k) }))
  anim(name("idle"), opts({ frames: 4, ms: MS(900, 600, 120, 1100) }), ...items)

  anim(name("talk"), opts({ frames: 2, ms: MS(200, 200) }),
    (c) => juno(c, view, { hood, talk: c.frame === 1, nod: view === "ne" ? c.frame : 0 }))
}

// ================================================================ feed mode
// (unchanged from juno.px.js)
// How a ceiling or corner camera sees her: from about 45 degrees above and behind (as in
// art/mockups/mock_e_cctv.px.js), facing up-right; the engine mirrors it for up-left. Only the
// phosphor ramp: from here on the digit keys are its steps (the street sprites above keep theirs).
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})
const FW = 13, FH = 22           // inside the rim: 15x24

sprite("_feed_hood", `
  ....6886.....
  ...688886....
  ...8888888...
  ...8888888...
  ...8888888...
  ....88888....`)                // rows 0-5: the hood's crown, the camera's brightest thing on her
sprite("_feed_body", `
  .66663336666.
  .66666666636.
  .63666666366.
  .63666663636.
  .63666636636.
  .66666366636.
  .66663666636.
  .66666666636.
  ..666666663..
  ...6666666...`)                // rows 6-15: shoulders, back and arms (a crease each side), the strap
sprite("_feed_bag", `
  3333
  3333
  3333
  .333`)                         // rows 11-14, cols 1-4: the satchel at her left hip

// legs: 3 px wide, the near (her right, screen right) over the far; boots a row wider
function feedLegs(c, feet, bob) {
  const own = new Map()
  const put = (x, y, who) => { if (x < 0 || x >= FW || y < 0 || y >= FH) return; c.px(x, y, "3"); own.set(x + "," + y, who) }
  for (const who of ["far", "near"]) {
    const f = feet[who], hx = who === "near" ? 7 : 3, hipY = 16 + bob, sole = f.y - f.lift
    const span = Math.max(1, sole - 2 - hipY)
    for (let y = hipY; y <= sole - 2; y++) { const x0 = hx + Math.round(f.dx * (y - hipY) / span); for (let i = 0; i < 3; i++) put(x0 + i, y, who) }
    for (let y = sole - 1; y <= sole; y++) for (let i = 0; i < 4; i++) put(hx + f.dx + i, y, who)
  }
  for (const [p, who] of own) {
    if (who !== "near") continue
    const [x, y] = p.split(",").map(Number)
    for (const [ax, ay] of [[x - 1, y], [x, y - 1], [x, y + 1]]) if (own.get(ax + "," + ay) === "far") c.px(ax, ay, "1")
  }
}
function junoFeed(c, o = {}) {
  const b = o.bob ?? 0
  feedLegs(c, o.feet ?? { near: { dx: 0, y: FH - 1, lift: 0 }, far: { dx: 0, y: FH - 1, lift: 0 } }, b)
  c.stamp("_feed_body", 0, 6 + b)
  c.stamp("_feed_bag", 1 + (o.bag ?? 0), 11 + b)
  c.stamp("_feed_hood", o.look ?? 0, b)
}

// idle: she stands, and now and then turns her head a pixel to look along the street
anim("juno_feed", { w: FW, h: FH, frames: 2, ms: [1400, 800], outline: "1", pivot: "bottom" },
  (c) => junoFeed(c, { look: c.frame }))

// walk: 6 frames x 100 ms, the feet stepping up-right along the floor (2 across, 1 up)
const FEED_FOOT = [
  { dx: 2, gy: -1, lift: 0 }, { dx: 1, gy: -1, lift: 0 }, { dx: -1, gy: 0, lift: 0 },
  { dx: -2, gy: 1, lift: 0 }, { dx: 0, gy: 0, lift: 1 }, { dx: 1, gy: -1, lift: 1 },
]
const FEED_BOB = [0, 1, 0, 0, 1, 0], FEED_BAG = [0, 1, 1, 0, -1, -1]
anim("juno_feed_walk", { w: FW, h: FH, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame, f = (j) => { const q = FEED_FOOT[j % 6]; return { dx: q.dx, lift: q.lift, y: FH - 2 + q.gy } }
  junoFeed(c, { bob: FEED_BOB[i], bag: FEED_BAG[i], feet: { near: f(i), far: f(i + 3) } })
})

})()
