// Glass Sister's iso maps: a street-mode room described as a map (docs/ideas/iso-tiles.md, style guide §4), and
// the geometry the bake and the game need from it. Pure JavaScript, no pxl and no engine: the art includes
// it (art/lib/isokit.js draws a map) and Node loads it (tools/iso-layout.mjs writes the measured layout).
//
// A map (art/rooms/<id>.map.js: ISO_MAPS.<id> = {...}), every length in meters:
//   size: [U, V]        the floor: U along the right back wall (u), V along the left one (v)
//   cell: 0.5           the floor grid; floor rows are strings of kit keys, one character per cell
//   floor: [...]        one string per row of v (v = 0 first), one key per cell of u ("." no floor)
//   at: [CX, CY]        the back corner at the foot of the walls, on the screen
//   screen: [w, h]      the picture's size (the room may be bigger than the screen: it scrolls)
//   walls: [{ from: [u, v], to: [u, v], h, kit, stub }]
//                       a wall on a line of constant u or v; its inner face is the one toward the viewer
//                       (+u or +v); `stub`: a near wall cut to the slab (drawn a few px high)
//   openings: [{ wall: i, from, to, h: [h0, h1], kit, id }]
//                       a door or a window in wall i, from..to meters along it
//   props: [{ id, kit, at: [u, v], foot: [du, dv], h, block }]
//                       a thing from the kit standing on its footprint; `block: false` lets people walk
//                       through it (a rug); `seeThrough: true` goes to the game's prop (the engine draws it
//                       see-through over a person it hides: an umbrella over a cart); `standOn: true`: its
//                       top at h is a floor: a person standing up there counts as in front of it (the
//                       front line runs along the top's back edge), while its order among the props
//                       stays that of its foot; the person's place is a spot with h, and the actor needs
//                       a walkTo on the floor
//   stairs: { id, kit, from: [u, v], to: [u, v], down: "+u", rise, tread }
//                       a flight going down through a hole in the floor (its cells "."), from the top step
//                       at from[0] along +u and on under the floor past the hole (the bake draws it; the
//                       walk area ends at its edge)
//   openings may be open: { open: { depth, floor, wall } } shows a room behind the wall through it, depth
//                       meters deep, its floor and walls from the kit; props with { behind: <opening id> }
//                       stand in it (baked into the picture, seen only through the opening)
//   nowalk: [[u, v, du, dv], ...]  floor that is drawn but not walked (a corner the screen's edge cuts off)
//   spots: { name: [u, v, face, h] }  where people stand and look (the game's places); h: on a step
//                       above or below the floor (meters, default 0)
//   lights: [{ id, at: [u, v, h], r, power, color, flicker }]
//   margin: 0.2         how far feet keep from walls and props
"use strict";

/** @type {Record<string, any>} */
var ISO_MAPS = typeof ISO_MAPS === "undefined" ? {} : ISO_MAPS;

