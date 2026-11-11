#!/usr/bin/env sh
# Build the pxl art and pack it into atlas scripts the game loads (assets/<group>.js).
# Usage: sh tools/build_art.sh          (everything)
#        sh tools/build_art.sh test     (phase H0's test street: art/test/street.px.js -> assets/test.js)
#        sh tools/build_art.sh characters (Juno, Motte, the feed people and the city's: art/characters/*.px.js, Juno and the
#                                          Drain Market's people from above with their anchor in the middle -> assets/characters.js)
#        sh tools/build_art.sh ui       (the feed's zoom windows, street mode's close-ups and the interface's sprites:
#                                         art/ui/zooms.px.js, art/ui/looks.px.js, art/ui/hud.px.js -> assets/ui.js)
#        sh tools/build_art.sh title    (the title screen, art/ui/splash.px.js; the menu screen's logo, art/ui/logo.px.js,
#                                         and the street behind it, art/ui/title_bg.px.js -> assets/title.js)
#        sh tools/build_art.sh deck     (the deck: icons and EVI, art/ui/deck.px.js; the old photo and the wallpaper,
#                                         art/ui/deck_wallpaper.px.js -> assets/deck.js)
#        sh tools/build_art.sh intro    (the intro "Die letzte Schicht": art/intro/*.px.js -> assets/intro.js)
#        sh tools/build_art.sh cams     (the feed cameras: art/cams/*.px.js -> assets/cams.js; review_* stay out)
#        sh tools/build_art.sh mock     (the blocks of what is not painted yet: art/mock/*.px.js -> assets/mock.js)
#        sh tools/build_art.sh room flat (a street-mode room: art/rooms/flat.px.js -> assets/room_flat.js, its
#                                         flat_* assets only; art/rooms/flat_review.px.js is not built; a room
#                                         baked from a map, art/rooms/flat.map.js, prints its measured layout,
#                                         written to game/rooms/flat.layout.js by tools/iso-layout.mjs)
#        sh tools/build_art.sh rooms    (every room in art/rooms/, *_review.px.js left out)
#        (room kowalski and rooms build the title too: the menu's backdrop is that street, from the same map and kit)
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
    $PXL build art/characters/juno.px.js --out build/art/characters --no-preview | tail -n 1    # 50 px (H1c)
    $PXL build art/characters/feed_people.px.js --out build/art/characters --no-preview | tail -n 1
    $PXL build art/characters/motte.px.js --out build/art/characters --no-preview | tail -n 1        # Motte (H3)
    $PXL build art/characters/bao.px.js --out build/art/characters --no-preview | tail -n 1          # Bao (H3)
    $PXL build art/characters/drone.px.js --out build/art/characters --no-preview | tail -n 1        # the patrol drone (the title)
    $PXL build art/characters/stadt_people.px.js --out build/art/characters --no-preview | tail -n 1 # the city's four (Chapter 1)
    $PXL build art/characters/lucky_people.px.js --out build/art/characters --no-preview | tail -n 1 # LUCKY STATIC's: Mei and the regulars (Chapter 1)
    $PXL build art/characters/okonkwo.px.js --out build/art/characters --no-preview | tail -n 1      # Okonkwo, job B (Chapter 1)
    $PXL build art/characters/tide_people.px.js --out build/art/characters --no-preview | tail -n 1  # Morrow, the Tidewater boy, Ratz, the patrol car (job B)
    $PXL build art/characters/sable.px.js --out build/art/characters --no-preview | tail -n 1        # Sable, behind the desk in the booth (job A)
    $PXL build art/characters/juno_top.px.js --out build/art/characters --no-preview | tail -n 1     # Juno from above (the Drain Market)
    $PXL build art/characters/markt_people.px.js --out build/art/characters --no-preview | tail -n 1 # the Drain Market's people from above
    # Ines's handover reaches past her on one side: its anchor keeps her feet where her other sprites have them (15 wide, 22 high)
    echo '{"anchor":[7,22]}' > build/art/characters/anims/ines_feed_give.anchor.json
    # seen from above the ground point is under the figure, in the middle of its frame, not at its foot
    node -e 'const fs=require("fs"),d=process.argv[1];for(const f of fs.readdirSync(d)){const m=/^((?:juno|ratz|prediger|haendler)_top_.*|statist_.*)\.json$/.exec(f);if(!m)continue;const s=Object.values(JSON.parse(fs.readFileSync(d+"/"+f,"utf8")).frames)[0].sourceSize;fs.writeFileSync(d+"/"+m[1]+".anchor.json",JSON.stringify({anchor:[s.w>>1,s.h>>1]}))}' build/art/characters/anims
    # build-atlas's --only matches exact names or a trailing *, so the feed people go by prefix
    $ATLAS build/art/characters assets/characters.js --only "juno_*,kessler_*,varga_*,commuter_*,yuen_*,ines_*,lantern_*,ashe_*,motte_*,bao_*,drone_*,regen_*,imai_*,prediger_*,monteur_*,mei_*,stamm_*,okonkwo_*,morrow_*,tideboy_*,ratz_*,streife_*,sable_*,haendler_top_*,statist_*"
}

ui() {
    rm -rf build/art/ui
    $PXL build art/ui/zooms.px.js --out build/art/ui --no-preview | tail -n 1
    $PXL build art/ui/hud.px.js --out build/art/ui --no-preview | tail -n 1
    $PXL build art/ui/looks.px.js --out build/art/ui --no-preview | tail -n 1
    $ATLAS build/art/ui assets/ui.js --only "zoom_*,ui_*,look_*"
}

