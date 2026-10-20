import fs from 'fs';
import path from 'path';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const exts = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];

function walk(dir, out = [], filter = () => true) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out, filter);
    else if (filter(full)) out.push(full);
  }
  return out;
}

const files = walk(srcDir, [], (f) => exts.includes(path.extname(f)));
const importRe = /(?:import\s+[^'"]*from\s*|import\s*|require\(\s*)['"]([^'"]+)['"]/g;

let broken = 0;
let checked = 0;
const missing = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  let m;
  importRe.lastIndex = 0;
  while ((m = importRe.exec(content)) !== null) {
    const spec = m[1];
    if (!spec.startsWith('.')) continue; // bare package import
    const resolved = path.resolve(path.dirname(file), spec);
    checked++;
    // Try exact, then with common extensions, then as directory index
    const candidates = [
      resolved,
      resolved + '.js', resolved + '.jsx', resolved + '.ts', resolved + '.tsx',
      resolved + '.webp', resolved + '.svg', resolved + '.png', resolved + '.jpg',
      resolved + '.json', resolved + '.pdf',
      path.join(resolved, 'index.js'), path.join(resolved, 'index.jsx'),
    ];
    const found = candidates.some(c => fs.existsSync(c) && fs.statSync(c).isFile());
    if (!found) {
      broken++;
      missing.push({
        file: path.relative(root, file),
        spec,
      });
    }
  }
}

console.log(`Checked ${checked} relative imports across ${files.length} source files.`);
if (broken === 0) {
  console.log('ALL IMPORTS RESOLVE ✔');
} else {
  console.log(`BROKEN IMPORTS: ${broken}`);
  for (const x of missing) console.log(`  ${x.file}  ->  ${x.spec}`);
}

// --- glTF asset references -------------------------------------------------
// 3D models reference their textures and binary buffers by relative URI in
// the .gltf file. A mismatch there 404s silently in the browser, so verify
// every URI resolves to a file on disk.
const publicDir = path.join(root, 'public');
let gltfBroken = 0;
let gltfChecked = 0;

if (fs.existsSync(publicDir)) {
  const gltfFiles = walk(publicDir).filter(
    (f) => f.endsWith('.gltf') || f.endsWith('.glb')
  );

  for (const gltfPath of gltfFiles) {
    const dir = path.dirname(gltfPath);
    let gltf;
    try {
      gltf = JSON.parse(fs.readFileSync(gltfPath, 'utf-8'));
    } catch {
      console.log(`  ! could not parse ${path.relative(root, gltfPath)}`);
      gltfBroken++;
      continue;
    }

    const uris = [
      ...(gltf.buffers ?? []).map((b) => b.uri),
      ...(gltf.images ?? []).map((i) => i.uri),
    ].filter((u) => u && !u.startsWith('data:'));

    for (const uri of uris) {
      gltfChecked++;
      const target = path.resolve(dir, decodeURIComponent(uri));
      if (!fs.existsSync(target)) {
        gltfBroken++;
        console.log(
          `  ${path.relative(root, gltfPath)}  ->  ${uri} (missing)`
        );
      }
    }
  }
}

if (gltfChecked > 0) {
  console.log(`Checked ${gltfChecked} glTF asset references.`);
  console.log(
    gltfBroken === 0 ? 'ALL GLTF REFERENCES RESOLVE ✔' : `BROKEN GLTF REFERENCES: ${gltfBroken}`
  );
}

// --- public asset references ----------------------------------------------
// Files referenced from index.html / manifests / robots.txt must exist.
const publicRefRe = /(?:href|src|content|url)\s*=\s*["']((?:https?:)?\/\/[^"']*\/)?(\/[^"'\s>]+)["']/gi;
let publicBroken = 0;
let publicChecked = 0;

const publicSources = [
  path.join(root, 'index.html'),
  path.join(publicDir, 'site.webmanifest'),
  path.join(publicDir, 'robots.txt'),
  path.join(publicDir, 'sitemap.xml'),
].filter((f) => fs.existsSync(f));

for (const srcFile of publicSources) {
  const content = fs.readFileSync(srcFile, 'utf-8');
  let m;
  publicRefRe.lastIndex = 0;
  while ((m = publicRefRe.exec(content)) !== null) {
    const ref = m[2];
    if (!ref.startsWith('/')) continue;
    // Vite serves /src/* from the project root, not from public/.
    if (ref.startsWith('/src/') || ref.startsWith('/@')) continue;
    publicChecked++;
    const target = path.join(publicDir, decodeURIComponent(ref));
    if (!fs.existsSync(target)) {
      publicBroken++;
      console.log(
        `  ${path.relative(root, srcFile)}  ->  ${ref} (missing)`
      );
    }
  }
}

if (publicChecked > 0) {
  console.log(`Checked ${publicChecked} public asset references.`);
  console.log(
    publicBroken === 0
      ? 'ALL PUBLIC REFERENCES RESOLVE ✔'
      : `BROKEN PUBLIC REFERENCES: ${publicBroken}`
  );
}

if (broken > 0 || gltfBroken > 0 || publicBroken > 0) {
  process.exitCode = 1;
}

