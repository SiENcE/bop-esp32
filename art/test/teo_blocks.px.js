// Chapter 1: Teo Reyes (story §4: Juno's younger brother, a Tideboy in the pump hall, double shifts, now on Lull; kapitel1-design §10:
// 52 px, #ffa040, Iso) as blocks for approval before he is painted. He replaces mock_teo (art/mock/ch1_blocks.px.js). His one scene is
// the visit on Wednesday at 18:30 (game/kapitel1_leben.js): in at the flat's door facing SE, he talks facing SE to Juno, out facing NW
// (the engine's mirror of NE). So he gets the two drawn views Juno has, SE (front three-quarter) and NE (back three-quarter), and an SE
// pose with Bao's broth (the white to-go bowl with its lid, as inv_suppe) as he comes in.
// His look from the title picture (art/ui/splash.px.js) and his portraits (art/portraits/portraits.px.js): short black hair, messy; the
// orange work vest with a pale reflective stripe across the chest over a dark navy shirt; the gill slits of his tide mod on the side of
// his neck (dark slit, a cyan line along it, as the Tidewater boy's in art/characters/tide_people.px.js); the Lull patch behind his
// left ear (the one the title's profile shows), always the oval pale disc with a darker rim and a brighter stripe (the small lullPatch of portraits.px.js, 3x4); dark
// work trousers, rubber boots from the pump hall. Light from the upper left, as Juno.
// The two ways differ only round the neck:
//   A  ear defenders round his neck (the story's): two dark cups on the collarbones, the band behind the neck
//   B  the collar and two straps with buckles of the front portrait (docs/portraits/README.md), no ear defenders
// (A is also the title picture's: there the near cup hangs before his throat, art/ui/splash.px.js)
// The patch sits behind his left ear, the side SE and NE turn to us (as the title's profile, facing right); the engine's mirror (SW, NW)
// would put it behind the right one, on a side that has none. A drawn NW (NW*) is the mirror without the patch: from there his left
// ear is behind his head.
//   teo_blocks                   the sheet: Juno (her real indoor sprites), A and B in SE, SE with the bowl, NE, NW (= NE mirrored),
//                                NW* (drawn: the mirror without the patch); their silhouettes below
//   teo_blocks_<a|b>_<se|bowl|ne|nwp>  each alone, 25x52, pivot bottom-centre (column 12), for the room composite (nwp: NE without the
//                                patch, stamped mirrored)
//   teo_blocks_im_raum           the two room shots (the engine placing them in the flat, its light on them) one over the other, labelled
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // hair (as the title's), skin (the title's Teo: lit, mid, shade)
  h: "#151a28", H: "#273048", I: "#c99a8c", i: "#93665c", A: "#583841",
  // the vest (lit, mid, shade), its reflective stripe; the navy shirt (lit, shade)
  o: "#ffb070", O: "#ffa040", P: "#c07838", r: "#b8cce0", e: "#2f3e5a", E: "#4f6584",
  // trousers, boots; the ear defenders / collar and straps (dark, lit), the buckles
  t: "#2a3346", T: "#3a465e", b: "#161c26", B: "#2a3240", g: "#20283a", G: "#3e4a62", m: "#8e96a8",
  // the gills' glow; the Lull patch (rim, stripe, disc: lullPatch's own); the bowl (white, its shade, the lid), steam
  v: "#62def0", l: "#3d6690", L: "#dafcff", R: "#c8e8ff", W: "#f0f0e0", w: "#b8b8a8", q: "#9aa0b0", s: "#6a7488",
  y: "#eec414",
})
include("../lib/text.js")

const IW = 23, IH = 50, X0 = 11          // inside the outline: 25x52 with it, the middle column 11 (12 with the outline)
const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

/** the legs and the boots, both views (SE: the toes to the right) */
function legs(c, view) {
  const se = view === "se"
  c.rect(7, 30, 4, 13, "T"); c.rect(12, 30, 4, 13, "t"); c.rect(7, 30, 9, 2, "t"); c.vline(7, 31, 12, "t")
  // rubber boots to mid-shin, their tops a band
  c.rect(7, 42, 4, 8, "B"); c.rect(12, 42, 4, 8, "b"); c.hline(7, 42, 4, "G"); c.hline(12, 42, 4, "B")
  if (se) { c.rect(8, 48, 4, 2, "B"); c.rect(13, 48, 4, 2, "b") }
  c.hline(6, 29, 11, "b")                                                         // the belt
}

