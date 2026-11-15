# Prolog „Nachtschicht": Design (und die Grundregeln von Deck und Feed-Modus)

Stand: Entwurf (2026-11-03). Story: `docs/story.md` (§7 Prolog). Stil: `docs/style-guide.md`.
Dieses Dokument legt auch die **Regeln fest, die das ganze Spiel benutzt**: das Deck (§2), den
Feed-Modus (§3) und die Spielzeit (§4). Spätere Kapitel verweisen hierher.

Spieltexte sind Deutsch (die Zitate hier sind die gemeinten Zeilen, noch kein Endtext). IDs sind
englisch, wie in der Engine.

## 1. Überblick

| | |
|---|---|
| Länge | etwa 30–40 Min. |
| Bringt bei | das Deck und EVI, Feed-Modus (zusehen, markieren, zuhören, zoomen, Kamera verbinden, aufzeichnen), Verkaufen, Straßenmodus, das Kassenbuch |
| Orte, Straßenmodus | `flat`, `kessel_14`, `kessel_lobby`, `kowalski` (4) |
| Kameras, Feed-Modus | `cam03` (Ostbrücke), `cam04` (Imbiss Yuen) (2) |
| Figuren | Juno, EVI; Herr Kessler, Frau Kessler (nur Nachrichten), Gus Varga; Sable (nur Nachrichten); Motte, Frau Haldane, Bao |
| Zeit | eine Nacht, 21:30 bis etwa 01:00 |
| Ende | der Werbebildschirm sagt „JUNO." |

## 2. Das Deck

Junos selbstgebauter Rechner. Er steht auf dem Schreibtisch in `flat`; unterwegs trägt Juno das **Taschen-Deck** in ihrer
Umhängetasche, ein kleines Handgerät, auf dem EVI mitkommt (story §10b). Das Deck ist ein **echter Computer der Zukunft**, so wie man ihn
erwarten würde: ein Desktop mit Symbolen, Fenster, ein Messenger, Benachrichtigungen, Dateien mit
Persönlichkeit. Und darauf lebt **EVI** (§2.2).

Wer das Deck benutzt, sieht einen **Vollbild-Schirm** (eine eigene UI-Ebene, kein Raum), 320x180 wie
alles. Vor dem Bau kommt ein Mockup (`docs/mockups/mock_f_deck`), das Lesbarkeit und Platz prüft.

### 2.1 Der Desktop

```
┌────────────────────────────────────────────────────────────────┐
│ DECK // J.REYES                   ✉2   21:30  2091-11-06   0 CH │  Kopfleiste, 10 px
├──────────┬─────────────────────────────────────────────────────┤
│ [GLASS]   │ ┌ CHAT ─────────────────────────────────────── x ┐ │
│ [CHAT]●  │ │ Kontakte      │ M. KESSLER                     │ │
│ [CACHE]  │ │ ▸ M. KESSLER● │ > Mein Mann kommt seit Wochen  │ │  ein App-Fenster
│ [BUCH]   │ │   SABLE       │   spät ...  [FOTO]             │ │  (eins zur Zeit,
│ [KONTO]  │ │   TEO  schläft│                                │ │   etwa 230x150)
│ [NETZ]   │ │               │ ( Antwort 1 ) ( Antwort 2 )    │ │
│ [RADIO]  │ └───────────────┴────────────────────────────────┘ │
│ [MÜLL]   │  steuer_2089_NICHT_ÖFFNEN.txt          (EVI)  ◕‿◕  │  EVIs Ecke
└──────────┴─────────────────────────────────────────────────────┘
```

- **Hintergrund:** ein altes Foto, Juno und Teo als Kinder auf einem Dach, im Regen, stark gedimmt.
  Ein paar Dateien liegen herum (`steuer_2089_NICHT_ÖFFNEN.txt`, `ESSEN!!.txt`): Ansehen gibt Junos
  Kommentar, manchmal EVIs.
- **Symbole** (24x24, 3x5-Beschriftung) links in einer Spalte. Ein Klick öffnet die App als Fenster.
  Es ist immer **ein** Fenster offen; frei verschiebbare Fenster wären auf 320 px nur fummelig. Ein
  Punkt am Symbol heißt: neu.
- **Kopfleiste:** links der Name des Decks, rechts ungelesene Nachrichten, Uhrzeit, Datum, Chits, die
  Knöpfe WARTEN und ZURÜCK.
- **Benachrichtigungen:** Eine neue Nachricht fährt oben rechts als kleine Karte herein (Absender in
  seiner Sprecherfarbe, die erste Zeile). Das geht auch im **Feed-Modus** (im OSD) und im Straßenmodus
  (aus der Tasche, mit EVIs Kopf). Ein Klick darauf öffnet den Chat.
- **Hochfahren:** Beim ersten Öffnen einer Nacht ein Boot von einer Sekunde (Zeilen, Störung, EVI
  wacht auf und reibt sich die Augen). Danach öffnet das Deck sofort.

