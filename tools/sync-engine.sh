#!/usr/bin/env sh
# Copy the engine (Cutaway.js) into lib/cutaway/: its runtime (src/) and the Node tools the game uses
# (validate, solve, play, build-atlas, cutout, shot, render-music, studio, check_pixels, music-lab).
# Never edit lib/cutaway/ here: fix the engine in its own repo, then sync again.
# Usage: sh tools/sync-engine.sh [path to the engine repo, default ../cutaway]
set -e
cd "$(dirname "$0")/.."
ENGINE="${1:-../cutaway}"  # on Windows give a drive path (B:/Github_my/cutaway): node reads it
[ -f "$ENGINE/src/core.js" ] || { echo "no engine at $ENGINE"; exit 1; }
rm -rf lib/cutaway
mkdir -p lib/cutaway/tools/lib
cp -r "$ENGINE"/src/. lib/cutaway/
cp "$ENGINE/LICENSE" lib/cutaway/LICENSE
for t in validate solve play build-atlas cutout shot render-music studio; do cp "$ENGINE/tools/$t.mjs" lib/cutaway/tools/; done
cp "$ENGINE/tools/check_pixels.py" "$ENGINE/tools/plot_audio.py" "$ENGINE/tools/music-lab.html" lib/cutaway/tools/
cp "$ENGINE"/tools/lib/*.mjs lib/cutaway/tools/lib/
version=$(node -p "require('$ENGINE/package.json').version")
commit=$(git -C "$ENGINE" rev-parse --short HEAD 2>/dev/null || echo "none")
dirty=$(git -C "$ENGINE" status --porcelain 2>/dev/null | grep -q . && echo " (with uncommitted changes)" || true)
printf 'Cutaway.js %s, commit %s%s, synced %s\n' "$version" "$commit" "$dirty" "$(date +%Y-%m-%d)" > lib/cutaway/VERSION.txt
cat lib/cutaway/VERSION.txt
