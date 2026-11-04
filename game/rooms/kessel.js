// Halcyon: the Kessel Block, Juno's building (kapitel0-design §6.2 steps 13-15, §7.1). The 14th floor's
// landing (kessel_14), baked from its map: Juno's door 14B, Frau Haldane's open door 14C (she and her
// armchair are in the picture, seen through it), the note war, the stairs down to the lobby.
"use strict";

(function () {
  const AK = Halcyon.at.kessel_14, AF = Halcyon.at.flat;

  Cutaway.room("kessel_14", {
    name: "Vierzehnter Stock", background: "kessel_14_bg",
    ambience: ["neon_buzz", "city_far"], music: { theme: "juno", intensity: 0.3 },
    walk: AK.walk, holes: AK.holes, props: AK.props,
    // the map's lamps (the bake's): the tube's green, the TV's blue from Frau Haldane's door
    light: { ambient: 0.4, color: "#9fd8b0", lamps: AK.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {
      door_juno: { name: "Meine Tür", rect: AK.door_junoRect, walkTo: AK.door_juno, face: "nw",
        look: "Meine Tür. Drei Schlösser, zwei davon von mir. Und die Kamera drüber auch.",
        use: [{ goto: "flat", at: AF.arrive, face: "se" }] },
      haldane: { name: "Frau Haldane", rect: AK.door_haldaneRect, walkTo: AK.haldane, face: "ne",
        look: ["Frau Haldane. Doppelschicht. Sie schläft, wie andere Leute blinzeln.", "Das blaue Licht an ihrer Schläfe ist ein Lull. Halcyon verkauft es gegen schlechte Träume."],
        use: "Ich lass sie schlafen.", talk: "Sie schläft. Und ihr Fernseher redet für zwei." },
      notes: { name: "Zettel", rect: AK.notesRect, walkTo: AK.notes, face: "nw",
        look: ["Ein Zettel: WER KLAUT MEINE ZEITUNG?? Unterschrieben: 14C.", "Darunter, mit Pfeil: NIEMAND LIEST ZEITUNG. 14A.", "Krieg auf dem vierzehnten. Seit Wochen."] },
      floor_sign: { name: "14", rect: AK.floor_signRect, walkTo: AK.stairs, face: "ne",
        look: "Vierzehnter Stock. Der Aufzug unten fährt nicht, seit ich hier wohne." },
      tube: { name: "Neonröhre", rect: AK.tubeRect, walkTo: AK.haldane, face: "ne",
        look: "Die Röhre stirbt seit Monaten. Zuständig ist keiner." },
      bikes: { name: "Fahrräder", poly: AK.bikesPoly, walkTo: AK.bikes, face: "nw",
        look: "Zwei Fahrräder, aneinander angeschlossen. Damit keins allein geklaut wird." },
      bags: { name: "Müllsäcke", poly: AK.bagsPoly, walkTo: AK.bags, face: "ne",
        look: "Müll. Abgeholt wird dienstags. Theoretisch." },
      stairs: { name: "Treppe", poly: AK.railPoly, walkTo: AK.stairs, face: "ne",
        look: "Die Treppe runter. Vierzehn Stockwerke, wenn der Aufzug nicht geht. Er geht nie.",
        use: [{ end: "Ende des Testabschnitts. Weiter geht es in der Lobby (H3)." }] },
    },
    enter: [{ once: ["Der Flur. Grün wie ein Aquarium, nur ohne Fische."] }],
  });
})();
