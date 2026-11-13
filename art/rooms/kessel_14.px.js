// The 14th floor's landing baked from its map (art/rooms/kessel_14.map.js) with its kit
// (art/kit/kessel_14.kit.px.js) and its light (art/lib/isokit.js). PLAN H3.
//
// Exports (the atlas takes kessel_14_* only):
//   kessel_14_bg      320x180, a 12-frame loop at 10 fps: the tube's dying end, Frau Haldane's TV and her
//                     Lull light (baked in: she and her armchair are seen through her open door), the LEDs
//   kessel_14_bags, kessel_14_rail   the props, outlined, pivot bottom-centre
//   kessel_14_chair_empty   what differs when her armchair stands empty (baked again with the kit's armchair_empty): CAM 14 lays it
//                     over the picture at layout.chairEmpty while she sleepwalks to the papers (game/stadt.js), so she is never
//                     in two places at once (the user, 2026-11-13); 12 frames, as the TV's light on the chair flickers
// KESSEL_14.layout has the measured numbers (walk area, front lines, spots, lamps; tools/iso-layout.mjs
// writes the same for the game).
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/kessel_14.map.js")
include("../lib/isokit.js")
include("../kit/kessel_14.kit.px.js", { palette: true })
include("../kit/kessel_lift.kit.px.js")

const KESSEL_14 = ISOKIT.bake(ISO_MAPS.kessel_14, {
  id: "kessel_14", frames: 12, fps: 10,
  glows: [glow("F", { r: 4, strength: 0.4 }), glow("vV", { r: 3, strength: 0.35 })],
})

// ---- her armchair empty: the floor baked again with the chair alone; what differs from the picture, frame by frame
{
  const MAP = ISO_MAPS.kessel_14
  const EMPTY = ISOKIT.bake({ ...MAP, props: MAP.props.map((p) => (p.id === "armchair" ? { ...p, kit: "armchair_empty" } : p)) },
    { id: "kessel_14", frames: 12, fps: 10, define: false })
  const W = KESSEL_14.BG[0].W, N = KESSEL_14.BG.length
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1
  for (let f = 0; f < N; f++) {
    const A = KESSEL_14.BG[f], B = EMPTY.BG[f]
    for (let i = 0; i < B.k.length; i++) if (B.k[i] !== A.k[i]) { const x = i % W, y = Math.floor(i / W); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  }
  anim("kessel_14_chair_empty", { w: x1 - x0 + 1, h: y1 - y0 + 1, frames: N, fps: 10 }, (c) => {
    const A = KESSEL_14.BG[c.frame ?? 0], B = EMPTY.BG[c.frame ?? 0]
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = y * W + x; if (B.k[i] && B.k[i] !== A.k[i]) c.px(x - x0, y - y0, B.k[i]) }
  })
  KESSEL_14.layout.chairEmpty = [x0, y0]
}

console.log("ISO_LAYOUT " + JSON.stringify({ id: "kessel_14", ...KESSEL_14.layout }))
