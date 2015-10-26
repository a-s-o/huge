'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bluebird = require('@aso/bluebird');
const path = require('path');
const Client = require('consul');

const Service = require('../Service');
const Monitor = require('../Monitor');

function isConsul (consul) {
   return consul instanceof Client &&
      t.String.is(consul.SERVICE_DISCOVERY_HOST) &&
      t.Number.is(consul.SERVICE_DISCOVERY_PORT) &&
      Monitor.is(consul.monitor);
}

const Consul = module.exports = t.irreducible('Consul', isConsul);

Consul.create = t.typedFunc({
   inputs: [t.String, t.Object],

   output: t.Promise,  // Promise < Consul >

   fn: Bluebird.coroutine(function *consulFactory (nodeName/*, opts*/) {
      const service = createService();
      const consulDir = service.paths.dir;

      const monitor = Monitor.create({
         command: service.paths.main,
         pidFile: path.join(consulDir, `monitor.pid}`),
         silent: true,
         args: [
            'agent',
            '-server',
            '-node', nodeName,
            '-bootstrap-expect', 1,   // Only 1 server for now
            '-pid-file', path.join(consulDir, `consul.pid}`),
            '-data-dir', path.resolve(consulDir, './data'),
            '-ui-dir', path.resolve(consulDir, './ui')
            // '-config-dir', path.resolve(process.cwd(), './cfg/consul'),
         ]
      });

      const host = 'localhost';
      const port = 8500;

      const consul = new Client({ host, port });

      consul.SERVICE_DISCOVERY_HOST = host;
      consul.SERVICE_DISCOVERY_PORT = port;

      // Enable logging
      consul.monitor = monitor;

      return consul;
   })
});


function createService () {
   const dataDir = path.resolve(process.cwd(), './consul_bin');
   return Service.create({
      name: 'consul',
      paths: {
         dir: dataDir,
         main: path.join(dataDir, 'consul'),
         package: ''
      },
      cwd: dataDir,
      stdout (log, data) {
         log.info({ stringified: data.toString() });
      },
      compare () {
         return true;
      }
   });
}
