'use strict';

const Node = require('./Node');
const Service = require('./Service');

module.exports = {
   Node,
   Service,

   node: {
      create: Node.create,
      start: function startNode (node, opts) {
         return Node.start(node, opts || {});
      }
   },
   service: {
      create: Service.create
   },

   source: {
      local: require('./source/local')
   }
};
