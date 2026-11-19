// lerche_flur baked from its map (art/rooms/lerche_flur.map.js) with its kit (art/kit/lerche_flur.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes lerche_flur_* only): lerche_flur_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/lerche_flur.map.js")
include("../lib/isokit.js")
include("../kit/lerche_flur.kit.px.js", { palette: true })
include("../kit/kessel_14.kit.px.js", { palette: true })


const LERCHE_FLUR = ISOKIT.bake(ISO_MAPS.lerche_flur, { id: "lerche_flur", frames: 12, fps: 10 })

// ---- 4B sealed (from Sunday 21:00, kapitel2-design §3.3 W3, W4): the landing baked again with the seal across 4B and its lock broken out;
// what differs from the picture, frame by frame, is laid over it by the game at layout.sealAt while the time holds
{
  LF_SEALED = true
  const SEALED = ISOKIT.bake(ISO_MAPS.lerche_flur, { id: "lerche_flur", frames: 12, fps: 10, define: false })
  LF_SEALED = false
  const W = LERCHE_FLUR.BG[0].W, N = LERCHE_FLUR.BG.length
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1
  for (let f = 0; f < N; f++) {
    const A = LERCHE_FLUR.BG[f], B = SEALED.BG[f]
    for (let i = 0; i < B.k.length; i++) if (B.k[i] !== A.k[i]) { const x = i % W, y = Math.floor(i / W); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  }
  anim("lerche_flur_seal", { w: x1 - x0 + 1, h: y1 - y0 + 1, frames: N, fps: 10 }, (c) => {
    const A = LERCHE_FLUR.BG[c.frame ?? 0], B = SEALED.BG[c.frame ?? 0]
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = y * W + x; if (B.k[i] && B.k[i] !== A.k[i]) c.px(x - x0, y - y0, B.k[i]) }
  })
  LERCHE_FLUR.layout.sealAt = [x0, y0]
}

// ---- Civic Rest's notice on 4B (from Saturday until they come on Sunday at eight, kapitel2-design §3.3 W3, the user 2026-11-19): baked again
// with the sheet on the door; what differs is laid over the picture at layout.noticeAt, as the seal is
{
  LF_NOTICE = true
  const NOTICE = ISOKIT.bake(ISO_MAPS.lerche_flur, { id: "lerche_flur", frames: 12, fps: 10, define: false })
  LF_NOTICE = false
  const W = LERCHE_FLUR.BG[0].W, N = LERCHE_FLUR.BG.length
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1
  for (let f = 0; f < N; f++) {
    const A = LERCHE_FLUR.BG[f], B = NOTICE.BG[f]
    for (let i = 0; i < B.k.length; i++) if (B.k[i] !== A.k[i]) { const x = i % W, y = Math.floor(i / W); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  }
  anim("lerche_flur_notice", { w: x1 - x0 + 1, h: y1 - y0 + 1, frames: N, fps: 10 }, (c) => {
    const A = LERCHE_FLUR.BG[c.frame ?? 0], B = NOTICE.BG[c.frame ?? 0]
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = y * W + x; if (B.k[i] && B.k[i] !== A.k[i]) c.px(x - x0, y - y0, B.k[i]) }
  })
  LERCHE_FLUR.layout.noticeAt = [x0, y0]
}

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/lerche_flur.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "lerche_flur", ...LERCHE_FLUR.layout }))
