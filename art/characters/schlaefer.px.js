// Chapter 1: the man asleep behind the counter of SUDS & SPIN ("Hinter der Theke schläft ein Mann, seit Jahren."), painted on the
// lines of the block the user chose, variant B of art/test/schlaefer_blocks.px.js (2026-11-13): the heavier man in a dark green
// quilted vest over a white undershirt, bare forearms crossed on his belly, the pale green work cap pulled down over his eyes (it
// reads as VR goggles, the user wants it so), his head dropped onto his left shoulder, the mouth open under the peak, on the shop's
// orange plastic chair tipped back against the wall; the Lull patch behind his right ear, the one toward us.
// A prop at the spot `sleeper` (the laundromat at AW.sleeper, CAM 23 at A23.sleeper), never mirrored, so the patch stays on the
// screen's left of his head. The counter in front hides everything right of its left edge (x 16) from y 31 down: his legs, the seat's
// front and the chair's front legs are painted all the same, plainly.
//   schlaefer_sit   35x50 (33x48 and the outline), pivot bottom (the spot under the chair's back legs), 4 frames: he breathes slowly,
//                   the crossed arms and the belly rise first, then the shoulders and the head; long holds in and out
// Light from the upper left, as everyone in street mode; the room's lamps light him at runtime.
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a",
  // skin: lit, mid, shade; the open mouth
  M: "#c48a6c", N: "#a8705a", n: "#6e4232", o: "#3a1a1c",
  // the quilted vest: lit, mid, shade, its seams
  Y: "#527e76", V: "#3e6460", v: "#2a4644", e: "#18282a",
  // the white undershirt: lit, its fold, its shade
  u: "#e6e2d4", x: "#c8c4b4", U: "#a8a498",
  // the work cap: its lit crown, mid, the peak, the peak's underside
  D: "#bce8c4", C: "#9ad4a8", c: "#4e8a66", a: "#2e5a44",
  // the shop's plastic chair (as its chairs at the window), its lit edge; its steel legs and their shade
  p: "#dc8a44", P: "#c06a2e", O: "#6e3a1e", t: "#8e96a8", T: "#5c6478",
  // Lull: the patch, its rim, its stripe (Teo's, at this scale)
  L: "#c8d8e8", l: "#7890a8", "~": "#eef6ff",
})

;(() => {

const W = 33, H = 48
/** a small hand-placed grid, "." leaves what is under it @param {any} c @param {number} x @param {number} y @param {string[]} rows */
const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))
/** paints only over what is already one of `keys`, so detail never changes the block's outline */
const on = (c, x, y, k, keys) => { if (keys.includes(c.key(x, y))) c.px(x, y, k) }
const VEST = "YVve", SHIRT = "uxU"

/** the chair tipped back on its back legs, as the block: the back panel leaning on the wall, the seat, the steel legs */
function chair(c) {
  c.line(5, 38, 8, 47, "t"); c.line(18, 32, 21, 44, "t")
  c.line(6, 42, 8, 47, "T"); c.line(20, 39, 21, 44, "T")                         // their lower halves away from the light
  c.poly([5, 37, 18, 31, 31, 36, 18, 42], "P"); c.line(5, 38, 18, 43, "O"); c.line(18, 43, 31, 37, "O")
  c.line(6, 37, 17, 32, "p")                                                     // the seat's back edge, lit
  c.poly([0, 22, 13, 16, 18, 31, 5, 37], "P"); c.line(0, 22, 5, 37, "O")
  c.line(1, 22, 12, 17, "p")                                                     // the back panel's top edge, lit
}

/** the trousers along the seat and down behind the counter; old work shoes on the floor */
function legs(c) {
  c.poly([6, 36, 20, 30, 33, 36, 19, 42], "2"); c.line(6, 36, 20, 30, "3")
  c.rect(26, 37, 4, 10, "2"); c.rect(21, 40, 4, 7, "3")
  c.line(21, 33, 31, 37, "3"); c.line(14, 38, 26, 37, "1")                        // the thigh's lit top, the crease between the legs
  c.vline(29, 38, 7, "1"); c.vline(24, 41, 5, "2")                                // the shins' shade
  c.rect(26, 45, 4, 2, "1"); c.rect(21, 45, 4, 2, "1"); c.hline(26, 45, 4, "4"); c.hline(21, 45, 4, "4")
}

/**
 * the man: `b` the belly and crossed arms risen (the breath in), `u` the shoulders and the head risen too (the breath held)
 * @param {any} c @param {{ b?: number, u?: number }} o
 */
