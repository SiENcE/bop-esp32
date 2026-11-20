// Nagiwa: LUCKY STATIC from inside (docs/kapitel1-design.md §7): Mei behind her counter, who lets Juno run a tab and passes on what
// she hears; the two regulars who have sat there since the flood; Nagi·wa's news on the TV over the counter. Mei and the regulars are painted (art/characters/lucky_people.px.js).
// All of it is flavour that reads only the day (a place that changes, dialog-style-guide §4 C): no flag, so it costs the solver nothing
// and may be asked again. Frau Imai's table is her own thread (game/stadt.js); nothing here reads it.
"use strict";

(function () {
const AI = Nagiwa.at.lucky_static;
const M = (/** @type {string} */ text) => ({ say: "mei", text });
const TV = (/** @type {string} */ text) => ({ say: "fernseher", text });
const SB = (/** @type {string} */ text) => ({ say: "stamm_b", text });

Cutaway.actor("mei", { name: "Mei", color: "#ff9a7a", room: "lucky_static", at: AI.mei, facing: "sw", walkTo: AI.bar, face: "ne",
  // painted (art/characters/lucky_people.px.js); she faces the customers whichever way the engine turns her, behind the counter
  costume: { idle: { se: "mei_idle_sw", sw: "mei_idle_sw", ne: "mei_idle_sw", nw: "mei_idle_sw" }, walk: { se: "mei_idle_sw", sw: "mei_idle_sw", ne: "mei_idle_sw", nw: "mei_idle_sw" },
    talk: { se: "mei_talk_sw", sw: "mei_talk_sw", ne: "mei_talk_sw", nw: "mei_talk_sw" } }, voice: { pitch: 58, range: 4, wave: "triangle", syllable: 75, speed: 1.05 },
  look: ["Mei trägt die Haare hoch und einen Bleistift drin, für die Tafel.", "Sie sieht jeden, der reinkommt, und fragt keinen was."],
  talk: [{ if: "day=4", then: [M("Juno. Heute tropft's nicht mal.")], else: [M("Juno. Setz dich irgendwo hin, wo's nicht tropft.")] },
    // Chapter 2 (kapitel2-design §5): after the raid Juno hears of it here, like everyone (no flag: she hears it each time she asks)
    { if: ["day>4", "day<7", "k1b=sold", "!off_tide"], then: [M("Okonkwo haben sie ausgeräumt. Freitagnacht."), M("Bao ist dazwischen. Gehirnerschütterung. Er sagt, Montag steht er wieder.")] },
    { dialog: "mei" }] });
Nagiwa.talkTree("mei", [
  ["„Ein Bier. Schreib's an.“", [M("Schreib ich."), "Sie macht einen Strich an die Tafel. In meiner Reihe stehen schon ein paar.", M("Die laufen nicht weg. Du ja auch nicht.")], [
    ["„Warum lässt du mich eigentlich anschreiben?“", [M("Wer anschreibt, kommt wieder."), M("Die bar zahlen, seh ich nie wieder.")]],
    ["„Ich zahl's dir zurück. Bald.“", [M("Hat keiner gefragt.")]],
  ]],
  ["„Was gibt's Neues, Mei?“", [
    { if: "day=2", then: [M("Seit Lull gratis ist, trinken sie weniger."), M("Schlafen geht schneller als Saufen. Und billiger."), "Und dein Laden?", M("Der läuft. Für die, die noch wach sein wollen.")] },
    { if: "day=3", then: [M("Der Sohn vom Fischmann ist nicht aufgewacht."), "Sinker?", M("Ruhe-Erschöpfung, sagen die von Nagi·wa. Seit Sonntag liegt er da und lächelt."),
      M("Der Fischmann steht trotzdem am Stand. Was soll er sonst machen.")] },
    { if: "day=4", then: [M("Nichts. Heute hört man gar nichts."), M("Man hört keine Streife und keine Sirene. Sogar die zwei da reden nicht."), "Ist das gut?", M("Das weiß ich nicht. Das Y flackert jedenfalls noch.")] },
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
  // Chapter 2 (kapitel2-design §3.4, §7): the death in the old metro, the forgery, the hunt
  { if: "day=5", then: [TV("Tote in der alten Metro. Revier 9 ermittelt."), "Sie sagen nicht, wer sie war. Und nicht, wie."] },
  { if: "day=6", then: [TV("Neue Bilder aus der alten Metro."), TV("Ein Mann, der sich LANTERN nennt, hat eine Ärztin getötet."),
    "Das ist nicht das, was ich gesehen hab.", "Mei macht nicht aus. Sie schaut nur weg."] },
  { if: "day=7", then: [TV("Fahndung nach LANTERN. Hinweise an Revier 9."), M("Der hat doch nie jemandem was getan. Der hat nur geredet.")] },
];

// the regulars on their stools, anonymous (the user's wish: a joke about it): he sleeps on his arms, she tells him things anyway.
// Painted from behind facing the counter (art/characters/lucky_people.px.js), whichever way the engine turns them
const BACK = (/** @type {string} */ a) => ({ se: a, sw: a, ne: a, nw: a });
Cutaway.actor("stamm_a", { name: "Anonymer Stammgast", color: "#a8b8d0", room: "lucky_static", at: AI.stammA, facing: "ne", walkTo: AI.regulars, face: "ne",
  costume: { idle: BACK("stamm_a_idle_ne"), walk: BACK("stamm_a_idle_ne"), talk: BACK("stamm_a_idle_ne") }, voice: { pitch: 44, range: 3, wave: "triangle", syllable: 90, speed: 0.8 },
  look: ["Er schläft auf seinen Armen. Das Bier daneben ist noch voll.", "Hinter seinem Ohr klebt das blasse Pflaster, und es blinkt."],
  talk: ["Er schläft.", SB("Lass ihn. Der schläft hier, seit es gratis ist.")] });
Cutaway.actor("stamm_b", { name: "Anonyme Stammgästin", color: "#c0b0d0", room: "lucky_static", at: AI.stammB, facing: "ne", walkTo: AI.regulars, face: "ne",
  costume: { idle: BACK("stamm_b_idle_ne"), walk: BACK("stamm_b_idle_ne"), talk: BACK("stamm_b_talk_ne") }, voice: { pitch: 64, range: 4, wave: "triangle", syllable: 85, speed: 0.9 },
  look: ["Sie sitzt gerade, als würde gleich jemand ein Foto machen.", "Sie sitzt seit der Flut auf demselben Hocker, sagt Mei."],
  talk: [
    { if: "day=2", then: [SB("Wir sind die Anonymen Stammgäste. Wir treffen uns jeden Abend. Hier."), "Und hilft's?", SB("Bisher nicht."),
      SB("Er schläft. Ich erzähl's ihm trotzdem."), "Was denn?", SB("Wie's war, vorher. Er hat's vergessen, ich nicht.")] },
    { if: "day=3", then: [SB("Er hat heute im Schlaf gelacht."), SB("Vierzig Jahre kenn ich den. Der lacht nicht.")] },
    { if: "day=4", then: [SB("Heute redet keiner. Nicht mal ich."), "..."] },
  ] });

Object.assign(Cutaway.room.get("lucky_static").hotspots, {
  tv: { name: "Fernseher", poly: AI.tvPoly, walkTo: AI.bar, face: "ne", look: "Da laufen Nagi·wa-Nachrichten. Keiner guckt hin, und keiner macht ihn aus.", use: NEWS },
  slate: { name: "Tafel", poly: AI.slatePoly, walkTo: AI.bar, face: "ne", look: ["Auf Meis Tafel stehen Striche und keine Namen.", "Sie weiß trotzdem, welche Reihe wem gehört.", "Meine ist die lange."] },
});
})();
