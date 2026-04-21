const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');

const scriptStart = html.indexOf('<script>\ndocument.addEventListener("DOMContentLoaded", () => {');
const scriptEnd = html.indexOf('</script>\n</body>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    const newScript = `<script>
document.addEventListener("DOMContentLoaded", () => {
    // 1. Clean up existing Swiper structures
    document.querySelectorAll('.swiper-slide-duplicate').forEach(el => el.remove());
    document.querySelectorAll('.swiper-wrapper').forEach(wrapper => {
        wrapper.style.transform = '';
        wrapper.style.transitionDuration = '';
    });
    // Strip fixed widths that were frozen by previous hydration
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.style.width = ''; 
    });
    
    // 2. Sync icons
    const largeSlides = document.querySelectorAll('.swiper.large .swiper-slide:not(.swiper-slide-duplicate)');
    const smallSlides = document.querySelectorAll('.swiper.small .swiper-slide:not(.swiper-slide-duplicate)');
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
            loop: false, // Prevent breaking if < 3 slides
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

    // Header updates
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
    document.querySelector('.text-center.down')?.addEventListener('click', () => {
        document.getElementById('#home-services-section')?.scrollIntoView({behavior: 'smooth'});
    });

    // Horizontal drag to scroll
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
        scrollWrapper.addEventListener('mouseleave', () => {
            isDown = false;
            scrollWrapper.classList.remove('active');
        });
        scrollWrapper.addEventListener('mouseup', () => {
            isDown = false;
            scrollWrapper.classList.remove('active');
        });
        scrollWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollWrapper.offsetLeft;
            const walk = (x - startX) * 2;
            scrollWrapper.scrollLeft = scrollLeft - walk;
        });
        const arrows = document.querySelectorAll('.categories-wrapper .scroll-arrow');
        if (arrows.length === 2) {
            arrows[0].addEventListener('click', () => scrollWrapper.scrollBy({ left: 150, behavior: 'smooth' }));
            arrows[1].addEventListener('click', () => scrollWrapper.scrollBy({ left: -150, behavior: 'smooth' }));
        }
    }
    
    // Mobile menu toggle
    const menuBtn = document.querySelector('.navbar-toggler');
    const collapseDiv = document.getElementById('responsive-navbar-nav');
    if(menuBtn && collapseDiv) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('collapsed');
            if(collapseDiv.classList.contains('show')) {
                collapseDiv.style.height = '0px';
                setTimeout(() => { collapseDiv.classList.remove('show'); }, 300);
            } else {
                collapseDiv.classList.add('show');
                collapseDiv.style.height = collapseDiv.scrollHeight + 'px';
                setTimeout(() => { collapseDiv.style.height = 'auto'; }, 300);
            }
        });
    }

    // Tabs
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            tabs.forEach(t => {
               const img = t.querySelector('img');
               if(img) img.remove();
            });
            target.insertAdjacentHTML('beforeend', \`<img alt="arrow-left-white" src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16.384'%20height='16.384'%20viewBox='0%200%2016.384%2016.384'%3e%3cpath%20id='bx-left-arrow-alt'%20d='M16.8,22.6l-5.244-5.243H23.263V14.91H11.555L16.8,9.666,15.072,7.939,6.879,16.132l8.192,8.192Z'%20transform='translate(-6.879%20-7.939)'%20fill='%23fff'/%3e%3c/svg%3e" style="transform: rotate(0deg);">\`);
        });
    });
});
</script>`;

    html = html.substring(0, scriptStart) + newScript + html.substring(scriptEnd);
    fs.writeFileSync('seha.html', html, 'utf-8');
    console.log('Fixed Swiper layout observer and inline width removal.');
}
