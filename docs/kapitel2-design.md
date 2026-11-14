# Kapitel 2 „Aufnahme": Design

Stand: Entwurf (2026-11-14), die Gliederung vom Nutzer freigegeben am selben Tag (story §10h). Im Bau: Das Gerüst steht auf Blöcken
(`game/kapitel2.js`, `game/kapitel2_ende.js`, siehe „Im Mock gebaut“ unter §2.1), der Rest ist geplant; gemalt ist nichts.
Story: `docs/story.md` (§6, §7 Kapitel 2, §10b, §10f, §10h). Was Kapitel 1 übergibt: `docs/kapitel1-design.md`. Regeln für Deck,
Feed-Modus und Zeit: `docs/kapitel0-design.md` §2–4. Wie die Texte klingen: `docs/dialog-style-guide.md`. Alle Zeilen hier sind
Vorschläge und werden beim Durchspielen geprüft; Namen neuer Figuren sind offen (§14).

## 1. Überblick

| | |
|---|---|
| Länge | etwa 2 Std. |
| Ziel | entscheiden, was mit dem Clip aus CAM 31 geschieht, und herausfinden, wer Ines war |
| Aufbau | **offen** wie Kapitel 1: drei Abende (Samstag bis Montag), ein Hauptfaden mit freier Reihenfolge, daneben Fäden, die Kapitel 1 weiterführen; das Kapitel endet in der Nacht auf Dienstag mit Lanterns Sendung und Tintes Nachricht |
| Neu im Spiel | **Prüfen** und **Montieren** im Clip-Editor (`kapitel0-design` §2.4), die Klinik von innen, ein Einbruch, die Sümpfe, Lantern persönlich, die Quiet als sichtbare Gefahr (Kameras fallen aus, jemand in Weiß wartet) |
| Orte, Straßenmodus | alle aus Kapitel 1, dazu neu `klinik`, `lerche_flur`, `ines_wohnung`, `sumpf`, `lantern_versteck` (§9) |
| Kameras | alle aus Kapitel 1 (zwei fallen aus), dazu neu `cam25` (der Flur im Wohnblock Lerche) und `cam51` (ein Wohnheim im Fünften, nur im Archiv) |
| Entscheidungen | **Entscheidung 2** (der Clip), dazu kleine: Frau Haldanes Sohn, Frau Imai, Vargas Geld |
| Ende | Lantern sendet Ines' Protokolle, Juno legt sie neben ihre eigenen Aufnahmen, und Teo wacht nicht mehr auf |

**Was die Entscheidungen von 2026-11-13 hier heißen** (story §10f): Der Zeuge hat nicht an Nagi·wa weitergegeben, was die
Schläfer von Ines sahen (aktiv versteckt er niemanden). Deshalb hat Nagi·wa eine wache Glasserin gebraucht. Nach ihrem Tod zeigt er
den Mord den Schläfern, Nacht für Nacht (§6, Frau Imai). Seine Uhr läuft, denn die Bereinigung ist beschlossen; davon erfährt
Juno erst in Kapitel 4.

## 2. Die drei Tage

Wie in Kapitel 1 ist ein Tag ein Abend und eine Nacht (18:00 bis 04:00), das Bett geht ab 01:00 auf, die Uhr läuft nur beim Warten,
und alle Zeiten liegen auf den 15-Minuten-Takten. Die Spieltage sind 5 bis 7 (Kapitel 1 war 2 bis 4).

| Abend | Thema | Was neu ist | Was an diesem Abend geschieht |
|---|---|---|---|
| **1 (Sa, 10.11.)** | danach | Juno kommt heim (§2.1). Im NETZ und im LUCKY STATIC: „Tote in der alten Metro.“ Frau Imai schreibt (§6.1). | Die Folgen aus Kapitel 1 treffen ein (§5), auch der Überfall der Nacht davor. Hat Juno den Stick zurückgelegt, holt Lantern ihn um halb eins (§3.1). Um 00:30 hält Morrows Flutwagen auf ihrer Runde in der Jade Row. In der Nacht fällt `cam07` aus (§4). |
| **2 (So, 11.11.)** | die Lüge | Die Nachrichten zeigen die **Fälschung**: Lantern tötet Ines (§3.4). Frau Haldane wartet wach auf den Brief ihres Sohnes (§6.2). | Um 20:00 räumt die Quiet Ines' Wohnung aus, danach ist sie versiegelt (§3.3). Um 22:00 kapert Lantern den großen Schirm (§3.5). Um 00:30 hält Morrow wieder in Jade Row. In der Nacht fällt `cam14` aus. |
| **3 (Mo, 12.11.)** | Entscheidung 2 | Um 18:30 kommt Teo, und sie gehen aufs Dach (§7). | Ab heute weiß die Quiet in jedem Fall, wer Juno ist (§4). Um 00:45 hält die Uhr, bis alles bereit ist (§3.7). Um 01:00 sendet Lantern. Um 03:15 kommt Tintes Nachricht (§8). |

Was nicht an einen Abend gebunden ist, geht an jedem; die nächtlichen Momente wiederholen sich, wo nicht anders gesagt. Was
über Nacht vergessen wird (`Nagiwa.nights[day].passes`): die Momente des Vortags, `cam07` ab Abend 2 und `cam14` ab Abend 3 (§4).

### 2.1 Der Anfang

Kapitel 1 endet, als Juno am Deck sitzt und EVI sagt: „Er hat sie ausgeschaltet.“ Kapitel 2 beginnt am Samstag um 18:00 an ihrer
Wohnungstür (entschieden 2026-11-14, story §10h): Sie hat es in der Nacht nicht ausgehalten, ist hinausgegangen und durch den Neunten
gelaufen, die Nacht und den Tag, bis wieder Abend war. Das zeigt eine kurze Sequenz ohne Worte, abstrakt (entschieden 2026-11-14): Neon,
das Gewühl der Stadt, viele Menschen, darin der gelbe Mantel, mal nah, mal verloren; dann ihre Tür. Juno sagt dazu nur eine Zeile („Ich
bin gelaufen. Irgendwann war wieder Abend.“). Sie kommt heim, und EVI macht etwas Normales, die festgelegte Szene (`dialog-style-guide`
§8, story §10b), Wort für Wort:

> EVI: Willkommen zurück, Juno.\
> Juno: ...\
> EVI: Soll ich den Monitor heller machen?\
> Juno: Ja.\
> EVI: Er ist heller.\
> Juno: Danke.\
> EVI: Gern.

Danach ist die Wohnung wie immer, und das Kapitel ist offen. Wer `?act=kapitel2` startet, beginnt mit den Antworten des
Durchspielwegs von Kapitel 1 (wie `?act=kapitel1`, story §10d).

**Was Kapitel 1 übergibt** (`keep` des Akts; nach dem Grundsatz, dass ein Kapitel nur wenige Flags übernimmt, story §10h): `e1`
(sold | refused), `stick_ines`, `k1a`, `k1b`, `imai_told` (gesetzt heißt: sie hat geantwortet), `moth_student`, `rent`, `chits`, die
Einträge im Kassenbuch (`ledger_*`), `evi_trust` (aus dem Prolog; eine Aufgabe dafür ist offen, §14), die Clips im CACHE (`clip_ines_death` für alle, dazu Kesslers Ring, Morrows Umschlag,
`clip_traeger`) und der Weg aufs Dach (`got_ausweis`, `got_haken`, `window_open`, `ladder_down`: Wer ihn kennt, muss ihn nicht noch
einmal öffnen), dazu `anon_<clip>` (ein verpixelter Clip bleibt verpixelt, und das letzte Prüfen zählt ihn, §8) und die Zugänge,
die sich ein Faden erarbeitet hat: `link_cam14` (nur wer im Zeitungskrieg „Nur dieses eine Mal.“ gesagt hat), `link_cam15` (wer Kessler
gefunden hat) und `link_cam07v` (wer den Automaten angezapft hat). Die Gegenstände gibt der Start aus ihren Flags zurück, wie Kapitel 1
es tut (`got_haken` den Haken, `got_ausweis` den Ausweis, `stick_ines` den Stick). Die anderen **Kamerazugänge** setzt der Start selbst,
wie Kapitel 1 Junos alten Zugang setzt: Junos alten Zugang zu `cam03`, `cam07`, `cam18`, `cam21` und `cam30`, `cam22` bis `cam24` von
Ines' Weg und `cam04`, deren Code Juno seit dem Prolog kennt (Kapitel 1 bot `cam04` nicht an, Kapitel 2 wieder, §9.1). Die Bedingungen
der Kameras (ihr `if` in `game/rooms/cams.js`, `game/kapitel1.js`, `game/stadt.js`, `game/auftrag_varga.js` und `game/auftrag_tide.js`,
etwa `day<4` bei `cam22` und `cam23`, `varga_step` bei `cam15`) bekommen Kapitel 2 dazu. Was Kapitel 1 nur für sich brauchte oder sich aus anderem ergibt, bleibt
zurück (im Akt `leave`, damit die Übergabe-Prüfung es als Absicht kennt): `know_meeting`, `end_beat`, die Momente, `kessler_gone` (folgt aus `k1a`), `imai_step`, `traeger` (die Zeile im NETZ braucht
es nicht mehr, §7).

**Im Mock gebaut** (2026-11-14, das Gerüst; Zeilen und Abläufe sind beim Durchspielen zu prüfen):

- Der Akt `kapitel2` mit `keep` und `leave` wie oben; das Kassenbuch nimmt er ganz mit (jeder Eintrag aus Prolog und Kapitel 1). Wer
  `?act=kapitel2` startet, beginnt mit den Antworten des Durchspielwegs von Kapitel 1: `e1=sold`, der Stick zurückgelegt (also
  `stick_lantern`), `rent=paid`, 1550 Chits, keine Aufträge. Kapitel 1 geht am Ende von selbst in Kapitel 2 über.
