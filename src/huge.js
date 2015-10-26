'use strict';

const Bluebird = require('@aso/bluebird');

const Service = require('./Service');
const Node = require('./Node');
const ActiveNode = require('./ActiveNode');
const Logger = require('./Logger');
const MonitorLogger = require('./MonitorLogger');
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

         // Create consul process and attach a logger to
         //
         // todo: accept consul client in options (similar to logger)
         const consul = yield Consul.create(node.name, opts);
         const consulLogger = logger.child({ service: 'consul' });
         MonitorLogger.create(consul.monitor, consulLogger);

         // Start the node and collect its service processes
         const processes = yield Node.start(node, logger, consul, opts);

         // Return an active node
         return ActiveNode.create(node, logger, consul, processes);
      })
   },

   service: {
      create: Service.create
   },

   source: {
      local: require('./source/local')
   }
};
