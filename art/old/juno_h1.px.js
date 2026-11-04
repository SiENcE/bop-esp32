// SUPERSEDED (H1c, 2026-11-04): the old scale (18 px per meter of height). Kept for reference; not built.
// Juno Reyes, the protagonist: production sprites (style guide §4-§6, §9).
//
// Street mode (iso 2:1): two drawn views, the engine mirrors them for SW and NW.
//   juno_idle_se / juno_walk_se / juno_talk_se   front three-quarter, facing down-right
//   juno_idle_ne / juno_walk_ne / juno_talk_ne   back three-quarter, facing up-right
//   (the NE view is the approved mockup's, art/mockups/mock_c_iso.px.js "juno", without the
//   ad screen's cyan rim, which belongs to that scene's light, not to her)
// Every street frame is 21x32: pivot bottom-centre (column 10, under the bottom row), the soles'
// outline on the bottom row in the idle and talk; in the walk the lower foot's at each contact (SE
// the leading foot, NE the trailing one), the planted foot rising 1-3 rows as it slides back up
// the 2:1 floor line between. Odd width, so the engine's mirror keeps the anchor on the same column.
// Feed mode (the hijacked cameras): juno_feed, juno_feed_walk, 15x24, the phosphor ramp only:
// rim 1, trousers and satchel 3, slicker 6, hood 8 (her signature, the brightest value).
//
// How it is built: the body is hand-drawn parts (hood, torso, arms, satchel) in the mockup's
// 16-column frame, stamped over legs drawn from a foot table (the walk's feet step 2:1 along
// the iso floor). The outline is the anim's own (ink k), so parts carry only inner lines.

pal({
  k: "#0c0e1a",                                                       // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a",             // trousers, boots (night steel)
  j: "#9a7406", y: "#eec414", Y: "#fff070",                           // the slicker
  s: "#93583f", S: "#d79676",                                         // skin
  g: "#565e70", G: "#8e96a8",                                         // satchel grey
  v: "#62def0",                                                       // the implant line
  x: "#6c809a", H: "#b9c6d8",                                         // a raindrop
})

// ---------------------------------------------------------------- frame
const IW = 19, IH = 30          // inside the outline: the sprites come out 21x32
const OX = 1, OY = -1           // part grids are written in the mockup's 16x32 frame (its row 0 and
                                // column 0 are outline); this puts them in ours
const GROUND = IH - 1           // the soles' last row, inside the outline
const HEM = 21                  // the first row under the slicker's hem (body not bobbed)

// ---------------------------------------------------------------- parts, NE (back three-quarter)
// rows 1-8 of the mockup
sprite("_hood_ne", `
  ......yYYY......
  .....yYYYYY.....
  ....yYYYYYYy....
  ....yYYYYYyjS...
  ....yyYYYyyjS...
  ....yyyyyyjjv...
  ....jyyyyyjjS...
  ....kjjjjjjjk...`)
// talking: the jaw moves, a pixel more cheek shows at the hood's edge
sprite("_hood_ne_talk", `
  ......yYYY......
  .....yYYYYY.....
  ....yYYYYYYy....
  ....yYYYYYyjS...
  ....yyYYYyySS...
  ....yyyyyyjjv...
  ....jyyyyyjss...
  ....kjjjjjjjk...`)
// rows 9-21: the back, the strap from her right shoulder to her left hip, without the arms'
// swinging parts and the satchel
sprite("_torso_ne", `
  ...yyyjjjjjjgG..
  ..yYYyyyyyyyGj..
  ..yYYyyyyyyGyj..
  ..yYyjyyyyGyyj..
  ..yYyjyyyGyyyj..
  .....jyyGyyyyj..
  .....jyGyyyyyj..
  .....jGyyyyyyj..
  .....Gyyyyyyyj..
  .....jyyyyyyjj..
  .....jyyyyyyjj..
  .....jjyyyyjjj..
  .....jjjjjjjj...`)
sprite("_farm_ne", `
  yyy
  yyy
  jyy`)                         // her left forearm (screen left), rows 14-16, cols 2-4
sprite("_narm_ne_up", `
  yy
  yy
  jy
  jy
  jy
  jy`)                          // her right arm (screen right), rows 10-15, cols 13-14
sprite("_narm_ne_lo", `
  jy
  jj
  jj
  jS
  kS`)                          // rows 16-20, the hand at the bottom
sprite("_bag_ne", `
  gGGgG
  gGGGg
  gGGGg
  ggggk`)                       // rows 17-20, cols 1-5

