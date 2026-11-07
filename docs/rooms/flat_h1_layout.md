> Superseded (H1c, 2026-11-04): the old flat at 18 px/m. The flat is now baked from its map (`art/rooms/flat.map.js`); its numbers are measured into `game/rooms/flat.layout.js` by `sh tools/build_art.sh room flat`.

# flat layout: Juno's flat, Kessel Block, 14th floor

Art: `art/rooms/flat.px.js` → `flat_bg` and the prop sprites, packed into `assets/room_flat.js`
(`sh tools/build_art.sh room flat`). Review: `flat_x3.png` (the room as the engine draws it: the props
at their `at`, sorted by their front lines, Juno `juno_idle_se` by the deck for scale) and
`flat_layout_x3.png` (the numbers below over the dimmed picture: walk area cyan, the hole red, front
lines magenta, hotspot rects as cyan corners, hotspot polys cyan, spots yellow, lamps white), both from
`art/rooms/flat_review.px.js`.

All numbers are **measured**: they are computed in the art file (`FLAT.layout`, at its end) from the
same footprints and wall positions the drawing uses, and the review build prints them
(`PXL build art/rooms/flat_review.px.js --only review_flat` prints `FLAT_LAYOUT {...}`). The prop
boxes match the built sprites' sizes exactly. Change the drawing, then re-measure; never edit these by
hand.

## The room

| | |
|---|---|
| Projection | `P(u, v, h) = [166 + 2u - 2v, 62 + u + v - h]`: back corner at (166, 62); `u` along the right wall (4.75 m, 76 units), `v` along the left wall (4.75 m, 76 units); walls 52 px (2.9 m); front walls cut to a 5 px stub over the slab's section |
| Right wall | the deck (desk, rig, a wide screen with the post-it, an old CRT with the phosphor feed, a small screen on a wall arm), the chair pulled out, the noodle-cup tower, the laundry under the window, the window (rain, the HOTEL neon, the ad screen's edge) |
| Left wall | the fridge in the corner, the floor lamp, the bed with the pinboard over it, the old box at the bed's front corner, a calendar (one day ringed red), the light switch, the door near the front (red LED on the lock, the hallway's light under it) |
| Loop | `flat_bg` and `flat_deck`: 12 frames at 10 fps. The rain and two drops on the glass, the neon's T stutters on frames 7, 8 and 10; the screens scroll, the cursor blinks, the CRT's roll bar crawls, REC blinks |

## Walk area (Cutaway `walk`, flat x, y lists)

```js
walk: [[146,78, 208,109, 190,118, 212,129, 234,118, 290,146, 228,177, 104,177, 26,138, 64,119, 112,143, 140,129, 120,119, 164,97, 136,83]],
holes: [[158,96, 170,102, 158,108, 146,102]],   // the floor lamp's foot
```

One area, notched round what stands against the walls (2 units, 12 cm, of margin): the corridor in
front of the fridge and the deck, round the chair, along the window, the open floor down to the screen's
bottom (y 177), round the box and the bed, the strip in front of the door. The floor lamp stands free:
its foot is the hole.

## Props (sprites, anchored bottom-centre)

`at` is where the sprite's bottom-centre lands; `front` is its footprint's front V, each edge carried on
10 units past its corner (beyond a front line's ends the engine takes the end's y; the extension makes
"in front" exact for anyone in front of either edge, e.g. just left of the desk); `baseline` is the
footprint's front corner (orders the props among themselves).

| prop | size | at | front | baseline | footprint (u, v, du, dv) |
|---|---|---|---|---|---|
| `flat_fridge` | 38x47 | 166, 82 | 128,61, 148,71, 166,80, 184,71, 204,61 | 80 | 0, 0, 9, 9 |
| `flat_lamp` | 12x37 | 159, 104 | 134,92, 154,102, 158,104, 162,102, 182,92 | 104 | 17, 21, 2, 2 |
| `flat_deck` (12 frames) | 80x68 | 207, 115 | 148,75, 168,85, 224,113, 246,102, 266,92 | 113 | 12, 0, 28, 11 |
| `flat_noodles` | 24x20 | 247, 113 | 212,101, 232,111, 246,118, 260,111, 280,101 | 118 | 41, 1, 7, 7 |
| `flat_chair` | 24x31 | 209, 123 | 178,108, 198,118, 210,124, 222,118, 242,108 | 124 | 36, 14, 6, 6 |
| `flat_bed` | 96x57 | 109, 131 | 42,104, 62,114, 92,129, 156,97, 176,87 | 129 | 0, 20, 15, 32 |
| `flat_laundry` | 32x12 | 270, 124 | 236,111, 256,121, 276,131, 290,124, 310,114 | 131 | 52, 0, 10, 7 |
| `flat_box` | 38x28 | 114, 139 | 80,119, 100,129, 116,137, 132,129, 152,119 | 137 | 17, 42, 8, 8 |

`flat_bg` is 320x180, 12 frames: the walls, the floor with its light pools and the props' contact
shadows, the window's view; no props in it.

## Hotspots

