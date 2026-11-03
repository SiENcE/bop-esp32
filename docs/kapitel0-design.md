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
| Bringt bei | das Deck, Feed-Modus (zusehen, markieren, zuhören, zoomen, Kamera verbinden, aufzeichnen), Verkaufen, Straßenmodus, das Kassenbuch |
| Orte, Straßenmodus | `flat`, `kessel_14`, `kessel_lobby`, `kowalski` (4) |
| Kameras, Feed-Modus | `cam03` (Ostbrücke), `cam04` (Imbiss Yuen) (2) |
| Figuren | Juno; Herr Kessler, Frau Kessler (nur Nachrichten), Gus Varga; Sable (nur Nachrichten); Motte, Frau Haldane, Bao |
| Zeit | eine Nacht, 21:30 bis etwa 01:00 |
| Ende | der Werbebildschirm sagt „JUNO." |

## 2. Das Deck

Junos selbstgebauter Rechner auf dem Schreibtisch in `flat`. Wer das Deck benutzt, sieht einen
**Vollbild-Schirm** (eine eigene UI-Ebene, kein Raum): dunkles Stahlblau, Cyan-Schrift (die Farbe der
Technik), links eine Spalte mit fünf Reitern. Rechts oben Uhrzeit und Kontostand.

| Reiter | Was er zeigt |
|---|---|
| **Feeds** | die Netzkarte: der Stadtplan des Viertels als Linien, jede bekannte Kamera ein Punkt. Verbundene Kameras leuchten; ein Klick öffnet den Feed-Modus mit dieser Kamera. Unverbundene sind grau und zeigen, was zum Verbinden fehlt. |
| **Nachrichten** | der Posteingang: Aufträge von Kunden, Sables Angebote, Teo, Werbung, Spam (Weltbau). Ein Auftrag hat Ziel, Bezahlung, Frist. Antworten sind Auswahlen, keine Freitexte. |
| **Cache** | Junos aufgezeichnete Clips und Standbilder, mit Metadaten (wer, wo, wann). Ein Clip lässt sich ansehen, schneiden (falls er mehrere Momente enthält) und an einen Kontakt senden. Der Cache ist das Inventar des Feed-Modus (8 Plätze). |
| **Kassenbuch** | jede Lieferung: was, an wen, für wie viel, und später, was daraus wurde (§5 der Story). |
| **Konto** | Chits, die Miete, Schulden bei Bao. |

- **Verkaufen** heißt: einen Clip oder eine Information (Shine) an einen Kontakt senden. Jeder Kontakt
  zahlt anderes für anderes. Sable kauft fast alles, zum halben Preis.
- **Shine** ohne Clip (ein Name, ein Ort, ein Code) entsteht, wenn Juno etwas herausfindet: Es landet
  als Notiz im Cache (eine Karteikarte statt eines Filmstreifens).
- Gestaltung: Das Deck nutzt die Straßenmodus-Farben (Stahl `1`–`6`, Cyan `cCvV`), die Schrift 5x7,
  Rahmen aus 1-px-Linien. Kleine Bildschirmstörungen beim Öffnen. Später (Kap. 3) wird das Deck
  zerstört und in Kap. 4 aus Teilen neu gebaut: Das zweite Deck sieht anders aus (zusammengeflickt,
  Bernstein statt Cyan).

## 3. Feed-Modus: die Regeln

Ein Feed ist ein **Raum ohne Juno**: der Blick einer Kamera, im Phosphor-Look (Style Guide §9). Die
Menschen darin sind Figuren mit Tagesabläufen (§4). Die Maus bedient das Implantat.

