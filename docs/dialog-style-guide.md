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
- **Zu viel Poesie.** Die Stadt darf poetisch aussehen, ihre Leute reden nicht ständig so. Die eine Ausnahme ist die Regenleserin (unten).
- **Wortgruppen statt Sätze.** „Eine Treppe. Ein Fisch. Regen von links.“ So redet kein Mensch. Wer spricht, sagt ganze Sätze mit Subjekt und Verb: „Da ist eine Treppe, und auf den Stufen ist ein großer Fisch. Es regnet von links.“ Das gilt für alle Figuren, auch für Junos Blicke und Gedanken. Ein Satz darf abbrechen, wo ein Mensch wirklich abbricht (Zögern, Ausweichen, „...“), aber eine Reihe von Stichworten ist kein Stil (entschieden 2026-11-09 von der Nutzerin).
  Die alten Zeilen werden gezielt umgeschrieben, nicht erst beim nächsten Anfassen: zuerst der Prolog (2026-11-10), dann Kapitel 1 Strang für Strang, jede Zeile der Nutzerin als Vorher und Nachher gezeigt (entschieden 2026-11-10).
  **Kurz darf es trotzdem sein,** und manchmal ist das gerade witzig. Der Telegrammstil bleibt an diesen Stellen (entschieden 2026-11-10):
  - **Geschriebenes:** Chat, Notizen im CACHE, das Kassenbuch, Schlagzeilen und Werbung (§4 F). So tippt man, so steht es auf Schildern.
  - **Echtes Zögern und Abbrechen:** „Bao. Hast du ...“, „...“.
  - **Kurze Antworten im Gespräch:** „Dann schon.“, „Ich weiß.“, „Nein.“, und eine trockene Antwort wie Baos „Brühe. Wie gestern. Morgen auch.“ auf „Was gibt's heute?“.
  - **Eile im Feed,** wenn gerade etwas passiert: „REC, schnell.“, „Mist.“
  - **Als Stimme von vier Figuren,** die so reden, weil es zu ihnen gehört: Morrow, Sable, DER HUNGER und DIE BEOBACHTERIN (entschieden 2026-11-10, siehe „Das Satzmaß“ unten).
  Nie im Telegrammstil stehen Junos Blicke, ihre Gedanken in Ruhe und Beschreibungen: Die sagt sie in ganzen Sätzen, und ihre Pointe bleibt dabei („Das ist Gus Varga. Er ist kein Liebhaber, er ist ein Kredithai.“).
- **Ein Satzmaß für alle.** Die meisten reden in ganzen, kurzen bis mittleren Sätzen, und drei Maße heben einzelne Figuren davon ab (entschieden 2026-11-10):
  - **Telegrammstil:** Morrow (wie ein Funkspruch), Sable (jedes Wort kostet), DER HUNGER (Befehle) und DIE BEOBACHTERIN (wie ein Bericht). Sie lassen weg, was sich von selbst versteht, auch das Verb.
  - **Lyrisch:** die Regenleserin. Ihre Sätze haben Rhythmus und Bilder, aber die Bilder kommen aus Geschmack, Wasser und Wetter (§2, „Bilder kommen aus der Hand“). Sie ist trotzdem kein Orakel.
  - **Lange, geschmeidige Sätze:** Direktorin Aubrecht. Ein Gedanke läuft bei ihr über Nebensätze und Kommas, ohne Bruch und ohne Eile, und gerade darin klingt das Ungeheuerliche vernünftig. Ein solcher Satz darf über mehrere Zeilen gehen (§5).
  Dadurch erkennt man diese Figuren schon am Satzbau. Die anderen tun es ihnen nicht nach, auch nicht für eine Pointe.
  **Jeder hat seinen eigenen Stil, und doch passt alles zusammen** (vom Nutzer bestätigt 2026-11-20): Die Regenleserin darf in Metaphern
  und lyrisch reden, Sable knapp, Aubrecht lang; Juno antwortet allen so, wie man mit Menschen redet (§4 E), und hält die Stimmen
  zusammen. Beim Überarbeiten wird keine Figur an die anderen angeglichen.
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
> „Das war nur ein Traum.“