title() {
    rm -rf build/art/title
    $PXL build art/ui/splash.px.js --out build/art/title --no-preview | tail -n 1
    $PXL build art/ui/logo.px.js --out build/art/title --no-preview | tail -n 1
    # the menu screen's backdrop: Kowalski Street whole, baked tall and brought down to 320x180
    $PXL build art/ui/title_bg.px.js --out build/art/title --no-preview | tail -n 1
    node tools/title-backdrop.mjs build/art/title/anims
    $ATLAS build/art/title assets/title.js --only "splash_bg,title_logo,title_bg"
}

deck() {
    rm -rf build/art/deck
    $PXL build art/ui/deck.px.js --out build/art/deck --no-preview | tail -n 1
    $PXL build art/ui/deck_wallpaper.px.js --out build/art/deck --no-preview | tail -n 1
    $ATLAS build/art/deck assets/deck.js --only "deck_*,evi_*"
}

intro() {
    rm -rf build/art/intro_game
    for f in art/intro/*.px.js; do
        $PXL build "$f" --out build/art/intro_game --no-preview | tail -n 1
    done
    $ATLAS build/art/intro_game assets/intro.js --only "intro_*"
}

cams() {
    rm -rf build/art/cams
    for f in art/cams/*.px.js; do
        $PXL build "$f" --out build/art/cams --no-preview | tail -n 1
    done
    $ATLAS build/art/cams assets/cams.js --only "cam*"
}

mock() {
    rm -rf build/art/mock
    for f in art/mock/*.px.js; do
        $PXL build "$f" --out build/art/mock --no-preview | tail -n 1
    done
    # the roof of today comes from the old photo's code
    $PXL build art/ui/deck_wallpaper.px.js --only dach_bg,dach_heute --out build/art/mock --no-preview | tail -n 1
    $ATLAS build/art/mock assets/mock.js --only "cam*,gasse_*,laundromat_*,lucky_*,drain_*,sable_*,sims_*,dach_*,jade_*,okonkwo_*,mock_*,look_*,inv_*,zoom_keypad"
}

room() {
    id="$1"
    if [ -z "$id" ] || [ ! -f "art/rooms/$id.px.js" ]; then echo "usage: sh tools/build_art.sh room <id> (art/rooms/<id>.px.js)"; exit 2; fi
    rm -rf "build/art/rooms/$id"
    $PXL build "art/rooms/$id.px.js" --out "build/art/rooms/$id" --no-preview > "build/art/rooms/$id.log"
    tail -n 1 "build/art/rooms/$id.log"
    if grep -q "^ISO_LAYOUT " "build/art/rooms/$id.log"; then
        node tools/iso-layout.mjs "$id" --stdin --out "game/rooms/$id.layout.js" < "build/art/rooms/$id.log"
    fi
    # where each pixel comes from (the editor's Iso tab asks): scratch, not checked in
    grep "^ISO_PICK " "build/art/rooms/$id.log" | cut -c10- > "build/art/rooms/$id.pick.json" || true
    # the parts a painted room lays over its picture, as the game places them (a line PARTS {json} in the log)
    if grep -q "^PARTS " "build/art/rooms/$id.log"; then
        grep "^PARTS " "build/art/rooms/$id.log" | cut -c7- > "art/rooms/$id.parts.json"
        # ... and as a script the game loads (no fetch): game/rooms/<id>.parts.js (the Drain Market's go into its layout, below)
        if [ "$id" != drain_market ]; then node tools/room-parts.mjs "$id"; fi
    fi
    # the Drain Market from above is painted, not baked: its numbers come from its approved layout and these parts
    if [ "$id" = drain_market ]; then node tools/market-layout.mjs --out game/rooms/drain_market.layout.js; fi
    # pages are 1024 px unless a still picture is wider (the Drain Market from above is 1280x720; animations go frame by frame)
    max=$(node -e 'const fs=require("fs"),p=require("path");let m=0;const w=(d)=>{for(const f of fs.readdirSync(d)){const q=p.join(d,f);if(fs.statSync(q).isDirectory())w(q);else if(f.endsWith(".png")){const b=fs.readFileSync(q);m=Math.max(m,b.readUInt32BE(16),b.readUInt32BE(20))}}};if(fs.existsSync(process.argv[1]))w(process.argv[1]);console.log(m>1000?2048:1024)' "build/art/rooms/$id/sprites")
    $ATLAS "build/art/rooms/$id" "assets/room_$id.js" --only "${id}_*" --max "$max"
}

rooms() {
    for f in art/rooms/*.px.js; do
        case "$f" in *_review.px.js|*.map.js) continue ;; esac
        room "$(basename "$f" .px.js)"
    done
}

case "${1:-all}" in
    test) test_art ;;
    characters) characters ;;
    cams) cams ;;
    mock) mock ;;
    intro) intro ;;
    ui) ui ;;
    deck) deck ;;
    title) title ;;
    # the menu's backdrop is Kowalski Street baked from the same map and kit: it is built again with the street, so it never falls behind
    room) room "$2"; if [ "$2" = kowalski ]; then title; fi ;;
    rooms) rooms; title ;;
    all) test_art; characters; cams; mock; ui; deck; intro; rooms; title ;;
    *) echo "unknown group: $1"; exit 2 ;;
esac
