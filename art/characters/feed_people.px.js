// The prologue's people as the hijacked cameras see them (feed mode, style guide §6 and §9,
// kapitel0-design §3, §6.2, §8). Same convention as juno.px.js's juno_feed: the phosphor ramp only
// (keys 0-9, the mockup's exact hex), seen from a high camera (40-60 degrees down), an adult of
// 1.75 m about 24 px tall, odd canvas width, pivot bottom-centre, the rim one ramp step (1, or 0 on
// a figure darker than the street), 3-4 values inside. Each person has one accent, the brightest
// value on them, and nothing else on them comes near it.
//
// Views: standing and walking figures are drawn as Juno's are, from behind, facing up-right (the
// engine mirrors for up-left). Two exceptions face the camera (front three-quarter, facing
// down-right; mirror them to face down-left): kessler_feed_sit (he sits across the table from Varga,
// whose back is to the camera, so cam04 shows his bowed head and the scarf) and yuen_cook_feed
// (behind his counter, facing the room).
//
//   Herr Kessler    coat 4, trousers 3, head and hands 6, the knitted scarf 9 (a band round the
//                   neck, one end thrown back over his left shoulder): his tell in cam03's crowd
//   Gus Varga       rim 0, hat 2, coat 3, hands 4: a dark bulk; the watch on his left wrist 9
//   commuter_a      under an umbrella (the same canopy as Kessler's, so umbrellas alone don't tell)
//   commuter_b      a hood, a short jacket, hands in pockets
//   commuter_c      tall, a long coat, the DECOY: a scarf of Kessler's cut, but 6, not 9
//   commuter_d      a woman with long hair, a light coat and a shoulder bag (bag 6)
//   nachbar         Chapter 2, the neighbour in CAM 24: a flat cap, a long coat, a bag from the 24-hour shop (bag 9)
//   yuen_cook       paper cap 8, apron 7, chopping at his counter
//   ines            the end of Chapter 1, front and back: the white coat 9, a dark plait cut into it; a wallet with a light
//   marit           Chapter 2, the nurse in CAM 21, front, back and looking back: the short coat 9, the scrubs 7, a bun
//   lantern         the painted Lantern from the side, both ways drawn: the crest 9, the near wheel 7-8, the poncho 6-7, his wheels turning
//   ashe            front only: a raincoat 8, no face, a burn 9 with no dark rim; the same in the shadow; the look into the camera
//
// Walks: 6 frames x 100 ms, the same foot table as juno_feed_walk (the feet step 2 across and 1 up).

pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})
ramps("0123456789")

// ================================================================ shared
// Legs from the hips down, as juno_feed's: the far leg first, the near one over it, a line of `sep`
// on the far leg where they touch. L: { W, H, near, far (hip columns), hip (row), lw, sw (leg and
// shoe widths), leg, shoe, sep }; feet: { near: { dx, y, lift }, far }.
function fpLegs(c, L, feet, bob = 0) {
  const own = new Map()
  const put = (x, y, k, who) => { if (x < 0 || x >= L.W || y < 0 || y >= L.H) return; c.px(x, y, k); own.set(x + "," + y, who) }
  for (const who of ["far", "near"]) {
    const f = feet[who], hx = L[who], hipY = L.hip + bob, sole = f.y - f.lift
    const span = Math.max(1, sole - 2 - hipY)
    for (let y = hipY; y <= sole - 2; y++) {
      const x0 = hx + Math.round(f.dx * (y - hipY) / span)
      for (let i = 0; i < L.lw; i++) put(x0 + i, y, L.leg, who)
    }
    for (let y = sole - 1; y <= sole; y++) for (let i = 0; i < L.sw; i++) put(hx + f.dx + i, y, L.shoe, who)
  }
  for (const [p, who] of own) {
    if (who !== "near") continue
    const [x, y] = p.split(",").map(Number)
    for (const [ax, ay] of [[x - 1, y], [x, y - 1], [x, y + 1]]) if (own.get(ax + "," + ay) === "far") c.px(ax, ay, L.sep)
  }
}
const fpStand = (H) => ({ near: { dx: 0, y: H - 1, lift: 0 }, far: { dx: 0, y: H - 1, lift: 0 } })

// the walk: juno_feed_walk's table (near foot; the far foot 3 frames later)
const FP_FOOT = [
  { dx: 2, gy: -1, lift: 0 }, { dx: 1, gy: -1, lift: 0 }, { dx: -1, gy: 0, lift: 0 },
  { dx: -2, gy: 1, lift: 0 }, { dx: 0, gy: 0, lift: 1 }, { dx: 1, gy: -1, lift: 1 },
]
const FP_BOB = [0, 1, 0, 0, 1, 0]
const FP_SWING = [0, 1, 1, 0, -1, -1]           // a hand's swing in rows (the near hand; the far one opposite)
const fpFeet = (H, i) => {
  const f = (j) => { const q = FP_FOOT[j % 6]; return { dx: q.dx, lift: q.lift, y: H - 2 + q.gy } }
  return { near: f(i), far: f(i + 3) }
}
// the walk seen from in front: the same table, the far foot higher on the screen instead of the near one
const fpFeetFront = (H, i) => { const q = fpFeet(H, i), m = (f) => ({ ...f, y: 2 * (H - 2) - f.y }); return { near: m(q.near), far: m(q.far) } }
// a rim of value k round what is drawn so far: for what must stay free of a rim and so comes after it (Ashe's burn)
function fpRim(c, W, H, k) {
  const body = new Set()
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (c.is(x, y, "*")) body.add(x + "," + y)
  for (const p of body) {
    const [x, y] = p.split(",").map(Number)
    for (const [ax, ay] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) if (ax >= 0 && ay >= 0 && ax < W && ay < H && !body.has(ax + "," + ay)) c.px(ax, ay, k)
  }
}
// a hand grid through a table of values: one drawing, several lights (Ashe lit and in shadow)
const fpGrid = (c, x, y, rows, map) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== ".") c.px(x + i, y + j, map[r[i]]) })

// An umbrella seen from above at 45 degrees: a 15x10 disc of 8 panels, alternately lit (5) and in
// shade (4), the ribs between them a step darker, the near rim curving away (3), a wet glint (6) and
// the ferrule on top. Kessler's and commuter_a's are the same umbrella.
function fpCanopy(c, x0, y0) {
  const cx = 7, cy = 4.5, rx = 7.5, ry = 5, ax = 7, ay = 3      // ay: the dome's apex sits above the middle
  const inside = (x, y) => { const nx = (x - cx) / rx, ny = (y + 0.5 - cy) / ry; return nx * nx + ny * ny <= 1 }
  for (let y = 0; y < 10; y++) for (let x = 0; x < 15; x++) {
    if (!inside(x, y)) continue
    const ny = (y + 0.5 - cy) / ry, nx = (x - cx) / rx
    let k = (x - ax) + (y - ay) * 1.5 < 0 ? "5" : "4"                   // lit toward the upper left
    if (ny > 0.55 && nx * nx + ny * ny > 0.55) k = "3"                  // the near rim, turning down
    c.px(x0 + x, y0 + y, k)
  }
  // the ribs: from the apex out to the rim's points
  for (const [ex, ey] of [[0, 4], [3, 8], [11, 8], [14, 4], [3, 1], [11, 1]]) {
    const n = Math.max(Math.abs(ex - ax), Math.abs(ey - ay))
    for (let i = 1; i <= n; i++) {
      const x = Math.round(ax + (ex - ax) * i / n), y = Math.round(ay + (ey - ay) * i / n)
      if (inside(x, y)) c.px(x0 + x, y0 + y, "3")
    }
  }
  c.px(x0 + ax, y0 + ay, "6"); c.px(x0 + ax, y0 + ay - 1, "5")         // the ferrule
  c.px(x0 + 4, y0 + 2, "6"); c.px(x0 + 9, y0 + 2, "6")                  // rain glints on the lit panels
}

