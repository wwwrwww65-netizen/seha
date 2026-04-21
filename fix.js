const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');
const css = fs.readFileSync('index-8wtnlbPv.css', 'utf-8');

// Remove *all* script tags! This stops React from executing and wiping our DOM.
html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// Strip the external stylesheet link since we are embedding it
html = html.replace(/<link[^>]+stylesheet[^>]+index-8wtnlbPv\.css[^>]*>/gi, '');

// Remove crossOrigin and modulepreload attributes that mess with file:///
html = html.replace(/<link[^>]+modulepreload[^>]*>/gi, '');

// Strip remaining crossorigin attributes
html = html.replace(/ crossorigin=""/gi, '');

// Embed the CSS directly! This solves all CORS issues with file:/// 
html = html.replace('</head>', `\n<style>\n${css}\n</style>\n</head>`);

// Write fixed HTML!
fs.writeFileSync('seha.html', html);
console.log('Fixed seha.html for local viewing.');
