#!/usr/bin/env sh
# The game's connections, to look at (the engine's tools/graph.mjs and graph.html): every state searched as in
# the checks, every move watched (what it needs, what it brings about), and the state budget. One data file per
# act and per thread into build/graph/, as check.sh solves them (each of Chapter 1's threads alone, the others shut).
#   sh tools/graph.sh [prolog | main | <thread> | kapitel2 | all]...   (no argument: the prologue and Chapter 1's main thread; all: every run
#   the checks make, which the hand-over check (tools/handoff.sh) needs; kapitel2: Chapter 2's main way, so far its frame, the threads shut as in Chapter 1)
# Prints a link to open for each; the viewer runs from file://.
cd "$(dirname "$0")/.."
THREADS="roof zeitung imai traeger varga tide motte vesper"
off() { r=""; [ "$1" = main ] || r=",off_main,know_meeting"; [ "$1" = motte ] && r="$r,moth_kind"; for t in $THREADS; do [ "$t" = "$1" ] || r="$r,off_$t"; done; echo "${r#,}"; }
mkdir -p build/graph
list="${*:-prolog main}"; [ "$list" = all ] && list="prolog main $THREADS kapitel2"
for what in $list; do
  if [ "$what" = prolog ]; then
    node lib/cutaway/tools/graph.mjs index.html --act prolog --set off_roof --out build/graph/prolog.js | grep -E "states in|soft-lock|SOFT|HINTS|hints:|^wrote|^open"
  elif [ "$what" = kapitel2 ]; then
    node lib/cutaway/tools/graph.mjs index.html --act kapitel2 --set "$(off main)" --out build/graph/kapitel2_main.js | grep -E "states in|soft-lock|SOFT|HINTS|hints:|^wrote|^open"
  else
    node lib/cutaway/tools/graph.mjs index.html --act kapitel1 --set "$(off "$what")" --out "build/graph/kapitel1_$what.js" | grep -E "states in|soft-lock|SOFT|HINTS|hints:|^wrote|^open"
  fi
done
