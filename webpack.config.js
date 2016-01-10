const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const extend = require('lodash/object/extend');
const hot = process.env.HOT === 'true';

const es6Loader = {
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'babel'
};

const scssLoader = {
  test: /\.scss$/,
  loaders: ['style', 'css', 'sass']
};

module.exports = [

  // Capsize test worker
  {
    module: { loaders: [ es6Loader ] },
    output: {
      path: './dist',
      filename: 'capsize-test-worker.js'
    },
    entry: './src/js/capsize-test-worker.js'
  },

  // Phase JavaScript
  {
    module: { loaders: [ es6Loader, scssLoader ] },
    output: {
      path: './dist',
      filename: 'main-phase.js'
    },
    entry: './src/js/main-phase.js',
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'phase.html',
        template: './src/html/phase.html',
        inject: true,
        hot
      })
    ]
  },

  // Fractal JavaScript
  {
    module: { loaders: [ es6Loader, scssLoader ] },
    output: {
      path: './dist',
      filename: 'main-fractal.js'
    },
    entry: './src/js/main-fractal.js',
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'fractal.html',
        template: './src/html/fractal.html',
        inject: true,
        hot
      })
    ]
  }

];