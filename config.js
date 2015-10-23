'use strict';
const path = require('path');

module.exports = {
   consul: {
      dir: path.resolve(__dirname, './consul_bin'),
      url: 'https://dl.bintray.com/mitchellh/consul/0.5.2_linux_amd64.zip',
      ui : 'https://dl.bintray.com/mitchellh/consul/0.5.2_web_ui.zip',

      host: 'localhost',
      port: 8500
   }
};
