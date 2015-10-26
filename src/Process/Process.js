'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const path = require('path');
const Monitor = require('forever-monitor').Monitor;

const Service = require('../Service');
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

Process.create = t.typedFunc({
   inputs: [t.struct({
      service: Service,
      logger: types.Logger,

      command: t.String,
      options: t.struct({
         env : EnvironmentObject,
         minUptime: t.Number,
         spinSleepTime: t.Number,
         cwd: t.String
      }, 'Process.create/options')
   }, 'Process.create')],

   output: Process,

   fn: function processFactory (inputs) {
      const pidFile = getPidFilename(inputs.service.name);
      const opts = _.extend({
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
   const Proto = {
      onError (err) {
         this.log.error({
            eventType: 'serviceErrored',
            err: err,
            pid: _.get(this, 'monitor.child.pid')
         });
      },
      onStart () {
         this.log.info({
            eventType: 'serviceStarted',
            pid: _.get(this, 'monitor.child.pid')
         });
      },
      onStop () {
         this.log.info({
            eventType: 'serviceStopped',
            pid: _.get(this, 'monitor.child.pid')
         });
      },
      onRestart () {
         this.log.info({
            eventType: 'serviceRestarted',
            pid: _.get(this, 'monitor.child.pid')
         });
      },
      onStdOut (buf) {
         if (this.service.stdout) {
            this.service.stdout(this.log, buf);
         } else {
            this.log.info({
               eventType: 'serviceSaid',
               pid: _.get(this, 'monitor.child.pid'),
               buffer: buf
            });
         }
      },
      onStdErr (err) {
         if (this.service.stderr) {
            this.service.stderr(this.log, err);
         } else {
            this.log.error({
               eventType: 'serviceErrored',
               err: err,
               pid: _.get(this, 'monitor.child.pid')
            });
         }
      },
      onExit () {
         this.log.info({ eventType: 'serviceEnded' });

         const ctx = this;
         this.monitor.off('error',   ctx.onError);
         this.monitor.off('start',   ctx.onStart);
         this.monitor.off('stop',    ctx.onStop);
         this.monitor.off('restart', ctx.onRestart);
         this.monitor.off('stdout',  ctx.onStdOut);
         this.monitor.off('stderr',  ctx.onStdErr);
      }
   };

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
