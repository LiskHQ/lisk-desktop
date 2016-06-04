
import webpack from 'webpack'
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin'

import config from './config.babel'

config.plugins.push(
  new ngAnnotatePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    mangle: false,
    comments: false,
  })
)

export default config
