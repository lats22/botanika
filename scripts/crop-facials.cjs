// Crop and resize Facials source photos into 800x800 hero images for the
// services #13 + #14 cards. Mirrors scripts/crop-waxing.cjs pattern.
//
// Source images are clean stock-style hero shots — single subject, no
// flyer text, no price chips, no watermarks. Crop windows below pick a
// subject-anchored square per image, then sharp fit:cover resizes to
// 800x800 @ ~85% quality JPEG.
//
// Source measurements (verified with sharp .metadata()):
//   collagen-mask.jpg  1055x591  (landscape; sheet mask face + temple hands)
//   aloe-vera-mask.jpg  660x535  (landscape; green aloe mask half-face + bowl)
//
// Output: frontend/public/images/services/*.jpg @ ~85% quality
// All outputs target ~50-150 KB; well under the 150 KB cap.

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SRC_DIR = path.resolve(__dirname, '..', 'Facials');
const OUT_DIR = path.resolve(__dirname, '..', 'frontend', 'public', 'images', 'services');

fs.mkdirSync(OUT_DIR, { recursive: true });

// Per-image crop windows. Each window is a square (width === height)
// extracted from the source, then resized to 800x800 with fit:cover.
const crops = [
  {
    out: 'collagen-mask.jpg',
    src: 'collagen-mask.jpg',
    // 1055x591 — sheet mask face centered horizontally with therapist
    // hands at temples. Eyes/mouth center ~x=520. Take a 591x591 square
    // centered slightly left of geometric center to keep both hands.
    // 591x591 at x:210..801, full height y:0..591.
    left: 210, top: 0, width: 591, height: 591,
  },
  {
    out: 'aloe-vera-mask.jpg',
    src: 'aloe-vera-mask.jpg',
    // 660x535 — green aloe mask being brushed onto half-face with bowl
    // on right and brush on top. Face slightly left of center, bowl on
    // right (x~470-630). Take 535x535 biased right to keep bowl in frame.
    // 535x535 at x:63..598, full height y:0..535.
    left: 63, top: 0, width: 535, height: 535,
  },
];

(async () => {
  for (const c of crops) {
    const inPath = path.join(SRC_DIR, c.src);
    const outPath = path.join(OUT_DIR, c.out);
    const meta = await sharp(inPath).metadata();
    if (
      c.left < 0 || c.top < 0 ||
      c.left + c.width > meta.width ||
      c.top + c.height > meta.height
    ) {
      throw new Error(
        `Crop OOB for ${c.src}: ${JSON.stringify(c)} vs ${meta.width}x${meta.height}`
      );
    }
    await sharp(inPath)
      .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, progressive: true, mozjpeg: false, chromaSubsampling: '4:4:4' })
      .toFile(outPath);
    const size = fs.statSync(outPath).size;
    console.log(
      `wrote ${c.out}  (src ${c.src} ${meta.width}x${meta.height} crop ${c.width}x${c.height}+${c.left}+${c.top})  ${(size/1024).toFixed(1)} KB`
    );
  }
})().catch(err => { console.error(err); process.exit(1); });