// ================================================================ Herr Kessler
// 11x21 inside (13x23): a small man, the head pushed forward (screen right) between round shoulders.
const K = { W: 11, H: 21 }
const K_LEGS = { W: K.W, H: K.H, near: 6, far: 2, hip: 16, lw: 3, sw: 3, leg: "3", shoe: "2", sep: "1" }
sprite("_k_head", `
  .666.
  66666
  66666
  64446
  .444.`)                        // the balding crown, grey hair round the back, the ears
sprite("_k_body", `
  ...999999..
  .449999994.
  .429944424.
  .429944424.
  .429944424.
  .424944424.
  .424444424.
  .424444424.
  .424444424.
  .444444444.
  ..4444444..`)                  // rows 5-15: the scarf round his neck, its end down his back
sprite("_k_hand", "6\n6")

function kessler(c, o = {}) {
  const b = o.bob ?? 0, sw = o.swing ?? 0
  fpLegs(c, K_LEGS, o.feet ?? fpStand(K.H), b)
  c.stamp("_k_body", 0, 5 + b)
  if (!o.phone) c.stamp("_k_hand", 9, 13 + b + sw)
  c.stamp("_k_hand", 1, 13 + b - sw)
  c.stamp("_k_head", 4 + (o.look ?? 0), (o.nod ?? 0) + b)
  if (o.phone) {
    // the right arm raised: the elbow out past the shoulder, the hand at the ear, the screen's glow
    for (const [x, y, k] of [[9, 6, "4"], [10, 7, "4"], [10, 8, "4"], [10, 9, "2"], [9, 7, "2"], [9, 5, "4"],
      [9, 4, "6"], [9, 3, "6"], [9, 2, "7"]]) c.px(x, y + b, k)
  }
}

// idle: he stands, and glances back over his shoulder now and then
anim("kessler_feed", { w: K.W, h: K.H, frames: 2, ms: [1600, 700], outline: "1", pivot: "bottom" },
  (c) => kessler(c, { look: -c.frame }))
anim("kessler_feed_walk", { w: K.W, h: K.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame
  kessler(c, { bob: FP_BOB[i], swing: FP_SWING[i], feet: fpFeet(K.H, i) })
})
// on the phone under the canopy: "Ja ... ich bring's mit." He nods, the free hand fidgets.
anim("kessler_feed_phone", { w: K.W, h: K.H, frames: 2, ms: [900, 600], outline: "1", pivot: "bottom" },
  (c) => kessler(c, { phone: true, nod: c.frame, swing: c.frame }))

// under his open umbrella: the canopy hides him to the shoulders; under its near rim the end of the
// scarf hangs out, the brightest thing in the picture. 15x23 inside; a drop falls off the rim.
const KU = { W: 15, H: 23 }
anim("kessler_feed_umbrella", { w: KU.W, h: KU.H, frames: 2, ms: [1100, 300], outline: "1", pivot: "bottom" },
  (c) => {
    fpLegs(c, { ...K_LEGS, W: KU.W, H: KU.H, near: 8, far: 4, hip: 18 }, fpStand(KU.H))
    c.stamp("_k_body", 2, 7)
    c.stamp("_k_hand", 3, 15)
    fpCanopy(c, 0, 0)
    if (c.frame === 1) c.px(13, 9, "7")
  })

// sitting at cam04's near table, facing the camera (front three-quarter, facing down-right), at his true
// size there (cam04 measures him from the stool at y 94 to the crown at y 59; the camera stretches
// height more than width, so he is tall and narrow): the crown bowed over the table, the scarf wrapped
// round his neck and its two ends down his chest, the coat. The table's far edge hides him from the
// waist down (row 27); below it only his forearms, on the table toward us, the hands meeting. 15x35
// inside (17x37), the pivot under the stool. Frame 1: the head sinks a pixel lower.
sprite("_ks_head", `
  ..66666..
  .6666666.
  66666666.
  466666666
  446666666
  464646665
  .66666665
  .6665665.
  ..66666..`)                    // crown, the hair at the side away from us, brows and eyes cast down
const KS = { W: 15, H: 35, EDGE: 27 }
function kesslerSit(c) {
  // the coat from the shoulders to the table's edge, its far side in shadow, the front's opening
  c.rect(1, 12, 13, KS.EDGE - 12, "4"); c.rect(0, 13, 1, KS.EDGE - 13, "3"); c.rect(14, 13, 1, KS.EDGE - 13, "3")
  c.rect(12, 14, 2, KS.EDGE - 14, "3"); c.rect(7, 22, 1, KS.EDGE - 22, "3")
  // the scarf: wrapped round the neck, the two ends down his chest, fringed
  c.rect(4, 10, 7, 2, "9"); c.rect(3, 11, 1, 1, "8"); c.rect(11, 11, 1, 1, "8")
  c.rect(5, 12, 2, 9, "9"); c.rect(8, 12, 2, 11, "9"); c.px(6, 12, "8"); c.px(9, 12, "8")
  c.px(5, 21, "8"); c.px(8, 23, "8"); c.px(9, 23, "8")
  c.rect(6, 9, 3, 1, "4")                                                   // the neck in the collar
  // the arms down his sides to the elbows on the table, the forearms toward us, the hands meeting
  c.rect(0, 20, 2, 8, "3"); c.rect(13, 20, 2, 8, "3")
  c.rect(1, 27, 3, 2, "4"); c.rect(2, 29, 3, 2, "4"); c.rect(3, 31, 3, 2, "4"); c.rect(1, 28, 1, 1, "3"); c.rect(2, 30, 1, 1, "3")
  c.rect(11, 27, 3, 2, "4"); c.rect(10, 29, 3, 2, "4"); c.rect(9, 31, 3, 2, "4"); c.rect(13, 28, 1, 1, "3"); c.rect(12, 30, 1, 1, "3")
  c.rect(5, 32, 5, 2, "6"); c.rect(6, 34, 3, 1, "6"); c.px(7, 33, "5")
}
anim("kessler_feed_sit", { w: KS.W, h: KS.H, frames: 2, ms: [1500, 1100], outline: "1", pivot: "bottom" }, (c) => {
  kesslerSit(c)
  c.stamp("_ks_head", 3, c.frame)
})

