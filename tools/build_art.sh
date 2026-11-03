#!/usr/bin/env sh
# Build the pxl art and pack it into atlas scripts the game loads (assets/<group>.js).
# Usage: sh tools/build_art.sh          (everything)
#        sh tools/build_art.sh test     (phase H0's test street: art/test/street.px.js -> assets/test.js)
#        sh tools/build_art.sh characters (Juno and the feed people: art/characters/{juno,feed_people}.px.js
#                                          -> assets/characters.js)
#        sh tools/build_art.sh ui       (the feed's zoom windows: art/ui/zooms.px.js -> assets/ui.js)
#        sh tools/build_art.sh cams     (the feed cameras: art/cams/*.px.js -> assets/cams.js; review_* stay out)
# The raw pxl output goes to build/art/ (not checked in); assets/*.js are checked in, so the game
# runs without Node.
set -e
cd "$(dirname "$0")/.."
PXL="node .claude/skills/claude-pxl/bin/pxl.js"
ATLAS="node lib/cutaway/tools/build-atlas.mjs"
mkdir -p assets build/art

test_art() {
    rm -rf build/art/test
    $PXL build art/test/street.px.js --out build/art/test --no-preview | tail -n 1
    $ATLAS build/art/test assets/test.js --only "street_*,juno_*"
}

characters() {
    rm -rf build/art/characters
    $PXL build art/characters/juno.px.js --out build/art/characters --no-preview | tail -n 1
    $PXL build art/characters/feed_people.px.js --out build/art/characters --no-preview | tail -n 1
    # build-atlas's --only matches exact names or a trailing *, so the feed people go by prefix
    $ATLAS build/art/characters assets/characters.js --only "juno_*,kessler_*,varga_*,commuter_*,yuen_*"
}

ui() {
    rm -rf build/art/ui
    $PXL build art/ui/zooms.px.js --out build/art/ui --no-preview | tail -n 1
    $ATLAS build/art/ui assets/ui.js --only "zoom_*"
}

cams() {
    rm -rf build/art/cams
    for f in art/cams/*.px.js; do
        $PXL build "$f" --out build/art/cams --no-preview | tail -n 1
    done
    $ATLAS build/art/cams assets/cams.js --only "cam*"
}

case "${1:-all}" in
    test) test_art ;;
    characters) characters ;;
    cams) cams ;;
    ui) ui ;;
    all) test_art; characters; cams; ui ;;
    *) echo "unknown group: $1"; exit 2 ;;
esac
