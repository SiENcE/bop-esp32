// Halcyon's room kit and its bake (docs/ideas/iso-tiles.md, style guide §4 and §7): a street-mode room's
// map (art/lib/isomap.js, art/rooms/<id>.map.js) baked with its light into the picture and the props.
// pxl-side JavaScript; include it after art/lib/iso.js (its palette and helpers: bay, ihash) and
// art/lib/isomap.js, then the kit files (art/kit/*.kit.px.js) that register the pieces, then bake:
//
//   include("../lib/iso.js", { palette: true }); include("../lib/isomap.js"); include("../rooms/flat.map.js")
//   include("../lib/isokit.js"); include("../kit/flat.kit.px.js")
//   const FLAT = ISOKIT.bake(ISO_MAPS.flat, { id: "flat", frames: 12 })
//
// Everything is in the one object ISOKIT (pxl's included files share one scope). Every length in meters.
//
// THE KIT (a registry; a room's map names its pieces by key)
//   ISOKIT.floor(key, fn)        fn(u, v, o) -> palette key: the floor's texture at a floor point, seamless
//                                across cells (a function of the point, not of the cell); o = { x, y, f, map }
//   ISOKIT.wall(kit, fn)         fn(s, h, o) -> key: a wall's inner face, s meters along it from its `from`,
//                                h up; o = { a, e, len, H, x, y, f, wall }, a/e its px from the wall's
//                                screen-left end and from its foot (so nothing drawn on it is mirrored)
//   ISOKIT.opening(kit, { pad, paint, pass, frames })
//                                a thing set into a wall (door, window, pinboard, a strip): paint(s, h, o)
//                                -> key or null (the wall shows), s/h meters from the opening's screen-left
//                                bottom corner (negative inside `pad`: a frame, a sill), o = { a, e, w, h,
//                                aw, ah, x, y, f, gx, gy, memo, op } (a/e px; aw/ah its px size; gx/gy the
//                                screen point of its top-left, for a view far beyond the glass; memo an
//                                object kept per frame; op the map's entry, for a piece's own options);
//                                pass(s, h, w, h) -> whether light from outside comes through there (glass,
//                                the gap under a door); halo: [{ color, reach, power, rect }] what glows in
//                                it lighting its own wall round it (rect in its own meters, default all)
//   ISOKIT.stairs(kit, { tread, riser, well })
//                                a flight down (the map's stairs): tread(lu, lv, i, o) -> key on step i's
//                                top (lu meters from its back edge, lv from the well's back wall),
//                                riser(a, e, i, o) on the face above it (toward +u, a px from its screen-left
//                                edge, e px up), well(s, h, o) the back wall beside the flight below the
//                                floor (s meters along it from the top step, h < 0); o = { x, y, f }
//   ISOKIT.raster(w, h, draw, ox, oy) a small y-down drawing read back as a painter's (a, e)
//   ISOKIT.prop(kit, { draw, frames, solid, footprint, glows })
//                                draw(pen, p, f): paints the prop where it stands (p = the map's prop:
//                                at, foot, h) with a pen in room meters (below); frames > 1 animates it
//                                (on the bake's clock); solid(p) -> [[u, v, h, du, dv, dh], ...] the boxes
//                                that stop light (default: its whole footprint and height); footprint(p) ->
//                                [[u, v, du, dv], ...] where it touches the floor (contact shadows; default
//                                its footprint: a desk stands on its legs); glows: pxl glow() items run on
//                                its sprite; outline: false leaves its ink outline off (a thin thing in
//                                the air: a cable, a string of bulbs)
//
// THE PEN (room meters in, the room's screen px out; every mark carries a world point and a normal for
// the light; a key "!k" is drawn as k and never lit: screens, lamps, the view through a window)
//   pen.P(u, v, h)                         the screen point (rounded)
//   pen.box(u, v, h, du, dv, dh, top, fu, fv)
//                                          a box: top(lu, lv, o) meters on its top; fu(a, e, o) its +u face
//                                          (toward the lower right), fv(a, e, o) its +v face (lower left),
//                                          a/e px from the face's screen-left edge and its foot, o = { s, h,
//                                          aw, ah } (meters, and the face's px size); a shader returning null
//                                          leaves the pixel
//   pen.px/rect/hline/vline/line/ellipse/grid(x, y, ..., k)  screen-space marks (as ISO.pen); they take the
//                                          world point set by pen.at(u, v, h, n) (n: "up", "u", "v" or
//                                          none), else the point already under them, else the prop's top
//   pen.key(x, y), pen.is(x, y, keys), pen.f (the frame)
//   ISOKIT.grid(rows, a0, eTop, map)       a face shader drawing a small hand grid at (a0, eTop) (rows top
//                                          down; "." leaves it): first(...) chains shaders, the first
//                                          non-null wins
//
// THE LIGHT (style guide §7: pools and spill baked as palette-key tints, dithered falloff, Bayer)
//   Each map light lights every baked pixel by its world point: distance falloff over its reach,
//   how its surface faces the lamp (a soft wrap), shadows from the props' solid boxes, a lamp's cone
//   (`bake.dir`), a strip (`bake.line`), light coming in from outside through an opening (`bake.through`
//   + `bake.from`: the source beyond it, the opening's pass() the shape, so the pool on the floor is the
//   window's). The strongest light at a pixel wins (their borders dithered); it steps the pixel's key one
//   or two steps along its family's table (ISOKIT.TINT: warm, cyan, magenta, cold); then contact shadows
//   on the floor round walls and props, and the light dying out up the walls (ISOKIT.SHADE).
//   ZONES: an open opening (the map's `open`) is a room of its own behind the wall. Its pixels take light
//   from lights in it ({ zone: <opening id> } on the map's light) and from the room's lights only through
//   the opening; its lights reach the room only through the opening.
//   A kit may add a light family: ISOKIT.TINT.green = { key: [one step, two] } (a light whose green is well
//   over its red and blue), and its own keys to ISOKIT.SHADE.
//   A map light: { id, at, r, power, color, flicker, zone, bake: { reach, line, dir, through, from, off } }
//   (the engine uses at/r/power/color/flicker; `bake` only here): reach meters (default r / 32), off the
//   frames it stutters on, at/power where the bake's lamp differs from the engine's (a screen's light
//   from its top edge, so the desk's edge throws a short shadow), wrap how much a face turned away from
//   it still takes (1: only by its angle, 0: all alike), gamma its falloff's curve, floor how much
//   more it shows on what faces up (a strip high on a wall is seen by its pool on the floor).
//
// THE BAKE
//   ISOKIT.bake(map, { id, frames, fps, bg, glows, sheen }) defines `<id>_bg` (floor, walls with their openings,
//   the back walls' cut tops, the near walls as stubs over the slab's section; an anim of `frames`; with
//   sheen = { reach, map, keys(u, v) } a glossy floor mirrors the walls' bright keys faintly: map a table
//   of key -> key, or (u, v) -> a table (a puddle mirrors, wet paving only takes a sheen); glows are pxl
//   items run over the picture, glow() or (c) => {} layers: steam, splashes) and
//   `<id>_<prop id>` per prop (outlined in ink, pivot bottom-centre, drawn where it stands; an anim when its
//   kit animates or a stuttering light lies on it). Returns { map, P, props, layout }: props[id] = { name,
//   box: [x, y, w, h] (the sprite on the screen, outline included), at: [x, y] (its bottom-centre, where the
//   engine places it), frames }, layout = ISOMAP.layout(map) with each prop's `at` and `box` added.
"use strict";

