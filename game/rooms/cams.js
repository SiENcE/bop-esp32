// Halcyon: the cameras of the prologue (docs/kapitel0-design.md §3, §7.2). Each is a watched room: no
// Juno in it, the phosphor look as live post-effects over its baked picture, a microphone, lines in the
// audio bar with the speaker's name. Its display (OSD) and the implant's overlay: game/screens.js.
"use strict";

(function () {
Halcyon.cams.cam03 = { id: "03", place: "OSTBRÜCKE", owner: "PUMPENVERWALTUNG OST", map: [54, 30] };
// cam04 is on Juno's map only once she knows Kessler is going to Yuen's (`if`)
Halcyon.cams.cam04 = { id: "04", place: "IMBISS YUEN", owner: "YUEN'S, PRIVAT", map: [156, 76], if: "heard_yuens",
  linked: [{ evi: "froh" }, { say: "evi", text: "Verbunden! Hallo, Kamera vier." }] };          // what happens when it is linked (step 6)

/** The phosphor duotone (docs/style-guide.md §9), the same ten values as the art. */
Halcyon.PHOSPHOR = ["#030a0a", "#071514", "#0c221f", "#12332d", "#1a483e", "#266252", "#388169", "#55a585", "#8acfae", "#d4f7e2"];
/** The feeds' live artefacts: grain, the ramp, scanlines, a rolling band, the lens's dark corners. */
Halcyon.FEED_POST = [
  { noise: 0.035 },
  { palette: Halcyon.PHOSPHOR, dither: 0.6 },
  { scanlines: 2, amount: 0.1 },
  { roll: { speed: 24, height: 9, amount: 0.14 } },
  { vignette: 0.2 },
];

/**
 * A camera's room: the OSD's buttons as hotspots (REC, wait, back to the deck) and the strip of linked
 * cameras, plus its own hotspots.
 * @param {string} id @param {Record<string, any>} o
 */
/** Where the display's buttons and camera column are (screens.js draws them there). */
Halcyon.osd = {
  rewind: [172, 13, 40, 10], rec: [214, 13, 24, 10], wait: [240, 13, 26, 10], back: [268, 13, 48, 10],
  /** @param {number} i */
  thumb: (i) => [4, 42 + i * 13, 34, 10],
};

Halcyon.camRoom = function (id, o) {
  const O = Halcyon.osd;
  /** @type {Record<string, any>} */
  const hotspots = {
    // (only where something can be recorded, `rec`: else every state in a camera would come twice, REC on and off)
    rec: { name: "REC", rect: O.rec, z: 5, if: o.rec ?? "day=1",
      use: [{ sfx: "rec" }, { if: "rec_on", then: [{ unset: "rec_on" }, "Aufnahme aus."], else: [{ set: "rec_on" }, "Aufnahme läuft."] }] },
    wait: { name: "Vorspulen", rect: O.wait, z: 5, use: [{ forward: true }] },
    back: { name: "Deck", rect: O.back, z: 5, exit: { to: "deck" } },
    ...o.hotspots,
  };
  if (hotspots.rewind) hotspots.rewind.rect = O.rewind;
  Object.keys(Halcyon.cams).forEach((c, i) => {
    if (c === id) return;
    hotspots[`thumb_${c}`] = { name: `CAM ${Halcyon.cams[c].id}`, rect: O.thumb(i), z: 5, if: [`link_${c}`, ...(Halcyon.cams[c].if ? [Halcyon.cams[c].if] : [])], use: [{ goto: c }] };
  });
  Cutaway.room(id, { name: `CAM ${Halcyon.cams[id].id}`, background: `${id}_bg`, observe: true, feed: id,
    post: Halcyon.FEED_POST, lines: "bottom", label: true, ambience: ["feed_hiss", "feed_rain", "city_far"],
    music: { theme: "glass", intensity: 0.2 }, ...o, hotspots,
    // REC belongs to the camera it was pressed on: leaving it stops the recording (kapitel0-design §3)
    enter: [{ unset: "rec_on" }, ...(o.enter ?? [])] });
};

const A3 = Halcyon.at.cam03, A4 = Halcyon.at.cam04;

Halcyon.camRoom("cam03", {
  mic: { at: A3.mic, clear: 40, lost: 150 },
  hotspots: {
    mast: { name: "Kamera am Mast", rect: A3.mast, if: "day=1",
      look: "Gegenüber, am Mast: noch eine Kamera. Zeigt auf die Ecke bei Yuen's.",
      use: [{ zoom: "zoom_sticker_cam04" }, "HCS-04. K7-731.", "Der Wartungscode, auf das Gehäuse geklebt. Halcyon spart an allem.", { zoom: false }, { set: "code_cam04" }] },
    vending: { name: "Nudelautomat", rect: A3.vending,
      look: "Ein Nudelautomat. Halb die Pumpenverwaltung isst daraus.", use: [{ zoom: "zoom_vending_n7" }, "Nummer 7, Huhn scharf. Die Taste ist abgegriffen.", { zoom: false }] },
    office: { name: "Pumpenverwaltung Ost", rect: A3.officeDoor, look: "Die Pumpenverwaltung. Um zehn ist Schichtende." },
    rewind: { name: "Puffer", z: 5, if: ["call_missed", "!heard_yuens"],
      use: ["Puffer. Zurück auf 22:05.", { tag: "kessler" }, "Da. Heller Schal, unterm Vordach.",
        "Die Klammern macht nicht das Deck, die macht mein Implantat.", "Das durften wir behalten, damals. Sie sagten, das Herausnehmen kostet mehr.", { say: "kessler", text: "Ja, ich bring's mit. Alles. Halb elf, bei Yuen's." }, { set: "heard_yuens" },
        "Yuen's. Der Imbiss an der Ecke."] },
  },
});

Halcyon.camRoom("cam04", {
  ambience: ["feed_hiss", "fridge_hum", { sfx: "feed_rain", gain: 0.4 }],      // inside Yuen's: the kitchen, the rain beyond the window
  mic: { at: A4.mic, clear: 20, lost: 80 },
  hotspots: {
    tv: { name: "Fernseher", rect: A4.tv, look: "Halcyon-Werbung. Eine Frau schläft und lächelt dabei. SLEEP BETTER." },
    counter: { name: "Theke", rect: A4.counterBox, look: "Yuen's. Nudeln, Tee, und keine Fragen." },
    rewind: { name: "Puffer", z: 5, if: ["moment:kessler_ring", "!cache_clip_kessler_ring"],
      use: ["Puffer. Zurück auf 22:35.", { zoom: "zoom_ring" }, "Da. Er zieht den Ring ab und schiebt ihn rüber.",
        { cache: "clip_kessler_ring" }, { zoom: false }, { set: "saw_varga" }, { cache: "note_kessler_debt" },
        "Hab's. Und der im grauen Mantel ist kein Liebhaber. Das ist Gus Varga. Geld gegen Zeit."] },
  },
});
})();
