'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const types = require('../../types');

const checkDependencies = require('./checkDependencies');

const Node = module.exports = t.struct({
   name: t.String,
   packages: t.list( types.Metadata )
});

Node.create = t.func([types.NodeSpec], Node).of(createNode);

function createNode (spec) {
   const basePath = spec.packageSource || process.cwd();
   const remoteDeps = _.get(spec, 'remote.dependencies', []);
   const resolved = _.reduce(remoteDeps, preResolve, {});
   return new Node({
      name: spec.name,
      packages: checkDependencies(spec.services, basePath, resolved)
   });
}

// Helpers

function preResolve (services, key) {
   services[key] = true;
   return services;
}
