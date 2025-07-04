const fs = require("fs");
const readline = require("readline");
const path = require("path");

// Paths
const jsonPath = path.join(__dirname, "data", "entries.json");
const mdPath = path.join(__dirname, "logs", "dev-log.md");

// Helper to get today's date
const getDate = () => new Date().toISOString().slice(0, 10);

// Ask questions in CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

// Main function
async function run() {
  console.log("📘 Dev Log Entry Generator");
  const title = await ask("✅ Title: ");
  const stack = await ask("🛠️ Stack Used: ");
  const problem = await ask("🧩 Problem Solved / Context: ");
  const outcome = await ask("🌟 Outcome / What You Learned: ");
  const date = getDate();

  // Read JSON and calculate next serial number
  let entries = [];
  if (fs.existsSync(jsonPath)) {
    entries = JSON.parse(fs.readFileSync(jsonPath));
  }

  const sn = entries.length + 1;
  const newEntry = { sn, date, title, stack, problem, outcome };
  entries.push(newEntry);

  // Save JSON
  fs.writeFileSync(jsonPath, JSON.stringify(entries, null, 2));

  // Format Markdown row
  const mdRow = `| ${sn} | ${date} | ${title} | ${stack} | ${problem} | ${outcome} |\n`;

  // Append to markdown file
  if (!fs.existsSync(mdPath)) {
    const header = `| S/N | Date | ✅ Title | 🛠️ Stack Used | 🧩 Problem Solved / Context | 🌟 Outcome / What I Learned |\n|-----|------------|------------|------------------|-----------------------------|------------------------------|\n`;
    fs.writeFileSync(mdPath, header + mdRow);
  } else {
    fs.appendFileSync(mdPath, mdRow);
  }

  console.log("✅ Entry saved to JSON and README successfully.");
  rl.close();
}

run();
