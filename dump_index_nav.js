const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const navMatch = html.match(/<nav[^>]*>.*?<\/nav>/s);
if (navMatch) {
    fs.writeFileSync('index_nav.txt', navMatch[0], 'utf-8');
}
