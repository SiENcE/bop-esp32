# Kapitel 3 „Lull": Design

Stand: Entwurf (2026-11-24). Nichts davon ist gebaut. Entschieden hat der Nutzer am 2026-11-24 die Gliederung in vier Punkten (story
§10l): Das Kapitel beginnt am Dienstagabend, Teo liegt da schon auf der Station; Juno kommt nicht in den Fünften hinauf, die Station sieht
sie erst im Traum; es sind zwei Abende; die Nebenfäden sind Morrows Tochter, Ratz' Kolonie und Tinte, die ins Meer soll. Am selben Tag dazu: Tintes Faden geht über das
Kapitel hinaus (ohne „verzögern“); mit Mottes Warnung rettet Juno Mamas Schal; Ratz' Kolonie liegt weiter unten als die Krone. Nach dem
ersten Entwurf, auch am selben Tag: Auf dem Taschen-Deck läuft nach dem Brand nur die rohe EVI, alles andere ist weg, bis Mottes Backup es
in Kapitel 4 zurückbringt (§3.9); das Tor öffnet Teos eigene PIN, das Jahr vom Dach, und das Foto bekommt dafür einen Datumsstempel
(§3.2); Morrows Tochter heißt Raya Morrow (§6.1); Tintes Abschied kauft Sable (§6.3); der Zeuge spricht in Bruchstücken im „wir“, oft mit den Sätzen der Schläfer (§3.5).
Alles andere hier ist ein Vorschlag, die Zeilen sowieso; die offenen Fragen stehen in §14.
Story: `docs/story.md` (§6, §7 Kapitel 3, §10a, §10j, §10k). Was Kapitel 2 übergibt: `docs/kapitel2-design.md` §2.1. Regeln für Deck,
Feed-Modus und Zeit: `docs/kapitel0-design.md` §2–4. Wie die Texte klingen: `docs/dialog-style-guide.md`.

## 1. Überblick

| | |
|---|---|
| Länge | etwa 2 Std. |
| Ziel | Teo zurückholen und verstehen, was Lull tut (story §7) |
| Aufbau | **zwei Abende**, Dienstag 13. und Mittwoch 14. November (Spieltage 8 und 9), und zwei Traumnächte; der erste Abend offen wie in Kapitel 1 und 2, der zweite enger; das Kapitel endet in der Nacht auf Donnerstag mit der Razzia und dem Brand |
| Neu im Spiel | **der Traum**, ein dritter Modus neben Straße und Feed (story §10k, ein Mockup zuerst); Lull selbst; der Zeuge als Gegenüber; die Pumpenhalle von innen und Tinte persönlich; der Kontrollpunkt der Transitachse; Entscheidung 3; die Flucht |
| Orte, Straßenmodus | aus Kapitel 1 und 2 die Wohnung, der Kessel-Block, die Kowalski-Straße, die Gasse, der Drain-Markt, Sables Bude, die Klinik, Sims und Dach; neu der Becken-Raum der Pumpenhalle 3 (`becken_raum`) und der Kontrollpunkt (`transit_neun`), §9 |
| Kameras | aus Kapitel 2, `cam33` jetzt für jeden; neu die Kameras der Station im Fünften (nur im Traum) und alte Wartungskameras in den Rohren (Ratz, §6.2) |
| Entscheidungen | **Entscheidung 3** (was Juno dem Zeugen sagt), dazu die Wahlen der Nebenfäden |
| Ende | Die Quiet stürmt die Wohnung, während Juno träumt; die Wohnung brennt aus, das große Deck schmilzt, und EVI läuft roh auf dem Taschen-Deck weiter |

**Was die Bibel hier heißt** (§6): Teo ist ein Sinker, weil ein Teil von ihm nicht mehr in die Pumpenhalle will; der Zeuge hat ihn
behalten. Der Zeuge hat keinen eigenen Willen, er hat den der Schläfer (bis auf den einen, weiterzubestehen, story §6, Punkt 3), und
darum spricht er in Bruchstücken im „wir“, oft mit ihren Sätzen (§3.5).
Von der Bereinigung erfährt Juno erst in Kapitel 4; hier spürt sie nur, dass seine Uhr läuft.

## 2. Die zwei Tage

Wie bisher ist ein Tag ein Abend und eine Nacht (18:00 bis 04:00), die Uhr läuft nur beim Warten, und alle Zeiten liegen auf den
15-Minuten-Takten. Das Bett geht ab 01:00 auf; mit Lull führt es in den Traum (§3.5).

| Abend | Thema | Was neu ist | Was an diesem Abend geschieht |
|---|---|---|---|
| **1 (Di, 13.11.)** | danach | Civic Rest schreibt (§2.1). Teos Status im CHAT: `schläft`. | Die Pumpenhalle und Tinte (§3.2). Der Kontrollpunkt (§3.3); um 20:00 fährt Morrow hinauf, wie jeden Dienstag (§6.1). Am Deck: `OBS-4` in Ines' Protokollen (§3.4). Lull holen (§3.5). Ab 01:00 die erste Traumnacht. |
| **2 (Mi, 14.11.)** | der Traum | Juno wacht auf, und es ist wieder Abend: „Vier Stunden, sagen sie. Das war ein ganzer Tag.“ | Die Quiet steht jetzt im Haus (§4). Um 23:00 soll Tinte ins Meer (§6.3). Ab 01:00 die zweite Traumnacht: Teo, Entscheidung 3, dann die Razzia (§3.8). |

Was nicht an einen Abend gebunden ist, geht an beiden. Was über Nacht vergessen wird: die Momente des Vortags, wie bisher.

### 2.1 Der Anfang

Kapitel 2 endet um 03:15 mit `BECKEN 3`: „Dein Bruder schläft im Becken-Raum. Er hört nicht. Komm.“ Dann die Karte „Kapitel 3: Lull“,
und auf Schwarz sagt Juno, was in der Nacht war (Vorschlag): „Um vier stand ich am Tor vom Flutwerk. Keiner hat aufgemacht.“ Was danach
geschah, erfährt sie am Abend von Tinte (§3.2).

Dienstag, 18:00, am Deck. Im CHAT ein neuer Kontakt, `CIVIC REST`, in Nagi·was Stimme (immer freundlich, immer im Sie, sagt nichts,
`dialog-style-guide` §6):

> CIVIC REST: Ihr Angehöriger TEO REYES wurde heute um 05:40 wegen Ruhe-Erschöpfung in die Obhut von Civic Rest übernommen.\
> CIVIC REST: Station 5-Mitte. Besuche sind derzeit nicht vorgesehen. Wir benachrichtigen Sie.

Antworten kann Juno nicht (`NICHT ZUSTELLBAR`). Teos eigener Kontakt steht auf `schläft` und bleibt dort. EVI tut, wie in Kapitel 2,
etwas Normales, und hier trifft es anders (Vorschlag):

> EVI: Teos Status hat sich seit gestern nicht geändert.\
> Juno: Ich weiß.\
> EVI: Soll ich dir Bescheid sagen, wenn er sich ändert?\
> Juno: ...\
> Juno: Ja.

Danach ist der Abend offen. Wer `?act=kapitel3` startet, beginnt mit den Antworten des Durchspielwegs von Kapitel 2 (wie
`?act=kapitel2`, story §10d).

**Was Kapitel 2 übergibt** (`keep` des Akts; technisch entschieden, nach dem Grundsatz, dass ein Kapitel nur wenige Flags übernimmt,
story §10h):

- was dieses Kapitel liest: `e2` (Farbe, §5), `lantern_found` und `led_quiet` (das RADIO, §5; in Kapitel 4 entscheiden sie, ob Lantern
  lebt), `moth_student` (Mottes Warnung, §3.8), `teo_talk` (Teo im Traum, §3.6), `evi_trust` (EVIs letzte Worte, §3.9: seine erste
  Aufgabe), `chits` und das Kassenbuch (es liest `ledger_haldane` für Farbe), die Clips im CACHE, `got_ausweis` und `got_haken` (die
  Gegenstände gibt der Start zurück);
