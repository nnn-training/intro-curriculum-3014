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
            const qs = require('querystring');
            const decoded = decodeURIComponent(rawData);
            console.info('[' + now + '] 投稿: ' + decoded);
            const answer = qs.parse(rawData);//parseの中身はデコードしてもしてなくても結果は変わらないようだ
            const a = answer['name'];
            const b = answer['yaki-shabu'];
            console.log(decoded);//name=なまえ&yaki-shabu=しゃぶしゃぶ　　デコードした状態
            console.log(answer);//[Object: null prototype] { name: 'なまえ', 'yaki-shabu': 'しゃぶしゃぶ' }　　パースした状態
            console.log(rawData);//name=%E3%81%AA%E3%81%BE%E3%81%88&yaki-shabu=%E3%81%97%E3%82%83%E3%81%B6%E3%81%97%E3%82%83%E3%81%B6　そのままのデータ
            res.write(
              '<!DOCTYPE html><html lang="ja"><body><h1>' +
                b + 'が' + a +'さんによって投稿されました</h1></body></html>'
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