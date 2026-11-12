// Der Stadtplan des Unteren Neunten Rings: wo alles liegt, was schon gebaut ist und wo Neues Platz hat.
// Nicht maßstäblich: Die Lage der Orte zueinander zählt, nicht ihre Größe. Norden ist oben, das Wasser (die Flut) im Süden.
// Gezeichnet von docs/plan/plan.js (die Seite docs/plan/index.html; das Bild docs/plan/stadtplan.png). Das Spiel lädt diese
// Datei nicht.
//
// Ein Eintrag:
//   id        eindeutig, kurz
//   kind      water | street | building | place | cam | note | free
//   name      wie er auf dem Plan steht
//   rect      [x, y, w, h] oder poly [x, y, x, y, ...] oder at [x, y] (Punkte: Kameras, Kleines)
//   level     0 die Straßen des Neunten (Standard), -1 darunter (Drain-Markt), -2 noch tiefer (Sümpfe, Metro), 1 darüber (Dächer)
//   status    gemalt (im Spiel, gemalt) | block (im Spiel, auf Blöcken) | geplant (in den Docs, nicht gebaut) | vorschlag (Lage
//             noch nicht entschieden) | idee
//   room      der Raum im Spiel (oder mehrere, durch Komma getrennt)
//   chapter   in welchem Kapitel er zuerst vorkommt (0 der Prolog)
//   dir       bei Kameras: wohin sie schaut, in Grad (0 Osten, 90 Süden)
//   note      was man wissen muss, kurz
"use strict";

