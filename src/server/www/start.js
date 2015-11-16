'use strict';

const express = require('express');

const app = express();

app.get('*', function indexPage (req, res) {
   res.json({ title: 'Hello - how are you?' });
});

const server = app.listen(3000, function started () {
   const addr = server.address();
   console.log('listening at http://%s:%s', addr.address, addr.port);
});