- was nur durchgeht, für Kapitel 4: `forgery_proven` (Morrow), `k1b` als `warned` (Okonkwos Hinterzimmer, story §10k);
- was zurückbleibt (`leave`): alles andere aus Kapitel 2, auch `link_cam33`, denn Tinte öffnet die Kamera hier jedem (§3.2), und
  `window_open` und `ladder_down`, denn die Flucht ist eine Kette, die nicht davon abhängt (§3.8).

## 3. Der Hauptfaden: Teo

### 3.1 Überblick

Am ersten Abend in beliebiger Reihenfolge: die Pumpenhalle (Tinte erzählt, wo Teo im Traum zu finden ist), der Kontrollpunkt (Juno kommt
nicht hinauf; nötig ist er nicht), `OBS-4` am Deck (warum Juno Lull nehmen kann und dabei wach bleibt) und Lull selbst. Dann die erste
Traumnacht, eine geführte Ankunft. Am zweiten Abend die Vorbereitung, in der zweiten Nacht die Suche, Teo, Entscheidung 3 und die
Razzia.

### 3.2 Die Pumpenhalle 3 und Tinte

Die Halle gehört dem Flutwerk (`kapitel2-design` §6.6). Juno geht zum ersten Mal selbst hinein, und zwar nicht in den Schacht, den
`cam33` von oben sieht, sondern ganz unten in den **Becken-Raum**: einen Raum neben dem Filterbecken, eine Wand aus Glas, dahinter das
Wasser und Tinte, die Spinde der Schicht. Die Bank, auf der die Schicht in der Pause schläft, bleibt, wo Kapitel 2 sie zeigt: auf einer
Plattform im Schacht, die `cam33` sieht. So bleibt `cam33` ein Blick auf einen Ort, den Juno nicht betritt, und der Becken-Raum ist ein
eigener Raum in Iso (§9).

| # | Wo | Was | Flags / Dinge |
|---|---|---|---|
| P1 | CHAT, Dienstag | `BECKEN 3` schreibt, so kurz wie Tinte redet: „Tor drei. Die Tür will seine Zahl. Jeder hat eine eigene.“ – „Er hat sie mir nie gesagt. Nur: das Jahr vom Dach.“ | — |
| P2 | Deck, das Foto | Das Jahr vom Dach ist das Jahr des Fotos am Deck, 2074 (story §10b). Auf dem Foto steht unten rechts der Datumsstempel einer alten Kamera, `'74`, wie auf Papierbildern von früher (vom Nutzer erlaubt 2026-11-24; das Bild ganz geöffnet, ein Klick, kein Ansehen). Juno: „Papa hat das gemacht. Vierundsiebzig.“ | — |
| P3 | `flutwerk_steg` | Das Tor liegt am Wasser, am Ende eines Stegs, und der Steg ist ein eigener kleiner Raum (§9.2; wo er abgeht, entscheidet der Stadtplan des Nutzers). Daneben die Personaltür mit einem Zahlenfeld: Jeder Arbeiter hat dort seine eigene PIN, und Teo hat sich das Jahr vom Dach ausgesucht (vom Nutzer entschieden 2026-11-24). Juno öffnet die Tür mit der Zahl ihres Bruders; das Feld zeigt danach `REYES, T. – SHIFT B`. Sie tippt die Zahl wie den Takt an `cam31`, Ziffer für Ziffer; erst am Ende zeigt sich, ob sie stimmt. Ohne P1 weiß Juno nicht, dass Tinte sie erwartet, aber nichts sperrt die Tür außer der Zahl. | `know_flutwerk` (Vorschlag) |
| P4 | `becken_raum` | Tinte am Glas. Ihr Gespräch (`Nagiwa.talkTree`, unten). Ab 20:00 ist die Schicht oben bei der Arbeit, ab 23:00 schläft sie oben auf der Bank ihrer Plattform ihre vier Stunden. Unten ist es still; an Teos Spind hängt noch sein Gehörschutz. | — |
| P5 | dort | Tinte gibt Juno den Weg ins Netz der Halle: Ihr Knoten ist `BECKEN 3`, und über ihn steht `cam33` jetzt jedem auf der Karte. Und sie sagt, wo Teo ist, wenn er schläft (unten). | `link_cam33`, `know_teo_cam` |

**Tinte** (Vorschläge; ihre Karte im `dialog-style-guide` §6: langsam, trocken, sehr kurze Sätze, sie zählt und sagt, was sie gezählt
hat):

> Tinte: „Du bist die Schwester.“ – Juno: „Ja. Bist du Tinte?“ – Tinte: „Ja. Komm näher. Das Glas ist dick.“
> - „Erzähl mir, was passiert ist.“ – Tinte: „Pause um elf. Alle schlafen. Um drei wachen sie auf.“ – „Er nicht.“ – „Ich hab den Arm
>   ans Glas gelegt. Er hat nicht hergesehen.“ – „Der Vorarbeiter hat angerufen. Um halb sechs kamen zwei in Weiß.“ – „Freundlich.“
> - „Wie viele waren es vor ihm?“ – Tinte hebt ein Kabel aus dem Wasser, voller Knoten. – „Zwölf Knoten. Er ist der zwölfte.“ – „Ich
>   zähl, seit sie Lull gebracht haben.“
> - „Wie ein Schwarm, hast du gesagt. Was meinst du damit?“ – Tinte: „Sie schlafen. Dann zucken sie. Alle. Im selben Moment.“ – „Wie
>   Fische, wenn ein Schatten übers Wasser geht.“
> - „Ich hol ihn zurück.“ – Tinte: „...“ – „Er wollte nicht mehr wach sein. Das hat er gesagt. Mir, nicht dir.“ – Juno: „Wann?“ –
>   Tinte: „Oft.“

Und wo er ist (`know_teo_cam`, die Antwort auf „Wo ist er jetzt?“): „Sein Körper ist oben im Fünften. Er selbst nicht.“ – „Wenn er
geschlafen hat, hat er gezuckt und nach oben geschaut. Zur Kamera am Rand. Immer dahin.“ Juno: „CAM 33.“ Das ist die Kenntnis, die die
zweite Traumnacht braucht (§3.6): Sonst sucht Juno ihn unter Tausenden.

### 3.3 Der Kontrollpunkt der Transitachse

Am Fuß des Turms, wo die Aufzüge der Transitachse in den Schacht steigen, der Kontrollpunkt des Neunten (`transit_neun`, §9). Hinauf
kommt nur, wer eine Arbeitserlaubnis hat, und höchstens bis in den Fünften (story §3). Nötig ist dieser Gang nicht, aber er erzählt die
Grenze, und hier beginnt der Faden um Morrows Tochter (§6.1).

**Der Weg durch die Halle** (Vorschlag nach der Wahl des Nutzers, §9.2): Juno kommt durch die Glastüren, und an der Vorkontrolle leuchtet
ihr Tor rot (`PERMIT CHECK`). Damit ist sie im Wartesaal, nicht auf der Spur hinter dem Glas. Sie kann ihn durchqueren, mit den Wartenden
reden (nur Farbe, kein Flag) und zu den Antragsschaltern an seinem Ende gehen; dort ist die Wache, und dort wird sie abgewiesen. Durch die
Glaswand sieht sie die wenigen mit Erlaubnis zu den Bögen gehen, am Dienstag um 20:00 auch Morrow (§6.1).

> Wache: „Ausweis, bitte.“ – Juno legt ihren alten auf. Das Lesegerät: `CIVIC MONITOR · J. REYES · UNGÜLTIG`. – Wache: „Dieser Ausweis
> ist ungültig. Haben Sie eine Arbeitserlaubnis?“
> - „Ich will meinen Bruder besuchen. Teo Reyes, Station 5-Mitte.“ – Wache: „Besuche auf den Stationen sind nicht vorgesehen.“ – „Die
>   Angehörigen werden benachrichtigt.“ – Juno: „Ich bin benachrichtigt worden.“ – Wache: „Dann ist ja alles in Ordnung.“
> - „Wie kommt man da hoch, wenn man keine hat?“ – Wache: „Gar nicht.“ – „Einen schönen Abend noch.“

