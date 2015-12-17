var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/main',
    'webpack-dev-server/client?http://localhost:8080'
  ],
  output: {
    publicPath: '/',
    filename: 'main.js'
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
    ]
  },
  devServer: {
    contentBase: "./src"
  }
};
