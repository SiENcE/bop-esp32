// Nagiwa: the Kessel Block, Juno's building (kapitel0-design §6.2 steps 13-15, §7.1), its rooms baked from
// their maps. The 14th floor's landing (kessel_14): Juno's door 14B, Frau Haldane's open door 14C (she and
// her armchair are in the picture, seen through it), the note war, Motte on the bench, the stairs down. The
// lobby (kessel_lobby): the stairs, the lift out of order, Nagi·wa's poster, the mailboxes with the rent
// notice (rent_notice: Chapter 1's goal), the notice board, the street door.
"use strict";

(function () {
  const AK = Nagiwa.at.kessel_14, AF = Nagiwa.at.flat, AL = Nagiwa.at.kessel_lobby;

  // Fourteen floors, the lift never runs. The first time each way: black, steps on steel and the floors counting by; then only the steps
  // (view flags: how it looks, no state for the solver)
  Cutaway.state.view("stairs_down", "stairs_up");
  const floor = (/** @type {number} */ n, /** @type {number} */ ms) => [{ sfx: "steps_metal" }, { caption: String(n), at: "c", ms }];
  const count = (/** @type {number[]} */ list, /** @type {number} */ ms) => list.flatMap((n) => floor(n, ms));
  const STAIRS_DOWN = [{ if: "!stairs_down",
    // the first time she looks over the rail before she goes (a look of its own needs no right click: the game has none)
    then: [{ set: "stairs_down" }, { zoom: "look_shaft" }, "Es geht vierzehn Stockwerke runter. Von oben sieht's aus wie ein Brunnen.", "Ganz unten steht das gelbe Schild in der Lobby, winzig klein. Der Aufzug geht nie.", { zoom: false },
      { fade: "out", ms: 400 }, ...count([13, 12, 11, 10, 9], 300),
      { if: "day=1", then: [{ caption: "Der Aufzug fährt angeblich dienstags.", at: "c", color: "#fff070", ms: 2000 }] },
      ...count([8, 7, 6, 5, 4, 3, 2, 1], 220), { goto: "kessel_lobby", at: AL.arrive, face: "sw" }, { fade: "in", ms: 400 }],
    else: [{ sfx: "steps_metal" }, { goto: "kessel_lobby", at: AL.arrive, face: "sw" }] }];
  const STAIRS_UP = [{ if: "!stairs_up",
    then: [{ set: "stairs_up" }, { fade: "out", ms: 400 }, ...count([2, 3, 4, 5, 6], 260), ...count([7, 8, 9, 10], 340), { caption: "Ich zähl sie jedes Mal. Damit ich weiß, wie weit es noch ist.", at: "c", color: "#fff070", ms: 2400 },
      ...count([11, 12, 13], 460), ...floor(14, 600), { goto: "kessel_14", at: AK.stairs, face: "sw" }, { fade: "in", ms: 400 }],
    else: [{ sfx: "steps_metal" }, { goto: "kessel_14", at: AK.stairs, face: "sw" }] }];

  Cutaway.room("kessel_14", {
    name: "Vierzehnter Stock", background: "kessel_14_bg", size: /** @type {[number, number]} */ ([352, 180]),
    ambience: ["neon_buzz", "city_far"], music: { theme: "juno", intensity: 0.3 },
    walk: AK.walk, holes: AK.holes, props: AK.props,
    // the map's lamps (the bake's): the tube's green, the TV's blue from Frau Haldane's door
    // (the stairwell's cold light and the Lull light only bake the art: in the game they would dim whoever sits by them)
    light: { ambient: 0.78, color: "#e8f4ec",
      lamps: AK.lamps.filter((/** @type {any} */ l) => !["below", "lull"].includes(l.id)).map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {
      door_juno: { name: "Meine Tür", poly: AK.door_junoPoly, walkTo: AK.door_juno, face: "nw",
        look: "Meine Tür hat drei Schlösser, und zwei davon sind von mir. Die Kamera drüber auch.",
        use: [{ goto: "flat", at: AF.arrive, face: "se" }] },
      haldane: { name: "Frau Haldane", poly: AK.door_haldanePoly, walkTo: AK.haldane, face: "ne",
        look: ["Frau Haldane hat Doppelschicht. Sie schläft, wie andere Leute blinzeln.", "Hinter ihrem Ohr klebt das Lull-Pflaster. Vier Stunden wie zehn, sagt die Werbung."],
        use: "Ich lass sie schlafen.", talk: "Sie schläft. Und ihr Fernseher redet für zwei." },
      notes: { name: "Zettel", poly: AK.notesPoly, walkTo: AK.notes, face: "nw",
        look: ["Auf dem Zettel steht: WER KLAUT MEINE ZEITUNG?? Der ist von 14C.", "Darunter hat 14A mit Pfeil geschrieben: NIEMAND LIEST ZEITUNG.", "Auf dem vierzehnten ist Krieg, und das seit Wochen."] },
      floor_sign: { name: "14", poly: AK.floor_signPoly, walkTo: AK.stairs, face: "ne",
        look: "Das ist der vierzehnte Stock, und hier rauf kommt man nur zu Fuß." },
      lift: { name: "Aufzug", poly: AK.liftPoly, walkTo: AK.lift, face: "ne",
        look: "Auch hier oben steht am Aufzug OUT OF ORDER. Wenigstens ist er überall gleich kaputt.",
        use: "Ich drück trotzdem. Das Licht blinkt, sonst passiert nichts." },
      tube: { name: "Neonröhre", poly: AK.tubePoly, walkTo: AK.haldane, face: "ne",
        look: "Die Röhre stirbt seit Monaten. Zuständig ist keiner." },
      bags: { name: "Müllsäcke", poly: AK.bagsPoly, walkTo: AK.bags, face: "ne",
        look: "Der Müll steht an der Wand, hinter der keiner wohnt. Da stört er keinen. Abgeholt wird dienstags. Theoretisch." },
      corner_cam: { name: "Kamera", poly: AK.corner_camPoly, walkTo: AK.stairs, face: "ne",
        look: "Nagi·was Kamera, oben über der Treppe. Ich weiß genau, wie der Flur von da oben aussieht." },
      bench: { name: "Bank", poly: AK.benchPoly, walkTo: AK.motte, face: "ne", z: -1,
        look: ["Die Bank hat irgendwer hochgetragen und hier vergessen.", "Motte sitzt fast jeden Abend drauf."] },
      stairs: { name: "Treppe", poly: AK.railPoly, walkTo: AK.stairs, face: "se",
        look: "Von hier geht's vierzehn Stockwerke runter, zu Fuß.",
        // the first time down Motte calls her back: his question (kapitel0-design §6.2 step 14)
        use: [{ if: "!moth_met", then: [{ say: "motte", text: "Juno! Warte mal." }, { face: "sw" }, { dialog: "motte" }, { face: "se" }] },
          ...STAIRS_DOWN] },
    },
    enter: [{ if: "day=1", then: [{ once: ["Der Flur ist grün wie ein Aquarium, nur ohne Fische."] }] }],
  });

  Cutaway.room("kessel_lobby", {
    name: "Eingang", background: "kessel_lobby_bg", size: /** @type {[number, number]} */ ([352, 216]),
    ambience: ["city_far", { sfx: "rain_glass", gain: 0.5 }], music: { theme: "juno", intensity: 0.3 },
    walk: AL.walk, holes: AL.holes, props: AL.props,
    light: { ambient: 0.74, color: "#dce4f4", lamps: AL.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {
      stairs: { name: "Treppe", poly: AL.stairsPoly, walkTo: AL.stairs, face: "nw",
        look: ["Es geht vierzehn Stockwerke rauf.", "Ich zähl sie jedes Mal, damit ich weiß, wie weit es noch ist."],
        use: STAIRS_UP },
      lift: { name: "Aufzug", poly: AL.liftPoly, walkTo: AL.lift, face: "ne",
        look: ["Da steht OUT OF ORDER, seit ich denken kann.", "Angeblich fährt er dienstags. Ich hab's nie erlebt."],
        use: "Ich drück trotzdem. Das Licht blinkt, sonst passiert nichts." },
      poster: { name: "Plakat", poly: AL.posterPoly, walkTo: AL.poster, face: "ne",
        look: ["SLEPT WELL? NAGI·WA LISTENS.", "Ich hab schlecht geschlafen. Und ich hör auch zu, Nagi·wa, den ganzen Tag."] },
      mailboxes: { name: "Briefkästen", poly: AL.mailboxesPoly, walkTo: AL.mailboxes, face: "nw",
        look: [{ if: "!rent_notice", then: ["Aus meinem Briefkasten guckt was Rotes. Rot heißt nie was Gutes."], else: ["Mein Briefkasten. Die Mahnung hab ich. Mehr will ich heute nicht wissen."] }],
        use: [{ if: "!rent_notice", then: [{ set: "rent_notice" }, "Das ist eine Mietmahnung. In drei Tagen sind 900 Chits fällig.", "Davon sind 310 die Hüllenabgabe.",
          "Dreihundertzehn zahl ich für die Ringe über meinem Kopf, und bestellt hab ich die nie."], else: ["Er ist leer. Die Mahnung hab ich ja schon in der Tasche."] }] },
      board: { name: "Schwarzes Brett", poly: AL.boardPoly, walkTo: AL.board, face: "nw",
        look: ["Eine graue Katze wird vermisst, sie hört auf Kiki. Die Abreißzettel sind alle noch dran.", "Darunter hängt ein Zettel: Nachtschicht sucht Tagschicht für Zimmertausch."] },
      door: { name: "Haustür", poly: AL.doorPoly, walkTo: AL.door, face: "nw",
        look: "Draußen regnet's. Draußen regnet's immer.",
        use: [{ if: "!rent_notice", then: ["Erst schau ich noch nach der Post, wenn ich schon unten bin."],
          else: [{ goto: "kowalski", at: Nagiwa.at.kowalski.arrive, face: "se" }] }] },
      sign: { name: "Warnschild", poly: AL.signPoly, walkTo: AL.sign, face: "nw",
        look: "Vorsicht, nass. Das Schild steht seit Wochen hier. Der Boden ist seitdem nass." },
      flyers: { name: "Werbezettel", poly: AL.flyersPoly, walkTo: AL.mailboxes, face: "nw",
        look: ["Hier liegt hundertmal dieselbe Werbung auf dem Boden.", "Lull zum halben Preis. Schlaf besser, schlaf Nagi·wa."] },
    },
    enter: [{ if: "day=1", then: [{ once: ["Ich bin unten. Es riecht nach Regen und nach dem Müll von vierzehn Stockwerken."] }] }],
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
          { say: "motte", text: "Ich bin nicht müde." }, "Er schaut wieder auf sein Handheld. Aber die kleine Figur darauf bleibt stehen."] },
      ],
    },
  });
})();
