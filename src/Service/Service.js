'use strict';

const t = require('tcomb-validation');
const _ = require('lodash');

const helpers = require('../helpers');

const testEnvVariable = _.bind(RegExp.prototype.test, /^[A-Z_]+$/);
const EnvVariable = t.subtype(t.String, testEnvVariable);

const Service = t.struct({
   name: t.String,
   get: t.Function,

   // Methods
   compare: t.Function,

   // Optional properties
   instances: t.Number,
   setupTimeout: t.Number,
   minUptime: t.Number,
   spinSleepTime: t.Number,
   env: t.dict(EnvVariable, t.String)
});


Service.getDefaults = function serviceDefaults () {
   return {
      instances      : 1,   // number of worker instances to run

      setupTimeout   : 3000,   // in milliseconds
      minUptime      : 2000,   // in milliseconds
      spinSleepTime  : 2000    // in milliseconds
   };
};

Service.create = helpers.typedFunc({
   inputs: [t.Object],
   output: Service,
   fn: function serviceFactory (opts) {
      return new Service( _.defaults(opts, Service.getDefaults()) );
   }
});

Service.get = helpers.typeFunc({

});

Service.compare = helpers.typedFunc({
   inputs: [Service, Service],
   output: t.Boolean,
   fn: function defaultServiceComparator (a, b) {
      return a.compare(b);
   }
});
