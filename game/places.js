// Nagiwa: positions in the rooms, in one place. Street-mode rooms built from a map come measured from their
// bake (game/rooms/<id>.layout.js, written by tools/build_art.sh); the cameras from their layout notes
// (docs/cams/*_layout.md). Rooms, routines and moments read them from here.
"use strict";

/** A room's places from its measured layout: the spots by name, the walk area and holes, the props (as the
 * engine wants them), each prop's shape (`<id>Poly`: its outline) and sprite box (`<id>Rect`), each opening's rect (`<id>Rect`) and shape on its wall (`<id>Poly`). */
/** The convex hull of points given flat [x0, y0, x1, y1, ...], flat again (monotone chain): one shape round a row of things. */
function hull(/** @type {number[]} */ flat) {
  const pts = [];
  for (let i = 0; i < flat.length; i += 2) pts.push([flat[i], flat[i + 1]]);
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (/** @type {number[]} */ o, /** @type {number[]} */ a, /** @type {number[]} */ b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  /** @type {number[][]} */ const lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)].flat();
}

function fromLayout(/** @type {any} */ L) {
  /** @type {Record<string, any>} */
  const at = { ...L.spots, walk: L.walk, holes: L.holes, face: L.face, lamps: L.lamps };
  // props seen through an open door are baked into the picture: no sprite of their own
  at.props = Object.entries(L.props).filter(([, p]) => /** @type {any} */ (p).sprite).map(([id, p]) => ({ id, image: /** @type {any} */ (p).sprite, at: /** @type {any} */ (p).at, front: /** @type {any} */ (p).front, baseline: /** @type {any} */ (p).baseline,
    ...(/** @type {any} */ (p).seeThrough ? { seeThrough: true } : {}) }));
  // (a prop's shape: the outline of its drawn pixels where the bake measured it, else its box's silhouette)
  for (const [id, p] of Object.entries(L.props)) { at[`${id}Poly`] = /** @type {any} */ (p).shape ?? /** @type {any} */ (p).poly; at[`${id}Rect`] = /** @type {any} */ (p).box; }
  for (const [id, r] of Object.entries(L.openings ?? {})) at[`${id}Rect`] = r;
  for (const [id, q] of Object.entries(L.openingPolys ?? {})) at[`${id}Poly`] = q;      // its parallelogram on the wall (a hotspot's shape)
  for (const [id, q] of Object.entries(L.zonePolys ?? {})) at[`${id}Poly`] = q;         // a zone's box (a door that is only a gap)
  return at;
}

