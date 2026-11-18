// The look from Ines' balcony over the railing (the user's wish, 2026-11-18: "einen Blick übers Wasser und den Sumpf erhaschen"),
// PAINTED (2026-11-18) on the lines of the block the user approved (art/test/ines_balkon_blick_blocks.px.js, 320x180), at 0.6 of its
// size so it sits in the interface's frame as the look down from the ledge does (art/ui/look_strasse.px.js; game/screens.js draws
// look_* at their own size): shown when Juno looks at the railing (game/rooms/ines_wohnung.js).
//
//   look_balkon  192x108, 12 frames. From the top down: low clouds lit from above by the Crown; the swamp on the far side, the drowned
//                forest's crowns and dead trunks against the haze, two green lights in it (Lantern's antennas: nobody knows yet, the
//                look only says there are lights); the water wide and dark, the city's lights lying on it in broken streaks; the roofs
//                of the Ninth stepping down to it (parapets, a water tank on its legs, an antenna, an air conditioner, lit windows, a
//                magenta sign seen from behind); in front the railing's wet top and two of its posts. Rain over all of it.
include("../lib/iso.js", { palette: true })
pal({ "ĝ": "#3e5a3a", "Ĝ": "#7fd06a" })

{
  const W = 192, H = 108, NF = 12, bay = ISO.bay, ih = ISO.ihash, fl = Math.floor
  const SKY = 50                                                     // where the haze meets the forest
  const crown = (x) => 46 - Math.round(ih(x >> 1, 3) * 3 + Math.sin(x / 9) * 1.5 + (Math.sin(x / 31) > 0.6 ? 2 : 0))
  const WATER = [54, 77]
  const LIGHTS = [[118, 47], [139, 49]]                               // the two green lights in the swamp (the block's 196 and 231, times 0.6)
  // the roofs: [x0, top, width] (the block's ROOFS times 0.6), each a block of the Ninth seen from above its parapet
  const ROOFS = [[0, 71, 42], [42, 76, 36], [78, 67, 30], [108, 78, 42], [150, 72, 42]]

  anim("look_balkon", { w: W, h: H, frames: NF, fps: 10 }, (c) => {
    const f = c.frame ?? 0
    // ---- the sky: cloud bands lit from above where the Crown's glow falls (centre right), dark between, the haze over the water
    for (let y = 0; y < SKY; y++) for (let x = 0; x < W; x++) {
      const glow = Math.max(0, 1 - Math.hypot((x - 126) / 96, y / 30))
      const band = Math.sin(y * 0.55 + Math.sin(x / 23) * 1.6 + x / 70) * 0.5 + 0.5
      const lit = glow * (0.35 + band * 0.65), haze = y > 36 ? (y - 36) / 18 : 0
      c.px(x, y, bay(x, y) < lit * 0.75 ? "U" : bay(x, y) < lit + haze * 0.6 ? "u" : "1")
    }
    // ---- the swamp: the forest's crowns against the haze, a few dead trunks standing out of the water before it
    for (let x = 0; x < W; x++) {
      const top = crown(x)
      for (let y = top; y < WATER[0]; y++) c.px(x, y, y === top ? (bay(x, y) < 0.5 ? "2" : "1") : "k")
    }
    for (const [x, h] of [[22, 5], [61, 4], [97, 6], [171, 4]]) { c.vline(x, WATER[0] - h, h + 1, "k"); c.px(x + 1, WATER[0] - h + 1, "k") }
    for (const [x, y] of LIGHTS) {
      c.px(x, y, f % 6 === 3 && x === LIGHTS[1][0] ? "ĝ" : "Ĝ")
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) c.px(x + dx, y + dy, "ĝ")
    }
    // ---- the water: dark ripples; under every light a broken streak that shivers frame to frame
    for (let y = WATER[0]; y < WATER[1]; y++) for (let x = 0; x < W; x++) {
      const r = (x + fl(y * 2.3) + (y % 2 ? f : -f)) % 17
      c.px(x, y, r === 0 ? "t" : y % 3 === 0 && r < 6 ? "f" : "e")
    }
    const streaks = [[LIGHTS[0][0], "ĝ"], [LIGHTS[1][0], "ĝ"], [36, "P"], [72, "M"], [168, "C"], [130, "P"]]
    for (const [x, k] of streaks) for (let y = WATER[0] + 1; y < WATER[1]; y += 2) {
      const w = 1 + ((y + f) % 3 === 0 ? 1 : 0), dx = ((y >> 1) + f) % 3 - 1
      if (ih(x, y + f) < 0.8) c.hline(x + dx, y, w, k)
    }
    // ---- the roofs of the Ninth: each block's facade under its parapet (windows lit here and there), its roof's things on top
    for (const [x0, top, w] of ROOFS) {
      for (let y = top; y < H; y++) for (let x = x0; x < Math.min(W, x0 + w); x++) {
        let k = y === top ? "4" : y === top + 1 ? "3" : "2"
        if (y > top + 3 && x > x0 + 2 && x < x0 + w - 3 && (x - x0) % 5 < 2 && (y - top) % 6 < 3) {
          const n = ih(fl((x - x0) / 5) + x0, fl((y - top) / 6))
          k = n < 0.14 ? ((y - top) % 6 === 0 ? "R" : "Q") : n < 0.22 ? "C" : n < 0.3 ? "1" : k
        }
        if (x === x0 || x === x0 + w - 1) k = "1"                                        // the gaps between the blocks
        c.px(x, y, k)
      }
    }
    // the water tank on its legs on the tallest roof, an antenna, an air conditioner breathing, a sign seen from behind
    c.ellipse(90, 61, 5, 2, "3"); c.rect(85, 61, 11, 4, "3"); c.hline(85, 61, 11, "4"); c.vline(86, 65, 2, "2"); c.vline(94, 65, 2, "2")
    c.vline(174, 60, 12, "4"); c.hline(172, 62, 5, "4"); c.px(174, 59, f % 4 < 2 ? "q" : "r")    // its warning light
    c.rect(118, 74, 6, 4, "3"); c.hline(118, 74, 6, "5"); c.px(120 + (f % 3), 76, "1")             // the AC, its fan turning
    c.rect(52, 72, 14, 4, "n"); c.hline(52, 72, 14, f % 8 === 5 ? "M" : "m")                        // a sign's back, its neon spilling over the top
    // ---- the railing in front: its wet top across the bottom, two posts, a drop gathering under the rail
    c.rect(0, 96, W, 3, "6"); c.hline(0, 96, W, "x"); c.hline(0, 99, W, "4")
    for (let x = 0; x < W; x++) if (ih(x, 9) < 0.08) c.px(x, 96, "H")
    for (const x of [24, 150]) { c.rect(x, 100, 3, 8, "5"); c.vline(x, 100, 8, "6"); c.vline(x + 2, 100, 8, "4") }
    c.px(80, 100 + (f % 6), f % 6 < 5 ? "x" : "6")
    // ---- the rain, falling a little to the right, near drops longer and paler
    for (let i = 0; i < 70; i++) {
      const near = i < 14, len = near ? 4 : 2, sp = near ? 18 : 9
      const x = fl(ih(i, 1) * W + (f * sp) / 6) % W, y = fl(ih(i, 2) * H + f * sp) % H
      for (let j = 0; j < len; j++) c.px((x + (j >> 1)) % W, (y + j) % H, near ? "x" : "5")
    }
  })
}
