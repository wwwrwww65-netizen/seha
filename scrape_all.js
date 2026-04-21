const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new',
            defaultViewport: { width: 1280, height: 800 }
        });
    } catch (e) {
        browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless: 'new',
            defaultViewport: { width: 1280, height: 800 }
        });
    }

    const page = await browser.newPage();
    try {
        await page.goto('https://seha.sa/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch(e) {}
    await new Promise(r => setTimeout(r, 3000));

    const results = [];
    const buttons = await page.$$('.tab-button');
    
    for (let i = 0; i < buttons.length; i++) {
        await buttons[i].evaluate(b => b.click());
        await new Promise(r => setTimeout(r, 500));
        
        const tabName = await buttons[i].evaluate(b => {
            const p = b.querySelector('p');
            return p ? p.innerText.trim() : b.innerText.trim();
        });
        
        const cardsHtml = await page.evaluate(() => {
            const swp = document.querySelector('.large.swiper');
            if (!swp) return [];
            const slides = Array.from(swp.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .service-card'));
            return slides.map(card => card.outerHTML);
        });
        
        results.push({ name: tabName, cardsHtml });
    }

    fs.writeFileSync('all_services.json', JSON.stringify(results, null, 2));
    await browser.close();
    console.log('Scraped all services! Total tabs:', results.length);
})();