Nagiwa.at = {
  // measured from the flat's map and its bake (art/rooms/flat.map.js, game/rooms/flat.layout.js)
  // Teo's visit (game/kapitel1_leben.js): the open door's block over the door's opening, with the leaf swung into the room to the
  // left, on the floor from the front jamb (14,155) to (43,170): its front line (who stands below it is in front of the leaf); where
  // Juno opens it, clear of its swing (map [0.9, 3.5]); Teo's place on the threshold (in the gap's back half, off the floor: he walks in free,
  // behind the leaf), where he stands (map [1.0, 3.95]) and where Juno steps back to ([2.0, 3.5]), both in the room past the leaf
  flat: { ...fromLayout(Nagiwa.layouts.flat), doorOpen: Nagiwa.layouts.flat.openings.door.slice(0, 2), doorLeafFront: [14, 155, 43, 170], doorSide: [68, 157],
    doorway: [38, 145], visitTeo: [57, 166], visitJuno: [104, 174] },
  // the 14th floor's landing (art/rooms/kessel_14.map.js, game/rooms/kessel_14.layout.js)
  kessel_14: fromLayout(Nagiwa.layouts.kessel_14),
  // the lobby (art/rooms/kessel_lobby.map.js, game/rooms/kessel_lobby.layout.js)
  kessel_lobby: fromLayout(Nagiwa.layouts.kessel_lobby),
  // the observation hall, the intro's shot 1 (art/rooms/hall.map.js, game/rooms/hall.layout.js)
  hall: fromLayout(Nagiwa.layouts.hall),
  // the 4th floor's landing in the Wohnblock Lerche, on blocks (art/rooms/lerche_flur.map.js, game/rooms/lerche_flur.layout.js)
  lerche_flur: fromLayout(Nagiwa.layouts.lerche_flur),
  // Ines' flat, 4B, on blocks (art/rooms/ines_wohnung.map.js, game/rooms/ines_wohnung.layout.js); the fridge's upper part has the napkin
  // under its magnet, its lower part is the freezer (one hotspot asks which)
  ines_wohnung: fromLayout(Nagiwa.layouts.ines_wohnung),
  // shop24 (art/rooms/shop24.map.js, game/rooms/shop24.layout.js)
  shop24: fromLayout(Nagiwa.layouts.shop24),
  // lerche_eg (art/rooms/lerche_eg.map.js, game/rooms/lerche_eg.layout.js)
  // (the street door is a gap in the near wall, south-east: its hotspot drawn on it from the map, u 7.3 to 8.2 at v 4, up to 2 m)
  lerche_eg: { ...fromLayout(Nagiwa.layouts.lerche_eg), doorPoly: [250, 265, 278, 279, 278, 219, 250, 205] },
  // Lull-Klinik 9-Ost from the inside (art/rooms/klinik.map.js, game/rooms/klinik.layout.js). The waiting sit on the seats as props
  // (art/characters/klinik.px.js: their hips at 2 px right of their figure's foot and 18 px above it): each stands where its hips come
  // over its seat's spot, drawn after the seats, and in front of whoever stands behind the line of their feet (the seats' front line, 6 px
  // lower)
  klinik: (() => {
    const A = fromLayout(Nagiwa.layouts.klinik), seats = Nagiwa.layouts.klinik.props.seats;
    const front = seats.front.map((/** @type {number} */ n, /** @type {number} */ i) => (i % 2 ? n + 6 : n));
    A.waiting = [A.wait1, A.wait2, A.wait4].map((/** @type {number[]} */ p, /** @type {number} */ i) =>
      ({ id: `wartende_${i + 1}`, image: `wartende_${i + 1}`, at: [p[0] - 2, p[1] + 5], baseline: seats.baseline + 1, front }));
    A.maritLine = [A.nurse[0], A.nurse[1] - 44];          // her lines over her head (she is a prop: her voice has no figure)
    return A;
  })(),
  // the swamps, two stages seen from the side (art/rooms/sumpf.px.js): the ride on Pike's raft, its planes where they start (each
  // scrolls), the raft's canvas, where Juno stands on it; and the arrival at the caravan, the raft tied up at the walk, the caravan and
  // the raft to click
  sumpf_fahrt: { far: [0, 0], weed: [0, 142], floss: [78, 32], juno: [170, 151], walk: [[150, 148, 196, 148, 196, 153, 150, 153]] },
  // The arrival is 640 wide and scrolls ("Auf Sendung", kapitel2-design §3.5): from the raft up onto the caravan's pontoon and along the walk
  // of planks to the right, past the roots with Pike's trap, the dead tree with Lantern's mast, to the half-sunk boat
  sumpf: { floss: [6, 42], juno: [100, 161], walk: [[80, 158, 118, 158, 158, 146, 608, 145, 608, 150, 162, 151, 126, 163, 80, 163]],
    door: [226, 148], reuse: [376, 148], mast: [446, 148], boot: [544, 148],      // (at the mast beside it: its screen stays in view)
    lanterns: [[46, 58], [94, 44], [128, 86], [158, 40], [204, 56], [246, 40], [286, 72], [116, 112], [232, 108], [350, 50], [424, 76], [556, 46], [612, 88]],
    screen: [469, 99],                                                               // the small screen on the mast, its green
    tuerZu: [211, 92], reuseAt: [364, 132], funkAt: [532, 150],                      // the parts that change: the shut door, the trap, the radio
    // (the trap hangs in the roots, above the bag's bar at the bottom)
    reusePoly: [362, 134, 386, 132, 388, 148, 362, 148], mastPoly: [452, 8, 472, 8, 476, 146, 448, 146],
    bootPoly: [510, 145, 530, 147, 578, 157, 578, 172, 526, 170, 512, 154],      // (its raised bow reaches above the bag's bar)
    wohnwagenPoly: [170, 146, 170, 88, 176, 72, 212, 72, 214, 82, 270, 82, 290, 106, 308, 112, 308, 146],
    flossPoly: [40, 170, 40, 150, 52, 150, 54, 70, 72, 70, 74, 150, 88, 150, 90, 126, 104, 126, 106, 150, 138, 150, 138, 170] },
  // the radio from the boat, close (art/rooms/sumpf.px.js prints its parts' places: FUNK_AT): its display, TX, the arrow keys either side
  // of CH and WAVE, the power switch that puts it away
  funk: { screen: [132, 44, 116, 40], tx: [72, 44, 44, 26], chL: [130, 102, 16, 20], chR: [168, 102, 16, 20], waveL: [194, 102, 16, 20],
    waveR: [232, 102, 16, 20], pwr: [226, 130, 22, 14] },
  // SUMP RUNNER's cabinet, close (game/sump_runner.js, on blocks): the marquee, the screen, the playfield's grid on it (its top left, a
  // cell's size, columns and rows), the side panel, and the control panel's buttons under it
  sump_runner: { marquee: [40, 2, 240, 16], screen: [44, 24, 232, 126], grid: [52, 30, 12, 9, 10], side: [170, 30, 100, 116],
    left: [90, 160, 20, 14], up: [112, 160, 20, 14], down: [134, 160, 20, 14], right: [156, 160, 20, 14], start: [194, 160, 36, 14],
    quit: [238, 160, 40, 14] },
  // Lantern's hide, on blocks (art/rooms/lantern_versteck.map.js, game/rooms/lantern_versteck.layout.js); he sits at "lantern"
  // where the LED ticker lies over his poster (art/rooms/lantern_versteck.px.js prints it, TICKER_AT, from the poster's opening)
  lantern_versteck: { ...fromLayout(Nagiwa.layouts.lantern_versteck), tickerAt: [88, 45] },
  // CAM 25 is the landing's own picture under the feed's filter, as CAM 14 is the 14th floor's (one place, one picture), the camera left
  // out of its own picture; the two in white stand at 4B and go to the stairs with the boxes
  cam25: (() => {
    const L = Nagiwa.layouts.lerche_flur, S = 0;
    return { shift: S, exposure: 2.2, mic: L.spots.door_4b, door_4b: L.spots.door_4b, door_4b2: [L.spots.door_4b[0] + 14, L.spots.door_4b[1] + 6],
      stairs: L.spots.stairs, doorPoly: L.openingPolys.door_4b };
  })(),
  // CAM 26 is the 24-hour shop's own picture under the feed's filter (one place, one picture, as CAM 25 is the landing's), the camera
  // left out of its own picture (the side thread "Wer passt auf den Laden auf?", game/kapitel2_laden.js)
  cam26: { exposure: 1.6 },
  // blocks (art/cams/cam51.px.js, measured there: CAM51_LAYOUT): the workers' hostel 5-Süd's dormitory C down its aisle; Najo's bunk the
  // nearest on the right, the upper one (the cameras' strip covers the left edge); the left row's bunks past the strip
  cam51: { mic: [177, 140], bunkPoly: [203, 99, 211, 45, 243, 45, 301, 81, 271, 147, 234, 154], rowsPoly: [80, 46, 115, 14, 129, 13, 131, 44, 122, 108, 93, 109] },
  // Weg_1 from above (art/rooms/weg1.px.js, its blocks: the street between the facades at y 120 and 290 from x 60, the arm to the gate
  // between x 790 and 930 down to y 505, what stands in the way in W1.OCC); Juno's sprite from above is anchored in its middle, so the
  // walk area keeps half her size from the facades. Spots face up, down, left or right
  weg1: {
    size: [960, 540],
    walk: [[64, 130, 922, 130, 922, 500, 798, 500, 798, 282, 64, 282]],
    holes: [[296, 130, 344, 130, 344, 156, 296, 156], [596, 254, 654, 254, 654, 282, 596, 282], [501, 254, 552, 254, 552, 282, 501, 282],
      [798, 296, 826, 296, 826, 334, 798, 334], [880, 406, 922, 406, 922, 444, 880, 444], [664, 190, 696, 190, 696, 220, 664, 220]],
    gate: [860, 492], lerche: [760, 140], fish: [72, 205], homelessTalk: [527, 246], sheepTalk: [650, 205], robotTalk: [206, 200],
    noodles: [210, 262], trash: [320, 166], steam: [348, 215], shop: [720, 268], shopRect: [662, 274, 116, 14],
    gateRect: [784, 505, 152, 35], fishRect: [0, 140, 60, 130], homelessRect: [505, 262, 43, 22], noodlesRect: [150, 268, 120, 20], lercheRect: [728, 120, 57, 14],
    sheepPoly: [668, 193, 692, 193, 694, 205, 692, 217, 668, 217, 666, 205], trashPoly: [295, 122, 340, 122, 340, 148, 295, 148],
    steamPoly: [361, 206, 370, 203, 379, 206, 382, 215, 379, 224, 370, 227, 361, 224, 358, 215], robotPoly: [173, 196, 176, 193, 184, 193, 187, 196, 187, 204, 184, 207, 176, 207, 173, 204],
    // the street's life (design §7) and the 24-hour shop's thread (§6.5), on blocks: the homeless man and the sheep as sprites over the
    // picture (their top left); the robot going round its puddle (no hole: it moves, and steps aside); the queue at the noodle bar from 19:00 (the market's people from above,
    // [x, y, look, facing]); two people passing along the street and back; a delivery drone crossing high over it (px a second, ms it rests at each end)
    homelessAt: [504, 261], sheepAt: [665, 190],
    robotRing: [[180, 193], [192, 197], [194, 203], [180, 207], [166, 203], [166, 197]],
    robotRounds: [[180, 207], [520, 207], [760, 214], [770, 246], [420, 246], [110, 236]],       // its round once it knows its way again
    queue: [[172, 257, "03", "down"], [188, 253, "07", "down"], [204, 256, "11", "left"], [221, 252, "14", "down"]],
    walkers: [{ look: "05", at: [90, 216], path: [[740, 228]], pause: 1200 }, { look: "12", at: [700, 168], path: [[110, 172]], pause: 2000 }],
    drone: { at: [70, 150], path: [[915, 176]], speed: 70, rest: 6000 },
  },
  // Kowalski Street (art/rooms/kowalski.map.js, game/rooms/kowalski.layout.js)
  kowalski: {
    fromGasse: [346, 170],
    // (the passage to Jade Row is the map's opening and spot "west": westRect, west)
    ...fromLayout(Nagiwa.layouts.kowalski),
    // the alley's gate standing open, laid over the picture from Chapter 1 on (art/rooms/kowalski.px.js)
    alleyOpen: Nagiwa.layouts.kowalski.alleyOpen,
    // Chapter 2: the street without the cable to Bao's cart, laid over the picture while the cart is gone
    noCable: Nagiwa.layouts.kowalski.noCable,
    // the room's effects, on the screen (from the map's projection): the light hanging in the rain out of
    // LUCKY STATIC's door and under the ad screen, glints on the puddles, drops off an AC unit, the Kessel
    // Block's transom and the cornice by the alley
    hazeDoor: [31, 78, 60, 64, 111, 156, 82, 170], hazeAd: [258, 68, 367, 123, 329, 173, 220, 119],
    glints: [[264, 164], [123, 150], [130, 169], [285, 158]],
    drips: [[247, 2, 95], [166, 8, 77], [396, 88, 170]],
    // the implant's brackets round the ad screen in the JUNO. moment
    adMark: [Nagiwa.layouts.kowalski.openings.ad[0] - 3, Nagiwa.layouts.kowalski.openings.ad[1] + 2,
      Nagiwa.layouts.kowalski.openings.ad[2] + 6, Nagiwa.layouts.kowalski.openings.ad[3] + 1],
    // Bao's hotspot: his top half over the counter (the cart's own below it), his head and shoulders' shape, no floor beside him
    baoPoly: ((x, y) => [x - 6, y - 49, x + 6, y - 49, x + 9, y - 37, x + 11, y - 23, x - 11, y - 23, x - 9, y - 37])(...Nagiwa.layouts.kowalski.spots.bao),
    // Chapter 2, the Quiet (game/kapitel2_quiet.js): the shadow at the front before LUCKY STATIC, his back to us, staring at the
    // Kessel Block's door (the user's choice, 2026-11-17); on Monday the leader there and his two men a step behind him on either side
    quiet: [128, 168], quietLeft: [106, 160], quietRight: [148, 162],
    // while Bao's cart is gone (Saturday and Sunday after K1b sold) he walks slowly up and down before LUCKY STATIC, and at each end
    // turns round slowly, a short step at a time away from us (the user, 2026-11-17)
    quietWalk: [[96, 168], [190, 164], [192, 161], [189, 159], [186, 161], [96, 168], [94, 165], [97, 163], [100, 165]],
    // Chapter 2, Varga's man (game/kapitel2_folgen.js): beside the Kessel Block's door, his back to its wall; Juno talks to him from
    // where she comes out
    vargasMann: [160, 94],
  },
  // measured from the cameras' projections (docs/cams/cam03_layout.md, cam04_layout.md). No depth `scale`: the
  // feed figures stay at their drawn size (scaling 24 px pixel art by 0.7–1.9 would smear it; the seated
  // people in cam04 are drawn at their size there)
  cam03: {
    door: [100, 58], awning: [108, 145], awningFar: [128, 41], vendingSpot: [85, 84], far: [271, 77],
    exitRight: [309, 133], exitFar: [192, 20],
    mic: [108, 145],
    mast: [271, 23, 22, 15], vending: [68, 45, 31, 36], officeDoor: [74, 20, 23, 47],
    // the hotspots' shapes, measured there too (CAM03_POLYS): each thing's outline, not its rect
    mastPoly: [271, 32, 274, 24, 288, 25, 292, 30, 289, 38, 275, 36], vendingPoly: [68, 53, 75, 46, 91, 46, 98, 72, 93, 80, 78, 79],
    officeDoorPoly: [75, 32, 89, 21, 96, 52, 85, 66],
  },
  // Chapter 1's cameras and places
  // (the left column of every feed is the cameras' strip, x 4 to 74, and the top left its name: nothing that matters lies there)
  // painted (art/cams/cam21.px.js, measured there: CAM21_LAYOUT): the queue across the picture toward the door under the camera, Ines
  // out from under it to the left; the clinic's hotspot is the white pylon with Nagi·wa's ring, in its own outline
  cam21: { door: [153, 146], walkOff: [31, 140], gone: [-14, 139], queue: [[187, 147], [176, 130], [168, 117], [161, 107]], menu: [127, 55, 17, 15], mic: [173, 110],
    clinicPoly: [202, 139, 213, 106, 218, 104, 230, 113, 215, 147, 210, 149] },
  // the 14th floor's own picture and props (game/rooms/kessel.js), 352 wide, moved left by 32 (`shift`) so its right edge is the
  // feed's: Frau Haldane comes out of her door beside the lift and walks to the papers at the head of the stairs (the cameras' strip
  // covers Juno's door)
  cam14: (() => {
    const L = Nagiwa.layouts.kessel_14, S = -32, q = L.openingPolys.door_haldane;
    const foot = [[q[0], q[1]], [q[2], q[3]], [q[4], q[5]], [q[6], q[7]]].sort((a, b) => b[1] - a[1]).slice(0, 2);
    return { shift: S, door: [Math.round((foot[0][0] + foot[1][0]) / 2) + S, Math.round((foot[0][1] + foot[1][1]) / 2) - 2],
      mat: [L.spots.stairs[0] - 24 + S, L.spots.stairs[1] + 4], mic: [180, 130], exposure: 2.2,
      // her armchair empty while she is out here (the bake's kessel_14_chair_empty, laid over the picture where it differs)
      chairEmpty: [L.chairEmpty[0] + S, L.chairEmpty[1]],
      // her door's own shape on its wall
      doorPoly: q.map((v, i) => (i % 2 ? v : v + S)) };
  })(),
  // almost straight down over the stairs (art/cams/cam18.px.js, measured there: CAM18_LAYOUT): the fish painted over the steps lies on
  // them, its hotspot over theirs
  cam18: { mic: [154, 93], fish: [128, 43, 53, 107], stairs: [113, 32, 88, 117],
    fishPoly: [127, 137, 133, 84, 135, 73, 138, 64, 143, 56, 148, 49, 153, 46, 159, 44, 164, 47, 169, 52, 172, 59, 174, 68, 175, 78, 171, 142],
    stairsPoly: [114, 139, 118, 33, 201, 42, 183, 148] },
  // painted frontal (art/cams/cam22.px.js, measured there: CAM22_LAYOUT): Ines's sprite at this scale (ines_feed_bar) stands on the
  // counter's far edge at her place; the counter is its top and the face toward us, clipped to the picture
  cam22: { seat: [160, 108], mic: [160, 101], barPoly: [0, 108, 8, 106, 290, 106, 320, 115, 320, 140, 0, 140], napkin: [169, 109, 15, 5] },
  // CAM 23 is the laundromat's own picture (one place, one picture: kapitel0-design §3), moved right by `shift` so the washers clear
  // the cameras' strip; Ines stands where Juno would: at a washer on Wednesday, at dryer 6 on Thursday
  cam23: (() => {
    const L = Nagiwa.layouts.laundromat, S = 24, sh = (/** @type {number[]} */ p) => [p[0] + S, p[1]];
    const boxes = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => L.props[`dryer${n}`].box), c = L.props.counter.box;
    const x0 = Math.min(...boxes.map((b) => b[0])), y0 = Math.min(...boxes.map((b) => b[1]));
    const x1 = Math.max(...boxes.map((b) => b[0] + b[2])), y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
    return { shift: S, exposure: 2.2, door: sh(L.spots.door), dryer6: sh(L.spots.dryer6), washer: sh(L.spots.washer), sleeper: sh(L.spots.sleeper), mic: sh(L.spots.dryer6),
      quiet: sh([176, 150]),      // Chapter 2: the man in white on the open floor, toward dryer 6
      dryers: [x0 + S, y0, x1 - x0, y1 - y0], desk: [c[0] + S, c[1], c[2], c[3]],
      // the hotspots' shapes: the row of dryers round all eight, the counter's own outline (as in the laundromat)
      dryersPoly: hull([1, 2, 3, 4, 5, 6, 7, 8].map((n) => L.props[`dryer${n}`].poly).flat()).map((v, i) => (i % 2 ? v : v + S)),
      deskPoly: (L.props.counter.shape ?? L.props.counter.poly).map((/** @type {number} */ v, /** @type {number} */ i) => (i % 2 ? v : v + S)) };
  })(),
  // painted (art/cams/cam24.px.js, measured there: CAM24_LAYOUT): the doorbell's fisheye; Ines comes out past the lens (off the bottom),
  // through the gate and off to the right along the street (Friday), or the other way (Wednesday, Thursday)
  cam24: { out: [152, 192], gate: [211, 113], street: [256, 110], away: [518, 144], mic: [211, 99],
    doorPoly: [67, 28, 69, 0, 106, 0, 128, 180, 90, 180, 84, 167, 73, 126, 67, 68] },
  // job B (game/auftrag_tide.js): Jade Row from Nagi·wa's camera above it, and from the machine's own at hip height
  // painted frontal (art/cams/cam15.px.js, measured there: CAM15_LAYOUT): Kessler comes in at the door on the right and walks along the
  // capsule wall to 23's ladder; the wall's hotspot leaves 23 out with a notch, so the two never cover each other
  cam15: { door: [258, 126], spot: [125, 120], mic: [122, 104],
    c23Poly: [105, 78, 126, 77, 129, 96, 109, 96], capsulesPoly: [85, 78, 105, 78, 109, 96, 129, 96, 126, 78, 252, 78, 240, 112, 95, 112] },
  // painted near iso (art/cams/cam30.px.js, measured there: CAM30_LAYOUT): Thursday Ines comes from the street under the camera (off the
  // bottom) to the board; Friday from the right, round the frame to the stair's head, down the steps and under the arch off the top
  cam30: { thuIn: [210, 222], board: [179, 102], friIn: [344, 177], turn: [151, 153], top: [106, 118], water: [163, 84], gone: [253, -12], mic: [128, 102],
    signPoly: [53, 35, 146, 91, 147, 100, 57, 44], tidePoly: [182, 91, 184, 78, 208, 91, 204, 103] },
  // measured from the camera in art/cams/cam31.px.js (it logs them when built)
  cam31: { stairs: [96, 83], top: [92, 67], shadow: [59, 92], edge: [151, 117], meet: [112, 99], asheMeet: [97, 90], tunnel: [284, 111], lantern: [183, 131], mic: [135, 108], tries: [244, 26, 72] },
  // the alley (art/rooms/gasse.map.js, game/rooms/gasse.layout.js): the laundromat's door, the niche and the way down are the map's
  // openings, the cables its prop. The gate to Kowalski Street is the gap at the near left wall's end (a cut wall has no picture of
  // its own): the passage to Kowalski Street is an opening too (kowalskiRect). The water is all below the balcony's railing: from its
  // far end along its top, then out to the picture's right and bottom edges. The two cones of light (the lamp over the laundromat's
  // door, the one over the statue) as haze, from the map's projection (at [224, 60], 32 px a meter across, 30 up)
  gasse: (() => {
    const at = fromLayout(Nagiwa.layouts.gasse), R = Nagiwa.layouts.gasse.props.railing.poly, W = 416, H = 236;
    const P = (/** @type {number} */ u, /** @type {number} */ v, h = 0) => [224 + 32 * (u - v), 60 + 16 * (u + v) - 30 * h];
    const cone = (/** @type {number} */ u, /** @type {number} */ v, /** @type {number} */ h, /** @type {number} */ r) => [...P(u, v, h).map((n, i) => n - (i ? 0 : 2)), ...P(u, v, h).map((n, i) => n + (i ? 0 : 2)), ...P(u + r, v - r), ...P(u - r, v + r)];
    // the padlocks on the railing where Juno looks at the water (art/kit/gasse.kit.px.js: along it from 2.75 m, at its lower rail)
    const a = P(5.92, 2.8, 0.7), b = P(5.92, 3.9, 0.3);
    // the cables' hotspot as the user set it in the editor (2026-11-09): over the bundles only, clear of the doors below
    return { ...at, cablesRect: [76, -1, 347, 37], locksRect: [b[0] - 2, a[1] - 2, a[0] - b[0] + 4, b[1] - a[1] + 4], waterPoly: [R[0], R[1], W, R[1], W, H, R[10], R[11]],
      hazeDoor: cone(1.08, 0.3, 2.25, 0.45), hazeStatue: cone(2.95, 3.65, 3.15, 0.65), adAt: Nagiwa.layouts.gasse.openings.ad.slice(0, 2),
      // Chapter 2: the paper boat with I. among the candles at the monument's foot (its top left; art/rooms/gasse.px.js)
      papierboot: [198, 173],
      // Chapter 2: the walkway on west out of the picture, to the cross street and the clinic (the city plan, steg_west)
      steg: [28, 214], stegPoly: [0, 186, 26, 199, 26, 236, 0, 236] };
  })(),
  // the lane left of Kowalski Street, down its length (painted on its blocks' lines: art/rooms/jade_row.px.js, art/old/jade_row_blocks.px.js; z = 1 where Juno walks, 30 px to the metre there). She keeps to the near band: her
  // sprite has one size, right for that depth, so the shop's door and the machine are reached from in front of them
  jade_row: {
    walk: [[67, 142, 253, 142, 306, 176, 14, 176]], arrive: [292, 172], back: [292, 172], mid: [186, 158], shop: [56, 158], machine: [232, 146], soup: [214, 144], far: [160, 143], parlour: [112, 143], pharmacy: [196, 143],
    backRect: [278, 54, 42, 122], windowRect: [60, 84, 38, 50], doorRect: [36, 84, 24, 78], signRect: [0, 52, 98, 30], machineRect: [232, 84, 28, 57], soupRect: [212, 82, 20, 50],
    // Chapter 2: Morrow before her patrol car, Saturday and Sunday at 00:30; the car a little back down the lane, at its own size there
    // (streife_nah, the user's choice, 2026-11-16)
    morrow: [180, 147], car: [196, 128],
    // Chapter 2 after K1b warned: WHO TALKED? on the passage's wall in the arch (art/rooms/jade_row.px.js, the overlay "tag")
    tagRect: [282, 106, 27, 16],
    parlourRect: [118, 88, 8, 26], arcadeRect: [100, 90, 16, 32], balconyRect: [44, 20, 58, 46], nightRect: [212, 8, 43, 62], carRect: [168, 92, 24, 17], pharmacyRect: [195, 88, 13, 24], gateRect: [136, 50, 48, 46], screenRect: [136, 4, 48, 44], signsRect: [195, 56, 22, 32],
    // the hotspots' shapes, measured from the blocks' own perspective (art/old/jade_row_blocks.px.js prints JADE_POLYS): what lies on a side
    // wall is a trapezoid here; the machine, the arcade, the gate, the screen, the car and the hanging signs are drawn as rects
    // Okonkwo's shop takes the whole near left-hand wall in the painting (art/rooms/jade_row.px.js, SHOP0 to SHOP1: the user's wishes,
    // 2026-11-11): a window of one pane from the picture's edge (windowNear), the door between, a window of three panes (window) up
    // to the arcade, the sign over the whole front; Juno stands at "shop" before the door
    windowPoly: [60, 134, 98, 113, 98, 84, 60, 87], windowNearPoly: [0, 168, 36, 146, 36, 88, 0, 91], doorPoly: [36, 160, 60, 145, 60, 84, 36, 85],
    signPoly: [0, 82, 98, 81, 98, 69, 0, 52], parlourPoly: [116, 109, 128, 102, 128, 80, 116, 80], soupPoly: [242, 128, 211, 110, 211, 82, 242, 83],
    pharmacyPoly: [208, 106, 195, 99, 195, 82, 208, 83], nightPoly: [255, 56, 213, 67, 213, 40, 255, 7], balconyPoly: [46, 13, 75, 13, 100, 33, 100, 66, 80, 66, 46, 60], backPoly: [329, 193, 279, 160, 279, 78, 289, 58, 300, 53, 313, 54, 329, 77],
  },
  // outside the flat's window: the ledge, painted as a stage (art/rooms/sims.px.js, its measures: the ledge's top from y 146 to its
  // front edge at 150, the window 38 to 82 across and 76 to 127 down, KESSEL's frame 96 to 246 and 22 to 84, the drone with its
  // parcel at 4 to 39 and 57 to 84, the AC box 210 to 236, the ladder 258 to 276 down to 27, J+T at 279, the corner at 292, the
  // drop below 158). Juno walks the ledge's top, her feet at 148
  sims: {
    walk: [[4, 146, 286, 146, 286, 151, 4, 151]], window: [60, 148], ladder: [267, 148], sign: [170, 148], drone: [24, 148], ac: [222, 148], jt: [280, 148], garden: [262, 148],
    windowRect: [38, 76, 44, 51], ladderRect: [256, 0, 22, 30], ladderLowRect: [256, 30, 20, 96], belowRect: [0, 158, 320, 22], signRect: [96, 22, 150, 62], acRect: [210, 104, 26, 17],
    jtRect: [276, 102, 15, 13], dronePoly: [4, 57, 39, 57, 39, 67, 29, 67, 29, 84, 15, 84, 15, 67, 4, 67],
    // the garden in the corner: the cactus, the crate, the hanging can and the drum under the broken pipe
    gardenPoly: [279, 116, 291, 116, 296, 92, 304, 92, 311, 122, 320, 122, 320, 149, 279, 149],
  },
  dach: {
    // the old photo's camera (art/ui/deck_wallpaper.px.js): the parapet across the picture, the tar in front of it
    // the notch: the Rain Reader's gutter on its pole and she herself on her bucket, so Juno passes in front of them, never through (the slit: an actor stands on walkable floor, and a click there is a click on her); readerTalk: where Juno stands to talk to her
    walk: [[6, 156, 52, 156, 52, 170, 91, 170, 91, 163, 93, 163, 93, 170, 118, 170, 118, 156, 314, 156, 318, 176, 2, 176]], hatch: [22, 166], edge: [222, 162], reader: [92, 164], readerTalk: [124, 165],
    hatchRect: [4, 114, 28, 40], ringsRect: [0, 0, 320, 22], placeRect: [192, 100, 58, 50], screenRect: [110, 33, 50, 31], noodlesRect: [96, 49, 9, 57], droneRect: [284, 98, 26, 18],
  },
  // the Drain Market seen straight down (art/rooms/drain_market.px.js, kapitel1-design §9): its walk area, places and shapes measured
  // from the approved layout and the painting's parts (game/rooms/drain_market.layout.js, tools/market-layout.mjs). The moving parts lie
  // on the picture behind everyone (an "under" part is its own rect of the floor with the moving thing on it); the steam, then the
  // cables, string lights and lanterns hang over the people. The runtime lamps are the painting's own, so Juno takes on its light
  drain_market: (() => {
    const L = Nagiwa.layouts.drain_market, part = (/** @type {any} */ p) => p.name.slice("drain_market_".length);
    // (kessler: Chapter 2, Kessler with his arm in plaster begging beside Ratz's stall, game/kapitel2_folgen.js)
    return { ...L.spots, kessler: [478, 298], kesslerTalk: [470, 322], ...L.rects, walk: [...L.walk, [1192, 340, 1200, 340, 1200, 370, 1178, 370, 1178, 362, 1192, 362]], holes: L.holes, size: L.size, sounds: L.sounds,
      // Pike on the raft DATA 1C/GB in the canal (Chapter 2; he stands at the end of a slit in the walk area, as Sable does in her booth: an actor stands on walkable floor; the raft's
      // hotspot covers the slit, so nobody walks out onto it), and where Juno stands
      // on the kerb above it (not from the layout: the raft is the painting's, the man on it isn't yet); he stands at the raft's back end,
      // where he punts from (the user, 2026-11-16), the slit bending along the raft to him
      pike: [1182, 366], pikeTalk: [1200, 343], datenflossRect: [1172, 352, 60, 30],
      // the raft's middle, where Juno stands to ride out ("Stell dich in die Mitte.") and how far it goes: out under the Ring's last pillar
      flossJuno: [1204, 360], flossOut: 110,
      // (the data raft floats on the canal's moving water: a step above the floor's parts, under everyone)
      props: L.parts.filter((/** @type {any} */ p) => p.layer === "under" || p.layer === "raft").map((/** @type {any} */ p) => ({ id: part(p), image: p.name, at: p.at, anchor: [0, 0], baseline: p.layer === "raft" ? 1 : 0 })),
      foreground: [...L.parts.filter((/** @type {any} */ p) => p.layer === "over").map((/** @type {any} */ p) => ({ image: p.name, at: p.at })), { image: "drain_market_over", at: [0, 0] }],
      lamps: L.lamps.map((/** @type {any} */ [x, y, color, r], /** @type {number} */ i) => ({ id: `lamp${i}`, at: [x, y], r, color, power: 1 })),
      // the crowd (generated with the layout, seeded): the vendors at their stools behind the counters (apart: where nobody walks), turned
      // to their counters; people walking the lanes along the channel and over the bridges and back; groups standing together in the
      // way (block); people standing about, turning now and then, looking at Juno when she comes near. From above every way is its own
      extras: [
        ...L.crowd.vendors.map((/** @type {any} */ [x, y, n, dir]) => ({ costume: { idle: Nagiwa.top(`haendler_top_${n}_idle`) }, at: [x, y], facing: dir, apart: true, turns: false })),
        ...L.crowd.walkers.map((/** @type {any} */ w) => ({ costume: { idle: Nagiwa.top(`statist_${w.look}_idle`), walk: Nagiwa.top(`statist_${w.look}_walk`) },
          at: w.at, path: w.path, loop: "back", speed: w.speed, pause: w.pause })),
        ...L.crowd.groups.map((/** @type {any} */ [x, y, nn, dir]) => ({ costume: { idle: Nagiwa.top(`statist_${nn}_idle`) }, at: [x, y], facing: dir, block: true, turns: false })),
        ...L.crowd.stand.map((/** @type {any} */ [x, y, nn, dir]) => ({ costume: { idle: Nagiwa.top(`statist_${nn}_idle`) }, at: [x, y], facing: dir })),
        // the busker by the middle bridge (his tune: the ambience strassenmusik), facing the market, never turning away from it
        ((/** @type {any} */ [x, y, nn, dir]) => ({ costume: { idle: Nagiwa.top(`statist_${nn}_idle`) }, at: [x, y], facing: dir, turns: false }))(L.crowd.busker),
      ] };
  })(),
  // Sable's booth as a stage from the front (art/mock/sable_booth.px.js): Sable sits behind the desk (the slit in the walk area: an actor
  // stands on walkable floor), the desk a prop drawn over Sable; the curtain is on the left side wall, so its shape is the wall's trapezoid
  sable_booth: {
    walk: [[16, 142, 156, 142, 156, 130, 164, 130, 164, 142, 300, 142, 316, 178, 4, 178]], arrive: [38, 160], door: [20, 150], front: [118, 158], sable: [160, 130], cage: [270, 152],
    curtainPoly: [6, 69, 28, 71, 28, 128, 6, 136], pricesRect: [196, 62, 74, 25], screensRect: [120, 79, 28, 34], birdRect: [272, 70, 28, 36],
    props: [{ id: "desk", image: "sable_booth_desk", at: [112, 76], anchor: [0, 0], baseline: 141 }],
  },
  // looking from the window at the back wall (as CAM 07V): Okonkwo behind the counter (his bust stands on the walk area's edge, drawn over
  // the counter, as Mei), the safe in its right-hand end; the door to the lane at the front left
  // Okonkwo's shop as a stage (art/rooms/okonkwo_shop.px.js): the counter a prop standing on the floor's back edge, Okonkwo behind it (the slit: an actor
  // stands on walkable floor, as the Rain Reader on the roof)
  okonkwo_shop: {
    walk: [[10, 130, 164, 130, 164, 114, 168, 114, 168, 130, 310, 130, 316, 176, 4, 176]], arrive: [30, 150], door: [16, 136], front: [158, 140], okonkwo: [166, 116], shelves: [124, 138],
    doorRect: [4, 32, 28, 90], shelvesRect: [102, 32, 112, 50], counterRect: [108, 90, 126, 34], photoRect: [222, 50, 18, 16],
    props: [{ id: "counter", image: "okonkwo_shop_counter", at: [171, 125] }],
  },
  // LUCKY STATIC (art/rooms/lucky_static.map.js, game/rooms/lucky_static.layout.js). The stools stand in front of the counter: the
  // props sort by their baselines, and the long counter's lies further down than theirs, so they are drawn after it
  lucky_static: (() => {
    const at = fromLayout(Nagiwa.layouts.lucky_static), c = Nagiwa.layouts.lucky_static.props.counter;
    at.props = at.props.map((/** @type {any} */ p) => (p.id.startsWith("stool") || p.id === "lamps" ? { ...p, baseline: Math.max(p.baseline ?? p.at[1], c.baseline + 1) } : p));
    // the street door is the gap at the near wall's left end (a cut wall has no picture of its own): its hotspot is the map's zone
    // `door` over the sill and the street beyond it; the bar's is the counter's own shape
    return { ...at, barPoly: at.counterPoly };
  })(),
  // SUDS & SPIN (art/rooms/laundromat.map.js, game/rooms/laundromat.layout.js). The door is the gap in the alley's cut wall (a cut
  // wall has no picture of its own): its hotspot is the map's zone `door`. The dryers' shape is the row's, round all eight; the man
  // asleep behind the counter is a figure of his own (art/characters/schlaefer.px.js, his chair in it) standing at the spot `sleeper`
  laundromat: (() => {
    const at = fromLayout(Nagiwa.layouts.laundromat), P = Nagiwa.layouts.laundromat.props;
    // (quiet: Chapter 2's man in white on the open floor, looking at dryer 6, where CAM 23 shows him: game/kapitel2_quiet.js)
    return { ...at, dryersPoly: hull([1, 2, 3, 4, 5, 6, 7, 8].map((n) => P[`dryer${n}`].poly).flat()), quiet: [176, 150] };
  })(),
  cam04: {
    entrance: [100, 43], seatVarga: [149, 132], seatKessler: [156, 94], counter: [176, 69], cook: [182, 50], cookBust: [186, 30],
    win1: [73, 88], win2: [92, 61], mid: [123, 66],
    mic: [150, 126],
    tv: [238, 8, 33, 45], counterBox: [129, 19, 104, 48], table: [119, 71, 58, 71],
    // the hotspots' shapes, measured there too (CAM04_POLYS)
    tvPoly: [239, 30, 249, 8, 252, 9, 270, 28, 255, 52, 252, 52], counterPoly: [130, 27, 134, 20, 229, 28, 233, 35, 219, 67, 135, 58],
  },
};

