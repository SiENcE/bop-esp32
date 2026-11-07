// H3: the intro "Die letzte Schicht" (kapitel0-design §5) as a storyboard in blocks, decided 2026-11-04, before it
// is painted: each shot at 320x180, a sketch of what the camera sees, and Juno three years ago from the side
// (the first side view, style guide §4: the scale of the street, 30 px per meter of height).
//   intro_blocks_a1, _a2, _c           the opening: one float over the lit sea to the tower and in through a window
//   intro_blocks_1 .. intro_blocks_4   the hall, Juno at her desk, the announcement, the screens going out
//   intro_blocks_t, _d                 her words on black; the ride down the Transitachse, no words
//   intro_blocks_6, _7                 today; the title screen with the logo
//   intro_blocks_juno                  Juno in 2088 from the side: Nagi·wa grey, the badge on its lanyard, the box
//   intro_blocks, intro_blocks_opening all of them on one sheet; the opening and the ride
// The words on the screen are the game's (German, through i18n); painted text only the city's (English).
pal({
  k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  0: "#030a0a", 7: "#12332d", 8: "#266252", 9: "#55a585", P: "#8acfae", Q: "#d4f7e2",       // the phosphor screens
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",                                     // Nagi·wa's cyan
  y: "#eec414", Y: "#fff070", j: "#9a7406",                                                   // Juno's yellow
  g: "#565e70", G: "#8e96a8", h: "#7d8ca4", H: "#b9c6d8",                                     // Nagi·wa grey, the uniform
  s: "#93583f", S: "#d79676", u: "#1b1f2e", O: "#552b1c", R: "#ffd58a", W: "#fff4d8", q: "#ff3a3a",
  m: "#ff4fd3", M: "#a8238a", N: "#ffc0f2", w: "#3a4c64",
})
include("../lib/text.js")
const ISO_BAY = (x, y) => ([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5][(y & 3) * 4 + (x & 3)] + 0.5) / 16

const W = 320, H = 180
const label = (c, n, s) => { c.rect(0, 0, W, 9, "n"); TXT.draw(c, 3, 2, `${n}  ${s}`, "6", { font: "hud" }) }
// an iso box (2:1), its top lit, its two faces
const P = (cx, cy, u, v, h) => [cx + 2 * (u - v), cy + (u + v) - h]
function isoBox(c, cx, cy, u0, v0, du, dv, dh, top, fu, fv) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    for (const [lvl, k] of [[dh, top]]) {
      const a = (x - cx) / 2, b = y - cy + lvl, u = (a + b) / 2, v = (b - a) / 2
      if (u >= u0 && u < u0 + du && v >= v0 && v < v0 + dv) { c.px(x, y, k); }
    }
  }
  // the faces: +v (lower left) and +u (lower right)
  for (let e = 0; e < dh; e++) {
    for (let t = 0; t < du; t++) { const [x, y] = P(cx, cy, u0 + t, v0 + dv, e); c.px(x, y, fv); c.px(x + 1, y, fv) }
    for (let t = 0; t < dv; t++) { const [x, y] = P(cx, cy, u0 + du, v0 + t, e); c.px(x, y, fu); c.px(x - 1, y, fu) }
  }
}
// a person at a desk from behind (iso, small), a cable from the desk up into the neck
function deskPerson(c, x, y, lit) {
  c.rect(x - 3, y - 13, 7, 9, "g"); c.ellipse(x, y - 16, 2, 3, "u"); c.line(x + 6, y - 2, x + 2, y - 15, "1")
  if (lit) c.px(x + 2, y - 15, "9")
}

