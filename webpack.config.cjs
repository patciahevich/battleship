const path = require('path');
const EslintPlugin = require("eslint-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './dev/server.ts',
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    fallback: {
      vm: require.resolve("vm-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
      url: require.resolve("url/"),
      buffer: require.resolve("buffer/"),
    },
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
  },
  plugins: [new EslintPlugin({ extensions: "ts" })],
};
