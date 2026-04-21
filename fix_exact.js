const fs = require('fs');
let html = fs.readFileSync('seha.html', 'utf-8');

// I will overwrite the JS injection block with a strict layout enforcer
const scriptStart = html.indexOf('<script>\ndocument.addEventListener("DOMContentLoaded", () => {');
const scriptEnd = html.indexOf('</script>\n</body>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    const newScript = `<script>
document.addEventListener("DOMContentLoaded", () => {
    // 1. Clean up existing Swiper structures and force 100% width on container
    document.querySelectorAll('.swiper.large').forEach(el => el.style.width = '100%');
    
    // Some scraped HTML only has swiper-slide-duplicate because the original scrape happened mid-loop. 
    // Instead of deleting duplicates, we'll strip the duplicate CLASS so Swiper treats them as real!
    // And we'll rely on our explicit slide limit.
    document.querySelectorAll('.swiper-slide-duplicate').forEach(el => {
        el.classList.remove('swiper-slide-duplicate', 'swiper-slide-duplicate-active', 'swiper-slide-duplicate-next', 'swiper-slide-duplicate-prev');
    });

    document.querySelectorAll('.swiper-wrapper').forEach(wrapper => {
        wrapper.style.transform = '';
        wrapper.style.transitionDuration = '';
    });
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.style.width = ''; 
    });
    
    // Eliminate excess slides to strictly have 3 unique cards max per category (for the display)
    // Since we un-duplicated them, we might have 9 identical cards now. We just need to keep 3.
    const largeContainerInner = document.querySelector('.swiper.large .swiper-wrapper');
    if(largeContainerInner) {
         // Keep only the first 3
         const slides = Array.from(largeContainerInner.children);
         if(slides.length > 3) {
             slides.slice(3).forEach(s => s.remove());
         }
    }
    
    // 2. Sync icons
    const largeSlides = document.querySelectorAll('.swiper.large .swiper-slide');
    const smallSlides = document.querySelectorAll('.swiper.small .swiper-slide');
    smallSlides.forEach((slide, idx) => {
        const largeImg = largeSlides[idx]?.querySelector('img');
        const smallImg = slide.querySelector('img');
        if(largeImg && smallImg && !smallImg.getAttribute('src')) {
            smallImg.setAttribute('src', largeImg.getAttribute('src'));
        }
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

    // Hero
    const heroNav = getNav('.main-slider-container .swiper');
    new Swiper('.main-slider-container .swiper', {
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        observer: true, observeParents: true,
        ...heroNav.pagination,
        ...heroNav.navigation,
        rtl: true,
    });
    
    // Services Large
    const largeContainer = document.querySelector('.swiper.large');
    if(largeContainer) {
        const lNav = getNav(largeContainer);
        new Swiper('.swiper.large', {
            loop: false, 
            observer: true, 
            observeParents: true,
            allowTouchMove: true,
            slidesPerView: 3, 
            spaceBetween: 24,
            ...lNav.navigation,
            ...lNav.pagination,
            rtl: true,
        });
    }
    
    // Services Small
    const smallContainer = document.querySelector('.swiper.small');
    if(smallContainer) {
        const sNav = getNav(smallContainer);
        new Swiper('.swiper.small', {
            loop: false,
            observer: true, observeParents: true,
            spaceBetween: 20,
            slidesPerView: 1,
            ...sNav.pagination,
            ...sNav.navigation,
            rtl: true,
        });
    }

    // Ecosystem
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
    
    // Ecosystem Mobile
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

    // Partners
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
    console.log('Fixed exactly 3 slides mapping.');
} else {
    console.log('Script injection boundaries not found');
}
