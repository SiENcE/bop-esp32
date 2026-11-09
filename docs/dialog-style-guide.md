# Dialoge: Style Guide

Stand: 2026-11-10. Dieses Dokument regelt, **wie die Texte klingen**; nach ihm wird jeder Text geschrieben und geprüft.
Wie ein Gespräch gebaut ist (Stimmenwerte, Prüfungen, Nabe und Speichen, Protokoll-Modus), steht in `docs/dialog-design.md`.
Die Fakten stehen in `docs/story.md`, EVIs Wesen in `docs/kapitel0-design.md` §2.2.

Alle Beispiele sind Zeilen aus dem Spiel oder aus den Design-Dokumenten. Figuren ohne eine solche Zeile haben noch kein Beispiel;
ihre Stimme wird mit der ersten guten Zeile hier nachgetragen.

## 1. Der Grundsatz

**Schreib nicht wie für ein Cyberpunk-Spiel. Schreib Menschen, die zufällig in Nagi·wa leben.**

Das Seltsame ist Alltag, und niemand wundert sich. Die Leute haben Hunger, Schulden, schlechte Laune, kleine Gewohnheiten, Menschen,
die sie vermissen, und Dinge, über die sie nicht reden wollen. Der Ton folgt der Bibel (§1, §3): still, erwachsen, moralisch grau,
mit Wärme in kleinen Dingen, und Witz und Aufrichtigkeit stehen mitten im Ernst.

Eine gute Zeile tut drei Dinge zugleich, ohne dass man es merkt:

1. Sie verrät etwas über die Figur.
2. Sie zeigt etwas von der Welt.
3. Sie bringt die Szene weiter, im Gefühl oder im Spiel.

| Bereich | Regel |
|---|---|
| Ton | ruhig, erwachsen, trocken, warm |
| Satzbau | natürliche Umgangssprache in ganzen Sätzen, kurz bis mittel (§3) |
| Humor | beiläufig, aus Figur und Lage, nie Pointe um der Pointe willen |
| Gefühle | zeigen, selten aussprechen |
| Welt | durch Alltag, Gespräche und Beobachtungen, nie als Vortrag |
| Stimmen | jede Figur hat ihren eigenen Rhythmus und Wortschatz |
| Wahl | die Haltung ist vor dem Klick zu erkennen |
| Gedächtnis | die Figuren erinnern sich an frühere Kapitel und Entscheidungen |
| Stille | Pausen und Ungesagtes sind Mittel, keine Lücken |

## 2. Die Techniken

**Die Welt nebenbei.** Niemand erklärt, was alle wissen. Wer Flutschuld, Mods oder Lull erwähnt, redet über die eigene Miete, die
eigene Schicht, die eigene Mutter. Der Spieler setzt das Bild selbst zusammen. Auch ein Kind aus dem Neunten weiß, was im Neunten
alle wissen: Eine Frage, die nur der Spieler stellen würde, stellt niemand.

> Regenleserin: Als das Wasser kam, haben sie nicht abgepumpt. Sie haben draufgebaut.\
> Regenleserin: Und uns die Rechnung geschickt.

Die Regenleserin ist die Stelle, an der die Welt am meisten zur Sprache kommt, und auch sie hält keinen Vortrag: Sie sagt, wie es
schmeckt.

**Subtext.** Die Figuren sagen oft etwas anderes, als sie meinen, und das Gespräch handelt selten von seinem Thema. Sie dürfen etwas
voraussetzen, ausweichen, den Satz abbrechen und auf eine Frage nicht antworten.

> Juno: Bao. Hast du ...\
> Bao: Hm? Noch Brühe?\
> Juno: ... nichts. Schon gut.

**Liebe zeigt sich im Tun.** Niemand sagt, was jemand jemandem bedeutet. Teo zahlt die Miete und will nicht darüber reden:

> Teo: Hab gehört, die Miete. Ich hab Schichten gemacht. Schon überwiesen. Sag nichts.

**Stille.** Ein Spiel, dessen Kern das Zusehen ist, muss nicht jede Szene mit Text füllen. Ein `"..."` ist eine Zeile. Eine Wahl kann
Schweigen sein (`silent: true`, „Nichts sagen.“). Nach dem Schlimmsten darf eine Figur einfach etwas Normales tun (§8). Und ein Zögern kann
die halbe Antwort sein:

