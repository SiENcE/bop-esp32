// The Drain Market's people seen straight down, as BLOCKS for the user's approval before they are painted (way A of Juno from above,
// decided 2026-11-11: 13 px across the shoulders, the market at about 40 px a metre). Every figure is drawn in its own frame
// (f forward, s to its left) and turned, so the four directions are one figure; light from the top left, laid on after the turn.
//
//   Ratz (#90d0a0), the cable rat, on his crate: the olive parka far too big, its hood up and his ears through two holes in it, the grey
//     snout out of the hood with its pink nose, the headphones round his neck over the speech collar (bright when he talks), the tail
//     with the old plug at its end; idle: the nose twitching, the plug swinging; talking: the collar bright, the snout open
//   the preacher (#d8c8a0) of the Waking Church, a gecko, on his crate: thin shoulders in the beige coat, the gecko head with its two
//     big amber eyes and the rust crest, a thermos in each hand held out to the sides; idle: the tongue licking an eye; talking: the
//     flasks raised. His counter of days awake (9, 10, 11) can't be seen from above on his chest: it moves to a display on the crate's
//     front, facing the market.
//   vendors behind their counters (an apron, a cap with a visor, a hood), working: hands going at the counter, a look up
//   extras, the crowd: four bodies (ordinary, broad, thin, a child) and four things carried (an umbrella with an LED rim, a backpack,
//     a bowl of noodles with its steam, a crate on the shoulder), coats and hair from draft F's crowd so any can be recoloured;
//     standing: small idles out of step (a look to one side, a shift of the shoulders, a hand), turning now and then; walking: 8 frames
// Sheets: markt_figuren_blatt (every figure and pose); probes: markt_figuren_probe_ratz, markt_figuren_probe_prediger, 320x180
// windows of the painted market (art/rooms/drain_market.px.js) with the figures placed (the preacher's ring of 1.5 m kept free).
include("juno_oben_blocks.px.js", { palette: true })
include("../characters/juno_top.px.js")
include("../characters/markt_people.px.js")                     // the painted people, for the probes markt_people_probe_*
// the painted market as built (sh tools/build_art.sh room drain_market first): its own file can't be included beside the drafts
sprite("_mfb_bg", { png: "../../build/art/rooms/drain_market/sprites/drain_market_bg.png" })
sprite("_mfb_over", { png: "../../build/art/rooms/drain_market/sprites/drain_market_over.png" })

