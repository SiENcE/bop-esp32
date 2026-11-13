# Kapitel 2 „Aufnahme": Design

Stand: Entwurf (2026-11-14), die Gliederung vom Nutzer freigegeben am selben Tag (story §10h). Nichts davon ist gebaut oder gemalt.
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

**Was die Entscheidungen von 2026-11-13 hier heißen** (story §10f): Der Zeuge hat Ines vor den Schläfern versteckt. Deshalb hat
Nagi·wa eine wache Glasserin gebraucht, und deshalb hat kein Schläfer sie markiert. Nach ihrem Tod versteckt er sie nicht mehr: Er
zeigt den Mord den Schläfern, Nacht für Nacht (§6, Frau Imai). Seine Uhr läuft, denn die Bereinigung ist beschlossen; davon erfährt
Juno erst in Kapitel 4.

## 2. Die drei Tage

Wie in Kapitel 1 ist ein Tag ein Abend und eine Nacht (18:00 bis 04:00), das Bett geht ab 01:00 auf, die Uhr läuft nur beim Warten,
und alle Zeiten liegen auf den 15-Minuten-Takten. Die Spieltage sind 5 bis 7 (Kapitel 1 war 2 bis 4).

| Abend | Thema | Was neu ist | Was an diesem Abend geschieht |
|---|---|---|---|
| **1 (Sa, 10.11.)** | danach | Juno kommt heim (§2.1). Im NETZ und im LUCKY STATIC: „Tote in der alten Metro.“ Frau Imai schreibt (§6.1). | Die Folgen aus Kapitel 1 treffen ein (§5). Hat Juno den Stick zurückgelegt, holt Lantern ihn um halb eins (§3.1). Um 00:30 hält Morrows Flutwagen in Jade Row. In der Nacht fällt `cam07` aus (§4). |
| **2 (So, 11.11.)** | die Lüge | Die Nachrichten zeigen die **Fälschung**: Lantern tötet Ines (§3.4). Frau Haldane wartet wach auf den Brief ihres Sohnes (§6.2). | Um 20:00 räumt die Quiet Ines' Wohnung aus, danach ist sie versiegelt (§3.3). Um 22:00 kapert Lantern den großen Schirm (§3.5). Um 00:30 hält Morrow wieder in Jade Row. In der Nacht fällt `cam14` aus. |
| **3 (Mo, 12.11.)** | Entscheidung 2 | Um 18:30 kommt Teo, und sie gehen aufs Dach (§7). | Um 00:45 hält die Uhr, bis alles bereit ist (§3.7). Um 01:00 sendet Lantern. Gegen 03:00 kommt Tintes Nachricht (§8). |

Was nicht an einen Abend gebunden ist, geht an jedem; die nächtlichen Momente wiederholen sich, wo nicht anders gesagt. Was
über Nacht vergessen wird (`Nagiwa.nights[day].passes`): die Momente des Vortags, `cam07` ab Abend 2 und `cam14` ab Abend 3 (§4).

### 2.1 Der Anfang

Kapitel 1 endet, als Juno am Deck sitzt und EVI sagt: „Er hat sie ausgeschaltet.“ Kapitel 2 beginnt am Samstag um 18:00 an ihrer
Wohnungstür (entschieden 2026-11-14, story §10h): Sie hat es in der Nacht nicht ausgehalten, ist hinausgegangen und bis in den Morgen
durch den Neunten gelaufen. Gezeigt wird das nicht, nur gesagt („Ich bin gelaufen. Irgendwann war es hell.“). Sie kommt heim, und EVI
macht etwas Normales, die festgelegte Szene (`dialog-style-guide` §8, story §10b), Wort für Wort:

> EVI: Willkommen zurück, Juno.\
> Juno: ...\
> EVI: Soll ich den Monitor heller machen?\
> Juno: Ja.\
> EVI: Er ist heller.\
> Juno: Danke.\
> EVI: Gern.

Danach ist die Wohnung wie immer, und das Kapitel ist offen. Wer `?act=kapitel2` startet, beginnt mit den Antworten des
Durchspielwegs von Kapitel 1 (wie `?act=kapitel1`, story §10d).

**Was Kapitel 1 übergibt** (`keep` des Akts): `e1` (sold | refused), `stick_ines`, `k1a`, `k1b`, `kessler_gone`, `imai_step` und
`imai_told`, `traeger`, `moth_student`, `rent`, `chits`, die Einträge im Kassenbuch (`ledger_*`), die Clips im CACHE
(`clip_ines_death` für alle, dazu `clip_traeger`, Morrows Umschlag, Kesslers Ring), die Kamerazugänge (`code_*`, `link_*`, darunter
`link_cam24`), `got_ausweis`, `got_haken`, `ladder_down`. Was Kapitel 1 nur für sich brauchte (`know_meeting`, `end_beat`, die Momente),
bleibt zurück.

## 3. Der Hauptfaden: Ines

### 3.1 Der Stick

Ines' Daten-Wallet hat Lantern, ihr Schlüssel ist der Stick aus Trockner 6 (story §10b). Am Ende muss Lantern beides haben, sonst
kann er nicht senden.

- **Lag der Stick am Freitag noch im Trockner** (`!stick_ines`), hat Lantern ihn in derselben Nacht geholt. Kapitel 2 beginnt mit
  `stick_lantern`.
