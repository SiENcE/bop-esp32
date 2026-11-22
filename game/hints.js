// Nagiwa: the hint button's hints for the prologue (docs/kapitel0-design.md §6.5), in EVI's voice: she says
// them (game/evi.js: Cutaway.hints.configure({ by: "evi" })), clear about data, a little lost about people. The first whose `if`
// holds is the one for now; each ask shows the next, plainer line. `about`: what is still needed
// (solve.mjs --full checks both).
"use strict";

// The same list for the prologue and Chapter 1, each its act's own (later chapters have theirs). Chapter 1 comes first: on its
// days one of these always holds, so the prologue's below don't speak there
(function () {
const HOME = ["door", "door_juno", "stairs", "kessel_door", "deck", "back"];       // the way back to the deck
const HINTS = [
  { if: "end_beat=threat",
    text: ["Ich hab nichts. Keine Tür, kein Licht, keine Nummer.", "Ich such weiter. Ich find nichts, was geht.", "Du kannst nichts tun, Juno. Ich auch nicht."] },
  // job A speaks only when Ines has gone home and before Kessler has gone to bed: nothing of it is needed, so they have no `about`, and
  // the rest of the evening belongs to WREN's hints
  ...[
    [["!varga_step"], ["Kessler versteckt sich. Aber Gewohnheiten versteckt man schlecht.", "Was hat Frau Kessler über sein Essen geschrieben?", "Zoom um 22:15 auf den Nudelautomaten in CAM 03. Wer zieht die Nummer 7?"]],
    [["varga_step", "!code_cam15"], ["Das Kapselhotel hat ein eigenes Netz.", "Wer verkauft Zugänge?", "Kauf Sable den Code zu CAM 15 ab. Der Vorhang auf dem Drain-Markt."]],
    [["code_cam15", "!link_cam15"], ["Du hast den Code vom Morpheus. Ich will die Kamera.", "In GLASS ist jetzt CAM 15.", "Öffne GLASS und klick CAM 15 an."]],
    [["link_cam15", "!cache_note_kessler_hideout"], ["Er kommt um halb elf ins Morpheus.", "Schau zu, welche Kapsel er nimmt. Sonst hat der Puffer es.", "Öffne CAM 15 um 22:30 und klick ihn an."]],
    [["cache_note_kessler_hideout", "!k1a"], ["Du weißt, wo er ist. Varga will das auch wissen.", "Varga ist im CHAT. Kapsel 23 hat einen Bildschirm.", "Antworte Varga, oder schreib auf den Bildschirm. Was davon, weiß ich nicht. Das weißt du."]],
  ].map(([when, text]) => ({ if: ["day>1", "day<4", "time>=20:30", "time<22:45", "!off_varga", ...when], text })),
  // job B speaks from a quarter to eleven, when job A has done (Okonkwo opens his safe at one): nothing of it is needed either
  ...[
    [["!got_tap", "!link_cam07v"], ["Okonkwo macht um eins seinen Tresor auf. TIDE will den Code.", "Von oben ist das Display seiner Kasse zu klein. Der Automat gegenüber schaut auf Augenhöhe.", "Kauf bei Ratz auf dem Drain-Markt einen Abzweiger."]],
    [["got_tap", "!link_cam07v"], ["Du hast einen Abzweiger! Ich will wissen, wofür.", "Der Automat in der Jade Row hat eine kleine Kamera.", "Benutz den Abzweiger am Automaten gegenüber von Okonkwos Laden."]],
    [["link_cam07v", "!cache_note_safe_code", "time<01:15"], ["Um eins macht er den Tresor auf.", "CAM 07V sieht das Display seiner Kasse.", "Öffne CAM 07V, spul vor bis 01:00 und klick ihn an."]],
    [["link_cam07v", "!cache_note_safe_code", "time>=01:15"], ["Er hat den Tresor schon auf- und zugemacht. Ich hab es aber.", "Die Kameras behalten die ganze Nacht.", "Öffne CAM 07V und drück PUFFER."]],
    [["cache_note_safe_code"], ["Du hast den Code. TIDE will ihn auch.", "TIDE ist im CHAT. Okonkwo ist in seinem Laden, bis eins.", "Antworte TIDE, oder geh zu Okonkwo. Was davon, weiß ich nicht. Das weißt du."]],
  ].map(([when, text]) => ({ if: ["day>1", "day<4", "time>=22:45", "!off_tide", "!k1b", ...when], text })),
  { if: ["day=3", "moment:ines_tide", "!know_meeting"], about: ["cam_cam30", "rewind", "app_glas", ...HOME],
    text: ["Ines war am Sumpf-Abgang. Das Bild ist noch da.", "Die Kameras behalten den ganzen Abend. Der Puffer!", "Öffne CAM 30 und drück PUFFER."] },
  { if: ["day=3", "moment:ines_drop", "!know_meeting"], about: ["cam_cam30", "app_glas", ...HOME],
    text: ["Sie ist nicht nach Hause gegangen. Da ist doch ihr Bett.", "Der Sumpf-Abgang hat eine Kamera. Dein alter Zugang geht da.", "Öffne CAM 30. Um Viertel nach acht ist sie da."] },
  { if: ["day=4", "!know_meeting"], about: ["cam_cam30", "rewind", "app_glas", ...HOME],
    text: ["WREN will den Ort, und du hast ihn nicht. Aber Ines geht heute noch weg.", "Der Sumpf-Abgang hat eine Kamera. Dein alter Zugang geht da.", "Öffne CAM 30 und spul vor bis 22:30."] },
  { if: ["day=3", "!know_meeting", "link_cam23"], about: ["cam_cam23", "rewind", "wait", "bed", ...HOME],
    text: ["Ines wäscht donnerstags anders. Ich hab nachgesehen.", "Um acht ist sie im Waschsalon.", "Öffne CAM 23 und spul vor bis 20:00."] },
  { if: ["day>1", "day<4", "!know_meeting", "!tag_ines"], about: ["ines", "cam_cam21", "wait", "bed", "app_glas", ...HOME],
    text: ["WREN will wissen, wen Ines Calder trifft. Sie kommt um sieben aus der Klinik.", "CAM 21 ist Nagi·was. Dein alter Zugang geht noch.", "Öffne CAM 21, spul vor bis 19:00 und markier sie."] },
  { if: ["day>1", "day<4", "!know_meeting"], about: ["menu", "cam_cam23", "wait", "bed", "app_glas", ...HOME],
    text: ["Folg ihr. Sie isst gegenüber der Klinik.", "Die Speisekarte im Fenster hat das WLAN. Dann der Waschsalon, der hat einen Werkscode.", "Zoom auf die Speisekarte in CAM 21, dann klick in GLASS CAM 23 an."] },
  { if: ["day>1", "!link_cam31"], about: ["cam_cam31", "app_glas", ...HOME],
    text: ["CAM 31 ist älter als Nagi·wa. Sie will einen Takt, keinen Code.", "Motte zählt nachts etwas mit, bevor er in den Flur rausgeht. Frag ihn, was.", "Lang, kurz, kurz, lang. Klick CAM 31 an und gib das ein."] },
  // the stick is nothing the chapter needs: said here, before going to bed, for whoever hasn't been there
  { if: ["day=3", "moment:ines_drop", "!stick_ines", "!off_main"], about: ["bed", "wait", "close", "back", "door_juno", "stairs", "kessel_door", "dryer6", "laundromat", "alley", "door"],
    text: ["Ines hat was in Trockner 6 gelegt. Das ist gar nicht weit.", "Durch die Gasse zum Waschsalon. Oder du lässt es.", "Warte bis eins und geh ins Bett. Dann ist der nächste Abend."] },
  { if: ["day>1", "day<4"], about: ["bed", "wait", "close", "back", "door_juno", "stairs", "kessel_door"],
    text: ["Es ist noch nicht Freitag. Das Treffen ist Freitag.", "Du schläfst zu wenig. Das sage ich seit Jahren.", "Warte bis eins und geh ins Bett. Dann ist der nächste Abend."] },
  { if: ["day=4", "time<22:45"], about: ["wait", ...HOME],
    text: ["Noch nicht Viertel vor elf. Ich zähle mit.", "Warten geht am Deck und in jedem Feed.", "Drück WARTEN, bis es 22:45 ist."] },
  { if: "day=4", about: ["cam_cam31", "thumb_cam31", "app_glas", ...HOME],
    text: ["Es ist so weit.", "CAM 31 ist in GLASS.", "Öffne GLASS und klick CAM 31 an."] },
  // the roof is open in the prologue too, and nothing it needs is up there
  { if: ["day=1", { or: ["at:juno=sims", "at:juno=dach", "at:juno=dach_blick", "at:juno=dach_sitzen"] }], about: ["ladder", "hatch", "back", "window"],
    text: ["Hier oben gibt's nichts zu essen. Ich hab nachgesehen.", "Zurück geht's über die Leiter und durchs Fenster.", "Klick die Leiter an, dann dein Fenster."] },
  { if: "!visited:deck", about: ["deck", "app_chat"],
    text: ["Juno! Frau Kessler hat einen Auftrag für dich.", "Der Auftrag ist auf mir. Auf dem Deck, meine ich.", "Setz dich ans Deck."] },
  { if: ["!read_kessler"], about: ["app_chat", "contact_kessler"],
    text: ["Du hast eine ungelesene Nachricht. Eine!", "Sie ist im CHAT. Von M. Kessler.", "Öffne CHAT und klick M. KESSLER an."] },
  { if: ["!heard_yuens", "!call_missed", "time<22:00"], about: ["app_glas", "cam_cam03", "wait"],
    text: ["Herr Kessler hat um 22:00 Schichtende. Das steht in der Nachricht.", "Meine CAM 03 zeigt die Pumpenverwaltung.", "Öffne GLASS, dann CAM 03, und spul vor bis 22:00."] },
  { if: ["!heard_yuens", "!call_missed", "!tag_kessler"], about: ["kessler", "rewind", "app_glas", "cam_cam03"],
    text: ["Frau Kessler hat ein Foto geschickt. Das hellste Pixel darauf ist der Schal.", "Im Feed ist alles grün. Der Schal bleibt trotzdem der hellste.", "Markier den Mann mit dem hellen Schal."] },
  { if: ["call_missed", "!heard_yuens"], about: ["rewind", "app_glas", "cam_cam03"],
    text: ["Er hat telefoniert, und du hast es verpasst. Ich hab es aber.", "Die Kameras behalten die ganze Nacht. Das heißt Puffer.", "Drück PUFFER auf CAM 03."] },
  { if: ["heard_yuens", "!code_cam04"], about: ["mast", "app_glas", "cam_cam03"],
    text: ["Bei Yuen's hängt eine Kamera. Ich hab keinen Zugang.", "Kameras tragen ihren Wartungscode auf dem Gehäuse. Gegenüber hängt eine.", "Zoom auf CAM 03 auf die Kamera am Mast gegenüber."] },
  { if: ["code_cam04", "!link_cam04"], about: ["app_glas", "cam_cam04", "back"],
    text: ["Du hast den Code! Ich will die Kamera.", "In GLASS ist jetzt CAM 04. Sie ist noch grau.", "Öffne GLASS und klick CAM 04 an."] },
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
  // the prologue's last steps: home with Bao's broth, eat it, sleep (and on into Chapter 1)
  { if: ["day=1", "has:suppe"], about: ["kessel_door", "stairs", "door_juno"],
    text: ["Deine Suppe wird kalt. Ich weiß nicht, wie das ist. Es klingt schlimm.", "Oben ist deine Wohnung. Haustür, Treppe, deine Tür.", "Geh nach Hause."] },
  { if: ["day=1", "soup_eaten"], about: ["bed"],
    text: ["Du gähnst. Ich hab's gesehen.", "Dein Bett steht in der Wohnung, an der Wand.", "Geh schlafen."] },
  { if: ["rent_notice", "visited:kowalski", "!bao_soup"], about: ["bao", "cart", "kessel_door"],
    text: ["Riechst du das? Ich nicht. Ich hab keine Nase. Aber du.", "Bao steht hinter dem Wagen mit dem Schirm.", "Sprich mit Bao."] },
  { if: "rent_notice", about: ["door", "stairs"],
    text: ["Bao ist draußen. Draußen ist hinter der Haustür.", "Die Haustür ist links, die aus Glas.", "Geh durch die Haustür raus."] },
  { if: ["fridge_empty", "visited:kessel_14"], about: ["stairs", "door"],
    text: ["Bao ist unten auf der Straße. Unten ist da, wo die Treppe hingeht.", "Die Treppe ist rechts, hinter dem Geländer.", "Geh die Treppe runter."] },
];
for (const act of ["prolog", "kapitel1"]) Cutaway.hints(HINTS, { act });
})();
