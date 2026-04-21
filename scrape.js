const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless: 'new'
        });
        const page = await browser.newPage();
        await page.goto('https://seha.sa/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const html = await page.evaluate(() => {
            const baseUrl = 'https://seha.sa';
            document.querySelectorAll('img, script').forEach(el => {
                if (el.getAttribute('src') && el.getAttribute('src').startsWith('/')) {
                    el.src = baseUrl + el.getAttribute('src');
                }
            });
            document.querySelectorAll('link, a').forEach(el => {
                if (el.getAttribute('href') && el.getAttribute('href').startsWith('/')) {
                    el.href = baseUrl + el.getAttribute('href');
                }
            });
            return document.documentElement.outerHTML;
        });
        
        fs.writeFileSync('seha.html', '<!DOCTYPE html>\n' + html);
        await browser.close();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
