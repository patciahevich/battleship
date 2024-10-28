import path from "path";
import EslintPlugin from "eslint-webpack-plugin";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  mode: "production",
  entry: "./dev/server.ts",
  target: "node",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      stream: "stream-browserify",
      http: "stream-http",
      path: "path-browserify",
      os: "os-browserify/browser.js",
      crypto: "crypto-browserify",
      url: "url",
      buffer: "buffer",
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [new EslintPlugin({ 
    context: path.resolve(__dirname, '../'),
    extensions: "ts" ,
    overrideConfigFile: path.resolve(__dirname, './.eslint.config.js'),
  })],
};

export default config;