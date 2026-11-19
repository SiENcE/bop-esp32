// The kit pieces shop24 needs (art/rooms/shop24.map.js), made by tools/new-room.mjs. PAINTED (2026-11-19) on the lines of the blocks the
// user approved (2026-11-18): every piece keeps its size and place, the paint adds what has a cause. A chain's 24-hour shop on Fischermann
// Street at night: cold tubes, white panels gone grey at kicking height, the floor tracked wet from the door, the drink fridges' cyan,
// shelves stocked by someone who stopped caring, and nobody behind the counter; through the glass the street, Lerche's door across it.
// Registered with ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the bake; keys of the world palette
// (art/lib/iso.js) and the few below. A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    s  pale vinyl tiles, 50 cm, a joint between them; the mat inside the door, the wet tracked in from it to the counter and
//            down the aisles, the scuffs where the baskets turn, a dropped receipt, the robot's clean arcs by its dock
//   walls    sh_wall  white panels, their seams, a steel skirting, the grey of trolleys and shoes low down
//   openings sh_window (the glass front: the street's night behind it, seen whole through every pane: the wet road, the shop's own
//            light on the sidewalk, Lerche across it with its warm windows and the lit canopy over its door, a lantern on its cable;
//            rain on the glass, the tubes' glare; op.sign: a neon 24H in the window seen from behind, mirrored; op.door: a glass door
//            in its steel frame, its pull bar, PULL; op.sticker: the camera warning stuck on the glass), sh_fridges (drink fridges in
//            a row: glass doors in steel frames, their handles, shelves of cans and bottles in their cold light, a price strip, frost
//            at the foot, one shelf sold out), sh_header (COLD DRINKS lit over them), sh_poster (Lull's poster: SLEEP IS FREE)
//   props    sh_counter (the counter: a laminate top, the register with its display to the cashier's side, the card reader, a rack of
//            sweets, Lull's leaflets; under it on the cashier's side the bags and a bin), sh_shelf (a gondola: its kick plate, five
//            boards with price strips, packs of water, noodle cups, boxes, bags; gaps where it sold out; its end a hook rack); for
//            the side thread (design §6.5): sh_cam (CAM 26's dome on its arm over the register, its red light), sh_dock (the cleaning
//            robot's dock in the corner by the fridges, its plate with chevrons, its cyan light, the cable to the socket), sh_bin (a wire
//            bin of cheap tins in the corner with a card on a stick: after the robbery Okonkwo's, his old price under the new)
// Keys "!k" are never lit.
include("../lib/text.js")
pal({ "+": "#2f7a52", "&": "#5aa878" })                                                   // the goods' greens (packaging, a bottle)