const MFB = (() => {
  const TURN = { down: (f, s) => [s, f], up: (f, s) => [-s, -f], right: (f, s) => [f, -s], left: (f, s) => [-f, s] }
  const STEP = [5, 3, 0, -3, -5, -3, 0, 3], ARM = [-2, -1, 0, 1, 2, 1, 0, -1]
  const hs = (a, b) => { let h = Math.imul(a + 1, 374761393) ^ Math.imul(b + 7, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

  /** a figure's parts in its own frame, turned: set(f, s, colour) and ell(...) write the colour straight (blocks: flat tones) */
  const canvas = (dir) => {
    const m = new Map(), T = TURN[dir]
    const set = (f, s, k) => { const [x, y] = T(Math.round(f), Math.round(s)); m.set(x + "," + y, k) }
    const ell = (cf, cs, rf, rs, k) => {
      for (let f = Math.floor(cf - rf - 1); f <= Math.ceil(cf + rf + 1); f++) for (let s = Math.floor(cs - rs - 1); s <= Math.ceil(cs + rs + 1); s++) {
        const a = (f - cf) / (rf + 0.5), b = (s - cs) / (rs + 0.5); if (a * a + b * b <= 1) set(f, s, k)
      }
    }
    const line = (f0, s0, f1, s1, k) => { const n = Math.max(Math.abs(f1 - f0), Math.abs(s1 - s0), 1); for (let j = 0; j <= n; j++) set(f0 + (f1 - f0) * j / n, s0 + (s1 - s0) * j / n, k) }
    return { m, set, ell, line }
  }
  /** lay it down at (x, y), its ink outline round it (a lit edge to the top left on the coat's colour only) */
  const lay = (c, C, x, y, lit) => {
    for (const key of C.m.keys()) {
      const [px, py] = key.split(",").map(Number)
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!C.m.has((px + dx) + "," + (py + dy))) c.px(x + px + dx, y + py + dy, "k")
    }
    for (const [key, k] of C.m) {
      const [px, py] = key.split(",").map(Number)
      const edge = !C.m.has((px - 1) + "," + py) || !C.m.has(px + "," + (py - 1))
      c.px(x + px, y + py, lit && edge && lit[k] ? lit[k] : k)
    }
  }

  // ---------------------------------------------------------------- the crowd's bodies
  const COATS = [["#232f47", "#2f3e5a"], ["#30264c", "#4d3f78"], ["#552b1c", "#b0602a"], ["#203c36", "#30594b"], ["#3e1240", "#a8238a"],
    ["#4e3526", "#74513a"], ["#2e1220", "#73304a"], ["#41547a", "#617aa0"], ["#7a3e22", "#b0602a"], ["#b9c6d8", "#e8ecf2"]]
  const HAIRLIT = { "#0c0e1a": "#2f3e5a", "#131a2a": "#41547a", "#2e2019": "#74513a", "#4e3526": "#9c7048", "#93583f": "#d79676", "#7d8ca4": "#b9c6d8", "#74513a": "#9c7048" }
  const HAIR = ["#0c0e1a", "#131a2a", "#2e2019", "#4e3526", "#93583f", "#7d8ca4", "#74513a"]
  const BODY = { ordinary: [3, 5.4], broad: [3.4, 6.4], thin: [2.6, 4.6], child: [2.2, 3.8] }
  /**
   * one of the crowd: o.body, o.coat [mid, lit], o.hair, o.hood, o.carry ("umbrella" | "backpack" | "bowl" | "crate"), o.walk (frame) or
   * o.idle (frame of its idle: 0 still, 1 a look to its left, 2 a shrug, 3 a look to its right), o.apron (a vendor's)
   */
  const person = (c, x, y, dir, o) => {
    const C = canvas(dir), [rf, rs] = BODY[o.body ?? "ordinary"], [mid, lit] = o.coat
    const w = o.walk !== undefined, i = o.walk ?? 0, foot = w ? STEP[i] * rf / 3 : 0, al = w ? ARM[i] : 0
    const look = !w && o.idle === 1 ? 1 : !w && o.idle === 3 ? -1 : 0, shrug = !w && o.idle === 2 ? 0.6 : 0
    C.ell(foot + (w ? 0 : 1), 2 * rs / 5.4, 1.5, 0.9, "#232f47"); C.ell(-foot + (w ? 0 : 1), -2 * rs / 5.4, 1.5, 0.9, "#232f47")   // boots
    if (o.carry === "backpack") C.ell(-rf - 1, 0, 2, rs * 0.6, "#41547a")
    C.ell(0, 0, rf, rs + shrug, mid)
    if (o.apron) C.ell(1, 0, rf - 1, rs - 2, o.apron)
    C.ell(al, rs + 0.6, 1.5, 0.8, mid); C.ell(-al, -rs - 0.6, 1.5, 0.8, mid)                                  // arms
    if (al >= 1) C.set(al + 2, rs + 0.6, "#d79676"); if (-al >= 1) C.set(-al + 2, -rs - 0.6, "#d79676")
    if (o.carry === "bowl") { C.ell(rf + 1, 0, 1.2, 1.6, "#e8ecf2"); C.set(rf + 1, 0, "#eea040"); C.set(rf + 2, 1, "#d79676"); C.set(rf + 2, -1, "#d79676") }
    if (o.carry === "crate") { for (let f = -3; f <= 2; f++) for (let s = rs - 2; s <= rs + 3; s++) C.set(f, s, (f + s) % 3 ? "#74513a" : "#4e3526") }
    const hr = o.body === "child" ? 1.6 : 2.2
    if (o.hood) C.ell(-0.4, 0, hr + 0.4, hr + 0.4, o.hood)
    else C.ell(-0.2, 0, hr, hr, o.hair)
    C.set(Math.round(hr), look, o.hood ? "#1a2337" : "#93583f")                                                // the face's edge, its way
    lay(c, C, x, y, { [mid]: lit, [o.hood ?? ""]: o.coat[1], [o.hair]: HAIRLIT[o.hair] ?? "#41547a" })
    if (o.carry === "umbrella") {
      // over the figure: a disc of fabric with its ribs and an LED rim (cyan: tech), the figure under it barely showing
      const r = 9
      for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
        const d = Math.hypot(xx, yy)
        if (d > r + 0.5) continue
        const k = d > r - 0.6 ? ((Math.atan2(yy, xx) * 16 / Math.PI | 0) % 2 ? "#62def0" : "#123c4e") : (xx === 0 || yy === 0 || Math.abs(xx) === Math.abs(yy)) ? "#1a2337" : o.coat[0]
        c.px(x + xx, y - 2 + yy, k)
      }
      c.px(x - 3, y - 6, o.coat[1]); c.px(x, y - 2, "#8e96a8")
    }
  }
  const look = (seed) => ({ coat: COATS[Math.floor(hs(seed, 1) * COATS.length)], hair: HAIR[Math.floor(hs(seed, 2) * HAIR.length)],
    hood: hs(seed, 3) < 0.25 ? COATS[Math.floor(hs(seed, 4) * COATS.length)][0] : null,
    body: ["ordinary", "ordinary", "ordinary", "broad", "thin", "thin", "child"][Math.floor(hs(seed, 5) * 7)],
    carry: hs(seed, 6) < 0.05 ? "umbrella" : hs(seed, 6) < 0.12 ? "backpack" : hs(seed, 6) < 0.2 ? "bowl" : hs(seed, 6) < 0.24 ? "crate" : null })

  // ---------------------------------------------------------------- Ratz
  const RZ = { parka: "#6a7440", parkaLit: "#7e8a4e", parkaDark: "#485028", fur: "#8a8a92", furLit: "#a8a8b0", pink: "#e8a8b0", pinkDark: "#a06a72",
    phones: "#2a2a30", collar: "#90d0a0", collarOn: "#d8ffe0", plug: "#d0d4da" }
  const NOSE = [0, 0, 1, 0, 1, 0]
  /** Ratz sitting, his feet's middle at (x, y); o.talk (frame), o.idle (frame) */
  const ratz = (c, x, y, dir, o = {}) => {
    const C = canvas(dir), i = o.idle ?? 0, talk = o.talk !== undefined, open = talk && o.talk % 2 === 0
    // the tail with its plug, curling back over the crate, swinging
    const sw = [0, 1, 2, 1, 0, -1][i % 6]
    C.line(-5, 0, -9, 3 + sw, RZ.pinkDark); C.line(-9, 3 + sw, -12, 2 + sw, RZ.pinkDark)
    C.ell(-13, 2 + sw, 1, 1, RZ.plug); C.set(-14, 2 + sw, RZ.phones)
    // the parka, far too big: a round heap; the hood up
    C.ell(-1, 0, 5, 5.5, RZ.parka); C.ell(-1, 0, 4, 4.5, RZ.parkaLit)
    C.ell(-2, 0, 4.2, 4.2, RZ.parkaDark)                                                                          // the hood's rim
    C.ell(-2, 0, 3.4, 3.4, RZ.parka)
    // the ears through the hood's holes, the snout out of it, the nose
    C.ell(-3, 3, 1, 1, RZ.pink); C.ell(-3, -3, 1, 1, RZ.pink)
    const n = NOSE[i % 6]
    C.ell(2 + n, 0, 1.6, 1.4, RZ.fur); C.ell(3 + n, 0, 0.6, 0.8, RZ.furLit); C.set(4 + n, 0, RZ.pink)
    if (open) C.set(3 + n, 1, "#2a2a30")
    // the headphones round his neck over the collar; the collar's glow
    C.line(0, -3, 0, 3, talk ? RZ.collarOn : RZ.collar); C.set(0, -4, RZ.phones); C.set(0, 4, RZ.phones)
    lay(c, C, x, y)
  }

  // ---------------------------------------------------------------- the preacher
  const PR = { coat: "#a69670", coatLit: "#d8c8a0", skin: "#a89a5e", eye: "#eea040", eyeLit: "#ffd58a", crest: "#b8682c", flask: "#a8b4c4", tongue: "#e888a8" }
  const LICK = [0, 0, 0, 0, 1, 2, 1, 0]
  /** the preacher on his crate, (x, y) the crate's middle; o.idle (0..7), o.talk (0..1) */
  const prediger = (c, x, y, dir, o = {}) => {
    const C = canvas(dir), talk = o.talk === 1, lick = LICK[o.idle ?? 0]
    // the thermoses held out to the sides (raised: further out and forward when he preaches)
    const out = talk ? 10 : 9, fw = talk ? 2 : 0
    C.line(0, 5, fw, out - 1, PR.coat); C.line(0, -5, fw, -out + 1, PR.coat)
    for (const s of [out, -out]) { C.ell(fw, s, 1.6, 1.6, PR.flask); C.set(fw, s, PR.eye) }
    C.ell(0, 0, 3, 5, PR.coat)                                                                                    // thin shoulders (up on his crate he is nearer)
    // the gecko head: its crest down the middle, the two big amber eyes bulging at the front corners
    C.ell(0.5, 0, 2.8, 2.8, PR.skin)
    C.line(-3, 0, 1, 0, PR.crest)
    for (const s of [2.4, -2.4]) { C.ell(2.4, s, 1.4, 1.4, PR.eye); C.set(2.4, s, PR.eyeLit) }
    if (lick) C.line(4, 0, 4, lick + 1, PR.tongue)
    lay(c, C, x, y, { [PR.coat]: PR.coatLit })
  }
  /** the preacher's crate and its counter of days, facing the market (south) */
  const kiste = (c, x, y, days) => {
    c.rect(x - 9, y - 7, 18, 14, "k"); c.rect(x - 8, y - 6, 16, 12, "p"); c.hline(x - 8, y - 6, 16, "E")
    c.rect(x - 5, y + 5, 10, 6, "k"); c.rect(x - 4, y + 6, 8, 4, "c")
    TXT.draw(c, x, y + 6, String(days), "v", { font: "hud", align: "center" })
  }

  return { person, look, ratz, prediger, kiste, hs }
})()

