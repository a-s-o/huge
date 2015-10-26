'use strict';

const client = require('../../client');



module.exports = function setup (config, inputs, output) {
   output(null, {
      ELASTICSEARCH_SERVICE_HOST: 'localhost',
      ELASTICSEARCH_SERVICE_PORT: config.port
   });
};
