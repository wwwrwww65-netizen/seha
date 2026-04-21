const fs = require('fs');
const html = fs.readFileSync('seha.html', 'utf-8');

const idx = html.indexOf('التراخيص الصحية');
if (idx !== -1) {
    const start = Math.max(0, idx - 1000);
    const end = Math.min(html.length, idx + 2000);
    fs.writeFileSync('inspect_result.txt', html.substring(start, end));
} else {
    fs.writeFileSync('inspect_result.txt', 'Not found');
}
