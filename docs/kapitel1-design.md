# Kapitel 1 „Glas": Design

Stand: Entwurf (2026-11-03). Story: `docs/story.md` (§7 Kapitel 1). Regeln für Deck, Feed-Modus und
Zeit: `docs/kapitel0-design.md` §2–4. Stil: `docs/style-guide.md`.

## 1. Überblick

| | |
|---|---|
| Länge | etwa 2 Std. |
| Ziel | die Miete (900 Chits) in drei Tagen |
| Aufbau | **offen**: drei Aufträge, in beliebiger Reihenfolge und parallel, über drei Abende verteilt; das Kapitel endet am dritten Abend mit dem Treffen in der alten Metro |
| Neu im Spiel | der Drain-Markt und Sable (persönlich), Werkzeuge kaufen, Steuern im Feed, Kamera vor Ort anzapfen, die Tage, Teo, die Polizei (Morrow, kurz) |
| Orte, Straßenmodus | `flat`, `kessel_14`, `kessel_lobby`, `kowalski`, `lucky_static`, `okonkwo_shop`, `drain_market`, `sable_booth`, `laundromat` (9) |
| Kameras | `cam03`, `cam04`, `cam07` (Kowalski-Straße, das Mockup E), `cam07v` (die Automatenkamera), `cam12` (Eingang Drain-Markt), `cam15` (Kapselhotel Morpheus), `cam21`–`cam24` (Ines' Wege), `cam30` (Sumpf-Abgang), `cam31` (alte Metro) (12) |
| Entscheidungen | K1a (Kessler), K1b (der Eckladen), **Entscheidung 1** (WREN) |
| Ende | der Mord an Ines in `cam31` |

## 2. Die drei Tage

Juno lebt nachts. Ein „Tag" ist ein Abend und eine Nacht (18:00 bis 04:00); Schlafen im Bett springt
zum nächsten Abend. Jeder Abend beginnt mit neuen Nachrichten auf dem Deck.

| Abend | Was neu ist | Was an diesem Abend geschieht |
|---|---|---|
| **1 (Mi)** | drei Auftragsangebote: Varga (A), die Tidewater Boys (B), WREN (C) | Teo kommt vorbei (§6). Ines' erster beobachtbarer Abend. Der Drain-Markt ist offen. |
| **2 (Do)** | eine Mahnung vom Vermieter, die Werbung „Lull: 2 Wochen gratis" | Ines legt den Stick in den Trockner (20:00); Lantern holt ihn (03:00). Okonkwo öffnet den Tresor (01:00). Kessler kann gefunden werden. |
| **3 (Fr)** | Varga drängt („Freitag ist heute."), WREN will „bis 22 Uhr" den Ort | die Miete ist um Mitternacht fällig (§5). 23:00 das Treffen in der Metro, `cam31`. Kapitelende. |

Was nicht an einen Abend gebunden ist, geht an jedem (die Aufträge A und B lassen sich am Abend 1, 2
oder 3 abschließen, sofern ihr Moment noch kommt; ihre Momente wiederholen sich jede Nacht, außer wo
angegeben). WREN führt durch die drei Abende und erzwingt am dritten das Ende.

## 3. Auftrag A: „Der verschwundene Schuldner" (Varga)

Gus Varga, der Kredithai aus dem Prolog, schreibt: „Du warst bei Yuen's. Ich hab dich nicht gesehen,
aber ich weiß, wie das läuft. Kessler ist weg. Finde ihn. 400." (Er hat Junos Namen von Sable; wenn
Juno Sable im Prolog Kessler verkauft hat, sagt Varga das offen: „Sable sagt, du bist gut.")

### Kette

| # | Wo | Was passiert | Flags / Dinge |
|---|---|---|---|
| A1 | Deck | Auftrag annehmen (oder ablehnen: dann sucht Varga selbst, und Kessler wird am Abend 3 trotzdem gefunden: Kassenbuch ohne Juno, aber in den Nachrichten). | `job_a` |
| A2 | `cam03` | Kessler geht nicht mehr zur Arbeit? Doch: er muss. Abend 2, 22:00 kommt er aus dem Bürohaus, aber **ohne Schal** und mit Kapuze. Die Markierung von gestern findet ihn nicht. | — |
| A3 | `cam03` | Ihn erkennen: am **Nudelautomaten**, wo er jeden Abend dieselbe Sorte zieht (Zoom auf die Taste: „Nr. 7, Huhn scharf"; Frau Kesslers Nachricht im Prolog erwähnte es: „Er isst nur noch Automatennudeln, Nummer 7."). Oder: Zoom auf seine Hand: der helle Streifen, wo der Ring war. Markieren. | `tag_kessler2` |
| A4 | `cam03` → `cam15` | Folgen: er geht zum **Kapselhotel Morpheus** (`cam15`, nicht verbunden). Der Code steht nicht auf der Kamera; das Hotel hat ein eigenes Netz. | — |
| A5 | `sable_booth` | Sable verkauft Zugänge: der Code zu `cam15` für 80 Chits, oder als Tausch gegen Shine (eine Notiz aus Junos Cache). | `code_cam15` |
| A6 | `cam15` | Der Gang des Kapselhotels, Reihen von Kapseln mit Nummern. Kessler kriecht in Kapsel 23. Zoom: Nummer lesen. | `note_kessler_hideout` |
| A7 | **Entscheidung K1a** | siehe unten | |

### Entscheidung K1a

| Wahl | Was Juno tut | Folge | Kassenbuch |
|---|---|---|---|
| **Verkaufen** | Varga das Versteck senden | 400 Chits. Am nächsten Abend in `cam15`: Vargas Leute holen Kessler aus der Kapsel (nicht gezeigt, nur die leere, offene Kapsel und eine zerbrochene Brille). In Kap. 2 sitzt Kessler mit Gips auf dem Drain-Markt und bettelt. | „Varga: Kessler, Kapsel 23. 400." später: „Kessler: zwei Rippen, ein Arm. Bettelt." |
| **Warnen** | in Person zum Kapselhotel? Nein: über das Hotelnetz eine Nachricht auf Kapsel 23s Bildschirm (Steuern im Feed) | kein Geld. Kessler flieht aus der Stadt (Transitachse, nach oben). Varga ist verärgert; in Kap. 2 hat Juno bei Sable einen schlechteren Kurs („Varga redet."). Frau Kessler bekommt eine Postkarte (Epilog). | „Kessler: gewarnt. 0." |
| **Lügen** | Varga einen falschen Ort senden | Varga zahlt 200 im Voraus, findet nichts, will sein Geld zurück: in Kap. 2 ein Feed-Moment, wo Vargas Mann vor dem Kessel-Block wartet. | „Varga: ein falscher Ort. 200 (geliehen)." |

## 4. Auftrag B: „Der Eckladen" (die Tidewater Boys)

Eine Nachricht von „TIDE": „Okonkwo, Kowalski 9. Wir wollen den Tresorcode. 500. Keine Fragen." Der
Laden ist zwei Häuser neben LUCKY STATIC. Herr Okonkwo verkauft Reis, Batterien und Raucherwaren und
grüßt Juno jeden Abend.

### Kette

| # | Wo | Was passiert | Flags / Dinge |
|---|---|---|---|
| B1 | Deck | annehmen | `job_b` |
| B2 | `cam07` | Die Kowalski-Straße von oben (das Mockup E). Ins Ladenfenster sieht man nur schräg. Die Kamera hat drei Stellungen (Steuern): in Stellung 3 sieht sie durch das Fenster auf die Theke. | — |
| B3 | `cam07` | 01:00 schließt Okonkwo, kniet sich hinter die Theke, öffnet den Tresor. Von oben verdeckt sein Rücken das Tastenfeld. Juno: „Falscher Winkel. Ich brauch was auf Augenhöhe." | — |
| B4 | `kowalski` | Der Automat vor dem Laden hat eine eigene kleine Kamera (Werbung, „Lächeln für einen Gutschein!"). Ansehen: „Die Automatenkamera. Sieht genau durchs Fenster." Sie hängt nicht am Netz: Man muss sie anzapfen. | — |
| B5 | `drain_market` | Ein Händler (Ratz, ein Junge mit Kopfhörern, Stand mit Elektroschrott) verkauft einen **Abzweiger**: 60 Chits. Oder Motte baut einen aus Junks, wenn Juno ihm im Prolog freundlich geantwortet hat und ihm jetzt eine Lektion gibt (§7). | `+tap` |
| B6 | `kowalski` | Den Abzweiger am Automaten benutzen (Straßenmodus, Juno kniet sich hin). Die Drohne patrouilliert: Nur wenn ihr Lichtkegel weg ist (alle 8 Sekunden), sonst: „Nicht, solange die Drohne guckt." | `linked_cam07v` |
| B7 | `cam07v` | Ein Fischauge auf Hüfthöhe, die Ladentheke im Hintergrund. 01:00: das Tastenfeld, Zoom: der Code `4-1-7-0-9`. Aufzeichnen oder notieren. | `note_safe_code` |
| B8 | `cam07` | **Morrow**: Abend 2 oder 3, 00:30, ein Polizeiwagen hält vor dem Laden. Lt. Morrow nimmt von einem Tidewater-Jungen einen Umschlag. Zuhören: „Das ist für die ruhige Woche. Und haltet euch von der Kowalski fern." Moment `morrow_bribe` (für Kap. 2 und 4 wichtig, wer ihn aufzeichnet, hat etwas gegen Morrow). | optional `+clip_morrow_bribe` |
| B9 | **Entscheidung K1b** | siehe unten | |

### Entscheidung K1b

| Wahl | Was Juno tut | Folge | Kassenbuch |
|---|---|---|---|
| **Verkaufen** | den echten Code an TIDE | 500 Chits. Kap. 2: der Laden wird ausgeraubt; Bao, der Okonkwo helfen will, wird niedergeschlagen. Baos Wagen ist eine Woche zu. | „TIDE: Okonkwos Tresor. 500." später: „Okonkwo: ausgeraubt. Bao: Gehirnerschütterung." |
| **Falscher Code** | einen falschen | 250 im Voraus. Kap. 2: die Boys scheitern am Tresor, kommen zu Juno: eine Drohung an ihrer Tür (Graffiti „GLASERIN LÜGT"). Die Tidewater Boys sind Feinde (Nebengeschichte). | „TIDE: ein falscher Code. 250." |
| **Okonkwo warnen** | in den Laden gehen und es ihm sagen | kein Geld. Okonkwo ändert den Code, gibt Juno eine Stange Reis und Batterien („Ich vergesse das nicht.") und später, in Kap. 4, ein Versteck im Lagerraum. Die Boys suchen einen Verräter. | „Okonkwo: gewarnt. Eine Stange Reis." |

## 5. Die Miete

- 900 Chits um Mitternacht am Abend 3. Was Juno hat, zahlt sie vom Konto (Deck, Reiter Konto, oder im
  Flur beim Hausverwalter-Terminal).
- Reicht es nicht, schreibt Teo am Abend 3 um 21:00: „Hab gehört, die Miete. Ich hab Schichten
  gemacht. Schon überwiesen. Sag nichts." Der Rest ist bezahlt. Teo hat dafür noch mehr Doppelschichten
  auf Lull gemacht. Das steht nicht im Kassenbuch, aber Juno weiß es (eine Zeile, wenn sie auf ihrem
  Bett sitzt).
- Möglich: 400 (A) + 500 (B) + 1500 (WREN) = viel zu viel. Der Spieler, der alles verkauft, ist reich
  und hat ein schweres Kassenbuch; der, der alle warnt, lebt von Teo.

## 6. Auftrag C: „WREN" (der Hauptfaden)

### Der Auftrag

Abend 1, eine Nachricht ohne Absender außer `WREN`: „Dr. Ines Calder, Lull-Klinik 9-Ost. Wir wollen
wissen, wen sie trifft und wo. 1500, die Hälfte jetzt. Diskretion." Ein Foto: eine Frau mit dunklem
Zopf im Kittel. 750 Chits sind schon auf dem Konto. Juno: „Wer bezahlt im Voraus? Niemand bezahlt im
Voraus."

Ablehnen geht nicht sofort (das Geld ist da); Juno kann es zurückschicken, dann bleibt der Auftrag
trotzdem in den Nachrichten, und WREN schreibt: „Behalten Sie es. Sie werden es sich anders
überlegen." Juno sieht trotzdem hin: „Ich will wissen, warum jemand so viel für eine Krankenschwester
zahlt." Die Kette ist dieselbe; nur die Entscheidung am Ende (C9) ändert sich.

### Ines' Ablauf

| Zeit | Abend 1 | Abend 2 | Abend 3 |
|---|---|---|---|
| 19:00 | verlässt die Klinik (`cam21`) | dito | dito |
| 19:20 | Nudelbar „Pho Pump" (`cam22`), allein, schreibt etwas auf eine Serviette, steckt sie ein | dito, aber sie schaut oft zur Tür | geht nicht in die Nudelbar |
| 20:00 | Waschsalon „Schaum & Schleuder" (`cam23`), wäscht, sonst nichts | Waschsalon, legt einen **Datenstick** in Trockner 6 und geht ohne Wäsche | — |
| 20:30 | nach Hause, Wohnblock Lerche (`cam24`) | dito | 22:20 verlässt das Haus mit einer Tasche, Richtung Sümpfe (`cam30`) |
| 03:00 | — | **ein Mann im geflickten Poncho mit Antennen** holt den Stick aus Trockner 6 (`cam23`) | — |
| 23:00 | — | — | das Treffen (`cam31`) |

### Kette

| # | Wo | Was passiert | Flags / Dinge |
|---|---|---|---|
| C1 | Deck | `cam21` ist verbunden (eine Halcyon-Kamera der Klinik, die Juno noch kennt: ihr alter Zugang funktioniert hier, „Sie haben die Codes nie geändert."). Ines markieren. | `tag_ines` |
| C2 | `cam21` → `cam22` | Folgen. `cam22` ist eine Bar-Kamera, verbunden über das Bar-WLAN (der Code steht auf der Speisekarte im Fenster, Zoom aus `cam21`). Die Serviette: Zoom, sie hält die Hand darüber. | `linked_cam22` |
| C3 | `cam22` → `cam23` | Folgen. `cam23`: der Waschsalon hat eine billige Kamera, Code ist ab Werk „0000" (Juno: „Natürlich."). | `linked_cam23` |
| C4 | `cam23` → `cam24` | Folgen nach Hause. `cam24` ist eine Haustürkamera, Code im Hausnetz; sie ist erst am Abend 2 verbunden (Sable, oder: das Kassenbuch-Rätsel, siehe Nebengeschichte Motte). Optional. | — |
| C5 | `cam23` | Abend 2, 20:00: der Stick in Trockner 6. **Moment** `ines_drop`. | `saw_drop` |
| C6a | `laundromat` | Juno geht selbst hin (Straßenmodus, zwischen 20:05 und 03:00), öffnet Trockner 6, steckt den Stick in ihr Deck-Kabel: eine Nachricht, codiert mit Waschsalon-Ticketnummern. Auf der Theke liegen Tickets: „Ticket 31 – Fr 23:00". Juno: „Einunddreißig. Die alte Metrolinie 31? Freitag, elf Uhr." Sie legt den Stick zurück (oder nimmt ihn: dann fehlt er Lantern, und in Kap. 2 sucht Lantern ihn bei Juno). | `know_meeting`, ggf. `+stick_ines` |
| C6b | `cam23` | Oder: um 03:00 den Mann im Poncho markieren und ihm folgen: `cam12` (Drain-Markt-Eingang) → `cam30` (der Sumpf-Abgang, er verschwindet die Treppe hinab, auf ein Schild „LINE 31 – CLOSED" zu). Juno zählt zusammen. | `know_meeting`, `tag_lantern` |
| C7 | Deck | `cam31` verbinden: eine **alte Metro-Kamera**, aus der Zeit vor Halcyon. Kein Code findet sie. Erst das alte Beobachter-Protokoll aus Junos Implantat (Netzkarte: Rechtsklick auf `cam31`, Juno: „Das alte Protokoll. Das kann nur noch mein Kopf.") verbindet sie. Ein Moment des Schauders: Im Rauschen vor dem Bild sieht man für einen Takt das Auge. | `linked_cam31` |
| C8 | Deck | WREN drängt am Abend 3: „Bis 22 Uhr. Wo und wann." | — |
| C9 | Deck | **Entscheidung 1**: WREN den Ort senden oder nicht (unten). | `e1_sold` / `e1_refused` |
| C10 | `cam31` | 23:00. Siehe §8. | Kapitelende |

### Entscheidung 1

| Wahl | Was geschieht | Kassenbuch |
|---|---|---|
| **Senden** | 750 Chits (der Rest). WREN: „Danke. Und schauen Sie heute Nacht zu. Für die Live-Übertragung zahlen wir das Doppelte." Juno sieht zu. | „WREN: Ines Calder, Metro 31, Fr 23:00. 1500." |
| **Nicht senden** | WREN: „Schade. Es gibt andere Glaser." Juno sieht trotzdem zu, um Ines zu warnen; aber um 22:45 kommt sie nicht mehr an sie heran (Ines' Komm ist aus; Juno kann ihr nur zusehen). Später im Kassenbuch: „WREN hat es von jemand anderem." | „WREN: nichts geliefert. 750 (behalten oder zurückgeschickt)." |

Beide Wege führen in dieselbe Szene. Der Unterschied zeigt sich im Kassenbuch, in den Zeilen und in
Kap. 2 (die Quiet weiß dann, dass Juno die Glaserin war, oder sucht sie erst).

## 7. Das Leben drumherum

| Wann | Wo | Was |
|---|---|---|
| Abend 1, 18:30 | `flat` | **Teo** klopft. Orange Weste, Gehörschutz um den Hals, ein Lull-Pflaster hinter dem Ohr. Er bringt Essen von Bao. Er lacht über seine Doppelschichten („Vier Stunden Lull, und ich bin wie neu."). Ansehen des Pflasters: Juno: „Seit wann?" Teo: „Seit es gratis ist." Ein Dialog über ihre Halcyon-Zeit (Teo: „Du redest noch immer, als hätten sie dich gefeuert, weil du schlecht warst."). |
| jeder Abend | `kowalski` | Der Werbebildschirm stottert, wenn Juno vorbeigeht. Abend 2 zeigt er eine Sekunde lang das Bild aus `cam03` (Kessler unterm Vordach, eine Nacht alt). Abend 3 nur das Auge. |
| Abend 1–3 | `kessel_14` | **Motte** wartet auf der Treppe. Wenn Juno ihm im Prolog freundlich geantwortet hat: „Zeigst du mir was?" Drei Lektionen (je eine pro Abend, ein kleiner Dialog): was eine Kamera ist, wie man einen Code findet, warum man nie seinen eigenen Block glast. Nach der zweiten baut er den Abzweiger (B5). Nach der dritten: `moth_student` (in Kap. 3 warnt er Juno vor der Razzia). |
| Abend 2 | `kessel_14` | Frau Haldane, wach, an ihrer Tür: Ihr Sohn schreibt nicht mehr aus den mittleren Ringen. Eine Nebengeschichte beginnt (Story §9). |
| Abend 2 | `lucky_static` | Die Bar von innen: Stammgäste, ein Fernseher mit Halcyon-Nachrichten („Kriminalität im Neunten auf Rekordtief"), die Wirtin Mei (`#ff9a7a`), die Juno anschreiben lässt. Gespräche: Gerüchte über Sinker („Der Sohn vom Fischmann ist nicht aufgewacht. Ruhe-Erschöpfung, sagen sie."). |
| Abend 3, 21:00 | Deck | Teos Nachricht wegen der Miete (§5), falls nötig. |

## 8. Das Ende: CAM 31

Feed-Modus, `cam31`. Eine alte Metro-Station unter Wasser bis zum Bahnsteig; eine einzelne
Notbeleuchtung; Tropfen. Die Kamera ist alt, ihr Bild körniger als alle anderen. Juno kann nichts tun
außer zusehen, aufzeichnen und markieren.

| Zeit | Was geschieht |
|---|---|
| 22:55 | Ines kommt die Treppe herunter, Tasche in der Hand. Sie wartet am Bahnsteigrand. |
| 23:00 | Lantern kommt aus dem Tunnel (Poncho, Antennen). Zuhören: Ines: „Es ist alles drauf. Die Protokolle passen auf die Sekunde." Lantern: „Wenn das stimmt ..." Ines: „Es stimmt. Sie schlafen nicht. Sie *arbeiten*." Sie gibt ihm ein Laufwerk. |
| 23:02 | Ein Mann im weißen Regenmantel tritt aus dem Schatten der Treppe. Im Feed hat er kein Gesicht: Seine Maske überstrahlt die Kamera zu einem weißen Fleck. Das Overlay versucht ihn zu markieren und zeigt `???`, dann rot `BEDROHUNG`. |
| 23:02 | Lantern springt ins Wasser, in den Tunnel. Ines nicht. **Rask tötet Ines** (Darstellung je nach Inhaltsoption, Story §10: schwarze Balken schließen sich, oder der Moment im Phosphor, ohne Nahaufnahme). Wer REC gedrückt hat, hat es: `clip_ines_death`. Wer nicht: der Puffer (Juno *muss* es haben; der Puffer hält es fest, auch wenn der Spieler zögert). |
| 23:03 | Rask hebt den Kopf und sieht in die Kamera. Er hebt eine Hand und winkt. Das Overlay zuckt. Der Feed bricht ab: `SIGNAL LOST`. |
| danach | Junos Wohnung, Straßenmodus, ohne Musik. Juno sitzt vor dem schwarzen Bildschirm. Der Spieler kann nichts anklicken außer Juno selbst: „Ich hab's. Ich hab alles." Abblende. „Kapitel 2: Aufnahme". |

Wenn Juno WREN den Ort verkauft hat, kommt um 23:05 eine letzte Nachricht: „Zahlung erfolgt. Danke
für die Live-Übertragung." 750 Chits. Das Kassenbuch schreibt sich selbst eine Zeile dazu: „Ines
Calder: tot."

## 9. Orte (neu in Kapitel 1)

### Straßenmodus

| Raum | Größe | Hauptfarbe | Ausgänge | Requisiten | Detail mit Geschichte |
|---|---|---|---|---|---|
| `lucky_static` | 320x180 | Magenta und Bernstein, Dampf | Tür → `kowalski` | Theke, Hocker, Nudelküche, Fernseher, Mei, drei Stammgäste | ein Karaoke-Automat mit „DEFEKT"-Schild, auf dem trotzdem jeden Abend jemand singt |
| `okonkwo_shop` | 320x180 | warmes Glühlampenlicht, Regale | Tür → `kowalski` | Theke, Tresor (dahinter), Reissäcke, Batterien, Okonkwo | ein Foto von Okonkwos Familie vor der Flut, am Strand der alten Stadt |
| `drain_market` | 480x180 (scrollt) | Bernstein, Rauch, Magenta-Neon | Leiter hinauf → `kowalski` (über die Gasse), Vorhang → `sable_booth`, Treppe hinab (Kap. 2) | Stände: Ratz' Elektroschrott, ein Garküchenstand, ein Organ-Tausch-Schild („nur Nieren"), gebrauchte Implantate in Gläsern | ein Prediger der „Wachen Kirche", der gegen Lull predigt; niemand hört zu |
| `sable_booth` | 320x180 | Violett und Bernstein, Rauch | Vorhang → `drain_market` | Sable hinter einem Tisch voller Bildschirme, ein Käfig mit einem Vogel aus Draht | Sables Preisliste an der Wand: „Namen 50. Adressen 80. Geheimnisse: Verhandlungssache." |
| `laundromat` | 320x180 | Grünstich, Neonröhren, Dampf | Tür → Straße (Bezirkswechsel, kostet 1 Takt) | 8 Maschinen, Trockner 6, die Ticket-Theke, ein schlafender Mann | ein Schild „KEINE TURNSCHUHE IM TROCKNER" mit drei Paar Turnschuhen darunter |

### Kameras

| Kamera | Ort | Blick | Besonderheit |
|---|---|---|---|
| `cam07` | Kowalski-Straße | das Mockup E | drei Stellungen (Steuern) |
| `cam07v` | Automatenkamera | Fischauge, Hüfthöhe | erst nach dem Abzweiger; sieht ins Ladenfenster |
| `cam12` | Drain-Markt-Eingang | von oben auf die Leiter und das Gittertor | Lantern geht hier durch (C6b) |
| `cam15` | Kapselhotel Morpheus | ein Gang mit Kapseln, nummeriert | Kapselbildschirme lassen sich steuern (K1a warnen) |
| `cam21` | Lull-Klinik 9-Ost, Eingang | weiß, eine Schlange müder Menschen, Halcyon-Logo | Junos alter Zugang |
| `cam22` | Pho Pump | Bar-Kamera über der Theke | Code auf der Speisekarte |
| `cam23` | Schaum & Schleuder | von der Decke, die Trockner in einer Reihe | Code „0000" |
| `cam24` | Wohnblock Lerche | Haustürkamera, Fischauge | optional |
| `cam30` | Sumpf-Abgang | eine Treppe ins Wasser, ein Schild „LINE 31 – CLOSED" | — |
| `cam31` | alte Metro, Linie 31 | Bahnsteig unter Wasser, Notlicht | nur über das alte Protokoll; körniger als alle anderen |

## 10. Figuren (neu in Kapitel 1)

| Wer | Größe | Silhouette und Akzent im Feed | Farbe | Ansichten |
|---|---|---|---|---|
| Teo | 33 px | orange Weste, Gehörschutz | `#ffb070` | Iso |
| Sable | 34 px | langer Mantel, Glatze, Pfeifenglut | `#c890ff` | Iso (sitzend) |
| Ratz | 26 px | Kopfhörer, zu großer Parka | `#90d0a0` | Iso |
| Herr Okonkwo | 31 px | Strickjacke, Lesebrille | `#d8b890` | Iso + Feed |
| Mei | 30 px | Schürze, hochgesteckte Haare | `#ff9a7a` | Iso |
| Dr. Ines Calder | 30 px | Kittel (heller als alles), Zopf | `#f0a0c0` | Feed (4 Kameras) |
| Lantern | 32 px | Poncho, Antennen über dem Kopf | `#b0f0a0` | Feed |
| Rask | 35 px | weißer Mantel, Maske (überstrahlt) | `#ff7a6a` | Feed |
| Lt. Morrow | 32 px | Trenchcoat | `#a8b8d0` | Feed |
| Tidewater-Junge | 28 px | Wellen-Tattoo am Hals, Kapuze | `#7ab0c0` | Feed |

## 11. Rätselkette als Überblick

```
 Abend 1 ─ Nachrichten: A (Varga), B (TIDE), C (WREN) ─ Teo kommt vorbei
   │
   ├─ A: cam03 Kessler ohne Schal ─ Automat Nr. 7 / Ringstreifen ─ cam15 (Code bei Sable) ─ Kapsel 23 ─ K1a
   ├─ B: cam07 schwenken ─ falscher Winkel ─ Abzweiger (Ratz / Motte) ─ Automat anzapfen (Drohne!) ─ cam07v ─ Code ─ K1b
   │      └─ optional: Morrows Bestechung aufzeichnen
   └─ C: cam21 ─ cam22 ─ cam23 ─ (Abend 2) Stick in Trockner 6
           ├─ selbst hingehen: Tickets → „31, Fr 23:00"
           └─ 03:00 Lantern folgen: cam12 ─ cam30 „LINE 31"
           └─ cam31 über das alte Protokoll verbinden ─ Abend 3: Entscheidung 1
                                                                  │
 Abend 3 ─ Miete (Teo springt ein, falls nötig) ─ 23:00 cam31 ─ der Mord ─ Kapitel 2
```

Regeln: Jeder Auftrag ist in sich lösbar, ohne dass ein anderer erledigt sein muss; das Ende braucht
nur `know_meeting` und `linked_cam31`. Wer A und B nicht macht, hat weniger Geld und ein leichteres
Kassenbuch; Teo zahlt. Der Solver prüft alle Reihenfolgen über die drei Abende.

## 12. Hinweise

| Für | Stufe 1 | Stufe 2 | Stufe 3 |
|---|---|---|---|
| A2/A3 | „Kessler versteckt sich. Aber Gewohnheiten versteckt man schlecht." | „Was hat Frau Kessler über sein Essen geschrieben?" | „Zoome auf den Nudelautomaten in cam03: Wer zieht Nr. 7?" |
| A5 | „Das Kapselhotel hat ein eigenes Netz." | „Wer verkauft Zugänge?" | „Kauf Sable den Code zu cam15 ab." |
| B3/B4 | „Von oben sieht man nur seinen Rücken." | „Gibt es auf der Straße etwas, das auf Augenhöhe schaut?" | „Der Automat vor dem Laden hat eine Kamera. Zapf sie an." |
| B5 | „Zum Anzapfen brauchst du ein Gerät." | „Auf dem Drain-Markt gibt es Elektroschrott. Oder frag Motte." | „Kauf bei Ratz einen Abzweiger." |
| B6 | „Die Drohne passt auf." | „Ihr Licht wandert. Warte." | „Benutze den Abzweiger, wenn der Lichtkegel weg ist." |
| C6 | „Ines hat etwas im Waschsalon gelassen." | „Geh selbst hin, oder sieh nachts zu, wer es holt." | „Öffne Trockner 6 und lies, was auf der Theke liegt." |
| C7 | „cam31 ist älter als Halcyon." | „Keine Codes, kein Netz. Nur ein altes Protokoll." | „Rechtsklick auf cam31 in der Netzkarte: Junos Implantat." |
| Miete | „900 Chits bis Freitag." | „Jeder Auftrag bringt Geld. Oder jemand hilft dir." | „Du musst nichts verkaufen. Teo zahlt, wenn es nicht reicht." |

## 13. Was die Engine zusätzlich braucht (gegenüber dem Prolog)

1. **Tage** mit Abendstart, Schlafen, Fristen; Momente, die sich jede Nacht wiederholen, und solche,
   die nur einmal kommen.
2. **Steuern im Feed:** Kamerastellungen, Bildschirme, Türen.
3. **Geld** als Zahl mit Bedingungen (`chits >= 80`), Kauf und Tausch bei Händlern.
4. **Eine Figur, die patrouilliert** (die Drohne) und eine Handlung im Straßenmodus blockiert, solange
   ihr Lichtkegel auf Juno liegt.
5. **Das Kassenbuch** mit Einträgen, die sich in späteren Kapiteln selbst ergänzen.
