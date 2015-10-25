'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const path = require('path');
const Monitor = require('forever-monitor').Monitor;

const types = require('../common/types');

function withServiceDiscovery (obj) {
   return obj.hasOwnProperty('SERVICE_DISCOVERY_HOST') &&
      obj.hasOwnProperty('SERVICE_DISCOVERY_PORT');
}

const EnvironmentObject = t.subtype(types.EnvironmentObject, withServiceDiscovery);

const Process = module.exports = t.struct({
   pidFile: t.String,
   monitor: types.Monitor
}, 'Process');

Process.create = t.typedFunc({
   inputs: [t.struct({
      pid: t.String,
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
      const pidFile = getPidFilename(inputs.pid);
      const opts = _.extend({ pidFile }, inputs.options);

      return new Process({
         pidFile: pidFile,
         monitor: new Monitor(inputs.command, opts)
      });
   }
});

function getPidFilename (name) {
   return path.resolve(process.cwd(), `./pids/${name.pid}`);
}
