# Rätsel: was wir aus vier Walkthroughs lernen (2026-11-07)

Eine Studie, keine Entscheidung. Gelesen: Monkey Island 1, Indiana Jones and the Last Crusade, Dreamweb und 2064: Read Only
Memories (`docs/walkthroughs/`, nur intern, gitignored). Übernommen wird nichts davon wörtlich, nur die Bauweise. Alles hier
muss zu unseren Regeln passen (`CLAUDE.md`, Konventionen):

- Was man findet, kann man sofort nehmen und benutzen.
- Ansehen erzählt nur mehr, das Spiel hängt nie daran.
- Kein Timing, kein Zielen, keine Gesten als einziger Weg.
- Höchstens vier Optionen in einem Dialog.
- Alles ist ein Flag, und der Solver muss jedes Kapitel ohne Soft-Lock schaffen.

## 1. Was die vier Spiele gut machen

| Spiel | Was trägt | Für uns |
|---|---|---|
| **Monkey Island** | Ketten mit Witz (Pfefferminz für den Gefangenen, Kuchen mit Feile); **zusehen, dann nachmachen** (der Händler öffnet den Tresor, man macht es ihm nach); Wissen sammeln, das später ein Duell gewinnt (Beleidigungsfechten); ein Gegenstand, der nach Stunden plötzlich passt (die Werbebroschüre für die Kannibalen) | Zusehen ist unser Kern. Ein „Duell“ gewinnt man bei uns mit Beweisen aus dem CACHE. |
| **Indiana Jones 3** | **mehrere Lösungen** für fast jede Sperre (reden, prügeln, verkleiden); zu zweit spielen: der Vater lenkt ab, Indy stiehlt; das Tagebuch als Handbuch, das man lesen muss | Juno am Deck lenkt ab, jemand anders handelt auf der Straße. Das Beobachter-Handbuch und Anlage C sind schon so ein Buch. |
| **Dreamweb** | eine glaubwürdige Welt, in der fast alles aufhebbar und das meiste nutzlos ist; **Codes stehen in der Welt** (Zettel, Mails, Konsole); Gewalt ohne Rätselkram („keine Pfeffer-auf-Taschentuch-Lösung“) | unsere Stimmung. NETZ und Chat als Ort für Codes und Hinweise. Und manche Sperren dürfen einfach roh sein. |
| **Read Only Memories** | **Wissen als neue Dialogzeile** an einem anderen Ort; wenige Gegenstände (2 bis 4 pro Kapitel), fast nie kombiniert, manche mit mehreren Verwendungen; ein Begleiter, der Hinweise gibt; eine Anwerbe-Runde vor dem Finale; **Scheitern als eigene Wahl** mit eigenem Ende | EVI und die inneren Stimmen als Begleiter. Kapitel 5 ist unsere Anwerbe-Runde. |

**Was wir nicht übernehmen:**
- Echtzeit: die Grog-Becher, die schmelzen, die Möwe, das Zeppelin-Laufen, die Jagd in ROM. Bei uns wird daraus eine Kette in
  Spielzeit, oder Juno wartet selbst ab (wie bei der Drohne in Job B).
- Zufällige Codes: der Tresor in Monkey Island, die Statue in Dreamweb. Der Solver braucht ein festes Spiel.
- Ansehen als Schlüssel: die Spurensuche in ROM. Bei uns zieht ein Klick (benutzen) oder eine innere Stimme den Schluss.
- Raten in Schleifen: alle Kombinationen durchprobieren, vier Autos zum Knacken.

## 2. Unsere Bausteine

Ein Rätsel bei uns verbindet die zwei Arten zu spielen. **Im Feed** sieht Juno, liest, folgt, nimmt auf und steuert. **Auf der
Straße** geht sie hin, redet, nimmt, gibt und benutzt. Die Uhr läuft nur beim Warten, und die Leute folgen ihren Tagesabläufen.

