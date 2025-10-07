const http = require('http');
const url = require('url');
const qs = require('querystring');
const fs = require('fs').promises;
const path = require('path');

const message = require('./lang/messages/en/user.js');
const utils = require('./modules/utils');

class MyServer {
    constructor(port = process.env.PORT || 3000) {
        this.port = port;
    }

    respond(res, statusCode, body, contentType = 'text/html; charset=utf-8') {
        res.writeHead(statusCode,
            {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
        res.end(body);
    }

    safePath(filename) {
        return path.join(__dirname, path.basename(filename || ''));
    }

    async handleRequest(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');

        const parsed = url.parse(req.url);
        const pathname = parsed.pathname;
        const query = qs.parse(parsed.query || '');

        try {
            if (req.method === 'GET' && pathname === '/COMP4537/labs/3/getDate/') {
                const username = query.name || 'guest';
                const html = `<p style="color:blue">${message.greeting
                    .replace('{0}', username)
                    .replace('{1}', utils.getDate())}</p>`;
                return this.respond(res, 200, html);

            } else if (req.method === 'GET' && pathname === '/COMP4537/labs/3/writeFile/') {
                const text = query.text || '';
                await fs.appendFile('file.txt', text);
                return this.respond(res, 200, `<p>File written successfully</p>`);

            } else if (req.method === 'GET' && pathname === '/COMP4537/labs/3/readFile/') {
                const filename = query.file;
                if (!filename) {
                    return this.respond(res, 400, `<p>Missing 'file' query parameter</p>`);
                }
                const filePath = this.safePath(filename);
                const data = await fs.readFile(filePath, 'utf8');
                return this.respond(res, 200, `<p style="color:blue">${data}</p>`);

            } else {
                return this.respond(res, 404, `<p>Not found</p>`);
            }
        } catch (err) {
            console.error('Server error:', err);
            return this.respond(res, 500, `<p>${String(err)}</p>`);
        }
    }

    start() {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(this.port, () => {
            console.log(`Server running`);
        });
    }
}

const server = new MyServer();
server.start();


