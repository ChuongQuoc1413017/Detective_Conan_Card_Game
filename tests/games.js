/* Plays many bot-vs-bot games with random legal own decks (and some starter decks).
   Fails on any crash. node tests/games.js [games, default 1000] */
"use strict";
const { load, rng, expectFinish, finish } = require("./harness");
expectFinish();
const N = +process.argv[2] || 1000;

const win = load({ practice: true });
const P = win.__practice, all = win.CONAN_CARDS.cards;
const partners = all.filter(c => c.type === "パートナー");
const cases = all.filter(c => c.type === "事件" && c.color);
const main = all.filter(c => c.type === "キャラ" || c.type === "イベント");

function randomDeck(r) {
  const k = cases[r(cases.length)], p = partners[r(partners.length)];
  const pool = main.filter(c => String(c.color).split("").some(x => k.color.includes(x)));
  const list = {}, ids = {};
  let n = 0;
  while (n < 40) {
    const c = pool[r(pool.length)], have = ids[c.card_id] || 0;
    if (have >= 3) continue;
    const add = Math.min(3 - have, 40 - n, 1 + r(3));
    ids[c.card_id] = have + add;
    list[c.card_num] = (list[c.card_num] || 0) + add;
    n += add;
  }
  return JSON.stringify({ partner: p.card_num, caze: k.card_num, list });
}

(async () => {
  const errors = {}, starters = Object.keys(P.DECKS).filter(k => k !== "custom"), levels = ["easy", "normal", "hard"];
  let finished = 0, turnCap = 0, turns = 0;
  for (let i = 0; i < N; i++) {
    const r = rng(1000 + i * 7);
    win.__deck = randomDeck(r);
    const res = P.loadCustom();
    if (!res.deck) { errors["deck not loaded: " + res.error] = i; continue; }
    P.DECKS.a = P.DECKS.custom;
    win.__deck = randomDeck(rng(5000 + i * 13));
    P.loadCustom();
    P.DECKS.b = P.DECKS.custom;
    const other = i % 3 === 2 ? starters[i % starters.length] : "b";
    try {
      const G = await P.sim(i % 2 ? "a" : other, i % 2 ? other : "a", true, [levels[i % 3], levels[(i / 3 | 0) % 3]]);
      finished++;
      turns += G.turn;
      if (G.over.w < 0) turnCap++;
    } catch (e) {
      const key = e.message + " @ " + (e.stack || "").split("\n").slice(1, 3).join(" ").replace(/\s+/g, " ");
      errors[key] = errors[key] || { count: 0, game: i };
      errors[key].count++;
    }
  }
  console.log(`Games: ${N}, finished: ${finished}, hit the turn limit: ${turnCap}, average turns: ${(turns / finished).toFixed(1)}`);
  const list = Object.entries(errors);
  if (list.length) {
    console.log("FAIL:");
    list.slice(0, 10).forEach(([k, v]) => console.log("  ", k, JSON.stringify(v)));
    process.exit(1);
  }
  finish();
  console.log("OK: no crashes.");
})();
