const path = require('path');

module.exports = {
  entry: './src/doria.js',
  output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'doria.min.js'
  },
  module: {
      rules: [
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
        }
      ]
    }
};
