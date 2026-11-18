# Kapitel 2 „Aufnahme": Design

Stand: Entwurf (2026-11-14), die Gliederung vom Nutzer freigegeben am selben Tag (story §10h). Im Bau: Das Gerüst, der Stick, Ines' Wohnung,
die Fälschung mit dem Werkzeug PRÜFEN und der Weg zu Lantern stehen auf Blöcken (`game/kapitel2*.js`, `game/pruefen.js`, siehe „Im Mock gebaut“ unter §2.1), der
Rest ist geplant; gemalt ist nichts.
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
  `?act=kapitel2` startet, beginnt mit den Antworten des Durchspielwegs von Kapitel 1: `e1=sold`, der Stick zurückgelegt (also hat
  Lantern ihn), `rent=paid`, 1550 Chits, keine Aufträge. Kapitel 1 geht am Ende von selbst in Kapitel 2 über.
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
- Die Uhr hält am Montag um 00:45. **Sie verlangt, was gebaut ist** (vom Nutzer so gewollt): den Stick bei Lantern und Entscheidung 2;
  `evi_knows` kommt dazu, sobald die Wohnung gebaut ist. Gebaut sind von Entscheidung 2 Vesper im CHAT (immer da, auch
  bei `off_vesper`) und die Frage des Decks um 00:45 („An Vesper verkaufen.“, „Behalten.“, „Noch nicht.“). Preis und Zuschauer sind
  Platzhalter (§14).
- Das Ende als Kette mit `end_beat2` (sent > found) bis zur Karte „Kapitel 3: Lull (kommt später)“. Das letzte Prüfen ist seit 2026-11-15
  das Werkzeug PRÜFEN (siehe „Das letzte Prüfen“ unten), der Kontakt um 03:15 heißt bis zur Entscheidung `BECKEN 3` (§14).
- **Der Stick** (§3.1, `game/kapitel2_stick.js`): Wo er ist, sagen zwei Flags, `stick_ines` (Juno hat ihn) und `stick_dryer` (er liegt
  wieder in Trockner 6); hat Juno ihn nicht und liegt er nicht im Trockner, hat Lantern ihn (kein eigenes Flag, das spart Zustände).
  Juno legt ihn an Trockner 6 zurück („Zurücklegen.“ oder „Behalten.“). Solange er nicht Lanterns ist, sieht Lantern jede Nacht um
  00:30 nach, in `cam23` zu sehen (die Momente `lantern_sat`, `lantern_sun`, `lantern_mon`), und nimmt ihn mit, wenn er drinliegt;
  legt Juno ihn erst nach seinem Blick zurück, ist er über Nacht weg, und am Montag nimmt Lantern ihn dann sofort (es gibt keine Nacht
  mehr, und die Uhr steht in seinem Fenster). Lantern ist in `cam23` noch seine Figur aus `cam31` (**Platzhalter**, §10); steht Juno
  um halb eins selbst im Waschsalon, sieht sie ihn dort nicht, denn im Straßenmodus gibt es ihn noch nicht (beim Malen zu lösen: ein
  Ort, ein Bild). Bis Sonntag kennt Juno seinen Namen nicht und sagt „der aus der Metro“. Den Weg mit
  dem Stick in der Tasche prüft vorerst nur der Solver (`--set stick_ines`), denn `play.mjs` kann keinen Start mit gesetzten Flags.
  Der Start stellt außerdem `p1` aus `ledger_kessler` wieder her (dieselben Werte): Ohne `p1` ließ die Wohnungstür Juno nicht hinaus,
  und Frau Kesslers Antworten aus dem Prolog gingen wieder auf (sie gelten jetzt nur am Dienstag).
- **Ines' Wohnung** (§3.3, `game/kapitel2_lerche.js`, die Räume `lerche_flur` und `ines_wohnung` als **Blöcke** aus den Kits des 14. Stocks
  und von Junos Wohnung, gebaut mit `tools/new-room.mjs`): In `cam24` kommt jeden Abend um 19:30 ein Nachbar heim und tippt den Code
  (`code_lerche`, **Platzhalter** „4719“ und als Figur ein Pendler aus `cam03`; verpasst hat ihn der Puffer). Das Tor der Jade Row führt
  auf Weg_1 (seit 2026-11-18, nach dem Stadtplan des Nutzers), dort hat die Haustür des Wohnblocks das Zahlenfeld; im Erdgeschoss geht es
  über Treppe oder Aufzug in den 4. Stock. Im Flur weiß Juno ohne `know_flat` nicht, welche
  Tür; `cam25` (neu, mit `cam24` verbunden, das Bild des Flurs unter dem Filter) zeigt am Sonntag um 20:00 die zwei in Weiß an 4B (als Figur
  vorerst Ashe aus `cam31`) und gibt `know_flat`. Ab Sonntag 21:00 ist 4B offen (eine Zeit, kein Flag); wer die zwei verpasst hat, erkennt
  die Tür am Siegel `CIVIC REST – SEALED` und weiß es dann auch. Am Kühlschrank fragt Juno: „Die Serviette ansehen.“, „Das Gefrierfach
  aufmachen.“ oder „Nichts.“, beides in beliebiger Reihenfolge; die Akte gibt `cache_note_civic_rest` und `evi_knows`, und EVIs Szene (W7)
  läuft wie oben. Die Uhr am Montag verlangt jetzt auch `evi_knows`. Die Momente des Vortags vergisst die Nacht (`passes`), sonst
  verdoppelt jedes „gesehen oder nicht“ alles danach.
- **Die Fälschung** (§3.4, `game/kapitel2_faelschung.js`, das Werkzeug in `game/pruefen.js`, 2026-11-15): Am Sonntag um 18:00, wenn Juno
  aufwacht, hat EVI die Nachricht gefunden und legt den Clip in den CACHE (`clip_forgery`). Weil das jeder sieht, kostet es keinen
  Zustand (technisch entschieden statt „wer die Nachricht im NETZ öffnet“). Was Juno darin sieht und was EVI von den Nachrichten
  erzählt (der Rollstuhl, LANTERN, „Dann ist der Clip falsch?“), kommt erst, wenn Juno den Clip im CACHE zum ersten Mal öffnet (der
  Wunsch des Nutzers, 2026-11-18); ob es gesagt ist, ist eine Ansicht (`forgery_seen`). Ab da kennt Juno den Namen Lantern, vorher sagt sie „der aus
  der Metro“ (am Trockner, beim Stick, im Hinweis). NETZ zeigt an den drei Abenden „Tote in der alten Metro.“, die Fälschung und die
  Fahndung, dazu „Was war gestern in Linie 31?“ auf dem Brett und L.s Nachtrag; der Fernseher im LUCKY STATIC und das Radio (NINTH FM,
  NAGI·WA EASY) sagen dasselbe. Junos eigene Aufnahme öffnet jetzt auch im Clip-Editor. **PRÜFEN** legt die Fälschung neben ihre Aufnahme:
  zwei Bilder über einer Zeitleiste mit vier Stellen (01:30, 01:58, 02:30, 03:03; wo der Abspielkopf steht, ist eine Ansicht), und die
  drei Funde **der Reihe nach** (technisch entschieden: so ist `forgery_cuts` ein Zähler, und zwar eine Ansicht, kein Zustand; als
  Zustand hätte er jeden Zustand ab Sonntag vervierfacht, nur `forgery_proven` zählt für die Geschichte): erst der
  Zeitstempel, dann der Regen, dann das Licht. Ein Klick außer der Reihe sagt nur „Da ist was anders. Aber ich geh der Reihe nach, sonst
  übersehe ich was.“ Mit dem dritten Fund: `forgery_proven`, die Notiz „Die Fälschung, zerschnitten“, und Juno: „Lantern war schon weg.
  Das kann ich zeigen.“ Die Bilder sind **Platzhalter**: das Bild von `cam31` mit seinen Feed-Figuren, im Code ausgeschnitten und in die
  zehn Werte des Phosphors gebracht (in der Fälschung ein abgedunkelter Rollstuhl an Ashes Stelle, bei Juno der weiße Fleck der Maske).
- **Das letzte Prüfen** (§8) ist dasselbe Werkzeug: Ein Klick auf das Deck öffnet die Protokolle, drei Nächte (Dienstag bis Donnerstag)
  mit den Spitzen der Schläfer, darunter Junos Clips mit ihren Zeiten. Juno wählt einen Clip (eine Ansicht) und dann die Spitze dazu:
  Kesslers Ring passt zu Dienstag 22:35 (41), der geschnittene Ring ebenso, Morrows Umschlag zu den Spitzen um 00:30, die weißen Träger zu
  Donnerstag 23:30. Ihre Aufnahme aus CAM 31 und die Fälschung passen zu keiner, und Juno sagt, warum. Eine Übereinstimmung genügt, dann
  läuft die Kette.