Ohne den Ausweis: „Ausweis, bitte.“ – Juno: „Hab ich nicht dabei.“ – „Dann kann ich nichts für Sie tun.“ Danach sagt Juno, was das
Kapitel trägt: „Hinauf komm ich nicht. Aber hinein vielleicht.“ Die Wache ist namenlos, ihre Stimme ist Nagi·was.

### 3.4 `OBS-4` in Ines' Protokollen

Ines' Protokolle liegen seit Montag offen im NETZ (`kapitel2-design` §8). Am Deck legt Juno sie neben ihr altes Beobachter-Handbuch im
CACHE (`cache_note_obs_handbook`, „Protokoll OBS-4. Die Wach-Ebene hält Sie bei Bewusstsein.“): Im Kopf der Protokolle steht die
Kennung der Lull-Firmware, Technik der Stadt und darum englisch, `FIRMWARE: OBS-4 // WAKE LAYER: REMOVED` (story §10a). Vorschlag für den
Bau: PRÜFEN legt Daten über Daten, das Handbuch über den Kopf der Protokolle, und ein Klick auf die Zeile ist der Fund.

> Juno: „OBS-4. Das ist mein Protokoll.“\
> Juno: „Lull ist mein Implantat. Nur ohne die Wach-Ebene.“\
> EVI: „Dann hast du dasselbe wie Teo? Nur wach?“\
> Juno: „Wenn ich Lull nehme und das hier wach bleibt, dann seh ich, was er sieht.“

Gibt es die inneren Stimmen dann schon (Engine C12), sagt DAS IMPLANTAT die erste Zeile, sachlich und ohne Ich. Flag `know_obs4`. Ohne
dieses Wissen holt Juno sich Lull zwar (es kostet nichts, und was man findet, kann man nehmen), aber sie klebt es sich nicht hinters Ohr:
„Ich nehm das nicht. Dann lieg ich da wie die anderen.“ Das ist ein Grund in der Welt, kein Klick, der fehlt.

### 3.5 Lull holen, und der Traum

**Zwei Wege** (story §7), beide jederzeit:

- **Die Klinik**, gratis, ab 19:00 bei Marit (`kapitel2-design` §3.2). Sie erkennt die Frau mit dem falschen Namen wieder („Ada Novak,
  nicht wahr?“). Diesmal muss sie hinters Ohr, um das Pflaster zu setzen, und sie sieht das Implantat. Eine Pause. „Da sitzt schon
  was.“ – Juno: „Ein altes. Das durfte ich behalten.“ – Marit: „...“ – „Ich hab nichts gesehen.“ Sie gibt ihr die Packung: „Nicht
  länger als vier Stunden. Das sagen wir allen. Keiner hält sich dran.“
- **Sable**, grau, ohne Nummer: „Lull ohne Nagi·wa. Hundert.“ Eine Nebenaufgabe im Sinn von story §10j (Geld blockiert nie, denn die
  Klinik kostet nichts). Kassenbuch: „Sable: Lull, grau. 100.“

Das Ding ist `lull`, eine Packung Pflaster. Am Bett ab 01:00, mit `know_obs4`: „Mit Lull schlafen.“ Juno klebt es sich hinters Ohr, neben
das Implantat. Von nun an trägt sie beides (in den Nahaufnahmen zu sehen, unter der Kapuze nicht).

**Der Traum ist ein dritter Modus** (story §10k), und er kam **zuerst als Mockup** zur Freigabe: `docs/mockups/mock_g_traum_*_x3.gif`
(Quelle `art/mockups/mock_g_traum.px.js`). Der Nutzer wollte ihn außergewöhnlich, anders als alles im Spiel, cyberpunkig, wie ein
Cyberspace, und hat am 2026-11-24 die drei Varianten **zusammen** gewählt, als die drei Zustände des Traums (Style Guide §9a):

- **Der Datenraum** (A) ist der Ort, an dem Juno ist: ein Gitter, das zu einem Horizont läuft, an dem das Auge des Zeugen aufgeht wie eine
  Sonne; die Kamerabilder schweben im Leeren, von jedem ein Faden zum Auge, auf dem Pulse laufen; Lulls Takt fällt in Spalten wie Code.
  Hier klickt Juno die Bilder an.
- **Der Tunnel** (B) ist der Weg: Ein angeklicktes Bild öffnet einen Tunnel, dessen Wände Kamerabilder sind, und Juno fliegt hindurch.
- **Das Bild aus Code** (C) ist das Innere eines Bildes: der Ort, aus dem fallenden Takt gebaut, und darin, was Juno sucht (Teo am Rand
  von CAM 33, Raya auf der Station). Die zweite Runde zeigt beides (`mock_g_traum_teo_x3.gif`, `mock_g_traum_station_x3.gif`): Teo
  sitzt fest und farbig auf dem Rand über dem Schacht aus Code, von hinten, das Pflaster am linken Ohr im Takt; die Station sind Reihen
  weißer Betten, die Köpfe dunkel auf den Kissen, Rayas Bett in Junos Klammern mit Name und Nummer.

Was der Traum außerdem zeigen soll (der Vorschlag vor dem Mockup, er gilt weiter):

- Keine Straße und kein einzelner Feed, sondern **viele Kamerabilder zugleich**, eine Wand aus Bildern wie in der Beobachtungshalle des
  Vorspanns, nur lebendig, treibend, in **Magenta und Weiß** (Lull und die Schläfer, Style Guide §5).
- Über den Menschen darin schweben **die Markierungen der Schläfer**: vier kleine Ecken um jedes Gesicht, wie Frau Haldane sie in die
  Zeitungen malt (Kapitel 1). Junos eigene Klammern sind cyan, wie immer: Sie ist die eine, die wach ist, und das sieht man.
- Juno bewegt sich, indem sie ein Bild anklickt, das nach vorn kommt und das Bild füllt; von dort führen die Markierungen weiter, wie das
  Folgen im Feed. Alles Klicks, keine Zeit, kein Ziehen.
- **Der Zeuge** ist ein Auge in den Bildern, eine Störung, die durch alle zugleich läuft. Er spricht mit vielen Stimmen in Magenta-Weiß,
  in Kleinbuchstaben und ohne Namen (`dialog-design` §2), **in Bruchstücken und im „wir“** (vom Nutzer entschieden 2026-11-24). Vieles
  setzt er aus **den Sätzen der Schläfer** zusammen, die der Spieler schon kennt, und daran erkennt man ihn: Frau Haldanes („sonntags
  kommt sein brief“), des Stammgasts im LUCKY STATIC („sie geht zur treppe“), Teos („wenn ich schlaf, ist alles still“). Kurze eigene
  Sätze im „wir“ darf er sagen. Was er sagt, ist nie ein Plan, sondern das Gewissen und die Müdigkeit der Schläfer, dazu sein einer
  Wunsch, weiterzubestehen (story §6, Punkt 3). So passt er zu seinem ersten Wort im Prolog („JUNO.“), zum Finale, wo er zeigt und
  entscheidet, und zu Kapitel 4, wo die EVI des Zeugen ihn erst übersetzen muss.
- Die Uhr steht im Traum. Eine Traumnacht endet, wenn sie zu Ende erzählt ist, und dann wacht Juno am nächsten Abend auf.

**Die erste Traumnacht** (Dienstag auf Mittwoch) ist eine Ankunft, geführt und ohne Verzweigung: Juno fällt in den Takt des Pflasters
(lang, kurz, kurz, lang, das Bild pulsiert mit), die Wand der Bilder geht auf. Sie sieht ihre eigene Straße durch die Augen der Schläfer
und **sich selbst**, am Sonntag auf der Kowalski-Straße, mit vier kleinen Ecken um ihr Gesicht: „Die haben mich markiert. Alle, die
schlafen.“ (So wird wahr, was `kapitel2-design` §4 ahnen ließ.) Dann bemerkt der Zeuge sie, das Auge, und alle Stimmen sagen ihren Namen,
wie der Schirm im Prolog. Er zeigt ihr den Mord aus CAM 31, wie er ihn den Schläfern zeigt, jede Nacht um drei: „Das hat keiner. Außer
mir.“ – „wir haben es gesehen. jede nacht.“ Zuletzt treibt sie über die Station im Fünften: Reihen von Schläfern in weißem Licht, und
einer davon ist Teos Körper. Sie ruft ihn, und nichts antwortet. Dann sind die vier Stunden um. (Beim ersten Mal treibt man nur, sagt
Marit, und so ist es.)

