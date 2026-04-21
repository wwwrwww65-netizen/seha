const fs = require('fs');
let html = fs.readFileSync('seha.html', 'utf-8');

html = html.replace(
    /\.services-section \.swiper-button/g,
    '.services-content-wrapper .swiper-button' // Actually the original was just .swiper-button, I'll switch it to .services-wrapper
);
html = html.replace(
    /\.services-section \.swiper-pagination/g,
    '.swiper-pagination'
);

// I'll just change the largeSwiper config in seha.html to fix navigation scoping if needed, 
// but wait, in fix-slider.js I hardcoded `.services-section`. I will change it to scope inside the parent properly or just remove the prefix.
html = html.replace(
    /navigation: \{ nextEl: '\.services-section \.swiper-button-next', prevEl: '\.services-section \.swiper-button-prev' \}/,
    `navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }`
);
html = html.replace(
    /pagination: \{ el: '\.services-section \.swiper-pagination', clickable: true \}/,
    `pagination: { el: '.swiper-pagination', clickable: true }`
);

fs.writeFileSync('seha.html', html, 'utf-8');
console.log('Fixed swiper pagination and navigation selectors.');
