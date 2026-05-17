// Convert all JPG/JPEG images under frontend/public/images/ to WebP.
// Quality 80, effort 4. Originals kept untouched for <picture> fallback.
// Skips logo.jpg, favicon files, and any SVG/PNG.
// Run: node scripts/convert-to-webp.cjs
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', 'frontend', 'public', 'images');

// Files to NEVER convert (logo/favicon — typically already small & kept as-is)
const SKIP_BASENAMES = new Set([
  'logo.jpg',
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  if (!fs.existsSync(ROOT)) {
    console.error('Images root not found:', ROOT);
    process.exit(1);
  }
  const all = walk(ROOT);
  const jpgs = all.filter((p) => {
    const base = path.basename(p);
    if (SKIP_BASENAMES.has(base)) return false;
    return /\.(jpe?g)$/i.test(p);
  });

  let converted = 0;
  let skipped = 0;
  let failed = 0;

  for (const src of jpgs) {
    const dst = src.replace(/\.(jpe?g)$/i, '.webp');
    try {
      // Skip if existing webp is newer than source
      if (fs.existsSync(dst)) {
        const srcStat = fs.statSync(src);
        const dstStat = fs.statSync(dst);
        if (dstStat.mtimeMs >= srcStat.mtimeMs) {
          skipped++;
          continue;
        }
      }
      await sharp(src)
        .webp({ quality: 80, effort: 4 })
        .toFile(dst);
      converted++;
      console.log('OK  ', path.relative(ROOT, src), '->', path.basename(dst));
    } catch (err) {
      failed++;
      console.error('FAIL', path.relative(ROOT, src), err.message);
    }
  }

  console.log(`\nDone. converted=${converted} skipped=${skipped} failed=${failed} total=${jpgs.length}`);
  if (failed > 0) process.exit(2);
}

main();
