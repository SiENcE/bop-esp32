#!/usr/bin/env sh
# Build the pxl art and pack it into atlas scripts the game loads (assets/<group>.js).
# Usage: sh tools/build_art.sh          (everything)
#        sh tools/build_art.sh test     (phase H0's test street: art/test/street.px.js -> assets/test.js)
#        sh tools/build_art.sh characters (Juno and the feed people: art/characters/{juno,feed_people}.px.js
#                                          -> assets/characters.js)
#        sh tools/build_art.sh ui       (the feed's zoom windows and the interface's sprites: art/ui/zooms.px.js,
#                                         art/ui/hud.px.js -> assets/ui.js)
#        sh tools/build_art.sh title    (the title screen: the logo, art/ui/logo.px.js, and the street behind it,
#                                         art/ui/title_bg.px.js (for now the mockup's street) -> assets/title.js)
#        sh tools/build_art.sh cams     (the feed cameras: art/cams/*.px.js -> assets/cams.js; review_* stay out)
#        sh tools/build_art.sh room flat (a street-mode room: art/rooms/flat.px.js -> assets/room_flat.js, its
#                                         flat_* assets only; art/rooms/flat_review.px.js is not built)
#        sh tools/build_art.sh rooms    (every room in art/rooms/, *_review.px.js left out)
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
    $PXL build art/ui/hud.px.js --out build/art/ui --no-preview | tail -n 1
    $ATLAS build/art/ui assets/ui.js --only "zoom_*,ui_*"
}

title() {
    rm -rf build/art/title
    $PXL build art/ui/logo.px.js --out build/art/title --no-preview | tail -n 1
    $PXL build art/ui/title_bg.px.js --out build/art/title --no-preview | tail -n 1
    $ATLAS build/art/title assets/title.js --only "title_logo,title_bg"
}

cams() {
    rm -rf build/art/cams
    for f in art/cams/*.px.js; do
        $PXL build "$f" --out build/art/cams --no-preview | tail -n 1
    done
    $ATLAS build/art/cams assets/cams.js --only "cam*"
}

room() {
    id="$1"
    if [ -z "$id" ] || [ ! -f "art/rooms/$id.px.js" ]; then echo "usage: sh tools/build_art.sh room <id> (art/rooms/<id>.px.js)"; exit 2; fi
    rm -rf "build/art/rooms/$id"
    $PXL build "art/rooms/$id.px.js" --out "build/art/rooms/$id" --no-preview | tail -n 1
    $ATLAS "build/art/rooms/$id" "assets/room_$id.js" --only "${id}_*"
}

rooms() {
    for f in art/rooms/*.px.js; do
        case "$f" in *_review.px.js) continue ;; esac
        room "$(basename "$f" .px.js)"
    done
}

case "${1:-all}" in
    test) test_art ;;
    characters) characters ;;
    cams) cams ;;
    ui) ui ;;
    title) title ;;
    room) room "$2" ;;
    rooms) rooms ;;
    all) test_art; characters; cams; ui; title; rooms ;;
    *) echo "unknown group: $1"; exit 2 ;;
esac
