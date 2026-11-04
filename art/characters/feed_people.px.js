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
//   yuen_cook       paper cap 8, apron 7, chopping at his counter
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

// sitting at cam04's table, facing the camera (front three-quarter, facing down-right): the crown
// bowed over the table, the scarf's two ends down his chest, the forearms on the table toward us,
// the hands meeting. The table's top and his lap under it are the room's. 13x16 inside (15x18),
// the pivot under the seat. Frame 1: the head sinks a pixel lower.
sprite("_ks_head", `
  .6666.
  666666
  466666
  464646
  .66666
  ..666.`)                       // crown, the hair at the side away from us, brows, eyes cast down
sprite("_ks_body", `
  ..99999999...
  .4999999994..
  44449449444..
  44449449444..
  44449449444..
  4444944444...
  .44444444444.
  ..444444444..
  ..444444444..
  ...4444444...`)                // rows 6-15: the scarf's ends down his chest, the coat
sprite("_ks_arms", `
  .....24444...
  ......244466.
  .......24666.
  ........666..`)                // rows 10-13: the near forearm across the body to the hands
anim("kessler_feed_sit", { w: 13, h: 16, frames: 2, ms: [1500, 1100], outline: "1", pivot: "bottom" }, (c) => {
  c.stamp("_ks_body", 0, 6)
  c.stamp("_ks_arms", 0, 10)
  c.stamp("_ks_head", 2, c.frame)
})

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
// at the table, his back to the camera: the hands rest on the table in front of him (up the
// picture), the left one beside his hat with the watch; frame 1 its fingers drum. 17x17 inside
// (19x19), the pivot under the seat.
sprite("_vs_body", `
  ......22322......
  ...33333333333...
  ..3333333333333..
  .332333333333233.
  .332333333333233.
  .332333323333233.
  .332333323333233.
  ..3333323333333..
  ..3333323333333..
  ...33333333333...
  ....333333333....`)            // rows 6-16
sprite("_vs_arm_l", `
  .44.
  .98.
  .33.
  33..
  33..`)                         // rows 2-6, cols 0-3: the forearm up onto the table, watch, hand
sprite("_vs_arm_r", `
  .44
  .33
  ..3`)                          // rows 3-5: the right hand, on the table past his shoulder
anim("varga_feed_sit", { w: 17, h: 17, frames: 2, ms: [1300, 400], outline: "0", pivot: "bottom" }, (c) => {
  c.stamp("_vs_body", 0, 6)
  c.stamp("_vs_arm_l", 0, 2)
  c.stamp("_vs_arm_r", 13, 3)
  c.stamp("_v_hat", 1, 2)
  if (c.frame === 1) c.px(1, 2, "_"), c.px(1, 1, "4")                   // a finger lifts, taps
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
