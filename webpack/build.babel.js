
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin'

import config from './config.babel'

config.plugins.push(
  new webpack.optimize.DedupePlugin(),
  new ngAnnotatePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    mangle: false,
    comments: false,
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.jade',
  })
)

export default config