// ---------------------------------------------------------------- parts, SE (front three-quarter)
// The face in the hood's opening on the leading side: a fringe of black hair, the near eye, the
// far eye at the face's edge, the implant under it on her left cheekbone.
sprite("_hood_se", `
  ......yYYY......
  .....yYYYYY.....
  ....yYYYYYYy....
  ....yYYYYjjjy...
  ....yyYYj1SSS...
  ....yyyyjkSkS...
  ....jyyyjsSSv...
  ....kjjjjjSsk...`)
// talking: the mouth opens a little, the jaw a step darker
sprite("_hood_se_talk", `
  ......yYYY......
  .....yYYYYY.....
  ....yYYYYYYy....
  ....yYYYYjjjy...
  ....yyYYj1SSS...
  ....yyyyjkSkS...
  ....jyyyjsSSv...
  ....kjjjjjksk...`)
// the front: collar, the slicker's opening a third in from the leading edge, the strap from her
// right shoulder (near, screen left) across the chest to her left hip (far, screen right)
sprite("_torso_se", `
  ..yYYGjjjjjyy...
  ....yGyyyjyyj...
  ....yyGyyjyyj...
  ....yyyGyjyyj...
  ....yyyyGjyyj...
  ....yyyyyGyyj...
  ....yyyyyjGyj...
  ....yyyyyjyGj...
  ....yyyyyjyyj...
  ....jyyyyjyyj...
  ....jyyyyjyyj...
  ....jjyyyjjj....
  ....jjjjjjjj....`)
sprite("_narm_se_up", `
  yYyj
  yYyj
  yyyj
  yyyj
  jyyj`)                        // her right arm (near, screen left), rows 10-14, cols 1-4
sprite("_narm_se_lo", `
  jyyj
  jyyj
  jjyj
  .SSj
  .Ss.`)                        // rows 15-19, the hand under the cuff
sprite("_bag_se", `
  gG..
  gGGg
  gGGg
  gGGg
  gggg`)                        // rows 16-20, cols 12-15: the bag at her far hip

// ---------------------------------------------------------------- legs
// A leg is a band 4 px wide from the hem to the ankle, its columns lit to dark, and a boot.
// near leg: [3,3,2,1] with a knee light; far leg a step darker. Boots, 3 rows:
const BOOT = {
  se: ["2211.", "22141", "21111"],       // toe toward the screen's right
  ne: [".2211", "24111", "21111"],       // heel toward the screen's left (the mockup's)
}
const BOOT_X = { se: 0, ne: -1 }         // where the boot grid starts against the leg's left column
const LEG_NEAR = "3321", LEG_FAR = "2111"
const DARKER = { 4: "3", 3: "2", 2: "1", 1: "1" }

