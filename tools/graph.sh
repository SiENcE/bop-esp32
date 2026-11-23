#!/usr/bin/env sh
# The game's connections, to look at (the engine's tools/graph.mjs and graph.html): every state searched as in
# the checks, every move watched (what it needs, what it brings about), and the state budget. One data file per
# act and per run into build/graph/, the runs as check.sh solves them (tools/runs.sh: each of Chapter 1's threads alone, the others
# shut; each of Chapter 2's runs from every way its run of Chapter 1 ends, so that run's file must be there first).
#   sh tools/graph.sh [prolog | main | <thread> | kapitel2_<run> | kapitel2 | all]...   (no argument: the prologue and Chapter 1's main
#   thread; kapitel2: kapitel2_main; all: every run the checks make, in order, which the hand-over check (tools/handoff.sh) needs)
# Prints a link to open for each; the viewer runs from file://.
cd "$(dirname "$0")/.."
. tools/runs.sh
mkdir -p build/graph
list="${*:-prolog main}"
[ "$list" = all ] && list="prolog main $THREADS $(for v in $K2_NAMES; do printf 'kapitel2_%s ' "$v"; done)"
for what in $list; do
  [ "$what" = kapitel2 ] && what=kapitel2_main
  if [ "$what" = prolog ]; then
    node lib/cutaway/tools/graph.mjs index.html --act prolog --set off_roof --out build/graph/prolog.js | grep -E "states in|soft-lock|SOFT|HINTS|hints:|^wrote|^open"
  else case "$what" in
    kapitel2_*)
      v=${what#kapitel2_}
      # shellcheck disable=SC2046
      node lib/cutaway/tools/graph.mjs index.html --act kapitel2 --set "$(k2 "$v" set)" --from "$(k2 "$v" from)" $(k2 "$v" starts) --out "build/graph/$what.js" | grep -E "starts? from|states in|starts:|soft-lock|SOFT|HINTS|hints:|^wrote|^open" ;;
    *)
      node lib/cutaway/tools/graph.mjs index.html --act kapitel1 --set "$(off "$what")" --out "build/graph/kapitel1_$what.js" | grep -E "states in|soft-lock|SOFT|HINTS|hints:|^wrote|^open" ;;
  esac; fi
done
