// The Rain Reader on the roof (kapitel1-design §7): she tastes the drip and says which Ring it came from. Her talk is where the
// world gets explained, and where things that matter later are said in passing; the list of what pays off where is in the design doc.
// Nothing here is a flag: all of it is flavour, it may be asked again, and it costs the solver no states.
"use strict";

(function () {
const R = (/** @type {string} */ text) => ({ say: "regenleserin", text });

Halcyon.talkTree("regenleserin", [
  ["„Was schmeckst du heute?“", [
    { if: "day=2", then: [R("Der Vierte. Die gießen ihre Orchideen."), "Das schmeckt man?", R("Dünger, Kind. Teurer als deine Miete.")] },
    { if: "day=3", then: [R("Der Sechste. Champagner, verdünnt. Jemand feiert, dass ein anderer schläft."), "Sagt das der Regen?", R("Alles kommt runter. Früher oder später.")] },
    { if: "day=4", then: [R("Heute schmeckt's nach gar nichts."), "Ist das gut?", R("Das hatte ich noch nie."),
      R("Da oben dreht keiner ohne Grund den Hahn zu. Wenn's so still wird, räumt jemand auf."), "Was denn?", R("Frag mich morgen. Morgen schmeckt man's.")] },
  ]],
  ["„Woher kommt das alles?“", [R("Von oben, Kind. Von oben nach unten wird's billiger.")], [
    ["„Was kommt von wem?“", [R("Jeder Ring schmeckt nach dem, was er sich leisten kann. Frag.")], [
      ["„Der Achte, direkt über uns?“", [R("Spülwasser und Rost. Die haben auch nichts. Aber sie haben uns unter sich, das hilft.")]],
      ["„Der Fünfte?“", [R("Da fahren die Aufzüge durch. Schmieröl, Kaffee, Leute, die ihren Passierschein suchen."), R("Und seit ein paar Jahren Kochsalz. Jede Nacht, eimerweise. Wie im Krankenhaus.")], [
        ["„Dann ist da eben eine Klinik.“", [R("Für eine Klinik ist es zu viel. Ich frag mich, wer da oben jede Nacht so viele wäscht.")]],
      ]],
      ["„Und die Krone?“", [R("Aus der Krone kommt nichts. Kein Tropfen, seit ich hier sitze."), R("Die trinken ihr Wasser zweimal."), R("Wer nichts abgibt, hat was zu verbergen. Oder er ist sehr reich.")], [
        ["„Das ist dasselbe.“", [R("Jetzt hast du's.")]],
      ]],
    ]],
    ["„Und unter uns?“", [R("Unter uns ist da, wo ich zur Schule gegangen bin.")], [
      ["„Die alte Stadt?“", [R("Als das Wasser kam, haben sie nicht abgepumpt. Sie haben draufgebaut."), R("Und uns die Rechnung geschickt.")], [
        ["„Die Hüllenabgabe. Dreihundertzehn, mit jeder Miete.“", [R("Damit die Hülle dicht bleibt. Hier, koste mal, wie dicht sie ist."), "Nein, danke."]],
        ["„Wer erinnert sich da noch dran?“", [R("Frag Bao. Der hatte da unten eine Küche, mit Fenster zum Strand."), R("Sein bestes Rezept liegt noch da, sagt er. Unter drei Stockwerken Wasser."), "Davon hat er mir nie was erzählt.", R("Du hast ja auch nie was gefragt. Du guckst nur.")]],
      ]],
      ["„Wo läuft das alles hin?“", [R("Durch die Filter von der Krake in der Pumpenhalle. Die ist älter als dein Mantel.")], [
        ["„Tinte. Teo nennt sie seine Kollegin.“", [R("Ich schmeck's von oben, sie von unten."), R("Wenn du mal wissen willst, wer fehlt, frag die. Die zählt mit.")]],
      ]],
      ["„Wohnt da unten noch wer?“", [R("Nachts ist manchmal Licht im Wasser. Da sitzt einer und hört mit.")], [
        ["„Wer soll das sein?“", [R("Vor zwei Jahren stand auf dem großen Schirm zehn Sekunden lang was anderes."), R("Die Wahrheit, sagen sie.")], [
          ["„Was stand da?“", [R("Weiß ich nicht. Ich hab gerade gekostet.")]],
        ]],
      ]],
    ]],
    ["„Schmeckst du auch die Maschine?“", ["Die automatische Auswertung. Die hat meinen Job.", R("Die Maschine, ja. Weißt du, was so eine Maschine macht? Heiß wird sie."), R("Heißes Wasser läuft ab. Und alles, was abläuft, kommt hier an."), R("Ich warte seit drei Jahren auf den ersten warmen Tropfen.")], [
      ["„Vielleicht ist sie gut isoliert.“", [R("Vielleicht.")]],
    ]],
  ]],
  ["„Und du? Was machst du hier oben?“", [R("Ich sitze. Ich koste. Ich bin die Einzige, die nachts noch was merkt.")], [
    ["„Und davon lebst du?“", [R("Wetterbericht. Drei Chits.")], [
      ["„Es regnet immer.“", [R("Deshalb lieg ich nie falsch."), R("Das Wetter ist: Wer oben feiert. Wer oben krank ist. Wer oben umzieht."), R("Wer das zuerst weiß, macht im Neunten sein Geschäft.")], [
        ["„Du verkaufst Shine.“", [R("Du verkaufst Shine, Kind. Ich sag nur, wie's schmeckt.")]],
      ]],
    ]],
    ["„Du kennst mich noch?“", [R("Du warst die mit dem Kleinen. Eine Schale Nudeln für zwei, da vorn auf der Mauer."), R("Der hatte nie Angst vor der Höhe."), "Nein. Ich schon.", R("Was macht er jetzt?")], [
      ["„Pumpenhalle. Doppelschichten. Er ist dreiundzwanzig.“", [R("Hat er auch das Licht hinterm Ohr?")], [
        ["„Seit es gratis ist.“", [R("Sag ihm, er soll mal raufkommen. Solange er die Leiter noch findet.")]],
      ]],
    ]],
    ["„Was sagst du zu Lull?“", [R("Ich bin zweiundachtzig. Den Schlaf, den ich noch hab, schlaf ich selber."), R("Zwei Wochen gratis, steht auf dem Schirm. Das Wasser war auch mal gratis.")], [
      ["„Was merkst du denn nachts?“", [R("Früher hat jeder für sich geschnarcht. Hör dir den Block mal um drei an."), R("Jetzt holt das halbe Haus zur selben Zeit Luft. Zur selben.")], [
        ["„Zufall.“", [R("Schmeckt nicht nach Zufall.")]],
      ]],
      ["„Das Licht hinterm Ohr?“", [R("Hast du auch so eins?")], [
        ["„Was Älteres. Von Halcyon, aus meiner Zeit in der Halle.“", [R("Wo sitzt es?"), "Hinterm Ohr. Aber es leuchtet nur, wenn ich arbeite.", R("Dieselbe Stelle."), R("Sparsam, die Leute da oben.")]],
      ]],
      ["„Und die Sinker?“", [R("Ruhe-Erschöpfung. Dann kommt der Wagen, der nicht hupt. Zwei in Weiß, sehr freundlich."), R("Weiß, hier unten! Das hält keinen Tag, das Wasser färbt alles."), R("Wer hier in Weiß rumläuft, kommt nicht von hier und bleibt nicht lang.")], [
        ["„Wo bringen sie sie hin?“", [R("Nach oben. Das ist das Einzige aus dem Neunten, was je nach oben gekommen ist.")]],
      ]],
    ]],
  ]],
]);
})();
