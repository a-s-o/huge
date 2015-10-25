'use strict';

const Bluebird = require('@aso/bluebird');

const Service = require('./Service');
const Node = require('./Node');
const ActiveNode = require('./ActiveNode');

module.exports = {
   Node,
   Service,

   node: {
      create: Node.create,
      start: Bluebird.coroutine(function *startNode (nodePromise, opts) {
         const node = yield Bluebird.resolve(nodePromise);
         const processes = yield Node.start(node, opts || {});
         return ActiveNode.create(node, processes);
      })
   },

   service: {
      create: Service.create
   },

   source: {
      local: require('./source/local')
   }
};
