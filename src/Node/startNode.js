'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bluebird = require('@aso/bluebird');

const Process = require('../Process');
const Logger = require('../Logger');
const Service = require('../Service');

const launchService = Bluebird.coroutine(serviceLauncher);

module.exports = function startNode (node/*, opts*/) {
   const opts = _.extend({}, arguments[1], {
      port: 8500,
      env: {}
   });

   if (!opts.logger) opts.logger = Logger.create(node.name);

   // Add service discovery variables to all processes
   opts.env.SERVICE_DISCOVERY_HOST = 'localhost';
   opts.env.SERVICE_DISCOVERY_PORT = opts.port;

   const launch = (processes, service) => launchService(service, opts)
      .timeout(service.setupTimeout)
      .then(serviceProcess => {
         processes[service.name] = serviceProcess;
         return processes;
      });

   return Bluebird.reduce(node.services, launch, {});
};

const passThroughOptions = [
   'minUptime',
   'spinSleepTime',
   'cwd'
];

function *serviceLauncher (service, opts) {
   const processOptions = _.pick(service, passThroughOptions);
   processOptions.env = _.extend({}, service.env, opts.env);
   // processOptions.silent = true;

   const it = Process.create({
      service: service,
      logger : Service.createLogger(service, opts.logger),
      command: service.paths.main,
      options: processOptions
   });

   let started = false;
   let failed = false;

   it.monitor.once('exit', () => {
      failed = `Service [${service.name}] permanentally exited ` +
         `before minUptime of ${service.minUptime}ms`;
   });

   // Launch the service
   it.monitor.start();

   while (!started && !failed) {
      console.log('waiting', service.name);
      // Service has neither started nor failed so
      // wait for the minUptime period
      yield Bluebird.delay(service.minUptime);

      // Check if service has now started; if not
      // then the loop will keep waiting
      if (it.monitor.running) {
         console.log('running', service.name);
         started = true;
      }
   }

   if (failed) {
      throw new Error(failed);
   }

   return it;
}
