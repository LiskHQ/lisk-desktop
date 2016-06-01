
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style", "css!less"),
      },
      {
        test: /\.pug$/,
        loader: 'pug-html-loader?pretty',
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
  plugins: [
    new ExtractTextPlugin("app.css"),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/view/index.pug',
    })
  ]
}
