// Block for approval (the user, 2026-11-16): Lantern in the feeds (CAM 31's hand-over, CAM 23 at the dryer) as the painted Lantern, not the
// wheelchair sign any more (art/characters/feed_people.px.js, lantern_feed), and when he drives, his wheels turn. Built from the same
// measures as the painted figure (art/characters/lantern.px.js, its approved block art/test/lantern_blocks.px.js), seen from the side
// as the feeds' high cameras see someone crossing the picture, at the size the user chose for him there (about 30 px: smaller, the
// wheel didn't read). Two views, drawn and never mirrored: driving to the right we see his right side (the ocular), to the left his
// left side (the antennas near, the ocular hidden). Phosphor only (keys 0-9), the rim 1; his accent, the brightest on him, is the crest.
//   lantern_feed_r, lantern_feed_l              standing: his breath, the lantern at his neck
//   lantern_feed_drive_r, lantern_feed_drive_l  driving: the spokes turning, 4 frames
//   lantern_feed_blocks                         two of them over CAM 31's picture (build/shots/cam31_1x.png), 1x
//   lantern_feed_vergleich                      the old sign, then standing left and right, then driving right frame by frame
"use strict"
include("../lib/feed.js")
pal({ ...PHOSPHOR })

const W = 35, H = 38, K = 21                    // the canvas; px a metre (bigger than the feeds' scale, as the user chose for him)
/** a point of him (metres): f forward, d toward the far side (away from the camera), h up -> px; dir 1 facing right, -1 left */
const lfAt = (dir, f, d, h) => [Math.round(17 + dir * f * K + d * K * 0.35), Math.round(35 - h * K - d * K * 0.3)]
/** a filled polygon of points (scanline, even-odd) */
function lfPoly(c, pts, k) {
  const ys = pts.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys)
  for (let y = y0; y <= y1; y++) {
    const xs = []
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length]
      if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax))
    }
    xs.sort((a, b) => a - b)
    for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) c.px(x, y, k)
  }
}
/** a box in his measures as its side face (f0..f1, h0..h1 at depth d) */
const side = (c, dir, f0, f1, h0, h1, d, k) => lfPoly(c, [lfAt(dir, f0, d, h0), lfAt(dir, f1, d, h0), lfAt(dir, f1, d, h1), lfAt(dir, f0, d, h1)], k)
/** a wheel in the plane of his facing: the tyre, the rim, the spokes turned by `turn` (radians), the hub */
function wheel(c, dir, f, d, h, r, turn, near) {
  const [cx, cy] = lfAt(dir, f, d, h), R = r * K
  for (let y = Math.floor(cy - R - 1); y <= cy + R + 1; y++) for (let x = Math.floor(cx - R - 1); x <= cx + R + 1; x++) {
    const q = Math.hypot(x + 0.5 - cx, y + 0.5 - cy)
    if (q <= R && q > R - 1.6) c.px(x, y, near ? "7" : "4")
    else if (q <= R - 1.6 && q > R - 2.4) c.px(x, y, near ? "5" : "3")
  }
  for (let i = 0; i < 3; i++) {                                                       // three spokes through the hub: six ends
    const t = turn + (i / 3) * Math.PI
    const dx = Math.cos(t) * (R - 2), dy = Math.sin(t) * (R - 2)
    c.line(Math.round(cx - dx), Math.round(cy - dy), Math.round(cx + dx), Math.round(cy + dy), near ? "6" : "3")
  }
  c.px(Math.round(cx), Math.round(cy), near ? "8" : "4")
}

