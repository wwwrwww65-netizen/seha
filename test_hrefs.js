const fs = require('fs');

function dumpHrefs(filename) {
    if(!fs.existsSync(filename)) return;
    const html = fs.readFileSync(filename, 'utf-8');
    
    // Look specifically for where 'الرئيسية' resides.
    const start = html.indexOf('الرئيسية') - 300;
    const end = html.indexOf('الرئيسية') + 300;

    console.log(`--- ${filename} ---`);
    if(start > -300) {
       console.log(html.substring(Math.max(0, start), Math.min(end, html.length)));
    } else {
       console.log('Not found');
    }
}

dumpHrefs('index.html');
dumpHrefs('seha.html');
