#!/usr/bin/env sh
# All the checks after a change: sh tools/check.sh [--fresh]. Prints one line each, FAILED at the end if any failed.
# The long runs (the solver's, the click paths) go through tools/cached.mjs: a run that passed before and reads nothing changed since
# says so at once ("from the cache"); after a change to the game they all run again (a few hours with Chapter 2). --fresh: all again.
# The solver's runs of Chapter 1 and Chapter 2 and what they are about: tools/runs.sh (tools/graph.sh traces the same).
cd "$(dirname "$0")/.."
C="node tools/cached.mjs"; [ "$1" = --fresh ] && C="$C --fresh"
. tools/runs.sh
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

# Chapter 1's runs traced (tools/graph.mjs says what the solver says), so that Chapter 2's runs can begin from how they end
for t in main $THREADS; do
  out=$($C node lib/cutaway/tools/graph.mjs index.html --act kapitel1 --set "$(off "$t")" --out "build/graph/kapitel1_$t.js" 2>&1)
  s=$(echo "$out" | grep -E "from the cache|states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel1 solve: $t" "$s"; need "kapitel1 solve: $t" "$s" "no soft-locks"; need "kapitel1 solve: $t" "$s" "every state on the way"
done
for p in tools/paths/kapitel1_*.json; do
  n=$(basename "$p" .json); out=$($C node lib/cutaway/tools/play.mjs index.html --act kapitel1 --path "$p" 2>&1 | tail -1); line "clicks: $n" "$out"; need "clicks: $n" "$out" "all passed"
done
# Chapter 2's runs, each from every way its run of Chapter 1 ends (tools/runs.sh): every start must be won
for v in $K2_NAMES; do
  out=$($C node tools/solve-act.mjs kapitel2 --full --set "$(k2 "$v" set)" --from "$(k2 "$v" from)" $(k2 "$v" starts) 2>&1)
  s=$(echo "$out" | grep -E "from the cache|states in|starts:|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel2 solve: $v" "$s"; need "kapitel2 solve: $v" "$s" "every one can be won"; need "kapitel2 solve: $v" "$s" "no soft-locks"; need "kapitel2 solve: $v" "$s" "every state on the way"
done
for p in tools/paths/kapitel2_*.json; do
  n=$(basename "$p" .json); out=$($C node lib/cutaway/tools/play.mjs index.html --act kapitel2 --path "$p" 2>&1 | tail -1); line "clicks: $n" "$out"; need "clicks: $n" "$out" "all passed"
done
# Chapter 3 (being built, docs/PLAN.md H6): its frame alone from its own start, until its runs begin from Chapter 2's ends (H6.12)
out=$($C node tools/solve-act.mjs kapitel3 --full --set off_roof,off_zeitung,off_imai,off_traeger,off_varga,off_tide,off_motte,off_vesper,off_shop24,off_haldane,off_teo,off_lantern 2>&1)
s=$(echo "$out" | grep -E "from the cache|states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel3 solve: main" "$s"; need "kapitel3 solve: main" "$s" "no soft-locks"; need "kapitel3 solve: main" "$s" "every state on the way"
for p in tools/paths/kapitel3_*.json; do
  n=$(basename "$p" .json); out=$($C node lib/cutaway/tools/play.mjs index.html --act kapitel3 --path "$p" 2>&1 | tail -1); line "clicks: $n" "$out"; need "clicks: $n" "$out" "all passed"
done
out=$($C node lib/cutaway/tools/play.mjs index.html --act prolog --touch --path tools/paths/prolog.json 2>&1 | tail -1); line "prologue taps" "$out"; need "prologue taps" "$out" "all passed"
out=$($C node lib/cutaway/tools/play.mjs index.html --act kapitel1 --touch --path tools/paths/kapitel1_main.json 2>&1 | tail -1); line "taps: kapitel1_main" "$out"; need "taps: kapitel1_main" "$out" "all passed"
out=$($C node tools/check-hover.mjs 2>&1 | tail -1); line "the pointer turns hot" "$out"; need "the pointer turns hot" "$out" "all passed"
[ "$failed" = 0 ] && echo "ALL PASSED" || { echo "FAILED"; exit 1; }
