// Block sketches of three more of Chapter 3's places (kapitel3-design §9.2), blocks only, for the user to approve before painting:
//   flutwerk_steg_blocks  the walkway along the water to the Flutwerk's gate (§3.2, P3): iso at the game's scale; the great shut gate,
//                         beside it the staff door with its keypad (Teo's PIN), outflow pipes foaming into the water; a zoom window on
//                         the keypad as the game shows one
//   wartung_cam_blocks    one of the old maintenance cameras in the pipes (§6.2, Ratz' colony): a feed in the phosphor, older than the
//                         city's (coarse, like cam31), down a pipe to a fan, a hatch shut, a drone on its post, Ratz before the hatch;
//                         the implant's overlay and the camera's display
//   station_blocks        the station in the Fifth (§9.2, a room for Chapters 3 and 4): iso, white salt light, rows of beds, the
//                         sleepers' heads on the pillows, a monitor at each bed pulsing Lull's beat in magenta, names and numbers
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",
  M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  r: "#7e1420", q: "#ff3a3a", y: "#eec414", s: "#93583f", S: "#d79676",
  a: "#06140f", b: "#0b261d", d: "#123a2c", g: "#1d5440",                                       // the sea's water
  w: "#c8d0c8",
  // the Fifth's white salt light: pale greys to white, a little cold
  A: "#8a929c", B: "#a8b0b8", D: "#c4cad0", E: "#dde2e6", F: "#f2f4f5", K: "#3a3e46", L: "#5c626c",
  // the phosphor of a feed, 0 to 9
  0: "#030a0a", h: "#071514", i: "#0c221f", j: "#12332d", l: "#1a483e", n: "#266252", o: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})
include("../lib/text.js")

const W = 320, H = 180
const iso = (cx, cy) => (u, v, h = 0) => [Math.round(cx + 32 * (u - v)), Math.round(cy + 16 * (u + v) - h * 30)]
const quad = (c, pts, k) => c.poly(pts.flat(), k)
function blk(c, P, u, v, h, du, dv, dh, top, left, right) {
  quad(c, [P(u, v + dv, h), P(u + du, v + dv, h), P(u + du, v + dv, h + dh), P(u, v + dv, h + dh)], left)
  quad(c, [P(u + du, v, h), P(u + du, v + dv, h), P(u + du, v + dv, h + dh), P(u + du, v, h + dh)], right)
  quad(c, [P(u, v, h + dh), P(u + du, v, h + dh), P(u + du, v + dv, h + dh), P(u, v + dv, h + dh)], top)
}
function juno(c, x, y) { c.ellipse(x, y, 9, 4, "e"); c.rect(x - 7, y - 42, 14, 22, "y"); c.rect(x - 7, y - 20, 14, 20, "2"); c.rect(x - 6, y - 52, 12, 11, "y"); c.rect(x - 11, y - 30, 5, 8, "6") }

