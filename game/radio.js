// Nagiwa: the radio on the deck (kapitel0-design §2.1 RADIO). Three stations (Lantern's pirate station comes in
// Chapter 2): a click in the RADIO window tunes one in, its music plays through the speaker on the deck and in the
// flat (game/music.js: NINTH FM is Juno's theme, NAGI·WA EASY and KESSEL ROOFTOP their own), elsewhere the room's
// music; AUS turns it off. While the window is open the station's presenter talks between the songs: a line every
// few seconds, in turn, some only on their evening (written now; a synthesised voice can read them later).
// The station is a view flag (`radio`): saved, no state for the solver, nothing in the game hangs on it.
"use strict";

(function () {
  Cutaway.state.view("radio");
  /** the rooms the radio is heard in */
  const ROOMS = ["deck", "flat"];

  /**
   * The stations, in the window's order; each one's music and what its presenter says (`day`: only on that game day).
   * @type {{id: string, name: string, freq: string, music: any, lines: {text: string, day?: number}[]}[]}
   */
  Nagiwa.radio = [
    // NINTH FM: the Ninth's own night show; the presenter knows the street and talks to it (du, ihr)
    { id: "ninth", name: "NINTH FM", freq: "88.4", music: { theme: "juno", intensity: 0.35 }, lines: [
      { text: "NINTH FM. Der Regen ist umsonst, die Musik auch. Mehr gibt's heute nicht umsonst." },
      { text: "Grüße an die Nachtschicht am Pumpwerk. Ihr wisst, wer ihr seid." },
      { text: "Jemand hat angerufen und gefragt, ob es heute noch aufhört. Nein." },
      { text: "Wer die Miete schon hat: Glückwunsch. Wer nicht: Das nächste ist für dich." },
      { text: "Ich krieg Nachrichten, ich soll mal was Fröhliches spielen. Ich arbeite dran." },
      { text: "Die Flut kommt spät heute. Stellt nichts in den Keller, was ihr noch braucht." },
      { text: "Dienstag. Der Tag, an dem nichts passiert. Genießt es.", day: 1 },
      { text: "Mittwoch. Die Woche hat noch Hoffnung. Ich hab sie gestern gesehen.", day: 2 },
      { text: "Donnerstag. Viele schlafen gerade sehr gut. Ich nicht. Ich hab ja euch.", day: 3 },
      { text: "Freitag. Später trocken, sagen sie im Fernsehen. Ich glaub's, wenn ich's seh.", day: 4 },
    ] },
    // NAGI·WA EASY: the company's station; its announcer is friendly, says Sie and says nothing (dialog-style-guide §6)
    { id: "easy", name: "NAGI·WA EASY", freq: "101.0", music: { theme: "easy" }, lines: [
      { text: "Sie hören Nagi·wa Easy. Entspannung ist ein Recht. Um den Rest kümmern wir uns." },
      { text: "Lull. Vier Stunden, die sich anfühlen wie zehn. Jetzt gratis in Ihrer Ausgabestelle." },
      { text: "Ihre Sicherheit ist unser Auftrag. Kriminalität im Neunten auf Rekordtief." },
      { text: "Das Wetter für den Neunten: Niederschlag. Bleiben Sie entspannt." },
      { text: "Nagi·wa dankt Ihnen für Ihren Dienst." },
    ] },
    // KESSEL ROOFTOP: someone in the block plays records at night; sleepy, never says who
    { id: "roof", name: "KESSEL ROOFTOP", freq: "94.2", music: { theme: "rooftop" }, lines: [
      { text: "Kessel Rooftop. Die Antenne ist auf dem Dach. Ich nicht. Ich hab Höhenangst." },
      { text: "Die nächste Platte war auf dem Flohmarkt. Die Hülle war nass. Die Platte nicht." },
      { text: "Keine Werbung. Kein Geld. Nur Regen auf dem Mikrofon." },
      { text: "Wer ich bin, sag ich nicht. Im Haus weiß es eh jeder." },
      { text: "Der Aufzug fährt angeblich dienstags. Ich hab gewartet. Nein.", day: 1 },
    ] },
  ];
  Cutaway.i18n.declare("radio", ["AUS", "ON AIR", "RAUSCHEN", ...Nagiwa.radio.flatMap((s) => s.lines.map((l) => l.text))]);

  /** The station on now, or null. */
  Nagiwa.radioOn = () => Nagiwa.radio.find((s) => s.id === Cutaway.state.peek("radio")) ?? null;
  /** What the presenter says now (a line every 9 s while the window is open), or "". */
  Nagiwa.radioLine = () => {
    const s = Nagiwa.radioOn(), day = Cutaway.time.now.day;
    if (!s) return "";
    const lines = s.lines.filter((l) => l.day === undefined || l.day === day);
    return lines.length ? Nagiwa.t(lines[Math.floor(Cutaway.clock.time / 9000) % lines.length].text) : "";
  };
  /** The station's music through the speaker, or (off) what the room plays. @param {string} room */
  function play(room) {
    const s = Nagiwa.radioOn(), def = Cutaway.room.get(room)?.music;
    if (!ROOMS.includes(room)) return;
    if (s) Cutaway.events.emit("music", { ...s.music, speaker: 1, fade: 1 });
    else if (def) Cutaway.events.emit("music", typeof def === "string" ? { theme: def } : def);
  }

  // { radio: "ninth" } tunes a station in, { radio: false } turns it off
  Cutaway.script.action("radio", (s) => {
    if (s.radio) Cutaway.state.set("radio", String(s.radio)); else Cutaway.state.unset("radio");
    Cutaway.events.emit("sfx", { sfx: "type" });
    play(Cutaway.scene.room?.id ?? "");
  });
  // { radio_resume: { theme: ... } }: back from something with its own music (the old photo): the station if one is on, else this
  Cutaway.script.action("radio_resume", (s) => {
    if (Nagiwa.radioOn()) play(Cutaway.scene.room?.id ?? ""); else Cutaway.events.emit("music", s.radio_resume);
  });
  // coming into the flat or onto the deck: the station plays there (after the room's own music was set)
  Cutaway.events.on("room.entered", (/** @type {{id: string}} */ e) => { if (Nagiwa.radioOn() && e.id === Cutaway.scene.room?.id) play(e.id); });
})();
