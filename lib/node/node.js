'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');
const types = require('../../types');

const checkDependencies = require('./checkDependencies');

const Node = module.exports = t.struct({
   packages: t.list( types.Metadata )
});

Node.create = t.func([types.NodeSpec], Node).of(createNode);

function createNode (spec) {
   const basePath = spec.packageSource || process.cwd();
   const remoteDeps = _.get(spec, 'remote.dependencies', []);
   const resolved = _.reduce(remoteDeps, preResolve, {});
   const packages = checkDependencies(spec.services, basePath, resolved);
   console.log(packages);
   return new Node({ packages });
}

// Helpers

function preResolve (services, key) {
   services[key] = true;
   return services;
}
