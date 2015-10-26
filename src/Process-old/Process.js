'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const path = require('path');
const Monitor = require('forever-monitor').Monitor;

const Service = require('../Service');
const Logger = require('../Logger');
const types = require('../common/types');

function withServiceDiscovery (obj) {
   return obj.hasOwnProperty('SERVICE_DISCOVERY_HOST') &&
      obj.hasOwnProperty('SERVICE_DISCOVERY_PORT');
}

const EnvironmentObject = t.subtype(types.EnvironmentObject, withServiceDiscovery);
const enableLogging = setupLoggerPrototype();

const Process = module.exports = t.struct({
   pidFile: t.String,
   monitor: types.Monitor
}, 'Process');

const ProcessOptions = t.struct({
   args: t.list(types.StringOrNumber),
   env : EnvironmentObject,
   minUptime: t.Number,
   spinSleepTime: t.Number,
   cwd: t.String
}, 'Process.create/options');

ProcessOptions.create = function applyDefaultOptions () {
   const opts = _.extend.apply(_, [{
      args: [],
      minUptime      : 2000,   // in milliseconds
      spinSleepTime  : 2000,   // in milliseconds

      cwd            : process.cwd(),
      env            : {}
   }].concat(arguments));

   return new ProcessOptions(opts);
};

Process.create = t.typedFunc({
   inputs: [t.struct({
      service: Service,
      logger: Logger,

      command: t.String,
      options: t.Object
   }, 'Process.create')],

   output: Process,

   fn: function processFactory (inputs) {
      const pidFile = getPidFilename(inputs.service.name);
      const opts = ProcessOptions.create({
         pidFile,
         silent: true
      }, inputs.options);

      const monitor = new Monitor(inputs.command, opts);

      enableLogging(inputs.service, inputs.logger, monitor);

      return new Process({ pidFile, monitor });
   }
});

function getPidFilename (name) {
   return path.resolve(process.cwd(), `./pids/${name.pid}`);
}

function setupLoggerPrototype () {


   return function bindToMonitor (service, logger, monitor) {
      const ctx = {
         service : service,
         log     : logger,
         monitor : monitor
      };

      ctx.onError   = Proto.onError.bind(ctx);
      ctx.onStart   = Proto.onStart.bind(ctx);
      ctx.onStop    = Proto.onStop.bind(ctx);
      ctx.onRestart = Proto.onRestart.bind(ctx);
      ctx.onStdOut  = Proto.onStdOut.bind(ctx);
      ctx.onStdErr  = Proto.onStdErr.bind(ctx);
      ctx.onExit    = Proto.onExit.bind(ctx);

      monitor.on('error',   ctx.onError);
      monitor.on('start',   ctx.onStart);
      monitor.on('stop',    ctx.onStop);
      monitor.on('restart', ctx.onRestart);
      monitor.on('stdout',  ctx.onStdOut);
      monitor.on('stderr',  ctx.onStdErr);
      monitor.once('exit',  ctx.onExit);
   };
}
