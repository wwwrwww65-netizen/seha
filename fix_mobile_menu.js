const fs = require('fs');

let html = fs.readFileSync('seha.html', 'utf-8');

const targetStr = `        scrollWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollWrapper.offsetLeft;
            const walk = (x - startX) * 2;
            scrollWrapper.scrollLeft = scrollLeft - walk;
        });
    }
});
</script>`;

const insertion = `
    const menuBtn = document.querySelector('.navbar-toggler');
    const collapseDiv = document.getElementById('responsive-navbar-nav');
    if(menuBtn && collapseDiv) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('collapsed');
            if(collapseDiv.classList.contains('show')) {
                collapseDiv.style.height = '0px';
                setTimeout(() => { collapseDiv.classList.remove('show'); }, 300);
            } else {
                collapseDiv.classList.add('show');
                collapseDiv.style.height = collapseDiv.scrollHeight + 'px';
                setTimeout(() => { collapseDiv.style.height = 'auto'; }, 300);
            }
        });
    }
`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, targetStr.replace('});\n</script>', insertion + '});\n</script>'));
    fs.writeFileSync('seha.html', html, 'utf-8');
    console.log('Mobile menu toggle logic injected successfully.');
} else {
    console.log('Target string not found.');
}