### 3.6 Die zweite Traumnacht: Teo

Mittwoch auf Donnerstag. Jetzt kann Juno sich bewegen. Mit `know_teo_cam` sucht sie unter den Bildern das von `cam33`, den Schacht der
Pumpenhalle von oben, und dort, am Rand neben der Kamera, sitzt Teo und schaut hinunter, ruhig und weit weg, in Magenta und Weiß. Ohne
die Kenntnis findet sie ihn nicht („Tausend Bilder, und er ist in keinem.“), und EVIs Hinweis schickt sie, wenn sie wach ist, zu Tinte.

Teo ist warm und stolz wie immer und will, dass sie bleibt (story §7). Sein Gespräch knüpft an `teo_talk` an (Vorschläge):

> Teo: „Ju. Du bist ja wach.“ – „Hier ist es still. Hörst du? Keine Pumpen.“
> - „Komm mit. Bitte.“ – Teo: „Wohin? Zur Schicht?“ – „Ich bin nicht krank, Ju. Ich bin nur nicht mehr müde.“
> - „Ich bleib ein bisschen.“ – Er rückt zur Seite, wie auf dem Dach. – „Da. Unser Platz.“
> - „...“
>
> nach `papa`: „Papa ist nicht hier. Ich hab gesucht. Aber die Halle ist hier, und von oben ist sie schön.“\
> nach `essen`: „Hier hat keiner Hunger. Das ist das Beste.“\
> nach `schicht`: „Hier gibt's keine Schicht. Und keiner fragt, ob ich wach bin.“

Wie es mit Teo weitergeht, entscheidet Kapitel 4 (Entscheidung 4, ihn gegen seinen Willen wecken oder lassen). Hier gibt es nichts zu
gewinnen: Er kommt nicht mit, und Juno weiß jetzt, warum. Kein neues Flag; was Kapitel 4 braucht, ist `teo_talk`.

### 3.7 Entscheidung 3: was Juno dem Zeugen sagt

Danach kommt der Zeuge, und diesmal will er etwas: dass sie bleibt, wie Teo es will, und dass sie sieht, was er ist (story §6, Punkt 3).
Er spricht mit den Stimmen der Schläfer, und ihre zwei Wünsche passen nicht zusammen: „wir sagen nichts über die nachbarn“ – „wir wollen
nicht mehr aufwachen.“ Juno antwortet, und das ist Entscheidung 3 (story §7), nie aus Versehen (story §5):

| Wahl | Was Juno sagt | Was der Zeuge tut (vom Nutzer bestätigt 2026-11-24) |
|---|---|---|
| **helfen** | „Ich helfe dir.“ | Die Bilder werden still und warm. „wach.“ Juno ist die Erste, die ihn als jemanden behandelt und nicht als Gefahr. **Was er ihr dalässt** (vom Nutzer entschieden 2026-11-24): Von nun an gibt er Nagi·wa nicht mehr weiter, was die Schläfer an Juno markieren. Er versteckt sie nicht (das kann er nicht, story §10h), er meldet sie nur nicht mehr, und wen er nicht meldet, findet Nagi·wa schwerer. Juno spürt es in Kapitel 4, wenn sie gejagt wird; wie, legt dessen Design fest. Die Razzia dieser Nacht ändert es nicht mehr: Die Quiet weiß längst, wo Juno wohnt. |
| **den Bruder** | „Gib mir meinen Bruder zurück.“ | Teos eigene Stimme unter den vielen: „ich will nicht, ju.“ Der Zeuge gibt nicht her, was der Schläfer selbst nicht will: Er hält Teo nicht fest, Teo will bleiben. Das bereitet Entscheidung 4 vor (ihn gegen seinen Willen wecken). |
| **wie die** | „Du bist genau wie die.“ | Die Bilder gehen eines nach dem anderen aus, wie in der Beobachtungshalle des Vorspanns, als Juno entlassen wurde. Gemeint ist Nagi·wa, die Menschen beobachten und behalten; er zieht sich gekränkt zurück. |

Flag `e3` = help | brother | same. Es geht über die Kapitel bis zum Finale (story §8: mit dem Gewicht des Kassenbuchs entscheidet es, ob
der Zeuge ihr vertraut). Für das Vertrauen zählt `help` am meisten, `brother` ist neutral (dann entscheidet das Kassenbuch) und `same`
am wenigsten (Vorschlag; die Grenzen legt Kapitel 6 fest). Kaum hat sie geantwortet, beginnt die Razzia.

### 3.8 Die Razzia

Eine Kette wie das Ende von Kapitel 1 und 2, an der nur `moth_student` verzweigt; die Zeiten dürfen deshalb zwischen den Takten liegen.

- **Mit Mottes Warnung** (`moth_student`, story §7): Motte schläft nicht, wenn seine Mutter schläft, und sitzt nachts auf seiner Bank.
  Die Kamera im Flur ist seit Montag tot (`cam14`, `kapitel2-design` §4), aber Motte nicht: Er sieht die in Weiß die Treppe heraufkommen.
  Seit dem Backup kennt sein Tideboy das Taschen-Deck, und EVI reißt Juno aus dem Traum: „Juno! Motte sagt, sie kommen! Die Treppe!“
  Juno ist wach, bevor die Tür bricht, und geht durchs Fenster, über den Sims, die Leiter hinauf aufs Dach, ohne Eile, die sie
  hinterher noch spürt. **Eine Sache nimmt sie mit** (vom Nutzer entschieden 2026-11-24): **Mamas Schal**, den sie hinter dem Schrank
  gefunden hat (der Entwurf an Teo im MÜLL, `kapitel2-design` §6.6). Er ist ein Ding in der Tasche, und das Flag `got_schal` geht weiter:
  In Kapitel 4 kann er bei Teo zählen (Entscheidung 4). Ohne die Warnung verbrennt er mit allem anderen.
- **Ohne:** Juno wacht auf, als die Tür aufbricht. Weiße Masken im Licht des Decks. Sie ist am Fenster, bevor sie denkt, und draußen.
  Hat sie das Fenster nie geöffnet, schlägt sie es ein („Kein Riegel. Keine Zeit.“); hängt die Leiter noch oben, springt sie danach.
  Die Zeilen lesen, wie es in Kapitel 1 war, der Ablauf nicht: So kann hier nichts hängen bleiben.

Kein Kampf, kein Timing (story §10, `CLAUDE.md`): Die Flucht sind Klicks in einer Kette, die immer gelingt.

### 3.9 Das Ende: das Feuer

Vom Sims sieht Juno noch einmal durch ihr Fenster. Die Quiet hat das Deck aufgebrochen, und dann brennt es: Sie verbrennen, was Juno
gesehen hat. Auf dem großen Bildschirm ist zuletzt EVIs Gesicht, im Glitch, dann ist er schwarz (story §7). Aus der Tasche, im
Taschen-Deck, eine rohe, gedrosselte EVI (story §10k), ihre Zeilen zerhackt (Vorschläge):

> EVI: „J-Juno. Hier ist es ... eng.“\
> EVI: „Ich hab ... nicht alles mitgenommen.“

Hier bekommt `evi_trust` seine erste Aufgabe (`kapitel2-design` §14): Hat Juno im Prolog offen mit ihr geredet, sagt EVI danach „Das
Buch ist weg. Die Clips auch.“ – „Aber dich kenn ich noch.“, sonst nur „Ich weiß nicht mehr, was ich weiß.“ (Nur eine Zeile, kein
Zustand.)

Dann sitzt Juno oben auf ihrem Platz vom Foto (`dach_sitzen`), auf dem Teo am Montag an ihrer Schulter eingeschlafen ist, und neben ihr
ist der Platz wieder leer. Unten brennt ihr Fenster, über ihr die Unterseiten der Ringe. Abblende. „Kapitel 4: Die Quiet“.

