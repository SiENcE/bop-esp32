// Test: how tall should street mode be? Juno's flat as blocks (its real measures in meters) at six scales,
// each a full 320x180 screen, side by side in one sheet (3 x 2). Two numbers make a scale:
//   UPM  units per meter along the floor (a unit is 2 px across, 1 px down: the 2:1 lines)
//   VPM  px per meter of height
// The flat now: UPM 16, VPM 18 (art/lib/iso.js: "1 m = 16 units, 18 px of height"). A real camera that
// draws the floor 2:1 looks down at 30°, and then a meter of height is 0.866 / 0.707 * 2 * UPM / 2 ... in
// short 2.45 * UPM px: 39 px for UPM 16, 29 px for UPM 12. So the flat's heights are drawn at 46 % of
// what the floor's scale would make them.
//
//   1  16 / 18   now                    Juno 30 px
//   2  16 / 24   taller, same floor     Juno 40 px
//   3  16 / 30   taller still           Juno 50 px
//   4  16 / 39   true to the floor      Juno 66 px (the room needs to scroll)
//   5  12 / 24   smaller floor          Juno 40 px
//   6  12 / 29   smaller floor, true    Juno 49 px
pal({
  k: "#0c0e1a", n: "#06080f",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  i: "#2a1636", I: "#46204e", M: "#a8238a",
  O: "#552b1c", Q: "#eea040",
  y: "#9a7406", Y: "#eec414", Z: "#fff070",
})
include("../lib/text.js")

const PW = 320, PH = 180
const SCALES = [[16, 18, "JETZT"], [16, 24, ""], [16, 30, ""], [16, 39, "WAHR"], [12, 24, ""], [12, 29, "WAHR"]]

/** one panel: the flat in blocks at a scale, drawn into the sheet at (ox, oy) */
function flatPanel(c, ox, oy, UPM, VPM, note) {
  const U = 4.75, V = 4.75, WALL = 2.6                       // the room, meters
  const hpx = WALL * VPM
  const CX = ox + 166, CY = oy + Math.round(hpx) + 10          // the back corner's foot; the wall's top 10 px from the top
  const S = (u, v, h) => [CX + 2 * (u - v) * UPM, CY + (u + v) * UPM - h * VPM]
  const clipped = (x, y) => x >= ox && x < ox + PW && y >= oy && y < oy + PH
  function poly(pts, k) {                                   // fill a convex polygon of screen points
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x++) {
      let pos = 0, neg = 0                                     // inside: on the same side of every edge
      for (let i = 0; i < pts.length; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], d = (x1 - x0) * (y + 0.5 - y0) - (y1 - y0) * (x + 0.5 - x0)
        if (d > 0) pos++; else if (d < 0) neg++
      }
      const inside = !(pos && neg)
      if (inside && clipped(x, y)) c.px(x, y, k)
    }
  }
  const quad = (a, b, d, e, k) => poly([S(...a), S(...b), S(...d), S(...e)], k)
  /** a box [u, v, h] .. [u + du, v + dv, h + dh]: its top and the two faces toward the viewer */
  function box(u, v, h, du, dv, dh, top, faceU, faceV) {
    const u1 = u + du, v1 = v + dv, h1 = h + dh
    quad([u1, v, h], [u1, v1, h], [u1, v1, h1], [u1, v, h1], faceU)                 // the +u face (lower right)
    quad([u1, v1, h], [u, v1, h], [u, v1, h1], [u1, v1, h1], faceV)                 // the +v face (lower left)
    quad([u, v, h1], [u1, v, h1], [u1, v1, h1], [u, v1, h1], top)
  }
  // a rectangle on the left wall (the plane u = 0: v, h) or the right wall (v = 0: u, h)
  const onL = (v0, h0, dv, dh, k) => quad([0, v0, h0], [0, v0 + dv, h0], [0, v0 + dv, h0 + dh], [0, v0, h0 + dh], k)
  const onR = (u0, h0, du, dh, k) => quad([u0, 0, h0], [u0 + du, 0, h0], [u0 + du, 0, h0 + dh], [u0, 0, h0 + dh], k)

  for (let y = oy; y < oy + PH; y++) c.rect(ox, y, PW, 1, "n")
  // floor and the two back walls (their inner faces), the walls' top edge
  quad([0, 0, 0], [U, 0, 0], [U, V, 0], [0, V, 0], "2")
  for (let m = 1; m < 5; m++) { const [x0, y0] = S(0, m, 0), [x1, y1] = S(U, m, 0); c.line(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), "3") }
  quad([0, 0, 0], [U, 0, 0], [U, 0, WALL], [0, 0, WALL], "3")                       // the right wall
  quad([0, V, 0], [0, 0, 0], [0, 0, WALL], [0, V, WALL], "4")                       // the left wall
  // the door (2.0 x 0.9 m) near the front of the left wall, the window (1.4 x 1.5 m at 0.9 m) on the right
  onL(3.6, 0, 0.9, 2.0, "1"); onL(3.62, 0, 0.86, 1.96, "2")
  onR(3.1, 0.9, 1.4, 1.5, "c"); onR(3.15, 0.95, 1.3, 1.4, "C"); onR(3.78, 0.95, 0.04, 1.4, "c")
  onL(1.3, 1.25, 1.6, 0.8, "O")                                                     // the pinboard over the bed
  // the furniture: fridge in the corner, the desk with its monitors along the right wall, the bed on the left
  box(0, 0, 0, 0.6, 0.6, 1.8, "6", "5", "4")
  box(0.9, 0, 0, 1.6, 0.7, 0.75, "5", "4", "3")
  box(1.1, 0.02, 0.75, 1.2, 0.18, 0.45, "C", "c", "c")
  box(0, 1.3, 0, 0.95, 2.0, 0.45, "I", "i", "i")
  // Juno, 1.68 m, standing in front of the desk
  box(1.5, 1.05, 0, 0.42, 0.32, 1.68, "Z", "Y", "y")
  box(1.5, 1.05, 1.42, 0.42, 0.32, 0.26, "Z", "Y", "Y")
  // what scale this is, and how tall things come out
  const juno = Math.round(1.68 * VPM), wall = Math.round(WALL * VPM)
  TXT.draw(c, ox + 4, oy + PH - 24, `${UPM} E/M  ${VPM} PX/M ${note}`, "V", { font: "hud" })
  TXT.draw(c, ox + 4, oy + PH - 16, `JUNO ${juno} PX  WAND ${wall} PX  TÜR ${Math.round(2 * VPM)} PX`, "6", { font: "hud" })
  TXT.draw(c, ox + 4, oy + PH - 8, `RAUM ${Math.round(4 * U * UPM)} PX BREIT`, "6", { font: "hud" })
}

sprite("iso_height_sheet", { w: PW * 3 + 8, h: PH * 2 + 4 }, (c) => {
  c.rect(0, 0, PW * 3 + 8, PH * 2 + 4, "k")
  SCALES.forEach(([u, h, note], i) => flatPanel(c, (i % 3) * (PW + 4), Math.floor(i / 3) * (PH + 4), u, h, note))
})
