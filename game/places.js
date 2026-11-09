// Nagiwa: positions in the rooms, in one place. Street-mode rooms built from a map come measured from their
// bake (game/rooms/<id>.layout.js, written by tools/build_art.sh); the cameras from their layout notes
// (docs/cams/*_layout.md). Rooms, routines and moments read them from here.
"use strict";

/** A room's places from its measured layout: the spots by name, the walk area and holes, the props (as the
 * engine wants them), each prop's shape (`<id>Poly`) and sprite box (`<id>Rect`), each opening's rect. */
function fromLayout(/** @type {any} */ L) {
  /** @type {Record<string, any>} */
  const at = { ...L.spots, walk: L.walk, holes: L.holes, face: L.face, lamps: L.lamps };
  // props seen through an open door are baked into the picture: no sprite of their own
  at.props = Object.entries(L.props).filter(([, p]) => /** @type {any} */ (p).sprite).map(([id, p]) => ({ id, image: /** @type {any} */ (p).sprite, at: /** @type {any} */ (p).at, front: /** @type {any} */ (p).front, baseline: /** @type {any} */ (p).baseline,
    ...(/** @type {any} */ (p).seeThrough ? { seeThrough: true } : {}) }));
  for (const [id, p] of Object.entries(L.props)) { at[`${id}Poly`] = /** @type {any} */ (p).poly; at[`${id}Rect`] = /** @type {any} */ (p).box; }
  for (const [id, r] of Object.entries(L.openings ?? {})) at[`${id}Rect`] = r;
  return at;
}

