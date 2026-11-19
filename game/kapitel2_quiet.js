// Nagiwa: Chapter 2, the Quiet comes closer (docs/kapitel2-design.md §4, §3.5 "Der Schatten", §3.6). Nothing here is a flag of its own:
// what it shows reads e1, e2 and the day (Nagiwa.quietKnown, game/kapitel2.js), the cameras go overnight, and the one thing that counts,
// leading the Quiet to Lantern (led_quiet), is set on the raft (game/kapitel2_lantern.js).
//   the shadow       once the Quiet knows Juno, one of its men stands at the front of Kowalski Street from 19:00 to 23:00, his back to us,
//                    staring at her house door; on Monday the leader and two of his men (the user's choice, 2026-11-17: the Quiet grows)
//   the dryer        once the whole clip has told Nagi·wa where the key lay (quiet_dryer), one of them stands in the laundromat before
//                    dryer 6, there and in CAM 23 (the laundromat's own picture)
//   the cameras      Nagi·wa's cameras near her block go one by one, the way she would do it: CAM 07 from evening 2, CAM 14, her own
//                    landing, from evening 3, and on the landing the camera's red eye is out
// Their white glows: the figures (art/characters/quiet.px.js) take none of the room's light (the user's choice, 2026-11-17). The leader
// is nameless, not Ashe.
"use strict";

