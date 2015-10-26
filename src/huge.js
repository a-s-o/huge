'use strict';

const Bluebird = require('@aso/bluebird');

const Service = require('./Service');
const Node = require('./Node');
const ActiveNode = require('./ActiveNode');
const Logger = require('./Logger');
const Consul = require('./Consul');

module.exports = {
   Node,
   Service,

   node: {
      create: Node.create,
      start: Bluebird.coroutine(function *startNode (nodePromise/*, opts*/) {
         const node = yield Bluebird.resolve(nodePromise);
         const opts = arguments[1] || {};
         const logger = opts.logger || Logger.create(node.name);
         const consul = opts.consul || (yield Consul.create(node, logger, opts));

         console.log(consul);
         // const processes = yield Node.start(node, logger, consul, opts);
         // return ActiveNode.create(node, logger, consul, processes);
      })
   },

   service: {
      create: Service.create
   },

   source: {
      local: require('./source/local')
   }
};
