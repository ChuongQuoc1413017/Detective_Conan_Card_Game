/* The extra practice modes: daily case, two players on one device, the guided game, replay frames and the record.
   node tests/features.js [games, default 6] */
"use strict";
const { load, expectFinish, finish } = require("./harness");
expectFinish();
const GAMES = +process.argv[2] || 6;
const EXPOSE = "window.__ft={G:function(){return G},makeDaily:makeDaily,startGame:startGame,recGet:recGet,suggest:function(){var t=suggest();return [t,SUG]},seatOf:function(p){return seatOf(p)}};";
const ctx = load({ practice: true, patch: s => s.replace("window.__practice={", EXPOSE + "window.__practice={") });
const T = ctx.__ft;
let bad = 0;
const check = (name, ok, info) => { console.log((ok ? "ok   " : "FAIL ") + name + (ok ? "" : " " + (info || ""))); if (!ok) bad++; };
const tick = () => new Promise(r => setTimeout(r, 0));
const sig = g => g.p.map(p => [p.def.name, p.lv, p.ev.length, p.hand.map(c => c.n).join("/"), p.scene.map(c => c.n + ":" + c.state).join("/")].join("|")).join(" || ");

/* answers whatever the page is waiting for, the way a careful player would (follows the 💡 hint) */
async function drive(G, limit) {
  let steps = 0, wrongSeat = 0, turns = new Set();
  while (!G.over && steps < limit) {
    steps++;
    await tick();
    if (G.cover) { const r = G.cover.r; G.cover = null; r(); continue; }
    if (G.mull) { G.mull.r([]); continue; }
    if (G.ask) { const q = G.ask; G.ask = null; const opts = q.opts; const pickI = opts.length > 1 ? 0 : 0; q.r(opts[pickI].v); continue; }
    if (G.act) {
      if (G.hot && G.cur !== 0) wrongSeat++;
      turns.add(G.turn);
      const [, s] = T.suggest(), f = G.act;
      G.act = null;
      if (s && s.a === "hand") f({ t: "hand", v: s.v });
      else if (s && ["solve", "deduce", "action", "assist"].indexOf(s.a) > -1) f({ t: s.a, v: null });
      else f({ t: "end", v: null });
    }
  }
  return { steps, wrongSeat, turns: turns.size };
}

(async () => {
  // daily case: the same board for the same day, a different one on another day, always one that can be won
  const days = ["2026-11-28", "2026-11-29", "2027-01-01", "2027-02-14", "2027-07-04"];
  const boards = [];
  for (const d of days) {
    const a = await T.makeDaily(d), b = await T.makeDaily(d);
    boards.push(a && sig(a));
    check("daily case " + d + " can be built", !!a);
    if (!a) continue;
    check("daily case " + d + " is the same every time", sig(a) === sig(b));
    const me = a.p[0];
    check("daily case " + d + " is not already won", me.phase === "solution" && me.ev.length < me.lv && me.partner === "active");
    const n = p => p.deck.length + p.hand.length + p.file.length + p.ev.length + p.rem.length + p.scene.length + p.pa.length;
    check("daily case " + d + " keeps 40 cards per side", n(a.p[0]) === 40 && n(a.p[1]) === 40);
  }
  check("different days give different boards", new Set(boards.filter(Boolean)).size === boards.filter(Boolean).length);

  // two players on one device: whoever moves is always shown at the bottom (index 0), the game finishes, frames are kept
  let finished = 0, wrong = 0, frames = 0, seatsOk = true;
  for (let i = 0; i < GAMES; i++) {
    const keys = Object.keys(ctx.__practice.DECKS).filter(k => k !== "custom");
    const run = T.startGame(keys[i % keys.length], keys[(i + 2) % keys.length], false, null, { hot: true });
    await tick();
    const G = T.G();
    const r = await drive(G, 40000);
    await run;
    if (G.over && (G.over.w === 0 || G.over.w === 1)) finished++;
    wrong += r.wrongSeat;
    frames += (G.frames || []).length;
    if (!G.p.every((p, k) => p.i === k)) seatsOk = false;
  }
  check(`${GAMES} two-player games finish`, finished === GAMES, finished + " finished");
  check("the player to move is always at the bottom", wrong === 0, wrong + " times not");
  check("player numbers stay consistent after swapping", seatsOk);
  check("replay frames are recorded", frames > GAMES * 10, frames + " frames");
  check("a two-player game unlocks its badge", !!T.recGet().badges.hot);

  // guided game against the Novice, and the record
  const before = T.recGet();
  const run = T.startGame("conan", "org", false, null, { tutor: true });
  await tick();
  const G = T.G();
  check("guided game plays the Novice", G.bot[1] === "easy" && G.tutor);
  await drive(G, 40000);
  await run;
  const after = T.recGet(), played = k => (after.w[k] || 0) + (after.l[k] || 0) - ((before.w[k] || 0) + (before.l[k] || 0));
  check("the guided game is recorded against the Novice", played("easy") === 1 && after.tutor === 1, JSON.stringify(after));
  finish();
  if (bad) { console.log("FAIL"); process.exit(1); }
  console.log("OK");
})();
