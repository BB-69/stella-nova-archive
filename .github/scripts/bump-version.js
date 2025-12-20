import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, "../../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const vBumpConfigPath = path.join(__dirname, "../vbump-config.json");
const vBumpConfigJson = JSON.parse(fs.readFileSync(vBumpConfigPath, "utf8"));
const readmePath = path.join(__dirname, "../../README.md");

const version = packageJson.version || "";
let [major, minor, patch] = version.split(".").map(Number);

if (vBumpConfigJson.major) {
  major++;
  minor = 0;
  patch = 0;
}
if (vBumpConfigJson.minor) {
  minor++;
  patch = 0;
}
if (!vBumpConfigJson.major && !vBumpConfigJson.minor && vBumpConfigJson.patch) {
  patch++;
}
vBumpConfigJson.major = false;
vBumpConfigJson.minor = false;
vBumpConfigJson.patch = true;
const newVersion = `${major}.${minor}.${patch}`;

packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log("✅ Updated version in package.json");

fs.writeFileSync(vBumpConfigPath, JSON.stringify(vBumpConfigJson, null, 2));
console.log("🔄 Reverted config in vbump-config.json");

let readmeContent = fs.readFileSync(readmePath, "utf8");

const startMarker = "<!-- VERSION_START -->";
const endMarker = "<!-- VERSION_END -->";
const regex = new RegExp(`${startMarker}[\\s\\S]*${endMarker}`, "m");
const newSection = `${startMarker}\n${"> v" + newVersion}\n${endMarker}`;

if (regex.test(readmeContent)) {
  readmeContent = readmeContent.replace(regex, newSection);
} else {
  readmeContent += `\n${newSection}\n`;
}

fs.writeFileSync(readmePath, readmeContent, "utf8");
console.log("✅ Updated version in README.md");

fs.appendFileSync(process.env.GITHUB_OUTPUT, `newVersion=${newVersion}\n`);
