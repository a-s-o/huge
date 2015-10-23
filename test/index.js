'use strict';

const path = require('path');
const huge = require('../index.js');

const apps = [
   { packagePath: 'feed' },
   { packagePath: 'elasticsearch', port: 9000 },
   { packagePath: 'web', kube: { replicas: 2 } }
];

const cluster = huge.node.create({
   name: 'testNode',
   packageSource: path.resolve(__dirname, './mockPackages'),
   services: apps
});
