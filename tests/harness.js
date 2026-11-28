/* Loads the site's scripts into Node with a tiny fake browser, so the tests can run the game without a page.
   load({practice:true, deck:"<saved deck JSON>", patch:fn}) returns the shared window object. */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const DATA = ["assets/cards-data.js", "assets/cards-i18n.js", "assets/cards-translate.js", "assets/card-effects.js"];

function fakeElement() {
  return new Proxy({
    style: {}, dataset: {}, children: [], parentNode: null,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, appendChild() {}, insertBefore() {}, setAttribute() {}, removeAttribute() {},
    querySelector() { return null; }, querySelectorAll() { return []; }, closest() { return null; }
  }, {});
}

function load(opts) {
  opts = opts || {};
  const game = fakeElement();
  game.parentNode = fakeElement();
  const store = { conanLang: "en" };
  const doc = {
    getElementById: id => (id === "pgame" ? game : null), createElement: fakeElement,
    head: fakeElement(), body: fakeElement(), addEventListener() {}, dispatchEvent() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    createTreeWalker() { return { nextNode() { return null; } }; }
  };
  const ctx = {
    document: doc, navigator: {}, NodeFilter: {}, Image: function () {}, CustomEvent: function () {},
    setTimeout, clearTimeout, requestAnimationFrame() {}, console,
    localStorage: {
      getItem: k => (k === "conanDeck" ? ctx.__deck : store[k] === undefined ? null : store[k]),
      setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; }
    },
    __deck: opts.deck || null
  };
  ctx.window = ctx;
  ctx.addEventListener = () => {};
  vm.createContext(ctx);
  /* opts.cards replaces the saved card list, e.g. to check a fresh download before saving it */
  if (opts.cards) ctx.CONAN_CARDS = opts.cards;
  for (const f of DATA) if (!(opts.cards && f === DATA[0])) vm.runInContext(read(f), ctx, { filename: f });
  if (opts.practice) {
    let src = read("practice.js");
    if (opts.patch) src = opts.patch(src);
    vm.runInContext(src, ctx, { filename: "practice.js" });
  }
  return ctx;
}

function read(f) { return fs.readFileSync(path.join(ROOT, f), "utf8"); }

/* one copy of each card ID (reprints share the same text) */
function uniqueCards(win) {
  const seen = new Map();
  for (const c of win.CONAN_CARDS.cards) if (!seen.has(c.card_id)) seen.set(c.card_id, c);
  return [...seen.values()];
}

/* a repeatable random number source */
function rng(seed) {
  let s = seed % 2147483647 || 1;
  return n => { s = (s * 16807) % 2147483647; return s % n; };
}

/* async tests call expectFinish() first and finish() at the end; if the script stops in between
   (a promise that never resolves), it fails instead of quietly passing */
let finished = true;
function expectFinish() {
  finished = false;
  process.on("exit", code => { if (!finished && code === 0) { console.log("FAIL: the test stopped before finishing"); process.exitCode = 1; } });
}
function finish() { finished = true; }

module.exports = { ROOT, load, read, uniqueCards, rng, expectFinish, finish };