// ---------------------------------------------------------------- 1 the hall
// out: how far the screens have gone out, back to front (0 none; 1 the walls; 2.. the walls and that many rows of desks)
function hall(c, out = 0) {
  c.rect(0, 0, W, H, "1")
  // the back walls: phosphor screens floor to ceiling, rows of them
  const CX = 160, CY = 40
  for (let y = 0; y < CY + 60; y++) for (let x = 0; x < W; x++) {
    const back = y < CY + Math.abs(x - CX) / 2 - 2 && y > 6
    if (!back) continue
    const cellx = Math.floor(x / 10), celly = Math.floor((y - Math.abs(x - CX) / 2) / 8)
    const gap = x % 10 === 0 || (y - Math.floor(Math.abs(x - CX) / 2)) % 8 === 0
    const row = Math.abs(cellx - 16)
    c.px(x, y, gap || out >= 1 ? "0" : (cellx + celly) % 5 === 0 ? "P" : (cellx * 3 + celly) % 4 === 0 ? "9" : "8")
  }
  // the floor and the rows of desks, each with a watcher; from the back to the front
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (y >= CY + Math.abs(x - CX) / 2 - 2 && !c.key(x, y)) c.px(x, y, "2")
  for (let r = 0; r < 5; r++) for (let i = 0; i < 6; i++) {
    const u = 14 + r * 14, v = 6 + i * 13
    const [x, y] = P(CX, CY + 40, u, v, 0)
    if (y > H + 10) continue
    isoBox(c, CX, CY + 40, u, v, 8, 4, 6, "4", "3", "2")
    const dark = out >= 2 + r
    c.rect(x - 4, y - 18, 9, 6, dark ? "0" : "8"); c.rect(x - 3, y - 17, 7, 4, dark ? "0" : "9")   // the desk's own screen
    deskPerson(c, x + 2, y + 2, !dark)
  }
}
sprite("intro_blocks_1", { w: W, h: H }, (c) => {
  hall(c)
  c.rect(0, H - 12, W, 12, "n"); TXT.draw(c, 6, H - 9, "2088-04-30  05:45", "9", { font: "hud" })
  label(c, 1, "DIE BEOBACHTUNGSHALLE, NAGI·WA TOWER. BRUMMEN, TIPPEN")
})

// ---------------------------------------------------------------- 2 Juno at her desk
function desk(c, screen) {
  c.rect(0, 0, W, H, "1")
  // the wall of screens behind her own, out of focus
  for (let y = 10; y < 110; y++) for (let x = 0; x < W; x++) c.px(x, y, (Math.floor(x / 22) + Math.floor(y / 16)) % 3 === 0 ? "8" : "7")
  // her screen: big, the feed of a street, a man stopping (screen "street"), or dark with her face in it ("dark")
  c.rect(78, 22, 164, 96, "k"); c.rect(82, 26, 156, 88, screen === "dark" ? "0" : "8")
  if (screen === "street") {
    c.rect(82, 80, 156, 34, "7"); for (let x = 90; x < 238; x += 24) c.rect(x, 40, 14, 40, "9")       // the street, its fronts
    for (const [x, k] of [[110, "P"], [138, "9"], [196, "P"], [214, "9"]]) { c.rect(x, 74, 5, 14, k); c.rect(x + 1, 70, 3, 4, k) }
    c.rect(160, 70, 6, 18, "Q"); c.rect(161, 65, 4, 5, "Q")                                           // the man who stopped
    for (const [x, y] of [[156, 62], [168, 62], [156, 89], [168, 89]]) c.rect(x, y, 3, 1, "y")        // her tag: yellow brackets
    c.rect(156, 62, 1, 3, "y"); c.rect(170, 62, 1, 3, "y"); c.rect(156, 87, 1, 3, "y"); c.rect(170, 87, 1, 3, "y")
  } else {
    c.ellipse(160, 66, 16, 20, "2"); c.ellipse(160, 60, 15, 12, "1"); c.rect(153, 66, 4, 1, "3"); c.rect(164, 66, 4, 1, "3")   // her face, mirrored, faint
  }
  // the desk, the keyboard, the cable into her neck; Juno from behind and to the side: short black hair, the
  // grey uniform, the badge's lanyard
  c.rect(0, 130, W, 50, "3"); c.rect(0, 130, W, 2, "4"); c.rect(120, 136, 80, 8, "4")
  c.ellipse(70, 118, 22, 26, "u"); c.rect(44, 136, 54, 44, "g"); c.rect(44, 136, 6, 44, "h")
  c.line(84, 120, 120, 132, "1"); c.line(84, 121, 120, 133, "2"); c.px(84, 120, "9")
  c.line(92, 140, 98, 160, "C"); c.rect(96, 160, 6, 8, "H")
  c.ellipse(96, 124, 5, 8, "s"); c.rect(140, 150, 26, 12, "s")                                       // her cheek, her hand on the keys
}
sprite("intro_blocks_2", { w: W, h: H }, (c) => {
  desk(c, "street")
  c.rect(60, 156, 200, 14, "n"); TXT.draw(c, 160, 160, "„Hab dich.“", "Y", { align: "center" })
  label(c, 2, "JUNO AN IHREM PULT. SIE MARKIERT IHN, GELB")
})