| App | Was sie zeigt | ab |
|---|---|---|
| **GLASS** | die Netzkarte: der Stadtplan des Viertels als Linien, jede bekannte Kamera ein Punkt. Verbundene Kameras leuchten; ein Klick öffnet den Feed-Modus. Unverbundene sind grau und zeigen, was zum Verbinden fehlt. | Prolog |
| **CHAT** | der Messenger (§2.3) | Prolog |
| **CACHE** | Junos Dateien: Clips (Filmstreifen), Standbilder, Notizen (Karteikarten), mit Metadaten (wer, wo, wann). Das Inventar des Feed-Modus (8 Plätze). Ein Clip öffnet sich im **Clip-Editor** (§2.4). | Prolog |
| **BUCH** | das Kassenbuch: jede Lieferung, was, an wen, für wie viel, und später, was daraus wurde (Story §5). | Prolog |
| **KONTO** | Chits, die Miete mit der Hüllenabgabe (die Flutschuld, Story §3), Schulden bei Bao. | Prolog |
| **NETZ** | Nagi·wa-Net: Nachrichten („Kriminalität im Neunten auf Rekordtief"), Werbung (englisch, Stadtschrift), das **Glasser-Brett** (ein Forum: Gerüchte über Sinker, Codes zu verkaufen, Hilferufe, aus denen kleine Aufträge werden), Anzeigen für NINTH LIVE. Ändert sich jeden Abend; billiger, wirksamer Weltbau. **Ein kleiner Browser** (`game/netz.js`, 2026-11-08): Lesezeichen START, NAGI·WA, BRETT, ARCHIV, SUCHE und ZURÜCK; die Einträge der Startseite stehen in festen Zeilen (`slot`) und öffnen ihre Seite (`page`): einen Artikel (Nagi·wa: Lull, Rekordtief, Hüllenabgabe, Schlafstationen, Ruhe-Erschöpfung; NINTH LIVE), einen Thread des Bretts mit Antworten oder ein Stück des Archivs („Was das Wasser nahm“: die Flut, die Ringe, die Gezeitenleute). Die Suche ist von Anfang an da, ohne Tippen: die Begriffe, die Juno kennt, als Knöpfe, und nicht alles ist schon zu finden („Sinker“: „Keine Treffer. Meinten Sie: Ruhe-Erschöpfung?“). Nur Welt, keine Hinweise (Hinweise und Wissen nur, wo es wirklich nötig ist); die offene Seite und woher sie kam sind View-Flags (`netz_page`, `netz_from`). | Kap. 1 (im Prolog nur die Startseite) |
| **RADIO** | Drei Sender zum Anklicken, AUS schaltet ab (`game/radio.js`, 2026-11-08): **NINTH FM** 88.4 (Junos Thema; die Nachtsendung des Neunten), **NAGI·WA EASY** 101.0 (eigener glatter Muzak in F-Dur; Nagi·was Ansage), **KESSEL ROOFTOP** 94.2 (eigenes Lo-fi; jemand im Block legt Platten auf). Die Musik läuft auf dem Deck und in der Wohnung durch den Lautsprecher, draußen spielt der Raum seine eigene. Solange das Fenster offen ist, spricht der Moderator zwischen den Stücken, alle 9 Sekunden eine Zeile, manche nur an ihrem Abend (Text; eine Sprachsynthese später). Der Sender ist ein View-Flag (`radio`). Ab Kap. 2 Lanterns Piratensender, wenn Juno die Frequenz kennt. | Prolog |
| **MÜLL** | der Papierkorb: Junos Kündigungsschreiben von Nagi·wa (nie geöffnet), Entwürfe von Nachrichten an Teo, die sie nie geschickt hat. Kür, keine Rätsel. | Prolog |

Kleinkram mit Persönlichkeit, nur wenn Zeit ist: ein Patience-Spiel, das EVI schlecht spielt
(„Ich glaube, die Karten mögen mich nicht."), ein Bildschirmschoner, wenn Juno lange nichts tut (EVI
schläft ein, `zzz`).

- **Verkaufen** heißt: im Chat einen Clip oder eine Notiz aus dem Cache an einen Kontakt senden
  (Knopf `ANHANG`, dann die Datei wählen). Jeder Kontakt zahlt anderes für anderes. Sable kauft fast
  alles, zum halben Preis.
- **Shine** ohne Clip (ein Name, ein Ort, ein Code) entsteht, wenn Juno etwas herausfindet: Es landet
  als Notiz im Cache.
- **Gestaltung:** die Straßenmodus-Farben (Stahl `1`–`6`, Cyan `cCvV`), die Schrift 5x7 für Text, die
  3x5 für Beschriftungen, Rahmen aus 1-px-Linien, Symbole als Pixelgrafik mit Umriss. Kleine
  Bildschirmstörungen beim Öffnen. In Kap. 3 wird das Deck zerstört; das zweite Deck in Kap. 4 ist
  zusammengeflickt, Bernstein statt Cyan, und hat anfangs nur GLASS, CHAT und CACHE.

**Entschieden mit Mockup F** (2026-11-04, `docs/mockups/mock_f_deck_*`):
- Die acht Symbole stehen in zwei Spalten zu je vier (24x24 passen nicht in eine Spalte); das App-Fenster
  ist etwa 240x137, der Schließknopf sitzt auf der oberen Rahmenlinie gegenüber dem Titel-Tab.
- **EVIs Zeilen** stehen auf dem Deck im Streifen unter dem Fenster, links neben ihr (über ihr liegt das
  Fenster), höchstens zwei Zeilen, in Minze mit Tuschekante.
- **Auf dem Deck ist EVI selbst der Hinweis-Knopf**: ein Klick auf sie gibt den Hinweis; die Tasche und
  der Knopf unten rechts sind auf dem Deck ausgeblendet. Fährt der Zeiger über sie, reagiert sie mit
  einer kleinen Animation (schaut hoch, Ohren zucken), und ihr Name erscheint als Hover-Label.
- Im Clip-Editor ist der Abspielkopf in Junos Gelb (ihr Blick), der Schnitt in Cyan-Klammern.
- Sprecherfarben: Frau Kessler Bernstein, Sable Magenta, Teo Orange (Style Guide §8).
- Das Hintergrundfoto ist gemalt und animiert (`art/ui/deck_wallpaper.px.js`: Juno und Teo als Kinder auf
  der Brüstung, Kanal, NOODLES, der NAGI·WA-Schirm mit Sonnenaufgang, die Unterseite des Rings, eine
  Dachkamera). Ein Klick auf den Hintergrund zeigt es ganz, mit der Musik „memory" (Blade Runner im
  Geist, eigene Melodie); ein Klick schließt es. Ansehen: Junos Zeile, EVI: „Ihr seid sehr klein darauf."

**Gebaut** (H2b, 2026-11-04; `game/deck.js`, `game/evi.js`, Bilder: `docs/mockups/game_*`):
- Was offen ist, ist ein **Ansichts-Flag** (`deck_app`: `glas`, `chat`, `chat_<kontakt>`, `clip_<cache-id>`,
  `photo`, ...): gespeichert, aber kein Spielstand für den Solver (Engine `state.view`). Regel: eine
  Ansicht ändert, was man klicken kann, nie, was ein Klick tut. Die Wohnung schließt das Fenster
  (ihr `enter`).
- Der **Chat** zeigt die Kontakte (Status, Punkt für Neues), den Verlauf von unten nach oben (Fotos und
  Clips als Karten, Junos Nachrichten rechts in Gelb), Pfeile zum Zurückblättern (Kontakte und Nachrichten scrollen pixelweise, auch per Mausrad und mit dem Finger), Junos Antworten
  nummeriert unten. Die Inhalte (Kontakte, Verläufe, Antworten) kommen aus dem Kapitel
  (`Nagiwa.contacts`, `threads`, `replies` in `game/prolog.js`).
- **EVI** ist eine Stimme mit eigenem Platz für ihre Zeilen (rechtsbündig neben ihrer Ecke und der
  Tasche), sie sagt die Hinweise (in ihrem Ton), zeigt Gesichter, zeigt auf Apps, das Deck fährt beim
  ersten Öffnen hoch, Nachrichten kommen als Karte oben rechts (in jedem Modus).