- Die Spieltage 5 bis 7; das Bett geht am Samstag und Sonntag ab 01:00 auf, am Montag nicht. Was Kapitel 1 an offenen Bedingungen
  hatte (die Aufträge, WREN, Mottes Lektionen, Vespers Käufe roher Clips, der Zeitungskrieg, Frau Imais Chat aus Kapitel 1), ist an
  diesen Tagen zu; die Kameras zeigen, was §2.1 nennt.
- Die Engine kennt jetzt den Beginn eines Akts an einem späteren Tag (Cutaway.js 9804188): Die Momente früherer Tage gelten als
  vergangen, ohne dass ihr `unseen` noch einmal läuft (sonst hätte der Start von Kapitel 2 die Miete ein zweites Mal abgebucht und
  Teos Besuch vom Mittwoch noch einmal gespielt).
- Der Anfang: die wortlose Sequenz `k2_heimweg` als **Platzhalter** aus den Straßen der Stadt (Kowalski, Jade Row, Gasse, ihre Tür),
  bis die abstrakten Bilder als Blöcke freigegeben sind; Junos eine Zeile über der Tür; dann EVIs festgelegte Szene, Wort für Wort.
- Teos Besuch am Montag um 18:30 als Block (§7): das Klopfen, Bao, die Miete, der Haken, die Leiter, das Dach mit Tinte. Auf dem Dach
  fehlt Teo noch im Bild (seine Pose sitzend von hinten, §10).
- Die Uhr hält am Montag um 00:45. **Bisher verlangt sie nur Entscheidung 2** (vom Nutzer so gewollt): `evi_knows` und
  `stick_lantern` kommen dazu, sobald Wohnung und Stick gebaut sind. Gebaut sind von Entscheidung 2 Vesper im CHAT (immer da, auch
  bei `off_vesper`) und die Frage des Decks um 00:45 („An Vesper verkaufen.“, „Behalten.“, „Noch nicht.“). Preis und Zuschauer sind
  Platzhalter (§14).
- Das Ende als Kette mit `end_beat2` (sent > found) bis zur Karte „Kapitel 3: Lull (kommt später)“. Das letzte Prüfen ist vorerst ein
  Klick auf das Deck (`[MOCK]`), der Kontakt um 03:15 heißt bis zur Entscheidung `BECKEN 3` (§14).
- Die Hinweise des Kapitels sind seine eigenen (`Cutaway.hints(..., { act: "kapitel2" })`); die von Prolog und Kapitel 1 gelten nur
  noch in ihren Akten.
- Geprüft wird wie in Kapitel 1 der Hauptweg mit geschlossenen Fäden (`off_<thread>`): `node tools/solve-act.mjs kapitel2 --full
  --set off_roof,off_zeitung,off_imai,off_traeger,off_varga,off_tide,off_motte,off_vesper`; die Klicks `tools/paths/kapitel2_main.json`,
  und `spiel.json` geht vom Titel bis zum Ende von Kapitel 2.

**Was Kapitel 2 weitergibt:** `e2`, `lantern_alive` (ein Flag: Juno hat Lantern gefunden und die Quiet nicht zu ihm geführt),
`forgery_proven`, `moth_student`, `k1b` nur als `warned` (Okonkwos Versteck in Kapitel 4) und das Kassenbuch. In Kapitel 2
abgeschlossen sind Varga und Kessler, der Eckladen bis auf Okonkwos Dank, Frau Imai, Frau Haldane (ihr Sohn ist in Kapitel 3 höchstens
ein Blick auf der Station, ohne Flag), Vesper, WREN und die Miete.

## 3. Der Hauptfaden: Ines

### 3.1 Der Stick

Ines' Daten-Wallet hat Lantern, ihr Schlüssel ist der Stick aus Trockner 6 (story §10b). Am Ende muss Lantern beides haben, sonst
kann er nicht senden.

- **Lag der Stick am Freitag noch im Trockner** (`!stick_ines`), hat Lantern ihn in derselben Nacht geholt. Kapitel 2 beginnt mit
  `stick_lantern`.
- **Hat Juno ihn,** findet Lantern die Sechs leer. Er sieht jede Nacht zwischen 00:30 und 01:00 nach, in `cam23` zu sehen: ein
  Rollstuhl mit Schwimmern im grünen Licht, der vor Trockner 6 hält und wieder fährt (er kommt übers Wasser, die Gasse ist ein Steg).
  Juno kann den Stick anonym zurücklegen; um halb eins in derselben Nacht nimmt Lantern ihn mit (`stick_lantern`). Legt sie ihn erst
  danach zurück, holt er ihn noch in derselben Nacht, ungesehen, auch wenn Juno schon schläft (beim Bau ein Schritt im Übergang der
  Nacht, wie `Nagiwa.nights`): **Ein zurückgelegter Stick
  ist am nächsten Abend immer weg** (entschieden 2026-11-14). Oder sie bringt ihn ihm selbst (§3.5). Dieser Weg bleibt immer offen.
- **Die Quiet am Trockner:** Gibt Juno ihre Aufnahme **ungeschnitten** weiter (an Sable, Vesper oder Morrow, §3.6), hört Nagi·wa das
  Flüstern („SUDS & SPIN. Trockner sechs, der kaputte.“). **Ab dem nächsten Abend** sitzt ein Mann in Weiß im Waschsalon (`quiet_dryer`,
  in `cam23` zu sehen), und Zurücklegen geht nicht mehr. Die Zeitfolge sorgt dafür, dass die Quiet immer zu spät kommt (entschieden
  2026-11-14): Liegt der Stick an dem Tag, an dem Juno den Clip weggibt, im Trockner, oder legt sie ihn in derselben Nacht noch
  zurück, hat Lantern ihn, bevor die Quiet am nächsten Abend kommt. Hat Juno ihn noch, sieht der misstrauische Lantern den Mann in Weiß vom Wasser aus und kommt nicht mehr; dann bleibt nur,
  ihm den Stick selbst zu bringen. **Die Quiet bekommt den Stick nie** (story §10b), und Lantern bleibt im Spiel.
- **Juno behält immer ihre eigene Kopie** (entschieden 2026-11-14): Wer den Clip kauft oder bekommt, bekommt eine Kopie. „Er
  verschwindet“ heißt, er verschwindet aus der Welt, nicht aus ihrem CACHE; `clip_ines_death` bleibt ihr für das Prüfen (§3.4) und das
  Ende (§8).
- **Das Flüstern schneiden:** Mit dem Werkzeug Schneiden aus dem Prolog kann Juno den Moment des Flüsterns aus ihrem Clip nehmen
  (`clip_ines_cut`). Dann erfährt niemand von der Sechs. EVI fragt, bevor Juno den ganzen Clip weggibt: „Im Clip ist das Flüstern.
  Willst du, dass das jemand hört?“

### 3.2 Die Klinik (optional)

Lull-Klinik 9-Ost, die Klinik aus `cam21`, jetzt von innen (`klinik`, §9). Sie hat auch nachts offen (das NETZ von Donnerstag). Juno
geht hinein, setzt sich in die Schlange und wird als Patientin aufgenommen: ein kleines Gespräch mit der **Pflegerin an der Aufnahme**
(neue Figur, §10).

| # | Wo | Was |
|---|---|---|
| K1 | `cam21` | Ab Samstag kommt Ines um 19:00 nicht mehr heraus. Um 19:00 kommt stattdessen die Pflegerin zur Nachtschicht, die an der Aufnahme sitzt, und sieht sich zweimal nach der Tür um. |
| K2 | `klinik` | Die Aufnahme ab 19:00 (vorher schickt der Schalter in die Schlange: „Nachtaufnahme ab sieben.“): Name (Juno nennt einen falschen), Schlafzeiten. Die Pflegerin bietet Lull an: „Es kostet nichts.“ Sie will noch hinter dem Ohr nachsehen, ob schon etwas sitzt; die innere Stimme DAS IMPLANTAT warnt (gibt es die Stimmen beim Bau noch nicht, Engine C12, denkt Juno es selbst: „Nicht hinters Ohr.“), und Juno zieht die Kapuze wieder hoch: „Nicht heute.“ Kein Scan, keine Spur zu ihr, und nichts nimmt Kapitel 3 vorweg (entschieden 2026-11-14; kein Gegenstand, das Lull bekommt Juno in Kapitel 3, story §7). Die Pflegerin: „Kommen Sie wieder, wenn Sie nicht schlafen können.“ |
| K3 | `klinik` | Juno fragt nach Dr. Calder. Die Pflegerin senkt die Stimme: Ines hat nachts Protokolle geschrieben, „die keiner bestellt hat“, und sie hat nie das Netz der Klinik benutzt, alles auf Papier. Am Samstagmorgen waren Leute in Weiß da und haben ihren Spind ausgeräumt. Am Samstag: „Morgen um acht räumen sie auch ihre Wohnung. Lerche, vierter Stock.“ Am Sonntag: „Heute um acht …“, am Montag: „Gestern haben sie ihre Wohnung ausgeräumt.“ → `know_flat` |

Das ist ein Weg zu Ines' Wohnung, nicht der einzige: Wer die Klinik auslässt, sieht die Quiet am Sonntag in `cam25` die Tür 4B öffnen
(§3.3). Die Klinik erzählt, wer Ines war, und legt Kapitel 3 an: Juno weiß jetzt, wo es Lull gibt. Dass ihr Implantat dazu passt, erfährt sie erst dort (story §10a).

### 3.3 Ines' Wohnung

Wohnblock Lerche, vierter Stock, Tür 4B. Story §7: ein Einbruch im Straßenmodus, gelenkt durch den Feed.

