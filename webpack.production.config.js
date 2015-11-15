'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const loaders = require('./webpack.loaders.js');

/**
 * This is the Webpack configuration file for production.
 */
module.exports = {
   entry: './src/app/main',

   output: {
      path: __dirname + '/build/',
      filename: 'app.js'
   },

   plugins: [
      new ExtractTextPlugin('style.css', { allChunks: true })
   ],

   module: {
      loaders: [
         loaders.jsx,
         loaders.css
      ]
   },

   resolve: {
      extensions: ['', '.js', '.jsx', '.css']
   },

   postcss: [
      require('autoprefixer'),
      require('postcss-nested')
   ]
};
