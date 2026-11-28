/* Refreshes assets/cards-data.js from the card database API and reports what still needs work.

   node tools/update-cards.js --dry-run     download and report, change nothing
   node tools/update-cards.js               download, report, back up the old file to old/, save
   node tools/update-cards.js --from DIR    use DIR/full.json and DIR/chars.json instead of downloading
   node tools/update-cards.js --keep DIR    also keep the raw download in DIR

   The report lists new and changed cards, card text with no English/Vietnamese translation yet
   (add it to assets/cards-i18n.js), and new abilities the practice game cannot run yet.
   Card data: database by Phu Thanh (Phú Thành), https://conan-tcg.vercel.app/ */
"use strict";
const fs = require("fs"), path = require("path");
const { ROOT, load } = require("../tests/harness");
const API = "https://conan-tcg.onrender.com";
const FILE = path.join(ROOT, "assets/cards-data.js");
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const DRY = args.includes("--dry-run");

/* fields kept from the API, and the extra fields the site uses */
const KEEP = ["card_num", "card_id", "title", "title_romaji", "package_code", "rarity", "color", "type", "cost", "ap", "lp",
  "category1", "feature", "hirameki", "cut_in", "image_url", "rcp_limit"];
const BOX = { pr: "Promo", sp: "SP" };
const BOX_NAMES = { SP: "エグゼクティブコレクション01・02" };
const TEXT = ["feature", "hirameki", "cut_in"]; // the fields the Deck page shows
const JP = /[぀-ヿ㐀-鿿]/;

function convert(c) {
  const d = {};
  for (const k of KEEP) if (c[k] !== null && c[k] !== undefined && c[k] !== "") d[k] = c[k];
  d.package_code = BOX[d.package_code] || d.package_code;
  /* Case levels sometimes come as "7.0" */
  if (c.difficulty_first) d.case_first = String(c.difficulty_first).replace(/\.0+$/, "");
  if (c.difficulty_second) d.case_second = String(c.difficulty_second).replace(/\.0+$/, "");
  if (c.henso) d.disguise = c.henso;
  const more = [c.category2, c.category3].filter(Boolean).join(",");
  if (more) d.category_more = more;
  return d;
}

async function get(p) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(API + p, { headers: { "User-Agent": "card-list-client" }, signal: AbortSignal.timeout(180000) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch (e) {
      if (attempt >= 3) throw new Error(`${p}: ${e.message}`);
      console.log(`  retrying ${p} (${e.message})`);
    }
  }
}
const items = r => (Array.isArray(r) ? r : r.items || []);
async function paged(p) {
  const out = [], seen = new Set();
  for (let off = 0; ;) {
    const page = items(await get(`${p}?limit=200&offset=${off}`)), fresh = page.filter(c => !seen.has(c.card_num));
    if (!fresh.length) return out;
    fresh.forEach(c => seen.add(c.card_num));
    out.push(...fresh);
    off += page.length;
  }
}
async function download() {
  console.log(`Downloading from ${API} (the first request can take a minute while the server wakes up)...`);
  const listing = await paged("/cards"), packages = await get("/packages"), cards = {};
  const codes = packages.map(p => p.package_code);
  for (const c of listing) if (c.package_code && !codes.includes(c.package_code)) codes.push(c.package_code);
  for (const code of codes) for (const c of await paged("/packages/" + encodeURIComponent(code) + "/cards")) cards[c.card_num] = c;
  for (const c of listing) if (!cards[c.card_num]) cards[c.card_num] = await get("/cards/" + encodeURIComponent(c.card_num));
  return { full: { packages, cards: Object.values(cards) }, chars: await get("/characters") };
}

const same = (a, b) => { const k = Object.keys(a); return k.length === Object.keys(b).length && k.every(x => String(a[x]) === String(b[x])); };

function readSaved() {
  const text = fs.readFileSync(FILE, "utf8"), at = text.indexOf("window.CONAN_CARDS=");
  return { header: text.slice(0, at), data: JSON.parse(text.slice(at + 19).trim().replace(/;$/, "")) };
}

function untranslated(win, c) {
  const bits = [], Tr = win.ConanTr;
  if (!Tr.name(c.title, "en")) bits.push("name");
  if (c.category1 && !Tr.name(c.category1, "en")) bits.push("traits");
  for (const k of TEXT) if (c[k] && ["en", "vi"].some(l => JP.test(Tr.text(c[k], l)))) bits.push(k);
  return bits;
}