/** feet: { near: { x, dx, gy, lift }, far: {...} }, x = the leg's left column at the hip. */
function legs(c, view, feet, bob) {
  const own = new Map()                  // "x,y" -> "near" | "far"
  const put = (x, y, k, who) => { if (x < 0 || x >= IW || y < 0 || y >= IH) return; c.px(x, y, k); own.set(x + "," + y, who) }
  for (const who of ["far", "near"]) {
    const f = feet[who], cols = who === "near" ? LEG_NEAR : LEG_FAR
    const hipY = HEM + bob, sole = GROUND + f.gy - f.lift, ankleY = sole - 3
    const span = Math.max(1, ankleY - hipY)
    for (let y = hipY; y <= ankleY; y++) {
      const t = (y - hipY) / span, knee = f.lift ? Math.round(Math.sin(Math.PI * t)) : 0    // a swinging leg bends forward
      const x0 = f.x + Math.round(f.dx * t) + knee
      for (let i = 0; i < 4; i++) {
        let k = cols[i]
        if (who === "near" && i === 1 && y === hipY + 2 && ankleY - hipY >= 4) k = "4"      // the knee
        put(x0 + i, y, k, who)
      }
    }
    const bx = f.x + f.dx + BOOT_X[view]
    BOOT[view].forEach((row, j) => [...row].forEach((k, i) => {
      if (k === ".") return
      put(bx + i, sole - 2 + j, who === "far" ? (DARKER[k] ?? k) : k, who)
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
// o: { bob, near, far, bag (x offsets of the swinging parts), talk, hood (dy) }
const LEG_X = { se: { near: 5, far: 10 }, ne: { near: 10, far: 5 } }
const STAND = { dx: 0, gy: 0, lift: 0 }

function juno(c, view, o = {}) {
  const b = o.bob ?? 0, at = (name, x, y) => c.stamp(name, x + OX, y + OY + b)
  const fe = o.feet ?? { near: STAND, far: STAND }
  legs(c, view, { near: { ...fe.near, x: LEG_X[view].near }, far: { ...fe.far, x: LEG_X[view].far } }, b)
  const hood = "_hood_" + view + (o.talk ? "_talk" : "")
  if (view === "se") {
    at("_torso_se", 0, 9)
    at("_bag_se", 12 + (o.bag ?? 0), 16)
    at("_narm_se_up", 1, 10)
    at("_narm_se_lo", 1 + (o.near ?? 0), 15)
  } else {
    at("_torso_ne", 0, 9)
    at("_farm_ne", 2 + (o.far ?? 0), 14)
    at("_bag_ne", 1 + (o.bag ?? 0), 17)
    at("_narm_ne_up", 13, 10)
    at("_narm_ne_lo", 13 + (o.near ?? 0), 16)
  }
  at(hood, 0, 1 + (o.hood ?? 0))
}

// ---------------------------------------------------------------- walk
// 8 frames x 100 ms. The near foot: contact in front (0), planted and sliding back along the
// floor's 2:1 line (1-4), swinging forward lifted (5-7); the far foot the same, 4 frames later.
// gy is the sole's row against the bottom (0) for SE, where forward is down-right; NE (forward
// up-right) takes -3 - gy. Walking, the far foot treads a row higher (it is a step further
// back across the floor), so it shows past the near leg when they cross. The planted foot moves 6 px across and 3 up a step: at 100 ms a
// frame the actor travels 15 px/s across and 7.5 px/s down (or up) the screen.
const FOOT = [
  { dx: 3, gy: 0, lift: 0 }, { dx: 2, gy: -1, lift: 0 }, { dx: 0, gy: -1, lift: 0 }, { dx: -2, gy: -2, lift: 0 },
  { dx: -3, gy: -3, lift: 0 }, { dx: -1, gy: -2, lift: 1 }, { dx: 1, gy: -1, lift: 2 }, { dx: 2, gy: 0, lift: 1 },
]
const BOB = [0, 1, 0, 0, 0, 1, 0, 0]                // lowest just after each contact
const ARM = [-1, -1, 0, 1, 1, 1, 0, -1]             // the near hand: back while the near foot leads
const BAG = [0, 0, 1, 1, 0, 0, -1, -1]              // the satchel swings a pixel, late
// Where the legs cross (SE: the far foot behind, NE: the far foot ahead) the far foot reaches 2-3 px
// further, so its heel or toe still shows past the near leg.
const FAR_REACH = { se: { 2: -1, 3: -3, 4: -3 }, ne: { 7: 3, 0: 3, 1: 2, 2: 1 } }
const foot = (view, i, far) => {
  const j = (i + 8) % 8, f = FOOT[j], gy = (view === "se" ? f.gy : -3 - f.gy) - (far ? 1 : 0)
  return { ...f, dx: f.dx + (far ? FAR_REACH[view][j] ?? 0 : 0), gy }
}

for (const view of ["se", "ne"]) {
  anim(`juno_walk_${view}`, { w: IW, h: IH, frames: 8, fps: 10, outline: "k", pivot: "bottom" }, (c) => {
    const i = c.frame
    juno(c, view, { bob: BOB[i], near: ARM[i], far: -ARM[i], bag: BAG[i], feet: { near: foot(view, i), far: foot(view, i + 4, true) } })
  })

  // idle: a slow breath (the body settles a pixel), and rain gathering on the hood's brim, falling
  const DRIP = view === "se"
    ? [null, [[13, 4, "H"]], [[14, 7, "x"], [14, 8, "H"]], null]
    : [null, [[12, 3, "H"]], [[14, 6, "x"], [14, 7, "H"]], null]
  anim(`juno_idle_${view}`, { w: IW, h: IH, frames: 4, ms: [800, 500, 100, 900], outline: "k", pivot: "bottom" },
    (c) => juno(c, view, { bob: c.frame >= 2 ? 1 : 0 }),
    layer("drip", { outline: false }, (c) => { for (const [x, y, k] of DRIP[c.frame] ?? []) c.px(x + OX, y + OY, k) }))

  anim(`juno_talk_${view}`, { w: IW, h: IH, frames: 2, ms: [200, 200], outline: "k", pivot: "bottom" },
    (c) => juno(c, view, { talk: c.frame === 1 }))
}

// ================================================================ feed mode
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
