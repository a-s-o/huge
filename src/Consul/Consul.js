'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bluebird = require('@aso/bluebird');
const path = require('path');
const Client = require('consul');

const Node = require('../Node');
const Logger = require('../Logger');
const Service = require('../Service');
const Process = require('../Process');

function isConsul (consul) {
   return consul instanceof Client;
}

const Consul = module.exports = t.irreducible('Consul', isConsul);

// Logger.create returns the default logger used
// by huge when a logger is not supplied by the
// user. This is not a replacement for Bunyan.createLogger
Consul.create = t.typedFunc({
   inputs: [Node, Logger, t.Object],

   output: t.Promise,  // Promise < Consul >

   fn: Bluebird.coroutine(function *consulFactory (node, logger/*, opts*/) {
      const service = createService();
      const consulDir = service.paths.dir;
      const pidFile = path.join(consulDir, `pidfile.pid}`);

      const process = Process.create({
         service: service,
         logger: Service.createLogger(service, logger),
         command: service.paths.main,
         options: {
            args: [
               'agent',
               '-server',
               '-node', node.name,
               '-bootstrap-expect', 1,   // Only 1 server for now
               '-pid-file', pidFile,
               '-data-dir', path.resolve(consulDir, './data'),
               '-ui-dir', path.resolve(consulDir, './ui')
               // '-config-dir', path.resolve(process.cwd(), './cfg/consul'),
            ]
         }
      });

      const consul = new Client({
         host: 'localhost',
         post: 8500
      });

      consul.process = process;

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
