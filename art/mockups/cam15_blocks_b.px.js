// Blocks for CAM 15, the capsule hotel Morpheus (kapitel1-design §A6: a corridor of capsules, two high, numbered; Kessler crawls
// into capsule 23; Juno can write on 23's screen to warn him, K1a). Feed mode, 320x180, the phosphor ramp only. A blockout in
// meters (art/lib/feed.js) with flat materials, so only the layout is judged: where Kessler comes in and where he stands at 23,
// how big he is, how big 23 is to click, what the display covers ("mit OSD").
// Variant B, frontal: the camera high on the corridor's near wall, looking straight across a narrow corridor at the one capsule
// wall (17 to 24 above 25 to 32), a little from above, through a wide lens: the low ceiling with its light panels over the
// picture's top, the lino under its bottom, the corridor's two ends bending in at the sides. The right end is the door from the
// stairs, under a hanging EXIT sign, at the picture's edge; the left end, under the display, a vending machine. The numbers
// count from the door (17 nearest it), so 23 is second from the left: Kessler comes in through the door, walks the whole wall
// along the lino to 23, to its ladder, and climbs in.
// Not built into the game.
//   PXL build art/mockups/cam15_blocks_b.px.js --out build/art/cam15_blocks_b --no-preview
include("../lib/feed.js")
include("../lib/text.js")
pal({ ...PHOSPHOR })
ramps(PH)

const W = 320, H = 180

// ================================================================ the place, in meters (x along the corridor, y up, z across it, away from the camera)
// The corridor is narrow and the lens wide: Kessler must be about 24 px tall at 23, so the capsule wall stays a band across the
// middle; what makes it a corridor and not a hall is the ceiling, the floor and the two ends, all near.
const WZ = 3.8                                            // the capsule wall's front (the corridor is that wide)
const CW = 1.3, CH = 1.2, BASE = 0.4                      // a capsule's face: width, height; the plinth under the lower row
const X0 = 0                                              // the capsule wall's left edge (24 and 32); eight columns to the right
const XE = X0 + 8 * CW                                    // where the capsules end
const XR = XE + 0.4, XL = X0 - 1.6                        // the corridor's two end walls
const DOOR = [2.2, 3.2]                                   // the door from the stairs, in the right end wall (z)
const TOP = BASE + 2 * CH, CEIL = TOP + 0.65              // the top of the upper row; the low ceiling (the soffit between)
const HATCH = { l: 0.1, r: 0.1, b: 0.1, t: 0.66 }         // the opening in a face (from its left, right, bottom; its top's height)
const LIT = new Set([18, 21, 26, 27, 30, 32])             // capsules lit from inside (their curtains glow)
const col = (n) => 7 - (n - 17) % 8, row = (n) => (n < 25 ? 1 : 0)
const cx0 = (n) => X0 + col(n) * CW, cy0 = (n) => BASE + row(n) * CH
const NUMX = 0.3                                          // a number's middle on its band, from the face's left
const SIGN = [X0 + 2.6, TOP + 0.1, X0 + 7.8, TOP + 0.5]   // MORPHEUS on the soffit over the capsules (x0, y0, x1, y1)
const EXIT = [XR - 0.95, XR - 0.15, 2.5, 2.82, 2.3]        // the hanging EXIT sign: x0, x1, y0, y1, its face's z
const PANELS = [[0.6, 1.2], [3.6, 1.2], [6.6, 1.2], [9.6, 1.2], [-0.9, 2.4], [2.1, 2.4], [5.1, 2.4], [8.1, 2.4]]  // the ceiling's light panels (x, z of their middle)
const CAM = makeCam({ pos: [4.6, 2.9, 0.1], yaw: 0, pitch: 14, F: 48, w: W, h: H, k: 0.22 })

