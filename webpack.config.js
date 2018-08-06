const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'doria.js',
      library: 'doria',
      libraryTarget: 'umd'
  },
  module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            "sass-loader"
          ]
        },
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, "src")
          ],
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: true,
              collapseWhitespace: true,
              collapseInlineTagWhitespace: true,
            }
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "[name].css",
          chunkFilename: "[id].css"
      })
    ]
};