// ================================================================ Herr Kessler in Chapter 1, the hood up
// Since the meeting at Yuen's he hides (game/auftrag_varga.js, cam03 and cam15): a light grey hoodie under his office coat,
// its hood up, a strip of it in the coat's opening in front. Variant A of art/test/kessler_hood_blocks.px.js, approved by
// the user 2026-11-13, painted on its lines: 11x22 inside (13x24), his build as above, the hood (8, a glint 9 on its crown)
// his tell now in place of the scarf. Front three-quarter (se) and back three-quarter (ne), and each turned (sw, nw) as
// anims of their own: the drawing flipped, the light kept from the upper left (KH_TURNED), so the engine never mirrors him.
const KH = { W: 11, H: 22 }
const KH_LEGS = { W: KH.W, H: KH.H, near: 6, far: 2, hip: 17, lw: 3, sw: 3, leg: "3", shoe: "2", sep: "1" }
// the grids' light roles: L/S the coat's lit and shaded side, H/h the hood's, G the crown's glint and Q its place when
// turned, M/m the lit and the shaded hand
const KH_LIT = { L: "5", S: "3", H: "8", h: "7", G: "9", Q: "7", M: "6", m: "5" }
const KH_TURNED = { L: "3", S: "5", H: "7", h: "8", G: "7", Q: "9", M: "5", m: "6" }
const KH_BACK_HEAD = [
  "....HGHQ...",
  "...HHHHhh..",
  "...HHHHhhh.",
  "...6HHHhhh.",
  "...67HHhhh.",
]                                  // rows 0-4: the hood from behind, pushed up-right with his head; its fold into the neck
const KH_BACK_BODY = [
  "..L66777h6.",
  ".LL4666644.",
  ".L2446642S.",
  ".L2444442S.",
  ".42444442S.",
  ".42444442S.",
  ".42444442S.",
  ".42443442S.",
  ".42443442S.",
  ".42443442S.",
  ".44443444S.",
  "..4443444..",
]                                  // rows 5-16: the hood's point down his back, the coat, its vent
const KH_FRONT_HEAD = [
  "...HGHQ....",
  "..HHHHhh...",
  "..H43334h..",
  "..H63535h..",
  "..H65555h..",
  "..7H555h7..",
]                                  // rows 0-5: the hood's rim round his face, the face in its shadow, the eyes
const KH_FRONT_BODY = [
  ".LL67776 4S.",
  ".L2L8784 2S.",
  ".L2L8784 2S.",
  ".42L8774 2S.",
  ".42L7774 2S.",
  ".42476742S.",
  ".42476742S.",
  ".42443442S.",
  ".42443442S.",
  ".44443444S.",
  "..4443444..",
].map((r) => r.replace(/ /g, ""))  // rows 6-16: the hoodie's strip in the coat's opening, its two strings, the pocket; the coat closed below
/** a grid through the light roles */
const khGrid = (c, x, y, rows, P) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, P[ch] ?? ch) }))
function kesslerHood(c, o = {}) {
  const b = o.bob ?? 0, sw = o.swing ?? 0, P = o.turned ? KH_TURNED : KH_LIT, front = o.front
  fpLegs(c, KH_LEGS, o.feet ?? fpStand(KH.H), b)
  khGrid(c, 0, (front ? 6 : 5) + b, front ? KH_FRONT_BODY : KH_BACK_BODY, P)
  c.rect(1, 13 + b - sw, 1, 2, P.M); c.rect(9, 13 + b + sw, 1, 2, P.m)
  khGrid(c, o.look ?? 0, b, front ? KH_FRONT_HEAD : KH_BACK_HEAD, P)
}
// idle: he stands, and glances back over his shoulder now and then (as the old Kessler did); walks as everyone's
for (const [dir, front, turned] of [["se", true, false], ["sw", true, true], ["ne", false, false], ["nw", false, true]]) {
  const flip = turned ? { flip: "x" } : {}
  anim(`kessler_hood_feed_${dir}`, { w: KH.W, h: KH.H, frames: 2, ms: [1600, 700], outline: "1", pivot: "bottom", ...flip },
    (c) => kesslerHood(c, { front, turned, look: -c.frame }))
  anim(`kessler_hood_feed_walk_${dir}`, { w: KH.W, h: KH.H, frames: 6, fps: 10, outline: "1", pivot: "bottom", ...flip }, (c) => {
    const i = c.frame
    kesslerHood(c, { front, turned, bob: FP_BOB[i], swing: FP_SWING[i], feet: front ? fpFeetFront(KH.H, i) : fpFeet(KH.H, i) })
  })
}

// ================================================================ Gus Varga
// 15x24 inside (17x26): broad, a felt hat, a long grey coat, all of it darker than the street but
// for the watch. Rim 0.
const V = { W: 15, H: 24 }
const V_LEGS = { W: V.W, H: V.H, near: 8, far: 4, hip: 20, lw: 3, sw: 4, leg: "2", shoe: "2", sep: "1" }
sprite("_v_hat", `
  ......333......
  .....33333.....
  ...223333322...
  ..22222222222..
  ...222222222...`)              // the crown, the brim round it
sprite("_v_body", `
  .....22322.....
  ..33333333333..
  .3333333333333.
  332333333333233
  332333333333233
  332333333333233
  332333323333233
  332333323333233
  332333323333233
  ..2333323333...
  ..3333323333...
  ..3333323333...
  ..3333323333...
  ..3333323333...
  ...333323333...`)              // rows 5-19: the collar turned up, shoulders, the vent
sprite("_v_hand_l", "98\n44\n44")   // the watch on his left wrist (screen left), the hand under it
sprite("_v_hand_r", "33\n44\n44")
function varga(c, o = {}) {
  const b = o.bob ?? 0, sw = o.swing ?? 0
  fpLegs(c, V_LEGS, o.feet ?? fpStand(V.H), b)
  c.stamp("_v_body", 0, 5 + b)
  c.stamp("_v_hand_l", 0, 14 + b - sw)
  c.stamp("_v_hand_r", 13, 14 + b + sw)
  c.stamp("_v_hat", o.look ?? 0, b)
}
anim("varga_feed", { w: V.W, h: V.H, frames: 2, ms: [2000, 900], outline: "0", pivot: "bottom" },
  (c) => varga(c, { look: c.frame }))
anim("varga_feed_walk", { w: V.W, h: V.H, frames: 6, fps: 10, outline: "0", pivot: "bottom" }, (c) => {
  const i = c.frame
  varga(c, { bob: FP_BOB[i], swing: FP_SWING[i], feet: fpFeet(V.H, i) })
})
// at cam04's near table, his back to the camera, at his true size there (the stool at y 132, the hat's
// crown at y 103): the hat, the collar turned up, the broad back of the coat with its seam and its vent
// spread on the stool; his hands rest on the table in front of him (up the picture, beside his hat), the
// left one with the watch; frame 1 its fingers drum. 19x29 inside (21x31), the pivot under the stool.
sprite("_vs_hat", `
  ..44444..
  .4444344.
  .4444344.
  1111111111.
  44444444444
  .444444444.
  ..1111111..`)                   // the crown with its dent and band, the brim round it, its shadow on the collar
const VS = { W: 21, H: 29 }
function vargaSit(c) {
  // the coat: the collar up under the brim, the broad shoulders, the back narrowing to the stool
  c.rect(6, 7, 9, 2, "2")
  c.rect(2, 9, 17, 3, "3"); c.rect(3, 12, 15, 8, "3"); c.rect(4, 20, 13, 6, "3"); c.rect(5, 26, 11, 3, "3")
  c.rect(2, 10, 1, 2, "2"); c.rect(18, 10, 1, 2, "2"); c.rect(3, 12, 1, 8, "2"); c.rect(17, 12, 1, 8, "2")
  c.rect(10, 9, 1, 14, "2"); c.rect(10, 23, 1, 6, "1")                     // the back seam, the vent
  c.rect(5, 27, 2, 2, "2"); c.rect(14, 27, 2, 2, "2")                       // the coat's tails over the stool
  // the forearms forward onto the table, clear of the hat: the left (screen left) with the watch
  c.rect(1, 6, 2, 4, "3"); c.rect(0, 4, 2, 2, "3"); c.rect(0, 3, 2, 1, "9"); c.px(1, 3, "8"); c.rect(0, 1, 2, 2, "4")
  c.rect(18, 6, 2, 4, "3"); c.rect(19, 4, 2, 2, "3"); c.rect(19, 2, 2, 2, "4")
}
anim("varga_feed_sit", { w: VS.W, h: VS.H, frames: 2, ms: [1300, 400], outline: "0", pivot: "bottom" }, (c) => {
  vargaSit(c)
  c.stamp("_vs_hat", 5, 1)
  if (c.frame === 1) c.px(0, 1, "_"), c.px(0, 2, "4"), c.px(1, 0, "4")          // a finger lifts, taps
})

// ================================================================ commuters (cam03, 22:00)
// A: under an umbrella (Kessler's umbrella, no scarf under it). 15x23 inside.
const CA = { W: 15, H: 23 }
const CA_LEGS = { W: CA.W, H: CA.H, near: 8, far: 4, hip: 18, lw: 3, sw: 3, leg: "2", shoe: "2", sep: "1" }
sprite("_ca_body", `
  ..3333333..
  .333333333.
  .323333323.
  .323333323.
  .323333323.
  .323333323.
  .333333333.
  ..3333333..`)                  // rows 10-17 of the canvas: the coat under the canopy