/** Lantern in his chair from the side; dir 1 right, -1 left; b his breath; turn the wheels' angle; f the frame (the lantern's flame) */
function lantern(c, dir, { b = 0, turn = 0, f = 0 } = {}) {
  const nearSide = dir === 1 ? "right" : "left"                                     // which of his sides faces the camera
  // the float under the chair (he comes over the water), the far wheel, the push handle and the backrest
  side(c, dir, -0.38, 0.5, -0.02, 0.06, 0, "3")
  wheel(c, dir, -0.05, 0.4, 0.36, 0.36, turn, false)
  side(c, dir, -0.3, -0.25, 0.5, 0.98, 0.1, "4"); side(c, dir, -0.38, -0.25, 0.92, 0.98, 0.1, "5")
  // the seat, the caster on its fork, the footrest
  side(c, dir, -0.22, 0.26, 0.45, 0.52, 0, "4")
  side(c, dir, 0.3, 0.34, 0.08, 0.45, 0, "4"); wheel(c, dir, 0.32, -0.05, 0.06, 0.07, turn * 3, true)
  side(c, dir, 0.36, 0.58, 0.06, 0.1, 0, "5")
  // the legs: the thigh along the seat, the shin down to the boot on the footrest
  side(c, dir, -0.05, 0.46, 0.5, 0.64, -0.05, "6"); side(c, dir, 0.36, 0.5, 0.12, 0.6, -0.05, "5")
  side(c, dir, 0.4, 0.64, 0.05, 0.15, -0.05, "3")
  // the poncho from the shoulders over the lap, its patches; the hood thrown back
  const sh = 1.05 - b / K
  lfPoly(c, [lfAt(dir, -0.16, 0, sh), lfAt(dir, 0.08, 0, sh), lfAt(dir, 0.24, 0, 0.66), lfAt(dir, -0.2, 0, 0.66)], "7")
  side(c, dir, -0.24, -0.12, sh - 0.14, sh + 0.02, 0.05, "5")
  side(c, dir, 0.05, 0.17, 0.62, 0.74, -0.1, "7"); side(c, dir, -0.12, -0.02, 0.8, 0.9, -0.1, "5")
  // the arm down to the hand on the near wheel's push rim
  side(c, dir, -0.04, 0.04, 0.6, sh - 0.1, -0.12, "5"); side(c, dir, -0.04, 0.05, 0.53, 0.6, -0.12, "6")
  // the head: the face toward his front, the shaved scalp, the crest (his accent) with its spikes
  side(c, dir, -0.12, 0.12, 1.06 - b / K, 1.34 - b / K, 0, "6")
  side(c, dir, 0.06, 0.12, 1.1 - b / K, 1.3 - b / K, -0.02, "7")                       // the lit face
  side(c, dir, -0.14, 0.1, 1.34 - b / K, 1.45 - b / K, 0, "9")
  for (const ff of [-0.1, -0.02, 0.06]) { const [x, y] = lfAt(dir, ff, 0, 1.5 - b / K); c.px(x, y, "9") }
  // his right side to us: the ocular over the near eye; his left side: the eye, and the headset's cup
  const [ex, ey] = lfAt(dir, 0.1, -0.05, 1.23 - b / K)
  if (nearSide === "right") { c.px(ex, ey, "8"); c.px(ex - dir, ey, "4"); c.px(ex, ey - 1, "4") } else c.px(ex, ey, "2")
  const [hx, hy] = lfAt(dir, -0.03, nearSide === "left" ? -0.12 : 0.12, 1.2 - b / K)
  if (nearSide === "left") c.rect(hx - 1, hy - 1, 2, 3, "3")
  // the lantern at his chest, its flame
  const [lx, ly] = lfAt(dir, 0.12, -0.08, 0.92 - b / K)
  c.px(lx, ly, f % 3 === 1 ? "7" : "8"); c.px(lx, ly - 1, "3")
  // the near wheel over his side
  wheel(c, dir, -0.05, -0.3, 0.36, 0.36, turn, true)
}
/** the antennas from the headset on his left ear, leaning back; near (in front of the head) when we see his left side */
function antennas(c, dir, { b = 0, lit = 0 } = {}) {
  const [hx, hy] = lfAt(dir, -0.04, dir === 1 ? 0.12 : -0.12, 1.22 - b / K)
  for (const [i, back, len] of [[0, 2, 9], [1, 4, 11], [2, 6, 8]]) {
    const x1 = hx - dir * back, y1 = hy - len
    c.line(hx, hy, x1, y1, "4"); c.px(x1, y1, lit === i ? "8" : "6")
  }
}

const BREATH = [0, 0, 1, 1]
for (const [dir, n] of [[1, "r"], [-1, "l"]]) {
  // seeing his left side the antennas stand in front of his head; seeing his right side, behind it
  const ant = layer("antennas", { outline: false }, (c) => antennas(c, dir, { b: BREATH[c.frame % 4], lit: c.frame % 3 }))
  const body = (o) => (c) => lantern(c, dir, o(c))
  anim(`lantern_feed_${n}`, { w: W, h: H, frames: 4, ms: [600, 600, 600, 600], outline: "1", pivot: "bottom" },
    ...(dir === 1 ? [ant, body((c) => ({ b: BREATH[c.frame], f: c.frame }))] : [body((c) => ({ b: BREATH[c.frame], f: c.frame })), ant]))
  // driving: the wheels roll forward (a quarter of a spoke's turn a frame)
  anim(`lantern_feed_drive_${n}`, { w: W, h: H, frames: 4, ms: [110, 110, 110, 110], outline: "1", pivot: "bottom" },
    ...(dir === 1 ? [ant, body((c) => ({ turn: dir * c.frame * (Math.PI / 12), f: c.frame }))] : [body((c) => ({ turn: dir * c.frame * (Math.PI / 12), f: c.frame })), ant]))
}

sprite("_lf_cam", { png: "../../build/shots/cam31_1x.png" })
sprite("_lf_old", { png: "../../build/art/characters/anims/lantern_feed.png", area: [0, 0, 29, 30], pivot: "bottom" })
scene("lantern_feed_blocks", { w: 320, h: 180, bg: "0" }, (c) => {
  c.stamp("_lf_cam", 0, 0)
  c.stamp("lantern_feed_l", 183, 131)            // where he stands at the hand-over, toward Ines
  c.stamp("lantern_feed_drive_r", 250, 120)      // leaving for the tunnel
})
scene("lantern_feed_vergleich", { w: 250, h: 46, bg: "1" }, (c) => {
  c.stamp("_lf_old", 18, 43)
  c.stamp("lantern_feed_l", 54, 43); c.stamp("lantern_feed_r", 92, 43)
  for (let i = 0; i < 4; i++) c.stamp("lantern_feed_drive_r", 132 + i * 36, 43, { t: i * 110 })
})
