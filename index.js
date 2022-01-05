'use strict';
const http = require('http');
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
            const decoded = decodeURIComponent(rawData);
            const qs = require('querystring');  // querystringモジュールの読み出し
            const answer = qs.parse(decoded);   // '&'で繋がれた要素を分ける、'='で接続されている値をキーと値に設定する
            console.info(`[${now}] 投稿: ${answer['name']} さんが ${answer['yaki-shabu']} に投票しました`);
            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${answer['name']}さんが${answer['yaki-shabu']}に投稿しました</h1></body></html>`
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