/** the vest on the torso: SE shows its front (the shirt in its V, the zip, the stripe across), NE its back (the stripe all round) */
function vest(c, view) {
  const se = view === "se"
  for (let y = 13; y <= 28; y++) {
    const a = y === 13 ? 7 : 6, z = y === 13 ? 15 : 16
    c.hline(a, y, z - a + 1, "O"); c.hline(a, y, 2, "o"); c.hline(z - 1, y, 2, "P")
  }
  if (se) { g(c, 10, 13, ["eEe", ".e."]); c.vline(11, 15, 14, "P") }            // the shirt in the V, the zip
  else c.vline(11, 15, 14, "P")                                                  // the back seam
  c.hline(6, 20, 11, "r")                                                         // the reflective stripe
}

/** the arms in the navy shirt; SE hanging or holding the bowl in front */
function arms(c, view, bowl) {
  const se = view === "se"
  if (!bowl) {
    c.rect(4, 14, 2, 13, "E"); c.px(4, 14, "e"); c.rect(17, 14, 2, 13, "e")
    c.rect(4, 27, 2, 3, "i"); c.rect(17, 27, 2, 3, se ? "I" : "i")
    return
  }
  // the upper arms at his sides, the forearms forward, the hands round the bowl before his belly
  c.rect(4, 14, 2, 8, "E"); c.px(4, 14, "e"); c.rect(17, 14, 2, 8, "e")
  g(c, 4, 22, ["EE..........e", ".EEE.......e.", "..EEE........"])
  c.rect(9, 23, 2, 3, "i"); c.rect(16, 21, 2, 3, "I")
  // the bowl: white, its shade, the lid a little wider, its knob (no steam: over the vest it read as a stain)
  c.rect(11, 22, 6, 4, "W"); c.vline(11, 22, 4, "w"); c.hline(11, 25, 6, "w")
  c.rect(10, 20, 8, 2, "q"); c.rect(12, 19, 3, 1, "q"); c.hline(11, 20, 3, "W")
}

/** the head and the neck: SE face to the right, NE the back of the head with the left ear at its right edge */
function head(c, view) {
  if (view === "se") {
    g(c, 6, 0, [
      "..h.hH.h...",
      ".hhHhhHhhh.",
      "hhHhHhhHhhh",
      "hhhhhHhhhHh",
      "hhhhhhhIhhI",
      "hhhhhiIIIII",
      "hhhhhiIhIIh",
      "hhhhhiIhIIh",
      ".hhhhIIIIII",
      "..hhhiIIIAI",
      "...hhiIIII.",
      "....iiiii..",
    ])
    // the neck, the gills on its near side under the ear: the dark slit, its glowing mark right under it (as the Tidewater boy's,
    // three px so that it still reads at 1x under the room's light; nothing lies over the neck's front in either way)
    c.rect(9, 12, 5, 1, "i"); c.hline(10, 11, 2, "A"); c.hline(9, 12, 3, "v")
  } else {
    g(c, 6, 0, [
      "...h.hH.h..",
      ".hhHhhHhhh.",
      "hhhHhhHhHhh",
      "hhHhhhhhhHh",
      "hhhhhHhhhhh",
      "hhhhhhhhhhi",
      "hhhhhhhhhiI",
      "hhhhhhhhhiI",
      ".hhhhhhhhhi",
      "..hhhhhhhh.",
      "...hhhhhh..",
      "....iiiii..",
    ])
    // the gills on the near side, above the band or the collar behind the neck: the slit, its mark under it
    c.rect(9, 12, 5, 1, "i"); c.hline(14, 10, 2, "A"); c.hline(13, 11, 2, "v")
  }
}

/** the Lull patch behind the left ear: lullPatch's small disc (rim, a bright stripe, the pale disc) */
function lull(c, view) {
  const x = view === "se" ? 8 : 12, y = 5
  g(c, x, y, [".l.", "lLl", "lRl", ".l."])
}

/** round the neck: A the ear defenders, B the collar and its two straps with buckles */
function neck(c, view, way, bowl) {
  const se = view === "se"
  if (way === "A") {
    // the cups resting on the collarbones beside the neck, the band behind it
    // dark cups (a lit edge from the upper left) so they read against the orange, not as pale shoulder pads
    const L = [".mm.", "mGGg", "mGGg", "GGgg", ".gg."], R = [".mG.", "mGGg", "GGgg", "Gggg", ".gg."]
    if (se) { g(c, 5, 10, L); g(c, 14, 10, R) }                                     // the band is behind the neck
    else { c.hline(8, 12, 7, "g"); g(c, 4, 10, L); g(c, 15, 10, R) }
    return
  }
  // B: the collar, a dark padded band round the neck, and two straps down the vest with a buckle each
  // (SE: it sits low on the vest's neckline, its back showing beside the neck, so the gills stay free)
  if (se) { c.px(8, 12, "g"); c.px(14, 12, "g") } else c.hline(8, 12, 7, "g")
  c.hline(8, 13, 7, "G"); c.px(8, 13, "g"); c.px(14, 13, "g")
  for (const sx of [8, 14]) {
    if (se && bowl && sx === 14) continue
    c.vline(sx, 14, 13, "g"); c.px(sx, 20, "g")
    if (se) c.rect(sx, 24, 1, 2, "m")
  }
}

