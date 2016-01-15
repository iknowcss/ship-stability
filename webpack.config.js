const path = require('path');
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

const alias = {
  src: path.resolve('./src')
};

module.exports = [

  {
    output: {
      path: './dist',
      filename: 'index.html'
    }
  },

  // Capsize test worker
  {
    resolve: { alias },
    module: { loaders: [ es6Loader ] },
    output: {
      path: './dist',
      filename: 'capsize-test-worker.js'
    },
    entry: './src/js/fractal/capsize-test-worker.js'
  },

  // Phase JavaScript
  {
    resolve: { alias },
    module: { loaders: [ es6Loader, scssLoader ] },
    output: {
      path: './dist',
      filename: 'main-phase.js'
    },
    entry: './src/js/phase/main-phase.js',
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'phase.html',
        template: './src/js/phase/phase.html',
        inject: true,
        hot
      })
    ]
  },

  // Fractal JavaScript
  {
    resolve: { alias },
    module: { loaders: [ es6Loader, scssLoader ] },
    output: {
      path: './dist',
      filename: 'main-fractal.js'
    },
    entry: './src/js/fractal/main-fractal.js',
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'fractal.html',
        template: './src/js/fractal/fractal.html',
        inject: true,
        hot
      })
    ]
  }

];