var STADTPLAN = {
  title: "Der Untere Neunte Ring",
  size: [1600, 1000],
  items: [
    // ---------------------------------------------------------------- das Wasser
    { id: "flut", kind: "water", name: "Die Flut", label: [1460, 960], poly: [0, 800, 360, 790, 375, 745, 470, 745, 560, 760, 600, 705, 690, 705, 690, 650, 1040, 650, 1100, 760, 1290, 745, 1600, 740, 1600, 1000, 0, 1000],
      note: "Darunter die ertrunkene alte Stadt. Im Neunten regnet es, ob es regnet oder nicht." },
    { id: "kanal_ost", kind: "water", name: "Ostkanal", label: [1335, 60], rect: [1290, 0, 90, 740] },

    // ---------------------------------------------------------------- die Straßen
    { id: "kowalski", kind: "street", name: "Kowalski-Straße", rect: [430, 330, 600, 60], status: "gemalt", room: "kowalski", chapter: 0,
      note: "Junos Straße: LUCKY STATIC, der Eingang zum Kessel-Block, Baos Garküche, der halb kaputte Werbebildschirm, der Nudelautomat. Das Tor im Süden führt in die Gasse, der Durchgang im Westen in die Jade Row." },
    { id: "jade_row", kind: "street", name: "Jade Row", label: [300, 398], rect: [170, 340, 260, 40], status: "gemalt", room: "jade_row", chapter: 1,
      note: "Die Gasse links von der Kowalski-Straße: Okonkwos Laden, gegenüber der Automat, am Ende Tor und Lull-Schirm." },
    { id: "gasse", kind: "street", name: "Die Gasse (Steg)", rect: [690, 560, 250, 90], status: "gemalt", room: "gasse", chapter: 1,
      note: "Ein Steg über dem Wasser hinter dem Tor der Kowalski-Straße: das Flutdenkmal in der Mitte, die Nische, der Abgang zum Drain-Markt in der Nordwand, SUDS & SPIN im Osten, der Balkon zum Wasser im Süden. Nach Westen läuft er aus dem Bild." },
    { id: "torbogen", kind: "street", name: "Torbogen", rect: [790, 390, 34, 170], status: "gemalt", room: "gasse",
      note: "Der hohe Bogen durch das Haus zwischen Kowalski-Straße und Gasse." },
    { id: "querstrasse", kind: "street", name: "Querstraße (Klinik)", rect: [610, 470, 80, 230], status: "vorschlag",
      note: "Vorschlag 2026-11-12: Am Westende der Gasse geht der Steg in diese Straße über. Klinik und Pho Pump stehen sich gegenüber, der Waschsalon ist um die Ecke. Juno kommt hier nicht hin (nur CAM 21 und 22)." },
    { id: "ostbruecke", kind: "street", name: "Ostbrücke", rect: [1240, 300, 190, 40], status: "gemalt", room: "cam03", chapter: 0,
      note: "Die Brücke über den Ostkanal. Kessler wartet im Prolog unter dem Vordach." },
    { id: "fischmarkt_platz", kind: "street", name: "Platz am Alten Fischmarkt", rect: [170, 130, 170, 110], status: "gemalt", room: "cam18", chapter: 1,
      note: "Ein nasser Platz, die Treppe hinunter zum alten Fischmarkt; über die Stufen ein großer Fisch, ganz nur von oben zu sehen (Frau Imai)." },
    { id: "strasse_nord", kind: "street", name: "Straße nach Norden", rect: [1030, 120, 50, 270], status: "idee" },

    // ---------------------------------------------------------------- Häuser und Orte auf der Straße
    { id: "kessel", kind: "building", name: "Kessel-Block", label: [640, 272], rect: [580, 190, 120, 140], status: "gemalt", room: "flat,kessel_14,kessel_lobby", chapter: 0,
      note: "Junos Wohnung im 14. Stock (ihr Deck, das Fenster zum Werbebildschirm), der Flur mit Frau Haldane und Motte, die Lobby. Der Zeitungskrieg (CAM 14)." },
    { id: "dach", kind: "place", name: "Dach + Sims", label: [640, 218], rect: [596, 200, 88, 46], level: 1, status: "block", room: "sims,dach,dach_sitzen,dach_blick", chapter: 1,
      note: "Aus dem Fenster auf den Sims, die Außenleiter hinauf. Die Regenleserin, unser Platz, der Blick auf die Ringe." },
    { id: "lucky", kind: "building", name: "LUCKY STATIC", rect: [470, 260, 100, 70], status: "gemalt", room: "lucky_static", chapter: 1,
      note: "Junos Stammlokal: Mei, die Tafel, der Fernseher, die zwei Stammgäste, der Karaoke-Automat." },
    { id: "bao", kind: "place", name: "Baos Garküche", at: [560, 350], status: "gemalt", room: "kowalski", chapter: 0 },
    { id: "werbeschirm", kind: "place", name: "Werbebildschirm", at: [850, 380], status: "gemalt", room: "kowalski", chapter: 0,
      note: "Gegenüber von Junos Fenster; in Kapitel 1 das Auge." },
    { id: "okonkwo", kind: "building", name: "Okonkwos Laden", rect: [280, 290, 90, 50], status: "gemalt", room: "okonkwo_shop", chapter: 1,
      note: "Der Eckladen, der Tresor (Auftrag B). Gegenüber der Automat mit der Kamera (CAM 07V)." },
    { id: "jade_tor", kind: "place", name: "Tor + Lull-Schirm", at: [176, 360], status: "gemalt", room: "jade_row" },
    { id: "waschsalon", kind: "building", name: "SUDS & SPIN", label: [985, 610], rect: [940, 540, 90, 100], status: "gemalt", room: "laundromat", chapter: 1,
      note: "Der Waschsalon: Trockner 6 ist kaputt; dort versteckt Ines am Donnerstag den Stick." },
    { id: "klinik", kind: "building", name: "Lull-Klinik 9-Ost", label: [550, 575], rect: [500, 500, 110, 110], status: "vorschlag", chapter: 1,
      note: "Weiß, still, eine Schlange müder Menschen. Ines arbeitet hier, sie geht um 19:00. Die Lage ist ein Vorschlag (2026-11-12)." },
    { id: "pho", kind: "building", name: "Pho Pump", rect: [690, 470, 70, 70], status: "vorschlag", chapter: 1,
      note: "Gegenüber der Klinik. Ines isst hier um 19:15. Die Speisekarte im Fenster hat das WLAN (CAM 22)." },
    { id: "yuen", kind: "building", name: "Imbiss Yuen", label: [1200, 292], rect: [1150, 240, 90, 70], status: "gemalt", room: "cam04", chapter: 0,
      note: "Der Imbiss an der Ecke bei der Ostbrücke. Kessler und Varga im Prolog." },
    { id: "morpheus", kind: "building", name: "Kapselhotel Morpheus", rect: [850, 160, 130, 90], status: "block", room: "cam15", chapter: 1,
      note: "Ein Gang mit Kapseln. Kessler versteckt sich hier (Auftrag A). Lage frei gewählt." },
    { id: "lerche", kind: "building", name: "Wohnblock Lerche", rect: [330, 560, 110, 90], status: "block", room: "cam24", chapter: 1,
      note: "Ines wohnt hier. Lage frei gewählt: nahe der Klinik und dem Sumpf-Abgang (Freitag 22:15 aus dem Haus, 22:30 am Abgang)." },
    { id: "sumpf_abgang", kind: "place", name: "Sumpf-Abgang", label: [420, 708], rect: [380, 690, 80, 50], status: "block", room: "cam30", chapter: 1,
      note: "Eine Treppe ins Wasser, LINE 31 – CLOSED, die Pegeltafel (LOW TIDE, FRI 23:00)." },
    { id: "revier9", kind: "building", name: "Revier 9", rect: [1100, 120, 120, 80], status: "geplant", chapter: 2,
      note: "Die Wache von Lieutenant Morrow. Lage frei gewählt." },
    { id: "pumpenhalle", kind: "building", name: "Pumpenhalle 3", rect: [1400, 620, 160, 110], status: "geplant", chapter: 2,
      note: "Wo Teo arbeitet: das Tosen des Meeres, Wartungstunnel, Tinte im Filterbecken. Lage frei gewählt, am Meer." },
    { id: "pfeiler", kind: "place", name: "Pfeiler / Transitachse", rect: [1110, 430, 50, 50], status: "geplant", chapter: 4,
      note: "Der Pfeiler der Stadt steht mitten im Drain-Markt. Ob die Aufzüge nach oben (Transitachse) in ihm fahren: offen." },

    // ---------------------------------------------------------------- darunter
    { id: "drain_markt", kind: "place", name: "Drain-Markt", rect: [790, 400, 450, 130], level: -1, status: "gemalt", room: "drain_arrival,drain_market", chapter: 1,
      note: "Der Schwarzmarkt im trockengelegten Flutkanal, unter der Stadt. Die Treppe hinab aus der Nordwand der Gasse. Ratz, der Prediger, HOT WOK, die Stände." },
    { id: "sable", kind: "place", name: "Sables Bude", at: [1180, 520], level: -1, status: "gemalt", room: "sable_booth", chapter: 1 },
    { id: "schacht", kind: "place", name: "Treppe hinab", at: [1000, 525], level: -1, status: "geplant", chapter: 2,
      note: "Hinter der Kette mit dem roten Schloss: noch tiefer (Kapitel 2)." },
    { id: "metro31", kind: "place", name: "Alte Metro, Linie 31", poly: [430, 740, 520, 800, 760, 830, 900, 820, 920, 860, 740, 870, 500, 840, 410, 770], level: -2, status: "gemalt", room: "cam31", chapter: 1,
      note: "Der Bahnsteig unter Wasser, Notlicht. Freitag 23:00 das Treffen; der Mord." },
    { id: "suempfe", kind: "place", name: "Die Sümpfe", rect: [960, 800, 360, 160], level: -2, status: "geplant", chapter: 2,
      note: "Überflutete Straßen der alten Stadt unter dem Neunten. Lanterns Versteck." },

    // ---------------------------------------------------------------- die Kameras (dir: wohin sie schaut)
    { id: "cam03", kind: "cam", name: "CAM 03", at: [1310, 285], dir: 110, status: "gemalt", room: "cam03", chapter: 0, note: "Ostbrücke." },
    { id: "cam04", kind: "cam", name: "CAM 04", at: [1170, 262], dir: 0, status: "gemalt", room: "cam04", chapter: 0, note: "Imbiss Yuen, innen." },
    { id: "cam07", kind: "cam", name: "CAM 07", at: [420, 350], dir: 180, status: "gemalt", room: "cam07", chapter: 1, note: "Jade Row, hoch am Ende zur Kowalski: das Bild der Jade Row." },
    { id: "cam07v", kind: "cam", name: "CAM 07V", at: [330, 376], dir: 270, status: "gemalt", room: "cam07v", chapter: 1, note: "Der Automat gegenüber: Okonkwos Laden." },
    { id: "cam14", kind: "cam", name: "CAM 14", at: [660, 310], dir: 180, status: "gemalt", room: "cam14", chapter: 1, note: "Kessel-Block, 14. Stock: das Bild des Flurs." },
    { id: "cam15", kind: "cam", name: "CAM 15", at: [915, 175], dir: 90, status: "block", room: "cam15", chapter: 1 },
    { id: "cam18", kind: "cam", name: "CAM 18", at: [255, 150], dir: 90, status: "gemalt", room: "cam18", chapter: 1, note: "Von der Laterne senkrecht hinab." },
    { id: "cam21", kind: "cam", name: "CAM 21", at: [612, 535], dir: 0, status: "block", room: "cam21", chapter: 1, note: "Über der Klinik-Tür nach draußen (Variante B, 2026-11-12)." },
    { id: "cam22", kind: "cam", name: "CAM 22", at: [735, 490], dir: 180, status: "block", room: "cam22", chapter: 1, note: "Pho Pump, über der Theke." },
    { id: "cam23", kind: "cam", name: "CAM 23", at: [960, 560], dir: 20, status: "gemalt", room: "cam23", chapter: 1, note: "Das Bild des Waschsalons." },
    { id: "cam24", kind: "cam", name: "CAM 24", at: [385, 560], dir: 270, status: "block", room: "cam24", chapter: 1, note: "Türklingel, Fischauge." },
    { id: "cam30", kind: "cam", name: "CAM 30", at: [495, 752], dir: 200, status: "block", room: "cam30", chapter: 1, note: "Tief am Wasser, die Treppe hinauf." },
    { id: "cam31", kind: "cam", name: "CAM 31", at: [810, 850], dir: 180, level: -2, status: "gemalt", room: "cam31", chapter: 1, note: "Nur über das alte Protokoll." },

    // ---------------------------------------------------------------- frei für Neues
    { id: "frei_nordost", kind: "free", name: "frei", rect: [1430, 60, 150, 220] },
    { id: "frei_nord", kind: "free", name: "frei", rect: [380, 40, 420, 120] },
    { id: "frei_west", kind: "free", name: "frei", rect: [20, 420, 140, 300] },
    { id: "frei_suedost", kind: "free", name: "frei", rect: [1090, 560, 180, 130] },

    // ---------------------------------------------------------------- Notizen
    { id: "n_klinik", kind: "note", name: "Offen", at: [40, 860],
      note: "Klinik, Pho Pump und Querstraße: Lage vorgeschlagen, nicht entschieden. Ines' Weg: Klinik 19:00, Pho Pump 19:15, Waschsalon 20:00, nach Hause 20:30, Sumpf-Abgang (Do 20:15, Fr 22:30), Metro 31 Fr 23:00." },
    { id: "n_markt", kind: "note", name: "Offen", at: [40, 940],
      note: "Der Drain-Markt liegt unter der Stadt zwischen Kowalski-Straße und Gasse; die Treppe aus der Gasse führt hinab. Wo seine Ränder oben auf Straßen treffen: offen." },
  ],
};
