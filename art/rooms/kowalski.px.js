// Kowalski Street baked from its map (art/rooms/kowalski.map.js) with its kit (art/kit/kowalski.kit.px.js)
// and its light (art/lib/isokit.js). PLAN H3. 416 px wide: the room scrolls.
//
// Exports (the atlas takes kowalski_* only):
//   kowalski_bg       416x180, a 12-frame loop at 10 fps: the ad screen's static and its glitch, the Y of
//                     LUCKY STATIC stuttering (its magenta dips with it), rain rings in the puddles and
//                     splashes on the street, the rain on the Kessel Block's door, steam from Bao's pot and
//                     out of the drain
//   kowalski_vending, kowalski_cart, kowalski_umbrella, kowalski_bins, kowalski_scaffold, kowalski_lights   the props, pivot
//                     bottom-centre (the string lights and cables without an outline)
//   kowalski_no_cable   Chapter 2: the street without the cable to Bao's cart (while it is gone), only what differs, its top-left at
//                     layout.noCable
//   kowalski_alley_open   the alley's gate pushed aside (from Chapter 1 on), only what differs from the shut
//                     one, its top-left at layout.alleyOpen
//   kowalski_ad_stutter, kowalski_ad_eye, kowalski_ad_juno   the prologue's moment (step 17) on the ad screen,
//                     each the size of the screen's rect in the layout (openings.ad), its top-left there:
//                     the screen failing (8 frames, a loop), the eye opening in the static and turning to look
//                     down at the street (20 frames, once), JUNO. over the whole screen (8 frames, a loop)
// KOWALSKI.layout has the measured numbers (tools/iso-layout.mjs writes the same for the game).
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/kowalski.map.js")
include("../lib/isokit.js")
include("../kit/kowalski.kit.px.js", { palette: true })

const KW_MAP = ISO_MAPS.kowalski, KW_P = ISOMAP.projector(KW_MAP)
// rain splashing on the street: a few crowns a frame, only on the floor
const kwSplashes = (c) => {
  const f = c.frame ?? 0, r = c.rng(40 + f), [W, H] = KW_MAP.screen
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(r() * W), y = Math.floor(r() * H), [u, v] = KW_P.uvAt(x, y)
    if (u < 0.15 || v < 0.15 || u > 7 || v > 6 || KOW.cellAt(u, v) === ".") continue
    c.px(x, y, "6"); c.px(x - 1, y - 1, "x"); c.px(x + 1, y - 1, "x")
  }
}
// steam from Bao's pot (behind the umbrella it goes out of sight) and out of the drain
const kwSteam = (c) => {
  const f = c.frame ?? 0, [px, py] = KW_P.P(2.95, 2.3, 1.22), [gx, gy] = KW_P.P(4.75, 1.25, 0)
  c.plume(px, py, "HhZ", { every: 3, life: 24, rise: 20, wind: -0.15, size: [2, 4], seed: 3, frame: f })
  c.plume(gx, gy, "hZz", { every: 3, life: 24, rise: 26, wind: -0.3, size: [1, 4], seed: 7, frame: f })
}

const KOWALSKI = ISOKIT.bake(KW_MAP, {
  id: "kowalski", frames: 12, fps: 10,
  // the wet street shines: the puddles mirror the neon, the screen and the bar's windows; the rest takes a sheen
  sheen: { reach: 3.4, map: (u, v) => (KOW.inPuddle(u, v) ? ISO.MIRROR : ISO.SHEEN), keys: (u, v) => KOW.cellAt(u, v) !== "." },
  glows: [kwSplashes, kwSteam, glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 })],
})

