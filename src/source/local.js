'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const path = require('path');

const Service = require('../Service');

const getLocal = t.typedFunc({
   inputs: [t.String, t.Object],
   outputs: Service,
   fn: function getLocal (localPath, opts) {
      const json = findPackageJSON(localPath);
      const dir = path.dirname(json);
      const pkg = require(json);

      const srvOpts = {
         name: opts.name || pkg.name,
         inputs: _.get(pkg, 'huge.inputs'),
         outputs: _.get(pkg, 'huge.outputs'),
         compare: compareServices,
         paths: {
            dir: dir,
            package: json,
            main: path.join(dir, pkg.main || 'index.js')
         }
      };

      return Service.create( _.defaults(srvOpts, opts) );
   }
});

module.exports = (localPath, opts) => getLocal(localPath, opts || {});

function findPackageJSON (localPath) {
   // First try the base prefix; so packages specified by path
   // are selected before others (i.e. before node_modules)
   const base = process.cwd();
   const jsonPath = path.join(localPath, 'package.json');
   try {
      const baseDirPath = path.resolve(base, jsonPath);
      require(baseDirPath);
      return baseDirPath;
   } catch (err) {
      if (err.code !== 'ENOENT') throw err;
   }

   // Package not found in base, so try a simple required
   // by name; in case the package is in node_modules
   try {
      require(jsonPath);
      return jsonPath;
   } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      throw new Error(`Unable to resolve [${jsonPath}]`);
   }
}

function compareServices (a, b) {
   const pkgA = require(a.paths.package);
   const pkgB = require(b.paths.package);
   return pkgA.name === pkgB.name && pkgA.version === pkgB.version;
}
