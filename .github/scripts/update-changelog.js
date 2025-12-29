import fs from "fs";

const prBody = process.env.PR_BODY || "";
const prNumber = process.env.PR_NUMBER || "unknown";

const versionMarker = "CHANGELOG_VERSION";
const startMarker = "> CHANGELOG_START";
const endMarker = "> CHANGELOG_END";
const overrideMarker = "> CHANGELOG_OVERRIDE";

if (!prBody.includes(startMarker) || !prBody.includes(endMarker)) {
  console.log(
    `⚠️ No changelog wrappers found. If you have changelog, consider wrapping it in between '${startMarker}' and '${endMarker}'`
  );
  process.exit(0);
}

const changes = prBody.split(startMarker)[1].split(endMarker)[0].trim();

if (!changes) {
  console.log("⚠️ Changelog section is empty.");
  process.exit(0);
}

const shouldOverride = prBody.includes(overrideMarker);

const versionMatch = prBody.match(/CHANGELOG_VERSION:\s*([\d.]+)/);
if (!versionMatch) {
  console.log(
    `⚠️ No '${versionMarker}' found. Consider putting marker '> ${versionMarker}: {major}.{minor}'`
  );
  process.exit(0);
}
const version = versionMatch[1];

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");

const headerRegex = new RegExp(`## v${version} - .*`, "g");

const block = `## v${version} - ${yyyy}/${mm}/${dd} #${prNumber}

${changes}

`;

const changelogPath = "CHANGELOG.md";

if (!fs.existsSync(changelogPath)) {
  fs.writeFileSync(changelogPath, "# CHANGELOGS\n\n");
}

const content = fs.readFileSync(changelogPath, "utf8");

const hasVersion = headerRegex.test(content);

if (hasVersion && !shouldOverride) {
  console.log(
    `⚠️ Changelog for [ v${version} ] already exists. If you want to override previous changelog, consider putting marker '${overrideMarker}'`
  );
  process.exit(0);
}

let updated;

if (hasVersion && shouldOverride) {
  console.log(`🔁 Overriding changelog for [ v${version} ]`);

  updated = content.replace(
    new RegExp(`## v${version} - [\\s\\S]*?(?=\\n## v|$)`, "g"),
    block + "\n"
  );
} else {
  const lines = content.split("\n");
  updated = [lines[0], "", block, "", ...lines.slice(1)].join("\n");
}

fs.writeFileSync(changelogPath, updated);

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
}

console.log(`✅ Updated changelog [ v${version} ] in CHANGELOG.md`);