Nagiwa.at = {
  // measured from the flat's map and its bake (art/rooms/flat.map.js, game/rooms/flat.layout.js)
  flat: fromLayout(Nagiwa.layouts.flat),
  // the 14th floor's landing (art/rooms/kessel_14.map.js, game/rooms/kessel_14.layout.js)
  kessel_14: fromLayout(Nagiwa.layouts.kessel_14),
  // the lobby (art/rooms/kessel_lobby.map.js, game/rooms/kessel_lobby.layout.js)
  kessel_lobby: fromLayout(Nagiwa.layouts.kessel_lobby),
  // the observation hall, the intro's shot 1 (art/rooms/hall.map.js, game/rooms/hall.layout.js)
  hall: fromLayout(Nagiwa.layouts.hall),
  // Kowalski Street (art/rooms/kowalski.map.js, game/rooms/kowalski.layout.js)
  kowalski: {
    fromGasse: [346, 170],
    // (the passage to Jade Row is the map's opening and spot "west": westRect, west)
    ...fromLayout(Nagiwa.layouts.kowalski),
    // the alley's gate standing open, laid over the picture from Chapter 1 on (art/rooms/kowalski.px.js)
    alleyOpen: Nagiwa.layouts.kowalski.alleyOpen,
    // the room's effects, on the screen (from the map's projection): the light hanging in the rain out of
    // LUCKY STATIC's door and under the ad screen, glints on the puddles, drops off an AC unit, the Kessel
    // Block's transom and the cornice by the alley
    hazeDoor: [31, 78, 60, 64, 111, 156, 82, 170], hazeAd: [258, 68, 367, 123, 329, 173, 220, 119],
    glints: [[264, 164], [123, 150], [130, 169], [285, 158]],
    drips: [[247, 2, 95], [166, 8, 77], [396, 88, 170]],
    // the implant's brackets round the ad screen in the JUNO. moment
    adMark: [Nagiwa.layouts.kowalski.openings.ad[0] - 3, Nagiwa.layouts.kowalski.openings.ad[1] + 2,
      Nagiwa.layouts.kowalski.openings.ad[2] + 6, Nagiwa.layouts.kowalski.openings.ad[3] + 1],
    // Bao's hotspot: his top half over the counter (the cart's own below it)
    baoRect: [Nagiwa.layouts.kowalski.spots.bao[0] - 15, Nagiwa.layouts.kowalski.spots.bao[1] - 48, 31, 25],
  },
  // measured from the cameras' projections (docs/cams/cam03_layout.md, cam04_layout.md). No depth `scale`: the
  // feed figures stay at their drawn size (scaling 24 px pixel art by 0.7–1.9 would smear it; the seated
  // people in cam04 are drawn at their size there)
  cam03: {
    door: [100, 58], awning: [108, 145], awningFar: [128, 41], vendingSpot: [85, 84], far: [271, 77],
    exitRight: [309, 133], exitFar: [192, 20],
    mic: [108, 145],
    mast: [271, 23, 22, 15], vending: [68, 45, 31, 36], officeDoor: [74, 20, 23, 47],
  },
  // Chapter 1's blocks (art/mock/ch1_blocks.px.js)
  // (the left column of every feed is the cameras' strip, x 4 to 74, and the top left its name: nothing that matters lies there)
  cam21: { door: [152, 80], walkOff: [300, 110], queue: [[86, 96], [102, 100], [118, 104], [134, 108]], menu: [238, 134, 28, 28], clinic: [130, 26, 44, 50], mic: [152, 90] },
  // the 14th floor's own picture and props (game/rooms/kessel.js), moved right by `shift` so Frau Haldane's door clears the strip: she
  // comes out of it and walks to the papers at the head of the stairs
  cam14: (() => {
    const L = Nagiwa.layouts.kessel_14, S = 56, dh = L.openings.door_haldane, dj = L.openings.door_juno;
    return { shift: S, door: [dh[0] + dh[2] / 2 + S, dh[1] + dh[3] - 2], mat: [L.spots.stairs[0] - 24 + S, L.spots.stairs[1] + 4], mic: [180, 130], exposure: 2.2,
      doorsRect: [dh[0] + S, dj[1], dj[0] + dj[2] - dh[0], dh[1] + dh[3] - dj[1]] };
  })(),
  cam18: { mic: [150, 100], sign: [176, 27, 56, 26], stairs: [100, 70, 120, 90] },
  cam22: { seat: [120, 112], mic: [120, 100], bar: [80, 118, 216, 20] },
  // CAM 23 is the laundromat's own picture (one place, one picture: kapitel0-design §3), moved right by `shift` so the washers clear
  // the cameras' strip; Ines stands where Juno would: at a washer on Wednesday, at dryer 6 on Thursday
  cam23: (() => {
    const L = Nagiwa.layouts.laundromat, S = 24, sh = (/** @type {number[]} */ p) => [p[0] + S, p[1]];
    const boxes = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => L.props[`dryer${n}`].box), c = L.props.counter.box;
    const x0 = Math.min(...boxes.map((b) => b[0])), y0 = Math.min(...boxes.map((b) => b[1]));
    const x1 = Math.max(...boxes.map((b) => b[0] + b[2])), y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
    return { shift: S, exposure: 2.2, dryer6: sh(L.spots.dryer6), washer: sh(L.spots.washer), sleeper: sh(L.spots.sleeper), mic: sh(L.spots.dryer6),
      dryers: [x0 + S, y0, x1 - x0, y1 - y0], desk: [c[0] + S, c[1], c[2], c[3]] };
  })(),
  cam24: { door: [160, 96], off: [104, 174], mic: [160, 110], entrance: [124, 24, 72, 66] },
  // job B (game/auftrag_tide.js): Jade Row from Nagi·wa's camera above it, and from the machine's own at hip height
  cam15: { door: [160, 150], spot: [271, 100], mic: [200, 100], capsules: [84, 28, 229, 52], c23: [258, 28, 26, 25] },
  cam30: { top: [160, 84], water: [160, 146], board: [222, 112], mic: [160, 100], sign: [88, 30, 144, 11], tide: [232, 52, 56, 36] },
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
      hazeDoor: cone(1.08, 0.3, 2.25, 0.45), hazeStatue: cone(2.95, 3.65, 3.15, 0.65), adAt: Nagiwa.layouts.gasse.openings.ad.slice(0, 2) };
  })(),
  // the lane left of Kowalski Street, down its length (art/mock/jade_row.px.js: blocks, z = 1 where Juno walks, 30 px to the metre there). She keeps to the near band: her
  // sprite has one size, right for that depth, so the shop's door and the machine are reached from in front of them
  jade_row: {
    walk: [[67, 142, 253, 142, 306, 176, 14, 176]], arrive: [292, 172], back: [292, 172], mid: [186, 158], shop: [78, 146], machine: [232, 146], soup: [214, 144], far: [160, 143], parlour: [112, 143], pharmacy: [196, 143],
    backRect: [278, 54, 42, 122], windowRect: [55, 87, 20, 50], doorRect: [77, 82, 22, 54], signRect: [53, 60, 38, 26], machineRect: [232, 84, 28, 58], soupRect: [212, 82, 20, 50],
    parlourRect: [118, 88, 8, 26], arcadeRect: [100, 90, 16, 32], balconyRect: [44, 20, 58, 46], nightRect: [212, 8, 43, 62], carRect: [168, 92, 24, 17], pharmacyRect: [195, 88, 13, 24], gateRect: [136, 50, 48, 46], screenRect: [136, 4, 48, 44], signsRect: [195, 56, 22, 32],
  },
  // outside the flat's window: the ledge (kapitel1-design, "Die Stadt")
  sims: {
    walk: [[20, 128, 300, 128, 300, 152, 20, 152]], window: [50, 140], ladder: [262, 140],
    windowRect: [28, 62, 44, 62], ladderRect: [250, 0, 26, 40], belowRect: [0, 156, 320, 24],
  },
  dach: {
    // the old photo's camera (art/ui/deck_wallpaper.px.js): the parapet across the picture, the tar in front of it
    // the notch: the Rain Reader's gutter on its pole and she herself on her bucket, so Juno passes in front of them, never through (the slit: an actor stands on walkable floor, and a click there is a click on her); readerTalk: where Juno stands to talk to her
    walk: [[6, 156, 52, 156, 52, 170, 91, 170, 91, 163, 93, 163, 93, 170, 118, 170, 118, 156, 314, 156, 318, 176, 2, 176]], hatch: [22, 166], edge: [222, 162], reader: [92, 164], readerTalk: [124, 165],
    hatchRect: [4, 114, 28, 40], ringsRect: [0, 0, 320, 22], placeRect: [192, 100, 58, 50], screenRect: [110, 33, 50, 31], noodlesRect: [96, 49, 9, 57], droneRect: [284, 98, 26, 18],
  },
  drain_market: {
    walk: [[12, 118, 308, 118, 316, 176, 4, 176]], arrive: [24, 150], up: [12, 148], preacher: [226, 148], stalls: [110, 124], curtain: [284, 124],
    ratz: [190, 126], ratzTalk: [168, 134],
    upRect: [0, 50, 18, 120], kidneysRect: [30, 56, 66, 52], jarsRect: [106, 56, 58, 52], stallsRect: [170, 56, 30, 52], curtainRect: [262, 50, 44, 66],
  },
  sable_booth: {
    walk: [[12, 118, 308, 118, 316, 176, 4, 176]], arrive: [24, 150], door: [10, 150], front: [150, 128], sable: [176, 118],
    curtainRect: [0, 50, 16, 126], pricesRect: [224, 14, 86, 36], screensRect: [112, 42, 100, 38], birdRect: [36, 40, 30, 44],
  },
  // looking from the window at the back wall (as CAM 07V): Okonkwo behind the counter (his bust stands on the walk area's edge, drawn over
  // the counter, as Mei), the safe in its right-hand end; the door to the lane at the front left
  // Okonkwo's shop as a stage (art/mock/ch1_blocks.px.js): the counter a prop standing on the floor's back edge, Okonkwo behind it (the slit: an actor
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
    // the street door is the gap at the near wall's left end (a cut wall has no picture of its own): its hotspot stands over it
    return { ...at, barRect: c.box, doorRect: [12, 116, 40, 40] };
  })(),
  // SUDS & SPIN (art/rooms/laundromat.map.js, game/rooms/laundromat.layout.js). The door is the gap in the alley's cut wall (a cut
  // wall has no picture of its own): its hotspot stands over it. The dryers' rect is the row's; the man asleep behind the counter is a
  // block of his own (art/mock/ch1_blocks.px.js) standing at the spot `sleeper`
  laundromat: (() => {
    const at = fromLayout(Nagiwa.layouts.laundromat), P = Nagiwa.layouts.laundromat.props;
    const boxes = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => P[`dryer${n}`].box);
    const x0 = Math.min(...boxes.map((b) => b[0])), y0 = Math.min(...boxes.map((b) => b[1]));
    const x1 = Math.max(...boxes.map((b) => b[0] + b[2])), y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
    return { ...at, dryersRect: [x0, y0, x1 - x0, y1 - y0], doorRect: [12, 114, 40, 40] };
  })(),
  cam04: {
    entrance: [100, 43], seatVarga: [149, 132], seatKessler: [156, 94], counter: [176, 69], cook: [182, 50], cookBust: [186, 30],
    win1: [73, 88], win2: [92, 61], mid: [123, 66],
    mic: [150, 126],
    tv: [238, 8, 33, 45], counterBox: [129, 19, 104, 48], table: [119, 71, 58, 71],
  },
};

