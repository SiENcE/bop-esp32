#!/usr/bin/env sh
# The hand-over between the acts (the engine's tools/handoff.mjs): every run the checks make, traced (tools/graph.sh all),
# then put together by act: what an act reads that the one before sets but it doesn't keep, what it keeps for nothing, what it
# sets for later that the next act doesn't keep, what one thread reads that only another sets, and how many ways an act hands on.
#   sh tools/handoff.sh          (the graph runs take as long as the solver's checks)
#   sh tools/handoff.sh --only   (only put together what is already in build/graph)
# The studio shows the same in its tab Handoffs.
cd "$(dirname "$0")/.."
[ "$1" = --only ] || sh tools/graph.sh all
node lib/cutaway/tools/handoff.mjs build/graph --page index.html
