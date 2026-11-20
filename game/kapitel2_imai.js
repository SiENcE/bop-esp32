// Nagiwa: Chapter 2's thread of Frau Imai, her second part (kapitel2-design §6.1). Only if Juno answered her in Chapter 1 (imai_told);
// else it stays shut and she sits over her cold tea. On Saturday she writes again: she has seen something else, a woman on a platform.
// At her table in LUCKY STATIC on Saturday and Sunday she tells it: water to the platform's edge, a woman in white, a man in white out of
// the shadow, who looked up, at her. That is Ines' death in CAM 31, which hangs on no net Civic Rest could play to the sleepers: the
// Witness shows it to them, every night at three (story §10h). The choice again: the truth, or a dream.
//   imai2   truth | dream   what Juno told her this time (the Kassenbuch's line, ledger_imai2)
// A thread of its own (off_imai), checked alone with the others shut; it begins and ends in this chapter.
"use strict";

(function () {
  const I = (/** @type {string} */ text) => ({ say: "imai", text });
  Nagiwa.ledger.imai2 = { to: "R. IMAI", what: { truth: "der Bahnsteig, die Wahrheit", dream: "der Bahnsteig, ein Traum" } };

  // ---- the CHAT (I1): Chapter 1's contact goes on, with what she writes on Saturday
  const contact = Nagiwa.contacts.imai, firstOpen = contact.open;
  contact.if = [{ or: [["day>1", "day<5"], ["day>4", "imai_told"]] }, "!off_imai"];
  contact.unread = { or: [["day<5", "!read_imai"], ["day>4", "!read_imai2"]] };
  contact.open = [{ if: "day<5", then: firstOpen,
    else: [{ if: "!read_imai2", then: [{ set: "read_imai2" }, "Eine Frau auf einem Bahnsteig. Das klingt nach der alten Metro."] }] }];
  Cutaway.state.view("read_imai2");
  Nagiwa.threads.imai.push(
    { from: "imai", if: "day>4", at: "18:20", text: "Ich habe wieder etwas gesehen. Eine Frau auf einem Bahnsteig." },
    { from: "imai", if: "day>4", at: "18:21", text: "Ich sitze heute Abend wieder im LUCKY STATIC. Kommen Sie bitte." });

  // ---- at her table (I2, I3): what she saw, then the choice; it ends in it, so the telling is never heard twice
  const TELL = [
    I("Sie sind gekommen. Danke."),
    I("Ich habe wieder etwas gesehen. Da war Wasser, bis an die Kante von einem Bahnsteig."),
    I("Eine Frau in Weiß stand am Wasser. Und ein Mann, auch in Weiß, kam aus dem Schatten."),
    I("Er hat hochgeschaut. Zu mir."),
    { if: "imai_told=truth", then: [I("Ich wollte nicht schlafen. Ich habe nur kurz die Augen zugemacht.")],
      else: [I("Sie haben gesagt, das letzte Mal war ein Traum. Dann war das hier auch einer, oder?")] },
    I("Ich habe es um drei gesehen, im Schlaf. Und dann wieder, jede Nacht."),
    "Das ist die alte Metro. Das ist Ines.",
    "CAM 31 hängt an keinem Netz. Das hat keiner gesehen außer mir.",
    { dialog: "imai2_wahl" },
  ];
  Cutaway.dialog("imai2_wahl", { main: { choices: [
    { text: "„Ich hab es auch gesehen. Es ist wirklich passiert.“", goto: "end", then: [{ set: "imai2", value: "truth" }, { ledger: "imai2", value: "truth" },
      I("Dann ist sie tot. Die Frau am Wasser."), "Ja.", I("Und wer zeigt mir das? Jede Nacht um drei?"), "Das will ich auch wissen."] },
    { text: "„Das war nur ein Traum, Frau Imai.“", goto: "end", then: [{ set: "imai2", value: "dream" }, { ledger: "imai2", value: "dream" },
      { if: "imai_told=dream", then: [I("Wieder ein Traum. Gut.")], else: [I("Letztes Mal haben Sie gesagt, es ist wirklich passiert."), "Diesmal war es ein Traum."] },
      I("Ich hole mir Tropfen. Damit träumt man gar nicht mehr."), "Schlafen Sie gut, Frau Imai."] },
  ] } });

  const imai = /** @type {any} */ (Cutaway.actors.get("imai")).def, chapter1 = imai.talk;
  imai.talk = [{ if: "day<5", then: chapter1, else: [
    { if: ["imai_told", "!off_imai"], then: [
      { if: "imai2=truth", then: [I("Ich bleibe wach, solange es geht. Mei macht mir Kaffee.")],
        else: [{ if: "imai2=dream", then: [I("Die Tropfen helfen. Ich sehe gar nichts mehr."), "Sie lächelt dabei."],
          // on Monday she has fallen asleep over her tea, and the thread ends without an answer
          else: [{ if: "day<7", then: TELL, else: ["Sie ist am Tisch eingeschlafen. Hinter ihrem Ohr leuchtet der blasse Punkt."] }] }] }],
      else: ["Sie schaut in ihren kalten Tee. Mich sieht sie heute nicht."] }] }];
})();