// Job B's two cameras show places Juno walks (one place, one picture: kapitel0-design §3), so their places come from those rooms.
// CAM 07 is Jade Row's own picture moved right by `shift`, so Okonkwo's shop and the balcony over it clear the cameras' strip: at
// 00:30 Morrow and the Tidewater boy stand in front of the shop at the lane's scale (as Juno would), the patrol car waits down the lane,
// at 01:00 Okonkwo's back is in his door. CAM 07V is the shop's own picture: the machine sees it across the lane as the shop view does
// from the window; Okonkwo stands behind his counter where he stands in the shop, the register's display on it toward the camera.
Nagiwa.at.cam07 = (() => {
  const J = Nagiwa.at.jade_row, S = 48, sh = (/** @type {number[]} */ p) => [p[0] + S, p[1]], r = (/** @type {number[]} */ q) => [q[0] + S, q[1], q[2], q[3]];
  return { shift: S, exposure: 1.3, okonkwo: [J.doorRect[0] + 11 + S, J.doorRect[1] + J.doorRect[3]], morrow: sh([66, 152]), boy: sh([98, 154]), car: sh([142, 112]),
    mic: sh(J.shop), windowRect: r(J.windowRect), doorRect: r(J.doorRect), machineRect: r(J.machineRect) };
})();
Nagiwa.at.cam07v = (() => {
  const O = Nagiwa.at.okonkwo_shop;
  return { exposure: 1.3, okonkwo: O.okonkwo, mic: O.front, safeRect: [200, 68, 32, 24], shelvesRect: O.shelvesRect, photoRect: O.photoRect };
})();
