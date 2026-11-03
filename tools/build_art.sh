#!/usr/bin/env sh
# Build the pxl art and pack it into atlas scripts the game loads (assets/<group>.js).
# Usage: sh tools/build_art.sh          (everything)
#        sh tools/build_art.sh test     (phase H0's test street: art/test/street.px.js -> assets/test.js)
#        sh tools/build_art.sh characters (Juno: art/characters/juno.px.js -> assets/characters.js)
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
    $ATLAS build/art/characters assets/characters.js --only "juno_*"
}

case "${1:-all}" in
    test) test_art ;;
    characters) characters ;;
    all) test_art; characters ;;
    *) echo "unknown group: $1"; exit 2 ;;
esac