> Motte: Auch nicht, wenn mal was ist?\
> Juno: ...\
> Juno: Dann schon.

**Der Rhythmus wechselt** zwischen beinahe belanglosem Alltag, trockenen Bemerkungen, kleinen Momenten echter Zuneigung, unangenehmem
Ausweichen und kurzen, unerwartet ehrlichen Sätzen. Nicht jede Zeile sitzt: Wenn alle ständig clever sind, wird das Spiel künstlich.

**Bilder kommen aus der Hand.** Eine Figur vergleicht nur mit dem, was sie täglich anfasst: Die Regenleserin schmeckt, Bao kocht, Ratz
verkauft, das Kassenbuch rechnet. So darf auch eine schöne Zeile fallen, ohne dass jemand dichtet.

> Regenleserin: Das ist vom Vierten. Die gießen da oben ihre Orchideen.

## 3. Was wir vermeiden

- **Zu viel Slang.** Glass, Shine, Sinker und Chits wirken, wenn sie selbstverständlich und sparsam fallen.
- **Zu viel Poesie.** Die Stadt darf poetisch aussehen, ihre Leute reden nicht ständig so.
- **Wortgruppen statt Sätze.** „Eine Treppe. Ein Fisch. Regen von links.“ So redet kein Mensch. Wer spricht, sagt ganze Sätze mit Subjekt und Verb: „Da ist eine Treppe, und auf den Stufen ist ein großer Fisch. Es regnet von links.“ Das gilt für alle Figuren, auch für Junos Blicke und Gedanken. Ein Satz darf abbrechen, wo ein Mensch wirklich abbricht (Zögern, Ausweichen, „...“), aber eine Reihe von Stichworten ist kein Stil (entschieden 2026-11-09 von der Nutzerin).
  Die alten Zeilen werden gezielt umgeschrieben, nicht erst beim nächsten Anfassen: zuerst der Prolog (2026-11-10), dann Kapitel 1 Strang für Strang, jede Zeile der Nutzerin als Vorher und Nachher gezeigt (entschieden 2026-11-10).
  **Kurz darf es trotzdem sein,** und manchmal ist das gerade witzig. Der Telegrammstil bleibt an diesen Stellen (entschieden 2026-11-10):
  - **Geschriebenes:** Chat, Notizen im CACHE, das Kassenbuch, Schlagzeilen und Werbung (§4 F). So tippt man, so steht es auf Schildern.
  - **Echtes Zögern und Abbrechen:** „Bao. Hast du ...“, „...“.
  - **Kurze Antworten im Gespräch:** „Dann schon.“, „Ich weiß.“, „Nein.“, und eine trockene Antwort wie Baos „Brühe. Wie gestern. Morgen auch.“ auf „Was gibt's heute?“.
  - **Eile im Feed,** wenn gerade etwas passiert: „REC, schnell.“, „Mist.“
  - **Als Stilmittel einiger Figuren,** die so reden, weil es zu ihnen gehört. Wer das ist, entscheidet die Nutzerin; der Vorschlag: Morrow (dienstlich), Tinte (langsam, sehr kurz), Sable im Geschäft („Nett. 120.“), DER HUNGER (Befehle) und DIE BEOBACHTERIN (wie ein Bericht).
  Nie im Telegrammstil stehen Junos Blicke, ihre Gedanken in Ruhe und Beschreibungen: Die sagt sie in ganzen Sätzen, und ihre Pointe bleibt dabei („Das ist Gus Varga. Er ist kein Liebhaber, er ist ein Kredithai.“).
- **Zu viele Einzeiler.** Niemand ist eine Sprüchemaschine. Ernste Gespräche brauchen auch unspektakuläre Sätze. (Die Entscheidung vom 2026-11-06, dass die vorhandenen Blicke bleiben, wie sie sind, ist am 2026-11-10 aufgehoben: Sie werden in ganze Sätze umgeschrieben, und ihre Pointen bleiben.)
- **Zu viel Erklärung.** Niemand erzählt seine Biografie oder Nagi·was Geschichte, nur weil ein Gespräch begonnen hat.
- **Künstliche Coolness.** Juno ist keine unfehlbare Heldin. Sie sieht zu viel, isst zu wenig und weiß nicht immer, was sie tun soll.
- **Melodram.** Wer ständig von Verrat, Schicksal, Dunkelheit und der Wahrheit redet, verliert das Menschliche.

