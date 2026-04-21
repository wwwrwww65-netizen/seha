const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');

// Regex-based clean up to bypass jsdom issues

// Clean up Swiper sliders that unrolled into 11,000px length
// Regex to preserve only the active swiper slide in each swiper container
const activeSlideRegex = /<div class="swiper-slide[^"]*swiper-slide-active[^"]*"[^>]*>.*?<\/div>\s*<\/div>/gs;

// First remove any slide that isn't active
html = html.replace(/<div class="swiper-slide[^"]*"(?:(?!\bsuiper-slide-active\b).)*?>.*?<\/div><\/div><\/div>/g, '');

const regexToFindExtraSlides = /(<div class="swiper-slide(?!.*swiper-slide-active)[^>]*>.*?<\/div>)(?=\s*<div class="swiper-slide)/gs;


// Fix overflow by finding those classes
html = html.replace(/class="(.*?)main-slider-container(.*?)"/g, 'class="$1main-slider-container$2" style="overflow:hidden;"');
html = html.replace(/class="(.*?)mobile-swiper-container(.*?)"/g, 'class="$1mobile-swiper-container$2" style="overflow:hidden;"');
html = html.replace(/class="(.*?)swiper-container(.*?)"/g, 'class="$1swiper-container$2" style="overflow:hidden;"');

html = html.replace(/<body/i, '<body style="height:auto; overflow-x:hidden;"');

fs.writeFileSync('seha.html', html);
console.log('Fixed HTML manually.');