// ---------------------------------------------------------------- 3 the announcement
sprite("intro_blocks_3", { w: W, h: H }, (c) => {
  hall(c)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((x + y) % 2) c.px(x, y, "n")
  c.rect(0, 70, W, 40, "k"); c.hline(0, 70, W, "C"); c.hline(0, 109, W, "C")
  TXT.draw(c, 160, 78, "Ab morgen übernimmt die automatische Auswertung.", "V", { align: "center" })
  TXT.draw(c, 160, 92, "Nagi·wa dankt Ihnen für Ihren Dienst.", "V", { align: "center" })
  label(c, 3, "DIE DURCHSAGE, ÜBER DIE GANZE BREITE")
})

// ---------------------------------------------------------------- 4 the screens go out, back to front; hers last
sprite("intro_blocks_4", { w: W, h: H }, (c) => {
  hall(c, 4)
  // an inset: her screen dark, her face in it
  c.rect(206, 96, 110, 66, "k"); c.rect(208, 98, 106, 62, "0")
  c.ellipse(261, 128, 12, 15, "2"); c.ellipse(261, 123, 11, 9, "1"); c.rect(255, 128, 3, 1, "3"); c.rect(264, 128, 3, 1, "3")
  TXT.draw(c, 212, 150, "IHR SCHIRM ZULETZT", "6", { font: "hud" })
  label(c, 4, "DIE SCHIRME GEHEN AUS, VON HINTEN NACH VORN. STILLE")
})

// ---------------------------------------------------------------- Juno in 2088, for the Transitachse (D)
function juno2088(c, x, y, flip = false) {
  // side view, facing right (or left): 50 px; short black hair, Nagi·wa grey, dark trousers, the badge on its
  // lanyard, the box in her arms (a cactus, a cup, the yellow coat folded, the data stick)
  const f = (dx) => (flip ? x - dx : x + dx), r = (dx, dy, w, h, k) => c.rect(flip ? x - dx - w + 1 : x + dx, y + dy, w, h, k)
  r(-3, -50, 7, 4, "u"); r(-4, -46, 8, 8, "S"); r(-4, -46, 3, 5, "u"); r(2, -43, 1, 1, "k")         // hair, face, the eye
  r(-5, -38, 10, 18, "g"); r(-5, -38, 2, 18, "h")                                                   // the uniform jacket
  r(-1, -36, 1, 10, "C"); r(-2, -27, 3, 4, "H")                                                     // the lanyard, the badge
  r(-4, -20, 4, 16, "2"); r(0, -20, 4, 16, "3"); r(-5, -4, 5, 4, "1"); r(0, -4, 6, 4, "1")          // legs, shoes
  // the box held in front of her, its contents over its rim
  r(3, -30, 14, 10, "O"); r(3, -30, 14, 1, "P")
  r(5, -35, 3, 5, "9"); r(9, -33, 3, 3, "H"); r(12, -32, 4, 2, "y"); r(15, -33, 2, 3, "v")
  r(1, -31, 3, 6, "h")                                                                              // her arm round it
}

// ---------------------------------------------------------------- 6 today
sprite("intro_blocks_6", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "1")
  // the CRT with a phosphor feed, the deck's boards and cables, her hand on the mouse, the yellow sleeve
  c.rect(60, 20, 150, 110, "4"); c.rect(70, 28, 130, 90, "0"); c.rect(74, 32, 122, 82, "8")
  for (let x = 80; x < 190; x += 18) c.rect(x, 48, 10, 40, "9"); c.rect(74, 92, 122, 22, "7")
  c.rect(220, 60, 70, 50, "3"); c.rect(224, 66, 30, 6, "C"); c.rect(260, 66, 24, 4, "v"); c.line(220, 100, 200, 140, "k")
  c.rect(0, 140, W, 40, "2"); c.rect(150, 148, 22, 12, "4"); c.rect(150, 148, 22, 2, "5")
  c.rect(110, 146, 44, 18, "y"); c.rect(110, 146, 44, 3, "Y"); c.rect(110, 160, 44, 4, "j"); c.rect(152, 150, 14, 9, "S")
  c.rect(0, H - 12, W, 12, "n"); TXT.draw(c, 6, H - 9, "2091-11-03  21:30", "9", { font: "hud" })
  label(c, 6, "SCHNITT: HEUTE. EIN FEED, DAS SELBSTGEBAUTE DECK, GELBER ÄRMEL")
})
// 7  the end: the title screen with the Glass Sister logo (art/ui/splash.px.js), as on every start, then the menu
sprite("intro_blocks_7", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "n")
  c.line(160, 20, 150, 70, "4"); c.line(150, 70, 166, 120, "4"); c.line(166, 120, 158, 170, "4")      // the crack in the glass
  c.rect(90, 80, 140, 20, "k"); TXT.draw(c, 160, 86, "GLASS SISTER", "V", { align: "center" })
  label(c, 7, "DAS LOGO: DER TITELBILDSCHIRM WIE BEI JEDEM START, DANN DAS MENÜ")
})

