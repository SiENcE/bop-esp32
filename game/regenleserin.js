// The Rain Reader on the roof (kapitel1-design §7): she tastes the drip and says which Ring it came from. Her talk is where the
// world gets explained, and where things that matter later are said in passing; the list of what pays off where is in the design doc.
// Nothing here is a flag: all of it is flavour, it may be asked again, and it costs the solver no states.
"use strict";

(function () {
const R = (/** @type {string} */ text) => ({ say: "regenleserin", text });

Nagiwa.talkTree("regenleserin", [
  ["„Was schmeckst du heute?“", [
    { if: "day=1", then: [R("Das kommt vom Siebten. Es schäumt mir auf der Zunge wie ein ganzer Waschtag."), "Und was heißt das?", R("Wer so viel wäscht, Kind, hat etwas, das nicht rausgehen will.")] },
    { if: "day=2", then: [R("Das ist vom Vierten. Die gießen da oben ihre Orchideen."), "Das kann man schmecken?", R("Es schmeckt nach Dünger, Kind, und jeder Tropfen kostet mehr als deine Miete.")] },
    { if: "day=3", then: [R("Das ist der Sechste. Er schmeckt nach Champagner, mit Regen verdünnt."), R("Da oben feiert einer, dass ein anderer schläft."), "Sagt dir das der Regen?",
      R("Alles kommt irgendwann hier unten an, Kind. Der Regen vergisst nichts.")] },
    { if: "day=4", then: [R("Heute schmeckt es nach gar nichts, nicht mal nach Rost."), "Ist das gut?", R("Das hatte ich noch nie, in all den Jahren nicht."),
      R("Da oben dreht keiner ohne Grund den Hahn zu."), R("Wenn der Regen so still wird, dann räumt jemand auf."), "Was räumen sie auf?",
      R("Frag mich morgen, Kind. Morgen liegt es mir auf der Zunge.")] },
  ]],
  ["„Woher kommt das alles?“", [R("Von oben, Kind. Alles fällt nach unten, und mit jedem Ring wird es billiger.")], [
    ["„Was kommt von wem?“", [R("Jeder Ring schmeckt nach dem, was er sich leisten kann. Frag mich einen.")], [
      ["„Der Achte, direkt über uns?“", [R("Der Achte schmeckt nach Spülwasser und Rost. Die haben auch nichts."), R("Aber sie haben uns unter sich, und das hilft.")]],
      ["„Der Fünfte?“", [R("Durch den Fünften fahren die Aufzüge. Er schmeckt nach Schmieröl und Kaffee"), R("und nach Leuten, die ihren Passierschein suchen."),
        R("Und seit ein paar Jahren schmeckt er nach Kochsalz, jede Nacht und eimerweise,"), R("so wie es im Krankenhaus schmeckt.")], [
        ["„Dann ist da eben eine Klinik.“", [R("Für eine Klinik ist es zu viel. Ich frag mich, wer da oben jede Nacht so viele wäscht.")]],
      ]],
      ["„Und die Krone?“", [R("Aus der Krone kommt nichts, kein einziger Tropfen, seit ich hier sitze."), R("Die trinken ihr Wasser zweimal."), R("Wer nichts abgibt, hat was zu verbergen. Oder er ist sehr reich.")], [
        ["„Das ist dasselbe.“", [R("Jetzt hast du's.")]],
      ]],
    ]],
    ["„Und unter uns?“", [R("Unter uns ist da, wo ich zur Schule gegangen bin.")], [
      ["„Die alte Stadt?“", [R("Als das Wasser kam, haben sie nicht abgepumpt. Sie haben draufgebaut."), R("Und uns die Rechnung geschickt.")], [
        ["„Die Hüllenabgabe? Dreihundertzehn zahl ich dafür.“", [R("Die zahlst du, damit die Hülle dicht bleibt. Hier, koste mal, wie dicht sie ist."), "Nein, danke."]],
        ["„Wer erinnert sich da noch dran?“", [R("Frag Bao. Der hatte da unten eine Küche, und ihr Fenster ging zum Strand."), R("Sein bestes Rezept liegt noch da, sagt er, unter drei Stockwerken Wasser."), "Davon hat er mir nie was erzählt.", R("Du hast ja auch nie was gefragt. Du guckst nur.")]],
      ]],
      ["„Wo läuft das alles hin?“", [R("Es läuft durch die Filter der Krake in der Pumpenhalle. Die ist älter als dein Mantel.")], [
        ["„Du meinst Tinte. Teo nennt sie seine Kollegin.“", [R("Ich schmeck es von oben, und sie schmeckt es von unten."), R("Wenn du mal wissen willst, wer fehlt, frag die. Die zählt mit.")]],
      ]],
      ["„Wohnt da unten noch wer?“", [R("Nachts ist manchmal Licht im Wasser. Da sitzt einer und hört mit.")], [
        ["„Wer soll das sein?“", [R("Vor zwei Jahren stand auf dem großen Schirm zehn Sekunden lang was anderes."), R("Es war die Wahrheit, sagen sie.")], [
          ["„Was stand da?“", [R("Das weiß ich nicht. Ich hab gerade gekostet.")]],
        ]],
      ]],
    ]],
    ["„Schmeckst du auch die Maschine?“", ["Die automatische Auswertung hat meinen Job.", R("Die Maschine, ja. Weißt du, was so eine Maschine tut? Sie wird heiß."), R("Heißes Wasser läuft ab, und alles, was abläuft, kommt hier bei mir an."), R("Ich warte seit drei Jahren auf den ersten warmen Tropfen.")], [
      ["„Vielleicht ist sie gut isoliert.“", [R("Vielleicht.")]],
    ]],
  ]],
  ["„Und du? Was machst du hier oben?“", [R("Ich sitze. Ich koste. Ich bin die Einzige, die nachts noch was merkt.")], [
    ["„Und davon lebst du?“", [R("Ich verkauf den Wetterbericht, für drei Chits.")], [
      ["„Es regnet immer.“", [R("Deshalb lieg ich nie falsch."), R("Das Wetter ist, wer oben feiert, wer oben krank ist und wer oben umzieht."), R("Wer das zuerst weiß, macht im Neunten sein Geschäft.")], [
        ["„Du verkaufst Shine.“", [R("Du verkaufst Shine, Kind. Ich sag nur, wie's schmeckt.")]],
      ]],
    ]],
    ["„Du kennst mich noch?“", [R("Du warst die mit dem Kleinen."), R("Ihr habt euch da vorn auf der Mauer eine Schale Nudeln geteilt."), R("Der hatte nie Angst vor der Höhe."), "Nein. Ich schon.", R("Was macht er jetzt?")], [
      ["„Er ist dreiundzwanzig und macht Doppelschichten.“", [R("Hat er auch das Licht hinterm Ohr?")], [
        // she only learns it when he comes by on Wednesday at 18:30 (game/kapitel1_leben.js)
        ["„Seit es gratis ist.“", [R("Sag ihm, er soll mal raufkommen. Solange er die Leiter noch findet.")], undefined, "moment:teo_visit"],
        ["„Teo? Der schläft doch gar nicht.“", [R("Sag ihm, er soll mal raufkommen. Solange er die Leiter noch findet.")], undefined, "!moment:teo_visit"],
      ]],
    ]],
    ["„Was sagst du zu Lull?“", [R("Ich bin zweiundachtzig. Den Schlaf, den ich noch hab, schlaf ich selber."), R("Zwei Wochen gratis, steht auf dem Schirm. Das Wasser war auch mal gratis.")], [
      ["„Was merkst du denn nachts?“", [R("Früher hat jeder für sich geschnarcht. Hör dir den Block mal um drei an."), R("Jetzt holt das halbe Haus zur selben Zeit Luft. Zur selben.")], [
        ["„Zufall.“", [R("Das schmeckt nicht nach Zufall, Kind.")]],
      ]],
      ["„Das Licht hinterm Ohr?“", [R("Hast du auch so eins?")], [
        ["„Ich hab was Älteres, von Nagi·wa, aus der Halle.“", [R("Wo sitzt es?"), "Es sitzt hinterm Ohr. Aber es leuchtet nur, wenn ich arbeite.", R("Das ist dieselbe Stelle."), R("Sparsam sind sie, die Leute da oben.")]],
      ]],
      ["„Und die Sinker?“", [R("Ruhe-Erschöpfung sagen die. Dann kommt der Wagen, der nicht hupt,"), R("und zwei in Weiß steigen aus, sehr freundlich."), R("In Weiß, hier unten! Das hält keinen Tag, das Wasser färbt alles."), R("Wer hier in Weiß rumläuft, kommt nicht von hier und bleibt nicht lang.")], [
        ["„Wo bringen sie sie hin?“", [R("Nach oben. Das ist das Einzige aus dem Neunten, was je nach oben gekommen ist.")]],
      ]],
    ]],
  ]],
]);
})();
