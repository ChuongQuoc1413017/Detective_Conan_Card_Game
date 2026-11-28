/* Runs every test. node tests/run.js         (under a minute)
                     node tests/run.js --full  (more games, several minutes) */
"use strict";
const { spawnSync } = require("child_process"), path = require("path");
const full = process.argv.includes("--full");
const TESTS = [
  ["Ability coverage", "coverage.js", []],
  ["Card ability checks", "cards.js", []],
  ["Random own-deck games", "games.js", [full ? "10000" : "2000"]],
  ["Bot levels", "levels.js", [full ? "7200" : "720"]],
  ["Puzzles", "puzzles.js", []],
  ["MR card rules", "mr.js", [full ? "3000" : "600"]]
];

let failed = [];
for (const [name, file, args] of TESTS) {
  console.log(`\n=== ${name}`);
  const t = Date.now();
  const r = spawnSync(process.execPath, [path.join(__dirname, file), ...args], { stdio: "inherit" });
  console.log(`(${((Date.now() - t) / 1000).toFixed(1)}s)`);
  if (r.status !== 0) failed.push(name);
}
console.log(failed.length ? `\nFAILED: ${failed.join(", ")}` : "\nAll tests passed.");
process.exit(failed.length ? 1 : 0);
