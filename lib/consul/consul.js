'use strict';

const path = require('path');
const forever = require('forever-monitor');
const cfg = require('../../config');
const dir = cfg.consul.dir;

module.exports = {
   start: startConsulProcess
};

function startConsulProcess (node, startOpts) {
   const pidFile = path.join(dir, `${node.name}-consul.pid`);
   const args = [
      path.join(dir, 'consul'),
      'agent',
      '-server',
      '-node', node.name,
      // '-config-dir', path.resolve(process.cwd(), './cfg/consul'),
      '-data-dir', path.resolve(dir, './data'),
      '-ui-dir', path.resolve(dir, './ui'),
      '-pid-file', pidFile,
      '-bootstrap-expect', 1
   ];

   return forever.start(args, {
      cwd: dir,
      max: 1,
      pidFile: pidFile
   });
}
