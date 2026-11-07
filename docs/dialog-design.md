# Dialoge: Design (Vorbild Disco Elysium)

Stand: Entwurf (2026-11-03). Engine-Seite: `docs/PLAN.md` C12 (Dialog v2) und C13 (Knoten-Editor).
Story: `docs/story.md`. Was hier steht, ist unser eigenes System: Wir nehmen von Disco Elysium die
**Tiefe und die Idee der inneren Stimmen**, nicht seine Fertigkeiten, Namen oder Texte.
Dieses Dokument regelt, wie Gespräche gebaut sind; wie sie klingen, steht in `docs/dialog-style-guide.md`.

## 1. Was wir von Disco Elysium lernen

- **Gespräche sind das Spiel.** Ein Gespräch ist kein Rätselschloss mit einem Schlüssel, sondern ein
  Raum: viele Fragen, Abschweifungen, Haltungen; was man fragt, verrät, wer man ist.
- **Die Figur spricht mit sich selbst.** Innere Stimmen mischen sich ein, widersprechen einander,
  lügen manchmal. Sie machen aus einer stillen Spielfigur einen Menschen.
- **Prüfungen zeigen Charakter, nicht Würfelglück.** Bei uns entscheidet keine Würfel, sondern wer
  Juno bis hierher geworden ist (siehe §3). Scheitern ist eine Geschichte, keine Sackgasse.
- **Text darf lang sein, wenn er gut ist.** Dafür braucht es eine gute Darstellung (§5).

## 2. Junos innere Stimmen

Sechs Stimmen, jede ein Teil von Juno, jede mit einem Wert von 0 bis 6. Die Werte entstehen nicht
bei einer Charaktererschaffung, sondern **aus dem, was der Spieler tut**: Jede Entscheidung, jeder
Verkauf, jede Warnung stärkt eine Stimme. Wer Juno ist, hört man.

| Stimme | Wer sie ist | Was sie hört und sagt | Stärker durch | Farbe |
|---|---|---|---|---|
| **DIE BEOBACHTERIN** | Junos Nagi·wa-Ausbildung, kühl, genau | Körpersprache, Details, Lügen im Gesicht, was nicht ins Bild passt | genau hinsehen: zoomen, markieren, Momente aufzeichnen | `#9cd0ff` |
| **DIE HÄNDLERIN** | der Drain-Markt in ihr, zynisch, witzig | was etwas wert ist, wer wem was schuldet, wie man feilscht | Shine verkaufen, feilschen, Geld nehmen | `#c890ff` |
| **DIE SCHWESTER** | Teo, die Wärme, die sie sich nicht leistet | was jemand braucht, Schuld, Mitgefühl | warnen, helfen, verschenken, für Teo da sein | `#ffb070` |
| **DER HUNGER** | der Körper: Hunger, Müdigkeit, Angst | Gefahr, Erschöpfung, Fluchtwege, wann es Zeit ist zu gehen | fliehen, essen, schlafen, überleben | `#e8c890` |
| **DAS IMPLANTAT** | die Maschine im Kopf, sachlich, fremd | Protokolle, Netze, Kameras, Codes; später spricht durch sie der Zeuge | hacken, Kameras verbinden, das alte Protokoll | `#62def0` |
| **DAS KASSENBUCH** | ihr Gewissen als Buchhalter, trocken, unerbittlich | was eine Tat kostet und wer bezahlt | wächst mit dem Gewicht des Kassenbuchs (je mehr Schaden, desto lauter) | `#d0d8f0` |

- Die Stimmen sind **Stimmen-Figuren ohne Kostüm** (die Engine kennt das schon) und sprechen in
  GROSSBUCHSTABEN-Namen: `DIE HÄNDLERIN — Er lügt nicht. Er verhandelt.`
- Werte als Flags: `v_beobachterin`, `v_haendlerin`, `v_schwester`, `v_hunger`, `v_implantat`,
  `v_kassenbuch` (0–6, Start: Beobachterin 2, Implantat 2, Hunger 1, alle anderen 0).
- **EVI ist keine Stimme.** Die KI auf Junos Deck (Prolog-Design §2.2) ist ein Gegenüber: Juno
  redet mit ihr, und sie antwortet. Gespräche mit EVI sind normale Gespräche (Nabe und Speichen),
  meist kurz und auf dem Deck. Wo eine Stimme und EVI dasselbe sehen, lesen sie es verschieden: DIE
  BEOBACHTERIN liest Menschen genau, EVI liest sie falsch, und gerade das macht ihre seltenen Treffer
  stark. EVI mischt sich nie in ein Gespräch mit anderen Figuren ein, außer im Chat auf dem Deck.
- **Das Implantat verändert sich:** Ab Kapitel 3 spricht manchmal der Zeuge durch es (andere Farbe,
  Magenta-Weiß, und Kleinbuchstaben ohne Namen). Der Spieler merkt es erst am Ton.