- **Hat Juno ihn,** findet Lantern die Sechs leer. Er sieht jede Nacht zwischen 00:30 und 01:00 nach, in `cam23` zu sehen: ein
  Rollstuhl mit Schwimmern im grünen Licht, der vor Trockner 6 hält und wieder fährt. Juno kann den Stick anonym zurücklegen; in
  der nächsten Nacht nimmt Lantern ihn mit (`stick_lantern`). Oder sie bringt ihn ihm selbst (§3.5). Dieser Weg bleibt immer offen.
- **Die Quiet am Trockner:** Gibt Juno ihre Aufnahme **ungeschnitten** weiter (an Sable, Vesper oder Morrow, §3.6), hört Nagi·wa das
  Flüstern („SUDS & SPIN. Trockner sechs, der kaputte.“). Ab dem nächsten Takt sitzt ein Mann in Weiß im Waschsalon (`quiet_dryer`, in
  `cam23` zu sehen), und Zurücklegen geht nicht mehr: Dann bleibt nur, den Stick Lantern selbst zu bringen. Hält Lantern ihn schon,
  kommt die Quiet zu spät, und der Mann in Weiß sitzt umsonst dort. **Die Quiet bekommt den Stick nie** (story §10b).
- **Das Flüstern schneiden:** Mit dem Werkzeug Schneiden aus dem Prolog kann Juno den Moment des Flüsterns aus ihrem Clip nehmen
  (`clip_ines_cut`). Dann erfährt niemand von der Sechs. EVI fragt, bevor Juno den ganzen Clip weggibt: „Im Clip ist das Flüstern.
  Willst du, dass das jemand hört?“

### 3.2 Die Klinik (optional)

Lull-Klinik 9-Ost, die Klinik aus `cam21`, jetzt von innen (`klinik`, §9). Sie hat auch nachts offen (das NETZ von Donnerstag). Juno
geht hinein, setzt sich in die Schlange und wird als Patientin aufgenommen: ein kleines Gespräch mit der **Schwester an der Aufnahme**
(neue Figur, §10).

| # | Wo | Was |
|---|---|---|
| K1 | `cam21` | Ab Samstag kommt Ines um 19:00 nicht mehr heraus. Um 19:00 geht stattdessen eine Schwester nach Hause, die sich zweimal nach der Tür umsieht. |
| K2 | `klinik` | Die Aufnahme: Name, Schlafzeiten, „Haben Sie schon ein Implantat?“ Der Scanner piept: `LEGACY IMPLANT DETECTED`. Die Schwester: „Oh, ein altes Modell. Dann geht es bei Ihnen ganz leicht.“ Sie bietet Lull an: „Es kostet Sie nichts.“ (Lull ist gratis, Kapitel 1.) Juno: „Nicht heute.“ (kein Gegenstand; das Lull bekommt Juno in Kapitel 3, story §7) |
| K3 | `klinik` | Juno fragt nach Dr. Calder. Die Schwester senkt die Stimme: Ines hat nachts Protokolle geschrieben, „die keiner bestellt hat“, und sie hat nie das Netz der Klinik benutzt, alles auf Papier. Am Samstagmorgen waren Leute in Weiß da und haben ihren Spind ausgeräumt. Am Samstag: „Morgen um acht räumen sie auch ihre Wohnung. Lerche, vierter Stock.“ Am Sonntag: „Heute um acht …“, am Montag: „Gestern haben sie ihre Wohnung ausgeräumt.“ → `know_flat` |

Das ist ein Weg zu Ines' Wohnung, nicht der einzige: Wer die Klinik auslässt, sieht die Quiet am Sonntag in `cam25` die Tür 4B öffnen
(§3.3). Die Klinik erzählt, wer Ines war, und legt Kapitel 3 an: Juno weiß jetzt, wo es Lull gibt und dass ihr altes Implantat dazu passt.

### 3.3 Ines' Wohnung

Wohnblock Lerche, vierter Stock, Tür 4B. Story §7: ein Einbruch im Straßenmodus, gelenkt durch den Feed.

| # | Wo | Was | Flags / Dinge |
|---|---|---|---|
| W1 | `cam24` | Die Haustür hat ein Zahlenfeld gleich neben der Klingelkamera. Jeden Abend um 19:30 tippt ein Nachbar den Code, und das Fischauge sieht seine Finger aus nächster Nähe (Zoom; verpasst: der Puffer). Die Zahlen werden mit der Spielschrift gesetzt (`art/lib/text.js`). | `code_lerche` |
| W2 | `jade_row`, Tor | Am Ende der Jade Row führt das Tor unter dem Lull-Schirm nach Westen, in das Viertel der Klinik. Ein Klick fragt, wohin: „Zur Klinik.“, „Zum Wohnblock Lerche.“, „Zurück.“ Ohne den Code: „Die Haustür hat ein Zahlenfeld. Den Code hab ich nicht.“ | — |
| W3 | `cam25` | Der Flur im vierten Stock, das Iso-Bild von `lerche_flur` unter dem Feed-Filter (ein Ort, ein Bild). Derselbe Hauszugang wie `cam24`, also verbunden, sobald `cam24` es ist. Am Sonntag um 19:45 kommen zwei von der Quiet in weißen Regenmänteln, öffnen 4B und tragen bis 21:00 Kisten hinaus; der Rechner geht mit. Dann kleben sie ein Siegel über die Tür. | `know_flat` (auch so) |
| W4 | `lerche_flur` | Vorher ist 4B abgeschlossen: „Abgeschlossen. Ich bin keine Einbrecherin. Jedenfalls nicht so eine.“ Von 19:45 bis 21:00 am Sonntag geht Juno nicht hinauf: „Da oben sind Stimmen. Ich warte.“ Danach hängt nur noch das Siegel `CIVIC REST – SEALED` über dem aufgebrochenen Schloss. Juno reißt es ab. | — |
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

