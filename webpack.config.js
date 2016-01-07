const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const hot = process.env.HOT === 'true';
const plugins = [
  new HtmlWebpackPlugin({
    filename: 'phase.html',
    template: './src/html/phase.html',
    inject: true,
    hot: hot
  })
];

module.exports = [

  // rk4 library
  // {
  //   output: {
  //     library: 'rk4',
  //     libraryTarget: 'umd',
  //     path: './dist',
  //     filename: 'rk4.js'
  //   },
  //   entry: {
  //     library: './src/js/rk4.js'
  //   }
  // },

  // Phase JavaScript
  {
    output: {
      path: './dist',
      filename: 'main-phase.js'
    },
    entry: './src/js/main-phase.js',
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass']
        }
      ]
    },
    plugins: plugins
  }
];