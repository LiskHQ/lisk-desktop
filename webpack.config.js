
module.exports = {
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
        loader: 'style!css!less'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.pug$/,
        loader: 'pug-html-loader'
      },
    ]
  }
}
