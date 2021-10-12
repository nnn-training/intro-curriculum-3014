'use strict';
const http = require('http');
const qs = require('querystring');

const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.socket.remoteAddress);
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
            const answer = qs.parse(rawData);

            const decoded = decodeURIComponent(rawData);
            console.info('[' + now + '] 投稿: ' + decoded);
            res.write(
              '<!DOCTYPE html><html lang="ja"><body><h1>' +
                decoded +
                'が投稿されました</h1><br>' + 
                answer['name'] + 'さんは' + answer['yaki-shabu'] +
                'を投票しました。</body></html>'
                
            );
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