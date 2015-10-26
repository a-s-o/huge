'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bluebird = require('@aso/bluebird');

const Service = require('../Service');
const Logger = require('../Logger');
const Consul = require('../Consul');

// Internal functions for create and starting nodes
const checkDeps = require('./checkDeps');
const startNode = require('./startNode');

const Node = module.exports = t.struct({
   name: t.String,
   services: t.list( Service )
}, 'Node');

// Creates a new node after checking incoming services
// for dependency issues. Services can be provided
// asyncronously as a promise and will be resolved before
// the resulting node is created
Node.create = t.typedFunc({
   inputs: [t.Object], // Object { name:String, services:Array < Service|Promise > }
   output: t.Promise,  // Promise < Node >
   fn: Bluebird.coroutine(function *nodeFactory (opts) {
      const services = yield opts.services;
      const resolved = {};
      const sorted = checkDeps(services, resolved);

      const nodeOpts = {
         services: sorted
      };

      return new Node( _.defaults(nodeOpts, opts) );
   })
});

// Starts all the services in a node in a new
// consul instance and returns a map of services
// and their respective processes, which can be
// used to create an ActiveNode
Node.start = t.typedFunc({
   inputs: [Node, Logger, Consul, t.Object],
   output: t.Promise, // Promise < ActiveNode.processes >
   fn: startNode
});
