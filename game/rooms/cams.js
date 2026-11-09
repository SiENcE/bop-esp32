// Nagiwa: the cameras of the prologue (docs/kapitel0-design.md §3, §7.2). Each is a watched room: no
// Juno in it, the phosphor look as live post-effects over its baked picture, a microphone, lines in the
// audio bar with the speaker's name. Its display (OSD) and the implant's overlay: game/screens.js.
"use strict";

(function () {
Nagiwa.cams.cam03 = { id: "03", place: "OSTBRÜCKE", owner: "PUMPENVERWALTUNG OST", map: [64, 14] };
// cam04 is on Juno's map only once she knows Kessler is going to Yuen's (`if`)
Nagiwa.cams.cam04 = { id: "04", place: "IMBISS YUEN", owner: "YUEN'S, PRIVAT", map: [120, 62], if: "heard_yuens",
  linked: [{ evi: "froh" }, { say: "evi", text: "Verbunden! Hallo, Kamera vier." }] };          // what happens when it is linked (step 6)

/** The phosphor duotone (docs/style-guide.md §9), the same ten values as the art. */
Nagiwa.PHOSPHOR = ["#030a0a", "#071514", "#0c221f", "#12332d", "#1a483e", "#266252", "#388169", "#55a585", "#8acfae", "#d4f7e2"];
/** A camera that looks at a room painted for street mode (cam14) sees it brighter than Juno does: its sensor lifts the night before the ramp.
 * `{ exposure: k }` multiplies every colour by k. */
Cutaway.post.add("exposure", (px, o) => { const k = Number(o.exposure) || 1, d = px.data; for (let i = 0; i < d.length; i += 4) { d[i] *= k; d[i + 1] *= k; d[i + 2] *= k; } });
/** The feeds' live artefacts: grain, the ramp, scanlines, a rolling band, the lens's dark corners. */
Nagiwa.FEED_POST = [
  { noise: 0.035 },
  { palette: Nagiwa.PHOSPHOR, dither: 0.6 },
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
Nagiwa.osd = {
  rewind: [172, 13, 40, 10], rec: [214, 13, 24, 10], wait: [240, 13, 26, 10], back: [268, 13, 48, 10],
  /** @param {number} i */
  thumb: (i) => [4 + Math.floor(i / 8) * 36, 42 + (i % 8) * 13, 34, 10],      // two columns: eight rows reach down to where the bag's bar begins
};

Nagiwa.camRoom = function (id, o) {
  const O = Nagiwa.osd;
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
  Cutaway.room(id, { name: `CAM ${Nagiwa.cams[id].id}`, background: `${id}_bg`, observe: true, feed: id,
    post: Nagiwa.FEED_POST, lines: "bottom", label: true, ambience: ["feed_hiss", "feed_rain", "city_far"],
    music: { theme: "glass", intensity: 0.2 }, ...o, hotspots,
    // REC belongs to the camera it was pressed on: leaving it stops the recording (kapitel0-design §3)
    enter: [{ unset: "rec_on" }, ...(o.enter ?? [])] });
};

/** The strip of cameras, in every camera's room: once all of them are known (game.js), so a chapter's cameras are in the prologue's rooms too.
 *  A linked camera switches to it; one whose code Juno knows but hasn't used yet is in the strip too, greyed, and a click links it
 *  there as on the deck's map (the user's wish, 2026-11-09: no going back to the deck for it). */
Nagiwa.buildCamStrip = function () {
  const ids = Object.keys(Nagiwa.cams);
  for (const id of ids) {
    const room = Cutaway.room.get(id);
    ids.forEach((c, i) => {
      const cam = /** @type {any} */ (Nagiwa.cams[c]);
      if (c !== id) room.hotspots[`thumb_${c}`] = { name: `CAM ${cam.id}`, rect: Nagiwa.osd.thumb(i), z: 5,
        if: [{ or: [`link_${c}`, `code_${c}`] }, ...(cam.if ? [cam.if] : []), ...(room.strip ? [room.strip] : [])],
        use: [{ if: `link_${c}`, then: [{ goto: c }], else: [{ set: `link_${c}` }, { sfx: "link" }, ...(cam.linked ?? ["Wartungscode rein. Verbunden."])] }] };
    });
  }
};

const A3 = Nagiwa.at.cam03, A4 = Nagiwa.at.cam04;

Nagiwa.camRoom("cam03", {
  mic: { at: A3.mic, clear: 40, lost: 150 },
  hotspots: {
    mast: { name: "Kamera am Mast", poly: A3.mastPoly, if: "day=1",
      look: "Gegenüber, am Mast: noch eine Kamera. Zeigt auf die Ecke bei Yuen's.",
      use: [{ zoom: "zoom_sticker_cam04" }, "HCS-04. K7-731.", "Der Wartungscode, auf das Gehäuse geklebt. Nagi·wa spart an allem.", { zoom: false }, { set: "code_cam04" }] },
    vending: { name: "Nudelautomat", poly: A3.vendingPoly, z: 1,
      look: "Ein Nudelautomat. Halb die Pumpenverwaltung isst daraus.", use: [{ zoom: "zoom_vending_n7" }, "Nummer 7, Huhn scharf. Die Taste ist abgegriffen.", { zoom: false }] },
    office: { name: "Pumpenverwaltung Ost", poly: A3.officeDoorPoly, look: "Die Pumpenverwaltung. Um zehn ist Schichtende." },
    rewind: { name: "Puffer", z: 5, if: ["call_missed", "!heard_yuens"],
      use: ["Puffer. Zurück auf 22:05.", { tag: "kessler" }, "Da. Heller Schal, unterm Vordach.",
        "Die Klammern macht nicht das Deck, die macht mein Implantat.", "Das durften wir behalten, damals. Sie sagten, das Herausnehmen kostet mehr.", { say: "kessler", text: "Ja, ich bring's mit. Alles. Halb elf, bei Yuen's." }, { set: "heard_yuens" },
        "Yuen's. Der Imbiss an der Ecke."] },
  },
});

Nagiwa.camRoom("cam04", {
  ambience: ["feed_hiss", "fridge_hum", { sfx: "feed_rain", gain: 0.4 }],      // inside Yuen's: the kitchen, the rain beyond the window
  mic: { at: A4.mic, clear: 20, lost: 80 },
  hotspots: {
    tv: { name: "Fernseher", poly: A4.tvPoly, look: "Nagi·wa-Werbung. Eine Frau schläft und lächelt dabei. SLEEP BETTER." },
    counter: { name: "Theke", poly: A4.counterPoly, look: "Yuen's. Nudeln, Tee, und keine Fragen." },
    rewind: { name: "Puffer", z: 5, if: ["moment:kessler_ring", "!cache_clip_kessler_ring"],
      use: ["Puffer. Zurück auf 22:35.", { zoom: "zoom_ring" }, "Da. Er zieht den Ring ab und schiebt ihn rüber.",
        { cache: "clip_kessler_ring" }, { zoom: false }, { set: "saw_varga" }, { cache: "note_kessler_debt" },
        "Hab's. Und der im grauen Mantel ist kein Liebhaber. Das ist Gus Varga. Geld gegen Zeit."] },
  },
});
})();