| # | Wo | Was | Flags / Dinge |
|---|---|---|---|
| W1 | `cam24` | Die Haustür hat ein Zahlenfeld gleich neben der Klingelkamera. Jeden Abend um 19:30 tippt ein Nachbar den Code, und das Fischauge sieht seine Finger aus nächster Nähe (Zoom; verpasst: der Puffer). Die Zahlen werden mit der Spielschrift gesetzt (`art/lib/text.js`). | `code_lerche` |
| W2 | `jade_row`, Tor | Am Ende der Jade Row führt das Tor unter dem Lull-Schirm nach Westen, in das Viertel der Klinik. Ein Klick fragt, wohin: „Zur Klinik.“, „Zum Wohnblock Lerche.“, „Zurück.“ Ohne den Code: „Die Haustür hat ein Zahlenfeld. Den Code hab ich nicht.“ | — |
| W3 | `cam25` | Der Flur im vierten Stock, das Iso-Bild von `lerche_flur` unter dem Feed-Filter (ein Ort, ein Bild). Derselbe Hauszugang wie `cam24`, also verbunden, sobald `cam24` es ist. Am Sonntag um 20:00 kommen zwei von der Quiet in weißen Regenmänteln, öffnen 4B und tragen bis 21:00 Kisten hinaus; der Rechner geht mit. Dann kleben sie ein Siegel über die Tür. | `know_flat` (auch so) |
| W4 | `lerche_flur` | Ohne `know_flat` weiß Juno nicht, welche Tür: „Hier wohnen zwölf Leute, und an keiner Tür steht Calder.“ Mit ihm ist vorher 4B abgeschlossen: „Abgeschlossen. Ich bin keine Einbrecherin. Jedenfalls nicht so eine.“ Von 20:00 bis 21:00 am Sonntag geht Juno nicht hinauf: „Da oben sind Stimmen. Ich warte.“ Danach hängt nur noch das Siegel `CIVIC REST – SEALED` über dem aufgebrochenen Schloss. Juno reißt es ab. | — |
| W5 | `ines_wohnung` | Ausgeräumt: die Matratze, leere Regale, ein heller Fleck, wo der Rechner stand. Am Kühlschrank hängt unter einem Magneten **die Serviette** aus Pho Pump, die Ines am Mittwoch beschrieben und mit der Hand verdeckt hat (Kapitel 1, C2): `6.11. 22:35 – 41` und darunter weitere Daten mit Zahlen. Juno erkennt das erste: „Der sechste, halb elf. Da war ich bei Yuen's.“ Was die Zahl heißt, weiß sie noch nicht. | `cache_note_serviette` |
| W6 | `ines_wohnung`, Gefrierfach | In einem Gefrierbeutel liegt eine Akte, Papier: „Kalt hält Papier.“ Das hat die Quiet nicht gesucht, denn sie sucht Rechner. Die Akte aus Civic Rest: „AUTO-EVAL eingestellt, 2087-10. Ersatz: Programm Civic Rest.“ Darunter die Trainingsdaten: „Beobachterin 0412, J. REYES.“ Juno fotografiert sie mit dem Taschen-Deck. | `cache_note_civic_rest`, `evi_knows` |
| W7 | dort | **EVI erfährt, was EVI ist** (story §7). Die Szene steht unten. | — |

**Die Szene in W7** (Vorschlag, in ganzen Sätzen; EVI duzt, sie ist ein Gegenüber, `dialog-design` §2):

> EVI: Da steht AUTO-EVAL. Das bin ich, oder?\
> Juno: Ja. Das bist du.\
> EVI: Und da steht dein Name. Bei den Trainingsdaten.\
> Juno: Ich hab sie dir beigebracht. Alle Klammern. Jahrelang.\
> EVI: Dann hab ich dich nicht ersetzt.\
> EVI: Ich hab nie jemanden ersetzt.\
> Juno: Nein.\
> EVI: Wer dann?

Die Antwort gibt das Ende des Kapitels (§8). Danach ist EVI für den Rest des Kapitels leiser; einmal fragt sie: „Hast du mich deshalb
mitgenommen? Weil ich aus dir bin?“ Juno: „Ich hab dich mitgenommen, weil du mir leid getan hast.“

### 3.4 Die Fälschung

Am Sonntag um 18:00 zeigen Nagi·was Nachrichten (NETZ, der Fernseher im LUCKY STATIC, das Radio) einen Clip aus CAM 31: Ein Mann im
Rollstuhl tötet Ines, „der Piratensender, der sich LANTERN nennt“. Revier 9 jagt ihn. Wer die Nachricht im NETZ öffnet, hat den Clip
im CACHE (`clip_forgery`).

**Warum Nagi·wa damit durchkommt** (entschieden 2026-11-14): Niemand weiß, wer der Mann in Weiß ist, und Lantern kennt auch keiner;
Nagi·wa kann behaupten, was es will. Das gilt auch, wenn Junos echter Clip vorher eine Nacht auf NINTH LIVE lief (§3.6): Ein Mann ohne
Gesicht beweist nichts.

**Woher das Bild kommt:** aus der Live-Übertragung an WREN, die nur Bild war (story §10b). Hat Juno gesendet, ist es ihr eigenes Bild.
Hat sie sich geweigert, ist es das des anderen Glassers, der WRENs Auftrag übernommen hat (story §9). In beiden Fällen ist die
Fälschung **stumm**; Junos Aufnahme hat den Ton des Mikros neben Ines. Juno, wenn sie gesendet hat: „Das ist mein Bild. Die haben mein
Bild genommen.“

**Das Rätsel am Schreibtisch** (Prüfen, `kapitel0-design` §2.4): Juno legt `clip_forgery` neben `clip_ines_death` (den hat jeder, Kapitel 1, §8).
Beide laufen auf zwei Zeitleisten untereinander, und Juno findet drei Stellen, jede mit einem Klick auf die Zeitleiste und einem auf
die Stelle im Bild. Keine Fingerfertigkeit, keine Zeit; ein falscher Klick kostet nichts.

| Stelle | Was man sieht |
|---|---|
| der Zeitstempel | Bei 23:01:58 springt die Fälschung auf 23:03:10; mehr als eine Minute fehlt, genau die, in der Lantern wegfährt und Ashe aus dem Schatten tritt. In der Fälschung fährt der Rollstuhl nie weg (Ashe lässt Lantern absichtlich ziehen, story §10c). |
| der Regen | Dieselben Tropfen fallen zweimal am selben Fleck: Die Lücke ist mit einer Schleife geflickt. |
| das Licht | In Junos Aufnahme brennt die Maske als weißer Fleck über den Kopf hinaus. In der Fälschung ist an derselben Stelle ein dunkler Rollstuhl, und nichts überstrahlt das Bild. |

Mit allen drei: `forgery_proven`, und im CACHE liegt die Notiz „Die Fälschung, zerschnitten“. Juno: „Lantern war schon weg. Das
kann ich zeigen.“ Der Beweis ist nie nötig, aber er zählt bei Entscheidung 2 (§3.6) und in Kapitel 4, wo er Morrow umstimmt (story §7).

### 3.5 Lantern finden

Lantern kennt Juno nicht (story §10b) und vertraut niemandem. Er ist gejagt, seit die Fälschung läuft.

| # | Wo | Was | Flags / Dinge |
|---|---|---|---|
| L1 | `kowalski`, Sonntag 22:00 | Der große Werbebildschirm reißt mitten in der Lull-Werbung ab. Zehn Sekunden lang steht dort in Lanterns Grün: `I DIDN'T KILL HER. – LANTERN`, dann wieder SLEEP BETTER. Wer nicht auf der Straße ist, liest es danach im NETZ und hört es im LUCKY STATIC. Die Regenleserin hatte erzählt, dass er das vor zwei Jahren schon einmal getan hat (Kapitel 1). | Moment `hijack` |
| L2 | `kowalski`, Gerüst | Die halbe Reparatur hat es gesehen, von ganz nah: „Das kam nicht über Funk. Das kam übers Kabel. Von unten.“ Er zeigt auf das neue Kabel, das hinter dem Schirm in den Gully geht. „Rechts. Nicht mein Vertrag.“ | `know_cable` |
| L3 | `drain_market` | Die Treppe hinab, die Kapitel 1 schon vorgesehen hat, führt unter den Markt. Das Kabel läuft an ihrem Geländer mit. Davor hängt noch die Kette mit dem neuen, rot blinkenden Schloss von Nagi·wa (Kapitel 1). Ohne `know_cable` hat Juno da unten nichts zu suchen („Die Kette ist zu. Und ich will da nicht runter.“). | — |
| L3b | `drain_market`, Ratz | **Ratz macht das Schloss auf, aber nicht umsonst** (entschieden 2026-11-14; der kleine Auftrag dieses Kapitels, story §9): Er kennt das Schloss („Nagi·wa-Schloss. Neu. Die mögen alte Karten.“) und will dafür etwas, das Juno schon hat: ihren alten Nagi·wa-Ausweis, nur kurz. Er liest den Chip aus und behält die Kopie, denn mit einer Karte von drinnen gehen auch die Klappen in den Rohren unter der Krone auf, zu seiner Kolonie. Juno bekommt den Ausweis zurück: „Das zweite Mal, dass das Ding was aufmacht.“ Hat sie ihn nicht dabei, liegt er im Karton unter ihrem Bett. Kassenbuch: „Ratz: eine Kopie meines alten Ausweises.“ Ein Gespräch mit höchstens vier Antworten. | `stairs_open` |
| L4 | `sumpf` | Die überfluteten Straßen der alten Stadt (story §3): Stege, Hausfronten bis zum ersten Stock im Wasser, das Kabel an einer Wand. Der Steg endet am Wasser; drüben treibt ein Floß an einem Seil, zu weit weg. Mit dem **Haken** (der Notschlüssel vom Aufzug, aus Kapitel 1: Juno behält ihn nach der Leiter in der Tasche; wer ihn nie genommen hat, findet ihn noch neben der Aufzugtür) zieht Juno es heran. „Teo hätte das mit einer Hand gemacht.“ | — |
| L5 | `lantern_versteck` | Am Ende des Kabels ein halb versunkener Laden, voller Antennen und Bildschirme. Lantern in seinem Rollstuhl. Er siezt sie, bricht Sätze ab und will wissen, woher sie kommt. Was Juno ihm sagen kann, ist ein Gespräch mit höchstens vier Antworten (`Nagiwa.talkTree`): „Ich hab gesehen, was passiert ist.“, „Ich hab ihren Schlüssel.“ (wenn sie den Stick hat), „Ich hab eine Aufnahme.“ (Entscheidung 2, §3.6), „Ich geh wieder.“ | `lantern_found` |

