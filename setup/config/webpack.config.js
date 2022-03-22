const webpack = require('webpack');
const { resolve } = require('path');

const config = {
  mode: 'development',
  resolve: {
    alias: {
      '@scripts(.*)$': resolve(__dirname, './scripts'),
      '@setup(.*)$': resolve(__dirname, './setup'),
      '@tests(.*)$': resolve(__dirname, './tests'),
      '@packages(.*)$': resolve(__dirname, './packages'),
      '@block(.*)$': resolve(__dirname, './packages/block'),
      '@bookmark(.*)$': resolve(__dirname, './packages/bookmark'),
      '@common(.*)$': resolve(__dirname, './packages/common'),
      '@dpos(.*)$': resolve(__dirname, './packages/dpos'),
      '@hardwareWallet(.*)$': resolve(__dirname, './packages/hardwareWallet'),
      '@network(.*)$': resolve(__dirname, './packages/network'),
      '@settings(.*)$': resolve(__dirname, './packages/settings'),
      '@token(.*)$': resolve(__dirname, './packages/token'),
      '@transaction(.*)$': resolve(__dirname, './packages/transaction'),
      '@updates(.*)$': resolve(__dirname, './packages/updates'),
      '@views(.*)$': resolve(__dirname, './packages/views'),
      '@wallet(.*)$': resolve(__dirname, './packages/wallet'),
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
