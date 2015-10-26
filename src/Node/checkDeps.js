'use strict';

const _ = require('lodash');

// return new types.Metadata({
//    name        : appName,
//    packagePath : appPath,
//    consumes    : packageDeps.inputs || [],
//    provides    : packageDeps.outputs || [],
//    config      : config,
//    checked     : true
// });

function copyApps (apps, service, index) {
   apps.push({
      packagePath: service.paths.dir,
      provides: _.clone(service.outputs),
      consumes: _.clone(service.inputs),
      i: index
   });
   return apps;
}

function checkDependencies (services, resolved) {
   const apps = _.reduce(services, copyApps, []);

   let changed = true;
   const sorted = [];

   // Iterator - to check one app's dependencies
   function checkIt (it) {
      const consumes = it.consumes.concat();

      // Loop over each service that this app consumes
      // and check if all are resolved
      let resolvedAll = true;
      for (let i = 0; i < consumes.length; i++) {
         const service = consumes[i];
         if (!resolved[service]) {
            resolvedAll = false;
         } else {
            it.consumes.splice(it.consumes.indexOf(service), 1);
         }
      }

      // All inputs are not yet resolved; so stop the iterator;
      // deal when this app on the next (while) loop iteration
      if (!resolvedAll) return;

      // Services resolved so remove this app from the apps array
      apps.splice(apps.indexOf(it), 1);
      it.provides.forEach((service) => {
         resolved[service] = true;
      });

      // Add the app in sorted order so
      // orchestration happens in the
      // correct order
      sorted.push( services[it.i] );

      // Allow the next loop
      changed = true;
   }

   // Iterate over the apps
   while (apps.length && changed) {
      changed = false;
      apps.concat().forEach(checkIt);
   }

   // If the above loop finished without resolving all
   // dependencies, means the iterator short-circuited
   // due to missing services; show those errors
   if (apps.length) {
      throw new Error( unresolvedError(apps, resolved) );
   }

   return sorted;
}

function stringifyIndent (input) {
   const str = JSON.stringify(input, null, 2);
   return str.replace(/\n/g, '\n' + _.repeat(' ', 6));
}

function unresolvedError (remainingApps, resolvedServices) {
   const unresolved = {};
   remainingApps.forEach((app) => {
      delete app.config;
      app.consumes.forEach((name) => {
         if (unresolved[name] === false) return;
         if (!unresolved[name]) unresolved[name] = [];
         unresolved[name].push(app.packagePath);
      });
      app.provides.forEach((name) => {
         unresolved[name] = false;
      });
   });

   Object.keys(unresolved).forEach((name) => {
      if (unresolved[name] === false) delete unresolved[name];
   });

   return `

   Could not resolve dependencies of these services:
   ${stringifyIndent(_.map(remainingApps, 'packagePath'))}

   -------------------------------------------------

   Missing inputs:
   ${stringifyIndent(unresolved)}

   -------------------------------------------------

   Resolved inputs:
   ${stringifyIndent(_.sortBy(_.keys(resolvedServices), _.identity))}

   `;
}

module.exports = function resolveDeps (services, preResolved) {
   const checked = checkDependencies(services, preResolved || {});
   return _.uniq( checked );
};