(function () {
const AW = Nagiwa.at.kowalski, AL = Nagiwa.at.laundromat;
const KNOWN = Nagiwa.quietKnown, OUT = Nagiwa.quietOut;

// ---- the figures: the leader (way A of the blocks) and his men (way B); one of the men is three actors, since they stand at once
const MAN = { idle: { se: "quiet_b_idle_se", ne: "quiet_b_idle_ne" }, walk: { se: "quiet_b_walk_se", ne: "quiet_b_walk_ne" } }, LEADER = { idle: { se: "quiet_a_idle_se", ne: "quiet_a_idle_ne" } };
const STREET_LOOK = ["Einer in Weiß. Er schaut auf unsere Haustür.", "Weiß hält hier unten keinen Tag. Hat die Regenleserin gesagt."];
const STREET_TALK = ["Zu dem geh ich nicht rüber. Darauf wartet er doch."];
/** @param {string} id @param {any} costume @param {any} look */
const quiet = (id, costume, look) => Cutaway.actor(id, { name: "In Weiß", color: "#f0f0f0", lit: false, costume, look, talk: STREET_TALK });
quiet("quiet_schatten", MAN, STREET_LOOK);
quiet("quiet_schatten2", MAN, ["Noch einer in Weiß. Die Maske ist glatt, nur über den Augen ein roter Strich."]);
quiet("quiet_chef", LEADER, ["Der in der Mitte hat einen langen Mantel. Und Schlitze in der Maske.", "Wie der in der Metro. Aber der hier steht anders."]);
// the shadow from 19:00 to 23:00, the evenings the Quiet knows her: one; on Monday three
Cutaway.routine("quiet_schatten", [
  // while Bao's cart is gone (game/kapitel2_folgen.js) the corner is empty, and he walks it slowly up and down (only the look: no state)
  { day: [5, 6], from: "19:00", to: "23:00", if: [KNOWN, "k1b=sold"], room: "kowalski", at: AW.quietWalk[0], path: AW.quietWalk },
  { day: [5, 6], from: "19:00", to: "23:00", if: KNOWN, room: "kowalski", at: AW.quiet, face: "ne" },
  { day: 7, from: "19:00", to: "23:00", room: "kowalski", at: AW.quietLeft, face: "ne" },
]);
Cutaway.routine("quiet_chef", [{ day: 7, from: "19:00", to: "23:00", room: "kowalski", at: AW.quiet, face: "ne" }]);
// while one of them stands on Kowalski Street, the ground round him is shut (the user, 2026-11-19: Juno doesn't get near him): a hole in
// the street's walk map, put in and taken out as they come and go (the door to LUCKY STATIC, the way west and Bao stay open). Only a
// look of the walk map: no state, and nothing the game needs lies inside it
{
  const street = Cutaway.room.get("kowalski"), own = (street.holes ?? []).slice(), WHO = ["quiet_schatten", "quiet_schatten2", "quiet_chef"];
  const fence = () => {
    // where their routines put them now (not where the actors are yet: entering the street comes before the routines place them)
    const { day, minutes } = Cutaway.time.now, P = Cutaway.time.parse;
    const here = WHO.some((id) => (Cutaway.time.routines.get(id) ?? []).some((e) => (e.day === undefined || (Array.isArray(e.day) ? e.day.includes(day) : e.day === day))
      && P(e.from) <= minutes && minutes < P(e.to) && e.room === "kowalski" && Cutaway.state.test(e.if)));
    const want = here ? [...own, AW.quietFence] : own;
    if ((street.holes ?? []).length === want.length) return;
    street.holes = want;
    if (Cutaway.scene.room?.id === "kowalski") Cutaway.scene.refresh();
  };
  Cutaway.events.on("room.entered", (/** @type {{id: string}} */ e) => { if (e.id === "kowalski") { street.holes = []; fence(); Cutaway.scene.refresh(); } });
  Cutaway.events.on("time.changed", fence);
}
Cutaway.routine("quiet_schatten2", [{ day: 7, from: "19:00", to: "23:00", room: "kowalski", at: AW.quietRight, face: "ne" }]);

// on the way into the alley while he stands there, EVI from the bag (only a line: the flag is set on the raft)
const alley = Cutaway.room.get("kowalski").hotspots.alley;
alley.use = [{ if: OUT, then: [{ evi: "besorgt" }, { say: "evi", text: "Der in Weiß schaut uns nach." }] }, ...[].concat(alley.use)];

// ---- the man at the dryer (quiet_dryer): in the laundromat itself, and in CAM 23 the same figure under the feed's filter
quiet("quiet_waschsalon", MAN, ["Ein weißer Regenmantel im Waschsalon, und keine Wäsche.", "Er steht da, wo man die Sechs sieht. Die wissen es."]);
Cutaway.routine("quiet_waschsalon", [{ day: [6, 7], from: "18:00", to: "01:00", if: "quiet_dryer", room: "laundromat", at: AL.quiet, face: "ne" }]);

// ---- the cameras that go (kapitel2-design §4, §13.3): GLASS shows them grey with KEIN SIGNAL, the strip too; the links are forgotten
// overnight, so whether she had linked them no longer matters
Object.assign(/** @type {any} */ (Nagiwa.cams.cam07), { dead: "day>5", deadLine: ["Kein Signal.", "Von außen nach innen. So hätt ich's auch gemacht."] });
// (CAM 14 is on the map only once she has glassed her own landing; gone, it is there for everyone: she knows the camera over her stairs)
Object.assign(/** @type {any} */ (Nagiwa.cams.cam14), { dead: "day>6", deadLine: ["Kein Signal. Mein eigener Flur.", "Jetzt sind sie im Haus."],
  if: { or: [Nagiwa.cams.cam14.if ?? "link_cam14", "day>6"] } });
(Nagiwa.nights[6].passes ??= []).push({ unset: "link_cam07" });
(Nagiwa.nights[7].passes ??= []).push({ unset: "link_cam14" });
// on the landing the camera's red eye is out from evening 3 (its dark twin from the same map: art/rooms/kessel_14.map.js)
for (const p of /** @type {any[]} */ (Cutaway.room.get("kessel_14").props)) {
  if (p.id === "corner_cam") p.if = "day<7";
  if (p.id === "corner_cam_dark") p.if = "day>6";
}
const cam = Cutaway.room.get("kessel_14").hotspots.corner_cam;
cam.look = [{ if: "day>6", then: ["Das rote Licht ist aus. Die Kamera hängt noch da, aber sie schaut nicht mehr.", "Oder sie schaut, und keiner soll es merken."], else: [].concat(cam.look) }];
})();
