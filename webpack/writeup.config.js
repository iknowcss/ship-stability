const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (config) {
  const jsxLoader = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      presets: ['react', 'es2015']
    }
  }

  const lessLoader = {
      test: /\.less$/,
      loaders: ['style', 'css', 'less']
  }

  return {
    resolve: { alias: config.alias },
    module: { loaders: [ jsxLoader, lessLoader ] },

    // Paths relative to root
    entry: './src/writeup/main.js',
    output: {
      path: './dist',
      filename: 'writeup.main.js'
    },

    plugins: [
      new UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/writeup/index.html',
        inject: true,
        hot: true
      })
    ]
  }
}