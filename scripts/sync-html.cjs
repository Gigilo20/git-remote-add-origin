/**
 * კოპირებს ../warehouse-pro-v9_5.html → public/index.html
 * გაშვება: npm run sync:html (საქაღალდე warehouse-cloud)
 */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const src = path.join(root, '..', 'warehouse-pro-v9_5.html');
const dst = path.join(root, 'public', 'index.html');
if (!fs.existsSync(src)) {
  console.error('წყარო ფაილი არ მოიძებნა:', src);
  process.exit(1);
}
if (!fs.existsSync(path.dirname(dst))) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
}
fs.copyFileSync(src, dst);
const h = require('crypto').createHash('sha256').update(fs.readFileSync(dst)).digest('hex').slice(0, 16);
console.log('OK →', dst, '| sha256:', h + '…');