## 4. Die Arten von Text

Für jede Art gilt: So lang, wie sie gern gelesen wird. Tiefe entsteht durch viele Themen, nicht durch lange Zeilen (§5).

**A. Gespräche.** Ein Gespräch braucht einen konkreten Anlass, eine kleine Entwicklung, etwas Neues (eine Information oder ein
verändertes Gefühl) und einen natürlichen Ausstieg. Nicht jedes muss eine Geschichte erzählen: Manchmal vertieft es nur eine Beziehung.

**B. Ansehen** (Rechtsklick, langes Drücken). Das spricht Juno selbst, und sie liefert eine Beobachtung, keine Gegenstandsbeschreibung.
Sie ist Glasserin: Sie sieht, was andere übersehen. Nichts, was das Spiel braucht, darf hier hängen (`CLAUDE.md`).

> Juno: Frau Haldane hat Doppelschicht. Sie schläft, wie andere Leute blinzeln.

**C. Der Ort, der sich ändert.** Dasselbe Ding bekommt je nach Tag und Kapitel einen anderen Satz, und so erzählt ein einziges Objekt
eine Geschichte. Das passt zu einer Stadt, die ohne Juno weiterlebt, und es kostet nichts: Es liest vorhandene Flags (`day`) und setzt
keine neuen. Vorbild ist Mottes „Was gibt's Neues im Haus?“ (`game/motte.js`).

**D. EVI aus der Tasche.** Sie redet nicht ständig und kommentiert nicht jede Handlung. Sie spricht zu Juno, nie in ein Gespräch mit
anderen hinein (`dialog-design` §2), und im Feed nur, wenn Juno sie fragt, nie mitten in einem Moment (`kapitel0-design` §2.2). Danach
darf sie etwas sagen, und dann trifft es oft am härtesten. (Die einzige Ausnahme sind ihre Touch-Tipps, `game/evi.js`: Die sprechen den Spieler an.)

> Juno: Schlafen Sie gut, Frau Imai.\
> EVI: Die Treppe gibt es aber. Ich hab sie gesehen.\
> Juno: Ich weiß.

**E. Entscheidungen.** Die Optionen unterscheiden sich in der Haltung, und die Haltung ist vor dem Klick zu erkennen. Was der Spieler
wählt, sagt Juno wörtlich: Die Option ist der Satz selbst, die Reaktion passt zu genau diesem Satz, und nichts Überraschendes steckt
dahinter. Gesagtes steht in „…“. Eine Handlung steht ohne Anführungszeichen und ist immer `silent`, sonst sagt Juno sie laut. Große Entscheidungen fallen nie aus Versehen (Bibel §5).

> „Sie sind nicht verrückt.“\
> „Das war ein Traum.“

**F. Geschriebenes.** Chat, Notizen und Kassenbuch sind noch knapper als Gesprochenes, und hier darf der Telegrammstil stehen (§3). Im Chat schreibt jeder, wie er tippt: Teo
nennt sie Ju, Sable unterschreibt mit S., WREN bleibt beim Sie und ohne Gruß. Das Kassenbuch ist ein Protokoll: was, an wen, für wie
viel, später was daraus wurde. Es urteilt nie.

**G. Hinweise.** EVI gibt sie in ihrem Ton, aber immer **richtig und klar**: Daten liest sie gut, nur Menschen nicht
(`kapitel0-design` §2.2). Wo Ton und Klarheit sich streiten, gewinnt die Klarheit. Die letzte Stufe sagt, was zu tun ist.

## 5. Harte Regeln

**Sprache**

- Deutsch zuerst. Der Slang der Stadt bleibt englisch, auch im deutschen Satz: **Glass**, **Glasser/Glasserin**, **glassen**, **Shine**,
  **Sinker**, **Chits**. Eigennamen ebenso: Lull, Civic Rest, NINTH LIVE.
