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
          presets: [
            ['env', {
              targets: {
                browsers: ['last 2 versions', 'safari >= 7'],
              },
            }],
            'react',
            'stage-3'],
          plugins: ['syntax-trailing-function-commas', 'import-glob', 'transform-decorators-legacy'],
          env: {
            test: {
              plugins: ['istanbul'],
            },
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: [/images/],
        options: {
          name: '[path][name].[ext]',
        },
        loader: 'file-loader',
      },
      {
        test: /\.(png|svg)$/,
        exclude: [/fonts/],
        loader: 'url-loader',
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
      },
    ],
  },
};
