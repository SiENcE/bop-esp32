// Halcyon: positions in the rooms, in one place. Street-mode rooms built from a map come measured from their
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

Halcyon.at = {
  // measured from the flat's map and its bake (art/rooms/flat.map.js, game/rooms/flat.layout.js)
  flat: fromLayout(Halcyon.layouts.flat),
  // the 14th floor's landing (art/rooms/kessel_14.map.js, game/rooms/kessel_14.layout.js)
  kessel_14: fromLayout(Halcyon.layouts.kessel_14),
  // the lobby (art/rooms/kessel_lobby.map.js, game/rooms/kessel_lobby.layout.js)
  kessel_lobby: fromLayout(Halcyon.layouts.kessel_lobby),
  // the observation hall, the intro's shot 1 (art/rooms/hall.map.js, game/rooms/hall.layout.js)
  hall: fromLayout(Halcyon.layouts.hall),
  // Kowalski Street (art/rooms/kowalski.map.js, game/rooms/kowalski.layout.js)
  kowalski: {
    fromGasse: [346, 170], reparatur: [300, 134],
    ...fromLayout(Halcyon.layouts.kowalski),
    // the room's effects, on the screen (from the map's projection): the light hanging in the rain out of
    // LUCKY STATIC's door and under the ad screen, glints on the puddles, drops off an AC unit, the Kessel
    // Block's transom and the cornice by the alley
    hazeDoor: [31, 78, 60, 64, 111, 156, 82, 170], hazeAd: [258, 68, 367, 123, 329, 173, 220, 119],
    glints: [[264, 164], [123, 150], [130, 169], [285, 158]],
    drips: [[247, 2, 95], [166, 8, 77], [396, 88, 170]],
    // the implant's brackets round the ad screen in the JUNO. moment
    adMark: [Halcyon.layouts.kowalski.openings.ad[0] - 3, Halcyon.layouts.kowalski.openings.ad[1] + 2,
      Halcyon.layouts.kowalski.openings.ad[2] + 6, Halcyon.layouts.kowalski.openings.ad[3] + 1],
    // Bao's hotspot: his top half over the counter (the cart's own below it)
    baoRect: [Halcyon.layouts.kowalski.spots.bao[0] - 15, Halcyon.layouts.kowalski.spots.bao[1] - 48, 31, 25],
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
  cam21: { door: [152, 80], walkOff: [300, 110], queue: [[70, 96], [86, 100], [102, 104], [118, 108]], menu: [238, 134, 28, 28], clinic: [130, 26, 44, 50], mic: [152, 90] },
  cam14: { door: [97, 112], mat: [190, 116], mic: [150, 100], doorsRect: [70, 30, 170, 58] },
  cam18: { mic: [150, 100], sign: [176, 22, 56, 26], stairs: [100, 70, 120, 90] },
  cam22: { seat: [120, 112], door: [20, 100], mic: [120, 100], bar: [24, 118, 272, 20] },
  cam23: { door: [300, 150], dryer6: [168, 76], counter: [262, 150], mic: [168, 100], dryers: [16, 28, 236, 40], tickets: [268, 80, 44, 60] },
  cam24: { door: [160, 96], off: [40, 150], mic: [160, 110], entrance: [124, 24, 72, 66] },
  cam12: { top: [160, 66], bottom: [160, 148], mic: [160, 100], ladder: [140, 60, 40, 90] },
  cam15: { door: [60, 150], spot: [262, 100], mic: [160, 100], capsules: [44, 28, 272, 52], c23: [248, 28, 30, 25] },
  cam30: { top: [160, 84], water: [160, 146], mic: [160, 100], sign: [88, 30, 144, 11] },
  // measured from the camera in art/cams/cam31.px.js (it logs them when built)
  cam31: { stairs: [96, 83], top: [92, 67], shadow: [59, 92], edge: [151, 117], meet: [112, 99], asheMeet: [97, 90], tunnel: [284, 111], lantern: [183, 131], mic: [135, 108], tries: [244, 26, 72] },
  gasse: {
    walk: [[10, 112, 310, 112, 318, 176, 2, 176]], arrive: [24, 150], kowalski: [14, 150], laundromat: [260, 116], market: [150, 132], niche: [52, 116],
    kowalskiRect: [0, 110, 26, 70], laundromatRect: [232, 40, 56, 64], marketRect: [112, 122, 76, 30], nicheRect: [30, 44, 44, 60], cablesRect: [0, 10, 320, 28],
  },
  // outside the flat's window: the ledge (kapitel1-design, "Die Stadt")
  sims: {
    walk: [[20, 128, 300, 128, 300, 152, 20, 152]], window: [50, 140], ladder: [262, 140],
    windowRect: [28, 62, 44, 62], ladderRect: [250, 0, 26, 92], belowRect: [0, 156, 320, 24],
  },
  dach: {
    // the old photo's camera (art/ui/deck_wallpaper.px.js): the parapet across the picture, the tar in front of it
    walk: [[6, 156, 314, 156, 318, 176, 2, 176]], hatch: [22, 166], edge: [222, 162], reader: [92, 164],
    hatchRect: [4, 114, 28, 40], ringsRect: [0, 0, 320, 22], placeRect: [192, 100, 58, 50], screenRect: [110, 33, 50, 31], noodlesRect: [96, 49, 9, 57], droneRect: [284, 98, 26, 18],
  },
  drain_market: {
    walk: [[12, 118, 308, 118, 316, 176, 4, 176]], arrive: [24, 150], up: [12, 148], preacher: [226, 148], stalls: [110, 124], curtain: [284, 124],
    upRect: [0, 50, 18, 120], kidneysRect: [30, 56, 66, 52], jarsRect: [106, 56, 58, 52], stallsRect: [170, 56, 30, 52], curtainRect: [262, 50, 44, 66],
  },
  sable_booth: {
    walk: [[12, 118, 308, 118, 316, 176, 4, 176]], arrive: [24, 150], door: [10, 150], front: [150, 128], sable: [176, 118],
    curtainRect: [0, 50, 16, 126], pricesRect: [224, 14, 86, 36], screensRect: [112, 42, 100, 38], birdRect: [36, 40, 30, 44],
  },
  lucky_static: {
    walk: [[12, 118, 308, 118, 316, 176, 4, 176]], arrive: [24, 150], door: [10, 150], bar: [200, 122], imai: [110, 134],
    doorRect: [0, 60, 14, 116], barRect: [150, 70, 160, 40], karaokeRect: [40, 56, 34, 56],
  },
  laundromat: {
    walk: [[12, 108, 308, 108, 316, 176, 4, 176]], arrive: [18, 130], door: [10, 130], dryer6: [168, 110], counter: [270, 128],
    doorRect: [0, 40, 14, 100], dryer6Rect: [152, 50, 25, 46], dryersRect: [12, 50, 224, 46], counterRect: [252, 90, 58, 34],
  },
  cam04: {
    entrance: [100, 43], seatVarga: [149, 132], seatKessler: [156, 94], counter: [176, 69], cook: [182, 50], cookBust: [186, 30],
    win1: [73, 88], win2: [92, 61], mid: [123, 66],
    mic: [150, 126],
    tv: [238, 8, 33, 45], counterBox: [129, 19, 104, 48], table: [119, 71, 58, 71],
  },
};
