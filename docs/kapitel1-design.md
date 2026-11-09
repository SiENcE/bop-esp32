# Kapitel 1 „Glass": Design

Stand: Entwurf (2026-11-03), vorläufig entschieden am 2026-11-05 (story §10b); das Gerüst steht (`game/kapitel1.js`), geprüft wird beim Durchspielen des Mocks. Story: `docs/story.md` (§7 Kapitel 1). Regeln für Deck, Feed-Modus und
Zeit: `docs/kapitel0-design.md` §2–4. Stil: `docs/style-guide.md`.

## 1. Überblick

| | |
|---|---|
| Länge | etwa 2 Std. |
| Ziel | die Miete (900 Chits) in drei Tagen |
| Aufbau | **offen**: drei Aufträge, in beliebiger Reihenfolge und parallel, über drei Abende verteilt; das Kapitel endet am dritten Abend mit dem Treffen in der alten Metro |
| Neu im Spiel | der Drain-Markt und Sable (persönlich), Ratz, die Deck-App NETZ, Anonymisieren im Clip-Editor, Vesper (NINTH LIVE), Werkzeuge kaufen, Steuern im Feed, Kamera vor Ort anzapfen, die Tage, Teo, die Polizei (Morrow, kurz) |
| Orte, Straßenmodus | `flat`, `kessel_14`, `kessel_lobby`, `kowalski`, `jade_row`, `lucky_static`, `okonkwo_shop`, `drain_market`, `sable_booth`, `laundromat` (10) |
| Kameras | `cam03`, `cam04`, `cam07` (Kowalski-Straße, das Mockup E), `cam07v` (die Automatenkamera), `cam15` (Kapselhotel Morpheus), `cam21`–`cam24` (Ines' Wege), `cam30` (Sumpf-Abgang), `cam31` (alte Metro) (11) |
| Entscheidungen | K1a (Kessler), K1b (der Eckladen), **Entscheidung 1** (WREN) |
| Ende | der Mord an Ines in `cam31` |
| Dialoge | zuerst einfache Dialoge; die inneren Stimmen (`dialog-design`, Engine E-d) kommen vor den endgültigen Texten dazu |

## 2. Die drei Tage

Juno lebt nachts. Ein „Tag" ist ein Abend und eine Nacht (18:00 bis 04:00); Schlafen im Bett springt
zum nächsten Abend. Jeder Abend beginnt mit neuen Nachrichten auf dem Deck.

| Abend | Was neu ist | Was an diesem Abend geschieht |
|---|---|---|
| **1 (Mi, 7.11.)** | drei Auftragsangebote: Varga (A), die Tidewater Boys (B), WREN (C) | Teo kommt vorbei (§7). Ines' erster beobachtbarer Abend. Der Drain-Markt ist offen. Okonkwo öffnet den Tresor (01:00). |
| **2 (Do, 8.11.)** | eine Mahnung vom Vermieter, die Werbung „Lull: 2 Wochen gratis" | Ines versteckt den Stick im kaputten Trockner 6 (20:00) und liest die Pegeltafel am Sumpf-Abgang (20:15). Okonkwo öffnet den Tresor (01:00), zum letzten Mal. |
| **3 (Fr, 9.11.)** | Varga drängt („Freitag ist heute."), WREN will „bis 22 Uhr" den Ort | Kein Schlafen. 22:00 WRENs Frist, 22:30 bucht das Konto die Miete ab (§5). Die Uhr hält um 22:45, bis Juno auf `cam31` zusieht. 23:00 das Treffen in der Metro. Kapitelende. |

Was nicht an einen Abend gebunden ist, geht an jedem (die Aufträge A und B lassen sich am Abend 1, 2
oder 3 abschließen, sofern ihr Moment noch kommt; ihre Momente wiederholen sich jede Nacht, außer wo
angegeben). WREN führt durch die drei Abende und erzwingt am dritten das Ende.
Mit dem Treffen endet das Kapitel: Die Nacht nach Abend 3 gibt es nicht. Was nach 23:00 liegt (Okonkwo um 01:00, Morrow um 00:30), kommt
also nur in den Nächten von Abend 1 und 2. Auftrag B muss bis dahin gelöst sein, verkaufen geht noch am Freitag.

### Im Mock vereinfacht (Stand Auftrag C, beim Durchspielen prüfen)

- Die Wege kosten keine Zeit, die Uhr läuft nur beim Warten (§9).
- WRENs Antworten (zurückschicken, senden, nicht senden) gibt es erst am Freitag; vorher würde jede den ganzen Rest verdoppeln.
- `cam22` wird mit der Speisekarte gleich verbunden; `cam22` und `cam23` stehen von Anfang an auf der Karte, Ines muss dafür nicht markiert sein. Im kaputten Trockner liegt der Stick auch für jemanden, der nur zufällig nachsieht, von Donnerstag 20:00 bis zum Treffen. Am Freitag sind `cam22` und `cam23` weg (Ines geht nicht mehr hin), `cam24` ist dafür offen, bis Sable und Motte den Code geben.
- Ines, Lantern und Ashe sind gemalt (`art/characters/feed_people.px.js`), nur `cam31` hat schon sein Bild; die anderen Kameras sind noch Blöcke. REC geht in Kapitel 1 nur während der Szene in `cam31`; zu sehen ist der Knopf überall.

## 3. Auftrag A: „Der verschwundene Schuldner" (Varga)

Gus Varga, der Kredithai aus dem Prolog, schreibt: „Du warst bei Yuen's. Ich hab dich nicht gesehen,
aber ich weiß, wie das läuft. Kessler ist weg. Finde ihn. 400." (Er hat Junos Namen von Sable; wenn
Juno Sable im Prolog Kessler verkauft hat, sagt Varga das offen: „Sable sagt, du bist gut.")

### Kette

| # | Wo | Was passiert | Flags / Dinge |
|---|---|---|---|
| A1 | Deck | Auftrag annehmen (oder ablehnen: dann sucht Varga selbst, und Kessler wird am Abend 3 trotzdem gefunden: Kassenbuch ohne Juno, aber in den Nachrichten). | `job_a` |
| A2 | `cam03` | Bis zum Prolog hat Kessler normal gearbeitet. Seit dem Treffen bei Yuen's ist er weg: Den Rest kann er nicht zahlen, den Ring hat Varga schon, und verschuldet traut er sich nicht mehr heim. Im Büro erscheint er nicht mehr. Aber Nummer 7 gibt es im Viertel nur noch an diesem Automaten (auf der Kowalski ist die Reihe seit Wochen leer), und abends, wenn die Menge weg ist (22:15), kommt jemand ohne Schal und mit Kapuze. Die Markierung findet ihn nicht. | — |
| A3 | `cam03` | Ihn erkennen: am **Nudelautomaten**, wo er dieselbe Sorte zieht (Zoom auf die Taste: „Nr. 7, Huhn scharf"; Frau Kesslers Nachricht im Prolog: „Er isst nur noch Automatennudeln, Nummer 7."). Oder: Zoom auf seine Hand: der helle Streifen, wo der Ring war. Markieren. | `tag_kessler2` |
| A4 | `cam03` → `cam15` | Folgen: er geht zum **Kapselhotel Morpheus** (`cam15`, nicht verbunden). Der Code steht nicht auf der Kamera; das Hotel hat ein eigenes Netz. | — |
| A5 | `sable_booth` | Sable verkauft Zugänge: der Code zu `cam15` für 80 Chits, oder als Tausch gegen Shine (eine Notiz aus Junos Cache). | `code_cam15` |
| A6 | `cam15` | Der Gang des Kapselhotels, Reihen von Kapseln mit Nummern. Kessler kriecht in Kapsel 23. Zoom: Nummer lesen. | `note_kessler_hideout` |
| A7 | **Entscheidung K1a** | siehe unten | |

**Im Mock gebaut** (`game/auftrag_varga.js`, auf Blöcken; Zeilen und Abläufe sind beim Durchspielen zu prüfen). Ein eigener Faden, `off_varga`, mit `varga_step`, `k1a` und `kessler_gone`. Abweichungen von der Kette und von K1a:

- **Annehmen entfällt** (kein `job_a`): Vargas Nachricht steht ab Mittwoch im Chat, und wer Kessler findet, kann ihn senden. Der Fall „Varga findet ihn selbst“ (A1) kommt mit dem NETZ.
- **Erkennen:** Ein Klick auf die Kapuze oder auf den Automaten um 22:15 reicht. Beides zeigt die Nummer 7 und den hellen Streifen am Finger, und `cam15` steht auf der Karte. Ein Zoom auf die Hand fehlt noch.
- **Die Zeiten:** 22:15 bis 22:30 in `cam03`, 22:30 bis 22:45 in `cam15`, an allen drei Abenden. Wer später kommt, findet die Kapsel im Puffer von `cam15`. Das sind drei neue Halte der Uhr am Mittwoch und Donnerstag.
- **Sable** sitzt hinter einem Vorhang auf dem Drain-Markt. Der Code kostet 80 Chits oder geht im Tausch gegen die Notiz über Kesslers Schulden, solange sie nicht verkauft ist. Mit WRENs Vorschuss reicht das Geld immer.
- **Warnen** geht über den Klick auf Kapsel 23, sobald Juno die Nummer kennt, und Kessler kommt ab da nicht mehr. Nach dem Verkaufen kommt er am Abend darauf nicht mehr, und die Kapsel steht offen.
- **Der falsche Ort** ist das Pfandhaus am Fischmarkt.
- **EVIs Hinweise** zu A sprechen nur am Mittwoch und Donnerstag von 20:30 bis 22:45, den Rest des Abends gehören sie WREN. Am Freitag sagt sie zu A nichts.

### Entscheidung K1a

| Wahl | Was Juno tut | Folge | Kassenbuch |
|---|---|---|---|
| **Verkaufen** | Varga das Versteck senden | 400 Chits. Am nächsten Abend (am Freitag verkauft: erst in Kap. 2) in `cam15`: Vargas Leute holen Kessler aus der Kapsel (nicht gezeigt, nur die leere, offene Kapsel und eine zerbrochene Brille). In Kap. 2 sitzt Kessler mit Gips auf dem Drain-Markt und bettelt. | „Varga: Kessler, Kapsel 23. 400." später: „Kessler: zwei Rippen, ein Arm. Bettelt." |
| **Warnen** | in Person zum Kapselhotel? Nein: über das Hotelnetz eine Nachricht auf Kapsel 23s Bildschirm (Steuern im Feed) | kein Geld. Kessler flieht aus der Stadt (Transitachse, nach oben). Varga ist verärgert; in Kap. 2 hat Juno bei Sable einen schlechteren Kurs („Varga redet."). Frau Kessler bekommt eine Postkarte (Epilog). | „Kessler: gewarnt. 0." |
| **Lügen** | Varga einen falschen Ort senden | Varga zahlt 200 im Voraus, findet nichts, will sein Geld zurück: in Kap. 2 ein Feed-Moment, wo Vargas Mann vor dem Kessel-Block wartet. | „Varga: ein falscher Ort. 200 (geliehen)." |

## 4. Auftrag B: „Der Eckladen" (die Tidewater Boys)

Eine Nachricht von „TIDE": „Okonkwo, Kowalski 9. Wir wollen den Tresorcode. 500. Keine Fragen." Der
Laden steht in der **Jade Row**, der Gasse links von der Kowalski-Straße (entschieden 2026-11-06, story §10c), Durchgang am linken Ende der Straße, gleich hinter LUCKY STATIC. Herr Okonkwo verkauft Reis, Batterien und Raucherwaren und
grüßt Juno jeden Abend.

### Kette

| # | Wo | Was passiert | Flags / Dinge |
|---|---|---|---|
| B1 | Deck | annehmen | `job_b` |
| B2 | `cam07` | Die Kowalski-Straße von oben (das Mockup E). Ins Ladenfenster sieht man nur schräg. Die Kamera hat drei Stellungen (Steuern): in Stellung 3 sieht sie durch das Fenster auf die Theke. | — |
| B3 | `cam07` | 01:00 schließt Okonkwo, kniet sich hinter die Theke, öffnet den Tresor. Von oben verdeckt sein Rücken das Tastenfeld. Juno: „Falscher Winkel. Ich brauch was auf Augenhöhe." | — |
| B4 | `kowalski` | Der Automat vor dem Laden hat eine eigene kleine Kamera (Werbung, „Lächeln für einen Gutschein!"). Ansehen: „Die Automatenkamera. Sieht genau durchs Fenster." Sie hängt nicht am Netz: Man muss sie anzapfen. | — |
| B5 | `drain_market` | Ein Händler (Ratz, eine Kabelratte aus dem alten Flutprogramm, so groß wie ein kleiner Hund, Kopfhörer, Stand mit Elektroschrott; Story §4) verkauft einen **Abzweiger**: 60 Chits. Ratz feilscht, vertauscht über seinen geflickten Sprechkragen Wörter („Sechzig Chits, Freundschaftspreis, Feindschaftspreis wäre achtzig.") und will wissen, ob Juno Ratten in den Rohren unter der Krone gesehen hat (Nebengeschichte, Story §9). Oder Motte baut einen aus Junks, wenn Juno ihm im Prolog freundlich geantwortet hat und ihm jetzt eine Lektion gibt (§7). | `+tap` |
| B6 | `kowalski` | Den Abzweiger am Automaten benutzen (Straßenmodus, Juno kniet sich hin). Die Drohne patrouilliert: Nur wenn ihr Lichtkegel weg ist (alle 8 Sekunden), sonst: „Nicht, solange die Drohne guckt." | `link_cam07v` |
| B7 | `cam07v` | Ein Fischauge auf Hüfthöhe, die Ladentheke im Hintergrund. 01:00: das Tastenfeld, Zoom: der Code `4-1-7-0-9`. Aufzeichnen oder notieren. | `note_safe_code` |
| B8 | `cam07` | **Morrow**: in den Nächten von Abend 1 und 2, 00:30, ein Polizeiwagen hält vor dem Laden. Lt. Morrow nimmt von einem Tidewater-Jungen einen Umschlag (Kiemenschlitze, die Leuchtmarkierung am Hals im Feed hell wie eine Lampe). Zuhören: „Das ist für die ruhige Woche. Freitag fährt keiner die Kowalski." Moment `morrow_bribe` (für Kap. 2 und 4 wichtig, wer ihn aufzeichnet, hat etwas gegen Morrow). | optional `+clip_morrow_bribe` |
| B9 | **Entscheidung K1b** | siehe unten | |

**Im Mock gebaut** (`game/auftrag_tide.js`, auf Blöcken; Zeilen und Abläufe sind beim Durchspielen zu prüfen). Ein eigener Faden, `off_tide`, mit `got_tap`, `k1b` und `link_cam07v`; seine Wege sind `tools/paths/kapitel1_tide_*.json`. Abweichungen von der Kette:

- **Annehmen entfällt** (kein `job_b`): TIDEs Nachricht steht ab Mittwoch im Chat („Okonkwo, Jade Row. …“).
- **Der Laden steht in der Jade Row** (story §10c), gegenüber der Automat mit der Kamera. `cam07` ist Nagi·was Kamera über der Gasse, mit Junos altem Zugang, und hat **nur einen Blick**: Die drei Stellungen des Designs entfallen im Mock, weil der Laden nicht mehr an der Kowalski liegt. Von oben verdeckt Okonkwos Rücken um 01:00 das Tastenfeld.
- **Der Abzweiger** kommt nur von Ratz (60 Chits, ein Gespräch mit verschachtelten Themen); Mottes Weg kommt mit seinen Lektionen.
- **Die Drohne:** Juno wartet selbst ab, bis sie vorbei ist, dann klemmt sie den Abzweiger an. Nichts hängt am Timing (CLAUDE.md, Konventionen).
- **`cam07v`:** Okonkwo steht abends an der Theke, um 01:00 kniet er am Tresor; ein Klick auf ihn zeigt den Code im Zoom. Wer später kommt, findet ihn im Puffer derselben Nacht.
- **Der Grundriss des Ladens** (entschieden 2026-11-09, damit der Laden, `cam07` und `cam07v` dieselbe Welt zeigen): Fenster und Tür liegen an der Gassenseite nebeneinander, das Fenster näher an der Kowalski, der Automat genau gegenüber. Innen an der Rückwand die Regale, quer davor die Theke, Okonkwo dahinter, uns zugewandt. **Der Tresor sitzt unter der Theke auf Okonkwos Seite und hängt an der alten Kasse auf der Theke** (entschieden 2026-11-09, der Vorschlag der Nutzerin: ein Tastenfeld zeigt man nicht öffentlich): Um eins tippt er den Code in die Kasse, ihre Tasten zeigen zu ihm. **Ihr Kundendisplay steht auf einem Ständer zum Fenster und zeigt jede getippte Taste** statt des Preises, ein Defekt, den nie jemand repariert hat. Von der hohen `cam07` ist das kleine Display zu klein und zu steil („Falscher Winkel. Ich brauch was auf Augenhöhe.“), der Automat gegenüber auf Hüfthöhe liest es gerade ab; der Zoom zeigt 4-1-7-0-9 auf dem Display. In `cam07v` steht Okonkwo hinter der Theke (ihre Front liegt über ihm) neben der Kasse, größer als in den fernen Feeds, weil der Automat nur über die Gasse sieht. An der Rückwand das Familienfoto, daneben die Tür zum Lagerraum (Kap. 4). **Die Ladenansicht schaut vom Fenster aus auf die Rückwand**, wie `cam07v`: Fenster und Tür liegen hinter uns, die Tür am vorderen linken Rand.
- **Warnen** geht im Laden, solange er offen hat (bis 01:00), auch ohne den Code: TIDEs Nachricht sagt genug. Dafür gibt es die Stange Reis (ein Gegenstand). Wer gewarnt hat, sieht ihn um eins einen neuen Code tippen.
- **Falscher Code** und **Verkaufen** gehen im Chat, sobald Juno den echten Code kennt (sonst wüsste sie nicht, wie einer aussieht).
- **Morrow** um 00:30 in `cam07`: der Streifenwagen, der Tidewater-Junge, der Umschlag; aufnehmen oder nur zuhören.
- **EVIs Hinweise** zu B sprechen am Mittwoch und Donnerstag ab 22:45, nach denen zu A.

### Entscheidung K1b

| Wahl | Was Juno tut | Folge | Kassenbuch |
|---|---|---|---|
| **Verkaufen** | den echten Code an TIDE | 500 Chits. Kap. 2: der Laden wird ausgeraubt; Bao, der Okonkwo helfen will, wird niedergeschlagen. Baos Wagen ist eine Woche zu. | „TIDE: Okonkwos Tresor. 500." später: „Okonkwo: ausgeraubt. Bao: Gehirnerschütterung." |
| **Falscher Code** | einen falschen | 250 im Voraus. Kap. 2: die Boys scheitern am Tresor, kommen zu Juno: eine Drohung an ihrer Tür (Graffiti `GLASSER LIES`). Die Tidewater Boys sind Feinde (Nebengeschichte). | „TIDE: ein falscher Code. 250." |
| **Okonkwo warnen** | in den Laden gehen und es ihm sagen | kein Geld. Okonkwo ändert den Code, gibt Juno eine Stange Reis und Batterien („Ich vergesse das nicht.") und später, in Kap. 4, ein Versteck im Lagerraum. Die Boys suchen einen Verräter. | „Okonkwo: gewarnt. Eine Stange Reis." |

## 5. Die Miete

- 900 Chits, davon 310 Hüllenabgabe (die Flutschuld, Story §3). Am Abend 3 um 22:30 bucht das Konto sie ab, also nach WRENs Frist um 22:00.
- Reicht es nicht, geht alles Geld weg, und Teo schreibt gleich danach: „Hab gehört, die Miete. Ich hab Schichten
  gemacht. Schon überwiesen. Sag nichts." Der Rest ist bezahlt. Teo hat dafür noch mehr Doppelschichten
  auf Lull gemacht. Das steht nicht im Kassenbuch, aber Juno weiß es (eine Zeile, wenn sie auf ihrem
  Bett sitzt).
- Der Prolog bringt 0 bis 420 Chits, WRENs Vorschuss 250: Die Miete reicht erst mit einem weiteren Auftrag oder mit dem Senden.
- Möglich: 400 (A) + 500 (B) + 1500 (WREN) + 750 (Live) = viel zu viel. Der Spieler, der alles verkauft, ist reich
  und hat ein schweres Kassenbuch; der, der alle warnt, lebt von Teo.

## 6. Auftrag C: „WREN" (der Hauptfaden)

### Der Auftrag

Abend 1, eine Nachricht ohne Absender außer `WREN`: „Dr. Ines Calder, Lull-Klinik 9-Ost. Wir wollen
wissen, wen sie trifft und wo. 1500, davon 250 jetzt. Diskretion." Ein Foto: eine Frau mit dunklem
Zopf im Kittel. 250 Chits sind schon auf dem Konto. Juno: „Wer bezahlt im Voraus? Niemand bezahlt im
Voraus."

Juno kann die 250 zurückschicken. Das gilt: Das Geld ist weg, der Auftrag bleibt in den Nachrichten, und WREN schreibt:
„Wie Sie wollen. Das Angebot bleibt." Wer später doch sendet, bekommt die ganzen 1500. Juno sieht trotzdem hin: „Ich will wissen, warum jemand so viel für eine Schlaftechnikerin
zahlt." Die Kette ist dieselbe; nur die Entscheidung am Ende (C9) ändert sich.

### Ines' Ablauf

| Zeit | Abend 1 | Abend 2 | Abend 3 |
|---|---|---|---|
| 19:00 | verlässt die Klinik (`cam21`) | dito | dito |
| 19:15 | Nudelbar „Pho Pump" (`cam22`), allein, schreibt etwas auf eine Serviette, steckt sie ein | dito, aber sie schaut oft zur Tür | geht nicht in die Nudelbar |
| 20:00 | Waschsalon SUDS & SPIN (`cam23`), wäscht, sonst nichts | Waschsalon, versteckt einen **Datenstick** im kaputten Trockner 6 und geht ohne Wäsche | — |
| 20:15 | — | Sumpf-Abgang (`cam30`), liest die Pegeltafel, sieht auf die Uhr, steigt nicht hinunter | — |
| 20:30 | nach Hause, Wohnblock Lerche (`cam24`) | dito | 22:15 verlässt das Haus mit einer Tasche, 22:30 am Sumpf-Abgang (`cam30`) |
| 23:00 | — | — | das Treffen (`cam31`) |

### Kette

| # | Wo | Was passiert | Flags / Dinge |
|---|---|---|---|
| C1 | Deck | `cam21` ist verbunden (eine Nagi·wa-Kamera der Klinik, die Juno noch kennt: ihr alter Zugang funktioniert hier, „Sie haben die Codes nie geändert."). Ines markieren. | `tag_ines` |
| C2 | `cam21` → `cam22` | Folgen. `cam22` ist eine Bar-Kamera, verbunden über das Bar-WLAN (der Code steht auf der Speisekarte im Fenster, Zoom aus `cam21`). Die Serviette: Zoom, sie hält die Hand darüber. | `link_cam22` |
| C3 | `cam22` → `cam23` | Folgen. `cam23`: der Waschsalon hat eine billige Kamera, Code ist ab Werk „0000" (Juno: „Natürlich."). | `link_cam23` |
| C4 | `cam23` → `cam24` | Folgen nach Hause. `cam24` ist eine Haustürkamera, Code im Hausnetz; den gibt es bei Sable oder in Mottes zweiter Lektion (§7), bei Motte also frühestens am Abend 2. Optional. | — |
| C5 | `cam23` | Abend 2, 20:00: Ines versteckt den Stick im kaputten Trockner 6, der **Schlüssel** zu ihrer Daten-Wallet: Ohne ihn lässt sie sich nicht lesen (story §10b). Juno: „Und weg. Aber nicht nach Hause.“ **Moment** `ines_drop`, sonst im Puffer. | — |
| C6a | `cam30` | Abend 2, 20:15: Ines am Sumpf-Abgang, an der **Pegeltafel**. Juno fragt sich, warum sie da hinwill, liest die Tafel (Freitag, 23:00: Niedrigwasser) und schließt: „Außer man trifft da wen. Wo keiner hinsieht.“ **Moment** `ines_tide`, sonst im Puffer. | `know_meeting` |
| C6b | `laundromat` | Optional, von Donnerstag 20:00 bis zum Treffen: Juno geht selbst hin (Straßenmodus), öffnet den kaputten Trockner und liest den Stick: ein Schlüssel, sonst nichts; wozu, weiß sie noch nicht. Sie legt ihn zurück oder behält ihn; solange sie ihn hat, kann sie ihn dort auch wieder zurücklegen. | ggf. `stick_ines`, `+stick` |
| C6c | `cam30` | Abend 3, wer den Treffpunkt noch nicht kennt: Um 22:15 verlässt Ines das Haus, um 22:30 geht sie am Sumpf-Abgang die Treppe hinunter, am Schild `LINE 31 – CLOSED` vorbei. So geht das Kapitel auch, wenn Juno den Donnerstag verschlafen hat; verkaufen kann sie dann nicht mehr (WRENs Frist war 22:00). | `know_meeting` |
| C7 | Deck | `cam31` verbinden: eine **alte Metro-Kamera**, aus der Zeit vor Nagi·wa, die Nagi·wa einst nachgerüstet und dann vergessen hat. Kein Code findet sie. Erst das alte Beobachter-Protokoll aus Junos Implantat verbindet sie, und es will einen Takt, einen Handshake: **„lang, kurz, kurz, lang“** (entschieden 2026-11-05). Das Handbuch im CACHE sagt nur „Handshake: siehe Anlage C“, und die Anlage fehlt. Der Takt pulsiert hinter jedem Ohr im Neunten: bei Frau Haldane im Flur, bei Frau Imai, beim `UNKNOWN LINK` in der Schlange. Juno: „Woher kenn ich das?“ Bei `cam31` gibt man ihn Schlag für Schlag ein (Lang oder Kurz); erst am Ende zeigt sich, ob er stimmt. Dann: „Das kann nur noch mein Kopf.“ So ahnt, wer aufpasst, das Geheimnis von Kapitel 3: Lull und das Implantat sprechen dasselbe Protokoll. Ein Moment des Schauders: Im Rauschen vor dem Bild sieht man für einen Takt das Auge. | `link_cam31` |
| C8 | Deck | WREN drängt am Abend 3: „Bis 22 Uhr. Wo und wann." | — |
| C9 | Deck | **Entscheidung 1**: WREN den Ort senden oder nicht (unten). | `e1_sold` / `e1_refused` |
| C10 | `cam31` | 23:00. Siehe §8. | Kapitelende |

### Entscheidung 1

| Wahl | Was geschieht | Kassenbuch |
|---|---|---|
| **Senden** | 1250 Chits (der Rest; nach dem Zurückschicken 1500). WREN: „Danke. Und schauen Sie heute Nacht zu. Für die Live-Übertragung zahlen wir 750 extra." Juno sieht zu. | „WREN: Ines Calder, Metro 31, Fr 23:00. 1500." und nach dem Treffen „WREN: die Live-Übertragung. 750." |
| **Nicht senden** | WREN: „Schade. Es gibt andere Glasser." Das gilt auch, wenn um 22:00 nichts gesendet ist. Juno sieht trotzdem zu, um Ines zu warnen, aber sie kommt nicht an sie heran: Ines' Komm ist aus, jede Nachricht an sie meldet von Anfang an `NICHT ZUGESTELLT`, und hingehen will Juno nicht („Vor ihrer Tür stehen und sagen, ich hab dich beobachtet? Sie würde rennen.“). Später im Kassenbuch: „WREN hat es von jemand anderem." | „WREN: nichts geliefert. 250 (behalten oder zurückgeschickt)." |

Beide Wege führen in dieselbe Szene. Der Unterschied zeigt sich im Kassenbuch, in den Zeilen und in
Kap. 2: Nach dem Senden weiß die Quiet sofort, wer Juno ist; nach der Weigerung muss sie erst suchen (story §10b).

## 7. Das Leben drumherum

| Wann | Wo | Was |
|---|---|---|
| Abend 1, 18:30 | `flat` | **Teo** klopft. Orange Weste, Gehörschutz um den Hals, hinter dem Ohr der blaue Lull-Punkt. Er bringt Essen von Bao. Er lacht über seine Doppelschichten („Vier Stunden Lull, und ich bin wie neu."). Ansehen des Punkts: Juno: „Seit wann?" Teo: „Seit es gratis ist." Ein Dialog über ihre Nagi·wa-Zeit (Teo: „Du redest noch immer, als hätten sie dich gefeuert, weil du schlecht warst."). |
| jeder Abend | `kowalski` | Der Werbebildschirm stottert, wenn Juno vorbeigeht. Abend 2 zeigt er eine Sekunde lang das Bild aus `cam03` (Kessler unterm Vordach, zwei Nächte alt). Abend 3 nur das Auge. |
| Abend 1–3 | `kessel_14` | **Motte** wartet auf seiner Bank. Wenn Juno ihm im Prolog freundlich geantwortet hat: „Zeigst du mir was?" Drei Lektionen (je eine pro Abend, ein kleiner Dialog): was eine Kamera ist, wie man einen Code findet, warum man nie seinen eigenen Block glasst. Nach der zweiten baut er den Abzweiger (B5). Nach der dritten: `moth_student` (in Kap. 3 warnt er Juno vor der Razzia). |
| Abend 2 | `kessel_14` | Frau Haldane, wach, an ihrer Tür: Ihr Sohn schreibt nicht mehr aus den mittleren Ringen. Eine Nebengeschichte beginnt (Story §9). |
| Abend 2 | `lucky_static` | Die Bar von innen: Stammgäste, ein Fernseher mit Nagi·wa-Nachrichten („Kriminalität im Neunten auf Rekordtief"), die Wirtin Mei (`#ff9a7a`), die Juno anschreiben lässt. Gespräche: Gerüchte über Sinker („Der Sohn vom Fischmann ist nicht aufgewacht. Ruhe-Erschöpfung, sagen sie."). |
| ab Abend 1 | Deck | **Das Beobachter-Handbuch** liegt von Anfang an im CACHE (`cache_note_obs_handbook`, gesetzt beim Start des Kapitels; story §10a). Die Notiz, Vorschlag für den Text: „Nagi·wa, Zivile Beobachtung. Das Implantat sitzt hinter dem Ohr. Es markiert, was Sie sehen, und verbindet Sie über das Protokoll `OBS-4` mit jeder Kamera, die es versteht. Die Wach-Ebene hält Sie dabei bei Bewusstsein. Handshake: siehe Anlage C.“ Die Anlage fehlt. Niemand weist darauf hin; es ist das Wort, das in C7 zählt, und in Kapitel 3 findet Juno `OBS-4` in Ines' Protokollen wieder. |
| Abend 1 und 2, vor 19:00 | `cam21` | **Der unbekannte Link** (story §10a). Über jemandem in der Schlange vor der Klinik steht in Junos Overlay eine zweite Klammer, cyan, dazu `UNKNOWN LINK`. Sie pulsiert, wenn der Link aktiv ist, und bleibt, solange die Person im Bild ist. Niemand erklärt es, auch Juno und EVI nicht; Ansehen gibt dieselbe Zeile wie bei allen in der Schlange. Es gilt in jedem Takt vor 19:00, an zwei Abenden, damit nur verpasst, wer gar nicht hinsieht. Kein Moment nach kapitel0 §3: nicht aufzuzeichnen, kein Flag, kein Zustand für den Solver. |
| Abend 1 | Deck | Die App **NETZ** ist neu (Prolog-Design §2.1): Nagi·wa-Net mit den Nachrichten des Abends, Werbung und dem Glasser-Brett. EVI liest die Schlagzeilen vor und versteht sie falsch („Kriminalität auf Rekordtief. Heißt das, die Verbrecher schlafen?"). Jeden Abend neue Einträge; am Abend 2 ein Beitrag auf dem Brett: „Wer weiß was über Ruhe-Erschöpfung? Mein Vater wacht nicht auf." |
| Abend 2 | Deck | **Vesper** schreibt im Chat, ein Einkäufer für NINTH LIVE (Story §3, §9): „Ich höre, Sie haben ein Auge für das Echte. Ich zahle das Doppelte von Sable. Für jeden rohen Clip." Juno kann ihm jeden Clip aus dem Cache verkaufen (Kesslers Ring, Morrows Umschlag, Okonkwo am Tresor). EVI zeigt dabei das **Anonymisieren** im Clip-Editor („Ich kann Gesichter wegmachen!"); anonymisierte Clips nimmt Vesper nicht. Jeder Verkauf an Vesper steht im Kassenbuch mit der Zahl der Zuschauer, die später dazukommt. Optional, nie nötig. |
| Abend 3, 22:30 | Deck | Teos Nachricht wegen der Miete (§5), falls nötig. |
| Abend 1 | Deck | **Frau Kessler** schreibt, je nach P1. Die Wahrheit: „Er ist nicht heimgekommen. Schulden, haben Sie geschrieben. Wo ist er?“ Der Schnitt: „Er ist nicht heimgekommen. Zu ihr, nehme ich an.“ Nichts: „Er ist nicht heimgekommen. Sie haben wirklich nichts gefunden?“ |
| ab Abend 1 | `kowalski` | **Bao** erinnert sich an den Dienstag. Bar bezahlt: „Bar! Mein Alter glaubt es immer noch nicht.“ Sonst: „Steht noch an, von Dienstag. Eilt nicht.“ |

**Gebaut** (`game/kapitel1_leben.js`, auf Blöcken): **Teos Besuch** am Mittwoch um 18:30. Man kann ihn nicht verpassen: Es klopft, wo Juno auch gerade wartet, sie macht auf, und danach ist sie wieder, wo sie war (eine Szene ohne Wahl, kein Flag außer dem Moment). Die Regenleserin liest daraus, ob Juno von Teos Lull weiß. Die Zeilen sind ein Vorschlag, zu prüfen beim Durchspielen; der Dialog über die Nagi·wa-Zeit ist auf eine Zeile verkürzt.

**Mottes Lektionen**, ebenda: Wenn Juno im Prolog freundlich war, fragt Motte jeden Abend „Zeigst du mir heute was?“, und Juno kann eine Lektion geben oder „Heute nicht.“ sagen. Eine pro Abend (`moth_today`, über Nacht vergessen), drei insgesamt (`moth_lesson`): was eine Kamera ist, wie man einen Code findet, warum man den eigenen Block nicht glasst. In der zweiten baut er aus seinem Tideboy einen Abzweiger, wenn Juno noch keinen hat (B5); nach der dritten ist er `moth_student`. Wer einen Abend auslässt, schafft nur zwei. Ein eigener Faden (`off_motte`); mit Auftrag B teilt er nur den Abzweiger (`got_tap`), der B einen Kauf spart. Ein Kapitel 1 ohne Prolog beginnt mit der freundlichen Antwort. Die zweite Lektion gibt noch nicht den Code von `cam24` (C4): Den gibt es im Mock am Freitag von selbst.

**Das LUCKY STATIC von innen** (`game/lucky_static.js`, auf Blöcken): an jedem Abend, nicht nur am zweiten, denn die Bar ist ab Mittwoch offen; was sich ändert, liest nur den Tag (dialog-style-guide §4 C), kein Flag. **Mei** steht hinter einer niedrigeren Theke, nur ihr Oberkörper über der Kante: die Haare hoch, ein Bleistift darin für die Tafel, eine lachsfarbene Strickjacke. Sie lässt Juno anschreiben („Wer anschreibt, kommt wieder.“), ohne dass es Chits kostet; an der **Tafel** hinter ihr stehen Striche ohne Namen, Junos Reihe ist die lange. Was man hört: Mittwoch trinken die Leute weniger, seit Lull gratis ist; Donnerstag ist der Sohn vom Fischmann nicht aufgewacht; Freitag hört man gar nichts. Der **Fernseher** über der Theke spricht in Nagi·was Cyan: Mittwoch „Lull jetzt kostenlos im ganzen Neunten. Vier Stunden, die sich anfühlen wie zehn.“ (nach Teos Besuch merkt Juno, dass er es wörtlich so gesagt hat), Donnerstag „Kriminalität im Neunten auf Rekordtief.“, Freitag „Tropfen aus dem Vierten. Später trocken.“ Mei hat ihn einmal ausgemacht, und zehn Minuten später kam einer und fragte freundlich, ob was kaputt ist. **Die üblichen zwei** auf ihren Hockern: er schläft auf seinen Armen, das Lull-Pflaster hinterm Ohr; sie sitzt gerade und erzählt ihm trotzdem, wie es vorher war, und am Donnerstag hat er im Schlaf gelacht. Die Zeilen und Meis Aussehen sind ein Vorschlag, zu prüfen beim Durchspielen; Meis Farbe `#ff9a7a` liegt nah an Ashes Rot.

**Bao, der Werbebildschirm, Frau Haldane** (gebaut, nur vom Tag gelesen, kein neues Flag): **Bao** erinnert sich am Mittwoch an den Dienstag (bar bezahlt oder angeschrieben, `bao_paid` aus dem Prolog) und merkt, dass Juno etwas gesehen hat („Du guckst, als hättest du was gesehen.“ „Ich guck immer so.“ „Eben.“); am Donnerstag fragt Lou, ob sie krank ist, weil sie so schnell isst; am Freitag sagt er fast nichts. Der **Werbebildschirm** stottert: Wer ihn am Donnerstag ansieht, hat eine Sekunde lang CAM 03 gesehen, Kessler unterm Vordach, von Dienstag; am Freitag nur das Auge, und Juno weiß nicht, ob auf dem Schirm oder in ihrem Auge (das Ansehen allein, damit es nichts kostet; im Bild selbst ist es noch nicht). **Frau Haldane** hat am Donnerstag bis zu ihrer Schicht um sieben frei und sitzt wach im Sessel: Ihr Sohn schreibt jeden Sonntag aus dem Fünften, wo er arbeitet, seit drei Sonntagen nicht mehr. Damit beginnt die Geschichte der Briefe ihres Sohnes (Story §9); der Fünfte ist der Ring, der nach Kochsalz schmeckt. Eine Wahl, ihr zu helfen, gibt es in Kapitel 1 noch nicht. Gefunden dabei: Ein Klick tut immer die erste Aktion eines Hotspots, an ihrer Tür war das „reden“ („Sie schläft …“), und der Stapel hinter ihrem Sessel aus dem Zeitungskrieg war deshalb nie zu erreichen, weder für Spieler noch für den Solver. Ab Mittwoch führt der Klick jetzt dorthin.

**Das NETZ** (gebaut, `Nagiwa.netz` in `game/deck.js`, gefüllt von `game/prolog.js` und `game/kapitel1_leben.js`): Jeden Abend eine neue Seite, oben die Schlagzeile, darunter die kleine Meldung, das Glasser-Brett, dann die Werbung. Mittwoch noch „Kriminalität im Neunten auf Rekordtief.“ (EVI: „Heißt das, die Verbrecher schlafen?“ Juno: „Die meisten.“), die Hüllenabgabe wird angepasst, und auf dem Brett sucht jemand einen Abzweiger, „bitte nicht Ratz“. Donnerstag „Ruhe-Erschöpfung: kein Grund zur Sorge, sagen Nagi·was Ärzte.“ (EVI: „Dann sorgt sich jetzt keiner mehr?“ Juno: „Das ist der Plan.“), die Lull-Kliniken haben auch nachts offen, und auf dem Brett: „Wer weiß was über Ruhe-Erschöpfung? Mein Vater wacht nicht auf.“, unterschrieben L., Kowalski-Straße, das Mädchen der weißen Träger. Freitag „Tropfen aus dem Vierten. Später trocken.“ (EVI hat nachgesehen: Das gab es hier noch nie), „Nagi·wa wünscht dem Neunten eine ruhige Nacht.“, und L. schreibt: „Mein Vater ist weg. Zwei in Weiß haben ihn abgeholt. Sie waren sehr freundlich.“ EVI liest einmal pro Abend vor (eine Ansicht, `netz_read`, kein Zustand). Die Zeilen sind ein Vorschlag, zu prüfen beim Durchspielen.

**Vesper** (`game/vesper.js`, ein eigener Faden `off_vesper`): Ab Donnerstag steht VESPER im Chat, siezt Juno und schreibt: „Ich höre, Sie haben ein Auge für das Echte. Ich zahle das Doppelte von Sable. Für jeden rohen Clip.“ und „Nur roh, bitte. Ohne Gesichter ist es kein Leben.“ Beim ersten Öffnen sagt Juno, was NINTH LIVE ist, und EVI: „Ich kann Gesichter wegmachen! Im Clip-Editor.“ Juno kann ihm jeden rohen Clip aus dem CACHE schicken, ohne vorher etwas anzunehmen: **Kesslers Ring** 240 (Sable gab 120), **Morrows Umschlag** 300 (aus Auftrag B), **die weißen Träger** 400. Was in der Nacht auf Freitag gelaufen ist, steht am Freitag im Kassenbuch mit der Zahl der Zuschauer (31.200, 88.400, 412.000), und Vesper dankt im Namen der Krone; ein Verkauf am Freitag bekommt keine Zahl mehr, das Kapitel endet in der Nacht. Okonkwo am Tresor aus der Tabelle oben ist kein Clip (Juno sieht den Code in einer Nahaufnahme), Vesper kauft ihn deshalb nicht. **Anonymisieren** im Clip-Editor ist ab Kapitel 1 wach: Es verpixelt das ganze Bild und die Namen in Junos Kopie, für immer (`anon_<clip>`), und dann bietet Juno den Clip Vesper nicht mehr an. Es gibt keinen Käufer für anonymisierte Clips in Kapitel 1; die Wahl ist, nicht zu verkaufen. Damit Hauptfaden und die anderen Fäden nicht mit jedem Clip doppelt so viele Zustände bekommen, ist das Werkzeug nur wach, solange Vespers Faden offen ist. Preise, Zuschauerzahlen und Zeilen sind ein Vorschlag, zu prüfen beim Durchspielen.

### Die Stadt: rausgehen (entschieden 2026-11-05)

Die Abende sollen nach Leben in der Stadt schmecken, nicht nach Warten aufs Bett. Das **Bett** geht erst ab 01:00 auf („Schlafen? Ich schlaf nicht vor eins. Nie.“).

**Zwei neue Orte:** die **Gasse** hinter dem Gitter in der Kowalski-Straße (Kabelbündel, Dampf, Nischen, in denen Leute wohnen; von hier geht es zum Waschsalon und zum Drain-Markt; der Abgang zum Markt ist eine Öffnung in der Rückwand mit einer Treppe nach unten, `DRAIN MARKET` darüber, entschieden 2026-11-09: nichts, worüber man läuft) und das **Dach des Kessel-Blocks**, von dem aus man **die Ringe** zum ersten Mal von unten sieht: Unterseiten so groß wie ein Himmel und das tropfende Wasser, das hier als Regen gilt. Das Dach hat **dieselbe Kamera wie das alte Foto am Deck** (`art/ui/deck_wallpaper.px.js`), zwanzig Jahre später: `SLEEP BETTER` statt `RISE ABOVE`, dem NOODLES-Schild fehlen zwei Buchstaben, mehr Schirme in der Stadt. Juno kann sich an die alte Stelle setzen: die große Einstellung, allein, wo sie zu zweit saßen (`dach_sitzen`). Der **Blick nach oben** ist ein Mock zum Beurteilen (`dach_blick`, `docs/mockups/mock_g_ringe_*`): A genau entlang der Hochachse, B von Junos echtem Standort aus, schräg nach oben. Im Spiel steht B: Das Foto zeigt die Achse weit weg in der Stadt, A könnte sie von dort gar nicht sehen.

**Das Dach im Bild** (entschieden 2026-11-05): `dach` und `dach_sitzen` laufen in derselben Schleife wie das Foto am Deck (24 Bilder, 2,4 s). Der Regen fällt nur bis zur Oberkante der Brüstung; die Brüstung und der Teer davor sind trocken, ohne Regen und ohne Pfützen. Auch die Leiter endet an der Oberkante der Brüstung: Sie kommt von außen hoch. Das Foto selbst behält Regen und Pfützen.

**Der Weg aufs Dach:** Keine Treppe führt hoch. Juno klettert aus dem Fenster auf den Sims und die Außenleiter hoch, und sie hat Höhenangst (das Foto am Deck: „Er hatte nie Angst vor der Höhe. Ich schon.“). Ein kleines Rätsel, ein Vorschlag zum Prüfen im Mock. Die Reihenfolge ist frei: Was Juno findet, kann sie sofort mitnehmen (auch überall sonst, `CLAUDE.md`, Konventionen):

| # | Wo | Was | 
|---|---|---|
| 1 | `flat`, Fenster | Es klemmt: „Der Riegel sitzt im Rahmen. Da kommt man nur mit was Flachem ran.“ |
| 2 | `flat`, Karton | Der alte Nagi·wa-Ausweis, `UNGÜLTIG`. Am Fenster: „Das erste Mal, dass das Ding was aufmacht.“ |
| 3 | `sims` | Die Leiter hängt zwei Meter zu hoch. „Teo kam da früher mit irgendwas Langem ran.“ |
| 4 | `kessel_14`, Aufzug | Neben der Tür hängt der Notschlüssel, ein langer Haken: „Stecken bleiben müsste er erst mal fahren.“ |
| 5 | `sims`, Leiter | Haken, die Leiter kommt runter, hoch aufs Dach. |

Ausweis, Notschlüssel und der Weg aufs Dach sind schon im Prolog offen (entschieden 2026-11-06): Es gibt keinen Grund in der Welt, sie zu sperren, und die Regenleserin verrät nichts, was Vorwissen braucht. Kapitel 1 übernimmt beide Gegenstände. Der Notschlüssel hängt sichtbar neben der Aufzugtür, über der Tür sind schon Anzeige und Lampe.

**„Unser Platz“** (`dach_sitzen`, entschieden 2026-11-06): Wenn Juno sitzt, sieht man einen anderen Ausschnitt als beim Laufen: weiter rechts, ohne den linken Turm und ohne den Platz der Regenleserin, denn sonst müsste sie im Bild sein. Dafür geht die Stadt nach rechts weiter, mit einem Block und seinem Schild `REST` und weiteren Schirmen. Juno ist von hinten gemalt, die Kapuze, der Riemen der Tasche, die Tasche an der Hüfte, und neben ihr ist Platz für jemanden, der nicht da ist. Bild: `docs/rooms/dach_sitzen_mock_x3.png`.

**Drei kleine Geschichten:**

| Geschichte | Was passiert | Verbindung zur Hauptstory |
|---|---|---|
| **Der Zeitungskrieg** | Der Zettelstreit im 14. Stock wird zum Fall: Wer klaut die Zeitung? Dafür müsste Juno den eigenen Block glassen, was sie Motte gerade verbietet. Die Diebin ist Frau Haldane, im Schlaf. In ihrer Wohnung liegt der Stapel, auf jeder Seite sind Gesichter eingekreist wie Junos Klammern. | Schlafende markieren, was falsch aussieht (story §6). Niemand erklärt es. |
| **Die Frau, die sich erinnert** (story §9) | Sie ist sicher, einen Mord gesehen zu haben, in einer Straße, in der sie nie war. Juno trifft sie im LUCKY STATIC und findet die Straße. | Sie ist die Person mit `UNKNOWN LINK` aus `cam21`. In Kapitel 2 schreibt sie: „Ich hab wieder was gesehen. Eine Frau auf einem Bahnsteig.“ |
| **Die weißen Träger** | Donnerstagnacht auf der Kowalski: Ein Nagi·wa-Wagen holt einen Sinker aus dem Haus, zwei freundliche Leute in Weiß. Die Nachbarn sehen weg. Juno kann zusehen, filmen und an Vesper verkaufen, oder die Tochter trösten. | Zeigt, was mit Sinkern geschieht, lange bevor Teo einer wird. Im NETZ ist es der Beitrag „Mein Vater wacht nicht auf“. |

**Der Zeitungskrieg im Einzelnen (ein Vorschlag zum Prüfen im Mock; bis auf die Nacht in `cam14` ist die Reihenfolge frei):**

| # | Wo | Was |
|---|---|---|
| 1 | `kessel_14`, Zettel | Wer klaut die Zeitung? Nagi·was Kamera in der Ecke sieht alles, aber den eigenen Block glasst man nicht. |
| 2 | `kessel_14`, Kamera | Die Wahl: „Nur dieses eine Mal.“ oder „Nein.“ Ihr alter Zugang geht auch hier: `cam14`. |
| 3 | `cam14`, 02:30 (Mi und Do) | Frau Haldane im Morgenmantel, die Augen zu, holt die Zeitungen. Der Zettel `WER KLAUT MEINE ZEITUNG` ist ihr eigener: **Sie klaut ihre eigene Zeitung und weiß es nicht.** |
| 4 | `kessel_14`, ihre Tür | Hinter dem Sessel der Stapel. Um jedes Gesicht vier kleine Ecken, wie Junos Klammern. „So markier ich.“ Niemand erklärt es. Eine Notiz im CACHE; auf dem Zettel steht danach, von Juno: `ES IST NIEMAND. 14B.` |

**Die Frau, die sich erinnert, im Einzelnen (`imai_step`):**

| # | Wo | Was |
|---|---|---|
| 1 | CHAT | **Frau Imai** (R. IMAI, Status: schläft): „Ich habe einen Mord gesehen. In einer Straße, in der ich nie war.“ |
| 2 | `lucky_static` | Eine Treppe, ein Schild mit einem Fisch, Regen von links, ein Mann, der fällt. „Ich hab von oben draufgeschaut. Als würde ich an einer Laterne hängen.“ Juno erkennt sie aus der Schlange: Sie ist der `UNKNOWN LINK`. |
| 3 | `cam18`, Archiv | Der 29. Oktober, 03:12. Es ist wirklich geschehen, genau von dieser Kamera aus gesehen. Sie schlief von drei bis sieben. |
| 4 | `lucky_static` | **Die Wahl:** „Sie sind nicht verrückt.“ (die Wahrheit, sie traut sich nicht mehr zu schlafen) oder „Das war ein Traum.“ (die Lüge, die sie schlafen lässt; beide im Kassenbuch). Kapitel 2 nimmt das auf. |

**Die weißen Träger im Einzelnen (`traeger`):** Donnerstag, 23:30. Juno hört von überall her den Wagen, „der nicht hupt“. Auf der Kowalski-Straße: ein weißer Wagen ohne Schild, zwei freundliche Leute in Weiß, ein Mädchen in der Tür, die Rollos gehen runter. Die Wahl: **zusehen, filmen** (ein Clip im CACHE, für Vesper) oder **zu dem Mädchen gehen** (mehr als bleiben kann Juno nicht). Der Beitrag „Mein Vater wacht nicht auf“ im NETZ ist später ihrer.

**In der Tasche** (entschieden): Was Juno wirklich in der Hand hält, ist ein Gegenstand: der Ausweis, der Haken, Ines' Stick (dazu später der Abzweiger und der Reis). Clips und Notizen bleiben im CACHE. **EVI** sitzt immer in der Tasche, fest: Ein Klick lässt sie reden, benutzen kann man sie nicht.

**Drei merkwürdige Leute:** die **Regenleserin** auf dem Dach (kostet das Tropfwasser und sagt, von welchem Ring es kommt: „Der Vierte. Die gießen ihre Orchideen.“; ihre Wettervorhersagen sind eigentlich Klatsch), der **Prediger** der Wachen Kirche auf dem Drain-Markt (seit neun Tagen wach, zittert vor Kaffee und schenkt Juno einen ein) und **die halbe Reparatur** auf dem Gerüst am Werbebildschirm (wohnt dort und repariert nur die linke Hälfte, die rechte gehört zu einem anderen Vertrag).

**Was die Regenleserin sagt** (`game/regenleserin.js`; die Texte sind beim Durchspielen im Mock zu prüfen): Über sie erklärt sich die Welt, und nebenbei fallen Dinge, an die man sich später erinnert. Kein Flag, alles darf man wieder fragen. Verschachtelt, nie mehr als vier Optionen (`dialog-design` §4).

| Was sie sagt | Was es später heißt |
|---|---|
| Der Fünfte schmeckt seit Jahren nach Kochsalz, jede Nacht eimerweise: „Wer wäscht da oben so viele?“ | die Schlafstation in den mittleren Ringen (Kap. 3, 4) |
| Sie wartet seit drei Jahren auf den ersten warmen Tropfen der Maschine | die automatische Auswertung hat es nie gegeben (Kap. 2) |
| Das halbe Haus holt um drei zur selben Zeit Luft | die Schlafenden sind verbunden, Tintes „wie ein Schwarm“ (Kap. 3) |
| Lull und Junos Implantat: „Dieselbe Stelle. Sparsam, die Leute da oben.“ | Lull ist das Beobachter-Implantat in billig (§10a) |
| Weiß hält hier unten keinen Tag: Wer so herumläuft, kommt nicht von hier | die weißen Träger, Ashes weißer Regenmantel am Freitag |
| Freitag: Das Wasser schmeckt nach nichts, „wenn's so still wird, räumt jemand auf“, „Frag mich morgen“ | der Mord am selben Abend, die Quiet |
| Teo soll raufkommen, „solange er die Leiter noch findet“ | Teo wird ein Sinker (Ende Kap. 2) |
| Licht im Wasser, einer, der mithört; zehn Sekunden Wahrheit auf dem großen Schirm | Lantern, die Sümpfe |
| Tinte „zählt mit“, wer fehlt | die Knoten im Kabel (Kap. 3) |
| Baos Küche mit Fenster zum Strand, sein bestes Rezept liegt noch unten | Baos Vergangenheit (§9) |
| Aus der Krone kommt kein Tropfen | die Krone, der Ruhekern (Kap. 5, 6) |

**Was Motte sagt** (`game/motte.js`): Sobald sie sich kennen, kann Juno ihn bei jedem Vorbeigehen ansprechen, ohne Flags. Er **spielt** auf dem Handheld, er übt nicht das Glassen (entschieden 2026-11-05): ein breites Gerät mit zwei farbigen Griffen, ein „Tideboy“, das Spiel heißt „Sump Runner“, und er hält es mit beiden Händen vor der Brust.

| Was er sagt | Was es später heißt |
|---|---|
| Der Spielstand ist weg: „Man macht immer ein Backup.“ „Wovon?“ „Von allem, was du nicht verlieren willst.“ | Motte rettet EVI (Kap. 4, „Du hast gesagt, man macht immer ein Backup.“) |
| „Bis in den Fünften war ich schon“, „Die sehen eine Mütze.“ | Motte als Verbündeter im Tower (Kap. 5) |
| Die Mütze, „damit man mich im Glass findet“; „Auch nicht, wenn mal was ist?“ „Dann schon.“ | die Razzia (Kap. 3) |
| Das Licht hinterm Ohr seiner Mutter: „Komisch. Immer gleich. Ich zähl das manchmal mit.“ | der Takt für `cam31` (C7); fragt Juno, wie er zählt, sagt er ihn: „Lang, kurz, kurz, lang. Dann Pause.“ (story §10d); sonst EVI als letzte Stufe ihres Hinweises (§12) |
| Sump Runner, das Rohr hört unter der Krone auf | Ratz' Kolonie, die Rohre (Kap. 4) |
| Frau Haldane sagt nachts nicht hallo (Mittwoch) | der Zeitungskrieg |
| Am Donnerstag die Rollos gegenüber, am Freitag keine Streife auf der Kowalski | die weißen Träger; „Freitag fährt keiner die Kowalski“ |

**Die Abende:** Mittwoch ist Ankommen (Teo, die Aufträge, die Gasse, der erste Gang zum Drain-Markt). Donnerstag ist die Stadt (das Dach, der Zeitungskrieg, die weißen Träger; nebenbei Ines' Stick). Freitag wird alles still: dieselben Orte, aber der Bildschirm zeigt das Auge, Bao redet weniger, die Regenleserin sagt: „Heute schmeckt's nach gar nichts.“

**Reihenfolge im Mock:** gleich nach Auftrag C, vor den Aufträgen A und B.

## 8. Das Ende: CAM 31

Feed-Modus, `cam31`. Eine alte Metro-Station unter Wasser bis zum Bahnsteig; eine einzelne Notbeleuchtung; Tropfen. Die Kamera ist alt,
ihr Bild körniger als alle anderen, und es flackert. **Juno kann nichts tun, und das Spiel lässt sie und den Spieler genau das erfahren**
(entschieden 2026-11-05): Zusehen allein trägt die Szene nicht; ihre Wucht kommt daher, dass alles, was sie versucht, sichtbar scheitert.

| Zeit | Was geschieht | Was Juno versucht |
|---|---|---|
| 22:55 | Ines kommt die Treppe herunter, Tasche in der Hand. Sie wartet am Bahnsteigrand. | Juno atmet aus. Nach einer Weigerung: „Ines. Geh nach Hause.“ Ihre Nachricht an Ines' Komm: `NICHT ZUGESTELLT`. |
| 23:00 | Lantern kommt durch das Wasser aus dem Tunnel, in seinem Rollstuhl mit Schwimmern (Poncho, Antennen; Story §4). Zuhören: Ines: „Es ist alles drauf. Die Protokolle passen auf die Sekunde.“ Lantern: „Wenn das stimmt ...“ Ines: „Es stimmt. Sie schlafen nicht. Sie *arbeiten*.“ Sie gibt ihm die Daten-Wallet. Lantern: „Und der Schlüssel ...?“ Sie beugt sich zu ihm und flüstert (nur das Mikro neben ihr hört es, Ashe nicht, die Übertragung an WREN ist nur Bild): „SUDS & SPIN. Trockner sechs, der kaputte.“ „Sonst weiß es keiner.“ | Juno: „Doch. Ich.“ Hat sie den Stick: „Und er liegt in meiner Tasche.“ |
| 23:02 | Lantern wirft den Motor an und verschwindet im Tunnel (entschieden 2026-11-06): Er flieht nicht und lässt sie nicht im Stich, er sieht nichts, denn die lange Wange der Treppe verdeckt den Schatten daneben für ihn und für Ines. Dort steht ein Mann im weißen Regenmantel. Im Feed hat er kein Gesicht: Seine Maske überstrahlt die Kamera zu einem weißen Fleck. Das Overlay versucht ihn zu markieren und zeigt `???`, dann rot `BEDROHUNG`. Ines sieht Lantern nach. Dann will sie zurück zur Treppe. | Juno: „Wer ist das?“ „Sie sieht ihn nicht.“ Jetzt lässt das Spiel alles anklicken, und nichts hilft: **Steuern:** Diese Kamera hat nichts zum Steuern, kein Licht, keine Tür: `KEIN ZUGRIFF`. **Chat an Ines:** `NICHT ZUGESTELLT`. **Lautsprecher:** Die Kamera hat keinen. **Revier 9** im Chat: „Ihre Meldung wird bearbeitet.“ Juno, leiser werdend: „Er wartet. Nein. Nicht die Treppe. Ines.“ |
| 23:03 | Auf dem Weg tritt er ihr plötzlich in den Weg. Ein Streit, von dem man nur ihre Seite hört, denn er hat in diesem Kapitel keine Zeile (Vorschlag für den Wortlaut): „Sie sind nicht von der Klinik.“ „Zu spät. Er hat alles.“ „Lassen Sie mich vorbei.“ **Ashe tötet Ines** (Darstellung je nach Inhaltsoption, Story §10: schwarze Balken schließen sich, oder der Moment im Phosphor, ohne Nahaufnahme). Das alte Bild flackert und reißt dabei. Wer REC gedrückt hat, hat es: `clip_ines_death`. Wer nicht: der Puffer (Juno *muss* es haben; der Puffer hält es fest, auch wenn der Spieler zögert). | Die Klicks hören auf zu antworten. Juno sagt nichts mehr. |
| 23:04 | Ashe hebt den Kopf und sieht in die Kamera (entschieden 2026-11-06, statt zu winken): In dem weißen Fleck erscheinen zwei dunkle Augenschlitze, mehr von ihm zeigt sich nicht. Eine Störung läuft durchs Bild, das Overlay zuckt, und der Feed bricht ab: `SIGNAL LOST`. | Der Zeiger bleibt, aber nichts reagiert. |
| danach | Das Feed-Fenster bleibt auf `SIGNAL LOST`. Keine Musik, nur die Lüfter. Lange nichts. Dann Junos Wohnung, Straßenmodus. Der Spieler kann nichts anklicken, es geht von selbst weiter, die Zeilen klickt er weiter (entschieden 2026-11-06). Damit das sichtbar ist: schwarze Balken wie im Film, die Lampe ist aus, nur die Schirme des Decks leuchten noch. EVI ist die ganze Zeit in der Ecke zu sehen, mit dem besorgten Gesicht. Nach einer langen Pause Juno: „Ich hab's. Ich hab alles.“ EVI: „Er hat sie ausgeschaltet. Juno. Er hat sie ausgeschaltet.“ Zum ersten Mal hat EVI einen Menschen richtig gelesen. Abblende. „Kapitel 2: Aufnahme“. | |

**Gebaut** (`game/kapitel1_ende.js`; Bild und Figuren sind gemalt, `art/cams/cam31.px.js`, `docs/cams/cam31_x3.png`): eine gerade Kette mit dem Flag `end_beat`, also kaum neue Zustände. Beim Durchspielen prüfen: Die vier Versuche sind Knöpfe unter der Anzeige (STEUERN, CHAT: INES, LAUTSPRECHER, REVIER 9); was zurückkam, steht danach auf dem Knopf. Nach etwa 22 Sekunden geht die Szene von allein weiter (Ines steht zuerst noch am Rand, nach 12 Sekunden geht sie los, nach 15 tritt er heraus); `VOR` kürzt das ab („Das läuft auch ohne mich.“). Die Kameraleiste ist während der Szene weg, `DECK` sagt „Ich bleib. Ich bleib dran.“ Wer REC nicht gedrückt hat, sagt zuletzt: „Ich hab nicht mal REC gedrückt. Der Puffer hält alles.“ Die beiden Fassungen stehen in den Einstellungen (Seite „Inhalt“, Gewalt), Voreinstellung sind die Balken. Ines erscheint oben auf der Treppe, Ashe steht zuerst als bloßer weißer Fleck im Schatten neben der Treppe und wird hell, wo das Licht der Lampe beginnt; bei der Übergabe hält Ines die Wallet mit ihrem kleinen Licht hin. Vorschläge, noch nicht entschieden: alle Zeilen, die nicht in der Tabelle stehen, auch EVIs Hinweise.

Wenn Juno WREN den Ort verkauft hat, kommt um 23:05 eine letzte Nachricht, noch über `SIGNAL LOST`: „Zahlung erfolgt. Danke für die
Live-Übertragung.“ 750 Chits, die zweite Zeile im Kassenbuch. Es schreibt sich selbst eine dritte dazu: „Ines Calder: tot.“

## 9. Orte (neu in Kapitel 1)

### Straßenmodus

| Raum | Größe | Hauptfarbe | Ausgänge | Requisiten | Detail mit Geschichte |
|---|---|---|---|---|---|
| `lucky_static` | Iso, 5 x 4 m (`art/rooms/lucky_static.map.js`; die Straße ist die nahe linke Wand, Tür und Fenster wie von außen) | Magenta und Bernstein, Dampf | Tür → `kowalski` | Theke, Hocker, Nudelküche, Fernseher, Mei, drei Stammgäste | ein Karaoke-Automat mit einem `OUT OF ORDER`-Schild, auf dem trotzdem jeden Abend jemand singt; **ein kleines Spiel** (entschieden 2026-11-09, `game/karaoke.js`): ein Schlag, wo Mei sagt, drei Lieder, der Text läuft mit, am Strophenende das letzte Wort aus dreien wählen, ohne Timing und ohne Flag |
| `jade_row` | 320x180, ein Blick die Gasse hinunter, kein Iso (Blöcke: `art/mock/jade_row.px.js`) | Neon, Bernstein-Laternen, Lull-Cyan am Ende | rechts unten → `kowalski`, Tür → `okonkwo_shop` | Okonkwos Laden links, gegenüber der Automat, HOT SOUP, MAHJONG, Apotheke, Tor, Lull-Schirm, Sump-Runner-Automaten, ein wartender Wagen | die Laternen und die Neonstreifen über der Gasse; Schilder mit Zeichen, die kaum noch einer lesen kann |
| `gasse` | Iso, ein Steg von 6 x 9 m, das Bild 416x236, es scrollt in beide Richtungen (`art/rooms/gasse.map.js`, Kit `art/kit/gasse.kit.px.js`; **gemalt**, die Blöcke freigegeben 2026-11-09: Betonplatten nass, Moos in den Fugen an den Wänden, die Rostfahnen der Spannanker, die Feuchte vom Wasser her, ein Tag an der Wand; die Waschsalon-Front mit Emaillepaneelen, `SUDS & SPIN` in grünem Neon, ein Buchstabe stottert; die Nische mit einer blauen Plane; Mülltonnen, eine von einem Sack offen gehalten; Fischkisten; Liebesschlösser am Geländer, anklickbar: Juno und EVI reden darüber; aus dem Gully dampft es) | dunkel (der Wunsch der Nutzerin): wenige helle Neonlichter und Lichtkegel, das Grün aus dem Waschsalon gedämpft, das Magenta von unten aus dem Abgang | Torbogen in der linken Wand, am linken Bildrand → `kowalski`, Tür → `laundromat`, Abgang → `drain_market` | Die Gasse liegt hinter dem Tor in der rechten Fassade der Kowalski-Straße. **Ein langer Steg über dem Wasser** (Skizzen der Nutzerin, 2026-11-09): links die Häuser, rechts das Wasser, nach vorn links läuft er aus dem Bild. Die rechte Rückwand ist die Front von SUDS & SPIN (dieselbe Wand wie innen die vordere linke): die Tür am linken Ende unter einer Lampe mit Lichtkegel, das Fenster mit den Trocknern dahinter, das Schild, der Abluftschacht mit Dampf, ein warmes Wohnungsfenster, Tonnen und Kisten. An der linken Rückwand die Nische (eine echte Vertiefung, Matratze und Topf), der Abgang zum Drain-Markt mit `DRAIN MARKET` (wie freigegeben: die Decke fällt nach hinten ab, die Geländer steil nach unten, das Licht von unten) und vorn ein hoher Torbogen am linken Bildrand, durch den es zur Straße geht, ihr Cyan am Ende des Durchgangs (gezeichnet von der Nutzerin, 2026-11-09). Daneben ein Bildschirm mit wechselnder Werbung des Neunten, kein Lull: `TIDE MODS / GILLS -40%`, `FLOOD DEBT? WE BUY IT`, `SUMP RUNNER 3 CHITS`, alle drei Sekunden eine andere. **In der Mitte das Flutdenkmal** (der Wunsch der Nutzerin): eine Frau aus dunkler Bronze mit gesenktem Kopf, die ein kleines Boot an die Brust hält (nicht mit erhobenem Arm: das sah wie eine bekannte Statue aus), das Wasser steigt ihr in Bronze bis an die Knie; daneben eine Bronzestange, die Flutmarke, oben eine Welle, wo das Wasser stand, weit über ihrem Kopf; vor ihr Papierboote mit Kerzen; jemand hat ihr einen Heiligenschein aus Cyan-LEDs gebaut, unten Kerzen, am Sockel die Tafel mit den Namen; von oben ein Lichtkegel aus einer Lampe an den Kabeln. Rechts vorn ein Balkon: ein Geländer an der ganzen Kante, darunter die Kaimauer und das Wasser 0,8 m tiefer, in dem sich die Gasse spiegelt, Regenringe. Kabelbündel quer darüber, Pfützen. Die Zeilen an Wasser, Denkmal, Schlössern und Werbung sind ein Vorschlag | in der Nische wohnt jemand, den man nie sieht; wer zündet die Kerzen an? |
| `okonkwo_shop` | 320x180, **eine Seitenansicht, kein Iso** (entschieden 2026-11-09 von der Nutzerin, nach einem Vergleich mit einer Iso-Fassung; auf Blöcken in `art/mock/ch1_blocks.px.js`, wartet auf die Freigabe vor dem Malen): eine Bühne, die Rückwand frontal, links und rechts schmale Seitenwände; an der Rückwand der Getränkekühlschrank, Reissäcke, die Regale, das Foto, die Lagerraumtür mit Matte; die Tür zur Gasse vorne in der linken Seitenwand, das Magenta der Gasse darin; quer die Theke als eigenes Prop (`okonkwo_shop_counter`, mit der Kasse und ihrem Display zu uns), Okonkwo als ganze Figur dahinter, Juno läuft davor; das Neon des Fensters hinter uns fällt in Scheiben auf den vorderen Boden; eine nackte Glühbirne über der Theke | warmes Glühlampenlicht, Regale | Tür → `jade_row` | Theke, Tresor (dahinter), Reissäcke, Batterien, Okonkwo | ein Foto von Okonkwos Familie vor der Flut, am Strand der alten Stadt |
| `drain_market` | 480x180 (scrollt; entschieden 2026-11-09: ein größerer Raum, damit er wie ein voller Markt aussieht; der Block ist noch 320) | Bernstein, Rauch, Magenta-Neon | Treppe hinauf → `gasse`, Vorhang → `sable_booth`, Treppe hinab (Kap. 2) | Stände: Ratz' Elektroschrott, ein Garküchenstand, ein Organ-Tausch-Schild (`KIDNEYS ONLY`), gebrauchte Implantate in Gläsern | ein Prediger der „Wachen Kirche", der gegen Lull predigt; niemand hört zu |
| `sable_booth` | 320x180 | Violett und Bernstein, Rauch | Vorhang → `drain_market` | Sable hinter einem Tisch voller Bildschirme, ein Käfig mit einem Vogel aus Draht | Sables Preisliste an der Wand: `NAMES 50. ADDRESSES 80. SECRETS: ASK.` |
| `laundromat` | 320x180 | Grünstich, Neonröhren, Dampf | Tür → `gasse` | 8 Trockner in einer Reihe an der rechten Rückwand, der kaputte Trockner 6 mit einem Zettel `OUT OF ORDER`; an der linken Rückwand drei Waschmaschinen (Ines wäscht am Mittwoch) und neben der Tür die Theke, ein schlafender Mann dahinter (entschieden 2026-11-09). **Als Iso-Karte gemalt** (`art/rooms/laundromat.map.js`, 5 x 4 m, Kit `art/kit/laundromat.kit.px.js`; die Blöcke freigegeben 2026-11-09): die Gasse ist die vordere linke Wand, die Tür eine Lücke an ihrem linken Ende, das Fenster der Rest; zwei Röhren über dem Gang mit eigenem grünem Licht (die zweite stottert), die Kuppel von CAM 23 dazwischen mit ihrem roten Licht; weiße Kacheln bis 1,2 m, mintgrüne Farbe darüber, ein feuchter Fleck in der Ecke; orange Plastikstühle (die warme Farbe nah an Junos Weg). Kleine Geschichten: Waschmaschine 2 läuft (Ines), Waschmaschine 3 leckt bis zum Abfluss, ein Paket Waschpulver auf der 1, am Brett ein Zettel nach einer verlorenen Socke, eine Uhr, die um zwanzig nach vier stehengeblieben ist, auf der Theke ein Fernseher mit Schnee vor dem Schlafenden. Der Schlafende und Ines (von hinten) sind noch Blockfiguren | ein Schild `NO SNEAKERS IN THE DRYER` über den Trocknern, und hinter den Glastüren von Trockner 2, 3 und 7 kreist je ein Paar Turnschuhe (entschieden 2026-11-09) |

### Kameras

| Kamera | Ort | Blick | Besonderheit |
|---|---|---|---|
| `cam07` | Jade Row, hoch am Gassenende zur Kowalski | **das Bild von Jade Row selbst unter dem Feed-Filter** (entschieden 2026-11-09: ein Ort, ein Bild, kapitel0-design §3), nach rechts gerückt, damit Okonkwos Laden nicht unter der Kameraleiste liegt. **So gebaut** (auf Blöcken, 2026-11-09): das Bild der Jade Row um 48 px verschoben, mit ihrem Dampf und den Köpfen am unteren Rand; um 00:30 stehen Morrow und der Tidewater-Junge vor dem Laden im Maßstab der Gasse (so groß wie Juno dort), der Streifenwagen wartet weiter hinten; um 01:00 Okonkwos Rücken in seiner Ladentür; der eigene Block `cam07_bg` ist weg | eine Stellung (§4) |
| `cam07v` | Automatenkamera | **das Bild von Okonkwos Laden (`okonkwo_shop`) selbst unter dem Feed-Filter** (entschieden 2026-11-09: ein Ort, ein Bild), der Laden ist schon vom Fenster aus gesehen wie vom Automaten. **So gebaut** (auf Blöcken, 2026-11-09): Okonkwo steht hinter der Theke wie im Laden (seit der Laden eine Seitenansicht ist, als ganze Figur, die Theke als Prop vor ihm), abends und um eins an der Kasse; ihr Display zeigt zur Kamera; die eigenen Blöcke `cam07v_bg` und `cam07v_counter` sind weg | erst nach dem Abzweiger; sieht ins Ladenfenster: Regale, Theke, der Tresor in ihrem Ende (§4) |
| `cam14` | Kessel-Block, 14. Stock | **das Iso-Bild des Flurs selbst unter dem Feed-Filter** (entschieden 2026-11-09), etwas nach rechts gerückt, damit Frau Haldanes Tür nicht unter der Kameraleiste liegt, heller belichtet; die Kamera fehlt im eigenen Bild | der Zeitungskrieg (§7): die Zeitungen am Treppenkopf |
| `cam15` | Kapselhotel Morpheus | ein Gang mit Kapseln, nummeriert | Kapselbildschirme lassen sich steuern (K1a warnen) |
| `cam21` | Lull-Klinik 9-Ost, Eingang | weiß, eine Schlange müder Menschen, Nagi·wa-Logo | Junos alter Zugang |
| `cam22` | Pho Pump | Bar-Kamera über der Theke | Code auf der Speisekarte |
| `cam23` | Waschsalon SUDS & SPIN | **das Iso-Bild des Waschsalons (`laundromat`) selbst unter dem Feed-Filter**, wie `cam14` (entschieden 2026-11-09: ein Ort, ein Bild, kapitel0-design §3); die Kamera hängt dort über dem Gang; um 24 px nach rechts gerückt, Ines dort im Maßstab des Raums (ein Block, `mock_ines`, als Pose ihrer Figur, solange sie in `cam23` ist), der Schlafende hinter der Theke | Code „0000" |
| `cam24` | Wohnblock Lerche | Haustürkamera, Fischauge | optional |
| `cam30` | Sumpf-Abgang | eine Treppe ins Wasser, ein Schild „LINE 31 – CLOSED", daneben eine Pegeltafel (`LOW TIDE`, `FRI 23:00`) | Junos alter Zugang |
| `cam31` | alte Metro, Linie 31 | Bahnsteig unter Wasser, Notlicht | nur über das alte Protokoll; körniger als alle anderen |

**Die Einstellungen der Kameras** (die Richtung entschieden 2026-11-09; jede wird mit ihrem Ort skizziert und erst nach Freigabe gemalt): Keine Kamera schaut mehr frontal und flach. ~~`cam07` hoch und steil die Gasse hinunter, ein Kabelbündel und eine Laterne quer im Vordergrund; `cam07v` ein starkes Fischauge auf Hüfthöhe, der Coupon-Rahmen des Automaten im Bild, Beine von Passanten ganz nah~~ (ersetzt am selben Tag: ein Ort, ein Bild; `cam07` ist Jade Row, `cam07v` Okonkwos Laden); `cam15` die Zentralperspektive einen langen Gang hinunter, Kapseln zweistöckig, Kessler geht von uns weg; `cam18` gekippt, hoch an der Laterne über der Treppe (Frau Imais „als hinge ich an einer Laterne“); `cam21` über der Klinik-Tür nach draußen, die Schlange kommt auf uns zu; `cam22` hinter der Theke über die Schulter des Kochs, Dampf im Vordergrund, Ines uns gegenüber; ~~`cam23` senkrecht von oben, die Trommeltüren als Kreise~~ (ersetzt am selben Tag: **ein Ort, ein Bild**, kapitel0-design §3: Wo Juno hingehen kann, zeigt die Kamera genau die Szene des Straßenmodus, `cam23` also den Waschsalon in Iso); `cam24` eine Türklingel-Kamera, extremes Fischauge auf Augenhöhe; `cam30` tief am Wasser, die Treppe hinauf, Spiegelungen im Vordergrund. `cam14` bleibt das Iso-Bild des Flurs unter dem Filter.

### Wege und Zeit

| Was | Kostet |
|---|---|
| alle Wege, das Deck, der Chat, Kaufen | nichts |
| Warten: am Deck und in jedem Feed | bis zum nächsten Ereignis |

Die Uhr läuft nur beim Warten (entschieden im Mock, 2026-11-05): So kann man nichts durch einen Weg verpassen, und alle Zeiten liegen auf den 15-Minuten-Takten. Jede andere Uhrzeit würde jeden Zustand vervielfachen. Beim Durchspielen prüfen, ob sich das richtig anfühlt.

## 10. Figuren (neu in Kapitel 1)

Größen wie in `kapitel0-design` §8: 30 px pro Meter Höhe; im Feed misst ein Erwachsener von 1,75 m etwa 24 px.

| Wer | Größe | Silhouette und Akzent im Feed | Farbe | Ansichten |
|---|---|---|---|---|
| Teo | 52 px | orange Weste, Gehörschutz, Kiemenschlitze (Gezeitenmod) | `#ffa040` | Iso |
| Sable | 53 px | langer magentafarbener Mantel, Glatze, Pfeifenglut | `#ff4fd3` | Iso (sitzend) |
| Ratz | 26 px (aufrecht) | Kabelratte: Kopfhörer, zu großer Parka, Schwanz, glimmender Sprechkragen | `#90d0a0` | Iso |
| Herr Okonkwo | 48 px | Strickjacke, Lesebrille | `#d8b890` | Iso + Feed |
| Mei | 47 px | Schürze, hochgesteckte Haare | `#ff9a7a` | Iso |
| Dr. Ines Calder | 47 px | Kittel (heller als alles), Zopf | `#f0a0c0` | Feed (6 Kameras: `cam21`–`cam24`, `cam30`, `cam31`) |
| Lantern | im Feed 32 px (Silhouette wie das Rollstuhl-Piktogramm) | bunter Flicken-Poncho, Rollstuhl mit Schwimmer, Antennen; sein Gesicht: grüner Iro, Okular, kleine Laterne am Hals (Story §10c, `docs/portraits/lantern_x4.png`; die Feed-Figur bleibt mit Kapuze) | `#b0f0a0` | Feed |
| Ashe | 55 px | weißer Mantel, Maske (überstrahlt) | `#ff7a6a` | Feed |
| Lt. Morrow | 50 px | Trenchcoat | `#a8b8d0` | Feed |
| Tidewater-Junge | 44 px | Gezeitenkind: Kiemen, leuchtende Markierung am Hals, Kapuze | `#7ab0c0` | Feed |

## 11. Rätselkette als Überblick

```
 Abend 1 ─ Nachrichten: A (Varga), B (TIDE), C (WREN) ─ Teo kommt vorbei
   │
   ├─ A: cam03 Kessler ohne Schal ─ Automat Nr. 7 / Ringstreifen ─ cam15 (Code bei Sable) ─ Kapsel 23 ─ K1a
   ├─ B: cam07 schwenken ─ falscher Winkel ─ Abzweiger (Ratz / Motte) ─ Automat anzapfen (Drohne!) ─ cam07v ─ Code ─ K1b
   │      └─ optional: Morrows Bestechung aufzeichnen
   └─ C: cam21 ─ cam22 ─ cam23 ─ (Abend 2) Stick in Trockner 6
           ├─ optional selbst hingehen: den Stick zurücklegen oder behalten
           └─ 20:15 cam30: Ines an der Pegeltafel → „Fr 23:00, Linie 31"
           └─ cam31 über das alte Protokoll verbinden ─ Abend 3: Entscheidung 1
                                                                  │
 Abend 3 ─ Miete (Teo springt ein, falls nötig) ─ 23:00 cam31 ─ der Mord ─ Kapitel 2
```

Regeln: Jeder Auftrag ist in sich lösbar, ohne dass ein anderer erledigt sein muss; das Ende braucht
nur `know_meeting` und `link_cam31`. Wer A und B nicht macht, hat weniger Geld und ein leichteres
Kassenbuch; Teo zahlt. Der Solver prüft alle Reihenfolgen über die drei Abende.

## 12. Hinweise

Die Hinweise spricht EVI (Prolog-Design §2.2, §6.5). Die Tabelle nennt die schweren Stellen; beim Bau bekommt jeder Zustand auf dem Weg einen Hinweis (`tools/solve-act.mjs kapitel1 --full` prüft das).

| Für | Stufe 1 | Stufe 2 | Stufe 3 |
|---|---|---|---|
| A2/A3 | „Kessler versteckt sich. Aber Gewohnheiten versteckt man schlecht." | „Was hat Frau Kessler über sein Essen geschrieben?" | „Zoome auf den Nudelautomaten in cam03: Wer zieht Nr. 7?" |
| A5 | „Das Kapselhotel hat ein eigenes Netz." | „Wer verkauft Zugänge?" | „Kauf Sable den Code zu cam15 ab." |
| B3/B4 | „Von oben sieht man nur seinen Rücken." | „Gibt es auf der Straße etwas, das auf Augenhöhe schaut?" | „Der Automat vor dem Laden hat eine Kamera. Zapf sie an." |
| B5 | „Zum Anzapfen brauchst du ein Gerät." | „Auf dem Drain-Markt gibt es Elektroschrott. Oder frag Motte." | „Kauf bei Ratz einen Abzweiger." |
| B6 | „Die Drohne passt auf." | „Ihr Licht wandert. Warte." | „Benutze den Abzweiger, wenn der Lichtkegel weg ist." |
| C6 | „Sie ist nicht nach Hause gegangen. Da ist doch ihr Bett.“ | „Der Sumpf-Abgang hat eine Kamera. Dein alter Zugang geht da.“ | „Öffne CAM 30. Um Viertel nach acht ist sie da.“ (Verpasst: „Öffne CAM 30 und drück PUFFER.“) |
| Der Stick (optional) | „Ines hat was in Trockner 6 gelegt. Das ist gar nicht weit.“ | „Durch die Gasse zum Waschsalon. Oder du lässt es.“ | „Warte bis eins und geh ins Bett. Dann ist der nächste Abend.“ |
| C7 | „CAM 31 ist älter als Nagi·wa. Sie will einen Takt, keinen Code." | „Den Takt hat jeder, der mit Lull schläft. Motte zählt ihn bei seiner Mutter mit. Frag ihn." | „Lang, kurz, kurz, lang. Klick CAM 31 an und gib das ein." |
| Die Drohung in `cam31` | „Ich hab nichts. Keine Tür, kein Licht, keine Nummer." | „Ich such weiter. Ich find nichts, was geht." | „Du kannst nichts tun, Juno. Ich auch nicht." |
| Danach, in der Wohnung | „Juno?" | „Du sitzt nur da." | „Sag was. Bitte." |
| Miete | „900 Chits bis Freitag." | „Jeder Auftrag bringt Geld. Oder jemand hilft dir." | „Du musst nichts verkaufen. Teo zahlt, wenn es nicht reicht." |

## 13. Was die Engine zusätzlich braucht (gegenüber dem Prolog)

1. **Tage** mit Abendstart, Schlafen, Fristen; Momente, die sich jede Nacht wiederholen, und solche,
   die nur einmal kommen.
2. **Steuern im Feed:** Kamerastellungen, Bildschirme, Türen.
3. **Geld** als Zahl mit Bedingungen (`chits >= 80`), Kauf und Tausch bei Händlern.
4. **Eine Figur, die patrouilliert** (die Drohne) und eine Handlung im Straßenmodus blockiert, solange
   ihr Lichtkegel auf Juno liegt.
5. **Das Kassenbuch** mit Einträgen, die sich in späteren Kapiteln selbst ergänzen.