// ================================================================ 1: the walkway to the Flutwerk's gate
scene("flutwerk_steg_blocks", { w: W, h: 260, bg: "k" },                // taller than the screen: it scrolls up and down
  (c) => {
    const P = iso(100, 122)
    // the water, everywhere under the walkway, a few ripples catching the lamp
    for (let y = 0; y < 260; y++) for (let x = 0; x < W; x++) c.px(x, y, (x * 3 + y * 7) % 29 === 0 ? "g" : y > 190 ? "a" : "b")
    // the Flutwerk's wall (along u, at the back), concrete, its gate and the staff door
    quad(c, [P(-0.5, 0), P(6.5, 0), P(6.5, 0, 6), P(-0.5, 0, 6)], "3")
    for (let h = 0.8; h < 6; h += 1.2) c.line(...P(-0.5, 0, h), ...P(6.5, 0, h), "2")
    quad(c, [P(0.2, 0.02), P(3.2, 0.02), P(3.2, 0.02, 3.6), P(0.2, 0.02, 3.6)], "4")                 // the great gate, shut
    for (let h = 0.2; h < 3.6; h += 0.25) c.line(...P(0.2, 0.02, h), ...P(3.2, 0.02, h), "3")
    quad(c, [P(0.2, 0.02, 3.6), P(3.2, 0.02, 3.6), P(3.2, 0.02, 4.2), P(0.2, 0.02, 4.2)], "Q")         // its yellow-black lintel
    for (let u = 0.3; u < 3.2; u += 0.4) quad(c, [P(u, 0.03, 3.6), P(u + 0.2, 0.03, 3.6), P(u + 0.35, 0.03, 4.2), P(u + 0.15, 0.03, 4.2)], "k")
    { const [x, y] = P(1.7, 0, 4.75); TXT.draw(c, x, y, "FLUTWERK - PUMP HALL 3", "w", { font: "hud", align: "center" }); const [x2, y2] = P(1.7, 0, 4.4); TXT.draw(c, x2, y2, "NO ENTRY", "q", { font: "hud", align: "center" }) }
    quad(c, [P(3.8, 0.02), P(4.6, 0.02), P(4.6, 0.02, 2.2), P(3.8, 0.02, 2.2)], "2")                 // the staff door
    { const [x, y] = P(4.85, 0.02, 1.3); c.rect(x - 2, y - 3, 5, 7, "1"); c.rect(x - 1, y - 2, 3, 1, "Q"); for (let i = 0; i < 3; i++) c.rect(x - 1, y + i, 3, 1, "6") }   // its keypad
    { const [x, y] = P(4.2, 0.02, 2.5); c.rect(x - 2, y, 5, 2, "R") }                                // a lamp over it
    // pipes out of the wall into the water, foaming
    for (const u of [5.4]) { blk(c, P, u, 0, 0.4, 0.5, 1.4, 0.5, "5", "3", "4"); const [x, y] = P(u + 0.25, 1.5, 0.3); for (let i = 0; i < 14; i++) c.px(x - 6 + (i * 5) % 13, y + (i % 4), i % 3 ? "w" : "6") }
    // the walkway, on its posts, from the front left to the staff door; its rail
    const deck = [P(3.4, 0.05), P(4.9, 0.05), P(4.9, 6), P(3.4, 6)]
    for (const [u, v] of [[3.5, 1.5], [4.8, 1.5], [3.5, 3.5], [4.8, 3.5], [3.5, 5.4], [4.8, 5.4]]) c.line(...P(u, v), ...P(u, v, -1.2), "2")
    quad(c, deck, "O"); for (let v = 0.3; v < 6; v += 0.3) c.line(...P(3.4, v), ...P(4.9, v), "K")
    for (let v = 0.6; v <= 6; v += 0.7) c.line(...P(4.9, v), ...P(4.9, v, 1.0), "6")
    c.line(...P(4.9, 0.6, 1.0), ...P(4.9, 6, 1.0), "6")
    // light from the lamp on the walkway
    quad(c, [P(3.5, 0.1), P(4.8, 0.1), P(4.8, 1.2), P(3.5, 1.2)], "P")
    juno(c, ...P(4.1, 2.6))
    // the zoom window on the keypad, as the game shows one: the display, twelve keys
    c.rect(8, 8, 74, 92, "k"); c.rect(8, 8, 74, 1, "v"); c.rect(8, 99, 74, 1, "v"); c.rect(8, 8, 1, 92, "v"); c.rect(81, 8, 1, 92, "v")
    c.rect(14, 14, 62, 80, "2"); c.rect(18, 18, 54, 12, "k"); TXT.draw(c, 45, 21, "_ _ _ _", "Q", { font: "hud", align: "center" })
    const keys = "123456789 0 "
    for (let i = 0; i < 12; i++) { const kx = 20 + (i % 3) * 17, ky = 36 + Math.floor(i / 3) * 14; if (keys[i] === " ") continue; c.rect(kx, ky, 14, 11, "4"); c.rect(kx, ky, 14, 1, "6"); TXT.draw(c, kx + 7, ky + 3, keys[i], "w", { font: "hud", align: "center" }) }
    TXT.draw(c, 45, 103, "REYES, T. - SHIFT B", "v", { font: "hud", align: "center" })
  },
)

