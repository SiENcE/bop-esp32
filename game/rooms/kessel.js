// Halcyon: the Kessel Block, Juno's building (kapitel0-design §6.2 steps 13-15, §7.1), its rooms baked from
// their maps. The 14th floor's landing (kessel_14): Juno's door 14B, Frau Haldane's open door 14C (she and
// her armchair are in the picture, seen through it), the note war, Motte on the bench, the stairs down. The
// lobby (kessel_lobby): the stairs, the lift out of order, Halcyon's poster, the mailboxes with the rent
// notice (rent_notice: Chapter 1's goal), the notice board, the street door.
"use strict";

(function () {
  const AK = Halcyon.at.kessel_14, AF = Halcyon.at.flat, AL = Halcyon.at.kessel_lobby;

  Cutaway.room("kessel_14", {
    name: "Vierzehnter Stock", background: "kessel_14_bg",
    ambience: ["neon_buzz", "city_far"], music: { theme: "juno", intensity: 0.3 },
    walk: AK.walk, holes: AK.holes, props: AK.props,
    // the map's lamps (the bake's): the tube's green, the TV's blue from Frau Haldane's door
    // (the stairwell's cold light and the Lull light only bake the art: in the game they would dim whoever sits by them)
    light: { ambient: 0.78, color: "#e8f4ec",
      lamps: AK.lamps.filter((/** @type {any} */ l) => !["below", "lull"].includes(l.id)).map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {
      door_juno: { name: "Meine Tür", rect: AK.door_junoRect, walkTo: AK.door_juno, face: "nw",
        look: "Meine Tür. Drei Schlösser, zwei davon von mir. Und die Kamera drüber auch.",
        use: [{ goto: "flat", at: AF.arrive, face: "se" }] },
      haldane: { name: "Frau Haldane", rect: AK.door_haldaneRect, walkTo: AK.haldane, face: "ne",
        look: ["Frau Haldane. Doppelschicht. Sie schläft, wie andere Leute blinzeln.", "Der blaue Punkt hinter ihrem Ohr ist ein Lull. Halcyon verkauft es gegen schlechte Träume."],
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
      bench: { name: "Bank", poly: AK.benchPoly, walkTo: AK.motte, face: "ne", z: -1,
        look: "Eine Bank, die irgendwer hochgetragen und hier vergessen hat. Motte sitzt fast jeden Abend drauf." },
      stairs: { name: "Treppe", poly: AK.railPoly, walkTo: AK.stairs, face: "ne",
        // looking over the rail: the stairwell straight down (art/ui/looks.px.js, the first top-down view)
        look: [{ zoom: "look_shaft" }, "Vierzehn Stockwerke runter. Von oben sieht's aus wie ein Brunnen.",
          "Ganz unten das Schild in der Lobby. Gelb, winzig. Der Aufzug geht nie.", { zoom: false }],
        // the first time down Motte calls her back: his question (kapitel0-design §6.2 step 14)
        use: [{ if: "!moth_met", then: [{ say: "motte", text: "Juno! Warte mal." }, { face: "sw" }, { dialog: "motte" }] },
          { goto: "kessel_lobby", at: AL.arrive, face: "se" }] },
    },
    enter: [{ once: ["Der Flur. Grün wie ein Aquarium, nur ohne Fische."] }],
  });

  Cutaway.room("kessel_lobby", {
    name: "Eingang", background: "kessel_lobby_bg",
    ambience: ["city_far", { sfx: "rain_glass", gain: 0.5 }], music: { theme: "juno", intensity: 0.3 },
    walk: AL.walk, holes: AL.holes, props: AL.props,
    light: { ambient: 0.74, color: "#dce4f4", lamps: AL.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {
      stairs: { name: "Treppe", rect: AL.stairwellRect, walkTo: AL.stairs, face: "ne",
        look: "Vierzehn Stockwerke rauf. Ich zähl sie jedes Mal, damit ich weiß, wie weit es noch ist.",
        use: [{ goto: "kessel_14", at: AK.stairs, face: "sw" }] },
      lift: { name: "Aufzug", rect: AL.liftRect, walkTo: AL.lift, face: "ne",
        look: ["OUT OF ORDER. Seit dem Frühjahr.", "Angeblich fährt er dienstags. Ich hab's nie erlebt."],
        use: "Ich drück trotzdem. Das Licht blinkt. Sonst nichts." },
      poster: { name: "Plakat", rect: AL.posterRect, walkTo: AL.poster, face: "ne",
        look: ["SLEPT WELL? HALCYON LISTENS.", "Schlecht geschlafen. Und ich hör auch zu, Halcyon. Den ganzen Tag."] },
      mailboxes: { name: "Briefkästen", rect: AL.mailboxesRect, walkTo: AL.mailboxes, face: "nw",
        look: [{ if: "!rent_notice", then: ["Aus meinem Briefkasten guckt was Rotes. Rot heißt nie was Gutes."], else: ["Mein Briefkasten. Die Mahnung hab ich. Mehr will ich heute nicht wissen."] }],
        use: [{ if: "!rent_notice", then: [{ set: "rent_notice" }, "Eine Mietmahnung. Fällig in drei Tagen: 900 Chits.", "Davon Hüllenabgabe: 310.",
          "Dreihundertzehn für die Ringe über meinem Kopf. Die ich nie bestellt hab."], else: ["Leer. Bis auf die Mahnung in meiner Tasche."] }] },
      board: { name: "Schwarzes Brett", rect: AL.boardRect, walkTo: AL.board, face: "nw",
        look: ["Eine Katze wird vermisst. Grau, hört auf Kiki. Die Abreißzettel sind alle noch dran.", "Darunter ein Zettel: Nachtschicht sucht Tagschicht für Zimmertausch."] },
      door: { name: "Haustür", rect: AL.doorRect, walkTo: AL.door, face: "nw",
        look: "Die Haustür. Draußen regnet's. Draußen regnet's immer.",
        use: [{ if: "!rent_notice", then: ["Erst noch die Post. Wenn ich schon unten bin."],
          else: [{ goto: "kowalski", at: Halcyon.at.kowalski.arrive, face: "se" }] }] },
      sign: { name: "Warnschild", poly: AL.signPoly, walkTo: AL.sign, face: "nw",
        look: "Vorsicht, nass. Das Schild steht seit Wochen hier. Der Boden ist seitdem nass." },
      flyers: { name: "Werbezettel", poly: AL.flyersPoly, walkTo: AL.mailboxes, face: "nw",
        look: "Werbung. Lull zum halben Preis. Schlaf besser, schlaf Halcyon. Hundertmal, auf dem Boden." },
    },
    enter: [{ once: ["Unten. Es riecht nach Regen und nach dem Müll von vierzehn Stockwerken."] }],
  });

  // Motte's question, the first value for him (story §5: moth_kind, moth_brushed; kapitel1-design §7: if
  // she was kind he asks for lessons). Every answer meets him (moth_met).
  Cutaway.dialog("motte", {
    main: {
      enter: [{ say: "motte", text: "Was machst du eigentlich? Den ganzen Tag?" }],
      choices: [
        { text: "„Ich schau Leuten zu. Und verkauf, was ich sehe.“", goto: "end", then: [{ set: "moth_met" }, { set: "moth_kind" },
          { say: "motte", text: "Durch die Kameras? Echt? Zeigst du mir das mal?" }, "Vielleicht. Wenn du alt genug bist, es zu bereuen."] },
        { text: "„Reparaturen.“", goto: "end", then: [{ set: "moth_met" },
          { say: "motte", text: "Reparaturen. Klar. Darum hast du drei Schlösser." }] },
        { text: "„Geh schlafen, Motte.“", goto: "end", then: [{ set: "moth_met" }, { set: "moth_brushed" },
          { say: "motte", text: "Ich bin nicht müde." }, "Er schaut wieder auf sein Handheld. Aber er tippt nicht."] },
      ],
    },
  });
})();
