# Flags (erzeugt)

Erzeugt von `node tools/doc-lint.mjs --flags` aus den Daten des Spiels; nie von Hand ändern. Jedes Flag mit seinen Werten,
wo es gesetzt und wo es abgefragt wird (die ersten drei Stellen) und welcher Akt es übernimmt (`keep`). Die Bedeutung steht im
Kopf der Datei, die es setzt (`game/nagiwa.js` nennt die Muster).

| Flag | Werte | gesetzt | abgefragt | übernommen von |
|---|---|---|---|---|
| `anon_clip_kessler_ring` | `true` | `room deck.hotspots.clip_anon_clip_kessler_ring.use.1` | `room deck.hotspots.reply_vesper_ring.if`, `room deck.hotspots.clip_anon_clip_kessler_ring.if` | kapitel2 |
| `anon_clip_morrow_bribe` | `true` | `room deck.hotspots.clip_anon_clip_morrow_bribe.use.1` | `room deck.hotspots.reply_vesper_morrow.if`, `room deck.hotspots.clip_anon_clip_morrow_bribe.if` | kapitel2 |
| `anon_clip_traeger` | `true` | `room deck.hotspots.clip_anon_clip_traeger.use.1` | `room deck.hotspots.reply_vesper_traeger.if`, `room deck.hotspots.clip_anon_clip_traeger.if` | kapitel2 |
| `ashe_lit` | `true` | `moment ines_death.play.2` | `actor ashe.poses.1.if` |  |
| `bao_paid` | `true` | `dialog bao.main.1.then.1` | `room kowalski.hotspots.bao.talk.0.then.0.then.0`, `room kowalski.hotspots.cart.use.0.then.0.then.0` | kapitel1 |
| `bao_soup` | `true` | `dialog bao.main.0.then.9`, `dialog bao.main.1.then.13`, `act kapitel1.start.24`, … (4) | `room kowalski.hotspots.bao.talk.0.else.0`, `room kowalski.hotspots.bao.talk.0.else.0.then.1`, `room kowalski.hotspots.cart.use.0.else.0`, … (5) |  |
| `bed_closed` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.4`, `room flat.enter.2.then.1` | `room flat.hotspots.bed.use.0.then.0` |  |
| `cache_clip_ines_death` | `true` | `act kapitel2.start.2.then.9`, `moment ines_death.play.12` | `room deck.hotspots.reply_vesper_ines.if`, `room deck.hotspots.cache_clip_ines_death.if`, `dialog k2_clip.main.0.if` | kapitel2 |
| `cache_clip_kessler_cut` |  | `room deck.hotspots.clip_cut_clip_kessler_ring.use.1` | `room deck.hotspots.reply_kessler_cut.if`, `room deck.hotspots.cache_clip_kessler_cut.if`, `room deck.hotspots.clip_cut_clip_kessler_ring.if` | kapitel1, kapitel2 |
| `cache_clip_kessler_ring` |  | `room cam04.hotspots.rewind.use.3`, `act kapitel1.start.5.then.4`, `act kapitel2.start.2.then.8`, … (4) | `room cam04.hotspots.rewind.if`, `room deck.hotspots.reply_kessler_full.if`, `room deck.hotspots.reply_kessler_nothing.if`, … (5) | kapitel1, kapitel2 |
| `cache_clip_morrow_bribe` |  | `dialog morrow_bribe.main.0.then.3` | `room deck.hotspots.reply_vesper_morrow.if`, `room deck.hotspots.cache_clip_morrow_bribe.if`, `dialog morrow_bribe.main.0.if` | kapitel2 |
| `cache_clip_traeger` |  | `dialog traeger_wahl.main.1.then.1` | `room deck.hotspots.reply_vesper_traeger.if`, `room deck.hotspots.cache_clip_traeger.if` | kapitel2 |
| `cache_note_civic_rest` |  | `dialog k2_kuehlschrank.main.1.then.5` | `room deck.hotspots.cache_note_civic_rest.if` |  |
| `cache_note_haldane_marks` |  | `room kessel_14.hotspots.haldane.talk.0.else.0.then.0.then.8`, `room kessel_14.hotspots.haldane.use.0.then.8` | `room deck.hotspots.cache_note_haldane_marks.if` |  |
| `cache_note_imai_street` |  | `room cam18.hotspots.rewind.use.7` | `room deck.hotspots.cache_note_imai_street.if` |  |
| `cache_note_kessler_debt` |  | `room cam04.hotspots.rewind.use.6`, `act kapitel1.start.5.then.5`, `moment kessler_ring.play.11` | `room deck.hotspots.reply_sable_sold.if`, `room deck.hotspots.cache_note_kessler_debt.if`, `dialog sable.code.1.if` | kapitel1 |
| `cache_note_kessler_hideout` |  | `room cam15.hotspots.rewind.use.3`, `actor kessler2.talk.0.then.0.else.2` | `room cam15.hotspots.kapsel23.if`, `room cam15.hotspots.rewind.if`, `room deck.hotspots.reply_varga_sold.if`, … (5) |  |
| `cache_note_kessler_photo` |  | `act prolog.start.6`, `act kapitel1.start.8`, `act kapitel2.start.30` | `room deck.hotspots.cache_note_kessler_photo.if` |  |
| `cache_note_obs_handbook` |  | `act kapitel1.start.9`, `act kapitel2.start.31` | `room deck.hotspots.cache_note_obs_handbook.if` |  |
| `cache_note_safe_code` |  | `room cam07v.hotspots.rewind.use.6`, `actor okonkwo_safe.talk.0.else.0.else.5` | `room cam07v.hotspots.rewind.if`, `room deck.hotspots.reply_tide_sold.if`, `room deck.hotspots.reply_tide_lied.if`, … (5) |  |
| `cache_note_serviette` |  | `dialog k2_kuehlschrank.main.0.then.5` | `room deck.hotspots.cache_note_serviette.if`, `dialog k2_kuehlschrank.main.0.if`, `dialog k2_kuehlschrank.main.2.then.0` |  |
| `call_missed` | `true` | `moment kessler_call.unseen.0.then.0` | `room cam03.hotspots.rewind.if`, `hints.35.if`, `hints.36.if`, … (5) |  |
| `chits` |  | `room deck.hotspots.reply_kessler_full.use.2`, `room deck.hotspots.reply_kessler_cut.use.2`, `room deck.hotspots.reply_kessler_nothing.use.2`, … (5) | `room deck.hotspots.reply_wren_back.if`, `dialog bao.main.1.if`, `dialog sable.code.0.if`, … (5) | kapitel1, kapitel2 |
| `code_cam03` | `true` | `act prolog.start.4`, `act kapitel1.start.6`, `act kapitel2.start.10` | `room cam04.hotspots.thumb_cam03.if`, `room cam21.hotspots.thumb_cam03.if`, `room cam22.hotspots.thumb_cam03.if`, … (5) |  |
| `code_cam04` | `true` | `room cam03.hotspots.mast.use.4`, `act kapitel2.start.12` | `room cam03.hotspots.thumb_cam04.if`, `room cam21.hotspots.thumb_cam04.if`, `room cam22.hotspots.thumb_cam04.if`, … (5) |  |
| `code_cam07` | `true` | `act kapitel1.start.16`, `act kapitel2.start.14` | `room cam03.hotspots.thumb_cam07.if`, `room cam04.hotspots.thumb_cam07.if`, `room cam21.hotspots.thumb_cam07.if`, … (5) |  |
| `code_cam07v` | `true` | `room jade_row.hotspots.machine.with.abzweiger.0.then.9` | `room cam03.hotspots.thumb_cam07v.if`, `room cam04.hotspots.thumb_cam07v.if`, `room cam21.hotspots.thumb_cam07v.if`, … (5) |  |
| `code_cam14` | `true` | `dialog zeitung_cam.main.0.then.0` | `room cam03.hotspots.thumb_cam14.if`, `room cam04.hotspots.thumb_cam14.if`, `room cam21.hotspots.thumb_cam14.if`, … (5) |  |
| `code_cam15` | `true` | `dialog sable.code.0.then.1`, `dialog sable.code.1.then.1` | `room cam03.hotspots.thumb_cam15.if`, `room cam04.hotspots.thumb_cam15.if`, `room cam21.hotspots.thumb_cam15.if`, … (5) |  |
| `code_cam18` | `true` | `act kapitel1.start.14`, `act kapitel2.start.16` | `room cam03.hotspots.thumb_cam18.if`, `room cam04.hotspots.thumb_cam18.if`, `room cam21.hotspots.thumb_cam18.if`, … (5) |  |
| `code_cam21` | `true` | `act kapitel1.start.10`, `act kapitel2.start.18` | `room cam03.hotspots.thumb_cam21.if`, `room cam04.hotspots.thumb_cam21.if`, `room cam22.hotspots.thumb_cam21.if`, … (5) |  |
| `code_cam22` | `true` | `room cam21.hotspots.menu.use.0.else.1`, `act kapitel2.start.20` | `room cam03.hotspots.thumb_cam22.if`, `room cam04.hotspots.thumb_cam22.if`, `room cam21.hotspots.thumb_cam22.if`, … (5) |  |
| `code_cam23` | `true` | `room deck.hotspots.cam_cam23.use.0.else.0.else.1`, `act kapitel2.start.22` | `room cam03.hotspots.thumb_cam23.if`, `room cam04.hotspots.thumb_cam23.if`, `room cam21.hotspots.thumb_cam23.if`, … (5) |  |
| `code_cam24` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `act kapitel2.start.24` | `room cam03.hotspots.thumb_cam24.if`, `room cam04.hotspots.thumb_cam24.if`, `room cam21.hotspots.thumb_cam24.if`, … (5) |  |
| `code_cam25` | `true` | `act kapitel2.start.26` | `room cam03.hotspots.thumb_cam25.if`, `room cam04.hotspots.thumb_cam25.if`, `room cam21.hotspots.thumb_cam25.if`, … (5) |  |
| `code_cam30` | `true` | `act kapitel1.start.12`, `act kapitel2.start.28` | `room cam03.hotspots.thumb_cam30.if`, `room cam04.hotspots.thumb_cam30.if`, `room cam21.hotspots.thumb_cam30.if`, … (5) |  |
| `code_cam31` | `true` | `dialog cam31_takt.vier_ok.0.then.3` | `room cam03.hotspots.thumb_cam31.if`, `room cam04.hotspots.thumb_cam31.if`, `room cam21.hotspots.thumb_cam31.if`, … (5) |  |
| `code_lerche` | `true` | `moment nachbar_sat.play.3` | `room cam24.hotspots.rewind.if`, `dialog k2_tor.main.0.then.0`, `hints.1.if`, … (5) |  |
| `deck_app` | `buch`, `cache`, `chat`, `chat_becken3`, `chat_imai`, `chat_kessler`, `chat_nagiwa`, `chat_sable`, … (23) | `room flat.enter.0`, `room deck.hotspots.app_glas.use.0`, `room deck.hotspots.app_chat.use.0`, … (5) | `room deck.hotspots.win_close.if`, `room deck.hotspots.cam_cam03.if`, `room deck.hotspots.cam_cam04.if`, … (5) |  |
| `e1` | `refused`, `sold` | `room deck.hotspots.reply_wren_send.use.1`, `room deck.hotspots.reply_wren_refuse.use.1`, `act kapitel2.start.2.then.0`, … (4) | `room deck.hotspots.reply_wren_back.if`, `room deck.hotspots.reply_wren_send.if`, `room deck.hotspots.reply_wren_refuse.if`, … (5) | kapitel2 |
| `e2` | `kept`, `vesper` | `room deck.hotspots.reply_vesper_ines.use.1`, `dialog k2_clip.main.0.then.0`, `dialog k2_clip.main.1.then.0` | `room deck.hotspots.reply_vesper_ines.if`, `hints.6.if`, `hints.7.if` |  |
| `end_beat` | `after`, `kill`, `look`, `threat`, `unknown` | `moment ines_meeting.play.25`, `moment ines_meeting.play.29`, `moment ines_death.play.0`, … (5) | `room cam31.hotspots.wait.use.0`, `room cam31.hotspots.back.if`, `room cam31.hotspots.try_steuern.if`, … (5) |  |
| `end_beat2` | `found`, `sent` | `room k2_protokolle.hotspots.protokolle.use.3`, `moment protokolle.unseen.0` | `room k2_protokolle.hotspots.protokolle.if`, `room deck.hotspots.contact_becken3.if`, `hints.0.if` |  |
| `evening_shown` | `2` | `room flat.enter.2.then.0` | `room flat.enter.2` |  |
| `evi_knows` | `true` | `dialog k2_kuehlschrank.main.1.then.16` | `dialog k2_kuehlschrank.main.1.if`, `dialog k2_kuehlschrank.main.2.then.0`, `hints.1.if`, … (5) |  |
| `evi_trust` |  | `dialog evi_cut.main.0.then.0`, `dialog evi_cut.main.1.then.0` |  | kapitel1, kapitel2 |
| `fridge_empty` | `true` | `room flat.hotspots.fridge.use.0`, `act kapitel1.start.21`, `act kapitel2.start.35` | `room flat.hotspots.door.use.0.else.0`, `hints.43.if`, `hints.44.if`, … (5) |  |
| `got_ausweis` | `true` | `room flat.hotspots.box_old.use.0.then.3` | `room flat.hotspots.box_old.look.1`, `room flat.hotspots.box_old.use.0`, `act kapitel1.start.2`, … (4) | kapitel1, kapitel2 |
| `got_haken` | `true` | `room kessel_14.hotspots.haken.use.4` | `room kessel_14.hotspots.haken.if`, `room kessel_14.enter.0`, `room cam14.props.haken.if`, … (5) | kapitel1, kapitel2 |
| `got_tap` | `true` | `dialog motte_lektion.main.1.then.3.then.4`, `dialog ratz.main.0.0.0.then.2` | `dialog motte_lektion.main.1.then.3`, `dialog ratz.main.0.0.if`, `dialog ratz.main.0.0.0.if`, … (5) |  |
| `heard_yuens` | `true` | `room cam03.hotspots.rewind.use.6`, `moment kessler_call.play.4` | `room cam03.hotspots.rewind.if`, `room cam03.hotspots.thumb_cam04.if`, `room cam21.hotspots.thumb_cam04.if`, … (5) |  |
| `imai_step` | `0`, `1`, `2`, `3` | `room cam18.hotspots.rewind.use.8`, `actor imai.talk.0.then.11`, `dialog imai_wahl.main.0.then.0`, … (5) | `room cam03.hotspots.thumb_cam18.if`, `room cam04.hotspots.thumb_cam18.if`, `room cam21.hotspots.thumb_cam18.if`, … (5) |  |
| `imai_told` | `dream`, `truth` | `dialog imai_wahl.main.0.then.1`, `dialog imai_wahl.main.1.then.1` | `actor imai.talk.3`, `actor imai.talk.4` | kapitel2 |
| `ines_down` | `true` | `moment ines_death.play.11.then.3`, `moment ines_death.play.11.else.4` | `room cam31.hotspots.rec.if`, `actor ines.poses.2.if` |  |
| `ines_gives` | `true` | `moment ines_meeting.play.10`, `moment ines_meeting.play.12` | `actor ines.poses.3.if` |  |
| `k1a` | `lied`, `sold`, `warned` | `room deck.hotspots.reply_varga_sold.use.1`, `room deck.hotspots.reply_varga_lied.use.1`, `dialog k1a_warn.main.0.then.0` | `room cam15.hotspots.kapsel23.look.0.then.0`, `room cam15.hotspots.kapsel23.use.0`, `room deck.hotspots.reply_varga_sold.if`, … (5) | kapitel2 |
| `k1b` | `lied`, `sold`, `warned` | `room deck.hotspots.reply_tide_sold.use.1`, `room deck.hotspots.reply_tide_lied.use.1`, `dialog okonkwo.main.2.then.0` | `room cam07v.hotspots.rewind.if`, `room okonkwo_shop.hotspots.counter.look.0`, `room deck.hotspots.reply_tide_sold.if`, … (5) | kapitel2 |
| `kessler_gone` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `dialog k1a_warn.main.0.then.2` | `room cam15.hotspots.kapsel23.look.0`, `room cam15.hotspots.rewind.if`, `routine kessler2.0.if`, … (4) |  |
| `know_flat` | `true` | `room lerche_flur.hotspots.door_4b.use.0.then.0.then.2`, `moment quiet_flat.play.3` | `room lerche_flur.hotspots.door_4b.use.0.then.0`, `room lerche_flur.hotspots.door_4b.use.0.else.0`, `hints.2.if` |  |
| `know_ines` | `true` | `act kapitel1.start.18`, `act kapitel2.start.32` |  |  |
| `know_meeting` | `true` | `moment ines_tide.play.6`, `moment ines_sign.play.1` | `room cam03.hotspots.thumb_cam31.if`, `room cam04.hotspots.thumb_cam31.if`, `room cam21.hotspots.thumb_cam31.if`, … (5) |  |
| `ladder_down` | `true` | `room sims.hotspots.ladder.with.haken.0.else.3`, `moment teo_monday.unseen.25.else.0` | `room sims.props.ladder.if`, `room sims.hotspots.ladder.look.0`, `room sims.hotspots.ladder.use.0`, … (5) | kapitel2 |
| `ledger_cam31` |  | `dialog k2_clip.main.1.then.1` | `code the deck's BUCH` |  |
| `ledger_imai` |  | `dialog imai_wahl.main.0.then.2`, `dialog imai_wahl.main.1.then.2` | `code the deck's BUCH` | kapitel2 |
| `ledger_ines` |  | `act kapitel2.start.2.then.6`, `moment ines_death.play.22.then.1` | `code the deck's BUCH` | kapitel2 |
| `ledger_kessler` |  | `room deck.hotspots.reply_kessler_full.use.2`, `room deck.hotspots.reply_kessler_cut.use.2`, `room deck.hotspots.reply_kessler_nothing.use.2`, … (5) | `act kapitel2.start.3`, `act kapitel2.start.4`, `act kapitel2.start.5`, … (4) | kapitel1, kapitel2 |
| `ledger_kessler_warn` |  | `dialog k1a_warn.main.0.then.1` | `code the deck's BUCH` | kapitel2 |
| `ledger_okonkwo` |  | `dialog okonkwo.main.2.then.1` | `code the deck's BUCH` | kapitel2 |
| `ledger_sable_kessler` |  | `room deck.hotspots.reply_sable_sold.use.1`, `dialog sable.code.1.then.0` | `room deck.hotspots.reply_sable_sold.if`, `dialog sable.code.1.if`, `code the deck's BUCH` | kapitel1, kapitel2 |
| `ledger_tide` |  | `room deck.hotspots.reply_tide_sold.use.2`, `room deck.hotspots.reply_tide_lied.use.2` | `code the deck's BUCH` | kapitel2 |
| `ledger_varga` |  | `room deck.hotspots.reply_varga_sold.use.2`, `room deck.hotspots.reply_varga_lied.use.2` | `code the deck's BUCH` | kapitel2 |
| `ledger_vesper_ines` |  | `room deck.hotspots.reply_vesper_ines.use.2`, `dialog k2_clip.main.0.then.1` | `code the deck's BUCH` |  |
| `ledger_vesper_morrow` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `room deck.hotspots.reply_vesper_morrow.use.1` | `room deck.hotspots.reply_vesper_morrow.if`, `code the deck's BUCH` | kapitel2 |
| `ledger_vesper_ring` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `room deck.hotspots.reply_vesper_ring.use.1` | `room deck.hotspots.reply_vesper_ring.if`, `code the deck's BUCH` | kapitel2 |
| `ledger_vesper_traeger` |  | `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, `room deck.hotspots.reply_vesper_traeger.use.1` | `room deck.hotspots.reply_vesper_traeger.if`, `code the deck's BUCH` | kapitel2 |
| `ledger_wren` |  | `room deck.hotspots.reply_wren_send.use.2.then.0`, `room deck.hotspots.reply_wren_send.use.2.else.0`, `room deck.hotspots.reply_wren_refuse.use.2`, … (5) | `code the deck's BUCH` | kapitel2 |
| `ledger_wren_advance` |  | `room deck.hotspots.reply_wren_back.use.2`, `act kapitel1.start.26`, `act kapitel2.start.2.then.3` | `room deck.hotspots.reply_wren_back.if`, `room deck.hotspots.reply_wren_send.use.2`, `code the deck's BUCH` | kapitel2 |
| `ledger_wren_live` |  | `act kapitel2.start.2.then.5`, `moment ines_death.play.22.then.0` | `code the deck's BUCH` | kapitel2 |
| `link_cam03` | `true` | `room cam04.hotspots.thumb_cam03.use.0.else.0`, `room cam21.hotspots.thumb_cam03.use.0.else.0`, `room cam22.hotspots.thumb_cam03.use.0.else.0`, … (5) | `room cam04.hotspots.thumb_cam03.if`, `room cam04.hotspots.thumb_cam03.use.0`, `room cam21.hotspots.thumb_cam03.if`, … (5) |  |
| `link_cam04` | `true` | `room cam03.hotspots.thumb_cam04.use.0.else.0`, `room cam21.hotspots.thumb_cam04.use.0.else.0`, `room cam22.hotspots.thumb_cam04.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam04.if`, `room cam03.hotspots.thumb_cam04.use.0`, `room cam21.hotspots.thumb_cam04.if`, … (5) |  |
| `link_cam07` | `true` | `room cam03.hotspots.thumb_cam07.use.0.else.0`, `room cam04.hotspots.thumb_cam07.use.0.else.0`, `room cam21.hotspots.thumb_cam07.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam07.if`, `room cam03.hotspots.thumb_cam07.use.0`, `room cam04.hotspots.thumb_cam07.if`, … (5) |  |
| `link_cam07v` | `true` | `room cam03.hotspots.thumb_cam07v.use.0.else.0`, `room cam04.hotspots.thumb_cam07v.use.0.else.0`, `room cam21.hotspots.thumb_cam07v.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam07v.if`, `room cam03.hotspots.thumb_cam07v.use.0`, `room cam04.hotspots.thumb_cam07v.if`, … (5) | kapitel2 |
| `link_cam14` | `true` | `room cam03.hotspots.thumb_cam14.use.0.else.0`, `room cam04.hotspots.thumb_cam14.use.0.else.0`, `room cam21.hotspots.thumb_cam14.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam14.if`, `room cam03.hotspots.thumb_cam14.use.0`, `room cam04.hotspots.thumb_cam14.if`, … (5) | kapitel2 |
| `link_cam15` | `true` | `room cam03.hotspots.thumb_cam15.use.0.else.0`, `room cam04.hotspots.thumb_cam15.use.0.else.0`, `room cam21.hotspots.thumb_cam15.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam15.if`, `room cam03.hotspots.thumb_cam15.use.0`, `room cam04.hotspots.thumb_cam15.if`, … (5) | kapitel2 |
| `link_cam18` | `true` | `room cam03.hotspots.thumb_cam18.use.0.else.0`, `room cam04.hotspots.thumb_cam18.use.0.else.0`, `room cam21.hotspots.thumb_cam18.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam18.if`, `room cam03.hotspots.thumb_cam18.use.0`, `room cam04.hotspots.thumb_cam18.if`, … (5) |  |
| `link_cam21` | `true` | `room cam03.hotspots.thumb_cam21.use.0.else.0`, `room cam04.hotspots.thumb_cam21.use.0.else.0`, `room cam22.hotspots.thumb_cam21.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam21.if`, `room cam03.hotspots.thumb_cam21.use.0`, `room cam04.hotspots.thumb_cam21.if`, … (5) |  |
| `link_cam22` | `true` | `room cam03.hotspots.thumb_cam22.use.0.else.0`, `room cam04.hotspots.thumb_cam22.use.0.else.0`, `room cam21.hotspots.menu.use.0.else.2`, … (5) | `room cam03.hotspots.thumb_cam22.if`, `room cam03.hotspots.thumb_cam22.use.0`, `room cam04.hotspots.thumb_cam22.if`, … (5) |  |
| `link_cam23` | `true` | `room cam03.hotspots.thumb_cam23.use.0.else.0`, `room cam04.hotspots.thumb_cam23.use.0.else.0`, `room cam21.hotspots.thumb_cam23.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam23.if`, `room cam03.hotspots.thumb_cam23.use.0`, `room cam04.hotspots.thumb_cam23.if`, … (5) |  |
| `link_cam24` |  | `room cam03.hotspots.thumb_cam24.use.0.else.0`, `room cam04.hotspots.thumb_cam24.use.0.else.0`, `room flat.hotspots.bed.use.0.then.0.else.0.else.2`, … (5) | `room cam03.hotspots.thumb_cam24.if`, `room cam03.hotspots.thumb_cam24.use.0`, `room cam04.hotspots.thumb_cam24.if`, … (5) |  |
| `link_cam25` | `true` | `room cam03.hotspots.thumb_cam25.use.0.else.0`, `room cam04.hotspots.thumb_cam25.use.0.else.0`, `room cam21.hotspots.thumb_cam25.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam25.if`, `room cam03.hotspots.thumb_cam25.use.0`, `room cam04.hotspots.thumb_cam25.if`, … (5) |  |
| `link_cam30` | `true` | `room cam03.hotspots.thumb_cam30.use.0.else.0`, `room cam04.hotspots.thumb_cam30.use.0.else.0`, `room cam21.hotspots.thumb_cam30.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam30.if`, `room cam03.hotspots.thumb_cam30.use.0`, `room cam04.hotspots.thumb_cam30.if`, … (5) |  |
| `link_cam31` | `true` | `room cam03.hotspots.thumb_cam31.use.0.else.0`, `room cam04.hotspots.thumb_cam31.use.0.else.0`, `room cam21.hotspots.thumb_cam31.use.0.else.0`, … (5) | `room cam03.hotspots.thumb_cam31.if`, `room cam03.hotspots.thumb_cam31.use.0`, `room cam04.hotspots.thumb_cam31.if`, … (5) |  |
| `markt_gesehen` | `true` | `sequence drain_arrival_first.steps.0`, `sequence drain_arrival_first.after.0` | `room gasse.hotspots.market.use.0` |  |
| `moth_brushed` | `true` | `dialog motte.main.2.then.1` | `actor motte.talk.1.else.0.else.0.else.0` | kapitel1 |
| `moth_kind` | `true` | `dialog motte.main.0.then.1`, `act kapitel1.start.5.then.0` | `actor motte.talk.1`, `actor motte.talk.1.else.0.else.0` | kapitel1 |
| `moth_lesson` | `1`, `2`, `3` | `dialog motte_lektion.main.0.then.6`, `dialog motte_lektion.main.1.then.4`, `dialog motte_lektion.main.2.then.8` | `actor motte.talk.1`, `dialog motte_lektion.main.0.if`, `dialog motte_lektion.main.1.if`, … (4) |  |
| `moth_met` | `true` | `dialog motte.main.0.then.0`, `dialog motte.main.1.then.0`, `dialog motte.main.2.then.0`, … (5) | `room kessel_14.hotspots.stairs.use.0`, `actor motte.talk.1.else.0` |  |
| `moth_student` | `true` | `dialog motte_lektion.main.2.then.5` |  | kapitel2 |
| `moth_today` | `true` | `dialog motte_lektion.main.0.then.7`, `dialog motte_lektion.main.1.then.5`, `dialog motte_lektion.main.2.then.9` | `actor motte.talk.1`, `actor motte.talk.1.then.1` |  |
| `netz_from` | `start`, `such_0`, `such_1`, `such_2`, `such_5`, `such_7` | `room deck.hotspots.app_netz.use.3`, `room deck.hotspots.netz_tab_start.use.1`, `room deck.hotspots.netz_tab_nagiwa.use.1`, … (5) |  |  |
| `netz_page` | `abzweiger`, `archiv`, `aufzug`, `automat`, `brett`, `flut`, `gezeiten`, `huelle`, … (26) | `room deck.hotspots.app_netz.use.2`, `room deck.hotspots.netz_tab_start.use.0`, `room deck.hotspots.netz_tab_nagiwa.use.0`, … (5) | `room deck.hotspots.netz_back_lull.if`, `room deck.hotspots.netz_back_rekordtief.if`, `room deck.hotspots.netz_back_huelle.if`, … (5) |  |
| `netz_read` | `2`, `3`, `4` | `room deck.hotspots.app_netz.use.4.then.0`, `room deck.hotspots.app_netz.use.5.then.0`, `room deck.hotspots.app_netz.use.6.then.0` | `room deck.hotspots.app_netz.use.4`, `room deck.hotspots.app_netz.use.5`, `room deck.hotspots.app_netz.use.6` |  |
| `news_stack` | `true` | `room kessel_14.hotspots.haldane.talk.0.else.0.then.0.then.7`, `room kessel_14.hotspots.haldane.use.0.then.7` | `room kessel_14.hotspots.haldane.talk.0.else.0.then.0`, `room kessel_14.hotspots.haldane.use.0`, `room kessel_14.hotspots.notes.look.0` |  |
| `news_who` | `true` | `actor haldane_feed.talk.0.then.4` | `room kessel_14.hotspots.notes.look.0`, `actor haldane_feed.talk.0` |  |
| `off_imai` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `room deck.hotspots.contact_imai.if`, `actor imai.talk.0` |  |
| `off_main` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `room cam03.hotspots.thumb_cam22.if`, `room cam03.hotspots.thumb_cam23.if`, `room cam03.hotspots.thumb_cam30.if`, … (5) |  |
| `off_motte` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `actor motte.talk.1` |  |
| `off_roof` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `room flat.hotspots.box_old.use.0`, `room kessel_14.hotspots.haken.if` |  |
| `off_tide` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `room cam03.hotspots.thumb_cam07.if`, `room cam03.hotspots.thumb_cam07v.if`, `room cam04.hotspots.thumb_cam07.if`, … (5) |  |
| `off_traeger` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `moment traeger_ruf.unseen.0`, `moment traeger.if` |  |
| `off_varga` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `room deck.hotspots.contact_varga.if`, `hints.11.if`, `hints.12.if`, … (5) |  |
| `off_vesper` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `room deck.hotspots.contact_vesper.if`, `room deck.hotspots.clip_anon_clip_kessler_ring.if`, `room deck.hotspots.clip_anon_clip_morrow_bribe.if`, … (4) |  |
| `off_zeitung` |  | `act kapitel1.start.28`, `act kapitel2.start.40` | `room kessel_14.hotspots.haldane.talk.0.else.0.then.0`, `room kessel_14.hotspots.haldane.use.0`, `room kessel_14.hotspots.corner_cam.use.0` |  |
| `p1` | `cut`, `full`, `nothing` | `room deck.hotspots.reply_kessler_full.use.1`, `room deck.hotspots.reply_kessler_cut.use.1`, `room deck.hotspots.reply_kessler_nothing.use.1`, … (5) | `room flat.hotspots.door.use.0`, `room flat.enter.3.then.0`, `room deck.hotspots.contact_sable.if`, … (5) | kapitel1 |
| `read_imai` | `true` | `room deck.hotspots.contact_imai.use.1.then.0` | `room deck.hotspots.contact_imai.use.1` |  |
| `read_kessler` | `true` | `room deck.hotspots.contact_kessler.use.1`, `act kapitel1.start.20`, `act kapitel2.start.34` | `hints.34.if`, `hints.75.if` |  |
| `read_kessler_again` | `true` | `room deck.hotspots.contact_kessler.use.2` |  |  |
| `read_tide` | `true` | `room deck.hotspots.contact_tide.use.1.then.0` | `room deck.hotspots.contact_tide.use.1` |  |
| `read_varga` | `true` | `room deck.hotspots.contact_varga.use.1.then.0` | `room deck.hotspots.contact_varga.use.1` |  |
| `read_vesper` | `true` | `room deck.hotspots.contact_vesper.use.1.then.0` | `room deck.hotspots.contact_vesper.use.1` |  |
| `read_wren` | `true` | `room deck.hotspots.contact_wren.use.1.then.0` | `room deck.hotspots.contact_wren.use.1`, `room deck.enter.1.else.0` |  |
| `rec_on` | `true` | `room cam03.hotspots.rec.use.1.then.0`, `room cam03.hotspots.rec.use.1.else.0`, `room cam03.enter.0`, … (5) | `room cam03.hotspots.rec.use.1`, `room cam04.hotspots.rec.use.1`, `room cam21.hotspots.rec.use.1`, … (5) |  |
| `rent` | `paid`, `teo` | `act kapitel2.start.2.then.1`, `moment rent_due.unseen.0.then.1`, `moment rent_due.unseen.0.else.1` | `moment teo_monday.unseen.16` | kapitel2 |
| `rent_notice` | `true` | `room kessel_lobby.hotspots.mailboxes.use.0.then.0`, `act kapitel1.start.22`, `act kapitel2.start.36` | `room kessel_lobby.hotspots.mailboxes.look.0`, `room kessel_lobby.hotspots.mailboxes.use.0`, `room kessel_lobby.hotspots.door.use.0`, … (5) |  |
| `saw_varga` | `true` | `room cam04.hotspots.rewind.use.5`, `act kapitel1.start.19`, `act kapitel2.start.33`, … (4) | `actor varga.look.1` |  |
| `soup_eaten` | `true` | `room flat.enter.1.then.6` | `room flat.hotspots.bed.use.0.else.0`, `hints.47.if`, `hints.88.if` |  |
| `stairs_down` | `true` | `room kessel_14.hotspots.stairs.use.1.then.0` | `room kessel_14.hotspots.stairs.use.1` |  |
| `stairs_up` | `true` | `room kessel_lobby.hotspots.stairs.use.0.then.0` | `room kessel_lobby.hotspots.stairs.use.0` |  |
| `stick_dryer` | `true` | `room laundromat.hotspots.dryer6.with.stick.0.then.2.else.0`, `dialog stick_zurueck.main.0.then.2.else.0`, `moment lantern_sat.play.4.then.1`, … (5) | `room laundromat.hotspots.dryer6.use.0.then.0.else.0`, `routine lantern.1.if`, `routine lantern.2.if`, … (5) |  |
| `stick_ines` | `true` | `room laundromat.hotspots.dryer6.with.stick.0.then.0`, `dialog stick.main.0.then.0.then.0`, `dialog stick.main.1.then.0.then.0`, … (4) | `room laundromat.hotspots.dryer6.use.0.then.0`, `room laundromat.hotspots.dryer6.use.0.else.0.then.0`, `room laundromat.hotspots.dryer6.with.stick.0`, … (5) | kapitel2 |
| `tag_ines` |  | `actor ines.talk.0.else.0.else.0`, `moment ines_meeting.play.0` | `actor ines.talk.0.else.0`, `hints.25.if`, `hints.66.if` |  |
| `tag_kessler` |  | `room cam03.hotspots.rewind.use.1`, `actor kessler.talk.0.else.0` | `actor kessler.look.1`, `actor kessler.talk.0`, `hints.36.if`, … (5) |  |
| `tag_kessler2` |  | `room cam03.hotspots.vending.use.0.then.5`, `actor kessler2.talk.0.else.0.else.5` |  |  |
| `tag_varga` |  | `actor varga.talk.0.else.0` | `actor varga.talk.0` |  |
| `teo_bowl` | `true` | `moment teo_visit.unseen.9`, `moment teo_visit.unseen.16` | `actor teo.poses.0.if` |  |
| `teo_up` | `true` | `moment teo_monday.unseen.26`, `moment teo_monday.unseen.40` | `room dach_sitzen.enter.0` |  |
| `traeger` | `filmed`, `girl`, `watched` | `dialog traeger_wahl.main.0.then.0`, `dialog traeger_wahl.main.1.then.0`, `dialog traeger_wahl.main.2.then.0` |  |  |
| `varga_step` | `1` | `room cam03.hotspots.vending.use.0.then.6`, `actor kessler2.talk.0.else.0.else.6` | `room cam03.hotspots.vending.use.0`, `room cam03.hotspots.thumb_cam15.if`, `room cam04.hotspots.thumb_cam15.if`, … (5) |  |
| `window_open` | `true` | `room flat.hotspots.window.with.ausweis.0.then.3`, `moment teo_monday.unseen.24` | `room flat.hotspots.window.use.0`, `room flat.hotspots.window.with.ausweis.0` | kapitel2 |