**Was das Taschen-Deck behält** (vom Nutzer entschieden 2026-11-24, statt des ersten Entwurfs, der CACHE und BUCH behielt): nur die
rohe EVI. Alles andere ist mit dem großen Deck weg: der CACHE mit den Clips, das BUCH, GLASS mit der Karte, NETZ, RADIO und der MÜLL mit
den Entwürfen an Teo. Bis zum neuen Deck in Kapitel 4 hat Juno nur das, was sie weiß. **Mit Mottes Backup kommt alles zurück**
(`moth_student`, story §10k): Das Backup hat Motte in Kapitel 2 vom Taschen-Deck gezogen; Juno baut sich in Kapitel 4 ein neues Deck
zusammen und spielt es ein, und dann ist alles wieder da, auch EVI ganz. **Ohne Backup** bringt der Zeuge zurück, was er gesehen hat:
EVI mit Lücken (story §7, Kapitel 4) und das Kassenbuch, denn er hat Juno dreieinhalb Jahre beim Verkaufen zugesehen. Junos Clips bleiben
dann verloren, auch der aus CAM 31 (`clip_ines_death`); der Beweis für „Licht aus“ sind dann Ines' Protokolle (story §8). Das Kassenbuch
zählt im Spiel ohnehin über seine Flags, nicht über das Deck. Was genau das Backup enthält, legt Kapitel 4 fest.

## 4. Die Quiet kommt näher

| Wann | Was | Juno |
|---|---|---|
| Dienstag | Der Schatten steht wie am Montag vor dem LUCKY STATIC, der Anführer und zwei (19:00 bis 23:00). `cam07` und `cam14` sind tot. | — |
| Mittwoch | Einer in Weiß steht jetzt in der Lobby des Kessel-Blocks, an den Briefkästen, und sieht Juno nicht an. Der weiße Wagen, der nicht hupt, parkt auf der Kowalski-Straße. | „Die warten, bis ich schlafe.“ |
| Mittwoch, nachts | die Razzia (§3.8) | |

Woher die Quiet weiß, wann Juno schläft, sagt niemand. (Wer Lull in der Klinik geholt hat, mag es ahnen; ein Flag gibt es dafür nicht.)

## 5. Was aus Kapitel 2 nachkommt

Nur Farbe, jede Folge liest einen Wert, der ohnehin übergeben wird (story §10h).

- **`e2`:** Nach `e2=morrow` erkennt Morrow Juno am Kontrollpunkt („Sie. Gehen Sie nach Hause.“). Nach `e2=sable` ist Sable knapper als
  sonst („Geschäfte. Mehr nicht.“; der Verrat kommt in Kapitel 4). Nach `e2=vesper` fragt das Brett im NETZ, wer die Frau in der Metro
  war. Nach `e2=lantern` jagt Revier 9 Lantern härter, das sagt der Fernseher im LUCKY STATIC.
- **Lantern im RADIO** (`lantern_found`): Er spricht nachts auf 87.6 über die Tabellen und darüber, dass ihm keiner glaubt („Wer das hier
  hört, ist noch wach. Hoffentlich.“). Nach `led_quiet` (Vorschlag): Am Mittwoch rauscht 87.6 nur noch. Was das heißt, sagt erst Kapitel 4.
- **Okonkwos Dank** (`k1b=warned`): In der Jade Row, beim Vorbeigehen: „Wenn du mal was brauchst, Glasserin. Hinten ist Platz.“ Das legt
  sein Hinterzimmer für Kapitel 4 an (story §10k); nach `k1b=sold` ist der Laden weiter zu.
- **Frau Haldane:** Ihre Tür ist zu. Nach der Wahrheit über Najo (`ledger_haldane`) schläft sie jetzt auch sonntags nicht mehr wach:
  „Dann bin ich näher bei ihm.“ Ihre Stimme ist unter denen des Zeugen. Najo liegt auf der Station, ein Blick im Traum, ohne Flag.
- **Bao:** Juno kann nicht mehr einfach vorbeikommen (`dialog-style-guide` §8). Am Dienstag stellt er ihr die Schale an der Gasse hin,
  nicht an seinem Wagen, weil die in Weiß vor dem LUCKY STATIC stehen: „Teo war Dienstag immer da.“
- **Die Entwürfe an Teo** (`kapitel2-design` §6.6): Im MÜLL lassen sie sich jetzt abschicken. Teos Status ist `schläft`, die Nachricht
  steht im Verlauf, zugestellt, nie gelesen. Eine Ansicht, kein Zustand.
- **Motte:** Er sitzt auf seiner Bank wie immer. Nach `moth_student`: „Ich pass auf. Nachts schlaf ich eh nicht.“ (Das legt §3.8 an.)

## 6. Die Nebenfäden

Jeder Faden ist für sich, mit eigenem Schritt-Flag und eigenem Solver-Lauf; er endet in diesem Kapitel und gibt höchstens ein Flag
weiter.

### 6.1 Morrows Tochter (`off_tochter`)

Die Bibel: Morrows Tochter liegt auf derselben Station wie Teo, und Juno findet sie im Traum; das macht es erst möglich, Morrow in
Kapitel 4 umzustimmen (story §7, §9).

| # | Wo | Was |
|---|---|---|
**Raya Morrow** (der Name vom Nutzer, 2026-11-24, der Rest vom Nutzer bestätigt am selben Tag): 19 Jahre alt, Agnes Morrows einziges Kind. Sie hat auf
dem Drain-Markt an einem Fischstand gearbeitet, den Tag über und dann noch die Nacht, für die Flutschuld wie alle, und Lull genommen wie
alle. An einem Morgen im April 2091 ist sie nicht aufgewacht; seit sieben Monaten liegt sie auf der Station 5-Mitte. Ihre Mutter fährt
jeden Dienstag hinauf, denn eine Marke öffnet, was einer Schwester verschlossen bleibt. Morrow nimmt Schmiergeld (story §9): In Kapitel 1
holt sie sich nachts um halb eins in der Jade Row vom Tidewater-Jungen einen Umschlag ab, „für die ruhige Woche“ (`cam07`,
`kapitel1-design` B8), und hält dort in Kapitel 2 wieder. Sie redet sich ein, sie tue es für Rayas Bett.

| # | Wo | Was |
|---|---|---|
| M1 | `transit_neun`, Dienstag 20:00 | Morrow geht auf der Spur hinter der Glaswand an den Wartenden vorbei und fährt hinauf, ihre Marke genügt. Die Wache am Bogen: „Wie jeden Dienstag, Lieutenant. Grüßen Sie Raya.“ Morrow: „Sie schläft. Wie immer.“ Juno hört es oder sieht es im Puffer (Vorschlag: die Kamera über dem Kontrollpunkt, eine Nagi·wa-Kamera mit Junos altem Zugang). |
| M2 | Traum, die Station | In der zweiten Traumnacht unter den Schläfern der Station: An jedem Bett ein Schild, und Civic Rest nennt seine Schläfer freundlich beim Vornamen, mit einer Nummer (`RAYA · 5M-0219`). Mit dem Namen aus M1 findet Juno sie unter den vielen. |
| M3 | dort | Raya spricht im Traum wie Teo, ruhig und weit weg. Im Traum sind die Schläfer da und können reden, mit Juno, die als Einzige wach darin ist; draußen kann keiner von ihnen etwas sagen (story §6, Punkt 4: Schläfer können nicht aussagen). Darum braucht Raya Juno als Botin: Ihrer Mutter selbst kann sie nichts sagen, auch nicht dienstags, wenn Morrow an ihrem Bett sitzt. Sie sieht durch die Kameras wie alle Schläfer, und sie hat ihre Mutter gesehen, jede Nacht um halb eins in der Jade Row (`cam07`, bis die Kamera ausging). Sie sagt es so, dass Juno es nicht vorher gesehen haben muss: „Mama hält jede Nacht in der Jade Row. Ein Junge gibt ihr einen Umschlag.“ – Juno: „Schmiergeld.“ – „Ich hab sie nie markiert. Ich kann nicht. Sie ist meine Mama.“ Hat Juno es in Kapitel 1 gesehen, kennt sie es schon; ein Flag dafür gibt es nicht (der Clip geht über Kapitel 2 nicht hinaus), die Zeilen sind für alle dieselben. Sie gibt Juno etwas mit, das nur die beiden wissen, den Namen, den ihre Mutter ihr als Kind gab, als sie Steine aus dem Abfluss sammelte: „Sag ihr: Kiesel sieht sie. Sie soll aufhören. Für mich muss sie das nicht.“ Flag `morrow_kind`, weiter in Kapitel 4: Mit „Kiesel“ glaubt Morrow Juno, und mit dem, was Raya gesehen hat, lässt sie sich umstimmen (story §7, Kapitel 4). |

