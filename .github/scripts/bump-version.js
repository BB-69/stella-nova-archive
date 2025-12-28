import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vBumpConfigPath = path.join(__dirname, "../vbump-config.json");
const vBumpConfigJson = JSON.parse(fs.readFileSync(vBumpConfigPath, "utf8"));
const readmePath = path.join(__dirname, "../../README.md");

let bumpType = "patch";
if (vBumpConfigJson.major) bumpType = "major";
else if (vBumpConfigJson.minor) bumpType = "minor";

const hasBumpConfig =
  vBumpConfigJson.major || vBumpConfigJson.minor || vBumpConfigJson.patch;

if (hasBumpConfig) {
  try {
    execSync(`npm version ${bumpType} --no-git-tag-version`, {
      cwd: path.join(__dirname, "../../"),
      stdio: "inherit",
    });
  } catch (err) {
    console.error("❌ npm version failed");
    process.exit(1);
  }

  const packageJsonPath = path.join(__dirname, "../../package.json");
  const updatedPackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  );
  const newVersion = updatedPackageJson.version;

  console.log("✅ Updated version via npm:", newVersion);

  let readmeContent = fs.readFileSync(readmePath, "utf8");

  const startMarker = "<!-- VERSION_START -->";
  const endMarker = "<!-- VERSION_END -->";
  const regex = new RegExp(`${startMarker}[\\s\\S]*${endMarker}`, "m");
  const newSection = `${startMarker}\n${"> v" + newVersion}\n${endMarker}`;

  if (regex.test(readmeContent)) {
    readmeContent = readmeContent.replace(regex, newSection);
  } else {
    console.warn("⚠️ VERSION markers not found, appending section");
    readmeContent += `Current Version:\n${newSection}\n`;
  }

  fs.writeFileSync(readmePath, readmeContent, "utf8");
  console.log("✅ Updated version in README.md");

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `newVersion=${newVersion}\n`);
  }
} else {
  console.warn("⚠️ No version bump flag set in vbump-config.json");
}

vBumpConfigJson.major = false;
vBumpConfigJson.minor = false;
vBumpConfigJson.patch = true;
fs.writeFileSync(vBumpConfigPath, JSON.stringify(vBumpConfigJson, null, 2));
console.log("🔄 Reverted config in vbump-config.json");