(async () => {
  let raw;
  const from = opt("--from");
  if (from) raw = { full: JSON.parse(fs.readFileSync(path.join(from, "full.json"), "utf8")), chars: JSON.parse(fs.readFileSync(path.join(from, "chars.json"), "utf8")) };
  else raw = await download();
  const keep = opt("--keep");
  if (keep) {
    fs.mkdirSync(keep, { recursive: true });
    fs.writeFileSync(path.join(keep, "full.json"), JSON.stringify(raw.full));
    fs.writeFileSync(path.join(keep, "chars.json"), JSON.stringify(raw.chars));
  }

  const { header, data: old } = readSaved();
  const cards = {}, oldBy = {};
  for (const c of old.cards) { cards[c.card_num] = c; oldBy[c.card_num] = c; }
  const added = [], changed = [];
  for (const c of raw.full.cards) {
    const d = convert(c), was = oldBy[d.card_num];
    if (!was) added.push(d.card_num);
    else if (same(was, d)) continue;
    else changed.push(d.card_num);
    cards[d.card_num] = d;
  }
  const inApi = new Set(raw.full.cards.map(c => c.card_num));
  const notInApi = old.cards.filter(c => !inApi.has(c.card_num)).map(c => c.card_num);
  const packs = {};
  for (const p of old.packages) packs[p.package_code] = p;
  for (const p of raw.full.packages) packs[p.package_code] = { package_code: p.package_code, package_name: p.package_name };
  for (const [code, name] of Object.entries(BOX_NAMES)) packs[code] = { package_code: code, package_name: name };
  const names = Object.assign({}, old.names);
  for (const x of raw.chars) if (x.name_jp && x.name_en) names[x.name_jp] = x.name_en;
  const data = { date: new Date().toISOString().slice(0, 10), packages: Object.values(packs), names,
    cards: Object.keys(cards).sort().map(k => cards[k]) };

  /* checks on the new list */
  const problems = [];
  const noBox = [...new Set(data.cards.map(c => c.package_code))].filter(b => !packs[b]);
  if (noBox.length) problems.push("cards in a box with no name: " + noBox.join(", "));
  const noImg = data.cards.filter(c => !/^https:\/\//.test(c.image_url || "")).map(c => c.card_num);
  if (noImg.length) problems.push(`${noImg.length} cards without an https image: ${noImg.slice(0, 10).join(", ")}`);

  const win = load({ cards: data }), touched = [...added, ...changed];
  const needTr = [], needFx = [];
  for (const n of touched) {
    const c = cards[n], bits = untranslated(win, c);
    if (bits.length) needTr.push(`${n} ${c.title}: ${bits.join(", ")}`);
    if (["キャラ", "イベント", "事件"].includes(c.type)) {
      const m = win.ConanFx.parse(c).missing.length;
      if (m) needFx.push(`${n} ${c.title}: ${m} unsupported`);
    }
  }
  let allTr = 0;
  for (const c of data.cards) if (untranslated(win, c).length) allTr++;

  const list = (title, rows) => { console.log(`\n${title}: ${rows.length}`); rows.slice(0, 40).forEach(r => console.log("  " + r)); if (rows.length > 40) console.log(`  ... and ${rows.length - 40} more`); };
  console.log(`\nCards: ${old.cards.length} -> ${data.cards.length}`);
  list("New cards", added.map(n => `${n} ${cards[n].title} (${cards[n].package_code})`));
  list("Changed cards", changed.map(n => `${n} ${cards[n].title}: ` + Object.keys(cards[n]).concat(Object.keys(oldBy[n]))
    .filter((k, i, a) => a.indexOf(k) === i && String(cards[n][k]) !== String(oldBy[n][k])).join(", ")));
  if (notInApi.length) list("Kept, but no longer in the API", notInApi);
  list("New or changed cards needing translation (assets/cards-i18n.js)", needTr);
  console.log(`  (all cards with some untranslated text: ${allTr})`);
  list("New or changed cards with abilities the game can't run yet (assets/card-effects.js)", needFx);
  problems.forEach(p => console.log("\nWARNING: " + p));

  if (DRY) { console.log("\nDry run: nothing saved."); return; }
  if (!touched.length && !notInApi.length) { console.log("\nNo changes: nothing saved."); return; }
  let backup = path.join(ROOT, "old", `cards-data_before_update_${data.date}.js`);
  for (let i = 2; fs.existsSync(backup); i++) backup = path.join(ROOT, "old", `cards-data_before_update_${data.date}_${i}.js`);
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(FILE, backup);
  fs.writeFileSync(FILE, header + "window.CONAN_CARDS=" + JSON.stringify(data).replace(/<\//g, "<\\/") + ";\n");
  console.log(`\nSaved ${path.relative(ROOT, FILE)}. The old file is in ${path.relative(ROOT, backup)}.`);
  console.log("Next: run node tests/run.js, then refresh the Deck page.");
})().catch(e => { console.error("FAILED: " + e.message); process.exit(1); });
