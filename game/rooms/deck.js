// Halcyon: Juno's deck (docs/kapitel0-design.md §2). A watched room without a picture of its own: the
// screen is drawn by game/screens.js, the hotspots sit where it draws things. In the prologue it shows
// everything at once: the map of the quarter with its cameras, the messages, the cache, the Kassenbuch.
"use strict";

Halcyon.deckLayout = {
  map: [4, 18, 150, 142],                 // the map's panel [x, y, w, h]
  side: 162,                              // where the right column (messages, cache, Kassenbuch) starts
  streets: [[10, 60, 138, 3], [10, 112, 138, 3], [60, 24, 3, 130], [118, 24, 3, 130]],
  mails: [
    { id: "kessler", from: "M. KESSLER", subject: "Mein Mann" },
    { id: "sable", from: "SABLE", subject: "Ruhige Nacht?", if: "p1" },
  ],
};

(function () {
  const D = Halcyon.deckLayout, W = 320;
  /** @type {Record<string, any>} */
  const hotspots = {};
  for (const [id, cam] of Object.entries(Halcyon.cams)) {
    const [x, y] = cam.map;
    hotspots[`cam_${id}`] = {
      name: `CAM ${cam.id}`, rect: [x - 4, y - 4, 40, 18], ...(cam.if ? { if: cam.if } : {}),
      look: `CAM ${cam.id}, ${cam.place}.`,
      use: [{ if: `link_${id}`, then: [{ goto: id }],
        else: [{ if: `code_${id}`, then: [{ set: `link_${id}` }, "Wartungscode rein. Verbunden."],
          else: ["Kein Zugang. Ich brauch den Wartungscode der Kamera."] }] }],
    };
  }
  D.mails.forEach((m, i) => {
    hotspots[`mail_${m.id}`] = { name: `${m.from}: ${m.subject}`, rect: [D.side - 2, 28 + i * 12, W - D.side - 2, 11],
      ...(m.if ? { if: m.if } : {}), use: [{ set: `read_${m.id}` }, { dialog: `mail_${m.id}` }], look: "Eine Nachricht." };
  });
  hotspots.wait = { name: "Warten", rect: [4, 165, 58, 11], use: [{ if: "time<22:00", then: ["Bis zehn passiert da nichts."] }, { time: "next" }] };
  hotspots.close = { name: "Zurück", rect: [70, 165, 58, 11], exit: { to: "flat", at: Halcyon.at.flat.deck, face: "ne" } };

  Cutaway.room("deck", { name: "Deck", color: "#131a2a", observe: true, deck: true, hotspots });
})();
