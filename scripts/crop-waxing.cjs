// Crop and resize Waxing source photos into 800x800 hero images for the
// "Botanika Waxing" promo section. Mirrors scripts/crop-nails.cjs pattern.
//
// Source images were provided pre-shot (not flyers), so each one is a
// single clean hero subject on a soft background — no flyer text, no
// price chips, no watermarks. Crop windows below pick a centered or
// subject-anchored square per image, then sharp fit:cover resizes to
// 800x800 @ ~85% quality JPEG.
//
// Source measurements (verified with sharp .metadata()):
//   facial.jpg  1280x720  (landscape; brow being waxed near center)
//   body.jpg     694x504  (landscape; underarm being waxed, subject ~center-left)
//   arm.jpg      682x584  (landscape; arm + wax strip diagonally, white bg)
//   legs.png    1350x1080 (landscape; bent knee + wax bowl, subject right of center)
//   bikini.jpg  1124x655  (landscape; hip + bikini line, subject center)
//
// Output: frontend/public/images/waxing/*.jpg @ ~85% quality
// All outputs target ~50-150 KB; well under the 250 KB cap.

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SRC_DIR = path.resolve(__dirname, '..', 'Waxing');
const OUT_DIR = path.resolve(__dirname, '..', 'frontend', 'public', 'images', 'waxing');

fs.mkdirSync(OUT_DIR, { recursive: true });

// Per-category crop windows. Each window is a square (width === height)
// extracted from the source, then resized to 800x800 with fit:cover.
const crops = [
  {
    out: 'facial.jpg',
    src: 'facial.jpg',
    // 1280x720 — center brow being waxed. Subject center ~ (640, 360).
    // 720x720 centered horizontally at x:280..1000, full height.
    left: 280, top: 0, width: 720, height: 720,
  },
  {
    out: 'body.jpg',
    src: 'body.jpg',
    // 694x504 — underarm waxing, subject biased toward center.
    // 500x500 centered: x:97..597, y:2..502.
    left: 97, top: 2, width: 500, height: 500,
  },
  {
    out: 'arm.jpg',
    src: 'arm.jpg',
    // 682x584 — arm + wax strip diagonally on white background.
    // 580x580 centered: x:51..631, y:2..582.
    left: 51, top: 2, width: 580, height: 580,
  },
  {
    out: 'legs.jpg',
    src: 'legs.png',
    // 1350x1080 — knee + leg + wax bowl. Subject sits right of horizontal
    // center; lift the square to include knee + wax-bowl, drop background.
    // 1000x1000 centered: x:175..1175, y:40..1040.
    left: 175, top: 40, width: 1000, height: 1000,
  },
  {
    out: 'bikini.jpg',
    src: 'bikini.jpg',
    // 1124x655 — hip + bikini line wax, subject center.
    // 650x650 centered: x:237..887, y:2..652.
    left: 237, top: 2, width: 650, height: 650,
  },
];

(async () => {
  for (const c of crops) {
    const inPath = path.join(SRC_DIR, c.src);
    const outPath = path.join(OUT_DIR, c.out);
    const meta = await sharp(inPath).metadata();
    // Validate crop stays inside source
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