function commuterA(c, o = {}) {
  const b = o.bob ?? 0
  fpLegs(c, CA_LEGS, o.feet ?? fpStand(CA.H), b)
  c.stamp("_ca_body", 2, 10 + b)
  fpCanopy(c, 0, b + (o.tilt ?? 0))
}
anim("commuter_a_feed", { w: CA.W, h: CA.H, frames: 1, outline: "1", pivot: "bottom" }, (c) => commuterA(c))
anim("commuter_a_feed_walk", { w: CA.W, h: CA.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame
  commuterA(c, { bob: FP_BOB[i], feet: fpFeet(CA.H, i) })
})

// B: a hood up, a short jacket, jeans, hands in the pockets. 11x21 inside.
const CB = { W: 11, H: 21 }
const CB_LEGS = { W: CB.W, H: CB.H, near: 5, far: 2, hip: 14, lw: 3, sw: 3, leg: "2", shoe: "2", sep: "1" }
sprite("_cb_hood", `
  ..5..
  .555.
  55555
  55555
  45554
  .444.`)
sprite("_cb_body", `
  ..4444444..
  .444444444.
  .424444424.
  .424444424.
  .424444424.
  .424444424.
  .444444444.
  .444444444.
  ..4444444..`)                  // rows 5-13
function commuterB(c, o = {}) {
  const b = o.bob ?? 0
  fpLegs(c, CB_LEGS, o.feet ?? fpStand(CB.H), b)
  c.stamp("_cb_body", 0, 5 + b)
  c.stamp("_cb_hood", 3 + (o.look ?? 0), b)
}
anim("commuter_b_feed", { w: CB.W, h: CB.H, frames: 2, ms: [1200, 900], outline: "1", pivot: "bottom" },
  (c) => commuterB(c, { look: c.frame }))
anim("commuter_b_feed_walk", { w: CB.W, h: CB.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame
  commuterB(c, { bob: FP_BOB[i], feet: fpFeet(CB.H, i) })
})

// N: the neighbour in CAM 24 (Chapter 2, W1, the code at 19:30; the user chose way A of art/test/k2_leih_blocks.px.js, 2026-11-19): an
// older man in a flat cap and a long coat to the knees, a bag from the 24-hour shop down his street in his near hand, swinging as he
// walks; its white is his accent (9). 13x23 inside.
const CN = { W: 13, H: 23 }
const CN_LEGS = { W: CN.W, H: CN.H, near: 6, far: 3, hip: 17, lw: 3, sw: 3, leg: "2", shoe: "2", sep: "1" }
sprite("_cn_cap", `
  .33333.
  3333333
  2333332
  .55555.
  ..555..`)                     // the cap's crown, its peak in shade, the grey nape under it
sprite("_cn_body", `
  ..44444..
  .4444444.
  444444444
  434444434
  434444434
  434444434
  434444434
  444444444
  444444444
  444444444
  .4444444.
  .3444443.`)                    // rows 5-16: the long coat, its seams, the hem
function neighbour(c, o = {}) {
  const b = o.bob ?? 0, sw = o.sway ?? 0
  fpLegs(c, CN_LEGS, o.feet ?? fpStand(CN.H), b)
  c.stamp("_cn_body", 1, 5 + b)
  c.stamp("_cn_cap", 2 + (o.look ?? 0), b)
  // the near hand, the bag's handles, the bag: white, its print a line darker, the weight pulling it straight
  c.px(10, 13 + b, "6"); c.vline(10, 14 + b, 2, "8")
  c.rect(9, 16 + b + sw, 4, 5, "9"); c.hline(9, 18 + b + sw, 4, "8"); c.px(9, 20 + b + sw, "8")
}
anim("nachbar_feed", { w: CN.W, h: CN.H, frames: 2, ms: [1400, 700], outline: "1", pivot: "bottom" },
  (c) => neighbour(c, { look: c.frame }))
anim("nachbar_feed_walk", { w: CN.W, h: CN.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame
  neighbour(c, { bob: FP_BOB[i], sway: FP_SWING[i] < 0 ? -1 : 0, feet: fpFeet(CN.H, i) })
})

// C: the decoy. Tall, a long dark coat, and a scarf of the same cut as Kessler's, but dark wool:
// in the phosphor a mid value (6) where Kessler's is the brightest (9). 11x24 inside (13x26).
const CC = { W: 11, H: 24 }
const CC_LEGS = { W: CC.W, H: CC.H, near: 6, far: 2, hip: 20, lw: 3, sw: 3, leg: "2", shoe: "2", sep: "1" }
sprite("_cc_head", `
  .444.
  44544
  44444
  44444
  .444.`)                        // dark hair, a parting catching the light
sprite("_cc_body", `
  ...666666..
  .336666663.
  .326633323.
  .326633323.
  .326633323.
  .323633323.
  .323333323.
  .323333323.
  .323333323.
  .333333333.
  ..3333333..
  ..3333333..
  ..3332333..
  ..3332333..
  ...33233...`)                  // rows 5-19: the scarf, the long coat with its vent
sprite("_cc_hand", "4\n4")
function commuterC(c, o = {}) {
  const b = o.bob ?? 0, sw = o.swing ?? 0
  fpLegs(c, CC_LEGS, o.feet ?? fpStand(CC.H), b)
  c.stamp("_cc_body", 0, 5 + b)
  c.stamp("_cc_hand", 9, 14 + b + sw)
  c.stamp("_cc_hand", 1, 14 + b - sw)
  c.stamp("_cc_head", 3 + (o.look ?? 0), b)
}
anim("commuter_c_feed", { w: CC.W, h: CC.H, frames: 2, ms: [1500, 800], outline: "1", pivot: "bottom" },
  (c) => commuterC(c, { look: c.frame }))
anim("commuter_c_feed_walk", { w: CC.W, h: CC.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame
  commuterC(c, { bob: FP_BOB[i], swing: FP_SWING[i], feet: fpFeet(CC.H, i) })
})

// D: a woman, long dark hair down her back, a light coat belted, a bag at her right hip on a strap
// from the left shoulder. 11x20 inside (13x22).
const CD = { W: 11, H: 20 }
const CD_LEGS = { W: CD.W, H: CD.H, near: 5, far: 3, hip: 15, lw: 2, sw: 2, leg: "2", shoe: "2", sep: "1" }
sprite("_cd_head", `
  .333.
  33333
  33333
  33333
  33333
  .333.`)
sprite("_cd_body", `
  ..5333355..
  .563333555.
  .556333555.
  .555333555.
  .555565555.
  .555556555.
  .444444644.
  .555555556.
  ..5555555..
  ..5555555..`)                  // rows 5-14: hair over the shoulders, the strap, the belt
sprite("_cd_bag", "666\n666\n566")
function commuterD(c, o = {}) {
  const b = o.bob ?? 0
  fpLegs(c, CD_LEGS, o.feet ?? fpStand(CD.H), b)
  c.stamp("_cd_body", 0, 5 + b)
  c.stamp("_cd_bag", 8 + (o.bag ?? 0), 12 + b)
  c.stamp("_cd_head", 3 + (o.look ?? 0), b)
}
anim("commuter_d_feed", { w: CD.W, h: CD.H, frames: 2, ms: [1300, 700], outline: "1", pivot: "bottom" },
  (c) => commuterD(c, { look: -c.frame }))
anim("commuter_d_feed_walk", { w: CD.W, h: CD.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame
  commuterD(c, { bob: FP_BOB[i], bag: [0, 0, 1, 1, 0, 0][i], feet: fpFeet(CD.H, i) })
})