| Muster | Wie es bei uns geht | Schon im Spiel |
|---|---|---|
| **Zusehen, dann nachmachen** | Im Feed sieht Juno, wie jemand eine Tür, einen Tresor oder einen Aufzug bedient (Code, Takt, Reihenfolge). Auf der Straße oder im Steuern macht sie es nach. | Takt für CAM 31, Okonkwos Tresor |
| **Der richtige Winkel** | Eine Kamera sieht nur den Rücken, eine andere (Automat, Haustür, Kapsel) das Gesicht oder die Hände. Juno muss die zweite erst bekommen: Code, Abzweiger, Hotelnetz. | cam07 und cam07v, cam03 und cam04 |
| **Wissen als Schlüssel** | Was Juno gesehen hat, steht als Notiz im CACHE und öffnet anderswo eine Dialogzeile oder eine Antwort im Chat („Ich weiß, wo du Dienstag warst.“). | Sable und Kesslers Schulden, Varga und die Kapsel |
| **Beweis vorlegen** | Ein Gespräch, das man mit Clips aus dem CACHE gewinnt, Satz gegen Satz, wie das Fechten in Monkey Island. Jeder Beweis hat einen Preis: Wer ihn zeigt, verrät, dass Juno geglasst hat. | noch nicht |
| **Ablenken aus dem Feed** | Juno schaltet einen Werbeschirm, eine Kapselanzeige, ein Licht oder eine Durchsage. Jemand anders geht in der Zeit vorbei: Motte, Lantern, Morrow, oder Juno selbst auf der Straße. | noch nicht (geplant für den Einbruch in Kap. 5) |
| **Zwei Wege, ein Ziel** | Geld oder Gefallen (Sable: 80 Chits oder die Notiz), Lüge oder Wahrheit, Gewalt oder Reden. Der Weg kostet etwas anderes und landet im Kassenbuch. | Sable, K1a, K1b |
| **Was man liegen lässt, kommt wieder** | Ein Gegenstand, eine Notiz oder ein Ort aus einem frühen Kapitel passt Stunden später: der Ausweis, der Haken, der Weg aufs Dach, Morrows Umschlag. | Ausweis am Fenster |
| **Das Kassenbuch als Schlüsselbund** | Wer im Kassenbuch gut wegkommt, hilft später (Okonkwo, Kessler, Imai). Wen Juno verkauft hat, hilft nicht, und es gibt einen teureren Weg. | angelegt (Okonkwos Reis) |
| **Die Uhr als Rätsel** | Wer wann wo ist, lässt sich in den Kameras ablesen. Ein Ort ist nur frei, wenn jemand woanders ist. Alles auf den 15-Minuten-Takten. | Kessler um 22:15, Ines' Woche |
| **Kein Rätsel** | Manchmal ist die Lösung roh oder traurig, und das Spiel sagt es (Dreamweb). Die vier Versuche in CAM 31 sind so ein Ort. | CAM 31 |

**Gegenstände:** wenige pro Kapitel (2 bis 4, wie in ROM). Fast nie zwei miteinander kombinieren, meistens einen auf die Welt
oder an jemanden. Lieber einer mit mehreren Verwendungen als viele mit einer. Ein Gegenstand darf ein langer Witz sein, der erst
spät aufgeht.

## 3. Ideen pro Kapitel (Vorschläge, passend zu story §7)

**Kapitel 1 (gebaut):**
- Mottes Lektionen als zweiter Weg zum Abzweiger (steht schon im Design).
- Der Ausweis öffnet das Fenster und kommt später wieder.

**Kapitel 2, Aufnahme:**
- **Ines' Wohnung:**
  - Im Puffer von CAM 24 sieht Juno, wie die Nachbarin die Haustür öffnet: zusehen, dann nachmachen.
  - Die Kameras zeigen, wann der Flur frei ist. Das steht so schon in der Story.
- **Lantern in den Sümpfen** (Wissen als Schlüssel):
  - Die Regenleserin hat von „Licht im Wasser, einer, der mithört“ geredet.
  - In der RADIO-App findet Juno seine Frequenz, wenn sie weiß, wonach sie sucht. Die Sümpfe navigiert sie über seine
    Durchsagen.
- **Der Stick:**
  - Lantern sieht jede Nacht im Trockner nach.
  - Juno legt den Stick zurück oder bringt ihn hin (§10b). Beides ist ein kleiner Weg in der Stadt.
- **Die Kameras um ihren Block fallen aus:** Juno sieht im Feed, in welcher Reihenfolge, und schließt, woher die Quiet kommt.
  Damit macht sie ihre eigene Arbeit rückwärts.

**Kapitel 3, Lull:**
- **Lull bekommen:**
  - in der Klinik: ein Aufnahmegespräch. Was Juno von Frau Imai und Frau Haldane weiß, sind die richtigen Antworten, und das
    Gespräch ist ein Beweis-vorlegen ohne Beweise;
  - oder teuer bei Sable.
- **Tinte zählt mit Knoten:**
  - Die Knoten im Kabel sind eine Zahl.
  - Mit ihr findet Juno im Traum die Sinker der Halle, und darunter Teo.
