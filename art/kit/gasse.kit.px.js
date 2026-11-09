// The kit pieces the alley needs (art/rooms/gasse.map.js): BLOCKS for now, to judge the alley's plan before anything is painted (read
// the style guide and the pxl skill before painting them). Registered with ISOKIT (art/lib/isokit.js), drawn in room meters, lit by the
// bake. The laundromat's green comes out of its window (the light family of art/kit/laundromat.kit.px.js, the same keys E F J L K).
//
//   floors   p  the alley's paving, w  puddles, g  a drain; n  the niche's floor (cardboard)
//   walls    gs_wall  bare concrete; gs_facade  SUDS & SPIN's front to 2.3 m, the building above; gs_niche_wall  inside the niche
//   openings gs_lm_door, gs_lm_window, gs_lm_sign (SUDS & SPIN), gs_vent, gs_flat_window, gs_ac; gs_niche (open);
//            gs_market (the stairs down, as the blocks the user approved: the ceiling sloping, the handrails dropping, the glow
//            from below), gs_market_sign (DRAIN MARKET, an arrow down)
//   props    gs_mattress, gs_pot (in the niche), gs_bins, gs_crates, gs_railing (the balcony's, over the water), gs_cables
include("../lib/text.js")

pal({ E: "#1b2b28", F: "#2a4239", J: "#4c6e5c", L: "#7aa48a", K: "#c4ecd0" })
ramps("EFJLK")

