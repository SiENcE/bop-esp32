// Nagiwa: PRÜFEN, the clip editor's third tool (docs/kapitel0-design.md §2.4; kapitel2-design §3.4 and §8): a recording laid beside one of
// Juno's, and the places where they differ found, each with a click on the timeline (where to look) and one on the place itself. Two kinds:
//   clips   two clips side by side over one timeline (the forgery beside her own): where the playhead stands is a view (`pruef_at`, a mark);
//           the places are found in their order (first where it is cut, then what patches it), counted by the check's own view flag
//           (`counter`: how far Juno has got doesn't matter to the story), and the last one gives what the check is for (state)
//   data    a recording without a picture (Ines' protocols) and the clips of Juno's CACHE under it: the clip picked is a view (`pruef_pick`),
//           then the place in the data where it matches; one match is enough
//   layers  two pieces of one recording (the noise at a clip's start and at its end), each nothing alone: laid over each other (a view,
//           `pruef_over`) they show what is under them, and a click on what is found there gives what the check is for
// No skill and no time: a wrong click only says something. The window open is the deck's (deck_app=pruef_<id>), a view; what was found is
// state. A view only changes what can be clicked (the place under the playhead, the spike beside the clip picked), never what a click does.
"use strict";

(function () {
  const t = Nagiwa.t, S = () => Cutaway.state;
  Cutaway.state.view("pruef_at", "pruef_pick", "pruef_from", "pruef_over");
  Cutaway.i18n.declare("deck", ["PRÜFEN // {name}", "STELLEN", "?", "MEIN CACHE", "{n}", "ÜBEREINANDER", "NEBENEINANDER"]);

  /**
   * @typedef {{id: string, mark: number, side: 0 | 1, rect: number[], name: string, says: any[]}} CheckFind
   * a place to find: under which mark, in which picture (0 the foreign one, 1 hers), where in it, its name once found, what Juno says
   * @typedef {{kind: "clips", title: string, if?: any, done: string, a: string, b: string, lanes: [string, string], marks: {at: number, label: string}[],
   *   counter: string, finds: CheckFind[], early: any[], again: any[], miss: any[], last: any[],
   *   picture: (ctx: CanvasRenderingContext2D, side: 0 | 1, mark: number, x: number, y: number, w: number, h: number) => void}} ClipsCheck
   * two clips (cache ids `a`, the foreign one, and `b`, hers; both in Nagiwa.clips, in the same hour); `counter` a view flag the chapter
   * registers; `done` the flag the last find sets (in `last`);
   * what Juno says at a find before its turn (`early`), at one found already (`again`), elsewhere in a picture (`miss`); `picture` draws
   * what each shows under a mark
   * @typedef {{night: number, at: string, n: number}} Spike
   * @typedef {{kind: "data", title: string, if?: any, done: string, label: string, nights: string[], from: number, to: number, spikes: Spike[],
   *   rows: {clip: string, stamp: string, matches: Record<number, any[]>, wrong?: any[]}[], none: any[], wrong: any[], found: any[]}} DataCheck
   * the data's nights (their labels), the hours shown of each (`from` to `to`, past midnight as 24 and more), its spikes (how many sleepers
   * at once); the CACHE's clips in their order, each with the spikes it matches and what Juno says then (and, if it has its own, why it
   * matches none); a spike clicked with no clip picked (`none`) or the wrong one (`wrong`); `found`: what follows any match; `done` the
   * condition that it has been found
   * @typedef {{kind: "layers", title: string, if?: any, done: string, clip: string, lanes: [string, string], name: string, spots: number[][],
   *   picture: (ctx: CanvasRenderingContext2D, which: 0 | 1 | 2, x: number, y: number, w: number, h: number) => void,
   *   alone: any[], laid: any[], miss: any[], found: any[], again: any[]}} LayersCheck
   * the clip it is opened from; its two pieces' names; what is found (`name`) at `spots` (points in the picture laid over, each a 12 px
   * square); `picture` draws a piece (0, 1) or both laid over (2); what Juno says at a piece alone (`alone`), on laying them over (`laid`),
   * elsewhere in the picture (`miss`), at a spot (`found`, which sets `done`), at one once it is done (`again`)
   */
  /** @type {Record<string, ClipsCheck | DataCheck | LayersCheck>} */
  Nagiwa.checks = {};

  /** the conditions under which a check can be used: its own, and not done yet @param {string} id */
  Nagiwa.checkAwake = (id) => {
    const c = Nagiwa.checks[id];
    return [...(c?.if === undefined ? [] : [].concat(c.if)), { not: c?.done ?? "~never" }];
  };

  // ---------------------------------------------------------------- the layout (inside the deck's window, D.win [76, 15, 240, 137])
  const L = {
    pics: [[82, 21, 112, 68], [198, 21, 112, 68]],     // the foreign clip, hers
    line: [120, 186], lanes: [99, 108], lane: 7, marks: 118, finds: 127,
    tools: [[0, 44], [48, 60], [112, 32], [148, 0]],      // the editor's tools, as game/deck.js places them (x after the window's edge + 8, width)
    nights: [82, 68, 74], base: 64, spike: 34,            // data: the nights' columns [x, labels' y, width], the spikes' base line, the highest
    rows: [86, 9],                                         // data: the CACHE's rows [y, height]
    over: [112, 21, 168, 96], button: [148, 121, 96, 11],  // layers: the picture laid over, the button that lays them over or apart
  };
  const markAt = (/** @type {number} */ k) => k === 0 ? { or: ["!pruef_at", "pruef_at=0"] } : `pruef_at=${k}`;
  const markNow = () => Number(S().flag("pruef_at") ?? 0);

  // ---------------------------------------------------------------- clips: where things are
  /** the timeline's x for a minute of the hour @param {ClipsCheck} c @param {number} m */
  function lineX(c, m) {
    const A = Nagiwa.clips[c.a], B = Nagiwa.clips[c.b], from = Math.min(A.from, B.from), to = Math.max(A.to, B.to);
    return Math.round(L.line[0] + (m - from) / (to - from) * L.line[1]);
  }
  /** a mark's clickable rect: over both lanes and its label @param {ClipsCheck} c @param {number} k */
  const markRect = (c, k) => [lineX(c, c.marks[k].at) - 10, L.lanes[0] - 4, 20, L.marks + 8 - (L.lanes[0] - 4)];
  /** a find's rect on the screen @param {CheckFind} f */
  const findRect = (f) => { const [px, py] = L.pics[f.side]; return [px + f.rect[0], py + f.rect[1], f.rect[2], f.rect[3]]; };

  // ---------------------------------------------------------------- data: where things are
  /** a spike's x and height @param {DataCheck} c @param {Spike} s */
  function spikeAt(c, s) {
    const [hh, mm] = s.at.split(":").map(Number), hours = (hh < 12 ? hh + 24 : hh) + mm / 60;
    const [x0, , w] = L.nights;
    return { x: x0 + s.night * w + 4 + Math.round((hours - c.from) / (c.to - c.from) * (w - 10)), h: Math.max(6, Math.round(s.n / 41 * L.spike)) };
  }
  /** a spike's clickable rect @param {DataCheck} c @param {Spike} s */
  const spikeRect = (c, s) => { const { x, h } = spikeAt(c, s); return [x - 4, L.base - h - 9, 9, h + 11]; };
  /** the rows' slots: each clip Juno has, in the check's order @param {DataCheck} c */
  const present = (c) => c.rows.filter((r) => S().flag(`cache_${r.clip}`));
  const rowRect = (/** @type {number} */ slot) => [82, L.rows[0] + slot * L.rows[1] - 2, 228, L.rows[1]];

  // ---------------------------------------------------------------- the hotspots
  /** A check's hotspots, for the room its window is open in (the deck, or a room of its own: `close` gives it a close box).
   * @param {string} id @param {{close?: boolean}} [o] */
  Nagiwa.checkHotspots = function (id, o = {}) {
    const c = Nagiwa.checks[id], D = Nagiwa.deckUI, open = `deck_app=pruef_${id}`, awake = Nagiwa.checkAwake(id);
    /** @type {Record<string, any>} */
    const hs = {};
    const key = (/** @type {string} */ part) => `pruef_${id}_${part}`;
    if (o.close) hs[key("close")] = { name: "Schließen", rect: D.close, if: open, z: 8, use: [{ unset: "deck_app" }, { unset: "pruef_pick" }, { sfx: "type" }] };
    if (c.kind !== "data") {
      // PRÜFEN again: back to the clip it was opened from (which one is a view; the foreign clip if none is known), a hotspot each
      const first = c.kind === "clips" ? c.a : c.clip;
      for (const [cid, clip] of Object.entries(Nagiwa.clips)) if (clip.check === id) {
        hs[key(`back_${cid}`)] = { name: "Prüfen", rect: [D.win[0] + 8 + L.tools[2][0], D.clip.tools, L.tools[2][1], 10], z: 8,
          if: [open, cid === first ? { or: ["!pruef_from", `pruef_from=${cid}`] } : `pruef_from=${cid}`],
          use: [{ set: "deck_app", value: `clip_${cid}` }, { sfx: "type" }] };
      }
    }
    if (c.kind === "layers") {
      // apart: each piece alone is nothing; the button lays them over and apart again (a view); laid over, the picture and its spots
      const over = "pruef_over", done = c.done;
      [0, 1].forEach((side) => { hs[key(`pic${side}`)] = { name: c.lanes[side], rect: L.pics[side], if: [open, `!${over}`], z: 6, use: c.alone }; });
      hs[key("over")] = { name: "Übereinander", rect: L.button, if: [open, `!${over}`], z: 8, use: [{ set: over }, { sfx: "type" }, { if: { not: done }, then: c.laid }] };
      hs[key("apart")] = { name: "Nebeneinander", rect: L.button, if: [open, over], z: 8, use: [{ unset: over }, { sfx: "type" }] };
      hs[key("pic")] = { name: c.lanes.join(" + "), rect: L.over, if: [open, over], z: 6, use: [{ if: done, then: c.again, else: c.miss }] };
      c.spots.forEach(([sx, sy], k) => {
        hs[key(`spot${k}`)] = { name: c.name, rect: [L.over[0] + sx - 6, L.over[1] + sy - 6, 12, 12], if: [open, over], z: 7,
          use: [{ if: done, then: c.again, else: [{ sfx: "tag" }, ...c.found] }] };
      });
    } else if (c.kind === "clips") {
      // the counter is a view (only the last find is state), so each place found so far has its own marks: moving the playhead is a move
      // of its own there, which the solver plays again after each find (it plays a move only in the first view that offers it)
      const n = c.finds.length, cnt = c.counter, done = c.done;
      const count = (/** @type {number} */ v) => v === 0 ? { or: [`!${cnt}`, `${cnt}=0`] } : `${cnt}=${v}`;
      const counts = (/** @type {number} */ a, /** @type {number} */ b) => ({ or: Array.from({ length: Math.max(0, b - a) }, (_, k) => count(a + k)) });
      c.marks.forEach((m, k) => {
        const mark = { name: m.label, rect: markRect(c, k), z: 8, use: [{ set: "pruef_at", value: k }, { sfx: "type" }] };
        for (let v = 0; v < n; v++) hs[key(`mark${k}_${v}`)] = { ...mark, if: [open, { not: done }, count(v)] };
        hs[key(`mark${k}`)] = { ...mark, if: [open, done] };
      });
      [0, 1].forEach((side) => {
        hs[key(`pic${side}`)] = { name: c.lanes[side], rect: L.pics[side], if: open, z: 6, use: c.miss };
      });
      // each place under its mark: its turn when the counter has come to it, before its turn, or found already (three hotspots: the counter
      // is a view, and a view only changes what can be clicked). The last find gives the check's state (`last` sets `done`)
      c.finds.forEach((f, i) => {
        const at = [open, markAt(f.mark)], spot = { name: f.name, rect: findRect(f), z: 7 };
        hs[key(f.id)] = { ...spot, if: [...at, { not: done }, count(i)],
          use: [{ sfx: "tag" }, ...(i < n - 1 ? [{ set: cnt, value: i + 1 }] : []), ...f.says, ...(i < n - 1 ? [] : c.last)] };
        if (i > 0) hs[key(`${f.id}_early`)] = { ...spot, if: [...at, { not: done }, counts(0, i)], use: c.early };
        hs[key(`${f.id}_again`)] = { ...spot, if: [...at, { or: [done, counts(i + 1, n)] }], use: c.again };
      });
    } else {
      // the clips she has, each in its row (the rows close up over those she hasn't: drawing puts each hotspot where its row is, as the CACHE does)
      c.rows.forEach((r, k) => {
        hs[key(`row_${r.clip}`)] = { name: Nagiwa.cache[r.clip]?.name ?? r.clip, rect: rowRect(k), z: 7, if: [open, ...awake, `cache_${r.clip}`],
          use: [{ set: "pruef_pick", value: r.clip }, { sfx: "type" }] };
      });
      // a spike: with no clip beside it, with one that doesn't fit, with one that has its own answer there: a match, or why not (each its
      // own hotspot: the clip picked is a view)
      c.spikes.forEach((s, k) => {
        const rect = spikeRect(c, s), own = c.rows.filter((r) => r.matches[k] || r.wrong), name = `${c.nights[s.night]} ${s.at}`;
        hs[key(`spike${k}`)] = { name, rect, z: 8, if: [open, ...awake, "!pruef_pick"], use: c.none };
        hs[key(`spike${k}_wrong`)] = { name, rect, z: 8, if: [open, ...awake, "pruef_pick", ...own.map((r) => `!pruef_pick=${r.clip}`)], use: c.wrong };
        for (const r of own) hs[key(`spike${k}_${r.clip}`)] = { name, rect, z: 8, if: [open, ...awake, `pruef_pick=${r.clip}`],
          use: r.matches[k] ? [{ sfx: "tag" }, ...r.matches[k], ...c.found] : r.wrong };
      });
    }
    return hs;
  };
  // the deck's checks of two clips: their hotspots come with the deck (game/deck.js, once everything is loaded)
  Nagiwa.deckParts.push((hs) => {
    for (const [id, c] of Object.entries(Nagiwa.checks)) if (c.kind !== "data") Object.assign(hs, Nagiwa.checkHotspots(id));
  });

  // ---------------------------------------------------------------- drawing
  /** A check's window (on the deck, or over a room of its own) @param {CanvasRenderingContext2D} ctx @param {string} id */
  Nagiwa.drawCheck = function (ctx, id) {
    const c = Nagiwa.checks[id], G = Nagiwa.deckDraw;
    if (!c) return;
    G.frame(ctx, t("PRÜFEN // {name}", { name: t(c.title) }));
    if (c.kind === "clips") drawClips(ctx, c); else if (c.kind === "layers") drawLayers(ctx, c); else drawData(ctx, id, c);
  };

  /** the editor's tools under the window, PRÜFEN lit (a click on it goes back to the clip) @param {CanvasRenderingContext2D} ctx */
  function drawTools(ctx) {
    const G = Nagiwa.deckDraw, C = G.C, p = G.pointer(), [X] = Nagiwa.deckUI.win, ty = Nagiwa.deckUI.clip.tools;
    ["SCHNEIDEN", "ANONYMISIEREN", "PRÜFEN", "MONTIEREN"].forEach((label, i) => {
      const [dx, fw] = L.tools[i], w = fw || Cutaway.font.get("hud").measure(t(label).toUpperCase()) + 8, x = X + 8 + dx, on = label === "PRÜFEN";
      const hot = on && G.inRect(p.x, p.y, [x, ty, w, 10]);
      G.chamfer(ctx, x, ty, w, 10, 2, hot ? C.cyanDark : on ? C.cyanDeep : C.steel1, on ? C.cyan : C.steel3, on ? C.cyanPale : C.steel4);
      G.small(ctx, t(label), x + 4, ty + 3, on ? C.cyanPale : C.steel4);
    });
  }

  /** two pieces, apart or laid over @param {CanvasRenderingContext2D} ctx @param {LayersCheck} c */
  function drawLayers(ctx, c) {
    const G = Nagiwa.deckDraw, C = G.C, p = G.pointer(), over = !!S().flag("pruef_over");
    const pic = (/** @type {0 | 1 | 2} */ which, /** @type {number[]} */ [px, py, pw, ph], /** @type {string} */ label) => {
      G.rect(ctx, C.ink, px - 1, py - 1, pw + 2, ph + 2);
      ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip(); c.picture(ctx, which, px, py, pw, ph); ctx.restore();
      G.rect(ctx, C.ink, px, py, Cutaway.font.get("hud").measure(label.toUpperCase()) + 4, 9);
      G.small(ctx, label, px + 2, py + 2, "#d4f7e2");
    };
    if (over) pic(2, L.over, `${t(c.lanes[0])} + ${t(c.lanes[1])}`);
    else [0, 1].forEach((side) => pic(/** @type {0 | 1} */ (side), L.pics[side], t(c.lanes[side])));
    const [bx, by, bw, bh] = L.button, hot = G.inRect(p.x, p.y, L.button), label = t(over ? "NEBENEINANDER" : "ÜBEREINANDER");
    G.chamfer(ctx, bx, by, bw, bh, 2, hot ? C.cyanDark : C.cyanDeep, C.cyan, C.cyanPale);
    G.small(ctx, label, bx + bw / 2, by + 3, C.cyanPale, "center");
    drawTools(ctx);
  }

  /** two clips, one timeline @param {CanvasRenderingContext2D} ctx @param {ClipsCheck} c */
  function drawClips(ctx, c) {
    const G = Nagiwa.deckDraw, C = G.C, p = G.pointer(), now = markNow(), [X] = Nagiwa.deckUI.win;
    // the pictures under the playhead, each with what it is
    [0, 1].forEach((side) => {
      const [px, py, pw, ph] = L.pics[side];
      G.rect(ctx, C.ink, px - 1, py - 1, pw + 2, ph + 2);
      ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
      c.picture(ctx, /** @type {0 | 1} */ (side), now, px, py, pw, ph);
      ctx.restore();
      G.small(ctx, t(c.lanes[side]), px + 2, py + 2, "#d4f7e2");
    });
    // the timeline: the minutes, each clip's moments in its lane, the marks to put the playhead on
    const A = Nagiwa.clips[c.a], hh = String(A.hour ?? 22).padStart(2, "0");
    const from = Math.min(A.from, Nagiwa.clips[c.b].from), to = Math.max(A.to, Nagiwa.clips[c.b].to);
    for (let m = Math.ceil(from); m <= to; m++) {
      G.rect(ctx, C.steel5, lineX(c, m), L.lanes[0] - 4, 1, 2);
      G.small(ctx, `${hh}:${String(m).padStart(2, "0")}`, lineX(c, m), L.lanes[0] - 9, C.steel5, m === Math.ceil(from) ? "left" : m === Math.floor(to) ? "right" : "center");
    }
    [c.a, c.b].forEach((clipId, side) => {
      const clip = Nagiwa.clips[clipId], y = L.lanes[side];
      G.small(ctx, t(c.lanes[side]), X + 6, y + 1, C.steel6);
      clip.moments.forEach(([a, b]) => G.rect(ctx, C.steel3, lineX(c, a) + 1, y, Math.max(1, lineX(c, b) - lineX(c, a) - 1), L.lane));
    });
    c.marks.forEach((m, k) => {
      const x = lineX(c, m.at), hot = G.inRect(p.x, p.y, markRect(c, k)), on = k === now;
      if (on) G.rect(ctx, C.yellow, x, L.lanes[0] - 2, 1, L.lanes[1] + L.lane - L.lanes[0] + 4);
      else G.rect(ctx, hot ? C.cyan : C.steel5, x, L.lanes[0] - 2, 1, 2);
      G.small(ctx, t(m.label), x, L.marks, on ? C.yellow : hot ? C.cyanPale : C.steel6, "center");
    });
    // the places found so far, in their order
    const found = S().flag(c.done) ? c.finds.length : Number(S().flag(c.counter) ?? 0);
    G.small(ctx, t("STELLEN"), X + 6, L.finds, C.steel6);
    let fx = X + 42;
    c.finds.forEach((f, i) => {
      const label = i < found ? t(f.name) : t("?"), w = Math.max(16, Cutaway.font.get("hud").measure(label.toUpperCase()) + 8);
      G.chamfer(ctx, fx, L.finds - 2, w, 9, 2, i < found ? C.cyanDeep : C.steel1, i < found ? C.cyan : C.steel3, i < found ? C.cyanPale : C.steel4);
      G.small(ctx, label, fx + 4, L.finds, i < found ? C.cyanPale : C.steel4);
      fx += w + 4;
    });
    drawTools(ctx);
  }

  /** data over the CACHE @param {CanvasRenderingContext2D} ctx @param {string} id @param {DataCheck} c */
  function drawData(ctx, id, c) {
    const G = Nagiwa.deckDraw, C = G.C, p = G.pointer(), [X, , WW] = Nagiwa.deckUI.win, pick = S().flag("pruef_pick");
    const [x0, ly, w] = L.nights;
    G.small(ctx, t(c.label), X + WW - 8, 22, C.steel6, "right");
    // each night: its hours along the base line, the sleepers' REM as a low noise, the spikes where many dream at once
    c.nights.forEach((night, k) => {
      const nx = x0 + k * w;
      G.rect(ctx, C.steel4, nx + 2, L.base, w - 6, 1);
      for (let x = 0; x < w - 8; x += 2) {
        const h = 1 + Math.floor(((Math.imul(x + 31 * k, 2654435761) >>> 0) % 1000) / 1000 * 4);
        G.rect(ctx, C.steel3, nx + 4 + x, L.base - h, 1, h);
      }
      G.small(ctx, t(night), nx + 2, ly, C.steel6);
    });
    c.spikes.forEach((s) => {
      const { x, h } = spikeAt(c, s), hot = G.inRect(p.x, p.y, spikeRect(c, s));
      G.rect(ctx, hot ? C.cyanPale : C.cyan, x, L.base - h, 2, h);
      G.small(ctx, t("{n}", { n: s.n }), x + 1, L.base - h - 7, hot ? C.cyanPale : C.cyanDark, "center");
    });
    // her clips, one row each, the one picked lit
    G.small(ctx, t("MEIN CACHE"), X + 6, L.rows[0] - 9, C.steel6);
    const own = present(c), spots = Cutaway.scene.room?.hotspots ?? {};
    for (const r of c.rows) { const spot = spots[`pruef_${id}_row_${r.clip}`]; if (spot) spot.rect = own.includes(r) ? rowRect(own.indexOf(r)) : [0, 0, 0, 0]; }
    own.forEach((r, slot) => {
      const rr = rowRect(slot), on = pick === r.clip, hot = G.inRect(p.x, p.y, rr);
      if (on || hot) G.rect(ctx, on ? C.cyanDeep : C.steel2, rr[0], rr[1], rr[2], rr[3]);
      G.small(ctx, t("CLIP"), rr[0] + 2, rr[1] + 2, C.cyan);
      G.small(ctx, G.fit(t(Nagiwa.cache[r.clip]?.name ?? r.clip), 130, Cutaway.font.get("hud")), rr[0] + 24, rr[1] + 2, on ? C.cyanPale : C.steel6);
      G.small(ctx, t(r.stamp), X + WW - 8, rr[1] + 2, on ? C.yellow : C.steel5, "right");
    });
  }

  // a room of its own that shows a check (`checkScreen: true`, as the end's flat at night): the window over it, while it is open
  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    const r = Cutaway.scene.room, v = String(S().flag("deck_app") ?? "");
    if (!r?.checkScreen || Cutaway.scene.backdrop || !v.startsWith("pruef_")) return;
    ctx.fillStyle = "rgba(6, 8, 15, 0.82)"; ctx.fillRect(0, 0, 320, 180);
    Nagiwa.drawCheck(ctx, v.slice(6));
  });
})();
