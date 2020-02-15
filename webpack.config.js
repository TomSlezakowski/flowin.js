// Webpack uses this to work with directories
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/flowin/'),
    filename: 'index.js',
    library: 'Flowin',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ['node_modules/**', 'examples/**']
  }
};
