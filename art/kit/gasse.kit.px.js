// The kit pieces the alley needs (art/rooms/gasse.map.js), at the street scale (style guide §4: 16 units per meter of floor, 30 px
// per meter of height): registered with ISOKIT (art/lib/isokit.js), drawn in room meters, lit by the bake. Painted after the user
// approved the blocks (2026-11-09). A deck over the water at night, dark, a few bright lights (the user's wish): the market's magenta
// coming up the stairs, the street's cyan in the arch, the laundromat's green dimmed behind its glass (the light family of
// art/kit/laundromat.kit.px.js, the same keys E F J L K), the warm cone on the memorial, the cold one over the laundromat's door.
// Its small stories: the man who lives in the niche (his blanket, his stove, a photo taped up), the memorial's names and the candles
// somebody lights every evening, padlocks on the railing over the water, a tag on the wall, a bag holding a bin's lid open.
//
//   floors   p  old concrete slabs, wet: their joints, cracks, one sunk, moss along the walls' feet; w  puddles (the bake's sheen
//               mirrors the lights in them); g  a drain; n  the niche's cardboard; q  the arch's passage (the street's cyan)
//   walls    gs_wall  poured concrete in panels, the bolts' rust run down, the damp coming up from the water, a tag
//            gs_facade  SUDS & SPIN's front: enamel panels to 2.3 m, the building's concrete above, a downpipe
//            gs_niche_wall  inside the niche; gs_tunnel  the arch's passage
//   openings gs_lm_door, gs_lm_window (the dryers through the glass), gs_lm_sign (SUDS & SPIN in green neon, one letter
//            stuttering), gs_vent, gs_flat_window, gs_lamp, gs_niche (open, a tarp hung over its top), gs_market (the stairs down,
//            as the user approved them), gs_market_sign (DRAIN MARKET, an arrow down), gs_arch (stone round its top), gs_adscreen
//   props    gs_statue (the flood's memorial, bronze gone green), gs_mattress, gs_pot (in the niche), gs_bins, gs_crates,
//            gs_railing (the padlocks on it), gs_cables (the lamp hung over the memorial)
// Keys "!k" are never lit (the neon, the screens, the glass's insides, the candles).
include("../lib/text.js")

pal({ E: "#1b2b28", F: "#2a4239", J: "#4c6e5c", L: "#7aa48a", K: "#c4ecd0" })
ramps("EFJLK")

