'use strict';

const path = require('path');
const huge = require('../src/huge.js');

function local (pkg, opts) {
   const pkgPath = path.resolve(__dirname, path.join('mockPackages', pkg));
   return huge.source.local(pkgPath, opts);
}

const apps = [
   local('./feed'),
   local('./elasticsearch', { port: 9000 }),
   local('./web', { instances: 2 })
];

const testNode = {
   name: 'testNode',
   packageSource: path.resolve(__dirname, './mockPackages'),
   services: apps
};

huge.node.create(testNode)
   .then((node) => huge.node.start(node))
   .then((activeNode) => console.log(activeNode));
