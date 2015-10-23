'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');

const launchApplication = require('./launchApplication');

function launch (cluster, app) {
   const opts = _.get(app, 'config.huge', {});

   cluster.emit('appStarting', app);

   const timeout = opts.timeout || cluster.timeout;

   return launchApplication(cluster, app, timeout)
      .then((provided) => {
         // Check each expected output
         _.each(app.provides, (name) => {
            cluster.services[name] = provided[name];
            cluster.emit('serviceProvided', name, provided[name]);
         });

         cluster.emit('appStarted', app);
         return app;
      });
}

module.exports = function startApps (cluster, packages) {
   cluster.apps = [];
   cluster.services = {};

   return Bluebird.reduce(packages, function next (apps, pkg) {
      return launch(cluster, pkg).then(app => {
         if (!_.contains(apps, app)) apps.push(app);
         return apps;
      });
   }, cluster.apps);
};
