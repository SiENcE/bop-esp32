// Der Stadtplan des Unteren Neunten Rings: wo alles liegt, was schon gebaut ist und wo Neues Platz hat. Zum Nachsehen und
// Prüfen: Er ist vom Spiel getrennt. Was hier steht, ändert weder das Spiel noch eine Karte, und er liest beides nicht; die einzige
// Brücke ist ein Doppelklick im Plan-Tab des Studios, der einen Raum dort öffnet (game/editor/plan.js). Gezeichnet von
// docs/plan/plan.js (die Seite docs/plan/index.html, die Bilder docs/plan/stadtplan_<ebene>.png: node tools/stadtplan.mjs).
// Die Räume, ihre Wände, Türen und Kameras sind am 2026-11-12 einmal aus den Iso-Karten und den Wegen des Spiels übernommen worden;
// seitdem gehören sie dem Plan.
//
// Die Räume, in denen Juno läuft, stehen ungefähr in Metern (scale Einheiten pro Meter), alles dazwischen ist nicht maßstäblich:
// Die Lage der Orte zueinander zählt. Norden ist oben, das Wasser im Süden. Winkel: 0 Osten, 90 Süden, 180 Westen, 270 Norden.
//
// Ein Eintrag:
//   id, name
//   kind      room (ein Raum des Spiels) | water | street | building | place | cam | view | note | free
//   level     die Ebene (levels unten; Standard "strasse")
//   rect [x, y, w, h] | poly [x, y, ...] | at [x, y]   seine Form (ein Punkt: Kameras, Kleines, Notizen)
//   status    gemalt | block | geplant | vorschlag (Lage nicht entschieden) | idee
//   room      der Raum im Spiel, den ein Doppelklick öffnet (mehrere durch Komma)
//   chapter   wo er zuerst vorkommt (0 der Prolog)
//   outdoor   draußen (eine Straße, ein Steg, ein Sims, ein Dach): muss über keinem Haus liegen
//   within    die id eines Raums, in dessen Fläche er liegt (Sables Bude im Drain-Markt): kein Widerspruch
//   camera    { at, dir } von wo und wohin sein Bild schaut, oder { top: true } von oben
//   walls     [{ from, to, stub }] seine Wände (stub: eine angeschnittene vordere Wand)
//   doors     { <name>: { at, to: "<id>/<tür>" } } seine Türen und die Tür, zu der jede führt (die Pfeile im Plan)
//   dir       bei Kameras: wohin sie schaut
//   label     wo sein Name steht (sonst in seiner Mitte)
//   note      was man wissen muss
// accept: { "<id>/<tür>": "warum" }   eine Tür, deren Ziel mit Absicht weiter weg liegt (ein Torweg, eine Treppe über eine
//   ganze Flucht): gestrichelt gezeichnet, nicht als Widerspruch gezählt
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
    { id: "lerche4", name: "Lerche, 4. Stock", z: 4, note: "Der Flur im vierten Stock des Wohnblocks Lerche und Ines' Wohnung 4B (Kapitel 2)." },
  ],
  accept: {
    "kowalski/alley": "der Torweg durch das Haus, vom Tor in der Ostfassade zum Bogen in der Nordwand der Gasse",
    "gasse/kowalski": "der Torweg zurück",
    "kowalski/west": "der Durchgang zur Jade Row, 3 m durch das Haus",
    "jade_row/back": "der Durchgang zurück",
    "kessel_14/stairs": "die Treppe: oben und unten liegt eine ganze Flucht dazwischen",
    "lobby/stairs": "die Treppe hinauf",
    "gasse/market": "die lange Treppe hinab in den Kanal",
    "drain_markt/up": "die Treppe hinauf",
  },
  items: [
    // ================================================================ das Wasser
    { id: "flut", kind: "water", name: "Die Flut", label: [1299.5, 942.5], poly: [-1, 823, 419.5, 882.5, 419.5, 852.5, 492.5, 852, 492.5, 842, 618.5, 842, 619, 750.5, 655.5, 751.5, 708, 752, 1103, 751, 1102.5, 622, 1258, 623, 1600.5, 622, 1599.5, 882.5, 1599.5, 1002.5, -0.5, 1002.5], note: "Darunter die ertrunkene alte Stadt. Im Neunten regnet es, ob es regnet oder nicht." },
    { id: "kanal_ost", kind: "water", name: "Ostkanal", label: [1330, 43.5], rect: [1260.5, 3.5, 139, 618] },
    // ================================================================ Dach
    { id: "dach", kind: "room", name: "Dach", level: "dach", rect: [556, 303.5, 203.5, 111.5], outdoor: true, status: "block", room: "dach", chapter: 1, camera: { at: [652, 317.5], dir: 90 }, doors: { hatch: { at: [689.5, 407], to: "sims/ladder" } }, note: "Die Regenleserin, unser Platz (dach_sitzen), der Blick auf die Ringe (dach_blick). Die Leiter kommt vom Sims herauf." },
    // ================================================================ 14. Stock
    { id: "kessel_14", kind: "room", name: "Flur 14", level: "k14", rect: [707, 303, 100, 112], status: "gemalt", room: "kessel_14", chapter: 0, camera: { at: [800.5, 421], dir: 225 }, walls: [{ from: [707, 303], to: [807, 303] }, { from: [707, 303], to: [707, 415] }, { from: [707, 415], to: [807, 415], stub: true }, { from: [807, 303], to: [807, 415], stub: true }], doors: { door_juno: { at: [715.5, 336], to: "flat/door" }, stairs: { at: [792.5, 322], to: "lobby/stairs" } }, note: "Über der Lobby, der Aufzug an derselben Stelle. Junos Tür 14B in derselben Wand wie unten die Straßentür." },
    { id: "flat", kind: "room", name: "Junos Wohnung", level: "k14", rect: [555, 302.5, 151.5, 111], status: "gemalt", room: "flat,flat_danach", chapter: 0, camera: { at: [506.5, 263], dir: 45 }, walls: [{ from: [706.5, 413.5], to: [555, 413.5] }, { from: [706.5, 413.5], to: [706.5, 302.5] }, { from: [706.5, 302.5], to: [555, 302.5], stub: true }, { from: [555, 413.5], to: [555, 302.5], stub: true }], doors: { window: { at: [586, 392], to: "sims/window" }, door: { at: [691.5, 335], to: "kessel_14/door_juno" } }, note: "Hinter Junos Tür 14B. Das Fenster mit dem Deck davor schaut auf den Werbebildschirm." },
    { id: "sims", kind: "room", name: "Sims", level: "k14", rect: [555.5, 415, 149.5, 15.5], outdoor: true, status: "block", room: "sims", chapter: 1, camera: { at: [567.5, 467.5], dir: 315 }, doors: { window: { at: [585.5, 415], to: "flat/window" }, ladder: { at: [685, 416.5], to: "dach/hatch" } }, note: "Vor dem Fenster; rechts draußen die Leiter aufs Dach." },
    { id: "cam14", kind: "cam", name: "CAM 14", level: "k14", at: [814.5, 405], dir: 225, status: "gemalt", room: "cam14", chapter: 1, note: "Das Bild des Flurs." },
    { id: "n_kessel", kind: "note", name: "Entschieden", level: "k14", at: [20, 840], note: "2026-11-12: Der Kessel-Block wird umgebaut. Die Nordfassade der Kowalski-Straße wird länger, damit Lobby und LUCKY STATIC nebeneinander passen; die Wohnung liegt über dem Haus, nicht über der Straße; der 14. Stock wird um 90° nach rechts gedreht, sodass Fenster, Sims und Leiter zur Kowalski-Straße zeigen. Offen: A, die Lobby dreht mit (die Aufzüge bleiben übereinander, ihre Straßentür wandert in die vordere Wand), oder B, nur der 14. Stock dreht (der Aufzug öffnet zu zwei Seiten). Der Drain-Markt bleibt, wie er liegt (kein Problem)." },
    // ================================================================ Straße
    { id: "kowalski", kind: "room", name: "Kowalski-Straße", rect: [514.5, 416, 243, 129], outdoor: true, status: "gemalt", room: "kowalski", chapter: 0, camera: { at: [515.5, 546], dir: 315 }, walls: [{ from: [757.5, 416], to: [757.5, 545] }, { from: [757.5, 416], to: [514.5, 416] }], doors: { kessel_door: { at: [729, 423.5], to: "lobby/door" }, lucky_door: { at: [591.5, 434], to: "lucky/door" }, alley: { at: [747.5, 534], to: "gasse/kowalski" }, west: { at: [537, 423], to: "jade_row/back" } }, note: "Eine Straßenecke: die Nordfassade mit der Haustür des Kessel-Blocks, LUCKY STATIC und dem Durchgang zur Jade Row; die Ostfassade mit dem Automaten, dem Werbebildschirm und dem Tor zur Gasse. Baos Garküche davor." },
    { id: "lobby", kind: "room", name: "Lobby", rect: [704, 301, 117.5, 114], status: "gemalt", note: "Ihre Straßentür liegt in derselben Wand wie die Haustür in der Kowalski-Straße. Der Aufzug steht an derselben Stelle wie oben.", room: "kessel_lobby", chapter: 0, camera: { at: [821.5, 304.5], dir: 135 }, walls: [{ from: [704, 415], to: [704, 301] }, { from: [704, 415], to: [821.5, 415] }, { from: [821.5, 415], to: [821.5, 301], stub: true }, { from: [704, 301], to: [821.5, 301], stub: true }], doors: { stairs: { at: [716.5, 320.5], to: "kessel_14/stairs" }, door: { at: [727, 400.5], to: "kowalski/kessel_door" } } },
    { id: "lucky", kind: "room", name: "LUCKY STATIC", rect: [555, 301.5, 149, 112], status: "gemalt", room: "lucky_static", chapter: 1, camera: { at: [697.5, 407], dir: 210 }, walls: [{ from: [555, 301.5], to: [704, 301.5] }, { from: [555, 301.5], to: [555, 413.5] }, { from: [584, 413.5], to: [589, 413.5], stub: true }, { from: [589, 413.5], to: [692, 413.5], stub: true }, { from: [692, 413.5], to: [704, 413.5], stub: true }, { from: [704, 301.5], to: [704, 413.5], stub: true }], doors: { door: { at: [591.5, 399], to: "kowalski/lucky_door" } }, note: "Die Straße ist die nahe linke Wand; Tür und Fenster wie von außen." },
    { id: "jade_row", kind: "room", name: "Jade Row", rect: [463, 203, 50, 210], outdoor: true, status: "gemalt", room: "jade_row", chapter: 1, camera: { at: [482, 433], dir: 270 }, doors: { back: { at: [508.5, 379.5], to: "kowalski/west" }, door: { at: [463, 369], to: "okonkwo/door" } }, note: "Ein Blick die Gasse hinunter (gemalt, kein Iso): vorn links Okonkwos Laden, gegenüber der Automat, am Ende Tor und Lull-Schirm. Der Durchgang aus der Kowalski-Straße kommt rechts unten herein." },
    { id: "okonkwo", kind: "room", name: "Okonkwos Laden", rect: [373, 333, 90, 70], status: "gemalt", room: "okonkwo_shop", chapter: 1, camera: { at: [476.5, 372.5], dir: 180 }, doors: { door: { at: [463, 369], to: "jade_row/door" } }, note: "Eine Bühne von der Seite: die Rückwand frontal, die Tür zur Gasse vorn in der linken Seitenwand. Seine Kamera ist das Fenster zur Jade Row, es schaut nach Westen in den Laden." },
    
    { id: "torweg", kind: "street", name: "Torweg", poly: [760, 510, 800, 510, 800, 570, 768, 570, 768, 540, 760, 540], status: "idee", note: "Der Weg durch das Haus vom Tor der Kowalski-Straße (in ihrer Ostfassade) zum Torbogen in der Nordwand der Gasse." },
    { id: "gasse", kind: "room", name: "Die Gasse", rect: [708.5, 570, 270, 180], outdoor: true, status: "gemalt", room: "gasse", chapter: 1, camera: { at: [713, 747.5], dir: 315 }, walls: [{ from: [978.5, 570], to: [978.5, 750] }, { from: [978.5, 570], to: [708.5, 570] }], doors: { kowalski: { at: [788, 579], to: "kowalski/alley" }, laundromat: { at: [963.5, 600], to: "waschsalon/door" }, market: { at: [902, 583.5], to: "drain_markt/up" } }, note: "Ein Steg über dem Wasser: der Torbogen zur Kowalski-Straße und der Abgang zum Drain-Markt in der Nordwand, SUDS & SPIN im Osten, der Balkon zum Wasser im Süden. Nach Westen läuft der Steg aus dem Bild." },
    { id: "waschsalon", kind: "room", name: "SUDS & SPIN", rect: [978.5, 570, 122, 179], status: "gemalt", room: "laundromat", chapter: 1, camera: { at: [980, 693], dir: 315 }, walls: [{ from: [1100.5, 570], to: [1100.5, 749] }, { from: [1100.5, 570], to: [978.5, 570] }, { from: [978.5, 604], to: [978.5, 611.5], stub: true }, { from: [978.5, 611.5], to: [978.5, 734.5], stub: true }, { from: [978.5, 734.5], to: [978.5, 749], stub: true }, { from: [1100.5, 749], to: [978.5, 749], stub: true }], doors: { door: { at: [992.5, 598.5], to: "gasse/laundromat" } }, note: "Die Gasse ist seine nahe linke Wand; sein u ist das der Gasse minus 0,6 m." },
    { id: "steg_west", kind: "street", name: "Steg (weiter)", rect: [618, 569.5, 91.5, 104.5], status: "vorschlag", note: "Wohin der Steg aus dem Bild der Gasse läuft: zur Querstraße mit der Klinik (Vorschlag 2026-11-12)." },
    { id: "querstrasse", kind: "street", name: "Querstraße", rect: [575, 569, 41.5, 272], status: "vorschlag", note: "Vorschlag 2026-11-12: Der Steg geht hier in eine Straße über; Klinik und Pho Pump stehen sich gegenüber, der Waschsalon ist ein paar Schritte weiter. Juno kommt hier nicht hin (nur CAM 21 und 22)." },
    { id: "klinik", kind: "building", name: "Lull-Klinik 9-Ost", rect: [455.5, 569, 118, 175], status: "vorschlag", chapter: 1, note: "Weiß, still, eine Schlange müder Menschen. Ines arbeitet hier, sie geht um 19:00." },
    { id: "pho", kind: "building", name: "Pho Pump", rect: [619.5, 675.5, 90, 74.5], status: "vorschlag", chapter: 1, note: "Gegenüber der Klinik. Ines isst hier um 19:15. Die Speisekarte im Fenster hat das WLAN (CAM 22)." },
    { id: "lerche", kind: "building", name: "Wohnblock Lerche", rect: [260.5, 2, 254.5, 95.5], status: "block", room: "cam24", chapter: 1, note: "Ines wohnt hier. Lage frei gewählt: nahe der Klinik und dem Sumpf-Abgang." },
    { id: "sumpf_abgang", kind: "place", name: "Sumpf-Abgang", rect: [493, 805, 80, 36], status: "block", room: "cam30", chapter: 1, note: "Eine Treppe ins Wasser, LINE 31 – CLOSED, die Pegeltafel (LOW TIDE, FRI 23:00)." },
    { id: "fischmarkt", kind: "street", name: "Platz am Alten Fischmarkt", rect: [80, 60, 180, 110], status: "gemalt", room: "cam18", chapter: 1, note: "Ein nasser Platz, die Treppe hinunter zum alten Fischmarkt; über die Stufen ein großer Fisch, ganz nur von oben zu sehen." },
    { id: "morpheus", kind: "building", name: "Kapselhotel Morpheus", rect: [1000, 110, 130, 90], status: "block", room: "cam15", chapter: 1, note: "Ein Gang mit Kapseln. Kessler versteckt sich hier (Auftrag A). Lage frei gewählt." },
    { id: "yuen", kind: "building", name: "Imbiss Yuen", rect: [1153, 311, 100, 60], status: "gemalt", room: "cam04", chapter: 0, note: "Der Imbiss an der Ecke bei der Ostbrücke. Kessler und Varga im Prolog." },
    { id: "ostbruecke", kind: "street", name: "Ostbrücke", rect: [1153, 371.5, 297, 35], status: "gemalt", room: "cam03", chapter: 0, note: "Die Brücke über den Ostkanal; Kessler wartet im Prolog unter dem Vordach." },
    { id: "revier9", kind: "building", name: "Revier 9", rect: [1429, 135.5, 152, 82], status: "geplant", chapter: 2, note: "Die Wache von Lieutenant Morrow. Lage frei gewählt." },
    { id: "pumpenhalle", kind: "building", name: "Pumpenhalle 3", rect: [1400, 515.5, 170, 100], status: "geplant", chapter: 2, note: "Wo Teo arbeitet: das Tosen des Meeres, Wartungstunnel, Tinte im Filterbecken. Lage frei gewählt, am Meer." },
    { id: "cam03", kind: "cam", name: "CAM 03", at: [1156.5, 405.5], dir: 335, status: "gemalt", room: "cam03", chapter: 0, note: "Ostbrücke." },
    { id: "cam04", kind: "cam", name: "CAM 04", at: [1248, 316], dir: 165, status: "gemalt", room: "cam04", chapter: 0, note: "Imbiss Yuen, innen." },
    { id: "cam07", kind: "cam", name: "CAM 07", at: [497.5, 436], dir: 270, status: "gemalt", room: "cam07", chapter: 1, note: "Jade Row, hoch am Ende zur Kowalski: das Bild der Jade Row." },
    { id: "cam07v", kind: "cam", name: "CAM 07V", at: [509, 349], dir: 180, status: "gemalt", room: "cam07v", chapter: 1, note: "Der Automat gegenüber: Okonkwos Laden." },
    { id: "cam15", kind: "cam", name: "CAM 15", at: [1064.5, 198], dir: 270, status: "block", room: "cam15", chapter: 1 },
    { id: "cam18", kind: "cam", name: "CAM 18", at: [258, 126.5], dir: 210, status: "gemalt", room: "cam18", chapter: 1, note: "Von der Laterne senkrecht hinab." },
    { id: "cam21", kind: "cam", name: "CAM 21", at: [564.5, 716.5], dir: 0, status: "block", room: "cam21", chapter: 1, note: "Über der Klinik-Tür nach draußen (Variante B, 2026-11-12)." },
    { id: "cam22", kind: "cam", name: "CAM 22", at: [621.5, 693.5], dir: 195, status: "block", room: "cam22", chapter: 1, note: "Pho Pump, über der Theke." },
    { id: "cam23", kind: "cam", name: "CAM 23", at: [987.5, 703], dir: 315, status: "gemalt", room: "cam23", chapter: 1, note: "Das Bild des Waschsalons." },
    { id: "cam24", kind: "cam", name: "CAM 24", at: [310, 58], dir: 90, status: "block", room: "cam24", chapter: 1, note: "Türklingel, Fischauge." },
    { id: "cam30", kind: "cam", name: "CAM 30", at: [568.5, 836.5], dir: 200, status: "block", room: "cam30", chapter: 1, note: "Tief am Wasser, die Treppe hinauf." },
    { id: "frei_nord", kind: "free", name: "frei", rect: [769, 17.5, 160, 180] },
    { id: "frei_west", kind: "free", name: "frei", rect: [20, 250, 200, 360] },
    { id: "frei_ost", kind: "free", name: "frei", rect: [880, 230, 260, 80] },
    { id: "n_ines", kind: "note", name: "Offen", at: [20, 912], note: "Klinik, Pho Pump und Querstraße: Lage vorgeschlagen, nicht entschieden. Ines' Weg: Klinik 19:00, Pho Pump 19:15, Waschsalon 20:00, nach Hause 20:30, Sumpf-Abgang (Do 20:15, Fr 22:30), Metro 31 Fr 23:00." },
    // ================================================================ Drain-Markt
    { id: "drain_markt", kind: "room", name: "Drain-Markt", label: [540, 260], level: "markt", rect: [59, 30, 960, 540], outdoor: true, status: "gemalt", room: "drain_market", chapter: 1, camera: { top: true }, doors: { up: { at: [902, 514.5], to: "gasse/market" }, curtain: { at: [152, 144], to: "sable/curtain" } }, note: "Der Schwarzmarkt im trockengelegten Flutkanal, unter der Stadt, von oben gemalt. Hier gedreht: Die Treppe zur Gasse ist im Bild oben links, also liegt das Bild mit seinem oberen Rand nach Süden zur Gasse." },
    { id: "sable", kind: "room", name: "Sables Bude", level: "markt", rect: [117, 70, 70, 56], within: "drain_markt", status: "gemalt", room: "sable_booth", chapter: 1, camera: { at: [152, 52], dir: 90 }, doors: { curtain: { at: [152, 126], to: "drain_markt/curtain" } }, note: "Hinter dem Vorhang in der Südwand des Markts (im Bild unten), unter dem Rand des Kanals; hier, gedreht, im Norden." },
    { id: "arrival", kind: "view", name: "Ankunft", level: "markt", at: [902, 560], dir: 270, status: "gemalt", room: "drain_arrival", camera: { at: [902, 560], dir: 270 }, note: "Der Blick von der Treppe hinab in die Schlucht (drain_arrival)." },
    { id: "pfeiler", kind: "place", name: "Pfeiler", level: "markt", at: [569, 350], status: "gemalt", room: "drain_market", note: "Der Pfeiler der Stadt im Markt. Ob die Aufzüge nach oben (Transitachse) in ihm fahren: offen." },
    // ================================================================ Sümpfe, Metro
    { id: "metro31", kind: "place", name: "Alte Metro, Linie 31", level: "tief", poly: [340, 840, 440, 900, 700, 920, 880, 910, 900, 950, 700, 960, 420, 935, 320, 860], status: "gemalt", room: "cam31", chapter: 1, note: "Der Bahnsteig unter Wasser, Notlicht. Freitag 23:00 das Treffen; der Mord." },
    { id: "suempfe", kind: "place", name: "Die Sümpfe", level: "tief", rect: [1157.5, 854, 437, 143.5], status: "geplant", chapter: 2, note: "Überflutete Straßen der alten Stadt unter dem Neunten. Lanterns Versteck." },
    { id: "cam31", kind: "cam", name: "CAM 31", level: "tief", at: [720, 935], dir: 180, status: "gemalt", room: "cam31", chapter: 1, note: "Nur über das alte Protokoll." },
    { id: "torweg_2", kind: "street", name: "Torweg", poly: [512.5, 368.5, 553.5, 368, 552, 413.5, 520, 413.5, 520.5, 394, 514.5, 395.5], status: "idee", note: "Der Weg durch das Haus vom Tor der Kowalski-Straße (in ihrer Ostfassade) zum Torbogen in der Nordwand der Gasse." },
    { id: "Weg_1", kind: "street", name: "Weg_1", poly: [260, 99, 514.5, 99, 514.5, 202.5, 463, 202.5, 463, 145.5, 260, 146], status: "idee", note: "Der Weg durch das Haus vom Tor der Kowalski-Straße (in ihrer Ostfassade) zum Torbogen in der Nordwand der Gasse.", camera: { top: true } },
    // ================================================================ ergänzt 2026-11-18 (Claude): was das Spiel hat und hier fehlte, und was geplant ist
    { id: "lerche_eg", kind: "room", name: "Lerche, Erdgeschoss", rect: [262, 5.5, 150, 90], status: "geplant", room: "lerche_eg", chapter: 2, doors: { street: { at: [312, 95.5] }, stairs: { at: [281, 23.5], to: "lerche_flur/stairs" }, lift: { at: [347.5, 9.5], to: "lerche_flur/lift" } }, note: "Neu (Entwurf 2026-11-18): der Eingang mit Briefkästen, der Treppe nach oben und einem Aufzug, der fährt; die Haustür zu Weg_1 hat das Zahlenfeld und die Klingelkamera (CAM 24). 5 x 3 m wie der Flur darüber: größer als das Haus hier.", camera: { at: [408, 91.5], dir: 225 } },
    { id: "lerche_flur", kind: "room", name: "Lerche, Flur 4. Stock", level: "lerche4", rect: [261, 4.5, 122, 92], status: "block", room: "lerche_flur", chapter: 2, doors: { stairs: { at: [278.5, 23.5], to: "lerche_eg/stairs" }, lift: { at: [346, 10.5], to: "lerche_eg/lift" }, door_4b: { at: [373.5, 68.5], to: "ines_wohnung/door" } }, note: "Ein Treppenhausflur, 5 x 3 m: 4A, 4B, 4C, der Zählerkasten, die Treppe, der Aufzug an derselben Stelle wie unten, CAM 25 in der Ecke." },
    { id: "ines_wohnung", kind: "room", name: "Ines' Wohnung (4B)", level: "lerche4", rect: [384.5, 3.5, 129.5, 93], status: "block", room: "ines_wohnung", chapter: 2, doors: { door: { at: [397, 69], to: "lerche_flur/door_4b" } }, note: "4 x 4 m, ausgeräumt. Lage frei gewählt: hinter 4B, westlich des Flurs; über keinem Haus, solange der Wohnblock hier so klein ist." },
    { id: "cam25", kind: "cam", name: "CAM 25", level: "lerche4", at: [267, 92], dir: 330, status: "block", room: "cam25", chapter: 2, note: "Das Bild des Flurs im 4. Stock." },
    { id: "klinik_raum", kind: "room", name: "Lull-Klinik 9-Ost, innen", rect: [457, 585, 115, 150], within: "klinik", status: "gemalt", room: "klinik", chapter: 2, note: "6 x 4 m. Im Spiel erreicht Juno sie über das Tor der Jade Row (eine Auswahl, kein Weg); hier liegt sie am Vorschlag der Querstraße, weit von Weg_1: Das passt noch nicht zusammen (siehe die Notiz)." },
    { id: "lantern_versteck", kind: "room", name: "Lanterns Wohnwagen", level: "tief", rect: [1387.5, 869.5, 150, 75], within: "suempfe", status: "gemalt", room: "lantern_versteck", chapter: 2, note: "Der Wohnwagen auf Pontons, 5 x 2,5 m, von innen." },
    { id: "sumpf", kind: "view", name: "Sumpf", level: "tief", at: [1064, 947], dir: 270, status: "gemalt", room: "sumpf", chapter: 2, camera: { at: [1397, 1168], dir: 270 }, note: "Die Bühne von der Seite: der ertrunkene Wald, das Floß, der Wohnwagen." },
    { id: "sumpf_fahrt", kind: "view", name: "Floßfahrt", level: "tief", at: [1023, 1173], dir: 270, status: "gemalt", room: "sumpf_fahrt", chapter: 2, note: "Die Fahrt auf Pikes Floß vom Markt in die Sümpfe." },
    { id: "funk", kind: "place", name: "Lanterns Mast", level: "tief", at: [1563, 961], status: "gemalt", room: "funk", chapter: 2, note: "Wo Juno den Sender stimmt („Auf Sendung“)." },
    { id: "flossweg", kind: "water", name: "Floßweg", level: "tief", poly: [1019, 470, 1060, 470, 1060, 800, 1019, 800], status: "vorschlag", chapter: 2, note: "Wohin der Kanal des Drain-Markts führt: hinaus in die Sümpfe (Vorschlag aus kapitel2-design §9.4)." },
    { id: "dach_sitzen", kind: "view", name: "Unser Platz", level: "dach", at: [700, 330], dir: 270, status: "gemalt", room: "dach_sitzen", chapter: 1, note: "Juno (und am Montag Teo) auf ihrem Platz am Dachrand." },
    { id: "dach_blick", kind: "view", name: "Blick nach oben", level: "dach", at: [720, 320], dir: 270, status: "gemalt", room: "dach_blick", chapter: 1, note: "Der Blick hinauf zu den Ringen." },
    { id: "n_weg1", kind: "note", name: "Offen (2026-11-18)", at: [20, 960], note: "Weg_1 verbindet das Tor der Jade Row mit dem Wohnblock Lerche und dem Alten Fischmarkt (der Nutzer). Offen: 1. Die Klinik liegt im Plan an der Querstraße, im Spiel kommt man durch dasselbe Tor hin: an Weg_1 legen oder das Tor zwei Wege führen lassen? 2. Der Wohnblock Lerche ist hier 3,7 x 3 m, sein Erdgeschoss und der Flur sind 5 x 3 m, Ines' Wohnung braucht 4 x 4 m daneben. 3. CAM 24 (die Klingelkamera) muss zeigen, was Weg_1 vor der Haustür zeigt (ein Ort, ein Bild)." },
    { id: "flutwerk_steg", kind: "street", name: "Steg zum Flutwerk", rect: [1233, 574, 167.5, 21], outdoor: true, status: "vorschlag", chapter: 3, note: "Kapitel 3 (Entwurf): der Steg am Wasser entlang zum Tor der Pumpenhalle 3. Wo er abgeht (aus der Gasse?), entscheidet der Nutzer; Lage frei gewählt." },
    { id: "flutwerk_tor", kind: "place", name: "Tor des Flutwerks", at: [1400, 583.5], status: "vorschlag", chapter: 3, note: "Kapitel 3 (Entwurf): FLUTWERK – PUMP HALL 3 – NO ENTRY, daneben die Personaltür mit dem Zahlenfeld; Teos PIN ist 2074, das Jahr vom Dach. Ein Hotspot am Ende des Stegs, kein eigener Raum." },
    { id: "becken_raum", kind: "room", name: "Becken-Raum", rect: [1470, 565.5, 90, 45], within: "pumpenhalle", status: "geplant", chapter: 3, note: "Kapitel 3 (Entwurf): ganz unten im Schacht neben dem Filterbecken, eine Glaswand, dahinter Tinte; die Spinde der Schicht. Im Spiel etwa 6 x 4 m, hier nicht maßstäblich, weil die Halle selbst nur geplant ist." },
    { id: "cam33", kind: "cam", name: "CAM 33", at: [1322.5, 620.5], dir: 330, status: "gemalt", room: "cam33", chapter: 2, note: "Oben am Rand des Schachts der Pumpenhalle 3, steil hinunter; das Netz des Flutwerks. Lage frei gewählt." },
    { id: "transit_neun", kind: "building", name: "Kontrollpunkt Transitachse", rect: [770.5, 17.5, 163, 176], status: "vorschlag", chapter: 3, note: "Kapitel 3 (Entwurf): im Neunten am Fuß des Turms, wo die Aufzüge der Transitachse in den Schacht steigen; RING 5 – WORK PERMIT ONLY. Juno wird hier abgewiesen, Morrow fährt dienstags um 20:00 hinauf. Lage frei gewählt: Der Nutzer setzt ihn an die richtige Stelle." },
    { id: "kanal_ost_2", kind: "water", name: "Seitenarm", label: [1501.5, 414], rect: [1401, 407.5, 200.5, 99.5] },
  ],
};
