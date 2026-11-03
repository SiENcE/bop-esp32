// The title screen's backdrop (style guide §8a "Title screen"): for now the mockup's Kowalski street at
// night (art/test/street.px.js: rain, the broken ad screen with the eye in its static, the noodle bar,
// steam), as a 12-frame loop at 10 fps the engine can play. When the real `kowalski` room is painted
// (phase H3), the title takes that instead.
include("../test/street.px.js")

anim("title_bg", { w: 320, h: 180, frames: 12, fps: 10 }, (c) => c.stamp("street_bg", 0, 0, { t: c.frame * 100 }))
