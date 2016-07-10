const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const extend = require('lodash/extend');
const hot = process.env.HOT === 'true';

const es6Loader = {
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'babel'
};

const lessLoader = {
  test: /\.less$/,
  loaders: ['style', 'css', 'less']
};

const glslLoader = {
  test: /\.glsl$/,
  loaders: ['raw']
};

const config = {
  alias: {
    src: path.resolve('./src')
  }
}

module.exports = [

  require('./webpack/writeup.config')(config)

];