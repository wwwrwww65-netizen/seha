const fs = require('fs');

const html = fs.readFileSync('seha.html', 'utf-8');
const scriptIdx = html.lastIndexOf('<script>');
if (scriptIdx !== -1) {
    console.log(html.substring(scriptIdx, scriptIdx + 2000));
} else {
    console.log('Script injection not found');
}
