var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'src');

module.exports = {
    entry: {
      app: path.resolve(ROOT_PATH, 'index.jsx')
    },
    output: {
      path: BUILD_PATH,
      filename: '[name].js'
    },
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true
    },
    //babel重要的loader在这里
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        include: ROOT_PATH
      }, {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }, {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }]
    },
    plugins: [
      new HtmlwebpackPlugin({
        title: 'My first react app'
      })
    ]
  }
  // http://localhost:8080/