const fs = require('fs');

function checkNav(filename) {
    if(!fs.existsSync(filename)) return;
    const html = fs.readFileSync(filename, 'utf-8');
    const navMatch = html.match(/<nav[^>]*>.*?<\/nav>/s);
    console.log(`--- ${filename} ---`);
    if(navMatch) {
       console.log(navMatch[0].replace(/\n/g, '').replace(/\s+/g, ' ').substring(0, 500));
    } else {
       console.log('No <nav> found');
    }
}

checkNav('index.html');
checkNav('seha.html');
