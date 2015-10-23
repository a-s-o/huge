'use strict';

const path = require('path');
const huge = require('../');

const apps = [
   { packagePath: 'feed' },
   { packagePath: 'elasticsearch', port: 9000 },
   { packagePath: 'web', kube: { replicas: 2 } }
];

const node = huge.node.create({
   name: 'testNode',
   packageSource: path.resolve(__dirname, './mockPackages'),
   services: apps
});

huge.start(node);
