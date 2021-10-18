const webpack = require('webpack');
const { resolve } = require('path');

const config = {
  mode: 'development',
  resolve: {
    alias: {
      '@utils': resolve(__dirname, '../src/utils'),
      '@api': resolve(__dirname, '../src/utils/api/'),
      '@constants': resolve(__dirname, '../src/constants'),
      '@shared': resolve(__dirname, '../src/components/shared'),
      '@screens': resolve(__dirname, '../src/components/screens'),
      '@toolbox': resolve(__dirname, '../src/components/toolbox'),
      '@actions': resolve(__dirname, '../src/store/actions'),
      '@store': resolve(__dirname, '../src/store'),
      '@src': resolve(__dirname, '../src'),
    },
    fallback: {
      net: false,
      fs: false,
      os: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
    },
  },
  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb',
    bufferutil: 'bufferutil',
    'utf-8-validate': 'utf-8-validate',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        resolve: {
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
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NACL_FAST: 'disable',
    }),
  ],
};

module.exports = config;
