const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');

html = html.replace(
    /const largeSwiper = new Swiper\('\.swiper\.large', \{[\s\S]*?rtl: true,\n\s*\}\);/,
    `const largeSwiper = new Swiper('.swiper.large', {
        loop: true,
        allowTouchMove: true,
        slidesPerView: 3,
        spaceBetween: 24,
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 3,
                spaceBetween: 24
            }
        },
        navigation: { nextEl: '.services-section .swiper-button-next', prevEl: '.services-section .swiper-button-prev' },
        pagination: { el: '.services-section .swiper-pagination', clickable: true },
        rtl: true,
    });`
);

fs.writeFileSync('seha.html', html, 'utf-8');
console.log('Fixed Swiper layout for large screen.');
