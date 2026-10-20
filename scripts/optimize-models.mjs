/**
 * Optimizes glTF texture assets to WebP and patches the scene.gltf image URIs.
 *
 * The .gltf files reference their textures by relative URI in the `images`
 * array. Converting a texture to WebP therefore requires rewriting that URI,
 * which this script does automatically.
 *
 * Usage: node scripts/optimize-models.mjs [--check]
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const CHECK_ONLY = process.argv.includes('--check');

/** Texture max width. Skybox / planet maps stay high-res, smaller props do not. */
const MAX_WIDTHS = {
  Clouds_baseColor: 2048,
  Planet_baseColor: 2048,
};
const DEFAULT_MAX_WIDTH = 1024;
const QUALITY = 82;

function findGltfFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findGltfFiles(full, out);
    else if (entry.name.endsWith('.gltf')) out.push(full);
  }
  return out;
}

const gltfFiles = findGltfFiles(PUBLIC_DIR);
if (gltfFiles.length === 0) {
  console.log('No .gltf files found in public/.');
  process.exit(0);
}

let totalBefore = 0;
let totalAfter = 0;
let rewritten = 0;

for (const gltfPath of gltfFiles) {
  const dir = path.dirname(gltfPath);
  const gltf = JSON.parse(fs.readFileSync(gltfPath, 'utf-8'));
  let fileRewritten = 0;

  console.log(`\n${path.relative(ROOT, gltfPath)}`);

  for (const image of gltf.images ?? []) {
    if (!image.uri || image.uri.startsWith('data:')) continue;

    const srcPath = path.join(dir, image.uri);
    if (!fs.existsSync(srcPath)) {
      console.log(`  ! missing texture: ${image.uri}`);
      continue;
    }
    if (/\.webp$/i.test(image.uri)) continue;

    const base = path.basename(image.uri, path.extname(image.uri));
    // The glTF URI is relative to the .gltf file (e.g. "textures/foo.png"),
    // so the converted file must land in the same directory and the URI must
    // keep its sub-directory prefix.
    const relDir = path.dirname(image.uri);
    const outPath = path.resolve(dir, relDir, `${base}.webp`);
    const maxWidth = MAX_WIDTHS[base] ?? DEFAULT_MAX_WIDTH;

    const meta = await sharp(srcPath).metadata();
    const before = fs.statSync(srcPath).size;

    const buffer = await sharp(srcPath)
      .resize(maxWidth, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toBuffer();

    totalBefore += before;
    totalAfter += buffer.length;

    const pct = Math.round((1 - buffer.length / before) * 100);
    console.log(
      `  ${image.uri.padEnd(42)} ${String(meta.width).padStart(5)}px  ` +
        `${String(Math.round(before / 1024)).padStart(6)}KB -> ` +
        `${String(Math.round(buffer.length / 1024)).padStart(6)}KB  (-${pct}%)`
    );

    if (!CHECK_ONLY) {
      fs.writeFileSync(outPath, buffer);
      fs.unlinkSync(srcPath);
      // Preserve the original sub-directory prefix in the URI.
      image.uri = relDir === "." ? `${base}.webp` : `${relDir}/${base}.webp`;
      rewritten++;
      fileRewritten++;
    }
  }

  if (!CHECK_ONLY && fileRewritten > 0) {
    fs.writeFileSync(gltfPath, `${JSON.stringify(gltf, null, 2)}\n`);
  }
}

if (totalBefore > 0) {
  console.log(
    `\nTextures: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ` +
      `${(totalAfter / 1024 / 1024).toFixed(2)}MB ` +
      `(-${Math.round((1 - totalAfter / totalBefore) * 100)}%)`
  );
}
if (!CHECK_ONLY) console.log(`Rewrote ${rewritten} texture URI(s).`);