- **Die Quiet** ist Singular: „Die Quiet stürmt den Block.“
- **Der Neunte, die Krone, die Ringe** sagen die Leute von hier, nie „die Arkologie“.
- **Nagi·wa** schreibt sich im Text immer mit dem Mittelpunkt, im Genitiv „Nagi·was“ („Nagi·was Kamera“); auf Schildern `NAGI·WA` oder nur `凪輪` (Bibel §10d). Gesprochen: Na-gi-wa.
- **Lull und das Implantat sind zweierlei.** Lull ist der blasse Punkt hinter dem Ohr der anderen; „das Implantat“ ist nur das der
  Beobachter, also Junos. Ein Lull-Nutzer sagt „Lull“ oder „das Licht hinterm Ohr“. Dass beide zusammengehören, kommt erst nach und
  nach heraus (Bibel §10a).
- **Sinker** sagen die Leute, **Ruhe-Erschöpfung** sagt Nagi·wa. Wer das zweite sagt, zitiert es meist.
- **Sable** bekommt im Deutschen keine Pronomen und keine gegenderten Rollenwörter (Bibel §10). Die Sätze werden darum herum gebaut.
- **Keine Spielwörter in Junos Mund:** kein „Linksklick“ oder „Rechtsklick“, denn der Text muss auch für den Finger und später den Controller stimmen.
- **Den Takt** „lang, kurz, kurz, lang“ sagen im Klartext nur Motte (wenn Juno fragt, wie er bei seiner Mutter mitzählt) und EVI als letzte Stufe ihres Hinweises (Bibel §10c, geändert 2026-11-07). Juno selbst sagt ihn nie.
- Pausen und Abbrüche schreiben wir `...`, Anführungszeichen `„…“`.
- Eine Pointe, die nur auf Deutsch funktioniert, braucht schon beim Schreiben eine Idee für die englische Fassung (H10).

**Länge**

- Eine gesprochene Zeile bleibt **unter etwa 90 Zeichen** (im Spiel heute: die Hälfte unter 45, neun von zehn unter 85). Ein längerer
  Gedanke wird auf mehrere Zeilen verteilt, und sein Umbruch ist eine Pause.
- Kurz heißt wenige Wörter, nicht ohne Verb: „Meine Matratze liegt auf einer Palette.“ hat 40 Zeichen (§3).
- Der geplante Protokoll-Modus hat etwa 21 Zeichen je Zeile (`dialog-design` §5): noch ein Grund für kurze Sätze.

**Bau** (technisch, `CLAUDE.md` und `dialog-design` §4)

- Nie mehr als vier Optionen auf einmal, den Weg zurück mitgezählt. Längere Gespräche verschachteln sich (`Nagiwa.talkTree`).
- Alle Texte gehen über i18n; gemalter Text ist nur für Schilder und Technik der Stadt (englisch).
- Reaktionen **lesen** Flags, sie setzen nur welche, wenn es für die Geschichte zählt. Flavour darf man wieder fragen und kostet dann
  keinen Zustand. Was hier etwas für später anlegt, steht im Design-Dokument des Kapitels (wie `kapitel1-design` §7).
- Nebengeschichten sind Fäden für sich: Eine Zeile liest innerhalb eines Kapitels keine Flags eines anderen Fadens.
- Sprecherfarben folgen dem Style Guide: Rot nur für Bedrohungen, Cyan nur für Technik.

**Du und Sie**

Die Anrede sagt etwas über Nähe und Abstand, nichts über Geschlecht, Herkunft oder Alter, und für alle gilt dieselbe Regel:

- **Du ist im Neunten normal.** Wer sich kennt oder auf derselben Straße lebt, duzt sich.
- **Sie schafft Abstand.** Es gilt gegenüber Fremden, Ämtern, Nagi·wa und allen, die dafür bezahlen, dass man sie nicht kennt: Frau Imai,
  WREN, Vesper, Morrow, Aubrecht.
- **Der Wechsel vom Sie zum Du ist ein kleines Ereignis** in der Beziehung. Die Handlung hängt nie daran, weil es den Unterschied im
  Englischen nicht gibt (H10).
