'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bluebird = require('@aso/bluebird');
const Bunyan = require('bunyan');

const Process = require('../Process');

module.exports = function startNode (node/*, opts*/) {
   const opts = _.extend({}, arguments[1], {
      port: 8500,
      logger: Bunyan.createLogger({ name: node.name, huge: 'v1' }),
      env: {}
   });

   // Add service discovery variables to all processes
   opts.env.SERVICE_DISCOVERY_HOST = 'localhost';
   opts.env.SERVICE_DISCOVERY_PORT = opts.port;

   function launch (processes, service) {
      return launchService(service, opts)
         .then(serviceProcess => {
            processes[service.name] = serviceProcess;
            return processes;
         });
   }

   return Bluebird.reduce(node.services, launch, {});
};

const passThroughOptions = [
   'minUptime',
   'spinSleepTime',
   'cwd'
];

function launchService (service, opts) {
   const processOptions = _.pick(service, passThroughOptions);
   processOptions.env = _.extend({}, service.env, opts.env);
   // processOptions.silent = true;

   const serviceProcess = Process.create({
      pid: service.name,
      command: service.paths.main,
      options: processOptions
   });

   // serviceProcess.monitor.child.stdout.pipe( opts.logger );
   // serviceProcess.monitor.child.stderr.pipe( opts.logger );

   // serviceProcess.monitor.start();

   function checkProcess () {
      if (serviceProcess.monitor.running) {
         return serviceProcess;
      }

      throw new Error(
         `Service ${service.name} failed minUptime test ` +
         `and exited before ${service.minUptime}ms`
      );
   }

   return Bluebird
      .delay(service.minUptime)
      .then(checkProcess)
      .timeout(service.setupTimeout);
}
