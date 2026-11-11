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
    // Bao's hotspot: his top half over the counter (the cart's own below it), his head and shoulders' shape, no floor beside him
    baoPoly: ((x, y) => [x - 6, y - 49, x + 6, y - 49, x + 9, y - 37, x + 11, y - 23, x - 11, y - 23, x - 9, y - 37])(...Nagiwa.layouts.kowalski.spots.bao),
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
  // Chapter 1's blocks (art/mock/ch1_blocks.px.js)
  // (the left column of every feed is the cameras' strip, x 4 to 74, and the top left its name: nothing that matters lies there)
  cam21: { door: [152, 80], walkOff: [300, 110], queue: [[86, 96], [102, 100], [118, 104], [134, 108]], menu: [238, 134, 28, 28], clinic: [130, 26, 44, 50], mic: [152, 90] },
  // the 14th floor's own picture and props (game/rooms/kessel.js), 352 wide, moved left by 32 (`shift`) so its right edge is the
  // feed's: Frau Haldane comes out of her door beside the lift and walks to the papers at the head of the stairs (the cameras' strip
  // covers Juno's door)
  cam14: (() => {
    const L = Nagiwa.layouts.kessel_14, S = -32, q = L.openingPolys.door_haldane;
    const foot = [[q[0], q[1]], [q[2], q[3]], [q[4], q[5]], [q[6], q[7]]].sort((a, b) => b[1] - a[1]).slice(0, 2);
    return { shift: S, door: [Math.round((foot[0][0] + foot[1][0]) / 2) + S, Math.round((foot[0][1] + foot[1][1]) / 2) - 2],
      mat: [L.spots.stairs[0] - 24 + S, L.spots.stairs[1] + 4], mic: [180, 130], exposure: 2.2,
      // her door's own shape on its wall
      doorPoly: q.map((v, i) => (i % 2 ? v : v + S)) };
  })(),
  // almost straight down over the stairs (art/cams/cam18.px.js, measured there: CAM18_LAYOUT): the fish painted over the steps lies on
  // them, its hotspot over theirs
  cam18: { mic: [154, 93], fish: [128, 43, 53, 107], stairs: [113, 32, 88, 117],
    fishPoly: [127, 137, 133, 84, 135, 73, 138, 64, 143, 56, 148, 49, 153, 46, 159, 44, 164, 47, 169, 52, 172, 59, 174, 68, 175, 78, 171, 142],
    stairsPoly: [114, 139, 118, 33, 201, 42, 183, 148] },
  cam22: { seat: [120, 112], mic: [120, 100], bar: [80, 118, 216, 20] },
  // CAM 23 is the laundromat's own picture (one place, one picture: kapitel0-design §3), moved right by `shift` so the washers clear
  // the cameras' strip; Ines stands where Juno would: at a washer on Wednesday, at dryer 6 on Thursday
  cam23: (() => {
    const L = Nagiwa.layouts.laundromat, S = 24, sh = (/** @type {number[]} */ p) => [p[0] + S, p[1]];
    const boxes = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => L.props[`dryer${n}`].box), c = L.props.counter.box;
    const x0 = Math.min(...boxes.map((b) => b[0])), y0 = Math.min(...boxes.map((b) => b[1]));
    const x1 = Math.max(...boxes.map((b) => b[0] + b[2])), y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
    return { shift: S, exposure: 2.2, dryer6: sh(L.spots.dryer6), washer: sh(L.spots.washer), sleeper: sh(L.spots.sleeper), mic: sh(L.spots.dryer6),
      dryers: [x0 + S, y0, x1 - x0, y1 - y0], desk: [c[0] + S, c[1], c[2], c[3]],
      // the hotspots' shapes: the row of dryers round all eight, the counter's own outline (as in the laundromat)
      dryersPoly: hull([1, 2, 3, 4, 5, 6, 7, 8].map((n) => L.props[`dryer${n}`].poly).flat()).map((v, i) => (i % 2 ? v : v + S)),
      deskPoly: (L.props.counter.shape ?? L.props.counter.poly).map((/** @type {number} */ v, /** @type {number} */ i) => (i % 2 ? v : v + S)) };
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
  // the lane left of Kowalski Street, down its length (painted on its blocks' lines: art/rooms/jade_row.px.js, art/old/jade_row_blocks.px.js; z = 1 where Juno walks, 30 px to the metre there). She keeps to the near band: her
  // sprite has one size, right for that depth, so the shop's door and the machine are reached from in front of them
  jade_row: {
    walk: [[67, 142, 253, 142, 306, 176, 14, 176]], arrive: [292, 172], back: [292, 172], mid: [186, 158], shop: [56, 158], machine: [232, 146], soup: [214, 144], far: [160, 143], parlour: [112, 143], pharmacy: [196, 143],
    backRect: [278, 54, 42, 122], windowRect: [60, 84, 38, 50], doorRect: [36, 84, 24, 78], signRect: [0, 52, 98, 30], machineRect: [232, 84, 28, 57], soupRect: [212, 82, 20, 50],
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
  // the Drain Market seen straight down (art/rooms/drain_market.px.js, kapitel1-design §9): its walk area, places and shapes measured
  // from the approved layout and the painting's parts (game/rooms/drain_market.layout.js, tools/market-layout.mjs). The moving parts lie
  // on the picture behind everyone (an "under" part is its own rect of the floor with the moving thing on it); the steam, then the
  // cables, string lights and lanterns hang over the people. The runtime lamps are the painting's own, so Juno takes on its light
  drain_market: (() => {
    const L = Nagiwa.layouts.drain_market, part = (/** @type {any} */ p) => p.name.slice("drain_market_".length);
    return { ...L.spots, ...L.rects, walk: L.walk, holes: L.holes, size: L.size, sounds: L.sounds,
      props: L.parts.filter((/** @type {any} */ p) => p.layer === "under").map((/** @type {any} */ p) => ({ id: part(p), image: p.name, at: p.at, anchor: [0, 0], baseline: 0 })),
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
    // the street door is the gap at the near wall's left end (a cut wall has no picture of its own): its hotspot is the map's zone
    // `door` over the sill and the street beyond it; the bar's is the counter's own shape
    return { ...at, barPoly: at.counterPoly };
  })(),
  // SUDS & SPIN (art/rooms/laundromat.map.js, game/rooms/laundromat.layout.js). The door is the gap in the alley's cut wall (a cut
  // wall has no picture of its own): its hotspot is the map's zone `door`. The dryers' shape is the row's, round all eight; the man
  // asleep behind the counter is a block of his own (art/mock/ch1_blocks.px.js) standing at the spot `sleeper`
  laundromat: (() => {
    const at = fromLayout(Nagiwa.layouts.laundromat), P = Nagiwa.layouts.laundromat.props;
    return { ...at, dryersPoly: hull([1, 2, 3, 4, 5, 6, 7, 8].map((n) => P[`dryer${n}`].poly).flat()) };
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
