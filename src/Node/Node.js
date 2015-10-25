'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bluebird = require('@aso/bluebird');

const Service = require('../Service');
const types = require('../common/types');
const optional = t.maybe;

const Node = t.struct({
   name: t.String,
   services: t.list( Service )
}, 'Node');

const ProcessReference = t.struct({
   pid: t.Number,
   monitor: t.Any
}, 'ProcessReference');

// A started node has a processes property
// which at minimum contains a reference to
// the node's consul service
const StartedNode = Node.extend({
   processes: t.subtype(
      t.dict(t.String, ProcessReference),
      function withConsul (refs) {
         return _.has(refs, 'consul') && !!refs.consul;
      }
   )
});

Node.create = t.typedFunc({
   inputs: [t.Object],
   output: t.Promise,
   fn: function nodeFactory (opts) {
      // Wait for all services to load
      // prior to creating the node
      return Bluebird
         .all(opts.services)
         .then(services =>
            new Node( _.default({ services }, opts) )
         );
   }
});

Node.start = t.typedFunc({
   inputs: [Node, t.struct({
      port   : optional(t.Number),
      logger : optional(types.Logger)
   })],
   output: t.Promise,
   fn: function startNode (node, opts) {
      return startNode(node, opts).then(processes =>
         new StartedNode( _.extend({ processes }, node) )
      );
   }
});