const KIT_GASSE = (() => {
  const fl = Math.floor, NF = 12
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  // the laundromat's light out into the alley (as inside: art/kit/laundromat.kit.px.js)
  ISOKIT.TINT.green = {
    e: ["e", "E"], f: ["E", "E"], z: ["E", "F"], Z: ["F", "F"], X: ["F", "J"],
    1: ["1", "E"], 2: ["E", "F"], 3: ["F", "F"], 4: ["F", "J"], 5: ["J", "J"], 6: ["J", "L"],
    g: ["g", "J"], G: ["J", "L"], h: ["L", "K"], H: ["K", "K"], O: ["O", "O"], a: ["a", "E"],
  }
  Object.assign(ISOKIT.SHADE, { E: "e", F: "E", J: "F", L: "J", K: "L" })

  // ---------------------------------------------------------------- floors
  ISOKIT.floor("p", (u, v) => (near(u % 0.5, 0, 1 / 40) || near(v % 0.5, 0, 1 / 40) ? "e" : (fl(u / 0.5) + fl(v / 0.5)) % 2 ? "f" : "z"))
  ISOKIT.floor("w", (u, v) => (near((u + v) % 0.3, 0, 0.02) ? "Z" : "e"))
  ISOKIT.floor("g", (u, v) => (near(u % 0.1, 0, 0.02) ? "4" : "e"))
  ISOKIT.floor("n", (u, v) => (near(u % 0.3, 0, 0.02) ? "a" : "O"))

  // ---------------------------------------------------------------- walls
  ISOKIT.wall("gs_wall", (s, h) => (h < 0.06 ? "e" : near(h % 1.0, 0, 1 / 40) ? "1" : "2"))
  ISOKIT.wall("gs_facade", (s, h) => (h < 0.06 ? "e" : h < 2.3 ? "3" : h < 2.34 ? "4" : near(h % 1.0, 0, 1 / 40) ? "1" : "2"))
  ISOKIT.wall("gs_niche_wall", () => "2")

  /** a picture for an opening, drawn once (W x H in the opening's own pixels, y down from its top) */
  const pic = (o, name, draw) => (o.memo[name] ??= ISOKIT.raster(o.aw, o.ah, (c) => draw(c, o.aw, o.ah), 0, 0))(o.a, o.e)

  // ---------------------------------------------------------------- SUDS & SPIN's front
  ISOKIT.opening("gs_lm_door", { paint(s, h, o) { return pic(o, "door", (c, W, H) => { c.rect(0, 0, W, H, "3"); c.rect(2, 2, W - 4, H - 2, "!J"); c.rect(W - 6, fl(H / 2), 2, 4, "4") }) } })
  ISOKIT.opening("gs_lm_window", {
    paint(s, h, o) {
      return pic(o, "window", (c, W, H) => {
        c.rect(0, 0, W, H, "!F")
        // the dryers inside along their wall, seen through the glass: a row of doors, the tube's light on their tops
        for (let x = 4; x < W - 6; x += 12) { c.rect(x, H - 22, 10, 18, "!J"); c.rect(x + 3, H - 16, 4, 6, "!E"); c.hline(x, H - 22, 10, "!L") }
        c.rect(0, 0, W, 2, "3"); c.rect(0, H - 2, W, 2, "3"); c.rect(0, 0, 2, H, "3"); c.rect(W - 2, 0, 2, H, "3")
        c.rect(fl(W / 3), 0, 2, H, "3"); c.rect(fl((2 * W) / 3), 0, 2, H, "3")
      })
    },
  })
  ISOKIT.opening("gs_lm_sign", {
    paint(s, h, o) {
      return pic(o, "sign", (c, W, H) => { c.rect(0, 0, W, H, "1"); c.rect(1, 1, W - 2, H - 2, "e"); TXT.draw(c, fl(W / 2), fl((H - 5) / 2), "SUDS & SPIN", "!K", { font: "hud", align: "center" }) })
    },
  })
  ISOKIT.opening("gs_vent", { paint(s, h, o) { return pic(o, "vent", (c, W, H) => { c.rect(0, 0, W, H, "5"); for (let y = 1; y < H - 1; y += 2) c.hline(1, y, W - 2, "2") }) } })
  ISOKIT.opening("gs_flat_window", {
    paint(s, h, o) { return pic(o, "flat", (c, W, H) => { c.rect(0, 0, W, H, "2"); c.rect(1, 1, W - 2, H - 2, "!Q"); c.rect(1, 1, fl(W / 3), H - 2, "!P") }) },
  })
  // the lamp over the laundromat's door: a steel shade, its bulb
  ISOKIT.opening("gs_lamp", { paint(s, h, o) { return pic(o, "lamp", (c, W, H) => { c.rect(0, 0, W, H - 2, "4"); c.hline(1, H - 2, W - 2, "!V"); c.hline(2, H - 1, W - 4, "!W") }) } })
  ISOKIT.opening("gs_ac", { paint(s, h, o) { return pic(o, "ac", (c, W, H) => { c.rect(0, 0, W, H, "5"); for (let x = 2; x < W - 2; x += 2) c.vline(x, 2, H - 4, "3") }) } })

  // ---------------------------------------------------------------- the left wall
  // the niche: its concrete edge round a way in (the recess itself is the map's open room)
  ISOKIT.opening("gs_niche", { paint(s, h, o) { const { a, e, aw, ah } = o; return a >= 0 && a < aw && e < ah ? null : "2" } })
  // the way down: as the approved blocks (art/mock/ch1_blocks.px.js had it flat): steps going down and away hide behind the sill, so
  // what shows is the stairwell's ceiling sloping down toward the back, the handrails dropping below the sill close to the side walls
  // (as the user drew them), and the market's glow coming up from beneath
  const RAIL = [[0, 0], [1, 1], [1, 2], [2, 3], [2, 4], [2, 5], [3, 6], [3, 7], [3, 8], [4, 9], [4, 10], [4, 11], [4, 12], [5, 13], [5, 14], [5, 15]]
  ISOKIT.opening("gs_market", {
    paint(s, h, o) {
      return pic(o, "market", (c, W, H) => {
        const sy = H / 54, sx = W / 64
        c.rect(0, 0, W, H, "k")
        for (let y = 0; y < fl(24 * sy); y++) { const i = fl((y / sy) * 0.9 * sx); c.hline(i, y, W - 2 * i, y < 12 * sy ? "2" : "3") }
        for (let y = fl(34 * sy); y < H - 1; y++) c.hline(fl(6 * sx), y, W - fl(12 * sx), y < 43 * sy ? "!i" : y < 51 * sy ? "!n" : "!M")
        const top = H - 17
        for (const [dx, dy] of RAIL) { c.px(2 + dx, top + dy, "6"); c.px(W - 3 - dx, top + dy, "6") }
        c.rect(2, top - 1, 1, 17, "5"); c.rect(W - 3, top - 1, 1, 17, "5")
        c.hline(0, H - 1, W, "5")
        for (let i = 0; i < 4; i++) c.hline(fl(W / 2) - 3 + i, fl(8 * sy) + i, 7 - 2 * i, "H")
      })
    },
  })
  // the passage to Kowalski Street: a dark way through the building, the street's cyan at its far end
  ISOKIT.opening("gs_passage", {
    paint(s, h, o) {
      return pic(o, "passage", (c, W, H) => {
        c.rect(0, 0, W, H, "k")
        const ix = fl(W * 0.3), iw = W - 2 * ix, iy = fl(H * 0.3)
        for (let y = 0; y < iy; y++) { const i = fl((y / iy) * ix); c.hline(i, y, W - 2 * i, "1") }   // the ceiling going back
        c.rect(ix, iy, iw, H - iy - 1, "!c"); c.rect(ix + 1, iy + 2, iw - 2, H - iy - 4, "!C"); c.hline(ix, H - 2, iw, "!v")
        c.rect(0, 0, 1, H, "3"); c.rect(W - 1, 0, 1, H, "3"); c.hline(0, H - 1, W, "2")
      })
    },
  })
  ISOKIT.opening("gs_market_sign", {
    paint(s, h, o) {
      return pic(o, "msign", (c, W, H) => { c.rect(0, 0, W, H, "2"); c.rect(1, 1, W - 2, H - 2, "n"); TXT.draw(c, fl(W / 2), fl((H - 5) / 2), "DRAIN MARKET", "!m", { font: "hud", align: "center" }) })
    },
  })

  // ---------------------------------------------------------------- props
  // the statue from before the flood: a woman on her plinth, one hand up as if to stop the water; someone has fixed a ring of cyan
  // light behind her head; candles and paper cranes at her foot
  ISOKIT.prop("gs_statue", {
    frames: NF,
    draw(pen, p, f) {
      const [u, v] = p.at, [du, dv] = p.foot, cu = u + du / 2, cv = v + dv / 2
      pen.box(u, v, 0, du, dv, 0.5, () => "3", () => "2", () => "2")
      pen.box(cu - 0.16, cv - 0.14, 0.5, 0.32, 0.28, 1.0, () => "4", () => "3", () => "4")           // the robe
      pen.box(cu - 0.11, cv - 0.1, 1.5, 0.22, 0.2, 0.32, () => "5", () => "4", () => "4")            // the shoulders
      pen.box(cu - 0.07, cv - 0.07, 1.82, 0.14, 0.14, 0.2, () => "5", () => "4", () => "5")          // the head
      pen.box(cu + 0.1, cv - 0.03, 1.6, 0.06, 0.06, 0.6, () => "5", () => "4", () => "4")            // the arm, raised
      const [hx, hy] = pen.P(cu - 0.05, cv - 0.05, 1.93)
      pen.at(cu - 0.1, cv - 0.1, 1.95, null)
      for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2; pen.px(Math.round(hx + Math.cos(t) * 6), Math.round(hy + Math.sin(t) * 5), (a + f) % 8 ? "!v" : "!V") }
      pen.at(null)
      // the candles and the cranes at her foot, on the floor in front of the plinth
      for (const [k, du2] of [[0, 0.12], [1, 0.3], [2, 0.5], [3, 0.62]]) {
        const [x, y] = pen.P(u + du2, v + dv + 0.06, 0)
        pen.at(u + du2, v + dv + 0.06, 0.1, "v")
        pen.px(x, y - 1, "H"); pen.px(x, y - 2, "H"); pen.px(x, y - 3, (k + f) % 4 ? "!Q" : "!R")
        pen.at(null)
      }
      const [cx, cy] = pen.P(u + 0.4, v + dv + 0.12, 0)
      pen.at(u + 0.4, v + dv + 0.12, 0.05, "v"); pen.grid(cx - 2, cy - 2, [".H..", "HHHH"]); pen.at(null)
    },
  })
  ISOKIT.prop("gs_mattress", { draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, (lu, lv) => (lv > dv * 0.45 ? "U" : "h"), () => "g", () => "g") } })
  ISOKIT.prop("gs_pot", { draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, () => "2", () => "5", () => "4") } })
  ISOKIT.prop("gs_bins", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      for (const k of [0, 0.5]) pen.box(u + k * du + 0.02, v, 0, du / 2 - 0.04, dv, H, () => "4", () => "3", () => "2")
    },
  })
  ISOKIT.prop("gs_crates", { draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, () => "P", () => "O", () => "a") } })
  // the balcony's railing: posts every half meter, a top rail and one under it
  ISOKIT.prop("gs_railing", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, alongV = dv > du, L = alongV ? dv : du
      const at = (s) => (alongV ? [u, v + s] : [u + s, v]), size = (a, b) => (alongV ? [a, b] : [b, a])
      for (let s = 0; s <= L + 0.01; s += L / Math.round(L / 0.5)) pen.box(...at(Math.min(s, L - 0.05)), 0, ...size(0.05, 0.05), H, () => "5", () => "4", () => "3")
      pen.box(u, v, H - 0.05, ...size(0.06, L), 0.05, () => "6", () => "5", () => "4")
      pen.box(u, v, 0.5, ...size(0.04, L), 0.03, () => "5", () => "4", () => "3")
    },
  })
  // the cable bundles: from the left wall across to the facade, sagging; a drop falling from the lowest one
  ISOKIT.prop("gs_cables", {
    outline: false, footprint: () => [], solid: () => [], frames: NF,
    draw(pen, p, f) {
      pen.at(3, 2, p.h, null)
      const RUNS = [[[0, 0.8, 3.6], [2.4, 0, 3.8]], [[0, 1.6, 3.3], [3.6, 0, 3.6]], [[0, 3.4, 3.4], [5.2, 0, 3.9]]]
      let low = null
      for (const [a, b] of RUNS) {
        const [x0, y0] = pen.P(...a), [x1, y1] = pen.P(...b), n = Math.max(2, Math.abs(x1 - x0))
        for (let i = 0; i <= n; i++) {
          const t = i / n, x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 10)
          pen.px(x, y, "k"); pen.px(x, y + 1, "1")
          if (!low || y > low[1]) low = [x, y]
        }
      }
      // the lamp somebody hung from the cables over the statue
      const SL = ISO_MAPS.gasse.lights.find((l) => l.id === "statue").at, [lx, ly] = pen.P(...SL)
      pen.vline(lx, ly - 14, 12, "k"); pen.grid(lx - 3, ly - 2, ["..kk..", ".k44k.", "k4444k", ".RWWR."])
      const dy = (f * 4) % 40
      if (dy < 36) pen.px(low[0], low[1] + 3 + dy, "6")
      pen.at(null)
    },
  })

  return {}
})()
