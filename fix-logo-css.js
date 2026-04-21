const fs = require('fs');
let html = fs.readFileSync('seha.html', 'utf8');

// The main-slider div needs position:relative for the absolute background-img to work
// Also the background-img needs z-index:0 and the slider container needs z-index:1
const fixCSS = `
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
`;

// Remove old duplicate style we may have added before
html = html.replace(`
<style>
  .main-slider object.background-img {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>
`, '');

// Insert before closing </head>
html = html.replace('</head>', fixCSS + '</head>');

fs.writeFileSync('seha.html', html);
console.log('Fixed: background logo CSS positioning.');
