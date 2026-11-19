#!/usr/bin/env sh
# All the checks after a change: sh tools/check.sh [--fresh]. Prints one line each, FAILED at the end if any failed.
# The long runs (the solver's, the click paths) go through tools/cached.mjs: a run that passed before and reads nothing changed since
# says so at once ("from the cache"); after a change to the game they all run again (a few hours with Chapter 2). --fresh: all again.
# Chapter 1's side stories are threads of their own: each is solved alone with the others shut (off_<thread>, game/stadt.js),
# since together they would multiply each other's states; and without job C's chain (off_main, the place known from the start), which they don't need.
cd "$(dirname "$0")/.."
C="node tools/cached.mjs"; [ "$1" = --fresh ] && C="$C --fresh"
THREADS="roof zeitung imai traeger varga tide motte vesper"
failed=0
line() { printf '%-28s %s\n' "$1" "$2"; }
need() { case "$2" in *"$3"*) ;; *) failed=1; line "$1" "FAILED: $2" ;; esac; }

out=$(node lib/cutaway/tools/validate.mjs index.html 2>&1 | grep -E " errors?,| errors?$" | tail -1); line validate "$out"; need validate "$out" " 0 errors"
# the docs against the game: names it knows, values it sets, weekdays that fit their dates (tools/doc-lint.mjs)
out=$(node tools/doc-lint.mjs 2>&1 | tail -1); line docs "$out"; need docs "$out" " 0 Fehler"
# the prologue's way with the roof shut (off_roof, as in Chapter 1): open, the roof multiplies its states beyond what the solver can walk
out=$($C node tools/solve-act.mjs prolog --full --set off_roof 2>&1)
s=$(echo "$out" | grep -E "from the cache|states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "prologue solve" "$s"; need "prologue solve" "$s" "no soft-locks"; need "prologue solve" "$s" "every state on the way"
# the prologue goes on into Chapter 1: alone (--act) it ends where it would go on; its way is the solver's (the roof open, play.mjs
# alone would search past its limit)
out=$($C node lib/cutaway/tools/play.mjs index.html --act prolog --path tools/paths/prolog.json 2>&1 | tail -1); line "prologue clicks" "$out"; need "prologue clicks" "$out" "all passed"
out=$($C node lib/cutaway/tools/play.mjs index.html --act prolog --path tools/paths/prolog_dach.json 2>&1 | tail -1); line "clicks: prolog_dach" "$out"; need "clicks: prolog_dach" "$out" "all passed"
# the whole game as it is played: from the title's new game through the prologue and Chapter 1 into Chapter 2 and to its end
out=$($C node lib/cutaway/tools/play.mjs index.html --path tools/paths/spiel.json 2>&1 | tail -1); line "clicks: spiel" "$out"; need "clicks: spiel" "$out" "all passed"

off() { r=""; [ "$1" = main ] || r=",off_main,know_meeting"; [ "$1" = motte ] && r="$r,moth_kind"; for t in $THREADS; do [ "$t" = "$1" ] || r="$r,off_$t"; done; echo "${r#,}"; }
for t in main $THREADS; do
  out=$($C node tools/solve-act.mjs kapitel1 --full --set "$(off "$t")" 2>&1)
  s=$(echo "$out" | grep -E "from the cache|states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel1 solve: $t" "$s"; need "kapitel1 solve: $t" "$s" "no soft-locks"; need "kapitel1 solve: $t" "$s" "every state on the way"
done
for p in tools/paths/kapitel1_*.json; do
  n=$(basename "$p" .json); out=$($C node lib/cutaway/tools/play.mjs index.html --act kapitel1 --path "$p" 2>&1 | tail -1); line "clicks: $n" "$out"; need "clicks: $n" "$out" "all passed"
done
# Chapter 2 on blocks (kapitel2-design): its main way, the threads shut as in Chapter 1 (its own threads come later); once as the plain
# way hands it on, once with Ines' stick still in Juno's bag (stick_ines from Chapter 1), both with the way to Lantern shut (off_lantern),
# the second with Ines' flat shut and taken as done (off_flat, evi_knows: the stick doesn't touch it, and what joins them, the clock at
# 00:45, the first checks);
# and that way alone, Juno with the stick and the dryer shut (off_dryer: it must reach him by hand), her flat and the forgery done (its
# steps would multiply every other state)
for v in main stick lantern; do
  r="$(off main),off_shop24,off_haldane"; [ "$v" = main ] && r="$r,off_lantern"; [ "$v" = stick ] && r="$r,off_lantern,off_flat,evi_knows,stick_ines"; [ "$v" = lantern ] && r="$r,off_main,stick_ines,off_dryer,evi_knows,forgery_proven"
  out=$($C node tools/solve-act.mjs kapitel2 --full --set "$r" 2>&1)
  s=$(echo "$out" | grep -E "from the cache|states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel2 solve: $v" "$s"; need "kapitel2 solve: $v" "$s" "no soft-locks"; need "kapitel2 solve: $v" "$s" "every state on the way"
done
# Chapter 2's threads that Chapter 1 hands on (kapitel2-design §5): each alone with the main way shut (its flat taken as done: evi_knows),
# once for each answer of Chapter 1 that changes what happens (Varga: lied, sold, none; the corner shop: sold, lied, warned, none);
# and Chapter 2's own, the 24-hour shop (§6.5, off_shop24), alone with both of those shut (the robbery only changes a look there)
k2t="off_roof,off_zeitung,off_imai,off_traeger,off_motte,off_vesper,off_lantern,off_klinik,off_main,evi_knows,off_haldane"
for v in "off_tide,off_shop24,k1a=lied" "off_tide,off_shop24,k1a=sold" "off_tide,off_shop24" "off_varga,off_shop24,k1b=sold" "off_varga,off_shop24,k1b=lied" "off_varga,off_shop24,k1b=warned" "off_varga,off_shop24" "off_varga,off_tide"; do
  out=$($C node tools/solve-act.mjs kapitel2 --full --set "$k2t,$v" 2>&1)
  s=$(echo "$out" | grep -E "from the cache|states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel2 solve: $v" "$s"; need "kapitel2 solve: $v" "$s" "no soft-locks"; need "kapitel2 solve: $v" "$s" "every state on the way"
done
# Frau Imai's second part (§6.1, off_imai): alone with the others shut, once for each answer she had in Chapter 1 (without one it stays shut)
k2i=$(echo "$k2t" | sed 's/off_imai,//')
for v in "imai_told=truth" "imai_told=dream"; do
  out=$($C node tools/solve-act.mjs kapitel2 --full --set "$k2i,off_varga,off_tide,off_shop24,$v" 2>&1)
  s=$(echo "$out" | grep -E "from the cache|states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel2 solve: $v" "$s"; need "kapitel2 solve: $v" "$s" "no soft-locks"; need "kapitel2 solve: $v" "$s" "every state on the way"
done
# Frau Haldane's son (§6.2, off_haldane): alone with the others shut (Chapter 1 hands it nothing but the money and Kessler's ring)
k2h=$(echo "$k2t" | sed 's/,off_haldane//')
out=$($C node tools/solve-act.mjs kapitel2 --full --set "$k2h,off_varga,off_tide,off_shop24" 2>&1)
s=$(echo "$out" | grep -E "from the cache|states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel2 solve: haldane" "$s"; need "kapitel2 solve: haldane" "$s" "no soft-locks"; need "kapitel2 solve: haldane" "$s" "every state on the way"
for p in tools/paths/kapitel2_*.json; do
  n=$(basename "$p" .json); out=$($C node lib/cutaway/tools/play.mjs index.html --act kapitel2 --path "$p" 2>&1 | tail -1); line "clicks: $n" "$out"; need "clicks: $n" "$out" "all passed"
done
out=$($C node lib/cutaway/tools/play.mjs index.html --act prolog --touch --path tools/paths/prolog.json 2>&1 | tail -1); line "prologue taps" "$out"; need "prologue taps" "$out" "all passed"
out=$($C node lib/cutaway/tools/play.mjs index.html --act kapitel1 --touch --path tools/paths/kapitel1_main.json 2>&1 | tail -1); line "taps: kapitel1_main" "$out"; need "taps: kapitel1_main" "$out" "all passed"
out=$($C node tools/check-hover.mjs 2>&1 | tail -1); line "the pointer turns hot" "$out"; need "the pointer turns hot" "$out" "all passed"
[ "$failed" = 0 ] && echo "ALL PASSED" || { echo "FAILED"; exit 1; }
