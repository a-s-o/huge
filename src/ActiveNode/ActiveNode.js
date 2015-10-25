'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');

const Node = require('../Node');
const Process = require('../Process');

// A started node has a processes property
// which at minimum contains a reference to
// the node's consul service
const ActiveNode = module.exports = Node.extend({
   processes: t.subtype(
      t.dict(t.String, Process),
      function withConsul (refs) {
         return _.has(refs, 'consul') && !!refs.consul;
      }
   )
}, 'ActiveNode');

ActiveNode.create = function activeNodeFactory (node, processes) {
   return new ActiveNode( _.extend({ processes }, node) );
};
