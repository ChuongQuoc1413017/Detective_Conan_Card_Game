/* How many printed abilities the game can run for own decks.
   Fails if the number drops below tests/baseline.json, so a change can't quietly break cards.
   node tests/coverage.js            summary
   node tests/coverage.js --top 30   also list the 30 most common unsupported lines
   node tests/coverage.js --save     store the current numbers as the new baseline */
"use strict";
const fs = require("fs"), path = require("path");
const { load, uniqueCards } = require("./harness");
const BASE = path.join(__dirname, "baseline.json");
const args = process.argv.slice(2);

const win = load();
const cards = uniqueCards(win), byType = {}, missing = new Map();
let automated = 0, unsupported = 0;
for (const c of cards) {
  const r = win.ConanFx.parse(c);
  automated += r.abs.length;
  unsupported += r.missing.length;
  const t = (byType[c.type] = byType[c.type] || { cards: 0, complete: 0 });
  t.cards++;
  if (!r.missing.length) t.complete++;
  for (const m of r.missing) missing.set(m, (missing.get(m) || 0) + 1);
}
const total = automated + unsupported;
console.log(`Card IDs: ${cards.length}`);
console.log(`Abilities the game runs: ${automated} of ${total} (${(100 * automated / total).toFixed(1)}%)`);
const TYPE = { "パートナー": "Partners", "キャラ": "Characters", "イベント": "Events", "事件": "Cases" };
for (const [t, v] of Object.entries(byType)) console.log(`  ${TYPE[t] || t}: ${v.complete} of ${v.cards} cards fully supported`);

const top = args.indexOf("--top");
if (top > -1) {
  console.log("\nMost common unsupported lines:");
  [...missing].sort((a, b) => b[1] - a[1]).slice(0, +args[top + 1] || 20)
    .forEach(([line, n]) => console.log(`  ${n} × ${line.replace(/\n/g, " / ")}`));
}

if (args.includes("--save")) {
  fs.writeFileSync(BASE, JSON.stringify({ automated, total }, null, 2) + "\n");
  console.log("\nSaved as the new baseline.");
} else if (fs.existsSync(BASE)) {
  const base = JSON.parse(fs.readFileSync(BASE, "utf8"));
  if (automated < base.automated) {
    console.log(`\nFAIL: fewer abilities than the baseline (${base.automated}).`);
    process.exit(1);
  }
  console.log(`\nOK: at or above the baseline of ${base.automated}.`);
}
