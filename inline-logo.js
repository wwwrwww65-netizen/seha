const fs = require('fs');
let html = fs.readFileSync('seha.html', 'utf8');
const svgContent = fs.readFileSync('seha-logo-animation.svg', 'utf8');

// Replace the <object> tag with inline SVG wrapped in a div
const objectTag = '<object type="image/svg+xml" data="https://seha.sa/seha-logo-animation-new.svg" class="background-img"></object>';

const inlineSvg = `<div class="background-img" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;">
  ${svgContent}
</div>`;

if (html.includes(objectTag)) {
    html = html.replace(objectTag, inlineSvg);
    console.log('Replaced <object> with inline SVG successfully!');
} else {
    console.log('Object tag not found! Trying alternative...');
    const altTag = '<object type="image/svg+xml" data="/seha-logo-animation-new.svg" class="background-img"></object>';
    if (html.includes(altTag)) {
        html = html.replace(altTag, inlineSvg);
        console.log('Replaced alternative object tag with inline SVG!');
    } else {
        console.log('Neither tag found. Current background-img html:');
        const idx = html.indexOf('background-img');
        console.log(html.substring(idx - 10, idx + 200));
    }
}

fs.writeFileSync('seha.html', html);
console.log('Done.');