**Woher das Bild kommt:** aus der Live-Übertragung an WREN, die nur Bild war (story §10b). Hat Juno gesendet, ist es ihr eigenes Bild.
Hat sie sich geweigert, ist es das des anderen Glassers, der WRENs Auftrag übernommen hat (story §9). In beiden Fällen ist die
Fälschung **stumm**; Junos Aufnahme hat den Ton des Mikros neben Ines. Juno, wenn sie gesendet hat: „Das ist mein Bild. Die haben mein
Bild genommen.“

**Das Rätsel am Schreibtisch** (Prüfen, `kapitel0-design` §2.4): Juno legt `clip_forgery` neben `clip_ines_death` (oder den Puffer).
Beide laufen auf zwei Zeitleisten untereinander, und Juno findet drei Stellen, jede mit einem Klick auf die Zeitleiste und einem auf
die Stelle im Bild. Keine Fingerfertigkeit, keine Zeit; ein falscher Klick kostet nichts.

| Stelle | Was man sieht |
|---|---|
| der Zeitstempel | Bei 23:02:58 springt die Fälschung auf 23:03:10; zwölf Sekunden fehlen, genau die, in denen Ashe aus dem Schatten tritt. |
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
| L3 | `drain_market` | Die Treppe hinab, die Kapitel 1 schon vorgesehen hat, führt unter den Markt. Das Kabel läuft an ihrem Geländer mit. | — |
| L4 | `sumpf` | Die überfluteten Straßen der alten Stadt (story §3): Stege, Hausfronten bis zum ersten Stock im Wasser, das Kabel an einer Wand. Der Steg endet am Wasser; drüben treibt ein Floß an einem Seil, zu weit weg. Mit dem **Haken** (der Notschlüssel vom Aufzug, aus Kapitel 1; wer ihn nicht hat, findet ihn noch neben der Aufzugtür) zieht Juno es heran. „Teo hätte das mit einer Hand gemacht.“ | — |
| L5 | `lantern_versteck` | Am Ende des Kabels ein halb versunkener Laden, voller Antennen und Bildschirme. Lantern in seinem Rollstuhl. Er siezt sie, bricht Sätze ab und will wissen, woher sie kommt. Was Juno ihm sagen kann, ist ein Gespräch mit höchstens vier Antworten (`Nagiwa.talkTree`): „Ich hab gesehen, was passiert ist.“, „Ich hab ihren Schlüssel.“ (wenn sie den Stick hat), „Ich hab eine Aufnahme.“ (Entscheidung 2, §3.6), „Ich geh wieder.“ | `lantern_found` |

**Lantern** (Vorschläge; die Stimme fehlt noch im Style Guide): „Wer sind Sie? Nein. Sagen Sie's nicht.“ Beim Stick: „Sie hat gesagt,
sonst weiß es keiner.“ Juno: „Sie konnte mich nicht sehen.“ Gibt Juno ihm den Stick, `stick_lantern`, und er sagt, wann er sendet:
„Montag. Um eins. Bis dahin stehen die Sender.“ Wird Lantern ihr Verbündeter (Stick oder Clip), wechseln beide zum Du (Style Guide §5).

**Der Schatten:** Weiß die Quiet, wer Juno ist (nach `e1=sold`, oder sobald sie den Clip an Sable, Vesper oder Morrow gegeben hat),
steht ab dem nächsten Abend jemand in Weiß auf der Kowalski-Straße, von 19:00 bis 23:00, gegenüber ihrer Haustür (§4). Wer in dieser
Zeit zu Lantern geht, führt die Quiet zu ihm (`led_quiet`; in Kapitel 4 stirbt Lantern dann, story §7). Das ist keine Sperre, aber der
Spieler weiß es vorher: Auf dem Weg in die Gasse sagt EVI: „Der in Weiß schaut uns nach.“ Vor 19:00 oder nach 23:00 ist die Straße frei.

### 3.6 Entscheidung 2: der Clip

Die große Entscheidung des Kapitels (story §7). Sie geht ab Samstag; spätestens am Montag um 00:45 fragt das Spiel (§3.7). Jeder Weg
kann den ganzen Clip oder den ohne das Flüstern nehmen (§3.1).