- **Die Flucht:**
  - Motte warnt (`moth_student`), oder es geht über das Dach.
  - Der Weg aus dem Fenster, über den Sims und die Leiter, ist dann seit dem Prolog bekannt: Was man liegen lässt, kommt wieder.

**Kapitel 4, Die Quiet:**
- **Das neue Deck aus Teilen** (eine Kette wie beim Fixer in ROM):
  - ein Gehäuse von Ratz, Batterien von Okonkwo (umsonst, wenn Juno ihn gewarnt hat, sonst gekauft), ein Bildschirm aus dem
    Müll, ein Chip von Sable oder aus dem Automaten mit dem Gesicht;
  - so schließt jeder Teil das Kassenbuch einer früheren Wahl auf.
- **Morrow umstimmen** (Beweis vorlegen):
  - mit ihrer Tochter, die Juno im Traum gesehen hat, oder mit dem Clip ihres Umschlags aus Kapitel 1;
  - zwei Wege mit sehr verschiedenem Ton.
- **Die Transitachse:**
  - Morrows Passierschein, oder Junos alter Ausweis (UNGÜLTIG) mit einer Kamera, die ihn als gültig sehen soll: Juno steuert
    den Leser aus dem Feed;
  - so wird der Ausweis der lange Witz, der aufgeht.

**Kapitel 5, Die Krone:**
- **Der Einbruch zu zweit** (Indy und Henry, Maniac Mansion):
  - Juno lenkt aus dem Feed ab (Schirme, Durchsagen, Licht, Aufzüge), der Verbündete geht.
  - Wer welcher Verbündete ist, entscheiden die Flags.
- **Ashe:**
  - Juno stellt ihm eine Falle mit dem, was sie über ihn weiß: Er sieht in Kameras, also zeigt sie ihm eine.

**Kapitel 6:** Das letzte Rätsel nimmt alles wieder auf, was der Spieler gelernt hat (wie ROM im Finale): markieren, folgen, der
Takt, Anlage C, die Verbündeten.

**Lange Witze** (wie die Milch in ROM, die Broschüre in Monkey Island):
- Der vertrocknete Kaktus aus dem Karton: Wer ihn ab Kapitel 1 gießt, hat im Epilog eine Blüte.
- Ratz' „Ding mit den Drähten“, das er selbst nicht erklären kann: In Kapitel 5 macht es genau eine Tür auf.
- Der Nudelautomat, mit dem Juno „einen Streit hatte“: Gejagt in Kapitel 4, gibt er ihr umsonst die Sieben.

## 4. Spielzeit

Bisher (story §1, §7): etwa **12 Std. Hauptgeschichte** und **4 bis 6 Std. Nebengeschichten**, jedes Kapitel etwa 2 Std.
Der Mock von Kapitel 1 hat schon jetzt deutlich mehr Inhalt, als in 2 Std. passt: drei Aufträge, fünf Nebengeschichten, die
Stadt.

Vorschlag zum Entscheiden: mehr Spielzeit, wo sie aus mehr Orten und Nebengeschichten kommt, nicht aus längeren Rätseln.

| Teil | bisher | Vorschlag |
|---|---|---|
| Prolog | 30–40 Min. | 30–40 Min. (Tutorial, bleibt kurz) |
| Kapitel 1–5 | je ~2 Std. | je 2,5–3 Std. Hauptweg, dazu je 1–2 Std. Nebengeschichten |
| Kapitel 6 | ~1,5 Std. | ~2 Std. |
| **zusammen** | **~12 Std. + 4–6** | **etwa 15 Std. Hauptgeschichte, mit allen Nebengeschichten 22–25 Std.** |

Dafür braucht jedes Kapitel ein bis zwei neue Schauplätze und mindestens eine Nebengeschichte, die nur dort spielt. Mögliche
neue Schauplätze, aus Orten, die die Story schon nennt:
- der alte Fischmarkt (CAM 18 gibt es schon);
- die Pumpenhalle 3 mit Tintes Becken;
- die Sümpfe und Lanterns Versteck;
- die Rohre unter der Krone (Ratz' Kolonie);
- die Transitachse;
- eine Etage der mittleren Ringe;
- die Jade Row hinter dem Tor (die Seitengasse, die man von vorn sieht).

**Was das für den Solver heißt:** Mehr Nebengeschichten sind kein Problem, solange jede ein eigener Faden bleibt (`off_<thread>`,
für sich gelöst). Mehr Orte kosten kaum Zustände. Mehr Zeitpunkte schon: Jeder neue Halt der Uhr verschiebt die Wege (wie 00:30
und 01:15 bei Job B).
