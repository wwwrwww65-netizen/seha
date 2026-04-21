const fs = require('fs');
const html = fs.readFileSync('seha.html', 'utf-8');

let matches = html.matchAll(/<div class="[^"]*swiper-button-next[^"]*"/g);
let results = [];
for (const match of matches) {
    let index = match.index;
    let context = html.substring(Math.max(0, index - 200), Math.min(html.length, index + 150));
    results.push(context);
}

results.forEach((res, i) => {
    console.log(`Arrow ${i+1}:\n${res}\n---`);
});
