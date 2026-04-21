const fs = require('fs');
const html = fs.readFileSync('seha.html', 'utf8');
const idx = html.indexOf('main-slider"');
console.log(html.substring(idx, idx + 600));