// ================================================================ 2: a maintenance camera in the pipes
scene("wartung_cam_blocks", { w: W, h: H, bg: "0" },
  (c) => {
    const PH = "0hijlno789", cx = 162, cy = 92, ph = (i) => PH[Math.max(0, Math.min(9, Math.round(i)))]
    // down the pipe: rings of ribs, darker the deeper; the channel of water along its bottom
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const dx = (x - cx) / 1.25, dy = y - cy, r = Math.hypot(dx, dy), z = 900 / Math.max(r, 6)
      let k = 6.2 - z * 0.022
      if ((z % 14) < 1.6) k += 1.4                                                     // a rib
      if (dy > 0 && Math.abs(dx) < dy * 0.55) k = (k - 1.2) + (((x + Math.floor(z)) % 7) === 0 ? 1.5 : 0)   // the wet channel
      if (r < 16) k = 1                                                                 // the far end, dark
      c.px(x, y, ph(k + (((x * 5 + y * 11) % 13) === 0 ? 0.8 : 0)))
    }
    // the fan at the far end, its blades
    c.circ(cx, cy, 13, "i"); for (let a = 0; a < 6; a++) { const t = a * Math.PI / 3; c.line(cx, cy, Math.round(cx + Math.cos(t) * 12), Math.round(cy + Math.sin(t) * 10), "n") } c.circ(cx, cy, 2, "o")
    // a hatch in the right wall, shut; a pipe and a valve on the left
    c.poly([226, 66, 262, 52, 262, 122, 226, 112], "j"); c.poly([229, 70, 259, 58, 259, 117, 229, 108], "l"); c.rect(240, 84, 8, 6, "7")
    c.rect(40, 30, 10, 140, "l"); c.rect(38, 96, 14, 10, "o"); c.circ(45, 101, 3, "8")
    // the drone on its post at the top of the pipe, its lamp
    c.rect(150, 40, 22, 8, "n"); c.rect(156, 48, 10, 3, "j"); c.rect(160, 51, 2, 2, "9")
    // Ratz before the hatch: small, his collar bright as a lamp
    c.rect(210, 120, 10, 6, "o"); c.rect(219, 117, 5, 5, "o"); c.rect(205, 124, 6, 1, "n"); c.rect(218, 119, 3, 2, "9")
    // the feed's artefacts: scanlines, an older camera's coarse grain, dark corners
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x++) { const k = c.key(x, y), i = PH.indexOf(k); if (i > 0) c.px(x, y, PH[i - 1]) }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const d = Math.hypot((x - 160) / 175, (y - 90) / 105); if (d > 0.8) { const i = PH.indexOf(c.key(x, y)); if (i > 0) c.px(x, y, PH[Math.max(0, i - (d > 0.95 ? 3 : d > 0.88 ? 2 : 1))]) } }
    // the implant's overlay: Ratz, the hatch, the drone
    const br = (x0, y0, x1, y1, k) => { for (let i = 0; i < 4; i++) { c.px(x0 + i, y0, k); c.px(x0, y0 + i, k); c.px(x1 - i, y0, k); c.px(x1, y0 + i, k); c.px(x0 + i, y1, k); c.px(x0, y1 - i, k); c.px(x1 - i, y1, k); c.px(x1, y1 - i, k) } }
    br(202, 112, 226, 130, "v"); TXT.draw(c, 202, 133, "RATZ", "v", { font: "hud" })
    br(224, 50, 264, 124, "v"); TXT.draw(c, 266, 56, "KLAPPE 5-17", "v", { font: "hud" }); TXT.draw(c, 266, 63, "VERRIEGELT", "C", { font: "hud" })
    br(146, 36, 176, 54, "q"); TXT.draw(c, 180, 38, "DROHNE", "q", { font: "hud" })
    for (let i = 0; i < 9; i++) c.px(161 + i * 4, 56 + i * 7, "r")                       // its field of view, dotted
    // the display: which camera, whose net, the link; the time
    TXT.draw(c, 6, 5, "WARTUNG 5-17 // UNTER RING 5", "9", { font: "hud" })
    TXT.draw(c, 6, 12, "NAGI WA MAINTENANCE NET (ALT)", "7", { font: "hud" })
    TXT.draw(c, 6, 19, "LINK: J.REYES IMPLANT OVERRIDE", "C", { font: "hud" })
    TXT.draw(c, 314, 5, "2091-11-13 21:40:12", "9", { font: "hud", align: "right" }); c.circ(296, 15, 2, "9")
  },
)