// ---- the moment: the screen's own picture (art/kit/kowalski.kit.px.js, KOW.adScreen) laid onto the wall's
// slope pixel by pixel, as the bake lays the opening (the same mapping, so it sits exactly on it)
{
  const AD = KW_MAP.openings.find((o) => o.id === "ad"), [CX, CY] = KW_MAP.at, BOX = KOWALSKI.layout.openings.ad
  const AW = Math.round((AD.to - AD.from) * 32), AH = Math.round((AD.h[1] - AD.h[0]) * 30)
  const onScreen = (mode) => (c) => {
    const f = c.frame ?? 0, R = ISOKIT.raster(AW, AH, (r) => KOW.adScreen(r, 0, 0, AW, AH, f, mode, f))
    for (let y = 0; y < BOX[3]; y++) for (let x = 0; x < BOX[2]; x++) {
      const X = BOX[0] + x, Y = BOX[1] + y, u = (X + 0.5 - CX) / 32
      if (u < AD.from || u >= AD.to) continue
      const h = (CY + 16 * u - Y - 0.5) / 30
      if (h < AD.h[0] || h >= AD.h[1]) continue
      const k = R(Math.floor((u - AD.from) * 32), Math.floor((h - AD.h[0]) * 30))
      if (k) c.px(x, y, k.startsWith("!") ? k.slice(1) : k)
    }
  }
  const glows = [glow("vV", { r: 4, strength: 0.35 })]
  anim("kowalski_ad_stutter", { w: BOX[2], h: BOX[3], frames: 8, fps: 10 }, onScreen("stutter"), ...glows)
  anim("kowalski_ad_eye", { w: BOX[2], h: BOX[3], frames: 20, fps: 10 }, onScreen("eye"), ...glows)
  anim("kowalski_ad_juno", { w: BOX[2], h: BOX[3], frames: 8, fps: 10 }, onScreen("juno"), ...glows)
}

// ---- the alley's gate standing open (from Chapter 1 on): the street baked again with the gate pushed aside; what
// differs from the shut one is kowalski_alley_open, laid over the picture at layout.alleyOpen (game/rooms/kowalski.js
// shows it from day 2). Only frame 0: nothing that stutters reaches the alley.
{
  const OPEN = ISOKIT.bake({ ...KW_MAP, openings: KW_MAP.openings.map((o) => (o.id === "alley" ? { ...o, kit: "alley_gate_open" } : o)) },
    { id: "kowalski", frames: 1, sheen: { reach: 3.4, map: (u, v) => (KOW.inPuddle(u, v) ? ISO.MIRROR : ISO.SHEEN), keys: (u, v) => KOW.cellAt(u, v) !== "." }, define: false })
  const A = KOWALSKI.BG[0], B = OPEN.BG[0], W = A.W
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1
  for (let i = 0; i < B.k.length; i++) if (B.k[i] !== A.k[i]) { const x = i % W, y = Math.floor(i / W); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  sprite("kowalski_alley_open", { w: x1 - x0 + 1, h: y1 - y0 + 1 }, (c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = y * W + x; if (B.k[i] !== A.k[i] && B.k[i]) c.px(x - x0, y - y0, B.k[i]) }
  })
  KOWALSKI.layout.alleyOpen = [x0, y0]
}

// ---- Bao's cart gone (Chapter 2, Saturday and Sunday after K1b sold): the street baked again without the cable it ran on; what differs
// is kowalski_no_cable, laid over the picture at layout.noCable (game/kapitel2_folgen.js). Only frame 0, as the gate's
{
  KOW.CABLE_ON.on = false
  const NONE = ISOKIT.bake(KW_MAP, { id: "kowalski", frames: 1, sheen: { reach: 3.4, map: (u, v) => (KOW.inPuddle(u, v) ? ISO.MIRROR : ISO.SHEEN), keys: (u, v) => KOW.cellAt(u, v) !== "." }, define: false })
  KOW.CABLE_ON.on = true
  const A = KOWALSKI.BG[0], B = NONE.BG[0], W = A.W
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1
  for (let i = 0; i < B.k.length; i++) if (B.k[i] !== A.k[i]) { const x = i % W, y = Math.floor(i / W); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  sprite("kowalski_no_cable", { w: x1 - x0 + 1, h: y1 - y0 + 1 }, (c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = y * W + x; if (B.k[i] !== A.k[i] && B.k[i]) c.px(x - x0, y - y0, B.k[i]) }
  })
  KOWALSKI.layout.noCable = [x0, y0]
}

console.log("ISO_LAYOUT " + JSON.stringify({ id: "kowalski", ...KOWALSKI.layout }))
