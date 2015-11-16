'use strict';

const app = require('koa')();
const shell = require('shelljs');

function exec (arg) {
   return (next) => shell.exec(arg, { silent: true }, (code, data) => {
      next(null, data.toString());
   });
}

app.use(function *respondAll () {
   this.body = [
      yield exec('/bin/consul --help')
      // yield exec('/bin/registrator --help')
   ].join('\n');
});

const server = app.listen(3000, function started () {
   const addr = server.address();
   console.log('listening at http://%s:%s', addr.address, addr.port);
});
