const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');

const mobileMenuScript = `
    // Mobile menu toggle logic
    const menuBtn = document.querySelector('.navbar-toggler');
    const collapseDiv = document.getElementById('responsive-navbar-nav');
    
    if(menuBtn && collapseDiv) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('collapsed');
            
            if(collapseDiv.classList.contains('show')) {
                collapseDiv.style.height = '0px';
                setTimeout(() => {
                    collapseDiv.classList.remove('show');
                }, 300);
            } else {
                collapseDiv.classList.add('show');
                collapseDiv.style.height = collapseDiv.scrollHeight + 'px';
                setTimeout(() => {
                    collapseDiv.style.height = 'auto';
                }, 300);
            }
        });
    }
`;

if (!html.includes('Mobile menu toggle logic')) {
    html = html.replace('// 6. Tabs interaction visual switch', mobileMenuScript + '\n    // 6. Tabs interaction visual switch');
    fs.writeFileSync('seha.html', html, 'utf-8');
    console.log('Mobile menu script added.');
} else {
    console.log('Script already added.');
}