// ---------------------------------------------------------------- the sheet
sprite("markt_figuren_blatt", { w: 320, h: 230 }, (c) => {
  c.rect(0, 0, 320, 230, "1")
  TXT.draw(c, 4, 2, "DIE LEUTE AUF DEM DRAIN-MARKT VON OBEN (BLÖCKE)", "v", { font: "hud" })
  const row = (y, label) => { c.rect(0, y - 14, 320, 30, (y / 30 | 0) % 2 ? "e" : "f"); TXT.draw(c, 4, y - 12, label, "6", { font: "hud" }) }
  // Ratz: idle 6, talk 2, and turned right
  row(30, "RATZ: STEHT, REDET, DREHT SICH")
  for (let i = 0; i < 6; i++) MFB.ratz(c, 80 + i * 20, 36, "down", { idle: i })
  for (let i = 0; i < 2; i++) MFB.ratz(c, 210 + i * 20, 36, "down", { talk: i, idle: 0 })
  MFB.ratz(c, 270, 34, "right", { idle: 0 }); MFB.ratz(c, 296, 34, "left", { idle: 0 })
  // the preacher: idle (the lick), talk; his crate with the counter
  row(68, "PREDIGER: LECKT SEIN AUGE, PREDIGT")
  for (let i = 0; i < 6; i++) { if (i === 0) MFB.kiste(c, 80, 72, 9); MFB.prediger(c, 80 + i * 28, 70, "down", { idle: i + 2 }) }
  MFB.prediger(c, 256, 70, "down", { talk: 1 }); MFB.kiste(c, 298, 72, 11)
  // vendors behind counters
  row(106, "HÄNDLER: SCHÜRZE, SCHIRMMÜTZE, KAPUZE")
  const VEND = [{ coat: ["#41547a", "#617aa0"], hair: "#131a2a", apron: "#8e96a8" }, { coat: ["#552b1c", "#b0602a"], hair: "#0c0e1a", hood: "#1a2337" },
    { coat: ["#203c36", "#30594b"], hood: "#2e1220", hair: "#000" }]
  VEND.forEach((v, j) => { for (let i = 0; i < 4; i++) MFB.person(c, 80 + j * 82 + i * 18, 106, "down", { ...v, idle: i }) })
  // the crowd: bodies, things carried, the four directions, the walk
  row(144, "LEUTE: NORMAL, BREIT, DÜNN, KIND / SCHIRM, RUCKSACK, SCHALE, KISTE")
  const bodies = ["ordinary", "broad", "thin", "child"], carry = ["umbrella", "backpack", "bowl", "crate"]
  bodies.forEach((b, j) => MFB.person(c, 80 + j * 22, 146, "down", { body: b, coat: ["#30264c", "#4d3f78"], hair: "#2e2019" }))
  carry.forEach((k, j) => MFB.person(c, 180 + j * 30, 146, "down", { carry: k, coat: ["#7a3e22", "#b0602a"], hair: "#131a2a" }))
  row(182, "LEUTE: STEHEN (VIER KLEINE BEWEGUNGEN), DREHEN, GEHEN")
  for (let i = 0; i < 4; i++) MFB.person(c, 80 + i * 18, 184, "down", { coat: ["#203c36", "#30594b"], hair: "#93583f", idle: i })
  ;["down", "up", "right", "left"].forEach((d, j) => MFB.person(c, 160 + j * 18, 184, d, { coat: ["#3e1240", "#a8238a"], hair: "#0c0e1a" }))
  for (let i = 0; i < 4; i++) MFB.person(c, 246 + i * 18, 184, "right", { coat: ["#41547a", "#617aa0"], hair: "#7d8ca4", walk: i * 2 })
  TXT.draw(c, 4, 214, "JUNO ZUM VERGLEICH:", "6", { font: "hud" }); c.stamp("juno_top_idle_down", 90, 208)
  TXT.draw(c, 120, 214, "DER ZÄHLER DES PREDIGERS STEHT VORN AN DER KISTE", "6", { font: "hud" })
}, glow("vV", { r: 3, strength: 0.25 }))