// ================================================================ the diner cook (cam04)
// Behind his counter, facing the room (front three-quarter, facing down-right): a paper cap (8),
// the apron (7), chopping: the cleaver hand up, down, up, then a rest with his head up. Drawn at his
// true size there (cam04 measures a 1.75 m man at 42 px behind the counter) but only as the bust the
// counter leaves: from the cap down to where the counter's top hides him (game/places.js cookBust,
// the counter's back edge), so nothing of him shows through it. 17x22 inside (19x24).
const YC = { W: 17, H: 22 }
const YC_CHOP = [1, 0, 1, 0]        // 1: raised
anim("yuen_cook_feed", { w: YC.W, h: YC.H, frames: 4, ms: [150, 150, 150, 700], outline: "1", pivot: "bottom" }, (c) => {
  const up = YC_CHOP[c.frame], rest = c.frame === 3
  // the shirt, the shoulders rounded, its shadow side away from the hood's light
  c.rect(2, 10, 13, 12, "4"); c.px(2, 10, "."); c.px(14, 10, "."); c.rect(13, 11, 2, 11, "3")
  // the apron: the bib on its straps, the skirt from the waist
  c.px(6, 10, "7"); c.px(10, 10, "7"); c.rect(6, 11, 5, 5, "7"); c.rect(4, 16, 9, 6, "7"); c.rect(11, 16, 2, 6, "6"); c.px(8, 18, "6"); c.px(8, 19, "6")
  // the head: the cap, the hair under it, the face looking down at the board (up in the rest)
  c.rect(4, 9, 9, 1, "3"); c.rect(7, 9, 3, 1, "5")                       // the shadow under his chin, the neck
  c.rect(5, 4, 7, 5, "6"); c.rect(11, 4, 1, 5, "5"); c.rect(6, 8, 5, 1, "5")
  const ey = rest ? 5 : 6
  c.px(6, ey, "3"); c.px(9, ey, "3"); c.px(8, ey + 1, "5")
  c.rect(5, 3, 7, 1, "3")
  c.rect(6, 0, 5, 1, "8"); c.rect(5, 1, 7, 1, "8"); c.rect(4, 2, 9, 1, "7"); c.px(11, 1, "7")
  // his left arm (screen right): the hand on what he cuts
  c.rect(14, 11, 2, 5, "4"); c.rect(12, 17, 3, 2, "4"); c.rect(10, 19, 2, 2, "6")
  // his right arm (screen left) and the cleaver: raised by his head, or down on the board
  if (up) { c.rect(1, 11, 2, 4, "5"); c.rect(2, 9, 2, 3, "5"); c.rect(2, 7, 2, 2, "6"); c.rect(1, 3, 3, 4, "8"); c.px(1, 6, "7") }
  else { c.rect(1, 11, 2, 5, "5"); c.rect(2, 16, 3, 2, "5"); c.rect(4, 18, 2, 2, "6"); c.rect(5, 19, 3, 3, "8"); c.px(7, 21, "7") }
})

// ================================================================ the end of Chapter 1 (cam31; kapitel1-design §8)
// cam31 looks across the water at the platform, so people on it face the camera: unlike the prologue's feed people these
// have a front three-quarter (facing down-right) as well as a back one (up-right). The game's palette pass darkens every
// value (raw 7 comes out at 4, 8 at 5.7, 9 at 7.5): judge them through the game, not here.

// ---------------------------------------------------------------- Dr. Ines Calder, 13x20 inside (15x22)
// The coat 9, brighter than everything; the dark plait the one thing cut into it, over the shoulder in front, down the back
// behind. The bag stays in her right hand, so it changes sides with the view: screen left from in front, which leaves the
// other hand free for the wallet, screen right from behind.
const FI = { W: 13, H: 20 }
const FI_LEGS = { W: FI.W, H: FI.H, near: 7, far: 4, hip: 15, lw: 2, sw: 2, leg: "6", shoe: "4", sep: "3" }
sprite("_i_head_front", `
  .444.
  43334
  49999
  49696
  .9992`)                        // the hair drawn back from a three-quarter face; the plait begins at her jaw
sprite("_i_head_back", `
  .555.
  56665
  45554
  44444
  .333.`)                        // wet hair, gathered at the nape into the plait
sprite("_i_coat_front", `
  ..99792.
  99999922
  99999922
  99999922
  89998929
  89998929
  89998929
  89998939
  .9998999
  .9998999
  .9998998`)                     // rows 5-15, columns 2-9: the collar, the coat's opening; the plait off to the side, over the shoulder, or it reads as a tie
sprite("_i_coat_back", `
  ..99299..
  999229999
  999229999
  999229999
  899229998
  899929998
  899929998
  899939998
  .9998999.
  .9998999.
  .9998998.`)                    // rows 5-15, columns 2-10: the plait, tapering; the coat's vent
sprite("_i_bag", `
  666
  444
  444
  443`)
function ines(c, o = {}) {
  const x = o.x ?? 0, b = o.bob ?? 0, sw = o.swing ?? 0, back = o.back
  fpLegs(c, { ...FI_LEGS, W: o.w ?? FI.W, near: FI_LEGS.near + x, far: FI_LEGS.far + x }, o.feet ?? fpStand(FI.H), b)
  if (back) {
    c.stamp("_i_coat_back", x + 2, 5 + b)
    c.rect(x + 2, 13 + b - sw, 1, 2, "8")                                    // the free hand
    c.rect(x + 10, 13 + b + sw, 1, 1, "8"); c.stamp("_i_bag", x + 10, 14 + b + sw + (o.sag ?? 0))
    c.stamp("_i_head_back", x + 4 + (o.look ?? 0), b)
  } else {
    c.stamp("_i_coat_front", x + 2, 5 + b)
    c.rect(x + 2, 13 + b - sw, 1, 1, "8"); c.stamp("_i_bag", x, 14 + b - sw + (o.sag ?? 0))
    if (!o.give) { c.rect(x + 10, 6 + b, 1, 3, "9"); c.rect(x + 10, 9 + b, 1, 4, "8"); c.rect(x + 10, 13 + b + sw, 1, 2, "8") }
    c.stamp("_i_head_front", x + 4 + (o.look ?? 0), b)
  }
}
// she glances at the tunnel; the bag is heavy, it sinks a pixel
anim("ines_feed_front", { w: FI.W, h: FI.H, frames: 2, ms: [1700, 800], outline: "1", pivot: "bottom" }, (c) => ines(c, { look: c.frame, sag: c.frame }))
anim("ines_feed_back", { w: FI.W, h: FI.H, frames: 2, ms: [1700, 800], outline: "1", pivot: "bottom" }, (c) => ines(c, { back: true, look: c.frame, sag: c.frame }))
anim("ines_feed_front_walk", { w: FI.W, h: FI.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame; ines(c, { bob: FP_BOB[i], swing: FP_SWING[i], feet: fpFeetFront(FI.H, i) })
})
anim("ines_feed_back_walk", { w: FI.W, h: FI.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame; ines(c, { back: true, bob: FP_BOB[i], swing: FP_SWING[i], feet: fpFeet(FI.H, i) })
})
// The handover: her free arm down-right toward the water, the wallet in the hand, on it the one small light (story §10c).
// 22x20 inside (24x22).
const IG_W = 22
sprite("_i_arm_give", `
  99......
  989.....
  .989....
  ..989...
  ...989..
  ....9877
  .....877`)
