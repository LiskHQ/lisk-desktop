
import HtmlWebpackPlugin from 'html-webpack-plugin'

import config from './config.babel'

config.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.jade',
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
    }
  })
)

export default config
