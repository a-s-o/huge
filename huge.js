'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const bunyan = require('bunyan');

const cfg = require('./config');
const types = require('./types');

const Node = require('./lib/node');

function hugeStart () {
   const node = Node(arguments[0]);
   const opts = types.StartOptions(_.defaults(arguments[0] || {}, {
      host: cfg.consul.host,
      port: cfg.consul.port,
      logger: bunyan.createLogger({ huge: 'v1', name: node.name })
   }));

   return Node.start(node, opts);
}

module.exports = {
   node: Node,
   start: hugeStart
};
