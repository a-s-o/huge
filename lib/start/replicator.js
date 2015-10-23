'use strict';

const argv = require('minimist')(process.argv.slice(2));
if (!argv.path) throw new Error(`Target path is not specified`);
if (!argv.replicas) throw new Error(`Number of replicas is not specified`);

const _ = require('lodash');
const cluster = require('cluster');

cluster.setupMaster({
   exec: argv.path,
   args: []
});

cluster.on('exit', (worker, code, signal) => {
   console.log('worker ' + worker.process.pid + ' died', code, signal);
});

_.times(Number(argv.replicas), () => cluster.fork());
