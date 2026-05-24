const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const UPLOADS = path.join(__dirname, 'static/uploads');

async function processDir(dir, maxWidth, quality) {
  const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  for (const file of files) {
    const src = path.join(dir, file);
    const dest = path.join(dir, path.basename(file, path.extname(file)) + '.webp');
    try {
      await sharp(src).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality }).toFile(dest);
      const before = fs.statSync(src).size;
      const after = fs.statSync(dest).size;
      console.log(`  ${file} → ${path.basename(dest)} (${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB)`);
      fs.unlinkSync(src);
    } catch (e) {
      console.error(`  ERROR: ${file}: ${e.message}`);
    }
  }
}

(async () => {
  console.log('=== Byt photos (1400px, q82) ===');
  await processDir(path.join(UPLOADS, 'byty'), 1400, 82);

  console.log('\n=== Pudorysy (1000px, q90) ===');
  await processDir(path.join(UPLOADS, 'pudorysy'), 1000, 90);
})();
