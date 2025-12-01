import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const readmePath = path.join(__dirname, '../../README.md');

const deps = packageJson.dependencies || {};
const devDeps = packageJson.devDependencies || {};

function formatDeps(depsObj) {
  return Object.entries(depsObj)
    .map(([name, version]) => `| ${name} | ${version} |`)
    .join('\n');
}

const tableHeader = `| Package | Version |\n|---|---|`;
const table = `${tableHeader}\n${formatDeps(deps)}\n${formatDeps(devDeps)}`;

let readmeContent = fs.readFileSync(readmePath, 'utf8');

const startMarker = '<!-- DEPENDENCIES_START -->';
const endMarker = '<!-- DEPENDENCIES_END -->';
const regex = new RegExp(`${startMarker}[\\s\\S]*${endMarker}`, 'm');
const newSection = `${startMarker}\n${table}\n${endMarker}`;

if (regex.test(readmeContent)) {
  readmeContent = readmeContent.replace(regex, newSection);
} else {
  readmeContent += `\n${newSection}\n`;
}

fs.writeFileSync(readmePath, readmeContent, 'utf8');
console.log('✅ Updated dependencies in README.md');
