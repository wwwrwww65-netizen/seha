const fs = require('fs');
let html = fs.readFileSync('seha.html', 'utf-8');

// Fix 1: Fix the animated logo - change relative path to absolute
html = html.replace(
    'data="/seha-logo-animation-new.svg"',
    'data="https://seha.sa/seha-logo-animation-new.svg"'
);

// Fix 2: Fix the scroll-down button to scroll to the services section
// The button is <div class="text-center down"> with an img inside
// It needs an onclick to scroll to #home-services-section
html = html.replace(
    '<div style="z-index: 99; transform: translateY(-0.0210147px);"><div class="text-center down">',
    '<div style="z-index: 99; transform: translateY(-0.0210147px);"><div class="text-center down" onclick="document.getElementById(\'#home-services-section\').scrollIntoView({behavior:\'smooth\'})" style="cursor:pointer;">'
);

// Also add CSS animation for the scroll button (bobbing animation)
const scrollBtnCSS = `
<style>
  .text-center.down img {
    animation: scrollBob 1.5s ease-in-out infinite;
  }
  @keyframes scrollBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(8px); }
  }
  .main-slider object.background-img {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>
`;

html = html.replace('</head>', scrollBtnCSS + '</head>');

fs.writeFileSync('seha.html', html);
console.log('Fixed: animated logo URL and scroll button click + animation.');
