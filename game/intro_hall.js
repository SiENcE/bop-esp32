// Nagiwa: the intro's observation hall (shots 1, 3, 4 of docs/kapitel0-design.md §5; game/intro.js plays them),
// baked from its map (art/rooms/hall.map.js). At the street's scale, bigger than the screen: the camera moves
// over it. Its hum and the keys are the only sounds besides the music. Shot 4 is drawn over the same picture
// (the room `intro_hall_out`, the shot's progress p): the screen walls go out cell by cell from the back corner, then
// the desks' monitors row by row, back to front, the room darkening with them; whoever's monitor has gone out stops
// typing. Juno's stays on: it goes out only in the close-up (game/intro_desk.js). No sound: the hum is gone with the room.
"use strict";

(function () {
  const AH = Nagiwa.at.hall;
  Cutaway.room("intro_hall", {
    name: "Beobachtungshalle", background: "hall_bg", size: [576, 416], props: AH.props,
    ambience: [{ sfx: "deck_fans", gain: 0.8 }, { sfx: "fridge_hum", gain: 0.4 }],
  });

  const { rnd, px } = Nagiwa.intro;
  const [CX, CY] = AH.corner, DARK = "#030a0a", BEZEL = "#0c221f";
  const WALL_END = 0.28, JUNO = "31";

  /** A parallelogram on a wall, by columns (so its edges stay whole pixels): x0..x1, its top rising `slope` px a px. */
  function shear(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {number} */ x0, /** @type {number} */ y0, /** @type {number} */ w, /** @type {number} */ h, /** @type {number} */ slope, /** @type {string} */ key) {
    for (let i = 0; i < w; i++) px(ctx, key, x0 + i, Math.round(y0 + i * slope), 1, h);
  }

  /** The time a cell of a screen wall goes out: the back corner first. */
  const cellOut = (/** @type {number} */ i, /** @type {number} */ j, /** @type {number} */ side) => 0.02 + (i / 12) * (WALL_END - 0.07) + rnd(i * 31 + j, side + 41) * 0.05;
  /** The time a desk's monitors go out: row by row, back to front; Juno's not in this shot. */
  const deskOut = (/** @type {number} */ r, /** @type {number} */ c) => (`${r}${c}` === JUNO ? Infinity : WALL_END + 0.03 + r * 0.14 + rnd(r * 7 + c, 43) * 0.08);
  /** @type {Set<string>} who has stopped typing, in this playing of the shot */
  const stopped = new Set();

  Cutaway.room("intro_hall_out", { name: "Beobachtungshalle", background: "hall_bg", size: [576, 416], props: AH.props, float: "hall_out" });

  Nagiwa.intro.shots.hall_out = (ctx, p, t) => {
    const cam = Cutaway.scene.camera, ox = CX - cam.x, oy = CY - cam.y;
    if (p < 0.01) stopped.clear();
    // the walls: cells 0.8 x 0.5 m from h 0.45 (26 px along the wall, 15 px high); the right wall runs down to the
    // right, the left one down to the left
    for (const [side, n, dir] of [[0, 13, 1], [1, 10, -1]]) for (let i = 0; i < n; i++) for (let j = 0; j < 7; j++) {
      if (p < cellOut(i, j, side)) continue;
      const left = dir > 0 ? i * 25.6 : -(i + 1) * 25.6, x = Math.round(ox + left), top = oy + Math.abs(left) / 2 - (0.45 + (j + 1) * 0.5) * 30;
      const y0 = dir > 0 ? top : top - 1, tall = j === 6 ? 6 : 16;            // the top row is cut by the ceiling's tray
      shear(ctx, x, y0 + (j === 6 ? 9 : 0), 27, tall, dir * 0.5, BEZEL);                 // the dead screens' frames still show, faintly
      if (j < 6) shear(ctx, dir > 0 ? x + 2 : x + 1, y0 + 2, 24, 13, dir * 0.5, DARK);
    }
    const out = AH.props.filter((/** @type {any} */ d) => /^d\d\d$/.test(d.id));
    const monitors = (/** @type {any} */ d, /** @type {(x: number, y: number, m: number) => void} */ f) => {
      const [mx, my] = AH[`m${d.id.slice(1)}`];
      for (let m = 0; m < 3; m++) f(mx + m * 12, my + m * 6, m);
    };
    for (const d of out) if (p >= deskOut(+d.id[1], +d.id[2])) {
      monitors(d, (x, y) => shear(ctx, x - cam.x + 1, y - cam.y + 1, 10, 8, 0.5, DARK));
      // played once, their loop ends: the hands finish what they were doing and stay
      if (!stopped.has(d.id)) { stopped.add(d.id); Cutaway.scene.playProp(d.id, {}); }
    }
    // the room darkens as the walls' light goes, then the rows'
    const dim = Math.max(0, Math.min(1, (p - WALL_END + 0.1) / (1 - WALL_END + 0.1)));
    ctx.fillStyle = `rgba(3, 6, 10, ${(dim * 0.72).toFixed(3)})`;
    ctx.fillRect(0, 0, 320, 180);
    // what is still on keeps its light: its own pixels again, over the dark
    for (const d of out) {
      if (p >= deskOut(+d.id[1], +d.id[2])) continue;
      const a = Cutaway.assets.get(d.image), f = Cutaway.assets.frameAt(a, t), img = Cutaway.assets.img(f.image ?? a.image);
      if (!img) continue;
      const [ax, ay] = a.anchor ?? [Math.floor(f.w / 2), f.h], left = d.at[0] - ax, top = d.at[1] - ay;
      monitors(d, (x, y) => { for (let i = 1; i < 11; i++) {
        const yy = Math.round(y + i * 0.5) + 1;
        ctx.drawImage(img, f.x + x + i - left, f.y + yy - top, 1, 8, x + i - cam.x, yy - cam.y, 1, 8);
      } });
    }
  };
})();