| Aktion | Wie | Was passiert |
|---|---|---|
| **Ansehen** | Rechtsklick auf Person oder Ding | Juno kommentiert (ihre Stimme aus dem Off, als Untertitel unten) |
| **Markieren** | Linksklick auf eine Person | die Person bekommt eine Cyan-Klammer und ein Etikett (`UNBEKANNT`, später Name und Notizen). Markierte Personen erscheinen auf der Netzkarte als Punkt, solange eine verbundene Kamera sie sieht. Höchstens 3 Markierungen zugleich. |
| **Folgen** | eine markierte Person verlässt das Bild | die Kamera-Leiste unten blinkt bei der Kamera, in der sie als Nächstes auftaucht (wenn verbunden). Klick darauf wechselt. Ist dort keine verbundene Kamera, zeigt die Netzkarte einen Pfeil in die Richtung, und die Spur reißt ab. |
| **Zoomen** | Linksklick auf ein Ding (oder Mausrad) | ein Zoomfenster zeigt den Ausschnitt dreifach vergrößert (eigene, detailliertere Grafik pro Zoom-Ziel: Gesichter, Tastenfelder, Aufkleber, Bildschirme). |
| **Zuhören** | automatisch bei markierten Personen | was sie sagen, erscheint in der Tonleiste unten (`KESSLER> ...`). Je weiter weg von der Kamera, desto mehr Wörter fehlen (`... bring's ... alles.`). Regen, Lärm, Musik verschlechtern es. Das Richtmikro (ein Werkzeug, Kap. 1) hilft. |
| **Aufzeichnen** | der REC-Knopf | der Feed wird aufgezeichnet, bis Juno wieder klickt oder die Szene endet. Was in dieser Zeit im Bild geschieht (ein „Moment", siehe unten), wird zum Clip im Cache. |
| **Steuern** | Linksklick auf ein vernetztes Ding (Tür, Licht, Kamera, Automat) | nur mit Zugang: öffnen, schalten, Kamera schwenken (manche Kameras haben 2–3 Stellungen). Ab Kap. 1. |
| **Verlassen** | Esc oder der Knopf `DECK` | zurück zum Deck |

**Momente.** Ein Feed zeigt Abläufe; wichtig für Rätsel sind **Momente**: Ereignisse mit einem
Namen, die ein Clip enthalten kann (`kessler_ring`: Kessler gibt Varga seinen Ehering). Ein Moment
geschieht zu seiner Zeit, ob jemand zusieht oder nicht. Damit kein Spieler hängen bleibt:

- **Wichtige Momente warten auf den Spieler**, wenn er der richtigen Person folgt (der Moment beginnt,
  sobald Juno auf der richtigen Kamera ist, innerhalb seines Zeitfensters).
- **Jede Kamera hat einen Puffer** der letzten 30 Spielminuten. Was Juno verpasst hat, kann sie im
  Puffer zurückspulen und dort aufzeichnen. Ältere Aufnahmen liegen nur im Halcyon-Archiv (ein
  späteres Rätsel).
- Der Solver behandelt einen Moment als Zustand: gesehen, aufgezeichnet, verpasst.

**Verbinden.** Eine Kamera ist verbunden, wenn Juno ihren Zugangscode kennt. Codes findet man:
an der Kamera selbst (ein Aufkleber mit Kennung und Code, lesbar mit dem Zoom aus einer anderen Kamera
oder vor Ort), im Netz (gekauft bei Sable), durch eine Reparatur vor Ort (Straßenmodus), oder mit dem
alten Beobachter-Protokoll (nur bestimmte alte Kameras, Kap. 1).

## 4. Zeit

- Das Spiel hat eine **Uhr in Takten von 15 Minuten** (Uhrzeit auf dem Deck und, im Feed, im OSD).
  Die Uhr springt nicht von selbst weiter: Sie rückt vor, wenn Juno etwas tut, das Zeit kostet
  (ein Weg in einen anderen Bezirk, ein Auftrag, Essen), oder wenn der Spieler im Feed **Vorspulen**
  wählt („bis zur nächsten Bewegung" oder „bis 03:00").
- Innerhalb eines Takts laufen die Figuren ihre Wege und Animationen in Echtzeit; die Zeit des Takts
  steht aber still, bis etwas sie weiterschiebt. Das hält Rätsel lösbar und den Solver endlich.
- **Tage:** Juno schläft in ihrem Bett, um zum nächsten Abend zu springen. Kapitel haben Fristen in
  Tagen (Miete in drei Tagen), nie in Minuten.
- **Abläufe** (die Routinen der Figuren) sind Tabellen: für jeden Takt, wo jemand ist und was er tut.
  Die Engine braucht dafür eine neue Fähigkeit (Style Guide §11, Punkt 4).

## 5. Vorspann: Die letzte Schicht (vor dem Titel, ~1,5 Min.)

Eine Sequenz (wie das Intro der Loonies), überspringbar, im Titelmenü wieder abspielbar.

| Einstellung | Bild | Ton und Text |
|---|---|---|
| 1 | **Die Beobachtungshalle**, Halcyon Tower, drei Jahre früher: Iso-Ansicht, Reihen von Pulten, jedes mit einem Menschen vor einer Wand aus Phosphor-Bildschirmen. Kabel aus den Pulten in die Implantate. | Brummen, leises Tippen. Datum unten: `2088-04-30 05:45` |
| 2 | Juno an ihrem Pult (ohne gelben Mantel: Halcyon-Grau, Ausweis am Band). Ihr Bildschirm: eine Straße, ein Mann bleibt stehen. Sie markiert ihn, gelb. | Juno, leise: „Hab dich." |
| 3 | Eine Durchsage, Text über die ganze Breite | „Ab morgen übernimmt die automatische Auswertung. Halcyon dankt Ihnen für Ihren Dienst." |
| 4 | Die Bildschirme der Halle gehen aus, einer nach dem anderen, von hinten nach vorn. Junos zuletzt. In ihrem schwarzen Bildschirm spiegelt sich ihr Gesicht. | Stille |
| 5 | Juno mit einem Karton auf der Transitachse, abwärts. Im Karton: ein Kaktus, eine Tasse, der gelbe Regenmantel. | „Das Implantat durften wir behalten. Sie sagten, das Herausnehmen kostet mehr." |
| 6 | Schnitt: heute. Ein Phosphor-Feed, ein selbstgebautes Deck, Junos Hand auf der Maus. Gelber Ärmel. | `2091-11-03 21:30` Titel: **HALCYON** |

## 6. Der Prolog Schritt für Schritt

### 6.1 Rätselkette

```
 flat: Juno am Deck, Auftrag von Frau Kessler
   │
 [A] cam03: Kessler unter den Leuten finden, die aus dem Bürohaus kommen ─ Foto im Cache: grüner Schal
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
| 0 | `flat` | Juno am Deck. Eine Nachricht von Frau Kessler ist offen: „Mein Mann kommt seit Wochen spät. Er sagt, Überstunden. Ich will Beweise. Pumpenverwaltung Ost, er geht um 22 Uhr. Und er isst nur noch Automatennudeln, Nummer 7, als hätte er
kein Zuhause." (Die Nudeln sind der Schlüssel für Kap. 1, Auftrag A.) Anhang: ein Foto (Kessler mit grünem Schal, „den hab ich ihm gestrickt"). Juno: „Überstunden. Klar." | `+note_kessler_photo` (Cache) |
| 1 | Deck | Die Netzkarte zeigt eine verbundene Kamera, `cam03` (Ostbrücke, gegenüber der Pumpenverwaltung). Klick öffnet den Feed. | — |
| 2 | `cam03` | 22:00: Leute strömen aus dem Bürohaus, unter Schirmen. Fünf Männer in Mänteln. Der Spieler zoomt oder sieht genau hin: einer trägt einen Schal, der im Phosphor heller ist als alles andere an ihm. Markieren. Falsche Person markiert: Juno: „Kein Schal. Nicht er." | `tag_kessler` |
| 3 | `cam03` | Kessler wartet unter dem Vordach (Regen) und telefoniert. Zuerst steht er weit weg: „... ja ... bring's ... Yuen's ..." Er tritt näher unters Vordach, unter die Kamera: „Ja, ich bring's mit. Alles. Halb elf, bei Yuen's." | `heard_yuens` |
| 4 | `cam03` | Er geht los, Richtung Imbiss. Die Kamera-Leiste zeigt `cam04`, grau: nicht verbunden. Juno: „Yuen's hat 'ne Kamera. Hab ich bloß nicht." | — |
| 5 | `cam03` | Im Bild, auf der anderen Straßenseite, hängt eine Kamera an einem Mast. Zoomen: ein Aufkleber `HCS-04 · K7-731`. Juno: „Wartungscode auf dem Gehäuse. Halcyon spart an allem." | `code_cam04` |
| 6 | Deck | Netzkarte: `cam04` mit dem Code verbinden (Linksklick auf den grauen Punkt, sobald der Code bekannt ist). | `linked_cam04` |
| 7 | `cam04` | Imbiss Yuen, 22:30. Kessler setzt sich zu einem Mann im grauen Mantel (Gus Varga). Zuhören: Varga ist nah an der Kamera, klar; Kessler gedämpft. Varga: „Das ist nicht alles, Kessler." Kessler zieht den Ehering ab. | — |
| 8 | `cam04` | Wenn REC läuft, während er den Ring übergibt: Clip `clip_kessler_ring`. Wenn nicht: Juno: „Mist. Puffer." Zurückspulen im Puffer (Tutorial dafür), dort aufzeichnen. Varga zum Schluss: „Bis Freitag, Kessler. Sonst holen wir uns mehr als einen Ring." | `+clip_kessler_ring`, `saw_varga` |
| 9 | Deck | Der Clip lässt sich schneiden: (a) ganz, (b) nur der Ring, der vom Finger geht (sieht aus wie ein Mann, der seinen Ehering für eine andere ablegt). Eine Notiz entsteht: `note_kessler_debt` („Kessler schuldet einem Kredithai Geld"). | `+note_kessler_debt` |
| 10 | Deck | **Entscheidung P1:** Frau Kessler antworten (siehe 6.3). | `p1_full` / `p1_cut` / `p1_nothing` |
| 11 | Deck | Optional: eine Nachricht von Sable ploppt auf: „Ruhige Nacht? Ich kaufe alles, was atmet." `note_kessler_debt` an Sable verkaufen: 120 Chits. Tutorial-Hinweis zum Kassenbuch. | `sold_kessler_sable` |
| 12 | `flat` | Juno steht auf, Magen knurrt. Der Kühlschrank: „Licht. Sonst nichts." Der alte Karton unter dem Bett (ansehen): der Halcyon-Ausweis `CIVIC MONITOR · J. REYES · UNGÜLTIG`, der Kaktus, vertrocknet. | `fridge_empty` |
| 13 | `kessel_14` | Der Flur. Frau Haldanes Tür steht offen, sie schläft im Sessel, ein blaues Lull-Licht an der Schläfe. Ansehen: „Doppelschicht. Sie schläft, wie andere Leute blinzeln." Ihr Fernseher: Halcyon-Werbung. | — |
| 14 | `kessel_14` | Motte sitzt auf der Treppe, die weiße Mütze zu groß. „Was machst du eigentlich? Den ganzen Tag?" Antworten: freundlich und ehrlich („Ich schau Leuten zu. Und verkauf, was ich sehe."), ausweichend („Reparaturen."), abweisend („Geh schlafen, Motte."). Erster Wert für Motte. | `moth_kind` / `moth_brushed` |
| 15 | `kessel_lobby` | Der Aufzug: „AUSSER BETRIEB · DI WIEDER". Die Briefkästen: eine Mietmahnung, „Fällig in 3 Tagen: 900 Chits". Das ist das Ziel von Kapitel 1. | `rent_notice` |
| 16 | `kowalski` | Die Straße aus dem Mockup. Bao an seiner Garküche: „Wie immer? Ich schreib's an." (Hat Juno Geld, kann sie bar zahlen; Bao freut sich, sagt aber dasselbe.) Juno isst unter seinem Schirm. | `ate_bao` |
| 17 | `kowalski` | Nach dem Essen: der kaputte Werbebildschirm über der Straße stottert. Halbes Werbegesicht, halbes Rauschen. Wenn Juno ihn ansieht (oder nach ein paar Sekunden von selbst): das Auge im Rauschen dreht sich zu ihr. Schrift über den ganzen Bildschirm: **JUNO.** Dann wieder Werbung. Bao hat nichts gesehen. Juno: „Hast du ... nichts. Schon gut." | Ende |
| 18 | — | Abblende. Titelkarte „Kapitel 1: Glas". | `act: next` |

### 6.3 Entscheidung P1: was Frau Kessler bekommt

| Wahl | Juno schickt | Frau Kessler | Folge (Kap. 1) | Kassenbuch |
|---|---|---|---|---|
| **Die Wahrheit** | den ganzen Clip | zahlt 200 Chits, schreibt: „Schulden. Er hat mir nie was gesagt." | Kessler gesteht seiner Frau alles, schämt sich, verschwindet | „Frau Kessler: die Wahrheit über ihren Mann. 200." |
| **Was sie bestellt hat** | nur den Ring | zahlt 200 + 100 Bonus: „Ich wusste es." | sie wirft ihn hinaus; er verschwindet | „Frau Kessler: einen Ehebruch, den es nicht gab. 300." |
| **Nichts** | „Nichts gefunden." | zahlt nichts | Kessler bleibt zu Hause, bis Varga kommt; er verschwindet trotzdem | „Nichts geliefert." |

In jedem Fall verschwindet Kessler bis Kapitel 1, wo Varga Juno anheuert, ihn zu finden. Die Wahl
ändert, warum, wie Kessler über Juno denkt und die Zeilen in Kap. 1.

### 6.4 Ohne Sackgassen

- Ein falscher Mann markiert: kein Schaden, Juno korrigiert sich.
- Den Moment verpasst: der Puffer.
- Kein Geld (Wahl „Nichts" und nichts an Sable verkauft): Bao schreibt an. Der Prolog braucht kein
  Geld.
- Der Prolog lässt sich in jeder Reihenfolge der optionalen Dinge beenden: Der Ausgang aus der Wohnung
  ist erst offen, wenn P1 entschieden ist („Erst der Auftrag. Dann Essen.").

### 6.5 Hinweise (die Glühbirne)

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
| `flat` | 320x180 | Bildschirm-Cyan, gedämpft; eine Bernstein-Lampe; Magenta vom Schild draußen | Tür (linke Wand) → `kessel_14` | `deck` (Schreibtisch, drei Bildschirme, Kabelsalat), `fridge`, `bed`, `box_old` (unter dem Bett), `window` (Blick auf den Werbebildschirm, Regen), `pinboard` (Fotos von Zielen mit Fäden), Wäscheberg, Nudelbecher-Turm | Deck (Cyan, flackert), Stehlampe (Bernstein), Fenster (Magenta-Neon, blinkt) | ein Post-it am Monitor: „ESSEN!!" mit drei Unterstreichungen |
| `kessel_14` | 320x180 | Beton-Stahl, grünstichiges Neonröhrenlicht | `flat` (Tür hinten links), Haldane (Tür hinten rechts, offen), Treppe (vorne rechts) → `kessel_lobby` | `haldane_door` (sie im Sessel, ein Fernseher), `stairs`, Motte auf der Treppe, Fahrräder, Müllsäcke | Neonröhre (flackert), Haldanes Fernseher (blau) | ein Zettel „WER KLAUT MEINE ZEITUNG?? – 14C" mit der Antwort „NIEMAND LIEST ZEITUNG – 14A" |
| `kessel_lobby` | 320x180 | Stahlblau, nasser Boden (Regenwasser kommt durch die Tür) | Treppe → `kessel_14`, Haustür → `kowalski`, Aufzug (zu) | `mailboxes`, `lift` (Schild), `notice_board` | Deckenlampe (kalt), Licht von draußen (Magenta) | das Halcyon-Plakat „SLEPT WELL? HALCYON LISTENS." (Stadtschrift, bleibt englisch; Junos Kommentar beim Ansehen ist Deutsch) |
| `kowalski` | 320x180 | Magenta, Bernstein-Essenslicht | Kessel-Block (links hinten), Gasse zum Drain-Markt (Kap. 1, rechts, im Prolog zu: „Nicht heute Nacht.") | wie Mockup C: LUCKY STATIC (Kap. 1 betretbar), Baos Wagen, Automat, Werbebildschirm, Drohne, Gitter, Okonkwos Eckladen (Kap. 1) | wie Mockup C | wie Mockup C |

### 7.2 Kameras (Feed-Modus, Style Guide §9)

| Kamera | Ort | Blick | Was dort ist | Ablauf im Prolog |
|---|---|---|---|---|
| `cam03` | Ostbrücke, gegenüber der Pumpenverwaltung Ost | von einer Laterne, 45°, eine Fußgängerbrücke mit Vordach, der Eingang des Bürohauses, eine Kamera am Mast gegenüber | Pendler unter Schirmen, ein Nudelautomat, Pfützen | 22:00 Schichtende: 9 Leute kommen heraus, 5 Männer in Mänteln; Kessler (3.) bleibt unterm Vordach, telefoniert bis 22:15, geht nach rechts |
| `cam04` | Imbiss Yuen | von der Decke im Imbiss, 55°, Theke, vier Tische, ein Fenster zur Straße | ein Koch, zwei Nachtgäste, ein Fernseher mit Halcyon-Werbung | 22:30 Kessler setzt sich zu Varga; 22:35 der Ring; 22:45 Varga geht; Kessler bleibt sitzen, Kopf in den Händen |

## 8. Figuren im Prolog

| Wer | Größe | Silhouette und Akzent im Feed | Farbe | Neu zu zeichnen |
|---|---|---|---|---|
| Juno | 32 px | Kapuze, Tasche | `#fff070` | Iso 4 Richtungen (SE, NE, gespiegelt) + Feed-Figur |
| Herr Kessler | 31 px | kleiner Mann, Mantel, **heller Schal** | `#b8c890` | nur Feed |
| Gus Varga | 34 px | breit, grauer Mantel, Hut; im Feed sehr dunkel bis auf die Uhr am Handgelenk | `#a0a0b8` | nur Feed (Kap. 1 auch Iso) |
| Motte | 22 px | weiße Mütze | `#f0f0a0` | Iso |
| Frau Haldane | 28 px (sitzend) | rosa Morgenmantel, Lull-Licht | `#ffa8d8` | Iso (sitzend, schlafend) |
| Bao | 30 px | Schirm, weiße Schürze | `#e8c890` | Iso |
| Juno im Vorspann | 32 px | Halcyon-Grau, Ausweis | — | Iso, eine Pose |

## 9. Musik und Klang

- Junos Thema: leise, ein E-Piano und Regen, eine Basslinie wie ein Herzschlag. Im Deck: dieselbe
  Musik, gefiltert (wie durch eine Wand).
- Feed-Modus: das Thema tritt zurück; Rauschen, das Brummen der Kamera, die Umgebung durch das
  Mikrofon der Kamera (gedämpft). Ein kurzer Stinger beim Markieren, ein anderer bei REC.
- Der Moment „JUNO.": alles bricht ab, ein tiefes Brummen, das Wort ohne Stimme, nur ein Glitch-Klang.
  Dann Regen.

## 10. Was die Engine dafür braucht

Aus dem Style Guide §11, für den Prolog konkret:

1. **Deck-UI:** eine Vollbild-Ebene mit Reitern, Netzkarte, Posteingang mit Auswahl-Antworten, Cache
   mit Clips und Notizen, Kassenbuch, Konto.
2. **Feed-Räume:** ein Raum ohne gespielte Figur, mit dem Phosphor-Nachbearbeitungs-Layer über Raum
   und Figuren; Overlay aus Hotspots und Markierungen; OSD; Kamera-Leiste.
3. **Markieren, Folgen, Zuhören** (Untertitel in der Tonleiste mit Wortverlust nach Abstand),
   **Zoomfenster** (eigene Grafik pro Ziel), **REC und Momente**, **Puffer**.
4. **Uhr und Abläufe:** 15-Minuten-Takte, Vorspulen, Routinen als Tabellen.
5. **Inhaltsoption** für drastische Szenen (Story §10), ab Kap. 1.