// ---------------------------------------------------------------- the probes: windows of the painted market with its people
const MFP = (() => {
  const S = 2
  const ratzSeat = { x: DMF.RATZ.x * S + 84 + 11, y: DMF.RATZ.y * S + 20 + 8 }
  const pc = { x: DMF.PREACH.x * S, y: DMF.PREACH.y * S }
  /** the crowd on the free floor of a window: a loose scatter (seeded), kept off the stalls, the canal, the walls and the ring */
  const crowd = (x0, y0, w, h, n, seed, keep) => {
    const out = []
    for (let t = 0; out.length < n && t < 4000; t++) {
      const x = x0 + 8 + Math.floor(MFB.hs(seed + t, 1) * (w - 16)), y = y0 + 8 + Math.floor(MFB.hs(seed + t, 2) * (h - 16))
      const floor = (px, py) => { const k = DMF.ground(px / S, py / S).k; return k === "bed" || k === "terr" || k === "deck" }
      if (![[0, 0], [-7, 0], [7, 0], [0, -6], [0, 6]].every(([dx, dy]) => floor(x + dx, y + dy))) continue      // the whole figure on the floor
      if (DMF.OCC.some(([a, b, cc, d]) => x / S > a - 6 && x / S < cc + 6 && y / S > b - 4 && y / S < d + 4)) continue
      if (keep.some(([kx, ky, r]) => Math.hypot(x - kx, y - ky) < r)) continue
      if (out.some(([px, py]) => Math.abs(px - x) < 14 && Math.abs(py - y) < 10)) continue
      out.push([x, y, seed + t])
    }
    return out
  }
  const frame = (name, vx, vy, extra) => scene(name, { w: 320, h: 180, frames: 24, fps: 10, bg: "k" }, (c) => {
    c.stamp("_mfb_bg", -vx, -vy)
    const T = c.frame, people = crowd(vx, vy, 320, 180, 26, vx * 7 + vy, [[pc.x, pc.y, 64], [ratzSeat.x, ratzSeat.y + 18, 22]])
    const list = people.map(([x, y, s]) => {
      const L = MFB.look(s), walking = MFB.hs(s, 9) < 0.3, dir = ["down", "up", "right", "left"][Math.floor(MFB.hs(s, 8) * 4)]
      let px = x, py = y
      const vert = dir === "up" || dir === "down"
      if (walking) {
        // a short beat along its way and back (a probe: the game's extras walk real paths); only over floor one can stand on
        const ph = (T + Math.floor(MFB.hs(s, 10) * 24)) % 24, d = ph < 12 ? ph - 6 : 18 - ph, sg = dir === "left" || dir === "up" ? -1 : 1
        const nx = vert ? x : x + sg * d, ny = vert ? y + sg * Math.round(d / 2) : y, k = DMF.ground(nx / S, ny / S).k
        if (k === "bed" || k === "terr" || k === "deck") { px = nx; py = ny }
      }
      return [px, py, dir, L, walking]
    })
    for (const [x, y, dir, L, walking] of list.sort((a, b) => a[1] - b[1])) {
      const idle = Math.floor(T / 6 + MFB.hs(x, y) * 4) % 4
      MFB.person(c, x - vx, y - vy, dir, walking ? { ...L, walk: T % 8 } : { ...L, idle: MFB.hs(x, 3) < 0.5 ? idle : 0 })
    }
    extra(c, T, vx, vy)
    c.stamp("_mfb_over", -vx, -vy)
  })
  frame("markt_figuren_probe_ratz", 300, 160, (c, T, vx, vy) => {
    MFB.ratz(c, ratzSeat.x - vx, ratzSeat.y - vy, "down", T < 12 ? { idle: T % 6 } : { talk: T % 2, idle: 0 })
    c.stamp("juno_top_talk_up", ratzSeat.x - vx - 10, ratzSeat.y + 30 - vy - 10, { t: (T % 2) * 200 })
  })
  frame("markt_figuren_probe_prediger", 90, 60, (c, T, vx, vy) => {
    MFB.kiste(c, pc.x - vx, pc.y - vy, 9)
    MFB.prediger(c, pc.x - vx, pc.y - vy - 1, "down", T < 16 ? { idle: T % 8 } : { talk: 1 })
    // the ring: four at its edge, one facing him, the others looking away or passing
    for (const [a, d] of [[0.15, "left"], [6.05, "down"], [2.95, "right"], [3.4, "up"]]) {
      const x = Math.round(pc.x + Math.cos(a) * 62), y = Math.round(pc.y + Math.sin(a) * 40), k = DMF.ground(x / 2, y / 2).k
      if (k !== "terr" && k !== "bed") continue
      MFB.person(c, x - vx, y - vy, d, { ...MFB.look(Math.round(a * 10)), idle: (T >> 3) % 4 })
    }
  })
  // the same windows with the PAINTED figures (art/characters/markt_people.px.js), stamped by name, each frame's centre on its ground
  // point (top-left = centre - (size - 1) / 2); the preacher stands on the crate the market's background already has
  const put = (c, name, x, y, frame, size) => c.stamp(name, x - (size - 1) / 2, y - (size - 1) / 2, { frame })
  const painted = (name, vx, vy, extra) => scene(name, { w: 320, h: 180, frames: 24, fps: 10, bg: "k" }, (c) => {
    c.stamp("_mfb_bg", -vx, -vy)
    const T = c.frame, people = crowd(vx, vy, 320, 180, 26, vx * 7 + vy, [[pc.x, pc.y, 64], [ratzSeat.x, ratzSeat.y + 18, 22]])
    const list = people.map(([x, y, s]) => {
      const walking = MFB.hs(s, 9) < 0.3, dir = ["down", "up", "right", "left"][Math.floor(MFB.hs(s, 8) * 4)]
      let px = x, py = y
      const vert = dir === "up" || dir === "down"
      if (walking) {
        const ph = (T + Math.floor(MFB.hs(s, 10) * 24)) % 24, d = ph < 12 ? ph - 6 : 18 - ph, sg = dir === "left" || dir === "up" ? -1 : 1
        const nx = vert ? x : x + sg * d, ny = vert ? y + sg * Math.round(d / 2) : y, k = DMF.ground(nx / S, ny / S).k
        if (k === "bed" || k === "terr" || k === "deck") { px = nx; py = ny }
      }
      // the painted look that carries what the block look carries, so the mix of umbrellas, bags, bowls and crates stays the blocks'
      const BY = { umbrella: [6, 12], backpack: [3, 10, 16], bowl: [7, 15], crate: [8, 14], none: [1, 2, 4, 5, 9, 11, 13] }[MFB.look(s).carry ?? "none"]
      return [px, py, dir, BY[Math.floor(MFB.hs(s, 11) * BY.length)], walking]
    })
    for (const [x, y, dir, n, walking] of list.sort((a, b) => a[1] - b[1])) {
      const nn = String(n).padStart(2, "0"), size = n === 6 || n === 12 ? 23 : 21
      const idle = Math.floor(T / 6 + MFB.hs(x, y) * 4) % 4
      put(c, `statist_${nn}_${walking ? "walk" : "idle"}_${dir}`, x - vx, y - vy, walking ? T % 8 : MFB.hs(x, 3) < 0.5 ? idle : 0, size)
    }
    extra(c, T, vx, vy)
    c.stamp("_mfb_over", -vx, -vy)
  })
  painted("markt_people_probe_ratz", 300, 160, (c, T, vx, vy) => {
    put(c, T < 12 ? "ratz_top_idle_down" : "ratz_top_talk_down", ratzSeat.x - vx, ratzSeat.y - vy, T < 12 ? T % 6 : T % 4, 31)
    c.stamp("juno_top_talk_up", ratzSeat.x - vx - 10, ratzSeat.y + 30 - vy - 10, { t: (T % 2) * 200 })
  })
  painted("markt_people_probe_prediger", 90, 60, (c, T, vx, vy) => {
    put(c, T < 16 ? "prediger_top_idle_down" : "prediger_top_talk_down", pc.x - vx, pc.y - vy - 1, T < 16 ? T % 8 : T % 2, 27)
    for (const [a, d] of [[0.15, "left"], [6.05, "down"], [2.95, "right"], [3.4, "up"]]) {
      const x = Math.round(pc.x + Math.cos(a) * 62), y = Math.round(pc.y + Math.sin(a) * 40), k = DMF.ground(x / 2, y / 2).k
      if (k !== "terr" && k !== "bed") continue
      const n = 1 + Math.round(a * 10) % 16, nn = String(n).padStart(2, "0")
      put(c, `statist_${nn}_idle_${d}`, x - vx, y - vy, (T >> 3) % 4, n === 6 || n === 12 ? 23 : 21)
    }
  })
  return {}
})()
