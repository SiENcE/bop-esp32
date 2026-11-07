// Halcyon: the life around Chapter 1's jobs (docs/kapitel1-design.md §7). So far Teo's visit on Wednesday at 18:30.
// Teo comes by on Wednesday evening with soup from Bao. The visit can't be missed: at 18:30 there is a knock wherever Juno is waiting,
// she opens the door, and afterwards she is back where she was. A scene without choices, so it costs the solver nothing but its moment;
// what Juno learns there (Teo is on Lull) other talks read from `moment:teo_visit`.
"use strict";

(function () {
const AF = Halcyon.at.flat;
const T = (/** @type {string} */ text) => ({ say: "teo", text });

Cutaway.actor("teo", { name: "Teo", color: "#ffa040",
  costume: { idle: "mock_teo", walk: "mock_teo", talk: "mock_teo" }, voice: { pitch: 52, range: 5, wave: "triangle", syllable: 70, speed: 1.15 },
  look: ["Orange Weste, Gehörschutz um den Hals. Die Kiemen sind rot vom Salzwasser.", "Hinter dem Ohr das Lull-Pflaster. Es blinkt."],
  talk: [T("Iss, Ju.")] });

const VISIT = [
  T("Ju! Mach auf, die Brühe wird kalt."),
  T("Von Bao. Er sagt, du hast seit Dienstag nichts gegessen. Er zählt mit."), "Er zählt falsch.", T("Er zählt nie falsch. Nur zu deinen Gunsten."),
  "Hinter seinem Ohr: ein blasses Pflaster. Es blinkt.", "Seit wann?", T("Seit es gratis ist."), T("Vier Stunden Lull, und ich bin wie neu."),
  "Du hast Doppelschichten.", T("Deswegen ja. Vier Stunden, Ju. Fühlt sich an wie zehn."),
  T("Und du? Immer noch die Kameras?"), "Immer noch.", T("Du redest noch immer, als hätten sie dich gefeuert, weil du schlecht warst."), "...",
  T("Iss. Ich muss los, Schicht um acht."), T("Schlaf du auch mal, Ju."),
];
// { teo_visit: true } the knock: to the flat's door, the scene, and back to where Juno was (a camera, the deck)
Cutaway.script.action("teo_visit", async (s, ctx) => {
  const back = Cutaway.scene.room?.id, app = Cutaway.state.flag("deck_app");      // where she was, and the deck's open window (a view)
  await Cutaway.script.exec(["Es klopft. Um die Zeit klopft nur einer.",
    { goto: "flat", at: AF.door, face: "se" }, { place: "teo", room: "flat", at: [80, 166], face: "nw" }, ...VISIT,
    { place: "teo", room: null }, "Weg. Die Brühe ist noch warm.", { evi: "froh" }, { say: "evi", text: "Sein Licht hinterm Ohr blinkt. Ist das schön?" }, "Weiß ich nicht.",
    ...(back && back !== "flat" ? [{ goto: back }] : []), ...(app ? [{ set: "deck_app", value: app }] : [])], ctx);
}, { sets: () => [] });
// never watched: it happens as its window ends, wherever Juno is (the window begins with the evening, so 18:30 is the only new stop of the clock)
Cutaway.moment("teo_visit", { room: "deck", day: 2, from: "18:00", to: "18:30", if: "~never", unseen: [{ teo_visit: true }] });
})();
