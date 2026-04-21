const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    // Add CORS headers so fetch from seha.sa doesn't get blocked
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let html = body;
            // Fix relative paths to absolute paths
            html = html.replace(/href="\//g, 'href="https://seha.sa/');
            html = html.replace(/src="\//g, 'src="https://seha.sa/');
            fs.writeFileSync('i:/seha/seha.html', html);
            res.end('ok');
            process.exit(0);
        });
    } else {
        res.end('Server running');
    }
});
server.listen(8080, () => console.log('Listening on 8080'));
