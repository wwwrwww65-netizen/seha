const fs = require('fs');
let html = fs.readFileSync('seha.html', 'utf8');

// Remove the previously injected CSS block (both old ones)
html = html.replace(/\n<style>\n  \/\* Correct background logo sizing[\s\S]*?<\/style>\n/, '\n');
html = html.replace(/\n<style>\n  \/\* Exact CSS from seha\.sa[\s\S]*?<\/style>\n/, '\n');

// Apply the EXACTLY CORRECT CSS derived from live site inspection:
// Live site computed values at 1920px viewport:
//   width: 1905px, right: 476.25px (=25% of 1905), left: -476.25px (off-screen)
//   So: width=100vw (approximately), right=25% of element width (or right: 25%)
//   The key: right:25% pushes it so only the left portion peeks in from the left
//   height: 1069px (top: -381, bottom: 688 = from -381 to 688 = 1069px tall, top: -30% approx)
const exactCSS = `
<style>
  /* background logo - exact match from seha.sa computed values at 1920px viewport */
  .main-slider .background-img {
    position: absolute !important;
    top: unset !important;
    bottom: 0 !important;
    /* In RTL: right:25% from right edge, left edge extends off-screen to the left */
    right: 25% !important;
    left: auto !important;
    width: 100vw !important;   /* ~1905px at 1920 viewport */
    height: 112% !important;   /* corresponding to top:-30% from original mobile css */
    z-index: 0 !important;
    pointer-events: none !important;
    overflow: visible !important;
  }
  .main-slider .background-img svg {
    width: 100% !important;
    height: 100% !important;
  }
  .main-slider {
    position: relative !important;
    overflow: hidden !important;
  }
  .main-slider-container {
    position: relative !important;
    z-index: 1 !important;
  }
</style>
`;

html = html.replace('</head>', exactCSS + '</head>');

fs.writeFileSync('seha.html', html);
console.log('Applied exact computed position from live site.');
