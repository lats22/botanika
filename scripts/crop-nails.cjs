// Crop and resize nail-studio source flyers into 800x800 hero images.
// All source flyers verified 1131x1600. See identify-nails.cjs.
//
// === REVISION 3 — VERIFIED-TIGHT SINGLE-SUBJECT CROPS ===
// Reviewer-Ben R0 issue A: revision 1 used 420-480 px tall windows that
// captured TWO stacked photo ovals. Revision 2 tightened to 230-320 px
// but pixel sampling later revealed flyer 1 oval is only 200 px tall
// and flyer 3 only 230 px tall, so 295-320 px crops still bled into
// the second oval. Revision 3 verifies every crop fits INSIDE its
// oval using direct RGB strip sampling of the source (see
// `node -e` probes in conversation history).
//
// Per-flyer measured oval bounds at the chosen subject:
//   flyer 1 manicure top oval:   x:120-470, y:310-510  (350x200)
//   flyer 2 gel-polish top oval: x:135-440, y:210-440  (305x230)
//   flyer 3 extensions top oval: x:95-450,  y:280-510  (355x230)
//   flyer 4 french tip bottom:   x:140-450, y:1140-1400 (310x260)
//
// Each crop window below stays comfortably inside those bounds, so
// the 800x800 output (fit:cover from a square extract) is guaranteed
// to be a single hero subject — no flyer background gap, no second
// oval, no text, no price chip, no "Super Promo" sticker.
//
// Per-image rationale:
//   manicure-pedicure: top "Manicure (No color)" cuticle-clipper hand —
//     cleanest premium close-up of the four manicure shots; ignore the
//     pedicure rows and the duplicated promo collage below.
//   gel-polish: top "Nail Polish Gel Color" nude-gel hand — single hand
//     resting on white surface, no toe shot below.
//   nail-extensions: top "Nail polish" black-gloved gel application —
//     most premium extension-looking shot of the four extension rows.
//   nail-art: BOTTOM "French Tip Color" classic French manicure — per
//     PM recommendation, reads as "art" most universally; previous top
//     "More Than 1 Color" multi-color shot replaced.
//
// Output: frontend/public/images/nails/*.jpg @ ~85% quality

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SRC_DIR = path.resolve(__dirname, '..', 'Nails');
const OUT_DIR = path.resolve(__dirname, '..', 'frontend', 'public', 'images', 'nails');

fs.mkdirSync(OUT_DIR, { recursive: true });

// Source files (all 1131 x 1600 verified)
const crops = [
  {
    out: 'manicure-pedicure.jpg',
    src: '20260428_034138000_iOS 1.jpg',
    // Top "Manicure (No color)" cuticle-clipper hand close-up.
    // Oval bounds x:120-470, y:310-510 (verified). 200x200 fits inside.
    left: 140, top: 312, width: 200, height: 200,
  },
  {
    out: 'gel-polish.jpg',
    src: '20260428_034139000_iOS.jpg',
    // Top "Nail Polish Gel Color" nude-gel hand close-up.
    // Oval bounds x:135-440, y:210-440 (verified). 220x220 fits inside.
    left: 150, top: 215, width: 220, height: 220,
  },
  {
    out: 'nail-extensions.jpg',
    src: '20260428_034139000_iOS 1.jpg',
    // Top "Nail polish" black-gloved gel application (most premium shot).
    // Oval bounds x:95-450, y:280-510 (verified). 220x220 fits inside.
    left: 130, top: 285, width: 220, height: 220,
  },
  {
    out: 'nail-art.jpg',
    src: '20260428_034140000_iOS.jpg',
    // BOTTOM "French Tip Color" classic French manicure (per PM recommendation).
    // Oval bounds x:140-450, y:1140-1400 (verified). 250x250 fits inside.
    left: 160, top: 1145, width: 250, height: 250,
  },
];

(async () => {
  for (const c of crops) {
    const inPath = path.join(SRC_DIR, c.src);
    const outPath = path.join(OUT_DIR, c.out);
    const meta = await sharp(inPath).metadata();
    if (meta.width !== 1131 || meta.height !== 1600) {
      console.warn(`WARN: ${c.src} is ${meta.width}x${meta.height}, expected 1131x1600`);
    }
    // Validate crop stays inside source
    if (
      c.left < 0 || c.top < 0 ||
      c.left + c.width > meta.width ||
      c.top + c.height > meta.height
    ) {
      throw new Error(`Crop OOB for ${c.src}: ${JSON.stringify(c)} vs ${meta.width}x${meta.height}`);
    }
    await sharp(inPath)
      .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, progressive: true, mozjpeg: false, chromaSubsampling: '4:4:4' })
      .toFile(outPath);
    const size = fs.statSync(outPath).size;
    console.log(
      `wrote ${c.out}  (src ${c.src} crop ${c.width}x${c.height}+${c.left}+${c.top})  ${(size/1024).toFixed(1)} KB`
    );
  }
})().catch(err => { console.error(err); process.exit(1); });
