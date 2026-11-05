// What Juno can say to Motte whenever she passes the bench, once they have met (his first question, which sets the flags: game/rooms/kessel.js;
// the three lessons of kapitel1-design §7 are still to come). No flags: it may be asked again and costs the solver no states.
// What these lines plant for later is listed in kapitel1-design §7.
"use strict";

(function () {
const M = (/** @type {string} */ text) => ({ say: "motte", text });

Halcyon.talkTree("motte_mehr", [
  ["„Was spielst du da?“", [M("Sump Runner. Du bist eine Kabelratte."), M("Du ziehst Kabel durch die Rohre, und oben geht das Licht an.")], [
    ["„Das ist ein Job.“", [M("Ja, aber mit Musik."), M("Im neunten Level hört das Rohr auf. Ganz oben, unter der Krone. Da kommt keiner weiter.")]],
    ["„Woher hast du das Ding?“", [M("Ein Tideboy. Keiner hat das Paket abgeholt, das zählt als Trinkgeld."), M("Vier Stunden Akku, dann zehn laden. Umgekehrt wie Lull.")]],
    ["„Läuft's?“", [M("Mein Spielstand ist weg. Zwei Jahre. Das Ding ist einfach ausgegangen.")], [
      ["„Man macht immer ein Backup.“", [M("Wovon?"), "Von allem, was du nicht verlieren willst."]],
    ]],
  ]],
  ["„Was machst du hier draußen?“", [M("Warten, bis wer was gebracht haben will. Kurier halt.")], [
    ["„Was trägst du so aus?“", [M("Zettel, Schlüssel, Medikamente. Was nicht übers Netz soll."), M("Weil das Netz zuguckt. Das weißt du doch besser als ich.")], [
      ["„Wie weit kommst du damit?“", [M("Überall. Bis in den Fünften war ich schon, bis zur Kontrolle."), M("Keiner guckt ein Kind mit einer Tasche an.")], [
        ["„Die Kameras schon.“", [M("Die sehen eine Mütze.")]],
      ]],
    ]],
    ["„Müsstest du nicht im Bett sein?“", [M("Drinnen ist's mir zu leise. Meine Mutter schläft, vier Stunden, dann Schicht.")], [
      ["„Und da hältst du's nicht aus?“", [M("Das Licht hinter ihrem Ohr blinkt die ganze Zeit."), M("Komisch. Immer gleich. Ich zähl das manchmal mit."), M("Dann geh ich raus.")]],
    ]],
    ["„Warum die Mütze?“", [M("Die ist zu groß, ich weiß."), M("Meine Mutter sagt, damit man mich im Glass findet. Wenn mal was ist.")], [
      ["„Den eigenen Block glasst man nicht.“", [M("Auch nicht, wenn mal was ist?"), "...", "Dann schon."]],
    ]],
  ]],
  ["„Was gibt's Neues im Haus?“", [
    { if: "day=1", then: [M("Heute ist Dienstag. Der Aufzug fährt nicht."), "Angeblich schon.", M("Ich warte seit zwei Jahren auf den Dienstag.")] },
    { if: "day=2", then: [M("Frau Haldane sagt nachts nicht hallo. Tagsüber immer."), "Sie ist müde.", M("Nachts geht sie an mir vorbei wie an einer Wand.")] },
    { if: "day=3", then: [M("Im Haus gegenüber haben sie heute die Rollos runter. Alle, auf einmal."), "Warum?", M("Sagt keiner. Das ist ja das Komische.")] },
    { if: "day=4", then: [M("Keine Streife auf der Kowalski. Den ganzen Abend. Ich hab gezählt."), "Vielleicht haben die frei.", M("Die haben nie frei.")] },
  ]],
]);
})();