const KIT_GASSE = (() => {
  const fl = Math.floor, ih = ISO.ihash, NF = 12
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  // the laundromat's light out into the alley (as inside: art/kit/laundromat.kit.px.js)
  ISOKIT.TINT.green = {
    e: ["e", "E"], f: ["E", "E"], z: ["E", "F"], Z: ["F", "F"], X: ["F", "J"],
    1: ["1", "E"], 2: ["E", "F"], 3: ["F", "F"], 4: ["F", "J"], 5: ["J", "J"], 6: ["J", "L"],
    g: ["g", "J"], G: ["J", "L"], h: ["L", "K"], H: ["K", "K"], O: ["O", "O"], a: ["a", "E"],
    E: ["E", "F"], F: ["F", "J"], J: ["J", "L"], L: ["L", "K"],
  }
  Object.assign(ISOKIT.SHADE, { E: "e", F: "E", J: "F", L: "J", K: "L" })

  // ---------------------------------------------------------------- floors
  // old concrete slabs, 50 cm, wet: the joints, a crack across one now and then, one slab sunk (darker, water standing on it), moss in
  // the joints along the walls' feet where nobody walks
  ISOKIT.floor("p", (u, v) => {
    const T = 0.5, iu = fl(u / T), iv = fl(v / T), lu = u - iu * T, lv = v - iv * T
    const joint = lu < 0.02 || lv < 0.02
    if (joint) return (u < 0.35 || v < 0.3) && ih(fl(u * 20), fl(v * 20)) < 0.5 ? "E" : "e"
    if (ih(iu + 5, iv + 2) > 0.93 && near(lu - lv * 0.8, 0.08, 0.012)) return "e"            // a crack
    if (iu === 7 && iv === 9) return lu > 0.05 && lv > 0.05 ? "e" : "f"                         // a sunk slab, water on it
    return (iu + iv) % 2 ? "f" : ih(iu, iv) < 0.3 ? "Z" : "z"
  })
  // puddles: dark water, the bake's sheen puts the lights in them; rings where the rain falls in
  ISOKIT.floor("w", (u, v, o) => (fl((u * 7 + v * 11) * 3 + (o.f ?? 0)) % 37 === 0 ? "Z" : "e"))
  // the drain: a steel frame, bars across a dark pit
  ISOKIT.floor("g", (u, v) => { const lu = u % 0.5, lv = v % 0.5; return lu < 0.04 || lv < 0.04 || lu > 0.46 || lv > 0.46 ? "4" : near(lu % 0.08, 0, 0.012) ? "3" : "k" })
  // the niche's floor: flattened cardboard, its folds
  ISOKIT.floor("n", (u, v) => (near(u % 0.3, 0, 0.015) ? "a" : near(v % 0.45, 0, 0.015) ? "a" : "O"))

  // ---------------------------------------------------------------- walls
  // poured concrete in panels (1.2 m wide, a seam every meter up), the tie bolts and their rust run down, the damp coming up from the
  // water as a dark band, a tag sprayed by the niche
  ISOKIT.wall("gs_wall", (s, h) => {
    if (h < 0.06) return "e"
    const ps = s % 1.2, ph = h % 1.0
    if (near(ps, 0, 1 / 40) || near(ph, 0, 1 / 40)) return "1"
    if (near(ps, 0.3, 0.012) && near(ph, 0.5, 0.02)) return "4"                                     // a tie bolt
    if (near(ps, 0.3, 0.01) && ph < 0.5 && ph > 0.5 - 0.35 * ih(fl(s / 1.2), fl(h))) return "O"   // its rust, run down
    if (h < 0.45 + 0.08 * Math.sin(s * 5.3)) return h < 0.2 ? "1" : (fl(s * 40) + fl(h * 30)) % 3 ? "1" : "2"   // the damp
    // a tag: two letters in magenta, sprayed at arm's height
    if (s > 1.45 && s < 1.8 && h > 1.1 && h < 1.45) { const x = (s - 1.45) / 0.35, y = (h - 1.1) / 0.35; if (near(x, 0.15, 0.05) || near(y, 0.85, 0.06) && x < 0.45 || near(x - y * 0.4, 0.62, 0.05) || near(x + y * 0.4, 0.92, 0.05)) return "n" }
    return "2"
  })
  // SUDS & SPIN's front: enamel panels to 2.3 m (their seams, the bottom kicked and rusty), a steel ledge; the building's concrete
  // above; the downpipe at the right end, from the roof into the water
  ISOKIT.wall("gs_facade", (s, h) => {
    if (h < 0.06) return "e"
    if (s > 5.72 && s < 5.82) return near(s, 5.74, 0.012) ? "4" : near(h % 1.2, 0, 0.03) ? "4" : "3"   // the downpipe, its clamps
    if (h < 2.3) {
      if (near(s % 0.6, 0, 1 / 48)) return "2"
      if (h < 0.25) return ih(fl(s * 30), fl(h * 30)) < 0.25 ? "O" : "2"
      return near(h, 1.2, 0.012) ? "2" : "3"
    }
    if (h < 2.34) return "4"
    return near(h % 1.0, 0.34, 1 / 40) || near(s % 1.2, 0, 1 / 40) ? "1" : "2"
  })
  ISOKIT.wall("gs_niche_wall", (s, h) => (s > 0.3 && s < 0.45 && h > 0.7 && h < 0.9 ? (h > 0.86 || s < 0.32 ? "g" : "H") : h < 0.05 ? "e" : "1"))

  /** a picture for an opening, drawn once per frame (W x H in the opening's own pixels, y down from its top) */
  const pic = (o, name, draw) => (o.memo[name + (o.f ?? 0)] ??= ISOKIT.raster(o.aw, o.ah, (c) => draw(c, o.aw, o.ah, o.f ?? 0), 0, 0))(o.a, o.e)
  /** text twice the HUD font's size, so it survives the wall's slope */
  const big = (c, cx, text, k) => {
    const w = text.length * 4 + 2, T = ISOKIT.raster(w, 7, (r) => TXT.draw(r, fl(w / 2), 1, text, "#", { font: "hud", align: "center" })), x0 = cx - w
    for (let y = 0; y < 7; y++) for (let x = 0; x < w; x++) if (T(x, 6 - y)) c.rect(x0 + x * 2, y * 2 - 1, 2, 2, k)
    return x0
  }

  // ---------------------------------------------------------------- SUDS & SPIN's front
  // the glass door: its aluminium frame, the green inside, the push bar, a sticker OPEN 24H, a notice taped up
  ISOKIT.opening("gs_lm_door", {
    paint(s, h, o) {
      return pic(o, "door", (c, W, H) => {
        c.rect(0, 0, W, H, "4"); c.vline(0, 0, H, "5"); c.rect(2, 2, W - 4, H - 3, "!F")
        c.rect(3, 3, W - 6, fl(H * 0.45), "!J"); for (let i = 0; i < 6; i++) c.px(4 + i, 4 + i, "!L")      // the light inside, a glint
        c.rect(2, fl(H / 2), W - 4, 2, "5"); c.hline(2, fl(H / 2), W - 4, "6")                                // the push bar
        TXT.draw(c, fl(W / 2), fl(H * 0.62), "24H", "!K", { font: "hud", align: "center" })
        c.rect(4, fl(H * 0.75), 7, 9, "H"); c.hline(5, fl(H * 0.75) + 2, 5, "g"); c.hline(5, fl(H * 0.75) + 4, 4, "g")   // a notice
      })
    },
  })
  // the window: the dryers along the far wall inside, seen through the glass, their round doors, the tubes' light on their tops; the
  // mullions; WASH / DRY in the glass's old lettering; a long glint across
  ISOKIT.opening("gs_lm_window", {
    paint(s, h, o) {
      return pic(o, "window", (c, W, H) => {
        c.rect(0, 0, W, H, "!E"); c.rect(0, 0, W, 8, "!F"); c.hline(0, 3, W, "!L")                          // the ceiling, a tube
        for (let x = 4; x < W - 10; x += 12) {
          c.rect(x, H - 24, 11, 21, "!F"); c.hline(x, H - 24, 11, "!L")
          for (let y = -4; y <= 4; y++) for (let xx = -4; xx <= 4; xx++) if (Math.hypot(xx, y) < 4.2) c.px(x + 5 + xx, H - 12 + y, Math.hypot(xx, y) > 3 ? "!J" : "!E")
        }
        TXT.draw(c, fl(W * 0.17), 11, "WASH", "!L", { font: "hud", align: "center" }); TXT.draw(c, fl(W * 0.5), 11, "DRY", "!L", { font: "hud", align: "center" })
        for (let i = 0; i < 14; i++) c.px(fl(W * 0.7) + i, 4 + i * 2, "!F")
        c.rect(0, 0, W, 2, "4"); c.rect(0, H - 2, W, 2, "4"); c.rect(0, 0, 2, H, "4"); c.rect(W - 2, 0, 2, H, "4")
        c.rect(fl(W / 3), 0, 2, H, "4"); c.rect(fl((2 * W) / 3), 0, 2, H, "4")
      })
    },
  })
  // the sign: SUDS & SPIN in green neon tubes on a dark board, the second S stuttering now and then
  ISOKIT.opening("gs_lm_sign", {
    paint(s, h, o) {
      return pic(o, "sign", (c, W, H, f) => {
        c.rect(0, 0, W, H, "1"); c.rect(1, 1, W - 2, H - 2, "e"); c.px(2, 2, "4"); c.px(W - 3, 2, "4")
        const x0 = big(c, fl(W / 2), "SUDS & SPIN", "!K")
        if (f === 3 || f === 4 || f === 9) for (let y = 0; y < H; y++) for (let x = x0 + 28; x < x0 + 36; x++) if (c.key(x, y) === "!K") c.px(x, y, "!F")
      })
    },
  })
  ISOKIT.opening("gs_vent", { paint(s, h, o) { return pic(o, "vent", (c, W, H) => { c.rect(0, 0, W, H, "4"); for (let y = 1; y < H - 1; y += 2) c.hline(1, y, W - 2, "1"); c.px(2, H - 2, "h"); c.px(3, H - 2, "h") }) } })
  // a flat's window above: warm, a curtain half drawn, a plant on the sill
  ISOKIT.opening("gs_flat_window", {
    paint(s, h, o) {
      return pic(o, "flat", (c, W, H) => {
        c.rect(0, 0, W, H, "2"); c.rect(1, 1, W - 2, H - 2, "!Q"); c.rect(1, 1, fl(W / 3), H - 2, "!P"); c.vline(fl(W / 3), 1, H - 2, "!O")
        c.grid(W - 9, H - 9, ["..a.a..", ".aaaaa.", "..aaa..", "..OOO..", "..OOO.."]); c.hline(0, H - 2, W, "4")
      })
    },
  })
  // the lamp over the laundromat's door: a steel shade, its bulb
  ISOKIT.opening("gs_lamp", { paint(s, h, o) { return pic(o, "lamp", (c, W, H) => { c.rect(0, 0, W, H - 2, "4"); c.hline(0, 0, W, "5"); c.hline(1, H - 2, W - 2, "!V"); c.hline(2, H - 1, W - 4, "!W") }) } })

  // ---------------------------------------------------------------- the left wall
  // the niche: its rough concrete edge, a blue tarp hung over the top of the way in (the recess itself is the map's open room)
  ISOKIT.opening("gs_niche", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a >= 0 && a < aw && e < ah) {
        const sag = ah - 9 + Math.round(2 * Math.sin((a / aw) * Math.PI))
        if (e >= sag) return e === sag ? "u" : (a + e) % 5 === 0 ? "u" : "U"
        return null
      }
      return a === -1 || a === aw || e === ah ? "1" : "2"
    },
  })
  // the way down: as the approved blocks: steps going down and away hide behind the sill, so what shows is the stairwell's ceiling
  // sloping down toward the back (its tiles), the handrails dropping below the sill close to the side walls (as the user drew them),
  // and the market's glow coming up from beneath, brightest at the bottom, the top step's edge lit by it
  const RAIL = [[0, 0], [1, 1], [1, 2], [2, 3], [2, 4], [2, 5], [3, 6], [3, 7], [3, 8], [4, 9], [4, 10], [4, 11], [4, 12], [5, 13], [5, 14], [5, 15]]
  ISOKIT.opening("gs_market", {
    paint(s, h, o) {
      return pic(o, "market", (c, W, H, f) => {
        const sy = H / 54, sx = W / 64
        c.rect(0, 0, W, H, "k")
        for (let y = 0; y < fl(24 * sy); y++) {
          const i = fl((y / sy) * 0.9 * sx)
          c.hline(i, y, W - 2 * i, y < 12 * sy ? "1" : "2")
          if (y % 4 === 0) c.hline(i, y, W - 2 * i, "e")                                                   // the ceiling's tiles
        }
        c.hline(fl(W * 0.3), fl(20 * sy), fl(W * 0.4), "!n")                                                  // a strip light deep down
        for (let y = fl(30 * sy); y < H - 1; y++) {
          const t = (y - 30 * sy) / (H - 30 * sy)
          c.hline(fl(6 * sx), y, W - fl(12 * sx), t < 0.3 ? "!i" : t < 0.55 ? "!n" : t < 0.85 ? "!M" : (y + f) % 2 ? "!m" : "!M")
        }
        const top = H - 17
        for (const [dx, dy] of RAIL) { c.px(2 + dx, top + dy, "5"); c.px(W - 3 - dx, top + dy, "5"); c.px(3 + dx, top + dy, "!n"); c.px(W - 4 - dx, top + dy, "!n") }
        c.rect(2, top - 1, 1, 17, "4"); c.rect(W - 3, top - 1, 1, 17, "4"); c.px(2, top - 1, "6"); c.px(W - 3, top - 1, "6")
        c.hline(0, H - 1, W, "!M"); c.hline(0, H - 2, W, "4")                                                 // the sill, the glow on its edge
        for (let i = 0; i < 4; i++) c.hline(fl(W / 2) - 3 + i, fl(8 * sy) + i, 7 - 2 * i, "!m")               // the arrow down, lit
      })
    },
  })
  ISOKIT.opening("gs_market_sign", {
    paint(s, h, o) {
      return pic(o, "msign", (c, W, H, f) => {
        c.rect(0, 0, W, H, "1"); c.rect(1, 1, W - 2, H - 2, "k"); c.px(1, 1, "4"); c.px(W - 2, 1, "4")
        TXT.draw(c, fl(W / 2), fl((H - 5) / 2), "DRAIN MARKET", f === 7 ? "!M" : "!m", { font: "hud", align: "center" })
      })
    },
  })
  // the arch to Kowalski Street: the wall round a round-topped way through, its stones (voussoirs) edged lighter, the keystone
  ISOKIT.opening("gs_arch", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o, r = aw / 2, cx = aw / 2, top = ah - r
      const inside = (x, y) => y < top || Math.hypot(x - cx, y - top) < r
      if (a >= 0 && a < aw && e >= 0 && e < ah && inside(a + 0.5, e + 0.5)) return null
      const d = e < top ? Math.min(Math.abs(a + 0.5), Math.abs(aw - a - 0.5)) : Math.hypot(a + 0.5 - cx, e + 0.5 - top) - r
      if (d < 4 && (e < top ? a > -5 && a < aw + 5 : true)) {
        const ang = e < top ? fl(e / 5) : fl(Math.atan2(e + 0.5 - top, a + 0.5 - cx) * 6)
        if (e >= top && Math.abs(a + 0.5 - cx) < 2 && d < 4) return d < 0.8 ? "4" : "3"                     // the keystone
        return d < 0.8 ? "4" : ang % 2 ? "3" : "2"
      }
      return "2"
    },
  })
  // the passage: the street's cyan coming in from its far end, on its floor and its side wall the deeper they go
  const street = (d, x, y) => { const t = d / 1.4, b = ISO.bay(x, y); return t > 0.75 ? (b < 0.6 ? "!C" : "!c") : t > 0.45 ? (b < 0.5 ? "!c" : "!t") : t > 0.2 ? (b < 0.4 ? "!t" : null) : null }
  ISOKIT.floor("q", (u, v, o) => street(-u, o.x, o.y) ?? (near(u % 0.4, 0, 0.02) ? "e" : "f"))
  ISOKIT.wall("gs_tunnel", (s, h, o) => (Math.abs(o.len - 1.4) > 0.01 ? "!C" : h < 0.06 ? "e" : street(1.4 - s, o.x, o.y) ?? "1"))
  // the ad screen's frame (bolted to the wall) and its dark glass (the ads are gasse_ad, laid over it)
  ISOKIT.opening("gs_adscreen", { pad: 0.04, paint(s, h, o) { const { a, e, aw, ah } = o; if (a >= 0 && a < aw && e >= 0 && e < ah) return "!1"; return (a === -1 || a === aw) && e % 12 === 3 ? "6" : "4" } })

  // ---------------------------------------------------------------- props
  // the flood's memorial: a plinth of dark stone, on its front the bronze plaque with the names (rows of them, more than it holds: the
  // last rows run on to its edge); on it a woman of dark bronze, her head bowed, a small boat held to her chest, the water rising round
  // her in bronze to her knees; beside her a bronze rod, the flood mark: a wave on its top where the water stood, far over her head;
  // someone has fixed a ring of cyan light behind her head; at her foot paper boats with candles in them
  ISOKIT.prop("gs_statue", {
    frames: NF,
    draw(pen, p, f) {
      const [u, v] = p.at, [du, dv] = p.foot, cu = u + du / 2, cv = v + dv / 2
      pen.box(u, v, 0, du, dv, 0.08, () => "2", () => "1", () => "1")                                                    // the step
      pen.box(u + 0.06, v + 0.06, 0.08, du - 0.12, dv - 0.12, 0.5, (lu, lv) => (lu < 0.03 || lv > dv - 0.15 ? "4" : "3"), (a, e, o) => (a === 0 ? "3" : "2"),
        (a, e, o) => {
          if (a > 1 && a < o.aw - 2 && e > 1 && e < o.ah - 2) {
            if (a === 2 || a === o.aw - 3 || e === 2 || e === o.ah - 3) return "J"                                         // the plaque's bronze rim
            return e % 2 === 0 && (a + fl(e / 2) * 3) % 7 ? "F" : "E"                                                       // the names
          }
          return "2"
        })
      pen.box(u + 0.12, v + 0.12, 0.58, du - 0.24, dv - 0.24, 0.06, () => "4", () => "3", () => "3")                        // the cornice
      // the figure, from its base on the plinth: a woman of dark bronze in a long robe and a veil, her head bowed, a small boat held to
      // her chest with both hands; lit from the left, the rain's green running down from her hands (a figure is a hand grid: style guide §6)
      const [bx, by] = pen.P(cu, cv, 0.64)
      pen.at(cu, cv, 1.4, "v")
      const FIG = [
        "......FFF.....",
        ".....FJJFF....",
        "....FJJJFFF...",
        "....JJLJFFE...",
        "....JLLJFFE...",
        "....JJJFFEE...",
        ".....JFFEE....",
        "....JJFFFEE...",
        "...JJJFFFFEE..",
        "..JJLJJFFFFE..",
        "..JJLJFFFFFEE.",
        ".JJLJJFFFFFFE.",
        ".JLJJLLKLFFFE.",
        ".JJJLKKKLJFFE.",
        ".JLJJLLLJJFFE.",
        ".JLJJJJJFFFFE.",
        ".JLJJFFFFFFFE.",
        ".JJJJFFFEFFFE.",
        ".JLJFFFFEFFFE.",
        ".JLJFFFFEFFFEE",
        "JJLJFFFFEFFFEE",
        "JLJJFFFEFFFFEE",
        "JLLJFFFFEFFFEE",
        "JLLJFFFFEFFFEE",
        "JLJJFFFFEFFFEE",
        "JLLJFFFEFFFFEE",
        "JLLJFFFEFFFFEE",
        "JLLJFFFEFFFFEE",
        "JLJJFFFFEFFFEE",
        "JLLJFFFFEFFFEE",
        "JLLJEFFFEFFFEE",
        "JLLJFFFFEFFFEE",
        "JLJJFFFEFFFFEE",
        "JLLJFFFEFFFFEE",
        "JLJJFFFEFFFFEE",
        "JLJJFFFFEFFFEE",
        "JLJJFFFFEFFFEE",
        "JLJJFFLFEFFLEE",
        "JLJLLJFFLLFFEE",
        "JLLKLJFLKLJFEE",
        "LLJJLLLLJJLLLE",
        "JJLLJJJLLJJJLL",
        "LLLJJLLLJJLLLJ",
        "JJJJJJJJJJJJJJ",
      ]
      pen.grid(bx - 7, by - FIG.length, FIG)
      // the flood mark: a bronze rod at the plinth's right corner, a wave on its top where the water stood
      const [mx, my] = pen.P(u + du - 0.12, v + 0.14, 0.64), top = 76
      pen.vline(mx, my - top, top, "F"); pen.vline(mx + 1, my - top + 3, top - 3, "E")
      pen.grid(mx - 3, my - top - 4, ["..LLJ.", ".LK.JJ", "LJ..LJ", "JJJJJJ"])
      // the halo somebody fixed behind her bowed head, its LEDs chasing round
      for (let a = 0; a < 22; a++) { const t = (a / 22) * Math.PI * 2; pen.px(Math.round(bx - 0.5 + Math.cos(t) * 6), Math.round(by - FIG.length + 4 + Math.sin(t) * 5), (a + f * 2) % 8 < 2 ? "!V" : "!v") }
      pen.at(null)
      // the candles and the cranes at her foot, on the step's front
      for (const [k, du2] of [[0, 0.1], [1, 0.22], [2, 0.42], [3, 0.58]]) {
        const [x, y] = pen.P(u + du2, v + dv + 0.04, 0.08)
        pen.at(u + du2, v + dv + 0.04, 0.12, "v")
        pen.px(x, y - 1, "H"); pen.px(x, y - 2, k % 2 ? "H" : "h"); pen.px(x, y - 3, (k + f) % 4 ? "!Q" : "!R"); if ((k + f) % 3 === 0) pen.px(x, y - 4, "!W")
        pen.at(null)
      }
      // paper boats on the floor before the step, a candle in each
      for (const [cu2, cv2, k] of [[0.3, 0.12, 0], [0.52, 0.2, 1], [0.12, 0.24, 2]]) {
        const [cx, cy] = pen.P(u + cu2, v + dv + cv2, 0)
        pen.at(u + cu2, v + dv + cv2, 0.05, "v")
        pen.px(cx - 2, cy - 2, "H"); pen.px(cx + 2, cy - 2, "H"); for (let i = -1; i <= 1; i++) pen.px(cx + i, cy - 1, "H"); pen.px(cx, cy - 2, "h")
        pen.px(cx, cy - 3, (k + f) % 3 ? "!Q" : "!R")
        pen.at(null)
      }
    },
  })
  // in the niche: a mattress under a blanket, a pillow; the man's camping stove and his pot
  ISOKIT.prop("gs_mattress", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, p.h, (lu, lv) => (lv < 0.22 ? (lu > 0.1 && lu < du - 0.1 ? "h" : "g") : (fl(lu * 10) + fl(lv * 6)) % 3 ? "U" : "u"), () => "g", () => "u")
    },
  })
  ISOKIT.prop("gs_pot", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, 0.06, () => "4", () => "3", () => "3")
      pen.box(u + 0.02, v + 0.02, 0.06, du - 0.04, dv - 0.04, p.h - 0.06, (lu, lv) => (lu < 0.03 ? "6" : "5"), () => "4", () => "5")
    },
  })
  // the bins: two wheeled bins, dark green, their lids; one held open by a bag
  ISOKIT.prop("gs_bins", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, w = du / 2 - 0.04
      for (const [k, open] of [[0, false], [1, true]]) {
        const bu = u + k * du / 2 + 0.02
        pen.box(bu, v, 0.06, w, dv, H - 0.12, () => "F", (a, e, o) => (e > o.ah - 3 ? "J" : a % 6 === 0 ? "E" : "F"), (a, e, o) => (e > o.ah - 3 ? "J" : "E"))
        pen.box(bu + 0.04, v + dv - 0.12, 0, 0.1, 0.1, 0.1, () => "1", () => "k", () => "1")                                  // a wheel
        if (open) {
          pen.box(bu, v, H - 0.06, w, dv * 0.3, 0.06, () => "J", () => "F", () => "F")
          pen.box(bu + 0.05, v + dv * 0.3, H - 0.08, w - 0.1, dv * 0.35, 0.12, () => "g", () => "2", () => "g")              // the bag
          pen.box(bu, v + dv * 0.62, H - 0.02, w, dv * 0.38, 0.05, () => "J", () => "F", () => "F")
        } else pen.box(bu - 0.01, v - 0.01, H - 0.06, w + 0.02, dv + 0.02, 0.06, () => "J", () => "F", () => "F")
      }
    },
  })
  // the crates: fish crates of slats, stacked, one of them broken
  ISOKIT.prop("gs_crates", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h / 2
      const slats = (a, e, o) => (e % 4 === 0 ? "a" : a === 0 || a === o.aw - 1 ? "O" : "P")
      pen.box(u, v, 0, du, dv, H, () => "O", slats, slats)
      pen.box(u + 0.04, v + 0.03, H, du - 0.08, dv - 0.06, H, (lu, lv) => (fl(lv * 12) % 2 ? "a" : "O"), slats, (a, e, o) => (a > 4 && a < 9 && e > 2 ? "k" : slats(a, e, o)))
    },
  })
  // the balcony's railing: steel posts every half meter with caps, a top rail and one under it, rust where the rain runs off; padlocks
  // on the lower rail at the place where people stand to look at the water
  ISOKIT.prop("gs_railing", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, alongV = dv > du, L = alongV ? dv : du
      const at = (s) => (alongV ? [u, v + s] : [u + s, v]), size = (a, b) => (alongV ? [a, b] : [b, a])
      const n = Math.round(L / 0.5)
      for (let i = 0; i <= n; i++) {
        const s = Math.min((i * L) / n, L - 0.05)
        pen.box(...at(s), 0, ...size(0.05, 0.05), H, () => "5", () => "4", (a, e, o) => (e < 6 && ih(i, e) < 0.4 ? "O" : "3"))
        pen.box(...at(s - 0.01), H, ...size(0.07, 0.07), 0.03, () => "6", () => "5", () => "4")
      }
      pen.box(u, v, H - 0.05, ...size(0.06, L), 0.05, () => "6", () => "5", (a) => (a % 23 === 7 ? "O" : "4"))
      pen.box(u, v, 0.5, ...size(0.04, L), 0.03, () => "5", () => "4", () => "3")
      // the padlocks, a cluster round where Juno stands to look at the water
      for (let i = 0; i < 9; i++) {
        const s = 2.75 + i * 0.09 + ih(i, 3) * 0.05, [pu, pv] = at(s), [x, y] = pen.P(pu + 0.06, pv, 0.5)
        pen.at(pu + 0.06, pv, 0.5, "v")
        pen.px(x, y - 1, "5"); pen.px(x, y + 1, i % 3 === 0 ? "P" : i % 3 === 1 ? "Q" : "6"); pen.px(x, y + 2, i % 3 === 0 ? "O" : i % 3 === 1 ? "P" : "5")
        pen.at(null)
      }
    },
  })
  // the cable bundles: from the left wall across to the facade, sagging, black and thick, with a few lighter ones taped to them;
  // drops falling from the lowest; the lamp somebody hung from them over the memorial
  ISOKIT.prop("gs_cables", {
    outline: false, footprint: () => [], solid: () => [], frames: NF,
    draw(pen, p, f) {
      pen.at(3, 2, p.h, null)
      const RUNS = [[[0, 0.8, 3.6], [2.4, 0, 3.8], 2], [[0, 1.6, 3.3], [3.6, 0, 3.6], 3], [[0, 3.4, 3.4], [5.2, 0, 3.9], 2], [[0, 4.6, 3.8], [5.8, 0, 4.2], 1]]
      let low = null
      for (const [a, b, thick] of RUNS) {
        const [x0, y0] = pen.P(...a), [x1, y1] = pen.P(...b), n = Math.max(2, Math.abs(x1 - x0))
        for (let i = 0; i <= n; i++) {
          const t = i / n, x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 10)
          for (let k = 0; k < thick; k++) pen.px(x, y + k, k === 0 && thick > 1 ? "1" : "k")
          if (thick === 3 && i % 37 === 12) { pen.px(x, y - 1, "4"); pen.px(x, y + 3, "4") }                                   // tape round it
          if (!low || y > low[1]) low = [x, y + thick]
        }
      }
      const SL = ISO_MAPS.gasse.lights.find((l) => l.id === "statue").at, [lx, ly] = pen.P(...SL)
      pen.vline(lx, ly - 16, 14, "k"); pen.grid(lx - 4, ly - 3, ["...kk...", "..k45k..", ".k4554k.", "k444444k", ".RWWWWR."])
      for (const off of [0, 17]) { const dy = (f * 4 + off) % 40; if (dy < 34) pen.px(low[0] + (off ? -60 : 0), low[1] + 2 + dy, "6") }
      pen.at(null)
    },
  })

  return {}
})()
