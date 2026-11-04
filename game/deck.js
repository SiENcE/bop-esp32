// Halcyon: Juno's deck as a computer (docs/kapitel0-design.md §2, mockup F: docs/mockups/mock_f_deck_*). A
// watched room (`deck`) without a picture of its own: this file gives it its hotspots and draws the screen
// over it (the engine's "frame.screen" moment). What is open is state the solver sees, kept to one flag:
//   deck_app     the app whose window is open (glas, chat, cache, buch, konto, netz, radio, muell), or none;
//                the chat with a thread open is "chat_<contact>". Entering the flat closes it (its enter
//                script), so the deck is fresh each time Juno sits down; between the deck and a camera it stays.
//   read_<id>    a contact's messages have been read (only where it matters: a contact's `unread` says when
//                its dot shows, by default until read_<id>)
// One window at a time (style guide §8). The deck's content (contacts, threads, replies) comes from the
// chapters (game/prolog.js) into Halcyon.contacts / threads / replies; Halcyon.buildDeck() makes the room
// once everything is loaded (game/game.js). On the deck EVI is the hint button (her corner, bottom right);
// the satchel and the engine's buttons are hidden there (room `buttons: false`).
"use strict";

(function () {
  const W = 320, H = 180;
  const C = {
    ink: "#0c0e1a", night: "#06080f", fill: "#090d18", steel1: "#131a2a", steel2: "#1a2337", steel3: "#232f47", steel4: "#2f3e5a",
    steel5: "#41547a", steel6: "#617aa0", cyanDeep: "#123c4e", cyanDark: "#1f88a4", cyan: "#62def0", cyanPale: "#dafcff",
    magenta: "#ff4fd3", magentaDark: "#a8238a", amber: "#eea040", yellow: "#fff070", yellowDim: "#9a7406", mint: "#8ef5d8",
  };
  const t = Halcyon.t, S = () => Cutaway.state;
  const hud = () => Cutaway.font.get("hud"), main = () => Cutaway.ui.font();

  // ---------------------------------------------------------------- the layout (mockup F)
  const APPS = ["glas", "chat", "cache", "buch", "konto", "netz", "radio", "muell"];
  const LABEL = { glas: "GLAS", chat: "CHAT", cache: "CACHE", buch: "BUCH", konto: "KONTO", netz: "NETZ", radio: "RADIO", muell: "MÜLL" };
  const D = Halcyon.deckUI = {
    header: 11,
    /** the app icons: two columns of four @param {number} i */
    icon: (i) => [8 + (i >> 2) * 34, 16 + (i & 3) * 34],
    win: [76, 15, 240, 137],                                 // the app window [x, y, w, h]
    close: [297, 10, 15, 11],                                // its close box (on the frame's top line)
    buttons: { wait: [236, 1, 40, 9], back: [278, 1, 40, 9] },
    evi: [290, 154, 24, 24],
    files: { steuer: [86, 138, 150, 10], essen: [86, 152, 70, 10] },
    contacts: { x: 79, w: 82, y: 30, row: 22 },
    thread: { x: 166 },
    cache: { y: 30, row: 22 },
    buch: { y: 30, row: 12 },
    map: [82, 22, 228, 124],                                  // GLAS's map inside the window
  };
  Cutaway.i18n.declare("deck", [...Object.values(LABEL), "DECK // J.REYES", "{time}  {date}", "{chits} CHITS", "WARTEN", "ZURÜCK",
    "KONTAKTE", "KEIN ZUGANG", "CODE BEKANNT", "VERBUNDEN", "NETZKARTE // LOWER NINTH", "CLIP", "NOTIZ", "FOTO", "GELESEN", "online",
    "abwesend", "schläft", "Werbung", "KASSENBUCH", "+{chits}", "KONTOSTAND", "MIETE", "{n} CHITS, FÄLLIG IN 3 TAGEN", "DAVON HÜLLENABGABE {n}",
    "BAO", "ANGESCHRIEBEN", "STEUER_2089_NICHT_ÖFFNEN.TXT", "ESSEN!!.TXT", "Noch nichts.", "…"]);

  // the deck's registries, filled by the chapters
  /** @type {Record<string, {name: string, color: string, status: string, if?: any, unread?: any}>} */
  Halcyon.contacts = {};
  /** @type {Record<string, {from: string, text?: string, photo?: string, clip?: string, at?: string, if?: any}[]>} */
  Halcyon.threads = {};
  /** @type {Record<string, {id: string, text: string, if?: any, use: any[]}[]>} */
  Halcyon.replies = {};

  const inRect = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number[]} */ [rx, ry, rw, rh]) => x >= rx && y >= ry && x < rx + rw && y < ry + rh;

  // ---------------------------------------------------------------- the room
  Halcyon.buildDeck = function () {
    const [X, Y, WW, HH] = D.win;
    /** @type {Record<string, any>} */
    const hs = {};
    const app = (/** @type {string} */ a) => `deck_app=${a}`;
    APPS.forEach((a, i) => {
      const [x, y] = D.icon(i);
      hs[`app_${a}`] = { name: LABEL[a], rect: [x - 3, y - 2, 30, 34], use: [{ set: "deck_app", value: a }, { sfx: "type" }],
        look: `${LABEL[a]}.` };
    });
    hs.win_close = { name: "Schließen", rect: D.close, if: "deck_app", z: 6, use: [{ unset: "deck_app" }, { sfx: "type" }] };
    hs.wait = { name: "Warten", rect: D.buttons.wait, z: 6, use: [{ forward: true }] };
    hs.close = { name: "Zurück", rect: D.buttons.back, z: 6, exit: { to: "flat", at: Halcyon.at.flat.deck, face: "ne" } };
    const anyChat = { or: ["deck_app=chat", ...Object.keys(Halcyon.contacts).map((id) => `deck_app=chat_${id}`)] };
    // GLAS: the cameras on the map
    for (const [id, cam] of Object.entries(Halcyon.cams)) {
      const [mx, my] = cam.map, x = D.map[0] + mx, y = D.map[1] + my;
      hs[`cam_${id}`] = {
        name: `CAM ${cam.id}`, rect: [x - 4, y - 4, 48, 18], if: [app("glas"), ...(cam.if ? [cam.if] : [])], z: 4,
        look: `CAM ${cam.id}, ${cam.place}.`,
        use: [{ if: `link_${id}`, then: [{ goto: id }],
          else: [{ if: `code_${id}`, then: [{ set: `link_${id}` }, { sfx: "link" }, "Wartungscode rein. Verbunden."],
            else: ["Kein Zugang. Ich brauch den Wartungscode der Kamera."] }] }],
      };
    }
    // CHAT: the contacts (those that appear later come last, so the rows stay put), the replies
    Object.entries(Halcyon.contacts).forEach(([id, c], i) => {
      hs[`contact_${id}`] = { name: c.name, rect: [D.contacts.x, D.contacts.y - 3 + i * D.contacts.row, D.contacts.w, D.contacts.row - 1],
        if: [anyChat, ...(c.if ? [c.if] : [])], z: 4, use: [{ set: "deck_app", value: `chat_${id}` }, ...(c.unread ? [] : [{ set: `read_${id}` }])] };
    });
    for (const [who, list] of Object.entries(Halcyon.replies)) list.forEach((r, i) => {
      hs[`reply_${who}_${r.id}`] = { name: r.text, rect: [D.thread.x - 2, Y + HH - 14 - (list.length - 1 - i) * 11, X + WW - 4 - D.thread.x, 11],
        if: [`deck_app=chat_${who}`, ...(r.if ? [].concat(r.if) : [])], z: 5, use: [{ sfx: "mail" }, ...r.use] };
    });
    // CACHE: what Juno has; looking at an entry says what it is
    Object.entries(Halcyon.cache).forEach(([id, c], i) => {
      hs[`cache_${id}`] = { name: c.name, rect: [X + 4, D.cache.y - 3 + i * D.cache.row, WW - 8, D.cache.row - 1], if: [app("cache"), `cache_${id}`], z: 4,
        look: c.about, use: c.about };
    });
    // the files on the desktop (under the window when one is open)
    hs.file_steuer = { name: "steuer_2089_NICHT_ÖFFNEN.txt", rect: D.files.steuer, if: "!deck_app",
      look: "Die Steuer von 2089. Solange ich sie nicht öffne, gibt es sie nicht.", use: "Nein." };
    hs.file_essen = { name: "ESSEN!!.txt", rect: D.files.essen, if: "!deck_app",
      look: "Eine Datei, die ESSEN!! heißt. Von mir. An mich.", use: "Sie ist leer. Wie der Kühlschrank, vermutlich." };
    // EVI: on the deck she is the hint button
    hs.evi = { name: "EVI", rect: D.evi, z: 6, use: [{ hint: true }],
      look: "EVI. Sie wohnt auf meinem Deck und liest Kameras besser als Menschen." };

    Cutaway.room("deck", { name: "Deck", color: C.night, observe: true, deck: true, buttons: false, hotspots: hs,
      ambience: ["deck_fans", { sfx: "rain_glass", gain: 0.5 }, { sfx: "city_far", gain: 0.6 }],
      music: { theme: "juno", intensity: 0.4, speaker: 1 } });                    // the theme through the wall
  };

  // ---------------------------------------------------------------- drawing helpers
  /** @param {CanvasRenderingContext2D} ctx @param {string} s @param {number} x @param {number} y @param {string} color @param {"left" | "center" | "right"} [align] */
  const small = (ctx, s, x, y, color, align = "left") => hud().draw(ctx, s.toUpperCase(), x, y, { color, align });
  /** @param {CanvasRenderingContext2D} ctx @param {string} s @param {number} x @param {number} y @param {string} color @param {"left" | "center" | "right"} [align] */
  const text = (ctx, s, x, y, color, align = "left") => main().draw(ctx, s, x, y, { color, align });
  /** a text cut to a width, ending in "…" @param {string} s @param {number} w @param {any} f */
  function fit(s, w, f = main()) {
    if (f.measure(s) <= w) return s;
    const dots = t("…");
    while (s.length > 1 && f.measure(s + dots) > w) s = s.slice(0, -1);
    return s + dots;
  }
  /** wrap a text into lines no wider than w (by words; a language without spaces breaks anywhere) @param {string} s @param {number} w */
  function wrap(s, w) {
    const f = main(), out = [];
    let line = "";
    const words = s.includes(" ") ? s.split(" ") : [...s], sep = s.includes(" ") ? " " : "";
    for (const word of words) {
      const next = line ? line + sep + word : word;
      if (f.measure(next) > w && line) { out.push(line); line = word; } else line = next;
    }
    if (line) out.push(line);
    return out;
  }
  /** a box with the top-left and bottom-right corners cut at 45° (the skin's frames) */
  function chamfer(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ w, /** @type {number} */ h,
    /** @type {number} */ cut, /** @type {string | null} */ fill, /** @type {string} */ line, /** @type {string} */ bright) {
    for (let r = 0; r < h; r++) {
      const a = Math.max(0, cut - r), b = w - 1 - Math.max(0, cut - (h - 1 - r));
      if (fill) { ctx.fillStyle = fill; ctx.fillRect(x + a, y + r, b - a + 1, 1); }
      ctx.fillStyle = r < cut ? bright : line; ctx.fillRect(x + a, y + r, 1, 1);
      ctx.fillStyle = r > h - 1 - cut ? bright : line; ctx.fillRect(x + b, y + r, 1, 1);
    }
    ctx.fillStyle = line; ctx.fillRect(x + cut, y, w - cut, 1); ctx.fillRect(x, y + h - 1, w - cut, 1);
    ctx.fillStyle = bright; ctx.fillRect(x + cut, y, 12, 1);
  }
  const rect = (/** @type {CanvasRenderingContext2D} */ ctx, /** @type {string} */ c, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ w, /** @type {number} */ h) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const sprite = (/** @type {CanvasRenderingContext2D} */ ctx, /** @type {string} */ name, /** @type {number} */ x, /** @type {number} */ y) => {
    if (Cutaway.assets.has(name)) Cutaway.assets.draw(ctx, name, x, y, { anchor: [0, 0], t: Cutaway.clock.time });
  };
  /** a small button in the HUD font, its label centred in its rect */
  function button(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {number[]} */ [x, y, w, h], /** @type {string} */ label, /** @type {boolean} */ hot) {
    chamfer(ctx, x, y, w, h, 2, hot ? C.cyanDeep : C.steel1, C.cyanDark, hot ? C.cyanPale : C.cyan);
    small(ctx, t(label), x + w / 2, y + 2, hot ? C.cyanPale : C.cyan, "center");
  }
  const pointer = () => ({ x: Cutaway.input.x, y: Cutaway.input.y });
  /** does a contact have news for Juno? (its own `unread` condition, else until its thread was opened) @param {string} id */
  const fresh = (id) => { const c = Halcyon.contacts[id]; return S().test(c.if) && (c.unread ? S().test(c.unread) : !S().flag(`read_${id}`) && (Halcyon.threads[id] ?? []).some((m) => S().test(m.if))); };
  const unread = () => Object.keys(Halcyon.contacts).filter(fresh).length;
  /** the open app and, in the chat, whose thread */
  const opened = () => { const v = String(S().flag("deck_app") ?? ""); return v.startsWith("chat") ? { app: "chat", with: v.slice(5) } : { app: v, with: "" }; };

  // ---------------------------------------------------------------- the header
  function header(/** @type {CanvasRenderingContext2D} */ ctx) {
    rect(ctx, C.steel1, 0, 0, W, D.header); rect(ctx, C.steel3, 0, D.header - 1, W, 1); rect(ctx, C.cyanDark, 0, D.header - 1, 40, 1);
    small(ctx, t("DECK // J.REYES"), 4, 3, C.cyan);
    const p = pointer();
    button(ctx, D.buttons.back, "ZURÜCK", inRect(p.x, p.y, D.buttons.back));
    button(ctx, D.buttons.wait, "WARTEN", inRect(p.x, p.y, D.buttons.wait));
    const [date, time] = Halcyon.stamp().split(" ");
    let x = D.buttons.wait[0] - 6;
    small(ctx, t("{chits} CHITS", { chits: Number(S().flag("chits") ?? 0) }), x, 3, C.cyanPale, "right"); x -= hud().measure(t("{chits} CHITS", { chits: Number(S().flag("chits") ?? 0) })) + 7;
    small(ctx, date, x, 3, C.steel6, "right"); x -= hud().measure(date) + 6;
    small(ctx, time, x, 3, C.cyanPale, "right"); x -= hud().measure(time) + 7;
    const n = unread();
    if (n) {                                                  // the envelope and the count
      small(ctx, String(n), x, 3, C.magenta, "right"); x -= hud().measure(String(n)) + 2;
      rect(ctx, C.cyanPale, x - 7, 2, 7, 6); rect(ctx, C.steel1, x - 6, 3, 5, 4);
      ctx.fillStyle = C.cyanPale; for (const [a, b] of [[-6, 3], [-2, 3], [-5, 4], [-3, 4], [-4, 5]]) ctx.fillRect(x + a, b, 1, 1);
    }
  }

  // ---------------------------------------------------------------- the desktop
  function desktop(/** @type {CanvasRenderingContext2D} */ ctx) {
    sprite(ctx, "deck_wallpaper", 0, 0);
    const open = opened().app, p = pointer();
    APPS.forEach((a, i) => {
      const [x, y] = D.icon(i), hot = inRect(p.x, p.y, [x - 3, y - 2, 30, 34]);
      if (a === open || hot) { rect(ctx, a === open ? C.cyanDeep : "rgba(18, 60, 78, 0.55)", x - 3, y - 2, 30, 34); rect(ctx, C.cyan, x - 3, y - 2, 1, 34); }
      sprite(ctx, `deck_icon_${a}`, x, y);
      small(ctx, t(LABEL[a]), x + 12, y + 26, a === open ? C.cyanPale : C.steel6, "center");
      const news = (a === "chat" && unread() > 0) || (a === "glas" && Object.keys(Halcyon.cams).some((c) => S().flag(`code_${c}`) && !S().flag(`link_${c}`) && S().test(Halcyon.cams[c].if)));
      if (news) { rect(ctx, C.ink, x + 20, y - 1, 4, 4); rect(ctx, C.magenta, x + 21, y, 2, 2); }
    });
    if (!open) for (const [id, label] of [["steuer", "STEUER_2089_NICHT_ÖFFNEN.TXT"], ["essen", "ESSEN!!.TXT"]]) {
      const [x, y] = D.files[id];
      rect(ctx, C.steel6, x, y, 7, 9); rect(ctx, C.cyanPale, x, y, 5, 1);
      for (let r = y + 3; r < y + 8; r += 2) rect(ctx, C.steel4, x + 1, r, 5, 1);
      small(ctx, t(label), x + 10, y + 2, inRect(p.x, p.y, D.files[id]) ? C.cyanPale : C.steel6);
    }
  }

  // ---------------------------------------------------------------- the window and the apps
  function frame(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {string} */ title) {
    const [x, y, w, h] = D.win;
    chamfer(ctx, x, y, w, h, 6, C.fill, C.cyanDark, C.cyan);
    ctx.fillStyle = C.steel1;
    for (let r = y + 2; r < y + h - 1; r += 2) for (let q = x + 2 + (r % 3); q < x + w - 2; q += 3) ctx.fillRect(q, r, 1, 1);   // faint scanlines
    rect(ctx, C.magenta, x + w - 2, y + 5, 2, 8); rect(ctx, C.magentaDark, x + w - 2, y + 14, 2, 2);
    const tw = hud().measure(t(title).toUpperCase()) + 12;
    for (let r = 0; r < 8; r++) rect(ctx, r === 0 ? C.cyan : C.cyanDeep, x + 8 + (7 - r), y - 3 + r, tw - (7 - r), 1);
    small(ctx, t(title), x + 17, y - 1, C.cyanPale);
    const [cx, cy] = D.close, hot = inRect(pointer().x, pointer().y, D.close);
    rect(ctx, hot ? C.cyanDark : C.cyanDeep, cx + 2, cy + 2, 11, 7); rect(ctx, C.cyan, cx + 2, cy + 2, 11, 1);
    ctx.fillStyle = C.cyanPale; for (let d = 0; d < 3; d++) { ctx.fillRect(cx + 6 + d, cy + 4 + d, 1, 1); ctx.fillRect(cx + 8 - d, cy + 4 + d, 1, 1); }
    const lw = hud().measure(t("NINTH//SYS")) + 4;
    rect(ctx, C.night, x + w - 10 - lw, y + h - 1, lw, 1); small(ctx, t("NINTH//SYS"), x + w - 8 - lw, y + h - 3, C.steel6);
  }

  const APP_DRAW = {
    /** GLAS: the map of the quarter, every known camera a point; linked ones lit */
    glas(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [mx, my, mw, mh] = D.map;
      rect(ctx, C.steel1, mx, my, mw, mh);
      small(ctx, t("NETZKARTE // LOWER NINTH"), mx + 3, my + 3, C.steel5);
      ctx.fillStyle = C.steel3;
      for (const [x, y, w, h] of [[8, 40, 212, 3], [8, 86, 212, 3], [60, 12, 3, 108], [150, 12, 3, 108], [100, 43, 3, 43]]) ctx.fillRect(mx + x, my + y, w, h);
      ctx.fillStyle = C.cyanDeep; ctx.fillRect(mx + 8, my + 104, 212, 6);                    // the canal
      for (const [id, cam] of Object.entries(Halcyon.cams)) {
        if (!S().test(cam.if)) continue;
        const x = mx + cam.map[0], y = my + cam.map[1], linked = !!S().flag(`link_${id}`), code = !!S().flag(`code_${id}`);
        const hot = inRect(pointer().x, pointer().y, [x - 4, y - 4, 48, 18]);
        rect(ctx, linked ? C.cyan : code ? C.cyanDark : C.steel4, x - 2, y - 2, 5, 5);
        if (hot) { ctx.fillStyle = C.cyanPale; ctx.fillRect(x - 4, y - 4, 2, 1); ctx.fillRect(x - 4, y - 4, 1, 2); ctx.fillRect(x + 3, y + 4, 2, 1); ctx.fillRect(x + 4, y + 3, 1, 2); }
        small(ctx, t("CAM {id}", { id: cam.id }), x + 6, y - 2, linked ? C.cyanPale : C.steel6);
        small(ctx, t(linked ? "VERBUNDEN" : code ? "CODE BEKANNT" : "KEIN ZUGANG"), x + 6, y + 5, linked ? C.cyan : code ? C.cyan : C.steel5);
      }
    },
    /** CHAT: the contacts with their status, the thread of the one chosen, Juno's replies */
    chat(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y, WW, HH] = D.win, K = D.contacts, with_ = opened().with, p = pointer();
      small(ctx, t("KONTAKTE"), K.x + 2, Y + 7, C.steel6);
      Object.entries(Halcyon.contacts).forEach(([id, c], i) => {
        if (!S().test(c.if)) return;
        const y = K.y + i * K.row, on = id === with_, hot = inRect(p.x, p.y, [K.x, y - 3, K.w, K.row - 1]);
        if (on || hot) { rect(ctx, on ? C.cyanDeep : "rgba(18, 60, 78, 0.5)", K.x, y - 3, K.w, K.row - 1); rect(ctx, C.cyan, K.x, y - 3, 1, K.row - 1); }
        rect(ctx, C.steel2, K.x + 3, y, 10, 10); rect(ctx, c.color, K.x + 4, y + 1, 8, 8); rect(ctx, C.steel1, K.x + 6, y + 2, 4, 3); rect(ctx, C.steel1, K.x + 5, y + 7, 6, 2);
        small(ctx, fit(t(c.name), K.w - 26, hud()), K.x + 16, y + 1, on ? C.cyanPale : C.steel6);
        const st = t(c.status), dot = c.status === "online" ? C.cyan : c.status === "abwesend" ? C.amber : C.steel5;
        rect(ctx, dot, K.x + 16, y + 10, 3, 3);
        text(ctx, fit(st, K.w - 28), K.x + 22, y + 8, on ? C.cyan : C.steel6);
        if (fresh(id)) { rect(ctx, C.ink, K.x + K.w - 7, y + 1, 4, 4); rect(ctx, C.magenta, K.x + K.w - 6, y + 2, 2, 2); }
      });
      rect(ctx, C.steel3, K.x + K.w + 1, Y + 5, 1, HH - 10);
      const tx = D.thread.x, tw = X + WW - 6 - tx;
      const who = Halcyon.contacts[with_];
      if (!who) return;
      small(ctx, t(who.name), tx, Y + 7, C.cyanPale);
      small(ctx, t(who.status), X + WW - 22, Y + 7, C.cyan, "right");
      rect(ctx, C.steel3, tx, Y + 14, tw, 1);
      // Juno's replies at the bottom (each a hotspot), the thread above them, its newest messages last
      const replies = (Halcyon.replies[with_] ?? []).map((r, i) => ({ r, i, list: Halcyon.replies[with_] })).filter(({ r }) => S().test(r.if));
      let bottom = Y + HH - 4;
      if (replies.length) {
        const list = Halcyon.replies[with_], top = Y + HH - 14 - (list.length - 1) * 11;
        rect(ctx, C.steel3, tx - 2, top - 3, tw + 4, 1); rect(ctx, C.cyan, tx - 2, top - 3, 20, 1);
        for (const { r, i } of replies) {
          const y = Y + HH - 14 - (list.length - 1 - i) * 11, hot = inRect(p.x, p.y, [tx - 2, y, tw + 2, 11]);
          if (hot) { rect(ctx, C.cyanDeep, tx - 2, y, tw + 2, 11); rect(ctx, C.cyan, tx - 2, y, 1, 11); }
          small(ctx, `[${i + 1}]`, tx, y + 3, hot ? C.cyanPale : C.cyanDark);
          text(ctx, fit(t(r.text), tw - 16), tx + 14, y + 2, C.yellow);
        }
        bottom = top - 6;
      }
      // the messages as boxes, laid out from the bottom up; what doesn't fit scrolled off the top
      const msgs = (Halcyon.threads[with_] ?? []).filter((m) => S().test(m.if));
      /** @type {{m: any, lines: string[], h: number}[]} */
      const boxes = msgs.map((m) => {
        const lines = m.text ? wrap(t(m.text), tw - 34) : [];
        return { m, lines, h: (m.photo || m.clip ? 24 : 0) + lines.length * main().lineHeight + 4 + (m.text && (m.photo || m.clip) ? 2 : 0) };
      });
      let y = bottom;
      const top = Y + 18;
      ctx.save(); ctx.beginPath(); ctx.rect(tx - 2, top, tw + 4, bottom - top); ctx.clip();
      for (let i = boxes.length - 1; i >= 0 && y > top; i--) {
        const { m, lines, h } = boxes[i], mine = m.from === "juno";
        y -= h;
        const bw = Math.max(m.photo || m.clip ? 64 : 0, ...lines.map((l) => main().measure(l))) + 8, bx = mine ? tx + tw - bw : tx;
        rect(ctx, mine ? "#2a2410" : C.steel2, bx, y, bw, h); rect(ctx, mine ? C.yellowDim : C.cyanDark, mine ? bx + bw - 1 : bx, y, 1, h);
        let ly = y + 3;
        if (m.photo || m.clip) {
          rect(ctx, C.steel4, bx + 3, ly, 22, 18);
          if (m.clip) { ctx.fillStyle = C.steel1; for (let q = 0; q < 22; q += 3) { ctx.fillRect(bx + 3 + q, ly, 1, 2); ctx.fillRect(bx + 3 + q, ly + 16, 1, 2); } rect(ctx, "#266252", bx + 6, ly + 4, 16, 10); }
          else { rect(ctx, C.steel6, bx + 12, ly + 4, 5, 5); rect(ctx, C.steel3, bx + 9, ly + 10, 11, 8); rect(ctx, C.cyanPale, bx + 10, ly + 9, 9, 2); }
          small(ctx, t(m.clip ? "CLIP" : "FOTO"), bx + 28, ly + 3, C.cyan);
          small(ctx, fit(t(m.photo ?? m.clip), bw - 32, hud()), bx + 28, ly + 11, C.steel6);
          ly += 22;
        }
        lines.forEach((l) => { text(ctx, l, bx + 4, ly, mine ? C.yellow : C.cyanPale); ly += main().lineHeight; });
        if (m.at) small(ctx, t(m.at), mine ? bx - 3 : bx + bw + 3, y + h - 6, C.steel5, mine ? "right" : "left");
        y -= 3;
      }
      ctx.restore();
    },
    /** CACHE: clips and notes, with what they are */
    cache(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, , WW] = D.win, p = pointer();
      const own = Object.entries(Halcyon.cache);
      if (!own.some(([id]) => S().flag(`cache_${id}`))) text(ctx, t("Noch nichts."), X + 8, D.cache.y, C.steel6);
      own.forEach(([id, c], i) => {
        if (!S().flag(`cache_${id}`)) return;
        const y = D.cache.y + i * D.cache.row, hot = inRect(p.x, p.y, [X + 4, y - 3, WW - 8, D.cache.row - 1]);
        if (hot) { rect(ctx, C.cyanDeep, X + 4, y - 3, WW - 8, D.cache.row - 1); rect(ctx, C.cyan, X + 4, y - 3, 1, D.cache.row - 1); }
        if (c.kind === "clip") { rect(ctx, C.steel1, X + 8, y, 14, 12); rect(ctx, "#266252", X + 10, y + 2, 10, 8); ctx.fillStyle = C.steel4; for (let q = 0; q < 14; q += 3) { ctx.fillRect(X + 8 + q, y, 1, 1); ctx.fillRect(X + 8 + q, y + 11, 1, 1); } }
        else { rect(ctx, C.steel6, X + 9, y, 12, 12); rect(ctx, C.cyanPale, X + 9, y, 12, 1); rect(ctx, C.steel4, X + 11, y + 4, 8, 1); rect(ctx, C.steel4, X + 11, y + 7, 6, 1); }
        small(ctx, t(c.kind === "clip" ? "CLIP" : "NOTIZ"), X + 26, y, c.kind === "clip" ? C.cyan : C.steel6);
        small(ctx, fit(t(c.name), WW - 60, hud()), X + 50, y, C.cyanPale);
        text(ctx, fit(t(c.about), WW - 36), X + 26, y + 8, C.steel6);
      });
    },
    /** BUCH: the Kassenbuch, every delivery and what it paid */
    buch(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, , WW] = D.win;
      small(ctx, t("KASSENBUCH"), X + 8, D.buch.y - 8, C.steel6);
      const done = Object.entries(Halcyon.ledger).filter(([k]) => S().flag(`ledger_${k}`));
      if (!done.length) text(ctx, t("Noch nichts."), X + 8, D.buch.y + 2, C.steel6);
      done.forEach(([k, e], i) => {
        const v = String(S().flag(`ledger_${k}`)), pay = e.chits?.[v] ?? 0, y = D.buch.y + 2 + i * D.buch.row;
        text(ctx, fit(t("{to}: {what}", { to: t(e.to), what: t(e.what[v] ?? v) }), WW - 60), X + 8, y, C.amber);
        if (pay) small(ctx, t("+{chits}", { chits: pay }), X + WW - 10, y + 1, C.amber, "right");
      });
    },
    /** KONTO: chits, the rent with the hull levy, Bao */
    konto(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y] = D.win;
      small(ctx, t("KONTOSTAND"), X + 8, Y + 10, C.steel6);
      text(ctx, t("{chits} CHITS", { chits: Number(S().flag("chits") ?? 0) }), X + 8, Y + 19, C.cyanPale);
      small(ctx, t("MIETE"), X + 8, Y + 40, C.steel6);
      text(ctx, t("{n} CHITS, FÄLLIG IN 3 TAGEN", { n: 900 }), X + 8, Y + 49, C.amber);
      small(ctx, t("DAVON HÜLLENABGABE {n}", { n: 310 }), X + 8, Y + 61, C.steel5);
      small(ctx, t("BAO"), X + 8, Y + 80, C.steel6);
      text(ctx, t("ANGESCHRIEBEN"), X + 8, Y + 89, C.cyanPale);
    },
    /** NETZ: HalcyonNet's front page (in the prologue only that) */
    netz(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y, WW] = D.win;
      rect(ctx, C.cyanDeep, X + 6, Y + 8, WW - 12, 12); small(ctx, "HALCYON.NET", X + 10, Y + 12, C.cyanPale);
      wrap(t("Kriminalität im Neunten auf Rekordtief."), WW - 20).forEach((l, i) => text(ctx, l, X + 8, Y + 26 + i * 10, C.cyanPale));
      rect(ctx, C.magentaDark, X + 6, Y + 52, WW - 12, 30); small(ctx, "LULL // SLEEP BETTER", X + 10, Y + 56, C.magenta);
      text(ctx, t("Vier Stunden wie zehn. Zwei Wochen gratis."), X + 10, Y + 66, "#ffc0f2");
      small(ctx, "NINTH LIVE // TONIGHT", X + 8, Y + 92, C.amber);
    },
    /** RADIO: the stations (the game's music; Lantern's pirate station comes in Chapter 2) */
    radio(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y] = D.win;
      small(ctx, "NINTH FM // 88.4", X + 8, Y + 10, C.cyanPale);
      small(ctx, "HALCYON EASY // 101.0", X + 8, Y + 22, C.steel6);
      small(ctx, "KESSEL ROOFTOP // 94.2", X + 8, Y + 34, C.steel6);
    },
    /** MÜLL: what Juno threw away and never opened */
    muell(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y] = D.win;
      small(ctx, "HALCYON_PERSONAL_KUENDIGUNG.MSG", X + 8, Y + 10, C.steel6);
      small(ctx, "AN_TEO_ENTWURF_3.TXT", X + 8, Y + 22, C.steel6);
      small(ctx, "AN_TEO_ENTWURF_7.TXT", X + 8, Y + 34, C.steel6);
    },
  };
  Cutaway.i18n.declare("deck: net", ["Kriminalität im Neunten auf Rekordtief.", "Vier Stunden wie zehn. Zwei Wochen gratis."]);

  // ---------------------------------------------------------------- EVI in her corner
  function evi(/** @type {CanvasRenderingContext2D} */ ctx) {
    const p = pointer(), hot = inRect(p.x, p.y, D.evi);
    sprite(ctx, hot ? "evi_hover" : "evi_idle", D.evi[0], D.evi[1] - (hot ? 1 : 0));
  }

  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    const r = Cutaway.scene.room;
    if (!r?.deck || Cutaway.scene.backdrop) return;
    desktop(ctx);
    const open = opened().app;
    if (open && /** @type {any} */ (APP_DRAW)[open]) { frame(ctx, LABEL[/** @type {keyof typeof LABEL} */ (open)]); /** @type {any} */ (APP_DRAW)[open](ctx); }
    header(ctx);
    evi(ctx);
  });
})();
