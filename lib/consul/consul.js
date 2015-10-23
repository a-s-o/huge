'use strict';

const path = require('path');
const forever = require('forever-monitor');
const cfg = require('../../config');
const dir = cfg.consul.dir;

module.exports = {
   start: startConsulProcess
};

function startConsulProcess (node/*, startOpts*/) {
   const pidFile = path.join(dir, `${node.name}-consul.pid`);
   const args = [
      path.join(dir, 'consul'),
      'agent',
      '-server',
      '-node', node.name,
      '-bootstrap-expect', 1,   // Expect only 1 server to connect (i.e. this one)
      '-pid-file', pidFile,
      '-data-dir', path.resolve(dir, './data'),
      '-ui-dir', path.resolve(dir, './ui')
      // '-config-dir', path.resolve(process.cwd(), './cfg/consul'),
   ];

   return forever.start(args, {
      cwd: dir,
      max: 1,
      pidFile: pidFile
   });
}
