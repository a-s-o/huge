'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');

const Node = require('../Node');
const Monitor = require('../Monitor');
const Logger = require('../Logger');
const Consul = require('../Consul');

const ProcessMap = t.dict(t.String, Monitor);

// A started node has a processes property
// which at minimum contains a reference to
// the node's consul service
const ActiveNode = module.exports = Node.extend({
   logger: Logger,
   consul: Consul,
   processes: ProcessMap
}, 'ActiveNode');

ActiveNode.create = t.typedFunc({
   inputs: [Node, Logger, Consul, ProcessMap],
   output: ActiveNode,
   fn: function activeNodeFactory (node, logger, consul, processes) {
      const props = _.extend({ logger, consul, processes }, node);
      return new ActiveNode( props );
   }
});