- **Der Clip-Editor:** ein Clip im CACHE öffnet sich (Bild, wo, wann, wie lang, wer, Zeitleiste mit
  Momenten und Personen). **Schneiden** behält einen Moment und macht daraus einen neuen Clip
  (`clip_kessler_cut`, „KESSLER, RING (12 S)"). Dann fragt EVI (Schritt 9); „Ist es." und „Nein." heben
  `evi_trust` um 1, Schweigen nicht. **P1 „Nur den Ring" braucht jetzt den geschnittenen Clip.**
- Die Notiz `note_kessler_debt` entsteht schon beim Ring-Moment (Schritt 8), nicht erst beim Schnitt.

### 2.2 EVI

EVI ist der ausgemusterte Prototyp EVAL-7 der „automatischen Auswertung" (Story §4, §6). Für den
Spieler ist sie zuerst einfach die niedliche KI auf dem Deck. Was sie wirklich ist, erfährt man in
Kapitel 2.

- **Wesen:** neugierig, lieb, leicht zu begeistern. Gut mit Daten, Kameras, Codes, Zeitstempeln.
  **Hoffnungslos schlecht darin, Menschen zu lesen**: Weinen hält sie für Regen im Gesicht, eine
  Umarmung für einen Ringkampf, Kesslers Nervosität für Kälte („Er zittert. Soll ich die Heizung im
  Imbiss hochdrehen?"). Ab und zu liegt sie erschütternd richtig, und das sind die Stellen, die
  hängen bleiben.
- **Sie fragt.** EVI will verstehen, warum Menschen Dinge tun: „Warum isst du Nudeln aus dem Becher,
  wenn es Teller gibt?", „Freut sich Frau Kessler jetzt?" Sie urteilt nie. Ihre Fragen sind der
  Spiegel, den das Kassenbuch nicht sein darf.
- **Wie sie spricht:** kurze Sätze, Namensschild `EVI` in `#8ef5d8`. Ihre Laune zeigt ihr Gesicht,
  nicht Emojis im Text.
- **Aussehen:** ein kleines rundes Pixelwesen mit großen Augen und zwei Antennen-Ohren. Auf dem
  Desktop etwa 24 px, in ihrer Ecke rechts unten, manchmal läuft sie zu einem Fenster, um etwas zu
  zeigen. Sechs Gesichter: froh, neugierig, verwirrt, besorgt, müde, Glitch. Idle: blinzeln, Ohren
  wackeln; nach langer Ruhe schläft sie ein.
- **Was sie im Spiel tut:**
  - **Sie erklärt das Deck** im Prolog, in ihrer eigenen Stimme, statt Tutorial-Kästen (§6.2).
  - **Sie meldet** neue Nachrichten und erinnert an Fristen.
  - **Sie gibt die Hinweise** (§6.5). Der Hinweis-Knopf unten rechts ist EVI, die aus der Tasche
    schaut; so ist sie überall da, auch auf der Straße. Ihre Hinweise sind immer **richtig und
    klar**: Daten liest sie gut, nur Menschen nicht. Ein Hinweis über Menschen klingt bei ihr nach
    Daten („Frau Kessler hat ein Foto geschickt. Das hellste Pixel darauf ist der Schal.").
  - **Sie kommentiert** im Feed, wenn Juno sie fragt (Rechtsklick auf EVIs Kopf im OSD), nie
    ungefragt mitten in einem Moment.
- **EVI ist keine innere Stimme** (Dialog-Design §2): Die sechs Stimmen sind *in* Juno, EVI ist ein
  Gegenüber, mit dem Juno redet und das antwortet. Damit es nicht zu viele Stimmen werden, spricht EVI
  vor allem auf dem Deck und kurz.
- **Flags:** `evi_trust` (0–3, wie offen Juno zu EVI ist: Antworten auf ihre Fragen; es geht über die Kapitel mit, seine
  Aufgabe ist noch offen, `kapitel2-design` §14), später
  `evi_knows` (Kap. 2), `evi_backup` / `evi_witness` (Kap. 4, Story §7).

### 2.3 Der Messenger (CHAT)

- **Verläufe pro Kontakt**, wie in einem Messenger: links die Kontakte mit Status, rechts der Verlauf.
  Nachrichten können Text, Foto, Clip, Notiz oder ein Sticker sein. Sables Nachrichten bestehen oft nur
  aus einem Sticker und einer Zahl.
- **Status:** `online`, `abwesend`, **`schläft`**. Lull-Nutzer stehen fast immer auf `schläft`: Frau
  Haldane immer, Teo von Kapitel zu Kapitel öfter. (Ein leises Vorzeichen für Kap. 2.)
- **Antworten** sind Auswahlen (2–4 vorformulierte Sätze), keine Freitexte. Juno „tippt" sichtbar
  (drei Punkte), bevor ihre Antwort erscheint. Antworten können Prüfungen der inneren Stimmen tragen
  (Dialog-Design §3).
- **Nachrichten kommen nach der Spieluhr** (eine Tabelle pro Abend, wie die Abläufe der Figuren). Was
  ankommt, während Juno im Feed oder auf der Straße ist, meldet eine Benachrichtigung.
- **Gelesen** zeigt ein Häkchen; Kontakte reagieren darauf („Ich seh, dass du's gelesen hast, Juno.").
- **Spam und Werbung** als eigener Kontakt `NAGI·WA SERVICE` (englische Betreffzeilen, deutscher
  Text): „Lull: jetzt gratis", „Ihre Hüllenabgabe wurde angepasst".

### 2.4 Der Clip-Editor

Ein Clip im Cache öffnet sich als Zeitleiste mit seinen Momenten (`kessler_ring`) und den Menschen
darin. Was Juno damit tun kann, wächst über das Spiel:

| Werkzeug | Was es tut | Folge | ab |
|---|---|---|---|
| **Schneiden** | einen Moment allein behalten | der Clip erzählt etwas anderes (Entscheidung P1) | Prolog |
| **Anonymisieren** | Gesichter einzelner Personen verpixeln | der Clip ist weniger wert (manche Käufer nehmen ihn gar nicht: Vesper, Story §9), aber die Gefilmten sind geschützt; der Eintrag im Kassenbuch sagt „anonymisiert" | Kap. 1 (gebaut: ein Klick verpixelt das ganze Bild und alle Namen in Junos Kopie, für immer; in Kapitel 1 kauft niemand anonymisierte Clips, `kapitel1-design` §7) |
| **Prüfen** | einen fremden Clip neben einen eigenen oder den Puffer legen und Schnitte finden (Zeitstempel, Regen, Licht, fehlende Dinge); auch Daten mit Zeitstempeln, etwa Schlafprotokolle, gegen die eigenen Clips legen und Übereinstimmungen finden | entlarvt Fälschungen; ein Rätsel am Schreibtisch | Kap. 2 (gebaut 2026-11-15, `game/pruefen.js`: zwei Clips über einer Zeitleiste, erst eine Stelle anklicken, dann den Fund im Bild, die Funde der Reihe nach; oder Daten über den Clips im CACHE, erst den Clip, dann die Spitze; `kapitel2-design` §2.1) |
| **Montieren** | einem Moment einen anderen Zeitstempel geben oder Momente aus zwei Clips zu einem zusammensetzen (in Kap. 2 das Erste, `kapitel2-design` §6.2) | eine Fälschung, die Juno selbst macht; eine Wahl mit Gewicht, nie nötig für die Hauptgeschichte | Kap. 2 |

Alle Werkzeuge sind Klicks auf die Zeitleiste und die Personen, keine Fingerfertigkeit.

## 3. Feed-Modus: die Regeln

Ein Feed ist ein **Raum ohne Juno**: der Blick einer Kamera, im Phosphor-Look (Style Guide §9). Die
Menschen darin sind Figuren mit Tagesabläufen (§4). Die Maus bedient das Implantat.

| Aktion | Wie | Was passiert |
|---|---|---|
| **Ansehen** | Rechtsklick auf Person oder Ding | Juno kommentiert (ihre Stimme aus dem Off, als Untertitel unten) |
| **Markieren** | Linksklick auf eine Person | die Person bekommt eine Cyan-Klammer und ein Etikett (`UNBEKANNT`, später Name und Notizen). Markierte Personen erscheinen auf der Netzkarte als Punkt, solange eine verbundene Kamera sie sieht. Höchstens 3 Markierungen zugleich. |
| **Folgen** | eine markierte Person verlässt das Bild | die Kamera-Leiste unten blinkt bei der Kamera, in der sie als Nächstes auftaucht (wenn verbunden). Klick darauf wechselt. Ist dort keine verbundene Kamera, zeigt die Netzkarte einen Pfeil in die Richtung, und die Spur reißt ab. |
| **Zoomen** | Linksklick auf ein Ding (oder Mausrad) | ein Zoomfenster zeigt den Ausschnitt dreifach vergrößert (eigene, detailliertere Grafik pro Zoom-Ziel: Gesichter, Tastenfelder, Aufkleber, Bildschirme). |
| **Zuhören** | automatisch bei markierten Personen | was sie sagen, erscheint in der Tonleiste unten (`KESSLER> ...`). Je weiter weg von der Kamera, desto mehr Wörter fehlen (`... bring's ... alles.`). Regen, Lärm, Musik verschlechtern es. Das Richtmikro (ein Werkzeug, Kap. 2) hilft. |
| **Aufzeichnen** | der REC-Knopf | der Feed wird aufgezeichnet, bis Juno wieder klickt, die Kamera verlässt oder die Szene endet. Was in dieser Zeit im Bild geschieht (ein „Moment", siehe unten), wird zum Clip im Cache. |
| **Steuern** | Linksklick auf ein vernetztes Ding (Tür, Licht, Kamera, Automat) | nur mit Zugang: öffnen, schalten, Kamera schwenken (manche Kameras haben 2–3 Stellungen). Ab Kap. 1. |
| **Verlassen** | Esc oder der Knopf `DECK` | zurück zum Deck |

**Ein Ort, ein Bild** (entschieden 2026-11-09): Schaut eine Kamera auf einen Ort, an den Juno im
Straßenmodus gehen kann, ist ihr Feed **genau diese Szene**: das Iso-Bild des Raums mit seinen Props und
Figuren unter dem Feed-Filter, wie `cam14` den 14. Stock zeigt (höchstens verschoben, damit nichts unter
der Kameraleiste liegt, heller belichtet; die Kamera fehlt im eigenen Bild). Das hält beide Ansichten
gleich, und es gibt nur ein Bild zu malen. Nur Kameras auf Orte, die Juno nie betritt, dürfen eine
eigene Einstellung haben (von oben, Fischauge, gekippt).

**Momente.** Ein Feed zeigt Abläufe; wichtig für Rätsel sind **Momente**: Ereignisse mit einem
Namen, die ein Clip enthalten kann (`kessler_ring`: Kessler gibt Varga seinen Ehering). Ein Moment
geschieht zu seiner Zeit, ob jemand zusieht oder nicht. Damit kein Spieler hängen bleibt:

- **Wichtige Momente warten auf den Spieler**, wenn er der richtigen Person folgt (der Moment beginnt,
  sobald Juno auf der richtigen Kamera ist, innerhalb seines Zeitfensters).
- **Jede Kamera hat einen Puffer** mit den Aufnahmen der laufenden Nacht (bis Juno schläft). Was Juno
  verpasst hat, kann sie im Puffer zurückspulen und dort aufzeichnen (der Knopf `PUFFER` erscheint, wenn
  es dort etwas gibt, das sie braucht). Aufnahmen früherer Nächte liegen nur im Nagi·wa-Archiv (ein
  späteres Rätsel). (Geändert beim Bau von H2: ein 30-Minuten-Puffer hätte Sackgassen erzeugt.)
- Der Solver behandelt einen Moment als Zustand: gesehen, aufgezeichnet, verpasst.

**Verbinden.** Eine Kamera ist verbunden, wenn Juno ihren Zugangscode kennt. Codes findet man:
an der Kamera selbst (ein Aufkleber mit Kennung und Code, lesbar mit dem Zoom aus einer anderen Kamera
oder vor Ort), im Netz (gekauft bei Sable), durch eine Reparatur vor Ort (Straßenmodus), oder mit dem
alten Beobachter-Protokoll (nur bestimmte alte Kameras, Kap. 1).

## 4. Zeit

- Das Spiel hat eine **Uhr in Takten von 15 Minuten** (Uhrzeit auf dem Deck und, im Feed, im OSD).
  Die Uhr springt nicht von selbst weiter: Sie rückt vor, wenn Juno etwas tut, das Zeit kostet
  (geplant: ein Weg in einen anderen Bezirk, ein Auftrag, Essen; seit Kapitel 1 kosten Wege keine Zeit, die Uhr läuft nur beim
  Warten, `kapitel1-design` §2), oder wenn der Spieler im Feed **Vorspulen**
  wählt („bis zur nächsten Bewegung" oder „bis 03:00").
- Innerhalb eines Takts laufen die Figuren ihre Wege und Animationen in Echtzeit; die Zeit des Takts
  steht aber still, bis etwas sie weiterschiebt. Das hält Rätsel lösbar und den Solver endlich.
- **Tage:** Juno schläft in ihrem Bett, um zum nächsten Abend zu springen. Kapitel haben Fristen in
  Tagen (Miete in drei Tagen), nie in Minuten.
- **Abläufe** (die Routinen der Figuren) sind Tabellen: für jeden Takt, wo jemand ist und was er tut.
  Die Engine braucht dafür eine neue Fähigkeit (Style Guide §11, Punkt 4).

## 5. Vorspann: Die letzte Schicht (vor dem Titel, etwa 1:45 Min. nach den Zeiten in `game/intro.js`)

Eine Sequenz (wie das Intro der Loonies), überspringbar. **Sie läuft nur beim ersten Start** von selbst und ist im
Titelmenü jederzeit wieder abspielbar. Wo der Browser Ton erst nach einem Klick erlaubt, fragt nur dieser erste Start auf Schwarz danach (`gate: { introOnly }`). Sie endet auf dem **Titelbildschirm mit dem Glass-Sister-Logo** (die
Geschwister hinter dem gesprungenen Glas, `art/ui/splash.px.js`), der **bei jedem Spielstart** kommt, mit oder ohne
Vorspann; danach das Menü.

**Entschieden (2026-11-04, Storyboard als Blöcke: `art/test/intro_blocks.px.js`):** Der Anfang hat die Stimmung eines Neo-Noir-Vorspanns, mit eigenen
Bildern: **ein einziger, langsamer Flug**, tief über die Stadt bis zum Turm und durch ein Fenster in die
Beobachtungshalle. Die Aufzugfahrt (~10 s)
hat **keinen Text**: die Ringe rasen vorbei, dazu nur eine langsame, melancholische, eindringliche Melodie. **Der Satz über das Implantat steht nicht im Vorspann** (2026-11-04, das Intro erklärt es nirgends): Juno sagt ihn, wenn sie zum ersten Mal jemanden markiert (Kessler in `cam03`, §6). Das Deck
2091 bleibt, wie es ist (Röhrenmonitor und Maus, mit Absicht; story §10). **Der Flug und die Aufzugfahrt haben keine
Geräusche, nur Musik** (2026-11-04). Statt flammender Schlote stehen Kameramasten im Wasser (das Thema des Spiels).

| Einstellung | Bild | Ton und Text |
|---|---|---|
| A1 | **Über dem Lichtermeer**: Die Kamera schwebt tief und langsam vorwärts über das Meer über der ertrunkenen Stadt, voller Lichter bis zum Horizont (Pfahlhütten, Flöße, Bojen), einen dunklen Kanal entlang (in der Mitte keine Lichter); die **Kameramasten** der Stadt stehen im Wasser, Kameraköpfe mit glimmenden Linsen und blinkenden roten Augen (das Glass ist überall); der Dunst glimmt. In Perspektive gezeichnet (`game/intro.js`), die Kamera bewegt sich wirklich. | Nur Musik (`opening`). Unten: `NAGI·WA, 2088` |
| A2 | **Nagi·wa voraus** im Dunst, am Ende des Kanals: die neun Ringe übereinander, der Turm hindurch, sein Ringlogo; die Stadt **kommt näher** (sie wächst um etwa ein Viertel); Patrouillendrohnen leuchten das Wasser ab; Masten ziehen links und rechts vorbei, Transitkapseln. | Nur Musik |
| C | **Der Turm von nah**: Reihen dunkler Fenster, ein paar erleuchtet, ein Stockwerk glimmt phosphorgrün und wirft sein Licht auf die Fassade; die Kamera fliegt in gerader Linie auf ein Fenster zu (`game/intro_tower.js`), dahinter die Halle in der Tiefe: die Wand aus Bildschirmen, zwei Reihen Pulte, die Beobachter von hinten; am Ende füllt die Halle das Bild. | Musik, dann Brummen |
| 1 | **Die Beobachtungshalle**, Nagi·wa Tower, drei Jahre früher: Iso-Ansicht in Spielgröße (30 px pro Meter), die Halle ist größer als der Bildschirm und die Kamera fährt von der Ecke der Bildschirmwände hinunter über die Reihen bis zu Junos Pult in der vordersten Reihe. Vier Reihen zu fünf Pulten, jedes mit einem Menschen vor drei Monitoren; beide Rückwände sind Phosphor-Bildschirme, unter der Decke Kuppelkameras, die die Beobachter beobachten. Sie sitzen in runden Schalensesseln. **Keine Kabel** (2026-11-04): Das Implantat legt die Markierungen über das, was das Auge auf den Monitoren sieht, dafür braucht es keins; nur der kleine Cyan-Punkt hinter dem Ohr (dort, wo Teo seinen Lull-Punkt trägt: story §10b). Auf Junos Pult der Kaktus und die Tasse, über ihrem Sessel der gelbe Mantel. | Brummen, leises Tippen. Datum unten: `2088-04-30 05:45` |
| 2 | Juno an ihrem Pult, nah, von hinten: Die hohe Sessellehne verdeckt den Körper bis zum Kragen, zu sehen sind Kopf, Kragen, ein Streifen vom Arm und die Hand (Nagi·wa-Grau). Sie sitzt rechts im Bild und blickt nach links wie auf dem Titelbild. Ihr Bildschirm: die Kowalski-Straße (`CAM 2217`), Passanten, ein Mann bleibt stehen. Sie markiert ihn, die Klammern cyan wie immer (2026-11-05); dabei leuchtet der Punkt hinter ihrem Ohr auf. | Kein Text (2026-11-04): das Markieren reicht. Nur der Ton der Markierung |
| 3 | Eine Durchsage, Text über die ganze Breite | „Ab morgen übernimmt die automatische Auswertung. Nagi·wa dankt Ihnen für Ihren Dienst." |
| 4 | Die Bildschirme der Halle gehen aus, von hinten nach vorn: erst die Wände, von der Ecke aus, dann die Pulte Reihe für Reihe; wessen Bildschirm aus ist, hört auf zu tippen. Die Halle wird dunkel, die Kamera geht mit bis zu Juno, ihr Bildschirm brennt noch. Dann nah wie in Einstellung 2: Erst hier geht ihr Bildschirm aus, wie eine Röhre. In ihm spiegelt sich ihr Gesicht, das Gesicht vom Titelbild ohne Kapuze und ohne Linie, ihr zugewandt, nur als Raster, das nach hinten dunkler wird und sich auflöst. | Stille (die Musik blendet aus, das Brummen ist weg) |
| D | **Die Transitachse**, abwärts, die erste Seitenansicht: zuerst nah am Karton (ein Kaktus, eine Tasse und ein Datenstick mit dem Aufkleber `EVAL-7 // DELETE`, gemalt und englisch wie alle Technik der Stadt; eine Sekunde lesbar, nicht kommentiert), dann Juno mit dem Karton im gläsernen Aufzug, die Decks der Ringe rasen vorbei, Hochhäuser dazwischen, Lichtkegel und Schatten unter den Decks; nach unten hin mehr Neon und mehr Lull-Werbung (2026-11-05). **Juno ist die Figur von heute** (2026-11-04): Den gelben Mantel, der in der Halle über ihrem Sessel hing, trägt sie jetzt, die Kapuze unten; ihre Straßenfigur mit Atmen und Blinzeln, dazu der Karton (`art/intro/ride.px.js`). Etwa 14 s, **damit endet der Vorspann** (2026-11-05: Einstellung 6 „heute“ ist gestrichen, das heutige Deck zeigt erst der Prolog); das Bild blendet aus. | Kein Text. Die Melodie `descent`, sie klingt mit dem Bild aus |
| 7 | **Der Titelbildschirm** mit dem Glass-Sister-Logo (wie bei jedem Start), dann das Menü | Junos Thema |

## 6. Der Prolog Schritt für Schritt

### 6.1 Rätselkette

```
 flat: Juno am Deck, Auftrag von Frau Kessler
   │
 [A] cam03: Kessler unter den Leuten finden, die aus dem Bürohaus kommen ─ Foto im Cache: heller Schal
   │     markieren ─ zuhören: Telefonat ─ „Yuen's" (erst bruchstückhaft, dann klar unter dem Vordach)
   ▼
 [B] cam04 ist nicht verbunden ─ in cam03 die Kamera gegenüber zoomen: Aufkleber HCS-04 / Code
   │     ─ verbinden (Netzkarte) ─ Kessler folgen
   ▼
 [C] cam04, Imbiss Yuen: Kessler trifft Gus Varga ─ AUFZEICHNEN ─ Moment kessler_ring
   │     (Kessler zieht seinen Ehering ab und gibt ihn Varga; Varga: „Bis Freitag, Kessler.")
   ▼
 [D] Entscheidung P1: was Frau Kessler bekommt (Nachrichten) ─ Bezahlung ─ Kassenbuch
   │     optional: Shine an Sable verkaufen (Kessler, Schulden bei Varga)
   ▼
 [E] Hunger: der Kühlschrank ─ raus: kessel_14 (Frau Haldane, Motte) ─ kessel_lobby (Mietmahnung)
   ▼
 [F] kowalski: Bao ─ der Werbebildschirm: „JUNO." ─ Ende des Prologs
```

### 6.2 Die Schritte im Einzelnen

| # | Wo | Was passiert | Flags / Dinge |
|---|---|---|---|
| 0a | Deck | Das Deck fährt hoch. EVI wacht auf: „Guten Abend, Juno! Eine neue Nachricht. Null Abendessen." Juno: „Danke, EVI." EVI zeigt auf das Symbol CHAT, das blinkt. | — |
| 0 | Deck | Im Chat ist eine Nachricht von Frau Kessler: „Mein Mann kommt seit Wochen spät. Er sagt, Überstunden. Ich will Beweise. Pumpenverwaltung Ost, er geht um 22 Uhr. Und er isst nur noch Automatennudeln, Nummer 7, als hätte er
kein Zuhause." (Die Nudeln sind der Schlüssel für Kap. 1, Auftrag A.) Anhang: ein Foto (Kessler mit hellem Schal, „den hab ich ihm gestrickt"). Juno: „Überstunden. Klar." | `+note_kessler_photo` (Cache) |
| 1 | Deck | EVI: „Pumpenverwaltung Ost! Da hab ich eine Kamera für dich." Die App GLASS zeigt eine verbundene Kamera, `cam03` (Ostbrücke, gegenüber der Pumpenverwaltung). Klick öffnet den Feed. | — |
| 2 | `cam03` | 22:00: Leute strömen aus dem Bürohaus, unter Schirmen. Fünf Männer in Mänteln. Der Spieler zoomt oder sieht genau hin: einer trägt einen Schal, der im Phosphor heller ist als alles andere an ihm. Markieren. Falsche Person markiert: Juno: „Kein Schal. Nicht er." Die erste Markierung erklärt das Implantat (auch über den Puffer): „Die Klammern macht nicht das Deck, die macht mein Implantat. Das durften wir behalten, damals. Sie sagten, das Herausnehmen kostet mehr." | `tag_kessler` |
| 3 | `cam03` | Kessler wartet unter dem Vordach (Regen) und telefoniert. Zuerst steht er weit weg: „... ja ... bring's ... Yuen's ..." Er tritt näher unters Vordach, unter die Kamera: „Ja, ich bring's mit. Alles. Halb elf, bei Yuen's." | `heard_yuens` |
| 4 | `cam03` | Er geht los, Richtung Imbiss. Die Kamera-Leiste zeigt `cam04`, grau: nicht verbunden. Juno: „Yuen's hat 'ne Kamera. Hab ich bloß nicht." | — |
| 5 | `cam03` | Im Bild, auf der anderen Straßenseite, hängt eine Kamera an einem Mast. Zoomen: ein Aufkleber `HCS-04 · K7-731`. Juno: „Den Wartungscode haben sie aufs Gehäuse geklebt. Nagi·wa spart an allem.“ | `code_cam04` |
| 6 | Deck | GLASS: `cam04` mit dem Code verbinden (Linksklick auf den grauen Punkt, sobald der Code bekannt ist). EVI, begeistert: „Verbunden! Hallo, Kamera vier." | `link_cam04` |
| 7 | `cam04` | Imbiss Yuen, 22:30. Kessler setzt sich zu einem Mann im grauen Mantel (Gus Varga). Zuhören: Varga ist nah an der Kamera, klar; Kessler gedämpft. Varga: „Das ist nicht alles, Kessler." Kessler zieht den Ehering ab. | — |
| 8 | `cam04` | Wenn REC läuft, während er den Ring übergibt: Clip `clip_kessler_ring`. Wenn nicht: Juno: „Mist. REC war aus. Der Puffer hat es noch.“ Zurückspulen im Puffer (Tutorial dafür), dort aufzeichnen. Varga zum Schluss: „Bis Freitag, Kessler. Sonst holen wir uns mehr als einen Ring." | `+clip_kessler_ring`, `saw_varga` |
| 9 | Deck | Der Clip öffnet sich im Clip-Editor (§2.4) und lässt sich schneiden: (a) ganz, (b) nur der Ring, der vom Finger geht (sieht aus wie ein Mann, der seinen Ehering für eine andere ablegt). Schneidet Juno, fragt EVI: „Wenn man das Ende weglässt, ist es eine andere Geschichte. Ist das erlaubt?" (Antworten: „Ist es." / „Nein." / Schweigen; jede rückt `evi_trust`.) Eine Notiz entsteht: `note_kessler_debt` („Kessler schuldet einem Kredithai Geld"). | `+note_kessler_debt` |
| 10 | Deck | **Entscheidung P1:** Frau Kessler im Chat antworten, mit dem Clip als Anhang (siehe 6.3). Danach EVI, je nach Wahl: „Sie schreibt nicht zurück. Ist sie jetzt froh?" / „Sie hat ‚Ich wusste es' geschrieben. Sie hat es nicht gewusst, oder?" / „Wir haben nichts geschickt. Ist das nett oder feige? Ich weiß das nie." | `p1=full` / `p1=cut` / `p1=nothing` |
| 11 | Deck | Optional: eine Benachrichtigung von Sable fährt herein, ein Sticker (eine Pfeife) und: „Ruhige Nacht? Ich kaufe alles, was atmet." `note_kessler_debt` an Sable senden: 120 Chits. EVI erklärt das Kassenbuch („Ich schreib alles auf. Du hast gesagt, ich soll."). | `ledger_sable_kessler` |
| 12 | `flat` | Juno steckt das Taschen-Deck ein. EVI: „Bringst du mir was mit?" Juno: „Du isst nicht." EVI: „Ich weiß. Bringst du mir was mit?" Juno steht auf, Magen knurrt. Der Kühlschrank: „Drin ist Licht, sonst nichts.“ Der alte Karton unter dem Bett (ansehen): der Nagi·wa-Ausweis `CIVIC MONITOR · J. REYES · UNGÜLTIG`, der Kaktus, vertrocknet. Den Ausweis kann sie schon jetzt einstecken, ebenso im Flur den Notschlüssel vom Aufzug (`kapitel1-design`, „Die Stadt“). | `fridge_empty`, ggf. `got_ausweis`, `got_haken` |
| 13 | `kessel_14` | Der Flur. Frau Haldanes Tür steht offen, sie schläft im Sessel, das Lull-Pflaster hinter dem Ohr. Ansehen: „Frau Haldane hat Doppelschicht. Sie schläft, wie andere Leute blinzeln.“ Ihr Fernseher: Nagi·wa-Werbung. | — |
| 14 | `kessel_14` | Motte sitzt auf seiner Bank vor dem Treppengeländer, die weiße Mütze zu groß. „Was machst du eigentlich? Den ganzen Tag?" Antworten: freundlich und ehrlich („Ich schau Leuten zu. Und verkauf, was ich sehe."), ausweichend („Reparaturen."), abweisend („Geh schlafen, Motte."). Erster Wert für Motte. | `moth_kind` / `moth_brushed` |
| 15 | `kessel_lobby` | Der Aufzug: `OUT OF ORDER`; angeblich fährt er dienstags, er fährt nie. Die Briefkästen: eine Mietmahnung, „Fällig in 3 Tagen: 900 Chits (davon Hüllenabgabe 310)". Juno: „Dreihundertzehn zahl ich für die Ringe über meinem Kopf, und bestellt hab ich die nie.“ Das ist das Ziel von Kapitel 1. | `rent_notice` |
| 15b | `kessel_14` → `kessel_lobby` | **Die vierzehn Stockwerke:** Beim ersten Mal in jede Richtung Schwarzblende, Schritte auf Stahl, und die Stockwerke zählen im Bild mit (runter 13, 12, … 1; am Dienstag: „Der Aufzug fährt angeblich dienstags.“; rauf langsamer werdend). Danach nur noch die Schritte. | — |
| 16 | `kowalski` | Die Straße aus dem Mockup. Bao an seiner Garküche: „Wie immer? Ich schreib's an." (Hat Juno Geld, kann sie bar zahlen; Bao freut sich, sagt aber dasselbe.) Juno nimmt die Brühe mit nach oben („Heute nehm ich's mit, Bao. Ich ess oben.“ Bao: „Oben! Da wird sie kalt.“), ein Gegenstand in der Tasche. | `bao_soup`, `+suppe` |
| 17 | `kowalski` | Mit der Brühe in der Hand: der kaputte Werbebildschirm über der Straße stottert. Halbes Werbegesicht, halbes Rauschen. Wenn Juno ihn ansieht (oder nach ein paar Sekunden von selbst): das Auge im Rauschen dreht sich zu ihr. Schrift über den ganzen Bildschirm: **JUNO.** Dann wieder Werbung. Das Stottern ist echt (der Bildschirm ist kaputt), das Auge und JUNO. sind nur in Junos Overlay (story §10a); deshalb hat Bao nichts gesehen. Für diesen Moment liegen die Eckklammern des Implantats um den Bildschirm. Juno: „Hast du ... nichts. Schon gut." Dann leise: „Das war nicht auf dem Schirm. Das war in meinem Auge." Aus der Tasche, ganz leise, EVI: „Das war nicht ich. Ehrlich." | Ende |
| 18 | `kowalski` → `flat` | EVI: „Es wird langsam spät, Juno. Und deine Suppe wird kalt.“ Der Spieler bringt Juno nach Hause (Haustür, Treppe, ihre Tür; aufs Dach darf sie auch noch). Oben setzt sie sich ans Deck und isst: „Sie ist zu salzig, und genau so muss sie sein.“ EVI: „Du hast doch was mitgebracht. Eins Abendessen!“ Erst jetzt geht das Bett auf (entschieden 2026-11-07). | `soup_eaten`, `-suppe` |
| 19 | `flat` | Bett: „Genug für heute.“ EVI: „Gute Nacht, Juno.“ Abblende, die Karte „Kapitel 1: Glass“, dann die Karte des neuen Abends „Abend 1, Mittwoch, 7. November“, und Juno ist wieder in ihrer Wohnung. | `act: next` |