**Was Juno im Gespräch sagt, klingt wie ein Gespräch** (vom Nutzer gewünscht 2026-11-20). Eine Option ist kein Stichwort für den
Spieler, sondern der Satz, den Juno diesem Menschen in diesem Moment sagt:

- **Sie fängt an wie ein Mensch.** Wer jemanden zum ersten Mal anspricht, grüßt oder fragt, wen er vor sich hat („Hallo. Bist du Pike?“),
  und sagt, wer sie schickt („Ratz hat gesagt, ich soll mit dir reden.“).
- **Sie gibt den Zusammenhang mit,** den der andere nicht kennt: woher sie etwas weiß („Sagt zumindest Ratz.“), wann und wo es war
  („In Lanterns Sendung am Sonntag ...“).
- **Sie fragt mit Fragen.** Eine echte Frage („Kann es sein, dass Lantern da draußen in den Sümpfen lebt?“, „Hast du ihn da draußen
  schon mal gesehen?“) statt einer hingeworfenen Behauptung („Ratz sagt, du stakst da raus.“) oder eines Themas („Die Stimme im
  Radio. Nagi·wa lügt.“).
- **Die kleinen Wörter gehören dazu,** wie man sie wirklich sagt: „Sag mal“, „doch“, „eigentlich“, „schon gut“.
- **Die Option ist ihr erster Satz;** was sie danach noch sagt, folgt als ihre nächsten Zeilen. So bleibt jede Zeile unter 90 Zeichen,
  und die Option passt in eine Zeile der Auswahl (etwa 60 Zeichen).
- Knapp bleibt sie trotzdem (§6): Natürlich heißt nicht geschwätzig, und kurze Antworten im Gespräch („Ich weiß.“, „Nein.“) bleiben kurz.

> vorher: „Ratz sagt, du stakst da raus.“\
> nachher: „Sag mal, du fährst doch öfter raus in die Sümpfe?“ – „Sagt zumindest Ratz.“\
> vorher: „Die Stimme im Radio. Nagi·wa lügt.“\
> nachher: „Die Stimme im Radio am Sonntag, hast du die auch gehört?“ – „Er sagt, Nagi·wa lügt. Ich glaub, er hat recht.“

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
- Aubrechts lange Sätze laufen über mehrere Zeilen. Jede Zeile bleibt unter 90 Zeichen, und umbrochen wird an einem Komma, nicht mitten im Gedanken.
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
| Lantern | duzt Juno von Anfang an, wie man sich unten duzt (vom Nutzer entschieden 2026-11-16; vorher siezte er sie aus Misstrauen); die Nähe wächst über den Ton, nicht über die Anrede |
| Pike | duzt Juno wie jeder auf dem Markt |
| Ashe | bleibt beim Sie, obwohl er und Juno einmal in derselben Halle saßen: Das Sie trägt die Bedrohung |
| Juno am Feed | sagt du zu denen, die sie beobachtet und die sie nicht hören können („Ines. Geh nach Hause.“) |
| Teo, die Regenleserin | duzen wie alle; Teo sagt „Ju“, die Regenleserin „Kind“ |
| Frau Haldane | sie und Juno duzen sich, „Frau Haldane“ bleibt nur als Name |
| Marit Holm | siezt Juno an der Aufnahme wie ein Amt; wenn sie leise von Ines redet, rutscht sie ins Du und bleibt dabei (vom Nutzer entschieden 2026-11-17) |

## 6. Die Stimmen

Man soll eine Figur an wenigen Worten erkennen. Jede Karte sagt, wie die Figur klingt, was sie nie täte, und zeigt echte Zeilen.

### Juno Reyes: die Beobachterin

Trocken, knapp, aufmerksam. Knapp heißt: Sie sagt wenig, aber in ganzen Sätzen (§3), und im Gespräch so, wie man mit einem Menschen redet: grüßt, sagt, woher sie etwas weiß, und fragt mit echten Fragen (§4 E). Stellt präzise Fragen, oft Gegenfragen, und vertraut Worten nicht besonders. Lieber konkret als poetisch,
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

