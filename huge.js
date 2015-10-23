'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const bunyan = require('bunyan');

const cfg = require('./config');
const types = require('./types');


const Node = require('./lib/node');
const consul = require('./lib/consul');

module.exports = {
   node: Node,
   start: startNode
};

function startNode () {
   const node = Node(arguments[0]);
   const opts = types.StartOptions(_.defaults(arguments[0] || {}, {
      host: cfg.consul.host,
      port: cfg.consul.port,
      logger: bunyan.createLogger({ huge: 'v1', name: node.name })
   }));

   console.log(consul.start(node, opts));
}