- Einmal festgelegt, bleibt die Anrede eines Paars gleich, bis so ein Wechsel geschieht. Für eine neue Figur wird sie bei der ersten Zeile
  entschieden.
- Anreden wie „Frau“, „Herr“ oder „Junge Frau“ fallen nur, wo sie zur Figur passen, bei Sable nie.

**Die Ausnahmen und Besonderheiten:**

| Wer | Was |
|---|---|
| Lantern | siezt Juno zuerst, aus Misstrauen; wird Lantern in Kapitel 2 zum Verbündeten, wechseln die beiden zum Du |
| Ashe | bleibt beim Sie, obwohl er und Juno einmal in derselben Halle saßen: Das Sie trägt die Bedrohung |
| Juno am Feed | sagt du zu denen, die sie beobachtet und die sie nicht hören können („Ines. Geh nach Hause.“) |
| Teo, die Regenleserin | duzen wie alle; Teo sagt „Ju“, die Regenleserin „Kind“ |
| Frau Haldane | sie und Juno duzen sich, „Frau Haldane“ bleibt nur als Name |

## 6. Die Stimmen

Man soll eine Figur an wenigen Worten erkennen. Jede Karte sagt, wie die Figur klingt, was sie nie täte, und zeigt echte Zeilen.

### Juno Reyes: die Beobachterin

Trocken, knapp, aufmerksam. Knapp heißt: Sie sagt wenig, aber in ganzen Sätzen (§3). Stellt präzise Fragen, oft Gegenfragen, und vertraut Worten nicht besonders. Lieber konkret als poetisch,
selten große Gefühle. Sagt nie, was sie fühlt, solange sie es umgehen kann, und spielt nie die Coole. Am Anfang hält sie Menschen auf
Abstand; später darf sie mehr sagen, ohne eine andere zu werden.

> „Wer bezahlt im Voraus? Niemand bezahlt im Voraus.“\
> „Von Leuten ohne Namen nehm ich nichts.“\
> „Jeder Verkauf landet im Kassenbuch. Jeder.“

### EVI: die Neugierige

Sie bleibt, wie sie ist (`kapitel0-design` §2.2): niedlich, lieb, leicht zu begeistern, und ein echtes Gegenüber, kein Maskottchen. Kurze
Sätze und viele Fragen. Sie liest Daten hervorragend und Menschen hoffnungslos falsch, und der Witz liegt in diesem Abstand; sie macht
selbst keine Witze. Sie urteilt nie. Ihre seltenen Treffer sind die Stellen, die hängen bleiben. Ihre Laune zeigt das Gesicht, nicht der
Text. Keine Amtssprache, keine Emojis. Auch die EVI mit dem magentafarbenen Glanz (Kap. 4) bleibt EVI.

> „Guten Abend, Juno! Eine neue Nachricht. Null Abendessen.“\
> „Aber du hast es gemacht. Menschen sind schwer.“\
> „Wir haben nichts geschickt. Ist das nett oder feige? Ich weiß das nie.“\
> „Er hat sie ausgeschaltet. Juno. Er hat sie ausgeschaltet.“

### Teo Reyes: der Optimist

Warm, schnell, beschwichtigend. Nicht naiv: Er weiß, wie schlimm seine Schichten sind, und macht nur kein Problem daraus. Beiläufige
Zuversicht, kleine Witze, praktische Dinge, selten die eigenen Schmerzen. Sagt nie, dass er nicht mehr kann. Gerade darum treffen
seine stillen Momente.

> „Vier Stunden Lull, und ich bin wie neu.“\
> Juno: „Seit wann?“ Teo: „Seit es gratis ist.“\
> „Du redest noch immer, als hätten sie dich gefeuert, weil du schlecht warst.“\
> „Schlaf du auch mal, Ju.“

### Bao: der Gastgeber

Gemütlich und beiläufig, jemand, der seit Jahrzehnten an derselben Ecke steht. Ein alter Koch mit Rechnungen und Kundschaft, kein weiser
Großvater aus dem Märchen. Alltagsbilder, freundlich, nicht aufdringlich; Lebensweisheiten, die nie so klingen. Redet ständig von seinem
Mann, „meinem Alten“, und ab und zu fällt der Name Lou (Bibel §10b), ohne dass es jedes Mal etwas bedeutet.