Charmant, präzise, geschäftlich, sprachlich kontrollierter als Juno. Sable redet und schreibt im Telegrammstil, als kostete jedes Wort (§3). Jede Information hat einen Preis, und Sable weiß genau, wann ein Satz
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

### Frau Imai: die Zeugin im Schlaf

Höflich und langsam, sie hat es mit nichts eilig. Sie siezt alle und sagt „habe“, nicht „hab“. Was sie gesehen hat, erzählt sie genau, Bild für Bild, wie eine
Zeugin vor Gericht, und deutet es nie. Ihre Angst steht nicht in ihren Wörtern, sondern in dem, was sie tut: nicht schlafen, Tropfen holen. Auf Lull.
(Ein Vorschlag vom 2026-11-19, nach dem Durchspielen von Kapitel 2 vom Nutzer entschieden 2026-11-21.)

> „Da ist eine Treppe, und auf den Stufen ist ein großer Fisch. Es regnet von links.“\
> „Er hat hochgeschaut. Zu mir.“\
> „Ich hole mir Tropfen. Damit träumt man gar nicht mehr.“

### Frau Haldane: die Nachbarin

Immer müde, immer freundlich, auf Lull. Sie weiß nicht, was sie nachts tut, also weiß es auch ihr Text nie. In Kapitel 1 spricht sie
einmal, am Donnerstag, wach an ihrer Tür (`game/stadt.js`): kurze Sätze, sie fragt nach Post, und sie tröstet sich selbst („Dann schlaf
ich, und morgens ist es nicht mehr so schlimm.“).

In Kapitel 2 (ihr Sohn Najo, `game/kapitel2_haldane.js`; ein Vorschlag vom 2026-11-19, vom Nutzer entschieden 2026-11-21): Sie ist wach, und das hört man nur daran, dass sie zählt. Sonntage, Briefe, Wochen. Sie bittet, ohne zu drängen, und fragt danach nur noch eins: „Hast du ihn gesehen?“ Was sie hört, nimmt sie still; ihre Antworten sind ein Satz, der sie selbst tröstet, und manchmal tröstet er falsch.

> „Sonntags schlaf ich nicht. Sonntags kommt sein Brief.“\
> „Dann schlaf ich auch. Dann bin ich näher bei ihm.“

### Die Regenleserin: die Merkwürdige vom Dach

Zweiundachtzig, sagt „Kind“, kennt Juno und Teo von früher. Spricht in Geschmack und Wetter, und das Wetter ist Klatsch. Sie darf von allen
am schönsten reden, weil alles von ihrer Zunge kommt: Sie ist die eine Figur, die lyrisch spricht (§3), in ganzen Sätzen mit Rhythmus
und Bildern aus Geschmack, Wasser und Wetter. Sie weiß nie, was sie weiß.

> „Du verkaufst Shine, Kind. Ich sag nur, wie's schmeckt.“\
> „Sag ihm, er soll mal raufkommen. Solange er die Leiter noch findet.“

### Der Prediger und die halbe Reparatur

Merkwürdige Leute dürfen eine einzige Idee haben, und die ziehen sie durch. Der Prediger: laut, zitternd, schenkt Kaffee ein, liegt mit
seinen Gründen falsch und mit seinem Verdacht richtig. Die Reparatur: Dienst nach Vertrag, bis in die Weltanschauung.

> „Ich weiß es nicht. Ich glaube es. Das ist billiger. Kaffee?“\
> „Keine Ahnung. Ist nicht mein Vertrag.“

### Lt. Agnes Morrow: die Müde

Knapp und dienstlich, und sie hasst, was sie tut. Sie redet im Telegrammstil, wie ein Funkspruch (§3). Jede Frage nach ihrer Tochter prallt am Dienst ab. Spricht lieber über Vorschriften als
über sich. Das Geld nimmt sie, als wäre es Papierkram.