// ================================================================ 3: the station in the Fifth
scene("station_blocks", { w: W, h: H, bg: "B" },
  (c) => {
    const P = iso(118, 62)
    const U = 8, V = 5, WH = 3.4
    quad(c, [P(0, 0), P(U, 0), P(U, V), P(0, V)], "E")                                    // the floor: pale, polished
    for (let u = 0; u <= U; u += 1) c.line(...P(u, 0), ...P(u, V), "D")
    quad(c, [P(0, 0), P(U, 0), P(U, 0, WH), P(0, 0, WH)], "D")                            // the walls, white
    quad(c, [P(0, 0), P(0, V), P(0, V, WH), P(0, 0, WH)], "B")
    for (const h of [3.0]) { c.line(...P(0, 0, h), ...P(U, 0, h), "F"); c.line(...P(0, 0, h), ...P(0, V, h), "F") }   // light strips
    quad(c, [P(2.5, 0.02, 2.2), P(5.5, 0.02, 2.2), P(5.5, 0.02, 2.8), P(2.5, 0.02, 2.8)], "F")
    { const [x, y] = P(4, 0, 2.7); TXT.draw(c, x, y, "CIVIC REST - STATION 5-MITTE", "L", { font: "hud", align: "center" }) }
    // a terminal on the left wall (Chapter 4: the PURGE's deadline)
    quad(c, [P(0.02, 1.0, 1.0), P(0.02, 2.0, 1.0), P(0.02, 2.0, 1.9), P(0.02, 1.0, 1.9)], "K")
    { const [x, y] = P(0.02, 1.5, 1.7); TXT.draw(c, x, y, "72:00:00", "m", { font: "hud", align: "center" }) }
    // the rows of beds: their feet toward us, heads at the wall's side, a monitor at each, the patch's beat in magenta
    const names = [["NAJO", "5M-0198"], ["RAYA", "5M-0219"], ["TEO", "5M-0412"]]
    let i = 0
    for (const v of [1.2, 3.4]) for (let u = 0.6; u < 7.6; u += 1.7) {
      blk(c, P, u, v, 0, 0.95, 2.0 - 0.9, 0.55, "F", "B", "D")                             // the bed (head at v, feet toward the front)
      blk(c, P, u + 0.1, v + 0.05, 0.55, 0.75, 0.35, 0.1, "F", "D", "E")                   // the pillow
      { const [x, y] = P(u + 0.47, v + 0.22, 0.75); c.rect(x - 3, y - 3, 7, 5, "K") }       // the head, dark hair
      blk(c, P, u + 0.95, v + 0.1, 0, 0.12, 0.12, 1.3, "A", "L", "B")                      // the monitor's pole
      blk(c, P, u + 0.82, v, 1.3, 0.4, 0.1, 0.32, "K", "K", "L")
      { const [x, y] = P(u + 1.02, v + 0.05, 1.45); c.line(x - 5, y, x - 2, y, "m"); c.line(x - 1, y - 2, x + 1, y + 1, "m"); c.line(x + 2, y, x + 5, y, "M") }
      const nm = [null, names[0], null, null, names[1], null, names[2], null][i] ?? ["", ""]; i++
      { const [x, y] = P(u + 0.47, v + 1.1, 0.4); c.rect(x - 9, y - 2, 18, 6, "F"); if (nm[0]) TXT.draw(c, x, y - 1, nm[0], "K", { font: "hud", align: "center" }) }
    }
    // a care robot in the aisle
    blk(c, P, 6.4, 2.6, 0, 0.5, 0.5, 1.0, "F", "D", "E"); { const [x, y] = P(6.65, 2.85, 1.0); c.rect(x - 2, y - 4, 4, 2, "v") }
    juno(c, ...P(3.4, 2.75))
  },
)