sprite("intro_blocks_juno", { w: 60, h: 60, pivot: "bottom" }, (c) => { c.rect(0, 0, 60, 60, "3"); juno2088(c, 26, 56) })

// ---------------------------------------------------------------- the opening (after the notes of 2026-11-04):
// the mood of a neo-noir opening, our own pictures: one slow float, low over the lit sea to the tower and in
// through its green window band. The ground is seen in perspective (a camera 20 m over the water, the horizon
// at HZ), so the float can be drawn the same way in the game: lights and stacks at (X, Z), the camera moving in Z.
// A1 low over the water: the drowned city's roofs, stilt huts, rafts and buoys lit to the horizon, the pumps'
//    stacks standing out of the sea and flaring, the haze glowing; the camera drifts forward, slowly
// A2 further on: Nagi·wa ahead in the haze, the nine rings stacked, the tower through them; the patrol
//    drones' searchlights sweeping the water; big stacks passing on both sides
// C  the tower close, one window band glowing phosphor green; the camera goes in through one window
const HZ = 60, F = 160, CAM_H = 20
const rnd = (i, s) => { let h = (i * 374761393 + s * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
const proj = (X, Z, Y = 0) => [Math.round(160 + (X * F) / Z), Math.round(HZ + ((CAM_H - Y) * F) / Z)]
// the sky, its haze glowing over the horizon, and the dark water
function skyAndSea(c) {
  c.rect(0, 0, W, H, "n")
  for (let y = HZ - 34; y < HZ; y++) for (let x = 0; x < W; x++) if (ISO_BAY(x, y) < (y - HZ + 34) / 40) c.px(x, y, (y > HZ - 6 && ISO_BAY(x, y) < 0.3) ? "2" : "1")
  c.rect(0, HZ, W, H - HZ, "k")
}
// the lights on the water: clusters (huts on stilts, rafts) of warm windows, a few cold and pink ones, spread
// evenly down the screen (Z drawn uniform in 1/Z), the near ones two pixels wide with a glint below; seed: which
function seaLights(c, seed) {
  for (let i = 0; i < 520; i++) {
    const u = rnd(i, seed + 2) ** 2.6, cz = 1 / (1 / 600 + u * (1 / 30 - 1 / 600)), cx = (rnd(i, seed + 1) - 0.5) * cz * 2.4
    const n = 2 + Math.floor(rnd(i, seed + 3) * 6)
    for (let j = 0; j < n; j++) {
      const X = cx + (rnd(i * 8 + j, seed + 4) - 0.5) * 8, Z = cz + (rnd(i * 8 + j, seed + 5) - 0.5) * 8
      if (Z < 26) continue
      const [x, y] = proj(X, Z, rnd(i * 8 + j, seed + 6) * 4)
      if (x < 0 || x >= W || y < HZ || y >= H) continue
      const t = rnd(i * 8 + j, seed + 7), k = t < 0.72 ? "R" : t < 0.86 ? "W" : t < 0.95 ? "6" : "m"
      c.px(x, y, Z > 180 && t < 0.6 ? "O" : k)
      if (Z < 60) c.px(x + 1, y, k)
      if (Z < 120 && rnd(i * 8 + j, seed + 9) < 0.5) c.px(x, y + 1, "O")                              // its glint in the water
    }
  }
}
// a pump's stack standing out of the sea, its flame at the top (Y in metres)
function stack(c, X, Z, top = 34) {
  const [x0, y0] = proj(X, Z), [, y1] = proj(X, Z, top), w = Math.max(2, Math.round((5 * F) / Z))
  c.rect(x0 - (w >> 1), y1, w, y0 - y1, "2"); c.rect(x0 - (w >> 1), y1, 1, y0 - y1, "4"); c.rect(x0 - (w >> 1) - 1, y1, w + 2, 2, "3")
  for (let b = y1 + 4; b < y0; b += Math.max(4, w * 2)) c.hline(x0 - (w >> 1), b, w, "3")            // its rings and ladders
  c.px(x0 + (w >> 1), y1 + 2, "q")
  // the flame, billowing up, its smoke lit from below
  const f = Math.max(2, Math.round((4 * F) / Z))
  c.ellipse(x0 + 1, y1 - f * 4, f + 1, f + 1, "2"); c.ellipse(x0, y1 - f * 3, f + 2, f + 1, "O")
  c.ellipse(x0, y1 - f * 2, f + 1, f * 2, "R"); c.ellipse(x0, y1 - f, Math.max(1, f >> 1), f, "W")
}
// a patrol drone (its red eye) and its searchlight cone down to the water, dithered
function droneBeam(c, x, y, gx, gy, spread) {
  for (let yy = y + 2; yy <= gy; yy++) {
    const t = (yy - y) / (gy - y), cx = x + (gx - x) * t, hw = 1 + spread * t
    for (let xx = Math.floor(cx - hw); xx <= cx + hw; xx++) if (ISO_BAY(xx, yy) < 0.22 + 0.2 * t) c.px(xx, yy, yy > gy - 3 ? "6" : "4")
  }
  c.ellipse(gx, gy, spread + 2, 2, "5"); c.hline(x - 2, y - 1, 5, "4"); c.px(x, y, "q")
}
sprite("intro_blocks_a1", { w: W, h: H }, (c) => {
  skyAndSea(c); seaLights(c, 0)
  for (const [X, Z, t] of [[-150, 360, 40], [-70, 220, 44], [90, 280, 42], [130, 140, 40], [-95, 110, 46], [40, 460, 40], [230, 500, 38], [-30, 520, 40]]) stack(c, X, Z, t)
  c.rect(60, 164, 200, 12, "n"); TXT.draw(c, 160, 166, "NAGI·WA, 2088", "6", { align: "center", font: "hud" })
  label(c, "A1", "TIEF ÜBER DEM LICHTERMEER, LANGSAM VORWÄRTS. FLAMMENDE SCHLOTE. MUSIK")
})
sprite("intro_blocks_a2", { w: W, h: H }, (c) => {
  skyAndSea(c)
  // Nagi·wa ahead in the haze: the nine rings stacked, narrower going up, their window bands dim with distance;
  // the tower through them, its ring logo, the hall's green band
  for (let r = 0; r < 9; r++) {
    const y0 = HZ + 2 - r * 5, half = 112 - r * 11
    c.rect(160 - half, y0 - 5, half * 2, 6, r % 2 ? "1" : "2"); c.hline(160 - half, y0 - 5, half * 2, "3")
    for (let x = 160 - half + 2; x < 160 + half - 2; x += 2) if (rnd(x, r) < 0.45) c.px(x, y0 - 3, r < 3 ? (rnd(x, r + 20) < 0.85 ? "O" : "M") : rnd(x, r + 20) < 0.7 ? "O" : "c")
  }
  c.rect(155, 14, 10, HZ - 14, "1"); c.rect(159, 14, 2, HZ - 14, "3"); c.rect(155, 24, 10, 2, "9")
  c.ellipse(160, 12, 4, 2, "C"); c.ellipse(160, 12, 2, 1, "1")
  for (let y = HZ - 30; y < HZ + 4; y++) for (let x = 30; x < 290; x++) if (ISO_BAY(x, y) < 0.18) c.px(x, y, "1")   // the haze in front of it
  seaLights(c, 40)
  droneBeam(c, 96, 40, 82, 112, 9); droneBeam(c, 236, 30, 252, 96, 7)
  for (const [X, Z, t] of [[-40, 70, 40], [44, 96, 42], [-110, 220, 40], [130, 260, 38]]) stack(c, X, Z, t)
  for (const [x, y] of [[120, 50], [208, 18]]) c.hline(x, y, 7, "H")                                  // transit pods
  label(c, "A2", "NAGI·WA VORAUS IM DUNST. DROHNEN LEUCHTEN DAS WASSER AB. AUF DEN TURM ZU")
})
sprite("intro_blocks_c", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "n")
  for (let y = 12; y < H; y += 12) for (let x = 20; x < 300; x += 14) c.rect(x, y, 10, 7, y === 84 ? "9" : (x + y) % 5 ? "1" : "2")
  c.rect(20, 82, 280, 11, "8"); for (let x = 22; x < 298; x += 14) c.rect(x, 84, 10, 7, "P")
  // the way in: the frame closing on one window, the desks and their watchers behind it
  c.rect(146, 80, 28, 15, "Y"); c.rect(147, 81, 26, 13, "P")
  for (let x = 150; x < 172; x += 6) { c.rect(x, 89, 4, 4, "7"); c.ellipse(x + 1, 87, 1, 1, "7") }
  label(c, "C", "DER TURM: EIN FENSTERBAND GRÜN, DIE KAMERA GEHT HINEIN")
})
// D  the ride down: no words; the rings rush up past the glass in streaks, Juno still with her box; slow music
sprite("intro_blocks_d", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "n")
  for (let x = 0; x < W; x += 2) { const y0 = (x * 37) % 180, len = 20 + (x * 11) % 40; c.vline(x, y0, len, (x * 7) % 5 ? "2" : (x % 3 ? "R" : "v")) }
  for (const y of [20, 96]) c.rect(0, y, W, 10, "3")                                                     // a ring's deck, a blur
  c.rect(90, 0, 3, H, "5"); c.rect(228, 0, 3, H, "5")
  c.rect(96, 52, 128, 2, "6"); c.rect(96, 138, 128, 6, "5"); c.rect(96, 52, 3, 92, "6"); c.rect(221, 52, 3, 92, "6")
  juno2088(c, 150, 138)
  // where the ride begins: close on the box, the data stick's label readable for a second, then the camera pulls back
  c.rect(4, 14, 86, 44, "6"); c.rect(5, 15, 84, 42, "O"); c.rect(5, 15, 84, 3, "s")
  c.rect(10, 26, 74, 14, "4"); c.rect(10, 26, 74, 1, "5"); c.rect(12, 28, 70, 10, "H")
  TXT.draw(c, 47, 31, "EVAL-7 // DELETE", "k", { align: "center", font: "hud" })
  c.rect(60, 44, 20, 10, "y"); c.rect(14, 44, 8, 10, "9")
  TXT.draw(c, 160, 160, "(KEIN TEXT. ~10 S. DIE RINGE RASEN VORBEI, DIE MUSIK LANGSAM)", "6", { align: "center", font: "hud" })
  label(c, "D", "DIE FAHRT ABWÄRTS, OHNE WORTE. ZUERST NAH: DER STICK")
})