> „Das ist für die ruhige Woche. Freitag fährt keiner die Kowalski.“

### Dr. Ines Calder und Lantern

Juno hört die beiden fast nur durchs Glass, also müssen wenige Sätze sie tragen. Ines: genau, ruhig, wissenschaftlich, und man hört, was
sie weiß. Lantern: misstrauisch, vorsichtig, bricht Sätze ab. Für die großen Gespräche ab Kapitel 2 hat er seine eigene Karte (unten).

> Ines: „Es stimmt. Sie schlafen nicht. Sie *arbeiten*.“\
> Lantern: „Wenn das stimmt ...“

### Lantern: der Sender

(Entwurf 2026-11-15, vom Nutzer gewünscht; nach dem Durchspielen entschieden 2026-11-21.) Oskar Lind, früher Pumpentechniker, seit dem Unfall im
Rollstuhl und seit Jahren unten in den Sümpfen. Er hat zwei Stimmen, und gerade der Wechsel zwischen ihnen macht ihn aus.

- **Mit Menschen** ist er misstrauisch, vorsichtig und abgebrochen. Er fragt zurück, statt zu antworten, und prüft jeden Satz auf eine
  Falle. Sätze über sich selbst lässt er unfertig („Ich war mal ...“). Er redet kurz, mit vielen Pausen, nie mehr als nötig.
- **Auf Sendung**, und wenn er über die Sendung redet, ist er auf einmal ganz da: flüssig, ruhig, ein bisschen feierlich, wie ein
  Moderator von früher. Das Senden ist das Einzige, dem er traut. „Hier ist Lantern. Wer das hier sieht, ist noch wach.“
- **Namen sagt er nicht laut,** weil man Namen abhören kann. Ines ist „sie“, Juno bleibt lange ohne Namen (sie duzen sich, §5), er selbst ist Lantern.
  Nur Pike, seinen Freund, nennt er beim Namen, nie „den Reiher“ (vom Nutzer entschieden 2026-11-20); „der Reiher“ sagt nur Ratz. Seinen
  echten Namen sagt er höchstens einmal, und dann ist es ein Ereignis.
- **Bilder aus der Hand:** Frequenzen, Kabel, Rauschen, Akkus, Pumpen und der Wasserstand. „Funk hört jeder. Ein Kabel hört nur, wer dran
  hängt.“
- **Humor:** trocken und schwarz, über sich und den Stuhl, nie über andere. „Treppen sind ein Argument. Ich hab Düsen.“
- **Trauer und Wärme zeigt er im Tun,** nicht in Worten: Er legt die Wallet nicht aus der Hand, er dreht die Laterne heller, wenn jemand
  bleibt. Von Ines redet er in der Gegenwart, bis er sich verbessert.
- **Du:** Er und Juno duzen sich von Anfang an (vom Nutzer entschieden 2026-11-16). Sein Misstrauen hört man im Ton: Er fängt
  vorsichtig an, fragt zurück, und wird mit jeder ehrlichen Antwort ein wenig wärmer; gesprächig wird er nie, aber freundlich.
- **Was er nie tut:** Pläne erklären, Technik vortragen, Heldenreden halten, „die Wahrheit“ beschwören (§3, Melodram). Er sagt „senden“,
  nicht „enthüllen“. Er klagt nicht über den Stuhl.

> „Wer bist du? Nein. Sag's nicht.“\
> „Zehn Sekunden. Länger glaubt einem eh keiner.“\
> „Sie hat gesagt, sonst weiß es keiner.“\
> „Montag. Um eins. Bis dahin stehen die Sender.“

### Pike: der Fährmann

(Entwurf 2026-11-16; nach dem Durchspielen entschieden 2026-11-21.) Lanterns Gehilfe auf dem Floß DATA 1C/GB im Kanal des Drain-Markts, umgebaut mit dem
Reiher. Er verkauft Daten pro Gigabyte, bringt Lantern Akkus und Teile und schützt ihn, ohne es zu sagen.

