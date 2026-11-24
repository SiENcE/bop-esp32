// Block sketch for becken_raum, Chapter 3's room at the bottom of pump hall 3 (kapitel3-design §3.2, §9.2): a room beside the filter
// basin, one wall of glass, behind it the water and Tinte. At the game's iso scale (art/lib/isomap.js: 32 px a meter along u to the
// right, 16 down; 30 px a meter up), about 6 x 3.5 m, its walls 3.2 m. Blocks only, the world palette with the basin's greens.
//   right back wall (along u): the glass, steel mullions, the green water; Tinte, a great shadow with her arms spread, one pressed to
//                              the glass with its suckers, her speech collar glowing in her colour (#b0b8ff); the cable with twelve knots
//                              hanging in the water; the notice taped to the glass (BASIN 3: AUTOMATION TRIAL ...)
//   left back wall (along v):  the shift's lockers, Teo's with his name and his ear defenders on its hook; the door in from the stairs
//   the floor:                 wet concrete, a drain, puddles holding the water's green; the pumps' console by the glass with an amber
//                              lamp and its screen (BASIN 3, Tinte's node); light falling from the shaft far above
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  y: "#eec414", s: "#93583f", S: "#d79676", o: "#e06a1a",                       // o: Teo's vest orange
  a: "#06140f", b: "#0b261d", d: "#123a2c", g: "#1d5440", h: "#2e7558", i: "#5aa883",   // the basin's water, dark to light
  t: "#3a3f66", T: "#6a70a8", u: "#b0b8ff",                                       // Tinte: her shadow, her skin by the glass, her collar
  w: "#c8d0c8",                                                                    // paper
})
include("../lib/text.js")

const W = 320, H = 180
const P = (u, v, h = 0) => [Math.round(124 + 32 * (u - v)), Math.round(84 + 16 * (u + v) - h * 30)]
const quad = (c, pts, k) => c.poly(pts.flat(), k)
function blk(c, u, v, h, du, dv, dh, top, left, right) {
  quad(c, [P(u, v + dv, h), P(u + du, v + dv, h), P(u + du, v + dv, h + dh), P(u, v + dv, h + dh)], left)
  quad(c, [P(u + du, v, h), P(u + du, v + dv, h), P(u + du, v + dv, h + dh), P(u + du, v, h + dh)], right)
  quad(c, [P(u, v, h + dh), P(u + du, v, h + dh), P(u + du, v + dv, h + dh), P(u, v + dv, h + dh)], top)
}
// a point on the glass (u along the wall, h up) and whether it is in the glass
const G = (u, h) => P(u, 0, h)