/** Teo standing, inside the outline's frame: view "se" | "ne", way "A" | "B", bowl in his hands (SE) */
function teo(c, view, way, bowl = false, patch = true) {
  legs(c, view)
  vest(c, view)
  head(c, view)
  arms(c, view, view === "se" && bowl)
  neck(c, view, way, bowl)
  if (patch) lull(c, view)
}

const POSES = [["se", "se", false, true], ["bowl", "se", true, true], ["ne", "ne", false, true], ["nwp", "ne", false, false]]
for (const way of ["a", "b"]) for (const [name, view, bowl, patch] of POSES)
  sprite(`teo_blocks_${way}_${name}`, { w: IW, h: IH, outline: "k", pivot: "bottom" }, (c) => teo(c, view, way.toUpperCase(), bowl, patch))

// Juno's real indoor sprites (hood down), first frames of the built idles (sh tools/build_art.sh characters writes them)
sprite("_juno_se", { png: "../../build/art/characters/anims/juno_in_idle_se.png", area: [0, 0, 27, 50] })
sprite("_juno_ne", { png: "../../build/art/characters/anims/juno_in_idle_ne.png", area: [0, 0, 27, 50] })

// silhouettes: every colour to ink
const ALL = "1234567hHIiAoOPreEtTbBgGmvlLRWwqsy"
const SIL = Object.fromEntries([...ALL].map((k) => [k, "k"]))
for (const way of ["a", "b"]) for (const [name] of POSES) sprite(`_sil_${way}_${name}`, { base: `teo_blocks_${way}_${name}`, swap: SIL })

const SW = 356, SH = 150, FY = 68, SY = 142
scene("teo_blocks", { w: SW, h: SH, bg: "3" }, (c) => {
  c.rect(0, FY, SW, 8, "2"); c.rect(0, 76, SW, 74, "5"); c.rect(0, SY, SW, 8, "4")
  // Juno, SE and NE, as she is in her flat
  c.stamp("_juno_se", 6, FY - 50); c.stamp("_juno_ne", 34, FY - 50)
  TXT.draw(c, 33, 3, "JUNO", "7", { font: "hud", align: "center" })
  // A and B: SE, SE with the bowl, NE, NW (the engine's mirror of NE), NW* (drawn: the mirror without the patch)
  const col = (way, i) => (way === "a" ? 84 : 222) + i * 27
  for (const way of ["a", "b"]) {
    TXT.draw(c, col(way, 2), 3, way.toUpperCase(), "7", { font: "hud", align: "center" })
    ;["SE", "BOWL", "NE", "NW", "NW*"].forEach((lab, i) => TXT.draw(c, col(way, i), 11, lab, "6", { font: "hud", align: "center" }))
    const shots = [["se", false], ["bowl", false], ["ne", false], ["ne", true], ["nwp", true]]
    shots.forEach(([n, flip], i) => {
      c.stamp(`teo_blocks_${way}_${n}`, col(way, i), FY, { flip: flip ? "x" : undefined })
      c.stamp(`_sil_${way}_${n}`, col(way, i), SY, { flip: flip ? "x" : undefined })
    })
  }
  c.vline(213, 2, FY - 2, "4")
  // a 52 px mark for Teo's height beside the 50 of Juno
  c.vline(65, FY - 52, 52, "y"); c.vline(67, FY - 50, 50, "7")
})

// the two room shots (build/blocks/teo/room_<a|b>_1x.png, made by build/blocks/teo/room.sh), one over the other, labelled
sprite("_room_a", { png: "../../build/blocks/teo/room_a_1x.png" })
sprite("_room_b", { png: "../../build/blocks/teo/room_b_1x.png" })
scene("teo_blocks_im_raum", { w: 320, h: 362, bg: "k" }, (c) => {
  c.stamp("_room_a", 0, 0); c.stamp("_room_b", 0, 182)
  for (const [lab, y] of [["A", 0], ["B", 182]]) { c.rect(296, y + 160, 20, 16, "k"); TXT.draw(c, 306, y + 165, lab, "y", { font: "hud", align: "center" }) }
})
