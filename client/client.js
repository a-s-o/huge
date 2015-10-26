'use strict';

const _ = require('lodash');
const Bluebird = require('@aso/bluebird');
const assert = require('assert');

const host = process.env.SERVICE_DISCOVERY_HOST;
const port = process.env.SERVICE_DISCOVERY_PORT;

function missing (missingVar) {
   return `huge/client cannot be started as service discovery ${missingVar} ` +
      `is missing. Make sure the application is launched by huge framework ` +
      `and not directly.`;
}

assert(host && typeof host === 'string', missing('host'));
assert(port && typeof port === 'string', missing('port'));

const client = module.exports = require('consul')({ host, port });

const setKey = Bluebird.promisify(client.kv.set, client.kv);
client.output = Bluebird.coroutine(function *output (key, val) {
   if (_.isString(key)) return setKey(`HUGE_V1/${key}`, val);
   if (!_.isPlainObject(key)) return null;

   const obj = key;
   const keys = _.keys(obj);
   const result = {};
   for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      result[k] = yield setKey(`HUGE_V1/${k}`, val);
   }
   return result;
});