scene("becken_raum_blocks", { w: W, h: H, bg: "k" },
  (c) => {
    const U = 6, V = 3.5, WH = 3.2
    // the floor: wet concrete, a drain, puddles with the water's green in them
    quad(c, [P(0, 0), P(U, 0), P(U, V), P(0, V)], "z")
    for (let u = 0; u <= U; u += 0.5) c.line(...P(u, 0), ...P(u, V), "f")
    for (let v = 0; v <= V; v += 0.5) c.line(...P(0, v), ...P(U, v), "f")
    quad(c, [P(1.2, 0.3), P(5.6, 0.3), P(5.6, 1.4), P(1.2, 1.4)], "b")                 // the glass's green light on the floor
    for (const [u, v, r] of [[2.4, 1.9, 0.5], [4.4, 2.6, 0.4]]) quad(c, [P(u - r, v - r * 0.5), P(u + r, v - r * 0.5), P(u + r, v + r * 0.5), P(u - r, v + r * 0.5)], "d")
    quad(c, [P(3.2, 2.2), P(3.6, 2.2), P(3.6, 2.5), P(3.2, 2.5)], "e")
    // the left back wall: the lockers, Teo's; the door in from the stairs
    quad(c, [P(0, 0), P(0, V), P(0, V, WH), P(0, 0, WH)], "2")
    for (let i = 0; i < 5; i++) {
      const v0 = 0.2 + i * 0.48
      quad(c, [P(0.02, v0), P(0.02, v0 + 0.45), P(0.02, v0 + 0.45, 1.9), P(0.02, v0, 1.9)], i === 2 ? "5" : "4")
      c.line(...P(0.02, v0 + 0.45, 0), ...P(0.02, v0 + 0.45, 1.9), "3")
      const [x, y] = P(0.02, v0 + 0.22, 1.75); c.rect(x - 3, y, 6, 2, "w")                 // the name strips
    }
    { const [x, y] = P(0.02, 1.38, 1.6); TXT.draw(c, x + 2, y - 14, "REYES", "w", { font: "hud", align: "center" })
      c.rect(x - 4, y + 2, 8, 6, "o"); c.rect(x - 3, y + 3, 6, 3, "k") }                // the ear defenders on the hook
    quad(c, [P(0.02, 2.7), P(0.02, 3.4), P(0.02, 3.4, 2.2), P(0.02, 2.7, 2.2)], "1")    // the door
    { const [x, y] = P(0.02, 3.05, 2.35); c.rect(x - 2, y, 4, 2, "Q") }                 // its lamp
    // the right back wall: the glass, the water behind it
    quad(c, [P(0, 0), P(U, 0), P(U, 0, WH), P(0, 0, WH)], "2")
    const ga = 0.3, gb = 5.8, h0 = 0.25, h1 = 3.0
    for (let u = ga; u < gb; u += 1 / 32) for (let h = h0; h < h1; h += 1 / 30) {
      const [x, y] = G(u, h), depth = (h1 - h) / (h1 - h0)
      c.px(x, y, depth > 0.8 ? "a" : depth > 0.45 ? "b" : depth > 0.15 ? "d" : "g")
    }
    // light from the surface far above in the water, rippling
    for (let u = ga; u < gb; u += 0.25) { const [x, y] = G(u, 2.9 - (Math.floor(u * 4) % 3) * 0.04); c.px(x, y, "i"); c.px(x + 1, y, "h") }
    // Tinte: a great shadow, her mantle up and to the right, her arms spread; one arm pressed to the glass, its suckers pale
    const mantle = [3.9, 2.0]
    for (let u = ga; u < gb; u += 1 / 32) for (let h = h0; h < h1; h += 1 / 30) {
      const du = (u - mantle[0]) / 0.8, dh = (h - mantle[1]) / 0.6
      if (du * du + dh * dh < 1) { const [x, y] = G(u, h); c.px(x, y, du * du + dh * dh < 0.5 ? "T" : "t") }
    }
    const arms = [[[3.4, 1.7], [2.6, 1.3], [1.8, 1.2], [1.1, 0.8]], [[3.6, 1.5], [3.2, 0.9], [3.0, 0.5]], [[4.2, 1.5], [4.6, 0.9], [5.2, 0.6]],
                  [[4.5, 1.8], [5.1, 1.7], [5.6, 2.0]], [[3.7, 1.4], [3.9, 0.8], [4.1, 0.35]], [[3.3, 2.3], [2.7, 2.6], [2.1, 2.5]]]
    arms.forEach((pts, ai) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const [a, b] = [pts[i], pts[i + 1]], n = 40
        for (let s = 0; s <= n; s++) {
          const u = a[0] + (b[0] - a[0]) * s / n, h = a[1] + (b[1] - a[1]) * s / n, r = Math.max(1, Math.round(3 - (i + s / n) * 0.9))
          const [x, y] = G(u, h); c.rect(x - r + 1, y - r + 1, r * 2 - 1, r * 2 - 1, ai === 0 ? "T" : "t")
        }
      }
    })
    for (const [u, h] of [[2.4, 1.24], [2.0, 1.2], [1.6, 1.08], [1.3, 0.92]]) { const [x, y] = G(u, h); c.px(x, y + 2, "u"); c.px(x + 1, y + 2, "T") }   // suckers on the glass
    { const [x, y] = G(3.55, 1.6); c.rect(x - 9, y, 18, 2, "u"); c.px(x - 3, y + 2, "V") }   // her speech collar, lit
    { const [x, y] = G(3.7, 2.15); c.rect(x - 1, y, 3, 2, "i"); c.rect(x + 9, y + 3, 3, 2, "i") }   // her eyes
    // the cable with twelve knots, hanging into the water at the left
    for (let h = 0.35; h < 3.0; h += 1 / 30) { const [x, y] = G(0.75 + Math.sin(h * 3) * 0.03, h); c.px(x, y, "6") }
    for (let k = 0; k < 12; k++) { const [x, y] = G(0.75, 0.5 + k * 0.2); c.rect(x - 1, y - 1, 3, 2, "6") }
    // the glass: steel mullions, its frame, a sheen
    for (let u = ga; u <= gb + 0.01; u += (gb - ga) / 4) c.line(...G(u, h0), ...G(u, h1), "5")
    c.line(...G(ga, h0), ...G(gb, h0), "5"); c.line(...G(ga, h1), ...G(gb, h1), "5")
    for (let u = 1.0; u < 5.5; u += 1.4) c.line(...G(u, 2.6), ...G(u + 0.35, 2.0), "h")
    // the notice taped to the glass
    { const [x, y] = G(1.45, 1.9); c.rect(x - 10, y, 20, 14, "w"); for (let r = 0; r < 4; r++) c.rect(x - 8, y + 3 + r * 3, 14 - (r % 2) * 5, 1, "3")
      c.px(x - 10, y, "Q"); c.px(x + 9, y, "Q") }
    // the pumps' console by the glass: an amber lamp, its screen
    blk(c, 4.8, 0.25, 0, 0.9, 0.55, 1.0, "4", "3", "5")
    blk(c, 4.85, 0.25, 1.0, 0.8, 0.12, 0.45, "1", "c", "2")
    { const [x, y] = P(5.25, 0.37, 1.32); TXT.draw(c, x - 2, y - 4, "B3", "v", { font: "hud", align: "center" }); const [lx, ly] = P(5.6, 0.5, 1.02); c.rect(lx - 1, ly - 2, 3, 2, "Q") }
    // light from the shaft far above, a pale fall over the middle of the room
    for (let y = 0; y < 150; y++) for (let x = 140; x < 220; x++) { const t = (x - 140 + y * 0.35) % 9; if (t < 0.6 && ((x * 7 + y) % 4 === 0)) { const k = c.key(x, y); if (k === "z" || k === "f") c.px(x, y, "Z") } }
    // Juno, facing the glass (from behind and to the side: a block)
    { const [x, y] = P(3.0, 2.0); c.ellipse(x, y, 9, 4, "e"); c.rect(x - 7, y - 42, 14, 22, "y"); c.rect(x - 7, y - 20, 14, 20, "2"); c.rect(x - 6, y - 52, 12, 11, "y"); c.rect(x - 11, y - 30, 5, 8, "6") }
  },
)
