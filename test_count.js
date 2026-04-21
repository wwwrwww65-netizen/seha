const fs = require('fs');
const html = fs.readFileSync('seha.html', 'utf-8');

// Find starting points of slides inside .swiper.large
const match = html.match(/class="[^"]*swiper[^"]*large[^"]*"([^]*?)<\/div>\s*<\/div>\s*<div[^>]*swiper-button-prev/i);

if(match) {
    let core = match[1];
    
    let allSlides = core.match(/<div class="swiper-slide/g);
    let duplicates = core.match(/swiper-slide-duplicate/g);
    
    console.log("Total slides in large:", allSlides ? allSlides.length : 0);
    console.log("Duplicate slides in large:", duplicates ? duplicates.length : 0);
} else {
    console.log("Regex missed.");
}
