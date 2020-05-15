var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
      {
        test: /\.(png|svg|jpg|gif|wav)$/,
        use: ['file-loader'],
      },
    ],
  },
  stats: {
    colors: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  watchOptions: {
    poll: 1000,
    ignored: ['node_modules'],
  },
};
