// The Drain Market from above at its decided size (kapitel1-design §9, 2026-11-11): 1280x720, 4x4 screens, about 40 px a metre,
// the people at their own size (Juno 13 px across, art/characters/juno_top.px.js). BLOCKS of the ground for the user's approval
// before anything is painted: draft F's layout (art/test/drain_market_f_oben.px.js), every shape of it worked out again at twice the
// size (its ground sampled at x/2, y/2, so the edges are as fine as the new size and the places stay where the user approved them).
//
//   markt_oben_blocks        the levels as flat tones, higher lighter: the rim (the Ninth's street level, 4.4 m), the channel walls
//                            stepped down, the two terraces (2.2 m), the bed (0), the food deck (0.8), the canal (-0.8), the shaft
//                            of the stairs down (Chapter 2); the stairs as steps; the stalls as blocks in their tarps' colours with
//                            their signs; the story's places named; Juno at her size where she arrives and by Ratz's stall
//   markt_oben_blocks_lauf   the same with where Juno can walk (cyan dots), the free ring round the preacher (nobody of the crowd
//                            stands in it) and the 4x4 screens (320x180 each) as a grid
// Labels are German: this is a review sheet, never in the game.
include("drain_market_f_oben.px.js", { palette: true })
include("../characters/juno_top.px.js")

