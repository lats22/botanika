// Get pixel dimensions of source flyer JPGs using JPEG SOFn marker scan
// No deps. Run: node scripts/identify-nails.cjs
const fs = require('fs');
const path = require('path');

function getJpegSize(filePath) {
  const buf = fs.readFileSync(filePath);
  let i = 0;
  if (buf[i] !== 0xFF || buf[i+1] !== 0xD8) throw new Error('Not JPEG: ' + filePath);
  i += 2;
  while (i < buf.length) {
    if (buf[i] !== 0xFF) { i++; continue; }
    // skip fill bytes
    while (buf[i] === 0xFF) i++;
    const marker = buf[i]; i++;
    // standalone markers (no length)
    if (marker === 0x01 || (marker >= 0xD0 && marker <= 0xD9)) continue;
    const segLen = buf.readUInt16BE(i);
    // SOFn markers: 0xC0-0xCF except 0xC4, 0xC8, 0xCC
    if (
      (marker >= 0xC0 && marker <= 0xCF) &&
      marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC
    ) {
      // structure: [length:2][precision:1][height:2][width:2][...]
      const height = buf.readUInt16BE(i + 3);
      const width = buf.readUInt16BE(i + 5);
      return { width, height };
    }
    i += segLen;
  }
  throw new Error('No SOF found: ' + filePath);
}

const NAILS_DIR = 'C:\\Users\\LENOVO.LENOVO\\AI\\botanika\\Nails';
const files = [
  '20260428_034138000_iOS 1.jpg',     // manicure / pedicure
  '20260428_034139000_iOS.jpg',       // gel polish
  '20260428_034139000_iOS 1.jpg',     // nail extensions
  '20260428_034140000_iOS.jpg',       // nail art
];
for (const f of files) {
  const p = path.join(NAILS_DIR, f);
  const { width, height } = getJpegSize(p);
  console.log(`${f} -> ${width} x ${height}`);
}
