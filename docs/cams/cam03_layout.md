# cam03 layout: Ostbrücke, in front of the Pumpenverwaltung Ost

Art: `art/cams/cam03.px.js` → `cam03_bg` (320x180, the phosphor keys 0–9 only), in `assets/cams.js`
(`sh tools/build_art.sh cams`). Review: `cam03_x3.png` (engine artefacts imitated, grey stand-ins at
`door`, `awning`, `awningFar`, `far`), `cam03_layout_x3.png` (the numbers below drawn over the picture).

All numbers are **measured** from the camera with `project()` (`LAYOUT` at the end of the art file);
change the blockout or the camera, then re-measure, never edit these by hand.

## The place

| | |
|---|---|
| Camera | on a street lamp at the office pavement's kerb, 6.4 m up, 41° down, yaw −4°, F 150, barrel k 0.16 |
| Left | the office's lit lobby front, the double glass door, a noodle vending machine by it; a deep **glass canopy** over the whole pavement, out to the kerb (the camera sees through it). Under it the floor is **dry** (no puddles), lit by three downlights. |
| Middle | the canopy's bright front beam (the line between "under the canopy" and the bridge), the kerb, the bridge deck: wet, puddles, a drain grate, a planter far up |
| Right | the far pavement, bollard lights, the railing; the **mast camera** (housing at 3.1 m) at the railing; beyond, the drop to the lower city (black, a few window lights) |

## Walk area (Cutaway `walk`, flat x, y lists)

```js
walk: [[320,180, 320,135, 279,75, 236,21, 185,18, 134,17, 125,17, 98,55, 61,111, 21,180]],
holes: [
  [74,81, 95,82, 103,68, 83,68],      // the vending machine and the strip it hides
  [176,30, 190,31, 189,23, 176,22],   // the planter
  [113,28, 122,28, 126,22, 118,22],   // the bin by the office
  [269,74, 277,74, 271,67, 264,66],   // the mast's foot
],
```

One area: the office pavement (under the canopy), the deck and the far pavement (the kerbs are 0.15 m,
2 px: no separate areas needed). The top edge (y 17–21) is about 17 m up the bridge.

## Spots (feet, px)

| id | x, y | what |
|---|---|---|
| `door` | 100, 58 | just out of the office door (where the 22:00 crowd comes from) |
| `awning` | 108, 145 | **under the canopy, right under the camera**: the clear-speech spot (step 3) |
| `awningFar` | 128, 41 | under the canopy, its far end beyond the door (Kessler's first, far position) |
| `vending` | 85, 84 | in front of the noodle machine |
| `far` | 271, 77 | the far pavement, across the bridge |
| `exitRight` | 309, 133 | the far pavement's near end at the right edge: people leave here toward Yuen's |
| `exitFar` | 192, 20 | up the bridge, at the top edge |

## Depth scale (a 1.75 m person; s relative to a 24 px figure)

```js
scale: { far: [20, 0.66], near: [160, 1.16] },
```

= 16 px tall at the top, 28 px at the bottom (measured at x ≈ 140–190; the barrel bend changes it by
under 1 px across a row).

## Mic

```js
mic: { at: [108, 145], clear: 40, lost: 150 },
```

At `awning`. Distances from the mic: `vending` 65, `door` 87 (about 40 % of the words lost),
`awningFar` 106 (about 60 %), `exitFar` 151 and `far` 177 (all lost). So "... ja ... bring's ...
Yuen's ..." far under the canopy, the whole line once he steps under the camera. Rain noise
(`noise`) on top is the game's choice.

## Hotspots (`rect: [x, y, w, h]`)

| id | rect | notes |
|---|---|---|
| `mast` | 271, 23, 22, 15 | the mast camera's housing, sun hood and lens; the **sticker** is the 6x2 bright patch on its side at (282–287, 31–32), a dark pixel column at 281 sets it off |
| `vending` | 68, 45, 31, 36 | the noodle machine; its **keypad** (2x4 lit buttons) at about (84–87, 61–68) |
| `officeDoor` | 74, 20, 23, 47 | the double glass door (seen at a slant) |

## For `game/places.js`

`Nagiwa.at.cam03` still holds placeholder guesses; these replace them:

```js
cam03: {
  door: [100, 58], awning: [108, 145], awningFar: [128, 41], vending: [85, 84], far: [271, 77],
  exitRight: [309, 133], exitFar: [192, 20],
  mic: [108, 145], scale: { far: [20, 0.66], near: [160, 1.16] },
  mast: [271, 23, 22, 15], vending: [68, 45, 31, 36], officeDoor: [74, 20, 23, 47],
},
```

(`vending` is both a spot and a hotspot there: rename one, e.g. the rect `vendingBox`.)
