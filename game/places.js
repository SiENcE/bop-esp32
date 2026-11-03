// Halcyon: positions in the rooms, in one place (from the art's layout notes: docs/rooms/*_layout.md,
// docs/cams/*_layout.md). Rooms, routines and moments read them from here.
"use strict";

Halcyon.at = {
  // measured from the art (docs/rooms/flat_layout.md)
  flat: {
    start: [186, 106], deck: [186, 106], fridge: [148, 83], bed: [138, 114], box: [132, 137], window: [262, 140],
    laundry: [250, 132], noodles: [234, 122], pinboard: [146, 110], door: [42, 134], arrive: [46, 134],
    walk: [[146,78, 208,109, 190,118, 212,129, 234,118, 290,146, 228,177, 104,177, 26,138, 64,119, 112,143, 140,129, 120,119, 164,97, 136,83]],
    holes: [],
    props: [
      { id: "fridge", image: "flat_fridge", at: [166, 82], front: [128,61, 148,71, 166,80, 184,71, 204,61], baseline: 80 },
      { id: "deck", image: "flat_deck", at: [207, 115], front: [148,75, 168,85, 224,113, 246,102, 266,92], baseline: 113 },
      { id: "noodles", image: "flat_noodles", at: [247, 113], front: [212,101, 232,111, 246,118, 260,111, 280,101], baseline: 118 },
      { id: "chair", image: "flat_chair", at: [209, 123], front: [178,108, 198,118, 210,124, 222,118, 242,108], baseline: 124 },
      { id: "bed", image: "flat_bed", at: [109, 131], front: [42,104, 62,114, 92,129, 156,97, 176,87], baseline: 129 },
      { id: "laundry", image: "flat_laundry", at: [270, 124], front: [236,111, 256,121, 276,131, 290,124, 310,114], baseline: 131 },
      { id: "box_old", image: "flat_box", at: [114, 139], front: [80,119, 100,129, 116,137, 132,129, 152,119], baseline: 137 },
    ],
    bedPoly: [126,73, 156,88, 156,97, 92,129, 62,114, 62,105],
    fridgePoly: [166,31, 184,40, 184,71, 166,80, 148,71, 148,40],
    deckPoly: [190,34, 246,62, 246,102, 224,113, 168,85, 168,45],
    windowRect: [262, 70, 52, 53], doorRect: [20, 80, 32, 56], laundryRect: [254, 112, 32, 12],
    noodlesRect: [235, 93, 24, 20], pinboardRect: [75, 49, 38, 39], boxRect: [95, 111, 38, 28],
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
  cam04: {
    entrance: [100, 43], seatVarga: [149, 132], seatKessler: [156, 94], counter: [176, 69], cook: [182, 50],
    win1: [73, 88], win2: [92, 61], mid: [123, 66],
    mic: [150, 126],
    tv: [238, 8, 33, 45], counterBox: [129, 19, 104, 48], table: [119, 71, 58, 71],
  },
};
