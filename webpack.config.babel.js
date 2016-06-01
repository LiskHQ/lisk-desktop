
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default {
  entry: './src/js/index.js',
  output: {
    path: './build',
    filename: 'app.js',
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
        loader: ExtractTextPlugin.extract("style", "css?minimize!less"),
      },
      {
        test: /\.pug$/,
        loader: 'pug-html-loader',
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
    new ExtractTextPlugin("style.css"),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.pug',
      minify: false,
    })
  ]
}