Cutaway tests hotspots in data order and the **last** match wins, so list them in this order (big ones
first). For the three big iso shapes a `poly` (the box's silhouette on the slope) is better than the
rect: the rect of the bed or the deck would catch clicks on the open floor beside them.

| id | rect `[x, y, w, h]` | poly | walkTo | face |
|---|---|---|---|---|
| `bed` | 61, 74, 96, 57 | 126,73, 156,88, 156,97, 92,129, 62,114, 62,105 | 138, 114 | nw |
| `fridge` | 147, 35, 38, 47 | 166,31, 184,40, 184,71, 166,80, 148,71, 148,40 | 148, 83 | ne |
| `deck` | 167, 47, 80, 68 | 190,34, 246,62, 246,102, 224,113, 168,85, 168,45 | 186, 106 | ne |
| `window` | 262, 70, 52, 53 | | 262, 140 | ne |
| `door` | 20, 80, 32, 56 | | 42, 134 | nw |
| `laundry` | 254, 112, 32, 12 | | 250, 132 | ne |
| `noodles` | 235, 93, 24, 20 | | 234, 122 | ne |
| `pinboard` | 75, 49, 38, 39 | | 146, 110 | nw |
| `box_old` | 95, 111, 38, 28 | | 132, 137 | nw |

Notes:
- The `deck` rect and poly include the post-it (it sticks up over the wide screen) and the wall screen.
- Every walkTo is inside the walk area and outside the hole (checked). At the fridge spot Juno sorts
  behind the bed and the lamp, at the bed spot behind the box: both right (she is farther back), and
  neither covers her body.
- The post-it ("ESSEN!!", underlined) is on the deck at (189-214, 48-55): part of the `deck`
  hotspot, not its own.

## Spots

| id | x, y | face | what |
|---|---|---|---|
| `start` | 186, 106 | ne | at the deck (the prologue's start) |
| `arrive` | 46, 134 | se | just in from the hallway door |

## Light (Cutaway `light`)

The art has its light baked in (pools on the floor, halos on the walls). The lamps sit where the art's
sources are:

```js
light: { ambient: 0.38, color: "#8a9cff", lamps: [
  { id: "lamp", at: [158, 72], r: 80, power: 1.1, color: "#ffd58a", flicker: 0.04, glow: { r: 4, strength: 0.35 } },  // the floor lamp's shade
  { id: "deck", at: [214, 70], r: 64, power: 1.0, color: "#62def0", flicker: 0.08 },                                 // the screens
  { id: "neon", at: [288, 95], r: 72, power: 0.9, color: "#ff4fd3", flicker: 0.12 },                                 // the window: HOTEL across the street
] },
```

The floor lamp stands right by the deck spot, so Juno keeps a warm key where she works (style guide §7).

## For `game/places.js` and `game/prolog.js`

`Nagiwa.at.flat` still holds placeholder guesses; these replace them:

```js
flat: {
  start: [186, 106], deck: [186, 106], fridge: [148, 83], bed: [138, 114], box: [132, 137], window: [262, 140],
  laundry: [250, 132], noodles: [234, 122], pinboard: [146, 110], door: [42, 134], arrive: [46, 134],
  walk: [[146,78, 208,109, 190,118, 212,129, 234,118, 290,146, 228,177, 104,177, 26,138, 64,119, 112,143, 140,129, 120,119, 164,97, 136,83]],
  holes: [[158,96, 170,102, 158,108, 146,102]],
  props: [
    { id: "fridge", image: "flat_fridge", at: [166, 82], front: [128,61, 148,71, 166,80, 184,71, 204,61], baseline: 80 },
    { id: "lamp", image: "flat_lamp", at: [159, 104], front: [134,92, 154,102, 158,104, 162,102, 182,92], baseline: 104 },
    { id: "deck", image: "flat_deck", at: [207, 115], front: [148,75, 168,85, 224,113, 246,102, 266,92], baseline: 113 },
    { id: "noodles", image: "flat_noodles", at: [247, 113], front: [212,101, 232,111, 246,118, 260,111, 280,101], baseline: 118 },
    { id: "chair", image: "flat_chair", at: [209, 123], front: [178,108, 198,118, 210,124, 222,118, 242,108], baseline: 124 },
    { id: "bed", image: "flat_bed", at: [109, 131], front: [42,104, 62,114, 92,129, 156,97, 176,87], baseline: 129 },
    { id: "laundry", image: "flat_laundry", at: [270, 124], front: [236,111, 256,121, 276,131, 290,124, 310,114], baseline: 131 },
    { id: "box_old", image: "flat_box", at: [114, 139], front: [80,119, 100,129, 116,137, 132,129, 152,119], baseline: 137 },
  ],
  // hotspots, in this order (the last match wins)
  bedPoly: [126,73, 156,88, 156,97, 92,129, 62,114, 62,105],
  fridgePoly: [166,31, 184,40, 184,71, 166,80, 148,71, 148,40],
  deckPoly: [190,34, 246,62, 246,102, 224,113, 168,85, 168,45],
  windowRect: [262, 70, 52, 53], doorRect: [20, 80, 32, 56], laundryRect: [254, 112, 32, 12],
  noodlesRect: [235, 93, 24, 20], pinboardRect: [75, 49, 38, 39], boxRect: [95, 111, 38, 28],
},
```

`game/prolog.js`'s `flat` room then takes `background: "flat_bg"`, `walk`/`holes`/`props` from here,
the hotspots with `poly` (bed, fridge, deck) or `rect` (the rest) and their walkTo and face from the
tables above, `light` as above, and `assets/room_flat.js` loaded in `index.html`. New hotspots the art
has: `laundry` (the heap under the window) and `noodles` (the tower of empty cups beside the desk).