// T  before the ride, on black: her words (the ride itself has none)
sprite("intro_blocks_t", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "n")
  TXT.draw(c, 160, 80, "„Das Implantat durften wir behalten.", "Y", { align: "center" })
  TXT.draw(c, 160, 92, "Sie sagten, das Herausnehmen kostet mehr.“", "Y", { align: "center" })
  label(c, "T", "VOR DER FAHRT, AUF SCHWARZ")
})

const STORY = ["a1", "a2", "c", 1, 2, 3, 4, "t", "d", 6, 7]
sprite("intro_blocks", { w: W * 3 + 12, h: H * 4 + 18 }, (c) => {
  c.rect(0, 0, W * 3 + 12, H * 4 + 18, "n")
  STORY.forEach((n, i) => c.stamp(`intro_blocks_${n}`, (i % 3) * (W + 6), Math.floor(i / 3) * (H + 6)))
})
// the opening on its own: the float and the ride
sprite("intro_blocks_opening", { w: W * 2 + 6, h: H * 2 + 6 }, (c) => {
  c.rect(0, 0, W * 2 + 6, H * 2 + 6, "n")
  ;["a1", "a2", "c", "d"].forEach((n, i) => c.stamp(`intro_blocks_${n}`, (i % 2) * (W + 6), Math.floor(i / 2) * (H + 6)))
})
