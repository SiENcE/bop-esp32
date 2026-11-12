// Der Stadtplan des Unteren Neunten Rings: wo alles liegt, was schon gebaut ist und wo Neues Platz hat.
// Gezeichnet von docs/plan/plan.js (die Seite docs/plan/index.html, die Bilder docs/plan/stadtplan_<ebene>.png: node
// tools/stadtplan.mjs). Die Übergänge zwischen den Räumen kommen aus dem Spiel (docs/plan/uebergaenge.js, node
// tools/stadtplan-links.mjs). Das Spiel lädt diese Datei nicht.
//
// Die Räume, in denen Juno läuft, stehen in Metern im Plan (scale Einheiten pro Meter), alles dazwischen ist nicht maßstäblich:
// Die Lage der Orte zueinander zählt. Norden ist oben, das Wasser im Süden. Winkel: 0 Osten, 90 Süden, 180 Westen, 270 Norden.
//
// Ein Eintrag:
//   id, name
//   kind      room (ein Raum des Spiels, Juno läuft darin) | water | street | building | place | cam | view | note | free
//   level     die Ebene (levels unten; Standard "strasse")
//   status    gemalt | block | geplant | vorschlag (Lage nicht entschieden) | idee
//   room      der Raum im Spiel (mehrere durch Komma)
//   chapter   wo er zuerst vorkommt (0 der Prolog)
//   note      was man wissen muss
//   outdoor   ein Raum draußen (eine Straße, ein Steg, ein Sims, ein Dach): muss über keinem Haus liegen
//   within    die id eines Raums, in dessen Bild er liegt (Sables Bude unter dem Rand des Drain-Markts): kein Widerspruch
// Die Form:
//   rect [x, y, w, h] | poly [x, y, ...] | at [x, y]
//   iso: "<map>"   ein Iso-Raum aus art/rooms/<map>.map.js: at ist seine hintere Ecke (u = v = 0), rot die Richtung von +u
//                  (+v liegt 90° weiter); gezeichnet werden Boden, Wände, Öffnungen und die Kamera des Bildes
//   topdown: { ppm, size }   ein Raum von oben (der Drain-Markt): at ist die linke obere Ecke des Bildes, rot die Richtung
//                  seiner x-Achse, ppm seine Pixel pro Meter
//   view: { at, dir } | { top: true }   die Kamera eines gemalten Raums: von wo und wohin das Bild schaut (top: von oben)
//   doors: { <hotspot>: [x, y] }        wo in einem gemalten Raum ein Ausgang liegt (sonst seine Mitte)
//   dir       bei Kameras: wohin sie schaut
// accept: { "<raum>/<hotspot>": "warum" }   ein Übergang, dessen Enden mit Absicht auseinanderliegen (ein Torweg, eine Treppe
//   über eine ganze Flucht): gestrichelt gezeichnet, nicht als Widerspruch gezählt
"use strict";

