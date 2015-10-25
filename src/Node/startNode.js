'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bluebird = require('@aso/bluebird');
const Bunyan = require('bunyan');

module.exports = Bluebird.coroutine(function *startNode (node/*, opts*/) {
   const opts = _.defaults({}, arguments[1], {
      port: 8500,
      logger: Bunyan.createLogger({ name: node.name, huge: 'v1' })
   });

   

   return {};
});