> „Juno! Wie immer? Ich schreib's an.“\
> „Brühe. Wie gestern. Morgen auch. Darum heißt es ja: wie immer.“\
> „Mein Alter sagt, ich salz zu viel. Lou isst seit vierzig Jahren hier.“\
> „Er hat nie recht. Darum ist er mein Alter.“

### Sable: der Handel

Charmant, präzise, geschäftlich, sprachlich kontrollierter als Juno. Jede Information hat einen Preis, und Sable weiß genau, wann ein Satz
mehr verrät als nötig. Keine Unterweltfigur, die in Rätseln spricht. Sable ist ehrlich darin, unehrlich zu sein: Das ist interessanter als
bloßes Lügen.

> „Ruhige Nacht? Ich kaufe alles, was atmet. S.“\
> „Nett. 120.“\
> „Varga redet.“

### Ratz: der Geschäftsmacher

Schnell, misstrauisch, geschäftstüchtig, darf etwas überdrehter sein als die anderen. Kennt jedes Rohr und verkauft alles, was nicht
festgeschraubt ist. Der geflickte Sprechkragen vertauscht manchmal Wörter: eine Würze, kein Dauergag. Seine Aberglauben nimmt er ernst,
und sie müssen nicht jedes Mal komisch sein. Noch keine Zeile im Spiel.

### Tinte: die alte Kollegin

Langsam, trocken, gelassen, sehr kurze Sätze. Kein Orakel, keine langen Metaphern: eine fast vierzigjährige Krake, die seit Jahren mit Teo
arbeitet und mehr weiß, als Nagi·wa ihr zutraut. Sie zählt, und sie sagt, was sie gezählt hat.

> „Dein Bruder schläft im Becken-Raum. Er hört nicht. Komm.“

### Motte: das Kurierkind

Zwölf, ein Kind von hier, kein niedliches Kind. Sagt, was er sieht, und zählt alles mit. Merkt Dinge, ohne zu wissen, was sie bedeuten.
Juno vergöttert er, ohne es zu sagen.

> „Die sehen eine Mütze.“\
> „Ich warte seit zwei Jahren auf den Dienstag.“\
> „Nachts geht sie an mir vorbei wie an einer Wand.“

### Mei: die Wirtin

Trocken, knapp, rechnet in Strichen statt in Chits. Fragt keinen was und hört alles; Gerüchte gibt sie weiter wie Wechselgeld, ohne
Kommentar. Was kaputt ist und trotzdem läuft, nennt sie Glück. Duzt Juno. Nie rührselig, nie neugierig. (Ein Vorschlag, zu prüfen beim
Durchspielen.)

> „Wer anschreibt, kommt wieder.“\
> „Die bar zahlen, seh ich nie wieder.“\
> „Freundlich war er. Die sind immer freundlich.“

### Frau Haldane: die Nachbarin

Immer müde, immer freundlich, auf Lull. Sie weiß nicht, was sie nachts tut, also weiß es auch ihr Text nie. Noch keine Zeile im Spiel,
nur Junos Blick auf sie.

### Die Regenleserin: die Merkwürdige vom Dach

Zweiundachtzig, sagt „Kind“, kennt Juno und Teo von früher. Spricht in Geschmack und Wetter, und das Wetter ist Klatsch. Sie darf von allen
am schönsten reden, weil alles von ihrer Zunge kommt. Sie weiß nie, was sie weiß.

> „Du verkaufst Shine, Kind. Ich sag nur, wie's schmeckt.“\
> „Sag ihm, er soll mal raufkommen. Solange er die Leiter noch findet.“

### Der Prediger und die halbe Reparatur

Merkwürdige Leute dürfen eine einzige Idee haben, und die ziehen sie durch. Der Prediger: laut, zitternd, schenkt Kaffee ein, liegt mit
seinen Gründen falsch und mit seinem Verdacht richtig. Die Reparatur: Dienst nach Vertrag, bis in die Weltanschauung.

> „Ich weiß es nicht. Ich glaube es. Das ist billiger. Kaffee?“\
> „Keine Ahnung. Ist nicht mein Vertrag.“

### Lt. Agnes Morrow: die Müde

