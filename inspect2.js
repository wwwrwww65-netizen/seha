const fs = require('fs');
const html = fs.readFileSync('seha.html', 'utf-8');

const sIdx = html.indexOf('id="#home-services-section"');
if (sIdx !== -1) {
    const end = Math.min(sIdx + 6000, html.length);
    fs.writeFileSync('inspect_result2.txt', html.substring(sIdx, end));
} else {
    fs.writeFileSync('inspect_result2.txt', 'Not found');
}
