const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');

// I am rewriting the JS injection block to fix the infinite loop and 3-card problem once and for all.
const scriptStart = html.indexOf('<script>\ndocument.addEventListener("DOMContentLoaded", () => {');
const scriptEnd = html.indexOf('</script>\n</body>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    const newScript = `<script>
document.addEventListener("DOMContentLoaded", () => {
    // 1. Fully rebuild the cards for .swiper.large to ensure 3 unique services are cleanly present
    // The user wants infinite loop + exactly 3 cards visible. 
    // The most robust way is to re-populate the swiper-wrapper with pure HTML of the 3 services.
    
    // The 3 service definitions:
    const services = [
        {
            title: "تراخيص المنشآت الصحية",
            desc: "تمكن هذه الخدمة المستثمرين ومنشآت القطاع الصحي من اصدار وتجديد وإلغاء وتعديل البيانات لتراخيص المنشآت الصحية بشكل آلي .",
            icon: "https://seha.sa/assets/health-licenses-LoPz-KnQ.svg"
        },
        {
            title: "تراخيص الطب البديل والتكميلي",
            desc: "هي خدمة تتيح لمنشآت الطب البديل والتكميلي من إصدار وتجديد تراخيص ممارسين الطب البديل والمنشآت وأيضاً من طلب تصنيف الممارس العاملين لدى المنشأة.",
            icon: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='55'%20height='55'%20viewBox='0%200%2055%2055'%3e%3cg%20id='تراخيص-الطب-البديل'%20transform='translate(-1139.5%20-845)'%3e%3cg%20id='Group_114'%20data-name='Group%20114'%20transform='translate(1139.5%20845)'%3e%3crect%20id='Rectangle_25'%20data-name='Rectangle%2025'%20width='55'%20height='55'%20rx='15'%20fill='%23f4f7fb'/%3e%3c/g%3e%3cg%20id='medical-certificate'%20transform='translate(1144.51%20853.598)'%3e%3cpath%20d='M31.391,35.077H13.7a2.7,2.7,0,0,1-2.7-2.7V5.7A2.7,2.7,0,0,1,13.7,3H28.593L33.566,8.6V32.378a2.7,2.7,0,0,1-2.7,2.7Z'%20fill='none'%20stroke='%23306db5'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e"
        },
        {
            title: "الترميز الطبي 10-ICD",
            desc: "تقديم المنشأة طلب إصدار شهادة الترميز الطبي الأسترالي للنسخة العاشرة من المجلس الصحي السعودي والحصول على الأكواد لاستخدامها في الترميز الطبي.",
            icon: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='55'%20height='55'%20viewBox='0%200%2055%2055'%3e%3cg%20id='الترميز-الطبي-%D9%AB10-ICD'%20transform='translate(-1547.5%20-845)'%3e%3cg%20id='Group_118'%20data-name='Group%20118'%20transform='translate(1547.5%20845)'%3e%3crect%20id='Rectangle_29'%20data-name='Rectangle%2029'%20width='55'%20height='55'%20rx='15'%20fill='%23f4f7fb'/%3e%3c/g%3e%3cg%20id='Layer_19'%20data-name='Layer%2019'%20transform='translate(1558.5%20856)'%3e%3cpath%20d='M28,8l-1.5-1.5h-5.41a6.49,6.49,0,0,0-9.18,0H6.5L5,8H0v8H5l1.5,1.5h19L27,16h6V8Z'%20fill='none'%20stroke='%23306db5'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e"
        }
    ];

    const generateSlideHTML = (srv) => {
        return \`<div class="swiper-slide">
            <div class="service-card">
                <img alt="service-icon" src="\${srv.icon}">
                <p class="slide-title">\${srv.title}</p>
                <p class="slide-sub-title">\${srv.desc}</p>
                <div class="button-group-wrapper">
                    <button type="button" class="btn btn-primary">ابدأ الخدمة</button>
                </div>
            </div>
        </div>\`;
    };

    const largeWrapper = document.querySelector('.swiper.large .swiper-wrapper');
    const smallWrapper = document.querySelector('.swiper.small .swiper-wrapper');
    
    if (largeWrapper) {
        // Since we want infinite loop for 3 cards and slidesPerView is 3, Swiper requires >= 6 slides to loop smoothly.
        // We will generate 3 groups of the identical 3 cards (9 total slides) to guarantee a flawless loop.
        let allSlidesHTML = "";
        for (let i = 0; i < 3; i++) {
            services.forEach(srv => allSlidesHTML += generateSlideHTML(srv));
        }
        
        // Strip out existing garbage slides entirely
        largeWrapper.innerHTML = allSlidesHTML;
        largeWrapper.style.transform = '';
        largeWrapper.style.transitionDuration = '';
    }

    if (smallWrapper) {
        // For mobile, it only displays 1 at a time, so 3 cards is plenty to loop.
        let mobHTML = "";
        services.forEach(srv => mobHTML += generateSlideHTML(srv));
        smallWrapper.innerHTML = mobHTML;
        smallWrapper.style.transform = '';
        smallWrapper.style.transitionDuration = '';
    }

    // Un-break any fixed container width issues globally
    document.querySelectorAll('.swiper.large').forEach(el => {
        el.style.width = '100%';
        el.style.display = 'block';
    });

    const getNav = (containerSelector) => {
        const c = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
        if(!c) return {};
        const parent = c.parentElement;
        const next = c.querySelector('.swiper-button-next') || parent.querySelector('.swiper-button-next');
        const prev = c.querySelector('.swiper-button-prev') || parent.querySelector('.swiper-button-prev');
        const pag = c.querySelector('.swiper-pagination') || parent.querySelector('.swiper-pagination');
        return {
             navigation: (next && prev) ? { nextEl: next, prevEl: prev } : {},
             pagination: pag ? { el: pag, clickable: true } : {}
        };
    };

    // Initialize large Swiper
    const largeContainer = document.querySelector('.swiper.large');
    if(largeContainer) {
        const lNav = getNav(largeContainer);
        new Swiper('.swiper.large', {
            loop: true,                 // INFINITE LOOP ENABLED HERE
            loopedSlides: 3,            // Number of slides created prior to loop initialization
            observer: true, 
            observeParents: true,
            allowTouchMove: true,
            slidesPerView: 3, 
            spaceBetween: 24,
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 }
            },
            ...lNav.navigation,
            ...lNav.pagination,
            rtl: true,
        });
    }

    // Initialize small Swiper
    const smallContainer = document.querySelector('.swiper.small');
    if(smallContainer) {
        const sNav = getNav(smallContainer);
        new Swiper('.swiper.small', {
            loop: true,
            observer: true, observeParents: true,
            spaceBetween: 20,
            slidesPerView: 1,
            ...sNav.pagination,
            ...sNav.navigation,
            rtl: true,
        });
    }

    // Re-initialize Hero
    const heroNav = getNav('.main-slider-container .swiper');
    new Swiper('.main-slider-container .swiper', {
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        observer: true, observeParents: true,
        ...heroNav.pagination,
        ...heroNav.navigation,
        rtl: true,
    });

    // Re-initialize Ecosystem
    const ecoNav = getNav('.seha-eco-container .swiper.swiper-horizontal:not(.mobile-swiper-container)');
    new Swiper('.seha-eco-container .swiper.swiper-horizontal:not(.mobile-swiper-container)', {
        loop: false,
        observer: true, observeParents: true,
        spaceBetween: 30,
        slidesPerView: 'auto',
        ...ecoNav.navigation,
        ...ecoNav.pagination,
        breakpoints: {
            992: { slidesPerView: 2 }
        },
        rtl: true,
    });
    
    // Initialize Ecosystem Mobile
    const ecoMobNav = getNav('.seha-eco-container .mobile-swiper-container');
    new Swiper('.seha-eco-container .mobile-swiper-container', {
        loop: false,
        observer: true, observeParents: true,
        spaceBetween: 20,
        slidesPerView: 1,
        ...ecoMobNav.pagination,
        ...ecoMobNav.navigation,
        rtl: true,
    });

    // Initialize Partners
    const partNav = getNav('.partner-container .swiper');
    new Swiper('.partner-container .swiper', {
        loop: true,
        observer: true, observeParents: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        slidesPerView: 2,
        spaceBetween: 20,
        breakpoints: {
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
        },
        ...partNav.navigation,
        ...partNav.pagination,
        rtl: true,
    });

    const topButton = document.getElementById('top-button');
    const header = document.querySelector('.header.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            topButton.style.display = 'flex';
            topButton.classList.add('fade-in');
            header.classList.add('white', 'shadow-sm'); 
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; 
        } else {
            topButton.style.display = 'none';
            header.classList.remove('white', 'shadow-sm');
            header.style.backgroundColor = 'transparent';
        }
    });
    if(topButton) {
        topButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const scrollWrapper = document.querySelector('.categories-scroll-wrapper');
    let isDown = false;
    let startX;
    let scrollLeft;
    if (scrollWrapper) {
        scrollWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollWrapper.classList.add('active');
            startX = e.pageX - scrollWrapper.offsetLeft;
            scrollLeft = scrollWrapper.scrollLeft;
        });
        scrollWrapper.addEventListener('mouseleave', () => { isDown = false; scrollWrapper.classList.remove('active'); });
        scrollWrapper.addEventListener('mouseup', () => { isDown = false; scrollWrapper.classList.remove('active'); });
        scrollWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollWrapper.offsetLeft;
            const walk = (x - startX) * 2;
            scrollWrapper.scrollLeft = scrollLeft - walk;
        });
    }
});
</script>`;

    html = html.substring(0, scriptStart) + newScript + html.substring(scriptEnd);
    fs.writeFileSync('seha.html', html, 'utf-8');
    console.log('Fixed infinite loop and strictly reproduced cards.');
} else {
    console.log('Script injection boundaries not found');
}
