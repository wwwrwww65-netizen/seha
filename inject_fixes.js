const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');

const injectionCode = `
<!-- SWIPER CSS AND JS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", () => {
    // 1. Clean up existing Swiper structures (remove duplicates created by React/Hydration) completely
    document.querySelectorAll('.swiper-slide-duplicate').forEach(el => el.remove());
    document.querySelectorAll('.swiper-wrapper').forEach(wrapper => {
        wrapper.style.transform = '';
        wrapper.style.transitionDuration = '';
    });
    
    // 2. Sync icons from large swiper to small swiper (Fix empty src on mobile)
    const largeSlides = document.querySelectorAll('.swiper.large .swiper-slide:not(.swiper-slide-duplicate)');
    const smallSlides = document.querySelectorAll('.swiper.small .swiper-slide:not(.swiper-slide-duplicate)');
    
    smallSlides.forEach((slide, idx) => {
        const largeImg = largeSlides[idx]?.querySelector('img');
        const smallImg = slide.querySelector('img');
        if(largeImg && smallImg && !smallImg.getAttribute('src')) {
            smallImg.setAttribute('src', largeImg.getAttribute('src'));
        }
    });

    // 3. Initialize Swipers correctly
    // Hero Slider
    new Swiper('.main-slider-container .swiper', {
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        rtl: true,
    });
    
    // Services Large & Small Swipers sync and initialize
    const largeSwiper = new Swiper('.swiper.large', {
        loop: true,
        allowTouchMove: false,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
        rtl: true,
    });
    
    const smallSwiper = new Swiper('.swiper.small', {
        loop: true,
        spaceBetween: 20,
        slidesPerView: 1,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        rtl: true,
    });

    // Ecosystem Slider
    new Swiper('.seha-eco-container .swiper.swiper-horizontal:not(.mobile-swiper-container)', {
        loop: false,
        spaceBetween: 30,
        slidesPerView: 'auto',
        navigation: { nextEl: '.seha-eco-container .swiper-button-next', prevEl: '.seha-eco-container .swiper-button-prev' },
        pagination: { el: '.seha-eco-container .swiper-pagination', clickable: true },
        breakpoints: {
            992: { slidesPerView: 2 }
        },
        rtl: true,
    });
    
    // Ecosystem Mobile Slider
    new Swiper('.seha-eco-container .mobile-swiper-container', {
        loop: false,
        spaceBetween: 20,
        slidesPerView: 1,
        pagination: { el: '.seha-eco-container .mobile-swiper-container .swiper-pagination', clickable: true },
        navigation: { nextEl: '.seha-eco-container .mobile-swiper-container .swiper-button-next', prevEl: '.seha-eco-container .mobile-swiper-container .swiper-button-prev' },
        rtl: true,
    });

    // Partners Slider
    new Swiper('.partner-container .swiper', {
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        slidesPerView: 2,
        spaceBetween: 20,
        breakpoints: {
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
        },
        navigation: { nextEl: '.partner-container .swiper-button-next', prevEl: '.partner-container .swiper-button-prev' },
        rtl: true,
    });

    // 4. Back to top button & Sticky Header
    const topButton = document.getElementById('top-button');
    const header = document.querySelector('.header.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            topButton.style.display = 'flex';
            topButton.classList.add('fade-in');
            header.classList.add('white', 'shadow-sm'); 
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // Match original white frosted look
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
    
    // Down Arrow Bobbing Click
    document.querySelector('.text-center.down')?.addEventListener('click', () => {
        document.getElementById('#home-services-section')?.scrollIntoView({behavior: 'smooth'});
    });

    // 5. Horizontal drag to scroll for categories wrapper
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
            const walk = (x - startX) * 2; // Scroll-fast
            scrollWrapper.scrollLeft = scrollLeft - walk;
        });
        
        // Also add click listeners for left/right scroll arrows
        const arrows = document.querySelectorAll('.categories-wrapper .scroll-arrow');
        if (arrows.length === 2) {
            arrows[0].addEventListener('click', () => scrollWrapper.scrollBy({ left: 150, behavior: 'smooth' }));
            arrows[1].addEventListener('click', () => scrollWrapper.scrollBy({ left: -150, behavior: 'smooth' }));
        }
    }
    
    // 6. Tabs interaction visual switch
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            // Adding dummy rotation icon fix
            tabs.forEach(t => {
               const img = t.querySelector('img');
               if(img) img.remove();
            });
            target.insertAdjacentHTML('beforeend', \`<img alt="arrow-left-white" src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16.384'%20height='16.384'%20viewBox='0%200%2016.384%2016.384'%3e%3cpath%20id='bx-left-arrow-alt'%20d='M16.8,22.6l-5.244-5.243H23.263V14.91H11.555L16.8,9.666,15.072,7.939,6.879,16.132l8.192,8.192Z'%20transform='translate(-6.879%20-7.939)'%20fill='%23fff'/%3e%3c/svg%3e" style="transform: rotate(0deg);">\`);
            
            // Optional: simulate updating text content logic if needed
        });
    });
});
</script>
</body>
`;

if (!html.includes('https://cdn.jsdelivr.net/npm/swiper@11')) {
    html = html.replace('</body>', injectionCode);
    
    // Fix an issue where partner-container opacity is 0 due to hydration fade-in logic
    html = html.replace(/<div class="test-center partner-container"[^>]*style="opacity: 0;"/g, '<div class="test-center partner-container" style="opacity: 1;"');
    html = html.replace('style="opacity: 0;"', 'style="opacity: 1;"'); // faq section
    html = html.replace('style="opacity: 0;"', 'style="opacity: 1;"'); // partner section
    
    fs.writeFileSync('seha.html', html, 'utf-8');
    console.log('Successfully injected Swiper logic and Scroll Listeners.');
} else {
    console.log('Script already injected.');
}
