#!/usr/bin/env sh
# The solver's runs, one list for tools/check.sh (which solves them) and tools/graph.sh (which traces them): both source it.
#
# Chapter 1's side stories are threads of their own: each is solved alone with the others shut (off_<thread>, game/stadt.js),
# since together they would multiply each other's states; and without job C's chain (off_main, the place known from the start),
# which they don't need. Each run writes how it ends to build/graph/kapitel1_<run>.js (tools/graph.mjs), for Chapter 2's starts.
THREADS="roof zeitung imai traeger varga tide motte vesper"
off() { r=""; [ "$1" = main ] || r=",off_main,know_meeting"; [ "$1" = motte ] && r="$r,moth_kind"; for t in $THREADS; do [ "$t" = "$1" ] || r="$r,off_$t"; done; echo "${r#,}"; }

# Chapter 2 across the chapter line (kapitel2-design §13.7, the engine's C15): each run begins from every way a run of Chapter 1
# ends, as Chapter 2 keeps it, narrowed to what the run is about: e1 (WREN sold or refused, and the rent and the money with it) and
# its own answer vary, the rest as Chapter 1 most often ends with those; Ines' stick is held back where the main way is shut, and
# where the run is about the stick only the ends with it in her bag count. One line a run: name|its flags (--set)|the run of Chapter 1
# it begins from|how its starts are narrowed.
# main: the main way with the threads shut and the way to Lantern shut (off_lantern); stick: the same with the stick from Chapter 1
# and Ines' flat shut and taken as done (off_flat, evi_knows: the stick doesn't touch it); lantern: that way alone, the dryer shut
# (off_dryer: the stick must reach him by hand), her flat and the forgery done (their steps would multiply every other state).
# The threads Chapter 1 hands on (§5), each alone with the main way shut (her flat taken as done: evi_knows): Varga (k1a: lied, sold,
# warned, none), the corner shop (k1b), Frau Imai's second part (§6.1, imai_told; without one it stays shut); and Chapter 2's own: the
# 24-hour shop (§6.5), Frau Haldane's son (§6.2), Teo and the pump hall (§6.6, teo_talk, which Monday's roof reads).
K2M="$(off main),off_shop24,off_haldane,off_teo"
K2T="off_roof,off_zeitung,off_imai,off_traeger,off_motte,off_vesper,off_lantern,off_klinik,off_main,evi_knows,off_teo,off_haldane"
K2_RUNS="main|$K2M,off_lantern|main|--vary e1 --hold stick_ines
stick|$K2M,off_lantern,off_flat,evi_knows|main|--vary e1 --only stick_ines
lantern|$K2M,off_main,off_dryer,evi_knows,forgery_proven|main|--vary e1 --only stick_ines
varga|$K2T,off_tide,off_shop24|varga|--vary e1,k1a --hold stick_ines
tide|$K2T,off_varga,off_shop24|tide|--vary e1,k1b --hold stick_ines
shop24|$K2T,off_varga,off_tide|main|--vary e1 --hold stick_ines
imai|$(echo "$K2T" | sed 's/off_imai,//'),off_varga,off_tide,off_shop24|imai|--vary e1,imai_told --hold stick_ines
haldane|$(echo "$K2T" | sed 's/,off_haldane//'),off_varga,off_tide,off_shop24|main|--vary e1 --hold stick_ines
teo|$(echo "$K2T" | sed 's/off_teo,//'),off_varga,off_tide,off_shop24|main|--vary e1,teo_talk --hold stick_ines"
K2_NAMES=$(echo "$K2_RUNS" | cut -d'|' -f1 | tr '\n' ' ')
# a run's field: k2 <name> set | from | starts
k2() { line=$(echo "$K2_RUNS" | grep "^$1|"); case "$2" in set) echo "$line" | cut -d'|' -f2 ;; from) echo "build/graph/kapitel1_$(echo "$line" | cut -d'|' -f3).js" ;; starts) echo "$line" | cut -d'|' -f4 ;; esac; }
