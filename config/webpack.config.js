module.exports = {
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {},
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-3'],
          plugins: ['syntax-trailing-function-commas'],
          env: {
            test: {
              plugins: ['istanbul'],
            },
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png)$/,
        loader: 'url-loader',
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
      },
    ],
  },
};
