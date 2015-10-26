'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');

const Logger = require('../Logger');
const Monitor = require('../Monitor');

function isMonitorLogger (x) {
   return Logger.is(x.logger);
}

const MonitorLogger = module.exports = t.subtype(Monitor,
   isMonitorLogger, 'MonitorLogger'
);

let Proto;

const monitorLoggerFactory = t.typedFunc({
   inputs: [Monitor, Logger, t.struct({
      stdout: t.maybe(t.Function),
      stderr: t.maybe(t.Function)
   })],
   output: MonitorLogger,
   fn: function setupMonitorLogger (monitor, logger, options) {
      const ctx = {
         log     : logger,
         monitor : monitor,
         stdout  : options.stdout,
         stderr  : options.stderr
      };

      ctx.onError   = Proto.onError.bind(ctx);
      ctx.onStart   = Proto.onStart.bind(ctx);
      ctx.onStop    = Proto.onStop.bind(ctx);
      ctx.onRestart = Proto.onRestart.bind(ctx);
      ctx.onStdOut  = Proto.onStdOut.bind(ctx);
      ctx.onStdErr  = Proto.onStdErr.bind(ctx);
      ctx.onExit    = Proto.onExit.bind(ctx);

      monitor.logger = logger;
      monitor.loggingCtx = ctx;

      return MonitorLogger.enable(monitor);
   }
});

MonitorLogger.create = (monitor, logger, opts) => {
   return monitorLoggerFactory(monitor, logger, opts || {});
};

MonitorLogger.enable = t.typedFunc({
   inputs: [MonitorLogger],
   output: MonitorLogger,
   fn: function enableLogging (monitor) {
      const ctx = monitor.loggingCtx;
      monitor.on('error',   ctx.onError);
      monitor.on('start',   ctx.onStart);
      monitor.on('stop',    ctx.onStop);
      monitor.on('restart', ctx.onRestart);
      monitor.on('stdout',  ctx.onStdOut);
      monitor.on('stderr',  ctx.onStdErr);
      monitor.once('exit',  ctx.onExit);
      return monitor;
   }
});

MonitorLogger.disable = t.typedFunc({
   inputs: [MonitorLogger],
   output: MonitorLogger,
   fn: function disableLogging (monitor) {
      const ctx = monitor.loggingCtx;
      monitor.off('error',   ctx.onError);
      monitor.off('start',   ctx.onStart);
      monitor.off('stop',    ctx.onStop);
      monitor.off('restart', ctx.onRestart);
      monitor.off('stdout',  ctx.onStdOut);
      monitor.off('stderr',  ctx.onStdErr);
      monitor.off('exit',    ctx.onExit);
      return monitor;
   }
});

Proto = {
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
      if (this.stdout) {
         this.stdout(this.log, buf);
      } else {
         this.log.info({
            eventType: 'serviceOutput',
            pid: _.get(this, 'monitor.child.pid'),
            buffer: buf
         });
      }
   },
   onStdErr (err) {
      if (this.stderr) {
         this.stderr(this.log, err);
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
