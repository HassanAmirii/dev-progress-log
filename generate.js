const fs = require("fs");
const readline = require("readline");
const path = require("path");

/* ──────────────────────────────
   1  Paths (README is the log)
   ────────────────────────────── */
const jsonPath = path.join(__dirname, "data", "entries.json");
const mdPath = path.join(__dirname, "README.md");

/* ──────────────────────────────
   2  Helpers
   ────────────────────────────── */
const today = () => new Date().toISOString().slice(0, 10);
const ask = (q) =>
  new Promise((res) => rl.question(q, (answer) => res(answer.trim())));

/* ──────────────────────────────
   3  Ensure folders & files
   ────────────────────────────── */
fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
if (!fs.existsSync(jsonPath) || fs.readFileSync(jsonPath).length === 0) {
  fs.writeFileSync(jsonPath, "[]");
}

const tableHeader =
  "| S/N | Date | Title | Stack Used | Problem Solved / Context | Outcome / What I Learned |\n" +
  "|---|---|---|---|---|---|\n";

const mainTitle = "# 2bit.devlog\n\n## Weekly Dev Log\n\n";

if (!fs.existsSync(mdPath)) {
  fs.writeFileSync(mdPath, mainTitle + tableHeader);
} else {
  // Check if the file is empty or missing the main title and table header
  const readmeContent = fs.readFileSync(mdPath, "utf8");
  if (
    !readmeContent.includes(mainTitle.trim()) ||
    !readmeContent.includes(tableHeader.trim())
  ) {
    fs.writeFileSync(mdPath, mainTitle + tableHeader + readmeContent);
  }
}

/* ──────────────────────────────
   4  CLI
   ────────────────────────────── */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async function run() {
  console.log("Dev Log Entry Generator\n");

  const title = await ask("Title: ");
  const stack = await ask("Stack Used: ");
  const problem = await ask("Problem Solved / Context: ");
  const outcome = await ask("Outcome / What You Learned: ");
  const date = today();

  /* ─── load / update JSON ─── */
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(jsonPath));
    if (!Array.isArray(entries)) entries = [];
  } catch {
    entries = [];
  }

  const sn = entries.length + 1;
  const newEntry = { sn, date, title, stack, problem, outcome };
  entries.push(newEntry);
  fs.writeFileSync(jsonPath, JSON.stringify(entries, null, 2));

  /* ─── append to README ─── */
  const mdRow = `| ${sn} | ${date} | ${title} | ${stack} | ${problem} | ${outcome} |\n`;
  fs.appendFileSync(mdPath, mdRow);

  console.log("\nEntry saved to README and JSON.\n");
  rl.close();
})();