const KIT_SHOP24 = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash
  const lit = (k) => (k ? "!" + k : null)

  // ---------------------------------------------------------------- the floor
  // the wet tracked in from the door (north wall, u 2.1 to 2.9): footprints to the counter and down the aisle, drying as they go
  const STEPS = []
  for (let i = 0; i < 9; i++) { const t = i / 8, side = i % 2 ? 0.07 : -0.07; STEPS.push([2.45 + t * 0.95 + side, 0.6 + t * 0.8 - side * 0.5, i]) }
  for (let i = 0; i < 8; i++) { const t = i / 7, side = i % 2 ? 0.07 : -0.07; STEPS.push([2.35 - t * 0.2 + side, 0.65 + t * 1.6, i + 1]) }
  ISOKIT.floor("s", (u, v) => {
    // the mat inside the door: ribbed rubber, wet and dark in the middle
    if (u > 2.05 && u < 2.95 && v < 0.5) return u < 2.1 || u > 2.9 || v > 0.45 ? "3" : fl(v * 40) % 2 ? "2" : near(u, 2.5, 0.25) ? "2" : "3"
    // a puddle from the umbrellas by the door
    if (Math.hypot((u - 1.95) * 1.4, v - 0.62) < 0.13) return Math.hypot((u - 1.95) * 1.4, v - 0.62) > 0.11 ? "4" : "5"
    for (const [su, sv, i] of STEPS) if (Math.hypot((u - su) * 1.6, v - sv) < 0.055) return i < 4 ? "4" : i < 7 ? "5" : null ?? "5"
    // the dock's clean arcs: the robot sets out and comes back the same way
    const ar = Math.hypot(u - 0.3, v - 0.3)
    if (ar > 0.7 && ar < 0.74 && u > 0.35 && v > 0.35) return "H"
    // a dropped receipt, a price sticker
    if (u > 3.0 && u < 3.12 && v > 2.4 && v < 2.47) return "H"
    if (Math.hypot(u - 1.6, v - 2.35) < 0.025) return "Q"
    // the scuffs where the baskets turn at the aisles' ends
    if ((Math.abs(u - 3.25) < 0.15 && v > 1.9 && v < 2.9 && ih(fl(u * 30), fl(v * 30)) < 0.12)) return "5"
    if (near(u * 2, Math.round(u * 2), 1 / 24) || near(v * 2, Math.round(v * 2), 1 / 24)) return "5"
    return ih(fl(u * 2), fl(v * 2)) < 0.12 ? "h" : "6"                                  // a few tiles laid new, whiter
  })

  // ---------------------------------------------------------------- the walls
  ISOKIT.wall("sh_wall", (s, h) => {
    if (h < 0.08) return h >= 0.055 ? "5" : "3"                                          // the steel skirting
    if (near(s, Math.round(s / 1.2) * 1.2, 0.01)) return "6"                             // the panels' seams
    if (h < 0.4 && ih(fl(s * 14), fl(h * 20)) < 0.08) return "6"                         // trolleys and shoes
    return "G"
  })

  // ---------------------------------------------------------------- the glass front: the street seen through it
  /** the street at a point of the glass: U meters along the front from its west end, h up */
  const street = (U, h, a, e) => {
    // the 24H's glare and the tubes reflected: a pale band slanting over the panes
    const glare = (U * 30 - h * 22) % 60
    if (glare > 0 && glare < 3) return "3"
    // rain on the glass: a few drops, a run
    if (ih(fl(U * 40), fl(h * 30)) < 0.025) return "h"
    if (ih(fl(U * 60), 7) < 0.03 && ((h * 30) % 9) < 4) return "5"
    // Lerche across the street (its ground floor from 1.05 m up in the glass): the wall, its warm windows, the canopy over its door
    if (h > 1.05) {
      if (U > 1.9 && U < 3.3 && h > 1.85 && h < 1.97) return U > 2.2 && U < 3.0 && ((U * 30) % 3 < 1.6) ? "R" : "Q"     // LERCHE BLOCK, too far to read
      if (U > 2.25 && U < 2.95 && h < 1.8) return near(U, 2.6, 0.012) ? "1" : h < 1.4 && ISO.bay(fl(U * 32), fl(h * 30)) < (1.4 - h) * 1.5 ? "a" : "2"   // the door under it, its light falling down it
      for (const wx of [0.6, 4.1]) if (Math.abs(U - wx) < 0.14 && h > 1.5 && h < 1.8) return near(U, wx, 0.012) || near(h, 1.65, 0.012) ? "1" : "O"   // windows, curtains drawn
      if (Math.abs(U - 1.25) < 0.04 && h > 1.6) return "3"                              // a drainpipe
      if (h > 2.0 && Math.abs(U - 3.7) < 0.06 && h < 2.15) return "Q"                    // a lantern on its cable
      return h > 2.12 && near(h, 2.13 + (U - 3.7) * 0.05, 0.008) ? "2" : "1"
    }
    // the street: the far sidewalk, the road with the lights in it as streaks, the shop's own light on the near sidewalk
    if (h > 0.95) return "2"
    if (h > 0.6) {
      if (Math.abs(U - 2.6) < 0.25 && (fl(U * 40) % 3 === 0)) return "O"                // Lerche's door light in the wet
      if (Math.abs(U - 3.7) < 0.05) return "P"                                          // the lantern in the wet
      if (Math.abs(U - 0.9) < 0.2 && (fl(U * 40) % 4 === 0)) return "n"                 // the noodle bar's magenta, down the street
      return h > 0.78 ? "e" : "f"
    }
    return h > 0.53 ? "4" : "3"                                                          // the near sidewalk in the shop's light
  }
  ISOKIT.opening("sh_window", {
    pad: [0.05, 0, 0.05, 0.05],
    pass: () => true,
    paint(s, h, o) {
      const { a, e, aw, ah } = o, op = o.op ?? {}
      if (a < 0 || a >= aw || e >= ah) return a < -1 || a > aw || e > ah ? null : "5"   // the steel frame
      if (e < 0) return "5"
      const U = (op.from ?? 0) + s
      if (op.door) {
        if (a < 2 || a >= aw - 2 || e > ah - 3 || e < 3) return a === 0 || a === aw - 1 ? "4" : "5"   // its frame
        if (a > aw - 7 && a < aw - 4 && e > 22 && e < 38) return e === 23 || e === 37 ? "4" : "6"     // the pull bar
        if (e > 41 && e < 49) {                                                             // PULL at eye height
          o.memo.pull ??= ISOKIT.raster(aw, 8, (c) => { c.rect(fl(aw / 2) - 9, 0, 18, 7, "H"); TXT.draw(c, fl(aw / 2), 1, "PULL", "3", { font: "hud", align: "center" }) }, 0, 42)
          const k = o.memo.pull(a, e); if (k) return k
        }
      }
      // the neon 24H in the window, seen from behind: mirrored, its tubes lit, their backs dark
      if (op.sign) {
        o.memo.sign ??= ISOKIT.raster(aw, ah, (c) => {
          const R = ISOKIT.raster(40, 9, (q) => { TXT.draw(q, 1, 1, "24H", "M", { font: "nagiwa", outline: "n" }); TXT.draw(q, 1, 1, "24H", "", { font: "nagiwa" }) })
          const w = TXT.measure("24H", "nagiwa") + 2, x0 = fl(aw / 2 - w / 2)
          for (let y = 0; y < 9; y++) for (let x = 0; x < w; x++) { const k = R(w - 1 - x, 8 - y); if (k) c.px(x0 + x, 4 + y, k === "M" ? ((x + y) % 4 ? "m" : "N") : "n") }
          c.hline(x0 - 1, 3, w + 2, "4"); c.px(x0 + 2, 2, "3"); c.px(x0 + w - 3, 2, "3")       // the chains it hangs on
        }, 0, 0)
        const k = o.memo.sign(a, e); if (k) return lit(k)
      }
      // the camera warning on the glass, facing in
      if (op.sticker && a > aw - 22 && a < aw - 4 && e > 30 && e < 40) {
        o.memo.sticker ??= ISOKIT.raster(18, 10, (c) => { c.rect(0, 0, 18, 10, "H"); c.rect(1, 1, 16, 8, "Q"); c.rect(2, 3, 5, 4, "3"); c.px(7, 4, "3"); c.px(4, 4, "q"); TXT.draw(c, 9, 2, "24", "3", { font: "hud" }); c.hline(9, 8, 7, "P") }, aw - 22, 30)
        const k = o.memo.sticker(a, e); if (k) return k
      }
      return lit(street(U, h, a, e))
    },
  })

  // ---------------------------------------------------------------- the fridges, their header, the poster
  const GOODS = [["!q", "!Q", "!R"], ["!v", "!V", "!C"], ["!M", "!m", "!N"], ["!+", "!&", "!h"], ["!P", "!Q", "!W"]]
  ISOKIT.opening("sh_fridges", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e >= ah) return null
      const door = a % 24
      if (e < 4) return e === 3 ? "4" : "2"                                              // the kick plate, its vent
      if (e > ah - 4) return e === ah - 1 ? "5" : "4"                                    // the top frame
      if (door < 1) return "5"
      if (door === 1) return "4"
      if (door === 20 && e > 14 && e < 40) return e === 15 || e === 39 ? "4" : "6"       // the handle
      if (e < 7 && ih(a, e) < 0.6) return "!V"                                          // frost at the foot of the glass
      const shelf = (e - 4) % 11, row = fl((e - 4) / 11), d = fl(a / 24)
      if (shelf === 0) return "!C"                                                       // the shelf's edge in the light
      if (shelf === 1) return a % 6 === 0 ? "!c" : "!H"                                  // its price strip
      if (row === 2 && d === 1) return shelf < 3 ? "!c" : "!t"                           // sold out
      // cans and bottles: a can 3 px with its lid, a bottle 2 px with its cap, by the row
      const kind = (row + d) % 3, P = GOODS[(row * 2 + d) % GOODS.length]
      if (kind === 0) { const c = a % 4; if (c === 3) return "!c"; return shelf === 8 ? "!6" : shelf > 6 ? P[1] : c === 1 ? P[2] : P[0] }      // cans
      if (kind === 1) { const c = a % 3; if (c === 2) return "!c"; if (shelf > 8) return shelf === 10 ? "!c" : P[2]; return shelf > 6 ? "!C" : P[c === 0 ? 0 : 1] }   // bottles, their necks
      const c = a % 6; if (c === 5) return "!c"; return shelf > 7 ? "!c" : shelf > 5 ? P[2] : P[c < 2 ? 0 : 1]       // cartons
    },
  })
  ISOKIT.opening("sh_header", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      o.memo.head ??= ISOKIT.raster(aw, ah, (c) => {
        c.rect(0, 0, aw, ah, "c"); c.rect(0, 0, aw, 1, "4"); c.rect(0, ah - 1, aw, 1, "4")
        TXT.draw(c, fl(aw / 2), fl(ah / 2) - 2, "COLD DRINKS", "V", { font: "hud", align: "center", outline: "C" })
      }, 0, 0)
      return lit(o.memo.head(a, e))
    },
  })
  ISOKIT.opening("sh_poster", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      o.memo.poster ??= ISOKIT.raster(aw, ah, (c) => {
        c.rect(0, 0, aw, ah, "c"); c.rect(1, 1, aw - 2, ah - 2, "t")
        const cx = fl(aw / 2); c.ellipse(cx, 7, 4, 5, "C"); c.ellipse(cx, 7, 3, 4, "V"); c.vline(cx - 1, 4, 7, "W")   // the patch
        TXT.draw(c, cx, 14, "LULL", "V", { font: "hud", align: "center" }); TXT.draw(c, cx, 20, "FREE", "v", { font: "hud", align: "center" })
        c.px(aw - 2, ah - 1, "G"); c.px(aw - 1, ah - 2, "G"); c.px(aw - 1, ah - 1, "G")                                  // a corner come loose
      }, 0, 0)
      return o.memo.poster(a, e)
    },
  })

  // ---------------------------------------------------------------- the counter
  ISOKIT.prop("sh_counter", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      // it runs from the glass front into the shop: the customer on its west side, the cashier's place east of it, open under the top there
      pen.box(u, v, 0, du, dv, H,
        (lu, lv) => (lu < 0.03 || lv > dv - 0.03 ? "6" : ih(fl(lu * 30), fl(lv * 30)) < 0.04 ? "G" : "H"),
        (a, e, o) => {                                                                   // the cashier's side: open shelves under the top
          if (e > o.ah - 4) return e === o.ah - 1 ? "6" : "5"
          if (e < 3 || a < 2 || a > o.aw - 3 || (a % 14) < 1) return "4"
          if (e < 14 && a % 14 > 2 && a % 14 < 11) return a % 14 === 3 ? "G" : "H"        // folded bags
          if (e > 16 && e < 22 && a > o.aw / 2) return "3"                                 // a bin's rim
          return "1"
        },
        (a, e, o) => (e > o.ah - 4 ? (e === o.ah - 1 ? "6" : "5") : e < 3 ? "3" : a > 4 && a < 12 && e > 10 && e < 18 ? (e === 11 || a === 5 ? "Q" : "H") : "5"))   // the end, a CHITS ONLY card
      // the register, its display to the cashier; the card reader; the rack of sweets at the customer's end; Lull's leaflets
      pen.box(u + 0.12, v + 0.2, H, 0.35, 0.4, 0.2, (lu, lv) => (lv < 0.08 ? "3" : "4"), (a, e, o) => (e > 2 && a > 2 && a < o.aw - 3 ? (e === 4 ? "!V" : "!v") : "3"), () => "3")
      pen.box(u + 0.1, v + 0.7, H, 0.14, 0.1, 0.08, () => "3", () => "2", (a, e) => (a === 1 && e === 1 ? "!v" : "2"))
      pen.box(u + 0.15, v + dv - 0.5, H, 0.3, 0.35, 0.3, (lu, lv) => ["Q", "M", "C", "P"][fl(lv * 12) % 4],
        (a, e) => (e % 4 === 0 ? "4" : ["Q", "M", "+"][fl(a / 3) % 3]), (a, e) => (e % 4 === 0 ? "4" : ["P", "m", "C", "&"][fl(a / 3) % 4]))
      pen.box(u + 0.35, v + 1.0, H, 0.12, 0.08, 0.16, () => "H", () => "H", (a, e) => (e > 2 && e < 5 && a > 0 && a < 3 ? "C" : "H"))
    },
  })

  // ---------------------------------------------------------------- the shelves: two gondolas, full on both sides
  /** a row's goods on a shelf's face: a px from the left, k px up inside its row (0 at the board), row from the floor */
  const ITEMS = [
    // packs of water: shrink-wrapped, their labels
    (a, k) => { const c = a % 12; if (c === 11) return "2"; if (k > 8) return null; return k === 8 ? "H" : k > 2 && k < 6 ? (c % 4 === 0 ? "v" : "C") : "h" },
    // noodle cups: round, a lid band, stacked two high
    (a, k) => { const c = a % 5; if (c === 4) return "2"; if (k > 9) return null; return k === 4 || k === 9 ? "H" : (k === 3 || k === 8) ? ["Q", "M", "P"][fl(a / 5) % 3] : "h" },
    // boxes: rice, tea, biscuits; tall and short, a label each
    (a, k) => { const w = 7 + fl(ih(fl(a / 7), 3) * 2), c = a % 8; if (c === 7) return "2"; const tall = ih(fl(a / 8), 5) < 0.5 ? 9 : 6; if (k > tall) return null; const col = ["+", "Q", "M", "C", "P", "&"][fl(a / 8) % 6]; return k === tall ? "H" : k > 2 && k < 5 && c > 1 && c < 6 ? "H" : col },
    // bags of crisps: their crinkled tops, shiny
    (a, k) => { const c = a % 7; if (c === 6) return "2"; const top = 8 + (a % 2); if (k > top) return null; const col = ["m", "Q", "&", "v"][fl(a / 7) % 4]; return k === top ? "6" : k === 5 && c === 2 ? "H" : col },
    // cans of soup and fish, two high
    (a, k) => { const c = a % 4; if (c === 3) return "2"; if (k > 8) return null; return k === 4 || k === 8 ? "6" : ["P", "C", "H", "+"][fl(a / 4) % 4] },
  ]
  ISOKIT.prop("sh_shelf", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H,
        (lu, lv) => (lu < 0.03 || lu > du - 0.03 || lv < 0.03 || lv > dv - 0.03 ? "5" : near(lv, dv / 2, 0.02) ? "3" : "4"),
        (a, e, o) => {                                                                   // its end: a hook rack, batteries and chargers on it
          if (e < 3) return "2"
          if (a < 1 || a > o.aw - 2 || e > o.ah - 2) return "5"
          if (e % 9 === 0 && e > 6) return "4"
          if ((e % 9 > 1 && e % 9 < 7) && a % 4 > 0 && a % 4 < 3) return ["C", "H", "Q"][fl(e / 9) % 3]
          return "3"
        },
        (a, e, o) => {                                                                   // its long side: five boards of goods
          if (e < 3) return e === 2 ? "4" : "2"                                          // the kick plate
          if (e > o.ah - 2) return "5"
          const rh = 11, r = fl((e - 3) / rh), k = (e - 3) % rh
          if (k === 0) return "5"                                                        // the board
          if (k === 1) return a % 9 === 4 ? "3" : "H"                                    // the price strip
          if (k === rh - 1) return "2"                                                   // the shadow under the next board
          // gaps where it sold out
          const slot = fl(a / 13)
          if (ih(slot, r + 7) < 0.14) return k < 3 && a % 13 < 6 ? ["Q", "M"][slot % 2] : "1"
          const it = ITEMS[(r + (o.s > 0 ? 1 : 0)) % ITEMS.length](a, k - 1)
          return it ?? "1"
        })
    },
  })

  // ---------------------------------------------------------------- the side thread's things
  ISOKIT.prop("sh_cam", {
    footprint: () => [], solid: () => [],
    draw(pen, p) {
      const [u, v] = p.at, H = p.h
      pen.box(u, v, H + 0.05, 0.04, 0.2, 0.04, () => "4", () => "3", () => "4")                    // the arm out of the wall
      pen.box(u - 0.06, v + 0.16, H - 0.06, 0.14, 0.14, 0.12, () => "5", (a, e) => (e < 2 ? "1" : "4"), (a, e) => (a === 2 && e === 2 ? "!q" : e < 2 ? "1" : "3"))   // the dome, its dark glass, its red light
    },
  })
  ISOKIT.prop("sh_dock", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      // the plate: yellow-free chevrons (grey and white, not Juno's), worn where it runs on
      pen.box(u, v, 0, du, dv, 0.02, (lu, lv) => (lu < 0.02 || lv < 0.02 || lu > du - 0.02 || lv > dv - 0.02 ? "4" : (fl((lu + lv) * 14) % 2 ? "5" : "H")), () => "3", () => "3")
      // the dock in the corner, its light to the plate (turned, the user's wish), the cable to the socket
      pen.box(u, v, 0, 0.12, dv, 0.3, (lu, lv) => (lv < 0.04 ? "5" : "4"), (a, e) => (e > 6 && e < 9 && a > 2 && a < 6 ? "!v" : e === 1 ? "2" : "3"), (a, e) => (e > 10 ? "5" : "2"))
      pen.box(u, v + dv + 0.02, 0.15, 0.02, 0.02, 0.15, () => "1", () => "1", () => "1")
    },
  })
  ISOKIT.prop("sh_bin", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      // wire round the tins: the lids on top, their labels through the mesh
      pen.box(u, v, 0, du, dv, H,
        (lu, lv) => { const cu = (lu * 14) % 1, cv = (lv * 14) % 1, d = Math.hypot(cu - 0.5, cv - 0.5); return d < 0.32 ? (d < 0.12 ? "G" : "6") : d < 0.45 ? "4" : "2" },
        (a, e) => (a % 4 === 0 || e % 4 === 0 ? "5" : ["P", "H", "+"][fl(a / 4 + e / 4) % 3]), (a, e) => (a % 4 === 0 || e % 4 === 0 ? "5" : ["H", "P", "C"][fl(a / 4 + e / 4) % 3]))
      pen.box(u + du / 2 - 0.02, v + dv / 2, H, 0.03, 0.03, 0.35, () => "4", () => "4", () => "4")    // the stick
      pen.box(u + du / 2 - 0.12, v + dv / 2, H + 0.3, 0.25, 0.02, 0.15, () => "H", () => "H", (a, e) => (e === 4 && a > 1 ? "q" : e === 1 && a > 2 ? "3" : "H"))   // the card: the new price, the old one under it
    },
  })

  return {}
})()
