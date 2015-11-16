'use strict';

const express = require('express');
const path = require('path');

const app = express();
const root = path.resolve(__dirname, '../..');
const resolve = function fromRoot () {
   const args = [].slice.call(arguments);
   return path.join.apply(path, [root].concat(args));
};

const inProduction = process.env.NODE_ENV === 'production';

/************************************************************
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 *   Sample endpoints to demo async data fetching:
 *     - POST /landing
 *     - POST /home
 *
 ************************************************************/

// Serve application file depending on environment
app.get('/app.js', function scripts (req, res) {
   if (inProduction) {
      res.sendFile( resolve('build/app.js') );
   } else {
      res.redirect('//localhost:9090/build/app.js');
   }
});

// Serve aggregate stylesheet depending on environment
app.get('/style.css', function styles (req, res) {
   if (inProduction) {
      res.sendFile( resolve('build/style.css') );
   } else {
      res.redirect('//localhost:9090/build/style.css');
   }
});

// Serve index page
app.get('*', function indexPage (req, res) {
   res.sendFile( resolve('build/index.html') );
});

app.post('/landing', function landingPage (req, res) {
   res.json({
      title: 'Landing Page'
   });
});

app.post('/home', function homePage (req, res) {
   res.json({
      title: 'Home Page'
   });
});

/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!inProduction) {
   const webpack = require('webpack');
   const WebpackDevServer = require('webpack-dev-server');
   const config = require( resolve('webpack.local.config') );

   new WebpackDevServer(webpack(config), {
      publicPath: config.output.publicPath,
      hot: true,
      noInfo: true,
      historyApiFallback: true
   }).listen(9090, 'localhost', (err) => {
      if (err) console.log(err);
   });
}


/******************
 *
 * Express server
 *
 *****************/

const port = process.env.PORT || 8080;
const server = app.listen(port, function started () {
   const addr = server.address();
   console.log('Essential React listening at http://%s:%s', addr.address, addr.port);
});