const PRIMS = [
  block([XL, -0.2, WZ], [XR, CEIL, WZ + 2.4], "wall"),                    // the wall the capsules sit in (and behind them)
  block([X0 - 0.02, TOP, WZ - 0.25], [XE + 0.02, CEIL, WZ], "soffit"),    // the soffit over the upper row
  block([XL - 0.3, -0.2, -0.5], [XL, CEIL, WZ + 0.1], "endwall"),         // the far end
  block([XR, -0.2, -0.5], [XR + 0.3, CEIL, WZ + 0.1], "endwall"),         // the near end, the door in it
  block([XL - 0.3, CEIL, -0.5], [XR + 0.3, CEIL + 0.2, WZ + 0.1], "ceil"),
  block([XL, -0.2, -0.8], [XR, CEIL, -0.4], "wall"),                      // the camera's wall
  block([X0, 0, WZ - 0.08], [XE, BASE, WZ], "plinth"),                       // the luggage drawers under the lower row
  // the light panels in the ceiling's grid; a sprinkler pipe near the camera; the cable tray along the soffit's foot
  ...PANELS.map(([x, z]) => block([x - 0.6, CEIL - 0.04, z - 0.3], [x + 0.6, CEIL - 0.01, z + 0.3], "panel")),
  block([XL, CEIL - 0.2, 0.75], [XR, CEIL - 0.12, 0.83], "pipe"),
  block([XL, TOP - 0.05, WZ - 0.4], [XR, TOP + 0.01, WZ - 0.25], "tray"),
  // MORPHEUS on the soffit: a dark panel, the letters drawn lit on it
  block([SIGN[0], SIGN[1], WZ - 0.27], [SIGN[2], SIGN[3], WZ - 0.25], "signpanel"),
  // the door in the right end wall: its frame, the leaf with a kick plate and a push bar; the EXIT box hanging before it on two rods
  block([XR - 0.08, 0, DOOR[0] - 0.08], [XR, 2.15, DOOR[0]], "frame"), block([XR - 0.08, 0, DOOR[1]], [XR, 2.15, DOOR[1] + 0.08], "frame"),
  block([XR - 0.08, 2.07, DOOR[0] - 0.08], [XR, 2.15, DOOR[1] + 0.08], "frame"),
  block([XR - 0.03, 0, DOOR[0]], [XR - 0.01, 2.07, DOOR[1]], "door"),               // the leaf, its wired glass lit from the stairs
  block([XR - 0.12, 0.95, DOOR[0] + 0.15], [XR - 0.03, 1.0, DOOR[1] - 0.15], "frame"),  // its push bar
  block([EXIT[0], EXIT[2], EXIT[4]], [EXIT[1], EXIT[3], EXIT[4] + 0.08], "sign"),
  ...[EXIT[0] + 0.1, EXIT[1] - 0.1].map((x) => block([x - 0.01, EXIT[3], EXIT[4] + 0.03], [x + 0.01, CEIL, EXIT[4] + 0.05], "pipe")),
  // the far end: the vending machine against the end wall, a shoe rack along the back wall beside it
  block([XL, 0, WZ - 1.6], [XL + 0.75, 1.85, WZ - 0.65], "vend"),
  block([XL + 0.1, 0, WZ - 0.4], [X0 - 0.15, 0.9, WZ], "rack"),
  // a laundry cart left in the corridor, near the camera on the left, and a bin at the right
  block([1.6, 0.15, 1.0], [2.6, 0.95, 1.6], "cart"),
  ...[[1.7, 1.1], [2.5, 1.1], [1.7, 1.5], [2.5, 1.5]].map(([x, z]) => cyl(x, z, 0.04, 0, 0.15, "ladder")),
  cyl(XR - 0.35, 0.75, 0.2, 0, 0.6, "bin"),
  // a mop bucket and its folding sign left in the middle, near the camera, off his way
  cyl(6.2, 1.35, 0.2, 0, 0.32, "bucket"), cyl(6.25, 1.3, 0.02, 0.3, 1.15, "pipe"),
  block([7.0, 0, 1.15], [7.45, 0.62, 1.2], "wetsign"),
]
// slippers before the lit lower capsules (their sleepers are in)
for (const n of [26, 27, 30]) { const x = cx0(n) + 0.5; PRIMS.push(block([x, 0, WZ - 0.5], [x + 0.11, 0.05, WZ - 0.24], "slipper"), block([x + 0.16, 0, WZ - 0.52], [x + 0.27, 0.05, WZ - 0.26], "slipper")) }
// each capsule's face: posts left and right, the sill, the band over the opening (the number left, the screen right), set 0.2 m
// before the curtain, so the opening is a real recess; the screen a little proud of the band
for (let n = 17; n <= 32; n++) {
  const x = cx0(n), y = cy0(n), z0 = WZ - 0.2, o = { n }
  PRIMS.push(
    block([x, y, z0], [x + HATCH.l, y + CH, WZ], "face", o), block([x + CW - HATCH.r, y, z0], [x + CW, y + CH, WZ], "face", o),
    block([x + HATCH.l, y, z0], [x + CW - HATCH.r, y + HATCH.b, WZ], "face", o),
    block([x + HATCH.l, y + HATCH.t, z0], [x + CW - HATCH.r, y + CH, WZ], "band", o),
    block([x + CW - 0.5, y + HATCH.t + 0.09, z0 - 0.03], [x + CW - 0.16, y + CH - 0.07, z0], "screen", o),
    block([x + HATCH.l, y + HATCH.b, WZ - 0.03], [x + CW - HATCH.r, y + HATCH.t, WZ - 0.01], "curtain", o),
  )
}
// the ladder to each upper capsule, at its right post
for (let i = 0; i < 8; i++) PRIMS.push(block([X0 + (i + 1) * CW - 0.07, BASE, WZ - 0.3], [X0 + (i + 1) * CW + 0.01, TOP - 0.05, WZ - 0.24], "ladder"))

