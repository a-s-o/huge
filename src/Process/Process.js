'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const path = require('path');
const Monitor = require('forever-monitor').Monitor;

const types = require('../common/types');

const Process = module.exports = t.struct({
   pidFile: t.String,
   monitor: types.Monitor
}, 'Process');

Process.create = t.typedFunc({
   inputs: [t.String, t.String, t.Object],
   output: Process,
   fn: function processFactory (pidName, command) {
      const pidFile = getPidFilename(pidName);
      const opts = _.extend({ pidFile }, arguments[2]);

      return new Monitor(command, opts);
   }
});

function getPidFilename (name) {
   return path.resolve(process.cwd(), `./pids/${name.pid}`);
}
