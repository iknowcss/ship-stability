const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
      loaders: ['style', 'css', 'postcss', 'less']
  }

  return {
    devServer: {
      // This is required for webpack-dev-server. The path should
      // be an absolute path to your build destination.
      outputPath: './dist'
    },

    resolve: { alias: config.alias },
    module: { loaders: [ jsxLoader, lessLoader ] },

    // Paths relative to root
    entry: './src/writeup/main.js',
    output: {
      path: './dist',
      filename: 'writeup.main.js'
    },

    plugins: [
      new CopyWebpackPlugin([
        {from: 'src/js/util/rk4.js', to: 'rk4.js'}
      ]),
      //new UglifyJsPlugin({
      //  compress: {
      //    warnings: false
      //  }
      //}),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/writeup/index.html',
        inject: true,
        hot: true
      })
    ]
  }
}