const ISOKIT = (() => {
  const fl = Math.floor, bay = ISO.bay
  const KIT = { floor: {}, wall: {}, opening: {}, prop: {}, stairs: {} }

  // ---------------------------------------------------------------- the light's palette tables
  // family -> base key -> [one step lit, two steps lit]; keys not listed stay as they are (they are
  // already light: screens, signs, paper in a lamp's own colour)
  const TINT = {
    warm: {
      e: ["e", "f"], f: ["f", "a"], z: ["a", "A"], Z: ["A", "A"], X: ["A", "P"],
      1: ["1", "a"], 2: ["a", "a"], 3: ["a", "A"], 4: ["A", "A"], 5: ["g", "g"], 6: ["g", "G"],
      g: ["g", "G"], G: ["G", "H"], h: ["h", "H"], H: ["H", "W"],
      u: ["u", "A"], U: ["U", "S"], i: ["a", "A"], I: ["A", "A"], a: ["a", "A"], A: ["A", "P"], O: ["O", "P"], P: ["P", "Q"],
      0: ["0", "a"], 7: ["7", "A"], s: ["s", "S"], c: ["c", "a"], t: ["a", "A"],
    },
    cyan: {
      e: ["e", "t"], f: ["f", "t"], z: ["t", "T"], Z: ["T", "T"], X: ["T", "C"],
      1: ["1", "t"], 2: ["t", "c"], 3: ["t", "T"], 4: ["T", "T"], 5: ["T", "C"], 6: ["h", "H"],
      g: ["g", "x"], G: ["x", "H"], h: ["h", "H"], H: ["H", "V"],
      u: ["u", "c"], U: ["U", "x"], i: ["i", "t"], I: ["I", "T"], a: ["a", "t"], A: ["A", "T"], O: ["O", "A"], P: ["P", "P"],
      0: ["0", "t"], 7: ["7", "T"], s: ["s", "S"], c: ["c", "T"], t: ["t", "T"],
    },
    magenta: {
      e: ["e", "i"], f: ["f", "i"], z: ["i", "I"], Z: ["I", "I"], X: ["I", "M"],
      1: ["1", "i"], 2: ["i", "n"], 3: ["i", "I"], 4: ["I", "I"], 5: ["I", "U"], 6: ["U", "h"],
      g: ["g", "U"], G: ["G", "N"], h: ["h", "N"], H: ["H", "N"],
      u: ["I", "n"], U: ["U", "M"], i: ["i", "I"], I: ["I", "I"], a: ["i", "I"], A: ["A", "I"], O: ["O", "n"], P: ["P", "M"],
      0: ["0", "i"], 7: ["7", "I"], s: ["s", "S"], c: ["c", "i"], t: ["t", "i"],
    },
    cold: {
      e: ["f", "z"], f: ["z", "w"], z: ["w", "x"], Z: ["w", "x"], X: ["x", "x"],
      1: ["2", "w"], 2: ["3", "w"], 3: ["w", "x"], 4: ["w", "x"], 5: ["x", "6"], 6: ["6", "h"],
      g: ["g", "x"], G: ["G", "H"], h: ["h", "H"], a: ["w", "x"], t: ["w", "x"], i: ["w", "x"],
    },
  }
  // one step darker (contact shadows, the light dying out up the walls), for lit keys too
  const SHADE = {
    6: "5", 5: "4", 4: "3", 3: "2", 2: "1", 1: "e", e: "k", f: "e", z: "f", Z: "z", X: "Z",
    a: "f", A: "a", t: "f", T: "t", i: "f", I: "i", c: "t", C: "c", n: "i", w: "z", x: "w",
    g: "4", G: "g", h: "g", H: "h", u: "2", U: "u", O: "a", P: "O", Q: "P", s: "O", 0: "e", 7: "0",
  }
  /** a light's family from its colour: warm, cyan, magenta, or cold (a pale grey-blue) */
  function familyOf(hex) {
    const n = parseInt(hex.replace("#", ""), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255
    if (r > b + 40 && g > b) return "warm"
    if (r > g + 40 && b > g + 40) return "magenta"
    if (b > r + 40 && g > r + 40) return "cyan"
    if (g > r + 30 && g > b + 25) return "green"
    return "cold"
  }

  // ---------------------------------------------------------------- registry
  const floor = (key, fn) => { KIT.floor[key] = fn }
  const wall = (kit, fn) => { KIT.wall[kit] = fn }
  const opening = (kit, def) => { KIT.opening[kit] = { pad: 0, ...def } }
  const prop = (kit, def) => { KIT.prop[kit] = { frames: 1, ...def } }
  const stairs = (kit, def) => { KIT.stairs[kit] = def }
  /** a face shader drawing a hand grid: rows top down, its top-left at (a0, eTop) */
  const grid = (rows, a0, eTop, map = {}) => (a, e) => {
    const j = eTop - e, i = a - a0, row = rows[j]
    if (!row || i < 0 || i >= row.length) return null
    const ch = row[i]
    return ch === "." ? null : map[ch] ?? ch
  }
  /** a small drawing for a wall piece, y down (a canvas: px, rect, hline, vline, line, grid, key), read
   * back as a painter's (a, e): its bottom-left pixel is (ox, oy) of the piece (ox, oy < 0: in its pad) */
  function raster(w, h, draw, ox = 0, oy = 0) {
    const K = new Array(w * h).fill(null)
    const c = {
      w, h,
      px: (x, y, k) => { x = Math.round(x); y = Math.round(y); if (k && x >= 0 && y >= 0 && x < w && y < h) K[y * w + x] = k === "_" ? null : k },
      key: (x, y) => (x >= 0 && y >= 0 && x < w && y < h ? K[y * w + x] : null),
    }
    c.rect = (x, y, rw, rh, k) => { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) c.px(x + i, y + j, k) }
    c.hline = (x, y, n, k) => c.rect(x, y, n, 1, k)
    c.vline = (x, y, n, k) => c.rect(x, y, 1, n, k)
    c.line = (x0, y0, x1, y1, k) => { for (const [x, y] of ISO.lineCells(x0, y0, x1, y1)) c.px(x, y, k) }
    c.ellipse = (cx, cy, rx, ry, k) => { for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x / (rx + 0.5)) ** 2 + (y / (ry + 0.5)) ** 2 <= 1) c.px(cx + x, cy + y, k) }
    c.grid =(x, y, rows, map = {}) => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, map[ch] ?? ch) }))
    draw(c)
    return (a, e) => c.key(a - ox, h - 1 - (e - oy))
  }
  const first = (...fns) => (...args) => { for (const g of fns) { const k = g && g(...args); if (k) return k } return null }

  // ---------------------------------------------------------------- the pixel buffer
  // a screen-sized buffer of keys, each with its world point (u, v, h), a normal and whether it is lit
  const NRM = { up: 1, u: 2, v: 3, "-u": 4, "-v": 5 }
  const NVEC = [null, [0, 0, 1], [1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0]]
  function buffer(W, H) {
    const n = W * H
    // zone: 0 the room, 1.. the rooms seen through open openings (ctx.zones[i] its opening's id)
    return { W, H, k: new Array(n).fill(null), pos: new Float32Array(n * 3), nrm: new Int8Array(n), lit: new Uint8Array(n), has: new Uint8Array(n), zone: new Uint8Array(n) }
  }
  function put(B, x, y, k, pos, n) {
    if (!k || x < 0 || y < 0 || x >= B.W || y >= B.H) return
    const i = y * B.W + x
    let lit = 1
    if (k.length === 2 && k[0] === "!") { k = k[1]; lit = 0 }
    if (k === "_") { B.k[i] = null; B.has[i] = 0; return }
    B.k[i] = k; B.lit[i] = lit; B.zone[i] = B.zoneNow ?? 0
    if (pos) { B.pos[i * 3] = pos[0]; B.pos[i * 3 + 1] = pos[1]; B.pos[i * 3 + 2] = pos[2]; B.nrm[i] = n || 0; B.has[i] = 1 }
  }

  // ---------------------------------------------------------------- faces in meters
  // Every surface is painted per pixel from its pixel's centre projected back onto it, so two surfaces
  // sharing an edge split their pixels exactly (no gaps, no overlap) and every pixel knows its world point.
  function geometry(map) {
    const { P, UPM, VPM } = ISOMAP.projector(map), [CX, CY] = map.at
    const SU = 2 * UPM        // screen px per meter along a wall (32)
    /** a horizontal face at height h over [u0, u1) x [v0, v1) */
    function top(B, u0, v0, u1, v1, h, sh) {
      const xs = [P(u0, v0, h), P(u1, v0, h), P(u1, v1, h), P(u0, v1, h)]
      const xa = Math.max(0, Math.min(...xs.map((p) => p[0])) - 1), xb = Math.min(B.W - 1, Math.max(...xs.map((p) => p[0])) + 1)
      const ya = Math.max(0, Math.min(...xs.map((p) => p[1])) - 1), yb = Math.min(B.H - 1, Math.max(...xs.map((p) => p[1])) + 1)
      for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) {
        const A = (x + 0.5 - CX) / SU, Bq = (y + 0.5 + h * VPM - CY) / UPM, u = (A + Bq) / 2, v = (Bq - A) / 2
        if (u < u0 || u >= u1 || v < v0 || v >= v1) continue
        put(B, x, y, sh(u, v, x, y), [u, v, h], NRM.up)
      }
    }
    /** a vertical face on the plane v = V (toward +v, the lower left), over u0..u1, h0..h1;
     * sh(a, e, o): a px from its screen-left edge (u0), e px up from h0 */
    function faceV(B, V, u0, u1, h0, h1, sh, nk = "v") {
      const xa = Math.max(0, fl(CX + SU * (u0 - V)) - 1), xb = Math.min(B.W - 1, Math.ceil(CX + SU * (u1 - V)) + 1)
      const aw = Math.round((u1 - u0) * SU), ah = Math.round((h1 - h0) * VPM)
      for (let x = xa; x <= xb; x++) {
        const u = (x + 0.5 - CX) / SU + V
        if (u < u0 || u >= u1) continue
        const yf = CY + UPM * (u + V)
        const ya = Math.max(0, fl(yf - h1 * VPM) - 1), yb = Math.min(B.H - 1, Math.ceil(yf - h0 * VPM) + 1)
        for (let y = ya; y <= yb; y++) {
          const h = (yf - y - 0.5) / VPM
          if (h < h0 || h >= h1) continue
          const o = { s: u - u0, h: h - h0, aw, ah, x, y }
          put(B, x, y, sh(fl((u - u0) * SU), fl((h - h0) * VPM), o), [u, V, h], NRM[nk])
        }
      }
    }
    /** a vertical face on the plane u = U (toward +u, the lower right), over v0..v1, h0..h1;
     * sh(a, e, o): a px from its screen-left edge (v1), e px up from h0 */
    function faceU(B, U, v0, v1, h0, h1, sh, nk = "u") {
      const xa = Math.max(0, fl(CX + SU * (U - v1)) - 1), xb = Math.min(B.W - 1, Math.ceil(CX + SU * (U - v0)) + 1)
      const aw = Math.round((v1 - v0) * SU), ah = Math.round((h1 - h0) * VPM)
      for (let x = xa; x <= xb; x++) {
        const v = U - (x + 0.5 - CX) / SU
        if (v < v0 || v >= v1) continue
        const yf = CY + UPM * (U + v)
        const ya = Math.max(0, fl(yf - h1 * VPM) - 1), yb = Math.min(B.H - 1, Math.ceil(yf - h0 * VPM) + 1)
        for (let y = ya; y <= yb; y++) {
          const h = (yf - y - 0.5) / VPM
          if (h < h0 || h >= h1) continue
          const o = { s: v1 - v, h: h - h0, aw, ah, x, y }
          put(B, x, y, sh(fl((v1 - v) * SU), fl((h - h0) * VPM), o), [U, v, h], NRM[nk])
        }
      }
    }
    return { P, UPM, VPM, SU, CX, CY, top, faceU, faceV }
  }

  // ---------------------------------------------------------------- the pen (a prop's drawing)
  function makePen(G, B, f, fallback) {
    let cur = null, curN = 0
    const at = (u, v, h, n) => { if (u == null) { cur = null; curN = 0 } else { cur = [u, v, h]; curN = NRM[n] || 0 } }
    const mark = (x, y, k) => {
      if (!k) return
      x = Math.round(x); y = Math.round(y)
      if (x < 0 || y < 0 || x >= B.W || y >= B.H) return
      const i = y * B.W + x
      if (cur) put(B, x, y, k, cur, curN)
      else if (B.has[i]) put(B, x, y, k, [B.pos[i * 3], B.pos[i * 3 + 1], B.pos[i * 3 + 2]], B.nrm[i])
      else put(B, x, y, k, fallback, 0)
    }
    const p = {
      f, P: G.P, at,
      px: mark,
      rect: (x, y, w, h, k) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) mark(x + i, y + j, k) },
      hline: (x, y, w, k) => p.rect(x, y, w, 1, k),
      vline: (x, y, h, k) => p.rect(x, y, 1, h, k),
      line: (x0, y0, x1, y1, k) => { for (const [x, y] of ISO.lineCells(x0, y0, x1, y1)) mark(x, y, k) },
      ellipse: (cx, cy, rx, ry, k) => {
        for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x / (rx + 0.5)) ** 2 + (y / (ry + 0.5)) ** 2 <= 1) mark(cx + x, cy + y, k)
      },
      grid: (x, y, rows, map = {}) => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") mark(x + i, y + j, map[ch] ?? ch) })),
      key: (x, y) => (x < 0 || y < 0 || x >= B.W || y >= B.H ? null : B.k[y * B.W + x]),
      is: (x, y, keys) => { const k = p.key(x, y); return !!k && keys.includes(k) },
      /** a box standing at (u, v, h); shaders as above (null: that face is not drawn) */
      box: (u, v, h, du, dv, dh, topSh, fu, fv) => {
        const U = u + du, V = v + dv
        if (fu) G.faceU(B, U, v, V, h, h + dh, (a, e, o) => fu(a, e, o))
        if (fv) G.faceV(B, V, u, U, h, h + dh, (a, e, o) => fv(a, e, o))
        if (topSh) G.top(B, u, v, U, V, h + dh, (lu, lv, x, y) => topSh(lu - u, lv - v, { x, y }))
      },
      /** a flat face of its own: on the plane v = V or u = U (a sign, a screen standing free) */
      faceV: (V, u0, u1, h0, h1, sh) => G.faceV(B, V, u0, u1, h0, h1, sh),
      faceU: (U, v0, v1, h0, h1, sh) => G.faceU(B, U, v0, v1, h0, h1, sh),
      top: (u0, v0, u1, v1, h, sh) => G.top(B, u0, v0, u1, v1, h, (lu, lv, x, y) => sh(lu - u0, lv - v0, { x, y })),
    }
    return p
  }

  // ---------------------------------------------------------------- the light pass
  function lightsOf(map, f) {
    return (map.lights ?? []).map((l) => {
      const b = l.bake ?? {}
      const off = b.off && b.off.includes(f)
      // a flicker that is a pure function of the frame: a small wobble, a stutter on its `off` frames
      const wob = l.flicker ? 1 + l.flicker * (Math.sin((f / 12) * Math.PI * 2 * 3 + l.id.length) * 0.5) : 1
      return {
        id: l.id, zone: l.zone ?? null, at: b.at ?? l.at, line: b.line, dir: b.dir, through: b.through, from: b.from,
        reach: b.reach ?? (l.r ?? 64) / 32, power: (b.power ?? l.power ?? 1) * wob * (off ? 0.72 : 1),
        fam: b.family ?? familyOf(l.color ?? "#ffffff"), gamma: b.gamma ?? 1, wrap: b.wrap ?? 0.5, floor: b.floor ?? 1,
        stutters: !!(b.off && b.off.length) || (l.flicker ?? 0) >= 0.1,
      }
    })
  }
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
  const len3 = (d) => Math.hypot(d[0], d[1], d[2])
  /** does the segment p -> q cross the box [u, v, h, du, dv, dh]? (slabs) */
  function hitsBox(p, q, bx) {
    let t0 = 0, t1 = 1
    for (let ax = 0; ax < 3; ax++) {
      const d = q[ax] - p[ax], lo = bx[ax], hi = bx[ax] + bx[ax + 3]
      if (Math.abs(d) < 1e-9) { if (p[ax] < lo || p[ax] > hi) return false; continue }
      let a = (lo - p[ax]) / d, b = (hi - p[ax]) / d
      if (a > b) [a, b] = [b, a]
      t0 = Math.max(t0, a); t1 = Math.min(t1, b)
      if (t0 > t1) return false
    }
    return t1 > 0.001 && t0 < 0.999
  }
  const inBox = (p, bx) => p[0] >= bx[0] && p[0] <= bx[0] + bx[3] && p[1] >= bx[1] && p[1] <= bx[1] + bx[4] && p[2] >= bx[2] && p[2] <= bx[2] + bx[5]
  /** the closest point on a segment */
  function closest(a, b, p) {
    const d = sub(b, a), t = Math.max(0, Math.min(1, ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1] + (p[2] - a[2]) * d[2]) / (d[0] ** 2 + d[1] ** 2 + d[2] ** 2 || 1)))
    return [a[0] + d[0] * t, a[1] + d[1] * t, a[2] + d[2] * t]
  }
  /** how strongly light L falls on world point p with normal n (0..) */
  function intensity(L, p, n, ctx, zone = null) {
    let src = L.line ? closest(L.line[0], L.line[1], p) : L.at
    const q = n ? [p[0] + n[0] * 0.02, p[1] + n[1] * 0.02, p[2] + n[2] * 0.02] : [p[0], p[1], p[2] + 0.02]
    let toward = src
    // a light and a pixel in different zones: only through the opening between them
    if ((L.zone ?? null) !== zone) {
      if (L.zone && zone) return 0
      const o = ctx.openings[L.zone ?? zone]
      if (!o || L.through || !o.cross(q, src)) return 0
    } else if (zone && L.through) return 0
    if (L.through) {
      // from a source beyond an opening: lit only where the line to the source passes through it
      const o = ctx.openings[L.through]
      if (!o) return 0
      toward = L.from
      const hit = o.cross(q, L.from)
      if (!hit) return 0
      src = L.at
    }
    const d = sub(toward, q), dist = len3(d), dsrc = len3(sub(src, q))
    if (dsrc >= L.reach) return 0
    let k = L.power * Math.pow(1 - dsrc / L.reach, L.gamma)
    if (n) {
      const c = (n[0] * d[0] + n[1] * d[1] + n[2] * d[2]) / (dist || 1)
      if (c < -0.05) return 0
      k *= 1 - L.wrap + L.wrap * Math.max(0, c)
      if (n[2] === 1) k *= L.floor
    } else k *= 0.8
    if (L.dir) {
      const e = sub(q, src), de = len3(e) || 1
      k *= 0.3 + 0.7 * Math.max(0, (L.dir[0] * e[0] + L.dir[1] * e[1] + L.dir[2] * e[2]) / de)
    }
    // shadows: the props' solid boxes between the point and the light (not those the light is in)
    const tgt = L.through ? L.from : src
    for (const bx of ctx.solids) {
      if (bx.holdsLight[L.id]) continue
      if (hitsBox(q, tgt, bx.b)) return 0
    }
    return k
  }
  /** light the buffer in place */
  function lightPass(B, ctx, lights) {
    for (let y = 0; y < B.H; y++) for (let x = 0; x < B.W; x++) {
      const i = y * B.W + x
      const k0 = B.k[i]
      if (!k0 || !B.lit[i] || !B.has[i]) continue
      const p = [B.pos[i * 3], B.pos[i * 3 + 1], B.pos[i * 3 + 2]], n = NVEC[B.nrm[i]]
      let best = 0, bestL = null, li = 0
      const take = (L, I) => {
        if (I > 0) {
          const j = I + 0.3 * (bay(x + 2 * li + 1, y + li) - 0.5)        // where two pools meet, their border dithered
          if (j > best) { best = j; bestL = [L, I] }
        }
        li++
      }
      const zone = B.zone[i] ? ctx.zones[B.zone[i]] : null
      for (const L of lights) take(L, intensity(L, p, n, ctx, zone))
      // an opening's halo: what glows in it (a window's view, a strip) lights its own wall round it
      for (const hl of ctx.halos ?? []) {
        if (B.zone[i] || B.nrm[i] !== hl.nrm || Math.abs(p[hl.ax] - hl.plane) > 0.01) { li++; continue }
        const s = p[1 - hl.ax], dx = Math.max(hl.s0 - s, 0, s - hl.s1), dh = Math.max(hl.h0 - p[2], 0, p[2] - hl.h1), d = Math.hypot(dx, dh)
        take(hl, d > 0 && d < hl.reach ? hl.power * (1 - d / hl.reach) : 0)
      }
      let k = k0
      if (bestL) {
        // two steps of light: solid where it is strong, a dithered rim (Bayer) only where it crosses a step
        const [L, I] = bestL, T = TINT[L.fam]?.[k0], lv = I * 2 + (bay(x, y) - 0.5) * DITHER
        if (T) { if (lv >= 2) k = T[1]; else if (lv >= 1) k = T[0] }
      }
      // the floor's contact shadows: round what stands on it and along the walls' feet
      if (B.nrm[i] === NRM.up && Math.abs(p[2]) < 0.01 && !B.zone[i]) {
        const dd = ctx.contact(p[0], p[1])
        if (dd < 0.07 || (dd < 0.14 && bay(x, y) < (0.14 - dd) / 0.1)) k = SHADE[k] ?? k
      }
      // the light dies out up the walls and the tall things: the ceiling's dark
      const top = ctx.ceiling - 0.6
      if (p[2] > top && bay(x + 1, y) < (p[2] - top) / 0.75) k = SHADE[k] ?? k
      B.k[i] = k
    }
  }
  const DITHER = 0.7            // how wide a light's dithered rim is, in steps (0: hard edges, 2: all dither)
  const blit = (c, B, ox = 0, oy = 0) => { for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) { const X = x + ox, Y = y + oy; if (X < 0 || Y < 0 || X >= B.W || Y >= B.H) continue; const k = B.k[Y * B.W + X]; if (k) c.px(x, y, k) } }

  // ---------------------------------------------------------------- the bake
  function bake(map, { id, frames = 12, fps = 10, bg = "k", glows = [], thick = 0.25, slab = 0.3, stub = 0.17, sheen = null } = {}) {
    const G = geometry(map), [W, H] = map.screen, P = G.P
    const ceiling = Math.max(...map.walls.map((w) => w.h))
    // the openings, each with its wall, its rect along it and its crossing test for light from outside
    const openings = {}
    for (const o of map.openings ?? []) {
      const w = map.walls[o.wall], alongU = w.from[1] === w.to[1]
      const k = KIT.opening[o.kit]
      openings[o.id] = {
        ...o, def: k, alongU, plane: alongU ? w.from[1] : w.from[0], base: alongU ? w.from[0] : w.from[1],
        /** the segment q -> src crosses the opening's plane where its pass() lets light through */
        cross(q, src) {
          const ax = alongU ? 1 : 0, d = src[ax] - q[ax]
          if (Math.abs(d) < 1e-9) return false
          const t = (this.plane - q[ax]) / d
          if (t <= 0 || t >= 1) return false
          const s = (alongU ? q[0] + (src[0] - q[0]) * t : q[1] + (src[1] - q[1]) * t) - this.base
          const hh = q[2] + (src[2] - q[2]) * t
          if (s < this.from || s >= this.to || hh < this.h[0] || hh >= this.h[1]) return false
          // pass() takes the opening's own coordinates: from its screen-left bottom corner
          const ls = alongU ? s - this.from : this.to - s
          return k?.pass ? k.pass(ls, hh - this.h[0], this.to - this.from, this.h[1] - this.h[0]) : true
        },
      }
    }
    // what stops light: each prop's solid boxes (kit's, or its whole box)
    const solids = []
    for (const p of map.props ?? []) {
      const k = KIT.prop[p.kit]
      const boxes = k?.solid ? k.solid(p) : [[p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h]]
      for (const b of boxes) solids.push({ b, prop: p.id })
    }
    for (const s of solids) {
      s.holdsLight = {}
      for (const l of map.lights ?? []) s.holdsLight[l.id] = inBox(l.bake?.at ?? l.at, s.b) || (l.bake?.line && l.bake.line.some((q) => inBox(q, s.b)))
    }
    // the floor's distance to the nearest wall foot or blocking footprint (contact shadows)
    const feet = (map.props ?? []).filter((p) => p.block !== false && p.h > 0.05)
    const backU = map.walls.filter((w) => !w.stub && w.from[0] === w.to[0]).map((w) => w.from[0])
    const backV = map.walls.filter((w) => !w.stub && w.from[1] === w.to[1]).map((w) => w.from[1])
    const contact = (u, v) => {
      let d = Infinity
      for (const a of backU) d = Math.min(d, Math.abs(u - a))
      for (const a of backV) d = Math.min(d, Math.abs(v - a))
      for (const p of feet) {
        const k = KIT.prop[p.kit], ft = k?.footprint ? k.footprint(p) : [[p.at[0], p.at[1], p.foot[0], p.foot[1]]]
        for (const [u0, v0, du, dv] of ft) {
          const dx = Math.max(u0 - u, 0, u - (u0 + du)), dy = Math.max(v0 - v, 0, v - (v0 + dv))
          d = Math.min(d, Math.hypot(dx, dy))
        }
      }
      return d
    }
    // the openings' halos on their walls: halo: [{ color, reach, power, rect: [s0, h0, s1, h1] }] in the
    // opening's own meters (from its screen-left bottom corner; default its whole rect), from the kit
    const halos = []
    for (const o of Object.values(openings)) for (const hl of o.def?.halo ?? []) {
      const ow = o.to - o.from, oh = o.h[1] - o.h[0], [r0, q0, r1, q1] = hl.rect ?? [0, 0, ow, oh]
      // the rect in absolute coordinates along the wall's axis (u for a wall along u, v for one along v)
      const s0 = o.alongU ? o.base + o.from + r0 : o.base + o.to - r1, s1 = o.alongU ? o.base + o.from + r1 : o.base + o.to - r0
      halos.push({ id: o.id + "_halo", fam: hl.family ?? familyOf(hl.color), reach: hl.reach, power: hl.power ?? 1,
        ax: o.alongU ? 1 : 0, plane: o.plane, nrm: o.alongU ? NRM.v : NRM.u, s0, s1, h0: o.h[0] + q0, h1: o.h[0] + q1 })
    }
    // the zones: each open opening's room behind its wall
    const zones = [null]
    for (const o of Object.values(openings)) if (o.open) { o.zone = zones.length; zones.push(o.id) }
    const ctx = { openings, solids, contact, ceiling, halos, zones }

    // ---- a flight down through the floor (the map's stairs): drawn first, so the floor in front of the
    // hole hides its lower steps
    function drawStairs(B, f) {
      const s = map.stairs, k = KIT.stairs[s.kit] ?? {}, [u0, v0] = s.from, [u1, v1] = s.to
      const n = Math.ceil((u1 - u0) / s.tread) + 1, deep = (n + 1) * s.rise
      const well = k.well ?? (() => "1"), riser = k.riser ?? (() => "2"), tread = k.tread ?? (() => "3")
      G.faceV(B, v0, u0, u1 + s.tread, -deep, 0, (a, e, o) => well(o.s, o.h - deep, { x: o.x, y: o.y, f }))
      for (let i = 0; i < n; i++) {
        const a = u0 + i * s.tread, top = -(i + 1) * s.rise
        G.faceU(B, a, v0, v1, top, top + s.rise, (aa, e, o) => riser(aa, e, i, { x: o.x, y: o.y, f }))
        G.top(B, a, v0, a + s.tread, v1, top, (u, v, x, y) => tread(u - a, v - v0, i, { x, y, f }))
      }
    }
    // ---- the room behind an open opening: its floor, its far and side walls, the props standing in it;
    // drawn into a buffer of its own, of which the opening shows what lies inside it
    function renderBehind(op, f) {
      const B2 = buffer(W, H)
      B2.zoneNow = op.zone
      const d = op.open.depth, side = op.open.side ?? 1.5, wh = op.open.h ?? ceiling
      const fsh = KIT.floor[op.open.floor] ?? (() => "1"), wk = KIT.wall[op.open.wall]
      const wsh = typeof wk === "function" ? wk : wk?.face ?? (() => "2")
      if (op.alongU) {
        const ua = op.base + op.from - side, ub = op.base + op.to + side, v0 = op.plane - d
        G.top(B2, ua, v0, ub, op.plane, 0, (u, v, x, y) => fsh(u, v, { x, y, f, map }))
        G.faceV(B2, v0, ua, ub, 0, wh, (a, e, o) => wsh(o.s, o.h, { a, e, len: ub - ua, H: wh, x: o.x, y: o.y, f, wall: null }))
        G.faceU(B2, ua, v0, op.plane, 0, wh, (a, e, o) => wsh(o.s, o.h, { a, e, len: d, H: wh, x: o.x, y: o.y, f, wall: null }))
      } else {
        const va = op.base + op.from - side, vb = op.base + op.to + side, u0 = op.plane - d
        G.top(B2, u0, va, op.plane, vb, 0, (u, v, x, y) => fsh(u, v, { x, y, f, map }))
        G.faceU(B2, u0, va, vb, 0, wh, (a, e, o) => wsh(o.s, o.h, { a, e, len: vb - va, H: wh, x: o.x, y: o.y, f, wall: null }))
        G.faceV(B2, va, u0, op.plane, 0, wh, (a, e, o) => wsh(o.s, o.h, { a, e, len: d, H: wh, x: o.x, y: o.y, f, wall: null }))
      }
      for (const p of (map.props ?? []).filter((q) => q.behind === op.id)) {
        const k = KIT.prop[p.kit], fallback = [p.at[0] + p.foot[0] / 2, p.at[1] + p.foot[1] / 2, p.h]
        const draw = k?.draw ?? ((pen) => pen.box(p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h, () => "4", () => "3", () => "2"))
        draw(makePen(G, B2, f, fallback), p, f)
      }
      return B2
    }

    // ---- the background: floor, the walls' bodies, their inner faces with the openings, the stubs
    function renderBg(f) {
      const B = buffer(W, H)
      const holes = {}                      // per open opening: the wall's pixels inside it
      if (map.stairs) drawStairs(B, f)
      // the floor, cell by cell (each cell's key picks its shader; the shader sees the floor point)
      map.floor.forEach((row, j) => [...row].forEach((key, i) => {
        if (key === ".") return
        const u0 = i * map.cell, v0 = j * map.cell, sh = KIT.floor[key] ?? (() => "z")
        G.top(B, u0, v0, u0 + map.cell, v0 + map.cell, 0, (u, v, x, y) => sh(u, v, { x, y, f, map }))
      }))
      const memo = {}
      map.walls.forEach((w, wi) => {
        const alongU = w.from[1] === w.to[1]
        const a0 = alongU ? Math.min(w.from[0], w.to[0]) : Math.min(w.from[1], w.to[1])
        const a1 = alongU ? Math.max(w.from[0], w.to[0]) : Math.max(w.from[1], w.to[1])
        const len = a1 - a0, fix = alongU ? w.from[1] : w.from[0]
        const kit = KIT.wall[w.kit], face = typeof kit === "function" ? kit : kit?.face ?? (() => "3")
        const cap = kit?.cap ?? ((inner) => (inner ? "5" : "4"))
        if (w.stub) {
          // a near wall cut to a stub: its top, its section down through the floor slab (toward the viewer)
          const T = thick, hs = stub
          if (alongU) {
            G.faceV(B, fix + T, a0, a1 + T, -slab, hs, (a, e, o) => (o.h < slab - 0.04 ? "1" : o.h < slab ? "2" : "3"), "v")
            G.faceU(B, a1 + T, fix, fix + T, -slab, hs, (a, e, o) => (o.h < slab ? "1" : "2"), "u")
            G.top(B, a0, fix, a1 + T, fix + T, hs, (u, v) => (v < fix + 0.06 ? "5" : "4"))
          } else {
            G.faceU(B, fix + T, a0, a1 + T, -slab, hs, (a, e, o) => (o.h < slab - 0.04 ? "1" : o.h < slab ? "2" : "2"), "u")
            G.faceV(B, a1 + T, fix, fix + T, -slab, hs, (a, e, o) => (o.h < slab ? "1" : "3"), "v")
            G.top(B, fix, a0, fix + T, a1 + T, hs, (u, v) => (u < fix + 0.06 ? "5" : "4"))
          }
          return
        }
        const ops = (map.openings ?? []).filter((o) => o.wall === wi).map((o) => openings[o.id])
        // the wall's body: its cut top (thickness outward), its cut end toward the viewer
        if (alongU) {
          G.top(B, a0 - thick, fix - thick, a1 + thick, fix, w.h, (u, v) => cap(v > fix - 0.07))
          G.faceU(B, a1 + thick, fix - thick, fix, -slab, w.h, (a, e, o) => (o.h < slab ? "1" : "3"), "u")
        } else {
          G.top(B, fix - thick, a0 - thick, fix, a1 + thick, w.h, (u, v) => cap(u > fix - 0.07))
          G.faceV(B, a1 + thick, fix - thick, fix, -slab, w.h, (a, e, o) => (o.h < slab ? "1" : "2"), "v")
        }
        // the inner face: the wall's kit, the openings over it
        const shade = (s, h, o) => {
          for (const op of ops) {
            const pad = op.def?.pad ?? 0, [pl, pb, pr, pt] = typeof pad === "number" ? [pad, pad, pad, pad] : pad
            if (s < op.from - (alongU ? pl : pr) || s >= op.to + (alongU ? pr : pl) || h < op.h[0] - pb || h >= op.h[1] + pt) continue
            const ow = op.to - op.from, oh = op.h[1] - op.h[0]
            const ls = alongU ? s - op.from : op.to - s, lh = h - op.h[0]
            const aw = Math.round(ow * G.SU), ah = Math.round(oh * G.VPM)
            // the opening's top-left on the screen (for a view beyond the glass)
            const [gx, gy] = alongU ? P(op.base + op.from, fix, op.h[1]) : P(fix, op.base + op.to, op.h[1])
            const mk = op.id + ":" + f
            memo[mk] ??= {}
            if (op.open && ls >= 0 && ls < ow && lh >= 0 && lh < oh) (holes[op.id] ??= []).push([o.x, o.y])
            const k = op.def?.paint?.(ls, lh, { a: fl(ls * G.SU), e: fl(lh * G.VPM), w: ow, h: oh, aw, ah, x: o.x, y: o.y, f, gx, gy, memo: memo[mk], op })
            if (k) return k
          }
          return face(s, h, o)
        }
        // s: meters from the wall's `from` (its lower end), a: px from its screen-left end
        if (alongU) G.faceV(B, fix, a0, a1, 0, w.h, (a, e, o) => shade(o.s, o.h, { a, e, len, H: w.h, x: o.x, y: o.y, f, wall: w }))
        else G.faceU(B, fix, a0, a1, 0, w.h, (a, e, o) => shade(len - o.s, o.h, { a, e, len, H: w.h, x: o.x, y: o.y, f, wall: w }))
      })
      // through each open opening, its room (the opening's own paint keeps its frame)
      for (const op of Object.values(openings)) {
        if (!op.open || !holes[op.id]) continue
        const B2 = renderBehind(op, f)
        for (const [x, y] of holes[op.id]) {
          const i = y * W + x
          if (B2.k[i]) {
            B.k[i] = B2.k[i]; B.lit[i] = B2.lit[i]; B.has[i] = B2.has[i]; B.nrm[i] = B2.nrm[i]
            for (let c = 0; c < 3; c++) B.pos[i * 3 + c] = B2.pos[i * 3 + c]
          } else { B.k[i] = "k"; B.has[i] = 0 }
          B.zone[i] = op.zone
        }
      }
      lightPass(B, ctx, lightsOf(map, f))
      if (sheen) sheenPass(B)
      return B
    }
    // glossy floor: the bright things on the back walls (a window's neon, a screen, a strip) show in it
    // faintly, mirrored about the wall's foot, fading with their height (style guide §4, SHEEN)
    function sheenPass(B) {
      const table = sheen.map ?? ISO.SHEEN, reach = sheen.reach ?? 1.2, gloss = sheen.keys ?? null
      const out = []
      for (let y = 0; y < B.H; y++) for (let x = 0; x < B.W; x++) {
        const i = y * B.W + x
        if (!B.k[i] || B.nrm[i] !== NRM.up || B.pos[i * 3 + 2] > 0.01) continue
        const u = B.pos[i * 3], v = B.pos[i * 3 + 1]
        if (gloss && !gloss(u, v)) continue
        // the wall pixel this one mirrors: straight up the screen, as far above the wall's foot as this is below
        for (const w of map.walls) {
          if (w.stub) continue
          const alongU = w.from[1] === w.to[1], plane = alongU ? w.from[1] : w.from[0]
          const s = alongU ? u - v + plane : v - u + plane                     // where the mirror ray meets the wall's foot
          const d = alongU ? v - plane : u - plane
          if (d <= 0 || d > reach) continue
          const my = fl(2 * (G.CY + G.UPM * ((alongU ? s : plane) + (alongU ? plane : s))) - y - 0.5)
          if (my < 0 || my >= B.H) continue
          const j = my * B.W + x, k = B.k[j]
          if (!k || B.nrm[j] !== (alongU ? NRM.v : NRM.u)) continue
          const keys = typeof table === "function" ? table(u, v) : table, to = keys && keys[k]
          if (to && bay(x + 2, y + 1) < 0.85 * (1 - d / reach)) { out.push([i, to]); break }
        }
      }
      for (const [i, k] of out) B.k[i] = k
    }
    const BG = []
    for (let f = 0; f < frames; f++) BG.push(renderBg(f))
    anim(`${id}_bg`, { w: W, h: H, frames, fps }, (c) => { c.rect(0, 0, W, H, bg); blit(c, BG[c.frame ?? 0]) }, ...glows)

    // ---- the props: each drawn where it stands, lit, cut to its box, outlined, pivot bottom-centre
    const props = {}
    for (const p of map.props ?? []) {
      if (p.behind) continue                                  // baked into the picture, through its opening
      const k = KIT.prop[p.kit]
      const fallback = [p.at[0] + p.foot[0] / 2, p.at[1] + p.foot[1] / 2, p.h]
      const draw = k?.draw ?? ((pen) => pen.box(p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h, () => "4", () => "3", () => "2"))
      // a prop is animated when its kit says so, or when a stuttering light lies on it
      const renderProp = (f) => {
        const B = buffer(W, H)
        draw(makePen(G, B, f, fallback), p, f)
        lightPass(B, ctx, lightsOf(map, f))
        return B
      }
      const F0 = renderProp(0)
      let nf = k?.frames > 1 ? frames : 1
      if (nf === 1) {
        const lit0 = lightsOf(map, 0).filter((L) => L.stutters)
        // does a stuttering light reach it? (any lit pixel within its reach)
        outer: for (let i = 0; i < F0.k.length; i++) if (F0.k[i] && F0.has[i] && F0.lit[i]) {
          const q = [F0.pos[i * 3], F0.pos[i * 3 + 1], F0.pos[i * 3 + 2]]
          for (const L of lit0) if (intensity(L, q, NVEC[F0.nrm[i]], ctx) > 0.12) { nf = frames; break outer }
        }
      }
      const BF = [F0]
      for (let f = 1; f < nf; f++) BF.push(renderProp(f))
      // its box over all its frames
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const B of BF) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (B.k[y * W + x]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
      if (x0 === Infinity) continue
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1, name = `${id}_${p.id}`
      const paint = (c) => blit(c, BF[(c.frame ?? 0) % BF.length], x0, y0)
      const opts = { w: bw, h: bh, pivot: "bottom", ...(k?.outline === false ? {} : { outline: "k" }) }
      if (nf > 1) anim(name, { ...opts, frames: nf, fps }, paint, ...(k?.glows ?? []))
      else sprite(name, opts, paint, ...(k?.glows ?? []))
      // the outline grows it 1 px all round; the engine anchors it bottom-centre
      const bx = x0 - 1, by = y0 - 1, w = bw + 2, h = bh + 2
      props[p.id] = { name, box: [bx, by, w, h], at: [bx + fl(w / 2), by + h], frames: nf }
    }
    const layout = ISOMAP.layout(map)
    for (const [pid, d] of Object.entries(props)) if (layout.props[pid]) Object.assign(layout.props[pid], { at: d.at, box: d.box, sprite: d.name })
    return { map, P, props, layout, G, ctx }
  }

  return { KIT, TINT, SHADE, familyOf, floor, wall, opening, prop, stairs, grid, first, raster, bake, intensity, lightsOf, buffer, geometry, makePen, lightPass }
})()
