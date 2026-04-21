const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    try {
        console.log('Starting exact clone...');
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            defaultViewport: {width: 1920, height: 1080}
        });
        const page = await browser.newPage();
        
        await page.goto('https://seha.sa/', {waitUntil: 'networkidle2', timeout: 60000});
        
        // Wait an extra 2 seconds for visual transitions or swiper initializations
        await new Promise(r => setTimeout(r, 2000));
        
        console.log('Mutating the DOM to freeze the layout and remove react hydration dependencies...');
        const finalHtml = await page.evaluate(() => {
            // Remove scripts to avoid hydration destroying the DOM
            document.querySelectorAll('script').forEach(el => el.remove());
            
            // Remove 'crossorigin' from link tags and modulepreloads so local file:/// doesn't CORS block CSS
            document.querySelectorAll('link').forEach(el => {
                if(el.getAttribute('crossorigin') !== null) {
                    el.removeAttribute('crossorigin');
                }
                if(el.rel === 'modulepreload') {
                    el.remove();
                }
                if(el.href) {
                     el.setAttribute('href', new URL(el.getAttribute('href') || el.href, 'https://seha.sa/').href);
                }
            });
            
            // Convert images/svg usage to absolute URLs
            document.querySelectorAll('img, source, svg image, [href]').forEach(el => {
                if(el.getAttribute('src') && el.getAttribute('src').startsWith('/')) {
                     el.setAttribute('src', new URL(el.getAttribute('src'), 'https://seha.sa/').href);
                }
                if(el.srcset) el.srcset = '';
                if(el.tagName !== 'LINK' && el.getAttribute('href') && el.getAttribute('href').startsWith('/')) {
                     el.setAttribute('href', new URL(el.getAttribute('href'), 'https://seha.sa/').href);
                }
                if(el.tagName === 'OBJECT' && el.getAttribute('data') && el.getAttribute('data').startsWith('/')) {
                     el.setAttribute('data', new URL(el.getAttribute('data'), 'https://seha.sa/').href);
                }
            });
            
            // Fix the CSS to prevent unrolling manually but KEEP all slides
            document.querySelectorAll('.swiper').forEach(swiper => {
                swiper.style.overflow = 'hidden';
                swiper.style.position = 'relative';
            });
            document.querySelectorAll('.swiper-container').forEach(swiper => {
                swiper.style.overflow = 'hidden';
                swiper.style.position = 'relative';
            });
            
            document.querySelectorAll('.swiper-wrapper').forEach(wrapper => {
                wrapper.style.display = 'flex';
                // Note: It's important to not restrict width of wrapper so flex items can sit side-by-side
                wrapper.style.width = '100%'; 
            });

            document.querySelectorAll('.swiper-slide').forEach(slide => {
                slide.style.width = '100%';
                slide.style.flexShrink = '0';
                // Force slides to be horizontally structured
            });

            // Inject custom Vanilla JS swiper to recreate interactivity cleanly
            const customSwiper = document.createElement('script');
            customSwiper.textContent = `
                document.addEventListener('DOMContentLoaded', () => {
                    document.querySelectorAll('.swiper, .swiper-container').forEach(swiper => {
                        const wrapper = swiper.querySelector('.swiper-wrapper');
                        const slides = swiper.querySelectorAll('.swiper-slide');
                        const nextBtn = swiper.querySelector('.swiper-button-next');
                        const prevBtn = swiper.querySelector('.swiper-button-prev');
                        const bullets = swiper.querySelectorAll('.swiper-pagination-bullet');
                        
                        if (!wrapper || slides.length === 0) return;
                        
                        let currentIdx = Array.from(slides).findIndex(s => s.classList.contains('swiper-slide-active'));
                        if (currentIdx === -1) currentIdx = 0;
                        let autoSlideTimer;
                        
                        // RTL sliding logic (translating positive X goes right, which is backwards in RTL)
                        // In RTL, moving to the "next" slide physically translates the wrapper to the right if it's display flex RTL.
                        const directionMult = document.documentElement.dir === 'rtl' ? 1 : -1;
                        
                        const goToSlide = (idx) => {
                            if (idx < 0) idx = slides.length - 1;
                            if (idx >= slides.length) idx = 0;
                            currentIdx = idx;
                            
                            wrapper.style.transition = 'transform 0.5s ease-in-out';
                            wrapper.style.transform = \`translateX(\${directionMult * currentIdx * 100}%)\`;
                            
                            slides.forEach((s, i) => s.classList.toggle('swiper-slide-active', i === currentIdx));
                            bullets.forEach((b, i) => b.classList.toggle('swiper-pagination-bullet-active', i === currentIdx));
                            startAutoSlide();
                        };
                        
                        const startAutoSlide = () => {
                            clearInterval(autoSlideTimer);
                            autoSlideTimer = setInterval(() => goToSlide(currentIdx + 1), 4000);
                        };
                        
                        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIdx + 1));
                        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIdx - 1));
                        
                        bullets.forEach((b, i) => {
                            b.addEventListener('click', () => goToSlide(i));
                        });
                        
                        // Initialize first display physically
                        goToSlide(currentIdx);
                    });
                });
            `;
            document.body.appendChild(customSwiper);
            
            // Ensure no huge overflow
            document.body.style.height = 'auto';
            document.body.style.minHeight = '100vh';
            document.body.style.overflowX = 'hidden';

            return document.documentElement.outerHTML;
        });

        // Save the result as a complete, styled HTML layout
        fs.writeFileSync('seha.html', '<!DOCTYPE html>\n' + finalHtml);
        console.log('Clone successful. Saved perfect frozen DOM to seha.html.');
        
        await browser.close();
    } catch (err) {
        console.error('Error during clone:', err);
    }
})();
