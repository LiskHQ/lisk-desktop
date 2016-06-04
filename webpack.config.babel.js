
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin'

export default {
  entry: "./src/index.js",
  output: {
    path: './dist',
    filename: "app.[hash].js"
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
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/view/index.pug',
      minify: {
        minifyCSS: true,
      }
    }),
    new ngAnnotatePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      comments: false,
    })
  ]
}