// Job B's two cameras show places Juno walks (one place, one picture: kapitel0-design §3), so their places come from those rooms.
// CAM 07 is Jade Row's own picture moved right by `shift`, so Okonkwo's shop and the balcony over it clear the cameras' strip: at
// 00:30 Morrow and the Tidewater boy stand in front of the shop at the lane's scale (as Juno would), the patrol car waits down the lane,
// at 01:00 Okonkwo's back is in his door. CAM 07V is the shop's own picture: the machine sees it across the lane as the shop view does
// from the window; Okonkwo stands behind his counter where he stands in the shop, the register's display on it toward the camera.
Nagiwa.at.cam07 = (() => {
  const J = Nagiwa.at.jade_row, S = 48, sh = (/** @type {number[]} */ p) => [p[0] + S, p[1]], r = (/** @type {number[]} */ q) => [q[0] + S, q[1], q[2], q[3]];
  return { shift: S, exposure: 1.3, okonkwo: [Math.round((J.doorPoly[0] + J.doorPoly[2]) / 2) + S, Math.round((J.doorPoly[1] + J.doorPoly[3]) / 2)],   // the middle of his door's sill morrow: sh([66, 152]), boy: sh([98, 154]), car: sh([173, 107]),
    mic: sh(J.shop), windowRect: r(J.windowRect), doorRect: r(J.doorRect), machineRect: r(J.machineRect),
    windowPoly: J.windowPoly.map((/** @type {number} */ v, /** @type {number} */ i) => (i % 2 ? v : v + S)) };
})();
Nagiwa.at.cam07v = (() => {
  const O = Nagiwa.at.okonkwo_shop;
  return { exposure: 1.3, okonkwo: O.okonkwo, mic: O.front, safeRect: [200, 68, 32, 24], shelvesRect: O.shelvesRect, photoRect: O.photoRect };
})();