### 6.3 Entscheidung P1: was Frau Kessler bekommt

| Wahl | Juno schickt | Frau Kessler | Folge (Kap. 1) | Kassenbuch |
|---|---|---|---|---|
| **Die Wahrheit** | den ganzen Clip | zahlt 200 Chits, schreibt: „Schulden. Er hat mir nie was gesagt." | Sie weiß, warum er nicht heimkommt, und er weiß nicht, dass sie es weiß | „Frau Kessler: die Wahrheit über ihren Mann. 200." |
| **Was sie bestellt hat** | nur den Ring | zahlt 200 + 100 Bonus: „Ich wusste es." | Sie hält ihn für einen Ehebrecher; dass er nicht heimkommt, nimmt sie als Beweis | „Frau Kessler: einen Ehebruch, den es nicht gab. 300." |
| **Nichts** | „Nichts gefunden." | zahlt nichts | Sie wartet auf einen Mann, der nicht kommt, und weiß nicht, warum | „Nichts geliefert." |

Kessler arbeitet bis zu diesem Abend wie immer. Nach dem Treffen bei Yuen's taucht er in jedem Fall unter, weil er den Rest nicht zahlen kann und sich
verschuldet nicht mehr heimtraut (story §10b). In Kapitel 1 heuert Varga Juno an, ihn zu finden. Die Wahl ändert, was Frau Kessler
glaubt, und die Zeilen in Kap. 1.

