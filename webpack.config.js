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

  require('./webpack/writeup.config')(config),

  // // Capsize test worker
  // {
  //   resolve: { alias: config.alias },
  //   module: { loaders: [ es6Loader ] },
  //   output: {
  //     path: './dist',
  //     filename: 'capsize-test-worker.js'
  //   },
  //   entry: './src/js/fractal/capsize-test-worker.js'
  // },

  // // Phase JavaScript
  // {
  //   resolve: { alias: config.alias },
  //   module: { loaders: [ es6Loader, lessLoader ] },
  //   output: {
  //     path: './dist',
  //     filename: 'main-phase.js'
  //   },
  //   entry: './src/js/phase/main-phase.js',
  //   plugins: [
  //     new HtmlWebpackPlugin({
  //       filename: 'phase.html',
  //       template: './src/js/phase/phase.html',
  //       inject: true,
  //       hot
  //     })
  //   ]
  // },

  // // Fractal JavaScript
  // {
  //   resolve: { alias: config.alias },
  //   module: { loaders: [ es6Loader, lessLoader ] },
  //   output: {
  //     path: './dist',
  //     filename: 'main-fractal.js'
  //   },
  //   entry: './src/js/fractal/main-fractal.js',
  //   plugins: [
  //     new HtmlWebpackPlugin({
  //       filename: 'fractal.html',
  //       template: './src/js/fractal/fractal.html',
  //       inject: true,
  //       hot
  //     })
  //   ]
  // },

  // // GLSL
  // {
  //   resolve: { alias: config.alias },
  //   module: { loaders: [ glslLoader, es6Loader, lessLoader ] },
  //   output: {
  //     path: './dist',
  //     filename: 'main-glsl.js'
  //   },
  //   entry: './src/js/glsl/main.js',
  //   plugins: [
  //     new HtmlWebpackPlugin({
  //       filename: 'glsl.html',
  //       template: './src/js/glsl/index.html',
  //       inject: true,
  //       hot
  //     })
  //   ]
  // },

];