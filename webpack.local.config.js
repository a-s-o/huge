'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const loaders = require('./webpack.loaders.js');

/**
 * This is the Webpack configuration file for local development. It contains
 * local-specific configuration such as the React Hot Loader, as well as:
 *
 * - The entry point of the application
 * - Where the output file should be
 * - Which loaders to use on what files to properly transpile the source
 *
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */
module.exports = {

   // Efficiently evaluate modules with source maps
   devtool: 'eval',

   // Set entry point to ./src/main and include necessary files for hot load
   entry:  [
      'webpack-dev-server/client?http://localhost:9090',
      'webpack/hot/only-dev-server',
      './src/app/main'
   ],

   // This will not actually create a bundle.js file in ./build. It is used
   // by the dev server for dynamic hot loading.
   output: {
      path: __dirname + '/build/',
      filename: 'app.js',
      publicPath: 'http://localhost:9090/build/'
   },

   // Necessary plugins for hot load
   plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin('style.css', { allChunks: true })
   ],

   // Transform source code using Babel and React Hot Loader
   module: {
      loaders: [
         loaders.jsxHot,
         loaders.css
      ]
   },

   // Automatically transform files with these extensions
   resolve: {
      extensions: ['', '.js', '.jsx', '.css']
   },

   // Additional plugins for CSS post processing using postcss-loader
   postcss: [
      require('autoprefixer'), // Automatically include vendor prefixes
      require('postcss-nested') // Enable nested rules, like in Sass
   ]

};