// Only as wide as her reach, with its feet at x 7: tools/build_art.sh writes the anchor, or the implant's brackets, which go by the canvas, jump.
anim("ines_feed_give", { w: IG_W, h: FI.H, frames: 2, ms: [450, 350], outline: "1", pivot: "bottom" }, (c) => {
  ines(c, { w: IG_W, give: true, look: 1 })
  c.stamp("_i_arm_give", 10, 6)
  c.rect(18, 10, 4, 4, "2"); c.rect(19, 11, 2, 2, c.frame ? "4" : "9")   // 2x2, or the scanlines and the grain eat it
})
// At Pho Pump's counter (CAM 22, frontal and near: the user approved the block on 2026-11-12): her upper body over the counter,
// facing us, at that camera's scale (38 px from the counter's edge to the top of her head). The white coat 9 stays her accent; the
// plait over her left shoulder; her left hand flat on the napkin by her bowl, the right at the bowl. Frame 1 is the glance: her
// head turns to the door, her eyes with it (Thursday she looks there all the time; Wednesday she hides what she wrote).
anim("ines_feed_bar", { w: 26, h: 38, frames: 2, ms: [2200, 900], outline: "1", pivot: "bottom" }, (c) => {
  const g = c.frame                                                        // the glance: the head 1 px toward the door, the eyes 2
  // the coat over the shoulders, open at the front over a dark top, its shading on the right, the folds at the elbows
  c.rect(4, 16, 18, 22, "9"); c.rect(2, 18, 2, 16, "9"); c.rect(22, 18, 2, 14, "9")
  c.rect(3, 17, 2, 2, "9"); c.rect(21, 17, 2, 2, "9")
  c.rect(18, 18, 4, 20, "8"); c.rect(22, 20, 2, 12, "8"); c.vline(2, 22, 10, "8")
  c.rect(10, 16, 6, 9, "3"); c.px(10, 16, "9"); c.px(15, 16, "9"); c.rect(11, 25, 4, 13, "4")   // the open front, the dark top under it
  c.vline(9, 17, 21, "7"); c.vline(16, 17, 21, "7")                                              // the lapels' edges
  c.hline(3, 27, 3, "8"); c.hline(21, 27, 3, "7")                                                // the elbows
  // her hands: the left flat on the napkin (on our right), the right at the bowl
  c.rect(20, 34, 6, 3, "8"); c.hline(20, 34, 6, "9"); c.rect(1, 34, 4, 3, "7")
  // the neck, the head: dark hair parted, the face lit from the lamps above, the eyes, the mouth
  c.rect(11, 13, 4, 3, "6")
  c.rect(8 - g, 1, 10, 13, "2"); c.rect(9 - g, 0, 8, 2, "2"); c.px(12 - g, 1, "3"); c.px(13 - g, 1, "3")
  c.rect(9 - g, 4, 8, 9, "7"); c.rect(9 - g, 4, 8, 2, "6"); c.vline(16 - g, 6, 6, "6")
  c.rect(10 - g * 2, 7, 2, 1, "2"); c.rect(14 - g * 2, 7, 2, 1, "2")                             // the eyes
  c.hline(12 - g, 10, 2, "5")                                                                    // the mouth
  c.rect(9 - g, 12, 8, 1, "6")
  // the plait over her left shoulder (on our right), cut into the coat
  for (let y = 9; y < 28; y++) { const x = 18 + Math.round((y - 9) * 0.12); c.px(x, y, y % 3 === 0 ? "3" : "2"); c.px(x + 1, y, y % 3 === 1 ? "3" : "2") }
  c.rect(18, 28, 3, 2, "4")                                                                      // its tie
})
// where she fell: on her side across the picture, shoulder and hip under the coat, still the brightest thing, an arm flung out
// toward us, the plait and the bag thrown away from her. 29x7 inside (31x9); the pivot under her hip.
sprite("_i_down", `
  ...2222..........99999.......
  ..22999..9999..999999999.....
  ..2999689999999999999955.....
  ..229988999989999999995553...
  22222...88888888888888....666
  .......98899999...........444
  ..........................443`)
anim("ines_feed_down", { w: 29, h: 7, frames: 1, outline: "1", pivot: "bottom" }, (c) => c.stamp("_i_down", 0, 0))

// ---------------------------------------------------------------- Lantern, 33x36 inside (35x38)
// Marit Holm, the nurse at the clinic's intake (Chapter 2, kapitel2-design §3.2 K1), painted on the lines of the block the user approved
// (art/test/klinik_figuren_blocks.px.js, 2026-11-17), at Ines' scale in CAM 21 (13x20 inside): the short coat 9 to the hips, the scrubs
// 7 below it (Ines' legs are 6 under a long coat), white clogs; ash-blond hair 7 in a bun. She comes to her night shift from the left
// to the door under the camera, so the feed sees her from the front; twice she looks back over her shoulder (marit_feed_look).
const FM = { W: 13, H: 20 }
const FM_LEGS = { W: FM.W, H: FM.H, near: 7, far: 4, hip: 14, lw: 2, sw: 2, leg: "7", shoe: "9", sep: "4" }
sprite("_m_head_front", `
  77...
  7777.
  78888
  75858
  .888.`)                        // the bun at the back of her head (upper left), the face turned to the lower right
sprite("_m_head_look", `
  ..77.
  .7777
  77777
  87776
  .866.`)                        // looking back over her left shoulder: the back of her head, the bun, her cheek's edge
sprite("_m_head_back", `
  .777.
  77677
  77777
  67776
  .666.`)                        // the bun on the back of her head, her hair drawn tight
function marit(c, o = {}) {
  const b = o.bob ?? 0, sw = o.swing ?? 0, back = o.back
  fpLegs(c, FM_LEGS, o.feet ?? fpStand(FM.H), b)
  // the short coat to the hips, its far side darker; the arms at its sides, the hands swinging
  c.rect(3, 5 + b, 7, 10, "9"); c.vline(3, 6 + b, 9, "8"); c.hline(3, 14 + b, 7, "8"); c.px(3, 5 + b, "8"); c.px(9, 5 + b, "8")
  c.rect(2, 6 + b, 1, 6, "8"); c.px(2, 12 + b - sw, "8"); c.px(2, 13 + b - sw, "7")
  c.rect(10, 6 + b, 1, 6, "9"); c.px(10, 12 + b + sw, "8"); c.px(10, 13 + b + sw, "7")
  if (back) c.vline(6, 10 + b, 5, "8")                                       // the vent at the back
  else {
    c.px(6, 5 + b, "7"); c.px(6, 6 + b, "7"); c.vline(6, 7 + b, 7, "8")      // the scrubs in the coat's V, the coat's opening
    c.hline(7, 8 + b, 2, "5")                                                  // the name tag
  }
  c.stamp(back ? "_m_head_back" : o.look ? "_m_head_look" : "_m_head_front", 4, b)
}
anim("marit_feed_front", { w: FM.W, h: FM.H, frames: 1, outline: "1", pivot: "bottom" }, (c) => marit(c))
anim("marit_feed_back", { w: FM.W, h: FM.H, frames: 1, outline: "1", pivot: "bottom" }, (c) => marit(c, { back: true }))
// she stops and looks back toward the street, twice
anim("marit_feed_look", { w: FM.W, h: FM.H, frames: 4, ms: [500, 900, 400, 900], outline: "1", pivot: "bottom" }, (c) => marit(c, { look: c.frame % 2 === 1 }))
anim("marit_feed_front_walk", { w: FM.W, h: FM.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame; marit(c, { bob: FP_BOB[i], swing: FP_SWING[i], feet: fpFeetFront(FM.H, i) })
})
anim("marit_feed_back_walk", { w: FM.W, h: FM.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame; marit(c, { back: true, bob: FP_BOB[i], swing: FP_SWING[i], feet: fpFeet(FM.H, i) })
})

