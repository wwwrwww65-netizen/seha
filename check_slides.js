const fs = require('fs');
const html = fs.readFileSync('seha.html', 'utf-8');

const match = html.match(/class="[^"]*swiper[^"]*large[^"]*"([^]*?)<\/div>\s*<\/div>\s*<div[^>]*swiper-button-prev/i);

if (match) {
    const swiperCore = match[1];
    
    // Find all slides except duplicates
    const slideMatches = swiperCore.match(/<div class="swiper-slide/g);
    const duplicateMatches = swiperCore.match(/swiper-slide-duplicate/g);
    
    const totalSlides = slideMatches ? slideMatches.length : 0;
    const duplicates = duplicateMatches ? duplicateMatches.length : 0;
    const realSlides = totalSlides - duplicates;
    
    console.log('Total slides in large slider:', totalSlides);
    console.log('Real slides (excluding duplicates):', realSlides);
    
    // Check headers/titles of the slides
    const titles = swiperCore.match(/<h2[^>]*>(.*?)<\/h2>/gi);
    if (titles) {
        // Strip html tags
        const strippedTitles = titles.map(t => t.replace(/<[^>]+>/g, ''));
        console.log('Slide titles:');
        console.log(strippedTitles.join('\n'));
    }
} else {
    // maybe HTML structure is different, fallback search
    const largeIdx = html.indexOf('swiper.large');
    if(largeIdx > 0){
        console.log('Found swiper.large but regex failed');
    } else {
        console.log('No large swiper container found at all.');
    }
}
