// Halcyon: Kowalski Street (kapitel0-design §6.2 steps 16-17, §7.1), the street outside the Kessel Block, baked
// from its map (art/rooms/kowalski.map.js); 416 px wide, it scrolls. The Kessel Block's door back in, LUCKY
// STATIC (the bar, enterable in Chapter 1), Bao's cart under its umbrella, the noodle machine, the big broken
// ad screen (the prologue ends there: JUNO.), the alley down to the Drain Market (shut tonight), the bins.
"use strict";

(function () {
  const AW = Halcyon.at.kowalski, AL = Halcyon.at.kessel_lobby;

  // Step 17 (kapitel0-design §6.2): after the meal the broken screen over the street stutters, the eye in its
  // static turns to Juno, JUNO. over the whole screen (the stinger "witness"); then the advert again. Only the
  // stutter is on the screen: the eye and the word are in Juno's eye (story §10a), the implant's brackets round
  // them say so, and she says it. Bao saw nothing; EVI, very quietly, from the bag. Step 18: the fade, the card
  // for Chapter 1.
  const JUNO = [
    { wait: 900 }, { camera: [80, 0], ms: 1400 },
    { show: "ad_fx" }, { play: "ad_fx", anim: "kowalski_ad_stutter", loop: true, wait: false }, { sfx: "glitch" },
    { wait: 1400 }, "Was ...",
    { implant_mark: AW.adMark }, { play: "ad_fx", anim: "kowalski_ad_eye" },
    { stinger: "witness" }, { play: "ad_fx", anim: "kowalski_ad_juno", loop: true, wait: false }, { sfx: "static" },
    { wait: 2600 },
    { implant_mark: false }, { play: "ad_fx", anim: "kowalski_ad_stutter", loop: true, wait: false }, { wait: 500 }, { hide: "ad_fx" }, { wait: 700 },
    "Bao. Hast du ...", { say: "bao", text: "Hm? Noch Brühe?" }, "... nichts. Schon gut.",
    { wait: 400 }, "Das war nicht auf dem Schirm. Das war in meinem Auge.",
    { wait: 500 }, { evi: "besorgt" }, { say: "evi", text: "Das war nicht ich. Ehrlich." },
    { wait: 800 }, { camera: "follow" },
    // the night isn't over yet: Juno takes the soup home, eats it there and goes to bed, and sleeping goes on into Chapter 1 (game/prolog.js)
    { evi: "muede" }, { say: "evi", text: "Es wird langsam spät, Juno. Und deine Suppe wird kalt." }, "Ich geh ja schon."
  ];
  // Step 16 (kapitel0-design §6.2): "Wie immer? Ich schreib's an." With money Juno may pay cash (bao_paid);
  // Bao is glad and writes it down all the same. She takes the broth home (bao_soup, the item suppe), and step 17 follows.
  const EAT = [
    { say: "bao", text: "Kommt sofort." }, { wait: 600 },
    { say: "bao", text: "Mein Alter sagt, ich salz zu viel. Lou isst seit vierzig Jahren hier." },
    "Und hat er recht?",
    { say: "bao", text: "Er hat nie recht. Darum ist er mein Alter." },
    "Zum Mitnehmen heute, Bao. Ich ess oben.", { say: "bao", text: "Oben! Da wird sie kalt." },
    { say: "bao", text: "Deckel drauf. Die Schale bringst du mir morgen." }, { give: "suppe" }, { set: "bao_soup" },
  ];
  // talking to Bao (or using his cart): his dialogue, and once Juno has her broth, the moment (a script of the
  // street's own, so it may play the screen's prop)
  const BAO = [{ if: "!bao_soup", then: [{ dialog: "bao" }, { if: "bao_soup", then: JUNO }],
    else: [{ say: "bao", text: "Ab nach oben mit dir. Die Brühe wird kalt." }] }];
  const LOOK = {
    background: "kowalski_bg", size: /** @type {[number, number]} */ ([416, 180]),
    // the props, and over the ad screen the prologue's moment (hidden until it comes: step 17)
    props: [...AW.props, { id: "ad_fx", image: "kowalski_ad_stutter", at: [AW.adRect[0], AW.adRect[1]], anchor: [0, 0], baseline: 0, hidden: true }],
    // the map's lamps: the bar's warm light, its sign's magenta, the screen's cyan, the machine, the lantern
    light: { ambient: 0.8, color: "#d4dcf4", lamps: AW.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    // the rain in two layers (far and dim, near and bright), the light hanging in it, glints, drops
    // (the steam and the splashes are in the picture)
    fx: [
      { kind: "rain", rect: [0, 0, 416, 180], count: 70, color: "#41547a", speed: 140, slant: 0.3, length: 3 },
      { kind: "rain", rect: [0, 0, 416, 180], count: 55, color: "#6c809a", speed: 210, slant: 0.3, length: 5 },
      { kind: "haze", poly: AW.hazeDoor, color: "#ffd58a", alpha: 0.1, fade: 0.4 },
      { kind: "haze", poly: AW.hazeAd, color: "#62def0", alpha: 0.07, fade: 0.4, lamp: "ad" },
      { kind: "sparkle", points: AW.glints, every: 2600, color: "#dafcff" },
      ...AW.drips.map((/** @type {number[]} */ [x, y, to], /** @type {number} */ i) => ({ kind: "drip", at: [x, y], to, every: 1300 + i * 470, color: "#6c809a" })),
    ],
  };

  Cutaway.room("kowalski", {
    name: "Kowalski-Straße", ...LOOK,
    ambience: ["city_far", "neon_buzz", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.4 },
    walk: AW.walk, holes: AW.holes,
    hotspots: {
      kessel_door: { name: "Haustür", rect: AW.kessel_doorRect, walkTo: AW.kessel_door, face: "nw",
        look: "Der Kessel-Block. Vierzehn Stockwerke, und ganz oben wohn ich.",
        use: [{ goto: "kessel_lobby", at: AL.street, face: "se" }] },
      lucky: { name: "LUCKY STATIC", rect: AW.lucky_windowRect, walkTo: AW.lucky, face: "nw",
        look: ["Das LUCKY STATIC. Mei lässt mich anschreiben, wenn Bao nicht da ist.", "Drinnen sitzen die üblichen zwei. Die sitzen da seit der Flut."] },
      lucky_door: { name: "Eingang", rect: AW.lucky_doorRect, walkTo: AW.lucky_door, face: "nw",
        look: "Es riecht nach Brühe und nach altem Bier.",
        use: "Nicht heute. Heute will ich Bao." },
      lucky_sign: { name: "Leuchtschrift", rect: AW.lucky_signRect, walkTo: AW.lucky, face: "nw",
        look: "LUCKY STATIC. Das Y flackert, seit ich hier wohne. Mei sagt, das ist das Glück." },
      vending: { name: "Nudelautomat", poly: AW.vendingPoly, walkTo: AW.vending, face: "ne",
        look: ["Der Nudelautomat. Er hat ein Gesicht. Heute ist es müde.", "Die zweite Reihe ist ausverkauft. Seit Wochen."],
        use: "Er nimmt keine Chits von mir. Wir hatten einen Streit." },
      scaffold: { name: "Gerüst", poly: AW.scaffoldPoly, walkTo: AW.scaffold, face: "ne", look: "Gerüst, Kocher, Schlafsack. Wer da wohnt, kriegt keine Mahnung." },
      ad: { name: "Werbebildschirm", rect: AW.adRect, walkTo: AW.ad, face: "ne",
        look: ["HALCYON. SLEEP BETTER.", "Die Hälfte vom Bildschirm ist kaputt. Die bessere Hälfte."] },
      alley: { name: "Gasse", rect: AW.alleyRect, walkTo: AW.alley, face: "ne",
        look: [{ if: "day=1", then: ["Da runter geht's zum Drain-Markt. Das Gitter ist zu."], else: ["Die Gasse. Da runter geht's zum Drain-Markt, und zum Waschsalon."] }],
        use: [{ if: "day=1", then: ["Nicht heute Nacht."], else: [{ goto: "gasse", at: Halcyon.at.gasse.arrive, face: "se" }] }] },
      bins: { name: "Mülltonne", poly: AW.binsPoly, walkTo: AW.bins, face: "ne",
        look: "Die Tonne ist so voll, dass der Deckel auf einem Sack steht." },
      bao: { name: "Bao", rect: AW.baoRect, walkTo: AW.eat, face: "ne", z: 2,
        look: ["Bao. Über siebzig, und sein Topf ist älter als ich.", "Das Ding am Ohr ist sein Hörgerät. Er hört trotzdem nur, was er will."],
        talk: BAO },
      cart: { name: "Baos Garküche", poly: AW.cartPoly, walkTo: AW.eat, face: "ne",
        look: ["Baos Garküche. Der Topf dampft, seit ich denken kann.", "BAO steht drauf. Für den Fall, dass jemand fragt."],
        use: BAO },
    },
    enter: [{ if: "day=1", then: [{ once: ["Draußen. Regen, Neon und Brühe. Die Kowalski-Straße."] }] }],
  });

  Cutaway.dialog("bao", {
    main: {
      enter: [{ say: "bao", text: "Juno! Wie immer? Ich schreib's an." }],
      choices: [
        { text: "„Wie immer.“", goto: "end", then: EAT },
        { text: "„Heute zahl ich bar.“", if: "chits>=8", goto: "end", then: [{ inc: "chits", by: -8 }, { set: "bao_paid" },
          { say: "bao", text: "Bar! Das glaubt mir mein Alter nie." }, { say: "bao", text: "Ich schreib's trotzdem an. Sonst weiß ich ja nicht, dass du da warst." }, ...EAT] },
        { text: "„Was gibt's heute?“", then: [{ say: "bao", text: "Brühe. Wie gestern. Morgen auch. Darum heißt es ja: wie immer." }], goto: "main" },
      ],
    },
  });
})();