// The painted Lantern (art/characters/lantern.px.js) as the feeds see him crossing the picture, from the side, painted on the lines of
// the block the user approved (2026-11-16, art/test/lantern_feed_blocks.px.js, docs/characters/lantern_feed_blocks_*): the same measures
// in metres, at 21 px a metre, larger than the scale as the user chose for him (at 24 px the wheel didn't read). Two views, drawn and
// never mirrored: to the right we see his right side and the ocular, to the left his left side, the antennas in front of his head and
// the headset's cup. His accent is the crest, 9; nothing else on him reaches it. Standing: his breath, the antennas' lights in turn, the
// lantern at his neck flickering; driving: the spokes turning.
//   lantern_feed_r, lantern_feed_l              standing, 4 x 600 ms
//   lantern_feed_drive_r, lantern_feed_drive_l  driving, 4 x 110 ms (the wheels a quarter of a spoke's turn a frame)
const LF = { W: 35, H: 38, K: 21 }
/** a point of him (metres): f forward, d toward the far side, h up -> px; dir 1 facing right, -1 left */
const lfAt = (dir, f, d, h) => [Math.round(17 + dir * f * LF.K + d * LF.K * 0.35), Math.round(35 - h * LF.K - d * LF.K * 0.3)]
/** a filled polygon (scanline); key may be a function of (x, y) */
function lfPoly(c, pts, k) {
  const ys = pts.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys)
  for (let y = y0; y <= y1; y++) {
    const xs = []
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length]
      if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax))
    }
    xs.sort((a, b) => a - b)
    for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) {
      const kk = typeof k === "function" ? k(x, y) : k
      if (kk) c.px(x, y, kk)
    }
  }
}
/** a part's side face (f0..f1, h0..h1 at depth d), lit along its top row when `top` is given */
function lfSide(c, dir, f0, f1, h0, h1, d, k, top) {
  const pts = [lfAt(dir, f0, d, h0), lfAt(dir, f1, d, h0), lfAt(dir, f1, d, h1), lfAt(dir, f0, d, h1)], y0 = Math.min(...pts.map((p) => p[1]))
  lfPoly(c, pts, top ? (x, y) => (y === y0 ? top : k) : k)
}
/** a wheel in the plane of his facing: the tyre lit along its upper arc, the rim, three spokes turned by `turn`, the hub; on the
 *  near one the push rim inside the tyre */
function lfWheel(c, dir, f, d, h, r, turn, near) {
  const [cx, cy] = lfAt(dir, f, d, h), R = r * LF.K
  for (let y = Math.floor(cy - R - 1); y <= cy + R + 1; y++) for (let x = Math.floor(cx - R - 1); x <= cx + R + 1; x++) {
    const q = Math.hypot(x + 0.5 - cx, y + 0.5 - cy), up = y + 0.5 < cy - R * 0.35 && x + 0.5 < cx + R * 0.4
    if (q <= R && q > R - 1.6) c.px(x, y, near ? (up ? "8" : "7") : "4")
    else if (q <= R - 1.6 && q > R - 2.5) c.px(x, y, near ? "5" : "3")
  }
  for (let i = 0; i < 3; i++) {
    const t = turn + (i / 3) * Math.PI, dx = Math.cos(t) * (R - 2.4), dy = Math.sin(t) * (R - 2.4)
    c.line(Math.round(cx - dx), Math.round(cy - dy), Math.round(cx + dx), Math.round(cy + dy), near ? "6" : "3")
  }
  if (near) for (let i = 0; i < 20; i += 2) {                                         // the push rim, a dotted ring inside the tyre
    const t = (i / 20) * Math.PI * 2
    c.px(Math.round(cx + Math.cos(t) * (R - 3.4)), Math.round(cy + Math.sin(t) * (R - 3.4)), "5")
  }
  c.rect(Math.round(cx) - (near ? 1 : 0), Math.round(cy) - (near ? 1 : 0), near ? 2 : 1, near ? 2 : 1, near ? "8" : "4")
}
/** Lantern in his chair from the side; dir 1 right, -1 left; b his breath; turn the wheels' angle; f the frame */
function lanternFeed(c, dir, { b = 0, turn = 0, f = 0 } = {}) {
  const right = dir === 1, hb = b / LF.K
  // the float under the chair (he comes over the water): its dark hull, a lit seam along its top
  lfSide(c, dir, -0.38, 0.5, -0.02, 0.06, 0, "3", "5")
  // the far wheel, the backrest and the push handle
  lfWheel(c, dir, -0.05, 0.4, 0.36, 0.36, turn, false)
  lfSide(c, dir, -0.3, -0.25, 0.5, 0.98, 0.1, "4"); lfSide(c, dir, -0.38, -0.25, 0.92, 0.98, 0.1, "6")
  // the seat, the caster on its fork, the footrest
  lfSide(c, dir, -0.22, 0.26, 0.45, 0.52, 0, "4", "5")
  lfSide(c, dir, 0.3, 0.34, 0.08, 0.45, 0, "4"); lfWheel(c, dir, 0.32, -0.05, 0.06, 0.07, turn * 3, true)
  lfSide(c, dir, 0.36, 0.58, 0.06, 0.1, 0, "5", "6")
  // the legs: the thigh along the seat lit on top, the shin, the boot with its toe cap worn to steel
  lfSide(c, dir, -0.05, 0.46, 0.5, 0.64, -0.05, "5", "6"); lfSide(c, dir, 0.36, 0.5, 0.12, 0.6, -0.05, "4")
  lfSide(c, dir, 0.4, 0.64, 0.05, 0.15, -0.05, "3", "4")
  { const [x, y] = lfAt(dir, 0.6, -0.05, 0.1); c.px(x, y, "5") }
  // the poncho from the shoulders over the lap: lit along its back and shoulders, folds falling, the hem darker; the hood thrown back
  const sh = 1.05 - hb, P = [lfAt(dir, -0.16, 0, sh), lfAt(dir, 0.08, 0, sh), lfAt(dir, 0.24, 0, 0.66), lfAt(dir, -0.2, 0, 0.66)]
  const top = Math.min(...P.map((p) => p[1])), bot = Math.max(...P.map((p) => p[1])), [bx] = lfAt(dir, -0.16, 0, sh)
  lfPoly(c, P, (x, y) => (y >= bot - 1 ? "5" : y <= top + 1 || Math.abs(x - bx) <= 1 ? "7" : (x * 2 + y) % 7 === 0 ? "5" : "6"))
  lfSide(c, dir, -0.24, -0.12, sh - 0.14, sh + 0.02, 0.05, "5", "6")
  // the patches: one lit (7, its stitches 8), one dark (4), one mid (5)
  lfSide(c, dir, 0.05, 0.17, 0.7, 0.8, -0.1, "7", "8"); lfSide(c, dir, -0.12, -0.02, 0.82, 0.92, -0.1, "4"); lfSide(c, dir, -0.04, 0.06, 0.68, 0.74, -0.1, "5")
  // the arm down to the hand on the near wheel's push rim
  lfSide(c, dir, -0.04, 0.04, 0.6, sh - 0.1, -0.12, "5"); lfSide(c, dir, -0.04, 0.05, 0.53, 0.6, -0.12, "6")
  // the head: the shaved scalp behind, the face toward his front lit, the jaw in shade; the nose, the mouth
  lfSide(c, dir, -0.12, 0.12, 1.06 - hb, 1.34 - hb, 0, "5")
  lfSide(c, dir, 0.0, 0.12, 1.1 - hb, 1.31 - hb, -0.02, "6"); lfSide(c, dir, 0.06, 0.12, 1.14 - hb, 1.3 - hb, -0.02, "7")
  lfSide(c, dir, 0.0, 0.12, 1.06 - hb, 1.1 - hb, -0.02, "5")
  { const [x, y] = lfAt(dir, 0.15, -0.02, 1.2 - hb); c.px(x, y, "7") }                 // the nose, a pixel out of the face
  { const [x, y] = lfAt(dir, 0.11, -0.02, 1.12 - hb); c.px(x, y, "3") }                 // the mouth
  // the crest (his accent) from the brow to the nape, its spikes along the top
  lfSide(c, dir, -0.14, 0.1, 1.34 - hb, 1.44 - hb, 0, "9")
  for (const [ff, hh] of [[-0.11, 1.49], [-0.03, 1.51], [0.05, 1.49]]) { const [x, y] = lfAt(dir, ff, 0, hh - hb); c.px(x, y, "9"); c.px(x, y + 1, "9") }
  { const [x, y] = lfAt(dir, -0.14, 0, 1.36 - hb); c.px(x, y, "8") }
  // his right side to us: the ocular over the near eye, its ring and its lens; his left side: the narrowed eye and the headset's cup
  // over his ear, its light
  const [ex, ey] = lfAt(dir, 0.1, -0.05, 1.23 - hb)
  if (right) { c.px(ex, ey, "8"); c.px(ex - dir, ey, "4"); c.px(ex, ey - 1, "4"); c.px(ex - dir, ey - 1, "4") }
  else {
    c.px(ex, ey, "2")
    const [hx, hy] = lfAt(dir, -0.04, -0.12, 1.2 - hb)
    c.rect(hx - 1, hy - 1, 2, 3, "3"); c.px(hx, hy, f % 4 === 0 ? "7" : "6")
  }
  // the lantern at his chest on its cable, its flame flickering
  const [lx, ly] = lfAt(dir, 0.12, -0.08, 0.92 - hb)
  c.px(lx, ly - 1, "3"); c.px(lx, ly, f % 3 === 1 ? "7" : "8")
  // the near wheel over his side
  lfWheel(c, dir, -0.05, -0.3, 0.36, 0.36, turn, true)
}
/** the antennas from the headset on his left ear, leaning back, thin, their lights at the tips in turn */
function lanternFeedAntennas(c, dir, { b = 0, lit = 0 } = {}) {
  const [hx, hy] = lfAt(dir, -0.04, dir === 1 ? 0.12 : -0.12, 1.22 - b / LF.K)
  for (const [i, back, len] of [[0, 2, 9], [1, 4, 11], [2, 6, 8]]) {
    const x1 = hx - dir * back, y1 = hy - len
    c.line(hx, hy, x1, y1, "4"); c.px(x1, y1, lit === i ? "8" : "6")
  }
}
const LF_BREATH = [0, 0, 1, 1]
for (const [dir, n] of /** @type {[number, string][]} */ ([[1, "r"], [-1, "l"]])) {
  // seeing his left side the antennas stand in front of his head; seeing his right side, behind it (no rim: 1 px stays 1 px)
  const ant = layer("antennas", { outline: false }, (c) => lanternFeedAntennas(c, dir, { b: LF_BREATH[c.frame % 4], lit: c.frame % 3 }))
  const stand = (c) => lanternFeed(c, dir, { b: LF_BREATH[c.frame], f: c.frame })
  const drive = (c) => lanternFeed(c, dir, { turn: dir * c.frame * (Math.PI / 12), f: c.frame })
  anim(`lantern_feed_${n}`, { w: LF.W, h: LF.H, frames: 4, ms: [600, 600, 600, 600], outline: "1", pivot: "bottom" }, ...(dir === 1 ? [ant, stand] : [stand, ant]))
  anim(`lantern_feed_drive_${n}`, { w: LF.W, h: LF.H, frames: 4, ms: [110, 110, 110, 110], outline: "1", pivot: "bottom" }, ...(dir === 1 ? [ant, drive] : [drive, ant]))
}

