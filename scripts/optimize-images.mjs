/**
 * Image optimization pipeline.
 *
 * Converts every raster asset (src/assets, src/blogimages) to WebP and
 * rewrites the source imports to point at the .webp files.
 *
 * Usage:
 *   npm run optimize:images          # convert + rewrite imports
 *   npm run optimize:images -- --check  # dry run, report only
 *
 * Requires `sharp` (listed in devDependencies).
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const CHECK_ONLY = process.argv.includes('--check');

/** Directories to optimize, relative to the project root. */
const TARGET_DIRS = ['src/assets', 'src/blogimages'];

/** Max output width per asset (by file name without extension). */
const MAX_WIDTHS = {
  ig: 600,
  createlabz: 1200,
  mobileapp: 1200,
  tiktok: 1200,
  'wraith-king': 1200,
};
const DEFAULT_MAX_WIDTH = 1600;
const QUALITY = 80;

const RASTER_RE = /\.(png|jpe?g)$/i;

/** Import specifiers ending in a raster extension. */
const IMPORT_RE =
  /(["'])((?:\.{1,2}\/)[^"']*?)\.(png|jpe?g)\1/gi;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (RASTER_RE.test(entry.name)) out.push(full);
  }
  return out;
}

function listSourceFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listSourceFiles(full, out);
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Point every relative import that references a raster file at the matching
 * .webp sibling when one exists. Idempotent — safe to run repeatedly.
 */
function rewriteImports() {
  const srcFiles = listSourceFiles(path.join(ROOT, 'src'));
  let touched = 0;

  for (const srcFile of srcFiles) {
    const original = fs.readFileSync(srcFile, 'utf-8');
    const updated = original.replace(
      IMPORT_RE,
      (match, quote, prefix, ext) => {
        const base = path.basename(prefix);
        const webpPath = path.resolve(path.dirname(srcFile), `${prefix}.webp`);
        if (!fs.existsSync(webpPath)) return match;
        return `${quote}${prefix}.webp${quote}`;
      }
    );

    if (updated !== original) {
      fs.writeFileSync(srcFile, updated);
      touched++;
      console.log(`  updated imports in ${path.relative(ROOT, srcFile)}`);
    }
  }

  console.log(`Rewrote imports in ${touched} source file(s).`);
  return touched;
}

const targets = TARGET_DIRS.flatMap((d) => walk(path.join(ROOT, d)));

if (targets.length === 0) {
  console.log('No raster assets found — only checking imports.');
} else {
  console.log(
    `Optimizing ${targets.length} raster asset(s)${CHECK_ONLY ? ' (check only)' : ''}…\n`
  );
}

let converted = 0;
let before = 0;
let after = 0;

for (const file of targets) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const outPath = path.join(path.dirname(file), `${base}.webp`);
  const maxWidth = MAX_WIDTHS[base] ?? DEFAULT_MAX_WIDTH;

  const meta = await sharp(file).metadata();
  const sourceSize = fs.statSync(file).size;
  before += sourceSize;

  const buffer = await sharp(file)
    .resize(maxWidth, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();

  after += buffer.length;

  const pct = Math.round((1 - buffer.length / sourceSize) * 100);
  console.log(
    `  ${path.relative(ROOT, file).padEnd(38)} ${String(meta.width).padStart(5)}px  ` +
      `${String(Math.round(sourceSize / 1024)).padStart(6)}KB -> ` +
      `${String(Math.round(buffer.length / 1024)).padStart(6)}KB  (-${pct}%)`
  );

  if (!CHECK_ONLY) {
    fs.writeFileSync(outPath, buffer);
    fs.unlinkSync(file);
  }
  converted++;
}

if (converted > 0) {
  console.log(
    `\n${converted} asset(s): ${(before / 1024 / 1024).toFixed(2)}MB -> ` +
      `${(after / 1024 / 1024).toFixed(2)}MB ` +
      `(-${Math.round((1 - after / before) * 100)}%)`
  );
}

rewriteImports();

