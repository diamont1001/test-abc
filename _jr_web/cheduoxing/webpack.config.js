'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    home: './app/view/pages/home/index.js',
    article: './app/view/pages/article/index.js',
    articlelist: './app/view/pages/articlelist/index.js',
    contact: './app/view/pages/about/contact/index.js',
  },
  output: {
    path: path.resolve(__dirname, './app/public/bundle/'),
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js?[hash:8]',
  },
  mode: 'development', // production
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css?[hash:8]',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
          name: '[path][name].[ext]?[hash:8]',
          limit: 8192, // inline base64 URLs for <=8k images, direct URLs for the rest
        },
      },
    ],
  },
  resolve: {
    extensions: [ '.js', '.json', '.ejs' ],
  },
};
