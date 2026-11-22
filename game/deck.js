// Nagiwa: Juno's deck as a computer (docs/kapitel0-design.md §2, mockup F: docs/mockups/mock_f_deck_*). A
// watched room (`deck`) without a picture of its own: this file gives it its hotspots and draws the screen
// over it (the engine's "frame.screen" moment). What is open is state the solver sees, kept to one flag:
//   deck_app     the app whose window is open (glas, chat, cache, buch, konto, netz, radio, muell), or none;
//                the chat with a thread open is "chat_<contact>", a clip in the clip editor "clip_<cache id>",
//                PRÜFEN on a check "pruef_<check id>" (game/pruefen.js), the old photo full screen "photo". Entering the flat closes it (its enter
//                script), so the deck is fresh each time Juno sits down; between the deck and a camera it stays.
//   read_<id>    a contact's messages have been read (only where it matters: a contact's `unread` says when
//                its dot shows, by default until read_<id>)
// One window at a time (style guide §8). The deck's content (contacts, threads, replies) comes from the
// chapters (game/prolog.js) into Nagiwa.contacts / threads / replies; Nagiwa.buildDeck() makes the room
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
  const t = Nagiwa.t, S = () => Cutaway.state;
  /** NETZ's bookmarks (game/netz.js) */
  const NETZ_TABS = ["START", "NAGI·WA", "BRETT", "ARCHIV", "SUCHE"];
  /** the NETZ page drawn last: a new one begins at its top */
  let netzShown = "";
  const hud = () => Cutaway.font.get("hud"), main = () => Cutaway.ui.font();

  // ---------------------------------------------------------------- the layout (mockup F)
  const APPS = ["glas", "chat", "cache", "buch", "konto", "netz", "radio", "muell"];
  const LABEL = { glas: "GLASS", chat: "CHAT", cache: "CACHE", buch: "BUCH", konto: "KONTO", netz: "NETZ", radio: "RADIO", muell: "MÜLL" };
  const D = Nagiwa.deckUI = {
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
    radio: { y: 24, row: 15 },
    netz: { tabs: 24, tab: 37, title: 38, rows: 50, row: 13, back: 270, search: [34, 14, 114] },   // NETZ: the bookmarks, a page's title, its rows (a link each), SUCHE's buttons [y, row, column]                                // RADIO's stations, then AUS, then what the presenter says
    clip: { pic: [82, 23, 96, 56], meta: 185, line: [84, 90, 224], tools: 137, anon: [48, 60], check: [112, 32], montage: [148, 44] },   // the clip editor: picture, who/where, timeline, tools (ANONYMISIEREN, PRÜFEN, MONTIEREN: [after SCHNEIDEN, wide])
    map: [82, 22, 228, 124],                                  // GLASS's map inside the window
    camBox: 54,                                               // a camera's place on it, as wide as its longest line ("CODE BEKANNT"): keep the cameras this far apart
  };
  // the MÜLL's files: Juno's own names, so a translation renames them
  const MUELL = Cutaway.i18n.declare("deck", ["NAGIWA_PERSONAL_KUENDIGUNG.MSG", "AN_TEO_ENTWURF_3.TXT", "AN_TEO_ENTWURF_7.TXT"]);
  Cutaway.i18n.declare("deck", [...Object.values(LABEL), "DECK // J.REYES", "{time}  {date}", "{chits} CHITS", "WARTEN", "ZURÜCK",
    "KONTAKTE", "KEIN ZUGANG", "KEIN SIGNAL", "CODE BEKANNT", "VERBUNDEN", "NETZKARTE // LOWER NINTH", "CLIP", "NOTIZ", "FOTO", "GELESEN", "online",
    "abwesend", "schläft", "Werbung", "KASSENBUCH", "+{chits}", "KONTOSTAND", "MIETE", "{n} CHITS, FÄLLIG IN 3 TAGEN", "{n} CHITS, FÄLLIG IN 2 TAGEN", "{n} CHITS, FÄLLIG MORGEN", "{n} CHITS, FÄLLIG HEUTE", "{n} CHITS, BEZAHLT", "{n} CHITS, BEZAHLT VON TEO", "DAVON HÜLLENABGABE {n}",
    "BAO", "ANGESCHRIEBEN", "STEUER_2089_NICHT_ÖFFNEN.TXT", "ESSEN!!.TXT", "Noch nichts.", "…",
    "CACHE // {name}", "WO", "WANN", "LÄNGE", "WER", "{cam} // {place}", "{min} MIN", "SCHNEIDEN", "ANONYMISIEREN", "PRÜFEN", "MONTIEREN",
    "SCHNITT {s} S", "GESCHNITTEN", "KAP. {n}", "ANONYMISIERT", "MONTIERT", "NIEMAND", "SCHLEIFE", "GLASSER-BRETT"]);

  // what is open is a view, not game state: the solver opens whatever window a move needs (engine state.view)
  Cutaway.state.view("deck_app");

  // the deck's registries, filled by the chapters
  /** @type {Record<string, {name: string, color: string, status: string, if?: any, unread?: any, open?: any[]}>} */
  Nagiwa.contacts = {};
  /** @type {Record<string, {from: string, text?: string, photo?: string, clip?: string, at?: string, if?: any}[]>} */
  Nagiwa.threads = {};
  /** @type {Record<string, {id: string, text: string, if?: any, use: any[]}[]>} */
  Nagiwa.replies = {};
  /** The clip editor's clips (docs/kapitel0-design.md §2.4), by cache id: the camera, the minutes it runs
   * (22:31 is 31), its moments and who is in it, what a cut keeps and makes (a new cache entry), the script
   * after the cut. A clip from another hour gives it (`hour`, 22 by default); one Juno filmed herself has no camera, only a place
   * (`where`). Anonymising (from Chapter 1, while `anon.if` holds) blurs every face for good: the flag `anon_<cache id>`. Montage (Chapter 2,
   * kapitel0-design §2.4: a fake Juno makes herself) lays an empty stretch of the same night over a moment (`montage.moment`): the flag
   * `mont_<cache id>`, nobody in it any more; or another day's stretch of the same person (`shows` names it on the timeline, `keeps`: he stays in it). PRÜFEN (Chapter 2)
   * lays the clip beside another: `check` names the check it opens (Nagiwa.checks, game/pruefen.js). A clip without a picture of its own
   * (`thumb`) may draw one (`picture`).
   * @type {Record<string, {cam?: string, where?: string, hour?: number, from: number, to: number, thumb?: string, moments: [number, number, string][],
   *   people: [string, number, number][], cut?: {moment: number, drop?: boolean, gives: string, if?: any, then?: any[]}, anon?: {if?: any, then?: any[]}, montage?: {moment: number, shows?: string, keeps?: boolean, if?: any, then?: any[]}, check?: string,
   *   picture?: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void}>} */
  Nagiwa.clips = {};
  /** what other files add to the deck's hotspots once everything is loaded (PRÜFEN, game/pruefen.js) @type {((hs: Record<string, any>) => void)[]} */
  Nagiwa.deckParts = [];
  /** NETZ, Nagi·wa-Net's start page (kapitel0-design §2.1): headlines, small news, the Glasser board, ads, each in its row (`slot`, 0 to 7;
   * entries of the same evening in rows of their own) while its `if` holds, one that opens a page naming it (`page`, game/netz.js)
   * (the chapters fill it; texts German, labels the city's English)
   * @type {{kind: "head" | "sub" | "ad" | "board" | "live", text?: string, label?: string, by?: string, if?: any, slot?: number, page?: string}[]} */
  Nagiwa.netz = [];
  /** what is said when an app opens (EVI reading the news to Juno): by app, a script
   * @type {Record<string, any[]>} */
  Nagiwa.appOpen = {};
  /** the old photo (art/ui/deck_wallpaper.px.js): what Juno says looking at it, its music (a click shows it whole) */
  Nagiwa.photo = { music: { theme: "memory", fade: 2 }, back: { theme: "juno", intensity: 0.4, speaker: 1, fade: 2 }, look: /** @type {any} */ (null) };

  const inRect = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number[]} */ [rx, ry, rw, rh]) => x >= rx && y >= ry && x < rx + rw && y < ry + rh;

  // ---------------------------------------------------------------- the room
  Nagiwa.buildDeck = function () {
    const [X, Y, WW, HH] = D.win;
    /** @type {Record<string, any>} */
    const hs = {};
    const app = (/** @type {string} */ a) => `deck_app=${a}`;
    APPS.forEach((a, i) => {
      const [x, y] = D.icon(i);
      hs[`app_${a}`] = { name: LABEL[a], rect: [x - 3, y - 2, 30, 34], use: [{ set: "deck_app", value: a }, { sfx: "type" }, ...(Nagiwa.appOpen[a] ?? [])],
        look: `${LABEL[a]}.` };
    });
    hs.win_close = { name: "Schließen", rect: D.close, if: "deck_app", z: 6, use: [{ unset: "deck_app" }, { sfx: "type" }] };
    hs.wait = { name: "Warten", rect: D.buttons.wait, z: 6, use: [{ forward: true }] };
    hs.close = { name: "Zurück", rect: D.buttons.back, z: 6, exit: { to: "flat", at: Nagiwa.at.flat.deck, face: "ne" } };
    const anyChat = { or: ["deck_app=chat", ...Object.keys(Nagiwa.contacts).map((id) => `deck_app=chat_${id}`)] };
    // GLASS: the cameras on the map
    for (const [id, cam] of Object.entries(Nagiwa.cams)) {
      const [mx, my] = cam.map, x = D.map[0] + mx, y = D.map[1] + my;
      hs[`cam_${id}`] = {
        name: `CAM ${cam.id}`, rect: [x - 4, y - 4, D.camBox, 18], if: [app("glas"), ...(cam.if ? [cam.if] : [])], z: 4,
        look: `CAM ${cam.id}, ${cam.place}.`,
        use: [{ if: `link_${id}`, then: [{ goto: id }],
          else: [{ if: `code_${id}`, then: [{ set: `link_${id}` }, { sfx: "link" }, ...(/** @type {any} */ (cam).linked ?? ["Ich geb den Wartungscode ein. Sie ist verbunden."])],
            else: /** @type {any} */ (cam).tryIt ?? ["Kein Zugang. Ich brauch den Wartungscode der Kamera."] }] }],
      };
      // a camera that has gone (`dead`, a condition: game/kapitel2_quiet.js): grey on the map, KEIN SIGNAL, and only what Juno says
      const dead = /** @type {any} */ (cam).dead;
      if (dead) hs[`cam_${id}`].use = [{ if: dead, then: /** @type {any} */ (cam).deadLine ?? ["Kein Signal."], else: hs[`cam_${id}`].use }];
    }
    // CHAT: the contacts (those that appear later come last, so the rows stay put), the replies
    Object.entries(Nagiwa.contacts).forEach(([id, c], i) => {
      hs[`contact_${id}`] = { name: c.name, rect: [D.contacts.x, D.contacts.y - 3 + i * D.contacts.row, D.contacts.w, D.contacts.row - 1],
        if: [anyChat, ...(c.if ? [c.if] : [])], z: 4, use: [{ set: "deck_app", value: `chat_${id}` }, ...(c.unread ? [] : [{ set: `read_${id}` }]), ...(/** @type {any} */ (c).open ?? [])] };
    });
    for (const [who, list] of Object.entries(Nagiwa.replies)) list.forEach((r, i) => {
      hs[`reply_${who}_${r.id}`] = { name: r.text, rect: [D.thread.x - 2, Y + HH - 14 - (list.length - 1 - i) * 11, X + WW - 4 - D.thread.x, 11],
        if: [`deck_app=chat_${who}`, ...(r.if ? [].concat(r.if) : [])], z: 5, use: [{ sfx: "mail" }, ...r.use] };
    });
    // CACHE: what Juno has; looking at an entry says what it is, opening a clip says what its entry's `open` says
    Object.entries(Nagiwa.cache).forEach(([id, c], i) => {
      hs[`cache_${id}`] = { name: c.name, rect: [X + 4, D.cache.y - 3 + i * D.cache.row, WW - 8, D.cache.row - 1], if: [app("cache"), `cache_${id}`], z: 4,
        look: c.about, use: Nagiwa.clips[id] ? [{ set: "deck_app", value: `clip_${id}` }, { sfx: "type" }, ...(c.open ?? [])] : c.about };
    });
    // the clip editor: cutting keeps one moment and makes a new clip of it (or, with `drop`, takes that moment out)
    for (const [id, clip] of Object.entries(Nagiwa.clips)) {
      if (!clip.cut) continue;
      hs[`clip_cut_${id}`] = { name: "Schneiden", rect: [X + 8, D.clip.tools, 44, 10], z: 5, if: [`deck_app=clip_${id}`, `!cache_${clip.cut.gives}`, ...(clip.cut.if ? [clip.cut.if] : [])],
        use: [{ sfx: "glitch" }, { cache: clip.cut.gives }, ...(clip.cut.then ?? [])] };
    }
    // anonymising: every face blurred, in Juno's copy for good (the button stands after SCHNEIDEN, as the editor draws it)
    for (const [id, clip] of Object.entries(Nagiwa.clips)) {
      if (!clip.anon) continue;
      hs[`clip_anon_${id}`] = { name: "Anonymisieren", rect: [X + 8 + D.clip.anon[0], D.clip.tools, D.clip.anon[1], 10], z: 5,
        if: [`deck_app=clip_${id}`, `!anon_${id}`, ...(clip.anon.if ? [].concat(clip.anon.if) : [])],
        use: [{ sfx: "glitch" }, { set: `anon_${id}` }, ...(clip.anon.then ?? [])] };
    }
    // montage: an empty stretch laid over the moment, in Juno's copy for good (its button after PRÜFEN)
    for (const [id, clip] of Object.entries(Nagiwa.clips)) {
      if (!clip.montage) continue;
      hs[`clip_montage_${id}`] = { name: "Montieren", rect: [X + 8 + D.clip.montage[0], D.clip.tools, D.clip.montage[1], 10], z: 5,
        if: [`deck_app=clip_${id}`, `!mont_${id}`, ...(clip.montage.if ? [].concat(clip.montage.if) : [])],
        use: [{ sfx: "glitch" }, { set: `mont_${id}` }, ...(clip.montage.then ?? [])] };
    }
    // PRÜFEN: the check the clip opens, while it is awake (game/pruefen.js adds the check's own hotspots: Nagiwa.deckParts)
    for (const [id, clip] of Object.entries(Nagiwa.clips)) {
      if (!clip.check) continue;
      hs[`clip_check_${id}`] = { name: "Prüfen", rect: [X + 8 + D.clip.check[0], D.clip.tools, D.clip.check[1], 10], z: 5,
        if: [`deck_app=clip_${id}`, ...Nagiwa.checkAwake(clip.check)],
        use: [{ set: "deck_app", value: `pruef_${clip.check}` }, { set: "pruef_from", value: id }, { sfx: "type" }] };
    }
    for (const add of Nagiwa.deckParts) add(hs);
    // the old photo: a click on the wallpaper shows it whole, with its music; a click anywhere closes it
    hs.photo = { name: "Das alte Foto", rect: [80, 14, 206, 104], if: "!deck_app", z: 1,
      look: Nagiwa.photo.look ?? "Das ist das Foto von Teo und mir.",
      use: [{ set: "deck_app", value: "photo" }, { music: Nagiwa.photo.music }] };
    hs.photo_close = { name: "Zurück", rect: [0, 0, W, H], if: "deck_app=photo", z: 9,
      use: [{ unset: "deck_app" }, { radio_resume: Nagiwa.photo.back }] };
    // NETZ (game/netz.js): the bookmarks, ZURÜCK, the start page's entries that open a page, a list's rows, SUCHE's terms and what they find;
    // only views change (netz_page), each link a hotspot in its fixed row
    const N = D.netz, open = (/** @type {string | null} */ page, /** @type {string} */ from = "") => [page ? { set: "netz_page", value: page } : { unset: "netz_page" },
      from ? { set: "netz_from", value: from } : { unset: "netz_from" }, { sfx: "type" }];
    const row = (/** @type {number} */ i) => [X + 6, N.rows - 3 + i * N.row, WW - 12, N.row - 1];
    ["start", "nagiwa", "brett", "archiv", "suche"].forEach((tab, i) => {
      hs[`netz_tab_${tab}`] = { name: NETZ_TABS[i], rect: [X + 6 + i * N.tab, N.tabs - 2, N.tab - 2, 11], if: app("netz"), z: 4, use: open(tab === "start" ? null : tab) };
    });
    for (const [id, pg] of Object.entries(Nagiwa.netzPages ?? {})) if (pg.up) {
      hs[`netz_back_${id}`] = { name: "Zurück", rect: [N.back, N.tabs - 2, X + WW - 4 - N.back, 11], if: [app("netz"), `netz_page=${id}`], z: 4, use: [{ netz_back: true }] };
    }
    Nagiwa.netz.forEach((n, k) => {
      if (n.page && n.slot !== undefined) hs[`netz_start_${k}`] = { name: n.text ?? n.label ?? n.page, rect: row(n.slot), if: [app("netz"), "!netz_page", ...(n.if ? [n.if] : [])], z: 4, use: open(n.page, "start") };
    });
    for (const [id, pg] of Object.entries(Nagiwa.netzPages ?? {})) (pg.rows ?? []).forEach((r, i) => {
      hs[`netz_row_${id}_${i}`] = { name: Nagiwa.netzPages[r.page]?.label ?? r.page, rect: row(i), if: [app("netz"), `netz_page=${id}`, ...(r.if ? [r.if] : [])], z: 4, use: open(r.page) };
    });
    (Nagiwa.netzSearch ?? []).forEach((q, i) => {
      const [sy, sr, sw] = N.search;
      hs[`netz_term_${i}`] = { name: q.term, rect: [X + 6 + (i % 2) * sw, Y + sy + Math.floor(i / 2) * sr, sw - 2, sr - 2], if: [app("netz"), "netz_page=suche", ...(q.if ? [q.if] : [])], z: 4, use: open(`such_${i}`) };
      hs[`netz_back_such_${i}`] = { name: "Zurück", rect: [N.back, N.tabs - 2, X + WW - 4 - N.back, 11], if: [app("netz"), `netz_page=such_${i}`], z: 4, use: [{ netz_back: true }] };
      q.hits.forEach((h, k) => {
        hs[`netz_hit_${i}_${k}`] = { name: Nagiwa.netzPages[h.page]?.label ?? h.page, rect: row(k), if: [app("netz"), `netz_page=such_${i}`, ...(h.if ? [h.if] : [])], z: 4, use: open(h.page, `such_${i}`) };
      });
    });
    // RADIO: a station tuned in with a click (game/radio.js), AUS turns it off
    // (a station not known yet is a row of noise: no hotspot)
    [...(Nagiwa.radio ?? []), { id: "", name: "Radio aus" }].forEach((st, i) => {
      hs[`radio_${st.id || "off"}`] = { name: st.name, rect: [X + 6, D.radio.y - 3 + i * D.radio.row, WW - 12, D.radio.row - 1], if: [app("radio"), ...(/** @type {any} */ (st).if ? [/** @type {any} */ (st).if] : [])], z: 4,
        use: [{ radio: st.id || false }] };
    });
    // the files on the desktop (under the window when one is open)
    hs.file_steuer = { name: "steuer_2089_NICHT_ÖFFNEN.txt", rect: D.files.steuer, if: "!deck_app",
      look: "Die Steuer von 2089. Solange ich sie nicht öffne, gibt es sie nicht.", use: "Nein." };
    hs.file_essen = { name: "ESSEN!!.txt", rect: D.files.essen, if: "!deck_app",
      look: "Die Datei heißt ESSEN!!, und ich hab sie mir selbst geschickt.", use: "Sie ist leer. Wie der Kühlschrank, vermutlich." };
    // EVI: on the deck she is the hint button
    hs.evi = { name: "EVI", rect: D.evi, z: 6, use: [{ hint: true }],
      look: "EVI. Sie wohnt auf meinem Deck und liest Kameras besser als Menschen." };

    Cutaway.room("deck", { name: "Deck", color: C.night, observe: true, deck: true, buttons: false, hotspots: hs, enter: Nagiwa.deckEnter ?? [],
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
  const fresh = (id) => { const c = Nagiwa.contacts[id]; return S().test(c.if) && (c.unread ? S().test(c.unread) : !S().flag(`read_${id}`) && (Nagiwa.threads[id] ?? []).some((m) => S().test(m.if))); };
  const unread = () => Object.keys(Nagiwa.contacts).filter(fresh).length;
  /** the open app and, in the chat, whose thread */
  const opened = () => {
    const v = String(S().flag("deck_app") ?? "");
    if (v.startsWith("chat")) return { app: "chat", with: v.slice(5), clip: "" };
    if (v.startsWith("clip_")) return { app: "cache", with: "", clip: v.slice(5) };
    if (v.startsWith("pruef_")) return { app: "cache", with: "", clip: "", check: v.slice(6) };
    return { app: v, with: "", clip: "" };
  };

  // ---------------------------------------------------------------- the header
  function header(/** @type {CanvasRenderingContext2D} */ ctx) {
    rect(ctx, C.steel1, 0, 0, W, D.header); rect(ctx, C.steel3, 0, D.header - 1, W, 1); rect(ctx, C.cyanDark, 0, D.header - 1, 40, 1);
    small(ctx, t("DECK // J.REYES"), 4, 3, C.cyan);
    const p = pointer();
    button(ctx, D.buttons.back, "ZURÜCK", inRect(p.x, p.y, D.buttons.back));
    button(ctx, D.buttons.wait, "WARTEN", inRect(p.x, p.y, D.buttons.wait));
    const [date, time] = Nagiwa.stamp().split(" ");
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
      const news = (a === "chat" && unread() > 0) || (a === "glas" && Object.keys(Nagiwa.cams).some((c) => S().flag(`code_${c}`) && !S().flag(`link_${c}`) && S().test(Nagiwa.cams[c].if)));
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
  const list = () => ({ y: 0, to: 0, max: 0, /** @type {number[] | null} */ up: null, /** @type {number[] | null} */ down: null, /** @type {Record<string, number>} */ side: {} });
  const scroll = { contacts: list(), thread: list(), cache: list(), buch: list(), netz: list(), with: "" };
  const STEP = 22;
  const by = (/** @type {ReturnType<typeof list>} */ l, /** @type {number} */ d, snap = false) => { l.to = Math.max(0, Math.min(l.max, l.to + d)); if (snap) l.y = l.to; };
  /** the open window's lists: each with the way a move down the screen goes in it, and how far right it reaches */
  const openLists = () => {
    const v = String(S().flag("deck_app") ?? "");
    if (!Cutaway.scene.room?.deck || Cutaway.menu.isOpen) return [];
    if (v.startsWith("chat")) return [{ l: scroll.contacts, dir: 1, x1: D.contacts.x + D.contacts.w + 1 }, { l: scroll.thread, dir: -1, x1: 999 }];
    return v === "cache" || v === "buch" || v === "netz" ? [{ l: scroll[v], dir: 1, x1: 999 }] : [];
  };
  const listAt = (/** @type {number} */ x) => openLists().find((o) => x <= o.x1);
  /** a row of a list: its hotspot is what shows of it, none if it is scrolled away (then `side` says which way it lies) */
  function placeRow(/** @type {ReturnType<typeof list>} */ l, /** @type {string} */ hs, /** @type {number} */ x, /** @type {number} */ w, /** @type {number} */ y, /** @type {number} */ h, /** @type {number} */ top, /** @type {number} */ bottom) {
    const y0 = Math.max(y, top), y1 = Math.min(y + h, bottom), r = y1 > y0 ? [x, y0, w, y1 - y0] : [0, 0, 0, 0], spot = Cutaway.room.get("deck")?.hotspots[hs];
    l.side[hs] = y1 > y0 ? 0 : y < top ? -1 : 1;
    if (spot) spot.rect = r;
    return r;
  }
  const [UP, DOWN] = Cutaway.i18n.declare("deck", ["Nach oben", "Nach unten"]);
  Cutaway.ui.addLayer({
    z: 20,
    click(/** @type {{x: number, y: number}} */ p) {
      for (const { l, dir } of openLists()) {
        for (const [r, d] of /** @type {[number[] | null, number][]} */ ([[l.up, -1], [l.down, 1]])) {
          if (r && inRect(p.x, p.y, r)) { by(l, d * dir * STEP); Cutaway.events.emit("sfx", { sfx: "type" }); return true; }
        }
      }
      return false;
    },
    hover(/** @type {number} */ x, /** @type {number} */ y) {
      for (const { l } of openLists()) { if (l.up && inRect(x, y, l.up)) return Cutaway.i18n.t(UP); if (l.down && inRect(x, y, l.down)) return Cutaway.i18n.t(DOWN); }
      return undefined;     // only the arrows are this layer's: null would say "over the layer" everywhere, and nothing under it would ever be hot
    },
    // the arrows for the marks and a controller's pointer (engine: layer targets)
    targets() {
      return openLists().flatMap(({ l }) => /** @type {[number[] | null, string][]} */ ([[l.up, UP], [l.down, DOWN]]).flatMap(([r, name]) => (r ? [{ x: r[0], y: r[1], w: r[2], h: r[3], name: Cutaway.i18n.t(name) }] : [])));
    },
    // a row scrolled away: the arrow towards it (the tools click it, as a player would)
    reveal(/** @type {string} */ id) {
      for (const { l } of openLists()) { const r = l.side[id] < 0 ? l.up : l.side[id] > 0 ? l.down : null; if (r) return { x: r[0] + 5, y: r[1] + 4 }; }
      return null;
    },
    update() { for (const l of [scroll.contacts, scroll.thread, scroll.cache, scroll.buch, scroll.netz]) { l.y += (l.to - l.y) * 0.25; if (Math.abs(l.to - l.y) < 0.5) l.y = l.to; } },
  });
  Cutaway.events.on("pointer.wheel", (/** @type {{x: number, dy: number}} */ e) => { const o = listAt(e.x); if (o) by(o.l, o.dir * e.dy / 4); });
  // a finger pulls the list with it (only where there is something to pull: else a shaky tap should stay a tap)
  Cutaway.events.on("pointer.drag", (/** @type {{from: {x: number}, dy: number, claim: () => void}} */ e) => {
    const o = listAt(e.from.x);
    if (o && o.l.max > 0) { e.claim(); by(o.l, -o.dir * e.dy, true); }
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
      for (const [id, cam] of Object.entries(Nagiwa.cams)) {
        if (!S().test(cam.if)) continue;
        const x = mx + cam.map[0], y = my + cam.map[1], linked = !!S().flag(`link_${id}`), code = !!S().flag(`code_${id}`);
        const hot = inRect(pointer().x, pointer().y, [x - 4, y - 4, D.camBox, 18]);
        if (/** @type {any} */ (cam).dead && S().test(/** @type {any} */ (cam).dead)) {      // gone: grey, its label dim
          rect(ctx, C.steel3, x - 2, y - 2, 5, 5); ctx.fillStyle = C.steel5; ctx.fillRect(x - 1, y, 3, 1);
          if (hot) { ctx.fillStyle = C.steel6; ctx.fillRect(x - 4, y - 4, 2, 1); ctx.fillRect(x - 4, y - 4, 1, 2); ctx.fillRect(x + 3, y + 4, 2, 1); ctx.fillRect(x + 4, y + 3, 1, 2); }
          small(ctx, t("CAM {id}", { id: cam.id }), x + 6, y - 2, C.steel5);
          small(ctx, t("KEIN SIGNAL"), x + 6, y + 5, C.steel5);
          continue;
        }
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
      const listTop = K.y - 3, listBottom = Y + HH - 4, known = Object.entries(Nagiwa.contacts).filter(([, c]) => S().test(c.if)), C1 = scroll.contacts;
      C1.max = Math.max(0, known.length * K.row - 1 - (listBottom - listTop)); C1.to = Math.min(C1.to, C1.max);
      ctx.save(); ctx.beginPath(); ctx.rect(K.x, listTop, K.w, listBottom - listTop); ctx.clip();
      known.forEach(([id, c], i) => {
        const y = K.y + i * K.row - Math.round(C1.y), on = id === with_, y0 = Math.max(y - 3, listTop), y1 = Math.min(y - 3 + K.row - 1, listBottom);
        placeRow(C1, `contact_${id}`, K.x, K.w, y - 3, K.row - 1, listTop, listBottom);
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
      const who = Nagiwa.contacts[with_];
      if (!who) return;
      small(ctx, t(who.name), tx, Y + 7, C.cyanPale);
      small(ctx, t(who.status), X + WW - 22, Y + 7, C.cyan, "right");
      rect(ctx, C.steel3, tx, Y + 14, tw, 1);
      // Juno's replies at the bottom (each a hotspot), the thread above them, its newest messages last
      const replies = (Nagiwa.replies[with_] ?? []).map((r, i) => ({ r, i, list: Nagiwa.replies[with_] })).filter(({ r }) => S().test(r.if));
      let bottom = Y + HH - 4;
      if (replies.length) {
        const list = Nagiwa.replies[with_], top = Y + HH - 14 - (list.length - 1) * 11;
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
      const msgs = (Nagiwa.threads[with_] ?? []).filter((m) => S().test(m.if)), mw = tw - 12;
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
    /** CACHE: clips and notes, with what they are; those she has, close together, scrolling when they run over */
    cache(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y, WW, HH] = D.win, p = pointer(), top = D.cache.y - 3, bottom = Y + HH - 4, R = D.cache.row, L = scroll.cache;
      const own = Object.entries(Nagiwa.cache).filter(([id]) => S().flag(`cache_${id}`));
      if (!own.length) text(ctx, t("Noch nichts."), X + 8, D.cache.y, C.steel6);
      L.max = Math.max(0, own.length * R - 1 - (bottom - top)); L.to = Math.min(L.to, L.max);
      const rw = WW - 22;
      ctx.save(); ctx.beginPath(); ctx.rect(X + 4, top, rw, bottom - top); ctx.clip();
      own.forEach(([id, c], i) => {
        const y = D.cache.y + i * R - Math.round(L.y), r = placeRow(L, `cache_${id}`, X + 4, rw, y - 3, R - 1, top, bottom), hot = r[2] > 0 && inRect(p.x, p.y, r);
        if (hot) { rect(ctx, C.cyanDeep, X + 4, y - 3, rw, R - 1); rect(ctx, C.cyan, X + 4, y - 3, 1, R - 1); }
        if (c.kind === "clip") { rect(ctx, C.steel1, X + 8, y, 14, 12); rect(ctx, "#266252", X + 10, y + 2, 10, 8); ctx.fillStyle = C.steel4; for (let q = 0; q < 14; q += 3) { ctx.fillRect(X + 8 + q, y, 1, 1); ctx.fillRect(X + 8 + q, y + 11, 1, 1); } }
        else { rect(ctx, C.steel6, X + 9, y, 12, 12); rect(ctx, C.cyanPale, X + 9, y, 12, 1); rect(ctx, C.steel4, X + 11, y + 4, 8, 1); rect(ctx, C.steel4, X + 11, y + 7, 6, 1); }
        small(ctx, t(c.kind === "clip" ? "CLIP" : "NOTIZ"), X + 26, y, c.kind === "clip" ? C.cyan : C.steel6);
        small(ctx, fit(t(c.name), WW - 74, hud()), X + 50, y, C.cyanPale);
        text(ctx, fit(t(c.about), WW - 50), X + 26, y + 8, C.steel6);
      });
      ctx.restore();
      scrollBar(ctx, L, X + WW - 15, top, bottom, false, p);
    },
    /** BUCH: the Kassenbuch, every delivery and what it paid */
    buch(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y, WW, HH] = D.win, top = D.buch.y, bottom = Y + HH - 4, R = D.buch.row, L = scroll.buch;
      small(ctx, t("KASSENBUCH"), X + 8, D.buch.y - 8, C.steel6);
      const done = Object.entries(Nagiwa.ledger).filter(([k]) => S().flag(`ledger_${k}`));
      if (!done.length) text(ctx, t("Noch nichts."), X + 8, D.buch.y + 2, C.steel6);
      L.max = Math.max(0, done.length * R + 2 - (bottom - top)); L.to = Math.min(L.to, L.max);
      ctx.save(); ctx.beginPath(); ctx.rect(X + 4, top, WW - 20, bottom - top); ctx.clip();
      done.forEach(([k, e], i) => {
        const v = String(S().flag(`ledger_${k}`)), pay = e.chits?.[v] ?? 0, y = D.buch.y + 2 + i * R - Math.round(L.y);
        text(ctx, fit(t("{to}: {what}", { to: t(e.to), what: t(e.what[v] ?? v) }), WW - 70), X + 8, y, C.amber);
        if (pay) small(ctx, t("+{chits}", { chits: pay }), X + WW - 20, y + 1, C.amber, "right");
      });
      ctx.restore();
      scrollBar(ctx, L, X + WW - 15, top, bottom, false, pointer());
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
    /** NETZ (game/netz.js): the bookmarks, then the page open: the evening's start page, a list, an article or a thread (their text scrolls), SUCHE */
    netz(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y0, WW, HH] = D.win, N = D.netz, p = pointer(), id = /** @type {string | undefined} */ (S().flag("netz_page")) || "start";
      const pages = Nagiwa.netzPages ?? {}, search = Nagiwa.netzSearch ?? [], sm = /^such_(\d+)$/.exec(id), q = sm ? search[Number(sm[1])] : null, pg = pages[id];
      // the bookmarks; ZURÜCK on a page under one
      const tabOf = id === "start" ? "start" : sm || id === "suche" ? "suche" : pg?.rows ? id : (pg?.up ?? "start");
      ["start", "nagiwa", "brett", "archiv", "suche"].forEach((tab, i) => {
        const x = X + 6 + i * N.tab, on = tab === tabOf, hot = inRect(p.x, p.y, [x, N.tabs - 2, N.tab - 2, 11]);
        rect(ctx, on ? C.cyanDeep : hot ? C.steel3 : C.steel2, x, N.tabs - 2, N.tab - 2, 11);
        small(ctx, t(NETZ_TABS[i]), x + (N.tab - 2) / 2, N.tabs, on ? C.cyanPale : C.steel6, "center");
      });
      if (pg?.up || sm) small(ctx, `< ${t("ZURÜCK")}`, X + WW - 9, N.tabs, inRect(p.x, p.y, [N.back, N.tabs - 2, X + WW - 4 - N.back, 11]) ? C.cyanPale : C.cyan, "right");
      /** a row: a label, a text cut to fit, lit under the pointer @param {number} i @param {string} label @param {string} line @param {string} lc @param {boolean} link */
      const listRow = (i, label, line, lc, link) => {
        const y = N.rows + i * N.row, hot = link && inRect(p.x, p.y, [X + 6, y - 3, WW - 12, N.row - 1]);
        if (hot) rect(ctx, C.steel3, X + 6, y - 3, WW - 12, N.row - 1);
        if (label) small(ctx, label, X + 10, y, lc);
        text(ctx, fit(line, WW - (label ? 70 : 24)), X + (label ? 60 : 12), y - 2, link ? C.cyanPale : C.steel6);
      };
      if (id === "start") {
        small(ctx, `NAGI·WA.NET // ${Nagiwa.stamp().slice(0, 10)}`, X + 8, N.title, C.cyanPale);
        for (const n of Nagiwa.netz.filter((n) => n.slot !== undefined && S().test(n.if))) {
          const label = n.kind === "head" ? t("HEUTE") : n.kind === "sub" ? t("MELDUNG") : n.kind === "board" ? t("BRETT") : n.kind === "ad" ? t("ANZEIGE") : t("LIVE");
          const lc = n.kind === "ad" ? C.magenta : n.kind === "board" ? C.amber : n.kind === "live" ? C.amber : C.cyan;
          listRow(n.slot ?? 0, label, t(n.text ?? n.label ?? ""), lc, !!n.page);
        }
        return;
      }
      if (id === "suche" || q) {
        small(ctx, q ? t("TREFFER FÜR „{term}“", { term: t(q.term) }) : t("Wonach suchen Sie?"), X + 8, N.title, C.cyanPale);
        if (q) {
          const hits = q.hits.filter((h) => S().test(h.if));
          hits.forEach((h) => listRow(q.hits.indexOf(h), "", t(pages[h.page]?.label ?? h.page), C.cyan, true));
          if (!hits.length) text(ctx, t(q.none ?? "Keine Treffer."), X + 12, N.rows - 2, C.steel6);
          return;
        }
        const [sy, sr, sw] = N.search;
        search.forEach((s2, i) => {
          if (!S().test(s2.if)) return;
          const x = X + 6 + (i % 2) * sw, y = Y0 + sy + Math.floor(i / 2) * sr, hot = inRect(p.x, p.y, [x, y, sw - 2, sr - 2]);
          rect(ctx, hot ? C.cyanDeep : C.steel2, x, y, sw - 2, sr - 2);
          text(ctx, fit(t(s2.term), sw - 10), x + 4, y + 1, hot ? C.cyanPale : C.cyan);
        });
        return;
      }
      if (!pg) return;
      small(ctx, t(pg.title), X + 8, N.title, C.cyanPale);
      if (pg.rows) { pg.rows.forEach((r, i) => { if (S().test(r.if)) listRow(i, "", t(pages[r.page]?.label ?? r.page), C.cyan, true); }); return; }
      // an article or a thread: its text scrolls under the title
      const top = N.rows - 4, bottom = Y0 + HH - 4, L = scroll.netz, tw = WW - 30;
      if (netzShown !== id) { netzShown = id; L.y = L.to = 0; }
      ctx.save(); ctx.beginPath(); ctx.rect(X + 4, top, WW - 8, bottom - top); ctx.clip();
      let y = top + 2 - Math.round(L.y);
      if (pg.text) {
        for (const para of pg.text) { const ls = wrap(t(para), tw); ls.forEach((l, i) => text(ctx, l, X + 10, y + i * 10, C.cyanPale)); y += ls.length * 10 + 5; }
        if (pg.by) { small(ctx, t(pg.by), X + WW - 20, y, C.steel6, "right"); y += 10; }
      }
      for (const post of (pg.posts ?? []).filter((q2) => S().test(q2.if))) {
        small(ctx, t(post.by), X + 10, y, C.amber); y += 8;
        const ls = wrap(t(post.text), tw - 4); ls.forEach((l, i) => text(ctx, l, X + 12, y + i * 10, C.cyanPale)); y += ls.length * 10 + 5;
      }
      ctx.restore();
      L.max = Math.max(0, y + Math.round(L.y) - bottom); L.to = Math.min(L.to, L.max);
      scrollBar(ctx, L, X + WW - 15, top, bottom, false, pointer());
    },
    /** RADIO: the stations (game/radio.js; Lantern's pirate station once Juno has found him, until then a row of noise), the one on lit;
     * under them what its presenter says */
    radio(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, , WW, HH] = D.win, on = Nagiwa.radioOn?.() ?? null, p = pointer(), R = D.radio;
      [...(Nagiwa.radio ?? []), null].forEach((st, i) => {
        const y = R.y + i * R.row, hot = inRect(p.x, p.y, [X + 6, y - 3, WW - 12, R.row - 1]), lit = st ? st === on : !on;
        if (lit || hot) rect(ctx, lit ? C.cyanDeep : C.steel2, X + 6, y - 3, WW - 12, R.row - 1);
        if (lit) rect(ctx, C.cyan, X + 6, y - 3, 2, R.row - 1);
        if (st && !Nagiwa.radioKnown(st)) { small(ctx, "--.-", X + 12, y + 2, C.steel3); small(ctx, t("RAUSCHEN"), X + 40, y + 2, C.steel3); }
        else if (st) { small(ctx, st.freq, X + 12, y + 2, lit ? C.cyanPale : C.steel6); small(ctx, st.name, X + 40, y + 2, lit ? C.cyanPale : C.steel6); }
        else small(ctx, t("AUS"), X + 12, y + 2, lit ? C.cyanPale : C.steel6);
      });
      if (!on) return;
      const top = R.y + ((Nagiwa.radio ?? []).length + 1) * R.row + 4, line = Nagiwa.radioLine?.() ?? "";
      rect(ctx, C.steel3, X + 6, top, WW - 12, 1);
      if (Math.floor(Cutaway.clock.time / 600) % 2) rect(ctx, C.magenta, X + 8, top + 5, 3, 3);
      small(ctx, `${t("ON AIR")} // ${on.name}`, X + 14, top + 4, C.amber);
      wrap(line, WW - 24).slice(0, Math.floor((D.win[1] + HH - top - 18) / 10)).forEach((l, i) => text(ctx, l, X + 10, top + 15 + i * 10, C.cyanPale));
    },
    /** MÜLL: what Juno threw away and never opened */
    muell(/** @type {CanvasRenderingContext2D} */ ctx) {
      const [X, Y] = D.win;
      MUELL.forEach((name, i) => small(ctx, t(name), X + 8, Y + 10 + 12 * i, C.steel6));
    },
  };

  // ---------------------------------------------------------------- EVI in her corner
  function evi(/** @type {CanvasRenderingContext2D} */ ctx) {
    const p = pointer(), hot = inRect(p.x, p.y, D.evi), E = Nagiwa.evi;
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
  /** a small canvas the clip's picture is shrunk into, for anonymising */
  const mosaic = /** @type {CanvasRenderingContext2D} */ (document.createElement("canvas").getContext("2d"));
  function editor(ctx, id) {
    const clip = Nagiwa.clips[id], [X, Y, WW, HH] = D.win, E = D.clip, p = pointer();
    if (!clip) return;
    const cam = clip.cam ? Nagiwa.cams[clip.cam] : null, cut = clip.cut && S().flag(`cache_${clip.cut.gives}`), anon = !!S().flag(`anon_${id}`);
    const anonOn = !!clip.anon && !anon && S().test(clip.anon.if);
    const mont = !!S().flag(`mont_${id}`), montOn = !!clip.montage && !mont && S().test(clip.montage.if);
    // the picture: the moment the cut keeps, in the feed's phosphor, with the implant's tags
    const [px, py, pw, ph] = E.pic;
    rect(ctx, C.ink, px - 1, py - 1, pw + 2, ph + 2);
    if (clip.thumb && Cutaway.assets.has(clip.thumb)) Cutaway.assets.draw(ctx, clip.thumb, px, py, { anchor: [0, 0], t: Cutaway.clock.time });
    else if (clip.picture) { ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip(); clip.picture(ctx, px, py, pw, ph); ctx.restore(); }
    else rect(ctx, "#12332d", px, py, pw, ph);
    if (anon) {                                                     // the picture itself as a mosaic: the scene is still there, nobody in it
      const M = 6, tiny = mosaic.canvas;
      tiny.width = Math.ceil(pw / M); tiny.height = Math.ceil(ph / M);
      mosaic.imageSmoothingEnabled = false; ctx.imageSmoothingEnabled = false;
      mosaic.drawImage(ctx.canvas, px, py, pw, ph, 0, 0, tiny.width, tiny.height);
      ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
      ctx.drawImage(tiny, 0, 0, tiny.width, tiny.height, px, py, tiny.width * M, tiny.height * M);
      ctx.restore();
      small(ctx, t("ANONYMISIERT"), px + pw / 2, py + ph - 7, "#d4f7e2", "center");
    }
    if (mont) small(ctx, t("MONTIERT"), px + pw / 2, py + ph - 7, "#d4f7e2", "center");
    small(ctx, cam ? t("CAM {id}", { id: cam.id }) : t(clip.where ?? ""), px + 2, py + 2, "#d4f7e2");
    // where, when, how long, who
    const hh = String(clip.hour ?? 22).padStart(2, "0"), mm = (/** @type {number} */ m) => `${hh}:${String(Math.floor(m)).padStart(2, "0")}`;
    const meta = [["WO", cam ? t("{cam} // {place}", { cam: t("CAM {id}", { id: cam.id }), place: t(cam.place) }) : t(clip.where ?? "")],
      ["WANN", `${mm(clip.from)}-${mm(clip.to)}`], ["LÄNGE", t("{min} MIN", { min: `${Math.floor(clip.to - clip.from)}:${String(Math.round(((clip.to - clip.from) % 1) * 60)).padStart(2, "0")}` })],
      ["WER", anon ? t("ANONYMISIERT") : mont && !clip.montage?.keeps ? t("NIEMAND") : clip.people.map(([who]) => t(Nagiwa.people[who]?.name ?? who)).join(", ")]];
    meta.forEach(([k, v], i) => { small(ctx, t(k), E.meta, py + 1 + i * 15, C.steel6); small(ctx, fit(v, X + WW - 6 - E.meta, hud()), E.meta, py + 8 + i * 15, C.cyanPale); });
    // the timeline: the minutes, the moments, who is in the picture when; the cut in brackets
    const [lx, ly, lw] = E.line, at = (/** @type {number} */ m) => Math.round(lx + (m - clip.from) / (clip.to - clip.from) * lw);
    rect(ctx, C.steel4, lx, ly + 6, lw, 1);
    for (let m = Math.ceil(clip.from); m <= clip.to; m++) { rect(ctx, C.steel5, at(m), ly + 4, 1, 3); small(ctx, mm(m), at(m), ly - 1, C.steel5, m === Math.ceil(clip.from) ? "left" : m === Math.floor(clip.to) ? "right" : "center"); }
    clip.moments.forEach(([a, b, label], i) => {
      const kept = clip.cut?.moment === i, gone = kept && clip.cut?.drop && cut;      // a moment taken out stays as a dark gap
      rect(ctx, gone ? C.steel1 : kept ? C.cyanDark : C.steel3, at(a) + 1, ly + 9, Math.max(1, at(b) - at(a) - 1), 9);
      // a moment too short for its name keeps it for the caption under the cut
      const shown = mont && clip.montage?.moment === i ? clip.montage.shows ?? "SCHLEIFE" : label;   // a montaged moment: what was laid over it
      if (!gone && hud().measure(t(shown).toUpperCase()) + 5 <= at(b) - at(a)) small(ctx, t(shown), at(a) + 3, ly + 11, kept ? C.cyanPale : C.steel6);
    });
    // the names in a column as wide as the longest, the bars after it (a long name never runs into its bar)
    const label = (/** @type {string} */ who) => (anon ? "???" : t(Nagiwa.people[who]?.name ?? who));
    const col = Math.max(34, ...clip.people.map(([who]) => hud().measure(label(who).toUpperCase()) + 4));
    if (!mont || clip.montage?.keeps) clip.people.forEach(([who, a, b], i) => {
      const y = ly + 21 + i * 8, x0 = Math.max(at(a), lx + col);
      small(ctx, label(who), lx, y, C.steel6);
      if (at(b) > x0) rect(ctx, C.steel4, x0, y + 1, at(b) - x0, 3);
    });
    if (clip.cut) {
      const [a, b, label] = clip.moments[clip.cut.moment];
      for (const m of [a, b]) { rect(ctx, C.cyan, at(m), ly + 7, 1, 31); rect(ctx, C.cyan, m === a ? at(m) : at(m) - 2, ly + 7, 3, 1); rect(ctx, C.cyan, m === a ? at(m) : at(m) - 2, ly + 37, 3, 1); }
      small(ctx, `${t(label)}: ${t(cut ? "GESCHNITTEN" : "SCHNITT {s} S", { s: Math.round((b - a) * 60) })}`, Math.round((at(a) + at(b)) / 2), ly + 40, C.cyan, "center");
      rect(ctx, C.yellow, Math.round((at(a) + at(b)) / 2), ly + 2, 1, 36);                     // the playhead: where Juno looks
    }
    // the tools: cutting from the prologue, anonymising from Chapter 1, checking and montage from Chapter 2 (montage only on a clip that
    // offers it). Each has a fixed place, as its hotspot does (the room's, D.clip.anon, .check and .montage)
    let bx = X + 8;
    const checkOn = !!clip.check && Nagiwa.checkAwake(clip.check).every((c) => S().test(c));
    const tools = /** @type {[string, boolean, number | null][]} */ ([["SCHNEIDEN", !!clip.cut && !cut && S().test(clip.cut.if), E.anon[0] - 4], ["ANONYMISIEREN", anonOn, E.anon[1]], ["PRÜFEN", checkOn, E.check[1]], ["MONTIEREN", montOn, E.montage[1]]]);
    for (const [label, on, fixed] of tools) {
      const w = fixed ?? hud().measure(t(label)) + 8, r = [bx, E.tools, w, 10], hot = on && inRect(p.x, p.y, r), dim = !on;
      chamfer(ctx, bx, E.tools, w, 10, 2, hot ? C.cyanDark : on ? C.cyanDeep : C.steel1, dim ? C.steel3 : C.cyan, dim ? C.steel4 : C.cyanPale);
      small(ctx, t(label), bx + 4, E.tools + 3, dim ? C.steel4 : C.cyanPale);
      bx += w + 4;
    }
  }

  /** the boot: a second of scrolling lines and a glitch, then EVI wakes (rubs her eyes) */
  function boot(/** @type {CanvasRenderingContext2D} */ ctx) {
    const age = Cutaway.clock.time - Nagiwa.evi.boot;
    if (Nagiwa.evi.boot < 0 || age > 1300) return false;
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
    const { app: open, clip, check } = opened();
    if (check) Nagiwa.drawCheck(ctx, check);
    else if (clip) { frame(ctx, t("CACHE // {name}", { name: t(Nagiwa.cache[clip]?.name ?? clip) })); editor(ctx, clip); }
    else if (open && /** @type {any} */ (APP_DRAW)[open]) { frame(ctx, LABEL[/** @type {keyof typeof LABEL} */ (open)]); /** @type {any} */ (APP_DRAW)[open](ctx); }
    header(ctx);
    evi(ctx);
  });

  // what game/pruefen.js draws with: the deck's look
  Nagiwa.deckDraw = { C, small, text, rect, chamfer, frame, fit, wrap, pointer, inRect, sprite };
})();