- **Lantern finden** (§3.5, `game/kapitel2_lantern.js`, 2026-11-15; der Raum `lantern_versteck` als **Block** mit `tools/new-room.mjs`,
  aus dem Kit von Junos Wohnung; die Fahrt und die Ankunft als Bühnen von der Seite, siehe unten): Am Sonntag um 22:00 reißt der große Schirm ab (der Moment `hijack`, über
  Nacht vergessen); der Text steht vorerst als Bildunterschrift über dem Stottern des Schirms (**Platzhalter**, §13, 4). Die halbe Reparatur
  steht jetzt auch an den Abenden von Kapitel 2 auf dem Gerüst; ab Sonntag 22:00 sagt sie, dass es übers Kabel kam (`know_cable`, auch wer den
  Schirm nicht gesehen hat). **Umgebaut am 2026-11-16** (vom Nutzer entschieden, §3.5): Das Kabel führt zum Floß DATA 1C/GB ganz rechts im
  Kanal; die Treppe hinab bleibt zu. Mit `know_cable` zieht der Haken das Floß an den Rand, und Pike (Figur `pike`, abends auf dem Floß; seine
  Planke ist eine eigene Gehfläche, mit einem Schlitz an den Rand angebunden) sagt, was er will (`pike_met`). Ratz gibt die Endstufe (das Ding
  `endstufe`) für eine Kopie des Ausweises (sein eigenes Gespräch, solange `pike_met` und noch kein `ledger_ratz`); gibt Juno sie Pike, stakt
  er sie hinaus, und danach jederzeit („Fährst du mich raus?“, solange sie sie nicht mehr hat; Pikes Gespräch ist ein einfacher Dialog, kein
  `talkTree`, damit die Fahrt es beendet). **Die Fahrt** ist eine Bühne von der Seite (`sumpf_fahrt`, `game/rooms/sumpf.js`, gemalt in
  `art/rooms/sumpf.px.js` auf den Linien der freigegebenen Skizze `art/test/sumpf_fahrt_blocks.px.js`): Die Ebenen ziehen als Props mit
  `scroll` vorbei, das Floß mit Pike ist eine Animation, und Juno steht darauf als ihre eigene Figur mit ihrer gewohnten Animation (vom Nutzer
  gewünscht 2026-11-16; ihre Gehfläche ist ein Streifen des Floßes); die Zeilen stehen oben. Die erste Fahrt ist die, die die Endstufe
  bezahlt, jede weitere die auf „Fährst du mich raus?“: Das unterscheidet die Wahl, kein Flag. Beim ersten Mal fühlt Pike Juno auf den Zahn (der Dialog `pike_fahrt`,
  drei Fragen mit Wahl, ohne Flag), danach kurz. Dazu die Melodie `sumpf` (`game/music.js`: D-dorisch, 56 bpm, eine Flöte über einer weichen
  Fläche und einem tiefen Grundton, ab und zu eine Glocke) und die Geräusche des Sumpfs (`game/sounds.js`: das Wasser und die Insekten als
  Schleifen, Frösche, Tropfen und ein ferner Vogel zufällig). **Die Ankunft** `sumpf` ist eine Bühne von der Seite, auf der niemand geht: Ein
  Klick auf das Floß führt zurück zum Markt, einer auf den Wohnwagen zu Lantern; beim ersten Mal sitzt er drin und will nicht gefunden werden (`lantern_found=found`). Den Ausweis gibt der
  Karton unter dem Bett und den Haken die Wand am Aufzug in Kapitel 2 auch dem, der in Kapitel 1 nie aufs Dach ging, und Juno kann beides
  jederzeit mitnehmen (vom Nutzer entschieden 2026-11-15). Nur die Solver-Läufe, in denen dieser Weg zu ist (`off_lantern`), schließen Karton und
  Haken mit, wie Kapitel 1 es mit dem Dach tut (`off_roof`). Lanterns Gespräch (`Nagiwa.talkTree`): „Ich hab
  gesehen, was passiert ist.“, „Ich hab ihren Schlüssel.“ (mit dem Stick: „Hier. Der gehört Ihnen.“ oder „Noch nicht.“), „Was ist das hier?“
  und „Ich geh wieder.“. Gibt Juno ihm den Stick, hat er ihn (wie aus dem Trockner), `lantern_found=ally`, und er wechselt zum Du („Sag's
  nicht. Ich will's nicht wissen müssen.“). „Ich hab eine Aufnahme.“ (Entscheidung 2, §3.6) steht auf dem Platz des Schlüssels, sobald Juno den Stick nicht mehr hat (vom Nutzer entschieden 2026-11-16: wer den Stick noch trägt, gibt ihn zuerst); gibt sie Lantern den Clip, ist er ihr Verbündeter (`lantern_found=ally`) und wechselt zum Du, falls er es nicht schon getan hat. Am Montag fragt das Brett, wer den Schirm
  gesehen hat. Die Hinweise zu diesem Weg gelten, solange Juno den Stick hat, Schritt für Schritt (der Trockner bleibt der kürzere Weg).
  **Gemalt** (2026-11-16, nach den Vorlagen des Nutzers, Prüfbilder `docs/rooms/sumpf_*`): die Fahrt und die Ankunft mit Pike, Juno und dem
  Floß; der Wohnwagen von innen auf den freigegebenen Blöcken (2026-11-16, Prüfbild `docs/rooms/lantern_versteck_x3.png`): Wände
  wie in einem alten Campingbus (dunkel unter einer Gürtelleiste, heller darüber, Fugen mit Schrauben, die Dachleiste; Wasser läuft vom
  Dach herab), ein Linoleum in kleinen Karos, in das sein Rollstuhl Spuren gefahren hat, die Küche (eine Tür fehlt, Geschirr im
  Becken, ein Topf, eine nackte Birne), sein Bett mit Schubladen und einer Armeedecke, sein Tisch, unter den der Rollstuhl passt
  (Bildschirme mit Kameras, die keiner mehr kennt, ein Mikrofon am Arm, ein Mischpult, seine Sturmlaterne), das Rack der Sender (die
  Röhren der Endstufe, 87.6 in Bernstein, ein VU-Meter, ein Steckfeld); das Grün seiner Bildschirme liegt jetzt auch im Licht.
  Lantern selbst ist gemalt (2026-11-16, auf dem vom Nutzer freigegebenen Block `art/test/lantern_blocks.px.js`; `art/characters/lantern.px.js`,
  Prüfbilder `docs/characters/lantern_*`; auf Wunsch des Nutzers ein Viertel breiter als der Block, die Beine getrennt, das Gesicht lesbar): im Rollstuhl, zu Juno hin gedreht (nach Südwesten, gezeichnet, nie gespiegelt), atmend, die
  Lichter seiner Antennen nacheinander, die Schrift im Okular läuft, die Laterne am Hals flackert; im Spiel gibt ihm die Lampe an
  seinem Platz ein blasses warmes Licht, damit der Poncho lila bleibt. Pike ist auf dem
  Markt von oben gemalt (2026-11-16, auf dem freigegebenen Block `art/test/pike_top_blocks.px.js`; `art/characters/markt_people.px.js`):
  er steht am hinteren Ende seines Floßes, still wie ein Reiher, und sein Hals zuckt ab und zu nach etwas, das sich bewegt; nur von
  Samstag an, in Kapitel 1 liegt das Floß leer da. **Die Abfahrt durch den Tunnel** (vom Nutzer gewünscht 2026-11-16, die Blöcke
  `art/test/tunnel_blocks.px.js`): Das Floß ist im Markt ein eigenes Teil (`drain_market_floss`). Juno steigt auf, Pike stakt, und Floß,
  Pike und Juno gleiten zusammen nach rechts unter den letzten Pfeiler des Rings, der am rechten Rand des Marktes über dem Kanal liegt,
  ins Dunkel. Die Fahrt beginnt in diesem Dunkel (`sumpf_fahrt_tunnel`, ohne Regen: die Ansicht `im_tunnel`), nur die Bildschirme des
  Floßes spiegeln sich, Pike sagt „Kopf runter.“, dann gleitet das Portal nach links weg, und zum ersten Mal ist Himmel da.
  Die Endstufe hat ihr eigenes Symbol, ein Modul mit Kühlrippen (vom Nutzer gewählt 2026-11-17, `art/test/inventar_k2_blocks.px.js`, Weg A).
- Die Hinweise des Kapitels sind seine eigenen (`Cutaway.hints(..., { act: "kapitel2" })`); die von Prolog und Kapitel 1 gelten nur
  noch in ihren Akten. Der Hinweis zur Fälschung gilt nur, während Juno sie im Editor ansieht, und erst nach den Hinweisen des Hauptfadens.
- Geprüft wird wie in Kapitel 1 der Hauptweg mit geschlossenen Fäden (`off_<thread>`): `node tools/solve-act.mjs kapitel2 --full
  --set off_roof,off_zeitung,off_imai,off_traeger,off_varga,off_tide,off_motte,off_vesper,off_lantern`, und dasselbe mit `stick_ines`. Der Weg zu
  Lantern ist darin zu (`off_lantern`: der Monteur weiß nichts, der Schirm reißt nicht ab), denn seine Schritte vervielfachten jeden anderen
  Zustand; er hat seinen eigenen Lauf mit `off_main,stick_ines,off_dryer,evi_knows,forgery_proven` statt `off_lantern` (`off_dryer` schließt den Trockner, so
  zeigt der Lauf, dass der Stick Lantern immer auch von Hand erreicht; `off_main` schließt wie in Kapitel 1 den Rest des Hauptfadens: den
  Weg zum Wohnblock Lerche, Vespers Angebot und die Frage nach Entscheidung 2) (technisch entschieden 2026-11-15, wie bei
  den Fäden); die Klicks `tools/paths/kapitel2_main.json`,
  und `spiel.json` geht vom Titel bis zum Ende von Kapitel 2.

**Was Kapitel 2 weitergibt:** `e2`, `lantern_alive` (ein Flag: Juno hat Lantern gefunden und die Quiet nicht zu ihm geführt; gebaut ist bisher
`lantern_found` = found | ally),
`forgery_proven`, `moth_student`, `k1b` nur als `warned` (Okonkwos Versteck in Kapitel 4) und das Kassenbuch. In Kapitel 2
abgeschlossen sind Varga und Kessler, der Eckladen bis auf Okonkwos Dank, Frau Imai, Frau Haldane (ihr Sohn ist in Kapitel 3 höchstens
ein Blick auf der Station, ohne Flag), Vesper, WREN und die Miete.

## 3. Der Hauptfaden: Ines

### 3.1 Der Stick

Ines' Daten-Wallet hat Lantern, ihr Schlüssel ist der Stick aus Trockner 6 (story §10b). Am Ende muss Lantern beides haben, sonst
kann er nicht senden.

- **Lag der Stick am Freitag noch im Trockner** (`!stick_ines`), hat Lantern ihn in derselben Nacht geholt. Kapitel 2 beginnt damit,
  dass er ihn hat.
- **Hat Juno ihn,** findet Lantern die Sechs leer. Er sieht jede Nacht um halb eins nach (00:30 bis 00:45), in `cam23` zu sehen: ein
  Rollstuhl mit Schwimmern im grünen Licht, der vor Trockner 6 hält und wieder fährt (er kommt übers Wasser, die Gasse ist ein Steg).
  Juno kann den Stick anonym zurücklegen; um halb eins in derselben Nacht nimmt Lantern ihn mit (bis dahin `stick_dryer`). Legt sie ihn erst
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
geht hinein, setzt sich in die Schlange und wird als Patientin aufgenommen: ein kleines Gespräch mit der **Pflegerin an der Aufnahme**,
**Marit Holm** (neue Figur, §10; Name, Stimme und Farbe vom Nutzer gewählt 2026-11-17: die Routinierte, `dialog-style-guide` §6).

| # | Wo | Was |
|---|---|---|
| K1 | `cam21` | Ab Samstag kommt Ines um 19:00 nicht mehr heraus. Um 19:00 kommt stattdessen die Pflegerin zur Nachtschicht, die an der Aufnahme sitzt, und sieht sich zweimal nach der Tür um. |
| K2 | `klinik` | Die Aufnahme ab 19:00 (vorher schickt der Schalter in die Schlange: „Nachtaufnahme ab sieben.“): Name (Juno nennt einen falschen), Schlafzeiten. Die Pflegerin bietet Lull an: „Es kostet nichts.“ Sie will noch hinter dem Ohr nachsehen, ob schon etwas sitzt; die innere Stimme DAS IMPLANTAT warnt (gibt es die Stimmen beim Bau noch nicht, Engine C12, denkt Juno es selbst: „Nicht hinters Ohr.“), und Juno zieht die Kapuze wieder hoch: „Nicht heute.“ Kein Scan, keine Spur zu ihr, und nichts nimmt Kapitel 3 vorweg (entschieden 2026-11-14; kein Gegenstand, das Lull bekommt Juno in Kapitel 3, story §7). Die Pflegerin: „Kommen Sie wieder, wenn Sie nicht schlafen können.“ |
| K3 | `klinik` | Juno fragt nach Dr. Calder. Die Pflegerin senkt die Stimme: Ines hat nachts Protokolle geschrieben, „die keiner bestellt hat“, und sie hat nie das Netz der Klinik benutzt, alles auf Papier. Am Samstagmorgen waren Leute in Weiß da und haben ihren Spind ausgeräumt. Am Samstag: „Morgen um acht räumen sie auch ihre Wohnung. Lerche, vierter Stock.“ Am Sonntag: „Heute um acht …“, am Montag: „Gestern haben sie ihre Wohnung ausgeräumt.“ → `know_flat` |

**Gebaut** (2026-11-17, `game/kapitel2_klinik.js`): K1 als Routine ohne Zustand (19:00 bis 19:30, wo das Warten ohnehin hält; sie bleibt an der Tür stehen und sieht sich zweimal um), die Klinik am Steg, der aus der Gasse nach Westen zur Querstraße läuft (seit 2026-11-18, nach dem Stadtplan des Nutzers; vorher eine Wahl am Tor der Jade Row), vor sieben die leere Aufnahme („Nachtaufnahme ab sieben.“), ab sieben Marit mit zwei Themen (`k2_marit`: die Aufnahme, Dr. Calder); beide lassen sich wiederholen, nur `know_flat` ist Zustand. Juno nennt sich „Ada Novak“. Marit duzt Juno erst, als sie sagt: „Wenn du sie gekannt hast, geh nicht hin, solange die da sind.“ Der Hinweis zur Tür nennt die Klinik zuerst. Im Solver-Lauf mit dem Stick ist die Klinik zu (`off_klinik`, technisch entschieden 2026-11-17): Ihr frühes `know_flat` verdoppelte dort jeden Zustand bis Sonntagabend, und der Lauf wuchs über 14 GB; der Hauptlauf prüft sie. Seit dem Abend desselben Tages ist im Stick-Lauf die ganze Wohnung zu (`off_flat`, von 313.642 Zuständen in 40 Minuten auf 19.057 in 75 Sekunden: das Tor zu Lerche und zur Klinik, der Code in CAM 24, die Quiet an 4B in CAM 25), und er setzt `evi_knows` voraus, wie der Lauf zu Lantern: Der Stick hängt nur an Entscheidung 2 (`quiet_dryer`) und an der Uhr um 00:45, nicht an der Wohnung, und was beide verbindet, prüft der Hauptlauf (vom Nutzer so gewollt, technisch entschieden).

Das ist ein Weg zu Ines' Wohnung, nicht der einzige: Wer die Klinik auslässt, sieht die Quiet am Sonntag in `cam25` die Tür 4B öffnen
(§3.3). Die Klinik erzählt, wer Ines war, und legt Kapitel 3 an: Juno weiß jetzt, wo es Lull gibt. Dass ihr Implantat dazu passt, erfährt sie erst dort (story §10a).

### 3.3 Ines' Wohnung

Wohnblock Lerche, vierter Stock, Tür 4B. Story §7: ein Einbruch im Straßenmodus, gelenkt durch den Feed.

| # | Wo | Was | Flags / Dinge |
|---|---|---|---|
| W1 | `cam24` | Die Haustür hat ein Zahlenfeld gleich neben der Klingelkamera. Jeden Abend um 19:30 tippt ein Nachbar den Code, und das Fischauge sieht seine Finger aus nächster Nähe (Zoom; verpasst: der Puffer). Die Zahlen werden mit der Spielschrift gesetzt (`art/lib/text.js`). | `code_lerche` |
| W2 | `jade_row`, Tor, `weg1`, `lerche_eg` | Am Ende der Jade Row führt das Tor unter dem Lull-Schirm auf Weg_1, die Straße von oben, die der Nutzer im Stadtplan gezogen hat (2026-11-18). Dort ist die Haustür des Wohnblocks Lerche; ohne den Code: „Die Haustür hat ein Zahlenfeld. Den Code hab ich nicht.“ Mit ihm tippt Juno „Vier, sieben, eins, neun.“ und steht im Erdgeschoss; Treppe oder Aufzug führen in den 4. Stock (die Stockwerke zählen mit), am Sonntag von 20:00 bis 21:00 nicht: „Da oben sind Stimmen. Ich warte.“ Die Klinik liegt nicht hier, sondern am Steg aus der Gasse (§3.2). | — |
| W3 | `cam25` | Der Flur im vierten Stock, das Iso-Bild von `lerche_flur` unter dem Feed-Filter (ein Ort, ein Bild). Derselbe Hauszugang wie `cam24`, also verbunden, sobald `cam24` es ist. Am Sonntag um 20:00 kommen zwei von der Quiet in weißen Regenmänteln, öffnen 4B und tragen bis 21:00 Kisten hinaus; der Rechner geht mit. Dann kleben sie ein Siegel über die Tür. | `know_flat` (auch so) |
| W4 | `lerche_flur` | Ohne `know_flat` weiß Juno nicht, welche Tür: „Auf 4B steht kein Name. Ob sie hier gewohnt hat, weiß ich nicht.“ (seit der Nutzer 4A und 4C gestrichen hat, 2026-11-18; vorher „Hier wohnen zwölf Leute, und an keiner Tür steht Calder.“) Mit ihm ist vorher 4B abgeschlossen: „Abgeschlossen. Ich bin keine Einbrecherin. Jedenfalls nicht so eine.“ Von 20:00 bis 21:00 am Sonntag geht Juno nicht hinauf: „Da oben sind Stimmen. Ich warte.“ Danach hängt nur noch das Siegel `CIVIC REST – SEALED` über dem aufgebrochenen Schloss. Juno reißt es ab. | — |
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
im CACHE (`clip_forgery`). Gebaut ist es anders: EVI legt ihn am Sonntag um 18:00 jedem in den CACHE (siehe „Im Mock gebaut“ unter §2.1).

**Warum Nagi·wa damit durchkommt** (entschieden 2026-11-14): Niemand weiß, wer der Mann in Weiß ist, und Lantern kennt auch keiner;
Nagi·wa kann behaupten, was es will. Das gilt auch, wenn Junos echter Clip vorher eine Nacht auf NINTH LIVE lief (§3.6): Ein Mann ohne
Gesicht beweist nichts.

**Woher das Bild kommt:** aus der Live-Übertragung an WREN, die nur Bild war (story §10b). Hat Juno gesendet, ist es ihr eigenes Bild.
Hat sie sich geweigert, ist es das des anderen Glassers, der WRENs Auftrag übernommen hat (story §9). In beiden Fällen ist die
Fälschung **stumm**; Junos Aufnahme hat den Ton des Mikros neben Ines. Juno, wenn sie gesendet hat: „Das ist mein Bild. Die haben mein
Bild genommen.“

**Das Rätsel am Schreibtisch** (Prüfen, `kapitel0-design` §2.4): Juno legt `clip_forgery` neben `clip_ines_death` (den hat jeder, Kapitel 1, §8).
Beide laufen auf zwei Zeitleisten untereinander, und Juno findet drei Stellen, jede mit einem Klick auf die Zeitleiste und einem auf
die Stelle im Bild, der Reihe nach (so gebaut, 2026-11-15). Keine Fingerfertigkeit, keine Zeit; ein falscher Klick kostet nichts.

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
| L3 | `drain_market`, das Floß | Das Kabel kommt hinter dem Schirm aus dem Gully in den Kanal und läuft an der Kanalmauer entlang bis zum Floß DATA 1C/GB, dem mit der Batteriebank und der Antenne. Es liegt draußen auf dem Wasser an seinem Seil, zu weit vom Rand, und sein Mann kommt nicht herüber. Ohne `know_cable` verkauft da draußen nur einer Daten („Da verkauft einer Daten. Ich hab selber welche.“). Mit ihm zieht Juno das Floß mit dem **Haken** an den Rand (vom Nutzer entschieden 2026-11-16) und steigt hinüber: „Teo hätte das mit einer Hand gemacht.“ Den Haken hat sie aus Kapitel 1 in der Tasche; wer ihn nicht dabeihat, findet ihn neben der Aufzugtür. Die Kette an der Treppe hinab bleibt zu: Ratz muss kein Schloss mehr öffnen. | — |
| L3b | `drain_market`, Pike und Ratz | **Der kleine Auftrag dieses Kapitels** (vom Nutzer entschieden 2026-11-16, statt Ratz und dem Schloss vom 2026-11-14): Auf dem Floß steht **Pike**, Lanterns Gehilfe, umgebaut mit dem **Reiher**: lange dünne Beine, mit denen er im Wasser steht und das Floß stakt, ein langer Hals, ein spitzes Gesicht. Er nimmt Juno mit, wenn sie ihm die **Endstufe** aus einem alten Flutwarnmast besorgt, die Lantern für seine Sendung am Montag braucht. Die hat nur Ratz, und Ratz verkauft Pike nichts mehr, seit Pikes Mod ihn einmal am Schwanz aus dem Kanal geschnappt und kopfüber über das Wasser gehalten hat. „Ein Reflex“, sagt Pike. Ratz: „Ein Schnabel macht nichts von allein.“ Juno bekommt die Endstufe für ihren alten **Ausweis**: Ratz kennt die Karten von Nagi·wa („Die mögen alte Karten.“), liest den Chip aus und behält die Kopie, denn mit einer Karte von drinnen gehen auch die Klappen in den Rohren unter der Krone auf, zu seiner Kolonie (story §9). Juno bekommt den Ausweis zurück: „Das zweite Mal, dass das Ding was aufmacht.“ Hat sie ihn nicht dabei, liegt er im Karton unter ihrem Bett. Kassenbuch: „Ratz: eine Kopie meines alten Ausweises.“ Ausweis und Haken kann Juno jederzeit mitnehmen (vom Nutzer entschieden 2026-11-15); nach der Endstufe fragt sie Ratz erst, wenn Pike gesagt hat, was er will. Gibt sie Pike die Endstufe, stakt er sie hinaus, und von da an nimmt er sie mit, wann sie will. Jedes Gespräch mit höchstens vier Antworten. | `pike_met`, `ledger_ratz`, das Ding `endstufe` |
| L4 | der Kanal, die Fahrt | Pike stakt das Floß nach rechts aus dem Markt. Die Fahrt ist **von der Seite** gezeigt (in Iso sähe sie komisch aus): Der Kanal führt hinaus an den Rand, wo über der alten Stadt kein Ring mehr liegt. Dort steht ein ertrunkener Wald zwischen den Hausfronten, Stämme im Wasser, Moos in den Ästen, Wasserlinsen, Spiegelungen, darüber der Nachthimmel und der Schein der Krone, im Regen. Technisch (entschieden von Claude): eine feste Bühne von 320x180 (`sumpf_fahrt`, `game/rooms/sumpf.js`); das Floß steht still, die Ebenen dahinter und davor (die Ferne, die Hausfronten mit den Stämmen, die Wasserlinsen, die großen Stämme vorn) ziehen als Props mit `scroll` in eigenem Tempo vorbei; Juno steht auf dem Floß; beim ersten Mal ganz, danach kurz. Eine Kette ohne Verzweigung, sie kostet den Solver nichts. Pike hebt die Stange und stößt sie wieder ins Wasser. **Während der Fahrt reden Juno und Pike** (unten), dazu spielt eine ruhige, mystische Melodie, und man hört den Sumpf: Frösche, Insekten, Tropfen, das Wasser am Floß, einmal ein Vogel (vom Nutzer gewünscht 2026-11-16). | — |
| L5 | `sumpf`, `lantern_versteck` | Am Ende des Kabels ein Wohnwagen auf Pontons zwischen den Bäumen (vom Nutzer gewünscht 2026-11-16, nach Vorlagen): ein mystischer Ort, alte knorrige Bäume, die auf ihren Wurzeln im Wasser stehen, dichtes Moos, Nebel über dem Wasser, Seerosenblätter, ein Steg aus Planken auf Pfählen, an dem das Floß festmacht, und kleine grüne Laternen in den Ästen und am Steg, die sich im Wasser spiegeln: Lanterns Lichter. Der Wohnwagen ist ein kastiger alter Campingbus (vom Nutzer nach einer Vorlage gewünscht 2026-11-16): oben silbern, unten dunkelgrau, große dunkle Fenster, vorn die Kabine mit schräger Scheibe und eckigen orangen Scheinwerfern, auf dem Dach eine Dachbox, ein Gepäckträger mit Kanistern und einem Solarpaneel, hohe Antennen (ein Mast mit Querstäben und Abspannseilen, Peitschenantennen, oben grüne Lichter) und eine Schüssel; an den grauen Seiten kleine futuristische Anbauten (eine Leitung, genietete Paneele, ein Lüftungsgitter, ein Staukasten, ein Verteiler, kleine cyanfarbene Statuslichter); keine Räder, er steht auf Stapeln aus Backsteinen, die mit gefüllten Fugen fest auf dem Deck stehen (beides vom Nutzer gewünscht 2026-11-16), auf einem Ponton, einem Bretterdeck auf einer Reihe blauer Schwimmkörper mit Pfosten und Geländer (vom Nutzer nach einer Vorlage gewünscht), die Schiebetür offen auf sein Grün, das Kabel kommt den Steg entlang und geht hinein. **Alles dahinter ist dunkel und mystisch** (ebenso gewünscht): ein tiefer, dunkelgrüner Wald, in der Mitte ein grünes Leuchten im Nebel, riesige Bäume, jeder anders (geneigt, verschieden schlank, manche mit einem schweren Ast), auf einem flachen Fuß aus Brettwurzeln im Wasser, nie hohen Sockeln, Rinde in Rippen, Moos, Ranken von einem Ast, der sich über alles spannt, ein paar orange Dornen, Zypressenknie, schwebende Sporen im Licht. **Der Sumpf ist nie ruhig, er wirkt gefährlich und ungemütlich** (vom Nutzer gewünscht 2026-11-16): dichter Regen in drei Schichten und sein Rauschen, Nebelbänke, die über das Wasser treiben, Lanterns Laternen, die jede für sich flackern und wabern, und unter der Oberfläche zieht ab und zu etwas vorbei, von dem man nur die Bugwelle, Ringe und Blasen sieht (was es ist, bleibt offen); dazu Blasen, knarzendes Holz, ein Platschen, fernes Grollen, und unter der Melodie eine Schicht aus tiefen Tritoni, die an- und abschwillt. Die Fahrt hat dieselbe Stimmung: die Riesen im Dunst, bemooste Hausfronten, der Schein der Krone links gedämpft. **Die Ankunft ist eine Bühne von der Seite** wie die Fahrt (vom Nutzer entschieden 2026-11-16): Juno bleibt auf dem Floß stehen; ein Klick auf den Wohnwagen führt hinein, einer auf Pike zurück. **Drinnen ist der Wohnwagen ein Raum in Iso** (`lantern_versteck`). Drinnen Lantern in seinem Rollstuhl, die Bildschirme, der Sender. Er duzt sie wie man sich unten duzt (vom Nutzer entschieden 2026-11-16), bricht Sätze ab und will wissen, woher sie kommt. Was Juno ihm sagen kann, ist ein Gespräch mit höchstens vier Antworten (`Nagiwa.talkTree`): „Ich hab gesehen, was passiert ist.“, „Ich hab ihren Schlüssel.“ (wenn sie den Stick hat; den Stick kann sie ihm auch aus der Tasche geben), „Was ist das hier?“ und „Ich geh wieder.“. „Ich hab eine Aufnahme.“ kommt mit Entscheidung 2 (§3.6) und steht auf dem Platz des Schlüssels, sobald Juno den Stick nicht mehr hat (vom Nutzer entschieden 2026-11-16; `Nagiwa.talkTree` mit `{ either: [...] }`). | `lantern_found` |

**Die Gespräche im Sumpf** (Entwurf 2026-11-16, nach dem Wunsch des Nutzers: vorsichtig am Anfang, freundlich, mit der Zeit
vertrauter, nicht knapp; Juno, Pike und Lantern duzen sich). Jede Wahl zeigt höchstens vier Antworten; Pikes Meinung über Juno ist
kein Flag.

*Pike, die erste Fahrt.* Auf dem Markt: „Stell dich in die Mitte.“ Im Tunnel: „Kopf runter.“ Draußen, eine Weile nur das Wasser:

> Pike: „Du bist die Erste seit Langem, die freiwillig hier rausfährt.“ – Juno: „Und die anderen?“ – Pike: „Die wollten Daten. Die
> bleiben am Markt.“ – Pike: „Darf ich dich was fragen?“ – Juno: „Kostet das was?“ – Pike: „Bei mir nicht. Ich bin nicht Sable.“
>
> Pike: „Was willst du von ihm?“
> - „Ich hab gesehen, was mit ihr passiert ist.“ – Pike: „Gesehen. Wo?“ – Juno: „Auf einer Kamera. Ich schau viel auf Kameras.“ –
>   Pike: „Eine Glasserin.“ – (eine Pause) – Pike: „Die verkaufen, was sie sehen.“ – Juno: „Meistens. Das hier nicht.“ – Pike:
>   „Warum nicht?“ – Juno: „Weil ich weiß, wie es war. Und die Nachrichten erzählen was anderes.“ – Pike: „Hm.“
> - „Ich hab was, das ihm gehört.“ (nur mit dem Stick) – Pike: „Dann gib's mir. Ich bring's ihm.“ – Juno: „Nein. Ihm selbst.“ –
>   Pike: „...“ – Pike: „Gut. Das hätte ich auch gesagt.“
> - „Das würd ich ihm lieber selbst sagen.“ – Pike: „Mhm. Ist in Ordnung.“ – Pike: „Ich stake trotzdem.“
>
> Pike: „Und was machst du, wenn du nicht über Kanäle fährst?“
> - „Ich seh mir Kameras an und verkauf, was ich seh.“ – Pike: „Ehrlich. Das ist selten auf dem Kanal.“ – Juno: „Ehrlich ist
>   billig.“ – Pike: „Nicht hier draußen.“
> - „Nichts Besonderes. Ich wohn im Kessel-Block.“ – Pike: „Da wohnen viele. Die meisten schlafen.“ – Juno: „Ich nicht.“ – Pike:
>   „Das merkt man.“
>
> Pike: „Hörst du ihn manchmal? Den Sender.“
> - „Ich weiß, was er auf den Schirm geschrieben hat.“ – Pike: „Zehn Sekunden.“ – Juno: „Länger glaubt einem eh keiner.“ – Pike
>   sieht sie an. – Pike: „Das sagt er auch. Fast genauso.“
> - „Die Nachrichten sagen, er hat sie umgebracht.“ – Seine Stange bleibt im Wasser stehen. – Pike: „Sagen sie.“ – Juno: „Ich hab
>   gesehen, dass er's nicht war.“ – Pike: „...“ – Pike: „Dann sag ihm das. Aber nicht gleich. Er braucht eine Weile.“
> - „Nein. Ich hör Kameras, kein Radio.“ – Pike: „Kameras lügen auch.“ – Juno: „Die nicht. Die Leute, die sie schneiden.“ – Pike:
>   „Das würde ihm gefallen.“
>
> (Der Wald.) Juno: „Über uns hören die Ringe auf. Da ist Himmel. Und Bäume, mitten in der Stadt.“ – Pike: „Noch was. Umsonst.“ –
> Juno: „Ja?“ – Pike: „Geh langsam rein. Er ist lange allein da draußen. Wer zu schnell kommt, kommt nicht weit.“ – Pike: „Da vorn
> hängen seine Lichter.“

Danach kurz: Pike: „Mitte.“ – Juno: „Ich weiß.“

*Lantern, das erste Mal.* Juno steht in der Tür. Sein Ton entscheidet, ob er bleibt:

> Lantern: „Bleib da stehen.“ – Lantern: „Wer bist du? ... Nein. Sag's nicht.“ – Lantern: „Wie bist du ... Der Reiher. Natürlich der
> Reiher.“ – Juno: „Er hat mich gebracht. Ich hab ihm die Endstufe besorgt.“ – Lantern: „Dann hat er sie also doch.“ – Lantern: „Und
> jetzt stehst du in meinem Wagen. Was willst du?“
> - „Erst mal nur reden. Wenn du willst.“ – Lantern: „Reden.“ – Lantern: „Das sagen alle, bevor sie was wollen.“ – Juno: „Ich will
>   auch was. Aber nicht gleich.“ – Lantern: „... Ehrlich wenigstens.“ (weiter)
> - „Pike sagt, du bist lange allein hier draußen.“ – Lantern: „Pike redet zu viel. Für einen Reiher.“ – Juno: „Er hat drei Sätze
>   gesagt.“ – Lantern: „Eben.“ (weiter)
> - **zu forsch:** „Ich weiß, dass du's nicht warst. Ich hab alles gesehen.“
> - **zu forsch:** „Ich hab den Schlüssel von Ines.“ (nur mit dem Stick)
>
> (weiter) Lantern: „Setz dich. Da, auf die Kiste. Nicht aufs Bett, das ist meins.“ – Er dreht die Laterne an seinem Hals ein wenig heller.
> - „Was ist das hier alles?“ – Lantern: „Der Wagen hat mal Urlaub gemacht. Jetzt sendet er.“ – Lantern: „Siebenundachtzig sechs.
>   Nachts.“ – Lantern: „Hier ist Lantern. Wer das hier hört, ist noch wach. Das sag ich immer am Anfang.“ (weiter)
> - „Wie lange bist du schon hier draußen?“ – Lantern: „Seit dem Unfall. Pumpenhalle drei. Danach ...“ – Lantern: „Hier draußen fragt
>   keiner, wie man Treppen steigt.“ – Juno: „Und wie steigt man Treppen?“ – Lantern: „Treppen sind ein Argument. Ich hab Düsen.“ (weiter)
> - **zu forsch:** „Warum zeigen sie überall dich?“
>
> (weiter) Lantern: „Und jetzt du. Warum bist du wirklich hier?“
> - „Ich hab in der Metro zugesehen. Auf einer Kamera. Die ganze Zeit.“ – Lantern sagt lange nichts. – Lantern: „Dann weißt du, dass
>   ich ...“ – Juno: „Dass du schon weg warst. Ja.“ – Lantern: „...“ – Lantern: „Das hat noch keiner zu mir gesagt.“
> - „Ich hab was, das ihr gehört hat. Den Schlüssel.“ (nur mit dem Stick) – Lantern: „...“ – Lantern: „Sie hat gesagt, sonst weiß es
>   keiner.“ – Juno: „Sie konnte mich nicht sehen. Ich war an der Kamera.“ – Lantern: „Dann zeig ihn mir. Langsam.“
>
> Danach sein Gespräch wie bisher (die Metro, der Schlüssel oder die Aufnahme, der Wagen, „Ich geh wieder.“), im Du.

**Zu forsch:** Lantern: „Ich weiß nicht, wovon du redest.“ – Lantern: „Ich bin ein alter Mann mit einem Radio.“ – Juno: „So alt bist
du nicht.“ – Lantern: „Raus.“ – Lantern: „Und sag dem Reiher, er soll keinen mehr bringen.“ (Die Tür geht zu, das grüne Licht wird
dunkel: `lantern_found=out`.) Draußen, bei Pike: Pike: „Zu schnell?“ – Juno: „Zu schnell.“ – Pike: „Wenn er zu ist, redet er nicht mit
Leuten. Nur mit dem Sender.“ An der Tür, wenn sie klopft: „Nichts. Nur das Brummen vom Rack.“

**Pikes Reuse:** Pike (wenn Juno ihn fragt oder an der Reuse vorbeikommt): „Meine Reuse hängt da drüben in den Wurzeln. Da geh ich
nicht hin. Nicht mit dem, was da unten schwimmt.“ Juno macht sie mit dem Haken los: „Ich hak sie los. Am anderen Ende zieht was. Dann
lässt es los.“ – Pike: „Danke.“ – Pike: „Nimm den hier. Ein Akku aus meiner Bank. Wofür auch immer.“

**Auf Sendung** (mit der richtigen Welle, TX gedrückt). Lantern spricht ruhig, flüssig, ganz da:

> Lantern: „Hier ist Lantern. Wer das hier hört, ist noch wach.“ – Lantern: „Da ist jemand auf meiner Welle. Wer spricht da?“
> - „Ich bin noch wach.“ – Lantern: „...“ – Lantern: „Dann bist du auf Sendung. Sag, was du sagen willst.“ (weiter)
> - „Ich bin's. Die von vorhin.“ – Lantern: „Hier draußen gibt's kein vorhin.“ – Es rauscht. Er hat abgeschaltet.
> - „Mach die Tür auf. Ich will nur reden.“ – Es rauscht. Er hat abgeschaltet.
>
> (weiter)
> - „Ich war zu schnell. Das tut mir leid. Ich hab dich in der Metro gesehen, und du warst weg, bevor er kam.“ – Lantern: „...“ –
>   Lantern: „Die Tür ist offen.“
> - „Pike sagt, du redest nur mit dem Sender. Also red ich mit dem Sender.“ – Lantern: „Pike redet zu viel.“ – Lantern: „... Aber er
>   hat recht. Die Tür ist offen.“
> - „Mach auf, oder ich geh zu Morrow.“ – Es rauscht. Er hat abgeschaltet.

Auf den anderen Kanälen: die Lull-Werbung („Sleep better. Wake up new.“), NINTH LIVE („... und das war die zweite Stunde, Leute,
bleibt dran ...“), der Pegelbericht („Pumpe neun: Nennlast. Pegel Ring drei: steigend.“), Rauschen.

**Lantern** (Vorschläge; seine Sprechkarte steht seit 2026-11-15 im `dialog-style-guide` §6, als Entwurf): „Wer bist du? Nein. Sag's nicht.“ Beim Stick: „Sie hat gesagt,
sonst weiß es keiner.“ Juno: „Sie konnte mich nicht sehen.“ Gibt Juno ihm den Stick, hat er ihn, und er sagt, wann er sendet:
„Montag. Um eins. Bis dahin stehen die Sender.“ Juno und Lantern duzen sich von Anfang an (vom Nutzer entschieden 2026-11-16).

**Vorsichtig reden, und „Auf Sendung“** (vom Nutzer gewünscht 2026-11-16, nachdem er die Szenen im Sumpf gespielt hat): Pike und
Lantern reden nicht knapp, sondern richtig: vorsichtig am Anfang, freundlich, und mit jeder ehrlichen Antwort ein wenig vertrauter. Beim
ersten Mal im Wohnwagen entscheidet Junos Ton. Fängt sie vorsichtig an (wer sie ist, dass Pike sie gebracht hat, was das hier ist),
erzählt Lantern nach und nach, und das Gespräch geht weiter (`lantern_found=found`). Geht sie zu forsch ran (gleich der Mord, gleich
„Ich weiß, dass du's nicht warst“, gleich der Schlüssel), gibt er nichts zu, wirft sie hinaus und macht die Tür zu
(`lantern_found=out`); Klopfen hilft nicht. Pike: „Wenn er zu ist, redet er nicht mit Leuten. Nur mit dem Sender.“ Dann draußen der
kleine Auftrag **„Auf Sendung“**: Die Ankunft wird breiter und scrollt nach rechts, hinter dem Wohnwagen weiter: Lanterns
Funkturm, ein schlanker Gittermast mit Antennen im Kreis auf einem Betonklotz, an seinem Fuß ein Kasten mit einem kleinen Schirm, der
seine Welle zeigt; ein altes Ruderboot, am Heck abgesoffen (nach den Vorlagen des Nutzers, 2026-11-17); Wurzeln im Wasser, wo das Ding
unter der Oberfläche schwimmt.

1. Auf der vorderen Bank des Boots liegt ein altes Funkgerät, ohne Strom (das Ding `funkgeraet`, jederzeit mitzunehmen).
2. Pikes Reuse hat sich in den Wurzeln verhakt. Mit dem Haken macht Juno sie los (`reuse_frei`); Pike gibt ihr dafür einen Akku aus
   seiner Batteriebank (`akku`). Der Akku ins Funkgerät, und es geht (das Ding `funk`).
3. Das kleine Spiel: Am Funkgerät stellt Juno den Kanal (fünf; 87.6 ist seiner) und die Wellenform (vier), bis ihre Welle der auf dem
   Schirm am Mast gleicht. Nur Klicks, keine Zeit, kein Ziehen; die Stellung gilt nur, solange das Gerät offen ist.
4. Sie spricht auf seiner Frequenz. Auf Sendung ist Lantern ruhig und ganz da. Wählt sie ruhige, ehrliche Worte, antwortet er über Funk
   und macht die Tür wieder auf (`lantern_found=found`); drängt sie, rauscht es, und sie kann es noch einmal versuchen.

Alles das gehört zum Weg zu Lantern und wird mit ihm geprüft (der Lauf mit `off_main`); in den anderen Läufen ist er zu (`off_lantern`).
**Gebaut** (2026-11-17, auf den freigegebenen Blöcken `art/test/sumpf_rechts_blocks.px.js`, `funk_blocks.px.js`): `game/kapitel2_funk.js`.
Die Ankunft ist 640 breit und gemalt (`sumpf_bg`), die Tür, die Reuse und das Funkgerät sind Teile, die sich ändern; das Funkgerät von
nah ist ein Bildschirm für sich (der Raum `funk`, mit dem Schalter PWR legt Juno es weg). Kanal und Welle zählen ab 1 (`funk_ch` 1 bis
5, `funk_welle` 1 bis 4) und gelten nur, solange es an ist; seine Welle sind die Zacken. Die Klicks: `tools/paths/kapitel2_sendung.json`
geht den forschen Weg und das Rätsel, `kapitel2_lantern.json` den vorsichtigen. Funkgerät, Akku und das Funkgerät mit Akku
haben ihre eigenen Symbole (vom Nutzer gewählt 2026-11-17: das Funkgerät B gerade von vorn mit Griff, mit Akku leuchtet sein Schirm grün; der Akku A).

**Der Schatten:** Weiß die Quiet, wer Juno ist, steht jemand in Weiß auf der Kowalski-Straße, von 19:00 bis 23:00, vorn vor dem LUCKY
STATIC, mit dem Rücken zu uns, und starrt auf ihre Haustür (§4; vom Nutzer entschieden 2026-11-17). Erst ist es einer mit Kapuze, am Montag
der Anführer mit zwei Untergebenen (§4, §10): nach `e1=sold`, sobald Juno den Clip an Sable, Vesper oder Morrow gegeben hat (gleich, nicht erst am nächsten Abend:
so liest der Schatten nur `e1`, `e2` und den Tag und braucht kein eigenes Flag), und sonst ab Montag, denn dann hat die Quiet sie in
jedem Fall gefunden (§4). Wer in dieser
Zeit zu Lantern geht, führt die Quiet zu ihm (`led_quiet`; in Kapitel 4 stirbt Lantern dann, story §7). Das ist keine Sperre, aber der
Spieler weiß es vorher: Auf dem Weg in die Gasse sagt EVI: „Der in Weiß schaut uns nach.“ Vor 19:00 oder nach 23:00 ist die Straße frei.
**Gebaut** (2026-11-17, `game/kapitel2_quiet.js`, die Figuren gemalt in `art/characters/quiet.px.js`): `led_quiet` setzt das Ablegen von
Pikes Floß, wenn der Schatten in dieser Zeit steht (die Quiet sieht, wohin Juno fährt; das liest nur Tag, Uhrzeit, `e1` und `e2`, also ohne
eigenes Flag dafür, ob Juno an ihm vorbeiging). EVI sagt es dreimal vorher: an der Gasse („Der in Weiß schaut uns nach.“), bei Pike („Oben
steht der in Weiß. Bis elf.“) und beim Ablegen („Der in Weiß oben. Sieht der, wohin wir fahren?“); ihr Hinweis ist der aus §12.

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

**Gebaut** (2026-11-16, auf Blöcken, die Preise Platzhalter): alle fünf Wege. Sable in ihrer Bude („Ich hab die Aufnahme aus der alten
Metro.“, dann „Verkauft.“ oder „Noch nicht.“; die vier Preise als Werte von `ledger_sable_ines`); Morrow am Samstag und Sonntag um
00:30 in der Jade Row selbst, ihr Streifenwagen ein Stück hinter ihr in der Gasse, in seiner Größe dort gemalt (`streife_nah`, vom Nutzer
freigegeben 2026-11-16) (Morrows Dialog `morrow_k2`, sie siezt);
Lantern in seinem Gespräch (§2.1); Vesper im CHAT; Behalten fragt das Deck am Montag um 00:45. Hat Lantern den Clip, läuft er um 01:00
mit (§8). Das Flüstern (§3.1) ist ein eigener Moment
im Clip-Editor (FLÜSTERN, 22 Sekunden am Ende der Übergabe); SCHNEIDEN nimmt ihn heraus, solange `e2` offen ist, und legt `clip_ines_cut` in den
CACHE („CAM 31, 23:03, GESCHNITTEN“). Will Juno Sable, Vesper oder Morrow den ganzen Clip geben, fragt EVI vorher („Im Clip ist das Flüstern. Willst
du, dass das jemand hört?“: „Ja. Ganz.“, „Nein. Ich schneid's raus.“, „Doch nicht.“); wer schon geschnitten hat, gibt den geschnittenen. Ging der
ganze Clip hinaus, setzt die nächste Nacht `quiet_dryer`: Der Mann in Weiß steht von 18:00 bis 01:00 in `cam23` vor der Sechs, Zurücklegen geht nicht
mehr, und Lantern kommt nicht mehr an den Trockner; EVIs Hinweis schickt Juno dann zu ihm. (Die Läufe mit `off_lantern` halten den Trockner offen,
weil dort der Weg zu ihm zu ist, und lassen das Schneiden weg, das dort nichts ändert und jeden Zustand verdoppelte; der Lauf dieses Wegs
allein schließt den Trockner mit `off_dryer` ohnehin. Das Schneiden prüfen die Klicks: `tools/paths/kapitel2_main.json` schneidet bei
Vesper, die anderen Pfade geben den ganzen Clip.) **Platzhalter:** Der Mann in Weiß ist die Figur
aus `cam25`, im Waschsalon selbst (Straßenmodus) wird er nur erzählt. **Gebaut** (2026-11-17): Er ist einer der Männer der Quiet (B),
gemalt, im Waschsalon selbst vor der Sechs und in `cam23` dieselbe Figur unter dem Filter.

### 3.7 Montag, 00:45

Um 00:45 hält die Uhr, wie am Freitag in Kapitel 1, bis drei Dinge erfüllt sind:

1. Juno war in Ines' Wohnung (`evi_knows`). Sonst: „Ich weiß immer noch nicht, wer sie war.“
2. Lantern hat den Stick (weder `stick_ines` noch `stick_dryer`). Sonst: „Ich hab noch ihren Schlüssel. Ohne den ist alles umsonst.“ Liegt der Stick wieder
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
| wenn die Quiet sie kennt | der Schatten auf der Kowalski-Straße, 19:00 bis 23:00 (§3.5): einer mit Kapuze | „Weiß hält hier unten keinen Tag.“ (das hat die Regenleserin gesagt) |
| nach `e1=refused` | Sable: „Der, der für WREN geglasst hat, ist weg. Seit gestern.“ Die Quiet sucht, wer noch an CAM 31 war, und ihre Liste ist kurz (story §10b). | „Dann bin ich die Nächste auf der Liste.“ |
| Samstag und Sonntag, unterwegs | Die Schläfer sehen sie (entschieden 2026-11-14): Wenn Juno hinausgeht, auf die Kowalski-Straße, in die Jade Row, zum Waschsalon, ist sie in Nagi·was Kameras, und was sie von ihr markieren, kommt bei Nagi·wa an. Juno ruft der Zeuge nur; verstecken kann er sie nicht, er versteckt niemanden aktiv. Kein Flag: Das gilt für jeden Spieler, denn jeder geht hinaus. | (Vorschlag, wenn sie es ahnt) „Die gucken mich an. Alle, die schlafen.“ |
| ab Montag, in jedem Fall | Die Quiet hat Juno gefunden, auch nach einer Weigerung und wenn sie den Clip behält (entschieden 2026-11-14): Ihr alter Nagi·wa-Zugang war an Ines' Kameras offen (`cam21`, `cam30`), und als die Quiet sucht, wer dort zugesehen hat, steht ihre Kennung im Protokoll; dazu die Markierungen der Schläfer. Der Schatten steht ab Montag vor dem Haus, und jetzt sind es drei: der Anführer und zwei mit Kapuze (vom Nutzer entschieden 2026-11-17, die Quiet steigert sich). Die Meldung an Revier 9 aus Kapitel 1 spielt keine Rolle: Sie ist dort ein freiwilliger Klick ohne Flag. | „Mein alter Zugang. Die haben die Codes nie geändert. Aber nachgesehen haben sie.“ |

Kein Flag außer dem Wissen, das die Quiet schon hat: Die Kameras gehen über Nacht (`passes`), der Schatten liest `e1`, `e2` und den Tag.

**Gebaut** (2026-11-17, `game/kapitel2_quiet.js`): Der Schatten steht vorn vor dem LUCKY STATIC, erst einer mit Kapuze, am Montag der Anführer
und zwei mit Kapuze einen Schritt hinter ihm. Ihr Weiß nimmt das Licht des Raums nicht an (die Figur hat `lit: false`, Engine 376a4aa). In GLASS
sind `cam07` ab Sonntag und `cam14` ab Montag grau mit `KEIN SIGNAL`, ebenso in der Leiste der Feeds; ein Klick sagt nur Junos Zeile. Die Links
vergisst die Nacht davor, und `cam14` steht ab Montag für jeden auf der Karte (Juno kennt die Kamera über ihrer Treppe). Im Flur ist das rote
Auge der Kamera am Montag aus: dieselbe Kamera zweimal im Plan von `kessel_14`, die zweite dunkel (`corner_cam_dark`).
Am Ende von Kapitel 2 weiß die Quiet in jedem Fall, wer Juno ist; Kapitel 3, in dem sie den Block stürmt (story §7), braucht dafür
kein Flag.

## 5. Was aus Kapitel 1 nachkommt

Jede Folge liest nur Flags aus Kapitel 1 und den Tag; die Fäden bleiben getrennt (`off_varga`, `off_tide`).

**Gebaut** (2026-11-17, `game/kapitel2_folgen.js`; die Bilder folgen auf Blöcken): Zustand ist nur, was Juno noch wählt, `ledger_varga2`
(paid | owed, statt eines eigenen `varga2`: der Eintrag im Kassenbuch ist das Flag) und `ledger_kessler_alms` (die fünfzig für Kessler).
Was allein aus einer Antwort folgt, kostet keinen Zustand: die Zeilen, die das Kassenbuch beim Start des Akts selbst schreibt
(`ledger_wren_other`, `ledger_okonkwo_robbed`, `ledger_bao_hurt`, `ledger_kessler_hurt`), WRENs gelöschter Kontakt (eine Ansicht), die Zeilen
beim Ansehen, Meis Neuigkeit, Okonkwos Gruß und TIDEs letzte Nachricht. Vargas Mann steht von 19:00 bis 23:00 da statt bis 22:00
(technisch entschieden: dieselben Stunden wie der Schatten, so hält das Warten nirgends neu, und kein Klickpfad ändert sich). Kessler
sitzt ab Sonntag neben Ratz' Stand und fragt nach Geld („Ich bin die Treppe runter. Dreimal.“). Baos fehlender Wagen ist gebaut (2026-11-17): Samstag und Sonntag nach `k1b=sold` fehlen Wagen, Schirm und Bao, und der Mann der Quiet geht in dieser Zeit langsam vor dem LUCKY STATIC auf und ab und dreht sich an jedem Ende langsam um (vom Nutzer gewünscht; sein Gang `quiet_b_walk_*` in `art/characters/quiet.px.js`, `docs/characters/quiet_b_walk_*`, `docs/rooms/kowalski_ohne_bao_*`; nur Ansicht, dieselben Stunden). Die Graffiti werden rot (vom Nutzer entschieden 2026-11-17: eine Drohung). Bao mit Verband, die Bretter,
`GLASSER LIES` und `WHO TALKED?` kommen mit ihren Bildern. **Gemalt** (2026-11-17, auf den freigegebenen Blöcken): Vargas Mann mit dem Kraken-Mod und Kessler von oben in
`art/characters/k2_folgen.px.js`, Bao mit Verband am Montag in `art/characters/bao.px.js` (`bao_band_*`, seine Pose in `game/cast.js`); Prüfbilder
`docs/characters/k2_folgen_x5.png`, `*_im_spiel_*`. Die Änderungen an fertigen Bildern stehen als **Blöcke zur Freigabe** in `art/test/k2_orte_blocks.px.js` (`docs/rooms/k2_orte_blocks_x2.png`, 2026-11-17): Bretter vor Okonkwos Fenstern und Tür, die Fenster dahinter dunkel; `WHO TALKED?` in Tidewater-Türkis an der dunklen Fassade rechts; in `cam07v` die Bretter von außen, nah und hell, dahinter der dunkle, halb leere Laden; `GLASSER LIES` schräg auf Junos Tür, wie die Wand läuft; die Kowalski ohne Baos Wagen und Schirm; in `cam03` ein Pendler der Feeds an Kesslers Automaten (keine neue Figur); in `cam22` die dampfende Schale auf Ines' leerem Platz; in `cam30` das Absperrband vor dem Abgang; am Denkmal in der Gasse das Papierboot zwischen den Kerzen. **Auch diese Blöcke sind gemalt** (2026-11-18, vom Nutzer freigegeben, die Graffiti rot; Prüfbilder `docs/rooms/k2_orte_*`): In der Jade Row ist das Bild ein zweites Mal gemalt, mit dunklen Fenstern, zugemachter Tür, ohne das Licht des Ladens und mit rohen Brettern quer davor; nur was davon abweicht, liegt bei `k1b=sold` als `jade_row_bretter` über dem Bild (mit dem Zittern der nassen Straße), und die drei Lampen des Ladens gehen aus (`shopLamps`). `WHO TALKED?` steht rot an der Wand des Durchgangs im Torbogen (`jade_row_tag`, bei `k1b=warned`, mit einer Zeile beim Ansehen). `cam07v` zeigt nach dem Überfall den Laden dunkel, halb leer und ohne Kasse (`okonkwo_shop_dunkel`, `okonkwo_shop_counter_dunkel`), davor nah und hell die Bretter (`okonkwo_shop_bretter`); Kasse und Regale haben eigene Zeilen. `GLASSER LIES` steht rot auf Junos Tür, jeder Buchstabe aufrecht, die Zeilen steigen mit der Wand wie NINTH LIVE daneben (`kessel_14_glasser`). In `cam03` steht von Samstag bis Montag von 19:00 bis 23:00 eine Pendlerin am Automaten (`k2_automat`, die Figur `commuter_d`). In `cam22` dampft am Samstag die Schale auf Ines' Platz (`cam22_schale`), in `cam30` hängt ab Samstag das Band (`cam30_tape`), und am Denkmal in der Gasse steht ab Samstag das Papierboot mit Kerze und `I.` (`gasse_papierboot`; §7 sagt „ab Sonntag“, gebaut ist Samstag, wie die Übergabe es wollte). Bao sagt am Montag nach `k1b=sold`: „Eine Woche, sagt der Arzt. Ich sag Montag.“
Geprüft werden die Fäden wie in Kapitel 1 allein, mit geschlossenem Hauptweg
(`off_main,evi_knows`), jede Antwort aus Kapitel 1 für sich (`--set k1a=lied`; `solve-act.mjs` nimmt jetzt Werte).

**Varga (K1a, `off_varga`):**

| K1a | In Kapitel 2 |
|---|---|
| **nichts geantwortet** | Varga hat Kessler selbst gefunden (Kapitel 1, A1): ab Sonntag sitzt Kessler mit Gips auf dem Drain-Markt wie nach einem Verkauf, aber ohne Eintrag im Kassenbuch. |
| **verkauft** | Am Freitag verkauft: am Samstag in `cam15` die offene Kapsel 23 und die zerbrochene Brille (Kapitel 1, §3). Ab Sonntag sitzt Kessler mit Gips auf dem Drain-Markt neben Ratz' Stand und bettelt, von oben gezeichnet wie alle dort. Er kennt Juno nicht. Sie kann ihm 50 Chits geben oder weitergehen. Das Kassenbuch ergänzt sich selbst: „Kessler: zwei Rippen, ein Arm. Bettelt.“ |
| **gewarnt** | Sable zahlt schlechter (§3.6, „Varga redet.“). Die Postkarte an Frau Kessler kommt erst im Epilog. |
| **gelogen** | Am Samstag und Sonntag von 19:00 bis 22:00 wartet **Vargas Mann** vor der Haustür des Kessel-Blocks auf der Kowalski-Straße, im Straßenmodus. Kapitel 1 nannte das einen Feed-Moment; keine Kamera sieht die Haustür, deshalb steht er auf der Straße. „Die 200, Glasserin.“ Juno kann zahlen, sagen, dass sie es nicht hat („Dann schuldest du Varga was.“), oder an ihm vorbeigehen; er sperrt keinen Weg. Am Montag liegt ein Zettel im Briefkasten. Kessler zieht seine Nudeln jetzt woanders. Flag `ledger_varga2` = paid \| owed; Vargas Faden endet in Kapitel 2, nichts davon geht weiter. |

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

**Montieren** (`kapitel0-design` §2.4) kommt hier oder am 24h-Laden (§6.5) zum ersten Mal, je nachdem, was Juno zuerst tut: Juno nimmt aus dem Archiv einen Moment, in dem er morgens zur Schicht
geht (vom 9. Oktober), und setzt den Zeitstempel von heute davor. Frau Haldane sieht ihren Sohn heute früh zur Arbeit gehen. Es ist eine
Fälschung, wie die von Nagi·wa, und mit der am 24h-Laden eine von zweien, die Juno selbst macht; beide sind nie nötig.

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

### 6.5 Der 24h-Laden: Wer passt auf den Laden auf? (`off_shop24`)

Vom Nutzer gewählt (2026-11-18). Ein Faden ohne Voraussetzung aus Kapitel 1, offen am Samstag und Sonntag, er endet in Kapitel 2. Er
spiegelt im Kleinen, was Juno jeden Abend tut: Sie sieht durch eine Kamera, was jemand getan hat, und entscheidet, ob sie es zeigt,
verkauft oder verschweigt.

**Die Leute:** Der Mann im Lull-Schafskostüm auf der Fischermann Street ist der **Nachtverkäufer** des 24h-Ladens. Er hat zwei Jobs: Lull
bezahlt ihn fürs Flyerverteilen, die Kette (Name offen, §14) für die Kasse, und weil nachts kaum jemand kommt, steht er draußen. Er trägt
ein Lull-Pflaster, damit er in den Pausen schlafen kann, und schläft im Stehen ein; deshalb ist niemand hinter der Kasse. Jede Nacht fehlt
Ware, und die Kasse zieht sie ihm vom Lohn ab. Der **Obdachlose** mit dem Einkaufswagen voller alter Bildschirme sitzt gegenüber auf seiner Pappe.

| # | Wo | Was |
|---|---|---|
| S1 | `weg1`, das Schaf, Sa und So | Spricht Juno ihn an, wacht er auf: „Kauf was, oder lass mich schlafen.“ Dann erzählt er: Jede Nacht fehlt etwas, ein Sandwich, eine Dose, und die Kasse zieht es ihm ab. „Die Kamera hat alles gesehen. Aber die Kamera gehört der Kette, nicht mir.“ Kein Flag: Was er erzählt, braucht nichts danach. |
| S2 | `weg1`, der Putzroboter | Der Roboter gehört dem Laden. Seine Karte ist kaputt, deshalb fährt er in seiner Pfütze im Kreis und piept. Juno steckt das Taschen-Deck an seine Wartungsbuchse und setzt ihn zurück; er fährt heim zu seiner Ladestation im Laden, und über die Station ist Juno im Netz des Ladens: `cam26`, die Kamera über der Kasse, steht auf ihrer Karte (`link_cam26`). Danach fährt er die Straße ab, statt im Kreis (§7). Ohne den Roboter sagt Juno vor der Kamera: „Die hängt an keinem Netz, an das ich rankomme.“ |
| S3 | `cam26`, das Archiv der letzten Nacht | Um 02:30 schläft das Schaf draußen. Der Obdachlose kommt herein, nimmt aus dem Kühlschrank ein Sandwich, das morgen abläuft, und eine Dose, schaut einmal in die Kamera und geht. Juno nimmt den Moment in den CACHE (`cache_clip_shop24`): „Er nimmt nur, was morgen sowieso im Müll landet. Die Kasse zählt es trotzdem.“ |
| S4 | `weg1`, das Schaf, oder `sable_booth` | Die Wahl. **Zeigen:** Juno zeigt dem Schaf den Clip. Er behält seinen Lohn, die Kette lässt den Gehweg räumen, und ab dem nächsten Abend liegt dort, wo der Obdachlose saß, nur noch seine Pappe. **Montieren:** Juno legt über den Moment eine leere Schleife aus derselben Nacht (das Werkzeug wie bei Frau Haldane, §6.2) und zeigt dem Schaf, dass niemand kam: „Dann bin ich's wohl selber. Im Schlaf.“ Er zahlt weiter, der Obdachlose bleibt. **Verkaufen:** Sable kauft den Clip für die Kette (60 Chits). Er zeigt auch das Schaf, das im Dienst schläft: Ab dem nächsten Abend steht ein anderer Mann im Kostüm, und die Pappe ist leer. Kassenbuch: „24h-Laden: gezeigt.“, „24h-Laden: montiert.“ oder „24h-Laden: verkauft.“ Flag `shop24` = shown \| cut \| sold. |

Wer nichts tut, lässt den Faden offen; er endet mit dem Kapitel ohne eine Zeile. Der Zustand: `link_cam26`, `cache_clip_shop24`, das
montierte Stück wie bei Frau Haldane, `shop24` und ein Schritt für den Faden. Beim Bau kommt `off_shop24` zu den Fäden, die der Hauptweg
schließt, und der Faden wird wie die anderen für sich geprüft.

**Was das Schaf im Schlaf sieht** (nur ein Look, kein Flag): Schaut Juno das schlafende Schaf an, murmelt es: „Eine Frau in Weiß. Am
Bahnsteig. Sie geht zur Treppe.“ Juno: „Der auch.“ Es schläft auf Lull, und der Zeuge zeigt den Schläfern den Mord (§6.1), wie dem
Stammgast im LUCKY STATIC.

**Okonkwos Ware** (nur ein Look, vom Nutzer so gewählt): Nach `k1b=sold` steht im Laden ein Regal mit Okonkwos Dosen, billig, unter dem
neuen Preis noch seine Schrift. Juno: „Das sind Okonkwos Dosen. Da steht noch sein Preis drunter.“ Sonst ist es ein Regal wie die anderen.

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
| jeder Abend | `weg1` | **Die Nudelbar** öffnet um 19:00, davor steht eine Schlange von drei, vier Leuten (von oben, wie auf dem Drain-Markt). **Der Koch** hat jeden Abend einen Satz zu dem, was der Tag gebracht hat: Samstag „Tote in der alten Metro. Und keiner will was gesehen haben.“, Sonntag „Jetzt soll's ein Rollstuhl gewesen sein. Gestern war's noch keiner.“, Montag „Die in Weiß waren gestern im Lerche. Vierter Stock, sagt meine Schwester.“ |
| jeder Abend | `weg1` | **Die Straße lebt:** Passanten gehen durch (von oben), ab und zu fliegt eine Lieferdrohne über den Kabeln, das Licht des 24h-Ladens flackert. Das **Schaf** wacht hin und wieder auf und drückt Juno einen Flyer in die Hand: „Schlaf ist umsonst. Steht da drauf.“ Der Flyer ist nur ein Bild, kein Gegenstand. |
| jeder Abend | `weg1`, der Einkaufswagen | Einer der alten Bildschirme zeigt manchmal statt Rauschen für einen Takt den Flur von `cam25`. Juno: „Das ist CAM 25. Wo hat er die her?“ Nur ein Look. |
| nach S2 | `weg1` | Der **Putzroboter** fährt die Straße ab, statt in seiner Pfütze im Kreis, und piept zufrieden (§6.5). |
| immer | `weg1`, die Treppe zum Fischmarkt | Das Gitter ist zu. Wer davor steht, hört unten Wasser, ein Aggregat und ab und zu Stimmen: „Da unten ist jemand. Um die Zeit.“ Vorbereitet für später (§9.2). |

Alles hier liest nur den Tag, Flags aus Kapitel 1 und den Faden des 24h-Ladens; nichts davon setzt einen Zustand, außer Teos Besuch als Moment.

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
| `kessel_14`, `cam14` | Motte und das Backup, Frau Haldane wach an ihrer Tür; nach `k1b=lied` an Junos Tür `GLASSER LIES` (gemalt, rot); ab Abend 3 ist `cam14` aus, das rote Licht im Flur dunkel |
| `kessel_lobby` | der Briefkasten, Vargas Zettel |
| `kowalski` | Bao (oder sein leerer Platz), der Werbebildschirm und Lanterns zehn Sekunden, die halbe Reparatur mit dem Kabel, Vargas Mann, der Schatten in Weiß |
| `gasse` | der Weg zu Waschsalon und Markt, das Papierboot am Denkmal (gemalt) |
| `laundromat`, `cam23` | den Stick zurücklegen; Lantern um halb eins; der Mann in Weiß, wenn die Quiet vom Trockner weiß |
| `lucky_static` | Mei, der Fernseher an allen drei Abenden, der Stammgast, der im Schlaf redet, Frau Imai |
| `jade_row`, `cam07` | Morrows Flutwagen (Entscheidung 2), nach dem Überfall die Bretter an Okonkwos Laden, `WHO TALKED?` (beides gemalt); das **Tor am Ende** führt jetzt auf Weg_1 zum Wohnblock Lerche; `cam07` fällt aus |
| `okonkwo_shop`, `cam07v` | nach dem Überfall zu (die Tür mit Brettern, `cam07v` zeigt den leeren, dunklen Laden, gemalt); oder Okonkwos Dank |
| `drain_market` | Sable, Ratz, der Prediger, Kessler mit Gips, und das **Floß DATA 1C/GB** mit Pike, Lanterns Gehilfen, der Juno in die Sümpfe bringt (§3.5) |
| `sable_booth` | Entscheidung 2, der Blick ins Archiv des Wohnheims, die Nachricht über den anderen Glasser |
| `sims`, `dach`, `dach_sitzen`, `dach_blick` | Teo am Montag, die Regenleserin; der Blick nach oben wie in Kapitel 1 |
| `cam03` | Kessler kommt nicht mehr; am Automaten zieht jemand anderes Nummer 7 (nur Ansehen; gebaut) |
| `cam04` | Varga sitzt am Samstag um 22:30 wieder bei Yuen's, auf seinem Platz; nach `k1a=lied` redet er über die Glasserin. Kesslers Ring vom Dienstag (der Clip aus dem Prolog) ist die Aufnahme, die das Ende braucht (§8) |
| `cam15` | nach einem Verkauf am Freitag die offene Kapsel |
| `cam18` | Frau Imais Kamera am alten Fischmarkt: nur das Archiv wie in Kapitel 1, nichts Neues (Juno hat dort ihren alten Zugang) |
| `cam21` | die Klinik von außen: Ines kommt nicht mehr, die Pflegerin kommt um 19:00 zur Nachtschicht |
| `cam22` | Pho Pump: Ines' Platz an der Theke bleibt leer; der Koch stellt trotzdem eine Schale hin, am Samstag (gemalt) |
| `cam24` | der Code der Haustür (W1), am Sonntag um 20:00 die Quiet |
| `cam30` | das Absperrband am Sumpf-Abgang (gemalt) |
| `cam31` | `KEIN SIGNAL`, im Rauschen das Auge |

### 9.2 Neu im Straßenmodus

| Raum | Größe und Blick | Hauptfarbe | Ausgänge | Was darin ist |
|---|---|---|---|---|
| `klinik` | Iso, 6 x 4 m | kaltes Weiß, Lull-Cyan | Tür → `gasse` (der Steg nach Westen zur Querstraße) | Wartebank mit müden Leuten, die Aufnahme mit der Pflegerin hinter Glas, eine Kabine mit Scanner-Stuhl, Nagi·was Ring an der Wand, `SLEEP BETTER` auf einem Schirm. **Als Block** (2026-11-17, `art/rooms/klinik.map.js`, sein Kit `art/kit/klinik.kit.px.js`, `docs/rooms/klinik_blocks_x3.png`): an der linken Wand die Aufnahme, eine Theke mit Glas, dahinter die Pflegerin, vorn die Glastür zur Straße; an der rechten Wand vier verbundene Sitze unter dem Schirm, links davon der Ring, rechts die Kabine mit dem Scanner-Stuhl unter seiner Haube; eine Röhre als Wandleuchte über der Aufnahme, eine hängt über dem Raum vor den Sitzen. Das Glas reicht bis 2,15 m, damit Marits Gesicht darunter frei bleibt. Die Blöcke von Raum, Marit und den Wartenden hat der Nutzer am 2026-11-17 freigegeben. **Gemalt** am selben Tag (`docs/rooms/klinik_*`): die Fliesen mit der Matte an der Tür und den nassen Fußspuren bis zur Aufnahme, die Paneele mit Lulls blassem Cyan-Streifen, der leuchtende Ring, der Schirm mit dem Pflaster und `SLEEP BETTER` / `LULL IS FREE`, die Glastür mit `24H` und Pho Pumps Licht von gegenüber im Glas, auf der Theke vorn Nagi·was Ring, dahinter ihr Monitor und Formulare, davor ein Ständer mit Lull-Faltblättern, die Kabine mit halb zugezogenem Vorhang und Papierbahn auf dem Scanner-Stuhl; die Röhre über dem Raum hängt dicht unter der Decke |
| `lerche_flur` | Iso, ein Treppenhausflur, etwa 5 x 3 m | gelbliches Flurlicht, Grünstich | Treppe und Aufzug → `lerche_eg`, Tür 4B → `ines_wohnung` | Wohnungstüren, 4B mit dem Siegel, Schuhe vor einer Tür, die Kamera `cam25` in der Ecke. **Gemalt** (2026-11-18, auf den Linien der am selben Tag freigegebenen Blöcke; ein eigenes Kit `art/kit/lerche_flur.kit.px.js`, Prüfbilder `docs/rooms/lerche_flur_x3.png`, `lerche_flur_lift_x3.png`, `cam25_siegel_*`, die Blöcke `docs/rooms/lerche_flur_*blocks*`): Linoleum mit Maserung, auf dem Weg zu den Türen heller getreten, Absatzspuren, ein ausgedrückter Zigarettenbrand, eine Fliese am Aufzug hebt sich; am Ölsockel schwarze Schuhspuren, Kratzer von Taschen, abgeplatzte Farbe, Handgrau neben 4B; oben ein Wasserfleck aus dem Stock darüber, ein Riss, der helle Schatten eines abgenommenen Aushangs (welche Wand welche Spur hat, steht in der Map: `marks`); 4B mit Furnier, Messingschild `4B`, Spion, Klinke, Trittblech; der Zählerkasten mit zwei Zählern hinter Glas, Plombe und Warnaufkleber; der Aufzug braun mit abgeschabten Stellen, seine Anzeige zeigt das Stockwerk (`4`, im Erdgeschoss `G`). Ein älteres Haus als der Kessel, gelbliche Leimfarbe über einem olivgrünen Ölsockel, Linoleum in zwei Tönen. Angeordnet, wie der Nutzer ihn im Stadtplan gezogen hat (2026-11-18): 4 x 3 m, Ines' Wohnung östlich davon, gesehen wie `cam25` ihn sieht, aus der Südwest-Ecke nach Nordosten. An der Nordwand der Treppenschacht wie im 14. Stock des Kessel-Blocks (vom Nutzer auf dem Bild so gezeichnet): oben im Westen tritt man hinein, nach Osten zur Ecke geht es hinab, über dem oberen Lauf der Treppe im Erdgeschoss, das Kessel-Geländer an seiner Südseite; weiter nordwestlich an der Nordwand der Aufzug, der fährt (über dem im Erdgeschoss); an der Ostwand 4B (dunkel) und der Zählerkasten; 4A und 4C hat der Nutzer gestrichen. Die Röhre gelb mit Grünstich an der Nordwand. Weil die Treppe von der Kamera weg abfällt, sieht man nur die oberen Stufen. Ab Sonntag 21:00 klebt über 4B das Siegel, ein Papierstreifen mit rotem Band über dem aufgebrochenen Schloss (`lerche_flur_seal`, der Flur ein zweites Mal gebacken, nur was abweicht, im Flur und in `cam25`) |
| `ines_wohnung` | Iso, etwa 4 x 4 m | ausgeräumt, das Licht der Straße | Tür → `lerche_flur` | Matratze, leere Regale, der helle Fleck vom Rechner, der Kühlschrank mit der Serviette, das Gefrierfach, eine Pflanze, die niemand mehr gießt. **Gemalt** (2026-11-18, auf den Linien der am selben Tag freigegebenen Blöcke; ein eigenes Kit `art/kit/ines_wohnung.kit.px.js`; Prüfbilder `docs/rooms/ines_wohnung_x3.png`, `ines_wohnung_mitte_x3.png`, `ines_wohnung_balkon_*`, `look_balkon_x3.png`; die Blöcke `docs/rooms/ines_wohnung_blocks_*`, `ines_wohnung_balkon_blocks_*`, `ines_wohnung_ganz_blocks_x2.png`): Dielen in eigenen Tönen, Papiere mit Druckzeilen, die nassen Stiefelspuren von der Tür, der Ring eines Topfs an der Pflanze; ein Bilderhaken ohne Bild, der Lichtschalter, ein Haarriss über der Tür, Feuchte in der Balkonecke; die leeren Haken der Gardinenstange; der Kühlschrank vergilbt mit Rost am Fuß, das Regal mit den Staubrändern dessen, was dort stand, die Matratze gesteppt, das Bettzeug mit Kissen am Boden, der Sessel mit Falten und hellgewetzten Lehnen, die Bogenlampe auf Marmor, zwei gefallene gelbe Blätter, der Basilikum mit weißen Blüten; der Ausblick hinter dem Balkon und das Look-Bild `look_balkon` (`art/ui/look_balkon.px.js`, 192 x 108, der freigegebene Block in 0,6 seiner Größe, mit Regen, wie `look_strasse` im Rahmen der Oberfläche) zeigen dasselbe. Vom Nutzer gewählt **„beides gemischt“**, eine schlichte Wohnung im Neunten mit wenigen guten Dingen, die zeigen, dass sie Geld hatte; **größer als ein Bildschirm** (8 x 4,5 m, 432 x 270 px, sie scrollt) und **mit Balkon** (vom Nutzer gewünscht). Keine Lampe, nur das kalte Licht der Straße durch zwei Fenster und ein Strich vom Flur unter der Tür. Hinten in der Ecke der alte weiße Kühlschrank (Gefrierfach oben, die Serviette unter einem Magneten) und eine kurze Küchenzeile mit einer Espressomaschine aus Chrom; ein Regal aus echtem Holz, leer bis auf eine Tasse; unter dem ersten Fenster ein niedriges Bett aus Eiche, das Bettzeug daneben auf dem Boden; vor dem zweiten ein abgewetzter Ledersessel mit einer Bogenlampe, eine große Pflanze in einem glasierten Topf, die hängen lässt; in der Mitte ein guter roter Teppich; an der linken Wand das helle Viereck im Staub, wo der Rechner stand, die Kabel an der Steckdose abgeschnitten, ein ergonomischer Bürostuhl davor; Papiere, ein umgekippter Karton, hellere Flecken an den Wänden; die Tür mit dem herausgebrochenen Schloss. Rechts durch die Glastür in der Trennwand der **Balkon**: nasse Fliesen, ein Geländer, ein Klappstuhl, zwei Töpfe Kräuter; über dem Geländer der Blick über die Dächer aufs Wasser und den Sumpf, darin zwei grüne Lichter (Lanterns Antennen, noch weiß es keiner). Schaut Juno übers Geländer, kommt ein eigenes Bild (`look_balkon`, gemalt auf dem Block `art/test/ines_balkon_blick_blocks.px.js`, `docs/rooms/ines_balkon_blick_blocks_x3.png`) |
| `sumpf` | eine feste Bühne von der Seite (320x180) wie die Fahrt davor; Juno steht auf dem Floß (entschieden 2026-11-16) | Nacht, Regen, der Schein der Krone von oben, Lanterns Grün an den Antennen | Floß → `drain_market`, Wohnwagen → `lantern_versteck` | der ertrunkene Wald zwischen den Hausfronten bis zum ersten Stock im Wasser, Stämme, Moos, Wasserlinsen, das Kabel, der Wohnwagen auf Pontons |
| `lantern_versteck` | Iso, der Wohnwagen von innen (entschieden 2026-11-16), 10 Kacheln (5 m) lang und 5 (2,5 m) breit (vom Nutzer so angeordnet 2026-11-16): hinten das Bett an der linken Wand, darüber sein eigenes Plakat gegen Lull, farbig und leuchtend (vom Nutzer gewünscht 2026-11-16): WAKE UP! in Neon, ein Neonrahmen, der ab und zu stottert, eine kleine grüne Laterne, und unten läuft eine LED-Laufschrift durch (STAY AWAKE +++ LULL LIES +++ LANTERN 87.6 +++ WAKE UP, NINTH); an der langen Seitenwand die Küche mit dem Fenster nach draußen und der Kühlschrank, dann seine Monitore mit dem Deck und das Rack der Sender; vorn rechts die Tür zur Fahrerkabine, nur angedeutet (zu, man kommt nicht hin); die Schiebetür nach draußen vorn in der Mitte, ebenso angedeutet (beide durch ihre Schwelle in der gekappten Wand); ein großes Fenster, durch das man den Sumpf grün sieht; chaotisch und dreckig (vom Nutzer gewünscht 2026-11-16): Flecken am Boden, Schmutz und Wasserflecken an den Wänden, Zettel, ein Pizzakarton, Dosen, ein Kabel, Kassetten am Boden, ein Stapel alter Zeitschriften, ein Monitor auf einer Kiste VHS-Kassetten, sein Kühlschrank voller Aufkleber und Magnete (ein Lull-Pflaster durchgestrichen); Lantern an seinem Sender (gemalt 2026-11-16) | Grün und Bernstein, Bildschirme | Tür → `sumpf` | der Wohnwagen auf Pontons von innen, Antennen, Bildschirme mit Kameras, die keiner mehr kennt, der Sender |

**Der Weg dorthin** (seit 2026-11-18 nach dem Stadtplan des Nutzers): Das Tor am Ende der Jade Row führt auf Weg_1 (`weg1`, von oben)
und dort durch die Haustür ins Erdgeschoss des Wohnblocks Lerche (`lerche_eg`); die Klinik liegt an der Querstraße, Juno erreicht sie
über den Steg, der aus der Gasse nach Westen aus dem Bild läuft. Die Querstraße selbst wird nicht begehbar (dort sehen `cam21` und
`cam22` hin): Juno betritt die Klinik von innen. Vorher führte das Tor mit einer Auswahl zu beiden.

**Neu als Entwurf (2026-11-18, vom Nutzer gewünscht):** Der Nutzer hat im Stadtplan die Straße **Weg_1** gezogen: vom Tor der Jade Row
nach Norden, dann nach Westen am Wohnblock Lerche vorbei bis zum Alten Fischmarkt. Sie wird ein Raum **von oben** wie der Drain-Markt
(etwa 40 px je Meter, Juno 13 px breit; Block `art/test/weg1_blocks.px.js`, `docs/rooms/weg1_blocks_1x.png`, mit den Laufflächen und den
Bildschirmen `weg1_blocks_lauf_1x.png`): schmutzig, nass, Neon über den Gehwegen mit ihren Lichtpfützen, Kabel mit Laternen quer über
der Straße. Nummeriert: (1) die Treppe hinab zum Fischmarkt, (2) die Haustür des Wohnblocks Lerche mit Vordach, Zahlenfeld und
Klingelkamera (`cam24`), (3) eine Nudelbar mit Markise, (4) ein Obdachloser auf Pappe vor einem geschlossenen Laden, sein Einkaufswagen
voller alter Bildschirme, einer zeigt noch Rauschen, (5) zum Lachen: Lulls Maskottchen, ein Mann im großen Schafskostüm, der im Stehen
schläft, seine Flyer um ihn auf dem Boden, (6) ebenfalls zum Lachen: ein Putzroboter, der in einer Pfütze im Kreis fährt und piept,
(7) Dampf aus einem Gully, (8) Müllsäcke, (9) das Tor zur Jade Row am Fuß des Arms. Dazu das **Erdgeschoss** des Wohnblocks als Iso-Raum
`lerche_eg` (Block, `docs/rooms/lerche_eg_blocks_*`), nach dem Plan des Nutzers und seiner Wahl (2026-11-18) über das ganze Haus,
8,5 x 4 m (nach Süden einen Meter tiefer, vom Nutzer gewünscht, damit die Treppe nicht vor der Wand endet), gesehen aus Südosten: an der Nordwand weit im Nordwesten der Aufzug, der fährt, im Nordosten des Flurteils die Treppe nach
oben, die der Lobby des Kessel-Blocks in ihren Maßen (vom Nutzer so gewünscht: was ähnlich ist, wird wiederverwendet), östlich davon unter
Ines' Wohnung die Briefkästen (4B mit rotem Band überklebt, eine Klappe hängt offen, Flyer darin), das Brett und die Flyer der Kessel-Lobby, darüber NINTH LIVE in Neon (das
aus dem 14. Stock), ein Spielautomat SUMP RUNNER statt des Fahrrads (vom Nutzer gewünscht: man soll ihn wirklich spielen können, ein
Minispiel; gebaut auf Blöcken, siehe unten), an der Westwand Lulls Schirm aus der Klinik, der Kinderwagen von 4C; die Haustür in der Südost-Ecke als Lücke in der vorderen Wand, das Neon
von Weg_1 fällt herein, nasse Fußspuren von dort zur Treppe. Juno kann Treppe oder Aufzug nehmen; beide stehen oben im Flur an derselben
Stelle. Auf Weg_1 nimmt der Wohnblock die ganze Nordseite ein, seine Haustür liegt dort, wo der Arm zur Jade Row abbiegt. Die Blöcke hat der Nutzer am 2026-11-18 freigegeben, Lull-Schaf und Putzroboter bleiben beide.
**SUMP RUNNER** (vom Nutzer entschieden, 2026-11-18; `game/sump_runner.js`, auf Blöcken in Code gezeichnet, gemalt wird nach der
Freigabe): Mottes Spiel als Automat. Ein Haus im Schnitt, seine Rohre auf einem Raster von 9 x 10 Feldern; die Kabelratte kriecht mit
jedem Zug ein Feld weiter und zieht das Kabel hinter sich her, das sie nicht kreuzen kann, nur zurückspulen, indem sie darauf
zurücktritt. Mit jedem Zug steigt unten das Wasser ein Stück; an der Lampe oben geht das Licht an, im Seitenfeld leuchtet ein Fenster
des Hauses auf, und im nächsten Haus kommt das Wasser schneller (aber nie so schnell, dass ein einziger Schritt daneben schon ertränkt).
Funken in den Seitenrohren bringen Punkte und kosten Züge. Drei Leben. Alles in Zügen, nie auf Zeit: ein Klick aufs Raster ist ein
Schritt dorthin, dazu die vier Pfeile am Bedienfeld (für den Controller) und die Pfeiltasten. Ein eigener Bildschirm wie das
Funkgerät (`sump_runner`): der Bildschirm des Automaten füllt das Bild, darüber das Marquee, darunter das Bedienfeld mit START und
EXIT. Gratis (der Münzschlitz klemmt) und ohne Flag; Junos bester Lauf ist eine Ansicht (`sump_best`) auf der Highscore-Tafel unter
MOTTE (6400), LIL, BAO und K9. Die Schrift auf dem Schirm ist die der Stadt (Englisch).
Das Erdgeschoss ist **gemalt** (2026-11-18, auf den freigegebenen Blöcken; `art/kit/lerche_eg.kit.px.js`, Prüfbilder `docs/rooms/lerche_eg_x3.png`, `lerche_eg_nw_x3.png`): Terrazzo mit Steinsplittern und matten Messingleisten, ein Riss über zwei Felder, die nassen Fußspuren von der Tür und die Pfütze mit dem Magenta von Weg_1; Wände, Sockel und Aufzug wie oben (die Anzeige zeigt `G`); der Kinderwagen mit einer Strickdecke über der Seite; der Automat zeigt auf seinem Schirm das Wartebild des Spiels (Rohre, das Kabel klettert, das Wasser steigt), die Münzklappe mit ihrem Schlitz.
Weg_1 spielt als Raum `weg1` vorerst auf seinem Block (`art/rooms/weg1.px.js`), Juno von oben. Die Straße heißt
**Fischermann Street** (vom Nutzer benannt, 2026-11-18). An ihrer Südseite liegt jetzt ein **24h-Laden** (vom Nutzer gewünscht): von
außen ein weißes Vordach mit `24H` und sein Licht über Gehweg und Straße, von innen der Raum `shop24` als Block (`art/rooms/shop24.map.js`,
`docs/rooms/shop24_blocks_x3.png`, gemalt wird später): die Glasfront zur Straße mit dem `24H` von hinten, zwei Regalreihen, eine Wand voller
Kühlschränke, die Kasse an der Tür, niemand dahinter. Dort spielt der Nebenfaden „Wer passt auf den Laden auf?“ (§6.5). Der Fischmarkt bleibt zu (vom Nutzer:
vielleicht später, mit einem Nebenquest oder wenn die Story ihn braucht); durchs Gitter hört man schon, dass unten jemand ist (§7).
**Das Leben auf der Fischermann Street** (vom Nutzer gewählt, 2026-11-18): Was dort jeden Abend geschieht, steht in §7 (die Nudelbar und
ihr Koch, die Passanten, die Drohne, das Schaf mit seinen Flyern, die Bildschirme im Einkaufswagen, der Putzroboter, die Treppe zum
Fischmarkt); der Laden, das Schaf, der Obdachlose und der Roboter tragen den Nebenfaden §6.5. Neu zu zeichnen, erst als Blöcke: im Laden die
Kamera über der Kasse, die Ladestation des Roboters und das Regal mit Okonkwos Dosen; `cam26`; auf der Straße die Schlange vor der
Nudelbar, Passanten und Drohne von oben, der Roboter auf seiner Runde, die leere Pappe und ein zweites Schaf.

### 9.3 Neue Kameras

| Kamera | Ort | Blick | Besonderheit |
|---|---|---|---|
| `cam25` | Wohnblock Lerche, Flur im 4. Stock | das Iso-Bild von `lerche_flur` unter dem Feed-Filter (ein Ort, ein Bild, wie `cam14`) | verbunden mit `cam24`; zeigt, wann der Flur frei ist |
| `cam26` | der 24h-Laden, über der Kasse | das Iso-Bild von `shop24` unter dem Feed-Filter (ein Ort, ein Bild) | verbunden über die Ladestation des Putzroboters (§6.5); live und das Archiv der letzten Nacht |
| `cam51` | Wohnheim 5-Süd im Fünften, der Schlafsaal | Reihen von Kojen, Wäsche, ein Fenster ohne Himmel; die Sicht, die am besten passt (Style Guide), Vorschlag: frontal auf eine Kojenwand | **nur im Archiv**, von Sable; das Feed-Bild bekommt zum ersten Mal die weißen Träger als kleine Feed-Figuren (in Kapitel 1 nur Nahaufnahme und Stimmen, story §10b) |

### 9.4 Für den Stadtplan (nur Vorschläge, nichts Bestehendes geändert)

Neue Einträge für `docs/plan/stadtplan.js`, wenn der Nutzer sie will: die Klinik 9-Ost von innen (am vorgeschlagenen Ort der Klinik,
an der Querstraße am Westende), der Wohnblock Lerche mit Treppenhaus und 4B (dort, wo `cam24` hängt), der Weg vom Tor der Jade Row
dorthin, die Sümpfe am Rand, wohin der Kanal des Drain-Markts führt, mit Lanterns Wohnwagen. Das Wohnheim im Fünften liegt außerhalb des Plans.

## 10. Figuren

Größen wie in `kapitel0-design` §8. **Regel:** Wer etwas nur auf einer Seite trägt, bekommt für die Richtung, in der es die Seite
wechseln würde, eine eigene Ansicht (Kapitel 1, §10). Lull ist immer die ovale blasse Scheibe wie bei Teo.

| Wer | Neu oder wieder | Wo | Ansichten | Was zu beachten ist |
|---|---|---|---|---|
| **die Pflegerin an der Aufnahme** | neu | `klinik`, `cam21` (Feed) | Iso SE hinter dem Glas (sitzend), im Feed von vorn (SE, gehend): Sie kommt von links auf die Tür unter der Kamera zu, dazu der Blick zurück über die Schulter und NE von hinten | weißer Kittel wie Ines, aber kurz; kein Lull. **Marit Holm** (vom Nutzer 2026-11-17), Sprecherfarbe Lila `#c8b0e0` (Style Guide §8). Als Block (2026-11-17, `art/test/klinik_figuren_blocks.px.js`, `docs/characters/klinik_figuren_blocks_x4.png`): Mitte vierzig, aschblonder Knoten, kleine Brille, der kurze Kittel bis zur Hüfte, darunter lila Schwesternkleidung (ihre Farbe), ein Namensschild. Im Raum ist sie eine Requisite wie der Schläfer im Waschsalon, denn so liegt sie sicher hinter der Theke. **Gemalt** (2026-11-17) in `art/characters/klinik.px.js` (`marit_sit`, sie blinzelt; die zwei Stifte in der Brusttasche, das Namensschild, die lila Haarschleife) und im Feed in `art/characters/feed_people.px.js` (`marit_feed_*`: von vorn gehend, von hinten, `marit_feed_look` sieht sich zweimal um); Bögen `docs/characters/klinik_figuren_x7.png`, `docs/cams/cam21_marit_*` |
| **die Quiet** (zwei im Flur, der Schatten, der Mann am Trockner) | neu | `cam25`, `cam23` (Feed), `kowalski`, `laundromat` (Iso) | Feed SE, SW, NE, NW mit Kisten; Iso SE, NE stehend (NW gespiegelt) | weiße Regenmäntel wie Ashe, die Masken überstrahlen im Feed; im Straßenmodus eine glatte weiße Maske. **Zwei Ränge** (vom Nutzer entschieden 2026-11-17, Blöcke `art/test/quiet_blocks.px.js`, `docs/characters/quiet_blocks_x4.png`): der **Anführer** (A) im langen Gürtelmantel bis zur Wade mit hochgeschlagenem Kragen wie Ashe, die ovale Maske mit zwei Augenschlitzen, kurzes dunkles Haar, ein rotes Licht am linken Revers; er ist namenlos, nicht Ashe. Die **Untergebenen** (B) im Mantel bis zum Knie mit enger weißer Kapuze und weißen Handschuhen, die glatte Maske mit einer dünnen roten Linie über den Augen. Wie viele wo: der Schatten erst einer (B), am Montag der Anführer mit zwei (B); am Trockner einer (B). Das Licht am Revers zeigt sich nur von vorn: NW ist NE gespiegelt, SW bräuchte eine eigene Ansicht (er sieht nie nach SW). **Ihr Weiß leuchtet** (vom Nutzer entschieden 2026-11-17): Mantel und Maske nehmen das Licht des Raums nicht an, so sind sie das einzige Saubere gegen die Nacht. Gemalt in `art/characters/quiet.px.js` (SE und NE stehend, ein Tropfen am Saum, das rote Licht); **Platzhalter:** die zwei in `cam25` sind noch Ashes Feed-Figur, denn sie gehen und tragen Kisten |
| **Lantern** (persönlich) | neu in Iso (der Wohnwagen ist ein Iso-Raum, entschieden 2026-11-16) | `lantern_versteck` | Iso sitzend im Rollstuhl an seinem Sender, eine Richtung, mit kleinen Bewegungen: nach Südwesten zu Juno hin gedreht (vom Nutzer freigegeben 2026-11-16), gemalt in `art/characters/lantern.px.js` | das Gesicht aus `docs/portraits/lantern_x4.png` (grüner Iro, das Okular über **einem** Auge, Headset): Er sitzt immer gleich, so braucht er keine Gegenrichtung; das Okular sitzt auf der Seite, auf der es im Porträt sitzt |
| Lantern im Feed | wieder | `cam23` | wie in `cam31`, im Maßstab des Waschsalons | der gemalte Lantern von der Seite, beide Richtungen gezeichnet, die Räder drehen sich (story §10c, 2026-11-16) |
| **Teo, sitzend von hinten** | neu (Pose) | `dach_sitzen` | eine | neben Juno, die Kapuze unten, der Gehörschutz; von hinten sieht man das Pflaster hinter seinem Ohr, am selben Ohr wie in seinen anderen Ansichten (nicht aus einer gespiegelten Ansicht nehmen) |
| Teo mit dem Haken | neu (Pose) | `flat`, `sims` | SE, NE, NW wie seine Figur | der lange Haken aus der Pumpenhalle in einer Hand; NW gezeichnet wie bisher |
| **Vargas Mann** | neu | `kowalski` | Iso SE, NE, NW stehend | nur nach `k1a=lied`; Varga selbst ist nur im Feed gemalt. Namenlos; seine Stimme ist „der Schwere“ (vom Nutzer gewählt 2026-11-17, `dialog-style-guide` §6). **Mit einem Kraken-Mod** (vom Nutzer gewählt 2026-11-17, Weg B der Blöcke `art/test/k2_folgen_blocks.px.js`, `docs/characters/k2_folgen_blocks_x4.png`): der Kopf ein Krakenmantel mit Schlitzpupillen, Tentakel wie ein Bart über der Brust, Tentakel statt Händen, ein schwerer dunkler Ledermantel; 1,90 m, breit wie die Tür. Er trägt nichts auf einer Seite: NW ist NE gespiegelt |
| **Pike**, Lanterns Gehilfe | neu | `drain_market` (von oben), die Fahrt (von der Seite) | von oben stehend und stakend; von der Seite auf dem Floß, stakend (die Stange gehoben, gestoßen, geschoben, wieder gehoben) | umgebaut mit dem Reiher, nach dem Graureiher (vom Nutzer gewünscht 2026-11-16): lange dünne Beine, ein Mantel wie gefaltete graue Flügel mit dem Schwarz an der Schulter, ein langer weißer Hals im S mit dem schwarzen Strich vorn, ein kleiner weißer Kopf, der schwarze Strich vom Auge in den Schopf, der nach hinten hängt, ein langer orangegelber Schnabel; aufrecht und still. gemalt in `art/rooms/sumpf.px.js` (die Fahrt und die Ankunft), etwas kleiner als zuerst, damit er neben Juno (50 px) nur um Kopf und Hals größer ist; einseitig trägt er nichts, so genügt das Spiegeln. Seine Farbe ist das Orangegelb seines Schnabels, gedämpft neben Junos Gelb, `#e0a048` (vom Nutzer entschieden 2026-11-16). Von oben auf dem Markt als Block freigegeben (2026-11-16, `art/test/pike_top_blocks.px.js`): er steht am hinteren Ende seines Floßes |
| **Kessler mit Gips** | neu (von oben) | `drain_market` | von oben, sitzend | der Gips am Arm ist einseitig: von oben kein Problem, er sitzt immer gleich. Als Block (2026-11-17): auf einem platten Karton, die Beine nach vorn, der Arm in Gips in einer Schlinge vor der Brust, sein Strickschal, die Mütze für Münzen mit etwas Abstand vor seinen Füßen (vom Nutzer so gewünscht) |
| **Bao mit Verband** | Variante | `kowalski` | wie Bao | nur nach `k1b=sold`, Montag (Samstag und Sonntag fehlt sein Wagen). Als Block (2026-11-17, nach der Skizze des Nutzers): ein Band über der Stirn, das an der Seite über Ohr und Schläfe geht, die Wicklungen als graue Linien; der kahle Scheitel bleibt frei, sonst sieht es aus wie eine weiße Mütze |
| **Frau Haldane, wach an der Tür** | Variante | `kessel_14` | wie ihre Figur (SE, NE, NW) | wach, ohne Lockenwickler? Vorschlag: die Lockenwickler bleiben, die Augen offen, das Pflaster dunkel |
| **der Nachbar an der Haustür** | neu (Feed) | `cam24` | Feed SE, dazu die Nahaufnahme seiner Finger am Zahlenfeld (Zoom) | kommt jeden Abend um 19:30 heim; die Zahlen im Zoom mit der Spielschrift |
| **die Wartenden in der Klinik** | neu | `klinik` | Iso sitzend nach SW auf der Stuhlreihe an der rechten Wand, von vorn wie Lantern in seinem Wohnwagen: der Oberkörper frontal, die Oberschenkel kurz nach links unten, die Schienbeine senkrecht (vom Nutzer korrigiert 2026-11-17) | müde, Lull-Pflaster, wie die Schlange in `cam21`. Als Block (2026-11-17): ein alter Mann in grauer Strickjacke, vornübergesunken; eine Frau in Hafenjacke, den Kopf an der Wand, die Augen zu; ein junger Mann im dunklen Hoodie, die Ellbogen auf den Knien. Das Pflaster sitzt jeweils hinter dem Ohr, das zu uns zeigt (nach SW gezeichnet, nie gespiegelt). **Gemalt** (2026-11-17) in `art/characters/klinik.px.js` (`wartende_1` bis `wartende_3`, sie atmen, der alte Mann nickt ein): die Strickjacke mit Knöpfen über einem hellen Kragen, die Hafenjacke mit Reflexstreifen und Zopf, der Hoodie mit seinen Bändeln und weißen Sohlen; im Raum Requisiten auf ihren Sitzen (`Nagiwa.at.klinik.waiting`) |
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
   ├─ Klinik (optional): cam21 ─ Steg aus der Gasse ─ Aufnahme ─ „Lerche, vierter Stock“
   ├─ Lerche: cam24 19:30, der Code ─ cam25 ─ (So 20:00–21:00 die Quiet) ─ 4B ─ Serviette ─ Akte ─ EVI erfährt es
   ├─ Fälschung (So 18:00): NETZ ─ Prüfen: Zeitstempel, Regen, Licht ─ Beweis
   ├─ Lantern (So 22:00 der Schirm): halbe Reparatur ─ Kabel ─ Haken, Pikes Floß ─ Ratz, Ausweis, Endstufe ─ Pike ─ die Fahrt ─ der Wohnwagen
   │      └─ der Schatten in Weiß (19:00–23:00), wenn die Quiet Juno kennt
   └─ Entscheidung 2: Sable │ Vesper │ Morrow (Jade Row 00:30) │ Lantern │ behalten   (das Flüstern schneiden?)
                                                                  │
 Abend 3 (Mo) ─ 18:30 Teo, das Dach ─ 00:45 die Uhr hält (Wohnung, Stick, Clip) ─ 01:00 Lantern sendet
              ─ Prüfen: Protokolle gegen Kesslers Ring ─ „Meine Nachbarn.“ ─ 03:15 BECKEN 3 ─ Kapitel 3
```

Regeln: Das Ende braucht `evi_knows`, den Stick bei Lantern und `e2`; alles andere ist frei. Die Klinik und die Fälschung sind nie nötig, aber
gut angezeigt. Wer den Stick hat und die Quiet an den Trockner bringt, muss Lantern finden; der Weg dahin steht ab Sonntag 22:00 jedem
offen. Die Nebenfäden (`off_varga`, `off_tide`, `off_imai`, `off_haldane`, `off_vesper`, `off_motte`, `off_shop24`) prüft der Solver jeden für sich
mit dem Hauptfaden (`off_main` und `know_flat` für die Fäden allein, wie in Kapitel 1).

**Der Zustand:** neu im Hauptfaden `stick_dryer`, `quiet_dryer`, `know_flat`, `code_lerche`, `cache_note_serviette`,
`cache_note_civic_rest`, `evi_knows`, `cache_clip_forgery` (bei jedem ab Sonntag 18:00, also kein Zustand für sich), `forgery_cuts` (1–2,
der Reihe nach; eine Ansicht, kein Zustand: Zustand ist erst `forgery_proven`, das der dritte Fund setzt) und `forgery_proven` mit seiner Notiz,
`know_cable`, `pike_met` (statt `stairs_open`), `lantern_found`, `led_quiet`, `e2`, `clip_ines_cut`; in den Fäden `ledger_varga2` und `ledger_kessler_alms`, `imai2`,
`haldane`, `link_cam26`, `cache_clip_shop24`, `shop24` und ein Schritt je Faden. Weiter gehen davon nur die Flags, die §2.1 nennt. Die Kameras, die ausfallen, und alles in §7 kosten nichts.

## 12. Hinweise

Die Hinweise spricht EVI (Prolog-Design §2.2). Die Tabelle nennt die schweren Stellen; beim Bau bekommt jeder Zustand einen Hinweis.

| Für | Stufe 1 | Stufe 2 | Stufe 3 |
|---|---|---|---|
| der Stick | „Du hast noch ihren Schlüssel. Lantern sucht ihn.“ | „Er schaut jede Nacht in den Trockner. Oder du findest ihn.“ | „Leg ihn in Trockner sechs zurück. Um halb eins holt er ihn.“ (Mit der Quiet am Trockner: „Lantern kommt nicht mehr, solange der da sitzt. Bring ihn ihm selbst.“) |
| W1, der Code | „Ihr Haus hat ein Zahlenfeld an der Tür.“ | „Die Klingelkamera hängt direkt daneben.“ | „Öffne CAM 24 um halb acht. Da kommt ein Nachbar heim.“ |
| W3/W4, der Flur | „Welche Tür ist ihre? Die Klinik weiß es, oder die von Civic Rest zeigen es dir.“ Dann: „Ihre Tür ist zu. Das bleibt sie nicht lange.“ | „Die von Civic Rest räumen die Wohnung aus. Schau in CAM 25.“ | „Warte, bis sie weg sind. Sonntag ab neun ist der Flur frei.“ |
| W6, die Akte | „Die haben den Rechner genommen. Ines hat auf Papier geschrieben.“ | „Wo hebt man Papier auf, das niemand finden soll?“ | „Schau ins Gefrierfach.“ |
| die Fälschung | „Das ist nicht das, was wir gesehen haben.“ | „Leg die beiden Clips nebeneinander. PRÜFEN.“ | „Schau der Reihe nach auf die Uhrzeit, den Regen und das Licht.“ (gilt nur, solange Juno die Fälschung im Editor hat) |
| L2–L5, Lantern | „Der Schirm war gekapert. Wer weiß, woher so was kommt?“ | „Der Mann auf dem Gerüst repariert den Schirm. Frag ihn.“ | „Folge dem Kabel in den Kanal des Markts.“ |
| L3, das Floß | „Das Kabel geht zu dem Floß da draußen.“ | „Es liegt zu weit weg. Mit etwas Langem käme man ran.“ | „Nimm den Haken aus der Tasche. Hast du ihn nicht, hängt er neben dem Aufzug.“ |
| L3b, Pike | „Pike will die Endstufe, und Ratz verkauft ihm nichts.“ | „Dir verkauft Ratz. Frag ihn, was er dafür will.“ | „Ratz will deinen alten Ausweis, nur kurz. Der liegt im Karton unter deinem Bett, wenn du ihn nicht dabeihast.“ |
| der Schatten | „Der in Weiß steht wieder unten.“ | „Wenn er dich sieht, sieht er auch, wohin du gehst.“ | „Er geht um elf. Warte bis dahin, bevor du zu Lantern gehst.“ |
| Entscheidung 2 | „Was machst du mit dem Clip?“ | „Sable kauft, Vesper zahlt mehr, Morrow hält samstags und sonntags um halb eins in der Jade Row, Lantern ist im Sumpf.“ (am Montag ohne Morrow) | „Du kannst ihn auch behalten. Aber im Clip ist das Flüstern.“ |
| Montag, 00:45 | (je nachdem, was fehlt, eine der Zeilen aus §3.7) | | |
| S1–S4, der 24h-Laden | „Das Schaf vor dem 24h-Laden sieht aus, als hätte es Sorgen.“ | „Der Laden hat eine Kamera. Und der Putzroboter gehört zum Laden.“ | „Steck das Deck an den Roboter, dann schau ins Archiv von CAM 26.“ |
| das Ende | „Du hast doch Clips mit Uhrzeit.“ | „Leg die Protokolle neben deine Aufnahmen.“ | „Nimm Kesslers Ring. Dienstag, 22:35.“ |

## 13. Was die Engine (und das Spiel) zusätzlich braucht

Gegenüber Kapitel 1 braucht die Engine voraussichtlich **nichts Neues**: Tage, Momente, Abläufe, die stehende Uhr, `passes`, das
Archiv einer Kamera, Gegenstände an Hotspots und Fragen mit vier Antworten gibt es. Beim Bau zu prüfen:

1. **Prüfen und Montieren** im Clip-Editor sind Teil des Spiels (`game/deck.js`): zwei Clips auf zwei Zeitleisten, Stellen als
   Hotspots, ein Zähler `forgery_cuts`; Montieren als Wahl eines Moments und eines Zeitstempels. Dasselbe Prüfen dient dem Ende (die
   Protokolle als Zeitleiste ohne Bild).
2. **Eine Kamera nur im Archiv** (`cam51`): wie das Archiv von `cam18`, ohne Live-Bild.
3. **Kameras, die ausfallen**: `link_cam07` und `link_cam14` über Nacht vergessen, GLASS zeigt sie grau mit `KEIN SIGNAL` (gebaut: ein Eintrag in
   `Nagiwa.cams` kann `dead` haben, eine Bedingung, und `deadLine`, was Juno beim Klick sagt).
4. **Der gekaperte Schirm** auf der Kowalski: ein Teil des Bilds der Straße, das zu bestimmten Zeiten den Text zeigt (gesetzt mit der
   Spielschrift).
5. ~~Ein Ausgang mit Auswahl~~ (das Tor der Jade Row führt seit 2026-11-18 nur noch auf Weg_1; die Klinik hat ihren eigenen Weg).
6. Der Akt `kapitel2` mit seinem `keep` (§2.1) und `?act=kapitel2`.
7. **Der Solver über die Kapitelgrenze** (beschlossen 2026-11-14, Stufe 2 der Prüfungen): Sobald Kapitel 2 gebaut ist, löst der Solver
   es nicht nur aus einer festen Vorgeschichte, sondern aus jedem Endzustand von Kapitel 1, beschränkt auf das, was `keep` übernimmt
   (die Zahl der Varianten nennt `sh tools/handoff.sh`, im Studio der Tab Handoffs). Dafür braucht es in der Engine einen Start aus
   einer Liste von Zuständen; die Übergabe-Prüfung (`handoff.mjs`) und die Endzustände in den Graph-Daten gibt es schon.

## 14. Offen

- **Namen:** Frau Haldanes Sohn, die Quiet im Flur (vielleicht ohne Namen), der Kontakt
  `BECKEN 3` (oder `TINTE`), die Kameranummern `cam25`, `cam26` und `cam51`; der Nachtverkäufer im Schafskostüm, der Obdachlose und die
  Kette des 24h-Ladens (§6.5).
- **Zeilen:** alles, was hier steht, sind Vorschläge; Lanterns Sprechkarte ist ein Entwurf (2026-11-15), beim Durchspielen zu prüfen.
- **Preise und Zahlen:** Sable 3000, Vesper 5000, die Zuschauer, Sables Archiv 150, Kessler 50.
- **Aussehen:** Klinik, Flur, Wohnung, der Wohnwagen innen, Pike von oben auf dem Markt (dazu seine Farbe), `cam51` und alle neuen Figuren gehen erst als Blöcke zur Freigabe, ebenso
  die Änderungen an fertigen Bildern: das neue Kabel hinter dem großen Schirm, Lanterns grüner Text auf dem Schirm, das rote Licht der Kamera im 14. Stock aus.
  (Die Bretter an Okonkwos Laden und der dunkle Laden in `cam07v`, `GLASSER LIES`, `WHO TALKED?`, das Papierboot mit `I.` und das
  Absperrband an `cam30` sind gemalt, 2026-11-18, §5.)
- **Sprechkarten** im `dialog-style-guide`: Lantern und Pike stehen als Entwurf, die der Pflegerin Marit Holm und die von Vargas Mann („der Schwere“) sind gewählt (2026-11-17); es fehlt noch Frau Imai; die Karte von Frau
  Haldane ist zu ergänzen.
- **`evi_trust`** (wie offen Juno im Prolog zu EVI war) geht mit, bekommt aber erst später eine Aufgabe (vom Nutzer entschieden
  2026-11-14): vielleicht, wenn EVI erfährt, was sie ist (§3.3), oder im Finale, wenn sie richtig lesen muss (story §7, Kap. 6).
  Bis dahin meldet die Übergabe-Prüfung es als „kept for nothing“; das ist bekannt.
- **Lanterns Sender im RADIO** (vom Nutzer entschieden 2026-11-16): Sein Wohnwagen in den Sümpfen ist seine Sendestation, und auf Junos Deck ist er im RADIO der vierte Sender, LANTERN auf 87.6, sobald Juno ihn gefunden hat (`lantern_found`; beim ersten Treffen sagt er: „Wenn du mich hören willst: siebenundachtzig sechs, nachts. Kommen musst du dafür nicht.“). Vorher ist seine Zeile nur Rauschen. Nachts spricht er dort in seiner Sendestimme (ruhig, wie ein Moderator von früher, ohne Namen), am Montag kündigt er an, dass er um eins sendet, was sie ihm gegeben hat. Eine Ansicht, kein Zustand (`game/radio.js`).
  **Das Richtmikro ist gestrichen** (vom Nutzer 2026-11-15): Man hört, was nah am Mikro einer Kamera
  gesagt wird, wie bei Ines' Tod, und kein Rätsel braucht es.
