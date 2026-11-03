// Halcyon: the hint button's hints for the prologue (docs/kapitel0-design.md §6.5). The first whose `if`
// holds is the one for now; each ask shows the next, plainer line. `about`: what is still needed
// (solve.mjs --full checks both).
"use strict";

Cutaway.hints([
  { if: "!visited:deck", about: "deck",
    text: ["Frau Kesslers Auftrag wartet.", "Der Auftrag ist auf dem Deck.", "Benutze das Deck."] },
  { if: ["!heard_yuens", "!call_missed", "time<22:00"], about: ["cam_cam03", "wait"],
    text: ["Kessler hat um zehn Schichtende.", "CAM 03 zeigt die Pumpenverwaltung.", "Öffne CAM 03 und spul vor bis 22:00."] },
  { if: ["!heard_yuens", "!call_missed", "!tag_kessler"], about: ["kessler", "rewind", "cam_cam03"],
    text: ["Frau Kessler hat ein Foto geschickt. Was trägt er darauf?", "Im Feed ist alles grün. Aber ein heller Schal bleibt hell.", "Markiere den Mann mit dem hellen Schal."] },
  { if: ["call_missed", "!heard_yuens"], about: ["rewind", "cam_cam03"],
    text: ["Du hast sein Telefonat verpasst.", "Die Kameras behalten die ganze Nacht.", "Drück PUFFER auf CAM 03."] },
  { if: ["heard_yuens", "!code_cam04"], about: ["mast", "cam_cam03"],
    text: ["Wie kommst du an die Kamera bei Yuen's?", "Kameras haben Wartungsaufkleber. Siehst du eine?", "Zoome auf CAM 03 auf die Kamera am Mast gegenüber."] },
  { if: ["code_cam04", "!link_cam04"], about: ["cam_cam04", "back"],
    text: ["Du hast den Wartungscode.", "Auf der Netzkarte im Deck ist jetzt CAM 04.", "Klick auf dem Deck CAM 04 an."] },
  { if: ["link_cam04", "!moment:kessler_ring"], about: ["cam_cam04", "thumb_cam04", "rec", "wait"],
    text: ["Halb elf, bei Yuen's.", "Schau auf CAM 04, wenn es so weit ist. Und nimm es auf.", "Öffne CAM 04, drück REC und spul vor bis 22:30."] },
  { if: ["moment:kessler_ring", "!cache_clip_kessler_ring"], about: ["rewind", "cam_cam04", "thumb_cam04"],
    text: ["Der Ring. Hast du ihn aufgenommen?", "Die Kameras behalten die ganze Nacht.", "Drück PUFFER auf CAM 04."] },
  { if: ["cache_clip_kessler_ring", "!p1"], about: ["mail_kessler", "back", "deck"],
    text: ["Frau Kessler wartet auf eine Antwort.", "Ihre Nachricht ist auf dem Deck.", "Antworte ihr. Die Wahl ist deine."] },
  { if: ["p1", "!fridge_empty"], about: ["fridge", "close", "back"],
    text: ["Juno hat seit Stunden nichts gegessen.", "Was ist im Kühlschrank?", "Schau in den Kühlschrank."] },
  { if: "fridge_empty", about: "door",
    text: ["Der Kühlschrank ist leer.", "Bao hat immer was.", "Geh durch die Tür."] },
]);
