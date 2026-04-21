const fs = require('fs');
let html = fs.readFileSync('seha.html', 'utf8');

// Remove old wrong CSS we injected
html = html.replace(/\n<style>\n  \/\* Correct background logo sizing to match seha\.sa \*\/[\s\S]*?<\/style>\n/, '\n');

// Inject the EXACT CSS from the live site
const exactCSS = `
<style>
  /* Exact CSS from seha.sa for the background logo */
  .main-slider {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5%;
    height: calc(100vh + 116px);
    width: 100%;
    position: relative;
    background: linear-gradient(180deg, #f1f2f8 15%, #fefeff 50%);
  }
  .main-slider .background-img {
    inset: -30% 0 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
  @media (min-width: 992px) {
    .main-slider .background-img {
      position: absolute;
      top: unset;
      bottom: 0;
      right: 25%;
      left: 100%;
    }
    .main-slider {
      background: #fff;
      background: linear-gradient(233deg, #f1f2f8, #fefeff);
      margin-top: -20%;
      padding-top: 13%;
      background-blend-mode: hard-light;
    }
  }
  .main-slider-container {
    position: relative;
    z-index: 1;
  }
  /* SVG inside the inline div */
  .main-slider .background-img svg {
    position: absolute;
    top: unset;
    bottom: 0;
    width: auto;
    height: 100%;
  }
  @media (min-width: 992px) {
    .main-slider .background-img svg {
      right: 0;
    }
  }
</style>
`;

html = html.replace('</head>', exactCSS + '</head>');

fs.writeFileSync('seha.html', html);
console.log('Applied exact CSS from seha.sa for background logo.');
