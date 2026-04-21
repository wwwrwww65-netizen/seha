const fs = require('fs');
const html = fs.readFileSync('seha.html', 'utf-8');

// Check: does the toggler button exist?
const togglerMatch = html.match(/<button[^>]*navbar-toggler[^>]*>/);
console.log('Toggler button found:', !!togglerMatch);
if (togglerMatch) console.log(togglerMatch[0]);

// Check: does the collapsible div exist?
const collapseMatch = html.match(/id="responsive-navbar-nav"/);
console.log('\nCollapse div found:', !!collapseMatch);

// Check: does the mobile menu fix script exist?
const scriptHasMenu = html.includes('mobile menu toggle') || html.includes('navbar-toggler');
console.log('\nMobile menu JS in script:', scriptHasMenu);

// Check: how many times does navbar-toggler appear?
const allTogglers = html.match(/navbar-toggler/g);
console.log('navbar-toggler occurrences:', allTogglers ? allTogglers.length : 0);

// Check: the CSS for the collapse - does it have "collapse" styles?
const hasCollapseCSS = html.includes('.navbar-collapse') || html.includes('#responsive-navbar-nav');
console.log('Collapse CSS references:', hasCollapseCSS);

// Dump the collapsible div opening tag and its parent context
const collapseIdx = html.indexOf('id="responsive-navbar-nav"');
if (collapseIdx !== -1) {
    console.log('\nContext around collapsible div:');
    console.log(html.substring(Math.max(0, collapseIdx - 200), collapseIdx + 150));
}
