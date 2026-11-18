// The kit pieces shop24 needs (art/rooms/shop24.map.js), made by tools/new-room.mjs. BLOCKS of the 24-hour shop on Fischermann Street
// (2026-11-18; painted later): plain shapes in a shop's cold white light. Registered with ISOKIT (art/lib/isokit.js has the calls), drawn in
// room meters, lit by the bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    s  pale tiles, 50 cm, a joint between them
//   walls    sh_wall  white panels, a dark skirting
//   openings sh_window (the glass front: the street's night behind it; op.sign: the 24H sign seen from behind, mirrored; op.door: a
//            glass door, its push bar), sh_fridges (drink fridges in a row along the wall, their cyan light, the cans)
//   props    sh_counter (the counter with the register), sh_shelf (a row of shelves, both sides full); for the side thread (design §6.5,
//            blocks 2026-11-18): sh_cam (CAM 26's dome on its arm over the register, its red light), sh_dock (the cleaning robot's
//            charging dock on the north wall in the corner by the fridges, its plate on the floor, a cyan light), sh_bin (a wire bin of cheap tins in the corner
//            with a card on a stick: after the robbery Okonkwo's, his old price under the new)
// Keys "!k" are never lit.

const KIT_SHOP24 = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor

  ISOKIT.floor("s", (u, v) => (near(u * 2, Math.round(u * 2), 1 / 24) || near(v * 2, Math.round(v * 2), 1 / 24) ? "5" : "6"))
  ISOKIT.wall("sh_wall", (s, h) => (h < 0.08 ? (h >= 0.055 ? "4" : "2") : "G"))

  ISOKIT.opening("sh_window", {
    pad: [0.05, 0, 0.05, 0.05],
    pass: () => true,
    paint(s, h, o) {
      const { a, e, aw, ah } = o, op = o.op ?? {}
      if (a < 0 || a >= aw || e >= ah) return a < -1 || a > aw || e > ah ? null : "4"
      if (op.door && e > 26 && e < 29) return "6"                                        // the push bar
      if (op.door && (a === fl(aw / 2))) return "4"
      // the 24H sign seen from behind (mirrored), its tubes lit
      if (op.sign && e > ah - 16 && e < ah - 6 && a > 8 && a < aw - 8) {
        const t = (aw - 1 - a) % 12
        return t < 2 || (t > 4 && t < 6) ? "!N" : "!n"
      }
      return (a + e) % 13 === 0 ? "!h" : e < 6 ? "!2" : "!1"                            // the street's night, a drop of rain
    },
  })
  ISOKIT.opening("sh_fridges", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e >= ah) return null
      const door = a % 24
      if (door < 1 || e < 4 || e > ah - 4) return "4"                                   // the frames, the kick plate, the top
      if (door === 20) return "6"                                                        // a handle
      const shelf = (e - 4) % 11
      if (shelf < 1) return "!C"
      if (shelf > 3 && (a * 3 + e) % 5 < 3) return ["!q", "!v", "!Q", "!m", "!V"][fl(a / 4 + e / 11) % 5]   // cans and bottles
      return "!c"
    },
  })

  ISOKIT.prop("sh_counter", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      // it runs from the glass front into the shop: the customer on its west side, the cashier's place east of it
      pen.box(u, v, 0, du, dv, H, () => "H", () => "5", () => "4")
      pen.box(u + 0.12, v + 0.2, H, 0.35, 0.4, 0.2, () => "4", (a, e, o) => (e > 2 && a > 2 && a < o.aw - 3 ? "!v" : "3"), () => "3")   // the register, its display to the cashier
      pen.box(u + 0.15, v + dv - 0.5, H, 0.3, 0.35, 0.3, () => "Q", () => "P", () => "Q")     // a rack of sweets at the customer's end
    },
  })
  ISOKIT.prop("sh_shelf", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H, () => "4", () => "3", (a, e, o) => {
        const row = e % 12
        if (row < 2) return "5"                                                          // the boards
        return ["q", "v", "Q", "m", "C", "y", "N"][fl(a / 3 + e / 12) % 7]               // the goods, every colour
      })
    },
  })

  ISOKIT.prop("sh_cam", {
    footprint: () => [], solid: () => [],
    draw(pen, p) {
      const [u, v] = p.at, H = p.h
      pen.box(u, v, H + 0.05, 0.04, 0.2, 0.04, () => "3", () => "2", () => "3")                    // the arm out of the wall
      pen.box(u - 0.06, v + 0.16, H - 0.06, 0.14, 0.14, 0.12, () => "5", () => "4", (a, e) => (a === 2 && e === 2 ? "!q" : "3"))   // the dome, its red light
    },
  })
  ISOKIT.prop("sh_dock", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, 0.02, (lu, lv) => ((Math.floor(lu * 10) + Math.floor(lv * 10)) % 2 ? "4" : "6"), () => "3", () => "3")   // the plate
      pen.box(u, v, 0, 0.12, dv, 0.3, () => "4", (a, e) => (e > 6 && e < 9 && a > 2 && a < 6 ? "!v" : "3"), () => "2")     // the dock in the corner, its light to the plate (turned, the user's wish)
    },
  })
  ISOKIT.prop("sh_bin", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H, (lu, lv) => ((Math.floor(lu * 14) + Math.floor(lv * 14)) % 3 ? "G" : "Q"), (a, e) => (a % 4 === 0 || e % 4 === 0 ? "5" : "2"), (a, e) => (a % 4 === 0 || e % 4 === 0 ? "5" : "2"))   // wire, the tins' lids
      pen.box(u + du / 2 - 0.02, v + dv / 2, H, 0.03, 0.03, 0.35, () => "4", () => "4", () => "4")    // the stick
      pen.box(u + du / 2 - 0.12, v + dv / 2, H + 0.3, 0.25, 0.02, 0.15, () => "H", () => "H", (a, e) => (e === 4 && a > 1 ? "q" : e === 1 && a > 2 ? "3" : "H"))   // the card: the new price, the old one under it
    },
  })

  return {}
})()
