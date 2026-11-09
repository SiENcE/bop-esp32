// Nagiwa: the karaoke machine in LUCKY STATIC, a small game of its own (the user's wish, 2026-11-09). It is OUT OF ORDER and works all
// the same once Juno hits it where Mei says: a menu of three songs, the music plays (the radio's pieces: NAGI·WA EASY for its own
// jingle, KESSEL ROOFTOP for the flood's ballad, Juno's theme as NINTH FM plays it), the words run over a screen line by line and light
// up as they are sung. At the end of each verse the last word is missing: Juno picks it from three, a rhyme or a joke, and whoever is
// at the bar answers. No timing (every pick is a dialogue choice: mouse, touch, a controller), no score, no flag: flavour, which the
// solver plays through once per state and finds nothing new in.
"use strict";

(function () {
  const M = (/** @type {string} */ text) => ({ say: "mei", text });
  const SB = (/** @type {string} */ text) => ({ say: "stamm_b", text });

  /**
   * The songs: their title, the piece and how long a line lasts (two bars of its tempo), the lines; a line with `gap` misses its
   * last word, which Juno picks (`right` the song's own, `words` in the order shown, `then` what is said after a word).
   * @type {Record<string, {title: string, music: any, ms: number, lines: {text: string, gap?: {right: string, words: string[], then?: Record<string, any[]>}}[], after: any[]}>}
   */
  const SONGS = {
    // Nagi·wa's jingle, sung in a bar; its own words say more than it means to
    sleep: { title: "SLEEP BETTER", music: { theme: "easy" }, ms: 5450, lines: [
      { text: "Mach die Augen zu, der Regen singt für dich," },
      { text: "die Stadt da draußen braucht dich nicht." },
      { text: "Vier Stunden Ruhe fühlen sich wie zehn," },
      { text: "und was du siehst, das hast du nie", gap: { right: "gesehn", words: ["bezahlt", "gesehn", "erzählt"],
        then: { bezahlt: [M("Stimmt sogar. Ist ja gratis.")], erzählt: [SB("Das reimt sich nicht, Kind.")] } } },
      { text: "Sleep better, sleep better, Nagi·wa hält die Wacht," },
      { text: "sleep better, sleep better, wir passen auf die", gap: { right: "Nacht", words: ["Nacht", "Macht", "Pacht"],
        then: { Macht: [M("Sing das nicht zu laut.")], Pacht: [SB("Die zahlt hier keiner.")] } } },
    ], after: [M("Nagi·wa würde dich einstellen.")] },
    // a ballad from before the water came; the regular knows it
    wasser: { title: "WENN DAS WASSER KOMMT", music: { theme: "rooftop" }, ms: 6850, lines: [
      { text: "Wir hatten ein Haus am Strand der alten Stadt," },
      { text: "ein Fenster zum Meer, das keiner mehr hat." },
      { text: "Dann kam das Wasser, still und ohne Wort," },
      { text: "und nahm die Straßen mit und alle", gap: { right: "fort", words: ["Sport", "Ort", "fort"],
        then: { Sport: [SB("Sport. Am Strand. Das hätt's gegeben.")], Ort: [SB("Fast.")] } } },
      { text: "Wenn das Wasser kommt, dann halt meine Hand," },
      { text: "wir bauen uns oben ein neues", gap: { right: "Land", words: ["Pfand", "Land", "Band"],
        then: { Pfand: [M("Flaschen bring ich nicht zurück.")], Band: [SB("Wir hatten eine. Die ist auch weg.")] } } },
    ], after: [SB("Das war unser Lied. Vorher.")] },
    // NINTH FM's song about a Glasser; it comes close
    glass: { title: "GLASS GIRL", music: { theme: "juno", intensity: 0.6 }, ms: 6650, lines: [
      { text: "Sie sitzt im Dunkeln, zehn Schirme im Raum," },
      { text: "die ganze Stadt ist ihr offener Traum." },
      { text: "Sie sieht dich im Regen, sie sieht dich im Licht," },
      { text: "nur sich selber sieht sie", gap: { right: "nicht", words: ["nicht", "dicht", "schlicht"],
        then: { dicht: [M("Das bist dann wohl du.")], schlicht: [SB("Schlicht. Schön wär's.")] } } },
      { text: "Glass Girl, Glass Girl, wer schaut dir zu?" },
      { text: "Die ganze Stadt schläft, nur nicht", gap: { right: "du", words: ["Lou", "du", "Schuh"],
        then: { Lou: [M("Bao's Lou? Die schläft um acht.")], Schuh: [SB("Der schläft auch nicht. Der ist kaputt.")] } } },
    ], after: ["Wer schreibt so was?", M("Ein Glasser. Sagt man.")] },
  };
  Nagiwa.karaokeSongs = SONGS;
  Cutaway.i18n.declare("karaoke", ["KARAOKE", ...Object.values(SONGS).flatMap((s) => [s.title, ...s.lines.map((l) => l.text)])]);

  /** What the machine shows: the song, the line, since when, the word picked for each gap. */
  const K = { song: /** @type {string | null} */ (null), line: -1, since: 0, picks: /** @type {Record<number, string>} */ ({}), waiting: false };

  // the song menu, and one choice of three words for each gap
  Cutaway.dialog("karaoke", { main: { choices: [
    ...Object.entries(SONGS).map(([id, s]) => ({ text: s.title, silent: true, goto: "end", then: [{ karaoke: id }] })),
    { text: "Lieber nicht.", silent: true, goto: "end", then: [M("Morgen dann. Er läuft eh nur, wenn er will.")] },
  ] } });
  for (const [id, s] of Object.entries(SONGS)) s.lines.forEach((l, i) => {
    if (!l.gap) return;
    const g = l.gap;
    Cutaway.dialog(`karaoke_${id}_${i}`, { main: { choices: g.words.map((w) => ({ text: w, silent: true, goto: "end", then: [{ karaoke_pick: w }, ...(g.then?.[w] ?? [])] })) } });
  });

  // { karaoke: song } sings it: the music, the lines in turn, the picks at the gaps, then back to the room's music
  Cutaway.script.action("karaoke", async (s, ctx) => {
    const id = String(s.karaoke), song = SONGS[id];
    if (!song) return;
    Object.assign(K, { song: id, line: -1, since: Cutaway.clock.time, picks: {}, waiting: false });
    Cutaway.events.emit("sfx", { sfx: "glitch" });
    Cutaway.events.emit("music", { ...song.music, fade: 0.5 });
    try {
      for (let i = 0; i < song.lines.length; i++) {
        Object.assign(K, { line: i, since: Cutaway.clock.time });
        if (song.lines[i].gap) {
          K.waiting = true;
          await Cutaway.script.exec([{ wait: Math.round(song.ms * 0.7) }, { dialog: `karaoke_${id}_${i}` }], ctx);
          Object.assign(K, { waiting: false, since: Cutaway.clock.time - Math.round(song.ms * 0.7) });
        }
        await Cutaway.script.exec([{ wait: song.ms }], ctx);
      }
    } finally {
      K.song = null;
      const def = Cutaway.room.get("lucky_static")?.music;
      if (def) Cutaway.events.emit("music", typeof def === "string" ? { theme: def } : def);
    }
    await Cutaway.script.exec(song.after, ctx);
  });
  // { karaoke_pick: word } fills the gap of the line being sung
  Cutaway.script.action("karaoke_pick", (s) => { K.picks[K.line] = String(s.karaoke_pick); });

  // the machine: OUT OF ORDER, until it is hit where Mei says
  Cutaway.room.get("lucky_static").hotspots.karaoke.use = [
    "OUT OF ORDER. Seit Jahren.", M("Oben links. Fester."), { sfx: "glitch" }, "Er geht an. Natürlich geht er an.", { dialog: "karaoke" },
  ];

  // ---------------------------------------------------------------- the screen: over the bar while a song runs
  const FRAME = { x: 40, y: 16, w: 240, h: 46 };
  Cutaway.ui.addLayer({
    z: 40,
    render(/** @type {CanvasRenderingContext2D} */ ctx) {
      if (!K.song || Cutaway.scene.room?.id !== "lucky_static") return;
      const song = SONGS[K.song], t = Nagiwa.t, f = Cutaway.ui.font(), hud = Cutaway.font.get("hud"), { x, y, w, h } = FRAME;
      // a dark screen in the machine's magenta neon, chamfered like the skin's cards
      ctx.fillStyle = "#090d18";
      for (let r = 0; r < h; r++) { const a = Math.max(0, 4 - r), b = w - 1 - Math.max(0, 4 - (h - 1 - r)); ctx.fillRect(x + a, y + r, b - a + 1, 1); }
      ctx.fillStyle = "#a8238a"; ctx.fillRect(x + 4, y, w - 4, 1); ctx.fillRect(x, y + h - 1, w - 4, 1); ctx.fillRect(x, y + 4, 1, h - 5); ctx.fillRect(x + w - 1, y, 1, h - 4);
      ctx.fillStyle = "#ff4fd3"; ctx.fillRect(x + 4, y, 16, 1);
      hud.draw(ctx, t("KARAOKE"), x + 8, y + 5, { color: "#a8238a" }); hud.draw(ctx, t(song.title), x + w - 8, y + 5, { color: "#ff4fd3", align: "right" });
      // the line being sung: the words light up in turn; at a gap, its word blinks until it is picked
      const L = song.lines[K.line];
      if (!L) return;
      const words = t(L.text).split(" "), gap = L.gap, picked = K.picks[K.line];
      if (gap) words.push(picked ? t(picked) : Math.floor(Cutaway.clock.time / 300) % 2 ? "____" : "    ");
      const age = Cutaway.clock.time - K.since, lit = K.waiting ? words.length - 1 : Math.min(words.length, Math.floor((age / song.ms) * (words.length + 1)));
      // a line too long for the screen runs on in a second row; else the next line shows there, dim
      let cx = x + 8, ly = y + 17, rows = 1;
      words.forEach((wd, i) => {
        if (cx + f.measure(wd) > x + w - 8) { cx = x + 8; ly += 13; rows++; }
        const last = gap && i === words.length - 1, color = last ? (picked ? (picked === gap.right ? "#ffc0f2" : "#eea040") : "#617aa0") : i < lit ? "#ffc0f2" : "#8e96a8";
        f.draw(ctx, wd, cx, ly, { color, outline: "#0c0e1a" });
        cx += f.measure(wd + " ");
      });
      const N = song.lines[K.line + 1];
      if (N && rows === 1) f.draw(ctx, t(N.text) + (N.gap ? " ..." : ""), x + 8, ly + 13, { color: "#41547a", outline: "#0c0e1a" });
    },
  });
  // leaving the bar stops the screen (the script would have ended already; this is for a load in the middle)
  Cutaway.events.on("room.enter", () => { K.song = null; });
})();
