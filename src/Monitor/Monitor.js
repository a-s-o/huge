'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Forever = require('forever-monitor');

const types = require('../common/types');

const optional = t.maybe;

function isMonitor (mon) {
   return mon instanceof Forever.Monitor;
}

const Monitor = module.exports = t.irreducible('Monitor', isMonitor);

Monitor.create = t.typedFunc({
   inputs: [t.struct({
      command        : t.String,
      pidFile        : t.String,
      silent         : t.Boolean,

      args           : optional(t.list(types.StringOrNumber)),
      minUptime      : optional(t.Number),   // in milliseconds
      spinSleepTime  : optional(t.Number),   // in milliseconds

      cwd            : optional(t.String),
      env            : optional(types.EnvironmentObject)
   }, 'Monitor.create')],
   output: Monitor,
   fn: function processFactory () {
      const opts = _.extend({
         args: [],
         minUptime      : 2000,   // in milliseconds
         spinSleepTime  : 2000,   // in milliseconds

         cwd            : process.cwd(),
         env            : {}
      }, arguments[0]);

      return new Forever.Monitor(opts);
   }
});
