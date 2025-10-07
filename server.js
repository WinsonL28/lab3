const http = require('http');
const url = require('url');
const qs = require('querystring');
const fs = require('fs').promises;
const path = require('path');

const PORT = process.env.PORT || 3000;

const message = require('./lang/messages/en/user.js');
const utils = require('./modules/utils');


function respond(res, statusCode, body, contentType = 'text/html; charset=utf-8') {
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(body);
}

function safePath(filename) {
    return path.join(__dirname, path.basename(filename || ''));
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', "*");


    const parsed = url.parse(req.url);
    const pathname = parsed.pathname;
    const query = qs.parse(parsed.query || '');

    try {
        if (req.method === 'GET' && pathname === '/COMP4537/labs/3/getDate/') {
            const username = query.name || 'guest';
            const html = `<p style="color:blue">${message.greeting.replace("{0}", username).replace("{1}", utils.getDate())}</p>`;
            return respond(res, 200, html);

        } else if (req.method === 'GET' && pathname === '/COMP4537/labs/3/writeFile/') {
            const text = query.text || '';

            await fs.appendFile('file.txt', text);
            return respond(res, 200, `<p style="color:blue">File written successfully</p>`);

        } else if (req.method === 'GET' && pathname === '/COMP4537/labs/3/readFile/') {
            const filename = query.file;
            if (!filename) {
                return respond(res, 400, `<p style="color:red">Missing 'file' query parameter</p>`);
            }
            const filePath = safePath(filename);
            const data = await fs.readFile(filePath, 'utf8');
            return respond(res, 200, `<p style="color:blue">${data}</p>`);

        } else {
            return respond(res, 404, `<p style="color:red">Not found</p>`);
        }
    } catch (err) {
        console.error('Server error:', err);
        return respond(res, 500, `<p style="color:red">${String(err)}</p>`);
    }
});

server.listen(PORT, () => {
    console.log(`Server running`);
});
