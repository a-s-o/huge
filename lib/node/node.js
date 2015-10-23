'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const types = require('../../types');

const serviceDiscovery = require('../consul');
const checkDependencies = require('./checkDependencies');

const Node = module.exports = t.struct({
   name: t.String,
   packages: t.list( types.Metadata )
});

Node.create = t.func([types.NodeSpec], Node).of(createNode);
Node.start = t.func([Node, types.StartOptions], t.Any).of(startNode);

function createNode (spec) {
   const basePath = spec.packageSource || process.cwd();
   const remoteDeps = _.get(spec, 'remote.dependencies', []);
   const resolved = _.reduce(remoteDeps, preResolve, {});
   return new Node({
      name: spec.name,
      packages: checkDependencies(spec.services, basePath, resolved)
   });
}

function startNode (node, opts) {
   const consulMonitor = serviceDiscovery.start(node, opts);
   console.log(consulMonitor);
}

// Helpers

function preResolve (services, key) {
   services[key] = true;
   return services;
}
