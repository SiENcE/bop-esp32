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
  cam23: { dryer6: [232, 76], counter: [262, 150], mic: [200, 100], dryers: [80, 28, 220, 40], desk: [268, 80, 44, 60] },
  cam24: { door: [160, 96], off: [104, 174], mic: [160, 110], entrance: [124, 24, 72, 66] },
  // job B (game/auftrag_tide.js): Jade Row from Nagi·wa's camera above it, and from the machine's own at hip height
  cam07: { okonkwo: [118, 104], car: [244, 144], morrow: [214, 146], boy: [196, 148], mic: [200, 124], windowRect: [80, 44, 70, 68], machineRect: [280, 60, 22, 54] },
  cam07v: { counter: [160, 100], safe: [214, 132], mic: [160, 110], safeRect: [196, 104, 40, 26], shelvesRect: [84, 24, 152, 40] },
  cam15: { door: [160, 150], spot: [271, 100], mic: [200, 100], capsules: [84, 28, 229, 52], c23: [258, 28, 26, 25] },
  cam30: { top: [160, 84], water: [160, 146], board: [222, 112], mic: [160, 100], sign: [88, 30, 144, 11], tide: [232, 52, 56, 36] },
  // measured from the camera in art/cams/cam31.px.js (it logs them when built)
  cam31: { stairs: [96, 83], top: [92, 67], shadow: [59, 92], edge: [151, 117], meet: [112, 99], asheMeet: [97, 90], tunnel: [284, 111], lantern: [183, 131], mic: [135, 108], tries: [244, 26, 72] },
  gasse: {
    walk: [[10, 112, 310, 112, 318, 176, 2, 176]], arrive: [24, 150], kowalski: [14, 150], laundromat: [260, 116], market: [150, 116], niche: [52, 116],
    kowalskiRect: [0, 110, 26, 70], laundromatRect: [232, 40, 56, 64], marketRect: [114, 30, 72, 74], nicheRect: [30, 44, 44, 60], cablesRect: [0, 10, 320, 28],
  },
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
  okonkwo_shop: {
    walk: [[12, 124, 308, 124, 316, 176, 4, 176]], arrive: [30, 150], door: [12, 150], front: [142, 146], okonkwo: [178, 124], shelves: [110, 132],
    doorRect: [0, 50, 18, 120], shelvesRect: [30, 24, 180, 62], counterRect: [70, 92, 180, 28], photoRect: [220, 40, 30, 24],
  },
  // LUCKY STATIC (art/rooms/lucky_static.map.js, game/rooms/lucky_static.layout.js). The stools stand in front of the counter: the
  // props sort by their baselines, and the long counter's lies further down than theirs, so they are drawn after it
  lucky_static: (() => {
    const at = fromLayout(Nagiwa.layouts.lucky_static), c = Nagiwa.layouts.lucky_static.props.counter;
    at.props = at.props.map((/** @type {any} */ p) => (p.id.startsWith("stool") ? { ...p, baseline: Math.max(p.baseline ?? p.at[1], c.baseline + 1) } : p));
    // the street door is the gap at the near wall's left end (a cut wall has no picture of its own): its hotspot stands over it
    return { ...at, barRect: c.box, doorRect: [12, 116, 40, 40] };
  })(),
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