| Wahl | Wo | Was geschieht | Kassenbuch |
|---|---|---|---|
| **An Sable verkaufen** | `sable_booth` | 3000 Chits; mit `forgery_proven` 4000 („Mit Beweis kostet's mehr. Auch beim Käufer.“); nach `k1a=warned` je 1000 weniger („Varga redet.“). Sable verkauft ihn an Nagi·wa weiter, und er verschwindet. Sable steht in Junos Schuld und verrät sie in Kapitel 4. | „Sable: die Aufnahme aus CAM 31. 3000.“ |
| **An Vesper verkaufen** | CHAT | Vesper bietet das Meiste, 5000 („Das ist das Echteste, was ich je gesehen habe.“). Der Clip läuft eine Nacht auf NINTH LIVE, dann kauft Nagi·wa ihn auf, und er ist weg wie bei Sable (entschieden 2026-11-14). Anonymisiert nimmt Vesper ihn nicht. Sable steht danach in keiner Schuld. | „Vesper: Ines Calder, CAM 31. 5000.“ und am nächsten Abend die Zuschauer: 1.240.000 |
| **Morrow geben** | `jade_row`, Sa und So 00:30 | Ihr Flutwagen hält, wie in Kapitel 1; Juno geht hin (entschieden 2026-11-14: kein Revier 9 als Raum). Morrow, knapp: „Beweisstück. Kein Geschäft. Ich kümmer mich.“ Der Clip verschwindet im Revier 9, und Juno ist markiert (die Quiet weiß jetzt, wer sie ist). Morrow kennt Juno jetzt. Mit `forgery_proven`: „Dann jagen wir den Falschen.“ | „Morrow: die Aufnahme. 0.“ |
| **Lantern bringen** | `lantern_versteck` | nur mit `lantern_found`. Lantern wird ein Verbündeter. Er sendet den Clip am Montag mit den Protokollen, zu früh: Dem gejagten „Mörder“ glauben nur wenige, und er wird noch härter gejagt. Mit `forgery_proven` sendet er die zerschnittene Fälschung mit. | „Lantern: die Aufnahme. 0.“ |
| **Behalten** | — | jetzt die sicherste Wahl; niemand weiß davon. Juno ist allein, und das Kassenbuch vergisst nicht. | „CAM 31: behalten.“ |

Flag: `e2` = sable | vesper | morrow | lantern | kept. In Kapitel 2 haben Sable und Vesper dieselben Folgen; für Kapitel 4 zählt, wer
gekauft hat (Sables Verrat).

### 3.7 Montag, 00:45

Um 00:45 hält die Uhr, wie am Freitag in Kapitel 1, bis drei Dinge erfüllt sind:

1. Juno war in Ines' Wohnung (`evi_knows`). Sonst: „Ich weiß immer noch nicht, wer sie war.“
2. Lantern hat den Stick (`stick_lantern`). Sonst: „Ich hab noch ihren Schlüssel. Ohne den ist alles umsonst.“ Liegt der Stick wieder
   im Trockner, holt Lantern ihn sofort, die Uhr steht ja in seinem Fenster.
3. Entscheidung 2 ist gefallen. Sonst fragt das Deck selbst, mit allen Wegen, die noch offen sind, und „Behalten.“ unter ihnen.

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

Kein Flag außer dem Wissen, das die Quiet schon hat: Die Kameras gehen über Nacht (`passes`), der Schatten liest `e1` und `e2`. In
Kapitel 3 stürmt die Quiet den Block (story §7).

## 5. Was aus Kapitel 1 nachkommt

Jede Folge liest nur Flags aus Kapitel 1 und den Tag; die Fäden bleiben getrennt (`off_varga`, `off_tide`).

**Varga (K1a, `off_varga`):**

| K1a | In Kapitel 2 |
|---|---|
| **verkauft** | Am Freitag verkauft: am Samstag in `cam15` die offene Kapsel 23 und die zerbrochene Brille (Kapitel 1, §3). Ab Sonntag sitzt Kessler mit Gips auf dem Drain-Markt neben Ratz' Stand und bettelt, von oben gezeichnet wie alle dort. Er kennt Juno nicht. Sie kann ihm 50 Chits geben oder weitergehen. Das Kassenbuch ergänzt sich selbst: „Kessler: zwei Rippen, ein Arm. Bettelt.“ |
| **gewarnt** | Sable zahlt schlechter (§3.6, „Varga redet.“). Die Postkarte an Frau Kessler kommt erst im Epilog. |
| **gelogen** | Am Samstag und Sonntag von 19:00 bis 22:00 wartet **Vargas Mann** vor der Haustür des Kessel-Blocks auf der Kowalski-Straße, im Straßenmodus. Kapitel 1 nannte das einen Feed-Moment; keine Kamera sieht die Haustür, deshalb steht er auf der Straße. „Die 200, Glasserin.“ Juno kann zahlen, sagen, dass sie es nicht hat („Dann schuldest du Varga was.“, für Kapitel 4), oder an ihm vorbeigehen; er sperrt keinen Weg. Am Montag liegt ein Zettel im Briefkasten. Flag `varga2` = paid \| owed. |

**Der Eckladen (K1b, `off_tide`):**

| K1b | In Kapitel 2 |
|---|---|
| **verkauft** | Samstagnacht um 01:30 der Überfall, in `cam07` und `cam07v` zu sehen: Drei Jungen gehen in den Laden, der Tresor geht auf, Bao kommt aus der Kowalski gelaufen und fällt. Ab Sonntag ist Okonkwos Laden mit Brettern zu, und Baos Wagen fehlt. Am Montag steht Bao trotzdem da, mit Verband: „Eine Woche, sagt der Arzt. Ich sag Montag.“ Kassenbuch: „Okonkwo: ausgeraubt. Bao: Gehirnerschütterung.“ (Kapitel 1, §4) |
| **falscher Code** | Samstagnacht scheitern die Jungen am Tresor. Am Sonntag steht an Junos Tür `GLASSER LIES`. Die Tidewater Boys sind von da an Feinde. |
| **gewarnt** | Okonkwo grüßt sie wie einen Gast. In der Jade Row steht ab Sonntag an der Wand `WHO TALKED?`: Die Boys suchen den Verräter. |

**WREN:** Nach `e1=sold` ist WRENs Kontakt am Samstag gelöscht (`KONTAKT GELÖSCHT`); die Chits bleiben. Nach `e1=refused` schreibt
sich das Kassenbuch am Samstag die Zeile dazu, die Kapitel 1 angekündigt hat: „WREN hat es von jemand anderem.“

**Die Miete:** Hat Teo sie bezahlt (`rent=teo`), sagt Juno es ihm am Montag (§7).

**Frau Kessler** schreibt in Kapitel 2 nicht mehr; ihr Faden geht im Epilog weiter.

## 6. Die Nebenfäden

### 6.1 Frau Imai (`off_imai`)

Nur, wenn Juno ihr in Kapitel 1 geantwortet hat (`imai_step=3`); sonst bleibt der Faden zu.

| # | Wo | Was |
|---|---|---|
| I1 | CHAT, Samstag | „Ich hab wieder was gesehen. Eine Frau auf einem Bahnsteig.“ (Kapitel 1, §7) |
| I2 | `lucky_static`, Sa und So 20:00–23:00 | An ihrem kleinen Tisch: Wasser bis zur Kante, eine Frau in Weiß, ein Mann in Weiß, der aus dem Schatten kommt. „Er hat hochgeschaut. Zu mir.“ Und: „Ich hab es dreimal gesehen. Immer um drei.“ Sie hat es nicht live gesehen, sondern danach, im Schlaf, wieder und wieder. Nach `imai_told=truth` hat sie kaum geschlafen und es trotzdem gesehen („Ich hab nur kurz die Augen zugemacht.“); nach `imai_told=dream`: „Sie haben gesagt, es war ein Traum.“ |
| I3 | dort | Die Wahl: „Ich hab es auch gesehen. Es ist wirklich passiert.“ oder „Das war ein Traum.“ Kassenbuch: „Frau Imai: die Wahrheit, zum zweiten Mal.“ oder „Frau Imai: wieder ein Traum.“ Flag `imai2`. |

**Warum sie es gesehen hat** (entschieden 2026-11-14, story §10h): `cam31` versteht nur das alte Protokoll, und der Zeuge hatte Ines
vor den Schläfern versteckt. Nach ihrem Tod zeigt er den Mord den Schläfern, jede Nacht um drei. Das ist das erste Zeichen, dass er
handelt. Andere merken es auch, ohne dass ein Faden daran hängt (§7): der schlafende Stammgast im LUCKY STATIC, der Prediger.

### 6.2 Frau Haldanes Sohn (`off_haldane`)

Die Geschichte der Briefe ihres Sohnes (story §9), angelegt in Kapitel 1: Er schreibt jeden Sonntag aus dem Fünften, seit drei Sonntagen
nicht mehr, der letzte Brief kam am 14. Oktober.

| # | Wo | Was |
|---|---|---|
| H1 | `kessel_14`, ab Sonntag | Sonntag ist Brieftag, und Frau Haldane schläft nicht, bis er kommt: Sie sitzt wach an ihrer offenen Tür, das Pflaster hinterm Ohr dunkel. „Sonntags schlaf ich nicht. Sonntags kommt sein Brief.“ Am Montag wartet sie immer noch. Sie bittet Juno: „Du kennst dich doch mit Kameras aus. Kannst du sehen, ob es ihm gut geht?“ Sein Wohnheim: 5-Süd, im Fünften. |
| H2 | `sable_booth` | Kameras im Fünften hat Juno nicht. Sable verkauft einen Blick ins Archiv des Wohnheims: 150 Chits oder ein Clip als Shine (wie der Zugang zu `cam15` in Kapitel 1). | 
| H3 | `cam51`, nur Archiv | Der Schlafsaal des Wohnheims, Reihen von Kojen (neues Bild, §9). Sonntag, 14. Oktober, 21:00: Er schreibt auf seiner Koje einen Brief, drückt das Lull-Pflaster an und legt sich hin. Montag, 15. Oktober, 06:00: Er steht nicht auf. Um 06:30 tragen ihn zwei in Weiß hinaus, freundlich. Juno: „Ruhe-Erschöpfung. Seit vier Wochen.“ |
| H4 | `kessel_14` | Die Wahl, an ihrer Tür: **die Wahrheit** („Er schläft. Sie haben ihn auf eine Station gebracht.“), **ein montierter Clip** oder **„Ich hab nichts gefunden.“** Kassenbuch und Flag `haldane` = truth \| fake \| nothing. |

**Montieren** (`kapitel0-design` §2.4) kommt hier zum ersten Mal: Juno nimmt aus dem Archiv einen Moment, in dem er morgens zur Schicht
geht (vom 9. Oktober), und setzt den Zeitstempel von heute davor. Frau Haldane sieht ihren Sohn heute früh zur Arbeit gehen. Es ist eine
Fälschung, wie die von Nagi·wa, und die einzige, die Juno selbst macht; nie nötig.

Ihre Antworten (Vorschläge): nach der Wahrheit, nach einer langen Pause: „Dann schlaf ich auch. Dann bin ich näher bei ihm.“ (Sie meint
es, wie es der Zeuge meint, story §6.) Nach dem Clip: „Er sieht müde aus. Er sah immer müde aus.“ Nach „nichts“: „Dann warte ich
eben weiter.“ In Kapitel 3 liegt er auf der Schlafstation, und Juno kann ihn finden (Vorschlag).

### 6.3 Vesper (`off_vesper`)

Vesper kauft weiter rohe Clips wie in Kapitel 1. Was Juno ihm am Freitag verkauft hat, bekommt am Samstag seine Zuschauerzahl, die
Kapitel 1 nicht mehr geben konnte (Kapitel 1, §7). Neu zu kaufen gibt es den Überfall aus `cam07v`, wenn er geschah (300, Zuschauer am
nächsten Abend). Sein Angebot für den Mord gehört zu Entscheidung 2 und damit zum Hauptfaden (§3.6). Anonymisieren bleibt nur wach,
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
| **Montag, 18:30** | `flat` → `sims` → `dach_sitzen` | **Teos letzter Besuch, wach.** Es klopft wie in Kapitel 1. Teo ist müder als am Mittwoch, das Pflaster blinkt. Hat Bao zu, bringt er etwas von Mei. „Gehen wir rauf, Ju? Wie früher.“ Er hat einen langen Haken aus der Pumpenhalle dabei und holt die Leiter herunter, ob Juno sie schon kennt oder nicht. Oben setzen sie sich auf ihren Platz, und neben Juno ist zum ersten Mal jemand (der leere Platz aus Kapitel 1, `dach_sitzen`). Er erzählt von **Tinte**, der Krake im Filterbecken: „Tinte sagt, ich zuck im Schlaf. Wie die anderen.“ Und: „Wenn ich schlaf, ist alles still. Keine Pumpen. Keine Schulden.“ Er schläft kurz an ihrer Schulter ein, wie auf dem Foto, wacht auf und muss zur Schicht. Nach `rent=teo`: „Die Miete. Danke.“ „Hab gesagt, sag nichts.“ Eine Szene ohne Wahl. |
| Samstag | `lucky_static` | Der Fernseher: „Tote in der alten Metro. Revier 9 ermittelt.“ Der schlafende Stammgast murmelt auf seinen Armen: „Sie geht zur Treppe.“ Die Frau neben ihm: „Er redet nie im Schlaf. Nie.“ |
| Sonntag | `lucky_static` | Der Fernseher zeigt die Fälschung (§3.4). Mei schaltet nicht aus, sie schaut weg. |
| Montag | `lucky_static` | „Fahndung nach dem Piratensender LANTERN. Hinweise an Revier 9.“ Mei: „Der hat doch nie jemandem was getan. Der hat nur geredet.“ |
| jeder Abend | Deck, NETZ | Samstag die Meldung und auf dem Brett jemand, der fragt, was in Linie 31 war. L. (Kapitel 1) schreibt: „Sie sagen, er ist jetzt auf einer Station. Besuchen darf man nicht.“ Nach `traeger=filmed` und einem Verkauf an Vesper: „Jemand hat ihn gefilmt. Er war oben im Fernsehen.“ Sonntag die Fälschung, Montag die Fahndung und „Wer hat gestern den großen Schirm gesehen?“ |
| jeder Abend | `kowalski` | **Bao**, wenn er da ist: Samstag „Du warst gestern nicht da. Lou hat gefragt.“, Sonntag stellt er ihr die Schale wortlos hin, Montag „Iss. Du siehst aus wie dein Bruder.“ Der **Werbebildschirm** stottert weiter; am Sonntag um 22:00 Lanterns zehn Sekunden (§3.5). Die **halbe Reparatur** (L2). |
| jeder Abend | `dach` | **Die Regenleserin.** Samstag: „Gestern hab ich gesagt, frag mich morgen. Jetzt weißt du's selber, Kind.“ Sonntag: „Unten im Wasser wohnt einer, der hört alles mit. Der ist jetzt still.“ Montag, nach Teos Besuch: „Er hat die Leiter noch gefunden. Gut.“ |
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
| danach | Das letzte Prüfen: Juno legt die Protokolle neben ihre eigenen Aufnahmen. Eine Zeitleiste mit den Spitzen der Schläfer, darunter ihr CACHE. Die eine Aufnahme, die jeder hat, ist **Kesslers Ring** vom Dienstag (Prolog): 6.11., 22:35, und genau dort steht in den Protokollen eine Spitze, 41 Schläfer zur selben Sekunde. Das ist die Zahl auf Ines' Serviette (W5). Wer mehr hat, findet mehr: Frau Haldane in `cam14` um 02:30, Frau Imais Treppe in `cam18` am 29. Oktober um 03:12, die weißen Träger. Eine Übereinstimmung genügt. |
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
| `flat` | der Anfang (§2.1), Teos Klopfen, das Ende am Deck (§8); nach `k1b=lied` außen an der Tür `GLASSER LIES` |
| Deck | GLASS mit den grauen Kameras, NETZ, CHAT (Imai, Vesper, `BECKEN 3`), der Clip-Editor mit **Prüfen** und **Montieren**, CACHE, BUCH, RADIO mit den Nachrichten |
| `kessel_14`, `cam14` | Motte und das Backup, Frau Haldane wach an ihrer Tür; ab Abend 3 ist `cam14` aus, das rote Licht im Flur dunkel |
| `kessel_lobby` | der Briefkasten, Vargas Zettel |
| `kowalski` | Bao (oder sein leerer Platz), der Werbebildschirm und Lanterns zehn Sekunden, die halbe Reparatur mit dem Kabel, Vargas Mann, der Schatten in Weiß |
| `gasse` | der Weg zu Waschsalon und Markt, das Papierboot am Denkmal |
| `laundromat`, `cam23` | den Stick zurücklegen; Lantern um halb eins; der Mann in Weiß, wenn die Quiet vom Trockner weiß |
| `lucky_static` | Mei, der Fernseher an allen drei Abenden, der Stammgast, der im Schlaf redet, Frau Imai |
| `jade_row`, `cam07` | Morrows Flutwagen (Entscheidung 2), der Überfall in der Nacht auf Sonntag, `WHO TALKED?`; das **Tor am Ende** führt jetzt zur Klinik und zum Wohnblock Lerche; `cam07` fällt aus |
| `okonkwo_shop`, `cam07v` | der Überfall von innen, danach die Bretter; oder Okonkwos Dank |
| `drain_market` | Sable, Ratz, der Prediger, Kessler mit Gips, und die **Treppe hinab** in die Sümpfe |
| `sable_booth` | Entscheidung 2, der Blick ins Archiv des Wohnheims, die Nachricht über den anderen Glasser |
| `sims`, `dach`, `dach_sitzen` | Teo am Montag, die Regenleserin |
| `cam03` | Kessler kommt nicht mehr; am Automaten zieht jemand anderes Nummer 7 (nur Ansehen) |
| `cam04` | Varga sitzt am Samstag um 22:30 wieder bei Yuen's, auf seinem Platz; nach `k1a=lied` redet er über die Glasserin. Kesslers Ring vom Dienstag (der Clip aus dem Prolog) ist die Aufnahme, die das Ende braucht (§8) |
| `cam15` | nach einem Verkauf am Freitag die offene Kapsel |
| `cam18` | das Archiv für das Ende (Frau Imais Treppe) |
| `cam21` | die Klinik von außen: Ines kommt nicht mehr, die Schwester geht um 19:00 nach Hause |
| `cam22` | Pho Pump: Ines' Platz an der Theke bleibt leer; der Koch stellt trotzdem eine Schale hin, am Samstag |
| `cam24` | der Code der Haustür (W1), am Sonntag um 19:45 die Quiet |
| `cam30` | das Absperrband am Sumpf-Abgang |
| `cam31` | `KEIN SIGNAL`, im Rauschen das Auge |

### 9.2 Neu im Straßenmodus

| Raum | Größe und Blick | Hauptfarbe | Ausgänge | Was darin ist |
|---|---|---|---|---|
| `klinik` | Iso, etwa 6 x 4 m | kaltes Weiß, Lull-Cyan | Tür → `jade_row` (über das Tor) | Wartebank mit müden Leuten, die Aufnahme mit der Schwester hinter Glas, eine Kabine mit Scanner-Stuhl, Nagi·was Ring an der Wand, `SLEEP BETTER` auf einem Schirm |
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
| **die Schwester an der Aufnahme** | neu | `klinik`, `cam21` (Feed) | Iso SE hinter dem Glas (sitzend), Feed SE und SW auf dem Heimweg | weißer Kittel wie Ines, aber kurz; kein Lull. Name offen (§14) |
| **die Quiet** (zwei im Flur, der Schatten, der Mann am Trockner) | neu | `cam25`, `cam23` (Feed), `kowalski` (Iso) | Feed SE, SW, NE, NW mit Kisten; Iso SE, NE, NW stehend | weiße Regenmäntel wie Ashe, die Masken überstrahlen im Feed; im Straßenmodus eine glatte weiße Maske. Ist die Maske symmetrisch, genügt das Spiegeln; trägt einer etwas einseitig (ein Funkgerät), wird NW gezeichnet |
| **Lantern** (persönlich) | neu als Bühnenfigur | `lantern_versteck` | eine Ansicht von vorn, sitzend, mit kleinen Bewegungen | das Gesicht aus `docs/portraits/lantern_x4.png` (grüner Iro, das Okular über **einem** Auge, Headset): Da er nur von vorn zu sehen ist, braucht er keine Gegenrichtung |
| Lantern im Feed | wieder | `cam23` | wie in `cam31`, im Maßstab des Waschsalons | die Silhouette wie das Piktogramm, gespiegelt beim Wegfahren, wie entschieden (story §10c) |
| **Teo, sitzend von hinten** | neu (Pose) | `dach_sitzen` | eine | neben Juno, die Kapuze unten, der Gehörschutz; von hinten sieht man das Pflaster hinter seinem Ohr, am selben Ohr wie in seinen anderen Ansichten (nicht aus einer gespiegelten Ansicht nehmen) |
| Teo mit dem Haken | neu (Pose) | `flat`, `sims` | SE, NE, NW wie seine Figur | der lange Haken aus der Pumpenhalle in einer Hand; NW gezeichnet wie bisher |
| **Vargas Mann** | neu | `kowalski` | Iso SE, NE, NW stehend | nur nach `k1a=lied`; Varga selbst ist nur im Feed gemalt. Name offen |
| **Kessler mit Gips** | neu (von oben) | `drain_market` | von oben, sitzend | der Gips am Arm ist einseitig: von oben kein Problem, er sitzt immer gleich |
| **Bao mit Verband** | Variante | `kowalski` | wie Bao | nur nach `k1b=sold`, Montag |
| **Frau Haldane, wach an der Tür** | Variante | `kessel_14` | wie ihre Figur (SE, NE, NW) | wach, ohne Lockenwickler? Vorschlag: die Lockenwickler bleiben, die Augen offen, das Pflaster dunkel |
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
   ├─ Lerche: cam24 19:30, der Code ─ cam25 ─ (So 19:45–21:00 die Quiet) ─ 4B ─ Serviette ─ Akte ─ EVI erfährt es
   ├─ Fälschung (So 18:00): NETZ ─ Prüfen: Zeitstempel, Regen, Licht ─ Beweis
   ├─ Lantern (So 22:00 der Schirm): halbe Reparatur ─ Kabel ─ Treppe hinab ─ Sumpf ─ Haken, Floß ─ Versteck
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

**Der Zustand:** neu im Hauptfaden `stick_lantern`, `quiet_dryer`, `know_flat`, `code_lerche`, `evi_knows`, `forgery_cuts` (0–3, im
Editor) und `forgery_proven`, `know_cable`, `lantern_found`, `led_quiet`, `e2`, `clip_ines_cut`; in den Fäden `varga2`, `imai2`,
`haldane` und ein Schritt je Faden. Die Kameras, die ausfallen, und alles in §7 kosten nichts.

## 12. Hinweise

Die Hinweise spricht EVI (Prolog-Design §2.2). Die Tabelle nennt die schweren Stellen; beim Bau bekommt jeder Zustand einen Hinweis.

| Für | Stufe 1 | Stufe 2 | Stufe 3 |
|---|---|---|---|
| der Stick | „Du hast noch ihren Schlüssel. Lantern sucht ihn.“ | „Er schaut jede Nacht in den Trockner. Oder du findest ihn.“ | „Leg ihn in Trockner sechs zurück. Um halb eins holt er ihn.“ (Mit der Quiet am Trockner: „Bring ihn Lantern selbst.“) |
| W1, der Code | „Ihr Haus hat ein Zahlenfeld an der Tür.“ | „Die Klingelkamera hängt direkt daneben.“ | „Öffne CAM 24 um halb acht. Da kommt ein Nachbar heim.“ |
| W3/W4, der Flur | „Ihre Tür ist zu. Das bleibt sie nicht lange.“ | „Die von Civic Rest räumen die Wohnung aus. Schau in CAM 25.“ | „Warte, bis sie weg sind. Sonntag ab neun ist der Flur frei.“ |
| W6, die Akte | „Die haben den Rechner genommen. Ines hat auf Papier geschrieben.“ | „Wo hebt man Papier auf, das niemand finden soll?“ | „Schau ins Gefrierfach.“ |
| die Fälschung | „Das ist nicht, was wir gesehen haben.“ | „Leg die beiden Clips nebeneinander. Prüfen.“ | „Schau auf die Uhrzeit, den Regen und das Licht.“ |
| L2–L5, Lantern | „Der Schirm war gekapert. Wer weiß, woher so was kommt?“ | „Der Mann auf dem Gerüst repariert den Schirm. Frag ihn.“ | „Folge dem Kabel, die Treppe unter dem Markt hinab.“ |
| L4, das Floß | „Das Floß ist zu weit weg.“ | „Mit etwas Langem käme man ran.“ | „Nimm den Haken. Er hängt neben dem Aufzug, wenn du ihn nicht hast.“ |
| der Schatten | „Der in Weiß steht wieder unten.“ | „Wenn er dich sieht, sieht er auch, wohin du gehst.“ | „Er geht um elf. Warte bis dahin, bevor du zu Lantern gehst.“ |
| Entscheidung 2 | „Was machst du mit dem Clip?“ | „Sable kauft, Vesper zahlt mehr, Morrow hält nachts in der Jade Row, Lantern ist im Sumpf.“ | „Du kannst ihn auch behalten. Aber im Clip ist das Flüstern.“ |
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

## 14. Offen

- **Namen:** die Schwester an der Aufnahme, Frau Haldanes Sohn, Vargas Mann, die Quiet im Flur (vielleicht ohne Namen), der Kontakt
  `BECKEN 3` (oder `TINTE`), die Kameranummern `cam25` und `cam51`.
- **Zeilen:** alles, was hier steht, sind Vorschläge; Lanterns Stimme für die großen Gespräche fehlt noch im Style Guide.
- **Preise und Zahlen:** Sable 3000, Vesper 5000, die Zuschauer, Sables Archiv 150, Kessler 50.
- **Aussehen:** Klinik, Flur, Wohnung, Sumpf, Versteck, `cam51` und alle neuen Figuren gehen erst als Blöcke zur Freigabe.
- **Frau Haldane in Kapitel 3:** ob Juno ihren Sohn auf der Schlafstation findet.