const ISOMAP = (function () {
  const UPM = 16, VPM = 30                     // the scale (style guide §4): units per meter of floor, px per meter of height

  /** The projection of a map: meters to the screen. */
  function projector(map) {
    const [CX, CY] = map.at
    /** @param {number} u @param {number} v @param {number} [h] meters */
    const P = (u, v, h = 0) => [Math.round(CX + 2 * (u - v) * UPM), Math.round(CY + (u + v) * UPM - h * VPM)]
    /** the floor point (meters) under a screen point */
    const uvAt = (x, y) => { const a = (x - CX) / (2 * UPM), b = (y - CY) / UPM; return [(a + b) / 2, (b - a) / 2] }
    return { P, uvAt, UPM, VPM }
  }

  /**
   * The walkable floor as loops of (u, v) meters: the floor's cells, minus the blocking props' footprints
   * and the walls, shrunk by the margin; traced on a grid of 1/16 m. Outer loops walk, inner ones are holes.
   */
  function walkLoops(map) {
    const q = 1 / UPM, [U, V] = map.size, nu = Math.round(U / q), nv = Math.round(V / q), m = map.margin ?? 0.2
    const cellOf = (u, v) => map.floor[Math.floor(v / map.cell)]?.[Math.floor(u / map.cell)] ?? "."
    const open = new Uint8Array(nu * nv)
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const u = (i + 0.5) * q, v = (j + 0.5) * q
      let ok = cellOf(u, v) !== "."
      for (const w of map.walls ?? []) {                      // walls stand on their line; keep feet off them
        const alongU = w.from[1] === w.to[1]
        const [a0, a1] = alongU ? [Math.min(w.from[0], w.to[0]), Math.max(w.from[0], w.to[0])] : [Math.min(w.from[1], w.to[1]), Math.max(w.from[1], w.to[1])]
        const along = alongU ? u : v, across = alongU ? v - w.from[1] : u - w.from[0]
        if (along > a0 - m && along < a1 + m && Math.abs(across) < m) ok = false
      }
      for (const [u0, v0, du, dv] of map.nowalk ?? []) if (u > u0 && u < u0 + du && v > v0 && v < v0 + dv) ok = false
      for (const p of map.props ?? []) {
        if (p.block === false || p.behind) continue
        if (u > p.at[0] - m && u < p.at[0] + p.foot[0] + m && v > p.at[1] - m && v < p.at[1] + p.foot[1] + m) ok = false
      }
      open[j * nu + i] = ok ? 1 : 0
    }
    // the boundary between open and closed grid cells, as directed edges (open on the left), chained into loops
    const at = (i, j) => i >= 0 && j >= 0 && i < nu && j < nv && open[j * nu + i] === 1
    /** @type {Map<string, [number, number][]>} */
    const next = new Map(), key = (i, j) => i + "," + j
    const edge = (a, b) => { const k = key(...a); if (!next.has(k)) next.set(k, []); next.get(k).push(b) }
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      if (at(i, j) && !at(i, j - 1)) edge([i, j], [i + 1, j])            // top edge, going +u
      if (at(i, j) && !at(i + 1, j)) edge([i + 1, j], [i + 1, j + 1])    // the +u side, going +v
      if (at(i, j) && !at(i, j + 1)) edge([i + 1, j + 1], [i, j + 1])    // the +v side, going -u
      if (at(i, j) && !at(i - 1, j)) edge([i, j + 1], [i, j])            // the -u side, going -v
    }
    const loops = []
    while (next.size) {
      const [k0] = next.keys(), start = k0.split(",").map(Number), loop = [start]
      let cur = start, prevDir = null
      for (;;) {
        const k = key(...cur), outs = next.get(k)
        if (!outs) break
        // at a pinch point two edges leave a corner: take the one that turns right of where we came from
        let pick = 0
        if (outs.length > 1 && prevDir) pick = outs.findIndex((o) => (prevDir[0] * (o[1] - cur[1]) - prevDir[1] * (o[0] - cur[0])) > 0)
        if (pick < 0) pick = 0
        const nxt = outs.splice(pick, 1)[0]
        if (!outs.length) next.delete(k)
        prevDir = [nxt[0] - cur[0], nxt[1] - cur[1]]
        if (nxt[0] === start[0] && nxt[1] === start[1]) break
        loop.push(nxt); cur = nxt
      }
      // drop points in the middle of straight runs
      const simple = loop.filter((p, i) => {
        const a = loop[(i + loop.length - 1) % loop.length], b = loop[(i + 1) % loop.length]
        return (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0]) !== 0
      })
      let area = 0
      simple.forEach((p, i) => { const r = simple[(i + 1) % simple.length]; area += p[0] * r[1] - r[0] * p[1] })
      loops.push({ pts: simple.map(([i, j]) => [i * q, j * q]), outer: area > 0 })
    }
    return loops
  }

  /** The game's numbers, measured from the map: walk area and holes (screen points, clipped to the picture
   * by the engine's walk code), each prop's place, front line and baseline, the spots, the lamps. */
  function layout(map) {
    const { P } = projector(map)
    const loops = walkLoops(map)
    // the walk area ends a little above the picture's bottom edge (a room the size of the screen cuts its
    // floor's front off there): each loop clipped to y <= bottom (Sutherland-Hodgman on one edge)
    const bottom = (map.screen?.[1] ?? 180) - 4
    const clip = (pts) => {
      const sp = pts.map(([u, v]) => P(u, v)), out = []
      sp.forEach((a, i) => {
        const b = sp[(i + 1) % sp.length], ina = a[1] <= bottom, inb = b[1] <= bottom
        if (ina) out.push(a)
        if (ina !== inb) out.push([Math.round(a[0] + (b[0] - a[0]) * (bottom - a[1]) / (b[1] - a[1])), bottom])
      })
      return out.flat()
    }
    const props = {}
    for (const p of map.props ?? []) {
      const [u0, v0] = p.at, [du, dv] = p.foot, ext = 0.6         // each front edge carried on past its corner
      const fv = p.standOn ? v0 : v0 + dv, fh = p.standOn ? p.h : 0
      props[p.id] = {
        front: [...P(u0 - ext, fv, fh), ...P(u0, fv, fh), ...P(u0 + du, fv, fh), ...P(u0 + du, v0, fh), ...P(u0 + du, v0 - ext, fh)],
        baseline: P(u0 + du, v0 + dv)[1],
        // the silhouette of the box it stands in (a hotspot's shape)
        poly: [P(u0, v0, p.h), P(u0 + du, v0, p.h), P(u0 + du, v0), P(u0 + du, v0 + dv), P(u0, v0 + dv), P(u0, v0 + dv, p.h)].flat(),
        ...(p.seeThrough ? { seeThrough: true } : {}),
      }
    }
    // each opening's screen rect (its corners on the wall, 1 px round): a hotspot's shape
    const openings = {}
    for (const o of map.openings ?? []) {
      const w = map.walls[o.wall], alongU = w.from[1] === w.to[1]
      const pt = (s, h) => (alongU ? P(w.from[0] + s, w.from[1], h) : P(w.from[0], w.from[1] + s, h))
      const pts = [pt(o.from, o.h[0]), pt(o.to, o.h[0]), pt(o.from, o.h[1]), pt(o.to, o.h[1])], xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1])
      openings[o.id] = [Math.min(...xs) - 1, Math.min(...ys) - 1, Math.max(...xs) - Math.min(...xs) + 3, Math.max(...ys) - Math.min(...ys) + 3]
    }
    const spots = {}, face = {}
    for (const [k, [u, v, f, h]] of Object.entries(map.spots ?? {})) { spots[k] = P(u, v, h ?? 0); if (f) face[k] = f }
    const lamps = (map.lights ?? []).map((l) => ({ ...l, at: P(...l.at) }))
    return { walk: loops.filter((l) => l.outer).map((l) => clip(l.pts)).filter((l) => l.length >= 6),
      holes: loops.filter((l) => !l.outer).map((l) => clip(l.pts)).filter((l) => l.length >= 6), props, openings, spots, face, lamps }
  }

  return { UPM, VPM, projector, walkLoops, layout }
})();