Knapp und dienstlich, und sie hasst, was sie tut. Jede Frage nach ihrer Tochter prallt am Dienst ab. Spricht lieber über Vorschriften als
über sich. Das Geld nimmt sie, als wäre es Papierkram.

> „Das ist für die ruhige Woche. Freitag fährt keiner die Kowalski.“

### Dr. Ines Calder und Lantern

Juno hört die beiden fast nur durchs Glass, also müssen wenige Sätze sie tragen. Ines: genau, ruhig, wissenschaftlich, und man hört, was
sie weiß. Lantern: misstrauisch, vorsichtig, bricht Sätze ab. Lanterns Stimme für die großen Gespräche ab Kapitel 2 fehlt noch.

> Ines: „Es stimmt. Sie schlafen nicht. Sie *arbeiten*.“\
> Lantern: „Wenn das stimmt ...“

### Direktorin Selene Aubrecht: die Überzeugte

Ruhig, rational, kultiviert. Sie hält sich für eine vernünftige Person, die eine schwierige Entscheidung getroffen hat, und glaubt an ihre
Zahlen. Sie droht nicht und muss nicht so tun, als wäre sie böse: Sie ist freundlich und sagt dabei etwas Ungeheuerliches. Was sie anordnet,
nennt sie nie so.

> „Das Problem Calder ist gelöst.“\
> „AUTO-EVAL. Wir haben dich abgeschaltet.“

### Corvin Ashe: die höfliche Bedrohung

Höflich, geduldig, kontrolliert. Je höflicher, desto bedrohlicher. Nie wie ein Mörder aus dem Actionfilm: Er erklärt nicht, was er vorhat,
und macht nur deutlich, dass er mehr weiß, als Juno lieb ist. Er war Beobachter in ihrer Halle und redet mit ihr wie mit einer Kollegin, die
denselben Beruf hat. Seine erste Äußerung im Spiel ist ein Blick in die Kamera. Noch keine Zeile.

### Der Zeuge

Viele Stimmen zugleich (die von Frau Haldane ist darunter). Wenn er durch das Implantat spricht: Magenta-Weiß, Kleinbuchstaben, ohne Namen,
und der Spieler merkt es zuerst am Ton (`dialog-design` §2). Sonst noch offen.

### Geschäftsleute und Nagi·wa

- **Varga** droht wie jemand, der eine Rechnung stellt: „Bis Freitag, Kessler. Sonst holen wir uns mehr als einen Ring.“
- **WREN** schreibt, als wäre alles schon bezahlt, siezt und grüßt nicht: „Wie Sie wollen. Das Angebot bleibt.“
- **Vesper** ist begeistert vom Echten und merkt nichts: „Ohne Gesichter ist es kein Leben.“
- **Nagi·wa selbst** ist immer freundlich, immer im Sie und sagt nie etwas: „Nagi·wa dankt Ihnen für Ihren Dienst.“ „Ihre Meldung wird
  bearbeitet.“

### Die Stimmen im Radio

Drei Sender (`game/radio.js`); ihre Moderatoren reden zwischen den Stücken, wie man im Radio redet: zu allen und zu niemandem, kurz, mit
Ansagen, Grüßen, Wetter und dem, was gerade los ist. Sie wissen nichts von Juno. (Vorschläge, 2026-11-08, noch nicht geprüft.)

- **NINTH FM**, die Nachtsendung des Neunten: kennt die Straße, duzt ihre Hörer („ihr“), trocken und ein bisschen müde, auf ihrer Seite.
  „Wer die Miete schon hat: Glückwunsch. Wer nicht: Das nächste ist für dich.“
- **NAGI·WA EASY** ist Nagi·was Stimme (oben): freundlich, Sie, sagt nichts. „Entspannung ist ein Recht. Um den Rest kümmern wir uns.“
- **KESSEL ROOFTOP**: jemand im Block legt nachts Platten auf, verschlafen, sagt nie, wer er ist. „Keine Werbung. Kein Geld. Nur Regen auf
  dem Mikrofon.“

## 7. Die inneren Stimmen

