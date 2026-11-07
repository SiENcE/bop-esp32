# cam04 layout: Imbiss Yuen

Art: `art/cams/cam04.px.js` → `cam04_bg` (320x180, the phosphor keys 0–9 only), in `assets/cams.js`
(`sh tools/build_art.sh cams`). Review: `cam04_x3.png` (engine artefacts imitated, grey stand-ins at
`seatKessler`, `cook`, `win2`), `cam04_layout_x3.png` (the numbers below drawn over the picture).

All numbers are **measured** from the camera with `project()` (`LAYOUT` at the end of the art file);
change the blockout or the camera, then re-measure, never edit these by hand.

## The place

| | |
|---|---|
| Camera | in the ceiling over the front wall, 3.3 m up, 52° down, yaw −8°, a wide CCTV lens (F 105, barrel k 0.22) |
| Room | 6 x 5.6 m. Back: the counter (1.05 m) with four bar stools, behind it the cook's station (stove, stock pot, wok, a low fridge with the rice cooker) under a hood, three lit menu boards above |
| Left | the window to the street: neon blurred behind the glass, rain running down it; the door at its far end |
| Right | the TV high on the wall (Nagi·wa ad: a sleeping face, the ring logo, a caption band; the brightest thing in the room) and a lit drinks fridge under it |
| Tables | four small tables (0.7 m) with two stools each: `near` right under the camera (empty: Kessler and Varga), `win1` and `win2` by the window, `mid` |

## Walk areas (Cutaway `walk`, flat x, y lists)

```js
walk: [
  [227,180, 221,125, 212,68, 131,60, 141,38, 102,37, 78,67, 54,99, 1,180],   // the dining room
  [152,50, 210,56, 208,49, 183,47, 154,44],                                  // behind the counter (the cook)
],
holes: [
  [139,117, 164,121, 166,103, 144,100],   // table near
  [51,108, 68,111, 78,95, 61,93],         // table win1
  [74,75, 89,77, 96,66, 81,65],           // table win2
  [106,82, 125,84, 130,72, 112,70],       // table mid
  [202,130, 233,133, 226,100, 200,97],    // the drinks fridge
],
```

The holes are the tables' footprints on the floor (the tops, 0.74 m up, are drawn higher on screen).
Stools are not holes: people sit on them.

## Spots (feet, px)

| id | x, y | what |
|---|---|---|
| `entrance` | 100, 43 | just inside the door |
| `seatVarga` | 149, 132 | the near table's near stool, closest to the mic: **Varga** (clear) |
| `seatKessler` | 156, 94 | across the table: **Kessler** (muffled). His stool is hidden under the table top; his sprite covers it. |
| `counter` | 176, 69 | at the counter, by a bar stool |
| `cook` | 182, 50 | behind the counter, at the stove (his feet: a 1.75 m man is 42 px tall here, his head at y 8) |
| `cookBust` | 186, 30 | the counter top's back edge in front of him: the cook is drawn as a bust above it (`yuen_cook_feed`, 22 px), so the counter hides the rest |
| `win1`, `win2`, `mid` | 73, 88 / 92, 61 / 123, 66 | the other tables' far stools (the two night guests) |

## Depth scale (a 1.75 m person; s relative to a 24 px figure)

```js
scale: { far: [65, 1.9], near: [163, 1.09] },
```

**Note: far is bigger than near.** From a ceiling camera people near the bottom of the picture are seen
almost from straight above, so they are short on screen (26 px at y 163); at the counter they are seen
more from the side (46 px at y 65). In between: Varga's seat ≈ 1.35 (32 px), Kessler's ≈ 1.66 (40 px).
Scaling the 24 px feed figures up to 1.4–1.9 will look chunky; Kessler and Varga at the table (the key
shot) are better drawn as their own seated sprites at about 32 and 40 px.

## Mic

```js
mic: { at: [150, 126], clear: 20, lost: 80 },
```

In the ceiling over the near table, toward Varga's side. Distances from the mic: `seatVarga` 6 (clear),
`seatKessler` 33 (about 20 % of the words lost: muffled), `counter` 63 (about 70 %), `mid` 66 (about 75 %), `cook`
82, `win1` 86, `win2` 87, `entrance` 97 (all lost).

## Hotspots (`rect: [x, y, w, h]`)

| id | rect | notes |
|---|---|---|
| `tv` | 238, 8, 33, 45 | the TV on the right wall (seen at a slant; the screen is the slanted quad (240, 30) (249, 9) (266, 28) (252, 51)) |
| `counter` | 129, 19, 104, 48 | the counter with its top |
| `table` | 119, 71, 58, 71 | the near table with both stools |

## For `game/places.js`

`Nagiwa.at.cam04` still holds placeholder guesses; these replace them:

```js
cam04: {
  entrance: [100, 43], seatVarga: [149, 132], seatKessler: [156, 94], counter: [176, 69], cook: [182, 50], cookBust: [186, 30],
  win1: [73, 88], win2: [92, 61], mid: [123, 66],
  mic: [150, 126], scale: { far: [65, 1.9], near: [163, 1.09] },
  tv: [238, 8, 33, 45], counterBox: [129, 19, 104, 48], table: [119, 71, 58, 71],
},
```
