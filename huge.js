'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const bunyan = require('bunyan');

const cfg = require('./config');
const types = require('./types');

const Node = require('./lib/node');

module.exports = {
   node: Node,
   start: function start (node, opts) {
      const optionsWithDefaults = _.defaults(opts || {}, {
         host: cfg.consul.host,
         port: cfg.consul.port,
         logger: bunyan.createLogger({ huge: 'v1', name: node.name })
      });

      const validatedNode = Node(node);
      const validatedOpts = types.StartOptions(optionsWithDefaults);

      return Node.start(validatedNode, validatedOpts);
   }
};