### 6.2 Ratz' Kolonie (`off_ratz`)

Mit der Kopie von Junos Ausweis (`ledger_ratz`, `kapitel2-design` §3.5) ist Ratz am Montag in die Rohre gegangen, zu seiner Kolonie unter
der Krone (story §9). Sein Stand ist leer, an der Kiste ein Zettel: `BIN ROHR. RATZ.`

| # | Wo | Was |
|---|---|---|
| R1 | CHAT, Dienstag | Ein Kontakt, den Juno nicht kennt: `WARTUNG 5-17`, ein altes Terminal in den Rohren. „HILF. KLAPPE ZU. RATZ.“ und, weil sein Kragen Wörter vertauscht: „KLAPPE HILF. ZU RATZ.“ |
| R2 | Deck, GLASS | Nagi·was alte Wartungskameras in den Rohren hängen am Netz der Beobachter und verstehen Junos alten Zugang noch (wie `cam21`). Über sie findet Juno Ratz: vor einer Klappe, die die Kopie des Ausweises nicht mehr aufmacht. |
| R3 | die Wartungskameras | **Lotsen**: Juno sieht durch die Kameras voraus, Ratz geht. Sie schaltet einen Lüfter ab, öffnet eine Klappe über ein Wartungsterminal, sagt ihm, wann die Drohne vorbei ist (ohne Timing: Die Drohne hat ihre festen Stellungen, und Ratz wartet, bis Juno „Jetzt.“ sagt). Ein kleines Vorspiel für den Einbruch in Kapitel 5, wo Juno einen Verbündeten durch den Tower lotst (story §7). |
| R4 | die letzte Kamera | Die Kolonie: Kabelratten in einem Knoten aus Rohren, ihre Kragen glimmen. Ratz: „Familie. Teuer. Gratis.“ Lohn: In Kapitel 4 zeigt er Juno die Rohre (story §9). Flag `ratz_kolonie`, weiter in Kapitel 4. |

**Wo die Kolonie liegt** (vom Nutzer entschieden 2026-11-24): nicht unter der Krone, sondern weiter unten, wo sie sich auf halbem Weg
festgesetzt hat, unter dem Fünften, wo die Klappen nicht mehr aufgehen. Den Weg ganz hinauf zeigt Ratz Juno in Kapitel 4 oder 5. Wie
viele Kameras es braucht, klärt der Bau.

### 6.3 Tinte soll ins Meer (`off_tinte`)

Das Flutwerk stellt die Filterbecken auf Maschinen um, und Tinte soll mit fast vierzig Jahren „ins Meer entlassen“ werden, für das sie
nicht mehr gemacht ist (story §9). Juno kann es verhindern, den Abschied filmen und verkaufen oder nichts tun; „verzögern“ gibt es
nicht (vom Nutzer entschieden 2026-11-24).

| # | Wo | Was |
|---|---|---|
| T1 | `becken_raum` | Am Glas klebt der Aushang, englisch wie alle Technik der Stadt: `BASIN 3: AUTOMATION TRIAL TUE 22:00. RELEASE OF UNIT WED 23:00.` Tinte: „Unit. Das bin ich.“ |
| T2 | `cam33`, Dienstag 22:00 | Der Test: Eine Filtermaschine wird ins Becken gelassen, sie verstopft, und Tinte räumt hinter ihr auf, ohne dass es oben jemand merkt. Juno nimmt es auf (oder holt es aus dem Puffer). |
| T3 | CHAT oder `becken_raum` | **Verhindern:** Juno schickt den Clip dem Vorarbeiter (ein Kontakt über `BECKEN 3`). Am Mittwoch hängt ein neuer Aushang: `RELEASE POSTPONED`. Dahinter steht dieselbe Geschichte wie Junos: 2088 hieß es, eine „automatische Auswertung“ habe sie ersetzt, aber AUTO-EVAL hat nie funktioniert (der gescheiterte Prototyp ist EVI), und die Arbeit machen in Wahrheit die Schläfer. So soll jetzt eine Maschine Tinte ersetzen und kann es nicht. Das sagt keiner, aber EVI fragt: „Dann ist die Maschine wie ich?“ |
| T3b | dort | **Verkaufen:** Am Mittwoch um 23:00 heben sie Tinte im Netz in den Kanal zum Meer; `cam33` sieht es. Juno nimmt es auf, und **Sable** kauft den Abschied (vom Nutzer entschieden 2026-11-24), um ihn an die Feeds der Krone weiterzuverkaufen („Tiere gehen oben gut.“). Das ist die Versuchung des Fadens: Chits, die Juno in Kapitel 4 für ihr neues Deck brauchen kann, gegen den Abschied der Freundin ihres Bruders. Kassenbuch, mit Gewicht. |
| T3c | dort | **Nichts tun:** Juno sieht zu oder nicht. Tinte geht. |

Flag `tinte` = stays | sold | gone, und **es geht weiter** (vom Nutzer entschieden 2026-11-24): Bleibt Tinte, kann sie in Kapitel 4 bis 6
noch helfen, etwa mit ihren Knoten, die dieselben Sinker zählen wie Aubrechts Zahlen (story §6, Punkt 6); welche Rolle sie dort hat,
legen diese Kapitel fest. Damit der Hauptfaden nicht an diesem Faden
hängt, sagt Tinte `know_teo_cam` schon am Dienstag (§3.2), und ist sie am Mittwoch fort, liegt das Kabel mit den zwölf Knoten vor dem
Glas, für die Schwester (Vorschlag).

## 7. Das Leben drumherum

Alles hier liest nur den Tag und übergebene Werte und setzt nichts.

| Wann | Wo | Was |
|---|---|---|
| Dienstag | `lucky_static` | Der Fernseher: „Ruhe-Erschöpfung im Neunten leicht gestiegen. Civic Rest bittet um Ruhe.“ Mei gibt das Gerücht weiter wie Wechselgeld: „Erst der Sohn vom Fischmann. Jetzt der Bruder von einer, die glasst. Sagen sie.“ Der Stammgast schläft auf seinen Armen. |
| Mittwoch | `lucky_static` | Der Fernseher: „Lull: jetzt auch im Achten gratis.“ Das Brett lacht weiter über den „Mörder mit den Tabellen“. |
| beide | `dach` | Die Regenleserin. Dienstag: „Er hat die Leiter noch gefunden, am Montag. Das war gut, Kind.“ Mittwoch: „Heut Nacht schmeckt's nach Rauch. Und es brennt noch gar nichts.“ |
| beide | `drain_market` | Der Prediger, Tag 15 und 16: „Sie holen jetzt jeden Tag einen! Bleibt wach!“ Ratz' Stand ist leer (§6.2). |
| beide | `kessel_14` | Motte auf seiner Bank, Frau Haldanes Tür zu, das rote Auge der Kamera aus. |
| beide | Deck, NETZ | Dienstag: „Civic Rest eröffnet neue Station im Fünften.“ Auf dem Brett: „Hat noch jemand die Tabellen gelesen? Meine Mutter zuckt im Schlaf. Pünktlich.“ Mittwoch: „Civic Rest dankt für Ihr Vertrauen.“ |
| beide | `kowalski` | Der große Schirm stottert; im Rauschen steht jetzt öfter das Auge. Bao (§5). |

## 8. Ablauf als Überblick

