'use strict';

const cfg = require('../config.js');

module.exports = require('consul')({
   host: cfg.consul.host,
   port: cfg.consul.port
});
