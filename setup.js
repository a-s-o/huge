'use strict';

const Download = require('download');
const path = require('path');

const cfg = require('./config.js');
const url = cfg.consul.url;
const dir = cfg.consul.dir;

console.log('Downloading Consul...');

new Download({ mode: 755, extract: true })
   .get(url)
   .dest(dir)
   .run((err) => {
      if (err) throw err;
      console.log(`Consul downloaded to [${dir}]`);

      new Download({ extract: true, strip: 1 })
         .get(cfg.consul.ui)
         .dest(path.join(dir, 'ui'))
         .run((errr) => {
            if (errr) throw errr;
            console.log(`Consul-UI downloaded to [${dir}/ui]`);
         });
   });
