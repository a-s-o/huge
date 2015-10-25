'use strict';

const t = require('@aso/tcomb');
const _ = require('lodash');

const types = require('../common/types');

const Service = t.struct({
   name: t.String,
   packagePath: t.String,
   inputs: t.list(t.String),
   outputs: t.list(t.String),
   paths: t.struct({
      dir: t.String,
      package: t.String,
      main: t.String
   }),

   // Methods
   compare: t.Function,

   // Optional properties
   instances: t.Number,
   setupTimeout: t.Number,
   minUptime: t.Number,
   spinSleepTime: t.Number,
   env: t.dict(types.EnvironmentVariable, t.String)
});

Service.getDefaults = function serviceDefaults () {
   return {
      inputs         : [],
      outputs        : [],

      instances      : 1,   // number of worker instances to run

      setupTimeout   : 3000,   // in milliseconds
      minUptime      : 2000,   // in milliseconds
      spinSleepTime  : 2000    // in milliseconds
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
