'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bluebird = require('@aso/bluebird');

const Monitor = require('../Monitor');
const MonitorLogger = require('../MonitorLogger');
const Service = require('../Service');

const launchService = Bluebird.coroutine(serviceLauncher);

module.exports = function startNode (node, logger, consul/*, opts*/) {
   const opts = _.extend({}, arguments[4], {
      logger: logger,
      env: {}
   });

   // Add service discovery variables to all processes
   opts.env.SERVICE_DISCOVERY_HOST = consul.SERVICE_DISCOVERY_HOST;
   opts.env.SERVICE_DISCOVERY_PORT = consul.SERVICE_DISCOVERY_PORT;

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
   const monitorArgs = _.chain(service)
      .pick(passThroughOptions)
      .extend({
         command: service.paths.main,
         env: _.extend({}, service.env, opts.env)
      })
      .value();

   const monitor = MonitorLogger.create(
      // Create a monitor
      Monitor.create(monitorArgs),
      // Create a child logger
      Service.createLogger(opts.logger)
   );

   let started = false;
   let failed = false;

   monitor.once('exit', () => {
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