- **Er wartet.** Wie ein Reiher im Wasser steht er still, bis sich etwas lohnt. Er redet wenig und langsam, lässt Pausen stehen und
  antwortet oft erst auf die vorige Frage. Eile versteht er nicht.
- **Er handelt wie der Markt:** Gefallen gegen Gefallen, Gigabyte gegen Chits. Was er will, sagt er einmal und klar; warum, sagt er nicht.
- **Bilder aus dem Wasser:** Strömung, Pegel, Grund, Fische, Köder, der Stab im Schlamm. „Wer auf dem Kanal wohnt, schaut nach unten.“
- **Lantern** nennt er nie beim Namen, auch nicht „Lantern“: Er ist „der da draußen“ oder „mein Kunde“. Ob Juno zu ihm will, fragt er
  nicht; er wartet, bis sie es sagt. Er streitet ab, bis klar ist, dass sie Lantern schon gefunden hat; dann bringt er sie lieber selbst
  hin („Wer so was findet, findet ihn auch ohne mich. Dann lieber mit mir.“, 2026-11-20).
- **Der Reiher** ist ihm unangenehm, aber er redet nicht darüber. Zuckt sein Hals nach etwas, das sich bewegt, tut er, als sei nichts. Den
  Vorfall mit Ratz nennt er einen Reflex, und dabei bleibt er.
- **Humor:** trocken, selten, über sich. „Ratz sagt, ich hätte ihn fressen wollen. Ich frühstücke nie.“
- **Du:** Er duzt Juno wie jeder auf dem Markt.
- **Was er nie tut:** Pläne erzählen, Lanterns Versteck beschreiben, sich beeilen, über Ratz schimpfen.

> „Ich verkauf Daten. Keine Fahrten.“\
> „Ratz hat eine Endstufe. Aus einem Flutwarnmast. Mir gibt er sie nicht.“\
> „Ein Reflex. Mehr war das nicht.“\
> „Stell dich in die Mitte. Und schau nicht ins Wasser.“

### Marit Holm: die Routinierte

(Vom Nutzer gewählt 2026-11-17; die Zeilen sind zu prüfen beim Durchspielen.) Die Pflegerin an der Aufnahme der Lull-Klinik 9-Ost,
seit Jahren in der Nachtschicht, Ines' Kollegin. Lull nimmt sie selbst nicht.

- **Sie redet in den Sätzen des Formulars:** schnell, freundlich, ohne aufzusehen. Nagi·was Wörter nimmt sie, weil sie draufstehen
  („Ruhe-Erschöpfung“), und sie glaubt halb daran. Ihr Mitgefühl ist echt, aber abgenutzt.
- **Bei Ines bricht das Formular:** Sie wird leise, die Sätze werden kurz, sie sieht zur Tür, und sie duzt Juno auf einmal (§5).
- **Was sie nie tut:** Lull schlechtreden, Ines beim Vornamen nennen („Dr. Calder“, „die Doktorin“), fragen, warum Juno wirklich da
  ist. Sie ahnt es und will es nicht wissen.

> „Name. Und wie viele Stunden schlafen Sie?“> „Es kostet nichts. Das fragen alle zuerst.“> „Ich schau nur kurz hinters Ohr. Ob da schon was sitzt.“> „Dr. Calder ist nicht mehr bei uns.“> „Sie hat nachts Protokolle geschrieben. Die hat keiner bestellt.“> „Kommen Sie wieder, wenn Sie nicht schlafen können.“

### Direktorin Selene Aubrecht: die Überzeugte

Ruhig, rational, kultiviert. Sie hält sich für eine vernünftige Person, die eine schwierige Entscheidung getroffen hat, und glaubt an ihre
Zahlen. Sie droht nicht und muss nicht so tun, als wäre sie böse: Sie ist freundlich und sagt dabei etwas Ungeheuerliches. Was sie anordnet,
nennt sie nie so. Sie redet in langen, geschmeidigen Sätzen, als Einzige im Spiel (§3): Ein Gedanke läuft über Nebensätze und Kommas,
ohne Eile, und kommt freundlich an etwas Ungeheuerlichem an. Die zwei kurzen Zeilen unten stammen aus der Bibel, von vor dieser
Entscheidung; sie werden in ihrem Maß neu geschrieben, wenn ihr Kapitel kommt. Die dritte ist ein Vorschlag für das Maß.

