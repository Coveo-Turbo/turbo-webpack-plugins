const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const plugins = [
  new CleanWebpackPlugin()
]

const entries = {
  'index': [path.join(__dirname, 'src/index.js')],
  'index.min': [path.join(__dirname, 'src/index.js')]
};

module.exports = {
  mode: 'production',
  entry: entries,
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
  },
  plugins: plugins,
  optimization: {
    minimizer: [
      new TerserJSPlugin({ test: /\.min\.js$/i })
    ]
  }
};
