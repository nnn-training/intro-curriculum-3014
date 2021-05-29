'use strict';
const http = require('http');
// https://nodejs.org/api/querystring.html, 投稿後のメッセージ整形用
const qs = require('querystring');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.socket.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      // GET の時にform.htmlファイルの内容を送る
      case 'GET':
        const fs = require('fs');
        const rs = fs.createReadStream('./form.html');
        // Node.js では Stream の形式のデータは、pipeによって読み込み用の Stream と
        // 書き込み用の Stream を繋つないで そのままデータを受け渡すことができる
        // pipe 関数を利用した場合は res.end 関数を呼ぶ必要がなくなるためPOSTのときのみend
        rs.pipe(res);
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            // // URL エンコードされた値を 元のものに直す
            // const decoded = decodeURIComponent(rawData);
            const answer = qs.parse(rawData);
            const body = answer['name'] + 'さんは' + answer['yaki-shabu'] + 'に投票しました';
            console.info('[' + now + '] 投稿: ' + decodeURIComponent(rawData));
            console.info('[' + now + ']' + body); 
            res.write(
              '<!DOCTYPE html><html lang="ja"><body><h1>' + 
              body +
              // decoded + 'が投稿されました'
                '</h1></body></html>'
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