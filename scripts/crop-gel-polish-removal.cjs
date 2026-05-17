// Crop gel-polish-removal source (1000x500) to 800x800 square hero.
// Strategy: center-crop the most visually interesting region of the 1000x500 source.
// The original is 1000 wide x 500 tall — we need a square. We'll extract a 500x500
// square from the center (250,0,500,500), then resize to 800x800 with sharp.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.resolve(__dirname, '..', 'Nails', 'gel-polish-removal.jpg');
const OUT_DIR = path.resolve(__dirname, '..', 'frontend', 'public', 'images', 'nails');
const OUT = path.join(OUT_DIR, 'gel-polish-removal.jpg');

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error('SRC missing:', SRC);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const meta = await sharp(SRC).metadata();
  console.log('Source:', meta.width, 'x', meta.height);

  // Source is 1000x500. Extract a centered 500x500 square (left=250, top=0).
  // Then resize to 800x800 at quality 85, and ensure we end up <=150 KB.
  let quality = 85;
  let buffer;
  for (let attempt = 0; attempt < 4; attempt++) {
    buffer = await sharp(SRC)
      .extract({ left: 250, top: 0, width: 500, height: 500 })
      .resize(800, 800, { fit: 'cover', kernel: 'lanczos3' })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();
    console.log(`q=${quality} -> ${(buffer.length / 1024).toFixed(1)} KB`);
    if (buffer.length <= 150 * 1024) break;
    quality -= 5;
  }
  fs.writeFileSync(OUT, buffer);
  console.log('Wrote', OUT, `${(buffer.length / 1024).toFixed(1)} KB`);
})().catch((e) => { console.error(e); process.exit(1); });
