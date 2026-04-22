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
    // Validate response status before proceeding
if (!response.ok()) throw new Error(`Failed to download logo: ${response.status()}`);
const contentType = response.headers()['content-type'];
if (!contentType.includes('svg')) throw new Error('Downloaded content is not an SVG');
    const svgContent = await response.text();
    
    fs.writeFileSync('seha-logo-animation.svg', svgContent);
    await browser.close();
    console.log('Downloaded SVG. Size:', svgContent.length);
})();