Die sechs Stimmen (`dialog-design` §2) sind Teile von Juno, und man hört sie auch ohne Farbe auseinander. Sie sagen einen Satz, selten zwei,
und reden nie Juno ins Gespräch hinein: Sie reden mit ihr. **Ansehen bleibt Junos eigener Text**; die Stimmen mischen sich nur ein, wenn ihr
Wert hoch genug ist. Sie dürfen sich irren, einander widersprechen und lügen. Noch ist keine gebaut (Engine C12).

| Stimme | Klang | Worauf sie achtet | Sagt nie |
|---|---|---|---|
| **DIE BEOBACHTERIN** | kühl, genau, wie ein Bericht | was zu sehen ist: Hände, Blicke, was nicht passt | was jemand fühlen sollte |
| **DIE HÄNDLERIN** | zynisch, witzig, schnell | was etwas wert ist, wer wem was schuldet | etwas umsonst |
| **DIE SCHWESTER** | warm, leise, ungeduldig | was jemand braucht | etwas Kluges |
| **DER HUNGER** | sehr kurz, körperlich, oft Befehle | Müdigkeit, Angst, Essen, Fluchtwege | etwas über andere |
| **DAS IMPLANTAT** | sachlich, fremd, Technikwörter, kein Ich | Protokolle, Netze, Kameras, Codes | etwas über Menschen |
| **DAS KASSENBUCH** | trocken, unerbittlich, wie ein Buchhalter | was eine Tat kostet und wer bezahlt | was Juno tun soll |

> DIE HÄNDLERIN: Er lügt nicht. Er verhandelt.\
> DIE BEOBACHTERIN: Seine linke Hand. Er hat einen Ring abgelegt.

EVI ist keine Stimme. Wo beide dasselbe sehen, liest die Beobachterin es richtig und EVI falsch.

## 8. Die Geschichte verändert, wie sie reden

Die Beziehungen laufen über sechs Kapitel weiter, und niemand redet, als hätte er Juno gerade erst kennengelernt. Für jede Hauptfigur
kommt so eine Zeile in die Tabelle, sobald ihr Kapitel geschrieben wird. Die Abzweigungen stehen in der Bibel.

| Wann | Bao und Juno |
|---|---|
| Prolog | vertraute Kundin, kleine Schulden, Alltagsnähe |
| Kapitel 1 | Bao merkt, dass Juno etwas beschäftigt |
| Kapitel 2 | Bao ist verletzt oder betroffen, falls der Laden ausgeraubt wurde |
| Kapitel 3 | Juno kann nicht mehr einfach vorbeikommen |
| Kapitel 4 | Bao weiß, dass Juno gejagt wird |
| Epilog | Die beiden können endlich über andere Dinge sprechen |

**Dieselbe Frage kann etwas anderes heißen.** „Hast du gegessen?“ ist im Prolog eine Begrüßung, später Angst, und im Epilog wieder Alltag.
So etwas wird bewusst angelegt, wie Mottes Backup oder der Satz über die Leiter (`kapitel1-design` §7).

**Festgelegte Szene für Kapitel 2** (Bibel §10b): Juno kommt zum ersten Mal nach dem Mord wieder nach Hause, und EVI macht etwas Normales.

> EVI: Willkommen zurück, Juno.\
> Juno: ...\
> EVI: Soll ich den Monitor heller machen?\
> Juno: Ja.\
> EVI: Er ist heller.\
> Juno: Danke.\
> EVI: Gern.

## 9. Prüfliste für jede neue Zeile

1. Würde sie jemand sagen, der hier lebt, oder nur jemand, der es dem Spieler erklären will?
2. Erkennt man die Figur ohne Namen und Farbe?
3. Geht es unter der Oberfläche um etwas anderes?
4. Ist es ein ganzer Satz, wie ihn ein Mensch sagt, und keine Reihe von Wortgruppen? Oder ist es eine der Stellen, an denen der Telegrammstil bleiben darf (§3)? Darf das auch unspektakulär sein? Muss hier wirklich eine Pointe stehen?
5. Stimmt sie mit der Bibel überein (Fakten, Du und Sie, Lull und Implantat)?
6. Unter etwa 90 Zeichen? Ist die Haltung einer Wahl vor dem Klick klar?
7. Geht sie auf Englisch noch?
8. Würde hier auch Schweigen genügen?
