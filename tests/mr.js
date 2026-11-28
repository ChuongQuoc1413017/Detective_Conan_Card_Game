/* MR card rules (Official Rule Manual p.26):
   1. An MR that leaves the Scene during the opponent's turn moves to its owner's Partner area.
   2. When an MR enters your Scene, MR cards already in your Scene or Partner area are removed.
   3. In the Partner area it cannot deduce or act, but abilities marked
      "この能力はパートナーエリアでも宣言できる／発動する" still work.
   Also plays many bot games with decks full of MR cards.
   node tests/mr.js [games, default 600] */
"use strict";
const { load, rng, expectFinish, finish } = require("./harness");
expectFinish();
const GAMES = +process.argv[2] || 600;
const EXPOSE = "window.__mr={G:function(v){if(v!==undefined)G=v;return G},mkP:mkP,mkChar:mkChar,buildCard:buildCard,removeChar:removeChar,enterChar:enterChar,declarers:declarers,useDecl:useDecl,aiDeclares:aiDeclares,paMR:paMR,autoPhase:autoPhase,cleanup:cleanup};";
const ctx = load({ practice: true, patch: s => s.replace("window.__practice={", EXPOSE + "window.__practice={") });
const T = ctx.__mr, D = ctx.CONAN_CARDS.cards, F = ctx.ConanFx;

let uid = 5000, bad = 0;
const check = (name, ok, info) => { console.log((ok ? "ok   " : "FAIL ") + name + (ok ? "" : " " + (info || ""))); if (!ok) bad++; };
const card = n => Object.assign({ t: "c" }, T.buildCard(D.find(c => c.card_num === n), 1), { uid: ++uid });
const plain = (lv, extra) => Object.assign({ t: "c", n: "Dummy " + lv, jnames: ["ダミー"], jt: [], col: ["青", "緑", "白", "赤", "黄", "黒"], lv, ap: lv * 1000, lp: 1, fx: [], uid: ++uid, custom: true }, extra);
const def = { custom: true, name: "t", partner: { n: "P", lp: 1, col: ["青", "緑", "白", "赤", "黄", "黒"] }, caseColors: ["青", "緑", "白", "赤", "黄", "黒"], caseTags: [], caze: { n: "C", lv: [7, 6] }, fx: [], cards: [] };
function board(cur) {
  const G = { p: [T.mkP(0, def), T.mkP(1, def)], turn: 4, cur: cur, log: [], sim: true, bot: ["normal", "normal"], over: null };
  T.G(G);
  for (const p of G.p) { p.deck = []; for (let i = 0; i < 20; i++) p.deck.push(plain(1 + i % 8)); p.file = []; for (let i = 0; i < 8; i++) p.file.push(plain(1)); }
  return G;
}
const put = (p, c, state) => { const ch = T.mkChar(c); ch.state = state || "active"; ch.fresh = false; p.scene.push(ch); return ch; };
const count = p => p.deck.length + p.hand.length + p.file.length + p.ev.length + p.rem.length + p.scene.length + p.pa.length;
const mrNums = [...new Set(D.filter(c => /^MR/.test(c.rarity) && c.type === "キャラ").map(c => c.card_num))];

