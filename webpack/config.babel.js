
import pkg from '../package.json'

export default {
  entry: './src/index.js',
  output: {
    path: './build',
    filename: `lisk_nano-v${pkg.version}-[hash].js`,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.less$/,
        loader: 'style!css!less',
      },
      {
        test: /\.pug$/,
        loader: 'pug-html?pretty',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.pug', '.less'],
  },
  externals: {
    jquery: 'jQuery',
    angular: 'angular',
  },
  plugins: []
}
