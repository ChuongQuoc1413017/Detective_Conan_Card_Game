/* Each puzzle can be solved with its intended moves, a wrong line fails, and the hint points the right way.
   node tests/puzzles.js */
"use strict";
const { load, expectFinish, finish } = require("./harness");
expectFinish();
const tick = () => new Promise(r => setTimeout(r, 0));

async function play(i, steps) {
  const win = load({ practice: true }), P = win.__practice, G = () => P.dbg();
  const done = P.puzzle(i);
  const hints = [];
  for (const s of steps) {
    for (let n = 0; n < 50 && !(G().act || G().ask || G().over); n++) await tick();
    if (G().over) break;
    if (s === "hint") { hints.push(P.suggest()); continue; }
    if (typeof s === "number") { if (!P.answer(s)) throw new Error("no question to answer"); }
    else if (typeof s === "function") { const k = G().ask ? G().ask.opts.findIndex(s) : -1; if (k < 0 || !P.answer(k)) throw new Error("no matching answer in " + JSON.stringify(G().ask && G().ask.opts)); }
    else if (!P.act(s)) throw new Error("not waiting for an action: " + JSON.stringify(s));
    await tick();
  }
  for (let n = 0; n < 50 && !G().over; n++) { if (G().act) P.act({ t: "end" }); await tick(); }
  const g = await done;
  return { won: g.over && g.over.w === 0, why: g.over && g.over.why, hints };
}
const by = name => o => o.l && o.l.indexOf(name) === 0;

let bad = 0;
(async () => { for (let rep = 0; rep < (+process.argv[2] || 30); rep++) {

  const check = (name, ok, info) => { if (rep === 0 || !ok) console.log((ok ? "ok   " : "FAIL ") + name + (ok ? "" : " " + (info || ""))); if (!ok) bad++; };
  // 1. Partner last
  let r = await play(0, ["hint", { t: "deduce" }, by("Ayumi"), { t: "solve" }]);
  check("puzzle 1 solved by deducing with Ayumi, then Case Solved", r.won, r.why);
  check("puzzle 1 hint says deduce with Ayumi", /Ayumi/.test(r.hints[0]), r.hints[0]);
  r = await play(0, [{ t: "deduce" }, by("Partner"), { t: "deduce" }, by("Ayumi"), { t: "solve" }]);
  check("puzzle 1 fails if the partner deduces first", !r.won, r.why);
  // 2. Swift arrival: the hand card number is found by name
  const win = load({ practice: true });
  r = await (async () => {
    const P = win.__practice, G = () => P.dbg(), done = P.puzzle(1);
    for (let n = 0; n < 20 && !G().act; n++) await tick();
    const hint = P.suggest();
    const conan = G().p[0].hand.find(c => c.k === "c7");
    P.act({ t: "hand", v: conan.uid }); await tick();
    for (const name of ["Conan", "Genta"]) { P.act({ t: "deduce" }); await tick(); P.answer(G().ask.opts.findIndex(by(name))); await tick(); }
    P.act({ t: "solve" }); const g = await done; return { won: g.over.w === 0, why: g.over.why, hints: [hint] };
  })();
  check("puzzle 2 solved by playing Swift Conan and deducing twice", r.won, r.why);
  check("puzzle 2 hint says play Conan", /Conan/.test(r.hints[0]), r.hints[0]);
  // 3. Next Hint
  r = await (async () => {
    const w = load({ practice: true }), P = w.__practice, G = () => P.dbg(), done = P.puzzle(2);
    for (let n = 0; n < 20 && !G().act; n++) await tick();
    const hint = P.suggest();
    P.act({ t: "hint" }); await tick(); P.answer(0); await tick();
    const conan = G().p[0].hand.find(c => c.k === "c7");
    P.act({ t: "hand", v: conan.uid }); await tick();
    for (const name of ["Conan", "Ran"]) { P.act({ t: "deduce" }); await tick(); P.answer(G().ask.opts.findIndex(by(name))); await tick(); }
    P.act({ t: "solve" }); const g = await done; return { won: g.over.w === 0, why: g.over.why, hints: [hint] };
  })();
  check("puzzle 3 solved with Next Hint", r.won, r.why);
  check("puzzle 3 hint says Next Hint", /Next Hint/.test(r.hints[0]), r.hints[0]);
  r = await play(2, []);
  check("puzzle 3 fails if you just end the turn", !r.won, r.why);
  if (bad) { console.log("FAIL"); process.exit(1); } }
  finish();
  console.log("OK: every puzzle checked " + (+process.argv[2] || 30) + " times with shuffled decks.");
})();
