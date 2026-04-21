const fs = require('fs');
let html = fs.readFileSync('seha.html', 'utf8');

// Fix the CSS that targets the background logo
// The inline SVG div needs to match original site dimensions:
// On live site: the logo is NOT full width - it's positioned to the right side
// and takes roughly 40-50% of viewport width, maintaining aspect ratio

// Remove old wrong CSS blocks we injected
html = html.replace(`
<style>
  /* Fix animated background logo positioning */
  .main-slider {
    position: relative !important;
    overflow: hidden !important;
  }
  .main-slider object.background-img {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 0 !important;
    pointer-events: none !important;
    min-height: 100% !important;
  }
  .main-slider-container {
    position: relative !important;
    z-index: 1 !important;
  }
  .main-slider .down {
    position: relative !important;
    z-index: 1 !important;
  }
</style>
`, '');

// Inject corrected CSS matching the live site behavior
const correctCSS = `
<style>
  /* Correct background logo sizing to match seha.sa */
  .main-slider {
    position: relative !important;
    overflow: hidden !important;
  }
  /* The inline SVG div wrapper */
  .main-slider .background-img {
    position: absolute !important;
    top: 0 !important;
    right: 0 !important;
    left: auto !important;
    width: 45% !important;
    height: 100% !important;
    z-index: 0 !important;
    pointer-events: none !important;
    opacity: 1 !important;
  }
  /* Ensure the SVG inside scales properly */
  .main-slider .background-img svg {
    width: 100% !important;
    height: 100% !important;
  }
  .main-slider-container {
    position: relative !important;
    z-index: 1 !important;
  }
  .main-slider > div[style*="z-index: 99"] {
    position: relative !important;
    z-index: 2 !important;
  }
</style>
`;

html = html.replace('</head>', correctCSS + '</head>');

fs.writeFileSync('seha.html', html);
console.log('Fixed logo CSS to match seha.sa sizing.');
