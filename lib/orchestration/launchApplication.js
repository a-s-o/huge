'use strict';

const _ = require('lodash');
const path = require('path');
const Monitor = require('forever-monitor').Monitor;
const Bluebird = require('bluebird');

function startProcesses (packagePath, replicas, inputs) {
   const clusterMode = replicas > 1;

   if (!clusterMode) {
      return new Monitor(packagePath, {
         cwd: packagePath,
         env: inputs
      });
   }

   return new Monitor('./replicator.js', {
      cwd: packagePath,
      env: inputs,
      args: [
         '--path', packagePath,
         '--replicas', replicas
      ]
   });
}

const start = Bluebird.coroutine(function *start (cluster, app) {
   const inputs = _.reduce(app.consumes, copyInputs, {}, cluster);
   const replicas = _.parseInt(_.get(app, 'config.huge.replicas')) || 0;
   app.monitor = startProcesses(app.packagePath, replicas, inputs);


});

module.exports = function withTimeout (cluster, app, time) {
   return start(cluster, app).timeout(time, failedToRegisterError(time, app));
};

function copyInputs (obj, dep) {
   obj[dep] = this.services[dep];
   return obj;
}

function failedToProvideError (name, app) {
   return new Error(`
      The following app failed to provide output "${name}":

      Name:    ${app.name}
      Path:    ${app.packagePath}

   `);
}

function failedToRegisterError (time, app) {
   return `
      The following app timed out during startup and did not
      trigger the output function from setup (waited ${time} seconds)

      Name:    ${app.name}
      Path:    ${app.packagePath}

      -------------------------------------------------

      Tip: If the app needs more setup time, a longer timeout (in seconds)
      can be provided in the kube manifest. Ex:

      { packagePath: ..., kube: { timeout: 60 } }

   `;
}
