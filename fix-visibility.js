const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');

// Strip out any style="opacity: 0;" from the cloned DOM so everything is visible
html = html.replace(/style="opacity:\s*0;?"/g, 'style="opacity: 1; transition: opacity 0.5s ease-in;"');
// Strip transform: none so elements aren't accidentally hidden or offset
html = html.replace(/transform:\s*none;/g, '');

fs.writeFileSync('seha.html', html, 'utf-8');
console.log('Fixed visibility issues.');
