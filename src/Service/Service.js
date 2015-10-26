'use strict';

const t = require('@aso/tcomb');
const _ = require('lodash');

const Logger = require('../Logger');
const types = require('../common/types');

const Service = module.exports = t.struct({
   name: t.String,
   inputs: t.list(t.String),
   outputs: t.list(t.String),
   paths: t.struct({
      dir: t.String,
      package: t.String,
      main: t.String
   }),

   // Methods
   compare: t.Function,
   stdout: t.maybe(t.Function),
   stderr: t.maybe(t.Function),

   // Service config
   instances: t.Number,
   setupTimeout: t.Number,

   // Process config
   minUptime: t.Number,
   spinSleepTime: t.Number,

   cwd: t.String,
   env: t.dict(types.EnvironmentVariable, t.String)
}, 'Service');

Service.getDefaults = function serviceDefaults () {
   return {
      inputs         : [],
      outputs        : [],

      instances      : 1,   // number of worker instances to run
      setupTimeout   : 3000,   // in milliseconds

      minUptime      : 2000,   // in milliseconds
      spinSleepTime  : 2000,   // in milliseconds

      cwd            : process.cwd(),
      env            : {}
   };
};

Service.create = t.typedFunc({
   inputs: [t.Object],
   output: Service,
   fn: function serviceFactory (opts) {
      return new Service( _.defaults(opts, Service.getDefaults()) );
   }
});

Service.compare = t.typedFunc({
   inputs: [Service, Service],
   output: t.Boolean,
   fn: function defaultServiceComparator (a, b) {
      return a.compare(b);
   }
});

Service.createLogger = t.typedFunc({
   inputs: [Service, Logger],
   output: Logger,
   fn: function createServiceLogger (service, logger) {
      return logger.child({ service: service.name });
   }
});
