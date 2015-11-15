'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.jsx = {
   test: /\.jsx?$/,
   exclude: /node_modules/,
   loader: 'babel-loader?stage=0'
};

exports.jsxHot = {
   test: /\.jsx?$/,
   exclude: /node_modules/,
   loaders: ['react-hot', 'babel-loader?stage=0']
};

exports.css = {
   test: /\.css$/,
   loader: ExtractTextPlugin.extract('style-loader', [
      'css-loader' +
         '?modules' +
         '&importLoaders=1' +
         '&localIdentName=[name]__[local]___[hash:base64:5]' +
      '!postcss-loader'
   ].join(''))
};