// ---------------------------------------------------------------- Corvin Ashe, 13x24 inside, 17x26 with the burn
// Tall and narrow, a belted raincoat long to the calves, 8: a step under Ines's 9, or he reads grey-green instead of white. No
// face: the mask is a burn, 9, and past the head's edge an 8, with no dark rim (the camera's own overflow has none), so it
// comes after the rim. Only the burn moves when he stands: that is the camera, not him.
const FA = { W: 17, H: 26, X: 2, Y: 1 }
const ASHE_LIT = { L: "8", C: "8", D: "7", H: "7", leg: "4", shoe: "3" }
const ASHE_DIM = { L: "4", C: "3", D: "2", H: "3", leg: "2", shoe: "1" }          // out of the stairs' shadow: only the burn is there
const FA_LEGS = { W: FA.W, H: FA.H, near: 9, far: 5, hip: 21, lw: 2, sw: 3, sep: "1" }
const FA_COAT = [
  "..LLLLL..",
  ".LLDCDCC.",
  "CLLCDCCCD",
  "CLLCCCCCD",
  "CLLCCCCCD",
  "CLLCCCCCD",
  "CLLCCCCCD",
  "CLLCCCCCD",
  "CDDDDDDDD",
  "CLLCCCCCD",
  "CLLCCCCCD",
  ".LCCCDCC.",
  ".LCCCDCC.",
  ".LCDCDCC.",
  ".LCDCDCC.",
  ".DDDDDDD.",
]                                // rows 6-21, columns 2-10: the collar, the belt, the folds under it, the hem; a closure down the front made a cross with the belt
function asheBody(c, v, o = {}) {
  const ox = o.ox ?? 0, b = o.bob ?? 0, sw = o.swing ?? 0, dy = o.dy ?? 0, x = FA.X + ox, y = FA.Y + dy
  fpLegs(c, { ...FA_LEGS, W: FA.W + 2 * ox, H: FA.H + dy, near: FA_LEGS.near + ox, far: FA_LEGS.far + ox, leg: v.leg, shoe: v.shoe }, o.feet ?? fpStand(FA.H + dy - 1), b)
  fpGrid(c, x + 2, y + 6 + b, FA_COAT, v)
  c.rect(x + 2, y + 17 + b - sw, 1, 2, v.H)                                      // the near hand
  c.rect(x + 10, y + 17 + b + sw, 1, 2, v.H)
  c.rect(x + 4, y + 1 + b, 5, 5, v.L)                                            // the head (the rim follows it, the burn covers it)
}
const ASHE_BURN = [
  "..999..",
  ".99999.",
  "9999999",
  "9999999",
  "9999999",
  ".99999.",
  "..888..",
]                                // over the head's 5x5 and past it: the white smear of the story; with a ring of 8 it sank to a grey head on the lit floor
function asheBurn(c, o = {}) {
  const x = FA.X + (o.ox ?? 0), b = o.bob ?? 0, y = FA.Y + (o.dy ?? 0) + (o.up ?? 0)
  c.rect(x + 3, y + b, 7, 1, "_")                                                // what the rim left over the head
  fpGrid(c, x + 3, y + b, ASHE_BURN, { 8: "8", 9: "9" })
  if (o.eyes) { c.rect(x + 4, y + 3 + b, 2, 1, "2"); c.rect(x + 7, y + 3 + b, 2, 1, "2") }
  if (o.flare) { c.px(x + 2, y + 2 + b, "8"); c.px(x + 2, y + 3 + b, "8"); c.px(x + 10, y + 4 + b, "8") }
}
const ashe = (c, v, o = {}) => { asheBody(c, v, o); fpRim(c, FA.W, FA.H, "1"); asheBurn(c, o) }
// A patient walk: at his speed (5 px/s) the 100 ms of the others would have his feet slide; this is the pace he covers.
const ASHE_WALK = { frames: 6, ms: [200, 200, 200, 200, 200, 200] }
for (const [suffix, v] of [["", ASHE_LIT], ["_dim", ASHE_DIM]]) {
  anim(`ashe_feed${suffix}`, { w: FA.W, h: FA.H, frames: 2, ms: [1300, 260], pivot: "bottom" }, (c) => ashe(c, v, { flare: c.frame }))
  anim(`ashe_feed${suffix}_walk`, { w: FA.W, h: FA.H, ...ASHE_WALK, pivot: "bottom" }, (c) => {
    const i = c.frame, f = fpFeetFront(FA.H - 1, i), small = (q) => ({ ...q, dx: Math.trunc(q.dx / 2) })   // short steps, the feet under the coat
    ashe(c, v, { bob: FP_BOB[i], swing: FP_SWING[i], feet: { near: small(f.near), far: small(f.far) } })
  })
}
// The look, the last thing the player sees: the head comes up a pixel, and in the burn two dark slits look into the camera. Still no
// face (story §4; Chapter 2's forged clip needs the mask): eyes are all he shows. The same canvas as ashe_feed, so nothing jumps.
anim("ashe_feed_look", { w: FA.W, h: FA.H, frames: 2, ms: [1300, 260], pivot: "bottom" }, (c) => {
  asheBody(c, ASHE_LIT); fpRim(c, FA.W, FA.H, "1"); asheBurn(c, { flare: c.frame, up: -1, eyes: true })
})