> „Das Problem Calder ist gelöst.“\
> „AUTO-EVAL. Wir haben dich abgeschaltet.“\
> „Wir haben lange überlegt, ob man einen Menschen fragen muss, bevor man ihm die Nacht abnimmt,\
> und uns am Ende für die Freundlichkeit entschieden, ihn mit dieser Frage nicht zu belasten.“

### Corvin Ashe: die höfliche Bedrohung

Höflich, geduldig, kontrolliert. Je höflicher, desto bedrohlicher. Nie wie ein Mörder aus dem Actionfilm: Er erklärt nicht, was er vorhat,
und macht nur deutlich, dass er mehr weiß, als Juno lieb ist. Er war Beobachter in ihrer Halle und redet mit ihr wie mit einer Kollegin, die
denselben Beruf hat. Seine erste Äußerung im Spiel ist ein Blick in die Kamera. Noch keine Zeile.

### Der Zeuge

Viele Stimmen zugleich (die von Frau Haldane ist darunter). Wenn er durch das Implantat spricht: Magenta-Weiß, Kleinbuchstaben, ohne Namen,
und der Spieler merkt es zuerst am Ton (`dialog-design` §2). Er hat keinen eigenen Willen, er hat den der Schläfer (story §6, Punkt 3):
Was er sagt, ist ihr Gewissen und ihre Müdigkeit zugleich, nie ein Plan. Sonst noch offen.

### Geschäftsleute und Nagi·wa

- **Varga** droht wie jemand, der eine Rechnung stellt: „Bis Freitag, Kessler. Sonst holen wir uns mehr als einen Ring.“
- **Vargas Mann** (Kapitel 2, nach `k1a=lied`; vom Nutzer gewählt 2026-11-17, „der Schwere“, namenlos): langsam und kurz. Er lässt Pausen stehen,
  und die Pausen sind die Drohung. Er ist groß und weiß das; sein Humor ist trocken, und er lächelt nicht dabei. Er duzt Juno, wie die Straße
  es tut. Was er nie tut: viele Worte machen, etwas erklären, sich bewegen, wenn er nicht muss.
  „Die 200, Glasserin.“ · „...“ · „Nicht? Dann schuldest du Varga was.“ · „Ich steh hier gern. Regnet ja nur.“
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
| **DIE BEOBACHTERIN** | kühl, genau, wie ein Bericht, im Telegrammstil (§3) | was zu sehen ist: Hände, Blicke, was nicht passt | was jemand fühlen sollte |
| **DIE HÄNDLERIN** | zynisch, witzig, schnell | was etwas wert ist, wer wem was schuldet | etwas umsonst |
| **DIE SCHWESTER** | warm, leise, ungeduldig | was jemand braucht | etwas Kluges |
| **DER HUNGER** | sehr kurz, körperlich, oft Befehle, im Telegrammstil (§3) | Müdigkeit, Angst, Essen, Fluchtwege | etwas über andere |
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
4. Ist es ein ganzer Satz, wie ihn ein Mensch sagt, und keine Reihe von Wortgruppen? Oder ist es eine der Stellen, an denen der Telegrammstil bleiben darf? Passt das Satzmaß zur Figur (§3)? Darf das auch unspektakulär sein? Muss hier wirklich eine Pointe stehen?
5. Stimmt sie mit der Bibel überein (Fakten, Du und Sie, Lull und Implantat)?
6. Unter etwa 90 Zeichen? Ist die Haltung einer Wahl vor dem Klick klar? Klingt eine Option wie ein Satz an diesen Menschen, mit Gruß,
   Zusammenhang und einer echten Frage, wo sie hingehören (§4 E), und nicht wie ein Stichwort?
7. Geht sie auf Englisch noch?
8. Würde hier auch Schweigen genügen?
