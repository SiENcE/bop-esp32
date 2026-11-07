#!/usr/bin/env sh
# All the checks after a change (about ten minutes): sh tools/check.sh. Prints one line each, FAILED at the end if any failed.
# Chapter 1's side stories are threads of their own: each is solved alone with the others shut (off_<thread>, game/stadt.js),
# since together they would multiply each other's states; and without job C's chain (off_main, the place known from the start), which they don't need.
cd "$(dirname "$0")/.."
THREADS="roof zeitung imai traeger varga tide motte vesper"
failed=0
line() { printf '%-28s %s\n' "$1" "$2"; }
need() { case "$2" in *"$3"*) ;; *) failed=1; line "$1" "FAILED: $2" ;; esac; }

out=$(node lib/cutaway/tools/validate.mjs index.html 2>&1 | tail -1); line validate "$out"; need validate "$out" " 0 errors"
# the prologue's way with the roof shut (off_roof, as in Chapter 1): open, the roof multiplies its states beyond what the solver can walk
out=$(node tools/solve-act.mjs prolog --full --set off_roof 2>&1)
s=$(echo "$out" | grep -E "states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "prologue solve" "$s"; need "prologue solve" "$s" "no soft-locks"; need "prologue solve" "$s" "every state on the way"
out=$(node lib/cutaway/tools/play.mjs index.html 2>&1 | tail -1); line "prologue clicks" "$out"; need "prologue clicks" "$out" "all passed"
out=$(node lib/cutaway/tools/play.mjs index.html --path tools/paths/prolog_dach.json 2>&1 | tail -1); line "clicks: prolog_dach" "$out"; need "clicks: prolog_dach" "$out" "all passed"

off() { r=""; [ "$1" = main ] || r=",off_main,know_meeting"; [ "$1" = motte ] && r="$r,moth_kind"; for t in $THREADS; do [ "$t" = "$1" ] || r="$r,off_$t"; done; echo "${r#,}"; }
for t in main $THREADS; do
  out=$(node tools/solve-act.mjs kapitel1 --full --set "$(off "$t")" 2>&1)
  s=$(echo "$out" | grep -E "states in|soft-lock|SOFT|HINTS|^hints|UNSOLV" | tr '\n' ' '); line "kapitel1 solve: $t" "$s"; need "kapitel1 solve: $t" "$s" "no soft-locks"; need "kapitel1 solve: $t" "$s" "every state on the way"
done
for p in tools/paths/kapitel1_*.json; do
  n=$(basename "$p" .json); out=$(node lib/cutaway/tools/play.mjs index.html --act kapitel1 --path "$p" 2>&1 | tail -1); line "clicks: $n" "$out"; need "clicks: $n" "$out" "all passed"
done
out=$(node lib/cutaway/tools/play.mjs index.html --touch 2>&1 | tail -1); line "prologue taps" "$out"; need "prologue taps" "$out" "all passed"
out=$(node lib/cutaway/tools/play.mjs index.html --act kapitel1 --touch --path tools/paths/kapitel1_main.json 2>&1 | tail -1); line "taps: kapitel1_main" "$out"; need "taps: kapitel1_main" "$out" "all passed"
out=$(node tools/check-hover.mjs 2>&1 | tail -1); line "the pointer turns hot" "$out"; need "the pointer turns hot" "$out" "all passed"
[ "$failed" = 0 ] && echo "ALL PASSED" || { echo "FAILED"; exit 1; }
