'use strict';

module.exports = function setup (config, inputs, output) {
   output(null, {
      FEED_SERVICE_HOST: 'localhost',
      FEED_SERVICE_PORT: 3200
   });
};