**Lantern** (Vorschläge; die Stimme fehlt noch im Style Guide): „Wer sind Sie? Nein. Sagen Sie's nicht.“ Beim Stick: „Sie hat gesagt,
sonst weiß es keiner.“ Juno: „Sie konnte mich nicht sehen.“ Gibt Juno ihm den Stick, `stick_lantern`, und er sagt, wann er sendet:
„Montag. Um eins. Bis dahin stehen die Sender.“ Wird Lantern ihr Verbündeter (Stick oder Clip), wechseln beide zum Du (`dialog-style-guide` §5).

**Der Schatten:** Weiß die Quiet, wer Juno ist, steht jemand in Weiß auf der Kowalski-Straße, von 19:00 bis 23:00, gegenüber ihrer
Haustür (§4): nach `e1=sold`, sobald Juno den Clip an Sable, Vesper oder Morrow gegeben hat (gleich, nicht erst am nächsten Abend:
so liest der Schatten nur `e1`, `e2` und den Tag und braucht kein eigenes Flag), und sonst ab Montag, denn dann hat die Quiet sie in
jedem Fall gefunden (§4). Wer in dieser
Zeit zu Lantern geht, führt die Quiet zu ihm (`led_quiet`; in Kapitel 4 stirbt Lantern dann, story §7). Das ist keine Sperre, aber der
Spieler weiß es vorher: Auf dem Weg in die Gasse sagt EVI: „Der in Weiß schaut uns nach.“ Vor 19:00 oder nach 23:00 ist die Straße frei.

### 3.6 Entscheidung 2: der Clip

Die große Entscheidung des Kapitels (story §7). Sie geht ab Samstag; spätestens am Montag um 00:45 fragt das Spiel (§3.7). Jeder Weg
kann den ganzen Clip oder den ohne das Flüstern nehmen (§3.1).