var STADTPLAN = {
  title: "Der Untere Neunte Ring",
  size: [1600, 1000],
  scale: 30,
  levels: [
    { id: "dach", name: "Dach", z: 15, note: "Das Dach des Kessel-Blocks." },
    { id: "k14", name: "14. Stock", z: 14, note: "Junos Wohnung, der Flur, der Sims vor dem Fenster." },
    { id: "strasse", name: "Straße", z: 0, note: "Die Straßen des Neunten und was an ihnen liegt." },
    { id: "markt", name: "Drain-Markt", z: -1, note: "Unter der Stadt: der trockengelegte Flutkanal." },
    { id: "tief", name: "Sümpfe, Metro", z: -2, note: "Die alte Stadt unter Wasser." },
  ],
  accept: {
    "kowalski/alley": "der Torweg durch das Haus, vom Tor in der Ostfassade zum Bogen in der Nordwand der Gasse",
    "gasse/kowalski": "der Torweg zurück",
    "kowalski/west": "der Durchgang zur Jade Row, 3 m durch das Haus",
    "jade_row/back": "der Durchgang zurück",
    "kessel_14/stairs": "die Treppe: oben und unten liegt eine ganze Flucht dazwischen",
    "kessel_lobby/stairs": "die Treppe hinauf",
    "gasse/market": "die lange Treppe hinab in den Kanal",
    "drain_market/up": "die Treppe hinauf",
  },
  items: [
    // ================================================================ die Straße
    { id: "flut", kind: "water", name: "Die Flut", label: [1300, 940],
      poly: [0, 880, 420, 880, 420, 850, 560, 850, 560, 840, 600, 840, 600, 690, 700, 690, 700, 760, 1130, 760, 1130, 620, 1260, 620, 1260, 900, 1600, 880, 1600, 1000, 0, 1000],
      note: "Darunter die ertrunkene alte Stadt. Im Neunten regnet es, ob es regnet oder nicht." },
    { id: "kanal_ost", kind: "water", name: "Ostkanal", label: [1335, 40], rect: [1300, 0, 70, 620] },

    { id: "kowalski", kind: "room", name: "Kowalski-Straße", iso: "kowalski", at: [760, 330], rot: 90, outdoor: true, status: "gemalt", room: "kowalski", chapter: 0,
      note: "Eine Straßenecke: die Nordfassade mit der Haustür des Kessel-Blocks, LUCKY STATIC und dem Durchgang zur Jade Row; die Ostfassade mit dem Automaten, dem Werbebildschirm und dem Tor zur Gasse. Baos Garküche davor." },
    { id: "kowalski_west", kind: "street", name: "Kowalski-Straße (weiter?)", rect: [380, 345, 200, 70], status: "idee",
      note: "Wohin die Straße außerhalb des Bildes weitergeht: offen." },
    { id: "lobby", kind: "room", name: "Lobby", iso: "kessel_lobby", at: [640, 330], rot: 270, status: "gemalt", room: "kessel_lobby", chapter: 0,
      note: "Ihre Straßentür liegt in derselben Wand wie die Haustür in der Kowalski-Straße. Der Aufzug steht an derselben Stelle wie oben." },
    { id: "lucky", kind: "room", name: "LUCKY STATIC", iso: "lucky_static", at: [613, 210], rot: 0, status: "gemalt", room: "lucky_static", chapter: 1,
      note: "Die Straße ist die nahe linke Wand; Tür und Fenster wie von außen." },
    { id: "jade_row", kind: "room", name: "Jade Row", rect: [560, 30, 50, 210], outdoor: true, status: "gemalt", room: "jade_row", chapter: 1,
      view: { at: [585, 262], dir: 270 }, doors: { back: [597, 240], door: [560, 196] },
      note: "Ein Blick die Gasse hinunter (gemalt, kein Iso): vorn links Okonkwos Laden, gegenüber der Automat, am Ende Tor und Lull-Schirm. Der Durchgang aus der Kowalski-Straße kommt rechts unten herein." },
    { id: "okonkwo", kind: "room", name: "Okonkwos Laden", rect: [470, 160, 90, 70], status: "gemalt", room: "okonkwo_shop", chapter: 1,
      view: { at: [585, 196], dir: 180 }, doors: { door: [560, 196] },
      note: "Eine Bühne von der Seite: die Rückwand frontal, die Tür zur Gasse vorn in der linken Seitenwand. Seine Kamera ist das Fenster zur Jade Row, es schaut nach Westen in den Laden." },
    { id: "torweg", kind: "street", name: "Torweg", poly: [760, 510, 800, 510, 800, 570, 768, 570, 768, 540, 760, 540], status: "idee",
      note: "Der Weg durch das Haus vom Tor der Kowalski-Straße (in ihrer Ostfassade) zum Torbogen in der Nordwand der Gasse." },
    { id: "gasse", kind: "room", name: "Die Gasse", iso: "gasse", at: [978.5, 570], rot: 90, outdoor: true, status: "gemalt", room: "gasse", chapter: 1,
      note: "Ein Steg über dem Wasser: der Torbogen zur Kowalski-Straße und der Abgang zum Drain-Markt in der Nordwand, SUDS & SPIN im Osten, der Balkon zum Wasser im Süden. Nach Westen läuft der Steg aus dem Bild." },
    { id: "waschsalon", kind: "room", name: "SUDS & SPIN", iso: "laundromat", at: [1098.5, 588], rot: 90, status: "gemalt", room: "laundromat", chapter: 1,
      note: "Die Gasse ist seine nahe linke Wand; sein u ist das der Gasse minus 0,6 m." },
    { id: "steg_west", kind: "street", name: "Steg (weiter)", rect: [600, 590, 108, 90], status: "vorschlag",
      note: "Wohin der Steg aus dem Bild der Gasse läuft: zur Querstraße mit der Klinik (Vorschlag 2026-11-12)." },
    { id: "querstrasse", kind: "street", name: "Querstraße", rect: [560, 560, 40, 280], status: "vorschlag",
      note: "Vorschlag 2026-11-12: Der Steg geht hier in eine Straße über; Klinik und Pho Pump stehen sich gegenüber, der Waschsalon ist ein paar Schritte weiter. Juno kommt hier nicht hin (nur CAM 21 und 22)." },
    { id: "klinik", kind: "building", name: "Lull-Klinik 9-Ost", rect: [440, 680, 118, 100], status: "vorschlag", chapter: 1,
      note: "Weiß, still, eine Schlange müder Menschen. Ines arbeitet hier, sie geht um 19:00." },
    { id: "pho", kind: "building", name: "Pho Pump", rect: [602, 690, 64, 60], status: "vorschlag", chapter: 1,
      note: "Gegenüber der Klinik. Ines isst hier um 19:15. Die Speisekarte im Fenster hat das WLAN (CAM 22)." },
    { id: "lerche", kind: "building", name: "Wohnblock Lerche", rect: [250, 680, 110, 90], status: "block", room: "cam24", chapter: 1,
      note: "Ines wohnt hier. Lage frei gewählt: nahe der Klinik und dem Sumpf-Abgang." },
    { id: "sumpf_abgang", kind: "place", name: "Sumpf-Abgang", rect: [300, 806, 80, 36], status: "block", room: "cam30", chapter: 1,
      note: "Eine Treppe ins Wasser, LINE 31 – CLOSED, die Pegeltafel (LOW TIDE, FRI 23:00)." },
    { id: "fischmarkt", kind: "street", name: "Platz am Alten Fischmarkt", rect: [80, 60, 180, 110], status: "gemalt", room: "cam18", chapter: 1,
      note: "Ein nasser Platz, die Treppe hinunter zum alten Fischmarkt; über die Stufen ein großer Fisch, ganz nur von oben zu sehen." },
    { id: "morpheus", kind: "building", name: "Kapselhotel Morpheus", rect: [1000, 110, 130, 90], status: "block", room: "cam15", chapter: 1,
      note: "Ein Gang mit Kapseln. Kessler versteckt sich hier (Auftrag A). Lage frei gewählt." },
    { id: "yuen", kind: "building", name: "Imbiss Yuen", rect: [1190, 300, 100, 60], status: "gemalt", room: "cam04", chapter: 0,
      note: "Der Imbiss an der Ecke bei der Ostbrücke. Kessler und Varga im Prolog." },
    { id: "ostbruecke", kind: "street", name: "Ostbrücke", rect: [1270, 372, 140, 34], status: "gemalt", room: "cam03", chapter: 0,
      note: "Die Brücke über den Ostkanal; Kessler wartet im Prolog unter dem Vordach." },
    { id: "revier9", kind: "building", name: "Revier 9", rect: [1420, 110, 140, 80], status: "geplant", chapter: 2, note: "Die Wache von Lieutenant Morrow. Lage frei gewählt." },
    { id: "pumpenhalle", kind: "building", name: "Pumpenhalle 3", rect: [1400, 640, 170, 100], status: "geplant", chapter: 2,
      note: "Wo Teo arbeitet: das Tosen des Meeres, Wartungstunnel, Tinte im Filterbecken. Lage frei gewählt, am Meer." },

    // the cameras on the street
    { id: "cam03", kind: "cam", name: "CAM 03", at: [1300, 360], dir: 20, status: "gemalt", room: "cam03", chapter: 0, note: "Ostbrücke." },
    { id: "cam04", kind: "cam", name: "CAM 04", at: [1210, 312], dir: 30, status: "gemalt", room: "cam04", chapter: 0, note: "Imbiss Yuen, innen." },
    { id: "cam07", kind: "cam", name: "CAM 07", at: [600, 236], dir: 270, status: "gemalt", room: "cam07", chapter: 1, note: "Jade Row, hoch am Ende zur Kowalski: das Bild der Jade Row." },
    { id: "cam07v", kind: "cam", name: "CAM 07V", at: [606, 176], dir: 180, status: "gemalt", room: "cam07v", chapter: 1, note: "Der Automat gegenüber: Okonkwos Laden." },
    { id: "cam15", kind: "cam", name: "CAM 15", at: [1065, 122], dir: 90, status: "block", room: "cam15", chapter: 1 },
    { id: "cam18", kind: "cam", name: "CAM 18", at: [170, 80], dir: 90, status: "gemalt", room: "cam18", chapter: 1, note: "Von der Laterne senkrecht hinab." },
    { id: "cam21", kind: "cam", name: "CAM 21", at: [560, 712], dir: 15, status: "block", room: "cam21", chapter: 1, note: "Über der Klinik-Tür nach draußen (Variante B, 2026-11-12)." },
    { id: "cam22", kind: "cam", name: "CAM 22", at: [640, 700], dir: 160, status: "block", room: "cam22", chapter: 1, note: "Pho Pump, über der Theke." },
    { id: "cam23", kind: "cam", name: "CAM 23", at: [1040, 620], dir: 315, status: "gemalt", room: "cam23", chapter: 1, note: "Das Bild des Waschsalons." },
    { id: "cam24", kind: "cam", name: "CAM 24", at: [305, 680], dir: 270, status: "block", room: "cam24", chapter: 1, note: "Türklingel, Fischauge." },
    { id: "cam30", kind: "cam", name: "CAM 30", at: [400, 850], dir: 200, status: "block", room: "cam30", chapter: 1, note: "Tief am Wasser, die Treppe hinauf." },

    // ================================================================ der 14. Stock und das Dach
    { id: "kessel_14", kind: "room", name: "Flur 14", iso: "kessel_14", at: [640, 330], rot: 270, level: "k14", status: "gemalt", room: "kessel_14", chapter: 0,
      note: "Über der Lobby, der Aufzug an derselben Stelle. Junos Tür 14B in derselben Wand wie unten die Straßentür." },
    { id: "flat", kind: "room", name: "Junos Wohnung", iso: "flat", at: [811, 330], rot: 90, level: "k14", status: "gemalt", room: "flat,flat_danach", chapter: 0,
      note: "Hinter Junos Tür 14B. Das Fenster mit dem Deck davor schaut auf den Werbebildschirm." },
    { id: "sims", kind: "room", name: "Sims", rect: [811, 420, 46, 60], level: "k14", outdoor: true, status: "block", room: "sims", chapter: 1,
      view: { at: [900, 510], dir: 225 }, doors: { window: [811, 448], ladder: [845, 424] },
      note: "Vor dem Fenster; rechts draußen die Leiter aufs Dach." },
    { id: "dach", kind: "room", name: "Dach", rect: [640, 150, 135, 180], level: "dach", outdoor: true, status: "block", room: "dach", chapter: 1,
      view: { at: [610, 370], dir: 315 }, doors: { hatch: [770, 320] },
      note: "Die Regenleserin, unser Platz (dach_sitzen), der Blick auf die Ringe (dach_blick). Die Leiter kommt vom Sims herauf." },
    { id: "cam14", kind: "cam", name: "CAM 14", at: [745, 200], dir: 135, level: "k14", status: "gemalt", room: "cam14", chapter: 1, note: "Das Bild des Flurs." },

    // ================================================================ der Drain-Markt
    { id: "drain_markt", kind: "room", name: "Drain-Markt", topdown: { ppm: 40, size: [1280, 720] }, at: [1019, 570], rot: 180, level: "markt", outdoor: true, status: "gemalt",
      room: "drain_market", chapter: 1, view: { top: true }, label: [540, 260],
      note: "Der Schwarzmarkt im trockengelegten Flutkanal, unter der Stadt, von oben gemalt. Hier gedreht: Die Treppe zur Gasse ist im Bild oben links, also liegt das Bild mit seinem oberen Rand nach Süden zur Gasse." },
    { id: "sable", kind: "room", name: "Sables Bude", rect: [117, 70, 70, 56], level: "markt", within: "drain_markt", status: "gemalt", room: "sable_booth", chapter: 1,
      view: { at: [152, 52], dir: 90 }, doors: { curtain: [152, 126] },
      note: "Hinter dem Vorhang in der Südwand des Markts (im Bild unten), unter dem Rand des Kanals; hier, gedreht, im Norden." },
    { id: "arrival", kind: "view", name: "Ankunft", at: [902, 560], dir: 270, level: "markt", status: "gemalt", room: "drain_arrival",
      note: "Der Blick von der Treppe hinab in die Schlucht (drain_arrival)." },
    { id: "pfeiler", kind: "place", name: "Pfeiler", at: [569, 350], level: "markt", status: "gemalt", room: "drain_market",
      note: "Der Pfeiler der Stadt im Markt. Ob die Aufzüge nach oben (Transitachse) in ihm fahren: offen." },

    // ================================================================ die Tiefe
    { id: "metro31", kind: "place", name: "Alte Metro, Linie 31", poly: [340, 840, 440, 900, 700, 920, 880, 910, 900, 950, 700, 960, 420, 935, 320, 860], level: "tief", status: "gemalt",
      room: "cam31", chapter: 1, note: "Der Bahnsteig unter Wasser, Notlicht. Freitag 23:00 das Treffen; der Mord." },
    { id: "suempfe", kind: "place", name: "Die Sümpfe", rect: [980, 800, 320, 150], level: "tief", status: "geplant", chapter: 2,
      note: "Überflutete Straßen der alten Stadt unter dem Neunten. Lanterns Versteck." },
    { id: "cam31", kind: "cam", name: "CAM 31", at: [720, 935], dir: 180, level: "tief", status: "gemalt", room: "cam31", chapter: 1, note: "Nur über das alte Protokoll." },

    // ================================================================ frei für Neues
    { id: "frei_nordost", kind: "free", name: "frei", rect: [1430, 220, 150, 360] },
    { id: "frei_nord", kind: "free", name: "frei", rect: [290, 40, 160, 180] },
    { id: "frei_west", kind: "free", name: "frei", rect: [20, 250, 200, 360] },
    { id: "frei_ost", kind: "free", name: "frei", rect: [880, 230, 260, 80] },

    // ================================================================ Notizen
    { id: "n_ines", kind: "note", name: "Offen", at: [20, 912],
      note: "Klinik, Pho Pump und Querstraße: Lage vorgeschlagen, nicht entschieden. Ines' Weg: Klinik 19:00, Pho Pump 19:15, Waschsalon 20:00, nach Hause 20:30, Sumpf-Abgang (Do 20:15, Fr 22:30), Metro 31 Fr 23:00." },
  ],
};
