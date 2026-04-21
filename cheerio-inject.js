const fs = require('fs');
const cheerio = require('cheerio');

const allServices = JSON.parse(fs.readFileSync('all_services.json', 'utf-8'));
let html = fs.readFileSync('seha.html', 'utf-8');

const $ = cheerio.load(html);

const $rightCol = $('.services-container .right-column');
const $content = $('.services-container .content-tabs, .services-container .content').first();

if ($rightCol.length && $content.length) {
    $rightCol.empty();
    $rightCol.append(`
        <h1 class="heading">الخدمات</h1>
        <p class="sub-heading">الخدمات الأكثر استخداما</p>
        <div class="tabs-list" style="display:flex; flex-direction:column;"></div>
    `);

    const $tabsList = $rightCol.find('.tabs-list');
    $content.empty();
    $content.attr('class', 'text-center content');
    $content.css('overflow', 'hidden');
    $content.css('padding-right', '20px');

    allServices.forEach((srv, idx) => {
        const isActive = idx === 0;
        const arrowHtml = isActive ? `<img alt="arrow-left-white" src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16.384'%20height='16.384'%20viewBox='0%200%2016.384%2016.384'%3e%3cpath%20id='bx-left-arrow-alt'%20d='M16.8,22.6l-5.244-5.243H23.263V14.91H11.555L16.8,9.666,15.072,7.939,6.879,16.132l8.192,8.192Z'%20transform='translate(-6.879%20-7.939)'%20fill='%23fff'/%3e%3c/svg%3e" style="transform: rotate(0deg);">` : '';

        $tabsList.append(`
            <button class="tab-button button-small ${isActive ? 'active' : ''}" onclick="openServiceTab(event, 'srv_${idx}')">
                <p>${srv.name}</p>${arrowHtml}
            </button>
        `);

        let cleanedHTML = srv.cardsHtml.join('')
            .replace(/swiper-slide-duplicate(-next|-prev|-active)?/g, '')
            .replace(/swiper-slide-(next|active|prev)/g, '');

        $content.append(`
            <div id="srv_${idx}" class="srv-tab-content ${isActive ? 'active-tab' : ''}" style="display: ${isActive ? 'block' : 'none'}; width: 100%;">
                <div class="section-header-wrapper">
                    <h3>${srv.name}</h3>
                    <div class="divider"></div>
                </div>
                <div class="swiper swiper-horizontal swiper-rtl large" dir="rtl">
                  <div class="swiper-wrapper">
                      ${cleanedHTML}
                  </div>
                </div>
            </div>
        `);
    });

    $('body').append(`
        <script>
            function openServiceTab(evt, tabId) {
                var tabs = document.getElementsByClassName("srv-tab-content");
                for (var i = 0; i < tabs.length; i++) {
                    tabs[i].style.display = "none";
                    tabs[i].classList.remove("active-tab");
                }
                var btns = document.getElementsByClassName("tab-button");
                for (var i = 0; i < btns.length; i++) {
                    btns[i].className = btns[i].className.replace(" active", "");
                    var arr = btns[i].querySelector('img');
                    if (arr) arr.remove();
                }
                document.getElementById(tabId).style.display = "block";
                document.getElementById(tabId).classList.add("active-tab");
                evt.currentTarget.className += " active";
                var img = document.createElement('img');
                img.alt = 'arrow-left-white';
                img.src = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16.384'%20height='16.384'%20viewBox='0%200%2016.384%2016.384'%3e%3cpath%20id='bx-left-arrow-alt'%20d='M16.8,22.6l-5.244-5.243H23.263V14.91H11.555L16.8,9.666,15.072,7.939,6.879,16.132l8.192,8.192Z'%20transform='translate(-6.879%20-7.939)'%20fill='%23fff'/%3e%3c/svg%3e";
                img.style.transform = 'rotate(0deg)';
                evt.currentTarget.appendChild(img);
            }
        </script>
        <style>
            /* Fix Swiper flex layout for static HTML */
            #\\#home-services-section .large.swiper .swiper-wrapper {
                display: flex !important;
                gap: 20px !important;
                width: auto !important;
                transform: none !important;
            }
            #\\#home-services-section .large.swiper .swiper-slide {
                width: 320px !important;
                flex-shrink: 0 !important;
                margin: 0 !important;
            }
            .srv-tab-content { animation: fadeIn 0.4s ease-in-out; }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    `);

    let finalHtml = $.html();
    fs.writeFileSync('seha.html', finalHtml);
    console.log('Done! Services injected successfully.');
} else {
    console.log('ERROR: Could not find .right-column or .content. rightCol:', $rightCol.length, 'content:', $content.length);
}
