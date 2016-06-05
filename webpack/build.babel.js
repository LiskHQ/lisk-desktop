
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin'

import config from './config.babel'

config.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.pug',
  }),
  new ngAnnotatePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    mangle: false,
    comments: false,
  })
)

export default config
