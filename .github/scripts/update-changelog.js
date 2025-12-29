import fs from "fs";

const prBody = process.env.PR_BODY || "";
const prNumber = process.env.PR_NUMBER || "unknown";

const startMarker = "> CHANGELOG_START";
const endMarker = "> CHANGELOG_END";

if (!prBody.includes(startMarker) || !prBody.includes(endMarker)) {
  console.log("⚠️ No changelog markers found.");
  process.exit(0);
}

const changes = prBody.split(startMarker)[1].split(endMarker)[0].trim();

if (!changes) {
  console.log("⚠️ Changelog section is empty.");
  process.exit(0);
}

const packageJsonPath = "package.json";
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const versionSplited = packageJson.version.split(".");
const version = [versionSplited[0], versionSplited[1]].join(".");

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");

const header = `## v${version} - ${yyyy}/${mm}/${dd} #${prNumber}\n`;

const block = `${header}\n${changes}`;

const changelogPath = "CHANGELOG.md";

if (!fs.existsSync(changelogPath)) {
  fs.writeFileSync(changelogPath, "# CHANGELOGS\n\n");
}

const existing = fs.readFileSync(changelogPath, "utf8");
const lines = existing.split("\n");
const updated = [lines[0], "", block, "", ...lines.slice(1)].join("\n");

fs.writeFileSync(changelogPath, updated);

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
}

console.log(`✅ Updated changelog [ v${version} ] in CHANGELOG.md`);