```
 Abend 1 (Di) ─ Civic Rest schreibt ─ Teo „schläft“
   │
   ├─ BECKEN 3: „das Jahr vom Dach“ ─ Foto: '74 ─ Tor 2074 ─ Becken-Raum ─ Tinte ─ know_teo_cam (CAM 33 für jeden)
   ├─ Kontrollpunkt (optional): abgewiesen ─ 20:00 Morrow fährt hinauf ─────────────── (Faden: Morrows Tochter)
   ├─ Deck: Protokolle neben das Handbuch ─ OBS-4 // WAKE LAYER: REMOVED ─ know_obs4
   └─ Lull: Klinik (Marit, gratis) │ Sable (100)
                                     │
 Nacht 1 ─ Bett ab 01:00, mit Lull ─ der Traum: die Bilder, die Ecken, sie selbst markiert, der Zeuge, CAM 31, die Station
                                     │
 Abend 2 (Mi) ─ die Quiet im Haus ─ (Tinte 23:00) ─ (Ratz in den Rohren)
                                     │
 Nacht 2 ─ der Traum: CAM 33 ─ Teo ─ (Morrows Tochter) ─ der Zeuge: Entscheidung 3
         ─ die Razzia (Motte warnt │ die Tür bricht) ─ Fenster, Sims, Leiter, Dach ─ das Feuer ─ EVI roh ─ Kapitel 4
```

Regeln: Die erste Traumnacht braucht `lull` und `know_obs4`; die zweite findet Teo nur mit `know_teo_cam`; das Ende braucht `e3`. Der
Kontrollpunkt ist nie nötig. Die Nebenfäden prüft der Solver jeden für sich mit geschlossenem Hauptweg (`off_main`), wie in Kapitel 1
und 2.

## 9. Orte

### 9.1 Was wiederkommt

| Ort | In Kapitel 3 |
|---|---|
| `flat`, Deck | der Anfang, Lull am Bett, die Razzia, das Feuer (die Wohnung ein zweites Mal gebacken, verbrannt, falls Kapitel 4 sie zeigt) |
| `kessel_14`, `kessel_lobby` | Motte, Frau Haldanes Tür zu, die Quiet in der Lobby (Mittwoch) |
| `kowalski`, `gasse` | der Schatten, Bao an der Gasse, der weiße Wagen; der Steg zum Flutwerk (§9.2) |
| `klinik` | Marit, Lull |
| `drain_market`, `sable_booth` | Ratz' leerer Stand, Sable (Lull grau, Tintes Abschied) |
| `sims`, `dach`, `dach_sitzen` | die Flucht, das Ende |
| `jade_row` | Okonkwos Dank (§5) |
| `cam33` | Tintes Test und Abschied (§6.3); im Traum der Ort, an dem Teo sitzt |

### 9.2 Neu

| Raum | Blick | Was darin ist |
|---|---|---|
| `becken_raum` | Iso, etwa 6 x 3,5 m, ganz unten im Schacht (Blockskizze `docs/mockups/becken_raum_blocks_x3.png`) | die Glaswand zum Filterbecken mit Tinte dahinter (ein großer Schatten, Arme, Saugnäpfe am Glas, der Sprechkragen), die Spinde (Teos mit seinem Namen und seinem Gehörschutz daran), ein Pultstück der Pumpen, das Kabel mit den Knoten im Wasser; von oben fällt das Licht des Schachts herein, durch die Decke sieht man ein Stück der Gerüste. Grün und Bernstein, nass. |
| `flutwerk_steg` | **ein eigener kleiner Raum in Iso** (vom Nutzer entschieden 2026-11-24), höher als der Bildschirm, er scrollt nach oben und unten (Blockskizze `docs/mockups/flutwerk_steg_blocks_x3.png`) | `FLUTWERK – PUMP HALL 3 – NO ENTRY`, das Zahlenfeld. Wo der Steg abgeht (aus der Gasse am Wasser entlang?), entscheidet der Stadtplan. |
| `transit_neun` | **Iso, eine große, hohe Halle** (vom Nutzer gewählt 2026-11-24, nach einem Foto einer Check-in-Halle; Blockskizze `docs/mockups/transit_neun_halle_x2.png`, der Blick des Bildschirms `transit_neun_halle_blick_x3.png`): etwa 12 x 8 m, die Wände 7 m hoch, doppelt so hoch wie ein Raum, größer als der Bildschirm in beide Richtungen, die Kamera fährt mit wie in der Beobachtungshalle des Vorspanns; eine lange Reihe von Kontrollschaltern mit einem Bildschirm über jedem und einer Wache dahinter, Gassen aus Pfosten und Bändern, durch die sich die Schlange der Pendler zieht, hinter den Schaltern die Scanner-Bögen vor den Glasröhren, an der linken Wand die Werbung für Lull und die Tafel `NEXT LIFT 20:00`. Der Ort knüpft an den Vorspann an: Es sind die Aufzüge, mit denen Juno 2088 heruntergefahren ist. **Länger, nach rechts scrollend** (der Nutzer am selben Tag: Juno soll vom Eingang erst durch eine Halle zu den Schaltern, und es muss sichtbar werden, dass nur wenige hinaufdürfen; Vorschlag `transit_neun_lang_x1.png`, 24 x 7 m): gleich hinter den Glastüren die Vorkontrolle `PERMIT CHECK`, vier Tore, die cyan leuchten für eine Erlaubnis und rot für keine; mit Erlaubnis eine schmale, fast leere Spur hinter einer Glaswand entlang der Turmwand direkt zu den Bögen und Röhren; ohne den Wartesaal, breit und voll, Bänke, manche schlafen auf Lull (`LULL WHILE YOU WAIT`), die Tafel `TODAY APPROVED 4 / DENIED 2.318 / NOW SERVING 0412`, an seinem Ende die Antragsschalter mit der Wache aus §3.3. **Der Wartesaal ist nicht voll, und wer dort wartet, ändert sich mit Tag und Stunde** (der Nutzer, 2026-11-24): Routinen nach der Uhr, nur zum Ansehen, kein Zustand (Vorschlag: 18:00 bis 20:00 nach der Tagschicht die meisten, etwa ein Dutzend, Arbeiter aus den Pumpen mit ihren Papieren, eine Mutter mit Kind, ein alter Mann mit Koffer; ab 20:00 werden Nummern aufgerufen, Leute stehen auf, gehen zu den Schaltern und kommen kopfschüttelnd zurück, der Saal leert sich; ab 23:00 nur noch die, die über Nacht bleiben und auf den Bänken auf Lull schlafen, und ein Putzroboter; am Mittwoch, nach der Meldung von der neuen Station, Angehörige von Schläfern, die einen Besuch beantragen wollen, eine Frau mit einem Foto; die Zahlen der Tafel und `NOW SERVING` nach Tag und Uhr) | im Neunten, der Fuß der Transitachse: gläserne Aufzugsröhren, die in den Schacht um den Turm steigen, die Schranke, die Wache hinter Glas, ein Bogen mit Lesegerät, `RING 5 – WORK PERMIT ONLY`, rotes Licht (Behörde, Style Guide §5), eine Schlange Pendler mit Erlaubnis; nach oben der Blick durch den Schacht bis zum kalten Licht der Krone |
| der Traum | ein eigener Modus, Mockup zuerst (§3.5) | die Wand der Bilder, die Ecken, das Auge |
| die Station im Fünften | nur im Traum, durch ihre Kameras (Blockskizze des Raums für Kapitel 4: `docs/mockups/station_blocks_x2.png`; Iso, größer als der Bildschirm, sie scrollt bis zur Tür zu den Aufzügen unten rechts, vom Nutzer gewünscht 2026-11-24; die Monitore an den Betten pulsen Lulls Takt im Blassblau des Pflasters, nicht in Magenta) | Reihen von Schläfern in weißem Salzlicht (story §10k). Weil Juno in Kapitel 4 selbst dort hingeht, ist sie ein Ort für beide Kapitel: Sie wird als der Raum gebaut, den Kapitel 4 betritt, und im Traum unter dem Filter des Traums gezeigt (ein Ort, ein Bild). |
| die Wartungskameras | Feeds in den Rohren (§6.2; Blockskizze `docs/mockups/wartung_cam_blocks_x3.png`) | Rohre, Klappen, Lüfter, eine Drohne; alt, nachgerüstet, wie `cam31` |

## 10. Figuren

