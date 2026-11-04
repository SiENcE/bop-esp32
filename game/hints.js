// Halcyon: the hint button's hints for the prologue (docs/kapitel0-design.md §6.5), in EVI's voice: she says
// them (game/evi.js: Cutaway.hints.configure({ by: "evi" })), clear about data, a little lost about people. The first whose `if`
// holds is the one for now; each ask shows the next, plainer line. `about`: what is still needed
// (solve.mjs --full checks both).
"use strict";

Cutaway.hints([
  { if: "!visited:deck", about: ["deck", "app_chat"],
    text: ["Juno! Frau Kessler hat einen Auftrag für dich.", "Der Auftrag ist auf mir. Auf dem Deck, meine ich.", "Setz dich ans Deck."] },
  { if: ["!read_kessler"], about: ["app_chat", "contact_kessler"],
    text: ["Du hast eine ungelesene Nachricht. Eine!", "Sie ist im CHAT. Von M. Kessler.", "Öffne CHAT und klick M. KESSLER an."] },
  { if: ["!heard_yuens", "!call_missed", "time<22:00"], about: ["app_glas", "cam_cam03", "wait"],
    text: ["Herr Kessler hat um 22:00 Schichtende. Das steht in der Nachricht.", "Meine CAM 03 zeigt die Pumpenverwaltung.", "Öffne GLAS, dann CAM 03, und spul vor bis 22:00."] },
  { if: ["!heard_yuens", "!call_missed", "!tag_kessler"], about: ["kessler", "rewind", "app_glas", "cam_cam03"],
    text: ["Frau Kessler hat ein Foto geschickt. Das hellste Pixel darauf ist der Schal.", "Im Feed ist alles grün. Der Schal bleibt trotzdem der hellste.", "Markier den Mann mit dem hellen Schal."] },
  { if: ["call_missed", "!heard_yuens"], about: ["rewind", "app_glas", "cam_cam03"],
    text: ["Er hat telefoniert, und du hast es verpasst. Ich hab es aber.", "Die Kameras behalten die ganze Nacht. Das heißt Puffer.", "Drück PUFFER auf CAM 03."] },
  { if: ["heard_yuens", "!code_cam04"], about: ["mast", "app_glas", "cam_cam03"],
    text: ["Bei Yuen's hängt eine Kamera. Ich hab keinen Zugang.", "Kameras tragen ihren Wartungscode auf dem Gehäuse. Gegenüber hängt eine.", "Zoom auf CAM 03 auf die Kamera am Mast gegenüber."] },
  { if: ["code_cam04", "!link_cam04"], about: ["app_glas", "cam_cam04", "back"],
    text: ["Du hast den Code! Ich will die Kamera.", "In GLAS ist jetzt CAM 04. Sie ist noch grau.", "Öffne GLAS und klick CAM 04 an."] },
  { if: ["link_cam04", "!moment:kessler_ring"], about: ["app_glas", "cam_cam04", "thumb_cam04", "rec", "wait"],
    text: ["Halb elf, bei Yuen's. Das ist 22:30.", "Schau auf CAM 04, wenn es so weit ist. Und nimm es auf.", "Öffne CAM 04, drück REC und spul vor bis 22:30."] },
  { if: ["moment:kessler_ring", "!cache_clip_kessler_ring"], about: ["rewind", "app_glas", "cam_cam04", "thumb_cam04"],
    text: ["Der Ring. Hast du ihn aufgenommen? Ich glaube nicht.", "Die Kameras behalten die ganze Nacht. Der Puffer!", "Drück PUFFER auf CAM 04."] },
  { if: ["cache_clip_kessler_ring", "!p1"], about: ["reply_kessler_full", "reply_kessler_cut", "reply_kessler_nothing", "contact_kessler", "app_chat", "back", "deck"],
    text: ["Frau Kessler wartet. Sie ist online.", "Ihre Nachricht ist im CHAT. Die Antwort auch.", "Antworte ihr. Welche Antwort, weiß ich nicht. Das weißt du."] },
  { if: ["p1", "!fridge_empty"], about: ["fridge", "close", "back"],
    text: ["Du hast seit Stunden nichts gegessen. Ich zähle mit.", "Im Kühlschrank ist vielleicht etwas.", "Schau in den Kühlschrank."] },
  { if: ["fridge_empty", "!visited:kessel_14"], about: "door",
    text: ["Der Kühlschrank ist leer. Ich hab es gehört.", "Bao hat immer was.", "Geh durch die Tür."] },
  { if: ["visited:kessel_lobby", "!rent_notice"], about: ["mailboxes", "stairs", "door"],
    text: ["Aus deinem Briefkasten guckt was. Ich seh es von hier. Mit deinen Augen.", "Die Briefkästen sind links an der Wand.", "Schau in deinen Briefkasten."] },
  { if: "rent_notice", about: ["door", "stairs"],
    text: ["Bao ist draußen. Draußen ist hinter der Haustür.", "Die Haustür ist links, die aus Glas.", "Geh durch die Haustür raus."] },
  { if: ["fridge_empty", "visited:kessel_14"], about: ["stairs", "door"],
    text: ["Bao ist unten auf der Straße. Unten ist da, wo die Treppe hingeht.", "Die Treppe ist rechts, hinter dem Geländer.", "Geh die Treppe runter."] },
]);
