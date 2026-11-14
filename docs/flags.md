# Flags (erzeugt)

Erzeugt von `node tools/doc-lint.mjs --flags` aus den Daten des Spiels; nie von Hand ändern. Jedes Flag mit seinen Werten,
wo es gesetzt und wo es abgefragt wird (die ersten drei Stellen) und welcher Akt es übernimmt (`keep`). Die Bedeutung steht im
Kopf der Datei, die es setzt (`game/nagiwa.js` nennt die Muster).

| Flag | Werte | gesetzt | abgefragt | übernommen von |
|---|---|---|---|---|
| `anon_clip_kessler_ring` | `true` | `room deck.hotspots.clip_anon_clip_kessler_ring.use.1` | `room deck.hotspots.reply_vesper_ring.if`, `room deck.hotspots.clip_anon_clip_kessler_ring.if` |  |
| `anon_clip_morrow_bribe` | `true` | `room deck.hotspots.clip_anon_clip_morrow_bribe.use.1` | `room deck.hotspots.reply_vesper_morrow.if`, `room deck.hotspots.clip_anon_clip_morrow_bribe.if` |  |
| `anon_clip_traeger` | `true` | `room deck.hotspots.clip_anon_clip_traeger.use.1` | `room deck.hotspots.reply_vesper_traeger.if`, `room deck.hotspots.clip_anon_clip_traeger.if` |  |
| `ashe_lit` | `true` | `moment ines_death.play.2` | `actor ashe.poses.1.if` |  |
| `bao_paid` | `true` | `dialog bao.main.1.then.1` | `room kowalski.hotspots.bao.talk.0.then.0.then.0`, `room kowalski.hotspots.cart.use.0.then.0.then.0` | kapitel1 |
| `bao_soup` | `true` | `dialog bao.main.0.then.9`, `dialog bao.main.1.then.13`, `act kapitel1.start.24` | `room kowalski.hotspots.bao.talk.0.else.0`, `room kowalski.hotspots.bao.talk.0.else.0.then.1`, `room kowalski.hotspots.cart.use.0.else.0`, … (5) |  |
| `bed_closed` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.4`, `room flat.enter.2.then.1` | `room flat.hotspots.bed.use.0.then.0` |  |
| `cache_clip_ines_death` | `true` | `moment ines_death.play.12` | `room deck.hotspots.cache_clip_ines_death.if` |  |
| `cache_clip_kessler_cut` |  | `room deck.hotspots.clip_cut_clip_kessler_ring.use.1` | `room deck.hotspots.reply_kessler_cut.if`, `room deck.hotspots.cache_clip_kessler_cut.if`, `room deck.hotspots.clip_cut_clip_kessler_ring.if` | kapitel1 |
| `cache_clip_kessler_ring` |  | `room cam04.hotspots.rewind.use.3`, `act kapitel1.start.5.then.4`, `moment kessler_ring.play.9.then.0` | `room cam04.hotspots.rewind.if`, `room deck.hotspots.reply_kessler_full.if`, `room deck.hotspots.reply_kessler_nothing.if`, … (5) | kapitel1 |
| `cache_clip_morrow_bribe` |  | `dialog morrow_bribe.main.0.then.3` | `room deck.hotspots.reply_vesper_morrow.if`, `room deck.hotspots.cache_clip_morrow_bribe.if`, `dialog morrow_bribe.main.0.if` |  |
| `cache_clip_traeger` |  | `dialog traeger_wahl.main.1.then.1` | `room deck.hotspots.reply_vesper_traeger.if`, `room deck.hotspots.cache_clip_traeger.if` |  |
| `cache_note_haldane_marks` |  | `room kessel_14.hotspots.haldane.talk.0.else.0.then.0.then.8`, `room kessel_14.hotspots.haldane.use.0.then.8` | `room deck.hotspots.cache_note_haldane_marks.if` |  |
| `cache_note_imai_street` |  | `room cam18.hotspots.rewind.use.7` | `room deck.hotspots.cache_note_imai_street.if` |  |
| `cache_note_kessler_debt` |  | `room cam04.hotspots.rewind.use.6`, `act kapitel1.start.5.then.5`, `moment kessler_ring.play.11` | `room deck.hotspots.reply_sable_sold.if`, `room deck.hotspots.cache_note_kessler_debt.if`, `dialog sable.code.1.if` | kapitel1 |
| `cache_note_kessler_hideout` |  | `room cam15.hotspots.rewind.use.3`, `actor kessler2.talk.0.then.0.else.2` | `room cam15.hotspots.kapsel23.if`, `room cam15.hotspots.rewind.if`, `room deck.hotspots.reply_varga_sold.if`, … (5) |  |
| `cache_note_kessler_photo` |  | `act prolog.start.6`, `act kapitel1.start.8` | `room deck.hotspots.cache_note_kessler_photo.if` |  |
| `cache_note_obs_handbook` |  | `act kapitel1.start.9` | `room deck.hotspots.cache_note_obs_handbook.if` |  |
| `cache_note_safe_code` |  | `room cam07v.hotspots.rewind.use.6`, `actor okonkwo_safe.talk.0.else.0.else.5` | `room cam07v.hotspots.rewind.if`, `room deck.hotspots.reply_tide_sold.if`, `room deck.hotspots.reply_tide_lied.if`, … (5) |  |
| `call_missed` | `true` | `moment kessler_call.unseen.0.then.0` | `room cam03.hotspots.rewind.if`, `hints.25.if`, `hints.26.if`, … (4) |  |
| `chits` |  | `room deck.hotspots.reply_kessler_full.use.2`, `room deck.hotspots.reply_kessler_cut.use.2`, `room deck.hotspots.reply_kessler_nothing.use.2`, … (5) | `room deck.hotspots.reply_wren_back.if`, `dialog bao.main.1.if`, `dialog sable.code.0.if`, … (5) | kapitel1 |
| `code_cam03` | `true` | `act prolog.start.4`, `act kapitel1.start.6` | `room cam04.hotspots.thumb_cam03.if`, `room cam21.hotspots.thumb_cam03.if`, `room cam22.hotspots.thumb_cam03.if`, … (5) |  |
| `code_cam04` | `true` | `room cam03.hotspots.mast.use.4` | `room cam03.hotspots.thumb_cam04.if`, `room cam21.hotspots.thumb_cam04.if`, `room cam22.hotspots.thumb_cam04.if`, … (5) |  |
| `code_cam07` | `true` | `act kapitel1.start.16` | `room cam03.hotspots.thumb_cam07.if`, `room cam04.hotspots.thumb_cam07.if`, `room cam21.hotspots.thumb_cam07.if`, … (5) |  |
| `code_cam07v` | `true` | `room jade_row.hotspots.machine.with.abzweiger.0.then.9` | `room cam03.hotspots.thumb_cam07v.if`, `room cam04.hotspots.thumb_cam07v.if`, `room cam21.hotspots.thumb_cam07v.if`, … (5) |  |
| `code_cam14` | `true` | `dialog zeitung_cam.main.0.then.0` | `room cam03.hotspots.thumb_cam14.if`, `room cam04.hotspots.thumb_cam14.if`, `room cam21.hotspots.thumb_cam14.if`, … (5) |  |
| `code_cam15` | `true` | `dialog sable.code.0.then.1`, `dialog sable.code.1.then.1` | `room cam03.hotspots.thumb_cam15.if`, `room cam04.hotspots.thumb_cam15.if`, `room cam21.hotspots.thumb_cam15.if`, … (5) |  |
| `code_cam18` | `true` | `act kapitel1.start.14` | `room cam03.hotspots.thumb_cam18.if`, `room cam04.hotspots.thumb_cam18.if`, `room cam21.hotspots.thumb_cam18.if`, … (5) |  |
| `code_cam21` | `true` | `act kapitel1.start.10` | `room cam03.hotspots.thumb_cam21.if`, `room cam04.hotspots.thumb_cam21.if`, `room cam22.hotspots.thumb_cam21.if`, … (5) |  |
| `code_cam22` | `true` | `room cam21.hotspots.menu.use.0.else.1` | `room cam03.hotspots.thumb_cam22.if`, `room cam04.hotspots.thumb_cam22.if`, `room cam21.hotspots.thumb_cam22.if`, … (5) |  |
| `code_cam23` | `true` | `room deck.hotspots.cam_cam23.use.0.else.0.else.1` | `room cam03.hotspots.thumb_cam23.if`, `room cam04.hotspots.thumb_cam23.if`, `room cam21.hotspots.thumb_cam23.if`, … (5) |  |
| `code_cam24` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2` | `room cam03.hotspots.thumb_cam24.if`, `room cam04.hotspots.thumb_cam24.if`, `room cam21.hotspots.thumb_cam24.if`, … (5) |  |
| `code_cam30` | `true` | `act kapitel1.start.12` | `room cam03.hotspots.thumb_cam30.if`, `room cam04.hotspots.thumb_cam30.if`, `room cam21.hotspots.thumb_cam30.if`, … (5) |  |
| `code_cam31` | `true` | `dialog cam31_takt.vier_ok.0.then.3` | `room cam03.hotspots.thumb_cam31.if`, `room cam04.hotspots.thumb_cam31.if`, `room cam21.hotspots.thumb_cam31.if`, … (5) |  |
| `deck_app` | `buch`, `cache`, `chat`, `chat_imai`, `chat_kessler`, `chat_nagiwa`, `chat_sable`, `chat_teo`, … (22) | `room flat.enter.0`, `room deck.hotspots.app_glas.use.0`, `room deck.hotspots.app_chat.use.0`, … (5) | `room deck.hotspots.win_close.if`, `room deck.hotspots.cam_cam03.if`, `room deck.hotspots.cam_cam04.if`, … (5) |  |
| `e1` | `refused`, `sold` | `room deck.hotspots.reply_wren_send.use.1`, `room deck.hotspots.reply_wren_refuse.use.1`, `moment wren_deadline.unseen.0.then.0` | `room deck.hotspots.reply_wren_back.if`, `room deck.hotspots.reply_wren_send.if`, `room deck.hotspots.reply_wren_refuse.if`, … (5) |  |
| `end_beat` | `after`, `kill`, `look`, `threat`, `unknown` | `moment ines_meeting.play.25`, `moment ines_meeting.play.29`, `moment ines_death.play.0`, … (5) | `room cam31.hotspots.wait.use.0`, `room cam31.hotspots.back.if`, `room cam31.hotspots.try_steuern.if`, … (5) |  |
| `evening_shown` | `2` | `room flat.enter.2.then.0` | `room flat.enter.2` |  |
| `evi_trust` |  | `dialog evi_cut.main.0.then.0`, `dialog evi_cut.main.1.then.0` |  | kapitel1 |
| `fridge_empty` | `true` | `room flat.hotspots.fridge.use.0`, `act kapitel1.start.21` | `room flat.hotspots.door.use.0.else.0`, `hints.33.if`, `hints.34.if`, … (4) |  |
| `got_ausweis` | `true` | `room flat.hotspots.box_old.use.0.then.3` | `room flat.hotspots.box_old.look.1`, `room flat.hotspots.box_old.use.0`, `act kapitel1.start.2` | kapitel1 |
| `got_haken` | `true` | `room kessel_14.hotspots.haken.use.4` | `room kessel_14.hotspots.haken.if`, `room kessel_14.enter.0`, `room cam14.props.haken.if`, … (4) | kapitel1 |
| `got_tap` | `true` | `dialog motte_lektion.main.1.then.3.then.4`, `dialog ratz.main.0.0.0.then.2` | `dialog motte_lektion.main.1.then.3`, `dialog ratz.main.0.0.if`, `dialog ratz.main.0.0.0.if`, … (5) |  |
| `heard_yuens` | `true` | `room cam03.hotspots.rewind.use.6`, `moment kessler_call.play.4` | `room cam03.hotspots.rewind.if`, `room cam03.hotspots.thumb_cam04.if`, `room cam21.hotspots.thumb_cam04.if`, … (5) |  |
| `imai_step` | `0`, `1`, `2`, `3` | `room cam18.hotspots.rewind.use.8`, `actor imai.talk.0.then.11`, `dialog imai_wahl.main.0.then.0`, … (5) | `room cam03.hotspots.thumb_cam18.if`, `room cam04.hotspots.thumb_cam18.if`, `room cam21.hotspots.thumb_cam18.if`, … (5) |  |
| `imai_told` | `dream`, `truth` | `dialog imai_wahl.main.0.then.1`, `dialog imai_wahl.main.1.then.1` | `actor imai.talk.3`, `actor imai.talk.4` |  |
| `ines_down` | `true` | `moment ines_death.play.11.then.3`, `moment ines_death.play.11.else.4` | `room cam31.hotspots.rec.if`, `actor ines.poses.2.if` |  |
| `ines_gives` | `true` | `moment ines_meeting.play.10`, `moment ines_meeting.play.12` | `actor ines.poses.3.if` |  |
| `k1a` | `lied`, `sold`, `warned` | `room deck.hotspots.reply_varga_sold.use.1`, `room deck.hotspots.reply_varga_lied.use.1`, `dialog k1a_warn.main.0.then.0` | `room cam15.hotspots.kapsel23.look.0.then.0`, `room cam15.hotspots.kapsel23.use.0`, `room deck.hotspots.reply_varga_sold.if`, … (5) |  |
| `k1b` | `lied`, `sold`, `warned` | `room deck.hotspots.reply_tide_sold.use.1`, `room deck.hotspots.reply_tide_lied.use.1`, `dialog okonkwo.main.2.then.0` | `room cam07v.hotspots.rewind.if`, `room okonkwo_shop.hotspots.counter.look.0`, `room deck.hotspots.reply_tide_sold.if`, … (5) |  |
| `kessler_gone` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `dialog k1a_warn.main.0.then.2` | `room cam15.hotspots.kapsel23.look.0`, `room cam15.hotspots.rewind.if`, `routine kessler2.0.if`, … (4) |  |
| `know_ines` | `true` | `act kapitel1.start.18` |  |  |
| `know_meeting` | `true` | `moment ines_tide.play.6`, `moment ines_sign.play.1` | `room cam03.hotspots.thumb_cam31.if`, `room cam04.hotspots.thumb_cam31.if`, `room cam21.hotspots.thumb_cam31.if`, … (5) |  |
| `ladder_down` | `true` | `room sims.hotspots.ladder.with.haken.0.else.3` | `room sims.props.ladder.if`, `room sims.hotspots.ladder.look.0`, `room sims.hotspots.ladder.use.0`, … (5) |  |
| `ledger_imai` |  | `dialog imai_wahl.main.0.then.2`, `dialog imai_wahl.main.1.then.2` |  |  |
| `ledger_ines` |  | `moment ines_death.play.22.then.1` |  |  |
| `ledger_kessler` |  | `room deck.hotspots.reply_kessler_full.use.2`, `room deck.hotspots.reply_kessler_cut.use.2`, `room deck.hotspots.reply_kessler_nothing.use.2`, … (4) |  | kapitel1 |
| `ledger_kessler_warn` |  | `dialog k1a_warn.main.0.then.1` |  |  |
| `ledger_okonkwo` |  | `dialog okonkwo.main.2.then.1` |  |  |
| `ledger_sable_kessler` |  | `room deck.hotspots.reply_sable_sold.use.1`, `dialog sable.code.1.then.0` | `room deck.hotspots.reply_sable_sold.if`, `dialog sable.code.1.if` | kapitel1 |
| `ledger_tide` |  | `room deck.hotspots.reply_tide_sold.use.2`, `room deck.hotspots.reply_tide_lied.use.2` |  |  |
| `ledger_varga` |  | `room deck.hotspots.reply_varga_sold.use.2`, `room deck.hotspots.reply_varga_lied.use.2` |  |  |
| `ledger_vesper_morrow` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `room deck.hotspots.reply_vesper_morrow.use.1` | `room deck.hotspots.reply_vesper_morrow.if` |  |
| `ledger_vesper_ring` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `room deck.hotspots.reply_vesper_ring.use.1` | `room deck.hotspots.reply_vesper_ring.if` |  |
| `ledger_vesper_traeger` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `room deck.hotspots.reply_vesper_traeger.use.1` | `room deck.hotspots.reply_vesper_traeger.if` |  |
| `ledger_wren` |  | `room deck.hotspots.reply_wren_send.use.2.then.0`, `room deck.hotspots.reply_wren_send.use.2.else.0`, `room deck.hotspots.reply_wren_refuse.use.2`, … (4) |  |  |
| `ledger_wren_advance` |  | `room deck.hotspots.reply_wren_back.use.2`, `act kapitel1.start.26` | `room deck.hotspots.reply_wren_back.if`, `room deck.hotspots.reply_wren_send.use.2` |  |
| `ledger_wren_live` |  | `moment ines_death.play.22.then.0` |  |  |
| `link_cam03` | `true` | `room cam04.hotspots.thumb_cam03.use.0.else.0`, `room cam21.hotspots.thumb_cam03.use.0.else.0`, `room cam22.hotspots.thumb_cam03.use.0.else.0`, … (5) | `room cam04.hotspots.thumb_cam03.if`, `room cam04.hotspots.thumb_cam03.use.0`, `room cam21.hotspots.thumb_cam03.if`, … (5) |  |
| `link_cam04` | `true` | `room cam03.hotspots.thumb_cam04.use.0.else.0`, `room cam21.hotspots.thumb_cam04.use.0.else.0`, `room cam22.hotspots.thumb_cam04.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam04.if`, `room cam03.hotspots.thumb_cam04.use.0`, `room cam21.hotspots.thumb_cam04.if`, … (5) |  |
| `link_cam07` | `true` | `room cam03.hotspots.thumb_cam07.use.0.else.0`, `room cam04.hotspots.thumb_cam07.use.0.else.0`, `room cam21.hotspots.thumb_cam07.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam07.if`, `room cam03.hotspots.thumb_cam07.use.0`, `room cam04.hotspots.thumb_cam07.if`, … (5) |  |
| `link_cam07v` | `true` | `room cam03.hotspots.thumb_cam07v.use.0.else.0`, `room cam04.hotspots.thumb_cam07v.use.0.else.0`, `room cam21.hotspots.thumb_cam07v.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam07v.if`, `room cam03.hotspots.thumb_cam07v.use.0`, `room cam04.hotspots.thumb_cam07v.if`, … (5) |  |
| `link_cam14` | `true` | `room cam03.hotspots.thumb_cam14.use.0.else.0`, `room cam04.hotspots.thumb_cam14.use.0.else.0`, `room cam21.hotspots.thumb_cam14.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam14.if`, `room cam03.hotspots.thumb_cam14.use.0`, `room cam04.hotspots.thumb_cam14.if`, … (5) |  |
| `link_cam15` | `true` | `room cam03.hotspots.thumb_cam15.use.0.else.0`, `room cam04.hotspots.thumb_cam15.use.0.else.0`, `room cam21.hotspots.thumb_cam15.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam15.if`, `room cam03.hotspots.thumb_cam15.use.0`, `room cam04.hotspots.thumb_cam15.if`, … (5) |  |
| `link_cam18` | `true` | `room cam03.hotspots.thumb_cam18.use.0.else.0`, `room cam04.hotspots.thumb_cam18.use.0.else.0`, `room cam21.hotspots.thumb_cam18.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam18.if`, `room cam03.hotspots.thumb_cam18.use.0`, `room cam04.hotspots.thumb_cam18.if`, … (5) |  |
| `link_cam21` | `true` | `room cam03.hotspots.thumb_cam21.use.0.else.0`, `room cam04.hotspots.thumb_cam21.use.0.else.0`, `room cam22.hotspots.thumb_cam21.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam21.if`, `room cam03.hotspots.thumb_cam21.use.0`, `room cam04.hotspots.thumb_cam21.if`, … (5) |  |
| `link_cam22` | `true` | `room cam03.hotspots.thumb_cam22.use.0.else.0`, `room cam04.hotspots.thumb_cam22.use.0.else.0`, `room cam21.hotspots.menu.use.0.else.2`, … (5) | `room cam03.hotspots.thumb_cam22.if`, `room cam03.hotspots.thumb_cam22.use.0`, `room cam04.hotspots.thumb_cam22.if`, … (5) |  |
| `link_cam23` | `true` | `room cam03.hotspots.thumb_cam23.use.0.else.0`, `room cam04.hotspots.thumb_cam23.use.0.else.0`, `room cam21.hotspots.thumb_cam23.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam23.if`, `room cam03.hotspots.thumb_cam23.use.0`, `room cam04.hotspots.thumb_cam23.if`, … (5) |  |
| `link_cam24` |  | `room cam03.hotspots.thumb_cam24.use.0.else.0`, `room cam04.hotspots.thumb_cam24.use.0.else.0`, `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, … (5) | `room cam03.hotspots.thumb_cam24.if`, `room cam03.hotspots.thumb_cam24.use.0`, `room cam04.hotspots.thumb_cam24.if`, … (5) |  |
| `link_cam30` | `true` | `room cam03.hotspots.thumb_cam30.use.0.else.0`, `room cam04.hotspots.thumb_cam30.use.0.else.0`, `room cam21.hotspots.thumb_cam30.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam30.if`, `room cam03.hotspots.thumb_cam30.use.0`, `room cam04.hotspots.thumb_cam30.if`, … (5) |  |
| `link_cam31` | `true` | `room cam03.hotspots.thumb_cam31.use.0.else.0`, `room cam04.hotspots.thumb_cam31.use.0.else.0`, `room cam21.hotspots.thumb_cam31.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam31.if`, `room cam03.hotspots.thumb_cam31.use.0`, `room cam04.hotspots.thumb_cam31.if`, … (5) |  |
| `markt_gesehen` | `true` | `sequence drain_arrival_first.steps.0`, `sequence drain_arrival_first.after.0` | `room gasse.hotspots.market.use.0` |  |
| `moth_brushed` | `true` | `dialog motte.main.2.then.1` | `actor motte.talk.1.else.0.else.0.else.0` | kapitel1 |
| `moth_kind` | `true` | `dialog motte.main.0.then.1`, `act kapitel1.start.5.then.0` | `actor motte.talk.1`, `actor motte.talk.1.else.0.else.0` | kapitel1 |
| `moth_lesson` | `1`, `2`, `3` | `dialog motte_lektion.main.0.then.6`, `dialog motte_lektion.main.1.then.4`, `dialog motte_lektion.main.2.then.8` | `actor motte.talk.1`, `dialog motte_lektion.main.0.if`, `dialog motte_lektion.main.1.if`, … (4) |  |
| `moth_met` | `true` | `dialog motte.main.0.then.0`, `dialog motte.main.1.then.0`, `dialog motte.main.2.then.0`, … (4) | `room kessel_14.hotspots.stairs.use.0`, `actor motte.talk.1.else.0` |  |
| `moth_student` | `true` | `dialog motte_lektion.main.2.then.5` |  |  |
| `moth_today` | `true` | `dialog motte_lektion.main.0.then.7`, `dialog motte_lektion.main.1.then.5`, `dialog motte_lektion.main.2.then.9` | `actor motte.talk.1`, `actor motte.talk.1.then.1` |  |
| `netz_from` | `start`, `such_0`, `such_1`, `such_2`, `such_5`, `such_7` | `room deck.hotspots.app_netz.use.3`, `room deck.hotspots.netz_tab_start.use.1`, `room deck.hotspots.netz_tab_nagiwa.use.1`, … (5) |  |  |
| `netz_page` | `abzweiger`, `archiv`, `aufzug`, `automat`, `brett`, `flut`, `gezeiten`, `huelle`, … (26) | `room deck.hotspots.app_netz.use.2`, `room deck.hotspots.netz_tab_start.use.0`, `room deck.hotspots.netz_tab_nagiwa.use.0`, … (5) | `room deck.hotspots.netz_back_lull.if`, `room deck.hotspots.netz_back_rekordtief.if`, `room deck.hotspots.netz_back_huelle.if`, … (5) |  |
| `netz_read` | `2`, `3`, `4` | `room deck.hotspots.app_netz.use.4.then.0`, `room deck.hotspots.app_netz.use.5.then.0`, `room deck.hotspots.app_netz.use.6.then.0` | `room deck.hotspots.app_netz.use.4`, `room deck.hotspots.app_netz.use.5`, `room deck.hotspots.app_netz.use.6` |  |
| `news_stack` | `true` | `room kessel_14.hotspots.haldane.talk.0.else.0.then.0.then.7`, `room kessel_14.hotspots.haldane.use.0.then.7` | `room kessel_14.hotspots.haldane.talk.0.else.0.then.0`, `room kessel_14.hotspots.haldane.use.0`, `room kessel_14.hotspots.notes.look.0` |  |
| `news_who` | `true` | `actor haldane_feed.talk.0.then.4` | `room kessel_14.hotspots.notes.look.0`, `actor haldane_feed.talk.0` |  |
| `off_imai` |  | `act kapitel1.start.28` | `room deck.hotspots.contact_imai.if`, `actor imai.talk.0` |  |
| `off_main` |  | `act kapitel1.start.28` | `room cam03.hotspots.thumb_cam22.if`, `room cam03.hotspots.thumb_cam23.if`, `room cam03.hotspots.thumb_cam30.if`, … (5) |  |
| `off_motte` |  | `act kapitel1.start.28` | `actor motte.talk.1` |  |
| `off_roof` |  | `act kapitel1.start.28` | `room flat.hotspots.box_old.use.0`, `room kessel_14.hotspots.haken.if` |  |
| `off_tide` |  | `act kapitel1.start.28` | `room cam03.hotspots.thumb_cam07.if`, `room cam03.hotspots.thumb_cam07v.if`, `room cam04.hotspots.thumb_cam07.if`, … (5) |  |
| `off_traeger` |  | `act kapitel1.start.28` | `moment traeger_ruf.unseen.0`, `moment traeger.if` |  |
| `off_varga` |  | `act kapitel1.start.28` | `room deck.hotspots.contact_varga.if`, `hints.1.if`, `hints.2.if`, … (5) |  |
| `off_vesper` |  | `act kapitel1.start.28` | `room deck.hotspots.contact_vesper.if`, `room deck.hotspots.clip_anon_clip_kessler_ring.if`, `room deck.hotspots.clip_anon_clip_morrow_bribe.if`, … (4) |  |
| `off_zeitung` |  | `act kapitel1.start.28` | `room kessel_14.hotspots.haldane.talk.0.else.0.then.0`, `room kessel_14.hotspots.haldane.use.0`, `room kessel_14.hotspots.corner_cam.use.0` |  |
| `p1` | `cut`, `full`, `nothing` | `room deck.hotspots.reply_kessler_full.use.1`, `room deck.hotspots.reply_kessler_cut.use.1`, `room deck.hotspots.reply_kessler_nothing.use.1`, … (4) | `room flat.hotspots.door.use.0`, `room flat.enter.3.then.0`, `room deck.hotspots.contact_sable.if`, … (5) | kapitel1 |
| `read_imai` | `true` | `room deck.hotspots.contact_imai.use.1.then.0` | `room deck.hotspots.contact_imai.use.1` |  |
| `read_kessler` | `true` | `room deck.hotspots.contact_kessler.use.1`, `act kapitel1.start.20` | `hints.24.if` |  |
| `read_kessler_again` | `true` | `room deck.hotspots.contact_kessler.use.2` |  |  |
| `read_tide` | `true` | `room deck.hotspots.contact_tide.use.1.then.0` | `room deck.hotspots.contact_tide.use.1` |  |
| `read_varga` | `true` | `room deck.hotspots.contact_varga.use.1.then.0` | `room deck.hotspots.contact_varga.use.1` |  |
| `read_vesper` | `true` | `room deck.hotspots.contact_vesper.use.1.then.0` | `room deck.hotspots.contact_vesper.use.1` |  |
| `read_wren` | `true` | `room deck.hotspots.contact_wren.use.1.then.0` | `room deck.hotspots.contact_wren.use.1`, `room deck.enter.1.else.0` |  |
| `rec_on` | `true` | `room cam03.hotspots.rec.use.1.then.0`, `room cam03.hotspots.rec.use.1.else.0`, `room cam03.enter.0`, … (5) | `room cam03.hotspots.rec.use.1`, `room cam04.hotspots.rec.use.1`, `room cam21.hotspots.rec.use.1`, … (5) |  |
| `rent` | `paid`, `teo` | `moment rent_due.unseen.0.then.1`, `moment rent_due.unseen.0.else.1` |  |  |
| `rent_notice` | `true` | `room kessel_lobby.hotspots.mailboxes.use.0.then.0`, `act kapitel1.start.22` | `room kessel_lobby.hotspots.mailboxes.look.0`, `room kessel_lobby.hotspots.mailboxes.use.0`, `room kessel_lobby.hotspots.door.use.0`, … (5) |  |
| `saw_varga` | `true` | `room cam04.hotspots.rewind.use.5`, `act kapitel1.start.19`, `moment kessler_ring.play.10` | `actor varga.look.1` |  |
| `soup_eaten` | `true` | `room flat.enter.1.then.6` | `room flat.hotspots.bed.use.0.else.0`, `hints.37.if` |  |
| `stairs_down` | `true` | `room kessel_14.hotspots.stairs.use.1.then.0` | `room kessel_14.hotspots.stairs.use.1` |  |
| `stairs_up` | `true` | `room kessel_lobby.hotspots.stairs.use.0.then.0` | `room kessel_lobby.hotspots.stairs.use.0` |  |
| `stick_ines` | `true` | `dialog stick.main.0.then.0.then.0`, `dialog stick.main.1.then.0.then.0` | `room laundromat.hotspots.dryer6.use.0.then.0`, `dialog stick.main.0.then.0`, `dialog stick.main.1.then.0`, … (5) |  |
| `tag_ines` |  | `actor ines.talk.0.else.0.else.0`, `moment ines_meeting.play.0` | `actor ines.talk.0.else.0`, `hints.15.if` |  |
| `tag_kessler` |  | `room cam03.hotspots.rewind.use.1`, `actor kessler.talk.0.else.0` | `actor kessler.look.1`, `actor kessler.talk.0`, `hints.26.if`, … (4) |  |
| `tag_kessler2` |  | `room cam03.hotspots.vending.use.0.then.5`, `actor kessler2.talk.0.else.0.else.5` |  |  |
| `tag_varga` |  | `actor varga.talk.0.else.0` | `actor varga.talk.0` |  |
| `teo_bowl` | `true` | `moment teo_visit.unseen.9`, `moment teo_visit.unseen.16` | `actor teo.poses.0.if` |  |
| `traeger` | `filmed`, `girl`, `watched` | `dialog traeger_wahl.main.0.then.0`, `dialog traeger_wahl.main.1.then.0`, `dialog traeger_wahl.main.2.then.0` |  |  |
| `varga_step` | `1` | `room cam03.hotspots.vending.use.0.then.6`, `actor kessler2.talk.0.else.0.else.6` | `room cam03.hotspots.vending.use.0`, `room cam03.hotspots.thumb_cam15.if`, `room cam04.hotspots.thumb_cam15.if`, … (5) |  |
| `window_open` | `true` | `room flat.hotspots.window.with.ausweis.0.then.3` | `room flat.hotspots.window.use.0`, `room flat.hotspots.window.with.ausweis.0` |  |
