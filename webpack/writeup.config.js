const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (config) {
  return {
    resolve: { alias: config.alias },

    // Paths relative to root
    entry: './src/writeup/main.js',
    output: {
      path: './dist',
      filename: 'writeup.main.js'
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/writeup/index.html',
        inject: true,
        hot: true
      })
    ]
  }
}