| Wer | Neu oder wieder | Wo | Was zu beachten ist |
|---|---|---|---|
| **Tinte**, groß | neu (in `cam33` nur klein) | `becken_raum` | eine fast vierzigjährige Pumpenkrake hinter dem Glas: ein großer Schatten, acht Arme, die jeder etwas anderes tun, Saugnäpfe am Glas, der Sprechkragen glimmt beim Reden; ihre Farbe `#b0b8ff` |
| **die Wache** am Kontrollpunkt | neu | `transit_neun` | Nagi·was Uniform in Weiß und Grau, ein rotes Licht an der Kappe; namenlos |
| **Morrow** | wieder | `transit_neun` | im Straßenmodus wie in der Jade Row in Kapitel 2 |
| **Teo im Traum** | neu (Variante) | Traum | Teo in Magenta und Weiß, sitzend am Rand neben der Kamera; das Pflaster am linken Ohr |
| **die Schläfer der Station** | neu | Traum (Station) | Reihen unter weißen Decken, Köpfe und Haare wie in `cam51`, Namensschilder |
| **Raya Morrow** | neu | Traum (Station) | 19, eine Schläferin wie die anderen unter der weißen Decke; im Traum in Magenta und Weiß, mit dem Pflaster und der Haarfarbe ihrer Mutter |
| **Ratz in den Rohren** | neu (Feed) | Wartungskameras | Ratz als Feed-Figur, sein Kragen hell wie eine Lampe |
| **die Kolonie** | neu (Feed) | Wartungskameras | Kabelratten mit glimmenden Kragen |
| **der Zeuge** | neu | Traum | ein Auge, eine Störung, viele Stimmen; Mockup |
| **die Quiet in der Wohnung** | wieder | `flat` | die gemalten Männer A und B (`art/characters/quiet.px.js`) |
| **Juno mit Lull** | Variante | Nahaufnahmen | das Pflaster neben dem Implantat hinter dem Ohr, unter der Kapuze nicht zu sehen |

## 11. Der Zustand

Neu im Hauptfaden: `know_flutwerk`, `know_teo_cam`, `link_cam33` (für jeden), `know_obs4`, das Ding `lull`, ein Schritt-Flag für die
Traumnächte und `e3`. In den Fäden `morrow_kind`, `ratz_kolonie` und `tinte` mit je einem Schritt. Weiter gehen davon nur `e3`,
`morrow_kind`, `ratz_kolonie`, `tinte` und `got_schal`, dazu das Kassenbuch. Die Traumnacht 1 ist eine Kette und kostet fast
nichts; was in Nacht 2 frei ist (die Bilder, die Juno ansieht), ist eine Ansicht, kein Zustand, außer dem, was sie findet.

## 12. Hinweise

Die Hinweise spricht EVI; ab dem Feuer ist sie roh, und ihre Hinweise sind verschlüsselt, aber lösbar (die dritte Stufe durch den Glitch
hindurch verständlich, story §10k). Das betrifft erst Kapitel 4.

| Für | Stufe 1 | Stufe 2 | Stufe 3 |
|---|---|---|---|
| das Tor | „Tinte hat geschrieben. Die Tür will Teos Zahl.“ | „Das Jahr vom Dach. Welches Dach meint er?“ | „Mach das Foto am Deck ganz auf. Unten rechts steht das Jahr.“ |
| Tinte | „Tinte war dabei, als er umfiel.“ | „Sie ist im Becken-Raum der Pumpenhalle.“ | „Geh durchs Tor zum Becken-Raum und sprich mit Tinte.“ |
| `OBS-4` | „Ines' Tabellen haben oben eine Kopfzeile. Die hast du noch nicht gelesen.“ | „Das Wort darin kennst du. Aus deinem Handbuch.“ | „Leg die Protokolle mit PRÜFEN neben das Beobachter-Handbuch.“ |
| Lull | „Lull kostet nichts. Das sagen alle.“ | „In der Klinik sitzt ab sieben Marit. Oder Sable hat welches.“ | „Hol dir Lull in der Klinik und kleb es dir ab eins im Bett hinters Ohr.“ |
| Nacht 2, Teo | „Teo ist nicht bei seinem Körper.“ | „Tinte hat gesagt, wohin er im Schlaf geschaut hat.“ | „Such im Traum das Bild von CAM 33, die Halle von oben.“ |

## 13. Was die Engine (und das Spiel) zusätzlich braucht

In welcher Reihenfolge das Kapitel gebaut wird, steht in `docs/PLAN.md` §4 („H6 in steps“, 2026-11-24): zuerst der Akt, dann der
Traum als technischer Versuch, dann der Hauptfaden, der Kontrollpunkt, die Fäden jeder für sich, das Leben drumherum, die Malerei
und am Ende die Läufe über die Kapitelgrenze.

Vorläufig, beim Bau zu prüfen:

1. **Der Traum** als Modus, in den drei Zuständen des Mockups (Datenraum, Tunnel, Bild aus Code; §3.5): viele Feeds zugleich auf einem Bild. Vermutlich ein Raum der Engine ohne gespielte Figur wie die Feeds
   (`observe`), dessen Bild das Spiel aus kleinen Feed-Bildern zusammensetzt (eine UI-Ebene in `game/`), dazu ein Nachbearbeitungs-Pass in
   Magenta und Weiß (C7 kennt Paletten). Generisch wäre höchstens „mehrere Räume als Kacheln in einem“; das klärt das Mockup.
2. **Die inneren Stimmen** (C12) wären für DAS IMPLANTAT bei `OBS-4` schön, sind aber nicht nötig: Ohne sie sagt Juno die Zeile selbst.
3. **Ein Zahlenfeld** wie die Eingabe des Takts an `cam31` (das Tor, §3.2): vorhanden, im Spiel.
4. **Der Akt `kapitel3`** mit `keep` und `leave` (§2.1) und `?act=kapitel3`.
5. **Der Solver über die Kapitelgrenze** (C15): Jeder Lauf von Kapitel 3 beginnt von den Enden seines Laufs in Kapitel 2 (`--from
   build/graph/kapitel2_<lauf>.js`, das die Läufe von Kapitel 2 dafür schreiben müssen, wie die von Kapitel 1 es tun: also über
   `graph.mjs`), und er variiert nur, was er liest: der Hauptlauf `e2` und `moth_student`, die Fäden ihre eigenen. Die Läufe kommen in
   `tools/runs.sh`. Vorher messen.

## 14. Offen

Fragen an den Nutzer (Story, Namen, Look):

- **Das Ende des Kapitels** (der Nutzer: „Müssen wir mal gucken, wie wir das Ende machen.“ – „das definieren wir, wenn es so weit ist“): Der Entwurf lässt Juno aufs Dach fliehen, weil die Quiet
  über die Treppe kommt und der einzige andere Weg hinaus Fenster, Sims und Leiter ist, und oben endet das Kapitel an ihrem Platz vom
  Foto, neben dem Teos Platz leer ist, mit dem Blick auf ihr brennendes Fenster. Offen ist, ob das Kapitel dort endet oder erst, wenn sie
  vom Dach herunter und fort ist (über die Nachbardächer, auf den Drain-Markt, wo Kapitel 4 beginnt), und ob die Regenleserin oben ist.
  (§3.8, §3.9)

Der Weg zum Flutwerk und der Kontrollpunkt liegen beide im Neunten (die Pumpenhalle 3 am Meer, der Kontrollpunkt am Fuß des Turms), also
auf den Ebenen, die der Stadtplan schon hat; nur weiter weg vom Kessel-Block. Einen zweiten Ring braucht der Plan erst mit Kapitel 4, wenn
Juno die Station im Fünften betritt. Im Stadtplan stehen beide als Vorschlag (`flutwerk_steg`, `flutwerk_tor`, `transit_neun`, dazu
`becken_raum` und `cam33`); an die richtige Stelle setzt sie der Nutzer (§9.2).

Technisch, beim Bau: Das Mockup des Traums ist freigegeben (beide Runden, vom Nutzer 2026-11-24); beim Malen werden Junos Umriss und Teo genauer und die Bilder im Datenraum lesbarer (§3.5); die Station als Raum für Kapitel
3 und 4, die Messung der Läufe (§13.5), §4.2 des Reviews (die Flicken von Kapitel 2 auf Räumen von Kapitel 1), sobald dieses Kapitel sie
berührt.
