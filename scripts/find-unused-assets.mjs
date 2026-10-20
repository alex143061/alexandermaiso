/**
 * Reports assets that are exported from src/assets/index.js but never
 * imported anywhere else — i.e. dead weight in the bundle.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const barrelPath = path.join(ROOT, 'src', 'assets', 'index.js');
const barrel = fs.readFileSync(barrelPath, 'utf-8');

const exportBlock = barrel.slice(barrel.indexOf('export {'));
const exported = [...exportBlock.matchAll(/^\s*(\w+),?\s*$/gm)].map((m) => m[1]);

// Collect every named import taken from the assets barrel elsewhere.
const used = new Set();
for (const file of walk(path.join(ROOT, 'src'))) {
  if (file === barrelPath) continue;
  const content = fs.readFileSync(file, 'utf-8');
  const re = /import\s*\{([^}]+)\}\s*from\s*["'][^"']*assets["']/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (name) used.add(name);
    }
  }
}

const unused = exported.filter((name) => !used.has(name));

console.log(`Exported assets: ${exported.length}`);
console.log(`Referenced elsewhere: ${used.size}`);
if (unused.length === 0) {
  console.log('No unused asset exports.');
} else {
  console.log(`Unused exports (${unused.length}):`);
  for (const name of unused) console.log(`  ${name}`);
}
