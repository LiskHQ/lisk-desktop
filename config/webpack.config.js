const { resolve } = require('path');
const webpack = require('webpack'); // eslint-disable-line

module.exports = {
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb',
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
        resolve: {
          alias: {
            Utils: resolve(__dirname, '../src/utils/api/'),
          },
          extensions: ['.js'],
        },
        options: {
          presets: [
            [
              '@babel/preset-env', {
                modules: false,
                targets: {
                  browsers: ['last 2 versions', 'safari >= 7'],
                },
              }],
            '@babel/preset-react',
          ],
          plugins: [
            'syntax-trailing-function-commas',
            'import-glob',
            [
              '@babel/plugin-transform-runtime',
              {
                helpers: false,
                regenerator: true,
              },
            ],
          ],
          env: {
            test: {
              plugins: ['istanbul'],
            },
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        exclude: [/images/],
        options: {
          name: '[path][name]-[hash:6].[ext]',
        },
        loader: 'file-loader',
      },
      {
        test: /\.(png|svg)$/,
        exclude: [/fonts/],
        loader: 'url-loader',
      },
    ],
  },
  optimization: {
    namedChunks: true,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
        },
        head: {
          name: 'head',
          priority: 1,
          test: /styles\.head\.css$/,
        },
        styles: {
          name: 'styles',
          priority: 2,
          test: /^((?!styles\.head).)*\.css$/,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NACL_FAST: 'disable',
    }),
  ],
};