const LIGHTS = [
  // the panels, a point each
  ...PANELS.map(([x, z]) => ({ p: [x, CEIL - 0.15, z], I: 0.42, R: 2.6, shadow: true })),
  { p: [(SIGN[0] + SIGN[2]) / 2, TOP + 0.2, WZ - 0.8], I: 0.25, R: 2.0 },  // MORPHEUS's glow on the soffit's foot
  { p: [(EXIT[0] + EXIT[1]) / 2, 2.3, EXIT[4] - 0.2], I: 0.4, R: 1.8 },    // the EXIT sign
  { p: [XL + 1.2, 1.1, WZ - 1.1], I: 0.5, R: 1.8 },                       // the vending machine's front
  // the lit capsules spill a little light onto their sills and the lino
  ...[...LIT].map((n) => ({ p: [cx0(n) + CW / 2, cy0(n) + 0.4, WZ - 0.35], I: 0.3, R: 1.1 })),
]
const MATS = {
  wall: { a: 0.22, e: 0 }, endwall: { a: 0.24, e: 0 }, ceil: (P) => ({ a: ((P[0] / 0.6) % 1 + 1) % 1 < 0.06 || ((P[2] / 0.6) % 1 + 1) % 1 < 0.06 ? 0.14 : 0.3, e: 0 }), plinth: (P) => ({ a: (((P[0] - X0) / (CW / 2)) % 1 + 1) % 1 < 0.04 || P[1] > BASE - 0.05 ? 0.1 : Math.abs(P[1] - BASE / 2) < 0.03 ? 0.36 : 0.2, e: 0 }), soffit: { a: 0.2, e: 0 },
  pipe: { a: 0.45, e: 0 }, bucket: { a: 0.5, e: 0 }, wetsign: (P) => ({ a: Math.abs(P[1] - 0.4) < 0.08 ? 0.15 : 0.55, e: 0 }), tray: { a: 0.42, e: 0 }, signpanel: { a: 0.06, e: 0.04 }, bin: { a: 0.3, e: 0 },
  cart: (P, n) => ({ a: n[1] > 0 ? 0.55 : 0.3, e: 0 }), slipper: { a: 0.55, e: 0 },
  // the lino: big tiles, a faint seam, matt (no mirror: it would ghost the capsules)
  floor: (P) => { const s = ((P[0] / 0.6) % 1 + 1) % 1 < 0.05 || ((P[2] / 0.6) % 1 + 1) % 1 < 0.05; return { a: s ? 0.15 : 0.23, e: 0 } },
  panel: (P) => ({ a: 0.3, e: ((P[0] / 0.6) % 1 + 1) % 1 < 0.08 ? 0.5 : 1.0 }),
  face: { a: 0.32, e: 0 }, band: { a: 0.07, e: 0 },
  screen: (P, n, f, hit) => ({ a: 0.1, e: hit.prim.n === 23 ? 0.75 : LIT.has(hit.prim.n) ? 0.38 : 0.16 }),
  // the opening's rounded corners are the face's; a lit capsule's curtain glows, in folds
  curtain: (P, n, f, hit) => {
    const k = hit.prim.n, x = P[0] - cx0(k), y = P[1] - cy0(k), R = 0.16
    const qx = Math.max(0, Math.max(HATCH.l + R - x, x - (CW - HATCH.r - R))), qy = Math.max(0, Math.max(HATCH.b + R - y, y - (HATCH.t - R)))
    if (Math.hypot(qx, qy) > R) return { a: 0.32, e: 0 }
    return LIT.has(k) ? { a: 0.3, e: ((x * 8) % 1) < 0.5 ? 0.6 : 0.42 } : { a: 0.04, e: 0 }
  },
  ladder: { a: 0.45, e: 0 },
  frame: { a: 0.45, e: 0 }, door: (P) => (P[1] > 1.2 && P[1] < 1.85 && P[2] > DOOR[0] + 0.3 && P[2] < DOOR[1] - 0.3 ? { a: 0.2, e: 0.55 } : P[1] < 0.3 ? { a: 0.45, e: 0 } : { a: 0.3, e: 0 }), sign: (P, n) => ({ a: 0.08, e: n[2] < 0 ? 0.14 : 0 }),
  vend: (P, n) => (n[0] > 0 && P[1] > 0.7 && P[1] < 1.7 ? { a: 0.2, e: 0.6 } : { a: 0.3, e: 0 }),
  rack: (P, n) => ({ a: n[1] > 0 || ((P[1] / 0.3) % 1) < 0.25 ? 0.4 : 0.15, e: 0 }),
}
const WORLD = feedWorld({ prims: PRIMS, lights: LIGHTS, materials: MATS, ambient: 0.2, sky: 0.02, rain: 0 })
const BAKE = () => bakeFeed(CAM, WORLD, { exposure: 1.55, key: "cam15b" })