function man(c, o = {}) {
  const u = o.u ?? 0, b = o.b ?? 0
  chair(c); legs(c)
  // the torso as the block: broad shoulders, the belly round over the belt; the undershirt down the middle between the vest's fronts
  c.poly([1, 22 - u, 18, 14 - u, 21, 22, 22, 30, 6, 39, 3, 32], "V")
  c.poly([9, 18 - u, 14, 16 - u, 19, 25, 19, 31 - b, 13, 35, 11, 28], "u"); c.line(9, 18 - u, 11, 28, "U")
  c.line(1, 22 - u, 6, 39, "e"); c.line(2, 22 - u, 7, 39, "v")

  // the vest: lit along the shoulder that faces the lamp, the far front in shade, the quilting in channels across (each seam a dark
  // line with the puff under it catching the light)
  c.line(3, 21 - u, 9, 18 - u, "Y"); c.line(4, 22 - u, 8, 20 - u, "Y")
  for (let y = 25; y <= 39; y++) for (let x = 19; x <= 22; x++) if (x - 19 >= (y - 25) / 4) on(c, x, y, "v", "V")
  for (const y of [26, 35]) {
    for (let i = 0; i <= 7; i++) { const sx = 3 + i, sy = y - Math.round(i * 3 / 7); on(c, sx, sy, "e", "VY"); if (i < 4) on(c, sx, sy + 1, "Y", "V") }
  }
  for (const y of [21, 26]) { on(c, 20, y, "e", "Vv"); on(c, 21, y - 1, "e", "Vv"); on(c, 20, y + 1, "V", "v") }
  // the vest's hem over the belt
  for (let i = 0; i <= 5; i++) on(c, 5 + i, 38 - Math.round(i / 2), "e", VEST)

  // the undershirt: its scoop round the neck, the shade the vest's far front throws, the belly's curve below the arms
  c.line(10, 19 - u, 14, 17 - u, "U")
  for (let y = 18; y <= 34; y++) { on(c, 18, y, "x", "u"); on(c, 19, y, "U", "u") }
  for (let x = 13; x <= 17; x++) on(c, x, 34 - Math.round((x - 13) / 2) - b, "x", SHIRT)

  // the bare upper arms out of the armholes, the far one hidden; the near one lit on its outside, shaded where it meets the vest
  c.rect(0, 21 - u, 3, 8, "N"); c.vline(2, 22 - u, 7, "n"); c.vline(0, 23 - u, 5, "M"); c.px(1, 21 - u, "M")
  c.hline(0, 21 - u, 3, "n"); c.px(3, 22 - u, "e")                                   // the armhole's edge over the shoulder
  // the forearms crossed on his belly: the left one on top, its hand tucked under the right elbow; the right one under it, its
  // fingers out under the left elbow on the far side; the arms' tops lit, their undersides dark
  g(c, 2, 28 - b, [
    "NMMMMMMMMMMMMNNn.",
    "nNNNNNNnNNNNNNNNn",
    ".nnnnnnnNnnnNNnn.",
  ])
  c.px(3, 28 - b, "n"); c.px(4, 29 - b, "n")                                         // the left hand's fingers under the right elbow
  c.px(9, 29 - b, "n"); c.px(10, 30 - b, "N")                                        // where the right arm runs on under the left

  // the neck, short and thick, in the head's shade
  c.rect(11, 17 - u, 4, 3, "n"); c.px(10, 18 - u, "n")
  // the head dropped onto his left shoulder: the cap down over his eyes, a seam up the crown to its button, lit on the lamp's side;
  // the peak out over his face, its underside dark; under it the peak's shadow across where the eyes are, the nose's tip, the mouth
  // open, the heavy jaw with its stubble; his right ear, and behind it the Lull patch, an oval pale disc with its rim and stripe
  g(c, 8, 7 - u, [
    ".......CDDC..",
    "....CDDDCCCC.",
    "...CDDCCCCCCC",
    ".CDDCCCCCCCcC",
    ".lCCCCCCccccc",
    "lLLNnccccccca",
    "lL~NnnnnnN...",
    ".lnNMNNNoN...",
    "..nNNNNNon...",
    "...nNNNNn....",
  ])
  c.line(15, 8 - u, 17, 10 - u, "C"); c.px(14, 8 - u, "C")                            // the seam down the crown
  c.line(17, 12 - u, 19, 12 - u, "a")                                                // the peak's underside, away from the lamp
}

// in, held, out, held: the arms and the belly rise first, the shoulders and the head after them; let out again the same way
const POSE = [{}, { b: 1 }, { b: 1, u: 1 }, { b: 1 }], MS = [1700, 350, 1500, 450]
anim("schlaefer_sit", { w: W, h: H, outline: "k", pivot: "bottom", frames: POSE.length, ms: MS }, (c) => man(c, POSE[c.frame]))

})()