## 3. Einmischungen und Prüfungen

- **Einmischung (passiv):** Eine Stimme sagt etwas, wenn ihr Wert hoch genug ist. Keine Wahl, nur
  ein Satz, der eine neue Wahl öffnen kann. `{ say: "beobachterin", if: "v_beobachterin>=3", text: "Seine linke Hand. Er hat einen Ring abgelegt." }`
- **Prüfung (aktiv):** eine Wahl mit Etikett, `[HÄNDLERIN 3] „Zweihundert. Und du sagst Varga nichts."`.
  Ist der Wert hoch genug, gelingt sie; sonst misslingt sie, mit eigener Folge (der Händler lacht sie
  aus, der Preis steigt). **Keine Würfel:** Das Ergebnis steht fest, der Solver kann es prüfen, und
  der Spieler sieht vorher, was er wagt.
  - **Weiße Prüfungen** kommen wieder, wenn sich etwas ändert (ein neuer Fakt, ein höherer Wert).
  - **Rote Prüfungen** gibt es nur einmal. Selten, an wichtigen Stellen.
- **Gesperrte Wahlen:** Manche Wahl ist sichtbar, aber gesperrt, mit Grund: `[SCHWESTER 4] Du
  kennst sie nicht gut genug.` So sieht der Spieler, wer Juno sein könnte.
- **Regel gegen Sackgassen:** Keine Prüfung blockiert die Hauptgeschichte. Wer scheitert, kommt auf
  einem anderen Weg weiter (teurer, gefährlicher, mit anderem Wissen).

## 4. Wie ein Gespräch gebaut ist

- **Nie mehr als vier Optionen auf einmal** (entschieden 2026-11-05), den Weg zurück oder hinaus mitgezählt. Längere Gespräche sind verschachtelt: Ein Thema anschneiden bringt seine eigenen Optionen. `Nagiwa.talkTree` (`game/talk.js`) baut so ein Gespräch und lässt mehr gar nicht zu.
- **Nabe und Speichen:** Jedes größere Gespräch hat eine Nabe (die Fragen, die offen sind) und
  Speichen (Themen), die zur Nabe zurückführen. Abgehakte Themen verschwinden oder ändern sich.
- **Haltungen statt Ja/Nein:** Wahlen unterscheiden sich im Ton (kalt, warm, spöttisch, ehrlich), und
  der Ton stärkt Stimmen.
- **Gedächtnis:** Figuren erinnern sich, was Juno gesagt hat (Flags), und an das Kassenbuch (wer
  verkauft wurde).
- **Länge:** Hauptfiguren (Teo, Sable, Morrow, Lantern, Aubrecht, der Zeuge) haben mehrere große
  Gespräche pro Kapitel, Nebenfiguren eine Nabe mit 3–6 Themen.

## 5. Darstellung

- **Kurze Sätze im Raum** (Nebenbei-Sprüche, Einwürfe auf der Straße): wie bisher über dem Kopf
  (Style Guide §8).
- **Gespräche im Protokoll-Modus** (Engine C12): Der Raum dunkelt ab und rückt zur Seite. Eine
  Spalte (etwa 130 px breit) zeigt das ganze Gespräch als fortlaufendes Protokoll: Name in der
  Sprecherfarbe, Text darunter, innere Stimmen in Großbuchstaben in ihrer Farbe. Darunter die
  nummerierten Wahlen, Prüfungen mit Etikett, gesperrte grau. Tasten 1–9 wählen. Oben in der Spalte
  das Porträt des Gegenübers (Style Guide §6, die Nahaufnahmen: Hier werden sie Pflicht).
- Die Schrift im Protokoll ist die 5x7; das muss am Mockup geprüft werden (Lesbarkeit bei 130 px,
  etwa 21 Zeichen pro Zeile). Ein Mockup kommt vor dem Bau.

## 6. Werkzeug

- Geschrieben wird im **Knoten-Editor** der Engine (PLAN C13), mit Gruppen pro Figur und Kapitel
  (`teo/k1`, `sable/k2`).
- Texte gehen wie alle Texte über die Sprachdateien (Deutsch zuerst).
- Der Solver prüft, dass jedes Gespräch endet und keine Prüfung die Geschichte blockiert.

## 7. Offen

- Ein Ort für Gedanken, die Juno mit sich trägt (bei Disco Elysium das Gedankenkabinett)? Ein
  eigener Vorschlag: die **Pinnwand** in ihrer Wohnung. Fäden zwischen Fotos und Notizen; wer zwei
  Dinge verbindet, bekommt einen Gedanken, der eine Stimme dauerhaft stärkt und neue Wahlen öffnet.
  Erst nach Kapitel 1 entscheiden.
- Wie viele Stimmen: sechs ist der Vorschlag; weniger, wenn sich zwei zu ähnlich anhören.
