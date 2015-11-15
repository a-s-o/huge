'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const loaders = require('./webpack.loaders.js');

/**
 * This is the Karma configuration file. It contains information about this skeleton
 * that provides the test runner with instructions on how to run the tests and
 * generate the code coverage report.
 *
 * For more info, see: http://karma-runner.github.io/0.12/config/
 * configuration-file.html
 */
module.exports = (config) => {
   config.set({

      /**
       * These are the files required to run the tests.
       *
       * The `Function.prototype.bind` polyfill is required by PhantomJS
       * because it uses an older version of JavaScript.
       */
      files: [
         './src/tests/polyfill.js',
         './src/**/tests/index.js'
      ],

      /**
       * The actual tests are preprocessed by the karma-webpack plugin, so that
       * their source can be properly transpiled.
       */
      preprocessors: {
         './src/**/tests/index.js': ['webpack']
      },

      /**
       * We want to run the tests using the PhantomJS headless browser.
       * This is especially useful for continuous integration.
       */
      browsers: ['PhantomJS'],

      /**
       * Use Mocha as the test framework, Sinon for mocking, and
       * Chai for assertions.
       */
      frameworks: ['mocha', 'sinon-chai'],

      /**
       * After running the tests, return the results and generate a
       * code coverage report.
       */
      reporters: ['progress', 'coverage'],

      /**
       * When generating a code coverage report, use `lcov` format and
       * place the result in coverage/lcov.info
       *
       * This file will be sent to Coveralls by the `coveralls` npm script.
       */
      coverageReporter: {
         dir: 'coverage/',
         reporters: [
            { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
            { type: 'html', subdir: 'html' }
         ]
      },

      /**
       * The configuration for the karma-webpack plugin.
       *
       * This is very similar to the main webpack.local.config.js, with the
       * exception of specifying an istanbul-transformer post loader so
       * that we can generate an accurate code coverage report.
       */
      webpack: {
         plugins: [
            new ExtractTextPlugin('style.css', { allChunks: true })
         ],
         module: {
            loaders: [
               loaders.jsx,
               loaders.css
            ],
            postLoaders: [{
               test: /\.jsx?$/,
               exclude: /(test|node_modules)\//,
               loader: 'istanbul-instrumenter'
            }]
         },
         resolve: {
            extensions: ['', '.js', '.jsx', '.css']
         }
      },

      /**
       * Configuration option to turn off verbose logging of webpack compilation.
       */
      webpackMiddleware: {
         noInfo: true
      },

      /**
       * Once the mocha test suite returns, we want to
       * exit from the test runner as well.
       */
      singleRun: true,

      /**
       * List of plugins
       */
      plugins: [
         'karma-mocha',
         'karma-webpack',
         'karma-coverage',
         'karma-sinon-chai',
         'karma-phantomjs-launcher'
      ]
   });
};