### 6.4 Ohne Sackgassen

- Ein falscher Mann markiert: kein Schaden, Juno korrigiert sich.
- Den Moment verpasst: der Puffer.
- Kein Geld (Wahl „Nichts" und nichts an Sable verkauft): Bao schreibt an. Der Prolog braucht kein
  Geld.
- Der Prolog lässt sich in jeder Reihenfolge der optionalen Dinge beenden: Der Ausgang aus der Wohnung
  ist erst offen, wenn P1 entschieden ist („Erst kommt der Auftrag, dann das Essen.“).

### 6.5 Hinweise (EVI)

Die Hinweise spricht EVI (§2.2): Der Hinweis-Knopf unten rechts ist ihr Kopf, der aus der Tasche
schaut. Die Sätze hier sind der Inhalt; beim Schreiben der Endtexte bekommen sie EVIs Ton, ohne an
Klarheit zu verlieren.

| Für | Stufe 1 | Stufe 2 | Stufe 3 |
|---|---|---|---|
| A | „Frau Kessler hat ein Foto geschickt. Was trägt er darauf?" | „Im Feed ist alles grün. Aber ein heller Schal bleibt hell." | „Markiere den Mann mit dem hellen Schal, der als Dritter herauskommt." |
| A2 | „Er telefoniert. Hör hin." | „Er ist zu weit weg. Warte, bis er näher an die Kamera kommt." | „Bleib im Feed, bis er unter das Vordach tritt." |
| B | „Wie kommst du an cam04?" | „Kameras haben Wartungsaufkleber. Siehst du eine?" | „Zoome in cam03 auf die Kamera am Mast gegenüber." |
| C | „Was tut Kessler bei Yuen's?" | „Du brauchst einen Beweis. Den Moment, nicht nur das Gerede." | „Drücke REC, bevor er den Ring abzieht, oder hol es dir aus dem Puffer." |
| D | „Frau Kessler wartet auf eine Antwort." | „Öffne die Nachrichten auf dem Deck." | „Antworte ihr: Die Wahl ist deine." |
| E | „Junos Magen knurrt." | „Der Kühlschrank ist leer. Bao hat immer was." | „Geh die Treppe runter auf die Kowalski-Straße." |

## 7. Orte

### 7.1 Straßenmodus (Iso, Style Guide §4)

| Raum | Größe | Hauptfarbe | Ausgänge | Requisiten | Lampen | Detail mit Geschichte |
|---|---|---|---|---|---|---|
| `flat` | 320x180 | Bildschirm-Cyan, gedämpft; eine Bernstein-Lampe; Magenta vom Schild draußen | Tür (linke Wand) → `kessel_14` | `deck` (Schreibtisch, drei Bildschirme, Kabelsalat), `fridge`, `bed`, `box_old` (unter dem Bett), `window` (Blick auf den Werbebildschirm, Regen), `pinboard` (Fotos von Zielen mit Fäden), Wäscheberg, Nudelbecher-Turm | Deck (Cyan, flackert), Stehlampe (Bernstein), Fenster (Magenta-Neon, blinkt) | die Datei `ESSEN!!.TXT` auf dem Desktop des Decks (das Post-it am Monitor ist gestrichen, 2026-11-05) |
| `kessel_14` | 352x180 (scrollt), Iso-Treppenabsatz 6 x 4,5 m (entschieden 2026-11-04 gegen eine Seitenansicht, am 10.11.2026 um 1 m entlang der Aufzugswand verlängert; Karte `art/rooms/kessel_14.map.js`, Block-Skizze `art/test/kessel14_blocks.px.js`) | Beton-Stahl, grünstichiges Neonröhrenlicht | `flat` (Tür 14B in der linken Wand), in der rechten Wand von der Ecke aus der Notschlüssel, der Aufzug (außer Betrieb, an derselben Stelle wie in der Lobby) und gleich daneben Haldane (Tür 14C, offen: ihr Sessel gleich dahinter im Fernsehlicht), dann das Schild „14“ und oben über dem Schacht Nagi·was Kamera, Treppe (an der rechten Wand, nach unten) → `kessel_lobby` | `haldane` (sie im Sessel, ein Fernseher), `stairs`, Motte auf seiner Bank, Müllsäcke vorn an der linken Wand unter der Neonreklame NINTH LIVE, Nagi·was Kamera über dem Schacht | Neonröhre (flackert), Haldanes Fernseher (blau) | ein Zettel „WER KLAUT MEINE ZEITUNG?? – 14C" mit der Antwort „NIEMAND LIEST ZEITUNG – 14A" |
| `kessel_lobby` | 352x180 (scrollt), Iso 6 x 4,5 m wie der 14. Stock darüber, Decke 2,8 m (gebaut 2026-11-04, am 10.11.2026 mit dem 14. Stock verlängert: `art/rooms/kessel_lobby.map.js`, `docs/rooms/kessel_lobby_x3.png`) | Stahlblau, nasser Boden (Regenwasser kommt durch die Tür) | Treppe (an der rechten Wand, unter dem Treppenloch des Stockwerks darüber) → `kessel_14`, Haustür → `kowalski`, Aufzug (zu, an derselben Stelle wie oben) | `mailboxes`, `lift` (Schild), `board` | Deckenlampe (kalt), Licht von draußen (Magenta) | das Nagi·wa-Plakat „SLEPT WELL? NAGI·WA LISTENS." (Stadtschrift, bleibt englisch; Junos Kommentar beim Ansehen ist Deutsch) |
| `kowalski` | 416x180 (scrollt) | Magenta, Bernstein-Essenslicht | Kessel-Block (links hinten), Gasse zum Drain-Markt (Kap. 1, rechts, im Prolog zu: „Nicht heute Nacht.") | wie Mockup C: LUCKY STATIC (Kap. 1 betretbar), Baos Wagen, Automat, Werbebildschirm, Drohne, Gitter, Okonkwos Eckladen (Kap. 1) | wie Mockup C | wie Mockup C |

### 7.2 Kameras (Feed-Modus, Style Guide §9)

| Kamera | Ort | Blick | Was dort ist | Ablauf im Prolog |
|---|---|---|---|---|
| `cam03` | Ostbrücke, gegenüber der Pumpenverwaltung Ost | von einer Laterne, 45°, eine Fußgängerbrücke mit Vordach, der Eingang des Bürohauses, eine Kamera am Mast gegenüber | Pendler unter Schirmen, ein Nudelautomat, Pfützen | 22:00 Schichtende: 9 Leute kommen heraus, 5 Männer in Mänteln; Kessler (3.) geht wie jeden Abend am Nudelautomaten vorbei, bleibt unterm Vordach, telefoniert bis 22:15, geht nach rechts |
| `cam04` | Imbiss Yuen | von der Decke im Imbiss, 55°, Theke, vier Tische, ein Fenster zur Straße | ein Koch, zwei Nachtgäste, ein Fernseher mit Nagi·wa-Werbung | 22:30 Kessler setzt sich zu Varga; 22:35 der Ring; 22:45 Varga geht; Kessler bleibt sitzen, Kopf in den Händen |

## 8. Figuren im Prolog

Größen im Maßstab der Straße: 30 px pro Meter Höhe (Style Guide §4, §6). Das gilt auch als Vergleich für Figuren, die nur im Feed
vorkommen: Dort bleiben Figuren in ihrer gezeichneten Größe, ein Erwachsener von 1,75 m misst etwa 24 px.

| Wer | Größe | Silhouette und Akzent im Feed | Farbe | Neu zu zeichnen |
|---|---|---|---|---|
| Juno | 50 px | Kapuze, Tasche | `#fff070` | Iso 4 Richtungen (SE, NE, gespiegelt) + Feed-Figur |
| Herr Kessler | 48 px | kleiner Mann, Mantel, **heller Schal** | `#b8c890` | nur Feed |
| Gus Varga | 53 px | breit, grauer Mantel, Hut; im Feed sehr dunkel bis auf die Uhr am Handgelenk | `#a0a0b8` | nur Feed (Kap. 1 auch Iso) |
| Motte | 43 px stehend (1,45 m); sitzt auf einer Bank vor dem Treppengeländer in `kessel_14` | übergroße weiße Strickmütze mit Bommel (entschieden 2026-11-04: Mütze A, zwei Petrolstreifen in der Krempe, rosa Bommel; `docs/characters/motte_blocks_x4.png`), knallrosa Jacke, zu groß, mit Reflexstreifen, Kuriertasche in Petrol, ein altes Handheld zum Spielen, breit, mit zwei farbigen Griffen, in beiden Händen vor der Brust (entschieden 2026-11-05) | `#f0f0a0` | Iso (stehend SE/NE, sitzend) |
| Frau Haldane | im Sessel, von der Seite (die Lehne zum Aufzugschacht, sie schaut zu ihrem Fernseher rechts der Tür; entschieden 10.11.2026) | rosa Morgenmantel, Lull-Licht | `#ffa8d8` | im Kit gemalt (`armchair` in `art/kit/kessel_14.kit.px.js`), schlafend |
| Bao | 47 px (1,62 m, leicht gebeugt) | Schirm, weiße Schürze, nur ein Arm, der andere Ärmel an der Schulter hochgesteckt (entschieden 2026-11-05) | `#e8c890` | Iso |
| Juno im Vorspann | 50 px | Nagi·wa-Grau, Ausweis | — | Iso, eine Pose |
| EVI | 24 px (Desktop), 16 px (Tasche) | rundes Pixelwesen, große Augen, Antennen-Ohren | `#8ef5d8` | Deck-Grafik: 6 Gesichter, Idle (blinzeln, Ohren), Laufen über den Desktop, Schlafen; der Kopf in der Tasche für den Hinweis-Knopf |

## 9. Musik und Klang

- Junos Thema: leise, ein E-Piano und Regen, eine Basslinie wie ein Herzschlag. Im Deck: dieselbe
  Musik, gefiltert (wie durch eine Wand).
- Feed-Modus: das Thema tritt zurück; Rauschen, das Brummen der Kamera, die Umgebung durch das
  Mikrofon der Kamera (gedämpft). Ein kurzer Stinger beim Markieren, ein anderer bei REC.
- Der Moment „JUNO.": alles bricht ab, ein tiefes Brummen, das Wort ohne Stimme, nur ein Glitch-Klang.
  Dann Regen.

## 10. Was die Engine dafür braucht

Aus dem Style Guide §11, für den Prolog konkret:

1. **Deck-UI** (Spielseite, `game/deck.js`): eine Vollbild-Ebene mit Desktop, Symbolen und einem
   App-Fenster (§2.1); der Messenger mit Verläufen, Status, Auswahl-Antworten und Anhängen (§2.3);
   der Clip-Editor (§2.4); Benachrichtigungen über allen Modi; EVI als animierte Figur auf dem
   Desktop und als Hinweis-Knopf. Von der Engine braucht das nur, was es schon gibt (UI-Ebenen,
   Hinweise, Dialoge); ob der Hinweis-Knopf eine eigene Grafik und eigene Sprecherin bekommen kann,
   ist beim Bau zu prüfen.
2. **Feed-Räume:** ein Raum ohne gespielte Figur, mit dem Phosphor-Nachbearbeitungs-Layer über Raum
   und Figuren; Overlay aus Hotspots und Markierungen; OSD; Kamera-Leiste.
3. **Markieren, Folgen, Zuhören** (Untertitel in der Tonleiste mit Wortverlust nach Abstand),
   **Zoomfenster** (eigene Grafik pro Ziel), **REC und Momente**, **Puffer**.
4. **Uhr und Abläufe:** 15-Minuten-Takte, Vorspulen, Routinen als Tabellen.
5. **Inhaltsoption** für drastische Szenen (Story §10), ab Kap. 1.