// ================================================================ what the game would need, measured (printed when built)
// He comes in at the door and stands before 23, in front of 31's screen, beside 23's ladder: so 31's and 32's numbers stay free
const STAND = { door: [XR - 0.3, 0, (DOOR[0] + DOOR[1]) / 2], spot: [cx0(23) + CW / 2 + 0.33, 0, WZ - 0.45] }
const face = (n) => boxCorners([cx0(n), cy0(n), WZ - 0.2], [cx0(n) + CW, cy0(n) + CH, WZ - 0.2]).slice(0, 4)
const layout = {
  door: spotAt(CAM, STAND.door), spot: spotAt(CAM, STAND.spot), kesslerPx: Math.round(personPx(CAM, STAND.spot)),
  c23: hullOf(CAM, face(23)), capsules: hullOf(CAM, boxCorners([X0, BASE, WZ - 0.2], [XE, TOP, WZ - 0.2]).slice(0, 4)),
  mic: spotAt(CAM, [STAND.spot[0], 1.2, STAND.spot[2]]),
  doorRect: rectOf(CAM, [[XR, 0, DOOR[0]], [XR, 0, DOOR[1]], [XR, 2.15, DOOR[0]], [XR, 2.15, DOOR[1]]]),
  c23Rect: rectOf(CAM, face(23)),
}
console.log("CAM15_B " + JSON.stringify(layout))

// ---------------------------------------------------------------- hand drawing on top
// each capsule's number on the band over its opening, left of the screen; 23's a step brighter
const numbers = (c) => {
  for (let n = 17; n <= 32; n++) {
    const [x, y] = at(CAM, [cx0(n) + NUMX, cy0(n) + (HATCH.t + CH) / 2, WZ - 0.2])
    TXT.draw(c, x, y - 2, String(n), n === 23 ? "9" : "8", { font: "hud", align: "center" })
  }
  // EXIT, lit on its dark box
  const [sx, sy] = at(CAM, [(EXIT[0] + EXIT[1]) / 2, (EXIT[2] + EXIT[3]) / 2, EXIT[4]])
  TXT.draw(c, sx, sy - 2, "EXIT", "9", { font: "hud", align: "center" })
  // MORPHEUS, each letter where its place on the panel lands
  const T = "MORPHEUS"
  ;[...T].forEach((ch, i) => { const [x, y] = at(CAM, [SIGN[0] + (SIGN[2] - SIGN[0]) * (i + 0.5) / T.length, (SIGN[1] + SIGN[3]) / 2, WZ - 0.27]); TXT.draw(c, x, y - 2, ch, "9", { font: "hud", align: "center" }) })
}
// Kessler as a stand-in (review only), where he stands at 23
const kessler = (c) => { const [x, y] = spotAt(CAM, STAND.spot); standIn(c, x, y, Math.round(personPx(CAM, STAND.spot))) }

// ---------------------------------------------------------------- the sheets
// the display's zones (screens.js): the place's text top left, the buttons top right, the cameras' strip, the corner icons
const OSD = [[0, 0, 108, 36], [168, 10, 152, 16], [2, 40, 76, 106], [268, 156, 52, 24]]
const osd = (c) => {
  for (const [x, y, w, h] of OSD) for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
    const edge = i === 0 || j === 0 || i === w - 1 || j === h - 1
    if (edge ? (i + j) % 2 === 0 : (i + j) % 4 === 0) c.px(x + i, y + j, edge ? "9" : "0")
  }
}
const label = (s) => (c) => { c.rect(W - 6 - s.length * 4 - 4, H - 12, s.length * 4 + 6, 9, "0"); TXT.draw(c, W - 6, H - 10, s, "9", { font: "hud", align: "right" }) }
scene("cam15_blocks_b", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), numbers, (c) => reviewFx(c, W, H), kessler, label("B"))
scene("cam15_blocks_b_osd", { w: W, h: H, bg: "0" }, (c) => paintFeed(c, BAKE()), numbers, (c) => reviewFx(c, W, H), kessler, osd, label("B MIT OSD"))
