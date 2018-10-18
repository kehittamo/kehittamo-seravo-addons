#!/usr/bin/env node
/**
 * This scripts updates package.json as needed.
 *
 * If the target project's package.json is not by Kehittamo,
 * we overwrite it with the example provided in this plugin.
 * Else we merge changes from the newer example version or do
 * nothing if versions match (or the target's version is newer).
 */
const fs = require('fs');

// https://github.com/substack/semver-compare
function semverCmp(a, b) {
  const { isNaN } = Number;
  const pa = a.split('.');
  const pb = b.split('.');
  for (let i = 0; i < 3; i += 1) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
}

const packageJsonPath = `${__dirname}/../package.json`;
const packageJsonExPath = `${__dirname}/../package.json.example`;

if (!fs.existsSync(packageJsonPath)) {
  console.log('==> ksa: ERROR: Package.json seems to be missing!');
  process.exit(1);
}

if (!fs.existsSync(packageJsonExPath)) {
  console.log('==> ksa: Package.json.example seems to be missing. Ignoring...');
  process.exit();
}

const {
  author,
  version: oldVersion,
  dependencies: oldDependencies,
  devDependencies: oldDevDependencies,
} = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const packageJsonEx = JSON.parse(fs.readFileSync(packageJsonExPath, 'utf8'));
const { version, devDependencies, dependencies } = packageJsonEx;
const authorIsKehittamo = author.toLowerCase().includes('kehittamo');

if (authorIsKehittamo && semverCmp(version, oldVersion) < 1) {
  console.log('==> ksa: Package.json up to date.');
  process.exit();
}

packageJsonEx.devDependencies = authorIsKehittamo
  ? { ...oldDevDependencies, ...devDependencies }
  : devDependencies;
packageJsonEx.dependencies = authorIsKehittamo
  ? { ...oldDependencies, ...dependencies }
  : dependencies;
const newPackageJson = JSON.stringify(packageJsonEx, null, 2);
fs.writeFileSync(packageJsonPath, newPackageJson, 'utf8');

console.log(
  `==> ksa: Package.json ${authorIsKehittamo ? 'updated' : 'replaced'}!`
);
