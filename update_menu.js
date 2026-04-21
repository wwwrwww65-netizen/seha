const fs = require('fs');

function processHtml(filename) {
    if (!fs.existsSync(filename)) return;
    let html = fs.readFileSync(filename, 'utf-8');

    // Make 'الرئيسية' link to index.html and remove active class if not index.html
    const isIndex = filename === 'index.html';
    
    // In seha.html, 'الرئيسية' is <a ... class="... active" href="#/">الرئيسية</a>
    // We will find 'الرئيسية</a>' and replace the whole anchor block.
    
    // Let's do a reliable regex replacement for seha.html
    if (filename === 'seha.html') {
        html = html.replace(
            /<a[^>]*>الرئيسية<\/a>/g,
            `<a data-rr-ui-event-key="1" class="link nav-link" href="index.html">الرئيسية</a><a data-rr-ui-event-key="1.5" class="link nav-link active" href="seha.html">صحه</a>`
        );
        fs.writeFileSync(filename, html, 'utf-8');
        console.log('Fixed seha.html');
    }
}

processHtml('seha.html');