const MOB = (() => {
  const W = 1280, H = 720, S = 2, F = DMF
  const g = (x, y) => F.ground((x + 0.5) / S, (y + 0.5) / S)
  // the levels' tones, higher lighter (the walls stepped between them)
  const TONE = { rim: "5", terr: "X", bed: "z", deck: "p", canal: "8", shaft: "1", tunnel: "k", niche: "J" }
  const wallTone = (h) => (h > 3.3 ? "4" : h > 2.2 ? "3" : h > 1.1 ? "2" : "1")
  const TARP = { g: "=", g2: "+", v: "@", m: "(", s: "4", r: "<", clinic: "^" }
  const HUE = { w: "Q", m: "m", c: "v", r: "q" }

  /** what lies under a pixel: its kind, and whether Juno can stand there */
  const KIND = new Array(W * H)
  const OCC = F.OCC.map(([x0, y0, x1, y1]) => [x0 * S, y0 * S, x1 * S, y1 * S])
  const onBridge = (x, y) => F.BRIDGES.some((bx) => Math.abs(x / S - bx) <= 6 && Math.abs(y / S - F.yw(x / S)) <= F.CW + 3)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) KIND[y * W + x] = onBridge(x, y) ? { h: 0, k: "bridge" } : g(x, y)
  const walkable = (x, y) => {
    const k = KIND[y * W + x].k
    if (!(k === "bed" || k === "terr" || k === "deck" || k === "stair" || k === "bridge" || k === "niche")) return false
    if (k === "niche" && y / S > F.yc(x / S) + 108 + 4) return false            // the curtain itself: Sable's booth is behind it
    return !OCC.some(([x0, y0, x1, y1]) => x >= x0 && x < x1 && y >= y0 && y < y1)
  }

  const ground = (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const { h, k } = KIND[y * W + x]
      let t = k === "wall" ? wallTone(h) : k === "stair" ? (Math.floor(h * 10 / 3) % 2 ? "6" : "5") : k === "bridge" ? ((y >> 1) % 3 === 2 ? "o" : "p") : TONE[k] ?? "z"
      // an edge where the level changes: a lighter lip on the higher side, so the drops read
      const below = y + 1 < H ? KIND[(y + 1) * W + x].h : h, right = x + 1 < W ? KIND[y * W + x + 1].h : h
      if (k !== "stair" && k !== "bridge" && (h - below > 0.3 || h - right > 0.3)) t = "6"
      c.px(x, y, t)
    }
  }
  const things = (c) => {
    const box = (x, y, w, h, k, edge = "k") => { c.rect(x * S - 1, y * S - 1, w * S + 2, h * S + 2, edge); c.rect(x * S, y * S, w * S, h * S, k) }
    for (const s of F.STALLS) {
      box(s.x, s.y, s.w, s.h, TARP[s.tarp] ?? "4")
      const fy = s.face === "s" ? (s.y + s.h) * S - 6 : s.y * S + 2                           // the counter's side
      c.rect(s.x * S + 2, fy, s.w * S - 4, 4, "E")
      if (s.sign) TXT.draw(c, (s.x + s.w / 2) * S, (s.y + s.h / 2) * S - 3, s.sign[0], HUE[s.sign[1]] ?? "W", { font: "hud", align: "center" })
    }
    const R = F.RATZ; box(R.x, R.y, R.w, R.h, "C"); TXT.draw(c, (R.x + R.w / 2) * S, (R.y + R.h / 2) * S - 3, "RATZ", "W", { font: "hud", align: "center" })
    const K = F.WOK; box(K.x, K.y, K.w, K.h, "P"); TXT.draw(c, (K.x + K.w / 2) * S, (K.y + K.h / 2) * S - 3, "GARKÜCHE + RADIO", "W", { font: "hud", align: "center" })
    for (const [x, y] of F.TABLES) { c.rect((x - 6) * S, (y - 5) * S, 12 * S, 10 * S, "k"); c.rect((x - 6) * S + 1, (y - 5) * S + 1, 12 * S - 2, 10 * S - 2, "E") }
    for (const r of F.RAFTS) box(r.x, r.y, r.w, 12, "F")
    c.ellipse(F.PIL.x * S, F.PIL.y * S, F.PIL.r * S, F.PIL.r * S, "k"); c.ellipse(F.PIL.x * S, F.PIL.y * S, F.PIL.r * S - 2, F.PIL.r * S - 2, "4")
    TXT.draw(c, F.PIL.x * S, F.PIL.y * S - 3, "PFEILER", "6", { font: "hud", align: "center" })
    const A = F.AD; c.rect(A.x * S, A.y * S, A.w * S, A.h * S, "T"); TXT.draw(c, (A.x + A.w / 2) * S, (A.y + A.h / 2) * S - 3, "LULL (PROJEKTION)", "V", { font: "hud", align: "center" })
    // the preacher on his crate
    const px = F.PREACH.x * S, py = F.PREACH.y * S
    c.rect(px - 8, py - 6, 16, 12, "k"); c.rect(px - 7, py - 5, 14, 10, "p"); c.ellipse(px, py, 4, 4, "?")
    TXT.draw(c, px, py - 16, "PREDIGER", "?", { font: "hud", align: "center" })
    // the story's places named
    const name = (x, y, t, k = "W") => TXT.draw(c, x, y, t, k, { font: "hud", align: "center" })
    name((F.ARR[0] + F.ARR[1]) / 2 * S, 70, "TREPPE HINAUF ZUR GASSE", "m")
    name((F.SHAFT[0] + F.SHAFT[1]) / 2 * S, (F.yc((F.SHAFT[0] + F.SHAFT[1]) / 2) + 40) * S, "TREPPE HINAB (KAP. 2, ZU)", "q")
    name((F.NICHE[0] + F.NICHE[1]) / 2 * S, (F.yc(578) + 122) * S, "VORHANG: SABLE", "m")
    for (const bx of F.BRIDGES) name(bx * S, (F.yw(bx) + F.CW + 6) * S, "STEG", "6")
    name(380, 20, "RAND: DIE DÄCHER AN DER STRASSE DES NEUNTEN (4,4 M)", "6")
    name(380, 660, "RAND: DIE DÄCHER AN DER STRASSE DES NEUNTEN (4,4 M)", "6")
    const lvl = (x, d, t) => name(x * S, (F.yc(x) + d) * S, t, "6")
    lvl(410, -104, "NORD 2,2 M"); lvl(270, 40, "BODEN 0 M"); lvl(520, 36, "BODEN 0 M")
    lvl(256, 92, "SÜD 2,2 M"); name(470 * S, F.yw(470) * S - 3, "KANAL -0,8 M", "6")
    name(226 * S, 236 * S, "DECK (0,8 M)", "6")
    // Juno at her size: where she comes down, and by Ratz
    for (const [x, y, d] of [[(F.ARR[0] + F.ARR[1]) / 2 * S, (F.nTer(78) + 8) * S, "down"], [(R.x + R.w / 2) * S, (R.y + R.h + 9) * S, "up"]]) c.stamp(`juno_top_idle_${d}`, Math.round(x) - 10, Math.round(y) - 10)
  }
  const lauf = (c) => {
    // where Juno can walk: a dot in a loose grid
    for (let y = 0; y < H; y += 4) for (let x = (y >> 2) & 1 ? 3 : 0; x < W; x += 6) if (walkable(x, y)) c.px(x, y, "v")
    // the free ring round the preacher (1.5 m): the crowd stands at its edge
    const px = F.PREACH.x * S, py = F.PREACH.y * S
    for (let a = 0; a < 64; a++) c.px(Math.round(px + Math.cos(a / 64 * Math.PI * 2) * 60), Math.round(py + Math.sin(a / 64 * Math.PI * 2) * 60), "?")
    // the 4x4 screens
    for (let x = 320; x < W; x += 320) for (let y = 0; y < H; y += 3) c.px(x, y, "N")
    for (let y = 180; y < H; y += 180) for (let x = 0; x < W; x += 3) c.px(x, y, "N")
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) TXT.draw(c, i * 320 + 4, j * 180 + 4, `BILD ${j * 4 + i + 1}`, "N", { font: "hud" })
  }
  return { W, H, ground, things, lauf }
})()

sprite("markt_oben_blocks", { w: MOB.W, h: MOB.H }, MOB.ground, MOB.things)
sprite("markt_oben_blocks_lauf", { w: MOB.W, h: MOB.H }, MOB.ground, MOB.things, MOB.lauf)