(async () => {
  let G, p, o, ch, before;
  // 1. leaving on the opponent's turn
  G = board(1); [p, o] = G.p; ch = put(p, card("B05086")); before = count(p);
  await T.removeChar(p, ch, "test");
  check("MR removed on the opponent's turn goes to the Partner area", p.pa.length === 1 && p.pa[0].mrPA && !p.rem.length && count(p) === before);
  G = board(0); [p, o] = G.p; ch = put(p, card("B05086"));
  await T.removeChar(p, ch, "test");
  check("MR removed on its own turn goes to the Remove area", !p.pa.length && p.rem.length === 1);
  G = board(1); [p, o] = G.p; const normal = put(p, plain(5)); await T.removeChar(p, normal, "test");
  check("a normal card removed on the opponent's turn stays removed", !p.pa.length && p.rem.length === 1);
  // 2. a new MR removes the old ones (even on the opponent's turn it does not go to the Partner area)
  G = board(1); [p, o] = G.p; const old = put(p, card("B05106"));
  const inPA = T.mkChar(card("B05066")); inPA.mrPA = true; p.pa.push(inPA);
  const fresh = card("B05086"); p.hand = [fresh]; before = count(p);
  await T.enterChar(p, fresh, {});
  check("a new MR removes the MR already in Scene", !p.scene.includes(old) && p.scene.some(c => c.uid === fresh.uid));
  check("a new MR removes the MR in the Partner area", !p.pa.length && p.rem.length === 2 && count(p) === before, JSON.stringify({ pa: p.pa.length, rem: p.rem.length }));
  // 3. declaring from the Partner area (B05086: give a yellow character AP+1000, also from the Partner area)
  G = board(0); [p, o] = G.p; const mr = T.mkChar(card("B05086")); mr.mrPA = true; mr.fresh = false; p.pa.push(mr);
  const yellow = put(p, plain(5, { col: ["黄"] }));
  const decl = T.declarers(p);
  check("an MR in the Partner area offers its Partner-area Declare ability", decl.includes(mr));
  await T.aiDeclares(p);
  check("the bot uses it, and it works", yellow.mod >= 1000, JSON.stringify({ mod: yellow.mod, log: G.log.slice(0, 3) }));
  // B05045's only supported Declare ability works in Scene only, so it is not offered from the Partner area
  G = board(0); [p, o] = G.p; const mr2 = T.mkChar(card("B05045")); mr2.mrPA = true; p.pa.push(mr2); put(o, plain(5));
  check("Scene-only abilities are not offered from the Partner area", !T.declarers(p).includes(mr2));
  const inScene = put(p, card("B05045"));
  check("...but the same ability is offered in Scene", T.declarers(p).includes(inScene));
  // trigger from the Partner area (B05027: when Heiji or Kazuha enters, sleep up to 1 character)
  G = board(0); [p, o] = G.p; const hk = T.mkChar(card("B05027")); hk.mrPA = true; p.pa.push(hk);
  const foe = put(o, plain(6));
  const heiji = plain(3, { n: "Heiji", jnames: [F.nfkc("服部平次")] }); p.hand = [heiji];
  await T.enterChar(p, heiji, {});
  check("an MR trigger works from the Partner area", foe.state === "sleep", JSON.stringify(G.log.slice(0, 4)));
  G = board(0); [p, o] = G.p; const foe2 = put(o, plain(6)); const other = plain(3); p.hand = [other];
  const hk2 = T.mkChar(card("B05027")); hk2.mrPA = true; p.pa.push(hk2);
  await T.enterChar(p, other, {});
  check("...and only for the named characters", foe2.state === "active");
  // auto phase wakes the Partner area MR and resets its once-per-turn use
  G = board(0); [p, o] = G.p; const tired = T.mkChar(card("B05086")); tired.mrPA = true; tired.state = "sleep"; tired.used = [1]; p.pa.push(tired);
  T.cleanup(); T.autoPhase(p);
  check("auto phase wakes it and resets once-per-turn", tired.state === "active" && !tired.used);

  // many games with MR-heavy decks: no crash, no lost card (the game checks card counts every turn)
  const P = ctx.__practice, all = D, partners = all.filter(c => c.type === "パートナー"), cases = all.filter(c => c.type === "事件" && c.color);
  const main = all.filter(c => c.type === "キャラ" || c.type === "イベント");
  function mrDeck(r) {
    const k = cases[r(cases.length)], ok = c => String(c.color).split("").some(x => k.color.includes(x));
    const mine = mrNums.filter(n => ok(D.find(c => c.card_num === n)));
    const list = {}, ids = {}; let n = 0;
    const addC = (c, x) => { const have = ids[c.card_id] || 0, add = Math.min(x, 3 - have, 40 - n); if (add <= 0) return; ids[c.card_id] = have + add; list[c.card_num] = (list[c.card_num] || 0) + add; n += add; };
    mine.forEach(num => addC(D.find(c => c.card_num === num), 3));
    const pool = main.filter(ok);
    while (n < 40) addC(pool[r(pool.length)], 1 + r(3));
    return JSON.stringify({ partner: partners[r(partners.length)].card_num, caze: k.card_num, list });
  }
  let errors = {}, played = 0, moved = 0;
  for (let i = 0; i < GAMES; i++) {
    ctx.__deck = mrDeck(rng(300 + i * 11)); if (!P.loadCustom().deck) continue; P.DECKS.a = P.DECKS.custom;
    ctx.__deck = mrDeck(rng(900 + i * 17)); P.loadCustom(); P.DECKS.b = P.DECKS.custom;
    try { const g = await P.sim("a", "b", true, [["easy", "normal", "hard"][i % 3], "normal"]); played++; if (g.log.some(l => /MR card: it moves/.test(l))) moved++; }
    catch (e) { const k = e.message + " " + (e.stack || "").split("\n")[1]; errors[k] = (errors[k] || 0) + 1; }
  }
  check(`${played} MR-heavy games without errors (MR moved to the Partner area in ${moved})`, !Object.keys(errors).length && played === GAMES && moved > 0, JSON.stringify(errors).slice(0, 600));
  finish();
  if (bad) { console.log("FAIL"); process.exit(1); }
  console.log("OK");
})();
