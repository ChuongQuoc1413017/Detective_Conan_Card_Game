/* Checks that each bot level beats the one below it with the six starter decks.
   node tests/levels.js [games per pairing, default 720] */
"use strict";
const { load, expectFinish, finish } = require("./harness");
expectFinish();
const N = +process.argv[2] || 720;
/* lowest win rate accepted for the stronger level, and the share of N games to play
   (recent results: 97.5%, 84.6%, and about 55% for the look-ahead level, which is much slower) */
const PAIRS = [["normal", "easy", 90, 1], ["hard", "normal", 75, 1], ["expert", "hard", 40, 1 / 12]];

const win = load({ practice: true });
const P = win.__practice, decks = Object.keys(P.DECKS).filter(k => k !== "custom");

(async () => {
  let failed = false;
  for (const [strong, weak, need, share] of PAIRS) {
    let won = 0, lost = 0, cap = 0;
    const errors = {}, games = Math.max(36, Math.round(N * share / 12) * 12), t0 = Date.now();
    for (let n = 0; n < games; n++) {
      const flip = (n / 36 | 0) % 2, lv = flip ? [weak, strong] : [strong, weak];
      try {
        const G = await P.sim(decks[n % 6], decks[(n / 6 | 0) % 6], true, lv);
        if (G.over.w < 0) cap++;
        else if (lv[G.over.w] === strong) won++;
        else lost++;
      } catch (e) { errors[e.message] = (errors[e.message] || 0) + 1; }
    }
    const rate = 100 * won / (won + lost), bad = rate < need || Object.keys(errors).length;
    console.log(`${strong} vs ${weak}: ${strong} wins ${rate.toFixed(1)}% of ${games} (needs ${need}%), turn limit ${cap}, ${((Date.now() - t0) / games).toFixed(0)} ms/game` +
      (Object.keys(errors).length ? ", errors " + JSON.stringify(errors) : "") + (bad ? "  FAIL" : "  OK"));
    if (bad) failed = true;
  }
  finish();
  if (failed) process.exit(1);
})();
