'use strict';
const http = require('http');
const fs = require('fs');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    });

    switch (req.method) {
      case 'GET':
        const rs = fs.createReadStream('./form.html'); //createReadStream でファイルの読み込みストリームを作成
        rs.pipe(res); // HTTP のレスポンスのコンテンツとしてファイル内容を返す
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', (chunk) => {
            rawData += chunk;
          })
          .on('end', () => {
            const decoded = decodeURIComponent(rawData); //URL エンコードされた値を元の値に直す
            const answer = new URLSearchParams(decoded);
            console.info(
              `[${now}] 名前: ${answer.get('name')} 投票: ${answer.get(
                'yaki-shabu'
              )}`
            );

            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${answer.get(
                'name'
              )}さんは${answer.get(
                'yaki-shabu'
              )}に投票しました。</h1></body></html>`
            );

            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', (e) => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', (e) => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
