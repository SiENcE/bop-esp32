// Halcyon: Juno's deck as a computer (docs/kapitel0-design.md §2, mockup F: docs/mockups/mock_f_deck_*). A
// watched room (`deck`) without a picture of its own: this file gives it its hotspots and draws the screen
// over it (the engine's "frame.screen" moment). What is open is state the solver sees, kept to one flag:
//   deck_app     the app whose window is open (glas, chat, cache, buch, konto, netz, radio, muell), or none;
//                the chat with a thread open is "chat_<contact>", a clip in the clip editor "clip_<cache id>",
//                the old photo full screen "photo". Entering the flat closes it (its enter
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
  const LABEL = { glas: "GLASS", chat: "CHAT", cache: "CACHE", buch: "BUCH", konto: "KONTO", netz: "NETZ", radio: "RADIO", muell: "MÜLL" };
  const D = Halcyon.deckUI = {
    header: 11,
    /** the app icons: two columns of four @param {number} i */
    icon: (i) => [8 + (i >> 2) * 34, 16 + (i & 3) * 34],
    win: [76, 15, 240, 137],                                 // the app window [x, y, w, h]
    close: [297, 10, 15, 11],                                // its close box (on the frame's top line)
    buttons: { wait: [236, 1, 40, 9], back: [278, 1, 40, 9] },
    evi: [290, 154, 24, 24],
    files: { steuer: [86, 122, 150, 10], essen: [86, 136, 70, 10] },     // above the strip EVI speaks in
    contacts: { x: 79, w: 82, y: 30, row: 22 },
    thread: { x: 166 },
    cache: { y: 30, row: 22 },
    buch: { y: 30, row: 12 },
    clip: { pic: [82, 23, 96, 56], meta: 185, line: [84, 90, 224], tools: 137 },   // the clip editor: picture, who/where, timeline, tools
    map: [82, 22, 228, 124],                                  // GLASS's map inside the window
    camBox: 54,                                               // a camera's place on it, as wide as its longest line ("CODE BEKANNT"): keep the cameras this far apart
  };
  Cutaway.i18n.declare("deck", [...Object.values(LABEL), "DECK // J.REYES", "{time}  {date}", "{chits} CHITS", "WARTEN", "ZURÜCK",
    "KONTAKTE", "KEIN ZUGANG", "CODE BEKANNT", "VERBUNDEN", "NETZKARTE // LOWER NINTH", "CLIP", "NOTIZ", "FOTO", "GELESEN", "online",
    "abwesend", "schläft", "Werbung", "KASSENBUCH", "+{chits}", "KONTOSTAND", "MIETE", "{n} CHITS, FÄLLIG IN 3 TAGEN", "{n} CHITS, FÄLLIG IN 2 TAGEN", "{n} CHITS, FÄLLIG MORGEN", "{n} CHITS, FÄLLIG HEUTE", "{n} CHITS, BEZAHLT", "{n} CHITS, BEZAHLT VON TEO", "DAVON HÜLLENABGABE {n}",
    "BAO", "ANGESCHRIEBEN", "STEUER_2089_NICHT_ÖFFNEN.TXT", "ESSEN!!.TXT", "Noch nichts.", "…",
    "CACHE // {name}", "WO", "WANN", "LÄNGE", "WER", "{cam} // {place}", "{min} MIN", "SCHNEIDEN", "ANONYMISIEREN", "PRÜFEN", "MONTIEREN",
    "SCHNITT {s} S", "GESCHNITTEN", "KAP. {n}"]);

  // what is open is a view, not game state: the solver opens whatever window a move needs (engine state.view)
  Cutaway.state.view("deck_app");

  // the deck's registries, filled by the chapters
  /** @type {Record<string, {name: string, color: string, status: string, if?: any, unread?: any, open?: any[]}>} */
  Halcyon.contacts = {};
  /** @type {Record<string, {from: string, text?: string, photo?: string, clip?: string, at?: string, if?: any}[]>} */
  Halcyon.threads = {};
  /** @type {Record<string, {id: string, text: string, if?: any, use: any[]}[]>} */
  Halcyon.replies = {};
  /** The clip editor's clips (docs/kapitel0-design.md §2.4), by cache id: the camera, the minutes it runs
   * (22:31 is 31), its moments and who is in it, what a cut keeps and makes (a new cache entry), the script
   * after the cut.
   * @type {Record<string, {cam: string, from: number, to: number, thumb?: string, moments: [number, number, string][],
   *   people: [string, number, number][], cut?: {moment: number, gives: string, then?: any[]}}>} */
  Halcyon.clips = {};
  /** the old photo (art/ui/deck_wallpaper.px.js): what Juno says looking at it, its music (a click shows it whole) */
  Halcyon.photo = { music: { theme: "memory", fade: 2 }, back: { theme: "juno", intensity: 0.4, speaker: 1, fade: 2 }, look: /** @type {any} */ (null) };

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
    // GLASS: the cameras on the map
    for (const [id, cam] of Object.entries(Halcyon.cams)) {
      const [mx, my] = cam.map, x = D.map[0] + mx, y = D.map[1] + my;
      hs[`cam_${id}`] = {
        name: `CAM ${cam.id}`, rect: [x - 4, y - 4, D.camBox, 18], if: [app("glas"), ...(cam.if ? [cam.if] : [])], z: 4,
        look: `CAM ${cam.id}, ${cam.place}.`,
        use: [{ if: `link_${id}`, then: [{ goto: id }],
          else: [{ if: `code_${id}`, then: [{ set: `link_${id}` }, { sfx: "link" }, ...(/** @type {any} */ (cam).linked ?? ["Wartungscode rein. Verbunden."])],
            else: /** @type {any} */ (cam).tryIt ?? ["Kein Zugang. Ich brauch den Wartungscode der Kamera."] }] }],
      };
    }
    // CHAT: the contacts (those that appear later come last, so the rows stay put), the replies
    Object.entries(Halcyon.contacts).forEach(([id, c], i) => {
      hs[`contact_${id}`] = { name: c.name, rect: [D.contacts.x, D.contacts.y - 3 + i * D.contacts.row, D.contacts.w, D.contacts.row - 1],
        if: [anyChat, ...(c.if ? [c.if] : [])], z: 4, use: [{ set: "deck_app", value: `chat_${id}` }, ...(c.unread ? [] : [{ set: `read_${id}` }]), ...(/** @type {any} */ (c).open ?? [])] };
    });
    for (const [who, list] of Object.entries(Halcyon.replies)) list.forEach((r, i) => {
      hs[`reply_${who}_${r.id}`] = { name: r.text, rect: [D.thread.x - 2, Y + HH - 14 - (list.length - 1 - i) * 11, X + WW - 4 - D.thread.x, 11],
        if: [`deck_app=chat_${who}`, ...(r.if ? [].concat(r.if) : [])], z: 5, use: [{ sfx: "mail" }, ...r.use] };
    });
    // CACHE: what Juno has; looking at an entry says what it is
    Object.entries(Halcyon.cache).forEach(([id, c], i) => {
      hs[`cache_${id}`] = { name: c.name, rect: [X + 4, D.cache.y - 3 + i * D.cache.row, WW - 8, D.cache.row - 1], if: [app("cache"), `cache_${id}`], z: 4,
        look: c.about, use: Halcyon.clips[id] ? [{ set: "deck_app", value: `clip_${id}` }, { sfx: "type" }] : c.about };
    });
    // the clip editor: cutting keeps one moment and makes a new clip of it
    for (const [id, clip] of Object.entries(Halcyon.clips)) {
      if (!clip.cut) continue;
      hs[`clip_cut_${id}`] = { name: "Schneiden", rect: [X + 8, D.clip.tools, 44, 10], z: 5, if: [`deck_app=clip_${id}`, `!cache_${clip.cut.gives}`, ...(clip.cut.if ? [clip.cut.if] : [])],
        use: [{ sfx: "glitch" }, { cache: clip.cut.gives }, ...(clip.cut.then ?? [])] };
    }
    // the old photo: a click on the wallpaper shows it whole, with its music; a click anywhere closes it
    hs.photo = { name: "Das alte Foto", rect: [80, 14, 206, 104], if: "!deck_app", z: 1,
      look: Halcyon.photo.look ?? "Das Foto von Teo und mir.",
      use: [{ set: "deck_app", value: "photo" }, { music: Halcyon.photo.music }] };
    hs.photo_close = { name: "Zurück", rect: [0, 0, W, H], if: "deck_app=photo", z: 9,
      use: [{ unset: "deck_app" }, { music: Halcyon.photo.back }] };
    // the files on the desktop (under the window when one is open)
    hs.file_steuer = { name: "steuer_2089_NICHT_ÖFFNEN.txt", rect: D.files.steuer, if: "!deck_app",
      look: "Die Steuer von 2089. Solange ich sie nicht öffne, gibt es sie nicht.", use: "Nein." };
    hs.file_essen = { name: "ESSEN!!.txt", rect: D.files.essen, if: "!deck_app",
      look: "Eine Datei, die ESSEN!! heißt. Von mir. An mich.", use: "Sie ist leer. Wie der Kühlschrank, vermutlich." };
    // EVI: on the deck she is the hint button
    hs.evi = { name: "EVI", rect: D.evi, z: 6, use: [{ hint: true }],
      look: "EVI. Sie wohnt auf meinem Deck und liest Kameras besser als Menschen." };

    Cutaway.room("deck", { name: "Deck", color: C.night, observe: true, deck: true, buttons: false, hotspots: hs, enter: Halcyon.deckEnter ?? [],
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
  const opened = () => {
    const v = String(S().flag("deck_app") ?? "");
    if (v.startsWith("chat")) return { app: "chat", with: v.slice(5), clip: "" };
    if (v.startsWith("clip_")) return { app: "cache", with: "", clip: v.slice(5) };
    return { app: v, with: "", clip: "" };
  };

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

  // The chat's two lists scroll a pixel at a time, by their arrows, the wheel and a finger; only the screen's, not saved. y where it is, to where
  // it is going (the arrows and the wheel ease there), max how far it goes (the drawing says), up and down the arrows' rects when they show.
  // The thread counts back from its newest message, so it starts at its end and stays there when one comes in; the contacts count from the top.
  const list = () => ({ y: 0, to: 0, max: 0, /** @type {number[] | null} */ up: null, /** @type {number[] | null} */ down: null });
  const scroll = { contacts: list(), thread: list(), with: "" };
  const STEP = 22;
  const by = (/** @type {ReturnType<typeof list>} */ l, /** @type {number} */ d, snap = false) => { l.to = Math.max(0, Math.min(l.max, l.to + d)); if (snap) l.y = l.to; };
  const chatOpen = () => !!Cutaway.scene.room?.deck && String(S().flag("deck_app") ?? "").startsWith("chat") && !Cutaway.menu.isOpen;
  /** the list under a point, with the direction a positive move goes in it (down the screen: older messages, later contacts) */
  const listAt = (/** @type {number} */ x) => (x <= D.contacts.x + D.contacts.w + 1 ? { l: scroll.contacts, dir: 1 } : { l: scroll.thread, dir: -1 });
  Cutaway.ui.addLayer({
    z: 20,
    click(/** @type {{x: number, y: number}} */ p) {
      if (!chatOpen()) return false;
      for (const [l, dir] of /** @type {[ReturnType<typeof list>, number][]} */ ([[scroll.contacts, 1], [scroll.thread, -1]])) {
        for (const [r, d] of /** @type {[number[] | null, number][]} */ ([[l.up, -1], [l.down, 1]])) {
          if (r && inRect(p.x, p.y, r)) { by(l, d * dir * STEP); Cutaway.events.emit("sfx", { sfx: "type" }); return true; }
        }
      }
      return false;
    },
    update() { for (const l of [scroll.contacts, scroll.thread]) { l.y += (l.to - l.y) * 0.25; if (Math.abs(l.to - l.y) < 0.5) l.y = l.to; } },
  });
  Cutaway.events.on("pointer.wheel", (/** @type {{x: number, dy: number}} */ e) => { if (chatOpen()) { const { l, dir } = listAt(e.x); by(l, dir * e.dy / 4); } });
  // a finger pulls the list with it (only where there is something to pull: else a shaky tap should stay a tap)
  Cutaway.events.on("pointer.drag", (/** @type {{from: {x: number}, dy: number, claim: () => void}} */ e) => {
    if (!chatOpen()) return;
    const { l, dir } = listAt(e.from.x);
    if (l.max > 0) { e.claim(); by(l, -dir * e.dy, true); }
  });
  /** a list's arrows and the bar between them */
  function scrollBar(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {ReturnType<typeof list>} */ l, /** @type {number} */ x, /** @type {number} */ top, /** @type {number} */ bottom, /** @type {boolean} */ fromEnd, /** @type {{x: number, y: number}} */ p) {
    const at = fromEnd ? l.max - l.y : l.y;                   // how far from the top of what there is
    l.up = at > 0 ? [x, top, 10, 8] : null;
    l.down = at < l.max ? [x, bottom - 8, 10, 8] : null;
    if (!l.max) return;
    const th = top + 9, tb = bottom - 9, h = tb - th, bar = Math.max(4, Math.round(h * h / (h + l.max)));
    rect(ctx, C.steel2, x + 4, th, 2, h);
    rect(ctx, C.steel5, x + 4, th + Math.round((h - bar) * at / l.max), 2, bar);
    for (const [r, up] of /** @type {[number[] | null, boolean][]} */ ([[l.up, true], [l.down, false]])) {
      if (!r) continue;
      rect(ctx, inRect(p.x, p.y, r) ? C.cyanDark : C.cyanDeep, r[0], r[1], r[2], r[3]);
      ctx.fillStyle = C.cyanPale;
      for (let d = 0; d < 3; d++) ctx.fillRect(r[0] + 5 - d, r[1] + (up ? 2 + d : 5 - d), 1 + 2 * d, 1);
    }
  }

  const APP_DRAW = {
    /** GLASS: the map of the quarter, every known camera a point; linked ones lit */
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
        const hot = inRect(pointer().x, pointer().y, [x - 4, y - 4, D.camBox, 18]);
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
      const listTop = K.y - 3, listBottom = Y + HH - 4, known = Object.entries(Halcyon.contacts).filter(([, c]) => S().test(c.if)), C1 = scroll.contacts;
      C1.max = Math.max(0, known.length * K.row - 1 - (listBottom - listTop)); C1.to = Math.min(C1.to, C1.max);
      ctx.save(); ctx.beginPath(); ctx.rect(K.x, listTop, K.w, listBottom - listTop); ctx.clip();
      known.forEach(([id, c], i) => {
        const y = K.y + i * K.row - Math.round(C1.y), on = id === with_, y0 = Math.max(y - 3, listTop), y1 = Math.min(y - 3 + K.row - 1, listBottom);
        // its hotspot is what shows of its row (the room holds the hotspots, this draws them where they are now; none if it is scrolled away)
        Cutaway.room.get("deck").hotspots[`contact_${id}`].rect = y1 > y0 ? [K.x, y0, K.w, y1 - y0] : [0, 0, 0, 0];
        const hot = y1 > y0 && inRect(p.x, p.y, [K.x, y0, K.w, y1 - y0]);
        if (on || hot) { rect(ctx, on ? C.cyanDeep : "rgba(18, 60, 78, 0.5)", K.x, y - 3, K.w, K.row - 1); rect(ctx, C.cyan, K.x, y - 3, 1, K.row - 1); }
        rect(ctx, C.steel2, K.x + 3, y, 10, 10); rect(ctx, c.color, K.x + 4, y + 1, 8, 8); rect(ctx, C.steel1, K.x + 6, y + 2, 4, 3); rect(ctx, C.steel1, K.x + 5, y + 7, 6, 2);
        small(ctx, fit(t(c.name), K.w - 30, hud()), K.x + 16, y + 1, on ? C.cyanPale : C.steel6);
        const st = t(c.status), dot = c.status === "online" ? C.cyan : c.status === "abwesend" ? C.amber : C.steel5;
        rect(ctx, dot, K.x + 16, y + 10, 3, 3);
        text(ctx, fit(st, K.w - 34), K.x + 22, y + 8, on ? C.cyan : C.steel6);
        if (fresh(id)) { rect(ctx, C.ink, K.x + K.w - 13, y + 1, 4, 4); rect(ctx, C.magenta, K.x + K.w - 12, y + 2, 2, 2); }
      });
      ctx.restore();
      scrollBar(ctx, C1, K.x + K.w - 10, listTop, listBottom, false, p);
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
      // the messages as boxes, laid out from the bottom up, in the column left of the scroll bar
      const msgs = (Halcyon.threads[with_] ?? []).filter((m) => S().test(m.if)), mw = tw - 12;
      /** @type {{m: any, lines: string[], h: number}[]} */
      const boxes = msgs.map((m) => {
        const lines = m.text ? wrap(t(m.text), tw - 44) : [];
        return { m, lines, h: (m.photo || m.clip ? 24 : 0) + lines.length * main().lineHeight + 4 + (m.text && (m.photo || m.clip) ? 2 : 0) };
      });
      const top = Y + 18, T1 = scroll.thread;
      if (scroll.with !== with_) { scroll.with = with_; T1.y = T1.to = 0; }     // a thread opens at its end
      T1.max = Math.max(0, boxes.reduce((n, b) => n + b.h + 3, -3) - (bottom - top)); T1.to = Math.min(T1.to, T1.max);
      let y = bottom + Math.round(T1.y);
      ctx.save(); ctx.beginPath(); ctx.rect(tx - 2, top, mw + 3, bottom - top); ctx.clip();
      for (let i = boxes.length - 1; i >= 0 && y > top; i--) {
        const { m, lines, h } = boxes[i], mine = m.from === "juno";
        y -= h;
        if (y < bottom) {
          const bw = Math.max(m.photo || m.clip ? 64 : 0, ...lines.map((l) => main().measure(l))) + 8, bx = mine ? tx + mw - bw : tx;
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
        }
        y -= 3;
      }
      ctx.restore();
      scrollBar(ctx, T1, tx + tw - 9, top, bottom, true, p);
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
      const rent = S().flag("rent"), left = 4 - (Number(S().flag("day")) || 1);       // day 4 is Friday, when it is due
      text(ctx, t(rent === "paid" ? "{n} CHITS, BEZAHLT" : rent === "teo" ? "{n} CHITS, BEZAHLT VON TEO"
        : left >= 3 ? "{n} CHITS, FÄLLIG IN 3 TAGEN" : left === 2 ? "{n} CHITS, FÄLLIG IN 2 TAGEN" : left === 1 ? "{n} CHITS, FÄLLIG MORGEN" : "{n} CHITS, FÄLLIG HEUTE", { n: 900 }), X + 8, Y + 49, C.amber);
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
    const p = pointer(), hot = inRect(p.x, p.y, D.evi), E = Halcyon.evi;
    const talking = Cutaway.ui.line?.actor === "evi", bob = talking && Math.floor(Cutaway.clock.time / 180) % 2 ? 1 : 0;
    if (E.face) sprite(ctx, `evi_${E.face}`, D.evi[0], D.evi[1] - bob);
    else if (talking) sprite(ctx, "evi_froh", D.evi[0], D.evi[1] - bob);
    else sprite(ctx, hot ? "evi_hover" : "evi_idle", D.evi[0], D.evi[1] - (hot ? 1 : 0));
    // pointing at an app: its icon pulses in brackets until it is opened
    if (E.point && opened().app === E.point) E.point = null;
    const i = E.point ? APPS.indexOf(E.point) : -1;
    if (i >= 0 && Math.floor(Cutaway.clock.time / 300) % 2 === 0) {
      const [x, y] = D.icon(i);
      ctx.fillStyle = C.mint;
      for (const [cx, cy, dx, dy] of [[x - 4, y - 3, 1, 1], [x + 27, y - 3, -1, 1], [x - 4, y + 32, 1, -1], [x + 27, y + 32, -1, -1]]) {
        ctx.fillRect(dx > 0 ? cx : cx - 3, cy, 4, 1); ctx.fillRect(cx, dy > 0 ? cy : cy - 3, 1, 4);
      }
    }
  }

  // ---------------------------------------------------------------- the clip editor (mockup F, clip)
  /** @param {CanvasRenderingContext2D} ctx @param {string} id */
  function editor(ctx, id) {
    const clip = Halcyon.clips[id], [X, Y, WW, HH] = D.win, E = D.clip, p = pointer();
    if (!clip) return;
    const cam = Halcyon.cams[clip.cam], cut = clip.cut && S().flag(`cache_${clip.cut.gives}`);
    // the picture: the moment the cut keeps, in the feed's phosphor, with the implant's tags
    const [px, py, pw, ph] = E.pic;
    rect(ctx, C.ink, px - 1, py - 1, pw + 2, ph + 2);
    if (clip.thumb && Cutaway.assets.has(clip.thumb)) Cutaway.assets.draw(ctx, clip.thumb, px, py, { anchor: [0, 0], t: Cutaway.clock.time });
    else rect(ctx, "#12332d", px, py, pw, ph);
    small(ctx, t("CAM {id}", { id: cam?.id ?? "" }), px + 2, py + 2, "#d4f7e2");
    // where, when, how long, who
    const mm = (/** @type {number} */ m) => `22:${String(Math.floor(m)).padStart(2, "0")}`;
    const meta = [["WO", t("{cam} // {place}", { cam: t("CAM {id}", { id: cam?.id ?? "" }), place: t(cam?.place ?? "") })],
      ["WANN", `${mm(clip.from)}-${mm(clip.to)}`], ["LÄNGE", t("{min} MIN", { min: `${Math.floor(clip.to - clip.from)}:${String(Math.round(((clip.to - clip.from) % 1) * 60)).padStart(2, "0")}` })],
      ["WER", clip.people.map(([who]) => t(Halcyon.people[who]?.name ?? who)).join(", ")]];
    meta.forEach(([k, v], i) => { small(ctx, t(k), E.meta, py + 1 + i * 15, C.steel6); small(ctx, fit(v, X + WW - 6 - E.meta, hud()), E.meta, py + 8 + i * 15, C.cyanPale); });
    // the timeline: the minutes, the moments, who is in the picture when; the cut in brackets
    const [lx, ly, lw] = E.line, at = (/** @type {number} */ m) => Math.round(lx + (m - clip.from) / (clip.to - clip.from) * lw);
    rect(ctx, C.steel4, lx, ly + 6, lw, 1);
    for (let m = Math.ceil(clip.from); m <= clip.to; m++) { rect(ctx, C.steel5, at(m), ly + 4, 1, 3); small(ctx, mm(m), at(m), ly - 1, C.steel5, m === Math.ceil(clip.from) ? "left" : m === Math.floor(clip.to) ? "right" : "center"); }
    clip.moments.forEach(([a, b, label], i) => {
      const kept = clip.cut?.moment === i;
      rect(ctx, kept ? C.cyanDark : C.steel3, at(a) + 1, ly + 9, Math.max(1, at(b) - at(a) - 1), 9);
      // a moment too short for its name keeps it for the caption under the cut
      if (hud().measure(t(label).toUpperCase()) + 5 <= at(b) - at(a)) small(ctx, t(label), at(a) + 3, ly + 11, kept ? C.cyanPale : C.steel6);
    });
    clip.people.forEach(([who, a, b], i) => {
      const y = ly + 21 + i * 8;
      small(ctx, t(Halcyon.people[who]?.name ?? who), lx, y, C.steel6);
      rect(ctx, C.steel4, Math.max(at(a), lx + 34), y + 1, at(b) - Math.max(at(a), lx + 34), 3);
    });
    if (clip.cut) {
      const [a, b, label] = clip.moments[clip.cut.moment];
      for (const m of [a, b]) { rect(ctx, C.cyan, at(m), ly + 7, 1, 31); rect(ctx, C.cyan, m === a ? at(m) : at(m) - 2, ly + 7, 3, 1); rect(ctx, C.cyan, m === a ? at(m) : at(m) - 2, ly + 37, 3, 1); }
      small(ctx, `${t(label)}: ${t(cut ? "GESCHNITTEN" : "SCHNITT {s} S", { s: Math.round((b - a) * 60) })}`, Math.round((at(a) + at(b)) / 2), ly + 40, C.cyan, "center");
      rect(ctx, C.yellow, Math.round((at(a) + at(b)) / 2), ly + 2, 1, 36);                     // the playhead: where Juno looks
    }
    // the tools: cutting now; the others come in later chapters (locked)
    let bx = X + 8;
    const tools = /** @type {[string, boolean, number | null][]} */ ([["SCHNEIDEN", !!clip.cut && !cut, null], ["ANONYMISIEREN", false, 1], ["PRÜFEN", false, 2], ["MONTIEREN", false, 2]]);
    for (const [label, on, chapter] of tools) {
      const w = hud().measure(t(label)) + 8, r = [bx, E.tools, w, 10], hot = on && inRect(p.x, p.y, r), dim = !on;
      chamfer(ctx, bx, E.tools, w, 10, 2, hot ? C.cyanDark : on ? C.cyanDeep : C.steel1, dim ? C.steel3 : C.cyan, dim ? C.steel4 : C.cyanPale);
      small(ctx, t(label), bx + 4, E.tools + 3, dim ? C.steel4 : C.cyanPale);
      bx += w + 4;
    }
  }

  /** the boot: a second of scrolling lines and a glitch, then EVI wakes (rubs her eyes) */
  function boot(/** @type {CanvasRenderingContext2D} */ ctx) {
    const age = Cutaway.clock.time - Halcyon.evi.boot;
    if (Halcyon.evi.boot < 0 || age > 1300) return false;
    rect(ctx, C.night, 0, 0, W, H);
    const rows = ["NINTH//SYS 4.1", "MEM 512M OK", "GLASS LINK ... OK", "CACHE 8 SLOTS", "LEDGER ... OK", "EVAL-7 ... WAKE"];
    rows.slice(0, Math.min(rows.length, Math.floor(age / 160) + 1)).forEach((r, i) => small(ctx, r, 8, 8 + i * 8, i === rows.length - 1 ? C.mint : C.cyanDark));
    if (age > 500 && age < 620) for (let k = 0; k < 4; k++) rect(ctx, k % 2 ? C.magentaDark : C.cyanDeep, 0, 30 + k * 31 + (age % 13), W, 2);   // the glitch
    if (age > 900) sprite(ctx, Math.floor(age / 120) % 2 ? "evi_muede" : "evi_schlaf", D.evi[0], D.evi[1]);
    return true;
  }

  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    const r = Cutaway.scene.room;
    if (!r?.deck || Cutaway.scene.backdrop) return;
    if (boot(ctx)) return;
    if (S().flag("deck_app") === "photo") { sprite(ctx, "deck_photo", 0, 0); return; }     // the old photo, whole
    desktop(ctx);
    const { app: open, clip } = opened();
    if (clip) { frame(ctx, t("CACHE // {name}", { name: t(Halcyon.cache[clip]?.name ?? clip) })); editor(ctx, clip); }
    else if (open && /** @type {any} */ (APP_DRAW)[open]) { frame(ctx, LABEL[/** @type {keyof typeof LABEL} */ (open)]); /** @type {any} */ (APP_DRAW)[open](ctx); }
    header(ctx);
    evi(ctx);
  });
})();
