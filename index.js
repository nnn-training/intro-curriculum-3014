'use strict';
const http = require('http');
const qs = require('querystring');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress} ${req.method} ${req.url}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        const fs = require('fs');
        const rs = fs.createReadStream('./form.html');
        rs.pipe(res);
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            const enquetesAnswer = qs.parse(rawData);
            console.info(`[${now}] 投稿: ${JSON.stringify(enquetesAnswer)}`);
            const message = `<!DOCTYPE html><html lang="ja">
              <h1>${enquetesAnswer['name']}さんは${enquetesAnswer['yaki-shabu']}に投票しました</h1>
              <body>
              </body>
              </html>`
            res.write(message);
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error('[' + new Date() + '] Server Error', e);
  })
  .on('clientError', e => {
    console.error('[' + new Date() + '] Client Error', e);
  });
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});