| Wahl | Wo | Was geschieht | Kassenbuch |
|---|---|---|---|
| **An Sable verkaufen** | `sable_booth` | 3000 Chits; mit `forgery_proven` 4000 („Mit Beweis kostet's mehr. Auch beim Käufer.“); nach `k1a=warned` je 1000 weniger („Varga redet.“). Sable verkauft ihn an Nagi·wa weiter, und er verschwindet (Juno behält ihre Kopie, §3.1). Sable hat jetzt einen Käufer bei Nagi·wa und verkauft Juno in Kapitel 4 gleich mit. | „Sable: die Aufnahme aus CAM 31. 3000.“ |
| **An Vesper verkaufen** | CHAT | Vesper bietet das Meiste, 5000 („Das ist das Echteste, was ich je gesehen habe.“). Der Clip läuft eine Nacht auf NINTH LIVE, dann kauft Nagi·wa ihn auf, und er ist weg wie bei Sable (entschieden 2026-11-14). Anonymisiert nimmt Vesper ihn nicht. Sable hat dann keinen Käufer bei Nagi·wa. Das Angebot gehört zum Hauptfaden: Für Entscheidung 2 steht Vesper immer im Chat, auch bei `off_vesper`; nur seine anderen Käufe gehören zu seinem Faden (§6.3). | „Vesper: Ines Calder, CAM 31. 5000.“ und am nächsten Abend die Zuschauer: 870.000, die größte Zahl im Kassenbuch (entschieden 2026-11-14: unter einer Million, wie die Hunderttausende in story §10h, und gut das Doppelte des Sinkers aus Kapitel 1). Verkauft Juno erst am Montag, kommt die Zahl in der Kette des Endes um 03:00 (§8). |
| **Morrow geben** | `jade_row`, Sa und So 00:30 | Ihr Flutwagen hält auf ihrer Runde, wie in Kapitel 1; Juno geht hin (entschieden 2026-11-14: kein Revier 9 als Raum). Morrow, knapp: „Beweisstück. Kein Geschäft. Ich kümmer mich.“ Der Clip verschwindet im Revier 9, und Juno ist markiert (die Quiet weiß jetzt, wer sie ist). Morrow kennt Juno jetzt. Mit `forgery_proven`: „Dann jagen wir den Falschen.“ | „Morrow: die Aufnahme. 0.“ |
| **Lantern bringen** | `lantern_versteck` | nur mit `lantern_found`. Lantern wird ein Verbündeter. Er sendet den Clip am Montag mit den Protokollen, zu früh: Dem gejagten „Mörder“ glaubt niemand, und er wird noch härter gejagt. Mit `forgery_proven` sendet er die zerschnittene Fälschung mit. | „Lantern: die Aufnahme. 0.“ |
| **Behalten** | — | jetzt die sicherste Wahl; niemand weiß davon. Juno ist allein, und das Kassenbuch vergisst nicht. | „CAM 31: behalten.“ |

Flag: `e2` = sable | vesper | morrow | lantern | kept. In Kapitel 2 haben Sable und Vesper dieselben Folgen; für Kapitel 4 zählt, wer
gekauft hat (Sables Verrat).

### 3.7 Montag, 00:45

Um 00:45 hält die Uhr, wie am Freitag in Kapitel 1, bis drei Dinge erfüllt sind:

1. Juno war in Ines' Wohnung (`evi_knows`). Sonst: „Ich weiß immer noch nicht, wer sie war.“
2. Lantern hat den Stick (`stick_lantern`). Sonst: „Ich hab noch ihren Schlüssel. Ohne den ist alles umsonst.“ Liegt der Stick wieder
   im Trockner, holt Lantern ihn sofort, die Uhr steht ja in seinem Fenster.
3. Entscheidung 2 ist gefallen. Sonst fragt das Deck selbst, mit dem, was am Deck geht: Vesper im Chat und „Behalten.“. Zu Sable und
   zu Lantern geht Juno hin; die Uhr steht ja, und Wege kosten nichts. Morrow hält am Montag nicht.

Dann läuft die Uhr weiter, und um 01:00 kommt das Ende (§8). Kein Zustand kann hier hängen bleiben: Wohnung, Stick und Clip sind von
jedem Stand aus erreichbar, auch bei stehender Uhr, weil Wege nichts kosten.

## 4. Die Quiet kommt näher

Story §7: Kameras in der Nähe von Junos Block fallen eine nach der anderen aus, genau so, wie sie es selbst machen würde.

| Wann | Was | Juno |
|---|---|---|
| ab Abend 2 | `cam07` ist in GLASS grau: `KEIN SIGNAL` | „Von außen nach innen. So hätt ich's auch gemacht.“ |
| ab Abend 3 | `cam14`, ihr eigener Flur, ist grau. Im Flur ist das rote Licht der Kamera aus. | „Jetzt sind sie im Haus.“ |
| wenn die Quiet sie kennt | der Schatten auf der Kowalski-Straße, 19:00 bis 23:00 (§3.5) | „Weiß hält hier unten keinen Tag.“ (das hat die Regenleserin gesagt) |
| nach `e1=refused` | Sable: „Der, der für WREN geglasst hat, ist weg. Seit gestern.“ Die Quiet sucht, wer noch an CAM 31 war, und ihre Liste ist kurz (story §10b). | „Dann bin ich die Nächste auf der Liste.“ |
| Samstag und Sonntag, unterwegs | Die Schläfer sehen sie (entschieden 2026-11-14): Wenn Juno hinausgeht, auf die Kowalski-Straße, in die Jade Row, zum Waschsalon, ist sie in Nagi·was Kameras, und was sie von ihr markieren, kommt bei Nagi·wa an. Juno ruft der Zeuge nur; verstecken kann er sie nicht, er versteckt niemanden aktiv. Kein Flag: Das gilt für jeden Spieler, denn jeder geht hinaus. | (Vorschlag, wenn sie es ahnt) „Die gucken mich an. Alle, die schlafen.“ |
| ab Montag, in jedem Fall | Die Quiet hat Juno gefunden, auch nach einer Weigerung und wenn sie den Clip behält (entschieden 2026-11-14): Ihr alter Nagi·wa-Zugang war an Ines' Kameras offen (`cam21`, `cam30`), und als die Quiet sucht, wer dort zugesehen hat, steht ihre Kennung im Protokoll; dazu die Markierungen der Schläfer. Der Schatten steht ab Montag vor dem Haus. Die Meldung an Revier 9 aus Kapitel 1 spielt keine Rolle: Sie ist dort ein freiwilliger Klick ohne Flag. | „Mein alter Zugang. Die haben die Codes nie geändert. Aber nachgesehen haben sie.“ |

Kein Flag außer dem Wissen, das die Quiet schon hat: Die Kameras gehen über Nacht (`passes`), der Schatten liest `e1`, `e2` und den Tag.
Am Ende von Kapitel 2 weiß die Quiet in jedem Fall, wer Juno ist; Kapitel 3, in dem sie den Block stürmt (story §7), braucht dafür
kein Flag.

## 5. Was aus Kapitel 1 nachkommt

Jede Folge liest nur Flags aus Kapitel 1 und den Tag; die Fäden bleiben getrennt (`off_varga`, `off_tide`).

**Varga (K1a, `off_varga`):**

| K1a | In Kapitel 2 |
|---|---|
| **nichts geantwortet** | Varga hat Kessler selbst gefunden (Kapitel 1, A1): ab Sonntag sitzt Kessler mit Gips auf dem Drain-Markt wie nach einem Verkauf, aber ohne Eintrag im Kassenbuch. |
| **verkauft** | Am Freitag verkauft: am Samstag in `cam15` die offene Kapsel 23 und die zerbrochene Brille (Kapitel 1, §3). Ab Sonntag sitzt Kessler mit Gips auf dem Drain-Markt neben Ratz' Stand und bettelt, von oben gezeichnet wie alle dort. Er kennt Juno nicht. Sie kann ihm 50 Chits geben oder weitergehen. Das Kassenbuch ergänzt sich selbst: „Kessler: zwei Rippen, ein Arm. Bettelt.“ |
| **gewarnt** | Sable zahlt schlechter (§3.6, „Varga redet.“). Die Postkarte an Frau Kessler kommt erst im Epilog. |
| **gelogen** | Am Samstag und Sonntag von 19:00 bis 22:00 wartet **Vargas Mann** vor der Haustür des Kessel-Blocks auf der Kowalski-Straße, im Straßenmodus. Kapitel 1 nannte das einen Feed-Moment; keine Kamera sieht die Haustür, deshalb steht er auf der Straße. „Die 200, Glasserin.“ Juno kann zahlen, sagen, dass sie es nicht hat („Dann schuldest du Varga was.“), oder an ihm vorbeigehen; er sperrt keinen Weg. Am Montag liegt ein Zettel im Briefkasten. Kessler zieht seine Nudeln jetzt woanders. Flag `varga2` = paid \| owed; Vargas Faden endet in Kapitel 2, nichts davon geht weiter. |

**Der Eckladen (K1b, `off_tide`):**

| K1b | In Kapitel 2 |
|---|---|
| **verkauft** | Der Überfall geschieht in der Nacht von Freitag auf Samstag, während Juno durch die Stadt läuft, und wird nicht gezeigt (entschieden 2026-11-14): Morrow hatte den Freitag verkauft („Freitag fährt keiner die Kowalski“, und über die Kowalski kommt man in die Jade Row). Ab Samstag ist Okonkwos Laden mit Brettern zu, und Baos Wagen fehlt; Juno hört davon bei Mei. Am Montag steht Bao trotzdem da, mit Verband: „Eine Woche, sagt der Arzt. Ich sag Montag.“ Kassenbuch: „Okonkwo: ausgeraubt. Bao: Gehirnerschütterung.“ (Kapitel 1, §4) |
| **falscher Code** | In der Nacht auf Samstag scheitern die Jungen am Tresor. Ab Samstag steht an Junos Tür `GLASSER LIES`. Die Tidewater Boys sind Feinde; mehr folgt daraus nicht. |
| **gewarnt** | Okonkwo grüßt sie wie einen Gast. In der Jade Row steht ab Samstag an der Wand `WHO TALKED?`: Die Boys suchen den Verräter. Das ist das Einzige aus diesem Faden, was weitergeht (Okonkwos Versteck in Kapitel 4). |
| **nichts geantwortet** | Kein Überfall. TIDE schreibt am Samstag einmal: „Dann eben ohne dich.“ Damit ist der Faden zu. |

**WREN:** Nach `e1=sold` ist WRENs Kontakt am Samstag gelöscht (`KONTAKT GELÖSCHT`); die Chits bleiben. Nach `e1=refused` schreibt
sich das Kassenbuch am Samstag die Zeile dazu, die Kapitel 1 angekündigt hat: „WREN hat es von jemand anderem.“

**Die Miete:** Hat Teo sie bezahlt (`rent=teo`), sagt Juno es ihm am Montag (§7).

**Frau Kessler** schreibt in Kapitel 2 nicht mehr; ihr Faden geht im Epilog weiter.

## 6. Die Nebenfäden

### 6.1 Frau Imai (`off_imai`)

Nur, wenn Juno ihr in Kapitel 1 geantwortet hat (`imai_told` ist gesetzt); sonst bleibt der Faden zu. Er endet in Kapitel 2.

| # | Wo | Was |
|---|---|---|
| I1 | CHAT, Samstag | „Ich hab wieder was gesehen. Eine Frau auf einem Bahnsteig.“ (Kapitel 1, §7) |
| I2 | `lucky_static`, Sa und So 20:00–23:00 | An ihrem kleinen Tisch: Wasser bis zur Kante, eine Frau in Weiß, ein Mann in Weiß, der aus dem Schatten kommt. „Er hat hochgeschaut. Zu mir.“ Und: „Ich hab es gesehen. Um drei, im Schlaf.“ (entschieden 2026-11-14) Sie hat es nicht live gesehen, sondern danach, im Schlaf, wieder und wieder. Nach `imai_told=truth` hat sie kaum geschlafen und es trotzdem gesehen („Ich hab nur kurz die Augen zugemacht.“); nach `imai_told=dream`: „Sie haben gesagt, es war ein Traum.“ |
| I3 | dort | Die Wahl: „Ich hab es auch gesehen. Es ist wirklich passiert.“ oder „Das war ein Traum.“ Kassenbuch: „Frau Imai: die Wahrheit, zum zweiten Mal.“ oder „Frau Imai: wieder ein Traum.“ Flag `imai2`. |

**Warum sie es gesehen hat** (entschieden 2026-11-14, story §10h): `cam31` hängt nicht an Nagi·was Netz, also spielt Civic Rest sie
keinem Schläfer vor. Wer den Mord im Schlaf sieht, dem zeigt ihn der Zeuge: Nach
Ines' Tod zeigt er ihn den Schläfern, jede Nacht um drei. Das ist das erste Zeichen, dass er
handelt. Andere merken es auch, ohne dass ein Faden daran hängt (§7): der schlafende Stammgast im LUCKY STATIC, der Prediger.

### 6.2 Frau Haldanes Sohn (`off_haldane`)

Die Geschichte der Briefe ihres Sohnes (story §9), angelegt in Kapitel 1: Er schreibt jeden Sonntag aus dem Fünften, seit drei Sonntagen
nicht mehr, der letzte Brief kam am 14. Oktober.

| # | Wo | Was |
|---|---|---|
| H1 | `kessel_14`, ab Sonntag | Sonntag ist Brieftag, und Frau Haldane schläft nicht, bis er kommt: Sie sitzt wach an ihrer offenen Tür, das Pflaster hinterm Ohr dunkel. „Sonntags schlaf ich nicht. Sonntags kommt sein Brief.“ Am Montag wartet sie immer noch. Sie bittet Juno: „Du kennst dich doch mit Kameras aus. Kannst du sehen, ob es ihm gut geht?“ Sein Wohnheim: 5-Süd, im Fünften. |
| H2 | `sable_booth` | Kameras im Fünften hat Juno nicht. Sable verkauft einen Blick ins Archiv des Wohnheims: 150 Chits oder ein roher Clip aus dem CACHE als Shine (Kesslers Ring hat jeder; wer die Miete von Teo hat bezahlen lassen, hat 0 Chits). |
| H3 | `cam51`, nur Archiv | Der Schlafsaal des Wohnheims, Reihen von Kojen (neues Bild, §9). Sonntag, 14. Oktober, 21:00: Er liest auf seiner Koje einen Brief seiner Mutter (seiner war am selben Tag bei ihr angekommen, der letzte), drückt das Lull-Pflaster an und legt sich hin. Montag, 15. Oktober, 06:00: Er steht nicht auf. Um 06:30 tragen ihn zwei in Weiß hinaus, freundlich. Juno: „Ruhe-Erschöpfung. Seit vier Wochen.“ |
| H4 | `kessel_14` | Die Wahl, an ihrer Tür: **die Wahrheit** („Er schläft. Sie haben ihn auf eine Station gebracht.“), **ein montierter Clip** oder **„Ich hab nichts gefunden.“** Kassenbuch und Flag `haldane` = truth \| fake \| nothing. |

**Montieren** (`kapitel0-design` §2.4) kommt hier zum ersten Mal: Juno nimmt aus dem Archiv einen Moment, in dem er morgens zur Schicht
geht (vom 9. Oktober), und setzt den Zeitstempel von heute davor. Frau Haldane sieht ihren Sohn heute früh zur Arbeit gehen. Es ist eine
Fälschung, wie die von Nagi·wa, und die einzige, die Juno selbst macht; nie nötig.

Ihre Antworten (Vorschläge): nach der Wahrheit, nach einer langen Pause: „Dann schlaf ich auch. Dann bin ich näher bei ihm.“ (Sie meint
es, wie es der Zeuge meint, story §6.) Nach dem Clip: „Er sieht müde aus. Er sah immer müde aus.“ Nach „nichts“: „Dann warte ich
eben weiter.“ Der Faden endet hier; in Kapitel 3 liegt er höchstens als Blick auf der Schlafstation, ohne Flag.

### 6.3 Vesper (`off_vesper`)

Vesper bleibt im Chat, aber er kauft keine neuen rohen Clips mehr. Was Juno ihm am Freitag verkauft hat, bekommt am Samstag seine Zuschauerzahl, die
Kapitel 1 nicht mehr geben konnte (Kapitel 1, §7). Der Faden endet hier. Sein Angebot für den Mord gehört zu Entscheidung 2 und damit zum Hauptfaden (§3.6). Anonymisieren bleibt nur wach,
solange sein Faden offen ist.

### 6.4 Motte und das Backup (`off_motte`)

Nur, wenn Juno ihn unterrichtet hat (`moth_student`): Beim ersten Mal, wenn Juno am Samstag oder Sonntag an seiner Bank vorbeikommt,
fragt er: „Darf ich EVI mal Hallo sagen?“ Er steckt seinen Tideboy an das Taschen-Deck, EVI kichert („Das kitzelt.“), und nach einem
Moment: „Fertig. Ich hab sie mir gemerkt.“ Was er gemacht hat, sagt niemand. In Kapitel 4 ist es das Backup, aus dem EVI zurückkommt
(„Du hast gesagt, man macht immer ein Backup.“, story §7). Kein neues Flag: Das Backup gibt es, wenn es `moth_student` gibt. Ohne
`moth_student` sitzt Motte auf seiner Bank wie immer.

## 7. Das Leben drumherum

| Wann | Wo | Was |
|---|---|---|
| **Montag, 18:30** | `flat` → `sims` → `dach_sitzen` | **Teos letzter Besuch, wach.** Es klopft wie in Kapitel 1. Teo ist müder als am Mittwoch, das Pflaster blinkt. Er bringt wieder etwas von Bao; nach dem Überfall: „Bao hat einen Verband. Gekocht hat er trotzdem.“ „Gehen wir rauf, Ju? Wie früher.“ Er hat einen langen Haken aus der Pumpenhalle dabei. Hängt die Leiter noch oben, holt er sie herunter (`ladder_down`); hängt sie schon unten: „Du warst ohne mich oben?“ Oben setzen sie sich auf ihren Platz, und neben Juno ist zum ersten Mal jemand (der leere Platz aus Kapitel 1, `dach_sitzen`). Er erzählt von **Tinte**, der Krake im Filterbecken: „Tinte sagt, ich zuck im Schlaf. Wie die anderen.“ Und: „Wenn ich schlaf, ist alles still. Keine Pumpen. Keine Schulden.“ Er schläft kurz an ihrer Schulter ein, wie damals, wacht auf und muss zur Schicht. Nach `rent=teo`: „Die Miete. Danke.“ „Hab gesagt, sag nichts.“ Eine Szene ohne Wahl. |
| Samstag | `lucky_static` | Der Fernseher: „Tote in der alten Metro. Revier 9 ermittelt.“ Nach `k1b=sold` erzählt Mei vom Überfall bei Okonkwo und von Bao. Der schlafende Stammgast murmelt auf seinen Armen: „Sie geht zur Treppe.“ Die Frau neben ihm: „Er redet nie im Schlaf. Nie.“ |
| Sonntag | `lucky_static` | Der Fernseher zeigt die Fälschung (§3.4). Mei schaltet nicht aus, sie schaut weg. |
| Montag | `lucky_static` | „Fahndung nach dem Piratensender LANTERN. Hinweise an Revier 9.“ Mei: „Der hat doch nie jemandem was getan. Der hat nur geredet.“ |
| jeder Abend | Deck, NETZ | Samstag die Meldung „Tote in der alten Metro.“ und auf dem Brett jemand, der fragt, was in Linie 31 war. L. (Kapitel 1) schreibt: „Sie sagen, er ist jetzt auf einer Station. Besuchen darf man nicht.“ Sonntag die Fälschung, Montag die Fahndung und „Wer hat gestern den großen Schirm gesehen?“ |
| jeder Abend | `kowalski` | **Bao**, wenn er da ist: Samstag „Lou hat gefragt, wo du die ganze Nacht warst.“, Sonntag stellt er ihr die Schale wortlos hin, Montag „Iss. Du siehst aus wie dein Bruder.“ Der **Werbebildschirm** stottert weiter; am Sonntag um 22:00 Lanterns zehn Sekunden (§3.5). Die **halbe Reparatur** (L2). |
| jeder Abend | `dach` | **Die Regenleserin.** Samstag: „Freitag hat's nach nichts geschmeckt. Jetzt weißt du, warum, Kind.“ Sonntag: „Unten im Wasser wohnt einer, der hört alles mit. Der ist jetzt still.“ Montag, nach Teos Besuch: „Er hat die Leiter noch gefunden. Gut.“ |
| jeder Abend | `drain_market` | **Der Prediger**, Tag 12, 13, 14: „Die Schläfer reden von einer Frau auf einem Bahnsteig!“ und „Er zeigt es euch, damit ihr es seht! Bleibt wach!“ **Ratz** fragt wieder nach seiner Kolonie. |
| ab Sonntag | `gasse` | Am Flutdenkmal schwimmt ein neues Papierboot mit Kerze, darauf ein `I.` Wer es hingestellt hat, sagt niemand. |
| Samstag | `kessel_lobby` | Der Briefkasten ist leer: „Nicht mal eine Mahnung.“ Am Montag liegt dort, nach `k1a=lied`, Vargas Zettel (§5). |
| immer | `cam30`, `cam31` | Am Sumpf-Abgang hängt ab Samstag ein Absperrband von Revier 9. `cam31` zeigt nur noch `KEIN SIGNAL`, und im Rauschen steht für einen Takt das Auge. |

Alles hier liest nur den Tag und Flags aus Kapitel 1; nichts davon setzt einen Zustand, außer Teos Besuch als Moment.

## 8. Das Ende: Die Protokolle

Montag, ab 01:00. Wie das Ende von Kapitel 1 eine Kette, an der nichts verzweigt (ein Flag `end_beat2`); die Zeiten dürfen deshalb
zwischen den Takten liegen.

| Zeit | Was geschieht |
|---|---|
| 01:00 | Wo Juno auch ist: Jeder Schirm, den Lantern erreicht, reißt ab, auch der große auf der Kowalski. In Grün: `THEY DON'T SLEEP. THEY WORK.` Im NETZ liegen Ines' Protokolle, offen für alle. Hat Juno ihm den Clip gegeben, läuft er mit. Die Nachrichten sagen nichts, das Brett lacht über den „Mörder mit den Tabellen“. Abblende in Junos Wohnung, an das Deck. |
| danach | Das letzte Prüfen: Juno legt die Protokolle neben ihre eigenen Aufnahmen. Eine Zeitleiste mit den Spitzen der Schläfer, darunter ihr CACHE. Die eine Aufnahme, die jeder hat, ist **Kesslers Ring** vom Dienstag (Prolog): 6.11., 22:35, und genau dort steht in den Protokollen eine Spitze, 41 Schläfer zur selben Sekunde. Das ist die Zahl auf Ines' Serviette (W5). Wer mehr Clips im CACHE hat, findet mehr: Morrows Umschlag, die weißen Träger. Nur Clips zählen, keine Notizen und kein Archiv; ein anonymisierter Clip behält seinen Zeitstempel und zählt auch. Eine Übereinstimmung genügt. |
| | Juno: „Die haben zugesehen. Als ich zugesehen hab.“ EVI: „Wer?“ Juno: „Alle, die schlafen.“ EVI: „Dann haben die dich ersetzt. Nicht ich.“ Juno: „Meine Nachbarn.“ (Die Antwort auf EVIs „Wer dann?“, §3.3; story §6.) |
| 03:00 | Stille. Durch die Wand hört man, wie das halbe Haus zur selben Zeit Luft holt (die Regenleserin, Kapitel 1). |
| 03:15 | Eine Nachricht von einem Kontakt, den Juno nicht kennt: `BECKEN 3`. „Dein Bruder schläft im Becken-Raum. Er hört nicht. Komm.“ Juno weiß, wer schreibt: Teo hat am Abend von Tinte erzählt. |
| | Abblende. „Kapitel 3: Lull“. |

In dieser Nacht wacht Teo nicht auf. **Teo ist ein Sinker** (story §7). Was er am Abend auf dem Dach gesagt hat („Wenn ich schlaf, ist
alles still.“), ist der Anfang von Kapitel 3, in dem er nicht zurückwill (story §10f).

## 9. Orte

### 9.1 Was wiederkommt

Jeder fertige Ort aus Kapitel 1 bekommt in Kapitel 2 eine Aufgabe; neue Orte gibt es nur, wo kein fertiger passt (Memory „Rooms used
more than once“).

| Ort | In Kapitel 2 |
|---|---|
| `flat` | der Anfang (§2.1), Teos Klopfen, das Ende am Deck (§8) |
| Deck | GLASS mit den grauen Kameras, NETZ, CHAT (Imai, Vesper, `BECKEN 3`), der Clip-Editor mit **Prüfen** und **Montieren**, CACHE, BUCH, RADIO mit den Nachrichten |
| `kessel_14`, `cam14` | Motte und das Backup, Frau Haldane wach an ihrer Tür; nach `k1b=lied` an Junos Tür `GLASSER LIES`; ab Abend 3 ist `cam14` aus, das rote Licht im Flur dunkel |
| `kessel_lobby` | der Briefkasten, Vargas Zettel |
| `kowalski` | Bao (oder sein leerer Platz), der Werbebildschirm und Lanterns zehn Sekunden, die halbe Reparatur mit dem Kabel, Vargas Mann, der Schatten in Weiß |
| `gasse` | der Weg zu Waschsalon und Markt, das Papierboot am Denkmal |
| `laundromat`, `cam23` | den Stick zurücklegen; Lantern um halb eins; der Mann in Weiß, wenn die Quiet vom Trockner weiß |
| `lucky_static` | Mei, der Fernseher an allen drei Abenden, der Stammgast, der im Schlaf redet, Frau Imai |
| `jade_row`, `cam07` | Morrows Flutwagen (Entscheidung 2), nach dem Überfall die Bretter an Okonkwos Laden, `WHO TALKED?`; das **Tor am Ende** führt jetzt zur Klinik und zum Wohnblock Lerche; `cam07` fällt aus |
| `okonkwo_shop`, `cam07v` | nach dem Überfall zu (die Tür mit Brettern, `cam07v` zeigt den leeren, dunklen Laden); oder Okonkwos Dank |
| `drain_market` | Sable, Ratz, der Prediger, Kessler mit Gips, und die **Treppe hinab** in die Sümpfe |
| `sable_booth` | Entscheidung 2, der Blick ins Archiv des Wohnheims, die Nachricht über den anderen Glasser |
| `sims`, `dach`, `dach_sitzen`, `dach_blick` | Teo am Montag, die Regenleserin; der Blick nach oben wie in Kapitel 1 |
| `cam03` | Kessler kommt nicht mehr; am Automaten zieht jemand anderes Nummer 7 (nur Ansehen) |
| `cam04` | Varga sitzt am Samstag um 22:30 wieder bei Yuen's, auf seinem Platz; nach `k1a=lied` redet er über die Glasserin. Kesslers Ring vom Dienstag (der Clip aus dem Prolog) ist die Aufnahme, die das Ende braucht (§8) |
| `cam15` | nach einem Verkauf am Freitag die offene Kapsel |
| `cam18` | Frau Imais Kamera am alten Fischmarkt: nur das Archiv wie in Kapitel 1, nichts Neues (Juno hat dort ihren alten Zugang) |
| `cam21` | die Klinik von außen: Ines kommt nicht mehr, die Pflegerin kommt um 19:00 zur Nachtschicht |
| `cam22` | Pho Pump: Ines' Platz an der Theke bleibt leer; der Koch stellt trotzdem eine Schale hin, am Samstag |
| `cam24` | der Code der Haustür (W1), am Sonntag um 20:00 die Quiet |
| `cam30` | das Absperrband am Sumpf-Abgang |
| `cam31` | `KEIN SIGNAL`, im Rauschen das Auge |

### 9.2 Neu im Straßenmodus

| Raum | Größe und Blick | Hauptfarbe | Ausgänge | Was darin ist |
|---|---|---|---|---|
| `klinik` | Iso, etwa 6 x 4 m | kaltes Weiß, Lull-Cyan | Tür → `jade_row` (über das Tor) | Wartebank mit müden Leuten, die Aufnahme mit der Pflegerin hinter Glas, eine Kabine mit Scanner-Stuhl, Nagi·was Ring an der Wand, `SLEEP BETTER` auf einem Schirm |
| `lerche_flur` | Iso, ein Treppenhausflur, etwa 5 x 3 m | gelbliches Flurlicht, Grünstich | Treppe → `jade_row` (über das Tor), Tür 4B → `ines_wohnung` | Wohnungstüren, 4B mit dem Siegel, Schuhe vor einer Tür, die Kamera `cam25` in der Ecke |
| `ines_wohnung` | Iso, etwa 4 x 4 m | ausgeräumt, das Licht der Straße | Tür → `lerche_flur` | Matratze, leere Regale, der helle Fleck vom Rechner, der Kühlschrank mit der Serviette, das Gefrierfach, eine Pflanze, die niemand mehr gießt |
| `sumpf` | Iso, ein Steg über Wasser wie die Gasse, das Bild scrollt | schwarzes Wasser, Lanterns Grün am Kabel, Magenta von oben aus dem Markt | Treppe → `drain_market`, Floß → `lantern_versteck` | die alte Stadt bis zum ersten Stock im Wasser, Ladenschilder von vor der Flut, das Kabel, der Steg, das Floß am Seil |
| `lantern_versteck` | 320x180, eine Bühne von vorn wie `sable_booth`: Lantern sitzt ihr gegenüber | Grün und Bernstein, Bildschirme | Floß → `sumpf` | ein halb versunkener Laden, Antennen, Bildschirme mit Kameras, die keiner mehr kennt, der Sender |

**Der Weg dorthin:** Das Tor am Ende der Jade Row bekommt eine Auswahl (W2); zwischen Tor und Klinik gibt es keinen eigenen Raum. So
wird kein Ort im Straßenmodus begehbar, den eine Kamera schon anders zeigt (`cam21`, `cam24`): Juno betritt die Klinik und den Flur von
innen.

### 9.3 Neue Kameras

| Kamera | Ort | Blick | Besonderheit |
|---|---|---|---|
| `cam25` | Wohnblock Lerche, Flur im 4. Stock | das Iso-Bild von `lerche_flur` unter dem Feed-Filter (ein Ort, ein Bild, wie `cam14`) | verbunden mit `cam24`; zeigt, wann der Flur frei ist |
| `cam51` | Wohnheim 5-Süd im Fünften, der Schlafsaal | Reihen von Kojen, Wäsche, ein Fenster ohne Himmel; die Sicht, die am besten passt (Style Guide), Vorschlag: frontal auf eine Kojenwand | **nur im Archiv**, von Sable; das Feed-Bild bekommt zum ersten Mal die weißen Träger als kleine Feed-Figuren (in Kapitel 1 nur Nahaufnahme und Stimmen, story §10b) |

### 9.4 Für den Stadtplan (nur Vorschläge, nichts Bestehendes geändert)

Neue Einträge für `docs/plan/stadtplan.js`, wenn der Nutzer sie will: die Klinik 9-Ost von innen (am vorgeschlagenen Ort der Klinik,
an der Querstraße am Westende), der Wohnblock Lerche mit Treppenhaus und 4B (dort, wo `cam24` hängt), der Weg vom Tor der Jade Row
dorthin, die Sümpfe unter dem Drain-Markt mit Lanterns Versteck (Ebene „die Tiefe“). Das Wohnheim im Fünften liegt außerhalb des Plans.

## 10. Figuren

Größen wie in `kapitel0-design` §8. **Regel:** Wer etwas nur auf einer Seite trägt, bekommt für die Richtung, in der es die Seite
wechseln würde, eine eigene Ansicht (Kapitel 1, §10). Lull ist immer die ovale blasse Scheibe wie bei Teo.

| Wer | Neu oder wieder | Wo | Ansichten | Was zu beachten ist |
|---|---|---|---|---|
| **die Pflegerin an der Aufnahme** | neu | `klinik`, `cam21` (Feed) | Iso SE hinter dem Glas (sitzend), Feed NE und NW auf dem Weg zur Nachtschicht | weißer Kittel wie Ines, aber kurz; kein Lull. Name offen (§14) |
| **die Quiet** (zwei im Flur, der Schatten, der Mann am Trockner) | neu | `cam25`, `cam23` (Feed), `kowalski` (Iso) | Feed SE, SW, NE, NW mit Kisten; Iso SE, NE, NW stehend | weiße Regenmäntel wie Ashe, die Masken überstrahlen im Feed; im Straßenmodus eine glatte weiße Maske. Ist die Maske symmetrisch, genügt das Spiegeln; trägt einer etwas einseitig (ein Funkgerät), wird NW gezeichnet |
| **Lantern** (persönlich) | neu als Bühnenfigur | `lantern_versteck` | eine Ansicht von vorn, sitzend, mit kleinen Bewegungen | das Gesicht aus `docs/portraits/lantern_x4.png` (grüner Iro, das Okular über **einem** Auge, Headset): Da er nur von vorn zu sehen ist, braucht er keine Gegenrichtung |
| Lantern im Feed | wieder | `cam23` | wie in `cam31`, im Maßstab des Waschsalons | die Silhouette wie das Piktogramm, gespiegelt beim Wegfahren, wie entschieden (story §10c) |
| **Teo, sitzend von hinten** | neu (Pose) | `dach_sitzen` | eine | neben Juno, die Kapuze unten, der Gehörschutz; von hinten sieht man das Pflaster hinter seinem Ohr, am selben Ohr wie in seinen anderen Ansichten (nicht aus einer gespiegelten Ansicht nehmen) |
| Teo mit dem Haken | neu (Pose) | `flat`, `sims` | SE, NE, NW wie seine Figur | der lange Haken aus der Pumpenhalle in einer Hand; NW gezeichnet wie bisher |
| **Vargas Mann** | neu | `kowalski` | Iso SE, NE, NW stehend | nur nach `k1a=lied`; Varga selbst ist nur im Feed gemalt. Name offen |
| **Kessler mit Gips** | neu (von oben) | `drain_market` | von oben, sitzend | der Gips am Arm ist einseitig: von oben kein Problem, er sitzt immer gleich |
| **Bao mit Verband** | Variante | `kowalski` | wie Bao | nur nach `k1b=sold`, Montag (Samstag und Sonntag fehlt sein Wagen) |
| **Frau Haldane, wach an der Tür** | Variante | `kessel_14` | wie ihre Figur (SE, NE, NW) | wach, ohne Lockenwickler? Vorschlag: die Lockenwickler bleiben, die Augen offen, das Pflaster dunkel |
| **der Nachbar an der Haustür** | neu (Feed) | `cam24` | Feed SE, dazu die Nahaufnahme seiner Finger am Zahlenfeld (Zoom) | kommt jeden Abend um 19:30 heim; die Zahlen im Zoom mit der Spielschrift |
| **die Wartenden in der Klinik** | neu | `klinik` | Iso sitzend | müde, Lull-Pflaster, wie die Schlange in `cam21` |
| **die Fälschung** | neu (Clip) | `cam31` | das Bild von `cam31` mit einem dunklen Rollstuhl an Ashes Stelle | ein eigenes Bild für den Clip, stumm, mit der Schleife im Regen (§3.4) |
| **jemand am Automaten** | neu (Feed) | `cam03` | Feed SE | zieht Nummer 7, wo Kessler stand; nur Ansehen |
| **ihr Sohn** | neu | `cam51` (Feed) | Feed liegend auf der Koje, SE gehend | Lull-Pflaster als ovale Scheibe, im Feed als heller Punkt |
| **die weißen Träger im Feed** | neu (Feed) | `cam51` | Feed SE, SW mit der Trage | Overall und Kapuze wie in `look_traeger` |
| Imai, Mei, die Stammgäste, Motte, Ratz, der Prediger, Sable, Okonkwo, Morrow, die halbe Reparatur, die Regenleserin | wieder | wie in Kapitel 1 | wie gemalt | Morrow steht in Jade Row im Straßenmodus: In `cam07` ist sie schon im Maßstab der Gasse gemalt, aber nur für den Feed; für die Straße braucht sie ihre Farben und die Ansichten, in denen Juno mit ihr redet (die Marke am Band hängt mittig, Spiegeln genügt) |

**Tinte** ist in Kapitel 2 nur eine Nachricht, kein Bild. **Juno** bekommt keine neuen Ansichten (NW und SW sind zurückgestellt).

## 11. Rätselkette als Überblick

```
 Abend 1 (Sa) ─ Heimkommen (EVI) ─ Folgen aus Kap. 1 ─ Imai schreibt ─ Motte und EVI
   │
   ├─ Stick: liegt er im Trockner, hat Lantern ihn ─ sonst: zurücklegen (cam23, 00:30) oder Lantern bringen
   ├─ Klinik (optional): cam21 ─ Tor der Jade Row ─ Aufnahme ─ „Lerche, vierter Stock“
   ├─ Lerche: cam24 19:30, der Code ─ cam25 ─ (So 20:00–21:00 die Quiet) ─ 4B ─ Serviette ─ Akte ─ EVI erfährt es
   ├─ Fälschung (So 18:00): NETZ ─ Prüfen: Zeitstempel, Regen, Licht ─ Beweis
   ├─ Lantern (So 22:00 der Schirm): halbe Reparatur ─ Kabel ─ Ratz und der Ausweis ─ Treppe hinab ─ Sumpf ─ Haken, Floß ─ Versteck
   │      └─ der Schatten in Weiß (19:00–23:00), wenn die Quiet Juno kennt
   └─ Entscheidung 2: Sable │ Vesper │ Morrow (Jade Row 00:30) │ Lantern │ behalten   (das Flüstern schneiden?)
                                                                  │
 Abend 3 (Mo) ─ 18:30 Teo, das Dach ─ 00:45 die Uhr hält (Wohnung, Stick, Clip) ─ 01:00 Lantern sendet
              ─ Prüfen: Protokolle gegen Kesslers Ring ─ „Meine Nachbarn.“ ─ 03:15 BECKEN 3 ─ Kapitel 3
```

Regeln: Das Ende braucht `evi_knows`, `stick_lantern` und `e2`; alles andere ist frei. Die Klinik und die Fälschung sind nie nötig, aber
gut angezeigt. Wer den Stick hat und die Quiet an den Trockner bringt, muss Lantern finden; der Weg dahin steht ab Sonntag 22:00 jedem
offen. Die Nebenfäden (`off_varga`, `off_tide`, `off_imai`, `off_haldane`, `off_vesper`, `off_motte`) prüft der Solver jeden für sich
mit dem Hauptfaden (`off_main` und `know_flat` für die Fäden allein, wie in Kapitel 1).

**Der Zustand:** neu im Hauptfaden `stick_lantern`, `quiet_dryer`, `know_flat`, `code_lerche`, `cache_note_serviette`,
`cache_note_civic_rest`, `evi_knows`, `cache_clip_forgery`, `forgery_cuts` (0–3, im Editor) und `forgery_proven` mit seiner Notiz,
`know_cable`, `stairs_open`, `lantern_found`, `led_quiet`, `e2`, `clip_ines_cut`; in den Fäden `varga2`, `imai2`,
`haldane` und ein Schritt je Faden. Weiter gehen davon nur die Flags, die §2.1 nennt. Die Kameras, die ausfallen, und alles in §7 kosten nichts.

## 12. Hinweise

Die Hinweise spricht EVI (Prolog-Design §2.2). Die Tabelle nennt die schweren Stellen; beim Bau bekommt jeder Zustand einen Hinweis.

| Für | Stufe 1 | Stufe 2 | Stufe 3 |
|---|---|---|---|
| der Stick | „Du hast noch ihren Schlüssel. Lantern sucht ihn.“ | „Er schaut jede Nacht in den Trockner. Oder du findest ihn.“ | „Leg ihn in Trockner sechs zurück. Um halb eins holt er ihn.“ (Mit der Quiet am Trockner: „Lantern kommt nicht mehr, solange der da sitzt. Bring ihn ihm selbst.“) |
| W1, der Code | „Ihr Haus hat ein Zahlenfeld an der Tür.“ | „Die Klingelkamera hängt direkt daneben.“ | „Öffne CAM 24 um halb acht. Da kommt ein Nachbar heim.“ |
| W3/W4, der Flur | „Welche Tür ist ihre? Die Klinik weiß es, oder die von Civic Rest zeigen es dir.“ Dann: „Ihre Tür ist zu. Das bleibt sie nicht lange.“ | „Die von Civic Rest räumen die Wohnung aus. Schau in CAM 25.“ | „Warte, bis sie weg sind. Sonntag ab neun ist der Flur frei.“ |
| W6, die Akte | „Die haben den Rechner genommen. Ines hat auf Papier geschrieben.“ | „Wo hebt man Papier auf, das niemand finden soll?“ | „Schau ins Gefrierfach.“ |
| die Fälschung | „Das ist nicht, was wir gesehen haben.“ | „Leg die beiden Clips nebeneinander. Prüfen.“ | „Schau auf die Uhrzeit, den Regen und das Licht.“ |
| L2–L5, Lantern | „Der Schirm war gekapert. Wer weiß, woher so was kommt?“ | „Der Mann auf dem Gerüst repariert den Schirm. Frag ihn.“ | „Folge dem Kabel, die Treppe unter dem Markt hinab.“ |
| L3b, das Schloss | „Die Kette ist neu, und das Schloss ist von Nagi·wa.“ | „Ratz kennt jedes Schloss hier unten. Frag ihn.“ | „Ratz will deinen alten Ausweis, nur kurz. Der liegt im Karton unter deinem Bett, wenn du ihn nicht dabeihast.“ |
| L4, das Floß | „Das Floß ist zu weit weg.“ | „Mit etwas Langem käme man ran.“ | „Nimm den Haken aus der Tasche. Hast du ihn nicht, hängt er neben dem Aufzug.“ |
| der Schatten | „Der in Weiß steht wieder unten.“ | „Wenn er dich sieht, sieht er auch, wohin du gehst.“ | „Er geht um elf. Warte bis dahin, bevor du zu Lantern gehst.“ |
| Entscheidung 2 | „Was machst du mit dem Clip?“ | „Sable kauft, Vesper zahlt mehr, Morrow hält samstags und sonntags um halb eins in der Jade Row, Lantern ist im Sumpf.“ (am Montag ohne Morrow) | „Du kannst ihn auch behalten. Aber im Clip ist das Flüstern.“ |
| Montag, 00:45 | (je nachdem, was fehlt, eine der Zeilen aus §3.7) | | |
| das Ende | „Du hast doch Clips mit Uhrzeit.“ | „Leg die Protokolle neben deine Aufnahmen.“ | „Nimm Kesslers Ring. Dienstag, 22:35.“ |

## 13. Was die Engine (und das Spiel) zusätzlich braucht

Gegenüber Kapitel 1 braucht die Engine voraussichtlich **nichts Neues**: Tage, Momente, Abläufe, die stehende Uhr, `passes`, das
Archiv einer Kamera, Gegenstände an Hotspots und Fragen mit vier Antworten gibt es. Beim Bau zu prüfen:

1. **Prüfen und Montieren** im Clip-Editor sind Teil des Spiels (`game/deck.js`): zwei Clips auf zwei Zeitleisten, Stellen als
   Hotspots, ein Zähler `forgery_cuts`; Montieren als Wahl eines Moments und eines Zeitstempels. Dasselbe Prüfen dient dem Ende (die
   Protokolle als Zeitleiste ohne Bild).
2. **Eine Kamera nur im Archiv** (`cam51`): wie das Archiv von `cam18`, ohne Live-Bild.
3. **Kameras, die ausfallen**: `link_cam07` und `link_cam14` über Nacht vergessen, GLASS zeigt sie grau mit `KEIN SIGNAL`.
4. **Der gekaperte Schirm** auf der Kowalski: ein Teil des Bilds der Straße, das zu bestimmten Zeiten den Text zeigt (gesetzt mit der
   Spielschrift).
5. **Ein Ausgang mit Auswahl** (das Tor der Jade Row): ein Hotspot, der eine Frage stellt und in einen von zwei Räumen führt.
6. Der Akt `kapitel2` mit seinem `keep` (§2.1) und `?act=kapitel2`.
7. **Der Solver über die Kapitelgrenze** (beschlossen 2026-11-14, Stufe 2 der Prüfungen): Sobald Kapitel 2 gebaut ist, löst der Solver
   es nicht nur aus einer festen Vorgeschichte, sondern aus jedem Endzustand von Kapitel 1, beschränkt auf das, was `keep` übernimmt
   (die Zahl der Varianten nennt `sh tools/handoff.sh`, im Studio der Tab Handoffs). Dafür braucht es in der Engine einen Start aus
   einer Liste von Zuständen; die Übergabe-Prüfung (`handoff.mjs`) und die Endzustände in den Graph-Daten gibt es schon.

## 14. Offen

- **Namen:** die Pflegerin an der Aufnahme, Frau Haldanes Sohn, Vargas Mann, die Quiet im Flur (vielleicht ohne Namen), der Kontakt
  `BECKEN 3` (oder `TINTE`), die Kameranummern `cam25` und `cam51`.
- **Zeilen:** alles, was hier steht, sind Vorschläge; Lanterns Stimme für die großen Gespräche fehlt noch im Style Guide.
- **Preise und Zahlen:** Sable 3000, Vesper 5000, die Zuschauer, Sables Archiv 150, Kessler 50.
- **Aussehen:** Klinik, Flur, Wohnung, Sumpf, Versteck, `cam51` und alle neuen Figuren gehen erst als Blöcke zur Freigabe, ebenso
  die Änderungen an fertigen Bildern: die Bretter an Okonkwos Laden und der dunkle Laden in `cam07v`, `GLASSER LIES` und `WHO TALKED?`,
  das neue Kabel hinter dem großen Schirm, Lanterns grüner Text auf dem Schirm, das Papierboot mit `I.`, das Absperrband an `cam30`,
  das rote Licht der Kamera im 14. Stock aus.
- **Sprechkarten** im `dialog-style-guide`: Lantern fehlt noch, ebenso die Pflegerin, Vargas Mann und Frau Imai; die Karte von Frau
  Haldane ist zu ergänzen.
- **`evi_trust`** (wie offen Juno im Prolog zu EVI war) geht mit, bekommt aber erst später eine Aufgabe (vom Nutzer entschieden
  2026-11-14): vielleicht, wenn EVI erfährt, was sie ist (§3.3), oder im Finale, wenn sie richtig lesen muss (story §7, Kap. 6).
  Bis dahin meldet die Übergabe-Prüfung es als „kept for nothing“; das ist bekannt.
- **Das Richtmikro und Lanterns Sender im RADIO:** Bibel (§10b) und `kapitel0-design` (§2.1, §3) versprechen beides für Kapitel 2,
  dieser Plan hat keins von beiden. Offen, bis wir die Stelle bearbeiten; dann wird gefragt (2026-11-14).
