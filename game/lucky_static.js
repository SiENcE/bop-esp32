// Nagiwa: LUCKY STATIC from inside (docs/kapitel1-design.md §7): Mei behind her counter, who lets Juno run a tab and passes on what
// she hears; the two regulars who have sat there since the flood; Nagi·wa's news on the TV over the counter. On blocks (art/mock/).
// All of it is flavour that reads only the day (a place that changes, dialog-style-guide §4 C): no flag, so it costs the solver nothing
// and may be asked again. Frau Imai's table is her own thread (game/stadt.js); nothing here reads it.
"use strict";

(function () {
const AI = Nagiwa.at.lucky_static;
const M = (/** @type {string} */ text) => ({ say: "mei", text });
const TV = (/** @type {string} */ text) => ({ say: "fernseher", text });
const SB = (/** @type {string} */ text) => ({ say: "stamm_b", text });

Cutaway.actor("mei", { name: "Mei", color: "#ff9a7a", room: "lucky_static", at: AI.mei, facing: "sw", walkTo: AI.bar, face: "ne",
  costume: { idle: "mock_mei", walk: "mock_mei", talk: "mock_mei" }, voice: { pitch: 58, range: 4, wave: "triangle", syllable: 75, speed: 1.05 },
  look: ["Mei. Die Haare hoch, ein Bleistift drin. Für die Tafel.", "Sie sieht jeden, der reinkommt, und fragt keinen was."],
  talk: [{ if: "day=4", then: [M("Juno. Heute tropft's nicht mal.")], else: [M("Juno. Setz dich irgendwo hin, wo's nicht tropft.")] }, { dialog: "mei" }] });
Nagiwa.talkTree("mei", [
  ["„Ein Bier. Schreib's an.“", [M("Schreib ich."), "Ein Strich an der Tafel. Unter meinem stehen schon ein paar.", M("Die laufen nicht weg. Du ja auch nicht.")], [
    ["„Warum lässt du mich eigentlich anschreiben?“", [M("Wer anschreibt, kommt wieder."), M("Die bar zahlen, seh ich nie wieder.")]],
    ["„Ich zahl's dir zurück. Bald.“", [M("Hat keiner gefragt.")]],
  ]],
  ["„Was hört man so?“", [
    { if: "day=2", then: [M("Seit Lull gratis ist, trinken sie weniger."), M("Schlafen geht schneller als Saufen. Und billiger."), "Und dein Laden?", M("Läuft. Für die, die noch wach sein wollen.")] },
    { if: "day=3", then: [M("Der Sohn vom Fischmann ist nicht aufgewacht."), "Sinker?", M("Ruhe-Erschöpfung, sagen die von Nagi·wa. Seit Sonntag liegt er da und lächelt."),
      M("Der Fischmann steht trotzdem am Stand. Was soll er sonst machen.")] },
    { if: "day=4", then: [M("Nichts. Heute hört man gar nichts."), M("Keine Streife, keine Sirene. Sogar die zwei da reden nicht."), "Ist das gut?", M("Weiß ich nicht. Das Y flackert jedenfalls noch.")] },
  ]],
  ["„Läuft der Fernseher eigentlich immer?“", [M("Immer. Einmal hab ich ihn ausgemacht."), M("Zehn Minuten später kam einer und hat gefragt, ob was kaputt ist."), "Wer?", M("Freundlich war er. Die sind immer freundlich.")]],
]);

// the news: Nagi·wa's own voice, cyan like all its technology; a voice only, nobody to click
Cutaway.actor("fernseher", { name: "NAGI·WA NEWS", color: "#62def0",
  voice: { pitch: 62, range: 2, wave: "sine", syllable: 80, speed: 1 } });
const NEWS = [
  { if: "day=2", then: [TV("Lull jetzt kostenlos im ganzen Neunten."), TV("Vier Stunden, die sich anfühlen wie zehn."),
    { if: "moment:teo_visit", then: ["Teo hat das wörtlich so gesagt."], else: ["Vier Stunden wie zehn. Und wer zahlt die anderen sechs?"] }] },
  { if: "day=3", then: [TV("Kriminalität im Neunten auf Rekordtief."), TV("Nagi·wa dankt Ihnen für Ihre Ruhe."), "Wer schläft, meldet auch nichts."] },
  { if: "day=4", then: [TV("Das Wetter für den Neunten: Tropfen aus dem Vierten. Später trocken."), "Später trocken. Hier unten? Das gab's noch nie."] },
];

// the regulars on their stools: he sleeps on his arms, she tells him things anyway
Cutaway.actor("stamm_a", { name: "Stammgast", color: "#a8b8d0", room: "lucky_static", at: AI.stammA, facing: "ne", walkTo: AI.regulars, face: "ne",
  costume: { idle: "mock_stamm_a", walk: "mock_stamm_a", talk: "mock_stamm_a" }, voice: { pitch: 44, range: 3, wave: "triangle", syllable: 90, speed: 0.8 },
  look: ["Er schläft auf seinen Armen. Das Bier daneben ist noch voll.", "Hinter dem Ohr das blasse Pflaster. Es blinkt."],
  talk: ["Er schläft.", SB("Lass ihn. Der schläft hier, seit es gratis ist.")] });
Cutaway.actor("stamm_b", { name: "Stammgästin", color: "#c0b0d0", room: "lucky_static", at: AI.stammB, facing: "ne", walkTo: AI.regulars, face: "ne",
  costume: { idle: "mock_stamm_b", walk: "mock_stamm_b", talk: "mock_stamm_b" }, voice: { pitch: 64, range: 4, wave: "triangle", syllable: 85, speed: 0.9 },
  look: ["Sie sitzt gerade, als würde gleich jemand ein Foto machen.", "Seit der Flut auf demselben Hocker, sagt Mei."],
  talk: [
    { if: "day=2", then: [SB("Er schläft. Ich erzähl's ihm trotzdem."), "Was denn?", SB("Wie's war. Vorher. Er hat's vergessen, ich nicht.")] },
    { if: "day=3", then: [SB("Er hat heute im Schlaf gelacht."), SB("Vierzig Jahre kenn ich den. Der lacht nicht.")] },
    { if: "day=4", then: [SB("Heute redet keiner. Nicht mal ich."), "..."] },
  ] });

Object.assign(Cutaway.room.get("lucky_static").hotspots, {
  tv: { name: "Fernseher", rect: AI.tvRect, walkTo: AI.bar, face: "ne", look: "Nagi·wa-Nachrichten. Keiner guckt hin, und keiner macht ihn aus.", use: NEWS },
  slate: { name: "Tafel", rect: AI.slateRect, walkTo: AI.bar, face: "ne", look: ["Meis Tafel. Striche, keine Namen. Sie weiß trotzdem, welche Reihe wem gehört.", "Meine ist die lange."] },
});
})();
