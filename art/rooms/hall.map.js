// The observation hall in Halcyon Tower, 2088 (the intro's shot 1, docs/kapitel0-design.md §5), as a map
// (art/lib/isomap.js has the format). Every length in meters. At the street's scale (style guide §4), so the
// hall is bigger than the screen and the camera moves over it: both back walls are screens from the dado to
// under the ceiling; four rows of desks run along u, five desks each, a watcher at every one facing the right
// back wall (their backs to us), in round armchairs. Juno's desk is in the front row (d31).
// Nobody walks here: the intro shows it.
"use strict";

ISO_MAPS.hall = {
  size: [10, 8], cell: 0.5, at: [256, 124], screen: [576, 416], margin: 0.2,
  // "c" the carpet tiles; "a" the aisle along the screen wall
  floor: [
    "aaaaaaaaaaaaaaaaaaaa", "aaaaaaaaaaaaaaaaaaaa",
    "cccccccccccccccccccc", "cccccccccccccccccccc", "cccccccccccccccccccc", "cccccccccccccccccccc",
    "cccccccccccccccccccc", "cccccccccccccccccccc", "cccccccccccccccccccc", "cccccccccccccccccccc",
    "cccccccccccccccccccc", "cccccccccccccccccccc", "cccccccccccccccccccc", "cccccccccccccccccccc",
    "cccccccccccccccccccc", "cccccccccccccccccccc",
  ],
  walls: [
    { from: [0, 0], to: [10, 0], h: 4.0, kit: "screen_wall" },          // 0: the right back wall, the one they watch
    { from: [0, 0], to: [0, 8], h: 4.0, kit: "screen_wall" },           // 1: the left back wall
    { from: [0, 8], to: [10, 8], h: 4.0, kit: "hall_panel", stub: true },
    { from: [10, 0], to: [10, 8], h: 4.0, kit: "hall_panel", stub: true },
  ],
  // the desks: d<row><column>, row 0 at the back; each with its watcher and armchair (1.2 x 1.3 m)
  props: [0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3, 4].map((c) =>
    ({ id: `d${r}${c}`, kit: "desk", at: [0.9 + c * 1.8, 1.6 + r * 1.55], foot: [1.2, 1.3], h: 1.45, ...(r === 3 && c === 1 ? { juno: true } : {}) }))),
  spots: { juno: [3.3, 6.6, "ne"] },
  // `bake` is read by the bake only: the walls of screens light the room green; each row's screens light their
  // watchers from the front (a strip along the row at the monitors' height)
  lights: [
    { id: "wall_r", at: [5, 0.1, 2], r: 160, power: 1.2, color: "#55a585",
      bake: { line: [[0.4, 0.15, 2.0], [9.6, 0.15, 2.0]], reach: 7.5, power: 1.6, floor: 1.3, wrap: 0.6 } },
    { id: "wall_l", at: [0.1, 4, 2], r: 120, power: 0.9, color: "#55a585",
      bake: { line: [[0.15, 0.4, 2.0], [0.15, 7.6, 2.0]], reach: 5.5, power: 1.1, floor: 1.2, wrap: 0.6 } },
    ...[0, 1, 2, 3].map((r) => ({ id: `row${r}`, at: [5, 1.75 + r * 1.55, 1.1], r: 60, power: 0.8, color: "#55a585",
      bake: { line: [[0.9, 1.78 + r * 1.55, 1.15], [9.3, 1.78 + r * 1.55, 1.15]], reach: 1.6, power: 1.6, dir: [0, 1, -0.2], wrap: 0.4 } })),
  ],
};
