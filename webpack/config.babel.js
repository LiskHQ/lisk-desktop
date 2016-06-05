
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
        test: /\.jade$/,
        loader: 'jade',
      },
      {
        test: /\.png$/,
        loader: 'url',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ]
  },
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: ['', '.js', '.jade', '.less'],
  },
  externals: {
    jquery: 'jQuery',
    angular: 'angular',
  },
  plugins: []
}
