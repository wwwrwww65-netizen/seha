const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new'
        });
    } catch(e) {
        browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless: 'new'
        });
    }

    const page = await browser.newPage();
    // Fetch the SVG file content directly
    const response = await page.goto('https://seha.sa/seha-logo-animation-new.svg');
    const svgContent = await response.text();
    
    fs.writeFileSync('seha-logo-animation.svg', svgContent);
    await browser.close();
    console.log('Downloaded SVG. Size:', svgContent.length);
})();
