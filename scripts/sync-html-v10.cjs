const fs = require('fs');
const path = require('path');
const root = process.cwd();
const src = path.join(root, '..', 'warehouse-pro-v10-cloud.html');
const dst = path.join(root, 'public', 'index.html');
if (!fs.existsSync(src)) {
  console.error('source not found:', src);
  process.exit(1);
}
fs.copyFileSync(src, dst);
const h = require('crypto').createHash('sha256').update(fs.readFileSync(dst)).digest('hex').slice(0, 16);
console.log('OK ->', dst, '| sha256:', h + '…');